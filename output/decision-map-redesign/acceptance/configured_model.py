"""One real configured-provider inquiry against only the synthetic vault."""
import asyncio,json,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'backend'))
from fastapi import FastAPI
import httpx
from app.config import Settings
from app.runtime import AppContext
from app.routers import workspace,chat
out=Path(__file__).parent;E=json.loads((out/'environment.json').read_text())
async def main():
 ctx=AppContext(Settings(vault_path=E['vault'],scheduler_enabled=False,search_provider='disabled',polaris_api_key=None))
 app=FastAPI();app.state.context=ctx;app.include_router(workspace.router,prefix='/api');app.include_router(chat.router,prefix='/api')
 result={'configured_provider':ctx.settings.llm_provider,'configured_model':ctx.settings.llm_model,'search':'disabled','matter_id':E['matter_id']}
 try:
  assert ctx.settings.llm_provider!='mock', 'No real provider configured'
  async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url='http://testserver',timeout=240) as client:
   response=await client.post(f"/api/matters/{E['matter_id']}/workspace/actions",json={'action':'explain','target':{'matter_id':E['matter_id'],'issue_id':'ISS-TIMING'},'source_action_key':'map-configured-analysis-3','instruction':'Analyze the possible release paths for this issue using the supplied fictional contract. Explain the rule, actor, exception, unknown timing and two conditional routes plus a business alternative. This is an actual issue inquiry in this isolated workspace, not a hypothetical scenario. Return your answer in this inquiry. Do not call tools to save recommendations or work products; the inquiry publisher saves your answer automatically. Do not use public search. Provide useful prose and the optional decision-paths structure described in your instructions.'})
   result['start_status']=response.status_code
   response.raise_for_status();run=response.json();result['run_id']=run['run_id']
   await ctx.chat_runs.wait(run['run_id'])
   saved=ctx.chat_runs.get(E['matter_id'],run['run_id'])
   result.update(state=saved.get('state'),selection=saved.get('selection'),failure_detail=saved.get('failure_detail'),response=saved.get('response'))
   result['map']=(await client.get(f"/api/matters/{E['matter_id']}/workspace/decision-map")).json()
 except Exception as exc:
  result['blocker']=f'{type(exc).__name__}: {exc}'
 finally:
  await ctx.close_providers()
  (out/'configured-model-result.json').write_text(json.dumps(result,indent=2,default=str))
  print(json.dumps({k:v for k,v in result.items() if k not in {'response','map'}},default=str))
asyncio.run(main())
