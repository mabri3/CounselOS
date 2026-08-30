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
