"""Group composition and publication: one combined update, no false conflict."""
from __future__ import annotations

import asyncio
import json
import re
from dataclasses import replace

import pytest

from app.providers.base import ProviderReply
from app.services.dossier_request_execution import publish_batch
from app.services.dossier_requests import DossierRequestService
from app.services.recommendations import RecommendationService

MATTER = "MAT-DEMO-RELAY"

CHECKLIST = ("The clause applies only when ALL hold: (1) the change is material; "
             "(2) 30 days written notice; (3) no customer opt-out; (4) the contract permits the purpose.")


class ResearchAnswerProvider:
    """Emits a per-issue research-synthesis for whichever issue the child owns."""

    async def complete(self, messages, tools=None):
        blob = "\n".join(str(m.get("content")) for m in messages)
        match = re.search(r"ISS-[0-9a-f]+-[0-9a-f]+", blob)
        issue_id = match.group(0) if match else None
        prose = "Conditional answer.\n\n" + CHECKLIST
        if not issue_id:
            return ProviderReply(content=prose)
        synthesis = {
            "summary": "Overall research summary.",
            "issue_updates": [{
                "issue_id": issue_id,
                "position": "The notice clause may apply.",
                "next_action": "Confirm the aggregator contract terms.",
                "analysis_markdown": "## Notice\n\n" + CHECKLIST,
                "remaining_gaps": ["Confirm the executed contract version."],
                "proposed_actions": [{"action": "Serve notice", "proposed_owner_role": "Counsel",
                                       "anchor_date": "2026-09-01", "offset_calendar_days": -30,
                                       "timing_basis": "30 days before the change"}],
            }],
        }
        return ProviderReply(content=prose + "\n\n```research-synthesis\n" + json.dumps(synthesis) + "\n```")


class RaisingWriter:
    async def complete(self, messages, tools=None):
        raise RuntimeError("writer unavailable")


def _install_research(app, provider):
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_agent = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)


def _prepared(service, app, issue_ids, *, input_basis=None):
    issues = {
        iid: {"title": next(i["title"] for i in app.workspace.issues(MATTER) if i["issue_id"] == iid),
              "brief": "", "initial_answer": "Initial.", "next_action": "", "focused_topic": "",
              "planned_order": order, "state": "not_selected", "sources_retrieved": 0, "sources_read": 0}
        for order, iid in enumerate(issue_ids)
    }
    from app.services.main_agent_research import research_basis
    fields = {
        "issues": issues, "first_issue_ids": issue_ids[:3], "planned_issue_ids": list(issue_ids),
        "priorities": [], "new_issue_candidates": [],
        "source_scope": {"external": False, "focused_topics": {}},
        "model_selections": {"main": None, "collector": None},
        "input_basis": input_basis or research_basis(app, MATTER),
    }
    return service.create_record(
        MATTER, source_action_key="P", conversation_id="C", message_id="M",
        plan_revision="r", preparation_body="p", fields=fields, payload_digest="pd",
    )


def _choices(scope="top_three", first_ids=None):
    return {"execution_mode": "research", "scope": scope, "first_issue_ids": first_ids or [],
            "priorities": [], "source_choice": {"external": False}, "source_action_key": "S",
            "accepted_candidate_keys": []}


async def _run(service, app, rid, choices):
    await service.start(MATTER, rid, choices, expected_sequence=None)
    await service.wait_for_active_work()
    await app.research_runs.wait_for_active_work()


@pytest.mark.asyncio
async def test_three_siblings_one_combined_proposal_no_false_conflict(app_context):
    app = app_context
    _install_research(app, ResearchAnswerProvider())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    rec = _prepared(service, app, ids)
    await _run(service, app, rec["request_id"], _choices(first_ids=ids))

    current = RecommendationService(app.vault, app.matters).get(MATTER)
    proposal = current["proposal"]
    assert proposal is not None, "one combined proposed update exists"
    positions = proposal["research_publication"]["issue_positions"]
    assert set(ids) <= set(positions), "the single proposal covers all three siblings"

    final = service.get(MATTER, rec["request_id"])
    # No sibling false-conflict: the batch published as an applied own update.
    assert final["publications"][0]["state"] == "applied"
    assert final["state"] == "completed"


@pytest.mark.asyncio
async def test_detailed_conditions_survive_in_combined_proposal(app_context):
    app = app_context
    _install_research(app, ResearchAnswerProvider())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    rec = _prepared(service, app, ids)
    await _run(service, app, rec["request_id"], _choices(first_ids=ids))

    proposal = RecommendationService(app.vault, app.matters).get(MATTER)["proposal"]
    content = proposal["content"]
    # The full multi-condition checklist survives, not just a one-line position.
    assert "30 days written notice" in content
    positions = proposal["research_publication"]["issue_positions"]
    for iid in ids:
        assert positions[iid]["analysis_markdown"].strip()
        assert positions[iid]["proposed_actions"], "proposed work retained per issue"
        # The signed offset resolved to a concrete date via the standard library.
        assert positions[iid]["proposed_actions"][0]["due_date"] == "2026-08-02"


@pytest.mark.asyncio
async def test_same_batch_retry_creates_no_duplicate(app_context):
    app = app_context
    _install_research(app, ResearchAnswerProvider())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    rec = _prepared(service, app, ids)
    rid = rec["request_id"]
    await _run(service, app, rid, _choices(first_ids=ids))

    before = service.get(MATTER, rid)["publications"]
    revisions_dir = app.matters.matter_path(MATTER) + "/dossier-revisions"
    count_before = len(list(app.vault.iter_files(revisions_dir, {".md"})))
    # Replaying the same batch must not create another proposal, revision or entry.
    await publish_batch(service, MATTER, rid, ids)
    after = service.get(MATTER, rid)["publications"]
    count_after = len(list(app.vault.iter_files(revisions_dir, {".md"})))
    assert len(after) == len(before)
    assert count_after == count_before


@pytest.mark.asyncio
async def test_facts_changed_after_start_yields_review_only(app_context):
    app = app_context
    _install_research(app, ResearchAnswerProvider())
    service = DossierRequestService(app)
    ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
    rec = _prepared(service, app, ids)
    rid = rec["request_id"]
    await _run(service, app, rid, _choices(first_ids=ids))

    # The matter facts change after the request froze its basis.
    app.matter_records.apply_update(
        MATTER, facts=[{"text": "A newly reported material fact.", "status": "active"}],
        actor="assistant", summary="New fact",
    )
    # Reset the recorded publication so the same batch recomposes under the now
    # stale basis, and re-run the group publisher directly.
    record = service.get_record(MATTER, rid)
    md = dict(record["metadata"])
    md["publications"] = []
    service.save_record(MATTER, rid, metadata=md, expected_sequence=None)

    await publish_batch(service, MATTER, rid, ids)
    final = service.get(MATTER, rid)
    assert final["publications"][0]["state"] == "review_required"


@pytest.mark.asyncio
async def test_failed_writer_still_saves_issue_analysis(app_context):
    app = app_context
    # Research children use a fixed resolved provider captured now.
    _install_research(app, ResearchAnswerProvider())
    # The whole-dossier writer (resolved at generate time) fails.
    original = app.runner.resolve

    def resolve(agent_id="counsel-copilot"):
        return replace(original(agent_id), provider=RaisingWriter())

    app.runner.resolve = resolve
    try:
        service = DossierRequestService(app)
        ids = [i["issue_id"] for i in app.workspace.issues(MATTER)][:3]
        rec = _prepared(service, app, ids)
        await _run(service, app, rec["request_id"], _choices(first_ids=ids))
    finally:
        app.runner.resolve = original

    proposal = RecommendationService(app.vault, app.matters).get(MATTER)["proposal"]
    assert proposal is not None, "combined issue analysis is saved even if the writer fails"
    positions = proposal["research_publication"]["issue_positions"]
    assert all(positions[iid]["analysis_markdown"].strip() for iid in ids)
    final = service.get(MATTER, rec["request_id"])
    assert final["publications"][0]["state"] in {"failed", "review_required"}
