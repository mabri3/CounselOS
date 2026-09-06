from __future__ import annotations

from types import SimpleNamespace

import pytest


def test_annotations_round_trip(app_context):
    assert app_context.annotations.list("MAT-DEMO-APEX") == []
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1",
        quote="…bounded opt-in launch…",
        question="Does that survive an audit?",
        who="Brian Harris",
    )
    assert created["annotation_id"].startswith("ANN-")
    assert created["answered"] is False
    stored = app_context.annotations.list("MAT-DEMO-APEX")
    assert len(stored) == 1
    assert stored[0]["question"] == "Does that survive an audit?"


def test_annotations_unknown_matter_raises(app_context):
    with pytest.raises(KeyError):
        app_context.annotations.list("MAT-NOPE")


@pytest.mark.asyncio
async def test_annotation_answer_is_stored(app_context):
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1",
        quote="…",
        question="What would change this?",
        who="Brian Harris",
    )
    answered = await app_context.annotations.answer(
        "MAT-DEMO-APEX", created["annotation_id"]
    )
    assert answered["answered"] is True
    assert answered["answer"].strip()
    assert app_context.annotations.list("MAT-DEMO-APEX")[0]["answered"] is True


@pytest.mark.asyncio
async def test_annotation_answer_survives_a_hostile_model_reply(
    app_context, monkeypatch
):
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1",
        quote="…",
        question="Q?",
        who="Brian Harris",
    )

    async def boom(_request):
        raise RuntimeError("provider exploded")

    monkeypatch.setattr(app_context.runner, "run", boom)
    with pytest.raises(RuntimeError):
        await app_context.annotations.answer(
            "MAT-DEMO-APEX", created["annotation_id"]
        )
    stored = app_context.annotations.list("MAT-DEMO-APEX")
    assert len(stored) == 1
    assert stored[0]["answered"] is False


@pytest.mark.asyncio
async def test_blank_annotation_answer_is_not_stored(app_context, monkeypatch):
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1",
        quote="…",
        question="Q?",
        who="Brian Harris",
    )

    async def blank(_request):
        return SimpleNamespace(reply="   ")

    monkeypatch.setattr(app_context.runner, "run", blank)
    with pytest.raises(RuntimeError, match="empty answer"):
        await app_context.annotations.answer(
            "MAT-DEMO-APEX", created["annotation_id"]
        )
    assert app_context.annotations.list("MAT-DEMO-APEX")[0]["answered"] is False
