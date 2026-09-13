"""Optional local identities and shared work. This is not authentication."""
from fastapi import APIRouter, Depends, Header
from app.models.continuity import DemoRosterCommand
from app.routers.dependencies import get_context
from app.routers.workspace import invoke

router = APIRouter(prefix="/team", tags=["team"])

@router.get("")
def roster(context=Depends(get_context), person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    saved = context.workspace_team.roster()
    actor = invoke(context.workspace_team.resolve_actor, person_id or None)
    return {**saved, "actor": actor.model_dump()}

@router.put("")
def configure(payload: DemoRosterCommand, context=Depends(get_context)):
    return invoke(context.workspace_team.configure, payload)

@router.get("/work")
def work(view: str = "my_work", context=Depends(get_context), person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    actor = invoke(context.workspace_team.resolve_actor, person_id or None)
    return invoke(context.workspace_team.queue, actor=actor, view=view)

@router.get("/orientations")
def orientations(context=Depends(get_context), person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    actor = invoke(context.workspace_team.resolve_actor, person_id or None)
    queue = context.workspace_team.queue(actor=actor)
    return [context.workspace_orientation.get(m["matter_id"], actor=actor, requests=context.fact_requests.list(m["matter_id"]),
        team_items=queue, seen=context.workspace_team.seen(m["matter_id"], actor=actor)) for m in context.matters.list()]
