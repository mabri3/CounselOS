"""Idempotent synthetic layout states, using actual record schemas and services."""
from isolated_server import ROOT, VAULT, TEST_ROOT, isolated_settings
import json
from datetime import datetime, timezone
from app.runtime import AppContext
from app.models.awareness import Digest, BriefingQuery, Scan, ProviderScanResult, SourceReference, ReviewPacket
assert VAULT.resolve().is_relative_to(TEST_ROOT.resolve())
a=AppContext(isolated_settings()); now=datetime.now(timezone.utc)
from app.services.briefing_store import BriefingStore
s=BriefingStore(a.vault)
if not a.vault.exists('05_Briefing/digests/DIG-PHASE2.md'):
 s.put_digest(Digest(digest_id='DIG-PHASE2',path='',view_id='for-you',view_name='For you',resolved_query=BriefingQuery(),item_ids=['ITEM-DEMO-ALTERNATIVE-DATA-BRIEFING','ITEM-PHASE2-MISSING'],title='Synthetic saved briefing',summary='A saved test view includes one available item and one missing item. This is a layout fixture, not a legal development.',created_at=now))
if not a.vault.exists('05_Briefing/scans/SCAN-PHASE2-PARTIAL.md'):
 s.append_scan(Scan(scan_id='SCAN-PHASE2-PARTIAL',path='',watch_id='alternative-data',mode='manual',status='partial',watch_revision=1,started_at=now,completed_at=now,provider_results=[ProviderScanResult(provider_id='native',status='success',bounded_excerpt='Synthetic retained process observation: operations reviews requests before release.',warnings=['Synthetic fixture; no public retrieval performed.']),ProviderScanResult(provider_id='polaris',status='failed',warnings=['Simulated provider failure for layout acceptance.'])],warnings=['Partial: Native text retained; Polaris failed.']))
packet=s.get_packet('PKT-DEMO-ALTERNATIVE-DATA')
for n in range(1,6):
 pid=f'PKT-PHASE2-{n}'
 if not a.vault.exists(f'05_Briefing/review-packets/{pid}.md'):
  s.put_packet(packet.model_copy(update={'packet_id':pid,'path':'','what_happened':f'Synthetic process review {n}: confirm the review owner before release.','why_surfaced':'The supplied test process assigns a review step; the owner must be recorded.','possible_tension':'The saved decision may name an earlier process owner.','prior_decision_basis':'See the actual linked saved decision.','sources':[SourceReference(title='Supplied process note',canonical_url='https://example.com/phase2-process',excerpt='Operations reviews the request before release.',support_state='supplied',warning='Synthetic process fixture; supports only this process description.')],'created_at':now,'updated_at':now}))
base='03_Matters/project-apex-ai'
source=base+'/documents/phase2-process.md'
a.vault.write_markdown(source,'# Supplied process note\n\nOperations reviews the request before release.\n\nThe owner records the version used for review.\n',{'synthetic_fixture':True})
path=base+'/research/phase2-process.md'
if not a.vault.exists(path):
 a.vault.write_markdown(path,'''# Review the proposed process

## Question
Confirm who owns the review step and which version applies.

## Working analysis
Operations reviews the request before release. [1] The owner records the reviewed version. [2] This supplied process supports the operational description only. It establishes no legal rule.

## Facts that could change the answer
- A different process version may apply.
- Roles may have changed.

## Next step
Confirm the review owner and attach the current process version.

## Sources
- Internal matter support: `'''+source+'''` [source:process]
  Available excerpt:
  > Operations reviews the request before release.
- Internal matter support: `'''+source+'''` [source:version]
  Available excerpt:
  > The owner records the version used for review.
- Unverified external lead: [Missing process reference](https://example.com/missing-process)
  No source excerpt available.
''',{'matter_id':'MAT-DEMO-APEX','question':'Review the proposed process','created_at':now.isoformat(),'synthetic_fixture':True,'public_research_status':'unavailable'})
a.index.rebuild()
f=json.loads((ROOT/'fixture-manifest.json').read_text());f.update({'research_path':path,'research_matter':'MAT-DEMO-APEX','review_packets':[f'PKT-PHASE2-{n}' for n in range(1,6)],'digest':'DIG-PHASE2','partial_scan':'SCAN-PHASE2-PARTIAL','fixture_note':'Stored synthetic states are not actions exercised in the browser.'});(ROOT/'fixture-manifest.json').write_text(json.dumps(f,indent=2,default=str))
print('Fixture extensions prepared.')
