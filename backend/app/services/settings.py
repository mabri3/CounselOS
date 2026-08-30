from __future__ import annotations

from typing import Any

from app.services.vault import VaultService
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
