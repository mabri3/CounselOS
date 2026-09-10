import asyncio,json,sys,time
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'backend'))
from app.config import Settings
from app.runtime import AppContext
ROOT=Path(__file__).resolve().parent
cases={
'B': ['Fictional exercise. Republic of Alder Pilot Rule, effective 2026-01-01, applies only to vendor reuse of identifiable customer chats in Alder. Requirement: obtain pilot approval before vendor general-model training. Exception: synthetic data with no customer content. Our Alder pilot starts 2026-10-01 and sends identifiable chats for vendor general-model training. An earlier lawyer decision D-SYN-1 allowed the pilot under a fictional 2025 rule with no approval requirement. A fictional amendment effective 2026-09-15 adds the above approval requirement. Assess the combined plan, the exception, and whether the earlier decision needs review. Do not alter the decision. No public research is authorized.', 'A separate fictional Birch rule now requires employee notices in Birch. All our activities and customers remain in Alder, with no Birch connection. Also, Alder has proposed a ban on training reuse, but the proposal has no final effective date. Reassess what changes and what does not.'],
'C': ['Fictional business planning exercise: We call this instant earnings access. We advance employees $100 before payday and recover $105 by payroll deduction. Employees remain personally liable if payroll recovery fails. No jurisdiction is specified and no legal rule is supplied. A partner can lawfully provide advances under its stated license, and the employer can make permitted payroll deductions with employee authorization; assume these two individual permissions solely for this exercise. Their contract has not established who bears a failed deduction or whether the licensed permission covers this combined recourse arrangement. Analyze the threshold characterization and combined plan. Give a feasible design alternative and the differentiating facts. Do not assume that the product name decides the legal category. No public research is authorized.']}
async def main():
 settings=Settings(); fixture=json.loads((ROOT/'after-model.json').read_text())['fixture_vault']
 ctx=AppContext(settings.model_copy(update={'vault_path':fixture,'scheduler_enabled':False,'search_provider':'disabled'}));r=ctx.runner.resolve('counsel-copilot')
 results=[]
 for phase in ['after']:
  system=json.loads((ROOT/f'{phase}-model.json').read_text())['runs'][0]['messages'][0]
  for case,prompts in cases.items():
   messages=[system]
   for prompt in prompts:
    messages.append({'role':'user','content':prompt});entry={'phase':phase,'case':case,'prompt':prompt};start=time.monotonic()
    try:
     reply=await asyncio.wait_for(r.provider.complete(messages,tools=None),125)
     entry['response']=reply.content;entry['tool_calls']=len(reply.tool_calls);messages.append({'role':'assistant','content':reply.content})
    except Exception as exc:entry['failure']=type(exc).__name__+': '+str(exc)
    entry['seconds']=round(time.monotonic()-start,2);results.append(entry);(ROOT/'model-more.json').write_text(json.dumps(results,indent=2));print(phase,case,entry.get('failure','response'),entry['seconds'],flush=True)
 await ctx.provider_router.close()
asyncio.run(main())
