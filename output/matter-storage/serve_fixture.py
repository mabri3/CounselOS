"""Isolated UI verification server; never reads the active-vault pointer."""
import shutil
import tempfile
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.runtime import AppContext
from app.routers import matters, system, team, settings, workspace, experimental_chat

vault = Path(tempfile.mkdtemp(prefix="themis-storage-check-")) / "vault"
shutil.copytree(Path(__file__).resolve().parents[2] / "backend/tests/fixtures/vault", vault)
context = AppContext(Settings(vault_path=str(vault), scheduler_enabled=False,
                              llm_provider="mock", llm_api_key=None, polaris_api_key=None,
                              search_provider="disabled"))
app = FastAPI()
app.state.context = context
app.state.ready = True
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3118"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
for router in (matters.router, system.router, team.router, settings.router, workspace.router, experimental_chat.router):
    app.include_router(router, prefix="/api")
print(f"Isolated test vault: {vault}", flush=True)
uvicorn.run(app, host="127.0.0.1", port=8118)
