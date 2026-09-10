"""Provider settings rules shared by settings and runtime boundaries."""

from __future__ import annotations

from dataclasses import dataclass
from math import isfinite
from typing import Any


@dataclass(frozen=True)
class AgentProviderSelection:
    provider: str
    model: str
    reasoning_effort: str


class ProviderSettingsPolicy:
    AGENT_PROVIDERS = {
        "mock", "openai_compatible", "opencode_go", "codex", "antigravity_cli",
    }
    REASONING_EFFORTS = {
        "default", "none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra",
    }
    EXTERNAL_RESEARCH_PROVIDERS = {"polaris", "tavily", "firecrawl", "none"}
    MODEL_FALLBACK_PROVIDER = "openai_compatible"
    MODEL_FALLBACK_MODEL = "kimi-k3-fast"

    @classmethod
    def is_agent_provider(cls, provider: object) -> bool:
        return str(provider or "").strip().lower() in cls.AGENT_PROVIDERS

    @classmethod
    def agent_selection(
        cls, provider: object, model: object, reasoning_effort: object,
    ) -> AgentProviderSelection:
        provider_id = str(provider or "").strip().lower()
        selected_model = str(model or "").strip()
        effort = str(reasoning_effort or "default").strip().lower()
        if provider_id == "polaris":
            raise ValueError(
                "Polaris is a public research provider and cannot be selected for agent work."
            )
        if provider_id not in cls.AGENT_PROVIDERS:
            raise ValueError(f"Unsupported model provider: {provider_id or 'none'}")
        if provider_id == "mock":
            if selected_model not in {"", "mock"}:
                raise ValueError("Mock provider must use the mock model.")
            if effort != "default":
                raise ValueError("Mock provider only supports default reasoning effort.")
        elif not selected_model:
            raise ValueError("Select a model for this provider.")
        if effort not in cls.REASONING_EFFORTS:
            raise ValueError(f"Unsupported reasoning effort: {effort or 'none'}")
        return AgentProviderSelection(
            provider=provider_id,
            model="mock" if provider_id == "mock" else selected_model,
            reasoning_effort="default" if provider_id == "mock" else effort,
        )

    @classmethod
    def saved_agent_selection(cls, values: dict[str, Any]) -> AgentProviderSelection | None:
        if "agents.provider" not in values:
            return None
        return cls.agent_selection(
            values.get("agents.provider"),
            values.get("agents.reasoning_model"),
            values.get("agents.reasoning_effort", "default"),
        )

    @classmethod
    def validate_catalog(cls, selection: AgentProviderSelection, catalog: dict[str, Any]) -> None:
        provider_option = next(
            (
                option
                for option in catalog.get("providers", [])
                if isinstance(option, dict) and option.get("id") == selection.provider
            ),
            None,
        )
        if not provider_option:
            raise ValueError(f"Unsupported model provider: {selection.provider}")
        model_option = next(
            (
                option
                for option in provider_option.get("models", [])
                if isinstance(option, dict) and option.get("id") == selection.model
            ),
            None,
        )
        if not model_option:
            raise ValueError(
                f"Model is not available from this provider: {selection.model}"
            )
        if selection.reasoning_effort not in model_option.get("reasoning_efforts", []):
            raise ValueError(
                "Reasoning effort is not available for this model: "
                f"{selection.reasoning_effort}"
            )

    @classmethod
    def validate_research_values(cls, values: dict[str, Any]) -> None:
        for key in (
            "research.primary_external_provider",
            "research.fallback_external_provider",
        ):
            if key in values and str(values[key]) not in cls.EXTERNAL_RESEARCH_PROVIDERS:
                raise ValueError(f"Unsupported external research provider: {values[key]}")
        if (
            "research.model_fallback_provider" in values
            and values["research.model_fallback_provider"] != cls.MODEL_FALLBACK_PROVIDER
        ):
            raise ValueError(
                "The research model fallback provider must be openai_compatible."
            )
        if (
            "research.model_fallback_model" in values
            and values["research.model_fallback_model"] != cls.MODEL_FALLBACK_MODEL
        ):
            raise ValueError("The research model fallback must be kimi-k3-fast.")
        if (
            "research.external_timeout_seconds" in values
            or "research.external_retry_count" in values
        ):
            cls.polaris_transport(
                values.get("research.external_timeout_seconds", 90),
                values.get("research.external_retry_count", 2),
            )

    @staticmethod
    def polaris_transport(timeout_seconds: object, retry_count: object) -> tuple[int, int]:
        timeout_seconds = ProviderSettingsPolicy._whole_number(
            timeout_seconds, "Polaris timeout"
        )
        if timeout_seconds < 1:
            raise ValueError("Polaris timeout must be at least one second.")
        retry_count = ProviderSettingsPolicy._whole_number(
            retry_count, "Polaris retry count"
        )
        if retry_count < 0:
            raise ValueError("Polaris retry count cannot be negative.")
        return timeout_seconds, retry_count

    @staticmethod
    def _whole_number(value: object, label: str) -> int:
        if isinstance(value, bool):
            raise ValueError(f"{label} must be a whole number.")
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            if isfinite(value) and value.is_integer():
                return int(value)
            raise ValueError(f"{label} must be a whole number.")
        if isinstance(value, str):
            try:
                return int(value)
            except ValueError as exc:
                raise ValueError(f"{label} must be a whole number.") from exc
        raise ValueError(f"{label} must be a whole number.")
