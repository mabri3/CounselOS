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
