from __future__ import annotations

from datetime import timedelta
from typing import Any

from app.models.api import DecisionCreate
from app.services.index import IndexService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now, parse_iso, utc_now


class DecisionService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        matters: MatterService,
        review_age_days: int = 180,
    ):
        self.vault = vault
        self.index = index
        self.matters = matters
        self.review_age_days = review_age_days

    def list(self, status: str | None = None) -> list[dict[str, Any]]:
        return [self._with_links(item) for item in self.index.list_decisions(status)]

    def get(self, decision_id: str) -> dict[str, Any]:
        decision = next(
            (item for item in self.index.list_decisions() if item["decision_id"] == decision_id),
            None,
        )
        if decision is None:
            raise KeyError(f"Decision not found: {decision_id}")
        return self._with_links(decision)

    def record(
        self,
        request: DecisionCreate,
        *,
        revises_decision_id: str | None = None,
        mitigation_ids: list[str] | None = None,
        review_packet_ids: list[str] | None = None,
    ) -> dict[str, Any]:
        base = self.matters.matter_path(request.matter_id)
        if revises_decision_id:
            prior = self.get(revises_decision_id)
            if prior["matter_id"] != request.matter_id:
                raise ValueError("A decision revision must stay in the original matter.")
        decision_id = new_id("DEC")
        now = iso_now()
        path = f"{base}/decisions/{decision_id}.md"
        metadata = {
            "decision_id": decision_id,
            "matter_id": request.matter_id,
            "title": request.title,
            "decision_type": request.decision_type,
            "chosen_path": request.chosen_path,
            "rationale": request.rationale,
            "decision_maker": request.decision_maker,
            "conditions": request.conditions,
            "linked_paths": request.linked_paths,
            "mitigation_ids": list(dict.fromkeys(mitigation_ids or [])),
            "review_packet_ids": list(dict.fromkeys(review_packet_ids or [])),
            "revises_decision_id": revises_decision_id,
            "decided_at": now,
            "next_review_at": request.next_review_at,
            "last_reviewed_at": now,
            "risk_level": request.risk_level,
            "review_status": "fresh",
            "staleness_reason": "",
            "privilege": request.privilege,
        }
        conditions = "\n".join(f"- {item}" for item in request.conditions) or "- None recorded"
        self.vault.write_markdown(
            path,
            (
                f"# {request.title}\n\n"
                f"## Chosen path\n\n{request.chosen_path}\n\n"
                f"## Rationale\n\n{request.rationale or 'No rationale recorded.'}\n\n"
                f"## Conditions\n\n{conditions}\n"
            ),
            metadata,
        )
        self.matters.note_durable_decision_recorded(request.matter_id)
        self.matters.append_event(
            request.matter_id,
            "decision_recorded",
            {"title": request.title, "decision_id": decision_id},
            rebuild=False,
        )
        self.index.rebuild()
        return {**metadata, "path": path}

    def revise(self, decision_id: str, request: DecisionCreate) -> dict[str, Any]:
        """Create a linked successor. The prior Markdown record is never changed."""
        return self.record(request, revises_decision_id=decision_id)

    def mark_reviewed(
        self,
        decision_id: str,
        packet_id: str,
        *,
        next_review_at: str | None = None,
        rebuild: bool = True,
    ) -> dict[str, Any]:
        decision = self.get(decision_id)
        packet_ids = list(decision.get("review_packet_ids") or [])
        if packet_id not in packet_ids:
            packet_ids.append(packet_id)
        updates: dict[str, Any] = {
            "last_reviewed_at": iso_now(),
            "review_status": "fresh",
            "staleness_reason": "",
            "review_packet_ids": packet_ids,
        }
        if next_review_at is not None:
            updates["next_review_at"] = next_review_at
        self.vault.update_markdown(decision["path"], metadata_updates=updates)
        if rebuild:
            self.index.rebuild()
        return self.get(decision_id)

    def link_mitigation(self, decision_id: str, mitigation_id: str) -> dict[str, Any]:
        decision = self.get(decision_id)
        mitigation_ids = list(decision.get("mitigation_ids") or [])
        if mitigation_id not in mitigation_ids:
            mitigation_ids.append(mitigation_id)
            self.vault.update_markdown(
                decision["path"], metadata_updates={"mitigation_ids": mitigation_ids}
            )
            self.index.rebuild()
        return self.get(decision_id)

    def _with_links(self, decision: dict[str, Any]) -> dict[str, Any]:
        metadata = self.vault.read_markdown(decision["path"])["metadata"]
        mitigation_ids = list(metadata.get("mitigation_ids") or [])
        matter_root = decision["path"].rsplit("/decisions/", 1)[0]
        for path in self.vault.iter_files(f"{matter_root}/mitigations", {".md"}):
            mitigation = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if decision["decision_id"] in (mitigation.get("decision_ids") or []):
                mitigation_id = str(mitigation.get("mitigation_id") or path.stem)
                if mitigation_id not in mitigation_ids:
                    mitigation_ids.append(mitigation_id)
        return {
            **decision,
            "conditions": list(metadata.get("conditions") or []),
            "mitigation_ids": mitigation_ids,
            "review_packet_ids": list(metadata.get("review_packet_ids") or []),
            "revises_decision_id": metadata.get("revises_decision_id"),
        }

    def audit(self, *, persist: bool = True) -> dict[str, Any]:
        now = utc_now()
        reviewed = 0
        flagged = 0
        changes: list[dict[str, Any]] = []
        for decision in self.index.list_decisions():
            reviewed += 1
            status, reason = self._evaluate(decision, now)
            if status != "fresh":
                flagged += 1
            if persist:
                self.vault.update_markdown(
                    decision["path"],
                    metadata_updates={
                        "review_status": status,
                        "staleness_reason": reason,
                        "audited_at": iso_now(),
                    },
                )
            if status != decision.get("review_status") or reason != decision.get("staleness_reason"):
                changes.append(
                    {
                        "decision_id": decision["decision_id"],
                        "title": decision["title"],
                        "review_status": status,
                        "reason": reason,
                    }
                )
        if persist:
            self.index.rebuild()
        return {"reviewed": reviewed, "flagged": flagged, "changes": changes}

    def _evaluate(self, decision: dict[str, Any], now) -> tuple[str, str]:
        parsed_dates: dict[str, Any] = {}
        for field in ("next_review_at", "last_reviewed_at", "decided_at"):
            value = decision.get(field)
            if value is None or value == "":
                parsed_dates[field] = None
                continue
            if not isinstance(value, str):
                return "review_recommended", f"Invalid {field}; review is recommended."
            try:
                parsed_dates[field] = parse_iso(value)
            except ValueError:
                return "review_recommended", f"Invalid {field}; review is recommended."

        next_review = parsed_dates["next_review_at"]
        if next_review and next_review <= now:
            return "stale", f"Scheduled review date passed on {next_review.date().isoformat()}."

        anchor = parsed_dates["last_reviewed_at"] or parsed_dates["decided_at"]
        if anchor and now - anchor >= timedelta(days=self.review_age_days):
            return "review_recommended", f"Decision has not been reviewed in {self.review_age_days} days."

        import json

        try:
            linked_paths = json.loads(decision.get("linked_paths") or "[]")
        except json.JSONDecodeError:
            linked_paths = []
        if anchor:
            for linked_path in linked_paths:
                if not self.vault.exists(linked_path):
                    return "review_recommended", f"Linked source is missing: {linked_path}."
                modified = self.vault.resolve(linked_path).stat().st_mtime
                if modified > anchor.timestamp():
                    return "review_recommended", f"Linked source changed after the decision: {linked_path}."
        return "fresh", ""
