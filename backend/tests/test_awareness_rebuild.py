from __future__ import annotations

import sqlite3
from datetime import UTC, datetime

from app.models.awareness import (
    BriefingItem,
    BriefingQuery,
    DevelopmentCandidate,
    PublicWatchQuery,
    SourceReference,
    WatchDraftCreate,
)
from app.services.index import IndexService, SCHEMA_VERSION


def test_old_or_missing_sqlite_rebuilds_all_awareness_views_from_markdown(app_context):
    watch = app_context.watches.create_draft(WatchDraftCreate(
        title="Rebuild watch",
        standing_question="What public rule changed?",
        public_query=PublicWatchQuery(
            standing_question="What public rule changed?", topics=["rebuild-topic"]
        ),
        purposes=["awareness"],
    ))
    development = app_context.developments.record_candidates(watch.watch_id, "native", [DevelopmentCandidate(
        title="Rebuild rule",
        canonical_url="https://agency.example/rebuild",
        content_hash="rebuild-v1",
        sources=[SourceReference(
            title="Agency rule", canonical_url="https://agency.example/rebuild"
        )],
    )]).developments[0]
    now = datetime.now(UTC)
    item = app_context.briefing.put_item(BriefingItem(
        item_id="ITEM-REBUILD",
        path="pending",
        development_id=development.development_id,
        watch_id=watch.watch_id,
        title="Rebuild rule",
        summary="A public rule changed.",
        why_shown="It matches the rebuild watch.",
        topics=["rebuild-topic"],
        sources=[SourceReference(
            title="Agency rule", canonical_url="https://agency.example/rebuild"
        )],
        created_at=now,
        updated_at=now,
    ))
    app_context.index.rebuild()
    expected = app_context.index.query_briefing(BriefingQuery(
        watch=[watch.watch_id], topic=["rebuild-topic"]
    ))
    assert [entry.item_id for entry in expected.items] == [item.item_id]

    db_path = app_context.index.db_path
    db_path.unlink()
    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA user_version=1")
        connection.execute("CREATE TABLE obsolete_cache (value TEXT)")

    rebuilt = IndexService(db_path, app_context.vault)
    actual = rebuilt.query_briefing(expected.resolved_query)
    assert [entry.model_dump(mode="json") for entry in actual.items] == [
        entry.model_dump(mode="json") for entry in expected.items
    ]
    with sqlite3.connect(db_path) as connection:
        assert connection.execute("PRAGMA user_version").fetchone()[0] == SCHEMA_VERSION
        assert connection.execute(
            "SELECT COUNT(*) FROM developments WHERE development_id = ?",
            (development.development_id,),
        ).fetchone()[0] == 1
        assert connection.execute(
            "SELECT COUNT(*) FROM watches WHERE watch_id = ?", (watch.watch_id,)
        ).fetchone()[0] == 1
        assert not connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='obsolete_cache'"
        ).fetchone()


def test_app_context_rebuilds_the_index_once_when_starting_with_an_outdated_cache(tmp_path, monkeypatch):
    from app.config import Settings
    from app.runtime import AppContext

    vault = tmp_path / "vault"
    from tests.conftest import copy_test_vault
    copy_test_vault(vault)
    calls = []
    original_rebuild = IndexService.rebuild

    def counted_rebuild(self):
        calls.append(self)
        return original_rebuild(self)

    monkeypatch.setattr(IndexService, "rebuild", counted_rebuild)

    AppContext(Settings(vault_path=str(vault), scheduler_enabled=False, search_provider="disabled"))

    assert len(calls) == 1
