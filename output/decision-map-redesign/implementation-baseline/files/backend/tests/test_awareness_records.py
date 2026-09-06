from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

import pytest

from app.models.awareness import (
    BriefingItem, BriefingQuery, CompanyConnection, DevelopmentCandidate, Digest, DurableResult, MitigationCreate,
    MitigationPatch, ProviderCheckpoint, ProviderObservation, ProviderScanResult,
    PublicWatchQuery, SavedView, Scan, SourceReference, WatchDraftCreate, WatchPatch,
    WatchSource,
)
from app.services.briefing_store import BriefingStore
from app.services.developments import DevelopmentService
from app.services.mitigations import MitigationService
from app.services.vault import VaultService
from app.services.watches import WatchStore


@pytest.fixture()
def vault(tmp_path: Path) -> VaultService:
    return VaultService(tmp_path / "vault")


def _now() -> datetime:
    return datetime.now(UTC)


def _source(url: str = "https://example.com/rule") -> SourceReference:
    return SourceReference(title="Rule", canonical_url=url, excerpt="Bounded source excerpt")


def test_watch_crud_revision_and_source_classification(vault: VaultService) -> None:
    store = WatchStore(vault)
    created = store.create_draft(WatchDraftCreate(
        title="AI rules",
        standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"),
        purposes=["awareness"],
    ))
    assert created.enabled is False
    assert created.schedule_id is None
    source = WatchSource(
        source_id="SRC-1",
        name="Agency",
        canonical_url="https://agency.example/rules",
        source_type="regulator_material",
        role="discovery_only",
        authority_status="official_nonbinding",
    )
    updated = store.update(
        created.watch_id,
        WatchPatch(expected_revision=1, sources=[source]),
        expected_revision=1,
    )
    assert updated.revision == 2
    assert updated.sources[0].source_type == "regulator_material"
    assert updated.sources[0].role == "discovery_only"
    with pytest.raises(ValueError, match="revision conflict"):
        store.update(created.watch_id, WatchPatch(expected_revision=1, title="Stale"), 1)
    assert store.get(created.watch_id).title == "AI rules"


def test_development_exact_dedupe_versions_and_provenance(vault: VaultService) -> None:
    service = DevelopmentService(vault)
    first = DevelopmentCandidate(
        title="Rule issued",
        canonical_url="https://example.com/rule",
        official_identifier="R-1",
        content_hash="hash-1",
        provider_observation="Native observation",
        sources=[_source()],
    )
    created = service.record_candidates("WATCH-1", "native", [first])
    assert (created.created_count, created.observation_count) == (1, 1)
    duplicate = service.record_candidates("WATCH-1", "native", [first])
    assert (duplicate.created_count, duplicate.observation_count) == (0, 0)
    changed = first.model_copy(update={"content_hash": "hash-2", "provider_observation": "Changed"})
    version = service.record_candidates("WATCH-1", "polaris", [changed])
    record = version.developments[0]
    assert record.development_id == created.developments[0].development_id
    assert record.current_content_hash == "hash-2"
    assert [item.provider_id for item in record.observations] == ["native", "polaris"]
    assert str(record.observations[0].sources[0].canonical_url) == "https://example.com/rule"
    unrelated = service.record_candidates("WATCH-1", "native", [DevelopmentCandidate(
        title="Similar words", content_hash="hash-2", provider_observation="Changed"
    )])
    assert unrelated.created_count == 1
    assert unrelated.developments[0].development_id != record.development_id


def test_duplicate_observation_adds_sorted_watch_ownership_without_new_observation(
    vault: VaultService,
) -> None:
    service = DevelopmentService(vault)
    candidate = DevelopmentCandidate(
        title="Shared rule",
        canonical_url="https://example.com/shared-rule",
        content_hash="shared-v1",
    )
    first = service.record_candidates("WATCH-B", "native", [candidate])
    first_updated_at = first.developments[0].updated_at

    second = service.record_candidates("WATCH-A", "native", [candidate])

    assert second.observation_count == 0
    assert second.developments[0].watch_ids == ["WATCH-A", "WATCH-B"]
    assert second.developments[0].updated_at > first_updated_at
    assert len(second.developments[0].observations) == 1


def test_append_only_scan_and_observation(vault: VaultService) -> None:
    store = BriefingStore(vault)
    scan = Scan(
        scan_id="SCAN-1", path="ignored.md", watch_id="WATCH-1", mode="manual",
        status="running", watch_revision=1, started_at=_now(),
    )
    stored = store.append_scan(scan)
    assert stored.path == "05_Briefing/scans/SCAN-1.md"
    with pytest.raises(ValueError, match="append-only"):
        store.append_scan(scan.model_copy(update={"status": "success"}))

    development = DevelopmentService(vault).record_candidates("WATCH-1", "native", [DevelopmentCandidate(
        title="Rule", canonical_url="https://example.com/rule", content_hash="one"
    )]).developments[0]
    observation = ProviderObservation(provider_id="polaris", observed_at=_now(), content_hash="two")
    store.append_observation(development.development_id, observation)
    store.append_observation(development.development_id, observation)
    assert len(DevelopmentService(vault).get(development.development_id).observations) == 2


def test_research_records_filter_by_item_and_sort_oldest_first(vault: VaultService) -> None:
    store = BriefingStore(vault)
    newest = datetime(2026, 1, 3, tzinfo=UTC)
    oldest = datetime(2026, 1, 1, tzinfo=UTC)
    for result in (
        DurableResult(
            result_id="RES-NEW", path="pending", status="success", text="New",
            briefing_item_id="ITEM-1", question="New?", created_at=newest,
        ),
        DurableResult(
            result_id="RES-OTHER", path="pending", status="success", text="Other",
            briefing_item_id="ITEM-2", question="Other?", created_at=oldest,
        ),
        DurableResult(
            result_id="RES-OLD", path="pending", status="success", text="Old",
            briefing_item_id="ITEM-1", question="Old?", created_at=oldest,
        ),
        DurableResult(
            result_id="RES-LEGACY", path="pending", status="success", text="Legacy",
            briefing_item_id="ITEM-1",
        ),
    ):
        store.append_research(result)

    records = store.list_research("ITEM-1")
    assert [result.result_id for result in records] == [
        "RES-LEGACY", "RES-OLD", "RES-NEW",
    ]


def test_running_scan_has_one_additive_terminal_transition(vault: VaultService) -> None:
    store = BriefingStore(vault)
    started = _now()
    running = Scan(
        scan_id="SCAN-LIFECYCLE", path="ignored.md", watch_id="WATCH-1",
        mode="scheduled", status="running", watch_revision=3,
        provider_results=[ProviderScanResult(
            provider_id="native", status="partial", bounded_excerpt="Useful partial text",
            warnings=["native partial"],
        )],
        warnings=["started with warning"], created_paths=["05_Briefing/items/ITEM-1.md"],
        started_at=started,
    )
    stored = store.append_scan(running)
    terminal = stored.model_copy(update={
        "status": "partial",
        "provider_results": [ProviderScanResult(provider_id="polaris", status="failed")],
        "warnings": ["polaris failed"],
        "created_paths": ["05_Briefing/review-packets/PACKET-1.md"],
        "completed_at": _now(),
    })
    finished = store.update_scan(terminal)
    assert finished.status == "partial"
    assert [result.provider_id for result in finished.provider_results] == ["native", "polaris"]
    assert finished.warnings == ["started with warning", "polaris failed"]
    assert finished.created_paths == [
        "05_Briefing/items/ITEM-1.md", "05_Briefing/review-packets/PACKET-1.md",
    ]
    assert store.get_scan(running.scan_id) == finished
    assert store.list_scans().items == [finished]
    with pytest.raises(ValueError, match="Completed scan"):
        store.update_scan(finished.model_copy(update={"warnings": ["rewrite"]}))


@pytest.mark.parametrize("field,value", [
    ("watch_id", "WATCH-OTHER"),
    ("watch_revision", 4),
    ("input_checkpoints", {"native": ProviderCheckpoint(provider_id="native", cursor="changed")}),
    ("started_at", datetime(2020, 1, 1, tzinfo=UTC)),
])
def test_scan_update_rejects_identity_or_snapshot_rewrite(
    vault: VaultService, field: str, value: object
) -> None:
    store = BriefingStore(vault)
    running = store.append_scan(Scan(
        scan_id=f"SCAN-{field}", path="ignored.md", watch_id="WATCH-1", mode="manual",
        status="running", watch_revision=3, started_at=_now(),
    ))
    attempted = running.model_copy(update={"status": "failed", field: value})
    with pytest.raises(ValueError, match=f"Scan {field} cannot be changed"):
        store.update_scan(attempted)
    assert store.get_scan(running.scan_id).status == "running"


def test_generated_item_refresh_preserves_lawyer_triage(vault: VaultService) -> None:
    store = BriefingStore(vault)
    item = BriefingItem(
        item_id="ITEM-1", path="elsewhere.md", development_id="DEV-1", watch_id="WATCH-1",
        title="Rule", summary="Initial", why_shown="Watch match", read=True, saved=True,
        usefulness="useful", attention_state="briefing_only", revision=4,
        created_at=_now(), updated_at=_now(),
    )
    store.put_item(item)
    refreshed = store.put_item(item.model_copy(update={
        "summary": "Provider refresh", "read": False, "saved": False,
        "usefulness": None, "attention_state": "required", "potential_impact": "high",
        "company_connection": CompanyConnection(
            decisions=["DEC-1"], reason="A later decision connection was found."
        ),
    }))
    assert refreshed.summary == "Provider refresh"
    assert (refreshed.read, refreshed.saved, refreshed.usefulness) == (True, True, "useful")
    assert refreshed.attention_state == "required"
    assert refreshed.potential_impact == "high"
    assert refreshed.company_connection == CompanyConnection(
        decisions=["DEC-1"], reason="A later decision connection was found."
    )


def test_saved_view_normalization_and_digest_immutability(vault: VaultService) -> None:
    store = BriefingStore(vault)
    now = _now()
    view = SavedView(
        view_id="VIEW-1", path="ignored.md", name="Unread",
        query=BriefingQuery(read="no", topic=["privacy"], limit=10),
        created_at=now, updated_at=now,
    )
    stored_view = store.put_view(view)
    digest = Digest(
        digest_id="DIGEST-1", path="ignored.md", view_id=view.view_id,
        view_name=view.name, resolved_query=stored_view.query,
        item_ids=["ITEM-1"], title="Daily briefing", created_at=now,
    )
    store.put_digest(digest)
    store.put_view(view.model_copy(update={
        "name": "Changed", "query": BriefingQuery(read="yes"), "revision": 2,
        "updated_at": _now(),
    }))
    snapshot = store.get_digest("DIGEST-1")
    assert snapshot.view_name == "Unread"
    assert snapshot.resolved_query.read == "no"
    assert snapshot.item_ids == ["ITEM-1"]
    with pytest.raises(ValueError, match="immutable"):
        store.put_digest(digest.model_copy(update={"title": "Overwrite"}))


def test_mitigation_revision_integrity_and_vault_containment(vault: VaultService) -> None:
    service = MitigationService(vault)
    created = service.create("MAT-1", MitigationCreate(title="Human review", decision_ids=["DEC-1"]))
    updated = service.update(
        "MAT-1", created.mitigation_id,
        MitigationPatch(expected_revision=1, status="complete"), 1,
    )
    assert updated.revision == 2
    assert updated.decision_ids == ["DEC-1"]
    with pytest.raises(ValueError, match="revision conflict"):
        service.update(
            "MAT-1", created.mitigation_id,
            MitigationPatch(expected_revision=1, title="Stale"), 1,
        )
    with pytest.raises(ValueError):
        service.create("../../../outside", MitigationCreate(title="Escape"))
    assert not (vault.root.parent / "outside").exists()


def test_malformed_records_are_isolated_with_path_warning(vault: VaultService) -> None:
    store = WatchStore(vault)
    valid = store.create_draft(WatchDraftCreate(
        title="Valid", standing_question="Question?",
        public_query=PublicWatchQuery(standing_question="Question?"), purposes=["awareness"],
    ))
    malformed = "00_System/legal-awareness/watches/bad.md"
    vault.write_markdown(malformed, "bad", {"watch_id": "bad"})
    result = store.list()
    assert [item.watch_id for item in result.items] == [valid.watch_id]
    assert store.warnings and malformed in store.warnings[0]
    assert vault.read_markdown(malformed)["metadata"] == {"watch_id": "bad"}
