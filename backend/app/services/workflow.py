from __future__ import annotations

from typing import Any

from app.services.vault import VaultService


DEFAULT_STAGES = ["intake", "research", "explore", "generate", "respond", "closed"]


class WorkflowService:
    def __init__(self, vault: VaultService):
        self.vault = vault

    def stages(self) -> list[dict[str, Any]]:
        path = "00_System/workflows/product-counsel.md"
        if not self.vault.exists(path):
            return [{"id": stage, "label": stage.title()} for stage in DEFAULT_STAGES]
        metadata = self.vault.read_markdown(path)["metadata"]
        configured = metadata.get("stages", [])
        if not isinstance(configured, list) or not configured:
            return [{"id": stage, "label": stage.title()} for stage in DEFAULT_STAGES]
        return configured

    def stage_ids(self) -> list[str]:
        return [str(stage.get("id")) for stage in self.stages()]

    def validate(self, stage: str) -> str:
        normalized = stage.strip().lower()
        if normalized not in self.stage_ids():
            raise ValueError(f"Unknown matter stage: {stage}")
        return normalized
