import asyncio
from pathlib import Path
from app.providers.codex_cli import CodexCLIProvider
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[1]
async def main():
 guidance='\n\n'.join((ROOT/f'backend/app/experimental_skills/{name}.md').read_text() for name in ['dialogue','answer'])
 prompt='''This is a fictional test matter. A software company wants to reduce customer-support response times within six weeks without increasing incorrect refunds. Option A: use its existing support team with an internal knowledge-search assistant; staff approve every response. Option B: use an outside vendor whose AI sends responses directly, using customer tickets containing personal information. The vendor contract does not permit using company data for provider training. Retention terms and subcontractors have not been reviewed. Neither option has measured accuracy or time savings. Both rely on a refund policy that contains unresolved contradictions. Compare the options against the business objective. Explain what becomes easier or harder and why, which problems remain, and what evidence would change the choice. Do not invent applicable laws or verified sources.'''
 provider=CodexCLIProvider('gpt-5.6-sol',reasoning_effort='medium',timeout_seconds=180)
 try:
  reply=await provider.complete([{'role':'system','content':guidance},{'role':'user','content':prompt}],tools=None)
  (OUT/'general-comparison.md').write_text(reply.content)
  print(reply.content)
 finally: provider.close()
asyncio.run(main())
