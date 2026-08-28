from __future__ import annotations

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
