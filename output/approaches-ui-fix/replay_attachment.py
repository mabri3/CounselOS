import json,time,uuid
from pathlib import Path
import httpx,yaml
base='http://127.0.0.1:8000/api/matters/MAT-20260909-d89ad8'
out=Path('output/approaches-ui-fix')
run=Path('Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260911-88942f.md')
data=yaml.safe_load(run.read_text().split('\n---\n',1)[0].removeprefix('---\n'))
request=data['request']
request['source_action_key']='attachment-repair:'+str(uuid.uuid4())
with httpx.Client(timeout=90) as client:
 before=client.get(base+'/workspace/paths').json()
 (out/'attachment-before.json').write_text(json.dumps(before,indent=2))
 r=client.post(base+'/chat-runs',json=request);r.raise_for_status()
 result=r.json();identity=result['run_id']
 print('Started',identity,flush=True)
 for _ in range(50):
  time.sleep(6)
  r=client.get(base+'/chat-runs/'+identity);r.raise_for_status();result=r.json()
  if result['state'] in ('completed','failed','cancelled'):
   break
 (out/'attachment-replay-result.json').write_text(json.dumps(result,indent=2))
 after=client.get(base+'/workspace/paths').json()
 (out/'attachment-after.json').write_text(json.dumps(after,indent=2))
 print('Finished',result['state'],result.get('status'),flush=True)
 print('Paths',[(p['title'],p['scenario_id']) for p in after['paths']],flush=True)
 assert after['state']==before['state'],'Direction changed'
 for p in after['paths']:
  if p['scenario_id'] not in {x['scenario_id'] for x in before['paths']}:
   note=client.get(base+'/workspace/paths/'+p['scenario_id']+'/memory').json()
   (out/'attachment-saved-note.json').write_text(json.dumps(note,indent=2))
   print('New note',note.get('state'),bool(note.get('payload')),flush=True)
