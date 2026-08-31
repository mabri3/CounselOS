from __future__ import annotations

import pytest

from app.models.api import ChatResponse, WorkItemCreate
from app.models.awareness import DevelopmentCandidate, ProviderScanResult, SourceReference
from app.services.research_runs import ResearchRunService
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderSelection


@pytest.mark.asyncio
async def test_research_writes_packet_and_moves_to_explore(app_context):
    result = await app_context.research.run("MAT-DEMO-ORBIT", "What notice and reason-code work is needed?")
    assert app_context.vault.exists(result["path"])
    assert app_context.index.get_matter("MAT-DEMO-ORBIT")["status"] == "explore"
    work_items = app_context.index.list_work_items("MAT-DEMO-ORBIT")
    original = next(item for item in work_items if item["item_type"] == "research")
    assert original["status"] == "open"
    review = next(item for item in work_items if item["item_type"] == "counsel_review")
    review_metadata = app_context.vault.read_markdown(review["path"])["metadata"]
    assert review_metadata["source_kind"] == "research_review"
    assert review_metadata["research_path"] == result["path"]


@pytest.mark.asyncio
async def test_repeated_research_reuses_open_review_item(app_context):
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
async def test_automatic_research_run_is_async_persisted_and_does_not_change_stage(app_context):
    original_stage = app_context.index.get_matter("MAT-DEMO-BEACON")["status"]
    runs = ResearchRunService(app_context.vault, app_context.research)

    started = runs.start("MAT-DEMO-BEACON", ["What issues need research?"])
    assert started["state"] == "queued"
    await runs.wait(started["run_id"])

    completed = runs.get("MAT-DEMO-BEACON", started["run_id"])
    assert completed["state"] == "completed"
    assert completed["completed"] == 1
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == original_stage


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
    path = "03_Matters/beacon-instant-onboarding/research/runs/RUN-OLD.md"
    app_context.vault.write_markdown(
        path,
        "# Old run\n",
        {"run_id": "RUN-OLD", "matter_id": "MAT-DEMO-BEACON", "state": "running"},
    )

    assert runs.mark_running_interrupted() == 1
    assert app_context.vault.read_markdown(path)["metadata"]["state"] == "interrupted"


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
    assert "- Supplied: [Agency guidance](https://example.com/guidance)" in packet["content"]
    assert app_context.index.get_matter("MAT-DEMO-BEACON")["status"] == original_stage


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
