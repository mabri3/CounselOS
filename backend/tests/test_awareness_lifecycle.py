from __future__ import annotations

from datetime import UTC, datetime

from app.models.awareness import (
    DevelopmentCandidate,
    ProviderCheckpoint,
    ProviderScanResult,
    ReviewPacket,
    SourceReference,
)


class _Provider:
    provider_id = "native"
    label = "Offline native"
    configured = True

    async def scan(self, query, checkpoint):
        source = SourceReference(
            title="AI rule update",
            canonical_url="https://example.com/ai-rule",
            excerpt="A public AI rule changed.",
        )
        return ProviderScanResult(
            provider_id="native",
            status="success",
            next_checkpoint=ProviderCheckpoint(
                provider_id="native", cursor="next", last_observed_at=datetime.now(UTC)
            ),
            candidates=[DevelopmentCandidate(
                title="AI rule update",
                canonical_url="https://example.com/ai-rule",
                summary="A public AI rule changed.",
                sources=[source],
                provider_observation="A public AI rule changed.",
            )],
        )


def test_full_offline_watch_query_view_digest_lifecycle(awareness_client, app_context):
    app_context.intelligence._providers["native"] = _Provider()
    created = awareness_client.post("/api/watches/drafts", json={
        "title": "AI rules",
        "standing_question": "What public AI rules changed?",
        "public_query": {"standing_question": "What public AI rules changed?", "topics": ["AI"]},
        "purposes": ["awareness"],
        "provider": "native",
    }).json()
    scan = awareness_client.post(
        f"/api/watches/{created['watch_id']}/scan", json={"mode": "draft"}
    )
    assert scan.status_code == 200
    scan_result = scan.json()
    assert scan_result["scan"]["briefing_item_count"] >= 1
    scanned_item = next(
        item for item in scan_result["preview_items"]
        if item["watch_id"] == created["watch_id"]
        and item["title"] == "AI rule update"
        and any(source["canonical_url"] == "https://example.com/ai-rule" for source in item["sources"])
    )

    current = awareness_client.get(f"/api/watches/{created['watch_id']}").json()
    activated = awareness_client.post(
        f"/api/watches/{created['watch_id']}/activate",
        json={"expected_revision": current["revision"]},
    ).json()
    scheduled = app_context.scheduler.run(activated["schedule"]["schedule_id"])
    import asyncio
    scheduled_result = asyncio.run(scheduled)
    assert scheduled_result["status"] == "success"

    page = awareness_client.get(
        f"/api/briefing/items?watch={created['watch_id']}&topic=AI&q=AI%20rule%20update"
    ).json()
    lifecycle_item = next(
        item for item in page["items"]
        if item["item_id"] == scanned_item["item_id"]
        and item["development_id"] == scanned_item["development_id"]
    )
    view = awareness_client.post("/api/briefing/views", json={
        "name": "AI updates", "query": page["resolved_query"], "display": {}
    })
    assert view.status_code == 201
    digest = awareness_client.post(
        f"/api/briefing/views/{view.json()['view_id']}/digest"
    )
    assert digest.status_code == 200
    assert lifecycle_item["item_id"] in digest.json()["item_ids"]

    decision = app_context.decisions.get("DEC-DEMO-APEX-RETENTION")
    decision_body = app_context.vault.read_markdown(decision["path"])["content"]
    now = datetime.now(UTC)
    packet = app_context.briefing.put_review_packet(ReviewPacket(
        packet_id="PKT-API-LIFECYCLE", path="pending",
        development_ids=[lifecycle_item["development_id"]],
        briefing_item_ids=[lifecycle_item["item_id"]],
        potential_impact="high", review_priority="today", attention_state="required",
        what_happened="A public AI rule changed.", legal_status="effective",
        why_surfaced="It may affect the existing retention decision.",
        affected_matters=["MAT-DEMO-APEX"],
        affected_decisions=[decision["decision_id"]],
        possible_tension="The existing retention choice may need review.",
        created_at=now, updated_at=now,
    ))
    app_context.index.rebuild()
    outcome = awareness_client.post(
        f"/api/review-packets/{packet.packet_id}/actions",
        json={
            "action": "keep_current", "expected_revision": packet.revision,
            "payload": {"note": "The existing decision remains sound."},
        },
    )
    assert outcome.status_code == 200
    outcome_path = (
        "05_Briefing/review-packets/outcomes/"
        f"{outcome.json()['outcome_id']}.md"
    )
    assert app_context.vault.exists(outcome_path)
    resolved = app_context.briefing.get_review_packet(packet.packet_id)
    assert resolved.status == "resolved" and resolved.revision == 2
    assert app_context.vault.read_markdown(decision["path"])["content"] == decision_body


def test_startup_marks_running_awareness_scan_interrupted(app_context):
    watch = app_context.watches.create_draft(__import__(
        "app.models.awareness", fromlist=["WatchDraftCreate"]
    ).WatchDraftCreate(
        title="Restart", standing_question="What changed?",
        public_query={"standing_question": "What changed?"}, purposes=["awareness"],
    ))
    from app.models.awareness import Scan
    running = app_context.briefing.append_scan(Scan(
        scan_id="SCAN-RESTART", path="pending", watch_id=watch.watch_id,
        mode="manual", status="running", watch_revision=watch.revision,
        started_at=datetime.now(UTC),
    ))
    assert app_context.watch_scans.mark_interrupted_runs() == 1
    assert app_context.briefing.get_scan(running.scan_id).status == "interrupted"
