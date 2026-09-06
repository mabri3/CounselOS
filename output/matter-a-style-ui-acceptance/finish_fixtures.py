import json,sys
from pathlib import Path
H=Path(__file__).resolve().parent;sys.path.insert(0,str(H.parents[1]/'backend'))
from isolation import isolated_settings
from app.runtime import AppContext
app=AppContext(isolated_settings());e=json.loads((H/'environment.json').read_text());s=e['workflow_fixtures'];m=e['matter_id'];base=e['matter_path']
def keep(k,v):
 s[k]=v;(H/'environment.json').write_text(json.dumps(e,indent=2,default=str))
if 'handoff' not in s:
 keep('handoff',app.workspace_team.create_handoff(m,{'scope':app.workspace_team.scope(m),'recipient_id':'jamie-lee','ask':'Review the audience and identifier questions. Keep advertising outside this launch.','current_basis':'Supplied product specification and the saved working answer.','open_questions':['Audience age is unconfirmed.'],'references':[],'source_action_key':'demo-prepared-handoff'},actor=app.workspace_team.resolve_actor('alex-morgan')))
if 'final_product' not in s:
 keep('final_product',app.work_products.finalize(m,s['duplicate']['vault_path']))
if 'answered_question' not in s:
 q={'question_id':'Q-DEMO-SUPPORT','business_question_id':app.workspace.business_question(m)['question_id'],'business_question_revision':app.workspace.business_question(m)['revision'],'issue_ids':[e['issue_ids'][5]],'question_kind':'factual','text':'Who handles family account recovery?','answer':'Support contacts the family account owner.','state':'answered','source_paths':[base+'/documents/product-spec.md']}
 keep('answered_question',app.workspace.save_question(m,q))
c=app.change_impact.candidates(m)
(H/'comparison-candidates.json').write_text(json.dumps(c,indent=2,default=str))
print('Fixture steps:',list(s));print('Comparison candidates:',[(k,len(v) if isinstance(v,list) else type(v).__name__) for k,v in c.items()])
