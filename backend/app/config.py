from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime settings loaded from the repository-level .env file."""

    app_name: str = Field("Counsel OS", alias="APP_NAME")
    frontend_origin: str = Field("http://localhost:3000", alias="FRONTEND_ORIGIN")
    vault_path: str = Field("./vault", alias="VAULT_PATH")

    llm_provider: str = Field("mock", alias="LLM_PROVIDER")
    llm_base_url: str = Field("https://api.openai.com/v1", alias="LLM_BASE_URL")
    llm_api_key: str | None = Field(None, alias="LLM_API_KEY")
    llm_model: str | None = Field(None, alias="LLM_MODEL")
    llm_timeout_seconds: int = Field(120, alias="LLM_TIMEOUT_SECONDS")
    max_agent_steps: int = Field(6, alias="MAX_AGENT_STEPS")

    search_provider: str = Field("disabled", alias="SEARCH_PROVIDER")
    tavily_api_key: str | None = Field(None, alias="TAVILY_API_KEY")
    search_max_results: int = Field(6, alias="SEARCH_MAX_RESULTS")

    scheduler_enabled: bool = Field(True, alias="SCHEDULER_ENABLED")
    scheduler_poll_seconds: int = Field(5, alias="SCHEDULER_POLL_SECONDS")
    decision_review_age_days: int = Field(180, alias="DECISION_REVIEW_AGE_DAYS")
    max_upload_mb: int = Field(25, alias="MAX_UPLOAD_MB")

    model_config = SettingsConfigDict(
        env_file=(PROJECT_ROOT / ".env", PROJECT_ROOT / "backend" / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    @property
    def resolved_vault_path(self) -> Path:
        path = Path(self.vault_path).expanduser()
        return path.resolve() if path.is_absolute() else (PROJECT_ROOT / path).resolve()

    @property
    def cache_db_path(self) -> Path:
        return self.resolved_vault_path / ".counsel_os_cache.db"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
