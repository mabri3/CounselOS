"""Typed contracts for the Markdown source library: manifests, jobs and reads.

Manifests and job checkpoints are the durable record. SQLite is disposable, so
every field a reader needs to resolve or verify a passage lives here.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

SCHEMA_VERSION = 1
EXTRACTION_FORMAT_VERSION = 2
MAX_UNIT_CHARS = 1_000_000
MAX_SOURCE_CHARS = 20_000_000
MAX_SECTION_CHARS = 12_000
MAX_LIBRARY_PAGES = 1000
READ_MAX_CHARS = 6000


def _validate_relative(value: str) -> str:
    if not value or value.startswith("/") or "\\" in value:
        raise ValueError("Unit path must be a relative vault path.")
    parts = value.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise ValueError("Unit path contains an invalid segment.")
    return value


class SourceUnitEntry(BaseModel):
    """One immutable extracted page or section of a published source version."""

    model_config = ConfigDict(extra="forbid")

    unit_id: str = Field(min_length=1, max_length=64)
    path: str = Field(min_length=1, max_length=1000)
    body_sha256: str = Field(min_length=64, max_length=64)
    char_count: int = Field(ge=0, le=MAX_UNIT_CHARS)
    page_number: int | None = Field(default=None, ge=1, le=MAX_LIBRARY_PAGES)
    section_label: str | None = Field(default=None, max_length=200)
    extraction_method: Literal["pdf_text", "ocr", "html", "text", "docx", "unread"] = "text"
    warning: str = Field(default="", max_length=500)
    image_path: str | None = Field(default=None, max_length=1000)
    continues_previous: bool = False
    continues_next: bool = False

    @field_validator("path", "image_path")
    @classmethod
    def _relative(cls, value: str | None) -> str | None:
        return None if value is None else _validate_relative(value)

    @field_validator("body_sha256")
    @classmethod
    def _hex(cls, value: str) -> str:
        int(value, 16)
        return value.lower()

    @model_validator(mode="after")
    def _locator(self) -> "SourceUnitEntry":
        if self.page_number is None and not self.section_label:
            raise ValueError("A unit needs a page_number or a section_label.")
        if not self.path.endswith(f"/{self.unit_id}.md"):
            raise ValueError("Unit path must end with its unit_id.")
        return self


class SourceManifest(BaseModel):
    """Immutable published extraction manifest for one exact source version."""

    model_config = ConfigDict(extra="forbid")

    record_type: Literal["source_manifest"] = "source_manifest"
    immutable: Literal[True] = True
    editable: Literal[False] = False
    schema_version: Literal[1] = SCHEMA_VERSION
    matter_id: str = Field(min_length=1, max_length=120)
    source_id: str = Field(min_length=1, max_length=160)
    source_version: str = Field(min_length=8, max_length=64)
    title: str = Field(min_length=1, max_length=500)
    source_kind: Literal["supplied", "retrieved"]
    original_path: str = Field(min_length=1, max_length=1000)
    original_sha256: str = Field(min_length=64, max_length=64)
    requested_url: str | None = Field(default=None, max_length=2000)
    final_url: str | None = Field(default=None, max_length=2000)
    retrieved_at: str | None = Field(default=None, max_length=64)
    published_at: str | None = Field(default=None, max_length=64)
    effective_at: str | None = Field(default=None, max_length=64)
    jurisdiction: str | None = Field(default=None, max_length=200)
    extraction_format_version: int = Field(default=EXTRACTION_FORMAT_VERSION, ge=1)
    extraction_state: Literal["complete", "partial", "unavailable"]
    page_count: int | None = Field(default=None, ge=0)
    extracted_unit_count: int = Field(ge=0)
    total_chars: int = Field(ge=0, le=MAX_SOURCE_CHARS)
    unread_page_count: int = Field(default=0, ge=0)
    next_page: int | None = Field(default=None, ge=1)
    units: list[SourceUnitEntry] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list, max_length=200)
    predecessor_version: str | None = Field(default=None, max_length=64)
    created_at: str | None = Field(default=None, max_length=64)

    @field_validator("original_path")
    @classmethod
    def _relative(cls, value: str) -> str:
        return _validate_relative(value)

    @model_validator(mode="after")
    def _consistent(self) -> "SourceManifest":
        ids = [unit.unit_id for unit in self.units]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate unit_id in manifest.")
        if self.extracted_unit_count != len(self.units):
            raise ValueError("extracted_unit_count must match the unit list.")
        if self.total_chars != sum(unit.char_count for unit in self.units):
            raise ValueError("total_chars must match the sum of unit char counts.")
        prefix = f"{self.source_id}/{self.source_version}/"
        for unit in self.units:
            if not unit.path.startswith(prefix) and f"/{prefix}" not in unit.path:
                raise ValueError("Unit path must live inside its own source version directory.")
        return self


class UnitReceipt(BaseModel):
    model_config = ConfigDict(extra="forbid")

    unit_id: str = Field(min_length=1, max_length=64)
    path: str = Field(min_length=1, max_length=1000)
    body_sha256: str = Field(min_length=64, max_length=64)
    char_count: int = Field(ge=0, le=MAX_UNIT_CHARS)
    page_number: int | None = Field(default=None, ge=1)
    section_label: str | None = Field(default=None, max_length=200)
    extraction_method: str = Field(default="text", max_length=32)
    warning: str = Field(default="", max_length=500)
    image_path: str | None = Field(default=None, max_length=1000)

    @field_validator("path", "image_path")
    @classmethod
    def _relative(cls, value: str | None) -> str | None:
        return None if value is None else _validate_relative(value)


class ExtractionJob(BaseModel):
    """Mutable, atomically replaced extraction checkpoint for one source."""

    model_config = ConfigDict(extra="forbid")

    record_type: Literal["source_extraction_job"] = "source_extraction_job"
    schema_version: Literal[1] = SCHEMA_VERSION
    job_id: str = Field(min_length=1, max_length=120)
    matter_id: str = Field(min_length=1, max_length=120)
    source_id: str = Field(min_length=1, max_length=160)
    title: str = Field(min_length=1, max_length=500)
    source_kind: Literal["supplied", "retrieved"]
    original_path: str = Field(min_length=1, max_length=1000)
    original_sha256: str = Field(min_length=64, max_length=64)
    extraction_format_version: int = Field(default=EXTRACTION_FORMAT_VERSION, ge=1)
    unit_kind: Literal["pages", "sections"] = "pages"
    state: Literal["registered", "extracting", "partial", "complete", "unavailable"] = "registered"
    completed_units: list[UnitReceipt] = Field(default_factory=list)
    page_count: int | None = Field(default=None, ge=0)
    next_page: int | None = Field(default=None, ge=1)
    unread_pages: int = Field(default=0, ge=0)
    last_error: str = Field(default="", max_length=500)
    elapsed_seconds: float = Field(default=0.0, ge=0)
    sequence: int = Field(default=0, ge=0)
    warnings: list[str] = Field(default_factory=list, max_length=200)
    published_version: str | None = Field(default=None, max_length=64)
    requested_url: str | None = Field(default=None, max_length=2000)
    final_url: str | None = Field(default=None, max_length=2000)
    retrieved_at: str | None = Field(default=None, max_length=64)
    supplied_text_path: str | None = Field(default=None, max_length=1000)
    content_type: str = ""

    @field_validator("original_path")
    @classmethod
    def _relative(cls, value: str) -> str:
        return _validate_relative(value)

    @model_validator(mode="after")
    def _unique(self) -> "ExtractionJob":
        ids = [unit.unit_id for unit in self.completed_units]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate unit_id in extraction job receipts.")
        return self


class SourceSearchRequest(BaseModel):
    """Bounded model payload for search_research_sources."""

    model_config = ConfigDict(extra="forbid", strict=True)

    query: str = Field(min_length=1, max_length=2000, description="Whitespace-separated terms matched case-insensitively as substrings against saved source text. ANY term can match; this is not phrase, Boolean or semantic search. Use distinctive wording from the source itself.")
    source_id: str | None = Field(default=None, max_length=160, description="Restrict the search to one registered source_id from this matter's source library. Omit to search every registered source.")
    source_version: str | None = Field(default=None, max_length=64, description="Restrict the search to one exact source_version. Requires source_id. Omit to use the version pinned by this run, or the current published version.")
    limit: int = Field(default=5, ge=1, le=10, description="Maximum hits to return. Default 5, maximum 10. Each hit is a locator plus a short snippet, not the passage itself; read the unit before treating a snippet as support.")
