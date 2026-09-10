"""Isolated, synthetic, scripted browser fixture. No live model or public research."""
import argparse,asyncio,io,json,re,shutil,tempfile
from pathlib import Path
from fastapi import UploadFile
from app.config import Settings
from app.runtime import AppContext
from app.providers.base import ProviderReply,ProviderToolCall,ProviderSelection
from app.agents.runner import ResolvedAgentProvider
from tests.manual.serve_research_investigation import make_app
from tests.evals.matter_paths.corpus import dense_pdf,mixed_pdf
M='MAT-DEMO-BEACON'

class Scripted:
    def __init__(self,app):self.app=app
    async def complete(self,messages,tools=None):
        # Fixed fixture commands are deliberately NOT semantic evaluation.
        last=max(i for i,m in enumerate(messages) if m['role']=='user')
        text=messages[last]['content'];observations=[m for m in messages[last+1:] if m['role']=='tool']
        def call(name,args):return ProviderReply(tool_calls=[ProviderToolCall('fixture-'+str(len(observations)),name,args)])
        if not observations:return call('select_conversation_scope',{'scope':'scenario' if 'Explore' in text else 'actual','instruction_quote':text})
        paths=self.app.solution_paths.inspect(M)['paths'];main=self.app.solution_paths.state(M)
        if len(observations)==1:
            if text.startswith('Explore'):
                parent=next((p for p in paths if p['title']=='Bank design'),None) if 'timing' in text else None
                parent=parent or next(p for p in paths if p['scenario_id']==main['mainline_path_id'])
                return call('workspace_action',{'action':'explore_path','instruction_quote':text,'values':{'title':'Timing design' if 'timing' in text else 'Bank design','parent_path_id':parent['scenario_id'],'parent_revision':parent['revision'],'unresolved_conditions':['Bank agreement is pending.'],'proposed_fact_changes':[{'change_id':'custody','text':'Hypothesis: the bank holds funds.'}]}})
            if text.startswith('Compare'):
                return call('workspace_action',{'action':'compare_paths','values':{'path_ids':re.findall(r'SCN-[a-zA-Z0-9_-]+',text) or [p['scenario_id'] for p in paths[:3]]}})
            if text.startswith('Correct'):
                return call('workspace_action',{'action':'correct_fact','instruction_quote':text,'values':{'replacement':'Actual report: settlement takes two days.'}})
            if text.startswith('Read late'):
                return call('workspace_action',{'action':'search_local_sources','values':{'query':'RARE-BROWSER-99','limit':1}})
        if text.startswith('Read late') and len(observations)==2:
            hit=json.loads(observations[-1]['content'])['data']['hits'][0]
            return call('workspace_action',{'action':'read_local_source','values':{'source_id':hit['source_id'],'source_version':hit['source_version'],'unit_id':hit['unit_id']}})
        return ProviderReply(content='The bank design remains conditional on bank agreement. The former approach and its evidence remain available. Next: review the bank agreement.\n\n```working-memory\n'+json.dumps({'current_task':'Review the selected design.','open_items':[{'text':'Bank agreement is pending.','references':[]}],'next_action':'Read the bank agreement.'})+'\n```')

async def seed(app):
    app.solution_paths.ensure_baseline(M)
    for name,data in [('browser-dense.pdf',dense_pdf(100,'BROWSER')),('browser-scan.pdf',mixed_pdf())]:
        result=await app.ingestion.upload_to_matter(M,UploadFile(filename=name,file=io.BytesIO(data)))
        if name.endswith('scan.pdf'):await app.source_library.extract_or_resume(M,result['library_job_id'],page_number=20)

if __name__=='__main__':
    import uvicorn
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8137);parser.add_argument('--frontend-origin',default='http://localhost:3137');parser.add_argument('--resume-fixture',type=Path);parser.add_argument('--projection-conflict-once',action='store_true')
    args=parser.parse_args();vault=args.resume_fixture or Path(tempfile.mkdtemp(prefix='matter-paths-browser-'))/'vault'
    if args.resume_fixture:
        assert vault.parent.name.startswith('matter-paths-browser-') and vault.name=='vault'
    else:shutil.copytree(Path(__file__).resolve().parents[1]/'fixtures/vault',vault)
    app=AppContext(Settings(_env_file=None,vault_path=str(vault),scheduler_enabled=False,llm_provider='mock',llm_api_key=None,polaris_api_key=None,search_provider='disabled'))
    fixture=Scripted(app)
    app.runner.provider_resolver=lambda agent:ResolvedAgentProvider(fixture,ProviderSelection(agent.agent_id,'mock','fixture','low'))
    app.provider_router.resolve_selection=lambda selection:ResolvedAgentProvider(fixture,selection)
    async def blocked(*args,**kwargs):raise RuntimeError('Outbound research disabled in browser fixture.')
    from app.services import native_research
    native_research.discover=blocked
    from app.intelligence.fetch import SafeHttpFetcher
    SafeHttpFetcher.fetch_binary=blocked
    if args.projection_conflict_once:
        original_project=app.solution_paths._project
        def conflict_once(matter_id,receipt):
            app.solution_paths._project=original_project
            dossier=app.dossiers.get(matter_id)
            doc=app.vault.read_markdown(dossier['path'])
            app.vault.write_markdown(doc['path'],doc['content']+'\n\nLawyer edit during transition: preserve this sentence.\n',doc['metadata'])
            return original_project(matter_id,receipt)
        app.solution_paths._project=conflict_once
    if not args.resume_fixture:asyncio.run(seed(app))
    print('FIXTURE_VAULT='+str(vault),flush=True)
    uvicorn.run(make_app(app,args.frontend_origin),host='127.0.0.1',port=args.port)
