---
matter_id: MAT-20260903-6d7dcf
record_type: facts
facts:
- fact_id: FACT-20260903-73bd78
  text: Compliance wants to replace manual sanctions screening with a vendor that
    returns potential matches and confidence signals.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-45a163
  text: Screening applies at onboarding and before selected payouts.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-d16bcc
  text: Product proposes automatically blocking exact matches.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-77f646
  text: Product proposes allowing low-confidence matches to proceed.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-be07a5
  text: Product proposes sending review cases to an offshore operations team.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-9eb830
  text: Product wants to migrate customers over a weekend in two months.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-ea141a
  text: Known facts include vendor coverage, API response times, and proposed matching
    thresholds.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-91b4da
  text: Missing facts include list-update frequency, jurisdictional scope, escalation
    authority, data transfer locations, evidence standards, customer communications,
    and procedures for true and false matches.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f9e4cf
  supersedes: null
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- fact_id: FACT-20260903-9975b4
  text: For low-confidence matches, Product proposes letting them proceed automatically.
    What should happen to funds while a low-confidence match is pending? — Hold funds
    until a human review clears the match
  status: active
  material: true
  source_ids:
  - MSG-20260903-c342a2
  supersedes: null
  created_at: '2026-09-03T18:27:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-603459
- fact_id: FACT-20260903-1e336e
  text: Which sanctions lists and jurisdictions should the screening program cover?
    — Global/multi-jurisdiction coverage
  status: active
  material: true
  source_ids:
  - MSG-20260903-3c3c98
  supersedes: null
  created_at: '2026-09-03T18:27:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3b102e
- fact_id: FACT-20260903-7d452f
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260903-9e592b
  supersedes: null
  created_at: '2026-09-03T18:28:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-595760
- fact_id: FACT-20260903-9a6e6c
  text: Where is the offshore operations team located, and does sanctions review data
    cross borders? — Different region (cross-border data transfer)
  status: active
  material: true
  source_ids:
  - MSG-20260903-8b55c2
  supersedes: null
  created_at: '2026-09-03T18:28:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c9e8f5
- fact_id: FACT-20260903-cd48c5
  text: Who decides whether a flagged match is a true vs false match and releases
    a held payout? — Two-person review (maker/checker)
  status: active
  material: true
  source_ids:
  - MSG-20260903-e27fba
  supersedes: null
  created_at: '2026-09-03T18:29:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-191bc5
- fact_id: FACT-20260903-f2ebed
  text: What should happen if the screening vendor is unavailable during onboarding
    or before a payout? — Fall back to manual screening
  status: active
  material: true
  source_ids:
  - MSG-20260903-9e0f28
  supersedes: null
  created_at: '2026-09-03T18:29:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-27fd21
- fact_id: FACT-20260903-7051be
  text: How often is the vendor's sanctions list refreshed, and how is that refresh
    verified? — Daily refresh, vendor-managed
  status: active
  material: true
  source_ids:
  - MSG-20260903-f7ff19
  supersedes: null
  created_at: '2026-09-03T18:30:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-352823
sources:
- source_id: REQ-20260903-f9e4cf
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-09-sanctions-screening-alert-handling-6d7dcf/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T18:26:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a14c15
- source_id: MSG-20260903-c342a2
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:27:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e2d879
- source_id: MSG-20260903-3c3c98
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:27:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a82bc1
- source_id: MSG-20260903-9e592b
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:28:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7ee8b0
- source_id: MSG-20260903-8b55c2
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:28:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-710529
- source_id: MSG-20260903-e27fba
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:29:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-541190
- source_id: MSG-20260903-9e0f28
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:29:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4cb786
- source_id: MSG-20260903-f7ff19
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T18:30:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-595826
support:
- support_id: SUP-20260903-71af8b
  fact_id: FACT-20260903-73bd78
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Compliance wants to replace manual sanctions screening with a vendor
    that returns potential matches and confidence signals.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-4d5e8d
  fact_id: FACT-20260903-45a163
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Screening applies at onboarding and before selected payouts.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-c4bc74
  fact_id: FACT-20260903-d16bcc
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Product proposes automatically blocking exact matches.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-279478
  fact_id: FACT-20260903-77f646
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Product proposes allowing low-confidence matches to proceed.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-19b652
  fact_id: FACT-20260903-be07a5
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Product proposes sending review cases to an offshore operations team.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-913e51
  fact_id: FACT-20260903-9eb830
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Product wants to migrate customers over a weekend in two months.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-b641e5
  fact_id: FACT-20260903-ea141a
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Known facts include vendor coverage, API response times, and proposed
    matching thresholds.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- support_id: SUP-20260903-529da9
  fact_id: FACT-20260903-91b4da
  source_id: REQ-20260903-f9e4cf
  relationship: support
  statement: Missing facts include list-update frequency, jurisdictional scope, escalation
    authority, data transfer locations, evidence standards, customer communications,
    and procedures for true and false matches.
  location: ''
  created_at: '2026-09-03T18:27:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
assumptions:
- assumption_id: ASM-20260903-6747da
  text: Mosaic Relay is a payments infrastructure provider, not a bank, and coordinates
    regulated partners (per company profile).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T18:27:04+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- assumption_id: ASM-20260903-e83316
  text: Sanctions screening obligations are driven by OFAC/regulatory expectations
    and partner (acquiring bank/processor) requirements.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T18:27:04+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-0b2c25
- assumption_id: ASM-20260903-0d3f34
  text: Global/multi-jurisdiction coverage means the program must reconcile conflicting
    or divergent sanctions lists across jurisdictions.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T18:30:01+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-0b650c
conflicts: []
actions:
- action_id: ACT-20260903-a14c15
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T18:26:54+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-f9e4cf
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0b2c25
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:27:04+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-73bd78
    - FACT-20260903-45a163
    - FACT-20260903-d16bcc
    - FACT-20260903-77f646
    - FACT-20260903-be07a5
    - FACT-20260903-9eb830
    - FACT-20260903-ea141a
    - FACT-20260903-91b4da
    sources: []
    support:
    - SUP-20260903-71af8b
    - SUP-20260903-4d5e8d
    - SUP-20260903-c4bc74
    - SUP-20260903-279478
    - SUP-20260903-19b652
    - SUP-20260903-913e51
    - SUP-20260903-b641e5
    - SUP-20260903-529da9
    assumptions:
    - ASM-20260903-6747da
    - ASM-20260903-e83316
  source_action_key: chat:RUN-20260903-27d93f:tool:c20f2d6187f316a8788161c9
- action_id: ACT-20260903-e2d879
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:27:19+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-c342a2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-603459
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:27:19+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-9975b4
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-67a903:answers
- action_id: ACT-20260903-e12362
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:27:26+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-67a903:tool:423123969a24bdc831c5d326
- action_id: ACT-20260903-a82bc1
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:27:36+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-3c3c98
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-3b102e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:27:36+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-1e336e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-5884f6:answers
- action_id: ACT-20260903-7ee8b0
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:28:01+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9e592b
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-595760
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:28:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7d452f
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-b06dc8:answers
- action_id: ACT-20260903-3bfbff
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:28:14+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-b06dc8:tool:e5d244b56a80c44d30b6f80a
- action_id: ACT-20260903-710529
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:28:28+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8b55c2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c9e8f5
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:28:28+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-9a6e6c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-590741:answers
- action_id: ACT-20260903-a499ff
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:28:46+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-590741:tool:c62d4a47ca56b055a543a990
- action_id: ACT-20260903-541190
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:29:12+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-e27fba
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-191bc5
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:29:12+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-cd48c5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-40c9fe:answers
- action_id: ACT-20260903-71b610
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:29:23+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-40c9fe:tool:c984c5e484d8c11c8ea12ae8
- action_id: ACT-20260903-4cb786
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:29:49+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9e0f28
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-27fd21
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:29:49+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f2ebed
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-b705c8:answers
- action_id: ACT-20260903-0b650c
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:30:01+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-0d3f34
  source_action_key: chat:RUN-20260903-b705c8:tool:cad05f5e2da81819cc61f72a
- action_id: ACT-20260903-595826
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T18:30:35+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-f7ff19
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-352823
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T18:30:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7051be
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-3eecc1:answers
- action_id: ACT-20260903-9a1eb1
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T18:30:55+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-3eecc1:tool:fdc6c76cb895581c13859e18
working_ask: Compliance wants to replace manual sanctions screening at onboarding
  and before selected payouts with a vendor that returns potential matches and confidence
  signals. Product proposes auto-blocking exact matches, holding funds on low-confidence
  matches until a two-person (maker/checker) human review clears them, and routing
  review cases to an offshore operations team in a different region (cross-border
  data transfer). Coverage is global/multi-jurisdiction; the vendor list refreshes
  daily (vendor-managed); fallback is manual screening if the vendor is unavailable.
  Legal must approve the exact screening events, matching rules, manual-review steps,
  access restrictions, notices, record retention, and fallback procedures, and assess
  readiness for a weekend migration in two months.
issues:
- Cross-border data transfer of sanctions review data to an offshore ops team in a
  different region, acute under global/multi-jurisdiction list coverage
- No defined evidence standards or documented procedures for true vs false match determinations
- Global coverage raises conflicting-list handling and list-update verification questions
- Weekend migration in two months may be aggressive given unresolved controls
- No defined customer communications plan for blocked or held payouts
- No defined record retention schedule for screening and review records
- Daily vendor-managed list refresh needs independent verification to support global
  coverage
open_questions:
- Evidence standards and documentation for true vs false match determinations
- Customer communications plan for blocked or held payouts
- Record retention schedule for screening and review records
- How the daily vendor-managed list refresh is independently verified
- Specific offshore ops team location and applicable data-transfer mechanism
- Escalation path when the two-person review cannot reach a decision
public_research_questions:
- What are OFAC and other major-jurisdiction expectations for sanctions screening
  list-update frequency and independent verification?
- What data-transfer and privacy obligations apply to sending sanctions review data
  to an offshore operations team in a different region?
- What are common regulatory expectations for evidence standards and record retention
  for sanctions screening and review determinations?
intake_answers:
- answer_id: ANS-20260903-d3bbbe
  question_id: low_confidence_release
  question: For low-confidence matches, Product proposes letting them proceed automatically.
    What should happen to funds while a low-confidence match is pending?
  answer: Hold funds until a human review clears the match
  values:
  - hold_until_review
  status: answered
  record_target: fact
  source_id: MSG-20260903-c342a2
  source_action_key: chat:RUN-20260903-67a903
  answered_at: '2026-09-03T18:27:19+00:00'
  answer_fact_id: FACT-20260903-9975b4
- answer_id: ANS-20260903-56239b
  question_id: jurisdictional_scope
  question: Which sanctions lists and jurisdictions should the screening program cover?
  answer: Global/multi-jurisdiction coverage
  values:
  - global
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-3c3c98
  source_action_key: chat:RUN-20260903-5884f6
  answered_at: '2026-09-03T18:27:36+00:00'
  answer_fact_id: FACT-20260903-1e336e
- answer_id: ANS-20260903-c7a12a
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260903-9e592b
  source_action_key: chat:RUN-20260903-b06dc8
  answered_at: '2026-09-03T18:28:01+00:00'
  answer_fact_id: FACT-20260903-7d452f
- answer_id: ANS-20260903-ee8dfa
  question_id: offshore_location
  question: Where is the offshore operations team located, and does sanctions review
    data cross borders?
  answer: Different region (cross-border data transfer)
  values:
  - different_region
  status: answered
  record_target: fact
  source_id: MSG-20260903-8b55c2
  source_action_key: chat:RUN-20260903-590741
  answered_at: '2026-09-03T18:28:28+00:00'
  answer_fact_id: FACT-20260903-9a6e6c
- answer_id: ANS-20260903-62f9fe
  question_id: escalation_authority
  question: Who decides whether a flagged match is a true vs false match and releases
    a held payout?
  answer: Two-person review (maker/checker)
  values:
  - two_person
  status: answered
  record_target: fact
  source_id: MSG-20260903-e27fba
  source_action_key: chat:RUN-20260903-40c9fe
  answered_at: '2026-09-03T18:29:12+00:00'
  answer_fact_id: FACT-20260903-cd48c5
- answer_id: ANS-20260903-9b0e25
  question_id: fallback
  question: What should happen if the screening vendor is unavailable during onboarding
    or before a payout?
  answer: Fall back to manual screening
  values:
  - manual_fallback
  status: answered
  record_target: fact
  source_id: MSG-20260903-9e0f28
  source_action_key: chat:RUN-20260903-b705c8
  answered_at: '2026-09-03T18:29:49+00:00'
  answer_fact_id: FACT-20260903-f2ebed
- answer_id: ANS-20260903-4d548f
  question_id: list_update_frequency
  question: How often is the vendor's sanctions list refreshed, and how is that refresh
    verified?
  answer: Daily refresh, vendor-managed
  values:
  - daily
  status: answered
  record_target: fact
  source_id: MSG-20260903-f7ff19
  source_action_key: chat:RUN-20260903-3eecc1
  answered_at: '2026-09-03T18:30:35+00:00'
  answer_fact_id: FACT-20260903-7051be
intake_state: complete
---
# Known Facts

- Compliance wants to replace manual sanctions screening with a vendor that returns potential matches and confidence signals.
- Screening applies at onboarding and before selected payouts.
- Product proposes automatically blocking exact matches.
- Product proposes allowing low-confidence matches to proceed.
- Product proposes sending review cases to an offshore operations team.
- Product wants to migrate customers over a weekend in two months.
- Known facts include vendor coverage, API response times, and proposed matching thresholds.
- Missing facts include list-update frequency, jurisdictional scope, escalation authority, data transfer locations, evidence standards, customer communications, and procedures for true and false matches.
- For low-confidence matches, Product proposes letting them proceed automatically. What should happen to funds while a low-confidence match is pending? — Hold funds until a human review clears the match
- Which sanctions lists and jurisdictions should the screening program cover? — Global/multi-jurisdiction coverage
- When does the business need the legal answer? — Before a planned launch
- Where is the offshore operations team located, and does sanctions review data cross borders? — Different region (cross-border data transfer)
- Who decides whether a flagged match is a true vs false match and releases a held payout? — Two-person review (maker/checker)
- What should happen if the screening vendor is unavailable during onboarding or before a payout? — Fall back to manual screening
- How often is the vendor's sanctions list refreshed, and how is that refresh verified? — Daily refresh, vendor-managed

## Assumptions

- [Assumption] Mosaic Relay is a payments infrastructure provider, not a bank, and coordinates regulated partners (per company profile).
- [Assumption] Sanctions screening obligations are driven by OFAC/regulatory expectations and partner (acquiring bank/processor) requirements.
- [Assumption] Global/multi-jurisdiction coverage means the program must reconcile conflicting or divergent sanctions lists across jurisdictions.
