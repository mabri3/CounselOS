from __future__ import annotations

from typing import Any

import yaml

from app.services.vault import VaultService
from app.utils.time import parse_iso, utc_now


class MatterStateService:
    """Derive a matter's current work state from durable Markdown facts."""

    _NEXT_ACTIONS = {
        "intake": "Complete orientation and identify missing facts.",
        "research": "Run or supervise first-pass research.",
        "explore": "Review the research packet and choose the legal path to test.",
        "generate": "Generate the work product that supports the recommended path.",
        "respond": "Review, decide, and deliver the response.",
        "closed": "No active action. Reopen if facts, law, or policy change.",
    }
    _PRIORITY_RANK = {"urgent": 0, "high": 1, "normal": 2, "low": 3}
    _RUN_READ_ERROR = "One or more research-run records could not be read."
    _STAGE_RANK = {
        "intake": 0, "research": 1, "explore": 2, "generate": 3,
        "respond": 4, "closed": 5,
    }

    def __init__(self, vault: VaultService):
        self.vault = vault

    def resolve(
        self,
        matter: dict[str, Any],
        work_items: list[dict[str, Any]],
        *,
        current_final_path: str | None = None,
        required_open_count: int | None = None,
    ) -> dict[str, Any]:
        stage = self._text(matter.get("status")).lower()
        next_item = self._next_work_item(
            work_items,
            intake_complete=self._text(matter.get("intake_state")).casefold() in {"complete", "stopped"},
        )
        next_owner, next_actor = self._next_actor(next_item, stage)
        execution_state, active_run_id, execution_note = self._execution_state(matter)

        item_title = self._text(next_item.get("title")) if next_item else ""
        saved_action = self._text(matter.get("next_action"))
        intake_active = self._text(matter.get("intake_state")).casefold() == "active"
        if (
            intake_active
            and next_item is None
            and saved_action
            and saved_action != self.default_next_action(stage)
        ):
            next_owner = self._configured_lawyer() or None
            next_actor = "you"
        next_action = (
            saved_action or item_title or self.default_next_action(stage)
            if intake_active
            else item_title or saved_action or self.default_next_action(stage)
        )
        if current_final_path or matter.get("response_approved_at"):
            open_count = required_open_count if required_open_count is not None else int(next_item is not None)
            next_action = self.lifecycle_next_action(
                matter,
                current_final_path=current_final_path,
                required_open_count=open_count,
            )
            if (
                next_action in {"Approve the final response.", "Record manual delivery."}
                or not open_count
            ):
                next_item = None
                next_owner = self._configured_lawyer() or None
                next_actor = "you"
        due_at = self._display_value(
            next_item.get("due_at") if next_item and next_item.get("due_at") else matter.get("target_date")
        )
        signal = self._signal(
            stage=stage,
            due_at=due_at,
            execution_state=execution_state,
            item_status=self._text(next_item.get("status")).lower() if next_item else "",
            next_actor=next_actor,
            next_owner=next_owner,
        )

        return {
            "next_action": next_action,
            "next_work_item_id": next_item.get("work_item_id") if next_item else None,
            "next_owner": next_owner,
            "next_actor": next_actor,
            "due_at": due_at or None,
            "execution_state": execution_state,
            "active_run_id": active_run_id,
            "execution_note": execution_note,
            "signal": signal,
        }

    def consistency_issues(
        self,
        matter: dict[str, Any],
        *,
        current_final_path: str | None,
        required_open_count: int = 0,
        execution_state: str | None = None,
    ) -> list[dict[str, str]]:
        """Report durable contradictions without inferring material records."""
        stage = self._text(matter.get("status")).lower()
        approved_at = self._text(matter.get("response_approved_at"))
        approved_path = self._text(matter.get("response_approved_artifact_path"))
        sent_at = self._text(matter.get("response_sent_at"))
        closed_at = self._text(matter.get("closed_at"))
        issues: list[dict[str, str]] = []
        if execution_state is None:
            execution_state, _, _ = self._execution_state(matter)
        if current_final_path and self._STAGE_RANK.get(stage, 0) < self._STAGE_RANK["respond"]:
            issues.append({
                "code": "final_with_pre_respond_stage",
                "summary": "A current final exists, but the matter is before Respond.",
                "repair": "Move the derived lifecycle stage to Respond.",
            })
        if approved_at and (not current_final_path or not approved_path or approved_path != current_final_path):
            issues.append({
                "code": "approval_without_current_final",
                "summary": "Approval does not point to the current final response.",
                "repair": "Review the final and record approval directly. Automatic repair is not safe.",
            })
        if sent_at and (not approved_at or not approved_path):
            issues.append({
                "code": "delivery_without_approved_artifact",
                "summary": "Delivery exists without a durable approved artifact.",
                "repair": "Review the lifecycle records. Automatic repair is not safe.",
            })
        if stage == "closed" and (
            not closed_at or not approved_at or not sent_at or required_open_count
        ):
            issues.append({
                "code": "closed_without_required_lifecycle_fields",
                "summary": "Closed state is missing delivery, closure, or required-work facts.",
                "repair": "Review the lifecycle records. Automatic repair is not safe.",
            })
        if stage == "closed" and execution_state in {"queued", "running"}:
            issues.append({
                "code": "closed_with_active_research",
                "summary": "Closed state conflicts with active research.",
                "repair": "Stop or finish the active research, then review the matter state.",
            })
        return issues

    def lifecycle_next_action(
        self,
        matter: dict[str, Any],
        *,
        current_final_path: str | None,
        required_open_count: int = 0,
    ) -> str:
        if self._text(matter.get("status")).lower() == "closed":
            return self._NEXT_ACTIONS["closed"]
        if not current_final_path:
            return "Review and finalize the current draft."
        if not matter.get("response_approved_at"):
            return "Approve the final response."
        if not matter.get("response_sent_at"):
            return "Record manual delivery."
        if required_open_count:
            return "Complete required work before closing the matter."
        return "Close the matter."

    def default_next_action(self, stage: str) -> str:
        normalized = self._text(stage).lower()
        return self._NEXT_ACTIONS.get(normalized, self._NEXT_ACTIONS["intake"])

    def is_backward_stage_change(self, current: str, proposed: str) -> bool:
        return self._STAGE_RANK.get(self._text(proposed).lower(), 0) < self._STAGE_RANK.get(
            self._text(current).lower(), 0
        )

    def _next_work_item(
        self,
        work_items: list[dict[str, Any]],
        *,
        intake_complete: bool = False,
    ) -> dict[str, Any] | None:
        candidates = [
            item
            for item in work_items
            if item.get("required") and self._text(item.get("status")).lower() not in {"done", "closed"}
            and not (
                intake_complete
                and self._text(item.get("title")).casefold() == "orient to the request"
            )
        ]
        return min(candidates, key=self._work_item_sort_key, default=None)

    def _work_item_sort_key(self, item: dict[str, Any]) -> tuple[Any, ...]:
        priority = self._text(item.get("priority")).lower()
        due_at = self._display_value(item.get("due_at"))
        return (
            self._PRIORITY_RANK.get(priority, self._PRIORITY_RANK["normal"]),
            0 if due_at else 1,
            due_at,
            self._display_value(item.get("created_at")),
            self._text(item.get("title")),
            self._text(item.get("work_item_id")),
        )

    def _next_actor(
        self,
        next_item: dict[str, Any] | None,
        stage: str,
    ) -> tuple[str | None, str]:
        if next_item is None:
            return None, "you" if stage == "explore" else "none"
        owner = self._text(next_item.get("owner"))
        if not owner:
            return None, "unassigned"
        if owner.casefold() == self._configured_lawyer().casefold():
            return owner, "you"
        return owner, "themis" if owner.casefold() in {"themis", "themis.ai"} else "named_owner"

    def _configured_lawyer(self) -> str:
        path = "00_System/settings.md"
        if not self.vault.exists(path):
            return ""
        values = self.vault.read_markdown(path)["metadata"].get("values", {})
        if not isinstance(values, dict):
            return ""
        return self._text(values.get("document_review.lawyer_name"))

    def _execution_state(self, matter: dict[str, Any]) -> tuple[str, str | None, str]:
        matter_path = self._text(matter.get("path"))
        runs_path = self.vault.resolve(f"{matter_path}/research/runs")
        if not runs_path.exists():
            return "not_running", None, ""

        active: list[tuple[str, str, str, str]] = []
        unreadable = False
        for path in sorted(runs_path.glob("*.md")):
            try:
                metadata = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            except (OSError, UnicodeError, TypeError, ValueError, yaml.YAMLError):
                # A single unreadable or invalid durable record must not fail the matters API.
                unreadable = True
                continue
            state = self._text(metadata.get("state")).lower()
            if state in {"queued", "running"}:
                active.append(
                    (
                        self._display_value(metadata.get("created_at")),
                        path.name,
                        self._text(metadata.get("run_id")) or path.stem,
                        state,
                    )
                )

        if active:
            _, _, run_id, state = max(active, key=lambda run: (run[0], run[1]))
            return state, run_id, ""
        if unreadable:
            return "unknown", None, self._RUN_READ_ERROR
        return "not_running", None, ""

    def _signal(
        self,
        *,
        stage: str,
        due_at: str,
        execution_state: str,
        item_status: str,
        next_actor: str,
        next_owner: str | None,
    ) -> dict[str, str]:
        if stage == "closed":
            return {"kind": "none", "label": ""}
        if self._is_overdue(due_at):
            return {"kind": "overdue", "label": "Overdue"}
        if execution_state in {"queued", "running"}:
            return {"kind": "agent_working", "label": "Themis.ai is working"}
        if execution_state == "unknown":
            return {"kind": "execution_unknown", "label": "Agent status unavailable"}
        if item_status == "blocked":
            return {"kind": "blocked", "label": "Blocked"}
        if next_actor == "unassigned":
            return {"kind": "needs_assignment", "label": "Needs assignment"}
        if next_actor == "themis":
            return {"kind": "ready_for_themis", "label": "Ready for Themis.ai"}
        if next_actor == "named_owner":
            return {"kind": "waiting_on_owner", "label": f"Waiting on {next_owner}"}
        if next_actor == "you":
            return {"kind": "waiting_on_you", "label": "Waiting on you"}
        return {"kind": "none", "label": ""}

    @staticmethod
    def _is_overdue(value: str) -> bool:
        try:
            parsed = parse_iso(value)
        except (TypeError, ValueError):
            return False
        return parsed is not None and parsed.date() < utc_now().date()

    @staticmethod
    def _display_value(value: Any) -> str:
        if value is None:
            return ""
        if hasattr(value, "isoformat"):
            return str(value.isoformat())
        return str(value).strip()

    @staticmethod
    def _text(value: Any) -> str:
        return "" if value is None else str(value).strip()
