from __future__ import annotations

import io

import pytest
from fastapi import UploadFile
from pypdf import PdfWriter


@pytest.mark.asyncio
async def test_pdf_upload_always_creates_editable_companion(app_context):
    pdf = io.BytesIO()
    writer = PdfWriter()
    writer.add_blank_page(width=300, height=200)
    writer.write(pdf)
    pdf.seek(0)

    upload = UploadFile(file=pdf, filename="blank-source.pdf")
    result = await app_context.ingestion.upload_to_matter("MAT-DEMO-BEACON", upload)

    assert result["extracted_path"]
    companion = app_context.vault.read_markdown(result["extracted_path"])
    assert companion["metadata"]["source_filename"] == "blank-source.pdf"
    assert "No extractable text was found" in companion["content"]
