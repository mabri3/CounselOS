from __future__ import annotations

from app.models.api import DecisionCreate


def test_decision_audit_flags_elapsed_review(app_context):
    result = app_context.decisions.audit()
    assert result["reviewed"] >= 2
    decisions = app_context.decisions.list()
    apex = next(item for item in decisions if item["decision_id"] == "DEC-DEMO-APEX-RETENTION")
    assert apex["review_status"] == "stale"
    assert "review date passed" in apex["staleness_reason"].lower()


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
