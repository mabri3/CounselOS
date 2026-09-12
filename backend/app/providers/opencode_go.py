from __future__ import annotations

import asyncio
import json
import os
import uuid
from pathlib import Path
from typing import Any

import httpx

from app.providers.base import ProviderCatalogEntry, ProviderModel, ProviderReply
from app.providers.catalog import (
    MAX_CATALOG_BYTES,
    MAX_CATALOG_MODELS,
    MAX_INPUT_BYTES,
    MAX_OUTPUT_BYTES,
    ProviderAdapterError,
    bounded_json_bytes,
    normalize_tool_call,
    parse_bounded_json,
    prepare_tools,
    reasoning_efforts,
    unavailable_catalog,
)


OPENCODE_GO_ENDPOINT = "https://opencode.ai/zen/go/v1"
OPENCODE_GO_PROTOCOLS = {
    "deepseek-v4-flash": "chat",
    "deepseek-v4.1-flash": "chat",
    "minimax-m3": "messages",
}
_DEFAULT_EFFORTS = ("default", "minimal", "low", "medium", "high", "max")
_SELECTABLE_EFFORTS = _DEFAULT_EFFORTS[1:]


def resolve_api_key() -> str | None:
    explicit = os.environ.get("OPENCODE_GO_API_KEY") or os.environ.get("OPENCODE_API_KEY")
    if explicit:
        return explicit
    # Reuse the same provider credential as the installed OpenCode CLI.
    auth_path = Path(os.environ.get("XDG_DATA_HOME", str(Path.home() / ".local/share"))) / "opencode/auth.json"
    try:
        auth = json.loads(auth_path.read_text()).get("opencode-go", {})
        return auth.get("key") if auth.get("type") == "api" and isinstance(auth.get("key"), str) else None
    except (OSError, ValueError, AttributeError):
        return None


class OpenCodeGoProvider:
    """Bounded direct adapter for the two catalog-verified OpenCode Go protocols."""

    provider_id = "opencode_go"
    label = "OpenCode Go"

    def __init__(
        self,
        model: str,
        *,
        reasoning_effort: str = "",
        api_key: str | None = None,
        timeout_seconds: float = 120,
        client: Any | None = None,
    ) -> None:
        normalized = model.removeprefix("opencode-go/")
        if normalized not in OPENCODE_GO_PROTOCOLS:
            raise ValueError("OpenCode Go model is not supported by a known protocol.")
        if not 0 < timeout_seconds <= 600:
            raise ValueError("OpenCode Go timeout is invalid.")
        reasoning_effort = "" if reasoning_effort == "default" else reasoning_effort
        if reasoning_effort and reasoning_effort not in _SELECTABLE_EFFORTS:
            raise ValueError("OpenCode Go reasoning effort is invalid.")
        if reasoning_effort and OPENCODE_GO_PROTOCOLS[normalized] == "messages":
            raise ValueError("This OpenCode Go model does not support reasoning effort.")
        self._session_id = str(uuid.uuid4())
        self.model = normalized
        self.reasoning_effort = reasoning_effort
        self.api_key = api_key or resolve_api_key()
        self.timeout_seconds = float(timeout_seconds)
        self._client = client or httpx.AsyncClient(timeout=self.timeout_seconds)
        self._owns_client = client is None
        self._closed = False

    async def close(self) -> None:
        if self._closed:
            return
        self._closed = True
        if self._owns_client:
            await self._client.aclose()

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply:
        if self._closed:
            raise ProviderAdapterError("OpenCode Go provider is closed.")
        if not self.api_key:
            raise ProviderAdapterError("OpenCode Go credentials are missing.")
        bounded_json_bytes(messages, limit=MAX_INPUT_BYTES, label="Provider input")
        prepared_tools, allowed = prepare_tools(tools)
        protocol = OPENCODE_GO_PROTOCOLS[self.model]
        if protocol == "chat":
            path, payload = self._chat_payload(messages, prepared_tools)
        else:
            path, payload = self._messages_payload(messages, prepared_tools)
        try:
            response = await self._client.post(
                OPENCODE_GO_ENDPOINT + path,
                headers=self._headers(protocol),
                json=payload,
                timeout=self.timeout_seconds,
            )
            response.raise_for_status()
            raw = response.content
        except asyncio.CancelledError:
            raise
        except (httpx.HTTPError, OSError) as exc:
            raise ProviderAdapterError("OpenCode Go request failed.") from exc
        if self.api_key.encode("utf-8") in raw:
            raise ProviderAdapterError("OpenCode Go response was rejected.")
        data = parse_bounded_json(raw, limit=MAX_OUTPUT_BYTES, label="OpenCode Go response")
        if not isinstance(data, dict):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        return self._parse_chat(data, allowed) if protocol == "chat" else self._parse_messages(data, allowed)

    def _headers(self, protocol: str) -> dict[str, str]:
        assert self.api_key
        from app.providers.base import provider_session_id
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json",
                   "User-Agent": "CounselOS/0.1", "x-opencode-session": provider_session_id.get() or self._session_id}
        if protocol == "messages":
            headers.update({"x-api-key": self.api_key, "anthropic-version": "2023-06-01"})
        return headers

    def _chat_payload(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> tuple[str, dict[str, Any]]:
        payload: dict[str, Any] = {"model": self.model, "messages": messages}
        if tools:
            payload.update({"tools": tools, "tool_choice": "auto"})
        if self.reasoning_effort:
            payload["reasoning_effort"] = self.reasoning_effort
        return "/chat/completions", payload

    def _messages_payload(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> tuple[str, dict[str, Any]]:
        system = "\n\n".join(
            str(message.get("content", "")) for message in messages if message.get("role") == "system"
        )
        payload: dict[str, Any] = {
            "model": self.model,
            "max_tokens": 8192,
            "messages": self._messages_history(messages),
        }
        if system:
            payload["system"] = system
        if tools:
            payload["tools"] = [
                {
                    "name": item["function"]["name"],
                    "description": item["function"]["description"],
                    "input_schema": item["function"]["parameters"],
                }
                for item in tools
            ]
        return "/messages", payload

    @staticmethod
    def _messages_history(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        history: list[dict[str, Any]] = []

        def append(role: str, content: str | list[dict[str, Any]]) -> None:
            if history and history[-1]["role"] == role:
                previous = history[-1]["content"]
                previous_blocks = previous if isinstance(previous, list) else [{"type": "text", "text": previous}]
                next_blocks = content if isinstance(content, list) else [{"type": "text", "text": content}]
                history[-1]["content"] = [*previous_blocks, *next_blocks]
            else:
                history.append({"role": role, "content": content})

        for message in messages:
            role = message.get("role")
            if role == "system":
                continue
            if role == "tool":
                call_id = message.get("tool_call_id")
                if not isinstance(call_id, str) or not call_id:
                    raise ProviderAdapterError("OpenCode Go tool result is malformed.")
                content = message.get("content", "")
                rendered = content if isinstance(content, str) else json.dumps(content, separators=(",", ":"))
                append("user", [{"type": "tool_result", "tool_use_id": call_id, "content": rendered}])
                continue
            if role not in {"user", "assistant"}:
                raise ProviderAdapterError("OpenCode Go message history is malformed.")
            content = message.get("content")
            tool_calls = message.get("tool_calls") or []
            if role == "assistant" and tool_calls:
                if not isinstance(tool_calls, list):
                    raise ProviderAdapterError("OpenCode Go tool history is malformed.")
                blocks: list[dict[str, Any]] = []
                if isinstance(content, str) and content:
                    blocks.append({"type": "text", "text": content})
                for call in tool_calls:
                    function = call.get("function") if isinstance(call, dict) else None
                    call_id = call.get("id") if isinstance(call, dict) else None
                    if not isinstance(function, dict) or not isinstance(call_id, str):
                        raise ProviderAdapterError("OpenCode Go tool history is malformed.")
                    arguments = function.get("arguments", {})
                    if isinstance(arguments, str):
                        try:
                            arguments = json.loads(arguments)
                        except json.JSONDecodeError as exc:
                            raise ProviderAdapterError("OpenCode Go tool history is malformed.") from exc
                    if not isinstance(arguments, dict) or not isinstance(function.get("name"), str):
                        raise ProviderAdapterError("OpenCode Go tool history is malformed.")
                    blocks.append({
                        "type": "tool_use", "id": call_id,
                        "name": function["name"], "input": arguments,
                    })
                append("assistant", blocks)
                continue
            if not isinstance(content, str):
                raise ProviderAdapterError("OpenCode Go message history is malformed.")
            append(role, content)
        return history

    @staticmethod
    def _parse_chat(data: dict[str, Any], allowed: dict[str, dict[str, Any]]) -> ProviderReply:
        choices = data.get("choices")
        if not isinstance(choices, list) or len(choices) != 1 or not isinstance(choices[0], dict):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        message = choices[0].get("message")
        if not isinstance(message, dict):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        content = message.get("content") or ""
        if isinstance(content, list):
            if any(not isinstance(part, dict) or part.get("type") != "text" or not isinstance(part.get("text"), str) for part in content):
                raise ProviderAdapterError("OpenCode Go response is malformed.")
            content = "".join(part["text"] for part in content)
        if not isinstance(content, str):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        raw_calls = message.get("tool_calls") or []
        if not isinstance(raw_calls, list) or (raw_calls and not allowed):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        calls = []
        for raw_call in raw_calls:
            function = raw_call.get("function") if isinstance(raw_call, dict) else None
            if not isinstance(function, dict):
                raise ProviderAdapterError("OpenCode Go response is malformed.")
            calls.append(normalize_tool_call(
                call_id=raw_call.get("id"),
                name=function.get("name"),
                arguments=function.get("arguments", "{}"),
                allowed=allowed,
            ))
        if not content and not calls:
            raise ProviderAdapterError("OpenCode Go response is empty.")
        return ProviderReply(content=content, tool_calls=calls)

    @staticmethod
    def _parse_messages(data: dict[str, Any], allowed: dict[str, dict[str, Any]]) -> ProviderReply:
        content = data.get("content")
        if not isinstance(content, list):
            raise ProviderAdapterError("OpenCode Go response is malformed.")
        text: list[str] = []
        calls = []
        for part in content:
            if not isinstance(part, dict):
                raise ProviderAdapterError("OpenCode Go response is malformed.")
            if part.get("type") == "text" and isinstance(part.get("text"), str):
                text.append(part["text"])
            elif part.get("type") == "tool_use":
                calls.append(normalize_tool_call(
                    call_id=part.get("id"),
                    name=part.get("name"),
                    arguments=part.get("input", {}),
                    allowed=allowed,
                ))
            else:
                raise ProviderAdapterError("OpenCode Go response is malformed.")
        rendered = "".join(text)
        if not rendered and not calls:
            raise ProviderAdapterError("OpenCode Go response is empty.")
        return ProviderReply(content=rendered, tool_calls=calls)

    @classmethod
    async def catalog(
        cls,
        *,
        api_key: str | None = None,
        timeout_seconds: float = 10,
        client: Any | None = None,
        saved_model: str | None = None,
    ) -> ProviderCatalogEntry:
        key = api_key or resolve_api_key()
        if not key:
            return unavailable_catalog(cls.provider_id, cls.label, "missing", "API key is not configured.", saved_model=saved_model)
        owns_client = client is None
        active_client = client or httpx.AsyncClient(timeout=timeout_seconds)
        try:
            response = await active_client.get(
                OPENCODE_GO_ENDPOINT + "/models",
                headers={"Authorization": f"Bearer {key}"},
                timeout=timeout_seconds,
            )
            response.raise_for_status()
            raw = response.content
            if key.encode("utf-8") in raw:
                raise ProviderAdapterError("Model catalog was rejected.")
            payload = parse_bounded_json(raw, limit=MAX_CATALOG_BYTES, label="Model catalog")
            data = payload.get("data") if isinstance(payload, dict) else None
            if not isinstance(data, list) or not data or len(data) > MAX_CATALOG_MODELS:
                raise ProviderAdapterError("Model catalog is malformed.")
            models: list[ProviderModel] = []
            seen: set[str] = set()
            for item in data:
                if not isinstance(item, dict) or not isinstance(item.get("id"), str):
                    raise ProviderAdapterError("Model catalog is malformed.")
                model_id = item["id"].removeprefix("opencode-go/")
                if model_id in seen:
                    raise ProviderAdapterError("Model catalog is malformed.")
                seen.add(model_id)
                if model_id not in OPENCODE_GO_PROTOCOLS or item.get("hidden", False) is True:
                    continue
                raw_efforts = item.get("reasoning_efforts", item.get("supported_reasoning_efforts"))
                efforts = reasoning_efforts(raw_efforts) if raw_efforts is not None else _DEFAULT_EFFORTS
                if OPENCODE_GO_PROTOCOLS[model_id] == "messages":
                    efforts = ("default",)
                elif not efforts or efforts[0] != "default":
                    efforts = ("default", *efforts)
                label = item.get("display_name", item.get("name", model_id))
                if not isinstance(label, str):
                    raise ProviderAdapterError("Model catalog is malformed.")
                models.append(ProviderModel(model_id, label, efforts))
            if not models:
                raise ProviderAdapterError("Model catalog has no supported models.")
            return ProviderCatalogEntry(
                id=cls.provider_id,
                label=cls.label,
                readiness="ready",
                readiness_detail="API key and model catalog are available.",
                models=tuple(sorted(models, key=lambda item: item.id)),
            )
        except asyncio.CancelledError:
            raise
        except Exception:
            return unavailable_catalog(
                cls.provider_id,
                cls.label,
                "unavailable",
                "Model catalog is unavailable.",
                saved_model=saved_model,
            )
        finally:
            if owns_client:
                await active_client.aclose()
