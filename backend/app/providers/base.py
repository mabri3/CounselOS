from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class ProviderToolCall:
    id: str
    name: str
    arguments: dict[str, Any]


@dataclass
class ProviderReply:
    content: str = ""
    tool_calls: list[ProviderToolCall] = field(default_factory=list)


class LLMProvider(Protocol):
    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply: ...
