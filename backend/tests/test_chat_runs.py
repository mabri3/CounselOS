from __future__ import annotations

import asyncio

import pytest

from app.models.api import ChatRequest
from app.providers.base import ProviderReply, ProviderToolCall
from app.tools.registry import ToolExecutionResult
from app.runtime import AppContext


@pytest.mark.asyncio
async def test_chat_run_persists_queued_running_completed(app_context):
    gate = asyncio.Event()

    class SlowProvider:
        async def complete(self, messages, tools=None):
            await gate.wait()
            return ProviderReply(content="Useful durable answer.")

    app_context.runner.provider = SlowProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Help me.", matter_id="MAT-DEMO-BEACON")
    )
    assert started["state"] == "queued"
    await asyncio.sleep(0)
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["state"] == "running"
    gate.set()
    await app_context.chat_runs.wait(started["run_id"])
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert completed["response"]["reply"] == "Useful durable answer."
    assert app_context.vault.read_markdown(completed["path"])["metadata"]["record_type"] == "chat_run"


def test_startup_marks_unfinished_chat_runs_interrupted(app_context):
    path = "03_Matters/beacon-instant-onboarding/conversations/runs/RUN-OLD.md"
    app_context.vault.write_markdown(path, "# Chat run", {
        "record_type": "chat_run", "run_id": "RUN-OLD", "matter_id": "MAT-DEMO-BEACON",
        "state": "running", "status": "Chat is running.", "created_at": "2026-01-01T00:00:00Z",
    })
    assert app_context.chat_runs.mark_running_interrupted() == 1
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", "RUN-OLD")["state"] == "interrupted"


@pytest.mark.asyncio
async def test_provider_failure_is_durable_and_retry_reuses_turn(app_context):
    class FailingProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("secret provider payload")

    app_context.runner.provider = FailingProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Retry this.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])
    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert "secret" not in failed["failure_detail"]

    class GoodProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="Recovered answer.")

    app_context.runner.provider = GoodProvider()
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await app_context.chat_runs.wait(started["run_id"])
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", completed["conversation_id"])
    assert [message["role"] for message in conversation["messages"]] == ["user", "assistant"]
    assert conversation["messages"][1]["content"] == "Recovered answer."


def test_completed_chat_run_cannot_retry(app_context):
    path = "03_Matters/beacon-instant-onboarding/conversations/runs/RUN-DONE.md"
    app_context.vault.write_markdown(path, "# Chat run", {
        "record_type": "chat_run", "run_id": "RUN-DONE", "matter_id": "MAT-DEMO-BEACON",
        "state": "completed", "status": "Chat is complete.", "created_at": "2026-01-01T00:00:00Z",
    })
    with pytest.raises(ValueError, match="failed or interrupted"):
        app_context.chat_runs.retry("MAT-DEMO-BEACON", "RUN-DONE")


@pytest.mark.asyncio
async def test_retry_does_not_repeat_completed_tool_mutation(app_context, monkeypatch):
    mutations = []

    async def execute(agent, context, tool_id, arguments):
        mutations.append((tool_id, arguments))
        return ToolExecutionResult(tool_id, "success", "Created the requested work item.")

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class PartialFailureProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="one", name="create_work_item", arguments={"title": "Review launch"},
                )])
            raise RuntimeError("later provider failure")

    app_context.runner.provider = PartialFailureProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Create a review task.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])
    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert len(failed["completed_mutations"]) == 1

    class RetryProvider:
        def __init__(self):
            self.calls = 0
            self.observations = []

        async def complete(self, messages, tools=None):
            self.calls += 1
            self.observations = messages
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="again", name="create_work_item", arguments={"title": "Review launch"},
                )])
            return ProviderReply(content="The review task is ready.")

    retry_provider = RetryProvider()
    app_context.runner.provider = retry_provider
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await app_context.chat_runs.wait(started["run_id"])
    assert len(mutations) == 1
    assert any("Already completed in this chat run" in str(message.get("content")) for message in retry_provider.observations)
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", completed["conversation_id"])
    assistants = [item for item in conversation["messages"] if item["role"] == "assistant"]
    assert len(assistants) == 1
    assert assistants[0]["content"] == "The review task is ready."


@pytest.mark.asyncio
async def test_useful_partial_content_and_trace_survive_malformed_later_reply(app_context, monkeypatch):
    async def execute(agent, context, tool_id, arguments):
        return ToolExecutionResult(tool_id, "success", "Saved the useful draft.", changed_paths=["draft.md"])

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class MalformedProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="I prepared a useful draft.", tool_calls=[ProviderToolCall(
                    id="save", name="save_work_product", arguments={"title": "Draft"},
                )])
            return ProviderReply(content={"malformed": True})

    app_context.runner.provider = MalformedProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Draft the work product.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])
    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert failed["response"]["reply"] == "I prepared a useful draft."
    assert failed["response"]["trace"][0]["summary"] == "Saved the useful draft."


@pytest.mark.asyncio
async def test_timeout_fallback_summarizes_completed_work(app_context, monkeypatch):
    async def execute(agent, context, tool_id, arguments):
        return ToolExecutionResult(tool_id, "success", "Created the launch checklist.")

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class TimeoutProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            if tools is None:
                return ProviderReply(content="")
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="work", name="create_work_item", arguments={"title": "Launch checklist"},
                )])
            await asyncio.sleep(1)
            return ProviderReply(content="late")

    provider = TimeoutProvider()
    app_context.runner.provider = provider
    app_context.provider = provider
    app_context.chat_runs.timeout_seconds = 0.02
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Create launch work.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert "Created the launch checklist." in completed["response"]["reply"]
    assert "Remaining work" in completed["response"]["reply"]


@pytest.mark.asyncio
async def test_useful_partial_assistant_is_replaced_by_retry_result(app_context, monkeypatch):
    async def execute(agent, context, tool_id, arguments):
        return ToolExecutionResult(tool_id, "success", "Saved an intermediate draft.")

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class PartialProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="Partial answer.", tool_calls=[ProviderToolCall(
                    id="draft", name="save_work_product", arguments={"title": "One"},
                )])
            raise RuntimeError("stopped")

    app_context.runner.provider = PartialProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Draft advice.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    class RecoveredProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="Recovered final answer.")

    app_context.runner.provider = RecoveredProvider()
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await app_context.chat_runs.wait(started["run_id"])
    run = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", run["conversation_id"])
    assistants = [item for item in conversation["messages"] if item["role"] == "assistant"]
    assert len(assistants) == 1
    assert assistants[0]["content"] == "Recovered final answer."


@pytest.mark.asyncio
async def test_read_only_tool_runs_again_on_retry(app_context, monkeypatch):
    reads = []

    async def execute(agent, context, tool_id, arguments):
        reads.append(arguments)
        return ToolExecutionResult(tool_id, "success", "Read the matter request.", data={"content": "Current request"})

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class ReadThenFail:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="read", name="read_file", arguments={"path": "request.md"},
                )])
            raise RuntimeError("later failure")

    app_context.runner.provider = ReadThenFail()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Read the request.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])
    app_context.runner.provider = ReadThenFail()
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await app_context.chat_runs.wait(started["run_id"])
    assert len(reads) == 2
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["completed_mutations"] == {}


@pytest.mark.asyncio
async def test_second_concurrent_retry_is_rejected(app_context):
    class FailProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("fail")

    app_context.runner.provider = FailProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Try this.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    gate = asyncio.Event()

    class SlowProvider:
        async def complete(self, messages, tools=None):
            await gate.wait()
            return ProviderReply(content="done")

    app_context.runner.provider = SlowProvider()
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    with pytest.raises(ValueError, match="already queued or running"):
        app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    gate.set()
    await app_context.chat_runs.wait(started["run_id"])


@pytest.mark.asyncio
async def test_intake_automatic_actions_survive_restart_and_retry_once(app_context, monkeypatch):
    class AnswerProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="Saved the intake answer.")

    app_context.runner.provider = AnswerProvider()
    original_upsert = app_context.chat_history.upsert_run_assistant
    failed_once = False

    def fail_after_actions(*args, **kwargs):
        nonlocal failed_once
        if not failed_once:
            failed_once = True
            raise RuntimeError("simulated stop after automatic actions")
        return original_upsert(*args, **kwargs)

    monkeypatch.setattr(app_context.chat_history, "upsert_run_assistant", fail_after_actions)
    request = ChatRequest(
        matter_id="MAT-DEMO-BEACON",
        card_action={"card_id": "intake-launch", "action": "answer", "values": ["Yes"]},
    )
    started = app_context.chat_runs.start("MAT-DEMO-BEACON", request)
    await app_context.chat_runs.wait(started["run_id"])
    await app_context.research_runs.wait_for_active_work()
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["state"] == "failed"

    restarted = AppContext(app_context.settings)
    restarted.runner.provider = AnswerProvider()
    restarted.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await restarted.chat_runs.wait(started["run_id"])
    await restarted.research_runs.wait_for_active_work()

    run = restarted.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = restarted.chat_history.get("MAT-DEMO-BEACON", run["conversation_id"])
    assert [item["role"] for item in conversation["messages"]] == ["user", "assistant"]
    records = restarted.matter_records.get("MAT-DEMO-BEACON")
    assert sum(item.get("text") == "Intake response: Yes" for item in records["facts"]) == 1
    assert sum(item.get("summary") == "Saved an intake response" for item in records["actions"]) == 1
    events = [
        restarted.vault.read_markdown(restarted.vault.relative(path))["metadata"]
        for path in restarted.vault.resolve("03_Matters/beacon-instant-onboarding/events").glob("*.md")
    ]
    assert sum(item.get("event_type") == "matter_records_updated" for item in events) == 1
    source_key = f"MAT-DEMO-BEACON:{run['conversation_id']}:intake-launch"
    research_runs = [item for item in restarted.research_runs.list("MAT-DEMO-BEACON") if item.get("source_action_key") == source_key]
    assert len(research_runs) == 1
    packets = list(restarted.vault.resolve("03_Matters/beacon-instant-onboarding/research").glob("RES-*.md"))
    assert len(packets) == 1
