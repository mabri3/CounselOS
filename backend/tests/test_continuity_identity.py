"""Identity is local simulation; durable retries retain their original actor."""
import httpx
import pytest
from test_continuity_integration import continuity_app, roster, question, request_command, MATTER, BASE

@pytest.mark.asyncio
async def test_removed_actor_retry_and_unknown_header(continuity_app, app_context):
    ctx=app_context; roster(ctx); q=question(ctx); command=request_command(q)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        created=await client.post(BASE+"/fact-requests",json=command,headers={"X-Themis-Person-Id":"alex"})
        assert created.status_code==200,created.text
        current=ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled":True,"people":[p for p in current["people"] if p["person_id"]!="alex"],"expected_revision":current["revision"],"source_action_key":"remove-alex"})
        for viewer in ("alex","jordan"):
            replay=await client.post(BASE+"/fact-requests",json=command,headers={"X-Themis-Person-Id":viewer})
            assert replay.status_code==200,replay.text
            assert replay.json()["request"]["created_by"]["person_id"]=="alex"
        assert (await client.get("/api/team",headers={"X-Themis-Person-Id":"alex"})).status_code==422
        assert (await client.get("/api/team")).status_code==200
        assert (await client.post(BASE+"/fact-requests",json={**command,"source_action_key":"new"},headers={"X-Themis-Person-Id":"alex"})).status_code==422
        assert (await client.post(BASE+"/fact-requests",json={**command,"wording":"Different"},headers={"X-Themis-Person-Id":"jordan"})).status_code==409

@pytest.mark.asyncio
async def test_seen_and_settings_are_metadata_only(continuity_app, app_context):
    ctx=app_context; roster(ctx)
    baseline=ctx.workspace.source_revisions(MATTER)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        orientation=(await client.get(BASE+"/orientation",headers={"X-Themis-Person-Id":"alex"})).json()
        seen=await client.post(BASE+"/seen",json={"expected_revision":ctx.workspace.recap(MATTER)["current_revision"]},headers={"X-Themis-Person-Id":"alex"})
        assert seen.status_code==200,seen.text
        assert ctx.workspace_team.seen(MATTER,actor=ctx.workspace_team.resolve_actor("alex"))
        assert not ctx.workspace_team.seen(MATTER,actor=ctx.workspace_team.resolve_actor("jordan"))["revision"]
    assert baseline==ctx.workspace.source_revisions(MATTER)
    path=ctx.settings_store.PATH
    doc=ctx.vault.read_markdown(path)
    ctx.vault.write_markdown(path,"Custom settings explanation.",{**doc["metadata"],"unrelated":{"keep":True}})
    roster_before=ctx.workspace_team.roster()
    ctx.settings_store.write({"matters.default_owner":"Saved single lawyer"})
    saved=ctx.vault.read_markdown(path)
    assert saved["content"].strip()=="Custom settings explanation."
    assert saved["metadata"]["unrelated"]=={"keep":True}
    assert ctx.workspace_team.roster()==roster_before

@pytest.mark.asyncio
async def test_review_authorship_ignores_body_and_replays_removed_person(continuity_app,app_context):
    ctx=app_context;roster(ctx)
    base=ctx.matters.matter_path(MATTER)
    path=base+"/documents/local-review.md";other=base+"/documents/other-review.md"
    for file in (path,other):ctx.vault.write_markdown(file,"Keep this text.",{})
    command={"action":"add_comment","body":"Please confirm.","quote":"text","author_id":"forged","author_name":"Forged Person","source_action_key":"comment-1"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        response=await client.put("/api/files/review",params={"path":path},json=command,headers={"X-Themis-Person-Id":"alex"})
        assert response.status_code==200,response.text
        assert "Alex Morgan" in response.text and "Forged Person" not in response.text
        current=ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled":True,"people":[p for p in current["people"] if p["person_id"]!="alex"],"expected_revision":current["revision"],"source_action_key":"remove-comment-author"})
        replay=await client.put("/api/files/review",params={"path":path},json=command,headers={"X-Themis-Person-Id":"alex"})
        assert replay.status_code==200,replay.text
        assert len(replay.json()["comments"])==1
        moved=await client.put("/api/files/review",params={"path":other},json=command,headers={"X-Themis-Person-Id":"jordan"})
        assert moved.status_code==409,moved.text

@pytest.mark.asyncio
async def test_existing_inquiry_route_freezes_actor_and_original_command(continuity_app,app_context):
    from app.providers.base import ProviderReply
    class Provider:
        async def complete(self,messages,tools=None):return ProviderReply(content="A useful current answer.")
    ctx=app_context;roster(ctx);ctx.runner.provider=Provider()
    command={"action":"explain","instruction":"Explain the support-access question.","target":{"matter_id":MATTER},"source_action_key":"inquiry-actor"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        result=await client.post(BASE+"/actions",json=command,headers={"X-Themis-Person-Id":"jordan"})
        assert result.status_code==200,result.text
        run=result.json();assert run["action_actor"]["person_id"]=="jordan"
        await ctx.chat_runs._tasks[run["run_id"]]
        current=ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled":True,"people":[p for p in current["people"] if p["person_id"]!="jordan"],"expected_revision":current["revision"],"source_action_key":"remove-inquiry-actor"})
        replay=await client.post(BASE+"/actions",json=command,headers={"X-Themis-Person-Id":"jordan"})
        assert replay.status_code==200,replay.text
        assert replay.json()["run_id"]==run["run_id"] and replay.json()["action_actor"]["person_id"]=="jordan"
        assert (await client.post(BASE+"/actions",json={**command,"instruction":"Changed"},headers={"X-Themis-Person-Id":"alex"})).status_code==409

@pytest.mark.asyncio
async def test_person_can_edit_and_delete_own_comment_after_reload(continuity_app,app_context):
    ctx=app_context;roster(ctx)
    path=ctx.matters.matter_path(MATTER)+"/documents/edit-own-comment.md"
    ctx.vault.write_markdown(path,"Review these terms.",{})
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test",headers={"X-Themis-Person-Id":"alex"}) as client:
        created=await client.put("/api/files/review",params={"path":path},json={"action":"add_comment","body":"My note","quote":"terms","source_action_key":"own-comment"})
        assert created.status_code==200,created.text
        loaded=(await client.get("/api/files/review",params={"path":path})).json()
        thread=loaded["comments"][0];entry=thread["entries"][0]
        assert entry["author_id"]=="alex"
        changed=await client.put("/api/files/review",params={"path":path},json={"action":"edit_comment","thread_id":thread["thread_id"],"comment_id":entry["comment_id"],"body":"Edited after reload","source_action_key":"own-comment-edit"})
        assert changed.status_code==200,changed.text
        assert changed.json()["comments"][0]["entries"][0]["body"]=="Edited after reload"
        deleted=await client.put("/api/files/review",params={"path":path},json={"action":"delete_comment_entry","thread_id":thread["thread_id"],"comment_id":entry["comment_id"],"source_action_key":"own-comment-delete"})
        assert deleted.status_code==200,deleted.text
        assert not deleted.json()["comments"][0]["entries"]

@pytest.mark.asyncio
async def test_direct_lifecycle_uses_trusted_person_and_preserves_first_actor(continuity_app, app_context):
    from app.routers import matters
    ctx = app_context
    roster(ctx)
    continuity_app.include_router(matters.router, prefix="/api")
    draft = ctx.work_products.create_draft(MATTER, title="Lifecycle identity", content="# Advice\n\nA useful response.")
    base = f"/api/matters/{MATTER}"
    alex = {"X-Themis-Person-Id": "alex"}
    jordan = {"X-Themis-Person-Id": "jordan"}
    forged = {"X-Themis-Person-Id": "not-in-roster"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        payload = {"draft_path": draft["vault_path"], "actor": "Forged name"}
        assert (await client.post(base + "/work-product/finalize", json=payload, headers=forged)).status_code == 422
        final = await client.post(base + "/work-product/finalize", json=payload, headers=alex)
        assert final.status_code == 200, final.text
        final_path = final.json()["vault_path"]
        final_before = ctx.vault.resolve(final_path).read_bytes()
        metadata = ctx.vault.read_markdown(final_path)["metadata"]
        assert metadata["finalized_actor"] == {"person_id": "alex", "display_name": "Alex Morgan", "mode": "demo"}
        item = ctx.index.list_work_items(MATTER)[0]
        for path, body in [
            ("/work-items/assign", {"work_item_id": item["work_item_id"], "owner": "Jordan Lee"}),
            ("/work-items/priority", {"work_item_id": item["work_item_id"], "priority": "urgent"}),
            ("/work-items/complete", {"work_item_id": item["work_item_id"]}),
        ]:
            command = {**body, "actor": "Forged name"}
            assert (await client.post(base + path, json=command, headers=forged)).status_code == 422
            result = await client.post(base + path, json=command, headers=alex)
            assert result.status_code == 200, result.text
            saved = ctx.vault.read_markdown(item["path"])["metadata"]
            assert saved["action_actor"]["person_id"] == "alex"
            assert saved["action_actor"]["display_name"] == "Alex Morgan"
        completed_before = ctx.vault.resolve(item["path"]).read_bytes()
        replay = await client.post(base + "/work-items/complete", json={"work_item_id": item["work_item_id"], "actor": "Forged name"}, headers=jordan)
        assert replay.status_code == 200 and replay.json()["already_recorded"]
        assert ctx.vault.resolve(item["path"]).read_bytes() == completed_before
        for remaining in ctx.index.list_work_items(MATTER):
            result = await client.post(base + "/work-items/complete", json={"work_item_id": remaining["work_item_id"], "actor": "Forged name"}, headers=alex)
            assert result.status_code == 200, result.text
        matter_path = f"{ctx.matters.matter_path(MATTER)}/matter.md"
        for action, field in [("approve_response", "response_approved_actor"), ("mark_as_sent", "response_sent_actor"), ("close_matter", "closed_actor")]:
            command = {"action": action, "actor": "Forged name", "artifact_path": final_path if action == "approve_response" else None}
            assert (await client.post(base + "/actions", json=command, headers=forged)).status_code == 422
            result = await client.post(base + "/actions", json=command, headers=alex)
            assert result.status_code == 200, result.text
            saved = ctx.vault.read_markdown(matter_path)["metadata"]
            assert saved[field]["person_id"] == "alex" and saved[field]["display_name"] == "Alex Morgan"
            import json
            event_body = ctx.vault.read_markdown(result.json()["event_path"])["content"]
            event = json.loads(event_body.split("```json\n", 1)[1].split("```", 1)[0])
            assert event["action_actor"]["person_id"] == "alex"
            replay = await client.post(base + "/actions", json=command, headers=jordan)
            assert replay.status_code == 200 and replay.json()["already_recorded"]
            assert ctx.vault.read_markdown(matter_path)["metadata"][field] == saved[field]
        current = ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled": True, "people": [{**p, "display_name": "Alex Renamed"} if p["person_id"] == "alex" else p for p in current["people"]], "expected_revision": current["revision"], "source_action_key": "rename-final-actor"})
        replay = await client.post(base + "/work-product/finalize", json=payload, headers=alex)
        assert replay.status_code == 200, replay.text
        assert replay.json()["vault_path"] == final_path
        assert ctx.vault.resolve(final_path).read_bytes() == final_before
        replay = await client.post(base + "/actions", json={"action": "close_matter", "actor": "Forged name"}, headers=alex)
        assert replay.status_code == 200
        assert ctx.vault.read_markdown(matter_path)["metadata"]["closed_actor"]["display_name"] == "Alex Morgan"
