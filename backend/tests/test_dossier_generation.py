"""Contract tests for shared dossier generation, using only a temporary vault."""
from __future__ import annotations

import asyncio
from copy import deepcopy
from dataclasses import replace
import json
import re
from unittest.mock import AsyncMock, Mock

import pytest

import app.services.dossier_generation as generation
from app.providers.base import ProviderReply
from app.services.dossier import WORKSPACE_LOCK
from app.services.dossier_generation import generate_dossier, generate_pending


MATTER = "MAT-DEMO-RELAY"
SKILL = "dossier-generation"


def _instructions(marker):
    return (
        f"Include the exact marker `{marker}` in the Matter summary. "
        "Copy the saved Decision question verbatim. Return dossier Markdown."
    )


class InstructionFollowingProvider:
    def __init__(self, question):
        self.question = question
        self.prompts = []
        self.tools = []
        self.entered = asyncio.Event()
        self.release = asyncio.Event()
        self.pause = False
        self.failure = None

    async def complete(self, messages, tools=None):
        prompt = "\n".join(
            message["content"] if isinstance(message.get("content"), str)
            else json.dumps(message.get("content"), ensure_ascii=False)
            for message in messages
        )
        self.prompts.append(prompt)
        self.tools.append(deepcopy(tools))
        self.entered.set()
        if self.pause:
            await self.release.wait()
        if self.failure is not None:
            raise self.failure
        markers = re.findall(r"Include the exact marker `([^`]+)`", prompt)
        marker = markers[-1] if markers else "Skill instruction missing"
        return ProviderReply(content=(
            "# Matter dossier\n\n## Matter summary\n\n"
            f"{marker}: Review the migration plan and its unresolved consent questions.\n\n"
            f"## Decision question\n\n{self.question}\n\n"
            "## Open questions\n\n- Which institutions still use stored credentials?\n\n"
            "## Next counsel action\n\nObtain the institution list.\n"
        ))


@pytest.fixture
def model(app_context, monkeypatch):
    provider = InstructionFollowingProvider(
        app_context.dossiers.orientation(MATTER)["decision_question"]
    )
    assert provider.question, "Use a fixture with a protected Decision question."
    resolved = replace(app_context.runner.resolve("counsel-copilot"), provider=provider)
    selector = Mock(return_value=resolved)
    monkeypatch.setattr(app_context.runner, "resolve", selector)
    return provider, selector


def _protected_records(app):
    """Include existing decisions so the preservation assertion is not vacuous."""
    root = app.vault.resolve("03_Matters")
    decisions = list(root.glob("*/decisions/*.md"))
    assert decisions
    base = app.matters.matter_path(MATTER)
    paths = [app.vault.resolve(f"{base}/{name}") for name in (
        "facts.md", "recommendations.md",
    )]
    return {app.vault.relative(path): path.read_bytes() for path in [*paths, *decisions]}


def _vault_bytes(app):
    return {
        app.vault.relative(path): path.read_bytes()
        for path in app.vault.root.rglob("*") if path.is_file()
    }


def test_dossier_starter_is_installed_and_normally_editable(app_context):
    original = app_context.skills.get(SKILL)
    assert original.enabled
    assert original.instructions.strip()
    assert app_context.vault.exists(original.path)
    before = app_context.skills.dossier_generation_snapshot()
    assert {"instructions", "revision", "supporting_skills"} <= before.keys()

    updated = app_context.skills.update(SKILL, instructions=_instructions("Edited guide"))
    after = app_context.skills.dossier_generation_snapshot()

    assert app_context.skills.get(SKILL).instructions == updated.instructions
    assert _instructions("Edited guide") in after["instructions"]
    assert after["revision"] != before["revision"]


@pytest.mark.asyncio
async def test_manual_generation_uses_edited_skill_and_preserves_records(app_context, model):
    provider, selector = model
    app_context.skills.update(SKILL, instructions=_instructions("Manual synthesis"))
    before = _protected_records(app_context)
    request = "Generate dossier with a concise migration summary."

    result = await generate_dossier(app_context, MATTER, request=request)

    selector.assert_called_once()
    assert len(provider.prompts) == 1
    assert request in provider.prompts[0]
    assert _instructions("Manual synthesis") in provider.prompts[0]
    assert provider.question in provider.prompts[0]
    assert [tool["function"]["name"] for tool in provider.tools[0]] == ["read_dossier_record"]
    assert {"content", "state", "revision_path", "warnings"} <= result.keys()
    assert result["state"] == "applied"
    assert "Manual synthesis" in result["content"]
    current = app_context.dossiers.get(MATTER)
    revision = app_context.vault.read_markdown(result["revision_path"])
    assert current["content"].strip() == result["content"].strip()
    assert revision["content"].strip() == result["content"].strip()
    assert app_context.dossiers.orientation(MATTER)["decision_question"] == provider.question
    assert _protected_records(app_context) == before


@pytest.mark.asyncio
async def test_supplied_skill_snapshot_stays_frozen_after_edit(app_context, model):
    provider, selector = model
    app_context.skills.update(SKILL, instructions=_instructions("Frozen guide"))
    snapshot = app_context.skills.dossier_generation_snapshot()
    before = deepcopy(snapshot)
    app_context.skills.update(SKILL, instructions=_instructions("Later guide"))

    result = await generate_dossier(
        app_context, MATTER, snapshot=snapshot,
        resolved_provider=selector.return_value, save=False,
    )

    selector.assert_not_called()
    assert len(provider.prompts) == 1
    assert _instructions("Frozen guide") in provider.prompts[0]
    assert _instructions("Later guide") not in provider.prompts[0]
    assert "Frozen guide" in result["content"]
    assert "Later guide" not in result["content"]
    assert snapshot == before


@pytest.mark.asyncio
async def test_preview_returns_model_content_without_any_vault_writes(app_context, model):
    provider, _ = model
    app_context.skills.update(SKILL, instructions=_instructions("Preview synthesis"))
    before = _vault_bytes(app_context)

    result = await generate_dossier(app_context, MATTER, save=False)

    assert len(provider.prompts) == 1
    assert "Preview synthesis" in result["content"]
    assert not result.get("revision_path")
    assert _vault_bytes(app_context) == before


@pytest.mark.asyncio
@pytest.mark.parametrize("changed_record", ["facts", "dossier"])
async def test_edit_during_model_wait_requires_review_without_holding_lock(
    app_context, model, changed_record,
):
    provider, _ = model
    app_context.skills.update(SKILL, instructions=_instructions("Earlier input synthesis"))
    provider.pause = True
    task = asyncio.create_task(generate_dossier(app_context, MATTER))

    def edit_while_waiting():
        # RLock can be reacquired by its owning thread. Probe from a different
        # thread so holding it across the model await cannot pass this test.
        acquired = WORKSPACE_LOCK.acquire(blocking=False)
        assert acquired, "Dossier generation held WORKSPACE_LOCK during the model call."
        try:
            if changed_record == "facts":
                app_context.matter_records.apply_update(
                    MATTER, facts=[{"text": "The migration is now limited to one bank."}],
                    actor="Lawyer", source_action_key="dossier-test-late-fact",
                )
            else:
                current = app_context.dossiers.get(MATTER)
                app_context.vault.update_markdown(
                    current["path"], content=current["content"] + "\nLawyer's live note.\n",
                )
        finally:
            WORKSPACE_LOCK.release()

    try:
        await asyncio.wait_for(provider.entered.wait(), timeout=5)
        await asyncio.wait_for(asyncio.to_thread(edit_while_waiting), timeout=5)
        current_path = app_context.dossiers.get(MATTER)["path"]
        dossier_after_edit = app_context.vault.resolve(current_path).read_bytes()
        records_after_edit = _protected_records(app_context)
    finally:
        provider.release.set()
        result = await asyncio.wait_for(task, timeout=5)

    assert result["state"] == "review_required"
    assert "Earlier input synthesis" in result["content"]
    revision = app_context.vault.read_markdown(result["revision_path"])
    assert "Earlier input synthesis" in revision["content"]
    assert app_context.vault.resolve(current_path).read_bytes() == dossier_after_edit
    assert app_context.dossiers.orientation(MATTER)["decision_question"] == provider.question
    assert _protected_records(app_context) == records_after_edit


@pytest.mark.asyncio
async def test_provider_failure_returns_useful_fallback_and_warning(app_context, model):
    provider, _ = model
    provider.failure = RuntimeError("Synthetic provider failure")
    before = _protected_records(app_context)

    result = await generate_dossier(app_context, MATTER)

    assert provider.prompts
    assert result["content"].strip()
    assert provider.question in result["content"]
    assert result["warnings"]
    assert app_context.dossiers.orientation(MATTER)["decision_question"] == provider.question
    assert _protected_records(app_context) == before


@pytest.mark.asyncio
async def test_pending_programmatic_projection_uses_shared_generator(app_context, model, monkeypatch):
    provider, _ = model
    app_context.skills.update(SKILL, instructions=_instructions("Automatic synthesis"))
    current = app_context.dossiers.get(MATTER)
    fallback = app_context.dossiers.propose_update(
        MATTER, current["content"] + "\nProgrammatic projection added work context.\n",
        expected_hash=app_context.dossiers.content_hash(MATTER),
    )
    assert fallback["state"] == "applied"
    before = _protected_records(app_context)
    shared_generator = AsyncMock(wraps=generate_dossier)
    monkeypatch.setattr(generation, "generate_dossier", shared_generator)

    await generate_pending(app_context, since=0, matter_id=MATTER)

    shared_generator.assert_awaited_once()
    assert len(provider.prompts) == 1
    assert _instructions("Automatic synthesis") in provider.prompts[0]
    assert "Automatic synthesis" in app_context.dossiers.get(MATTER)["content"]
    assert app_context.dossiers.orientation(MATTER)["decision_question"] == provider.question
    assert _protected_records(app_context) == before
