from __future__ import annotations

import threading

import pytest

from app.models.api import DecisionCreate
from app.services.index import IndexService
from app.services.recommendations import RecommendationService


APEX_DECISION_ID = "DEC-DEMO-APEX-RETENTION"
CEDAR_DECISION_ID = "DEC-DEMO-CEDAR-LAUNCH"


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
    first = app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="Hold notice decision",
            chosen_path="Give notice before holds.",
            rationale="Customers need a clear warning.",
            decision_maker="Counsel",
            source_action_key=action_key,
        )
    )

    retried = app_context.decisions.record(
        DecisionCreate(
            matter_id="MAT-DEMO-HARBOR",
            title="A retry must not replace the title",
            chosen_path="A retry must not replace the chosen path.",
            source_action_key=action_key,
        )
    )
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
