from __future__ import annotations

from fastapi import APIRouter, Depends

from app.models.api import SettingsUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def get_settings(context: AppContext = Depends(get_context)):
    return context.settings_store.read()


@router.put("")
def update_settings(
    payload: SettingsUpdate,
    context: AppContext = Depends(get_context),
):
    return context.settings_store.write(payload.values)
