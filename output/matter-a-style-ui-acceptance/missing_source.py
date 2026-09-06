import json,sys
from pathlib import Path
h=Path(__file__).resolve().parent;e=json.loads((h/'environment.json').read_text());r=Path(e['vault']).resolve();assert 'themis-matter-a-' in str(r)
p=r/e['matter_path']/'documents/coppa-definitions.md';b=h/'temporarily-unavailable-source.md'
if sys.argv[1]=='hide':
 assert p.exists() and not b.exists();b.write_bytes(p.read_bytes());p.unlink();print('Only isolated fixture source temporarily absent')
else:
 assert b.exists();p.write_bytes(b.read_bytes());b.unlink();print('Exact source bytes restored')
