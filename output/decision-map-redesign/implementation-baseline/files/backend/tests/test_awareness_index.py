from __future__ import annotations

import sqlite3
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

from app.models.awareness import (
    BriefingItem, BriefingQuery, PublicWatchQuery, SourceReference, Watch,
    WatchSource,
)
from app.services.index import SCHEMA_VERSION, TABLE_COLUMNS, IndexService
from app.services.vault import VaultService


NOW = datetime(2026, 8, 29, 12, tzinfo=UTC)


def _watch(path: str = "00_System/legal-awareness/watches/WATCH-1.md") -> Watch:
    return Watch(
        watch_id="WATCH-1",
        path=path,
        title="Agency updates",
        standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"),
        purposes=["awareness"],
        sources=[
            WatchSource(
                source_id="SRC-1",
                name="Agency",
                canonical_url="https://agency.example.gov/news",
                source_type="regulator_material",
                role="primary",
            )
        ],
        created_at=NOW,
        updated_at=NOW,
    )


def _item(item_id: str, *, hours: int, read: bool = False) -> BriefingItem:
    path = f"05_Briefing/items/{item_id}.md"
    return BriefingItem(
        item_id=item_id,
        path=path,
        development_id=f"DEV-{item_id}",
        watch_id="WATCH-1",
        title=f"Agency item {item_id}",
        summary="A privacy rule changed.",
        why_shown="It matches the privacy watch.",
        topics=["privacy"],
        jurisdictions=["US"],
        sources=[
            SourceReference(
                title="Agency release",
                canonical_url="https://agency.example.gov/news",
                publisher="Agency",
            )
        ],
        read=read,
        potential_impact="high" if item_id == "ITEM-2" else "low",
        created_at=NOW + timedelta(hours=hours),
        updated_at=NOW + timedelta(hours=hours),
    )


def _write(vault: VaultService, record: object) -> None:
    vault.write_markdown(
        getattr(record, "path"),
        f"# {getattr(record, 'title', 'Record')}",
        record.model_dump(mode="json"),
    )


@pytest.fixture()
def awareness_index(tmp_path: Path) -> tuple[IndexService, VaultService, Path]:
    vault = VaultService(tmp_path / "vault")
    _write(vault, _watch())
    _write(vault, _item("ITEM-1", hours=1))
    _write(vault, _item("ITEM-2", hours=2, read=True))
    db_path = tmp_path / "cache" / "index.db"
    return IndexService(db_path, vault), vault, db_path


def test_rebuild_indexes_and_queries_all_briefing_filters(awareness_index):
    index, _, _ = awareness_index
    report = index.rebuild()

    page = index.query_briefing(
        BriefingQuery(
            watch=["WATCH-1"],
            source=["https://agency.example.gov/news"],
            topic=["privacy"],
            jurisdiction=["US"],
            source_type=["regulator_material"],
            source_role=["primary"],
            read="no",
            impact="low",
            sort="newest",
            group="watch",
        )
    )

    assert report.error_count == 0
    assert [item.item_id for item in page.items] == ["ITEM-1"]
    assert page.total == 1
    assert page.resolved_query.group == "watch"


def test_source_classification_requires_exact_watch_url(awareness_index):
    index, vault, _ = awareness_index
    item = _item("ITEM-3", hours=3)
    item = item.model_copy(
        update={
            "sources": [
                SourceReference(
                    title="Agency copy",
                    canonical_url="https://agency.example.gov/news/",
                )
            ]
        }
    )
    _write(vault, item)
    index.rebuild()

    page = index.query_briefing(BriefingQuery(source_role=["primary"]))

    assert {record.item_id for record in page.items} == {"ITEM-1", "ITEM-2"}


def test_cursor_is_stable_and_rebuild_after_database_deletion_is_reproducible(awareness_index):
    index, vault, db_path = awareness_index
    first = index.query_briefing(BriefingQuery(limit=1))
    second = index.query_briefing(BriefingQuery(limit=1, cursor=first.next_cursor))
    expected = [first.items[0].item_id, second.items[0].item_id]

    db_path.unlink()
    rebuilt = IndexService(db_path, vault)
    first_again = rebuilt.query_briefing(BriefingQuery(limit=1))
    second_again = rebuilt.query_briefing(
        BriefingQuery(limit=1, cursor=first_again.next_cursor)
    )

    assert expected == [first_again.items[0].item_id, second_again.items[0].item_id]
    assert first.total == first_again.total == 2


def test_pre_awareness_database_is_rebuilt_on_startup(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    _write(vault, _watch())
    _write(vault, _item("ITEM-1", hours=1))
    db_path = tmp_path / "index.db"
    with sqlite3.connect(db_path) as connection:
        connection.execute("CREATE TABLE matters (matter_id TEXT PRIMARY KEY)")
        connection.execute("INSERT INTO matters VALUES ('STALE')")

    index = IndexService(db_path, vault)

    with sqlite3.connect(db_path) as connection:
        assert connection.execute("PRAGMA user_version").fetchone()[0] == SCHEMA_VERSION
        assert connection.execute("SELECT count(*) FROM briefing_items").fetchone()[0] == 1
    assert index.query_briefing(BriefingQuery()).total == 1


def test_malformed_record_is_reported_without_hiding_valid_records(awareness_index):
    index, vault, _ = awareness_index
    malformed_path = "05_Briefing/items/BROKEN.md"
    vault.write_markdown(malformed_path, "# Broken", {"item_id": "BROKEN"})
    before = vault.read_text(malformed_path)

    report = index.rebuild()

    assert report.error_count == 1
    assert malformed_path in report.errors[0]
    assert index.query_briefing(BriefingQuery()).total == 2
    assert vault.read_text(malformed_path) == before


def test_failed_atomic_rebuild_keeps_last_usable_database(awareness_index, monkeypatch):
    index, _, _ = awareness_index
    before = index.query_briefing(BriefingQuery()).total

    def fail(_connection):
        raise RuntimeError("forced rebuild failure")

    monkeypatch.setattr(index, "_build", fail)
    with pytest.raises(RuntimeError, match="forced rebuild failure"):
        index.rebuild()

    assert index.query_briefing(BriefingQuery()).total == before


@pytest.mark.asyncio
async def test_rebuild_async_runs_the_existing_rebuild_through_to_thread(awareness_index, monkeypatch):
    index, _, _ = awareness_index
    report = index.last_report
    calls = []

    async def fake_to_thread(function):
        calls.append(function)
        return function()

    monkeypatch.setattr("app.services.index.asyncio.to_thread", fake_to_thread)
    monkeypatch.setattr(index, "rebuild", lambda: report)

    assert await index.rebuild_async() is report
    assert len(calls) == 1


def test_explicit_index_column_mappings_match_the_created_schema(awareness_index):
    index, _, _ = awareness_index

    with index._connect() as connection:
        actual = {
            table: tuple(row["name"] for row in connection.execute(f"PRAGMA table_info({table})"))
            for table in TABLE_COLUMNS
        }

    assert actual == TABLE_COLUMNS


def test_briefing_query_uses_sql_for_overlapping_filters_and_cursor(awareness_index, monkeypatch):
    index, vault, _ = awareness_index
    overlapping = _item("ITEM-3", hours=3).model_copy(update={
        "topics": ["privacy", "ai"],
        "jurisdictions": ["US", "CA"],
    })
    _write(vault, overlapping)
    index.rebuild()

    def markdown_read_is_not_a_page_filter(_path):
        raise AssertionError("briefing pages must be read entirely from SQLite")

    monkeypatch.setattr(vault, "read_markdown", markdown_read_is_not_a_page_filter)
    first = index.query_briefing(BriefingQuery(
        topic=["ai", "privacy"], jurisdiction=["CA", "US"], limit=1,
    ))
    second = index.query_briefing(BriefingQuery(
        topic=["ai", "privacy"], jurisdiction=["CA", "US"],
        limit=1, cursor=first.next_cursor,
    ))

    assert [item.item_id for item in first.items] == ["ITEM-3"]
    assert first.total == 3
    assert [item.item_id for item in second.items] == ["ITEM-2"]
    assert second.total == 3


@pytest.mark.parametrize(
    ("sort", "query", "expected"),
    [
        ("newest", {}, ["ITEM-2", "ITEM-1"]),
        ("relevance", {"q": "privacy"}, ["ITEM-2", "ITEM-1"]),
        ("potential_impact", {}, ["ITEM-2", "ITEM-1"]),
        ("primary_sources", {}, ["ITEM-2", "ITEM-1"]),
        ("effective_date", {}, ["ITEM-2", "ITEM-1"]),
        ("unread", {}, ["ITEM-1", "ITEM-2"]),
        ("connected_decisions", {}, ["ITEM-2", "ITEM-1"]),
    ],
)
def test_briefing_sql_sort_variants_keep_stable_ties(awareness_index, sort, query, expected):
    index, _, _ = awareness_index

    page = index.query_briefing(BriefingQuery(sort=sort, **query))

    assert [item.item_id for item in page.items] == expected


def test_fts_search_schema_and_rebuild_replace_stale_content(awareness_index):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/search.md", "# Search\n\noldneedle", {})
    index.rebuild()

    with index._connect() as connection:
        sql = connection.execute(
            "SELECT sql FROM sqlite_master WHERE name = 'vault_search'"
        ).fetchone()[0]
    assert "VIRTUAL TABLE" in sql.upper()
    assert "FTS5" in sql.upper()
    assert [item["path"] for item in index.lexical_search("oldneedle")] == [
        "notes/search.md"
    ]

    vault.write_markdown("notes/search.md", "# Search\n\nnewneedle", {})
    index.rebuild()

    assert index.lexical_search("oldneedle") == []
    assert [item["path"] for item in index.lexical_search("newneedle")] == [
        "notes/search.md"
    ]


def test_indexed_search_keeps_the_legacy_lexical_result_contract(awareness_index):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/first.md", "# First\n\nprivacy privacy", {})
    vault.write_markdown("notes/second.md", "# Second\n\nprivacy policy", {})
    index.rebuild()

    assert index.lexical_search("privacy policy", relative_path="notes", limit=1) == (
        vault.lexical_search("privacy policy", relative_path="notes", limit=1)
    )


def test_indexed_search_keeps_legacy_substring_matching(awareness_index):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/privacy.md", "# Privacy\n\nprivacy review", {})
    index.rebuild()

    assert index.lexical_search("priv", relative_path="notes") == (
        vault.lexical_search("priv", relative_path="notes")
    )


def test_indexed_search_prunes_candidates_without_a_full_content_scan(
    awareness_index, monkeypatch,
):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/privacy.md", "# Privacy\n\nprivacy review", {})
    index.rebuild()
    plans = []
    original_query = index._query

    def query_with_plan(sql, params=()):
        with index._connect() as connection:
            plans.extend(
                str(row[3])
                for row in connection.execute("EXPLAIN QUERY PLAN " + sql, params)
            )
        return original_query(sql, params)

    monkeypatch.setattr(index, "_query", query_with_plan)
    assert index.lexical_search("priv", relative_path="notes") == (
        vault.lexical_search("priv", relative_path="notes")
    )

    with index._connect() as connection:
        schema = connection.execute(
            "SELECT sql FROM sqlite_master WHERE name = 'vault_search'"
        ).fetchone()[0]

    assert "tokenize='trigram'" in schema
    assert all(
        "SCAN vault_search" not in detail or "VIRTUAL TABLE INDEX" in detail
        for detail in plans
    )
    assert any("VIRTUAL TABLE INDEX" in detail for detail in plans)


def test_indexed_search_preserves_two_character_substrings_without_scanning_content(
    awareness_index,
):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/privacy.md", "# Privacy\n\nprivacy review", {})
    index.rebuild()

    with index._connect() as connection:
        tables = {
            row[0]
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type IN ('table', 'view')"
            )
        }

    assert "vault_search_bigrams" in tables
    assert index.lexical_search("iv", relative_path="notes") == (
        vault.lexical_search("iv", relative_path="notes")
    )


@pytest.mark.parametrize("term", ["--", "NEAR", "OR", "a*b", 'quo"te'])
def test_indexed_search_treats_operator_shaped_terms_as_text(awareness_index, term):
    index, vault, _ = awareness_index
    vault.write_markdown("notes/operators.md", f"# Operators\n\nValue {term} value", {})
    index.rebuild()

    assert index.lexical_search(term, relative_path="notes") == (
        vault.lexical_search(term, relative_path="notes")
    )


def test_indexed_search_escapes_sql_like_scope_prefixes(awareness_index):
    index, vault, _ = awareness_index
    vault.write_markdown("scoped_one/match.md", "# Match\n\nprivacy", {})
    vault.write_markdown("scopedXone/leak.md", "# Leak\n\nprivacy", {})
    vault.write_markdown("scoped%one/leak.md", "# Percent leak\n\nprivacy", {})
    index.rebuild()

    assert [item["path"] for item in index.lexical_search(
        "privacy", relative_path="scoped_one"
    )] == ["scoped_one/match.md"]
