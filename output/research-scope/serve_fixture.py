"""Isolated source-choice browser checks. No active pointer or network providers."""
import asyncio
import shutil
import tempfile
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.runtime import AppContext
from app.routers import matters, system, team, settings, workspace, experimental_chat, files, chat, decisions, automations, skills, awareness
from app.tools.handlers import run_research
from app.tools.registry import ToolExecutionContext

vault = Path(tempfile.mkdtemp(prefix="themis-research-scope-")) / "vault"
shutil.copytree(Path(__file__).resolve().parents[2] / "backend/tests/fixtures/vault", vault)
context = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
    llm_provider="mock", llm_api_key=None, polaris_api_key=None, tavily_api_key=None,
    firecrawl_api_key=None, search_provider="disabled"))
matter_id = "MAT-DEMO-BEACON"
proposal = asyncio.run(run_research(ToolExecutionContext(app=context, matter_id=matter_id,
    trusted_user_message="Search external sources and other matters.", source_action_key="chat:browser-scope"),
    {"question": "Which customer due diligence rules apply?", "public_query": "Federal customer due diligence rules"}))
conversation = context.chat_history.append(matter_id, None, role="assistant",
    content="Choose sources for this test research request.", conversation_kind="experimental",
    operation_results=[{"action": "chat:browser-scope", "operation": "run_research", "status": "confirmation_required",
        "summary": proposal["summary"], "proposal": proposal["data"]["proposal"]}])
app = FastAPI()
app.state.context = context
app.state.ready = True
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3118"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
for router in (matters.router, system.router, team.router, settings.router, workspace.router, experimental_chat.router, files.router, chat.router, decisions.router, automations.router, skills.router, awareness.router):
    app.include_router(router, prefix="/api")
print(f"Isolated test vault: {vault}; conversation: {conversation['conversation_id']}", flush=True)
uvicorn.run(app, host="127.0.0.1", port=8118)
