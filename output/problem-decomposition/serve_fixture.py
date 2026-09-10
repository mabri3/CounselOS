"""Synthetic isolated UI states. Never uses the active vault pointer."""
import sys,json,shutil,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[2];sys.path.insert(0,str(root/'backend'));sys.path.insert(0,str(root/'backend/tests'))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import MatterCreate
from app.providers.base import ProviderReply
from tests.manual.serve_research_investigation import make_app
from test_problem_analysis import payload
vault=Path(tempfile.mkdtemp(prefix='problem-breakdown-browser-'))/'vault'
shutil.copytree(root/'backend/tests/fixtures/vault',vault)
context=AppContext(Settings(_env_file=None,vault_path=str(vault),scheduler_enabled=False,llm_provider='mock',llm_api_key=None,search_provider='disabled',polaris_api_key=None))
class Provider:
    async def complete(self,messages,tools=None):
        return ProviderReply(content='Synthetic answer: assess internal evaluation and separate vendor reuse. This is a scripted UI fixture.')
context.runner.provider=Provider()
cases={}
for state in ['saved','partial','stale','no-map']:
    matter=context.matters.create(MatterCreate(title='Synthetic support pilot '+state,request_text='Can we use customer chats to improve support?'))
    mid=matter['matter_id'];cases[state]=mid
    context.matter_records.apply_update(mid,facts=[{'text':'Customer chats are collected and retained for internal evaluation.'}],actor='Lawyer')
    if state=='no-map':continue
    for version in [1,2]:
        frozen=context.agent_context.build_run_context(context.agents.get('counsel-copilot'),matter_id=mid,run_id=f'RUN-{state}-{version}')
        p=payload();p['next_step']='Inspect the supplied vendor terms.'
        fact=frozen['problem_analysis_capture']['inputs']['facts'][0]
        p['parts'][0].update(status='reported',references=[{'kind':'fact','record_id':fact['fact_id']}])
        p['questions'][0].update(assessment='Separate reuse remains unresolved.',answer_changing_fact='Whether training reuse can be disabled.',counterpoint='The signed terms may limit the vendor purpose.')
        if version==2:p['changes']=[{'kind':'assessment_changed','prior_question_keys':['purpose'],'current_question_keys':['purpose'],'reason':'The later report identifies vendor training reuse.','answer_effect':'The pilot must address this separate purpose.','references':[]}]
        if state=='partial':p['coverage']=[{'topic':'Vendor retention','reason':'Retention period is not supplied.','state':'unresolved'}]
        context.workspace_actions.publish_result(mid,run_id=f'RUN-{state}-{version}',text='Useful synthetic answer. Separate internal evaluation and vendor reuse.',source_revisions=frozen['publication_baseline'],expected_question_revision=context.workspace.business_question(mid)['revision'],frozen_context=frozen,problem_structure=p)
    if state=='stale':context.matter_records.apply_update(mid,facts=[{'text':'The vendor now reports training its general model.'}],actor='Lawyer')
context.index.rebuild()
app=make_app(context,'http://localhost:3136')
@app.get('/fixture-state')
def state():return {'vault':str(vault),'cases':cases}
(root/'output/problem-decomposition/browser-fixture.json').write_text(json.dumps({'vault':str(vault),'cases':cases},indent=2))
print(json.dumps({'vault':str(vault),'cases':cases}),flush=True)
if __name__=='__main__':
 import uvicorn
 uvicorn.run(app,host='127.0.0.1',port=8136)
