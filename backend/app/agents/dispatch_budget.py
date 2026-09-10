"""Complete dispatch byte accounting; bytes are not token or cost estimates."""
import json
from copy import deepcopy
from app.providers.base import ProviderReply

class BoundedDispatch:
    def __init__(self,provider,state,ceiling=256000):
        self.provider,self.state,self.ceiling=provider,state,ceiling
    async def complete(self,messages,tools=None):
        candidate=deepcopy(messages)
        def size():return len(json.dumps({'messages':candidate,'tools':tools},ensure_ascii=False,default=str).encode())
        original=size();omitted=[]
        current_user=max((i for i,m in enumerate(candidate) if m.get("role")=="user" and not str(m.get("content", "")).startswith(("# Workspace context", "Frozen supplied comparison evidence"))),default=-1)
        if original>self.ceiling:
            for index,item in enumerate(candidate[:-1]):
                if index != current_user and item.get('role')=='user' and not str(item.get('content','')).startswith(('# Workspace context', 'Frozen supplied comparison evidence')):
                    item['content']='Older conversation text omitted to fit dispatch. Read the conversation archive if needed.'
                    omitted.append(index)
                    if size()<=self.ceiling:break
        measured=size()
        metrics={'original_bytes':original,'dispatched_bytes':measured if measured<=self.ceiling else None,
                 'ceiling_bytes':self.ceiling,'omitted_context_indices':omitted,'provider_usage':None,'requested_output_tokens':None}
        self.state.frozen_context.setdefault('dispatch_metrics',[]).append(metrics)
        if measured>self.ceiling:
            metrics['state']='not_dispatched_mandatory_overflow'
            return ProviderReply(content=(self.state.useful_content or 'The request exceeds the model dispatch size limit. Shorten the current instruction or selected material.')+'\n\nNo oversized model request was sent.')
        reply=await self.provider.complete(candidate,tools)
        metrics.update(state='completed',provider_usage=getattr(reply,'usage',None))
        return reply
