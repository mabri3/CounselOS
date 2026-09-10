"""Real HTTP lifecycle with scripted model and public network boundaries."""
import httpx
import pytest

from tests.manual.serve_research_investigation import install_boundaries, make_app


@pytest.mark.asyncio
@pytest.mark.parametrize("external", [True, False])
async def test_source_confirmation_pdf_followup_origin_and_publication(app_context, monkeypatch, external):
    main, discoveries, fetches = install_boundaries(app_context, monkeypatch)
    app = make_app(app_context, "http://localhost:3127")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        created = await client.post("/api/matters", json={"title": "Synthetic asset acquisition" if external else "Synthetic vendor termination", "request_text": "Research transfer permission for an asset purchase." if external else "Compare supplied vendor termination versions."})
        assert created.status_code == 201, created.text
        matter = created.json()["matter_id"]
        if not external:
            root = app_context.matters.matter_path(matter)
            app_context.vault.write_markdown(root + "/documents/contract-v1.md", "Signed version A requires 30 days notice.")
            app_context.vault.write_markdown(root + "/documents/contract-v2.md", "Version B requires 60 days notice. Signature status not confirmed.")
            app_context.index.rebuild()
        response = await client.post("/api/chat", json={"matter_id": matter, "message": "Research this matter using the available sources.", "experimental_chat": True})
        assert response.status_code == 200, response.text
        data = response.json()
        proposal = next(r for r in data["operation_results"] if r["operation"] == "run_research")
        conversation = data["conversation_id"]
        payload = {"matter_id": matter, "conversation_id": conversation, "message": "Start research", "experimental_chat": True,
                   "card_action": {"card_id": "operation-result:" + proposal["action"], "action": "apply", "values": ["yes" if external else "no", "no", "Synthetic transfer permission rule", "yes" if external else "no", "no", "yes"]}}
        confirmed = await client.post("/api/chat", json=payload)
        assert confirmed.status_code == 200, confirmed.text
        await app_context.research_runs.wait_for_active_work()
        runs = app_context.research_runs.list(matter)
        assert len(runs) == 1, runs
        run = runs[0]
        assert run["state"] == "completed", run
        assert run["publication"]["state"] == "published", run
        assert run["origin_conversation_id"] == conversation
        saved = app_context.chat_history.get(matter, conversation)
        completions = [m for m in saved["messages"] if m.get("run_id") == run["run_id"]]
        assert len(completions) == 1
        assert "Open full research" in completions[0]["content"]
        prior = (len(discoveries), len(fetches), len(main.calls))
        await client.post("/api/chat", json=payload)
        await app_context.research_runs.wait_for_active_work()
        assert len(app_context.research_runs.list(matter)) == 1
        assert (len(discoveries), len(fetches), len(main.calls)) == prior
        if external:
            assert len(discoveries) == 1
            assert fetches == ["https://example.com/fixture-overview", "https://example.com/fixture-rule.pdf"]
            cp = run["checkpoint"]
            assert len(cp["passages"]) == 1
            passage = next(iter(cp["passages"].values()))
            assert passage["page"] == 1 and "Written consent" in passage["text"]
            assert any(s.get("links") == ["https://example.com/fixture-rule.pdf"] for s in cp["sources"])
        else:
            assert discoveries == fetches == []
            assert "60-day" in completions[0]["content"]
            sources = run["checkpoint"]["local_sources"]
            assert len(sources) == 2
            assert all(source["support_state"] == "supplied" for source in sources)
            assert any("30 days" in source["available_excerpt"] for source in sources)
            assert any("60 days" in source["available_excerpt"] for source in sources)
            assert run["checkpoint"]["budget_used"]["evidence_chars"] > 0
            packet = app_context.vault.read_markdown(run["results"][0]["path"])["metadata"]
            assert {s["source_id"] for s in sources} <= {s["source_id"] for s in packet["source_records"]}
            revision = app_context.vault.read_markdown(run["publication"]["receipts"]["dossier"]["revision_path"])["content"]
            assert all(source["path"] in revision for source in sources)


@pytest.mark.asyncio
async def test_simple_drafting_uses_shared_main_checkpoint_without_research(app_context, monkeypatch):
    main, discoveries, fetches = install_boundaries(app_context, monkeypatch)
    app = make_app(app_context, "http://localhost:3127")
    matter = "MAT-DEMO-BEACON"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/chat", json={"matter_id": matter, "message": "Draft a short email asking for the signed agreement.", "experimental_chat": True, "agent_id": "counsel-copilot"})
        assert response.status_code == 200
        assert "Please send the signed agreement" in response.json()["reply"]
    assert discoveries == fetches == []
    assert app_context.research_runs.list(matter) == []
    runs = app_context.chat_runs.list(matter)
    assert len(runs) == 1 and runs[0]["state"] == "completed"
    assert runs[0]["checkpoint"]["budget_used"]["main_calls"] == 1
