from __future__ import annotations

import threading

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import DecisionCreate
from app.routers import decisions as decisions_router
from app.services.index import IndexService
from app.services.issue_analysis import IssueAnalysisService
from app.services.recommendations import RecommendationService
from app.services.workspace import WorkspaceConflict, digest
from app.services.workspace_review import WorkspaceReviewService


APEX_DECISION_ID = "DEC-DEMO-APEX-RETENTION"
CEDAR_DECISION_ID = "DEC-DEMO-CEDAR-LAUNCH"


def _published_basis(app_context, run_id: str, suffix: str = "current") -> dict:
    matter_id = "MAT-DEMO-HARBOR"
    issue_id = app_context.workspace.issues(matter_id)[0]["issue_id"]
    service = IssueAnalysisService(app_context.vault, app_context.matters, app_context.workspace)
    capture = service.capture(matter_id, issue_id)
    text = f"Decision basis {suffix}."
    output_revision = digest(text)
    path = app_context.workspace._path(matter_id, f"inquiries/{run_id}.md")
    app_context.vault.write_markdown(path, text, {"matter_id": matter_id,
        "record_type": "workspace_inquiry", "run_id": run_id,
        "output_revision": output_revision, "claims": []})
    structure = {"issue_analysis": {"issue_id": issue_id,
        "explanation": "The notice path depends on release timing.",
        "tests": [{"test_id": "notice-test", "title": "Notice test", "condition_ids": ["release"]}],
        "conditions": [{"condition_id": "release", "question": "Will notice precede the hold?", "assessment": "unknown"}],
        "options": [{"option_id": "advance-notice", "title": f"Give advance notice {suffix}",
            "requirements": [{"condition_id": "release", "state": "met"}], "combination": "all",
            "condition_summary": "If advance notice is operationally available.",
            "consequence": "Customers receive notice before a hold.", "trade_off": "The hold can be delayed.",
            "remaining_work": ["Confirm the delivery channel."], "recommendation": "recommended",
            "recommendation_reason": "This gives customers a clear warning."}]}}
    analysis = service.publish(matter_id, path=path, run_id=run_id,
        output_revision=output_revision, structure=structure, capture=capture)["issue_analyses"][0]
    option = analysis["options"][0]
    return {"issue_id": issue_id, "analysis_id": analysis["analysis_id"],
        "analysis_revision": analysis["analysis_revision"], "analysis_path": path,
        "output_revision": output_revision, "selected_option_id": option["option_id"],
        "selected_option_revision": option["option_revision"]}


def _set_decision_field(app_context, decision_id: str, field: str, value: str) -> str:
    decision = app_context.decisions.get(decision_id)
    app_context.vault.update_markdown(decision["path"], metadata_updates={field: value})
    app_context.index.rebuild()
    return decision["path"]


def test_decision_audit_flags_elapsed_review(app_context):
    result = app_context.decisions.audit()
    assert result["reviewed"] >= 2
    decisions = app_context.decisions.list()
    apex = next(item for item in decisions if item["decision_id"] == "DEC-DEMO-APEX-RETENTION")
    assert apex["review_status"] == "stale"
    assert "review date passed" in apex["staleness_reason"].lower()


def test_index_decisions_can_be_scoped_to_one_matter(app_context):
    all_decisions = app_context.index.list_decisions()
    matter_id = "MAT-DEMO-APEX"

    scoped = app_context.index.list_decisions(matter_id=matter_id)

    assert scoped
    assert all(item["matter_id"] == matter_id for item in scoped)
    assert [item["decision_id"] for item in scoped] == [
        item["decision_id"] for item in all_decisions if item["matter_id"] == matter_id
    ]


@pytest.mark.parametrize("field", ["next_review_at", "last_reviewed_at", "decided_at"])
def test_decision_audit_recommends_review_for_invalid_date_field(app_context, field):
    malformed_value = f"not-a-valid-{field}"
    path = _set_decision_field(app_context, CEDAR_DECISION_ID, field, malformed_value)

    result = app_context.decisions.audit()

    change = next(item for item in result["changes"] if item["decision_id"] == CEDAR_DECISION_ID)
    assert change["review_status"] == "review_recommended"
    assert field in change["reason"]
    assert malformed_value not in change["reason"]
    metadata = app_context.vault.read_markdown(path)["metadata"]
    assert metadata[field] == malformed_value


def test_decision_audit_recommends_review_for_binary_date_field(app_context):
    malformed_value = b"not-a-date"
    decision = app_context.decisions.get(CEDAR_DECISION_ID)
    app_context.vault.update_markdown(
        decision["path"], metadata_updates={"next_review_at": malformed_value}
    )
    app_context.index.rebuild()

    result = app_context.decisions.audit()

    change = next(item for item in result["changes"] if item["decision_id"] == CEDAR_DECISION_ID)
    assert change["review_status"] == "review_recommended"
    assert "next_review_at" in change["reason"]
    metadata = app_context.vault.read_markdown(decision["path"])["metadata"]
    assert metadata["next_review_at"] == malformed_value


def test_decision_audit_continues_after_invalid_date_field(app_context):
    _set_decision_field(app_context, APEX_DECISION_ID, "next_review_at", "invalid")
    _set_decision_field(app_context, CEDAR_DECISION_ID, "next_review_at", "2020-01-01T00:00:00+00:00")

    result = app_context.decisions.audit(persist=False)

    changes = {item["decision_id"]: item for item in result["changes"]}
    assert result["reviewed"] == len(app_context.decisions.list())
    assert changes[APEX_DECISION_ID]["review_status"] == "review_recommended"
    assert changes[CEDAR_DECISION_ID]["review_status"] == "stale"


def test_decision_audit_without_persistence_preserves_all_decision_bytes(app_context):
    _set_decision_field(app_context, APEX_DECISION_ID, "last_reviewed_at", "invalid")
    paths = [item["path"] for item in app_context.decisions.list()]
    before = {path: app_context.vault.resolve(path).read_bytes() for path in paths}

    result = app_context.decisions.audit(persist=False)

    assert result["reviewed"] == len(paths)
    assert {path: app_context.vault.resolve(path).read_bytes() for path in paths} == before


def test_recording_durable_decision_does_not_close_matter(app_context):
    before = app_context.matters.get("MAT-DEMO-HARBOR")
    assert before["status"] == "respond"
    assert before["durable_decision_needed"] is True

    app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="Account hold notice standard",
            chosen_path="Give notice before this type of account hold.",
            decision_maker="Counsel",
        )
    )

    after = app_context.matters.get("MAT-DEMO-HARBOR")
    assert after["status"] == "respond"
    assert after["durable_decision_needed"] is False
    assert "Approve" in after["next_action"]


def test_revision_creates_linked_successor_without_changing_prior_record(app_context):
    prior = app_context.decisions.get("DEC-DEMO-APEX-RETENTION")
    before = app_context.vault.read_text(prior["path"])

    successor = app_context.decisions.revise(
        prior["decision_id"],
        DecisionCreate(
            matter_id=prior["matter_id"],
            title="Revised telemetry retention",
            chosen_path="Use a shorter retention period.",
            conditions=["Delete raw audio after seven days."],
        ),
    )

    assert successor["revises_decision_id"] == prior["decision_id"]
    assert successor["conditions"] == ["Delete raw audio after seven days."]
    assert app_context.vault.read_text(prior["path"]) == before


def test_decision_keeps_legacy_conditions_separate_from_mitigation_links(app_context):
    decision = app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="Hold notice controls",
            chosen_path="Use advance notice.",
            conditions=["Escalate exceptions."],
        ),
        mitigation_ids=["MIT-EXPLICIT"],
        review_packet_ids=["PKT-1"],
    )

    loaded = app_context.decisions.get(decision["decision_id"])
    assert loaded["conditions"] == ["Escalate exceptions."]
    assert loaded["mitigation_ids"] == ["MIT-EXPLICIT"]
    assert loaded["review_packet_ids"] == ["PKT-1"]


def test_decision_persists_conditions_and_not_decided(app_context):
    decision = app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="Notice scope",
            chosen_path="Give notice before holds.",
            conditions=["Product confirms the notice channel."],
            not_decided=["The wording of the notice."],
        )
    )

    loaded = app_context.decisions.get(decision["decision_id"])
    assert loaded["conditions"] == ["Product confirms the notice channel."]
    assert loaded["not_decided"] == ["The wording of the notice."]
    body = app_context.vault.read_markdown(decision["path"])["content"]
    assert "## Not decided" in body


def test_decision_records_recommendation_disposition_and_version(app_context):
    recommendations = RecommendationService(app_context.vault, app_context.matters)
    version = recommendations.set_working(
        "MAT-DEMO-HARBOR", "Give advance notice.", actor="Themis.ai", origin="initial_agent"
    )["current_version_id"]
    decision = app_context.decisions.record(DecisionCreate(
        matter_id="MAT-DEMO-HARBOR",
        title="Follow working recommendation",
        chosen_path="Use advance notice.",
        recommendation_disposition="followed",
        recommendation_version_id=version,
    ))

    assert decision["recommendation_disposition"] == "followed"
    assert decision["recommendation_version_id"] == version


def test_decision_can_reference_a_historical_recommendation_version(app_context):
    recommendations = RecommendationService(app_context.vault, app_context.matters)
    historical = recommendations.set_working(
        "MAT-DEMO-HARBOR", "First recommendation.", actor="Themis.ai", origin="initial_agent"
    )["current_version_id"]
    recommendations.set_working(
        "MAT-DEMO-HARBOR", "Current recommendation.", actor="Counsel", origin="lawyer_edit"
    )

    decision = app_context.decisions.record(DecisionCreate(
        matter_id="MAT-DEMO-HARBOR", title="Historical basis",
        chosen_path="Use the earlier recommendation.", recommendation_version_id=historical,
    ))

    assert decision["recommendation_version_id"] == historical


@pytest.mark.parametrize("version_id", ["REC-UNKNOWN", "REC-FOREIGN"])
def test_decision_rejects_unknown_or_foreign_recommendation_version(app_context, version_id):
    if version_id == "REC-FOREIGN":
        foreign = RecommendationService(app_context.vault, app_context.matters).set_working(
            "MAT-DEMO-BEACON", "Foreign recommendation.", actor="Themis.ai", origin="initial_agent"
        )
        version_id = foreign["current_version_id"]

    with pytest.raises(ValueError, match="does not belong to this matter"):
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR", title="Bad basis",
            chosen_path="Do not record this.", recommendation_version_id=version_id,
        ))


@pytest.mark.parametrize("disposition", ["modified", "not_followed"])
def test_decision_departure_requires_short_reason(disposition):
    with pytest.raises(ValueError, match="short reason"):
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="Departure",
            chosen_path="Use another path.",
            recommendation_disposition=disposition,
        )


def test_decision_retry_with_same_action_key_returns_one_canonical_record(app_context):
    action_key = "chat:RUN-DECISION:tool-1"
    request = DecisionCreate(
        matter_id="MAT-DEMO-HARBOR",
        title="Hold notice decision",
        chosen_path="Give notice before holds.",
        rationale="Customers need a clear warning.",
        decision_maker="Counsel",
        source_action_key=action_key,
    )
    first = app_context.decisions.record(request)

    retried = app_context.decisions.record(request)
    with pytest.raises(WorkspaceConflict) as conflict:
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="A retry must not replace the title",
            chosen_path="A retry must not replace the chosen path.",
            conditions=["A retry must not replace lawyer conditions."],
            source_action_key=action_key,
        ))
    assert conflict.value.detail["code"] == "action_key_conflict"
    app_context.index.rebuild()

    matching = [
        item for item in app_context.decisions.list()
        if item["matter_id"] == "MAT-DEMO-HARBOR" and item["decision_id"] == first["decision_id"]
    ]
    matter = app_context.matters.get("MAT-DEMO-HARBOR")
    events = [
        event for event in matter["events"]
        if event.get("event_type") == "decision_recorded"
        and event.get("title") == "Hold notice decision"
    ]
    assert retried["decision_id"] == first["decision_id"]
    assert retried["path"] == first["path"]
    assert retried["title"] == "Hold notice decision"
    assert len(matching) == 1
    assert len([item for item in matter["decisions"] if item["decision_id"] == first["decision_id"]]) == 1
    assert len(events) == 1
    assert app_context.vault.read_markdown(first["path"])["metadata"]["source_action_key"] == action_key


def test_lost_response_retry_returns_saved_decision(app_context):
    request = DecisionCreate(
        matter_id="MAT-DEMO-HARBOR",
        title="Retry after response loss",
        chosen_path="Keep the saved decision.",
        source_action_key="chat:RUN-LOST:tool-2",
    )
    saved_before_response_loss = app_context.decisions.record(request)

    returned_by_retry = app_context.decisions.record(request)

    assert returned_by_retry["decision_id"] == saved_before_response_loss["decision_id"]
    assert returned_by_retry["decided_at"] == saved_before_response_loss["decided_at"]


def test_decision_freezes_server_option_basis_and_roundtrips_after_index_rebuild(app_context):
    basis = _published_basis(app_context, "RUN-DECISION-BASIS")
    before_issue = next(item for item in app_context.workspace.issues("MAT-DEMO-HARBOR")
                        if item["issue_id"] == basis["issue_id"])
    before_status = app_context.matters.get("MAT-DEMO-HARBOR")["status"]
    supplied = {**basis, "canonical_option": {"option_id": basis["selected_option_id"],
        "title": "Client supplied title must be ignored"}, "input_basis": {"forged": "client"}}
    decision = app_context.decisions.record(DecisionCreate(
        matter_id="MAT-DEMO-HARBOR", title="Advance notice path",
        chosen_path="Use advance notice with a lawyer edit.",
        conditions=["The delivery channel is available."], map_basis=supplied,
        source_action_key="decision:exact-map-basis",
    ))

    assert decision["chosen_path"] == "Use advance notice with a lawyer edit."
    assert decision["conditions"] == ["The delivery channel is available."]
    assert decision["map_basis"]["canonical_option"]["title"] == "Give advance notice current"
    assert decision["map_basis"]["canonical_option"]["requirements"]
    assert decision["map_basis"]["canonical_option"]["consequence"]
    assert decision["map_basis"]["canonical_option"]["recommendation"] == "recommended"
    assert decision["map_basis"]["input_basis"] != {"forged": "client"}
    assert decision["request_fingerprint"]
    after_issue = next(item for item in app_context.workspace.issues("MAT-DEMO-HARBOR")
                       if item["issue_id"] == basis["issue_id"])
    assert after_issue.get("disposition") == before_issue.get("disposition")
    assert after_issue.get("disposition_history") == before_issue.get("disposition_history")
    assert app_context.matters.get("MAT-DEMO-HARBOR")["status"] == before_status

    app_context.index.rebuild()
    assert app_context.decisions.get(decision["decision_id"])["map_basis"] == decision["map_basis"]
    app = FastAPI()
    app.state.context = app_context
    app.include_router(decisions_router.router, prefix="/api")
    response = TestClient(app).get(f"/api/decisions/{decision['decision_id']}")
    assert response.status_code == 200
    assert response.json()["map_basis"]["selected_option_revision"] == basis["selected_option_revision"]


def test_decision_rejects_wrong_foreign_or_tampered_option_basis(app_context):
    basis = _published_basis(app_context, "RUN-DECISION-VALIDATION")
    with pytest.raises(ValueError, match="option revision"):
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR", title="Wrong revision", chosen_path="No write.",
            map_basis={**basis, "selected_option_revision": "tampered"},
        ))
    with pytest.raises(ValueError, match="does not belong to this analysis"):
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR", title="Wrong option", chosen_path="No write.",
            map_basis={**basis, "selected_option_id": "OPT-FOREIGN"},
        ))
    with pytest.raises(ValueError, match="Target must belong"):
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-BEACON", title="Foreign matter", chosen_path="No write.",
            map_basis=basis,
        ))

    document = app_context.vault.read_markdown(basis["analysis_path"])
    analysis = document["metadata"]["issue_analyses"][0]
    analysis["options"][0]["title"] = "Changed without a new option revision"
    app_context.vault.write_markdown(document["path"], document["content"], document["metadata"])
    with pytest.raises(ValueError, match="option revision"):
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR", title="Tampered canonical option", chosen_path="No write.",
            map_basis=basis,
        ))


def test_stale_basis_conflicts_historical_is_explicit_and_retry_survives_regeneration(app_context):
    old_basis = _published_basis(app_context, "RUN-BASIS-OLD", suffix="old")
    original = DecisionCreate(matter_id="MAT-DEMO-HARBOR", title="Recorded old path",
        chosen_path="Keep this lawyer wording.", map_basis=old_basis,
        source_action_key="decision:old-basis")
    saved = app_context.decisions.record(original)
    _published_basis(app_context, "RUN-BASIS-NEW", suffix="new")

    assert app_context.decisions.record(original)["decision_id"] == saved["decision_id"]
    with pytest.raises(WorkspaceConflict) as conflict:
        app_context.decisions.record(DecisionCreate(
            matter_id="MAT-DEMO-HARBOR", title="Stale old path", chosen_path="Do not save.",
            map_basis=old_basis, source_action_key="decision:stale-basis"))
    assert conflict.value.detail["code"] == "stale_analysis_basis"
    historical = app_context.decisions.record(DecisionCreate(
        matter_id="MAT-DEMO-HARBOR", title="Explicit historical path",
        chosen_path="Use the prior option as historical input.",
        map_basis={**old_basis, "use_historical_basis": True},
        source_action_key="decision:historical-basis"))
    assert historical["map_basis"]["use_historical_basis"] is True
    assert app_context.decisions.get(saved["decision_id"])["chosen_path"] == "Keep this lawyer wording."
    assert app_context.decisions.get(saved["decision_id"])["map_basis"]["analysis_id"] == old_basis["analysis_id"]
    review = WorkspaceReviewService(app_context.vault, app_context.matters, app_context.workspace,
                                    app_context.matter_records, app_context.workspace_scenarios)
    mapped = review.decision_map("MAT-DEMO-HARBOR")
    recorded_edge = next(edge for edge in mapped["edges"]
                         if edge["to_node_id"] == f"decision:{saved['decision_id']}"
                         and edge["from_node_id"] == f"option:{old_basis['selected_option_id']}")
    assert recorded_edge["state"] == "historical"


def test_saved_before_response_failure_retries_from_frozen_basis_without_source(app_context, monkeypatch):
    basis = _published_basis(app_context, "RUN-PARTIAL-WRITE")
    request = DecisionCreate(matter_id="MAT-DEMO-HARBOR", title="Partial write retry",
        chosen_path="Return the already saved record.", map_basis=basis,
        source_action_key="decision:partial-write")
    finish = app_context.decisions._finish_record
    monkeypatch.setattr(app_context.decisions, "_finish_record",
                        lambda path, metadata: (_ for _ in ()).throw(OSError("response failed")))
    with pytest.raises(OSError, match="response failed"):
        app_context.decisions.record(request)
    monkeypatch.setattr(app_context.decisions, "_finish_record", finish)
    app_context.vault.resolve(basis["analysis_path"]).unlink()

    retried = app_context.decisions.record(request)
    assert retried["title"] == "Partial write retry"
    assert retried["map_basis"]["analysis_id"] == basis["analysis_id"]


def test_decision_fingerprint_includes_revision_mitigation_and_review_links(app_context):
    prior = app_context.decisions.record(DecisionCreate(
        matter_id="MAT-DEMO-HARBOR", title="Prior linked decision",
        chosen_path="Provide a revision target."))
    request = DecisionCreate(matter_id="MAT-DEMO-HARBOR", title="Linked decision",
        chosen_path="Keep linked inputs exact.", source_action_key="decision:linked-fingerprint")
    first = app_context.decisions.record(request, revises_decision_id=prior["decision_id"],
        mitigation_ids=["MIT-1"], review_packet_ids=["PKT-1"])
    assert app_context.decisions.record(request, revises_decision_id=prior["decision_id"],
        mitigation_ids=["MIT-1"], review_packet_ids=["PKT-1"])["decision_id"] == first["decision_id"]
    with pytest.raises(WorkspaceConflict) as conflict:
        app_context.decisions.record(request, revises_decision_id=prior["decision_id"],
            mitigation_ids=["MIT-2"], review_packet_ids=["PKT-1"])
    assert conflict.value.detail["code"] == "action_key_conflict"


def test_empty_rationale_survives_reload_and_index_rebuild(app_context):
    decision = app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="No rationale supplied",
            chosen_path="Record the choice without a rationale.",
            rationale="",
            source_action_key="decision:empty-rationale",
        )
    )

    app_context.index.rebuild()
    reloaded = app_context.decisions.get(decision["decision_id"])

    assert reloaded["rationale"] == ""
    assert "## Chosen path" not in reloaded["rationale"]
    assert app_context.vault.read_markdown(decision["path"])["metadata"]["rationale"] == ""


def test_concurrent_rebuild_cannot_replace_newer_snapshot_with_stale_one(app_context, monkeypatch):
    first = IndexService(app_context.index.db_path, app_context.vault)
    second = IndexService(app_context.index.db_path, app_context.vault)
    stale_built = threading.Event()
    release_stale = threading.Event()
    rebuild_errors: list[BaseException] = []
    original_build = first._build

    def pause_after_stale_build(connection):
        report = original_build(connection)
        stale_built.set()
        assert release_stale.wait(timeout=5)
        return report

    monkeypatch.setattr(first, "_build", pause_after_stale_build)

    def rebuild(service):
        try:
            service.rebuild()
        except BaseException as exc:
            rebuild_errors.append(exc)

    stale_thread = threading.Thread(target=rebuild, args=(first,))
    stale_thread.start()
    assert stale_built.wait(timeout=5)

    decision_id = "DEC-RACE-PROBE"
    decision_path = f"{app_context.matters.matter_path('MAT-DEMO-HARBOR')}/decisions/{decision_id}.md"
    app_context.vault.write_markdown(
        decision_path,
        "# Race probe\n\n## Chosen path\n\nKeep the Markdown decision visible.\n",
        {
            "decision_id": decision_id,
            "matter_id": "MAT-DEMO-HARBOR",
            "title": "Race probe",
            "chosen_path": "Keep the Markdown decision visible.",
            "decision_maker": "Counsel",
            "decided_at": "2026-08-31T12:00:00+00:00",
        },
    )
    newer_thread = threading.Thread(target=rebuild, args=(second,))
    newer_thread.start()
    release_stale.set()
    stale_thread.join(timeout=5)
    newer_thread.join(timeout=5)

    assert not stale_thread.is_alive()
    assert not newer_thread.is_alive()
    assert rebuild_errors == []
    assert app_context.vault.exists(decision_path)
    assert any(item["decision_id"] == decision_id for item in second.list_decisions())
