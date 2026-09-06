"""Dedicated acceptance runtime; never selects or changes the user's active vault."""
import json, os, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
E=json.loads((Path(__file__).parent/'environment.json').read_text())
sys.path.insert(0,str(ROOT/'backend'))
os.environ.update(VAULT_PATH=E['vault'],SCHEDULER_ENABLED='false',SEARCH_PROVIDER='disabled',POLARIS_API_KEY='',FRONTEND_ORIGIN=f"http://localhost:{E['frontend_port']}")
from app import main
from app.active_context import ActiveContextManager
main.ActiveContextManager=lambda settings: ActiveContextManager(settings,pointer_path=Path(E['temporary_root'])/'active-vault.json')
# Test-only provider boundary. This route exists only in this isolated wrapper.
from app.providers.base import ProviderReply, ProviderToolCall
@main.app.post('/__test/provider')
async def provider_double(payload: dict):
 context=main.app.state.context
 assert str(context.vault.root)==str(Path(E['vault']).resolve())
 class ScriptedProvider:
  def __init__(self): self.calls=0
  async def complete(self,messages,tools=None):
   self.calls+=1
   if self.calls==1:
    return ProviderReply(tool_calls=[ProviderToolCall(id='acceptance-scope',name='select_conversation_scope',arguments={'scope':payload.get('scope','actual'),'instruction_quote':payload.get('instruction','Analyze this saved issue.')})])
   if self.calls==2 and payload.get('read_path'):
    return ProviderReply(tool_calls=[ProviderToolCall(id='acceptance-source',name='read_file',arguments={'path':payload['read_path']})])
   return ProviderReply(content=payload['reply'])
 context.runner.provider=ScriptedProvider()
 return {'provider_double':True,'vault':str(context.vault.root)}
if __name__=='__main__':
 import uvicorn
 uvicorn.run(main.app,host='127.0.0.1',port=E['backend_port'])
