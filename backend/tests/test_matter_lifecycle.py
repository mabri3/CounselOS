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


def test_work_item_service_does_not_merge_distinct_agent_action_keys(app_context):
    matter_id = "MAT-DEMO-BEACON"
    first = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Confirm funds-flow and custody model",
        required=True, source_action_key="chat:RUN-1",
    ))
    distinct_action = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Confirm funds-flow and custody model",
        required=True, source_action_key="chat:RUN-2",
    ))

    assert distinct_action["work_item_id"] != first["work_item_id"]


def test_work_item_service_preserves_required_class_and_manual_repeat(app_context):
    matter_id = "MAT-DEMO-BEACON"
    required = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Country approval gate", required=True,
        source_action_key="chat:RUN-A",
    ))
    optional = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Country approval gate", required=False,
        source_action_key="chat:RUN-B",
    ))
    manual = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Country approval gate", required=True,
    ))

    assert required["work_item_id"] != optional["work_item_id"]
    assert manual["work_item_id"] != required["work_item_id"]


def test_direct_action_returns_common_operation_result(app_context):
    matter_id, final = _responding_matter(app_context)

    result = app_context.matters.perform_action(
        matter_id,
        "approve_response",
        actor="Counsel",
        artifact_path=final["vault_path"],
    )

    assert result["operation"] == "approve_response"
    assert result["status"] == "changed"
    assert result["matter_id"] == matter_id
    assert result["resulting_matter_state"]["stage"] == "respond"
    assert result["available_next_actions"] == ["mark_as_sent"]
    assert result["error"] is None


def test_close_prerequisites_follow_canonical_lifecycle_order(app_context):
    matter = app_context.matters.create(
        MatterCreate(title="Close guidance", request_text="Prepare a response.")
    )
    matter_id = matter["matter_id"]
    app_context.matters.move_stage(matter_id, "respond")
    assert app_context.matters.closure_prerequisite(matter_id) == (
        "Finalize the current work product before closing the matter."
    )

    draft = app_context.work_products.create_draft(
        matter_id, title="Answer", content="Final answer"
    )
    final = app_context.work_products.finalize(matter_id, draft["vault_path"])
    assert app_context.matters.closure_prerequisite(matter_id) == (
        "Approve the current final response before closing the matter."
    )

    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    assert app_context.matters.closure_prerequisite(matter_id) == (
        "Record manual delivery before closing the matter."
    )

    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(
                matter_id, item["work_item_id"], actor="Counsel"
            )
    blocker = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id, title="Archive approval", required=True,
    ))
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    assert app_context.matters.closure_prerequisite(matter_id) == (
        "Complete required work before closing the matter: Archive approval."
    )

    app_context.matters.complete_work_item(
        matter_id, blocker["work_item_id"], actor="Counsel"
    )
    assert app_context.matters.closure_prerequisite(matter_id) is None


def test_approval_and_delivery_allow_required_open_work_but_closure_does_not(app_context):
    matter_id, final = _responding_matter(app_context)
    required = app_context.matters.create_work_item(WorkItemCreate(
        matter_id=matter_id,
        title="Archive signed response",
        required=True,
    ))

    approved = app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"],
    )
    approved_detail = app_context.matters.get(matter_id)["work_state"]
    approved_list = next(
        item for item in app_context.matters.list() if item["matter_id"] == matter_id
    )["work_state"]
    delivered = app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    delivered_detail = app_context.matters.get(matter_id)["work_state"]
    delivered_list = next(
        item for item in app_context.matters.list() if item["matter_id"] == matter_id
    )["work_state"]

    assert approved["matter"]["response_approved_at"]
    assert approved_detail == approved_list
    assert approved_detail["next_action"] == "Record manual delivery."
    assert approved_detail["next_work_item_id"] is None
    assert approved_detail["next_actor"] == "you"
    assert delivered["matter"]["response_sent_at"]
    assert delivered_detail == delivered_list
    assert delivered_detail["next_action"] == "Complete required work before closing the matter."
    assert delivered_detail["next_work_item_id"] is not None
    with pytest.raises(ValueError, match="Archive signed response"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")

    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(matter_id, item["work_item_id"], actor="Counsel")
    closed = app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    assert closed["matter"]["status"] == "closed"


@pytest.mark.parametrize("research_state", ["queued", "running"])
def test_active_research_blocks_closure_until_it_is_stopped(app_context, research_state):
    matter_id, final = _responding_matter(app_context)
    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(matter_id, item["work_item_id"], actor="Counsel")
    app_context.research_runs._write(
        matter_id, "RUN-ACTIVE", state=research_state, questions=["What applies?"],
        completed=0, status="Research is active.",
    )

    with pytest.raises(ValueError, match="Stop or finish active research before closing"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")

    app_context.research_runs._write(
        matter_id, "RUN-ACTIVE", state="interrupted", status="Research was stopped."
    )
    assert app_context.matters.perform_action(
        matter_id, "close_matter", actor="Counsel"
    )["matter"]["status"] == "closed"


def test_closed_matter_with_active_research_has_visible_consistency_issue(app_context):
    matter_id, final = _responding_matter(app_context)
    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(matter_id, item["work_item_id"], actor="Counsel")
    app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    app_context.research_runs._write(
        matter_id, "RUN-LEGACY-ACTIVE", state="running", questions=["What applies?"],
        completed=0, status="Research is running.",
    )

    assert "closed_with_active_research" in {
        issue["code"] for issue in app_context.matters.get(matter_id)["consistency_issues"]
    }


def test_work_item_source_action_key_returns_one_durable_item(app_context):
    request = WorkItemCreate(
        matter_id="MAT-DEMO-BEACON",
        title="Confirm product owner",
        owner="Counsel",
        required=True,
        source_action_key="chat:RUN-2:tool-1",
    )

    first = app_context.matters.create_work_item(request)
    retry = app_context.matters.create_work_item(request)

    assert retry["work_item_id"] == first["work_item_id"]
    assert retry["path"] == first["path"]
    assert retry["source_action_key"] == "chat:RUN-2:tool-1"
    assert len([
        item for item in app_context.index.list_work_items("MAT-DEMO-BEACON")
        if item["title"] == "Confirm product owner"
    ]) == 1


def test_work_item_owner_assignment_is_visible_and_retry_safe(app_context):
    item = app_context.matters.create_work_item(WorkItemCreate(
        matter_id="MAT-DEMO-BEACON", title="Assign this", owner=""
    ))
    first = app_context.matters.assign_work_item(
        "MAT-DEMO-BEACON", item["work_item_id"], owner="Product Counsel", actor="Lawyer"
    )
    retry = app_context.matters.assign_work_item(
        "MAT-DEMO-BEACON", item["work_item_id"], owner="Product Counsel", actor="Lawyer"
    )

    assert first["changed_paths"] == [item["path"]]
    assert retry["already_recorded"] is True
    assert retry["changed_paths"] == []
    assert next(
        work for work in app_context.index.list_work_items("MAT-DEMO-BEACON")
        if work["work_item_id"] == item["work_item_id"]
    )["owner"] == "Product Counsel"


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


def test_safe_consistency_repair_only_changes_derived_lifecycle_fields(app_context):
    matter = app_context.matters.create(
        MatterCreate(title="Legacy final mismatch", request_text="Prepare an answer.")
    )
    matter_id = matter["matter_id"]
    draft = app_context.work_products.create_draft(
        matter_id, title="Answer", content="Final answer"
    )
    final = app_context.work_products.finalize(matter_id, draft["vault_path"])
    matter_path = f"{matter['path']}/matter.md"
    app_context.vault.update_markdown(
        matter_path,
        metadata_updates={"status": "research", "next_action": "Run research."},
    )
    app_context.index.rebuild()
    before = app_context.vault.read_markdown(matter_path)["metadata"]
    assert [issue["code"] for issue in app_context.matters.get(matter_id)["consistency_issues"]] == [
        "final_with_pre_respond_stage"
    ]
    listed = next(item for item in app_context.matters.list() if item["matter_id"] == matter_id)
    assert [issue["code"] for issue in listed["consistency_issues"]] == [
        "final_with_pre_respond_stage"
    ]

    repaired = app_context.matters.repair_consistency(matter_id, actor="Counsel")

    after = app_context.vault.read_markdown(matter_path)["metadata"]
    assert repaired["status"] == "changed"
    assert repaired["matter"]["status"] == "respond"
    assert repaired["matter"]["current_work_product_final_path"] == final["vault_path"]
    for field in ("response_approved_at", "response_sent_at", "closed_at", "durable_decision_needed"):
        assert after.get(field) == before.get(field)
    assert app_context.index.list_decisions() == [
        decision for decision in app_context.index.list_decisions()
        if decision["matter_id"] != matter_id
    ]


def test_delivered_or_closed_matter_rejects_a_replacement_draft(app_context):
    matter_id, final = _responding_matter(app_context)
    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")

    with pytest.raises(ValueError, match="Reopen the delivered response"):
        app_context.work_products.create_draft(
            matter_id, title="Replacement", content="Replacement answer"
        )

    for item in app_context.index.list_work_items(matter_id):
        if item["required"] and item["status"] not in {"done", "closed"}:
            app_context.matters.complete_work_item(
                matter_id, item["work_item_id"], actor="Counsel"
            )
    app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    with pytest.raises(ValueError, match="Reopen the matter"):
        app_context.work_products.create_draft(
            matter_id, title="Closed replacement", content="Replacement answer"
        )


def test_delivery_rejects_an_approved_final_after_direct_draft_change(app_context):
    matter_id, final = _responding_matter(app_context)
    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    final_document = app_context.vault.read_markdown(final["vault_path"])
    draft_path = final_document["metadata"]["source_draft"]
    app_context.vault.update_markdown(draft_path, content="Changed after approval")

    with pytest.raises(ValueError, match="no longer matches"):
        app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")


def test_finalize_is_noop_after_delivery_only_for_identical_existing_final(app_context):
    matter_id, final = _responding_matter(app_context)
    draft_path = app_context.vault.read_markdown(final["vault_path"])["metadata"]["source_draft"]
    app_context.matters.perform_action(
        matter_id, "approve_response", actor="Counsel", artifact_path=final["vault_path"]
    )
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")

    identical = app_context.work_products.finalize(matter_id, draft_path)
    assert identical["vault_path"] == final["vault_path"]
    assert identical["changed_paths"] == []

    app_context.vault.update_markdown(draft_path, content="Changed after delivery")
    with pytest.raises(ValueError, match="Reopen the delivered response"):
        app_context.work_products.finalize(matter_id, draft_path)


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
    assert app_context.matters.get(matter_id)["response_approved_at"] is None
    with pytest.raises(ValueError, match="approved before"):
        app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel")
    other_final = app_context.work_products.finalize(matter_id, other["vault_path"])
    with pytest.raises(ValueError, match="current work-product draft"):
        app_context.matters.perform_action(
            matter_id,
            "approve_response",
            actor="Counsel",
            artifact_path=final["vault_path"],
        )
    app_context.matters.perform_action(matter_id, "approve_response", actor="Counsel", artifact_path=other_final["vault_path"])
    app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Counsel", artifact_path=other_final["vault_path"], note="Sent by email")
    item = app_context.matters.create_work_item(WorkItemCreate(matter_id=matter_id, title="Archive signed copy", required=True))
    with pytest.raises(ValueError, match="Archive signed copy"):
        app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    for open_item in app_context.index.list_work_items(matter_id):
        app_context.matters.complete_work_item(matter_id, open_item["work_item_id"], actor="Counsel")
    closed = app_context.matters.perform_action(matter_id, "close_matter", actor="Counsel")
    assert closed["matter"]["status"] == "closed"
    assert app_context.matters.perform_action(matter_id, "mark_as_sent", actor="Other")["already_recorded"] is True
    assert app_context.matters.perform_action(matter_id, "close_matter", actor="Other")["already_recorded"] is True
