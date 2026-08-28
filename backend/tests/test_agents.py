from __future__ import annotations

import pytest

from app.agents.runner import _explicit_decision_recording_requested
from app.models.api import ChatRequest
from app.providers.base import ProviderReply, ProviderToolCall


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


@pytest.mark.asyncio
async def test_chat_cannot_record_decision_without_explicit_user_request(app_context):
    class AutoRecordProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(
                    tool_calls=[
                        ProviderToolCall(
                            id="automatic-decision",
                            name="record_decision",
                            arguments={
                                "title": "Approved customer response",
                                "chosen_path": "Send the response.",
                            },
                        )
                    ]
                )
            return ProviderReply(content="The response is ready for your approval.")

    before = len(app_context.decisions.list())
    app_context.runner.provider = AutoRecordProvider()
    response = await app_context.runner.run(
        ChatRequest(
            message="Approve the customer response.",
            matter_id="MAT-DEMO-HARBOR",
        )
    )

    assert len(app_context.decisions.list()) == before
    assert any(
        item.tool == "record_decision" and item.status == "error"
        for item in response.trace
    )


@pytest.mark.asyncio
async def test_chat_can_record_decision_after_explicit_user_request(app_context):
    class RequestedRecordProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(
                    tool_calls=[
                        ProviderToolCall(
                            id="requested-decision",
                            name="record_decision",
                            arguments={
                                "title": "Account hold notice standard",
                                "chosen_path": "Give notice before this type of account hold.",
                            },
                        )
                    ]
                )
            return ProviderReply(content="The durable decision is recorded.")

    before = len(app_context.decisions.list())
    app_context.runner.provider = RequestedRecordProvider()
    response = await app_context.runner.run(
        ChatRequest(
            message="Record this as a durable decision.",
            matter_id="MAT-DEMO-HARBOR",
        )
    )

    assert len(app_context.decisions.list()) == before + 1
    assert any(
        item.tool == "record_decision" and item.status == "success"
        for item in response.trace
    )


@pytest.mark.parametrize(
    ("message", "expected"),
    [
        ("Record this as a durable decision.", True),
        ("Please save this policy as our durable position.", True),
        ("Approve the response.", False),
        ("Do not record this decision.", False),
        ("Should this become a durable decision?", False),
        ("Should I record this decision?", False),
    ],
)
def test_decision_recording_intent_must_be_explicit(message, expected):
    assert _explicit_decision_recording_requested(message) is expected


def test_agent_update_persists_and_preserves_enabled(app_context):
    updated = app_context.agents.update(
        "research-agent",
        name="Themis",
        audience_id="executive",
        audience_prompt="The reader decides and does not practise law.",
        allowed_tools=["read_file", "search_vault"],
        instructions="Answer with the citation first.",
    )
    assert updated["name"] == "Themis"
    assert updated["audience_id"] == "executive"
    assert updated["allowed_tools"] == ["read_file", "search_vault"]

    reloaded = app_context.agents.get("research-agent")
    assert reloaded.name == "Themis"
    assert "schedule_text" not in reloaded.__dict__
    assert "citation first" in reloaded.instructions
    assert any(a["agent_id"] == "research-agent" for a in app_context.agents.list())


def test_audience_reaches_the_model_context(app_context):
    app_context.agents.update(
        "research-agent",
        audience_id="executive",
        audience_prompt="The reader decides and does not practise law.",
    )
    agent = app_context.agents.get("research-agent")
    built = app_context.agent_context.build(agent)
    assert "# Written for" in built
    assert "does not practise law" in built


def test_empty_audience_injects_nothing(app_context):
    app_context.agents.update(
        "research-agent", audience_id="", audience_prompt="   "
    )
    agent = app_context.agents.get("research-agent")
    assert "# Written for" not in app_context.agent_context.build(agent)


def test_audiences_are_read_from_the_vault(app_context):
    ids = {entry["audience_id"] for entry in app_context.agents.audiences()}
    assert {"counsel", "executive", "product", "partner", "regulator", "record"} == ids
    executive = next(
        entry
        for entry in app_context.agents.audiences()
        if entry["audience_id"] == "executive"
    )
    assert executive["label"] == "An executive"
    assert executive["prompt"].strip()


def test_agent_update_rejects_unknown_agent(app_context):
    with pytest.raises(KeyError):
        app_context.agents.update("no-such-agent", name="X")


def test_agent_update_does_not_duplicate_existing_title(app_context):
    original = app_context.agents.get("counsel-copilot")
    app_context.agents.update(
        "counsel-copilot",
        instructions=original.instructions,
    )
    reloaded = app_context.agents.get("counsel-copilot")
    assert reloaded.instructions.count("# Counsel Copilot") == 1
