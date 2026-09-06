from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[3]
out=Path(__file__).parent
base=json.loads((out/'protected-before.json').read_text())
changes=[]
for directory, expected in base['vaults'].items():
 p=Path(directory)
 current={str(f.relative_to(p)):hashlib.sha256(f.read_bytes()).hexdigest() for f in p.rglob('*') if f.is_file() and '.counsel_os_cache' not in f.name and not f.name.endswith('.lock')}
 changes.extend(str(p/k) for k in expected.keys()|current.keys() if expected.get(k)!=current.get(k))
pointer=root/'.counsel-os/active-vault.json'
pointer_hash=hashlib.sha256(pointer.read_bytes()).hexdigest() if pointer.exists() else None
result={'authoritative_changes':changes,'pointer_unchanged':pointer_hash==base['pointer_hash']}
(out/'protected-after.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));assert not changes and result['pointer_unchanged']
