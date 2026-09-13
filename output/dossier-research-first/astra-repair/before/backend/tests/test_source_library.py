"""Source-library contracts, registration, publication and version identity."""
import hashlib
import io

import pytest
from fastapi import UploadFile
from pydantic import ValidationError

from app.models.source_library import (
    EXTRACTION_FORMAT_VERSION, ExtractionJob, SourceManifest, SourceSearchRequest, SourceUnitEntry,
)

MATTER = "MAT-DEMO-BEACON"


def unit(**overrides):
    base = {"unit_id": "p000001", "path": "SRC-A/v1/pages/p000001.md",
            "body_sha256": "a" * 64, "char_count": 10, "page_number": 1,
            "extraction_method": "pdf_text"}
    return {**base, **overrides}


def manifest(**overrides):
    entry = overrides.pop("unit_overrides", {})
    units = overrides.pop("units", [unit(**entry)])
    base = {"matter_id": MATTER, "source_id": "SRC-A", "source_version": "v1abcdef",
            "title": "A source", "source_kind": "supplied",
            "original_path": "matter/documents/a.pdf", "original_sha256": "b" * 64,
            "extraction_state": "complete", "extracted_unit_count": len(units),
            "total_chars": sum(u["char_count"] for u in units), "units": units}
    return {**base, **overrides}


# --- Step 1: typed contracts -------------------------------------------------

def test_manifest_requires_its_keys_and_rejects_bad_enums_and_offsets():
    with pytest.raises(ValidationError):
        SourceManifest.model_validate({k: v for k, v in manifest().items() if k != "source_id"})
    with pytest.raises(ValidationError):
        SourceManifest.model_validate(manifest(extraction_state="mostly"))
    with pytest.raises(ValidationError):
        SourceManifest.model_validate(manifest(source_kind="invented"))
    with pytest.raises(ValidationError):
        SourceUnitEntry.model_validate(unit(char_count=-1))
    with pytest.raises(ValidationError):
        SourceUnitEntry.model_validate(unit(page_number=0))
    with pytest.raises(ValidationError):
        SourceUnitEntry.model_validate(unit(page_number=None, section_label=None))


def test_manifest_rejects_duplicate_units_and_escaping_paths():
    duplicates = [unit(), unit(path="SRC-A/v1/pages/p000001.md")]
    with pytest.raises(ValidationError, match="Duplicate unit_id"):
        SourceManifest.model_validate(manifest(units=duplicates))
    for bad in ["../../etc/passwd/p000001.md", "/etc/p000001.md", "SRC-A/v1/../../p000001.md"]:
        with pytest.raises(ValidationError):
            SourceUnitEntry.model_validate(unit(path=bad))
    with pytest.raises(ValidationError, match="inside its own source version"):
        SourceManifest.model_validate(manifest(units=[unit(path="SRC-B/v9/pages/p000001.md")]))
    with pytest.raises(ValidationError, match="unit_id"):
        SourceUnitEntry.model_validate(unit(path="SRC-A/v1/pages/other.md"))


def test_manifest_totals_must_match_the_saved_units():
    with pytest.raises(ValidationError, match="extracted_unit_count"):
        SourceManifest.model_validate(manifest(extracted_unit_count=9))
    with pytest.raises(ValidationError, match="total_chars"):
        SourceManifest.model_validate(manifest(total_chars=999))


def test_extraction_job_and_search_request_contracts():
    job = ExtractionJob.model_validate({
        "job_id": "JOB-1", "matter_id": MATTER, "source_id": "SRC-A", "title": "A",
        "source_kind": "supplied", "original_path": "m/a.pdf", "original_sha256": "c" * 64})
    assert job.state == "registered" and job.extraction_format_version == EXTRACTION_FORMAT_VERSION
    with pytest.raises(ValidationError):
        ExtractionJob.model_validate({**job.model_dump(), "original_path": "../outside.pdf"})
    assert SourceSearchRequest.model_validate({"query": "notice period"}).limit == 5
    for bad in [{"query": ""}, {"query": "x", "limit": 11}, {"query": "x", "limit": 0}, {"query": "x", "extra": 1}]:
        with pytest.raises(ValidationError):
            SourceSearchRequest.model_validate(bad)
    schema = SourceSearchRequest.model_json_schema()
    assert all(field.get("description") for field in schema["properties"].values())


# --- Step 2: registration, publication and version identity ------------------

async def upload(app_context, name, data):
    return await app_context.ingestion.upload_to_matter(
        MATTER, UploadFile(filename=name, file=io.BytesIO(data)))


@pytest.mark.asyncio
async def test_upload_registers_a_library_source_and_publishes_a_readable_version(app_context):
    body = b"Notice period. The tenant shall give ninety days notice before vacating.\n"
    result = await upload(app_context, "lease.txt", body)
    assert result["library_source_id"] and result["library_source_version"]
    library = app_context.source_library
    descriptor = library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    assert descriptor["extraction_state"] == "complete"
    assert descriptor["original_sha256"] == hashlib.sha256(body).hexdigest()
    read = library.read(MATTER, descriptor["source_id"], descriptor["source_version"], descriptor["units"][0]["unit_id"])
    assert "ninety days notice" in read["text"]
    assert read["status"] == "read"
    manifest_record = app_context.vault.read_markdown(descriptor["manifest_path"])["metadata"]
    assert SourceManifest.model_validate(manifest_record).source_version == descriptor["source_version"]


@pytest.mark.asyncio
async def test_identical_bytes_reuse_the_version_and_changed_bytes_create_a_new_one(app_context):
    first = await upload(app_context, "policy.txt", b"Original policy body text for the matter.\n")
    again = await upload(app_context, "policy.txt", b"Original policy body text for the matter.\n")
    changed = await upload(app_context, "policy.txt", b"Revised policy body text for the matter.\n")
    assert again["library_source_version"] == first["library_source_version"]
    assert changed["library_source_version"] != first["library_source_version"]
    library = app_context.source_library
    assert library.describe(MATTER, first["library_source_id"], first["library_source_version"])["extraction_state"] == "complete"
    versions = {v["source_version"] for v in library.catalog(MATTER)["sources"]}
    assert {first["library_source_version"], changed["library_source_version"]} <= versions


@pytest.mark.asyncio
async def test_published_units_are_immutable_and_hash_checked(app_context):
    result = await upload(app_context, "rules.txt", b"Rule one. Rule two. Rule three about the exception.\n")
    library = app_context.source_library
    descriptor = library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    unit_path = descriptor["units"][0]["path"]
    assert app_context.vault.read_markdown(unit_path)["metadata"]["immutable"] is True
    app_context.vault.resolve(unit_path).write_text("---\nrecord_type: source_unit\n---\ntampered\n", encoding="utf-8")
    stale = library.read(MATTER, descriptor["source_id"], descriptor["source_version"], descriptor["units"][0]["unit_id"])
    assert stale["status"] == "stale_source"
    assert "tampered" not in str(stale.get("text", ""))
