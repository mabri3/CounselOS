from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import SkillCreate, SkillDraftRequest, SkillUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("")
def list_skills(context: AppContext = Depends(get_context)):
    return {"skills": [skill.as_dict() for skill in context.skills.list()]}


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


@router.get("/{skill_id}")
def get_skill(skill_id: str, context: AppContext = Depends(get_context)):
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
