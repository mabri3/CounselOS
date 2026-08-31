from __future__ import annotations

from datetime import UTC, datetime
from types import SimpleNamespace

import pytest

from app.agents.runner import _explicit_watch_activation_requested, _watch_card_tool
from app.models.api import CardAction, ChatRequest
from app.routers.chat import _watch_builder_requested
from app.models.awareness import (
    ProviderScanResult,
    PublicWatchQuery,
    Scan,
    ScanResult,
    SourceCoverage,
    WatchDraftCreate,
)
from app.services.vault import VaultService
from app.services.watches import WatchStore
from app.tools.handlers import activate_watch, build_handlers, create_watch_draft, scan_watch
from app.tools.registry import ToolExecutionContext, ToolRegistry
from conftest import TEST_VAULT_SOURCE


class IndexFake:
    def rebuild(self):
        return None


class SchedulerFake:
    def __init__(self, error: Exception | None = None):
        self.error = error
        self.created = []

    def create(self, request):
        if self.error:
            raise self.error
        result = {
            "schedule_id": "SCH-1", "path": "00_System/schedules/watch.md",
            "title": request.title, "enabled": request.enabled,
        }
        self.created.append(request)
        return result


class ScanFake:
    def __init__(self, watches):
        self.watches = watches
        self.calls = []

    async def run_watch(self, watch_id, mode):
        self.calls.append((watch_id, mode))
        watch = self.watches.get(watch_id)
        now = datetime.now(UTC)
        scan = Scan(
            scan_id="SCAN-1", path="05_Briefing/scans/SCAN-1.md", watch_id=watch_id,
            mode=mode, status="partial", watch_revision=watch.revision,
            provider_results=[ProviderScanResult(provider_id="native", status="failed", warnings=["source failed"])],
            source_coverage=[SourceCoverage(url="https://example.com/feed", status="failed", message="timeout")],
            warnings=["source failed"], started_at=now, completed_at=now,
        )
        return ScanResult(scan=scan)


def app_fake(tmp_path, *, scheduler=None):
    vault = VaultService(tmp_path)
    watches = WatchStore(vault)
    return SimpleNamespace(
        vault=vault, watches=watches, watch_scans=ScanFake(watches),
        scheduler=scheduler or SchedulerFake(), index=IndexFake(),
    )


@pytest.mark.asyncio
async def test_save_draft_persists_disabled_watch_without_schedule(tmp_path):
    app = app_fake(tmp_path)
    result = await create_watch_draft(ToolExecutionContext(app), {
        "standing_question": "What changed in state privacy law?",
        "topics": ["privacy"],
    })

    watch = app.watches.get(result["data"]["watch"]["watch_id"])
    assert watch.enabled is False
    assert watch.schedule_id is None
    assert app.scheduler.created == []
    assert result["data"]["card"]["allowed_actions"] == [
        "save_draft", "scan_now", "change_something", "start_watch",
    ]


@pytest.mark.asyncio
async def test_scan_now_runs_draft_once_and_keeps_watch_disabled(tmp_path):
    app = app_fake(tmp_path)
    watch = app.watches.create_draft(WatchDraftCreate(
        title="Privacy", standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"), purposes=["awareness"],
    ))

    result = await scan_watch(ToolExecutionContext(app), {"watch_id": watch.watch_id})

    saved = app.watches.get(watch.watch_id)
    assert app.watch_scans.calls == [(watch.watch_id, "draft")]
    assert saved.enabled is False and saved.schedule_id is None
    assert result["data"]["sources_checked"][0]["status"] == "failed"
    assert result["data"]["failures"] == ["source failed"]
    assert "sample_briefing_items" in result["data"]
    assert "possible_review_connections" in result["data"]


@pytest.mark.asyncio
async def test_start_watch_is_explicit_and_schedule_failure_leaves_draft(tmp_path):
    app = app_fake(tmp_path, scheduler=SchedulerFake(RuntimeError("scheduler offline")))
    watch = app.watches.create_draft(WatchDraftCreate(
        title="Privacy", standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"), purposes=["awareness"],
    ))

    with pytest.raises(RuntimeError, match="scheduler offline"):
        await activate_watch(ToolExecutionContext(app), {"watch_id": watch.watch_id})
    unchanged = app.watches.get(watch.watch_id)
    assert unchanged.enabled is False and unchanged.schedule_id is None

    app.scheduler = SchedulerFake()
    await activate_watch(ToolExecutionContext(app), {"watch_id": watch.watch_id})
    active = app.watches.get(watch.watch_id)
    assert active.enabled is True and active.schedule_id == "SCH-1"


@pytest.mark.asyncio
async def test_research_agent_can_call_all_three_registered_watch_handlers(tmp_path):
    app = app_fake(tmp_path)
    source_vault = VaultService(TEST_VAULT_SOURCE)
    registry = ToolRegistry(source_vault, build_handlers())
    from app.agents.registry import AgentRegistry
    agent = AgentRegistry(source_vault, 8).get("research-agent")
    assert {"create_watch_draft", "scan_watch", "activate_watch"} <= set(agent.allowed_tools)

    created = await registry.execute(agent, ToolExecutionContext(app), "create_watch_draft", {
        "title": "Privacy", "standing_question": "What changed?",
    })
    watch_id = created.data["watch"]["watch_id"]
    scanned = await registry.execute(agent, ToolExecutionContext(app), "scan_watch", {"watch_id": watch_id})
    activated = await registry.execute(agent, ToolExecutionContext(app), "activate_watch", {"watch_id": watch_id})
    assert [created.status, scanned.status, activated.status] == ["success", "success", "success"]


def test_watch_card_actions_route_to_distinct_tools():
    scan = _watch_card_tool(ChatRequest(card_action=CardAction(
        card_id="watch-draft:WATCH-1", action="scan_now",
    )))
    start = _watch_card_tool(ChatRequest(card_action=CardAction(
        card_id="watch-draft:WATCH-1", action="start_watch",
    )))
    assert scan == ("scan_watch", {"watch_id": "WATCH-1"})
    assert start == ("activate_watch", {"watch_id": "WATCH-1"})


def test_watch_activation_intent_must_be_explicit():
    assert _explicit_watch_activation_requested(ChatRequest(message="Start this Watch.")) is True
    assert _explicit_watch_activation_requested(ChatRequest(message="Save the Watch draft.")) is False
    assert _explicit_watch_activation_requested(ChatRequest(message="Scan this Watch now.")) is False
    assert _explicit_watch_activation_requested(ChatRequest(
        card_action=CardAction(card_id="watch-draft:WATCH-1", action="start_watch")
    )) is True


def test_watch_builder_intent_requires_an_explicit_command():
    request = ChatRequest(message=(
        "The transaction monitoring review found a recipient linked to an "
        "unlicensed currency-exchange business. What must we do now?"
    ))

    assert _watch_builder_requested(request.message, request) is False
    generic_change = "How does this regulatory change affect transaction monitoring?"
    assert _watch_builder_requested(
        generic_change, ChatRequest(message=generic_change)
    ) is False
    incidental_watch = "The policy says we must change this Watch every quarter."
    assert _watch_builder_requested(
        incidental_watch, ChatRequest(message=incidental_watch)
    ) is False
    question = "Are we required to set up monitoring for these transfers?"
    assert _watch_builder_requested(question, ChatRequest(message=question)) is False
    explicit = "Create a Watch to monitor currency-exchange businesses."
    assert _watch_builder_requested(explicit, ChatRequest(message=explicit)) is True
    edit = "Change this Watch to cover currency-exchange businesses."
    assert _watch_builder_requested(edit, ChatRequest(message=edit)) is True
    setup = "Set up monitoring for currency-exchange businesses."
    assert _watch_builder_requested(setup, ChatRequest(message=setup)) is True
    polite = "Could you create a Watch for currency-exchange businesses?"
    assert _watch_builder_requested(polite, ChatRequest(message=polite)) is True
    intake = ChatRequest(message=explicit, agent_id="intake-agent")
    assert _watch_builder_requested(intake.message, intake) is False
