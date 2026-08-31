from __future__ import annotations

from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient

from app.models.api import ChatRequest, ChatResponse, ToolTrace
from app.providers.base import ProviderReply, ProviderToolCall
from app.routers.chat import _apply_matter_actions


def _client(app_context):
    from app.main import app

    app.state.context = app_context
    return TestClient(app)


def test_successful_typed_work_product_save_prevents_fallback_draft(app_context, monkeypatch):
    calls = []
    monkeypatch.setattr(
        app_context.work_products,
        "create_draft",
        lambda *args, **kwargs: calls.append((args, kwargs)),
    )
    response = ChatResponse(
        reply="Draft saved.",
        trace=[ToolTrace(tool="save_work_product", status="success", summary="Saved response draft.")],
    )

    _apply_matter_actions(
        app_context,
        ChatRequest(message="Draft the work product.", matter_id="MAT-DEMO-BEACON"),
        {"messages": [], "conversation_id": "CONV-TEST"},
        response,
    )

    assert calls == []


def test_typed_save_creates_exactly_one_draft_and_one_work_product_card(app_context, monkeypatch):
    class SaveProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="save",
                    name="save_work_product",
                    arguments={"title": "Typed answer", "content": "One draft", "kind": "response"},
                )])
            return ProviderReply(content="Saved the draft.")

    created = []
    original = app_context.work_products.create_draft

    def counted_create(*args, **kwargs):
        result = original(*args, **kwargs)
        created.append(result)
        return result

    monkeypatch.setattr(app_context.work_products, "create_draft", counted_create)
    app_context.runner.provider = SaveProvider()

    response = _client(app_context).post(
        "/api/chat",
        json={"message": "Draft the work product.", "matter_id": "MAT-DEMO-BEACON"},
    )

    assert response.status_code == 200
    assert len(created) == 1
    cards = [card for card in response.json()["cards"] if card["type"] == "work_product"]
    assert len(cards) == 1
    assert cards[0]["vault_path"] == created[0]["vault_path"]
    assert cards[0]["state"] == "draft"


def test_recommendation_save_does_not_create_a_work_product_card(app_context):
    class RecommendationProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="recommend",
                    name="save_work_product",
                    arguments={
                        "title": "Recommended launch path",
                        "content": "Launch with a 30-day retention cap.",
                        "kind": "recommendation",
                    },
                )])
            return ProviderReply(content="Saved the recommendation.")

    app_context.runner.provider = RecommendationProvider()
    response = _client(app_context).post(
        "/api/chat",
        json={"message": "Save this recommendation.", "matter_id": "MAT-DEMO-BEACON"},
    )

    assert response.status_code == 200
    assert [card for card in response.json()["cards"] if card["type"] == "work_product"] == []
    assert "03_Matters/beacon-instant-onboarding/recommendations.md" in response.json()["changed_paths"]
    assert not any("/work-product/" in path for path in response.json()["changed_paths"])


@pytest.mark.parametrize("trace", [
    [],
    [ToolTrace(tool="save_work_product", status="error", summary="Save failed.")],
])
def test_missing_or_failed_typed_save_keeps_fallback_draft(app_context, monkeypatch, trace):
    calls = []

    def create_draft(*args, **kwargs):
        calls.append((args, kwargs))
        return {
            "title": "Fallback advice",
            "vault_path": "03_Matters/beacon-instant-onboarding/work-product/draft/fallback.md",
            "state": "draft",
            "summary": "Editable first-pass advice",
        }

    monkeypatch.setattr(app_context.work_products, "create_draft", create_draft)
    response = ChatResponse(reply="Useful draft text.", trace=trace)

    _apply_matter_actions(
        app_context,
        ChatRequest(message="Draft the work product.", matter_id="MAT-DEMO-BEACON"),
        {"messages": [], "conversation_id": "CONV-TEST"},
        response,
    )

    assert len(calls) == 1
    assert response.changed_paths == ["03_Matters/beacon-instant-onboarding/work-product/draft/fallback.md"]


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
    conversation_node = next(
        node for node in conversations_folder["children"] if node["label"] == "What is the real issue?"
    )
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
    saved_summary = next(
        item
        for item in conversations.json()["conversations"]
        if item["conversation_id"] == conversation_id
    )
    assert saved_summary["message_count"] == 4

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


def test_recent_user_messages_excludes_assistant_messages(app_context):
    app_context.chat_history.append_daily(
        "2026-08-27", role="user", content="Review this launch request."
    )
    app_context.chat_history.append_daily(
        "2026-08-27", role="assistant", content="Here is my review."
    )

    messages = app_context.chat_history.recent_user_messages()

    assert any(item["content"] == "Review this launch request." for item in messages)
    assert all(item["content"] != "Here is my review." for item in messages)
    assert all(set(item) == {"message_id", "content", "created_at", "scope"} for item in messages)


def test_recent_user_messages_is_bounded_and_newest_first(app_context):
    app_context.vault.write_markdown(
        "00_System/conversations/2026-08-28.md",
        "# Workspace chat\n",
        {
            "scope": "workspace_day",
            "day": "2026-08-28",
            "messages": [
                {
                    "message_id": "MSG-OLD",
                    "role": "user",
                    "content": "Older request",
                    "created_at": "2099-08-28T08:00:00+00:00",
                },
                {
                    "message_id": "MSG-NEW",
                    "role": "user",
                    "content": "Newer request",
                    "created_at": "2099-08-28T09:00:00+00:00",
                },
            ],
        },
    )

    messages = app_context.chat_history.recent_user_messages(limit=1)

    assert [item["message_id"] for item in messages] == ["MSG-NEW"]


def test_old_chat_messages_load_with_empty_applied_skills(app_context):
    app_context.chat_history.append_daily(
        "2026-08-27", role="user", content="Old message without skill metadata."
    )
    document = app_context.vault.read_markdown("00_System/conversations/2026-08-27.md")
    messages = document["metadata"]["messages"]
    messages[-1].pop("applied_skills", None)
    app_context.vault.write_markdown(
        "00_System/conversations/2026-08-27.md", document["content"], {**document["metadata"], "messages": messages}
    )

    loaded = app_context.chat_history.get_daily("2026-08-27")

    assert loaded["messages"][-1]["applied_skills"] == []


def test_applied_skill_survives_markdown_rule_in_assistant_reply(app_context):
    app_context.chat_history.append_daily(
        "2026-08-26", role="user", content="/launch-review Review this."
    )
    app_context.chat_history.append_daily(
        "2026-08-26",
        role="assistant",
        content="Recommendation\n\n---\n\nNext step",
        applied_skills=[{"skill_id": "launch-review", "name": "Launch Review"}],
    )

    loaded = app_context.chat_history.get_daily("2026-08-26")

    assert loaded["messages"][-1]["content"] == "Recommendation\n\n---\n\nNext step"
    assert loaded["messages"][-1]["applied_skills"] == [
        {"skill_id": "launch-review", "name": "Launch Review"}
    ]
