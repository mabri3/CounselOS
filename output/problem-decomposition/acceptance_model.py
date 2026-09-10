import asyncio,json,sys,time,shutil,tempfile,ast
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'backend'))
from app.config import Settings
from app.runtime import AppContext
from app.services.problem_analysis import extract_problem_analysis
async def main():
 vault=Path(tempfile.mkdtemp(prefix='problem-acceptance-model-'))/'vault';shutil.copytree(ROOT/'backend/tests/fixtures/vault',vault)
 ctx=AppContext(Settings().model_copy(update={'vault_path':str(vault),'scheduler_enabled':False,'search_provider':'disabled'}));r=ctx.runner.resolve('counsel-copilot')
 tree=ast.parse((ROOT/'output/problem-decomposition/evaluate_more.py').read_text());cases=ast.literal_eval(next(n.value for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='cases' for t in n.targets)))
 cases={'A':[json.loads((ROOT/'output/problem-decomposition/after-model.json').read_text())['runs'][0]['messages'][-1]['content'],'The vendor retains the chats and uses them to train its general model. Our earlier description of internal-only use was wrong.'],**cases}
 results=[]
 for case,prompts in cases.items():
  messages=[{'role':'system','content':ctx.agent_context.build_system(ctx.agents.get('counsel-copilot'))}]
  for prompt in prompts:
   messages.append({'role':'user','content':prompt});entry={'case':case,'prompt':prompt};start=time.monotonic()
   try:
    reply=await asyncio.wait_for(r.provider.complete(messages,tools=None),125);entry.update(response=reply.content,tool_calls=len(reply.tool_calls));messages.append({'role':'assistant','content':reply.content});prose,payload,warnings=extract_problem_analysis(reply.content);entry.update(parsed=payload is not None,warnings=warnings)
   except Exception as exc:entry['failure']=type(exc).__name__+': '+str(exc)
   entry['seconds']=round(time.monotonic()-start,2);results.append(entry);(ROOT/'output/problem-decomposition/acceptance-model.json').write_text(json.dumps(results,indent=2));print(case,entry.get('failure',entry.get('parsed')),entry['seconds'],flush=True)
 await ctx.provider_router.close()
asyncio.run(main())
