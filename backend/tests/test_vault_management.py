from __future__ import annotations

import asyncio
import hashlib
import json
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.active_context import ActiveContextManager, VaultBusyError
from app.config import Settings
from app.models.api import ChatRequest, MatterCreate
from app.routers import settings as settings_router
from app.vault_manager import VaultManager
from conftest import copy_test_vault


def _settings(vault: Path) -> Settings:
    return Settings(
        vault_path=str(vault), scheduler_enabled=False, llm_provider="mock",
        llm_api_key=None, llm_model=None, search_provider="disabled",
    )


def _hash_authoritative(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.name != ".counsel_os_cache.db":
            digest.update(path.relative_to(root).as_posix().encode())
            digest.update(path.read_bytes())
    return digest.hexdigest()


async def _assert_lease_succeeds(manager: ActiveContextManager) -> None:
    async with asyncio.timeout(1):
        async with manager.lease() as context:
            assert context is manager.context


def test_create_failure_leaves_no_partial_target(tmp_path: Path, monkeypatch) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    target = tmp_path / "new-vault"
    manager = VaultManager(current)
    monkeypatch.setattr(manager, "validate", lambda _path: (_ for _ in ()).throw(ValueError("bad")))
    with pytest.raises(ValueError, match="bad"):
        manager.create(str(target))
    assert not target.exists()
    assert not list(tmp_path.glob(".new-vault.counsel-os-*"))


def test_invalid_load_changes_no_authoritative_files(tmp_path: Path) -> None:
    current, invalid = tmp_path / "current", tmp_path / "invalid"
    copy_test_vault(current)
    invalid.mkdir()
    before = _hash_authoritative(current)
    with pytest.raises(ValueError):
        VaultManager(current).load(str(invalid))
    assert _hash_authoritative(current) == before


@pytest.mark.asyncio
async def test_switch_waits_for_request_lease_and_switches_indexes(tmp_path: Path) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "active-vault.json"
    manager = ActiveContextManager(_settings(first), pointer_path=pointer)
    before = _hash_authoritative(first)
    entered = asyncio.Event()
    release = asyncio.Event()

    async def request() -> None:
        async with manager.lease() as context:
            assert context.vault.root == first
            entered.set()
            await release.wait()

    request_task = asyncio.create_task(request())
    await entered.wait()
    switch_task = asyncio.create_task(manager.activate(second))
    await asyncio.sleep(0)
    assert not switch_task.done()
    release.set()
    await request_task
    await switch_task
    assert manager.context.vault.root == second
    assert (first / ".counsel_os_cache.db").exists()
    assert (second / ".counsel_os_cache.db").exists()
    assert _hash_authoritative(first) == before


@pytest.mark.asyncio
async def test_cancelled_switch_while_waiting_for_lease_unblocks_later_leases(tmp_path: Path) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    manager = ActiveContextManager(_settings(first), pointer_path=tmp_path / "pointer.json")
    release = asyncio.Event()
    entered = asyncio.Event()

    async def hold_lease() -> None:
        async with manager.lease():
            entered.set()
            await release.wait()

    holder = asyncio.create_task(hold_lease())
    await entered.wait()
    switch = asyncio.create_task(manager.activate(second))
    while not manager._switching:
        await asyncio.sleep(0)
    switch.cancel()
    with pytest.raises(asyncio.CancelledError):
        await switch
    release.set()
    await holder
    assert manager.context.vault.root == first
    await _assert_lease_succeeds(manager)


@pytest.mark.asyncio
async def test_pointer_read_failure_unblocks_later_leases(tmp_path: Path, monkeypatch) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    pointer.write_text(json.dumps({"schema_version": 1, "vault_path": str(first)}), encoding="utf-8")
    manager = ActiveContextManager(_settings(first), pointer_path=pointer)
    original_read_bytes = Path.read_bytes

    def fail_pointer_read(path: Path) -> bytes:
        if path == pointer:
            raise OSError("pointer read failed")
        return original_read_bytes(path)

    monkeypatch.setattr(Path, "read_bytes", fail_pointer_read)
    with pytest.raises(OSError, match="pointer read failed"):
        await manager.activate(second)
    assert manager.context.vault.root == first
    await _assert_lease_succeeds(manager)


@pytest.mark.asyncio
async def test_concurrent_switches_serialize(tmp_path: Path) -> None:
    paths = [tmp_path / name for name in ("first", "second", "third")]
    for path in paths:
        copy_test_vault(path)
    manager = ActiveContextManager(_settings(paths[0]), pointer_path=tmp_path / "pointer.json")
    await asyncio.gather(manager.activate(paths[1]), manager.activate(paths[2]))
    assert manager.context.vault.root == paths[2]


@pytest.mark.asyncio
async def test_concurrent_full_selections_prepare_against_context_at_their_turn(tmp_path: Path) -> None:
    paths = [tmp_path / name for name in ("first", "second", "third")]
    for path in paths:
        copy_test_vault(path)
    manager = ActiveContextManager(_settings(paths[0]), pointer_path=tmp_path / "pointer.json")
    seen_current_vaults: list[Path] = []
    lease_entered = asyncio.Event()
    release_lease = asyncio.Event()

    async def hold_lease() -> None:
        async with manager.lease():
            lease_entered.set()
            await release_lease.wait()

    def prepare(target: Path):
        def selection(current: Path) -> Path:
            seen_current_vaults.append(current)
            return target
        return selection

    lease_task = asyncio.create_task(hold_lease())
    await lease_entered.wait()
    first_switch = asyncio.create_task(manager.select(prepare(paths[1])))
    await asyncio.sleep(0)
    second_switch = asyncio.create_task(manager.select(prepare(paths[2])))
    await asyncio.sleep(0)
    assert seen_current_vaults == []

    release_lease.set()
    await lease_task
    await asyncio.gather(first_switch, second_switch)
    assert seen_current_vaults == [paths[0], paths[1]]
    assert manager.context.vault.root == paths[2]


@pytest.mark.asyncio
async def test_active_research_returns_busy_and_keeps_pointer(tmp_path: Path) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    manager = ActiveContextManager(_settings(first), pointer_path=pointer)
    blocker = asyncio.create_task(asyncio.Event().wait())
    manager.context.research_runs._tasks["RUN-test"] = blocker
    with pytest.raises(VaultBusyError):
        await manager.activate(second)
    assert manager.context.vault.root == first
    assert not pointer.exists()
    blocker.cancel()


@pytest.mark.asyncio
async def test_active_schedule_returns_busy(tmp_path: Path) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    manager = ActiveContextManager(_settings(first), pointer_path=tmp_path / "pointer.json")
    manager.context.scheduler._running.add("SCH-test")
    with pytest.raises(VaultBusyError):
        await manager.activate(second)
    assert manager.context.vault.root == first


@pytest.mark.asyncio
@pytest.mark.parametrize("active_kind", ["research", "schedule"])
async def test_busy_create_does_not_create_final_target(tmp_path: Path, active_kind: str) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    target = tmp_path / "new-vault"
    manager = ActiveContextManager(_settings(current), pointer_path=tmp_path / "pointer.json")
    blocker: asyncio.Task | None = None
    if active_kind == "research":
        blocker = asyncio.create_task(asyncio.Event().wait())
        manager.context.research_runs._tasks["RUN-test"] = blocker
    else:
        manager.context.scheduler._running.add("SCH-test")

    with pytest.raises(VaultBusyError):
        await manager.select(lambda current_vault: VaultManager(current_vault).create(str(target)))
    assert not target.exists()
    assert not list(tmp_path.glob(".new-vault.counsel-os-*"))
    if blocker is not None:
        blocker.cancel()


@pytest.mark.asyncio
async def test_failed_activation_keeps_context_pointer_and_authoritative_files(tmp_path: Path, monkeypatch) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    manager = ActiveContextManager(_settings(first), pointer_path=pointer)
    before = _hash_authoritative(first)
    original_save = manager._save_pointer

    def save_then_fail(path: Path) -> None:
        original_save(path)
        raise RuntimeError("activation failed")

    monkeypatch.setattr(manager, "_save_pointer", save_then_fail)
    with pytest.raises(RuntimeError, match="activation failed"):
        await manager.activate(second)
    assert manager.context.vault.root == first
    assert not pointer.exists()
    assert _hash_authoritative(first) == before


@pytest.mark.asyncio
async def test_pre_replace_save_failure_preserves_exact_valid_pointer(tmp_path: Path, monkeypatch) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    original = (json.dumps({"schema_version": 1, "vault_path": str(first)}, indent=2) + "\n").encode()
    pointer.write_bytes(original)
    manager = ActiveContextManager(_settings(second), pointer_path=pointer)

    def fail_before_replace(_path: Path) -> None:
        raise OSError("save failed before replace")

    monkeypatch.setattr(manager, "_save_pointer", fail_before_replace)
    with pytest.raises(OSError, match="save failed before replace"):
        await manager.activate(second)
    assert pointer.read_bytes() == original
    assert manager.context.vault.root == first
    restarted = ActiveContextManager(_settings(second), pointer_path=pointer)
    assert restarted.context.vault.root == first


def test_post_create_activation_failure_preserves_complete_vault_and_clear_api_error(tmp_path: Path, monkeypatch) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    pointer = tmp_path / "pointer.json"
    manager = ActiveContextManager(_settings(current), pointer_path=pointer)
    app = FastAPI()
    app.state.context_manager = manager
    app.state.context = manager.context
    app.include_router(settings_router.router, prefix="/api")
    target = tmp_path / "created-vault"

    def fail_activation_save(_path: Path) -> None:
        raise OSError("pointer unavailable")

    monkeypatch.setattr(manager, "_save_pointer", fail_activation_save)
    response = TestClient(app, raise_server_exceptions=False).post(
        "/api/settings/vault/create", json={"path": str(target)}
    )
    assert response.status_code == 500
    detail = response.json()["detail"]
    assert "Vault created" in detail and "could not activate" in detail and "can be loaded" in detail
    assert manager.context.vault.root == current
    assert not pointer.exists()
    assert not list(tmp_path.glob(".created-vault.counsel-os-*"))
    assert VaultManager(current).load(str(target)) == target


@pytest.mark.asyncio
async def test_recovery_failure_keeps_new_context_pointer_and_scheduler(tmp_path: Path, monkeypatch) -> None:
    first, second = tmp_path / "first", tmp_path / "second"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    settings = _settings(first).model_copy(update={"scheduler_enabled": True})
    manager = ActiveContextManager(settings, pointer_path=pointer)

    def fail_recovery(_self) -> None:
        raise RuntimeError("recovery failed")

    monkeypatch.setattr(type(manager.context), "recover_interrupted_work", fail_recovery)
    activated = await manager.activate(second)
    assert manager.context is activated
    assert activated.vault.root == second
    assert json.loads(pointer.read_text(encoding="utf-8"))["vault_path"] == str(second)
    assert activated.recovery_warning == "recovery failed"
    assert activated.scheduler._task is not None and not activated.scheduler._task.done()
    await manager.shutdown()


def test_restart_prefers_saved_vault(tmp_path: Path) -> None:
    first, second = tmp_path / "from-env", tmp_path / "saved"
    copy_test_vault(first)
    copy_test_vault(second)
    pointer = tmp_path / "pointer.json"
    pointer.write_text(json.dumps({"schema_version": 1, "vault_path": str(second)}))
    manager = ActiveContextManager(_settings(first), pointer_path=pointer)
    assert manager.context.vault.root == second


@pytest.mark.asyncio
async def test_blank_vault_has_no_user_work_and_supports_matter_and_chat(tmp_path: Path) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    (current / "00_System" / "Agents.md").write_text("MUTATED CURRENT VAULT", encoding="utf-8")
    blank = VaultManager(current).create(str(tmp_path / "blank"))
    manager = ActiveContextManager(_settings(blank), pointer_path=tmp_path / "pointer.json")
    context = manager.context
    assert context.matters.list() == []
    assert context.decisions.list() == []
    assert context.scheduler.list() == []
    assert (blank / "04_Inbox").is_dir()
    assert not (blank / "06_Inbox").exists()
    assert not (blank / "04_Decisions").exists()
    assert not (blank / "00_System" / "user.md").exists()
    assert not (blank / "00_System" / "memory.md").exists()
    assert "MUTATED CURRENT VAULT" not in (blank / "00_System" / "Agents.md").read_text(encoding="utf-8")
    matter = context.matters.create(MatterCreate(title="Test matter", request_text="Help with launch."))
    reply = await context.runner.run(ChatRequest(message="Give me a first pass.", matter_id=matter["matter_id"]))
    assert reply.reply
    assert len(context.matters.list()) == 1


@pytest.mark.asyncio
async def test_shutdown_waits_for_scheduler_and_research_tasks(tmp_path: Path) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    manager = ActiveContextManager(_settings(current), pointer_path=tmp_path / "pointer.json")
    scheduler_release = asyncio.Event()
    research_release = asyncio.Event()
    scheduler_task = asyncio.create_task(scheduler_release.wait())
    research_task = asyncio.create_task(research_release.wait())
    manager.context.scheduler._run_tasks.add(scheduler_task)
    manager.context.research_runs._tasks["RUN-test"] = research_task

    shutdown = asyncio.create_task(manager.shutdown())
    await asyncio.sleep(0)
    assert not shutdown.done()
    scheduler_release.set()
    await asyncio.sleep(0)
    assert not shutdown.done()
    research_release.set()
    await shutdown
    assert scheduler_task.done()
    assert research_task.done()


def test_create_rejects_current_vault_relations_and_unsafe_aliases(tmp_path: Path) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    manager = VaultManager(current)
    for path in (current / "child", tmp_path, tmp_path / "folder" / ".." / "alias"):
        with pytest.raises(ValueError):
            manager.create(str(path))


def test_load_rejects_required_symlink_that_escapes_vault(tmp_path: Path) -> None:
    current, candidate = tmp_path / "current", tmp_path / "candidate"
    copy_test_vault(current)
    copy_test_vault(candidate)
    external = tmp_path / "external-agents.md"
    external.write_text("# Outside the vault\n", encoding="utf-8")
    required = candidate / "00_System" / "Agents.md"
    required.unlink()
    required.symlink_to(external)

    with pytest.raises(ValueError, match="points outside the vault"):
        VaultManager(current).load(str(candidate))
