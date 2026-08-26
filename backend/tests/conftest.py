from __future__ import annotations

import shutil
from pathlib import Path

import pytest

from app.config import Settings
from app.runtime import AppContext


@pytest.fixture()
def app_context(tmp_path: Path) -> AppContext:
    source = Path(__file__).resolve().parents[2] / "vault"
    vault = tmp_path / "vault"
    shutil.copytree(source, vault)
    settings = Settings(
        vault_path=str(vault),
        scheduler_enabled=False,
        llm_provider="mock",
        search_provider="disabled",
        decision_review_age_days=180,
    )
    return AppContext(settings)
