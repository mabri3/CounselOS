"""Demo roster, scoped handoffs, queues, and per-person seen cursors.

Markdown is authoritative.  The injected owner transfer is the only component
allowed to change canonical ownership.
"""
from __future__ import annotations

from typing import Any

from app.models.continuity import (
    ActionActor,
    DemoPerson,
    DemoRoster,
    DemoRosterCommand,
    FrozenReference,
    Handoff,
    HandoffAction,
    HandoffCommand,
    HandoffResult,
    OwnerTransfer,
    PersonViewState,
    ScopeSnapshot,
    TeamWorkItem,
)
from app.models.workspace import ConversationTarget, InteractionReceipt
from app.services.dossier import serialized
from app.services.workspace import WorkspaceConflict, digest
from app.utils.time import iso_now


class WorkspaceTeamService:
    def __init__(self, vault, matters, workspace, settings, *, transfer_owner: OwnerTransfer):
        self.vault = vault
        self.matters = matters
        self.workspace = workspace
        self.settings = settings
        self.transfer_owner = transfer_owner

    def roster(self) -> dict[str, Any]:
        values = self.settings.read()["values"]
        enabled = values.get("continuity.demo_enabled") is True
        raw_people = values.get("continuity.people", [])
        people = [DemoPerson.model_validate(item) for item in raw_people if isinstance(item, dict)]
        return DemoRoster(
            enabled=enabled,
            people=people,
            revision=digest({"enabled": enabled, "people": [item.model_dump() for item in people]}),
            vault_key=digest(str(self.vault.resolve("")))[:24],
        ).model_dump()

    @serialized
    def configure(self, command: DemoRosterCommand | dict[str, Any]) -> dict[str, Any]:
        data = DemoRosterCommand.model_validate(command)
        current = self.roster()
        if data.expected_revision != current["revision"]:
            raise WorkspaceConflict("The team settings changed. Refresh before saving.", current["revision"])
        ids = [person.person_id for person in data.people]
        if len(ids) != len(set(ids)):
            raise ValueError("Each person ID must be unique.")
        if data.enabled and not data.people:
            raise ValueError("Demo mode needs at least one configured person.")

        path = self.settings.PATH
        if self.vault.exists(path):
            document = self.vault.read_markdown(path)
            metadata, body = document["metadata"], document["content"]
        else:
            metadata = {}
            body = "# Workspace settings\n\nWritten from the Settings screen.\n"
        values = metadata.get("values")
        merged = dict(values) if isinstance(values, dict) else {}
        merged["continuity.demo_enabled"] = data.enabled
        merged["continuity.people"] = [person.model_dump() for person in data.people]
        metadata = {**metadata, "values": merged, "updated_at": iso_now()}
        self.vault.write_markdown(path, body, metadata)
        return self.roster()

    def resolve_actor(self, person_id: str | None = None) -> ActionActor:
        roster = self.roster()
        if roster["enabled"]:
            people = roster["people"]
            selected = person_id or (people[0]["person_id"] if people else None)
            person = next((item for item in people if item["person_id"] == selected), None)
            if person is None:
                raise ValueError("Unknown person ID.")
            return ActionActor(
                person_id=person["person_id"], display_name=person["display_name"], mode="demo",
            )
        if person_id is not None:
            raise ValueError("Demo identities are disabled.")
        owner = str(self.settings.read()["values"].get("matters.default_owner") or "").strip()
        return ActionActor(person_id="local-lawyer", display_name=owner or "Unattributed lawyer", mode="single")

    def _matter(self, matter_id: str) -> tuple[str, dict[str, Any]]:
        root = self.vault.resolve("03_Matters")
        for path in root.glob("*/matter.md") if root.exists() else []:
            document = self.vault.read_markdown(self.vault.relative(path))
            if document["metadata"].get("matter_id") == matter_id:
                return self.vault.relative(path.parent), document
        raise KeyError(f"Matter not found: {matter_id}")

    @staticmethod
    def _ownership_revision(metadata: dict[str, Any], owner_id: str | None, owner_name: str | None) -> str:
        return str(metadata.get("ownership_revision") or digest({
            "owner_id": owner_id,
            "owner_name": owner_name,
            "assigned_at": metadata.get("assigned_at"),
            "ownership_action_key": metadata.get("ownership_action_key"),
        }))

    @staticmethod
    def _content_revision(document: dict[str, Any], *, work_item: bool) -> str:
        metadata = dict(document["metadata"])
        excluded = {
            "owner", "owner_id", "legal_owner", "legal_owner_id", "ownership_revision",
            "ownership_action_key", "assigned_by", "assigned_at", "updated_at", "updated_by",
            "action_actor",
        }
        if not work_item:
            excluded.update({"participants"})
        return digest({"content": document["content"], "metadata": {
            key: value for key, value in metadata.items() if key not in excluded
        }})

    def scope(self, matter_id: str, *, work_item_id: str | None = None) -> dict[str, Any]:
        base, matter_doc = self._matter(matter_id)
        if work_item_id is None:
            meta = matter_doc["metadata"]
            owner_id = meta.get("legal_owner_id")
            owner_name = str(meta.get("legal_owner") or "").strip() or None
            return ScopeSnapshot(
                matter_id=matter_id, kind="matter", title=str(meta.get("title") or matter_id),
                path=matter_doc["path"], owner_id=owner_id, owner_name=owner_name,
                ownership_revision=self._ownership_revision(meta, owner_id, owner_name),
                content_revision=self._content_revision(matter_doc, work_item=False),
                status=str(meta.get("status") or "unknown"),
            ).model_dump()
        for path in self.vault.iter_files(f"{base}/work-items", {".md"}):
            doc = self.vault.read_markdown(self.vault.relative(path))
            meta = doc["metadata"]
            if meta.get("work_item_id") != work_item_id:
                continue
            owner_id = meta.get("owner_id")
            owner_name = str(meta.get("owner") or "").strip() or None
            return ScopeSnapshot(
                matter_id=matter_id, kind="work_item", work_item_id=work_item_id,
                title=str(meta.get("title") or work_item_id), path=doc["path"],
                owner_id=owner_id, owner_name=owner_name,
                ownership_revision=self._ownership_revision(meta, owner_id, owner_name),
                content_revision=self._content_revision(doc, work_item=True),
                status=str(meta.get("status") or "unknown"),
            ).model_dump()
        raise KeyError(f"Work item not found: {work_item_id}")

    def _handoff_paths(self, matter_id: str):
        base, _ = self._matter(matter_id)
        return self.vault.iter_files(f"{base}/continuity/handoffs", {".md"})

    def _load_handoff(self, path) -> tuple[dict[str, Any], dict[str, Any]]:
        doc = self.vault.read_markdown(self.vault.relative(path))
        return doc, dict(doc["metadata"].get("handoff") or {})

    def list_handoffs(self, matter_id: str) -> list[dict[str, Any]]:
        result = []
        for path in self._handoff_paths(matter_id):
            _, item = self._load_handoff(path)
            if not item:
                continue
            current = self.scope(matter_id, work_item_id=item["scope"].get("work_item_id"))
            item["stale"] = (
                item["state"] == "pending"
                and current["ownership_revision"] != item["scope"]["ownership_revision"]
            )
            result.append(Handoff.model_validate(item).model_dump())
        return sorted(result, key=lambda item: (item["created_at"], item["handoff_id"]))

    def _recipient(self, person_id: str) -> DemoPerson:
        person = next((item for item in self.roster()["people"] if item["person_id"] == person_id), None)
        if person is None:
            raise ValueError("Unknown handoff recipient.")
        return DemoPerson.model_validate(person)

    def _find_operation(self, matter_id: str, operation: str, key: str):
        for path in self._handoff_paths(matter_id):
            doc, handoff = self._load_handoff(path)
            for item in doc["metadata"].get("operations", []):
                if item.get("operation") == operation and item.get("source_action_key") == key:
                    return doc, handoff, item
        return None

    @staticmethod
    def _operation(operation: str, key: str, command: dict[str, Any], target: dict[str, Any], actor: ActionActor) -> dict[str, Any]:
        return {
            "operation": operation, "source_action_key": key, "command": command,
            "target": target, "actor": actor.model_dump(),
            "fingerprint": digest({"operation": operation, "command": command, "target": target}),
            "completed_parts": [], "receipt": None,
        }

    @staticmethod
    def _check_replay(saved: dict[str, Any], operation: str, command: dict[str, Any], target: dict[str, Any]) -> ActionActor:
        fingerprint = digest({"operation": operation, "command": command, "target": target})
        if saved.get("fingerprint") != fingerprint:
            raise WorkspaceConflict(
                "This action key was already used for a different request.",
                str(saved.get("receipt", {}).get("after_revision") or ""), code="action_key_conflict",
            )
        return ActionActor.model_validate(saved["actor"])

    def _freeze_reference(self, matter_id: str, selection) -> dict[str, Any]:
        base, _ = self._matter(matter_id)
        candidate = self.vault.resolve(selection.path)
        candidate.relative_to(self.vault.resolve(base))
        if not candidate.is_file():
            raise KeyError(f"Reference not found: {selection.reference_id}")
        document = self.vault.read_document(selection.path)
        text = document["content"]
        metadata = document.get("metadata", {})
        revision = digest({"content": text, "metadata": metadata})
        if revision != selection.expected_revision:
            raise WorkspaceConflict("The selected reference changed.", revision, code="source_conflict")
        known_ids = {str(value) for key, value in metadata.items() if key.endswith("_id") and value}
        if selection.reference_id not in known_ids and selection.reference_id != selection.path:
            raise ValueError("The reference ID does not identify the selected matter file.")
        snapshot_id = f"REF-{digest([matter_id, selection.kind, selection.path, selection.reference_id, revision])[:24]}"
        snapshot_path = f"{base}/continuity/snapshots/{snapshot_id}.md"
        snapshot_meta = {
            "record_type": "continuity_reference", "matter_id": matter_id,
            "reference_id": selection.reference_id, "kind": selection.kind,
            "original_path": selection.path, "revision": revision, "content_hash": digest(text),
            "immutable": True,
        }
        if self.vault.exists(snapshot_path):
            prior = self.vault.read_markdown(snapshot_path)
            if prior["content"] != text or prior["metadata"].get("content_hash") != digest(text):
                raise WorkspaceConflict("The frozen reference does not match its saved snapshot.", revision, code="source_conflict")
        else:
            self.vault.write_markdown(snapshot_path, text, snapshot_meta)
        return FrozenReference(
            reference_id=selection.reference_id, kind=selection.kind,
            title=selection.title or str(metadata.get("title") or candidate.name), path=selection.path,
            revision=revision, content_hash=digest(text), text=text, snapshot_path=snapshot_path,
            source_id=metadata.get("source_id"), original_path=selection.path,
        ).model_dump()

    def _receipt(self, matter_id: str, key: str, operation: str, state: str,
                 before: str | None, after: str | None, paths: list[str],
                 completed: list[str], failure: str | None = None) -> dict[str, Any]:
        return InteractionReceipt(
            receipt_id=f"IRC-{digest([matter_id, operation, key])[:24]}",
            source_action_key=key, operation=operation,
            target=ConversationTarget(matter_id=matter_id), state=state,
            before_revision=before, after_revision=after, changed_links=paths,
            completed_parts=completed, failure_detail=failure, created_at=iso_now(),
        ).model_dump()

    @serialized
    def create_handoff(self, matter_id: str, command: HandoffCommand | dict[str, Any], *, actor: ActionActor) -> dict[str, Any]:
        data = HandoffCommand.model_validate(command)
        payload = data.model_dump()
        target = {"matter_id": matter_id, "work_item_id": data.scope.work_item_id, "recipient_id": data.recipient_id}
        retry = self._find_operation(matter_id, "handoff.create", data.source_action_key)
        if retry:
            _, handoff, saved = retry
            self._check_replay(saved, "handoff.create", payload, target)
            receipt = saved.get("receipt") or self._receipt(matter_id, data.source_action_key, "handoff.create", "applied", None, handoff["revision"], [handoff["path"]], ["handoff"])
            return HandoffResult(handoff=handoff, receipt=receipt).model_dump()
        current = ScopeSnapshot.model_validate(self.scope(matter_id, work_item_id=data.scope.work_item_id))
        if data.scope.model_dump() != current.model_dump():
            raise WorkspaceConflict("The handoff scope changed. Refresh before sending.", current.ownership_revision, code="ownership_conflict")
        if current.owner_id is not None and current.owner_id != actor.person_id:
            raise ValueError("Only the current owner can hand off this scope.")
        recipient = self._recipient(data.recipient_id)
        if recipient.person_id == actor.person_id:
            raise ValueError("Choose another handoff recipient.")
        references = [self._freeze_reference(matter_id, item) for item in data.references]
        base, _ = self._matter(matter_id)
        handoff_id = f"HOF-{digest([matter_id, 'handoff.create', data.source_action_key])[:24]}"
        path = f"{base}/continuity/handoffs/{handoff_id}.md"
        now = iso_now()
        handoff = Handoff(
            handoff_id=handoff_id, matter_id=matter_id, path=path, sender=actor,
            recipient=recipient, scope=current, ask=data.ask.strip(), current_basis=data.current_basis,
            open_questions=data.open_questions, references=references, requested_date=data.requested_date,
            revision="pending", created_at=now,
        ).model_dump()
        handoff["revision"] = digest(handoff)
        receipt = self._receipt(matter_id, data.source_action_key, "handoff.create", "applied", None, handoff["revision"], [path], ["handoff"])
        operation = self._operation("handoff.create", data.source_action_key, payload, target, actor)
        operation.update({"completed_parts": ["handoff"], "receipt": receipt})
        body = f"# Handoff: {current.title}\n\n## Ask\n\n{handoff['ask']}\n\n## Current basis\n\n{data.current_basis}\n"
        self.vault.write_markdown(path, body, {"record_type": "workspace_handoff", "matter_id": matter_id, "handoff": handoff, "operations": [operation]})
        return HandoffResult(handoff=handoff, receipt=receipt).model_dump()

    def _save_action(self, doc: dict[str, Any], handoff: dict[str, Any], operation: dict[str, Any]) -> None:
        metadata = doc["metadata"]
        operations = [item for item in metadata.get("operations", []) if not (
            item.get("operation") == operation["operation"] and item.get("source_action_key") == operation["source_action_key"]
        )]
        metadata.update({"handoff": handoff, "operations": [*operations, operation]})
        self.vault.write_markdown(doc["path"], doc["content"], metadata)

    @serialized
    def act_on_handoff(self, matter_id: str, handoff_id: str, command: HandoffAction | dict[str, Any], *, actor: ActionActor) -> dict[str, Any]:
        data = HandoffAction.model_validate(command)
        payload = data.model_dump()
        target = {"matter_id": matter_id, "handoff_id": handoff_id}
        retry = self._find_operation(matter_id, "handoff.act", data.source_action_key)
        if retry:
            doc, handoff, operation = retry
            saved_actor = self._check_replay(operation, "handoff.act", payload, target)
            if (operation.get("receipt") or {}).get("state") == "applied":
                reciprocal = self._get_handoff(matter_id, handoff.get("return_handoff_id")) if data.action == "return" else None
                return HandoffResult(handoff=handoff, reciprocal_handoff=reciprocal, receipt=operation["receipt"]).model_dump()
            actor = saved_actor
        else:
            doc, handoff = self._get_handoff_document(matter_id, handoff_id)
            operation = self._operation("handoff.act", data.source_action_key, payload, target, actor)

        doc, handoff = self._get_handoff_document(matter_id, handoff_id)
        if data.expected_revision != handoff["revision"]:
            raise WorkspaceConflict("The handoff changed. Refresh before acting.", handoff["revision"])
        if data.action in {"accept", "decline", "withdraw"} and handoff["state"] != "pending":
            raise WorkspaceConflict("This handoff is no longer pending.", handoff["revision"])
        current = ScopeSnapshot.model_validate(self.scope(matter_id, work_item_id=handoff["scope"].get("work_item_id")))

        if data.action == "accept":
            if not retry and actor.person_id != handoff["recipient"]["person_id"]:
                raise ValueError("Only the handoff recipient can accept it.")
            if data.expected_content_revision != current.content_revision:
                raise WorkspaceConflict("The work changed. Review it before accepting.", current.content_revision, code="revision_conflict")
            expected_scope = ScopeSnapshot.model_validate(handoff["scope"])
            if not retry and data.expected_ownership_revision != current.ownership_revision:
                raise WorkspaceConflict("The owner changed. Prepare a new handoff.", current.ownership_revision, code="ownership_conflict")
            if not retry:
                self._save_action(doc, handoff, operation)
                doc, handoff = self._get_handoff_document(matter_id, handoff_id)
            try:
                committed = self.transfer_owner(
                    expected=expected_scope, recipient=DemoPerson.model_validate(handoff["recipient"]),
                    actor=actor, source_action_key=data.source_action_key,
                )
            except OSError as exc:
                after_failure = self.scope(
                    matter_id, work_item_id=expected_scope.work_item_id,
                )
                canonical_saved = (
                    after_failure["owner_id"] == handoff["recipient"]["person_id"]
                    and self.vault.read_markdown(after_failure["path"])["metadata"].get("ownership_action_key")
                    == data.source_action_key
                )
                completed = ["canonical_owner"] if canonical_saved else []
                links = [after_failure["path"]] if canonical_saved else []
                receipt = self._receipt(
                    matter_id, data.source_action_key, "handoff.act", "not_saved",
                    expected_scope.ownership_revision,
                    after_failure["ownership_revision"] if canonical_saved else None,
                    links, completed, str(exc),
                )
                operation["completed_parts"] = completed
                operation["receipt"] = receipt
                self._save_action(doc, handoff, operation)
                return HandoffResult(handoff=handoff, receipt=receipt).model_dump()
            handoff["state"] = "accepted"
            handoff["accepted_ownership_revision"] = committed.ownership_revision
            handoff["result_paths"] = [committed.path]
            completed = ["canonical_owner"]
            if committed.kind == "matter":
                base, _ = self._matter(matter_id)
                handoff["result_paths"].append(f"{base}/participants.md")
                completed.append("participant_projection")
            completed.extend(["index_refresh", "handoff"])
        elif data.action == "decline":
            if not retry and actor.person_id != handoff["recipient"]["person_id"]:
                raise ValueError("Only the handoff recipient can decline it.")
            if not data.reason.strip():
                raise ValueError("A decline reason is required.")
            handoff.update({"state": "declined", "reason": data.reason.strip()})
            completed = ["handoff"]
        elif data.action == "withdraw":
            if not retry and actor.person_id != handoff["sender"]["person_id"]:
                raise ValueError("Only the handoff sender can withdraw it.")
            handoff.update({"state": "withdrawn", "reason": data.reason.strip()})
            completed = ["handoff"]
        else:
            reciprocal, returned_handoff, return_receipt = self._return_handoff(
                matter_id, doc, handoff, data, actor, current, operation,
                replay=bool(retry),
            )
            return HandoffResult(
                handoff=returned_handoff, reciprocal_handoff=reciprocal,
                receipt=return_receipt,
            ).model_dump()

        before = handoff["revision"]
        handoff["revision"] = digest({**handoff, "revision": None})
        receipt = self._receipt(matter_id, data.source_action_key, "handoff.act", "applied", before, handoff["revision"], [handoff["path"], *handoff.get("result_paths", [])], completed)
        operation.update({"completed_parts": completed, "receipt": receipt})
        self._save_action(doc, handoff, operation)
        return HandoffResult(handoff=handoff, receipt=receipt).model_dump()

    def _return_handoff(self, matter_id, doc, handoff, data, actor, current, operation, *, replay):
        if handoff["state"] != "accepted":
            raise WorkspaceConflict("Only an accepted handoff can be returned.", handoff["revision"])
        if not data.reason.strip():
            raise ValueError("A return ask is required.")
        if not replay and (actor.person_id != handoff["recipient"]["person_id"] or current.owner_id != actor.person_id):
            raise ValueError("Only the current recipient owner can return this work.")
        if not replay and current.ownership_revision != handoff.get("accepted_ownership_revision"):
            raise WorkspaceConflict(
                "The scope was assigned again after this handoff was accepted.",
                current.ownership_revision, code="ownership_conflict",
            )
        if data.expected_ownership_revision != current.ownership_revision:
            raise WorkspaceConflict("The owner changed. Refresh before returning.", current.ownership_revision, code="ownership_conflict")
        if data.expected_content_revision != current.content_revision:
            raise WorkspaceConflict("The work changed. Review it before returning.", current.content_revision)
        if not replay:
            self._save_action(doc, handoff, operation)
            doc, handoff = self._get_handoff_document(matter_id, handoff["handoff_id"])
        prior_return = next((
            item for item in doc["metadata"].get("operations", [])
            if item.get("operation") == "handoff.act"
            and item.get("source_action_key") != data.source_action_key
            and (item.get("command") or {}).get("action") == "return"
            and "reciprocal_handoff" in item.get("completed_parts", [])
        ), None)
        if prior_return:
            raise WorkspaceConflict(
                "This accepted handoff already has a pending return.",
                handoff["revision"], code="action_key_conflict",
            )
        existing_id = handoff.get("return_handoff_id")
        if not existing_id:
            for item in self.list_handoffs(matter_id):
                if item.get("prior_handoff_id") == handoff["handoff_id"] and item["state"] == "pending":
                    existing_id = item["handoff_id"]
                    break
        if existing_id:
            if not replay:
                raise WorkspaceConflict(
                    "This accepted handoff already has a pending return.",
                    handoff["revision"], code="action_key_conflict",
                )
            reciprocal = self._get_handoff(matter_id, existing_id)
        else:
            sender = ActionActor.model_validate(handoff["sender"])
            recipient = DemoPerson(person_id=sender.person_id, display_name=sender.display_name)
            base, _ = self._matter(matter_id)
            reciprocal_id = f"HOF-{digest([matter_id, handoff['handoff_id'], data.source_action_key, 'return'])[:24]}"
            path = f"{base}/continuity/handoffs/{reciprocal_id}.md"
            reciprocal = Handoff(
                handoff_id=reciprocal_id, matter_id=matter_id, path=path, sender=actor,
                recipient=recipient, scope=current, ask=data.reason.strip(), prior_handoff_id=handoff["handoff_id"],
                revision="pending", created_at=iso_now(),
            ).model_dump()
            reciprocal["revision"] = digest(reciprocal)
            try:
                self.vault.write_markdown(path, f"# Return: {current.title}\n\n## Ask\n\n{data.reason.strip()}\n", {
                    "record_type": "workspace_handoff", "matter_id": matter_id, "handoff": reciprocal, "operations": [],
                })
            except OSError as exc:
                receipt = self._receipt(
                    matter_id, data.source_action_key, "handoff.act", "not_saved",
                    handoff["revision"], None, [], [], str(exc),
                )
                operation["receipt"] = receipt
                try:
                    self._save_action(doc, handoff, operation)
                except OSError:
                    pass
                return None, handoff, receipt
        handoff["return_handoff_id"] = reciprocal["handoff_id"]
        before = handoff["revision"]
        handoff["revision"] = digest({**handoff, "revision": None})
        operation = next(item for item in doc["metadata"].get("operations", []) if item.get("operation") == "handoff.act" and item.get("source_action_key") == data.source_action_key)
        receipt = self._receipt(matter_id, data.source_action_key, "handoff.act", "applied", before, handoff["revision"], [handoff["path"], reciprocal["path"]], ["reciprocal_handoff", "parent_link"])
        operation.update({"completed_parts": ["reciprocal_handoff", "parent_link"], "receipt": receipt})
        try:
            self._save_action(doc, handoff, operation)
        except OSError as exc:
            receipt = self._receipt(
                matter_id, data.source_action_key, "handoff.act", "not_saved",
                before, None, [reciprocal["path"]], ["reciprocal_handoff"], str(exc),
            )
            return reciprocal, {**handoff, "return_handoff_id": None, "revision": before}, receipt
        return reciprocal, handoff, receipt

    def _get_handoff_document(self, matter_id: str, handoff_id: str):
        for path in self._handoff_paths(matter_id):
            doc, handoff = self._load_handoff(path)
            if handoff.get("handoff_id") == handoff_id:
                return doc, handoff
        raise KeyError(f"Handoff not found: {handoff_id}")

    def _get_handoff(self, matter_id: str, handoff_id: str | None):
        return self._get_handoff_document(matter_id, handoff_id)[1] if handoff_id else None

    def _all_matters(self):
        root = self.vault.resolve("03_Matters")
        for path in root.glob("*/matter.md") if root.exists() else []:
            doc = self.vault.read_markdown(self.vault.relative(path))
            matter_id = doc["metadata"].get("matter_id")
            if matter_id:
                yield str(matter_id), doc

    def queue(self, *, actor: ActionActor, view: str = "my_work") -> list[dict[str, Any]]:
        if view not in {"my_work", "waiting", "team"}:
            raise ValueError("Unknown team queue.")
        rows = []
        for matter_id, matter_doc in self._all_matters():
            matter_title = str(matter_doc["metadata"].get("title") or matter_id)
            scopes = [self.scope(matter_id)]
            base = self.vault.relative(self.vault.resolve(matter_doc["path"]).parent)
            for path in self.vault.iter_files(f"{base}/work-items", {".md"}):
                meta = self.vault.read_markdown(self.vault.relative(path))["metadata"]
                if meta.get("work_item_id"):
                    scopes.append(self.scope(matter_id, work_item_id=meta["work_item_id"]))
            handoffs = self.list_handoffs(matter_id)
            for scope in scopes:
                if scope["status"] in {"done", "closed"}:
                    continue
                relevant = next((h for h in reversed(handoffs) if h["scope"]["kind"] == scope["kind"] and h["scope"].get("work_item_id") == scope.get("work_item_id")), None)
                queue_name = "team"
                label, state, handoff_id = "Open work", "ready", None
                if relevant and relevant["state"] == "pending":
                    handoff_id = relevant["handoff_id"]
                    if relevant["recipient"]["person_id"] == actor.person_id:
                        queue_name, label = "my_work", "Review handoff"
                    elif relevant["sender"]["person_id"] == actor.person_id:
                        queue_name, label, state = "waiting", "Waiting for handoff response", "waiting"
                    else:
                        queue_name = "team"
                elif scope["owner_id"] == actor.person_id:
                    queue_name, label = "my_work", "Continue work"
                elif relevant and relevant["state"] == "accepted" and relevant["sender"]["person_id"] == actor.person_id:
                    queue_name, label = "team", "Shared result available"
                if view != "team" and queue_name != view:
                    continue
                if view == "team":
                    queue_name = "team"
                item_id = handoff_id or scope.get("work_item_id") or matter_id
                action = {
                    "action_id": f"team:{item_id}:{queue_name}", "label": label,
                    "reason": scope["title"], "state": state,
                    "target": {"matter_id": matter_id, "kind": "handoff" if handoff_id else scope["kind"],
                               "target_id": handoff_id or scope.get("work_item_id") or matter_id,
                               "path": scope["path"], "revision": scope["content_revision"]},
                    "owner_id": scope["owner_id"], "owner_name": scope["owner_name"],
                    "actor_kind": "lawyer" if scope["owner_id"] else "unknown", "required": False,
                }
                rows.append(TeamWorkItem(
                    item_id=item_id, matter_id=matter_id, matter_title=matter_title,
                    title=scope["title"], state=state, queue=queue_name, action=action,
                    handoff_id=handoff_id,
                ).model_dump())
        return sorted(rows, key=lambda item: (item["matter_title"].casefold(), item["title"].casefold(), item["item_id"]))

    def seen(self, matter_id: str, *, actor: ActionActor) -> dict[str, Any]:
        _, _ = self._matter(matter_id)
        doc = self.workspace._document(matter_id, "workspace.md")
        if actor.mode == "single":
            raw = doc["metadata"].get("local_seen", {})
        else:
            raw = (doc["metadata"].get("continuity_seen", {}) or {}).get(actor.person_id, {})
        return PersonViewState(person_id=actor.person_id, **(raw if isinstance(raw, dict) else {})).model_dump()

    @serialized
    def mark_seen(self, matter_id: str, *, actor: ActionActor, expected_revision: str) -> dict[str, Any]:
        recap = self.workspace.recap(matter_id)
        if expected_revision != recap["current_revision"]:
            raise WorkspaceConflict("This recap changed. Refresh before marking it seen.", recap["current_revision"])
        doc = self.workspace._document(matter_id, "workspace.md")
        failures = []
        outputs = self.workspace._output_revisions(matter_id, failures=failures)
        previous = self.seen(matter_id, actor=actor)
        for failure in failures:
            if failure["path"] in previous["output_revisions"]:
                outputs[failure["path"]] = previous["output_revisions"][failure["path"]]
        state = PersonViewState(
            person_id=actor.person_id, revision=expected_revision,
            source_revisions=self.workspace.source_revisions(matter_id),
            output_revisions=outputs, seen_at=iso_now(),
        ).model_dump(exclude={"person_id"})
        if actor.mode == "single":
            doc["metadata"]["local_seen"] = state
        else:
            cursors = dict(doc["metadata"].get("continuity_seen", {}) or {})
            cursors[actor.person_id] = state
            doc["metadata"]["continuity_seen"] = cursors
        self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
        return self.seen(matter_id, actor=actor)
