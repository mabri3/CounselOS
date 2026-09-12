"""Isolated browser fixture for scoped dossier updates across three legal areas."""
import asyncio
import json
from pathlib import Path
import shutil
import tempfile

from app.config import Settings
from app.runtime import AppContext
from app.services.recommendations import RecommendationService
from tests.manual.serve_research_investigation import make_app
from tests.test_dossier_research_continuity import install_answer


async def seed(app):
    matter_id = "MAT-DEMO-BEACON"
    root = app.matters.matter_path(matter_id)
    app.vault.write_markdown(root + "/issues.md", "# Issues\n\n- Employment terms\n- Customer privacy\n- Trademark use\n", {"matter_id": matter_id})
    RecommendationService(app.vault, app.matters).set_working(matter_id,
        "## Working position\n\nReview employment terms, customer privacy and trademark use before launch.\n\n## Support limit\n\nNo external authority was retrieved.", actor="Lawyer", origin="lawyer_edit")
    app.matter_records.apply_update(matter_id, assumptions=[{"text": "The contract term is unknown."}], actor="assistant")
    app.matter_records.apply_update(matter_id, facts=[{"text": "The signed employment agreement has a two-year term."}], actor="Lawyer")
    for issue, position in zip(app.workspace.issues(matter_id), ["Retain the negotiated employee notice period.", "Use customer data only for the agreed service."]):
        answer = {"summary": position, "issue_updates": [{"issue_id": issue["issue_id"], "position": position,
                  "next_action": "Legal: obtain the signed terms before launch."}]}
        install_answer(app, position + "\n\n```research-synthesis\n" + json.dumps(answer) + "\n```")
        app.research_runs.start(matter_id, ["Review " + issue["title"]], issue_id=issue["issue_id"])
        await app.research_runs.wait_for_active_work()


if __name__ == "__main__":
    import uvicorn
    vault = Path(tempfile.mkdtemp(prefix="dossier-continuity-browser-")) / "vault"
    shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
    app = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
                             llm_provider="mock", llm_api_key=None, tavily_api_key=None, firecrawl_api_key=None))
    asyncio.run(seed(app))
    print(f"Isolated fixture vault: {vault}", flush=True)
    uvicorn.run(make_app(app, "http://localhost:3198"), host="127.0.0.1", port=8198)
