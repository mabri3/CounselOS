"""Scripted browser plumbing stories, not model-judgment evidence."""
from serve_fixture import *
from app.models.api import DecisionCreate
from app.providers.base import ProviderToolCall
stories={}
for story in ('A','B','C'):
 m=context.matters.create(MatterCreate(title='Synthetic story '+story,request_text='Synthetic '+story+' acceptance exercise.'))
 stories[story]=m['matter_id']
 context.matters.move_stage(m['matter_id'],'explore')
 context.matter_records.apply_update(m['matter_id'],facts=[{'text':'Internal-only use was reported.' if story=='A' else 'Fictional exercise. All activity is in Alder.'}],actor='Lawyer')
decision=context.decisions.record(DecisionCreate(matter_id=stories['B'],title='Synthetic earlier pilot decision',chosen_path='Allow under fictional 2025 rule.',rationale='Fixture only.',decision_maker='Synthetic lawyer'))
class StoryProvider:
 async def complete(self,messages,tools=None):
  last=max(i for i,m in enumerate(messages) if m.get('role')=='user')
  prompt=messages[last]['content'];observations=messages[last+1:]
  calls=[m for m in observations if m.get('role')=='tool']
  def call(name,args):return ProviderReply(tool_calls=[ProviderToolCall(id='story-'+str(len(calls)),name=name,arguments=args)])
  if not calls:return call('select_conversation_scope',{'scope':'scenario' if 'synthetic chats instead' in prompt else 'actual','instruction_quote':prompt})
  if 'Can we use customer chats' in prompt and not any(m.get('name')=='update_matter_intake' for m in calls):
   return call('update_matter_intake',{'working_ask':'Improve support with a pilot next month.','reported_facts':[{'statement':x} for x in ['Chats are collected.','Chats are retained.','Internal evaluation is proposed.','Vendor processing is proposed.','Vendor reuse is unresolved.']],'intake_state':'complete'})
  corrected='earlier description' in prompt
  if corrected and not any(m.get('name')=='workspace_action' for m in calls):
   fact=next(f for f in context.matter_records.get(stories['A'])['facts'] if f['text']=='Internal-only use was reported.')
   return call('workspace_action',{'action':'correct_fact','values':{'fact_id':fact['fact_id'],'replacement':'The vendor retains the chats and uses them to train its general model.'}})
  p=payload();p['proposed_method']='Use customer chats in a support pilot.';p['next_step']='Inspect the vendor terms because reuse can change the pilot.'
  if corrected:
   p['integrated_answer']='Withdraw internal-only reliance. Evaluate vendor training separately; use a no-training service if possible.'
   p['changes']=[{'kind':'assessment_changed','prior_question_keys':['purpose'],'current_question_keys':['purpose'],'reason':'The lawyer corrected the internal-only report.','answer_effect':p['integrated_answer']}]
  elif 'synthetic chats instead' in prompt:p['integrated_answer']='Hypothetical only: synthetic chats could avoid customer-content reuse. Validate that no real customer content remains.'
  elif 'fictional amendment' in prompt:
   p['objective']='Run the Alder pilot';p['parts'][0]['label']='Vendor training in Alder';p['questions'][0].update(question='Does the effective Alder approval rule apply?',kind='applicability',assessment='Effective September 15; the October 1 identifiable-data pilot is covered. The synthetic-data exception does not apply.',references=[{'kind':'decision','record_id':decision['decision_id']}]);p['integrated_answer']='Revisit the earlier decision before vendor training. Seek pilot approval or use genuinely synthetic data. This is fictional law.'
  elif 'Birch' in prompt:
   p['objective']='Run the Alder pilot';p['integrated_answer']='No material change: Birch has no connection to the supplied activity. The Alder proposal has no final effective date and creates no present obligation. Keep the earlier recorded decision unchanged.';p['changes']=[{'kind':'no_material_change','prior_question_keys':['purpose'],'current_question_keys':['purpose'],'reason':'Different jurisdiction and unfinalized proposal.','answer_effect':'The effective Alder approval question remains.'}]
  elif 'instant earnings access' in prompt:
   p['objective']='Provide funds before payday';p['proposed_method']='Recourse advances recovered by payroll deduction.';p['framing_note']='The business label does not determine whether this is credit.';p['questions'][0].update(question='Does the combined recourse arrangement fit the partner permission?',kind='characterization',assessment='Personal recourse and the charge are differentiating facts. Separate component permissions do not resolve the combined arrangement.');p['integrated_answer']='Keep the combined launch conditional on license scope and failed-deduction liability. A nonrecourse design may address the recovery condition but still needs scope review.'
  p['alternative_paths']=[{'title':'Change the design','proposed_change':'Remove the unresolved reuse or recourse feature.','benefit':'Preserves the main business objective.','tradeoff':'May reduce functionality.','remaining_condition':'Confirm the changed design and its scope.'}]
  return ProviderReply(content='Scripted fixture answer. '+p['integrated_answer']+'\n```problem-analysis\n'+json.dumps(p)+'\n```')
context.runner.provider=StoryProvider()
@app.get('/fixture-stories')
def snapshot():return {'stories':stories,'decision':decision,'states':{k:context.problem_analysis.resolve(mid) for k,mid in stories.items()},'records':{k:context.matter_records.get(mid) for k,mid in stories.items()},'decisions':context.decisions.list()}
context.index.rebuild()
(root/'output/problem-decomposition/stories-fixture.json').write_text(json.dumps({'vault':str(vault),'stories':stories,'decision':decision},indent=2,default=str))
if __name__=='__main__':
 import uvicorn
 uvicorn.run(app,host='127.0.0.1',port=8136)
