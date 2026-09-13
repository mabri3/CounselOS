"""Read-only orientation derived from authoritative matter records."""
from __future__ import annotations

import re
from pathlib import PurePosixPath
from typing import Any, Iterable

from yaml import YAMLError

from app.models.continuity import ActionActor, NextAction, Orientation
from app.services.workspace import digest


_DONE = {"done", "closed", "complete", "completed"}
_ACTIVE_REQUEST = {"requested_externally", "reply_saved", "partly_answered", "left_open"}
_PLACEHOLDER_RECOMMENDATIONS = {
    "", "no recommendation has been drafted yet.", "no recommendation has been drafted yet",
}
_NON_ADVICE_PREFIXES = (
    "workspace action ·", "tool error", "tool result", "an error occurred",
    "could not load", "failed to load", "run failed", "research run failed",
)
_NON_ADVICE_EXACT = {
    "the available actions are complete; use the trace and updated matter state as the working result.",
}
_COMMUNICATION_WORKSPACE_ACTIONS = {"prepare_handoff"}


class WorkspaceOrientationService:
    def __init__(self, vault, matters, workspace):
        self.vault = vault
        self.matters = matters
        self.workspace = workspace

    def get(
        self,
        matter_id: str,
        *,
        actor: ActionActor,
        requests: list[dict] = (),
        team_items: list[dict] = (),
        seen: dict | None = None,
    ) -> dict:
        """Read current records without acknowledging, repairing, or generating data."""
        snapshot = self.workspace.get(matter_id)
        base = self.matters.matter_path(matter_id)
        snapshot = {
            **snapshot,
            "_resolved_answer_path": self._current_answer_path(matter_id, snapshot),
        }
        matter_doc = self.vault.read_markdown(f"{base}/matter.md")
        matter = {**matter_doc["metadata"], "matter_id": matter_id, "path": base}
        warnings: list[str] = []
        work_items = self._work_items(matter_id, base, warnings)
        required_open = sum(
            bool(item.get("required")) and self._state(item) not in _DONE
            for item in work_items
        )
        current_final = self.matters._lifecycle.current_final_path(
            matter, matter_doc["metadata"], backfill=False,
        )
        matter["current_work_product_final_path"] = current_final
        matter["work_state"] = self.matters.matter_state.resolve(
            matter,
            work_items,
            current_final_path=current_final,
            required_open_count=required_open,
        )

        execution_note = str(matter["work_state"].get("execution_note") or "").strip()
        if execution_note:
            warnings.append(execution_note)
        recap = snapshot.get("recap") if isinstance(snapshot.get("recap"), dict) else {}
        for failure in recap.get("output_read_failures", []):
            if isinstance(failure, dict) and str(failure.get("message") or "").strip():
                warnings.append(str(failure["message"]).strip())
        saved_advice = None
        if not self._is_useful_advice(str(snapshot.get("short_answer") or "")):
            saved_advice = self._saved_advice(matter_id, base, warnings)
        return self.derive(
            snapshot=snapshot,
            matter=matter,
            work_items=work_items,
            actor=actor,
            requests=requests,
            team_items=team_items,
            seen=seen,
            saved_advice=saved_advice,
            warnings=warnings,
        )

    @staticmethod
    def derive(
        *,
        snapshot: dict,
        matter: dict,
        work_items: list[dict],
        actor: ActionActor,
        requests: list[dict] = (),
        team_items: list[dict] = (),
        seen: dict | None = None,
        saved_advice: dict | None = None,
        warnings: list[str] = (),
    ) -> dict:
        question = snapshot.get("question") if isinstance(snapshot.get("question"), dict) else {}
        question_text = str(question.get("text") or "").strip()
        preview, is_preview = WorkspaceOrientationService._preview(question_text)

        snapshot_answer = str(snapshot.get("short_answer") or "").strip()
        answer = (
            snapshot_answer
            if WorkspaceOrientationService._is_useful_advice(snapshot_answer)
            else ""
        )
        answer_path = (
            WorkspaceOrientationService._text_or_none(snapshot.get("_resolved_answer_path"))
            if "_resolved_answer_path" in snapshot
            else WorkspaceOrientationService._first_text(snapshot.get("answer_links"))
        )
        answer_label = "Current workspace answer" if answer else ""
        answer_state = "stale" if answer and bool(snapshot.get("stale")) else "current" if answer else "unavailable"
        caveats = WorkspaceOrientationService._caveats(answer)
        local_warnings = [str(item).strip() for item in warnings if str(item).strip()]
        if not answer and saved_advice and str(saved_advice.get("text") or "").strip():
            answer = str(saved_advice["text"]).strip()
            answer_path = str(saved_advice.get("path") or "").strip() or None
            answer_label = str(saved_advice.get("label") or "Earlier saved advice").strip()
            answer_state = "stale"
            caveats = WorkspaceOrientationService._caveats(answer)
            basis_warning = (
                "This saved advice has an earlier or unknown question basis. "
                "Confirm it against the current question."
            )
            if basis_warning not in local_warnings:
                local_warnings.append(basis_warning)
            if basis_warning not in caveats:
                caveats.append(basis_warning)

        primary = WorkspaceOrientationService._primary_action(
            snapshot=snapshot,
            matter=matter,
            work_items=work_items,
            actor=actor,
            requests=requests,
            team_items=team_items,
        )
        secondary = WorkspaceOrientationService._secondary_actions(
            matter_id=str(snapshot.get("matter_id") or matter.get("matter_id") or ""),
            question=question,
            snapshot=snapshot,
            primary=primary,
        )
        changes, first_visit, seen_revision, current_revision = WorkspaceOrientationService._changes(
            snapshot=snapshot, seen=seen
        )
        result = Orientation(
            matter_id=str(snapshot.get("matter_id") or matter.get("matter_id") or ""),
            basis_revision=str(snapshot.get("revision") or ""),
            question_text=question_text,
            question_preview=preview,
            question_is_preview=is_preview,
            answer=answer,
            answer_path=answer_path,
            answer_label=answer_label,
            caveats=caveats,
            answer_state=answer_state,
            primary_action=primary,
            secondary_actions=secondary[:2],
            changes=changes,
            first_visit=first_visit,
            seen_revision=seen_revision,
            current_revision=current_revision,
            warnings=local_warnings,
        )
        return result.model_dump()

    def _work_items(
        self, matter_id: str, base: str, warnings: list[str]
    ) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
        directory = self.vault.resolve(f"{base}/work-items")
        if not directory.exists():
            return result
        for path in sorted(directory.glob("*.md")):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
            except (OSError, UnicodeError, TypeError, ValueError, YAMLError):
                warnings.append("Some work-item details could not be loaded.")
                continue
            metadata = document["metadata"]
            if metadata.get("matter_id") != matter_id or not metadata.get("work_item_id"):
                continue
            result.append({**metadata, "path": document["path"]})
        return result

    def _current_answer_path(self, matter_id: str, snapshot: dict) -> str | None:
        links = [
            str(path).strip()
            for path in snapshot.get("answer_links", [])
            if str(path or "").strip()
        ]
        run_id = str(snapshot.get("run_id") or "").strip()
        if not run_id:
            return links[0] if links else None
        for path in links:
            try:
                if not self.vault.exists(path):
                    continue
                document = self.vault.read_markdown(path)
            except (OSError, UnicodeError, TypeError, ValueError, YAMLError):
                continue
            metadata = document["metadata"]
            if (
                metadata.get("record_type") == "workspace_inquiry"
                and metadata.get("matter_id") == matter_id
                and metadata.get("run_id") == run_id
            ):
                return document["path"]
        return None

    def _saved_advice(
        self, matter_id: str, base: str, warnings: list[str]
    ) -> dict[str, str] | None:
        recommendation_path = f"{base}/recommendations.md"
        if self.vault.exists(recommendation_path):
            try:
                document = self.vault.read_markdown(recommendation_path)
                text = self._clean_document_text(document["content"])
                if (
                    text.casefold() not in _PLACEHOLDER_RECOMMENDATIONS
                    and self._is_useful_advice(text)
                ):
                    return {
                        "text": text,
                        "path": document["path"],
                        "revision": digest(text),
                        "label": "Current working recommendation",
                    }
            except (OSError, UnicodeError, TypeError, ValueError, YAMLError):
                warnings.append("The working recommendation could not be loaded.")

        candidates: list[tuple[str, str, dict[str, str]]] = []
        directory = self.vault.resolve(f"{base}/conversations")
        if directory.exists():
            for path in sorted(directory.glob("*.md")):
                try:
                    document = self.vault.read_markdown(self.vault.relative(path))
                    metadata = document["metadata"]
                    if metadata.get("matter_id") != matter_id:
                        continue
                    messages = metadata.get("messages", [])
                    submissions = {
                        str(message.get("run_id")): message.get("workspace_submission", {})
                        for message in messages
                        if isinstance(message, dict)
                        and message.get("role") == "user"
                        and message.get("run_id")
                    }
                    for message in messages:
                        if not isinstance(message, dict) or message.get("role") != "assistant":
                            continue
                        if self._is_communication_run(
                            matter_id, base, message.get("run_id"), submissions
                        ):
                            continue
                        text = str(message.get("content") or "").strip()
                        if not self._is_useful_advice(text):
                            continue
                        created = str(message.get("created_at") or metadata.get("updated_at") or "")
                        revision = str(message.get("message_id") or digest(text))
                        candidates.append((created, document["path"], {
                            "text": text,
                            "path": document["path"],
                            "revision": revision,
                            "label": "Earlier saved assistant advice",
                        }))
                except (OSError, UnicodeError, TypeError, ValueError, YAMLError):
                    warnings.append("Some earlier conversation advice could not be loaded.")
        if not candidates:
            return None
        return max(candidates, key=lambda item: (item[0], item[1]))[2]

    def _is_communication_run(
        self,
        matter_id: str,
        base: str,
        run_id: Any,
        submissions: dict[str, Any],
    ) -> bool:
        run_id = str(run_id or "").strip()
        if not run_id:
            return False
        submission = submissions.get(run_id)
        if (
            isinstance(submission, dict)
            and submission.get("workspace_action") in _COMMUNICATION_WORKSPACE_ACTIONS
        ):
            return True
        run_path = f"{base}/conversations/runs/{run_id}.md"
        try:
            if not self.vault.exists(run_path):
                return False
            metadata = self.vault.read_markdown(run_path)["metadata"]
        except (OSError, UnicodeError, TypeError, ValueError, YAMLError):
            return False
        request = metadata.get("request")
        return (
            metadata.get("matter_id") == matter_id
            and metadata.get("run_id") == run_id
            and metadata.get("record_type") == "chat_run"
            and isinstance(request, dict)
            and request.get("workspace_action") in _COMMUNICATION_WORKSPACE_ACTIONS
        )

    @staticmethod
    def _clean_document_text(content: str) -> str:
        text = str(content or "").strip()
        text = re.sub(r"^#(?:#+)?\s+[^\n]+\n+", "", text).strip()
        return text

    @staticmethod
    def _is_useful_advice(text: str) -> bool:
        compact = " ".join(text.split()).casefold()
        if (
            not compact
            or compact in _NON_ADVICE_EXACT
            or compact.startswith(_NON_ADVICE_PREFIXES)
        ):
            return False
        # Tool-only status messages are provenance, not legal or practical advice.
        if compact.startswith(("created work item:", "updated records:", "open work item")):
            return False
        return True

    @staticmethod
    def _preview(text: str, limit: int = 240) -> tuple[str, bool]:
        if len(text) <= limit:
            return text, False
        cut = text[: limit + 1].rsplit(" ", 1)[0].rstrip(" ,;:")
        return f"{cut}…", True

    @staticmethod
    def _caveats(text: str) -> list[str]:
        caveats: list[str] = []
        markers = (
            "working assumption", "assumption:", "limitation", "not examined",
            "not verified", "unconfirmed", "unknown", "depends on", "subject to",
        )
        for paragraph in re.split(r"\n\s*\n|(?<=[.!?])\s+(?=[A-Z])", text):
            item = " ".join(paragraph.split()).strip()
            if item and any(marker in item.casefold() for marker in markers):
                caveats.append(item)
        return caveats[:5]

    @staticmethod
    def _primary_action(
        *, snapshot: dict, matter: dict, work_items: list[dict], actor: ActionActor,
        requests: Iterable[dict], team_items: Iterable[dict],
    ) -> dict | None:
        if str(matter.get("status") or "").casefold() == "closed":
            return None
        matter_id = str(snapshot.get("matter_id") or matter.get("matter_id") or "")
        work_state = matter.get("work_state") if isinstance(matter.get("work_state"), dict) else {}
        run_id = str(work_state.get("active_run_id") or snapshot.get("run_id") or "").strip()
        execution = str(work_state.get("execution_state") or "").casefold()
        if run_id and execution in {"queued", "running"}:
            return NextAction(
                action_id=f"run:{run_id}", label="Open agent work",
                reason="Themis.ai is working on this matter.", state="running",
                target={"matter_id": matter_id, "kind": "run", "target_id": run_id, "view": "discuss"},
                owner_name="Themis.ai", actor_kind="agent",
            ).model_dump()
        if execution == "unknown":
            return NextAction(
                action_id="agent-status-unavailable", label="Review agent status",
                reason=(str(work_state.get("execution_note") or "").strip()
                        or "The saved agent status could not be loaded."),
                state="unavailable",
                target={"matter_id": matter_id, "kind": "matter", "target_id": matter_id,
                        "path": matter.get("path"), "view": "discuss"},
                actor_kind="agent",
            ).model_dump()

        for item in team_items:
            action = item.get("action") if isinstance(item, dict) else None
            handoff_id = str(item.get("handoff_id") or "") if isinstance(item, dict) else ""
            if (
                isinstance(item, dict)
                and str(item.get("matter_id") or "") == matter_id
                and handoff_id
                and str(item.get("queue") or "") == "my_work"
                and isinstance(action, dict)
            ):
                candidate = dict(action)
                candidate.setdefault("action_id", f"handoff:{handoff_id}")
                candidate["target"] = {
                    "matter_id": matter_id, "kind": "handoff", "target_id": handoff_id,
                    "path": candidate.get("target", {}).get("path") if isinstance(candidate.get("target"), dict) else None,
                    "view": "understand",
                }
                return NextAction.model_validate(candidate).model_dump()

        open_required = [
            item for item in work_items
            if bool(item.get("required")) and WorkspaceOrientationService._state(item) not in _DONE
        ]
        next_id = str(work_state.get("next_work_item_id") or "")
        required = next((item for item in open_required if str(item.get("work_item_id")) == next_id), None)
        required = required or min(open_required, key=WorkspaceOrientationService._work_sort, default=None)
        if required:
            owner_id, owner_name = WorkspaceOrientationService._owner(required)
            state = "waiting" if WorkspaceOrientationService._state(required) == "blocked" else "ready"
            return NextAction(
                action_id=f"work-item:{required['work_item_id']}",
                label=str(required.get("title") or "Open required work"),
                reason=(str(required.get("description") or "").strip()
                        or "This required work must be completed before the matter can finish."),
                state=state,
                target={"matter_id": matter_id, "kind": "work_item",
                        "target_id": str(required["work_item_id"]), "path": required.get("path"),
                        "view": "understand"},
                owner_id=owner_id, owner_name=owner_name,
                actor_kind="lawyer" if owner_id or owner_name else "unknown",
                required=True, due_at=WorkspaceOrientationService._text_or_none(required.get("due_at")),
            ).model_dump()

        for request in requests:
            if (
                not isinstance(request, dict)
                or str(request.get("matter_id") or "") != matter_id
                or str(request.get("state") or "") not in _ACTIVE_REQUEST
                or not WorkspaceOrientationService._text_or_none(request.get("requested_at"))
            ):
                continue
            person = WorkspaceOrientationService._text_or_none(request.get("requested_person"))
            if not person:
                continue
            request_id = str(request.get("request_id") or "")
            if not request_id:
                continue
            return NextAction(
                action_id=f"fact-request:{request_id}", label=f"Waiting on {person}",
                reason="A saved external fact request is still open.", state="waiting",
                target={"matter_id": matter_id, "kind": "fact_request", "target_id": request_id,
                        "path": request.get("path"), "view": "understand"},
                owner_name=person, actor_kind="business",
                due_at=WorkspaceOrientationService._text_or_none(request.get("due_at")),
            ).model_dump()

        label = str(work_state.get("next_action") or matter.get("next_action") or "Review this matter").strip()
        target = WorkspaceOrientationService._lifecycle_target(matter_id, matter, label)
        owner_id = WorkspaceOrientationService._text_or_none(matter.get("legal_owner_id"))
        owner_name = WorkspaceOrientationService._text_or_none(matter.get("legal_owner"))
        return NextAction(
            action_id=f"matter:{digest([matter_id, label])[:16]}", label=label,
            reason="This is the next step in the saved matter lifecycle.", state="ready",
            target=target, owner_id=owner_id, owner_name=owner_name,
            actor_kind="lawyer" if owner_id or owner_name else "unknown",
        ).model_dump()

    @staticmethod
    def _secondary_actions(*, matter_id: str, question: dict, snapshot: dict, primary: dict | None) -> list[dict]:
        actions = [NextAction(
            action_id="discuss-current-question", label="Discuss",
            reason="Discuss the current question without changing the saved answer.", state="ready",
            target={"matter_id": matter_id, "kind": "question",
                    "target_id": str(question.get("question_id") or matter_id),
                    "revision": question.get("revision"), "view": "discuss"},
            actor_kind="lawyer",
        ).model_dump()]
        draft_path = WorkspaceOrientationService._first_text(
            [item.get("path") for item in snapshot.get("work_products", []) if isinstance(item, dict)]
        )
        actions.append(NextAction(
            action_id="open-draft", label="Draft",
            reason="Open the matter's drafting workspace.", state="ready",
            target={"matter_id": matter_id, "kind": "artifact" if draft_path else "matter",
                    "target_id": draft_path or matter_id, "path": draft_path, "view": "draft"},
            actor_kind="lawyer",
        ).model_dump())
        primary_id = primary.get("action_id") if primary else None
        return [item for item in actions if item["action_id"] != primary_id][:2]

    @staticmethod
    def _lifecycle_target(matter_id: str, matter: dict, label: str) -> dict[str, Any]:
        path = WorkspaceOrientationService._text_or_none(
            matter.get("current_work_product_final_path") or matter.get("current_work_product_draft_path")
        )
        if path and any(word in label.casefold() for word in ("draft", "response", "approve", "delivery")):
            return {"matter_id": matter_id, "kind": "artifact", "target_id": path,
                    "path": path, "view": "draft"}
        return {"matter_id": matter_id, "kind": "matter", "target_id": matter_id,
                "path": matter.get("path"), "view": "understand"}

    @staticmethod
    def _changes(*, snapshot: dict, seen: dict | None) -> tuple[list[dict], bool, str | None, str]:
        recap = snapshot.get("recap") if isinstance(snapshot.get("recap"), dict) else {}
        current_revision = str(recap.get("current_revision") or snapshot.get("revision") or "")
        seen_revision = WorkspaceOrientationService._text_or_none((seen or {}).get("revision"))
        first_visit = seen_revision is None
        matter_id = str(snapshot.get("matter_id") or "")
        if first_visit:
            return ([{
                "change_id": f"first-visit:{current_revision}",
                "title": "First review",
                "detail": "This is your first review of the current saved matter state.",
                "basis": "first_visit",
                "target": {"matter_id": matter_id, "kind": "matter", "target_id": matter_id,
                           "view": "understand"},
            }], True, None, current_revision)
        if seen_revision == current_revision:
            return [], False, seen_revision, current_revision

        previous_sources = (seen or {}).get("source_revisions")
        previous_sources = previous_sources if isinstance(previous_sources, dict) else {}
        receipts = [item for item in snapshot.get("receipts", []) if isinstance(item, dict)]
        changes: list[dict] = []
        raw_changes = [item for item in recap.get("changes", []) if isinstance(item, dict)]
        raw_by_path = {str(item.get("path") or ""): item for item in raw_changes}
        current_sources = snapshot.get("source_revisions")
        current_sources = current_sources if isinstance(current_sources, dict) else {}
        # The saved recap can reflect the legacy single-lawyer cursor. Rebuild the
        # changed-path set from the supplied person's cursor when one is present.
        for path, after in current_sources.items():
            if previous_sources.get(path) != after and path not in raw_by_path:
                raw_changes.append({
                    "path": path,
                    "before_revision": previous_sources.get(path),
                    "after_revision": after,
                })
        for raw in raw_changes:
            if not isinstance(raw, dict):
                continue
            path = str(raw.get("path") or "")
            after = str(raw.get("after_revision") or "") or None
            before = previous_sources.get(path, raw.get("before_revision"))
            if path in previous_sources and previous_sources.get(path) == after:
                continue
            receipt = next((r for r in reversed(receipts) if path in (r.get("changed_links") or [])), None)
            title = WorkspaceOrientationService._change_title(path)
            if raw.get("before_text") is not None and raw.get("after_text") is not None:
                basis, detail = "saved_versions", f"{title} changed from the saved earlier text."
            elif receipt:
                basis = "saved_receipt"
                operation = str(receipt.get("operation") or "update").replace("_", " ")
                detail = f"Saved action: {operation}."
            else:
                basis = "hash_only"
                detail = f"{title} changed; earlier text is unavailable."
            changes.append({
                "change_id": f"change:{digest([path, before, after])[:20]}", "title": title,
                "detail": detail, "basis": basis,
                "target": {"matter_id": matter_id, "kind": "artifact", "target_id": path,
                           "path": path, "view": "understand"} if path else None,
                "before_text": raw.get("before_text"), "after_text": raw.get("after_text"),
                "before_revision": before, "after_revision": after,
            })
        for path in recap.get("new_outputs", []):
            path = str(path or "")
            changes.append({
                "change_id": f"output:{digest(path)[:20]}", "title": "Saved output added",
                "detail": "A saved matter output is available for review.", "basis": "hash_only",
                "target": {"matter_id": matter_id, "kind": "artifact", "target_id": path,
                           "path": path, "view": "draft"},
            })
        return changes, False, seen_revision, current_revision

    @staticmethod
    def _change_title(path: str) -> str:
        stem = PurePosixPath(path).stem.casefold()
        labels = {
            "facts": "Facts", "issues": "Issue map", "matter": "Matter details",
            "dossier": "Business question", "recommendations": "Recommendation",
            "flow": "Business flow", "workspace": "Workspace",
        }
        return labels.get(stem, "Matter source")

    @staticmethod
    def _work_sort(item: dict) -> tuple[Any, ...]:
        ranks = {"urgent": 0, "high": 1, "normal": 2, "low": 3}
        return (
            ranks.get(str(item.get("priority") or "normal").casefold(), 2),
            0 if item.get("due_at") else 1,
            str(item.get("due_at") or ""), str(item.get("created_at") or ""),
            str(item.get("title") or ""), str(item.get("work_item_id") or ""),
        )

    @staticmethod
    def _state(item: dict) -> str:
        return str(item.get("status") or item.get("state") or "").strip().casefold()

    @staticmethod
    def _owner(item: dict) -> tuple[str | None, str | None]:
        return (
            WorkspaceOrientationService._text_or_none(item.get("owner_id")),
            WorkspaceOrientationService._text_or_none(item.get("owner_name") or item.get("owner")),
        )

    @staticmethod
    def _text_or_none(value: Any) -> str | None:
        text = str(value or "").strip()
        return text or None

    @staticmethod
    def _first_text(values: Any) -> str | None:
        if not isinstance(values, (list, tuple)):
            return None
        return next((str(value).strip() for value in values if str(value or "").strip()), None)
