from __future__ import annotations

from datetime import UTC, datetime

import pytest

from app.models.api import MatterCreate
from app.services.matter_lifecycle import MatterLifecycleService
from app.services.matter_participants import MatterParticipantService
from app.services.matter_work_items import MatterWorkItemService


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
            target_date="2026-09-15",
        )
    )
    assert created["status"] == "intake"
    assert app_context.vault.exists(f"{created['path']}/request.md")
    assert app_context.vault.exists(f"{created['path']}/facts.md")
    assert app_context.vault.exists(f"{created['path']}/work-items")
    request = app_context.vault.read_markdown(f"{created['path']}/request.md")
    assert request["metadata"]["immutable"] is True
    assert created["target_date"] == "2026-09-15"
    assert request["metadata"]["requested_launch_date"] == "2026-09-15"
    assert created["original_request"] == "Can we launch the new setting next week?"


def test_create_without_rebuild_returns_the_new_durable_matter(app_context, monkeypatch):
    rebuilds = []
    monkeypatch.setattr(app_context.index, "rebuild", lambda: rebuilds.append("rebuild"))

    created = app_context.matters.create(
        MatterCreate(title="Scheduled intake", request_text="Create this from one batch."), rebuild=False,
    )

    assert rebuilds == []
    assert created["matter_id"]
    assert app_context.vault.exists(f"{created['path']}/matter.md")


def test_batch_create_retry_does_not_rebuild_the_index(app_context, monkeypatch):
    rebuilds = []
    monkeypatch.setattr(app_context.index, "rebuild", lambda: rebuilds.append("rebuild"))
    request = MatterCreate(
        title="Idempotent scheduled intake", request_text="Create once.", source_action_key="schedule:batch:1",
    )

    first = app_context.matters.create(request, rebuild=False)
    retry = app_context.matters.create(request, rebuild=False)

    assert rebuilds == []
    assert retry["matter_id"] == first["matter_id"]
    assert retry["creation_already_recorded"] is True


def test_matter_facade_uses_focused_services_and_backfills_a_legacy_final_pointer(app_context):
    assert isinstance(app_context.matters._work_items, MatterWorkItemService)
    assert isinstance(app_context.matters._participants_service, MatterParticipantService)
    assert isinstance(app_context.matters._lifecycle, MatterLifecycleService)

    draft = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Legacy final", content="Final body"
    )
    final = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    matter_path = "03_Matters/beacon-instant-onboarding/matter.md"
    app_context.vault.update_markdown(matter_path, metadata_updates={
        "current_work_product_final_path": None, "current_work_product_final_id": None,
    })
    app_context.index.rebuild()

    detail = app_context.matters.get("MAT-DEMO-BEACON")
    saved = app_context.vault.read_markdown(matter_path)["metadata"]

    assert detail["current_work_product_final_path"] == final["vault_path"]
    assert saved["current_work_product_final_path"] == final["vault_path"]
    assert saved["current_work_product_final_id"] == final["final_id"]


def test_detail_keeps_complete_matter_frontmatter_after_index_rebuild(app_context):
    created = app_context.matters.create(
        MatterCreate(
            title="Jurisdiction persistence",
            request_text="Can this launch in the United States?",
            jurisdiction_scope=["United States"],
        )
    )

    app_context.index.rebuild()
    detail = app_context.matters.get(created["matter_id"])

    assert detail["jurisdiction_scope"] == ["United States"]


def test_active_intake_saved_question_is_the_resolved_next_action(app_context):
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    matter_path = f'{matter["path"]}/matter.md'
    app_context.vault.update_markdown(
        matter_path,
        metadata_updates={
            "intake_state": "active",
            "next_action": "Which countries are in scope?",
        },
    )
    app_context.index.rebuild()

    detail = app_context.matters.get("MAT-DEMO-BEACON")
    listed = next(
        item for item in app_context.matters.list()
        if item["matter_id"] == "MAT-DEMO-BEACON"
    )

    assert detail["work_state"]["next_action"] == "Which countries are in scope?"
    assert listed["work_state"]["next_action"] == "Which countries are in scope?"


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
    draft = app_context.work_products.create_draft(
        matter_id, title="Customer response", content="The approved customer response."
    )
    final = app_context.work_products.finalize(matter_id, draft["vault_path"])

    with pytest.raises(ValueError, match="approved"):
        app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    with pytest.raises(ValueError, match="sent"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")

    approved = app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    assert approved["matter"]["status"] == "respond"
    assert approved["matter"]["response_approved_at"]
    assert not approved["matter"]["response_sent_at"]

    sent = app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    assert sent["matter"]["status"] == "respond"
    assert sent["matter"]["response_sent_at"]

    with pytest.raises(ValueError, match="required work"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")

    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(matter_id, item["work_item_id"], actor="Counsel")
    closed = app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    assert closed["matter"]["status"] == "closed"
    assert closed["matter"]["closed_at"]


def test_approval_requires_final_linked_to_current_draft(app_context):
    created = app_context.matters.create(
        MatterCreate(title="Current final", request_text="Prepare the response.")
    )
    matter_id = created["matter_id"]
    app_context.matters.move_stage(matter_id, "respond")
    draft_a = app_context.work_products.create_draft(matter_id, title="Final A", content="A")
    final_a = app_context.work_products.finalize(matter_id, draft_a["vault_path"])
    assert app_context.matters.get(matter_id)["current_work_product_final_path"] == final_a["vault_path"]

    draft_b = app_context.work_products.create_draft(matter_id, title="Draft B", content="B")
    detail = app_context.matters.get(matter_id)
    assert detail["current_work_product_draft_path"] == draft_b["vault_path"]
    assert detail["current_work_product_final_path"] is None
    with pytest.raises(ValueError, match="current work-product draft"):
        app_context.matters.perform_action(
            matter_id, "approve_response", actor="Counsel", artifact_path=final_a["vault_path"]
        )


def test_latest_research_fallback_uses_metadata_time(app_context):
    created = app_context.matters.create(
        MatterCreate(title="Research order", request_text="Research the issue.")
    )
    base = created["path"]
    newer = f"{base}/research/a-newer.md"
    older = f"{base}/research/z-older.md"
    app_context.vault.write_markdown(newer, "# Newer", {
        "research_id": "RES-NEW", "matter_id": created["matter_id"], "created_at": "2026-08-31T12:00:00Z",
    })
    app_context.vault.write_markdown(older, "# Older", {
        "research_id": "RES-OLD", "matter_id": created["matter_id"], "created_at": "2026-08-30T12:00:00Z",
    })
    assert app_context.matters.get(created["matter_id"])["latest_research_path"] == newer


def test_stage_move_cannot_bypass_matter_closure(app_context):
    with pytest.raises(ValueError, match="close matter action"):
        app_context.matters.move_stage("MAT-DEMO-HARBOR", "closed")


def test_respond_without_current_final_does_not_claim_approval_is_available(app_context):
    matter = app_context.matters.create(
        MatterCreate(title="Respond without final", request_text="Prepare the response.")
    )
    app_context.matters.move_stage(matter["matter_id"], "respond")

    detail = app_context.matters.get(matter["matter_id"])

    assert detail["current_work_product_final_path"] is None
    assert detail["work_state"]["next_action"] != "Approve the final response."


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


def test_completed_intake_neutralizes_generic_orientation_work(app_context):
    created = app_context.matters.create(
        MatterCreate(title="Orientation cleanup", request_text="Can this launch?")
    )
    matter_path = f"{created['path']}/matter.md"
    app_context.vault.update_markdown(
        matter_path,
        metadata_updates={"intake_state": "complete", "next_action": "Review the dossier."},
    )

    detail = app_context.matters.get(created["matter_id"])

    orientation = next(item for item in detail["work_items"] if item["title"] == "Orient to the request")
    assert orientation["status"] == "done"
    assert detail["work_state"]["next_action"] == "Review the dossier."
    assert detail["orientation"]["headline"] == "Review the dossier."


def test_risk_update_is_persisted_and_can_be_cleared(app_context):
    matter_id = "MAT-DEMO-BEACON"

    updated = app_context.matters.update_risk(matter_id, "High", actor="Brian Harris")
    assert updated["risk_level"] == "High"
    metadata = app_context.vault.read_markdown(f"{updated['path']}/matter.md")["metadata"]
    assert metadata["risk_updated_by"] == "Brian Harris"

    cleared = app_context.matters.update_risk(matter_id, None, actor="Brian Harris")
    assert cleared["risk_level"] is None


def test_recent_activity_sorts_by_event_timestamp_and_uses_human_title(app_context):
    matter_id = "MAT-DEMO-BEACON"
    app_context.matters.append_event(
        matter_id,
        "decision_recorded",
        {"title": "Decision recorded"},
        event_id="EVT-ZZZ",
        timestamp="2026-08-31T09:00:00+00:00",
    )
    app_context.matters.append_event(
        matter_id,
        "risk_updated",
        {"title": "Risk assessment updated"},
        event_id="EVT-AAA",
        timestamp="2026-08-31T10:00:00+00:00",
    )

    events = app_context.matters.get(matter_id)["events"]

    assert events[0]["event_id"] == "EVT-AAA"
    assert events[0]["title"] == "Risk assessment updated"
