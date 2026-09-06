"""Explicit fictional acceptance records. Each completed step is recorded."""
import json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parents[1]/'backend'))
from isolation import isolated_settings
from app.runtime import AppContext
from app.models.api import DocumentReviewAction, MatterCreate
app=AppContext(isolated_settings()); env=json.loads((HERE/'environment.json').read_text())
assert 'themis-matter-a-' in str(app.vault.root)
mid,base=env['matter_id'],env['matter_path'];v=app.vault
steps=env.setdefault('workflow_fixtures',{})
def keep(name,value):
 steps[name]=value;(HERE/'environment.json').write_text(json.dumps(env,indent=2,default=str))
if 'conversation' not in steps:
 c=app.chat_history.append(mid,None,role='user',content='What must Product confirm before choosing the launch controls?',conversation_kind='matter')
 cid=c['conversation_id'];keep('conversation',cid)
 app.chat_history.append(mid,cid,role='assistant',content='Confirm audience age and the purpose of the persistent identifier. These facts determine the next analysis. Earlier fixture answer; no legal conclusion has been recorded.')
 app.chat_history.append(mid,cid,role='user',content='Keep the identifier question separate from audience age.')
 app.chat_history.append(mid,cid,role='assistant',content='Latest fixture answer: keep the audience and identifier questions separate. The supplied definitions explain child and persistent identifier terms [source:SRC-COPPA|Child]. Coverage and exceptions remain open.\n\nRead the [product specification]('+base+'/documents/product-spec.md).')
 v.update_markdown(base+'/matter.md',metadata_updates={'intake_conversation_id':cid,'intake_state':'complete'})
if 'roster' not in steps:
 keep('roster',app.workspace_team.configure({'enabled':True,'people':[{'person_id':'alex-morgan','display_name':'Alex Morgan'},{'person_id':'jamie-lee','display_name':'Jamie Lee'}],'expected_revision':app.workspace_team.roster()['revision'],'source_action_key':'demo-roster'}))
if 'review' not in steps:
 path=env['products'][0]['vault_path'];content=v.read_markdown(path)['content']
 app.document_reviews.apply(path,DocumentReviewAction(action='set_tracking',enabled=True))
 app.document_reviews.apply(path,DocumentReviewAction(action='save_revision',content=content.replace('before release.','before the US release.\n\nKeep the advertising use outside this launch.'),author_id='author-demo',author_name='Alex Morgan'))
 r=app.document_reviews.apply(path,DocumentReviewAction(action='add_comment',quote='Confirm audience',body='Confirm this point with Product before final review.',author_id='author-demo',author_name='Alex Morgan'));keep('review',{'path':path})
if 'flow' not in steps:
 f=app.workspace_flow.get(mid)
 keep('flow',app.workspace_flow.save(mid,{'matter_id':mid,'revision':f['revision'],'actors':[{'actor_id':'family','label':'Family account'},{'actor_id':'lumen','label':'Lumen service'},{'actor_id':'analytics','label':'Analytics processor'}],'edges':[{'edge_id':'learning','from_actor_id':'family','to_actor_id':'lumen','label':'Learning activity','order':1,'timing':'During a session','custody':'Lumen','ownership':'Product','uncertainty':'Audience age is unconfirmed'},{'edge_id':'events','from_actor_id':'lumen','to_actor_id':'analytics','label':'Device identifier and learning events','order':2,'timing':'After each event','custody':'Processor','ownership':'Engineering','uncertainty':'Retention period is unconfirmed'}]},expected_revision=f['revision']))
if 'historical_scenario' not in steps:
 s=app.workspace_scenarios.save(mid,{'title':'Historical adult-only launch option','issue_ids':[env['issue_ids'][0]],'proposed_fact_changes':[{'change_id':'adult-launch','text':'The launch audience is limited to adults.'}],'unresolved_conditions':['Product has not selected this option.'],'analysis':'An adult-only audience would change the audience analysis. This saved hypothetical is not an actual fact.','source_links':[]},source_action_key='demo-historical-scenario');keep('historical_scenario',s)
 app.matter_records.apply_update(mid,facts=[{'text':'Support will handle account recovery through the family account owner.','source_paths':[base+'/documents/product-spec.md']}])
if 'research' not in steps:
 path=base+'/research/supplied-definitions.md';v.write_markdown(path,'# Supplied definitions research\n\nThe fixture contains narrow definitions only. Applicability remains open.\n\n[Definitions]('+base+'/documents/coppa-definitions.md)\n',{'matter_id':mid,'title':'Supplied definitions research'})
 completed=app.research_runs.record_completed(mid,'What definitions are supplied?',path,source_action_key='demo-completed-research')
 partial=app.research_runs.record_completed(mid,'Which coverage questions remain open?',path,source_action_key='demo-partial-research')
 p=base+'/research/runs/'+partial['run_id']+'.md';v.update_markdown(p,metadata_updates={'state':'completed','status':'Partial research: a source was unavailable. The saved definitions remain useful.','error':'Acceptance fixture: source unavailable.'})
 keep('research',{'completed':completed['run_id'],'partial':partial['run_id']})
if 'duplicate' not in steps:
 keep('duplicate',app.work_products.create_draft(mid,title='Launch advice',content='# Launch advice\n\nAlternate saved draft for version and target checks.\n',source_action_key='demo-duplicate-advice'))
if 'empty_matter' not in steps:
 keep('empty_matter',app.matters.create(MatterCreate(title='Empty acceptance matter',request_text='Prepare a new product review.',legal_owner='Alex Morgan',business_owner='Sam Patel',source_action_key='demo-empty-matter'))['matter_id'])
print(json.dumps({k:(x if isinstance(x,str) else 'prepared') for k,x in steps.items()}))
