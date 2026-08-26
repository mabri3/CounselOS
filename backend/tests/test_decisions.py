from __future__ import annotations


def test_decision_audit_flags_elapsed_review(app_context):
    result = app_context.decisions.audit()
    assert result["reviewed"] >= 2
    decisions = app_context.decisions.list()
    apex = next(item for item in decisions if item["decision_id"] == "DEC-DEMO-APEX-RETENTION")
    assert apex["review_status"] == "stale"
    assert "review date passed" in apex["staleness_reason"].lower()
