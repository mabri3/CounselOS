from __future__ import annotations

from typing import Any

import httpx

from app.config import Settings
from app.services.vault import VaultService


class SearchService:
    def __init__(self, settings: Settings, vault: VaultService):
        self.settings = settings
        self.vault = vault

    async def search(self, query: str, *, matter_path: str | None = None) -> dict[str, Any]:
        internal = self.vault.lexical_search(query, relative_path=matter_path or "", limit=8)
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

    async def _tavily(self, query: str) -> list[dict[str, Any]]:
        payload = {
            "api_key": self.settings.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "max_results": self.settings.search_max_results,
            "include_answer": False,
            "include_raw_content": False,
        }
        async with httpx.AsyncClient(timeout=self.settings.llm_timeout_seconds) as client:
            response = await client.post("https://api.tavily.com/search", json=payload)
            response.raise_for_status()
            data = response.json()
        return [
            {
                "title": result.get("title", "Untitled source"),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
                "score": result.get("score"),
            }
            for result in data.get("results", [])
        ]
