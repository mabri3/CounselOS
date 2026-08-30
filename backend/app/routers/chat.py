from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.models.api import ChatMessage, ChatRequest, ChatResponse, MatterUpdateCard, ResearchStatusCard, WorkProductCard
from app.routers.dependencies import get_context
from app.runtime import AppContext


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
        if payload.matter_id:
            if payload.workspace_day:
                raise ValueError("A chat cannot be both matter-scoped and day-scoped.")
            conversation_id = payload.conversation_id
            history = []
            if conversation_id:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
                _reject_duplicate_question_action(saved, payload)
                history = _history(saved)
            saved = context.chat_history.append(
                payload.matter_id,
                conversation_id,
                role="user",
                content=user_content,
                attachments=[item.model_dump() for item in payload.attachments],
                card_action=payload.card_action.model_dump() if payload.card_action else None,
            )
            conversation_id = saved["conversation_id"]
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
        response = await context.runner.run(
            payload.model_copy(
                update={
                    "message": model_content,
                    "history": history,
                    "skill_id": skill_id,
                    "agent_id": "research-agent" if skill_id == "watch-builder" else payload.agent_id,
                }
            )
        )
        if payload.matter_id:
            _apply_matter_actions(context, payload, saved, response)
        if payload.matter_id:
            saved = context.chat_history.append(
                payload.matter_id,
                conversation_id,
                role="assistant",
                content=response.reply,
                trace=[item.model_dump() for item in response.trace],
                cards=[item.model_dump() for item in response.cards],
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


def _history(saved: dict) -> list[ChatMessage]:
    return [
        ChatMessage(role=message["role"], content=message["content"])
        for message in saved["messages"]
    ]


def _action_text(payload: ChatRequest) -> str:
    if payload.card_action:
        values = ", ".join(payload.card_action.values)
        return f"Card action: {payload.card_action.action}{f' — {values}' if values else ''}"
    names = ", ".join(item.name for item in payload.attachments)
    return f"Attached: {names}"


def _reject_duplicate_question_action(saved: dict, payload: ChatRequest) -> None:
    action = payload.card_action
    if not action or action.action not in {"answer", "skip", "stop"}:
        return
    if any((message.get("card_action") or {}).get("card_id") == action.card_id for message in saved["messages"]):
        raise ValueError("This question was already answered.")


def _watch_builder_requested(content: str, payload: ChatRequest) -> bool:
    if payload.card_action and payload.card_action.action in {
        "save_draft", "scan_now", "change_something", "start_watch", "scan_again",
    }:
        return True
    lowered = " ".join(content.lower().split())
    monitoring = any(term in lowered for term in ("monitor", "monitoring", "watch", "recurring scan"))
    creation = any(term in lowered for term in ("create", "start", "set up", "change", "edit"))
    return monitoring and creation


def _apply_matter_actions(context: AppContext, payload: ChatRequest, saved: dict, response: ChatResponse) -> None:
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
    if payload.card_action and payload.card_action.action == "answer" and payload.card_action.values:
        action = context.matter_records.apply_update(
            matter_id,
            facts=[{"text": f"Intake response: {value}", "source_ids": [saved["conversation_id"]]} for value in payload.card_action.values],
            sources=[{"source_id": saved["conversation_id"], "kind": "conversation", "label": "Current matter chat"}],
            summary="Saved an intake response",
        )
        response.cards = [MatterUpdateCard(action_id=action["action_id"], summary="Matter updated", changed_sections=["Facts", "Missing information"])]
        if context.dossiers.get(matter_id) is None:
            matter = context.matters.get(matter_id)
            facts = context.matter_records.get(matter_id)["facts"]
            content = "# Matter dossier\n\n## Current ask\n\n" + (matter.get("description") or matter["title"])
            content += "\n\n## Known facts\n\n" + "\n".join(f"- {item['text']}" for item in facts if item.get("status") == "active")
            content += "\n\n## Missing information\n\n- Continue focused intake as needed.\n\n## Work product\n\nNo work product yet."
            context.dossiers.propose_update(matter_id, content, expected_hash=None)
        run = context.research_runs.start(matter_id, [f"What material source-based issues should counsel research for {context.matters.get(matter_id)['title']}?"])
        response.cards.append(ResearchStatusCard(run_id=run["run_id"], state=run["state"], total=run["total"], completed=run["completed"], status=run["status"], dossier_effect=run["dossier_effect"]))
        response.refresh.append("matter")
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
