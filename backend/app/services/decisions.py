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
        return self.index.list_decisions(status)

    def record(self, request: DecisionCreate) -> dict[str, Any]:
        base = self.matters.matter_path(request.matter_id)
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

    def audit(self) -> dict[str, Any]:
        now = utc_now()
        reviewed = 0
        flagged = 0
        changes: list[dict[str, Any]] = []
        for decision in self.index.list_decisions():
            reviewed += 1
            status, reason = self._evaluate(decision, now)
            if status != "fresh":
                flagged += 1
            path = decision["path"]
            self.vault.update_markdown(
                path,
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
        self.index.rebuild()
        return {"reviewed": reviewed, "flagged": flagged, "changes": changes}

    def _evaluate(self, decision: dict[str, Any], now) -> tuple[str, str]:
        next_review = parse_iso(decision.get("next_review_at"))
        if next_review and next_review <= now:
            return "stale", f"Scheduled review date passed on {next_review.date().isoformat()}."

        anchor = parse_iso(decision.get("last_reviewed_at")) or parse_iso(decision.get("decided_at"))
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
