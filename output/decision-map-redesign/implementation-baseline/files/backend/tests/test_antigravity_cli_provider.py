from __future__ import annotations

import asyncio
import json

import pytest

from app.providers.antigravity_cli import AntigravityCLIProvider
from app.providers.catalog import ProviderAdapterError
from tests.test_provider_conformance import TOOLS


class Process:
    def __init__(self, stdout: bytes, returncode: int = 0, *, wait=False):
        self.stdout = stdout
        self.returncode = None if wait else returncode
        self._final_code = returncode
        self.killed = False
        self.wait_forever = wait

    async def communicate(self):
        if self.wait_forever:
            await asyncio.Future()
        self.returncode = self._final_code
        return self.stdout, b"sensitive stderr"

    def kill(self):
        self.killed = True
        self.returncode = -9

    async def wait(self):
        return self.returncode


def factory(process, captured):
    async def create(*args, **kwargs):
        captured.append((args, kwargs))
        return process
    return create


@pytest.mark.asyncio
async def test_text_and_one_tool_request_are_parsed_and_cli_is_isolated():
    payload = {"status": "SUCCESS", "structured_output": {
        "content": "Useful", "tool_call": {"id": "one", "name": "save_fact", "arguments": {"fact": "A"}},
    }}
    captured = []
    provider = AntigravityCLIProvider(
        "gemini", process_factory=factory(Process(json.dumps(payload).encode()), captured),
    )

    reply = await provider.complete([{"role": "user", "content": "Go"}], TOOLS)

    assert reply.content == "Useful"
    assert reply.tool_calls[0].arguments == {"fact": "A"}
    args, kwargs = captured[0]
    assert "--sandbox" in args and "--disable-slash-commands" in args
    assert kwargs["cwd"].startswith("/")


@pytest.mark.asyncio
async def test_plain_useful_response_is_preserved():
    process = Process(json.dumps({"status": "SUCCESS", "response": "Useful prose"}).encode())
    provider = AntigravityCLIProvider("gemini", process_factory=factory(process, []))

    reply = await provider.complete([{"role": "user", "content": "Go"}])

    assert reply.content == "Useful prose"


@pytest.mark.asyncio
async def test_timeout_kills_process_and_error_hides_stderr():
    process = Process(b"", wait=True)
    provider = AntigravityCLIProvider(
        "gemini", timeout_seconds=0.01, process_factory=factory(process, []),
    )

    with pytest.raises(ProviderAdapterError) as caught:
        await provider.complete([{"role": "user", "content": "Go"}])

    assert process.killed
    assert "sensitive" not in str(caught.value)


@pytest.mark.asyncio
async def test_cancellation_kills_process():
    process = Process(b"", wait=True)
    provider = AntigravityCLIProvider(
        "gemini", process_factory=factory(process, []),
    )
    task = asyncio.create_task(provider.complete([{"role": "user", "content": "Go"}]))
    await asyncio.sleep(0)
    task.cancel()

    with pytest.raises(asyncio.CancelledError):
        await task
    assert process.killed


@pytest.mark.asyncio
async def test_oversized_output_is_rejected():
    process = Process(b"x" * (8 * 1024 * 1024 + 1))
    provider = AntigravityCLIProvider("gemini", process_factory=factory(process, []))

    with pytest.raises(ProviderAdapterError, match="too large"):
        await provider.complete([{"role": "user", "content": "Go"}])


@pytest.mark.asyncio
async def test_catalog_is_development_only_and_malformed_catalog_keeps_saved_model():
    good = Process(b"gemini-2.5 Pro\nclaude-4 Sonnet\n")
    catalog = await AntigravityCLIProvider.catalog(process_factory=factory(good, []))
    bad = Process(b"", returncode=1)
    unavailable = await AntigravityCLIProvider.catalog(
        process_factory=factory(bad, []), saved_model="saved",
    )

    assert catalog.readiness == "development_only"
    assert all(model.reasoning_efforts[0] == "default" for model in catalog.models)
    assert AntigravityCLIProvider.warning in catalog.readiness_detail
    assert unavailable.readiness == "unavailable"
    assert unavailable.models[0].id == "saved"
