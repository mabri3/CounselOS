import json,hashlib,pathlib,re,datetime,collections,sys
sys.path.insert(0,str(pathlib.Path.cwd()/"backend"))
import frontmatter
root=pathlib.Path.cwd(); out=root/'output/uiphase2-implementation'
def sha(p):
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def compare(d):
 return [{'path':p,'before':h,'current':sha(root/p),'state':'missing' if not (root/p).is_file() else 'changed'} for p,h in d.items() if sha(root/p)!=h]
protected=json.loads((out/'protected-before.json').read_text()); roots=sorted({str(pathlib.Path(p).relative_to(root).parts[0]) for p in protected if '/.counsel-os/' not in p})
new=[]
for r in roots:
 new.extend(str(p) for p in (root/r).rglob('*') if p.is_file() and str(p) not in protected)
plan=(root/'docs/uiphase2-a-style-ui.handoff-prompt.md').read_text(); ownership=set(re.findall(r'`([^`]+)`',plan[plan.index('| F Foundation'):plan.index('No worker owns')]))
ownership|={'current.md','CODEX_HANDOFF.md','docs/DESIGN_LANGUAGE.md','docs/uiphase2-a-style-ui.handoff-plan.md','docs/uiphase2-a-style-ui.handoff-progress.md','docs/uiphase2-a-style-ui.handoff-prompt.md','frontend/next.config.ts','frontend/scripts/check-initial-load-integrity.ts','frontend/scripts/check-provider-admin.ts','frontend/next-env.d.ts','frontend/tsconfig.tsbuildinfo'}
base=json.loads((out/'baseline-hashes.json').read_text()); excluded=lambda p:p.startswith(('graphify-out/','output/','frontend/.next')) or p in {'frontend/next-env.d.ts','frontend/tsconfig.tsbuildinfo'}
eligible={p:h for p,h in base.items() if p not in ownership and not excluded(p)}
scenario=out/'test-root/vault/03_Matters/project-apex-ai/scenarios/SCN-aa831078a9d7760d321e9822.md'; expected=re.search(r'03_Matters/project-apex-ai/facts.md: ([a-f0-9]+)',scenario.read_text()).group(1); post=frontmatter.loads((out/'test-root/vault/03_Matters/project-apex-ai/facts.md').read_text()); actual=hashlib.sha256(json.dumps({'content':post.content,'metadata':post.metadata},sort_keys=True,default=str).encode()).hexdigest()
log=(out/'backend.log').read_text().splitlines(); source_requests=[]
for n,line in enumerate(log,1):
 m=re.search(r'"(GET|POST|PUT|PATCH|DELETE) ([^ ]+) HTTP',line)
 if m and any(k in m[2] for k in ('/source','/evidence','/facts','/context')): source_requests.append({'line':n,'method':m[1],'path':m[2]})
audit={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'protected':{'checked':len(protected),'roots':roots,'differences':compare(protected),'new_paths':new},'outside_ownership':{'checked':len(eligible),'differences':compare(eligible),'excluded':'Phase 2 ownership from section 8 plus assigned focused checks and section 14 handoff/design context updates; graphify-out/**; output/**; frontend/.next* generated builds; next-env.d.ts; tsconfig.tsbuildinfo. Baseline covers existing paths only.','ownership':sorted(ownership)},'scenario_facts':{'scenario_id':scenario.stem,'expected':expected,'current':actual,'unchanged':expected==actual,'method':'workspace.source_revisions canonical content+metadata digest; these facts metadata contain no excluded continuity fields'},'map_decisions':{'checked':len(json.loads((out/'map-records-before.json').read_text())),'differences':compare(json.loads((out/'map-records-before.json').read_text()))},'source_view_log':{'requests':source_requests,'limit':'Access log has no interaction IDs. GET source/evidence requests demonstrate reads, but cannot prove that each source click caused no other request. Hash checks independently verify the listed facts and decision records.'}}
(out/'protection-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
parent='01a075a8-3f68-75e2-89b6-bee126406207'; routing=[]
for p in pathlib.Path('/Users/bharris/.codex/sessions/2026/09/06').glob('*.jsonl'):
 meta=json.loads(p.open().readline()).get('payload',{}); src=meta.get('source'); spawn=src.get('subagent',{}).get('thread_spawn',{}) if isinstance(src,dict) else {}
 if meta.get('id')!=parent and spawn.get('parent_thread_id')!=parent:continue
 contexts=[]
 for line in p.open():
  try:d=json.loads(line)
  except:continue
  if d.get('type')=='turn_context':
   q=d['payload']; v={'model':q.get('model'),'effort':q.get('effort')}
   if v not in contexts:contexts.append(v)
 routing.append({'agent':spawn.get('agent_path','/root'),'session_id':meta.get('id'),'log':str(p),'observed_routing':contexts})
(out/'actual-routing.json').write_text(json.dumps(routing,indent=2)+'\n')
lines=['# Protection audit','',f"Checked at {audit['at']}.",'',f"Protected files: {len(protected)} checked; {len(audit['protected']['differences'])} changed or missing; {len(new)} new paths under the two real vault roots.",f"Outside Phase 2 ownership: {len(eligible)} baseline files checked; {len(audit['outside_ownership']['differences'])} changed or missing.",'',audit['outside_ownership']['excluded'],'',f"Apex scenario facts unchanged: {expected==actual}. Map decision hashes: {len(audit['map_decisions']['differences'])} differences.",'',audit['source_view_log']['limit'],'',f"Routing: {len(routing)} task sessions read. Exact model and effort values are in actual-routing.json. No prompt or credential data was copied.",'','## Differences','']
for group in ['protected','outside_ownership']:
 for d in audit[group]['differences']:lines.append(f"- {group}: {d['state']} `{d['path']}`")
for p in new:lines.append(f'- New protected path: `{p}`')
(out/'protection-audit.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'protected_differences':len(audit['protected']['differences']),'new_paths':len(new),'outside_differences':audit['outside_ownership']['differences'],'facts_unchanged':expected==actual,'map_differences':audit['map_decisions']['differences'],'sessions':routing},indent=2))
