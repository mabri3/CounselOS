import json
from dataclasses import replace

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import ChatRequest, ChatResponse
from app.models.workspace import ConversationTarget
from app.services.dossier import DossierService
from app.providers.base import ProviderReply
from app.routers import chat, experimental_chat, matters, skills
from app.services.dossier_generation import generate_dossier, generate_pending, generation_owner, preview_only, requested
from app.services.dossier_generation_context import capture, normalize_headings, retain_issues

MATTER = "MAT-DEMO-BEACON"


class Writer:
    def __init__(self):
        self.calls = []

    async def complete(self, messages, tools=None):
        assert not tools
        self.calls.append(messages)
        data = next(m["content"] for m in messages if str(m.get("content", "")).startswith("Saved dossier input"))
        data = json.loads(data.split("\n", 1)[1])
        return ProviderReply(content="# Written dossier\n\n## Current position\n\nThe current matter needs a decision, not more intake.\n\n## Decision question\n\n" + data["question"] + "\n\n## Issues\n\n" + "\n\n".join("### " + i["title"] + "\n\nCurrent answer: Retain this issue in the matter." for i in data["issues"]))


@pytest.mark.asyncio
@pytest.mark.parametrize("message", ["Generate a dossier for this matter.", "Genrate a dossier", "/dossier-generation", "Could you please refresh the dossier?"])
async def test_actual_chat_returns_saved_research_setup_without_publishing_legal_records(app_context, monkeypatch, message):
    app = app_context
    writer = Writer()
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=writer)
    monkeypatch.setattr(app.runner, "resolve", lambda *_: resolved)
    root = app.matters.matter_path(MATTER)
    before = {name: app.vault.read_text(root + "/" + name) for name in ("facts.md", "issues.md", "recommendations.md")}
    dossier_before = app.dossiers.get(MATTER)
    response = await chat.execute_chat(ChatRequest(matter_id=MATTER, message=message, experimental_chat=True), app)
    assert len(writer.calls) == 1
    assert response.reply.startswith("# Written dossier")
    assert "Current answer: Retain this issue" in response.reply
    assert any(s.skill_id == "dossier-generation" for s in response.applied_skills)
    card = next(card for card in response.cards if card.type == "dossier_research")
    assert card.presentation == "setup"
    assert card.status["state"] == "awaiting_choices"
    assert app.dossier_requests.get(MATTER, card.request_id)["request_id"] == card.request_id
    assert app.research_runs.managed_children(MATTER, card.request_id) == []
    assert app.dossiers.get(MATTER) == dossier_before
    assert all(app.vault.read_text(root + "/" + name) == text for name, text in before.items())
    saved = app.chat_history.get(MATTER, response.conversation_id)
    assert saved["messages"][-1]["content"] == response.reply
    assert saved["messages"][-1]["cards"][0]["request_id"] == card.request_id
    assert not app.vault.resolve(root + "/conversations/inquiries").exists()


@pytest.mark.asyncio
async def test_durable_chat_saves_submitted_skill_and_setup_card_on_reload(app_context, monkeypatch):
    app = app_context
    writer = Writer()
    app.runner.provider = writer
    app.skills.update("dossier-generation", instructions="Write the entire dossier. Use the frozen-style marker.")
    run = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, message="Generate dossier", experimental_chat=True))
    app.skills.update("dossier-generation", instructions="Use the later-style marker.")
    await app.chat_runs.wait(run["run_id"])
    result = app.chat_runs.get(MATTER, run["run_id"])
    assert result["state"] == "completed", result.get("failure_detail")
    assert len(writer.calls) == 1
    assert result["response"]["reply"].startswith("# Written dossier")
    card = result["response"]["cards"][0]
    assert card["type"] == "dossier_research"
    record = app.dossier_requests.get_record(MATTER, card["request_id"])
    assert "frozen-style" in record["metadata"]["skill_snapshot"]["instructions"]
    assert "later-style" not in record["metadata"]["skill_snapshot"]["instructions"]
    saved = app.chat_history.get(MATTER, result["conversation_id"])
    assert saved["messages"][-1]["cards"] == result["response"]["cards"]


def test_http_automatic_update_uses_skill_but_reading_does_not_generate(app_context):
    app = app_context
    app.dossiers.propose_update(MATTER, "# Existing dossier\n\n## Decision question\n\nCan the pilot proceed?\n", expected_hash=app.dossiers.content_hash(MATTER))
    writer = Writer()
    app.runner.provider = writer
    api = FastAPI()
    api.state.context = app
    for router in (chat.router, experimental_chat.router, skills.router, matters.router):
        api.include_router(router, prefix="/api")
    ready_when_sent = []
    async def observed_api(scope, receive, send):
        async def observe(message):
            if message["type"] == "http.response.start" and scope.get("method") == "POST":
                ready_when_sent.append((app.dossiers.get(MATTER) or {}).get("content", "").startswith("# Written dossier"))
            await send(message)
        await api(scope, receive, observe)
    with TestClient(observed_api) as client:
        assert client.get("/api/experimental-chat/skills").status_code == 200
        before = len(writer.calls)
        app.skills.update("dossier-generation", instructions="Use the automatic-style marker and write a complete dossier.")
        response = client.post("/api/matters/" + MATTER + "/work-items", json={"matter_id": MATTER, "title": "Get the signed terms", "type": "counsel_review", "required": True})
        assert response.status_code < 300, response.text
        assert len(writer.calls) == before + 1, (response.json(), app.dossiers.generation_pending)
        assert "automatic-style" in str(writer.calls[-1])
        assert app.dossiers.get(MATTER)["content"].startswith("# Written dossier")
        assert ready_when_sent == [True], "The client must not refresh before generation finishes"
        for _ in range(2):
            assert client.get("/api/matters/" + MATTER).status_code == 200
        assert len(writer.calls) == before + 1


@pytest.mark.parametrize("message", ["Would an editable dossier skill help?", "Do not generate a dossier.", "Explain how to generate a dossier.", "Update the dossier generation skill.", "Read the dossier", "Rate the dossier", "Do not genrate a dossier", "Genrate a dossier generation skill", "Created a dossier yesterday", "Wrote a dossier", "Updated the dossier"])
def test_discussion_or_skill_edits_are_not_generation_commands(message):
    assert not requested(ChatRequest(message=message))


@pytest.mark.parametrize("message", ["Please udpate the dossier", "Can you generat the full dossier?", "Draftt a dossier"])
def test_small_command_typos_still_select_the_shared_writer(message):
    assert requested(ChatRequest(message=message))


@pytest.mark.asyncio
async def test_misspelled_durable_request_on_hypothetical_path_stays_a_preview(app_context):
    app = app_context
    app.dossiers.propose_update(MATTER, "# Saved dossier\n\n## Decision question\n\nCan the pilot proceed?", expected_hash=None, generated=True)
    baseline = app.solution_paths.ensure_baseline(MATTER)
    alternative = app.solution_paths.explore(MATTER, parent_path_id=baseline["scenario_id"],
        parent_revision=baseline["revision"], title="Bank-held funds", source_action_key="dossier-preview-path")
    root = app.matters.matter_path(MATTER)
    before = {name: app.vault.read_text(root + "/" + name) for name in ("dossier.md", "facts.md", "issues.md", "recommendations.md")}
    direction = app.solution_paths.state(MATTER)
    writer = Writer()
    app.runner.provider = writer
    run = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, message="Genrate a dossier",
        experimental_chat=True, target=ConversationTarget(matter_id=MATTER, scenario_id=alternative["scenario_id"])))
    await app.chat_runs.wait(run["run_id"])
    saved = app.chat_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed", saved.get("failure_detail")
    assert len(writer.calls) == 1
    response = saved["response"]
    assert response["reply"].startswith("# Written dossier")
    assert "Dossier preview generated" in response["reply"]
    assert {skill["skill_id"] for skill in response["applied_skills"]} >= {"dossier-generation"}
    assert app.solution_paths.state(MATTER) == direction
    assert all(app.vault.read_text(root + "/" + name) == text for name, text in before.items())


@pytest.mark.parametrize("message", ["Generate dossier without saving.", "Generate dossier, chat only.", "Generate dossier assuming the customer consents."])
def test_readonly_and_hypothetical_generation_is_preview(message):
    assert requested(ChatRequest(message=message))
    assert preview_only(ChatRequest(message=message))


@pytest.mark.asyncio
async def test_preview_does_not_consume_pending_work_or_use_repairing_matter_getter(app_context, monkeypatch):
    app = app_context
    app.dossiers.propose_update(MATTER, "# Saved dossier", expected_hash=None)
    pending = dict(app.dossiers.generation_pending)
    monkeypatch.setattr(app.matters, "get", lambda *_: pytest.fail("Preview must not call the repairing UI getter"))
    result = await generate_dossier(app, MATTER, save=False)
    assert result["content"]
    assert app.dossiers.generation_pending == pending


@pytest.mark.asyncio
@pytest.mark.parametrize("unavailable", ["missing", "disabled"])
async def test_unavailable_skill_keeps_the_saved_answer(app_context, monkeypatch, unavailable):
    app = app_context
    skill = app.skills.get("dossier-generation")
    if unavailable == "missing":
        original = app.skills.get
        def get(name):
            if name == "dossier-generation":
                raise KeyError(name)
            return original(name)
        monkeypatch.setattr(app.skills, "get", get)
    else:
        app.vault.update_markdown(skill.path, metadata_updates={"enabled": False})
    writer = Writer()
    app.runner.provider = writer
    result = await generate_dossier(app, MATTER)
    assert result["state"] == "failed" and result["content"].strip()
    assert not writer.calls


@pytest.mark.asyncio
async def test_dossier_inputs_are_never_dropped_as_old_conversation(app_context):
    app = app_context
    writer = Writer()
    app.runner.provider = writer
    captured = capture(app, MATTER)
    captured["data"]["submitted_context"] = "required facts " * 10000
    app.settings.model_dispatch_max_bytes = 10000
    result = await generate_dossier(app, MATTER, save=False, frozen_context={"dossier_inputs": captured})
    assert result["state"] == "failed" and result["content"].strip()
    assert not writer.calls
    assert "size limit" in str(result["warnings"])


@pytest.mark.asyncio
async def test_checkpoint_failure_does_not_replace_new_text_with_old_fallback(app_context):
    app_context.runner.provider = Writer()
    def fail(_state):
        raise OSError("Synthetic checkpoint failure")
    result = await generate_dossier(app_context, MATTER, checkpoint=fail)
    assert result["state"] == "applied"
    assert result["content"].startswith("# Written dossier")
    assert "checkpoint" in str(result["warnings"])


@pytest.mark.asyncio
async def test_restricted_flush_cannot_consume_another_operations_marker(app_context):
    app = app_context
    writer = Writer()
    app.runner.provider = writer
    token = generation_owner.set("other-operation")
    try:
        app.dossiers.propose_update(MATTER, "# Saved dossier", expected_hash=None)
    finally:
        generation_owner.reset(token)
    pending = dict(app.dossiers.generation_pending)
    assert await generate_pending(app) == []
    assert await generate_pending(app, owner="readonly-operation", allowed=False) == []
    assert app.dossiers.generation_pending == pending
    results = await generate_pending(app, owner="other-operation", allowed=False)
    assert results[0]["state"] == "skipped"
    assert not writer.calls


def test_retained_issue_excludes_stale_tail_and_overview_mentions_do_not_count():
    previous = "# Dossier\n\n<!-- issue:ISS-1 -->\n### Privacy\n\nKeep this useful answer.\n\n#### Detail\nRetain this too.\n\n## Next actions\nOld obsolete task.\n\n## Earlier position\nOld contradiction."
    snapshot = {"data": {"issues": [{"issue_id": "ISS-1", "title": "Privacy"}], "prior_dossier": previous}}
    content, count = retain_issues("# Current dossier\n\nPrivacy is important.", snapshot)
    assert count == 1 and "Keep this useful answer." in content and "Retain this too." in content
    assert "Old obsolete task" not in content and "Old contradiction" not in content


@pytest.mark.asyncio
@pytest.mark.parametrize("restricted", [False, True])
async def test_automatic_chat_uses_submitted_skill_and_scope(app_context, monkeypatch, restricted):
    app = app_context
    writer = Writer()
    app.runner.provider = writer
    app.skills.update("dossier-generation", instructions="Use the submitted-style marker.")

    async def saved_update(payload, context, **kwargs):
        if restricted:
            payload.frozen_context["excluded_paths"] = [context.matters.matter_path(MATTER) + "/facts.md"]
        context.dossiers.propose_update(MATTER, "# Saved orientation", expected_hash=None)
        return ChatResponse(reply="The permitted work was saved.")

    monkeypatch.setattr(chat, "execute_chat", saved_update)
    run = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, message="Record the agreed next step."))
    app.skills.update("dossier-generation", instructions="Use the later-style marker.")
    await app.chat_runs.wait(run["run_id"])
    result = app.chat_runs.get(MATTER, run["run_id"])
    assert result["state"] == "completed", result.get("failure_detail")
    assert result["response"]["reply"] == "The permitted work was saved."
    assert len(writer.calls) == (0 if restricted else 1)
    if not restricted:
        assert "submitted-style" in str(writer.calls) and "later-style" not in str(writer.calls)
        assert result["dossier_generation"][0]["content"].startswith("# Written dossier")


@pytest.mark.asyncio
async def test_failed_publication_keeps_new_text_in_recovery_record(app_context, monkeypatch):
    import app.services.dossier_generation as generation
    app_context.runner.provider = Writer()
    def fail(*_args, **_kwargs):
        raise OSError("Synthetic publication failure")
    monkeypatch.setattr(generation, "_commit", fail)
    result = await generate_dossier(app_context, MATTER)
    assert result["state"] == "failed" and result["content"].startswith("# Written dossier")
    root = app_context.matters.matter_path(MATTER)
    events = [app_context.vault.read_markdown(app_context.vault.relative(p)) for p in app_context.vault.iter_files(root + "/events", {".md"})]
    recovered = [json.loads(event["content"].split("```json\n", 1)[1].split("\n```", 1)[0])
                 for event in events if event["metadata"].get("event_type") == "dossier_generation_unsaved"]
    assert any(event.get("dossier_text") == result["content"] for event in recovered)


@pytest.mark.asyncio
async def test_bold_record_headings_do_not_duplicate_the_question_or_restore_old_summary(app_context):
    app = app_context
    question = "Can the pilot proceed?"
    app.dossiers.propose_update(MATTER, "# Old dossier\n\n## Matter summary\n\nOld summary.\n\n## Decision question\n\n" + question, expected_hash=None, generated=True)
    class BoldWriter:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="# New dossier\n\n**Current position**\n\nNew useful summary.\n\n**Decision question**\n\n" + question + "\n\n## Issues\n\nReview the saved issues.")
    app.runner.provider = BoldWriter()
    result = await generate_dossier(app, MATTER)
    assert result["state"] == "applied"
    assert result["content"].count(question) == 1
    assert "Old summary." not in result["content"]
    assert app.dossiers.orientation(MATTER)["summary"] == "New useful summary."


def test_heading_normalization_preserves_code_and_other_bold_text():
    text = "**Current position**\nText.\n```md\n**Decision question**\n```\n**Current answer**\nKeep this label."
    normalized = normalize_headings(text)
    assert normalized.startswith("## Current position")
    assert "```md\n**Decision question**\n```" in normalized
    assert "**Current answer**" in normalized


def test_heading_normalization_keeps_embedded_research_and_history_out_of_scope():
    embedded = "**Decision question**\n\nA research question, not the saved scope.\n\n**Open questions**\n\n- Research follow-up."
    text = ("# Dossier\n\n**Current position**\n\nCurrent answer.\n\n"
            "## Options or working recommendation\n\n" + embedded +
            "\n\n## Next counsel action\n\nReview the sources.\n\n"
            "<details>\n<summary>Earlier position</summary>\n\n" + embedded + "\n\n</details>")
    normalized = normalize_headings(text)
    assert normalized.startswith("# Dossier\n\n## Current position")
    assert normalized.count(embedded) == 2
    assert DossierService.section(normalized, "Decision question") == ""
    assert DossierService.list_section(normalized, "Open questions") == []
