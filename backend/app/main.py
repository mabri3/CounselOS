from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import automations, chat, decisions, files, matters, settings as settings_router, system
from app.runtime import AppContext


@asynccontextmanager
async def lifespan(app: FastAPI):
    context = AppContext(get_settings())
    app.state.context = context
    if context.settings.scheduler_enabled:
        context.scheduler.start()
    yield
    await context.scheduler.stop()


settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    system.router,
    matters.router,
    files.router,
    chat.router,
    decisions.router,
    automations.router,
    settings_router.router,
):
    app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"name": settings.app_name, "docs": "/docs", "health": "/api/health"}
