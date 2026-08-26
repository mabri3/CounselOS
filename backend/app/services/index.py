from __future__ import annotations

import json
import sqlite3
import threading
from pathlib import Path
from typing import Any


def _sqlite_value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bytes)):
        return value
    if isinstance(value, bool):
        return int(value)
    if hasattr(value, "isoformat"):
        return value.isoformat()
    if isinstance(value, (list, dict, tuple)):
        return json.dumps(value, default=str)
    return str(value)

import frontmatter

from app.services.vault import VaultService


SCHEMA = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS matters (
    matter_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    matter_type TEXT,
    product_area TEXT,
    business_team TEXT,
    requester TEXT,
    legal_owner TEXT,
    business_owner TEXT,
    status TEXT NOT NULL,
    priority TEXT,
    risk_level TEXT,
    target_date TEXT,
    privilege TEXT,
    next_action TEXT,
    created_at TEXT,
    updated_at TEXT
);
CREATE TABLE IF NOT EXISTS work_items (
    work_item_id TEXT PRIMARY KEY,
    matter_id TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    item_type TEXT,
    status TEXT,
    priority TEXT,
    owner TEXT,
    due_at TEXT,
    required INTEGER,
    issue_id TEXT,
    created_at TEXT,
    completed_at TEXT,
    FOREIGN KEY(matter_id) REFERENCES matters(matter_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS decisions (
    decision_id TEXT PRIMARY KEY,
    matter_id TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    chosen_path TEXT,
    rationale TEXT,
    decision_maker TEXT,
    decision_type TEXT,
    decided_at TEXT,
    next_review_at TEXT,
    last_reviewed_at TEXT,
    risk_level TEXT,
    review_status TEXT,
    staleness_reason TEXT,
    linked_paths TEXT,
    FOREIGN KEY(matter_id) REFERENCES matters(matter_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    agent_id TEXT,
    kind TEXT,
    instructions TEXT,
    interval_seconds INTEGER,
    watch_path TEXT,
    matter_id TEXT,
    enabled INTEGER,
    last_run_at TEXT,
    next_run_at TEXT,
    last_status TEXT
);
CREATE TABLE IF NOT EXISTS documents (
    path TEXT PRIMARY KEY,
    matter_id TEXT,
    title TEXT,
    extension TEXT,
    updated_at REAL
);
"""


class IndexService:
    """Disposable SQLite read model rebuilt from Markdown records."""
    def __init__(self, db_path: Path, vault: VaultService):
        self.db_path = db_path
        self.vault = vault
        self._lock = threading.RLock()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as connection:
            connection.executescript(SCHEMA)
    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path, timeout=20, check_same_thread=False)
        connection.row_factory = sqlite3.Row
        return connection
    def rebuild(self) -> None:
        with self._lock, self._connect() as connection:
            for table in ("work_items", "decisions", "matters", "schedules", "documents"):
                connection.execute(f"DELETE FROM {table}")
            self._index_matters(connection)
            self._index_schedules(connection)
            connection.commit()
    def _index_matters(self, connection: sqlite3.Connection) -> None:
        matters_root = self.vault.resolve("03_Matters")
        if not matters_root.exists():
            return
        for matter_file in matters_root.glob("*/matter.md"):
            post = frontmatter.loads(matter_file.read_text(encoding="utf-8"))
            metadata = dict(post.metadata)
            matter_id = str(metadata.get("matter_id") or matter_file.parent.name)
            connection.execute(
                """
                INSERT INTO matters VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                tuple(_sqlite_value(value) for value in (
                    matter_id,
                    self.vault.relative(matter_file.parent),
                    metadata.get("title") or matter_file.parent.name,
                    metadata.get("description", ""),
                    metadata.get("matter_type", "general_advice"),
                    metadata.get("product_area", ""),
                    metadata.get("business_team", ""),
                    metadata.get("requester", ""),
                    metadata.get("legal_owner", ""),
                    metadata.get("business_owner", ""),
                    metadata.get("status", "intake"),
                    metadata.get("priority", "normal"),
                    metadata.get("risk_level", "unknown"),
                    metadata.get("target_date"),
                    metadata.get("privilege", ""),
                    metadata.get("next_action", "Orient to the request"),
                    metadata.get("created_at"),
                    metadata.get("updated_at"),
                )),
            )
            self._index_work_items(connection, matter_id, matter_file.parent)
            self._index_decisions(connection, matter_id, matter_file.parent)
            self._index_documents(connection, matter_id, matter_file.parent)
    def _index_work_items(self, connection: sqlite3.Connection, matter_id: str, folder: Path) -> None:
        for path in (folder / "work-items").glob("*.md") if (folder / "work-items").exists() else []:
            post = frontmatter.loads(path.read_text(encoding="utf-8"))
            metadata = dict(post.metadata)
            connection.execute(
                """
                INSERT INTO work_items VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                tuple(_sqlite_value(value) for value in (
                    metadata.get("work_item_id") or path.stem,
                    matter_id,
                    self.vault.relative(path),
                    metadata.get("title") or path.stem,
                    metadata.get("description") or post.content[:500],
                    metadata.get("type", "question"),
                    metadata.get("status", "open"),
                    metadata.get("priority", "normal"),
                    metadata.get("owner", ""),
                    metadata.get("due_at"),
                    1 if metadata.get("required") else 0,
                    metadata.get("issue_id"),
                    metadata.get("created_at"),
                    metadata.get("completed_at"),
                )),
            )
    def _index_decisions(self, connection: sqlite3.Connection, matter_id: str, folder: Path) -> None:
        for path in (folder / "decisions").glob("*.md") if (folder / "decisions").exists() else []:
            post = frontmatter.loads(path.read_text(encoding="utf-8"))
            metadata = dict(post.metadata)
            connection.execute(
                """
                INSERT INTO decisions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                tuple(_sqlite_value(value) for value in (
                    metadata.get("decision_id") or path.stem,
                    matter_id,
                    self.vault.relative(path),
                    metadata.get("title") or path.stem,
                    metadata.get("chosen_path", ""),
                    metadata.get("rationale") or post.content[:1000],
                    metadata.get("decision_maker", ""),
                    metadata.get("decision_type", "legal_decision"),
                    metadata.get("decided_at"),
                    metadata.get("next_review_at"),
                    metadata.get("last_reviewed_at"),
                    metadata.get("risk_level", "unknown"),
                    metadata.get("review_status", "fresh"),
                    metadata.get("staleness_reason", ""),
                    json.dumps(metadata.get("linked_paths", []), default=str),
                )),
            )
    def _index_documents(self, connection: sqlite3.Connection, matter_id: str, folder: Path) -> None:
        for path in folder.rglob("*"):
            if not path.is_file() or path.name.startswith("."):
                continue
            connection.execute(
                "INSERT INTO documents VALUES (?,?,?,?,?)",
                (
                    self.vault.relative(path),
                    matter_id,
                    path.stem.replace("-", " ").replace("_", " ").title(),
                    path.suffix.lower(),
                    path.stat().st_mtime,
                ),
            )
    def _index_schedules(self, connection: sqlite3.Connection) -> None:
        schedules_root = self.vault.resolve("00_System/schedules")
        if not schedules_root.exists():
            return
        for path in schedules_root.glob("*.md"):
            post = frontmatter.loads(path.read_text(encoding="utf-8"))
            metadata = dict(post.metadata)
            connection.execute(
                """
                INSERT INTO schedules VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                tuple(_sqlite_value(value) for value in (
                    metadata.get("schedule_id") or path.stem,
                    self.vault.relative(path),
                    metadata.get("title") or path.stem,
                    metadata.get("agent_id", "counsel-copilot"),
                    metadata.get("kind", "agent_prompt"),
                    metadata.get("instructions") or post.content.strip(),
                    int(metadata.get("interval_seconds", 3600)),
                    metadata.get("watch_path"),
                    metadata.get("matter_id"),
                    1 if metadata.get("enabled", True) else 0,
                    metadata.get("last_run_at"),
                    metadata.get("next_run_at"),
                    metadata.get("last_status", "never_run"),
                )),
            )
    def list_matters(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM matters ORDER BY updated_at DESC, title")
    def get_matter(self, matter_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM matters WHERE matter_id = ?", (matter_id,))
        return rows[0] if rows else None
    def list_work_items(self, matter_id: str | None = None) -> list[dict[str, Any]]:
        if matter_id:
            return self._query(
                "SELECT * FROM work_items WHERE matter_id = ? ORDER BY status, priority, due_at",
                (matter_id,),
            )
        return self._query("SELECT * FROM work_items ORDER BY status, priority, due_at")
    def list_decisions(self, status: str | None = None) -> list[dict[str, Any]]:
        if status:
            return self._query(
                "SELECT * FROM decisions WHERE review_status = ? ORDER BY decided_at",
                (status,),
            )
        return self._query(
            """
            SELECT * FROM decisions
            ORDER BY CASE review_status WHEN 'stale' THEN 0 WHEN 'review_recommended' THEN 1 ELSE 2 END,
                     decided_at
            """
        )
    def list_schedules(self) -> list[dict[str, Any]]:
        return self._query("SELECT * FROM schedules ORDER BY enabled DESC, title")
    def get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        rows = self._query("SELECT * FROM schedules WHERE schedule_id = ?", (schedule_id,))
        return rows[0] if rows else None
    def _query(self, sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
        with self._lock, self._connect() as connection:
            return [dict(row) for row in connection.execute(sql, params).fetchall()]
