from __future__ import annotations

from pathlib import Path
from typing import Any

from app.models.api import MatterCreate, WorkItemCreate
from app.services.index import IndexService
from app.services.vault import VaultService
from app.services.workflow import WorkflowService
from app.utils.ids import new_id, slugify
from app.utils.time import iso_now


class MatterService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        workflow: WorkflowService,
    ):
        self.vault = vault
        self.index = index
        self.workflow = workflow
    def list(self) -> list[dict[str, Any]]:
        matters = self.index.list_matters()
        work_items = self.index.list_work_items()
        by_matter: dict[str, list[dict[str, Any]]] = {}
        for item in work_items:
            by_matter.setdefault(item["matter_id"], []).append(item)
        for matter in matters:
            items = by_matter.get(matter["matter_id"], [])
            matter["open_work_items"] = sum(item["status"] not in {"done", "closed"} for item in items)
            matter["required_work_items"] = sum(
                item["required"] and item["status"] not in {"done", "closed"} for item in items
            )
        return matters
    def create(self, request: MatterCreate) -> dict[str, Any]:
        matter_id = new_id("MAT")
        folder_name = f"{slugify(request.title)}-{matter_id[-6:]}"
        base = Path("03_Matters") / folder_name
        now = iso_now()
        matter_metadata = {
            "matter_id": matter_id,
            "title": request.title,
            "description": request.description,
            "matter_type": request.matter_type,
            "product_area": request.product_area,
            "business_team": request.business_team,
            "requester": request.requester,
            "legal_owner": request.legal_owner,
            "business_owner": request.business_owner,
            "status": "intake",
            "priority": request.priority,
            "risk_level": request.risk_level,
            "target_date": request.target_date,
            "jurisdiction_scope": request.jurisdiction_scope,
            "privilege": request.privilege,
            "next_action": "Orient to the request and identify the first missing facts.",
            "created_at": now,
            "updated_at": now,
        }
        self.vault.write_markdown(base / "matter.md", "# Matter\n", matter_metadata)
        self.vault.write_markdown(
            base / "request.md",
            f"# Original Request\n\n{request.request_text}\n",
            {
                "request_id": new_id("REQ"),
                "matter_id": matter_id,
                "original_text_preserved": True,
                "immutable": True,
                "received_at": now,
                "requester": request.requester,
                "business_objective": request.description,
                "requested_launch_date": request.target_date,
                "urgency": request.priority,
            },
        )
        self.vault.write_markdown(
            base / "participants.md",
            "# Participants\n\nAdd the people who provide facts, own the product, or make the decision.\n",
            {
                "matter_id": matter_id,
                "requester": request.requester,
                "legal_owner": request.legal_owner,
                "business_owner": request.business_owner,
            },
        )
        self.vault.write_markdown(
            base / "facts.md",
            "# Known Facts\n\n## Missing Facts\n\n- [ ] What business outcome is required?\n- [ ] What is the intended launch timing?\n",
            {"matter_id": matter_id, "record_type": "facts"},
        )
        self.vault.write_markdown(
            base / "issues.md",
            "# Issues\n\nThe intake agent or lawyer will decompose the request here.\n",
            {"matter_id": matter_id, "record_type": "issues"},
        )
        self.vault.write_markdown(
            base / "recommendations.md",
            "# Recommendations\n\nNo recommendation has been drafted yet.\n",
            {"matter_id": matter_id, "record_type": "recommendations"},
        )
        for directory in ("documents", "work-items", "research", "drafts", "decisions", "events"):
            self.vault.resolve(base / directory).mkdir(parents=True, exist_ok=True)
        self.create_work_item(
            WorkItemCreate(
                matter_id=matter_id,
                title="Orient to the request",
                description="Confirm the business objective, timing, and facts needed to frame the legal work.",
                item_type="question",
                priority=request.priority,
                owner=request.legal_owner,
                required=True,
            ),
            rebuild=False,
        )
        self.append_event(
            matter_id,
            "matter_created",
            {"title": request.title, "source": "manual_intake"},
            rebuild=False,
        )
        self.index.rebuild()
        return self.get(matter_id)
    def get(self, matter_id: str) -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        base = matter["path"]
        work_items = self.index.list_work_items(matter_id)
        decisions = [item for item in self.index.list_decisions() if item["matter_id"] == matter_id]
        events = self._recent_events(base)
        required = [
            item for item in work_items if item["required"] and item["status"] not in {"done", "closed"}
        ]
        next_work = next((item for item in work_items if item["status"] not in {"done", "closed"}), None)
        orientation = {
            "headline": matter.get("next_action") or "Review the matter request.",
            "why_now": self._why_now(matter, required, decisions),
            "next_action": next_work["title"] if next_work else matter.get("next_action"),
            "attention": [item["title"] for item in required[:4]],
            "recent_changes": [event.get("title", event.get("event_type", "Update")) for event in events],
        }
        return {
            **matter,
            "orientation": orientation,
            "work_items": work_items,
            "decisions": decisions,
            "tree": self.vault.list_tree(base),
            "events": events,
        }
    def move_stage(self, matter_id: str, stage: str, *, reason: str = "", actor: str = "user") -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        stage = self.workflow.validate(stage)
        path = f"{matter['path']}/matter.md"
        next_actions = {
            "intake": "Complete orientation and identify missing facts.",
            "research": "Run or supervise first-pass research.",
            "explore": "Review the research packet and choose the legal path to test.",
            "generate": "Generate the work product that supports the recommended path.",
            "respond": "Review, decide, and deliver the response.",
            "closed": "No active action. Reopen if facts, law, or policy change.",
        }
        self.vault.update_markdown(
            path,
            metadata_updates={
                "status": stage,
                "next_action": next_actions[stage],
                "updated_at": iso_now(),
            },
        )
        self.append_event(
            matter_id,
            "stage_changed",
            {"from": matter["status"], "to": stage, "reason": reason, "actor": actor},
            rebuild=False,
        )
        self.index.rebuild()
        return self.get(matter_id)
    def create_work_item(self, request: WorkItemCreate, *, rebuild: bool = True) -> dict[str, Any]:
        matter = self._require_matter(request.matter_id, allow_unindexed=True)
        work_item_id = new_id("WI")
        path = f"{matter['path']}/work-items/{work_item_id}.md"
        now = iso_now()
        metadata = {
            "work_item_id": work_item_id,
            "matter_id": request.matter_id,
            "issue_id": request.issue_id,
            "type": request.item_type,
            "title": request.title,
            "description": request.description,
            "status": request.status,
            "priority": request.priority,
            "owner": request.owner,
            "due_at": request.due_at,
            "required": request.required,
            "created_at": now,
            "completed_at": None,
        }
        self.vault.write_markdown(path, f"# {request.title}\n\n{request.description}\n", metadata)
        if rebuild:
            self.append_event(
                request.matter_id,
                "work_item_created",
                {"work_item_id": work_item_id, "title": request.title},
                rebuild=False,
            )
            self.index.rebuild()
        return {**metadata, "path": path}
    def complete_open_work_items(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
        completed: list[str] = []
        for item in self.index.list_work_items(matter_id):
            if item["status"] in {"done", "closed"}:
                continue
            if item_type and item["item_type"] != item_type:
                continue
            self.vault.update_markdown(
                item["path"],
                metadata_updates={"status": "done", "completed_at": iso_now()},
            )
            completed.append(item["work_item_id"])
        if completed:
            self.index.rebuild()
        return completed
    def append_event(
        self,
        matter_id: str,
        event_type: str,
        payload: dict[str, Any],
        *,
        rebuild: bool = False,
    ) -> str:
        matter = self._require_matter(matter_id, allow_unindexed=True)
        event_id = new_id("EVT")
        timestamp = iso_now()
        title = payload.get("title") or event_type.replace("_", " ").title()
        path = f"{matter['path']}/events/{timestamp[:10]}-{event_id}.md"
        self.vault.write_markdown(
            path,
            f"# {title}\n\n```json\n{self._pretty_payload(payload)}\n```\n",
            {
                "event_id": event_id,
                "matter_id": matter_id,
                "event_type": event_type,
                "actor_type": payload.get("actor", "system"),
                "timestamp": timestamp,
                "title": title,
            },
        )
        if rebuild:
            self.index.rebuild()
        return path
    def matter_path(self, matter_id: str) -> str:
        return self._require_matter(matter_id)["path"]
    def _require_matter(self, matter_id: str, *, allow_unindexed: bool = False) -> dict[str, Any]:
        matter = self.index.get_matter(matter_id)
        if matter:
            return matter
        if allow_unindexed:
            matters_root = self.vault.resolve("03_Matters")
            for path in matters_root.glob("*/matter.md") if matters_root.exists() else []:
                document = self.vault.read_markdown(self.vault.relative(path))
                if document["metadata"].get("matter_id") == matter_id:
                    return {
                        "matter_id": matter_id,
                        "path": self.vault.relative(path.parent),
                        **document["metadata"],
                    }
        raise KeyError(f"Matter not found: {matter_id}")
    def _recent_events(self, base: str) -> list[dict[str, Any]]:
        events_dir = self.vault.resolve(f"{base}/events")
        if not events_dir.exists():
            return []
        events: list[dict[str, Any]] = []
        for path in sorted(events_dir.glob("*.md"), reverse=True)[:6]:
            events.append(self.vault.read_markdown(self.vault.relative(path))["metadata"])
        return events

    @staticmethod
    def _why_now(
        matter: dict[str, Any],
        required: list[dict[str, Any]],
        decisions: list[dict[str, Any]],
    ) -> str:
        stale = [decision for decision in decisions if decision["review_status"] != "fresh"]
        if stale:
            return f"{len(stale)} recorded decision(s) need review."
        if required:
            return f"{len(required)} required work item(s) remain open."
        if matter.get("target_date"):
            return f"Target date: {matter['target_date']}."
        return "The matter is active and ready for the next legal-workflow step."

    @staticmethod
    def _pretty_payload(payload: dict[str, Any]) -> str:
        import json

        return json.dumps(payload, indent=2, default=str)
