from isolation import *
from app import config
config.get_settings = isolated_settings
from app.runtime import AppContext
from acceptance_provider import AcceptanceProvider
_original_init = AppContext.__init__
def fixture_init(self, *args, **kwargs):
 _original_init(self, *args, **kwargs)
 self.runner.provider = AcceptanceProvider()
AppContext.__init__ = fixture_init
from app import main
from app.active_context import ActiveContextManager
main.ActiveContextManager = lambda settings: ActiveContextManager(isolated_settings(), pointer_path=Path(ENV['temporary_root'])/'active-vault.json')
from datetime import datetime, timezone
import json
class AcceptanceRequestLog:
 def __init__(self, app): self.app = app
 async def __call__(self, scope, receive, send):
  async def logged_send(message):
   if scope['type'] == 'http' and message['type'] == 'http.response.start':
    with (Path(__file__).parent/'api-requests.jsonl').open('a') as log:
     log.write(json.dumps({'time':datetime.now(timezone.utc).isoformat(),'method':scope['method'],'path':scope['path'],'query':scope.get('query_string',b'').decode(),'status':message['status']})+'\n')
   await send(message)
  flag = Path(__file__).parent/'fail-optional.json'
  failures = json.loads(flag.read_text()) if flag.exists() else []
  if scope['type'] == 'http' and scope['method'] == 'GET' and scope['path'] in failures:
   await logged_send({'type':'http.response.start','status':503,'headers':[(b'content-type',b'application/json'),(b'access-control-allow-origin',b'http://localhost:3123')]})
   await logged_send({'type':'http.response.body','body':b'{"detail":"Intentional isolated acceptance support failure"}'})
   return
  await self.app(scope, receive, logged_send)
if __name__ == '__main__':
 import uvicorn
 uvicorn.run(AcceptanceRequestLog(main.app),host='127.0.0.1',port=ENV['backend_port'])
