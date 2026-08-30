from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import DecisionCreate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/decisions", tags=["decisions"])


@router.get("")
def list_decisions(
    status: str | None = None,
    context: AppContext = Depends(get_context),
):
    return {"decisions": context.decisions.list(status)}


@router.post("", status_code=201)
def record_decision(payload: DecisionCreate, context: AppContext = Depends(get_context)):
    return context.decisions.record(payload)


@router.get("/{decision_id}")
def get_decision(decision_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.decisions.get(decision_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{decision_id}/revisions", status_code=201)
def revise_decision(
    decision_id: str,
    payload: DecisionCreate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.decisions.revise(decision_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/audit")
def audit_decisions(context: AppContext = Depends(get_context)):
    return context.decisions.audit()
