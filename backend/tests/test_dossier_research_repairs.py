"""Regression checks promoted from the independent research-first review.

Control only provider boundaries and synthetic vault inputs. Exercise the real
chat routes, coordinator, publication, checkpoints, and restart behavior.
"""
import asyncio
import json
from dataclasses import replace
from pathlib import Path

import httpx
import pytest

from app.providers.base import ProviderReply, provider_session_id
from app.models.research_investigation import extract_research_synthesis, sanitize_proposed_actions
from app.services.dossier_request_execution import publish_batch
from app.services.dossier_generation import generate_dossier
from app.services.dossier_generation_context import capture, retain_issues
from app.services.dossier_research import prepare_publication
from app.services.research_checkpoints import ResearchCheckpoints
from app.services.research_collection import ResearchCollection
from app.services.workspace import digest
from app.runtime import AppContext
from tests.test_dossier_request_api import _api, _install_provider
from tests.test_dossier_request_lifecycle import _prepared, _prime_running_parent, _post_resume, _wait


MATTER = "MAT-DEMO-RELAY"
DETAIL = "Keep access conditional on written consent, an executed transfer schedule, and a successful export test. Emergency access excludes marketing use."


class ProcessDeath(BaseException):
    pass


class ReviewProvider:
    def __init__(self, app, *, gate=None, writer_error=None, plan_override=None):
        self.app = app
        self.ids = [i['issue_id'] for i in app.workspace.issues(MATTER)]
        self.gate = gate
        self.entered = asyncio.Event()
        self.writer_entered = asyncio.Event()
        self.writer_gate = None
        self.writer_error = writer_error
        self.plan_override = plan_override
        self.plans = 0
        self.workers = []
        self.writers = 0
        self.writer_inputs = []
        self.worker_inputs = []

    async def complete(self, messages, tools=None):
        blob = '\n'.join(str(m.get('content') or '') for m in messages)
        if 'Prepare the dossier plan for this matter' in blob:
            self.plans += 1
            plan = self.plan_override if self.plan_override is not None else {
                'issue_map': [{'issue_id': i, 'title': i, 'why_it_matters': 'Keep the launch conditional.',
                    'initial_answer': 'INITIAL_' + i + ': Proceed only after the applicable notice and consent terms are confirmed.',
                    'next_action': 'Obtain the signed terms.', 'focused_topic': 'ORIGINAL TOPIC ' + i} for i in self.ids],
                'first_issue_ids': self.ids[:3],
                'priorities': [{'key': 'p' + str(n), 'text': 'Priority ' + str(n), 'issue_ids': [i]} for n,i in enumerate(self.ids[:3])],
                'overall_topic': 'Original public topic'}
            return ProviderReply(content='Useful preparation answer.\n\n```dossier-plan\n' + json.dumps(plan) + '\n```')
        if 'Dossier-generation action' in blob:
            self.writers += 1
            self.writer_inputs.append(blob)
            self.writer_entered.set()
            if self.writer_gate:
                await self.writer_gate.wait()
            if self.writer_error:
                raise self.writer_error
            return ProviderReply(content='# Review dossier\n\n## Current position\n\nConditional overview.\n\n' + '\n\n'.join(
                '<!-- issue:' + i['issue_id'] + ' -->\n### ' + i['title'] + '\n\nShort current answer.'
                for i in self.app.workspace.issues(MATTER)))
        rid = provider_session_id.get()
        self.workers.append(rid)
        self.worker_inputs.append(blob)
        self.entered.set()
        if self.gate:
            await self.gate.wait()
        run = self.app.research_runs.get(MATTER, rid)
        iid = run['issue_id']
        return ProviderReply(content=DETAIL + '\n\n```research-synthesis\n' + json.dumps({
            'summary': 'A conditional answer.', 'issue_updates': [{'issue_id': iid,
            'position': 'Proceed only on the stated conditions.', 'next_action': 'Obtain written consent.',
            'analysis_markdown': DETAIL, 'rule_and_support': 'Executed clause 6 controls.',
            'application': 'The proposed transfer needs the named recipient.'}]}) + '\n```')


def install(app, provider):
    _install_provider(app, provider)


async def prepare(app, provider, action='review-prepare'):
    install(app, provider)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)), base_url='http://test') as c:
        response = await c.post('/api/chat', json={'matter_id': MATTER, 'message': 'Generate a dossier.',
            'experimental_chat': True, 'source_action_key': action})
        assert response.status_code == 200, response.text
        return next(x['status'] for x in response.json()['cards'] if x['type']=='dossier_research')


def choices(status, *, scope='top_three', **changes):
    return {'execution_mode':'research','expected_sequence':status['sequence'],
        'plan_revision':status['plan_revision'],'priorities':status['priorities'],
        'first_issue_ids':status['first_issue_ids'],'scope':scope,'source_choice':{'external':False},
        'accepted_candidate_keys':[],'source_action_key':'review-start',**changes}


async def start(app,status,payload=None):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)),base_url='http://test') as c:
        return await c.post(f"/api/matters/{MATTER}/dossier-requests/{status['request_id']}/start",json=payload or choices(status))


async def finished(app,status):
    await _wait(app)
    return app.dossier_requests.get(MATTER,status['request_id'])


@pytest.mark.asyncio
async def test_AR01_crlf_source_is_readable_without_false_corruption(app_context, monkeypatch):
    app=app_context
    iid=app.workspace.issues(MATTER)[0]['issue_id']
    child=app.research_runs.create_managed_child(MATTER,parent_request_id='DOR-review-crlf',issue_id=iid,
        question='Read the saved rule.',source_scope={'external':True})
    async def fetched(*args,**kwargs):
        return {'retrieved_content':('Clause one.\r\nClause two with exception.\r\n'*20),
            'support_state':'retrieved','retrieval_method':'diagnostic-fetch'}
    monkeypatch.setattr('app.services.research_reader.read_source',fetched)
    access=ResearchCollection(app,MATTER,child['run_id'])
    result=await access._fetch({'url':'https://example.org/review-rule','title':'Review rule'})
    assert result['source_id']
    assert ResearchCheckpoints(app.research_runs).load(MATTER,child['run_id'])['sources']


@pytest.mark.asyncio
async def test_AR02_failed_writer_still_publishes_saved_answers(app_context):
    app=app_context; provider=ReviewProvider(app,writer_error=RuntimeError('controlled writer failure'))
    status=await prepare(app,provider); assert (await start(app,status)).status_code==202
    result=await finished(app,status)
    print(json.dumps({'state':result['state'],'ready':result['first_pass_ready_at'],'publications':result['publications']}))
    revision=result['publications'][0].get('revision_path')
    assert revision and DETAIL in app.vault.read_markdown(revision)['content'], 'No fallback dossier was published from saved answers'


@pytest.mark.asyncio
async def test_AR03_writer_headings_cannot_erase_full_analysis(app_context):
    app=app_context; provider=ReviewProvider(app)
    status=await prepare(app,provider); assert (await start(app,status)).status_code==202
    result=await finished(app,status); revision=result['publications'][0]['revision_path']
    assert DETAIL in provider.writer_inputs[0], 'precondition: writer received full analysis'
    assert DETAIL in app.vault.read_markdown(revision)['content'], 'Issue heading suppresses full-analysis retention'


@pytest.mark.asyncio
async def test_AR04_edit_before_writer_is_preserved(app_context):
    app=app_context; gate=asyncio.Event(); provider=ReviewProvider(app,gate=gate)
    status=await prepare(app,provider); assert (await start(app,status)).status_code==202
    await provider.entered.wait()
    path=app.dossiers._path(MATTER); old=app.vault.read_markdown(path)['content']
    edited=old+'\n\nLawyer edit: require export escrow before migration.\n'
    app.vault.update_markdown(path,content=edited)
    before=app.vault.read_markdown(path)['content']; gate.set()
    result=await finished(app,status)
    print('publication_state',result['publications'][0]['state'])
    assert app.vault.read_markdown(path)['content']==before, 'Concurrent saved lawyer edit was overwritten'


@pytest.mark.asyncio
async def test_AR05_actual_saved_only_chat_binds_distinct_facts(app_context):
    app=app_context
    from tests.test_dossier_references import _two_facts
    _two_facts(app)
    facts=app.matter_records.get(MATTER)['facts']
    assert len(facts)>=2
    ids=[f['fact_id'] for f in facts[:2]]
    class FactWriter:
        async def complete(self,messages,tools=None):
            return ProviderReply(content='# Dossier\n\nThe answer relies on '+ids[0]+' and separately '+ids[1]+'.')
    install(app,FactWriter())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=_api(app)),base_url='http://test') as c:
        response=await c.post('/api/chat',json={'matter_id':MATTER,'message':'Generate a dossier from saved material only.',
            'experimental_chat':True,'source_action_key':'review-fact-binding'})
    assert response.status_code==200,response.text
    result=response.json(); print('reply',result['reply'][:500],'sources',result.get('source_records'))
    assert all('[source:'+i+']' in result['reply'] for i in ids), 'Production chat never supplies the reference catalog'
    assert set(ids)<={r['source_id'] for r in result['source_records']}


@pytest.mark.asyncio
async def test_AR06_all_includes_accepted_candidate_outside_first_three(app_context):
    app=app_context; provider=ReviewProvider(app)
    status=await prepare(app,provider)
    def add(md,body):
        md['new_issue_candidates']=[{'candidate_key':'new-late','title':'Tax withholding','why_it_matters':'Withholding can delay payment.',
            'initial_answer':'Apply the agreed payment route only after tax status is confirmed.','fact_ids':[]}]
        return md,body
    status=app.dossier_requests._mutate(MATTER,status['request_id'],add,expected_sequence=None)
    assert (await start(app,status,choices(status,scope='all',accepted_candidate_keys=['new-late']))).status_code==202
    result=await finished(app,status)
    assert any(i['title']=='Tax withholding' for i in result['issues']), 'All silently omits a displayed accepted candidate'


@pytest.mark.asyncio
async def test_AR07_public_source_choice_is_the_one_children_receive(app_context):
    app=app_context; gate=asyncio.Event(); provider=ReviewProvider(app,gate=gate)
    status=await prepare(app,provider)
    requested={'external':True,'native':True,'public_query':'USER APPROVED REPLACEMENT TOPIC',
        'allow_firecrawl':True,'allow_followup_queries':False,'collection_enabled':False,'provider_ids':[]}
    assert (await start(app,status,choices(status,source_choice=requested))).status_code==202
    children=app.research_runs.managed_children(MATTER,status['request_id'])
    saved=[c['search_scope'] for c in children]
    current=app.dossier_requests.get(MATTER,status['request_id'])
    await app.dossier_requests.stop(MATTER,status['request_id'],expected_sequence=current['sequence'])
    print('submitted',requested,'saved',saved)
    assert all(s['native'] and s['allow_firecrawl'] and s['public_query']==requested['public_query'] for s in saved), 'Confirmed choices were dropped or substituted'


@pytest.mark.asyncio
async def test_AR08_retry_failed_child_uses_remaining_budget(app_context):
    app=app_context; provider=ReviewProvider(app); install(app,provider)
    ids=[app.workspace.issues(MATTER)[0]['issue_id']]
    status=_prepared(app,ids,action='review-retry'); child=_prime_running_parent(app,status,ids)[0]
    app.research_runs._write(MATTER,child['run_id'],state='failed',managed_state='failed',failure_detail='Transient local failure')
    def fail(md,body):
        md['state']='failed'; md['issues'][ids[0]]['state']='failed'; return md,body
    status=app.dossier_requests._mutate(MATTER,status['request_id'],fail,expected_sequence=None)
    assert (await _post_resume(app,status)).status_code==202
    await finished(app,status)
    assert provider.workers, 'Retry queued the parent row but skipped the failed child as terminal'


@pytest.mark.asyncio
@pytest.mark.parametrize('field,value',[('issue_map',None),('first_issue_ids',7),('date_candidates',False)])
async def test_AR09_malformed_optional_plan_keeps_useful_chat(app_context,field,value):
    provider=ReviewProvider(app_context,plan_override={field:value})
    status=await prepare(app_context,provider)
    assert 'Useful preparation answer.' in status['preparation']


def test_AR09_one_bad_optional_field_preserves_valid_issue_update():
    raw='Useful prose.\n```research-synthesis\n'+json.dumps({'issue_updates':[{'issue_id':'ISS-review','position':'Valid answer.',
        'analysis_markdown':DETAIL,'rule_and_support':{'malformed':'optional'}}]})+'\n```'
    prose,synthesis,warnings=extract_research_synthesis(raw)
    assert prose=='Useful prose.'
    assert synthesis['issue_updates'] and synthesis['issue_updates'][0]['analysis_markdown']==DETAIL, 'One optional field discarded the valid issue answer'


def test_AR10_date_requires_real_anchor_and_correct_arithmetic():
    actions=sanitize_proposed_actions([{'action':'Send notice','due_date':'2026-10-01','anchor_reference_id':'FACT-missing',
        'anchor_date':'2026-11-02','offset_calendar_days':-7,'timing_basis':'seven days before launch'}])
    assert actions[0]['due_date'] is None, 'Unresolved anchor and inconsistent supplied date were accepted'


@pytest.mark.asyncio
async def test_AR11_repeated_generate_shows_active_parent_without_new_call(app_context):
    app=app_context; gate=asyncio.Event(); provider=ReviewProvider(app,gate=gate)
    first=await prepare(app,provider); assert (await start(app,first)).status_code==202
    await provider.entered.wait()
    second=await prepare(app,provider,action='different-generate')
    current=app.dossier_requests.get(MATTER,first['request_id'])
    await app.dossier_requests.stop(MATTER,first['request_id'],expected_sequence=current['sequence'])
    assert second['request_id']==first['request_id'] and provider.plans==1, 'New Generate created a second setup and spent a planning call'


@pytest.mark.asyncio
async def test_AR12_unknown_writer_outcome_does_not_retry_without_choice(app_context):
    app=app_context; provider=ReviewProvider(app,writer_error=ProcessDeath())
    status=await prepare(app,provider); assert (await start(app,status)).status_code==202
    await _wait(app); assert provider.writers==1
    reopened=AppContext(app.settings); after=ReviewProvider(reopened); install(reopened,after)
    current=reopened.dossier_requests.get(MATTER,status['request_id'])
    assert (await _post_resume(reopened,current,retry_unknown=False)).status_code==202
    await _wait(reopened)
    assert after.writers==0, 'Writer outcome had no reservation and was silently repeated without retry_unknown'


@pytest.mark.asyncio
async def test_AR13_parent_saved_only_start_returns_before_model_finishes(app_context):
    app=app_context; provider=ReviewProvider(app)
    status=await prepare(app,provider); provider.writer_gate=asyncio.Event()
    task=asyncio.create_task(start(app,status,choices(status,execution_mode='saved_only',scope=None)))
    await asyncio.wait_for(provider.writer_entered.wait(),2)
    returned=task.done(); provider.writer_gate.set(); response=await task
    assert response.status_code==202
    assert returned, 'Saved-only Start holds the HTTP request until the model completes'


@pytest.mark.asyncio
async def test_AR14_unresearched_initial_answers_reach_writer(app_context):
    app=app_context; provider=ReviewProvider(app)
    status=await prepare(app,provider)
    # Choose fewer than three through the API to retain other planned issues.
    payload=choices(status,first_issue_ids=status['first_issue_ids'][:1])
    assert (await start(app,status,payload)).status_code==202
    await finished(app,status)
    unselected=provider.ids[1]
    assert 'INITIAL_'+unselected in provider.writer_inputs[0], 'Prepared initial answers never reach dossier capture'


def test_AR15_two_short_updates_retain_original_detail_and_fields(app_context):
    app=app_context; issues=app.workspace.issues(MATTER); iid=issues[0]['issue_id']
    current={'versions':[],'current_version_id':None,'content':'','proposal':None}
    for index in range(3):
        update={'issue_id':iid,'position':'Short answer '+str(index)}
        if index==0: update.update(analysis_markdown=DETAIL,rule_and_support='Executed section 6',application='Named recipient only')
        pub=prepare_publication(current,{'run_id':f'RUN-{index}','issue_id':iid}, {'output_revision':str(index),'created_at':str(index)},
            {'issue_updates':[update]},'Useful prose',issues,{'packet_path':f'packet-{index}.md','basis':{},'key':str(index)})
        current={**current,'proposal':{'research_publication':pub}}
    item=pub['issue_positions'][iid]
    assert DETAIL in (item.get('analysis_markdown','')+item.get('prior_analysis_markdown','')), 'Second partial update discarded prior full detail'
    assert item['rule_and_support']=='Executed section 6'

@pytest.mark.asyncio
async def test_AR16_restart_partial_batch_publishes_all_completed_siblings(app_context):
    app=app_context; ids=[i['issue_id'] for i in app.workspace.issues(MATTER)][:3]
    status=_prepared(app,ids,action='review-partial-batch'); children=_prime_running_parent(app,status,ids)
    before=ReviewProvider(app); install(app,before)
    await asyncio.gather(*(app.research_runs.launch_managed_child(MATTER,c['run_id']) for c in children[:2]))
    app.research_runs._write(MATTER,children[2]['run_id'],state='running',managed_state='collecting')
    reopened=AppContext(app.settings); after=ReviewProvider(reopened); install(reopened,after)
    current=reopened.dossier_requests.get(MATTER,status['request_id'])
    assert (await _post_resume(reopened,current)).status_code==202
    result=await finished(reopened,current)
    print('published batches',[p['issue_ids'] for p in result['publications']],'worker calls',after.workers)
    assert len(after.workers)==1
    assert any(set(p['issue_ids'])==set(ids) for p in result['publications']), 'Restart published only the unfinished child and omitted the two completed siblings'

@pytest.mark.asyncio
async def test_AR17_no_fourth_worker_after_thirty_seconds(app_context):
    app=app_context; gate=asyncio.Event(); provider=ReviewProvider(app,gate=gate); install(app,provider)
    iid=provider.ids[0]
    ordinary=app.research_runs.start(MATTER,['Ordinary research remains active.'],issue_id=iid)
    await asyncio.wait_for(provider.entered.wait(),3)
    status=await prepare(app,provider,action='review-fourth-worker')
    assert (await start(app,status)).status_code==202
    try:
        async with asyncio.timeout(34):
            while len(provider.workers)<4:
                await asyncio.sleep(.05)
    except TimeoutError:
        pass
    count=len(provider.workers); gate.set(); await finished(app,status)
    print('concurrent provider entries before releasing ordinary run',count)
    assert count==1, 'Coordinator starts its three workers after an arbitrary wait while ordinary research is still active'

@pytest.mark.asyncio
async def test_AR18_priority_edit_is_sent_to_workers(app_context):
    app=app_context; provider=ReviewProvider(app); status=await prepare(app,provider)
    priorities=[dict(p) for p in status['priorities']]
    priorities[0]['text']='LAWYER_PRIORITY_SENTINEL: assess export escrow before any transfer'
    priorities[0]['why']='User changed the operational focus.'; priorities[0]['changed']=True
    assert (await start(app,status,choices(status,priorities=priorities))).status_code==202
    await finished(app,status)
    assert 'LAWYER_PRIORITY_SENTINEL' in '\n'.join(provider.worker_inputs), 'Edited priority text is saved but never used in a worker brief'

@pytest.mark.asyncio
async def test_AR19_action_reuse_conflicts_on_changed_priority_text(app_context):
    app=app_context; gate=asyncio.Event(); provider=ReviewProvider(app,gate=gate); status=await prepare(app,provider)
    payload=choices(status); assert (await start(app,status,payload)).status_code==202
    altered=json.loads(json.dumps(payload)); altered['priorities'][0]['text']='Different user choice'
    response=await start(app,status,altered)
    gate.set(); await finished(app,status)
    assert response.status_code==409, 'Same action key with different priority text is silently accepted as identical'


def test_AR20_internal_passage_and_duplicate_records_are_not_external_reads(app_context):
    from app.services.dossier_request_execution import DossierRequestExecutor
    app=app_context; executor=DossierRequestExecutor(app.dossier_requests,MATTER,'DOR-counts')
    path=app.matters.matter_path(MATTER)+'/research/review-counts.md'
    external={'source_id':'SRC-review','source_hash':'v1','source_kind':'external','support_state':'retrieved','selected_passages':[{'quote':'A saved rule.'}]}
    internal={'source_id':'FACT-review','source_kind':'internal','source_class':'reported_fact','support_state':'supplied','selected_passages':[{'quote':'A supplied business fact.'}]}
    app.vault.write_markdown(path,'Synthetic count fixture.',{'source_records':[internal,external,dict(external)]})
    counts=executor._packet_counts(path); print('source counts',counts)
    assert counts['sources_read']==1 and counts['sources_retrieved']==1


def test_AR21_distinct_source_versions_survive_combined_catalog():
    from app.services.dossier_request_execution import _combined_source_records
    records=[{'source_id':'SRC-review','source_hash':'version-a','source_version':'a','selected_passages':[{'quote':'Original clause.'} ]},
             {'source_id':'SRC-review','source_hash':'version-b','source_version':'b','selected_passages':[{'quote':'Changed clause.'}]}]
    result=_combined_source_records({'issue_positions':{'a':{'source_records':[records[0]]},'b':{'source_records':[records[1]]}}},[])
    assert len(result)==2, 'Source-id-only deduplication discards one captured version'

@pytest.mark.asyncio
async def test_AR22_review_revision_includes_fresh_sibling_analysis(app_context):
    app=app_context; gate=asyncio.Event()
    class DistinctProvider(ReviewProvider):
        async def complete(self,messages,tools=None):
            response=await super().complete(messages,tools)
            rid=provider_session_id.get()
            if rid and rid in self.workers:
                iid=self.app.research_runs.get(MATTER,rid)['issue_id']
                response=replace(response,content=response.content.replace(DETAIL,'UNIQUE_ANALYSIS_'+iid+' '+DETAIL))
            return response
    provider=DistinctProvider(app,gate=gate); status=await prepare(app,provider)
    assert (await start(app,status)).status_code==202
    await provider.entered.wait()
    app.matter_records.apply_update(MATTER,facts=[{'text':'A new product fact was recorded while research was running.'}],actor='human',summary='Independent fact update')
    gate.set(); result=await finished(app,status)
    assert result['publications'][0]['state']=='review_required'
    missing=[i for i in status['first_issue_ids'] if 'UNIQUE_ANALYSIS_'+i not in provider.writer_inputs[0]]
    print('new issue answers missing from review writer input',missing)
    assert not missing, 'Stale basis path composes from current advice instead of the saved combined child candidate'

@pytest.mark.asyncio
async def test_AR23_zero_issues_still_produces_a_useful_saved_dossier(app_context):
    app=app_context; root=app.matters.matter_path(MATTER)
    app.vault.write_markdown(root+'/issues.md','# Issues\n',{'matter_id':MATTER,'record_type':'issues'})
    assert app.workspace.issues(MATTER)==[]
    provider=ReviewProvider(app); status=await prepare(app,provider)
    assert (await start(app,status)).status_code==202
    result=await finished(app,status)
    assert result['publications'] and result['publications'][0].get('revision_path'), 'Zero-issue request completes without a dossier or next action'

@pytest.mark.asyncio
@pytest.mark.parametrize('count',[1,2,3])
async def test_control_one_two_three_distinct_children_publish(app_context,count):
    app=app_context; provider=ReviewProvider(app); status=await prepare(app,provider)
    assert (await start(app,status,choices(status,first_issue_ids=status['first_issue_ids'][:count]))).status_code==202
    result=await finished(app,status)
    assert len(set(provider.workers))==count
    assert len(result['publications'])==1 and result['publications'][0]['revision_path']

@pytest.mark.asyncio
@pytest.mark.parametrize('boundary',['writer_response','recommendation','dossier','conversation'])
async def test_control_actual_writer_receipt_recovery(app_context,monkeypatch,boundary):
    from tests import test_dossier_request_lifecycle as author
    # Use a separate monkeypatch so the author's injected-crash undo does not
    # undo the corrected real writer/child boundary installation.
    fixed=pytest.MonkeyPatch(); observed=[]
    def full_install(app,provider):
        observed.append(provider); _install_provider(app,provider)
    fixed.setattr(author,'_install',full_install)
    try:
        await author.test_publication_boundaries_replay_without_duplicates(app_context,monkeypatch,boundary)
        assert observed[0].writer_calls==(0 if boundary=='recommendation' else 1)
        assert observed[-1].writer_calls==(1 if boundary=='recommendation' else 0)
    finally:
        fixed.undo()


def test_AR24_generated_candidate_keys_are_local_to_the_request(app_context):
    app=app_context
    def add(request,title):
        return app.workspace.append_generated_issues(MATTER,[{'candidate_key':'candidate-1','title':title,'why_it_matters':'A separate legal workstream.','fact_ids':[]}],expected_revision=app.workspace.issues_revision(MATTER),request_id=request)
    first=add('DOR-first','Tax withholding'); second=add('DOR-second','Export classification')
    assert first['mapping']['candidate-1']!=second['mapping']['candidate-1'], 'A later unrelated issue silently reuses the old issue merely because the model used the same local key'

@pytest.mark.asyncio
async def test_AR25_invalid_start_does_not_mutate_issues(app_context):
    app=app_context; provider=ReviewProvider(app); status=await prepare(app,provider)
    def candidate(md,body):
        md['new_issue_candidates']=[{'candidate_key':'new-candidate','title':'Employment approval','why_it_matters':'A material condition.','initial_answer':'Confirm permission.','fact_ids':[]}]; return md,body
    status=app.dossier_requests._mutate(MATTER,status['request_id'],candidate,expected_sequence=None)
    before=app.workspace.issues_revision(MATTER)
    response=await start(app,status,choices(status,first_issue_ids=['new-candidate'],source_choice={'external':True,'native':True,'public_query':''}))
    assert response.status_code in {400,409,422}
    assert app.workspace.issues_revision(MATTER)==before, 'Rejected Start still appended a canonical issue'

@pytest.mark.asyncio
async def test_AR26_local_source_records_do_not_break_the_sources_footer(app_context):
    app=app_context; iid=app.workspace.issues(MATTER)[0]['issue_id']
    child=app.research_runs.create_managed_child(MATTER,parent_request_id='DOR-source-footer',issue_id=iid,question='Read saved records.',source_scope={'external':False})
    access=ResearchCollection(app,MATTER,child['run_id'])
    path=app.matters.matter_path(MATTER)+'/facts.md'
    # Local source read is a production boundary; its returned source shape
    # must be printable alongside the external source records.
    access.capture_local(app.vault.read_markdown(path))
    cp=ResearchCheckpoints(app.research_runs).load(MATTER,child['run_id'])
    records=cp.get('local_sources') or []
    assert records
    text=app.research._source_lines({'execution_version':2,'source_records':records})
    assert records[0]['source_id'] in text


def test_supported_date_uses_frozen_anchor_and_computed_offset():
    action = sanitize_proposed_actions([{"action": "Send notice", "due_date": "2026-10-01", "anchor_reference_id": "FACT-launch", "anchor_date": "2099-01-01", "offset_calendar_days": -7}], anchors={"FACT-launch": {"date": "2026-11-02", "role": "launch event"}})[0]
    assert action["due_date"] == "2026-10-26"
    assert action["anchor_date"] == "2026-11-02" and action["date_state"] == "proposed"
    assert "launch event" in action["timing_basis"]


def test_legacy_crlf_accepts_only_exact_original_body(app_context):
    from app.services.workspace import digest
    app = app_context
    child = app.research_runs.create_managed_child(MATTER, parent_request_id="DOR-crlf", issue_id=app.workspace.issues(MATTER)[0]["issue_id"], question="Read saved text", source_scope={"external": False})
    path = app.matters.matter_path(MATTER) + "/research/sources/legacy-crlf.md"
    text = "Original clause.\r\nCondition retained.\n"
    app.vault.write_markdown(path, text)
    service = ResearchCheckpoints(app.research_runs)
    service.update(MATTER, child["run_id"], sources=[{"path": path, "source_hash": digest(text)}])
    assert service.load(MATTER, child["run_id"])["sources"]
    app.vault.update_markdown(path, content="A changed clause.\n")
    with pytest.raises(ValueError, match="hash changed"):
        service.load(MATTER, child["run_id"])


@pytest.mark.asyncio
async def test_missing_source_keeps_saved_answer_without_another_call(app_context):
    from app.services.main_agent_research import run_main_research
    from app.models.research_scope import ResearchScope
    app = app_context
    provider = ReviewProvider(app); install(app, provider)
    child = app.research_runs.create_managed_child(MATTER, parent_request_id="DOR-missing", issue_id=app.workspace.issues(MATTER)[0]["issue_id"], question="Retain the saved answer", source_scope={"external": False})
    cp = ResearchCheckpoints(app.research_runs)
    cp.update(MATTER, child["run_id"], useful_content=DETAIL, sources=[{"source_id": "SRC-missing", "path": app.matters.matter_path(MATTER) + "/research/sources/missing.md", "source_hash": "original"}])
    result = await run_main_research(app.research, MATTER, "Retain the saved answer", run_id=child["run_id"], frozen_context=child["frozen_context"], scope=ResearchScope(), resolved_provider=app.runner.resolve("counsel-copilot"))
    assert DETAIL in result["body"] and not provider.workers
    assert result["source_records"][0]["snapshot_error"] and result["structure_warnings"]


@pytest.mark.asyncio
async def test_writer_overflow_keeps_complete_saved_detail(app_context):
    from app.services.dossier_generation_context import capture
    from app.services.dossier_generation import generate_dossier
    app = app_context; provider = ReviewProvider(app); install(app, provider)
    snapshot = capture(app, MATTER); iid = snapshot["data"]["issues"][0]["issue_id"]
    detail = "Full condition retained. " * 24000 + " FINAL_EXACT_EXCEPTION."
    snapshot["data"]["issue_analysis"][iid].update(position="Conditional answer", analysis_markdown=detail, researched=True)
    result = await generate_dossier(app, MATTER, frozen_context={"dossier_inputs": snapshot})
    assert result.get("revision_path") and detail in app.vault.read_markdown(result["revision_path"])["content"]
    assert len(provider.writer_inputs[0].encode()) < app.settings.model_dispatch_max_bytes


@pytest.mark.asyncio
async def test_unknown_writer_retry_is_explicit_and_reuses_children(app_context):
    app = app_context; provider = ReviewProvider(app, writer_error=ProcessDeath())
    status = await prepare(app, provider); await start(app, status); await _wait(app)
    reopened = AppContext(app.settings); after = ReviewProvider(reopened); install(reopened, after)
    current = reopened.dossier_requests.get(MATTER, status["request_id"])
    await _post_resume(reopened, current, retry_unknown=True); await _wait(reopened)
    result = reopened.dossier_requests.get(MATTER, status["request_id"])
    assert after.writers == 1 and not after.workers
    assert result["publications"][0]["revision_path"]


@pytest.mark.asyncio
async def test_reference_keeps_fact_version_captured_before_writer(app_context):
    from app.services.dossier_generation_context import capture
    from app.services.dossier_generation import generate_dossier
    from tests.test_dossier_references import _two_facts
    app = app_context; fid, _ = _two_facts(app); frozen = capture(app, MATTER)
    original = next(f for f in frozen["data"]["reported_records"]["facts"] if f["fact_id"] == fid)
    path = app.matters.matter_path(MATTER) + "/facts.md"
    app.vault.update_markdown(path, content="Later changed fact.\n")
    class FactWriter:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="Captured fact: " + fid)
    install(app, FactWriter())
    result = await generate_dossier(app, MATTER, frozen_context={"dossier_inputs": frozen})
    source = next(s for s in result["source_records"] if s["source_id"] == fid)
    assert source["available_excerpt"] == original["text"]
    assert source["captured_record"] == original
    assert result["state"] == "review_required"


def test_legacy_display_uses_saved_raw_text_without_rewriting_history():
    from copy import deepcopy
    from app.agents.output import clean_conversation_for_display
    message = {"role": "assistant", "content": "See the internal record.", "raw_output": "See Q-one and Q-two.", "source_records": [{"source_id": "Q-one", "source_label": "First question", "available_excerpt": "Original first question", "source_version": "old", "path": "03_Matters/relay/workspace.md"}]}
    saved = {"messages": [message]}; before = deepcopy(saved)
    displayed = clean_conversation_for_display(saved)["messages"][0]
    assert "[source:Q-one]" in displayed["content"] and "Reference unavailable: Q-two" in displayed["content"]
    assert saved == before


def test_captured_source_versions_bind_to_their_own_issue_answers(app_context):
    from app.services.dossier_references import build_catalog, captured_reference_key
    app = app_context
    root = app.matters.matter_path(MATTER)
    issues = app.workspace.issues(MATTER)[:2]
    sources = [{"source_id": "SRC-shared", "source_version": version,
        "source_label": "Transfer clause " + version, "path": root + "/research/" + version + ".md",
        "selected_passages": [{"text": text}], "support_state": "retrieved"}
        for version, text in [("v1", "Consent is required."), ("v2", "Consent is waived only for named affiliates.")]]
    positions = {issue["issue_id"]: {"position": "Apply [source:SRC-shared].", "analysis_markdown": source["selected_passages"][0]["text"],
        "source_records": [source]} for issue, source in zip(issues, sources)}
    snap = {"data": {"issues": issues, "reported_records": {}, "proposed_working_view": {"research_publication": {"issue_positions": positions}}}}
    snap["references"] = build_catalog(app, MATTER, snapshot=snap)
    from app.services.dossier_generation_context import resolve_issue_analysis
    snap["data"]["issue_analysis"] = resolve_issue_analysis(app, MATTER, issues, {"issue_positions": positions})
    content, _ = retain_issues("# Overview", snap)
    for source in sources:
        key = captured_reference_key(source)
        assert "[source:" + key + "]" in content
        assert snap["references"][key]["selected_passages"] == source["selected_passages"]
    assert "SRC-shared" not in snap["references"], "ambiguous overview must not pick a version"
    combined = __import__("app.services.dossier_request_execution", fromlist=["_combined_source_records"])._combined_source_records(
        {"source_records": [*sources, *snap["references"].values()]}, [])
    shared = [s for s in combined if s["source_id"] == "SRC-shared"]
    assert len(shared) == 2 and all(s.get("reference_key") for s in shared)


def test_captured_artifact_paths_and_messages_keep_exact_saved_records(app_context):
    from app.services.dossier_references import build_catalog, bind_references
    app = app_context; root = app.matters.matter_path(MATTER)
    documents = [{"path": root + "/work-products/draft-" + str(n) + ".md", "metadata": {"work_product_id": "WP-test-" + str(n), "title": "Draft " + str(n)}, "content": "Exact draft " + str(n)} for n in range(5)]
    for document in documents:
        app.vault.write_markdown(document["path"], document["content"], document["metadata"])
    conversation = app.chat_history.append(MATTER, None, role="user", content="The launch remains conditional.")
    cid = conversation["conversation_id"]
    captured = capture(app, MATTER, {"conversation_id": cid, "manifest": {"entries": [{"path": d["path"], "state": "included"} for d in documents]}})
    mid = captured["data"]["conversation_messages"][-1]["message_id"]
    text = "\n".join(d["path"] for d in documents) + "\n" + mid
    catalog = build_catalog(app, MATTER, output_text=text, snapshot=captured)
    bound = bind_references(text, catalog)
    assert all("](" + d["path"] + ")" in bound for d in documents)
    assert all(catalog[d["metadata"]["work_product_id"]]["available_excerpt"] == d["content"] for d in documents)
    assert catalog[mid]["available_excerpt"] == "The launch remains conditional."
    app.vault.write_markdown(documents[0]["path"], "Changed after capture", documents[0]["metadata"])
    assert build_catalog(app, MATTER, output_text=text, snapshot=captured)["WP-test-0"]["available_excerpt"] == "Exact draft 0"


@pytest.mark.asyncio
async def test_initial_generated_question_does_not_mark_own_later_batch_stale(app_context):
    app = app_context
    path = app.matters.matter_path(MATTER) + "/dossier.md"
    app.vault.write_markdown(path, "# Empty dossier", {"matter_id": MATTER})
    class InitialQuestionWriter(ReviewProvider):
        async def complete(self, messages, tools=None):
            reply = await super().complete(messages, tools)
            if any("Dossier-generation action" in str(m.get("content")) for m in messages):
                return ProviderReply(content=reply.content + "\n\n## Decision question\n\nCan the launch proceed with conditions?")
            return reply
    provider = InitialQuestionWriter(app)
    assert len(provider.ids) > 3
    status = await prepare(app, provider, "initial-question-batches")
    started = await start(app, status, choices(status, scope="all"))
    assert started.status_code == 202
    await _wait(app)
    publications = app.dossier_requests.get(MATTER, status["request_id"])["publications"]
    assert len(publications) == (len(provider.ids) + 2) // 3
    assert all(p["state"] == "applied" for p in publications), [(p["state"], p.get("warning"), p.get("writer_warnings")) for p in publications]


@pytest.mark.asyncio
async def test_replayed_writer_does_not_adopt_a_later_lawyer_edit(app_context):
    app = app_context
    provider = ReviewProvider(app); install(app, provider)
    first = await generate_dossier(app, MATTER, run_id="DOSGEN-lawyer-edit-replay")
    assert first["state"] == "applied"
    path = app.dossiers._path(MATTER)
    document = app.vault.read_markdown(path)
    app.vault.write_markdown(path, document["content"] + "\nLawyer's independent condition.", document["metadata"])
    edited = app.vault.read_text(path)
    second = await generate_dossier(app, MATTER, run_id="DOSGEN-lawyer-edit-replay")
    assert second["state"] == "review_required"
    assert app.vault.read_text(path) == edited and provider.writers == 1
