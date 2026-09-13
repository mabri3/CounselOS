"""HTTP recovery covers canonical-owner commit interruption and declined offers."""
import httpx
import pytest
from test_continuity_integration import continuity_app, roster, MATTER, BASE
from test_change_impact import supplied, comparison, publish, update_command
from app.models.api import MatterCreate

@pytest.mark.asyncio
async def test_owner_commit_failure_repairs_once_without_reassigning(continuity_app,app_context,monkeypatch):
    ctx=app_context; roster(ctx)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        scope=ctx.workspace_team.scope(MATTER)
        item=(await client.post(BASE+"/handoffs",headers={"X-Themis-Person-Id":"alex"},json={"scope":scope,"recipient_id":"jordan","ask":"Finish this matter.","source_action_key":"create"})).json()["handoff"]
        command={"action":"accept","expected_revision":item["revision"],"expected_ownership_revision":scope["ownership_revision"],"expected_content_revision":scope["content_revision"],"source_action_key":"accept"}
        real_write=ctx.vault.write_markdown
        failed=False
        def break_participants(path,content,metadata=None):
            nonlocal failed
            if str(path).endswith("participants.md") and not failed:
                failed=True
                raise OSError("Injected failure after canonical ownership commit")
            return real_write(path,content,metadata)
        monkeypatch.setattr(ctx.vault,"write_markdown",break_participants)
        result=await client.post(BASE+f"/handoffs/{item['handoff_id']}/actions",headers={"X-Themis-Person-Id":"jordan"},json=command)
        assert result.status_code==200,result.text
        assert result.json()["receipt"]["state"]=="not_saved"
        assert "canonical_owner" in result.json()["receipt"]["completed_parts"]
        owner=ctx.workspace_team.scope(MATTER)
        assert owner["owner_id"]=="jordan"
        current=ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled":True,"people":[p for p in current["people"] if p["person_id"]!="jordan"],"expected_revision":current["revision"],"source_action_key":"remove-recipient"})
        replay=await client.post(BASE+f"/handoffs/{item['handoff_id']}/actions",headers={"X-Themis-Person-Id":"jordan"},json=command)
        assert replay.status_code==200,replay.text
        assert replay.json()["receipt"]["state"]=="applied"
        assert ctx.workspace_team.scope(MATTER)["ownership_revision"]==owner["ownership_revision"]
        assert (await client.post(BASE+f"/handoffs/{item['handoff_id']}/actions",headers={"X-Themis-Person-Id":"casey"},json=command)).status_code==200

@pytest.mark.asyncio
async def test_declined_offer_does_not_start_revision_run(continuity_app, app_context):
    ctx=app_context
    matter=ctx.matters.create(MatterCreate(title="Fictional draft revision",request_text="Review retention."));mid=matter["matter_id"]
    draft=ctx.work_products.create_draft(mid,title="Retention policy",content="Retain 30 days.",source_action_key="draft")
    env=(ctx,ctx.change_impact,mid,{})
    target=next(t for t in ctx.change_impact.candidates(mid)["targets"] if t["path"]==draft["vault_path"])
    item=publish(env,comparison(env,targets=[target]))
    command=update_command(item,item["targets"][0])
    actor=ctx.workspace_team.resolve_actor()
    intent=ctx.change_impact.prepare_update(mid,item["comparison_id"],command,actor=actor)
    ctx.workspace_actions.decline_offer(mid,intent["offer_id"],base_revision=target["expected_revision"])
    before=ctx.chat_runs.list(mid)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        result=await client.post(f"/api/matters/{mid}/workspace/impacts/{item['comparison_id']}/update-draft",json=command)
        assert result.status_code==409,result.text
        assert "No revision run" in result.text
    assert ctx.chat_runs.list(mid)==before

class DraftProvider:
    def __init__(self,path):self.path=path;self.calls=0
    async def complete(self,messages,tools=None):
        from app.providers.base import ProviderReply,ProviderToolCall
        self.calls+=1
        if self.calls==1:
            return ProviderReply(tool_calls=[ProviderToolCall(id="scope",name="select_conversation_scope",arguments={"scope":"actual","instruction_quote":"Prepare proposed edits for this exact selected work product using the saved comparison below."})])
        if self.calls==2:
            return ProviderReply(content="I will propose the selected retention change.",tool_calls=[ProviderToolCall(id="propose",name="save_work_product",arguments={"kind":"draft","operation":"revise","existing_draft_path":self.path,"title":"Retention policy","content":"Retain 60 days.\n"})])
        return ProviderReply(content="The proposed retention change is saved for review.")

@pytest.mark.asyncio
async def test_comparison_update_uses_tracked_review_and_replays_after_own_edit(continuity_app,app_context):
    ctx=app_context;mid=ctx.matters.create(MatterCreate(title="Fictional tracked update",request_text="Review retention."))["matter_id"]
    draft=ctx.work_products.create_draft(mid,title="Retention policy",content="Retain 30 days.",source_action_key="draft")
    env=(ctx,ctx.change_impact,mid,{})
    target=next(t for t in ctx.change_impact.candidates(mid)["targets"] if t["path"]==draft["vault_path"])
    item=publish(env,comparison(env,targets=[target]));command=update_command(item,item["targets"][0])
    ctx.runner.provider=DraftProvider(draft["vault_path"])
    url=f"/api/matters/{mid}/workspace/impacts/{item['comparison_id']}/update-draft"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        response=await client.post(url,json=command)
        assert response.status_code==200,response.text
        run=response.json();await ctx.chat_runs._tasks[run["run_id"]]
        completed=ctx.chat_runs.get(mid,run["run_id"])
        assert completed["state"]=="completed",completed
        review=ctx.document_reviews.get(draft["vault_path"])
        assert review["changes"],__import__("json").dumps(completed.get("response"),indent=2)
        assert any("60" in change["new_text"] for change in review["changes"])
        saved_bytes=ctx.vault.resolve(draft["vault_path"]).read_bytes()
        replay=await client.post(url,json=command)
        assert replay.status_code==200,replay.text
        assert replay.json()["run_id"]==run["run_id"]
        assert ctx.vault.resolve(draft["vault_path"]).read_bytes()==saved_bytes

@pytest.mark.asyncio
async def test_failed_communication_retries_existing_run_without_replacing_answer(continuity_app,app_context):
    from app.providers.base import ProviderReply
    ctx=app_context;roster(ctx)
    class Answer:
        async def complete(self,messages,tools=None):return ProviderReply(content="The legal answer is to require recorded support permission.")
    class Failing:
        async def complete(self,messages,tools=None):raise RuntimeError("Injected provider failure")
    class Wording:
        async def complete(self,messages,tools=None):return ProviderReply(content="Hi Sam, could you confirm whether support requires permission?")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        initial = ctx.chat_history.append(MATTER, None, role="user", content="Review the support access restriction.", conversation_kind="intake", intake_state="active", active_agent_id="intake-agent")
        ctx.runner.provider=Answer()
        first=(await client.post(BASE+"/actions",json={"action":"explain","source_action_key":"legal-answer","conversation_id":initial["conversation_id"]},headers={"X-Themis-Person-Id":"alex"})).json()
        await ctx.chat_runs._tasks[first["run_id"]]
        answer=ctx.workspace.get(MATTER)["short_answer"]
        assert "legal answer" in answer
        ctx.runner.provider=Failing()
        command={"kind":"request","source_action_key":"wording-retry","conversation_id":first["conversation_id"],"instruction":"Draft the business request."}
        run=(await client.post(BASE+"/prepare-communication",json=command,headers={"X-Themis-Person-Id":"alex"})).json()
        await ctx.chat_runs._tasks[run["run_id"]]
        failed=ctx.chat_runs.get(MATTER,run["run_id"])
        assert failed["state"]=="failed"
        ctx.runner.provider=Wording()
        old=ctx.workspace_team.roster()
        ctx.workspace_team.configure({"enabled":True,"people":[p for p in old["people"] if p["person_id"]!="alex"],"expected_revision":old["revision"],"source_action_key":"remove-failed-author"})
        replay=await client.post(BASE+"/prepare-communication",json=command,headers={"X-Themis-Person-Id":"alex"})
        assert replay.status_code==200 and replay.json()["run_id"]==run["run_id"]
        restarted=await client.post(f"/api/matters/{MATTER}/chat-runs/{run['run_id']}/retry",headers={"X-Themis-Person-Id":"jordan"})
        assert restarted.status_code==202,restarted.text
        await ctx.chat_runs._tasks[run["run_id"]]
        completed=ctx.chat_runs.get(MATTER,run["run_id"])
        assert completed["state"]=="completed" and completed["action_actor"]["person_id"]=="alex"
        assert completed["request"]==failed["request"]
        assert completed["attempt_results"][0]["response"]==failed.get("response")
        assert ctx.workspace.get(MATTER)["short_answer"]==answer
        saved=ctx.chat_history.get(MATTER,first["conversation_id"])
        assert any("Hi Sam" in message["content"] for message in saved["messages"])
        assert saved["messages"][-1]["workspace_action"] == "prepare_handoff"
        # Even an explicit recovery request after a communication must not start
        # another model or mutate the active intake's matter records.
        before = {str(path): path.read_bytes() for path in ctx.vault.iter_files(ctx.matters.matter_path(MATTER))}
        recovery_url = f"/api/matters/{MATTER}/intake-question-recovery"
        blocked = await client.post(recovery_url, json={"conversation_id": first["conversation_id"]})
        assert blocked.status_code == 409 and "workspace work" in blocked.text
        assert before == {str(path): path.read_bytes() for path in ctx.vault.iter_files(ctx.matters.matter_path(MATTER))}
        ctx.chat_history.append(MATTER, first["conversation_id"], role="assistant", content="The available actions are complete; use the trace and updated matter state as the working result.", run_id="RUN-old-unsolicited-recovery")
        assert ctx.chat_history.get(MATTER, first["conversation_id"])["messages"][-1]["workspace_action"] == "prepare_handoff"
        assert (await client.post(recovery_url, json={"conversation_id": first["conversation_id"]})).status_code == 409
        # A subsequent real broken intake turn is still recoverable. A model
        # status placeholder must stay in chat and retain the useful answer.
        ctx.chat_history.append(MATTER, first["conversation_id"], role="user", content="Continue the intake.")
        ctx.chat_history.append(MATTER, first["conversation_id"], role="assistant", content="Let me find the next question.")
        class StatusOnly:
            async def complete(self, messages, tools=None):
                return ProviderReply(content="The available actions are complete; use the trace and updated matter state as the working result.")
        ctx.runner.provider = StatusOnly()
        recovery = await client.post(recovery_url, json={"conversation_id": first["conversation_id"]})
        assert recovery.status_code == 202, recovery.text
        await ctx.chat_runs._tasks[recovery.json()["run_id"]]
        assert ctx.chat_runs.get(MATTER, recovery.json()["run_id"])["state"] == "completed"
        assert ctx.workspace.get(MATTER)["short_answer"] == answer


@pytest.mark.asyncio
async def test_review_gets_and_manifest_preserve_supplied_and_draft_bytes(continuity_app,app_context):
    ctx=app_context
    supplied=ctx.matters.matter_path(MATTER)+"/documents/untouched-supplied.md"
    ctx.vault.write_markdown(supplied,"Pay in 30 days.",{ "source_id":"supplied-review", "review":{"tracking":True,"baseline":"Pay in 10 days.","comments":[{"body":"Imported note","quote":"Pay","created_at":"2024-01-01T09:00:00Z"}]}})
    draft=ctx.work_products.create_draft(MATTER,title="Untouched draft",content="Keep this draft.",source_action_key="read-draft")["vault_path"]
    frozen=ctx.agent_context.build_run_context(ctx.agents.get("counsel-copilot"),matter_id=MATTER,run_id="RUN-read-only-review",active_file=supplied)
    ctx.workspace_evidence.save_manifest(frozen["manifest"])
    paths=[ctx.vault.relative(path) for path in ctx.vault.iter_files(ctx.matters.matter_path(MATTER))]
    before={path:ctx.vault.resolve(path).read_bytes() for path in paths}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        for path in (supplied,draft):
            first=await client.get("/api/files/review",params={"path":path});second=await client.get("/api/files/review",params={"path":path})
            assert first.status_code==200,first.text
            assert first.json()==second.json()
            if path==supplied: assert first.json()["comments"][0]["entries"][0]["created_at"]=="2024-01-01T09:00:00Z"
        manifest=await client.get(BASE+"/context/RUN-read-only-review")
        assert manifest.status_code==200,manifest.text
    assert before=={path:ctx.vault.resolve(path).read_bytes() for path in paths}
    assert set(paths)=={ctx.vault.relative(path) for path in ctx.vault.iter_files(ctx.matters.matter_path(MATTER))}

@pytest.mark.asyncio
@pytest.mark.parametrize("recover_existing", [False, True])
async def test_explicit_draft_in_active_intake_saves_prose_and_replays_exactly(continuity_app, app_context, monkeypatch, recover_existing):
    from app.providers.base import ProviderReply, ProviderToolCall
    ctx = app_context; roster(ctx)
    conversation = ctx.chat_history.append(MATTER, None, role="user", content="Review this pilot.", conversation_kind="intake", intake_state="active", active_agent_id="intake-agent")
    supplied_path = ctx.matters.matter_path(MATTER) + "/documents/supplied-version-1.txt"
    ctx.vault.resolve(supplied_path).parent.mkdir(parents=True, exist_ok=True)
    ctx.vault.resolve(supplied_path).write_bytes(b"Version 1: keep records for 30 days.\r\nOnly customers can open them.\r\n")
    original = ctx.vault.resolve(supplied_path).read_bytes()
    records = [ctx.matters.matter_path(MATTER) + "/" + name for name in ("facts.md", "issues.md", "recommendations.md")]
    before = {path: ctx.vault.resolve(path).read_bytes() for path in records if ctx.vault.exists(path)}
    decisions = list(ctx.vault.iter_files("04_Decisions"))
    answer_before = ctx.workspace.get(MATTER)["short_answer"]
    body = "Qualification before the title stays in the draft.\n# Pilot review memo\n## Summary\nUse the supplied v1 as a working baseline.\n## Open items\nSupport access is reported, not independently verified."
    class ProseOnly:
        calls = 0
        dossier_calls = 0
        tool_names = set()
        async def complete(self, messages, tools=None):
            if str(messages[0].get("content", "")).startswith("Dossier-generation action."):
                self.dossier_calls += 1
                assert not tools
                return ProviderReply(content="# Updated dossier\n\n## Current position\n\nThe draft is ready for review.")
            self.calls += 1
            self.tool_names.update(tool["function"]["name"] for tool in tools or [])
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": "actual", "instruction_quote": "Create a new separate working draft titled Pilot review memo."})])
            return ProviderReply(content=body)
    provider = ProseOnly(); ctx.runner.provider = provider
    real_recovery = ctx.chat_runs._recover_draft_output
    original_create = ctx.work_products.create_draft
    saving_states = []
    def observed_create(*args, **kwargs):
        saving_states.append(ctx.chat_runs.get(MATTER, kwargs["source_run_id"])["state"])
        return original_create(*args, **kwargs)
    monkeypatch.setattr(ctx.work_products, "create_draft", observed_create)
    if recover_existing:
        monkeypatch.setattr(ctx.chat_runs, "_recover_draft_output", lambda run: run)
    command = {"message": "Create a new separate working draft titled Pilot review memo. Save it in the existing editor. Do not change sources, facts, or decisions.",
        "conversation_id": conversation["conversation_id"], "workspace_action": "draft", "source_action_key": "explicit-draft:1",
        "target": {"matter_id": MATTER, "artifact_path": supplied_path}, "expected_question_revision": ctx.workspace.business_question(MATTER)["revision"]}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        first = await client.post(f"/api/matters/{MATTER}/chat-runs", json=command, headers={"X-Themis-Person-Id": "alex"})
        assert first.status_code == 202, first.text
        run = first.json(); await ctx.chat_runs._tasks[run["run_id"]]
        completed = ctx.chat_runs.get(MATTER, run["run_id"])
        assert completed["state"] == "completed" and completed["selection"]["agent_id"] == "counsel-copilot", completed
        assert "save_work_product" in provider.tool_names, provider.tool_names
        assert completed["response"]["reply"] == body
        if recover_existing:
            assert not ctx.work_products.list_drafts(MATTER)
            monkeypatch.setattr(ctx.chat_runs, "_recover_draft_output", real_recovery)
        replay = await client.post(f"/api/matters/{MATTER}/chat-runs", json=command, headers={"X-Themis-Person-Id": "jordan"})
        assert replay.status_code == 202, replay.text
        assert replay.json()["run_id"] == run["run_id"] and replay.json()["action_actor"]["person_id"] == "alex"
        drafts = ctx.work_products.list_drafts(MATTER)
        assert len(drafts) == 1 and drafts[0]["source_run_id"] == run["run_id"]
        draft = ctx.vault.read_markdown(drafts[0]["path"])
        assert draft["content"].strip() == body and draft["metadata"]["source_action_key"] == "explicit-draft:1"
        assert draft["metadata"]["draft_context"]["action_actor"]["person_id"] == "alex"
        assert draft["metadata"]["draft_context"]["target"]["artifact_path"] == supplied_path
        assert draft["metadata"]["immutable"] is False
        assert provider.calls == 2
        assert provider.dossier_calls <= 1
        assert saving_states == ["completed" if recover_existing else "running"], "A new run must finish the save before publishing completed state"
        second = await client.post(f"/api/matters/{MATTER}/chat-runs", json=command, headers={"X-Themis-Person-Id": "alex"})
        assert second.json()["run_id"] == run["run_id"] and len(ctx.work_products.list_drafts(MATTER)) == 1
        assert (await client.post(f"/api/matters/{MATTER}/chat-runs", json={**command, "message": "Changed instruction"})).status_code == 409
    assert ctx.vault.resolve(supplied_path).read_bytes() == original
    assert before == {path: ctx.vault.resolve(path).read_bytes() for path in before}
    assert list(ctx.vault.iter_files("04_Decisions")) == decisions
    assert ctx.workspace.get(MATTER)["short_answer"] == answer_before
    saved = ctx.chat_history.get(MATTER, conversation["conversation_id"])
    assert any(message["role"] == "assistant" and message["content"] == body and any(card["type"] == "work_product" for card in message["cards"]) for message in saved["messages"])

@pytest.mark.asyncio
async def test_draft_prose_recovery_never_replaces_existing_work_product(continuity_app, app_context):
    from app.providers.base import ProviderReply
    ctx = app_context
    draft = ctx.work_products.create_draft(MATTER, title="Keep existing", content="Original editable work.", source_action_key="keep-draft")
    path = draft["vault_path"]; before = ctx.vault.resolve(path).read_bytes()
    class ProseOnly:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="# Proposed revision\n\nThis prose alone must not replace the selected work.")
    ctx.runner.provider = ProseOnly()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        result = await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": "Draft revised wording.", "workspace_action": "draft", "source_action_key": "selected-draft:no-tool", "target": {"matter_id": MATTER, "artifact_path": path, "artifact_revision": draft["artifact"]["revision"], "artifact_review_revision": draft["artifact"]["review_revision"]}})
        assert result.status_code == 202, result.text
        await ctx.chat_runs._tasks[result.json()["run_id"]]
        assert ctx.chat_runs.get(MATTER, result.json()["run_id"])["state"] == "completed"
    assert ctx.vault.resolve(path).read_bytes() == before
    assert len(ctx.work_products.list_drafts(MATTER)) == 1

@pytest.mark.asyncio
async def test_structured_draft_uses_existing_writer_once(continuity_app, app_context):
    from app.providers.base import ProviderReply, ProviderToolCall
    ctx = app_context
    conversation = ctx.chat_history.append(MATTER, None, role="user", content="Review the pilot.", conversation_kind="intake", intake_state="active", active_agent_id="intake-agent")
    class TypedDraft:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": "actual", "instruction_quote": "Create a new separate working draft."})])
            if self.calls == 2:
                assert "save_work_product" in {item["function"]["name"] for item in tools}
                return ProviderReply(tool_calls=[ProviderToolCall(id="save", name="save_work_product", arguments={"kind": "draft", "operation": "create", "title": "Saved through existing writer", "content": "Working memo body."})])
            return ProviderReply(content="The working memo is saved.")
    ctx.runner.provider = TypedDraft()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        result = await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": "Create a new separate working draft.", "workspace_action": "draft", "source_action_key": "typed-draft:1", "conversation_id": conversation["conversation_id"]})
        assert result.status_code == 202, result.text
        await ctx.chat_runs._tasks[result.json()["run_id"]]
        completed = ctx.chat_runs.get(MATTER, result.json()["run_id"])
        assert completed["state"] == "completed", completed
        drafts = ctx.work_products.list_drafts(MATTER)
        assert len(drafts) == 1 and drafts[0]["source_run_id"] == result.json()["run_id"]
        assert ctx.vault.read_markdown(drafts[0]["path"])["content"].strip() == "Working memo body."
        assert not completed.get("draft_recovery")

@pytest.mark.asyncio
async def test_saved_draft_retry_repairs_missing_conversation_projection(continuity_app, app_context, monkeypatch):
    from app.providers.base import ProviderReply
    ctx = app_context; roster(ctx)
    class ProseOnly:
        calls = 0
        dossier_calls = 0
        async def complete(self, messages, tools=None):
            if str(messages[0].get("content", "")).startswith("Dossier-generation action."):
                self.dossier_calls += 1
                assert not tools
                return ProviderReply(content="# Updated dossier\n\n## Current position\n\nThe recovered draft is ready for review.")
            self.calls += 1
            return ProviderReply(content="# Recovery memo\nPreserve this useful draft response.")
    provider = ProseOnly(); ctx.runner.provider = provider
    real_sync = ctx.chat_history.upsert_run_assistant
    failures = 0
    def lose_projection(*args, **kwargs):
        nonlocal failures
        if any(card.get("type") == "work_product" for card in kwargs.get("cards", [])) and failures == 0:
            failures += 1
            raise OSError("Injected failure after durable draft save")
        return real_sync(*args, **kwargs)
    monkeypatch.setattr(ctx.chat_history, "upsert_run_assistant", lose_projection)
    command = {"message": "Create a new separate working draft.", "workspace_action": "draft", "source_action_key": "draft-projection:1"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        first = await client.post(f"/api/matters/{MATTER}/chat-runs", json=command, headers={"X-Themis-Person-Id": "alex"})
        assert first.status_code == 202, first.text
        run_id = first.json()["run_id"]; await ctx.chat_runs._tasks[run_id]
        run = ctx.chat_runs.get(MATTER, run_id)
        assert run["state"] == "completed" and run["draft_recovery"]["state"] == "not_saved"
        drafts = ctx.work_products.list_drafts(MATTER)
        assert len(drafts) == 1 and failures == 1
        assistant = ctx.chat_history.find_run_message(MATTER, run["conversation_id"], run_id, "assistant")
        assert not any(card["type"] == "work_product" for card in assistant["cards"])
        # A lawyer's intervening edit must survive projection-only recovery.
        draft = ctx.vault.read_markdown(drafts[0]["path"])
        ctx.vault.write_markdown(draft["path"], draft["content"] + "\nLawyer's retained addition.\n", draft["metadata"])
        edited_bytes = ctx.vault.resolve(draft["path"]).read_bytes()
        def forbid_creation(*args, **kwargs):
            raise AssertionError("Projection retry must reuse the existing artifact")
        monkeypatch.setattr(ctx.work_products, "create_draft", forbid_creation)
        for _ in range(2):
            replay = await client.post(f"/api/matters/{MATTER}/chat-runs", json=command, headers={"X-Themis-Person-Id": "jordan"})
            assert replay.status_code == 202, replay.text
            assert replay.json()["run_id"] == run_id and replay.json()["action_actor"]["person_id"] == "alex"
        repaired = ctx.chat_runs.get(MATTER, run_id)
        assert repaired["draft_recovery"]["state"] == "saved"
        assert repaired["conversation_id"] == run["conversation_id"]
        assert repaired["response"]["reply"] == run["response"]["reply"]
        assert repaired["response"]["operation_results"] == run["response"]["operation_results"], "Projection repair must retain the original saved result and its changed links"
        assistant = ctx.chat_history.find_run_message(MATTER, run["conversation_id"], run_id, "assistant")
        assert len([card for card in assistant["cards"] if card.get("vault_path") == draft["path"]]) == 1
        assert len([op for op in assistant["operation_results"] if op.get("operation") == "save_work_product_draft"]) == 1
        assert ctx.vault.resolve(draft["path"]).read_bytes() == edited_bytes
        assert len(ctx.work_products.list_drafts(MATTER)) == 1 and provider.calls == 1
        assert provider.dossier_calls == 1
