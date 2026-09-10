"""Disposable browser fixture; search responses are simulated and never billed."""
import shutil
import tempfile
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.runtime import AppContext
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderSelection, ProviderReply, ProviderToolCall
from app.services import native_research, research_reader
from app.routers import matters, system, team, settings, workspace, experimental_chat, files, chat, decisions, automations, skills, awareness

vault = Path(tempfile.mkdtemp(prefix="themis-native-browser-")) / "vault"
shutil.copytree(Path(__file__).resolve().parents[2] / "backend/tests/fixtures/vault", vault)
context = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
    llm_provider="mock", llm_api_key=None, firecrawl_api_key="fixture-only", polaris_api_key=None, tavily_api_key=None))

class Provider:
    async def complete(self, messages, tools=None):
        if any(t["function"]["name"] == "run_research" for t in tools or []) and not any(m.get("role") == "tool" for m in messages):
            return ProviderReply(tool_calls=[ProviderToolCall(id="research", name="run_research", arguments={
                "question":"What rules apply to customer due diligence?", "public_query":"Federal customer due diligence rules"})])
        return ProviderReply(content="The source supports a first-pass review of customer due diligence. This fixture uses simulated source text.")

def resolve(selection):
    return ResolvedAgentProvider(Provider(), selection)

context.runner.provider_resolver = lambda agent: resolve(ProviderSelection(agent.agent_id, "codex", "gpt-5.6-sol", "high"))
context.provider_router.resolve_selection = resolve
context.research_runs.resolve_selection = resolve
async def discover(*args, **kwargs):
    return '{"response":"Fixture source: https://example.test/public-rule"}'
async def read(*args, **kwargs):
    return {"content":"Simulated public rule. " * 20, "available_excerpt":"Simulated public rule. " * 20,
        "retrieved_content":"Simulated public rule. " * 20, "support_state":"retrieved", "retrieval_method":"direct_fetch"}
native_research.discover = discover
research_reader.read_source = read

app = FastAPI()
app.state.context = context
app.state.ready = True
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3119"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
for router in (matters.router, system.router, team.router, settings.router, workspace.router, experimental_chat.router, files.router, chat.router, decisions.router, automations.router, skills.router, awareness.router):
    app.include_router(router, prefix="/api")
print(f"Fixture vault: {vault}", flush=True)
uvicorn.run(app, host="127.0.0.1", port=8119)
