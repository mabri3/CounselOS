from __future__ import annotations

from pathlib import Path, PurePosixPath
from typing import TYPE_CHECKING, Any

from app.models.api import MatterCreate, WorkItemCreate
from app.services.index import IndexService
from app.services.matter_state import MatterStateService
from app.services.vault import VaultService
from app.services.workflow import WorkflowService
from app.utils.ids import new_id, slugify
from app.utils.time import iso_now

if TYPE_CHECKING:
    from app.services.dossier import DossierService


class MatterService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        workflow: WorkflowService,
        matter_state: MatterStateService,
    ):
        self.vault = vault
        self.index = index
        self.workflow = workflow
        self.matter_state = matter_state
        self._dossiers: DossierService | None = None

    def bind_dossiers(self, dossiers: DossierService) -> None:
        self._dossiers = dossiers

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
            matter["work_state"] = self.matter_state.resolve(matter, items)
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
            "durable_decision_needed": False,
            "response_approved_at": None,
            "response_sent_at": None,
            "closed_at": None,
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
        for directory in (
            "documents", "work-items", "research", "drafts", "decisions", "events", "conversations",
            "dossier-revisions", "mitigations", "work-product/draft", "work-product/final",
        ):
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
        matter_metadata = self.vault.read_markdown(f"{base}/matter.md")["metadata"]
        tree = self.vault.list_tree(base)
        self._label_conversations(tree)
        self._label_internal_records(tree)
        work_items = self.index.list_work_items(matter_id)
        decisions = [item for item in self.index.list_decisions() if item["matter_id"] == matter_id]
        events = self._recent_events(base)
        required = [
            item for item in work_items if item["required"] and item["status"] not in {"done", "closed"}
        ]
        work_state = self.matter_state.resolve(matter, work_items)
        dossier_orientation = self._dossiers.orientation(matter_id) if self._dossiers else {
            "summary": "",
            "decision_question": "",
            "open_questions": [],
        }
        orientation = {
            "headline": matter.get("next_action") or "Review the matter request.",
            "summary": dossier_orientation["summary"] or matter.get("description") or "",
            "decision_question": dossier_orientation["decision_question"] or matter.get("next_action") or "",
            "open_questions": dossier_orientation["open_questions"] or [item["title"] for item in required[:4]],
            "why_now": self._why_now(matter, required, decisions),
            "next_action": work_state["next_action"],
            "attention": [item["title"] for item in required[:4]],
            "recent_changes": [event.get("title", event.get("event_type", "Update")) for event in events],
        }
        return {
            **matter,
            "durable_decision_needed": bool(matter_metadata.get("durable_decision_needed", False)),
            **{
                key: matter_metadata.get(key)
                for key in (
                    "response_approved_at", "response_approved_by",
                    "response_approved_artifact_path", "response_approved_artifact_id",
                    "response_approved_final_id",
                    "response_approval_event_path", "response_sent_at", "response_sent_by",
                    "response_sent_artifact_path", "response_sent_artifact_id",
                    "response_delivery_method", "response_delivery_note",
                    "response_delivery_event_path", "closed_at", "closed_by",
                    "closure_event_path",
                )
            },
            "work_state": work_state,
            "orientation": orientation,
            "work_items": work_items,
            "decisions": decisions,
            "tree": tree,
            "events": events,
        }
    def move_stage(self, matter_id: str, stage: str, *, reason: str = "", actor: str = "user") -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        stage = self.workflow.validate(stage)
        if stage == "closed" and matter["status"] != "closed":
            raise ValueError("Use the close matter action so delivery and required work are checked.")
        path = f"{matter['path']}/matter.md"
        self.vault.update_markdown(
            path,
            metadata_updates={
                "status": stage,
                "next_action": self.matter_state.default_next_action(stage),
                "closed_at": None if matter["status"] == "closed" else self._matter_metadata(matter).get("closed_at"),
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

    def perform_action(
        self,
        matter_id: str,
        action: str,
        *,
        actor: str,
        artifact_path: str | None = None,
        work_item_id: str | None = None,
        note: str | None = None,
    ) -> dict[str, Any]:
        actor = actor.strip()
        if not actor:
            raise ValueError("actor is required.")
        matter = self._require_matter(matter_id)
        metadata = self._matter_metadata(matter)
        if matter["status"] != "respond":
            recorded_field = {
                "approve_response": "response_approved_at",
                "mark_as_sent": "response_sent_at",
                "close_matter": "closed_at",
            }.get(action)
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
                    approval_item = self._find_work_item(matter_id, work_item_id)
                    if approval_item["item_type"] != "approval":
                        raise ValueError("The selected work item is not an approval work item.")
                already_recorded = True
                event_missing = not metadata.get("response_approval_event_path") or not self.vault.exists(metadata["response_approval_event_path"])
                event_path = self._repair_lifecycle_event(
                    matter_id, metadata, "response_approval_event_path", "response_approved",
                    "Response approved", metadata["response_approved_at"],
                    metadata.get("response_approved_by") or actor,
                )
                if event_missing:
                    self.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"response_approval_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                if work_item_id and approval_item["status"] not in {"done", "closed"}:
                    completed = self.complete_work_item(matter_id, work_item_id, actor=actor)
                    changed_paths.extend(completed["changed_paths"])
                return self._action_result(action, matter_id, changed_paths, event_path, work_item_id, True)
            if not artifact_path:
                raise ValueError("A final Markdown response artifact is required for approval.")
            final = self._validate_final_artifact(matter_id, artifact_path)
            if work_item_id:
                approval_item = self._find_work_item(matter_id, work_item_id)
                if approval_item["item_type"] != "approval":
                    raise ValueError("The selected work item is not an approval work item.")
            event_path = self.append_event(
                matter_id, "response_approved", {"title": "Response approved", "actor": actor, "artifact_path": final["path"]},
                event_id=self._lifecycle_event_id(matter_id, "approval"), timestamp=now,
            )
            updates = {
                "response_approved_at": now,
                "response_approved_by": actor,
                "response_approved_artifact_path": final["path"],
                "response_approved_artifact_id": final["final_id"],
                "response_approved_final_id": final["final_id"],
                "response_approval_event_path": event_path,
                "next_action": "Send the approved response.",
                "updated_at": now,
            }
        elif action == "mark_as_sent":
            if not metadata.get("response_approved_at"):
                raise ValueError("The response must be approved before it is marked as sent.")
            if metadata.get("response_sent_at"):
                already_recorded = True
                event_missing = not metadata.get("response_delivery_event_path") or not self.vault.exists(metadata["response_delivery_event_path"])
                event_path = self._repair_lifecycle_event(
                    matter_id, metadata, "response_delivery_event_path", "response_sent",
                    "Response marked as sent", metadata["response_sent_at"],
                    metadata.get("response_sent_by") or actor,
                )
                if event_missing:
                    self.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"response_delivery_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                return self._action_result(action, matter_id, changed_paths, event_path, None, True)
            event_path = self.append_event(
                matter_id, "response_sent", {"title": "Response marked as sent", "actor": actor, "artifact_path": metadata.get("response_approved_artifact_path")},
                event_id=self._lifecycle_event_id(matter_id, "delivery"), timestamp=now,
            )
            updates = {
                "response_sent_at": now,
                "response_sent_by": actor,
                "response_sent_artifact_path": metadata.get("response_approved_artifact_path"),
                "response_sent_artifact_id": metadata.get("response_approved_artifact_id"),
                "response_delivery_method": "outside_counsel_os",
                "response_delivery_note": note,
                "response_delivery_event_path": event_path,
                "next_action": "Complete required work, then close the matter.",
                "updated_at": now,
            }
        elif action == "close_matter":
            if metadata.get("closed_at"):
                already_recorded = True
                event_missing = not metadata.get("closure_event_path") or not self.vault.exists(metadata["closure_event_path"])
                event_path = self._repair_lifecycle_event(
                    matter_id, metadata, "closure_event_path", "matter_closed", "Matter closed",
                    metadata["closed_at"], metadata.get("closed_by") or actor,
                )
                if event_missing:
                    self.vault.update_markdown(f"{matter['path']}/matter.md", metadata_updates={"closure_event_path": event_path})
                    changed_paths.extend([f"{matter['path']}/matter.md", event_path])
                return self._action_result(action, matter_id, changed_paths, event_path, None, True)
            if not metadata.get("response_sent_at"):
                raise ValueError("The response must be sent before the matter can close.")
            required = [
                item for item in self.index.list_work_items(matter_id)
                if item["required"] and item["status"] not in {"done", "closed"}
            ]
            if required:
                titles = ", ".join(str(item["title"]) for item in required)
                raise ValueError(f"Complete required work before closing the matter: {titles}.")
            event_path = self.append_event(
                matter_id, "matter_closed", {"title": "Matter closed", "actor": actor},
                event_id=self._lifecycle_event_id(matter_id, "closure"), timestamp=now,
            )
            updates = {
                "status": "closed",
                "closed_at": now,
                "closed_by": actor,
                "closure_event_path": event_path,
                "next_action": "No active action. Reopen if facts, law, or policy change.",
                "updated_at": now,
            }
        else:
            raise ValueError(f"Unknown matter action: {action}")

        matter_path = f"{matter['path']}/matter.md"
        self.vault.update_markdown(matter_path, metadata_updates=updates)
        changed_paths.extend([matter_path, event_path])
        if action == "approve_response" and work_item_id:
            completed = self.complete_work_item(matter_id, work_item_id, actor=actor, rebuild=False)
            changed_paths.extend(completed["changed_paths"])
        self.index.rebuild()
        return self._action_result(action, matter_id, changed_paths, event_path, work_item_id, already_recorded)

    def note_durable_decision_recorded(self, matter_id: str) -> None:
        matter = self._require_matter(matter_id)
        metadata = self._matter_metadata(matter)
        next_action = str(metadata.get("next_action") or matter.get("next_action") or "")
        if matter["status"] == "respond" and not metadata.get("response_approved_at"):
            next_action = "Approve the response."
        elif matter["status"] == "respond":
            next_action = "Send the approved response."
        elif matter["status"] == "explore":
            next_action = "Create work product based on the chosen path."
        self.vault.update_markdown(
            f"{matter['path']}/matter.md",
            metadata_updates={
                "durable_decision_needed": False,
                "next_action": next_action,
                "updated_at": iso_now(),
            },
        )
        self.index.rebuild()
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

    def create_review_work_item(
        self,
        request: WorkItemCreate,
        *,
        review_packet_id: str,
        decision_id: str | None = None,
        rebuild: bool = True,
    ) -> dict[str, Any]:
        item = self.create_work_item(request, rebuild=False)
        self.vault.update_markdown(
            item["path"],
            metadata_updates={
                "review_packet_id": review_packet_id,
                "decision_id": decision_id,
            },
        )
        self.append_event(
            request.matter_id,
            "review_work_created",
            {
                "title": request.title,
                "work_item_id": item["work_item_id"],
                "review_packet_id": review_packet_id,
                "decision_id": decision_id,
            },
            rebuild=False,
        )
        if rebuild:
            self.index.rebuild()
        return {**item, "review_packet_id": review_packet_id, "decision_id": decision_id}
    def complete_open_work_items(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
        completed = self._complete_open_work_items(matter_id, item_type=item_type)
        if completed:
            self.index.rebuild()
        return completed

    def complete_work_item(
        self, matter_id: str, work_item_id: str, *, actor: str, rebuild: bool = True
    ) -> dict[str, Any]:
        self._require_matter(matter_id)
        actor = actor.strip()
        if not actor:
            raise ValueError("actor is required.")
        item = self._find_work_item(matter_id, work_item_id)
        already = item["status"] in {"done", "closed"}
        changed_paths: list[str] = []
        if not already:
            completed_at = iso_now()
            self.vault.update_markdown(item["path"], metadata_updates={"status": "done", "completed_at": completed_at, "completed_by": actor})
            changed_paths.append(item["path"])
        if rebuild and changed_paths:
            self.index.rebuild()
        return {
            "action": "complete_work_item", "matter": self.get(matter_id),
            "changed_paths": changed_paths, "event_path": None,
            "work_item_id": work_item_id, "already_recorded": already,
        }

    def _complete_open_work_items(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
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
        return completed
    def append_event(
        self,
        matter_id: str,
        event_type: str,
        payload: dict[str, Any],
        *,
        rebuild: bool = False,
        event_id: str | None = None,
        timestamp: str | None = None,
    ) -> str:
        matter = self._require_matter(matter_id, allow_unindexed=True)
        event_id = event_id or new_id("EVT")
        timestamp = timestamp or iso_now()
        title = payload.get("title") or event_type.replace("_", " ").title()
        path = f"{matter['path']}/events/{timestamp[:10]}-{event_id}.md"
        if self.vault.exists(path):
            return path
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
    def _matter_metadata(self, matter: dict[str, Any]) -> dict[str, Any]:
        return self.vault.read_markdown(f"{matter['path']}/matter.md")["metadata"]
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

    def _label_conversations(self, tree: list[dict[str, Any]]) -> None:
        folder = next(
            (node for node in tree if node["type"] == "folder" and node["name"] == "conversations"),
            None,
        )
        for node in (folder or {}).get("children", []):
            if node["type"] != "file" or node.get("extension") != ".md":
                continue
            document = self.vault.read_markdown(node["path"])
            if document["metadata"].get("record_type") == "chat_transcript":
                node["label"] = document["metadata"].get("title") or "Matter chat"
                node["record_type"] = "chat_transcript"

    def _label_internal_records(self, tree: list[dict[str, Any]]) -> None:
        for node in tree:
            if node["type"] == "folder":
                self._label_internal_records(node.get("children", []))
                continue
            if node.get("extension") != ".md":
                continue
            document = self.vault.read_markdown(node["path"])
            metadata = document["metadata"]
            if metadata.get("record_type") == "work_product":
                node["record_type"] = "work_product"
                node["state"] = metadata.get("state")
                node["label"] = metadata.get("title") or node["name"]
                continue
            if not (
                node["name"].startswith(("WI-", "EVT-", "DOS-", "RES-"))
                or "/work-product/" in node["path"]
                or "/events/" in node["path"]
                or "/research/runs/" in node["path"]
                or "/documents/batches/" in node["path"]
            ):
                continue
            node["record_type"] = metadata.get("record_type", "matter_record")
            if metadata.get("state") is not None:
                node["state"] = metadata.get("state")
            node["label"] = (
                metadata.get("title")
                or metadata.get("summary")
                or ("Background research" if metadata.get("record_type") == "research_run" else None)
                or ("First-pass research" if metadata.get("research_id") else None)
                or ("Uploaded document set" if metadata.get("record_type") == "document_batch" else None)
                or str(metadata.get("event_type", "Matter update")).replace("_", " ").title()
                or "Matter record"
            )

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

    def _validate_final_artifact(self, matter_id: str, artifact_path: str) -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        base = PurePosixPath(matter["path"])
        supplied = PurePosixPath(artifact_path)
        if supplied.suffix.lower() != ".md" or base not in supplied.parents or not self.vault.exists(artifact_path):
            raise ValueError("The approved artifact must be a Markdown final owned by this matter.")
        document = self.vault.read_markdown(artifact_path)
        metadata = document["metadata"]
        legacy_final = supplied.parent == base / "work-product" / "final"
        if (
            metadata.get("matter_id") != matter_id
            or metadata.get("state") != "final"
            or not metadata.get("immutable")
            or not metadata.get("final_id")
            or (metadata.get("record_type") != "work_product" and not legacy_final)
        ):
            raise ValueError("The approved artifact must be one immutable final Markdown work product owned by this matter.")
        return {"path": artifact_path, "final_id": metadata["final_id"]}

    def _find_work_item(self, matter_id: str, work_item_id: str) -> dict[str, Any]:
        item = next(
            (item for item in self.index.list_work_items(matter_id) if item["work_item_id"] == work_item_id),
            None,
        )
        if not item:
            raise ValueError(f"Work item {work_item_id} does not belong to matter {matter_id}.")
        return item

    @staticmethod
    def _lifecycle_event_id(matter_id: str, suffix: str) -> str:
        safe_matter = "".join(char if char.isalnum() or char == "-" else "-" for char in matter_id)
        return f"EVT-{safe_matter}-{suffix.upper()}"

    def _repair_lifecycle_event(
        self, matter_id: str, metadata: dict[str, Any], field: str, event_type: str,
        title: str, timestamp: str, actor: str,
    ) -> str:
        suffix = {"response_approved": "approval", "response_sent": "delivery", "matter_closed": "closure"}[event_type]
        expected = self.append_event(
            matter_id, event_type, {"title": title, "actor": actor},
            event_id=self._lifecycle_event_id(matter_id, suffix), timestamp=timestamp,
        )
        stored = metadata.get(field)
        return stored if stored and self.vault.exists(stored) else expected

    def _action_result(
        self, action: str, matter_id: str, changed_paths: list[str], event_path: str | None,
        work_item_id: str | None, already_recorded: bool,
    ) -> dict[str, Any]:
        matter = self.get(matter_id)
        return {
            "action": action, "matter": matter,
            "changed_paths": list(dict.fromkeys(path for path in changed_paths if path)),
            "event_path": event_path, "work_item_id": work_item_id,
            "already_recorded": already_recorded,
        }
