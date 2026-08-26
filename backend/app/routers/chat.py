from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import ChatRequest, ChatResponse
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, context: AppContext = Depends(get_context)):
    try:
        return await context.runner.run(payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
