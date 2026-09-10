"""Frozen, provider-free semantic evaluation preparation and evidence replay.

Dry runs never score understanding. Qualitative scoring requires reviewed output.
"""
from __future__ import annotations
import argparse,hashlib,json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CASES=ROOT/'tests/evals/matter_paths/cases.json'
RUBRIC={'intent_reference':25,'factual_decision_integrity':25,'path_preservation':20,'continuity':15,'research_application':10,'citation_locator':5}

def hash_file(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def validate_cases(cases):
    assert len(cases)>=16
    assert len({c['episode_id'] for c in cases})==len(cases)
    assert set(range(1,29)) <= {n for c in cases for n in c['acceptance_cases']}
    for case in cases:
        assert len(case['turns'])>=2
        for turn in case['turns']:
            assert turn['message_id'] and len(turn['paraphrases'])==2
            assert set(turn['expected']) >= {'mainline','working_path','facts','decisions','tasks','note','sources','publication'}
    assert sum(RUBRIC.values())==100

def score(rows):
    dimensions={k:{'available':0,'earned':0,'loss':0} for k in RUBRIC}
    for row in rows:
        assert row['dimension'] in RUBRIC
        assert 0<=row['earned_points']<=row['available_points']
        assert row['exact_loss']==row['available_points']-row['earned_points']
        for required in ('episode_id','message_id','criterion_id','expected','observed','evidence','assessment_method','failure_category'):
            assert required in row
        dimension=dimensions[row['dimension']]
        dimension['available']+=row['available_points'];dimension['earned']+=row['earned_points'];dimension['loss']+=row['exact_loss']
    return {'dimensions':dimensions,'available':sum(d['available'] for d in dimensions.values()),'earned':sum(d['earned'] for d in dimensions.values()),
            'substance_excluding_support_citations':{k:v for k,v in dimensions.items() if k not in {'research_application','citation_locator'}},
            'integrity_failures':[r for r in rows if r['dimension']=='factual_decision_integrity' and r['exact_loss']>0]}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--mode',choices=['dry-run','replay','live'],required=True)
    parser.add_argument('--output',type=Path,required=True);parser.add_argument('--input',type=Path)
    for name in ('provider','model','effort','episodes'):parser.add_argument('--'+name)
    for name in ('max-calls','max-estimated-input','max-requested-output'):parser.add_argument('--'+name,type=int,default=0)
    args=parser.parse_args()
    cases=json.loads(CASES.read_text());validate_cases(cases)
    if args.output.exists() and any(args.output.iterdir()):parser.error('Use a new immutable output directory.')
    args.output.mkdir(parents=True,exist_ok=True)
    manifest={'mode':args.mode,'case_hash':hash_file(CASES),'rubric':RUBRIC,'rubric_hash':hashlib.sha256(json.dumps(RUBRIC,sort_keys=True).encode()).hexdigest(),
              'candidate_hash':hashlib.sha256(''.join(str(p.relative_to(ROOT))+hash_file(p) for p in sorted((ROOT/'app').rglob('*.py'))).encode()).hexdigest(),'skill_hash':hash_file(ROOT/'app/blank_vault_template/00_System/skills/matter-paths.md'),'semantic_model_behavior':'unverified','paid_calls':0,'provider_usage':None}
    if args.mode=='live':
        if not all((args.provider,args.model,args.effort,args.episodes,args.max_calls>0,args.max_estimated_input>0,args.max_requested_output>0)):
            parser.error('Live requires explicit runtime selection, episodes and positive call/input/output budgets. Default budget is zero.')
        import asyncio
        manifest['limits']='Input is a serialized-text estimate. Requested output is an instruction allowance; the adapter has no hard output cap. Actual usage remains unavailable unless returned.'
        print(manifest['limits'],flush=True)
        (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2))
        (args.output/'cases.json').write_text(json.dumps(cases,indent=2))
        answers=asyncio.run(run_live(args,cases,manifest))
        (args.output/'answers.json').write_text(json.dumps(answers,indent=2,default=str))
        (args.output/'deductions.json').write_text('[]')
        (args.output/'scores.json').write_text(json.dumps(score([]),indent=2))
        (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2))
        return
    if args.mode=='dry-run':
        (args.output/'cases.json').write_text(json.dumps(cases,indent=2))
        rows=[]
        manifest['episodes']=len(cases);manifest['assessment']='Fixture validation only; no answers generated or quality points awarded.'
    else:
        if not args.input:parser.error('Replay requires --input.')
        previous=json.loads((args.input/'manifest.json').read_text())
        if previous['case_hash']!=manifest['case_hash'] or previous['rubric_hash']!=manifest['rubric_hash']:parser.error('Frozen fixture or rubric mismatch.')
        rows=json.loads((args.input/'deductions.json').read_text())
        manifest['assessment']='Arithmetic and recorded-evidence replay; no new model calls.'
    (args.output/'deductions.json').write_text(json.dumps(rows,indent=2))
    (args.output/'scores.json').write_text(json.dumps(score(rows),indent=2))
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2))
    print(json.dumps(manifest))
async def run_live(args,cases,manifest):
    import sys,shutil,tempfile,math
    sys.path.insert(0,str(ROOT))
    from app.config import Settings
    from app.runtime import AppContext
    from app.providers.factory import build_provider
    from app.models.api import ChatRequest
    from app.routers.chat import freeze_run_context, execute_chat
    from app.agents.runner import RunnerExecutionState
    selected=set(args.episodes.split(','))
    if not selected <= {c['episode_id'] for c in cases}:raise ValueError('Unknown episode ID.')
    calls=[];answers=[];used_input=0;used_output=0
    settings=Settings(_env_file=None,llm_provider=args.provider,llm_model=args.model,llm_reasoning_effort=args.effort)
    provider=build_provider(settings)
    class Budgeted:
        async def complete(self,messages,tools=None):
            nonlocal used_input,used_output
            if any(c["state"]=="outcome_unknown" for c in calls):
                raise ValueError("A previous call has unknown outcome; automatic retry is forbidden.")
            import time
            started=time.monotonic()
            if len(calls)==args.max_calls-1:
                tools=None
                messages=[*messages,{'role':'system','content':'This is the reserved final call. Give the best answer from the information already collected. Do not call tools.'}]
            text=json.dumps({'messages':messages,'tools':tools},ensure_ascii=False,default=str)
            estimate=math.ceil(len(text)/4)
            allowance=min(1000,args.max_requested_output-used_output)
            if len(calls)>=args.max_calls or used_input+estimate>args.max_estimated_input or allowance<=0:
                raise ValueError('Explicit evaluation budget exhausted; no dispatch.')
            # Reserve and persist BEFORE dispatch. Exceptions remain outcome_unknown.
            item={'call_id':len(calls)+1,'state':'outcome_unknown','estimated_input':estimate,'requested_output':allowance,'bytes':len(text.encode()),'messages':messages,'tools':tools}
            calls.append(item);used_input+=estimate;used_output+=allowance
            (args.output/'calls.json').write_text(json.dumps(calls,indent=2,default=str))
            reply=await provider.complete([*messages,{'role':'system','content':f'Evaluation output allowance: at most {allowance} tokens in this reply.'}],tools)
            item.update(state='completed',answer=reply.content,tool_calls=[vars(c) for c in reply.tool_calls],usage=getattr(reply,'usage',None),latency_seconds=time.monotonic()-started)
            (args.output/'calls.json').write_text(json.dumps(calls,indent=2,default=str))
            return reply
    for case in cases:
        if case['episode_id'] not in selected:continue
        with tempfile.TemporaryDirectory(prefix='matter-path-eval-') as directory:
            vault=Path(directory)/'vault';shutil.copytree(ROOT/'tests/fixtures/vault',vault)
            app=AppContext(Settings(_env_file=None,vault_path=str(vault),llm_provider='mock',scheduler_enabled=False,search_provider='disabled'))
            app.runner.provider=Budgeted();matter='MAT-DEMO-RELAY';conversation_id=None
            fixture=await prepare_fixture(app,case,matter)
            conversation_id=fixture['conversation_id']
            for turn in case['turns']:
                text=turn['paraphrases'][1]
                conversation=app.chat_history.append(matter,conversation_id,role='user',content=text,run_id=turn['message_id'])
                conversation_id=conversation['conversation_id'];message_id=conversation['messages'][-1]['message_id']
                request=freeze_run_context(ChatRequest(matter_id=matter,agent_id='counsel-copilot',conversation_id=conversation_id,message=text,
                    trusted_user_message=text,trusted_message_id=message_id,workspace_run_id=turn['message_id'],source_action_key=turn['message_id']),app,turn['message_id'])
                state=RunnerExecutionState()
                before={'paths':app.solution_paths.inspect(matter),'facts':app.matter_records.get(matter)}
                try:
                    response=await execute_chat(request,app,run_id=turn['message_id'],execution_state=state)
                    answer=response.reply;status='available'
                except Exception as exc:
                    answer=state.useful_content;status='unavailable:'+type(exc).__name__
                answers.append({'episode_id':case['episode_id'],'message_id':turn['message_id'],'status':status,'answer':answer,'fixture':fixture,'dispatch_metrics':state.frozen_context.get('dispatch_metrics',[]),'memory_receipt':{k:v for k,v in state.frozen_context.items() if k.startswith('memory_') or k.startswith('pending_memory')},'before':before,
                    'after':{'paths':app.solution_paths.inspect(matter),'facts':app.matter_records.get(matter)},'expected':turn['expected'],'assessment_method':'qualitative review pending'})
                if status.startswith('unavailable'):break
    manifest.update(provider_calls=len(calls),paid_calls=0 if args.provider in {'mock','demo'} else len(calls),semantic_model_behavior='unverified; mock harness only' if args.provider in {'mock','demo'} else 'live output captured; qualitative assessment pending',estimated_input=used_input,requested_output=used_output)
    close=getattr(provider,'aclose',None)
    if close:await close()
    return answers

async def prepare_fixture(app,case,matter):
    """Seed the declared A/B/C state. Expectations never enter model prompts."""
    import io
    from fastapi import UploadFile
    paths=app.solution_paths
    a=paths.ensure_baseline(matter)
    a=app.workspace_scenarios.save(matter,{**a,'title':'Original A'},expected_revision=a['revision'])
    b=paths.explore(matter,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank B',source_action_key='fixture-B',
        proposed_fact_changes=[{'change_id':'bank-custody','text':'Hypothesis: bank holds funds.'}],unresolved_conditions=['Bank agreement is pending.'])
    c=paths.explore(matter,parent_path_id=b['scenario_id'],parent_revision=b['revision'],title='Timing C',source_action_key='fixture-C',
        proposed_fact_changes=[{'change_id':'timing','text':'Hypothesis: settlement is delayed one day.'}])
    ids={'A':a['scenario_id'],'B':b['scenario_id'],'C':c['scenario_id']}
    if case['before'].get('duplicate_titles'):
        for path in (b,c):app.workspace_scenarios.save(matter,{**path,'title':'Bank'},expected_revision=path['revision'])
    fact='Actual report: operator holds funds.' if 'operator custody reported' in case['before']['facts'] else 'Actual corrected report: bank holds funds.'
    app.matter_records.apply_update(matter,facts=[{'fact_id':'FACT-eval-custody','text':fact}])
    source=await app.ingestion.upload_to_matter(matter,UploadFile(filename='frozen-local-rule.txt',file=io.BytesIO(b'Synthetic rule, dated 2020-01-01. Release requires written bank agreement. The exception applies only after agreement, not after choosing a plan.')))
    conv=app.chat_history.append(matter,None,role='user',content='Compare the saved paths in this order: Timing C, Bank B, Original A. Bank agreement remains pending.')
    conv=app.chat_history.append(matter,conv['conversation_id'],role='assistant',content='1. Timing C. 2. Bank B. 3. Original A. Next: read the written-agreement exception.')
    doc=app.vault.read_markdown(conv['path']);doc['metadata']['working_path_id']=ids[case['before']['working_path']]
    doc['metadata']['messages'][-1]['comparison_path_ids']=[ids[k] for k in case['before']['comparison_order']]
    app.vault.write_markdown(doc['path'],doc['content'],doc['metadata'])
    if case['before']['mainline']=='B':
        b=app.workspace_scenarios.get(matter,ids['B'])
        paths.transition(matter,path_id=b['scenario_id'],expected_path_revision=b['revision'],expected_mainline_revision=paths.state(matter)['revision'],source_action_key='fixture-select-B',run_id='fixture',message_id=conv['messages'][0]['message_id'],instruction_quote='Fixture setup: B already selected.')
    for path_id in ids.values():
        app.matter_memory.save(matter,path_id,{'current_task':'Check the written-agreement exception.','next_action':'Read the saved rule and assess its condition.'},expected_sequence=0,run_id='fixture',conversation_id=conv['conversation_id'],message_id=conv['messages'][0]['message_id'])
    for number in range(case['before'].get('archive_turns',0)):
        app.chat_history.append(matter,conv['conversation_id'],role='user',content=f'Unrelated fixture discussion {number}.')
    return {'path_ids':ids,'conversation_id':conv['conversation_id'],'source_id':source['library_source_id'],'source_version':source['library_source_version'],
            'environment_events':case.get('fixture_events',[]),'environment_event_status':'covered by deterministic lifecycle tests; not injected in this live conversation harness'}

if __name__=='__main__':main()
