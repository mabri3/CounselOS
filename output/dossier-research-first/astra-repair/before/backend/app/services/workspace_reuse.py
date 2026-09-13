"""Explicit reuse helpers for one matter workspace.

The service only projects prior records. It does not promote a search result,
practice note, or watch result into authority or a decision.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from app.models.awareness import WatchDraftCreate
from app.services.dossier import serialized
from app.services.matter_records import MatterRecordService
from app.services.search import SearchService
from app.services.vault import VaultService
from app.services.watches import WatchStore
from app.skills.registry import SkillRegistry
from app.utils.ids import slugify
from app.utils.time import iso_now


class WorkspaceReuseService:
    def __init__(self, vault: VaultService, *, search: SearchService | None = None,
                 records: MatterRecordService | None = None, skills: SkillRegistry | None = None,
                 watches: WatchStore | None = None, workspace: Any | None = None):
        self.vault = vault
        self.search = search
        self.records = records
        self.skills = skills or SkillRegistry(vault)
        self.watches = watches or WatchStore(vault)
        self.workspace = workspace

    def prior_work(self, matter_id: str, query: str, *, selected_paths: list[str] | None = None,
                   limit: int = 8) -> list[dict[str, Any]]:
        """Return lexical candidates with visible source facts and differences.

        Selected paths are reflected only in this response. A caller must pass
        them again when it creates the next inquiry context.
        """
        if self.search is None:
            raise RuntimeError("Prior-work search requires the configured SearchService.")
        selected = set(selected_paths or [])
        current_facts = self._current_facts(matter_id)
        results: list[dict[str, Any]] = []
        for item in self.search.search_internal(query, limit=limit * 3):
            path = str(item.get("path") or "")
            if not self._is_prior_work_path(path, matter_id):
                continue
            try:
                document = self.vault.read_markdown(path)
                metadata = document["metadata"]
                if str(metadata.get("matter_id") or "") == matter_id:
                    continue
                candidate_text = f"{document['content']}\n{metadata}".casefold()
                differences = self._differences(current_facts, candidate_text)
                revision = self._source_revision(document)
                results.append({
                    "matter_id": self._source_matter_id(path, metadata),
                    "path": path, "title": str(metadata.get("title") or item.get("title") or Path(path).stem),
                    "kind": "decision" if "/decisions/" in path else "matter_work",
                    "relevance": f"Lexical search matched {query.strip()!r} (score {item.get('score', 0)}).",
                    "differences": differences,
                    "important_factual_differences": differences,
                    "date": self._source_date(metadata, document.get("updated_at")),
                    "status": str(metadata.get("status") or metadata.get("review_status") or "status unknown"),
                    "revision": revision, "content_hash": revision,
                    "snippet": str(item.get("snippet") or ""), "selected": path in selected,
                })
            except (OSError, ValueError, TypeError):
                continue
            if len(results) >= limit:
                break
        return results

    @staticmethod
    def explicit_prior_work(candidates: list[dict[str, Any]], selected_paths: list[str]) -> list[dict[str, Any]]:
        selected = set(selected_paths)
        return [{**candidate, "selected": True} for candidate in candidates if candidate.get("path") in selected]

    def draft_practice_note(self, *, goal: str, correction: str, name: str = "") -> dict[str, str]:
        """Make an editable draft. This does not write a reusable instruction."""
        clean_goal = " ".join(goal.split()) or "Apply this working instruction"
        clean_correction = " ".join(correction.split())
        title = name.strip() or clean_goal[:80]
        return {
            "skill_id": slugify(title, fallback="practice-note"), "name": title,
            "description": f"Working instruction for {clean_goal.rstrip('.')}",
            "instructions": f"When this instruction is explicitly applied, {clean_goal.rstrip('.')}.\n\n{clean_correction}".strip(),
            "example": clean_correction, "state": "draft",
        }

    def save_practice_note(self, draft: dict[str, Any]) -> dict[str, Any]:
        definition = self.skills.create_practice_note(
            skill_id=str(draft.get("skill_id") or ""), name=str(draft.get("name") or ""),
            description=str(draft.get("description") or ""), instructions=str(draft.get("instructions") or ""),
            example=str(draft.get("example") or ""),
        )
        return self.practice_note_projection(definition.skill_id)

    def practice_note_projection(self, skill_id: str) -> dict[str, Any]:
        definition = self.skills.get(skill_id)
        if getattr(definition, "kind", "skill") != "practice_note":
            raise ValueError("This skill is not a practice note.")
        return {"skill_id": definition.skill_id, "name": definition.name, "description": definition.description,
                "instructions": definition.instructions, "example": getattr(definition, "example", ""), "revision": getattr(definition, "revision", ""),
                "path": definition.path, "enabled": definition.enabled, "status": "available" if definition.enabled else "disabled",
                "failure_detail": None}

    def list_practice_notes(self) -> list[dict[str, Any]]:
        return [self.practice_note_projection(skill.skill_id) for skill in self.skills.list() if getattr(skill, "kind", "skill") == "practice_note"]

    @serialized
    def apply_practice_note(self, matter_id: str, skill_id: str) -> dict[str, Any]:
        note = self.practice_note_projection(skill_id)
        path, document = self._workspace_document(matter_id)
        metadata = dict(document["metadata"])
        links = [item for item in metadata.get("practice_note_links", []) if isinstance(item, dict) and item.get("skill_id") != skill_id]
        link = {"skill_id": skill_id, "matter_id": matter_id, "applied_revision": note["revision"], "applied_at": iso_now()}
        metadata["practice_note_links"] = [*links, link]
        self.vault.write_markdown(path, document["content"] or "# Workspace", metadata)
        return {**link, "note": note}

    def applied_practice_notes(self, matter_id: str) -> list[dict[str, Any]]:
        _, document = self._workspace_document(matter_id)
        applied: list[dict[str, Any]] = []
        for link in document["metadata"].get("practice_note_links", []):
            if not isinstance(link, dict) or link.get("matter_id") != matter_id:
                continue
            try:
                note = self.practice_note_projection(str(link.get("skill_id") or ""))
                applied.append({**note, "applied_revision": link.get("applied_revision")})
            except (KeyError, ValueError):
                applied.append({"skill_id": str(link.get("skill_id") or ""), "status": "unavailable",
                                "failure_detail": "The applied practice note is missing or no longer a practice note."})
        return applied

    def create_assumption_watch(self, matter_id: str, request: WatchDraftCreate, *, assumption_ids: list[str],
                                decision_ids: list[str] | None = None) -> dict[str, Any]:
        self._validate_assumptions(matter_id, assumption_ids)
        watch = self.watches.create_draft(request)
        link = self.watches.link_workspace_assumptions(watch.watch_id, matter_id=matter_id,
                                                       assumption_ids=assumption_ids, decision_ids=decision_ids)
        return {"watch": watch.model_dump(mode="json"), "link": link, "activation": "draft_only"}

    def assumption_watches(self, matter_id: str) -> list[dict[str, Any]]:
        matches: list[dict[str, Any]] = []
        for watch in self.watches.list(limit=250).items:
            for link in self.watches.workspace_assumption_links(watch.watch_id):
                if link.get("matter_id") == matter_id:
                    matches.append({"watch": watch.model_dump(mode="json"), "link": link,
                                    "activation": "active" if watch.enabled else "draft_only"})
        return matches

    def _workspace_document(self, matter_id: str) -> tuple[str, dict[str, Any]]:
        if self.workspace is not None:
            path = self.workspace._path(matter_id, "workspace.md")
            return path, self.workspace._document(matter_id, "workspace.md")
        # Integration supplies WorkspaceService. This fallback remains strictly
        # matter-local for isolated service tests.
        paths = list(self.vault.iter_files("03_Matters", {".md"}))
        for candidate in paths:
            relative = self.vault.relative(candidate)
            if candidate.name == "workspace.md":
                document = self.vault.read_markdown(relative)
                if document["metadata"].get("matter_id") == matter_id:
                    return relative, document
        raise KeyError("WorkspaceService is required to create workspace metadata.")

    def _validate_assumptions(self, matter_id: str, assumption_ids: list[str]) -> None:
        if not assumption_ids:
            raise ValueError("Select at least one assumption.")
        if self.records is None:
            return
        known = {item["assumption_id"] for item in self.records.get(matter_id)["assumptions"]}
        unknown = sorted(set(assumption_ids) - known)
        if unknown:
            raise ValueError(f"Assumptions do not belong to this matter: {', '.join(unknown)}")

    def _current_facts(self, matter_id: str) -> list[str]:
        if self.records is None:
            return []
        try:
            record = self.records.get(matter_id)
        except (KeyError, OSError, ValueError):
            return []
        return [str(item.get("text") or "") for item in [*record.get("facts", []), *record.get("assumptions", [])]
                if str(item.get("text") or "").strip()]

    @staticmethod
    def _is_prior_work_path(path: str, matter_id: str) -> bool:
        return path.startswith("03_Matters/") and ("/decisions/" in path or path.endswith("/dossier.md") or path.endswith("/workspace.md"))

    @staticmethod
    def _differences(current_facts: list[str], candidate_text: str) -> list[str]:
        missing = [text for text in current_facts if text.casefold() not in candidate_text]
        if missing:
            return [f"The prior record does not state: {text}" for text in missing[:3]]
        return ["No material difference was identified by text comparison; inspect the source before reuse."]

    @staticmethod
    def _source_date(metadata: dict[str, Any], fallback: Any) -> str:
        for key in ("decided_at", "updated_at", "created_at"):
            if metadata.get(key):
                return str(metadata[key])
        return str(fallback or "date unknown")

    @staticmethod
    def _source_matter_id(path: str, metadata: dict[str, Any]) -> str:
        explicit = str(metadata.get("matter_id") or "").strip()
        if explicit:
            return explicit
        parts = Path(path).parts
        try:
            return parts[parts.index("03_Matters") + 1]
        except (ValueError, IndexError):
            return ""

    @staticmethod
    def _source_revision(document: dict[str, Any]) -> str:
        """A source snapshot identity derived from the current Markdown payload."""
        payload = {"content": str(document.get("content") or ""), "metadata": document.get("metadata") or {}}
        return hashlib.sha256(json.dumps(payload, sort_keys=True, default=str, ensure_ascii=False).encode("utf-8")).hexdigest()
