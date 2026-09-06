from __future__ import annotations

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers import system
from app.runtime import AppContext


def system_client(app_context: AppContext, *, ready: bool) -> TestClient:
    app = FastAPI()
    app.state.context = app_context
    app.state.ready = ready
    app.include_router(system.router, prefix="/api")
    return TestClient(app)


def test_health_reports_runtime_context(app_context: AppContext) -> None:
    response = system_client(app_context, ready=False).get("/api/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "app": app_context.settings.app_name,
        "provider": "mock",
        "vault": str(app_context.settings.resolved_vault_path),
    }


def test_readiness_requires_completed_startup(app_context: AppContext) -> None:
    response = system_client(app_context, ready=False).get("/api/ready")

    assert response.status_code == 503
    assert response.json() == {"detail": "Application startup is not complete."}


def test_readiness_reports_runtime_context_after_startup(app_context: AppContext) -> None:
    response = system_client(app_context, ready=True).get("/api/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "app": app_context.settings.app_name,
        "provider": "mock",
        "vault": str(app_context.settings.resolved_vault_path),
    }
