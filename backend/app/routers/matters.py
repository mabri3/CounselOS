from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.models.api import AnnotationCreate, BatchActionRequest, ChatRequest, ChatResponse, MatterActionRequest, MatterActionResult, MatterCreate, ResearchRunStart, StageUpdate, WorkItemCompleteRequest, WorkProductFinalizeRequest
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.models.awareness import MitigationCreate, MitigationPatch


router = APIRouter(prefix="/matters", tags=["matters"])


@router.get("/{matter_id}/mitigations")
def list_mitigations(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        context.matters.get(matter_id)
        return {"items": context.mitigations.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/mitigations", status_code=201)
def create_mitigation(
    matter_id: str,
    payload: MitigationCreate,
    context: AppContext = Depends(get_context),
):
    try:
        context.matters.get(matter_id)
        return context.mitigations.create(matter_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/{matter_id}/mitigations/{mitigation_id}")
def update_mitigation(
    matter_id: str,
    mitigation_id: str,
    payload: MitigationPatch,
    context: AppContext = Depends(get_context),
):
    try:
        return context.mitigations.update(
            matter_id, mitigation_id, payload, payload.expected_revision
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        status = 409 if "revision conflict" in str(exc).lower() else 422
        raise HTTPException(status_code=status, detail=str(exc)) from exc


@router.get("")
def list_matters(context: AppContext = Depends(get_context)):
    return {"matters": context.matters.list(), "stages": context.workflow.stages()}


@router.post("", status_code=201)
async def create_matter(payload: MatterCreate, context: AppContext = Depends(get_context)):
    matter = context.matters.create(payload)
    intake = _start_intake(context, matter["matter_id"], payload.request_text)
    return {
        **matter,
        "intake_conversation_id": intake["conversation"]["conversation_id"],
        "intake_run_id": intake["run"]["run_id"],
    }


@router.post("/{matter_id}/intake", response_model=ChatResponse)
async def start_intake(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        request = context.vault.read_markdown(
            f"{context.matters.matter_path(matter_id)}/request.md"
        )["content"].split("\n", 2)[-1].strip()
        intake = _start_intake(context, matter_id, request)
        return ChatResponse(
            reply="Themis is reading your request…",
            conversation_id=intake["conversation"]["conversation_id"],
            changed_paths=[intake["conversation"]["path"], intake["run"]["path"]],
            refresh=["matter"],
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}")
def get_matter(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.matters.get(matter_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/conversations")
def list_conversations(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        return {"conversations": context.chat_history.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/conversations/{conversation_id}")
def get_conversation(
    matter_id: str,
    conversation_id: str,
    context: AppContext = Depends(get_context),
):
    try:
        return context.chat_history.get(matter_id, conversation_id)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/{matter_id}/stage")
def update_stage(
    matter_id: str,
    payload: StageUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.matters.move_stage(matter_id, payload.stage, reason=payload.reason)
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{matter_id}/actions", response_model=MatterActionResult)
def perform_action(
    matter_id: str,
    payload: MatterActionRequest,
    context: AppContext = Depends(get_context),
):
    try:
        return context.matters.perform_action(
            matter_id, payload.action, actor=payload.actor,
            artifact_path=payload.artifact_path, work_item_id=payload.work_item_id,
            note=payload.note,
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/work-items/complete", response_model=MatterActionResult)
def complete_work_item(
    matter_id: str,
    payload: WorkItemCompleteRequest,
    context: AppContext = Depends(get_context),
):
    try:
        return context.matters.complete_work_item(matter_id, payload.work_item_id, actor=payload.actor)
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/research")
async def run_research(
    matter_id: str,
    question: str = "",
    context: AppContext = Depends(get_context),
):
    try:
        return await context.research.run(matter_id, question)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/research-runs", status_code=202)
def start_research_run(
    matter_id: str,
    payload: ResearchRunStart,
    context: AppContext = Depends(get_context),
):
    try:
        questions = payload.questions or ([payload.question] if payload.question.strip() else [])
        return context.research_runs.start(matter_id, questions)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{matter_id}/research-runs")
def list_research_runs(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        return {"runs": context.research_runs.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/research-runs/{run_id}")
def get_research_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.research_runs.get(matter_id, run_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/annotations")
def list_annotations(
    matter_id: str,
    context: AppContext = Depends(get_context),
):
    try:
        return {"annotations": context.annotations.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/annotations", status_code=201)
def create_annotation(
    matter_id: str,
    payload: AnnotationCreate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.annotations.create(matter_id, **payload.model_dump())
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/annotations/{annotation_id}/answer")
async def answer_annotation(
    matter_id: str,
    annotation_id: str,
    context: AppContext = Depends(get_context),
):
    try:
        return await context.annotations.answer(matter_id, annotation_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/{matter_id}/upload", status_code=201)
async def upload_document(
    matter_id: str,
    file: UploadFile = File(...),
    context: AppContext = Depends(get_context),
):
    try:
        return await context.ingestion.upload_to_matter(matter_id, file)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{matter_id}/uploads", status_code=201)
async def upload_documents(
    matter_id: str,
    files: list[UploadFile] = File(...),
    intent: str = Form(default=""),
    context: AppContext = Depends(get_context),
):
    try:
        return await context.ingestion.upload_many_to_matter(matter_id, files, intent=intent)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{matter_id}/batches")
def batch_action(
    matter_id: str,
    payload: BatchActionRequest,
    context: AppContext = Depends(get_context),
):
    try:
        if payload.action == "preview":
            return context.ingestion.get_batch(matter_id, payload.batch_id)
        batch = context.ingestion.get_batch(matter_id, payload.batch_id)
        action_id = str(batch.get("action_id") or "")
        if payload.action == "undo":
            if not action_id:
                raise ValueError("This batch has not been applied.")
            action = context.matter_records.withdraw_action(matter_id, action_id)
            return context.ingestion.update_batch(matter_id, payload.batch_id, state="withdrawn", action_id=action["action_id"])
        if batch.get("state") != "preview":
            raise ValueError("This batch was already applied or withdrawn.")
        action = context.matter_records.apply_update(
            matter_id,
            summary=f"Applied proposed updates from {batch.get('count', 0)} uploaded files",
            sources=[{
                "source_id": item["source_id"], "kind": "file", "label": item["name"],
                "path": item["path"], "version": item["version"],
            } for item in batch.get("attachments", [])],
        )
        return context.ingestion.update_batch(matter_id, payload.batch_id, state="applied", action_id=action["action_id"])
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{matter_id}/work-product/finalize")
def finalize_work_product(
    matter_id: str,
    payload: WorkProductFinalizeRequest,
    context: AppContext = Depends(get_context),
):
    try:
        result = context.work_products.finalize(matter_id, payload.draft_path)
        matter = context.index.get_matter(matter_id)
        if matter and matter.get("status") == "generate":
            context.matters.move_stage(
                matter_id,
                "respond",
                reason="Canonical work product finalized",
                actor="system",
            )
        return result
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


def _start_intake(context: AppContext, matter_id: str, request_text: str) -> dict:
    context.matters.get(matter_id)
    existing = context.chat_history.list(matter_id)
    existing_intake = next(
        (item for item in existing if item.get("conversation_kind") == "intake"), None
    )
    if existing_intake:
        conversation = context.chat_history.get(
            matter_id, existing_intake["conversation_id"]
        )
        run_id = next(
            (
                message.get("run_id")
                for message in conversation["messages"]
                if message.get("role") == "user" and message.get("run_id")
            ),
            None,
        )
        if run_id:
            return {"conversation": conversation, "run": context.chat_runs.get(matter_id, run_id)}

    request_path = f"{context.matters.matter_path(matter_id)}/request.md"
    request_document = context.vault.read_markdown(request_path)
    request_id = str(request_document["metadata"].get("request_id") or "")
    conversation = context.chat_history.append(
        matter_id, None, role="user", content=request_text,
        source_ids=[request_id], conversation_kind="intake", intake_state="active",
        active_agent_id="intake-agent",
    )
    message_id = conversation["messages"][0]["message_id"]
    context.matter_records.ensure_source(
        matter_id,
        source_id=request_id,
        kind="immutable_request",
        label="Original request",
        path=request_path,
    )
    run = context.chat_runs.start(
        matter_id,
        ChatRequest(
            message=request_text,
            matter_id=matter_id,
            conversation_id=conversation["conversation_id"],
            agent_id="intake-agent",
        ),
        existing_user_message_id=message_id,
    )
    return {"conversation": context.chat_history.get(matter_id, conversation["conversation_id"]), "run": run}
