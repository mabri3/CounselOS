"""Markdown source library: durable originals, immutable extracted units, disposable index.

Originals stay where they were saved. Extracted text is canonical Markdown under
`<matter>/research/source-library/<source_id>/<source_version>/`. SQLite only
projects what is already on disk, so losing it loses nothing.
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any

from app.models.source_library import (
    EXTRACTION_FORMAT_VERSION, ExtractionJob, MAX_SOURCE_CHARS, READ_MAX_CHARS,
    SourceManifest, SourceUnitEntry, UnitReceipt,
)
from app.services.source_extraction import page_file, run_page_extraction, split_sections
from app.utils.time import iso_now

PAGE_SUFFIXES = {".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff"}
SNIPPET_CHARS = 400
# Receipts are checkpointed in batches. Every unit body is already durable in the
# job staging area before its receipt is written, so a crash re-persists at most
# this many units idempotently instead of paying an O(n^2) checkpoint rewrite.
CHECKPOINT_EVERY = 50
SEARCH_RESPONSE_CHARS = 6000


def _sha256(value: str | bytes) -> str:
    return hashlib.sha256(value.encode("utf-8") if isinstance(value, str) else value).hexdigest()


class SourceLibraryService:
    """Register, extract, publish, search and read matter sources."""

    def __init__(self, vault, index, matters):
        self.vault = vault
        self.index = index
        self.matters = matters

    # --- locations -----------------------------------------------------------

    def root(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/research/source-library"

    @staticmethod
    def _identifier(value: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,160}", value):
            raise ValueError("Invalid source identifier.")
        return value

    def _owned_path(self, matter_id: str, path: str, *, root: str | None = None) -> str:
        canonical = self.vault.relative(self.vault.resolve(path))
        owner = root or self.matters.matter_path(matter_id)
        if not canonical.startswith(owner.rstrip("/") + "/"):
            raise ValueError("Source path belongs outside the selected matter or version.")
        return canonical

    def _validate_manifest(self, matter_id, source_id, version, manifest):
        if (manifest.matter_id, manifest.source_id, manifest.source_version) != (matter_id, source_id, version):
            raise ValueError("Source version identity does not match its location.")
        self._owned_path(matter_id, manifest.original_path)
        root = self._version_dir(matter_id, source_id, version)
        for unit in manifest.units:
            self._owned_path(matter_id, unit.path, root=root)
            if unit.image_path:
                self._owned_path(matter_id, unit.image_path, root=root)

    def _job_path(self, matter_id: str, job_id: str) -> str:
        self._identifier(job_id)
        return f"{self.root(matter_id)}/jobs/{job_id}.md"

    def _staging(self, matter_id: str, job_id: str):
        return self.vault.resolve(f"{self.root(matter_id)}/jobs/{job_id}")

    def _version_dir(self, matter_id: str, source_id: str, source_version: str) -> str:
        self._identifier(source_id)
        self._identifier(source_version)
        return f"{self.root(matter_id)}/{source_id}/{source_version}"

    def manifest_path(self, matter_id: str, source_id: str, source_version: str) -> str:
        return f"{self._version_dir(matter_id, source_id, source_version)}/manifest.md"

    # --- registration --------------------------------------------------------

    def register_saved_source(
        self, matter_id: str, original_path: str, *, source_id: str, title: str,
        source_kind: str, provenance: dict[str, Any] | None = None, text: str | None = None,
    ) -> dict[str, Any]:
        """Record an already-saved original as a library source and return a job reference."""
        if not self.vault.exists(original_path):
            raise ValueError("Source original is not saved in this vault.")
        self._identifier(source_id)
        original = self._owned_path(matter_id, original_path)
        data = self.vault.resolve(original).read_bytes()
        original_sha256 = _sha256(data)
        supplied_hash = _sha256(text)[:12] if text is not None else "bytes"
        job_id = f"JOB-{_sha256(source_id)[:16]}-{original_sha256[:12]}-{supplied_hash}-v{EXTRACTION_FORMAT_VERSION}"
        path = self._job_path(matter_id, job_id)
        if self.vault.exists(path):
            job = self._load_job(matter_id, job_id)
            if job.original_sha256 == original_sha256:
                return self._job_descriptor(job)
        provenance = provenance or {}
        page_bytes = data.startswith((b"%PDF-", b"\x89PNG", b"\xff\xd8", b"II*\x00", b"MM\x00*"))
        unit_kind = "pages" if text is None and (page_bytes or any(original.lower().endswith(s) for s in PAGE_SUFFIXES)) else "sections"
        job = ExtractionJob(
            job_id=job_id, matter_id=matter_id, source_id=source_id, title=title[:500] or original.split("/")[-1],
            source_kind=source_kind, original_path=original, original_sha256=original_sha256,
            unit_kind=unit_kind, state="registered", content_type=str(provenance.get("content_type") or ""),
            supplied_text_path=f"{self.root(matter_id)}/jobs/{job_id}/supplied.md" if text is not None else None,
            requested_url=provenance.get("requested_url"), final_url=provenance.get("final_url"),
            retrieved_at=provenance.get("retrieved_at"))
        if text is not None:
            self.vault.write_markdown(job.supplied_text_path, text, {
                "record_type": "supplied_source_text", "matter_id": matter_id, "source_id": source_id,
                "immutable": True, "editable": False, "original_path": original})
        self._save_job(job)
        return self._job_descriptor(job)

    def _save_job(self, job: ExtractionJob) -> ExtractionJob:
        """Replace a job checkpoint only after the whole record validates."""
        path = self._job_path(job.matter_id, job.job_id)
        previous = self.vault.read_markdown(path)["metadata"] if self.vault.exists(path) else None
        record = ExtractionJob.model_validate(job.model_dump())
        if previous and record.sequence < int(previous.get("sequence", 0)):
            raise ValueError("Stale extraction job write; the last valid checkpoint is preserved.")
        body = f"# Extraction job {record.job_id}\n\nOriginal: `{record.original_path}`\n\nState: {record.state}\n"
        self.vault.write_markdown(path, body, record.model_dump())
        return record

    def _load_job(self, matter_id: str, job_id: str) -> ExtractionJob:
        record = self.vault.read_markdown(self._job_path(matter_id, job_id))["metadata"]
        job = ExtractionJob.model_validate(record)
        self._owned_path(matter_id, job.original_path)
        if job.supplied_text_path:
            self._owned_path(matter_id, job.supplied_text_path, root=f"{self.root(matter_id)}/jobs/{job_id}")
        if job.matter_id != matter_id or job.job_id != job_id:
            raise ValueError("Extraction job belongs to another matter.")
        return job

    def _job_descriptor(self, job: ExtractionJob) -> dict[str, Any]:
        return {"source_id": job.source_id, "job_id": job.job_id, "title": job.title,
                "extraction_state": "complete" if job.state == "complete" else "partial" if job.state in {"partial", "extracting"} else "unavailable" if job.state == "unavailable" else "registered",
                "source_version": job.published_version, "next_page": job.next_page,
                "unread_page_count": job.unread_pages, "original_path": job.original_path,
                "original_sha256": job.original_sha256, "warnings": job.warnings[-5:]}

    # --- extraction ----------------------------------------------------------

    async def extract_or_resume(self, matter_id: str, job_id: str, *, page_number: int | None = None) -> dict[str, Any]:
        """Extract available units within one bounded invocation, then publish."""
        job = self._load_job(matter_id, job_id)
        if job.state == "complete" and page_number is None and job.published_version:
            path = self.manifest_path(matter_id, job.source_id, job.published_version)
            if self.vault.exists(path):
                self.describe(matter_id, job.source_id, job.published_version)
                self.write_catalog(matter_id)
                self._ensure_fresh(matter_id)
                return self._job_descriptor(job)
        if _sha256(self.vault.resolve(job.original_path).read_bytes()) != job.original_sha256:
            job.state, job.last_error = "unavailable", "Original file changed after registration."
            return self._job_descriptor(self._save_job(_bump(job)))
        if job.unit_kind == "sections":
            return self._extract_sections(job)
        staging = self._staging(matter_id, job_id)
        summary = await run_page_extraction(
            self.vault.resolve(job.original_path), staging,
            start_page=page_number or job.next_page or 1, target_page=page_number)
        return self._absorb_pages(job, staging, summary)

    async def resume_version(self, matter_id, source_id, source_version, *, page_number=None):
        manifest = self.describe(matter_id, source_id, source_version)
        jobs = []
        for path in self.vault.resolve(f"{self.root(matter_id)}/jobs").glob("*.md"):
            job = self._load_job(matter_id, path.stem)
            if job.source_id == source_id and job.original_sha256 == manifest["original_sha256"] and job.unit_kind == "pages":
                jobs.append(job)
        if not jobs:
            raise ValueError("No local page-extraction job is available for this source version.")
        jobs.sort(key=lambda job: (job.published_version == source_version, job.extraction_format_version, job.sequence))
        result = await self.extract_or_resume(matter_id, jobs[-1].job_id, page_number=page_number)
        result["warnings"] = [*result.get("warnings", []), *self._ensure_fresh(matter_id)]
        return result

    TEXT_SUFFIXES = (".md", ".txt", ".csv", ".json", ".yaml", ".yml", ".htm", ".html")

    def _extract_sections(self, job: ExtractionJob) -> dict[str, Any]:
        if job.supplied_text_path and self.vault.exists(job.supplied_text_path):
            text = self.vault.read_markdown(job.supplied_text_path)["content"]
        elif job.original_path.lower().endswith(self.TEXT_SUFFIXES):
            text = self.vault.resolve(job.original_path).read_text(encoding="utf-8", errors="replace")
        else:
            job.state = "unavailable"
            job.warnings.append("No extractable text was supplied for this source; the original file is retained.")
            return self._publish(job, [])
        truncated = len(text) > MAX_SOURCE_CHARS
        text = text[:MAX_SOURCE_CHARS]
        remaining = MAX_SOURCE_CHARS
        version_units: list[dict[str, Any]] = []
        for number, section in enumerate(split_sections(text), start=1):
            # Vault Markdown normalizes each body to strip() + a trailing newline.
            body = section["text"].strip()
            if len(body) + 1 > remaining:
                body = body[:max(0, remaining - 1)].rstrip()
                truncated = True
            if remaining <= 1:
                truncated = True
                break
            remaining -= len(body) + 1
            section = {**section, "text": body}
            version_units.append({"unit_id": f"s{number:06d}", "text": section["text"],
                                  "section_label": f"Section {number}", "page_number": None,
                                  "extraction_method": "text", "warning": "", "image": None,
                                  "continues_previous": section["continues_previous"],
                                  "continues_next": section["continues_next"]})
        job.page_count = None
        job.next_page = None
        job.unread_pages = 0
        if truncated:
            job.warnings.append(f"Source exceeds the {MAX_SOURCE_CHARS}-character storage ceiling; retained text is partial.")
        job.state = "partial" if truncated else "complete" if any(u["text"].strip() for u in version_units) else "unavailable"
        return self._publish(job, version_units)

    def _absorb_pages(self, job: ExtractionJob, staging, summary: dict[str, Any]) -> dict[str, Any]:
        import json
        progress_path = staging / "progress.json"
        progress = json.loads(progress_path.read_text()) if progress_path.exists() else {"pages": []}
        units: list[dict[str, Any]] = []
        for entry in sorted(progress.get("pages", []), key=lambda item: item["page"]):
            body = page_file(staging, entry["page"])
            units.append({"unit_id": f"p{entry['page']:06d}",
                          "text": body.read_text(encoding="utf-8", errors="replace") if body.exists() else "",
                          "page_number": entry["page"], "section_label": None,
                          "extraction_method": entry.get("method") or "unread",
                          "warning": entry.get("warning") or "", "image": entry.get("image"),
                          "continues_previous": False, "continues_next": False})
        job.page_count = summary.get("page_count") or progress.get("page_count")
        job.next_page = summary.get("next_page") if "next_page" in summary else progress.get("next_page")
        job.unread_pages = int(summary.get("unread_pages") or progress.get("unread_pages") or 0)
        for warning in (summary.get("warnings") or [])[-20:]:
            if warning not in job.warnings:
                job.warnings.append(warning)
        if not units:
            job.state = "unavailable"
        else:
            job.state = "complete" if not job.unread_pages and summary.get("state") != "partial" else "partial"
        return self._publish(job, units)

    # --- publication ---------------------------------------------------------

    def _publish(self, job: ExtractionJob, units: list[dict[str, Any]]) -> dict[str, Any]:
        """Stage every unit durably, then publish an immutable version for them.

        Units are written and hashed in the job's staging area first, so the
        version digest is computed from the persisted bodies, and publication
        only moves already-durable files into the immutable version directory.
        """
        state = "complete" if job.state == "complete" else "unavailable" if job.state == "unavailable" else "partial"
        job.state = "extracting"
        folder = "pages" if job.unit_kind == "pages" else "sections"
        staging = f"{self.root(job.matter_id)}/jobs/{job.job_id}/units"
        receipts: list[UnitReceipt] = []
        for unit in units:
            staged = f"{staging}/{unit['unit_id']}.md"
            image_bytes = self.vault.resolve(self._owned_path(job.matter_id, self.vault.relative(Path(unit["image"])), root=f"{self.root(job.matter_id)}/jobs/{job.job_id}")).read_bytes() if unit.get("image") else None
            if image_bytes is not None:
                self.vault.write_bytes(f"{staging}/{unit['unit_id']}.png", image_bytes)
            self.vault.write_markdown(staged, unit["text"], {
                "record_type": "source_unit", "schema_version": 1, "immutable": True, "editable": False,
                "matter_id": job.matter_id, "source_id": job.source_id, "unit_id": unit["unit_id"],
                "page_number": unit.get("page_number"), "section_label": unit.get("section_label"),
                "extraction_method": unit["extraction_method"], "warning": unit["warning"],
                "continues_previous": unit["continues_previous"], "continues_next": unit["continues_next"]})
            saved = self.vault.read_markdown(staged)["content"]
            receipt = UnitReceipt(unit_id=unit["unit_id"], path=staged, body_sha256=_sha256(saved),
                                  char_count=len(saved), page_number=unit.get("page_number"),
                                  section_label=unit.get("section_label"),
                                  extraction_method=unit["extraction_method"], warning=unit["warning"],
                                  image_path=f"{staging}/{unit['unit_id']}.png" if image_bytes is not None else None)
            receipts.append(receipt)
            job.completed_units = [r for r in job.completed_units if r.unit_id != receipt.unit_id] + [receipt]
            if len(receipts) % CHECKPOINT_EVERY == 0:
                self._save_job(_bump(job))
        self._save_job(_bump(job))
        version = _version_digest(job.original_sha256, job.extraction_format_version, state,
                                  [{"unit_id": r.unit_id, "body_sha256": r.body_sha256} for r in receipts])
        version_dir = self._version_dir(job.matter_id, job.source_id, version)
        entries: list[SourceUnitEntry] = []
        for receipt, unit in zip(receipts, units, strict=True):
            final = f"{version_dir}/{folder}/{receipt.unit_id}.md"
            image_path = None
            if receipt.image_path:
                image_path = f"{version_dir}/{folder}/{receipt.unit_id}.png"
                if not self.vault.exists(image_path) and self.vault.exists(receipt.image_path):
                    self.vault.move(receipt.image_path, image_path)
            if self.vault.exists(final) and _sha256(self.vault.read_markdown(final)["content"]) != receipt.body_sha256:
                raise ValueError("Published source unit changed; refusing to replace immutable evidence.")
            if not self.vault.exists(final):
                self.vault.update_markdown(receipt.path, metadata_updates={"source_version": version, "image_path": image_path})
                self.vault.move(receipt.path, final)
            body = self.vault.read_markdown(final)["content"]
            entries.append(SourceUnitEntry(unit_id=receipt.unit_id, path=final, body_sha256=_sha256(body),
                                           char_count=len(body), page_number=receipt.page_number,
                                           section_label=receipt.section_label,
                                           extraction_method=receipt.extraction_method, warning=receipt.warning,
                                           image_path=image_path,
                                           continues_previous=unit["continues_previous"],
                                           continues_next=unit["continues_next"]))
        job.completed_units = [UnitReceipt(**{k: v for k, v in entry.model_dump().items()
                                              if k not in {"continues_previous", "continues_next"}})
                               for entry in entries]
        manifest = SourceManifest(
            matter_id=job.matter_id, source_id=job.source_id, source_version=version, title=job.title,
            source_kind=job.source_kind, original_path=job.original_path, original_sha256=job.original_sha256,
            requested_url=job.requested_url, final_url=job.final_url, retrieved_at=job.retrieved_at,
            extraction_format_version=job.extraction_format_version, extraction_state=state,
            page_count=job.page_count, extracted_unit_count=len(entries),
            total_chars=sum(entry.char_count for entry in entries), unread_page_count=job.unread_pages,
            next_page=job.next_page, units=entries, warnings=job.warnings[-50:],
            predecessor_version=job.published_version if job.published_version != version else None,
            created_at=iso_now())
        path = self.manifest_path(job.matter_id, job.source_id, version)
        if not self.vault.exists(path):
            self.vault.write_markdown(path, _manifest_body(manifest), manifest.model_dump())
        job.published_version = version
        job.state = state
        self._save_job(_bump(job))
        self.write_catalog(job.matter_id)
        return self._job_descriptor(job)

    # --- reading -------------------------------------------------------------

    def describe(self, matter_id: str, source_id: str, source_version: str) -> dict[str, Any]:
        path = self.manifest_path(matter_id, source_id, source_version)
        if not self.vault.exists(path):
            raise ValueError("No published source version for that identifier.")
        manifest = SourceManifest.model_validate(self.vault.read_markdown(path)["metadata"])
        self._validate_manifest(matter_id, source_id, source_version, manifest)
        return {**manifest.model_dump(), "manifest_path": path,
                "units": [unit.model_dump() for unit in manifest.units]}

    def read(self, matter_id: str, source_id: str, source_version: str, unit_id: str, *,
             start: int = 0, max_chars: int = READ_MAX_CHARS) -> dict[str, Any]:
        """Return one literal bounded passage, verified against its saved hash."""
        manifest = self.describe(matter_id, source_id, source_version)
        units = manifest["units"]
        entry = next((unit for unit in units if unit["unit_id"] == unit_id), None)
        if entry is None:
            return {"status": "not_found", "source_id": source_id, "source_version": source_version,
                    "unit_id": unit_id, "warnings": ["Unknown unit_id for this source version."],
                    "available_units": [unit["unit_id"] for unit in units[:20]],
                    "extraction_complete": manifest["extraction_state"] == "complete"}
        if not self.vault.exists(entry["path"]):
            return {"status": "unavailable", "source_id": source_id, "source_version": source_version,
                    "unit_id": unit_id, "warnings": ["Saved unit file is missing."],
                    "original_file_path": manifest["original_path"]}
        text = self.vault.read_markdown(entry["path"])["content"]
        if _sha256(text) != entry["body_sha256"]:
            return {"status": "stale_source", "source_id": source_id, "source_version": source_version,
                    "unit_id": unit_id, "body_hash": entry["body_sha256"],
                    "warnings": ["Saved source text no longer matches its published hash; it is not current evidence."],
                    "original_file_path": manifest["original_path"]}
        if entry["extraction_method"] == "unread" and not text.strip():
            return {"status": "unavailable", "source_id": source_id, "source_version": source_version,
                    "unit_id": unit_id, "page_number": entry["page_number"],
                    "page_image_path": entry["image_path"], "original_file_path": manifest["original_path"],
                    "warnings": [entry["warning"] or "This unit has no recognized text."],
                    "extraction_complete": manifest["extraction_state"] == "complete"}
        start = max(0, int(start))
        if start >= len(text) and text:
            raise ValueError("Passage start is outside the saved unit text.")
        cap = max(1, min(int(max_chars), READ_MAX_CHARS))
        end = min(len(text), start + cap)
        boundary = text.rfind("\n\n", start, end)
        if end < len(text) and boundary > start:
            end = boundary
        position = next(index for index, unit in enumerate(units) if unit["unit_id"] == unit_id)
        following = units[position + 1] if position + 1 < len(units) else None
        has_more = end < len(text)
        next_read = None
        if has_more:
            next_read = {"source_id": source_id, "source_version": source_version, "unit_id": unit_id, "start": end}
        elif entry["continues_next"] or (following and entry["page_number"] and following.get("page_number")):
            next_read = {"source_id": source_id, "source_version": source_version,
                         "unit_id": following["unit_id"], "start": 0} if following else None
        return {"status": "read" if manifest["extraction_state"] != "partial" else "partial",
                "source_id": source_id, "source_version": source_version, "unit_id": unit_id,
                "body_hash": entry["body_sha256"], "start": start, "end": end,
                "page_number": entry["page_number"], "section_label": entry["section_label"],
                "extraction_method": entry["extraction_method"], "text": text[start:end],
                "has_more_in_unit": has_more,
                "paragraph_continues": has_more or entry["continues_next"],
                "next_read": next_read,
                "extraction_complete": manifest["extraction_state"] == "complete",
                "unread_page_count": manifest["unread_page_count"],
                "original_file_path": manifest["original_path"],
                "page_image_path": entry["image_path"],
                "title": manifest["title"],
                "warnings": [entry["warning"]] if entry["warning"] else []}

    # --- catalog and search --------------------------------------------------

    def versions(self, matter_id: str) -> list[dict[str, Any]]:
        root = self.root(matter_id)
        found: list[dict[str, Any]] = []
        for path in self.vault.iter_files(root, {".md"}):
            relative = self.vault.relative(path)
            if not relative.endswith("/manifest.md") or f"{root}/jobs/" in relative:
                continue
            try:
                manifest = SourceManifest.model_validate(self.vault.read_markdown(relative)["metadata"])
                self._validate_manifest(matter_id, manifest.source_id, manifest.source_version, manifest)
            except Exception:
                continue
            if manifest.matter_id != matter_id or relative != self.manifest_path(matter_id, manifest.source_id, manifest.source_version):
                continue
            found.append({**manifest.model_dump(), "manifest_path": relative,
                          "manifest_hash": _sha256(self.vault.read_text(relative))})
        found.sort(key=lambda item: (item["source_id"], item["source_version"]))
        return found

    def current_version(self, matter_id: str, source_id: str) -> str | None:
        candidates = [item for item in self.versions(matter_id) if item["source_id"] == source_id]
        if not candidates:
            return None
        candidates.sort(key=lambda item: (item["created_at"] or "", item["extraction_state"] == "complete", item["extracted_unit_count"], item["source_version"]))
        return candidates[-1]["source_version"]

    def generation(self, matter_id: str, items: list[dict[str, Any]] | None = None) -> str:
        items = self.versions(matter_id) if items is None else items
        return _sha256("|".join(f"{item['source_id']}:{item['source_version']}:{item['manifest_hash']}"
                                for item in items))

    def catalog_path(self, matter_id: str) -> str:
        return f"{self.root(matter_id)}/index.md"

    def write_catalog(self, matter_id: str) -> str:
        """Deterministic catalog of current sources: links and states, no generated prose."""
        items = self.versions(matter_id)
        lines = ["# Source library", "", "Saved sources for this matter. Extraction states are recorded, not inferred.", ""]
        for item in items:
            lines.append(f"- **{item['title']}** — `{item['source_id']}` version `{item['source_version']}` — "
                         f"{item['extraction_state']}, {item['extracted_unit_count']} units, {item['total_chars']} characters"
                         + (f", {item['unread_page_count']} pages unread" if item["unread_page_count"] else "")
                         + f" — [manifest]({item['manifest_path']}) · original `{item['original_path']}`")
        if not items:
            lines.append("- No sources registered yet.")
        return self.vault.write_markdown(self.catalog_path(matter_id), "\n".join(lines), {
            "record_type": "source_catalog", "schema_version": 1, "matter_id": matter_id,
            "catalog_generation": self.generation(matter_id, items), "source_count": len(items),
            "updated_at": iso_now()})

    def catalog(self, matter_id: str, *, cursor: str | None = None, limit: int = 20) -> dict[str, Any]:
        records = self.versions(matter_id)
        items = [{key: item[key] for key in ("source_id", "source_version", "title", "source_kind",
                                             "extraction_state", "extracted_unit_count", "total_chars",
                                             "unread_page_count", "page_count", "original_path", "manifest_path")}
                 for item in records]
        start = 0
        if cursor:
            start = next((index + 1 for index, item in enumerate(items)
                          if f"{item['source_id']}:{item['source_version']}" == cursor), 0)
        window = items[start:start + max(1, min(int(limit), 100))]
        following = start + len(window)
        return {"sources": window, "total": len(items),
                "next_cursor": f"{window[-1]['source_id']}:{window[-1]['source_version']}" if window and following < len(items) else None,
                "catalog_path": self.catalog_path(matter_id), "generation": self.generation(matter_id, records)}

    def _ensure_fresh(self, matter_id: str) -> list[str]:
        """One local refresh when the indexed catalog generation is behind Markdown."""
        try:
            rows = self.index._query(
                "SELECT indexed_generation FROM source_catalogs WHERE matter_id = :matter_id",
                {"matter_id": matter_id})
        except Exception:
            return ["The file index is unavailable; source search is a bounded direct scan of registered files."]
        indexed = rows[0]["indexed_generation"] if rows else ""
        if indexed == self.generation(matter_id):
            return []
        try:
            self.index.rebuild()
            return []
        except Exception:
            return ["The file index could not refresh; source search is a bounded direct scan of registered files."]

    def search(self, matter_id: str, query: str, *, source_id: str | None = None,
               source_version: str | None = None, limit: int = 5,
               allowed_versions: set[tuple[str, str]] | None = None) -> dict[str, Any]:
        """Bounded lexical hits over registered units only, verified before returning."""
        terms = [term.lower() for term in query.split() if len(term) > 1]
        if not terms:
            return {"status": "not_found", "hits": [], "results_omitted": False,
                    "query_semantics": _QUERY_SEMANTICS, "warnings": ["Use at least one term of two or more characters."]}
        warnings: list[str] = []
        warnings.extend(self._ensure_fresh(matter_id))
        registered: dict[str, dict[str, Any]] = {}
        manifests = self.versions(matter_id)
        if allowed_versions is None:
            latest = {}
            for item in sorted(manifests, key=lambda item: (item.get("created_at") or "", item["extraction_state"] == "complete", item["extracted_unit_count"], item["source_version"])):
                latest[item["source_id"]] = item["source_version"]
            allowed_versions = {(sid, source_version or version) for sid, version in latest.items()}
        for manifest in manifests:
            if (manifest["source_id"], manifest["source_version"]) not in allowed_versions:
                continue
            if source_id and manifest["source_id"] != source_id:
                continue
            if source_version and manifest["source_version"] != source_version:
                continue
            for unit in manifest["units"]:
                registered[unit["path"]] = {"manifest": manifest, "unit": unit}
        paths: list[str] = []
        try:
            hits = self.index.lexical_search(query, relative_path=self.root(matter_id), limit=max(limit * 8, 40))
            paths = [hit["path"] for hit in hits if hit["path"] in registered]
        except Exception:
            warnings.append("The file index is unavailable; this is a bounded direct scan of registered source files.")
        if not paths:
            if not warnings:
                warnings.append("No indexed hit; falling back to a bounded direct scan of registered source files.")
            paths = sorted(registered)
        results: list[dict[str, Any]] = []
        for path in paths:
            record = registered[path]
            if not self.vault.exists(path):
                continue
            text = self.vault.read_markdown(path)["content"]
            if _sha256(text) != record["unit"]["body_sha256"]:
                warnings.append(f"{path}: saved text no longer matches its published hash; excluded from results.")
                continue
            lowered = text.lower()
            score = sum(lowered.count(term) for term in terms)
            if not score:
                continue
            first = min((lowered.find(term) for term in terms if term in lowered), default=0)
            offset = max(0, first - 80)
            results.append({
                "source_id": record["manifest"]["source_id"], "source_version": record["manifest"]["source_version"],
                "unit_id": record["unit"]["unit_id"], "title": record["manifest"]["title"],
                "page_number": record["unit"]["page_number"], "section_label": record["unit"]["section_label"],
                "body_offset": offset, "score": score,
                "snippet": " ".join(text[offset:offset + SNIPPET_CHARS].split())[:SNIPPET_CHARS],
                "extraction_state": record["manifest"]["extraction_state"],
                "next_read": {"source_id": record["manifest"]["source_id"],
                              "source_version": record["manifest"]["source_version"],
                              "unit_id": record["unit"]["unit_id"], "start": offset},
            })
        results.sort(key=lambda item: (-item["score"], item["source_id"], item["source_version"], item["unit_id"]))
        selected = results[:max(1, min(int(limit), 10))]
        budget = SEARCH_RESPONSE_CHARS - 600
        bounded: list[dict[str, Any]] = []
        for hit in selected:
            budget -= len(json.dumps(hit, ensure_ascii=True))
            if budget < 0:
                break
            bounded.append(hit)
        return {"status": "hits" if bounded else "not_found", "hits": bounded,
                "results_omitted": len(bounded) < len(results),
                "total_matched": len(results), "query_semantics": _QUERY_SEMANTICS,
                "warnings": sorted(set(warnings))[:5],
                "suggestion": None if bounded else
                "No registered source unit contains those terms. Try distinctive wording from the source itself, or read the source catalog. This does not mean the rule does not exist."}


_QUERY_SEMANTICS = ("Whitespace-separated terms, case-insensitive substring matching, ANY term can match. "
                    "Not phrase, Boolean or semantic search.")


def _bump(job: ExtractionJob) -> ExtractionJob:
    job.sequence += 1
    return job


def _version_digest(original_sha256: str, format_version: int, state: str, units) -> str:
    parts = [original_sha256, str(format_version), state]
    for unit in units:
        if isinstance(unit, dict) and "body_sha256" in unit:
            parts.append(f"{unit['unit_id']}:{unit['body_sha256']}")
        else:
            parts.append(f"{unit['unit_id']}:{_sha256(unit['text'].strip())}")
    return _sha256("|".join(parts))[:32]


def _manifest_body(manifest: SourceManifest) -> str:
    lines = [f"# {manifest.title}", "",
             f"Source `{manifest.source_id}` version `{manifest.source_version}` "
             f"({manifest.source_kind}, extraction {manifest.extraction_state}).", "",
             f"- Original: `{manifest.original_path}` (sha256 `{manifest.original_sha256}`)",
             f"- Extracted units: {manifest.extracted_unit_count}; characters: {manifest.total_chars}"]
    if manifest.page_count is not None:
        lines.append(f"- Pages in original: {manifest.page_count}; unread: {manifest.unread_page_count}")
    if manifest.requested_url:
        lines.append(f"- Requested URL: {manifest.requested_url}")
    if manifest.final_url:
        lines.append(f"- Final URL: {manifest.final_url}")
    if manifest.predecessor_version:
        lines.append(f"- Supersedes version `{manifest.predecessor_version}` (earlier citations still resolve).")
    if manifest.warnings:
        lines += ["", "## Extraction warnings", *[f"- {warning}" for warning in manifest.warnings[:20]]]
    lines += ["", "The full unit list is in this record's metadata and on disk; it is never loaded into a model request automatically."]
    return "\n".join(lines)
