"""HTTP and runtime integration for research-first dossier requests."""
from __future__ import annotations

import asyncio
import json

import httpx
import pytest
from fastapi import FastAPI

from app.models.api import ChatRequest
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderReply, ProviderSelection
from app.routers import chat, dossier_requests, matters
from app.services.dossier_requests import DossierRequestService


MATTER = "MAT-DEMO-BEACON"


def _api(context) -> FastAPI:
    app = FastAPI()
    app.state.context = context
    for module in (chat, dossier_requests, matters):
        app.include_router(module.router, prefix="/api")
    return app


class ScriptedDossierProvider:
    def __init__(self, issue_ids: list[str]):
        self.issue_ids = issue_ids
        self.calls: list[list[dict]] = []
        self.research_started = asyncio.Event()
        self.release_research = asyncio.Event()

    async def complete(self, messages, tools=None):
        self.calls.append(messages)
        blob = "\n".join(str(message.get("content") or "") for message in messages)
        if "Prepare the dossier plan for this matter" in blob:
            issue_map = [
                {
                    "issue_id": issue_id,
                    "title": f"Issue {position}",
                    "why_it_matters": "It can change the launch path.",
                    "initial_answer": "The answer depends on the saved facts.",
                    "next_action": "Research the controlling conditions.",
                    "focused_topic": f"public topic {position}",
                    "fact_ids": [],
                    "parent_issue_id": None,
                    "urgent": position == 1,
                }
                for position, issue_id in enumerate(self.issue_ids, start=1)
            ]
            plan = {
                "issue_map": issue_map,
                "priorities": [
                    {"key": f"p{position}", "text": f"Priority {position}", "why": "Material", "issue_ids": [issue_id]}
                    for position, issue_id in enumerate(self.issue_ids[:3], start=1)
                ],
                "first_issue_ids": self.issue_ids[:3],
                "overall_topic": "synthetic product launch rules",
                "date_candidates": [],
                "conflicts": [],
            }
            return ProviderReply(content="## Suggested priorities\n\nReview these priorities.\n\n```dossier-plan\n" + json.dumps(plan) + "\n```")
        if "Dossier-generation action" in blob:
            return ProviderReply(content="# Dossier\n\n## Current position\n\nSaved material was composed.")
        if tools and "Research this issue for the dossier" in blob:
            self.research_started.set()
            await self.release_research.wait()
            return ProviderReply(content="The saved facts support a conditional answer for this issue.")
        return ProviderReply(content="Normal chat answer.")


def _install_provider(context, provider) -> None:
    def resolve(agent):
        return ResolvedAgentProvider(
            provider,
            ProviderSelection(agent.agent_id, "mock", "mock", "default"),
        )

    context.runner.provider_resolver = resolve
    context.research_runs.resolve_main = lambda: context.runner.resolve("counsel-copilot")
    context.research_runs.resolve_agent = lambda: context.runner.resolve("research-agent")
    context.research_runs.resolve_selection = lambda selection: ResolvedAgentProvider(provider, selection)


def _start_payload(status: dict, *, action: str = "start-1", mode: str = "research") -> dict:
    return {
        "execution_mode": mode,
        "expected_sequence": status["sequence"],
        "plan_revision": status["plan_revision"],
        "priorities": status["priorities"],
        "first_issue_ids": status["first_issue_ids"],
        "scope": "top_three" if mode == "research" else None,
        "source_choice": {
            "external": False,
            "other_matters": False,
            "public_query": "",
            "provider_ids": [],
            "native": False,
            "collection_enabled": False,
            "allow_firecrawl": False,
            "allow_followup_queries": False,
        },
        "accepted_candidate_keys": [],
        "source_action_key": action,
    }


async def _prepare(client: httpx.AsyncClient, context, *, action: str = "prepare-1") -> tuple[dict, dict]:
    response = await client.post(
        "/api/chat",
        json={
            "matter_id": MATTER,
            "message": "Generate a dossier for this matter.",
            "experimental_chat": True,
            "source_action_key": action,
        },
    )
    assert response.status_code == 200, response.text
    body = response.json()
    card = next(card for card in body["cards"] if card["type"] == "dossier_research")
    status = card["status"]
    return body, status


@pytest.mark.asyncio
async def test_generate_returns_saved_setup_and_read_endpoints_are_passive(app_context, monkeypatch):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        body, status = await _prepare(client, app_context)
        assert status["state"] == "awaiting_choices"
        assert status["origin"]["conversation_id"] == body["conversation_id"]
        calls = len(provider.calls)
        for _ in range(2):
            fetched = await client.get(f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}")
            assert fetched.status_code == 200
        monkeypatch.setattr(
            app_context.matters,
            "get",
            lambda *_args, **_kwargs: pytest.fail("Dossier request GET must not use the repairing matter getter"),
        )
        listed = await client.get(
            f"/api/matters/{MATTER}/dossier-requests",
            params={"conversation_id": body["conversation_id"]},
        )
        assert [item["request_id"] for item in listed.json()["requests"]] == [status["request_id"]]
        assert len(provider.calls) == calls
        monkeypatch.undo()
        reloaded = DossierRequestService(app_context).get(MATTER, status["request_id"])
        assert reloaded["request_id"] == status["request_id"]

        repeated, repeated_status = await _prepare(client, app_context)
        assert repeated_status["request_id"] == status["request_id"]
        assert repeated["conversation_id"] == body["conversation_id"]
        assert len(provider.calls) == calls


@pytest.mark.asyncio
async def test_start_returns_202_before_research_finishes_and_reload_restores_progress(app_context):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        _, status = await _prepare(client, app_context)
        payload = _start_payload(status)
        started = await asyncio.wait_for(
            client.post(f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start", json=payload),
            timeout=1,
        )
        assert started.status_code == 202, started.text
        assert started.json()["state"] == "running"
        await asyncio.wait_for(provider.research_started.wait(), timeout=2)
        assert app_context.dossier_requests.has_active_work

        calls = len(provider.calls)
        polled = await client.get(f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}")
        assert polled.status_code == 200 and polled.json()["state"] == "running"
        assert len(provider.calls) == calls
        assert DossierRequestService(app_context).get(MATTER, status["request_id"])["state"] == "running"

        replay = await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start", json=payload
        )
        assert replay.status_code == 202
        different_action = {**payload, "source_action_key": "different-start"}
        conflict = await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start",
            json=different_action,
        )
        assert conflict.status_code == 409
        assert {child["run_id"] for child in app_context.research_runs.managed_children(MATTER, status["request_id"])}

        provider.release_research.set()
        await app_context.dossier_requests.wait_for_active_work()
        await app_context.research_runs.wait_for_active_work()


@pytest.mark.asyncio
async def test_start_one_unselected_issue_during_research_and_after_completion(app_context):
    from tests.manual.serve_dossier_research import seed_matter

    ids = seed_matter(app_context)
    provider = ScriptedDossierProvider(ids)
    _install_provider(app_context, provider)
    service = app_context.dossier_requests
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app_context)), base_url="http://test") as client:
        _, status = await _prepare(client, app_context)
        path = f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}"
        assert (await client.post(path + "/start", json=_start_payload(status))).status_code == 202
        await asyncio.wait_for(provider.research_started.wait(), timeout=2)
        original_task = service._active[status["request_id"]]
        original_children = app_context.research_runs.managed_children(MATTER, status["request_id"])
        choice = {"plan_revision": status["plan_revision"]}
        try:
            assert (await client.post(path + f"/issues/{ids[3]}/start", json={"plan_revision": "old"})).status_code == 409
            assert (await client.post(path + "/issues/not-in-plan/start", json=choice)).status_code == 400
            added = await client.post(path + f"/issues/{ids[3]}/start", json=choice)
            assert added.status_code == 202, added.text
            progress = added.json()
            assert progress["planned_issue_ids"] == ids[:4]
            assert next(row for row in progress["issues"] if row["issue_id"] == ids[3])["state"] == "queued"
            assert next(row for row in progress["issues"] if row["issue_id"] == ids[4])["state"] == "not_selected"
            assert service._active[status["request_id"]] is original_task, "adding an issue keeps the existing coordinator"
            replay = await client.post(path + f"/issues/{ids[3]}/start", json=choice)
            assert replay.status_code == 202
            assert replay.json()["sequence"] == progress["sequence"], "repeat clicks do not queue duplicate work"
            assert DossierRequestService(app_context).get(MATTER, status["request_id"])["planned_issue_ids"] == ids[:4]
            children = app_context.research_runs.managed_children(MATTER, status["request_id"])
            assert len(children) == 4
            new_child = next(child for child in children if child["issue_id"] == ids[3])
            for field in ("main_selection", "collector_selection", "search_scope"):
                assert new_child[field] == original_children[0][field], "the saved model and source choices carry over"
        finally:
            provider.release_research.set()
            await service.wait_for_active_work()
            await app_context.research_runs.wait_for_active_work()

        first = service.get(MATTER, status["request_id"])
        assert first["state"] == "completed", first["last_error"]
        assert [pub["issue_ids"] for pub in first["publications"]] == [ids[:3], [ids[3]]]
        assert first["counts"]["not_selected"] == 1
        original_packets = {row["issue_id"]: row["packet_path"] for row in first["issues"] if row["packet_path"]}

        # A later click extends the same saved request, without republishing
        # earlier one-issue batches or rerunning their completed children.
        later = await client.post(path + f"/issues/{ids[4]}/start", json=choice)
        assert later.status_code == 202, later.text
        await service.wait_for_active_work()
        final = service.get(MATTER, status["request_id"])
        assert final["state"] == "completed", final["last_error"]
        assert [pub["issue_ids"] for pub in final["publications"]] == [ids[:3], [ids[3]], [ids[4]]]
        assert all(row["packet_path"] == original_packets[row["issue_id"]] for row in final["issues"] if row["issue_id"] in original_packets)
        assert len(app_context.research_runs.managed_children(MATTER, status["request_id"])) == 5
        calls = len(provider.calls)
        assert (await client.post(path + f"/issues/{ids[4]}/start", json=choice)).status_code == 202
        assert len(provider.calls) == calls and not service.has_active_work


@pytest.mark.asyncio
async def test_start_issue_requires_saved_research_choices_and_respects_other_owner(app_context):
    from tests.manual.serve_dossier_research import seed_matter

    ids = seed_matter(app_context)
    provider = ScriptedDossierProvider(ids)
    _install_provider(app_context, provider)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app_context)), base_url="http://test") as client:
        _, status = await _prepare(client, app_context)
        path = f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}"
        choice = {"plan_revision": status["plan_revision"]}
        assert (await client.post(path + f"/issues/{ids[3]}/start", json=choice)).status_code == 409
        provider.release_research.set()
        assert (await client.post(path + "/start", json=_start_payload(status))).status_code == 202
        await app_context.dossier_requests.wait_for_active_work()
        before = app_context.dossier_requests.get(MATTER, status["request_id"])
        app_context.research_runs.acquire_matter_ownership(MATTER, "DOR-other")
        try:
            assert (await client.post(path + f"/issues/{ids[3]}/start", json=choice)).status_code == 409
            assert app_context.dossier_requests.get(MATTER, status["request_id"]) == before
            assert len(app_context.research_runs.managed_children(MATTER, status["request_id"])) == 3
        finally:
            app_context.research_runs.release_matter_ownership(MATTER, "DOR-other")


@pytest.mark.asyncio
async def test_add_web_research_preserves_internal_work_and_survives_reload(app_context, monkeypatch):
    from tests.manual.serve_dossier_research import install_fixture_boundaries, seed_matter

    ids = seed_matter(app_context)
    boundary = install_fixture_boundaries(app_context, ids, monkeypatch)
    service = app_context.dossier_requests
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app_context)), base_url="http://test") as client:
        _, status = await _prepare(client, app_context)
        path = f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}"
        assert (await client.post(path + "/start", json=_start_payload(status))).status_code == 202
        original_children = app_context.research_runs.managed_children(MATTER, status["request_id"])
        web_path = path + f"/issues/{ids[0]}/web-research"
        payload = {"plan_revision": status["plan_revision"], "source_choice": {"external": True, "native": True, "public_query": "public employment launch rules"}}
        try:
            assert not boundary.discoveries
            invalid = {**payload, "source_choice": {"external": False}}
            assert (await client.post(web_path, json=invalid)).status_code == 400
            blank = {**payload, "source_choice": {"external": True, "native": True}}
            assert (await client.post(web_path, json=blank)).status_code == 400
            response = await client.post(web_path, json=payload)
            assert response.status_code == 202, response.text
            web = response.json()
            assert web["state"] == "queued", "web research waits for the existing parent work"
            assert web["issue_id"] == ids[0] and web["search_scope"]["external"] is True
            assert web["search_scope"]["public_query"] == "public employment launch rules"
            assert web["search_scope"]["other_matters"] is False
            assert web["run_id"] not in {child["run_id"] for child in original_children}
            replay = await client.post(web_path, json=payload)
            assert replay.status_code == 202 and replay.json()["run_id"] == web["run_id"]
            reloaded = DossierRequestService(app_context).get(MATTER, status["request_id"])
            assert next(row for row in reloaded["issues"] if row["issue_id"] == ids[0])["web_run_id"] == web["run_id"]
            assert reloaded["source_scope"]["external"] is False
            assert reloaded["planned_issue_ids"] == ids[:3]
            assert len(app_context.research_runs.managed_children(MATTER, status["request_id"])) == 3
        finally:
            boundary.first_release.set()
            boundary.remaining_release.set()
            await asyncio.wait_for(service.wait_for_active_work(), timeout=15)
            await asyncio.wait_for(app_context.research_runs.wait_for_active_work(), timeout=15)
        result = app_context.research_runs.get(MATTER, web["run_id"])
        assert result["state"] == "completed", result.get("failure_detail")
        assert result["results"] and result["results"][0]["path"]
        assert boundary.discoveries and boundary.fetches, "the added run uses the public-search and fetch boundaries"
        assert all(app_context.research_runs.get(MATTER, child["run_id"])["results"] for child in original_children)


@pytest.mark.asyncio
async def test_start_validates_stale_invalid_conflicting_and_wrong_matter_requests(app_context):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        _, status = await _prepare(client, app_context)
        path = f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start"

        stale = _start_payload(status)
        stale["plan_revision"] = "older-plan"
        assert (await client.post(path, json=stale)).status_code == 409

        invalid = _start_payload(status)
        invalid["first_issue_ids"] = ["ISS-NOT-IN-PLAN"]
        assert (await client.post(path, json=invalid)).status_code == 400

        missing = await client.get(f"/api/matters/{MATTER}/dossier-requests/DOR-not-found")
        assert missing.status_code == 404
        other = next(item["matter_id"] for item in app_context.matters.list() if item["matter_id"] != MATTER)
        wrong = await client.get(f"/api/matters/{other}/dossier-requests/{status['request_id']}")
        assert wrong.status_code == 404

        first = await client.post(
            path, json=_start_payload(status, action="shared-start", mode="saved_only")
        )
        assert first.status_code == 202
        _, sibling = await _prepare(client, app_context, action="prepare-2")
        conflict = await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{sibling['request_id']}/start",
            json=_start_payload(sibling, action="shared-start", mode="saved_only"),
        )
        assert conflict.status_code == 409


@pytest.mark.asyncio
async def test_preview_and_saved_only_use_writer_without_starting_research(app_context):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        preview = await client.post(
            "/api/chat",
            json={"matter_id": MATTER, "message": "Generate dossier without saving.", "experimental_chat": True},
        )
        assert preview.status_code == 200
        assert preview.json()["cards"] == []
        assert "Dossier preview generated" in preview.json()["reply"]
        assert app_context.dossier_requests.list(MATTER) == []
        assert app_context.research_runs.list(MATTER) == []

        _, status = await _prepare(client, app_context, action="saved-setup")
        saved_only = await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start",
            json=_start_payload(status, action="saved-only-1", mode="saved_only"),
        )
        assert saved_only.status_code == 202, saved_only.text
        assert saved_only.json()["state"] == "running"
        assert saved_only.json()["execution_mode"] == "saved_only"
        await app_context.dossier_requests.wait_for_active_work()
        completed = app_context.dossier_requests.get(MATTER, status["request_id"])
        assert completed["state"] == "completed"
        assert completed["publications"][0]["revision_path"]
        assert app_context.research_runs.managed_children(MATTER, status["request_id"]) == []


@pytest.mark.asyncio
async def test_explicit_saved_material_only_chat_uses_writer_directly(app_context):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={
                "matter_id": MATTER,
                "message": "Generate the dossier using saved material only.",
                "experimental_chat": True,
                "source_action_key": "direct-saved-only",
            },
        )

        assert response.status_code == 200, response.text
        assert response.json()["cards"] == []
        assert "Dossier generated and saved" in response.json()["reply"]
        assert app_context.dossier_requests.list(MATTER) == []
        assert app_context.research_runs.list(MATTER) == []
        assert len(provider.calls) == 1
        assert "Dossier-generation action" in str(provider.calls[0])


@pytest.mark.asyncio
async def test_resume_rejects_a_different_active_parent_owner(app_context):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        _, stopped_request = await _prepare(client, app_context, action="prepare-stopped")
        stopped_path = f"/api/matters/{MATTER}/dossier-requests/{stopped_request['request_id']}"
        started = await client.post(
            stopped_path + "/start",
            json=_start_payload(stopped_request, action="start-stopped"),
        )
        assert started.status_code == 202, started.text
        await asyncio.wait_for(provider.research_started.wait(), timeout=2)
        current_stopped = (await client.get(stopped_path)).json()
        stopped = await client.post(
            stopped_path + "/stop",
            json={"expected_sequence": current_stopped["sequence"]},
        )
        assert stopped.status_code == 200, stopped.text
        assert stopped.json()["state"] == "stopped"

        provider.research_started.clear()
        _, active_request = await _prepare(client, app_context, action="prepare-active")
        active = await client.post(
            f"/api/matters/{MATTER}/dossier-requests/{active_request['request_id']}/start",
            json=_start_payload(active_request, action="start-active"),
        )
        assert active.status_code == 202, active.text
        await asyncio.wait_for(provider.research_started.wait(), timeout=2)

        resumed = await client.post(
            stopped_path + "/resume",
            json={"expected_sequence": stopped.json()["sequence"]},
        )
        assert resumed.status_code == 409, resumed.text
        assert (await client.get(stopped_path)).json()["state"] == "stopped"

        provider.release_research.set()
        await app_context.dossier_requests.wait_for_active_work()
        await app_context.research_runs.wait_for_active_work()


@pytest.mark.asyncio
async def test_normal_chat_and_dossier_card_source_records_survive_run_and_conversation_reload(app_context, monkeypatch):
    issue_ids = [item["issue_id"] for item in app_context.workspace.issues(MATTER)]
    provider = ScriptedDossierProvider(issue_ids)
    _install_provider(app_context, provider)
    app = _api(app_context)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        normal = await client.post(
            "/api/chat",
            json={"matter_id": MATTER, "message": "Explain the current next step.", "experimental_chat": True},
        )
        assert normal.status_code == 200
        assert normal.json()["reply"] == "Normal chat answer."

        source = {"source_id": "FACT-1", "source_label": "Reported fact · pilot", "source_class": "reported_fact"}
        original = chat.execute_chat

        async def with_source_records(*args, **kwargs):
            response = await original(*args, **kwargs)
            if any(card.type == "dossier_research" for card in response.cards):
                response.source_records = [source]
            return response

        monkeypatch.setattr(chat, "execute_chat", with_source_records)
        started = await client.post(
            f"/api/matters/{MATTER}/chat-runs",
            json={"matter_id": MATTER, "message": "Generate dossier", "experimental_chat": True, "source_action_key": "durable-dossier"},
        )
        assert started.status_code == 202
        await app_context.chat_runs.wait(started.json()["run_id"])
        completed = await client.get(f"/api/matters/{MATTER}/chat-runs/{started.json()['run_id']}")
        response = completed.json()["response"]
        assert response["cards"][0]["type"] == "dossier_research"
        assert response["source_records"] == [source]
        conversation = await client.get(
            f"/api/matters/{MATTER}/conversations/{completed.json()['conversation_id']}"
        )
        assistant = conversation.json()["messages"][-1]
        assert assistant["cards"] == response["cards"]
        assert assistant["source_records"] == [source]
