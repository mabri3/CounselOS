from __future__ import annotations

from datetime import UTC, datetime

import pytest

from app.models.awareness import ReviewPacket
from app.services.briefing_store import BriefingStore
from app.services.review_outcomes import ReviewOutcomeService


def _service_and_packet(app_context, *, packet_id="PKT-ACTION"):
    store = BriefingStore(app_context.vault)
    now = datetime.now(UTC)
    packet = store.put_review_packet(ReviewPacket(
        packet_id=packet_id,
        path="pending",
        development_ids=["DEV-1"],
        potential_impact="high",
        review_priority="today",
        attention_state="required",
        what_happened="A rule changed.",
        legal_status="effective",
        why_surfaced="It may affect the prior decision.",
        affected_matters=["MAT-DEMO-APEX"],
        affected_decisions=["DEC-DEMO-APEX-RETENTION"],
        possible_tension="The retention period may be too long.",
        created_at=now,
        updated_at=now,
    ))
    return ReviewOutcomeService(store, app_context.decisions, app_context.matters), store, packet


@pytest.mark.parametrize(
    ("action", "payload", "expected_status"),
    [
        ("not_relevant", {"reason": "Different product."}, "resolved"),
        ("keep_monitoring", {"reason": "Not effective yet."}, "monitoring"),
    ],
)
def test_non_work_outcomes_are_append_only(app_context, action, payload, expected_status):
    service, store, packet = _service_and_packet(app_context, packet_id=f"PKT-{action}")
    outcome = service.record_action(packet.packet_id, action, payload, packet.revision)
    assert outcome.action == action
    assert store.get_review_packet(packet.packet_id).status == expected_status
    outcome_path = f"05_Briefing/review-packets/outcomes/{outcome.outcome_id}.md"
    assert app_context.vault.exists(outcome_path)


def test_keep_current_updates_review_state_without_rewriting_decision_body(app_context):
    service, store, packet = _service_and_packet(app_context)
    decision = app_context.decisions.get(packet.affected_decisions[0])
    body_before = app_context.vault.read_markdown(decision["path"])["content"]

    service.record_action(packet.packet_id, "keep_current", {"note": "Still sound."}, 1)

    reviewed = app_context.decisions.get(decision["decision_id"])
    assert reviewed["review_status"] == "fresh"
    assert packet.packet_id in reviewed["review_packet_ids"]
    assert app_context.vault.read_markdown(decision["path"])["content"] == body_before
    assert store.get_review_packet(packet.packet_id).revision == 2


@pytest.mark.parametrize(
    ("action", "payload", "item_type"),
    [
        ("revise_decision", {
            "decision_id": "DEC-DEMO-APEX-RETENTION",
            "work_item_title": "Reconsider the retention decision",
        }, "decision"),
        ("create_follow_up", {
            "matter_id": "MAT-DEMO-APEX",
            "title": "Research the effective date",
        }, "follow_up"),
    ],
)
def test_work_outcomes_create_required_linked_work(app_context, action, payload, item_type):
    service, _, packet = _service_and_packet(app_context, packet_id=f"PKT-{item_type}")
    before_decision = app_context.vault.read_text(
        app_context.decisions.get("DEC-DEMO-APEX-RETENTION")["path"]
    )

    service.record_action(packet.packet_id, action, payload, 1)

    work = next(
        item for item in app_context.index.list_work_items("MAT-DEMO-APEX")
        if item["title"] == payload["work_item_title" if action == "revise_decision" else "title"]
    )
    metadata = app_context.vault.read_markdown(work["path"])["metadata"]
    assert bool(work["required"]) is True and work["item_type"] == item_type
    assert metadata["review_packet_id"] == packet.packet_id
    if action == "revise_decision":
        assert metadata["decision_id"] == "DEC-DEMO-APEX-RETENTION"
        assert app_context.vault.read_text(
            app_context.decisions.get("DEC-DEMO-APEX-RETENTION")["path"]
        ) == before_decision


def test_revision_conflict_and_open_cancel_semantics_write_nothing(app_context):
    service, store, packet = _service_and_packet(app_context)
    before_packet = app_context.vault.read_text(packet.path)
    outcomes_root = app_context.vault.resolve("05_Briefing/review-packets/outcomes")
    before_outcomes = list(outcomes_root.glob("*.md")) if outcomes_root.exists() else []

    # Reading represents opening the packet. Cancel has no service call.
    assert store.get_review_packet(packet.packet_id).packet_id == packet.packet_id
    assert app_context.vault.read_text(packet.path) == before_packet
    assert (list(outcomes_root.glob("*.md")) if outcomes_root.exists() else []) == before_outcomes

    with pytest.raises(ValueError, match="revision conflict"):
        service.record_action(packet.packet_id, "not_relevant", {}, 2)
    assert app_context.vault.read_text(packet.path) == before_packet
    assert (list(outcomes_root.glob("*.md")) if outcomes_root.exists() else []) == before_outcomes


def test_successful_outcome_refreshes_indexed_packet_state(app_context):
    service, _, packet = _service_and_packet(app_context, packet_id="PKT-INDEXED")
    app_context.index.rebuild()
    before = app_context.index._query(
        "SELECT status, attention_state, revision FROM review_packets WHERE packet_id = ?",
        (packet.packet_id,),
    )[0]
    assert before == {"status": "open", "attention_state": "required", "revision": 1}

    service.record_action(packet.packet_id, "not_relevant", {"reason": "Different product."}, 1)

    after = app_context.index._query(
        "SELECT status, attention_state, revision FROM review_packets WHERE packet_id = ?",
        (packet.packet_id,),
    )[0]
    assert after == {"status": "resolved", "attention_state": "briefing_only", "revision": 2}
