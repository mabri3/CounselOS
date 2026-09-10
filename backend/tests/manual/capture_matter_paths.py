"""Read-only evidence capture for this task's synthetic browser vault."""
import argparse, hashlib, json
from pathlib import Path
import frontmatter


def capture(vault):
    assert vault.name == 'vault' and vault.parent.name.startswith('matter-paths-browser-')
    base=vault/'03_Matters/beacon-instant-onboarding'
    records={}
    for path in base.rglob('*.md'):
        relative=str(path.relative_to(vault))
        record=frontmatter.loads(path.read_text())
        if any(part in relative for part in ('/paths/','/scenarios/','/memory/','/conversations/')) or path.name in {'facts.md','dossier.md'}:
            records[relative]={'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'metadata':dict(record.metadata),'content':record.content}
    return {'vault_kind':'synthetic browser fixture','records':records}


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('vault',type=Path);parser.add_argument('output',type=Path)
    args=parser.parse_args()
    assert not args.output.exists(), 'Use a new evidence file.'
    args.output.write_text(json.dumps(capture(args.vault),indent=2,default=str))
