from __future__ import annotations

import pytest

from app.services.workspace import WorkspaceConflict, WorkspaceService
from app.services.workspace_flow import WorkspaceFlowService


MATTER = "MAT-DEMO-RELAY"


@pytest.fixture
def services(app_context):
    workspace = WorkspaceService(app_context.vault, app_context.matters, app_context.dossiers, app_context.matter_records)
    return WorkspaceFlowService(app_context.vault, app_context.matters, workspace, app_context.matter_records), workspace


def flow():
    return {"matter_id": MATTER, "actors": [{"actor_id": "merchant", "label": "Merchant"}, {"actor_id": "bank", "label": "Partner bank"}],
            "edges": [{"edge_id": "funds", "from_actor_id": "merchant", "to_actor_id": "bank", "label": "Funds move to the partner bank", "order": 1,
                       "timing": "At settlement", "custody": "Partner bank", "ownership": "Merchant", "uncertainty": "Confirm who controls the settlement account."}]}


def test_flow_edit_reload_proposes_facts_without_canonical_write(services):
    flows, workspace = services
    item = flows.save(MATTER, flow(), expected_revision="")
    assert item["actors"][0]["label"] == "Merchant"
    assert flows.get(MATTER)["revision"] == item["revision"]
    proposals = flows.proposed_fact_changes(MATTER)
    assert len(proposals) == 1
    assert not any("settlement account" in fact["text"].casefold() for fact in flows.records.get(MATTER)["facts"])


def test_flow_save_conflict_failed_save_retry_and_explicit_acceptance(services, monkeypatch):
    flows, workspace = services
    write = flows.vault.write_markdown
    monkeypatch.setattr(flows.vault, "write_markdown", lambda path, content, metadata=None: (_ for _ in ()).throw(OSError("disk full")))
    with pytest.raises(OSError):
        flows.save(MATTER, flow(), expected_revision="")
    monkeypatch.setattr(flows.vault, "write_markdown", write)
    item = flows.save(MATTER, flow(), expected_revision="")
    with pytest.raises(WorkspaceConflict):
        flows.save(MATTER, flow(), expected_revision="")
    proposal = flows.proposed_fact_changes(MATTER)[0]
    revisions = workspace.source_revisions(MATTER)
    with pytest.raises(ValueError, match="lawyer instruction"):
        flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions=revisions,
                                           source_action_key="flow-accept", trusted_user_action=False)
    receipt = flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions=revisions,
                                                 source_action_key="flow-accept", trusted_user_action=True)
    assert receipt["state"] == "applied"
    assert flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions=revisions,
                                              source_action_key="flow-accept", trusted_user_action=True) == receipt
    assert any(fact["fact_id"] in receipt["fact_ids"] for fact in flows.records.get(MATTER)["facts"])


def test_flow_requires_facts_revision_and_recovers_partial_metadata_save(services, monkeypatch):
    flows, workspace = services
    flows.save(MATTER, flow(), expected_revision="")
    proposal = flows.proposed_fact_changes(MATTER)[0]
    with pytest.raises(WorkspaceConflict, match="facts changed"):
        flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions={}, source_action_key="missing", trusted_user_action=True)
    revisions = workspace.source_revisions(MATTER)
    path = flows._path(MATTER)
    write = flows.vault.write_markdown
    monkeypatch.setattr(flows.vault, "write_markdown", lambda candidate, content, metadata=None: (_ for _ in ()).throw(OSError("flow metadata failed")) if candidate == path else write(candidate, content, metadata))
    with pytest.raises(OSError):
        flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions=revisions, source_action_key="partial", trusted_user_action=True)
    monkeypatch.setattr(flows.vault, "write_markdown", write)
    assert flows.accept_proposed_fact_changes(MATTER, [proposal["change_id"]], expected_revisions=revisions, source_action_key="partial", trusted_user_action=True)["state"] == "applied"


def test_flow_rejects_bad_copy_service_boundary_and_preserves_prose(services):
    flows, workspace = services
    bad = flow()
    bad["edges"][0]["to_actor_id"] = "outside"
    with pytest.raises(ValueError, match="connect actors"):
        flows.save(MATTER, bad, expected_revision="")
    item = flows.save(MATTER, flow(), expected_revision="")
    path = flows._path(MATTER)
    doc = flows.vault.read_markdown(path)
    flows.vault.update_markdown(path, content="# Business flow\n\nLawyer notes: verify timing.\n", metadata_updates={"custom": {"keep": True}})
    reloaded = flows.get(MATTER)
    assert reloaded["edges"][0]["edge_id"] == "funds"
    assert flows.vault.read_markdown(path)["metadata"]["custom"] == {"keep": True}


def test_flow_rejects_missing_and_cross_matter_fact_links(services):
    flows, workspace = services
    missing = flow()
    missing["edges"][0]["fact_ids"] = ["FACT-missing"]
    with pytest.raises(ValueError, match="fact link"):
        flows.save(MATTER, missing, expected_revision="")
    flows.records.apply_update("MAT-DEMO-APEX", facts=[{"fact_id": "FACT-apex", "text": "Apex-only fact."}])
    cross_matter = flow()
    cross_matter["edges"][0]["fact_ids"] = ["FACT-apex"]
    with pytest.raises(ValueError, match="fact link"):
        flows.save(MATTER, cross_matter, expected_revision="")
