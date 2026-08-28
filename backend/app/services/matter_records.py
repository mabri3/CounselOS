from __future__ import annotations

import hashlib
from typing import Any, Iterable

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
        metadata = {key: record[key] for key in ("matter_id", "record_type", "facts", "sources", "support", "assumptions", "conflicts", "actions")}
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
        }

    @staticmethod
    def _find(items: list[dict[str, Any]], key: str, value: Any) -> dict[str, Any] | None:
        return next((item for item in items if item.get(key) == value), None)
