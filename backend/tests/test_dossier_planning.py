"""Preparation pass and generated-issue append contract."""
from __future__ import annotations

import asyncio
import json
from dataclasses import replace
from unittest.mock import Mock

import pytest

from app.models.api import ChatRequest
from app.providers.base import ProviderReply
from app.services.dossier_requests import DossierRequestService, parse_dossier_plan

MATTER = "MAT-DEMO-RELAY"


class PlanProvider:
    """Returns controlled preparation prose plus a dossier-plan block."""

    def __init__(self, plan: dict | None, *, prose: str = "Preparation prose.", raw: str | None = None):
        self.plan = plan
        self.prose = prose
        self.raw = raw
        self.calls = 0
        self.tools_seen: list = []

    async def complete(self, messages, tools=None):
        self.calls += 1
        self.tools_seen.append(tools)
        if self.raw is not None:
            return ProviderReply(content=self.raw)
        block = ""
        if self.plan is not None:
            block = "\n\n```dossier-plan\n" + json.dumps(self.plan) + "\n```"
        return ProviderReply(content=self.prose + block)


def _service_with(app_context, monkeypatch, provider) -> DossierRequestService:
    resolved = replace(app_context.runner.resolve("counsel-copilot"), provider=provider)
    monkeypatch.setattr(app_context.runner, "resolve", Mock(return_value=resolved))
    return DossierRequestService(app_context)


def _payload(**kw) -> ChatRequest:
    base = dict(message="Generate a dossier", matter_id=MATTER, conversation_id="CONV-1", source_action_key="ACT-1")
    base.update(kw)
    return ChatRequest(**base)


def _issue_ids(app_context):
    return [i["issue_id"] for i in app_context.workspace.issues(MATTER)]


def _full_plan(app_context):
    ids = _issue_ids(app_context)
    return {
        "issue_map": [
            {"issue_id": ids[0], "why_it_matters": "consent", "initial_answer": "Show scope and expiry.", "next_action": "Confirm institutions", "focused_topic": "open banking consent"},
            {"issue_id": ids[1], "why_it_matters": "migration", "initial_answer": "New affirmative choice likely required.", "focused_topic": "reauth migration"},
            {"issue_id": ids[2], "why_it_matters": "purpose", "initial_answer": "Limit to product need.", "focused_topic": "purpose limitation"},
            {"candidate_key": "c-new", "title": "Vendor data breach notice window", "why_it_matters": "contract gap", "initial_answer": "Depends on the aggregator contract terms.", "focused_topic": "breach notice"},
        ],
        "priorities": [
            {"key": "p1", "text": "Ship compliant consent", "why": "core", "issue_ids": [ids[0]]},
            {"key": "p2", "text": "Migrate safely", "why": "risk", "issue_ids": [ids[1]]},
            {"key": "p3", "text": "Contain data use", "why": "trust", "issue_ids": [ids[2]]},
        ],
        "first_issue_ids": [ids[0], ids[1], ids[2]],
        "overall_topic": "open banking data use",
        "date_candidates": [{"role": "matter administration due date", "value": "2026-09-15", "source_reference_id": "matter.target_date", "note": "admin"}],
        "conflicts": [],
    }


def test_parse_dossier_plan_tolerant():
    plan, prose, warnings = parse_dossier_plan("Hello\n\n```dossier-plan\n{\"a\": 1}\n```")
    assert plan == {"a": 1}
    assert prose == "Hello"
    assert warnings == []

    plan, prose, warnings = parse_dossier_plan("Useful prose\n\n```dossier-plan\n{not json}\n```")
    assert plan is None
    assert "Useful prose" in prose
    assert warnings and "malformed" in warnings[0]


def test_prepare_builds_priorities_and_initial_answers(app_context, monkeypatch):
    provider = PlanProvider(_full_plan(app_context))
    service = _service_with(app_context, monkeypatch, provider)
    result = asyncio.run(service.prepare(_payload()))

    # A complete first answer needs no extra call. Only frozen-record reads are offered.
    assert provider.calls == 1
    assert [[tool["function"]["name"] for tool in batch] for batch in provider.tools_seen] == [["read_dossier_record"]]

    assert result["state"] == "awaiting_choices"
    assert len(result["priorities"]) == 3
    mapped = [p["issue_ids"][0] for p in result["priorities"]]
    assert len(set(mapped)) == 3, "three priorities map to three distinct issues"
    assert len(result["first_issue_ids"]) == 3

    # Every existing issue is represented as a row.
    assert len(result["issues"]) == len(_issue_ids(app_context))

    record = service.get_record(MATTER, result["request_id"])
    for issue_id, entry in record["metadata"]["issues"].items():
        assert entry["initial_answer"].strip()
        assert entry["initial_answer"].lower() not in {"needs research", "tbd"}
    # A missing material issue is proposed as a candidate, not silently dropped.
    assert any(c["candidate_key"] == "c-new" for c in record["metadata"]["new_issue_candidates"])


def test_prepare_malformed_plan_falls_back_to_existing_order(app_context, monkeypatch):
    provider = PlanProvider(None, raw="Useful preparation note.\n\n```dossier-plan\n{broken\n```")
    service = _service_with(app_context, monkeypatch, provider)
    result = asyncio.run(service.prepare(_payload()))
    # Prose retained; priorities fall back to existing order (first three issues).
    ids = _issue_ids(app_context)
    assert result["first_issue_ids"] == ids[:3]
    assert result["preparation"].startswith("Useful preparation note.")
    record = service.get_record(MATTER, result["request_id"])
    assert any("malformed" in w for w in record["metadata"]["preparation_warnings"])


def test_prepare_records_model_selection(app_context, monkeypatch):
    provider = PlanProvider(_full_plan(app_context))
    service = _service_with(app_context, monkeypatch, provider)
    result = asyncio.run(service.prepare(_payload()))
    record = service.get_record(MATTER, result["request_id"])
    assert record["metadata"]["model_selections"]["main"]["provider"]


def test_prepare_respects_excluded_context(app_context, monkeypatch):
    ids = _issue_ids(app_context)
    base = app_context.matters.matter_path(MATTER)
    provider = PlanProvider(_full_plan(app_context))
    service = _service_with(app_context, monkeypatch, provider)
    # Exclude the issues file; capture must not restore excluded sources.
    payload = _payload(frozen_context={"excluded_paths": [base + "/issues.md"]})
    result = asyncio.run(service.prepare(payload))
    # With issues excluded, the prepared issue map is empty (nothing restored).
    record = service.get_record(MATTER, result["request_id"])
    assert record["metadata"]["issues"] == {}


def test_prepare_is_idempotent_on_action(app_context, monkeypatch):
    provider = PlanProvider(_full_plan(app_context))
    service = _service_with(app_context, monkeypatch, provider)
    a = asyncio.run(service.prepare(_payload(source_action_key="ACT-SAME")))
    b = asyncio.run(service.prepare(_payload(source_action_key="ACT-SAME")))
    assert a["request_id"] == b["request_id"]


def test_build_fields_fewer_than_three_issues(app_context, monkeypatch):
    service = DossierRequestService(app_context)
    ids = _issue_ids(app_context)
    data = {
        "question": "Two-issue matter",
        "issues": [
            {"issue_id": ids[0], "title": "First"},
            {"issue_id": ids[1], "title": "Second"},
        ],
    }
    fields = service._build_preparation_fields(MATTER, data, None, [], {"main": None}, {})
    assert fields["first_issue_ids"] == [ids[0], ids[1]]
    assert len(fields["priorities"]) == 2


def test_append_generated_issues_idempotent_and_preserving(app_context):
    ws = app_context.workspace
    before = ws.issues(MATTER)
    before_ids = {i["issue_id"] for i in before}
    # Give an existing issue a lawyer disposition to prove preservation.
    rev = ws.issues_revision(MATTER)
    ws.update_issue(MATTER, before[0]["issue_id"], {"lawyer_state": "explored"}, expected_revision=rev)

    rev = ws.issues_revision(MATTER)
    candidate = {"candidate_key": "gen-1", "title": "New generated issue", "why_it_matters": "gap"}
    first = ws.append_generated_issues(MATTER, [candidate], expected_revision=rev, request_id="DOR-x")
    assert first["added"] == 1
    new_id = first["mapping"]["gen-1"]
    assert new_id not in before_ids

    # Repeat application with the same key adds nothing new (idempotent).
    rev = ws.issues_revision(MATTER)
    second = ws.append_generated_issues(MATTER, [candidate], expected_revision=rev, request_id="DOR-x")
    assert second["added"] == 0
    assert second["mapping"]["gen-1"] == new_id

    after = ws.issues(MATTER)
    assert len([i for i in after if i["issue_id"] == new_id]) == 1
    # Existing disposition preserved; existing IDs all retained.
    assert before_ids <= {i["issue_id"] for i in after}
    assert next(i for i in after if i["issue_id"] == before[0]["issue_id"])["lawyer_state"] == "explored"


def test_append_generated_issues_checks_revision(app_context):
    ws = app_context.workspace
    with pytest.raises(Exception):
        ws.append_generated_issues(
            MATTER,
            [{"candidate_key": "x", "title": "Bad"}],
            expected_revision="stale-revision",
            request_id="DOR-x",
        )
