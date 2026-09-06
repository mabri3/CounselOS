from __future__ import annotations

import pytest

from app.services.matter_paths import MatterPathPolicy


@pytest.mark.parametrize("value", [None, "", ".", "..", "../escape", "/tmp/files", "a\\b", "a//b"])
def test_hostile_relative_paths_are_rejected(app_context, value):
    with pytest.raises(ValueError):
        app_context.settings_store.write({"matter_files.source_documents_dir": value})


@pytest.mark.parametrize(
    "value",
    ["matter.md", "recommendations.md", "research", "decisions/output", "documents/batches", "documents/batches/custom"],
)
def test_protected_and_reserved_paths_are_rejected(app_context, value):
    with pytest.raises(ValueError):
        app_context.settings_store.write({"matter_files.final_outputs_dir": value})


def test_policy_resolves_only_under_selected_matter(app_context):
    app_context.settings_store.write({"matter_files.source_documents_dir": "incoming/source"})
    path = app_context.matter_paths.folder(
        "MAT-DEMO-BEACON", "matter_files.source_documents_dir"
    )
    assert path == "03_Matters/beacon-instant-onboarding/incoming/source"


def test_policy_allows_valid_existing_nested_folder(app_context):
    nested = app_context.vault.resolve(
        "03_Matters/beacon-instant-onboarding/incoming/source"
    )
    nested.mkdir(parents=True)
    app_context.settings_store.write({"matter_files.source_documents_dir": "incoming/source"})

    assert app_context.matter_paths.folder(
        "MAT-DEMO-BEACON", "matter_files.source_documents_dir"
    ) == "03_Matters/beacon-instant-onboarding/incoming/source"


def test_policy_rejects_configured_folder_symlink_to_another_matter(app_context):
    selected = app_context.vault.resolve("03_Matters/beacon-instant-onboarding")
    other = app_context.vault.resolve("03_Matters/other-matter")
    other.mkdir()
    (selected / "redirect").symlink_to(other, target_is_directory=True)
    app_context.settings_store.write({"matter_files.source_documents_dir": "redirect"})

    with pytest.raises(ValueError, match="inside the selected matter"):
        app_context.matter_paths.folder(
            "MAT-DEMO-BEACON", "matter_files.source_documents_dir"
        )


def test_duplicate_configured_folders_are_rejected(app_context):
    with pytest.raises(ValueError, match="must not overlap"):
        MatterPathPolicy.validate_values({
            "matter_files.source_documents_dir": "same",
            "matter_files.draft_outputs_dir": "same",
            "matter_files.final_outputs_dir": "final",
        })
