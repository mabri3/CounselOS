from pathlib import Path
import json,urllib.request,sys,hashlib
p=Path(__file__).parent;root=p/'browser-vault/03_Matters/beacon-instant-onboarding'
s={'name':sys.argv[1],'fixture':json.load(urllib.request.urlopen('http://localhost:8207/api/fixture/dossier-research/state')),'parents':sorted(x.name for x in (root/'research/dossier-requests').glob('*.md')),'revisions':sorted(x.name for x in (root/'dossier-revisions').glob('*.md')),'canonical_sha256':hashlib.sha256((root/'dossier.md').read_bytes()).hexdigest()}
(p/(sys.argv[1]+'.json')).write_text(json.dumps(s,indent=2));print(s)
