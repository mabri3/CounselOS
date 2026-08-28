from __future__ import annotations

import pytest

from app.services.dossier import DossierService


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
