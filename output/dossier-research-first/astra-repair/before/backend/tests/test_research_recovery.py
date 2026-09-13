import json

import pytest

from app.models.api import ChatRequest
from app.providers.base import ProviderReply, ProviderToolCall
from app.tools.handlers import read_file
from app.tools.registry import ToolExecutionContext


@pytest.mark.asyncio
async def test_large_tool_read_does_not_repeat_nested_execution_history(app_context):
    path = "04_Inbox/large-history.md"
    content = "start " + "x" * 80000 + " end"
    app_context.vault.write_markdown(path, content, {"record_type": "conversation", "messages": [{"trace": "y" * 100000}]})
    result = await read_file(ToolExecutionContext(app=app_context), {"path": path})
    assert len(json.dumps(result)) < 45000
    assert "messages" not in result["data"]["metadata"]
    assert "Middle omitted" in result["data"]["content"]
    assert result["data"]["content"].endswith(" end\n")
    assert "omitted text" in result["data"]["tool_view_notice"]
    assert app_context.vault.read_markdown(path)["content"] == content + "\n"


@pytest.mark.asyncio
async def test_provider_failure_after_read_gets_one_answer_only_attempt(app_context):
    class Provider:
        calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="Let me read the source.", tool_calls=[ProviderToolCall(id="read", name="read_file", arguments={"path": "00_System/Agents.md"})])
            if self.calls == 2:
                raise TimeoutError()
            assert tools is None
            assert "Answer the user's question now" in messages[-1]["content"]
            return ProviderReply(content="The saved source supports a first pass. External authority remains unverified.")

    provider = Provider()
    app_context.runner.provider = provider
    response = await app_context.runner.run(ChatRequest(message="Explain the source.", agent_id="research-agent"))
    assert provider.calls == 3
    assert "supports a first pass" in response.reply
