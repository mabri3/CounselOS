from __future__ import annotations

import io

import pytest
from fastapi import UploadFile
from docx import Document


class RecordingUpload:
    def __init__(self, data: bytes, filename: str):
        self._stream = io.BytesIO(data)
        self.filename = filename
        self.requests: list[int | None] = []

    async def read(self, size: int | None = -1) -> bytes:
        self.requests.append(size)
        if size is None or size < 0:
            raise AssertionError("ingestion must use a bounded upload read")
        return self._stream.read(size)


@pytest.mark.asyncio
async def test_upload_reads_bounded_chunks_and_rejects_one_byte_over_limit(app_context):
    app_context.ingestion.max_upload_bytes = 3
    upload = RecordingUpload(b"four", "too-large.txt")

    with pytest.raises(ValueError, match="Upload exceeds"):
        await app_context.ingestion.upload_to_matter("MAT-DEMO-BEACON", upload)  # type: ignore[arg-type]

    assert upload.requests and all(size is not None and size > 0 for size in upload.requests)
    assert not app_context.vault.exists("03_Matters/beacon-instant-onboarding/documents/too-large.txt")


@pytest.mark.asyncio
async def test_upload_accepts_the_exact_limit_with_bounded_reads(app_context):
    app_context.ingestion.max_upload_bytes = 3
    upload = RecordingUpload(b"one", "exact.txt")

    result = await app_context.ingestion.upload_to_matter("MAT-DEMO-BEACON", upload)  # type: ignore[arg-type]

    assert result["name"] == "exact.txt"
    assert upload.requests and all(size is not None and size > 0 for size in upload.requests)


@pytest.mark.asyncio
async def test_invalid_docx_is_rejected_before_source_persistence(app_context):
    upload = UploadFile(file=io.BytesIO(b"not a docx package"), filename="invalid.docx")

    with pytest.raises(ValueError, match="DOCX"):
        await app_context.ingestion.upload_to_matter("MAT-DEMO-BEACON", upload)

    assert not app_context.vault.exists("03_Matters/beacon-instant-onboarding/documents/invalid.docx")
    assert not app_context.vault.exists("03_Matters/beacon-instant-onboarding/documents/invalid.docx.extracted.md")


@pytest.mark.asyncio
async def test_workspace_invalid_docx_is_rejected_before_source_persistence(app_context):
    upload = UploadFile(file=io.BytesIO(b"not a docx package"), filename="invalid.docx")

    with pytest.raises(ValueError, match="DOCX"):
        await app_context.ingestion.upload_many_to_workspace([upload])

    assert list(app_context.vault.iter_files("04_Inbox/chat-uploads")) == []


@pytest.mark.asyncio
async def test_companion_failure_restores_an_existing_source_without_logging_its_content(app_context, monkeypatch, caplog):
    source = io.BytesIO()
    document = Document()
    document.add_paragraph("replacement")
    document.save(source)
    destination = "03_Matters/beacon-instant-onboarding/documents/replace.docx"
    app_context.vault.write_bytes(destination, b"existing private bytes")
    original_write_markdown = app_context.vault.write_markdown

    def fail_companion(path, content, metadata=None):
        if str(path).endswith(".docx.extracted.md") and "/replace-" in str(path):
            raise RuntimeError("private source text must not reach logs")
        return original_write_markdown(path, content, metadata)

    monkeypatch.setattr(app_context.vault, "write_markdown", fail_companion)
    with pytest.raises(RuntimeError):
        await app_context.ingestion.upload_to_matter(
            "MAT-DEMO-BEACON", UploadFile(file=io.BytesIO(source.getvalue()), filename="replace.docx")
        )

    assert app_context.vault.resolve(destination).read_bytes() == b"existing private bytes"
    assert "private source text" not in caplog.text
    assert "replace.docx" not in caplog.text


@pytest.mark.asyncio
async def test_matter_batch_rebuilds_once_and_keeps_index_current_after_partial_failure(app_context, monkeypatch):
    rebuilds: list[None] = []

    async def rebuild_async():
        rebuilds.append(None)

    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)
    uploads = [
        UploadFile(file=io.BytesIO(b"first"), filename="first.txt"),
        UploadFile(file=io.BytesIO(b"unsupported"), filename="second.exe"),
    ]

    result = await app_context.ingestion.upload_many_to_matter("MAT-DEMO-BEACON", uploads)
    assert result["upload_state"] == "partial"
    assert result["state"] == "preview"
    assert [item["state"] for item in result["results"]] == ["saved", "failed"]
    assert "Unsupported" in result["results"][1]["failure_detail"]
    assert len(result["attachments"]) == 1

    assert rebuilds == [None]
    assert app_context.vault.exists("03_Matters/beacon-instant-onboarding/documents/first.txt")


@pytest.mark.asyncio
async def test_matter_batch_rebuilds_once_when_first_source_event_fails(app_context, monkeypatch):
    rebuilds: list[None] = []

    async def rebuild_async():
        rebuilds.append(None)

    def fail_event(*_args, **_kwargs):
        raise RuntimeError("event write failed")

    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)
    monkeypatch.setattr(app_context.matters, "append_event", fail_event)

    result = await app_context.ingestion.upload_many_to_matter(
        "MAT-DEMO-BEACON", [UploadFile(file=io.BytesIO(b"first"), filename="first.txt")]
    )
    assert result["upload_state"] == "partial"
    assert result["state"] == "preview"
    assert result["results"][0]["state"] == "partial"
    assert result["results"][0]["path"] == result["attachments"][0]["path"]
    assert "Source saved" in result["results"][0]["failure_detail"]

    assert rebuilds == [None]
    assert app_context.vault.exists("03_Matters/beacon-instant-onboarding/documents/first.txt")


@pytest.mark.asyncio
async def test_workspace_upload_rebuilds_once_with_async_index_rebuild(app_context, monkeypatch):
    rebuilds: list[None] = []

    async def rebuild_async():
        rebuilds.append(None)

    monkeypatch.setattr(app_context.index, "rebuild_async", rebuild_async)
    result = await app_context.ingestion.upload_many_to_workspace([
        UploadFile(file=io.BytesIO(b"one"), filename="one.txt"),
        UploadFile(file=io.BytesIO(b"two"), filename="two.txt"),
    ])

    assert len(result["attachments"]) == 2
    assert rebuilds == [None]
