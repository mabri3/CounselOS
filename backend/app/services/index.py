from __future__ import annotations

import json
import os
import sqlite3
import tempfile
import threading
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


SCHEMA_VERSION = 2
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
CREATE TABLE briefing_items (item_id TEXT PRIMARY KEY,path TEXT NOT NULL,development_id TEXT NOT NULL,watch_id TEXT NOT NULL,title TEXT NOT NULL,summary TEXT,why_shown TEXT,topics TEXT NOT NULL,jurisdictions TEXT NOT NULL,source_values TEXT NOT NULL,source_urls TEXT NOT NULL,source_types TEXT NOT NULL,source_roles TEXT NOT NULL,published_at TEXT,effective_at TEXT,is_read INTEGER,saved INTEGER,has_company_connection INTEGER,connected_decisions INTEGER,review_packet_id TEXT,attention_state TEXT,potential_impact TEXT,legal_status TEXT,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE TABLE saved_views (view_id TEXT PRIMARY KEY,path TEXT NOT NULL,name TEXT NOT NULL,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE TABLE digests (digest_id TEXT PRIMARY KEY,path TEXT NOT NULL,view_id TEXT NOT NULL,title TEXT NOT NULL,created_at TEXT);
CREATE TABLE review_packets (packet_id TEXT PRIMARY KEY,path TEXT NOT NULL,status TEXT,attention_state TEXT,potential_impact TEXT,review_priority TEXT,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE TABLE mitigations (mitigation_id TEXT PRIMARY KEY,matter_id TEXT NOT NULL,path TEXT NOT NULL,title TEXT NOT NULL,status TEXT,decision_ids TEXT NOT NULL,review_at TEXT,revision INTEGER,created_at TEXT,updated_at TEXT);
CREATE INDEX briefing_items_created ON briefing_items(created_at DESC,item_id DESC);
CREATE INDEX briefing_items_watch ON briefing_items(watch_id);
"""
TABLES = {"matters", "work_items", "decisions", "schedules", "documents", "watches", "scans", "developments", "briefing_items", "saved_views", "digests", "review_packets", "mitigations"}
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
        if not self._schema_is_current():
            self.last_report = self.rebuild()

    def _connect(self, path: Path | None = None) -> sqlite3.Connection:
        connection = sqlite3.connect(path or self.db_path, timeout=20, check_same_thread=False)
        connection.row_factory = sqlite3.Row
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
        with self._lock:
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
        count = self._index_matters(connection, errors) + self._index_schedules(connection, errors)
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
                connection.execute(f"INSERT INTO {table} VALUES ({','.join('?' for _ in row)})", row)
                records.append(record)
            except (OSError, ValueError, ValidationError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return records, len(records)

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
                connection.execute("INSERT INTO mitigations VALUES (?,?,?,?,?,?,?,?,?,?)", tuple(_value(value) for value in row))
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
                connection.execute("INSERT INTO matters VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", tuple(_value(value) for value in row)); count += 1
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
                        connection.execute("INSERT INTO work_items VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", tuple(_value(value) for value in row))
                    else:
                        row = (metadata.get("decision_id") or path.stem, matter_id, self.vault.relative(path), metadata.get("title") or path.stem, metadata.get("chosen_path", ""), metadata.get("rationale") or post.content[:1000], metadata.get("decision_maker", ""), metadata.get("decision_type", "legal_decision"), metadata.get("decided_at"), metadata.get("next_review_at"), metadata.get("last_reviewed_at"), metadata.get("risk_level", "unknown"), metadata.get("review_status", "fresh"), metadata.get("staleness_reason", ""), json.dumps(metadata.get("linked_paths", []), default=str))
                        connection.execute("INSERT INTO decisions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", tuple(_value(value) for value in row))
                    count += 1
                except (OSError, ValueError, sqlite3.Error) as exc:
                    errors.append(f"{self.vault.relative(path)}: {exc}")
        for path in folder.rglob("*"):
            if not path.is_file() or path.name.startswith("."):
                continue
            try:
                connection.execute("INSERT INTO documents VALUES (?,?,?,?,?)", (self.vault.relative(path), matter_id, path.stem.replace("-", " ").replace("_", " ").title(), path.suffix.lower(), path.stat().st_mtime)); count += 1
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
                connection.execute("INSERT INTO schedules VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", tuple(_value(value) for value in row)); count += 1
            except (OSError, ValueError, TypeError, sqlite3.Error) as exc:
                errors.append(f"{relative}: {exc}")
        return count

    def query_briefing(self, query: BriefingQuery) -> BriefingPage:
        resolved = BriefingQuery.model_validate(query.model_dump(mode="json"))
        rows = [row for row in self._query("SELECT * FROM briefing_items") if self._matches(row, resolved)]
        rows.sort(key=lambda row: self._sort_key(row, resolved), reverse=resolved.sort != "unread")
        total = len(rows)
        start = next((index + 1 for index, row in enumerate(rows) if row["item_id"] == resolved.cursor), 0) if resolved.cursor else 0
        selected = rows[start:start + resolved.limit]
        items: list[BriefingItem] = []
        for row in selected:
            try:
                record = BriefingItem.model_validate(self.vault.read_markdown(row["path"])["metadata"])
                if record.path == row["path"]:
                    items.append(record)
            except (OSError, ValueError, ValidationError):
                pass
        cursor = selected[-1]["item_id"] if start + resolved.limit < total and selected else None
        return BriefingPage(items=items, next_cursor=cursor, total=total, resolved_query=resolved)

    @staticmethod
    def _matches(row: dict[str, Any], query: BriefingQuery) -> bool:
        values = lambda name: set(json.loads(row[name]))
        haystack = " ".join((row["title"], row["summary"] or "", row["why_shown"] or "")).casefold()
        checks = (
            not query.q or query.q.casefold() in haystack,
            not query.watch or row["watch_id"] in query.watch,
            not query.topic or bool(set(query.topic) & values("topics")),
            not query.jurisdiction or bool(set(query.jurisdiction) & values("jurisdictions")),
            not query.source or bool(set(query.source) & values("source_values")),
            not query.source_type or bool(set(query.source_type) & values("source_types")),
            not query.source_role or bool(set(query.source_role) & values("source_roles")),
            not query.status or row["attention_state"] in query.status,
            query.read == "any" or bool(row["is_read"]) == (query.read == "yes"),
            query.saved == "any" or bool(row["saved"]) == (query.saved == "yes"),
            query.company_connection == "any" or bool(row["has_company_connection"]) == (query.company_connection == "yes"),
            query.packet != "none" or row["review_packet_id"] is None,
            query.packet not in {"connected", "required"} or row["review_packet_id"] is not None,
            query.packet != "required" or row["attention_state"] == "required",
            not query.impact or row["potential_impact"] == query.impact,
            not query.legal_status or row["legal_status"] == query.legal_status,
        )
        return all(checks)

    @staticmethod
    def _sort_key(row: dict[str, Any], query: BriefingQuery) -> tuple[Any, ...]:
        created = row["created_at"] or ""
        if query.sort == "relevance":
            text = " ".join((row["title"], row["summary"] or "", row["why_shown"] or "")).casefold()
            return (text.count(query.q.casefold()) if query.q else 0, created, row["item_id"])
        if query.sort == "potential_impact": return ({None: 0, "low": 1, "medium": 2, "high": 3}[row["potential_impact"]], created, row["item_id"])
        if query.sort == "primary_sources": return ("primary" in json.loads(row["source_roles"]), created, row["item_id"])
        if query.sort == "effective_date": return (row["effective_at"] or created, created, row["item_id"])
        if query.sort == "unread": return (bool(row["is_read"]), created, row["item_id"])
        if query.sort == "connected_decisions": return (bool(row["connected_decisions"]), created, row["item_id"])
        return (created, row["item_id"])

    def list_matters(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM matters ORDER BY updated_at DESC, title")

    def get_matter(self, matter_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM matters WHERE matter_id = ?", (matter_id,))
        return rows[0] if rows else None

    def list_work_items(self, matter_id: str | None = None) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM work_items WHERE matter_id = ? ORDER BY status, priority, due_at", (matter_id,)) if matter_id else self._query("SELECT * FROM work_items ORDER BY status, priority, due_at")

    def list_decisions(self, status: str | None = None) -> list[dict[str, Any]]:
        if status:
            return self._query("SELECT * FROM decisions WHERE review_status = ? ORDER BY decided_at", (status,))
        return self._query("SELECT * FROM decisions ORDER BY CASE review_status WHEN 'stale' THEN 0 WHEN 'review_recommended' THEN 1 ELSE 2 END, decided_at")

    def list_schedules(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM schedules ORDER BY enabled DESC, title")

    def get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM schedules WHERE schedule_id = ?", (schedule_id,))
        return rows[0] if rows else None

    def _query(self, sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
        with self._lock, self._connect() as connection:
            return [dict(row) for row in connection.execute(sql, params).fetchall()]


AwarenessIndex = IndexService
