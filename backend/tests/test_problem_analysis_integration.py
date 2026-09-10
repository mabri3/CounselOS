"""Real HTTP/runner/tools/storage. Only the model boundary is scripted."""
import json
import httpx
import pytest
from fastapi import FastAPI
from app.providers.base import ProviderReply, ProviderToolCall
from app.routers import chat, workspace
from test_problem_analysis import MATTER, payload


async def run_chat(ctx, provider, message="Assess this actual matter.", **kwargs):
    ctx.runner.provider=provider
    application=FastAPI();application.state.context=ctx
    for router in (chat.router, workspace.router): application.include_router(router,prefix="/api")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application),base_url="http://test") as client:
        response=await client.post("/api/chat",json={"matter_id":MATTER,"message":message,**kwargs})
    assert response.status_code == 200,response.text
    return response.json()


class Provider:
    def __init__(self, *, mutation=None, scope="actual", malformed=False):
        self.calls=0;self.mutation=mutation;self.scope=scope;self.malformed=malformed
    async def complete(self,messages,tools=None):
        self.calls+=1
        if self.calls == 1:
            return ProviderReply(tool_calls=[ProviderToolCall(id="scope",name="select_conversation_scope",arguments={"scope":self.scope,"instruction_quote":next(m["content"] for m in reversed(messages) if m["role"] == "user")})])
        if self.calls == 2 and self.mutation:
            return ProviderReply(tool_calls=[ProviderToolCall(id="mutation",name=self.mutation[0],arguments=self.mutation[1])])
        return ProviderReply(content="A useful conditional answer.\n\n```problem-analysis\n"+("{bad}" if self.malformed else json.dumps(payload()))+"\n```")


@pytest.mark.asyncio
async def test_actual_chat_and_recommendation_save_publish_map(app_context):
    ctx=app_context;decisions=ctx.decisions.list()
    first=await run_chat(ctx,Provider())
    assert "useful conditional" in first["reply"] and "problem-analysis" not in first["reply"]
    previous=ctx.problem_analysis.resolve(MATTER)
    assert previous["state"] == "saved",previous
    second=await run_chat(ctx,Provider(mutation=("save_work_product",{"kind":"recommendation","title":"Working view","content":"Assess vendor reuse before this pilot."})),conversation_id=first["conversation_id"])
    assert any(t["tool"] == "save_work_product" and t["status"] == "success" for t in second["trace"]),second
    current=ctx.problem_analysis.resolve(MATTER)
    assert current["state"] == "saved",current
    assert current["reference"] != previous["reference"]
    assert current["analysis"]["prior_reference"] == previous["reference"]
    assert ctx.decisions.list() == decisions


@pytest.mark.asyncio
@pytest.mark.parametrize("case",["scenario","preview","artifact","no-save","malformed"])
async def test_ineligible_or_malformed_turn_keeps_prior(app_context,case):
    ctx=app_context;first=await run_chat(ctx,Provider());before=ctx.problem_analysis.resolve(MATTER)["reference"]
    kwargs={"conversation_id":first["conversation_id"]}
    message="Assess this actual matter."
    if case == "preview": kwargs["preview"]=True
    if case == "artifact":
        draft=ctx.work_products.create_draft(MATTER,title="Synthetic draft",content="Please review.")
        kwargs["target"]={"matter_id":MATTER,"artifact_path":draft["vault_path"]}
    if case == "no-save": message += " Do not save or update records."
    result=await run_chat(ctx,Provider(scope="scenario" if case=="scenario" else "actual",malformed=case=="malformed"),message=message,**kwargs)
    assert "useful conditional" in result["reply"] and "{bad}" not in result["reply"]
    assert ctx.problem_analysis.resolve(MATTER)["reference"] == before


@pytest.mark.asyncio
async def test_intake_observes_saved_facts_before_final_map(app_context):
    ctx=app_context
    class IntakeProvider:
        calls=0
        async def complete(self,messages,tools=None):
            self.calls+=1
            if self.calls==1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope",name="select_conversation_scope",arguments={"scope":"actual","instruction_quote":next(m["content"] for m in reversed(messages) if m["role"] == "user")})])
            if self.calls==2:
                return ProviderReply(tool_calls=[ProviderToolCall(id="intake",name="update_matter_intake",arguments={"working_ask":"Assess this support pilot.","reported_facts":[{"statement":"The vendor reuses chats for general model training."}],"intake_state":"complete"})])
            observed=json.loads(next(m["content"] for m in reversed(messages) if m.get("name")=="update_matter_intake"))["data"]["observed_problem_inputs"]
            fact=next(f for f in observed["facts"] if "vendor reuses" in f["text"])
            p=payload();p["parts"][0].update(status="reported",references=[{"kind":"fact","record_id":fact["fact_id"]}])
            return ProviderReply(content="Vendor reuse changes the answer.\n\n```problem-analysis\n"+json.dumps(p)+"\n```")
    response=await run_chat(ctx,IntakeProvider(),agent_id="intake-agent")
    result=ctx.problem_analysis.resolve(MATTER)
    assert result["state"] == "saved",(result,response)
    assert result["analysis"]["parts"][0]["status"] == "reported"
    assert len(result["analysis"]["parts"][0]["references"])==1


@pytest.mark.asyncio
async def test_wording_edit_needs_no_research_or_map(app_context):
    class DraftProvider:
        calls=0
        async def complete(self,messages,tools=None):
            self.calls+=1
            return ProviderReply(content="Please review the pilot terms.")
    provider=DraftProvider()
    response=await run_chat(app_context,provider,message="Shorten this sentence: Please take time to review the pilot terms.")
    assert response["reply"] == "Please review the pilot terms."
    assert provider.calls==1 and not response["trace"]
    assert app_context.problem_analysis.resolve(MATTER)["state"] == "not_analyzed"


@pytest.mark.asyncio
@pytest.mark.parametrize("mode",["failure", "step_limit"])
async def test_final_recovery_keeps_optional_map(app_context,mode):
    class RecoveryProvider:
        calls=0
        async def complete(self,messages,tools=None):
            self.calls+=1
            if self.calls==1:
                return ProviderReply(tool_calls=[ProviderToolCall(id="scope",name="select_conversation_scope",arguments={"scope":"actual","instruction_quote":next(m["content"] for m in reversed(messages) if m["role"] == "user")})])
            if tools is not None:
                if mode=="failure": raise RuntimeError("Synthetic provider failure")
                return ProviderReply(tool_calls=[ProviderToolCall(id=f"read-{self.calls}",name="list_files",arguments={"path":app_context.matters.matter_path(MATTER)})])
            return ProviderReply(content="Useful final answer at the limit.\n\n```problem-analysis\n"+json.dumps(payload())+"\n```")
    provider=RecoveryProvider()
    response=await run_chat(app_context,provider)
    assert "Useful final answer" in response["reply"] and "problem-analysis" not in response["reply"]
    assert app_context.problem_analysis.resolve(MATTER)["state"] == "saved"


@pytest.mark.asyncio
@pytest.mark.parametrize("scope",["matter","issue","concurrent_fact","malformed"])
async def test_real_research_queue_publishes_packet_and_replays(app_context,scope):
    from dataclasses import replace
    from app.services.research_publication import publish_research_result
    ctx=app_context
    calls=[]
    class Main:
        async def complete(self,messages,tools=None):
            calls.append(messages)
            if scope=="concurrent_fact":
                ctx.matter_records.apply_update(MATTER,facts=[{"text":"A concurrent correction changes the activity."}],actor="Lawyer")
            structure=payload()
            issue=ctx.workspace.issues(MATTER)[0]["issue_id"]
            fences=[("problem-analysis",structure), ("research-synthesis",{"summary":"Assess reuse.","recommendation":"Assess reuse before the pilot."}),
                    ("decision-paths",{"issue_analysis":{"issue_id":issue,"explanation":"Separate activity.","tests":[],"conditions":[],"options":[]}}),
                    ("claim-support",{"claims":[]})]
            return ProviderReply(content="Useful fictional research answer.\n\n"+"\n\n".join("```"+kind+"\n"+("{bad}" if scope=="malformed" and kind=="problem-analysis" else json.dumps(value))+"\n```" for kind,value in fences))
    resolved=replace(ctx.runner.resolve("counsel-copilot"),provider=Main())
    ctx.research_runs.resolve_main=lambda:resolved
    ctx.research_runs.resolve_selection=lambda selection:replace(resolved,selection=selection)
    conversation=ctx.chat_history.append(MATTER,None,role="user",content="Investigate the fictional support pilot.")
    run=ctx.research_runs.start(MATTER,["Fictional vendor-use policy"],issue_id=ctx.workspace.issues(MATTER)[0]["issue_id"] if scope=="issue" else None,origin_conversation_id=conversation["conversation_id"])
    await ctx.research_runs.wait_for_active_work()
    saved=ctx.research_runs.get(MATTER,run["run_id"])
    assert saved["state"]=="completed",saved.get("failure_detail")
    path=saved["results"][0]["path"]
    packet=ctx.vault.read_markdown(path)
    assert "Useful fictional research answer." in packet["content"]
    for name in ("problem-analysis","claim-support","decision-paths","research-synthesis"):
        assert "```"+name not in packet["content"]
    if scope=="matter":
        result=ctx.problem_analysis.resolve(MATTER)
        assert result["state"]=="saved",result
        assert result["reference"]["source_path"]==path
        before=len(calls)
        publish_research_result(ctx,matter_id=MATTER,run_id=run["run_id"],packet_path=path,prose=packet["metadata"]["research_prose"],synthesis=packet["metadata"]["research_synthesis"])
        assert len(calls)==before
        assert ctx.problem_analysis.resolve(MATTER)["reference"]==result["reference"]
    elif scope in {"issue","concurrent_fact"}:
        assert packet["metadata"].get("problem_analysis")
        assert ctx.problem_analysis.resolve(MATTER)["state"]=="not_analyzed"
    else:
        assert not packet["metadata"].get("problem_analysis")


@pytest.mark.asyncio
async def test_public_passage_map_and_pointer_retry_use_saved_packet(app_context,monkeypatch):
    from tests.manual.serve_research_investigation import install_boundaries
    from app.models.research_scope import ResearchScope
    from app.services.research_publication import publish_research_result
    ctx=app_context;main,discoveries,fetches=install_boundaries(ctx,monkeypatch)
    complete=main.complete
    async def with_map(messages,tools=None):
        result=await complete(messages,tools)
        if not result.tool_calls and any(m.get("name")=="read_research_source" for m in messages):
            observation=json.loads(next(m["content"] for m in reversed(messages) if m.get("name")=="read_research_source"))["data"]
            p=payload();p["questions"][0]["references"]=[{"kind":"source","record_id":observation["source_id"]}]
            result.content += "\n\n```problem-analysis\n"+json.dumps(p)+"\n```"
        return result
    main.complete=with_map
    original=ctx.vault.write_markdown
    failed=False
    def fail_pointer(path,content,metadata=None,**kwargs):
        nonlocal failed
        if not failed and path==ctx.workspace._path(MATTER) and (metadata or {}).get("problem_analysis_reference"):
            failed=True;raise OSError("Synthetic one-time pointer failure")
        return original(path,content,metadata,**kwargs)
    monkeypatch.setattr(ctx.vault,"write_markdown",fail_pointer)
    run=ctx.research_runs.start(MATTER,["Synthetic transfer permission rule"],search_scope=ResearchScope(external=True,native=True,public_query="Synthetic transfer permission rule",allow_followup_queries=True))
    await ctx.research_runs.wait_for_active_work()
    saved=ctx.research_runs.get(MATTER,run["run_id"])
    assert saved["state"]=="completed",saved.get("failure_detail")
    packet_path=saved["results"][0]["path"];packet=ctx.vault.read_markdown(packet_path)
    assert failed and packet["metadata"].get("problem_analysis"),saved
    before=(len(main.calls),len(discoveries),len(fetches))
    publish_research_result(ctx,matter_id=MATTER,run_id=run["run_id"],packet_path=packet_path,prose=packet["metadata"]["research_prose"],synthesis=packet["metadata"]["research_synthesis"])
    assert (len(main.calls),len(discoveries),len(fetches))==before
    analysis=ctx.problem_analysis.resolve(MATTER)
    assert analysis["state"]=="saved",analysis
    source=analysis["analysis"]["resolved_references"][0]
    assert source["passages"] and source["availability"]=="selected_passage"
    assert "Written consent" in source["passages"][0]["text"]


@pytest.mark.asyncio
async def test_history_http_is_exact_and_read_only(app_context):
    ctx=app_context
    await run_chat(ctx,Provider())
    status=ctx.problem_analysis.resolve(MATTER)
    app=FastAPI();app.state.context=ctx;app.include_router(workspace.router,prefix="/api")
    before=ctx.vault.read_text(ctx.workspace._path(MATTER))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url="http://test") as client:
        response=await client.get(f"/api/matters/{MATTER}/workspace/problem-analysis",params={"reference":json.dumps(status["reference"])})
        assert response.status_code==200,response.text
        assert response.json()["state"]=="historical"
        assert response.json()["analysis"]==status["analysis"]
        response=await client.get(f"/api/matters/{MATTER}/workspace/problem-analysis",params={"reference":"[]"})
        assert response.status_code==422,response.text
    assert ctx.vault.read_text(ctx.workspace._path(MATTER))==before

@pytest.mark.asyncio
async def test_typed_answer_returns_observed_basis_before_map(app_context):
    ctx=app_context
    bq=ctx.workspace.business_question(MATTER)
    question=ctx.workspace.save_question(MATTER, {'question_id':'WQ-reuse','business_question_id':bq['question_id'],'business_question_revision':bq['revision'],'text':'Does the vendor reuse chats?'})
    class AnswerProvider(Provider):
        async def complete(self,messages,tools=None):
            if self.calls < 2:
                return await super().complete(messages,tools)
            observed=json.loads(next(m['content'] for m in reversed(messages) if m.get('name')=='answer_workspace_question'))['data']['observed_problem_inputs']
            fact=next(f for f in observed['facts'] if f['text']=='Does the vendor reuse chats? — The vendor trains its general model.')
            p=payload();p['parts'][0].update(status='reported',references=[{'kind':'fact','record_id':fact['fact_id']}])
            return ProviderReply(content='Vendor training changes the conditional answer.\n```problem-analysis\n'+json.dumps(p)+'\n```')
    provider=AnswerProvider(mutation=('answer_workspace_question',{'question_id':question['question_id'],'expected_revision':question['source_revision'],'state':'answered','answer':'The vendor trains its general model.','instruction_quote':'Save this answer'}))
    result=await run_chat(ctx,provider,message='Assess this actual matter. The vendor trains its general model. Save this answer and reassess the actual matter.')
    saved=ctx.problem_analysis.resolve(MATTER)
    assert saved['state']=='saved',(saved,result)
    assert saved['analysis']['parts'][0]['status']=='reported'

@pytest.mark.asyncio
async def test_actual_correction_reassesses_without_erasing_prior(app_context):
    ctx=app_context
    first=await run_chat(ctx,Provider())
    prior=ctx.problem_analysis.resolve(MATTER)['reference']
    original=ctx.matter_records.get(MATTER)['facts'][0]
    class CorrectionProvider(Provider):
        async def complete(self,messages,tools=None):
            if self.calls<2:return await super().complete(messages,tools)
            result=json.loads(next(m['content'] for m in reversed(messages) if m.get('name')=='workspace_action'))
            observed=result['data']['observed_problem_inputs']
            fact=next(f for f in observed['facts'] if f['text']=='The vendor retains chats and trains its general model.')
            p=payload();p['integrated_answer']='Withdraw internal-only reliance. Vendor training requires separate assessment.'
            p['parts'][0].update(status='reported',references=[{'kind':'fact','record_id':fact['fact_id']}])
            p['changes']=[{'kind':'assessment_changed','prior_question_keys':['purpose'],'current_question_keys':['purpose'],'reason':'The lawyer corrected internal-only use.','answer_effect':'Assess the vendor training purpose separately.'}]
            return ProviderReply(content=p['integrated_answer']+'\n```problem-analysis\n'+json.dumps(p)+'\n```')
    response=await run_chat(ctx,CorrectionProvider(mutation=('workspace_action',{'action':'correct_fact','instruction_quote':'Correction: the vendor retains chats and trains its general model.','values':{'fact_id':original['fact_id'],'replacement':'The vendor retains chats and trains its general model.'}})),message='Correction: the vendor retains chats and trains its general model.',conversation_id=first['conversation_id'])
    saved=ctx.problem_analysis.resolve(MATTER)
    assert saved['state']=='saved',(saved,response)
    assert saved['analysis']['prior_reference']==prior
    records=ctx.matter_records.get(MATTER)
    replacement=next(f for f in records['facts'] if f.get('supersedes')==original['fact_id'])
    assert replacement['source_ids'] and any(f['fact_id']==original['fact_id'] for f in records['facts'])
    assert ctx.problem_analysis.load(MATTER,reference=prior)['integrated_answer']=='Separate internal evaluation and vendor reuse.'
