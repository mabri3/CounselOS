from __future__ import annotations

import asyncio

import pytest

from app.models.api import ChatRequest, MatterCreate
from app.providers.base import ProviderReply, ProviderToolCall
from app.providers.catalog import ProviderAdapterError
from app.routers.chat import execute_chat
from app.routers.chat import _queue_intake_research
from app.routers.matters import create_matter
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
    assert started["expected_dossier_hash"] == app_context.dossiers.content_hash(
        "MAT-DEMO-BEACON"
    )
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
async def test_intake_run_without_conversation_reattaches_to_active_intake(app_context):
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="One question.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
    )
    app_context.vault.update_markdown(
        f'{app_context.matters.get("MAT-DEMO-BEACON")["path"]}/matter.md',
        metadata_updates={
            "intake_state": "active",
            "intake_conversation_id": conversation["conversation_id"],
        },
    )
    app_context.index.rebuild()

    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(
            matter_id="MAT-DEMO-BEACON", agent_id="intake-agent",
            card_action={"card_id": "provider-question", "action": "stop"},
        ),
    )
    assert started["conversation_id"] == conversation["conversation_id"]
    await app_context.chat_runs.wait(started["run_id"])

    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["intake_state"] == "complete"


def test_intake_research_deduplicates_only_within_one_intake_cycle():
    class Runs:
        def __init__(self):
            self.keys = []

        def start(self, _matter_id, _questions, *, source_action_key=None):
            if source_action_key not in self.keys:
                self.keys.append(source_action_key)

    context = type("Context", (), {"research_runs": Runs()})()
    record = {"public_research_questions": ["What law applies?"]}

    _queue_intake_research(context, "MAT-1", record, cycle_id="CONV-1")
    _queue_intake_research(context, "MAT-1", record, cycle_id="CONV-1")
    _queue_intake_research(context, "MAT-1", record, cycle_id="CONV-2")

    assert context.research_runs.keys == ["intake:CONV-1", "intake:CONV-2"]


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


@pytest.mark.asyncio
async def test_unavailable_selected_provider_has_safe_visible_failure_detail(app_context):
    class UnavailableProvider:
        async def complete(self, messages, tools=None):
            raise ProviderAdapterError("Codex CLI is unavailable or not signed in.")

    app_context.runner.provider = UnavailableProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Help me.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert failed["failure_detail"] == "Codex CLI is unavailable or not signed in."


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
async def test_skip_calls_model_for_next_question_without_saving_answer(app_context):
    class NextQuestionProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            return ProviderReply(content="I skipped that question and moved to the next material point.")

    provider = NextQuestionProvider()
    app_context.runner.provider = provider
    before_facts = list(app_context.matter_records.get("MAT-DEMO-BEACON")["facts"])
    before_runs = list(app_context.research_runs.list("MAT-DEMO-BEACON"))
    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            card_action={"card_id": "intake-confirm-ask", "action": "skip"},
        ),
        app_context,
    )
    assert provider.calls == 1
    assert "next material point" in response.reply
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["facts"] == before_facts
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == before_runs


@pytest.mark.asyncio
async def test_grouped_question_answers_reach_model_in_one_turn(app_context):
    class GroupedAnswerProvider:
        def __init__(self):
            self.messages = []

        async def complete(self, messages, tools=None):
            self.messages = messages
            return ProviderReply(content="I used the prioritized answers together.")

    provider = GroupedAnswerProvider()
    app_context.runner.provider = provider
    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            card_action={
                "card_id": "intake-set:Q-ONE:Q-TWO",
                "action": "answer_set",
                "answers": [
                    {"card_id": "Q-ONE", "action": "answer", "values": ["pending"]},
                    {"card_id": "Q-TWO", "action": "skip", "values": []},
                ],
            },
        ),
        app_context,
    )

    assert response.reply == "I used the prioritized answers together."
    assert "Q-ONE: pending" in provider.messages[-1]["content"]
    assert "Q-TWO: Skipped" in provider.messages[-1]["content"]


@pytest.mark.asyncio
async def test_stop_completes_intake_without_calling_model_or_saving_answer(app_context):
    class UnexpectedProvider:
        async def complete(self, messages, tools=None):
            raise AssertionError("Stop must not call the model.")

    app_context.runner.provider = UnexpectedProvider()
    before_facts = list(app_context.matter_records.get("MAT-DEMO-BEACON")["facts"])
    before_runs = list(app_context.research_runs.list("MAT-DEMO-BEACON"))
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="One question.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
    )
    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            conversation_id=conversation["conversation_id"],
            card_action={"card_id": "provider-generated-question", "action": "stop"},
        ),
        app_context,
    )
    assert "complete" in response.reply.lower()
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["facts"] == before_facts
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["intake_state"] == "complete"
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == before_runs
    assert app_context.dossiers.get("MAT-DEMO-BEACON") is not None


@pytest.mark.asyncio
async def test_clarification_answer_reaches_model_without_generic_fact_or_research(app_context):
    class AnswerProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            return ProviderReply(content="I updated the working understanding.")

    provider = AnswerProvider()
    app_context.runner.provider = provider
    before_facts = list(app_context.matter_records.get("MAT-DEMO-BEACON")["facts"])
    before_runs = list(app_context.research_runs.list("MAT-DEMO-BEACON"))
    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            message="The pilot is limited to California.",
            card_action={
                "card_id": "intake-confirm-ask",
                "action": "answer",
                "values": ["change", "The pilot is limited to California."],
            },
        ),
        app_context,
    )
    assert provider.calls == 1
    assert response.reply == "I updated the working understanding."
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["facts"] == before_facts
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == before_runs


@pytest.mark.asyncio
@pytest.mark.parametrize("values", [["summarize"], ["other", "Compare only the pricing clauses."]])
async def test_non_intake_question_answers_reach_model_without_intake_side_effects(
    app_context, values
):
    class AnswerProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            return ProviderReply(content="Handled the document instruction.")

    provider = AnswerProvider()
    app_context.runner.provider = provider
    before_facts = list(app_context.matter_records.get("MAT-DEMO-BEACON")["facts"])
    before_runs = list(app_context.research_runs.list("MAT-DEMO-BEACON"))

    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            card_action={"card_id": "upload-SRC-1", "action": "answer", "values": values},
        ),
        app_context,
    )

    assert provider.calls == 1
    assert response.reply == "Handled the document instruction."
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["facts"] == before_facts
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == before_runs
    assert not any(card.type == "matter_update" for card in response.cards)


@pytest.mark.asyncio
async def test_new_matter_runs_contextual_typed_intake_to_records_and_dossier(app_context):
    request_text = (
        "We want marketplace sellers with higher-risk-country owners to receive combined "
        "international payouts into U.S. accounts in eight weeks. What BSA/AML controls "
        "and partner-bank approvals are needed?"
    )

    class IntakeProvider:
        def __init__(self):
            self.calls = []

        async def complete(self, messages, tools=None):
            self.calls.append(messages)
            if len(self.calls) == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="intake-turn",
                    name="update_matter_intake",
                    arguments={
                        "working_ask": "Decide the BSA/AML controls needed before the marketplace payout launch.",
                        "reported_facts": [
                            {"statement": "The product combines international marketplace payouts."},
                            {"statement": "Some sellers have owners in higher-risk countries."},
                            {"statement": "Product plans to launch in eight weeks."},
                        ],
                        "issues": ["Customer due diligence", "Sanctions screening", "Partner-bank approval"],
                        "material_missing_facts": ["Which countries and payout corridors are in scope?"],
                        "next_question": {
                            "question_id": "intake-corridors",
                            "text": "Which countries and payout corridors are in scope?",
                            "reason": "The corridor changes the sanctions and diligence analysis.",
                            "selection_mode": "multiple",
                            "choices": [
                                {"value": "known", "label": "I can list them"},
                                {"value": "other", "label": "Something else"},
                                {"value": "skip", "label": "Skip"},
                                {"value": "stop", "label": "No more questions"},
                            ],
                        },
                        "intake_state": "active",
                        "dossier_orientation": "Marketplace payouts need a launch-control decision in eight weeks.",
                    },
                )])
            return ProviderReply(
                content=(
                    "You want to launch combined international marketplace payouts into "
                    "U.S. accounts in eight weeks, including sellers with higher-risk-country "
                    "owners, and need the BSA/AML and partner-bank controls."
                )
            )

    provider = IntakeProvider()
    app_context.runner.provider = provider
    created = await create_matter(
        MatterCreate(title="Marketplace payouts", request_text=request_text),
        app_context,
    )
    await app_context.chat_runs.wait(created["intake_run_id"])

    run = app_context.chat_runs.get(created["matter_id"], created["intake_run_id"])
    conversation = app_context.chat_history.get(
        created["matter_id"], created["intake_conversation_id"]
    )
    assert run["state"] == "completed"
    assert [message["role"] for message in conversation["messages"]] == ["user", "assistant"]
    assert conversation["messages"][0]["content"] == request_text
    assert sum(
        message.get("role") == "user" and message.get("content") == request_text
        for message in provider.calls[0]
    ) == 1
    question = next(
        card for card in conversation["messages"][1]["cards"] if card["type"] == "question"
    )
    assert question["text"] == "Which countries and payout corridors are in scope?"
    assert question["progress_total"] is None
    records = app_context.matter_records.get(created["matter_id"])
    assert any("higher-risk countries" in fact["text"] for fact in records["facts"])
    assert app_context.dossiers.get(created["matter_id"]) is not None
