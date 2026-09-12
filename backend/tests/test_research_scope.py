import pytest

from app.agents.runner import RunnerExecutionState
from app.models.api import ChatRequest, ChatResponse
from app.models.research_scope import ResearchScope
from app.providers.base import ProviderReply, ProviderToolCall
from app.routers.chat import _confirm_saved_operation
from app.tools.handlers import run_research, search_vault, read_file
from app.tools.registry import ToolExecutionContext


@pytest.mark.asyncio
@pytest.mark.parametrize("scenario", [False, True])
async def test_research_choices_available_before_scope_without_starting_search(app_context, scenario):
    message = "Can you do some outside research on this issue?"
    from app.models.workspace import ConversationTarget
    path = app_context.solution_paths.ensure_baseline("MAT-DEMO-BEACON") if scenario else None

    class ResearchProvider:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            if not any(item.get("role") == "tool" for item in messages):
                names = {item["function"]["name"] for item in tools}
                assert "run_research" in names
                assert "save_work_product" not in names
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="research", name="run_research", arguments={
                        "question": "Find external authority for this matter.",
                        "public_query": "Federal customer due diligence rules",
                    })])
            return ProviderReply(content="Choose the sources to start research.")

    app_context.runner.provider = ResearchProvider()
    response = await app_context.runner.run(ChatRequest(
        message=message, trusted_user_message=message,
        matter_id="MAT-DEMO-BEACON", experimental_chat=True,
        source_action_key="chat:unscoped-research",
        target=ConversationTarget(matter_id="MAT-DEMO-BEACON",scenario_id=path["scenario_id"]) if path else None),
        execution_state=RunnerExecutionState(scope_state={"scope": "scenario"} if scenario else {}))
    proposal = next(item for item in response.operation_results if item["operation"] == "run_research")
    assert app_context.runner.provider.calls == 1
    assert proposal["status"] == "confirmation_required"
    assert proposal["proposal"]["external"] is True
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == []


@pytest.mark.asyncio
@pytest.mark.parametrize("external,other", [(False, False), (True, False), (False, True), (True, True)])
async def test_confirmed_sources_control_retrieval_and_saved_packet(app_context, monkeypatch, external, other):
    current = "MAT-DEMO-BEACON"
    other_path = app_context.matters.matter_path("MAT-DEMO-ORBIT")
    source = f"{other_path}/documents/scope-proof.md"
    app_context.vault.write_markdown(source, "Scopeproof previous launch evidence.", {"title": "Prior launch", "matter_id": "MAT-DEMO-ORBIT"})
    app_context.index.rebuild()
    calls = []
    prompts = []

    async def external_provider(provider_id, query, result):
        calls.append((provider_id, query.standing_question))
        result["external"].append({"title": "Public rule", "url": "https://example.test/rule", "support_state": "retrieved", "excerpt": "A public rule."})
        return "success"

    async def analysis(request, **kwargs):
        prompts.append(request.frozen_context["context"])
        if external:
            await kwargs["investigation"].collect({"requests": [{"proposition_id": "rule", "proposition": "Public rule", "public_query": "Federal customer due diligence rules", "source_goal": "operative_rule"}]})
        return ChatResponse(reply="A useful first pass from the selected sources.")

    monkeypatch.setattr(app_context.research, "_run_external_provider", external_provider)
    from app.services import research_reader
    async def reader(*args, **kwargs):
        return {"retrieved_content": "Synthetic public rule. " * 20, "retrieval_method": "fixture"}
    monkeypatch.setattr(research_reader, "read_source", reader)
    app_context.research.bind_agent_runner(analysis)
    scope = ResearchScope(external=external, other_matters=other,
        public_query="Federal customer due diligence rules", provider_ids=app_context.research.search_options()["provider_ids"])
    run = app_context.research_runs.start(current, ["Scopeproof private project question"], search_scope=scope)
    await app_context.research_runs.wait(run["run_id"])
    saved = app_context.research_runs.get(current, run["run_id"])
    assert saved["state"] == "completed"
    assert saved["search_scope"] == scope.model_dump()
    assert bool(calls) is external
    assert all(query == scope.public_query for _, query in calls)
    packet = app_context.vault.read_markdown(saved["results"][0]["path"])
    paths = [item.get("path") for item in packet["metadata"]["source_records"]]
    assert (source in paths) is other
    assert ("Scopeproof previous launch evidence" in prompts[0]) is other
    assert packet["metadata"]["search_scope"] == scope.model_dump()


@pytest.mark.asyncio
async def test_missing_scope_cannot_search_externally(app_context, monkeypatch):
    async def forbidden(*args, **kwargs):
        pytest.fail("No external call is authorized")
    monkeypatch.setattr(app_context.research, "_run_external_provider", forbidden)
    run = app_context.research_runs.start("MAT-DEMO-BEACON", ["Use external sources and other matters"])
    await app_context.research_runs.wait(run["run_id"])
    saved = app_context.research_runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert saved["search_scope"]["external"] is False
    assert saved["search_scope"]["other_matters"] is False
    assert "not selected" in saved["status"]


@pytest.mark.asyncio
async def test_model_arguments_cannot_grant_permission_and_card_confirmation_is_idempotent(app_context):
    context = ToolExecutionContext(app=app_context, matter_id="MAT-DEMO-BEACON",
        trusted_user_message="Search externally and search other matters.", source_action_key="chat:scope-proof")
    proposed = await run_research(context, {"question": "Scopeproof", "external": True, "other_matters": True,
        "public_query": "Federal customer due diligence rules"})
    assert proposed["operation_status"] == "confirmation_required"
    assert app_context.research_runs.list(context.matter_id) == []
    proposal = proposed["data"]["proposal"]
    assert proposal["external"] is True and proposal["other_matters"] is True
    saved = {"messages": [{"operation_results": [{"action": context.source_action_key,
        "operation": "run_research", "status": "confirmation_required", "proposal": proposal}]}]}
    request = ChatRequest(matter_id=context.matter_id, message="Start research", card_action={
        "card_id": f"operation-result:{context.source_action_key}", "action": "apply", "values": ["no", "yes", ""]})
    first = _confirm_saved_operation(app_context, request, saved, execution_state=RunnerExecutionState())
    second = _confirm_saved_operation(app_context, request, saved, execution_state=RunnerExecutionState())
    assert first.cards[0].run_id == second.cards[0].run_id
    await app_context.research_runs.wait(first.cards[0].run_id)
    run = app_context.research_runs.get(context.matter_id, first.cards[0].run_id)
    assert run["search_scope"]["external"] is False
    assert run["search_scope"]["other_matters"] is True
    assert len(app_context.research_runs.list(context.matter_id)) == 1


@pytest.mark.asyncio
async def test_changed_provider_requires_new_choice_before_any_run(app_context):
    scope = ResearchScope(external=True, public_query="Public rules", provider_ids=["new-paid-database"])
    with pytest.raises(ValueError, match="providers"):
        app_context.research_runs.start("MAT-DEMO-BEACON", ["Question"], search_scope=scope)
    assert app_context.research_runs.list("MAT-DEMO-BEACON") == []


@pytest.mark.asyncio
async def test_other_matter_tools_ask_before_reading(app_context):
    context = ToolExecutionContext(app=app_context, matter_id="MAT-DEMO-BEACON")
    other = app_context.matters.matter_path("MAT-DEMO-ORBIT")
    for result in [await search_vault(context, {"query": "privacy", "path": other}),
                   await read_file(context, {"path": f"{other}/facts.md"})]:
        assert result["operation_status"] == "confirmation_required"
        assert "results" not in result["data"]
        assert "content" not in result["data"]


def test_archived_and_trash_sources_are_not_in_cross_matter_research(app_context):
    other = app_context.matters.matter_path("MAT-DEMO-ORBIT")
    document = app_context.vault.read_markdown(f"{other}/matter.md")
    app_context.vault.write_markdown(document["path"], document["content"], {**document["metadata"], "archived_at": "2026-09-09T00:00:00Z"})
    app_context.index.rebuild()
    current = app_context.matters.matter_path("MAT-DEMO-BEACON")
    assert app_context.research._eligible_internal_sources([
        {"path": f"{other}/facts.md"}, {"path": "99_Trash/MAT-OLD/facts.md"}], current, other_matters=True) == []


def test_pending_source_choice_is_not_reported_as_failed_search():
    from app.agents.output import reconcile_user_facing_reply
    text = reconcile_user_facing_reply(
        "Choose sources below.\n\nNo durable research run was started.",
        [{"operation":"run_research","status":"confirmation_required"}])
    assert "waiting for your source choice" in text
    assert "No durable" not in text


@pytest.mark.asyncio
@pytest.mark.parametrize("scenario", [False, True])
@pytest.mark.parametrize("external,other", [(False, False), (True, False), (False, True), (True, True)])
async def test_continue_routes_saved_choice_without_asking_again(app_context, monkeypatch, scenario, external, other):
    from app.models.workspace import ConversationTarget
    from app.routers.chat import execute_chat

    matter = "MAT-DEMO-BEACON"
    path = app_context.solution_paths.ensure_baseline(matter)
    tool_context = ToolExecutionContext(app=app_context, matter_id=matter,
        trusted_user_message="Research this question.", source_action_key="continue-proof")
    proposed = await run_research(tool_context, {
        "question": "Review customer due diligence requirements.",
        "public_query": "Federal customer due diligence rules"})
    saved = app_context.chat_history.append(matter, None, role="assistant",
        content="Choose sources.", operation_results=[{
            "action": "continue-proof", "operation": "run_research",
            "status": "confirmation_required", "proposal": proposed["data"]["proposal"]}])

    async def forbidden(*args, **kwargs):
        pytest.fail("Continue must apply the saved choice, not ask the chat model again")
    monkeypatch.setattr(app_context.runner, "run", forbidden)

    async def analysis(*args, **kwargs):
        return ChatResponse(reply="Review completed from the available evidence.")
    app_context.research.bind_agent_runner(analysis)
    request = ChatRequest(matter_id=matter, conversation_id=saved["conversation_id"],
        experimental_chat=True, message="Continue",
        target=ConversationTarget(matter_id=matter, scenario_id=path["scenario_id"]) if scenario else None,
        card_action={"card_id": "operation-result:continue-proof", "action": "apply",
                     "values": ["yes" if external else "no", "yes" if other else "no",
                                "Federal customer due diligence rules", "no", "no", "yes"]})
    response = await execute_chat(request, app_context)
    assert len(response.cards) == 1
    assert response.cards[0].type == "research_status"
    assert response.operation_results[0]["status"] == "changed"
    run_id = response.cards[0].run_id
    repeat = await execute_chat(request, app_context)
    assert repeat.cards[0].run_id == run_id
    await app_context.research_runs.wait(run_id)
    run = app_context.research_runs.get(matter, run_id)
    assert run["search_scope"]["external"] is external
    assert run["search_scope"]["other_matters"] is other
    assert len(app_context.research_runs.list(matter)) == 1
