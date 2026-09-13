from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import SkillCreate, SkillDraftRequest, SkillUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("")
def list_skills(context: AppContext = Depends(get_context)):
    skills = [skill.as_dict() for skill in context.skills.list()]
    if not any(skill['skill_id'] == 'matter-paths' for skill in skills):
        skills.append({**context.skills.matter_paths_snapshot(), 'description':'Shared across both matter conversations.'})
    return {"skills": skills}


@router.get("/questions")
def list_questions(context: AppContext = Depends(get_context)):
    return {"questions": context.skill_builder.questions()}


@router.post("/draft")
async def draft_skill(payload: SkillDraftRequest, context: AppContext = Depends(get_context)):
    return await context.skill_builder.draft(payload.goal, payload.answers)


@router.post("/suggestions")
async def suggest_skills(context: AppContext = Depends(get_context)):
    return await context.skill_builder.suggestions()


@router.post("", status_code=201)
def create_skill(payload: SkillCreate, context: AppContext = Depends(get_context)):
    try:
        return context.skills.create(**payload.model_dump()).as_dict()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


def template_values(payload: dict, current=None) -> dict:
    values = dict(payload)
    keys = ("audience", "purpose", "tone", "length", "exclusions", "source_presentation", "sample_wording")
    if any(key in values for key in keys):
        defaults = {key: str(getattr(current, key, "") or "") for key in keys} if current else {}
        defaults.update(values.pop("defaults", {}) or {})
        defaults.update({key: values.pop(key) for key in keys if key in values})
        values["defaults"] = defaults
    return values


@router.get("/output-templates")
def templates(context: AppContext = Depends(get_context)):
    return context.skills.list_output_templates()


@router.post("/output-templates")
def create_template(payload: dict, context: AppContext = Depends(get_context)):
    from app.routers.workspace import invoke
    return invoke(context.skills.create_output_template, **template_values(payload))


@router.put("/output-templates/{template_id}")
def update_template(template_id: str, payload: dict, context: AppContext = Depends(get_context)):
    from app.routers.workspace import invoke
    try:
        return context.skills.update_output_template(template_id, **template_values(payload, context.skills.get_output_template(template_id)))
    except ValueError as exc:
        raise HTTPException(409 if "revision conflict" in str(exc) else 422, detail=str(exc)) from exc


@router.post("/output-templates/{template_id}/duplicate")
def duplicate_template(template_id: str, payload: dict, context: AppContext = Depends(get_context)):
    from app.routers.workspace import invoke
    return invoke(context.skills.duplicate_output_template, template_id, **payload)


@router.post("/output-templates/default")
def default_template(payload: dict, context: AppContext = Depends(get_context)):
    from app.routers.workspace import invoke
    return invoke(context.skills.set_default_output_template, payload["output_type"], payload.get("template_id"))


@router.get("/{skill_id}")
def get_skill(skill_id: str, context: AppContext = Depends(get_context)):
    if skill_id == 'matter-paths':
        return {**context.skills.matter_paths_snapshot(), 'description':'Shared across both matter conversations.'}
    try:
        return context.skills.get(skill_id).as_dict()
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{skill_id}")
def update_skill(
    skill_id: str,
    payload: SkillUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.skills.update(
            skill_id, **payload.model_dump(exclude_none=True)
        ).as_dict()
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
