"""Read original synthetic evidence; initialize only a separate owned copy."""
import json,hashlib,shutil
from pathlib import Path
import frontmatter
from app.runtime import AppContext
from app.config import Settings
from app.services.dossier_generation_context import capture,input_text
root=Path('/Users/bharris/Programs/counsel-os-mvp');p=root/'output/dossier-research-first/astra-review';src=root/'output/dossier-research-first/live-quality-vault'
rel=Path('03_Matters/northstar-subscription-launch-synthetic-quality-check-f7ed8b')
md=lambda path:frontmatter.loads(path.read_text())
parent=md(src/rel/'research/dossier-requests/DOR-20260912-f382af.md').metadata
summary={'source':'existing synthetic Step 13 evidence; no live calls','parent':{k:parent.get(k) for k in ['request_id','state','scope','model_selections','first_pass_ready_at','publications']},'runs':[]}
for f in sorted((src/rel/'research/runs').glob('RUN-*.md')):
 m=md(f).metadata;cp=m.get('checkpoint') or {};sources=cp.get('sources') or []
 row={k:m.get(k) for k in ['run_id','issue_id','managed_state','failure_detail','started_at','finished_at','search_scope','model_selection','main_model_selection']}
 row.update(budget=cp.get('budget_used'),useful_chars=len(cp.get('useful_content') or ''),sources=len(sources),request_count=len(cp.get('requests') or {}),passages=cp.get('passages'),source_checks=[])
 for s in sources:
  path=src/s['path'];raw=frontmatter.loads(path.read_bytes().decode()).content;normal=md(path).content
  rawhash=hashlib.sha256(raw.encode()).hexdigest();normalhash=hashlib.sha256(normal.encode()).hexdigest()
  if rawhash!=normalhash or rawhash!=s.get('source_hash'):
   row['source_checks'].append({'source_id':s.get('source_id'),'path':s['path'],'raw_body_hash':rawhash,'normalized_body_hash':normalhash,'saved_hash':s.get('source_hash'),'raw_matches_saved':rawhash==s.get('source_hash'),'crlf_count':raw.count('\r\n')})
 summary['runs'].append(row)
packet=md(src/rel/'research/RES-20260912-996d5f.md')
(p/'live-packet-body.md').write_text(packet.content);(p/'live-contract-body.md').write_text(md(src/rel/'documents/synthetic-vendor-contract.md').content)
summary['packet']={'path':str(rel/'research/RES-20260912-996d5f.md'),'chars':len(packet.content),'prose_chars':len(packet.metadata.get('research_prose') or ''),'source_count':len(packet.metadata.get('source_records') or []),'synthesis':packet.metadata.get('research_synthesis')}
dest=p/'live-audit-copy'
if not dest.exists():shutil.copytree(src,dest,ignore=shutil.ignore_patterns('*.sqlite','*.sqlite-*','*.db','*.db-*'))
app=AppContext(Settings(_env_file=None,vault_path=str(dest),scheduler_enabled=False,llm_provider='mock',llm_api_key=None,tavily_api_key=None,firecrawl_api_key=None,polaris_api_key=None))
cap=capture(app,'MAT-20260912-f7ed8b');text=input_text(cap)
summary['current_capture_measurement']={'input_bytes':len(text.encode()),'default_dispatch_ceiling_bytes':app.settings.model_dispatch_max_bytes,'section_bytes':{k:len(json.dumps(v,ensure_ascii=False,default=str).encode()) for k,v in cap['data'].items()},'note':'Re-capture from an owned copy after the recorded run. Not the exact historical request bytes. The saved historical failure event independently proves overflow.'}
(p/'live-audit-summary.json').write_text(json.dumps(summary,indent=2,default=str))
print(json.dumps({'source_checks':[x for r in summary['runs'] for x in r['source_checks']],'input':summary['current_capture_measurement']},indent=2))
