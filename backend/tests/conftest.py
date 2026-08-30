from __future__ import annotations

import shutil
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.runtime import AppContext
from app.routers import awareness


TEST_VAULT_SOURCE = Path(__file__).resolve().parent / "fixtures" / "vault"


def copy_test_vault(destination: Path) -> None:
    """Copy the committed deterministic fixture into one isolated test vault."""
    shutil.copytree(TEST_VAULT_SOURCE, destination)


@pytest.fixture()
def app_context(tmp_path: Path) -> AppContext:
    vault = tmp_path / "vault"
    copy_test_vault(vault)
    settings_file = vault / "00_System" / "settings.md"
    if settings_file.exists():
        settings_file.unlink()
    settings = Settings(
        vault_path=str(vault),
        scheduler_enabled=False,
        llm_provider="mock",
        llm_api_key=None,
        llm_model=None,
        search_provider="disabled",
        decision_review_age_days=180,
    )
    return AppContext(settings)


@pytest.fixture()
def awareness_client(app_context: AppContext) -> TestClient:
    app = FastAPI()
    app.state.context = app_context
    app.include_router(awareness.router, prefix="/api")
    return TestClient(app)
