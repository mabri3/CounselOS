from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request

from app.models.api import (
    CompanyInterviewDraftRequest,
    CompanyInterviewDraftResponse,
    CompanyInterviewGuide,
    CompanyProfile,
    SettingsUpdate,
    VaultInfo,
    VaultPathRequest,
)
from app.active_context import VaultBusyError
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.services.company import CompanyProfileVersionConflictError
from app.vault_manager import VaultManager


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/vault", response_model=VaultInfo)
def get_vault(context: AppContext = Depends(get_context)):
    path = context.vault.root
    return {"name": path.name, "path": str(path)}


async def _activate_vault(request: Request, path: str, *, create: bool) -> dict[str, str]:
    manager = request.app.state.context_manager
    try:
        selected: Path | None = None

        def prepare(current_vault: Path) -> Path:
            nonlocal selected
            vaults = VaultManager(current_vault)
            selected = vaults.create(path) if create else vaults.load(path)
            return selected

        context = await manager.select(prepare)
        assert selected is not None
        request.app.state.context = context
        return {"name": selected.name, "path": str(selected)}
    except VaultBusyError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except Exception as exc:
        if create and selected is not None:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Vault created at {selected}, but Counsel OS could not activate it: {exc}. "
                    "The completed vault was preserved and can be loaded from that path."
                ),
            ) from exc
        if isinstance(exc, (KeyError, OSError, ValueError)):
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        raise


@router.post("/vault/create", response_model=VaultInfo)
async def create_vault(payload: VaultPathRequest, request: Request):
    return await _activate_vault(request, payload.path, create=True)


@router.post("/vault/load", response_model=VaultInfo)
async def load_vault(payload: VaultPathRequest, request: Request):
    return await _activate_vault(request, payload.path, create=False)


@router.get("/company", response_model=CompanyProfile)
def get_company_profile(context: AppContext = Depends(get_context)):
    return context.company.read()


@router.put("/company", response_model=CompanyProfile)
def update_company_profile(payload: CompanyProfile, context: AppContext = Depends(get_context)):
    try:
        return context.company.write(payload)
    except CompanyProfileVersionConflictError as exc:
        raise HTTPException(
            status_code=409,
            detail="The company profile changed. Reload it and try again.",
        ) from exc


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
            "agents.reasoning_model": context.settings.llm_model or "mock",
            "agents.reasoning_effort": context.settings.llm_reasoning_effort or "default",
        }
    )
    result["model_catalog"] = context.settings_store.normalize_model_catalog(
        await context.model_catalog()
    )
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
    current_model = context.settings.llm_model or "mock"
    provider = str(payload.values.get("agents.provider", context.settings.llm_provider))
    model = str(payload.values.get("agents.reasoning_model", current_model or ""))
    effort = str(
        payload.values.get(
            "agents.reasoning_effort",
            context.settings.llm_reasoning_effort or "default",
        )
    )
    catalog = context.settings_store.normalize_model_catalog(await context.model_catalog())
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
    if effort not in model_option.get("reasoning_efforts", []):
        raise HTTPException(
            status_code=422,
            detail=f"Reasoning effort is not available for this model: {effort}",
        )
    try:
        await context.configure_model(provider, model, effort)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return context.settings_store.write(payload.values)
