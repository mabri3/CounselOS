from __future__ import annotations

from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.models.api import SourceActionKey
from app.models.dossier_request import DossierRequestError
from app.models.research_scope import ResearchScope
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/matters/{matter_id}/dossier-requests", tags=["dossier-requests"])


class PrioritySelection(BaseModel):
    key: str = Field(min_length=1, max_length=100)
    text: str = Field(default="", max_length=1000)
    why: str = Field(default="", max_length=2000)
    issue_ids: list[str] = Field(default_factory=list, max_length=100)
    changed: bool = False


class DossierRequestStart(BaseModel):
    execution_mode: Literal["research", "saved_only"]
    expected_sequence: int = Field(ge=0)
    plan_revision: str = Field(min_length=1, max_length=256)
    priorities: list[PrioritySelection] = Field(default_factory=list, max_length=3)
    first_issue_ids: list[str] = Field(default_factory=list, max_length=3)
    scope: Literal["top_three", "all"] | None = None
    source_choice: ResearchScope = Field(default_factory=ResearchScope)
    accepted_candidate_keys: list[str] = Field(default_factory=list, max_length=100)
    source_action_key: SourceActionKey


class DossierRequestStop(BaseModel):
    expected_sequence: int = Field(ge=0)


class DossierRequestResume(BaseModel):
    expected_sequence: int = Field(ge=0)
    retry_unknown: bool = False
    retry_issue_ids: list[str] | None = Field(default=None, max_length=100)


def _raise_service_error(exc: DossierRequestError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("")
def list_requests(
    matter_id: str,
    conversation_id: str | None = Query(default=None),
    context: AppContext = Depends(get_context),
):
    try:
        # Validate identity without the UI-oriented matter getter, which may
        # perform compatibility repairs and index rebuilds.
        context.matters.matter_path(matter_id)
        return {"requests": context.dossier_requests.list(matter_id, conversation_id=conversation_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{request_id}")
def get_request(
    matter_id: str,
    request_id: str,
    context: AppContext = Depends(get_context),
):
    try:
        return context.dossier_requests.get(matter_id, request_id)
    except DossierRequestError as exc:
        _raise_service_error(exc)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{request_id}/start", status_code=202)
async def start_request(
    matter_id: str,
    request_id: str,
    payload: DossierRequestStart,
    context: AppContext = Depends(get_context),
):
    try:
        choices: dict[str, Any] = payload.model_dump(mode="json")
        return await context.dossier_requests.start(
            matter_id, request_id, choices, expected_sequence=payload.expected_sequence
        )
    except DossierRequestError as exc:
        _raise_service_error(exc)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{request_id}/stop")
async def stop_request(
    matter_id: str,
    request_id: str,
    payload: DossierRequestStop,
    context: AppContext = Depends(get_context),
):
    try:
        return await context.dossier_requests.stop(
            matter_id, request_id, expected_sequence=payload.expected_sequence
        )
    except DossierRequestError as exc:
        _raise_service_error(exc)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{request_id}/resume", status_code=202)
async def resume_request(
    matter_id: str,
    request_id: str,
    payload: DossierRequestResume,
    context: AppContext = Depends(get_context),
):
    try:
        return await context.dossier_requests.resume(
            matter_id,
            request_id,
            expected_sequence=payload.expected_sequence,
            retry_unknown=payload.retry_unknown,
            retry_issue_ids=payload.retry_issue_ids,
        )
    except DossierRequestError as exc:
        _raise_service_error(exc)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
