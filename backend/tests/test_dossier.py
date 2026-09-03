from __future__ import annotations

import pytest

from app.services.dossier import DossierService
from app.services.recommendations import RecommendationService


def test_dossier_hash_guard_preserves_lawyer_edit_for_review(app_context):
    service = DossierService(app_context.vault, app_context.matters)
    first = service.propose_update("MAT-DEMO-BEACON", "# Dossier\n\nFirst summary.", expected_hash=None)
    expected = first["content_hash"]
    dossier_path = "03_Matters/beacon-instant-onboarding/dossier.md"
    app_context.vault.update_markdown(dossier_path, content="# Dossier\n\nLawyer edit.")

    proposed = service.propose_update("MAT-DEMO-BEACON", "# Dossier\n\nGenerated update.", expected_hash=expected)
    assert proposed["state"] == "review_required"
    assert app_context.vault.read_markdown(dossier_path)["content"].strip().endswith("Lawyer edit.")
    assert app_context.vault.read_markdown(proposed["revision_path"])["metadata"]["status"] == "draft"

    current_hash = service.content_hash("MAT-DEMO-BEACON")
    applied = service.apply_revision("MAT-DEMO-BEACON", proposed["revision_path"], expected_hash=current_hash)
    assert applied["state"] == "applied"
    assert app_context.vault.read_markdown(dossier_path)["content"].strip().endswith("Generated update.")


def test_non_material_dossier_change_waits_unless_forced(app_context):
    service = DossierService(app_context.vault, app_context.matters)
    first = service.propose_update("MAT-DEMO-BEACON", "Initial", expected_hash=None)
    skipped = service.propose_update("MAT-DEMO-BEACON", "Minor", expected_hash=first["content_hash"], material=False)
    assert skipped["state"] == "not_required"
    forced = service.propose_update("MAT-DEMO-BEACON", "Minor", expected_hash=first["content_hash"], material=False, force=True)
    assert forced["state"] == "applied"


def test_applying_revision_rechecks_content_hash(app_context):
    service = DossierService(app_context.vault, app_context.matters)
    first = service.propose_update("MAT-DEMO-BEACON", "First", expected_hash=None)
    app_context.vault.update_markdown(first["path"], content="Lawyer edit")
    proposed = service.propose_update("MAT-DEMO-BEACON", "Second", expected_hash=first["content_hash"])
    app_context.vault.update_markdown(first["path"], content="Another lawyer edit")
    with pytest.raises(ValueError, match="changed"):
        service.apply_revision("MAT-DEMO-BEACON", proposed["revision_path"], expected_hash=service._hash("Lawyer edit"))


def test_dossier_orientation_updates_sections_and_preserves_other_content(app_context):
    service = app_context.dossiers

    result = service.update_orientation(
        "MAT-DEMO-RELAY",
        summary="Relay needs a migration decision before contract renewal.",
        decision_question="Should Relay require reauthorization within 90 days?",
        open_questions=["Which banks still use stored credentials?", "Can deletion finish in 30 days?"],
        research_path="03_Matters/relay-open-banking/research/new-review.md",
    )

    assert result["state"] == "applied"
    assert service.orientation("MAT-DEMO-RELAY") == {
        "summary": "Relay needs a migration decision before contract renewal.",
        "decision_question": "Should Relay require reauthorization within 90 days?",
        "open_questions": [
            "Which banks still use stored credentials?",
            "Can deletion finish in 30 days?",
        ],
    }
    content = service.get("MAT-DEMO-RELAY")["content"]
    assert "## Work product\n\nNo work product yet." in content
    assert "Latest review: `03_Matters/relay-open-banking/research/new-review.md`" in content


def test_work_state_projection_replaces_only_focused_placeholders(app_context):
    service = app_context.dossiers
    service.propose_update(
        "MAT-DEMO-BEACON",
        "# Matter dossier\n\n## Material facts\n\n- Existing fact.\n",
        expected_hash=None,
    )
    before = service.get("MAT-DEMO-BEACON")["content"]
    expected_hash = service.content_hash("MAT-DEMO-BEACON")

    result = service.update_work_state(
        "MAT-DEMO-BEACON",
        recommendation="Use the notice-first path.",
        draft={"path": "03_Matters/example/draft.md", "title": "Launch response"},
        final=None,
        next_action="Review and finalize the current draft.",
        expected_hash=expected_hash,
    )

    content = service.get("MAT-DEMO-BEACON")["content"]
    assert result["state"] == "applied"
    assert service.section(content, "Options or working recommendation") == "Use the notice-first path."
    assert service.section(content, "Work product links") == (
        "- Draft: [Launch response](03_Matters/example/draft.md)"
    )
    assert service.section(content, "Next counsel action") == "Review and finalize the current draft."
    assert service.section(content, "Material facts") == service.section(before, "Material facts")

    retry = service.update_work_state(
        "MAT-DEMO-BEACON",
        recommendation="Use the notice-first path.",
        draft={"path": "03_Matters/example/draft.md", "title": "Launch response"},
        final=None,
        next_action="Review and finalize the current draft.",
        expected_hash=result["content_hash"],
    )
    assert retry["state"] == "not_required"


def test_work_state_without_typed_recommendation_does_not_deny_draft_advice(app_context):
    service = app_context.dossiers
    result = service.update_work_state(
        "MAT-DEMO-BEACON",
        recommendation="",
        draft={"path": "03_Matters/example/draft.md", "title": "Advice"},
        final=None,
        next_action="Review the draft.",
        expected_hash=service.content_hash("MAT-DEMO-BEACON"),
    )

    assert result["state"] == "applied"
    assert service.section(
        service.get("MAT-DEMO-BEACON")["content"], "Options or working recommendation"
    ) == "No separate working recommendation is saved; the draft may still contain advice."


def test_shared_projection_reads_current_canonical_records(app_context):
    app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Canonical advice", content="Draft body."
    )
    recommendation = RecommendationService(app_context.vault, app_context.matters)
    recommendation.set_working(
        "MAT-DEMO-BEACON", "Use the canonical route.",
        actor="Counsel", origin="lawyer_edit",
    )

    result = app_context.dossiers.project_current_work_state(
        "MAT-DEMO-BEACON",
        expected_hash=app_context.dossiers.content_hash("MAT-DEMO-BEACON"),
    )

    assert result["state"] == "not_required"
    content = app_context.dossiers.get("MAT-DEMO-BEACON")["content"]
    assert "Use the canonical route." in content
    assert "Canonical advice" in content


def test_work_state_projection_uses_hash_guard_for_lawyer_edit(app_context):
    service = app_context.dossiers
    service.propose_update(
        "MAT-DEMO-BEACON", "# Matter dossier\n\nInitial.\n", expected_hash=None
    )
    expected_hash = service.content_hash("MAT-DEMO-BEACON")
    dossier_path = service.get("MAT-DEMO-BEACON")["path"]
    app_context.vault.update_markdown(
        dossier_path,
        content=service.get("MAT-DEMO-BEACON")["content"] + "\nLawyer note.\n",
    )

    result = service.update_work_state(
        "MAT-DEMO-BEACON",
        recommendation="Use the notice-first path.",
        draft=None,
        final=None,
        next_action="Review the recommendation.",
        expected_hash=expected_hash,
    )

    assert result["state"] == "review_required"
    assert result["revision_path"]
    assert "Lawyer note." in service.get("MAT-DEMO-BEACON")["content"]
