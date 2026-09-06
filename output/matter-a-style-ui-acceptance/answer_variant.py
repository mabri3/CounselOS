import json,sys
from pathlib import Path
H=Path(__file__).resolve().parent
sys.path.insert(0,str(H.parents[1]/'backend'))
import frontmatter
e=json.loads((H/'environment.json').read_text()); root=Path(e['vault']).resolve(); assert 'themis-matter-a-' in str(root)
p=root/e['matter_path']/'workspace.md'; backup=H/'before-answer-variant.md'
if sys.argv[1]=='restore':
 p.write_bytes(backup.read_bytes()); print('Restored exact workspace bytes'); raise SystemExit
if not backup.exists(): backup.write_bytes(p.read_bytes())
doc=frontmatter.loads(p.read_text()); doc.metadata['snapshot']['short_answer']=json.loads((H/'variants.json').read_text())['long_answer'];doc.metadata['snapshot']['claims']=doc.metadata['claims'];p.write_text(frontmatter.dumps(doc));print('Applied long answer only in isolated fixture')
