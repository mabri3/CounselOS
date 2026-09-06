import io
import pytest
from fastapi import UploadFile

MATTER = "MAT-DEMO-BEACON"


def upload(name, text):
    return UploadFile(filename=name, file=io.BytesIO(text))


@pytest.mark.asyncio
async def test_same_name_preserves_original_and_edited_companion(app_context):
    service = app_context.ingestion
    first = await service.upload_to_matter(MATTER, upload("same-name.txt", b"First bytes"))
    app_context.vault.update_markdown(first["extracted_path"], content="Lawyer edited companion")
    second = await service.upload_to_matter(MATTER, upload("same-name.txt", b"Second bytes"))
    retry = await service.upload_to_matter(MATTER, upload("same-name.txt", b"First bytes"))
    assert first["path"] != second["path"]
    assert first["extracted_path"] != second["extracted_path"]
    assert app_context.vault.resolve(first["path"]).read_bytes() == b"First bytes"
    assert app_context.vault.resolve(second["path"]).read_bytes() == b"Second bytes"
    assert app_context.vault.read_markdown(first["extracted_path"])["content"].strip() == "Lawyer edited companion"
    assert retry["path"] == first["path"] and retry["source_id"] == first["source_id"]
    assert app_context.vault.read_markdown(second["extracted_path"])["metadata"]["source_path"] == second["path"]


@pytest.mark.asyncio
async def test_mixed_batch_preserves_success_and_individual_failure_after_reload(app_context):
    service = app_context.ingestion
    result = await service.upload_many_to_matter(MATTER, [upload("good.txt", b"Good"), upload("bad.exe", b"Bad")])
    assert result["upload_state"] == "partial" and result["state"] == "preview"
    assert [r["state"] for r in result["results"]] == ["saved", "failed"]
    assert result["attachments"][0]["extraction_state"] == "available"
    saved = service.get_batch(MATTER, result["batch_id"])
    assert saved["results"] == result["results"]
    assert app_context.vault.exists(result["attachments"][0]["path"])
    assert len(result["attachments"]) == 1


@pytest.mark.asyncio
async def test_size_limit_and_empty_extraction_are_truthful(app_context, monkeypatch):
    service = app_context.ingestion
    service.max_upload_bytes = 4
    result = await service.upload_many_to_matter(MATTER, [upload("large.txt", b"12345"), upload("empty.txt", b"")])
    assert [r["state"] for r in result["results"]] == ["failed", "partial"]
    assert "limit" in result["results"][0]["failure_detail"]
    assert result["attachments"][0]["extraction_state"] == "unavailable"


@pytest.mark.asyncio
async def test_workspace_batch_does_not_hide_saved_success(app_context):
    result = await app_context.ingestion.upload_many_to_workspace([upload("good.txt", b"Good"), upload("bad.exe", b"Bad")])
    assert result["state"] == "partial"
    assert len(result["results"]) == 2
    assert app_context.vault.exists(result["attachments"][0]["extracted_path"])


@pytest.mark.asyncio
async def test_partial_pdf_preserves_available_pages_and_original(app_context, monkeypatch):
    from app.services import ingestion
    class Page:
        def __init__(self, broken=False):
            self.broken = broken
        def extract_text(self):
            if self.broken:
                raise ValueError("Page could not be decoded")
            return "Actual first page passage."
    class Reader:
        def __init__(self, data):
            self.pages = [Page(), Page(True)]
    monkeypatch.setattr(ingestion, "PdfReader", Reader)
    result = await app_context.ingestion.upload_to_matter(MATTER, upload("partial.pdf", b"original-pdf-bytes"))
    assert result["state"] == "partial" and result["extraction_state"] == "partial"
    assert "2" in result["failure_detail"]
    assert app_context.vault.resolve(result["path"]).read_bytes() == b"original-pdf-bytes"
    doc = app_context.vault.read_markdown(result["extracted_path"])
    assert "Actual first page passage." in doc["content"]
    assert doc["metadata"]["extraction_state"] == "partial"


@pytest.mark.asyncio
async def test_batch_record_failure_does_not_hide_saved_files(app_context, monkeypatch):
    service = app_context.ingestion
    def fail(*args):
        raise OSError("Disk error")
    monkeypatch.setattr(service, "_save_batch", fail)
    result = await service.upload_many_to_matter(MATTER, [upload("visible.txt", b"Preserved source")])
    assert result["upload_state"] == "partial" and not result["batch_saved"]
    assert "record could not be saved" in result["failure_detail"]
    assert app_context.vault.resolve(result["attachments"][0]["path"]).read_bytes() == b"Preserved source"


def test_source_library_skips_internal_history_but_keeps_saved_references(app_context, monkeypatch):
    ctx = app_context
    base = ctx.matters.matter_path(MATTER)
    current = f"{base}/drafts/current.md"
    archive = f"{base}/drafts/.history/current/{'a' * 64}.md"
    hidden = f"{base}/sources/.private/supplied.md"
    metadata = {"matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-discovery"}
    for path in [current, archive, hidden]:
        ctx.vault.write_markdown(path, "Preserved original text.", metadata)
    selection = ctx.workspace_evidence.selection(MATTER)
    selected = ctx.workspace_evidence.save_selection(MATTER, [{"reference_id": "old-review", "path": archive, "role": "prior_work", "selected": True}], expected_revision=selection["revision"])
    before = {path: ctx.vault.resolve(path).read_bytes() for path in [current, archive, hidden]}
    read = ctx.vault.read_document
    def counted(path):
        assert path != archive, "default library must skip the review archive before parsing"
        return read(path)
    monkeypatch.setattr(ctx.vault, "read_document", counted)
    listed = {item["path"] for item in ctx.workspace_evidence.library(MATTER)}
    assert current in listed and hidden in listed and archive not in listed
    assert ctx.workspace_evidence.selection(MATTER) == selected
    monkeypatch.setattr(ctx.vault, "read_document", read)
    assert read(archive)["content"].strip() == "Preserved original text."
    assert {path: ctx.vault.resolve(path).read_bytes() for path in before} == before
