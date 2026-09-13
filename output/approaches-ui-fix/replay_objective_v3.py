"""One read-only model replay; no tool execution or writes to the matter."""
import asyncio,copy,json
from pathlib import Path
import frontmatter
from app.providers.codex_cli import CodexCLIProvider
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[1]
BASE=ROOT/'Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8'
async def main():
 r=frontmatter.load(BASE/'conversations/runs/RUN-20260911-c6a792.md').metadata
 messages=[]
 for m in copy.deepcopy(r['checkpoint']['main_messages']):
  if m['role']=='system' and m['content'].startswith('# dialogue'):
   for name in ['dialogue','answer','draft']:
    old=next(s['content'] for s in r['frozen_context']['experimental_guidance']['skills'] if s['name']==name)
    m['content']=m['content'].replace(old,(ROOT/f'backend/app/experimental_skills/{name}.md').read_text())
  if m['role']=='system' and m['content'].startswith('# Shared matter-paths'):
   m['content']='# Shared matter-paths skill\n'+frontmatter.load(ROOT/'backend/app/blank_vault_template/00_System/skills/matter-paths.md').content
  messages.append(m)
  if m['role']=='tool' and 'ordered_path_ids' in m.get('content',''):
   packet=json.loads(m['content'])
   for p in packet['data']['paths']:
    d=frontmatter.load(BASE/f"scenarios/{p['path_id']}.md")
    meta=d.get('scenario',d.metadata)
    p.update(hypothesis_summary=meta.get('hypothesis_summary',''),analysis=d.content[:6000],analysis_truncated=len(d.content)>6000)
   m['content']=json.dumps(packet)
   break
 provider=CodexCLIProvider('gpt-5.6-sol',reasoning_effort='medium',timeout_seconds=180)
 try:
  reply=await provider.complete(messages,tools=None)
  (OUT/'objective-replay-v3.md').write_text(reply.content)
  (OUT/'objective-replay-v3.json').write_text(json.dumps({'model':'gpt-5.6-sol','effort':'medium','candidate_calls':1,'old_words':73,'new_words':len(reply.content.split()),'tool_calls':len(reply.tool_calls)},indent=2))
  print(reply.content)
 finally: provider.close()
asyncio.run(main())
