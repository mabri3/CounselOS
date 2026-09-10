"""Configured-model comparison on isolated, synthetic supplied context."""
import asyncio, json, shutil, sys, tempfile, time
from dataclasses import asdict
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'backend'))
from app.config import Settings
from app.runtime import AppContext

async def main():
    root=Path(__file__).resolve().parents[2]
    phase=sys.argv[1]
    vault=Path(tempfile.mkdtemp(prefix='problem-analysis-eval-'))/'vault'
    shutil.copytree(root/'backend/tests/fixtures/vault',vault)
    ctx=AppContext(Settings().model_copy(update={'vault_path':str(vault),'scheduler_enabled':False,'search_provider':'disabled'}))
    resolved=ctx.runner.resolve('counsel-copilot')
    agent=ctx.agents.get('counsel-copilot')
    context='Synthetic evaluation only. Objective: improve support quality. Customer chats are collected and retained. Proposed activities include internal evaluation and vendor processing. Whether the vendor reuses chats is unresolved. No jurisdiction or legal authority is supplied. No external collection is authorized.'
    messages=[{'role':'system','content':ctx.agent_context.build_system(agent)},{'role':'user','content':context+'\nCan we use customer chats to improve our support product? We want a pilot next month.'}]
    result={'phase':phase,'fixture_vault':str(vault),'selection':asdict(resolved.selection),'supplied_context':context,'runs':[]}
    out=root/'output/problem-decomposition'/f'{phase}-model.json'
    for prompt in [None,'The vendor retains the chats and uses them to train its general model. Our earlier description of internal-only use was wrong.']:
        if prompt: messages.append({'role':'user','content':prompt})
        started=time.monotonic()
        entry={'messages':list(messages)}
        try:
            reply=await asyncio.wait_for(resolved.provider.complete(messages,tools=None),125)
            entry.update(response=reply.content,tool_calls=[asdict(t) for t in reply.tool_calls])
            messages.append({'role':'assistant','content':reply.content})
        except Exception as exc:
            entry['failure']=type(exc).__name__+': '+str(exc)
        entry['seconds']=round(time.monotonic()-started,2)
        result['runs'].append(entry); out.write_text(json.dumps(result,indent=2))
        print(json.dumps({k:v for k,v in entry.items() if k!='messages'}),flush=True)
    await ctx.provider_router.close()
asyncio.run(main())
