import sys,asyncio,cProfile,pstats,json,time
from pathlib import Path
sys.path.insert(0,str(Path('backend').resolve()))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import ChatRequest
from app.routers.chat import trusted_chat_actor
vault=Path('output/chat-submit-dossier-fix/profile-vault').resolve()
assert vault.is_relative_to(Path('output/chat-submit-dossier-fix').resolve())
app=AppContext(Settings(_env_file=None,vault_path=str(vault),scheduler_enabled=False,llm_provider='mock',search_provider='disabled',llm_api_key=None,polaris_api_key=None))
async def main():
 from app.services.vault import VaultService
 results=[]
 for megabytes in (32,64):
  VaultService.MARKDOWN_CACHE_MAX_BYTES=megabytes*1024*1024
  app.vault._markdown_cache.clear(); app.vault._markdown_cache_bytes=0
  payload=ChatRequest(message='Unprofiled submission fixture; do not execute.',matter_id='MAT-20260909-d89ad8',conversation_id='CONV-20260909-5299cf',experimental_chat=True,source_action_key=f'experimental:unprofiled-submit-{megabytes}',model_selection={'provider':'mock','model':'mock','reasoning_effort':'default'})
  app.chat_history.get(payload.matter_id,payload.conversation_id)
  start=time.perf_counter()
  clean=trusted_chat_actor(payload,app)
  trusted=time.perf_counter()-start
  record=app.chat_runs.start(payload.matter_id,clean)
  elapsed=time.perf_counter()-start
  app.chat_runs._tasks[record['run_id']].cancel()
  await asyncio.gather(*app.chat_runs._tasks.values(),return_exceptions=True)
  result={'cache_megabytes':megabytes,'trusted_actor_seconds':trusted,'submit_seconds':elapsed}
  results.append(result); print(json.dumps(result),flush=True)
 Path('output/chat-submit-dossier-fix/submit-timings.json').write_text(json.dumps(results,indent=2)+'\n')
 await app.provider_router.close()
asyncio.run(main())
