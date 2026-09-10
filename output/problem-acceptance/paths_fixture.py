from server import *
from app.services.workspace import digest
mid=E['matter_id'];issue=E['issue_ids'][0];svc=context.issue_analysis
capture=svc.capture(mid,issue);run='RUN-acceptance-paths';text='Audience age changes the launch path. The saved definition alone does not establish coverage.';path=E['matter_path']+'/inquiries/'+run+'.md';revision=digest(text)
context.vault.write_markdown(path,text,{'record_type':'workspace_inquiry','matter_id':mid,'run_id':run,'output_revision':revision})
structure={'issue_analysis':{'issue_id':issue,'display_title':'Audience coverage','explanation':text,'business_effect':'The launch may need audience controls.','tests':[{'test_id':'age','title':'Audience coverage','condition_ids':['child']}],'conditions':[{'condition_id':'child','question':'Will the launch include children under 13?','assessment':'unknown'}],'options':[{'option_id':'covered','title':'Prepare child-audience controls','requirements':[{'condition_id':'child','state':'met'}],'combination':'all'},{'option_id':'adult','title':'Limit launch to an adult audience','requirements':[{'condition_id':'child','state':'not_met'}],'combination':'all'}]}}
print(svc.publish(mid,path=path,run_id=run,output_revision=revision,structure=structure,capture=capture))
context.index.rebuild()
