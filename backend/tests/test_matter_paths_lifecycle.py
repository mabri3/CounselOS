"""Scripted tool plumbing only; these cases do not prove language understanding."""
import pytest
from app.tools.registry import ToolExecutionContext
from app.models.workspace import ConversationTarget
M='MAT-DEMO-RELAY'


def ctx(app,path):
    conversation=app.chat_history.append(M,None,role='user',content='Explore bank custody. Make that our direction if the bank agrees.')
    return ToolExecutionContext(app=app,matter_id=M,run_id='RUN-path',source_action_key='operation-path',
        trusted_message_id=conversation['messages'][-1]['message_id'],trusted_user_message=conversation['messages'][-1]['content'],
        target=ConversationTarget(matter_id=M,scenario_id=path['scenario_id']),scope_state={'scope':'scenario'},
        frozen_context={'active_path':{'path_id':path['scenario_id'],'revision':path['revision']},'conversation_id':conversation['conversation_id']})


@pytest.mark.asyncio
async def test_real_registry_allows_narrow_promotion_and_memory_not_adoption(app_context):
    app=app_context;s=app.solution_paths
    a=s.ensure_baseline(M)
    b=s.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='b',unresolved_conditions=['Bank agreement pending'])
    context=ctx(app,b);agent=app.agents.get('counsel-copilot')
    before=app.vault.read_text(app.matter_records._path(M))
    result=await app.tools.execute(agent,context,'workspace_action',{'action':'promote_path','instruction_quote':'Make that our direction if the bank agrees.','values':{'path_id':b['scenario_id'],'expected_path_revision':b['revision'],'expected_mainline_revision':s.state(M)['revision']}})
    assert result.status=='success',result.summary
    assert result.data['state']=='committed'
    assert s.state(M)['mainline_path_id']==b['scenario_id']
    assert app.vault.read_text(app.matter_records._path(M))==before
    rejected=await app.tools.execute(agent,context,'workspace_action',{'action':'adopt_scenario','values':{'scenario_id':b['scenario_id'],'change_ids':['custody']}})
    assert rejected.status=='error'
    context.source_action_key='note-operation'
    note=await app.tools.execute(agent,context,'workspace_action',{'action':'save_working_memory','instruction_quote':'Explore bank custody.','values':{'expected_sequence':0,'payload':{'current_task':'Check the bank condition.','next_action':'Read the agreement.'}}})
    assert note.status=='success',note.summary
    assert app.matter_memory.read(M,b['scenario_id'])['sequence']==1


@pytest.mark.asyncio
async def test_missing_provenance_and_forged_fields_fail(app_context):
    app=app_context;a=app.solution_paths.ensure_baseline(M);context=ctx(app,a)
    for values in ({'path_id':a['scenario_id'],'trusted':True},{'path_id':'../escape'}):
        result=await app.tools.execute(app.agents.get('counsel-copilot'),context,'workspace_action',{'action':'select_working_path','instruction_quote':'Explore bank custody.','values':values})
        assert result.status=='error'
    result=await app.tools.execute(app.agents.get('counsel-copilot'),context,'workspace_action',{'action':'select_working_path','instruction_quote':'Not in message','values':{'path_id':a['scenario_id']}})
    assert result.status=='error'


def test_conversation_focus_survives_new_messages(app_context):
    app=app_context;path=app.solution_paths.ensure_baseline(M);context=ctx(app,path)
    from app.tools.matter_paths import bind_path
    bind_path(context,path['scenario_id'])
    conversation_id=context.frozen_context['conversation_id']
    saved=app.chat_history.append(M,conversation_id,role='assistant',content='Answer.')
    assert app.vault.read_markdown(saved['path'])['metadata']['working_path_id']==path['scenario_id']

@pytest.mark.asyncio
async def test_excluded_source_cannot_return_through_selected_conditions(app_context):
    import json
    from app.models.api import ChatRequest
    from app.routers.chat import freeze_run_context
    app=app_context;s=app.solution_paths;a=s.ensure_baseline(M)
    b=s.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='excluded-b')
    secret='UNREAD-EXCLUDED-CONDITION'
    s.transition(M,path_id=b['scenario_id'],expected_path_revision=b['revision'],expected_mainline_revision=s.state(M)['revision'],source_action_key='exclude-promotion',run_id='fixture',message_id='fixture',instruction_quote='Select the direction.',conditions=[secret])
    context=ctx(app,b);context.frozen_context['excluded_paths']=['excluded.txt']
    result=await app.tools.execute(app.agents.get('counsel-copilot'),context,'workspace_action',{'action':'inspect_paths','values':{}})
    assert secret not in json.dumps(result.data)
    frozen=freeze_run_context(ChatRequest(matter_id=M,message='Continue.',context_selections=[{'reference_id':'excluded','path':'excluded.txt','role':'source','selected':False}]),app,'RUN-excluded').frozen_context
    assert secret not in frozen['context']


@pytest.mark.asyncio
async def test_scope_can_save_and_bind_variant_before_note(app_context):
    from app.tools.handlers import select_conversation_scope
    from app.tools.matter_paths import path_action
    app=app_context
    parent=app.solution_paths.ensure_baseline(M)
    context=ctx(app,parent)
    before=app.solution_paths.state(M)
    facts=app.vault.read_text(app.matter_records._path(M))
    result=await select_conversation_scope(context,{'scope':'scenario','path_intent':'new',
        'instruction_quote':'Explore bank custody.','new_path':{
            'parent_path_id':parent['scenario_id'],'parent_revision':parent['revision'],
            'title':'Delayed integration test','hypothesis_summary':'Test readiness after launch.',
            'proposed_fact_changes':[{'change_id':'readiness','text':'Hypothetically integration is ready after launch.'}],
            'unresolved_conditions':['Bridge is undefined.']}})
    new=result['data']['path']
    assert new['scenario_id'] != parent['scenario_id']
    assert context.scope_state['working_path_id']==new['scenario_id']
    context.source_action_key='save-variant-note'
    note=await path_action(context,{'action':'save_working_memory','instruction_quote':'Explore bank custody.',
        'values':{'expected_sequence':0,'payload':{'current_task':'Test delayed integration.','next_action':'Resolve bridge.'}}})
    assert note['data']['path_id']==new['scenario_id']
    assert app.solution_paths.state(M)==before
    assert app.vault.read_text(app.matter_records._path(M))==facts
