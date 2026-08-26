from __future__ import annotations

import json
from typing import Any

import httpx

from app.config import Settings
from app.providers.base import ProviderReply, ProviderToolCall


class OpenAICompatibleProvider:
    """Small adapter for providers exposing the OpenAI chat-completions contract."""

    def __init__(self, settings: Settings):
        if not settings.llm_api_key or not settings.llm_model:
            raise ValueError("LLM_API_KEY and LLM_MODEL are required for an OpenAI-compatible provider.")
        self.settings = settings

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply:
        payload: dict[str, Any] = {
            "model": self.settings.llm_model,
            "messages": messages,
            "temperature": 0.2,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
        headers = {
            "Authorization": f"Bearer {self.settings.llm_api_key}",
            "Content-Type": "application/json",
        }
        url = self.settings.llm_base_url.rstrip("/") + "/chat/completions"
        async with httpx.AsyncClient(timeout=self.settings.llm_timeout_seconds) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
        message = data["choices"][0]["message"]
        calls: list[ProviderToolCall] = []
        for call in message.get("tool_calls") or []:
            raw_arguments = call.get("function", {}).get("arguments") or "{}"
            try:
                arguments = json.loads(raw_arguments)
            except json.JSONDecodeError:
                arguments = {"raw": raw_arguments}
            calls.append(
                ProviderToolCall(
                    id=call.get("id", "tool-call"),
                    name=call.get("function", {}).get("name", ""),
                    arguments=arguments,
                )
            )
        return ProviderReply(content=message.get("content") or "", tool_calls=calls)
