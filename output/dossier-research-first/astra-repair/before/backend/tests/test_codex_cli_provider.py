from __future__ import annotations

import tempfile
import threading
import time

import pytest

from app.providers.catalog import ProviderAdapterError, normalize_tool_call, prepare_tools
from app.providers.codex_cli import CodexCLIProvider, _AppServerFailure
from tests.test_provider_conformance import TOOLS


@pytest.mark.asyncio
async def test_app_server_uses_only_dynamic_tools_and_normalizes_multiple_calls(monkeypatch):
    provider = CodexCLIProvider("gpt-test")
    provider._directory = tempfile.TemporaryDirectory(prefix="codex-test-")
    captured = []
    monkeypatch.setattr(provider, "_ensure_server", lambda: None)
    _prepared, allowed = prepare_tools(TOOLS)

    def rpc(method, params, **_kwargs):
        captured.append((method, params))
        if method == "thread/start":
            return {"thread": {"id": "thread"}}
        if method == "turn/start":
            def finish():
                for _ in range(100):
                    pending = provider._turns.get("turn")
                    if pending:
                        pending.text = "Useful"
                        pending.calls.extend([
                            normalize_tool_call(call_id="a", name="save_fact", arguments={"fact": "A"}, allowed=allowed),
                            normalize_tool_call(call_id="b", name="save_fact", arguments={"fact": "B"}, allowed=allowed),
                        ])
                        pending.status = "completed"
                        pending.event.set()
                        return
                    time.sleep(0.001)
            threading.Thread(target=finish, daemon=True).start()
            return {"turn": {"id": "turn"}}
        raise AssertionError(method)

    monkeypatch.setattr(provider, "_rpc", rpc)

    reply = await provider.complete([{"role": "user", "content": "Go"}], TOOLS)

    assert reply.content == "Useful"
    assert len(reply.tool_calls) == 2
    thread_params = captured[0][1]
    assert thread_params["sandbox"] == "read-only"
    assert [tool["name"] for tool in thread_params["dynamicTools"]] == ["save_fact"]
    assert thread_params["config"]["features"]["shell_tool"] is False
    provider.close()


@pytest.mark.asyncio
async def test_closed_provider_cannot_restart(monkeypatch):
    provider = CodexCLIProvider("gpt-test")
    provider.close()
    monkeypatch.setattr(
        provider,
        "_complete_sync",
        lambda *_args: (_ for _ in ()).throw(AssertionError("closed provider restarted")),
    )

    with pytest.raises(ProviderAdapterError, match="closed"):
        await provider.complete([{"role": "user", "content": "Go"}])


def test_rpc_timeout_is_bounded_and_does_not_expose_request(monkeypatch):
    provider = CodexCLIProvider("gpt-test", timeout_seconds=0.01)
    monkeypatch.setattr(provider, "_write", lambda _message: None)

    with pytest.raises(_AppServerFailure, match="timed out") as caught:
        provider._rpc("secret-method", {"secret": "value"})

    assert "secret-method" not in str(caught.value)


def test_failure_after_turn_start_is_not_replayed(monkeypatch):
    called = False
    provider = CodexCLIProvider("gpt-test")
    monkeypatch.setattr(
        provider, "_app_server_complete",
        lambda *_args: (_ for _ in ()).throw(_AppServerFailure("secret", turn_started=True)),
    )

    def fallback(*_args):
        nonlocal called
        called = True

    monkeypatch.setattr(provider, "_exec_fallback", fallback)

    with pytest.raises(ProviderAdapterError, match="not replayed") as caught:
        provider._complete_sync("prompt", [], {})

    assert not called
    assert "secret" not in str(caught.value)


def test_model_catalog_includes_supported_efforts_and_default(monkeypatch):
    provider = CodexCLIProvider("catalog")
    monkeypatch.setattr(provider, "_ensure_server", lambda: None)
    monkeypatch.setattr(provider, "_rpc", lambda *_args, **_kwargs: {
        "data": [{
            "id": "gpt-test", "displayName": "GPT Test",
            "supportedReasoningEfforts": [
                {"reasoningEffort": "low"},
                {"reasoningEffort": "high"},
                {"reasoningEffort": "ultra"},
            ],
        }],
        "nextCursor": None,
    })

    models = provider._list_models()

    assert models[0].reasoning_efforts == ("default", "low", "high", "ultra")


def test_codex_provider_accepts_catalog_ultra_effort():
    provider = CodexCLIProvider("gpt-test", reasoning_effort="ultra")

    assert provider.reasoning_effort == "ultra"


class FakeProcess:
    stdin = None
    stdout = None

    def __init__(self):
        self.terminated = False
        self.killed = False

    def poll(self):
        return None

    def terminate(self):
        self.terminated = True

    def wait(self, timeout=None):
        return 0

    def kill(self):
        self.killed = True


def test_close_terminates_process_and_cleans_directory():
    provider = CodexCLIProvider("gpt-test")
    process = FakeProcess()
    directory = tempfile.TemporaryDirectory(prefix="codex-close-")
    path = directory.name
    provider._process = process
    provider._directory = directory

    provider.close()

    assert process.terminated
    assert not __import__("pathlib").Path(path).exists()


@pytest.mark.asyncio
@pytest.mark.parametrize("interruption", ["cancel", "timeout"])
async def test_interrupted_call_does_not_disable_later_requests(monkeypatch, interruption):
    import asyncio
    from app.providers.base import ProviderReply

    provider = CodexCLIProvider("gpt-test", timeout_seconds=0.01)
    started = threading.Event()
    released = threading.Event()
    process = FakeProcess()
    provider._process = process
    provider._directory = tempfile.TemporaryDirectory(prefix="codex-interrupted-")

    if interruption == "cancel":
        def complete(*_args):
            started.set()
            released.wait(2)
            return ProviderReply(content="Stopped", tool_calls=[])
        monkeypatch.setattr(provider, "_complete_sync", complete)
        task = asyncio.create_task(provider.complete([{"role": "user", "content": "First"}]))
        await asyncio.to_thread(started.wait, 1)
        task.cancel()
        try:
            with pytest.raises(asyncio.CancelledError):
                await task
        finally:
            released.set()
    else:
        monkeypatch.setattr(provider, "_ensure_server", lambda: None)
        monkeypatch.setattr(provider, "_rpc", lambda method, *_args, **_kwargs:
                            {"thread": {"id": "thread"}} if method == "thread/start"
                            else {"turn": {"id": "turn"}})
        with pytest.raises(ProviderAdapterError, match="not replayed"):
            await provider.complete([{"role": "user", "content": "First"}])

    assert process.terminated
    monkeypatch.setattr(provider, "_complete_sync",
                        lambda *_args: ProviderReply(content="Comparison delivered", tool_calls=[]))
    reply = await provider.complete([{"role": "user", "content": "Compare again"}])
    assert reply.content == "Comparison delivered"
    provider.close()
