from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.config import get_settings
from app.active_context import ActiveContextManager
from app.observability import configure_logging
from app.routers import dossier_requests, experimental_chat, awareness, automations, chat, decisions, files, matters, settings as settings_router, skills, system, workspace, team


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ready = False
    manager = ActiveContextManager(get_settings())
    context = manager.context
    app.state.context_manager = manager
    app.state.context = context
    try:
        if context.settings.scheduler_enabled:
            context.scheduler.start()
        app.state.ready = True
        yield
    finally:
        app.state.ready = False
        await manager.shutdown()


configure_logging()
settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.state.ready = False
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "testserver"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys([
        settings.frontend_origin,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ])),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    experimental_chat.router,
    system.router,
    awareness.router,
    matters.router,
    dossier_requests.router,
    files.router,
    skills.router,
    chat.router,
    workspace.router,
    team.router,
    decisions.router,
    automations.router,
    settings_router.router,
):
    app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"name": settings.app_name, "docs": "/docs", "health": "/api/health"}
