from __future__ import annotations

import asyncio
import fcntl
import json
import os
import sqlite3
import tempfile
import threading
from contextlib import contextmanager
from collections.abc import Callable, Iterable
from pathlib import Path
from typing import Any, TypeVar

import frontmatter
from pydantic import BaseModel, ValidationError

from app.models.awareness import (
    BriefingItem, BriefingPage, BriefingQuery, Development, Digest, IndexReport,
    Mitigation, ReviewPacket, SavedView, Scan, Watch,
)
from app.services.vault import VaultService


SCHEMA_VERSION = 4
SCHEMA = f"""
PRAGMA foreign_keys=ON;
PRAGMA user_version={SCHEMA_VERSION};
CREATE TABLE matters (matter_id TEXT PRIMARY KEY,path TEXT NOT NULL,title TEXT NOT NULL,description TEXT,matter_type TEXT,product_area TEXT,business_team TEXT,requester TEXT,legal_owner TEXT,business_owner TEXT,status TEXT NOT NULL,priority TEXT,risk_level TEXT,target_date TEXT,privilege TEXT,next_action TEXT,created_at TEXT,updated_at TEXT);
CREATE TABLE work_items (work_item_id TEXT PRIMARY KEY,matter_id TEXT NOT NULL,path TEXT NOT NULL,title TEXT NOT NULL,description TEXT,item_type TEXT,status TEXT,priority TEXT,owner TEXT,due_at TEXT,required INTEGER,issue_id TEXT,created_at TEXT,completed_at TEXT,FOREIGN KEY(matter_id) REFERENCES matters(matter_id) ON DELETE CASCADE);
CREATE TABLE decisions (decision_id TEXT PRIMARY KEY,matter_id TEXT NOT NULL,path TEXT NOT NULL,title TEXT NOT NULL,chosen_path TEXT,rationale TEXT,decision_maker TEXT,decision_type TEXT,decided_at TEXT,next_review_at TEXT,last_reviewed_at TEXT,risk_level TEXT,review_status TEXT,staleness_reason TEXT,linked_paths TEXT,FOREIGN KEY(matter_id) REFERENCES matters(matter_id) ON DELETE CASCADE);
CREATE TABLE schedules (schedule_id TEXT PRIMARY KEY,path TEXT NOT NULL,title TEXT NOT NULL,agent_id TEXT,kind TEXT,instructions TEXT,interval_seconds INTEGER,watch_path TEXT,matter_id TEXT,enabled INTEGER,last_run_at TEXT,next_run_at TEXT,last_status TEXT);
CREATE TABLE documents (path TEXT PRIMARY KEY,matter_id TEXT,title TEXT,extension TEXT,updated_at REAL);
CREATE TABLE watches (watch_id TEXT PRIMARY KEY,path TEXT NOT NULL,title TEXT NOT NULL,status TEXT,enabled INTEGER,revision INTEGER,updated_at TEXT,source_map TEXT NOT NULL);
CREATE TABLE scans (scan_id TEXT PRIMARY KEY,path TEXT NOT NULL,watch_id TEXT NOT NULL,mode TEXT,status TEXT,started_at TEXT,completed_at TEXT);
CREATE TABLE developments (development_id TEXT PRIMARY KEY,path TEXT NOT NULL,title TEXT NOT NULL,canonical_url TEXT,legal_status TEXT,occurred_at TEXT,updated_at TEXT);
CREATE TABLE briefing_items (item_id TEXT PRIMARY KEY,path TEXT NOT NULL,development_id TEXT NOT NULL,watch_id TEXT NOT NULL,title TEXT NOT NULL,summary TEXT,why_shown TEXT,topics TEXT NOT NULL,jurisdictions TEXT NOT NULL,source_values TEXT NOT NULL,source_urls TEXT NOT NULL,source_types TEXT NOT NULL,source_roles TEXT NOT NULL,published_at TEXT,effective_at TEXT,is_read INTEGER,saved INTEGER,has_company_connection INTEGER,connected_decisions INTEGER,review_packet_id TEXT,attention_state TEXT,potential_impact TEXT,legal_status TEXT,revision INTEGER,created_at TEXT,updated_at TEXT,record_json TEXT NOT NULL);
CREATE TABLE saved_views (view_id TEXT PRIMARY KEY,path TEXT NOT NULL,name TEXT NOT NULL,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE TABLE digests (digest_id TEXT PRIMARY KEY,path TEXT NOT NULL,view_id TEXT NOT NULL,title TEXT NOT NULL,created_at TEXT);
CREATE TABLE review_packets (packet_id TEXT PRIMARY KEY,path TEXT NOT NULL,status TEXT,attention_state TEXT,potential_impact TEXT,review_priority TEXT,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE TABLE mitigations (mitigation_id TEXT PRIMARY KEY,matter_id TEXT NOT NULL,path TEXT NOT NULL,title TEXT NOT NULL,status TEXT,decision_ids TEXT NOT NULL,review_at TEXT,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE INDEX briefing_items_created ON briefing_items(created_at DESC,item_id DESC);
CREATE INDEX briefing_items_watch ON briefing_items(watch_id);
CREATE VIRTUAL TABLE vault_search USING fts5(path UNINDEXED,title UNINDEXED,content UNINDEXED,search_text,tokenize='trigram',detail=none,columnsize=0);
CREATE TABLE vault_search_bigrams (term TEXT PRIMARY KEY,document_rowids TEXT NOT NULL) WITHOUT ROWID;
"""
TABLES = {"matters", "work_items", "decisions", "schedules", "documents", "watches", "scans", "developments", "briefing_items", "saved_views", "digests", "review_packets", "mitigations", "vault_search", "vault_search_bigrams"}
TABLE_COLUMNS = {
    "matters": ("matter_id", "path", "title", "description", "matter_type", "product_area", "business_team", "requester", "legal_owner", "business_owner", "status", "priority", "risk_level", "target_date", "privilege", "next_action", "created_at", "updated_at"),
    "work_items": ("work_item_id", "matter_id", "path", "title", "description", "item_type", "status", "priority", "owner", "due_at", "required", "issue_id", "created_at", "completed_at"),
    "decisions": ("decision_id", "matter_id", "path", "title", "chosen_path", "rationale", "decision_maker", "decision_type", "decided_at", "next_review_at", "last_reviewed_at", "risk_level", "review_status", "staleness_reason", "linked_paths"),
    "schedules": ("schedule_id", "path", "title", "agent_id", "kind", "instructions", "interval_seconds", "watch_path", "matter_id", "enabled", "last_run_at", "next_run_at", "last_status"),
    "documents": ("path", "matter_id", "title", "extension", "updated_at"),
    "watches": ("watch_id", "path", "title", "status", "enabled", "revision", "updated_at", "source_map"),
    "scans": ("scan_id", "path", "watch_id", "mode", "status", "started_at", "completed_at"),
    "developments": ("development_id", "path", "title", "canonical_url", "legal_status", "occurred_at", "updated_at"),
    "briefing_items": ("item_id", "path", "development_id", "watch_id", "title", "summary", "why_shown", "topics", "jurisdictions", "source_values", "source_urls", "source_types", "source_roles", "published_at", "effective_at", "is_read", "saved", "has_company_connection", "connected_decisions", "review_packet_id", "attention_state", "potential_impact", "legal_status", "revision", "created_at", "updated_at", "record_json"),
    "saved_views": ("view_id", "path", "name", "revision", "created_at", "updated_at"),
    "digests": ("digest_id", "path", "view_id", "title", "created_at"),
    "review_packets": ("packet_id", "path", "status", "attention_state", "potential_impact", "review_priority", "revision", "created_at", "updated_at"),
    "mitigations": ("mitigation_id", "matter_id", "path", "title", "status", "decision_ids", "review_at", "revision", "created_at", "updated_at"),
}
T = TypeVar("T", bound=BaseModel)


def _value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bytes)):
        return value
    if isinstance(value, bool):
        return int(value)
    if hasattr(value, "isoformat"):
        return value.isoformat()
    if isinstance(value, (list, dict, tuple)):
        return json.dumps(value, default=str)
    return str(value)


def _list(values: Iterable[Any]) -> str:
    return json.dumps([str(value) for value in values])


class IndexService:
    """Disposable SQLite read model rebuilt atomically from Markdown."""

    def __init__(self, db_path: Path, vault: VaultService):
        self.db_path = db_path
        self.vault = vault
        self._lock = threading.RLock()
        self.last_report = IndexReport()
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.last_report = self.rebuild()

    def _connect(self, path: Path | None = None) -> sqlite3.Connection:
        connection = sqlite3.connect(path or self.db_path, timeout=20, check_same_thread=False)
        connection.row_factory = sqlite3.Row
        connection.create_function("casefold", 1, lambda value: str(value or "").casefold(), deterministic=True)
        connection.create_function(
            "occurrences", 2,
            lambda text, needle: str(text or "").casefold().count(str(needle or "").casefold()) if needle else 0,
            deterministic=True,
        )
        return connection

    def _schema_is_current(self) -> bool:
        if not self.db_path.exists():
            return False
        try:
            with self._connect() as connection:
                version = connection.execute("PRAGMA user_version").fetchone()[0]
                tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            return version == SCHEMA_VERSION and TABLES <= tables
        except sqlite3.DatabaseError:
            return False

    def rebuild(self) -> IndexReport:
        """Swap in a complete cache only after every table has been built."""
        with self._lock, self._rebuild_lock():
            fd, name = tempfile.mkstemp(prefix=f".{self.db_path.name}.", suffix=".tmp", dir=self.db_path.parent)
            os.close(fd)
            temporary = Path(name)
            try:
                with self._connect(temporary) as connection:
                    connection.executescript(SCHEMA)
                    report = self._build(connection)
                    connection.commit()
                    if connection.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                        raise sqlite3.DatabaseError("rebuilt index failed integrity check")
                self._retire_wal_files()
                os.replace(temporary, self.db_path)
                self.last_report = report
                return report
            finally:
                temporary.unlink(missing_ok=True)

    async def rebuild_async(self) -> IndexReport:
        """Rebuild the disposable index without blocking an async request."""
        return await asyncio.to_thread(self.rebuild)

    @contextmanager
    def _rebuild_lock(self):
        """Serialize snapshot creation and replacement across service instances."""
        lock_path = self.db_path.with_name(f".{self.db_path.name}.rebuild.lock")
        with lock_path.open("a+b") as lock_file:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)

    def _retire_wal_files(self) -> None:
        """Prevent sidecars from the prior cache being applied to the new file."""
        if self.db_path.exists():
            try:
                with self._connect() as connection:
                    connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
                    connection.execute("PRAGMA journal_mode=DELETE")
            except sqlite3.DatabaseError:
                # A corrupt cache is disposable. The replacement is already complete.
                pass
        Path(f"{self.db_path}-wal").unlink(missing_ok=True)
        Path(f"{self.db_path}-shm").unlink(missing_ok=True)

    def _build(self, connection: sqlite3.Connection) -> IndexReport:
        errors: list[str] = []
        count = (
            self._index_matters(connection, errors)
            + self._index_schedules(connection, errors)
            + self._index_search_documents(connection, errors)
        )
        watches, added = self._models(connection, "00_System/legal-awareness/watches", Watch, "watches", self._watch_row, errors)
        count += added
        source_maps = {watch.watch_id: self._watch_sources(watch) for watch in watches}
        specs: tuple[tuple[str, type[BaseModel], str, Callable[[Any], tuple[Any, ...]]], ...] = (
            ("05_Briefing/scans", Scan, "scans", lambda record: (record.scan_id, record.path, record.watch_id, record.mode, record.status, record.started_at, record.completed_at)),
            ("05_Briefing/developments", Development, "developments", lambda record: (record.development_id, record.path, record.title, record.canonical_url, record.legal_status, record.occurred_at, record.updated_at)),
            ("00_System/legal-awareness/views", SavedView, "saved_views", lambda record: (record.view_id, record.path, record.name, record.revision, record.created_at, record.updated_at)),
            ("05_Briefing/digests", Digest, "digests", lambda record: (record.digest_id, record.path, record.view_id, record.title, record.created_at)),
            ("05_Briefing/review-packets", ReviewPacket, "review_packets", lambda record: (record.packet_id, record.path, record.status, record.attention_state, record.potential_impact, record.review_priority, record.revision, record.created_at, record.updated_at)),
        )
        for root, model, table, row in specs:
            _, added = self._models(connection, root, model, table, row, errors)
            count += added
        _, added = self._models(connection, "05_Briefing/items", BriefingItem, "briefing_items", lambda record: self._item_row(record, source_maps), errors)
        count += added + self._index_mitigations(connection, errors)
        return IndexReport(indexed_count=count, error_count=len(errors), errors=errors)

    @staticmethod
    def _insert(connection: sqlite3.Connection, table: str, values: tuple[Any, ...]) -> None:
        columns = TABLE_COLUMNS[table]
        if len(values) != len(columns):
            raise ValueError(f"{table} row has {len(values)} values for {len(columns)} columns")
        params = dict(zip(columns, (_value(value) for value in values), strict=True))
        names = ", ".join(columns)
        placeholders = ", ".join(f":{column}" for column in columns)
        connection.execute(f"INSERT INTO {table} ({names}) VALUES ({placeholders})", params)

    def _models(self, connection: sqlite3.Connection, root: str, model: type[T], table: str, row_builder: Callable[[T], tuple[Any, ...]], errors: list[str]) -> tuple[list[T], int]:
        records: list[T] = []
        for path in self.vault.iter_files(root, {".md"}):
            relative = self.vault.relative(path)
            if table == "review_packets" and "/outcomes/" in relative:
                continue
            try:
                record = model.model_validate(self.vault.read_markdown(relative)["metadata"])
                if getattr(record, "path", relative) != relative:
                    raise ValueError(f"record path does not match {relative!r}")
                row = tuple(_value(value) for value in row_builder(record))
                self._insert(connection, table, row)
                records.append(record)
            except (OSError, ValueError, ValidationError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return records, len(records)

    def _index_search_documents(self, connection: sqlite3.Connection, errors: list[str]) -> int:
        """Index the same Markdown and text corpus exposed by the legacy vault search."""
        count = 0
        bigram_documents: dict[str, list[int]] = {}
        for path in self.vault.iter_files("", {".md", ".txt"}):
            relative = self.vault.relative(path)
            try:
                content = path.read_text(encoding="utf-8", errors="replace")
                title = path.stem.replace("-", " ").replace("_", " ").title()
                normalized = content.lower()
                cursor = connection.execute(
                    "INSERT INTO vault_search (path, title, content, search_text) VALUES (?, ?, ?, ?)",
                    (relative, title, content, normalized),
                )
                bigrams = sorted({
                    normalized[index:index + 2]
                    for index in range(len(normalized) - 1)
                    if not any(character.isspace() for character in normalized[index:index + 2])
                })
                for term in bigrams:
                    bigram_documents.setdefault(term, []).append(cursor.lastrowid)
                count += 1
            except (OSError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        connection.executemany(
            "INSERT INTO vault_search_bigrams (term, document_rowids) VALUES (?, ?)",
            (
                (term, json.dumps(document_rowids))
                for term, document_rowids in sorted(bigram_documents.items())
            ),
        )
        return count

    @staticmethod
    def _watch_sources(watch: Watch) -> dict[str, tuple[str, str]]:
        return {str(source.canonical_url): (source.source_type, source.role) for source in watch.sources}

    def _watch_row(self, watch: Watch) -> tuple[Any, ...]:
        return (watch.watch_id, watch.path, watch.title, watch.status, watch.enabled, watch.revision, watch.updated_at, json.dumps(self._watch_sources(watch), sort_keys=True))

    @staticmethod
    def _item_row(item: BriefingItem, source_maps: dict[str, dict[str, tuple[str, str]]]) -> tuple[Any, ...]:
        urls = [str(source.canonical_url) for source in item.sources]
        source_values = [value for source in item.sources for value in (str(source.canonical_url), source.publisher, source.title) if value]
        resolved = [source_maps.get(item.watch_id, {}).get(url) for url in urls]
        connection = item.company_connection
        return (
            item.item_id, item.path, item.development_id, item.watch_id, item.title,
            item.summary, item.why_shown, _list(item.topics), _list(item.jurisdictions),
            _list(source_values), _list(urls), _list(value[0] for value in resolved if value),
            _list(value[1] for value in resolved if value), item.published_at, item.effective_at,
            item.read, item.saved, bool(connection), bool(connection and connection.decisions),
            item.review_packet_id, item.attention_state, item.potential_impact, item.legal_status,
            item.revision, item.created_at, item.updated_at,
            json.dumps(item.model_dump(mode="json"), sort_keys=True),
        )

    def _index_mitigations(self, connection: sqlite3.Connection, errors: list[str]) -> int:
        count = 0
        root = self.vault.resolve("03_Matters")
        for path in root.glob("*/mitigations/*.md") if root.exists() else []:
            relative = self.vault.relative(path)
            try:
                record = Mitigation.model_validate(self.vault.read_markdown(relative)["metadata"])
                if record.matter_id != path.parent.parent.name:
                    raise ValueError("matter_id does not match containing matter")
                if record.path != relative:
                    raise ValueError(f"record path does not match {relative!r}")
                row = (record.mitigation_id, record.matter_id, record.path, record.title, record.status, _list(record.decision_ids), record.review_at, record.revision, record.created_at, record.updated_at)
                self._insert(connection, "mitigations", row)
                count += 1
            except (OSError, ValueError, ValidationError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return count

    def _index_matters(self, connection: sqlite3.Connection, errors: list[str]) -> int:
        root = self.vault.resolve("03_Matters")
        count = 0
        for matter_file in root.glob("*/matter.md") if root.exists() else []:
            relative = self.vault.relative(matter_file)
            try:
                post = frontmatter.loads(matter_file.read_text(encoding="utf-8")); metadata = dict(post.metadata)
                matter_id = str(metadata.get("matter_id") or matter_file.parent.name)
                row = (matter_id, self.vault.relative(matter_file.parent), metadata.get("title") or matter_file.parent.name, metadata.get("description", ""), metadata.get("matter_type", "general_advice"), metadata.get("product_area", ""), metadata.get("business_team", ""), metadata.get("requester", ""), metadata.get("legal_owner", ""), metadata.get("business_owner", ""), metadata.get("status", "intake"), metadata.get("priority", "normal"), metadata.get("risk_level", "unknown"), metadata.get("target_date"), metadata.get("privilege", ""), metadata.get("next_action", "Orient to the request"), metadata.get("created_at"), metadata.get("updated_at"))
                self._insert(connection, "matters", row); count += 1
                count += self._index_children(connection, matter_id, matter_file.parent, errors)
            except (OSError, ValueError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return count

    def _index_children(self, connection: sqlite3.Connection, matter_id: str, folder: Path, errors: list[str]) -> int:
        count = 0
        for kind in ("work-items", "decisions"):
            child = folder / kind
            for path in child.glob("*.md") if child.exists() else []:
                try:
                    post = frontmatter.loads(path.read_text(encoding="utf-8")); metadata = dict(post.metadata)
                    if kind == "work-items":
                        row = (metadata.get("work_item_id") or path.stem, matter_id, self.vault.relative(path), metadata.get("title") or path.stem, metadata.get("description") or post.content[:500], metadata.get("type", "question"), metadata.get("status", "open"), metadata.get("priority", "normal"), metadata.get("owner", ""), metadata.get("due_at"), 1 if metadata.get("required") else 0, metadata.get("issue_id"), metadata.get("created_at"), metadata.get("completed_at"))
                        self._insert(connection, "work_items", row)
                    else:
                        rationale = metadata["rationale"] if "rationale" in metadata else post.content[:1000]
                        row = (metadata.get("decision_id") or path.stem, matter_id, self.vault.relative(path), metadata.get("title") or path.stem, metadata.get("chosen_path", ""), rationale, metadata.get("decision_maker", ""), metadata.get("decision_type", "legal_decision"), metadata.get("decided_at"), metadata.get("next_review_at"), metadata.get("last_reviewed_at"), metadata.get("risk_level", "unknown"), metadata.get("review_status", "fresh"), metadata.get("staleness_reason", ""), json.dumps(metadata.get("linked_paths", []), default=str))
                        self._insert(connection, "decisions", row)
                    count += 1
                except (OSError, ValueError, sqlite3.Error) as exc:
                    errors.append(f"{self.vault.relative(path)}: {exc}")
        for path in folder.rglob("*"):
            if not path.is_file() or path.name.startswith("."):
                continue
            try:
                self._insert(connection, "documents", (self.vault.relative(path), matter_id, path.stem.replace("-", " ").replace("_", " ").title(), path.suffix.lower(), path.stat().st_mtime)); count += 1
            except (OSError, ValueError, sqlite3.Error) as exc:
                errors.append(f"{self.vault.relative(path)}: {exc}")
        return count

    def _index_schedules(self, connection: sqlite3.Connection, errors: list[str]) -> int:
        count = 0
        for path in self.vault.iter_files("00_System/schedules", {".md"}):
            relative = self.vault.relative(path)
            try:
                post = frontmatter.loads(path.read_text(encoding="utf-8")); metadata = dict(post.metadata)
                row = (metadata.get("schedule_id") or path.stem, relative, metadata.get("title") or path.stem, metadata.get("agent_id", "counsel-copilot"), metadata.get("kind", "agent_prompt"), metadata.get("instructions") or post.content.strip(), int(metadata.get("interval_seconds", 3600)), metadata.get("watch_path"), metadata.get("matter_id"), 1 if metadata.get("enabled", True) else 0, metadata.get("last_run_at"), metadata.get("next_run_at"), metadata.get("last_status", "never_run"))
                self._insert(connection, "schedules", row); count += 1
            except (OSError, ValueError, TypeError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return count

    def query_briefing(self, query: BriefingQuery) -> BriefingPage:
        resolved = BriefingQuery.model_validate(query.model_dump(mode="json"))
        where, params = self._briefing_where(resolved)
        filtered = f"SELECT * FROM briefing_items AS item{where}"
        total = self._query(f"SELECT COUNT(*) AS total FROM ({filtered})", params)[0]["total"]
        order = self._briefing_order(resolved).replace("item.", "filtered.")
        params = {**params, "cursor": resolved.cursor, "limit": resolved.limit}
        params.setdefault("q", resolved.q)
        rows = self._query(f"""
            WITH filtered AS ({filtered}),
            numbered AS (
                SELECT filtered.*, ROW_NUMBER() OVER (ORDER BY {order}) AS row_number
                FROM filtered
            ),
            cursor_row AS (
                SELECT COALESCE(MAX(row_number), 0) AS row_number
                FROM numbered WHERE item_id = :cursor
            )
            SELECT numbered.*,
                EXISTS(
                    SELECT 1 FROM numbered AS after_cursor, cursor_row
                    WHERE after_cursor.row_number > cursor_row.row_number + :limit
                ) AS has_more
            FROM numbered CROSS JOIN cursor_row
            WHERE numbered.row_number > cursor_row.row_number
            ORDER BY numbered.row_number
            LIMIT :limit
        """, params)
        items = [BriefingItem.model_validate_json(row["record_json"]) for row in rows]
        cursor = rows[-1]["item_id"] if rows and rows[-1]["has_more"] else None
        return BriefingPage(items=items, next_cursor=cursor, total=total, resolved_query=resolved)

    @staticmethod
    def _briefing_where(query: BriefingQuery) -> tuple[str, dict[str, Any]]:
        conditions: list[str] = []
        params: dict[str, Any] = {}

        def one_of(column: str, values: list[str], name: str) -> None:
            if values:
                placeholders = ", ".join(f":{name}_{index}" for index in range(len(values)))
                conditions.append(f"{column} IN ({placeholders})")
                params.update({f"{name}_{index}": value for index, value in enumerate(values)})

        def overlaps(column: str, values: list[str], name: str) -> None:
            if values:
                placeholders = ", ".join(f":{name}_{index}" for index in range(len(values)))
                conditions.append(
                    f"EXISTS (SELECT 1 FROM json_each(item.{column}) AS value "
                    f"WHERE value.value IN ({placeholders}))"
                )
                params.update({f"{name}_{index}": value for index, value in enumerate(values)})

        if query.q:
            conditions.append(
                "instr(casefold(item.title || ' ' || COALESCE(item.summary, '') || ' ' || COALESCE(item.why_shown, '')), casefold(:q)) > 0"
            )
            params["q"] = query.q
        one_of("item.watch_id", query.watch, "watch")
        overlaps("topics", query.topic, "topic")
        overlaps("jurisdictions", query.jurisdiction, "jurisdiction")
        overlaps("source_values", query.source, "source")
        overlaps("source_types", query.source_type, "source_type")
        overlaps("source_roles", query.source_role, "source_role")
        one_of("item.attention_state", query.status, "status")
        for column, value in (
            ("is_read", query.read),
            ("saved", query.saved),
            ("has_company_connection", query.company_connection),
        ):
            if value != "any":
                key = f"{column}_value"
                conditions.append(f"COALESCE(item.{column}, 0) = :{key}")
                params[key] = int(value == "yes")
        if query.packet == "none":
            conditions.append("item.review_packet_id IS NULL")
        elif query.packet == "connected":
            conditions.append("item.review_packet_id IS NOT NULL")
        elif query.packet == "required":
            conditions.extend(("item.review_packet_id IS NOT NULL", "item.attention_state = 'required'"))
        if query.impact:
            conditions.append("item.potential_impact = :impact")
            params["impact"] = query.impact
        if query.legal_status:
            conditions.append("item.legal_status = :legal_status")
            params["legal_status"] = query.legal_status
        return (f" WHERE {' AND '.join(conditions)}" if conditions else "", params)

    @staticmethod
    def _briefing_order(query: BriefingQuery) -> str:
        created = "COALESCE(item.created_at, '') DESC, item.item_id DESC"
        if query.sort == "relevance":
            return "occurrences(item.title || ' ' || COALESCE(item.summary, '') || ' ' || COALESCE(item.why_shown, ''), :q) DESC, " + created
        if query.sort == "potential_impact":
            return "CASE item.potential_impact WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END DESC, " + created
        if query.sort == "primary_sources":
            return "EXISTS (SELECT 1 FROM json_each(item.source_roles) AS role WHERE role.value = 'primary') DESC, " + created
        if query.sort == "effective_date":
            return "COALESCE(item.effective_at, item.created_at, '') DESC, " + created
        if query.sort == "unread":
            return "COALESCE(item.is_read, 0) ASC, COALESCE(item.created_at, '') ASC, item.item_id ASC"
        if query.sort == "connected_decisions":
            return "COALESCE(item.connected_decisions, 0) DESC, " + created
        return created

    def lexical_search(self, query: str, *, relative_path: str = "", limit: int = 10) -> list[dict[str, Any]]:
        terms = [term for term in query.split() if len(term) > 1]
        if not terms or limit <= 0:
            return []
        normalized = [term.lower() for term in terms]
        long_terms = [term for term in normalized if len(term) >= 3]
        short_terms = [term for term in normalized if len(term) == 2]
        candidate_queries: list[str] = []
        params: dict[str, Any] = {}
        if long_terms:
            term_queries: list[str] = []
            for term in long_terms:
                trigrams = sorted({term[index:index + 3] for index in range(len(term) - 2)})
                term_queries.append(
                    "(" + " AND ".join(
                        '"' + trigram.replace('"', '""') + '"'
                        for trigram in trigrams
                    ) + ")"
                )
            params["match"] = " OR ".join(term_queries)
            candidate_queries.append(
                "SELECT rowid AS document_rowid FROM vault_search "
                "WHERE vault_search MATCH :match"
            )
        if short_terms:
            placeholders: list[str] = []
            for index, term in enumerate(short_terms):
                key = f"bigram_{index}"
                placeholders.append(f":{key}")
                params[key] = term
            candidate_queries.append(
                "SELECT CAST(value AS INTEGER) AS document_rowid "
                "FROM vault_search_bigrams JOIN json_each(document_rowids) "
                "WHERE vault_search_bigrams.term IN ("
                + ", ".join(placeholders)
                + ")"
            )
        conditions: list[str] = []
        if relative_path:
            relative = self.vault.relative(self.vault.resolve(relative_path))
            escaped = (
                relative.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_")
            )
            conditions.append(
                "(path = :scope OR path LIKE :scope_prefix ESCAPE :like_escape)"
            )
            params.update({
                "scope": relative,
                "scope_prefix": f"{escaped}/%",
                "like_escape": "\\",
            })
        rows = self._query(
            "WITH candidates AS ("
            + " UNION ".join(candidate_queries)
            + ") SELECT path, title, content FROM vault_search "
            "WHERE rowid IN (SELECT document_rowid FROM candidates)"
            + (" AND " + " AND ".join(conditions) if conditions else "")
            + " ORDER BY path",
            params,
        )
        scored: list[tuple[int, dict[str, Any]]] = []
        for row in rows:
            text = row.pop("content")
            lowered = text.lower()
            score = sum(lowered.count(term) for term in normalized)
            if score == 0:
                continue
            first = min((lowered.find(term) for term in normalized if term in lowered), default=0)
            start = max(0, first - 120)
            end = min(len(text), first + 360)
            row["snippet"] = " ".join(text[start:end].split())
            row["score"] = score
            scored.append((score, row))
        scored.sort(key=lambda item: (-item[0], item[1]["path"]))
        return [row for _, row in scored[:limit]]

    def list_matters(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM matters ORDER BY updated_at DESC, title")

    def get_matter(self, matter_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM matters WHERE matter_id = ?", (matter_id,))
        return rows[0] if rows else None

    def list_work_items(self, matter_id: str | None = None) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM work_items WHERE matter_id = ? ORDER BY status, priority, due_at", (matter_id,)) if matter_id else self._query("SELECT * FROM work_items ORDER BY status, priority, due_at")

    def list_decisions(
        self, status: str | None = None, matter_id: str | None = None,
    ) -> list[dict[str, Any]]:
        conditions: list[str] = []
        params: list[Any] = []
        if status:
            conditions.append("review_status = ?")
            params.append(status)
        if matter_id:
            conditions.append("matter_id = ?")
            params.append(matter_id)
        where = f" WHERE {' AND '.join(conditions)}" if conditions else ""
        order = "decided_at" if status else "CASE review_status WHEN 'stale' THEN 0 WHEN 'review_recommended' THEN 1 ELSE 2 END, decided_at"
        return self._query(f"SELECT * FROM decisions{where} ORDER BY {order}", tuple(params))

    def list_schedules(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM schedules ORDER BY enabled DESC, title")

    def get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM schedules WHERE schedule_id = ?", (schedule_id,))
        return rows[0] if rows else None

    def _query(self, sql: str, params: tuple[Any, ...] | dict[str, Any] = ()) -> list[dict[str, Any]]:
        with self._lock, self._connect() as connection:
            return [dict(row) for row in connection.execute(sql, params).fetchall()]
