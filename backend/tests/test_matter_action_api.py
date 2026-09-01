import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import MatterCreate
from app.routers import matters


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


def test_research_run_api_forwards_source_action_key(app_context, monkeypatch):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    captured = {}

    def start(matter_id, questions, *, source_action_key=None):
        captured.update({
            "matter_id": matter_id,
            "questions": questions,
            "source_action_key": source_action_key,
        })
        return {"run_id": "RUN-1", "source_action_key": source_action_key}

    monkeypatch.setattr(app_context.research_runs, "start", start)

    response = client.post(
        "/api/matters/MAT-DEMO-BEACON/research-runs",
        json={"question": "Check the rule", "source_action_key": "chat:RUN-1:tool-2"},
    )

    assert response.status_code == 202
    assert response.json()["source_action_key"] == "chat:RUN-1:tool-2"
    assert captured == {
        "matter_id": "MAT-DEMO-BEACON",
        "questions": ["Check the rule"],
        "source_action_key": "chat:RUN-1:tool-2",
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
