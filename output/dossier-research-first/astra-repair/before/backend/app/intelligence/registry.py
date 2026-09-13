from __future__ import annotations


class IntelligenceRegistry:
    def __init__(self, native, polaris):
        self._providers = {"native": native, "polaris": polaris}

    def get(self, provider_id: str):
        if provider_id == "both":
            raise ValueError("both mode is coordinated by WatchScanService")
        try:
            return self._providers[provider_id]
        except KeyError as exc:
            raise ValueError(f"unknown intelligence provider: {provider_id}") from exc

    def resolve(self, provider_id: str):
        return self.get(provider_id)

    def capabilities(self) -> list[dict[str, object]]:
        capabilities = []
        for provider_id, provider in self._providers.items():
            configured = bool(getattr(provider, "configured", True))
            capabilities.append({
                "provider_id": provider_id,
                "label": provider.label,
                "configured": configured,
                "available": configured,
                "warning": None if configured else f"{provider.label} is not configured",
                "supported_modes": ["watch_scan"],
            })
        return capabilities
