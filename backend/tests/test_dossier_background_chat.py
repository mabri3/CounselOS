"""Dossier deadlines and concurrent questions, using isolated fixture records."""
import asyncio
from dataclasses import replace

import pytest

from app.config import Settings
from app.models.api import ChatRequest, ChatRun
from app.providers.base import ProviderReply, ProviderSelection
from app.services.dossier_generation import generate_dossier

MATTER = "MAT-DEMO-BEACON"


@pytest.mark.asyncio
async def test_dossier_can_finish_after_the_normal_model_deadline(app_context):
    app = app_context
    app.settings.llm_timeout_seconds = 0.001
    app.settings.dossier_timeout_seconds = 0.5

    class Writer:
        async def complete(self, messages, tools=None):
            await asyncio.sleep(0.02)
            return ProviderReply(content="# Finished dossier\n\nUseful analysis.")

    app.runner.provider = Writer()
    result = await generate_dossier(app, MATTER, save=False)
    assert result["content"].startswith("# Finished dossier")
    assert not any("did not complete" in warning for warning in result["warnings"])
    assert Settings(_env_file=None).dossier_timeout_seconds == 300


@pytest.mark.asyncio
async def test_question_finishes_while_dossier_is_running_and_both_replies_survive(app_context):
    app = app_context
    entered, release = asyncio.Event(), asyncio.Event()

    class Provider:
        async def complete(self, messages, tools=None):
            if any("Dossier-generation action." in str(message.get("content")) for message in messages):
                entered.set()
                await release.wait()
                return ProviderReply(content="# Background dossier\n\nUseful saved analysis.")
            return ProviderReply(content="The question can be answered while the dossier is running.")

    app.runner.provider = Provider()
    dossier = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER,
        message="Generate dossier, chat only.", experimental_chat=True))
    assert ChatRun.model_validate(dossier).background
    await asyncio.wait_for(entered.wait(), 2)
    try:
        question = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER,
            conversation_id=dossier["conversation_id"], message="What remains open?", experimental_chat=True))
        assert not ChatRun.model_validate(question).background
        await asyncio.wait_for(app.chat_runs.wait(question["run_id"]), 2)
        assert app.chat_runs.get(MATTER, question["run_id"])["state"] == "completed"
        assert app.chat_runs.get(MATTER, dossier["run_id"])["state"] == "running"
    finally:
        release.set()
        await app.chat_runs.wait(dossier["run_id"])
    messages = app.chat_history.get(MATTER, dossier["conversation_id"])["messages"]
    assert any("The question can be answered" in message["content"] for message in messages)
    assert any("# Background dossier" in message["content"] for message in messages)


@pytest.mark.asyncio
async def test_timed_out_preview_is_failed_with_retained_text(app_context):
    app = app_context
    app.settings.dossier_timeout_seconds = 0.01

    class Blocked:
        async def complete(self, messages, tools=None):
            await asyncio.Event().wait()

    app.runner.provider = Blocked()
    before = app.dossiers.get(MATTER)
    run = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER,
        message="Generate dossier, chat only.", experimental_chat=True))
    await app.chat_runs.wait(run["run_id"])
    saved = app.chat_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "failed"
    assert saved["failure_class"] == "timeout"
    assert saved["response"]["reply"].startswith("Dossier generation did not finish.")
    assert "Dossier preview generated" not in saved["response"]["reply"]
    assert saved["response"]["trace"][0]["status"] == "error"
    assert app.dossiers.get(MATTER) == before


@pytest.mark.asyncio
async def test_dossier_connection_uses_its_deadline_and_closes_only_itself(app_context, monkeypatch):
    app = app_context
    created = []

    class Transport:
        closed = False
        def close(self):
            self.closed = True

    foreground = Transport()
    def build(settings):
        assert settings.llm_timeout_seconds == 300
        assert settings.llm_model == "selected-model"
        assert settings.llm_reasoning_effort == "medium"
        transport = Transport()
        created.append(transport)
        return transport

    monkeypatch.setattr("app.providers.factory.build_provider", build)
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=foreground,
        selection=ProviderSelection("counsel-copilot", "codex", "selected-model", "medium"))
    async with app.provider_router.isolated(resolved, timeout_seconds=300) as background:
        assert background is not foreground
        assert not background.closed
    assert created[0].closed
    assert not foreground.closed


def test_new_action_lookup_does_not_parse_unrelated_historical_runs(app_context, monkeypatch):
    app = app_context
    root = app.matters.matter_path(MATTER) + "/conversations/runs"
    app.vault.write_markdown(root + "/RUN-old.md", "Old run", {
        "record_type": "chat_run", "matter_id": MATTER,
        "request": {"source_action_key": "old-action"}, "large_trace": "history " * 10000})
    original = app.vault.read_markdown
    def read(path):
        assert str(path) != root + "/RUN-old.md", "An unrelated run was decoded during submission."
        return original(path)
    monkeypatch.setattr(app.vault, "read_markdown", read)
    assert app.chat_runs.find_by_action_key(MATTER, "experimental:new-action") is None


@pytest.mark.asyncio
async def test_start_does_not_build_the_matter_document_tree(app_context, monkeypatch):
    app = app_context
    original = app.matters.get
    monkeypatch.setattr(app.matters, "get", lambda *_: pytest.fail("Submission must not build a UI document tree"))
    run = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER,
        message="Generate dossier, chat only.", experimental_chat=True))
    monkeypatch.setattr(app.matters, "get", original)
    await app.chat_runs.wait(run["run_id"])
    assert app.chat_runs.get(MATTER, run["run_id"])["state"] == "completed"


def test_document_discovery_does_not_decode_conversation_run_archives(app_context, monkeypatch):
    app = app_context
    root = app.matters.matter_path(MATTER)
    archive = root + "/conversations/runs/RUN-archived.md"
    app.vault.write_markdown(archive, "# Audit only", {"record_type": "chat_run", "trace": ["old result"]})
    original = app.vault.read_markdown
    def read(path, **kwargs):
        assert str(path) != archive, "Document discovery must not decode old chat runs."
        return original(path, **kwargs)
    monkeypatch.setattr(app.vault, "read_markdown", read)
    app.workspace_evidence.library(MATTER)
    app.workspace._output_revisions(MATTER)
    app.workspace_review.claims(MATTER)
    detail = app.matters.get(MATTER)
    assert detail["matter_id"] == MATTER


def test_explicit_context_paths_do_not_require_full_library_discovery(app_context, monkeypatch):
    from app.routers.chat import freeze_run_context
    app = app_context
    monkeypatch.setattr(app.workspace_evidence, "library", lambda *_: pytest.fail("No ID lookup is needed"))
    frozen = freeze_run_context(ChatRequest(matter_id=MATTER, message="Generate dossier, chat only.",
        context_selections=[]), app, "RUN-no-library")
    assert frozen.frozen_context["manifest"]


def test_display_omits_frozen_inputs_without_changing_saved_context():
    from app.agents.output import clean_conversation_for_display
    source = {"messages": [{"role": "user", "content": "Generate dossier.",
        "workspace_submission": {"frozen_context": {"snapshot": "prior dossier " * 1000},
            "context_selections": [{"path": "03_Matters/example/dossier.md", "revision": "saved"}]}}]}
    displayed = clean_conversation_for_display(source)
    assert "frozen_context" not in displayed["messages"][0]["workspace_submission"]
    assert source["messages"][0]["workspace_submission"]["frozen_context"]
    assert displayed["messages"][0]["workspace_submission"]["context_selections"] == source["messages"][0]["workspace_submission"]["context_selections"]


@pytest.mark.asyncio
@pytest.mark.parametrize("explicit_target", [False, True])
async def test_read_only_question_on_an_alternative_does_not_block_dossier_save(app_context, explicit_target):
    from app.models.workspace import ConversationTarget
    app = app_context
    app.solution_paths.ensure_baseline(MATTER)
    alternative = app.workspace_scenarios.save(MATTER, {"title": "Bank option", "analysis": "Keep this saved analysis."})
    path = app.workspace_scenarios._path(MATTER, alternative["scenario_id"])
    before = app.vault.read_text(path)
    target = ConversationTarget(matter_id=MATTER, scenario_id=alternative["scenario_id"])
    entered, release = asyncio.Event(), asyncio.Event()

    class Provider:
        async def complete(self, messages, tools=None):
            if any("Dossier-generation action." in str(message.get("content")) for message in messages):
                entered.set()
                await release.wait()
                return ProviderReply(content="# Updated dossier\n\nUseful current analysis.")
            return ProviderReply(content="This is a read-only answer from the saved facts.")

    app.runner.provider = Provider()
    dossier = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, target=target,
        message="Generate dossier using saved material only.", experimental_chat=True))
    await asyncio.wait_for(entered.wait(), 3)
    conversation = app.chat_history.get(MATTER, dossier["conversation_id"])
    app.vault.update_markdown(conversation["path"], metadata_updates={"working_path_id": alternative["scenario_id"]})
    try:
        question = app.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER,
            conversation_id=dossier["conversation_id"], target=target if explicit_target else None,
            message="Which structure is in the saved record? Do not change any records.", experimental_chat=True))
        await asyncio.wait_for(app.chat_runs.wait(question["run_id"]), 3)
        assert app.chat_runs.get(MATTER, dossier["run_id"])["state"] == "running"
    finally:
        release.set()
        await app.chat_runs.wait(dossier["run_id"])
    assert app.vault.read_text(path) == before
    result = app.chat_runs.get(MATTER, dossier["run_id"])
    operation = next(item for item in result["response"]["operation_results"] if item["operation"] == "generate_dossier")
    assert operation["status"] == "changed", operation
    assert app.dossiers.get(MATTER)["content"].startswith("# Updated dossier")
