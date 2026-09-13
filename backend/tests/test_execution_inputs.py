from copy import deepcopy

import frontmatter
import pytest

from app.services.execution_inputs import REFERENCE, ROOT
from app.services.vault import VaultService


def test_frozen_inputs_survive_restart_without_loading_them_for_display(tmp_path):
    vault = VaultService(tmp_path)
    frozen = {"sources": [{"text": "Original source passage. " * 3000}], "version": "saved",
              "intake_publication_baseline": {"business_question": "original-revision"}}
    metadata = {"record_type": "chat_transcript", "messages": [
        {"content": "The saved answer", "workspace_submission": {"frozen_context": frozen}},
    ]}
    original = deepcopy(metadata)
    path = vault.write_markdown("matter/conversations/CONV-saved.md", "# Conversation\n\nThe saved answer", metadata)
    assert metadata == original
    assert vault.resolve(path).stat().st_size < 1000
    assert vault.read_markdown(path)["metadata"] == original
    restarted = VaultService(tmp_path)
    loaded = restarted.read_markdown(path)
    loaded["metadata"]["messages"][0]["workspace_submission"]["frozen_context"]["sources"][0]["text"] = "Unsaved edit"
    assert restarted.read_markdown(path)["metadata"] == original

    stored = restarted.read_markdown(path, include_execution=False)
    reference = stored["metadata"]["messages"][0]["workspace_submission"]["frozen_context"]
    assert REFERENCE in reference
    assert reference["intake_publication_baseline"] == frozen["intake_publication_baseline"]
    # Display remains readable even when the optional execution payload cannot be read.
    restarted.resolve(f"{ROOT}/{reference[REFERENCE]}.md").unlink()
    assert restarted.read_markdown(path, include_execution=False)["content"] == stored["content"]
    with pytest.raises(FileNotFoundError):
        restarted.read_markdown(path)


def test_shared_inputs_are_saved_once_and_preserve_writer_status(tmp_path):
    vault = VaultService(tmp_path)
    frozen = {"text": "Immutable inputs. " * 3000}
    metadata = {"record_type": "dossier_research_request", "frozen_context": frozen,
                "writer_calls": {"first": {"state": "completed", "snapshot": frozen}}}
    path = vault.write_markdown("matter/research/dossier-requests/DOR-saved.md", "# Research", metadata)
    assert len(list(vault.resolve(ROOT).glob("*.md"))) == 1
    brief = vault.read_markdown(path, include_execution=False)
    assert brief["metadata"]["writer_calls"]["first"]["state"] == "completed"
    assert vault.read_markdown(path)["metadata"] == metadata
    assert all(".execution-inputs" not in str(file) for file in vault.iter_files())


def test_old_inline_records_and_invalid_payload_references(tmp_path):
    vault = VaultService(tmp_path)
    meta = {"record_type": "chat_run", "frozen_context": {"text": "Legacy value" * 4000}}
    path = "matter/conversations/runs/RUN-old.md"
    vault.write_bytes(path, frontmatter.dumps(frontmatter.Post("# Legacy", **meta)).encode())
    assert vault.read_markdown(path)["metadata"] == meta
    vault.write_markdown("bad.md", "# Saved text", {"input": {REFERENCE: "../../outside"}})
    with pytest.raises(ValueError, match="Invalid saved execution"):
        vault.read_markdown("bad.md")


def test_payload_corruption_and_failed_record_save_do_not_change_saved_history(tmp_path, monkeypatch):
    vault = VaultService(tmp_path)
    path = vault.write_markdown("record.md", "# Before", {"record_type": "chat_run"})
    before = vault.resolve(path).read_bytes()
    with monkeypatch.context() as patch:
        patch.setattr(vault, "_atomic_write", lambda *args: (_ for _ in ()).throw(OSError("disk error")))
        with pytest.raises(OSError):
            vault.write_markdown(path, "# After", {"record_type": "chat_run", "frozen_context": {"text": "x" * 40000}})
    assert vault.resolve(path).read_bytes() == before
    vault.write_markdown(path, "# After", {"record_type": "chat_run", "frozen_context": {"text": "x" * 40000}})
    ref = vault.read_markdown(path, include_execution=False)["metadata"]["frozen_context"][REFERENCE]
    vault.resolve(f"{ROOT}/{ref}.md").write_text("changed")
    with pytest.raises(ValueError, match="recorded version"):
        vault.read_markdown(path)


def test_compaction_preserves_exact_originals_and_is_safe_to_repeat(tmp_path):
    from scripts.compact_execution_inputs import compact

    vault = VaultService(tmp_path)
    path = "03_Matters/matter/conversations/CONV-old.md"
    metadata = {"record_type": "chat_transcript", "frozen_context": {"text": "Source input. " * 4000}}
    original = frontmatter.dumps(frontmatter.Post("# Saved answer\n", **metadata)).encode()
    vault.write_bytes(path, original)
    proposed = compact(vault)
    assert len(proposed) == 1
    assert vault.resolve(path).read_bytes() == original
    assert not vault.exists(ROOT)
    applied = compact(vault, apply=True)
    assert applied == proposed
    assert vault.resolve(applied[0]["original"]).read_bytes() == original
    assert vault.read_markdown(path)["metadata"] == metadata
    assert compact(vault, apply=True) == []
