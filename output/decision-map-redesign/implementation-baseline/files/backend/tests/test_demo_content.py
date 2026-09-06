from __future__ import annotations


def test_committed_demo_matters_exclude_browser_test_markers(app_context):
    browser_test_markers = (
        "mat-20260828-e78bd8",
        "referral launch browser check",
        "browser-check",
    )

    for matter in app_context.matters.list():
        identity = f"{matter['matter_id']} {matter['title']}".casefold()
        assert not any(marker in identity for marker in browser_test_markers), (
            f"Browser-test matter is committed in the demo vault: {identity}"
        )


def test_fintech_demo_matters_have_realistic_depth_and_progress(app_context):
    expected = {
        "MAT-DEMO-PULSE": ("intake", "03_Matters/pulse-earned-wage-access"),
        "MAT-DEMO-NORTHSTAR": ("research", "03_Matters/northstar-ai-underwriting"),
        "MAT-DEMO-RELAY": ("explore", "03_Matters/relay-open-banking"),
        "MAT-DEMO-CEDAR": ("closed", "03_Matters/cedar-cash-sweep"),
    }
    matters = {matter["matter_id"]: matter for matter in app_context.matters.list()}

    for matter_id, (status, path) in expected.items():
        matter = matters[matter_id]
        assert matter["status"] == status
        assert len(matter["description"].split()) >= 12

        request = app_context.vault.read_markdown(f"{path}/request.md")
        assert len(request["content"].split()) >= 100

        facts = app_context.vault.read_markdown(f"{path}/facts.md")
        issues = app_context.vault.read_markdown(f"{path}/issues.md")
        recommendations = app_context.vault.read_markdown(f"{path}/recommendations.md")
        assert len(facts["content"].split()) >= 50
        assert len(issues["content"].split()) >= 50
        assert len(recommendations["content"].split()) >= 50

    assert app_context.vault.exists(
        "03_Matters/northstar-ai-underwriting/research/research-plan.md"
    )
    assert app_context.vault.exists(
        "03_Matters/relay-open-banking/research/section-1033-and-consent-memo.md"
    )
    assert app_context.vault.exists(
        "03_Matters/relay-open-banking/drafts/decision-note.md"
    )
    assert app_context.vault.exists(
        "03_Matters/cedar-cash-sweep/final/launch-guidance.md"
    )

    cedar_decision = next(
        decision
        for decision in app_context.decisions.list()
        if decision["decision_id"] == "DEC-DEMO-CEDAR-LAUNCH"
    )
    assert cedar_decision["review_status"] == "current"
