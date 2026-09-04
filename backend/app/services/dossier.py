from __future__ import annotations

import hashlib
import re
from typing import Any

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class DossierService:
    _RECOMMENDATION_HEADING = "Options or working recommendation"
    _RECOMMENDATION_SUCCESSOR = "Next counsel action"

    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

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
                or self.section(content, "Summary")
                or self.section(content, "Current ask")
            ),
            "decision_question": self.section(content, "Decision question"),
            "open_questions": self.list_section(content, "Open questions"),
        }

    def update_orientation(
        self,
        matter_id: str,
        *,
        summary: str,
        decision_question: str,
        open_questions: list[str],
        research_path: str,
        research_support: str = "",
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
        return self.propose_update(matter_id, content, expected_hash=expected_hash)

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

    def update_work_state(
        self,
        matter_id: str,
        *,
        recommendation: str,
        draft: dict[str, str] | None,
        final: dict[str, str] | None,
        next_action: str,
        expected_hash: str | None,
    ) -> dict[str, Any]:
        """Project only the work-state sections of the dossier."""
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
        if current and self._hash(projected) == self._hash(content):
            return {
                "state": "not_required",
                "path": self._path(matter_id),
                "content_hash": self._hash(content),
            }
        return self.propose_update(
            matter_id, projected, expected_hash=expected_hash
        )

    def project_current_work_state(
        self, matter_id: str, *, expected_hash: str | None
    ) -> dict[str, Any]:
        """Project canonical recommendation and work pointers into the dossier."""
        # Local import keeps the service graph acyclic at module load time.
        from app.services.recommendations import RecommendationService

        detail = self.matters.get(matter_id)
        recommendation = RecommendationService(self.vault, self.matters).get(matter_id)

        def linked_work(path: str | None, fallback: str) -> dict[str, str] | None:
            if not path:
                return None
            title = fallback
            if self.vault.exists(path):
                document = self.vault.read_markdown(path)
                title = str(document["metadata"].get("title") or title)
            return {"path": path, "title": title}

        return self.update_work_state(
            matter_id,
            recommendation=str(recommendation.get("content") or ""),
            draft=linked_work(detail.get("current_work_product_draft_path"), "Current draft"),
            final=linked_work(detail.get("current_work_product_final_path"), "Current final"),
            next_action=str(detail["work_state"].get("next_action") or ""),
            expected_hash=expected_hash,
        )

    def propose_update(
        self, matter_id: str, content: str, *, expected_hash: str | None,
        material: bool = True, force: bool = False,
    ) -> dict[str, Any]:
        current = self.get(matter_id)
        current_hash = self._hash(current["content"]) if current else None
        stored_hash = str(current["metadata"].get("content_hash") or "") if current else ""
        lawyer_edited = bool(stored_hash and stored_hash != current_hash)
        guard_failed = current is not None and (expected_hash != current_hash or lawyer_edited)
        if current is not None and not material and not force:
            return {"state": "not_required", "path": self._path(matter_id), "content_hash": current_hash}
        revision = self._write_revision(matter_id, content, current_hash, "draft" if guard_failed else "applied")
        if guard_failed:
            return {"state": "review_required", "revision_path": revision, "content_hash": current_hash}
        self._write_current(matter_id, content, revision)
        self.matters.append_event(matter_id, "dossier_updated", {"revision_path": revision, "title": "Dossier updated"})
        return {"state": "applied", "path": self._path(matter_id), "revision_path": revision,
                "content_hash": self._hash(content)}

    def apply_revision(self, matter_id: str, revision_path: str, *, expected_hash: str | None) -> dict[str, Any]:
        current_hash = self.content_hash(matter_id)
        if current_hash != expected_hash:
            raise ValueError("The dossier changed. Review the draft revision against the current dossier.")
        revision = self.vault.read_markdown(revision_path)
        if revision["metadata"].get("matter_id") != matter_id:
            raise ValueError("The revision belongs to a different matter.")
        self._write_current(matter_id, revision["content"], revision_path)
        self.vault.update_markdown(revision_path, metadata_updates={"status": "applied", "applied_at": iso_now()})
        self.matters.append_event(matter_id, "dossier_revision_applied", {"revision_path": revision_path})
        return {"state": "applied", "path": self._path(matter_id), "content_hash": self._hash(revision["content"])}

    def _write_current(self, matter_id: str, content: str, revision_path: str) -> None:
        self.vault.write_markdown(self._path(matter_id), content, {
            "matter_id": matter_id, "record_type": "dossier", "editable": True,
            "source_revision": revision_path, "updated_at": iso_now(), "content_hash": self._hash(content),
        })

    def _write_revision(self, matter_id: str, content: str, base_hash: str | None, status: str) -> str:
        revision_id = new_id("DOS")
        path = f"{self.matters.matter_path(matter_id)}/dossier-revisions/{revision_id}.md"
        return self.vault.write_markdown(path, content, {
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
            return re.sub(pattern, replacement, content, count=1).rstrip() + "\n"
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
