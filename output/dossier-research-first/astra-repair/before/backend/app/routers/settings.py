from __future__ import annotations

import logging
from pathlib import Path

from fastapi import APIRouter, Body, Depends, HTTPException, Request

from app.models.api import (
    AnswerContractResponse,
    AnswerContractUpdate,
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
from app.services.company import (
    CompanyProfileReplacementConfirmationError,
    CompanyProfileVersionConflictError,
)
from app.services.provider_settings_policy import ProviderSettingsPolicy
from app.vault_manager import VaultManager


router = APIRouter(prefix="/settings", tags=["settings"])
logger = logging.getLogger(__name__)


@router.get("/research-queue/{matter_id}")
def get_research_queue(matter_id: str, context: AppContext = Depends(get_context)):
    return {"items": context.research_runs.list(matter_id)}


def _research_queue_state(context: AppContext, matter_id: str, items: list[dict]) -> dict:
    active = next((item for item in items if item.get("state") == "running"), None)
    return {
        "stage": context.matters.get(matter_id)["status"],
        "active_run_id": active.get("run_id") if active else None,
        "pending_run_ids": [item["run_id"] for item in items if item.get("state") == "queued"],
    }


def _research_queue_result(
    context: AppContext, matter_id: str, *, action: str, status: str,
    summary: str, items: list[dict], changed_paths: list[str],
    source_action_key: str | None = None, item: dict | None = None,
) -> dict:
    matter = context.matters.get(matter_id)
    entity_items = [item] if item else [entry for entry in items if entry.get("path") in changed_paths]
    return {
        "action": action,
        "source_action_key": source_action_key,
        "operation": action,
        "status": status,
        "summary": summary,
        "matter_id": matter_id,
        "entity_refs": [
            {"type": "research_queue_item", "id": str(entry["run_id"]), "path": str(entry["path"])}
            for entry in entity_items
        ],
        "changed_paths": changed_paths,
        "resulting_matter_state": _research_queue_state(context, matter_id, items),
        "available_next_actions": context.matters.available_next_actions(matter),
        "required_user_action": None,
        "error": None,
        "recovery": None,
        "data": {"items": items, "item": item},
    }


@router.post("/research-queue/{matter_id}/reorder")
def reorder_research_queue(
    matter_id: str, payload: dict = Body(...), context: AppContext = Depends(get_context),
):
    try:
        requested = list(payload.get("run_ids", []))
        before = [item for item in context.research_runs.list(matter_id) if item.get("state") == "queued"]
        before_ids = [item["run_id"] for item in before]
        items = context.research_runs.reorder(matter_id, requested)
        changed_ids = {
            run_id for position, run_id in enumerate(requested)
            if position >= len(before_ids) or before_ids[position] != run_id
        }
        changed_paths = [str(item["path"]) for item in items if item.get("run_id") in changed_ids]
        changed = bool(changed_paths)
        return _research_queue_result(
            context, matter_id, action="reorder_research_queue",
            status="changed" if changed else "no_change",
            summary="Research queue reordered." if changed else "Research queue order is already current.",
            items=items, changed_paths=changed_paths,
            source_action_key=payload.get("source_action_key"),
        )
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/research-queue/{matter_id}/resume", status_code=202)
async def resume_research_queue(
    matter_id: str, payload: dict | None = Body(default=None),
    context: AppContext = Depends(get_context),
):
    resumed = context.research_runs.resume(matter_id)
    items = context.research_runs.list(matter_id)
    current = context.research_runs.get(matter_id, resumed["run_id"]) if resumed else None
    return _research_queue_result(
        context, matter_id, action="resume_research_queue",
        status="changed" if current else "no_change",
        summary="Research queue resumed." if current else "Research queue has no item to resume.",
        items=items, changed_paths=[str(current["path"])] if current else [],
        source_action_key=(payload or {}).get("source_action_key"), item=current,
    )


@router.post("/research-queue/{matter_id}/stop")
async def stop_research_queue(
    matter_id: str, payload: dict | None = Body(default=None),
    context: AppContext = Depends(get_context),
):
    before = context.research_runs.list(matter_id)
    active_paths = [
        str(item["path"]) for item in before
        if item.get("state") in {"queued", "running"}
    ]
    items = await context.research_runs.stop(matter_id)
    return _research_queue_result(
        context, matter_id, action="stop_research_queue",
        status="changed" if active_paths else "no_change",
        summary=(
            "Research stopped. Saved results remain available."
            if active_paths else "Research queue has no active item to stop."
        ),
        items=items, changed_paths=active_paths,
        source_action_key=(payload or {}).get("source_action_key"),
    )


@router.post("/research-queue/{matter_id}/{run_id}/retry", status_code=202)
async def retry_research_item(
    matter_id: str, run_id: str, payload: dict | None = Body(default=None),
    context: AppContext = Depends(get_context),
):
    try:
        item = context.research_runs.retry(matter_id, run_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    items = context.research_runs.list(matter_id)
    return _research_queue_result(
        context, matter_id, action="retry_research_item", status="changed",
        summary="Failed research queued to retry.", items=items,
        changed_paths=[str(item["path"])],
        source_action_key=(payload or {}).get("source_action_key"), item=item,
    )


class CompanyProfileUpdate(CompanyProfile):
    replacement_confirmation: str = ""


class CompanyProfileResponse(CompanyProfile):
    saved_at: str = ""


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
        logger.error("Vault activation failed: %s", type(exc).__name__)
        if create and selected is not None:
            raise HTTPException(
                status_code=500,
                detail="The vault was created but could not be activated. You can load it from Settings.",
            ) from exc
        if isinstance(exc, (KeyError, OSError, ValueError)):
            raise HTTPException(
                status_code=422,
                detail="The vault could not be activated. Check the selected vault and try again.",
            ) from exc
        raise HTTPException(
            status_code=500,
            detail="The vault could not be activated. Try again.",
        ) from exc


@router.post("/vault/create", response_model=VaultInfo)
async def create_vault(payload: VaultPathRequest, request: Request):
    return await _activate_vault(request, payload.path, create=True)


@router.post("/vault/load", response_model=VaultInfo)
async def load_vault(payload: VaultPathRequest, request: Request):
    return await _activate_vault(request, payload.path, create=False)


def _company_response(context: AppContext, profile: CompanyProfile) -> dict[str, str]:
    return {**profile.model_dump(), "saved_at": context.company.saved_at()}


@router.get("/company", response_model=CompanyProfileResponse)
def get_company_profile(context: AppContext = Depends(get_context)):
    return _company_response(context, context.company.read())


@router.put("/company", response_model=CompanyProfileResponse)
def update_company_profile(
    payload: CompanyProfileUpdate,
    context: AppContext = Depends(get_context),
):
    profile = CompanyProfile.model_validate(
        payload.model_dump(exclude={"replacement_confirmation"})
    )
    try:
        saved = context.company.write(
            profile,
            replacement_confirmation=payload.replacement_confirmation,
        )
        return _company_response(context, saved)
    except CompanyProfileVersionConflictError as exc:
        raise HTTPException(
            status_code=409,
            detail="The company profile changed. Reload it and try again.",
        ) from exc
    except CompanyProfileReplacementConfirmationError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.get("/answer-contract", response_model=AnswerContractResponse)
def get_answer_contract(context: AppContext = Depends(get_context)):
    return context.answer_contract.read()


@router.put("/answer-contract", response_model=AnswerContractResponse)
def update_answer_contract(
    payload: AnswerContractUpdate,
    context: AppContext = Depends(get_context),
):
    try:
        return context.answer_contract.write(payload.content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/answer-contract/reset", response_model=AnswerContractResponse)
def reset_answer_contract(context: AppContext = Depends(get_context)):
    return context.answer_contract.reset()


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
async def get_settings(context: AppContext = Depends(get_context), include_model_catalog: bool = True):
    result = context.settings_store.read()
    result["values"].update(
        {
            "agents.provider": context.settings.llm_provider,
            "agents.reasoning_model": context.settings.llm_model or "mock",
            "agents.reasoning_effort": context.settings.llm_reasoning_effort or "default",
        }
    )
    if include_model_catalog:
        result["model_catalog"] = context.settings_store.normalize_model_catalog(
            await context.model_catalog()
        )
    for key, value in context.research_settings.items():
        result["values"].setdefault(f"research.{key}", value)
    return result


@router.put("")
async def update_settings(
    payload: SettingsUpdate,
    context: AppContext = Depends(get_context),
):
    research_keys = {
        "research.primary_external_provider", "research.fallback_external_provider",
        "research.model_fallback_enabled", "research.model_fallback_provider",
        "research.model_fallback_model", "research.external_timeout_seconds",
        "research.external_retry_count", "research.collection_enabled", "research.collection_reasoning_effort",
    }
    unknown_research = [key for key in payload.values if str(key).startswith("research.") and key not in research_keys]
    if unknown_research:
        raise HTTPException(status_code=422, detail=f"Unsupported research setting: {unknown_research[0]}")
    try:
        ProviderSettingsPolicy.validate_research_values(payload.values)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    try:
        context.settings_store.validate(payload.values)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    current_model = context.settings.llm_model or "mock"
    try:
        selection = ProviderSettingsPolicy.agent_selection(
            payload.values.get("agents.provider", context.settings.llm_provider),
            payload.values.get("agents.reasoning_model", current_model or ""),
            payload.values.get(
                "agents.reasoning_effort",
                context.settings.llm_reasoning_effort or "default",
            ),
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    catalog = context.settings_store.normalize_model_catalog(await context.model_catalog())
    merged_research = {**context.settings_store.read()["values"], **payload.values}
    if merged_research.get("research.collection_enabled", False) and any(str(key).startswith("research.") for key in payload.values):
        try:
            collector = ProviderSettingsPolicy.agent_selection(
                merged_research.get("research.model_fallback_provider", "openai_compatible"),
                merged_research.get("research.model_fallback_model", "kimi-k3-fast"),
                merged_research.get("research.collection_reasoning_effort", "default"))
            ProviderSettingsPolicy.validate_catalog(collector, catalog)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
    try:
        ProviderSettingsPolicy.validate_catalog(selection, catalog)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    research_only = all(str(key).startswith("research.") for key in payload.values)
    if research_only:
        saved = context.settings_store.write(payload.values)
        context.research_settings = context._load_research_settings()
        context.research.configure(context.research_settings)
        context.polaris_intelligence.configure(
            timeout_seconds=context.research_settings["external_timeout_seconds"],
            retry_count=context.research_settings["external_retry_count"],
        )
        return saved
    try:
        await context.configure_model(
            selection.provider, selection.model, selection.reasoning_effort
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    saved = context.settings_store.write(payload.values)
    context.research_settings = context._load_research_settings()
    context.research.configure(context.research_settings)
    context.polaris_intelligence.configure(
        timeout_seconds=context.research_settings["external_timeout_seconds"],
        retry_count=context.research_settings["external_retry_count"],
    )
    return saved
