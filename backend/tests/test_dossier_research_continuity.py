"""General matter continuity across employment, privacy and contract research."""
from dataclasses import replace
import json

import pytest

from app.models.research_investigation import extract_research_synthesis
from app.providers.base import ProviderReply, ProviderToolCall
from app.services.dossier_research import answer_next_action
from app.services.recommendations import RecommendationService

MATTER = "MAT-DEMO-BEACON"


def dossier_reply(messages):
    # These tests isolate research publication and its saved projection. The
    # separate writer keeps that projection; generation behavior has its own tests.
    if str(messages[0].get("content", "")).startswith("Dossier-generation action."):
        supplied = next(m["content"] for m in messages if str(m.get("content", "")).startswith("Saved dossier input"))
        return ProviderReply(content=json.loads(supplied.split("\n", 1)[1])["prior_dossier"])
    return None


def install_answer(app, answer):
    class Main:
        async def complete(self, messages, tools=None):
            if reply := dossier_reply(messages):
                assert [t["function"]["name"] for t in tools] == ["read_dossier_record"]
                return reply
            return ProviderReply(content=answer)
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=Main())
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)


@pytest.mark.asyncio
async def test_focused_updates_preserve_other_workstreams_through_acceptance_and_changed_facts(app_context):
    app = app_context
    root = app.matters.matter_path(MATTER)
    app.vault.write_markdown(root + "/issues.md", "# Issues\n\n- Employment terms\n- Customer privacy\n- Trademark use\n", {"matter_id": MATTER})
    issues = app.workspace.issues(MATTER)
    service = RecommendationService(app.vault, app.matters)
    baseline = "## Working position\n\nReview employment terms, customer privacy and trademark use before the launch.\n\n## Support limit\n\nNo external authority was retrieved."
    service.set_working(MATTER, baseline, actor="Lawyer", origin="lawyer_edit")
    runs = []
    for issue, position in zip(issues, ["Retain the negotiated employee notice period.", "Use customer data only for the agreed service."]):
        payload = {"summary": position, "issue_updates": [{"issue_id": issue["issue_id"], "position": position, "next_action": "Obtain the relevant signed terms."}]}
        install_answer(app, position + "\n\n```research-synthesis\n" + json.dumps(payload) + "\n```")
        run = app.research_runs.start(MATTER, ["Review " + issue["title"]], issue_id=issue["issue_id"])
        await app.research_runs.wait_for_active_work()
        runs.append(app.research_runs.get(MATTER, run["run_id"]))
        assert runs[-1]["state"] == "completed"
    proposal = service.get(MATTER)["proposal"]
    content = app.dossiers.get(MATTER)["content"]
    assert "Retain the negotiated employee notice period." in content
    assert "Use customer data only for the agreed service." in content
    assert "Trademark use" in content and "No research update saved" in content
    assert "Prior research retained" in content
    assert service.get(MATTER)["content"] == baseline
    assert len(proposal["research_publication"]["issue_positions"]) == 2
    assert proposal["next_action"] == "Obtain the relevant signed terms."
    assert all(run["results"][0]["path"] in content for run in runs)
    assert "<summary>Earlier saved position" in content
    assert app.dossiers.section(content, "Next counsel action") == "Proposed: Obtain the relevant signed terms."
    assert content.index("<summary>Earlier saved position") < content.index("No external authority was retrieved.")
    assert not app.matters.get(MATTER)["decisions"]
    service.accept(MATTER, actor="Lawyer")
    assert "Retain the negotiated employee notice period." in service.get(MATTER)["content"]
    assert "not yet accepted" not in app.dossiers.get(MATTER)["content"]
    app.matter_records.apply_update(MATTER, facts=[{"text": "The launch now covers another country."}], actor="Lawyer")
    app.dossiers.project_current_work_state(MATTER, expected_hash=app.dossiers.content_hash(MATTER))
    assert "Needs review — inputs changed" in app.dossiers.get(MATTER)["content"]


@pytest.mark.asyncio
async def test_missing_synthesis_keeps_reported_facts_and_uses_breakdown_action(app_context):
    app = app_context
    records = app.matter_records
    records.apply_update(MATTER, assumptions=[{"text": "The contract duration is unknown."}], actor="assistant")
    records.apply_update(MATTER, facts=[{"text": "The signed contract has a two-year term."}], actor="Lawyer")
    issue = app.workspace.issues(MATTER)[0]
    breakdown = {"schema_version": 1, "objective": "End the supplier agreement lawfully.",
                 "integrated_answer": "Use the signed agreement to establish the notice period.",
                 "next_step": "Procurement: obtain the signed notice clause before sending notice.",
                 "parts": [{"key": "term", "label": "Term", "description": "A two-year agreement.", "category": "timing", "status": "reported"}]}
    install_answer(app, "Use the signed agreement.\n\n```problem-analysis\n" + json.dumps(breakdown) + "\n```")
    run = app.research_runs.start(MATTER, ["Review supplier notice"], issue_id=issue["issue_id"])
    await app.research_runs.wait_for_active_work()
    saved = app.research_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed"
    current = RecommendationService(app.vault, app.matters).get(MATTER)
    version = current["proposal"] or current["versions"][-1]
    assert version["next_action"] == breakdown["next_step"]
    content = app.dossiers.get(MATTER)["content"]
    assert "Proposed next action: Unknown" not in content
    assert "Earlier assumptions awaiting reconciliation" in content
    assert "Generated assumption" in content
    assert "None explicitly identified" not in content
    assert any(f["text"] == "The signed contract has a two-year term." and f["status"] == "active" for f in records.get(MATTER)["facts"])


def test_partial_synthesis_preserves_independent_fields_and_explicit_action():
    raw = 'Keep the agreed notice period.\n```research-synthesis\n{"summary":"Keep the agreed notice period.","issue_updates":[{"issue_id":"ISS-1","position":"Notice is required."},{"bad":"entry"}]}\n```'
    prose, synthesis, warnings = extract_research_synthesis(raw)
    assert synthesis["summary"] == "Keep the agreed notice period."
    # The optional depth fields are present with defaults; the malformed entry is
    # dropped and the valid position/next_action are preserved.
    assert len(synthesis["issue_updates"]) == 1
    only = synthesis["issue_updates"][0]
    assert only["issue_id"] == "ISS-1"
    assert only["position"] == "Notice is required."
    assert only["next_action"] == ""
    assert only["analysis_markdown"] == ""
    assert only["remaining_gaps"] == [] and only["proposed_actions"] == []
    assert warnings and prose == "Keep the agreed notice period."
    assert answer_next_action(synthesis, {}, prose + "\n\n## Next action\n\nObtain the signed clause.\n\n## Sources\n\nNone.") == "Obtain the signed clause."
    assert extract_research_synthesis('```research-synthesis\n{"summary":"Keep this answer even without separate prose."}\n```')[0] == "Keep this answer even without separate prose."


@pytest.mark.asyncio
async def test_one_provider_recovery_can_read_a_saved_source_before_answering(app_context):
    from app.providers.catalog import ProviderAdapterError
    app = app_context
    root = app.matters.matter_path(MATTER)
    source_path = root + "/documents/contract.md"
    app.vault.write_markdown(source_path, "The agreed notice period is 45 days.", {"matter_id": MATTER})
    class Main:
        calls = 0
        dossier_calls = 0
        async def complete(self, messages, tools=None):
            if reply := dossier_reply(messages):
                self.dossier_calls += 1
                assert [t["function"]["name"] for t in tools] == ["read_dossier_record"]
                return reply
            self.calls += 1
            if self.calls == 1:
                raise ProviderAdapterError("Synthetic interrupted call")
            if self.calls == 2:
                assert tools and any(t["function"]["name"] == "read_file" for t in tools)
                return ProviderReply(tool_calls=[ProviderToolCall(id="read-contract", name="read_file", arguments={"path": source_path})])
            assert any("45 days" in str(m.get("content")) for m in messages if m.get("role") == "tool")
            return ProviderReply(content="Use the agreed 45-day notice period.\n\n## Next action\n\nProcurement should confirm the delivery date.")
    provider = Main()
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)
    run = app.research_runs.start(MATTER, ["Read the supplier notice clause"])
    await app.research_runs.wait_for_active_work()
    saved = app.research_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed"
    assert saved["checkpoint"]["provider_recovery_used"] is True
    assert saved["checkpoint"]["recovered_failure_class"] == "ProviderAdapterError"
    assert provider.calls == 3
    assert provider.dossier_calls == 1
    assert saved["checkpoint"]["local_sources"][0]["selected_passages"]
    assert "45-day" in app.dossiers.get(MATTER)["content"]


@pytest.mark.asyncio
async def test_repeated_provider_failure_still_delivers_one_final_answer(app_context):
    from app.providers.catalog import ProviderAdapterError
    app = app_context
    class Main:
        calls = 0
        dossier_calls = 0
        async def complete(self, messages, tools=None):
            if reply := dossier_reply(messages):
                self.dossier_calls += 1
                assert [t["function"]["name"] for t in tools] == ["read_dossier_record"]
                return reply
            self.calls += 1
            if tools:
                raise ProviderAdapterError("Synthetic repeated provider failure")
            return ProviderReply(content="Use the supplied contract. External research did not complete.")
    provider = Main()
    resolved = replace(app.runner.resolve("counsel-copilot"), provider=provider)
    app.research_runs.resolve_main = lambda: resolved
    app.research_runs.resolve_selection = lambda selection: replace(resolved, selection=selection)
    run = app.research_runs.start(MATTER, ["Research supplier notice"])
    await app.research_runs.wait_for_active_work()
    assert app.research_runs.get(MATTER, run["run_id"])["state"] == "completed"
    assert provider.calls == 3
    assert provider.dossier_calls == 1
    assert "External research did not complete" in app.dossiers.get(MATTER)["content"]


@pytest.mark.asyncio
async def test_legacy_proposal_refresh_uses_saved_answer_and_preserves_fact_and_decision_records(app_context):
    from scripts.refresh_dossier_research import refresh
    app = app_context
    issue = app.workspace.issues(MATTER)[0]
    install_answer(app, "Check the supplier notice.\n\n## Next action\n\nObtain the signed notice clause.")
    run = app.research_runs.start(MATTER, ["Research supplier notice"], issue_id=issue["issue_id"])
    await app.research_runs.wait_for_active_work()
    service = RecommendationService(app.vault, app.matters)
    current = service.get(MATTER)
    version = current.get("proposal") or current["versions"][-1]
    legacy = {k: v for k, v in version["research_publication"].items() if k in {"key", "basis", "packet_path"}}
    service.propose(MATTER, "Legacy whole-matter proposal", actor="counsel-copilot", publication=legacy)
    before = app.matter_records.get(MATTER)
    decisions = app.matters.get(MATTER)["decisions"]
    result = refresh(app, MATTER)
    assert result["state"] == "proposed"
    assert result["dossier_projection"]["state"] == "applied"
    assert service.get(MATTER)["proposal"]["research_publication"]["view_version"] in (2, 3)
    assert "Obtain the signed notice clause." in app.dossiers.get(MATTER)["content"]
    assert app.matter_records.get(MATTER) == before
    assert app.matters.get(MATTER)["decisions"] == decisions
    assert refresh(app, MATTER)["state"] == "not_required"


@pytest.mark.asyncio
async def test_implicit_issue_update_does_not_replace_the_whole_problem_breakdown(app_context):
    from tests.test_problem_analysis import payload, publish
    app = app_context
    earlier = publish(app)
    issue = app.workspace.issues(MATTER)[0]
    structure = payload()
    structure["questions"][0].update(issue_id=issue["issue_id"], assessment="Keep this issue conditional on the signed terms.")
    install_answer(app, "Focused issue research.\n\n```problem-analysis\n" + json.dumps(structure) + "\n```")
    run = app.research_runs.start(MATTER, ["Research this specific issue"])
    await app.research_runs.wait_for_active_work()
    saved = app.research_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed"
    assert app.problem_analysis.resolve(MATTER)["reference"] == earlier["reference"]
    current = RecommendationService(app.vault, app.matters).get(MATTER)
    version = current.get("proposal") or current["versions"][-1]
    assert version["research_publication"]["updated_issue_ids"] == [issue["issue_id"]]
    assert "Keep this issue conditional" in app.dossiers.get(MATTER)["content"]
