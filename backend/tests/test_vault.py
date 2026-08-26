from __future__ import annotations

from pathlib import Path

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
