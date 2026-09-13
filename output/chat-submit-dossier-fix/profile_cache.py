import sys,asyncio,cProfile,pstats,json,time
from pathlib import Path
sys.path.insert(0,str(Path('backend').resolve()))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import ChatRequest
from app.routers.chat import trusted_chat_actor
vault=Path('output/chat-submit-dossier-fix/profile-vault').resolve()
assert vault.is_relative_to(Path('output/chat-submit-dossier-fix').resolve())
from app.services.vault import VaultService
VaultService.MARKDOWN_CACHE_MAX_BYTES = 64 * 1024 * 1024
app=AppContext(Settings(_env_file=None,vault_path=str(vault),scheduler_enabled=False,llm_provider='mock',search_provider='disabled',llm_api_key=None,polaris_api_key=None))
async def main():
 payload=ChatRequest(message='Submission performance fixture; do not execute.',matter_id='MAT-20260909-d89ad8',conversation_id='CONV-20260909-5299cf',experimental_chat=True,source_action_key='experimental:submit-cache-fixture',model_selection={'provider':'mock','model':'mock','reasoning_effort':'default'})
 # Warm file caches as an already-open chat would.
 app.chat_history.get(payload.matter_id,payload.conversation_id)
 profile=cProfile.Profile(); start=time.perf_counter(); profile.enable()
 clean=trusted_chat_actor(payload,app)
 trusted_time=time.perf_counter()-start
 record=app.chat_runs.start(payload.matter_id,clean)
 elapsed=time.perf_counter()-start; profile.disable()
 app.chat_runs._tasks[record['run_id']].cancel()
 await asyncio.gather(*app.chat_runs._tasks.values(),return_exceptions=True)
 profile.dump_stats('output/chat-submit-dossier-fix/submit-cache.prof')
 with open('output/chat-submit-dossier-fix/submit-cache.txt','w') as stream: pstats.Stats(profile,stream=stream).strip_dirs().sort_stats('cumulative').print_stats(42)
 print(json.dumps({'trusted_actor_seconds':trusted_time,'total_submit_seconds':elapsed,'conversation_chars':len(json.dumps(app.chat_history.get(payload.matter_id,payload.conversation_id)))}))
 await app.provider_router.close()
asyncio.run(main())
