from __future__ import annotations

import pytest

from app.models.api import ScheduleCreate
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
