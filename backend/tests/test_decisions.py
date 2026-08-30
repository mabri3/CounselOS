from __future__ import annotations

import pytest

from app.models.api import DecisionCreate


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
