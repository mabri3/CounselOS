from __future__ import annotations

import asyncio
from datetime import UTC, datetime

import pytest

from app.intelligence.outbound_policy import OutboundQueryPolicy
from app.models.awareness import (
    BriefingPage, BriefingQuery, Development, DevelopmentCandidate, ForbiddenCorpus,
    InternalRecord, InternalSnapshot, MatchConnection, MatchResult, ProviderCheckpoint,
    ProviderScanResult, PublicWatchQuery, SavedView, SourceReference, WatchDraftCreate,
    WatchPatch,
)
from app.services.awareness_matching import AwarenessMatcher
from app.services.briefing_query import BriefingQueryService
from app.services.briefing_store import BriefingStore
from app.services.developments import DevelopmentService
from app.services.review_packets import ReviewPacketService
from app.services.vault import VaultService
from app.services.watch_scans import WatchScanService
from app.services.watches import WatchStore


class IndexFake:
    def __init__(self, store):
        self.store = store
        self.rebuilds = 0

    def rebuild(self):
        self.rebuilds += 1

    def query_briefing(self, query):
        return self.store.list_items(query)


class KnowledgeFake:
    def forbidden_corpus(self, watch):
        return ForbiddenCorpus(proved_no_private_identifiers=True)

    def snapshot(self, scope):
        return InternalSnapshot(created_at=datetime.now(UTC))


class RegistryFake:
    def __init__(self, providers):
        self.providers = providers

    def resolve(self, provider_id):
        return self.providers[provider_id]


class ProviderFake:
    def __init__(self, provider_id, result=None, gate=None):
        self.provider_id = provider_id
        self.result = result
        self.gate = gate
        self.calls = 0

    async def scan(self, query, checkpoint):
        self.calls += 1
        if self.gate:
            await self.gate.wait()
        if isinstance(self.result, Exception):
            raise self.result
        return self.result


def make_watch(vault, provider="native", *, title="Agency Watch", topic="privacy"):
    return WatchStore(vault).create_draft(WatchDraftCreate(
        title=title, standing_question="What changed in privacy rules?",
        public_query=PublicWatchQuery(
            standing_question="What changed in privacy rules?", topics=[topic]
        ), purposes=["awareness"], provider=provider,
    ))


def make_service(vault, registry, knowledge=None):
    store = BriefingStore(vault)
    return WatchScanService(
        WatchStore(vault), store, DevelopmentService(vault), registry,
        OutboundQueryPolicy(), knowledge or KnowledgeFake(), AwarenessMatcher(),
        ReviewPacketService(vault, store), IndexFake(store),
    )


@pytest.mark.asyncio
async def test_watches_only_receive_their_owned_developments(tmp_path):
    vault = VaultService(tmp_path)
    watch_a = make_watch(vault, title="Watch A", topic="alpha")
    watch_b = make_watch(vault, title="Watch B", topic="beta")
    provider = ProviderFake("native", ProviderScanResult(
        provider_id="native", status="success", candidates=[DevelopmentCandidate(
            title="Alpha rule", canonical_url="https://agency.example/alpha",
        )],
    ))
    service = make_service(vault, RegistryFake({"native": provider}))

    result_a = await service.run_watch(watch_a.watch_id, "manual")
    provider.result = ProviderScanResult(
        provider_id="native", status="success", candidates=[DevelopmentCandidate(
            title="Beta rule", canonical_url="https://agency.example/beta",
        )],
    )
    result_b = await service.run_watch(watch_b.watch_id, "manual")

    assert [(item.title, item.topics) for item in result_a.preview_items] == [
        ("Alpha rule", ["alpha"])
    ]
    assert [(item.title, item.topics) for item in result_b.preview_items] == [
        ("Beta rule", ["beta"])
    ]


@pytest.mark.asyncio
async def test_ownerless_legacy_development_is_not_rematched_to_any_watch(tmp_path):
    vault = VaultService(tmp_path)
    watch_a = make_watch(vault, title="Watch A")
    watch_b = make_watch(vault, title="Watch B")
    now = datetime.now(UTC)
    legacy = Development(
        development_id="DEV-LEGACY",
        path="05_Briefing/developments/DEV-LEGACY.md",
        title="Ownerless legacy rule",
        canonical_url="https://agency.example/legacy",
        created_at=now,
        updated_at=now,
    )
    vault.write_markdown(
        legacy.path,
        "# Ownerless legacy rule",
        legacy.model_dump(mode="json", exclude={"watch_ids"}),
    )
    provider = ProviderFake(
        "native", ProviderScanResult(provider_id="native", status="success")
    )
    service = make_service(vault, RegistryFake({"native": provider}))

    result_a = await service.run_watch(watch_a.watch_id, "manual")
    result_b = await service.run_watch(watch_b.watch_id, "manual")

    assert result_a.preview_items == []
    assert result_b.preview_items == []
    assert DevelopmentService(vault).get(legacy.development_id).watch_ids == []


@pytest.mark.asyncio
async def test_shared_development_is_owned_and_rematched_by_both_watches(tmp_path):
    vault = VaultService(tmp_path)
    watch_a = make_watch(vault, title="Watch A", topic="alpha")
    watch_b = make_watch(vault, title="Watch B", topic="beta")
    candidate = DevelopmentCandidate(
        title="Shared rule", canonical_url="https://agency.example/shared",
        content_hash="shared-v1",
    )
    provider = ProviderFake(
        "native",
        ProviderScanResult(provider_id="native", status="success", candidates=[candidate]),
    )
    service = make_service(vault, RegistryFake({"native": provider}))

    first = await service.run_watch(watch_a.watch_id, "manual")
    await service.run_watch(watch_b.watch_id, "manual")
    development = DevelopmentService(vault).get(first.preview_items[0].development_id)
    assert development.watch_ids == sorted([watch_a.watch_id, watch_b.watch_id])

    provider.result = ProviderScanResult(provider_id="native", status="success")
    rematch_a = await service.run_watch(watch_a.watch_id, "manual")
    rematch_b = await service.run_watch(watch_b.watch_id, "manual")
    assert [item.title for item in rematch_a.preview_items] == ["Shared rule"]
    assert [item.title for item in rematch_b.preview_items] == ["Shared rule"]


@pytest.mark.asyncio
async def test_both_provider_partial_keeps_success_and_advances_only_successful_checkpoint(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault, "both")
    checkpoint = ProviderCheckpoint(provider_id="native", cursor="next")
    native = ProviderFake("native", ProviderScanResult(
        provider_id="native", status="success", next_checkpoint=checkpoint,
        candidates=[DevelopmentCandidate(
            title="New rule", canonical_url="https://agency.example/rule",
            content_hash="v1", summary="The rule changed.",
            sources=[SourceReference(title="Rule", canonical_url="https://agency.example/rule")],
        )],
    ))
    polaris = ProviderFake("polaris", RuntimeError("offline"))
    service = make_service(vault, RegistryFake({"native": native, "polaris": polaris}))

    result = await service.run_watch(watch.watch_id, "manual")

    assert result.scan.status == "partial"
    assert [item.status for item in result.scan.provider_results] == ["success", "failed"]
    assert result.preview_items and result.preview_items[0].sources[0].support_state == "supplied"
    saved_watch = service.watches.get(watch.watch_id)
    assert saved_watch.checkpoints["native"].cursor == "next"
    assert "polaris" not in saved_watch.checkpoints


@pytest.mark.asyncio
async def test_total_provider_failure_stays_failed_with_owned_historical_rematch(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    DevelopmentService(vault).record_candidates(
        watch.watch_id,
        "native",
        [DevelopmentCandidate(
            title="Historical owned bulletin",
            canonical_url="https://agency.example/historical-owned",
            content_hash="historical-v1",
        )],
    )
    provider = ProviderFake("native", RuntimeError("offline"))
    service = make_service(vault, RegistryFake({"native": provider}))

    result = await service.run_watch(watch.watch_id, "manual")

    assert [item.title for item in result.preview_items] == ["Historical owned bulletin"]
    assert result.scan.status == "failed"


@pytest.mark.asyncio
async def test_one_watch_lock_covers_all_modes(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    gate = asyncio.Event()
    provider = ProviderFake("native", ProviderScanResult(provider_id="native", status="success"), gate)
    service = make_service(vault, RegistryFake({"native": provider}))
    first = asyncio.create_task(service.run_watch(watch.watch_id, "scheduled"))
    while provider.calls == 0:
        await asyncio.sleep(0)

    with pytest.raises(ValueError, match="active scan conflict"):
        await service.run_watch(watch.watch_id, "manual")
    gate.set()
    await first
    assert provider.calls == 1


@pytest.mark.asyncio
async def test_scan_completion_merges_state_onto_concurrent_lawyer_watch_edit(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    gate = asyncio.Event()
    checkpoint = ProviderCheckpoint(provider_id="native", cursor="after-scan")
    provider = ProviderFake(
        "native",
        ProviderScanResult(
            provider_id="native", status="success", next_checkpoint=checkpoint
        ),
        gate,
    )
    service = make_service(vault, RegistryFake({"native": provider}))
    running = asyncio.create_task(service.run_watch(watch.watch_id, "manual"))
    while provider.calls == 0:
        await asyncio.sleep(0)

    edited = service.watches.update(
        watch.watch_id,
        WatchPatch(expected_revision=1, title="Lawyer-edited title", provider="polaris"),
        1,
    )
    assert edited.revision == 2
    gate.set()
    await running

    saved = service.watches.get(watch.watch_id)
    assert saved.title == "Lawyer-edited title"
    assert saved.provider == "polaris"
    assert saved.checkpoints["native"].cursor == "after-scan"
    assert saved.last_successful_scan_at is not None
    assert saved.status == "draft"
    assert saved.revision == 3


@pytest.mark.asyncio
async def test_internal_rematch_uses_existing_development_without_new_provider_candidate(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    DevelopmentService(vault).record_candidates(watch.watch_id, "native", [DevelopmentCandidate(
        title="Existing bulletin", canonical_url="https://agency.example/existing",
        summary="Existing useful bulletin.", content_hash="v1",
    )])
    provider = ProviderFake("native", ProviderScanResult(provider_id="native", status="success"))
    result = await make_service(vault, RegistryFake({"native": provider})).run_watch(watch.watch_id, "manual")
    assert [item.title for item in result.preview_items] == ["Existing bulletin"]


def test_briefing_item_classifies_mixed_internal_links_from_snapshot(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    service = make_service(vault, RegistryFake({}))
    development = DevelopmentService(vault).record_candidates(watch.watch_id, "native", [DevelopmentCandidate(
        title="Mixed company impact", canonical_url="https://agency.example/mixed",
    )]).developments[0]
    records = [
        InternalRecord(record_id="PROD-1", record_type="product", path="02_Company_Knowledge/product.md", title="Product"),
        InternalRecord(record_id="POL-1", record_type="policy", path="02_Company_Knowledge/policy.md", title="Policy"),
        InternalRecord(record_id="MAT-1", record_type="matter", path="03_Matters/one/matter.md", title="Matter"),
        InternalRecord(record_id="DEC-1", record_type="decision", path="03_Matters/one/decisions/DEC-1.md", title="Decision"),
        InternalRecord(record_id="MIT-1", record_type="mitigation", path="03_Matters/one/mitigations/MIT-1.md", title="Mitigation"),
    ]
    snapshot = InternalSnapshot(records=records, created_at=datetime.now(UTC))
    matches = MatchResult(connections=[MatchConnection(
        development_id=development.development_id,
        internal_record_ids=[record.record_id for record in records] + ["UNKNOWN"],
        attention_state="monitor", reason="Mixed local links.",
    )])
    item = service._put_items(
        watch, type("Batch", (), {"developments": [development]})(), matches, snapshot
    )[0]
    assert item.company_connection is not None
    assert item.company_connection.products == ["PROD-1"]
    assert item.company_connection.policies == ["POL-1"]
    assert item.company_connection.matters == ["MAT-1"]
    assert item.company_connection.decisions == ["DEC-1"]
    assert item.company_connection.mitigations == ["MIT-1"]
    assert "UNKNOWN" not in item.company_connection.model_dump_json()


@pytest.mark.asyncio
async def test_scan_preview_contains_durable_review_packet_link(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    vault.write_markdown("03_Matters/one/decisions/DEC-1.md", "Decision", {
        "decision_id": "DEC-1", "matter_id": "MAT-1", "title": "Decision one",
    })
    snapshot = InternalSnapshot(records=[InternalRecord(
        record_id="DEC-1", record_type="decision",
        path="03_Matters/one/decisions/DEC-1.md", title="Decision one",
    )], created_at=datetime.now(UTC))

    class DecisionKnowledge(KnowledgeFake):
        current = InternalSnapshot(created_at=datetime.now(UTC))

        def snapshot(self, scope):
            return self.current

    provider = ProviderFake("native", ProviderScanResult(
        provider_id="native", status="success", candidates=[DevelopmentCandidate(
            title="DEC-1 enforcement action takes effect today",
            canonical_url="https://agency.example/enforcement",
            summary="Immediate enforcement action.",
        )],
    ))
    knowledge = DecisionKnowledge()
    service = make_service(vault, RegistryFake({"native": provider}), knowledge)
    initial = await service.run_watch(watch.watch_id, "manual")
    assert initial.preview_items[0].attention_state == "briefing_only"

    knowledge.current = snapshot
    provider.result = ProviderScanResult(provider_id="native", status="success")
    result = await service.run_watch(watch.watch_id, "manual")
    assert len(result.preview_packets) == 1
    assert result.preview_items[0].review_packet_id == result.preview_packets[0].packet_id
    stored = service.briefing.get_item(result.preview_items[0].item_id)
    assert stored.review_packet_id == result.preview_packets[0].packet_id
    assert stored.attention_state == "required"
    assert stored.potential_impact == "high"
    assert stored.company_connection is not None
    assert stored.company_connection.decisions == ["DEC-1"]


def test_restart_marks_running_scan_interrupted_and_preserves_details(tmp_path):
    vault = VaultService(tmp_path)
    watch = make_watch(vault)
    service = make_service(vault, RegistryFake({}))
    running = service.briefing.append_scan(service._running_scan(
        watch, "scheduled", OutboundQueryPolicy().prepare(watch, ForbiddenCorpus(proved_no_private_identifiers=True))
    ))
    assert service.mark_interrupted_runs() == 1
    saved = service.briefing.get_scan(running.scan_id)
    assert saved.status == "interrupted"
    assert saved.outbound_query == running.outbound_query
    assert saved.completed_at is not None


@pytest.mark.asyncio
async def test_saved_view_digest_and_query_parser_fallback_use_canonical_corpus(tmp_path):
    vault = VaultService(tmp_path)
    store = BriefingStore(vault)
    now = datetime.now(UTC)
    view = store.put_view(SavedView(
        view_id="VIEW-1", path="pending", name="Privacy", query=BriefingQuery(q="privacy"),
        created_at=now, updated_at=now,
    ))
    index = IndexFake(store)
    service = BriefingQueryService(store, index, query_parser=lambda text: (_ for _ in ()).throw(ValueError("bad")))
    page = await service.query_text("privacy")
    digest = service.create_digest(view.view_id)
    assert page.resolved_query.q == "privacy"
    assert digest.view_id == view.view_id
    assert digest.resolved_query.q == "privacy"
    assert store.get_digest(digest.digest_id) == digest
