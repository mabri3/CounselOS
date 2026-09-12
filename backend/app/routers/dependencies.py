from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Request

from app.runtime import AppContext


@asynccontextmanager
async def dossier_updates(request, context):
    """Mutating record routes use function scope so refresh sees the final save."""
    from app.services.dossier_generation import generation_owner, generate_pending
    from app.utils.ids import new_id
    owner = new_id("DOSOP")
    token = generation_owner.set(owner)
    since = context.dossiers.generation_sequence
    skill = context.skills.dossier_generation_snapshot() if request.method not in {"GET", "HEAD", "OPTIONS"} else None
    try:
        yield
    finally:
        try:
            if request.method not in {"GET", "HEAD", "OPTIONS"}:
                await generate_pending(context, since=since, owner=owner, snapshot=skill)
        finally:
            generation_owner.reset(token)


async def get_context(request: Request) -> AsyncIterator[AppContext]:
    manager = getattr(request.app.state, "context_manager", None)
    if manager is None:
        async with dossier_updates(request, request.app.state.context):
            yield request.app.state.context
        return
    async with manager.lease() as context:
        async with dossier_updates(request, context):
            yield context
