from __future__ import annotations

import hashlib
from pathlib import PurePosixPath

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers import workspace as workspace_router
from app.services.workspace import WorkspaceConflict, WorkspaceService, digest
from app.services.workspace_review import WorkspaceReviewService
from app.services.workspace_scenarios import WorkspaceScenarioService


MATTER = "MAT-DEMO-RELAY"
OTHER = "MAT-DEMO-APEX"


@pytest.fixture
def review(app_context):
    workspace = WorkspaceService(app_context.vault, app_context.matters, app_context.dossiers, app_context.matter_records)
    scenarios = WorkspaceScenarioService(app_context.vault, app_context.matters, workspace, app_context.matter_records)
    return WorkspaceReviewService(app_context.vault, app_context.matters, workspace, app_context.matter_records, scenarios)


def learning_app(review: WorkspaceReviewService) -> None:
    path = review.workspace._path(MATTER, "issues.md")
    content = """# Issues

- Child audience <!-- issue:ISS-AGE -->
- Parental consent <!-- issue:ISS-CONSENT -->
- Notice option <!-- issue:ISS-NOTICE -->
- Cycle A <!-- issue:ISS-CYCLE-A -->
- Cycle B <!-- issue:ISS-CYCLE-B -->
- Disconnected accessibility issue <!-- issue:ISS-DISCONNECTED -->
"""
    issue_nodes = {
        "ISS-AGE": {"why_it_matters": "Audience affects the legal analysis.", "claim_ids": ["CLM-AGE"]},
        "ISS-CONSENT": {"why_it_matters": "Consent duties depend on saved facts.", "claim_ids": ["CLM-OPERATOR"]},
        "ISS-NOTICE": {"linked_work_item_ids": ["WORK-NOTICE"]},
        "ISS-CYCLE-A": {"depends_on": ["issue:ISS-CYCLE-B"]},
        "ISS-CYCLE-B": {"depends_on": ["issue:ISS-CYCLE-A"]},
        "ISS-DISCONNECTED": {},
    }
    review.vault.write_markdown(path, content, {"matter_id": MATTER, "record_type": "issues", "issue_nodes": issue_nodes})
    source_path = f"{review._base(MATTER)}/source-documents/coppa.txt"
    review.vault.write_bytes(source_path, b"16 CFR 312.2 child means an individual under age 13. Operator means an operator of a website.")
    review.records.apply_update(MATTER, sources=[{
        "source_id": "SRC-COPPA", "kind": "file", "label": "COPPA definitions",
        "path": source_path, "version": "2026-09-05",
    }])
    workspace_doc = review.workspace._document(MATTER, "workspace.md")
    workspace_doc["metadata"].update({
        "questions": [{
            "question_id": "Q-AUDIENCE", "business_question_id": review.workspace.business_question(MATTER)["question_id"],
            "business_question_revision": review.workspace.business_question(MATTER)["revision"],
            "issue_id": "ISS-AGE", "issue_ids": ["ISS-AGE", "ISS-CONSENT", "ISS-MISSING"],
            "question_kind": "factual", "text": "Is the learning app directed to children under 13?",
            "state": "left_open", "source_revision": "q-audience-r1",
        }],
        "claims": [{
            "claim_id": "CLM-AGE", "text": "The definition of child uses an under-13 threshold.",
            "claim_revision": "cr1", "output_revision": "out7",
            "applicability": {"regulated_actor": "Unknown", "jurisdiction": "United States", "explanation": "Audience is unknown."},
            "evidence": [{"claim_id": "CLM-AGE", "claim_revision": "cr1", "output_revision": "out7",
                "source_id": "SRC-COPPA", "locator": "16 CFR 312.2 — child", "available_excerpt": "child means an individual under age 13", "support_state": "retrieved"}],
        }, {
            "claim_id": "CLM-OPERATOR", "text": "The rule defines operator separately.",
            "claim_revision": "cr1", "output_revision": "out7",
            "applicability": {"regulated_actor": "Unknown", "jurisdiction": "United States", "explanation": "Operator status is unknown."},
            "evidence": [{"claim_id": "CLM-OPERATOR", "claim_revision": "cr1", "output_revision": "out7",
                "source_id": "SRC-COPPA", "locator": "16 CFR 312.2 — operator", "available_excerpt": "Operator means an operator", "support_state": "retrieved"}],
        }],
        "options": [{"option_id": "OPT-NOTICE", "label": "Add a notice", "issue_ids": ["ISS-NOTICE"], "work_item_ids": ["WORK-NOTICE"]}],
    })
    review.vault.write_markdown(workspace_doc["path"], workspace_doc["content"] or "# Workspace\n", workspace_doc["metadata"])
    review.vault.write_markdown(f"{review._base(MATTER)}/work-items/WORK-NOTICE.md", "# Draft notice", {
        "matter_id": MATTER, "work_item_id": "WORK-NOTICE", "title": "Draft a child-directed notice",
        "description": "Prepare notice text for review.", "status": "open", "required": True,
        "owner": "Product counsel", "due_at": "2026-09-06", "issue_id": "ISS-NOTICE",
    })


def test_shared_question_claims_cycle_missing_and_disconnected_are_honest(review):
    learning_app(review)
    review.scenarios.save(MATTER, {"title": "Assume a known child audience",
        "baseline_revisions": review.workspace.source_revisions(MATTER), "issue_ids": ["ISS-AGE"],
        "proposed_fact_changes": [{"change_id": "CHANGE-UNDER-13", "text": "Assume the audience is under 13."}],
        "proposed_outcomes": [{"outcome_id": "OPT-PARENTAL-NOTICE", "label": "Use a parental notice",
            "condition": "If the audience is under 13", "issue_ids": ["ISS-AGE"], "work_item_ids": ["WORK-NOTICE"]}],
        "affected_branch_ids": ["OPT-PARENTAL-NOTICE"]}, source_action_key="scenario-map-branch")
    snapshot = review.decision_map(MATTER)
    ids = [node["node_id"] for node in snapshot["nodes"]]
    assert len(ids) == len(set(ids))
    assert ids.count("question:Q-AUDIENCE") == 1
    assert "issue:ISS-DISCONNECTED" in ids
    assert "issue:ISS-MISSING" in ids
    assert next(node for node in snapshot["nodes"] if node["node_id"] == "issue:ISS-MISSING")["missing_reference"] is True
    shared = [edge for edge in snapshot["edges"] if edge["to_node_id"] == "question:Q-AUDIENCE"]
    assert {edge["from_node_id"] for edge in shared} == {"issue:ISS-AGE", "issue:ISS-CONSENT", "issue:ISS-MISSING"}
    assert all(edge["state"] in {"unknown", "missing"} for edge in shared)
    assert {("issue:ISS-CYCLE-A", "issue:ISS-CYCLE-B"), ("issue:ISS-CYCLE-B", "issue:ISS-CYCLE-A")} <= {
        (edge["from_node_id"], edge["to_node_id"]) for edge in snapshot["edges"]
    }
    branch_edges = [edge for edge in snapshot["edges"] if edge["to_node_id"] == "option:OPT-PARENTAL-NOTICE"]
    assert any(edge["relationship"] == "if" and edge["state"] == "unknown" for edge in branch_edges)
    assert any(edge["from_node_id"] == "option:OPT-PARENTAL-NOTICE" and edge["to_node_id"] == "work:WORK-NOTICE"
               for edge in snapshot["edges"])
    neighborhood = review.decision_map(MATTER, issue_id="ISS-AGE")
    neighborhood_ids = {node["node_id"] for node in neighborhood["nodes"]}
    assert {"question:Q-AUDIENCE", "business_question:" + review.workspace.business_question(MATTER)["question_id"]} <= neighborhood_ids
    assert "issue:ISS-DISCONNECTED" not in neighborhood_ids
    assert len(review.claims(MATTER)) == 2
    evidence = [claim["evidence"][0] for claim in review.claims(MATTER)]
    assert {item["source_id"] for item in evidence} == {"SRC-COPPA"}
    assert len({item["locator"] for item in evidence}) == 2


def test_review_priority_uses_work_record_issue_links_without_duplicate_issue_metadata(review):
    learning_app(review)
    issues = review.workspace.issues(MATTER)
    next(item for item in issues if item["issue_id"] == "ISS-NOTICE")["linked_work_item_ids"] = []
    review.workspace.save_issues(MATTER, issues, expected_revision=review.workspace.issues_revision(MATTER))
    first = review.review_items(MATTER)[0]
    assert first["issue_id"] == "ISS-NOTICE"
    assert first["actor"] == "Product counsel"
    assert first["action_label"] == "Draft a child-directed notice"
    assert first["reason"] == "Prepare notice text for review."
    assert next(item for item in review.workspace.issues(MATTER) if item["issue_id"] == "ISS-NOTICE")["linked_work_item_ids"] == []


def test_disposition_is_explicit_retry_safe_stale_cross_matter_and_reopen(review):
    learning_app(review)
    actor = {"person_id": "local-lawyer", "display_name": "Taylor Lawyer"}
    revision = review.workspace.issues_revision(MATTER)
    command = {"disposition": "mitigation_in_progress", "reason": "Notice work must finish.",
        "expected_revision": revision, "source_action_key": "dispose-notice-1", "linked_work_item_ids": ["WORK-NOTICE"]}
    first = review.record_disposition(MATTER, "ISS-NOTICE", command, actor=actor)
    retry = review.record_disposition(MATTER, "ISS-NOTICE", command, actor=actor)
    assert retry == first
    assert retry["issue"]["disposition_history"] == first["issue"]["disposition_history"]
    assert retry["issue"]["disposition_history"][0]["actor_name"] == "Taylor Lawyer"
    with pytest.raises(WorkspaceConflict) as conflict:
        review.record_disposition(MATTER, "ISS-NOTICE", {**command, "reason": "Different"}, actor=actor)
    assert conflict.value.detail["code"] == "action_key_conflict"
    with pytest.raises(WorkspaceConflict):
        review.record_disposition(MATTER, "ISS-AGE", {**command, "source_action_key": "stale-disposition"}, actor=actor)
    with pytest.raises(ValueError, match="recorded decision"):
        review.record_disposition(MATTER, "ISS-AGE", {"disposition": "risk_accepted", "reason": "Accepted.",
            "expected_revision": review.workspace.issues_revision(MATTER), "source_action_key": "risk-no-decision"}, actor=actor)
    with pytest.raises(ValueError, match="reason"):
        review.record_disposition(MATTER, "ISS-AGE", {"disposition": "resolved", "reason": "   ",
            "expected_revision": review.workspace.issues_revision(MATTER), "source_action_key": "blank-reason"}, actor=actor)
    with pytest.raises(ValueError, match="belong"):
        review.record_disposition(MATTER, "ISS-AGE", {"disposition": "resolved", "reason": "Done.",
            "expected_revision": review.workspace.issues_revision(MATTER), "source_action_key": "cross-matter",
            "linked_decision_ids": ["DEC-DEMO-APEX-RETENTION"]}, actor=actor)
    reopened = review.record_disposition(MATTER, "ISS-NOTICE", {"disposition": "unresolved", "reason": "The notice changed.",
        "expected_revision": review.workspace.issues_revision(MATTER), "source_action_key": "reopen-notice"}, actor=actor)
    assert reopened["issue"]["disposition_history"][-1]["action"] == "reopened"
    assert review.record_disposition(MATTER, "ISS-NOTICE", command, actor=actor) == first
    # Completing linked work changes no issue record or disposition.
    review.vault.update_markdown(f"{review._base(MATTER)}/work-items/WORK-NOTICE.md", metadata_updates={"status": "done"})
    assert review.workspace.issues(MATTER)[2]["disposition"] == "unresolved"


def test_legal_answer_never_creates_reported_fact_and_shared_links_persist(review):
    learning_app(review)
    question = review.workspace.questions(MATTER)[0]
    question.update(question_kind="legal", state="open", answer=None, answer_kind=None,
                    issue_ids=["ISS-AGE", "ISS-CONSENT"])
    saved = review.workspace.save_question(MATTER, question, expected_revision=question["source_revision"])
    count = len(review.records.get(MATTER)["facts"])
    with pytest.raises(ValueError, match="legal analysis"):
        review.workspace.answer_question(MATTER, "Q-AUDIENCE", {"expected_revision": saved["source_revision"],
            "source_action_key": "bad-legal-answer", "state": "answered", "answer": "COPPA applies.",
            "answer_kind": "reported_fact"})
    receipt = review.workspace.answer_question(MATTER, "Q-AUDIENCE", {"expected_revision": saved["source_revision"],
        "source_action_key": "legal-answer", "state": "answered", "answer": "The saved sources support conditional analysis only.",
        "answer_kind": "legal_analysis", "answer_source_ids": ["SRC-COPPA"], "answer_claim_ids": ["CLM-AGE"]})
    assert "legal_analysis" in receipt["completed_parts"]
    assert len(review.records.get(MATTER)["facts"]) == count
    reloaded = review.workspace.questions(MATTER)[0]
    assert reloaded["issue_id"] == "ISS-AGE"
    assert reloaded["issue_ids"] == ["ISS-AGE", "ISS-CONSENT"]
    assert reloaded["answer_kind"] == "legal_analysis"
    left_open = review.workspace.answer_question(MATTER, "Q-AUDIENCE", {"expected_revision": reloaded["source_revision"],
        "source_action_key": "leave-legal-open", "state": "left_open"})
    assert left_open["state"] == "applied"
    after = review.workspace.questions(MATTER)[0]
    assert after["answer"] == "The saved sources support conditional analysis only."
    assert after["answer_history"]


def test_documents_keep_identity_versions_duplicate_names_and_exact_passages(review):
    learning_app(review)
    base = review._base(MATTER)
    first = f"{base}/work-product/draft/memo.md"
    second = f"{base}/final/memo.md"
    review.vault.write_markdown(first, "Current draft passage.", {"matter_id": MATTER, "record_type": "work_product",
        "work_product_id": "WP-MEMO-DRAFT", "title": "Memo", "state": "draft", "immutable": False})
    review.vault.write_markdown(second, "Final passage.", {"matter_id": MATTER, "record_type": "work_product",
        "work_product_id": "WP-MEMO-FINAL", "title": "Memo", "state": "final", "immutable": True, "final_id": "FINAL-1"})
    documents = review.documents(MATTER)
    memos = [item for item in documents if PurePosixPath(item["path"]).name == "memo.md"]
    assert len(memos) == 2 and len({item["document_id"] for item in memos}) == 2
    assert next(item for item in memos if item["path"] == second)["immutable"] is True
    review.vault.write_markdown(f"{base}/final/earlier-memo.md", "Earlier final.", {
        "matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-MEMO-DRAFT",
        "title": "Memo", "state": "final", "immutable": True, "final_id": "FINAL-EARLIER"})
    versions = [item for item in review.documents(MATTER) if item["document_id"] == "WP-MEMO-DRAFT"]
    assert versions[0]["path"] == first and versions[0]["editable"]
    historical_path = f"{base}/work-product/.history/memo-old.md"
    review.vault.write_markdown(historical_path, "Historical exact passage.", {"matter_id": MATTER,
        "record_type": "work_product", "work_product_id": "WP-MEMO-DRAFT", "state": "draft",
        "immutable": True, "version_id": "VERSION-OLD"})
    historical_doc = review.vault.read_markdown(historical_path)
    historical_revision = hashlib.sha256(historical_doc["content"].encode("utf-8")).hexdigest()
    historical = review.resolve_document(MATTER, {"document_id": "WP-MEMO-DRAFT", "path": first,
        "revision": historical_revision, "available_excerpt": "Historical exact passage."})
    assert historical["passage_state"] == "exact"
    assert historical["document"]["revision"] == historical_revision
    assert historical["document"]["version_id"] == "VERSION-OLD"
    assert review.vault.read_markdown(historical["document"]["path"])["content"].strip() == "Historical exact passage."
    source = next(item for item in documents if item["document_id"] == "SRC-COPPA")
    exact = review.resolve_document(MATTER, {"document_id": source["document_id"], "path": source["path"],
        "revision": source["revision"], "locator": "Operator means an operator", "exact_passage_available": True})
    assert exact["passage_state"] == "exact"
    missing_locator = review.resolve_document(MATTER, {"document_id": source["document_id"], "path": source["path"],
        "locator": "missing section", "exact_passage_available": True})
    assert missing_locator["passage_state"] == "document_only"
    assert missing_locator["message"] == "Exact passage unavailable."
    with pytest.raises(ValueError):
        review.resolve_document(MATTER, {"document_id": source["document_id"], "path": "../secret.md"})
    with pytest.raises(ValueError, match="identity"):
        review.resolve_document(MATTER, {"document_id": "SRC-WRONG", "path": source["path"]})
    absent = review.resolve_document(MATTER, {"document_id": "FILE-absent", "path": f"{base}/source-documents/absent.md"})
    assert absent["passage_state"] == "missing"


def test_review_reads_do_not_build_the_full_matter_projection(review, monkeypatch):
    learning_app(review)
    monkeypatch.setattr(
        review.matters,
        "get",
        lambda matter_id: pytest.fail(f"unexpected full matter projection for {matter_id}"),
    )

    assert review.review_items(MATTER)
    assert review.claims(MATTER)
    assert review.documents(MATTER)
    assert review.decision_map(MATTER)["matter_id"] == MATTER


def test_documents_link_an_extracted_companion_to_its_source(review):
    learning_app(review)
    base = review._base(MATTER)
    original = f"{base}/source-documents/terms.pdf"
    companion = f"{original}.extracted.md"
    review.vault.write_bytes(original, b"saved original")
    review.vault.write_markdown(companion, "Extracted terms.", {
        "matter_id": MATTER,
        "record_type": "extracted_document",
        "source_id": "SRC-TERMS",
        "source_path": original,
    })
    review.records.apply_update(MATTER, sources=[{
        "source_id": "SRC-TERMS",
        "kind": "file",
        "label": "Terms",
        "path": original,
        "version": "1",
    }])

    documents = review.documents(MATTER)
    source = next(item for item in documents if item["path"] == original)
    extracted = next(item for item in documents if item["path"] == companion)
    assert source["extracted_path"] == companion
    assert extracted["original_path"] == original


def test_document_passage_resolution_does_not_claim_ambiguous_or_mismatched_excerpt(review):
    learning_app(review)
    source = next(item for item in review.documents(MATTER) if item["document_id"] == "SRC-COPPA")
    saved = review.vault.read_markdown(source["path"])
    review.vault.write_markdown(source["path"], "Repeated section.\n\nRepeated section.\n\nUnique heading.", saved["metadata"])
    target = {"document_id": source["document_id"], "path": source["path"], "exact_passage_available": True}
    ambiguous = review.resolve_document(MATTER, {**target, "locator": "Repeated section."})
    assert ambiguous["passage_state"] == "document_only"
    assert ambiguous["message"] == "Exact passage unavailable."
    mismatched = review.resolve_document(MATTER, {**target, "locator": "Unique heading.", "available_excerpt": "This text was never saved."})
    assert mismatched["passage_state"] == "document_only"
    assert mismatched["document"]["path"] == source["path"]


def test_scenario_create_and_analysis_baseline_do_not_change_canonical_facts(review):
    learning_app(review)
    before = review.records.get(MATTER)["facts"]
    baseline = review.workspace.source_revisions(MATTER)
    scenario = review.scenarios.save(MATTER, {"title": "Assume a child audience", "baseline_revisions": baseline,
        "issue_ids": ["ISS-AGE", "ISS-CONSENT"], "proposed_fact_changes": [{"change_id": "CHANGE-AUDIENCE", "text": "Assume users are under 13."}]},
        source_action_key="scenario-audience")
    prepared = review.scenarios.begin_analysis(MATTER, scenario["scenario_id"], {"instruction": "Analyze the changed audience.",
        "expected_scenario_revision": scenario["revision"], "baseline_revisions": baseline, "source_action_key": "analyze-audience"})
    assert prepared["scenario"]["analysis_state"] == "queued"
    queued_revision = prepared["scenario"]["revision"]
    bound = review.scenarios.bind_analysis_run(MATTER, scenario["scenario_id"], source_action_key="analyze-audience", run_id="RUN-AUDIENCE")
    assert bound["revision"] == queued_revision
    assert bound["analysis_state"] == "running"
    failed = review.scenarios.fail_analysis(MATTER, scenario["scenario_id"], source_action_key="analyze-audience",
                                            run_id="RUN-AUDIENCE", failure_detail="Provider unavailable.")
    assert failed["analysis_state"] == "failed"
    assert failed["failure_detail"] == "Provider unavailable."
    assert failed["analysis"] == scenario["analysis"]
    completed = review.scenarios.persist_analysis(MATTER, scenario["scenario_id"], "Conditional analysis.",
        expected_revision=queued_revision, source_action_key="analyze-audience", run_id="RUN-AUDIENCE",
        analysis_baseline_revisions=baseline, affected_issue_ids=["ISS-AGE"],
        affected_branch_ids=["OPT-AGE"], claim_ids=["CLM-AGE"],
        proposed_outcomes=[{"outcome_id": "OPT-AGE", "label": "Use an age screen", "condition": "If users are under 13", "issue_ids": ["ISS-AGE"]}],
        unresolved_conditions=["The actual audience remains unknown."], source_links=["SRC-COPPA"])
    assert completed["analysis_state"] == "completed"
    assert completed["analysis_run_id"] == "RUN-AUDIENCE"
    assert completed["proposed_outcomes"][0]["outcome_id"] == "OPT-AGE"
    assert review.scenarios.persist_analysis(MATTER, scenario["scenario_id"], "Conditional analysis.",
        expected_revision=queued_revision, source_action_key="analyze-audience", run_id="RUN-AUDIENCE",
        analysis_baseline_revisions=baseline, affected_issue_ids=["ISS-AGE"],
        affected_branch_ids=["OPT-AGE"], claim_ids=["CLM-AGE"],
        proposed_outcomes=[{"outcome_id": "OPT-AGE", "label": "Use an age screen", "condition": "If users are under 13", "issue_ids": ["ISS-AGE"]}],
        unresolved_conditions=["The actual audience remains unknown."], source_links=["SRC-COPPA"])["revision"] == completed["revision"]
    assert review.records.get(MATTER)["facts"] == before
    retry = review.scenarios.begin_analysis(MATTER, scenario["scenario_id"], {"instruction": "Analyze the changed audience.",
        "expected_scenario_revision": scenario["revision"], "baseline_revisions": baseline, "source_action_key": "analyze-audience"})
    assert retry["retry"] is True
    with pytest.raises(WorkspaceConflict):
        review.scenarios.begin_analysis(MATTER, scenario["scenario_id"], {"instruction": "Different analysis.",
            "expected_scenario_revision": scenario["revision"], "baseline_revisions": baseline, "source_action_key": "analyze-audience"})


def test_late_failure_and_binding_do_not_replace_newer_scenario_result(review):
    learning_app(review)
    baseline = review.workspace.source_revisions(MATTER)
    scenario = review.scenarios.save(MATTER, {"title": "Concurrent hypothetical", "baseline_revisions": baseline,
        "issue_ids": ["ISS-AGE"], "proposed_fact_changes": [{"change_id": "CHANGE-AGE", "text": "Assume an under-13 audience."}]},
        source_action_key="concurrent-scenario")
    sid = scenario["scenario_id"]
    for key in ["analysis-old", "analysis-new"]:
        current = review.scenarios.get(MATTER, sid)
        review.scenarios.begin_analysis(MATTER, sid, {"instruction": key, "expected_scenario_revision": current["revision"],
            "baseline_revisions": baseline, "source_action_key": key})
    current = review.scenarios.bind_analysis_run(MATTER, sid, source_action_key="analysis-new", run_id="RUN-NEW")
    completed = review.scenarios.persist_analysis(MATTER, sid, "Newer conditional result.", expected_revision=current["revision"],
        source_action_key="analysis-new", run_id="RUN-NEW", analysis_baseline_revisions=baseline)
    review.scenarios.fail_analysis(MATTER, sid, source_action_key="analysis-old", run_id="RUN-OLD", failure_detail="Late provider failure.")
    after = review.scenarios.bind_analysis_run(MATTER, sid, source_action_key="analysis-old", run_id="RUN-OLD")
    assert after["analysis_state"] == "completed"
    assert after["analysis_run_id"] == "RUN-NEW"
    assert after["analysis"] == completed["analysis"]
    operations = review.scenarios._document(MATTER, sid)["metadata"]["analysis_operations"]
    old = next(item for item in operations if item["source_action_key"] == "analysis-old")
    assert old["failure_detail"] == "Late provider failure."
    assert old["state"] == "failed"


def test_review_projection_and_direct_actions_are_available_from_workspace_api(app_context):
    review = WorkspaceReviewService(app_context.vault, app_context.matters, app_context.workspace,
                                    app_context.matter_records, app_context.workspace_scenarios)
    learning_app(review)
    app = FastAPI()
    app.state.context = app_context
    app.include_router(workspace_router.router, prefix="/api")
    client = TestClient(app)
    snapshot = client.get(f"/api/matters/{MATTER}/workspace")
    assert snapshot.status_code == 200
    assert snapshot.json()["review_items"]
    assert len(snapshot.json()["claims"]) == 2
    assert snapshot.json()["documents"]
    mapped = client.get(f"/api/matters/{MATTER}/workspace/decision-map", params={"issue_id": "ISS-AGE"})
    assert mapped.status_code == 200
    assert mapped.json()["selected_issue_id"] == "ISS-AGE"
    revision = review.workspace.issues_revision(MATTER)
    disposed = client.post(f"/api/matters/{MATTER}/workspace/issues/ISS-AGE/disposition", json={
        "disposition": "resolved", "reason": "The lawyer completed the direct review.",
        "expected_revision": revision, "source_action_key": "api-disposition",
    })
    assert disposed.status_code == 200
    assert disposed.json()["issue"]["disposition_history"][-1]["actor_id"] == "local-lawyer"


def test_current_answer_claims_are_separate_from_historical_output_claims(app_context):
    import copy
    review = WorkspaceReviewService(app_context.vault, app_context.matters, app_context.workspace,
                                    app_context.matter_records, app_context.workspace_scenarios)
    learning_app(review)
    document = review.workspace._document(MATTER, "workspace.md")
    old = copy.deepcopy(document["metadata"]["claims"][0])
    current = copy.deepcopy(old)
    current.update(claim_revision="claim-current", output_revision="output-current")
    current["evidence"][0].update(claim_revision="claim-current", output_revision="output-current", available_excerpt="Current exact excerpt.")
    document["metadata"].update(claims=[old], snapshot={"short_answer": "Current answer [source:SRC-COPPA|16 CFR 312.2 — child]", "claims": [current]})
    review.vault.write_markdown(document["path"], document["content"], document["metadata"])
    app = FastAPI()
    app.state.context = app_context
    app.include_router(workspace_router.router, prefix="/api")
    payload = TestClient(app).get(f"/api/matters/{MATTER}/workspace").json()
    assert len(payload["claims"]) == 2
    assert [item["output_revision"] for item in payload["answer_claims"]] == ["output-current"]
    assert payload["answer_claims"][0]["evidence"][0]["available_excerpt"] == "Current exact excerpt."
    assert next(item for item in payload["claims"] if item["output_revision"] == "out7")["evidence"][0]["available_excerpt"] == old["evidence"][0]["available_excerpt"]
