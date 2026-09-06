from datetime import UTC, datetime
from pathlib import Path

from app.models.awareness import DevelopmentCandidate, MatchConnection, MatchResult, PublicWatchQuery, WatchDraftCreate
from app.services.briefing_store import BriefingStore
from app.services.developments import DevelopmentService
from app.services.review_packets import ReviewPacketService
from app.services.vault import VaultService
from app.services.workspace_reuse import WorkspaceReuseService
from app.skills.registry import SkillRegistry


class SearchFake:
    def search_internal(self, query, *, limit=8):
        return [{"path": "03_Matters/prior/decisions/DEC-1.md", "title": "Prior decision", "score": 3, "snippet": "retention"}]


def test_prior_work_is_lexical_and_context_requires_explicit_selection(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    vault.write_markdown("03_Matters/prior/decisions/DEC-1.md", "Retention was 30 days.",
                         {"decision_id": "DEC-1", "title": "Prior decision", "status": "approved", "decided_at": "2026-01-01"})
    service = WorkspaceReuseService(vault, search=SearchFake())
    candidates = service.prior_work("current", "retention")

    assert candidates[0]["selected"] is False
    assert "Lexical" in candidates[0]["relevance"]
    assert candidates[0]["matter_id"] == "prior"
    assert candidates[0]["revision"] == candidates[0]["content_hash"]
    assert candidates[0]["differences"] == candidates[0]["important_factual_differences"]
    assert service.explicit_prior_work(candidates, [candidates[0]["path"]])[0]["selected"] is True
    vault.write_markdown("03_Matters/prior/decisions/DEC-1.md", "Retention was 90 days.",
                         {"decision_id": "DEC-1", "title": "Prior decision", "status": "approved", "decided_at": "2026-01-01"})
    assert service.prior_work("current", "retention")[0]["revision"] != candidates[0]["revision"]


def test_practice_note_is_saved_and_applied_only_by_explicit_calls(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    workspace_path = "03_Matters/current/workspace.md"
    vault.write_markdown(workspace_path, "# Workspace", {"matter_id": "MAT-1", "other": "keep"})
    service = WorkspaceReuseService(vault, skills=SkillRegistry(vault))
    note = service.save_practice_note(service.draft_practice_note(goal="write a concise memo", correction="Put the answer first."))
    applied = service.apply_practice_note("MAT-1", note["skill_id"])

    assert applied["note"]["instructions"]
    assert service.applied_practice_notes("MAT-1")[0]["skill_id"] == note["skill_id"]
    assert vault.read_markdown(workspace_path)["metadata"]["other"] == "keep"


def test_assumption_watch_links_feed_review_packet_without_mutating_decision(tmp_path: Path):
    vault = VaultService(tmp_path / "vault")
    service = WorkspaceReuseService(vault)
    watch = service.create_assumption_watch("MAT-1", WatchDraftCreate(title="Retention", standing_question="What changed?",
        public_query=PublicWatchQuery(standing_question="What changed?"), purposes=["company_impact"]), assumption_ids=["ASM-1"], decision_ids=["DEC-1"])["watch"]
    decision_path = "03_Matters/current/decisions/DEC-1.md"
    vault.write_markdown(decision_path, "Decision body", {"decision_id": "DEC-1", "title": "Old decision"})
    before = vault.read_text(decision_path)
    development = DevelopmentService(vault).record_candidates(watch["watch_id"], "native", [DevelopmentCandidate(
        title="Rule change", summary="Changed retention", occurred_at=datetime.now(UTC))]).developments[0]
    packets = ReviewPacketService(vault, BriefingStore(vault)).build(MatchResult(connections=[MatchConnection(
        development_id=development.development_id, internal_record_ids=["DEC-1"], attention_state="required", reason="Relevant", evidence=[])]))

    assert packets[0].affected_assumption_ids == ["ASM-1"]
    assert vault.read_text(decision_path) == before
