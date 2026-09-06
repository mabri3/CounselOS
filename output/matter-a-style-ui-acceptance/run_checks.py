"""Coordinator check ledger. Run only on a stable combined implementation."""
import json,os,subprocess,sys,time
from pathlib import Path
H=Path(__file__).resolve().parent;ROOT=H.parents[1]
checks=[('typecheck','frontend',['npm','run','typecheck']),('single-lawyer','frontend',['npm','run','check:single-lawyer-workspace']),('review-map','frontend',['npm','run','check:matter-review-decision-map']),('workspace-ux','frontend',['npm','run','check:workspace-ux']),('continuity','frontend',['npm','run','check:lawyer-continuity']),('accordion','frontend',['node','--experimental-strip-types','scripts/check-middle-pane-accordion.ts']),('matter-a-navigation','frontend',['node','--experimental-strip-types','scripts/check-matter-a-navigation.ts']),('build','frontend',['npm','run','build']),('backend','backend',['.venv/bin/pytest'])]
chosen=set(sys.argv[1:]);ledgerpath=H/'checks.json';ledger=json.loads(ledgerpath.read_text()) if ledgerpath.exists() else []
for label,cwd,cmd in checks:
 if chosen and label not in chosen:continue
 env=os.environ.copy()
 if label=='build':env.update(NODE_OPTIONS='--require ../output/matter-a-style-ui-acceptance/isolated-build.cjs',MATTER_A_DIST='.next-matter-a-build',NEXT_PUBLIC_API_BASE_URL='http://localhost:8123/api')
 started=time.time();stamp=time.strftime('%Y%m%d-%H%M%S');log=H/f'{label}-{stamp}.log'
 with log.open('w') as f:r=subprocess.run(cmd,cwd=ROOT/cwd,env=env,stdout=f,stderr=subprocess.STDOUT)
 row={'label':label,'cwd':cwd,'command':cmd,'exit':r.returncode,'seconds':round(time.time()-started,2),'log':str(log.relative_to(ROOT))};ledger=json.loads(ledgerpath.read_text()) if ledgerpath.exists() else [];ledger.append(row);ledgerpath.write_text(json.dumps(ledger,indent=2));print(json.dumps(row),flush=True)
