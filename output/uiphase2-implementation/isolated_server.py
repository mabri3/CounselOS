"""Test-only server; every active pointer stays under the explicit test root."""
from pathlib import Path
import sys, json
from datetime import datetime, timezone
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / 'backend'))
from app import config
TEST_ROOT = ROOT / 'test-root'
VAULT = TEST_ROOT / 'vault'
assert VAULT.resolve().is_relative_to(TEST_ROOT.resolve())
def isolated_settings():
    return config.Settings(_env_file=None, vault_path=str(VAULT), scheduler_enabled=False,
        llm_provider='mock', llm_api_key=None, polaris_api_key=None, search_provider='disabled',
        frontend_origin='http://localhost:3134')
config.get_settings = isolated_settings
from app.runtime import AppContext
from app.models.awareness import ProviderScanResult
class FixtureWatchProvider:
    configured = True
    def __init__(self, provider_id):
        self.provider_id = provider_id
        self.label = "Synthetic " + provider_id
    async def scan(self, query, checkpoint):
        if self.provider_id == "polaris":
            raise RuntimeError("Simulated Polaris failure in isolated acceptance")
        return ProviderScanResult(provider_id="native",status="success",bounded_excerpt="Synthetic retained process note: operations reviews requests before release.",warnings=["Test fixture; no public source retrieval performed."])
_original_context_init = AppContext.__init__
def fixture_context_init(self, *args, **kwargs):
    _original_context_init(self, *args, **kwargs)
    self.intelligence._providers = {name: FixtureWatchProvider(name) for name in ("native", "polaris")}
AppContext.__init__ = fixture_context_init
from app import main
from app.active_context import ActiveContextManager
main.ActiveContextManager = lambda settings: ActiveContextManager(isolated_settings(), pointer_path=TEST_ROOT/'active-vault.json')
class RequestLog:
    def __init__(self, app): self.app = app
    async def __call__(self, scope, receive, send):
        async def logged(message):
            if scope['type']=='http' and message['type']=='http.response.start':
                with (ROOT/'api-requests.jsonl').open('a') as f:
                    f.write(json.dumps({'time':datetime.now(timezone.utc).isoformat(),'method':scope['method'],'path':scope['path'],'status':message['status']})+'\n')
            await send(message)
        fail = ROOT / 'fail-next-intake'
        if scope['type']=='http' and scope['method']=='POST' and scope['path']=='/api/matters' and fail.exists():
            fail.unlink()
            await logged({'type':'http.response.start','status':503,'headers':[(b'content-type',b'application/json'),(b'access-control-allow-origin',b'http://localhost:3134')]})
            await logged({'type':'http.response.body','body':b'{"detail":"Intentional isolated intake save failure"}'})
            return
        await self.app(scope, receive, logged)
if __name__=='__main__':
    import uvicorn
    uvicorn.run(RequestLog(main.app), host='127.0.0.1', port=8134)
