from __future__ import annotations

import asyncio
import json

import pytest

from app.models.api import MAX_CHAT_MESSAGE_CHARS, ChatRequest, ChatResponse, WorkItemCreate
from app.intelligence.polaris import PolarisProviderResult
from app.models.awareness import DevelopmentCandidate, ProviderScanResult, SourceReference
from app.services.research_runs import ResearchRunService
from app.services.research import _bounded_agent_message
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderSelection
from app.tools.handlers import run_research
from app.tools.registry import ToolExecutionContext
from app.services.workspace import digest
from app.models.research_scope import ResearchScope


async def external_research(app_context, matter_id, question="", **kwargs):
    """These legacy retrieval tests explicitly opt into the configured providers."""
    return await app_context.research.run(
        matter_id, question, search_scope=ResearchScope(
            external=True, public_query=question,
            provider_ids=app_context.research.search_options()["provider_ids"],
        ), execution_version=1, **kwargs,
    )


@pytest.mark.asyncio
async def test_research_writes_packet_and_moves_to_explore(app_context):
    result = await app_context.research.run("MAT-DEMO-ORBIT", "What notice and reason-code work is needed?")
    assert app_context.vault.exists(result["path"])
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "explore"
    work_items = app_context.index.list_work_items("MAT-DEMO-ORBIT")
    original = next(item for item in work_items if item["item_type"] == "research")
    assert original["status"] == "open"
    assert not any(item["item_type"] == "counsel_review" for item in work_items)
    packet = app_context.vault.read_markdown(result["path"])
    assert packet["metadata"]["status"] == "first_pass_partial"
    assert packet["metadata"]["public_research_status"] == "unavailable"
    matter_path = app_context.index.get_matter("MAT-DEMO-ORBIT")["path"]
    matter = app_context.vault.read_markdown(f"{matter_path}/matter.md")["metadata"]
    assert matter["public_research_status"] == "unavailable"
    assert matter["latest_research_path"] == result["path"]
    assert result["dossier_projection"]["state"] in {"applied", "not_required"}


@pytest.mark.asyncio
async def test_research_projection_failure_preserves_packet_without_fake_revision(
    app_context, monkeypatch,
):
    def fail_projection(*_args, **_kwargs):
        raise RuntimeError("projection offline")

    monkeypatch.setattr(app_context.dossiers, "project_current_work_state", fail_projection)
    async def main_answer(request, **kwargs):
        return ChatResponse(reply="Useful synthetic answer requiring a dossier update.")
    app_context.research.bind_agent_runner(main_answer)
    run = app_context.research_runs.start("MAT-DEMO-BEACON", ["Which rules control?"])
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert app_context.vault.exists(saved["results"][0]["path"])
    assert saved["publication"]["state"] == "partial"
    assert "dossier" not in saved["publication"]["receipts"]
    assert any("Dossier publication failed" in warning for warning in saved["publication"]["warnings"])



@pytest.mark.asyncio
async def test_research_uses_the_disposable_index_for_internal_sources(app_context, monkeypatch):
    calls = []

    def lexical_search(query, *, relative_path="", limit=10):
        calls.append((query, relative_path, limit))
        return []

    monkeypatch.setattr(app_context.index, "lexical_search", lexical_search)

    await app_context.research.run(
        "MAT-DEMO-BEACON", "Which rules control?", change_stage=False
    )

    assert calls == [
        ("Which rules control?", "03_Matters/beacon-instant-onboarding", 8)
    ]


@pytest.mark.asyncio
async def test_mock_research_is_labeled_and_not_filed_as_substantive_analysis(app_context):
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "Which public rules control?", change_stage=False
    )
    packet = app_context.vault.read_markdown(result["path"])

    assert packet["metadata"]["status"] == "first_pass_partial"
    assert "No model-generated research analysis was filed" in packet["content"]
    assert "configure an OpenAI-compatible provider" not in packet["content"]
    assert packet["metadata"]["title"] == "Which public rules control"


@pytest.mark.asyncio
async def test_repeated_research_reuses_open_review_item(app_context):
    async def public_search(_query):
        return {"external": [{"title": "Agency rule", "url": "https://agency.example/rule"}]}

    app_context.research.search.search_external = public_search
    first = await external_research(app_context, "MAT-DEMO-ORBIT", "First question")
    first_items = app_context.index.list_work_items("MAT-DEMO-ORBIT")
    first_review = next(
        item for item in first_items
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    )

    second = await external_research(app_context, "MAT-DEMO-ORBIT", "Second question")
    reviews = [
        item for item in app_context.index.list_work_items("MAT-DEMO-ORBIT")
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    ]

    assert len(reviews) == 1
    assert reviews[0]["work_item_id"] == first_review["work_item_id"]
    assert app_context.vault.read_markdown(reviews[0]["path"])["metadata"]["research_path"] == second["path"]
    assert first["path"] != second["path"]


@pytest.mark.asyncio
async def test_completed_research_review_gets_new_item_on_next_run(app_context):
    async def public_search(_query):
        return {"external": [{"title": "Agency rule", "url": "https://agency.example/rule"}]}

    app_context.research.search.search_external = public_search
    await external_research(app_context, "MAT-DEMO-ORBIT", "First question")
    review = next(
        item for item in app_context.index.list_work_items("MAT-DEMO-ORBIT")
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    )
    app_context.vault.update_markdown(review["path"], metadata_updates={"status": "done"})
    app_context.index.rebuild()

    await external_research(app_context, "MAT-DEMO-ORBIT", "Second question")
    reviews = [
        item for item in app_context.index.list_work_items("MAT-DEMO-ORBIT")
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    ]
    assert len(reviews) == 2
    assert len([item for item in reviews if item["status"] == "open"]) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("stage", ["explore", "generate", "respond"])
async def test_research_preserves_later_workflow_stages(app_context, stage):
    app_context.matters.move_stage("MAT-DEMO-ORBIT", stage)
    await app_context.research.run("MAT-DEMO-ORBIT", "A later-stage question")
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == stage


@pytest.mark.asyncio
async def test_external_provider_hang_uses_one_total_budget_and_saves_partial_packet(app_context):
    entered = asyncio.Event()

    async def hanging_search(*args, **kwargs):
        entered.set()
        await asyncio.Event().wait()

    app_context.research.search.search_external = hanging_search
    app_context.research.configure({
        "primary_external_provider": "tavily",
        "fallback_external_provider": "none",
        "external_timeout_seconds": 0.02,
    })

    result = await asyncio.wait_for(
        external_research(
            app_context, "MAT-DEMO-ORBIT", "Which rules control?", change_stage=False
        ),
        timeout=0.3,
    )

    assert entered.is_set()
    assert result["public_research_status"] != "retrieved"
    assert any(leg["status"] == "timeout" for leg in result["provider_legs"])
    assert any("total external research budget" in warning for warning in result["research_warnings"])
    packet = app_context.vault.read_markdown(result["path"])
    assert packet["metadata"]["status"] == "first_pass_partial"
    assert packet["metadata"]["provider_legs"][-1]["status"] == "timeout"
    assert "## Working Analysis" in packet["content"]


@pytest.mark.asyncio
async def test_timeout_research_run_finishes_and_does_not_move_respond_backward(app_context):
    app_context.matters.move_stage("MAT-DEMO-BEACON", "respond")

    async def hanging_search(*args, **kwargs):
        await asyncio.Event().wait()

    app_context.research.search.search_external = hanging_search
    app_context.research.configure({
        "primary_external_provider": "tavily",
        "fallback_external_provider": "polaris",
        "external_timeout_seconds": 0.02,
    })
    runs = ResearchRunService(app_context.vault, app_context.research)
    started = runs.start("MAT-DEMO-BEACON", ["Which rules control?"])

    await asyncio.wait_for(runs.wait(started["run_id"]), timeout=0.4)
    completed = runs.get("MAT-DEMO-BEACON", started["run_id"])

    assert completed["state"] == "completed"
    assert completed["results"][0]["path"]
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "respond"


@pytest.mark.asyncio
async def test_research_completes_only_supplied_exact_work_item(app_context):
    items = app_context.index.list_work_items("MAT-DEMO-ORBIT")
    research_item = next(item for item in items if item["item_type"] == "research")
    other = app_context.matters.create_work_item(
        WorkItemCreate(matter_id="MAT-DEMO-ORBIT", title="Other research", item_type="research")
    )
    await app_context.research.run(
        "MAT-DEMO-ORBIT", "Question", work_item_id=research_item["work_item_id"]
    )
    current = {item["work_item_id"]: item for item in app_context.index.list_work_items("MAT-DEMO-ORBIT")}
    assert current[research_item["work_item_id"]]["status"] == "done"
    assert current[other["work_item_id"]]["status"] == "open"


@pytest.mark.asyncio
async def test_research_uses_bound_main_agent_without_changing_manual_behavior(app_context):
    requests = []

    async def run_agent(request):
        requests.append(request)
        return ChatResponse(reply="Configured agent analysis.")

    app_context.research.bind_agent_runner(run_agent)
    result = await app_context.research.run("MAT-DEMO-ORBIT", "Which rules control?")

    assert requests[0].agent_id == "counsel-copilot"
    assert "Configured agent analysis" in app_context.vault.read_markdown(result["path"])["content"]
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "explore"


@pytest.mark.asyncio
async def test_research_provider_output_saves_issue_paths_through_packet_boundary(app_context):
    app = app_context
    issue_id = app.workspace.issues("MAT-DEMO-ORBIT")[0]["issue_id"]

    async def run_agent(request, **_kwargs):
        assert request.frozen_context["issue_analysis_capture"]["issues"][issue_id]
        assert request.target.issue_id == issue_id
        return ChatResponse(reply="""Useful research analysis.

```decision-paths
{"issue_analysis":{"issue_id":"%s","explanation":"The rule changes the notice path.","tests":[{"test_id":"t1","title":"Notice rule","condition_ids":["c1"]}],"conditions":[{"condition_id":"c1","question":"Was an adverse decision made?","assessment":"unknown"}],"options":[{"option_id":"yes","title":"Give notice","requirements":[{"condition_id":"c1","state":"met"}],"combination":"all"},{"option_id":"no","title":"No adverse-action notice","requirements":[{"condition_id":"c1","state":"not_met"}],"combination":"all"}]}}
```""" % issue_id)

    app.research.bind_agent_runner(run_agent)
    result = await app.research.run(
        "MAT-DEMO-ORBIT", "Which notice rule applies?", change_stage=False,
        issue_id=issue_id, run_id="RUN-research-paths",
    )
    packet = app.vault.read_markdown(result["path"])
    assert "decision-paths" not in packet["content"]
    assert packet["metadata"]["issue_analyses"][0]["run_id"] == "RUN-research-paths"
    assert result["issue_analyses"][0]["issue_id"] == issue_id
    assert app.issue_analysis.resolve("MAT-DEMO-ORBIT", issue_id)["state"] == "saved"


@pytest.mark.asyncio
async def test_research_run_freezes_issue_and_input_when_queued(app_context, monkeypatch):
    app = app_context
    issue_id = app.workspace.issues("MAT-DEMO-BEACON")[0]["issue_id"]
    observed = {}

    async def run_research(matter_id, question, **kwargs):
        observed.update(kwargs)
        return {"path": "saved.md", "public_research_status": "unavailable",
                "internal_sources": 0, "external_sources": 0}

    monkeypatch.setattr(app.research, "run", run_research)
    runs = ResearchRunService(app.vault, app.research)
    started = runs.start("MAT-DEMO-BEACON", ["Captured question"], issue_id=issue_id)
    queued = runs.get("MAT-DEMO-BEACON", started["run_id"])
    captured_title = queued["frozen_context"]["issue_analysis_capture"]["issues"][issue_id]["inputs"]["issue"]["title"]
    issues = app.workspace.issues("MAT-DEMO-BEACON")
    issues[0]["title"] = "Changed after queue"
    app.workspace.save_issues("MAT-DEMO-BEACON", issues, expected_revision=app.workspace.issues_revision("MAT-DEMO-BEACON"))
    await runs.wait(started["run_id"])
    assert observed["issue_id"] == issue_id
    assert observed["frozen_context"]["issue_analysis_capture"]["issues"][issue_id]["inputs"]["issue"]["title"] == captured_title


@pytest.mark.asyncio
async def test_queued_research_prompt_uses_frozen_request_and_internal_sources(app_context):
    app = app_context
    matter_id = "MAT-DEMO-BEACON"
    issue_id = app.workspace.issues(matter_id)[0]["issue_id"]
    requests = []

    async def run_agent(request, **_kwargs):
        requests.append(request)
        return ChatResponse(reply="Useful frozen research answer.")

    app.research.bind_agent_runner(run_agent)
    runs = ResearchRunService(app.vault, app.research)
    started = runs.start(matter_id, ["What does the original request ask?"], issue_id=issue_id)
    request_path = f"{app.matters.matter_path(matter_id)}/request.md"
    original = app.vault.read_markdown(request_path)
    app.vault.write_markdown(request_path, "CHANGED AFTER QUEUE", original["metadata"])
    await runs.wait(started["run_id"])
    assert requests
    assert "Can we remove manual review" in requests[0].frozen_context["context"]
    assert "CHANGED AFTER QUEUE" not in requests[0].frozen_context["context"]


def test_generated_research_prompt_is_bounded_without_losing_final_instructions():
    message = "START " + ("matter context " * 5_000) + " FINAL INSTRUCTION"

    bounded = _bounded_agent_message(message)

    request = ChatRequest(message=bounded)
    assert len(request.message) == MAX_CHAT_MESSAGE_CHARS
    assert request.message.startswith("START ")
    assert request.message.endswith(" FINAL INSTRUCTION")
    assert "Middle of generated research context omitted" in request.message


@pytest.mark.asyncio
async def test_queued_issue_research_uses_frozen_facts_and_cannot_replace_current_after_fact_change(app_context):
    app = app_context
    matter_id = "MAT-DEMO-BEACON"
    issue_id = app.workspace.issues(matter_id)[0]["issue_id"]
    structure = {"issue_analysis": {
        "issue_id": issue_id, "explanation": "The fact controls the route.",
        "tests": [{"test_id": "t", "title": "Coverage", "condition_ids": ["c"]}],
        "conditions": [{"condition_id": "c", "question": "Is the fact true?", "assessment": "unknown"}],
        "options": [
            {"option_id": "yes", "title": "Covered", "requirements": [{"condition_id": "c", "state": "met"}], "combination": "all"},
            {"option_id": "no", "title": "Not covered", "requirements": [{"condition_id": "c", "state": "not_met"}], "combination": "all"},
        ],
    }}
    current_capture = app.issue_analysis.capture(matter_id, issue_id)
    current_path = app.workspace._path(matter_id, "inquiries/RUN-before-queued-research.md")
    current_text = "Current analysis."
    current_revision = digest(current_text)
    app.vault.write_markdown(current_path, current_text, {
        "record_type": "workspace_inquiry", "matter_id": matter_id,
        "run_id": "RUN-before-queued-research", "output_revision": current_revision,
    })
    app.issue_analysis.publish(
        matter_id, path=current_path, run_id="RUN-before-queued-research",
        output_revision=current_revision, structure=structure, capture=current_capture,
    )

    record = app.workspace.records.get(matter_id)
    old_fact = record["facts"][0]["text"]
    changed_fact = old_fact + " Changed after enqueue."

    async def run_agent(request, **_kwargs):
        assert old_fact in request.frozen_context["context"]
        assert changed_fact not in request.frozen_context["context"]
        return ChatResponse(reply=(
            "Useful queued analysis.\n\n```decision-paths\n"
            + json.dumps(structure)
            + "\n```"
        ))

    app.research.bind_agent_runner(run_agent)
    runs = ResearchRunService(app.vault, app.research)
    started = runs.start(matter_id, ["Which path applies?"], issue_id=issue_id)
    record["facts"][0]["text"] = changed_fact
    app.workspace.records._save(matter_id, record)
    await runs.wait(started["run_id"])

    completed = runs.get(matter_id, started["run_id"])
    assert completed["state"] == "completed"
    assert completed["results"][0]["historical_analysis"] is True
    resolved = app.issue_analysis.resolve(matter_id, issue_id)
    assert resolved["state"] == "needs_review"
    assert resolved["analysis"]["run_id"] == "RUN-before-queued-research"


@pytest.mark.asyncio
async def test_research_refreshes_precomputed_dossier_orientation(app_context):
    decision_question_before = (
        app_context.dossiers.orientation("MAT-DEMO-ORBIT")["decision_question"]
    )
    async def run_agent(_request):
        return ChatResponse(
            reply=(
                "## Matter summary\n\n"
                "Orbit uses an automated notice process that may need updated reason codes. "
                "Counsel must resolve the notice approach before launch.\n\n"
                "## Decision question\n\n"
                "Should Orbit block launch until the new reason codes are in every notice?\n\n"
                "## Open questions\n\n"
                "- Which notices still use the old reason codes?\n"
                "- Can the launch be limited to updated states?\n\n"
                "## Likely issues\n\nNotice accuracy and launch scope."
            )
        )

    app_context.research.bind_agent_runner(run_agent)
    run = app_context.research_runs.start("MAT-DEMO-ORBIT", ["What notice and reason-code work is needed?"])
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get("MAT-DEMO-ORBIT", run["run_id"])
    assert saved["state"] == "completed", saved
    result = saved["results"][0]
    assert result["orientation_warning"] is None
    assert app_context.dossiers.orientation("MAT-DEMO-ORBIT") == {
        "summary": (
            "Orbit uses an automated notice process that may need updated reason codes. "
            "Counsel must resolve the notice approach before launch."
        ),
        "decision_question": decision_question_before,
        "open_questions": [
            "Which notices still use the old reason codes?",
            "Can the launch be limited to updated states?",
        ],
    }
    assert "## Matter summary" in app_context.vault.read_markdown(result["path"])["content"]
    dossier = app_context.dossiers.get("MAT-DEMO-ORBIT")["content"]
    assert dossier.count("## Matter summary") == 1
    assert "## Summary" not in dossier
    assert dossier.count("## Research and source support") == 1
    assert "## Research\n" not in dossier
    assert f"Latest review: `{result['path']}`" in dossier
    assert "Research has not been added yet." not in dossier


@pytest.mark.asyncio
async def test_research_reports_saved_packet_before_orientation_follow_up(app_context, monkeypatch):
    saved = []

    def observe_orientation(*args, **kwargs):
        assert saved and saved[0]["path"]
        return {"path": app_context.dossiers.get("MAT-DEMO-ORBIT")["path"]}

    monkeypatch.setattr(app_context.dossiers, "update_orientation", observe_orientation)
    result = await app_context.research.run(
        "MAT-DEMO-ORBIT", "What applies?", change_stage=False,
        on_packet_saved=saved.append,
    )

    assert saved[0]["path"] == result["path"]


@pytest.mark.asyncio
async def test_research_run_reuses_saved_provider_selection(app_context):
    provider = object()
    selection = ProviderSelection(
        agent_id="research-agent", provider="codex", model="saved-model",
        reasoning_effort="high",
    )
    resolved = ResolvedAgentProvider(provider=provider, selection=selection)
    main_selection = ProviderSelection(agent_id="counsel-copilot", provider="codex", model="saved-main-model", reasoning_effort="medium")
    main_resolved = ResolvedAgentProvider(provider=provider, selection=main_selection)
    seen = []

    async def run_agent(_request, *, resolved_provider=None):
        seen.append(resolved_provider)
        return ChatResponse(reply="Saved selection analysis.")

    app_context.research.bind_agent_runner(run_agent)
    runs = ResearchRunService(
        app_context.vault,
        app_context.research,
        resolve_agent=lambda: resolved,
        resolve_main=lambda: main_resolved,
        resolve_selection=lambda saved: ResolvedAgentProvider(provider=provider, selection=saved),
    )
    started = runs.start("MAT-DEMO-BEACON", ["One", "Two"])
    assert started["selection"]["model"] == "saved-model"
    await runs.wait_for_active_work()

    assert len(seen) == 2
    assert all(item is not None and item.selection == main_selection for item in seen)


@pytest.mark.asyncio
async def test_automatic_research_run_moves_active_research_to_explore(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)

    started = runs.start("MAT-DEMO-BEACON", ["What issues need research?"])
    assert started["state"] == "queued"
    await runs.wait(started["run_id"])

    completed = runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert completed["completed"] == 1
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "explore"


@pytest.mark.asyncio
async def test_automatic_research_enters_research_while_intake_run_is_active(app_context):
    gate = __import__("asyncio").Event()

    async def blocked(_request, *, resolved_provider=None):
        await gate.wait()
        return ChatResponse(reply="Useful analysis.")

    app_context.research.bind_agent_runner(blocked)
    runs = ResearchRunService(app_context.vault, app_context.research)
    started = runs.start("MAT-DEMO-ORBIT", ["What applies?"])
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "research"
    gate.set()
    await runs.wait(started["run_id"])
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "explore"


@pytest.mark.asyncio
async def test_chat_research_tool_waits_for_source_choice(app_context):
    app_context.matters.move_stage("MAT-DEMO-BEACON", "explore")
    entered = asyncio.Event()
    release = asyncio.Event()

    async def blocked(_request, *, resolved_provider=None):
        entered.set()
        await release.wait()
        return ChatResponse(reply="Useful analysis.")

    app_context.research.bind_agent_runner(blocked)
    result = await asyncio.wait_for(
        run_research(
            ToolExecutionContext(app=app_context, matter_id="MAT-DEMO-BEACON"),
            {"question": "What applies?"},
        ),
        timeout=0.1,
    )
    active = app_context.research_runs.list("MAT-DEMO-BEACON")
    assert active == []
    assert not entered.is_set()
    assert result["operation_status"] == "confirmation_required"
    assert result["changed_paths"] == []
    assert result["data"]["proposal"]["question"] == "What applies?"
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "explore"


@pytest.mark.asyncio
async def test_chat_reply_contains_source_confirmation_before_background_research(app_context):
    entered = asyncio.Event()
    release = asyncio.Event()

    async def blocked(_request, *, resolved_provider=None):
        entered.set()
        await release.wait()
        return ChatResponse(reply="Useful analysis.")

    class ResearchRequestProvider:
        def __init__(self):
            self.calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                from app.providers.base import ProviderReply, ProviderToolCall

                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="research",
                    name="run_research",
                    arguments={"question": "What applies?"},
                )])
            from app.providers.base import ProviderReply

            return ProviderReply(content="Research is running in the background.")

    app_context.research.bind_agent_runner(blocked)
    app_context.runner.provider = ResearchRequestProvider()
    response = await asyncio.wait_for(
        app_context.runner.run(ChatRequest(
            message="Research this.", matter_id="MAT-DEMO-BEACON",
        )),
        timeout=0.1,
    )
    assert not entered.is_set()
    assert not any(item.type == "research_status" for item in response.cards)
    result = next(item for item in response.operation_results if item["operation"] == "run_research")
    assert result["status"] == "confirmation_required"
    assert result["proposal"]["question"] == "What applies?"


@pytest.mark.asyncio
async def test_failed_research_run_returns_explore_matter(app_context):
    app_context.matters.move_stage("MAT-DEMO-BEACON", "explore")

    async def fail(*_args, **_kwargs):
        raise RuntimeError("research unavailable")

    app_context.research.run = fail
    started = app_context.research_runs.start("MAT-DEMO-BEACON", ["What applies?"])
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "research"

    await app_context.research_runs.wait(started["run_id"])

    assert app_context.research_runs.get("MAT-DEMO-BEACON", started["run_id"])["state"] == "failed"
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "explore"


def test_research_provider_resolution_failure_leaves_intake_without_run(app_context):
    def fail_resolution():
        raise ValueError("Saved provider is unavailable")

    runs = ResearchRunService(
        app_context.vault,
        app_context.research,
        resolve_main=fail_resolution,
    )

    with pytest.raises(ValueError, match="Saved provider is unavailable"):
        runs.start("MAT-DEMO-ORBIT", ["What applies?"])

    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "intake"
    assert runs.list("MAT-DEMO-ORBIT") == []


@pytest.mark.asyncio
async def test_automatic_research_is_limited_to_three_questions(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)

    runs.start("MAT-DEMO-BEACON", ["One", "Two", "Three", "Four"])
    await runs.wait_for_active_work()
    completed = runs.list("MAT-DEMO-BEACON")

    assert sorted(item["question"] for item in completed) == ["One", "Three", "Two"]
    assert len(completed) == 3
    assert all(item["questions"] == [item["question"]] and item["total"] == 1 for item in completed)


@pytest.mark.asyncio
async def test_research_queue_adds_while_running_and_continues_in_order(app_context):
    entered = asyncio.Event()
    release = asyncio.Event()
    seen = []

    async def controlled(_request, *, resolved_provider=None):
        seen.append(_request.message)
        if len(seen) == 1:
            entered.set()
            await release.wait()
        return ChatResponse(reply="Useful analysis.")

    app_context.research.bind_agent_runner(controlled)
    runs = ResearchRunService(app_context.vault, app_context.research)
    first = runs.start("MAT-DEMO-BEACON", ["First question"])
    await entered.wait()
    second = runs.start("MAT-DEMO-BEACON", ["Second question"])
    assert runs.get("MAT-DEMO-BEACON", second["run_id"])["state"] == "queued"
    assert sum(item["state"] == "running" for item in runs.list("MAT-DEMO-BEACON")) == 1

    release.set()
    await runs.wait(first["run_id"])
    await runs.wait(second["run_id"])
    assert runs.get("MAT-DEMO-BEACON", second["run_id"])["state"] == "completed"
    assert len(seen) == 2


def test_research_queue_reorders_only_pending_items(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)
    one = runs._write("MAT-DEMO-BEACON", "RUN-ONE", state="running", questions=["Active"], status="Research is running.", queue_order=1)
    two = runs._write("MAT-DEMO-BEACON", "RUN-TWO", state="queued", questions=["Two"], status="Research is queued.", queue_order=2)
    three = runs._write("MAT-DEMO-BEACON", "RUN-THREE", state="queued", questions=["Three"], status="Research is queued.", queue_order=3)

    reordered = runs.reorder("MAT-DEMO-BEACON", [three["run_id"], two["run_id"]])
    assert next(item for item in reordered if item["run_id"] == one["run_id"])["state"] == "running"
    assert [item["run_id"] for item in reordered if item["state"] == "queued"] == ["RUN-THREE", "RUN-TWO"]


@pytest.mark.asyncio
async def test_three_question_batch_is_independent_reorderable_and_idempotent(app_context):
    entered = asyncio.Event()
    release = asyncio.Event()
    seen = []

    async def controlled(_matter_id, question, **_kwargs):
        seen.append(question)
        if len(seen) == 1:
            entered.set()
            await release.wait()
        path = f"{app_context.matters.matter_path(_matter_id)}/research/{question}.md"
        app_context.vault.write_markdown(path, "Synthetic queue result.", {"matter_id": _matter_id, "run_id": _kwargs["run_id"], "output_revision": digest(question), "research_prose": "Synthetic queue result.", "source_records": []})
        return {
            "path": path, "public_research_status": "unavailable",
            "internal_sources": 1, "external_sources": 0,
        }

    app_context.research.run = controlled
    runs = ResearchRunService(app_context.vault, app_context.research)
    first = runs.start(
        "MAT-DEMO-BEACON", ["Question one", "Question two", "Question three"],
        source_action_key="batch-action",
    )
    await entered.wait()
    items = runs.list("MAT-DEMO-BEACON")
    assert len(items) == 3
    assert len({item["question_id"] for item in items}) == 3
    assert len({item["run_id"] for item in items}) == 3
    assert len({item["source_action_key"] for item in items}) == 3
    assert {item["batch_source_action_key"] for item in items} == {"batch-action"}
    assert all(len(item["questions"]) == 1 for item in items)
    assert [item["question"] for item in items if item["state"] == "queued"] == [
        "Question two", "Question three",
    ]

    retry = runs.start(
        "MAT-DEMO-BEACON", ["Question one", "Question two", "Question three"],
        source_action_key="batch-action",
    )
    assert retry["run_id"] == first["run_id"]
    assert len(runs.list("MAT-DEMO-BEACON")) == 3
    pending = [item for item in items if item["state"] == "queued"]
    runs.reorder("MAT-DEMO-BEACON", [pending[1]["run_id"], pending[0]["run_id"]])

    release.set()
    await runs.wait_for_active_work()
    assert seen == ["Question one", "Question three", "Question two"]
    assert all(item["state"] == "completed" for item in runs.list("MAT-DEMO-BEACON"))


@pytest.mark.asyncio
async def test_legacy_multi_question_record_still_executes_once(app_context):
    seen = []

    async def completed(_matter_id, question, **_kwargs):
        seen.append(question)
        return {
            "path": f"research/{question}.md", "public_research_status": "unavailable",
            "internal_sources": 0, "external_sources": 0,
        }

    app_context.research.run = completed
    runs = ResearchRunService(app_context.vault, app_context.research)
    runs._write(
        "MAT-DEMO-BEACON", "RUN-LEGACY", state="interrupted",
        questions=["Legacy one", "Legacy two"], completed=0,
        resumed_from_restart=True, queue_order=1,
        status="Research is queued to resume after restart.", return_stage="explore",
    )

    runs.resume("MAT-DEMO-BEACON")
    await runs.wait_for_active_work()
    assert seen == ["Legacy one", "Legacy two"]
    assert len(runs.list("MAT-DEMO-BEACON")) == 1


@pytest.mark.asyncio
async def test_restart_resumes_independent_items_without_duplicates(app_context):
    seen = []

    async def completed(_matter_id, question, **_kwargs):
        seen.append(question)
        return {
            "path": f"research/{question}.md", "public_research_status": "unavailable",
            "internal_sources": 0, "external_sources": 0,
        }

    app_context.research.run = completed
    runs = ResearchRunService(app_context.vault, app_context.research)
    app_context.matters.move_stage("MAT-DEMO-BEACON", "research")
    for position, state in enumerate(("running", "queued", "queued"), start=1):
        runs._write(
            "MAT-DEMO-BEACON", f"RUN-RESTART-{position}", state=state,
            questions=[f"Restart {position}"], question=f"Restart {position}",
            question_id=f"RQ-RESTART-{position}", queue_item_version=1,
            queue_order=position, priority=position, completed=0,
            status="Research is running." if state == "running" else "Research is queued.",
            return_stage="explore",
        )

    assert runs.mark_running_interrupted() == 3
    assert len(runs.list("MAT-DEMO-BEACON")) == 3
    assert runs.resume("MAT-DEMO-BEACON")["run_id"] == "RUN-RESTART-1"
    await runs.wait_for_active_work()
    assert seen == ["Restart 1", "Restart 2", "Restart 3"]
    assert len(runs.list("MAT-DEMO-BEACON")) == 3
    assert all(item["state"] == "completed" for item in runs.list("MAT-DEMO-BEACON"))


@pytest.mark.asyncio
async def test_cancelling_research_does_not_start_queued_tail(app_context):
    entered = asyncio.Event()
    seen = []

    async def blocked(_matter_id, question, **_kwargs):
        seen.append(question)
        entered.set()
        await asyncio.Event().wait()

    app_context.research.run = blocked
    runs = ResearchRunService(app_context.vault, app_context.research)
    first = runs.start("MAT-DEMO-BEACON", ["First"])
    await entered.wait()
    second = runs.start("MAT-DEMO-BEACON", ["Second"])

    runs._tasks[first["run_id"]].cancel()
    with pytest.raises(asyncio.CancelledError):
        await runs.wait(first["run_id"])

    assert runs.get("MAT-DEMO-BEACON", first["run_id"])["state"] == "interrupted"
    assert runs.get("MAT-DEMO-BEACON", second["run_id"])["state"] == "queued"
    assert second["run_id"] not in runs._tasks
    assert seen == ["First"]


@pytest.mark.asyncio
async def test_stop_research_interrupts_running_and_queued_items_without_losing_results(app_context):
    entered = asyncio.Event()

    async def blocked(_matter_id, _question, **_kwargs):
        entered.set()
        await asyncio.Event().wait()

    app_context.research.run = blocked
    runs = ResearchRunService(app_context.vault, app_context.research)
    first = runs.start("MAT-DEMO-BEACON", ["First", "Second"])
    await entered.wait()
    runs._write(
        "MAT-DEMO-BEACON", first["run_id"],
        results=[{"path": "research/saved.md"}], completed=1,
    )

    stopped = await runs.stop("MAT-DEMO-BEACON")

    assert {item["state"] for item in stopped} == {"interrupted"}
    assert next(item for item in stopped if item["run_id"] == first["run_id"])["results"] == [
        {"path": "research/saved.md"}
    ]
    assert all(item.get("stop_reason") == "Stopped by the lawyer." for item in stopped)
    assert not runs.has_active_work


@pytest.mark.asyncio
async def test_user_stopped_research_can_resume_without_starting_the_interrupted_tail(app_context):
    seen = []

    async def complete(_matter_id, question, **_kwargs):
        seen.append(question)
        return {"path": f"research/{question}.md", "public_research_status": "unavailable"}

    app_context.research.run = complete
    runs = ResearchRunService(app_context.vault, app_context.research)
    for position, question in enumerate(("First", "Second"), start=1):
        runs._write(
            "MAT-DEMO-BEACON", f"RUN-STOP-{position}", state="interrupted",
            questions=[question], question=question, completed=0,
            queue_item_version=1, queue_order=position,
            status="Research was stopped by the lawyer.", resumed_from_restart=False,
        )

    resumed = runs.resume("MAT-DEMO-BEACON")
    await runs.wait_for_active_work()

    assert resumed["run_id"] == "RUN-STOP-1"
    assert seen == ["First"]
    assert runs.get("MAT-DEMO-BEACON", "RUN-STOP-2")["state"] == "interrupted"


@pytest.mark.asyncio
async def test_failed_research_retry_keeps_identity_selection_and_increments_attempt(app_context):
    seen = []

    async def complete(_matter_id, question, **_kwargs):
        seen.append(question)
        return {"path": "research/retried.md", "public_research_status": "unavailable"}

    app_context.research.run = complete
    runs = ResearchRunService(app_context.vault, app_context.research)
    selection = {"agent_id": "research-agent", "provider": "workspace_default", "model": "", "reasoning_effort": ""}
    runs._write(
        "MAT-DEMO-BEACON", "RUN-FAILED", state="failed", questions=["Retry me"],
        question="Retry me", completed=0, queue_item_version=1, queue_order=1,
        status="Research failed.", selection=selection, attempt_count=1,
    )

    retried = runs.retry("MAT-DEMO-BEACON", "RUN-FAILED")
    await runs.wait_for_active_work()

    completed = runs.get("MAT-DEMO-BEACON", "RUN-FAILED")
    assert retried["run_id"] == "RUN-FAILED"
    assert completed["state"] == "completed"
    assert completed["selection"] == selection
    assert completed["attempt_count"] == 2
    assert seen == ["Retry me"]


@pytest.mark.asyncio
async def test_resumed_research_keeps_completed_results_and_runs_only_remainder(app_context):
    seen = []
    first_result = {
        "path": "research/first.md", "public_research_status": "unavailable",
        "internal_sources": 1, "external_sources": 0, "provenance": "saved-first",
    }

    async def complete(_matter_id, question, **_kwargs):
        seen.append(question)
        return {
            "path": f"research/{question}.md", "public_research_status": "unavailable",
            "internal_sources": 0, "external_sources": 0,
        }

    app_context.research.run = complete
    runs = ResearchRunService(app_context.vault, app_context.research)
    runs._write(
        "MAT-DEMO-BEACON", "RUN-PARTIAL-RESTART", state="interrupted",
        questions=["First", "Second"], completed=1, results=[first_result],
        resumed_from_restart=True, queue_order=1,
        status="Research is queued to resume after restart.", return_stage="explore",
    )

    runs.resume("MAT-DEMO-BEACON")
    await runs.wait_for_active_work()

    completed = runs.get("MAT-DEMO-BEACON", "RUN-PARTIAL-RESTART")
    assert seen == ["Second"]
    assert completed["completed"] == 2
    assert completed["results"][0] == first_result
    assert completed["results"][1]["path"] == "research/Second.md"


def test_startup_marks_unfinished_research_runs_interrupted(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)
    app_context.matters.move_stage("MAT-DEMO-BEACON", "research")
    path = "03_Matters/beacon-instant-onboarding/research/runs/RUN-OLD.md"
    app_context.vault.write_markdown(
        path,
        "# Old run\n",
        {
            "record_type": "research_run",
            "run_id": "RUN-OLD",
            "matter_id": "MAT-DEMO-BEACON",
            "state": "running",
            "return_stage": "explore",
        },
    )

    assert runs.mark_running_interrupted() == 1
    assert app_context.vault.read_markdown(path)["metadata"]["state"] == "interrupted"
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "explore"


def test_restart_interruption_is_terminal_until_resume_and_resume_clears_finish_time(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)
    run = runs._write(
        "MAT-DEMO-BEACON", "RUN-RESTART-FINISH", state="running", questions=["What applies?"],
        completed=0, status="Research is running.", return_stage="explore",
    )

    assert runs.mark_running_interrupted() == 1
    interrupted = runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert interrupted["state"] == "interrupted"
    assert interrupted["finished_at"]

    # This check exercises the durable queued transition without leaving a task running.
    runs._write("MAT-DEMO-BEACON", run["run_id"], state="queued", status="Research is queued to resume.", finished_at=None)
    queued = runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert queued["state"] == "queued"
    assert queued["finished_at"] is None


@pytest.mark.asyncio
async def test_research_failure_preserves_labeled_useful_packet(app_context):
    async def fail(_request):
        raise RuntimeError("provider unavailable")

    app_context.research.bind_agent_runner(fail)
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "What can counsel do?", change_stage=False
    )
    packet = app_context.vault.read_markdown(result["path"])

    assert "Generated analysis warning" in packet["content"]
    assert "Orientation" in packet["content"]
    assert packet["metadata"]["analysis_warning"]


@pytest.mark.asyncio
async def test_blank_research_intent_uses_matter_title(app_context):
    result = await app_context.research.run("MAT-DEMO-BEACON", "   ", change_stage=False)
    packet = app_context.vault.read_markdown(result["path"])
    assert packet["metadata"]["question"] == app_context.index.get_matter("MAT-DEMO-BEACON")["title"]


@pytest.mark.asyncio
async def test_missing_source_keys_preserve_packet_with_citation_warning(app_context):
    def malformed_search(_query, *, matter_path=None, limit=8):
        return [{"snippet": "Useful lead without a path"}]

    app_context.research.search.search_internal = malformed_search
    result = await app_context.research.run("MAT-DEMO-BEACON", "What applies?", change_stage=False)
    packet = app_context.vault.read_markdown(result["path"])
    assert "Working Analysis" in packet["content"]
    assert packet["metadata"]["citation_warning"]
    assert "citation formatting failed" in result["warning"].lower()


@pytest.mark.asyncio
async def test_research_source_lines_use_clean_label_and_bounded_body_excerpt(app_context):
    source_path = "03_Matters/beacon-instant-onboarding/documents/launch-policy.md"
    app_context.vault.write_markdown(
        source_path,
        "# Launch policy\n\nThe limited pilot needs a manual review before launch. " + ("More detail. " * 80),
        {
            "record_type": "internal_policy",
            "matter_id": "MAT-DEMO-BEACON",
            "secret_internal_key": "do-not-display",
        },
    )

    def search(_query, *, matter_path=None, limit=8):
        return [{
                "path": source_path,
                "title": "Launch Policy",
                "snippet": (
                    "--- record_type: internal_policy matter_id: MAT-DEMO-BEACON "
                    "secret_internal_key: do-not-display --- raw search material"
                ),
            }]

    app_context.research.search.search_internal = search
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "What applies?", change_stage=False
    )
    sources = app_context.vault.read_markdown(result["path"])["content"].split(
        "## Sources surfaced\n\n", 1
    )[1].split("\n\n## Last-mile work", 1)[0]

    assert "Launch Policy" in sources
    assert "The limited pilot needs a manual review before launch." not in sources
    assert "No relevant passage has been selected" in sources
    assert "The limited pilot needs a manual review before launch." in app_context.vault.read_markdown(source_path)["content"]
    assert f"]({source_path})" in sources
    assert "[source:SRC-" in sources
    assert "secret_internal_key" not in sources
    assert "record_type:" not in sources
    assert len(sources) <= 500


@pytest.mark.asyncio
async def test_research_excludes_chat_runs_packets_and_duplicate_dossiers_as_support(app_context):
    matter_path = "03_Matters/beacon-instant-onboarding"
    sources = [
        (f"{matter_path}/conversations/CONV-old.md", "chat_transcript"),
        (f"{matter_path}/research/RES-old.md", "research_packet"),
        (f"{matter_path}/research/runs/RUN-old.md", "research_run"),
        (f"{matter_path}/dossier.md", "matter_dossier"),
        (f"{matter_path}/dossiers/DOS-old.md", "dossier_revision"),
        (f"{matter_path}/facts.md", "facts"),
    ]
    for path, record_type in sources:
        app_context.vault.write_markdown(path, f"# {record_type}\n\nUseful body.\n", {
            "record_type": record_type,
            "research_id": "RES-old" if record_type == "research_packet" else None,
        })

    def search(_query, *, matter_path=None, limit=8):
        return [{"path": path, "title": kind} for path, kind in sources]

    app_context.research.search.search_internal = search
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "What support applies?", change_stage=False
    )
    content = app_context.vault.read_markdown(result["path"])["content"]
    assert f"[facts]({matter_path}/facts.md)" in content
    assert "No relevant passage has been selected" in content
    assert "conversations/CONV-old.md" not in content
    assert "research/runs/RUN-old.md" not in content
    assert "Chat Transcript" not in content
    assert "Research Run" not in content


@pytest.mark.asyncio
async def test_polaris_public_material_is_synthesized_locally_and_labeled_supplied(app_context):
    class Polaris:
        def __init__(self):
            self.queries = []

        async def research(self, query):
            self.queries.append(query)
            return ProviderScanResult(
                provider_id="polaris",
                status="success",
                candidates=[DevelopmentCandidate(
                    title="Public CDD material",
                    provider_observation="Public guidance discusses customer due diligence.",
                    sources=[SourceReference(
                        title="Agency guidance",
                        canonical_url="https://example.com/guidance",
                        excerpt="Public guidance excerpt.",
                        support_state="supplied",
                    )],
                )],
            )

    polaris = Polaris()
    prompts = []

    async def run_agent(request):
        prompts.append(request.message)
        return ChatResponse(reply="Local synthesis with private matter context.")

    app_context.research.bind_polaris(polaris)
    app_context.research.bind_agent_runner(run_agent)
    original_stage = app_context.index.get_matter("MAT-DEMO-BEACON")["status"]

    result = await external_research(
        app_context, "MAT-DEMO-BEACON",
        "What public federal rules govern customer due diligence?",
        change_stage=False,
    )
    packet = app_context.vault.read_markdown(result["path"])

    assert len(polaris.queries) == 1
    assert polaris.queries[0].standing_question == "What public federal rules govern customer due diligence?"
    assert "Public guidance discusses customer due diligence" in prompts[0]
    assert "Local synthesis with private matter context" in packet["content"]
    assert "- Supplied source: [Agency guidance](https://example.com/guidance)" in packet["content"]
    assert result["public_research_status"] == "retrieved"
    assert result["external_authority_retrieved"] is False
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == original_stage


@pytest.mark.asyncio
async def test_provider_diagnostics_stay_in_metadata_not_lawyer_packet(app_context):
    class Polaris:
        configured = True

        async def research(self, _query):
            return PolarisProviderResult(
                provider_id="polaris",
                status="failed",
                warnings=["Polaris request failed (timeout)."],
                observability={
                    "failure_class": "http_status",
                    "attempt_count": 3,
                    "elapsed_ms": 1250,
                    "fallback_status": "pending",
                    "http_status": 503,
                },
            )

    async def no_native_results(_query):
        return {"external": [], "warning": "Native public research was unavailable."}

    async def useful_local_analysis(_request, *, resolved_provider=None, investigation=None, **kwargs):
        await investigation.collect({"requests": [{"proposition_id": "public-rule", "proposition": "Public federal rule", "public_query": "What public federal rules apply?", "source_goal": "operative_rule"}]})
        return ChatResponse(reply="Useful local fallback analysis remains available.")

    app_context.research.bind_polaris(Polaris())
    app_context.research.search.search_external = no_native_results
    app_context.research.bind_agent_runner(useful_local_analysis)
    runs = ResearchRunService(app_context.vault, app_context.research)

    started = runs.start("MAT-DEMO-BEACON", ["What public federal rules apply?"], search_scope=ResearchScope(
        external=True, public_query="What public federal rules apply?",
        provider_ids=app_context.research.search_options()["provider_ids"],
    ))
    await runs.wait(started["run_id"])

    run = runs.get("MAT-DEMO-BEACON", started["run_id"])
    result = run["results"][0]
    packet = app_context.vault.read_markdown(result["path"])
    expected = {
        "failure_class": "http_status",
        "attempt_count": 3,
        "elapsed_ms": 1250,
        "fallback_status": "analysis_preserved",
        "http_status": 503,
    }
    assert result["polaris_observability"] == expected
    assert run["provider_observability"] == [expected]
    assert packet["metadata"]["polaris_observability"] == expected
    assert packet["metadata"]["provider_legs"]
    assert packet["metadata"]["correlation_id"].startswith("RC-")
    assert "Useful local fallback analysis remains available." in packet["content"]
    assert "No external authority retrieved" in packet["content"]
    for diagnostic in ("Technical details", "Polaris", "attempts:", "elapsed:", "correlation:", "http_status", "503"):
        assert diagnostic not in packet["content"]


def test_only_explicit_retrieved_or_verified_sources_count_as_external_authority(app_context):
    sources = [
        {"title": "Unknown", "url": "https://example.com/unknown"},
        {"title": "Supplied", "url": "https://example.com/supplied", "support_state": "supplied"},
    ]

    assert not any(
        item.get("support_state") in {"retrieved", "verified"} for item in sources
    )
    rendered = app_context.research._source_lines({"internal": [], "external": sources})
    assert "Unverified external lead: [Unknown]" in rendered
    assert "Supplied source: [Supplied]" in rendered


@pytest.mark.asyncio
async def test_private_polaris_question_is_blocked_before_network_and_kept_local(app_context):
    class Polaris:
        called = False

        async def research(self, _query):
            self.called = True
            raise AssertionError("Polaris must not receive a private matter ID")

    polaris = Polaris()
    app_context.research.bind_polaris(polaris)
    app_context.research.search.settings.search_provider = "tavily"
    app_context.research.search.settings.tavily_api_key = "test-key"
    external_queries = []

    async def external_search(query):
        external_queries.append(query)
        raise AssertionError("No external provider may receive a private matter ID")

    app_context.research.search.search_external = external_search

    result = await external_research(
        app_context, "MAT-DEMO-BEACON",
        "What rules apply to MAT-DEMO-BEACON?",
        change_stage=False,
    )
    packet = app_context.vault.read_markdown(result["path"])

    assert not polaris.called
    assert not external_queries
    assert result["polaris_status"] == "privacy_blocked"
    assert "External research privacy check blocked this question" in packet["metadata"]["warning"]


@pytest.mark.asyncio
async def test_research_uses_one_async_rebuild_after_its_compound_mutations(app_context, monkeypatch):
    rebuilds = []

    async def rebuild_async():
        rebuilds.append("async")

    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)
    monkeypatch.setattr(app_context.index, "rebuild", lambda: (_ for _ in ()).throw(AssertionError("sync rebuild")))

    await app_context.research.run("MAT-DEMO-BEACON", "What should counsel assess?")

    assert rebuilds == ["async"]


@pytest.mark.asyncio
async def test_research_rebuilds_after_warning_metadata_is_finalized(app_context, monkeypatch):
    async def failed_analysis(*_args, **_kwargs):
        raise RuntimeError("analysis unavailable")

    captured_warnings = []

    async def rebuild_async():
        packet = next(app_context.vault.iter_files("03_Matters/beacon-instant-onboarding/research", {".md"}))
        captured_warnings.append(app_context.vault.read_markdown(app_context.vault.relative(packet))["metadata"].get("warnings"))

    app_context.research.bind_agent_runner(failed_analysis)
    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)

    result = await app_context.research.run("MAT-DEMO-BEACON", "What should counsel assess?", change_stage=False)

    assert captured_warnings == [app_context.vault.read_markdown(result["path"])["metadata"]["warnings"]]


@pytest.mark.asyncio
async def test_research_preserves_useful_prose_when_runner_fails_after_answer(app_context):
    from app.agents.runner import AgentExecutionError, RunnerExecutionState
    async def failed_after_answer(request, **kwargs):
        raise AgentExecutionError(RunnerExecutionState(useful_content="On the supplied facts, the limited pilot remains possible."))
    app_context.research.bind_agent_runner(failed_after_answer)
    result = await app_context.research.run("MAT-DEMO-BEACON", "What can we do?", change_stage=False)
    packet = app_context.vault.read_markdown(result["path"])
    assert "the limited pilot remains possible" in packet["content"]
    assert result["question_answered"] and packet["metadata"]["analysis_warning"]


@pytest.mark.asyncio
@pytest.mark.parametrize("endpoint", ["research-runs", "research"])
async def test_http_research_start_runs_on_the_application_loop(app_context, endpoint):
    import httpx
    from fastapi import FastAPI
    from app.routers.dependencies import get_context
    from app.routers.matters import router

    app = FastAPI()
    app.include_router(router, prefix="/api")
    app.dependency_overrides[get_context] = lambda: app_context
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app, raise_app_exceptions=False), base_url="http://test") as client:
        options = {"json": {"question": "Which notice work is needed?", "source_action_key": "http-research-start"}} if endpoint == "research-runs" else {"params": {"question": "Which notice work is needed?"}}
        response = await client.post(f"/api/matters/MAT-DEMO-ORBIT/{endpoint}", **options)
        assert response.status_code == 202, response.text
        run = response.json()
        await app_context.research_runs.wait_for_active_work()
        saved = app_context.research_runs.get("MAT-DEMO-ORBIT", run["run_id"])
        assert saved["state"] == "completed"
        assert saved["completed"] == 1
        assert saved["results"] and app_context.vault.exists(saved["results"][0]["path"])
