from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import (
    CompanyInterviewDraftRequest,
    CompanyInterviewDraftResponse,
    CompanyInterviewGuide,
    CompanyProfile,
    SettingsUpdate,
)
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/company", response_model=CompanyProfile)
def get_company_profile(context: AppContext = Depends(get_context)):
    return context.company.read()


@router.put("/company", response_model=CompanyProfile)
def update_company_profile(payload: CompanyProfile, context: AppContext = Depends(get_context)):
    return context.company.write(payload)


@router.get("/company/interview", response_model=CompanyInterviewGuide)
def get_company_interview(context: AppContext = Depends(get_context)):
    return context.company_interview.guide()


@router.post("/company/interview", response_model=CompanyInterviewDraftResponse)
async def draft_company_profile(
    payload: CompanyInterviewDraftRequest,
    context: AppContext = Depends(get_context),
):
    try:
        return await context.company_interview.draft(
            payload.message,
            payload.history,
            payload.current_profile,
            payload.question_id,
            payload.finish,
            website_url=payload.website_url,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("")
async def get_settings(context: AppContext = Depends(get_context)):
    result = context.settings_store.read()
    result["values"].update(
        {
            "agents.provider": context.settings.llm_provider,
            "agents.reasoning_model": (
                context.settings.llm_model
                if context.settings.llm_provider == "openai_compatible"
                else "mock"
            ),
            "agents.reasoning_effort": context.settings.llm_reasoning_effort or "default",
        }
    )
    result["model_catalog"] = await context.model_catalog()
    return result


@router.put("")
async def update_settings(
    payload: SettingsUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        context.settings_store.validate(payload.values)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    current_model = (
        context.settings.llm_model
        if context.settings.llm_provider == "openai_compatible"
        else "mock"
    )
    provider = str(payload.values.get("agents.provider", context.settings.llm_provider))
    model = str(payload.values.get("agents.reasoning_model", current_model or ""))
    effort = str(
        payload.values.get(
            "agents.reasoning_effort",
            context.settings.llm_reasoning_effort or "default",
        )
    )
    catalog = await context.model_catalog()
    provider_option = next(
        (
            option
            for option in catalog["providers"]
            if isinstance(option, dict) and option.get("id") == provider
        ),
        None,
    )
    model_option = next(
        (
            option
            for option in provider_option.get("models", [])
            if isinstance(option, dict) and option.get("id") == model
        ),
        None,
    ) if provider_option else None
    if not provider_option:
        raise HTTPException(status_code=422, detail=f"Unsupported model provider: {provider}")
    if not model_option:
        raise HTTPException(status_code=422, detail=f"Model is not available from this provider: {model}")
    if effort not in model_option.get("efforts", []):
        raise HTTPException(
            status_code=422,
            detail=f"Reasoning effort is not available for this model: {effort}",
        )
    try:
        context.configure_model(provider, model, effort)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return context.settings_store.write(payload.values)
