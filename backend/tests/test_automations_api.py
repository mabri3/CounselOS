from __future__ import annotations

from fastapi.testclient import TestClient


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
