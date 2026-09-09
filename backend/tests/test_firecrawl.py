import json

import httpx
import pytest

from app.config import Settings
from app.services.search import SearchService
from app.services.provider_settings_policy import ProviderSettingsPolicy


@pytest.mark.asyncio
async def test_firecrawl_maps_page_text_and_keeps_snippets_unverified(monkeypatch):
    requests = []
    real_client = httpx.AsyncClient

    def respond(request):
        requests.append(request)
        return httpx.Response(200, json={"success": True, "data": {"web": [
            {"title": "Rule", "url": "https://example.com/rule", "markdown": "Rule text" * 10000},
            {"title": "Lead", "url": "https://example.com/lead", "description": "Snippet only", "markdown": None},
        ]}})

    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: real_client(
        **kwargs, transport=httpx.MockTransport(respond)))
    service = SearchService(Settings(_env_file=None, search_provider="firecrawl", firecrawl_api_key="test-key"), None, None)
    result = await service.search_external("public rule", timeout_seconds=9)
    assert result["warning"] is None
    assert result["external"][0]["content"] == ("Rule text" * 10000)[:6000]
    assert result["external"][0]["support_state"] == "retrieved"
    from app.services.workspace_evidence import WorkspaceEvidenceService
    saved = WorkspaceEvidenceService.source_record(result["external"][0])
    assert saved["available_excerpt"] == ("Rule text" * 10000)[:6000]
    assert saved["url"] == "https://example.com/rule"
    assert saved["retrieved_at"] and saved["source_hash"]
    assert WorkspaceEvidenceService.source_record(result["external"][1])["available_excerpt"] is None
    assert result["external"][1]["support_state"] == "unverified_lead"
    assert requests[0].headers["Authorization"] == "Bearer test-key"
    assert str(requests[0].url) == "https://api.firecrawl.dev/v2/search"
    assert json.loads(requests[0].content) == {
        "query": "public rule", "limit": 6, "sources": ["web"],
        "scrapeOptions": {"formats": ["markdown"]},
    }


@pytest.mark.asyncio
async def test_firecrawl_failure_preserves_local_results_and_hides_key(monkeypatch):
    real_client = httpx.AsyncClient
    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: real_client(
        **kwargs, transport=httpx.MockTransport(lambda req: httpx.Response(401, text="test-key"))))

    class Index:
        def lexical_search(self, *args, **kwargs):
            return [{"title": "Local source"}]

    service = SearchService(Settings(_env_file=None, search_provider="firecrawl", firecrawl_api_key="test-key"), None, Index())
    result = await service.search("public rule")
    assert result["internal"] == [{"title": "Local source"}]
    assert result["external"] == []
    assert "HTTPStatusError" in result["warning"]
    assert "test-key" not in json.dumps(result)
    service.settings.firecrawl_api_key = None
    missing = await service.search_external("public rule")
    assert "not configured" in missing["warning"]
    assert missing["observability"]["attempt_count"] == 0


@pytest.mark.asyncio
async def test_firecrawl_research_saves_sources_and_preserves_public_query_boundary(app_context):
    queries = []

    async def search(query, **kwargs):
        queries.append((query, kwargs))
        return {"external": [{"title": "Agency rule", "url": "https://example.com/rule", "content": "Public rule", "available_excerpt": "Public rule", "retrieved_content": "Public rule\n\nFull retained page.", "support_state": "retrieved"}]}

    app_context.search.settings.search_provider = "firecrawl"
    app_context.search.search_external = search
    ProviderSettingsPolicy.validate_research_values({"research.primary_external_provider": "firecrawl"})
    app_context.research.configure({"primary_external_provider": "firecrawl", "fallback_external_provider": "none"})
    result = await app_context.research.run("MAT-DEMO-BEACON", "Which public rules apply?", change_stage=False)
    assert len(queries) == 1
    assert queries[0][1]["provider"] == "firecrawl"
    assert result["provider_legs"][0]["provider"] == "firecrawl"
    assert result["public_research_status"] == "retrieved"
    assert result["source_records"]
    packet = app_context.vault.read_markdown(result["path"])
    assert "https://example.com/rule" in packet["content"]
    assert any(s.get("available_excerpt") == "Public rule" for s in packet["metadata"]["source_records"])
    saved_source = next(s for s in packet["metadata"]["source_records"] if s.get("available_excerpt") == "Public rule")
    assert app_context.vault.read_markdown(saved_source["path"])["content"] == "Public rule\n\nFull retained page.\n"
    assert saved_source["source_hash"]
    queries.clear()
    private = await app_context.research.run("MAT-DEMO-BEACON", "What rules apply to MAT-DEMO-BEACON?", change_stage=False)
    assert not queries
    assert private["polaris_status"] == "privacy_blocked"
