from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import AgentCreate, AgentUpdate, ScheduleCreate, ScheduleUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/automations", tags=["automations"])


@router.get("")
def list_automations(context: AppContext = Depends(get_context)):
    return {"schedules": context.scheduler.list(), "agents": context.agents.list()}


@router.post("/schedules", status_code=201)
def create_schedule(payload: ScheduleCreate, context: AppContext = Depends(get_context)):
    return context.scheduler.create(payload)


@router.patch("/schedules/{schedule_id}")
def update_schedule(
    schedule_id: str,
    payload: ScheduleUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.scheduler.update(schedule_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/schedules/{schedule_id}/run")
async def run_schedule(schedule_id: str, context: AppContext = Depends(get_context)):
    try:
        return await context.scheduler.run(schedule_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/agents", status_code=201)
def create_agent(payload: AgentCreate, context: AppContext = Depends(get_context)):
    return context.agents.create(**payload.model_dump())


@router.get("/agents")
def list_agents(context: AppContext = Depends(get_context)):
    return {"agents": context.agents.list()}


@router.get("/agents/{agent_id}")
def get_agent(agent_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.agents.get(agent_id).__dict__
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/agents/{agent_id}")
def update_agent(
    agent_id: str,
    payload: AgentUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.agents.update(
            agent_id, **payload.model_dump(exclude_none=True)
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/tools")
def list_tools(context: AppContext = Depends(get_context)):
    return {"tools": context.tools.list()}


@router.get("/audiences")
def list_audiences(context: AppContext = Depends(get_context)):
    return {"audiences": context.agents.audiences()}
