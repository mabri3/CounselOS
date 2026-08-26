from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.models.api import MatterCreate, StageUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/matters", tags=["matters"])


@router.get("")
def list_matters(context: AppContext = Depends(get_context)):
    return {"matters": context.matters.list(), "stages": context.workflow.stages()}


@router.post("", status_code=201)
def create_matter(payload: MatterCreate, context: AppContext = Depends(get_context)):
    return context.matters.create(payload)


@router.get("/{matter_id}")
def get_matter(matter_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.matters.get(matter_id)
    except KeyError as exc:
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
