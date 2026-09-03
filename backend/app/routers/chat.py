from __future__ import annotations

from datetime import date
import re

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.models.api import ChatMessage, ChatRequest, ChatResponse, ChatRun, DecisionCreate, MatterUpdateCard
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.agents.runner import RunnerExecutionState
from app.agents.output import clean_conversation_for_display, reconcile_user_facing_reply
from app.services.recommendations import RecommendationService


router = APIRouter(tags=["chat"])


class IntakeQuestionRecoveryRequest(BaseModel):
    conversation_id: str


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
        return clean_conversation_for_display(context.chat_history.get_daily(day))
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


@router.post("/matters/{matter_id}/intake-question-recovery", response_model=ChatRun, status_code=202)
async def recover_intake_question(
    matter_id: str,
    payload: IntakeQuestionRecoveryRequest,
    context: AppContext = Depends(get_context),
):
    try:
        conversation = context.chat_history.get(matter_id, payload.conversation_id)
        if conversation.get("conversation_kind") != "intake" or conversation.get("intake_state") != "active":
            raise ValueError("Only an active intake conversation can recover a question.")
        latest = conversation["messages"][-1] if conversation["messages"] else None
        if not latest:
            raise ValueError("The active intake is waiting for its current turn to finish.")
        if latest.get("role") == "assistant":
            if any(
                card.get("type") == "question"
                and not context.matter_records.is_answered_question(
                    matter_id,
                    str(card.get("question_id") or ""),
                    str(card.get("text") or ""),
                )
                for card in latest.get("cards") or []
            ):
                raise ValueError("The active intake already has a structured question.")
        elif latest.get("role") == "user":
            answered_ids = _action_question_ids(latest.get("card_action") or {})
            if not answered_ids or not all(
                context.matter_records.is_answered_question(matter_id, question_id, "")
                for question_id in answered_ids
            ):
                raise ValueError("The active intake is waiting for its current turn to finish.")
        else:
            raise ValueError("The active intake is waiting for its current turn to finish.")
        run = context.chat_runs.start(
            matter_id,
            ChatRequest(
                message=(
                    "Continue the active intake from the saved conversation. Reassess the current matter record. "
                    "Use update_matter_intake to return the next material question as a structured question card, "
                    "or mark intake complete if no material question remains. Do not repeat an answered question."
                ),
                matter_id=matter_id,
                conversation_id=payload.conversation_id,
                agent_id="intake-agent",
                intake_recovery=True,
            ),
            persist_user_message=False,
        )
        return ChatRun.model_validate(run)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


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
    persist_user_message: bool = True,
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
        run_state = execution_state or RunnerExecutionState()
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
                _validate_question_action(saved, payload)
                history = _history(saved, exclude_run_id=run_id)
            existing_user = (
                context.chat_history.find_run_message(payload.matter_id, conversation_id, run_id, "user")
                if run_id and conversation_id else None
            )
            if existing_user:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
            elif persist_user_message:
                saved = context.chat_history.append(
                    payload.matter_id, conversation_id, role="user", content=user_content,
                    attachments=[item.model_dump() for item in payload.attachments],
                    card_action=payload.card_action.model_dump() if payload.card_action else None,
                    run_id=run_id,
                )
            elif not conversation_id:
                raise ValueError("An internal recovery needs an existing conversation.")
            conversation_id = saved["conversation_id"]
            conversation = context.chat_history.get(payload.matter_id, conversation_id)
            current_user = existing_user or (conversation["messages"][-1] if persist_user_message else None)
            trusted_source_id = (
                next(iter(current_user.get("source_ids") or []), current_user.get("message_id"))
                if current_user else None
            )
            intake_active = (
                conversation.get("conversation_kind") == "intake"
                and conversation.get("intake_state") == "active"
            )
            resolved_answers = (
                _resolved_question_answers(conversation, payload)
                if intake_active
                else []
            )
            if resolved_answers:
                answer_action_key = str(
                    payload.source_action_key
                    or (current_user or {}).get("message_id")
                    or "intake-answer"
                )
                answer_result = context.matter_records.record_intake_answers(
                    payload.matter_id,
                    resolved_answers,
                    source_id=str(trusted_source_id or (current_user or {}).get("message_id") or ""),
                    source_action_key=answer_action_key,
                )
                if answer_result["changed"]:
                    run_state.changed_paths.extend(answer_result["changed_paths"])
                    run_state.refresh.extend(["matter", "tree"])
                    run_state.operation_results.append({
                        "action": answer_action_key,
                        "source_action_key": answer_action_key,
                        "operation": "record_intake_answer",
                        "status": "changed",
                        "summary": "Intake answer recorded.",
                        "matter_id": payload.matter_id,
                        "entity_refs": [
                            {"type": "intake_answer", "id": record_id}
                            for record_id in answer_result["record_ids"]
                        ],
                        "changed_paths": answer_result["changed_paths"],
                        "resulting_matter_state": {},
                        "available_next_actions": [],
                        "required_user_action": None,
                        "error": None,
                        "recovery": None,
                    })
                    if checkpoint:
                        checkpoint(run_state)
                model_content = _resolved_answer_text(resolved_answers)
                expected_dossier_hash = context.dossiers.content_hash(payload.matter_id)
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
            _confirm_saved_operation(
                context, payload, saved, execution_state=run_state,
            )
            if payload.matter_id else None
        )
        if response is None:
            response = (
                _stop_intake(
                    context, payload, saved, expected_dossier_hash,
                    intake_active=intake_active,
                    execution_state=run_state,
                )
                if payload.matter_id else None
            )
        if response is None:
            routed_agent_id = _route_matter_agent(
                payload,
                intake_active=bool(payload.matter_id and intake_active),
                recovery=not persist_user_message,
            )
            response = await context.runner.run(
                payload.model_copy(
                    update={
                        "message": model_content,
                        "history": history,
                        "skill_id": skill_id,
                        "agent_id": (
                            "research-agent" if skill_id == "watch-builder"
                            else routed_agent_id
                        ),
                        "trusted_source_id": trusted_source_id if payload.matter_id else None,
                        "expected_dossier_hash": expected_dossier_hash,
                    }
                ),
                execution_state=run_state,
                checkpoint=checkpoint,
                resolved_provider=resolved_provider,
            )
        if payload.matter_id:
            _apply_matter_actions(
                context, payload, saved, response,
                execution_state=run_state, run_id=run_id,
            )
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
            response.operation_results = list(run_state.operation_results)
            response.reply = reconcile_user_facing_reply(
                response.reply, response.operation_results
            )
        if payload.matter_id:
            if response.reply.strip():
                if run_id:
                    saved = context.chat_history.upsert_run_assistant(
                        payload.matter_id, conversation_id, run_id, content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                        operation_results=response.operation_results,
                    )
                else:
                    saved = context.chat_history.append(
                        payload.matter_id, conversation_id, role="assistant", content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                        operation_results=response.operation_results,
                    )
        else:
            saved = context.chat_history.append_daily(
                workspace_day,
                role="assistant",
                content=response.reply,
                trace=[item.model_dump() for item in response.trace],
                cards=[item.model_dump() for item in response.cards],
                applied_skills=[item.model_dump() for item in response.applied_skills],
                operation_results=response.operation_results,
            )
        response.conversation_id = conversation_id
        response.changed_paths = list(dict.fromkeys([*response.changed_paths, saved["path"]]))
        return response
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


_SUBSTANTIVE_INTAKE_REQUEST = re.compile(
    r"^\s*(?:please\s+)?(?:"
    r"(?:start|run|begin|conduct)\b.{0,48}\bresearch\b|"
    r"research\b(?!\s+(?:is|isn't|isnt|was|wasn't|wasnt|seems|may|might|could|should\s+not)\b)|"
    r"(?:analyze|analyse|draft|prepare)\b|"
    r"create\s+(?:a|an|the)\s+(?:response|draft|memo|analysis|research\s+packet)\b|"
    r"(?:proceed|continue)\s+with\s+(?:the\s+)?assumptions?\b"
    r")",
    re.IGNORECASE,
)


def _route_matter_agent(
    payload: ChatRequest,
    *,
    intake_active: bool,
    recovery: bool,
) -> str:
    """Choose the active matter agent without letting intake block direct work."""
    if not intake_active:
        return payload.agent_id
    if recovery or payload.card_action is not None:
        return "intake-agent"
    if _SUBSTANTIVE_INTAKE_REQUEST.search(payload.message):
        return "counsel-copilot"
    return "intake-agent"


def _history(saved: dict, *, exclude_run_id: str | None = None) -> list[ChatMessage]:
    cards = _question_cards(saved)
    return [
        ChatMessage(
            role=message["role"],
            content=_message_content_with_question_context(message, cards),
        )
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
    submitted_ids = _action_question_ids(action.model_dump())
    answered_ids = {
        question_id
        for message in saved["messages"]
        for question_id in _action_question_ids(message.get("card_action") or {})
    }
    if submitted_ids & answered_ids:
        raise ValueError("This question was already answered.")


def _validate_question_action(saved: dict, payload: ChatRequest) -> None:
    action = payload.card_action
    if (
        saved.get("conversation_kind") != "intake"
        or not action
        or action.action not in {"answer", "answer_set", "skip"}
    ):
        return
    cards = _question_cards(saved)
    active_ids: set[str] = set()
    for message in reversed(saved.get("messages", [])):
        if message.get("role") != "assistant":
            continue
        active_ids = {
            str(card.get("question_id") or "")
            for card in message.get("cards", [])
            if card.get("type") == "question" and card.get("question_id")
        }
        break
    question_ids = _action_question_ids(action.model_dump())
    if not question_ids or not question_ids <= active_ids:
        raise ValueError("This intake question is no longer active.")
    for answer in _action_answers(action.model_dump()):
        card = cards.get(str(answer.get("card_id") or ""))
        if card is None:
            raise ValueError("The saved intake question is not available.")
        values = [str(value).strip() for value in answer.get("values", []) if str(value).strip()]
        if answer.get("action") == "skip":
            if values:
                raise ValueError("A skipped question cannot include an answer.")
            continue
        if not values:
            raise ValueError("Select or enter an answer.")
        choices = {
            str(choice.get("value") or "")
            for choice in card.get("choices", [])
            if choice.get("value")
        }
        if choices and values[0] not in choices:
            raise ValueError("The selected answer is not available for this question.")


def _resolved_question_answers(saved: dict, payload: ChatRequest) -> list[dict[str, object]]:
    action = payload.card_action
    if not action or action.action not in {"answer", "answer_set", "skip"}:
        return []
    cards = _question_cards(saved)
    resolved: list[dict[str, object]] = []
    for answer in _action_answers(action.model_dump()):
        card = cards.get(str(answer.get("card_id") or ""))
        if card is None:
            continue
        values = [str(value).strip() for value in answer.get("values", []) if str(value).strip()]
        labels = {
            str(choice.get("value") or ""): str(choice.get("label") or choice.get("value") or "")
            for choice in card.get("choices", [])
        }
        answer_parts = [labels.get(value, value) for value in values]
        answer_text = ": ".join(answer_parts) if len(answer_parts) > 1 else "".join(answer_parts)
        status = "skipped" if answer.get("action") == "skip" else "answered"
        resolved.append({
            "question_id": str(answer.get("card_id") or ""),
            "question": str(card.get("text") or "").strip(),
            "answer": answer_text,
            "values": values,
            "status": status,
            "record_target": _question_record_target(card),
        })
    return resolved


def _resolved_answer_text(answers: list[dict[str, object]]) -> str:
    lines = ["Answers to the saved intake questions:"]
    for answer in answers:
        detail = str(answer.get("answer") or "Skipped")
        lines.append(f"- Question: {answer.get('question')}\n  Answer: {detail}")
    return "\n".join(lines)


def _question_cards(saved: dict) -> dict[str, dict]:
    return {
        str(card.get("question_id")): card
        for message in saved.get("messages", [])
        if message.get("role") == "assistant"
        for card in message.get("cards", [])
        if card.get("type") == "question" and card.get("question_id")
    }


def _question_record_target(card: dict) -> str:
    target = str(card.get("record_target") or "fact")
    if target != "fact":
        return target
    card_text = f"{card.get('question_id') or ''} {card.get('text') or ''}".casefold()
    if re.search(r"\b(jurisdiction|countries|country|regions?)\b", card_text):
        return "jurisdiction_scope"
    return "fact"


def _action_answers(action: dict) -> list[dict]:
    if action.get("action") == "answer_set":
        return [dict(item) for item in action.get("answers", []) if isinstance(item, dict)]
    if action.get("action") in {"answer", "skip"}:
        return [{
            "card_id": action.get("card_id"),
            "action": action.get("action"),
            "values": list(action.get("values") or []),
        }]
    return []


def _action_question_ids(action: dict) -> set[str]:
    return {
        str(answer.get("card_id"))
        for answer in _action_answers(action)
        if answer.get("card_id")
    }


def _message_content_with_question_context(message: dict, cards: dict[str, dict]) -> str:
    action = message.get("card_action") or {}
    answers = []
    for answer in _action_answers(action):
        card = cards.get(str(answer.get("card_id") or ""))
        if not card:
            continue
        values = [str(value) for value in answer.get("values", [])]
        labels = {
            str(choice.get("value") or ""): str(choice.get("label") or choice.get("value") or "")
            for choice in card.get("choices", [])
        }
        detail = ": ".join(labels.get(value, value) for value in values) or "Skipped"
        answers.append(f"Question: {card.get('text')}\nAnswer: {detail}")
    return "\n\n".join(answers) if answers else str(message.get("content") or "")


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
    execution_state: RunnerExecutionState,
) -> ChatResponse | None:
    action = payload.card_action
    continue_with_assumptions = bool(
        action
        and action.action == "answer"
        and action.card_id.startswith("intake-recovery-")
        and "continue_with_assumptions" in action.values
    )
    if not intake_active or not action or (
        action.action != "stop" and not continue_with_assumptions
    ):
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
    changed_paths = [
        record["path"],
        str(dossier.get("path") or dossier.get("revision_path")),
    ]
    execution_state.operation_results.append({
        "action": action.card_id,
        "source_action_key": payload.source_action_key,
        "operation": "finish_intake",
        "status": "changed",
        "summary": "Intake complete.",
        "matter_id": matter_id,
        "entity_refs": [],
        "changed_paths": changed_paths,
        "resulting_matter_state": {"intake_state": "complete"},
        "available_next_actions": ["review_dossier"],
        "required_user_action": None,
        "error": None,
        "recovery": None,
    })
    return ChatResponse(
        reply=(
            "Intake is complete with the current assumptions. The saved facts and open questions remain available for the dossier and research."
            if continue_with_assumptions
            else "Intake is complete. The saved facts and open questions remain available for the dossier and research."
        ),
        cards=[MatterUpdateCard(
            action_id=action.card_id,
            summary="Intake complete",
            changed_sections=["Working ask", "Open questions"],
            can_edit=False,
            can_undo=False,
        )],
        changed_paths=changed_paths,
        refresh=["matter"],
    )


def _confirm_saved_operation(
    context: AppContext,
    payload: ChatRequest,
    saved: dict,
    *,
    execution_state: RunnerExecutionState,
) -> ChatResponse | None:
    action = payload.card_action
    if not action or action.action != "apply" or not action.card_id.startswith("operation-result:"):
        return None
    action_id = action.card_id.removeprefix("operation-result:")
    proposal_result = next(
        (
            result
            for message in reversed(saved.get("messages", []))
            for result in reversed(message.get("operation_results") or [])
            if str(result.get("action") or "") == action_id
            and result.get("status") in {"confirmation_required", "proposed"}
        ),
        None,
    )
    if proposal_result is None:
        raise ValueError("The saved confirmation proposal is no longer available.")
    matter_id = str(payload.matter_id)
    operation = str(proposal_result.get("operation") or "")
    proposal = proposal_result.get("proposal")
    proposal = dict(proposal) if isinstance(proposal, dict) else {}
    source_action_key = str(
        proposal.get("source_action_key")
        or proposal_result.get("source_action_key")
        or action_id
    )

    if operation == "record_decision":
        disposition = action.values[0] if action.values else ""
        reason = action.values[1].strip() if len(action.values) > 1 else ""
        if disposition not in {"followed", "modified", "not_followed", "not_applicable"}:
            raise ValueError("Select how the recorded decision relates to the recommendation.")
        recommendation_version_id = proposal.get("recommendation_version_id")
        if not recommendation_version_id:
            recommendation_version_id = RecommendationService(
                context.vault, context.matters
            ).get(matter_id).get("current_version_id")
        request = DecisionCreate.model_validate({
            **proposal,
            "matter_id": matter_id,
            "decision_maker": str(payload.lawyer_author or payload.review_author or "Lawyer"),
            "source_action_key": source_action_key,
            "recommendation_disposition": disposition,
            "recommendation_disposition_reason": reason,
            "recommendation_version_id": recommendation_version_id,
        })
        existing_decision_ids = {
            str(item["decision_id"]) for item in context.decisions.list()
        }
        decision = context.decisions.record(request)
        already_recorded = str(decision["decision_id"]) in existing_decision_ids
        changed_paths = [] if already_recorded else [str(decision["path"])]
        operation_result = {
            "action": action_id,
            "source_action_key": source_action_key,
            "operation": operation,
            "status": "no_change" if already_recorded else "changed",
            "summary": "Decision already recorded." if already_recorded else "Decision recorded.",
            "matter_id": matter_id,
            "entity_refs": [{"type": "decision", "id": str(decision["decision_id"]), "path": str(decision["path"])}],
            "changed_paths": changed_paths,
            "resulting_matter_state": {},
            "available_next_actions": context.matters.available_next_actions(context.matters.get(matter_id)),
            "required_user_action": None,
            "error": None,
            "recovery": None,
        }
    else:
        matter_action = "mark_as_sent" if operation == "mark_response_sent" else operation
        if matter_action not in {"approve_response", "mark_as_sent", "close_matter"}:
            raise ValueError("This confirmation does not map to a supported matter action.")
        saved_result = context.matters.perform_action(
            matter_id,
            matter_action,
            actor=str(payload.lawyer_author or payload.review_author or "Lawyer"),
            artifact_path=proposal.get("artifact_path"),
            work_item_id=proposal.get("work_item_id"),
            note=proposal.get("note"),
        )
        operation_result = {
            key: saved_result.get(key)
            for key in (
                "action", "source_action_key", "operation", "status", "summary",
                "matter_id", "entity_refs", "changed_paths", "resulting_matter_state",
                "available_next_actions", "required_user_action", "error", "recovery",
            )
        }
        operation_result["action"] = action_id
        operation_result["source_action_key"] = source_action_key
        changed_paths = [str(path) for path in operation_result.get("changed_paths") or []]

    execution_state.operation_results.append(operation_result)
    return ChatResponse(
        reply=str(operation_result["summary"]),
        changed_paths=changed_paths,
        refresh=["matter", "kanban", "tree"],
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
    *, execution_state: RunnerExecutionState | None = None, run_id: str | None = None,
) -> None:
    matter_id = payload.matter_id
    if not matter_id:
        return
    execution_state = execution_state or RunnerExecutionState()
    if payload.card_action and payload.card_action.action == "undo":
        action = context.matter_records.withdraw_action(matter_id, payload.card_action.card_id)
        response.cards = [MatterUpdateCard(action_id=action["action_id"], summary="Matter update withdrawn", changed_sections=["Facts"], can_undo=False)]
        response.refresh.append("matter")
        record_path = context.matter_records.get(matter_id)["path"]
        response.changed_paths.append(record_path)
        execution_state.operation_results.append({
            "action": action["action_id"],
            "source_action_key": payload.source_action_key,
            "operation": "withdraw_matter_update",
            "status": "changed",
            "summary": "Matter update withdrawn.",
            "matter_id": matter_id,
            "entity_refs": [],
            "changed_paths": [record_path],
            "resulting_matter_state": {},
            "available_next_actions": [],
            "required_user_action": None,
            "error": None,
            "recovery": None,
        })
        return
