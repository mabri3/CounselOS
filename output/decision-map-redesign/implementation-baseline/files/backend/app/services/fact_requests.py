"""Durable requests and supplied replies for existing supporting questions."""
from __future__ import annotations

from typing import Any

import frontmatter

from app.models.continuity import (
    ActionActor,
    FactReply,
    FactReplyCommand,
    FactRequest,
    FactRequestAction,
    FactRequestCommand,
    FactRequestEdit,
    FactRequestResult,
    ReassessmentIntent,
    RecordReplyCommand,
)
from app.models.workspace import ConversationTarget, InteractionReceipt
from app.services.dossier import serialized
from app.services.matter_records import MatterRecordService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, WorkspaceService, digest
from app.utils.time import iso_now


class FactRequestService:
    """Compose fact-request state over workspace questions and canonical facts."""

    def __init__(self, vault: VaultService, matters: MatterService,
                 workspace: WorkspaceService, records: MatterRecordService):
        self.vault = vault
        self.matters = matters
        self.workspace = workspace
        self.records = records

    def _workspace(self, matter_id: str) -> dict[str, Any]:
        return self.workspace._document(matter_id, "workspace.md")

    def _reply_path(self, matter_id: str, reply_id: str) -> str:
        path = f"{self.matters.matter_path(matter_id)}/continuity/replies/{reply_id}.md"
        self.vault.resolve(path).relative_to(self.vault.resolve(self.matters.matter_path(matter_id)))
        return path

    @staticmethod
    def _revision(request: dict[str, Any]) -> str:
        return digest({key: value for key, value in request.items() if key not in {"revision", "stale"}})

    @staticmethod
    def _operation(name: str) -> str:
        return f"fact_request.{name}"

    def _requests(self, matter_id: str) -> list[dict[str, Any]]:
        raw = self._workspace(matter_id)["metadata"].get("continuity_requests", [])
        result = []
        for saved in raw:
            item = dict(saved)
            replies = []
            for projection in item.get("replies", []):
                reply = dict(projection)
                path = reply.get("path")
                if path and self.vault.exists(path):
                    source = self._reply_from_source(path)
                    source["linked_fact_ids"] = list(reply.get("linked_fact_ids", []))
                    reply = source
                replies.append(reply)
            item["replies"] = replies
            result.append(FactRequest.model_validate(item).model_dump())
        return result

    def _find(self, matter_id: str, request_id: str) -> dict[str, Any]:
        request = next((item for item in self._requests(matter_id)
                        if item["request_id"] == request_id), None)
        if request is None:
            raise ValueError("Fact request not found in this matter.")
        return request

    def _question(self, matter_id: str, question_id: str) -> dict[str, Any]:
        question = next((item for item in self.workspace.questions(matter_id)
                         if item["question_id"] == question_id), None)
        if question is None:
            raise ValueError("Supporting question not found in this matter.")
        return question

    def _project_stale(self, matter_id: str, request: dict[str, Any]) -> dict[str, Any]:
        result = dict(request)
        current = next((item for item in self.workspace.questions(matter_id)
                        if item["question_id"] == request["question_id"]), None)
        business = self.workspace.business_question(matter_id)
        operations = self._workspace(matter_id)["metadata"].get("continuity_operations", [])
        recorded_keys = {
            item.get("source_action_key") for item in operations
            if item.get("operation") == self._operation("record_reply")
            and item.get("target", {}).get("request_id") == request["request_id"]
            and item.get("receipt", {}).get("state") == "applied"
        }
        own_question_update = bool(
            current and current.get("source_action_key") in recorded_keys
        )
        result["stale"] = (
            current is None
            or (current["source_revision"] != request["question_revision"] and not own_question_update)
            or business["revision"] != request["business_question_revision"]
        )
        return FactRequest.model_validate(result).model_dump()

    def list(self, matter_id: str) -> list[dict[str, Any]]:
        return [self._project_stale(matter_id, item) for item in self._requests(matter_id)]

    def get(self, matter_id: str, request_id: str) -> dict[str, Any]:
        return self._project_stale(matter_id, self._find(matter_id, request_id))

    def _journal(self, matter_id: str, operation: str, key: str,
                 command: dict[str, Any], target: dict[str, Any],
                 actor: ActionActor) -> tuple[dict[str, Any], bool]:
        """Match a replay before using the current actor, or save the first actor."""
        doc = self._workspace(matter_id)
        entries = list(doc["metadata"].get("continuity_operations", []))
        fingerprint = digest({"operation": operation, "command": command, "target": target})
        saved = next((item for item in entries
                      if item.get("operation") == operation
                      and item.get("source_action_key") == key), None)
        if saved is not None:
            if saved.get("fingerprint") != fingerprint:
                raise WorkspaceConflict(
                    "This action key was already used for a different request.",
                    str(saved.get("after_revision") or ""), code="action_key_conflict",
                )
            return saved, True
        saved = {
            "operation": operation,
            "source_action_key": key,
            "fingerprint": fingerprint,
            "command": command,
            "target": target,
            "actor": actor.model_dump(),
            "created_at": iso_now(),
        }
        doc["metadata"]["continuity_operations"] = [*entries, saved]
        self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
        return saved, False

    def _save_request(self, matter_id: str, request: dict[str, Any],
                      *, receipt: dict[str, Any] | None = None) -> dict[str, Any]:
        """Merge into a fresh workspace document while holding WORKSPACE_LOCK."""
        request = dict(request)
        request["revision"] = self._revision(request)
        clean = FactRequest.model_validate(request).model_dump()
        doc = self._workspace(matter_id)
        items = list(doc["metadata"].get("continuity_requests", []))
        doc["metadata"]["continuity_requests"] = [
            *[item for item in items if item.get("request_id") != clean["request_id"]],
            clean,
        ]
        if receipt is not None:
            operations = list(doc["metadata"].get("continuity_operations", []))
            for operation in operations:
                if (operation.get("operation") == receipt["operation"]
                        and operation.get("source_action_key") == receipt["source_action_key"]):
                    operation["receipt"] = receipt
                    operation["after_revision"] = clean["revision"]
            doc["metadata"]["continuity_operations"] = operations
        self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
        return clean

    def _receipt(self, matter_id: str, request: dict[str, Any], operation: str,
                 key: str, state: str, before: str | None, completed: list[str],
                 links: list[str], *, failure: str | None = None) -> dict[str, Any]:
        return InteractionReceipt(
            receipt_id=f"IRC-{digest(matter_id + ':' + operation + ':' + key)[:24]}",
            source_action_key=key,
            operation=operation,
            target=ConversationTarget(
                matter_id=matter_id,
                business_question_id=self.workspace.business_question(matter_id)["question_id"],
                issue_id=request.get("issue_id"),
            ),
            state=state,
            before_revision=before,
            after_revision=self._revision(request) if state == "applied" else before,
            changed_links=links,
            completed_parts=completed,
            failure_detail=failure,
            created_at=iso_now(),
        ).model_dump()

    def _saved_result(self, matter_id: str, operation: dict[str, Any]) -> dict[str, Any] | None:
        receipt = operation.get("receipt")
        request_id = operation.get("target", {}).get("request_id")
        if receipt and receipt.get("state") == "applied" and request_id:
            request = self._find(matter_id, request_id)
            return FactRequestResult(
                request=request,
                receipt=receipt,
                reassessment=operation.get("reassessment"),
            ).model_dump()
        return None

    def _write_reply(self, path: str, text: str, metadata: dict[str, Any]) -> None:
        """Write frontmatter plus the supplied body without normalizing the body."""
        header = frontmatter.dumps(frontmatter.Post("", **metadata))
        resolved = self.vault.resolve(path)
        resolved.parent.mkdir(parents=True, exist_ok=True)
        self.vault._atomic_write(resolved, header + text)

    def _validate_links(self, matter_id: str, issue_id: str | None,
                        work_item_id: str | None) -> None:
        if issue_id and issue_id not in {item["issue_id"] for item in self.workspace.issues(matter_id)}:
            raise ValueError("Issue not found in this matter.")
        if work_item_id:
            work_ids = {str(item.get("work_item_id"))
                        for item in self.matters.get(matter_id).get("work_items", [])}
            if work_item_id not in work_ids:
                raise ValueError("Work item not found in this matter.")

    @serialized
    def create(self, matter_id: str, command: FactRequestCommand | dict,
               *, actor: ActionActor) -> dict:
        data = FactRequestCommand.model_validate(command).model_dump()
        operation = self._operation("create")
        request_id = f"FRQ-{digest(matter_id + ':' + data['source_action_key'])[:24]}"
        target = {"matter_id": matter_id, "question_id": data["question_id"],
                  "request_id": request_id}
        journal, replay = self._journal(matter_id, operation, data["source_action_key"], data, target, actor)
        if replay and (saved := self._saved_result(matter_id, journal)):
            return saved
        actor = ActionActor.model_validate(journal["actor"])
        question = self._question(matter_id, data["question_id"])
        business = self.workspace.business_question(matter_id)
        self.workspace._check(data["expected_question_revision"], question["source_revision"])
        self.workspace._check(data["business_question_revision"], business["revision"])
        if question["business_question_revision"] != business["revision"]:
            raise WorkspaceConflict("The supporting question belongs to an earlier business question.", question["source_revision"], code="question_scope_conflict")
        self._validate_links(matter_id, data["issue_id"], data["work_item_id"])
        request = FactRequest(
            request_id=request_id, matter_id=matter_id,
            question_id=question["question_id"], question_text=question["text"],
            question_revision=question["source_revision"],
            business_question_revision=business["revision"],
            wording=data["wording"], requested_person=data["requested_person"],
            due_at=data["due_at"], issue_id=data["issue_id"], work_item_id=data["work_item_id"],
            created_by=actor, created_at=iso_now(), revision="pending",
        ).model_dump()
        request = self._save_request(matter_id, request)
        receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                "applied", None, ["fact_request"], [self._workspace(matter_id)["path"]])
        request = self._save_request(matter_id, request, receipt=receipt)
        receipt["after_revision"] = request["revision"]
        return FactRequestResult(request=request, receipt=receipt).model_dump()

    @serialized
    def edit(self, matter_id: str, request_id: str, command: FactRequestEdit | dict,
             *, actor: ActionActor) -> dict:
        data = FactRequestEdit.model_validate(command).model_dump()
        operation = self._operation("edit")
        journal, replay = self._journal(matter_id, operation, data["source_action_key"], data,
                                        {"matter_id": matter_id, "request_id": request_id}, actor)
        if replay and (saved := self._saved_result(matter_id, journal)):
            return saved
        request = self._find(matter_id, request_id)
        self.workspace._check(data["expected_revision"], request["revision"])
        if request["state"] != "prepared":
            raise ValueError("Only a prepared fact request can be edited.")
        before = request["revision"]
        request.update(wording=data["wording"], requested_person=data["requested_person"], due_at=data["due_at"])
        request = self._save_request(matter_id, request)
        receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                "applied", before, ["fact_request"], [self._workspace(matter_id)["path"]])
        request = self._save_request(matter_id, request, receipt=receipt)
        receipt["after_revision"] = request["revision"]
        return FactRequestResult(request=request, receipt=receipt).model_dump()

    @serialized
    def act(self, matter_id: str, request_id: str, command: FactRequestAction | dict,
            *, actor: ActionActor) -> dict:
        data = FactRequestAction.model_validate(command).model_dump()
        operation = self._operation("act")
        journal, replay = self._journal(matter_id, operation, data["source_action_key"], data,
                                        {"matter_id": matter_id, "request_id": request_id}, actor)
        if replay and (saved := self._saved_result(matter_id, journal)):
            return saved
        request = self._find(matter_id, request_id)
        self.workspace._check(data["expected_revision"], request["revision"])
        before = request["revision"]
        if data["action"] == "requested_externally":
            if request["state"] != "prepared":
                raise ValueError("Requested externally cannot replace this request state.")
            request.update(state="requested_externally", requested_at=iso_now())
        else:
            request["state"] = "left_open"
        request = self._save_request(matter_id, request)
        receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                "applied", before, ["fact_request"], [self._workspace(matter_id)["path"]])
        request = self._save_request(matter_id, request, receipt=receipt)
        receipt["after_revision"] = request["revision"]
        return FactRequestResult(request=request, receipt=receipt).model_dump()

    def _reply_from_source(self, path: str) -> dict[str, Any]:
        doc = self.vault.read_markdown(path)
        metadata = doc["metadata"]
        raw = self.vault.resolve(path).read_bytes()
        lines = raw.splitlines(keepends=True)
        closing = next(
            (index for index, line in enumerate(lines[1:], start=1)
             if line.rstrip(b"\r\n") == b"---"),
            None,
        )
        if not lines or lines[0].rstrip(b"\r\n") != b"---" or closing is None:
            raise ValueError("Supplied reply source has invalid Markdown frontmatter.")
        exact_text = b"".join(lines[closing + 1:]).decode("utf-8")
        return FactReply(
            reply_id=metadata["reply_id"], source_id=metadata["source_id"], path=path,
            text=exact_text, content_hash=metadata["content_hash"],
            entered_by=metadata["entered_by"], reported_speaker=metadata.get("reported_speaker"),
            reported_at=metadata.get("reported_at"), created_at=metadata["created_at"],
        ).model_dump()

    @serialized
    def save_reply(self, matter_id: str, request_id: str, command: FactReplyCommand | dict,
                   *, actor: ActionActor) -> dict:
        data = FactReplyCommand.model_validate(command).model_dump()
        operation = self._operation("save_reply")
        target = {"matter_id": matter_id, "request_id": request_id}
        journal, replay = self._journal(matter_id, operation, data["source_action_key"], data, target, actor)
        if replay and (saved := self._saved_result(matter_id, journal)):
            return saved
        actor = ActionActor.model_validate(journal["actor"])
        request = self._find(matter_id, request_id)
        self.workspace._check(data["expected_revision"], request["revision"])
        before = request["revision"]
        reply_id = f"RPL-{digest(matter_id + ':' + data['source_action_key'])[:24]}"
        source_id = f"SRC-{digest('reply:' + matter_id + ':' + data['source_action_key'])[:24]}"
        path = self._reply_path(matter_id, reply_id)
        content_hash = digest(data["text"])
        metadata = {
            "record_type": "supplied_fact_reply", "immutable": True,
            "matter_id": matter_id, "request_id": request_id,
            "question_id": request["question_id"], "question_text": request["question_text"],
            "question_revision": request["question_revision"],
            "business_question_revision": request["business_question_revision"],
            "reply_id": reply_id, "source_id": source_id, "content_hash": content_hash,
            "entered_by": actor.model_dump(), "reported_speaker": data["reported_speaker"],
            "reported_at": data["reported_at"], "created_at": iso_now(),
            "source_action_key": data["source_action_key"],
        }
        if self.vault.exists(path):
            reply = self._reply_from_source(path)
            if reply["text"] != data["text"] or reply["content_hash"] != content_hash:
                raise WorkspaceConflict("This reply source already contains different text.", request["revision"], code="action_key_conflict")
        else:
            self._write_reply(path, data["text"], metadata)
            reply = self._reply_from_source(path)
        request["replies"] = [
            *[item for item in request["replies"] if item["reply_id"] != reply_id], reply,
        ]
        request["state"] = "reply_saved"
        request = self._save_request(matter_id, request)
        receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                "applied", before, ["reply_source", "fact_request"],
                                [path, self._workspace(matter_id)["path"]])
        request = self._save_request(matter_id, request, receipt=receipt)
        receipt["after_revision"] = request["revision"]
        return FactRequestResult(request=request, receipt=receipt).model_dump()

    def _fact_action(self, matter_id: str, key: str) -> dict[str, Any] | None:
        return next((item for item in self.records.get(matter_id)["actions"]
                     if item.get("source_action_key") == key), None)

    def _request_record_keys(self, matter_id: str, request_id: str) -> set[str]:
        return {
            item.get("source_action_key") for item in
            self._workspace(matter_id)["metadata"].get("continuity_operations", [])
            if item.get("operation") == self._operation("record_reply")
            and item.get("target", {}).get("request_id") == request_id
            and item.get("receipt", {}).get("state") == "applied"
        }

    def _validate_fact_action(self, matter_id: str, action: dict[str, Any],
                              request_id: str, reply: dict[str, Any],
                              data: dict[str, Any], actor: ActionActor) -> None:
        records = self.records.get(matter_id)
        fact_ids = action.get("created", {}).get("facts", [])
        facts = [item for item in records["facts"] if item["fact_id"] in fact_ids]
        sources = [item for item in records["sources"]
                   if item["source_id"] in action.get("created", {}).get("sources", [])]
        valid = (
            len(facts) == 1 and facts[0]["text"] == data["answer_text"]
            and facts[0].get("source_ids") == [reply["source_id"]]
            and facts[0].get("supersedes") == data["supersedes_fact_id"]
            and len(sources) == 1 and sources[0]["source_id"] == reply["source_id"]
            and sources[0].get("path") == reply["path"]
            and action.get("request_id") == request_id
            and action.get("reply_id") == reply["reply_id"]
            and action.get("action_actor") == actor.model_dump()
        )
        if not valid:
            raise WorkspaceConflict(
                "The saved fact action does not match this reply command.",
                str(action.get("action_id") or ""), code="action_key_conflict",
            )

    @serialized
    def record_reply(self, matter_id: str, request_id: str, reply_id: str,
                     command: RecordReplyCommand | dict, *, actor: ActionActor) -> dict:
        data = RecordReplyCommand.model_validate(command).model_dump()
        if data["coverage"] == "partial" and not str(data.get("remaining_question") or "").strip():
            raise ValueError("A partial answer needs the remaining question.")
        operation = self._operation("record_reply")
        target = {"matter_id": matter_id, "request_id": request_id, "reply_id": reply_id}
        journal, replay = self._journal(matter_id, operation, data["source_action_key"], data, target, actor)
        if replay and (saved := self._saved_result(matter_id, journal)):
            return saved
        actor = ActionActor.model_validate(journal["actor"])
        request = self._find(matter_id, request_id)
        reply = next((item for item in request["replies"] if item["reply_id"] == reply_id), None)
        if reply is None:
            raise ValueError("Reply not found on this fact request.")
        fact_key = f"continuity:{data['source_action_key']}:fact"
        action = self._fact_action(matter_id, fact_key)
        before = request["revision"]
        if action is None:
            self.workspace._check(data["expected_revision"], request["revision"])
            question = self._question(matter_id, request["question_id"])
            business = self.workspace.business_question(matter_id)
            self.workspace._check(data["expected_question_revision"], question["source_revision"])
            self.workspace._check(data["business_question_revision"], business["revision"])
            own_prior_update = question.get("source_action_key") in self._request_record_keys(
                matter_id, request_id)
            if ((question["source_revision"] != request["question_revision"] and not own_prior_update)
                    or business["revision"] != request["business_question_revision"]):
                raise WorkspaceConflict("The question scope changed before this answer was recorded.", question["source_revision"], code="question_scope_conflict")
            if data["supersedes_fact_id"]:
                prior = next((item for item in self.records.get(matter_id)["facts"]
                              if item["fact_id"] == data["supersedes_fact_id"]), None)
                if prior is None:
                    raise ValueError("The superseded fact was not found in this matter.")
            try:
                action = self.records.apply_update(
                    matter_id,
                    sources=[{"source_id": reply["source_id"], "kind": "file",
                              "label": "Supplied business reply", "path": reply["path"],
                              "content_hash": reply["content_hash"]}],
                    facts=[{"text": data["answer_text"], "source_ids": [reply["source_id"]],
                            "supersedes": data["supersedes_fact_id"]}],
                    summary="Recorded answer from supplied fact reply",
                    actor=actor.display_name,
                    source_action_key=fact_key,
                    action_metadata={"action_actor": actor.model_dump(), "reply_id": reply_id,
                                     "request_id": request_id},
                )
            except OSError:
                action = self._fact_action(matter_id, fact_key)
                if action is None:
                    raise
        self._validate_fact_action(matter_id, action, request_id, reply, data, actor)
        fact_ids = list(action.get("created", {}).get("facts", []))
        completed = ["reply_source", *( ["reported_fact"] if fact_ids else [])]
        links = [reply["path"], *( [self.records._path(matter_id)] if fact_ids else [])]
        question = self._question(matter_id, request["question_id"])
        already_applied = (
            question.get("source_action_key") == data["source_action_key"]
            and set(fact_ids) <= set(question.get("linked_fact_ids", []))
        )
        if not already_applied and question["source_revision"] != data["expected_question_revision"]:
            request["stale"] = True
            request["linked_fact_ids"] = list(dict.fromkeys([*request["linked_fact_ids"], *fact_ids]))
            for item in request["replies"]:
                if item["reply_id"] == reply_id:
                    item["linked_fact_ids"] = list(dict.fromkeys([*item["linked_fact_ids"], *fact_ids]))
            receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                    "not_saved", before, completed, links,
                                    failure="The supporting question changed after the fact was saved.")
            request = self._save_request(matter_id, request, receipt=receipt)
            return FactRequestResult(request=request, receipt=receipt).model_dump()
        try:
            if not already_applied:
                updated = dict(question)
                updated["linked_fact_ids"] = list(dict.fromkeys([*question.get("linked_fact_ids", []), *fact_ids]))
                updated["answer"] = data["answer_text"]
                updated["answer_origin"] = "reported"
                updated["source_action_key"] = data["source_action_key"]
                updated["state"] = "answered" if data["coverage"] == "full" else "open"
                question = self.workspace.save_question(
                    matter_id, updated, expected_revision=data["expected_question_revision"])
            completed.append("supporting_question")
            links.append(self.workspace._path(matter_id, "workspace.md"))
            request["linked_fact_ids"] = list(dict.fromkeys([*request["linked_fact_ids"], *fact_ids]))
            for item in request["replies"]:
                if item["reply_id"] == reply_id:
                    item["linked_fact_ids"] = list(dict.fromkeys([*item["linked_fact_ids"], *fact_ids]))
            request["state"] = "answer_recorded" if data["coverage"] == "full" else "partly_answered"
            request["remaining_question"] = None if data["coverage"] == "full" else data["remaining_question"].strip()
            request["stale"] = False
            reassessment = ReassessmentIntent(
                source_action_key=f"{data['source_action_key']}:reassess",
                fact_ids=fact_ids,
                target=ConversationTarget(
                    matter_id=matter_id,
                    business_question_id=request["question_id"] and self.workspace.business_question(matter_id)["question_id"],
                    business_question_revision=request["business_question_revision"],
                    issue_id=request.get("issue_id"), source_id=reply["source_id"],
                ),
            ).model_dump()
            receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                    "applied", before, [*completed, "fact_request"],
                                    list(dict.fromkeys(links)))
            request = self._save_request(matter_id, request, receipt=receipt)
            completed.append("fact_request")
            fresh = self._workspace(matter_id)
            operations = list(fresh["metadata"].get("continuity_operations", []))
            for item in operations:
                if item.get("operation") == operation and item.get("source_action_key") == data["source_action_key"]:
                    item["reassessment"] = reassessment
            fresh["metadata"]["continuity_operations"] = operations
            self.vault.write_markdown(fresh["path"], fresh["content"] or "# Workspace\n", fresh["metadata"])
            receipt["after_revision"] = request["revision"]
            return FactRequestResult(request=request, receipt=receipt, reassessment=reassessment).model_dump()
        except OSError as exc:
            receipt = self._receipt(matter_id, request, operation, data["source_action_key"],
                                    "not_saved", before, completed, links, failure=str(exc))
            try:
                request = self._save_request(matter_id, request, receipt=receipt)
            except OSError:
                pass
            return FactRequestResult(request=request, receipt=receipt).model_dump()
