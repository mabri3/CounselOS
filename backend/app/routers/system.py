from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status

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


@router.get("/ready")
def ready(request: Request):
    context = getattr(request.app.state, "context", None)
    if not getattr(request.app.state, "ready", False) or context is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Application startup is not complete.",
        )
    return {
        "status": "ready",
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
