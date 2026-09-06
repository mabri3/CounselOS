import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'backend'))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import MatterCreate, WorkItemCreate
ENV=json.loads((Path(__file__).parent/'environment.json').read_text())
from isolation import isolated_settings
assert not ENV.get("matter_id"), "Fixture exists; inspect IDs before rerun"
app=AppContext(isolated_settings())
m=app.matters.create(MatterCreate(title="Lumen Learning: US family launch with analytics and shared-device accounts",request_text="Can Lumen launch its commercial US learning app with analytics for families? Audience age and shared-device behavior need review.",legal_owner="Alex Morgan",business_owner="Sam Patel",jurisdiction_scope=["United States"],source_action_key="decision-map-demo"))
mid=m['matter_id']; base=app.matters.matter_path(mid); v=app.vault
v.update_markdown(base+'/matter.md',metadata_updates={'status':'explore','intake_state':'completed','active_agent_id':'counsel-copilot'})
v.write_markdown(base+'/dossier.md',"# Matter dossier\n\n## Decision question\n\nCan Lumen launch its US family learning app with analytics?\n\n## Working recommendation\n\nConfirm audience and identifier use before choosing the launch controls.\n",{'matter_id':mid})
titles=["Audience age and the proposed launch to families with children younger than thirteen", "Persistent analytics identifiers on shared devices", "Parental notice and consent before collection", "Data retention and deletion requests", "Vendor use of learning events for its own advertising", "Support access and account recovery"]
v.write_markdown(base+'/issues.md','# Issues\n\n'+'\n'.join('- '+x for x in titles),{'matter_id':mid})
issues=app.workspace.issues(mid)
for i,node in enumerate(issues):
 node['why_it_matters']=['Audience changes which launch controls require legal review.','A device identifier can connect learning activity over time.','The team needs an implementation choice before release.','Retention affects the data remaining after a family leaves.','Vendor use may differ from the team’s stated product purpose.','Support needs a usable process without unnecessary disclosure.'][i]
app.workspace.save_issues(mid,issues,expected_revision=app.workspace.issues_revision(mid))
v.write_markdown(base+'/documents/product-spec.md','# Lumen product specification\n\n## Audience\n\nThe proposed US service is commercial. Product has not confirmed the minimum user age.\n\n## Analytics\n\nThe app uses a persistent device identifier across sessions. No advertising vendor has been selected.\n',{'matter_id':mid,'title':'Lumen product specification','record_type':'source','immutable':True,'source_id':'SRC-LUMEN-SPEC','support_state':'supplied'})
v.write_markdown(base+'/documents/coppa-definitions.md','# 16 CFR 312.2 — supplied fixture definitions\n\nSource: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2\nSupplied acceptance fixture text. This is not a verified legal source.\n\n## Child\n\nChild means an individual under the age of 13.\n\n## Personal information (7)\n\nA persistent identifier that can be used to recognize a user over time and across different websites or online services.\n',{'matter_id':mid,'title':'16 CFR 312.2 — definitions','record_type':'source','immutable':True,'source_id':'SRC-COPPA','support_state':'supplied'})
app.matter_records.apply_update(mid,facts=[{'text':'Lumen plans a commercial online learning service in the United States.','source_paths':[base+'/documents/product-spec.md']},{'text':'The product uses a persistent device identifier across sessions.','source_paths':[base+'/documents/product-spec.md']}])
products=[]
for index,title in enumerate(['Launch advice','Product control checklist','Business reply']):
 products.append(app.work_products.create_draft(mid,title=title,content='# '+title+'\n\nConfirm audience and identifier use before release.\n\nRead the [product specification]('+base+'/documents/product-spec.md) and [definitions]('+base+'/documents/coppa-definitions.md).\n',source_action_key='demo-draft-'+str(index)))
app.matters.create_work_item(WorkItemCreate(matter_id=mid,title='Review audience and identifier controls before launch',owner='Alex Morgan',required=True,issue_id=issues[0]['issue_id'],source_action_key='demo-review-work'))
ENV.update(matter_id=mid,matter_path=base,issue_ids=[x['issue_id'] for x in issues],products=products)
(Path(__file__).parent/'environment.json').write_text(json.dumps(ENV,indent=2,default=str))
print(mid,base)
