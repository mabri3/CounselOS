import pytest
from app.models.api import ChatRequest
from app.routers.chat import freeze_run_context
from app.services.experimental_chat import read_skill, validate_documents
from app.services.workspace import WorkspaceConflict
from app.providers.base import ProviderReply
from app.routers.experimental_chat import save_skill, SkillUpdate
from fastapi import HTTPException

MATTER = "MAT-DEMO-BEACON"


def test_guidance_is_opt_in_frozen_and_editable(app_context):
    ordinary = freeze_run_context(ChatRequest(matter_id=MATTER, message="Assess this"), app_context, "RUN-normal")
    assert "experimental_guidance" not in ordinary.frozen_context
    experimental = freeze_run_context(ChatRequest(matter_id=MATTER, message="Assess this", experimental_chat=True), app_context, "RUN-experiment")
    before = experimental.frozen_context["experimental_guidance"]["instructions"]
    skill = read_skill(app_context.vault, "dialogue")
    saved = save_skill("dialogue", SkillUpdate(content="Give a concise supported synthesis.", expected_revision=skill["revision"]), app_context)
    assert saved["revision"] != skill["revision"]
    assert experimental.frozen_context["experimental_guidance"]["instructions"] == before
    latest = freeze_run_context(ChatRequest(matter_id=MATTER, experimental_chat=True), app_context, "RUN-next")
    assert "Give a concise supported synthesis." in latest.frozen_context["experimental_guidance"]["instructions"]
    with pytest.raises(HTTPException) as error:
        save_skill("dialogue", SkillUpdate(content="Stale replacement", expected_revision=skill["revision"]), app_context)
    assert error.value.status_code == 409
    with pytest.raises(ValueError):
        read_skill(app_context.vault, "../company")


def test_selected_document_version_cannot_silently_change(app_context):
    document = app_context.workspace_review.documents(MATTER)[0]
    payload = ChatRequest(matter_id=MATTER, experimental_chat=True, context_selections=[{
        "reference_id": document["document_id"], "path": document["path"], "revision": document["revision"], "selected": True,
    }])
    validate_documents(payload, app_context)
    payload.context_selections[0]["revision"] = "older-version"
    with pytest.raises(WorkspaceConflict):
        validate_documents(payload, app_context)
    payload.context_selections[0]["path"] = "00_System/company.md"
    with pytest.raises(ValueError):
        validate_documents(payload, app_context)


@pytest.mark.asyncio
async def test_experimental_run_has_separate_history_and_guidance(app_context):
    observed = []
    class Provider:
        async def complete(self, messages, tools=None):
            observed.extend(messages)
            return ProviderReply(content="The first issue is permission. The supplied record needs review.")
    app_context.runner.provider = Provider()
    original = app_context.chat_history.append(MATTER, None, role="user", content="Original conversation")
    run = app_context.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, message="/audit", experimental_chat=True))
    await app_context.chat_runs.wait(run["run_id"])
    completed = app_context.chat_runs.get(MATTER, run["run_id"])
    assert completed["state"] == "completed", completed.get("failure_detail")
    history = app_context.chat_history.get(MATTER, run["conversation_id"])
    assert history["conversation_kind"] == "experimental"
    assert history["conversation_id"] != original["conversation_id"]
    assert len(app_context.chat_history.get(MATTER, original["conversation_id"])["messages"]) == 1
    assert any("junior associate" in message.get("content", "") for message in observed if message["role"] == "system")
    assert history["messages"][0]["workspace_submission"]["experimental_chat"] is True


@pytest.mark.asyncio
async def test_comment_answer_is_saved_beside_original_passage(app_context):
    from app.models.api import DocumentReviewAction
    from app.models.workspace import ConversationTarget
    draft = app_context.work_products.create_draft(MATTER, title="Review sample", content="Pilot scope only.")
    review = app_context.document_reviews.apply(draft["vault_path"], DocumentReviewAction(action="add_comment", quote="Pilot scope only.", body="Explain this scope.", author_id="lawyer", author_name="Lawyer"))
    thread_id = review["comments"][0]["thread_id"]
    original_content = app_context.vault.read_markdown(draft["vault_path"])["content"]
    class Provider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="The draft reflects the supplied pilot scope; a broader rollout is a separate alternative.")
    app_context.runner.provider = Provider()
    request = ChatRequest(matter_id=MATTER, message="Explain this comment.", experimental_chat=True, experimental_comment_id=thread_id,
        target=ConversationTarget(matter_id=MATTER, artifact_path=draft["vault_path"], artifact_revision=review["artifact_revision"], artifact_review_revision=review["revision"]))
    run = app_context.chat_runs.start(MATTER, request)
    await app_context.chat_runs.wait(run["run_id"])
    completed = app_context.chat_runs.get(MATTER, run["run_id"])
    assert completed["state"] == "completed", completed.get("failure_detail")
    saved = app_context.document_reviews.get(draft["vault_path"])
    assert saved["comments"][0]["entries"][-1]["author_id"] == "author-themis"
    assert "broader rollout" in saved["comments"][0]["entries"][-1]["body"]
    assert app_context.vault.read_markdown(draft["vault_path"])["content"] == original_content


def test_comment_changed_during_answer_keeps_reply_without_overwriting(app_context):
    from app.models.api import DocumentReviewAction, ChatResponse
    from app.models.workspace import ConversationTarget
    from app.services.experimental_chat import freeze_comment, answer_comment
    draft = app_context.work_products.create_draft(MATTER, title="Comment conflict", content="Pilot scope.")
    review = app_context.document_reviews.apply(draft["vault_path"], DocumentReviewAction(action="add_comment", quote="Pilot scope.", body="Explain.", author_id="lawyer", author_name="Lawyer"))
    thread_id = review["comments"][0]["thread_id"]
    request = ChatRequest(matter_id=MATTER, experimental_chat=True, experimental_comment_id=thread_id, target=ConversationTarget(matter_id=MATTER, artifact_path=draft["vault_path"]))
    frozen = freeze_comment(request, app_context)
    request.frozen_context = {"experimental_comment": frozen}
    app_context.document_reviews.apply(draft["vault_path"], DocumentReviewAction(action="reply_comment", thread_id=thread_id, body="New material question.", author_id="lawyer", author_name="Lawyer"))
    response = ChatResponse(reply="Useful answer to the earlier question.")
    answer_comment(request, app_context, response, "RUN-comment-conflict")
    assert response.reply.startswith("Useful answer") and "thread changed" in response.reply
    assert len(app_context.document_reviews.get(draft["vault_path"])["comments"][0]["entries"]) == 2


def test_optional_choices_preserve_answer_and_malformed_output():
    from app.models.api import ChatResponse
    from app.services.experimental_chat import extract_choices
    response = ChatResponse(reply='Supported analysis.\n```chat-choices\n{"question":"Which scope?","choices":["Pilot","All customers"]}\n```')
    extract_choices(response, "RUN-one")
    assert response.reply == "Supported analysis."
    assert [choice.value for choice in response.cards[0].choices] == ["Pilot", "All customers"]
    malformed = ChatResponse(reply='Useful answer.\n```chat-choices\n{"question": "Which scope?", "choices": "bad"}\n```')
    original = malformed.reply
    extract_choices(malformed, "RUN-two")
    assert malformed.reply == original and not malformed.cards


def test_chat_model_override_is_scoped_and_resolved(app_context, monkeypatch):
    from app.services.experimental_chat import resolve_chat_provider
    from app.models.api import ChatModelSelection
    selected = ChatModelSelection(provider="codex", model="example-model", reasoning_effort="high")
    observed = []
    monkeypatch.setattr(app_context.provider_router, "resolve_selection", lambda selection: observed.append(selection) or selection)
    request = ChatRequest(experimental_chat=True, model_selection=selected)
    resolved = resolve_chat_provider(request, app_context)
    assert (resolved.provider, resolved.model, resolved.reasoning_effort) == ("codex", "example-model", "high")
    assert resolved.agent_id == request.agent_id
    assert request.model_dump()["model_selection"]["model"] == "example-model"
    with pytest.raises(ValueError, match="only available"):
        resolve_chat_provider(request.model_copy(update={"experimental_chat": False}), app_context)
    assert len(observed) == 1


@pytest.mark.asyncio
async def test_chat_run_freezes_explicit_model_selection(app_context):
    from app.models.api import ChatModelSelection
    request = ChatRequest(matter_id=MATTER, message="Summarize", experimental_chat=True,
                          model_selection=ChatModelSelection(provider="mock", model="mock", reasoning_effort="default"))
    run = app_context.chat_runs.start(MATTER, request)
    assert run["selection"]["provider"] == "mock"
    assert run["selection"]["model"] == "mock"
    assert run["selection"]["reasoning_effort"] == "default"
    await app_context.chat_runs.wait(run["run_id"])


@pytest.mark.asyncio
async def test_experimental_intake_continues_after_answer(app_context):
    from app.providers.base import ProviderToolCall
    from app.models.api import CardAction
    class Provider:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": "actual", "instruction_quote": "Start intake."})])
            if self.calls == 2:
                return ProviderReply(tool_calls=[ProviderToolCall(id="intake-question", name="update_matter_intake", arguments={
                    "working_ask": "Review the proposed launch.", "intake_state": "active",
                    "next_questions": [{"question_id": "alerts-reviewed", "text": "Have the alerts been reviewed?", "selection_mode": "single", "choices": [{"value": "no", "label": "Not reviewed yet"}, {"value": "yes", "label": "Reviewed"}]}],
                })])
            return ProviderReply(content="Recorded.")
    app_context.runner.provider = Provider()
    first = app_context.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, experimental_chat=True, experimental_intake=True, message="Start intake."))
    await app_context.chat_runs.wait(first["run_id"])
    saved = app_context.chat_history.get(MATTER, first["conversation_id"])
    assert saved["conversation_kind"] == "experimental"
    assert saved["intake_state"] == "active"
    assert first["selection"]["agent_id"] == "intake-agent"
    assert any(c.get("question_id") == "alerts-reviewed" for c in saved["messages"][-1].get("cards", [])), app_context.chat_runs.get(MATTER, first["run_id"])["response"]
    second = app_context.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, experimental_chat=True, conversation_id=first["conversation_id"], message="Not reviewed yet", card_action=CardAction(card_id="alerts-reviewed", action="answer", values=["no"])))
    assert second["selection"]["agent_id"] == "intake-agent"
    await app_context.chat_runs.wait(second["run_id"])
    result = app_context.chat_runs.get(MATTER, second["run_id"])
    assert result["state"] == "completed", result.get("failure_detail")
    assert any(card["type"] == "question" for card in result["response"]["cards"]) or app_context.matter_records.get(MATTER)["intake_state"] == "complete"
    record = app_context.matter_records.get(MATTER)
    assert "Not reviewed yet" in str(record["intake_answers"])


@pytest.mark.asyncio
async def test_grouped_intake_submits_once_and_keeps_unknowns(app_context):
    from app.models.api import CardAction, CardAnswer
    from app.providers.base import ProviderToolCall
    questions = [{"question_id": f"group-{i}", "text": f"Scope detail {i}?", "reason": "Could change research scope.", "priority": "could_change_answer", "selection_mode": "single", "choices": [{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]} for i in range(8)]
    class Provider:
        calls = 0
        last_messages = []
        async def complete(self, messages, tools=None):
            self.calls += 1
            self.last_messages = messages
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": "actual", "instruction_quote": "Start intake."})])
            if self.calls == 2:
                schema = next(t["function"]["parameters"] for t in tools if t["function"]["name"] == "update_matter_intake")
                assert "maxItems" not in schema["properties"]["next_questions"]
                return ProviderReply(tool_calls=[ProviderToolCall(id="intake", name="update_matter_intake", arguments={"working_ask": "Explore the pilot.", "intake_state": "active", "next_questions": questions, "assumptions": ["The pilot stays limited."]})])
            if self.calls == 3:
                return ProviderReply(content="Answer what you know; leave the rest open.")
            return ProviderReply(content="## Initial issue map\n\nCustomer commitments could affect scope. Authority still needs research.\n\n## Assumptions used\n\n- The pilot stays limited. A broader audience would change the analysis.")
    provider = Provider()
    app_context.runner.provider = provider
    first = app_context.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, experimental_chat=True, experimental_intake=True, message="Start intake."))
    await app_context.chat_runs.wait(first["run_id"])
    saved = app_context.chat_history.get(MATTER, first["conversation_id"])
    assert len([c for c in saved["messages"][-1]["cards"] if c["type"] == "question"]) == 8
    answers = [CardAnswer(card_id="group-0", action="answer", values=["yes"]), CardAnswer(card_id="group-1", action="answer", free_text="Employee pilot only.")]
    answers += [CardAnswer(card_id=f"group-{i}", action="skip") for i in range(2, 8)]
    request = ChatRequest(matter_id=MATTER, experimental_chat=True, experimental_explore=True, conversation_id=first["conversation_id"], message="Analyze these answers. Leave gaps unknown.", card_action=CardAction(card_id="group-0", action="answer_set", answers=answers), source_action_key="group-submit")
    second = app_context.chat_runs.start(MATTER, request)
    assert second["selection"]["agent_id"] == "counsel-copilot"
    await app_context.chat_runs.wait(second["run_id"])
    result = app_context.chat_runs.get(MATTER, second["run_id"])
    assert result["state"] == "completed", result.get("failure_detail")
    assert provider.calls == 4
    assert "Assumptions used" in result["response"]["reply"]
    assert all(text in str(provider.last_messages) for text in ["Employee pilot only.", "Scope detail 0?", "Skipped", "Leave gaps unknown"])
    record = app_context.matter_records.get(MATTER)
    answers = {a["question_id"]: a for a in record["intake_answers"]}
    assert answers["group-0"]["answer"] == "Yes"
    assert answers["group-1"]["answer"] == "Employee pilot only."
    assert all(answers[f"group-{i}"]["status"] == "skipped" for i in range(2, 8))
    assert all("Scope detail 2?" not in f["text"] and f["text"] != "The pilot stays limited." for f in record["facts"])
    assert any(a["text"] == "The pilot stays limited." for a in record["assumptions"])
    assert app_context.chat_history.get(MATTER, first["conversation_id"])["intake_state"] == "complete"
    assert app_context.chat_runs.start(MATTER, request)["run_id"] == second["run_id"]
    assert provider.calls == 4


def test_experimental_schema_leaves_shared_tool_unchanged(app_context):
    from copy import deepcopy
    from app.services.experimental_chat import intake_tools
    tools = app_context.tools.provider_tools(app_context.agents.get("intake-agent"))
    original = deepcopy(tools)
    extended = intake_tools(tools)
    assert tools == original
    question_schema = next(t for t in extended if t["function"]["name"] == "update_matter_intake")["function"]["parameters"]["properties"]["next_questions"]
    assert "priority" in question_schema["items"]["properties"] and "maxItems" not in question_schema


def test_experimental_map_keeps_assumptions_and_invitation_separate():
    from app.agents.output import clean_user_facing_reply, clean_conversation_for_display
    text = "## Initial issue map\n\n- A relevant issue.\n\nA fact remains unknown.\n\n## Assumptions used\n\n- A limited pilot.\n\nWhich issue would you like to explore?"
    assert clean_user_facing_reply(text, preserve_paragraphs=True) == text
    saved = {"conversation_kind": "experimental", "messages": [{"role": "assistant", "content": text}]}
    assert clean_conversation_for_display(saved)["messages"][0]["content"] == text
