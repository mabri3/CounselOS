from __future__ import annotations

import pytest

from app.services.issue_analysis import IssueAnalysisService
from app.services.workspace import digest


MATTER = "MAT-DEMO-BEACON"


def _service(app):
    return IssueAnalysisService(app.vault, app.matters, app.workspace)


def _issue(app):
    return app.workspace.issues(MATTER)[0]["issue_id"]


def _structure(issue_id: str, *, claim_id: str | None = None):
    claims = [claim_id] if claim_id else []
    return {"issue_analysis": {
        "issue_id": issue_id,
        "display_title": "Automated decision test",
        "explanation": "The characterization changes the notice path.",
        "business_effect": "The launch may need a different notice.",
        "tests": [{"test_id": "test-1", "title": "Coverage test",
                   "condition_ids": ["condition-1"], "claim_ids": claims}],
        "conditions": [{"condition_id": "condition-1",
                        "question": "Does the flow make an eligibility decision?",
                        "assessment": "unknown", "claim_ids": claims}],
        "options": [
            {"option_id": "path-yes", "title": "Treat as covered",
             "requirements": [{"condition_id": "condition-1", "state": "met"}],
             "combination": "all", "claim_ids": claims},
            {"option_id": "path-no", "title": "Treat as outside scope",
             "requirements": [{"condition_id": "condition-1", "state": "not_met"}],
             "combination": "all"},
        ],
    }}


def _output(app, run_id: str, text: str, *, claims=None):
    path = app.workspace._path(MATTER, f"inquiries/{run_id}.md")
    revision = digest(text)
    app.vault.write_markdown(path, text, {
        "record_type": "workspace_inquiry", "matter_id": MATTER,
        "run_id": run_id, "output_revision": revision, "claims": claims or [],
    })
    return path, revision


def test_capture_publish_resolve_and_exact_load(app_context):
    app = app_context
    issue_id = _issue(app)
    capture = _service(app).capture(MATTER, issue_id)
    text = "The characterization changes the notice path."
    revision = digest(text)
    claim = {"claim_id": "CLM-current", "text": "characterization changes",
             "claim_revision": "claim-rev", "output_revision": revision,
             "applicability": {}, "evidence": [], "support_gap": ""}
    path, _ = _output(app, "RUN-analysis", text, claims=[claim])
    published = _service(app).publish(
        MATTER, path=path, run_id="RUN-analysis", output_revision=revision,
        structure=_structure(issue_id, claim_id="CLM-current"), capture=capture,
        claims=[claim],
    )
    assert len(published["issue_analyses"]) == 1
    analysis = published["issue_analyses"][0]
    assert analysis["source_revisions"] == {"claim:CLM-current": revision}
    assert analysis["tests"][0]["test_id"].startswith("TST-")
    assert analysis["conditions"][0]["condition_id"].startswith("CON-")
    assert analysis["options"][0]["option_id"].startswith("OPT-")
    assert analysis["options"][0]["option_revision"]
    replay = _service(app).publish(
        MATTER, path=path, run_id="RUN-analysis", output_revision=revision,
        structure=_structure(issue_id, claim_id="CLM-current"), capture=capture,
        claims=[claim],
    )
    assert replay["historical"] is False
    assert replay["issue_analyses"][0]["analysis_revision"] == analysis["analysis_revision"]
    resolved = _service(app).resolve(MATTER, issue_id)
    assert resolved["state"] == "saved"
    assert _service(app).load(MATTER, path, analysis["analysis_id"], analysis["analysis_revision"]) == analysis


def test_changed_fact_marks_analysis_needs_review_but_claim_link_write_does_not(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    capture = service.capture(MATTER, issue_id)
    path, revision = _output(app, "RUN-stale", "Useful analysis.")
    service.publish(MATTER, path=path, run_id="RUN-stale", output_revision=revision,
                    structure=_structure(issue_id), capture=capture)
    issues = app.workspace.issues(MATTER)
    issues[0]["claim_ids"] = ["CLM-maintenance"]
    issues[0]["claim_output_revisions"] = {"CLM-maintenance": "old-output"}
    app.workspace.save_issues(MATTER, issues, expected_revision=app.workspace.issues_revision(MATTER))
    assert service.resolve(MATTER, issue_id)["state"] == "saved"
    record = app.workspace.records.get(MATTER)
    record["facts"][0]["text"] += " Changed."
    app.workspace.records._save(MATTER, record)
    assert service.resolve(MATTER, issue_id)["state"] == "needs_review"


def test_late_same_input_run_cannot_replace_newer_analysis(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    older = service.capture(MATTER, issue_id)
    newer = service.capture(MATTER, issue_id)
    newer_path, newer_revision = _output(app, "RUN-newer", "Newer useful analysis.")
    older_path, older_revision = _output(app, "RUN-older", "Older useful analysis.")
    service.publish(MATTER, path=newer_path, run_id="RUN-newer", output_revision=newer_revision,
                    structure=_structure(issue_id), capture=newer)
    late = service.publish(MATTER, path=older_path, run_id="RUN-older", output_revision=older_revision,
                           structure=_structure(issue_id), capture=older)
    assert late["historical"] is True
    assert service.resolve(MATTER, issue_id)["analysis"]["run_id"] == "RUN-newer"


def test_two_issue_publications_from_same_workspace_snapshot_keep_both_pointers(app_context):
    app = app_context
    service = _service(app)
    issue_a, issue_b = [item["issue_id"] for item in app.workspace.issues(MATTER)[:2]]
    capture_a = service.capture(MATTER, issue_a)
    capture_b = service.capture(MATTER, issue_b)
    path_a, revision_a = _output(app, "RUN-A", "Issue A analysis.")
    path_b, revision_b = _output(app, "RUN-B", "Issue B analysis.")
    service.publish(MATTER, path=path_a, run_id="RUN-A", output_revision=revision_a,
                    structure=_structure(issue_a), capture=capture_a)
    service.publish(MATTER, path=path_b, run_id="RUN-B", output_revision=revision_b,
                    structure=_structure(issue_b), capture=capture_b)
    pointers = app.workspace._document(MATTER, "workspace.md")["metadata"]["issue_analyses"]
    assert pointers[issue_a]["run_id"] == "RUN-A"
    assert pointers[issue_b]["run_id"] == "RUN-B"


def test_malformed_later_options_preserve_prior_current_pointer(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    first_capture = service.capture(MATTER, issue_id)
    first_path, first_revision = _output(app, "RUN-valid", "Valid paths.")
    first = service.publish(MATTER, path=first_path, run_id="RUN-valid", output_revision=first_revision,
                            structure=_structure(issue_id), capture=first_capture)
    second_capture = service.capture(MATTER, issue_id)
    second_path, second_revision = _output(app, "RUN-malformed", "Useful later prose.")
    malformed = _structure(issue_id)
    malformed["issue_analysis"]["options"] = [{
        "option_id": "bad", "title": "Bad nested route",
        "requirements": [{"all": [{"condition_id": "condition-1", "state": "met"}]}],
        "combination": "all",
    }]
    later = service.publish(MATTER, path=second_path, run_id="RUN-malformed",
                            output_revision=second_revision, structure=malformed,
                            capture=second_capture)
    assert later["historical"] is True
    assert app.vault.read_markdown(second_path)["content"].strip() == "Useful later prose."
    assert service.resolve(MATTER, issue_id)["analysis"]["analysis_id"] == first["issue_analyses"][0]["analysis_id"]


def test_excluded_projection_is_fresh_and_selected_source_edit_invalidates(app_context):
    app = app_context
    issue_id = _issue(app)
    source_path = app.workspace._path(MATTER, "sources/policy.txt")
    app.vault.resolve(source_path).parent.mkdir(parents=True, exist_ok=True)
    app.vault.resolve(source_path).write_text("Policy version one", encoding="utf-8")
    frozen = app.agent_context.build_run_context(
        app.agents.get("counsel-copilot"), matter_id=MATTER, run_id="RUN-context",
        active_file=source_path, target={"matter_id": MATTER, "issue_id": issue_id},
        selections=[{"reference_id": "excluded-source", "path": source_path,
                     "role": "source_file", "selected": False}],
    )
    # The excluded projection must not become stale from its own omission.
    capture = frozen["issue_analysis_capture"]
    path, revision = _output(app, "RUN-excluded", "Excluded-source analysis.")
    _service(app).publish(MATTER, path=path, run_id="RUN-excluded", output_revision=revision,
                          structure=_structure(issue_id), capture=capture)
    assert _service(app).resolve(MATTER, issue_id)["state"] == "saved"

    included = app.agent_context.build_run_context(
        app.agents.get("counsel-copilot"), matter_id=MATTER, run_id="RUN-included",
        active_file=source_path, target={"matter_id": MATTER, "issue_id": issue_id},
    )
    included_path, included_revision = _output(app, "RUN-included", "Included-source analysis.")
    _service(app).publish(MATTER, path=included_path, run_id="RUN-included",
                          output_revision=included_revision, structure=_structure(issue_id),
                          capture=included["issue_analysis_capture"])
    assert _service(app).resolve(MATTER, issue_id)["state"] == "saved"
    app.vault.resolve(source_path).write_text("Policy version two", encoding="utf-8")
    assert _service(app).resolve(MATTER, issue_id)["state"] == "needs_review"


def test_source_edit_between_capture_and_publish_keeps_prior_current_pointer(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    first_capture = service.capture(MATTER, issue_id)
    first_path, first_revision = _output(app, "RUN-current", "Current analysis.")
    current = service.publish(MATTER, path=first_path, run_id="RUN-current",
                              output_revision=first_revision,
                              structure=_structure(issue_id), capture=first_capture)
    source_path = app.workspace._path(MATTER, "sources/selected.txt")
    app.vault.resolve(source_path).parent.mkdir(parents=True, exist_ok=True)
    app.vault.resolve(source_path).write_text("Selected version one", encoding="utf-8")
    frozen = app.agent_context.build_run_context(
        app.agents.get("counsel-copilot"), matter_id=MATTER,
        run_id="RUN-source-race", active_file=source_path,
        target={"matter_id": MATTER, "issue_id": issue_id},
    )
    app.vault.resolve(source_path).write_text("Selected version two", encoding="utf-8")
    late_path, late_revision = _output(app, "RUN-source-race", "Late source analysis.")
    late = service.publish(
        MATTER, path=late_path, run_id="RUN-source-race",
        output_revision=late_revision, structure=_structure(issue_id),
        capture=frozen["issue_analysis_capture"],
    )
    assert late["historical"] is True
    assert service.resolve(MATTER, issue_id)["analysis"]["analysis_id"] == current["issue_analyses"][0]["analysis_id"]


@pytest.mark.parametrize("role", ["selected_passage", "unsaved_editor_text"])
def test_ephemeral_context_pins_exact_bytes_and_tracks_saved_file_separately(app_context, role):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    source_path = app.workspace._path(MATTER, f"drafts/{role}.md")
    app.vault.resolve(source_path).parent.mkdir(parents=True, exist_ok=True)
    app.vault.resolve(source_path).write_text("Saved file version one.", encoding="utf-8")

    def frozen(value: str):
        return {"manifest": {"entries": [{
            "reference_id": role, "path": source_path, "role": role,
            "state": "included", "revision": digest("Saved file version one.\n"),
            "supplied_revision": digest(value), "supplied_chars": len(value),
        }]}}

    first = service.capture(MATTER, issue_id, frozen_context=frozen("Alpha draft"))
    second = service.capture(MATTER, issue_id, frozen_context=frozen("Bravo draft"))
    first_basis = first["issues"][issue_id]["input_basis"]
    second_basis = second["issues"][issue_id]["input_basis"]
    supplied_key = next(key for key in first_basis if key.startswith("context:"))
    file_key = next(key for key in first_basis if key.startswith("context-file:"))
    assert first_basis[supplied_key] != second_basis[supplied_key]
    assert first_basis[file_key] == second_basis[file_key]

    path, revision = _output(app, f"RUN-{role}", f"Analysis of {role}.")
    service.publish(MATTER, path=path, run_id=f"RUN-{role}", output_revision=revision,
                    structure=_structure(issue_id), capture=first)
    assert service.resolve(MATTER, issue_id)["state"] == "saved"
    app.vault.resolve(source_path).write_text("Saved file version two.", encoding="utf-8")
    assert service.resolve(MATTER, issue_id)["state"] == "needs_review"


def test_duplicate_and_foreign_links_do_not_replace_prior_analysis(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    capture = service.capture(MATTER, issue_id)
    path, revision = _output(app, "RUN-invalid", "Useful prose remains.")
    invalid = _structure(issue_id)
    invalid["issue_analysis"]["conditions"][0]["condition_id"] = "test-1"
    invalid["issue_analysis"]["conditions"][0]["fact_ids"] = ["FACT-foreign"]
    result = service.publish(MATTER, path=path, run_id="RUN-invalid",
                             output_revision=revision, structure=invalid, capture=capture)
    assert not result["issue_analyses"]
    assert service.resolve(MATTER, issue_id)["state"] == "not_mapped"


def test_load_rejects_tampered_output_content(app_context):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    capture = service.capture(MATTER, issue_id)
    path, revision = _output(app, "RUN-tamper", "Original output.")
    analysis = service.publish(MATTER, path=path, run_id="RUN-tamper",
                               output_revision=revision, structure=_structure(issue_id),
                               capture=capture)["issue_analyses"][0]
    app.vault.update_markdown(path, content="Changed output.")
    try:
        service.load(MATTER, path, analysis["analysis_id"], analysis["analysis_revision"])
    except ValueError as exc:
        assert "content changed" in str(exc)
    else:
        raise AssertionError("Tampered output was accepted")


def test_option_risk_assessment_is_explicit_and_backward_compatible():
    from app.models.workspace import IssueOption

    old = IssueOption(option_id="option-old", title="Existing path")
    assert old.risk_assessment == "not_assessed"
    assessed = IssueOption(option_id="option-avoid", title="Avoid this route",
                           risk_assessment="not_recommended", trade_off="Saved reason to avoid")
    assert assessed.model_dump()["risk_assessment"] == "not_recommended"


def test_lawyer_condition_assessment_keeps_analysis_and_history(app_context):
    from app.routers.workspace import assess_path_condition, PathConditionAssessment
    from app.services.workspace_review import WorkspaceReviewService
    from fastapi import HTTPException
    app = app_context
    issue_id = _issue(app)
    service = _service(app)
    capture = service.capture(MATTER, issue_id)
    path, revision = _output(app, "RUN-condition-check", "Saved analysis")
    analysis = service.publish(MATTER, path=path, run_id="RUN-condition-check", output_revision=revision,
                               structure=_structure(issue_id), capture=capture)["issue_analyses"][0]
    condition_id = analysis["conditions"][0]["condition_id"]
    for state in ["met", "not_met"]:
        assess_path_condition(MATTER, issue_id, condition_id,
                              PathConditionAssessment(analysis_revision=analysis["analysis_revision"], assessment=state, reason="Reviewed the supporting facts."),
                              context=app, person_id=None)
    history = app.workspace._document(MATTER, "workspace.md")["metadata"]["path_condition_assessments"]
    assert [item["assessment"] for item in history] == ["met", "not_met"]
    assert service.resolve(MATTER, issue_id)["analysis"]["conditions"][0]["assessment"] == "unknown"
    from app.routers.workspace import review_service
    projected = review_service(app).decision_map(MATTER)
    checked = next(node for node in projected["nodes"] if node["record_id"] == condition_id)
    assert checked["state"] == "not_met"
    assert checked["data"]["lawyer_assessment"]["actor"]
    assert any(edge["state"] == "inactive" for edge in projected["edges"] if edge["from_node_id"] == checked["node_id"] and edge["relationship"] == "if")
    with pytest.raises(HTTPException) as error:
        assess_path_condition(MATTER, issue_id, condition_id,
                              PathConditionAssessment(analysis_revision="old", assessment="met", reason="Old view"), context=app, person_id=None)
    assert error.value.status_code == 409


def test_connected_effects_use_canonical_ids_and_validate_targets(app_context):
    app = app_context
    issue_id = _issue(app)
    service = _service(app)
    capture = service.capture(MATTER, issue_id)
    structure = _structure(issue_id)
    structure["issue_analysis"]["options"][0]["effects"] = [{
        "target_option_id": "path-no", "trigger": "condition", "condition_id": "condition-1",
        "condition_state": "met", "reason": "This confirmed condition excludes the other route.",
    }]
    path, revision = _output(app, "RUN-effects", "Connected effects")
    saved = service.publish(MATTER, path=path, run_id="RUN-effects", output_revision=revision,
                            structure=structure, capture=capture)["issue_analyses"][0]
    effect = saved["options"][0]["effects"][0]
    assert effect["target_option_id"] == saved["options"][1]["option_id"]
    assert effect["condition_id"] == saved["conditions"][0]["condition_id"]
    with pytest.raises(ValueError, match="another option"):
        service._validate_links([], [], [{"option_id":"a", "effects":[{"target_option_id":"foreign","trigger":"agreement","reason":"reason"}], "requirements":[],"claim_ids":[],"work_item_ids":[]}], {"claims":set(),"work":set()}, set())

@pytest.mark.parametrize("connections, expected", [(None, None), ([], []), ([{"target_issue_id": "foreign", "relationship": "depends_on", "reason": "Test"}], None)])
def test_connection_assessment_preserves_paths_and_distinguishes_unassessed(app_context, connections, expected):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    structure = _structure(issue_id)
    if connections is not None:
        structure["issue_analysis"]["connections"] = connections
    path, revision = _output(app, "RUN-connections", "Useful analysis")
    result = service.publish(MATTER, path=path, run_id="RUN-connections", output_revision=revision,
                             structure=structure, capture=service.capture(MATTER, issue_id))
    analysis = service.resolve(MATTER, issue_id)["analysis"]
    assert analysis["connections"] == expected
    assert len(analysis["options"]) == 2
    if connections:
        assert result["warnings"]

def test_saved_connection_round_trips(app_context, monkeypatch):
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    capture = service.capture(MATTER, issue_id)
    original = service.workspace.issues
    monkeypatch.setattr(service.workspace, "issues", lambda matter: [*original(matter), {"issue_id": "ISS-related"}])
    structure = _structure(issue_id)
    link = {"target_issue_id": "ISS-related", "relationship": "may_resolve", "reason": "Only after implementation."}
    structure["issue_analysis"]["connections"] = [link]
    path, revision = _output(app, "RUN-linked", "Related issue analysis")
    service.publish(MATTER, path=path, run_id="RUN-linked", output_revision=revision, structure=structure, capture=capture)
    assert service.resolve(MATTER, issue_id)["analysis"]["connections"] == [link]

def test_condition_answer_saves_fact_without_setting_assessment(app_context):
    from app.routers.workspace import answer_path_condition, PathConditionAnswer
    from fastapi import HTTPException
    app = app_context
    service = _service(app)
    issue_id = _issue(app)
    path, revision = _output(app, "RUN-answer", "Conditional analysis")
    service.publish(MATTER, path=path, run_id="RUN-answer", output_revision=revision,
                    structure=_structure(issue_id), capture=service.capture(MATTER, issue_id))
    analysis = service.resolve(MATTER, issue_id)["analysis"]
    condition_id = analysis["conditions"][0]["condition_id"]
    payload = PathConditionAnswer(analysis_revision=analysis["analysis_revision"], answer="The bank holds all funds.", source_action_key="answer-once")
    first = answer_path_condition(MATTER, issue_id, condition_id, payload, context=app, person_id=None)
    second = answer_path_condition(MATTER, issue_id, condition_id, payload, context=app, person_id=None)
    assert first == second
    assert first["fact_ids"]
    assert service.resolve(MATTER, issue_id)["analysis"]["conditions"][0]["assessment"] == "unknown"
    assert len(app.workspace._document(MATTER, "workspace.md")["metadata"]["path_condition_answers"]) == 1
    with pytest.raises(HTTPException) as exc:
        answer_path_condition(MATTER, issue_id, condition_id, payload.model_copy(update={"analysis_revision":"stale"}), context=app, person_id=None)
    assert exc.value.status_code == 409
