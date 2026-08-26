from __future__ import annotations

from fastapi import APIRouter, Depends

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


@router.post("/audit")
def audit_decisions(context: AppContext = Depends(get_context)):
    return context.decisions.audit()
