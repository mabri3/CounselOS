import pytest

from app.tools.registry import ToolExecutionContext


@pytest.mark.asyncio
async def test_typed_tools_use_context_actor_and_generic_write_is_protected(app_context):
    agent = app_context.agents.get("counsel-copilot")
    context = ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON", lawyer_author="Counsel")
    saved = await app_context.tools.execute(agent, context, "save_work_product", {"title": "Answer", "content": "Draft", "kind": "response"})
    assert saved.status == "success"
    missing_path = await app_context.tools.execute(agent, context, "write_markdown", {"content": "No path"})
    protected = await app_context.tools.execute(agent, context, "write_markdown", {"path": "03_Matters/beacon-instant-onboarding/recommendations.md", "content": "Bad"})
    assert missing_path.status == protected.status == "error"
    no_actor = await app_context.tools.execute(agent, ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON"), "complete_work_item", {"work_item_id": "WI-X"})
    assert no_actor.status == "error"


@pytest.mark.asyncio
async def test_save_work_product_forwards_retry_key_and_is_idempotent(app_context):
    agent = app_context.agents.get("counsel-copilot")
    context = ToolExecutionContext(
        app_context,
        matter_id="MAT-DEMO-BEACON",
        source_action_key="chat:RUN-1:tool:save",
    )

    first = await app_context.tools.execute(
        agent, context, "save_work_product",
        {"title": "Retry-safe answer", "content": "Useful body", "kind": "response"},
    )
    second = await app_context.tools.execute(
        agent, context, "save_work_product",
        {"title": "Retry-safe answer", "content": "Useful body", "kind": "response"},
    )

    assert first.status == second.status == "success"
    assert first.data["vault_path"] == second.data["vault_path"]
    assert second.changed_paths == []
    saved = app_context.vault.read_markdown(first.data["vault_path"])
    assert saved["metadata"]["source_action_key"] == context.source_action_key


def test_source_action_keys_are_available_to_record_contracts():
    from app.models.api import DecisionCreate, IntakeTurn, ResearchRunStart, WorkItemCreate

    key = "chat:RUN-1:tool-2"
    assert WorkItemCreate(matter_id="MAT-1", title="Follow up", source_action_key=key).source_action_key == key
    assert DecisionCreate(matter_id="MAT-1", title="Choice", chosen_path="Ship", source_action_key=key).source_action_key == key
    assert IntakeTurn(working_ask="Assess launch", intake_state="complete", source_action_key=key).source_action_key == key
    assert ResearchRunStart(question="Check rule", source_action_key=key).source_action_key == key


@pytest.mark.asyncio
async def test_recommendation_save_returns_a_non_finalizable_record(app_context):
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON"),
        "save_work_product",
        {"title": "Launch path", "content": "Ship with controls.", "kind": "recommendation"},
    )

    assert result.status == "success"
    assert result.data == {
        "record_type": "recommendation",
        "title": "Launch path",
        "path": "03_Matters/beacon-instant-onboarding/recommendations.md",
    }


@pytest.mark.asyncio
async def test_save_work_product_revises_the_existing_canonical_draft(app_context):
    agent = app_context.agents.get("counsel-copilot")
    context = ToolExecutionContext(
        app_context,
        matter_id="MAT-DEMO-BEACON",
        review_author="Themis",
        lawyer_author="Counsel",
    )
    created = await app_context.tools.execute(
        agent,
        context,
        "save_work_product",
        {"title": "Customer answer", "content": "First version", "kind": "response"},
    )
    original = app_context.vault.read_markdown(created.data["vault_path"])

    revised = await app_context.tools.execute(
        agent,
        context,
        "save_work_product",
        {
            "title": "A renamed answer",
            "content": "Second version",
            "kind": "response",
            "existing_draft_path": created.data["vault_path"],
        },
    )

    updated = app_context.vault.read_markdown(created.data["vault_path"])
    assert revised.status == "success"
    assert revised.data["vault_path"] == created.data["vault_path"]
    assert revised.data["title"] == "Customer answer"
    assert updated["metadata"]["work_product_id"] == original["metadata"]["work_product_id"]
    assert updated["metadata"]["title"] == "Customer answer"
    assert updated["metadata"]["review"]["tracking"] is True
    assert updated["content"].strip() == "Second version"


@pytest.mark.asyncio
async def test_save_work_product_without_path_revises_current_canonical_draft(app_context):
    agent = app_context.agents.get("counsel-copilot")
    context = ToolExecutionContext(
        app_context,
        matter_id="MAT-DEMO-BEACON",
        review_author="Themis.ai",
        lawyer_author="Counsel",
    )
    created = await app_context.tools.execute(
        agent,
        context,
        "save_work_product",
        {"title": "Customer answer", "content": "The deliverable body", "kind": "draft"},
    )
    revised = await app_context.tools.execute(
        agent,
        context,
        "save_work_product",
        {"title": "Summary text that must not replace the title", "content": "The revised deliverable body", "kind": "draft"},
    )

    assert revised.status == "success"
    assert revised.data["vault_path"] == created.data["vault_path"]
    assert revised.data["title"] == "Customer answer"
    assert app_context.vault.read_markdown(created.data["vault_path"])["content"].strip() == "The revised deliverable body"


@pytest.mark.asyncio
@pytest.mark.parametrize("invalid_path", [
    "03_Matters/beacon-instant-onboarding/recommendations.md",
    "03_Matters/apex-data-retention/work-product/draft/other.md",
    "03_Matters/beacon-instant-onboarding/work-product/draft/../final/other.md",
])
async def test_save_work_product_rejects_invalid_existing_draft_paths(app_context, invalid_path):
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON"),
        "save_work_product",
        {
            "title": "Answer",
            "content": "Revision",
            "kind": "response",
            "existing_draft_path": invalid_path,
        },
    )

    assert result.status == "error"


@pytest.mark.asyncio
async def test_save_work_product_rejects_a_final_as_an_existing_draft(app_context):
    draft = app_context.work_products.create_draft(
        "MAT-DEMO-BEACON", title="Final target", content="Draft"
    )
    final = app_context.work_products.finalize("MAT-DEMO-BEACON", draft["vault_path"])
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON"),
        "save_work_product",
        {
            "title": "Final target",
            "content": "Changed",
            "kind": "response",
            "existing_draft_path": final["vault_path"],
        },
    )

    assert result.status == "error"


@pytest.mark.asyncio
@pytest.mark.parametrize("path", [
    "/tmp/note.md",
    "03_Matters/beacon-instant-onboarding/../outside.md",
    "03_Matters\\beacon-instant-onboarding\\note.md",
])
async def test_generic_write_rejects_absolute_traversal_and_backslash_paths(app_context, path):
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON", lawyer_author="Counsel"),
        "write_markdown",
        {"path": path, "content": "Hostile path"},
    )
    assert result.status == "error"


@pytest.mark.asyncio
@pytest.mark.parametrize("relative", ["work-product/draft/legacy.md", "work-product/final/legacy.md"])
async def test_generic_write_protects_legacy_work_product_folders_after_settings_change(app_context, relative):
    app_context.settings_store.write({
        "matter_files.draft_outputs_dir": "lawyer-work/drafts",
        "matter_files.final_outputs_dir": "lawyer-work/finals",
    })
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON", lawyer_author="Counsel"),
        "write_markdown",
        {"path": f"03_Matters/beacon-instant-onboarding/{relative}", "content": "Do not write"},
    )
    assert result.status == "error"


@pytest.mark.asyncio
async def test_generic_write_rejects_root_work_product(app_context):
    agent = app_context.agents.get("counsel-copilot")
    result = await app_context.tools.execute(
        agent,
        ToolExecutionContext(app_context, matter_id="MAT-DEMO-BEACON", lawyer_author="Counsel"),
        "write_markdown",
        {
            "path": "03_Matters/beacon-instant-onboarding/work-product.md",
            "content": "Do not create a loose work product",
        },
    )

    assert result.status == "error"
    assert not app_context.vault.exists(
        "03_Matters/beacon-instant-onboarding/work-product.md"
    )
