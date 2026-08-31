from __future__ import annotations

import json
import re
from collections.abc import Mapping
from typing import Any

from app.providers.base import ProviderCatalogEntry, ProviderModel, ProviderToolCall


MAX_INPUT_BYTES = 1 * 1024 * 1024
MAX_OUTPUT_BYTES = 4 * 1024 * 1024
MAX_CATALOG_BYTES = 2 * 1024 * 1024
MAX_CATALOG_MODELS = 200
MAX_TOOL_ARGUMENT_BYTES = 256 * 1024
MAX_TOOLS = 64
MAX_EVENTS = 10_000
_TOOL_NAME = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
_EFFORTS = frozenset({"default", "none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"})


class ProviderAdapterError(RuntimeError):
    """A provider failed without exposing provider-controlled or secret data."""


def bounded_json_bytes(value: Any, *, limit: int, label: str) -> bytes:
    try:
        encoded = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    except (TypeError, ValueError) as exc:
        raise ProviderAdapterError(f"{label} is not valid JSON.") from exc
    if len(encoded) > limit:
        raise ProviderAdapterError(f"{label} is too large.")
    return encoded


def parse_bounded_json(raw: bytes | str, *, limit: int, label: str) -> Any:
    encoded = raw.encode("utf-8") if isinstance(raw, str) else raw
    if len(encoded) > limit:
        raise ProviderAdapterError(f"{label} is too large.")
    try:
        return json.loads(encoded)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ProviderAdapterError(f"{label} is malformed.") from exc


def prepare_tools(tools: list[dict[str, Any]] | None) -> tuple[list[dict[str, Any]], dict[str, dict[str, Any]]]:
    if tools is None:
        return [], {}
    if not isinstance(tools, list) or len(tools) > MAX_TOOLS:
        raise ProviderAdapterError("Tool definitions are invalid.")
    prepared: list[dict[str, Any]] = []
    by_name: dict[str, dict[str, Any]] = {}
    for item in tools:
        function = item.get("function") if isinstance(item, dict) else None
        name = function.get("name") if isinstance(function, dict) else None
        description = function.get("description", "") if isinstance(function, dict) else ""
        parameters = function.get("parameters", {"type": "object"}) if isinstance(function, dict) else None
        if (
            item.get("type") != "function"
            or not isinstance(name, str)
            or not _TOOL_NAME.fullmatch(name)
            or name in by_name
            or not isinstance(description, str)
            or len(description) > 8_192
            or not isinstance(parameters, dict)
        ):
            raise ProviderAdapterError("Tool definitions are invalid.")
        bounded_json_bytes(parameters, limit=MAX_TOOL_ARGUMENT_BYTES, label="Tool schema")
        normalized = {
            "type": "function",
            "function": {"name": name, "description": description, "parameters": parameters},
        }
        prepared.append(normalized)
        by_name[name] = normalized
    return prepared, by_name


def normalize_tool_call(
    *,
    call_id: Any,
    name: Any,
    arguments: Any,
    allowed: Mapping[str, dict[str, Any]],
) -> ProviderToolCall:
    if not isinstance(name, str) or name not in allowed:
        raise ProviderAdapterError("Provider requested an unknown tool.")
    if isinstance(arguments, str):
        arguments = parse_bounded_json(arguments, limit=MAX_TOOL_ARGUMENT_BYTES, label="Tool arguments")
    else:
        bounded_json_bytes(arguments, limit=MAX_TOOL_ARGUMENT_BYTES, label="Tool arguments")
    if not isinstance(arguments, dict):
        raise ProviderAdapterError("Tool arguments must be a JSON object.")
    identifier = call_id if isinstance(call_id, str) and 0 < len(call_id) <= 256 else "tool-call"
    return ProviderToolCall(id=identifier, name=name, arguments=arguments)


def reasoning_efforts(value: Any) -> tuple[str, ...]:
    if not isinstance(value, list) or len(value) > len(_EFFORTS):
        raise ProviderAdapterError("Model catalog is malformed.")
    result: list[str] = []
    for item in value:
        if isinstance(item, dict):
            item = item.get("reasoningEffort") or item.get("reasoning_effort")
        if not isinstance(item, str) or item not in _EFFORTS:
            raise ProviderAdapterError("Model catalog is malformed.")
        if item not in result:
            result.append(item)
    return tuple(result)


def unavailable_catalog(
    provider_id: str,
    label: str,
    readiness: str,
    detail: str,
    *,
    saved_model: str | None = None,
) -> ProviderCatalogEntry:
    models = (ProviderModel(saved_model, saved_model),) if saved_model else ()
    return ProviderCatalogEntry(
        id=provider_id,
        label=label,
        readiness=readiness,  # type: ignore[arg-type]
        readiness_detail=detail,
        models=models,
    )
