from __future__ import annotations

import asyncio
import json
import os
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator, Callable

from app.config import ACTIVE_VAULT_POINTER, Settings
from app.runtime import AppContext


class VaultBusyError(RuntimeError):
    pass


class ActiveContextManager:
    """Serializes vault activation and keeps leased requests on one context."""

    def __init__(self, settings: Settings, *, pointer_path: Path = ACTIVE_VAULT_POINTER):
        self.base_settings = settings
        self.pointer_path = pointer_path
        selected = self._saved_vault_path() or settings.resolved_vault_path
        self.context = AppContext(settings.for_vault(selected))
        self._condition = asyncio.Condition()
        self._activation_lock = asyncio.Lock()
        self._leases = 0
        self._switching = False

    @asynccontextmanager
    async def lease(self) -> AsyncIterator[AppContext]:
        async with self._condition:
            while self._switching:
                await self._condition.wait()
            context = self.context
            self._leases += 1
        try:
            yield context
        finally:
            async with self._condition:
                self._leases -= 1
                if self._leases == 0:
                    self._condition.notify_all()

    async def activate(self, vault_path: Path) -> AppContext:
        async with self._activation_lock:
            return await self._select_locked(lambda _current: vault_path)

    async def select(self, prepare: Callable[[Path], Path]) -> AppContext:
        """Prepare and activate one selection under the full switch lock."""
        async with self._activation_lock:
            return await self._select_locked(prepare)

    async def _select_locked(self, prepare: Callable[[Path], Path]) -> AppContext:
        old = self.context
        scheduler_was_enabled = old.settings.scheduler_enabled
        pointer_before: bytes | None = None
        pointer_captured = False
        scheduler_stop_started = False
        committed = False
        try:
            async with self._condition:
                self._switching = True
                while self._leases:
                    await self._condition.wait()
            pointer_before = self.pointer_path.read_bytes() if self.pointer_path.exists() else None
            pointer_captured = True
            scheduler_stop_started = True
            await old.scheduler.stop()
            if old.has_active_work():
                raise VaultBusyError(
                    "Themis.ai is running scheduled or research work. Try again after it finishes."
                )
            vault_path = prepare(old.vault.root)
            candidate = AppContext(
                self.base_settings.for_vault(vault_path), recover_interrupted=False
            )
            candidate.validate_runtime()
            self._save_pointer(vault_path)
            self.context = candidate
            committed = True
            try:
                candidate.recover_interrupted_work()
            except Exception as exc:
                candidate.recovery_warning = str(exc)
            if candidate.settings.scheduler_enabled:
                candidate.scheduler.start()
            await old.close_providers()
            return candidate
        except BaseException:
            if not committed:
                self.context = old
                if pointer_captured:
                    self._restore_pointer(pointer_before)
                if scheduler_stop_started and scheduler_was_enabled:
                    old.scheduler.start()
            raise
        finally:
            async with self._condition:
                self._switching = False
                self._condition.notify_all()

    async def shutdown(self) -> None:
        async with self._activation_lock:
            async with self._condition:
                self._switching = True
                while self._leases:
                    await self._condition.wait()
            await self.context.scheduler.stop()
            await self.context.scheduler.wait_for_active_work()
            await self.context.research_runs.wait_for_active_work()
            await self.context.chat_runs.wait_for_active_work()
            await self.context.close_providers()

    def _saved_vault_path(self) -> Path | None:
        try:
            payload = json.loads(self.pointer_path.read_text(encoding="utf-8"))
            if payload.get("schema_version") != 1:
                return None
            path = Path(str(payload["vault_path"]))
            if not path.is_absolute() or not path.is_dir():
                return None
            from app.vault_manager import VaultManager

            return VaultManager(self.base_settings.resolved_vault_path).load(str(path))
        except (OSError, ValueError, KeyError, TypeError):
            return None

    def _save_pointer(self, vault_path: Path) -> None:
        self.pointer_path.parent.mkdir(parents=True, exist_ok=True)
        fd, temporary = tempfile.mkstemp(prefix="active-vault-", dir=self.pointer_path.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                json.dump(
                    {"schema_version": 1, "vault_path": str(vault_path.resolve())},
                    stream,
                    indent=2,
                )
                stream.write("\n")
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, self.pointer_path)
        finally:
            Path(temporary).unlink(missing_ok=True)

    def _restore_pointer(self, content: bytes | None) -> None:
        if content is None:
            if self.pointer_path.exists():
                self.pointer_path.unlink()
            return
        try:
            if self.pointer_path.read_bytes() == content:
                return
        except OSError:
            pass
        self.pointer_path.parent.mkdir(parents=True, exist_ok=True)
        fd, temporary = tempfile.mkstemp(prefix="active-vault-restore-", dir=self.pointer_path.parent)
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(content)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, self.pointer_path)
        finally:
            Path(temporary).unlink(missing_ok=True)
