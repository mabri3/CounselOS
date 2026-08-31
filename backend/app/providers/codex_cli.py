from __future__ import annotations

import asyncio
import json
import shutil
import subprocess
import tempfile
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from app.providers.base import ProviderCatalogEntry, ProviderModel, ProviderReply, ProviderToolCall
from app.providers.catalog import (
    MAX_CATALOG_MODELS,
    MAX_EVENTS,
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


_CODEX_CONFIG = {
    "features": {
        "apps": False,
        "browser_use": False,
        "computer_use": False,
        "goals": False,
        "hooks": False,
        "image_generation": False,
        "in_app_browser": False,
        "multi_agent": False,
        "plugins": False,
        "remote_plugin": False,
        "shell_tool": False,
        "unified_exec": False,
        "workspace_dependencies": False,
    },
    "tools": {"view_image": False},
    "web_search": "disabled",
}
_FORBIDDEN_ITEMS = {
    "commandExecution", "fileChange", "mcpToolCall", "webSearch", "imageView",
    "collabToolCall", "computerUse", "shellCommand",
}


class _AppServerFailure(RuntimeError):
    def __init__(self, message: str, *, turn_started: bool = False) -> None:
        super().__init__(message)
        self.turn_started = turn_started


@dataclass
class _PendingResponse:
    event: threading.Event = field(default_factory=threading.Event)
    value: dict[str, Any] | None = None
    error: bool = False


@dataclass
class _PendingTurn:
    thread_id: str
    turn_id: str
    allowed: dict[str, dict[str, Any]]
    event: threading.Event = field(default_factory=threading.Event)
    text: str = ""
    calls: list[ProviderToolCall] = field(default_factory=list)
    status: str | None = None
    error: str | None = None
    events: int = 0


class CodexCLIProvider:
    """Persistent, isolated Codex app-server adapter using only host dynamic tools."""

    provider_id = "codex"
    label = "Codex CLI"

    def __init__(
        self,
        model: str,
        *,
        reasoning_effort: str = "",
        command: str = "codex",
        timeout_seconds: float = 120,
        process_factory: Callable[..., subprocess.Popen[str]] = subprocess.Popen,
        command_runner: Callable[..., subprocess.CompletedProcess[str]] = subprocess.run,
    ) -> None:
        if not isinstance(model, str) or not model or len(model) > 256:
            raise ValueError("Codex model is invalid.")
        if not 0 < timeout_seconds <= 600:
            raise ValueError("Codex timeout is invalid.")
        reasoning_effort = "" if reasoning_effort == "default" else reasoning_effort
        if reasoning_effort and reasoning_effort not in {"low", "medium", "high", "xhigh", "max", "ultra"}:
            raise ValueError("Codex reasoning effort is invalid.")
        self.model = model
        self.reasoning_effort = reasoning_effort
        self.command = command
        self.timeout_seconds = float(timeout_seconds)
        self._process_factory = process_factory
        self._command_runner = command_runner
        self._process: subprocess.Popen[str] | None = None
        self._directory: tempfile.TemporaryDirectory[str] | None = None
        self._reader: threading.Thread | None = None
        self._write_lock = threading.Lock()
        self._state_lock = threading.Lock()
        self._start_lock = threading.Lock()
        self._pending: dict[int, _PendingResponse] = {}
        self._turns: dict[str, _PendingTurn] = {}
        self._early_messages: dict[str, list[dict[str, Any]]] = {}
        self._next_id = 1
        self._closed = False

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply:
        if self._closed:
            raise ProviderAdapterError("Codex CLI provider is closed.")
        bounded_json_bytes(messages, limit=MAX_INPUT_BYTES, label="Provider input")
        prepared_tools, allowed = prepare_tools(tools)
        prompt = self._prompt(messages)
        try:
            return await asyncio.to_thread(self._complete_sync, prompt, prepared_tools, allowed)
        except asyncio.CancelledError:
            self.close()
            raise

    @staticmethod
    def _prompt(messages: list[dict[str, Any]]) -> str:
        parts = [
            "Return useful text or request only the supplied Counsel OS tools. "
            "Do not inspect files, use shell commands, browse, call apps, plugins, MCP, or other tools."
        ]
        for message in messages:
            role = str(message.get("role", "user")).upper()
            content = message.get("content", "")
            if not isinstance(content, str):
                content = json.dumps(content, ensure_ascii=False, separators=(",", ":"))
            parts.append(f"{role}:\n{content}")
        prompt = "\n\n".join(parts)
        if len(prompt.encode("utf-8")) > MAX_INPUT_BYTES:
            raise ProviderAdapterError("Provider input is too large.")
        return prompt

    def _complete_sync(
        self,
        prompt: str,
        tools: list[dict[str, Any]],
        allowed: dict[str, dict[str, Any]],
    ) -> ProviderReply:
        try:
            return self._app_server_complete(prompt, tools, allowed)
        except _AppServerFailure as exc:
            if exc.turn_started:
                raise ProviderAdapterError("Codex app-server failed after the turn started; the turn was not replayed.") from exc
            self._stop_server()
            return self._exec_fallback(prompt, allowed)

    def _ensure_server(self) -> None:
        with self._start_lock:
            if self._closed:
                raise _AppServerFailure("Codex CLI provider is closed.")
            if self._process is not None and self._process.poll() is None:
                return
            self._directory = tempfile.TemporaryDirectory(prefix="counsel-os-codex-")
            try:
                self._process = self._process_factory(
                    [self.command, "app-server", "--stdio"],
                    cwd=self._directory.name,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.DEVNULL,
                    text=True,
                    bufsize=1,
                )
            except OSError as exc:
                self._process = None
                self._cleanup_directory()
                raise _AppServerFailure("Codex app-server could not start.") from exc
            if self._process.stdin is None or self._process.stdout is None:
                raise _AppServerFailure("Codex app-server did not provide stdio.")
            self._reader = threading.Thread(target=self._read_loop, name="counsel-os-codex", daemon=True)
            self._reader.start()
            self._rpc("initialize", {
                "clientInfo": {"name": "counsel-os", "title": "Counsel OS", "version": "1"},
                "capabilities": {"experimentalApi": True},
            })
            self._write({"method": "initialized", "params": {}})

    def _write(self, message: dict[str, Any]) -> None:
        process = self._process
        if process is None or process.poll() is not None or process.stdin is None:
            raise _AppServerFailure("Codex app-server is not running.")
        encoded = bounded_json_bytes(message, limit=MAX_INPUT_BYTES, label="Codex request").decode("utf-8")
        try:
            with self._write_lock:
                process.stdin.write(encoded + "\n")
                process.stdin.flush()
        except OSError as exc:
            raise _AppServerFailure("Codex app-server write failed.") from exc

    def _rpc(self, method: str, params: dict[str, Any], *, turn_started: bool = False) -> dict[str, Any]:
        with self._state_lock:
            request_id = self._next_id
            self._next_id += 1
            pending = _PendingResponse()
            self._pending[request_id] = pending
        try:
            self._write({"id": request_id, "method": method, "params": params})
            if not pending.event.wait(self.timeout_seconds):
                raise _AppServerFailure("Codex app-server timed out.", turn_started=turn_started)
            if pending.error:
                raise _AppServerFailure("Codex app-server rejected the request.", turn_started=turn_started)
            return pending.value or {}
        finally:
            with self._state_lock:
                self._pending.pop(request_id, None)

    def _read_loop(self) -> None:
        process = self._process
        try:
            assert process is not None and process.stdout is not None
            for line in process.stdout:
                if len(line.encode("utf-8")) > MAX_OUTPUT_BYTES:
                    self._fail_all("Codex app-server output was too large.")
                    return
                try:
                    message = json.loads(line)
                except json.JSONDecodeError:
                    self._fail_all("Codex app-server output was malformed.")
                    return
                if not isinstance(message, dict):
                    self._fail_all("Codex app-server output was malformed.")
                    return
                if message.get("method") == "item/tool/call" and "id" in message:
                    self._handle_tool_request(message)
                    continue
                request_id = message.get("id")
                if isinstance(request_id, int):
                    with self._state_lock:
                        pending = self._pending.get(request_id)
                    if pending:
                        pending.error = "error" in message
                        value = message.get("result")
                        pending.value = value if isinstance(value, dict) else {}
                        pending.event.set()
                    continue
                self._handle_event(message)
        except Exception:
            self._fail_all("Codex app-server reader failed.")
            return
        self._fail_all("Codex app-server closed.")

    def _handle_tool_request(self, message: dict[str, Any]) -> None:
        params = message.get("params")
        turn_id = params.get("turnId") if isinstance(params, dict) else None
        with self._state_lock:
            pending = self._turns.get(turn_id) if isinstance(turn_id, str) else None
            if pending is None and isinstance(turn_id, str):
                if turn_id not in self._early_messages and len(self._early_messages) >= 64:
                    return
                buffered = self._early_messages.setdefault(turn_id, [])
                if len(buffered) < 256:
                    buffered.append(message)
                return
        success = False
        if pending is not None:
            try:
                call = normalize_tool_call(
                    call_id=params.get("callId"),
                    name=params.get("tool"),
                    arguments=params.get("arguments"),
                    allowed=pending.allowed,
                )
                if len(pending.calls) >= 64:
                    raise ProviderAdapterError("Provider requested too many tools.")
                pending.calls.append(call)
                success = True
            except ProviderAdapterError as exc:
                pending.error = str(exc)
                pending.event.set()
        try:
            self._write({
                "id": message["id"],
                "result": {
                    "contentItems": [{"type": "inputText", "text": "Tool request captured for the Counsel OS host."}],
                    "success": success,
                },
            })
        except _AppServerFailure:
            if pending is not None:
                pending.error = "Codex app-server tool response failed."
                pending.event.set()

    def _handle_event(self, message: dict[str, Any]) -> None:
        params = message.get("params")
        if not isinstance(params, dict):
            return
        turn_id = params.get("turnId")
        if not isinstance(turn_id, str):
            turn = params.get("turn")
            turn_id = turn.get("id") if isinstance(turn, dict) else None
        if not isinstance(turn_id, str):
            return
        with self._state_lock:
            pending = self._turns.get(turn_id)
        if pending is None:
            with self._state_lock:
                if turn_id not in self._early_messages and len(self._early_messages) >= 64:
                    return
                buffered = self._early_messages.setdefault(turn_id, [])
                if len(buffered) < 256:
                    buffered.append(message)
            return
        self._apply_event(pending, message)

    @staticmethod
    def _apply_event(pending: _PendingTurn, message: dict[str, Any]) -> None:
        params = message.get("params")
        if not isinstance(params, dict):
            return
        pending.events += 1
        if pending.events > MAX_EVENTS:
            pending.error = "Codex app-server returned too many events."
            pending.event.set()
            return
        method = message.get("method")
        item = params.get("item")
        if isinstance(item, dict) and item.get("type") in _FORBIDDEN_ITEMS:
            pending.error = "Codex requested a disabled external tool."
            pending.event.set()
            return
        if method == "item/agentMessage/delta":
            pending.text += str(params.get("delta", ""))
        elif method == "item/completed" and isinstance(item, dict) and item.get("type") == "agentMessage":
            pending.text = str(item.get("text", pending.text))
        elif method == "turn/completed":
            turn = params.get("turn")
            if isinstance(turn, dict):
                pending.status = str(turn.get("status", "completed"))
                if turn.get("error"):
                    pending.error = "Codex turn failed."
            pending.event.set()
        if len(pending.text.encode("utf-8")) > MAX_OUTPUT_BYTES:
            pending.error = "Codex response was too large."
            pending.event.set()

    def _fail_all(self, detail: str) -> None:
        with self._state_lock:
            responses = list(self._pending.values())
            turns = list(self._turns.values())
            self._early_messages.clear()
        for response in responses:
            response.error = True
            response.event.set()
        for turn in turns:
            turn.error = detail
            turn.event.set()

    def _app_server_complete(
        self,
        prompt: str,
        tools: list[dict[str, Any]],
        allowed: dict[str, dict[str, Any]],
    ) -> ProviderReply:
        self._ensure_server()
        assert self._directory is not None
        call_dir = tempfile.mkdtemp(prefix="call-", dir=self._directory.name)
        dynamic_tools = [
            {
                "type": "function",
                "name": item["function"]["name"],
                "description": item["function"]["description"],
                "inputSchema": item["function"]["parameters"],
                "deferLoading": False,
            }
            for item in tools
        ]
        thread_result = self._rpc("thread/start", {
            "model": self.model,
            "cwd": call_dir,
            "sandbox": "read-only",
            "approvalPolicy": "never",
            "ephemeral": True,
            "baseInstructions": "Use only supplied Counsel OS tools. Do not inspect files or use external tools.",
            "developerInstructions": "",
            "config": _CODEX_CONFIG,
            "dynamicTools": dynamic_tools,
        })
        thread = thread_result.get("thread")
        thread_id = thread.get("id") if isinstance(thread, dict) else None
        if not isinstance(thread_id, str) or not thread_id:
            raise _AppServerFailure("Codex thread did not start.")
        turn_params: dict[str, Any] = {
            "threadId": thread_id,
            "input": [{"type": "text", "text": prompt}],
            "model": self.model,
            "cwd": call_dir,
        }
        if self.reasoning_effort:
            turn_params["effort"] = self.reasoning_effort
        turn_result = self._rpc("turn/start", turn_params, turn_started=True)
        turn = turn_result.get("turn")
        turn_id = turn.get("id") if isinstance(turn, dict) else None
        if not isinstance(turn_id, str) or not turn_id:
            raise _AppServerFailure("Codex turn did not start.", turn_started=True)
        pending = _PendingTurn(thread_id, turn_id, allowed)
        with self._state_lock:
            self._turns[turn_id] = pending
            early = self._early_messages.pop(turn_id, [])
        for message in early:
            if message.get("method") == "item/tool/call" and "id" in message:
                self._handle_tool_request(message)
            else:
                self._apply_event(pending, message)
        try:
            if not pending.event.wait(self.timeout_seconds):
                self.close()
                raise _AppServerFailure("Codex turn timed out.", turn_started=True)
            if pending.error or pending.status not in {None, "completed"}:
                raise _AppServerFailure(pending.error or "Codex turn failed.", turn_started=True)
            if not pending.text and not pending.calls:
                raise _AppServerFailure("Codex response was empty.", turn_started=True)
            return ProviderReply(content=pending.text, tool_calls=pending.calls)
        finally:
            with self._state_lock:
                self._turns.pop(turn_id, None)
                self._early_messages.pop(turn_id, None)

    def _exec_fallback(self, prompt: str, allowed: dict[str, dict[str, Any]]) -> ProviderReply:
        schema: dict[str, Any] = {
            "type": "object",
            "properties": {
                "content": {"type": "string"},
                "tool_calls": {"type": "array", "maxItems": 64, "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"}, "name": {"type": "string"}, "arguments": {"type": "object"},
                    },
                    "required": ["name", "arguments"], "additionalProperties": False,
                }},
            },
            "required": ["content", "tool_calls"],
            "additionalProperties": False,
        }
        with tempfile.TemporaryDirectory(prefix="counsel-os-codex-exec-") as directory:
            schema_path = Path(directory) / "schema.json"
            output_path = Path(directory) / "output.json"
            schema_path.write_text(json.dumps(schema, separators=(",", ":")), encoding="utf-8")
            command = [
                self.command, "exec", "--ephemeral", "--ignore-user-config", "--ignore-rules",
                "--skip-git-repo-check", "--sandbox", "read-only", "--color", "never", "--model", self.model,
            ]
            if self.reasoning_effort:
                command.extend(["-c", f'model_reasoning_effort="{self.reasoning_effort}"'])
            command.extend(["--output-schema", str(schema_path), "--output-last-message", str(output_path), "-"])
            try:
                completed = self._command_runner(
                    command, cwd=directory, input=prompt, capture_output=True, text=True,
                    timeout=self.timeout_seconds, check=False,
                )
            except (OSError, subprocess.SubprocessError) as exc:
                raise ProviderAdapterError("Codex CLI is unavailable or not signed in.") from exc
            if completed.returncode != 0:
                raise ProviderAdapterError("Codex CLI is unavailable or not signed in.")
            try:
                raw = output_path.read_bytes() if output_path.exists() else completed.stdout.encode("utf-8")
            except OSError as exc:
                raise ProviderAdapterError("Codex CLI output was unavailable.") from exc
            payload = parse_bounded_json(raw, limit=MAX_OUTPUT_BYTES, label="Codex response")
        if not isinstance(payload, dict) or not isinstance(payload.get("content"), str) or not isinstance(payload.get("tool_calls"), list):
            raise ProviderAdapterError("Codex response is malformed.")
        calls = []
        for call in payload["tool_calls"]:
            if not isinstance(call, dict):
                raise ProviderAdapterError("Codex response is malformed.")
            calls.append(normalize_tool_call(
                call_id=call.get("id"), name=call.get("name"), arguments=call.get("arguments"), allowed=allowed,
            ))
        if not payload["content"] and not calls:
            raise ProviderAdapterError("Codex response is empty.")
        return ProviderReply(content=payload["content"], tool_calls=calls)

    def close(self) -> None:
        with self._start_lock:
            self._closed = True
            self._stop_server_locked()

    def _stop_server(self) -> None:
        with self._start_lock:
            self._stop_server_locked()

    def _stop_server_locked(self) -> None:
        process = self._process
        self._process = None
        if process is not None and process.poll() is None:
            try:
                process.terminate()
                process.wait(timeout=2)
            except Exception:
                try:
                    process.kill()
                except Exception:
                    pass
        self._cleanup_directory()

    def _cleanup_directory(self) -> None:
        directory = self._directory
        self._directory = None
        if directory is not None:
            directory.cleanup()

    @classmethod
    async def catalog(
        cls,
        *,
        command: str = "codex",
        timeout_seconds: float = 15,
        process_factory: Callable[..., subprocess.Popen[str]] = subprocess.Popen,
        saved_model: str | None = None,
    ) -> ProviderCatalogEntry:
        if process_factory is subprocess.Popen and shutil.which(command) is None:
            return unavailable_catalog(cls.provider_id, cls.label, "missing", "Codex CLI is not installed.", saved_model=saved_model)
        provider = cls(
            saved_model or "catalog", command=command, timeout_seconds=timeout_seconds,
            process_factory=process_factory,
        )
        try:
            models = await asyncio.to_thread(provider._list_models)
            return ProviderCatalogEntry(
                id=cls.provider_id,
                label=cls.label,
                readiness="ready",
                readiness_detail="Codex CLI is installed and signed in.",
                models=tuple(models),
            )
        except asyncio.CancelledError:
            provider.close()
            raise
        except Exception:
            return unavailable_catalog(
                cls.provider_id, cls.label, "unavailable",
                "Codex CLI is not signed in or its model catalog is unavailable.",
                saved_model=saved_model,
            )
        finally:
            provider.close()

    def _list_models(self) -> list[ProviderModel]:
        self._ensure_server()
        result: list[ProviderModel] = []
        cursor: str | None = None
        pages = 0
        seen: set[str] = set()
        while True:
            params: dict[str, Any] = {"limit": 100, "includeHidden": False}
            if cursor:
                params["cursor"] = cursor
            payload = self._rpc("model/list", params)
            data = payload.get("data")
            if not isinstance(data, list):
                raise ProviderAdapterError("Codex model catalog is malformed.")
            for item in data:
                if not isinstance(item, dict):
                    raise ProviderAdapterError("Codex model catalog is malformed.")
                model = item.get("model") or item.get("id")
                label = item.get("displayName") or model
                if not isinstance(model, str) or not model or not isinstance(label, str) or model in seen:
                    raise ProviderAdapterError("Codex model catalog is malformed.")
                seen.add(model)
                raw_efforts = item.get("supportedReasoningEfforts", [])
                efforts = reasoning_efforts(raw_efforts)
                result.append(ProviderModel(model, label, ("default", *[effort for effort in efforts if effort != "default"])))
                if len(result) > MAX_CATALOG_MODELS:
                    raise ProviderAdapterError("Codex model catalog is too large.")
            cursor = payload.get("nextCursor")
            pages += 1
            if cursor is None:
                break
            if not isinstance(cursor, str) or not cursor or pages > 10:
                raise ProviderAdapterError("Codex model catalog is malformed.")
        if not result:
            raise ProviderAdapterError("Codex model catalog is empty.")
        return sorted(result, key=lambda item: item.id)
