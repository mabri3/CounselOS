import json,time,uuid
from pathlib import Path
import httpx,yaml
base='http://127.0.0.1:8000/api/matters/MAT-20260909-d89ad8'
out=Path('output/approaches-ui-fix')
run=Path('Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260911-d414b0.md')
data=yaml.safe_load(run.read_text().split('\n---\n',1)[0].removeprefix('---\n'))
request=data['request']
request['source_action_key']='research-access-repair:'+str(uuid.uuid4())
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
 (out/'research-access-result.json').write_text(json.dumps(result,indent=2))
 print('Finished',result['state'],result.get('status'),flush=True)
 print(json.dumps(result.get('response'),indent=2),flush=True)
