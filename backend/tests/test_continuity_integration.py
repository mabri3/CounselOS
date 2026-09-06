"""Real HTTP continuity seams; only model responses use a deterministic provider."""
import asyncio
import httpx
import pytest
from fastapi import FastAPI
from app.routers import workspace, team, chat, files
from app.models.workspace import WorkspaceQuestion
from app.providers.base import ProviderReply, ProviderToolCall

MATTER = "MAT-DEMO-RELAY"
BASE = f"/api/matters/{MATTER}/workspace"

@pytest.fixture
def continuity_app(app_context):
    app = FastAPI()
    app.state.context = app_context
    for router in (workspace.router, team.router, chat.router, files.router):
        app.include_router(router, prefix="/api")
    return app

def roster(ctx):
    current = ctx.workspace_team.roster()
    return ctx.workspace_team.configure({"enabled": True, "people": [
        {"person_id": "alex", "display_name": "Alex Morgan"},
        {"person_id": "jordan", "display_name": "Jordan Lee"},
        {"person_id": "casey", "display_name": "Casey Chen"}],
        "expected_revision": current["revision"], "source_action_key": "enable"})

def question(ctx):
    business = ctx.workspace.business_question(MATTER)
    return ctx.workspace.save_question(MATTER, WorkspaceQuestion(question_id="Q-continuity", text="Can support open account activity?",
        business_question_id=business["question_id"], business_question_revision=business["revision"]))

def request_command(q, key="request-1"):
    return {"question_id": q["question_id"], "expected_question_revision": q["source_revision"],
        "business_question_revision": q["business_question_revision"], "wording": q["text"], "requested_person": "Sam", "source_action_key": key}

@pytest.mark.asyncio
async def test_real_reply_handoff_and_advice_reads(continuity_app, app_context):
    ctx = app_context
    roster(ctx)
    q = question(ctx)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app), base_url="http://test") as client:
        client.headers["X-Themis-Person-Id"] = "alex"
        created = await client.post(BASE+"/fact-requests", json=request_command(q))
        assert created.status_code == 200, created.text
        req = created.json()["request"]
        exact = "Sam says:\r\n  Only with recorded permission.  "
        saved = await client.post(BASE+f"/fact-requests/{req['request_id']}/replies", json={"expected_revision": req["revision"], "text": exact, "reported_speaker": "Sam", "source_action_key": "reply-1"})
        assert saved.status_code == 200, saved.text
        req = saved.json()["request"]
        reply = req["replies"][0]
        assert reply["text"] == exact and reply["entered_by"]["person_id"] == "alex"
        recorded = await client.post(BASE+f"/fact-requests/{req['request_id']}/replies/{reply['reply_id']}/record", json={
            "expected_revision": req["revision"], "expected_question_revision": q["source_revision"],
            "business_question_revision": q["business_question_revision"], "answer_text": "Support requires recorded permission.", "coverage": "full", "source_action_key": "record-1"})
        assert recorded.status_code == 200, recorded.text
        assert recorded.json()["receipt"]["state"] == "applied"
        scope = (await client.get(BASE+"/scope")).json()
        created = await client.post(BASE+"/handoffs", json={"scope": scope, "recipient_id": "jordan", "ask": "Review the support access answer.", "source_action_key": "handoff-1"})
        assert created.status_code == 200, created.text
        handoff = created.json()["handoff"]
        assert ctx.workspace_team.scope(MATTER)["owner_id"] is None
        client.headers["X-Themis-Person-Id"] = "jordan"
        accepted = await client.post(BASE+f"/handoffs/{handoff['handoff_id']}/actions", json={"action": "accept", "expected_revision": handoff["revision"], "expected_ownership_revision": scope["ownership_revision"], "expected_content_revision": scope["content_revision"], "source_action_key": "accept-1"})
        assert accepted.status_code == 200, accepted.text
        assert ctx.workspace_team.scope(MATTER)["owner_id"] == "jordan"
        people = ctx.vault.read_markdown(ctx.matters.matter_path(MATTER)+"/participants.md")["metadata"]["participants"]
        assert any(p.get("person_id")=="jordan" and p["role"]=="legal_owner" for p in people)
        orientation = await client.get(BASE+"/orientation")
        assert orientation.status_code == 200, orientation.text

@pytest.mark.asyncio
async def test_existing_intake_question_is_read_only_projection(continuity_app, app_context):
    ctx=app_context
    ctx.chat_history.append(MATTER, None, role="assistant", content="Support may access records only under a limited permission policy.",
        cards=[{"type":"question", "question_id":"Q-support-access", "text":"Can support open the account reports?"}])
    paths=list(ctx.vault.iter_files(ctx.matters.matter_path(MATTER), {".md"}))
    before={str(p):p.read_bytes() for p in paths}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        saved=(await client.get(BASE)).json()
        assert any(q["question_id"]=="Q-support-access" for q in saved["questions"])
        orientation=(await client.get(BASE+"/orientation")).json()
        assert orientation["answer"] and orientation["answer_path"]  # Existing working advice has precedence.
    assert before=={str(p):p.read_bytes() for p in paths}

class ComparisonProvider:
    def __init__(self): self.calls=0; self.tools=[]
    async def complete(self, messages, tools=None):
        self.calls+=1; self.tools.append(tools or [])
        if self.calls==1:
            return ProviderReply(content="The revised retention period may change the earlier advice.", tool_calls=[ProviderToolCall(id="hostile", name="run_research", arguments={"query":"PRIVATE SPEC"})])
        return ProviderReply(content="The revised retention period changes the earlier basis. Review the saved advice before relying on it.")

@pytest.mark.asyncio
async def test_comparison_uses_same_run_and_blocks_public_tools(continuity_app, app_context):
    ctx=app_context
    base=ctx.matters.matter_path(MATTER)
    ctx.vault.write_markdown(base+"/documents/spec-old.md", "Keep records for 30 days.", {"source_id":"spec-old"})
    ctx.vault.write_markdown(base+"/documents/spec-new.md", "Keep records for 60 days.", {"source_id":"spec-new"})
    for name in ("old", "new"):
        import hashlib
        path=base+f"/documents/spec-{name}.md"
        ctx.matter_records.ensure_source(MATTER, source_id=f"spec-{name}", kind="file", label=f"Spec {name}", path=path, version=hashlib.sha256(ctx.vault.resolve(path).read_bytes()).hexdigest())
    source_bytes={name:ctx.vault.resolve(base+f"/documents/spec-{name}.md").read_bytes() for name in ("old", "new")}
    conversation=ctx.chat_history.append(MATTER,None,role="assistant",content="The earlier advice supports keeping records for 30 days, subject to the supplied policy.")
    candidates=ctx.change_impact.candidates(MATTER)
    sources=candidates["sources"]
    before=next(s for s in sources if "spec-old" in s["path"])
    after=next(s for s in sources if "spec-new" in s["path"])
    advice=next(t for t in candidates["targets"] if t["kind"]=="advice")
    provider=ComparisonProvider();ctx.runner.provider=provider
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        prepared=await client.post(BASE+"/impacts",json={"before":before,"after":after,"targets":[advice],"business_question_revision":ctx.workspace.business_question(MATTER)["revision"],"source_action_key":"compare-1"})
        assert prepared.status_code==200,prepared.text
        cid=prepared.json()["comparison_id"]
        started=await client.post(BASE+f"/impacts/{cid}/analyze",json={"source_action_key":"analyze-1","conversation_id":conversation["conversation_id"]})
        assert started.status_code==200,started.text
        rid=started.json()["run_id"]
        await ctx.chat_runs._tasks[rid]
        run=ctx.chat_runs.get(MATTER,rid)
        assert run["state"]=="completed",run
        assert run["conversation_id"]==conversation["conversation_id"]
        result=ctx.change_impact.get(MATTER,cid)
        assert "retention" in result["analysis"]
        assert all(t["function"]["name"]!="run_research" for tools in provider.tools for t in tools)
        assert source_bytes=={name:ctx.vault.resolve(base+f"/documents/spec-{name}.md").read_bytes() for name in ("old", "new")}

@pytest.mark.asyncio
async def test_initial_intake_question_uses_recorded_publication_basis_after_reload(continuity_app,app_context):
    from app.models.api import MatterCreate
    from test_workspace_lifecycle import Provider
    ctx=app_context
    mid=ctx.matters.create(MatterCreate(title="Fictional initial intake basis",request_text="Assess the account report pilot."))["matter_id"]
    before_question=ctx.workspace.business_question(mid)
    instruction="Assess the account report pilot."
    ctx.runner.provider=Provider(instruction,[("update_matter_intake",{"working_ask":"Can support open account reports during the pilot?","next_questions":[{"question_id":"Q-initial-support","text":"When can support open a customer report?"}],"intake_state":"active"})],reply="The pilot can proceed if support access is limited and recorded. Confirm who can open each report.")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=continuity_app),base_url="http://test") as client:
        started=await client.post(f"/api/matters/{mid}/chat-runs",json={"matter_id":mid,"message":instruction,"agent_id":"intake-agent","source_action_key":"initial-intake"})
        assert started.status_code==202,started.text
        run_id=started.json()["run_id"];await ctx.chat_runs._tasks[run_id]
        run=ctx.chat_runs.get(mid,run_id)
        current=ctx.workspace.business_question(mid)
        assert current["revision"]!=before_question["revision"]
        assert run["frozen_context"]["intake_publication_baseline"]["business_question"]==current["revision"]
        paths=list(ctx.vault.iter_files(ctx.matters.matter_path(mid)))
        saved_bytes={str(path):path.read_bytes() for path in paths}
        first=await client.get(f"/api/matters/{mid}/workspace")
        second=await client.get(f"/api/matters/{mid}/workspace")
        assert first.status_code==second.status_code==200
        supporting=next(q for q in second.json()["questions"] if q["question_id"]=="Q-initial-support")
        assert supporting["business_question_revision"]==current["revision"]
        assert saved_bytes=={str(path):path.read_bytes() for path in paths}
        prepared=await client.post(f"/api/matters/{mid}/workspace/fact-requests",json={"question_id":supporting["question_id"],"expected_question_revision":supporting["source_revision"],"business_question_revision":current["revision"],"wording":"Could you confirm when support can open reports?","source_action_key":"initial-support-request"})
        assert prepared.status_code==200,prepared.text
        assert prepared.json()["request"]["question_id"]==supporting["question_id"]
        ctx.workspace.change_business_question(mid,{"text":"A later and different business decision?","expected_revision":current["revision"],"source_action_key":"later-user-reframe"})
        reframed=await client.get(f"/api/matters/{mid}/workspace")
        assert not any(q["question_id"]=="Q-initial-support" for q in reframed.json()["questions"])
