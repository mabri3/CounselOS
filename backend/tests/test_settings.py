from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def _client(app_context):
    from app.main import app

    app.state.context = app_context
    return TestClient(app)


def _empty_settings(app_context):
    from app.services.settings import SettingsService

    app_context.vault.resolve(SettingsService.PATH).unlink(missing_ok=True)


def test_settings_merge_rather_than_replace(app_context):
    _empty_settings(app_context)
    assert app_context.settings_store.read()["values"]["matter_files.source_documents_dir"] == "documents"
    app_context.settings_store.write(
        {
            "general.organisation": "DemoCo Financial",
            "general.serif_long_documents": False,
        }
    )
    merged = app_context.settings_store.write(
        {"matters.default_owner": "Brian Harris"}
    )["values"]
    assert merged["general.organisation"] == "DemoCo Financial"
    assert merged["general.serif_long_documents"] is False
    assert merged["matters.default_owner"] == "Brian Harris"


def test_settings_are_on_disk_not_in_memory(app_context):
    from app.services.settings import SettingsService

    _empty_settings(app_context)
    app_context.settings_store.write({"general.organisation": "DemoCo Financial"})
    fresh = SettingsService(app_context.vault)
    assert fresh.read()["values"]["general.organisation"] == "DemoCo Financial"


def test_training_attestation_is_stamped_once(app_context, monkeypatch):
    _empty_settings(app_context)
    timestamps = iter(
        [
            "2026-08-26T08:40:00+00:00",
            "2026-08-26T08:41:00+00:00",
            "2026-08-26T08:42:00+00:00",
            "2026-08-26T08:43:00+00:00",
        ]
    )
    monkeypatch.setattr("app.services.settings.iso_now", lambda: next(timestamps))

    app_context.settings_store.write({"matters.default_owner": "Brian Harris"})
    values = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert values["data.provider_no_training_attested"] is True
    assert values["data.provider_no_training_attested_by"] == "Brian Harris"
    stamped_at = values["data.provider_no_training_attested_at"]
    assert stamped_at == "2026-08-26T08:41:00+00:00"

    # Re-writing the same value must not re-stamp.
    again = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert again["data.provider_no_training_attested_at"] == stamped_at

    # Changing it does re-stamp.
    changed = app_context.settings_store.write(
        {"data.provider_no_training_attested": False}
    )["values"]
    assert changed["data.provider_no_training_attested_at"] == "2026-08-26T08:43:00+00:00"


def test_model_settings_catalog_and_runtime_switch(app_context, monkeypatch):
    from app.providers.mock import MockProvider
    from app.providers.openai_compatible import OpenAICompatibleProvider

    app_context.settings = app_context.settings.model_copy(
        update={
            "llm_api_key": "test-key",
            "llm_base_url": "https://models.example/v1",
            "llm_model": "model-a",
        }
    )

    async def available_models(_settings):
        return [
            {"id": "model-a", "label": "Model A", "efforts": ["default", "low"]},
            {"id": "model-b", "label": "Model B", "efforts": ["default", "high"]},
        ]

    monkeypatch.setattr(OpenAICompatibleProvider, "available_models", available_models)
    client = _client(app_context)
    response = client.get("/api/settings")
    assert response.status_code == 200
    catalog = response.json()["model_catalog"]
    assert [provider["id"] for provider in catalog["providers"]] == [
        "mock",
        "openai_compatible",
        "polaris",
        "opencode_go",
        "codex",
        "antigravity_cli",
    ]
    assert [model["id"] for model in catalog["providers"][1]["models"]] == [
        "model-a",
        "model-b",
    ]
    assert catalog["providers"][0]["readiness"] == "ready"
    assert catalog["providers"][2]["readiness"] == "missing"
    assert catalog["providers"][1]["models"][1]["reasoning_efforts"] == [
        "default",
        "high",
    ]

    saved = client.put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "openai_compatible",
                "agents.reasoning_model": "model-b",
                "agents.reasoning_effort": "high",
            }
        },
    )
    assert saved.status_code == 200
    assert isinstance(app_context.provider, OpenAICompatibleProvider)
    assert app_context.settings.llm_model == "model-b"
    assert app_context.settings.llm_reasoning_effort == "high"
    assert app_context.runner.resolve("counsel-copilot").provider is app_context.provider
    assert app_context.research.provider is app_context.provider

    offline = client.put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "mock",
                "agents.reasoning_model": "mock",
                "agents.reasoning_effort": "default",
            }
        },
    )
    assert offline.status_code == 200
    assert isinstance(app_context.provider, MockProvider)
    assert app_context.settings.llm_reasoning_effort is None

    app_context.settings = app_context.settings.model_copy(
        update={"polaris_api_key": "polaris-key"}
    )
    app_context.provider_router.settings = app_context.settings
    polaris = client.put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "polaris",
                "agents.reasoning_model": "polaris-advisor",
                "agents.reasoning_effort": "default",
            }
        },
    )
    assert polaris.status_code == 200
    assert isinstance(app_context.provider, OpenAICompatibleProvider)
    assert app_context.provider.settings.llm_provider == "polaris"


def test_invalid_model_setting_does_not_change_runtime(app_context):
    original_provider = app_context.provider
    response = _client(app_context).put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "not-real",
                "agents.reasoning_model": "made-up",
                "agents.reasoning_effort": "extreme",
            }
        },
    )
    assert response.status_code == 422
    assert app_context.provider is original_provider

    unsupported_effort = _client(app_context).put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "mock",
                "agents.reasoning_model": "mock",
                "agents.reasoning_effort": "high",
            }
        },
    )
    assert unsupported_effort.status_code == 422
    assert app_context.provider is original_provider


def test_saved_model_settings_are_loaded_on_restart(app_context):
    from app.providers.openai_compatible import OpenAICompatibleProvider
    from app.runtime import AppContext

    app_context.settings_store.write(
        {
            "agents.provider": "openai_compatible",
            "agents.reasoning_model": "saved-model",
            "agents.reasoning_effort": "max",
        }
    )
    base_settings = app_context.settings.model_copy(
        update={
            "llm_provider": "mock",
            "llm_api_key": "test-key",
            "llm_model": "environment-model",
        }
    )

    restarted = AppContext(base_settings)

    assert isinstance(restarted.provider, OpenAICompatibleProvider)
    assert restarted.settings.llm_model == "saved-model"
    assert restarted.settings.llm_reasoning_effort == "max"


def test_invalid_matter_path_setting_does_not_modify_stored_values(app_context):
    before = app_context.settings_store.write(
        {"matter_files.source_documents_dir": "source-files"}
    )["values"]
    response = _client(app_context).put(
        "/api/settings",
        json={"values": {"matter_files.draft_outputs_dir": "../outside"}},
    )
    assert response.status_code == 422
    assert app_context.settings_store.read()["values"] == before


def test_overlapping_matter_path_settings_are_rejected(app_context):
    with pytest.raises(ValueError, match="must not overlap"):
        app_context.settings_store.write({
            "matter_files.draft_outputs_dir": "outputs",
            "matter_files.final_outputs_dir": "outputs/final",
        })


def test_model_catalog_dataclasses_are_normalized_without_provider_construction():
    from app.providers.base import ProviderCatalogEntry, ProviderModel
    from app.services.settings import SettingsService

    result = SettingsService.normalize_model_catalog(
        [
            ProviderCatalogEntry(
                id="codex",
                label="Codex CLI",
                readiness="ready",
                readiness_detail="Signed in.",
                models=(
                    ProviderModel(
                        id="gpt-5.6-luna",
                        label="GPT-5.6 Luna",
                        reasoning_efforts=("low", "medium", "high"),
                    ),
                ),
            ),
            ProviderCatalogEntry(
                id="antigravity_cli",
                label="Antigravity CLI",
                readiness="development_only",
                readiness_detail="Development only — do not use confidential matter data.",
            ),
        ]
    )

    assert result == {
        "providers": [
            {
                "id": "codex",
                "label": "Codex CLI",
                "readiness": "ready",
                "readiness_detail": "Signed in.",
                "models": [
                    {
                        "id": "gpt-5.6-luna",
                        "label": "GPT-5.6 Luna",
                        "reasoning_efforts": ["low", "medium", "high"],
                    }
                ],
            },
            {
                "id": "antigravity_cli",
                "label": "Antigravity CLI",
                "readiness": "development_only",
                "readiness_detail": "Development only — do not use confidential matter data.",
                "models": [],
            },
        ],
        "warning": None,
    }
