import sys,asyncio,json
from pathlib import Path
sys.path.insert(0,str(Path('backend').resolve()))
from fastapi import APIRouter, Request
from app.config import Settings
from app.runtime import AppContext
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderReply, ProviderSelection
from tests.manual.serve_dossier_research import prepare_vault,seed_matter,install_fixture_boundaries
from tests.manual.serve_research_investigation import make_app
vault=prepare_vault(Path('output/chat-submit-dossier-fix/browser-vault'),reset=False)
context=AppContext(Settings(_env_file=None,vault_path=str(vault),scheduler_enabled=False,llm_provider='mock',search_provider='disabled',llm_api_key=None,polaris_api_key=None))
issue_ids=seed_matter(context)
install_fixture_boundaries(context,issue_ids)
base=context.runner.resolve('counsel-copilot').provider
submit_gate,plan_gate,workspace_gate=asyncio.Event(),asyncio.Event(),asyncio.Event()
submit_gate.set();workspace_gate.set()
state={'accepted_posts':0,'waiting_posts':0,'planning':False,'workspace_waits':0}
class Provider:
 async def complete(self,messages,tools=None):
  raw='\n'.join(str(m.get('content') or '') for m in messages)
  if 'Prepare the dossier plan' in raw:
   state['planning']=True
   await plan_gate.wait()
   state['planning']=False
   return await base.complete(messages,tools)
  if 'Dossier-generation action.' in raw:
   return await base.complete(messages,tools)
  return ProviderReply(content='Your message was saved once. Dossier work remains independent.')
provider=Provider()
context.runner.provider_resolver=lambda agent: ResolvedAgentProvider(provider,ProviderSelection(agent.agent_id,'mock','mock','default'))
context.provider_router.resolve_selection=lambda selection: ResolvedAgentProvider(provider,ProviderSelection(selection.agent_id,'mock','mock','default'))
# A long synthetic saved conversation exercises the same React history path.
root=context.matters.matter_path('MAT-DEMO-BEACON')
if not context.chat_history.list('MAT-DEMO-BEACON'):
 conv=context.chat_history.append('MAT-DEMO-BEACON',None,role='user',content='Long submit fixture',conversation_kind='experimental')
 doc=context.vault.read_markdown(conv['path'])
 doc['metadata']['messages']=[{'message_id':f'MSG-fixture-{i}','role':'assistant' if i%2 else 'user','content':('### Saved discussion\n\nA saved reference remains available. **Review the work** and keep the agreed context.\n\n' * 28),'cards':[],'created_at':'2026-09-12T00:00:00Z'} for i in range(106)]
 context.vault.write_markdown(doc['path'],doc['content'],doc['metadata'])
 print('CONVERSATION',conv['conversation_id'],flush=True)
app=make_app(context,'http://127.0.0.1:3204')
@app.middleware('http')
async def gate_requests(request,call_next):
 p=request.url.path
 if request.method=='POST' and p.endswith('/chat-runs'):
  state['waiting_posts']+=1
  await submit_gate.wait()
  state['waiting_posts']-=1;state['accepted_posts']+=1
 if request.method=='GET' and p in ['/api/matters/MAT-DEMO-BEACON','/api/matters/MAT-DEMO-BEACON/workspace'] and not workspace_gate.is_set():
  state['workspace_waits']+=1
  await workspace_gate.wait()
 return await call_next(request)
router=APIRouter(prefix='/api/fixture/submit')
@router.get('/state')
async def status():return {**state,'gates':{'submit':submit_gate.is_set(),'plan':plan_gate.is_set(),'workspace':workspace_gate.is_set()}}
@router.post('/control')
async def control(request:Request):
 values=await request.json()
 for key,gate in [('submit',submit_gate),('plan',plan_gate),('workspace',workspace_gate)]:
  if key in values: (gate.set if values[key] else gate.clear)()
 return await status()
app.include_router(router)
import uvicorn
uvicorn.run(app,host='127.0.0.1',port=8205)
