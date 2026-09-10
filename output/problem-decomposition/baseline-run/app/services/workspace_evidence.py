"""Evidence and submitted context projections over existing matter records."""
from __future__ import annotations

import hashlib
import copy
import re
import yaml
from typing import Any
from urllib.parse import urlsplit

from app.models.workspace import ContextSelection, RunContextManifest, ClaimEvidence
from app.services.dossier import serialized
from app.services.workspace import WorkspaceService, WorkspaceConflict, digest


class WorkspaceEvidenceService:
    def __init__(self, vault, matters, workspace=None):
        self.vault, self.matters = vault, matters
        self.workspace = workspace or WorkspaceService(vault, matters)

    def selection(self, matter_id: str) -> dict[str, Any]:
        doc = self.workspace._document(matter_id, "workspace.md")
        values = doc["metadata"].get("context_selection", [])
        return {"selections": values, "revision": digest(values)}

    @serialized
    def save_selection(self, matter_id: str, selections: list[dict[str, Any]], *, expected_revision: str) -> dict[str, Any]:
        doc = self.workspace._document(matter_id, "workspace.md")
        self.workspace._check(expected_revision, digest(doc["metadata"].get("context_selection", [])))
        parsed = [ContextSelection.model_validate(s).model_dump() for s in selections]
        if len({s["reference_id"] for s in parsed}) != len(parsed):
            raise ValueError("Context references must be unique.")
        for item in parsed:
            canonical_paths = {self.workspace._path(matter_id, "facts.md"), self.workspace._path(matter_id, "dossier.md")}
            if (item["reference_id"] in {"business_question", "current_facts"} or item["role"] in {"business_question", "current_facts"} or item.get("path") in canonical_paths) and not item["selected"]:
                raise ValueError("The current question and facts are mandatory context.")
            if item.get("path"):
                self.vault.resolve(item["path"])
        doc["metadata"]["context_selection"] = parsed
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return self.selection(matter_id)

    def _manifest_path(self, matter_id: str, run_id: str) -> str:
        if not run_id or any(c not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_" for c in run_id):
            raise ValueError("Invalid run ID.")
        return self.workspace._path(matter_id, f"conversations/context/{run_id}.md")

    @serialized
    def save_manifest(self, manifest: dict[str, Any]) -> dict[str, Any]:
        parsed = RunContextManifest.model_validate(manifest).model_dump(mode="json")
        path = self._manifest_path(parsed["matter_id"], parsed["run_id"])
        if self.vault.exists(path):
            previous = self.vault.read_markdown(path)["metadata"]["manifest"]
            if previous != parsed:
                raise WorkspaceConflict("Submitted context is immutable. Use a new run.", digest(previous))
            return previous
        self.vault.write_markdown(path, "# Submitted inquiry context\n", {"record_type": "run_context", "immutable": True, "manifest": parsed})
        return parsed

    def manifest(self, matter_id: str, run_id: str) -> dict[str, Any]:
        return self.vault.read_markdown(self._manifest_path(matter_id, run_id))["metadata"]["manifest"]

    @staticmethod
    def record_tool_read(frozen: dict[str, Any], *, reference_id: str, path: str | None,
                         tool_call_id: str, supplied_text: str, available_chars: int | None = None,
                         url: str | None = None, locator: str = "") -> dict[str, Any]:
        """Append observed tool output before final manifest persistence.

        Call only after the runner actually adds that output to provider messages.
        Never call for planned reads, mere search hits, or failed tool execution.
        """
        if path in frozen.get("excluded_paths", []) or reference_id in frozen.get("excluded_reference_ids", []):
            raise ValueError("Excluded material cannot be supplied through a tool.")
        updated = copy.deepcopy(frozen)
        manifest = updated["manifest"]
        version = digest(supplied_text)
        evidence_id = f"{tool_call_id}:{version}"
        if any(evidence_id in e.get("tool_read_evidence", []) for e in manifest["entries"]):
            return updated
        total = available_chars if available_chars is not None else len(supplied_text)
        manifest["entries"].append({"reference_id": reference_id, "path": path, "role": "tool_read", "selected": False,
            "mandatory": False, "revision": version, "state": "truncated" if total > len(supplied_text) else "included",
            "reason": "Actual tool output supplied to the model.", "tool_read_evidence": [evidence_id],
            "supplied_chars": len(supplied_text), "available_chars": total})
        # Preserve only text that was actually supplied to the model. This is a
        # bounded source passage for claim linking, not a verification event.
        if path or url or reference_id.startswith("SRC-"):
            source = WorkspaceEvidenceService.source_record({
                "source_id": reference_id,
                "path": path,
                "url": url,
                "locator": locator,
                "available_excerpt": supplied_text[:12000],
                "support_state": "supplied" if path else "retrieved",
                "source_version": version,
                "source_hash": version,
                "title": path or url or reference_id,
            }, internal=bool(path))
            stored_sources = updated.setdefault("sources", [])
            existing = next((index for index, item in enumerate(stored_sources)
                             if item.get("source_id") == source["source_id"]
                             and item.get("locator", "") == source["locator"]), None)
            if existing is None:
                stored_sources.append(source)
            else:
                stored_sources[existing] = source
        return updated

    @staticmethod
    def _safe_public_url(value: Any) -> str | None:
        if value is None:
            return None
        candidate = str(value).strip()
        if not candidate:
            return None
        try:
            parsed = urlsplit(candidate)
        except ValueError:
            return None
        return candidate if parsed.scheme in {"http", "https"} and parsed.netloc else None

    @staticmethod
    def source_record(item: dict[str, Any], *, internal: bool = False) -> dict[str, Any]:
        path = item.get("path")
        url = WorkspaceEvidenceService._safe_public_url(item.get("url") or item.get("canonical_url"))
        identity = str(item.get("source_id") or "SRC-" + digest(path or url or item.get("title") or "unknown-source")[:20])
        state = item.get("support_state") or ("supplied" if internal else "unverified_lead")
        if state not in {"supplied", "retrieved", "verified", "unverified_lead", "unknown"}:
            state = "unknown"
        # An excerpt is the bytes supplied by a source adapter, never a generated
        # explanation, search summary, or synthetic quotation.
        excerpt = item.get("available_excerpt", item.get("excerpt"))
        return {"source_id": identity, "source_label": str(item.get("source_label") or item.get("title") or item.get("label") or path or url or "Unknown source"),
                "path": path, "url": url, "available_excerpt": excerpt if isinstance(excerpt, str) else None,
                "locator": str(item.get("locator") or ""), "support_state": state,
                "retrieved_at": item.get("retrieved_at"), "source_version": item.get("source_version", item.get("version")),
                "source_hash": item.get("source_hash", item.get("content_hash")),
                "explanation": str(item.get("explanation") or "")}

    @classmethod
    def claim_evidence(
        cls,
        claim_id: str,
        source_id: str,
        sources: list[dict[str, Any]],
        *,
        locator: str = "",
        explanation: str = "",
        claim_revision: str | None = None,
        output_revision: str | None = None,
    ) -> dict[str, Any]:
        locator = str(locator or "").strip()
        candidates = [s for s in sources if s.get("source_id") == source_id]
        if locator:
            found = next(
                (s for s in candidates if str(s.get("locator") or "").strip() == locator),
                None,
            )
            if found is None:
                derived = []
                for candidate in candidates:
                    if str(candidate.get("locator") or "").strip():
                        continue
                    passage = cls._markdown_heading_passage(candidate.get("available_excerpt"), locator)
                    if passage:
                        derived.append({**candidate, "locator": locator, "available_excerpt": passage})
                found = derived[0] if len(derived) == 1 else None
        else:
            # One source can hold several exact passages. Without a locator,
            # choosing the first would attach the wrong quotation to the claim.
            found = candidates[0] if len(candidates) == 1 else None
        if found is None:
            shared: dict[str, Any] = {}
            for field in ("source_label", "path", "url", "source_version", "source_hash", "retrieved_at"):
                values = {candidate.get(field) for candidate in candidates if candidate.get(field) is not None}
                if len(values) == 1:
                    shared[field] = values.pop()
            record = {
                **shared,
                "source_id": source_id,
                "locator": locator,
                "available_excerpt": None,
                "support_state": "unknown",
                "source_label": (
                    str(shared.get("source_label") or candidates[0].get("source_label") or "Source reference")
                    if candidates
                    else "Missing source reference"
                ),
            }
        else:
            record = dict(found)
        record.update(
            claim_id=claim_id,
            explanation=explanation,
            claim_revision=claim_revision,
            output_revision=output_revision,
        )
        return ClaimEvidence.model_validate(record).model_dump(mode="json")

    @staticmethod
    def _markdown_heading_passage(value: Any, locator: str) -> str | None:
        """Return literal supplied text under one exact Markdown heading."""
        if not isinstance(value, str) or not value or not locator.strip():
            return None
        wanted = " ".join(locator.casefold().split())
        lines = value.splitlines()
        matches: list[tuple[int, int]] = []
        for index, line in enumerate(lines):
            heading = re.match(r"^\s*(#{1,6})\s+(.+?)\s*#*\s*$", line)
            if heading and " ".join(heading.group(2).casefold().split()) == wanted:
                matches.append((index, len(heading.group(1))))
        if len(matches) != 1:
            return None
        start, level = matches[0]
        end = len(lines)
        for index in range(start + 1, len(lines)):
            heading = re.match(r"^\s*(#{1,6})\s+", lines[index])
            if heading and len(heading.group(1)) <= level:
                end = index
                break
        passage = "\n".join(lines[start:end]).strip()
        return passage or None

    def library(self, matter_id: str, *, query: str = "") -> list[dict[str, Any]]:
        base = self.matters.matter_path(matter_id)
        root = self.vault.resolve(base)
        # Keep the internal review archive out of default source discovery.
        # Explicit saved selections and direct history reads remain available.
        files = [path for path in self.vault.iter_files(base) if ".history" not in path.relative_to(root).parts]
        companions: dict[str, dict[str, Any]] = {}
        for path in files:
            if not path.name.endswith(".extracted.md"):
                continue
            try:
                doc = self.vault.read_markdown(self.vault.relative(path))
                companions[str(doc["metadata"].get("source_path"))] = doc
            except (OSError, ValueError, TypeError, yaml.YAMLError):
                continue
        result = []
        selected = self.selection(matter_id)["selections"]
        for path in files:
            relative = self.vault.relative(path)
            if query.casefold() not in relative.casefold() or path.name.endswith(".extracted.md"):
                continue
            try:
                doc = self.vault.read_document(relative)
            except (OSError, ValueError, TypeError, yaml.YAMLError):
                result.append({"reference_id": "FILE-" + digest(relative)[:20], "path": relative, "name": path.name,
                               "kind": "file", "selected": any(s.get("path") == relative and s.get("selected", True) for s in selected),
                               "available": True, "extraction_state": "failed", "failure_detail": "File exists; preview unavailable."})
                continue
            meta = doc.get("metadata") or {}
            companion = companions.get(relative)
            is_output = bool(meta.get("work_product_id") or meta.get("research_id") or meta.get("record_type") == "work_product")
            if not companion and not is_output and not ("/source" in relative or path.suffix.lower() != ".md" or meta.get("source_id")):
                continue
            source_meta = companion["metadata"] if companion else meta
            result.append({"path": relative, "name": source_meta.get("source_filename") or path.name,
                           "kind": "work_product" if is_output else "source", "source_id": source_meta.get("source_id") or "SRC-" + hashlib.sha256(path.read_bytes()).hexdigest()[:16].upper(),
                           "version": source_meta.get("source_version") or hashlib.sha256(path.read_bytes()).hexdigest(),
                           "extracted_path": companion["path"] if companion else None,
                           "extraction_state": source_meta.get("extraction_state") or ("available" if companion and "No extractable text was found." not in companion["content"] else "unavailable"),
                           "support_state": "supplied" if not is_output else "generated",
                           "uploaded_at": source_meta.get("created_at"), "available": True})
        for item in result:
            item.setdefault("reference_id", item.get("source_id") or "FILE-" + digest(item["path"])[:20])
            item.setdefault("selected", any((s.get("reference_id") == item["reference_id"] or s.get("path") == item["path"])
                                            and s.get("selected", True) for s in selected))
            item.setdefault("original_path", item["path"] if item["kind"] == "source" else None)
            item.setdefault("saved_at", item.get("uploaded_at"))
            item.setdefault("revision", item.get("version"))
            state = item["extraction_state"]
            item["extraction_state"] = "not_applicable" if item["kind"] == "work_product" else {"available": "complete", "unavailable": "failed"}.get(state, state)
        return result
