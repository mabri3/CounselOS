"""Isolated UI proof. The deterministic writer tests plumbing, not legal quality."""
import json
from pathlib import Path
import re
import shutil
import tempfile

from app.config import Settings
from app.runtime import AppContext
from app.providers.base import ProviderReply
from app.providers.mock import MockProvider
from tests.manual.serve_research_investigation import make_app


class DossierDemoProvider(MockProvider):
    async def complete(self, messages, tools=None):
        guide = "\n".join(str(m.get("content", "")) for m in messages if m.get("role") == "system")
        if "Dossier-generation action." not in guide:
            return await super().complete(messages, tools)
        supplied = next(m["content"] for m in messages if str(m.get("content", "")).startswith("Saved dossier input"))
        data = json.loads(supplied.split("\n", 1)[1])
        heading = re.findall(r"(?m)^Demo heading:\s*(.+)$", guide)
        content = "# " + (heading[-1] if heading else "Matter dossier") + "\n\n"
        content += "## Current position\n\nReview the employment terms, customer privacy, and trademark permission before the planned launch. This is deterministic browser-test content, not model legal analysis.\n\n"
        content += "## Decision question\n\n" + data["question"] + "\n\n## Issues\n\n"
        for issue in data["issues"]:
            content += "<!-- issue:" + issue["issue_id"] + " -->\n### " + issue["title"] + "\n\n"
            content += "**Current answer:** Keep this issue open pending the relevant saved terms.\n\n**Rule and support:** No external authority was retrieved in this fixture.\n\n**Application:** Use the supplied agreement and recorded facts. Do not assume that an unanswered question has been resolved.\n\n**Next step:** Obtain the relevant signed terms. Research not yet completed.\n\n"
        content += "## Next actions\n\n"
        content += "\n".join("- " + str(w.get("title", "Review saved work")) for w in data.get("work_items", [])) or "- Review the saved terms."
        return ProviderReply(content=content)


if __name__ == "__main__":
    import uvicorn
    vault = Path(tempfile.mkdtemp(prefix="dossier-generation-browser-")) / "vault"
    shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
    app = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
        llm_provider="mock", llm_api_key=None, polaris_api_key=None, search_provider="disabled"))
    root = app.matters.matter_path("MAT-DEMO-BEACON")
    app.dossiers.propose_update("MAT-DEMO-BEACON", "# Matter dossier\n\n## Decision question\n\nCan the pilot launch after the terms, privacy, and trademark review?\n", expected_hash=None, generated=True)
    app.vault.write_markdown(root + "/issues.md", "# Issues\n\n- Employment terms\n- Customer privacy\n- Trademark permission\n", {"matter_id": "MAT-DEMO-BEACON"})
    app.runner.provider = DossierDemoProvider()
    print(f"Isolated fixture vault: {vault}", flush=True)
    uvicorn.run(make_app(app, "http://localhost:3199"), host="127.0.0.1", port=8199)
