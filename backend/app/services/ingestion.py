from __future__ import annotations

import io
from pathlib import Path
from typing import Any

from docx import Document as DocxDocument
from fastapi import UploadFile
from pypdf import PdfReader

from app.services.index import IndexService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.paths import safe_filename
from app.utils.time import iso_now


class IngestionService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        matters: MatterService,
        max_upload_mb: int = 25,
    ):
        self.vault = vault
        self.index = index
        self.matters = matters
        self.max_upload_bytes = max_upload_mb * 1024 * 1024

    async def upload_to_matter(self, matter_id: str, upload: UploadFile) -> dict[str, Any]:
        data = await upload.read()
        if len(data) > self.max_upload_bytes:
            raise ValueError(f"Upload exceeds {self.max_upload_bytes // (1024 * 1024)} MB limit.")
        name = safe_filename(upload.filename or "uploaded-file")
        base = self.matters.matter_path(matter_id)
        destination = f"{base}/documents/{name}"
        self.vault.write_bytes(destination, data)
        result: dict[str, Any] = {"path": destination, "name": name, "extracted_path": None}

        extracted = self._extract_text(name, data)
        suffix = Path(name).suffix.lower()
        if extracted.strip() or suffix in {".pdf", ".docx"}:
            companion = f"{base}/documents/{name}.extracted.md"
            extracted_body = extracted.strip() or (
                "No extractable text was found. The source may contain only images or empty pages."
            )
            self.vault.write_markdown(
                companion,
                f"# Extracted text: {name}\n\n{extracted_body}\n",
                {
                    "record_type": "extracted_document",
                    "matter_id": matter_id,
                    "source_path": destination,
                    "source_filename": name,
                    "created_at": iso_now(),
                },
            )
            result["extracted_path"] = companion
        self.matters.append_event(
            matter_id,
            "document_uploaded",
            {"title": f"Uploaded {name}", "path": destination},
            rebuild=False,
        )
        self.index.rebuild()
        return result

    @staticmethod
    def _extract_text(name: str, data: bytes) -> str:
        suffix = Path(name).suffix.lower()
        if suffix in {".md", ".txt", ".csv", ".json"}:
            return data.decode("utf-8", errors="replace")
        if suffix == ".pdf":
            reader = PdfReader(io.BytesIO(data))
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n\n".join(pages)
        if suffix == ".docx":
            document = DocxDocument(io.BytesIO(data))
            blocks = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
            for table in document.tables:
                for row in table.rows:
                    blocks.append(" | ".join(cell.text.strip() for cell in row.cells))
            return "\n\n".join(blocks)
        return ""
