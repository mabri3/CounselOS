from __future__ import annotations

import pytest

from app.models.api import MatterCreate, WorkItemCreate


def _responding_matter(app_context):
    matter = app_context.matters.create(MatterCreate(title="Lifecycle proof", request_text="Prepare a response."))
    app_context.matters.move_stage(matter["matter_id"], "respond")
    draft = app_context.work_products.create_draft(matter["matter_id"], title="Answer", content="Final answer")
    final = app_context.work_products.finalize(matter["matter_id"], draft["vault_path"])
    return matter["matter_id"], final


def test_exact_completion_is_retry_safe_and_does_not_touch_sibling(app_context):
    matter_id, _ = _responding_matter(app_context)
    first = app_context.matters.create_work_item(WorkItemCreate(matter_id=matter_id, title="First", required=True))
    sibling = app_context.matters.create_work_item(WorkItemCreate(matter_id=matter_id, title="Sibling", required=True))
    result = app_context.matters.complete_work_item(matter_id, first["work_item_id"], actor="Counsel")
    completed_at = app_context.vault.read_markdown(first["path"])["metadata"]["completed_at"]
    retry = app_context.matters.complete_work_item(matter_id, first["work_item_id"], actor="Other")
    assert result["already_recorded"] is False
    assert retry["already_recorded"] is True
    assert app_context.vault.read_markdown(first["path"])["metadata"]["completed_at"] == completed_at
    assert app_context.vault.read_markdown(sibling["path"])["metadata"]["status"] == "open"


def test_direct_lifecycle_calls_require_actor_and_final_artifact(app_context):
    matter_id, final = _responding_matter(app_context)
    with pytest.raises(TypeError):
        app_context.matters.perform_action(matter_id, "approve_response")
    with pytest.raises(ValueError, match="actor is required"):
        app_context.matters.perform_action(matter_id, "approve_response", actor="", artifact_path=final["vault_path"])
    with pytest.raises(ValueError, match="final Markdown response artifact"):
        app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel")
    item = app_context.index.list_work_items(matter_id)[0]
    with pytest.raises(TypeError):
        app_context.matters.complete_work_item(matter_id, item["work_item_id"])


def test_lifecycle_binds_final_and_retries_with_stable_events(app_context):
    matter_id, final = _responding_matter(app_context)
    approved = app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"])
    retry = app_context.matters.perform_action(matter_id, "approve_response", actor="Other", artifact_path=final["vault_path"])
    assert retry["already_recorded"] is True
    assert retry["event_path"] == approved["event_path"]
    assert retry["matter"]["response_approved_by"] == "Counsel"
    app_context.vault.resolve(approved["event_path"]).unlink()
    repaired = app_context.matters.perform_action(matter_id, "approve_response", actor="Other", artifact_path=final["vault_path"])
    assert repaired["event_path"] == approved["event_path"]
    assert app_context.vault.exists(approved["event_path"])


def test_approval_retry_repairs_open_exact_approval_item(app_context):
    matter_id, final = _responding_matter(app_context)
    item = app_context.matters.create_work_item(
        WorkItemCreate(matter_id=matter_id, title="Approve response", item_type="approval")
    )
    approved = app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    approved_at = approved["matter"]["response_approved_at"]
    retry = app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"],
        work_item_id=item["work_item_id"],
    )
    assert retry["already_recorded"] is True
    assert retry["matter"]["response_approved_at"] == approved_at
    assert app_context.vault.read_markdown(item["path"])["metadata"]["status"] == "done"


def test_approval_rejects_hostile_or_different_final_and_closure_names_work(app_context):
    matter_id, final = _responding_matter(app_context)
    with pytest.raises(ValueError, match="owned by this matter"):
        app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel", artifact_path="00_System/identity.md")
    app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"])
    other = app_context.work_products.create_draft(matter_id, title="Other", content="Other answer")
    other_final = app_context.work_products.finalize(matter_id, other["vault_path"])
    with pytest.raises(ValueError, match="different final"):
        app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel", artifact_path=other_final["vault_path"])
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel", note="Sent by email")
    item = app_context.matters.create_work_item(WorkItemCreate(matter_id=matter_id, title="Archive signed copy", required=True))
    with pytest.raises(ValueError, match="Archive signed copy"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    for open_item in app_context.index.list_work_items(matter_id):
        app_context.matters.complete_work_item(matter_id, open_item["work_item_id"], actor="Counsel")
    closed = app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    assert closed["matter"]["status"] == "closed"
    assert app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Other")["already_recorded"] is True
    assert app_context.matters.perform_action(matter_id, "close_matter", actor="Other")["already_recorded"] is True
