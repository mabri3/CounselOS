from __future__ import annotations

from datetime import date
import re

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.models.api import ChatMessage, ChatRequest, ChatResponse, ChatRun, MatterUpdateCard, WorkProductCard
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.agents.runner import RunnerExecutionState


router = APIRouter(tags=["chat"])


@router.post("/daily-uploads", status_code=201)
async def upload_daily_documents(
    files: list[UploadFile] = File(...),
    context: AppContext = Depends(get_context),
):
    try:
        return await context.ingestion.upload_many_to_workspace(files)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/daily-conversations")
def list_daily_conversations(context: AppContext = Depends(get_context)):
    return {"conversations": context.chat_history.list_daily()}


@router.get("/daily-conversations/{day}")
def get_daily_conversation(
    day: str,
    context: AppContext = Depends(get_context),
):
    try:
        return context.chat_history.get_daily(day)
    except (KeyError, FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, context: AppContext = Depends(get_context)):
    return await execute_chat(payload, context)


@router.post("/matters/{matter_id}/chat-runs", response_model=ChatRun, status_code=202)
async def start_chat_run(matter_id: str, payload: ChatRequest, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.start(matter_id, payload)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/matters/{matter_id}/chat-runs/{run_id}", response_model=ChatRun)
async def get_chat_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.get(matter_id, run_id)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/matters/{matter_id}/chat-runs/{run_id}/retry", response_model=ChatRun, status_code=202)
async def retry_chat_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.retry(matter_id, run_id)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


async def execute_chat(
    payload: ChatRequest,
    context: AppContext,
    *,
    run_id: str | None = None,
    execution_state: RunnerExecutionState | None = None,
    checkpoint=None,
    resolved_provider=None,
) -> ChatResponse:
    try:
        if not payload.message.strip() and not payload.card_action and not payload.attachments:
            raise ValueError("Send a message, card action, or attachment.")
        user_content = payload.message.strip() or _action_text(payload)
        try:
            skill_id, model_content = context.skills.parse_invocation(user_content)
        except KeyError as exc:
            raise ValueError(str(exc)) from exc
        if skill_id is None and _watch_builder_requested(user_content, payload):
            # Watch Builder is a first-party skill. Keep card turns on the same
            # deterministic tool-capable agent even when the slash command is absent.
            context.skills.get("watch-builder")
            skill_id = "watch-builder"
        expected_dossier_hash = (
            payload.expected_dossier_hash
            if payload.expected_dossier_hash is not None
            else context.dossiers.content_hash(payload.matter_id)
            if payload.matter_id
            else None
        )
        if payload.matter_id:
            if payload.workspace_day:
                raise ValueError("A chat cannot be both matter-scoped and day-scoped.")
            conversation_id = payload.conversation_id
            history = []
            if conversation_id:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
                same_run_user = bool(
                    run_id and context.chat_history.find_run_message(
                        payload.matter_id, conversation_id, run_id, "user"
                    )
                )
                if not same_run_user:
                    _reject_duplicate_question_action(saved, payload)
                history = _history(saved, exclude_run_id=run_id)
            existing_user = (
                context.chat_history.find_run_message(payload.matter_id, conversation_id, run_id, "user")
                if run_id and conversation_id else None
            )
            if existing_user:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
            else:
                saved = context.chat_history.append(
                    payload.matter_id, conversation_id, role="user", content=user_content,
                    attachments=[item.model_dump() for item in payload.attachments],
                    card_action=payload.card_action.model_dump() if payload.card_action else None,
                    run_id=run_id,
                )
            conversation_id = saved["conversation_id"]
            conversation = context.chat_history.get(payload.matter_id, conversation_id)
            current_user = existing_user or conversation["messages"][-1]
            trusted_source_id = next(
                iter(current_user.get("source_ids") or []),
                current_user.get("message_id"),
            )
            intake_active = (
                conversation.get("conversation_kind") == "intake"
                and conversation.get("intake_state") == "active"
            )
        else:
            if payload.conversation_id:
                raise ValueError("Today chat continues by date, not by conversation ID.")
            workspace_day = payload.workspace_day or date.today().isoformat()
            if workspace_day != date.today().isoformat():
                raise ValueError("Only today's workspace conversation can be changed.")
            try:
                daily_saved = context.chat_history.get_daily(workspace_day)
                _reject_duplicate_question_action(daily_saved, payload)
                history = _history(daily_saved)
            except FileNotFoundError:
                history = []
            saved = context.chat_history.append_daily(
                workspace_day,
                role="user",
                content=user_content,
                attachments=[item.model_dump() for item in payload.attachments],
                card_action=payload.card_action.model_dump() if payload.card_action else None,
            )
            conversation_id = None
        response = (
            _stop_intake(
                context, payload, saved, expected_dossier_hash,
                intake_active=intake_active,
            )
            if payload.matter_id else None
        )
        if response is None:
            response = await context.runner.run(
                payload.model_copy(
                    update={
                        "message": model_content,
                        "history": history,
                        "skill_id": skill_id,
                        "agent_id": (
                            "research-agent" if skill_id == "watch-builder"
                            else "intake-agent" if payload.matter_id and intake_active
                            else payload.agent_id
                        ),
                        "trusted_source_id": trusted_source_id if payload.matter_id else None,
                        "expected_dossier_hash": expected_dossier_hash,
                    }
                ),
                execution_state=execution_state,
                checkpoint=checkpoint,
                resolved_provider=resolved_provider,
            )
        if payload.matter_id:
            _apply_matter_actions(context, payload, saved, response, run_id=run_id)
            intake_record = context.matter_records.get(payload.matter_id)
            if conversation.get("conversation_kind") == "intake":
                intake_state = intake_record.get("intake_state", "active")
                context.chat_history.update_state(
                    payload.matter_id,
                    conversation_id,
                    intake_state=intake_state,
                    active_agent_id=(
                        "intake-agent" if intake_state == "active" else "counsel-copilot"
                    ),
                )
                if intake_state == "complete":
                    _queue_intake_research(
                        context, payload.matter_id, intake_record,
                        cycle_id=conversation_id,
                    )
        if payload.matter_id:
            if response.reply.strip():
                if run_id:
                    saved = context.chat_history.upsert_run_assistant(
                        payload.matter_id, conversation_id, run_id, content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                    )
                else:
                    saved = context.chat_history.append(
                        payload.matter_id, conversation_id, role="assistant", content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                    )
        else:
            saved = context.chat_history.append_daily(
                workspace_day,
                role="assistant",
                content=response.reply,
                trace=[item.model_dump() for item in response.trace],
                cards=[item.model_dump() for item in response.cards],
                applied_skills=[item.model_dump() for item in response.applied_skills],
            )
        response.conversation_id = conversation_id
        response.changed_paths = list(dict.fromkeys([*response.changed_paths, saved["path"]]))
        return response
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


def _history(saved: dict, *, exclude_run_id: str | None = None) -> list[ChatMessage]:
    return [
        ChatMessage(role=message["role"], content=message["content"])
        for message in saved["messages"]
        if not exclude_run_id
        or message.get("run_id") != exclude_run_id
        or message.get("role") != "user"
    ]


def _action_text(payload: ChatRequest) -> str:
    if payload.card_action:
        if payload.card_action.action == "answer_set":
            lines = []
            for answer in payload.card_action.answers:
                detail = ", ".join(answer.values) if answer.values else "Skipped"
                lines.append(f"- {answer.card_id}: {detail}")
            return "Answers to the prioritized intake questions:\n" + "\n".join(lines)
        values = ", ".join(payload.card_action.values)
        return f"Card action: {payload.card_action.action}{f' — {values}' if values else ''}"
    names = ", ".join(item.name for item in payload.attachments)
    return f"Attached: {names}"


def _reject_duplicate_question_action(saved: dict, payload: ChatRequest) -> None:
    action = payload.card_action
    if not action or action.action not in {"answer", "answer_set", "skip", "stop"}:
        return
    if any((message.get("card_action") or {}).get("card_id") == action.card_id for message in saved["messages"]):
        raise ValueError("This question was already answered.")


def _watch_builder_requested(content: str, payload: ChatRequest) -> bool:
    if payload.agent_id == "intake-agent":
        return False
    if payload.card_action and payload.card_action.action in {
        "save_draft", "scan_now", "change_something", "start_watch", "scan_again",
    }:
        return True
    lowered = " ".join(content.lower().split())
    command_prefix = (
        r"^(?:(?:please|kindly),?\s+|(?:can|could|would|will)\s+you\s+|"
        r"i(?:'d|\s+would)\s+like\s+(?:you\s+)?to\s+|"
        r"i\s+(?:want|need)\s+(?:you\s+)?to\s+)?"
    )
    watch_object = r"(?:watch|recurring\s+scan)"
    determiner = r"(?:(?:a|an|the|this|that|my|our)\s+)?"
    explicit_watch_action = rf"(?:create|start|change|edit)\s+{determiner}{watch_object}\b"
    explicit_monitoring_setup = rf"set\s+up\s+{determiner}(?:watch|monitoring|recurring\s+scan)\b"
    return bool(re.match(
        rf"{command_prefix}(?:{explicit_watch_action}|{explicit_monitoring_setup})",
        lowered,
    ))


def _stop_intake(
    context: AppContext,
    payload: ChatRequest,
    saved: dict,
    expected_dossier_hash: str | None,
    *,
    intake_active: bool,
) -> ChatResponse | None:
    action = payload.card_action
    if not intake_active or not action or action.action != "stop":
        return None
    matter_id = str(payload.matter_id)
    record = context.matter_records.set_intake_state(matter_id, "complete")
    matter = context.matters.get(matter_id)
    dossier = context.dossiers.update_from_intake(
        matter_id,
        working_ask=(record.get("working_ask") or matter.get("description") or matter["title"]),
        facts=record["facts"],
        assumptions=record["assumptions"],
        issues=record.get("issues", []),
        open_questions=record.get("open_questions", []),
        orientation="",
        expected_hash=expected_dossier_hash,
    )
    context.chat_history.update_state(
        matter_id,
        saved["conversation_id"],
        intake_state="complete",
        active_agent_id="counsel-copilot",
    )
    _queue_intake_research(
        context, matter_id, record, cycle_id=saved["conversation_id"]
    )
    return ChatResponse(
        reply="Intake is complete. The saved facts and open questions remain available for the dossier and research.",
        cards=[MatterUpdateCard(
            action_id=action.card_id,
            summary="Intake complete",
            changed_sections=["Working ask", "Open questions"],
            can_edit=False,
            can_undo=False,
        )],
        changed_paths=[
            record["path"],
            str(dossier.get("path") or dossier.get("revision_path")),
        ],
        refresh=["matter"],
    )


def _queue_intake_research(
    context: AppContext,
    matter_id: str,
    record: dict,
    *,
    cycle_id: str,
) -> None:
    questions = [
        str(question).strip()
        for question in record.get("public_research_questions", [])[:3]
        if str(question).strip()
    ]
    if not questions:
        return
    context.research_runs.start(
        matter_id, questions, source_action_key=f"intake:{cycle_id}"
    )


def _apply_matter_actions(
    context: AppContext, payload: ChatRequest, saved: dict, response: ChatResponse,
    *, run_id: str | None = None,
) -> None:
    matter_id = payload.matter_id
    if not matter_id:
        return
    lowered = payload.message.lower().strip()
    if payload.card_action and payload.card_action.action == "undo":
        action = context.matter_records.withdraw_action(matter_id, payload.card_action.card_id)
        response.cards = [MatterUpdateCard(action_id=action["action_id"], summary="Matter update withdrawn", changed_sections=["Facts"], can_undo=False)]
        response.refresh.append("matter")
        return
    if lowered.startswith("save facts from this chat"):
        action = context.matter_records.save_facts_from_messages(
            matter_id, saved["messages"], conversation_id=saved["conversation_id"]
        )
        response.cards.append(MatterUpdateCard(action_id=action["action_id"], summary="Matter updated", changed_sections=["Facts", "Sources"]))
        response.changed_paths.append(context.matter_records.get(matter_id)["path"])
    typed_save_succeeded = any(
        item.tool == "save_work_product" and item.status == "success"
        for item in response.trace
    )
    if (
        not typed_save_succeeded
        and any(phrase in lowered for phrase in ("draft the work product", "create work product", "draft work product"))
    ):
        matter = context.matters.get(matter_id)
        draft = context.work_products.create_draft(
            matter_id,
            title=f"{matter['title']} advice",
            content=f"# {matter['title']} advice\n\n## Working answer\n\n{response.reply}\n\n## Assumptions and open items\n\nConfirm material facts before finalizing.",
            summary="Editable first-pass advice",
        )
        response.cards.append(WorkProductCard(**draft))
        response.changed_paths.append(draft["vault_path"])
        response.refresh.append("matter")
