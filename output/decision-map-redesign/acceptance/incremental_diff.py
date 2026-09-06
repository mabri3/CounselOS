"""Compare implementation with the captured dirty-tree baseline, not HEAD."""
from pathlib import Path
import difflib,hashlib,json
root=Path(__file__).resolve().parents[3]
baseline=root/'output/decision-map-redesign/implementation-baseline'
manifest=json.loads((baseline/'manifest.json').read_text())
paths=set(manifest['hashes'])
for folder in ['backend/app','backend/tests','frontend/app','frontend/components','frontend/lib','frontend/scripts','docs']:
 paths.update(str(p.relative_to(root)) for p in (root/folder).rglob('*') if p.is_file() and p.suffix in {'.py','.ts','.tsx','.css','.md','.json'} and '__pycache__' not in p.parts)
changed=[];diff=[]
for name in sorted(paths):
 p=root/name
 value=hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
 if value==manifest['hashes'].get(name):continue
 changed.append(name)
 old=(baseline/'files'/name).read_text().splitlines(True) if (baseline/'files'/name).exists() else []
 new=p.read_text().splitlines(True) if p.exists() else []
 diff.extend(difflib.unified_diff(old,new,fromfile='baseline/'+name,tofile='current/'+name))
out=Path(__file__).parent
(out/'incremental.diff').write_text(''.join(diff));(out/'changed-files.json').write_text(json.dumps(changed,indent=2))
print('\n'.join(changed))
