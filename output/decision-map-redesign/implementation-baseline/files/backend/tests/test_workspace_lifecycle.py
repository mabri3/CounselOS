"""Single-lawyer journeys through the real HTTP, runner, tools and saved files.

Only the language provider is deterministic. Fixtures are temporary vaults.
"""
from __future__ import annotations

import copy
import json

import httpx
import pytest
from fastapi import FastAPI

from app.providers.base import ProviderReply, ProviderToolCall
from app.routers import chat, files, matters, skills, workspace

MATTER = "MAT-DEMO-RELAY"
BASE = f"/api/matters/{MATTER}/workspace"


@pytest.fixture
def application(app_context):
    application = FastAPI()
    application.state.context = app_context
    for router in (chat.router, workspace.router, files.router, matters.router, skills.router):
        application.include_router(router, prefix="/api")
    return application


class Provider:
    def __init__(self, message, calls=(), *, scope="actual", reply="A useful conditional answer.", hook=None):
        self.message, self.calls, self.scope, self.reply, self.hook = message, calls, scope, reply, hook
        self.seen = []

    async def complete(self, messages, tools=None):
        self.seen.append((copy.deepcopy(messages), copy.deepcopy(tools)))
        if len(self.seen) == 1:
            return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": self.scope, "instruction_quote": self.message})])
        if len(self.seen) == 2:
            if self.hook:
                self.hook()
            if self.calls:
                return ProviderReply(tool_calls=[ProviderToolCall(id=f"call-{i}", name=name, arguments=values) for i, (name, values) in enumerate(self.calls)])
        return ProviderReply(content=self.reply)


async def turn(client, context, message, calls=(), *, scope="actual", hook=None, **extra):
    provider = Provider(message, calls, scope=scope, hook=hook)
    context.runner.provider = provider
    response = await client.post("/api/chat", json={"matter_id": MATTER, "message": message, **extra})
    assert response.status_code == 200, response.text
    return response.json(), provider


def save(title, content, output_type="regulatory_memorandum", **extra):
    return ("save_work_product", {"kind": "draft", "operation": "create", "title": title, "content": content, "output_type": output_type, **extra})


@pytest.mark.asyncio
async def test_memo_clause_checklist_are_distinct_saved_chat_artifacts(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        conversation = None
        for title, kind in (("Memo", "regulatory_memorandum"), ("Clause", "contract_clause_revision"), ("Checklist", "transaction_checklist")):
            reply, _ = await turn(client, app_context, f"Draft the {title}.", [save(title, f"# {title}\n\nA useful {title} body.", kind)], conversation_id=conversation, output_type=kind)
            conversation = reply["conversation_id"]
            assert any(item["status"] == "changed" for item in reply["operation_results"])
        products = (await client.get(BASE + "/drafts")).json()
        assert {p["title"] for p in products} >= {"Memo", "Clause", "Checklist"}
        selected = [p for p in products if p["title"] in {"Memo", "Clause", "Checklist"}]
        assert len({p["path"] for p in selected}) == 3
        assert all(p["template_use"]["state"] == "applied" and p["source_run_id"] for p in selected)
        history = (await client.get(f"/api/matters/{MATTER}/conversations/{conversation}")).json()
        assert [m["role"] for m in history["messages"]] == ["user", "assistant"] * 3
        assert len((await client.get(BASE)).json()["work_products"]) >= 3


@pytest.mark.asyncio
async def test_eleven_templates_crud_frozen_preview_keep_and_default(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        templates = (await client.get("/api/skills/output-templates")).json()
        assert len(templates) == 11
        starter = next(t for t in templates if t["output_type"] == "regulatory_memorandum")
        copied = await client.post(f"/api/skills/output-templates/{starter['template_id']}/duplicate", json={"new_template_id": "our-memo", "name": "Our memo"})
        assert copied.status_code == 200, copied.text
        template = copied.json()
        edited = await client.put("/api/skills/output-templates/our-memo", json={"expected_revision": template["revision"], "audience": "General counsel", "purpose": "Decision", "tone": "Direct", "length": "Under 400 words", "exclusions": "Avoid draft X", "source_presentation": "Named links", "sample_wording": "Short answer first", "instructions": "Use exactly three short sections.", "section_outline": "## Answer\n## Why\n## Next"})
        assert edited.status_code == 200, edited.text
        template = edited.json()
        assert template["audience"] == "General counsel" and template["length"] == "Under 400 words"
        assert template["exclusions"] == "Avoid draft X" and template["source_presentation"] == "Named links" and template["sample_wording"] == "Short answer first"
        assert (await client.post("/api/skills/output-templates/default", json={"output_type": "regulatory_memorandum", "template_id": "our-memo"})).status_code == 200
        matter_before = app_context.matters.get(MATTER).get("current_work_product_draft_path")
        def edit_during_run():
            app_context.skills.update_output_template("our-memo", expected_revision=template["revision"], instructions="A later template revision.")
        reply, provider = await turn(client, app_context, "Preview our memo, this time under 200 words.", [save("Preview", "## Answer\nUseful preview.\n## Why\nFact based.\n## Next\nReview it.", template_id="our-memo")], hook=edit_during_run, preview=True, template_id="our-memo", output_type="regulatory_memorandum", template_overrides={"length": "Under 200 words"})
        product = next(p for p in (await client.get(BASE + "/drafts")).json() if p["title"] == "Preview")
        assert product["preview"] is True
        assert product["template_use"]["revision"] == template["revision"]
        assert product["template_use"]["content_hash"] == template["content_hash"]
        assert product["template_use"]["overrides"] == {"length": "Under 200 words"}
        assert "A later template revision." not in json.dumps(provider.seen)
        assert app_context.matters.get(MATTER).get("current_work_product_draft_path") == matter_before
        kept = await client.post(BASE + "/drafts/keep", json={"path": product["path"], "expected_revision": product["revision"]})
        assert kept.status_code == 200 and not kept.json()["preview"]
        assert (await client.put("/api/skills/output-templates/our-memo", json={"expected_revision": template["revision"], "name": "Stale edit"})).status_code == 409


@pytest.mark.asyncio
async def test_scenario_save_is_historical_and_canonical_actions_are_denied(application, app_context):
    facts_path = f"{app_context.matters.matter_path(MATTER)}/facts.md"
    before = app_context.vault.read_text(facts_path)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        reply, provider = await turn(client, app_context, "Explore and save a hypothetical where settlement is one day later. Do not change actual facts.", [
            ("workspace_action", {"action": "save_scenario", "values": {"title": "A day later", "analysis": "The later timing changes the assumed path.", "proposed_fact_changes": [{"change_id": "later", "text": "Settlement occurs one day later."}]}}),
            ("workspace_action", {"action": "correct_fact", "values": {"fact_id": None, "replacement": "Hostile actual fact."}}),
        ], scope="scenario")
        scenarios = (await client.get(BASE + "/scenarios")).json()
        assert len(scenarios) == 1 and "later timing" in scenarios[0]["analysis"]
        assert app_context.vault.read_text(facts_path) == before
        assert any(item["status"] == "failed" for item in reply["operation_results"])
        exposed = next(t for t in provider.seen[1][1] if t["function"]["name"] == "workspace_action")
        assert exposed["function"]["parameters"]["properties"]["action"]["enum"] == ["save_scenario"]


@pytest.mark.asyncio
async def test_fact_correction_saves_offer_then_explicit_revision_keeps_review_history(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        await turn(client, app_context, "Draft a memo.", [save("Date memo", "# Memo\n\nSettlement is on September 15.")])
        artifact = next(p for p in (await client.get(BASE + "/drafts")).json() if p["title"] == "Date memo")
        path = artifact["path"]
        before = app_context.vault.read_text(path)
        correction, _ = await turn(client, app_context, "Correction: settlement is October 21. Explain the effect, but do not revise the memo yet.", [("workspace_action", {"action": "correct_fact", "values": {"fact_id": None, "replacement": "Settlement is October 21."}})])
        current = next(p for p in (await client.get(BASE)).json()["work_products"] if p["path"] == path)
        assert app_context.vault.read_text(path) == before
        assert current["update_offer"]["state"] == "offered"
        offer = current["update_offer"]
        target = {"matter_id": MATTER, "artifact_path": path, "artifact_revision": current["revision"], "artifact_review_revision": current["review_revision"]}
        revised, _ = await turn(client, app_context, "Update the selected memo. Propose the October 21 wording for review.", [("save_work_product", {"kind": "draft", "operation": "revise", "title": "Date memo", "content": "# Memo\n\nSettlement is on October 21.", "reason": "Reported settlement date changed."})], target=target, update_offer_id=offer["offer_id"])
        assert any(item["status"] == "changed" for item in revised["operation_results"])
        review = (await client.get("/api/files/review", params={"path": path})).json()
        assert review["changes"] and review["history"]
        assert "October 21" in app_context.vault.read_markdown(path)["content"]
        assert "September 15" in "".join(item["text"] for item in review["segments"] if item["kind"] != "insert")
        for mode in ("markup", "accepted_text"):
            exported = await client.get("/api/files/export", params={"path": path, "format": "docx", "mode": mode, "expected_revision": review["artifact_revision"], "expected_review_revision": review["revision"]})
            assert exported.status_code == 200 and exported.content.startswith(b"PK")


@pytest.mark.asyncio
async def test_dirty_revision_preserves_lawyer_text_and_returns_saved_proposal(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        await turn(client, app_context, "Draft a memo.", [save("Dirty memo", "Saved text.")])
        artifact = next(p for p in (await client.get(BASE + "/drafts")).json() if p["title"] == "Dirty memo")
        target = {"matter_id": MATTER, "artifact_path": artifact["path"], "artifact_revision": artifact["revision"], "artifact_review_revision": artifact["review_revision"], "local_draft_snapshot": "My unsaved lawyer edit."}
        reply, _ = await turn(client, app_context, "Propose a narrower recommendation here.", [("save_work_product", {"kind": "draft", "operation": "revise", "title": "Dirty memo", "content": "Useful proposed language."})], target=target)
        conflict = next(item["conflict"] for item in reply["operation_results"] if item.get("conflict"))
        assert app_context.vault.read_markdown(artifact["path"])["content"].strip() == "Saved text."
        assert app_context.vault.read_markdown(conflict["proposal_path"])["content"].strip() == "Useful proposed language."
        reopened = next(p for p in (await client.get(BASE + "/drafts")).json() if p["path"] == artifact["path"])
        assert conflict["proposal_path"] in reopened["proposal_paths"]


@pytest.mark.asyncio
async def test_uploaded_id_only_exclusion_blocks_original_companion_and_history(application, app_context):
    marker = "EXCLUDED-SOURCE-MARKER-4729"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        uploaded = await client.post(f"/api/matters/{MATTER}/uploads", files=[("files", ("secret.txt", marker.encode(), "text/plain")), ("files", ("unsupported.exe", b"bad", "application/octet-stream"))])
        assert uploaded.status_code == 201, uploaded.text
        result = uploaded.json()
        assert [item["state"] for item in result["results"]] == ["saved", "failed"]
        source = result["results"][0]
        reply, provider = await turn(client, app_context, "Answer using available material, excluding that file.", [("read_file", {"path": source["path"]}), ("read_file", {"path": source["extracted_path"]}), ("search_vault", {"query": marker})], context_selections=[{"reference_id": source["source_id"], "role": "supplied", "selected": False}])
        assert marker not in json.dumps(provider.seen[0][0])
        tool_messages = [m for messages, _ in provider.seen for m in messages if m["role"] == "tool"]
        assert marker not in json.dumps(tool_messages)
        assert len([item for item in reply["trace"] if item["status"] == "error"]) >= 2


@pytest.mark.asyncio
async def test_late_supporting_question_save_is_not_reported_as_saved(application, app_context):
    before = app_context.workspace.business_question(MATTER)
    def change_scope():
        app_context.workspace.change_business_question(MATTER, {"text": "A different business decision?", "expected_revision": before["revision"], "source_action_key": "late-scope"})
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        reply, _ = await turn(client, app_context, "Give an answer and note a useful optional question.", [("workspace_action", {"action": "save_question", "values": {"text": "Who has account control?", "consequence": "Control changes the path."}})], hook=change_scope)
        result = next(item for item in reply["operation_results"] if item["operation"] == "workspace_action")
        assert result["status"] == "no_change" and "not saved" in result["summary"]
        assert not app_context.workspace.questions(MATTER)


@pytest.mark.asyncio
async def test_queued_snapshot_retry_cancel_and_manifest_are_durable(application, app_context, monkeypatch):
    import asyncio
    gate = asyncio.Event()
    class WaitingProvider:
        async def complete(self, messages, tools=None):
            await gate.wait()
            return ProviderReply(content="Collected useful answer.")
    app_context.runner.provider = WaitingProvider()
    saved_manifests = []
    save_manifest = app_context.workspace_evidence.save_manifest
    def counted(value):
        saved_manifests.append(copy.deepcopy(value))
        return save_manifest(value)
    monkeypatch.setattr(app_context.workspace_evidence, "save_manifest", counted)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        templates = (await client.get("/api/skills/output-templates")).json()
        template = next(t for t in templates if t["output_type"] == "regulatory_memorandum")
        payload = {"message": "Explain the current matter.", "source_action_key": "frozen-retry", "template_id": template["template_id"], "template_overrides": {"length": "Under 200 words"}}
        started = await client.post(f"/api/matters/{MATTER}/chat-runs", json=payload)
        assert started.status_code == 202, started.text
        run = started.json()
        assert (await client.get(BASE + f"/context/{run['run_id']}")).status_code == 404
        replay = await client.post(f"/api/matters/{MATTER}/chat-runs", json=payload)
        assert replay.status_code == 202 and replay.json()["run_id"] == run["run_id"]
        widened = await client.post(f"/api/matters/{MATTER}/chat-runs", json={**payload, "template_overrides": {"length": "Long"}})
        assert widened.status_code == 409
        stopped = await client.post(f"/api/matters/{MATTER}/chat-runs/{run['run_id']}/cancel")
        assert stopped.status_code == 200 and stopped.json()["state"] == "interrupted"
        manifest = await client.get(BASE + f"/context/{run['run_id']}")
        assert manifest.status_code == 200
        assert len(saved_manifests) == 1
        assert (await client.post(f"/api/matters/{MATTER}/chat-runs/{run['run_id']}/cancel")).status_code == 200
        assert len(saved_manifests) == 1
        history = (await client.get(f"/api/matters/{MATTER}/conversations/{run['conversation_id']}")).json()
        assert len([m for m in history["messages"] if m["role"] == "user"]) == 1


@pytest.mark.asyncio
async def test_uploaded_source_added_during_answer_keeps_historical_output(application, app_context):
    import asyncio
    gate = asyncio.Event()
    class WaitingProvider:
        async def complete(self, messages, tools=None):
            await gate.wait()
            return ProviderReply(content="Useful analysis from the original submitted context.")
    app_context.runner.provider = WaitingProvider()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        before = (await client.get(BASE)).json()
        started = (await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": "Explain the matter."})).json()
        await client.post(f"/api/matters/{MATTER}/uploads", files=[("files", ("new-info.txt", b"A later supplied fact.", "text/plain"))])
        gate.set()
        await app_context.chat_runs.wait(started["run_id"])
        run = (await client.get(f"/api/matters/{MATTER}/chat-runs/{started['run_id']}")).json()
        assert run["state"] == "completed" and "Useful analysis" in run["response"]["reply"]
        current = (await client.get(BASE)).json()
        assert current.get("short_answer") == before.get("short_answer")
        manifest = (await client.get(BASE + f"/context/{started['run_id']}")).json()
        assert not any("new-info" in str(entry) for entry in manifest["entries"])
        assert any("new-info.txt" in path for path in current["source_revisions"])


@pytest.mark.asyncio
async def test_inspect_respects_excluded_canonical_fact_and_records_actual_read(application, app_context):
    marker = "EXCLUDED-CANONICAL-FACT-4729"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        baseline = (await client.get(BASE)).json()["source_revisions"]
        correction = await client.post(BASE + "/fact-corrections", json={"replacement": marker, "expected_revisions": baseline, "source_action_key": "excluded-fact-seed"})
        assert correction.status_code == 200, correction.text
        fact_id = correction.json()["fact_ids"][0]
        reply, provider = await turn(client, app_context, "Answer without the excluded fact.", [("workspace_action", {"action": "inspect", "values": {}})], context_selections=[{"reference_id": fact_id, "role": "current_fact", "selected": False}])
        assert marker not in json.dumps(provider.seen)
        manifests = [app_context.vault.read_markdown(app_context.vault.relative(path))["metadata"]["manifest"] for path in app_context.vault.iter_files(app_context.matters.matter_path(MATTER) + "/conversations/context", {".md"})]
        manifest = next(item for item in manifests if any(entry["reference_id"] == "workspace:inspect" for entry in item["entries"]))
        entry = next(item for item in manifest["entries"] if item["reference_id"] == "workspace:inspect")
        assert entry["tool_read_evidence"] and entry["supplied_chars"] > 0


@pytest.mark.asyncio
async def test_shortcut_and_scenario_continue_one_conversation_after_reload(application, app_context):
    from app.services.workspace_actions import INQUIRY_INSTRUCTIONS
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        first, _ = await turn(client, app_context, "Help me understand this matter.")
        conversation = first["conversation_id"]
        instruction = "Explain account control."
        message = INQUIRY_INSTRUCTIONS["explain"] + "\n\nLawyer's instruction: " + instruction
        app_context.runner.provider = Provider(message)
        action = await client.post(BASE + "/actions", json={"action": "explain", "instruction": instruction, "target": {"matter_id": MATTER}, "source_action_key": "one-conversation-shortcut", "conversation_id": conversation})
        assert action.status_code == 200, action.text
        await app_context.chat_runs.wait(action.json()["run_id"])
        assert action.json()["conversation_id"] == conversation
        baseline = (await client.get(BASE)).json()["source_revisions"]
        scenario = await client.post(BASE + "/scenarios", json={"scenario": {"title": "Alternative timing", "analysis": "Historical hypothetical", "proposed_fact_changes": [], "baseline_revisions": baseline}, "source_action_key": "one-conversation-scenario"})
        assert scenario.status_code == 200, scenario.text
        prompt = "Analyze this hypothetical without changing actual facts."
        app_context.runner.provider = Provider(prompt, scope="scenario")
        analyzed = await client.post(BASE + f"/scenarios/{scenario.json()['scenario_id']}/analyze", json={"instruction": prompt, "source_action_key": "analyze-same-conversation", "conversation_id": conversation})
        assert analyzed.status_code == 200 and analyzed.json()["conversation_id"] == conversation
        await app_context.chat_runs.wait(analyzed.json()["run_id"])
        follow, _ = await turn(client, app_context, "Return to the actual facts and explain next steps.", conversation_id=conversation)
        assert follow["conversation_id"] == conversation
        reopened = (await client.get(f"/api/matters/{MATTER}/conversations/{conversation}")).json()
        assert [message["role"] for message in reopened["messages"]] == ["user", "assistant"] * 4


@pytest.mark.asyncio
async def test_excluded_target_private_text_and_scenario_canonical_overlay_never_reach_provider(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        await turn(client, app_context, "Draft a memo.", [save("Excluded target", "Saved text.")])
        artifact = next(p for p in (await client.get(BASE + "/drafts")).json() if p["title"] == "Excluded target")
        marker = "EXCLUDED-LOCAL-TEXT-4729"
        target = {"matter_id": MATTER, "artifact_path": artifact["path"], "artifact_revision": artifact["revision"], "artifact_review_revision": artifact["review_revision"], "local_draft_snapshot": marker, "selected_range": {"start": 0, "end": len(marker), "text": marker}}
        _, provider = await turn(client, app_context, "Answer without this excluded draft.", target=target, context_selections=[{"reference_id": "omit", "role": "generated_output", "path": artifact["path"], "selected": False}])
        assert marker not in json.dumps(provider.seen)
        baseline = (await client.get(BASE)).json()["source_revisions"]
        marker = "EXCLUDED-OVERLAY-4729"
        fact = (await client.post(BASE + "/fact-corrections", json={"replacement": marker, "expected_revisions": baseline, "source_action_key": "overlay-fact"})).json()["fact_ids"][0]
        baseline = (await client.get(BASE)).json()["source_revisions"]
        scenario = (await client.post(BASE + "/scenarios", json={"scenario": {"title": "Later timing", "analysis": "Historical hypothetical.", "proposed_fact_changes": [], "baseline_revisions": baseline}, "source_action_key": "overlay-scenario"})).json()
        _, provider = await turn(client, app_context, "Explore the scenario without the excluded fact.", scope="scenario", target={"matter_id": MATTER, "scenario_id": scenario["scenario_id"]}, context_selections=[{"reference_id": fact, "role": "current_fact", "selected": False}])
        assert marker not in json.dumps(provider.seen)


@pytest.mark.asyncio
async def test_direct_correction_returns_offer_matches_and_guarded_same_conversation_reassessment(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        first, _ = await turn(client, app_context, "Draft a date memo.", [save("Direct correction memo", "Settlement is September 15.")])
        artifact = next(item for item in (await client.get(BASE + "/drafts")).json() if item["title"] == "Direct correction memo")
        original = app_context.vault.resolve(artifact["path"]).read_bytes()
        baseline = (await client.get(BASE)).json()["source_revisions"]
        scenario = (await client.post(BASE + "/scenarios", json={"scenario": {"title": "October timing", "analysis": "A saved hypothetical path.", "proposed_fact_changes": [{"change_id": "later-date", "text": "Settlement is October 28."}], "baseline_revisions": baseline}, "source_action_key": "prior-october"})).json()
        app_context.runner.provider = Provider("Reassess the changed facts.")
        baseline = (await client.get(BASE)).json()["source_revisions"]
        corrected = await client.post(BASE + "/fact-corrections", json={"replacement": "Settlement is October 21.", "expected_revisions": baseline, "source_action_key": "direct-october", "conversation_id": first["conversation_id"]})
        assert corrected.status_code == 200, corrected.text
        result = corrected.json()
        assert result["update_offer"]["artifact_path"] == artifact["path"]
        assert artifact["path"] in result["affected_analysis"]
        assert result["run"]["conversation_id"] == first["conversation_id"]
        assert result["matching_scenarios"][0]["scenario"]["scenario_id"] == scenario["scenario_id"]
        assert result["matching_scenarios"][0]["differences"]
        await app_context.chat_runs.wait(result["run"]["run_id"])
        stored_run = app_context.chat_runs.get(MATTER, result["run"]["run_id"])
        assert stored_run["request"]["workspace_action"] == "reassess_changed_facts"
        assert app_context.vault.resolve(artifact["path"]).read_bytes() == original


@pytest.mark.asyncio
async def test_optional_manifest_failure_preserves_http_answer_and_inspect_can_publish(application, app_context, monkeypatch):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        reply, _ = await turn(client, app_context, "Inspect the current matter and explain it.", [("workspace_action", {"action": "inspect", "values": {}})])
        assert (await client.get(BASE)).json()["short_answer"] == reply["reply"]
        monkeypatch.setattr(app_context.workspace_evidence, "save_manifest", lambda value: (_ for _ in ()).throw(OSError("manifest disk failure")))
        reply, _ = await turn(client, app_context, "Give another useful analysis.")
        assert "useful conditional answer" in reply["reply"].lower()
        assert "context record could not be saved" in reply["reply"]
        history = (await client.get(f"/api/matters/{MATTER}/conversations/{reply['conversation_id']}")).json()
        assert "useful conditional answer" in history["messages"][-1]["content"].lower()


@pytest.mark.asyncio
async def test_uploaded_original_clause_copy_preserves_bytes_and_real_companion_review(application, app_context):
    original = b"Supplier gives 45 days notice. Customer may terminate within 10 days.\n"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        source = (await client.post(f"/api/matters/{MATTER}/uploads", files=[("files", ("notice.txt", original, "text/plain"))])).json()["results"][0]
        review = (await client.get("/api/files/review", params={"path": source["extracted_path"]})).json()
        target = {"matter_id": MATTER, "artifact_path": source["extracted_path"], "artifact_revision": review["artifact_revision"], "artifact_review_revision": review["revision"]}
        reply, _ = await turn(client, app_context, "Revise this supplied clause as a separate review copy. Preserve 45 and 10 days.", [save("Notice review copy", "Supplier gives at least 45 days notice. Customer may terminate within 10 days.", "contract_clause_revision", source_document_path=source["path"])], target=target)
        assert any(item["status"] == "changed" for item in reply["operation_results"])
        assert (await client.get("/api/files/raw", params={"path": source["path"]})).content == original
        copy_artifact = next(item for item in (await client.get(BASE + "/drafts")).json() if item["title"] == "Notice review copy")
        metadata = app_context.vault.read_markdown(copy_artifact["path"])["metadata"]
        assert metadata["supplied_original"]["path"] == source["extracted_path"]
        assert metadata["supplied_original"]["metadata"]["source_path"] == source["path"]
        assert copy_artifact["pending_review"]


@pytest.mark.asyncio
async def test_optional_scenario_publication_failure_preserves_useful_chat(application, app_context, monkeypatch):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        baseline = (await client.get(BASE)).json()["source_revisions"]
        scenario = (await client.post(BASE + "/scenarios", json={"scenario": {"title": "Saved scenario", "analysis": "Earlier useful analysis.", "proposed_fact_changes": [], "baseline_revisions": baseline}, "source_action_key": "scenario-save-failure"})).json()
        monkeypatch.setattr(app_context.workspace_scenarios, "persist_analysis", lambda *args, **kwargs: (_ for _ in ()).throw(OSError("scenario disk failure")))
        reply, _ = await turn(client, app_context, "Explain this hypothetical.", scope="scenario", target={"matter_id": MATTER, "scenario_id": scenario["scenario_id"]})
        assert "useful conditional answer" in reply["reply"].lower()
        assert "saved scenario analysis could not be updated" in reply["reply"]
        saved = (await client.get(BASE + f"/scenarios/{scenario['scenario_id']}")).json()
        assert saved["analysis"] == "Earlier useful analysis."


@pytest.mark.asyncio
async def test_retry_has_new_immutable_context_attempt_without_repeating_submission(application, app_context):
    class FailedProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("temporary provider failure")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        source = (await client.post(f"/api/matters/{MATTER}/uploads", files=[("files", ("retry-support.txt", b"RETRY-ONLY-READ-MARKER-4729", "text/plain"))])).json()["results"][0]
        app_context.runner.provider = FailedProvider()
        message = "Read the supporting file and explain."
        started = (await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": message, "source_action_key": "retry-context-attempt"})).json()
        await app_context.chat_runs.wait(started["run_id"])
        first = (await client.get(BASE + f"/context/{started['run_id']}")).json()
        assert not any(entry["role"] == "tool_read" for entry in first["entries"])
        provider = Provider(message, [("read_file", {"path": source["path"]})])
        app_context.runner.provider = provider
        retried = await client.post(f"/api/matters/{MATTER}/chat-runs/{started['run_id']}/retry")
        assert retried.status_code == 202 and retried.json()["run_id"] == started["run_id"]
        await app_context.chat_runs.wait(started["run_id"])
        second = (await client.get(BASE + f"/context/{started['run_id']}")).json()
        assert second["logical_run_id"] == started["run_id"] and second["attempt"] == 2
        assert second["run_id"] != first["run_id"]
        assert any(entry["role"] == "tool_read" and entry["path"] == source["path"] for entry in second["entries"])
        assert (await client.get(BASE + f"/context/{started['run_id']}", params={"attempt": 1})).json() == first
        assert "RETRY-ONLY-READ-MARKER-4729" in json.dumps(provider.seen)
        reopened = (await client.get(f"/api/matters/{MATTER}/conversations/{started['conversation_id']}")).json()
        assert len([item for item in reopened["messages"] if item["role"] == "user"]) == 1


@pytest.mark.asyncio
async def test_failed_run_reload_restores_fallback_and_retry_in_same_conversation(application, app_context):
    class FailedProvider:
        async def complete(self, messages, tools=None):
            raise RuntimeError("temporary model outage")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        app_context.runner.provider = FailedProvider()
        started = (await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": "Draft a checklist.", "source_action_key": "reload-failed-checklist"})).json()
        await app_context.chat_runs.wait(started["run_id"])
        # Reload has only the selected conversation, no browser pending marker.
        runs = (await client.get(f"/api/matters/{MATTER}/chat-runs", params={"conversation_id": started["conversation_id"]})).json()
        assert runs[0]["state"] == "failed" and runs[0]["run_id"] == started["run_id"]
        assert runs[0]["response"]["conversation_id"] == started["conversation_id"]
        assert runs[0]["response"]["reply"]
        history = (await client.get(f"/api/matters/{MATTER}/conversations/{started['conversation_id']}")).json()
        assert history["messages"][-1]["content"] == runs[0]["response"]["reply"]
        assert history["messages"][-1]["role"] == "assistant"
        app_context.runner.provider = Provider("Draft a checklist.", [save("Reload checklist", "Review the dates.", "transaction_checklist")])
        retried = await client.post(f"/api/matters/{MATTER}/chat-runs/{started['run_id']}/retry")
        assert retried.status_code == 202
        await app_context.chat_runs.wait(started["run_id"])
        assert app_context.chat_runs.get(MATTER, started["run_id"])["state"] == "completed"
        history = (await client.get(f"/api/matters/{MATTER}/conversations/{started['conversation_id']}")).json()
        assert len([item for item in history["messages"] if item["role"] == "user"]) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("submitted_agent", ["intake-agent", "counsel-copilot"])
async def test_intake_actual_answer_and_stable_question_project_into_understand(application, app_context, monkeypatch, submitted_agent):
    message = "Assess whether the pilot can proceed."
    question = {"question_id": "intake-custody", "text": "Who controls funds until settlement?", "reason": "Custody can change the conditional launch analysis.", "choices": [{"value": "partner", "label": "The partner"}, {"value": "us", "label": "Our company"}]}
    conversation = app_context.chat_history.append(MATTER, None, role="assistant", content="Intake is open.", conversation_kind="intake", intake_state="active", active_agent_id="intake-agent")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        before = (await client.get(BASE)).json()
        result, provider = await turn(client, app_context, message, [("update_matter_intake", {"working_ask": "Assess the pilot.", "dossier_orientation": "Business summary, not the answer.", "next_questions": [question], "intake_state": "active"})], agent_id="intake-agent", conversation_id=conversation["conversation_id"])
        assert any(item["tool"] == "update_matter_intake" and item["status"] == "success" for item in result["trace"]), result
        actual = (await client.get(BASE)).json()
        assert actual["short_answer"] == result["reply"]
        assert actual["short_answer"] != "Business summary, not the answer."
        assert actual["supporting_question"]["question_id"] == question["question_id"]
        assert actual["supporting_question"]["text"] == question["text"]
        assert [{"value": item["value"], "label": item["label"]} for item in actual["supporting_question"]["choices"]] == question["choices"]
        assert actual["question"]["revision"] == before["question"]["revision"]
        original_save_question = app_context.workspace.save_question
        def reject_redundant_answer_write(matter_id, item, **kwargs):
            if item.get("state") == "answered":
                raise OSError("Optional question projection write failed.")
            return original_save_question(matter_id, item, **kwargs)
        monkeypatch.setattr(app_context.workspace, "save_question", reject_redundant_answer_write)
        app_context.runner.provider = Provider("The partner.", [("update_matter_intake", {"working_ask": "Assess the pilot.", "next_questions": [{**question, "question_id": "intake-release", "text": "When are funds released?"}], "intake_state": "active"})])
        started = (await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": "The partner.", "agent_id": submitted_agent, "conversation_id": result["conversation_id"], "source_action_key": "intake-answer-projection", "card_action": {"card_id": question["question_id"], "action": "answer", "values": ["partner"]}})).json()
        await app_context.chat_runs.wait(started["run_id"])
        finished = app_context.chat_runs.get(MATTER, started["run_id"])
        assert finished["state"] == "completed", json.dumps({"response": finished.get("response"), "failure_detail": finished.get("failure_detail"), "partial_trace": finished.get("partial_trace")})
        assert finished["selection"]["agent_id"] == "intake-agent"
        answered = finished["response"]
        after_answer = (await client.get(BASE)).json()
        prior = next(item for item in after_answer["questions"] if item["question_id"] == question["question_id"])
        assert prior["state"] == "answered" and prior["answer_origin"] == "reported"
        assert prior["linked_fact_ids"]
        assert len([fact for fact in app_context.matter_records.get(MATTER)["facts"] if fact["fact_id"] in prior["linked_fact_ids"]]) == 1
        assert after_answer["supporting_question"]["question_id"] == "intake-release"
        assert after_answer["short_answer"] == answered["reply"]


@pytest.mark.asyncio
async def test_late_scope_change_keeps_intake_answer_historical(application, app_context):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        first, _ = await turn(client, app_context, "Explain the current decision.")
        before = app_context.workspace.business_question(MATTER)
        def change_scope():
            app_context.workspace.change_business_question(MATTER, {"text": "A different business decision?", "expected_revision": before["revision"], "source_action_key": "intake-late-scope"})
        reply, _ = await turn(client, app_context, "Assess the original pilot.", [("update_matter_intake", {"working_ask": "The old decision", "next_questions": [{"question_id": "obsolete-intake-question", "text": "Who controls the old pilot?"}], "intake_state": "active"})], agent_id="intake-agent", hook=change_scope)
        current = (await client.get(BASE)).json()
        assert current["question"]["text"] == "A different business decision?"
        assert current["short_answer"] == first["reply"]
        assert not any(question["question_id"] == "obsolete-intake-question" for question in current["questions"])
        assert reply["reply"]


@pytest.mark.asyncio
async def test_uploaded_markdown_original_revision_becomes_separate_guarded_copy(application, app_context):
    from app.services.document_review import DocumentReviewService
    original = b"# Supplied checklist\n\n- [ ] Confirm timing.\n- [ ] Review notice.\n"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        source = (await client.post(f"/api/matters/{MATTER}/uploads", files=[("files", ("source-checklist.md", original, "text/markdown"))])).json()["results"][0]
        # A previously frozen original target remains valid; obtain its hashes
        # read-only, without the review endpoint's metadata normalization write.
        document = app_context.vault.read_document(source["path"])
        target = {"matter_id": MATTER, "artifact_path": source["path"], "artifact_revision": DocumentReviewService.content_revision(document["content"]), "artifact_review_revision": app_context.document_reviews.revision(source["path"])}
        reply, _ = await turn(client, app_context, "Create an editable working copy of this checklist. Preserve the supplied original.", [save("Checklist working copy", "# Working checklist\n\n- [ ] Confirm October timing.\n- [ ] Review notice.\n", "transaction_checklist", operation="revise", existing_draft_path=source["path"])], target=target)
        assert any(item["operation"] == "save_work_product" and item["status"] == "changed" for item in reply["operation_results"]), reply
        assert (await client.get("/api/files/raw", params={"path": source["path"]})).content == original
        copy_artifact = next(item for item in (await client.get(BASE + "/drafts")).json() if item["title"] == "Checklist working copy")
        assert copy_artifact["path"] != source["path"] and copy_artifact["pending_review"]
        assert app_context.vault.read_markdown(copy_artifact["path"])["metadata"]["supplied_original"]["path"] == source["path"]


@pytest.mark.asyncio
async def test_intake_workspace_shortcut_resolves_its_provider_once_and_replays_exactly(application, app_context):
    from app.services.workspace_actions import INQUIRY_INSTRUCTIONS
    conversation = app_context.chat_history.append(MATTER, None, role="assistant", content="An optional question remains open.", conversation_kind="intake", intake_state="active", active_agent_id="intake-agent")
    app_context.runner.provider = Provider(INQUIRY_INSTRUCTIONS["explore_question"])
    payload = {"action": "explore_question", "conversation_id": conversation["conversation_id"], "source_action_key": "intake-shortcut-provider"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        started_response = await client.post(BASE + "/actions", json=payload)
        assert started_response.status_code == 200, started_response.text
        started = started_response.json()
        await app_context.chat_runs.wait(started["run_id"])
        result = app_context.chat_runs.get(MATTER, started["run_id"])
        assert result["state"] == "completed", result
        assert result["selection"]["agent_id"] == "intake-agent"
        replay = (await client.post(BASE + "/actions", json=payload)).json()
        assert replay["run_id"] == result["run_id"]
        assert result["conversation_id"] == conversation["conversation_id"]
        history = app_context.chat_history.get(MATTER, conversation["conversation_id"])
        assert len([item for item in history["messages"] if item["role"] == "user"]) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("accept_new_offer", [True, False])
async def test_declined_draft_offer_remains_visible_only_for_its_current_version(application, app_context, accept_new_offer):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        await turn(client, app_context, "Draft the timing memo.", [save("Timing memo", "# Memo\n\nNotice is due in 30 days.")])
        artifact = next(item for item in (await client.get(BASE)).json()["work_products"] if item["title"] == "Timing memo")
        path = artifact["path"]
        before = app_context.vault.resolve(path).read_bytes()
        await turn(client, app_context, "Correction: notice is due in 45 days. Keep the memo unchanged.", [("workspace_action", {"action": "correct_fact", "values": {"fact_id": None, "replacement": "Notice is due in 45 days."}})])
        current = next(item for item in (await client.get(BASE)).json()["work_products"] if item["path"] == path)
        first = current["update_offer"]
        declined = await client.post(BASE + f"/update-offers/{first['offer_id']}/decline", json={"base_revision": first["base_revision"]})
        assert declined.status_code == 200 and declined.json()["state"] == "declined"
        projected = next(item for item in (await client.get(BASE)).json()["work_products"] if item["path"] == path)
        assert projected["update_offer"]["state"] == "declined"
        assert projected["update_offer"]["offer_id"] == first["offer_id"]
        assert projected["update_offer"]["base_revision"] == projected["revision"]
        assert app_context.vault.resolve(path).read_bytes() == before

        await turn(client, app_context, "Correction: notice is due in 60 days. Keep the memo unchanged.", [("workspace_action", {"action": "correct_fact", "values": {"fact_id": None, "replacement": "Notice is due in 60 days."}})])
        current = next(item for item in (await client.get(BASE)).json()["work_products"] if item["path"] == path)
        latest = current["update_offer"]
        assert latest["state"] == "offered" and latest["offer_id"] != first["offer_id"]
        assert app_context.vault.resolve(path).read_bytes() == before
        if not accept_new_offer:
            response = await client.post(BASE + f"/update-offers/{latest['offer_id']}/decline", json={"base_revision": latest["base_revision"]})
            assert response.status_code == 200
        target = {"matter_id": MATTER, "artifact_path": path, "artifact_revision": current["revision"], "artifact_review_revision": current["review_revision"]}
        revised, _ = await turn(client, app_context, "Propose the 60-day wording in this selected memo for review.", [("save_work_product", {"kind": "draft", "operation": "revise", "title": "Timing memo", "content": "# Memo\n\nNotice is due in 60 days.", "reason": "Update the reported notice period."})], target=target, **({"update_offer_id": latest["offer_id"]} if accept_new_offer else {}))
        assert any(item["status"] == "changed" for item in revised["operation_results"])
        after = next(item for item in (await client.get(BASE)).json()["work_products"] if item["path"] == path)
        assert after["revision"] != latest["base_revision"]
        assert after["update_offer"] is None
