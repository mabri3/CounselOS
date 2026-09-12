from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, Any

from app.models.api import MatterCreate, WorkItemCreate
from app.services.index import IndexService
from app.services.matter_lifecycle import MatterLifecycleService
from app.services.matter_participants import MatterParticipantService
from app.services.matter_state import MatterStateService
from app.services.matter_work_items import MatterWorkItemService
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
        self._work_items = MatterWorkItemService(self)
        self._participants_service = MatterParticipantService(self)
        self._lifecycle = MatterLifecycleService(self)

    def transfer_continuity_owner(self, *, expected, recipient, actor, source_action_key):
        from app.models.continuity import ScopeSnapshot
        from app.services.dossier import WORKSPACE_LOCK
        from app.services.workspace import WorkspaceConflict, digest
        with WORKSPACE_LOCK:
            current = self.continuity_team.scope(expected.matter_id, work_item_id=expected.work_item_id)
            doc = self.vault.read_markdown(current["path"])
            meta = doc["metadata"]
            replay = meta.get("ownership_action_key") == source_action_key
            if replay:
                if current["owner_id"] != recipient.person_id:
                    raise WorkspaceConflict("The ownership action has a different recipient.", current["ownership_revision"], code="ownership_conflict")
            elif current["ownership_revision"] != expected.ownership_revision:
                raise WorkspaceConflict("A newer assignment exists. Prepare a new handoff.", current["ownership_revision"], code="ownership_conflict")
            else:
                owner_field = "legal_owner" if expected.kind == "matter" else "owner"
                meta.update({owner_field: recipient.display_name, owner_field + "_id": recipient.person_id,
                    "ownership_revision": digest([expected.ownership_revision, source_action_key]),
                    "ownership_action_key": source_action_key, "assigned_at": iso_now(),
                    "assigned_by": actor.display_name, "action_actor": actor.model_dump()})
                self.vault.write_markdown(doc["path"], doc["content"], meta)
            if expected.kind == "matter":
                path = self.matter_path(expected.matter_id) + "/participants.md"
                prior = self.vault.read_markdown(path) if self.vault.exists(path) else {"content": "# Participants\n", "metadata": {}}
                people = prior["metadata"].get("participants") or self._participants_service.list(self.matter_path(expected.matter_id))
                people = [dict(item) for item in people if item.get("role") != "legal_owner"]
                people.append({"name": recipient.display_name, "person_id": recipient.person_id, "role": "legal_owner"})
                body = "# Participants\n\n" + "\n".join(f"- **{item['name']}** — {item['role'].replace('_', ' ')}" for item in people) + "\n"
                self.vault.write_markdown(path, body, {**prior["metadata"], "participants": people,
                    "legal_owner": recipient.display_name, "legal_owner_id": recipient.person_id})
            self.index.rebuild()
            return ScopeSnapshot.model_validate(self.continuity_team.scope(expected.matter_id, work_item_id=expected.work_item_id))

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
            metadata = self._matter_metadata(matter)
            durable_matter = {**matter, **metadata}
            matter.update(metadata)
            current_final_path = self._lifecycle.current_final_path(
                durable_matter, metadata, backfill=False,
            )
            matter["open_work_items"] = sum(item["status"] not in {"done", "closed"} for item in items)
            matter["required_work_items"] = sum(
                item["required"] and item["status"] not in {"done", "closed"} for item in items
            )
            matter.update({
                "current_work_product_final_path": current_final_path,
                "response_approved_at": metadata.get("response_approved_at"),
                "response_sent_at": metadata.get("response_sent_at"),
                "closed_at": metadata.get("closed_at"),
            })
            matter["work_state"] = self.matter_state.resolve(
                durable_matter,
                items,
                current_final_path=current_final_path,
                required_open_count=matter["required_work_items"],
            )
            matter["consistency_issues"] = self.matter_state.consistency_issues(
                durable_matter,
                current_final_path=current_final_path,
                required_open_count=matter["required_work_items"],
                execution_state=matter["work_state"]["execution_state"],
            )
        return matters
    def create(self, request: MatterCreate, *, rebuild: bool = True) -> dict[str, Any]:
        source_action_key = str(request.source_action_key or "") or None
        if source_action_key:
            existing = self._matter_for_source_action(source_action_key, rebuild=rebuild)
            if existing is not None:
                return {**existing, "creation_already_recorded": True}
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
            "intake_state": "active",
            "active_agent_id": "intake-agent",
            "durable_decision_needed": False,
            "response_approved_at": None,
            "response_sent_at": None,
            "closed_at": None,
            "source_action_key": source_action_key,
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
                "record_type": "participants",
                "requester": request.requester,
                "legal_owner": request.legal_owner,
                "business_owner": request.business_owner,
                "participants": self._participants_service.structured(
                    requester=request.requester,
                    legal_owner=request.legal_owner,
                    business_owner=request.business_owner,
                ),
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
        if rebuild:
            self.index.rebuild()
            return {**self.get(matter_id), "creation_already_recorded": False}
        return {
            **matter_metadata,
            "path": str(base),
            "participants": self._participants_service.list(str(base)),
            "creation_already_recorded": False,
        }
    def get(self, matter_id: str) -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        base = matter["path"]
        matter_metadata = self.vault.read_markdown(f"{base}/matter.md")["metadata"]
        if self._complete_orientation_after_intake(matter_id, matter_metadata):
            matter = self._require_matter(matter_id)
        tree = self.vault.list_tree(base)
        self._exclude_research_run_records(tree)
        self._label_conversations(tree)
        self._label_internal_records(tree, legacy_root_path=f"{base}/work-product.md")
        work_items = self.index.list_work_items(matter_id)
        decisions = self.index.list_decisions(matter_id=matter_id)
        events = self._recent_events(base)
        required = [
            item for item in work_items if item["required"] and item["status"] not in {"done", "closed"}
        ]
        durable_matter = {**matter, **matter_metadata}
        current_draft_path = str(matter_metadata.get("current_work_product_draft_path") or "") or None
        current_final_path = self._lifecycle.current_final_path(
            durable_matter, matter_metadata, backfill=True,
        )
        if current_final_path and matter_metadata.get("current_work_product_final_path") != current_final_path:
            matter_metadata = self.vault.read_markdown(f"{base}/matter.md")["metadata"]
            self.index.rebuild()
        durable_matter["current_work_product_final_path"] = current_final_path
        required_open_count = len(required)
        work_state = self.matter_state.resolve(
            durable_matter,
            work_items,
            current_final_path=current_final_path,
            required_open_count=required_open_count,
        )
        consistency_issues = self.matter_state.consistency_issues(
            durable_matter,
            current_final_path=current_final_path,
            required_open_count=required_open_count,
            execution_state=work_state["execution_state"],
        )
        latest_research_path = self._latest_research_path(base, matter_metadata)
        participants = self._participants_service.list(base)
        recommendation = self._recommendation_state(base)
        dossier_orientation = self._dossiers.orientation(matter_id) if self._dossiers else {
            "summary": "",
            "decision_question": "",
            "open_questions": [],
        }
        open_questions = dossier_orientation["open_questions"] or [item["title"] for item in required[:4]]
        required_by_title = {str(item["title"]).strip().casefold(): item for item in required}
        open_question_items = []
        for position, question in enumerate(open_questions[:4]):
            item = required_by_title.get(str(question).strip().casefold())
            work_item_id = str(item["work_item_id"]) if item else None
            open_question_items.append({
                "id": work_item_id or f"question-{position + 1}",
                "text": str(question),
                "work_item_id": work_item_id,
            })
        orientation = {
            "headline": work_state["next_action"],
            "summary": dossier_orientation["summary"] or matter.get("description") or "",
            "decision_question": dossier_orientation["decision_question"] or matter.get("next_action") or "",
            "open_questions": open_questions,
            "open_question_items": open_question_items,
            "why_now": self._why_now(matter, required, decisions),
            "next_action": work_state["next_action"],
            "attention": [item["title"] for item in required[:4]],
            "recent_changes": [event.get("title", event.get("event_type", "Update")) for event in events],
        }
        intake = self._intake_status(matter_id)
        participant_roles = {
            item["role"]: item["name"]
            for item in participants
            if item.get("role") in {"requester", "legal_owner", "business_owner"}
        }
        return {
            **durable_matter,
            **{
                key: participant_roles.get(key, durable_matter.get(key, ""))
                for key in ("requester", "legal_owner", "business_owner")
            },
            "original_request": self._original_request(base, matter.get("description") or ""),
            "durable_decision_needed": bool(matter_metadata.get("durable_decision_needed", False)),
            **{
                key: matter_metadata.get(key)
                for key in (
                    "current_work_product_draft_path", "current_work_product_id",
                    "response_approved_at", "response_approved_by",
                    "response_approved_artifact_path", "response_approved_artifact_id",
                    "response_approved_final_id",
                    "response_approval_event_path", "response_sent_at", "response_sent_by",
                    "response_sent_artifact_path", "response_sent_artifact_id",
                    "response_delivery_method", "response_delivery_note",
                    "response_delivery_event_path", "closed_at", "closed_by",
                    "closure_event_path",
                    "current_work_product_final_path", "current_work_product_final_id",
                )
            },
            "current_work_product_final_path": current_final_path,
            "consistency_issues": consistency_issues,
            "latest_research_path": latest_research_path,
            "participants": participants,
            "recommendation": recommendation,
            "recommendation_review_needed": bool(
                recommendation.get("current_version_id")
                and current_draft_path
                and self.vault.exists(current_draft_path)
                and self.vault.read_markdown(current_draft_path)["metadata"].get("recommendation_version_id")
                != recommendation.get("current_version_id")
            ),
            "work_state": work_state,
            "orientation": orientation,
            "work_items": work_items,
            "decisions": decisions,
            "tree": tree,
            "events": events,
            "intake_answers": self._intake_answers(base),
            **intake,
        }

    def update_risk(self, matter_id: str, risk_level: str | None, *, actor: str) -> dict[str, Any]:
        matter = self._require_matter(matter_id)
        actor = actor.strip()
        if not actor:
            raise ValueError("actor is required.")
        value = (risk_level or "").strip() or None
        matter_path = f"{matter['path']}/matter.md"
        now = iso_now()
        self.vault.update_markdown(
            matter_path,
            metadata_updates={"risk_level": value, "risk_updated_at": now, "risk_updated_by": actor, "updated_at": now},
        )
        self.append_event(
            matter_id,
            "risk_updated",
            {"title": "Risk assessment updated", "actor": actor, "risk_level": value},
            rebuild=False,
        )
        self.index.rebuild()
        return self.get(matter_id)

    def _complete_orientation_after_intake(self, matter_id: str, matter_metadata: dict[str, Any]) -> bool:
        if str(matter_metadata.get("intake_state", "")).casefold() != "complete":
            return False
        changed = False
        for item in self.index.list_work_items(matter_id):
            if item["status"] in {"done", "closed"}:
                continue
            if str(item.get("title", "")).strip().casefold() != "orient to the request":
                continue
            self.vault.update_markdown(
                item["path"],
                metadata_updates={"status": "done", "completed_at": iso_now(), "completed_by": "system"},
            )
            changed = True
        if changed:
            self.index.rebuild()
        return changed

    def _original_request(self, base: str, fallback: str) -> str:
        request_path = f"{base}/request.md"
        if not self.vault.exists(request_path):
            return fallback.strip()
        content = self.vault.read_markdown(request_path)["content"].strip()
        lines = content.splitlines()
        if lines and lines[0].strip().casefold() == "# original request":
            content = "\n".join(lines[1:]).strip()
        return content or fallback.strip()

    def _intake_answers(self, base: str) -> list[dict[str, Any]]:
        path = f"{base}/facts.md"
        if not self.vault.exists(path):
            return []
        values = self.vault.read_markdown(path)["metadata"].get("intake_answers") or []
        return [dict(item) for item in values if isinstance(item, dict)]

    def _intake_status(self, matter_id: str) -> dict[str, Any]:
        directory = self.vault.resolve(f"{self.matter_path(matter_id)}/conversations")
        empty = {
            "intake_conversation_id": None,
            "intake_run_id": None,
            "intake_state": None,
            "active_agent_id": "counsel-copilot",
        }
        if not directory.exists():
            return empty
        for path in sorted(directory.glob("CONV-*.md")):
            metadata = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if metadata.get("conversation_kind") != "intake":
                continue
            run_id = next(
                (
                    message.get("run_id")
                    for message in metadata.get("messages", [])
                    if isinstance(message, dict) and message.get("run_id")
                ),
                None,
            )
            return {
                "intake_conversation_id": metadata.get("conversation_id"),
                "intake_run_id": run_id,
                "intake_state": metadata.get("intake_state", "active"),
                "active_agent_id": metadata.get("active_agent_id", "intake-agent"),
            }
        return empty
    def _recommendation_state(self, matter_path: str) -> dict[str, Any]:
        path = f"{matter_path}/recommendations.md"
        if not self.vault.exists(path):
            return {"path": path, "content": "", "current_version_id": None, "proposal": None}
        document = self.vault.read_markdown(path)
        metadata = document["metadata"]
        proposal = metadata.get("proposed_recommendation")
        return {
            "path": path,
            "content": document["content"].strip(),
            "current_version_id": metadata.get("current_recommendation_version_id"),
            "proposal": dict(proposal) if isinstance(proposal, dict) else None,
        }

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

    def _matter_for_source_action(
        self, source_action_key: str, *, rebuild: bool = True,
    ) -> dict[str, Any] | None:
        root = self.vault.resolve("03_Matters")
        for path in root.glob("*/matter.md") if root.exists() else []:
            document = self.vault.read_markdown(self.vault.relative(path))
            if document["metadata"].get("source_action_key") == source_action_key:
                matter_id = str(document["metadata"].get("matter_id") or "")
                if matter_id:
                    if rebuild:
                        self.index.rebuild()
                        return self.get(matter_id)
                    return {
                        "matter_id": matter_id,
                        "path": self.vault.relative(path.parent),
                        **document["metadata"],
                    }
        return None
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
        events = [
            self.vault.read_markdown(self.vault.relative(path))["metadata"]
            for path in events_dir.glob("*.md")
        ]
        events.sort(key=lambda event: self._event_sort_key(event.get("timestamp")), reverse=True)
        return events[:6]

    @staticmethod
    def _event_sort_key(value: Any) -> tuple[int, str]:
        text = str(value or "")
        try:
            parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
            return (1, parsed.isoformat())
        except ValueError:
            return (0, text)

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

    def _label_internal_records(
        self, tree: list[dict[str, Any]], *, legacy_root_path: str
    ) -> None:
        for node in tree:
            if node["type"] == "folder":
                # The conversation pass already labels transcripts. Run traces
                # do not need to be decoded to label the matter's file tree.
                if node["name"] == "conversations":
                    continue
                self._label_internal_records(
                    node.get("children", []), legacy_root_path=legacy_root_path
                )
                continue
            if node.get("extension") != ".md":
                continue
            document = self.vault.read_markdown(node["path"])
            metadata = document["metadata"]
            if node["path"].casefold() == legacy_root_path.casefold():
                node["record_type"] = "work_product"
                node["state"] = "draft"
                node["read_only"] = True
                node["label"] = metadata.get("title") or "Legacy work product"
                continue
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

    def _exclude_research_run_records(self, tree: list[dict[str, Any]]) -> None:
        kept: list[dict[str, Any]] = []
        for node in tree:
            if node["type"] == "folder":
                if node["name"] != "conversations":
                    self._exclude_research_run_records(node.get("children", []))
                kept.append(node)
                continue
            if node.get("extension") == ".md":
                metadata = self.vault.read_markdown(node["path"])["metadata"]
                if metadata.get("record_type") == "research_run":
                    continue
            kept.append(node)
        tree[:] = kept

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

    def _latest_research_path(self, base: str, matter_metadata: dict[str, Any]) -> str | None:
        saved_path = str(matter_metadata.get("latest_research_path") or "")
        if saved_path and self.vault.exists(saved_path):
            saved = self.vault.read_markdown(saved_path)
            if saved["metadata"].get("research_id") and "/research/runs/" not in saved_path:
                return saved_path
        candidates: list[tuple[tuple[int, str], float, str]] = []
        for path in self.vault.iter_files(f"{base}/research", {".md"}):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if metadata.get("research_id") and metadata.get("record_type") != "research_run":
                candidates.append((
                    self._event_sort_key(metadata.get("created_at")),
                    float(document.get("updated_at") or 0),
                    document["path"],
                ))
        return max(candidates)[2] if candidates else None

    def _action_result(
        self, action: str, matter_id: str, changed_paths: list[str], event_path: str | None,
        work_item_id: str | None, already_recorded: bool, *,
        summary: str | None = None, recovery: str | None = None,
    ) -> dict[str, Any]:
        matter = self.get(matter_id)
        paths = list(dict.fromkeys(path for path in changed_paths if path))
        operation_summary = summary or {
            "approve_response": "Approved the final response.",
            "mark_as_sent": "Recorded manual delivery outside Themis.ai.",
            "close_matter": "Closed the matter.",
            "complete_work_item": "Completed the selected work item.",
            "assign_work_item": "Assigned the selected work item.",
            "prioritize_work_item": "Updated the selected work item's priority.",
        }.get(action, action.replace("_", " ").capitalize() + ".")
        return {
            "action": action,
            "operation": action,
            "status": "no_change" if already_recorded or not paths else "changed",
            "summary": operation_summary,
            "matter_id": matter_id,
            "source_action_key": None,
            "entity_refs": ([{"type": "work_item", "id": work_item_id}] if work_item_id else []),
            "matter": matter,
            "changed_paths": paths,
            "resulting_matter_state": {
                "stage": matter["status"],
                "next_action": matter["work_state"]["next_action"],
                "work_state": matter["work_state"],
                "consistency_issues": matter.get("consistency_issues", []),
            },
            "available_next_actions": self.available_next_actions(matter),
            "required_user_action": None,
            "error": None,
            "recovery": recovery,
            "event_path": event_path, "work_item_id": work_item_id,
            "already_recorded": already_recorded,
        }

    @staticmethod
    def available_next_actions(matter: dict[str, Any]) -> list[str]:
        if matter.get("status") == "closed":
            return []
        if matter.get("current_work_product_final_path") and not matter.get("response_approved_at"):
            return ["approve_response"]
        if matter.get("response_approved_at") and not matter.get("response_sent_at"):
            return ["mark_as_sent"]
        if matter.get("response_sent_at"):
            return ["close_matter"]
        return []

    # Public facade methods. Focused services own the mutations; callers keep
    # the stable MatterService API used by routers, agents, and existing tools.
    def move_stage(
        self, matter_id: str, stage: str, *, reason: str = "", actor: str = "user", rebuild: bool = True,
    ) -> dict[str, Any]:
        result = self._lifecycle.move_stage(matter_id, stage, reason=reason, actor=actor, rebuild=rebuild)
        return self._project_work_state(matter_id, result) if rebuild else result

    def repair_consistency(self, matter_id: str, *, actor: str) -> dict[str, Any]:
        return self._lifecycle.repair_consistency(matter_id, actor=actor)

    def perform_action(
        self, matter_id: str, action: str, *, actor: str, artifact_path: str | None = None,
        work_item_id: str | None = None, note: str | None = None, action_actor: dict | None = None,
    ) -> dict[str, Any]:
        result = self._lifecycle.perform_action(
            matter_id, action, actor=actor, artifact_path=artifact_path,
            work_item_id=work_item_id, note=note, action_actor=action_actor,
        )
        return self._project_work_state(matter_id, result)

    def closure_prerequisite(self, matter_id: str) -> str | None:
        return self._lifecycle.closure_prerequisite(matter_id)

    def note_durable_decision_recorded(self, matter_id: str) -> None:
        self._lifecycle.note_durable_decision_recorded(matter_id)

    def create_work_item(self, request: WorkItemCreate, *, rebuild: bool = True) -> dict[str, Any]:
        result = self._work_items.create(request, rebuild=rebuild)
        return self._project_work_state(request.matter_id, result) if rebuild else result

    def create_review_work_item(
        self, request: WorkItemCreate, *, review_packet_id: str,
        decision_id: str | None = None, rebuild: bool = True,
    ) -> dict[str, Any]:
        return self._work_items.create_review(
            request, review_packet_id=review_packet_id, decision_id=decision_id, rebuild=rebuild,
        )

    def complete_open_work_items(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
        result = self._work_items.complete_open(matter_id, item_type=item_type)
        if result:
            self._project_work_state(matter_id, {})
        return result

    def complete_work_item(
        self, matter_id: str, work_item_id: str, *, actor: str, rebuild: bool = True, action_actor: dict | None = None,
    ) -> dict[str, Any]:
        result = self._work_items.complete(matter_id, work_item_id, actor=actor, rebuild=rebuild, action_actor=action_actor)
        return self._project_work_state(matter_id, result) if rebuild else result

    def assign_work_item(self, matter_id: str, work_item_id: str, *, owner: str, actor: str, action_actor: dict | None = None) -> dict[str, Any]:
        return self._project_work_state(matter_id, self._work_items.assign(matter_id, work_item_id, owner=owner, actor=actor, action_actor=action_actor))

    def prioritize_work_item(self, matter_id: str, work_item_id: str, *, priority: str, actor: str, action_actor: dict | None = None) -> dict[str, Any]:
        return self._project_work_state(matter_id, self._work_items.prioritize(matter_id, work_item_id, priority=priority, actor=actor, action_actor=action_actor))

    def _project_work_state(self, matter_id: str, result: dict[str, Any]) -> dict[str, Any]:
        """Refresh derived sections after a committed task or lifecycle mutation."""
        if not self._dossiers or not self._dossiers.get(matter_id):
            return result
        try:
            projection = self._dossiers.project_current_work_state(
                matter_id, expected_hash=self._dossiers.content_hash(matter_id),
            )
        except Exception as exc:
            projection = {"state": "failed", "error": f"Dossier projection failed: {type(exc).__name__}"}
        paths = list(result.get("changed_paths", []))
        if projection.get("state") in {"applied", "review_required"}:
            paths.append(projection.get("path") or projection["revision_path"])
        return {**result, "changed_paths": list(dict.fromkeys(paths)), "dossier_projection": projection}

    def add_participant(self, matter_id: str, *, name: str, role: str, actor: str) -> dict[str, Any]:
        return self._participants_service.add(matter_id, name=name, role=role, actor=actor)

    def _participants(self, matter_path: str) -> list[dict[str, str]]:
        return self._participants_service.list(matter_path)

    @staticmethod
    def _participants_from_content(content: str) -> list[dict[str, str]]:
        return MatterParticipantService.from_content(content)

    @staticmethod
    def _structured_participants(*, requester: Any, legal_owner: Any, business_owner: Any) -> list[dict[str, str]]:
        return MatterParticipantService.structured(
            requester=requester, legal_owner=legal_owner, business_owner=business_owner,
        )

    def _complete_open_work_items(self, matter_id: str, *, item_type: str | None = None) -> list[str]:
        return self._work_items.complete_open(matter_id, item_type=item_type)

    def _find_work_item(self, matter_id: str, work_item_id: str) -> dict[str, Any]:
        return self._work_items.find(matter_id, work_item_id)

    def _validate_final_artifact(self, matter_id: str, artifact_path: str) -> dict[str, Any]:
        return self._lifecycle.validate_final_artifact(matter_id, artifact_path)

    def _current_final_path(self, base: str, current_draft_path: str | None) -> str | None:
        return self._lifecycle._legacy_final_path(base, current_draft_path)

    @staticmethod
    def _lifecycle_event_id(matter_id: str, suffix: str) -> str:
        return MatterLifecycleService.event_id(matter_id, suffix)

    def _repair_lifecycle_event(
        self, matter_id: str, metadata: dict[str, Any], field: str, event_type: str,
        title: str, timestamp: str, actor: str,
    ) -> str:
        return self._lifecycle._repair_event(matter_id, metadata, field, event_type, title, timestamp, actor)
