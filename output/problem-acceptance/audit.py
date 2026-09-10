from server import *
import hashlib,zipfile
from app.services.workspace import digest
v=Path(E['vault']);mid=E['matter_id'];base=E['matter_path']
def hashes():return {str(p.relative_to(v)):hashlib.sha256(p.read_bytes()).hexdigest() for p in v.rglob('*.md')}
before=hashes();context.index.rebuild();assert hashes()==before
issues=context.workspace.issues(mid);first=issues[0];assert first['disposition']=='unresolved'
facts=context.matter_records.get(mid)['facts'];assert any('limited to adults' in f['text'] for f in facts)
work=context.workspace_review.work_items(mid);assert any(w['title']=='Confirm the launch audience controls' and w['status']=='done' for w in work)
assert context.index.get_matter(mid)['status']!='closed'
decisions=context.workspace_review.decisions(mid);assert len(decisions)==2
assert any('Synthetic acceptance decision' in str(d) for d in decisions)
source=context.vault.read_markdown(base+'/documents/product-spec.md');assert source['metadata']['immutable'] and 'minimum user age' in source['content']
final=context.vault.read_markdown(E['final']['vault_path']);assert final['metadata']['immutable']
draft=next(x for x in context.work_products.list_drafts(mid) if x['title']=='Launch advice');review=context.document_reviews.get(draft['path']);assert ''.join(s['text'] for s in review['segments'] if s['kind']!='delete')==context.vault.read_markdown(draft['path'])['content']
exports=[]
for p in v.rglob('*.docx'):
 with zipfile.ZipFile(p) as z:
  if 'Lawyer acceptance edit' in z.read('word/document.xml').decode():exports.append(str(p.relative_to(v)))
assert exports
result={'matter_id':mid,'vault':str(v),'index_rebuild_preserved_markdown':True,'unresolved_issue':first['issue_id'],'completed_mitigation':True,'decision_count':len(decisions),'explicit_adoption':True,'final_read_only':True,'source_unchanged':True,'draft_review_matches_saved_body':True,'selected_draft_exports':exports}
(Path(__file__).parent/'audit.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
