import json
from app.agents.context_selection import pack, recent_messages
from app.models.api import ChatRequest
from app.routers.chat import freeze_run_context
M='MAT-DEMO-RELAY'


def test_whole_record_pack_prioritizes_late_correction():
    records=[{'fact_id':f'F{i}','text':'Irrelevant '+('x'*1500)} for i in range(40)]
    records.append({'fact_id':'FACT-corrected','text':'Bank agreement remains pending.','supersedes':'FACT-old'})
    packed,omitted=pack(json.dumps(records),18000,'What is the bank agreement status?')
    assert json.loads(packed)[0]['fact_id']=='FACT-corrected'
    assert omitted and len(packed)<=18000
    packed,_=pack(json.dumps({'huge':'x'*30000}),100)
    assert packed==''


def test_actual_context_uses_record_packer_for_late_fact(app_context):
    app_context.matter_records.apply_update(M,facts=[{'text':f'Filler {i} '+('x'*1500)} for i in range(25)]+[{'fact_id':'FACT-late','text':'Bank agreement remains pending.'}])
    frozen=freeze_run_context(ChatRequest(matter_id=M,agent_id='counsel-copilot',message='Bank agreement status?'),app_context,'RUN-context').frozen_context
    assert 'Bank agreement remains pending.' in frozen['context']
    assert frozen['active_path']['path_id']
    assert 'working_path' in frozen['context']
    facts=next(e for e in frozen['manifest']['entries'] if e['reference_id']=='current_facts')
    assert facts['omitted_record_ids']


def test_recent_history_and_exact_archive_after_twelve_turns(app_context):
    conv=None
    for i in range(20):
        saved=app_context.chat_history.append(M,conv,role='user',content=f'Turn {i}. '+('Exact referent orchid.' if i==2 else 'Other topic.'))
        conv=saved['conversation_id']
    result=app_context.chat_history.archive_read(M,conv,query='orchid',max_chars=100)
    assert 'Exact referent' in result['messages'][0]['text']
    assert result['messages'][0]['message_id']==saved['messages'][2]['message_id']
    assert len(recent_messages(saved['messages']))==12
    assert sum(len(x['content']) for x in recent_messages([{'content':'x'*3000}]*20))<=24000

import pytest
from app.agents.dispatch_budget import BoundedDispatch
from app.agents.runner import RunnerExecutionState
from app.providers.base import ProviderReply

@pytest.mark.asyncio
async def test_dispatch_measures_utf8_and_unknown_usage_and_overflow():
    calls=[]
    class Provider:
        async def complete(self,messages,tools=None):
            calls.append(messages);return ProviderReply(content='Answer')
    state=RunnerExecutionState();dispatch=BoundedDispatch(Provider(),state,1000)
    await dispatch.complete([{'role':'user','content':'α'*100}],[])
    assert state.frozen_context['dispatch_metrics'][0]['provider_usage'] is None
    assert state.frozen_context['dispatch_metrics'][0]['dispatched_bytes']>200
    result=await dispatch.complete([{'role':'user','content':'x'*2000}],[])
    assert len(calls)==1 and 'No oversized' in result.content
    assert state.frozen_context['dispatch_metrics'][-1]['dispatched_bytes'] is None


@pytest.mark.asyncio
async def test_overflow_preserves_current_instruction_path_and_tool_pairs():
    calls=[]
    class Provider:
        async def complete(self,messages,tools=None):
            calls.append(messages);return ProviderReply(content='Answer')
    state=RunnerExecutionState()
    messages=[{'role':'system','content':'Trusted rules'},
              {'role':'user','content':'# Workspace context\nCurrent path B. Actual bank agreement pending.'},
              {'role':'user','content':'Old discussion '*200},
              {'role':'user','content':'Correct the actual settlement date.'},
              {'role':'assistant','content':'','tool_calls':[{'id':'call1','type':'function','function':{'name':'inspect','arguments':'{}'}}]},
              {'role':'tool','tool_call_id':'call1','content':'Saved path B'}]
    await BoundedDispatch(Provider(),state,1100).complete(messages,[])
    assert len(calls)==1
    assert calls[0][1]==messages[1] and calls[0][3:]==messages[3:]
    assert state.frozen_context['dispatch_metrics'][0]['omitted_context_indices']==[2]


def test_oversized_path_keeps_mandatory_identity(app_context):
    a=app_context.solution_paths.ensure_baseline(M)
    app_context.workspace_scenarios.save(M,{**a,'proposed_fact_changes':[{'change_id':'large','text':'Hypothesis '+('x'*15000)}]},expected_revision=a['revision'])
    frozen=freeze_run_context(ChatRequest(matter_id=M,message='Continue.'),app_context,'RUN-large-path').frozen_context
    assert a['scenario_id'] in frozen['path_context'] and 'large_assumptions_omitted' in frozen['path_context']


def test_context_retains_saved_comparison_order_beyond_recent_history(app_context):
    app=app_context;a=app.solution_paths.ensure_baseline(M)
    b=app.solution_paths.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='comparison-b')
    conv=app.chat_history.append(M,None,role='assistant',content='Earlier comparison.')
    doc=app.vault.read_markdown(conv['path']);order=[b['scenario_id'],a['scenario_id']]
    doc['metadata']['messages'][-1]['comparison_path_ids']=order
    app.vault.write_markdown(doc['path'],doc['content'],doc['metadata'])
    for i in range(15):app.chat_history.append(M,conv['conversation_id'],role='user',content=f'Other discussion {i}.')
    frozen=freeze_run_context(ChatRequest(matter_id=M,conversation_id=conv['conversation_id'],message='Use the second option.'),app,'RUN-reference').frozen_context
    assert json.dumps(order) in frozen['path_context']
    assert conv['messages'][0]['message_id'] in frozen['path_context']
