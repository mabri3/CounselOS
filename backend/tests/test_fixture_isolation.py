from __future__ import annotations

from pathlib import Path

from conftest import TEST_VAULT_SOURCE, copy_test_vault


WORKSPACE_VAULT = Path(__file__).resolve().parents[2] / "vault"


def test_fixture_source_is_not_the_workspace_vault() -> None:
    assert TEST_VAULT_SOURCE.resolve() != WORKSPACE_VAULT.resolve()
    assert TEST_VAULT_SOURCE == Path(__file__).resolve().parent / "fixtures" / "vault"


def test_fake_live_sentinel_and_sqlite_journal_are_not_copied(tmp_path: Path) -> None:
    fake_live = tmp_path / "workspace" / "vault"
    fake_live.mkdir(parents=True)
    (fake_live / "live-only-sentinel.md").write_text("live", encoding="utf-8")
    (fake_live / ".counsel_os_cache.db-journal").write_bytes(b"live journal")

    copied = tmp_path / "copied-test-vault"
    copy_test_vault(copied)

    assert not (copied / "live-only-sentinel.md").exists()
    assert not (copied / ".counsel_os_cache.db-journal").exists()


def test_committed_fixture_has_no_runtime_database_or_temporary_files() -> None:
    forbidden_names = {
        ".counsel_os_cache.db",
        ".counsel_os_cache.db-journal",
        ".counsel_os_cache.db-shm",
        ".counsel_os_cache.db-wal",
    }
    forbidden_suffixes = {".db", ".journal", ".shm", ".tmp", ".wal"}

    files = [path for path in TEST_VAULT_SOURCE.rglob("*") if path.is_file()]

    assert not [path for path in files if path.name in forbidden_names]
    assert not [path for path in files if path.suffix.casefold() in forbidden_suffixes]
    assert not [path for path in files if path.name.endswith("~")]


def test_committed_fixture_has_no_experiments_or_user_annotations() -> None:
    relative_paths = {
        path.relative_to(TEST_VAULT_SOURCE).as_posix()
        for path in TEST_VAULT_SOURCE.rglob("*")
        if path.is_file()
    }

    assert not any("northstar-ux-test" in path for path in relative_paths)
    assert not any(path.endswith("/annotations.md") for path in relative_paths)
    assert not any("/conversations/" in f"/{path}" for path in relative_paths)
