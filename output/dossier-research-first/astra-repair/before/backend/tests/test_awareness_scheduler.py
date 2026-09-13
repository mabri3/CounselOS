from __future__ import annotations

import asyncio
from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from app.models.api import ScheduleCreate, ScheduleUpdate
from app.models.awareness import (
    BriefingQuery,
    Digest,
    PublicWatchQuery,
    ScheduleRecurrence,
    Watch,
)
from app.services.scheduler import SchedulerService
from app.utils.time import parse_iso


def _watch(app_context, watch_id: str, *, enabled: bool = True, status: str = "healthy") -> Watch:
    now = datetime.now(UTC)
    watch = Watch(
        watch_id=watch_id,
        path=f"00_System/legal-awareness/watches/{watch_id}.md",
        title="Regulatory Watch",
        standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"),
        purposes=["awareness"],
        enabled=enabled,
        status=status,
        created_at=now,
        updated_at=now,
    )
    app_context.vault.write_markdown(watch.path, "# Regulatory Watch\n", watch.model_dump(mode="json"))
    return watch


def _digest(view_id: str) -> Digest:
    return Digest(
        digest_id="DIGEST-1",
        path="05_Briefing/digests/DIGEST-1.md",
        view_id=view_id,
        view_name="Daily",
        resolved_query=BriefingQuery(),
        title="Daily digest",
        created_at=datetime.now(UTC),
    )


def test_manual_schedule_has_no_due_time_and_validates_targets(app_context):
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="Manual Watch", agent_id="counsel-copilot", instructions="Scan",
        kind="watch_scan", target_watch_id="WATCH-1",
        recurrence=ScheduleRecurrence(kind="manual", local_time=None, time_zone=None),
    ))
    assert schedule["next_run_at"] is None
    assert app_context.scheduler._recurrence(schedule).kind == "manual"

    with pytest.raises(ValueError, match="target_watch_id"):
        app_context.scheduler.create(ScheduleCreate(
            title="Missing Watch", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan"
        ))


def test_time_zone_local_time_and_dst_rules(app_context):
    with pytest.raises(ValidationError, match="IANA"):
        ScheduleRecurrence(kind="daily", local_time="08:00", time_zone="Mars/Olympus")
    with pytest.raises(ValidationError):
        ScheduleRecurrence(kind="daily", local_time="25:00", time_zone="UTC")

    gap = SchedulerService._next_run(
        ScheduleRecurrence(kind="daily", local_time="02:30", time_zone="America/Los_Angeles"),
        datetime(2026, 3, 8, 9, 0, tzinfo=UTC),
    )
    assert gap == datetime(2026, 3, 8, 10, 0, tzinfo=UTC)

    repeated = SchedulerService._next_run(
        ScheduleRecurrence(kind="daily", local_time="01:30", time_zone="America/Los_Angeles"),
        datetime(2026, 11, 1, 7, 0, tzinfo=UTC),
    )
    assert repeated == datetime(2026, 11, 1, 8, 30, tzinfo=UTC)


def test_update_recalculates_and_checks_revision(app_context):
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="Mutable Watch", agent_id="counsel-copilot", instructions="Scan",
        kind="watch_scan", target_watch_id="WATCH-1", interval_seconds=600,
    ))
    updated = app_context.scheduler.update(schedule["schedule_id"], ScheduleUpdate(
        target_watch_id="WATCH-2",
        recurrence=ScheduleRecurrence(kind="weekday", local_time="09:15", time_zone="UTC", weekdays=["monday"]),
        expected_revision=1,
    ))
    assert updated["target_watch_id"] == "WATCH-2"
    assert updated["revision"] == 2
    assert parse_iso(updated["next_run_at"]) > datetime.now(UTC)
    with pytest.raises(ValueError, match="revision conflict"):
        app_context.scheduler.update(schedule["schedule_id"], ScheduleUpdate(enabled=False, expected_revision=1))


@pytest.mark.asyncio
async def test_interval_advances_from_scheduled_time_without_drift(app_context):
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="No drift", agent_id="counsel-copilot", instructions="Audit", interval_seconds=600
    ))
    scheduled = datetime(2026, 8, 29, 12, 0, tzinfo=UTC)
    app_context.vault.update_markdown(
        schedule["path"], metadata_updates={"next_run_at": scheduled.isoformat(timespec="seconds")}
    )
    app_context.index.rebuild()

    assert (await app_context.scheduler.run(schedule["schedule_id"]))["status"] == "success"
    updated = app_context.scheduler._get_schedule(schedule["schedule_id"])
    assert parse_iso(updated["next_run_at"]) == scheduled.replace(minute=10)


@pytest.mark.asyncio
async def test_watch_and_digest_use_bound_fakes(app_context):
    _watch(app_context, "WATCH-1")
    app_context.vault.write_markdown("00_System/legal-awareness/views/VIEW-1.md", "# Daily\n", {"view_id": "VIEW-1"})
    calls: list[tuple[str, str]] = []

    async def watch_runner(target: str):
        calls.append(("watch", target))
        return _digest(target)

    async def digest_runner(target: str):
        calls.append(("digest", target))
        return _digest(target)

    app_context.scheduler.bind_watch_runner(watch_runner)
    app_context.scheduler.bind_digest_runner(digest_runner)
    watch_schedule = app_context.scheduler.create(ScheduleCreate(
        title="Watch", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-1"
    ))
    digest_schedule = app_context.scheduler.create(ScheduleCreate(
        title="Digest", agent_id="counsel-copilot", instructions="Digest", kind="briefing_digest", target_view_id="VIEW-1"
    ))

    assert (await app_context.scheduler.run(watch_schedule["schedule_id"]))["status"] == "success"
    assert (await app_context.scheduler.run(digest_schedule["schedule_id"]))["status"] == "success"
    assert calls == [("watch", "WATCH-1"), ("digest", "VIEW-1")]


@pytest.mark.asyncio
async def test_paused_or_orphaned_targets_are_visible_and_later_runs_continue(app_context):
    _watch(app_context, "WATCH-PAUSED", enabled=False, status="paused")
    calls: list[str] = []

    async def runner(target: str):
        calls.append(target)
        if target == "WATCH-FAIL":
            raise RuntimeError("provider unavailable")
        return _digest(target)

    app_context.scheduler.bind_watch_runner(runner)
    paused = app_context.scheduler.create(ScheduleCreate(
        title="Paused", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-PAUSED"
    ))
    missing = app_context.scheduler.create(ScheduleCreate(
        title="Missing", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-MISSING"
    ))
    _watch(app_context, "WATCH-FAIL")
    failing = app_context.scheduler.create(ScheduleCreate(
        title="Failure", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-FAIL"
    ))
    _watch(app_context, "WATCH-OK")
    good = app_context.scheduler.create(ScheduleCreate(
        title="Good", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-OK"
    ))

    assert (await app_context.scheduler.run(paused["schedule_id"]))["status"] == "skipped"
    assert calls == []
    assert (await app_context.scheduler.run(missing["schedule_id"]))["status"] == "failed"
    assert (await app_context.scheduler.run(failing["schedule_id"]))["status"] == "failed"
    assert (await app_context.scheduler.run(good["schedule_id"]))["status"] == "success"
    assert calls == ["WATCH-FAIL", "WATCH-OK"]
    failed = app_context.scheduler._get_schedule(missing["schedule_id"])
    assert failed["last_status"] == "failed"
    assert "not found" in failed["last_message"].lower()


@pytest.mark.asyncio
async def test_same_schedule_dispatch_is_locked(app_context):
    _watch(app_context, "WATCH-LOCK")
    entered = asyncio.Event()
    release = asyncio.Event()
    calls = 0

    async def runner(target: str):
        nonlocal calls
        calls += 1
        entered.set()
        await release.wait()
        return _digest(target)

    app_context.scheduler.bind_watch_runner(runner)
    schedule = app_context.scheduler.create(ScheduleCreate(
        title="Locked", agent_id="counsel-copilot", instructions="Scan", kind="watch_scan", target_watch_id="WATCH-LOCK"
    ))
    first = asyncio.create_task(app_context.scheduler.run(schedule["schedule_id"]))
    await entered.wait()
    second = await app_context.scheduler.run(schedule["schedule_id"])
    release.set()
    await first
    assert second["status"] == "already_running"
    assert calls == 1


def test_scheduler_has_no_intelligence_provider_import():
    source = __import__("inspect").getsource(SchedulerService)
    assert "app.intelligence" not in source
