"""SQLite projection, catalog freshness, stale-hit rejection and index-loss fallback."""
import io

import pytest
from fastapi import UploadFile

from app.services.index import SCHEMA_VERSION
from app.services.source_index import SOURCE_TABLES

MATTER = "MAT-DEMO-BEACON"
OTHER = "MAT-DEMO-HARBOR"


async def upload(app_context, name, data, matter_id=MATTER):
    return await app_context.ingestion.upload_to_matter(
        matter_id, UploadFile(filename=name, file=io.BytesIO(data)))


def rows(app_context, sql, params=None):
    return app_context.index._query(sql, params or {})


@pytest.mark.asyncio
async def test_manifests_and_units_are_projected_into_the_disposable_index(app_context):
    result = await upload(app_context, "handbook.txt", b"Termination notice must be given in writing.\n")
    app_context.index.rebuild()
    assert SCHEMA_VERSION == 6
    assert set(SOURCE_TABLES) <= {r["name"] for r in rows(app_context, "SELECT name FROM sqlite_master WHERE type='table'")}
    versions = rows(app_context, "SELECT * FROM source_versions WHERE matter_id = :m", {"m": MATTER})
    assert [v["source_id"] for v in versions] == [result["library_source_id"]]
    assert versions[0]["extraction_state"] == "complete"
    units = rows(app_context, "SELECT * FROM source_units WHERE source_id = :s", {"s": result["library_source_id"]})
    assert units and units[0]["body_hash"]
    assert app_context.vault.exists(units[0]["path"])


@pytest.mark.asyncio
async def test_deleting_only_the_sqlite_file_and_rebuilding_restores_identical_sources(app_context):
    body = b"Clause 12. Ninety days written notice is required before termination.\n"
    result = await upload(app_context, "contract.txt", body)
    library = app_context.source_library
    before_catalog = library.catalog(MATTER)
    before_hits = library.search(MATTER, "ninety days written notice")

    app_context.index.db_path.unlink()
    report = app_context.index.rebuild()

    assert report.error_count == 0
    after_catalog = library.catalog(MATTER)
    after_hits = library.search(MATTER, "ninety days written notice")
    assert after_catalog["sources"] == before_catalog["sources"]
    assert after_catalog["generation"] == before_catalog["generation"]
    assert after_hits["hits"] == before_hits["hits"]
    assert after_hits["hits"][0]["source_version"] == result["library_source_version"]
    read = library.read(MATTER, result["library_source_id"], result["library_source_version"],
                        after_hits["hits"][0]["unit_id"])
    assert "Ninety days written notice" in read["text"]


@pytest.mark.asyncio
async def test_a_stale_hit_is_rejected_rather_than_presented_as_current_evidence(app_context):
    result = await upload(app_context, "policy-b.txt", b"The escalation window is fourteen days.\n")
    library = app_context.source_library
    unit_path = library.describe(MATTER, result["library_source_id"], result["library_source_version"])["units"][0]["path"]
    assert library.search(MATTER, "escalation window")["hits"]
    app_context.vault.resolve(unit_path).write_text(
        "---\nrecord_type: source_unit\n---\nThe escalation window is ninety days.\n", encoding="utf-8")
    hits = library.search(MATTER, "escalation window")
    assert hits["hits"] == []
    assert any("no longer matches its published hash" in warning for warning in hits["warnings"])
    assert library.read(MATTER, result["library_source_id"], result["library_source_version"],
                        "s000001")["status"] == "stale_source"


@pytest.mark.asyncio
async def test_a_failed_index_refresh_still_returns_a_readable_result(app_context, monkeypatch):
    result = await upload(app_context, "fallback.txt", b"The waiver provision survives termination.\n")
    library = app_context.source_library

    real_query = app_context.index._query

    def broken(*args, **kwargs):
        raise RuntimeError("index unavailable")

    def partial_query(sql, params=None):
        if "source_catalogs" in sql:
            raise RuntimeError("index unavailable")
        return real_query(sql, params)

    monkeypatch.setattr(app_context.index, "_query", partial_query)
    monkeypatch.setattr(app_context.index, "lexical_search", broken)
    hits = library.search(MATTER, "waiver provision")
    assert hits["hits"] and hits["hits"][0]["source_id"] == result["library_source_id"]
    assert any("direct scan" in warning for warning in hits["warnings"])
    assert app_context.vault.exists(library.describe(MATTER, result["library_source_id"], result["library_source_version"])["manifest_path"])


@pytest.mark.asyncio
async def test_catalog_generation_mismatch_triggers_one_local_refresh(app_context):
    await upload(app_context, "first.txt", b"First registered source about indemnity.\n")
    library = app_context.source_library
    generation = library.generation(MATTER)
    assert rows(app_context, "SELECT indexed_generation FROM source_catalogs WHERE matter_id = :m",
                {"m": MATTER})[0]["indexed_generation"] == generation

    path = app_context.vault.write_bytes(
        app_context.matters.matter_path(MATTER) + "/documents/second.txt", b"Second source about indemnity caps.\n")
    job = library.register_saved_source(MATTER, path, source_id="SRC-SECOND", title="second.txt", source_kind="supplied")
    await library.extract_or_resume(MATTER, job["job_id"])
    assert library.generation(MATTER) != generation

    hits = library.search(MATTER, "indemnity caps")
    assert hits["hits"] and hits["hits"][0]["source_id"] == "SRC-SECOND"
    assert rows(app_context, "SELECT indexed_generation FROM source_catalogs WHERE matter_id = :m",
                {"m": MATTER})[0]["indexed_generation"] == library.generation(MATTER)


@pytest.mark.asyncio
async def test_another_matters_source_text_never_leaks_into_snippets_or_catalog(app_context):
    await upload(app_context, "confidential.txt", b"SECRETMARKER harbor pricing floor is twelve dollars.\n", matter_id=OTHER)
    await upload(app_context, "ours.txt", b"Beacon onboarding notice period is ten days.\n")
    library = app_context.source_library
    hits = library.search(MATTER, "SECRETMARKER harbor pricing")
    assert hits["hits"] == []
    assert "SECRETMARKER" not in str(hits)
    catalog = library.catalog(MATTER)
    assert all(item["original_path"].startswith(app_context.matters.matter_path(MATTER)) for item in catalog["sources"])
    assert "SECRETMARKER" not in app_context.vault.read_text(library.catalog_path(MATTER))
    assert library.search(OTHER, "SECRETMARKER harbor pricing")["hits"]


@pytest.mark.asyncio
async def test_a_malformed_manifest_is_an_index_error_and_valid_sources_stay_searchable(app_context):
    result = await upload(app_context, "good.txt", b"Good source about assignment consent.\n")
    library = app_context.source_library
    broken_path = library.manifest_path(MATTER, "SRC-BROKEN", "deadbeefdeadbeefdeadbeefdeadbeef")
    app_context.vault.write_markdown(broken_path, "Broken", {"record_type": "source_manifest", "schema_version": 1})
    report = app_context.index.rebuild()
    assert report.error_count >= 1
    assert any("SRC-BROKEN" in error for error in report.errors)
    hits = library.search(MATTER, "assignment consent")
    assert hits["hits"] and hits["hits"][0]["source_id"] == result["library_source_id"]


@pytest.mark.asyncio
async def test_legacy_vault_search_semantics_are_unchanged(app_context):
    root = app_context.matters.matter_path(MATTER) + "/documents/legacy-fixture"
    app_context.vault.write_markdown(root + "/a.md", "Blue gate opens at noon. Blue gate closes at dusk.")
    app_context.vault.write_markdown(root + "/b.md", "A blueprint is on the shelf.")
    await upload(app_context, "unrelated.txt", b"A registered source that must not change legacy search.\n")
    app_context.index.rebuild()
    for query in ["BLUE missingword", "gate", '"blue gate"', "x y", "un"]:
        assert app_context.index.lexical_search(query, relative_path=root) == \
            app_context.vault.lexical_search(query, relative_path=root)


@pytest.mark.asyncio
async def test_saved_file_listing_reports_library_extraction_state_after_reload(app_context):
    import pymupdf as fitz
    document = fitz.open()
    for _ in range(12):
        page = document.new_page()
        page.draw_rect(fitz.Rect(0, 0, page.rect.width, page.rect.height), fill=(0.5, 0.5, 0.5))
    scanned = document.tobytes()
    document.close()
    partial = await upload(app_context, "appendix.pdf", scanned)
    whole = await upload(app_context, "clear.txt", b"A fully extracted saved source about indemnity.\n")
    assert partial["library_extraction_state"] == "partial"

    entries = {entry["name"]: entry for entry in app_context.workspace_evidence.library(MATTER)}
    assert entries["appendix.pdf"]["library_extraction_state"] == "partial"
    assert entries["appendix.pdf"]["extraction_state"] == "partial"
    assert entries["appendix.pdf"]["library_unread_pages"] > 0
    assert "pages are not extracted yet" in entries["appendix.pdf"]["failure_detail"]
    assert entries["clear.txt"]["library_extraction_state"] == "complete"
    assert entries["clear.txt"]["extraction_state"] != "partial"
    assert "failure_detail" not in entries["clear.txt"]
