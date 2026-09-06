"""Small workspace operations composed over the existing Markdown records.

Question text is read ONLY from dossier.md. Metadata stores identity, operation
receipts, and pointers to immutable dossier snapshots, never a competing text.
"""
from __future__ import annotations

import hashlib
import json
import re
from typing import Any

from yaml import YAMLError

from app.models.workspace import (
    BusinessQuestion, ConversationTarget, InteractionReceipt, IssueNode,
    ProposalAction, QuestionCommand, QuestionRestore, SupportingQuestionCommand,
    WorkspaceClaim, WorkspaceQuestion,
)
from app.services.dossier import DossierService, serialized
from app.services.matter_records import MatterRecordService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.time import iso_now


def digest(value: Any) -> str:
    text = value if isinstance(value, str) else json.dumps(value, sort_keys=True, default=str)
    return hashlib.sha256(text.encode()).hexdigest()


class WorkspaceConflict(ValueError):
    def __init__(self, message: str, current_revision: str, *, code: str = "revision_conflict"):
        super().__init__(message)
        self.detail = {"code": code, "message": message, "current_revision": current_revision, "recoverable": True}


class WorkspaceService:
    def __init__(self, vault: VaultService, matters: MatterService,
                 dossiers: DossierService | None = None, records: MatterRecordService | None = None):
        self.vault, self.matters = vault, matters
        self.dossiers = dossiers or DossierService(vault, matters)
        self.records = records or MatterRecordService(vault, matters)

    def _path(self, matter_id: str, name: str = "workspace.md") -> str:
        base = self.matters.matter_path(matter_id)
        path = f"{base}/{name}"
        self.vault.resolve(path).relative_to(self.vault.resolve(base))
        return path

    def _document(self, matter_id: str, name: str) -> dict[str, Any]:
        path = self._path(matter_id, name)
        return self.vault.read_markdown(path) if self.vault.exists(path) else {
            "path": path, "content": "# Matter dossier\n" if name == "dossier.md" else "",
            "metadata": {"matter_id": matter_id},
        }

    def business_question(self, matter_id: str) -> dict[str, Any]:
        doc = self._document(matter_id, "dossier.md")
        text = self.dossiers.section(doc["content"], "Decision question")
        raw = doc["metadata"].get("business_question")
        meta = raw if isinstance(raw, dict) else {}

        def optional_text(key: str) -> str | None:
            value = meta.get(key)
            return value if isinstance(value, str) and value.strip() else None

        # Malformed imported metadata must not hide useful visible question text
        # or manufacture authorship. Normalize the projection, never the file.
        origin = optional_text("origin")
        if origin not in {"provisional_agent", "explicit_lawyer", "accepted_proposal", "legacy_unknown"}:
            origin = "legacy_unknown"
        text_hash = digest(text)
        saved_hash = optional_text("text_hash")
        edited = bool(saved_hash and re.fullmatch(r"[0-9a-f]{64}", saved_hash) and saved_hash != text_hash)
        revision = f"{optional_text('revision_id') or 'legacy'}:{text_hash}"
        return BusinessQuestion(
            question_id=optional_text("question_id") or f"BQ-{digest(matter_id)[:16]}",
            text=text, revision=revision, dossier_revision=self.dossiers._hash(doc["content"]),
            origin="explicit_lawyer" if edited else origin,
            source_message_id=None if edited else optional_text("source_message_id"),
            source_action_key=None if edited else optional_text("source_action_key"),
            updated_at=None if edited else optional_text("updated_at"),
        ).model_dump()

    def _check(self, expected: str, actual: str) -> None:
        if expected != actual:
            raise WorkspaceConflict("This record changed. Refresh before applying your edit.", actual)

    @staticmethod
    def _payload(command: Any) -> dict[str, Any]:
        return command.model_dump() if hasattr(command, "model_dump") else dict(command)

    def _retry(self, doc: dict[str, Any], key: str, operation: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        fingerprint = digest({"operation": operation, "payload": payload})
        receipts = list(doc["metadata"].get("interaction_receipts", []))
        matter_id = doc["metadata"].get("matter_id")
        if matter_id:
            other = "workspace.md" if doc["path"].endswith("/dossier.md") else "dossier.md"
            receipts.extend(self._document(matter_id, other)["metadata"].get("interaction_receipts", []))
        for item in receipts:
            if item.get("source_action_key") != key:
                continue
            if item.get("request_fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was already used for a different request.", item.get("after_revision") or "", code="action_key_conflict")
            if item.get("state") != "not_saved":
                return item
        return None

    def _receipt(self, matter_id: str, command: dict[str, Any], operation: str, state: str,
                 before: str, after: str, links: list[str], **extra: Any) -> dict[str, Any]:
        key = command["source_action_key"]
        return InteractionReceipt(
            receipt_id=f"IRC-{digest(matter_id + ':' + key)[:24]}", source_action_key=key,
            operation=operation, target=ConversationTarget(matter_id=matter_id,
                business_question_id=self.business_question(matter_id)["question_id"]),
            state=state, before_revision=before, after_revision=after,
            changed_links=links, source_message_id=command.get("source_message_id"),
            run_id=command.get("run_id"), created_at=iso_now(),
            request_fingerprint=digest({"operation": operation, "payload": command}), **extra,
        ).model_dump()

    @staticmethod
    def _add_receipt(metadata: dict[str, Any], receipt: dict[str, Any]) -> None:
        receipts = [r for r in metadata.get("interaction_receipts", [])
                    if r.get("source_action_key") != receipt["source_action_key"]]
        metadata["interaction_receipts"] = [*receipts, receipt]

    def _snapshot(self, matter_id: str, doc: dict[str, Any], question: dict[str, Any]) -> dict[str, Any]:
        path = self._path(matter_id, f"dossier-revisions/BQ-{digest(question['revision'])[:32]}.md")
        if not self.vault.exists(path):
            self.vault.write_markdown(path, doc["content"], {
                **doc["metadata"], "record_type": "dossier_revision", "immutable": True,
                "question_snapshot": question, "content_hash": self.dossiers._hash(doc["content"]),
            })
        return {"revision": question["revision"], "revision_path": path}

    def question_history(self, matter_id: str) -> list[dict[str, Any]]:
        doc = self._document(matter_id, "dossier.md")
        result = []
        for ref in doc["metadata"].get("question_history", []):
            path = ref.get("revision_path", "")
            self._validate_path(matter_id, path)
            if not self.vault.exists(path):
                continue
            snapshot = self.vault.read_markdown(path)
            question = snapshot["metadata"].get("question_snapshot")
            if question:
                result.append({**question, "text": self.dossiers.section(snapshot["content"], "Decision question"), "revision_path": path})
        current = self.business_question(matter_id)
        if not any(q["revision"] == current["revision"] for q in result):
            result.append(current)
        return result

    @serialized
    def change_business_question(self, matter_id: str, command: QuestionCommand | dict[str, Any],
                                 *, origin: str = "explicit_lawyer") -> dict[str, Any]:
        data = QuestionCommand.model_validate(command).model_dump()
        return self._change(matter_id, data, operation="change_business_question", origin=origin)

    def _change(self, matter_id: str, data: dict[str, Any], *, operation: str,
                origin: str = "explicit_lawyer", proposal_id: str | None = None) -> dict[str, Any]:
        doc = self._document(matter_id, "dossier.md")
        retry = self._retry(doc, data["source_action_key"], operation, data)
        if retry:
            return retry
        current = self.business_question(matter_id)
        self._check(data["expected_revision"], current["revision"])
        if data.get("expected_dossier_revision"):
            self._check(data["expected_dossier_revision"], current["dossier_revision"])
        if origin == "provisional_agent" and current["text"]:
            raise ValueError("A provisional question can initialize an empty question only.")
        if origin not in {"explicit_lawyer", "accepted_proposal", "provisional_agent"}:
            raise ValueError("Unknown question origin.")
        text = data["text"].strip()
        if not text or re.search(r"(?m)^##\s", text):
            raise ValueError("Use question text without dossier section headings.")
        meta = doc["metadata"]
        history = list(meta.get("question_history", []))
        before_ref = self._snapshot(matter_id, doc, current)
        if not any(r.get("revision") == current["revision"] for r in history):
            history.append(before_ref)
        revision_id = digest(matter_id + ":" + data["source_action_key"])[:24]
        after = f"{revision_id}:{digest(text)}"
        meta["business_question"] = {
            "question_id": current["question_id"], "revision_id": revision_id,
            "text_hash": digest(text), "origin": origin,
            "source_message_id": data.get("source_message_id"),
            "source_action_key": data["source_action_key"], "updated_at": iso_now(),
        }
        meta["question_history"] = history
        for proposal in meta.get("question_changes", []):
            if proposal.get("proposal_id") == proposal_id:
                proposal["state"] = "applied"
            elif proposal.get("state") == "proposed":
                proposal["state"] = "superseded"
        content = self.dossiers._set_section(doc["content"], "Decision question", text)
        meta.update({"content_hash": self.dossiers._hash(content), "record_type": "dossier", "updated_at": iso_now()})
        receipt = self._receipt(matter_id, data, operation, "applied", current["revision"], after,
                                [doc["path"]], completed_parts=["business_question"])
        self._add_receipt(meta, receipt)
        # One atomic file replacement commits question, history pointer and receipt.
        self.vault.write_markdown(doc["path"], content, meta)
        return receipt

    @serialized
    def propose_business_question(self, matter_id: str, command: QuestionCommand | dict[str, Any]) -> dict[str, Any]:
        data = QuestionCommand.model_validate(command).model_dump()
        doc = self._document(matter_id, "dossier.md")
        retry = self._retry(doc, data["source_action_key"], "propose_business_question", data)
        if retry:
            return retry
        current = self.business_question(matter_id)
        self._check(data["expected_revision"], current["revision"])
        if data.get("expected_dossier_revision"):
            self._check(data["expected_dossier_revision"], current["dossier_revision"])
        text = data["text"].strip()
        if not text or re.search(r"(?m)^##\s", text):
            raise ValueError("Use question text without dossier section headings.")
        proposal_id = f"QCH-{digest(matter_id + ':' + data['source_action_key'])[:24]}"
        path = self._path(matter_id, f"dossier-revisions/{proposal_id}.md")
        self.vault.write_markdown(path, self.dossiers._set_section(doc["content"], "Decision question", text), {
            "matter_id": matter_id, "record_type": "question_proposal", "immutable": True,
            "base_question_revision": current["revision"], "proposal_id": proposal_id,
        })
        proposal = {**data, "proposal_id": proposal_id, "question_id": current["question_id"],
                    "state": "proposed", "revision_path": path, "created_at": iso_now()}
        doc["metadata"].setdefault("question_changes", []).append(proposal)
        receipt = self._receipt(matter_id, data, "propose_business_question", "proposed",
            current["revision"], current["revision"], [path], proposal_id=proposal_id, completed_parts=["proposal"])
        self._add_receipt(doc["metadata"], receipt)
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return receipt

    @serialized
    def act_on_proposal(self, matter_id: str, proposal_id: str, command: ProposalAction | dict[str, Any]) -> dict[str, Any]:
        data = ProposalAction.model_validate(command).model_dump()
        data["proposal_id"] = proposal_id
        operation = "apply_question_proposal" if data["action"] == "apply" else "reject_question_proposal"
        doc = self._document(matter_id, "dossier.md")
        proposal = next((p for p in doc["metadata"].get("question_changes", []) if p["proposal_id"] == proposal_id), None)
        if not proposal:
            raise ValueError("Question proposal not found in this matter.")
        if data["action"] == "apply":
            data["text"] = data.get("text") or proposal["text"]
        retry = self._retry(doc, data["source_action_key"], operation, data)
        if retry:
            return retry
        current = self.business_question(matter_id)
        if data["action"] == "apply":
            self._check(proposal["expected_revision"], current["revision"])
            if proposal["state"] != "proposed":
                raise ValueError("Only a pending proposal can be applied.")
            # Bind the retry fingerprint to the user's exact action, not a changed
            # reconstruction of the proposal after it has been applied.
            change = {**data, "text": data.get("text") or proposal["text"]}
            result = self._change(matter_id, change, operation=operation, origin="accepted_proposal", proposal_id=proposal_id)
            return result
        self._check(data["expected_revision"], current["revision"])
        if proposal["state"] == "applied":
            raise ValueError("An applied proposal must be restored through question history.")
        proposal["state"] = "rejected"
        receipt = self._receipt(matter_id, data, operation, "applied", current["revision"], current["revision"], [doc["path"]], completed_parts=["proposal_rejected"])
        self._add_receipt(doc["metadata"], receipt)
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return receipt

    @serialized
    def restore_business_question(self, matter_id: str, command: QuestionRestore | dict[str, Any]) -> dict[str, Any]:
        data = QuestionRestore.model_validate(command).model_dump()
        prior = next((q for q in self.question_history(matter_id) if q["revision"] == data["revision"]), None)
        if not prior:
            raise ValueError("Question revision not found in this matter.")
        return self._change(matter_id, {**data, "text": prior["text"]}, operation="restore_business_question")

    def issues(self, matter_id: str) -> list[dict[str, Any]]:
        doc = self._document(matter_id, "issues.md")
        properties = doc["metadata"].get("issue_nodes") or {}
        if not isinstance(properties, dict):
            properties = {}
        occurrences: dict[str, int] = {}
        seen: set[str] = set()
        result = []
        for line in doc["content"].splitlines():
            match = re.match(r"^\s*(?:[-*+] |\d+[.)] )(.+)$", line)
            if not match:
                continue
            title = match[1].strip()
            marker = re.search(r"\s*<!-- issue:([A-Za-z0-9_-]+) -->\s*$", title)
            raw_id = marker[1] if marker else None
            if marker:
                title = title[:marker.start()].strip()
            occurrence = occurrences.get(title, 0)
            occurrences[title] = occurrence + 1
            prefix = f"ISS-{digest(matter_id)[:10]}-"
            # Saved markers are authoritative identities, including legacy and
            # imported IDs that predate the current generated prefix.
            issue_id = raw_id if raw_id and raw_id not in seen else f"{prefix}{digest(title + ':' + str(occurrence))[:16]}"
            # An accidentally copied marker is a distinct usable item on GET.
            while issue_id in seen:
                issue_id += "x"
            seen.add(issue_id)
            extra = properties.get(issue_id, {})
            extra = dict(extra) if isinstance(extra, dict) else {}
            if extra.get("lawyer_state") not in {"open", "explored", "set_aside"}:
                extra["lawyer_state"] = "open"
            for key in ("fact_ids", "assumption_ids", "claim_ids"):
                if not isinstance(extra.get(key), list):
                    extra[key] = []
            if not isinstance(extra.get("parent_issue_id"), str):
                extra["parent_issue_id"] = None
            result.append(IssueNode.model_validate({**extra, "issue_id": issue_id, "title": title}).model_dump())
        ids = {n["issue_id"] for n in result}
        by_id = {node["issue_id"]: node for node in result}
        for node in result:
            if node["parent_issue_id"] not in ids:
                node["parent_issue_id"] = None
            visited = {node["issue_id"]}
            parent = node["parent_issue_id"]
            while parent:
                if parent in visited:
                    node["parent_issue_id"] = None
                    break
                visited.add(parent)
                parent = by_id[parent]["parent_issue_id"] if parent in by_id else None
        return result

    def issues_revision(self, matter_id: str) -> str:
        doc = self._document(matter_id, "issues.md")
        # Retry ledgers do not change issue state.  Exclude them so recording an
        # operation receipt after the issue save does not create a false edit.
        metadata = {key: value for key, value in doc["metadata"].items()
                    if key != "disposition_operations"}
        return digest({"content": doc["content"], "metadata": metadata})

    @serialized
    def save_issues(self, matter_id: str, nodes: list[dict[str, Any]], *, expected_revision: str) -> list[dict[str, Any]]:
        self._check(expected_revision, self.issues_revision(matter_id))
        current = self.issues(matter_id)
        known = {n["issue_id"] for n in current}
        clean = [IssueNode.model_validate(n).model_dump() for n in nodes]
        ids = [n["issue_id"] for n in clean]
        if len(ids) != len(set(ids)) or set(ids) != known:
            raise ValueError("Issue edits must retain this matter's existing issue IDs.")
        by_id = {n["issue_id"]: n for n in clean}
        records = self.records.get(matter_id)
        fact_ids = {f["fact_id"] for f in records["facts"]}
        assumption_ids = {f["assumption_id"] for f in records["assumptions"]}
        for node in clean:
            if not set(node["fact_ids"]) <= fact_ids or not set(node["assumption_ids"]) <= assumption_ids:
                raise ValueError("Issue facts and assumptions must belong to this matter.")
        for node in clean:
            if not node["title"].strip() or "\n" in node["title"] or "<!-- issue:" in node["title"]:
                raise ValueError("Use a single issue title.")
            visited = {node["issue_id"]}
            parent = node["parent_issue_id"]
            while parent:
                if parent not in known or parent in visited:
                    raise ValueError("Issue parents must belong to this matter and cannot form a cycle.")
                visited.add(parent)
                parent = by_id[parent]["parent_issue_id"]
            node["updated_at"] = iso_now()
        doc = self._document(matter_id, "issues.md")
        iterator = iter(clean)
        lines = []
        for line in doc["content"].splitlines():
            match = re.match(r"^(\s*(?:[-*+] |\d+[.)] ))(.+)$", line)
            if match:
                node = next(iterator)
                line = f"{match[1]}{node['title']} <!-- issue:{node['issue_id']} -->"
            lines.append(line)
        old_props = doc["metadata"].get("issue_nodes") or {}
        doc["metadata"]["issue_nodes"] = {**(old_props if isinstance(old_props, dict) else {}), **{n["issue_id"]: n for n in clean}}
        self.vault.write_markdown(doc["path"], "\n".join(lines), doc["metadata"])
        return self.issues(matter_id)

    @serialized
    def update_issue(self, matter_id: str, issue_id: str, changes: dict[str, Any], *, expected_revision: str) -> list[dict[str, Any]]:
        nodes = self.issues(matter_id)
        node = next((n for n in nodes if n["issue_id"] == issue_id), None)
        if not node:
            raise ValueError("Issue not found in this matter.")
        allowed = {"title", "parent_issue_id", "lawyer_state", "why_it_matters", "fact_ids", "assumption_ids", "claim_ids"}
        node.update({k: v for k, v in changes.items() if k in allowed})
        return self.save_issues(matter_id, nodes, expected_revision=expected_revision)

    def questions(self, matter_id: str) -> list[dict[str, Any]]:
        questions = []
        for raw in self._document(matter_id, "workspace.md")["metadata"].get("questions", []):
            if not isinstance(raw, dict):
                continue
            item = dict(raw)
            legacy_issue = item.get("issue_id") if isinstance(item.get("issue_id"), str) else None
            supplied_links = item.get("issue_ids") if isinstance(item.get("issue_ids"), list) else []
            item["issue_id"] = legacy_issue
            item["issue_ids"] = list(dict.fromkeys(
                value for value in [legacy_issue, *supplied_links]
                if isinstance(value, str) and value
            ))
            item["question_kind"] = item.get("question_kind") if item.get("question_kind") in {"factual", "legal"} else "factual"
            questions.append(WorkspaceQuestion.model_validate(item).model_dump())
        # Old intake cards are a read projection of the saved question, not a new ledger.
        business = self.business_question(matter_id)
        known = {q["question_id"] for q in questions}
        base = self.matters.matter_path(matter_id)
        for path in self.vault.iter_files(f"{base}/conversations", {".md"}):
            if not path.name.startswith("CONV-"):
                continue
            document = self.vault.read_markdown(self.vault.relative(path))
            messages = document["metadata"].get("messages", [])
            submissions = {m.get("run_id"): m.get("workspace_submission", {}) for m in messages if m.get("role") == "user" and m.get("run_id")}
            for message in messages:
                if not any(card.get("type") == "question" for card in message.get("cards", [])):
                    continue
                submission = submissions.get(message.get("run_id"), {})
                basis = submission.get("expected_question_revision") or (submission.get("target") or {}).get("business_question_revision")
                frozen = submission.get("frozen_context") or {}
                intake_basis = (frozen.get("intake_publication_baseline") or {}).get("business_question")
                run_id = str(message.get("run_id") or "")
                if re.fullmatch(r"(?:RUN|HTTP)-[A-Za-z0-9-]+", run_id):
                    run_path = f"{base}/conversations/runs/{run_id}.md"
                    if self.vault.exists(run_path):
                        saved = self.vault.read_markdown(run_path)["metadata"]
                        saved_run = saved.get("request", {})
                        if saved.get("matter_id") == matter_id:
                            basis = basis or saved_run.get("expected_question_revision") or (saved_run.get("target") or {}).get("business_question_revision")
                            intake_basis = ((saved.get("frozen_context") or {}).get("intake_publication_baseline") or {}).get("business_question") or intake_basis
                # The intake tool records this later basis only when its own write
                # follows the unchanged submitted baseline. It therefore permits
                # initial question refinement, but never a concurrent user reframe.
                basis = intake_basis or basis
                # A saved run basis is authoritative. Legacy cards with no known basis
                # remain useful only until an explicit question change is recorded.
                if basis and basis != business["revision"]:
                    continue
                if not basis and self._document(matter_id, "dossier.md")["metadata"].get("question_history"):
                    continue
                for card in message.get("cards", []):
                    qid = card.get("question_id")
                    if card.get("type") != "question" or not qid or qid in known or not card.get("text"):
                        continue
                    item = WorkspaceQuestion(question_id=qid, business_question_id=business["question_id"],
                        business_question_revision=business["revision"], text=card["text"],
                        consequence=card.get("why_it_matters") or card.get("reason") or "",
                        source_message_id=message.get("message_id"), answer_origin="legacy_intake").model_dump()
                    item["source_revision"] = digest({**item, "source_revision": ""})
                    questions.append(item)
                    known.add(qid)
        answers = {item["question_id"]: item for item in self.records.get(matter_id).get("intake_answers", [])}
        for question in questions:
            answer = answers.get(question["question_id"])
            if not answer or (question["state"] != "open" and question.get("source_action_key") != answer.get("source_action_key")):
                continue
            # Canonical intake answers already own the fact. Project that record
            # directly so a failed optional workspace write needs no second fact.
            answered = answer.get("status") == "answered"
            question.update(state="answered" if answered else "left_open", answer=answer.get("answer"),
                answer_origin="reported" if answered else None,
                answer_kind="reported_fact" if answered else question.get("answer_kind"),
                linked_fact_ids=[answer["answer_fact_id"]] if answer.get("answer_fact_id") else [],
                source_message_id=answer.get("source_id"), source_action_key=answer.get("source_action_key"),
                updated_at=answer.get("answered_at"))
            question["source_revision"] = digest({**question, "source_revision": ""})
        return questions

    @serialized
    def save_question(self, matter_id: str, question: WorkspaceQuestion | dict[str, Any], *, expected_revision: str | None = None) -> dict[str, Any]:
        item = WorkspaceQuestion.model_validate(question).model_dump()
        current_scope = self.business_question(matter_id)
        if item["business_question_id"] != current_scope["question_id"]:
            raise ValueError("Question belongs to another matter.")
        effective_issue_ids = list(dict.fromkeys(
            value for value in [item.get("issue_id"), *item.get("issue_ids", [])] if value
        ))
        known_issue_ids = {n["issue_id"] for n in self.issues(matter_id)}
        if any(issue_id not in known_issue_ids for issue_id in effective_issue_ids):
            raise ValueError("Issue not found in this matter.")
        item["issue_ids"] = effective_issue_ids
        item["issue_id"] = effective_issue_ids[0] if effective_issue_ids else None
        doc = self._document(matter_id, "workspace.md")
        items = self.questions(matter_id)
        old = next((q for q in items if q["question_id"] == item["question_id"]), None)
        if old:
            self._check(expected_revision or "", old["source_revision"])
        elif expected_revision:
            self._check(expected_revision, "")
        item["updated_at"] = iso_now()
        item["source_revision"] = digest({**item, "source_revision": ""})
        doc["metadata"]["questions"] = [q for q in items if q["question_id"] != item["question_id"]] + [item]
        self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
        return item

    @serialized
    def answer_question(self, matter_id: str, question_id: str, command: SupportingQuestionCommand | dict[str, Any]) -> dict[str, Any]:
        data = SupportingQuestionCommand.model_validate(command).model_dump()
        data["question_id"] = question_id
        doc = self._document(matter_id, "workspace.md")
        items = self.questions(matter_id)
        question = next((q for q in items if q["question_id"] == question_id), None)
        if not question:
            raise ValueError("Supporting question not found in this matter.")
        if question.get("question_kind", "factual") == "factual" and data.get("answer_kind") is None:
            data["answer_kind"] = "reported_fact"
        retry = self._retry(doc, data["source_action_key"], "answer_question", data)
        if retry:
            return retry
        self._check(data["expected_revision"], question["source_revision"])
        before = question["source_revision"]
        facts: list[str] = []
        links: list[str] = []
        completed: list[str] = []
        try:
            if data["state"] == "answered":
                answer = str(data.get("answer") or "").strip()
                if not answer:
                    raise ValueError("An answer needs text. Use Leave open for an unknown answer.")
                answer_kind = data.get("answer_kind")
                if question.get("question_kind", "factual") == "legal":
                    if answer_kind != "legal_analysis":
                        raise ValueError("A legal question answer must be legal analysis, not a reported fact.")
                elif answer_kind not in {None, "reported_fact"}:
                    raise ValueError("A factual question answer must be a reported fact.")
                data["answer_kind"] = "legal_analysis" if question.get("question_kind") == "legal" else "reported_fact"
                record = self.records.get(matter_id)
                known_sources = {item.get("source_id") for item in record.get("sources", [])}
                if any(source_id not in known_sources for source_id in data.get("answer_source_ids", [])):
                    raise ValueError("Answer source not found in this matter.")
                workspace_claims = self._document(matter_id, "workspace.md")["metadata"].get("claims", [])
                snapshot_claims = (self._document(matter_id, "workspace.md")["metadata"].get("snapshot") or {}).get("claims", [])
                known_claims = {
                    item.get("claim_id") for item in [*workspace_claims, *snapshot_claims] if isinstance(item, dict)
                }
                if any(claim_id not in known_claims for claim_id in data.get("answer_claim_ids", [])):
                    raise ValueError("Answer claim not found in this matter.")
                if question.get("question_kind") == "legal":
                    question.setdefault("answer_history", []).append({
                        "answer": answer, "answer_kind": "legal_analysis",
                        "answer_source_ids": data.get("answer_source_ids", []),
                        "answer_claim_ids": data.get("answer_claim_ids", []),
                        "source_action_key": data["source_action_key"], "recorded_at": iso_now(),
                    })
                    completed.append("legal_analysis")
                else:
                    source_id = data.get("source_message_id") or f"MSG-{digest(matter_id + data['source_action_key'])[:20]}"
                    existing_records = record
                    prior_action = next((a for a in existing_records["actions"] if a.get("source_action_key") == f"workspace:{data['source_action_key']}:answer"), None)
                    if prior_action:
                        prior_fact = next((f for f in existing_records["facts"] if f["fact_id"] in prior_action["created"]["facts"]), None)
                        if not prior_fact or prior_fact["text"] != f"{question['text']} — {answer}" or prior_fact["source_ids"] != [source_id]:
                            raise WorkspaceConflict("This action key was already used for a different answer.", before, code="action_key_conflict")
                    result = self.records.apply_update(matter_id,
                        facts=[{"text": f"{question['text']} — {answer}", "source_ids": [source_id]}],
                        sources=[{"source_id": source_id, "kind": "conversation", "label": "Reported answer", "location": data.get("source_message_id") or ""}],
                        actor="user", summary="Reported answer to supporting question",
                        source_action_key=f"workspace:{data['source_action_key']}:answer")
                    facts = result["created"]["facts"]
                    links.append(self._path(matter_id, "facts.md"))
                    completed.append("reported_fact")
            update = {"state": data["state"],
                "source_message_id": data.get("source_message_id"), "source_action_key": data["source_action_key"], "updated_at": iso_now()}
            if data["state"] == "answered":
                update.update({"answer": data.get("answer"), "answer_kind": data["answer_kind"],
                    "answer_source_ids": data.get("answer_source_ids", []), "answer_claim_ids": data.get("answer_claim_ids", []),
                    "linked_fact_ids": facts, "answer_origin": "reported" if facts else "generated_analysis"})
            question.update(update)
            question["source_revision"] = digest({**question, "source_revision": ""})
            doc["metadata"]["questions"] = items
            receipt = self._receipt(matter_id, data, "answer_question", "applied", before, question["source_revision"],
                [*links, doc["path"]], completed_parts=[*completed, "supporting_question"])
            self._add_receipt(doc["metadata"], receipt)
            self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
            return receipt
        except OSError as exc:
            # The factual action may already be durable, even if its event write
            # failed. Inspect it rather than claiming all work was rolled back.
            saved = next((a for a in self.records.get(matter_id)["actions"] if a.get("source_action_key") == f"workspace:{data['source_action_key']}:answer"), None)
            if saved and "reported_fact" not in completed:
                completed.append("reported_fact")
                links.append(self._path(matter_id, "facts.md"))
            receipt = self._receipt(matter_id, data, "answer_question", "not_saved", before, before, links,
                completed_parts=completed, failure_detail=str(exc))
            # Persist the incomplete receipt when the failure was transient. If
            # storage remains unavailable, the caller still has the useful result
            # and the deterministic factual action makes a later retry safe.
            try:
                fresh = self._document(matter_id, "workspace.md")
                self._add_receipt(fresh["metadata"], receipt)
                self.vault.write_markdown(fresh["path"], fresh["content"], fresh["metadata"])
            except OSError:
                pass
            return receipt

    def _validate_path(self, matter_id: str, path: str) -> None:
        if not path:
            raise ValueError("A target needs a path.")
        try:
            self.vault.resolve(path).relative_to(self.vault.resolve(self.matters.matter_path(matter_id)))
        except ValueError as exc:
            raise ValueError("Target must belong to this matter.") from exc

    def validate_target(self, matter_id: str, target: ConversationTarget | dict[str, Any], *, mutation: bool = False) -> dict[str, Any]:
        item = ConversationTarget.model_validate(target).model_dump()
        if item["matter_id"] != matter_id:
            raise ValueError("Target belongs to another matter.")
        question = self.business_question(matter_id)
        if item["business_question_id"] and item["business_question_id"] != question["question_id"]:
            raise ValueError("Business question not found in this matter.")
        if mutation and item["business_question_revision"]:
            self._check(item["business_question_revision"], question["revision"])
        if item["issue_id"] and item["issue_id"] not in {n["issue_id"] for n in self.issues(matter_id)}:
            raise ValueError("Issue not found in this matter.")
        if item["source_id"]:
            records = self.records.get(matter_id)
            known = {s["source_id"] for s in records["sources"]} | {f["fact_id"] for f in records["facts"]}
            if item["source_id"] not in known:
                from app.services.workspace_evidence import WorkspaceEvidenceService
                known.update(f["reference_id"] for f in WorkspaceEvidenceService(self.vault, self.matters, self).library(matter_id))
            if item["source_id"] not in known:
                raise ValueError("Source not found in this matter.")
        if item["scenario_id"]:
            scenario_id = item["scenario_id"]
            if not re.fullmatch(r"[A-Za-z0-9_-]+", scenario_id):
                raise ValueError("Invalid scenario ID.")
            scenario = self._document(matter_id, f"scenarios/{scenario_id}.md")
            if not self.vault.exists(scenario["path"]) or scenario["metadata"].get("matter_id") != matter_id:
                raise ValueError("Scenario not found in this matter.")
        if item["selected_range"] and not item["artifact_path"]:
            raise ValueError("A selected range needs its exact artifact.")
        if item["artifact_path"]:
            self._validate_path(matter_id, item["artifact_path"])
            doc = self.vault.read_document(item["artifact_path"])
            actual = self.dossiers._hash(doc["content"])
            if mutation and not item["artifact_revision"]:
                raise ValueError("An artifact edit needs its saved revision.")
            if mutation:
                self._check(item["artifact_revision"], actual)
            if item["selected_range"]:
                selected = item["selected_range"]
                text = item["local_draft_snapshot"] if item["local_draft_snapshot"] is not None else doc["content"]
                prefix_matches = not selected["prefix"] or text[:selected["start"]].endswith(selected["prefix"])
                suffix_matches = not selected["suffix"] or text[selected["end"]:].startswith(selected["suffix"])
                if not 0 <= selected["start"] <= selected["end"] <= len(text) or text[selected["start"]:selected["end"]] != selected["text"] or not prefix_matches or not suffix_matches:
                    raise WorkspaceConflict("The selected passage changed. Select it again.", actual, code="target_conflict")
        return item

    def source_revisions(self, matter_id: str) -> dict[str, str]:
        result = {}
        for name in ("matter.md", "dossier.md", "facts.md", "issues.md", "recommendations.md", "flow.md"):
            path = self._path(matter_id, name)
            if self.vault.exists(path):
                doc = self.vault.read_markdown(path)
                # Recap/UI state must never invalidate the factual baseline.
                metadata = {k: v for k, v in doc["metadata"].items() if k not in {"interaction_receipts", "question_changes", "question_history", "continuity_seen", "continuity_requests", "continuity_operations", "local_seen", "owner", "legal_owner", "owner_id", "legal_owner_id", "ownership_revision", "ownership_action_key", "assigned_by", "assigned_at", "updated_at", "updated_by", "action_actor"}}
                result[path] = digest({"content": doc["content"], "metadata": metadata})
        for source in self.records.get(matter_id)["sources"]:
            path = source.get("path")
            if not path:
                continue
            try:
                self._validate_path(matter_id, path)
                resolved = self.vault.resolve(path)
                if resolved.is_file():
                    result[path] = hashlib.sha256(resolved.read_bytes()).hexdigest()
            except ValueError:
                # Invalid imported legacy links remain unresolved data on GET.
                continue
        # Uploaded originals and their editable companions are source versions too.
        # Batch receipts and conversation files are derived records, not sources.
        base = self.matters.matter_path(matter_id)
        for companion in self.vault.iter_files(base, {".md"}):
            if not companion.name.endswith(".extracted.md"):
                continue
            relative = self.vault.relative(companion)
            doc = self.vault.read_markdown(relative)
            for candidate in (relative, doc["metadata"].get("source_path")):
                if candidate:
                    self._validate_path(matter_id, candidate)
                    source = self.vault.resolve(candidate)
                    if source.is_file():
                        result[candidate] = hashlib.sha256(source.read_bytes()).hexdigest()
        result["business_question"] = self.business_question(matter_id)["revision"]
        return result

    def issue_analyses(
        self, matter_id: str, *, issues: list[dict[str, Any]] | None = None,
    ) -> dict[str, dict[str, Any]]:
        """Resolve each issue independently so optional bad metadata stays local."""
        from app.services.issue_analysis import IssueAnalysisService

        issue_items = issues if issues is not None else self.issues(matter_id)
        metadata = self._document(matter_id, "workspace.md")["metadata"]
        raw_pointers = metadata.get("issue_analyses")
        pointers = raw_pointers if isinstance(raw_pointers, dict) else {}
        service = IssueAnalysisService(self.vault, self.matters, self)
        result: dict[str, dict[str, Any]] = {}
        for issue in issue_items:
            issue_id = issue["issue_id"]
            try:
                status = service.resolve(matter_id, issue_id)
                if issue_id in pointers and not isinstance(pointers.get(issue_id), dict):
                    status = {
                        "issue_id": issue_id,
                        "state": "missing",
                        "analysis": None,
                        "warnings": ["The saved issue analysis pointer is invalid."],
                        "reference": None,
                    }
                analysis = status.get("analysis")
                status["claims"] = self.analysis_claims(matter_id, analysis) if isinstance(analysis, dict) else []
                result[issue_id] = status
            except (OSError, TypeError, ValueError, KeyError, YAMLError):
                reference = pointers.get(issue_id)
                result[issue_id] = {
                    "issue_id": issue_id,
                    "state": "missing" if issue_id in pointers else "not_mapped",
                    "analysis": None,
                    "warnings": ["The saved issue analysis metadata is unavailable."],
                    "reference": reference if isinstance(reference, dict) else None,
                    "claims": [],
                }
        return result

    def analysis_claims(
        self, matter_id: str, analysis: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """Load linked claims only from this analysis's exact saved output."""
        try:
            path = str(analysis["source_path"])
            self._validate_path(matter_id, path)
            document = self.vault.read_markdown(path)
            metadata = document["metadata"]
            output_revision = str(analysis["output_revision"])
            if (metadata.get("matter_id") != matter_id
                    or metadata.get("output_revision") != output_revision
                    or digest(document["content"].strip()) != output_revision):
                return []
            linked = {
                claim_id for item in [*analysis.get("tests", []),
                                      *analysis.get("conditions", []),
                                      *analysis.get("options", [])]
                if isinstance(item, dict)
                for claim_id in item.get("claim_ids", [])
                if isinstance(claim_id, str)
            }
            result = []
            for raw in metadata.get("claims", []):
                claim = WorkspaceClaim.model_validate(raw).model_dump(mode="json")
                if (claim["claim_id"] in linked
                        and claim["output_revision"] == output_revision
                        and analysis.get("source_revisions", {}).get(f"claim:{claim['claim_id']}") == output_revision):
                    result.append(claim)
            return result
        except (OSError, UnicodeError, TypeError, ValueError, KeyError, YAMLError):
            return []

    def _output_revisions(self, matter_id: str, *, failures: list[dict[str, str]] | None = None) -> dict[str, str]:
        result = {}
        base = self.matters.matter_path(matter_id)
        root = self.vault.resolve(base)
        for path in self.vault.iter_files(base, {".md"}):
            # Review snapshots are explicit history, not current outputs.
            if ".history" in path.relative_to(root).parts:
                continue
            relative = self.vault.relative(path)
            try:
                doc = self.vault.read_markdown(relative)
                metadata = doc["metadata"]
                if metadata.get("matter_id") not in {None, matter_id}:
                    continue
                if metadata.get("record_type") in {"work_product", "research_note"} or metadata.get("research_id"):
                    result[relative] = digest({"content": doc["content"], "metadata": metadata})
            except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                # Optional files may disappear between discovery and reading, or
                # contain malformed frontmatter. They cannot erase saved answers.
                if failures is not None:
                    failures.append({"path": relative, "state": "unavailable", "message": "Could not read this optional file."})
        if failures is not None:
            failures.sort(key=lambda item: item["path"])
        return dict(sorted(result.items()))

    def recap(self, matter_id: str) -> dict[str, Any]:
        doc = self._document(matter_id, "workspace.md")
        seen = doc["metadata"].get("local_seen", {})
        current = self.source_revisions(matter_id)
        failures: list[dict[str, str]] = []
        outputs = self._output_revisions(matter_id, failures=failures)
        revision = digest({"sources": current, "outputs": outputs})
        previous_sources = seen.get("source_revisions", {})
        return {"previous_seen_revision": seen.get("revision"), "current_revision": revision,
                "changes": [{"path": p, "before_revision": previous_sources.get(p), "after_revision": r} for p, r in sorted(current.items()) if previous_sources.get(p) != r],
                "new_outputs": [p for p, rev in outputs.items() if seen.get("output_revisions", {}).get(p) != rev],
                "output_read_failures": failures}

    @serialized
    def mark_seen(self, matter_id: str, *, expected_revision: str) -> dict[str, Any]:
        recap = self.recap(matter_id)
        self._check(expected_revision, recap["current_revision"])
        doc = self._document(matter_id, "workspace.md")
        failures: list[dict[str, str]] = []
        outputs = self._output_revisions(matter_id, failures=failures)
        previous_outputs = doc["metadata"].get("local_seen", {}).get("output_revisions", {})
        for failure in failures:
            path = failure["path"]
            if path in previous_outputs:
                # A temporary read failure does not make an already-seen version
                # a new output when the same file becomes readable again.
                outputs[path] = previous_outputs[path]
        doc["metadata"]["local_seen"] = {"revision": recap["current_revision"], "source_revisions": self.source_revisions(matter_id), "output_revisions": outputs}
        self.vault.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
        return self.recap(matter_id)

    @serialized
    def get(self, matter_id: str) -> dict[str, Any]:
        doc = self._document(matter_id, "workspace.md")
        dossier = self._document(matter_id, "dossier.md")
        saved = doc["metadata"].get("snapshot") or {}
        if not isinstance(saved, dict):
            saved = {}
        questions = self.questions(matter_id)
        question = self.business_question(matter_id)
        revisions = self.source_revisions(matter_id)
        receipts = [*dossier["metadata"].get("interaction_receipts", []), *doc["metadata"].get("interaction_receipts", [])]
        receipts.sort(key=lambda r: (r.get("created_at") or "", r["receipt_id"]))
        issues = self.issues(matter_id)
        return {**saved, "matter_id": matter_id, "revision": digest(revisions), "source_revisions": revisions,
            "question": question, "short_answer": saved.get("short_answer") or "",
            "issues": issues, "issue_analyses": self.issue_analyses(matter_id, issues=issues),
            "issues_revision": self.issues_revision(matter_id), "questions": questions,
            "supporting_question": next((q for q in questions if q["state"] == "open" and q["business_question_revision"] == question["revision"]), None),
            "pending_reframes": [p for p in dossier["metadata"].get("question_changes", []) if p.get("state") == "proposed"],
            "question_changes": dossier["metadata"].get("question_changes", []), "receipts": receipts,
            "context_selection": doc["metadata"].get("context_selection", []), "recap": self.recap(matter_id),
            "stale": bool(saved.get("source_revisions") and saved["source_revisions"] != revisions),
            "answer_links": saved.get("answer_links", []), "work_products": saved.get("work_products", []),
            "run_id": saved.get("run_id"), "generated_at": saved.get("generated_at")}
