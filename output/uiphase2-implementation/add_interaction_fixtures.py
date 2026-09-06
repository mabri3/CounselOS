from isolated_server import ROOT, VAULT, TEST_ROOT, isolated_settings
from app.runtime import AppContext
from app.models.api import ScheduleCreate
import json
assert VAULT.resolve().is_relative_to(TEST_ROOT.resolve())
a=AppContext(isolated_settings())
# All entries below are stored synthetic states, not claimed browser actions.
for day in ['2026-09-05','2026-09-06']:
 try: messages=a.chat_history.get_daily(day)['messages']
 except FileNotFoundError: messages=[]
 if not messages:
  a.chat_history.append_daily(day,role='user',content='Which release process needs an owner? (Synthetic test conversation.)')
  a.chat_history.append_daily(day,role='assistant',content='The supplied process assigns review to Operations. Confirm the individual owner and current version. This is a stored process-only test answer.')
mid='MAT-DEMO-APEX'; notes=a.annotations.list(mid)
if not any(n['question']=='Which team member performs this review?' for n in notes):
 n=a.annotations.create(mid,source_path='03_Matters/project-apex-ai/research/phase2-process.md',citation='[1]',quote='Operations reviews the request before release.',question='Which team member performs this review?',who='Lawyer (synthetic test)')
 notes=a.annotations.list(mid)
 for n in notes:
  if n['question']=='Which team member performs this review?': n.update(answer='The supplied passage names Operations, but it does not name an individual owner.',answered=True,answered_at=n['created_at'])
 a.annotations._write(mid,notes)
 a.annotations.create(mid,source_path='03_Matters/project-apex-ai/research/phase2-process.md',citation='[2]',quote='The owner records the version used for review.',question='Which version applies to this request?',who='Lawyer (synthetic test)')
if not any(x['agent_id']=='phase2-process' for x in a.agents.list()):
 a.agents.create(agent_id='phase2-process',name='Process helper (test)',description='Summarize supplied process notes.',instructions='Summarize the supplied operational process. Do not invent missing owners.',allowed_tools=['read_file'],max_steps=6,provider='mock')
for state in ['failed','running','paused']:
 title='Synthetic '+state+' process check'
 existing=next((x for x in a.scheduler.list() if x['title']==title),None)
 if not existing:
  r=a.scheduler.create(ScheduleCreate(title=title,agent_id='phase2-process',instructions='Summarize the supplied process note.',enabled=state!='paused'))
 else: r=existing
 d=a.vault.read_markdown(r['path']); meta=d['metadata'];meta.update(last_status='failed' if state=='failed' else 'running' if state=='running' else 'success',last_message='Synthetic stored run state; scheduler disabled.',last_run_at='2026-09-06T00:00:00+00:00');a.vault.write_markdown(r['path'],d['content'],meta)
a.index.rebuild();print('Synthetic interaction fixtures prepared.')
