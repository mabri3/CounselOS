from pathlib import Path

from app.models.awareness import BriefingItem, Development, ReviewPacket, Scan
from app.services.briefing_store import BriefingStore
from app.services.vault import VaultService
from app.services.watches import WatchStore


VAULT_ROOT = Path(__file__).resolve().parents[2] / "vault"


def test_demo_watch_and_view_parse_with_expected_scope() -> None:
    vault = VaultService(VAULT_ROOT)
    watch = WatchStore(vault).get("alternative-data")
    view = BriefingStore(vault).get_view("for-you")

    assert watch.watch_id == "alternative-data"
    assert watch.provider == "both"
    assert watch.enabled is False
    assert watch.schedule_id is None
    assert watch.status == "healthy"
    assert watch.last_successful_scan_at is not None
    assert {source.role for source in watch.sources} == {
        "primary", "secondary", "discovery_only", "excluded",
    }
    assert watch.internal_scope.decision_ids == ["DEC-DEMO-APEX-RETENTION"]
    assert view.query.watch == [watch.watch_id]


def test_demo_scan_and_development_preserve_provider_provenance() -> None:
    vault = VaultService(VAULT_ROOT)
    scan_data = vault.read_markdown(
        "05_Briefing/scans/SCAN-DEMO-ALTERNATIVE-DATA-BOTH.md"
    )["metadata"]
    development_data = vault.read_markdown(
        "05_Briefing/developments/DEV-DEMO-ALTERNATIVE-DATA.md"
    )["metadata"]
    scan = Scan.model_validate(scan_data)
    development = Development.model_validate(development_data)

    assert scan.status == "success"
    assert [result.provider_id for result in scan.provider_results] == ["native", "polaris"]
    assert set(scan.output_checkpoints) == {"native", "polaris"}
    durable_candidates = [
        candidate
        for result in scan.provider_results
        for candidate in result.candidates
    ]
    assert len(durable_candidates) == 1
    assert durable_candidates[0].title == development.title
    assert durable_candidates[0].canonical_url == development.canonical_url
    assert durable_candidates[0].summary == development.summary
    assert durable_candidates[0].sources[0].support_state == "retrieved"
    assert durable_candidates[0].sources[0].support_state != "verified"
    assert [observation.provider_id for observation in development.observations] == [
        "native", "polaris",
    ]
    assert development.observations[0].sources[0].support_state == "retrieved"
    assert development.observations[1].sources[0].support_state == "supplied"
    assert all(
        source.support_state != "verified"
        for observation in development.observations
        for source in observation.sources
    )


def test_demo_items_separate_reading_from_required_decision_review() -> None:
    vault = VaultService(VAULT_ROOT)
    store = BriefingStore(vault)
    reading = store.get_item("ITEM-DEMO-ALTERNATIVE-DATA-BRIEFING")
    decision_item = store.get_item("ITEM-DEMO-ALTERNATIVE-DATA-DECISION")
    packet = store.get_review_packet("PKT-DEMO-ALTERNATIVE-DATA")

    assert isinstance(reading, BriefingItem)
    assert reading.attention_state == "briefing_only"
    assert reading.company_connection is None
    assert reading.review_packet_id is None

    assert decision_item.attention_state == "required"
    assert decision_item.review_packet_id == packet.packet_id
    assert decision_item.company_connection is not None
    assert decision_item.company_connection.decisions == ["DEC-DEMO-APEX-RETENTION"]
    assert isinstance(packet, ReviewPacket)
    assert packet.affected_decisions == ["DEC-DEMO-APEX-RETENTION"]
    assert packet.status == "open"


def test_demo_packet_is_recommendation_not_recorded_outcome() -> None:
    vault = VaultService(VAULT_ROOT)
    packet_path = VAULT_ROOT / "05_Briefing/review-packets/PKT-DEMO-ALTERNATIVE-DATA.md"
    packet = BriefingStore(vault).get_review_packet("PKT-DEMO-ALTERNATIVE-DATA")
    outcome_root = packet_path.parent / "outcomes"

    assert packet.what_happened
    assert "recommends review" in packet_path.read_text(encoding="utf-8")
    outcome_packet_ids = {
        vault.read_markdown(path.relative_to(VAULT_ROOT))["metadata"].get("packet_id")
        for path in outcome_root.glob("*.md")
    } if outcome_root.exists() else set()
    assert packet.packet_id not in outcome_packet_ids
