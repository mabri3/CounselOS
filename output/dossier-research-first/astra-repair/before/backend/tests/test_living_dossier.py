import pytest

from app.models.api import ChatRequest, WorkItemCreate
from app.providers.base import ProviderReply, ProviderToolCall
from app.services.recommendations import RecommendationService

MATTER = "MAT-DEMO-BEACON"


def recommendations(context):
    return RecommendationService(context.vault, context.matters)


@pytest.mark.asyncio
async def test_chat_saves_working_view_while_dossier_is_selected(app_context):
    from app.models.workspace import ConversationTarget

    synthesis = "### Working theory\nUse a limited pilot.\n\n### Alternative\nDelay the full launch until retention is settled."
    class Provider:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            assert "Living matter synthesis" in str(messages)
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": "actual", "instruction_quote": "What is your recommendation?"})])
            if self.calls == 2:
                return ProviderReply(tool_calls=[ProviderToolCall(id="save", name="save_work_product", arguments={
                    "kind": "recommendation", "title": "Working view", "content": synthesis,
                    "next_action": "Confirm the pilot retention period.",
                })])
            return ProviderReply(content="Start with a limited pilot while retention remains open.")

    app_context.runner.provider = Provider()
    app_context.dossiers.project_current_work_state(MATTER, expected_hash=None)
    path = f"{app_context.matters.matter_path(MATTER)}/dossier.md"
    run = app_context.chat_runs.start(MATTER, ChatRequest(matter_id=MATTER, experimental_chat=True,
        message="What is your recommendation?", target=ConversationTarget(matter_id=MATTER, artifact_path=path)))
    await app_context.chat_runs.wait(run["run_id"])
    completed = app_context.chat_runs.get(MATTER, run["run_id"])
    assert completed["state"] == "completed", completed.get("failure_detail")
    assert recommendations(app_context).get(MATTER)["content"] == synthesis, completed["response"]
    assert synthesis in app_context.dossiers.get(MATTER)["content"]
    assert path in completed["response"]["changed_paths"]
    assert not app_context.matters.get(MATTER)["decisions"]


def test_proposed_view_is_visible_without_replacing_lawyer_position(app_context):
    service = recommendations(app_context)
    service.set_working(MATTER, "Lawyer position.", actor="Counsel", origin="lawyer_edit", next_action="Confirm scope.")
    proposal = service.propose(MATTER, "Alternative theory after new research.", actor="Themis.ai", next_action="Check retention.")
    assert proposal["dossier_projection"]["state"] == "applied"
    dossier = app_context.dossiers.get(MATTER)["content"]
    assert "Lawyer position." in dossier
    assert "Proposed working view — not yet accepted" in dossier
    assert "Alternative theory after new research." in dossier
    assert "Suggested next step: Check retention." in dossier
    assert service.get(MATTER)["content"] == "Lawyer position."
    service.accept(MATTER, actor="Counsel")
    assert "Proposed working view" not in app_context.dossiers.get(MATTER)["content"]


def test_tasks_stages_and_all_saved_drafts_refresh_dossier(app_context):
    service = recommendations(app_context)
    service.set_working(MATTER, "Working view.", actor="Themis.ai", origin="initial_agent")
    app_context.matters.complete_open_work_items(MATTER)
    app_context.matters.move_stage(MATTER, "explore", actor="Lawyer")
    item = app_context.matters.create_work_item(WorkItemCreate(matter_id=MATTER,
        title="Obtain the missing retention policy", required=True, priority="high"))
    assert "## Next counsel action\n\nObtain the missing retention policy" in app_context.dossiers.get(MATTER)["content"]
    app_context.matters.complete_work_item(MATTER, item["work_item_id"], actor="Counsel")
    assert "## Next counsel action\n\nReview the research packet" in app_context.dossiers.get(MATTER)["content"]
    first = app_context.work_products.create_draft(MATTER, title="Memo", content="Memo text.")
    second = app_context.work_products.create_draft(MATTER, title="Checklist", content="Checklist text.")
    preview = app_context.work_products.create_draft(MATTER, title="Preview", content="Not kept.", preview=True)
    dossier = app_context.dossiers.get(MATTER)["content"]
    assert first["vault_path"] in dossier and second["vault_path"] in dossier
    assert preview["vault_path"] not in dossier


def test_task_projection_preserves_lawyer_dossier_edits(app_context):
    recommendations(app_context).set_working(MATTER, "Working view.", actor="Themis.ai", origin="initial_agent")
    original = app_context.dossiers.get(MATTER)
    edited = original["content"] + "\nCounsel's independent note.\n"
    app_context.vault.update_markdown(original["path"], content=edited)
    result = app_context.matters.create_work_item(WorkItemCreate(matter_id=MATTER, title="Review scope", required=True))
    assert result["dossier_projection"]["state"] == "review_required"
    assert app_context.dossiers.get(MATTER)["content"].strip() == edited.strip()


def test_embedded_action_heading_does_not_split_the_working_view(app_context):
    service = recommendations(app_context)
    service.set_working(MATTER, "## Leading theory\nPilot only.\n\n## Next counsel action\nCheck scope.",
                        actor="Themis.ai", origin="initial_agent")
    service.propose(MATTER, "## Working view\nDelay launch.", actor="Themis.ai")
    content = app_context.dossiers.get(MATTER)["content"]
    assert content.count("\n## Next counsel action\n") == 1
    assert "### Next counsel action\nCheck scope." in content
    assert "Delay launch." in app_context.dossiers.section(content, "Options or working recommendation")

    app_context.dossiers.update_work_state(MATTER,
        recommendation="Working theory.\n\n## Next counsel action\nCheck scope.\n\n### Support\nSaved analysis.",
        next_action="Check scope.", draft=None, final=None, expected_hash=app_context.dossiers.content_hash(MATTER))
    content = app_context.dossiers.get(MATTER)["content"]
    assert content.count("Next counsel action") == 1
    assert "Saved analysis." in content


@pytest.mark.asyncio
async def test_working_view_can_change_without_revising_a_draft(app_context):
    from app.tools.handlers import save_work_product
    from app.tools.registry import ToolExecutionContext
    draft = app_context.work_products.create_draft(MATTER, title="Lawyer draft", content="Keep this wording.")
    context = ToolExecutionContext(app=app_context, matter_id=MATTER,
        frozen_context={"draft_updates_require_offer": True})
    await save_work_product(context, {"kind": "recommendation", "title": "Working view", "content": "New theory."})
    assert recommendations(app_context).get(MATTER)["content"] == "New theory."
    assert app_context.vault.read_markdown(draft["vault_path"])["content"].strip() == "Keep this wording."
    context.preview = True
    with pytest.raises(ValueError, match="preview"):
        await save_work_product(context, {"kind": "recommendation", "title": "Preview", "content": "Not saved."})
    assert recommendations(app_context).get(MATTER)["content"] == "New theory."
