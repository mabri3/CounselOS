import json,hashlib,sys
from pathlib import Path
H=Path(__file__).resolve().parent;env=json.loads((H/'environment.json').read_text());root=Path(env['vault'])
snapshot={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in root.rglob('*') if p.is_file() and '.db' not in p.name and '__pycache__' not in str(p)}
p=H/(sys.argv[1]+'.json');p.write_text(json.dumps(snapshot,indent=2))
if len(sys.argv)>2:
 before=json.loads((H/(sys.argv[2]+'.json')).read_text());changes=[k for k in before.keys()|snapshot.keys() if before.get(k)!=snapshot.get(k)];print(json.dumps(changes,indent=2));(H/(sys.argv[1]+'-changes.json')).write_text(json.dumps(changes,indent=2))
else:print('Checkpoint:',len(snapshot),'files')
