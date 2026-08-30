from __future__ import annotations

import pytest

from app.models.api import ChatResponse, WorkItemCreate
from app.services.research_runs import ResearchRunService


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
