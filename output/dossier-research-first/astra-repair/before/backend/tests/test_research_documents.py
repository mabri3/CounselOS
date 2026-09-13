"""Real local extraction of synthetic text, scanned and mixed PDF pages."""
import pytest

from app.services.research_documents import extract_document


def synthetic_pdf(kind):
    import pymupdf as fitz
    text = "SYNTHETIC NOTICE RULE: Thirty days notice is required before termination."
    source = fitz.open()
    page = source.new_page(width=700, height=300)
    page.insert_text((35, 80), text, fontsize=14)
    if kind == "text":
        return source.tobytes()
    scan = page.get_pixmap(matrix=fitz.Matrix(2, 2)).tobytes("png")
    mixed = fitz.open()
    if kind == "mixed":
        mixed.insert_pdf(source)
    page = mixed.new_page(width=700, height=300)
    page.insert_image(page.rect, stream=scan)
    return mixed.tobytes()


@pytest.mark.asyncio
@pytest.mark.parametrize("kind", ["text", "scanned", "mixed"])
async def test_real_text_and_ocr_pdf_extraction(app_context, kind):
    result = await extract_document(synthetic_pdf(kind), app_context.settings, source_key="synthetic-" + kind,
                                    source_directory="03_Matters/beacon-instant-onboarding/research/sources")
    assert result["pages"], result
    assert all("notice" in p["text"].lower() for p in result["pages"]), result
    assert [p["page"] for p in result["pages"]] == list(range(1, len(result["pages"]) + 1))
    assert result["pages"][-1]["method"] == ("pdf_text" if kind == "text" else "ocr")
    if kind == "mixed":
        assert result["pages"][0]["method"] == "pdf_text"
        assert result["ocr_pages"] == 1


@pytest.mark.asyncio
async def test_document_bounds_and_damaged_file_preserve_fetched_bytes(app_context):
    with pytest.raises(ValueError, match="5 MB"):
        await extract_document(b"x" * (5 * 1024 * 1024 + 1), app_context.settings, source_key="too-large")
    result = await extract_document(b"%PDF-broken", app_context.settings, source_key="damaged")
    assert not result["pages"]
    assert result["warnings"]
    assert app_context.vault.exists(result["original_file_path"])


@pytest.mark.asyncio
async def test_real_ocr_page_limit_and_saved_extraction_replay(app_context):
    import pymupdf
    source = pymupdf.open(stream=synthetic_pdf("scanned"), filetype="pdf")
    document = pymupdf.open()
    for _ in range(7):
        document.insert_pdf(source)
    data = document.tobytes(garbage=4, deflate=True)
    first = await extract_document(data, app_context.settings, source_key="seven-scans")
    assert first["ocr_pages"] == 6
    assert first["pages"][6]["method"] == "unread"
    assert first["content_truncated"]
    again = await extract_document(data, app_context.settings, source_key="seven-scans")
    assert again["ocr_pages"] == 6 and again["pages"] == first["pages"]


@pytest.mark.asyncio
async def test_mixed_pdf_timeout_keeps_completed_text_and_resumes_ocr(app_context, monkeypatch, tmp_path):
    import asyncio
    import os
    import sys
    import app.services.research_documents as documents
    # A slow local OCR executable makes the child-process deadline deterministic.
    command = tmp_path / "tesseract"
    command.write_text(f"#!{sys.executable}\nimport time\ntime.sleep(10)\n")
    command.chmod(0o700)
    old_path = os.environ.get("PATH", "")
    monkeypatch.setenv("PATH", str(tmp_path) + os.pathsep + old_path)
    original_wait = asyncio.wait_for
    async def short_wait(awaitable, timeout):
        return await original_wait(awaitable, 1)
    monkeypatch.setattr(documents.asyncio, "wait_for", short_wait)
    data = synthetic_pdf("mixed")
    partial = await extract_document(data, app_context.settings, source_key="mixed-timeout")
    assert partial["content_truncated"]
    assert len(partial["pages"]) == 1 and partial["pages"][0]["method"] == "pdf_text"
    assert "notice" in partial["pages"][0]["text"].lower()
    monkeypatch.setattr(documents.asyncio, "wait_for", original_wait)
    monkeypatch.setenv("PATH", old_path)
    resumed = await extract_document(data, app_context.settings, source_key="mixed-timeout")
    assert resumed["pages"][0] == partial["pages"][0]
    assert len(resumed["pages"]) == 2 and resumed["pages"][1]["method"] == "ocr"
    assert "notice" in resumed["pages"][1]["text"].lower()
