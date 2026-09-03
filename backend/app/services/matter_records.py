from __future__ import annotations

import hashlib
import re
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
        issues_path = f"{self.matters.matter_path(matter_id)}/issues.md"
        if self.vault.exists(issues_path):
            metadata["issues"] = self._list_items(
                self.vault.read_markdown(issues_path)["content"]
            )
        return {"path": path, "content": document["content"], **metadata}

    def reconcile_edited_document(self, path: str, *, actor: str = "user") -> list[str]:
        """Project a lawyer edit into the typed record stored in Markdown frontmatter."""
        document = self.vault.read_markdown(path)
        metadata = document["metadata"]
        matter_id = str(metadata.get("matter_id") or "")
        record_type = str(metadata.get("record_type") or "")
        if not matter_id or record_type not in {"facts", "issues", "participants"}:
            return []
        now = iso_now()
        if record_type == "issues":
            issues = self._list_items(document["content"])
            self.vault.update_markdown(path, metadata_updates={
                "issues": issues, "updated_at": now, "updated_by": actor,
            })
            facts_path = self._path(matter_id)
            if self.vault.exists(facts_path):
                self.vault.update_markdown(facts_path, metadata_updates={"issues": issues})
            return [path, facts_path]
        if record_type == "participants":
            participants = self.matters._participants_from_content(document["content"])
            self.vault.update_markdown(path, metadata_updates={
                "participants": participants, "updated_at": now, "updated_by": actor,
            })
            return [path]

        record = self._normalized(metadata, "")
        visible_facts, visible_assumptions = self._fact_items(document["content"])
        action_id = new_id("ACT")
        created = {key: [] for key in ("facts", "sources", "support", "assumptions")}
        changed = False

        active_by_text = {
            str(item.get("text") or "").strip().casefold(): item
            for item in record["facts"]
            if item.get("status") == "active" and not item.get("withdrawn_at")
        }
        visible_fact_keys = {text.casefold() for text in visible_facts}
        for key, item in active_by_text.items():
            if key not in visible_fact_keys:
                item.update({"status": "withdrawn", "withdrawn_at": now})
                changed = True
        for text in visible_facts:
            if text.casefold() in active_by_text:
                continue
            fact_id = new_id("FACT")
            record["facts"].append({
                "fact_id": fact_id, "text": text, "status": "active", "material": True,
                "source_ids": [], "supersedes": None, "created_at": now,
                "withdrawn_at": None, "action_id": action_id,
            })
            created["facts"].append(fact_id)
            changed = True

        open_assumptions = {
            str(item.get("text") or "").strip().casefold(): item
            for item in record["assumptions"]
            if item.get("status") == "open" and not item.get("withdrawn_at")
        }
        visible_assumption_keys = {text.casefold() for text in visible_assumptions}
        for key, item in open_assumptions.items():
            if key not in visible_assumption_keys:
                item.update({"status": "withdrawn", "withdrawn_at": now})
                changed = True
        for text in visible_assumptions:
            if text.casefold() in open_assumptions:
                continue
            assumption_id = new_id("ASM")
            record["assumptions"].append({
                "assumption_id": assumption_id, "text": text,
                "reason": "Added in a lawyer edit", "material": True, "status": "open",
                "created_at": now, "resolved_at": None, "withdrawn_at": None,
                "action_id": action_id,
            })
            created["assumptions"].append(assumption_id)
            changed = True
        if changed:
            record["actions"].append({
                "action_id": action_id, "summary": "Reconciled a lawyer record edit",
                "actor": actor, "created_at": now, "status": "applied",
                "created": created, "source_action_key": None,
            })
        projected = {
            key: record[key]
            for key in (
                "facts", "sources", "support", "assumptions", "conflicts", "actions",
                "working_ask", "issues", "open_questions", "public_research_questions",
                "intake_answers", "intake_state",
            )
        }
        self.vault.update_markdown(path, metadata_updates={
            **projected, "updated_at": now, "updated_by": actor,
        })
        return [path]

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
        source_action_key: str | None = None,
    ) -> dict[str, Any]:
        record = self.get(matter_id)
        if source_action_key:
            existing = next(
                (
                    action for action in record["actions"]
                    if action.get("source_action_key") == source_action_key
                ),
                None,
            )
            if existing is not None:
                return existing
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
            "source_action_key": source_action_key,
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
        record = self.get(matter_id)
        if record.get("intake_state") == "complete" and turn.intake_state == "active":
            return self._unchanged_intake_result(turn, record, intake_state="complete")
        if turn.source_action_key and any(
            action.get("source_action_key") == turn.source_action_key
            for action in record["actions"]
        ):
            return self._unchanged_intake_result(
                turn,
                record,
                intake_state=str(record.get("intake_state") or turn.intake_state),
            )
        questions = (
            [
                question for question in turn.next_questions
                if not self._question_is_answered(record, question.question_id, question.text)
            ]
            if turn.intake_state == "active"
            else []
        )
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
        open_assumption_keys = {
            _text_key(item.get("text"))
            for item in record["assumptions"]
            if item.get("status") == "open" and not item.get("withdrawn_at")
        }
        assumptions = [
            {"text": text}
            for text in turn.assumptions
            if text.strip() and _text_key(text) not in open_assumption_keys
        ]
        support: list[dict[str, Any]] = []
        record_ids: list[str] = []
        source_has_saved_answer = bool(source_id) and any(
            str(answer.get("source_id") or "") == source_id
            for answer in record.get("intake_answers", [])
        )
        for supplied in ([] if source_has_saved_answer else turn.reported_facts):
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
            source_action_key=turn.source_action_key,
        )
        record_ids.extend(action["created"]["assumptions"])
        record = self.get(matter_id)
        unresolved_questions = [
            question
            for question in _clean_text_list(
                [*turn.material_missing_facts, *turn.human_questions]
            )
            if not self._question_is_answered(record, "", question)
        ]
        record.update(
            {
                "working_ask": turn.working_ask.strip(),
                "issues": _clean_text_list(turn.issues),
                "open_questions": unresolved_questions,
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
                    else unresolved_questions[0]
                    if unresolved_questions
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

    def record_intake_answers(
        self,
        matter_id: str,
        answers: Iterable[dict[str, Any]],
        *,
        source_id: str,
        source_action_key: str,
    ) -> dict[str, Any]:
        """Save exact answers to active intake questions before model analysis."""
        supplied = [dict(item) for item in answers]
        if not supplied:
            return {"changed": False, "changed_paths": [], "record_ids": []}
        record = self.get(matter_id)
        existing_keys = {
            (str(item.get("question_id") or ""), str(item.get("source_action_key") or ""))
            for item in record["intake_answers"]
        }
        pending = [
            item for item in supplied
            if (str(item.get("question_id") or ""), source_action_key) not in existing_keys
        ]
        if not pending:
            return {"changed": False, "changed_paths": [], "record_ids": []}

        self.ensure_source(
            matter_id,
            source_id=source_id,
            kind="conversation_message",
            label="Matter intake response",
        )
        record = self.get(matter_id)
        active_facts = {
            _text_key(item.get("text")): item
            for item in record["facts"]
            if item.get("status") == "active" and not item.get("withdrawn_at")
        }
        fact_payloads: list[dict[str, Any]] = []
        fact_text_by_question: dict[str, str] = {}
        for item in pending:
            if str(item.get("status") or "answered") != "answered":
                continue
            question = str(item.get("question") or "").strip()
            answer = str(item.get("answer") or "").strip()
            if not question or not answer:
                continue
            fact_text = _answer_fact_text(question, answer)
            fact_text_by_question[str(item.get("question_id") or "")] = fact_text
            if _text_key(fact_text) not in active_facts:
                fact_payloads.append({
                    "text": fact_text,
                    "source_ids": [source_id],
                    "material": True,
                })

        action = self.apply_update(
            matter_id,
            facts=fact_payloads,
            summary="Recorded intake question answers",
            actor="user",
            source_action_key=f"{source_action_key}:answers",
        )
        record = self.get(matter_id)
        now = iso_now()
        record_ids: list[str] = []
        for item in pending:
            question_id = str(item.get("question_id") or "").strip()
            question = str(item.get("question") or "").strip()
            answer = str(item.get("answer") or "").strip()
            fact_text = fact_text_by_question.get(question_id, "")
            fact = next(
                (
                    candidate for candidate in record["facts"]
                    if fact_text and _text_key(candidate.get("text")) == _text_key(fact_text)
                ),
                None,
            )
            answer_id = new_id("ANS")
            record["intake_answers"].append({
                "answer_id": answer_id,
                "question_id": question_id,
                "question": question,
                "answer": answer,
                "values": [str(value) for value in item.get("values", [])],
                "status": str(item.get("status") or "answered"),
                "record_target": str(item.get("record_target") or "fact"),
                "source_id": source_id,
                "source_action_key": source_action_key,
                "answered_at": now,
                "answer_fact_id": fact.get("fact_id") if fact else None,
            })
            record_ids.append(answer_id)

        answered_question_keys = {
            _question_key(item.get("question"))
            for item in pending
            if str(item.get("question") or "").strip()
        }
        record["open_questions"] = [
            question for question in record["open_questions"]
            if not any(
                _questions_match(question, answered)
                for answered in answered_question_keys
            )
        ]
        self._save(matter_id, record)

        matter = self.matters.get(matter_id)
        matter_path = f"{matter['path']}/matter.md"
        projected_paths = self._project_intake_answer_targets(
            matter_id, matter["path"], pending
        )
        next_action = (
            record["open_questions"][0]
            if record["open_questions"]
            else "Continue intake with the next material question."
        )
        self.vault.update_markdown(matter_path, metadata_updates={
            "next_action": next_action,
            "updated_at": now,
        })
        changed_paths = [record["path"], matter_path, *projected_paths]
        if self.matters._dossiers:
            dossier = self.matters._dossiers.update_from_intake(
                matter_id,
                working_ask=record["working_ask"],
                facts=record["facts"],
                assumptions=record["assumptions"],
                issues=record["issues"],
                open_questions=record["open_questions"],
                orientation="",
                expected_hash=None,
            )
            changed_paths.append(str(dossier.get("path") or dossier.get("revision_path")))
        self.matters.append_event(matter_id, "intake_answers_recorded", {
            "action_id": action["action_id"],
            "answer_ids": record_ids,
            "source_id": source_id,
        })
        self.matters.index.rebuild()
        return {
            "changed": True,
            "changed_paths": list(dict.fromkeys(changed_paths)),
            "record_ids": record_ids,
        }

    def _project_intake_answer_targets(
        self,
        matter_id: str,
        matter_path: str,
        answers: list[dict[str, Any]],
    ) -> list[str]:
        matter_updates: dict[str, Any] = {}
        participant_updates: dict[str, str] = {}
        for item in answers:
            if str(item.get("status") or "answered") != "answered":
                continue
            target = str(item.get("record_target") or "fact")
            answer = str(item.get("answer") or "").strip()
            if not answer or target == "fact":
                continue
            if target == "jurisdiction_scope":
                matter_updates[target] = [answer]
            elif target in {"product_area", "business_team", "matter_type"}:
                matter_updates[target] = answer
            elif target == "risk_level" and answer.casefold() in {
                "unknown", "low", "medium", "high", "critical"
            }:
                matter_updates[target] = answer.casefold()
            elif target == "target_date" and re.fullmatch(r"\d{4}-\d{2}-\d{2}", answer):
                matter_updates[target] = answer
            elif target in {"requester", "business_owner"}:
                matter_updates[target] = answer
                participant_updates[target] = answer
        if not matter_updates:
            return []

        now = iso_now()
        root_path = f"{matter_path}/matter.md"
        self.vault.update_markdown(
            root_path,
            metadata_updates={**matter_updates, "updated_at": now},
        )
        changed_paths = [root_path]
        if participant_updates:
            participants_path = f"{matter_path}/participants.md"
            participants = self.matters._participants(matter_path)
            by_role = {str(item["role"]): dict(item) for item in participants}
            for role, name in participant_updates.items():
                by_role[role] = {"role": role, "name": name}
            saved_participants = list(by_role.values())
            body = "# Participants\n\n" + "\n".join(
                f"- **{item['name']}** — {str(item['role']).replace('_', ' ').title()}"
                for item in saved_participants
            )
            self.vault.write_markdown(
                participants_path,
                body,
                {
                    "matter_id": matter_id,
                    "record_type": "participants",
                    "participants": saved_participants,
                    "updated_at": now,
                    "updated_by": "user",
                },
            )
            changed_paths.append(participants_path)
        return changed_paths

    @staticmethod
    def _question_is_answered(
        record: dict[str, Any], question_id: str, question: str
    ) -> bool:
        supplied_id = str(question_id or "").strip()
        supplied_key = _question_key(question)
        return any(
            str(item.get("status") or "") in {"answered", "skipped"}
            and (
                (supplied_id and str(item.get("question_id") or "") == supplied_id)
                or (supplied_key and _questions_match(item.get("question"), supplied_key))
            )
            for item in record.get("intake_answers", [])
        )

    def is_answered_question(
        self, matter_id: str, question_id: str, question: str
    ) -> bool:
        return self._question_is_answered(
            self.get(matter_id), question_id, question
        )

    def deduplicate_intake_record(self, matter_id: str) -> list[str]:
        """Withdraw exact duplicate facts and assumptions and merge repeated questions."""
        record = self.get(matter_id)
        now = iso_now()
        changed = False
        for section, status in (("facts", "active"), ("assumptions", "open")):
            seen: set[str] = set()
            for item in record[section]:
                if item.get("status") != status or item.get("withdrawn_at"):
                    continue
                key = _text_key(item.get("text"))
                if key in seen:
                    item["status"] = "withdrawn"
                    item["withdrawn_at"] = now
                    changed = True
                else:
                    seen.add(key)
        questions = _clean_text_list(record["open_questions"])
        if questions != record["open_questions"]:
            record["open_questions"] = questions
            changed = True
        if not changed:
            return []
        self._save(matter_id, record)
        matter = self.matters.get(matter_id)
        matter_path = f"{matter['path']}/matter.md"
        self.vault.update_markdown(matter_path, metadata_updates={
            "next_action": (
                questions[0]
                if questions
                else "Continue intake with the next material question."
            ),
            "updated_at": now,
        })
        changed_paths = [record["path"], matter_path]
        if self.matters._dossiers:
            dossier = self.matters._dossiers.update_from_intake(
                matter_id,
                working_ask=record["working_ask"],
                facts=record["facts"],
                assumptions=record["assumptions"],
                issues=record["issues"],
                open_questions=record["open_questions"],
                orientation="",
                expected_hash=None,
            )
            changed_paths.append(str(dossier.get("path") or dossier.get("revision_path")))
        self.matters.append_event(matter_id, "intake_record_deduplicated", {
            "changed_paths": changed_paths,
        })
        self.matters.index.rebuild()
        return list(dict.fromkeys(changed_paths))

    @staticmethod
    def _unchanged_intake_result(
        turn: IntakeTurn,
        record: dict[str, Any],
        *,
        intake_state: str,
    ) -> IntakeTurnResult:
        questions = turn.next_questions if intake_state == "active" else []
        action = next(
            (
                item for item in record["actions"]
                if turn.source_action_key
                and item.get("source_action_key") == turn.source_action_key
            ),
            None,
        )
        return IntakeTurnResult(
            changed_paths=[],
            record_ids=[],
            questions=questions,
            question=questions[0] if questions else None,
            matter_update=(
                MatterUpdateCard(
                    action_id=action["action_id"],
                    summary="Matter intake already updated",
                    changed_sections=[],
                    can_edit=False,
                    can_undo=False,
                )
                if action
                else None
            ),
            intake_state=intake_state,
        )

    def set_intake_state(self, matter_id: str, state: str) -> dict[str, Any]:
        if state not in {"active", "complete"}:
            raise ValueError("Intake state must be active or complete.")
        record = self.get(matter_id)
        if record.get("intake_state") == "complete" and state == "active":
            raise ValueError("Completed intake cannot become active again.")
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
                "next_action": (
                    "Orient to the request and identify the first missing facts."
                    if state == "active"
                    else "Review the dossier and continue the legal work."
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
                "open_questions", "public_research_questions", "intake_answers",
                "intake_state",
            )
        }
        active = [item for item in record["facts"] if item.get("status") == "active" and not item.get("withdrawn_at")]
        assumptions = [item for item in record["assumptions"] if item.get("status") == "open" and not item.get("withdrawn_at")]
        body = "# Known Facts\n\n" + ("\n".join(f"- {item['text']}" for item in active) or "No facts saved yet.")
        body += "\n\n## Assumptions\n\n" + ("\n".join(f"- [Assumption] {item['text']}" for item in assumptions) or "No open assumptions.")
        self.vault.write_markdown(self._path(matter_id), body, metadata)

    @staticmethod
    def _normalized(metadata: dict[str, Any], content: str) -> dict[str, Any]:
        facts = [dict(item) for item in (metadata.get("facts") or [])]
        assumptions = [dict(item) for item in (metadata.get("assumptions") or [])]
        visible_facts, visible_assumptions = MatterRecordService._fact_items(content)
        if content.strip():
            active_by_text = {
                str(item.get("text") or "").strip().casefold(): item
                for item in facts
                if item.get("status") == "active" and not item.get("withdrawn_at")
            }
            visible_keys = {text.casefold() for text in visible_facts}
            for key, item in active_by_text.items():
                if key not in visible_keys:
                    item["status"] = "withdrawn"
            for text in visible_facts:
                if text.casefold() in active_by_text:
                    continue
                digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]
                facts.append({
                    "fact_id": f"FACT-LEGACY-{digest}", "text": text, "status": "active",
                    "material": True, "source_ids": [], "supersedes": None,
                    "created_at": None, "withdrawn_at": None, "action_id": None,
                })
            open_by_text = {
                str(item.get("text") or "").strip().casefold(): item
                for item in assumptions
                if item.get("status") == "open" and not item.get("withdrawn_at")
            }
            visible_assumption_keys = {text.casefold() for text in visible_assumptions}
            for key, item in open_by_text.items():
                if key not in visible_assumption_keys:
                    item["status"] = "withdrawn"
            for text in visible_assumptions:
                if text.casefold() in open_by_text:
                    continue
                digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]
                assumptions.append({
                    "assumption_id": f"ASM-LEGACY-{digest}", "text": text,
                    "reason": "Read from the Markdown record", "material": True,
                    "status": "open", "created_at": None, "resolved_at": None,
                    "withdrawn_at": None, "action_id": None,
                })
        return {
            "matter_id": metadata.get("matter_id"), "record_type": "facts",
            "facts": facts,
            **{key: list(metadata.get(key) or []) for key in ("sources", "support", "conflicts", "actions")},
            "assumptions": assumptions,
            "working_ask": str(metadata.get("working_ask") or ""),
            "issues": list(metadata.get("issues") or []),
            "open_questions": list(metadata.get("open_questions") or []),
            "public_research_questions": list(metadata.get("public_research_questions") or []),
            "intake_answers": [
                dict(item) for item in (metadata.get("intake_answers") or [])
                if isinstance(item, dict)
            ],
            "intake_state": str(metadata.get("intake_state") or "active"),
        }

    @staticmethod
    def _list_items(content: str) -> list[str]:
        values: list[str] = []
        for line in content.splitlines():
            match = re.match(r"^\s*(?:[-*]|\d+[.)])\s+(.+?)\s*$", line)
            if not match:
                continue
            text = match.group(1).strip()
            if text and not text.startswith("["):
                values.append(text)
        return list(dict.fromkeys(values))

    @staticmethod
    def _fact_items(content: str) -> tuple[list[str], list[str]]:
        facts: list[str] = []
        assumptions: list[str] = []
        section = "facts"
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("## "):
                section = "assumptions" if "assumption" in stripped.casefold() else "other"
                continue
            if not stripped.startswith("- ") or stripped.startswith("- [ ]") or stripped.startswith("- [x]"):
                continue
            text = stripped[2:].strip()
            if text.startswith("[Assumption]"):
                assumptions.append(text.removeprefix("[Assumption]").strip())
            elif section == "facts" and not text.startswith("["):
                facts.append(text)
        return list(dict.fromkeys(facts)), list(dict.fromkeys(assumptions))

    @staticmethod
    def _find(items: list[dict[str, Any]], key: str, value: Any) -> dict[str, Any] | None:
        return next((item for item in items if item.get(key) == value), None)


def _clean_text_list(values: Iterable[str]) -> list[str]:
    result: list[str] = []
    for value in values:
        text = value.strip()
        if not text or any(_questions_match(text, saved) for saved in result):
            continue
        result.append(text)
    return result


def _text_key(value: Any) -> str:
    return " ".join(str(value or "").casefold().split())


def _question_key(value: Any) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", str(value or "").casefold()))


_QUESTION_STOP_WORDS = {
    "a", "an", "and", "are", "be", "is", "it", "of", "or", "the", "this",
    "to", "under", "whether", "which",
}


def _question_tokens(value: Any) -> set[str]:
    return {
        token for token in _question_key(value).split()
        if token not in _QUESTION_STOP_WORDS
    }


def _questions_match(left: Any, right: Any) -> bool:
    left_key = _question_key(left)
    right_key = _question_key(right)
    if not left_key or not right_key:
        return False
    if left_key == right_key:
        return True
    left_tokens = _question_tokens(left)
    right_tokens = _question_tokens(right)
    smaller = min(len(left_tokens), len(right_tokens))
    overlap = len(left_tokens & right_tokens) / smaller if smaller else 0
    if smaller >= 5:
        return overlap >= 0.8
    return smaller >= 3 and overlap == 1 and abs(len(left_tokens) - len(right_tokens)) <= 2


def _answer_fact_text(question: str, answer: str) -> str:
    explicit = re.match(r"^(?:yes|no)\s*[,—:-]\s*(.+)$", answer, re.IGNORECASE)
    if explicit and explicit.group(1).strip():
        statement = explicit.group(1).strip()
        return statement if statement.endswith((".", "!", "?")) else f"{statement}."
    return f"{question.rstrip()} — {answer}"
