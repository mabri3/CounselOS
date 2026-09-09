"""Isolated browser acceptance app. Never uses the active-vault manager."""
import shutil
import tempfile
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.runtime import AppContext
from app.routers import system, matters, workspace, files, chat, settings, team, decisions, skills, automations, awareness
from app.services.workspace_review import WorkspaceReviewService
from test_workspace_review import learning_app, publish_paths, MATTER

root = Path(tempfile.mkdtemp(prefix="themis-choice-demo-")) / "vault"
shutil.copytree(Path(__file__).parent / "fixtures" / "vault", root)
context = AppContext(Settings(vault_path=str(root), scheduler_enabled=False, llm_provider="mock", llm_model=None,
                              llm_api_key=None, search_provider="disabled", polaris_api_key=None))
review = WorkspaceReviewService(context.vault, context.matters, context.workspace, context.matter_records)
learning_app(review)
publish_paths(review, "ISS-AGE", "RUN-choice-browser", suffix="browser")
context.work_products.create_draft(MATTER, title="Choice workflow draft", content="Lawyer wording to preserve.")
app = FastAPI()
app.state.context = context
app.state.ready = True
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3001"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
for router in (system.router, matters.router, workspace.router, files.router, chat.router, settings.router, team.router, decisions.router, skills.router, automations.router, awareness.router):
    app.include_router(router, prefix="/api")
print(f"Isolated test vault: {root}", flush=True)
