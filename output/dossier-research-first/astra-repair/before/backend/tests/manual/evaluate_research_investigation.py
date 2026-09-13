"""Two bounded live evaluations using configured access and synthetic fixture data."""
import asyncio
import json
from pathlib import Path
import shutil
import tempfile
import time

from app.config import Settings
from app.runtime import AppContext
from app.models.research_scope import ResearchScope
from app.services.recommendations import RecommendationService


async def main():
    vault = Path(tempfile.mkdtemp(prefix="main-research-live-")) / "vault"
    shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
    context = AppContext(Settings().model_copy(update={"vault_path": str(vault), "scheduler_enabled": False}))
    roles = {"main": context.runner.resolve("counsel-copilot").selection, "collector": context.runner.resolve("research-agent").selection}
    from dataclasses import asdict
    print(json.dumps({"fixture_vault": str(vault), "roles": {k: asdict(v) for k,v in roles.items()} }), flush=True)
    cases = [("MAT-DEMO-BEACON", True, "Synthetic evaluation: an asset purchase of a US payments business. The deal can close before accounts migrate. Exact states, license types, legal entities and customer-alert ages are unknown. Research whether existing permissions and prior customer checks can simply be reused. Distinguish close, migration, new-market expansion and promotion. Ask for operative rules and exceptions only when they can change the practical answer. Give owner roles, evidence and fallbacks; do not invent facts."),
             ("MAT-DEMO-ORBIT", False, "Synthetic vendor termination: compare the two supplied contract versions. Explain the 30-day versus 60-day conflict, which fact would resolve it, and a practical notice plan with fallback. Use only internal sources.")]
    results = []
    for matter, external, question in cases:
        root = context.matters.matter_path(matter)
        if external:
            context.matter_records.apply_update(matter, facts=[{"text": "The transaction is an asset purchase. Account migration follows closing."}], actor="Lawyer")
            context.matter_records.apply_update(matter, assumptions=[{"text": "Existing permissions and identity checks can be reused without further work."}], actor="counsel-copilot")
            RecommendationService(context.vault, context.matters).set_working(matter, "Earlier generated position: reuse the existing permissions and identity checks.", actor="counsel-copilot", origin="initial_agent")
        else:
            context.vault.write_markdown(root + "/documents/termination-A.md", "Synthetic signed contract A: either party may terminate on 30 days written notice.")
            context.vault.write_markdown(root + "/documents/termination-B.md", "Synthetic contract B: either party may terminate on 60 days written notice. Whether this later version was signed is unknown.")
        context.index.rebuild()
        conversation = context.chat_history.append(matter, None, role="user", content=question)
        options = context.research.search_options()
        scope = ResearchScope(external=external, public_query="United States payments asset purchase license transfer customer identification requirements" if external else "", provider_ids=options["provider_ids"] if external else [], allow_followup_queries=external)
        started = time.monotonic()
        run = context.research_runs.start(matter, [question], search_scope=scope, origin_conversation_id=conversation["conversation_id"], origin_message_id=conversation["messages"][-1]["message_id"])
        try:
            await asyncio.wait_for(context.research_runs.wait_for_active_work(), 610)
        except TimeoutError:
            await context.research_runs.stop(matter)
        saved = context.research_runs.get(matter, run["run_id"])
        result = {"matter": matter, "external": external, "run_id": run["run_id"], "state": saved["state"], "seconds": round(time.monotonic()-started,2), "publication": saved.get("publication"), "budget": saved.get("checkpoint",{}).get("budget_used"), "failure": saved.get("failure_detail"), "packet_paths": [r["path"] for r in saved.get("results",[])]}
        results.append(result)
        print(json.dumps(result), flush=True)
    output = Path(__file__).resolve().parents[3] / "output/main-agent-research-dossier/live-results.json"
    output.write_text(json.dumps({"fixture_vault":str(vault), "results":results}, indent=2))
    await context.provider_router.close()

if __name__ == "__main__":
    asyncio.run(main())
