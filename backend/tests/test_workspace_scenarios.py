from __future__ import annotations

import pytest

from app.models.api import IntakeTurn
from app.services.workspace import WorkspaceConflict, WorkspaceService
from app.services.workspace_scenarios import WorkspaceScenarioService


MATTER = "MAT-DEMO-RELAY"


@pytest.fixture
def services(app_context):
    workspace = WorkspaceService(app_context.vault, app_context.matters, app_context.dossiers, app_context.matter_records)
    return WorkspaceScenarioService(app_context.vault, app_context.matters, workspace, app_context.matter_records), workspace


def saved(services):
    scenarios, workspace = services
    issue = workspace.issues(MATTER)[0]
    return scenarios.save(MATTER, {
        "title": "Partner controls settlement account",
        "issue_ids": [issue["issue_id"]],
        "proposed_fact_changes": [
            {"change_id": "change-control", "text": "The partner bank controls the settlement account."},
            {"change_id": "change-date", "text": "The launch moves to Monday."},
        ],
        "unresolved_conditions": ["The executed agreement is not yet supplied."],
        "analysis": "If the partner controls the account, the control analysis needs review.",
        "source_links": ["03_Matters/relay/sources/agreement.md"],
    }, source_action_key="scenario-save-1")


def test_save_reload_overlay_and_lexical_actual_match_are_historical(services):
    scenarios, workspace = services
    item = saved(services)
    reloaded = scenarios.get(MATTER, item["scenario_id"])

    assert reloaded["analysis"].startswith("If the partner")
    assert scenarios.readonly_overlay(MATTER, item["scenario_id"])["actual_matter_unchanged"] is True
    matches = scenarios.find_relevant(MATTER, "We learned the partner bank controls the settlement account.")
    assert matches[0]["scenario"]["scenario_id"] == item["scenario_id"]
    assert matches[0]["historical_analysis_only"] is True
    assert all("partner bank controls" not in fact["text"].casefold() for fact in scenarios.records.get(MATTER)["facts"])

    workspace.change_business_question(MATTER, {
        "text": "Which settlement control should we use?",
        "expected_revision": workspace.business_question(MATTER)["revision"],
        "source_action_key": "scenario-stale-question",
    })
    assert scenarios.get(MATTER, item["scenario_id"])["stale"]["is_stale"] is True


def test_selective_explicit_adoption_keeps_other_changes_hypothetical_and_retries(services):
    scenarios, workspace = services
    item = saved(services)
    revisions = workspace.source_revisions(MATTER)
    with pytest.raises(ValueError, match="lawyer instruction"):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions,
                                      source_action_key="adopt-1", trusted_user_action=False)

    result = scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions,
                                          source_action_key="adopt-1", trusted_user_action=True, source_message_id="MSG-control",
                                          related_analysis=["analysis/revised-control.md"])
    assert result["scenario_remains_historical"] is True
    assert scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions,
                                        source_action_key="adopt-1", trusted_user_action=True, source_message_id="MSG-control",
                                        related_analysis=["analysis/revised-control.md"]) == result
    record = scenarios.records.get(MATTER)
    assert any(fact["fact_id"] in result["adopted_fact_ids"] for fact in record["facts"])
    assert not any("Monday" in fact["text"] for fact in record["facts"])
    reloaded = scenarios.get(MATTER, item["scenario_id"])
    assert reloaded["adopted_fact_ids"] == result["adopted_fact_ids"]
    with pytest.raises(WorkspaceConflict, match="action key"):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-date"], expected_revisions=revisions,
                                     source_action_key="adopt-1", trusted_user_action=True)


def test_cross_matter_and_stale_source_revisions_reject(services):
    scenarios, workspace = services
    item = saved(services)
    with pytest.raises((KeyError, ValueError)):
        scenarios.get("MAT-DEMO-APEX", item["scenario_id"])
    revisions = workspace.source_revisions(MATTER)
    scenarios.records.apply_update(MATTER, facts=[{"text": "New actual fact."}])
    with pytest.raises(WorkspaceConflict, match="facts changed"):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions,
                                     source_action_key="adopt-stale", trusted_user_action=True)


def test_explicit_real_fact_correction_supersedes_without_touching_a_scenario(services):
    scenarios, workspace = services
    scenarios.records.apply_update(MATTER, facts=[{"fact_id": "FACT-old-date", "text": "The launch is Friday."}])
    revisions = workspace.source_revisions(MATTER)
    with pytest.raises(WorkspaceConflict, match="facts changed"):
        scenarios.correct_fact(MATTER, fact_id="FACT-old-date", replacement="The launch is Monday.",
                               expected_revisions={}, source_action_key="missing-real-date", trusted_user_action=True)
    result = scenarios.correct_fact(MATTER, fact_id="FACT-old-date", replacement="The launch is Monday.",
                                    expected_revisions=revisions, source_action_key="real-date", trusted_user_action=True,
                                    affected_analysis=["analysis/launch-timing.md"])
    assert result["draft_unchanged"] is True
    record = scenarios.records.get(MATTER)
    assert next(fact for fact in record["facts"] if fact["fact_id"] == "FACT-old-date")["status"] == "superseded"
    assert scenarios.correct_fact(MATTER, fact_id="FACT-old-date", replacement="The launch is Monday.",
                                  expected_revisions=revisions, source_action_key="real-date", trusted_user_action=True,
                                  affected_analysis=["analysis/launch-timing.md"]) == result


def test_scenario_source_key_retries_and_late_analysis_do_not_overwrite_newer_work(services):
    scenarios, workspace = services
    first = scenarios.save(MATTER, {"title": "Keyed create", "analysis": "First analysis."}, source_action_key="keyed-create")
    assert scenarios.save(MATTER, {"title": "Keyed create", "analysis": "First analysis."}, source_action_key="keyed-create")["scenario_id"] == first["scenario_id"]
    with pytest.raises(WorkspaceConflict, match="action key"):
        scenarios.save(MATTER, {"title": "Keyed create", "analysis": "Changed analysis."}, source_action_key="keyed-create")
    with pytest.raises(ValueError, match="current revision"):
        scenarios.save(MATTER, {**first, "analysis": "Update"})
    updated = scenarios.save(MATTER, {**first, "analysis": "Newer lawyer analysis."}, expected_revision=first["revision"], source_action_key="update-key")
    assert scenarios.save(MATTER, {**first, "analysis": "Newer lawyer analysis."}, expected_revision=first["revision"], source_action_key="update-key") == updated
    late = scenarios.persist_analysis(MATTER, first["scenario_id"], "Useful late analysis.", expected_revision=first["revision"], source_action_key="late-run")
    assert late["not_current"] is True
    assert scenarios.vault.exists(late["historical_analysis_path"])
    assert scenarios.get(MATTER, first["scenario_id"])["analysis"] == "Newer lawyer analysis."
    assert [item["scenario_id"] for item in scenarios.list(MATTER)].count(first["scenario_id"]) == 1
    retry = scenarios.persist_analysis(MATTER, first["scenario_id"], "Useful late analysis.", expected_revision=first["revision"], source_action_key="late-run")
    assert retry["historical_analysis_path"] == late["historical_analysis_path"]
    original_bytes = scenarios.vault.resolve(late["historical_analysis_path"]).read_bytes()
    with pytest.raises(WorkspaceConflict, match="action key"):
        scenarios.persist_analysis(MATTER, first["scenario_id"], "Changed late analysis.", expected_revision=first["revision"], source_action_key="late-run")
    assert scenarios.vault.resolve(late["historical_analysis_path"]).read_bytes() == original_bytes


def test_adoption_recovers_fact_save_before_scenario_metadata_and_requires_facts_revision(services, monkeypatch):
    scenarios, workspace = services
    item = saved(services)
    with pytest.raises(WorkspaceConflict, match="facts changed"):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions={}, source_action_key="missing-facts", trusted_user_action=True)
    revisions = workspace.source_revisions(MATTER)
    write = scenarios.vault.write_markdown
    monkeypatch.setattr(scenarios.vault, "write_markdown", lambda path, content, metadata=None: (_ for _ in ()).throw(OSError("scenario metadata failed")) if path.endswith(f"/{item['scenario_id']}.md") else write(path, content, metadata))
    with pytest.raises(OSError):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions, source_action_key="partial-adopt", trusted_user_action=True)
    monkeypatch.setattr(scenarios.vault, "write_markdown", write)
    result = scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-control"], expected_revisions=revisions, source_action_key="partial-adopt", trusted_user_action=True)
    assert result["state"] == "applied"
    with pytest.raises(WorkspaceConflict, match="action key"):
        scenarios.adopt_fact_changes(MATTER, item["scenario_id"], ["change-date"], expected_revisions=revisions, source_action_key="partial-adopt", trusted_user_action=True)


def test_intake_and_direct_edit_preserve_structured_issue_identity(services):
    scenarios, workspace = services
    nodes = workspace.issues(MATTER)
    saved_nodes = workspace.save_issues(MATTER, nodes, expected_revision=workspace.issues_revision(MATTER))
    path = workspace._path(MATTER, "issues.md")
    scenarios.records.apply_intake_turn(MATTER, IntakeTurn(
        working_ask="Assess settlement controls.", issues=[saved_nodes[0]["title"], "New flow question"],
        intake_state="active", source_action_key="intake-after-structured-map",
    ))
    after_intake = workspace.issues(MATTER)
    assert [node["issue_id"] for node in after_intake[:len(saved_nodes)]] == [node["issue_id"] for node in saved_nodes]
    assert "<!-- issue:" in scenarios.vault.read_markdown(path)["content"]

    document = scenarios.vault.read_markdown(path)
    scenarios.vault.update_markdown(path, content=document["content"] + "\nLawyer prose stays here.\n")
    scenarios.records.reconcile_edited_document(path)
    after_direct_edit = workspace.issues(MATTER)
    assert [node["issue_id"] for node in after_direct_edit[:len(saved_nodes)]] == [node["issue_id"] for node in saved_nodes]
    assert len(after_direct_edit) == len({node["issue_id"] for node in after_direct_edit})
    assert "Lawyer prose stays here." in scenarios.vault.read_markdown(path)["content"]
