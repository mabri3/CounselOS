from __future__ import annotations

import asyncio

import pytest

from app.models.api import ChatRequest, ChatResponse, WorkItemCreate
from app.intelligence.polaris import PolarisProviderResult
from app.models.awareness import DevelopmentCandidate, ProviderScanResult, SourceReference
from app.services.research_runs import ResearchRunService
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderSelection
from app.tools.handlers import run_research
from app.tools.registry import ToolExecutionContext


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
    first = await app_context.research.run("MAT-DEMO-ORBIT", "First question")
    first_items = app_context.index.list_work_items("MAT-DEMO-ORBIT")
    first_review = next(
        item for item in first_items
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    )

    second = await app_context.research.run("MAT-DEMO-ORBIT", "Second question")
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
    await app_context.research.run("MAT-DEMO-ORBIT", "First question")
    review = next(
        item for item in app_context.index.list_work_items("MAT-DEMO-ORBIT")
        if app_context.vault.read_markdown(item["path"])["metadata"].get("source_kind") == "research_review"
    )
    app_context.vault.update_markdown(review["path"], metadata_updates={"status": "done"})
    app_context.index.rebuild()

    await app_context.research.run("MAT-DEMO-ORBIT", "Second question")
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
async def test_research_uses_bound_research_agent_without_changing_manual_behavior(app_context):
    requests = []

    async def run_agent(request):
        requests.append(request)
        return ChatResponse(reply="Configured agent analysis.")

    app_context.research.bind_agent_runner(run_agent)
    result = await app_context.research.run("MAT-DEMO-ORBIT", "Which rules control?")

    assert requests[0].agent_id == "research-agent"
    assert "Configured agent analysis" in app_context.vault.read_markdown(result["path"])["content"]
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "explore"


@pytest.mark.asyncio
async def test_research_refreshes_precomputed_dossier_orientation(app_context):
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
    result = await app_context.research.run(
        "MAT-DEMO-ORBIT",
        "What notice and reason-code work is needed?",
        change_stage=False,
    )

    assert result["orientation_warning"] is None
    assert app_context.dossiers.orientation("MAT-DEMO-ORBIT") == {
        "summary": (
            "Orbit uses an automated notice process that may need updated reason codes. "
            "Counsel must resolve the notice approach before launch."
        ),
        "decision_question": "Should Orbit block launch until the new reason codes are in every notice?",
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
async def test_research_run_reuses_saved_provider_selection(app_context):
    provider = object()
    selection = ProviderSelection(
        agent_id="research-agent", provider="codex", model="saved-model",
        reasoning_effort="high",
    )
    resolved = ResolvedAgentProvider(provider=provider, selection=selection)
    seen = []

    async def run_agent(_request, *, resolved_provider=None):
        seen.append(resolved_provider)
        return ChatResponse(reply="Saved selection analysis.")

    app_context.research.bind_agent_runner(run_agent)
    runs = ResearchRunService(
        app_context.vault,
        app_context.research,
        resolve_agent=lambda: resolved,
        resolve_selection=lambda saved: ResolvedAgentProvider(provider=provider, selection=saved),
    )
    started = runs.start("MAT-DEMO-BEACON", ["One", "Two"])
    assert started["selection"]["model"] == "saved-model"
    await runs.wait(started["run_id"])

    assert len(seen) == 2
    assert all(item is not None and item.selection == selection for item in seen)


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
async def test_chat_research_tool_returns_while_background_run_is_active(app_context):
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
    await entered.wait()

    active = app_context.research_runs.list("MAT-DEMO-BEACON")
    assert len(active) == 1
    assert active[0]["state"] == "running"
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "research"

    assert result["data"]["run_id"] == active[0]["run_id"]
    assert result["data"]["state"] in {"queued", "running"}
    assert result["changed_paths"] == [active[0]["path"]]

    release.set()
    await app_context.research_runs.wait(active[0]["run_id"])
    completed = app_context.research_runs.get("MAT-DEMO-BEACON", active[0]["run_id"])

    assert completed["state"] == "completed"
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == "explore"


@pytest.mark.asyncio
async def test_chat_reply_contains_polling_card_for_background_research(app_context):
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
    await entered.wait()

    card = next(item for item in response.cards if item.type == "research_status")
    assert card.state in {"queued", "running"}
    assert card.status in {"Research is queued.", "Research is running."}

    release.set()
    await app_context.research_runs.wait(card.run_id)


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
        resolve_agent=fail_resolution,
    )

    with pytest.raises(ValueError, match="Saved provider is unavailable"):
        runs.start("MAT-DEMO-ORBIT", ["What applies?"])

    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "intake"
    assert runs.list("MAT-DEMO-ORBIT") == []


@pytest.mark.asyncio
async def test_automatic_research_is_limited_to_three_questions(app_context):
    runs = ResearchRunService(app_context.vault, app_context.research)

    started = runs.start("MAT-DEMO-BEACON", ["One", "Two", "Three", "Four"])
    await runs.wait(started["run_id"])
    completed = runs.get("MAT-DEMO-BEACON", started["run_id"])

    assert completed["questions"] == ["One", "Two", "Three"]
    assert completed["total"] == 3


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
    async def malformed_search(_query, *, matter_path=None):
        return {"internal": [{"snippet": "Useful lead without a path"}], "external": []}

    app_context.research.search.search = malformed_search
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

    async def search(_query, *, matter_path=None):
        return {
            "internal": [{
                "path": source_path,
                "title": "Launch Policy",
                "snippet": (
                    "--- record_type: internal_policy matter_id: MAT-DEMO-BEACON "
                    "secret_internal_key: do-not-display --- raw search material"
                ),
            }],
            "external": [],
        }

    app_context.research.search.search = search
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "What applies?", change_stage=False
    )
    sources = app_context.vault.read_markdown(result["path"])["content"].split(
        "## Sources surfaced\n\n", 1
    )[1].split("\n\n## Last-mile work", 1)[0]

    assert "Launch Policy" in sources
    assert "The limited pilot needs a manual review before launch." in sources
    assert source_path not in sources
    assert "secret_internal_key" not in sources
    assert "record_type:" not in sources
    assert len(sources) <= 260


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

    async def search(_query, *, matter_path=None):
        return {"internal": [{"path": path, "title": kind} for path, kind in sources], "external": []}

    app_context.research.search.search = search
    result = await app_context.research.run(
        "MAT-DEMO-BEACON", "What support applies?", change_stage=False
    )
    content = app_context.vault.read_markdown(result["path"])["content"]
    assert "**facts**" in content
    assert content.count("Useful body") == 2
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

    result = await app_context.research.run(
        "MAT-DEMO-BEACON",
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
async def test_polaris_failure_observability_is_shown_and_persisted_with_fallback(app_context):
    class Polaris:
        configured = True

        async def research(self, _query):
            return PolarisProviderResult(
                provider_id="polaris",
                status="failed",
                warnings=["Polaris request failed (timeout)."],
                observability={
                    "failure_class": "timeout",
                    "attempt_count": 3,
                    "elapsed_ms": 1250,
                    "fallback_status": "pending",
                },
            )

    async def no_native_results(_query):
        return {"external": [], "warning": "Native public research was unavailable."}

    async def useful_local_analysis(_request, *, resolved_provider=None):
        return ChatResponse(reply="Useful local fallback analysis remains available.")

    app_context.research.bind_polaris(Polaris())
    app_context.research.search.search_external = no_native_results
    app_context.research.bind_agent_runner(useful_local_analysis)
    runs = ResearchRunService(app_context.vault, app_context.research)

    started = runs.start("MAT-DEMO-BEACON", ["What public federal rules apply?"])
    await runs.wait(started["run_id"])

    run = runs.get("MAT-DEMO-BEACON", started["run_id"])
    result = run["results"][0]
    packet = app_context.vault.read_markdown(result["path"])
    expected = {
        "failure_class": "timeout",
        "attempt_count": 3,
        "elapsed_ms": 1250,
        "fallback_status": "analysis_preserved",
    }
    assert result["polaris_observability"] == expected
    assert run["provider_observability"] == [expected]
    assert packet["metadata"]["polaris_observability"] == expected
    assert "Useful local fallback analysis remains available." in packet["content"]
    assert (
        "Polaris status: failed; class: timeout; attempts: 3; elapsed: 1250 ms; "
        "fallback: analysis_preserved."
    ) in packet["content"]


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

    result = await app_context.research.run(
        "MAT-DEMO-BEACON",
        "What rules apply to MAT-DEMO-BEACON?",
        change_stage=False,
    )
    packet = app_context.vault.read_markdown(result["path"])

    assert not polaris.called
    assert not external_queries
    assert result["polaris_status"] == "privacy_blocked"
    assert "External research privacy check blocked this question" in packet["metadata"]["warning"]
