from __future__ import annotations

import hashlib
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
    TEXT_SUFFIXES = {".md", ".txt", ".pdf", ".docx"}
    IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".heic"}
    SUPPORTED_SUFFIXES = TEXT_SUFFIXES | IMAGE_SUFFIXES

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
        name = safe_filename(upload.filename or "uploaded-file")
        suffix = Path(name).suffix.lower()
        if suffix not in self.SUPPORTED_SUFFIXES:
            supported = ", ".join(sorted(self.SUPPORTED_SUFFIXES))
            raise ValueError(f"Unsupported file type. Use one of: {supported}.")
        data = await upload.read()
        if len(data) > self.max_upload_bytes:
            raise ValueError(f"Upload exceeds {self.max_upload_bytes // (1024 * 1024)} MB limit.")
        base = self.matters.matter_path(matter_id)
        destination = f"{base}/documents/{name}"
        self.vault.write_bytes(destination, data)
        content_hash = hashlib.sha256(data).hexdigest()
        result: dict[str, Any] = {
            "path": destination,
            "name": name,
            "extracted_path": None,
            "source_id": f"SRC-{content_hash[:16].upper()}",
            "version": content_hash,
            "content_hash": content_hash,
            "source_only": suffix in self.IMAGE_SUFFIXES,
        }

        extracted = self._extract_text(name, data)
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
                    "source_id": result["source_id"],
                    "source_version": content_hash,
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

    async def upload_many_to_matter(
        self,
        matter_id: str,
        uploads: list[UploadFile],
        *,
        intent: str = "",
    ) -> dict[str, Any]:
        if not uploads:
            raise ValueError("Select at least one file to upload.")
        attachments = [await self.upload_to_matter(matter_id, upload) for upload in uploads]
        preview = self.batch_preview(attachments, intent=intent)
        path = self._batch_path(matter_id, preview["batch_id"])
        self.vault.write_markdown(path, f"# Uploaded document set\n\n{preview['count']} source files.\n", {
            **preview, "matter_id": matter_id, "record_type": "document_batch", "state": "preview",
            "created_at": iso_now(), "action_id": "",
        })
        return preview

    def get_batch(self, matter_id: str, batch_id: str) -> dict[str, Any]:
        path = self._batch_path(matter_id, batch_id)
        if not self.vault.exists(path):
            raise KeyError(f"Document set not found: {batch_id}")
        metadata = self.vault.read_markdown(path)["metadata"]
        if metadata.get("matter_id") != matter_id:
            raise KeyError(f"Document set not found: {batch_id}")
        return {**metadata, "path": path}

    def update_batch(self, matter_id: str, batch_id: str, *, state: str, action_id: str) -> dict[str, Any]:
        path = self._batch_path(matter_id, batch_id)
        self.get_batch(matter_id, batch_id)
        self.vault.update_markdown(path, metadata_updates={"state": state, "action_id": action_id, "updated_at": iso_now()})
        return self.get_batch(matter_id, batch_id)

    def _batch_path(self, matter_id: str, batch_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/documents/batches/{batch_id}.md"

    def batch_preview(self, attachments: list[dict[str, Any]], *, intent: str = "") -> dict[str, Any]:
        """Return read-only scan data. This method does not promote facts or change matter records."""
        count = len(attachments)
        if count == 1:
            presentation = "single"
        elif count <= 3:
            presentation = "plural"
        else:
            presentation = "batch"
        batch_hash = hashlib.sha256(
            "\n".join(str(item.get("version", "")) for item in attachments).encode("utf-8")
        ).hexdigest()
        scan = [self._quick_scan(item) for item in attachments]
        return {
            "batch_id": f"BATCH-{batch_hash[:16].upper()}",
            "presentation": presentation,
            "count": count,
            "intent": intent.strip(),
            "intent_required": not bool(intent.strip()),
            "attachments": [
                {
                    "source_id": item["source_id"],
                    "path": item["path"],
                    "name": item["name"],
                    "version": item["version"],
                }
                for item in attachments
            ],
            "scan": scan,
            "apply_required": True,
        }

    async def upload_many_to_workspace(self, uploads: list[UploadFile]) -> dict[str, Any]:
        if not uploads:
            raise ValueError("Select at least one file to upload.")
        attachments: list[dict[str, str]] = []
        for upload in uploads:
            name = safe_filename(upload.filename or "uploaded-file")
            suffix = Path(name).suffix.lower()
            if suffix not in self.SUPPORTED_SUFFIXES:
                raise ValueError(f"Unsupported file type: {suffix or 'unknown'}.")
            data = await upload.read()
            if len(data) > self.max_upload_bytes:
                raise ValueError(f"Upload exceeds {self.max_upload_bytes // (1024 * 1024)} MB limit.")
            digest = hashlib.sha256(data).hexdigest()
            path = f"04_Inbox/chat-uploads/{digest[:12]}-{name}"
            self.vault.write_bytes(path, data)
            extracted = self._extract_text(name, data)
            if extracted.strip():
                self.vault.write_markdown(f"{path}.extracted.md", f"# Extracted text: {name}\n\n{extracted}", {
                    "record_type": "extracted_document", "source_path": path,
                    "source_id": f"SRC-{digest[:16].upper()}", "source_version": digest,
                    "created_at": iso_now(),
                })
            attachments.append({"source_id": f"SRC-{digest[:16].upper()}", "path": path, "name": name, "version": digest})
        self.index.rebuild()
        return {"attachments": attachments}

    def _quick_scan(self, attachment: dict[str, Any]) -> dict[str, Any]:
        text = ""
        extracted_path = attachment.get("extracted_path")
        if extracted_path and self.vault.exists(extracted_path):
            text = self.vault.read_markdown(extracted_path)["content"]
        elif Path(str(attachment["name"])).suffix.lower() in {".md", ".txt"}:
            text = self.vault.read_text(attachment["path"])
        words = text.split()
        return {
            "source_id": attachment["source_id"],
            "name": attachment["name"],
            "kind": Path(str(attachment["name"])).suffix.lower().lstrip(".") or "file",
            "source_only": bool(attachment.get("source_only")),
            "word_count": len(words),
            "excerpt": " ".join(words[:60]),
        }

    @staticmethod
    def _extract_text(name: str, data: bytes) -> str:
        suffix = Path(name).suffix.lower()
        if suffix in {".md", ".txt"}:
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
