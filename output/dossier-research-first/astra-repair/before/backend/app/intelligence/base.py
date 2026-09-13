from __future__ import annotations

from typing import Protocol

from app.models.awareness import OutboundWatchQuery, ProviderCheckpoint, ProviderScanResult


class IntelligenceProvider(Protocol):
    provider_id: str

    async def scan(
        self,
        query: OutboundWatchQuery,
        checkpoint: ProviderCheckpoint | None,
    ) -> ProviderScanResult: ...
