from __future__ import annotations

import asyncio
import logging
import re
from copy import deepcopy
from typing import Any

from app.models.api import ChatRequest, ChatResponse
from app.models.api import ToolTrace
from app.agents.runner import AgentExecutionError, RunnerExecutionState, saved_intake_recovery_card
from app.agents.output import clean_user_facing_reply, reconcile_user_facing_reply
from app.providers.base import ProviderSelection
from app.services.vault import VaultService
from app.services.dossier import serialized
from app.utils.ids import new_id
from app.utils.time import iso_now


logger = logging.getLogger(__name__)


class ChatRunService:
    """Owns durable, in-process matter chat work."""

    def __init__(self, vault: VaultService, context: Any, timeout_seconds: int = 180):
        self.vault = vault
        self.context = context
        self.timeout_seconds = timeout_seconds
        self._tasks: dict[str, asyncio.Task[None]] = {}

    @property
    def has_active_work(self) -> bool:
        return any(not task.done() for task in self._tasks.values())

    def start(
        self,
        matter_id: str,
        request: ChatRequest,
        *,
        existing_user_message_id: str | None = None,
        persist_user_message: bool = True,
    ) -> dict[str, Any]:
        if request.matter_id not in {None, matter_id}:
            raise ValueError("The chat request belongs to a different matter.")
        submitted_command = request.model_dump(mode="json", exclude={"action_actor", "lawyer_author", "review_author", "frozen_context", "frozen_template_use", "history"})
        matter = self.context.matters.get(matter_id)
        if request.source_action_key:
            from app.services.workspace import WorkspaceConflict
            directory = self.vault.resolve(f"{matter['path']}/conversations/runs")
            for path in directory.glob("RUN-*.md"):
                existing = self.vault.read_markdown(self.vault.relative(path))["metadata"]
                submitted = existing.get("request") or {}
                if submitted.get("source_action_key") != request.source_action_key:
                    continue
                if existing.get("submitted_command") is not None:
                    if existing["submitted_command"] != submitted_command:
                        raise WorkspaceConflict("This action key was already used for another request.", "", code="action_key_conflict")
                    return self._recover_draft_output({**existing, "path": self.vault.relative(path)})
                current = request.model_dump(mode="json")
                fields = ["message", "active_file", "agent_id", "card_action", "attachments", "context_selections", "output_type", "template_id", "template_overrides", "preview", "workspace_action", "update_offer_id", "continuity_context"]
                if request.target is not None:
                    fields.append("target")
                if request.expected_question_revision is not None:
                    fields.append("expected_question_revision")
                if any((existing.get("requested_agent_id", submitted.get(field)) if field == "agent_id" else submitted.get(field)) != current.get(field) for field in fields):
                    raise WorkspaceConflict("This action key was already used for another request.", submitted.get("expected_question_revision") or "", code="action_key_conflict")
                return self._recover_draft_output({**existing, "path": self.vault.relative(path)})
        if request.action_actor is None:
            request = request.model_copy(update={"action_actor": self.context.workspace_team.resolve_actor().model_dump()})
        request = request.model_copy(update={"lawyer_author": request.action_actor["display_name"]})
        conversation_id = request.conversation_id
        if (
            conversation_id is None
            and request.agent_id == "intake-agent"
            and matter.get("intake_state") == "active"
        ):
            conversation_id = matter.get("intake_conversation_id")
        requested_agent_id = request.agent_id
        from app.routers.chat import freeze_workspace_request, freeze_run_context, _route_matter_agent
        conversation = self.context.chat_history.get(matter_id, conversation_id) if conversation_id else {}
        actual_agent_id = _route_matter_agent(request, intake_active=conversation.get("conversation_kind") == "intake" and conversation.get("intake_state") == "active" and not (request.target and request.target.scenario_id), recovery=request.intake_recovery)
        request = request.model_copy(update={"agent_id": actual_agent_id})
        request = freeze_workspace_request(request.model_copy(update={"matter_id": matter_id}), self.context)
        run_id = new_id("RUN")
        payload = request.model_copy(update={
            "matter_id": matter_id,
            "conversation_id": conversation_id,
            "expected_dossier_hash": self.context.dossiers.content_hash(matter_id),
            "source_action_key": request.source_action_key or f"chat:{run_id}",
        })
        payload = freeze_run_context(payload, self.context, run_id)
        resolved = self.context.runner.resolve(payload.agent_id)
        if not persist_user_message and not payload.conversation_id:
            raise ValueError("An internal chat run needs an existing conversation.")
        if payload.conversation_id:
            from app.routers.chat import (
                _reject_duplicate_question_action,
                _validate_question_action,
            )

            saved_conversation = self.context.chat_history.get(
                matter_id, payload.conversation_id
            )
            _reject_duplicate_question_action(saved_conversation, payload)
            _validate_question_action(saved_conversation, payload)
        if existing_user_message_id is None and persist_user_message:
            from app.routers.chat import _action_text

            saved = self.context.chat_history.append(
                matter_id,
                payload.conversation_id,
                role="user",
                content=payload.message.strip() or _action_text(payload),
                attachments=[item.model_dump() for item in payload.attachments],
                card_action=payload.card_action.model_dump() if payload.card_action else None,
                run_id=run_id, action_actor=payload.action_actor,
            )
            payload = payload.model_copy(update={"conversation_id": saved["conversation_id"]})
        record = self._write(
            matter_id, run_id, state="queued", status="Chat is queued.",
            request=payload.model_dump(mode="json"), submitted_command=submitted_command, action_actor=payload.action_actor, conversation_id=payload.conversation_id,
            frozen_context=payload.frozen_context, frozen_template_use=payload.frozen_template_use,
            persist_user_message=persist_user_message, requested_agent_id=requested_agent_id,
            expected_dossier_hash=payload.expected_dossier_hash,
            correlation_id=new_id("COR"),
            milestone="Queued.",
            selection={
                "agent_id": resolved.selection.agent_id,
                "provider": resolved.selection.provider,
                "model": resolved.selection.model,
                "reasoning_effort": resolved.selection.reasoning_effort,
            },
        )
        if existing_user_message_id:
            if not payload.conversation_id:
                raise ValueError("An existing user message needs a conversation ID.")
            self.context.chat_history.bind_run_to_message(
                matter_id,
                payload.conversation_id,
                existing_user_message_id,
                run_id,
            )
        self._tasks[run_id] = asyncio.create_task(self._execute(matter_id, run_id))
        return record

    def retry(self, matter_id: str, run_id: str) -> dict[str, Any]:
        current = self.get(matter_id, run_id)
        task = self._tasks.get(run_id)
        if task is not None and not task.done():
            raise ValueError("This chat run is already queued or running.")
        if current["state"] not in {"failed", "interrupted"}:
            raise ValueError("Only failed or interrupted chat runs can be retried.")
        attempt = int(current.get("context_attempt") or 1) + 1
        manifest_id = f"{run_id}-attempt-{attempt}"
        frozen = deepcopy(current.get("frozen_context") or {})
        history = list(current.get("context_manifest_history") or [run_id])
        if frozen.get("manifest"):
            manifest = frozen["manifest"]
            # Each attempt re-supplies the frozen submission. New observed reads
            # belong only to that attempt; earlier immutable evidence stays saved.
            manifest.update(run_id=manifest_id, logical_run_id=run_id, attempt=attempt,
                attempt_started_at=iso_now(), entries=[entry for entry in manifest["entries"] if entry.get("role") != "tool_read"])
            frozen.pop("workspace_tool_actions", None)
        record = self._write(
            matter_id,
            run_id,
            state="queued",
            attempt_results=[*current.get("attempt_results", []), {
                "attempt": int(current.get("context_attempt") or 1), "state": current["state"],
                "response": deepcopy(current.get("response")), "failure_detail": current.get("failure_detail"),
                "finished_at": current.get("finished_at")}],
            frozen_context=frozen, manifest_saved=False, manifest_warning=None,
            context_attempt=attempt, context_manifest_id=manifest_id,
            context_manifest_history=[*history, manifest_id],
            status="Chat retry is queued.",
            started_at=None,
            failure_detail=None,
            failure_class=None,
            finished_at=None,
            response=None,
            milestone="Queued.",
        )
        self._tasks[run_id] = asyncio.create_task(self._execute(matter_id, run_id))
        return record

    def automatic_action(self, matter_id: str, run_id: str, key: str) -> dict[str, Any] | None:
        return self.get(matter_id, run_id).get("automatic_actions", {}).get(key)

    def checkpoint_automatic_action(
        self, matter_id: str, run_id: str, key: str, **values: Any
    ) -> dict[str, Any]:
        current = self.get(matter_id, run_id)
        actions = dict(current.get("automatic_actions", {}))
        actions[key] = {**dict(actions.get(key, {})), **values}
        return self._write(matter_id, run_id, automatic_actions=actions)

    def list(self, matter_id: str, conversation_id: str | None = None) -> list[dict[str, Any]]:
        directory = self.vault.resolve(f"{self.context.matters.matter_path(matter_id)}/conversations/runs")
        runs = []
        for path in directory.glob("RUN-*.md"):
            item = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if item.get("record_type") == "chat_run" and item.get("matter_id") == matter_id and (not conversation_id or item.get("conversation_id") == conversation_id):
                runs.append({**item, "path": self.vault.relative(path)})
        return sorted(runs, key=lambda item: (item.get("created_at") or "", item["run_id"]), reverse=True)

    def get(self, matter_id: str, run_id: str) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        if not self.vault.exists(path):
            raise KeyError(f"Chat run not found: {run_id}")
        metadata = self.vault.read_markdown(path)["metadata"]
        if metadata.get("matter_id") != matter_id or metadata.get("record_type") != "chat_run":
            raise KeyError(f"Chat run not found: {run_id}")
        return {**metadata, "path": path}

    def mark_running_interrupted(self) -> int:
        count = 0
        for path in self.vault.iter_files("03_Matters", {".md"}):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
            except (OSError, ValueError):
                continue
            metadata = document["metadata"]
            if metadata.get("record_type") == "chat_run" and metadata.get("state") in {"queued", "running"}:
                execution = RunnerExecutionState(
                    trace=[ToolTrace.model_validate(item) for item in metadata.get("partial_trace", [])],
                    changed_paths=list(metadata.get("partial_changed_paths", [])),
                    refresh=list(metadata.get("partial_refresh", [])),
                    completed_mutations=dict(metadata.get("completed_mutations", {})),
                    operation_results=list(metadata.get("operation_results", [])),
                    useful_content=str(metadata.get("useful_content") or ""),
                )
                request_values = metadata.get("request")
                request = (
                    ChatRequest.model_validate(request_values)
                    if isinstance(request_values, dict) else ChatRequest(
                        message="", matter_id=str(metadata.get("matter_id") or "") or None
                    )
                )
                _reconcile_execution_evidence(execution, request=request)
                _ensure_generic_no_change_result(execution, request)
                response = self._partial_result(execution)
                response.operation_results = list(execution.operation_results)
                response.reply = reconcile_user_facing_reply(
                    response.reply, response.operation_results
                )
                saved_run = self._write(str(metadata["matter_id"]), str(metadata["run_id"]), **{
                    "state": "interrupted", "status": "Chat was interrupted when the application stopped.",
                    "failure_detail": "The application stopped before this request finished.",
                    "failure_class": "interrupted",
                    "correlation_id": metadata.get("correlation_id") or new_id("COR"),
                    "milestone": (
                        "Failed with preserved work."
                        if _has_useful_execution_evidence(execution)
                        else "Interrupted."
                    ),
                    "finished_at": iso_now(),
                    "operation_results": execution.operation_results,
                    "partial_changed_paths": list(dict.fromkeys(execution.changed_paths)),
                    "partial_refresh": list(dict.fromkeys(execution.refresh)),
                    "response": response.model_dump(mode="json"),
                })
                self._fail_scenario_analysis(saved_run, "The application stopped before this scenario analysis finished.")
                count += 1
        return count

    async def cancel(self, matter_id: str, run_id: str) -> dict[str, Any]:
        current = self.get(matter_id, run_id)
        if current["state"] not in {"queued", "running"}:
            return current
        task = self._tasks.get(run_id)
        if task and not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
        current = self.get(matter_id, run_id)
        saved = self._write(matter_id, run_id, state="interrupted", status="Stopped by the lawyer. Saved work is retained.",
                           failure_detail="Stopped at the lawyer's request.", failure_class="interrupted", finished_at=iso_now())
        self._fail_scenario_analysis(saved, "Stopped at the lawyer's request.")
        return saved

    async def wait(self, run_id: str) -> None:
        task = self._tasks.get(run_id)
        if task:
            await task

    async def wait_for_active_work(self) -> None:
        tasks = [task for task in self._tasks.values() if not task.done()]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _execute(self, matter_id: str, run_id: str) -> None:
        from app.routers.chat import execute_chat

        current = self.get(matter_id, run_id)
        self._write(
            matter_id, run_id, state="running", status="Model is working.",
            milestone="Model is working.", started_at=iso_now(), failure_class=None,
        )
        execution = RunnerExecutionState(
            trace=[ToolTrace.model_validate(item) for item in current.get("partial_trace", [])],
            changed_paths=list(current.get("partial_changed_paths", [])),
            refresh=list(current.get("partial_refresh", [])),
            completed_mutations=dict(current.get("completed_mutations", {})),
            operation_results=list(current.get("operation_results", [])),
            useful_content=str(current.get("useful_content") or ""),
            scope_state=dict(current.get("scope_state") or {}),
            frozen_context=dict(current.get("frozen_context") or {}),
        )

        def checkpoint(state: RunnerExecutionState) -> None:
            saved_run = self._write(
                matter_id, run_id,
                completed_mutations=state.completed_mutations,
                partial_trace=[item.model_dump(mode="json") for item in state.trace],
                partial_changed_paths=list(dict.fromkeys(state.changed_paths)),
                partial_refresh=list(dict.fromkeys(state.refresh)),
                operation_results=state.operation_results,
                useful_content=state.useful_content,
                scope_state=state.scope_state,
                frozen_context=state.frozen_context,
                status=_execution_milestone(state),
                milestone=_execution_milestone(state),
            )
        try:
            request = ChatRequest.model_validate(current["request"])
            request = request.model_copy(
                update={"expected_dossier_hash": current.get("expected_dossier_hash"), "frozen_context": current.get("frozen_context"), "frozen_template_use": current.get("frozen_template_use")}
            )
            saved_selection = current.get("selection")
            resolved = (
                self.context.runner.resolve(request.agent_id)
                if not saved_selection or saved_selection.get("provider") == "workspace_default"
                else self.context.provider_router.resolve_selection(ProviderSelection(**saved_selection))
            )
            response = await asyncio.wait_for(
                execute_chat(
                    request, self.context, run_id=run_id,
                    execution_state=execution, checkpoint=checkpoint,
                    resolved_provider=resolved,
                    persist_user_message=bool(current.get("persist_user_message", True)),
                ),
                timeout=self.timeout_seconds,
            )
            # Keep polling in the running state until the explicit draft save
            # has finished, so the editor cannot observe completion too early.
            completed = self._recover_draft_output({
                **self.get(matter_id, run_id), "state": "completed",
                "response": response.model_dump(mode="json"), "conversation_id": response.conversation_id,
                "request": request.model_copy(update={"conversation_id": response.conversation_id}).model_dump(mode="json"),
            })
            saved_run = self._write(
                matter_id, run_id, state="completed", status="Chat is complete.",
                response=completed["response"], conversation_id=response.conversation_id,
                operation_results=completed["response"].get("operation_results", execution.operation_results),
                request=request.model_copy(update={"conversation_id": response.conversation_id}).model_dump(mode="json"),
                finished_at=iso_now(), failure_detail=None, failure_class=None,
                milestone="Completed.",
            )
        except asyncio.TimeoutError:
            self._restore_persisted_evidence(matter_id, run_id, execution)
            _reconcile_execution_evidence(
                execution, request=ChatRequest.model_validate(current["request"])
            )
            checkpoint(execution)
            response, has_useful_result = await self._timeout_result(current, execution)
            request = ChatRequest.model_validate(current["request"])
            _ensure_generic_no_change_result(execution, request)
            response.operation_results = list(execution.operation_results)
            response.reply = reconcile_user_facing_reply(
                response.reply, response.operation_results
            )
            state = "completed" if has_useful_result else "failed"
            conversation_id = str(current.get("conversation_id") or "") or None
            if state == "failed":
                logger.warning(
                    "Chat run %s failed [%s]: timeout",
                    run_id, current.get("correlation_id"),
                )
            saved_run = self._write(
                matter_id, run_id, state=state, status="Chat reached its time limit.",
                response=response.model_dump(mode="json") if response.reply.strip() else None,
                conversation_id=conversation_id,
                request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                failure_detail=None if state == "completed" else "The request reached its time limit.",
                failure_class=None if state == "completed" else "timeout",
                milestone=(
                    "Completed with saved partial work." if state == "completed"
                    else "Failed with preserved work." if has_useful_result
                    else "Failed."
                ),
                finished_at=iso_now(),
            )
            if state == "failed":
                self._fail_scenario_analysis(saved_run, "The scenario analysis reached its time limit.")
            if response.reply.strip() and conversation_id:
                self._sync_assistant_message(
                    matter_id, conversation_id, run_id, response, execution
                )
        except asyncio.CancelledError:
            logger.warning(
                "Chat run %s interrupted [%s]", run_id, current.get("correlation_id")
            )
            request = ChatRequest.model_validate(current["request"])
            self._restore_persisted_evidence(matter_id, run_id, execution)
            _reconcile_execution_evidence(execution, request=request)
            checkpoint(execution)
            response = self._partial_result(execution)
            response.operation_results = list(execution.operation_results)
            response.reply = reconcile_user_facing_reply(response.reply, response.operation_results)
            conversation_id = str(current.get("conversation_id") or "") or None
            saved_run = self._write(
                matter_id, run_id, state="interrupted", status="Chat was interrupted.",
                conversation_id=conversation_id, response=response.model_dump(mode="json"),
                request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                failure_detail="The application stopped before this request finished.",
                failure_class="interrupted",
                milestone=(
                    "Failed with preserved work."
                    if _has_useful_execution_evidence(execution)
                    else "Interrupted."
                ),
                finished_at=iso_now(),
            )
            self._fail_scenario_analysis(saved_run, "The application stopped before this scenario analysis finished.")
            if conversation_id and response.reply.strip():
                self._sync_assistant_message(
                    matter_id, conversation_id, run_id, response, execution
                )
            raise
        except AgentExecutionError as exc:
            execution = exc.state
            self._restore_persisted_evidence(matter_id, run_id, execution)
            _reconcile_execution_evidence(
                execution, request=ChatRequest.model_validate(current["request"])
            )
            checkpoint(execution)
            response = self._partial_result(execution)
            request = ChatRequest.model_validate(current["request"])
            _ensure_generic_no_change_result(execution, request)
            response.operation_results = list(execution.operation_results)
            response.reply = reconcile_user_facing_reply(
                response.reply, response.operation_results
            )
            conversation_id = str(current.get("conversation_id") or "") or None
            has_useful_partial = _has_useful_execution_evidence(execution)
            if request.intake_recovery and conversation_id:
                fallback = saved_intake_recovery_card(self.context, matter_id)
                response.cards = [fallback]
                response.reply = (
                    execution.useful_content.strip()
                    or "The model recovery did not finish. Continue from the saved intake state below."
                )
                response.operation_results = list(execution.operation_results)
                self._write(
                    matter_id, run_id, state="completed",
                    status="Intake recovery used saved matter state.",
                    conversation_id=conversation_id,
                    response=response.model_dump(mode="json"),
                    request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                    failure_detail=None, failure_class=None,
                    milestone="Completed from saved intake state.", finished_at=iso_now(),
                )
                self._sync_assistant_message(
                    matter_id, conversation_id, run_id, response, execution
                )
                return
            saved_run = self._write(
                matter_id, run_id, state="failed", status="Chat stopped after preserving useful work.",
                conversation_id=conversation_id, response=response.model_dump(mode="json"),
                request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                failure_detail=(exc.safe_detail or "The model or a required tool could not finish this request."),
                failure_class=exc.failure_class,
                milestone="Failed with preserved work." if has_useful_partial else "Failed.",
                finished_at=iso_now(),
            )
            self._fail_scenario_analysis(saved_run, exc.safe_detail or "The scenario analysis could not finish.")
            logger.warning(
                "Chat run %s failed [%s]: %s",
                run_id, current.get("correlation_id"), exc.failure_class,
            )
            if response.reply.strip() and conversation_id:
                self._sync_assistant_message(
                    matter_id, conversation_id, run_id, response, execution
                )
        except Exception as exc:
            logger.warning(
                "Chat run %s failed [%s]: %s",
                run_id, current.get("correlation_id"), type(exc).__name__,
            )
            conversation_id = str(current.get("conversation_id") or "") or None
            request = ChatRequest.model_validate(current["request"])
            self._restore_persisted_evidence(matter_id, run_id, execution)
            _reconcile_execution_evidence(execution, request=request)
            checkpoint(execution)
            response = self._partial_result(execution)
            response.operation_results = list(execution.operation_results)
            response.reply = reconcile_user_facing_reply(response.reply, response.operation_results)
            has_useful_partial = _has_useful_execution_evidence(execution)
            saved_run = self._write(
                matter_id, run_id, state="failed", status="Chat could not finish.",
                conversation_id=conversation_id,
                response=response.model_dump(mode="json"),
                request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                failure_detail="The model or a required tool could not finish this request.",
                failure_class="unknown",
                milestone="Failed with preserved work." if has_useful_partial else "Failed.",
                finished_at=iso_now(),
            )
            self._fail_scenario_analysis(saved_run, "The scenario analysis could not finish.")
            if conversation_id and response.reply.strip():
                self._sync_assistant_message(
                    matter_id, conversation_id, run_id, response, execution
                )
        finally:
            self._tasks.pop(run_id, None)

    async def _timeout_result(
        self, current: dict[str, Any], execution: RunnerExecutionState
    ) -> tuple[ChatResponse, bool]:
        request = ChatRequest.model_validate(current["request"])
        messages = list(execution.messages) or [message.model_dump() for message in request.history[-12:]]
        if not execution.messages:
            messages.append({"role": "user", "content": request.message})
        messages.append({"role": "system", "content": "The time limit was reached. Do not call tools. Give the best useful answer from the information already present. State remaining work."})
        try:
            selection = current.get("selection")
            provider = (
                self.context.runner.resolve(request.agent_id).provider
                if not selection or selection.get("provider") == "workspace_default"
                else self.context.provider_router.resolve_selection(ProviderSelection(**selection)).provider
            )
            reply = await asyncio.wait_for(provider.complete(messages, None), timeout=30)
            user_facing_content = clean_user_facing_reply(reply.content)
            if user_facing_content:
                return (
                    ChatResponse(
                        reply=user_facing_content, trace=execution.trace,
                        changed_paths=list(dict.fromkeys(execution.changed_paths)),
                        refresh=list(dict.fromkeys(execution.refresh)),
                    ),
                    True,
                )
        except Exception:
            pass
        return (
            self._partial_result(execution, timed_out=True),
            _has_useful_execution_evidence(execution),
        )

    @staticmethod
    def _partial_result(execution: RunnerExecutionState, *, timed_out: bool = False) -> ChatResponse:
        useful_content = clean_user_facing_reply(execution.useful_content)
        if useful_content:
            reply = useful_content
        else:
            completed = [
                cleaned
                for item in execution.trace
                if item.status == "success"
                if (cleaned := clean_user_facing_reply(item.summary))
            ]
            if completed:
                reply = "Completed work:\n" + "\n".join(f"- {summary}" for summary in completed)
                reply += "\n\nRemaining work:\n- The request needs a final model answer."
            else:
                lead = "The request reached its time limit." if timed_out else "The request stopped before completion."
                reply = (
                    lead + " Saved workspace work is available. The request needs a final model answer."
                    if _has_useful_execution_evidence(execution)
                    else lead + " No tool work completed. The original request still needs review."
                )
        return ChatResponse(
            reply=reply,
            trace=execution.trace,
            changed_paths=list(dict.fromkeys(execution.changed_paths)),
            refresh=list(dict.fromkeys(execution.refresh)),
        )

    @serialized
    def _recover_draft_output(self, run: dict[str, Any]) -> dict[str, Any]:
        """Finish an explicit new-draft save when the model returned only prose.

        Called only during the submitted action or its exact keyed retry, never
        on GET. Existing draft targets remain with their tracked-revision path.
        """
        request = run.get("request") or {}
        if run.get("state") != "completed" or request.get("workspace_action") != "draft":
            return run
        target = request.get("target") or {}
        if target.get("scenario_id") or (run.get("scope_state") or {}).get("scope") == "scenario":
            return run
        response = deepcopy(run.get("response") or {})
        text = str(response.get("reply") or "")
        if not text.strip() or text.strip() == "The available actions are complete; use the trace and updated matter state as the working result.":
            return run
        matter_id, run_id = run["matter_id"], run["run_id"]
        try:
            if target.get("artifact_path"):
                selected = self.vault.read_document(target["artifact_path"])
                if selected.get("metadata", {}).get("record_type") == "work_product":
                    return run
            existing = next((item for item in self.context.work_products.list_drafts(matter_id) if item.get("source_run_id") == run_id), None)
            if existing:
                document = self.vault.read_markdown(existing["path"])
                if document["metadata"].get("draft_context", {}).get("recovery") != "complete_saved_response":
                    return run  # The normal typed writer owns its projections.
                saved = {"vault_path": existing["path"], "title": existing["title"], "work_product_id": existing["work_product_id"],
                    "operation": "save_work_product_draft", "status": "no_change", "source_action_key": request.get("source_action_key"),
                    "changed_paths": [existing["path"]], "entity_refs": [{"type": "work_product", "id": existing["work_product_id"]}]}
                message = self.context.chat_history.find_run_message(matter_id, run["conversation_id"], run_id, "assistant") if run.get("conversation_id") else None
                def linked(value):
                    return any(card.get("type") == "work_product" and card.get("vault_path") == existing["path"] for card in (value or {}).get("cards", [])) and any(
                        item.get("operation") == "save_work_product_draft" and existing["path"] in item.get("changed_paths", []) for item in (value or {}).get("operation_results", []))
                if (run.get("draft_recovery") or {}).get("state") == "saved" and linked(response) and (not run.get("conversation_id") or linked(message)):
                    return run
            else:
                heading = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
                saved = self.context.work_products.create_draft(
                    matter_id, title=heading.group(1).strip() if heading else "Working draft",
                    content=text, source_action_key=request.get("source_action_key") or f"draft:{run_id}",
                    source_run_id=run_id, output_type=request.get("output_type") or "general",
                    template_use=run.get("frozen_template_use"), preview=bool(request.get("preview")),
                    workspace_action="draft", recommendation_actor=request.get("review_author") or "Themis.ai",
                    draft_context={"target": target, "source_revisions": (run.get("frozen_context") or {}).get("publication_baseline", {}),
                        "action_actor": run.get("action_actor") or request.get("action_actor"), "recovery": "complete_saved_response"},
                )
            prior_operation = next((item for item in response.get("operation_results") or [] if item.get("operation") == "save_work_product_draft" and saved["vault_path"] in item.get("changed_paths", [])), None)
            operation = prior_operation or {**saved, "summary": "Saved the complete model response as an editable working draft. Review its content."}
            operations = [item for item in response.get("operation_results") or [] if not (item.get("operation") == "save_work_product_draft" and saved["vault_path"] in item.get("changed_paths", []))]
            operations.append(operation)
            response["operation_results"] = operations
            response["changed_paths"] = list(dict.fromkeys([*(response.get("changed_paths") or []), *saved["changed_paths"]]))
            response["cards"] = [*[card for card in response.get("cards") or [] if not (card.get("type") == "work_product" and card.get("vault_path") == saved["vault_path"])], {"type": "work_product", "title": saved["title"],
                "vault_path": saved["vault_path"], "state": "draft", "preview": bool(request.get("preview")), "summary": operation["summary"]}]
            updated = self._write(matter_id, run_id, response=response, operation_results=operations,
                draft_recovery={"state": "saved", "path": saved["vault_path"]})
            if run.get("conversation_id"):
                if not self._sync_assistant_message(matter_id, run["conversation_id"], run_id,
                    ChatResponse.model_validate(response), RunnerExecutionState(operation_results=operations)):
                    raise OSError("The draft is saved, but its conversation link could not be updated.")
            return updated
        except (OSError, ValueError, KeyError) as exc:
            logger.warning("Draft output remains in run %s; its editable save could not finish: %s", run_id, type(exc).__name__)
            return self._write(matter_id, run_id, response=response, draft_recovery={"state": "not_saved", "detail": str(exc)})

    def _write(self, matter_id: str, run_id: str, **updates: Any) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        current = self.vault.read_markdown(path)["metadata"] if self.vault.exists(path) else {}
        values = {**current, "record_type": "chat_run", "run_id": run_id, "matter_id": matter_id,
                  "created_at": current.get("created_at", iso_now()), "started_at": current.get("started_at"),
                  "finished_at": current.get("finished_at"), "failure_detail": current.get("failure_detail"),
                  "failure_class": current.get("failure_class"),
                  "correlation_id": current.get("correlation_id") or new_id("COR"),
                  "milestone": current.get("milestone"),
                  "response": current.get("response"), **updates}
        if values.get("response") and values.get("conversation_id"):
            values["response"]["conversation_id"] = values["conversation_id"]
        if values.get("state") in {"completed", "failed", "interrupted", "cancelled"} and values.get("frozen_context") and not values.get("manifest_saved"):
            try:
                self.context.workspace_evidence.save_manifest(values["frozen_context"]["manifest"])
                values["manifest_saved"] = True
            except (OSError, ValueError):
                values["manifest_warning"] = "Run output preserved; context manifest could not be saved."
        self.vault.write_markdown(path, f"# Chat run {run_id}\n\n{values['status']}\n", values)
        return {**values, "path": path}

    def _fail_scenario_analysis(self, run: dict[str, Any], detail: str) -> None:
        """Fail only the scenario operation frozen into this exact chat run."""
        request = run.get("request") or {}
        target = request.get("target") or {}
        scenario_id = target.get("scenario_id")
        action_key = request.get("source_action_key")
        if not scenario_id or not action_key:
            return
        try:
            self.context.workspace_scenarios.fail_analysis(
                run["matter_id"], str(scenario_id), source_action_key=str(action_key),
                failure_detail=detail, run_id=run.get("run_id"),
            )
        except (OSError, ValueError, KeyError):
            logger.warning("Could not record failed scenario analysis for run %s.", run.get("run_id"))

    def _sync_assistant_message(
        self,
        matter_id: str,
        conversation_id: str,
        run_id: str,
        response: ChatResponse,
        execution: RunnerExecutionState,
    ) -> bool:
        """Update optional transcript state and report whether its link was saved."""
        try:
            self.context.chat_history.upsert_run_assistant(
                matter_id, conversation_id, run_id, content=response.reply,
                trace=[item.model_dump() for item in response.trace],
                cards=[item.model_dump(mode="json") for item in response.cards],
                applied_skills=[item.model_dump(mode="json") for item in response.applied_skills],
                operation_results=execution.operation_results,
            )
            return True
        except Exception as exc:
            logger.warning(
                "Could not synchronize a terminal chat run to conversation history: %s",
                type(exc).__name__,
            )
            return False

    def _path(self, matter_id: str, run_id: str) -> str:
        # Polling and checkpoints need the indexed path, not a rebuilt matter
        # view that parses every saved conversation, run, and document.
        base = self.context.matters.matter_path(matter_id)
        return f"{base}/conversations/runs/{run_id}.md"

    def _restore_persisted_evidence(
        self, matter_id: str, run_id: str, execution: RunnerExecutionState
    ) -> None:
        """Use an earlier durable checkpoint before making a terminal fallback."""
        persisted = self.get(matter_id, run_id)
        execution.changed_paths = list(dict.fromkeys([
            *persisted.get("partial_changed_paths", []), *execution.changed_paths,
        ]))
        execution.refresh = list(dict.fromkeys([
            *persisted.get("partial_refresh", []), *execution.refresh,
        ]))
        execution.operation_results = _unique_operation_results([
            *persisted.get("operation_results", []), *execution.operation_results,
        ])


def _unique_operation_results(results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str, tuple[str, ...]]] = set()
    for result in results:
        if not isinstance(result, dict):
            continue
        paths = tuple(str(path) for path in result.get("changed_paths", []) if path)
        key = (
            str(result.get("action") or ""), str(result.get("operation") or ""),
            str(result.get("status") or ""), paths,
        )
        if key not in seen:
            unique.append(result)
            seen.add(key)
    return unique


def _has_useful_execution_evidence(execution: RunnerExecutionState) -> bool:
    return bool(
        execution.useful_content.strip()
        or execution.changed_paths
        or any(item.status == "success" for item in execution.trace)
        or any(
            str(item.get("status") or "") in {"changed", "no_change"}
            and str(item.get("operation") or "") != "chat_turn"
            for item in execution.operation_results
            if isinstance(item, dict)
        )
    )


def _execution_milestone(execution: RunnerExecutionState) -> str:
    if execution.changed_paths:
        return "Partial work saved."
    completed = [
        cleaned
        for item in execution.trace
        if item.status == "success"
        if (cleaned := clean_user_facing_reply(item.summary))
    ]
    if completed:
        return f"Last completed step: {completed[-1]}"
    return "Model is working."


def _reconcile_execution_evidence(execution: RunnerExecutionState, *, request: ChatRequest) -> None:
    """Treat persisted result paths as durable evidence after an interrupted run."""
    result_paths = [
        str(path)
        for result in execution.operation_results
        if isinstance(result, dict)
        for path in result.get("changed_paths", []) or []
        if path
    ]
    execution.changed_paths = list(dict.fromkeys([*execution.changed_paths, *result_paths]))
    if execution.changed_paths and not any(
        str(result.get("operation") or "") != "chat_turn"
        and str(result.get("status") or "") in {"changed", "no_change"}
        for result in execution.operation_results
        if isinstance(result, dict)
    ):
        execution.operation_results.append({
            "action": request.source_action_key or "chat_turn",
            "source_action_key": request.source_action_key,
            "operation": "durable_tool_work",
            "status": "changed",
            "summary": "Saved workspace work is available.",
            "matter_id": request.matter_id,
            "entity_refs": [],
            "changed_paths": list(execution.changed_paths),
            "resulting_matter_state": {},
            "available_next_actions": [],
            "required_user_action": None,
            "error": None,
            "recovery": "Review the saved work and continue the request if needed.",
        })


def _ensure_generic_no_change_result(
    execution: RunnerExecutionState, request: ChatRequest
) -> None:
    read_only_operations = {"audit_decisions", "list_files", "read_file", "search_vault"}
    if (
        not request.matter_id
        or execution.changed_paths
        or any(
            str(result.get("operation") or "") not in read_only_operations
            for result in execution.operation_results
        )
    ):
        return
    execution.operation_results.append({
        "action": request.source_action_key or "chat_turn",
        "source_action_key": request.source_action_key,
        "operation": "chat_turn",
        "status": "no_change",
        "summary": "No workspace change recorded.",
        "matter_id": request.matter_id,
        "entity_refs": [],
        "changed_paths": [],
        "resulting_matter_state": {},
        "available_next_actions": [],
        "required_user_action": None,
        "error": None,
        "recovery": None,
    })
