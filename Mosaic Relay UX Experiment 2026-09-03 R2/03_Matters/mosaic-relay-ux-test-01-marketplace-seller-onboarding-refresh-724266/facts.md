---
matter_id: MAT-20260903-724266
record_type: facts
facts:
- fact_id: FACT-20260903-af1db0
  text: Mosaic Relay wants to reduce seller onboarding time for a marketplace customer
    via a mobile-first flow.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-1a9174
  text: The proposed flow collects legal name, business type, tax ID, ownership details,
    government ID, bank-account information for payouts, and a business explanation.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-1eedc3
  text: The marketplace and its sellers are the primary actors in the flow.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-93b330
  text: Product wants to launch in six weeks (target date 2026-10-15).
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-eae2d2
  text: The flow uses automatic approval for low-risk sellers and manual review for
    exceptions.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-d526ae
  text: Current KYC/KYB fields and vendor capabilities are known to the team.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-16439f
  text: Product expects a 25% reduction in onboarding abandonment.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac5232
  supersedes: null
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- fact_id: FACT-20260903-33f727
  text: In which jurisdictions do the marketplace and its sellers operate? This drives
    which KYC/KYB, money-transmission, and privacy rules apply. — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-ff7cb9
  supersedes: null
  created_at: '2026-09-03T14:32:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c700da
- fact_id: FACT-20260903-6d6a8d
  text: 'Who owns the seller relationship and compliance for onboarding and review:
    Mosaic Relay, the marketplace, or shared? This determines which party is the regulated
    actor and who must provide notices. — Shared — Mosaic Relay handles payments/KYC,
    marketplace handles seller relationship'
  status: active
  material: true
  source_ids:
  - MSG-20260903-6e2095
  supersedes: null
  created_at: '2026-09-03T14:33:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0f5819
- fact_id: FACT-20260903-f852fe
  text: 'What risk criteria define ''low-risk'' for automatic approval vs. manual
    review? This is the core of the approval rules legal must approve. — Other / different
    criteria: Automatic approval only after complete KYC/KYB, sanctions and adverse-media
    screening, verified payout account, no high-risk geography or prohibited business,
    and no identity or ownership mismatch. Any exception routes to trained manual
    review.'
  status: active
  material: true
  source_ids:
  - MSG-20260903-a33999
  supersedes: null
  created_at: '2026-09-03T14:33:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07b687
- fact_id: FACT-20260903-4d2e70
  text: What beneficial-owner threshold should the flow use for collecting ownership
    details? — 25% (US FinCEN CDD standard)
  status: active
  material: true
  source_ids:
  - MSG-20260903-462dba
  supersedes: null
  created_at: '2026-09-03T14:34:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3c7a35
- fact_id: FACT-20260903-e5f96d
  text: What retention period should apply to collected KYC/KYB and government-ID
    data? — The regulatory minimum required by applicable law
  status: active
  material: true
  source_ids:
  - MSG-20260903-17d83e
  supersedes: null
  created_at: '2026-09-03T14:34:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b5ac93
- fact_id: FACT-20260903-2aa704
  text: 'Which party provides required notices/disclosures to sellers: Mosaic Relay,
    the marketplace, or shared? — Shared — Mosaic Relay provides KYC/payments notices,
    marketplace provides seller-facing disclosures'
  status: active
  material: true
  source_ids:
  - MSG-20260903-79d0f4
  supersedes: null
  created_at: '2026-09-03T14:35:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-17c071
- fact_id: FACT-20260903-04997e
  text: What kinds of sellers does the marketplace serve? — Mixed (multiple types)
  status: active
  material: true
  source_ids:
  - MSG-20260903-188d55
  supersedes: null
  created_at: '2026-09-03T14:35:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f57a8e
- fact_id: FACT-20260903-703414
  text: Customer geography (jurisdictions where the marketplace and its sellers operate)
    — Not yet determined. Proceed on a US-only assumption for this first-pass analysis,
    but treat geography confirmation as a pre-launch gate; do not expand beyond the
    US assumption without a jurisdictional review.
  status: active
  material: true
  source_ids:
  - MSG-20260903-18b7aa
  supersedes: null
  created_at: '2026-09-03T14:36:24+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8c78c3
sources:
- source_id: REQ-20260903-ac5232
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T14:32:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cdb2ef
- source_id: MSG-20260903-ff7cb9
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:32:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-96781b
- source_id: MSG-20260903-6e2095
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:33:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-dbbe75
- source_id: MSG-20260903-a33999
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:33:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ba2533
- source_id: MSG-20260903-462dba
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:34:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ffe3a9
- source_id: MSG-20260903-17d83e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:34:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-dea325
- source_id: MSG-20260903-79d0f4
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:35:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-520d3b
- source_id: MSG-20260903-188d55
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:35:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b82164
- source_id: MSG-20260903-18b7aa
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T14:36:24+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb7aba
support:
- support_id: SUP-20260903-670545
  fact_id: FACT-20260903-af1db0
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: Mosaic Relay wants to reduce seller onboarding time for a marketplace
    customer via a mobile-first flow.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-106d22
  fact_id: FACT-20260903-1a9174
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: The proposed flow collects legal name, business type, tax ID, ownership
    details, government ID, bank-account information for payouts, and a business explanation.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-f1858a
  fact_id: FACT-20260903-1eedc3
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: The marketplace and its sellers are the primary actors in the flow.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-3c0e38
  fact_id: FACT-20260903-93b330
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: Product wants to launch in six weeks (target date 2026-10-15).
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-c2314a
  fact_id: FACT-20260903-eae2d2
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: The flow uses automatic approval for low-risk sellers and manual review
    for exceptions.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-59f6b3
  fact_id: FACT-20260903-d526ae
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: Current KYC/KYB fields and vendor capabilities are known to the team.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- support_id: SUP-20260903-e3c493
  fact_id: FACT-20260903-16439f
  source_id: REQ-20260903-ac5232
  relationship: support
  statement: Product expects a 25% reduction in onboarding abandonment.
  location: ''
  created_at: '2026-09-03T14:32:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
assumptions:
- assumption_id: ASM-20260903-f97f2c
  text: The marketplace is a US-based customer unless stated otherwise; geography
    is currently missing.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:32:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- assumption_id: ASM-20260903-e5a870
  text: Mosaic Relay acts as the payments-infrastructure provider and the marketplace
    owns the seller relationship, but the split is unconfirmed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:32:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- assumption_id: ASM-20260903-40b6c6
  text: Beneficial-owner thresholds follow US FinCEN CDD rules (25%) unless a different
    standard applies.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:32:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6f2fe2
- assumption_id: ASM-20260903-4c59e6
  text: With a shared split, Mosaic Relay provides KYC/payments-related notices and
    the marketplace provides seller-facing disclosures; this allocation is unconfirmed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:33:24+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-69eee9
- assumption_id: ASM-20260903-d073ea
  text: The marketplace is a US-based customer unless stated otherwise; geography
    is currently not yet determined.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:34:28+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d4f4c5
- assumption_id: ASM-20260903-9b01de
  text: Beneficial-owner threshold follows US FinCEN CDD (25%) as confirmed by the
    lawyer.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:34:28+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d4f4c5
- assumption_id: ASM-20260903-5bcada
  text: With a shared split, Mosaic Relay provides KYC/payments-related notices and
    the marketplace provides seller-facing disclosures (confirmed by lawyer).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:35:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-2f7a76
- assumption_id: ASM-20260903-367f36
  text: US-only geography assumption for this first-pass analysis; geography confirmation
    is a pre-launch gate and expansion beyond US requires a jurisdictional review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:36:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6ed8f1
- assumption_id: ASM-20260903-fc683d
  text: Mosaic Relay acts as the payments-infrastructure provider and the marketplace
    owns the seller relationship, with Mosaic Relay handling payments/KYC and the
    marketplace handling the seller relationship.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:36:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6ed8f1
- assumption_id: ASM-20260903-370bdd
  text: Beneficial-owner threshold follows US FinCEN CDD (25%).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:36:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6ed8f1
- assumption_id: ASM-20260903-534aca
  text: With the shared split, Mosaic Relay provides KYC/payments notices and the
    marketplace provides seller-facing disclosures.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T14:36:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6ed8f1
conflicts: []
actions:
- action_id: ACT-20260903-cdb2ef
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T14:32:23+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-ac5232
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6f2fe2
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:32:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-af1db0
    - FACT-20260903-1a9174
    - FACT-20260903-1eedc3
    - FACT-20260903-93b330
    - FACT-20260903-eae2d2
    - FACT-20260903-d526ae
    - FACT-20260903-16439f
    sources: []
    support:
    - SUP-20260903-670545
    - SUP-20260903-106d22
    - SUP-20260903-f1858a
    - SUP-20260903-3c0e38
    - SUP-20260903-c2314a
    - SUP-20260903-59f6b3
    - SUP-20260903-e3c493
    assumptions:
    - ASM-20260903-f97f2c
    - ASM-20260903-e5a870
    - ASM-20260903-40b6c6
  source_action_key: chat:RUN-20260903-415033:tool:bf04b897e0da5e184e7aac18
- action_id: ACT-20260903-96781b
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:32:53+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ff7cb9
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c700da
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:32:53+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-33f727
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-df9a43:answers
- action_id: ACT-20260903-ffc4c5
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:33:00+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-df9a43:tool:35b89af775fab838d4faf94d
- action_id: ACT-20260903-dbbe75
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:33:15+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-6e2095
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0f5819
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:33:15+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-6d6a8d
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-76be5b:answers
- action_id: ACT-20260903-69eee9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:33:24+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-4c59e6
  source_action_key: chat:RUN-20260903-76be5b:tool:b16cd453b9aef60214affa12
- action_id: ACT-20260903-ba2533
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:33:50+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a33999
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-07b687
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:33:50+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f852fe
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-364bf2:answers
- action_id: ACT-20260903-b96219
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:33:59+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-364bf2:tool:78ef5e1eaf036c1b12f7a7b2
- action_id: ACT-20260903-ffe3a9
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:34:19+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-462dba
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-3c7a35
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:34:19+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-4d2e70
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6e1585:answers
- action_id: ACT-20260903-d4f4c5
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:34:28+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-d073ea
    - ASM-20260903-9b01de
  source_action_key: chat:RUN-20260903-6e1585:tool:a4b42b40e6029ed61a65f209
- action_id: ACT-20260903-dea325
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:34:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-17d83e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-b5ac93
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:34:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-e5f96d
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c5f1ad:answers
- action_id: ACT-20260903-df572b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:34:56+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c5f1ad:tool:184ea0685453d7c5c3ecf80f
- action_id: ACT-20260903-520d3b
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:35:16+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-79d0f4
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-17c071
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:35:16+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-2aa704
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9d7ad5:answers
- action_id: ACT-20260903-2f7a76
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:35:32+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-5bcada
  source_action_key: chat:RUN-20260903-9d7ad5:tool:9cebcd85161c3bfc5f23c265
- action_id: ACT-20260903-b82164
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:35:49+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-188d55
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f57a8e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:35:49+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-04997e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0834fc:answers
- action_id: ACT-20260903-13aa05
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:35:57+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0834fc:tool:cead41f543d03de0ea65cc59
- action_id: ACT-20260903-eb7aba
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T14:36:24+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-18b7aa
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-8c78c3
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T14:36:24+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-703414
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9b46f9:answers
- action_id: ACT-20260903-6ed8f1
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T14:36:32+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-367f36
    - ASM-20260903-fc683d
    - ASM-20260903-370bdd
    - ASM-20260903-534aca
  source_action_key: chat:RUN-20260903-9b46f9:tool:d196ce35382443eaaf4e489a
working_ask: Mosaic Relay wants to reduce seller onboarding time for a marketplace
  customer via a mobile-first flow launching 2026-10-15. Legal must approve the exact
  onboarding data, disclosures, review steps, approval rules, and responsibility split
  before launch.
issues:
- KYC/KYB data collection scope and whether each collected field is necessary and
  proportionate
- Money-transmission / regulatory characterization of the onboarding and payout flow
- Beneficial-ownership (UBO) thresholds and ownership-detail collection requirements
- Data retention periods for collected KYC/KYB and government-ID data
- Privacy/data-protection obligations for collecting government ID and bank-account
  data
- Disclosure requirements and which party provides required notices
- Automatic-approval vs. manual-review rules and the risk criteria defining 'low-risk'
- Responsibility split between Mosaic Relay and the marketplace for onboarding, review,
  and compliance
open_questions: []
public_research_questions: []
intake_answers:
- answer_id: ANS-20260903-3539e1
  question_id: q_geography
  question: In which jurisdictions do the marketplace and its sellers operate? This
    drives which KYC/KYB, money-transmission, and privacy rules apply.
  answer: Not yet determined
  values:
  - unknown
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-ff7cb9
  source_action_key: chat:RUN-20260903-df9a43
  answered_at: '2026-09-03T14:32:53+00:00'
  answer_fact_id: FACT-20260903-33f727
- answer_id: ANS-20260903-d77ec6
  question_id: q_responsibility_split
  question: 'Who owns the seller relationship and compliance for onboarding and review:
    Mosaic Relay, the marketplace, or shared? This determines which party is the regulated
    actor and who must provide notices.'
  answer: Shared — Mosaic Relay handles payments/KYC, marketplace handles seller relationship
  values:
  - shared
  status: answered
  record_target: fact
  source_id: MSG-20260903-6e2095
  source_action_key: chat:RUN-20260903-76be5b
  answered_at: '2026-09-03T14:33:16+00:00'
  answer_fact_id: FACT-20260903-6d6a8d
- answer_id: ANS-20260903-e866ce
  question_id: q_low_risk
  question: What risk criteria define 'low-risk' for automatic approval vs. manual
    review? This is the core of the approval rules legal must approve.
  answer: 'Other / different criteria: Automatic approval only after complete KYC/KYB,
    sanctions and adverse-media screening, verified payout account, no high-risk geography
    or prohibited business, and no identity or ownership mismatch. Any exception routes
    to trained manual review.'
  values:
  - other
  - Automatic approval only after complete KYC/KYB, sanctions and adverse-media screening,
    verified payout account, no high-risk geography or prohibited business, and no
    identity or ownership mismatch. Any exception routes to trained manual review.
  status: answered
  record_target: fact
  source_id: MSG-20260903-a33999
  source_action_key: chat:RUN-20260903-364bf2
  answered_at: '2026-09-03T14:33:50+00:00'
  answer_fact_id: FACT-20260903-f852fe
- answer_id: ANS-20260903-f23669
  question_id: ubo_threshold
  question: What beneficial-owner threshold should the flow use for collecting ownership
    details?
  answer: 25% (US FinCEN CDD standard)
  values:
  - 25pct
  status: answered
  record_target: fact
  source_id: MSG-20260903-462dba
  source_action_key: chat:RUN-20260903-6e1585
  answered_at: '2026-09-03T14:34:19+00:00'
  answer_fact_id: FACT-20260903-4d2e70
- answer_id: ANS-20260903-e4f7e6
  question_id: retention
  question: What retention period should apply to collected KYC/KYB and government-ID
    data?
  answer: The regulatory minimum required by applicable law
  values:
  - regulatory_minimum
  status: answered
  record_target: fact
  source_id: MSG-20260903-17d83e
  source_action_key: chat:RUN-20260903-c5f1ad
  answered_at: '2026-09-03T14:34:48+00:00'
  answer_fact_id: FACT-20260903-e5f96d
- answer_id: ANS-20260903-8480ee
  question_id: notices_party
  question: 'Which party provides required notices/disclosures to sellers: Mosaic
    Relay, the marketplace, or shared?'
  answer: Shared — Mosaic Relay provides KYC/payments notices, marketplace provides
    seller-facing disclosures
  values:
  - shared
  status: answered
  record_target: fact
  source_id: MSG-20260903-79d0f4
  source_action_key: chat:RUN-20260903-9d7ad5
  answered_at: '2026-09-03T14:35:16+00:00'
  answer_fact_id: FACT-20260903-2aa704
- answer_id: ANS-20260903-978f6a
  question_id: q_seller_types
  question: What kinds of sellers does the marketplace serve?
  answer: Mixed (multiple types)
  values:
  - mixed
  status: answered
  record_target: fact
  source_id: MSG-20260903-188d55
  source_action_key: chat:RUN-20260903-0834fc
  answered_at: '2026-09-03T14:35:49+00:00'
  answer_fact_id: FACT-20260903-04997e
- answer_id: ANS-20260903-0e1cb2
  question_id: intake-recovery-missing-fact-c787480397
  question: Customer geography (jurisdictions where the marketplace and its sellers
    operate)
  answer: Not yet determined. Proceed on a US-only assumption for this first-pass
    analysis, but treat geography confirmation as a pre-launch gate; do not expand
    beyond the US assumption without a jurisdictional review.
  values:
  - Not yet determined. Proceed on a US-only assumption for this first-pass analysis,
    but treat geography confirmation as a pre-launch gate; do not expand beyond the
    US assumption without a jurisdictional review.
  status: answered
  record_target: fact
  source_id: MSG-20260903-18b7aa
  source_action_key: chat:RUN-20260903-9b46f9
  answered_at: '2026-09-03T14:36:24+00:00'
  answer_fact_id: FACT-20260903-703414
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay wants to reduce seller onboarding time for a marketplace customer
      via a mobile-first flow.

      - The proposed flow collects legal name, business type, tax ID, ownership details,
      government ID, bank-account information for payouts, and a business explanation.

      - The marketplace and its sellers are the primary actors in the flow.

      - Product wants to launch in six weeks (target date 2026-10-15).

      - The flow uses automatic approval for low-risk sellers and manual review for
      exceptions.

      - Current KYC/KYB fields and vendor capabilities are known to the team.

      - Product expects a 25% reduction in onboarding abandonment.

      - In which jurisdictions do the marketplace and its sellers operate? This drives
      which KYC/KYB, money-transmission, and privacy rules apply. — Not yet determined

      - Who owns the seller relationship and compliance for onboarding and review:
      Mosaic Relay, the marketplace, or shared? This determines which party is the
      regulated actor and who must provide notices. — Shared — Mosaic Relay handles
      payments/KYC, marketplace handles seller relationship

      - What risk criteria define ''low-risk'' for automatic approval vs. manual review?
      This is the core of the approval rules legal must approve. — Other / different
      criteria: Automatic approval only after complete KYC/KYB, sanctions and adverse-media
      screening, verified payout account, no high-risk geography or prohibited business,
      and no identity or ownership mismatch. Any exception routes to trained manual
      review.

      - What beneficial-owner threshold should the flow use for collecting ownership
      details? — 25% (US FinCEN CDD standard)

      - What retention period should apply to collected KYC/KYB and government-ID
      data? — The regulatory minimum required by applicable law

      - Which party provides required notices/disclosures to sellers: Mosaic Relay,
      the marketplace, or shared? — Shared — Mosaic Relay provides KYC/payments notices,
      marketplace provides seller-facing disclosures

      - What kinds of sellers does the marketplace serve? — Mixed (multiple types)

      - Customer geography (jurisdictions where the marketplace and its sellers operate)
      — Not yet determined. Proceed on a US-only assumption for this first-pass analysis,
      but treat geography confirmation as a pre-launch gate; do not expand beyond
      the US assumption without a jurisdictional review.


      ## Assumptions


      - [Assumption] The marketplace is a US-based customer unless stated otherwise;
      geography is currently missing.

      - [Assumption] Mosaic Relay acts as the payments-infrastructure provider and
      the marketplace owns the seller relationship, but the split is unconfirmed.

      - [Assumption] Beneficial-owner thresholds follow US FinCEN CDD rules (25%)
      unless a different standard applies.

      - [Assumption] With a shared split, Mosaic Relay provides KYC/payments-related
      notices and the marketplace provides seller-facing disclosures; this allocation
      is unconfirmed.

      - [Assumption] The marketplace is a US-based customer unless stated otherwise;
      geography is currently not yet determined.

      - [Assumption] Beneficial-owner threshold follows US FinCEN CDD (25%) as confirmed
      by the lawyer.

      - [Assumption] With a shared split, Mosaic Relay provides KYC/payments-related
      notices and the marketplace provides seller-facing disclosures (confirmed by
      lawyer).

      - [Assumption] US-only geography assumption for this first-pass analysis; geography
      confirmation is a pre-launch gate and expansion beyond US requires a jurisdictional
      review.

      - [Assumption] Mosaic Relay acts as the payments-infrastructure provider and
      the marketplace owns the seller relationship, with Mosaic Relay handling payments/KYC
      and the marketplace handling the seller relationship.

      - [Assumption] Beneficial-owner threshold follows US FinCEN CDD (25%).

      - [Assumption] With the shared split, Mosaic Relay provides KYC/payments notices
      and the marketplace provides seller-facing disclosures.

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: false
  authors: []
  comment_events: []
---
# Known Facts

- Mosaic Relay wants to reduce seller onboarding time for a marketplace customer via a mobile-first flow.
- The proposed flow collects legal name, business type, tax ID, ownership details, government ID, bank-account information for payouts, and a business explanation.
- The marketplace and its sellers are the primary actors in the flow.
- Product wants to launch in six weeks (target date 2026-10-15).
- The flow uses automatic approval for low-risk sellers and manual review for exceptions.
- Current KYC/KYB fields and vendor capabilities are known to the team.
- Product expects a 25% reduction in onboarding abandonment.
- In which jurisdictions do the marketplace and its sellers operate? This drives which KYC/KYB, money-transmission, and privacy rules apply. — Not yet determined
- Who owns the seller relationship and compliance for onboarding and review: Mosaic Relay, the marketplace, or shared? This determines which party is the regulated actor and who must provide notices. — Shared — Mosaic Relay handles payments/KYC, marketplace handles seller relationship
- What risk criteria define 'low-risk' for automatic approval vs. manual review? This is the core of the approval rules legal must approve. — Other / different criteria: Automatic approval only after complete KYC/KYB, sanctions and adverse-media screening, verified payout account, no high-risk geography or prohibited business, and no identity or ownership mismatch. Any exception routes to trained manual review.
- What beneficial-owner threshold should the flow use for collecting ownership details? — 25% (US FinCEN CDD standard)
- What retention period should apply to collected KYC/KYB and government-ID data? — The regulatory minimum required by applicable law
- Which party provides required notices/disclosures to sellers: Mosaic Relay, the marketplace, or shared? — Shared — Mosaic Relay provides KYC/payments notices, marketplace provides seller-facing disclosures
- What kinds of sellers does the marketplace serve? — Mixed (multiple types)
- Customer geography (jurisdictions where the marketplace and its sellers operate) — Not yet determined. Proceed on a US-only assumption for this first-pass analysis, but treat geography confirmation as a pre-launch gate; do not expand beyond the US assumption without a jurisdictional review.

## Assumptions

- [Assumption] The marketplace is a US-based customer unless stated otherwise; geography is currently missing.
- [Assumption] Mosaic Relay acts as the payments-infrastructure provider and the marketplace owns the seller relationship, but the split is unconfirmed.
- [Assumption] Beneficial-owner thresholds follow US FinCEN CDD rules (25%) unless a different standard applies.
- [Assumption] With a shared split, Mosaic Relay provides KYC/payments-related notices and the marketplace provides seller-facing disclosures; this allocation is unconfirmed.
- [Assumption] The marketplace is a US-based customer unless stated otherwise; geography is currently not yet determined.
- [Assumption] Beneficial-owner threshold follows US FinCEN CDD (25%) as confirmed by the lawyer.
- [Assumption] With a shared split, Mosaic Relay provides KYC/payments-related notices and the marketplace provides seller-facing disclosures (confirmed by lawyer).
- [Assumption] US-only geography assumption for this first-pass analysis; geography confirmation is a pre-launch gate and expansion beyond US requires a jurisdictional review.
- [Assumption] Mosaic Relay acts as the payments-infrastructure provider and the marketplace owns the seller relationship, with Mosaic Relay handling payments/KYC and the marketplace handling the seller relationship.
- [Assumption] Beneficial-owner threshold follows US FinCEN CDD (25%).
- [Assumption] With the shared split, Mosaic Relay provides KYC/payments notices and the marketplace provides seller-facing disclosures.
