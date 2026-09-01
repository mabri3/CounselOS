from __future__ import annotations

import asyncio
from typing import Any

from app.models.api import ChatRequest, ChatResponse
from app.models.api import ToolTrace
from app.agents.runner import AgentExecutionError, RunnerExecutionState
from app.agents.output import clean_user_facing_reply
from app.providers.base import ProviderSelection
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


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
        matter = self.context.matters.get(matter_id)
        conversation_id = request.conversation_id
        if (
            conversation_id is None
            and request.agent_id == "intake-agent"
            and matter.get("intake_state") == "active"
        ):
            conversation_id = matter.get("intake_conversation_id")
        run_id = new_id("RUN")
        payload = request.model_copy(update={
            "matter_id": matter_id,
            "conversation_id": conversation_id,
            "expected_dossier_hash": self.context.dossiers.content_hash(matter_id),
            "source_action_key": request.source_action_key or f"chat:{run_id}",
        })
        resolved = self.context.runner.resolve(payload.agent_id)
        if not persist_user_message and not payload.conversation_id:
            raise ValueError("An internal chat run needs an existing conversation.")
        if existing_user_message_id is None and persist_user_message:
            from app.routers.chat import _action_text

            saved = self.context.chat_history.append(
                matter_id,
                payload.conversation_id,
                role="user",
                content=payload.message.strip() or _action_text(payload),
                attachments=[item.model_dump() for item in payload.attachments],
                card_action=payload.card_action.model_dump() if payload.card_action else None,
                run_id=run_id,
            )
            payload = payload.model_copy(update={"conversation_id": saved["conversation_id"]})
        record = self._write(
            matter_id, run_id, state="queued", status="Chat is queued.",
            request=payload.model_dump(mode="json"), conversation_id=payload.conversation_id,
            persist_user_message=persist_user_message,
            expected_dossier_hash=payload.expected_dossier_hash,
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
        record = self._write(
            matter_id,
            run_id,
            state="queued",
            status="Chat retry is queued.",
            started_at=None,
            failure_detail=None,
            finished_at=None,
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
                self.vault.update_markdown(document["path"], metadata_updates={
                    "state": "interrupted", "status": "Chat was interrupted when the application stopped.",
                    "failure_detail": "The application stopped before this request finished.", "finished_at": iso_now(),
                })
                count += 1
        return count

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
        self._write(matter_id, run_id, state="running", status="Chat is running.", started_at=iso_now())
        execution = RunnerExecutionState(
            trace=[ToolTrace.model_validate(item) for item in current.get("partial_trace", [])],
            changed_paths=list(current.get("partial_changed_paths", [])),
            refresh=list(current.get("partial_refresh", [])),
            completed_mutations=dict(current.get("completed_mutations", {})),
            useful_content=str(current.get("useful_content") or ""),
        )

        def checkpoint(state: RunnerExecutionState) -> None:
            self._write(
                matter_id, run_id,
                completed_mutations=state.completed_mutations,
                partial_trace=[item.model_dump(mode="json") for item in state.trace],
                partial_changed_paths=list(dict.fromkeys(state.changed_paths)),
                partial_refresh=list(dict.fromkeys(state.refresh)),
                useful_content=state.useful_content,
            )
        try:
            request = ChatRequest.model_validate(current["request"])
            request = request.model_copy(
                update={"expected_dossier_hash": current.get("expected_dossier_hash")}
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
            self._write(
                matter_id, run_id, state="completed", status="Chat is complete.",
                response=response.model_dump(mode="json"), conversation_id=response.conversation_id,
                request=request.model_copy(update={"conversation_id": response.conversation_id}).model_dump(mode="json"),
                finished_at=iso_now(), failure_detail=None,
            )
        except asyncio.TimeoutError:
            checkpoint(execution)
            response = await self._timeout_result(current, execution)
            state = "completed" if response.reply.strip() else "failed"
            conversation_id = self.context.chat_history.find_conversation_for_run(matter_id, run_id)
            request = ChatRequest.model_validate(current["request"])
            if response.reply.strip() and conversation_id:
                self.context.chat_history.upsert_run_assistant(
                    matter_id, conversation_id, run_id, content=response.reply,
                    trace=[item.model_dump() for item in response.trace],
                )
            self._write(matter_id, run_id, state=state, status="Chat reached its time limit.",
                        response=response.model_dump(mode="json") if response.reply.strip() else None,
                        conversation_id=conversation_id,
                        request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                        failure_detail=None if state == "completed" else "The request reached its time limit.", finished_at=iso_now())
        except asyncio.CancelledError:
            self._write(matter_id, run_id, state="interrupted", status="Chat was interrupted.",
                        failure_detail="The application stopped before this request finished.", finished_at=iso_now())
            raise
        except AgentExecutionError as exc:
            execution = exc.state
            checkpoint(execution)
            response = self._partial_result(execution)
            conversation_id = self.context.chat_history.find_conversation_for_run(matter_id, run_id)
            request = ChatRequest.model_validate(current["request"])
            has_useful_partial = bool(
                execution.useful_content.strip()
                or any(item.status == "success" for item in execution.trace)
            )
            if has_useful_partial and conversation_id:
                self.context.chat_history.upsert_run_assistant(
                    matter_id, conversation_id, run_id, content=response.reply,
                    trace=[item.model_dump() for item in response.trace],
                )
            self._write(
                matter_id, run_id, state="failed", status="Chat stopped after preserving useful work.",
                conversation_id=conversation_id, response=response.model_dump(mode="json"),
                request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                failure_detail=(exc.safe_detail or "The model or a required tool could not finish this request."),
                finished_at=iso_now(),
            )
        except Exception:
            conversation_id = self.context.chat_history.find_conversation_for_run(matter_id, run_id)
            request = ChatRequest.model_validate(current["request"])
            self._write(matter_id, run_id, state="failed", status="Chat could not finish.",
                        conversation_id=conversation_id,
                        request=request.model_copy(update={"conversation_id": conversation_id}).model_dump(mode="json"),
                        failure_detail="The model or a required tool could not finish this request.", finished_at=iso_now())
        finally:
            self._tasks.pop(run_id, None)

    async def _timeout_result(self, current: dict[str, Any], execution: RunnerExecutionState) -> ChatResponse:
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
                return ChatResponse(
                    reply=user_facing_content, trace=execution.trace,
                    changed_paths=list(dict.fromkeys(execution.changed_paths)),
                    refresh=list(dict.fromkeys(execution.refresh)),
                )
        except Exception:
            pass
        return self._partial_result(execution, timed_out=True)

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
                reply = lead + " No tool work completed. The original request still needs review."
        return ChatResponse(
            reply=reply,
            trace=execution.trace,
            changed_paths=list(dict.fromkeys(execution.changed_paths)),
            refresh=list(dict.fromkeys(execution.refresh)),
        )

    def _write(self, matter_id: str, run_id: str, **updates: Any) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        current = self.vault.read_markdown(path)["metadata"] if self.vault.exists(path) else {}
        values = {**current, "record_type": "chat_run", "run_id": run_id, "matter_id": matter_id,
                  "created_at": current.get("created_at", iso_now()), "started_at": current.get("started_at"),
                  "finished_at": current.get("finished_at"), "failure_detail": current.get("failure_detail"),
                  "response": current.get("response"), **updates}
        self.vault.write_markdown(path, f"# Chat run {run_id}\n\n{values['status']}\n", values)
        return {**values, "path": path}

    def _path(self, matter_id: str, run_id: str) -> str:
        matter = self.context.matters.get(matter_id)
        return f"{matter['path']}/conversations/runs/{run_id}.md"
