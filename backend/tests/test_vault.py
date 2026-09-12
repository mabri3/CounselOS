from __future__ import annotations

from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import os
from unittest.mock import patch

import frontmatter
import pytest

from app.services.vault import VaultService


def test_path_traversal_is_rejected(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    with pytest.raises(ValueError):
        vault.resolve("../outside.txt")
    with pytest.raises(ValueError):
        vault.resolve("/etc/passwd")


def test_markdown_round_trip_is_atomic(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/test.md", "# Hello\n", {"status": "intake"})
    assert path == "matter/test.md"
    document = vault.read_markdown(path)
    assert document["metadata"]["status"] == "intake"
    assert "# Hello" in document["content"]


def test_immutable_markdown_is_reported_as_read_only(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/request.md", "# Original request\n", {"immutable": True})

    document = vault.read_document(path)

    assert document["kind"] == "markdown"
    assert document["editable"] is False


def test_repeated_reads_share_parsing_but_not_mutable_metadata(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/test.md", "# Saved", {"facts": [{"text": "Reported"}]})
    with patch.object(frontmatter, "loads", wraps=frontmatter.loads) as parse:
        first = vault.read_markdown(path)
        first["metadata"]["facts"][0]["text"] = "Unsaved edit"
        with ThreadPoolExecutor(max_workers=4) as pool:
            copies = list(pool.map(vault.read_markdown, [path] * 8))
        assert all(copy["metadata"]["facts"][0]["text"] == "Reported" for copy in copies)
        assert parse.call_count == 1


def test_cached_reads_follow_local_external_and_atomic_edits(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/test.md", "# Old", {"status": "draft"})
    assert vault.read_markdown(path)["metadata"]["status"] == "draft"
    vault.update_markdown(path, metadata_updates={"status": "complete"})
    assert vault.read_markdown(path)["metadata"]["status"] == "complete"

    file = vault.resolve(path)
    original = file.stat()
    file.write_text(file.read_text().replace("# Old", "# New"))
    os.utime(file, ns=(original.st_atime_ns, original.st_mtime_ns))
    assert vault.read_markdown(path)["content"].strip() == "# New"

    replacement = vault.resolve("matter/replacement.md")
    replacement.write_text(file.read_text().replace("# New", "# End"))
    os.utime(replacement, ns=(original.st_atime_ns, original.st_mtime_ns))
    os.replace(replacement, file)
    assert vault.read_markdown(path)["content"].strip() == "# End"
    file.unlink()
    with pytest.raises(FileNotFoundError):
        vault.read_markdown(path)


def test_cached_path_still_rejects_symlink_outside_vault(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/test.md", "# Inside")
    vault.read_markdown(path)
    outside = tmp_path / "outside.md"
    outside.write_text("# Outside")
    vault.resolve(path).unlink()
    (vault.root / path).symlink_to(outside)
    with pytest.raises(ValueError):
        vault.read_markdown(path)


def test_edit_during_parse_is_not_cached_as_the_new_version(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    path = vault.write_markdown("matter/test.md", "# Before")
    original_parse = frontmatter.loads

    def parse_and_edit(text):
        parsed = original_parse(text)
        vault.write_markdown(path, "# After")
        return parsed

    with patch.object(frontmatter, "loads", side_effect=parse_and_edit):
        assert vault.read_markdown(path)["content"].strip() == "# Before"
    assert vault.read_markdown(path)["content"].strip() == "# After"


def test_markdown_cache_limits_and_vault_isolation(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(VaultService, "MARKDOWN_CACHE_MAX_FILES", 2)
    monkeypatch.setattr(VaultService, "MARKDOWN_CACHE_MAX_BYTES", 1024)
    vault = VaultService(tmp_path / "vault")
    other = VaultService(tmp_path / "other")
    for name in ("first.md", "second.md", "third.md"):
        vault.write_markdown(name, "# Inside")
    other.write_markdown("first.md", "# Other")
    with patch.object(frontmatter, "loads", wraps=frontmatter.loads) as parse:
        for name in ("first.md", "second.md", "third.md", "third.md"):
            vault.read_markdown(name)
        assert parse.call_count == 3
        vault.read_markdown("first.md")
        assert parse.call_count == 4
        assert other.read_markdown("first.md")["content"].strip() == "# Other"

        vault.write_markdown("large.md", "x" * 1025)
        before = parse.call_count
        for _ in range(2):
            assert vault.read_markdown("large.md")["content"].strip() == "x" * 1025
        assert parse.call_count == before + 2
