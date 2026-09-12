from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal, Protocol
from contextvars import ContextVar

provider_session_id: ContextVar[str | None] = ContextVar("provider_session_id", default=None)


ReasoningEffort = Literal["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"]
ProviderReadiness = Literal["ready", "missing", "unavailable", "development_only"]


@dataclass(frozen=True)
class ProviderSelection:
    agent_id: str
    provider: str
    model: str
    reasoning_effort: str = ""


@dataclass(frozen=True)
class ProviderModel:
    id: str
    label: str
    reasoning_efforts: tuple[str, ...] = ()


@dataclass(frozen=True)
class ProviderCatalogEntry:
    id: str
    label: str
    readiness: ProviderReadiness
    readiness_detail: str
    models: tuple[ProviderModel, ...] = ()


@dataclass
class ProviderToolCall:
    id: str
    name: str
    arguments: dict[str, Any]


@dataclass
class ProviderReply:
    content: str = ""
    tool_calls: list[ProviderToolCall] = field(default_factory=list)
    usage: dict[str, int | None] | None = None


class LLMProvider(Protocol):
    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply: ...
