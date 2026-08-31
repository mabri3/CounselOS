from __future__ import annotations

import pytest
from types import SimpleNamespace

from app.providers.catalog import ProviderAdapterError, normalize_tool_call, prepare_tools
from app.providers.factory import ProviderRouter
from app.providers.mock import MockProvider


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
