"""Owned fixture for asking questions while a real dossier chat run waits."""
import argparse
import asyncio
from pathlib import Path

from fastapi import APIRouter

from app.agents.runner import ResolvedAgentProvider
from app.config import Settings
from app.providers.base import ProviderReply, ProviderSelection
from app.runtime import AppContext
from tests.manual.serve_dossier_research import prepare_vault, seed_matter, install_fixture_boundaries
from tests.manual.serve_research_investigation import make_app


def main():
    import uvicorn
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", type=Path, required=True)
    parser.add_argument("--port", type=int, default=8204)
    parser.add_argument("--frontend-origin", default="http://127.0.0.1:3204")
    args = parser.parse_args()
    vault = prepare_vault(args.vault, reset=False)
    context = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
        llm_provider="mock", llm_api_key=None, polaris_api_key=None, tavily_api_key=None,
        firecrawl_api_key=None, search_provider="disabled"))
    issue_ids = seed_matter(context)
    install_fixture_boundaries(context, issue_ids)
    base = context.runner.resolve("counsel-copilot").provider
    gate = asyncio.Event()
    state = {"writers": 0, "questions": 0}

    class Provider:
        async def complete(self, messages, tools=None):
            raw = "\n".join(str(message.get("content") or "") for message in messages)
            if "Dossier-generation action." in raw:
                state["writers"] += 1
                try:
                    await gate.wait()
                    return await base.complete(messages, tools)
                finally:
                    state["writers"] -= 1
            if "Prepare the dossier plan" in raw:
                return await base.complete(messages, tools)
            state["questions"] += 1
            return ProviderReply(content="Your question was answered while dossier work remained independent. The five launch issues are still open.")

    provider = Provider()
    context.runner.provider = provider
    context.provider_router.resolve_selection = lambda selection: ResolvedAgentProvider(provider,
        ProviderSelection(selection.agent_id, "mock", "mock", "default"))
    app = make_app(context, args.frontend_origin)
    router = APIRouter(prefix="/fixture/dossier-background")

    @router.get("/state")
    def status():
        return {**state, "released": gate.is_set()}

    @router.post("/release")
    def release():
        gate.set()
        return status()

    @router.post("/hold")
    def hold():
        if state["writers"]:
            raise ValueError("Wait for the existing fixture writer to finish.")
        gate.clear()
        return status()

    app.include_router(router, prefix="/api")
    uvicorn.run(app, host="127.0.0.1", port=args.port)


if __name__ == "__main__":
    main()
