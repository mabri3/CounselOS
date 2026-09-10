"""Isolated browser demo for the Markdown source library.

Only the provider and network boundaries are scripted. Upload, extraction,
publication, index, search, read and publication all run the real services
against a throwaway copy of the committed fixture vault. It never points at a
real vault and never makes a paid call.

    cd backend
    .venv/bin/python -m tests.manual.serve_source_library --port 8128
    # in another shell
    cd frontend && NEXT_PUBLIC_API_BASE=http://127.0.0.1:8128/api npm run dev -- --port 3128

Resume the same vault with --resume-fixture <printed path>. Delete that
temporary directory when the walkthrough is finished.
"""
import argparse
import json
from pathlib import Path
import shutil
import tempfile

from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderReply, ProviderSelection, ProviderToolCall

MARKER = "LATE EXCEPTION: consent is not required once the regulator has published the order"
SOURCE_NAME = "synthetic-authority.pdf"
PAGES = 1000
MARKER_PAGE = 900


def synthetic_authority(pages: int = PAGES, marker_page: int = MARKER_PAGE) -> bytes:
    """A native-text PDF whose operative exception sits near the end."""
    import pymupdf

    document = pymupdf.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        body = (f"Page {number} of the synthetic authority. Clause {number} governs ordinary "
                f"operation, records and notice.")
        if number == marker_page:
            body += "\n" + MARKER + ", and the obligation"
        if number == marker_page + 1:
            body += "\ncontinues until the order is withdrawn."
        page.insert_text((72, 100), body, fontsize=10)
    data = document.tobytes()
    document.close()
    return data


class ScriptedMain:
    """Searches the saved library, reads the late page, follows the continuation."""

    def __init__(self):
        self.calls = []

    async def complete(self, messages, tools=None):
        self.calls.append(messages)
        names = {tool["function"]["name"] for tool in tools or []}
        tool_messages = [message for message in messages if message.get("role") == "tool"]

        def call(name, arguments):
            return ProviderReply(tool_calls=[ProviderToolCall(
                id=f"fixture-{len(tool_messages)}", name=name, arguments=arguments)])

        if "search_research_sources" not in names:
            if "run_research" in names and not tool_messages:
                last_user = next((m.get("content", "") for m in reversed(messages) if m.get("role") == "user"), "")
                return call("run_research", {"question": last_user or "When is consent not required?",
                                             "public_query": ""})
            return ProviderReply(content="Choose the sources to start the research. This is a scripted "
                                         "fixture, not a live model.")
        searches = [json.loads(m["content"])["data"] for m in tool_messages if m.get("name") == "search_research_sources"]
        if not searches:
            return call("search_research_sources", {"query": "LATE EXCEPTION regulator published order"})
        hits = searches[-1].get("hits") or []
        if not hits:
            return ProviderReply(content="No saved source unit matched those terms. Upload the authority "
                                         "or search with the source's own wording.")
        reads = [json.loads(m["content"])["data"] for m in tool_messages if m.get("name") == "read_research_source"]
        if not reads:
            return call("read_research_source", hits[0]["next_read"])
        last = reads[-1]
        if last.get("next_read") and len(reads) < 2:
            return call("read_research_source", {k: v for k, v in last["next_read"].items()
                                                 if k in {"source_id", "source_version", "unit_id", "start"}})
        locator = f"page {reads[0].get('page_number')}-{last.get('page_number')}"
        return ProviderReply(content=(
            "Consent is not required once the regulator has published the order, and the obligation "
            f"continues until that order is withdrawn. This rests on {locator} of the saved authority "
            f"(`{last.get('source_id')}` version `{last.get('source_version')}`). Condition: confirm the "
            "order is actually published before relying on it. Owner: Legal. Next action: verify the "
            "published order, then release the migration hold. This is synthetic fixture evidence, not "
            "verified law."))


def install_boundaries(context):
    """Scripted main provider; no collector, no network, no paid call."""
    main = ScriptedMain()

    def resolve(selection):
        return ResolvedAgentProvider(main, selection)

    context.runner.provider_resolver = lambda agent: resolve(
        ProviderSelection(agent.agent_id, "codex", "fixture-main", "medium"))
    context.provider_router.resolve_selection = resolve
    context.research_runs.resolve_selection = resolve

    async def blocked(*args, **kwargs):
        raise RuntimeError("This fixture makes no outbound request; the source library is local.")

    from app.services import native_research, research_reader
    native_research.discover = blocked
    research_reader.SafeHttpFetcher.fetch_binary = blocked
    return main


def seed_source(context, matter_id: str) -> dict:
    """Save the synthetic authority through the real upload path."""
    import asyncio
    import io
    from fastapi import UploadFile

    upload = UploadFile(filename=SOURCE_NAME, file=io.BytesIO(synthetic_authority()))
    return asyncio.run(context.ingestion.upload_to_matter(matter_id, upload))


if __name__ == "__main__":
    import uvicorn
    from app.config import Settings
    from app.runtime import AppContext
    from tests.manual.serve_research_investigation import make_app

    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8128)
    parser.add_argument("--frontend-origin", default="http://localhost:3128")
    parser.add_argument("--matter-id", default="MAT-DEMO-BEACON")
    parser.add_argument("--resume-fixture", type=Path)
    parser.add_argument("--no-seed", action="store_true",
                        help="Skip seeding so the walkthrough can upload the source in the browser.")
    arguments = parser.parse_args()
    vault = arguments.resume_fixture or Path(tempfile.mkdtemp(prefix="source-library-browser-")) / "vault"
    if arguments.resume_fixture:
        if not vault.parent.name.startswith("source-library-browser-") or vault.name != "vault":
            parser.error("Resume only a vault created by this fixture helper.")
    else:
        shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
    context = AppContext(Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False,
                                  llm_provider="mock", llm_api_key=None, tavily_api_key=None,
                                  firecrawl_api_key=None, polaris_api_key=None))
    install_boundaries(context)
    print(f"Isolated fixture vault: {vault}", flush=True)
    if not arguments.resume_fixture and not arguments.no_seed:
        result = seed_source(context, arguments.matter_id)
        print(f"Seeded {SOURCE_NAME}: {result['library_source_id']} version "
              f"{result['library_source_version']} ({result['library_extraction_state']})", flush=True)
        print(f"Catalog: {context.source_library.catalog_path(arguments.matter_id)}", flush=True)
    uvicorn.run(make_app(context, arguments.frontend_origin), host="127.0.0.1", port=arguments.port)
