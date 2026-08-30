from __future__ import annotations

from datetime import UTC, datetime

import pytest

from app.models.api import MatterCreate


def test_sample_matters_index_and_stage_move(app_context):
    matters = app_context.matters.list()
    assert len(matters) >= 6
    apex = next(matter for matter in matters if matter["matter_id"] == "MAT-DEMO-APEX")
    assert apex["status"] == "explore"

    updated = app_context.matters.move_stage(apex["matter_id"], "generate", reason="Test move")
    assert updated["status"] == "generate"
    record = app_context.vault.read_markdown(f"{updated['path']}/matter.md")
    assert record["metadata"]["status"] == "generate"


def test_create_matter_builds_structured_folder(app_context):
    created = app_context.matters.create(
        MatterCreate(
            title="Test Product Change",
            request_text="Can we launch the new setting next week?",
            matter_type="product_change",
            legal_owner="Counsel",
        )
    )
    assert created["status"] == "intake"
    assert app_context.vault.exists(f"{created['path']}/request.md")
    assert app_context.vault.exists(f"{created['path']}/facts.md")
    assert app_context.vault.exists(f"{created['path']}/work-items")
    request = app_context.vault.read_markdown(f"{created['path']}/request.md")
    assert request["metadata"]["immutable"] is True


def test_response_approval_delivery_and_closure_are_separate(app_context):
    created = app_context.matters.create(
        MatterCreate(
            title="Customer response lifecycle",
            request_text="Prepare and send the customer response.",
            legal_owner="Counsel",
        )
    )
    matter_id = created["matter_id"]
    app_context.matters.move_stage(matter_id, "respond", reason="Draft is ready")

    with pytest.raises(ValueError, match="approved"):
        app_context.matters.perform_action(matter_id, "mark_as_sent")
    with pytest.raises(ValueError, match="sent"):
        app_context.matters.perform_action(matter_id, "close_matter")

    approved = app_context.matters.perform_action(matter_id, "approve_response")
    assert approved["status"] == "respond"
    assert approved["response_approved_at"]
    assert not approved["response_sent_at"]

    sent = app_context.matters.perform_action(matter_id, "mark_as_sent")
    assert sent["status"] == "respond"
    assert sent["response_sent_at"]

    with pytest.raises(ValueError, match="required work"):
        app_context.matters.perform_action(matter_id, "close_matter")

    app_context.matters.complete_open_work_items(matter_id)
    closed = app_context.matters.perform_action(matter_id, "close_matter")
    assert closed["status"] == "closed"
    assert closed["closed_at"]


def test_stage_move_cannot_bypass_matter_closure(app_context):
    with pytest.raises(ValueError, match="close matter action"):
        app_context.matters.move_stage("MAT-DEMO-HARBOR", "closed")


def test_matter_orientation_uses_dossier_and_has_safe_fallbacks(app_context):
    relay = app_context.matters.get("MAT-DEMO-RELAY")
    assert relay["orientation"]["summary"].startswith("Relay is moving about 280,000 customers")
    assert relay["orientation"]["decision_question"].startswith("Should Relay let existing bank connections")
    assert relay["orientation"]["open_questions"][0] == "Which institutions still use stored credentials?"

    beacon = app_context.matters.get("MAT-DEMO-BEACON")
    assert beacon["orientation"]["summary"] == beacon["description"]
    assert beacon["orientation"]["decision_question"] == beacon["next_action"]
    assert beacon["orientation"]["open_questions"] == beacon["orientation"]["attention"]


def test_list_and_detail_share_work_state_and_track_saved_research_run(app_context, monkeypatch):
    monkeypatch.setattr(
        "app.services.matter_state.utc_now",
        lambda: datetime(2026, 8, 29, 12, 0, tzinfo=UTC),
    )
    matter_id = "MAT-DEMO-BEACON"
    detail = app_context.matters.get(matter_id)
    listed = next(item for item in app_context.matters.list() if item["matter_id"] == matter_id)

    assert listed["work_state"] == detail["work_state"]
    assert detail["work_state"]["signal"]["kind"] != "agent_working"
    assert detail["orientation"]["next_action"] == detail["work_state"]["next_action"]

    matter_path = f"{detail['path']}/matter.md"
    matter_before = app_context.vault.resolve(matter_path).read_bytes()
    run_path = f"{detail['path']}/research/runs/RUN-INTEGRATION.md"
    app_context.vault.write_markdown(
        run_path,
        "# Research run RUN-INTEGRATION\n\nResearch is running.\n",
        {
            "run_id": "RUN-INTEGRATION",
            "matter_id": matter_id,
            "state": "running",
            "created_at": "2026-08-28T12:00:00+00:00",
        },
    )

    running_detail = app_context.matters.get(matter_id)
    running_listed = next(item for item in app_context.matters.list() if item["matter_id"] == matter_id)
    assert running_detail["work_state"]["signal"]["kind"] == "agent_working"
    assert running_listed["work_state"] == running_detail["work_state"]
    assert app_context.vault.resolve(matter_path).read_bytes() == matter_before

    app_context.vault.update_markdown(run_path, metadata_updates={"state": "completed"})
    completed = app_context.matters.get(matter_id)
    assert completed["work_state"]["signal"]["kind"] == "waiting_on_owner"
    assert completed["work_state"]["signal"]["label"] == "Waiting on Brian Harris"


def test_stage_move_uses_matter_state_default_next_action(app_context):
    updated = app_context.matters.move_stage("MAT-DEMO-BEACON", "generate", reason="Test default")
    record = app_context.vault.read_markdown(f"{updated['path']}/matter.md")

    assert record["metadata"]["next_action"] == app_context.matter_state.default_next_action("generate")
