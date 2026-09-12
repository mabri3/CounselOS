"""Crash-boundary recovery for the saved dossier parent and managed children."""
from __future__ import annotations

import asyncio
import json
import re
from dataclasses import replace

import httpx
import pytest
from fastapi import FastAPI

from app.providers.base import ProviderReply
from app.routers import dossier_requests
from app.runtime import AppContext
from app.services.research_checkpoints import ResearchCheckpoints
from app.services.recommendations import RecommendationService


MATTER = "MAT-DEMO-RELAY"


class ProcessDeath(BaseException):
    """A fault that bypasses normal best-effort exception handling."""


class CountingProvider:
    def __init__(self, gate: asyncio.Event | None = None):
        self.gate = gate
        self.entered = asyncio.Event()
        self.research_calls = 0
        self.writer_calls = 0

    async def complete(self, messages, tools=None):
        blob = "\n".join(str(message.get("content") or "") for message in messages)
        if "Dossier-generation action" in blob:
            self.writer_calls += 1
            return ProviderReply(content="# Dossier\n\n## Current position\n\nSaved research was composed.")
        self.research_calls += 1
        self.entered.set()
        if self.gate is not None:
            await self.gate.wait()
        match = re.search(r"ISS-[0-9a-f]+-[0-9a-f]+", blob)
        issue_id = match.group(0) if match else None
        synthesis = {"summary": "Saved conditional answer.", "issue_updates": []}
        if issue_id:
            synthesis["issue_updates"] = [{
                "issue_id": issue_id,
                "position": "The saved facts support a conditional answer.",
                "next_action": "Confirm the controlling terms.",
                "analysis_markdown": "## Analysis\n\nThe saved facts support a conditional answer with retained limits.",
                "remaining_gaps": ["Confirm the executed terms."],
                "proposed_actions": [],
            }]
        return ProviderReply(content="Useful saved analysis.\n\n```research-synthesis\n" + json.dumps(synthesis) + "\n```")


def _install(app: AppContext, provider: CountingProvider) -> None:
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_agent = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)


def _api(app_context: AppContext) -> FastAPI:
    api = FastAPI()
    api.state.context = app_context
    api.include_router(dossier_requests.router, prefix="/api")
    return api


def _issue_ids(app: AppContext, count: int = 3) -> list[str]:
    return [item["issue_id"] for item in app.workspace.issues(MATTER)][:count]


def _prepared(app: AppContext, issue_ids: list[str], *, action: str, conversation: bool = True) -> dict:
    service = app.dossier_requests
    origin = app.chat_history.append(MATTER, None, role="user", content="Prepare a dossier.") if conversation else None
    issues = {
        issue_id: {
            "title": next(item["title"] for item in app.workspace.issues(MATTER) if item["issue_id"] == issue_id),
            "brief": "Material to the product path.", "initial_answer": "Initial saved answer.",
            "next_action": "", "focused_topic": "", "planned_order": order,
            "state": "not_selected", "sources_retrieved": 0, "sources_read": 0,
        }
        for order, issue_id in enumerate(issue_ids)
    }
    from app.services.main_agent_research import research_basis
    return service.create_record(
        MATTER, source_action_key=action,
        conversation_id=origin["conversation_id"] if origin else None,
        message_id=origin["messages"][0]["message_id"] if origin else None,
        plan_revision=f"plan-{action}", preparation_body="Prepared dossier plan.",
        fields={
            "issues": issues, "first_issue_ids": issue_ids[:3], "planned_issue_ids": issue_ids,
            "priorities": [], "new_issue_candidates": [],
            "source_scope": {"external": False, "focused_topics": {}},
            "model_selections": {"main": None, "collector": None},
            "input_basis": research_basis(app, MATTER),
        },
        payload_digest=f"digest-{action}",
    )


def _start_payload(status: dict, *, action: str, scope: str = "top_three") -> dict:
    return {
        "execution_mode": "research", "expected_sequence": status["sequence"],
        "plan_revision": status["plan_revision"], "priorities": status["priorities"],
        "first_issue_ids": status["first_issue_ids"], "scope": scope,
        "source_choice": {"external": False}, "accepted_candidate_keys": [],
        "source_action_key": action,
    }


async def _post_start(app: AppContext, status: dict, *, action: str, scope: str = "top_three") -> httpx.Response:
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)), base_url="http://test") as client:
        return await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start",
            json=_start_payload(status, action=action, scope=scope),
        )


async def _post_resume(app: AppContext, status: dict, *, retry_unknown: bool = False) -> httpx.Response:
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)), base_url="http://test") as client:
        return await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/resume",
            json={"expected_sequence": status["sequence"], "retry_unknown": retry_unknown},
        )


async def _wait(app: AppContext) -> None:
    await app.dossier_requests.wait_for_active_work()
    await app.research_runs.wait_for_active_work()


def _prime_running_parent(app: AppContext, status: dict, issue_ids: list[str]) -> list[dict]:
    service = app.dossier_requests
    children = [
        app.research_runs.create_managed_child(
            MATTER, parent_request_id=status["request_id"], issue_id=issue_id,
            question=f"Research this issue for the dossier: {issue_id}", source_scope={"external": False},
        )
        for issue_id in issue_ids
    ]
    record = service.get_record(MATTER, status["request_id"])
    metadata = dict(record["metadata"])
    metadata.update(state="running", phase="first_batch", execution_mode="research", scope="top_three")
    metadata["issues"] = {key: dict(value) for key, value in metadata["issues"].items()}
    for issue_id, child in zip(issue_ids, children):
        metadata["issues"][issue_id].update(state="running", child_run_id=child["run_id"])
    service.save_record(MATTER, status["request_id"], metadata=metadata, expected_sequence=None)
    return children


@pytest.mark.asyncio
@pytest.mark.parametrize("child_written", [False, True], ids=["parent-before-child", "child-before-parent-link"])
async def test_restart_reuses_deterministic_children_at_start_boundaries(app_context, monkeypatch, child_written):
    app = app_context
    status = _prepared(app, _issue_ids(app), action=f"prepare-start-{child_written}")
    original = app.research_runs.create_managed_child
    calls = 0

    def crash(*args, **kwargs):
        nonlocal calls
        calls += 1
        if child_written:
            original(*args, **kwargs)
        raise RuntimeError("process stopped during child creation")

    monkeypatch.setattr(app.research_runs, "create_managed_child", crash)
    with pytest.raises(RuntimeError, match="process stopped"):
        await _post_start(app, status, action=f"start-boundary-{child_written}")
    assert calls == 1
    monkeypatch.setattr(app.research_runs, "create_managed_child", original)

    reopened = AppContext(app.settings)
    provider = CountingProvider()
    _install(reopened, provider)
    interrupted = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert interrupted["state"] == "interrupted"
    response = await _post_resume(reopened, interrupted)
    assert response.status_code == 202, response.text
    await _wait(reopened)
    final = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert final["state"] == "completed"
    children = reopened.research_runs.managed_children(MATTER, status["request_id"])
    assert len(children) == len(_issue_ids(reopened)), "deterministic creation prevents a duplicate child"


@pytest.mark.asyncio
async def test_restart_does_not_repeat_two_completed_children_while_third_was_collecting(app_context):
    app = app_context
    ids = _issue_ids(app)
    status = _prepared(app, ids, action="prepare-mixed")
    children = _prime_running_parent(app, status, ids)
    before_provider = CountingProvider()
    _install(app, before_provider)
    await asyncio.gather(*(app.research_runs.launch_managed_child(MATTER, child["run_id"]) for child in children[:2]))
    third = children[2]
    app.research_runs._write(MATTER, third["run_id"], state="running", managed_state="collecting")
    budgets = {
        child["run_id"]: ResearchCheckpoints(app.research_runs).load(MATTER, child["run_id"])["budget_used"]
        for child in children[:2]
    }

    reopened = AppContext(app.settings)
    after_provider = CountingProvider()
    _install(reopened, after_provider)
    interrupted = reopened.dossier_requests.get(MATTER, status["request_id"])
    response = await _post_resume(reopened, interrupted)
    assert response.status_code == 202, response.text
    await _wait(reopened)
    assert after_provider.research_calls == 1, "only the unfinished child calls the model"
    assert len(reopened.research_runs.managed_children(MATTER, status["request_id"])) == 3
    for run_id, before in budgets.items():
        after = ResearchCheckpoints(reopened.research_runs).load(MATTER, run_id)["budget_used"]
        assert all(after[key] >= value for key, value in before.items()), "saved budgets never decrease"


@pytest.mark.asyncio
async def test_unknown_source_outcome_is_visible_and_not_retried_without_explicit_choice(app_context):
    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="prepare-unknown", conversation=False)
    child = _prime_running_parent(app, status, ids)[0]
    checkpoints = ResearchCheckpoints(app.research_runs)
    checkpoints.reserve_call(MATTER, child["run_id"], "fetch:unknown", "request-digest", {"fetches": 1})

    reopened = AppContext(app.settings)
    recovered = ResearchCheckpoints(reopened.research_runs)
    checkpoint = recovered.load(MATTER, child["run_id"])
    assert next(call for call in checkpoint["pending_calls"] if call["key"] == "fetch:unknown")["state"] == "outcome_unknown"
    before_budget = dict(checkpoint["budget_used"])
    provider = CountingProvider()
    _install(reopened, provider)
    parent = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert (await _post_resume(reopened, parent)).status_code == 202
    await _wait(reopened)
    after = recovered.load(MATTER, child["run_id"])
    unknown = next(call for call in after["pending_calls"] if call["key"] == "fetch:unknown")
    assert unknown["state"] == "outcome_unknown" and unknown["attempts"] == 1
    assert after["budget_used"]["fetches"] == before_budget["fetches"]


@pytest.mark.asyncio
async def test_corrupt_saved_source_stays_failed_and_is_not_refetched(app_context):
    from app.services.workspace import digest

    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="prepare-corrupt", conversation=False)
    child = _prime_running_parent(app, status, ids)[0]
    source_path = app.matters.matter_path(MATTER) + "/research/sources/lifecycle-corrupt.md"
    app.vault.write_markdown(source_path, "Original saved source.")
    saved_source = app.vault.read_markdown(source_path)["content"]
    checkpoints = ResearchCheckpoints(app.research_runs)
    checkpoints.update(MATTER, child["run_id"], sources=[{"path": source_path, "source_hash": digest(saved_source)}])
    app.vault.update_markdown(source_path, content="Corrupt replacement.")

    reopened = AppContext(app.settings)
    provider = CountingProvider()
    _install(reopened, provider)
    parent = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert (await _post_resume(reopened, parent)).status_code == 202
    await _wait(reopened)
    final = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert final["state"] == "partial"
    assert final["issues"][0]["state"] == "failed"
    assert provider.research_calls == 0, "a corrupt saved source is not silently fetched again"


async def _crash_and_resume_publication(app: AppContext, monkeypatch, boundary: str) -> tuple[AppContext, dict, CountingProvider, dict]:
    import app.services.dossier_generation as generation
    from app.services.chat_history import ChatHistoryService

    ids = _issue_ids(app)
    status = _prepared(app, ids, action=f"prepare-{boundary}")
    provider = CountingProvider()
    _install(app, provider)

    if boundary == "writer_response":
        monkeypatch.setattr(generation, "_commit", lambda *_args, **_kwargs: (_ for _ in ()).throw(ProcessDeath()))
    elif boundary == "recommendation":
        original = RecommendationService.propose
        def crash_recommendation(self, *args, **kwargs):
            original(self, *args, **kwargs)
            raise ProcessDeath()
        monkeypatch.setattr(RecommendationService, "propose", crash_recommendation)
    elif boundary == "dossier":
        original = generation._commit
        def crash_dossier(*args, **kwargs):
            original(*args, **kwargs)
            raise ProcessDeath()
        monkeypatch.setattr(generation, "_commit", crash_dossier)
    else:
        original = ChatHistoryService.upsert_run_assistant
        def crash_conversation(self, *args, **kwargs):
            original(self, *args, **kwargs)
            raise ProcessDeath()
        monkeypatch.setattr(ChatHistoryService, "upsert_run_assistant", crash_conversation)

    response = await _post_start(app, status, action=f"start-{boundary}")
    assert response.status_code == 202, response.text
    await _wait(app)
    crashed = app.dossier_requests.get(MATTER, status["request_id"])
    assert crashed["state"] == "running" and not crashed["publications"]
    proposal = RecommendationService(app.vault, app.matters).get(MATTER)["proposal"]
    origin = crashed["origin"]["conversation_id"]
    artifacts = {
        "proposal_id": (proposal or {}).get("version_id"),
        "revision_names": {path.name for path in app.vault.iter_files(app.matters.matter_path(MATTER) + "/dossier-revisions", {".md"})},
        "message_ids": {
            message["message_id"] for message in app.chat_history.get(MATTER, origin)["messages"]
            if str(message.get("run_id") or "").startswith(status["request_id"] + ":batch:")
        },
    }
    monkeypatch.undo()

    reopened = AppContext(app.settings)
    replay_provider = CountingProvider()
    _install(reopened, replay_provider)
    interrupted = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert (await _post_resume(reopened, interrupted)).status_code == 202
    await _wait(reopened)
    return reopened, status, replay_provider, artifacts


@pytest.mark.asyncio
@pytest.mark.parametrize("boundary", ["writer_response", "recommendation", "dossier", "conversation"])
async def test_publication_boundaries_replay_without_duplicates(app_context, monkeypatch, boundary):
    reopened, original, replay_provider, artifacts = await _crash_and_resume_publication(app_context, monkeypatch, boundary)
    final = reopened.dossier_requests.get(MATTER, original["request_id"])
    assert final["state"] == "completed"
    assert len(final["publications"]) == 1
    revision_paths = [path for path in reopened.vault.iter_files(reopened.matters.matter_path(MATTER) + "/dossier-revisions", {".md"})]
    assert len({path.name for path in revision_paths}) == len(revision_paths)
    origin = final["origin"]["conversation_id"]
    messages = reopened.chat_history.get(MATTER, origin)["messages"]
    batch_messages = [message for message in messages if str(message.get("run_id") or "").startswith(original["request_id"] + ":batch:")]
    assert len(batch_messages) == 1
    proposal = RecommendationService(reopened.vault, reopened.matters).get(MATTER)["proposal"]
    assert (proposal or {}).get("research_publication", {}).get("dossier_request_id") == original["request_id"]
    assert replay_provider.research_calls == 0, "completed child calls are never repeated during publication recovery"
    if artifacts["proposal_id"]:
        assert proposal["version_id"] == artifacts["proposal_id"]
    if boundary in {"dossier", "conversation"}:
        assert {path.name for path in revision_paths} == artifacts["revision_names"]
    if artifacts["message_ids"]:
        assert {message["message_id"] for message in batch_messages} == artifacts["message_ids"]
    if boundary in {"writer_response", "dossier", "conversation"}:
        assert replay_provider.writer_calls == 0, "a saved writer result is replayed without another model call"


@pytest.mark.asyncio
async def test_stop_race_is_durable_and_new_request_can_reuse_matter(app_context):
    app = app_context
    gate = asyncio.Event()
    provider = CountingProvider(gate)
    _install(app, provider)
    first = _prepared(app, _issue_ids(app, 1), action="prepare-stop")
    assert (await _post_start(app, first, action="start-stop")).status_code == 202
    await asyncio.wait_for(provider.entered.wait(), timeout=2)

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)), base_url="http://test") as client:
        current = app.dossier_requests.get(MATTER, first["request_id"])
        stop_task = asyncio.create_task(client.post(
            f"/api/matters/{MATTER}/dossier-requests/{first['request_id']}/stop",
            json={"expected_sequence": current["sequence"]},
        ))
        for _ in range(100):
            if app.dossier_requests.get(MATTER, first["request_id"])["stop_requested"]:
                break
            await asyncio.sleep(0.01)
        gate.set()
        stopped = await stop_task
    assert stopped.status_code == 200, stopped.text
    assert app.dossier_requests.get(MATTER, first["request_id"])["state"] == "stopped"

    next_provider = CountingProvider()
    _install(app, next_provider)
    second = _prepared(app, _issue_ids(app, 1), action="prepare-after-stop")
    assert (await _post_start(app, second, action="start-after-stop")).status_code == 202
    await _wait(app)
    assert app.dossier_requests.get(MATTER, second["request_id"])["state"] == "completed"

    reopened = AppContext(app.settings)
    no_calls = CountingProvider()
    _install(reopened, no_calls)
    completed = reopened.dossier_requests.get(MATTER, second["request_id"])
    assert completed["state"] == "completed"
    response = await _post_resume(reopened, completed)
    assert response.status_code == 202 and response.json()["state"] == "completed"
    assert no_calls.research_calls == no_calls.writer_calls == 0
