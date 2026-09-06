import json,sys
from pathlib import Path
H=Path(__file__).resolve().parent;sys.path.insert(0,str(H.parents[1]/'backend'))
from isolation import isolated_settings
from app.runtime import AppContext
app=AppContext(isolated_settings());e=json.loads((H/'environment.json').read_text());s=e['workflow_fixtures'];m=e['matter_id'];base=e['matter_path']
if 'comparison' not in s:
 v=app.vault;p=base+'/documents/product-spec-revised.md'
 v.write_markdown(p,'# Revised Lumen product specification\n\nAudience age remains unconfirmed.\n\nThe persistent identifier is deleted after 30 days. Advertising remains outside launch scope.\n',{'matter_id':m,'title':'Revised Lumen product specification','record_type':'source','immutable':True,'source_id':'SRC-LUMEN-REVISED','support_state':'supplied'})
 c=app.change_impact.candidates(m);before=next(x for x in c['sources'] if x['path'].endswith('/product-spec.md'));after=next(x for x in c['sources'] if x['path']==p)
 s['comparison']=app.change_impact.prepare(m,{'before':before,'after':after,'targets':c['targets'][:1],'business_question_revision':app.workspace.business_question(m)['revision'],'source_action_key':'demo-comparison'},actor=app.workspace_team.resolve_actor('alex-morgan'))
 (H/'environment.json').write_text(json.dumps(e,indent=2,default=str))
 print(s['comparison']['comparison_id'])
