import pytest

from app.services.issue_choice import IssueChoiceService
from app.services.issue_analysis import IssueAnalysisService
from app.services.workspace import WorkspaceConflict
from test_workspace_review import review, learning_app, publish_paths, MATTER

ACTOR = {"person_id": "local-lawyer", "display_name": "Taylor Lawyer"}


def command(review, **overrides):
    return {"workflow": True, "disposition": "mitigation_in_progress", "chosen_path": "Rely on the partner",
            "reason": "Proceed only after confirmation.", "expected_revision": review.workspace.issues_revision(MATTER),
            "source_action_key": "record-partner", "follow_up": [{"title": "Confirm partner arrangement", "owner": "Product", "required": True}],
            **overrides}


def test_choice_work_review_and_resolution_survive_retry_and_rebuild(review):
    learning_app(review)
    service = IssueChoiceService(review)
    payload = command(review)
    first = service.record(MATTER, "ISS-AGE", payload, actor=ACTOR)
    assert service.record(MATTER, "ISS-AGE", payload, actor=ACTOR) == first
    decision_id = first["issue"]["linked_decision_ids"][-1]
    work = [item for item in review.work_items(MATTER) if item.get("issue_id") == "ISS-AGE"]
    assert len(work) == 2
    task = next(item for item in work if not item.get("choice_review_for"))
    follow_review = next(item for item in work if item.get("choice_review_for"))
    assert next(item for item in review.review_items(MATTER) if item["issue_id"] == "ISS-AGE")["action_label"] == task["title"]
    with pytest.raises(ValueError, match="record the issue conclusion"):
        review.matters.complete_work_item(MATTER, follow_review["work_item_id"], actor="Taylor Lawyer")
    review.matters.complete_work_item(MATTER, task["work_item_id"], actor="Product")
    assert next(item for item in review.review_items(MATTER) if item["issue_id"] == "ISS-AGE")["action_label"] == follow_review["title"]
    assert review.workspace.issues(MATTER)[0]["disposition"] == "mitigation_in_progress"
    final = service.record(MATTER, "ISS-AGE", command(review, source_action_key="resolve", disposition="resolved",
                           follow_up=[], revises_decision_id=decision_id, linked_decision_ids=[decision_id]), actor=ACTOR)
    review.matters.index.rebuild()
    assert not any(item["issue_id"] == "ISS-AGE" for item in review.review_items(MATTER))
    assert review.decisions(MATTER)[-1]  # Durable records remain readable.
    assert len(final["issue"]["disposition_history"]) == 2
    assert all(item["status"] == "done" for item in review.work_items(MATTER) if item.get("issue_id") == "ISS-AGE")
    assert service.record(MATTER, "ISS-AGE", payload, actor=ACTOR) == first
    assert review.workspace.issues(MATTER)[0]["disposition"] == "resolved"


def test_selected_map_path_keeps_unknown_conditions_and_tracks_work(review):
    learning_app(review)
    analysis = publish_paths(review, "ISS-AGE", "RUN-choice", suffix="choice")
    option = analysis["options"][0]
    basis = {"issue_id": "ISS-AGE", "analysis_id": analysis["analysis_id"], "analysis_revision": analysis["analysis_revision"],
             "analysis_path": analysis["source_path"], "output_revision": analysis["output_revision"],
             "selected_option_id": option["option_id"], "selected_option_revision": option["option_revision"]}
    saved = IssueChoiceService(review).record(MATTER, "ISS-AGE", command(review, map_basis=basis), actor=ACTOR)
    graph = review.decision_map(MATTER)
    assert any(edge["from_node_id"] == f"option:{option['option_id']}" and edge["relationship"] == "decided_by" and edge["state"] == "active" for edge in graph["edges"])
    assert any(edge["from_node_id"] == f"option:{option['option_id']}" and edge["relationship"] == "requires" for edge in graph["edges"])
    assert any(node["record_type"] == "condition" and node["state"] == "unknown" for node in graph["nodes"])
    service = IssueAnalysisService(review.vault, review.matters, review.workspace)
    assert service.resolve(MATTER, "ISS-AGE")["state"] == "needs_review"
    capture = service.capture(MATTER, "ISS-AGE")
    assert capture["issues"]["ISS-AGE"]["inputs"]["recorded_choices"][0]["decision_id"] in saved["issue"]["linked_decision_ids"]


def test_accepting_risk_keeps_required_work_visible_and_validates_before_writes(review):
    learning_app(review)
    service = IssueChoiceService(review)
    with pytest.raises(ValueError, match="different issue"):
        service.record(MATTER, "ISS-AGE", command(review, map_basis={"issue_id": "ISS-NOTICE", "analysis_id": "x", "analysis_revision": "x", "analysis_path": "x", "output_revision": "x", "selected_option_id": "x", "selected_option_revision": "x"}), actor=ACTOR)
    payload = command(review, disposition="risk_accepted")
    saved = service.record(MATTER, "ISS-AGE", payload, actor=ACTOR)
    assert saved["issue"]["disposition"] == "risk_accepted"
    assert any(item["issue_id"] == "ISS-AGE" for item in review.review_items(MATTER))
    with pytest.raises(WorkspaceConflict):
        service.record(MATTER, "ISS-AGE", {**payload, "reason": "Changed"}, actor=ACTOR)


def test_partial_write_retry_does_not_duplicate_decision_or_work(review, monkeypatch):
    learning_app(review)
    service = IssueChoiceService(review)
    payload = command(review)
    real = review.record_disposition
    monkeypatch.setattr(review, "record_disposition", lambda *a, **k: (_ for _ in ()).throw(OSError("disk unavailable")))
    with pytest.raises(OSError):
        service.record(MATTER, "ISS-AGE", payload, actor=ACTOR)
    count = len(review.decisions(MATTER))
    monkeypatch.setattr(review, "record_disposition", real)
    service.record(MATTER, "ISS-AGE", payload, actor=ACTOR)
    assert len(review.decisions(MATTER)) == count
    assert len([item for item in review.work_items(MATTER) if item.get("issue_id") == "ISS-AGE"]) == 2


def test_draft_review_delivery_and_closure_follow_the_recorded_choice(review, app_context):
    learning_app(review)
    app = app_context
    draft = app.work_products.create_draft(MATTER, title="Answer", content="Lawyer edits stay here.",
        draft_context={"source_revisions": review.workspace.source_revisions(MATTER)})
    assert not app.work_products.reference(MATTER, draft["vault_path"])["decision_review_required"]
    service = IssueChoiceService(review)
    saved = service.record(MATTER, "ISS-AGE", command(review), actor=ACTOR)
    assert app.work_products.reference(MATTER, draft["vault_path"])["decision_review_required"]
    assert "Lawyer edits stay here." in review.vault.read_markdown(draft["vault_path"])["content"]
    # The response remains usable. Its review warning is not a legal-answer gate.
    final = app.work_products.finalize(MATTER, draft["vault_path"])
    app.matters.perform_action(MATTER, "approve_response", actor="Taylor", artifact_path=final["vault_path"])
    app.matters.perform_action(MATTER, "mark_as_sent", actor="Taylor")
    for item in review.work_items(MATTER):
        if not item.get("choice_review_for") and item.get("required"):
            app.matters.complete_work_item(MATTER, item["work_item_id"], actor="Taylor")
    with pytest.raises(ValueError, match="required work"):
        app.matters.perform_action(MATTER, "close_matter", actor="Taylor")
    service.record(MATTER, "ISS-AGE", command(review, source_action_key="conclude", disposition="resolved", follow_up=[],
                   linked_decision_ids=saved["issue"]["linked_decision_ids"], revises_decision_id=saved["issue"]["linked_decision_ids"][-1]), actor=ACTOR)
    app.matters.perform_action(MATTER, "close_matter", actor="Taylor")
    app.index.rebuild()
    assert app.matters.get(MATTER)["status"] == "closed"
