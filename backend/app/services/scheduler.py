from __future__ import annotations

import asyncio
from datetime import timedelta
from pathlib import Path
from typing import Any

from app.models.api import ChatRequest, MatterCreate, ScheduleCreate
from app.services.index import IndexService
from app.services.vault import VaultService
from app.utils.ids import new_id, slugify
from app.utils.time import iso_now, parse_iso, utc_now


class SchedulerService:
    """Small in-process scheduler suitable for a single-user demo."""

    def __init__(self, vault: VaultService, index: IndexService, *, poll_seconds: int = 5):
        self.vault = vault
        self.index = index
        self.poll_seconds = poll_seconds
        self.app: Any | None = None
        self._task: asyncio.Task | None = None
        self._running: set[str] = set()

    def bind(self, app_context: Any) -> None:
        self.app = app_context

    def create(self, request: ScheduleCreate) -> dict[str, Any]:
        schedule_id = new_id("SCH")
        path = f"00_System/schedules/{slugify(request.title)}-{schedule_id[-6:]}.md"
        next_run = utc_now() + timedelta(seconds=request.interval_seconds)
        metadata = {
            "schedule_id": schedule_id,
            "title": request.title,
            "agent_id": request.agent_id,
            "kind": request.kind,
            "instructions": request.instructions,
            "interval_seconds": request.interval_seconds,
            "watch_path": request.watch_path,
            "matter_id": request.matter_id,
            "enabled": request.enabled,
            "last_run_at": None,
            "next_run_at": next_run.isoformat(timespec="seconds"),
            "last_status": "never_run",
        }
        self.vault.write_markdown(path, f"# {request.title}\n\n{request.instructions}\n", metadata)
        self.index.rebuild()
        return {**metadata, "path": path}

    def list(self) -> list[dict[str, Any]]:
        return self.index.list_schedules()

    def start(self) -> None:
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._loop(), name="counsel-os-scheduler")

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    async def run(self, schedule_id: str) -> dict[str, Any]:
        if not self.app:
            raise RuntimeError("Scheduler is not bound to the application context.")
        schedule = self.index.get_schedule(schedule_id)
        if not schedule:
            raise KeyError(f"Schedule not found: {schedule_id}")
        if schedule_id in self._running:
            return {"schedule_id": schedule_id, "status": "already_running"}
        self._running.add(schedule_id)
        try:
            kind = schedule.get("kind") or "agent_prompt"
            if kind == "inbox_watch":
                result = await self._run_inbox_watch(schedule)
            elif kind == "decision_audit":
                result = self.app.decisions.audit()
            else:
                response = await self.app.runner.run(
                    ChatRequest(
                        message=(
                            "[Scheduled task]\n"
                            "Execute this task now. Do not create or change its schedule.\n\n"
                            f"{schedule.get('instructions') or 'Run the scheduled task.'}"
                        ),
                        matter_id=schedule.get("matter_id"),
                        agent_id=schedule.get("agent_id") or "counsel-copilot",
                    )
                )
                result = response.model_dump()
            status = "success"
        except Exception as exc:
            result = {"error": str(exc)}
            status = "error"
        finally:
            self._running.discard(schedule_id)
        now = utc_now()
        next_run = now + timedelta(seconds=int(schedule.get("interval_seconds") or 3600))
        self.vault.update_markdown(
            schedule["path"],
            metadata_updates={
                "last_run_at": now.isoformat(timespec="seconds"),
                "next_run_at": next_run.isoformat(timespec="seconds"),
                "last_status": status,
            },
        )
        self.index.rebuild()
        return {"schedule_id": schedule_id, "status": status, "result": result}

    async def _loop(self) -> None:
        while True:
            try:
                for schedule in self.index.list_schedules():
                    if not schedule.get("enabled") or schedule["schedule_id"] in self._running:
                        continue
                    next_run = parse_iso(schedule.get("next_run_at"))
                    if next_run is None or next_run <= utc_now():
                        asyncio.create_task(self.run(schedule["schedule_id"]))
            except Exception:
                # A scheduler failure is visible through last_status but must not take down the app.
                pass
            await asyncio.sleep(self.poll_seconds)

    async def _run_inbox_watch(self, schedule: dict[str, Any]) -> dict[str, Any]:
        watch_path = str(schedule.get("watch_path") or "04_Inbox")
        inbox = self.vault.resolve(watch_path)
        processed = inbox / "_processed"
        processed.mkdir(parents=True, exist_ok=True)
        created: list[str] = []
        for path in sorted(inbox.iterdir()) if inbox.exists() else []:
            if not path.is_file() or path.name.startswith(".") or path.name.lower() == "readme.md":
                continue
            data = path.read_bytes()
            extracted = self.app.ingestion._extract_text(path.name, data)
            request_text = extracted.strip() or f"New intake file received: {path.name}"
            matter = self.app.matters.create(
                MatterCreate(
                    title=Path(path.name).stem.replace("-", " ").replace("_", " ").title(),
                    request_text=request_text,
                    description="Automatically created from the watched intake folder.",
                    matter_type="general_advice",
                    priority="normal",
                )
            )
            destination = f"{matter['path']}/documents/{path.name}"
            self.vault.write_bytes(destination, data)
            if extracted.strip():
                self.vault.write_markdown(
                    f"{destination}.extracted.md",
                    f"# Extracted text: {path.name}\n\n{extracted}\n",
                    {"matter_id": matter["matter_id"], "source_path": destination, "created_at": iso_now()},
                )
            archive_name = f"{iso_now()[:10]}-{new_id('IN')}-{path.name}"
            path.replace(processed / archive_name)
            created.append(matter["matter_id"])
        self.index.rebuild()
        return {"created_matters": created, "count": len(created)}
