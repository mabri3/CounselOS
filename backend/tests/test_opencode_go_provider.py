from __future__ import annotations

import json
import asyncio

import pytest

from app.providers.catalog import ProviderAdapterError
from app.providers.opencode_go import OpenCodeGoProvider
from tests.test_provider_conformance import TOOLS


class Response:
    def __init__(self, payload, status: int = 200):
        self.content = json.dumps(payload).encode()
        self.status = status

    def raise_for_status(self):
        if self.status >= 400:
            raise RuntimeError("secret from upstream")


class Client:
    def __init__(self, response):
        self.response = response
        self.calls = []

    async def post(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return self.response

    async def get(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return self.response


@pytest.mark.asyncio
async def test_chat_protocol_preserves_text_and_multiple_native_tool_calls():
    client = Client(Response({"choices": [{"message": {
        "content": "Useful text",
        "tool_calls": [
            {"id": "a", "function": {"name": "save_fact", "arguments": '{"fact":"A"}'}},
            {"id": "b", "function": {"name": "save_fact", "arguments": '{"fact":"B"}'}},
        ],
    }}]}))
    provider = OpenCodeGoProvider("deepseek-v4-flash", api_key="test-key", client=client)

    reply = await provider.complete([{"role": "user", "content": "Go"}], TOOLS)

    assert reply.content == "Useful text"
    assert [call.arguments for call in reply.tool_calls] == [{"fact": "A"}, {"fact": "B"}]
    assert client.calls[0][0].endswith("/chat/completions")


@pytest.mark.asyncio
async def test_messages_protocol_normalizes_native_tool_call():
    client = Client(Response({"content": [
        {"type": "text", "text": "Working"},
        {"type": "tool_use", "id": "a", "name": "save_fact", "input": {"fact": "A"}},
    ]}))
    provider = OpenCodeGoProvider("minimax-m3", api_key="test-key", client=client)

    reply = await provider.complete([{"role": "user", "content": "Go"}], TOOLS)

    assert reply.content == "Working"
    assert reply.tool_calls[0].name == "save_fact"
    assert client.calls[0][0].endswith("/messages")


@pytest.mark.asyncio
async def test_messages_protocol_translates_follow_up_tool_history():
    client = Client(Response({"content": [{"type": "text", "text": "Done"}]}))
    provider = OpenCodeGoProvider("minimax-m3", api_key="test-key", client=client)

    await provider.complete([
        {"role": "user", "content": "Save it"},
        {
            "role": "assistant",
            "content": "Working",
            "tool_calls": [{
                "id": "call-1", "type": "function",
                "function": {"name": "save_fact", "arguments": '{"fact":"A"}'},
            }],
        },
        {
            "role": "tool", "tool_call_id": "call-1", "name": "save_fact",
            "content": '{"status":"success"}',
        },
    ], TOOLS)

    sent = client.calls[0][1]["json"]["messages"]
    assert sent[1]["content"] == [
        {"type": "text", "text": "Working"},
        {"type": "tool_use", "id": "call-1", "name": "save_fact", "input": {"fact": "A"}},
    ]
    assert sent[2]["content"] == [{
        "type": "tool_result", "tool_use_id": "call-1",
        "content": '{"status":"success"}',
    }]
    assert all(message["role"] != "tool" and "tool_calls" not in message for message in sent)


@pytest.mark.asyncio
async def test_cancelled_request_is_not_rewritten_as_provider_failure():
    class CancelClient:
        async def post(self, *_args, **_kwargs):
            raise asyncio.CancelledError

    provider = OpenCodeGoProvider("deepseek-v4-flash", api_key="test-key", client=CancelClient())

    with pytest.raises(asyncio.CancelledError):
        await provider.complete([{"role": "user", "content": "Go"}])


@pytest.mark.asyncio
async def test_unknown_model_and_tool_are_rejected_without_guessing():
    with pytest.raises(ValueError, match="known protocol"):
        OpenCodeGoProvider("future-model", api_key="test-key")
    provider = OpenCodeGoProvider(
        "deepseek-v4-flash",
        api_key="test-key",
        client=Client(Response({"choices": [{"message": {"content": "", "tool_calls": [
            {"id": "x", "function": {"name": "shell", "arguments": "{}"}},
        ]}}]})),
    )
    with pytest.raises(ProviderAdapterError, match="unknown tool"):
        await provider.complete([{"role": "user", "content": "Go"}], TOOLS)


@pytest.mark.asyncio
async def test_catalog_filters_unknown_protocols_and_has_default_effort():
    client = Client(Response({"data": [
        {"id": "deepseek-v4-flash", "display_name": "DeepSeek", "reasoning_efforts": ["low", "high"]},
        {"id": "minimax-m3", "display_name": "MiniMax"},
        {"id": "unknown", "display_name": "Unknown"},
    ]}))

    catalog = await OpenCodeGoProvider.catalog(api_key="test-key", client=client)

    assert catalog.readiness == "ready"
    assert [(model.id, model.reasoning_efforts) for model in catalog.models] == [
        ("deepseek-v4-flash", ("default", "low", "high")),
        ("minimax-m3", ("default",)),
    ]


@pytest.mark.asyncio
async def test_missing_and_malformed_catalogs_keep_saved_model_visible(monkeypatch, tmp_path):
    monkeypatch.setenv("XDG_DATA_HOME", str(tmp_path))
    monkeypatch.delenv("OPENCODE_GO_API_KEY", raising=False)
    monkeypatch.delenv("OPENCODE_API_KEY", raising=False)
    missing = await OpenCodeGoProvider.catalog(saved_model="saved")
    malformed = await OpenCodeGoProvider.catalog(
        api_key="test-key", client=Client(Response({"data": "bad"})), saved_model="saved",
    )

    assert missing.readiness == "missing"
    assert malformed.readiness == "unavailable"
    assert missing.models[0].id == malformed.models[0].id == "saved"


@pytest.mark.asyncio
async def test_secret_reflection_is_rejected_without_secret_in_error():
    provider = OpenCodeGoProvider(
        "deepseek-v4-flash", api_key="very-secret",
        client=Client(Response({"choices": [{"message": {"content": "very-secret"}}]})),
    )

    with pytest.raises(ProviderAdapterError) as caught:
        await provider.complete([{"role": "user", "content": "Go"}])

    assert "very-secret" not in str(caught.value)

@pytest.mark.asyncio
async def test_v41_sends_session_header_and_max_effort():
    from app.providers.base import provider_session_id
    client = Client(Response({'choices':[{'message':{'content':'OK'}}]}))
    provider = OpenCodeGoProvider('deepseek-v4.1-flash', reasoning_effort='max', api_key='test-key', client=client)
    token = provider_session_id.set('research-session')
    try:
        await provider.complete([{'role':'user','content':'Test'}])
    finally:
        provider_session_id.reset(token)
    assert client.calls[0][1]['headers']['x-opencode-session'] == 'research-session'
    assert client.calls[0][1]['headers']['User-Agent'] == 'CounselOS/0.1'
    assert client.calls[0][1]['json']['reasoning_effort'] == 'max'


def test_cli_credential_reused_without_copying(monkeypatch, tmp_path):
    from app.providers.opencode_go import resolve_api_key
    monkeypatch.delenv('OPENCODE_GO_API_KEY', raising=False)
    monkeypatch.delenv('OPENCODE_API_KEY', raising=False)
    monkeypatch.setenv('XDG_DATA_HOME', str(tmp_path))
    (tmp_path/'opencode').mkdir()
    (tmp_path/'opencode/auth.json').write_text(json.dumps({'opencode-go':{'type':'api','key':'test-cli-key'}}))
    assert resolve_api_key() == 'test-cli-key'
    monkeypatch.setenv('OPENCODE_GO_API_KEY', 'explicit-key')
    assert resolve_api_key() == 'explicit-key'
