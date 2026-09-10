"""Optional final-note publication without another provider call."""
import json,re
from app.services.workspace import digest
from app.models.matter_memory import WorkingPayload


def extract_working_memory(text):
    pattern=re.compile(r'(?ms)^```working-memory[^\n]*\n(.*?)(?:\n```[ \t]*(?=\n|$)|\Z)')
    matches=list(pattern.finditer(text))
    if not matches:return text,None,None
    prose=pattern.sub('',text).strip()
    try:
        if len(matches)!=1:raise ValueError('Only one working-memory block is allowed.')
        payload=WorkingPayload.model_validate(json.loads(matches[0].group(1))).model_dump(mode='json')
        return prose,payload,None
    except (ValueError,TypeError):
        return prose,None,'The answer is retained. The working note was not saved because its format was invalid.'


def publish_optional_memory(app,request,state,response):
    prose,payload,warning=extract_working_memory(state.raw_final_output or response.reply)
    if payload is None and warning is None:return
    response.reply=extract_working_memory(response.reply)[0] or prose
    if warning:
        response.reply+='\n\n'+warning
        state.frozen_context['memory_update_warning']=warning
        return
    frozen=state.frozen_context
    path=(frozen.get('active_path') or {}).get('path_id')
    if not path:return
    key=digest({'run':request.workspace_run_id,'path':path,'payload':payload})
    if frozen.get('memory_publication_key')==key:return
    try:
        current=app.matter_memory.read(request.matter_id,path)
        # Submission captures sequence so concurrent writers cannot be overwritten.
        sequence=frozen.get('memory_sequence',current['sequence'])
        app.matter_memory.save(request.matter_id,path,payload,expected_sequence=sequence,
            expected_revision=frozen.get('memory_revision'),run_id=request.workspace_run_id,
            conversation_id=frozen.get('conversation_id') or request.conversation_id,message_id=request.trusted_message_id)
        frozen['memory_publication_key']=key
    except (ValueError,KeyError,OSError,TypeError):
        warning='The answer is retained. The working note was not saved; its earlier version remains available.'
        frozen['memory_update_warning']=warning
        frozen['pending_memory_payload']=payload
        response.reply+='\n\n'+warning
