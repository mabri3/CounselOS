from __future__ import annotations

import sqlite3
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

from app.models.awareness import (
    BriefingItem, BriefingQuery, PublicWatchQuery, SourceReference, Watch,
    WatchSource,
)
from app.services.index import SCHEMA_VERSION, IndexService
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
