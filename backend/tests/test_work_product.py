from __future__ import annotations

import pytest

from app.services.work_product import WorkProductService


def test_create_draft_and_finalize_immutable_copy(app_context):
    service = WorkProductService(app_context.vault, app_context.matters)
    draft = service.create_draft("MAT-DEMO-BEACON", title="Launch advice", content="# Advice\n\nShip with conditions.", summary="Draft advice")
    final = service.finalize("MAT-DEMO-BEACON", draft["vault_path"])

    assert "/work-product/draft/" in draft["vault_path"]
    assert "/work-product/final/" in final["vault_path"]
    assert app_context.vault.read_markdown(final["vault_path"])["metadata"]["immutable"] is True
    assert app_context.vault.read_markdown(final["vault_path"])["content"] == app_context.vault.read_markdown(draft["vault_path"])["content"]


def test_finalize_rejects_paths_outside_matter_draft_folder(app_context):
    service = WorkProductService(app_context.vault, app_context.matters)
    with pytest.raises(ValueError, match="Only a draft"):
        service.finalize("MAT-DEMO-BEACON", "03_Matters/beacon-instant-onboarding/drafts/old.md")
