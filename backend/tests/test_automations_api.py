from __future__ import annotations

from fastapi.testclient import TestClient

from app.models.api import ScheduleCreate
from app.utils.time import parse_iso, utc_now


def _client(app_context):
    from app.main import app

    app.state.context = app_context
    return TestClient(app)


def test_tools_endpoint_lists_real_tool_ids(app_context):
    body = _client(app_context).get("/api/automations/tools")
    assert body.status_code == 200
    ids = {tool["tool_id"] for tool in body.json()["tools"]}
    assert {"read_file", "search_vault", "write_markdown", "record_decision"} <= ids


def test_agent_get_and_put(app_context):
    client = _client(app_context)
    assert client.get("/api/automations/agents/no-such").status_code == 404
    response = client.put(
        "/api/automations/agents/research-agent",
        json={
            "audience_id": "executive",
            "audience_prompt": "The reader decides.",
        },
    )
    assert response.status_code == 200
    assert response.json()["audience_id"] == "executive"
    reread = client.get("/api/automations/agents/research-agent").json()
    assert reread["audience_prompt"] == "The reader decides."


def test_audiences_endpoint(app_context):
    body = _client(app_context).get("/api/automations/audiences")
    assert body.status_code == 200
    assert {a["audience_id"] for a in body.json()["audiences"]} >= {
        "counsel",
        "executive",
    }


def test_schedule_patch_pauses_and_resumes_without_running(app_context):
    schedule = app_context.scheduler.create(
        ScheduleCreate(
            title="API lifecycle test",
            agent_id="counsel-copilot",
            instructions="Review policy files.",
            interval_seconds=600,
        )
    )
    client = _client(app_context)

    paused_response = client.patch(
        f"/api/automations/schedules/{schedule['schedule_id']}",
        json={"enabled": False},
    )
    assert paused_response.status_code == 200
    paused = paused_response.json()
    assert paused["enabled"] == 0
    assert paused["interval_seconds"] == 600
    assert paused["last_run_at"] is None
    assert paused["last_status"] == "never_run"

    resumed_response = client.patch(
        f"/api/automations/schedules/{schedule['schedule_id']}",
        json={"enabled": True},
    )
    assert resumed_response.status_code == 200
    resumed = resumed_response.json()
    assert resumed["enabled"] == 1
    assert resumed["last_run_at"] is None
    assert resumed["last_status"] == "never_run"
    assert parse_iso(resumed["next_run_at"]) > utc_now()


def test_schedule_patch_returns_404_for_missing_id(app_context):
    response = _client(app_context).patch(
        "/api/automations/schedules/no-such-schedule",
        json={"enabled": True},
    )
    assert response.status_code == 404


def test_schedule_create_accepts_plain_daily_and_weekly_recurrence(app_context):
    client = _client(app_context)
    daily = client.post(
        "/api/automations/schedules",
        json={
            "title": "Daily review",
            "agent_id": "research-agent",
            "instructions": "Review new developments.",
            "interval_seconds": 86400,
            "recurrence": {
                "kind": "daily", "interval_seconds": None,
                "local_time": "09:00", "time_zone": "America/Los_Angeles", "weekdays": [],
            },
        },
    )
    assert daily.status_code == 201
    assert daily.json()["recurrence"]["kind"] == "daily"
    assert daily.json()["recurrence"]["local_time"] == "09:00"

    weekly = client.post(
        "/api/automations/schedules",
        json={
            "title": "Weekly review",
            "agent_id": "research-agent",
            "instructions": "Review new developments.",
            "interval_seconds": 604800,
            "recurrence": {
                "kind": "weekday", "interval_seconds": None,
                "local_time": "09:00", "time_zone": "America/Los_Angeles", "weekdays": ["monday"],
            },
        },
    )
    assert weekly.status_code == 201
    assert weekly.json()["recurrence"]["weekdays"] == ["monday"]
