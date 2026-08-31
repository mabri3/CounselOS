from __future__ import annotations

import asyncio
import inspect
from dataclasses import asdict
from typing import Any

from app.agents.runner import ResolvedAgentProvider
from app.config import Settings
from app.providers.antigravity_cli import AntigravityCLIProvider
from app.providers.base import LLMProvider, ProviderCatalogEntry, ProviderModel, ProviderSelection
from app.providers.codex_cli import CodexCLIProvider
from app.providers.mock import MockProvider
from app.providers.opencode_go import OpenCodeGoProvider
from app.providers.openai_compatible import OpenAICompatibleProvider


def build_provider(settings: Settings) -> LLMProvider:
    provider = settings.llm_provider.strip().lower()
    if provider in {"", "mock", "demo"}:
        return MockProvider()
    if provider in {"openai", "openai_compatible", "compatible"}:
        return OpenAICompatibleProvider(settings)
    if not settings.llm_model:
        raise ValueError(f"Select a model for provider: {settings.llm_provider}")
    effort = settings.llm_reasoning_effort or "default"
    if provider == "opencode_go":
        return OpenCodeGoProvider(settings.llm_model, reasoning_effort=effort, timeout_seconds=settings.llm_timeout_seconds)
    if provider == "codex":
        return CodexCLIProvider(settings.llm_model, reasoning_effort=effort, timeout_seconds=settings.llm_timeout_seconds)
    if provider == "antigravity_cli":
        return AntigravityCLIProvider(settings.llm_model, reasoning_effort=effort, timeout_seconds=settings.llm_timeout_seconds)
    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")


class ProviderRouter:
    """Constructs, catalogs, reuses, and closes Counsel OS model providers."""

    def __init__(self, settings: Settings, workspace_provider: LLMProvider):
        self.settings = settings
        self.workspace_provider = workspace_provider
        self._instances: dict[tuple[str, str, str], LLMProvider] = {}

    async def update_workspace(self, settings: Settings, provider: LLMProvider) -> None:
        await self._close_all(extra=[self.workspace_provider], exclude={id(provider)})
        self.settings = settings
        self.workspace_provider = provider

    def resolve(self, agent: Any) -> ResolvedAgentProvider:
        inherits_workspace = not str(agent.provider or "").strip()
        provider_id = str(self.settings.llm_provider if inherits_workspace else agent.provider).strip().lower() or "mock"
        model = str(self._workspace_model(provider_id) if inherits_workspace else agent.model or "").strip()
        effort = str(
            self.settings.llm_reasoning_effort or "default"
            if inherits_workspace else agent.reasoning_effort or "default"
        ).strip()
        if provider_id == "mock":
            model, effort = "mock", "default"
            provider = self._mock_provider()
        elif inherits_workspace:
            provider = self.workspace_provider
        else:
            if not model:
                raise ValueError(f"Agent {agent.agent_id} has no model selected for {provider_id}.")
            key = (provider_id, model, effort)
            provider = self._instances.get(key)
            if provider is None:
                provider = self._construct(provider_id, model, effort)
                self._instances[key] = provider
        return ResolvedAgentProvider(
            provider=provider,
            selection=ProviderSelection(
                agent_id=agent.agent_id,
                provider=provider_id,
                model=model,
                reasoning_effort=effort,
            ),
        )

    def resolve_selection(self, selection: ProviderSelection) -> ResolvedAgentProvider:
        if selection.provider == "mock":
            provider: LLMProvider = self._mock_provider()
        else:
            if not selection.model.strip():
                raise ValueError(f"Agent {selection.agent_id} has no model selected for {selection.provider}.")
            key = (selection.provider, selection.model, selection.reasoning_effort)
            provider = self._instances.get(key)
            if provider is None:
                provider = self._construct(*key)
                self._instances[key] = provider
        return ResolvedAgentProvider(provider=provider, selection=selection)

    def _mock_provider(self) -> LLMProvider:
        if isinstance(self.workspace_provider, MockProvider):
            return self.workspace_provider
        key = ("mock", "mock", "default")
        provider = self._instances.get(key)
        if provider is None:
            provider = MockProvider()
            self._instances[key] = provider
        return provider

    def _workspace_model(self, provider_id: str) -> str:
        return "mock" if provider_id == "mock" else str(self.settings.llm_model or "")

    def _construct(self, provider_id: str, model: str, effort: str) -> LLMProvider:
        if provider_id == "openai_compatible":
            return OpenAICompatibleProvider(self.settings.model_copy(update={
                "llm_provider": provider_id,
                "llm_model": model,
                "llm_reasoning_effort": None if effort == "default" else effort,
            }))
        kwargs = {"reasoning_effort": effort, "timeout_seconds": self.settings.llm_timeout_seconds}
        if provider_id == "opencode_go":
            return OpenCodeGoProvider(model, **kwargs)
        if provider_id == "codex":
            return CodexCLIProvider(model, **kwargs)
        if provider_id == "antigravity_cli":
            return AntigravityCLIProvider(model, **kwargs)
        raise ValueError(f"Unsupported model provider: {provider_id}")

    async def catalog(self, saved: dict[str, str] | None = None) -> dict[str, object]:
        saved = saved or {}
        compatible = await self._openai_catalog(saved.get("openai_compatible"))
        opencode, codex, antigravity = await asyncio.gather(
            OpenCodeGoProvider.catalog(saved_model=saved.get("opencode_go")),
            CodexCLIProvider.catalog(saved_model=saved.get("codex")),
            AntigravityCLIProvider.catalog(saved_model=saved.get("antigravity_cli")),
        )
        mock = ProviderCatalogEntry(
            id="mock", label="Mock (offline)", readiness="ready",
            readiness_detail="Always available for offline development.",
            models=(ProviderModel("mock", "Mock demo", ("default",)),),
        )
        return {"providers": [asdict(item) for item in (mock, compatible, opencode, codex, antigravity)]}

    async def _openai_catalog(self, saved_model: str | None) -> ProviderCatalogEntry:
        label = self.settings.llm_provider_label or "OpenAI-compatible"
        if not self.settings.llm_api_key:
            models = (ProviderModel(saved_model, saved_model, ("default",)),) if saved_model else ()
            return ProviderCatalogEntry("openai_compatible", label, "missing", "API key is not configured.", models)
        try:
            rows = await OpenAICompatibleProvider.available_models(self.settings)
            models = tuple(ProviderModel(
                str(row["id"]), str(row.get("label") or row["id"]),
                tuple(dict.fromkeys(["default", *[str(value) for value in row.get("efforts", []) if value != "default"]])),
            ) for row in rows)
            if saved_model and saved_model not in {model.id for model in models}:
                models += (ProviderModel(saved_model, saved_model, ("default",)),)
            return ProviderCatalogEntry("openai_compatible", label, "ready", "API key and model catalog are available.", models)
        except Exception:
            models = (ProviderModel(saved_model, saved_model, ("default",)),) if saved_model else ()
            return ProviderCatalogEntry("openai_compatible", label, "unavailable", "Model catalog is unavailable.", models)

    async def close(self) -> None:
        await self._close_all(extra=[self.workspace_provider])

    async def _close_all(
        self,
        *,
        extra: list[LLMProvider] | None = None,
        exclude: set[int] | None = None,
    ) -> None:
        excluded = exclude or set()
        instances = [*self._instances.values(), *(extra or [])]
        self._instances.clear()
        seen: set[int] = set()
        for provider in instances:
            if id(provider) in seen or id(provider) in excluded:
                continue
            seen.add(id(provider))
            close = getattr(provider, "close", None)
            if close is None:
                continue
            result = close()
            if inspect.isawaitable(result):
                await result
