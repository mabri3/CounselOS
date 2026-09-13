import json
import pytest
from app.services.workspace import WorkspaceConflict
from app.models.matter_memory import WorkingPayload
M='MAT-DEMO-RELAY'


def setup(app):
    path=app.solution_paths.ensure_baseline(M)
    conversation=app.chat_history.append(M,None,role='user',content='Investigate the bank design.')
    return path['scenario_id'],dict(expected_sequence=0,run_id='RUN-1',conversation_id=conversation['conversation_id'],message_id=conversation['messages'][-1]['message_id'])


def payload():
    return {'current_task':'Check bank design.','next_action':'Read the exception.'}


@pytest.mark.parametrize('bad',[{}, {'current_task':'','next_action':'x'}, {'current_task':'x','next_action':'y','unknown':True}, {'current_task':'x'*3990,'next_action':'y'*100}, {'current_task':'x','next_action':'y','findings':[{'text':'Claim','status':'verified'}]}])
def test_invalid_note_never_clears_last_valid(app_context,bad):
    path,kw=setup(app_context); service=app_context.matter_memory
    first=service.save(M,path,payload(),**kw)
    before=app_context.vault.read_text(service._path(M,path))
    with pytest.raises(ValueError): service.save(M,path,bad,**{**kw,'expected_sequence':1})
    assert app_context.vault.read_text(service._path(M,path))==before
    assert service.read(M,path)['revision']==first['revision']


def test_history_conflicts_exclusions_and_stale_fact(app_context):
    path,kw=setup(app_context); s=app_context.matter_memory
    app_context.matter_records.apply_update(M,facts=[{'fact_id':'FACT-custody','text':'Operator holds funds.'}])
    fact=app_context.matter_records.get(M)['facts'][0]
    note={**payload(),'findings':[{'text':'Provisional finding.','status':'qualified','references':[{'kind':'fact','record_id':fact['fact_id']}]}]}
    first=s.save(M,path,note,**kw)
    with pytest.raises(WorkspaceConflict): s.save(M,path,payload(),**kw)
    app_context.matter_records.apply_update(M,facts=[{'text':'Bank holds funds.','supersedes':fact['fact_id']}])
    assert s.context_view(M,path)['payload']['findings'][0]['status']=='unresolved'
    second=s.save(M,path,payload(),**{**kw,'expected_sequence':1})
    assert second['sequence']==2
    assert len(list(app_context.vault.resolve(s._path(M,path)).parent.glob('history/*.md')))==1
    assert s.context_view(M,path,excluded_paths=['private-source'])['state']=='withheld'
    assert len(json.dumps(s.context_view(M,path),ensure_ascii=False))<=6000
    with pytest.raises(ValueError): s.save(M,path,payload(),**{**kw,'expected_sequence':2,'message_id':'NOT-IN-CONVERSATION'})


def test_disk_interruption_preserves_valid_note(app_context,monkeypatch):
    path,kw=setup(app_context); s=app_context.matter_memory
    first=s.save(M,path,payload(),**kw)
    original=s.vault.write_markdown
    def fail(name,*args,**kwargs):
        if name.endswith('/working.md'): raise OSError('disk full')
        return original(name,*args,**kwargs)
    monkeypatch.setattr(s.vault,'write_markdown',fail)
    with pytest.raises(OSError): s.save(M,path,{**payload(),'next_action':'Continue.'},**{**kw,'expected_sequence':1})
    assert s.read(M,path)['revision']==first['revision']


def test_manual_edit_requires_revision_and_malformed_edit_falls_back(app_context):
    path,kw=setup(app_context); s=app_context.matter_memory
    s.save(M,path,payload(),**kw)
    s.save(M,path,{**payload(),'next_action':'Second action.'},**{**kw,'expected_sequence':1})
    filename=s._path(M,path); doc=s.vault.read_markdown(filename)
    s.vault.write_markdown(filename,s._body({**WorkingPayload.model_validate(payload()).model_dump(),'next_action':'Lawyer edited this.'}),doc['metadata'])
    edited=s.read(M,path)
    assert edited['user_edited']
    with pytest.raises(WorkspaceConflict): s.save(M,path,payload(),**{**kw,'expected_sequence':2})
    s.vault.write_markdown(filename,'broken body',doc['metadata'])
    assert s.read(M,path)['state']=='previous_valid'


def test_unknown_source_and_other_matter_reference_rejected(app_context):
    path,kw=setup(app_context)
    bad={**payload(),'findings':[{'text':'Wrong source','status':'supported','references':[{'kind':'source','record_id':'SRC-missing','source_version':'abc'}]}]}
    with pytest.raises((ValueError,KeyError,FileNotFoundError)):
        app_context.matter_memory.save(M,path,bad,**kw)


def test_optional_note_parser_keeps_useful_prose():
    from app.services.memory_publication import extract_working_memory
    prose,note,warning=extract_working_memory('Useful conditional answer.\n\n```working-memory\n{broken}\n```')
    assert prose=='Useful conditional answer.' and note is None and warning
    assert extract_working_memory('Answer without optional structure.')==('Answer without optional structure.',None,None)


@pytest.mark.asyncio
async def test_numeric_source_unit_resolves_before_note_save(app_context):
    import io
    from fastapi import UploadFile
    from app.tools.matter_paths import _memory_source_units
    path,kw=setup(app_context)
    uploaded=await app_context.ingestion.upload_to_matter(M,UploadFile(filename='test.txt',file=io.BytesIO(b'Fictional readiness is December 3.')))
    ref={'kind':'source','record_id':uploaded['library_source_id'],
         'source_version':uploaded['library_source_version'],'unit_id':'1'}
    values={'payload':{**payload(),'findings':[{'text':'Test readiness is December 3.','status':'qualified','references':[ref]}]}}
    resolved=_memory_source_units(app_context,M,values)
    saved=app_context.matter_memory.save(M,path,resolved['payload'],**kw)
    assert saved['payload']['findings'][0]['references'][0]['unit_id']=='s000001'
    assert ref['unit_id']=='1'
    ref['unit_id']='999'
    with pytest.raises(ValueError,match='absent'):
        _memory_source_units(app_context,M,values)
