from __future__ import annotations

import asyncio
import logging
from datetime import timedelta
from unittest.mock import AsyncMock

import pytest

from app.models.api import ScheduleCreate
from app.utils.time import utc_now


@pytest.mark.asyncio
async def test_poll_reads_only_due_enabled_index_rows(app_context, monkeypatch):
    scheduler = app_context.scheduler
    read_ids: list[str] = []
    ran: list[str] = []
    now = utc_now()
    rows = [
        {"schedule_id": "disabled", "enabled": 0, "kind": "agent_prompt", "next_run_at": None},
        {"schedule_id": "manual", "enabled": 1, "kind": "manual", "next_run_at": None},
        {
            "schedule_id": "future", "enabled": 1, "kind": "agent_prompt",
            "next_run_at": (now + timedelta(hours=1)).isoformat(),
        },
        {"schedule_id": "due", "enabled": 1, "kind": "agent_prompt", "next_run_at": None},
    ]

    monkeypatch.setattr(scheduler.index, "list_schedules", lambda: rows)

    def read_schedule(row):
        read_ids.append(row["schedule_id"])
        return {
            **row,
            "recurrence": {"kind": "interval", "interval_seconds": 60},
        }

    async def run(schedule_id: str):
        ran.append(schedule_id)
        return {"schedule_id": schedule_id, "status": "success"}

    monkeypatch.setattr(scheduler, "_schedule_with_metadata", read_schedule)
    monkeypatch.setattr(scheduler, "run", run)

    await scheduler._poll()
    await asyncio.sleep(0)

    assert read_ids == ["due"]
    assert ran == ["due"]


@pytest.mark.asyncio
async def test_malformed_due_schedule_fails_first_and_can_retry_after_repair(app_context, monkeypatch):
    scheduler = app_context.scheduler
    schedule = scheduler.create(ScheduleCreate(
        title="Malformed recurrence", agent_id="counsel-copilot", instructions="Run", interval_seconds=60,
    ))
    app_context.vault.update_markdown(schedule["path"], metadata_updates={
        "next_run_at": (utc_now() - timedelta(seconds=1)).isoformat(),
        "recurrence": {"kind": "invalid"},
    })
    app_context.index.rebuild()
    list_schedules = scheduler.index.list_schedules
    monkeypatch.setattr(
        scheduler.index,
        "list_schedules",
        lambda: [row for row in list_schedules() if row["schedule_id"] == schedule["schedule_id"]],
    )
    ran: list[str] = []

    async def run(schedule_id: str):
        ran.append(schedule_id)
        return {"schedule_id": schedule_id, "status": "success"}

    monkeypatch.setattr(scheduler, "run", run)

    with pytest.raises(ValueError):
        await scheduler._poll()
    assert ran == []

    app_context.vault.update_markdown(schedule["path"], metadata_updates={
        "recurrence": {"kind": "interval", "interval_seconds": 60},
    })
    app_context.index.rebuild()
    await scheduler._poll()
    await asyncio.sleep(0)

    assert schedule["schedule_id"] in ran


@pytest.mark.asyncio
async def test_outer_poll_failure_is_logged_and_later_poll_runs(app_context, monkeypatch, caplog):
    scheduler = app_context.scheduler
    scheduler.poll_seconds = 0.01
    recovered = asyncio.Event()
    calls = 0

    async def poll():
        nonlocal calls
        calls += 1
        if calls == 1:
            raise RuntimeError("private transport detail")
        recovered.set()

    monkeypatch.setattr(scheduler, "_poll", poll)
    caplog.set_level(logging.ERROR, logger="app.services.scheduler")
    scheduler.start()
    await asyncio.wait_for(recovered.wait(), timeout=1)
    await scheduler.stop()

    assert calls >= 2
    assert "Scheduler poll failed" in caplog.text


@pytest.mark.asyncio
async def test_poll_does_not_dispatch_duplicate_while_rebuild_is_pending(app_context, monkeypatch):
    scheduler = app_context.scheduler
    schedule = scheduler.create(ScheduleCreate(
        title="Rebuild lock", agent_id="counsel-copilot", instructions="Run", interval_seconds=60,
    ))
    app_context.vault.update_markdown(
        schedule["path"], metadata_updates={"next_run_at": (utc_now() - timedelta(seconds=1)).isoformat()},
    )
    app_context.index.rebuild()
    list_schedules = scheduler.index.list_schedules
    monkeypatch.setattr(
        scheduler.index,
        "list_schedules",
        lambda: [row for row in list_schedules() if row["schedule_id"] == schedule["schedule_id"]],
    )
    rebuild_started = asyncio.Event()
    release_rebuild = asyncio.Event()
    executions = 0

    class Response:
        def model_dump(self):
            return {}

    async def run_agent(_request):
        nonlocal executions
        executions += 1
        return Response()

    async def delayed_rebuild():
        rebuild_started.set()
        await release_rebuild.wait()

    monkeypatch.setattr(app_context.runner, "run", run_agent)
    monkeypatch.setattr(app_context.index, "rebuild_async", delayed_rebuild)

    first = asyncio.create_task(scheduler.run(schedule["schedule_id"]))
    await asyncio.wait_for(rebuild_started.wait(), timeout=1)
    await scheduler._poll()
    await asyncio.sleep(0)

    assert executions == 1
    release_rebuild.set()
    await first
    await scheduler.wait_for_active_work()


@pytest.mark.asyncio
async def test_scheduler_persists_stable_failure_message_and_logs_detail(app_context, monkeypatch, caplog):
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="Failure message", agent_id="counsel-copilot", instructions="Run", interval_seconds=60,
    ))

    async def fail(_request):
        raise RuntimeError("api_key=private-value")

    monkeypatch.setattr(app_context.runner, "run", fail)
    caplog.set_level(logging.ERROR, logger="app.services.scheduler")

    result = await app_context.scheduler.run(schedule["schedule_id"])
    stored = app_context.scheduler._get_schedule(schedule["schedule_id"])

    expected = "The scheduled task failed. Check the local application log for details."
    assert result["result"] == {"error": expected}
    assert stored["last_message"] == expected
    assert "private-value" not in stored["last_message"]
    assert "private-value" in caplog.text


@pytest.mark.asyncio
async def test_inbox_batch_rebuilds_once_after_partial_failure(app_context, monkeypatch):
    inbox = app_context.vault.resolve("04_Inbox")
    inbox.mkdir(parents=True, exist_ok=True)
    (inbox / "a-first.txt").write_text("First intake", encoding="utf-8")
    (inbox / "b-fails.txt").write_text("Second intake", encoding="utf-8")
    before = len(app_context.index.list_matters())
    create = app_context.matters.create
    rebuild_async = AsyncMock(wraps=app_context.index.rebuild_async)
    rebuild_flags: list[bool] = []

    def create_with_failure(request, *, rebuild=True):
        rebuild_flags.append(rebuild)
        if len(rebuild_flags) == 2:
            raise RuntimeError("second intake failed")
        return create(request, rebuild=rebuild)

    monkeypatch.setattr(app_context.matters, "create", create_with_failure)
    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)

    with pytest.raises(RuntimeError, match="second intake failed"):
        await app_context.scheduler._run_inbox_watch({"watch_path": "04_Inbox"})

    rebuild_async.assert_awaited_once()
    assert rebuild_flags == [False, False]
    assert len(app_context.index.list_matters()) == before + 1
    assert "a-first.txt" not in {path.name for path in inbox.iterdir() if path.is_file()}


@pytest.mark.asyncio
async def test_inbox_run_rebuilds_once_after_partial_failure(app_context, monkeypatch):
    inbox = app_context.vault.resolve("04_Inbox")
    inbox.mkdir(parents=True, exist_ok=True)
    (inbox / "a-fails.txt").write_text("Failed intake", encoding="utf-8")
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="Inbox", agent_id="intake-agent", instructions="Watch inbox",
        kind="inbox_watch", watch_path="04_Inbox", interval_seconds=60,
    ))
    rebuild_async = AsyncMock(wraps=app_context.index.rebuild_async)

    def fail_create(_request, *, rebuild=True):
        assert rebuild is False
        raise RuntimeError("inbox file failed")

    monkeypatch.setattr(app_context.matters, "create", fail_create)
    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)

    result = await app_context.scheduler.run(schedule["schedule_id"])

    assert result["status"] == "failed"
    rebuild_async.assert_awaited_once()
