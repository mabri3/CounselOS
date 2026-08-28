from __future__ import annotations

import pytest

from app.config import Settings
from app.providers.openai_compatible import OpenAICompatibleProvider


class _Response:
    def raise_for_status(self):
        return None

    def json(self):
        return {"choices": [{"message": {"content": "done"}}]}


class _Client:
    payload = None

    def __init__(self, **_kwargs):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *_args):
        return None

    async def post(self, _url, *, headers, json):
        assert headers["Authorization"] == "Bearer test-key"
        type(self).payload = json
        return _Response()


class _ModelsResponse(_Response):
    def json(self):
        return {
            "data": [
                {
                    "id": "model-b",
                    "metadata": {
                        "display_name": "Model B",
                        "reasoning": {"supported_efforts": ["max", "high", "none"]},
                    },
                },
                {"id": "model-a", "metadata": {"display_name": "Model A"}},
            ]
        }


class _ModelsClient(_Client):
    async def get(self, _url, *, headers):
        assert headers["Authorization"] == "Bearer test-key"
        return _ModelsResponse()


@pytest.mark.asyncio
async def test_reasoning_effort_is_sent_when_selected(monkeypatch):
    monkeypatch.setattr("app.providers.openai_compatible.httpx.AsyncClient", _Client)
    provider = OpenAICompatibleProvider(
        Settings(
            llm_provider="openai_compatible",
            llm_api_key="test-key",
            llm_model="model-a",
            llm_reasoning_effort="high",
        )
    )

    reply = await provider.complete([{"role": "user", "content": "Think."}])

    assert reply.content == "done"
    assert _Client.payload["reasoning_effort"] == "high"


@pytest.mark.asyncio
async def test_available_models_uses_provider_effort_metadata(monkeypatch):
    monkeypatch.setattr("app.providers.openai_compatible.httpx.AsyncClient", _ModelsClient)
    settings = Settings(llm_api_key="test-key", llm_model="model-a")

    models = await OpenAICompatibleProvider.available_models(settings)

    assert models == [
        {"id": "model-a", "label": "Model A", "efforts": ["default"]},
        {
            "id": "model-b",
            "label": "Model B",
            "efforts": ["default", "max", "high", "none"],
        },
    ]
