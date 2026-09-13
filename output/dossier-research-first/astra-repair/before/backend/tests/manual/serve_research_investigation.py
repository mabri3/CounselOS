"""Isolated real-API browser demo. Only provider and network boundaries are fake."""
import argparse
import json
from pathlib import Path
import shutil
import tempfile

from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderReply, ProviderSelection, ProviderToolCall


class ScriptedMain:
    def __init__(self):
        self.calls = []

    async def complete(self, messages, tools=None):
        self.calls.append(messages)
        names = {t["function"]["name"] for t in tools or []}
        tool_messages = [m for m in messages if m.get("role") == "tool"]
        def call(name, arguments):
            return ProviderReply(tool_calls=[ProviderToolCall(id=f"fixture-{len(tool_messages)}", name=name, arguments=arguments)])
        if "collect_research_evidence" not in names:
            if "run_research" in names and not tool_messages:
                last_user = next((m.get("content", "") for m in reversed(messages) if m.get("role") == "user"), "")
                if "draft" in last_user.lower() and "research" not in last_user.lower():
                    return ProviderReply(content="Please send the signed agreement so we can confirm the notice deadline.")
                return call("run_research", {"question": last_user or "Research the transaction and required permission.", "public_query": "Synthetic transfer permission rule"})
            return ProviderReply(content="Choose the sources to start the research. This is a scripted test, not a live model.")
        raw = " ".join(str(m.get("content", "")) for m in messages)
        if '"external":false' in raw.lower().replace(" ", ""):
            searches = [json.loads(m["content"])["data"] for m in tool_messages if m.get("name") == "search_vault"]
            if not searches:
                return call("search_vault", {"query": "notice"})
            paths = [r["path"] for r in searches[-1].get("results", []) if "contract" in r["path"].split("/")[-1] or "termination" in r["path"].split("/")[-1]][:2]
            if len(paths) < 2 and len(searches) == 1 and searches[0].get("results"):
                root = "/".join(searches[0]["results"][0]["path"].split("/")[:2])
                return call("search_vault", {"query": "notice", "path": root + "/documents"})
            reads = [m for m in tool_messages if m.get("name") == "read_file"]
            if len(reads) < len(paths):
                return call("read_file", {"path": paths[len(reads)]})
            if len(reads) != 2 or "30 days" not in raw or "60 days" not in raw:
                return ProviderReply(content="The two supplied notice clauses could not both be read. Obtain both versions before choosing a notice date.")
            return ProviderReply(content="The supplied contract versions conflict: 30 days versus 60 days. Use the longer 60-day period until Legal confirms which signed version controls. Procurement should collect the executed agreement before sending notice. Owner and notice date remain unconfirmed. No public source was requested.")
        collected = [json.loads(m["content"])["data"] for m in tool_messages if m.get("name") == "collect_research_evidence"]
        if not collected:
            return call("collect_research_evidence", {"requests": [{"proposition_id": "transfer", "proposition": "Does permission transfer?", "public_query": "Synthetic transfer permission rule", "source_goal": "operative_rule"}]})
        if len(collected) == 1:
            request = collected[0]["requests"][0]
            return call("collect_research_evidence", {"requests": [{"proposition_id": "exception", "proposition": "What is the operative exception?", "public_query": "Synthetic transfer permission exception", "source_goal": "exception", "public_url": "https://example.com/fixture-rule.pdf", "followup_of": request["request_key"]}]})
        source = collected[-1]["requests"][0]["sources"][0]
        if not any(m.get("name") == "read_research_source" for m in tool_messages):
            return call("read_research_source", {"source_id": source["source_id"], "page_number": 1})
        return ProviderReply(content=f"Close preparation can continue, but keep account migration conditional on permission. The vendor overview is background. The synthetic PDF passage requires written consent and gives a limited exception. [Read the saved passage]({source['path']}).\n\n| Work | Proposed owner | Needed by | Evidence to proceed | Fallback |\n|---|---|---|---|---|\n| Confirm transfer permission | Legal | Before migration | Written consent | Keep accounts with the existing entity |\n| Check identity records | Compliance | Before migration | Current records | Repeat missing checks |\n| Review expansion | Legal and Product | Before new market launch | Applicable local rule | Limit launch scope |\n| Review promotion | Marketing and Legal | Before promotion | Approved claims | Defer promotion |\n\nNamed owners, dates, states and alert ages are unknown. Earlier generated transfer assumptions are not a sufficient basis. This is synthetic test evidence, not verified law.")


def install_boundaries(context, monkeypatch=None):
    from app.services import native_research, research_reader
    from app.intelligence.fetch import BinaryFetchResult
    main, discoveries, fetches = ScriptedMain(), [], []
    def resolve(selection):
        return ResolvedAgentProvider(main, selection)
    context.runner.provider_resolver = lambda agent: resolve(ProviderSelection(agent.agent_id, "codex", "fixture-collector" if agent.agent_id == "research-agent" else "gpt-5.6-sol", "medium"))
    context.provider_router.resolve_selection = resolve
    context.research_runs.resolve_selection = resolve
    async def discover(query, selection, settings):
        discoveries.append({"query": query, "selection": selection})
        return json.dumps({"response": "Vendor background only: https://example.com/fixture-overview"})
    async def fetch(self, url, limits):
        fetches.append(url)
        if url.endswith(".pdf"):
            import pymupdf
            doc = pymupdf.open()
            page = doc.new_page()
            page.insert_text((40, 60), "SYNTHETIC RULE: Written consent is required before transfer.\nException: express permission covers the named receiving entity.")
            return BinaryFetchResult(url, url, "application/pdf", doc.tobytes(), "utf-8")
        body = ('<html><p>Vendor background only. This overview does not establish legal permission. ' * 8 + '<a href="/fixture-rule.pdf">Operative rule PDF</a></html>').encode()
        return BinaryFetchResult(url, url, "text/html", body, "utf-8")
    if monkeypatch:
        monkeypatch.setattr(native_research, "discover", discover)
        monkeypatch.setattr(research_reader.SafeHttpFetcher, "fetch_binary", fetch)
    else:
        native_research.discover = discover
        research_reader.SafeHttpFetcher.fetch_binary = fetch
    return main, discoveries, fetches


def make_app(context, origin):
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from app.routers import matters, system, team, settings, workspace, experimental_chat, files, chat, decisions, automations, skills, awareness, dossier_requests
    app = FastAPI()
    app.state.context, app.state.ready = context, True
    app.add_middleware(CORSMiddleware, allow_origins=[origin], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
    for module in (matters, dossier_requests, system, team, settings, workspace, experimental_chat, files, chat, decisions, automations, skills, awareness):
        app.include_router(module.router, prefix="/api")
    return app


if __name__ == "__main__":
    import uvicorn
    from app.config import Settings
    from app.runtime import AppContext
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8127)
    parser.add_argument("--frontend-origin", default="http://localhost:3127")
    parser.add_argument("--resume-fixture", type=Path)
    args = parser.parse_args()
    vault = args.resume_fixture or Path(tempfile.mkdtemp(prefix="main-research-browser-")) / "vault"
    if args.resume_fixture:
        if not vault.parent.name.startswith("main-research-browser-") or vault.name != "vault":
            parser.error("Resume only a vault created by this fixture helper.")
    else:
        shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
    context = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False, llm_provider="mock", llm_api_key=None, tavily_api_key=None, firecrawl_api_key=None, polaris_api_key=None))
    install_boundaries(context)
    print(f"Isolated fixture vault: {vault}", flush=True)
    uvicorn.run(make_app(context, args.frontend_origin), host="127.0.0.1", port=args.port)
