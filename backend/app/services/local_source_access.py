"""Saved evidence access for ordinary chat; no external research authorization."""
from app.models.source_library import SourceSearchRequest
from app.models.matter_memory import StrictModel
from pydantic import Field
from app.services.workspace import digest


class LocalRead(StrictModel):
    source_id: str
    source_version: str
    unit_id: str
    start: int = Field(default=0,ge=0)
    max_chars: int = Field(default=6000,ge=1,le=6000)


class LocalSourceAccess:
    def __init__(self,context):
        if not context.matter_id: raise ValueError('Select a matter.')
        self.context=context
        self.library=context.app.source_library
        self.state=context.frozen_context.setdefault('local_source_access',{'pins':{},'receipts':{},'admitted_chars':0})

    def allowed(self):
        excluded=self.context.frozen_context.get('excluded_paths',[])
        ids=self.context.frozen_context.get('excluded_reference_ids',[])
        latest={}
        for source in self.library.versions(self.context.matter_id):
            if source['source_id'] in ids or any(source['original_path']==p or source['original_path'].startswith(p+'/') for p in excluded): continue
            latest[source['source_id']]=source['source_version']
        return {(sid,self.state['pins'].get(sid,version)) for sid,version in latest.items()}

    def execute(self,action,values):
        key=digest({'action':action,'values':values,'excluded':self.context.frozen_context.get('excluded_paths',[])})
        if key in self.state['receipts']: return self.state['receipts'][key]
        if action=='search_local_sources':
            v=SourceSearchRequest.model_validate(values)
            result=self.library.search(self.context.matter_id,**v.model_dump(exclude_none=True),allowed_versions=self.allowed())
            for hit in result.get('hits',[]):self.state['pins'][hit['source_id']]=hit['source_version']
            chars=sum(len(h['snippet']) for h in result.get('hits',[]))
        else:
            v=LocalRead.model_validate(values)
            if (v.source_id,v.source_version) not in self.allowed() or self.state['pins'].get(v.source_id)!=v.source_version:
                raise ValueError('Search this eligible saved source first to pin its version.')
            result=self.library.read(self.context.matter_id,**v.model_dump())
            chars=len(result.get('text',''))
        if self.state['admitted_chars']+chars>48000:
            raise ValueError('Saved evidence budget reached. Answer from passages already read.')
        self.state['admitted_chars']+=chars
        result['remaining_evidence_chars']=48000-self.state['admitted_chars']
        self.state['receipts'][key]=result
        return result
