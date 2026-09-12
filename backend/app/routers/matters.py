from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from pydantic import BaseModel, Field, field_validator

from app.models.api import AnnotationCreate, BatchActionRequest, ChatRequest, ChatResponse, MatterActionRequest, MatterActionResult, MatterConsistencyRepairRequest, MatterCreate, MatterRiskUpdate, ParticipantUpdateRequest, RecommendationAcceptRequest, RecommendationUpdateRequest, ResearchRunStart, SourceActionKey, StageUpdate, TypedOperationResult, WorkItemAssignRequest, WorkItemCompleteRequest, WorkItemCreate, WorkItemPriorityRequest, WorkProductFinalizeRequest
from app.routers.dependencies import get_context
from app.agents.output import clean_conversation_for_display
from app.runtime import AppContext
from app.models.awareness import MitigationCreate, MitigationPatch
from app.services.recommendations import RecommendationService
from app.services.matter_storage import MatterStorageService


router = APIRouter(prefix="/matters", tags=["matters"])


class MatterStorageRequest(BaseModel):
    action: Literal["archive", "trash", "restore"]


@router.get("/storage")
def list_stored_matters(view: Literal["active", "archived", "trash"] = "active", context: AppContext = Depends(get_context, scope="function")):
    return {"matters": MatterStorageService(context).list(view)}


@router.post("/{matter_id}/storage")
async def change_matter_storage(matter_id: str, payload: MatterStorageRequest, context: AppContext = Depends(get_context, scope="function")):
    try:
        return MatterStorageService(context).change(matter_id, payload.action)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


class WorkProductDraftRequest(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    content: str = Field(min_length=1)
    source_action_key: SourceActionKey | None = None
    recommendation: str | None = None
    recommendation_actor: str = "Themis.ai"

    @field_validator("title", "content")
    @classmethod
    def require_non_blank_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must contain text")
        return value


@router.get("/{matter_id}/mitigations")
def list_mitigations(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        context.matters.get(matter_id)
        return {"items": context.mitigations.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/mitigations", status_code=201)
def create_mitigation(
    matter_id: str,
    payload: MitigationCreate,
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
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
def list_matters(context: AppContext = Depends(get_context, scope="function")):
    return {"matters": context.matters.list(), "stages": context.workflow.stages()}


@router.post("", status_code=201)
async def create_matter(
    payload: MatterCreate,
    context: AppContext = Depends(get_context, scope="function"),
):
    matter = context.matters.create(payload)
    context.schedule_intake_start(
        lambda: _start_intake_safely(
            context, matter["matter_id"], payload.request_text
        )
    )
    already_recorded = bool(matter.pop("creation_already_recorded", False))
    creation_status = "no_change" if already_recorded else "changed"
    changed_paths = [] if already_recorded else [
        f"{matter['path']}/matter.md",
        f"{matter['path']}/request.md",
    ]
    return {
        **matter,
        "operation": "create_matter",
        "creation_status": creation_status,
        "creation_summary": (
            "Matter already created; intake is available."
            if already_recorded else "Matter created; intake is starting."
        ),
        "source_action_key": payload.source_action_key,
        "operation_result": {
            "action": payload.source_action_key or "create_matter",
            "source_action_key": payload.source_action_key,
            "operation": "create_matter",
            "status": creation_status,
            "summary": "Matter already exists." if already_recorded else "Matter created; intake is starting.",
            "matter_id": matter["matter_id"],
            "entity_refs": [{"type": "matter", "id": matter["matter_id"]}],
            "changed_paths": changed_paths,
            "resulting_matter_state": {
                "stage": matter["status"],
                "next_action": matter["work_state"]["next_action"],
                "work_state": matter["work_state"],
            },
            "available_next_actions": [],
            "required_user_action": None,
            "error": None,
            "recovery": None,
        },
    }


@router.post("/{matter_id}/intake", response_model=ChatResponse)
async def start_intake(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        request = context.vault.read_markdown(
            f"{context.matters.matter_path(matter_id)}/request.md"
        )["content"].split("\n", 2)[-1].strip()
        intake = _start_intake(context, matter_id, request)
        return ChatResponse(
            reply="Themis.ai is reading your request…",
            conversation_id=intake["conversation"]["conversation_id"],
            changed_paths=[intake["conversation"]["path"], intake["run"]["path"]],
            refresh=["matter"],
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}")
def get_matter(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        return context.matters.get(matter_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/conversations")
def list_conversations(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        return {"conversations": context.chat_history.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/conversations/{conversation_id}")
def get_conversation(
    matter_id: str,
    conversation_id: str,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        conversation = clean_conversation_for_display(
            context.chat_history.get(matter_id, conversation_id)
        )
        from app.services.dossier_generation_chat import restore_dossier_cards
        restore_dossier_cards(context, matter_id, conversation)
        return _hide_resolved_intake_questions(context, matter_id, conversation)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


def _hide_resolved_intake_questions(
    context: AppContext, matter_id: str, conversation: dict
) -> dict:
    if conversation.get("conversation_kind") != "intake":
        return conversation
    for message in conversation.get("messages", []):
        if message.get("role") != "assistant":
            continue
        message["cards"] = [
            card for card in message.get("cards", [])
            if card.get("type") != "question"
            or not context.matter_records.is_answered_question(
                matter_id,
                str(card.get("question_id") or ""),
                str(card.get("text") or ""),
            )
        ]
    return conversation


@router.patch("/{matter_id}/stage")
def update_stage(
    matter_id: str,
    payload: StageUpdate,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        matter = context.matters.move_stage(matter_id, payload.stage, reason=payload.reason)
        return _matter_mutation_response("move_matter_stage", matter)
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.patch("/{matter_id}/risk")
def update_risk(
    matter_id: str,
    payload: MatterRiskUpdate,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        matter = context.matters.update_risk(matter_id, payload.risk_level, actor=payload.actor)
        return _matter_mutation_response(
            "update_matter_risk", matter, changed_paths=[f"{matter['path']}/matter.md"]
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


def _lifecycle_actor(context: AppContext, person_id: str | None, legacy_actor: str = ""):
    # Keep existing non-demo clients callable. An explicit identity header, or
    # an enabled demo roster, always uses the roster as the actor source.
    if person_id is None and not context.workspace_team.roster()["enabled"]:
        return legacy_actor, None
    try:
        actor = context.workspace_team.resolve_actor(person_id or None)
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc)) from exc
    return actor.display_name, actor.model_dump()


@router.post("/{matter_id}/actions", response_model=MatterActionResult)
def perform_action(
    matter_id: str,
    payload: MatterActionRequest,
    context: AppContext = Depends(get_context, scope="function"),
    person_id: str | None = Header(None, alias="X-Themis-Person-Id"),
):
    actor, action_actor = _lifecycle_actor(context, person_id, payload.actor)
    try:
        return context.matters.perform_action(
            matter_id, payload.action, actor=actor, action_actor=action_actor,
            artifact_path=payload.artifact_path, work_item_id=payload.work_item_id,
            note=payload.note,
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/work-items/complete", response_model=MatterActionResult)
def complete_work_item(
    matter_id: str,
    payload: WorkItemCompleteRequest,
    context: AppContext = Depends(get_context, scope="function"),
    person_id: str | None = Header(None, alias="X-Themis-Person-Id"),
):
    actor, action_actor = _lifecycle_actor(context, person_id, payload.actor)
    try:
        return context.matters.complete_work_item(matter_id, payload.work_item_id, actor=actor, action_actor=action_actor)
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/work-items", status_code=201)
def create_work_item(
    matter_id: str,
    payload: WorkItemCreate,
    context: AppContext = Depends(get_context, scope="function"),
):
    if payload.matter_id != matter_id:
        raise HTTPException(status_code=422, detail="Work item matter does not match the route matter.")
    if payload.item_type == "mitigation":
        if not str(payload.issue_id or "").strip():
            raise HTTPException(status_code=422, detail="Mitigation issue is required.")
        if not payload.owner.strip():
            raise HTTPException(status_code=422, detail="Mitigation owner is required.")
    try:
        issue_ids = {item["issue_id"] for item in context.workspace.issues(matter_id)}
        if payload.issue_id and payload.issue_id not in issue_ids:
            raise HTTPException(status_code=422, detail="Issue does not belong to this matter.")
        return context.matters.create_work_item(payload)
    except HTTPException:
        raise
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/{matter_id}/work-items/assign", response_model=MatterActionResult)
def assign_work_item(
    matter_id: str,
    payload: WorkItemAssignRequest,
    context: AppContext = Depends(get_context, scope="function"),
    person_id: str | None = Header(None, alias="X-Themis-Person-Id"),
):
    actor, action_actor = _lifecycle_actor(context, person_id, payload.actor)
    try:
        return context.matters.assign_work_item(
            matter_id,
            payload.work_item_id,
            owner=payload.owner,
            actor=actor, action_actor=action_actor,
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/work-items/priority", response_model=MatterActionResult)
def prioritize_work_item(
    matter_id: str,
    payload: WorkItemPriorityRequest,
    context: AppContext = Depends(get_context, scope="function"),
    person_id: str | None = Header(None, alias="X-Themis-Person-Id"),
):
    actor, action_actor = _lifecycle_actor(context, person_id, payload.actor)
    try:
        return context.matters.prioritize_work_item(
            matter_id, payload.work_item_id, priority=payload.priority, actor=actor, action_actor=action_actor
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/participants", response_model=TypedOperationResult)
def add_participant(
    matter_id: str,
    payload: ParticipantUpdateRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        data = context.matters.add_participant(
            matter_id, name=payload.name, role=payload.role, actor=payload.actor
        )
        return _typed_mutation_result(
            context, matter_id, operation="add_participant", data=data,
            summary="Added the participant." if data["changed_paths"] else "The participant was already recorded.",
            entity_refs=[{"type": "participant", "id": payload.name.strip()}],
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=422 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


def _recommendations(context: AppContext) -> RecommendationService:
    return RecommendationService(context.vault, context.matters)


@router.get("/{matter_id}/recommendation")
def get_recommendation(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        return _recommendations(context).get(matter_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{matter_id}/recommendation", response_model=TypedOperationResult)
def update_recommendation(
    matter_id: str, payload: RecommendationUpdateRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        data = _recommendations(context).set_working(
            matter_id, payload.content, actor=payload.actor, origin="lawyer_edit"
        )
        return _recommendation_mutation_result(
            context, matter_id, "update_recommendation", data,
            "Updated the working recommendation." if data["changed_paths"] else "The working recommendation was already current.",
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=422 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/recommendation/proposals", response_model=TypedOperationResult)
def propose_recommendation(
    matter_id: str, payload: RecommendationUpdateRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        data = _recommendations(context).propose(matter_id, payload.content, actor=payload.actor)
        return _recommendation_mutation_result(
            context, matter_id, "propose_recommendation_update", data,
            "Proposed a recommendation update." if data["changed_paths"] else "The recommendation update was already proposed.",
            proposal=True,
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=422 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.post("/{matter_id}/recommendation/accept", response_model=TypedOperationResult)
def accept_recommendation(
    matter_id: str, payload: RecommendationAcceptRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        data = _recommendations(context).accept(matter_id, actor=payload.actor)
        return _recommendation_mutation_result(
            context, matter_id, "accept_recommendation_update", data,
            "Accepted the recommendation update.",
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


def _recommendation_mutation_result(
    context: AppContext, matter_id: str, operation: str, data: dict,
    summary: str, *, proposal: bool = False,
) -> dict:
    version = data.get("proposal") if proposal else None
    version_id = (version or {}).get("version_id") or data.get("current_version_id")
    return _typed_mutation_result(
        context, matter_id, operation=operation, data=data, summary=summary,
        entity_refs=([{"type": "recommendation_version", "id": str(version_id), "path": data["path"]}] if version_id else []),
        required_user_action=("Accept recommendation update with the direct control." if proposal else None),
        changed_status="proposed" if proposal else "changed",
    )


def _typed_mutation_result(
    context: AppContext, matter_id: str, *, operation: str, data: dict,
    summary: str, entity_refs: list[dict[str, str]],
    required_user_action: str | None = None,
    changed_status: str = "changed",
) -> dict:
    matter = context.matters.get(matter_id)
    changed_paths = list(data.get("changed_paths") or [])
    return {
        "action": operation,
        "source_action_key": None,
        "operation": operation,
        "status": changed_status if changed_paths else "no_change",
        "summary": summary,
        "matter_id": matter_id,
        "entity_refs": entity_refs,
        "changed_paths": changed_paths,
        "resulting_matter_state": {
            "stage": matter["status"],
            "next_action": matter["work_state"]["next_action"],
            "work_state": matter["work_state"],
            "consistency_issues": matter.get("consistency_issues", []),
        },
        "available_next_actions": context.matters.available_next_actions(matter),
        "required_user_action": required_user_action,
        "error": None,
        "recovery": None,
        "dossier_projection": data.get("dossier_projection"),
        "data": data,
    }


@router.post("/{matter_id}/consistency/repair", response_model=MatterActionResult)
def repair_matter_consistency(
    matter_id: str,
    payload: MatterConsistencyRepairRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        return context.matters.repair_consistency(matter_id, actor=payload.actor)
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=409 if isinstance(exc, ValueError) else 404, detail=str(exc)) from exc


@router.get("/{matter_id}/research-options")
def research_options(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        context.matters.get(matter_id)
        from app.services.native_research import native_options
        resolved = context.research_runs.resolve_agent()
        selection = context.research_runs._selection_values(resolved)
        return {**context.research.search_options(), **native_options(selection, context.settings), "native": False,
                "collector_model_selection": {k: v for k, v in selection.items() if k != "agent_id"},
                "main_model_selection": {k: v for k, v in context.research_runs._selection_values(context.research_runs.resolve_main()).items() if k != "agent_id"},
                "allow_followup_queries": True}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/research", status_code=202)
async def run_research(
    matter_id: str,
    question: str = "",
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        matter = context.matters.get(matter_id)
        return context.research_runs.start(
            matter_id,
            [question.strip() or str(matter["title"])],
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/research-runs", status_code=202)
async def start_research_run(
    matter_id: str,
    payload: ResearchRunStart,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        questions = payload.questions or ([payload.question] if payload.question.strip() else [])
        return context.research_runs.start(
            matter_id,
            questions,
            source_action_key=payload.source_action_key,
            issue_id=payload.issue_id,
            search_scope=payload.search_scope,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{matter_id}/research-runs")
def list_research_runs(matter_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        return {"runs": context.research_runs.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/research-runs/{run_id}")
def get_research_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context, scope="function")):
    try:
        return context.research_runs.get(matter_id, run_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{matter_id}/annotations")
def list_annotations(
    matter_id: str,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        return {"annotations": context.annotations.list(matter_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/annotations", status_code=201)
def create_annotation(
    matter_id: str,
    payload: AnnotationCreate,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        return context.annotations.create(matter_id, **payload.model_dump())
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{matter_id}/annotations/{annotation_id}/answer")
async def answer_annotation(
    matter_id: str,
    annotation_id: str,
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
    person_id: str | None = Header(None, alias="X-Themis-Person-Id"),
):
    actor, action_actor = _lifecycle_actor(context, person_id)
    try:
        result = context.work_products.finalize(matter_id, payload.draft_path, action_actor=action_actor)
        return result
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{matter_id}/work-product/draft", status_code=201)
def create_work_product_draft(
    matter_id: str,
    payload: WorkProductDraftRequest,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        return context.work_products.create_draft(
            matter_id, title=payload.title.strip(), content=payload.content,
            source_action_key=payload.source_action_key,
            recommendation_content=payload.recommendation,
            recommendation_actor=payload.recommendation_actor,
        )
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


def _matter_mutation_response(
    operation: str,
    matter: dict,
    *,
    changed_paths: list[str] | None = None,
) -> dict:
    paths = list(changed_paths if changed_paths is not None else matter.get("changed_paths", []))
    return {
        **matter,
        "operation_result": {
            "action": operation,
            "source_action_key": None,
            "operation": operation,
            "status": "changed" if paths else "no_change",
            "summary": operation.replace("_", " ").capitalize() + ".",
            "matter_id": matter["matter_id"],
            "entity_refs": [{"type": "matter", "id": matter["matter_id"]}],
            "changed_paths": paths,
            "resulting_matter_state": {
                "stage": matter["status"],
                "next_action": matter["work_state"]["next_action"],
                "work_state": matter["work_state"],
                "consistency_issues": matter.get("consistency_issues", []),
            },
            "available_next_actions": [],
            "required_user_action": None,
            "error": None,
            "recovery": None,
        },
    }


async def _start_intake_safely(context: AppContext, matter_id: str, request_text: str) -> None:
    """Start optional intake after durable creation without changing its success."""
    try:
        _start_intake(context, matter_id, request_text)
    except Exception:
        # The durable matter remains useful and intake can be restarted directly.
        return
