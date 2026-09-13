"""Review can reopen collection, read a missing rule, and still finish on failure."""
from dataclasses import replace
import json

import pytest

from app.models.research_scope import ResearchScope
from app.providers.base import ProviderReply, ProviderToolCall


@pytest.mark.asyncio
@pytest.mark.parametrize("outcome", ["retrieved", "failed", "not_authorized"])
async def test_review_followup_reaches_same_reasoner_and_published_answer(app_context, monkeypatch, outcome):
    from app.services import native_research, research_reader

    query = "Synthetic operating rule"
    searches = []
    reads = []

    async def discover(public_query, selection, settings):
        searches.append(public_query)
        assert selection["agent_id"] == "research-agent"
        if len(searches) == 2 and outcome == "failed":
            raise TimeoutError("Synthetic follow-up unavailable")
        return json.dumps({"response": f"https://example.com/rule-{len(searches)}"})

    async def read(url, settings, **kwargs):
        reads.append(url)
        return {"retrieved_content": (
            "Synthetic rule: covered operators must obtain consent. See the separate definition of covered operator."
            if url.endswith("1") else
            "Synthetic definition: covered operator excludes legacy operators."
        ), "retrieval_method": "fixture"}

    class ReviewingMain:
        def __init__(self):
            self.calls = 0
            self.request_key = None
            self.passages = []

        async def complete(self, messages, tools=None):
            self.calls += 1
            last = json.loads(messages[-1]["content"]) if messages[-1]["role"] == "tool" else None

            def call(name, arguments):
                return ProviderReply(tool_calls=[ProviderToolCall(id=f"review-{self.calls}", name=name, arguments=arguments)])

            if self.calls == 1:
                return call("collect_research_evidence", {"requests": [{
                    "proposition_id": "consent", "proposition": query,
                    "public_query": query, "source_goal": "operative_rule"}]})
            if self.calls == 2:
                request = last["data"]["requests"][0]
                self.request_key = request["request_key"]
                return call("read_research_source", {"source_id": request["sources"][0]["source_id"]})
            if self.calls == 3:
                self.passages.append(last["data"]["text"])
                assert "separate definition" in self.passages[-1]
                return call("collect_research_evidence", {"requests": [{
                    "proposition_id": "scope", "proposition": "Does the definition exclude legacy operators and remove their consent requirement?",
                    "public_query": "Synthetic covered operator definition", "source_goal": "exception",
                    "followup_of": self.request_key}]})
            if self.calls == 4:
                sources = (last.get("data") or {}).get("requests", [{}])[0].get("sources", [])
                if sources:
                    return call("read_research_source", {"source_id": sources[0]["source_id"]})
                return ProviderReply(content="Consent may be required. Applicability remains unresolved; use a conditional plan.")
            self.passages.append(last["data"]["text"])
            assert "excludes legacy operators" in self.passages[-1]
            return ProviderReply(content="The definition excludes legacy operators; the consent rule does not apply to that group.")

    reviewer = ReviewingMain()
    main = replace(app_context.runner.resolve("counsel-copilot"), provider=reviewer)
    app_context.research_runs.resolve_main = lambda: main
    app_context.research_runs.resolve_selection = lambda selection: replace(main, selection=selection)
    monkeypatch.setattr(native_research, "discover", discover)
    monkeypatch.setattr(research_reader, "read_source", read)
    run = app_context.research_runs.start("MAT-DEMO-BEACON", [query], search_scope=ResearchScope(
        external=True, native=True, public_query=query, allow_followup_queries=outcome != "not_authorized"))
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get("MAT-DEMO-BEACON", run["run_id"])
    assert saved["state"] == "completed", saved
    packet = app_context.vault.read_markdown(saved["results"][0]["path"])["content"]
    if outcome == "retrieved":
        assert "does not apply to that group" in packet
        assert len(reviewer.passages) == 2
        assert len(saved["checkpoint"]["passages"]) == 2
        followup = list(saved["checkpoint"]["requests"].values())[1]
        assert followup["followup_of"] == reviewer.request_key
    else:
        assert "Applicability remains unresolved" in packet
        assert len(reviewer.passages) == 1
    assert len(searches) == (1 if outcome == "not_authorized" else 2)
    assert len(reads) == (2 if outcome == "retrieved" else 1)
