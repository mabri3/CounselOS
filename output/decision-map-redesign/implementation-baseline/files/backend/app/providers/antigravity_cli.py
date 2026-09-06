from __future__ import annotations

import asyncio
import json
import shutil
import tempfile
from pathlib import Path
from typing import Any, Callable

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
    unavailable_catalog,
)


ProcessFactory = Callable[..., Any]


class AntigravityCLIProvider:
    """Development-only, isolated Antigravity headless adapter."""

    provider_id = "antigravity_cli"
    label = "Antigravity CLI"
    warning = "Development only — do not use confidential matter data."

    def __init__(
        self,
        model: str,
        *,
        reasoning_effort: str = "",
        command: str = "agy",
        timeout_seconds: float = 120,
        process_factory: ProcessFactory = asyncio.create_subprocess_exec,
    ) -> None:
        if not isinstance(model, str) or not model or len(model) > 256:
            raise ValueError("Antigravity model is invalid.")
        if not 0 < timeout_seconds <= 600:
            raise ValueError("Antigravity timeout is invalid.")
        reasoning_effort = "" if reasoning_effort == "default" else reasoning_effort
        if reasoning_effort and reasoning_effort not in {"low", "medium", "high"}:
            raise ValueError("Antigravity reasoning effort is invalid.")
        self.model = model
        self.reasoning_effort = reasoning_effort
        self.command = command
        self.timeout_seconds = float(timeout_seconds)
        self._process_factory = process_factory
        self._processes: set[Any] = set()
        self._closed = False

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply:
        if self._closed:
            raise ProviderAdapterError("Antigravity provider is closed.")
        bounded_json_bytes(messages, limit=MAX_INPUT_BYTES, label="Provider input")
        prepared_tools, allowed = prepare_tools(tools)
        schema = self._response_schema(prepared_tools)
        prompt = self._prompt(messages, prepared_tools)
        if len(prompt.encode("utf-8")) > MAX_INPUT_BYTES:
            raise ProviderAdapterError("Provider input is too large.")
        command = [
            self.command,
            "-p",
            prompt,
            "--output-format",
            "json",
            "--model",
            self.model,
            "--print-timeout",
            f"{self.timeout_seconds:g}s",
            "--sandbox",
            "--disable-slash-commands",
            "--json-schema",
            json.dumps(schema, separators=(",", ":")),
        ]
        if self.reasoning_effort:
            command.extend(["--effort", self.reasoning_effort])
        with tempfile.TemporaryDirectory(prefix="themis.ai-antigravity-") as directory:
            try:
                process = await self._process_factory(
                    *command,
                    cwd=directory,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                self._processes.add(process)
                stdout, _stderr = await asyncio.wait_for(process.communicate(), timeout=self.timeout_seconds)
            except asyncio.CancelledError:
                await self._stop_process(locals().get("process"))
                raise
            except asyncio.TimeoutError as exc:
                await self._stop_process(locals().get("process"))
                raise ProviderAdapterError("Antigravity CLI timed out.") from exc
            except OSError as exc:
                raise ProviderAdapterError("Antigravity CLI is unavailable or not signed in.") from exc
            finally:
                if "process" in locals():
                    self._processes.discard(process)
        if process.returncode != 0:
            raise ProviderAdapterError("Antigravity CLI is unavailable or not signed in.")
        envelope = parse_bounded_json(stdout, limit=MAX_OUTPUT_BYTES, label="Antigravity response")
        if not isinstance(envelope, dict) or envelope.get("status") != "SUCCESS":
            raise ProviderAdapterError("Antigravity response is malformed.")
        value = envelope.get("structured_output")
        if value is None:
            response = envelope.get("response")
            if isinstance(response, str) and response.strip():
                try:
                    value = parse_bounded_json(response, limit=MAX_OUTPUT_BYTES, label="Antigravity response")
                except ProviderAdapterError:
                    return ProviderReply(content=response)
            else:
                raise ProviderAdapterError("Antigravity response is empty.")
        return self._parse_value(value, allowed)

    @staticmethod
    def _prompt(messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> str:
        parts = [
            "Do not use terminal, file, browser, app, plugin, MCP, or slash-command tools. "
            "Return useful text in content, or exactly one request for a supplied Themis.ai tool."
        ]
        if tools:
            parts.append("THEMIS.AI TOOLS:\n" + json.dumps(tools, ensure_ascii=False, separators=(",", ":")))
        for message in messages:
            content = message.get("content", "")
            if not isinstance(content, str):
                content = json.dumps(content, ensure_ascii=False, separators=(",", ":"))
            parts.append(f"{str(message.get('role', 'user')).upper()}:\n{content}")
        return "\n\n".join(parts)

    @staticmethod
    def _response_schema(tools: list[dict[str, Any]]) -> dict[str, Any]:
        tool_variants = [
            {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "maxLength": 256},
                    "name": {"const": tool["function"]["name"]},
                    "arguments": tool["function"]["parameters"],
                },
                "required": ["name", "arguments"],
                "additionalProperties": False,
            }
            for tool in tools
        ]
        tool_schema: dict[str, Any] = {"type": "null"}
        if tool_variants:
            tool_schema = {"anyOf": [{"type": "null"}, *tool_variants]}
        return {
            "type": "object",
            "properties": {
                "content": {"type": "string", "maxLength": MAX_OUTPUT_BYTES},
                "tool_call": tool_schema,
            },
            "required": ["content", "tool_call"],
            "additionalProperties": False,
        }

    @staticmethod
    def _parse_value(value: Any, allowed: dict[str, dict[str, Any]]) -> ProviderReply:
        if not isinstance(value, dict) or set(value) - {"content", "tool_call"}:
            raise ProviderAdapterError("Antigravity response is malformed.")
        content = value.get("content", "")
        raw_call = value.get("tool_call")
        if not isinstance(content, str):
            raise ProviderAdapterError("Antigravity response is malformed.")
        calls = []
        if raw_call is not None:
            if not isinstance(raw_call, dict):
                raise ProviderAdapterError("Antigravity response is malformed.")
            calls.append(normalize_tool_call(
                call_id=raw_call.get("id"),
                name=raw_call.get("name"),
                arguments=raw_call.get("arguments"),
                allowed=allowed,
            ))
        if not content and not calls:
            raise ProviderAdapterError("Antigravity response is empty.")
        return ProviderReply(content=content, tool_calls=calls)

    async def _stop_process(self, process: Any | None) -> None:
        if process is None or process.returncode is not None:
            return
        process.kill()
        try:
            await process.wait()
        except Exception:
            pass

    def close(self) -> None:
        self._closed = True
        for process in list(self._processes):
            if process.returncode is None:
                process.kill()
        self._processes.clear()

    @classmethod
    async def catalog(
        cls,
        *,
        command: str = "agy",
        timeout_seconds: float = 15,
        process_factory: ProcessFactory = asyncio.create_subprocess_exec,
        saved_model: str | None = None,
    ) -> ProviderCatalogEntry:
        if process_factory is asyncio.create_subprocess_exec and shutil.which(command) is None:
            return unavailable_catalog(
                cls.provider_id, cls.label, "missing",
                "Antigravity CLI is not installed. " + cls.warning,
                saved_model=saved_model,
            )
        process = None
        try:
            process = await process_factory(
                command, "models",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, _stderr = await asyncio.wait_for(process.communicate(), timeout=timeout_seconds)
            if process.returncode != 0 or len(stdout) > MAX_CATALOG_BYTES:
                raise ProviderAdapterError("Antigravity catalog is unavailable.")
            models: list[ProviderModel] = []
            seen: set[str] = set()
            for raw_line in stdout.decode("utf-8").splitlines():
                line = raw_line.strip()
                if not line:
                    continue
                parts = line.split(None, 1)
                model = parts[0]
                label = parts[1].strip() if len(parts) == 2 else model
                if not model or len(model) > 256 or model in seen:
                    raise ProviderAdapterError("Antigravity catalog is malformed.")
                seen.add(model)
                models.append(ProviderModel(model, label, ("default", "low", "medium", "high")))
                if len(models) > MAX_CATALOG_MODELS:
                    raise ProviderAdapterError("Antigravity catalog is too large.")
            if not models:
                raise ProviderAdapterError("Antigravity catalog is empty.")
            return ProviderCatalogEntry(
                id=cls.provider_id,
                label=cls.label,
                readiness="development_only",
                readiness_detail=cls.warning,
                models=tuple(sorted(models, key=lambda item: item.id)),
            )
        except asyncio.CancelledError:
            if process is not None and process.returncode is None:
                process.kill()
                await process.wait()
            raise
        except Exception:
            if process is not None and process.returncode is None:
                process.kill()
                await process.wait()
            return unavailable_catalog(
                cls.provider_id, cls.label, "unavailable",
                "Antigravity CLI is not signed in or its model catalog is unavailable. " + cls.warning,
                saved_model=saved_model,
            )
