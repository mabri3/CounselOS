"""Complete the synthetic acceptance inputs; no analysis/option fixture writes."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'backend'))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import DecisionCreate
out=Path(__file__).parent;E=json.loads((out/'environment.json').read_text())
ctx=AppContext(Settings(vault_path=E['vault'],scheduler_enabled=False,llm_provider='mock',search_provider='disabled',polaris_api_key=None))
assert str(ctx.vault.root)==str(Path(E['vault']).resolve())
base=E['matter_path'];mid=E['matter_id']
f=ctx.vault.read_markdown(base+'/issues.md');nodes=f['metadata']['issue_nodes']
for id,title in [('ISS-AUDIT','Keep a dated screening record'),('ISS-RETENTION','Retention of pilot test records'),('ISS-OWNER','Who owns the release checklist?')]:
 nodes.setdefault(id,{'issue_id':id,'title':title,'why_it_matters':'The release team needs a clear operating step.','lawyer_state':'open'})
ctx.vault.update_markdown(base+'/issues.md',metadata_updates={'issue_nodes':nodes})
ctx.vault.write_markdown(base+'/documents/fictional-pilot-spec.md','# Fictional pilot specification\n\nThe pilot covers no more than ten test accounts. Product has not yet confirmed the screening timing.\n',{'matter_id':mid,'source_id':'SRC-PILOT','title':'Fictional pilot specification','record_type':'source','support_state':'supplied','immutable':True})
d=ctx.decisions.record(DecisionCreate(matter_id=mid,title='Earlier record: use test accounts',chosen_path='Use test accounts for preparation.',decision_maker='Alex Morgan',source_action_key='map-legacy-test-input'))
ctx.index.rebuild();E['issue_ids']=list(nodes);E['legacy_decision_id']=d['decision_id'];(out/'environment.json').write_text(json.dumps(E,indent=2))
print(json.dumps({'issues':len(nodes),'source_count':2,'legacy_decision_id':d['decision_id'],'analysis_seeded':False}))
