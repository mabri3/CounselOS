from __future__ import annotations

import pytest

from app.models.api import ChatRequest


@pytest.mark.asyncio
async def test_mock_chat_moves_matter(app_context):
    response = await app_context.runner.run(
        ChatRequest(
            message="Move this matter to Generate.",
            matter_id="MAT-DEMO-APEX",
        )
    )
    assert any(item.tool == "move_matter_stage" and item.status == "success" for item in response.trace)
    assert app_context.index.get_matter("MAT-DEMO-APEX")["status"] == "generate"


@pytest.mark.asyncio
async def test_mock_chat_creates_schedule(app_context):
    response = await app_context.runner.run(
        ChatRequest(
            message="Create a schedule to watch the inbox every 10 minutes.",
            matter_id="MAT-DEMO-BEACON",
        )
    )
    assert any(item.tool == "create_schedule" and item.status == "success" for item in response.trace)
    assert len(app_context.scheduler.list()) >= 3

@pytest.mark.asyncio
async def test_unknown_markdown_handler_never_executes(app_context):
    from app.agents.registry import AgentDefinition
    from app.tools.registry import ToolExecutionContext

    app_context.vault.write_markdown(
        "00_System/tools/untrusted-demo.md",
        "# Untrusted tool\n",
        {
            "tool_id": "untrusted_demo",
            "handler": "not_registered",
            "description": "Must not execute.",
            "parameters": {"type": "object", "properties": {}},
        },
    )
    agent = AgentDefinition(
        agent_id="test",
        name="Test",
        description="",
        instructions="",
        allowed_tools=["untrusted_demo"],
        max_steps=1,
        path="",
    )
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context),
        "untrusted_demo",
        {},
    )
    assert result.status == "error"
    assert "unknown handler" in result.summary.lower()
