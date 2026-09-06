import asyncio

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import MatterCreate
from app.routers import matters
from app.runtime import AppContext


@pytest.mark.asyncio
async def test_create_matter_returns_before_blocked_intake_start_and_reload_recovers_ids(
    app_context, monkeypatch
):
    started = asyncio.Event()
    release = asyncio.Event()
    original_start = matters._start_intake_safely

    async def blocked_start(context, matter_id, request_text):
        started.set()
        await release.wait()
        await original_start(context, matter_id, request_text)

    monkeypatch.setattr(matters, "_start_intake_safely", blocked_start)
    route_task = asyncio.create_task(matters.create_matter(
        MatterCreate(title="Immediate durable matter", request_text="Assess this launch."),
        app_context,
    ))

    await asyncio.wait_for(started.wait(), timeout=1)
    returned_before_release = route_task.done()
    active_while_blocked = app_context.has_active_work()
    release.set()
    created = await route_task
    await app_context.wait_for_intake_starts()

    assert returned_before_release is True
    assert active_while_blocked is True
    assert created["creation_status"] == "changed"
    assert created["intake_conversation_id"] is None
    assert created["intake_run_id"] is None
    reloaded = app_context.matters.get(created["matter_id"])
    assert reloaded["intake_conversation_id"]
    assert reloaded["intake_run_id"]
    await app_context.chat_runs.wait(reloaded["intake_run_id"])


def test_work_item_complete_api_requires_actor_and_returns_frozen_shape(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    matter = app_context.matters.create(MatterCreate(title="API lifecycle", request_text="Do work."))
    item = app_context.index.list_work_items(matter["matter_id"])[0]
    response = client.post(f"/api/matters/{matter['matter_id']}/work-items/complete", json={"work_item_id": item["work_item_id"], "actor": "Counsel"})
    assert response.status_code == 200
    assert response.json()["action"] == "complete_work_item"
    assert response.json()["work_item_id"] == item["work_item_id"]
    assert client.post(f"/api/matters/{matter['matter_id']}/work-items/complete", json={"work_item_id": item["work_item_id"]}).status_code == 422


def test_create_matter_api_persists_target_date_in_matter_and_request(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)

    response = client.post("/api/matters", json={
        "title": "Target date transport",
        "request_text": "Can this launch on the selected date?",
        "target_date": "2026-09-15",
    })

    assert response.status_code == 201
    created = response.json()
    matter = app_context.vault.read_markdown(f"{created['path']}/matter.md")
    request = app_context.vault.read_markdown(f"{created['path']}/request.md")
    assert created["target_date"] == "2026-09-15"
    assert matter["metadata"]["target_date"] == "2026-09-15"
    assert request["metadata"]["requested_launch_date"] == "2026-09-15"
    assert created["creation_status"] == "changed"
    assert created["creation_summary"] == "Matter created; intake is starting."
    assert app_context.index.get_matter(created["matter_id"])["target_date"] == "2026-09-15"

    restarted = AppContext(app_context.settings, recover_interrupted=False)
    reloaded = restarted.matters.get(created["matter_id"])
    assert reloaded["target_date"] == "2026-09-15"
    assert restarted.vault.read_markdown(f"{reloaded['path']}/matter.md")["metadata"]["target_date"] == "2026-09-15"
    assert restarted.vault.read_markdown(f"{reloaded['path']}/request.md")["metadata"]["requested_launch_date"] == "2026-09-15"


def test_create_matter_source_action_key_prevents_repeat_duplicate(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    payload = {
        "title": "Retry-safe creation",
        "request_text": "Can this launch?",
        "source_action_key": "matter-create:form:retry-1",
    }

    first = client.post("/api/matters", json=payload)
    retry = client.post("/api/matters", json=payload)

    assert first.status_code == retry.status_code == 201
    assert retry.json()["matter_id"] == first.json()["matter_id"]
    assert len([
        item for item in app_context.matters.list()
        if item["title"] == "Retry-safe creation"
    ]) == 1


@pytest.mark.parametrize("issue_id", [None, "ISS-TARGET"])
def test_research_run_api_forwards_source_action_key(app_context, monkeypatch, issue_id):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    captured = {}

    def start(matter_id, questions, *, source_action_key=None, issue_id=None):
        captured.update({
            "matter_id": matter_id,
            "questions": questions,
            "source_action_key": source_action_key,
            "issue_id": issue_id,
        })
        return {"run_id": "RUN-1", "source_action_key": source_action_key}

    monkeypatch.setattr(app_context.research_runs, "start", start)

    response = client.post(
        "/api/matters/MAT-DEMO-BEACON/research-runs",
        json={"question": "Check the rule", "source_action_key": "chat:RUN-1:tool-2", "issue_id": issue_id},
    )

    assert response.status_code == 202
    assert response.json()["source_action_key"] == "chat:RUN-1:tool-2"
    assert captured == {
        "matter_id": "MAT-DEMO-BEACON",
        "questions": ["Check the rule"],
        "source_action_key": "chat:RUN-1:tool-2",
        "issue_id": issue_id,
    }


def test_finalize_moves_generate_to_respond_and_retry_is_idempotent(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    matter_id = "MAT-DEMO-BEACON"
    app_context.matters.move_stage(matter_id, "generate", reason="Ready to draft")
    draft = app_context.work_products.create_draft(
        matter_id, title="Response", content="Ready for review"
    )
    stage_events_before = len([
        event for event in app_context.matters.get(matter_id)["events"]
        if event.get("event_type") == "stage_changed"
    ])

    first = client.post(
        f"/api/matters/{matter_id}/work-product/finalize",
        json={"draft_path": draft["vault_path"]},
    )
    retry = client.post(
        f"/api/matters/{matter_id}/work-product/finalize",
        json={"draft_path": draft["vault_path"]},
    )

    assert first.status_code == retry.status_code == 200
    assert retry.json()["vault_path"] == first.json()["vault_path"]
    assert app_context.index.get_matter(matter_id)["status"] == "respond"
    stage_events_after = [
        event for event in app_context.matters.get(matter_id)["events"]
        if event.get("event_type") == "stage_changed"
    ]
    assert len(stage_events_after) == stage_events_before + 1
    assert first.json()["status"] == "changed"
    assert retry.json()["status"] == "no_change"
    assert first.json()["resulting_matter_state"]["next_action"] == "Approve the final response."


def test_create_work_product_draft_api_persists_canonical_deliverable(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    matter_id = "MAT-DEMO-BEACON"

    response = client.post(
        f"/api/matters/{matter_id}/work-product/draft",
        json={"title": "Customer response", "content": "Full reviewed deliverable body."},
    )

    assert response.status_code == 201
    result = response.json()
    saved = app_context.vault.read_markdown(result["vault_path"])
    matter = app_context.matters.get(matter_id)
    assert saved["content"].strip() == "Full reviewed deliverable body."
    assert saved["metadata"]["record_type"] == "work_product"
    assert saved["metadata"]["state"] == "draft"
    assert matter["current_work_product_draft_path"] == result["vault_path"]
    assert matter["current_work_product_id"] == result["work_product_id"]
    assert result["vault_path"] in result["changed_paths"]
    assert f"{matter['path']}/matter.md" in result["changed_paths"]


def test_create_work_product_draft_api_rejects_blank_content_without_writing(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    matter_id = "MAT-DEMO-BEACON"
    draft_folder = app_context.vault.resolve(
        "03_Matters/beacon-instant-onboarding/work-product/draft"
    )
    before = list(draft_folder.glob("*.md")) if draft_folder.exists() else []

    response = client.post(
        f"/api/matters/{matter_id}/work-product/draft",
        json={"title": "Customer response", "content": "   "},
    )

    after = list(draft_folder.glob("*.md")) if draft_folder.exists() else []
    assert response.status_code == 422
    assert after == before


@pytest.mark.parametrize(("matter_id", "expected_stage"), [
    ("MAT-DEMO-BEACON", "respond"),
])
def test_finalize_does_not_move_a_later_stage_backward(app_context, matter_id, expected_stage):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    draft = app_context.work_products.create_draft(
        matter_id, title="Response", content="Ready for review"
    )
    if expected_stage == "respond":
        app_context.matters.move_stage(matter_id, "respond", reason="Already ready")

    response = client.post(
        f"/api/matters/{matter_id}/work-product/finalize",
        json={"draft_path": draft["vault_path"]},
    )

    assert response.status_code == 200
    assert app_context.index.get_matter(matter_id)["status"] == expected_stage


def test_closed_matter_requires_reopen_before_new_draft(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)

    response = client.post(
        "/api/matters/MAT-DEMO-MASON/work-product/draft",
        json={"title": "Response", "content": "Ready for review"},
    )

    assert response.status_code == 400
    assert "Reopen the matter" in response.json()["detail"]
