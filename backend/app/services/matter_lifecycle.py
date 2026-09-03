from __future__ import annotations

import hashlib
from pathlib import PurePosixPath
from typing import TYPE_CHECKING, Any

from app.utils.time import iso_now

if TYPE_CHECKING:
    from app.services.matters import MatterService


class MatterLifecycleService:
    """Owns stage, approval, delivery, closure, and final-artifact lifecycle state."""

    def __init__(self, matters: MatterService):
        self.matters = matters

    def move_stage(
        self, matter_id: str, stage: str, *, reason: str = "", actor: str = "user", rebuild: bool = True,
    ) -> dict[str, Any]:
        matter = self.matters._require_matter(matter_id)
        stage = self.matters.workflow.validate(stage)
        if actor == "agent" and self.matters.matter_state.is_backward_stage_change(str(matter["status"]), stage):
            return {**self.matters.get(matter_id), "changed_paths": [], "event_path": None}
        if stage == "closed" and matter["status"] != "closed":
            raise ValueError("Use the close matter action so delivery and required work are checked.")
        path = f"{matter['path']}/matter.md"
        self.matters.vault.update_markdown(path, metadata_updates={
            "status": stage,
            "next_action": self.matters.matter_state.default_next_action(stage),
            "closed_at": None if matter["status"] == "closed" else self.matters._matter_metadata(matter).get("closed_at"),
            "updated_at": iso_now(),
        })
        event_path = self.matters.append_event(
            matter_id, "stage_changed", {"from": matter["status"], "to": stage, "reason": reason, "actor": actor}, rebuild=False,
        )
        if rebuild:
            self.matters.index.rebuild()
        return {**self.matters.get(matter_id), "changed_paths": [path, event_path], "event_path": event_path}

    def repair_consistency(self, matter_id: str, *, actor: str) -> dict[str, Any]:
        if not actor.strip():
            raise ValueError("actor is required.")
        matter = self.matters.get(matter_id)
        codes = {issue["code"] for issue in matter.get("consistency_issues", [])}
        if "final_with_pre_respond_stage" not in codes:
            return self.matters._action_result(
                "repair_consistency", matter_id, [], None, None, True,
                summary="No safe derived lifecycle repair is available.",
                recovery="Review material approval, delivery, closure, or decision records directly.",
            )
        moved = self.move_stage(matter_id, "respond", reason="Reconciled current canonical final", actor=actor)
        return self.matters._action_result(
            "repair_consistency", matter_id, moved.get("changed_paths", []), moved.get("event_path"), None, False,
            summary="Reconciled the matter stage to Respond from the current final.",
        )

    def perform_action(
        self, matter_id: str, action: str, *, actor: str, artifact_path: str | None = None,
        work_item_id: str | None = None, note: str | None = None,
    ) -> dict[str, Any]:
        actor = actor.strip()
        if not actor:
            raise ValueError("actor is required.")
        matter = self.matters._require_matter(matter_id)
        metadata = self.matters._matter_metadata(matter)
        if matter["status"] != "respond":
            recorded_field = {"approve_response": "response_approved_at", "mark_as_sent": "response_sent_at", "close_matter": "closed_at"}.get(action)
            if not recorded_field or not metadata.get(recorded_field):
                raise ValueError("Response actions are available only in Respond.")
        now = iso_now()
        changed_paths: list[str] = []
        already_recorded = False
        event_path: str | None = None
        if action == "approve_response":
            if metadata.get("response_approved_at"):
                if not artifact_path:
                    raise ValueError("A final Markdown response artifact is required for approval.")
                if artifact_path != metadata.get("response_approved_artifact_path"):
                    raise ValueError("A different final response is already approved for this matter.")
                if work_item_id:
                    approval_item = self.matters._find_work_item(matter_id, work_item_id)
                    if approval_item["item_type"] != "approval":
                        raise ValueError("The selected work item is not an approval work item.")
                event_missing = not metadata.get("response_approval_event_path") or not self.matters.vault.exists(metadata["response_approval_event_path"])
                event_path = self._repair_event(matter_id, metadata, "response_approval_event_path", "response_approved", "Response approved", metadata["response_approved_at"], metadata.get("response_approved_by") or actor)
                if event_missing:
                    self.matters.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"response_approval_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                if work_item_id and approval_item["status"] not in {"done", "closed"}:
                    changed_paths.extend(self.matters.complete_work_item(matter_id, work_item_id, actor=actor, rebuild=False)["changed_paths"])
                if changed_paths:
                    self.matters.index.rebuild()
                return self.matters._action_result(action, matter_id, changed_paths, event_path, work_item_id, True)
            if not artifact_path:
                raise ValueError("A final Markdown response artifact is required for approval.")
            final = self.validate_final_artifact(matter_id, artifact_path)
            if work_item_id:
                approval_item = self.matters._find_work_item(matter_id, work_item_id)
                if approval_item["item_type"] != "approval":
                    raise ValueError("The selected work item is not an approval work item.")
            event_path = self.matters.append_event(matter_id, "response_approved", {"title": "Response approved", "actor": actor, "artifact_path": final["path"]}, event_id=self.event_id(matter_id, "approval"), timestamp=now)
            updates = {"response_approved_at": now, "response_approved_by": actor, "response_approved_artifact_path": final["path"], "response_approved_artifact_id": final["final_id"], "response_approved_final_id": final["final_id"], "response_approval_event_path": event_path, "next_action": "Send the approved response.", "updated_at": now}
        elif action == "mark_as_sent":
            if not metadata.get("response_approved_at"):
                raise ValueError("The response must be approved before it is marked as sent.")
            self.validate_final_artifact(matter_id, str(metadata.get("response_approved_artifact_path") or ""))
            if artifact_path and artifact_path != metadata.get("response_approved_artifact_path"):
                raise ValueError("Delivery can record only the approved final artifact.")
            if metadata.get("response_sent_at"):
                event_missing = not metadata.get("response_delivery_event_path") or not self.matters.vault.exists(metadata["response_delivery_event_path"])
                event_path = self._repair_event(matter_id, metadata, "response_delivery_event_path", "response_sent", "Response marked as sent", metadata["response_sent_at"], metadata.get("response_sent_by") or actor)
                if event_missing:
                    self.matters.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"response_delivery_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                    self.matters.index.rebuild()
                return self.matters._action_result(action, matter_id, changed_paths, event_path, None, True)
            event_path = self.matters.append_event(matter_id, "response_sent", {"title": "Response marked as sent", "actor": actor, "artifact_path": metadata.get("response_approved_artifact_path")}, event_id=self.event_id(matter_id, "delivery"), timestamp=now)
            updates = {"response_sent_at": now, "response_sent_by": actor, "response_sent_artifact_path": metadata.get("response_approved_artifact_path"), "response_sent_artifact_id": metadata.get("response_approved_artifact_id"), "response_delivery_method": "outside_counsel_os", "response_delivery_note": note, "response_delivery_event_path": event_path, "next_action": "Complete required work, then close the matter.", "updated_at": now}
        elif action == "close_matter":
            if metadata.get("closed_at"):
                event_missing = not metadata.get("closure_event_path") or not self.matters.vault.exists(metadata["closure_event_path"])
                event_path = self._repair_event(matter_id, metadata, "closure_event_path", "matter_closed", "Matter closed", metadata["closed_at"], metadata.get("closed_by") or actor)
                if event_missing:
                    self.matters.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"closure_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                    self.matters.index.rebuild()
                return self.matters._action_result(action, matter_id, changed_paths, event_path, None, True)
            if not metadata.get("response_sent_at"):
                raise ValueError("The response must be sent before the matter can close.")
            work_state = self.matters.matter_state.resolve(
                {**matter, **metadata}, self.matters.index.list_work_items(matter_id)
            )
            if work_state["execution_state"] in {"queued", "running"}:
                raise ValueError(
                    "Stop or finish active research before closing the matter."
                )
            required = [item for item in self.matters.index.list_work_items(matter_id) if item["required"] and item["status"] not in {"done", "closed"}]
            if required:
                raise ValueError(f"Complete required work before closing the matter: {', '.join(str(item['title']) for item in required)}.")
            event_path = self.matters.append_event(matter_id, "matter_closed", {"title": "Matter closed", "actor": actor}, event_id=self.event_id(matter_id, "closure"), timestamp=now)
            updates = {"status": "closed", "closed_at": now, "closed_by": actor, "closure_event_path": event_path, "next_action": "No active action. Reopen if facts, law, or policy change.", "updated_at": now}
        else:
            raise ValueError(f"Unknown matter action: {action}")
        matter_path = f"{matter['path']}/matter.md"
        self.matters.vault.update_markdown(matter_path, metadata_updates=updates)
        changed_paths.extend([matter_path, event_path])
        if action == "approve_response" and work_item_id:
            changed_paths.extend(self.matters.complete_work_item(matter_id, work_item_id, actor=actor, rebuild=False)["changed_paths"])
        self.matters.index.rebuild()
        return self.matters._action_result(action, matter_id, changed_paths, event_path, work_item_id, already_recorded)

    def closure_prerequisite(self, matter_id: str) -> str | None:
        """Return the first canonical prerequisite that prevents closure."""
        matter = self.matters.get(matter_id)
        if matter.get("status") == "closed":
            return None
        if not matter.get("current_work_product_final_path"):
            return "Finalize the current work product before closing the matter."
        if not matter.get("response_approved_at"):
            return "Approve the current final response before closing the matter."
        if not matter.get("response_sent_at"):
            return "Record manual delivery before closing the matter."
        work_items = self.matters.index.list_work_items(matter_id)
        work_state = self.matters.matter_state.resolve(matter, work_items)
        if work_state["execution_state"] in {"queued", "running"}:
            return "Stop or finish active research before closing the matter."
        required = [
            item for item in work_items
            if item["required"] and item["status"] not in {"done", "closed"}
        ]
        if required:
            return (
                "Complete required work before closing the matter: "
                f"{', '.join(str(item['title']) for item in required)}."
            )
        return None

    def note_durable_decision_recorded(self, matter_id: str) -> None:
        matter = self.matters._require_matter(matter_id)
        metadata = self.matters._matter_metadata(matter)
        next_action = str(metadata.get("next_action") or matter.get("next_action") or "")
        if matter["status"] == "respond" and not metadata.get("response_approved_at"):
            next_action = "Approve the response."
        elif matter["status"] == "respond":
            next_action = "Send the approved response."
        elif matter["status"] == "explore":
            next_action = "Create work product based on the chosen path."
        self.matters.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"durable_decision_needed": False, "next_action": next_action, "updated_at": iso_now()})
        self.matters.index.rebuild()

    def validate_final_artifact(self, matter_id: str, artifact_path: str) -> dict[str, Any]:
        matter = self.matters._require_matter(matter_id)
        base, supplied = PurePosixPath(matter["path"]), PurePosixPath(artifact_path)
        if supplied.suffix.lower() != ".md" or base not in supplied.parents or not self.matters.vault.exists(artifact_path):
            raise ValueError("The approved artifact must be a Markdown final owned by this matter.")
        document = self.matters.vault.read_markdown(artifact_path)
        metadata = document["metadata"]
        legacy_final = supplied.parent == base / "work-product" / "final"
        if (metadata.get("matter_id") != matter_id or metadata.get("state") != "final" or not metadata.get("immutable") or not metadata.get("final_id") or (metadata.get("record_type") != "work_product" and not legacy_final)):
            raise ValueError("The approved artifact must be one immutable final Markdown work product owned by this matter.")
        current_draft_path = str(self.matters._matter_metadata(matter).get("current_work_product_draft_path") or "")
        if not current_draft_path or metadata.get("source_draft") != current_draft_path:
            raise ValueError("The approved artifact must be the final created from the current work-product draft.")
        current_hash = hashlib.sha256(self.matters.vault.read_markdown(current_draft_path)["content"].encode("utf-8")).hexdigest()
        if metadata.get("source_content_hash") != current_hash:
            raise ValueError("The approved artifact no longer matches the current work-product draft content.")
        return {"path": artifact_path, "final_id": metadata["final_id"]}

    def current_final_path(self, matter: dict[str, Any], metadata: dict[str, Any], *, backfill: bool) -> str | None:
        base = str(matter["path"])
        current_draft_path = str(metadata.get("current_work_product_draft_path") or "") or None
        saved_path = str(metadata.get("current_work_product_final_path") or "")
        if saved_path:
            try:
                validated = self.validate_final_artifact(str(matter["matter_id"]), saved_path)
                if (not metadata.get("current_work_product_final_id") or metadata.get("current_work_product_final_id") == validated["final_id"]):
                    return saved_path
            except (OSError, ValueError, KeyError):
                pass
        fallback = self._legacy_final_path(base, current_draft_path)
        if fallback and backfill:
            final_id = self.matters.vault.read_markdown(fallback)["metadata"].get("final_id")
            self.matters.vault.update_markdown(f"{base}/matter.md", metadata_updates={"current_work_product_final_path": fallback, "current_work_product_final_id": final_id, "updated_at": iso_now()})
        return fallback

    def _legacy_final_path(self, base: str, current_draft_path: str | None) -> str | None:
        if not current_draft_path or not self.matters.vault.exists(current_draft_path):
            return None
        current_hash = hashlib.sha256(self.matters.vault.read_markdown(current_draft_path)["content"].encode("utf-8")).hexdigest()
        candidates: list[tuple[tuple[int, str], float, str]] = []
        for path in self.matters.vault.iter_files(base, {".md"}):
            document = self.matters.vault.read_markdown(self.matters.vault.relative(path))
            metadata = document["metadata"]
            if (metadata.get("record_type") == "work_product" and metadata.get("state") == "final" and metadata.get("immutable") and metadata.get("final_id") and metadata.get("source_draft") == current_draft_path and metadata.get("source_content_hash") == current_hash):
                candidates.append((self.matters._event_sort_key(metadata.get("finalized_at")), float(document.get("updated_at") or 0), document["path"]))
        return max(candidates)[2] if candidates else None

    @staticmethod
    def event_id(matter_id: str, suffix: str) -> str:
        safe_matter = "".join(char if char.isalnum() or char == "-" else "-" for char in matter_id)
        return f"EVT-{safe_matter}-{suffix.upper()}"

    def _repair_event(self, matter_id: str, metadata: dict[str, Any], field: str, event_type: str, title: str, timestamp: str, actor: str) -> str:
        suffix = {"response_approved": "approval", "response_sent": "delivery", "matter_closed": "closure"}[event_type]
        expected = self.matters.append_event(matter_id, event_type, {"title": title, "actor": actor}, event_id=self.event_id(matter_id, suffix), timestamp=timestamp)
        stored = metadata.get(field)
        return stored if stored and self.matters.vault.exists(stored) else expected
