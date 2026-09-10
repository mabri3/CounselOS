"""Assembled lifecycle in the disposable browser vault; scripted model."""
import asyncio,json,sys
from dataclasses import replace
from pathlib import Path
root=Path(__file__).resolve().parents[2];sys.path.insert(0,str(root/'backend'));sys.path.insert(0,str(root/'backend/tests'))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import MatterCreate
from app.services.research_publication import publish_research_result
from app.providers.base import ProviderReply
from test_problem_analysis import payload
import test_problem_analysis_integration as helpers
async def main():
 fixture=json.loads((root/'output/problem-decomposition/stories-fixture.json').read_text());ctx=AppContext(Settings(_env_file=None,vault_path=fixture['vault'],scheduler_enabled=False,llm_provider='mock',llm_api_key=None,search_provider='disabled'))
 matter=ctx.matters.create(MatterCreate(title='Synthetic lifecycle D',request_text='Assess the support pilot.'));mid=matter['matter_id'];helpers.MATTER=mid
 first=await helpers.run_chat(ctx,helpers.Provider(mutation=('update_matter_intake',{'working_ask':'Assess the support pilot.','reported_facts':[{'statement':'The vendor use is internal only.'}],'intake_state':'complete'})),agent_id='intake-agent')
 bq=ctx.workspace.business_question(mid);q=ctx.workspace.save_question(mid,{'question_id':'WQ-D','text':'Does the vendor retain chats?','business_question_id':bq['question_id'],'business_question_revision':bq['revision']})
 answer=ctx.workspace.answer_question(mid,q['question_id'],{'expected_revision':q['source_revision'],'source_action_key':'D-answer','state':'answered','answer':'Yes, for thirty days.'})
 await helpers.run_chat(ctx,helpers.Provider(),conversation_id=first['conversation_id'])
 initial=ctx.problem_analysis.resolve(mid)['reference'];decisions=ctx.decisions.list();started=asyncio.Event();release=asyncio.Event();calls=[]
 class Slow:
  async def complete(self,messages,tools=None):
   calls.append(1);started.set();await release.wait()
   return ProviderReply(content='Historical research answer on the earlier inputs.\n```problem-analysis\n'+json.dumps(payload())+'\n```')
 resolved=replace(ctx.runner.resolve('counsel-copilot'),provider=Slow());ctx.research_runs.resolve_main=lambda:resolved;ctx.research_runs.resolve_selection=lambda selection:replace(resolved,selection=selection)
 run=ctx.research_runs.start(mid,['Synthetic vendor-use condition'],origin_conversation_id=first['conversation_id']);await asyncio.wait_for(started.wait(),10)
 fact=next(f for f in ctx.matter_records.get(mid)['facts'] if f['text']=='The vendor use is internal only.')
 ctx.workspace_scenarios.correct_fact(mid,fact_id=fact['fact_id'],replacement='The vendor trains its general model.',expected_revisions=ctx.workspace.source_revisions(mid),source_action_key='D-correction',trusted_user_action=True,source_message_id='D-lawyer-message')
 await helpers.run_chat(ctx,helpers.Provider(),conversation_id=first['conversation_id']);current=ctx.problem_analysis.resolve(mid)['reference'];assert current!=initial
 release.set();await ctx.research_runs.wait_for_active_work();done=ctx.research_runs.get(mid,run['run_id']);assert done['state']=='completed',done
 path=done['results'][0]['path'];packet=ctx.vault.read_markdown(path);historical=packet['metadata']['problem_analysis'];assert historical['prior_reference']==initial
 assert ctx.problem_analysis.resolve(mid)['reference']==current
 count=len(calls);facts=ctx.matter_records.get(mid)['facts'];assert any(f.get('supersedes')==fact['fact_id'] for f in facts)
 publish_research_result(ctx,matter_id=mid,run_id=run['run_id'],packet_path=path,prose=packet['metadata']['research_prose'],synthesis=packet['metadata'].get('research_synthesis'))
 assert len(calls)==count and ctx.matter_records.get(mid)['facts']==facts
 reply=await helpers.run_chat(ctx,helpers.Provider(malformed=True),conversation_id=first['conversation_id']);assert 'useful conditional answer' in reply['reply']
 assert ctx.problem_analysis.resolve(mid)['reference']==current
 ctx.index.rebuild();assert ctx.problem_analysis.resolve(mid)['reference']==current and ctx.decisions.list()==decisions
 result={'matter_id':mid,'vault':fixture['vault'],'initial':initial,'current':current,'historical_research':{'run_id':run['run_id'],'path':path,'analysis_id':historical['analysis_id']},'typed_answer':answer,'fact_count':len(facts),'provider_research_calls':count,'retry_no_calls':True,'index_rebuild_same':True,'pass':True}
 (root/'output/problem-decomposition/story-D-results.json').write_text(json.dumps(result,indent=2));await ctx.provider_router.close()
asyncio.run(main())
