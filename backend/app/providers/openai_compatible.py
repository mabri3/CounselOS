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

    @staticmethod
    async def available_models(settings: Settings) -> list[dict[str, Any]]:
        """Return model choices advertised by the configured compatible endpoint."""
        if not settings.llm_api_key:
            return []
        url = settings.llm_base_url.rstrip("/") + "/models"
        headers = {"Authorization": f"Bearer {settings.llm_api_key}"}
        async with httpx.AsyncClient(timeout=min(settings.llm_timeout_seconds, 10)) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
        models = data.get("data", []) if isinstance(data, dict) else []
        choices: list[dict[str, Any]] = []
        allowed_efforts = {"none", "minimal", "low", "medium", "high", "xhigh", "max"}
        for model in models:
            if not isinstance(model, dict) or not model.get("id"):
                continue
            metadata = model.get("metadata") if isinstance(model.get("metadata"), dict) else {}
            reasoning = metadata.get("reasoning") if isinstance(metadata.get("reasoning"), dict) else {}
            supported = reasoning.get("supported_efforts", [])
            efforts = [
                str(effort)
                for effort in supported
                if str(effort) in allowed_efforts
            ] if isinstance(supported, list) else []
            choices.append(
                {
                    "id": str(model["id"]),
                    "label": str(metadata.get("display_name") or model["id"]),
                    "efforts": ["default", *dict.fromkeys(efforts)],
                }
            )
        return sorted(choices, key=lambda choice: str(choice["id"]))

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
        if self.settings.llm_reasoning_effort:
            payload["reasoning_effort"] = self.settings.llm_reasoning_effort
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
