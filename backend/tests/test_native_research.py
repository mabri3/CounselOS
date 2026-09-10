from dataclasses import replace

import pytest

from app.models.api import ChatRequest
from app.models.research_scope import ResearchScope
from app.providers.base import ProviderReply, ProviderToolCall
from app.services import native_research, research_reader
from app.intelligence.fetch import UnsafeUrlError


@pytest.mark.asyncio
@pytest.mark.parametrize("provider,executable", [("codex", "codex"), ("antigravity_cli", "agy"), ("opencode_go", "opencode")])
async def test_native_cli_receives_public_query_model_and_effort_only(app_context, monkeypatch, provider, executable):
    calls = []
    async def command(args, **kwargs):
        calls.append((args, kwargs))
        return '{"response":"Source: https://docs.python.org/3/library/asyncio-task.html"}'
    monkeypatch.setattr(native_research, "run_cli", command)
    monkeypatch.setattr(native_research.shutil, "which", lambda _: executable)
    raw = await native_research.discover("Public question", {"provider": provider, "model": "test-model", "reasoning_effort": "high"}, app_context.settings)
    args, kwargs = calls[0]
    assert args[0] == executable
    assert any("test-model" in part for part in args)
    assert any("high" in part for part in args)
    assert "Public question" in " ".join(args)
    assert "Beacon" not in " ".join(args)
    assert native_research.source_urls(raw) == ["https://docs.python.org/3/library/asyncio-task.html"]


@pytest.mark.asyncio
@pytest.mark.parametrize("allowed", [False, True])
async def test_firecrawl_is_only_used_after_failure_and_confirmation(app_context, monkeypatch, allowed):
    calls = []
    async def failed(*args, **kwargs):
        raise RuntimeError("native unavailable")
    async def fallback(query, **kwargs):
        calls.append(query)
        return {"external": [{"url": "https://example.com", "support_state": "retrieved"}]}
    monkeypatch.setattr(native_research, "discover", failed)
    monkeypatch.setattr(app_context.search, "search_external", fallback)
    result = await native_research.search_native("Public question", ResearchScope(native=True, allow_firecrawl=allowed,
        model_selection={"provider": "codex", "model": "model"}), app_context.settings, app_context.search)
    assert bool(calls) is allowed
    assert bool(result["external"]) is allowed


@pytest.mark.asyncio
async def test_successful_native_retrieval_does_not_call_firecrawl(app_context, monkeypatch):
    async def discover(*args, **kwargs):
        return '{"response":"Read https://example.com/rule"}'
    async def read(*args, **kwargs):
        return {"content": "Real source text", "support_state": "retrieved"}
    async def forbidden(*args, **kwargs):
        pytest.fail("Firecrawl should not run")
    monkeypatch.setattr(native_research, "discover", discover)
    monkeypatch.setattr(research_reader, "read_source", read)
    monkeypatch.setattr(app_context.search, "search_external", forbidden)
    result = await native_research.search_native("Public question", ResearchScope(native=True, allow_firecrawl=True,
        model_selection={"provider": "codex", "model": "model"}), app_context.settings, app_context.search)
    assert result["external"][0]["support_state"] == "retrieved"
    assert "Read" in result["native_analysis"]


@pytest.mark.asyncio
async def test_reader_uses_browser_after_direct_fetch_fails(app_context, monkeypatch):
    async def fail(*args, **kwargs):
        raise TimeoutError()
    async def browser(url):
        return "Rendered authority text. " * 20
    monkeypatch.setattr(research_reader.SafeHttpFetcher, "fetch_binary", fail)
    monkeypatch.setattr(research_reader, "browser_read", browser)
    result = await research_reader.read_source("https://example.com", app_context.settings)
    assert result["retrieval_method"] == "playwright"
    assert result["source_hash"]
    with pytest.raises(UnsafeUrlError):
        await research_reader.read_source("https://127.0.0.1", app_context.settings, allow_firecrawl=True)


@pytest.mark.asyncio
async def test_proposal_freezes_chat_model_not_confirmation_model(app_context):
    class Provider:
        async def complete(self, messages, tools=None):
            if any(m.get("role") == "tool" for m in messages):
                return ProviderReply(content="Choose sources.")
            return ProviderReply(tool_calls=[ProviderToolCall(id="research", name="run_research", arguments={"question":"Public question", "public_query":"Public rule"})])
    resolved = app_context.runner.resolve("counsel-copilot")
    resolved = replace(resolved, provider=Provider(), selection=replace(resolved.selection, model="selected-model", reasoning_effort="high"))
    response = await app_context.runner.run(ChatRequest(message="Search externally", trusted_user_message="Search externally", matter_id="MAT-DEMO-BEACON"), resolved_provider=resolved)
    proposal = next(r for r in response.operation_results if r["operation"] == "run_research")["proposal"]
    assert proposal["main_model_selection"]["model"] == "selected-model"
    assert proposal["collector_model_selection"]["model"] == "mock"
    assert proposal["model_selection"] == proposal["collector_model_selection"]
    assert proposal["main_model_selection"]["reasoning_effort"] == "high"


@pytest.mark.asyncio
async def test_queue_uses_confirmed_model_and_preserves_selection_on_packet(app_context, monkeypatch):
    calls = []
    base = app_context.runner.resolve("research-agent")
    def resolve(selection):
        calls.append(selection)
        return replace(base, selection=selection)
    async def analysis(request, **kwargs):
        from app.models.api import ChatResponse
        assert kwargs["resolved_provider"].selection.model == "chosen-main"
        return ChatResponse(reply="Useful analysis")
    app_context.research_runs.resolve_selection = resolve
    app_context.research.bind_agent_runner(analysis)
    scope = ResearchScope(model_selection={"provider":"codex", "model":"chosen-model", "reasoning_effort":"high"}, main_model_selection={"provider":"codex", "model":"chosen-main"})
    run = app_context.research_runs.start("MAT-DEMO-BEACON", ["Public question"], search_scope=scope)
    await app_context.research_runs.wait(run["run_id"])
    saved = app_context.research_runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert saved["selection"]["model"] == "chosen-model"
    assert saved["selection"]["reasoning_effort"] == "high"
    assert {item.agent_id for item in calls} == {"research-agent", "counsel-copilot"}
    assert saved["main_selection"]["model"] == "chosen-main"
    packet = app_context.vault.read_markdown(saved["results"][0]["path"])
    assert packet["metadata"]["search_scope"]["model_selection"] == scope.model_selection


@pytest.mark.asyncio
async def test_openai_native_search_uses_responses_and_exact_effort(app_context, monkeypatch):
    import httpx
    requests = []
    async def post(self, url, **kwargs):
        requests.append((url, kwargs["json"]))
        return httpx.Response(200, request=httpx.Request("POST", url), json={"output":[
            {"type":"web_search_call", "action":{"sources":[{"url":"https://example.com/rule"}]}},
            {"type":"message", "content":[{"type":"output_text", "text":"Found a public source."}]}]})
    monkeypatch.setattr(httpx.AsyncClient, "post", post)
    settings = app_context.settings.model_copy(update={"llm_base_url":"https://api.openai.com/v1", "llm_api_key":"test"})
    raw = await native_research.discover("Public query", {"provider":"openai_compatible", "model":"chosen", "reasoning_effort":"high"}, settings)
    assert requests[0][0].endswith("/responses")
    assert requests[0][1]["reasoning"] == {"effort":"high"}
    assert requests[0][1]["tool_choice"] == "required"
    assert native_research.source_urls(raw) == ["https://example.com/rule"]
    assert native_research.answer_text(raw) == "Found a public source."


@pytest.mark.asyncio
async def test_playwright_renders_script_through_checked_fetcher(monkeypatch):
    from app.models.awareness import SafeFetchResult
    async def fetch(self, url, limits=None):
        assert url == "https://example.test/"
        return SafeFetchResult(requested_url=url, final_url=url, status_code=200,
            content_type="text/html", content_hash="test", excerpt="<body><div id='answer'></div><script>document.getElementById('answer').textContent='Rendered public rule';</script></body>")
    monkeypatch.setattr(research_reader.SafeHttpFetcher, "fetch", fetch)
    assert "Rendered public rule" in await research_reader.browser_read("https://example.test/")


@pytest.mark.asyncio
@pytest.mark.parametrize("allowed", [False, True])
async def test_page_scrape_requires_permission_after_browser_failure(app_context, monkeypatch, allowed):
    import httpx
    calls = []
    async def fail(*args, **kwargs):
        raise TimeoutError()
    async def post(self, url, **kwargs):
        calls.append(url)
        return httpx.Response(200, request=httpx.Request("POST", url), json={
            "success": True, "data": {"markdown": "Retrieved public rule. " * 20}})
    monkeypatch.setattr(research_reader.SafeHttpFetcher, "fetch_binary", fail)
    monkeypatch.setattr(research_reader, "browser_read", fail)
    monkeypatch.setattr(httpx.AsyncClient, "post", post)
    settings = app_context.settings.model_copy(update={"firecrawl_api_key": "test"})
    if allowed:
        result = await research_reader.read_source("https://example.com/rule", settings, allow_firecrawl=True)
        assert result["retrieval_method"] == "firecrawl"
    else:
        with pytest.raises(ValueError, match="No readable"):
            await research_reader.read_source("https://example.com/rule", settings)
    assert bool(calls) is allowed
