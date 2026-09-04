from __future__ import annotations

import pytest

from app.models.api import MatterCreate
from app.services.recommendations import RecommendationService

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
    assert draft["vault_path"] in draft["changed_paths"]
    assert final["vault_path"] in final["changed_paths"]
    dossier = app_context.dossiers.get("MAT-DEMO-BEACON")["content"]
    assert f"- Draft: [Launch advice]({draft['vault_path']})" in dossier
    assert f"- Final: [Launch advice]({final['vault_path']})" in dossier
    assert "## Next counsel action\n\nApprove the final response." in dossier


@pytest.mark.parametrize("status", [
    "**Status:** Draft for review",
    "**Status:** Draft for review — not approved",
    "Status: Not final",
])
def test_finalize_rejects_conflicting_leading_lifecycle_status(app_context, status):
    matter_id = "MAT-DEMO-BEACON"
    draft = app_context.work_products.create_draft(
        matter_id, title="Conflicting status", content=f"# Advice\n\n{status}\n\nUseful analysis."
    )
    matter_path = f"{app_context.matters.matter_path(matter_id)}/matter.md"
    final_folder = app_context.work_products.matter_paths.folder(matter_id, "matter_files.final_outputs_dir")
    event_folder = f"{app_context.matters.matter_path(matter_id)}/events"
    matter_before = app_context.vault.read_markdown(matter_path)["metadata"]
    final_paths_before = {app_context.vault.relative(path) for path in app_context.vault.iter_files(final_folder)}
    event_paths_before = {app_context.vault.relative(path) for path in app_context.vault.iter_files(event_folder)}

    assert app_context.work_products.mutable_draft(
        matter_id, draft["vault_path"]
    )["content"].startswith("# Advice")
    with pytest.raises(ValueError, match="Update the draft status before finalizing"):
        app_context.work_products.finalize(matter_id, draft["vault_path"])

    matter_after = app_context.vault.read_markdown(matter_path)["metadata"]
    assert {app_context.vault.relative(path) for path in app_context.vault.iter_files(final_folder)} == final_paths_before
    assert {app_context.vault.relative(path) for path in app_context.vault.iter_files(event_folder)} == event_paths_before
    assert matter_after.get("current_work_product_draft_path") == matter_before.get("current_work_product_draft_path")
    assert matter_after.get("current_work_product_final_path") == matter_before.get("current_work_product_final_path")
    assert matter_after.get("current_work_product_final_id") == matter_before.get("current_work_product_final_id")
    assert matter_after["status"] == matter_before["status"]
    assert app_context.index.get_matter(matter_id)["status"] == matter_before["status"]


@pytest.mark.parametrize("content", [
    "# Advice\n\nStatus: Final for approval\n\nUseful analysis.",
    "# Advice\n\nStatus: Partial research\n\nThe old policy was not approved in 2024.",
])
def test_finalize_allows_non_conflicting_status_and_body_discussion(app_context, content):
    draft = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Allowed status", content=content
    )

    final = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])

    assert final["state"] == "final"


def test_draft_projects_accepted_recommendation_and_dossier_failure_is_best_effort(
    app_context, monkeypatch
):
    RecommendationService(app_context.vault, app_context.matters).set_working(
        "MAT-DEMO-BEACON",
        "Use the notice-first path.",
        actor="Counsel",
        origin="lawyer_edit",
    )
    projected = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Projected advice", content="Draft body"
    )
    dossier = app_context.dossiers.get("MAT-DEMO-BEACON")["content"]
    assert "## Options or working recommendation\n\nUse the notice-first path." in dossier
    assert app_context.dossiers.get("MAT-DEMO-BEACON")["path"] in projected["changed_paths"]
    assert projected["dossier_projection"]["state"] == "applied"

    def fail_projection(*args, **kwargs):
        raise RuntimeError("dossier unavailable")

    monkeypatch.setattr(app_context.dossiers, "update_work_state", fail_projection)
    saved = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Still saved", content="Useful saved body"
    )
    assert saved["dossier_projection"]["state"] == "failed"
    assert "path" not in saved["dossier_projection"]
    assert "revision_path" not in saved["dossier_projection"]
    assert app_context.vault.read_markdown(saved["vault_path"])["content"] == "Useful saved body\n"


def test_create_draft_records_one_current_canonical_draft(app_context):
    first = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="First answer", content="First body"
    )
    second = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Replacement answer", content="Replacement body"
    )

    current = app_context.work_products.current_draft("MAT-DEMO-BEACON")
    matter = app_context.vault.read_markdown(
        "03_Matters/beacon-instant-onboarding/matter.md"
    )

    assert current is not None
    assert current["path"] == second["vault_path"]
    assert current["path"] != first["vault_path"]
    assert matter["metadata"]["current_work_product_draft_path"] == second["vault_path"]
    assert matter["metadata"]["current_work_product_id"] == second["work_product_id"]
    detail = app_context.matters.get("MAT-DEMO-BEACON")
    assert detail["current_work_product_draft_path"] == second["vault_path"]
    assert detail["current_work_product_id"] == second["work_product_id"]
    with pytest.raises(ValueError, match="current canonical draft"):
        app_context.work_products.finalize("MAT-DEMO-BEACON", first["vault_path"])


def test_create_draft_source_action_key_preserves_first_useful_text(app_context):
    first = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON",
        title="Useful answer",
        content="Exact useful text.\n\nKeep this ending.\n",
        source_action_key="chat:RUN-3:tool-2",
    )
    retry = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON",
        title="Retry must not replace it",
        content="Different retry output",
        source_action_key="chat:RUN-3:tool-2",
    )

    assert retry["work_product_id"] == first["work_product_id"]
    assert retry["vault_path"] == first["vault_path"]
    assert first["source_action_key"] == retry["source_action_key"] == "chat:RUN-3:tool-2"
    assert retry["changed_paths"] == []
    saved = app_context.vault.read_markdown(first["vault_path"])
    assert saved["content"] == "Exact useful text.\n\nKeep this ending.\n"
    assert saved["metadata"]["source_action_key"] == "chat:RUN-3:tool-2"


def test_current_draft_fallback_sorts_iso_metadata_without_pointer(app_context, monkeypatch):
    first = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Earlier answer", content="Earlier body"
    )
    second = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Later answer", content="Later body"
    )
    app_context.vault.update_markdown(
        first["vault_path"], metadata_updates={"updated_at": "2026-08-30T10:00:00Z"}
    )
    app_context.vault.update_markdown(
        second["vault_path"], metadata_updates={"updated_at": "2026-08-31T10:00:00Z"}
    )
    matter_path = "03_Matters/beacon-instant-onboarding/matter.md"
    app_context.vault.update_markdown(
        matter_path,
        metadata_updates={
            "current_work_product_draft_path": None,
            "current_work_product_id": None,
        },
    )
    read_markdown = app_context.vault.read_markdown

    def read_with_iso_updated_at(path):
        document = read_markdown(path)
        if document["metadata"].get("record_type") == "work_product":
            document["updated_at"] = document["metadata"]["updated_at"]
        return document

    monkeypatch.setattr(app_context.vault, "read_markdown", read_with_iso_updated_at)

    current = app_context.work_products.current_draft("MAT-DEMO-BEACON")

    assert current is not None
    assert current["path"] == second["vault_path"]


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
    detail = app_context.matters.get("MAT-DEMO-BEACON")
    assert detail["current_work_product_draft_path"] == path
    assert detail["current_work_product_final_path"] == final["vault_path"]
    app_context.matters.move_stage("MAT-DEMO-BEACON", "respond")
    approved = app_context.matters.perform_action(
        "MAT-DEMO-BEACON",
        "approve_response",
        actor="Counsel",
        artifact_path=final["vault_path"],
    )
    assert approved["matter"]["response_approved_artifact_path"] == final["vault_path"]


def test_legacy_draft_does_not_replace_existing_canonical_pointer(app_context):
    canonical = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Canonical", content="Canonical draft"
    )
    legacy_path = "03_Matters/beacon-instant-onboarding/work-product/draft/legacy-other.md"
    app_context.vault.write_markdown(legacy_path, "Legacy draft", {
        "matter_id": "MAT-DEMO-BEACON", "state": "draft", "title": "Legacy other"
    })

    with pytest.raises(ValueError, match="current canonical draft"):
        app_context.work_products.finalize("MAT-DEMO-BEACON", legacy_path)

    detail = app_context.matters.get("MAT-DEMO-BEACON")
    assert detail["current_work_product_draft_path"] == canonical["vault_path"]
    assert detail["current_work_product_final_path"] is None


def test_legacy_root_work_product_is_read_only_fallback(app_context):
    root_path = "03_Matters/beacon-instant-onboarding/work-product.md"
    app_context.vault.write_markdown(root_path, "Legacy answer", {})

    fallback = app_context.work_products.current_draft("MAT-DEMO-BEACON")

    assert fallback is not None
    assert fallback["path"] == root_path
    assert fallback["read_only"] is True
    tree = app_context.matters.get("MAT-DEMO-BEACON")["tree"]
    node = next(item for item in tree if item["path"] == root_path)
    assert node["record_type"] == "work_product"
    assert node["state"] == "draft"
    assert node["read_only"] is True
    with pytest.raises(ValueError, match="Only a draft"):
        app_context.work_products.finalize("MAT-DEMO-BEACON", root_path)


def test_finalize_service_moves_generate_to_respond_once(app_context):
    matter_id = "MAT-DEMO-BEACON"
    app_context.matters.move_stage(matter_id, "generate", reason="Ready to draft")
    draft = app_context.work_products.create_draft(
        matter_id, title="Direct finalization", content="Reviewed body"
    )

    first = app_context.work_products.finalize(matter_id, draft["vault_path"])
    retry = app_context.work_products.finalize(matter_id, draft["vault_path"])

    assert app_context.index.get_matter(matter_id)["status"] == "respond"
    assert first["vault_path"] == retry["vault_path"]
    assert retry["changed_paths"] == []


def test_finalize_rebuilds_the_compound_lifecycle_once(app_context, monkeypatch):
    matter_id = "MAT-DEMO-BEACON"
    app_context.matters.move_stage(matter_id, "generate")
    draft = app_context.work_products.create_draft(matter_id, title="Single rebuild", content="Reviewed body")
    rebuilds = []
    real_rebuild = app_context.index.rebuild

    def count_rebuild():
        rebuilds.append("rebuild")
        return real_rebuild()

    monkeypatch.setattr(app_context.index, "rebuild", count_rebuild)
    app_context.work_products.finalize(matter_id, draft["vault_path"])

    assert rebuilds == ["rebuild"]


def test_finalize_rebuild_happens_after_final_dossier_projection(app_context, monkeypatch):
    matter_id = "MAT-DEMO-BEACON"
    draft = app_context.work_products.create_draft(
        matter_id, title="Dossier final", content="Reviewed body"
    )
    observed_dossiers = []
    real_rebuild = app_context.index.rebuild

    def rebuild_after_projection():
        observed_dossiers.append(app_context.dossiers.get(matter_id)["content"])
        return real_rebuild()

    monkeypatch.setattr(app_context.index, "rebuild", rebuild_after_projection)
    final = app_context.work_products.finalize(matter_id, draft["vault_path"])

    assert len(observed_dossiers) == 1
    assert f"- Final: [Dossier final]({final['vault_path']})" in observed_dossiers[0]


@pytest.mark.parametrize("starting_stage", ["intake", "research", "explore", "generate", "respond"])
def test_finalize_reconciles_every_pre_closed_stage_and_returns_actual_state(
    app_context, starting_stage
):
    matter = app_context.matters.create(
        MatterCreate(title=f"Finalize from {starting_stage}", request_text="Prepare an answer.")
    )
    matter_id = matter["matter_id"]
    if starting_stage != "intake":
        app_context.matters.move_stage(matter_id, starting_stage)
    draft = app_context.work_products.create_draft(
        matter_id, title="Response", content="Reviewed response"
    )

    final = app_context.work_products.finalize(matter_id, draft["vault_path"])
    saved_matter = app_context.vault.read_markdown(f"{matter['path']}/matter.md")["metadata"]

    assert final["operation"] == "finalize_work_product"
    assert final["status"] == "changed"
    assert final["resulting_matter_state"]["stage"] == "respond"
    assert final["resulting_matter_state"]["next_action"] == "Approve the final response."
    assert final["available_next_actions"] == ["approve_response"]
    assert saved_matter["status"] == "respond"
    assert saved_matter["current_work_product_final_path"] == final["vault_path"]
    assert saved_matter["current_work_product_final_id"] == final["final_id"]
