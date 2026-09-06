from __future__ import annotations

import asyncio

import pytest

from app.agents.runner import RunnerExecutionState, _cards_for, _deterministic_intake_question
from app.models.api import ChatRequest, ChatResponse, MatterCreate, ToolTrace
from app.providers.base import ProviderReply, ProviderToolCall
from app.providers.catalog import ProviderAdapterError
from app.routers.chat import (
    IntakeQuestionRecoveryRequest,
    _reject_duplicate_question_action,
    _route_matter_agent,
    execute_chat,
    recover_intake_question,
)
from app.routers.chat import _apply_matter_actions, _queue_intake_research
from app.routers.matters import create_matter
from app.routers.matters import _hide_resolved_intake_questions
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
    assert started["correlation_id"].startswith("COR-")
    assert started["milestone"] == "Queued."
    assert started["expected_dossier_hash"] == app_context.dossiers.content_hash(
        "MAT-DEMO-BEACON"
    )
    await asyncio.sleep(0)
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["state"] == "running"
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["milestone"] == "Model is working."
    gate.set()
    await app_context.chat_runs.wait(started["run_id"])
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert completed["milestone"] == "Completed."
    assert completed["response"]["reply"] == "Useful durable answer."
    assert app_context.vault.read_markdown(completed["path"])["metadata"]["record_type"] == "chat_run"


@pytest.mark.asyncio
async def test_run_08_no_change_decision_claim_matches_saved_history(app_context):
    class NoToolProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content=(
                "## Recorded decision\n\n"
                "The durable matter decision is now recorded. The launch analysis remains useful."
            ))

    app_context.runner.provider = NoToolProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(message="Assess the launch path.", matter_id="MAT-DEMO-BEACON"),
    )
    await app_context.chat_runs.wait(started["run_id"])

    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    response_reply = completed["response"]["reply"]
    conversation = app_context.chat_history.get(
        "MAT-DEMO-BEACON", completed["conversation_id"]
    )
    saved_reply = conversation["messages"][-1]["content"]

    assert response_reply == (
        "The launch analysis remains useful.\n\nNo durable decision was recorded."
    )
    assert saved_reply == response_reply


def test_startup_marks_unfinished_chat_runs_interrupted(app_context):
    path = "03_Matters/beacon-instant-onboarding/conversations/runs/RUN-OLD.md"
    app_context.vault.write_markdown(path, "# Chat run", {
        "record_type": "chat_run", "run_id": "RUN-OLD", "matter_id": "MAT-DEMO-BEACON",
        "state": "running", "status": "Chat is running.", "created_at": "2026-01-01T00:00:00Z",
    })
    assert app_context.chat_runs.mark_running_interrupted() == 1
    assert app_context.chat_runs.get("MAT-DEMO-BEACON", "RUN-OLD")["state"] == "interrupted"


def test_restart_preserves_useful_durable_chat_evidence(app_context):
    path = "03_Matters/beacon-instant-onboarding/conversations/runs/RUN-PARTIAL.md"
    app_context.vault.write_markdown(path, "# Chat run", {
        "record_type": "chat_run", "run_id": "RUN-PARTIAL", "matter_id": "MAT-DEMO-BEACON",
        "state": "running", "status": "Chat is running.", "created_at": "2026-01-01T00:00:00Z",
        "partial_changed_paths": ["03_Matters/beacon-instant-onboarding/work-product/draft/advice.md"],
        "operation_results": [{
            "operation": "save_work_product", "status": "changed",
            "summary": "Saved the useful draft.",
            "changed_paths": ["03_Matters/beacon-instant-onboarding/work-product/draft/advice.md"],
        }],
    })

    assert app_context.chat_runs.mark_running_interrupted() == 1
    interrupted = app_context.chat_runs.get("MAT-DEMO-BEACON", "RUN-PARTIAL")
    assert interrupted["finished_at"]
    assert interrupted["response"]["changed_paths"] == interrupted["partial_changed_paths"]
    assert "No tool work completed" not in interrupted["response"]["reply"]


def test_start_rejects_a_second_answer_before_it_is_appended(app_context):
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="Which countries are in scope?",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{
            "type": "question", "question_id": "intake-jurisdiction",
            "text": "Which countries are in scope?", "selection_mode": "free_text",
        }],
    )
    app_context.chat_history.append(
        "MAT-DEMO-BEACON", conversation["conversation_id"], role="user",
        content="United States only",
        card_action={"card_id": "intake-jurisdiction", "action": "answer", "values": ["United States only"]},
    )
    before = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])

    with pytest.raises(ValueError, match="already answered"):
        app_context.chat_runs.start(
            "MAT-DEMO-BEACON",
            ChatRequest(
                matter_id="MAT-DEMO-BEACON", agent_id="intake-agent",
                conversation_id=conversation["conversation_id"],
                card_action={"card_id": "intake-jurisdiction", "action": "answer", "values": ["United States only"]},
            ),
        )

    after = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    assert len(after["messages"]) == len(before["messages"])


def test_grouped_answer_rejects_a_question_that_was_already_answered(app_context):
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="Two questions.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[
            {"type": "question", "question_id": "Q-ONE", "text": "First?", "selection_mode": "free_text"},
            {"type": "question", "question_id": "Q-TWO", "text": "Second?", "selection_mode": "free_text"},
        ],
    )
    app_context.chat_history.append(
        "MAT-DEMO-BEACON", conversation["conversation_id"], role="user", content="First answer",
        card_action={"card_id": "Q-ONE", "action": "answer", "values": ["First answer"]},
    )
    saved = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])

    with pytest.raises(ValueError, match="already answered"):
        _reject_duplicate_question_action(
            saved,
            ChatRequest(
                matter_id="MAT-DEMO-BEACON",
                card_action={
                    "card_id": "intake-set:Q-ONE:Q-TWO",
                    "action": "answer_set",
                    "answers": [
                        {"card_id": "Q-ONE", "action": "answer", "values": ["again"]},
                        {"card_id": "Q-TWO", "action": "answer", "values": ["second"]},
                    ],
                },
            ),
        )


@pytest.mark.asyncio
async def test_intake_card_answer_is_saved_before_a_model_can_omit_the_update_tool(app_context):
    question_text = (
        "Whether the account opening is subject to a Customer Identification Program (CIP)?"
    )
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    record["open_questions"] = [question_text]
    app_context.matter_records._save("MAT-DEMO-BEACON", record)
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="One material question.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{
            "type": "question",
            "question_id": "cip-applies",
            "text": question_text,
            "selection_mode": "single",
            "choices": [
                {"value": "yes", "label": "Yes, CIP applies"},
                {"value": "no", "label": "No, CIP does not apply"},
            ],
        }],
    )

    class NoToolProvider:
        def __init__(self):
            self.messages = []

        async def complete(self, messages, tools=None):
            self.messages = messages
            return ProviderReply(content="Recorded — CIP applies.")

    provider = NoToolProvider()
    app_context.runner.provider = provider
    response = await execute_chat(
        ChatRequest(
            matter_id="MAT-DEMO-BEACON",
            conversation_id=conversation["conversation_id"],
            message="Yes, CIP applies",
            card_action={"card_id": "cip-applies", "action": "answer", "values": ["yes"]},
        ),
        app_context,
    )

    saved = app_context.matter_records.get("MAT-DEMO-BEACON")
    assert saved["intake_answers"][-1]["question_id"] == "cip-applies"
    assert saved["intake_answers"][-1]["answer"] == "Yes, CIP applies"
    assert any("CIP applies" in fact["text"] for fact in saved["facts"])
    assert question_text not in saved["open_questions"]
    assert any(question_text in str(message.get("content") or "") for message in provider.messages)
    assert any("Yes, CIP applies" in str(message.get("content") or "") for message in provider.messages)
    assert all(
        getattr(card, "text", "") != question_text
        for card in response.cards
    )
    assert any(
        result["operation"] == "record_intake_answer" and result["status"] == "changed"
        for result in response.operation_results
    )


def test_conversation_hides_semantically_repeated_question_after_durable_answer(app_context):
    original = "Is this account subject to a Customer Identification Program under the BSA?"
    repeated = "Whether the account is subject to a Customer Identification Program under the BSA."
    app_context.matter_records.record_intake_answers(
        "MAT-DEMO-BEACON",
        [{
            "question_id": "cip-original",
            "question": original,
            "answer": "Yes, CIP applies",
            "values": ["yes"],
            "status": "answered",
            "record_target": "fact",
        }],
        source_id="MSG-CIP",
        source_action_key="chat:cip",
    )
    conversation = {
        "conversation_kind": "intake",
        "messages": [{
            "role": "assistant",
            "cards": [{
                "type": "question",
                "question_id": "intake-recovery-missing-fact",
                "text": repeated,
            }],
        }],
    }

    reconciled = _hide_resolved_intake_questions(
        app_context, "MAT-DEMO-BEACON", conversation
    )

    assert reconciled["messages"][0]["cards"] == []


def test_answered_jurisdiction_card_is_not_asked_again_by_recovery(app_context):
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    app_context.vault.update_markdown(
        f'{matter["path"]}/matter.md',
        metadata_updates={"jurisdiction_scope": [], "target_date": "2026-09-15"},
    )
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    record.update({"working_ask": "Assess launch.", "issues": ["Privacy"], "open_questions": []})
    app_context.matter_records._save("MAT-DEMO-BEACON", record)
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="Which countries are in scope?",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{
            "type": "question", "question_id": "intake-jurisdiction",
            "text": "Which countries are in scope?", "selection_mode": "free_text",
        }],
    )
    app_context.chat_history.append(
        "MAT-DEMO-BEACON", conversation["conversation_id"], role="user",
        content="United States only",
        card_action={"card_id": "intake-jurisdiction", "action": "answer", "values": ["United States only"]},
    )
    app_context.vault.update_markdown(
        f'{matter["path"]}/matter.md',
        metadata_updates={"intake_conversation_id": conversation["conversation_id"]},
    )

    question = _deterministic_intake_question(app_context, "MAT-DEMO-BEACON")

    assert question.question_id != "intake-recovery-jurisdiction"


def test_answered_categorical_timing_card_is_not_asked_again_by_recovery(app_context):
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    app_context.vault.update_markdown(
        f'{matter["path"]}/matter.md',
        metadata_updates={"target_date": "", "jurisdiction_scope": []},
    )
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    record.update({"working_ask": "Assess launch.", "issues": ["Privacy"], "open_questions": []})
    app_context.matter_records._save("MAT-DEMO-BEACON", record)
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="Timing?",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{
            "type": "question", "question_id": "intake-recovery-timing",
            "text": "When does the business need the legal answer?", "selection_mode": "single",
            "choices": [{"value": "launch", "label": "Before a planned launch"}],
        }],
    )
    app_context.chat_history.append(
        "MAT-DEMO-BEACON", conversation["conversation_id"], role="user",
        content="Before a planned launch",
        card_action={"card_id": "intake-recovery-timing", "action": "answer", "values": ["Before a planned launch"]},
    )
    app_context.vault.update_markdown(
        f'{matter["path"]}/matter.md',
        metadata_updates={"intake_conversation_id": conversation["conversation_id"]},
    )

    question = _deterministic_intake_question(app_context, "MAT-DEMO-BEACON")

    assert question.question_id == "intake-recovery-jurisdiction"


@pytest.mark.parametrize(
    ("message", "card_action", "expected"),
    [
        ("Start focused legal research and save a packet.", None, "counsel-copilot"),
        ("Draft a response for Product.", None, "counsel-copilot"),
        ("Proceed with assumptions and prepare the memo.", None, "counsel-copilot"),
        ("Research is not needed.", None, "intake-agent"),
        ("United States only", {"card_id": "jurisdiction", "action": "answer", "values": ["US"]}, "intake-agent"),
    ],
)
def test_active_intake_routes_only_explicit_substantive_work_to_copilot(message, card_action, expected):
    request = ChatRequest(message=message, matter_id="MAT-1", card_action=card_action)
    assert _route_matter_agent(request, intake_active=True, recovery=False) == expected


def test_intake_recovery_always_routes_to_intake_agent():
    request = ChatRequest(message="Start research.", matter_id="MAT-1")
    assert _route_matter_agent(request, intake_active=True, recovery=True) == "intake-agent"


def test_answered_intake_card_does_not_create_a_synthetic_success_card():
    cards = _cards_for(ChatRequest(
        matter_id="MAT-1", agent_id="intake-agent",
        card_action={"card_id": "intake-jurisdiction", "action": "answer", "values": ["US"]},
    ))

    assert cards == []


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
async def test_active_intake_recovers_prose_question_without_fake_user_message(app_context):
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant",
        content="Next question: How will users spend the balance?",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
    )

    class RecoveryProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="recovery-question",
                    name="update_matter_intake",
                    arguments={
                        "working_ask": "Decide whether the balance can launch.",
                        "next_questions": [{
                            "question_id": "balance-use",
                            "text": "How will users spend the balance?",
                            "selection_mode": "single",
                            "choices": [
                                {"value": "merchant", "label": "Pay merchants"},
                                {"value": "funding", "label": "Fund transactions only"},
                            ],
                        }],
                        "intake_state": "active",
                    },
                )])
            return ProviderReply(content="Choose the answer below.")

    app_context.runner.provider = RecoveryProvider()
    started = await recover_intake_question(
        "MAT-DEMO-BEACON",
        IntakeQuestionRecoveryRequest(conversation_id=conversation["conversation_id"]),
        app_context,
    )
    before = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    assert [message["role"] for message in before["messages"]] == ["assistant"]

    await app_context.chat_runs.wait(started.run_id)
    saved = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    assert [message["role"] for message in saved["messages"]] == ["assistant", "assistant"]
    assert saved["messages"][-1]["cards"][0]["type"] == "question"
    assert saved["messages"][-1]["cards"][0]["question_id"] == "balance-use"


@pytest.mark.asyncio
async def test_recovery_ignores_a_saved_card_resolved_by_durable_answer(app_context):
    original = "Is this account subject to a Customer Identification Program under the BSA?"
    repeated = "Whether the account is subject to a Customer Identification Program under the BSA."
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="Saved fallback.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{
            "type": "question",
            "question_id": "stale-cip",
            "text": repeated,
            "selection_mode": "free_text",
        }],
    )
    app_context.matter_records.record_intake_answers(
        "MAT-DEMO-BEACON",
        [{
            "question_id": "original-cip",
            "question": original,
            "answer": "Yes, CIP applies",
            "values": ["yes"],
            "status": "answered",
            "record_target": "fact",
        }],
        source_id="MSG-CIP",
        source_action_key="chat:cip-recovery",
    )

    class NoToolProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="Continuing from the saved answer.")

    app_context.runner.provider = NoToolProvider()
    started = await recover_intake_question(
        "MAT-DEMO-BEACON",
        IntakeQuestionRecoveryRequest(conversation_id=conversation["conversation_id"]),
        app_context,
    )
    await app_context.chat_runs.wait(started.run_id)

    saved = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    latest_questions = [
        card for card in saved["messages"][-1]["cards"] if card["type"] == "question"
    ]
    assert latest_questions
    assert all("Customer Identification Program" not in card["text"] for card in latest_questions)


@pytest.mark.asyncio
async def test_failed_provider_intake_recovery_uses_saved_open_question(app_context):
    question = "Which saved deployment region is in scope?"
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    record["open_questions"] = [question]
    app_context.matter_records._save("MAT-DEMO-BEACON", record)
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="The prior turn lost its card.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
    )

    class FailingProvider:
        async def complete(self, messages, tools=None):
            raise ProviderAdapterError("Provider unavailable.")

    app_context.runner.provider = FailingProvider()
    started = await recover_intake_question(
        "MAT-DEMO-BEACON",
        IntakeQuestionRecoveryRequest(conversation_id=conversation["conversation_id"]),
        app_context,
    )
    await app_context.chat_runs.wait(started.run_id)

    run = app_context.chat_runs.get("MAT-DEMO-BEACON", started.run_id)
    saved = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    assert run["state"] == "completed"
    assert run["milestone"] == "Completed from saved intake state."
    assert run["response"]["cards"][0]["text"] == question
    assert saved["messages"][-1]["cards"][0]["text"] == question


@pytest.mark.asyncio
async def test_failed_provider_intake_recovery_offers_finish_without_inventing_question(app_context):
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    record["open_questions"] = []
    app_context.matter_records._save("MAT-DEMO-BEACON", record)
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content="The prior turn lost its card.",
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
    )

    class FailingProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("provider stopped")

    app_context.runner.provider = FailingProvider()
    started = await recover_intake_question(
        "MAT-DEMO-BEACON",
        IntakeQuestionRecoveryRequest(conversation_id=conversation["conversation_id"]),
        app_context,
    )
    await app_context.chat_runs.wait(started.run_id)

    run = app_context.chat_runs.get("MAT-DEMO-BEACON", started.run_id)
    card = run["response"]["cards"][0]
    assert run["state"] == "completed"
    assert card["question_id"] == "intake-recovery-finish"
    assert card["allow_stop"] is True
    assert "No unresolved saved intake question" in card["text"]


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
    assert failed["failure_class"] == "provider"

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
async def test_chat_cancellation_preserves_evidence_and_retry_clears_stale_response(app_context, monkeypatch):
    original_run = app_context.runner.run

    async def cancelled(_request, *, execution_state=None, **_kwargs):
        execution_state.changed_paths.append("03_Matters/beacon-instant-onboarding/drafts/advice.md")
        raise asyncio.CancelledError

    monkeypatch.setattr(app_context.runner, "run", cancelled)
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Draft advice.", matter_id="MAT-DEMO-BEACON")
    )
    with pytest.raises(asyncio.CancelledError):
        await app_context.chat_runs.wait(started["run_id"])

    interrupted = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert interrupted["state"] == "interrupted"
    assert interrupted["response"]["changed_paths"] == ["03_Matters/beacon-instant-onboarding/drafts/advice.md"]
    assert "No tool work completed" not in interrupted["response"]["reply"]

    monkeypatch.setattr(app_context.runner, "run", original_run)
    queued = app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    assert queued["response"] is None
    app_context.chat_runs._tasks[started["run_id"]].cancel()
    with pytest.raises(asyncio.CancelledError):
        await app_context.chat_runs.wait(started["run_id"])


@pytest.mark.asyncio
async def test_start_persists_user_turn_before_queued_response(app_context):
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Keep this turn.", matter_id="MAT-DEMO-BEACON")
    )

    assert started["conversation_id"]
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", started["conversation_id"])
    assert [(item["role"], item["content"]) for item in conversation["messages"]] == [
        ("user", "Keep this turn.")
    ]
    await app_context.chat_runs.wait(started["run_id"])


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
        mutations.append((context, tool_id, arguments))
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
                    id="again",
                    name="create_work_item",
                    arguments={
                        "title": "Review launch",
                        "description": "",
                        "item_type": "question",
                        "status": "open",
                        "priority": "normal",
                        "owner": "",
                        "due_at": None,
                        "required": False,
                        "issue_id": None,
                    },
                )])
            return ProviderReply(content="The review task is ready.")

    retry_provider = RetryProvider()
    app_context.runner.provider = retry_provider
    app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    await app_context.chat_runs.wait(started["run_id"])
    assert len(mutations) == 1
    assert mutations[0][0].source_action_key.startswith(
        f"chat:{started['run_id']}:tool:"
    )
    assert any("Already completed in this chat run" in str(message.get("content")) for message in retry_provider.observations)
    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", completed["conversation_id"])
    assistants = [item for item in conversation["messages"] if item["role"] == "assistant"]
    assert len(assistants) == 1
    assert assistants[0]["content"] == "The review task is ready."


@pytest.mark.asyncio
async def test_retry_resets_attempt_timing_before_new_attempt(app_context):
    gate = asyncio.Event()

    class FailingProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("stop")

    app_context.runner.provider = FailingProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(message="Retry timing.", matter_id="MAT-DEMO-BEACON"),
    )
    await app_context.chat_runs.wait(started["run_id"])
    app_context.vault.update_markdown(
        app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])["path"],
        metadata_updates={"started_at": "2000-01-01T00:00:00Z"},
    )

    class SlowProvider:
        async def complete(self, messages, tools=None):
            await gate.wait()
            return ProviderReply(content="Recovered.")

    app_context.runner.provider = SlowProvider()
    queued = app_context.chat_runs.retry("MAT-DEMO-BEACON", started["run_id"])
    assert queued["started_at"] is None
    await asyncio.sleep(0)
    running = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert running["state"] == "running"
    assert running["started_at"] not in {None, "2000-01-01T00:00:00Z"}
    gate.set()
    await app_context.chat_runs.wait(started["run_id"])


def test_partial_fallback_hides_internal_references_and_keeps_legal_analysis(app_context):
    partial = RunnerExecutionState(
        useful_content="run_id: RUN-private-only",
        trace=[ToolTrace(
            tool="save_work_product",
            status="success",
            summary=(
                "Saved the analysis at 03_Matters/private/drafts/advice.md under RUN-secret. "
                "The launch should wait until the notice is approved."
            ),
        )],
    )

    result = app_context.chat_runs._partial_result(partial)

    assert "The launch should wait until the notice is approved." in result.reply
    assert "03_Matters/private" not in result.reply
    assert "RUN-secret" not in result.reply


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
    assert failed["failure_class"] == "output_shape"
    assert failed["response"]["reply"] == "I prepared a useful draft."
    assert failed["response"]["trace"][0]["summary"] == "Saved the useful draft."


@pytest.mark.asyncio
async def test_partial_without_a_mutation_reconciles_a_false_decision_claim(app_context):
    class MalformedProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="I recorded the decision. Useful analysis remains.", tool_calls=[ProviderToolCall(
                    id="search", name="search_vault", arguments={"query": "launch"},
                )])
            return ProviderReply(content={"malformed": True})

    app_context.runner.provider = MalformedProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Assess launch.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert any(result["operation"] == "chat_turn" for result in failed["response"]["operation_results"])
    assert failed["response"]["reply"] == "Useful analysis remains.\n\nNo workspace change recorded."


@pytest.mark.asyncio
async def test_timeout_without_a_mutation_reconciles_a_false_decision_claim(app_context):
    class TimeoutProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            if tools is None:
                return ProviderReply(content="")
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="I recorded the decision. Useful analysis remains.", tool_calls=[ProviderToolCall(
                    id="search", name="search_vault", arguments={"query": "launch"},
                )])
            await asyncio.sleep(1)
            return ProviderReply(content="late")

    app_context.runner.provider = TimeoutProvider()
    app_context.chat_runs.timeout_seconds = 0.02
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Assess launch.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert any(result["operation"] == "chat_turn" for result in completed["response"]["operation_results"])
    assert completed["response"]["reply"] == "Useful analysis remains.\n\nNo workspace change recorded."


@pytest.mark.asyncio
async def test_timeout_without_useful_work_is_failed_and_retryable(app_context):
    class TimeoutProvider:
        async def complete(self, messages, tools=None):
            if tools is None:
                return ProviderReply(content="")
            await asyncio.sleep(1)
            return ProviderReply(content="late")

    app_context.runner.provider = TimeoutProvider()
    app_context.chat_runs.timeout_seconds = 0.02
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(message="Do unfinished work.", matter_id="MAT-DEMO-BEACON"),
    )
    await app_context.chat_runs.wait(started["run_id"])

    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert failed["finished_at"]
    assert failed["failure_detail"] == "The request reached its time limit."
    assert failed["failure_class"] == "timeout"
    assert "No tool work completed" in failed["response"]["reply"]


@pytest.mark.asyncio
async def test_unexpected_failure_is_terminal_when_conversation_lookup_fails(
    app_context, monkeypatch,
):
    async def fail_unexpectedly(*_args, **_kwargs):
        raise RuntimeError("unexpected runner failure")

    monkeypatch.setattr(app_context.runner, "run", fail_unexpectedly)
    monkeypatch.setattr(
        app_context.chat_history,
        "find_conversation_for_run",
        lambda *_args: (_ for _ in ()).throw(RuntimeError("history lookup failed")),
    )
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(message="Keep the run terminal.", matter_id="MAT-DEMO-BEACON"),
    )
    await app_context.chat_runs.wait(started["run_id"])

    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert failed["finished_at"]


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
async def test_agent_error_with_persisted_changed_path_does_not_claim_no_tool_work(app_context, monkeypatch):
    """A durable mutation remains evidence even if the runner loses its typed result."""
    partial = RunnerExecutionState(changed_paths=["03_Matters/beacon-instant-onboarding/drafts/advice.md"])

    async def fail_after_saved_work(*_args, **_kwargs):
        raise __import__("app.agents.runner", fromlist=["AgentExecutionError"]).AgentExecutionError(partial)

    monkeypatch.setattr(app_context.runner, "run", fail_after_saved_work)
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Draft the advice.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    failed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert failed["state"] == "failed"
    assert failed["finished_at"]
    assert failed["response"]["changed_paths"] == partial.changed_paths
    assert "No tool work completed" not in failed["response"]["reply"]
    assert not any(result["operation"] == "chat_turn" for result in failed["response"]["operation_results"])


@pytest.mark.asyncio
async def test_intake_recovery_can_continue_after_a_durable_answer_lost_its_assistant_turn(app_context):
    question = "Which countries are in scope?"
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON", None, role="assistant", content=question,
        conversation_kind="intake", intake_state="active", active_agent_id="intake-agent",
        cards=[{"type": "question", "question_id": "jurisdiction", "text": question, "selection_mode": "free_text"}],
    )
    app_context.chat_history.append(
        "MAT-DEMO-BEACON", conversation["conversation_id"], role="user", content="United States only",
        card_action={"card_id": "jurisdiction", "action": "answer", "values": ["United States only"]},
    )
    app_context.matter_records.record_intake_answers(
        "MAT-DEMO-BEACON",
        [{"question_id": "jurisdiction", "question": question, "answer": "United States only", "values": ["United States only"], "status": "answered", "record_target": "fact"}],
        source_id="MSG-JURISDICTION", source_action_key="chat:jurisdiction",
    )

    class RecoveryProvider:
        async def complete(self, _messages, tools=None):
            if tools is not None:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="next-question", name="update_matter_intake", arguments={
                        "working_ask": "Assess launch.",
                        "next_questions": [{"question_id": "launch-date", "text": "When is the launch?", "selection_mode": "free_text"}],
                        "intake_state": "active",
                    },
                )])
            return ProviderReply(content="One more question is needed.")

    app_context.runner.provider = RecoveryProvider()
    started = await recover_intake_question(
        "MAT-DEMO-BEACON",
        IntakeQuestionRecoveryRequest(conversation_id=conversation["conversation_id"]),
        app_context,
    )
    await app_context.chat_runs.wait(started.run_id)

    saved = app_context.chat_history.get("MAT-DEMO-BEACON", conversation["conversation_id"])
    questions = [card for card in saved["messages"][-1]["cards"] if card["type"] == "question"]
    assert [card["question_id"] for card in questions] == ["launch-date"]


@pytest.mark.asyncio
async def test_timeout_does_not_persist_internal_tool_limit_instruction(app_context, monkeypatch):
    async def execute(agent, context, tool_id, arguments):
        return ToolExecutionResult(
            tool_id,
            "success",
            "A partial research packet is saved; no public source was retrieved.",
            changed_paths=["research/partial.md"],
        )

    monkeypatch.setattr(app_context.tools, "execute", execute)

    class TimeoutProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            if tools is None:
                return ProviderReply(content="Do not mention the tool limit.")
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="research", name="run_research", arguments={"question": "Research this."},
                )])
            await asyncio.sleep(1)
            return ProviderReply(content="late")

    app_context.runner.provider = TimeoutProvider()
    app_context.chat_runs.timeout_seconds = 0.02
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON",
        ChatRequest(message="Redo the research.", matter_id="MAT-DEMO-BEACON"),
    )
    await app_context.chat_runs.wait(started["run_id"])

    completed = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    reply = completed["response"]["reply"]
    assert "Do not mention the tool limit" not in reply
    assert "A partial research packet is saved" in reply


@pytest.mark.asyncio
async def test_timeout_persists_failed_mutation_trace_on_assistant_message(app_context, monkeypatch):
    async def fail_create(agent, context, tool_id, arguments):
        return ToolExecutionResult(tool_id, "error", "The work item was not created.")

    monkeypatch.setattr(app_context.tools, "execute", fail_create)

    class TimeoutAfterClaimProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            if tools is None:
                return ProviderReply(content="")
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="I created the work item. The open issue still needs a legal owner.", tool_calls=[ProviderToolCall(
                    id="work", name="create_work_item", arguments={"title": "Launch checklist"},
                )])
            await asyncio.sleep(1)
            return ProviderReply(content="late")

    app_context.runner.provider = TimeoutAfterClaimProvider()
    app_context.chat_runs.timeout_seconds = 0.02
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Create launch work.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    run = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", run["conversation_id"])
    assistant = next(item for item in conversation["messages"] if item["role"] == "assistant")
    failed = next(item for item in run["response"]["trace"] if item["tool"] == "create_work_item")
    assert failed["mutation_status"] == "failed"
    assert assistant["trace"] == run["response"]["trace"]
    assert assistant["content"] == run["response"]["reply"]
    assert "created the work item" not in assistant["content"].lower()
    assert "The open issue still needs a legal owner." in assistant["content"]
    assert assistant["content"].endswith("No workspace change recorded.")


@pytest.mark.asyncio
async def test_agent_execution_error_persists_failed_mutation_trace_on_assistant_message(app_context, monkeypatch):
    async def fail_update(agent, context, tool_id, arguments):
        return ToolExecutionResult(tool_id, "error", "The intake was not updated.")

    monkeypatch.setattr(app_context.tools, "execute", fail_update)

    class ErrorAfterClaimProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="I updated the intake.", tool_calls=[ProviderToolCall(
                    id="intake", name="update_matter_intake", arguments={"working_ask": "Launch?"},
                )])
            return ProviderReply(content={"malformed": True})

    app_context.runner.provider = ErrorAfterClaimProvider()
    started = app_context.chat_runs.start(
        "MAT-DEMO-BEACON", ChatRequest(message="Update intake.", matter_id="MAT-DEMO-BEACON")
    )
    await app_context.chat_runs.wait(started["run_id"])

    run = app_context.chat_runs.get("MAT-DEMO-BEACON", started["run_id"])
    conversation = app_context.chat_history.get("MAT-DEMO-BEACON", run["conversation_id"])
    assistant = next(item for item in conversation["messages"] if item["role"] == "assistant")
    failed = next(item for item in run["response"]["trace"] if item["tool"] == "update_matter_intake")
    assert failed["mutation_status"] == "failed"
    assert assistant["trace"] == run["response"]["trace"]


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


def test_phrase_only_work_product_request_does_not_mutate_on_retry(app_context):
    payload = ChatRequest(
        message="Draft the work product.",
        matter_id="MAT-DEMO-BEACON",
        source_action_key="chat:RUN-1",
    )
    first = ChatResponse(reply="Useful first-pass advice.")
    retried = ChatResponse(reply="Useful first-pass advice.")
    saved = {"conversation_id": "CONV-1", "messages": []}

    _apply_matter_actions(app_context, payload, saved, first, run_id="RUN-1")
    _apply_matter_actions(app_context, payload, saved, retried, run_id="RUN-1")

    assert first.cards == []
    assert retried.cards == []
    folder = app_context.matter_paths.folder("MAT-DEMO-BEACON", "matter_files.draft_outputs_dir")
    assert len(list(app_context.vault.iter_files(folder, {".md"}))) == 0


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
                    id="scope", name="select_conversation_scope",
                    arguments={"scope": "actual", "instruction_quote": request_text},
                )])
            if len(self.calls) == 2:
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
    await app_context.wait_for_intake_starts()
    created = app_context.matters.get(created["matter_id"])
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


def test_run_status_reads_only_the_selected_run(app_context, monkeypatch):
    matter_id = "MAT-DEMO-BEACON"
    run_id = "RUN-status-path"
    base = app_context.matters.matter_path(matter_id)
    path = f"{base}/conversations/runs/{run_id}.md"
    app_context.vault.write_markdown(path, "", {"record_type": "chat_run", "matter_id": matter_id, "run_id": run_id, "state": "failed"})
    reads = []
    read = app_context.vault.read_markdown

    def record_read(path):
        reads.append(path)
        return read(path)

    def no_full_detail(*args, **kwargs):
        pytest.fail("Polling a run must not build the full matter tree or parse unrelated history.")

    monkeypatch.setattr(app_context.matters, "get", no_full_detail)
    monkeypatch.setattr(app_context.vault, "read_markdown", record_read)
    result = app_context.chat_runs.get(matter_id, run_id)
    assert result["path"] == path
    assert result["state"] == "failed"
    assert reads == [path]


def test_run_path_lookup_preserves_missing_foreign_and_traversal_errors(app_context):
    service = app_context.chat_runs
    with pytest.raises(KeyError, match="Matter not found"):
        service.get("MAT-MISSING", "RUN-status-path")
    with pytest.raises(KeyError, match="Chat run not found"):
        service.get("MAT-DEMO-BEACON", "RUN-missing")
    base = app_context.matters.matter_path("MAT-DEMO-BEACON")
    foreign = f"{base}/conversations/runs/RUN-foreign.md"
    app_context.vault.write_markdown(foreign, "", {"record_type": "chat_run", "matter_id": "MAT-OTHER"})
    with pytest.raises(KeyError, match="Chat run not found"):
        service.get("MAT-DEMO-BEACON", "RUN-foreign")
    with pytest.raises(ValueError):
        service.get("MAT-DEMO-BEACON", "../../../../../../outside")
