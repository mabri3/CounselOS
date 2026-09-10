"""Disposable SQLite projection of published source manifests.

Nothing here is authoritative. Every row points at a Markdown file and carries
the hash a reader must re-check before treating a hit as current evidence.
"""
from __future__ import annotations

import hashlib
import sqlite3
from typing import Any

from pydantic import ValidationError

from app.models.source_library import SourceManifest

SOURCE_SCHEMA = """
CREATE TABLE source_versions (matter_id TEXT NOT NULL,source_id TEXT NOT NULL,source_version TEXT NOT NULL,manifest_path TEXT NOT NULL,original_path TEXT NOT NULL,title TEXT NOT NULL,source_kind TEXT NOT NULL,extraction_state TEXT NOT NULL,manifest_hash TEXT NOT NULL,extracted_unit_count INTEGER,total_chars INTEGER,unread_page_count INTEGER,created_at TEXT,PRIMARY KEY (matter_id,source_id,source_version));
CREATE TABLE source_units (matter_id TEXT NOT NULL,source_id TEXT NOT NULL,source_version TEXT NOT NULL,unit_id TEXT NOT NULL,path TEXT NOT NULL,body_hash TEXT NOT NULL,page_number INTEGER,section_label TEXT,char_count INTEGER,method TEXT,PRIMARY KEY (matter_id,source_id,source_version,unit_id));
CREATE TABLE source_catalogs (matter_id TEXT PRIMARY KEY,path TEXT NOT NULL,indexed_generation TEXT NOT NULL);
CREATE INDEX source_units_path ON source_units(path);
"""
SOURCE_TABLES = ("source_versions", "source_units", "source_catalogs")
SOURCE_TABLE_COLUMNS = {
    "source_versions": ("matter_id", "source_id", "source_version", "manifest_path", "original_path", "title", "source_kind", "extraction_state", "manifest_hash", "extracted_unit_count", "total_chars", "unread_page_count", "created_at"),
    "source_units": ("matter_id", "source_id", "source_version", "unit_id", "path", "body_hash", "page_number", "section_label", "char_count", "method"),
    "source_catalogs": ("matter_id", "path", "indexed_generation"),
}


def index_source_library(connection: sqlite3.Connection, vault, errors: list[str]) -> int:
    """Project every published manifest under 03_Matters into the disposable index."""
    count = 0
    catalogs: dict[str, str] = {}
    generations: dict[str, list[str]] = {}
    for path in vault.iter_files("03_Matters", {".md"}, include_source_library=True):
        relative = vault.relative(path)
        if not relative.endswith("/manifest.md") or "/research/source-library/" not in relative:
            continue
        if "/research/source-library/jobs/" in relative:
            continue
        try:
            manifest = SourceManifest.model_validate(vault.read_markdown(relative)["metadata"])
            expected = f"{manifest.source_id}/{manifest.source_version}/manifest.md"
            if not relative.endswith(expected):
                raise ValueError("manifest location does not match its recorded identity")
            manifest_hash = hashlib.sha256(vault.read_text(relative).encode("utf-8")).hexdigest()
            _insert(connection, "source_versions", (
                manifest.matter_id, manifest.source_id, manifest.source_version, relative,
                manifest.original_path, manifest.title, manifest.source_kind, manifest.extraction_state,
                manifest_hash, manifest.extracted_unit_count, manifest.total_chars,
                manifest.unread_page_count, manifest.created_at))
            for unit in manifest.units:
                _insert(connection, "source_units", (
                    manifest.matter_id, manifest.source_id, manifest.source_version, unit.unit_id,
                    unit.path, unit.body_sha256, unit.page_number, unit.section_label,
                    unit.char_count, unit.extraction_method))
            generations.setdefault(manifest.matter_id, []).append(
                f"{manifest.source_id}:{manifest.source_version}:{manifest_hash}")
            catalogs.setdefault(manifest.matter_id, relative.rsplit("/", 3)[0] + "/index.md")
            count += 1
        except (OSError, ValueError, ValidationError, sqlite3.Error) as exc:
            errors.append(f"{relative}: {exc}")
    for matter_id, catalog_path in sorted(catalogs.items()):
        generation = hashlib.sha256("|".join(sorted(generations[matter_id])).encode("utf-8")).hexdigest()
        _insert(connection, "source_catalogs", (matter_id, catalog_path, generation))
    return count


def _insert(connection: sqlite3.Connection, table: str, values: tuple[Any, ...]) -> None:
    columns = SOURCE_TABLE_COLUMNS[table]
    if len(values) != len(columns):
        raise ValueError(f"{table} row has {len(values)} values for {len(columns)} columns")
    placeholders = ", ".join(f":{column}" for column in columns)
    connection.execute(
        f"INSERT OR REPLACE INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
        dict(zip(columns, values, strict=True)))
