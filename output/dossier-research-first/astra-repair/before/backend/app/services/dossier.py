from __future__ import annotations

import hashlib
import re
from pathlib import PurePosixPath
from typing import Any
from functools import wraps
from threading import RLock

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


WORKSPACE_LOCK = RLock()


def serialized(method):
    @wraps(method)
    def call(*args, **kwargs):
        with WORKSPACE_LOCK:
            return method(*args, **kwargs)
    return call


class DossierService:
    _RECOMMENDATION_HEADING = "Options or working recommendation"
    _RECOMMENDATION_SUCCESSOR = "Next counsel action"

    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters
        self.generation_sequence = 0
        self.generation_pending: dict[str, dict[str, Any]] = {}

    def _request_generation(self, matter_id: str, result: dict[str, Any]) -> dict[str, Any]:
        from app.services.dossier_generation import generation_owner
        self.generation_sequence += 1
        self.generation_pending[matter_id] = {
            "sequence": self.generation_sequence, "owner": generation_owner.get(),
            "expected_hash": result.get("content_hash") if result["state"] in {"applied", "not_required"} else "review-required",
            "run_id": new_id("DOSGEN"),
        }
        return result

    def get(self, matter_id: str) -> dict[str, Any] | None:
        path = self._path(matter_id)
        return self.vault.read_markdown(path) if self.vault.exists(path) else None

    def content_hash(self, matter_id: str) -> str | None:
        dossier = self.get(matter_id)
        return self._hash(dossier["content"]) if dossier else None

    def orientation(self, matter_id: str) -> dict[str, Any]:
        dossier = self.get(matter_id)
        if not dossier:
            return {"summary": "", "decision_question": "", "open_questions": []}
        content = dossier["content"]
        return {
            "summary": (
                self.section(content, "Matter summary")
                or self.section(content, "Current position")
                or self.section(content, "Summary")
                or self.section(content, "Current ask")
            ),
            "decision_question": self.section(content, "Decision question"),
            "open_questions": self.list_section(content, "Open questions"),
        }

    @serialized
    def update_orientation(
        self,
        matter_id: str,
        *,
        summary: str,
        decision_question: str,
        open_questions: list[str],
        research_path: str,
        research_support: str = "",
        expected_question_revision: str | None = None,
    ) -> dict[str, Any]:
        current = self.get(matter_id)
        content = current["content"] if current else "# Matter dossier\n"
        content = self._remove_section(content, "Summary")
        content = self._remove_section(content, "Research")
        content = self._set_section(content, "Matter summary", summary)
        content = self._set_section(content, "Decision question", decision_question)
        content = self._set_section(
            content,
            "Open questions",
            "\n".join(f"- {question.strip()}" for question in open_questions if question.strip()),
        )
        support = f"Latest review: `{research_path}`"
        if research_support.strip():
            support += f"\n\n{research_support.strip()}"
        content = self._set_section(content, "Research and source support", support)
        expected_hash = self._hash(current["content"]) if current else None
        if expected_question_revision is not None:
            from app.services.workspace import WorkspaceService
            if WorkspaceService(self.vault, self.matters, self).business_question(matter_id)["revision"] != expected_question_revision:
                revision = self._write_revision(matter_id, content, expected_hash, "historical")
                return {"state": "historical", "revision_path": revision, "content_hash": expected_hash}
        return self.propose_update(matter_id, content, expected_hash=expected_hash)

    @serialized
    def update_from_intake(
        self,
        matter_id: str,
        *,
        working_ask: str,
        facts: list[dict[str, Any]],
        assumptions: list[dict[str, Any]],
        issues: list[str],
        open_questions: list[str],
        orientation: str,
        expected_hash: str | None,
    ) -> dict[str, Any]:
        active_facts = [
            str(item.get("text") or "").strip()
            for item in facts
            if item.get("status") == "active" and not item.get("withdrawn_at")
        ]
        open_assumptions = [
            str(item.get("text") or "").strip()
            for item in assumptions
            if item.get("status") == "open" and not item.get("withdrawn_at")
        ]
        current = self.get(matter_id)
        content = current["content"] if current else "# Matter dossier\n"
        content = self._remove_section(content, "Summary")
        content = self._remove_section(content, "Research")
        sections = [
            ("Matter summary", orientation.strip() or working_ask.strip()),
            ("Decision question", working_ask.strip()),
            ("Material facts", _markdown_list(active_facts, "No reported facts saved yet.")),
            ("Assumptions", _markdown_list(open_assumptions, "No open assumptions.")),
            ("Issues and workstreams", _markdown_list(issues, "No workstreams identified yet.")),
            ("Open questions", _markdown_list(open_questions, "No open questions recorded.")),
            ("Research and source support", self.section(content, "Research and source support") or "Research has not been added yet."),
            ("Options or working recommendation", self.section(content, "Options or working recommendation") or "No separate working recommendation is saved; the draft may still contain advice."),
            ("Next counsel action", "Review the working ask and answer the next material question."),
            ("Work product links", self.section(content, "Work product links") or "No work product yet."),
        ]
        for heading, value in sections:
            content = self._set_section(content, heading, value)
        return self.propose_update(matter_id, content, expected_hash=expected_hash)

    @serialized
    def update_work_state(
        self,
        matter_id: str,
        *,
        recommendation: str,
        draft: dict[str, str] | None,
        final: dict[str, str] | None,
        next_action: str,
        expected_hash: str | None,
        other_work: list[dict[str, str]] | None = None,
        research_publication: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Project only the work-state sections of the dossier."""
        recommendation = re.sub(
            r"(?ms)^#{1,2}\s+Next counsel action\s*\n+(.*?)(?=^#{1,6}\s+|\Z)",
            lambda match: "" if match[1].strip() == next_action.strip() else match[0],
            recommendation,
        )
        # Embedded recommendations must not impersonate the dossier's boundaries.
        recommendation = re.sub(
            r"(?m)^#{1,2}\s+(Options or working recommendation|Next counsel action|Work product links)\s*$",
            r"### \1", recommendation,
        )
        if research_publication:
            recommendation = re.sub(r"(?m)^#{1,2}\s+([^\n]+)$", r"**\1**", recommendation)
        current = self.get(matter_id)
        content = current["content"] if current else "# Matter dossier\n"
        links: list[str] = []
        if draft and draft.get("path"):
            links.append(
                f'- Draft: [{draft.get("title") or "Current draft"}]({draft["path"]})'
            )
        if final and final.get("path"):
            links.append(
                f'- Final: [{final.get("title") or "Current final"}]({final["path"]})'
            )
        for work in other_work or []:
            links.append(f'- Draft: [{work["title"]}]({work["path"]})')
        # Establish the canonical successor before replacing the recommendation.
        # The recommendation can contain its own H2 headings, so its managed span
        # ends only at "Next counsel action" rather than at the next H2.
        projected = self._set_section(
            content,
            "Next counsel action",
            next_action.strip() or "Review the matter and choose the next action.",
        )
        projected = self._set_section(
            projected,
            "Options or working recommendation",
            recommendation.strip() or "No separate working recommendation is saved; the draft may still contain advice.",
        )
        projected = self._set_section(
            projected,
            "Work product links",
            "\n".join(links) or "No work product yet.",
        )
        if research_publication:
            orientation = research_publication.get("orientation") or {}
            if orientation.get("summary"):
                projected = self._set_section(projected, "Matter summary", orientation["summary"])
            if orientation.get("open_questions"):
                projected = self._set_section(projected, "Open questions", "\n".join("- " + q for q in orientation["open_questions"]))
            projected = self._remove_section(projected, "Research")
            projected = self._remove_section(projected, "Research support")
            projected = self._set_section(projected, "Research and source support", "Latest review: `" + research_publication["packet_path"] + "`\n\n" + (research_publication.get("source_support") or "No relevant source passage selected."))
            projected = self._set_section(projected, "Assumptions", research_publication.get("assumption_summary") or "Recorded assumptions are not yet reconciled with this research.")
        if current and self._hash(projected) == self._hash(content):
            return self._request_generation(matter_id, {
                "state": "not_required",
                "path": self._path(matter_id),
                "content_hash": self._hash(content),
            })
        publication_key = (research_publication or {}).get("key")
        if publication_key and research_publication.get("view_version") in (2, 3):
            # Acceptance and input changes produce a new projection of the same
            # research. Only identical content is an idempotent retry.
            publication_key += ":view:" + self._hash(projected) + ":base:" + str(expected_hash)
        return self.propose_update(
            matter_id, projected, expected_hash=expected_hash, publication_key=publication_key
        )

    def project_current_work_state(
        self, matter_id: str, *, expected_hash: str | None
    ) -> dict[str, Any]:
        """Project canonical recommendation and work pointers into the dossier."""
        # Local import keeps the service graph acyclic at module load time.
        from app.services.recommendations import RecommendationService

        detail = self.matters.get(matter_id)
        recommendation = RecommendationService(self.vault, self.matters).get(matter_id)
        recommendation_text = str(recommendation.get("content") or "")
        proposal = recommendation.get("proposal")
        latest = next((v for v in recommendation["versions"] if v.get("version_id") == recommendation.get("current_version_id")), {})
        publication = (proposal or latest).get("research_publication")
        next_action = str(detail["work_state"].get("next_action") or "")
        if publication and publication.get("view_version") in (2, 3):
            from app.services.dossier_research import render_publication
            # Render freshness from current records without rewriting the saved answer.
            from app.services.workspace import WorkspaceService, digest
            from app.services.matter_records import MatterRecordService
            import json
            workspace = WorkspaceService(self.vault, self.matters, self)
            basis = {"business_question_revision": workspace.business_question(matter_id)["revision"],
                     "facts_hash": digest(json.dumps(MatterRecordService(self.vault, self.matters).get(matter_id)["facts"], sort_keys=True, default=str))}
            recommendation_text = render_publication(publication, workspace.issues(matter_id), current_basis=basis)
            recommendation_text = ("### Latest research-based proposal — not yet accepted\n\n" if proposal else "") + recommendation_text
            if (proposal or latest).get("next_action"):
                next_action = ("Proposed: " if proposal else "") + (proposal or latest)["next_action"]
        elif proposal:
            if publication:
                recommendation_text = ("### Latest research-based proposal — not yet accepted\n\n" + str(proposal["content"])
                    + ("\n\nProposed next action: " + proposal["next_action"] if proposal.get("next_action") else "")
                    + "\n\n### Earlier saved position — " + str(latest.get("created_at") or "date unknown") + "\n\n" + recommendation_text)
            else:
                recommendation_text += "\n\n### Proposed working view — not yet accepted\n\n" + str(proposal["content"])
                if proposal.get("next_action"):
                    recommendation_text += "\n\nSuggested next step: " + proposal["next_action"]

        def linked_work(path: str | None, fallback: str) -> dict[str, str] | None:
            if not path or not self.vault.exists(path):
                return None
            title = fallback
            if self.vault.exists(path):
                document = self.vault.read_markdown(path)
                title = str(document["metadata"].get("title") or title)
            return {"path": path, "title": title}

        current_paths = {detail.get("current_work_product_draft_path"), detail.get("current_work_product_final_path")}
        other_work = []
        nodes = list(detail["tree"])
        while nodes:
            node = nodes.pop()
            nodes.extend(node.get("children", []))
            relative = node["path"]
            if node.get("record_type") != "work_product" or {".history", ".proposals"}.intersection(PurePosixPath(relative).parts):
                continue
            doc = self.vault.read_markdown(relative)
            meta = doc["metadata"]
            if relative not in current_paths and meta.get("record_type") == "work_product" and meta.get("state") == "draft" and not meta.get("preview"):
                other_work.append({"path": relative, "title": str(meta.get("title") or node["name"])})
        other_work.sort(key=lambda item: (item["title"], item["path"]))

        return self.update_work_state(
            matter_id,
            recommendation=recommendation_text,
            draft=linked_work(detail.get("current_work_product_draft_path"), "Current draft"),
            final=linked_work(detail.get("current_work_product_final_path"), "Current final"),
            next_action=next_action,
            expected_hash=expected_hash,
            other_work=other_work,
            research_publication=publication,
        )

    @serialized
    def propose_update(
        self, matter_id: str, content: str, *, expected_hash: str | None,
        material: bool = True, force: bool = False, publication_key: str | None = None,
        generated: bool = False,
    ) -> dict[str, Any]:
        current = self.get(matter_id)
        current_hash = self._hash(current["content"]) if current else None
        if publication_key:
            revision_id = "DOS-" + hashlib.sha256(publication_key.encode()).hexdigest()[:20]
            saved_path = f"{self.matters.matter_path(matter_id)}/dossier-revisions/{revision_id}.md"
            if self.vault.exists(saved_path):
                saved = self.vault.read_markdown(saved_path)
                if current and current["metadata"].get("source_revision") == saved_path:
                    return {"state": "applied", "path": self._path(matter_id), "revision_path": saved_path, "content_hash": current_hash}
                if (saved["metadata"].get("base_content_hash") or None) == current_hash and saved["metadata"].get("status") == "applied":
                    self._write_current(matter_id, saved["content"], saved_path)
                    return {"state": "applied", "path": self._path(matter_id), "revision_path": saved_path, "content_hash": self._hash(saved["content"])}
                return {"state": "review_required", "revision_path": saved_path, "content_hash": current_hash}
        supplied_content = content
        content = self._preserve_question(current, content)
        stored_hash = str(current["metadata"].get("content_hash") or "") if current else ""
        lawyer_edited = bool(stored_hash and stored_hash != current_hash)
        # A missing dossier is a version too; changed-input markers must still
        # keep a first generation (or a deleted dossier's replacement) for review.
        guard_failed = expected_hash != current_hash or lawyer_edited
        if current is not None and not material and not force:
            return {"state": "not_required", "path": self._path(matter_id), "content_hash": current_hash}
        history = {}
        if supplied_content != content:
            history["historical_revision_path"] = self._write_revision(
                matter_id, supplied_content, current_hash, "historical"
            )
        revision = self._write_revision(matter_id, content, current_hash, "draft" if guard_failed else "applied", publication_key=publication_key)
        if guard_failed:
            result = {"state": "review_required", "revision_path": revision, "content_hash": current_hash, **history}
            return result if generated or expected_hash == "review-only" else self._request_generation(matter_id, result)
        self._write_current(matter_id, content, revision)
        self.matters.append_event(matter_id, "dossier_updated", {"revision_path": revision, "title": "Dossier updated"})
        result = {"state": "applied", "path": self._path(matter_id), "revision_path": revision,
                  "content_hash": self._hash(content), **history}
        return result if generated else self._request_generation(matter_id, result)

    @serialized
    def apply_revision(self, matter_id: str, revision_path: str, *, expected_hash: str | None) -> dict[str, Any]:
        current_hash = self.content_hash(matter_id)
        if current_hash != expected_hash:
            raise ValueError("The dossier changed. Review the draft revision against the current dossier.")
        revision_root = self.vault.resolve(f"{self.matters.matter_path(matter_id)}/dossier-revisions")
        try:
            self.vault.resolve(revision_path).relative_to(revision_root)
        except ValueError as exc:
            raise ValueError("Choose a dossier revision from this matter.") from exc
        revision = self.vault.read_markdown(revision_path)
        if revision["metadata"].get("matter_id") != matter_id:
            raise ValueError("The revision belongs to a different matter.")
        if revision["metadata"].get("record_type") == "question_proposal":
            raise ValueError("Apply question proposals through the revision-checked question command.")
        if revision["metadata"].get("record_type") != "dossier_revision":
            raise ValueError("Choose a saved dossier revision.")
        content = self._preserve_question(self.get(matter_id), revision["content"])
        self._write_current(matter_id, content, revision_path)
        self.vault.update_markdown(revision_path, metadata_updates={"status": "applied", "applied_at": iso_now()})
        self.matters.append_event(matter_id, "dossier_revision_applied", {"revision_path": revision_path})
        return {"state": "applied", "path": self._path(matter_id), "content_hash": self._hash(content)}

    def _preserve_question(self, current: dict[str, Any] | None, content: str) -> str:
        """Background/whole-dossier writers cannot replace an existing scope.

        Legacy nonempty scope is protected without assigning lawyer authorship.
        A scoped command in WorkspaceService is the sole replacement writer.
        """
        if not current:
            return content
        question = self.section(current["content"], "Decision question")
        if not question:
            return content
        proposed = self.section(content, "Decision question")
        if proposed != question:
            content = self._set_section(content, "Decision question", question)
            # A late orientation for a different question must remain historical.
            # Preserve the current summary while still retaining useful support.
            # Preserve the complete precedence used by orientation(). A newly
            # introduced Matter summary must not eclipse the existing legacy
            # Summary (or Current ask), even when authorship is unknown.
            for heading in ("Matter summary", "Summary", "Current ask"):
                summary = self.section(current["content"], heading)
                if summary:
                    content = self._set_section(content, heading, summary)
                else:
                    content = self._remove_section(content, heading)
        return content

    def _write_current(self, matter_id: str, content: str, revision_path: str) -> None:
        current = self.get(matter_id)
        metadata = dict(current["metadata"]) if current else {}
        self.vault.write_markdown(self._path(matter_id), content, {
            **metadata,
            "matter_id": matter_id, "record_type": "dossier", "editable": True,
            "source_revision": revision_path, "updated_at": iso_now(), "content_hash": self._hash(content),
        })

    def _write_revision(self, matter_id: str, content: str, base_hash: str | None, status: str, *, publication_key: str | None = None) -> str:
        revision_id = "DOS-" + hashlib.sha256(publication_key.encode()).hexdigest()[:20] if publication_key else new_id("DOS")
        path = f"{self.matters.matter_path(matter_id)}/dossier-revisions/{revision_id}.md"
        if publication_key and self.vault.exists(path):
            return path
        return self.vault.write_markdown(path, content, {
            "publication_key": publication_key,
            "revision_id": revision_id, "matter_id": matter_id, "record_type": "dossier_revision",
            "status": status, "base_content_hash": base_hash or "", "content_hash": self._hash(content),
            "created_at": iso_now(), "immutable": True,
        })

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/dossier.md"

    @staticmethod
    def _hash(content: str) -> str:
        stored_content = content.strip() + "\n"
        return hashlib.sha256(stored_content.encode("utf-8")).hexdigest()

    @classmethod
    def section(cls, content: str, heading: str) -> str:
        if heading == cls._RECOMMENDATION_HEADING:
            span = cls._managed_section_span(content)
            return content[span[2]:span[1]].strip() if span else ""
        match = re.search(
            rf"(?ms)^##\s+{re.escape(heading)}\s*\n+(.*?)(?=^##\s+|\Z)",
            content,
        )
        return match.group(1).strip() if match else ""

    @classmethod
    def list_section(cls, content: str, heading: str) -> list[str]:
        section = cls.section(content, heading)
        items = [
            re.sub(r"^\s*(?:[-*+]\s+|\d+[.)]\s+)", "", line).strip()
            for line in section.splitlines()
            if re.match(r"^\s*(?:[-*+]\s+|\d+[.)]\s+)", line)
        ]
        return [item for item in items if item]

    @classmethod
    def _set_section(cls, content: str, heading: str, value: str) -> str:
        replacement = f"## {heading}\n\n{value.strip()}\n\n"
        if heading == cls._RECOMMENDATION_HEADING:
            span = cls._managed_section_span(content)
            if span:
                return content[:span[0]] + replacement + content[span[1]:]
            successor = cls._heading_match(content, cls._RECOMMENDATION_SUCCESSOR)
            if successor:
                return content[:successor.start()] + replacement + content[successor.start():]
            return content.rstrip() + f"\n\n{replacement}"
        pattern = rf"(?ms)^##\s+{re.escape(heading)}\s*\n+.*?(?=^##\s+|\Z)"
        if re.search(pattern, content):
            return re.sub(pattern, lambda _: replacement, content, count=1).rstrip() + "\n"
        return content.rstrip() + f"\n\n{replacement}"

    @classmethod
    def _remove_section(cls, content: str, heading: str) -> str:
        if heading == cls._RECOMMENDATION_HEADING:
            span = cls._managed_section_span(content)
            if span:
                return (content[:span[0]] + content[span[1]:]).rstrip() + "\n"
            return content.rstrip() + "\n"
        pattern = rf"(?ms)^##\s+{re.escape(heading)}\s*\n+.*?(?=^##\s+|\Z)"
        return re.sub(pattern, "", content).rstrip() + "\n"

    @classmethod
    def _managed_section_span(cls, content: str) -> tuple[int, int, int] | None:
        """Return the complete recommendation span bounded by its canonical successor."""
        heading = cls._heading_match(content, cls._RECOMMENDATION_HEADING)
        if not heading:
            return None
        successor = cls._heading_match(
            content, cls._RECOMMENDATION_SUCCESSOR, start=heading.end()
        )
        if not successor:
            return None
        return heading.start(), successor.start(), heading.end()

    @staticmethod
    def _heading_match(
        content: str, heading: str, *, start: int = 0
    ) -> re.Match[str] | None:
        return re.compile(
            rf"(?m)^##\s+{re.escape(heading)}\s*\n+"
        ).search(content, pos=start)


def _markdown_list(values: list[str], empty: str) -> str:
    cleaned = [value for value in values if value]
    return "\n".join(f"- {value}" for value in cleaned) if cleaned else empty
