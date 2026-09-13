"""Persistence and validation contract for the dossier parent request record."""
from __future__ import annotations

import asyncio
from dataclasses import replace

import pytest

from app.models.dossier_request import (
    DossierRequestConflict,
    DossierRequestNotFound,
    DossierRequestValidation,
)
from app.providers.base import ProviderReply
from app.services.dossier_requests import DossierRequestService

MATTER = "MAT-DEMO-RELAY"


class _Instant:
    async def complete(self, messages, tools=None):
        return ProviderReply(content="## Working Analysis\n\nA useful conditional answer with conditions.\n")


class _FailIssue:
    """Returns empty analysis for one issue (partial) and useful answers otherwise."""

    def __init__(self, fail_marker):
        self.fail_marker = fail_marker

    async def complete(self, messages, tools=None):
        blob = "\n".join(str(m.get("content")) for m in messages)
        if self.fail_marker in blob:
            raise RuntimeError("model unavailable for this issue")
        return ProviderReply(content="## Working Analysis\n\nA useful conditional answer.\n")


def _install(app, provider):
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_agent = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)


def _prepared_record(service, app, issue_ids):
    """Create an awaiting_choices parent record for the given real issue IDs."""
    issues = {
        iid: {"title": next(i["title"] for i in app.workspace.issues(MATTER) if i["issue_id"] == iid),
              "brief": "", "initial_answer": "Initial.", "next_action": "", "focused_topic": "",
              "planned_order": order, "state": "not_selected", "sources_retrieved": 0, "sources_read": 0}
        for order, iid in enumerate(issue_ids)
    }
    fields = {
        "issues": issues,
        "first_issue_ids": issue_ids[:3],
        "planned_issue_ids": list(issue_ids),
        "priorities": [{"key": f"p{n}", "text": "P", "why": "", "issue_ids": [iid], "changed": False}
                       for n, iid in enumerate(issue_ids[:3])],
        "new_issue_candidates": [],
        "source_scope": {"external": False, "focused_topics": {}},
        "model_selections": {"main": None, "collector": None},
        "input_basis": {"issues_revision": app.workspace.issues_revision(MATTER)},
    }
    return service.create_record(
        MATTER, source_action_key="PREP-1", conversation_id="CONV-1", message_id="MSG-1",
        plan_revision="rev", preparation_body="prep", fields=fields, payload_digest="pd",
    )


def _service(app_context) -> DossierRequestService:
    return DossierRequestService(app_context)


def _fields() -> dict:
    return {
        "priorities": [
            {"key": "p1", "text": "Reduce consent risk", "issue_ids": ["ISS-A"], "changed": False},
        ],
        "first_issue_ids": ["ISS-A", "ISS-B", "ISS-C"],
        "planned_issue_ids": ["ISS-A", "ISS-B", "ISS-C"],
        "issues": {
            "ISS-A": {
                "title": "Consent migration",
                "state": "queued",
                "planned_order": 0,
                "budget_snapshot": {"main_calls": 13, "active_seconds": 600},
            },
            "ISS-B": {"title": "Data-use limits", "state": "queued", "planned_order": 1},
            "ISS-C": {"title": "Retention", "state": "queued", "planned_order": 2},
        },
    }


def _create(service, *, source_action_key="ACT-1", payload_digest="d1", fields=None):
    return service.create_record(
        MATTER,
        source_action_key=source_action_key,
        conversation_id="CONV-1",
        message_id="MSG-1",
        plan_revision="rev-1",
        preparation_body="## Suggested priorities\n\nUseful preparation prose.",
        fields=fields or _fields(),
        payload_digest=payload_digest,
    )


def test_create_read_and_reload(app_context):
    service = _service(app_context)
    created = _create(service)
    request_id = created["request_id"]
    assert request_id.startswith("DOR-")
    assert created["state"] == "awaiting_choices"
    assert created["phase"] == "setup"
    assert created["counts"]["total"] == 3

    # A fresh service instance (simulates reload) reads the same durable record.
    reloaded = _service(app_context).get(MATTER, request_id)
    assert reloaded["request_id"] == request_id
    assert reloaded["preparation"].startswith("## Suggested priorities")
    assert [row["issue_id"] for row in reloaded["issues"]] == ["ISS-A", "ISS-B", "ISS-C"]


def test_repeated_identical_action_returns_same_request(app_context):
    service = _service(app_context)
    first = _create(service, source_action_key="ACT-9", payload_digest="same")
    second = _create(service, source_action_key="ACT-9", payload_digest="same")
    assert first["request_id"] == second["request_id"]
    # No duplicate file created.
    assert len(service.list(MATTER)) == 1


def test_same_key_different_payload_conflicts(app_context):
    service = _service(app_context)
    _create(service, source_action_key="ACT-K", payload_digest="one")
    with pytest.raises(DossierRequestConflict):
        _create(service, source_action_key="ACT-K", payload_digest="two")


def test_cross_matter_request_is_rejected(app_context):
    service = _service(app_context)
    created = _create(service)
    request_id = created["request_id"]
    other = "MAT-DEMO-HARBOR"
    # Prefer a real second matter if the fixture has one; else assert not-found.
    matters = [m["matter_id"] for m in app_context.matters.list()]
    victim = next((m for m in matters if m != MATTER), None)
    assert victim is not None, "fixture should have more than one matter"
    with pytest.raises(DossierRequestNotFound):
        service.get(victim, request_id)


def test_stale_sequence_conflict(app_context):
    service = _service(app_context)
    created = _create(service)
    request_id = created["request_id"]
    record = service.get_record(MATTER, request_id)
    metadata = dict(record["metadata"])
    metadata["state"] = "running"
    metadata["phase"] = "first_batch"
    # Correct sequence succeeds and bumps.
    updated = service.save_record(
        MATTER, request_id, metadata=metadata, expected_sequence=0
    )
    assert updated["sequence"] == 1
    # A stale expected_sequence is rejected.
    with pytest.raises(DossierRequestConflict):
        service.save_record(MATTER, request_id, metadata=metadata, expected_sequence=0)


def test_malformed_metadata_is_rejected_without_erasing(app_context):
    service = _service(app_context)
    created = _create(service)
    request_id = created["request_id"]
    path = service._path(MATTER, request_id)

    # Corrupt the on-disk state to an unrecognized value, preserving budgets.
    document = app_context.vault.read_markdown(path)
    original_budget = document["metadata"]["issues"]["ISS-A"]["budget_snapshot"]
    document["metadata"]["state"] = "not-a-real-state"
    app_context.vault.write_markdown(path, document["content"], document["metadata"])

    with pytest.raises(DossierRequestValidation):
        service.get(MATTER, request_id)

    # The record is not erased or reset; budgets survive.
    after = app_context.vault.read_markdown(path)
    assert after["metadata"]["state"] == "not-a-real-state"
    assert after["metadata"]["issues"]["ISS-A"]["budget_snapshot"] == original_budget


def test_get_is_read_only_no_tasks_or_sequence_change(app_context):
    service = _service(app_context)
    created = _create(service)
    request_id = created["request_id"]
    before = service.get_record(MATTER, request_id)["metadata"]["sequence"]
    for _ in range(3):
        service.get(MATTER, request_id)
        service.list(MATTER)
    after = service.get_record(MATTER, request_id)["metadata"]["sequence"]
    assert before == after == 0
    assert service.has_active_work is False
    assert service._active == {}


def test_list_filters_by_conversation(app_context):
    service = _service(app_context)
    a = service.create_record(
        MATTER, source_action_key="A", conversation_id="CONV-A", message_id="M",
        plan_revision="r", preparation_body="", fields=_fields(), payload_digest="a",
    )
    service.create_record(
        MATTER, source_action_key="B", conversation_id="CONV-B", message_id="M",
        plan_revision="r", preparation_body="", fields=_fields(), payload_digest="b",
    )
    only_a = service.list(MATTER, conversation_id="CONV-A")
    assert [r["request_id"] for r in only_a] == [a["request_id"]]
    assert len(service.list(MATTER)) == 2


# --- Step 6: batch execution ------------------------------------------------

def _choices(mode="research", scope="top_three", first_ids=None, action="START-1"):
    return {"execution_mode": mode, "scope": scope, "first_issue_ids": first_ids or [],
            "priorities": [], "source_choice": {"external": False}, "source_action_key": action,
            "accepted_candidate_keys": []}


@pytest.mark.asyncio
async def test_top_three_starts_exactly_three_distinct_issues(app_context):
    app = app_context
    _install(app, _Instant())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:4]
    record = _prepared_record(service, app, ids)
    rid = record["request_id"]
    started = await service.start(MATTER, rid, _choices(scope="top_three", first_ids=ids[:3]), expected_sequence=None)
    assert started["state"] == "running"
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()
    children = app.research_runs.managed_children(MATTER, rid)
    assert len({c["issue_id"] for c in children}) == 3
    # The unselected fourth issue was never researched.
    final = service.get(MATTER, rid)
    states = {row["issue_id"]: row["state"] for row in final["issues"]}
    assert states[ids[3]] == "not_selected"


@pytest.mark.asyncio
async def test_all_scope_researches_every_issue_across_batches(app_context):
    app = app_context
    _install(app, _Instant())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:4]
    record = _prepared_record(service, app, ids)
    rid = record["request_id"]
    await service.start(MATTER, rid, _choices(scope="all", first_ids=ids[:3]), expected_sequence=None)
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()
    final = service.get(MATTER, rid)
    researched = {row["issue_id"] for row in final["issues"] if row["state"] in {"saved", "partial"}}
    assert researched == set(ids), "all four issues eventually researched"
    # Two batches (3 + 1) with a first-pass publication boundary between them.
    assert len(final["publications"]) == 2
    assert final["first_pass_ready_at"]
    assert final["state"] == "completed"


@pytest.mark.asyncio
async def test_one_child_failure_does_not_cancel_siblings(app_context):
    app = app_context
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    # Each managed child sees only its own issue id, so keying on it fails exactly
    # one worker and proves siblings are not cancelled.
    _install(app, _FailIssue(ids[1]))
    service = DossierRequestService(app)
    record = _prepared_record(service, app, ids)
    rid = record["request_id"]
    await service.start(MATTER, rid, _choices(scope="top_three", first_ids=ids), expected_sequence=None)
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()
    final = service.get(MATTER, rid)
    states = {row["issue_id"]: row["state"] for row in final["issues"]}
    assert states[ids[0]] == "saved"
    assert states[ids[2]] == "saved"
    assert states[ids[1]] in {"partial", "failed"}


@pytest.mark.asyncio
async def test_duplicate_start_returns_same_children(app_context):
    app = app_context
    _install(app, _Instant())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    record = _prepared_record(service, app, ids)
    rid = record["request_id"]
    first = await service.start(MATTER, rid, _choices(first_ids=ids, action="SAME"), expected_sequence=None)
    a = {c["run_id"] for c in app.research_runs.managed_children(MATTER, rid)}
    second = await service.start(MATTER, rid, _choices(first_ids=ids, action="SAME"), expected_sequence=None)
    b = {c["run_id"] for c in app.research_runs.managed_children(MATTER, rid)}
    assert first["request_id"] == second["request_id"]
    assert a == b
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()


@pytest.mark.asyncio
async def test_stop_prevents_additional_starts(app_context):
    app = app_context
    _install(app, _Instant())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:4]
    record = _prepared_record(service, app, ids)
    rid = record["request_id"]
    await service.start(MATTER, rid, _choices(scope="all", first_ids=ids[:3]), expected_sequence=None)
    stopped = await service.stop(MATTER, rid, expected_sequence=None)
    assert stopped["state"] in {"stopped", "completed", "partial"}
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()
    # Ownership released so ordinary research could run again.
    assert app.research_runs.matter_owner(MATTER) is None
