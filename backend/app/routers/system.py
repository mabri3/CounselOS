from __future__ import annotations

from fastapi import APIRouter, Depends

from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(tags=["system"])


@router.get("/health")
def health(context: AppContext = Depends(get_context)):
    return {
        "status": "ok",
        "app": context.settings.app_name,
        "provider": context.settings.llm_provider,
        "vault": str(context.settings.resolved_vault_path),
    }


@router.get("/config")
def config(context: AppContext = Depends(get_context)):
    return {
        "app_name": context.settings.app_name,
        "provider": context.settings.llm_provider,
        "search_provider": context.settings.search_provider,
        "workflow_stages": context.workflow.stages(),
        "scheduler_enabled": context.settings.scheduler_enabled,
    }
