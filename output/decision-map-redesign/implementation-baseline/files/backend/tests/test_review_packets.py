from __future__ import annotations

from datetime import UTC, datetime

from app.models.awareness import (
    BriefingItem, DevelopmentCandidate, MatchConnection, MatchResult, PublicWatchQuery,
    SourceReference, Watch, WatchSource,
)
from app.services.briefing_store import BriefingStore
from app.services.developments import DevelopmentService
from app.services.review_packets import ReviewPacketService
from app.services.vault import VaultService


def test_builds_supported_packet_with_links_and_does_not_mutate_records(tmp_path):
    vault = VaultService(tmp_path)
    store = BriefingStore(vault)
    decision_path = "03_Matters/apex/decisions/DEC-1.md"
    mitigation_path = "03_Matters/apex/mitigations/MIT-1.md"
    vault.write_markdown(decision_path, "Decision body", {
        "decision_id": "DEC-1", "matter_id": "MAT-1", "title": "Approve pilot",
        "rationale": "A 30-day cap limited collection.", "chosen_path": "Approve with limits.",
    })
    vault.write_markdown(mitigation_path, "Mitigation body", {
        "mitigation_id": "MIT-1", "matter_id": "MAT-1", "title": "Deletion job", "status": "active",
    })
    before_decision = vault.read_text(decision_path)
    before_mitigation = vault.read_text(mitigation_path)
    official = SourceReference(
        title="Agency rule", canonical_url="https://agency.gov/rule", publisher="Agency",
        effective_at=datetime(2026, 9, 1, tzinfo=UTC), support_state="verified",
    )
    commentary = SourceReference(
        title="Law firm note", canonical_url="https://example.com/note", publisher="Example LLP",
        support_state="supplied", warning="Provider citation was not retrieved.",
    )
    development = DevelopmentService(vault).record_candidates("WATCH-1", "native", [DevelopmentCandidate(
        title="Retention rule", summary="A regulator changed the retention rule.",
        occurred_at=datetime(2026, 8, 29, tzinfo=UTC), sources=[commentary, official],
        provider_observation="Official rule and commentary.",
    )]).developments[0]
    now = datetime.now(UTC)
    watch = Watch(
        watch_id="WATCH-1", path="00_System/legal-awareness/watches/WATCH-1.md",
        title="Retention", standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"),
        purposes=["company_impact"], sources=[
            WatchSource(source_id="S-LAW", name="Law firm", canonical_url=commentary.canonical_url,
                        source_type="secondary_legal_analysis", role="primary"),
            WatchSource(source_id="S-GOV", name="Agency", canonical_url=official.canonical_url,
                        source_type="regulator_material", role="secondary"),
        ], created_at=now, updated_at=now,
    )
    vault.write_markdown(watch.path, "Retention Watch", watch.model_dump(mode="json"))
    store.put_item(BriefingItem(
        item_id="ITEM-1", path="pending", development_id=development.development_id,
        watch_id="WATCH-1", title=development.title, summary=development.summary,
        why_shown="Watch match", created_at=now, updated_at=now,
    ))
    result = MatchResult(connections=[MatchConnection(
        development_id=development.development_id,
        internal_record_ids=["DEC-1", "MIT-1"], attention_state="required",
        reason="Prior decision may conflict.", evidence=["Retention changed from 30 days."],
    )], warnings=["One secondary check failed."])

    packets = ReviewPacketService(vault, store).build(result)
    assert len(packets) == 1
    packet = packets[0]
    assert packet.review_priority == "today" and packet.potential_impact == "high"
    assert packet.affected_decisions == ["DEC-1"]
    assert packet.affected_mitigations == ["MIT-1"]
    assert packet.briefing_item_ids == ["ITEM-1"]
    assert "30-day cap" in packet.prior_decision_basis
    assert packet.existing_mitigations == ["Deletion job — active"]
    assert packet.effective_dates == [datetime(2026, 9, 1, tzinfo=UTC).date()]
    assert str(packet.sources[0].canonical_url) == "https://example.com/note"
    assert [source.support_state for source in packet.sources] == ["supplied", "verified"]
    assert any("not retrieved" in warning for warning in packet.warnings)
    assert store.get_review_packet(packet.packet_id).path == packet.path
    assert vault.read_text(decision_path) == before_decision
    assert vault.read_text(mitigation_path) == before_mitigation


def test_briefing_only_stays_useful_without_forcing_packet(tmp_path):
    vault = VaultService(tmp_path)
    store = BriefingStore(vault)
    result = MatchResult(connections=[MatchConnection(
        development_id="DEV-READ", attention_state="briefing_only",
        reason="Useful reading only.", evidence=["No local match."],
    )])
    assert ReviewPacketService(vault, store).build(result) == []
    assert result.connections[0].reason == "Useful reading only."
