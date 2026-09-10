import sys,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'backend'));sys.path.insert(0,str(ROOT/'backend/tests'))
from app.config import Settings
from app.runtime import AppContext
from tests.manual.serve_research_investigation import make_app
from app.providers.base import ProviderReply
E=json.loads((Path(__file__).parent/'environment.json').read_text())
context=AppContext(Settings(_env_file=None,vault_path=E['vault'],scheduler_enabled=False,llm_provider='mock',search_provider='disabled'))
class FixtureProvider:
 async def complete(self,messages,tools=None):
  return ProviderReply(content='Read the [saved definition]('+E['matter_path']+'/documents/coppa-definitions.md).\n\nFixture analysis: Audience age changes the proposed controls. Keep the issue open for lawyer review. Under the hypothetical, assess the changed audience before launch. This is generated fixture analysis; no external research was performed.')
context.runner.provider=FixtureProvider()
app=make_app(context,'http://localhost:3136')
if __name__=='__main__':
 import uvicorn
 uvicorn.run(app,host='127.0.0.1',port=8136)
