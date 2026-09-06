from __future__ import annotations

from datetime import UTC, date, datetime

from app.models.api import WorkItemCreate
from app.models.awareness import ReviewOutcome, ReviewOutcomeAction
from app.services.briefing_store import BriefingStore
from app.services.decisions import DecisionService
from app.services.index import IndexService
from app.services.matters import MatterService
from app.utils.ids import new_id


class ReviewOutcomeService:
    """The sole coordinator for durable final actions on review packets."""

    def __init__(
        self,
        store: BriefingStore,
        decisions: DecisionService,
        matters: MatterService,
        index: IndexService | None = None,
    ):
        self.store = store
        self.decisions = decisions
        self.matters = matters
        self.index = index or decisions.index

    def record_action(
        self,
        packet_id: str,
        action: ReviewOutcomeAction,
        payload: dict[str, object],
        expected_revision: int,
    ) -> ReviewOutcome:
        packet = self.store.get_review_packet(packet_id)
        if packet.revision != expected_revision:
            raise ValueError(
                f"Review packet revision conflict: expected {expected_revision}, "
                f"found {packet.revision}"
            )
        self._validate(action, payload, packet.affected_decisions)

        outcome = ReviewOutcome(
            outcome_id=new_id("OUT"),
            packet_id=packet_id,
            action=action,
            payload=payload,
            recorded_at=datetime.now(UTC),
        )

        if action == "keep_current":
            next_review = payload.get("next_review_at")
            if isinstance(next_review, date):
                next_review = next_review.isoformat()
            for decision_id in packet.affected_decisions:
                self.decisions.mark_reviewed(
                    decision_id,
                    packet_id,
                    next_review_at=str(next_review) if next_review else None,
                    rebuild=False,
                )
        elif action == "revise_decision":
            decision_id = str(payload["decision_id"])
            decision = self.decisions.get(decision_id)
            matter_id = str(payload.get("matter_id") or decision["matter_id"])
            self._create_work(
                matter_id,
                str(payload["work_item_title"]),
                packet_id,
                decision_id=decision_id,
                item_type="decision",
            )
        elif action == "create_follow_up":
            self._create_work(
                str(payload["matter_id"]),
                str(payload["title"]),
                packet_id,
                due_at=payload.get("due_at"),
            )

        saved = self.store.append_outcome(outcome)
        updated = packet.model_copy(update={
            "status": "monitoring" if action == "keep_monitoring" else "resolved",
            "attention_state": "monitor" if action == "keep_monitoring" else "briefing_only",
            "revision": packet.revision + 1,
            "updated_at": datetime.now(UTC),
        })
        self.store.vault.write_markdown(
            updated.path,
            f"# Review packet {updated.packet_id}\n\n{updated.what_happened}",
            updated.model_dump(mode="json"),
        )
        self.index.rebuild()
        return saved

    def _create_work(
        self,
        matter_id: str,
        title: str,
        packet_id: str,
        *,
        decision_id: str | None = None,
        due_at: object = None,
        item_type: str = "follow_up",
    ) -> None:
        self.matters.create_review_work_item(
            WorkItemCreate(
                matter_id=matter_id,
                title=title,
                item_type=item_type,
                due_at=str(due_at) if due_at else None,
                required=True,
            ),
            review_packet_id=packet_id,
            decision_id=decision_id,
            rebuild=False,
        )

    @staticmethod
    def _validate(
        action: ReviewOutcomeAction,
        payload: dict[str, object],
        affected_decisions: list[str],
    ) -> None:
        if action == "keep_current" and not affected_decisions:
            raise ValueError("Keep current requires a linked decision.")
        if action == "revise_decision":
            decision_id = str(payload.get("decision_id") or "")
            if not decision_id or decision_id not in affected_decisions:
                raise ValueError("Revise decision requires a decision linked to the packet.")
            if not str(payload.get("work_item_title") or "").strip():
                raise ValueError("Revise decision requires a work item title.")
        if action == "create_follow_up" and (
            not str(payload.get("matter_id") or "").strip()
            or not str(payload.get("title") or "").strip()
        ):
            raise ValueError("Create follow-up work requires a matter and title.")
