import json,sys
from pathlib import Path
h=Path(__file__).resolve().parent;sys.path.insert(0,str(h.parents[1]/'backend'));import frontmatter
e=json.loads((h/'environment.json').read_text());r=Path(e['vault']).resolve();assert 'themis-matter-a-' in str(r)
p=r/'00_System/settings.md';b=h/'before-empty-roster.md'
if sys.argv[1]=='empty':
 assert not b.exists();b.write_bytes(p.read_bytes());d=frontmatter.loads(p.read_text());d.metadata['values']['continuity.demo_enabled']=False;d.metadata['values']['continuity.people']=[];p.write_text(frontmatter.dumps(d));print('Isolated roster disabled and empty')
else:
 p.write_bytes(b.read_bytes());b.unlink();print('Exact isolated settings restored')
