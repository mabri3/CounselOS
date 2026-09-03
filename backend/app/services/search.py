from __future__ import annotations

from typing import Any
from time import monotonic

import httpx

from app.config import Settings
from app.services.index import IndexService
from app.services.vault import VaultService


class SearchService:
    def __init__(self, settings: Settings, vault: VaultService, index: IndexService):
        self.settings = settings
        self.vault = vault
        self.index = index

    def search_internal(
        self, query: str, *, matter_path: str | None = None, limit: int = 8,
    ) -> list[dict[str, Any]]:
        return self.index.lexical_search(
            query, relative_path=matter_path or "", limit=limit
        )

    async def search(self, query: str, *, matter_path: str | None = None) -> dict[str, Any]:
        internal = self.search_internal(query, matter_path=matter_path, limit=8)
        external: list[dict[str, Any]] = []
        warning: str | None = None
        if self.settings.search_provider.lower() == "tavily" and self.settings.tavily_api_key:
            try:
                external = await self._tavily(query)
            except Exception as exc:  # External research must not prevent useful work product.
                warning = f"External search failed: {exc}"
        elif self.settings.search_provider.lower() not in {"", "disabled", "none"}:
            warning = f"Search provider '{self.settings.search_provider}' is not configured."
        return {"query": query, "internal": internal, "external": external, "warning": warning}

    async def search_external(
        self, query: str, *, provider: str | None = None,
        timeout_seconds: int | None = None, retry_count: int = 0,
    ) -> dict[str, Any]:
        """Search only the configured public provider; never touch the vault."""
        external: list[dict[str, Any]] = []
        warning: str | None = None
        started = monotonic()
        attempts = 0
        failure_class: str | None = None
        selected = (provider or self.settings.search_provider).lower()
        if selected == "tavily" and self.settings.tavily_api_key:
            for attempt in range(max(0, retry_count) + 1):
                attempts = attempt + 1
                try:
                    external = await self._tavily(query, timeout_seconds=timeout_seconds)
                    break
                except Exception as exc:  # A provider failure can still yield a partial scan.
                    warning = f"External search failed: {type(exc).__name__}"
                    failure_class = "timeout" if isinstance(exc, httpx.TimeoutException) else "network" if isinstance(exc, httpx.NetworkError) else "http_status" if isinstance(exc, httpx.HTTPStatusError) else "request_failure"
                    if attempt >= max(0, retry_count):
                        break
        elif selected == "tavily":
            warning = "External search provider is not configured."
        elif selected not in {"", "disabled", "none"}:
            warning = f"Search provider '{selected}' is not configured."
        return {
            "query": query, "external": external, "warning": warning,
            "observability": {
                "failure_class": failure_class,
                "attempt_count": attempts,
                "elapsed_ms": max(0, int((monotonic() - started) * 1000)),
                "timeout_seconds": timeout_seconds,
            },
        }

    async def _tavily(self, query: str, *, timeout_seconds: int | None = None) -> list[dict[str, Any]]:
        payload = {
            "api_key": self.settings.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "max_results": self.settings.search_max_results,
            "include_answer": False,
            "include_raw_content": False,
        }
        async with httpx.AsyncClient(timeout=timeout_seconds or self.settings.llm_timeout_seconds) as client:
            response = await client.post("https://api.tavily.com/search", json=payload)
            response.raise_for_status()
            data = response.json()
        return [
            {
                "title": result.get("title", "Untitled source"),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
                "score": result.get("score"),
                "support_state": "retrieved",
            }
            for result in data.get("results", [])
        ]
