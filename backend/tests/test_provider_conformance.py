from __future__ import annotations

import pytest
from types import SimpleNamespace

from app.providers.catalog import ProviderAdapterError, normalize_tool_call, prepare_tools
from app.providers.factory import ProviderRouter
from app.providers.mock import MockProvider
from app.providers.openai_compatible import OpenAICompatibleProvider
from app.intelligence.polaris import POLARIS_BASE_URL, POLARIS_MODEL
from app.config import Settings


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "save_fact",
            "description": "Save one fact.",
            "parameters": {
                "type": "object",
                "properties": {"fact": {"type": "string"}},
                "required": ["fact"],
                "additionalProperties": False,
            },
        },
    }
]


def test_tool_normalization_accepts_object_and_json_arguments():
    _prepared, allowed = prepare_tools(TOOLS)

    first = normalize_tool_call(call_id="one", name="save_fact", arguments={"fact": "A"}, allowed=allowed)
    second = normalize_tool_call(call_id="two", name="save_fact", arguments='{"fact":"B"}', allowed=allowed)

    assert first.arguments == {"fact": "A"}
    assert second.arguments == {"fact": "B"}


@pytest.mark.asyncio
@pytest.mark.parametrize("arguments", [
    {"working_ask": "Ship the product", "next_questions": [{"question_id": "Q1", "text": "Where?", "choices": []}], "intake_state": "active"},
    '{"working_ask":"Ship the product","next_questions":[{"question_id":"Q1","text":"Where?","choices":[]}],"intake_state":"active"}',
])
async def test_openai_compatible_normalizes_nested_tool_arguments_once(monkeypatch, arguments):
    tool = {
        "type": "function",
        "function": {
            "name": "update_matter_intake",
            "description": "Save intake.",
            "parameters": {"type": "object", "properties": {}, "additionalProperties": True},
        },
    }

    class Response:
        def raise_for_status(self):
            return None

        def json(self):
            return {"choices": [{"message": {"content": "", "tool_calls": [{
                "id": "call-1",
                "function": {"name": "update_matter_intake", "arguments": arguments},
            }]}}]}

    class Client:
        def __init__(self, **_kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *_args):
            return None

        async def post(self, *_args, **_kwargs):
            return Response()

    monkeypatch.setattr("app.providers.openai_compatible.httpx.AsyncClient", Client)
    settings = Settings(
        llm_provider="openai_compatible",
        llm_api_key="test-key",
        llm_model="test-model",
    )

    reply = await OpenAICompatibleProvider(settings).complete([], [tool])

    assert reply.tool_calls[0].arguments["next_questions"][0]["question_id"] == "Q1"


@pytest.mark.parametrize(
    ("name", "arguments", "message"),
    [
        ("shell", {}, "unknown tool"),
        ("save_fact", "not-json", "malformed"),
        ("save_fact", "[]", "JSON object"),
    ],
)
def test_tool_normalization_rejects_unknown_or_malformed_calls(name, arguments, message):
    _prepared, allowed = prepare_tools(TOOLS)

    with pytest.raises(ProviderAdapterError, match=message):
        normalize_tool_call(call_id="call", name=name, arguments=arguments, allowed=allowed)


def test_tool_definitions_are_bounded_and_have_unique_safe_names():
    duplicate = [TOOLS[0], TOOLS[0]]
    oversized = [{
        "type": "function",
        "function": {"name": "save_fact", "description": "x" * 8_193, "parameters": {}},
    }]

    with pytest.raises(ProviderAdapterError, match="Tool definitions"):
        prepare_tools(duplicate)
    with pytest.raises(ProviderAdapterError, match="Tool definitions"):
        prepare_tools(oversized)


def test_explicit_provider_does_not_borrow_workspace_model(app_context):
    agent = SimpleNamespace(
        agent_id="research-agent", provider="codex", model="", reasoning_effort=""
    )

    with pytest.raises(ValueError, match="no model selected"):
        app_context.provider_router.resolve(agent)


def test_polaris_agent_provider_uses_existing_endpoint_and_key(app_context):
    settings = app_context.settings.model_copy(update={"polaris_api_key": "polaris-key"})
    router = ProviderRouter(settings, MockProvider())
    agent = SimpleNamespace(
        agent_id="research-agent", provider="polaris", model=POLARIS_MODEL,
        reasoning_effort="default",
    )

    resolved = router.resolve(agent)

    assert isinstance(resolved.provider, OpenAICompatibleProvider)
    assert resolved.provider.settings.llm_base_url == POLARIS_BASE_URL
    assert resolved.provider.settings.llm_api_key == "polaris-key"
    assert resolved.selection.provider == "polaris"


@pytest.mark.asyncio
async def test_workspace_update_closes_workspace_and_cached_providers(app_context):
    class ClosableProvider:
        def __init__(self):
            self.closed = 0

        async def close(self):
            self.closed += 1

    workspace = ClosableProvider()
    cached = ClosableProvider()
    router = ProviderRouter(app_context.settings, workspace)
    router._instances[("test", "model", "default")] = cached

    replacement = MockProvider()
    await router.update_workspace(app_context.settings, replacement)

    assert workspace.closed == 1
    assert cached.closed == 1
    assert router.workspace_provider is replacement
