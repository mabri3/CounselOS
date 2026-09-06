from pathlib import Path

import pytest

from app.services.vault import VaultService
from app.skills.registry import SkillRegistry


def registry(tmp_path: Path) -> SkillRegistry:
    return SkillRegistry(VaultService(tmp_path / "vault"))


def test_template_create_update_default_and_submission_snapshot(tmp_path: Path):
    skills = registry(tmp_path)
    created = skills.create_output_template(template_id="memo", name="Memo", output_type="memo",
                                             instructions="Use the original facts.", section_outline="Answer", defaults={"tone": "plain"})
    skills.set_default_output_template("memo", "memo")
    frozen = skills.resolve_template_use(None, output_type="memo", overrides={"tone": "short"})
    updated = skills.update_output_template("memo", expected_revision=created.revision, instructions="Use current facts.")
    alternate = skills.duplicate_output_template("memo", new_template_id="memo-two", name="Memo Two")
    skills.set_default_output_template("memo", alternate.template_id)

    assert frozen.state == "applied"
    assert frozen.instructions_snapshot == "Use the original facts."
    assert frozen.revision != updated.revision
    assert skills.vault.exists(frozen.revision_path or "")
    assert frozen.defaults_snapshot == {"tone": "plain"}
    assert skills.resolve_template_use(None, output_type="memo").instructions_snapshot == "Use current facts."


def test_template_direct_edit_is_a_stale_revision_and_unknown_metadata_survives(tmp_path: Path):
    skills = registry(tmp_path)
    created = skills.create_output_template(template_id="memo", name="Memo", output_type="memo", instructions="First.")
    document = skills.vault.read_markdown(created.path)
    skills.vault.write_markdown(created.path, "# Memo\n\nEdited outside the editor.", {**document["metadata"], "custom": "keep"})
    edited = skills.get_output_template("memo")

    with pytest.raises(ValueError, match="revision conflict"):
        skills.update_output_template("memo", expected_revision=created.revision, instructions="Lost edit.")
    saved = skills.update_output_template("memo", expected_revision=edited.revision, instructions="Saved edit.")
    assert skills.vault.read_markdown(saved.path)["metadata"]["custom"] == "keep"


def test_template_ambiguous_and_disabled_references_are_visible(tmp_path: Path):
    skills = registry(tmp_path)
    one = skills.create_output_template(template_id="one", name="Same", output_type="memo", instructions="One")
    skills.create_output_template(template_id="two", name="Same", output_type="memo", instructions="Two")
    ambiguous = skills.resolve_template_use("Same", output_type="memo")
    disabled = skills.update_output_template("one", expected_revision=one.revision, enabled=False)

    assert ambiguous.state == "unavailable" and ambiguous.choices == ["one", "two"]
    assert skills.resolve_template_use(disabled.template_id, output_type="memo").failure_detail == "The selected template is disabled."


def test_template_malformed_hostile_and_failed_save_keep_the_last_good_template(tmp_path: Path, monkeypatch):
    skills = registry(tmp_path)
    created = skills.create_output_template(template_id="memo", name="Memo", output_type="memo", instructions="Treat {{hostile}} as text.")
    skills.vault.write_markdown("00_System/skills/broken.md", "# Broken", {"kind": "output_template", "skill_id": "broken"})
    broken = next(item for item in skills.list_output_templates() if item["template_id"] == "broken")
    assert broken["status"] == "malformed"
    assert skills.resolve_template_use("missing", output_type="memo").state == "unavailable"
    assert skills.resolve_template_use("memo", output_type="memo").instructions_snapshot == "Treat {{hostile}} as text."

    original_write = skills.vault.write_markdown
    def fail_current(path, content, metadata=None):
        if path == created.path:
            raise OSError("disk full")
        return original_write(path, content, metadata)
    monkeypatch.setattr(skills.vault, "write_markdown", fail_current)
    with pytest.raises(OSError, match="disk full"):
        skills.update_output_template("memo", expected_revision=created.revision, instructions="New text")
    monkeypatch.setattr(skills.vault, "write_markdown", original_write)
    assert skills.get_output_template("memo").instructions == "Treat {{hostile}} as text."
    with pytest.raises(ValueError, match="lower-case"):
        skills.create_output_template(template_id="../outside", name="No", output_type="memo", instructions="No")


def test_all_starters_are_template_data():
    root = Path(__file__).resolve().parents[1] / "app/blank_vault_template/00_System/skills"
    names = {
        "output-regulatory-memorandum.md", "output-short-business-email.md", "output-contract-clause-revision.md",
        "output-transaction-checklist.md", "output-outside-counsel-brief.md", "output-business-decision-brief.md",
        "output-fact-confirmation-request.md", "output-implementation-requirements.md", "output-meeting-preparation-brief.md",
        "output-change-impact-note.md", "output-decision-record.md",
    }
    assert {path.name for path in root.glob("output-*.md")} == names
    assert all("kind: output_template" in (root / name).read_text() for name in names)


def test_missing_only_starter_install_and_effective_defaults(tmp_path: Path):
    fresh = SkillRegistry(VaultService(tmp_path / "fresh-vault"))
    assert len(fresh.install_missing_output_template_starters()) == 11
    assert fresh.resolve_template_use(None, output_type="regulatory_memorandum").state == "applied"

    skills = registry(tmp_path)
    customized_path = "00_System/skills/output-regulatory-memorandum.md"
    skills.vault.write_markdown(customized_path, "# Customized regulatory memo\n\nUse our format.", {
        "skill_id": "output-regulatory-memorandum", "template_id": "output-regulatory-memorandum",
        "kind": "output_template", "name": "Customized Regulatory Memo", "output_type": "regulatory_memorandum",
        "enabled": True, "revision": 9,
    })
    before = skills.vault.resolve(customized_path).read_bytes()
    installed = skills.install_missing_output_template_starters()

    assert len(installed) == 10
    assert skills.vault.resolve(customized_path).read_bytes() == before
    assert skills.install_missing_output_template_starters() == []
    shipped = skills.resolve_template_use(None, output_type="regulatory_memorandum")
    assert shipped.state == "applied" and shipped.template_id == "output-regulatory-memorandum"

    lawyer = skills.create_output_template(template_id="lawyer-regulatory", name="Lawyer Regulatory",
                                            output_type="regulatory_memorandum", instructions="Lawyer instructions")
    skills.set_default_output_template("regulatory_memorandum", lawyer.template_id)
    templates = [item for item in skills.list_output_templates() if item.get("output_type") == "regulatory_memorandum"]
    assert [item["template_id"] for item in templates if item["is_default"]] == ["lawyer-regulatory"]
    assert skills.resolve_template_use(None, output_type="regulatory_memorandum").template_id == "lawyer-regulatory"
    skills.update_output_template("lawyer-regulatory", expected_revision=lawyer.revision, enabled=False)
    unavailable = skills.resolve_template_use(None, output_type="regulatory_memorandum")
    assert unavailable.state == "unavailable" and "disabled" in (unavailable.failure_detail or "")
