from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from datetime import UTC, datetime, time, timedelta
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from app.models.awareness import Digest, ScanResult, ScheduleRecurrence, Watch
from app.models.api import ChatRequest, MatterCreate, ScheduleCreate, ScheduleUpdate
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
        self._run_tasks: set[asyncio.Task] = set()
        self._running: set[str] = set()
        self._watch_runner: Callable[[str], Awaitable[ScanResult | Digest]] | None = None
        self._digest_runner: Callable[[str], Awaitable[ScanResult | Digest]] | None = None

    def bind(self, app_context: Any) -> None:
        self.app = app_context

    def bind_watch_runner(self, runner: Callable[[str], Awaitable[ScanResult | Digest]]) -> None:
        self._watch_runner = runner

    def bind_digest_runner(self, runner: Callable[[str], Awaitable[ScanResult | Digest]]) -> None:
        self._digest_runner = runner

    @property
    def has_active_work(self) -> bool:
        return bool(self._running) or any(not task.done() for task in self._run_tasks)

    def create(self, request: ScheduleCreate) -> dict[str, Any]:
        schedule_id = new_id("SCH")
        path = f"00_System/schedules/{slugify(request.title)}-{schedule_id[-6:]}.md"
        recurrence = request.recurrence or ScheduleRecurrence(
            kind="interval", interval_seconds=request.interval_seconds, local_time=None, time_zone=None
        )
        self._validate_target(request.kind, request.target_watch_id, request.target_view_id)
        now = utc_now()
        next_run = self._next_run(recurrence, now)
        metadata = {
            "schedule_id": schedule_id,
            "title": request.title,
            "agent_id": request.agent_id,
            "kind": request.kind,
            "instructions": request.instructions,
            "interval_seconds": request.interval_seconds,
            "watch_path": request.watch_path,
            "matter_id": request.matter_id,
            "target_watch_id": request.target_watch_id,
            "target_view_id": request.target_view_id,
            "recurrence": recurrence.model_dump(mode="json"),
            "enabled": request.enabled,
            "revision": 1,
            "last_run_at": None,
            "next_run_at": self._iso(next_run),
            "last_status": "never_run",
            "last_message": "",
        }
        self.vault.write_markdown(path, f"# {request.title}\n\n{request.instructions}\n", metadata)
        self.index.rebuild()
        return {**metadata, "path": path}

    def list(self) -> list[dict[str, Any]]:
        return [self._schedule_with_metadata(item) for item in self.index.list_schedules()]

    def update(self, schedule_id: str, request: ScheduleUpdate) -> dict[str, Any]:
        schedule = self._get_schedule(schedule_id)
        if not schedule:
            raise KeyError(f"Schedule not found: {schedule_id}")
        current_revision = int(schedule.get("revision") or 1)
        if request.expected_revision is not None and request.expected_revision != current_revision:
            raise ValueError(
                f"Schedule revision conflict: expected {request.expected_revision}, found {current_revision}"
            )
        recurrence = request.recurrence or self._recurrence(schedule)
        enabled = bool(schedule.get("enabled")) if request.enabled is None else request.enabled
        target_watch_id = request.target_watch_id if request.target_watch_id is not None else schedule.get("target_watch_id")
        target_view_id = request.target_view_id if request.target_view_id is not None else schedule.get("target_view_id")
        self._validate_target(str(schedule.get("kind")), target_watch_id, target_view_id)
        metadata_updates: dict[str, Any] = {
            "enabled": enabled,
            "target_watch_id": target_watch_id,
            "target_view_id": target_view_id,
            "recurrence": recurrence.model_dump(mode="json"),
            "interval_seconds": recurrence.interval_seconds or schedule.get("interval_seconds") or 3600,
            "next_run_at": self._iso(self._next_run(recurrence, utc_now())) if enabled else schedule.get("next_run_at"),
            "revision": current_revision + 1,
        }
        self.vault.update_markdown(schedule["path"], metadata_updates=metadata_updates)
        self.index.rebuild()
        updated = self._get_schedule(schedule_id)
        if not updated:
            raise KeyError(f"Schedule not found after update: {schedule_id}")
        return updated

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

    async def wait_for_active_work(self) -> None:
        tasks = [task for task in self._run_tasks if not task.done()]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def run(self, schedule_id: str) -> dict[str, Any]:
        if not self.app:
            raise RuntimeError("Scheduler is not bound to the application context.")
        schedule = self._get_schedule(schedule_id)
        if not schedule:
            raise KeyError(f"Schedule not found: {schedule_id}")
        if schedule_id in self._running:
            return {"schedule_id": schedule_id, "status": "already_running"}
        self._running.add(schedule_id)
        try:
            kind = schedule.get("kind") or "agent_prompt"
            if kind == "watch_scan":
                status, result, message = await self._run_watch_scan(schedule)
            elif kind == "briefing_digest":
                status, result, message = await self._run_briefing_digest(schedule)
            elif kind == "inbox_watch":
                result = await self._run_inbox_watch(schedule)
                status, message = "success", ""
            elif kind == "decision_audit":
                result = self.app.decisions.audit()
                status, message = "success", ""
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
                status, message = "success", ""
        except Exception as exc:
            result = {"error": str(exc)}
            status, message = "failed", str(exc)
        finally:
            self._running.discard(schedule_id)
        now = utc_now()
        recurrence = self._recurrence(schedule)
        scheduled_at = parse_iso(schedule.get("next_run_at"))
        anchor = scheduled_at if scheduled_at is not None and scheduled_at <= now else now
        next_run = self._next_run(recurrence, anchor)
        self.vault.update_markdown(
            schedule["path"],
            metadata_updates={
                "last_run_at": now.isoformat(timespec="seconds"),
                "next_run_at": self._iso(next_run),
                "last_status": status,
                "last_message": message,
            },
        )
        self.index.rebuild()
        return {"schedule_id": schedule_id, "status": status, "result": result}

    async def _loop(self) -> None:
        while True:
            try:
                for schedule in self.index.list_schedules():
                    schedule = self._schedule_with_metadata(schedule)
                    if not schedule.get("enabled") or schedule["schedule_id"] in self._running:
                        continue
                    if self._recurrence(schedule).kind == "manual":
                        continue
                    next_run = parse_iso(schedule.get("next_run_at"))
                    if next_run is None or next_run <= utc_now():
                        task = asyncio.create_task(self.run(schedule["schedule_id"]))
                        self._run_tasks.add(task)
                        task.add_done_callback(self._run_tasks.discard)
            except Exception:
                # A scheduler failure is visible through last_status but must not take down the app.
                pass
            await asyncio.sleep(self.poll_seconds)

    async def _run_watch_scan(self, schedule: dict[str, Any]) -> tuple[str, Any, str]:
        watch_id = str(schedule.get("target_watch_id") or "")
        try:
            watch = Watch.model_validate(
                self.vault.read_markdown(f"00_System/legal-awareness/watches/{watch_id}.md")["metadata"]
            )
        except (FileNotFoundError, KeyError, ValueError) as exc:
            raise KeyError(f"Watch not found or invalid: {watch_id}") from exc
        if not watch.enabled or watch.status == "paused":
            message = f"Watch {watch_id} is paused; scheduled scan skipped."
            return "skipped", {"watch_id": watch_id, "skipped": True}, message
        if self._watch_runner is None:
            raise RuntimeError("Watch schedule runner is not bound.")
        result = await self._watch_runner(watch_id)
        if isinstance(result, ScanResult):
            status = result.scan.status
            message = "; ".join(result.scan.warnings)
        else:
            status, message = "success", ""
        return status, result.model_dump(mode="json"), message

    async def _run_briefing_digest(self, schedule: dict[str, Any]) -> tuple[str, Any, str]:
        view_id = str(schedule.get("target_view_id") or "")
        path = f"00_System/legal-awareness/views/{view_id}.md"
        if not self.vault.exists(path):
            raise KeyError(f"Saved view not found: {view_id}")
        if self._digest_runner is None:
            raise RuntimeError("Digest schedule runner is not bound.")
        result = await self._digest_runner(view_id)
        return "success", result.model_dump(mode="json"), ""

    def _get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        schedule = self.index.get_schedule(schedule_id)
        return self._schedule_with_metadata(schedule) if schedule else None

    def _schedule_with_metadata(self, schedule: dict[str, Any]) -> dict[str, Any]:
        metadata = self.vault.read_markdown(schedule["path"])["metadata"]
        return {**schedule, **metadata, "path": schedule["path"]}

    @staticmethod
    def _validate_target(kind: str, watch_id: Any, view_id: Any) -> None:
        if kind == "watch_scan" and not watch_id:
            raise ValueError("watch_scan schedule requires target_watch_id")
        if kind == "briefing_digest" and not view_id:
            raise ValueError("briefing_digest schedule requires target_view_id")

    @staticmethod
    def _recurrence(schedule: dict[str, Any]) -> ScheduleRecurrence:
        value = schedule.get("recurrence")
        if value:
            return ScheduleRecurrence.model_validate(value)
        return ScheduleRecurrence(
            kind="interval",
            interval_seconds=int(schedule.get("interval_seconds") or 3600),
            local_time=None,
            time_zone=None,
        )

    @classmethod
    def _next_run(cls, recurrence: ScheduleRecurrence, after: datetime) -> datetime | None:
        after = after.astimezone(UTC)
        if recurrence.kind == "manual":
            return None
        if recurrence.kind == "interval":
            return after + timedelta(seconds=int(recurrence.interval_seconds or 3600))
        zone = ZoneInfo(str(recurrence.time_zone))
        hour, minute = map(int, str(recurrence.local_time).split(":"))
        local_after = after.astimezone(zone)
        allowed = set(recurrence.weekdays) if recurrence.kind == "weekday" else None
        for offset in range(9):
            day = local_after.date() + timedelta(days=offset)
            if allowed is not None and day.strftime("%A").lower() not in allowed:
                continue
            candidate = datetime.combine(day, time(hour, minute))
            instant = cls._first_valid_instant(candidate, zone)
            if instant > after:
                return instant
        raise ValueError("Could not calculate the next scheduled run")

    @staticmethod
    def _first_valid_instant(local_naive: datetime, zone: ZoneInfo) -> datetime:
        candidate = local_naive
        for _ in range(181):
            instants: list[datetime] = []
            for fold in (0, 1):
                aware = candidate.replace(tzinfo=zone, fold=fold)
                utc = aware.astimezone(UTC)
                if utc.astimezone(zone).replace(tzinfo=None) == candidate:
                    instants.append(utc)
            if instants:
                return min(instants)
            candidate += timedelta(minutes=1)
        raise ValueError("Local time is invalid for more than three hours")

    @staticmethod
    def _iso(value: datetime | None) -> str | None:
        return value.isoformat(timespec="seconds") if value else None

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
