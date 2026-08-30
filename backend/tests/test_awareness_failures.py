from __future__ import annotations

from datetime import UTC, datetime

import pytest

from app.models.awareness import BriefingItem, ForbiddenCorpus, ProviderScanResult
from app.services.briefing_research import BriefingResearchService
from app.services.briefing_store import BriefingStore
from app.services.vault import VaultService

from test_watch_scans import KnowledgeFake, ProviderFake, RegistryFake, make_service, make_watch


@pytest.mark.asyncio
async def test_forbidden_corpus_failure_creates_no_provider_call_and_durable_failed_scan(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    provider = ProviderFake("native", ProviderScanResult(provider_id="native", status="success"))

    class BrokenKnowledge(KnowledgeFake):
        def forbidden_corpus(self, watch):
            raise OSError("private source could not be read")

    service = make_service(vault, RegistryFake({"native": provider}), BrokenKnowledge())
    result = await service.run_watch(watch.watch_id, "manual")
    assert result.scan.status == "failed"
    assert provider.calls == 0
    assert service.briefing.get_scan(result.scan.scan_id).status == "failed"


@pytest.mark.asyncio
async def test_empty_corpus_without_local_proof_is_rejected_before_transport(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    provider = ProviderFake("native", ProviderScanResult(provider_id="native", status="success"))

    class InvalidKnowledge(KnowledgeFake):
        def forbidden_corpus(self, watch):
            return ForbiddenCorpus.model_construct(terms=(), proved_no_private_identifiers=False)

    result = await make_service(vault, RegistryFake({"native": provider}), InvalidKnowledge()).run_watch(watch.watch_id, "manual")
    assert result.scan.status == "failed"
    assert provider.calls == 0


@pytest.mark.asyncio
async def test_additive_research_failure_preserves_source_backed_item_and_rebinds_runner(tmp_path):
    vault = VaultService(tmp_path)
    store = BriefingStore(vault)
    now = datetime.now(UTC)
    item = store.put_item(BriefingItem(
        item_id="ITEM-1", path="pending", development_id="DEV-1", watch_id="WATCH-1",
        title="Stored analysis", summary="Source-backed summary", why_shown="Watch match",
        created_at=now, updated_at=now,
    ))
    before = store.get_item(item.item_id)
    service = BriefingResearchService(store)

    async def fail(item, question):
        raise RuntimeError("model unavailable")

    service.bind_agent_runner(fail)
    partial = await service.run(item.item_id, "What else?")
    assert partial.status == "partial" and partial.text
    assert partial.briefing_item_id == item.item_id
    assert partial.question == "What else?"
    assert partial.kind == "research"
    assert partial.created_at is not None
    assert store.get_item(item.item_id) == before

    async def succeed(item, question):
        return {"text": "Additional analysis"}

    service.bind_agent_runner(succeed)
    success = await service.run(item.item_id, "Try again")
    assert success.status == "success" and success.text == "Additional analysis"
    assert store.get_item(item.item_id) == before

    async def malformed(item, question):
        return {"unexpected": "shape"}

    service.bind_agent_runner(malformed)
    fallback = await service.run(item.item_id, "Malformed response")
    assert fallback.text
    assert store.get_item(item.item_id) == before
