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


def _assert_operation_result(result, *, action, status):
    assert result["action"] == action
    assert result["operation"] == action
    assert result["status"] == status
    assert set(result) >= {
        "action", "source_action_key", "operation", "status", "summary",
        "matter_id", "entity_refs", "changed_paths", "resulting_matter_state",
        "available_next_actions", "required_user_action", "error", "recovery", "data",
    }


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


def test_research_preferences_are_bounded_and_do_not_store_secrets(app_context, monkeypatch):
    from app.providers.openai_compatible import OpenAICompatibleProvider

    async def available_models(_settings):
        return [{"id": "kimi-k3-fast", "label": "Kimi K3 Fast", "efforts": ["default"]}]

    monkeypatch.setattr(OpenAICompatibleProvider, "available_models", available_models)
    app_context.settings = app_context.settings.model_copy(update={"llm_api_key": "test-key"})
    app_context.provider_router.settings = app_context.settings
    response = _client(app_context).put("/api/settings", json={"values": {
        "research.primary_external_provider": "polaris",
        "research.fallback_external_provider": "none",
        "research.external_timeout_seconds": "9999",
        "research.external_retry_count": "99",
        "research.model_fallback_enabled": True,
        "research.model_fallback_provider": "openai_compatible",
        "research.model_fallback_model": "kimi-k3-fast",
    }})
    assert response.status_code == 200
    assert app_context.research_settings["external_timeout_seconds"] == app_context.settings.research_external_timeout_max_seconds
    assert app_context.research_settings["external_retry_count"] == app_context.settings.research_external_retry_max_count
    stored = app_context.settings_store.read()["values"]
    assert not any("key" in key.lower() or "secret" in key.lower() for key in stored if key.startswith("research."))


@pytest.mark.parametrize(
    ("key", "value", "detail"),
    [
        ("research.external_timeout_seconds", True, "Polaris timeout must be a whole number."),
        ("research.external_retry_count", 1.5, "Polaris retry count must be a whole number."),
    ],
)
def test_research_transport_rejects_non_integral_settings_values(
    app_context, key, value, detail,
):
    before = app_context.settings_store.read()["values"]

    response = _client(app_context).put(
        "/api/settings", json={"values": {key: value}}
    )

    assert response.status_code == 422
    assert response.json()["detail"] == detail
    assert app_context.settings_store.read()["values"] == before


def test_saved_invalid_research_transport_fails_on_context_load(app_context):
    from app.runtime import AppContext
    from app.services.settings import SettingsService

    app_context.vault.write_markdown(
        SettingsService.PATH,
        "# Workspace settings\n",
        {"values": {"research.external_timeout_seconds": "fast"}},
    )

    with pytest.raises(ValueError, match="Polaris timeout must be a whole number"):
        AppContext(app_context.settings)


def test_research_queue_reorder_returns_changed_and_no_change_operation_results(app_context):
    runs = app_context.research_runs
    for position in (1, 2):
        runs._write(
            "MAT-DEMO-BEACON", f"RUN-ORDER-{position}", state="queued",
            questions=[f"Question {position}"], question=f"Question {position}",
            question_id=f"RQ-ORDER-{position}", queue_item_version=1,
            queue_order=position, priority=position, completed=0,
            status="Research is queued.",
        )
    client = _client(app_context)
    changed = client.post(
        "/api/settings/research-queue/MAT-DEMO-BEACON/reorder",
        json={"run_ids": ["RUN-ORDER-2", "RUN-ORDER-1"], "source_action_key": "reorder-1"},
    )
    assert changed.status_code == 200
    changed_result = changed.json()
    _assert_operation_result(changed_result, action="reorder_research_queue", status="changed")
    assert changed_result["source_action_key"] == "reorder-1"
    assert len(changed_result["changed_paths"]) == 2
    assert [item["run_id"] for item in changed_result["data"]["items"] if item["state"] == "queued"] == [
        "RUN-ORDER-2", "RUN-ORDER-1",
    ]

    no_change = client.post(
        "/api/settings/research-queue/MAT-DEMO-BEACON/reorder",
        json={"run_ids": ["RUN-ORDER-2", "RUN-ORDER-1"]},
    ).json()
    _assert_operation_result(no_change, action="reorder_research_queue", status="no_change")
    assert no_change["changed_paths"] == []


@pytest.mark.asyncio
async def test_research_queue_resume_returns_changed_and_no_change_operation_results(app_context):
    import asyncio
    from app.routers.settings import resume_research_queue

    entered = asyncio.Event()
    release = asyncio.Event()

    async def blocked(_matter_id, question, **_kwargs):
        entered.set()
        await release.wait()
        return {
            "path": f"research/{question}.md", "public_research_status": "unavailable",
            "internal_sources": 0, "external_sources": 0,
        }

    app_context.research.run = blocked
    app_context.research_runs._write(
        "MAT-DEMO-BEACON", "RUN-RESUME", state="interrupted",
        questions=["Resume question"], question="Resume question",
        question_id="RQ-RESUME", queue_item_version=1, resumed_from_restart=True,
        queue_order=1, priority=1, completed=0,
        status="Research is queued to resume after restart.", return_stage="explore",
    )

    changed = await resume_research_queue(
        "MAT-DEMO-BEACON", {"source_action_key": "resume-1"}, app_context,
    )
    _assert_operation_result(changed, action="resume_research_queue", status="changed")
    assert changed["source_action_key"] == "resume-1"
    assert changed["data"]["item"]["run_id"] == "RUN-RESUME"
    await entered.wait()

    no_change = await resume_research_queue("MAT-DEMO-BEACON", None, app_context)
    _assert_operation_result(no_change, action="resume_research_queue", status="no_change")
    assert no_change["data"]["item"] is None
    release.set()
    await app_context.research_runs.wait_for_active_work()


@pytest.mark.asyncio
async def test_research_queue_stop_and_retry_return_typed_operation_results(app_context):
    from app.routers.settings import retry_research_item, stop_research_queue

    queued = app_context.research_runs._write(
        "MAT-DEMO-BEACON", "RUN-STOP-ENDPOINT", state="queued",
        questions=["Stop me"], question="Stop me", completed=0,
        queue_item_version=1, queue_order=1, status="Research is queued.",
    )
    stopped = await stop_research_queue(
        "MAT-DEMO-BEACON", {"source_action_key": "stop-1"}, app_context,
    )
    _assert_operation_result(stopped, action="stop_research_queue", status="changed")
    assert stopped["source_action_key"] == "stop-1"
    assert stopped["changed_paths"] == [queued["path"]]

    app_context.research_runs._write(
        "MAT-DEMO-BEACON", queued["run_id"], state="failed", status="Research failed.",
    )
    retried = await retry_research_item(
        "MAT-DEMO-BEACON", queued["run_id"], {"source_action_key": "retry-1"}, app_context,
    )
    _assert_operation_result(retried, action="retry_research_item", status="changed")
    assert retried["source_action_key"] == "retry-1"
    await app_context.research_runs.wait_for_active_work()


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
        "opencode_go",
        "codex",
        "antigravity_cli",
    ]
    assert [model["id"] for model in catalog["providers"][1]["models"]] == [
        "model-a",
        "model-b",
    ]
    assert catalog["providers"][0]["readiness"] == "ready"
    assert catalog["providers"][1]["readiness"] == "ready"
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


def test_polaris_cannot_be_selected_as_an_agent_model_provider(app_context):
    app_context.settings = app_context.settings.model_copy(
        update={"polaris_api_key": "polaris-key"}
    )
    app_context.provider_router.settings = app_context.settings
    original_provider = app_context.provider

    response = _client(app_context).put(
        "/api/settings",
        json={
            "values": {
                "agents.provider": "polaris",
                "agents.reasoning_model": "polaris-advisor",
                "agents.reasoning_effort": "default",
            }
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "Polaris is a public research provider and cannot be selected for agent work."
    )
    assert app_context.provider is original_provider


def test_saved_polaris_agent_selection_fails_on_context_load(app_context):
    from app.runtime import AppContext
    from app.services.settings import SettingsService

    with pytest.raises(
        ValueError,
        match="Polaris is a public research provider",
    ):
        app_context.settings_store.write(
            {
                "agents.provider": "polaris",
                "agents.reasoning_model": "polaris-advisor",
                "agents.reasoning_effort": "default",
            }
        )

    app_context.vault.write_markdown(
        SettingsService.PATH,
        "# Workspace settings\n",
        {
            "values": {
                "agents.provider": "polaris",
                "agents.reasoning_model": "polaris-advisor",
                "agents.reasoning_effort": "default",
            }
        },
    )

    with pytest.raises(
        ValueError,
        match="Polaris is a public research provider",
    ):
        AppContext(app_context.settings.model_copy(update={"polaris_api_key": "polaris-key"}))


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
