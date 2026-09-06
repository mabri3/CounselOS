"""Synthetic inputs only. Analysis must enter through production providers/services."""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'backend'))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import MatterCreate, WorkItemCreate
from app.models.workspace import WorkspaceQuestion
out = Path(__file__).parent
E = json.loads((out / 'environment.json').read_text())
ctx = AppContext(Settings(vault_path=E['vault'], scheduler_enabled=False, llm_provider='mock', search_provider='disabled', polaris_api_key=None))
m = ctx.matters.create(MatterCreate(title='Harbor sandbox: release timing', request_text='Which release path can Harbor use under its fictional supplier contract? Screening timing is unknown. Compare delayed release and a limited pilot.', legal_owner='Alex Morgan', business_owner='Sam Patel', source_action_key='map-redesign-inputs'))
mid=m['matter_id'];base=ctx.matters.matter_path(mid)
ctx.vault.update_markdown(base+'/matter.md',metadata_updates={'status':'explore','intake_state':'completed','active_agent_id':'counsel-copilot'})
ctx.vault.write_markdown(base+'/dossier.md','# Matter dossier\n\n## Decision question\n\nWhich release path can Harbor use under its fictional supplier contract?\n',{'matter_id':mid})
nodes=[
 {'issue_id':'ISS-TIMING','title':'Screening before release','why_it_matters':'The order of screening and release changes the available launch path.','lawyer_state':'open'},
 {'issue_id':'ISS-PILOT','title':'A limited pilot with a long title about the vendor exception and the operational work required before a wider rollout','why_it_matters':'A pilot may preserve learning while limiting the first release.','lawyer_state':'open'},
 {'issue_id':'ISS-UNMAPPED','title':'Support access','why_it_matters':'Support needs an access process.','lawyer_state':'open'}]
ctx.vault.write_markdown(base+'/issues.md','# Issues\n\n'+'\n'.join('- '+n['title']+' <!-- issue:'+n['issue_id']+' -->' for n in nodes),{'matter_id':mid,'issue_nodes':{n['issue_id']:n for n in nodes}})
source=base+'/documents/fictional-supplier-contract.md'
ctx.vault.write_markdown(source,'# Fictional supplier contract\n\n## Section 4 — Release\n\nThe operator must complete screening before releasing a payment. A limited pilot of at most ten test accounts may use manual screening. This exception does not waive screening.\n\n## Section 5 — Audit\n\nThe operator keeps a dated screening record.\n',{'matter_id':mid,'source_id':'SRC-FICTIONAL','title':'Fictional supplier contract','record_type':'source','support_state':'supplied','immutable':True})
ctx.matter_records.apply_update(mid,facts=[{'text':'Product has not confirmed whether screening completes before release.','source_paths':[source]}])
q=ctx.workspace.business_question(mid)
ctx.workspace.save_question(mid, WorkspaceQuestion(question_id='Q-SCREENING',business_question_id=q['question_id'],business_question_revision=q['revision'],issue_id='ISS-TIMING',issue_ids=['ISS-TIMING','ISS-PILOT'],text='Does screening complete before release?'))
ctx.matters.create_work_item(WorkItemCreate(matter_id=mid,title='Confirm screening timing',owner='Sam Patel',required=True,issue_id='ISS-TIMING',source_action_key='map-screening-work'))
for title in ['Launch note','Pilot checklist','Business reply']:
 ctx.work_products.create_draft(mid,title=title,content='# '+title+'\n\nReview screening timing before choosing a release path.\n',source_action_key='map-draft-'+title.replace(' ','-'))
ctx.index.rebuild()
E.update(matter_id=mid,matter_path=base,issue_ids=['ISS-TIMING','ISS-PILOT','ISS-UNMAPPED'],source_path=source)
(out/'environment.json').write_text(json.dumps(E,indent=2))
print(json.dumps({'matter_id':mid,'issue_ids':E['issue_ids'],'analysis_seeded':False}))
