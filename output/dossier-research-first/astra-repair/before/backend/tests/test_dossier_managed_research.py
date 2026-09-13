"""Parent-managed research children: identity, budget, isolation, ownership."""
from __future__ import annotations

import asyncio
from dataclasses import replace

import pytest

from app.providers.base import ProviderReply
from app.services.recommendations import RecommendationService
from app.services.research_checkpoints import ResearchCheckpoints

MATTER = "MAT-DEMO-RELAY"
PARENT = "DOR-TEST-1"


class GatedProvider:
    """Blocks each research main call until released, to prove real concurrency."""

    def __init__(self):
        self.release = asyncio.Event()
        self.active = 0
        self.max_active = 0

    async def complete(self, messages, tools=None):
        self.active += 1
        self.max_active = max(self.max_active, self.active)
        try:
            await self.release.wait()
        finally:
            self.active -= 1
        return ProviderReply(content="## Working Analysis\n\nConditional answer with material conditions.\n")


class InstantProvider:
    async def complete(self, messages, tools=None):
        return ProviderReply(content="## Working Analysis\n\nA useful conditional answer.\n")


def _install(app, provider):
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_agent = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)
    return resolved


def _issue_ids(app):
    return [i["issue_id"] for i in app.workspace.issues(MATTER)]


def _create_children(app, issue_ids):
    return [
        app.research_runs.create_managed_child(
            MATTER, parent_request_id=PARENT, issue_id=iid, question=f"Research {iid}",
            focused_topic="", source_scope={"external": False},
        )
        for iid in issue_ids
    ]


def test_managed_children_have_independent_identity_and_budget(app_context):
    app = app_context
    ids = _issue_ids(app)[:3]
    children = _create_children(app, ids)
    run_ids = [c["run_id"] for c in children]
    assert len(set(run_ids)) == 3
    for child, iid in zip(children, ids):
        assert child["managed"] is True
        assert child["parent_request_id"] == PARENT
        assert child["issue_id"] == iid
        cp = ResearchCheckpoints(app.research_runs).load(MATTER, child["run_id"])
        # Each child holds the full per-issue research budget, not the short chat one.
        assert cp["budget_used"]["main_calls"] == 0
    # Deterministic reuse: same (parent, issue) returns the same child.
    again = app.research_runs.create_managed_child(
        MATTER, parent_request_id=PARENT, issue_id=ids[0], question="Research again", source_scope={"external": False})
    assert again["run_id"] == run_ids[0]


@pytest.mark.asyncio
async def test_managed_result_saves_packet_without_shared_publication(app_context):
    app = app_context
    _install(app, InstantProvider())
    iid = _issue_ids(app)[0]
    matter_before = app.vault.read_markdown(app.matters.matter_path(MATTER) + "/matter.md")["metadata"].get("latest_research_path")
    rec_before = RecommendationService(app.vault, app.matters).get(MATTER)

    child = app.research_runs.create_managed_child(
        MATTER, parent_request_id=PARENT, issue_id=iid, question="Research this issue", source_scope={"external": False})
    task = app.research_runs.launch_managed_child(MATTER, child["run_id"])
    await task

    saved = app.research_runs.get(MATTER, child["run_id"])
    assert saved["state"] == "completed"
    assert saved["managed_state"] == "ready_for_composition"
    packet_path = saved["results"][0]["path"]
    assert app.vault.exists(packet_path)
    assert app.vault.read_markdown(packet_path)["metadata"].get("research_prose")

    # No shared advice publication, no latest-research pointer move.
    rec_after = RecommendationService(app.vault, app.matters).get(MATTER)
    assert rec_after.get("proposal") == rec_before.get("proposal")
    matter_after = app.vault.read_markdown(app.matters.matter_path(MATTER) + "/matter.md")["metadata"].get("latest_research_path")
    assert matter_after == matter_before


@pytest.mark.asyncio
async def test_three_managed_workers_run_concurrently_no_fourth(app_context):
    app = app_context
    provider = GatedProvider()
    _install(app, provider)
    ids = _issue_ids(app)[:3]
    children = _create_children(app, ids)

    acquired = app.research_runs.acquire_matter_ownership(MATTER, PARENT)
    assert acquired["acquired"] is True

    tasks = [app.research_runs.launch_managed_child(MATTER, c["run_id"]) for c in children]

    # Wait until all three are actually inside the model call at once.
    for _ in range(500):
        if provider.active == 3:
            break
        await asyncio.sleep(0.01)
    assert provider.max_active == 3, "three distinct workers run concurrently"

    # A standalone research request while the parent owns the matter must queue,
    # not consume a fourth concurrent slot.
    _install(app, provider)
    standalone = app.research_runs.start(MATTER, ["Unrelated standalone question"])
    assert app.research_runs.get(MATTER, standalone["run_id"])["state"] == "queued"
    assert provider.max_active == 3

    provider.release.set()
    await asyncio.gather(*tasks)

    # After the parent releases the matter, the ordinary queue resumes.
    fast = InstantProvider()
    _install(app, fast)
    app.research_runs.release_matter_ownership(MATTER, PARENT)
    app.research_runs.schedule_next_pending(MATTER)
    await app.research_runs.wait_for_active_work()
    assert app.research_runs.get(MATTER, standalone["run_id"])["state"] in {"completed", "failed"}


@pytest.mark.asyncio
async def test_managed_children_excluded_from_recovery_publisher(app_context):
    app = app_context
    _install(app, InstantProvider())
    iid = _issue_ids(app)[0]
    child = app.research_runs.create_managed_child(
        MATTER, parent_request_id=PARENT, issue_id=iid, question="Research", source_scope={"external": False})
    task = app.research_runs.launch_managed_child(MATTER, child["run_id"])
    await task
    rec_before = RecommendationService(app.vault, app.matters).get(MATTER).get("proposal")

    # The ordinary saved-publication recovery must not publish a managed child.
    app.research_runs.recover_saved_publications()
    rec_after = RecommendationService(app.vault, app.matters).get(MATTER).get("proposal")
    assert rec_after == rec_before

    # Managed children are not offered by the ordinary pending scheduler.
    pending_ids = {item["run_id"] for item in app.research_runs._pending(MATTER)}
    assert child["run_id"] not in pending_ids


@pytest.mark.asyncio
async def test_standalone_research_remains_serial(app_context):
    app = app_context
    provider = GatedProvider()
    _install(app, provider)
    batch = app.research_runs.start(MATTER, ["Q1", "Q2", "Q3"])
    # Let the first worker enter the model call.
    for _ in range(200):
        if provider.active >= 1:
            break
        await asyncio.sleep(0.01)
    runs = [r for r in app.research_runs.list(MATTER) if r.get("batch_id") == batch.get("batch_id")]
    running = [r for r in runs if r["state"] == "running"]
    assert len(running) == 1, "standalone research runs one at a time"
    assert provider.max_active == 1
    provider.release.set()
    await app.research_runs.wait_for_active_work()
