from server import *
from app.services.workspace import digest
mid=E['matter_id'];issue=E['issue_ids'][0];svc=context.issue_analysis
capture=svc.capture(mid,issue);run='RUN-acceptance-supported';text='Audience age changes the launch path. The saved definition alone does not establish coverage.';path=E['matter_path']+'/inquiries/'+run+'.md';revision=digest(text)
context.vault.write_markdown(path,text,{'record_type':'workspace_inquiry','matter_id':mid,'run_id':run,'output_revision':revision})
structure={'issue_analysis':{'issue_id':issue,'display_title':'Audience coverage','explanation':text,'business_effect':'The launch may need audience controls.','tests':[{'test_id':'age','title':'Audience coverage','condition_ids':['child']}],'conditions':[{'condition_id':'child','question':'Will the launch include children under 13?','assessment':'unknown'}],'options':[{'option_id':'covered','title':'Prepare child-audience controls','requirements':[{'condition_id':'child','state':'met'}],'combination':'all'},{'option_id':'adult','title':'Limit launch to an adult audience','requirements':[{'condition_id':'child','state':'not_met'}],'combination':'all'}]}}
claims=context.workspace._document(mid,'workspace.md')['metadata']['claims']
for claim in claims:
 claim['output_revision']=revision
 for evidence in claim.get('evidence',[]): evidence['output_revision']=revision
structure['issue_analysis']['tests'][0]['claim_ids']=[claims[0]['claim_id']]
structure['issue_analysis']['options'][0]['claim_ids']=[claims[0]['claim_id']]
context.vault.update_markdown(path,metadata_updates={'claims':claims})
print(svc.publish(mid,path=path,run_id=run,output_revision=revision,structure=structure,capture=capture,claims=claims))
context.index.rebuild()
