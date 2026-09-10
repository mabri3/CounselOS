"""Supplemental real chat path on a copied synthetic vault; public search disabled."""
import asyncio,json,shutil,sys,tempfile,time
from pathlib import Path
root=Path(__file__).resolve().parents[2];sys.path.insert(0,str(root/'backend'))
from fastapi import FastAPI
import httpx
from app.config import Settings
from app.runtime import AppContext
from app.models.api import MatterCreate
from app.routers import chat,workspace
async def main():
 vault=Path(tempfile.mkdtemp(prefix='problem-live-http-'))/'vault';shutil.copytree(root/'backend/tests/fixtures/vault',vault)
 ctx=AppContext(Settings().model_copy(update={'vault_path':str(vault),'scheduler_enabled':False,'search_provider':'disabled'}))
 m=ctx.matters.create(MatterCreate(title='Synthetic live support pilot',request_text='Can we use customer chats to improve our support product? We want a pilot next month.'));mid=m['matter_id']
 ctx.matter_records.apply_update(mid,facts=[{'text':x} for x in ['Chats are collected and retained.','Internal evaluation and vendor processing are proposed.','Vendor reuse is unresolved.']],actor='Synthetic lawyer')
 app=FastAPI();app.state.context=ctx;app.include_router(chat.router,prefix='/api');app.include_router(workspace.router,prefix='/api')
 results={'vault':str(vault),'matter_id':mid,'runs':[]};conversation=None
 async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url='http://test') as client:
  for message in ['Can we use customer chats to improve our support product? We want a pilot next month. Use only the supplied facts. No external research is authorized.','The vendor retains the chats and uses them to train its general model. Our earlier description of internal-only use was wrong. Reassess using only the supplied facts; no external research is authorized.']:
   start=time.monotonic()
   try:
    r=await asyncio.wait_for(client.post('/api/chat',json={'matter_id':mid,'message':message,'conversation_id':conversation}),180)
    data=r.json();conversation=data.get('conversation_id',conversation)
    item={'message':message,'http_status':r.status_code,'response':data,'breakdown':ctx.problem_analysis.resolve(mid)}
   except Exception as e:item={'message':message,'failure':type(e).__name__+': '+str(e)}
   item['seconds']=round(time.monotonic()-start,2);results['runs'].append(item);(root/'output/problem-decomposition/live-http.json').write_text(json.dumps(results,indent=2,default=str));print(item.get('http_status',item.get('failure')),item['seconds'],item.get('breakdown',{}).get('state'),flush=True)
 await ctx.provider_router.close()
asyncio.run(main())
