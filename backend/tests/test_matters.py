from __future__ import annotations

from app.models.api import MatterCreate


def test_sample_matters_index_and_stage_move(app_context):
    matters = app_context.matters.list()
    assert len(matters) >= 6
    apex = next(matter for matter in matters if matter["matter_id"] == "MAT-DEMO-APEX")
    assert apex["status"] == "explore"

    updated = app_context.matters.move_stage(apex["matter_id"], "generate", reason="Test move")
    assert updated["status"] == "generate"
    record = app_context.vault.read_markdown(f"{updated['path']}/matter.md")
    assert record["metadata"]["status"] == "generate"


def test_create_matter_builds_structured_folder(app_context):
    created = app_context.matters.create(
        MatterCreate(
            title="Test Product Change",
            request_text="Can we launch the new setting next week?",
            matter_type="product_change",
            legal_owner="Counsel",
        )
    )
    assert created["status"] == "intake"
    assert app_context.vault.exists(f"{created['path']}/request.md")
    assert app_context.vault.exists(f"{created['path']}/facts.md")
    assert app_context.vault.exists(f"{created['path']}/work-items")
    request = app_context.vault.read_markdown(f"{created['path']}/request.md")
    assert request["metadata"]["immutable"] is True
