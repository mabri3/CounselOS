"""Dossier commit integrity at the ordinary editor and first-generation boundaries."""
from __future__ import annotations

import asyncio
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from threading import Event, get_ident

import pytest

from app.models.api import FileUpdate
from app.providers.base import ProviderReply
from app.routers import files
from app.services import dossier
from app.services.dossier_generation import generate_dossier


MATTER = "MAT-DEMO-BEACON"
GENERATED = "# Dossier\n\n## Matter summary\n\nGenerated from the captured facts.\n"


class WaitingWriter:
    def __init__(self):
        self.entered = asyncio.Event()
        self.release = asyncio.Event()

    async def complete(self, messages, tools=None):
        assert not tools
        self.entered.set()
        await self.release.wait()
        return ProviderReply(content=GENERATED)


@pytest.mark.asyncio
@pytest.mark.parametrize("change_facts", [False, True])
async def test_first_dossier_checks_captured_basis(app_context, change_facts):
    app = app_context
    assert app.dossiers.get(MATTER) is None
    writer = WaitingWriter()
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=writer)
    task = asyncio.create_task(generate_dossier(app, MATTER, resolved_provider=resolved))
    root = app.matters.matter_path(MATTER)
    try:
        await asyncio.wait_for(writer.entered.wait(), timeout=5)
        if change_facts:
            facts = app.vault.read_markdown(root + "/facts.md")
            app.vault.update_markdown(
                facts["path"], content=facts["content"] + "\nReported update: the pilot excludes minors.\n",
            )
        protected_paths = [app.vault.resolve(root + "/" + name) for name in (
            "facts.md", "recommendations.md",
        )]
        protected_paths.extend(app.vault.resolve("03_Matters").glob("*/decisions/*.md"))
        protected = {path: path.read_bytes() for path in protected_paths}
    finally:
        writer.release.set()
        result = await asyncio.wait_for(task, timeout=5)

    expected_state = "review_required" if change_facts else "applied"
    assert result["state"] == expected_state, result
    revision = app.vault.read_markdown(result["revision_path"])
    assert GENERATED.strip() in revision["content"]
    assert revision["metadata"]["status"] == ("draft" if change_facts else "applied")
    if change_facts:
        assert app.dossiers.get(MATTER) is None
        assert result["warnings"]
    else:
        assert app.dossiers.get(MATTER)["content"] == revision["content"]
    assert {path: path.read_bytes() for path in protected} == protected


def test_editor_save_cannot_interleave_dossier_hash_check_and_write(app_context, monkeypatch):
    app = app_context
    first = app.dossiers.propose_update(MATTER, "# Dossier\n\nInitial summary.\n", expected_hash=None, generated=True)
    path = first["path"]
    original = app.vault.read_markdown(path)
    human_text = original["content"] + "\nLawyer's saved correction.\n"
    checked_hash = Event()
    release_commit = Event()
    editor_threads = set()
    real_lock = dossier.WORKSPACE_LOCK
    write_revision = app.dossiers._write_revision

    class ObservedLock:
        """Keep the real lock; release the paused commit when the editor attempts it."""
        def __enter__(self):
            if get_ident() in editor_threads:
                release_commit.set()
            return real_lock.__enter__()

        def __exit__(self, *args):
            return real_lock.__exit__(*args)

    def pause_after_hash_check(*args, **kwargs):
        checked_hash.set()
        assert release_commit.wait(timeout=5), "Editor never attempted its save."
        return write_revision(*args, **kwargs)

    def save_editor():
        editor_threads.add(get_ident())
        try:
            return files.update_file(
                FileUpdate(content=human_text, metadata=original["metadata"]), path=path, context=app,
            )
        finally:
            # Without the shared editor lock, finish the human write before
            # letting generation overwrite it. With the lock, it waits above.
            release_commit.set()

    monkeypatch.setattr(dossier, "WORKSPACE_LOCK", ObservedLock())
    monkeypatch.setattr(app.dossiers, "_write_revision", pause_after_hash_check)
    with ThreadPoolExecutor(max_workers=2) as pool:
        generated = pool.submit(
            app.dossiers.propose_update, MATTER, GENERATED,
            expected_hash=first["content_hash"], generated=True,
        )
        try:
            assert checked_hash.wait(timeout=5), "Generation never reached its commit."
            edited = pool.submit(save_editor)
            result = generated.result(timeout=5)
            edit_result = edited.result(timeout=5)
        finally:
            release_commit.set()

    assert result["state"] == "applied"
    assert edit_result["status"] == "saved"
    assert app.dossiers.get(MATTER)["content"].strip() == human_text.strip()
    assert app.vault.read_markdown(result["revision_path"])["content"].strip() == GENERATED.strip()
