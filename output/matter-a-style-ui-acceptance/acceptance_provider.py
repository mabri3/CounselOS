"""Deterministic provider for this isolated UI acceptance run only."""
from app.providers.mock import MockProvider
from app.providers.base import ProviderReply,ProviderToolCall
class AcceptanceProvider(MockProvider):
 async def complete(self,messages,tools=None):
  user=next((str(m.get('content','')) for m in reversed(messages) if m.get('role')=='user'),'')
  names=self._available_tool_names(tools)
  if user.startswith('Create an editable preview using the '):
   last=messages[-1]
   if last.get('role')=='tool' and last.get('name')=='save_work_product':
    return ProviderReply(content='Acceptance fixture output: the editable template preview is saved for review. Keeping it is a separate action.')
   if 'select_conversation_scope' in names:
    return ProviderReply(tool_calls=[ProviderToolCall(id='fixture-scope',name='select_conversation_scope',arguments={'scope':'actual','instruction_quote':user})])
   if 'save_work_product' in names:
    return ProviderReply(tool_calls=[ProviderToolCall(id='fixture-preview',name='save_work_product',arguments={'kind':'draft','operation':'create','title':'Acceptance template preview','content':'# Acceptance template preview\n\nDeterministic fixture output. Confirm the audience and identifier purpose before choosing launch controls.\n\n## Next steps\n\nAsk Product to confirm the audience. This preview is not a recorded decision.'})])
  return await super().complete(messages,tools)
