from __future__ import annotations

import hashlib
from typing import TYPE_CHECKING, Any

from app.models.api import WorkItemCreate
from app.utils.ids import new_id
from app.utils.time import iso_now

if TYPE_CHECKING:
    from app.services.matters import MatterService


class MatterWorkItemService:
    """Owns Markdown work-item records while MatterService remains the facade."""

    def __init__(self, matters: MatterService):
        self.matters = matters

    def create(self, request: WorkItemCreate, *, rebuild: bool = True) -> dict[str, Any]:
        matter = self.matters._require_matter(request.matter_id, allow_unindexed=True)
        source_action_key = str(request.source_action_key or "") or None
        if source_action_key:
            existing = self._for_source_action(matter["path"], source_action_key)
            if existing is not None:
                return existing
            digest = hashlib.sha256(
                f"{request.matter_id}\0{source_action_key}".encode("utf-8")
            ).hexdigest()[:12]
            work_item_id = f"WI-{digest}"
        else:
            work_item_id = new_id("WI")
        path = f"{matter['path']}/work-items/{work_item_id}.md"
        if self.matters.vault.exists(path):
            raise ValueError("The work-item retry key conflicts with an existing record.")
        now = iso_now()
        metadata = {
            "work_item_id": work_item_id, "matter_id": request.matter_id,
            "issue_id": request.issue_id, "type": request.item_type,
            "title": request.title, "description": request.description,
            "status": request.status, "priority": request.priority,
            "owner": request.owner, "due_at": request.due_at,
            "required": request.required, "created_at": now, "completed_at": None,
            "source_action_key": source_action_key,
        }
        self.matters.vault.write_markdown(path, f"# {request.title}\n\n{request.description}\n", metadata)
        if rebuild:
            self.matters.append_event(
                request.matter_id, "work_item_created",
                {"work_item_id": work_item_id, "title": request.title}, rebuild=False,
            )
            self.matters.index.rebuild()
        return {**metadata, "path": path}

    def create_review(
        self, request: WorkItemCreate, *, review_packet_id: str,
        decision_id: str | None = None, rebuild: bool = True,
    ) -> dict[str, Any]:
        item = self.create(request, rebuild=False)
        self.matters.vault.update_markdown(item["path"], metadata_updates={
            "review_packet_id": review_packet_id, "decision_id": decision_id,
        })
        self.matters.append_event(
            request.matter_id, "review_work_created", {
                "title": request.title, "work_item_id": item["work_item_id"],
                "review_packet_id": review_packet_id, "decision_id": decision_id,
            }, rebuild=False,
        )
        if rebuild:
            self.matters.index.rebuild()
        return {**item, "review_packet_id": review_packet_id, "decision_id": decision_id}

    def complete_open(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
        completed: list[str] = []
        for item in self.matters.index.list_work_items(matter_id):
            if item["status"] in {"done", "closed"} or (item_type and item["item_type"] != item_type):
                continue
            self.matters.vault.update_markdown(
                item["path"], metadata_updates={"status": "done", "completed_at": iso_now()},
            )
            completed.append(item["work_item_id"])
        if completed:
            self.matters.index.rebuild()
        return completed

    def complete(
        self, matter_id: str, work_item_id: str, *, actor: str, rebuild: bool = True, action_actor: dict | None = None,
    ) -> dict[str, Any]:
        from app.services.dossier import WORKSPACE_LOCK
        with WORKSPACE_LOCK:
            self.matters._require_matter(matter_id)
            actor = actor.strip()
            if not actor:
                raise ValueError("actor is required.")
            item = self.find(matter_id, work_item_id)
            metadata = self.matters.vault.read_markdown(item["path"])["metadata"]
            if metadata.get("choice_review_for"):
                from app.services.workspace import WorkspaceService
                issue = next((value for value in WorkspaceService(self.matters.vault, self.matters).issues(matter_id)
                              if value["issue_id"] == metadata["choice_review_for"]), {})
                if issue.get("disposition") not in {"resolved", "risk_accepted", "not_applicable"}:
                    raise ValueError("Review the follow-up and record the issue conclusion before completing this review.")
            already = item["status"] in {"done", "closed"}
            changed_paths: list[str] = []
            if not already:
                self.matters.vault.update_markdown(item["path"], metadata_updates={
                    "status": "done", "completed_at": iso_now(), "completed_by": actor,
                    "action_actor": action_actor,
                })
                changed_paths.append(item["path"])
            if rebuild and changed_paths:
                self.matters.index.rebuild()
            return self.matters._action_result(
                "complete_work_item", matter_id, changed_paths, None, work_item_id, already,
            )

    def assign(self, matter_id: str, work_item_id: str, *, owner: str, actor: str, action_actor: dict | None = None) -> dict[str, Any]:
        self.matters._require_matter(matter_id)
        owner, actor = owner.strip(), actor.strip()
        if not owner or not actor:
            raise ValueError("owner and actor are required.")
        from app.services.dossier import WORKSPACE_LOCK
        from app.utils.ids import new_id
        with WORKSPACE_LOCK:
            item = self.find(matter_id, work_item_id)
            self.matters.vault.update_markdown(item["path"], metadata_updates={
                "owner": owner, "owner_id": None, "assigned_by": actor, "assigned_at": iso_now(),
                "ownership_revision": new_id("OWN"), "ownership_action_key": new_id("assign"),
                "action_actor": action_actor,
            })
            self.matters.index.rebuild()
        return self.matters._action_result("assign_work_item", matter_id, [item["path"]], None, work_item_id, False)

    def prioritize(self, matter_id: str, work_item_id: str, *, priority: str, actor: str, action_actor: dict | None = None) -> dict[str, Any]:
        from app.services.dossier import WORKSPACE_LOCK
        with WORKSPACE_LOCK:
            self.matters._require_matter(matter_id)
            priority, actor = priority.strip(), actor.strip()
            if priority not in {"low", "normal", "high", "urgent"} or not actor:
                raise ValueError("A valid priority and actor are required.")
            item = self.find(matter_id, work_item_id)
            already = str(item.get("priority") or "normal") == priority
            changed_paths: list[str] = []
            if not already:
                self.matters.vault.update_markdown(item["path"], metadata_updates={
                    "priority": priority, "prioritized_by": actor, "prioritized_at": iso_now(),
                    "action_actor": action_actor,
                })
                changed_paths.append(item["path"])
                self.matters.index.rebuild()
            return self.matters._action_result(
                "prioritize_work_item", matter_id, changed_paths, None, work_item_id, already,
            )

    def find(self, matter_id: str, work_item_id: str) -> dict[str, Any]:
        item = next(
            (item for item in self.matters.index.list_work_items(matter_id)
             if item["work_item_id"] == work_item_id), None,
        )
        if not item:
            raise ValueError(f"Work item {work_item_id} does not belong to matter {matter_id}.")
        return item

    def _for_source_action(self, matter_path: str, source_action_key: str) -> dict[str, Any] | None:
        for path in self.matters.vault.iter_files(f"{matter_path}/work-items", {".md"}):
            document = self.matters.vault.read_markdown(self.matters.vault.relative(path))
            if document["metadata"].get("source_action_key") == source_action_key:
                return {**document["metadata"], "path": document["path"]}
        return None
