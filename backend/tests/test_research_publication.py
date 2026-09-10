"""Synthetic publication basis with explicit action provenance in a temporary vault."""
import pytest

from app.services.matter_records import MatterRecordService
from app.services.recommendations import RecommendationService

MATTER = "MAT-DEMO-BEACON"


@pytest.fixture
def publication_basis(app_context):
    records = MatterRecordService(app_context.vault, app_context.matters)
    records.apply_update(MATTER, assumptions=[
        {"assumption_id": "ASM-SYNTHETIC-LICENSE", "text": "Synthetic assumption: licenses transfer."},
        {"assumption_id": "ASM-SYNTHETIC-IDENTITY", "text": "Synthetic assumption: prior identity checks suffice."},
    ], actor="counsel-copilot", source_action_key="synthetic-intake")
    records.apply_update(MATTER, facts=[
        {"fact_id": "FACT-SYNTHETIC-STRUCTURE", "text": "This is an asset purchase."},
    ], actor="Lawyer", source_action_key="synthetic-user-answer")
    recommendations = RecommendationService(app_context.vault, app_context.matters)
    recommendations.set_working(MATTER, "Synthetic old view. No external authority retrieved.",
                                actor="counsel-copilot", origin="initial_agent")
    return records, recommendations


def test_publication_fixture_keeps_reported_fact_and_generated_assumptions_separate(publication_basis):
    records, recommendations = publication_basis
    record = records.get(MATTER)
    fact = next(item for item in record["facts"] if item["fact_id"] == "FACT-SYNTHETIC-STRUCTURE")
    action = next(item for item in record["actions"] if item["action_id"] == fact["action_id"])
    assert action["actor"] == "Lawyer"
    generated = [item for item in record["assumptions"] if item["assumption_id"].startswith("ASM-SYNTHETIC")]
    assert len(generated) == 2
    assert all(item["status"] == "open" for item in generated)
    assert recommendations.get(MATTER)["proposal"] is None


def test_publication_fixture_supports_independent_lawyer_edit(app_context, publication_basis):
    dossier = app_context.dossiers.get(MATTER)
    edited = dossier["content"] + "\nSynthetic independent lawyer note.\n"
    app_context.vault.update_markdown(dossier["path"], content=edited)
    assert app_context.vault.read_markdown(dossier["path"])["content"].strip() == edited.strip()


@pytest.mark.asyncio
async def test_direct_packet_retains_answer_without_claiming_recommendation_publication(app_context, publication_basis):
    from app.models.api import ChatResponse
    records, recommendations = publication_basis
    before = recommendations.get(MATTER)

    async def main_answer(request, **kwargs):
        return ChatResponse(reply="Synthetic new research: transfer permission needs separate evidence.")

    app_context.research.bind_agent_runner(main_answer)
    result = await app_context.research.run(MATTER, "Synthetic acquisition research", change_stage=False)
    assert "transfer permission needs separate evidence" in app_context.vault.read_markdown(result["path"])["content"]
    assert recommendations.get(MATTER)["current_version_id"] == before["current_version_id"]
    # Direct packet-only callers must not claim a new current recommendation.
    assert recommendations.get(MATTER)["proposal"] is None


@pytest.mark.asyncio
@pytest.mark.parametrize("change", ["none", "facts", "dossier"])
async def test_real_research_publication_returns_to_origin_and_preserves_changes(app_context, publication_basis, change):
    import json
    from dataclasses import replace
    from app.providers.base import ProviderReply
    from app.services.research_publication import publish_research_result
    records, recommendations = publication_basis
    conversation = app_context.chat_history.append(MATTER, None, role="user", content="Research the synthetic asset purchase.")
    baseline_fact_count = len(records.get(MATTER)["facts"])
    edited = None
    class Main:
        async def complete(self, messages, tools=None):
            nonlocal edited
            if change == "facts":
                records.apply_update(MATTER, facts=[{"text": "A later explicit fact changes the scope."}], actor="Lawyer")
            if change == "dossier":
                current = app_context.dossiers.get(MATTER)
                app_context.vault.update_markdown(current["path"], content=current["content"] + "\nLawyer's live edit.\n")
                edited = app_context.vault.resolve(current["path"]).read_bytes()
            structure = {"summary": "Obtain specific permission before migration.", "recommendation": "Synthetic new view: obtain permission before migration.",
                         "next_action": "Integration lead (unassigned): obtain permission before migration.", "change_summary": "Do not rely on automatic transfer.",
                         "assumption_updates": [{"assumption_id": "ASM-SYNTHETIC-LICENSE", "disposition": "not_relied_on", "reason": "Transfer is not established.", "basis_fact_ids": [], "basis_source_ids": []}]}
            return ProviderReply(content="Obtain permission before migration.\n\n```research-synthesis\n" + json.dumps(structure) + "\n```")
    base = app_context.runner.resolve("counsel-copilot")
    main = replace(base, provider=Main())
    app_context.research_runs.resolve_main = lambda: main
    app_context.research_runs.resolve_selection = lambda selection: replace(main, selection=selection)
    run = app_context.research_runs.start(MATTER, ["Synthetic asset purchase rule"], origin_conversation_id=conversation["conversation_id"], origin_message_id=conversation["messages"][0]["message_id"])
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed", saved
    messages = app_context.chat_history.get(MATTER, conversation["conversation_id"])["messages"]
    completion = [m for m in messages if m.get("run_id") == run["run_id"] and m["role"] == "assistant"]
    assert len(completion) == 1
    assert "Obtain specific permission" in completion[0]["content"]
    assert "research-synthesis" not in completion[0]["content"]
    if change == "facts":
        assert recommendations.get(MATTER)["proposal"] is None
        assert "earlier facts" in completion[0]["content"]
    else:
        assert recommendations.get(MATTER)["proposal"]["content"].startswith("Synthetic new view")
        assert len(records.get(MATTER)["facts"]) == baseline_fact_count
        assert next(a for a in records.get(MATTER)["assumptions"] if a["assumption_id"] == "ASM-SYNTHETIC-LICENSE")["status"] == "retired"
    if edited:
        assert app_context.vault.resolve(app_context.dossiers.get(MATTER)["path"]).read_bytes() == edited
    packet_path = saved["results"][0]["path"]
    packet = app_context.vault.read_markdown(packet_path)["metadata"]
    before = recommendations.get(MATTER)
    publish_research_result(app_context, matter_id=MATTER, run_id=run["run_id"], packet_path=packet_path, prose=packet["research_prose"], synthesis=packet["research_synthesis"])
    assert recommendations.get(MATTER) == before
    assert len([m for m in app_context.chat_history.get(MATTER, conversation["conversation_id"])["messages"] if m.get("run_id") == run["run_id"]]) == 1


@pytest.mark.asyncio
async def test_restart_after_conversation_write_before_receipt_replays_without_model(app_context, monkeypatch):
    from app.runtime import AppContext
    from tests.manual.serve_research_investigation import install_boundaries
    main, discoveries, fetches = install_boundaries(app_context, monkeypatch)
    conversation = app_context.chat_history.append(MATTER, None, role="user", content="Research synthetic permission.")
    original = app_context.chat_history.upsert_run_assistant
    def fail_after_write(*args, **kwargs):
        original(*args, **kwargs)
        raise OSError("Synthetic crash before conversation receipt")
    monkeypatch.setattr(app_context.chat_history, "upsert_run_assistant", fail_after_write)
    # A tool-free response isolates publication from evidence collection.
    async def answer(messages, tools=None):
        from app.providers.base import ProviderReply
        main.calls.append(messages)
        return ProviderReply(content="Obtain the signed agreement before sending notice. The notice period remains conditional.")
    monkeypatch.setattr(main, "complete", answer)
    run = app_context.research_runs.start(MATTER, ["Synthetic contract notice"], origin_conversation_id=conversation["conversation_id"])
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get(MATTER, run["run_id"])
    assert saved["checkpoint"]["next_step"] == "publish"
    before = app_context.recommendations.get(MATTER) if hasattr(app_context, "recommendations") else RecommendationService(app_context.vault, app_context.matters).get(MATTER)
    call_count = len(main.calls)
    reopened = AppContext(app_context.settings)
    recovered = reopened.research_runs.get(MATTER, run["run_id"])
    assert recovered["state"] == "completed"
    assert recovered["checkpoint"]["next_step"] == "complete"
    assert RecommendationService(reopened.vault, reopened.matters).get(MATTER) == before
    messages = reopened.chat_history.get(MATTER, conversation["conversation_id"])["messages"]
    assert len([m for m in messages if m.get("run_id") == run["run_id"]]) == 1
    assert len(main.calls) == call_count and discoveries == fetches == []


@pytest.mark.asyncio
async def test_new_run_with_same_advice_keeps_new_evidence_and_revision(app_context, monkeypatch):
    from tests.manual.serve_research_investigation import install_boundaries
    from app.providers.base import ProviderReply
    from app.services.research_publication import publish_research_result
    main, _, _ = install_boundaries(app_context, monkeypatch)
    async def answer(messages, tools=None):
        return ProviderReply(content="Obtain the signed agreement before sending notice. The notice period remains conditional.")
    monkeypatch.setattr(main, "complete", answer)
    first = app_context.research_runs.start(MATTER, ["Synthetic notice rule"])
    await app_context.research_runs.wait_for_active_work()
    second = app_context.research_runs.start(MATTER, ["Synthetic notice rule"])
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get(MATTER, second["run_id"])
    assert saved["state"] == "completed"
    current = RecommendationService(app_context.vault, app_context.matters).get(MATTER)
    assert current["proposal"]["research_publication"]["key"].startswith("research:" + second["run_id"] + ":")
    assert saved["publication"]["receipts"]["dossier"]["revision_path"]
    old = app_context.research_runs.get(MATTER, first["run_id"])
    assert old["publication"]["receipts"]["dossier"]["revision_path"] != saved["publication"]["receipts"]["dossier"]["revision_path"]
    packet_path = saved["results"][0]["path"]
    packet = app_context.vault.read_markdown(packet_path)["metadata"]
    publish_research_result(app_context, matter_id=MATTER, run_id=second["run_id"], packet_path=packet_path, prose=packet["research_prose"], synthesis=packet["research_synthesis"])
    assert RecommendationService(app_context.vault, app_context.matters).get(MATTER) == current
