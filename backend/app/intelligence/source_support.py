from __future__ import annotations

from datetime import datetime, timezone

from app.models.awareness import SafeFetchLimits, SourceReference, SourceSupport


class SourceSupportService:
    def __init__(self, fetcher, *, limits: SafeFetchLimits | None = None):
        self.fetcher = fetcher
        self.limits = limits or SafeFetchLimits()

    async def check(self, source_reference: SourceReference) -> SourceSupport:
        try:
            fetched = await self.fetcher.fetch(str(source_reference.canonical_url), self.limits)
        except Exception as exc:
            source = source_reference.model_copy(update={
                "support_state": "unverified_lead",
                "warning": f"Themis.ai could not retrieve this source: {exc}",
            })
            return SourceSupport(
                source=source, state="unverified_lead", checked_at=datetime.now(timezone.utc),
                warning=source.warning,
            )

        retrieved = fetched.excerpt
        stored_claim = source_reference.excerpt.strip()
        locator = source_reference.locator.strip()
        claim_supported = bool(stored_claim and stored_claim.casefold() in retrieved.casefold())
        locator_supported = bool(locator and locator.casefold() in retrieved.casefold())
        verified = claim_supported or locator_supported
        state = "verified" if verified else "retrieved"
        warning = None if verified else "Source was retrieved, but the stored claim or locator was not confirmed."
        source = source_reference.model_copy(update={
            "support_state": state,
            "excerpt": retrieved[:12000],
            "warning": warning,
        })
        return SourceSupport(
            source=source, state=state, checked_at=datetime.now(timezone.utc), warning=warning,
        )
