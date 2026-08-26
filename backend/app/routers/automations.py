from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import AgentCreate, ScheduleCreate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/automations", tags=["automations"])


@router.get("")
def list_automations(context: AppContext = Depends(get_context)):
    return {"schedules": context.scheduler.list(), "agents": context.agents.list()}


@router.post("/schedules", status_code=201)
def create_schedule(payload: ScheduleCreate, context: AppContext = Depends(get_context)):
    return context.scheduler.create(payload)


@router.post("/schedules/{schedule_id}/run")
async def run_schedule(schedule_id: str, context: AppContext = Depends(get_context)):
    try:
        return await context.scheduler.run(schedule_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/agents", status_code=201)
def create_agent(payload: AgentCreate, context: AppContext = Depends(get_context)):
    return context.agents.create(**payload.model_dump())
