from __future__ import annotations

from app.config import Settings
from app.providers.base import LLMProvider
from app.providers.mock import MockProvider
from app.providers.openai_compatible import OpenAICompatibleProvider


def build_provider(settings: Settings) -> LLMProvider:
    provider = settings.llm_provider.strip().lower()
    if provider in {"", "mock", "demo"}:
        return MockProvider()
    if provider in {"openai", "openai_compatible", "compatible"}:
        return OpenAICompatibleProvider(settings)
    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")
