import json,sys,hashlib
from pathlib import Path
p=Path(__file__).resolve().parent;sys.path.insert(0,str(p.parents[1]/'backend'));import frontmatter
v=Path(json.loads((p/'environment.json').read_text())['vault']);m=v/'03_Matters/harbor-relay-specification-review-0a2378'
read=lambda x:frontmatter.loads(x.read_text()).metadata
sha=lambda x:hashlib.sha256(x).hexdigest()
checks={}
for file in ['connected-story-original-sources.json','harbor-final-and-decision-baseline.json']:
 for path,expected in json.loads((p/file).read_text()).items(): checks[path]={'expected':expected,'actual':sha((v/path).read_bytes()),'unchanged':sha((v/path).read_bytes())==expected}
base=json.loads((p/'harbor-connected-prior-work-baseline.json').read_text())
for path,expected in base['immutable_files'].items(): checks[path]={'unchanged':sha((v/path).read_bytes())==expected}
convs=[read(x) for x in (m/'conversations').glob('CONV*.md')];assert len(convs)==1
for initial in base['initial_advice']:
 msg=next(x for x in convs[0]['messages'] if x['message_id']==initial['message_id']);checks[initial['message_id']]={'unchanged':sha(msg['content'].encode())==initial['sha256']}
matter=dict(read(m/'matter.md'));wi=dict(read(m/'work-items/WI-20260905-177aed.md'))
assert matter['status']=='closed' and wi['status']=='done'
for field in ['response_approved_actor','response_sent_actor','closed_actor']:assert matter[field]['person_id']=='alex'
assert wi['action_actor']['person_id']=='alex'
assert all(x['unchanged'] for x in checks.values())
reply_base=json.loads((p/'harbor-exact-reply-integrity.json').read_text())['reply']
raw=(v/reply_base['path']).read_bytes();lines=raw.splitlines(keepends=True);end=next(i for i,line in enumerate(lines[1:],1) if line.rstrip(b"\r\n")==b'---');assert b''.join(lines[end+1:]).decode()==reply_base['text']
reply_meta=read(v/reply_base['path']);assert reply_meta['entered_by']['person_id']=='alex' and reply_meta['reported_speaker']=='Sam Patel'
offers=read(m/'workspace.md')['update_offers'];assert next(x for x in offers if x['offer_id']=='OFFER-a57b6ad05e23073a7a63')['state']=='declined'
assert len(list((m/'continuity/handoffs').glob('*.md')))==4
result={'exact_reply_and_speaker_preserved':True,'declined_offer_preserved':True,'handoff_count':4,'checks':checks,'matter':matter,'work_item':wi,'conversation_count':len(convs),'conversation_id':convs[0]['conversation_id'],'passed':True}
(p/'harbor-final-lifecycle-integrity.json').write_text(json.dumps(result,indent=2,default=str));print('Final, decision, original sources, request and original advice unchanged. One conversation. Explicit approval/delivery/closure and completed work attributed to Alex.')
