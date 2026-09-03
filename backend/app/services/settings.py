from __future__ import annotations

from dataclasses import asdict, is_dataclass
from typing import Any

from app.services.vault import VaultService
from app.services.provider_settings_policy import ProviderSettingsPolicy
from app.utils.time import iso_now


class SettingsService:
    PATH = "00_System/settings.md"
    ATTESTATION_KEY = "data.provider_no_training_attested"
    MATTER_FILE_DEFAULTS = {
        "matter_files.source_documents_dir": "documents",
        "matter_files.draft_outputs_dir": "work-product/draft",
        "matter_files.final_outputs_dir": "work-product/final",
    }

    def __init__(self, vault: VaultService):
        self.vault = vault

    def read(self) -> dict[str, Any]:
        if not self.vault.exists(self.PATH):
            return {"values": dict(self.MATTER_FILE_DEFAULTS)}
        values = self.vault.read_markdown(self.PATH)["metadata"].get("values", {})
        stored = dict(values) if isinstance(values, dict) else {}
        return {"values": {**self.MATTER_FILE_DEFAULTS, **stored}}

    def write(self, values: dict[str, Any]) -> dict[str, Any]:
        stored = self.read()["values"]
        merged = {**stored, **values}
        from app.services.matter_paths import MatterPathPolicy

        validated = MatterPathPolicy.validate_values(merged)
        merged.update(validated)
        ProviderSettingsPolicy.saved_agent_selection(merged)
        ProviderSettingsPolicy.validate_research_values(merged)
        now = iso_now()

        if (
            self.ATTESTATION_KEY in values
            and values[self.ATTESTATION_KEY] != stored.get(self.ATTESTATION_KEY)
        ):
            merged["data.provider_no_training_attested_by"] = stored.get(
                "matters.default_owner", "Unattributed"
            )
            merged["data.provider_no_training_attested_at"] = now

        self.vault.write_markdown(
            self.PATH,
            "# Workspace settings\n\n"
            "Written from the Settings screen. One flat map of\n"
            "namespaced configuration keys.\n",
            {"values": merged, "updated_at": now},
        )
        return {"values": merged}

    def validate(self, values: dict[str, Any]) -> None:
        from app.services.matter_paths import MatterPathPolicy

        MatterPathPolicy.validate_values({**self.read()["values"], **values})
        merged = {**self.read()["values"], **values}
        ProviderSettingsPolicy.saved_agent_selection(merged)
        ProviderSettingsPolicy.validate_research_values(merged)

    @staticmethod
    def normalize_model_catalog(catalog: Any) -> dict[str, Any]:
        """Return the stable API shape without constructing any provider."""
        if is_dataclass(catalog):
            catalog = asdict(catalog)
        if isinstance(catalog, dict):
            raw_providers = catalog.get("providers", [])
            warning = catalog.get("warning")
        else:
            raw_providers = catalog
            warning = None

        providers: list[dict[str, Any]] = []
        for raw_provider in raw_providers if isinstance(raw_providers, (list, tuple)) else []:
            provider = asdict(raw_provider) if is_dataclass(raw_provider) else raw_provider
            if not isinstance(provider, dict):
                continue
            models: list[dict[str, Any]] = []
            for raw_model in provider.get("models", []):
                model = asdict(raw_model) if is_dataclass(raw_model) else raw_model
                if not isinstance(model, dict):
                    continue
                efforts = model.get("reasoning_efforts", model.get("efforts", []))
                models.append(
                    {
                        "id": str(model.get("id") or ""),
                        "label": str(model.get("label") or model.get("id") or ""),
                        "reasoning_efforts": [str(value) for value in efforts]
                        if isinstance(efforts, (list, tuple))
                        else [],
                    }
                )
            provider_id = str(provider.get("id") or "")
            if not ProviderSettingsPolicy.is_agent_provider(provider_id):
                continue
            providers.append(
                {
                    "id": provider_id,
                    "label": str(provider.get("label") or provider_id),
                    "readiness": str(
                        provider.get("readiness")
                        or ("ready" if provider_id == "mock" or models else "unavailable")
                    ),
                    "readiness_detail": str(provider.get("readiness_detail") or ""),
                    "models": models,
                }
            )
        return {"providers": providers, "warning": warning}
