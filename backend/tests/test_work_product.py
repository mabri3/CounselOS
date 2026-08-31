from __future__ import annotations

import pytest

def test_create_draft_and_finalize_immutable_copy(app_context):
    service = app_context.work_products
    draft = service.create_draft("MAT-DEMO-BEACON", title="Launch advice", content="# Advice\n\nShip with conditions.", summary="Draft advice")
    final = service.finalize("MAT-DEMO-BEACON", draft["vault_path"])

    assert "/work-product/draft/" in draft["vault_path"]
    assert "/work-product/final/" in final["vault_path"]
    assert app_context.vault.read_markdown(final["vault_path"])["metadata"]["immutable"] is True
    assert app_context.vault.read_markdown(draft["vault_path"])["metadata"]["record_type"] == "work_product"
    assert app_context.vault.read_markdown(final["vault_path"])["metadata"]["record_type"] == "work_product"
    assert app_context.vault.read_markdown(final["vault_path"])["content"] == app_context.vault.read_markdown(draft["vault_path"])["content"]
    assert draft["record_type"] == final["record_type"] == "work_product"
    assert draft["work_product_id"] == app_context.vault.read_markdown(draft["vault_path"])["metadata"]["work_product_id"]


def test_finalize_rejects_paths_outside_matter_draft_folder(app_context):
    service = app_context.work_products
    with pytest.raises(ValueError, match="Only a draft"):
        service.finalize("MAT-DEMO-BEACON", "03_Matters/beacon-instant-onboarding/drafts/old.md")


def test_metadata_valid_document_outside_draft_folder_cannot_be_revised_or_finalized(app_context):
    service = app_context.work_products
    path = "03_Matters/beacon-instant-onboarding/documents/not-a-draft.md"
    app_context.vault.write_markdown(path, "Misclassified note", {
        "matter_id": "MAT-DEMO-BEACON",
        "record_type": "work_product",
        "state": "draft",
        "immutable": False,
        "work_product_id": "WP-FORGED",
        "title": "Misclassified note",
    })

    with pytest.raises(ValueError, match="canonical draft"):
        service.mutable_draft("MAT-DEMO-BEACON", path)
    with pytest.raises(ValueError, match="Only a draft"):
        service.finalize("MAT-DEMO-BEACON", path)


def test_configured_folders_control_new_drafts_and_finals(app_context):
    app_context.settings_store.write({
        "matter_files.draft_outputs_dir": "lawyer-work/drafts",
        "matter_files.final_outputs_dir": "lawyer-work/finals",
    })
    draft = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Configured", content="First version"
    )
    final = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    assert "/lawyer-work/drafts/" in draft["vault_path"]
    assert "/lawyer-work/finals/" in final["vault_path"]


def test_finalize_is_idempotent_per_draft_content_version(app_context):
    draft = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Versioned", content="First version"
    )
    first = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    retry = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    assert retry["vault_path"] == first["vault_path"]
    assert retry["final_id"] == first["final_id"]
    app_context.vault.update_markdown(draft["vault_path"], content="Second version")
    changed = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    assert changed["vault_path"] != first["vault_path"]
    assert changed["final_id"] != first["final_id"]


def test_legacy_default_path_draft_can_still_be_finalized(app_context):
    path = "03_Matters/beacon-instant-onboarding/work-product/draft/legacy.md"
    app_context.vault.write_markdown(path, "Legacy draft", {
        "matter_id": "MAT-DEMO-BEACON", "state": "draft", "title": "Legacy"
    })
    app_context.settings_store.write({
        "matter_files.draft_outputs_dir": "new-drafts",
        "matter_files.final_outputs_dir": "new-finals",
    })
    final = app_context.work_products.finalize("MAT-DEMO-BEACON", path)
    assert "/new-finals/" in final["vault_path"]
