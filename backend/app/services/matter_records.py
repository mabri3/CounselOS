from __future__ import annotations

import hashlib
from typing import Any, Iterable

from app.models.api import IntakeTurn, IntakeTurnResult, MatterUpdateCard
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class MatterRecordService:
    """Maintain the matter-local factual record in Markdown."""

    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

    def get(self, matter_id: str) -> dict[str, Any]:
        path = self._path(matter_id)
        document = self.vault.read_markdown(path)
        metadata = self._normalized(document["metadata"], document["content"])
        return {"path": path, "content": document["content"], **metadata}

    def apply_update(
        self,
        matter_id: str,
        *,
        facts: Iterable[dict[str, Any]] = (),
        sources: Iterable[dict[str, Any]] = (),
        support: Iterable[dict[str, Any]] = (),
        assumptions: Iterable[dict[str, Any]] = (),
        summary: str = "Matter facts updated",
        actor: str = "assistant",
    ) -> dict[str, Any]:
        record = self.get(matter_id)
        action_id = new_id("ACT")
        now = iso_now()
        created: dict[str, list[str]] = {key: [] for key in ("facts", "sources", "support", "assumptions")}

        for supplied in sources:
            if supplied.get("kind") == "file" and not (supplied.get("version") or supplied.get("content_hash")):
                raise ValueError("A file source needs a version or content hash.")
            item = {
                "source_id": supplied.get("source_id") or new_id("SRC"),
                "kind": supplied.get("kind", "other"),
                "label": supplied.get("label", "Source"),
                "path": supplied.get("path"),
                "version": supplied.get("version") or supplied.get("content_hash") or "",
                "location": supplied.get("location", ""),
                "created_at": now,
                "withdrawn_at": None,
                "action_id": action_id,
            }
            record["sources"].append(item)
            created["sources"].append(item["source_id"])

        for supplied in facts:
            text = str(supplied.get("text", "")).strip()
            if not text:
                continue
            item = {
                "fact_id": supplied.get("fact_id") or new_id("FACT"),
                "text": text,
                "status": "active",
                "material": bool(supplied.get("material", True)),
                "source_ids": list(supplied.get("source_ids", [])),
                "supersedes": supplied.get("supersedes"),
                "created_at": now,
                "withdrawn_at": None,
                "action_id": action_id,
            }
            if item["supersedes"]:
                prior = self._find(record["facts"], "fact_id", item["supersedes"])
                if prior is None:
                    raise ValueError(f"Fact not found: {item['supersedes']}")
                prior["status"] = "superseded"
                prior["superseded_by"] = item["fact_id"]
            record["facts"].append(item)
            created["facts"].append(item["fact_id"])

        for supplied in support:
            relationship = supplied.get("relationship", "support")
            if relationship not in {"support", "contradict", "qualify"}:
                raise ValueError("Support relationship must support, contradict, or qualify.")
            fact_id = supplied.get("fact_id")
            if self._find(record["facts"], "fact_id", fact_id) is None:
                raise ValueError(f"Fact not found: {fact_id}")
            item = {
                "support_id": supplied.get("support_id") or new_id("SUP"),
                "fact_id": fact_id,
                "source_id": supplied.get("source_id"),
                "relationship": relationship,
                "statement": str(supplied.get("statement", "")).strip(),
                "location": supplied.get("location", ""),
                "created_at": now,
                "withdrawn_at": None,
                "action_id": action_id,
            }
            record["support"].append(item)
            created["support"].append(item["support_id"])

        for supplied in assumptions:
            text = str(supplied.get("text", "")).strip()
            if not text:
                continue
            item = {
                "assumption_id": supplied.get("assumption_id") or new_id("ASM"),
                "text": text,
                "reason": supplied.get("reason", "Needed to continue"),
                "material": bool(supplied.get("material", True)),
                "status": "open",
                "created_at": now,
                "resolved_at": None,
                "withdrawn_at": None,
                "action_id": action_id,
            }
            record["assumptions"].append(item)
            created["assumptions"].append(item["assumption_id"])

        action = {
            "action_id": action_id,
            "summary": summary,
            "actor": actor,
            "created_at": now,
            "status": "applied",
            "created": created,
        }
        record["actions"].append(action)
        self._save(matter_id, record)
        self.matters.append_event(matter_id, "matter_records_updated", action)
        return action

    def ensure_source(
        self,
        matter_id: str,
        *,
        source_id: str,
        kind: str,
        label: str,
        path: str | None = None,
        version: str = "",
    ) -> dict[str, Any]:
        if not source_id:
            raise ValueError("A trusted source ID is required.")
        record = self.get(matter_id)
        existing = self._find(record["sources"], "source_id", source_id)
        if existing is not None:
            return existing
        action = self.apply_update(
            matter_id,
            sources=[{
                "source_id": source_id,
                "kind": kind,
                "label": label,
                "path": path,
                "version": version,
            }],
            summary=f"Linked {label}",
            actor="system",
        )
        return self._find(self.get(matter_id)["sources"], "source_id", source_id) or action

    def apply_intake_turn(
        self,
        matter_id: str,
        turn: IntakeTurn,
        *,
        source_id: str | None = None,
        expected_dossier_hash: str | None = None,
    ) -> IntakeTurnResult:
        matter = self.matters.get(matter_id)
        questions = turn.next_questions if turn.intake_state == "active" else []
        record = self.get(matter_id)
        if not source_id:
            request_path = f"{matter['path']}/request.md"
            request = self.vault.read_markdown(request_path)
            source_id = str(request["metadata"].get("request_id") or "")
            self.ensure_source(
                matter_id,
                source_id=source_id,
                kind="immutable_request",
                label="Original request",
                path=request_path,
            )
            record = self.get(matter_id)
        elif self._find(record["sources"], "source_id", source_id) is None:
            self.ensure_source(
                matter_id,
                source_id=source_id,
                kind="conversation_message",
                label="Matter intake response",
            )
            record = self.get(matter_id)

        facts: list[dict[str, Any]] = []
        assumptions = [{"text": text} for text in turn.assumptions if text.strip()]
        support: list[dict[str, Any]] = []
        record_ids: list[str] = []
        for supplied in turn.reported_facts:
            statement = supplied.statement.strip()
            if supplied.status == "assumption":
                assumptions.append({"text": statement})
                continue
            if supplied.status != "reported":
                continue
            existing = next(
                (
                    item for item in record["facts"]
                    if item.get("status") == "active"
                    and str(item.get("text", "")).casefold() == statement.casefold()
                ),
                None,
            )
            if existing:
                support.append({
                    "fact_id": existing["fact_id"],
                    "source_id": source_id,
                    "relationship": "support",
                    "statement": statement,
                })
                record_ids.append(existing["fact_id"])
            else:
                fact_id = new_id("FACT")
                facts.append({
                    "fact_id": fact_id,
                    "text": statement,
                    "material": supplied.materiality != "minor",
                    "source_ids": [source_id],
                })
                support.append({
                    "fact_id": fact_id,
                    "source_id": source_id,
                    "relationship": "support",
                    "statement": statement,
                })
                record_ids.append(fact_id)

        action = self.apply_update(
            matter_id,
            facts=facts,
            support=support,
            assumptions=assumptions,
            summary="Applied an Intake Agent turn",
        )
        record_ids.extend(action["created"]["assumptions"])
        record = self.get(matter_id)
        record.update(
            {
                "working_ask": turn.working_ask.strip(),
                "issues": _clean_text_list(turn.issues),
                "open_questions": _clean_text_list(
                    [*turn.material_missing_facts, *turn.human_questions]
                ),
                "public_research_questions": _clean_text_list(
                    turn.public_research_questions
                )[:3],
                "intake_state": turn.intake_state,
            }
        )
        self._save(matter_id, record)

        issues_path = f"{matter['path']}/issues.md"
        issues = record["issues"]
        self.vault.update_markdown(
            issues_path,
            content="# Issues and workstreams\n\n"
            + ("\n".join(f"- {item}" for item in issues) or "No workstreams identified yet."),
            metadata_updates={"matter_id": matter_id, "record_type": "issues"},
        )
        matter_path = f"{matter['path']}/matter.md"
        active_agent_id = "intake-agent" if turn.intake_state == "active" else "counsel-copilot"
        self.vault.update_markdown(
            matter_path,
            metadata_updates={
                "intake_state": turn.intake_state,
                "active_agent_id": active_agent_id,
                "next_action": (
                    questions[0].text
                    if questions
                    else "Review the dossier and continue the legal work."
                ),
                "updated_at": iso_now(),
            },
        )

        dossier_result = self.matters._dossiers.update_from_intake(
            matter_id,
            working_ask=turn.working_ask,
            facts=record["facts"],
            assumptions=record["assumptions"],
            issues=record["issues"],
            open_questions=record["open_questions"],
            orientation=turn.dossier_orientation or "",
            expected_hash=expected_dossier_hash,
        ) if self.matters._dossiers else None
        changed_paths = [record["path"], issues_path, matter_path]
        if dossier_result:
            changed_paths.append(
                str(dossier_result.get("path") or dossier_result.get("revision_path"))
            )
        update = MatterUpdateCard(
            action_id=action["action_id"],
            summary="Matter intake updated",
            changed_sections=["Working ask", "Facts", "Issues", "Open questions"],
            can_undo=True,
        )
        return IntakeTurnResult(
            changed_paths=list(dict.fromkeys(changed_paths)),
            record_ids=record_ids,
            questions=questions,
            question=questions[0] if questions else None,
            matter_update=update,
            intake_state=turn.intake_state,
        )

    def set_intake_state(self, matter_id: str, state: str) -> dict[str, Any]:
        if state not in {"active", "complete"}:
            raise ValueError("Intake state must be active or complete.")
        record = self.get(matter_id)
        record["intake_state"] = state
        self._save(matter_id, record)
        matter = self.matters.get(matter_id)
        self.vault.update_markdown(
            f"{matter['path']}/matter.md",
            metadata_updates={
                "intake_state": state,
                "active_agent_id": (
                    "intake-agent" if state == "active" else "counsel-copilot"
                ),
                "updated_at": iso_now(),
            },
        )
        return self.get(matter_id)

    def save_facts_from_messages(
        self,
        matter_id: str,
        messages: Iterable[dict[str, Any]],
        *,
        conversation_id: str,
    ) -> dict[str, Any]:
        statements: list[dict[str, Any]] = []
        for message in messages:
            if message.get("role") != "user":
                continue
            text = str(message.get("content", "")).strip()
            lowered = text.lower()
            if not text or text.endswith("?") or lowered.startswith(("what if", "suppose", "imagine")):
                continue
            statements.append({"text": text, "source_ids": [conversation_id]})
        return self.apply_update(
            matter_id,
            facts=statements,
            sources=[{"source_id": conversation_id, "kind": "conversation", "label": "Current matter chat"}],
            summary="Saved facts from the current chat",
        )

    def save_facts_from_source(
        self,
        matter_id: str,
        *,
        source_id: str,
        source_kind: str,
        source_label: str,
        statements: Iterable[str],
        path: str | None = None,
        version: str = "",
    ) -> dict[str, Any]:
        """Save caller-extracted reported statements from notes, profiles, files, or chats."""
        facts = [{"text": text.strip(), "source_ids": [source_id]} for text in statements if text.strip()]
        return self.apply_update(
            matter_id,
            sources=[{"source_id": source_id, "kind": source_kind, "label": source_label,
                      "path": path, "version": version}],
            facts=facts,
            summary=f"Saved facts from {source_label}",
        )

    def resolve_assumption(
        self,
        matter_id: str,
        assumption_id: str,
        action: str,
        *,
        corrected_text: str = "",
        responder: str = "user",
    ) -> dict[str, Any]:
        if action not in {"confirm", "correct", "leave"}:
            raise ValueError("Assumption action must be confirm, correct, or leave.")
        record = self.get(matter_id)
        assumption = self._find(record["assumptions"], "assumption_id", assumption_id)
        if assumption is None or assumption.get("withdrawn_at"):
            raise KeyError(f"Assumption not found: {assumption_id}")
        if action == "leave":
            return assumption
        text = assumption["text"] if action == "confirm" else corrected_text.strip()
        if not text:
            raise ValueError("A correction needs replacement text.")
        result = self.apply_update(
            matter_id,
            facts=[{"text": text, "material": assumption.get("material", True)}],
            summary=f"Assumption {action}ed by the user",
            actor=responder,
        )
        record = self.get(matter_id)
        assumption = self._find(record["assumptions"], "assumption_id", assumption_id)
        assumption.update({"status": action + "ed", "resolved_at": iso_now(), "resolved_by": responder,
                           "resulting_fact_id": result["created"]["facts"][0]})
        self._save(matter_id, record)
        return assumption

    def create_conflict(
        self,
        matter_id: str,
        *,
        fact_ids: list[str],
        question: str,
        affected_outputs: list[str] | None = None,
    ) -> dict[str, Any]:
        record = self.get(matter_id)
        if len(fact_ids) < 2 or any(self._find(record["facts"], "fact_id", item) is None for item in fact_ids):
            raise ValueError("A conflict needs at least two existing facts.")
        conflict = {
            "conflict_id": new_id("CON"), "fact_ids": fact_ids, "question": question,
            "affected_outputs": affected_outputs or [], "status": "open", "created_at": iso_now(),
            "resolved_at": None, "resolution": "", "responder": "",
        }
        record["conflicts"].append(conflict)
        self._save(matter_id, record)
        self.matters.append_event(matter_id, "factual_conflict_detected", conflict)
        return conflict

    def resolve_conflict(self, matter_id: str, conflict_id: str, resolution: str, *, responder: str) -> dict[str, Any]:
        if not responder.strip() or responder == "assistant":
            raise ValueError("Only an explicit user response can resolve a factual conflict.")
        record = self.get(matter_id)
        conflict = self._find(record["conflicts"], "conflict_id", conflict_id)
        if conflict is None:
            raise KeyError(f"Conflict not found: {conflict_id}")
        conflict.update({"status": "resolved", "resolution": resolution, "responder": responder,
                         "resolved_at": iso_now()})
        self._save(matter_id, record)
        self.matters.append_event(matter_id, "factual_conflict_resolved", conflict)
        return conflict

    def withdraw_action(self, matter_id: str, action_id: str, *, actor: str = "user") -> dict[str, Any]:
        record = self.get(matter_id)
        action = self._find(record["actions"], "action_id", action_id)
        if action is None:
            raise KeyError(f"Action not found: {action_id}")
        if action["status"] == "withdrawn":
            return action
        now = iso_now()
        id_fields = {"facts": "fact_id", "sources": "source_id", "support": "support_id", "assumptions": "assumption_id"}
        for section, ids in action["created"].items():
            for record_id in ids:
                item = self._find(record[section], id_fields[section], record_id)
                if item:
                    item["withdrawn_at"] = now
                    if section == "facts":
                        item["status"] = "withdrawn"
                        superseded = item.get("supersedes")
                        prior = self._find(record["facts"], "fact_id", superseded) if superseded else None
                        if prior and prior.get("superseded_by") == item.get("fact_id"):
                            prior["status"] = "active"
                            prior.pop("superseded_by", None)
        action.update({"status": "withdrawn", "withdrawn_at": now, "withdrawn_by": actor})
        self._save(matter_id, record)
        self.matters.append_event(matter_id, "matter_records_withdrawn", action)
        return action

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/facts.md"

    def _save(self, matter_id: str, record: dict[str, Any]) -> None:
        metadata = {
            key: record[key]
            for key in (
                "matter_id", "record_type", "facts", "sources", "support",
                "assumptions", "conflicts", "actions", "working_ask", "issues",
                "open_questions", "public_research_questions", "intake_state",
            )
        }
        active = [item for item in record["facts"] if item.get("status") == "active" and not item.get("withdrawn_at")]
        assumptions = [item for item in record["assumptions"] if item.get("status") == "open" and not item.get("withdrawn_at")]
        body = "# Known Facts\n\n" + ("\n".join(f"- {item['text']}" for item in active) or "No facts saved yet.")
        body += "\n\n## Assumptions\n\n" + ("\n".join(f"- [Assumption] {item['text']}" for item in assumptions) or "No open assumptions.")
        self.vault.write_markdown(self._path(matter_id), body, metadata)

    @staticmethod
    def _normalized(metadata: dict[str, Any], content: str) -> dict[str, Any]:
        facts = list(metadata.get("facts") or [])
        if not facts:
            for line in content.splitlines():
                stripped = line.strip()
                if stripped.startswith("## "):
                    break
                if not stripped.startswith("- ") or stripped.startswith("- ["):
                    continue
                text = stripped[2:].strip()
                digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]
                facts.append({
                    "fact_id": f"FACT-LEGACY-{digest}", "text": text, "status": "active",
                    "material": True, "source_ids": [], "supersedes": None,
                    "created_at": None, "withdrawn_at": None, "action_id": None,
                })
        return {
            "matter_id": metadata.get("matter_id"), "record_type": "facts",
            "facts": facts,
            **{key: list(metadata.get(key) or []) for key in ("sources", "support", "assumptions", "conflicts", "actions")},
            "working_ask": str(metadata.get("working_ask") or ""),
            "issues": list(metadata.get("issues") or []),
            "open_questions": list(metadata.get("open_questions") or []),
            "public_research_questions": list(metadata.get("public_research_questions") or []),
            "intake_state": str(metadata.get("intake_state") or "active"),
        }

    @staticmethod
    def _find(items: list[dict[str, Any]], key: str, value: Any) -> dict[str, Any] | None:
        return next((item for item in items if item.get(key) == value), None)


def _clean_text_list(values: Iterable[str]) -> list[str]:
    return list(dict.fromkeys(value.strip() for value in values if value.strip()))
