"""Editable matter-local business flow records."""
from __future__ import annotations

from typing import Any, Iterable

from app.models.workspace import Flow, FlowActor, FlowEdge
from app.services.dossier import serialized
from app.services.matter_records import MatterRecordService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, WorkspaceService, digest
from app.utils.ids import new_id
from app.utils.time import iso_now


class WorkspaceFlowService:
    def __init__(self, vault: VaultService, matters: MatterService,
                 workspace: WorkspaceService | None = None,
                 records: MatterRecordService | None = None):
        self.vault, self.matters = vault, matters
        self.records = records or MatterRecordService(vault, matters)
        self.workspace = workspace or WorkspaceService(vault, matters, records=self.records)

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/flow.md"

    @staticmethod
    def _revision(content: str, metadata: dict[str, Any]) -> str:
        return digest({"content": content, "metadata": {k: v for k, v in metadata.items() if k not in {"revision", "updated_at"}}})

    def get(self, matter_id: str) -> dict[str, Any]:
        path = self._path(matter_id)
        if not self.vault.exists(path):
            return Flow(matter_id=matter_id, revision="", actors=[], edges=[]).model_dump()
        doc = self.vault.read_markdown(path)
        if doc["metadata"].get("matter_id") not in {None, matter_id}:
            raise ValueError("Flow belongs to another matter.")
        data = dict(doc["metadata"].get("flow") or {})
        data.update({"matter_id": matter_id, "revision": self._revision(doc["content"], doc["metadata"])})
        return Flow.model_validate(data).model_dump()

    @serialized
    def save(self, matter_id: str, flow: Flow | dict[str, Any], *, expected_revision: str) -> dict[str, Any]:
        supplied = flow.model_dump() if isinstance(flow, Flow) else dict(flow)
        if supplied.get("matter_id") not in {None, "", matter_id}:
            raise ValueError("Flow belongs to another matter.")
        path = self._path(matter_id)
        current = self.vault.read_markdown(path) if self.vault.exists(path) else {"content": "# Business flow\n", "metadata": {"matter_id": matter_id}}
        revision = self._revision(current["content"], current["metadata"]) if self.vault.exists(path) else ""
        if expected_revision != revision:
            raise WorkspaceConflict("This flow changed. Refresh before saving.", revision)
        actors = [FlowActor.model_validate(item).model_dump() for item in supplied.get("actors", [])]
        edges = [FlowEdge.model_validate(item).model_dump() for item in supplied.get("edges", [])]
        actor_ids = [item["actor_id"] for item in actors]
        edge_ids = [item["edge_id"] for item in edges]
        if len(actor_ids) != len(set(actor_ids)) or len(edge_ids) != len(set(edge_ids)):
            raise ValueError("Flow actor and edge IDs must be unique.")
        if any(edge["from_actor_id"] not in actor_ids or edge["to_actor_id"] not in actor_ids for edge in edges):
            raise ValueError("Each flow edge must connect actors in this matter.")
        known_fact_ids = {fact.get("fact_id") for fact in self.records.get(matter_id)["facts"]}
        if any(fact_id not in known_fact_ids for edge in edges for fact_id in edge["fact_ids"]):
            raise ValueError("Each flow fact link must belong to this matter.")
        if [edge["order"] for edge in edges] != sorted(edge["order"] for edge in edges):
            raise ValueError("Flow edges must be in order.")
        old = self.get(matter_id)
        proposed = self._proposed_changes(old, {"actors": actors, "edges": edges})
        data = Flow(matter_id=matter_id, revision="", actors=actors, edges=edges).model_dump()
        metadata = dict(current["metadata"])
        metadata.update({"matter_id": matter_id, "record_type": "business_flow", "flow": data,
                         "proposed_fact_changes": [*metadata.get("proposed_fact_changes", []), *proposed], "updated_at": iso_now()})
        content = current["content"] or "# Business flow\n"
        metadata["revision"] = self._revision(content, metadata)
        self.vault.write_markdown(path, content, metadata)
        return self.get(matter_id)

    @staticmethod
    def _proposed_changes(old: dict[str, Any], new: dict[str, Any]) -> list[dict[str, Any]]:
        old_edges = {edge["edge_id"]: edge for edge in old.get("edges", [])}
        proposals = []
        for edge in new["edges"]:
            if old_edges.get(edge["edge_id"]) == edge:
                continue
            text = edge["uncertainty"].strip() or edge["label"].strip()
            if text:
                proposals.append({"change_id": new_id("FLOWCHG"), "text": text, "edge_id": edge["edge_id"], "state": "proposed"})
        return proposals

    def proposed_fact_changes(self, matter_id: str) -> list[dict[str, Any]]:
        path = self._path(matter_id)
        if not self.vault.exists(path):
            return []
        doc = self.vault.read_markdown(path)
        return [dict(item) for item in doc["metadata"].get("proposed_fact_changes", []) if isinstance(item, dict) and item.get("state") == "proposed"]

    def _check_expected_facts(self, matter_id: str, current: dict[str, str], expected: dict[str, str]) -> None:
        facts_path = self.records._path(matter_id)
        if expected.get(facts_path) != current.get(facts_path):
            raise WorkspaceConflict("Matter facts changed. Refresh before accepting flow facts.", current.get(facts_path, ""))
        for key, value in expected.items():
            if current.get(key) != value:
                raise WorkspaceConflict("Matter sources changed. Refresh before accepting flow facts.", current.get(key, ""))

    @serialized
    def accept_proposed_fact_changes(self, matter_id: str, change_ids: Iterable[str], *, expected_revisions: dict[str, str],
                                     source_action_key: str, trusted_user_action: bool, source_message_id: str | None = None) -> dict[str, Any]:
        if not trusted_user_action:
            raise ValueError("A current lawyer instruction is required to accept flow facts.")
        chosen_ids = set(change_ids)
        path = self._path(matter_id)
        doc = self.vault.read_markdown(path)
        payload = {"change_ids": sorted(chosen_ids), "expected_revisions": expected_revisions, "source_message_id": source_message_id}
        fingerprint = digest(payload)
        receipts = list(doc["metadata"].get("acceptance_receipts", []))
        prior = next((item for item in receipts if item.get("source_action_key") == source_action_key), None)
        if prior:
            if prior.get("fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was already used for different flow facts.", self._revision(doc["content"], doc["metadata"]), code="action_key_conflict")
            return prior["result"]
        all_changes = [dict(item) for item in doc["metadata"].get("proposed_fact_changes", []) if isinstance(item, dict)]
        chosen = [item for item in all_changes if item.get("change_id") in chosen_ids]
        action_key = f"flow:{source_action_key}:accept"
        record = self.records.get(matter_id)
        existing = next((item for item in record["actions"] if item.get("source_action_key") == action_key), None)
        if existing:
            created = [item for item in record["facts"] if item.get("fact_id") in existing.get("created", {}).get("facts", [])]
            if existing.get("flow_acceptance") != fingerprint:
                raise WorkspaceConflict("This action key was already used for different flow facts.", self._revision(doc["content"], doc["metadata"]), code="action_key_conflict")
            result = existing
        else:
            if not chosen or len(chosen) != len(chosen_ids) or any(item.get("state") != "proposed" for item in chosen):
                raise ValueError("Flow fact change not found.")
            self._check_expected_facts(matter_id, self.workspace.source_revisions(matter_id), expected_revisions)
            result = self.records.apply_update(matter_id, facts=[{"text": item["text"], "source_ids": [source_message_id] if source_message_id else []} for item in chosen],
                                               summary="Accepted selected business-flow facts", actor="user", source_action_key=action_key,
                                               action_metadata={"flow_acceptance": fingerprint})
        updates = []
        for item in all_changes:
            entry = dict(item)
            if entry.get("change_id") in chosen_ids:
                entry["state"] = "accepted"
            updates.append(entry)
        doc["metadata"]["proposed_fact_changes"] = updates
        doc["metadata"]["updated_at"] = iso_now()
        receipt = {"source_action_key": source_action_key, "fingerprint": fingerprint,
                   "result": {"state": "applied", "fact_ids": result["created"]["facts"], "accepted_change_ids": sorted(chosen_ids)}}
        doc["metadata"]["acceptance_receipts"] = [*receipts, receipt]
        self.vault.write_markdown(path, doc["content"], doc["metadata"])
        return receipt["result"]
