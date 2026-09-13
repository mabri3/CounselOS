"""Isolated browser fixture for experimental chat; no active-vault pointer changes."""
import asyncio
import shutil
import tempfile
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.runtime import AppContext
from app.routers import experimental_chat, system, matters, workspace, files, chat, settings, team, decisions, skills, automations, awareness
from app.providers.base import ProviderReply, ProviderToolCall

root = Path(tempfile.mkdtemp(prefix="themis-experimental-demo-")) / "vault"
shutil.copytree(Path(__file__).parent / "fixtures" / "vault", root)
context = AppContext(Settings(vault_path=str(root), scheduler_enabled=False, llm_provider="mock", llm_model=None, llm_api_key=None, search_provider="disabled", polaris_api_key=None))
context.work_products.create_draft("MAT-DEMO-BEACON", title="Customer response", content="# Proposed response\n\nThe proposed use is limited to a pilot with participating customers.\n\nWe will review the broader scope separately.")
context.work_products.create_draft("MAT-DEMO-BEACON", title="Explanation of pilot scope", content="# Why the draft uses pilot scope\n\nThe sample request concerns a pilot. A wider rollout would require reassessing the audience and customer commitments.\n\nThis is a browser fixture, not legal advice or external research.")
class BrowserProvider:
    async def complete(self, messages, tools=None):
        instruction = next((message.get("content", "") for message in reversed(messages) if message.get("role") == "user"), "")
        if "Review comment" in instruction:
            await asyncio.sleep(2)
            if not any(message.get("tool_call_id") == "exp-scope" for message in messages):
                return ProviderReply(tool_calls=[ProviderToolCall(id="exp-scope", name="select_conversation_scope", arguments={"scope":"actual", "instruction_quote":instruction})])
            if not any(message.get("tool_call_id") == "exp-save" for message in messages):
                return ProviderReply(tool_calls=[ProviderToolCall(id="exp-save", name="save_work_product", arguments={"title":"Comment explanation", "content":"# Pilot scope explanation\n\nThe draft follows the supplied pilot scope. Expanding to all customers changes that premise and calls for reassessing customer commitments.\n\nThis is deterministic browser fixture content, not external legal research.", "kind":"draft", "operation":"create"})])
            return ProviderReply(content="The draft follows the pilot scope. I saved the longer explanation beside it. The broader rollout remains an alternative to explore.")
        return ProviderReply(content="The main issue is the scope of the proposed use. The pilot and a broader rollout need separate consideration. This browser test uses a deterministic provider; no external sources were retrieved.\n```chat-choices\n{\"question\":\"Where should we start?\",\"choices\":[\"Permission\",\"Customer commitments\"]}\n```")
context.runner.provider = BrowserProvider()
app = FastAPI()
app.state.context=context
app.state.ready=True
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3126"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
for router in (experimental_chat.router,system.router,matters.router,workspace.router,files.router,chat.router,settings.router,team.router,decisions.router,skills.router,automations.router,awareness.router):
    app.include_router(router,prefix="/api")
print(f"Isolated test vault: {root}",flush=True)
