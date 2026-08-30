from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import Request

from app.runtime import AppContext


async def get_context(request: Request) -> AsyncIterator[AppContext]:
    manager = getattr(request.app.state, "context_manager", None)
    if manager is None:
        yield request.app.state.context
        return
    async with manager.lease() as context:
        yield context
