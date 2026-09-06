from pathlib import Path
import re,json
r=Path.cwd();o=r/'output/matter-a-style-ui-acceptance'; plan=(r/'docs/matter-a-style-ui.handoff-plan.md').read_text(); base={}; owners={}
for line in plan.splitlines():
 if re.match(r'\| C[1-9] ',line):
  cells=line.split('|'); cid=cells[1].split()[0]; paths=re.findall(r'`([^`]+)`',cells[2]);
  if not paths: continue
  owners[cid]=[p.replace('w/','frontend/components/workspace/') for p in paths]
for paths in owners.values():
 for p in paths:
  if (r/p).is_file():base[p]=(r/p).read_text()
(o/'baseline-owned-source.json').write_text(json.dumps(base,indent=2))
(o/'ownership.json').write_text(json.dumps(owners,indent=2))
alltsx=list((r/'frontend').glob('components/**/*.tsx'))+list((r/'frontend').glob('app/**/*.tsx'))
common=plan[plan.index('## 3. Frozen behavior contracts'):plan.index('## 5. Screen-by-screen')]
sections={'C1':['5.1','5.2'],'C2':['5.4','5.5'],'C3':['5.3'],'C4':['5.9'],'C5':['5.10'],'C6':['5.7','5.11'],'C7':['5.6'],'C8':['5.8'],'C9':['4.3','4.4','5.1','5.4','5.8']}
images={'C1':['01-understand','02-issue'],'C2':['04-draft','05-source'],'C3':['03-discuss'],'C4':['10-tools','12-compare'],'C5':['11-business','12-compare'],'C6':['07-scenario','09-explore'],'C7':['06-map','07-scenario'],'C8':['08-work'],'C9':['01-understand','04-draft','08-work','10-tools']}
examples={line.split(':')[0][2:]:line for line in plan.splitlines() if re.match(r'- C[1-9]:',line)}
for cid,paths in owners.items():
 call=[]
 for f in alltsx:
  if str(f.relative_to(r)) in paths:continue
  ls=f.read_text().splitlines()
  for i,l in enumerate(ls):
   if any('<'+Path(p).stem in l for p in paths if p.endswith('.tsx')):
    call.append(f'### {f.relative_to(r)}:{i+1}\n```tsx\n'+'\n'.join(ls[max(0,i-4):i+45])+'\n```')
 specifics=''
 for n in sections[cid]:
  m=re.search(r'### '+re.escape(n)+r' .*?(?=\n### |\n## |\Z)',plan,re.S)
  if m:specifics+=m.group(0)+'\n'
 text=f'''# {cid} bounded Terra high implementation\n\n## Goal\nImplement the Matter A presentation rebuild for your exact components in {r}. This is authorized implementation, not another plan.\n\nActually view these final image files:\n'''+ '\n'.join(str(r/'output/matter-ui-design-survey/designs'/f'{x}.png') for x in images[cid])+f'''\n\n## Exact write ownership\n'''+ '\n'.join(paths)+'''\nOnly these files. Do not edit global CSS (C9 must request approval first). Preserve all existing dirty/untracked changes. No agents, worktrees, commits, push, deploy, services, browser changes, backend, types, manifests, tests, docs, or other application files. Stop after your report; do not begin another chunk.\n\n## Local instructions\n'''+(r/'AGENTS.md').read_text()+'\n'+(r/'docs/DESIGN_LANGUAGE.md').read_text()+'''\n\nUser overrides: Do not run broad checks per chunk; coordinator alone runs final checks. No graph updates by workers. Do not use actual protected matter MAT-20260904-abf788. Read source only. Mockup sample data must never enter defaults.\n\n## Frozen contracts\n'''+common+'\n## Your design requirements\n'+specifics+'\n## Example states\n'+examples.get(cid,'')+'''\n\n## Current caller excerpts\n'''+ '\n'.join(call)+'''\n\n## Current component context\n'''+ '\n'.join(f'### {p}\n```tsx\n'+ '\n'.join(base[p].splitlines()[:38])+'\n```' for p in paths if p in base)+'''\n\n## Steps\n1. Read each owned component completely, its direct callers above, imported prop definitions, current semantic tokens, and relevant survey inventory. View the named images using view_image. Do not explore unrelated files.\n2. Convert presentation to the owned CSS Module. Use 16px/1.65 serif reading text, 15px/1.5 sans controls/rows, minimum 12px metadata, 36px desktop controls and 44px below 760px, max 10px radius, thin separators and existing semantic variables. Responsive normal flow; no mockup aspect ratio. Preserve callbacks, state, identity, hidden mounting, async targets, complete useful prose and every control.\n3. Check normal, empty, busy, error, long text and all listed example states by static code review. Do not run broad tests or builds. You may run git diff --check restricted to owned paths. Report an unresolved coupling before changing any prop except the exact C1 sectionNavigation seam.\n4. Return exact files changed, behavior/control mapping, checks actually run, uncertainty and remaining risks. Your report is not acceptance or browser proof.\n\nCoordinator will run npm run typecheck and all named aggregate checks at a stable boundary. Read-only source checks may have old JSX regex assumptions; report those, never weaken them. Do not edit tests.\n'''
 (o/f'{cid}-handoff.md').write_text(text)
print(json.dumps(owners,indent=2))
