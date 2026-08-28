from __future__ import annotations

from datetime import date, timedelta

from fastapi.testclient import TestClient


def _client(app_context):
    from app.main import app

    app.state.context = app_context
    return TestClient(app)


def test_matter_chat_is_saved_and_can_start_a_new_conversation(app_context):
    client = _client(app_context)

    first = client.post(
        "/api/chat",
        json={"message": "What is the real issue?", "matter_id": "MAT-DEMO-BEACON"},
    )
    assert first.status_code == 200
    conversation_id = first.json()["conversation_id"]

    saved = client.get(f"/api/matters/MAT-DEMO-BEACON/conversations/{conversation_id}")
    assert saved.status_code == 200
    assert [message["role"] for message in saved.json()["messages"]] == ["user", "assistant"]
    assert saved.json()["messages"][0]["content"] == "What is the real issue?"

    matter = client.get("/api/matters/MAT-DEMO-BEACON").json()
    conversations_folder = next(node for node in matter["tree"] if node["name"] == "conversations")
    conversation_node = conversations_folder["children"][0]
    assert conversation_node["label"] == "What is the real issue?"
    assert conversation_node["record_type"] == "chat_transcript"

    continued = client.post(
        "/api/chat",
        json={
            "message": "What should I ask next?",
            "matter_id": "MAT-DEMO-BEACON",
            "conversation_id": conversation_id,
        },
    )
    assert continued.status_code == 200
    assert continued.json()["conversation_id"] == conversation_id

    conversations = client.get("/api/matters/MAT-DEMO-BEACON/conversations")
    assert conversations.status_code == 200
    assert len(conversations.json()["conversations"]) == 1
    assert conversations.json()["conversations"][0]["message_count"] == 4

    new_chat = client.post(
        "/api/chat",
        json={
            "message": "Start with clean context.",
            "matter_id": "MAT-DEMO-BEACON",
            "history": [{"role": "user", "content": "This old context must not be saved."}],
        },
    )
    assert new_chat.status_code == 200
    assert new_chat.json()["conversation_id"] != conversation_id
    new_saved = client.get(
        f"/api/matters/MAT-DEMO-BEACON/conversations/{new_chat.json()['conversation_id']}"
    ).json()
    assert [message["content"] for message in new_saved["messages"] if message["role"] == "user"] == [
        "Start with clean context."
    ]


def test_conversation_cannot_be_read_from_another_matter(app_context):
    client = _client(app_context)
    created = client.post(
        "/api/chat",
        json={"message": "Matter-scoped message", "matter_id": "MAT-DEMO-BEACON"},
    )
    conversation_id = created.json()["conversation_id"]

    response = client.get(f"/api/matters/MAT-DEMO-APEX/conversations/{conversation_id}")
    assert response.status_code == 404

    missing = client.post(
        "/api/chat",
        json={
            "message": "Continue",
            "matter_id": "MAT-DEMO-BEACON",
            "conversation_id": "CONV-20260827-000000",
        },
    )
    assert missing.status_code == 404


def test_today_chat_is_saved_in_one_markdown_file_per_day(app_context):
    client = _client(app_context)
    today = date.today().isoformat()
    previous_day = (date.today() - timedelta(days=1)).isoformat()

    first = client.post(
        "/api/chat",
        json={"message": "What needs my attention?", "workspace_day": today},
    )
    assert first.status_code == 200
    assert first.json()["conversation_id"] is None

    saved = client.get(f"/api/daily-conversations/{today}")
    assert saved.status_code == 200
    assert saved.json()["path"] == f"00_System/conversations/{today}.md"
    assert saved.json()["day"] == today
    assert [message["role"] for message in saved.json()["messages"]] == ["user", "assistant"]

    continued = client.post(
        "/api/chat",
        json={"message": "What should I do first?", "workspace_day": today},
    )
    assert continued.status_code == 200

    app_context.chat_history.append_daily(
        previous_day,
        role="user",
        content="What changed yesterday?",
    )
    app_context.chat_history.append_daily(
        previous_day,
        role="assistant",
        content="Yesterday's summary.",
    )

    conversations = client.get("/api/daily-conversations")
    assert conversations.status_code == 200
    assert [item["day"] for item in conversations.json()["conversations"]] == [
        today,
        previous_day,
    ]
    assert conversations.json()["conversations"][0]["message_count"] == 4
    assert conversations.json()["conversations"][1]["message_count"] == 2


def test_today_chat_rejects_invalid_or_mixed_scope(app_context):
    client = _client(app_context)
    today = date.today().isoformat()
    previous_day = (date.today() - timedelta(days=1)).isoformat()

    invalid_day = client.post(
        "/api/chat",
        json={"message": "Hello", "workspace_day": "2026-02-31"},
    )
    assert invalid_day.status_code == 400

    mixed_scope = client.post(
        "/api/chat",
        json={
            "message": "Hello",
            "matter_id": "MAT-DEMO-BEACON",
            "workspace_day": today,
        },
    )
    assert mixed_scope.status_code == 400

    conversation_id_scope = client.post(
        "/api/chat",
        json={
            "message": "Hello",
            "conversation_id": "CONV-20260827-000000",
            "workspace_day": today,
        },
    )
    assert conversation_id_scope.status_code == 400

    previous_day_write = client.post(
        "/api/chat",
        json={"message": "Change yesterday", "workspace_day": previous_day},
    )
    assert previous_day_write.status_code == 400
