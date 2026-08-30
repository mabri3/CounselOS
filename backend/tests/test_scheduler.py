from __future__ import annotations

import pytest

from app.models.api import ScheduleCreate, ScheduleUpdate
from app.utils.time import parse_iso, utc_now


def test_new_schedule_waits_for_its_first_interval(app_context):
    schedule = app_context.scheduler.create(
        ScheduleCreate(
            title="Deferred first run",
            agent_id="counsel-copilot",
            instructions="Review the current policy files.",
            interval_seconds=600,
        )
    )

    assert parse_iso(schedule["next_run_at"]) > utc_now()


def test_schedule_pause_and_resume_preserve_run_state(app_context):
    schedule = app_context.scheduler.create(
        ScheduleCreate(
            title="Lifecycle test",
            agent_id="counsel-copilot",
            instructions="Review current policy files.",
            interval_seconds=600,
        )
    )
    app_context.vault.update_markdown(
        schedule["path"],
        metadata_updates={
            "last_run_at": "2026-08-01T12:00:00+00:00",
            "last_status": "error",
        },
    )
    app_context.index.rebuild()

    original_next_run = schedule["next_run_at"]
    paused = app_context.scheduler.update(
        schedule["schedule_id"], ScheduleUpdate(enabled=False)
    )
    assert paused["enabled"] == 0
    assert paused["interval_seconds"] == 600
    assert paused["next_run_at"] == original_next_run
    assert paused["last_run_at"] == "2026-08-01T12:00:00+00:00"
    assert paused["last_status"] == "error"

    before_resume = utc_now()
    resumed = app_context.scheduler.update(
        schedule["schedule_id"], ScheduleUpdate(enabled=True)
    )
    assert resumed["enabled"] == 1
    assert resumed["interval_seconds"] == 600
    assert resumed["last_run_at"] == "2026-08-01T12:00:00+00:00"
    assert resumed["last_status"] == "error"
    assert parse_iso(resumed["next_run_at"]) > before_resume
    assert parse_iso(resumed["next_run_at"]) > utc_now()
    assert 599 <= (parse_iso(resumed["next_run_at"]) - before_resume).total_seconds() <= 600


@pytest.mark.asyncio
async def test_agent_schedule_does_not_recreate_itself(app_context):
    schedule = app_context.scheduler.create(
        ScheduleCreate(
            title="Policy review",
            agent_id="counsel-copilot",
            instructions="Create a schedule to review policy files every 10 minutes.",
            interval_seconds=600,
        )
    )
    schedule_count = len(app_context.scheduler.list())

    result = await app_context.scheduler.run(schedule["schedule_id"])

    assert result["status"] == "success"
    assert len(app_context.scheduler.list()) == schedule_count
    updated = app_context.index.get_schedule(schedule["schedule_id"])
    assert updated["last_run_at"]
