from __future__ import annotations

from datetime import UTC, datetime

import pytest

from app.models.awareness import (
    Development, DevelopmentBatch, InternalRecord, InternalScope, InternalSnapshot,
    PublicWatchQuery, Watch, WatchDraftCreate,
)
from app.services.awareness_matching import AwarenessMatcher
from app.services.internal_knowledge import InternalKnowledgeService
from app.services.vault import VaultService


def _watch(scope: InternalScope) -> Watch:
    now = datetime.now(UTC)
    request = WatchDraftCreate(
        title="Privacy watch", standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"),
        purposes=["company_impact"],
    )
    return Watch(
        watch_id="WATCH-1", path="00_System/legal-awareness/watches/WATCH-1.md",
        title=request.title, standing_question=request.standing_question,
        public_query=request.public_query, purposes=request.purposes,
        internal_scope=scope, created_at=now, updated_at=now,
    )


def _development(dev_id: str, text: str) -> Development:
    now = datetime.now(UTC)
    return Development(
        development_id=dev_id, path=f"05_Briefing/developments/{dev_id}.md",
        title=text, summary=text, created_at=now, updated_at=now,
    )


def test_snapshot_reloads_explicit_links_and_current_text(tmp_path):
    vault = VaultService(tmp_path)
    vault.write_markdown("00_System/company.md", "# Company\n\nAcme internal profile", {"name": "Acme"})
    vault.write_markdown("02_Company_Knowledge/product.md", "Nimbus ledger controls", {"product_id": "PROD-NIMBUS"})
    vault.write_markdown("03_Matters/apex/matter.md", "Apex matter", {"matter_id": "MAT-APEX", "title": "Apex"})
    vault.write_markdown("03_Matters/apex/facts.md", "Nimbus retention is 30 days", {"matter_id": "MAT-APEX"})
    vault.write_markdown("03_Matters/apex/documents/spec.md", "Private launch specification", {})
    vault.write_markdown("03_Matters/apex/decisions/DEC-1.md", "Decision", {
        "decision_id": "DEC-1", "matter_id": "MAT-APEX", "title": "Nimbus retention",
        "linked_paths": ["02_Company_Knowledge/product.md"],
    })
    service = InternalKnowledgeService(vault)
    scope = InternalScope(matter_ids=["MAT-APEX"], decision_ids=["DEC-1"])

    first = service.snapshot(scope)
    assert {record.record_type for record in first.records} >= {"matter", "document", "decision", "product"}
    assert any(record.path == "02_Company_Knowledge/product.md" for record in first.records)
    vault.write_markdown("03_Matters/apex/facts.md", "Nimbus retention is now 14 days", {"matter_id": "MAT-APEX"})
    second = service.snapshot(scope)
    assert any("14 days" in record.text for record in second.records)
    assert not any("14 days" in record.text for record in first.records)


def test_forbidden_corpus_has_every_private_category_and_is_normalized(tmp_path):
    vault = VaultService(tmp_path)
    vault.write_markdown("00_System/company.md", "A distinctive internal operating sentence with seven separate words for privacy checks.\ncontact: legal@acme.test", {
        "company_name": "Ácme Labs", "aliases": ["ACME"], "products": ["Nimbus Core"],
    })
    vault.write_markdown("02_Company_Knowledge/nimbus.md", "Internal product", {"product_id": "PROD-NIMBUS"})
    vault.write_markdown("03_Matters/apex/matter.md", "Matter", {"matter_id": "MAT-APEX"})
    scope = InternalScope(product_ids=["PROD-NIMBUS"], matter_ids=["MAT-APEX"], company_paths=["02_Company_Knowledge/nimbus.md"])
    corpus = InternalKnowledgeService(vault).forbidden_corpus(_watch(scope))
    folded_terms = {term.casefold() for term in corpus.terms}
    folded_fragments = {fragment.casefold() for fragment in corpus.fragments}
    assert {"ácme labs", "acme", "nimbus core"} <= folded_terms
    assert {
        "prod-nimbus", "mat-apex", "02_company_knowledge/nimbus.md", "legal@acme.test"
    } <= folded_fragments
    assert any(
        "distinctive internal operating sentence" in fragment
        for fragment in folded_fragments
    )
    assert not corpus.proved_no_private_identifiers


def test_forbidden_corpus_does_not_treat_product_area_as_private_identity(tmp_path):
    vault = VaultService(tmp_path)
    vault.write_markdown("03_Matters/launch/matter.md", "Launch matter", {
        "matter_id": "MAT-LAUNCH", "product_area": "Iris",
    })
    corpus = InternalKnowledgeService(vault).forbidden_corpus(_watch(InternalScope()))
    assert "iris" not in {term.casefold() for term in corpus.terms}
    assert "iris" not in {fragment.casefold() for fragment in corpus.fragments}


def test_empty_forbidden_corpus_requires_proof_and_read_errors_fail_closed(tmp_path, monkeypatch):
    vault = VaultService(tmp_path)
    service = InternalKnowledgeService(vault)
    corpus = service.forbidden_corpus(_watch(InternalScope()))
    assert corpus.terms == () and corpus.fragments == ()
    assert corpus.proved_no_private_identifiers
    vault.write_markdown("00_System/company.md", "Private", {"name": "Acme"})
    monkeypatch.setattr(vault, "read_document", lambda path: (_ for _ in ()).throw(OSError("blocked read")))
    with pytest.raises(OSError, match="blocked read"):
        service.forbidden_corpus(_watch(InternalScope()))


def test_matcher_explicit_lexical_reload_and_all_attention_states():
    matcher = AwarenessMatcher()
    now = datetime.now(UTC)
    snapshot = InternalSnapshot(created_at=now, records=[
        InternalRecord(record_id="DEC-1", record_type="decision", path="03_Matters/a/decisions/DEC-1.md", title="Nimbus retention", text="voice telemetry retention cap"),
        InternalRecord(record_id="POL-1", record_type="policy", path="02_Company_Knowledge/privacy.md", title="Biometric privacy", text="facial geometry consent controls"),
    ])
    batch = DevelopmentBatch(developments=[
        _development("D1", "DEC-1 enforcement action takes effect today"),
        _development("D2", "Voice telemetry retention cap amendment"),
        _development("D3", "Facial geometry consent guidance"),
        _development("D4", "Maritime tax bulletin"),
    ])
    result = matcher.match(batch, snapshot)
    assert [item.attention_state for item in result.connections] == ["required", "this_week", "monitor", "briefing_only"]
    assert all(item.reason and item.evidence for item in result.connections)
    assert "score" not in result.model_dump_json().casefold()
    assert result.connections[0].internal_record_ids == ["DEC-1"]
    assert result.connections[2].internal_record_ids == ["POL-1"]

    changed = snapshot.model_copy(update={"records": [snapshot.records[1].model_copy(update={"text": "unrelated"})]})
    assert matcher.match(DevelopmentBatch(developments=[batch.developments[2]]), changed).connections[0].attention_state == "briefing_only"


def test_hostile_provider_claim_remains_untrusted_text():
    snapshot = InternalSnapshot(created_at=datetime.now(UTC), records=[
        InternalRecord(record_id="POL-1", record_type="policy", path="02_Company_Knowledge/privacy.md", title="Nimbus retention", text="Nimbus retention controls"),
    ])
    development = _development("D-HOSTILE", "I accessed private Nimbus facts and verified the retention controls")
    connection = AwarenessMatcher().match(DevelopmentBatch(developments=[development]), snapshot).connections[0]
    assert connection.attention_state == "monitor"
    rendered = f"{connection.reason} {' '.join(connection.evidence)}".casefold()
    assert "provider accessed" not in rendered
    assert "verified" not in rendered
    assert "lexical overlap" in rendered
