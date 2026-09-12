"""Recompose one legacy research proposal from its saved packet. No model calls.

Run from backend: .venv/bin/python -m scripts.refresh_dossier_research MATTER-ID
Uses the configured VAULT_PATH. Does not accept advice or change reported facts.
"""
from copy import deepcopy

from app.services.dossier import serialized
from app.services.dossier_research import assumption_view, prepare_publication, publication_sources, render_publication
from app.services.main_agent_research import research_basis
from app.services.recommendations import RecommendationService


@serialized
def refresh(app, matter_id):
    service = RecommendationService(app.vault, app.matters)
    current = service.get(matter_id)
    proposal = current.get("proposal") or {}
    publication = deepcopy(proposal.get("research_publication") or {})
    if not publication or publication.get("view_version") in (2, 3):
        return {"state": "not_required"}
    now = research_basis(app, matter_id)
    if any(now[k] != publication.get("basis", {}).get(k) for k in ("facts_hash", "business_question_revision")):
        return {"state": "review_required", "reason": "Saved research uses different inputs. The proposal was not changed."}
    packet = app.vault.read_markdown(publication["packet_path"])["metadata"]
    if packet.get("matter_id") != matter_id or not packet.get("run_id"):
        raise ValueError("Choose a saved research packet from this matter.")
    root = app.matters.matter_path(matter_id)
    run = app.vault.read_markdown(root + "/research/runs/" + packet["run_id"] + ".md")["metadata"]
    prose = packet.get("research_prose") or proposal["content"]
    synthesis = packet.get("research_synthesis")
    issues = app.workspace.issues(matter_id)
    publication = prepare_publication(current, run, packet, synthesis, prose, issues, publication)
    publication.pop("orientation", None)
    publication["assumption_summary"] = assumption_view(app.matter_records.get(matter_id), synthesis)
    publication["source_support"] = publication_sources(publication, issues)
    result = service.propose(matter_id, render_publication(publication, issues, current_basis=now),
                             actor="counsel-copilot", next_action=publication["next_action"], publication=publication)
    return {"state": "proposed", "path": result["path"], "dossier_projection": result["dossier_projection"]}


if __name__ == "__main__":
    import argparse
    import json
    from types import SimpleNamespace
    from app.config import Settings
    from app.services.dossier import DossierService
    from app.services.index import IndexService
    from app.services.matter_records import MatterRecordService
    from app.services.matter_state import MatterStateService
    from app.services.matters import MatterService
    from app.services.vault import VaultService
    from app.services.workflow import WorkflowService
    from app.services.workspace import WorkspaceService
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("matter_id")
    args = parser.parse_args()
    settings = Settings()
    vault = VaultService(settings.resolved_vault_path)
    index = IndexService(settings.cache_db_path, vault)
    matters = MatterService(vault, index, WorkflowService(vault), MatterStateService(vault))
    dossiers = DossierService(vault, matters)
    matters.bind_dossiers(dossiers)
    records = MatterRecordService(vault, matters)
    app = SimpleNamespace(vault=vault, matters=matters, dossiers=dossiers, matter_records=records,
                          workspace=WorkspaceService(vault, matters, dossiers, records))
    print(json.dumps(refresh(app, args.matter_id)))
