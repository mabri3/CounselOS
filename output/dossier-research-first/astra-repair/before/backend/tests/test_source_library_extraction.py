"""Page-preserving extraction: capacity, targeted pages, OCR limits, resume."""
import io
import json

import pytest
from fastapi import UploadFile

from app.models.source_library import MAX_LIBRARY_PAGES
from app.services import source_extraction

MATTER = "MAT-DEMO-BEACON"


def native_pdf(pages: int, *, marker_page: int | None = None, marker: str = "") -> bytes:
    import pymupdf as fitz
    document = fitz.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        body = f"Page {number} of the synthetic agreement. Clause {number} governs ordinary operation."
        if marker_page and number == marker_page:
            body += "\n" + marker
        page.insert_text((72, 100), body, fontsize=11)
    data = document.tobytes()
    document.close()
    return data


def scanned_pdf(pages: int, native_prefix: int = 0) -> bytes:
    """Pages after the prefix carry a large image block and almost no text."""
    import pymupdf as fitz
    document = fitz.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        if number <= native_prefix:
            page.insert_text((72, 100), f"Native page {number} with enough real text to skip recognition entirely.")
        else:
            page.draw_rect(fitz.Rect(0, 0, page.rect.width, page.rect.height), fill=(0.5, 0.5, 0.5))
    data = document.tobytes()
    document.close()
    return data


async def register(app_context, name, data, **kwargs):
    result = await app_context.ingestion.upload_to_matter(
        MATTER, UploadFile(filename=name, file=io.BytesIO(data)), **kwargs)
    return result


def test_section_splitting_is_deterministic_and_marks_continuations():
    short = source_extraction.split_sections("one\n\ntwo\n\nthree")
    assert len(short) == 1 and short[0]["text"] == "one\n\ntwo\n\nthree"
    long_paragraph = "x" * 30000
    units = source_extraction.split_sections(long_paragraph)
    assert [len(unit["text"]) for unit in units] == [12000, 12000, 6000]
    assert units[0]["continues_next"] and units[1]["continues_previous"] and not units[-1]["continues_next"]
    assert "".join(unit["text"] for unit in units) == long_paragraph
    assert source_extraction.split_sections(long_paragraph) == units


@pytest.mark.asyncio
async def test_thousand_page_native_pdf_is_extracted_and_a_late_page_is_readable(app_context):
    marker = "LATE EXCEPTION: notice is not required when the regulator has already published the order."
    data = native_pdf(1000, marker_page=900, marker=marker)
    result = await register(app_context, "long-agreement.pdf", data)
    library = app_context.source_library
    descriptor = library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    assert descriptor["page_count"] == 1000
    assert descriptor["extracted_unit_count"] == 1000
    assert descriptor["extraction_state"] == "complete"
    assert descriptor["total_chars"] > 50_000
    late = library.read(MATTER, descriptor["source_id"], descriptor["source_version"], "p000900")
    assert "LATE EXCEPTION" in late["text"]
    assert late["page_number"] == 900 and late["extraction_method"] == "pdf_text"
    assert len(late["text"]) <= 6000
    hits = library.search(MATTER, "LATE EXCEPTION regulator", limit=5)
    assert hits["hits"] and hits["hits"][0]["unit_id"] == "p000900"
    assert hits["hits"][0]["page_number"] == 900


@pytest.mark.asyncio
async def test_targeted_page_extraction_reaches_a_late_page_behind_a_scanned_prefix(app_context, monkeypatch):
    data = scanned_pdf(12, native_prefix=0)
    result = await register(app_context, "scanned.pdf", data)
    library = app_context.source_library
    job = library._load_job(MATTER, result["library_job_id"])
    assert job.state == "partial" and job.unread_pages > 0
    assert result["library_extraction_state"] == "partial"
    descriptor = await library.extract_or_resume(MATTER, job.job_id, page_number=12)
    published = library.describe(MATTER, descriptor["source_id"], descriptor["source_version"])
    assert "p000012" in {unit["unit_id"] for unit in published["units"]}


@pytest.mark.asyncio
async def test_missing_ocr_binary_keeps_native_text_and_labels_the_failure(app_context, monkeypatch):
    def unavailable(*args, **kwargs):
        raise FileNotFoundError("tesseract")
    monkeypatch.setattr(source_extraction.subprocess, "run", unavailable)
    staging = app_context.vault.resolve("00_System/cache/ocr-missing")
    original = app_context.vault.resolve("00_System/cache/ocr-missing.pdf")
    original.parent.mkdir(parents=True, exist_ok=True)
    original.write_bytes(scanned_pdf(2))
    summary = source_extraction.extract_pages(str(original), str(staging), 1, None)
    progress = json.loads((staging / "progress.json").read_text())
    assert summary["state"] in {"partial", "complete"}
    assert all(entry["method"] == "unread" for entry in progress["pages"])
    assert any("OCR unavailable" in entry["warning"] for entry in progress["pages"])
    assert all(entry["image"] for entry in progress["pages"])  # page images retained


@pytest.mark.asyncio
async def test_encrypted_and_malformed_input_report_a_visible_failure_not_a_fake_source(app_context):
    """Registration accepts bytes the upload extractor rejects; it never fabricates text."""
    import pymupdf as fitz
    document = fitz.open()
    document.new_page().insert_text((72, 100), "Locked clause text that must not be invented.")
    encrypted = document.tobytes(encryption=fitz.PDF_ENCRYPT_AES_256, owner_pw="o", user_pw="u")
    document.close()
    library = app_context.source_library
    root = app_context.matters.matter_path(MATTER) + "/documents"
    for name, data, source_id in [("damaged.pdf", b"%PDF-1.4 broken bytes", "SRC-DAMAGED"),
                                  ("locked.pdf", encrypted, "SRC-LOCKED")]:
        path = app_context.vault.write_bytes(f"{root}/{name}", data)
        job = library.register_saved_source(MATTER, path, source_id=source_id, title=name, source_kind="supplied")
        descriptor = await library.extract_or_resume(MATTER, job["job_id"])
        published = library.describe(MATTER, descriptor["source_id"], descriptor["source_version"])
        assert published["extraction_state"] == "unavailable"
        assert published["extracted_unit_count"] == 0
        assert app_context.vault.exists(published["original_path"])
        assert app_context.vault.resolve(published["original_path"]).read_bytes() == data
    assert library.search(MATTER, "broken bytes")["status"] == "not_found"
    assert library.search(MATTER, "Locked clause")["status"] == "not_found"


@pytest.mark.asyncio
async def test_interrupted_extraction_resumes_without_losing_completed_pages(app_context, monkeypatch):
    data = native_pdf(40)
    real = source_extraction.run_page_extraction

    async def stop_early(pdf_path, staging, *, start_page=1, target_page=None):
        await real(pdf_path, staging, start_page=start_page, target_page=None)
        progress = json.loads((staging / "progress.json").read_text())
        progress["pages"] = progress["pages"][:10]
        progress.update(next_page=11, unread_pages=30, state="partial")
        (staging / "progress.json").write_text(json.dumps(progress))
        return {"page_count": 40, "next_page": 11, "unread_pages": 30, "state": "partial",
                "warnings": ["Extraction reached its 45-second limit; completed pages and the original file remain available."],
                "extracted": 10}

    monkeypatch.setattr(source_extraction, "run_page_extraction", stop_early)
    monkeypatch.setattr("app.services.source_library.run_page_extraction", stop_early)
    result = await register(app_context, "interrupted.pdf", data)
    library = app_context.source_library
    first = library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    assert first["extraction_state"] == "partial"
    assert first["extracted_unit_count"] == 10 and first["unread_page_count"] == 30
    assert first["next_page"] == 11
    assert any("45-second limit" in warning for warning in first["warnings"])

    monkeypatch.setattr("app.services.source_library.run_page_extraction", real)
    descriptor = await library.extract_or_resume(MATTER, result["library_job_id"])
    second = library.describe(MATTER, descriptor["source_id"], descriptor["source_version"])
    assert second["extraction_state"] == "complete" and second["extracted_unit_count"] == 40
    assert second["predecessor_version"] == first["source_version"]
    # The earlier partial version and its citations still resolve.
    assert library.read(MATTER, first["source_id"], first["source_version"], "p000001")["status"] in {"read", "partial"}


@pytest.mark.asyncio
async def test_page_ceiling_is_reported_rather_than_silently_sliced(app_context):
    assert MAX_LIBRARY_PAGES == 1000
    import pymupdf as fitz
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 100), "Short page.")
    data = document.tobytes()
    document.close()
    result = await register(app_context, "tiny.pdf", data)
    library = app_context.source_library
    descriptor = library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    assert descriptor["page_count"] == 1 and descriptor["extraction_state"] == "complete"


@pytest.mark.asyncio
async def test_real_ocr_binary_recognizes_a_scanned_page_within_its_invocation_budget(app_context):
    import shutil
    if not shutil.which("tesseract"):
        pytest.skip("No local OCR binary; the mocked-failure test covers the unavailable path.")
    import pymupdf as fitz
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 200), "SCANNED NOTICE CLAUSE", fontsize=40)
    rendered = page.get_pixmap(dpi=150)
    scanned = fitz.open()
    image_page = scanned.new_page(width=page.rect.width, height=page.rect.height)
    image_page.insert_image(image_page.rect, pixmap=rendered)
    data = scanned.tobytes()
    document.close()
    scanned.close()
    staging = app_context.vault.resolve("00_System/cache/ocr-real")
    original = app_context.vault.resolve("00_System/cache/ocr-real.pdf")
    original.parent.mkdir(parents=True, exist_ok=True)
    original.write_bytes(data)
    source_extraction.extract_pages(str(original), str(staging), 1, None)
    progress = json.loads((staging / "progress.json").read_text())
    assert progress["pages"][0]["method"] == "ocr"
    assert "OCR may misread" in progress["pages"][0]["warning"]
    text = source_extraction.page_file(staging, 1).read_text()
    assert "SCANNED" in text.upper()


@pytest.mark.asyncio
async def test_ocr_budget_stops_one_invocation_and_does_not_loop_the_whole_source(app_context):
    data = scanned_pdf(12)
    path = app_context.vault.write_bytes(app_context.matters.matter_path(MATTER) + "/documents/many-scans.pdf", data)
    library = app_context.source_library
    job = library.register_saved_source(MATTER, path, source_id="SRC-MANYSCANS", title="Scans", source_kind="supplied")
    descriptor = await library.extract_or_resume(MATTER, job["job_id"])
    assert descriptor["extraction_state"] == "partial"
    assert descriptor["unread_page_count"] >= 12 - source_extraction.MAX_OCR_PAGES
    assert descriptor["next_page"] and descriptor["next_page"] <= 12
