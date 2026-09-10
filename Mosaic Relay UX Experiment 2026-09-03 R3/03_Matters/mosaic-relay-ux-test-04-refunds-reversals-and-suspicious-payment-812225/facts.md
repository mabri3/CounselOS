---
matter_id: MAT-20260903-812225
record_type: facts
facts:
- fact_id: FACT-20260903-bd92b7
  text: Mosaic Relay supports payment routing and merchant operations but does not
    hold customer deposits.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-d46435
  text: The proposed tool would allow full or partial refunds across card, ACH, and
    local payment methods.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-4996ac
  text: The tool would route refund funds back to the original payer where possible.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-d02eb3
  text: The tool would support manual operations overrides when a merchant account
    is closed.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-c49192
  text: Business goal is to shorten refund processing time and reduce support requests.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-ac220c
  text: Operations has identified cases where a merchant may use refunds to move funds
    between unrelated cards or recipients.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-91f995
  text: Refund requests may arrive immediately after payment or months later.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-7d8779
  text: Some payment methods may require separate reversal or return procedures.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0c7d25
  supersedes: null
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- fact_id: FACT-20260903-09d49c
  text: Which jurisdictions will the self-service refund tool be available in at launch?
    — Not yet defined
  status: active
  material: true
  source_ids:
  - MSG-20260903-d3b852
  supersedes: null
  created_at: '2026-09-03T23:55:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-922925
- fact_id: FACT-20260903-d7f748
  text: What refund destination rules will the tool enforce by default? — Original
    payer by default, with limited exceptions/overrides
  status: active
  material: true
  source_ids:
  - MSG-20260903-28114a
  supersedes: null
  created_at: '2026-09-03T23:55:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d9eb27
- fact_id: FACT-20260903-f49ff8
  text: What limits and approvals apply to manual operations overrides, especially
    for closed accounts? — Overrides require two-person approval and are logged/audited
  status: active
  material: true
  source_ids:
  - MSG-20260903-552592
  supersedes: null
  created_at: '2026-09-03T23:56:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-879be7
- fact_id: FACT-20260903-1fa406
  text: Does Mosaic Relay's existing transaction-monitoring cover refunds and reversals,
    or is this a new monitoring surface? — Not sure
  status: active
  material: true
  source_ids:
  - MSG-20260903-63d872
  supersedes: null
  created_at: '2026-09-03T23:56:25+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-673e47
- fact_id: FACT-20260903-5bdf8d
  text: What is the target launch timing for the tool? — Not yet defined
  status: active
  material: true
  source_ids:
  - MSG-20260903-466da7
  supersedes: null
  created_at: '2026-09-03T23:57:14+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0ece0d
- fact_id: FACT-20260903-9bc4d5
  text: Launch jurisdictions — Not yet defined; launch jurisdictions are pending product
    and regulatory sign-off.
  status: active
  material: true
  source_ids:
  - MSG-20260903-dcd257
  supersedes: null
  created_at: '2026-09-03T23:57:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a29f8e
- fact_id: FACT-20260903-3aeb5a
  text: Refund windows by payment method — Not yet defined; confirm card, ACH, and
    local-method refund and return windows with each acquiring partner and processor
    before launch.
  status: active
  material: true
  source_ids:
  - MSG-20260903-427c71
  supersedes: null
  created_at: '2026-09-03T23:58:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-02542a
- fact_id: FACT-20260903-15ed09
  text: Target launch timing — Not yet defined; no firm launch date has been set.
  status: active
  material: true
  source_ids:
  - MSG-20260903-63fd2b
  supersedes: null
  created_at: '2026-09-03T23:58:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-98a3ab
- fact_id: FACT-20260903-433fd5
  text: confirm Mosaic Relay's legal entity and licensing status, funds-flow and settlement
    model, and the applicable acquiring-partner and network contracts.
  status: active
  material: true
  source_ids:
  - MSG-20260903-5c1a06
  supersedes: null
  created_at: '2026-09-03T23:59:22+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-67aecb
sources:
- source_id: REQ-20260903-0c7d25
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-04-refunds-reversals-and-suspicious-payment-812225/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T23:54:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d6418b
- source_id: MSG-20260903-d3b852
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:55:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4d4fed
- source_id: MSG-20260903-28114a
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:55:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-875d52
- source_id: MSG-20260903-552592
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:56:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-be5d5f
- source_id: MSG-20260903-63d872
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:56:25+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cf5b75
- source_id: MSG-20260903-466da7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:57:14+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-982b32
- source_id: MSG-20260903-dcd257
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:57:49+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e8063b
- source_id: MSG-20260903-427c71
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:58:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d05d8e
- source_id: MSG-20260903-63fd2b
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:58:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d331c7
- source_id: MSG-20260903-5c1a06
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T23:59:22+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a20423
support:
- support_id: SUP-20260903-e49f6d
  fact_id: FACT-20260903-bd92b7
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: Mosaic Relay supports payment routing and merchant operations but does
    not hold customer deposits.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-7f7d75
  fact_id: FACT-20260903-d46435
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: The proposed tool would allow full or partial refunds across card, ACH,
    and local payment methods.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-6817f5
  fact_id: FACT-20260903-4996ac
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: The tool would route refund funds back to the original payer where possible.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-8cbd2d
  fact_id: FACT-20260903-d02eb3
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: The tool would support manual operations overrides when a merchant account
    is closed.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-c86a24
  fact_id: FACT-20260903-c49192
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: Business goal is to shorten refund processing time and reduce support
    requests.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-97d22b
  fact_id: FACT-20260903-ac220c
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: Operations has identified cases where a merchant may use refunds to move
    funds between unrelated cards or recipients.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-26dda1
  fact_id: FACT-20260903-91f995
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: Refund requests may arrive immediately after payment or months later.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- support_id: SUP-20260903-4a156e
  fact_id: FACT-20260903-7d8779
  source_id: REQ-20260903-0c7d25
  relationship: support
  statement: Some payment methods may require separate reversal or return procedures.
  location: ''
  created_at: '2026-09-03T23:55:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
assumptions:
- assumption_id: ASM-20260903-d603da
  text: Refund destination is restricted to the original payer's funding source unless
    an override applies
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T23:55:01+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
- assumption_id: ASM-20260903-463ab0
  text: Mosaic Relay's refund obligations vary by payment method and network rules
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T23:55:01+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c76fea
conflicts: []
actions:
- action_id: ACT-20260903-d6418b
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T23:54:54+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-0c7d25
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c76fea
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:55:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-bd92b7
    - FACT-20260903-d46435
    - FACT-20260903-4996ac
    - FACT-20260903-d02eb3
    - FACT-20260903-c49192
    - FACT-20260903-ac220c
    - FACT-20260903-91f995
    - FACT-20260903-7d8779
    sources: []
    support:
    - SUP-20260903-e49f6d
    - SUP-20260903-7f7d75
    - SUP-20260903-6817f5
    - SUP-20260903-8cbd2d
    - SUP-20260903-c86a24
    - SUP-20260903-97d22b
    - SUP-20260903-26dda1
    - SUP-20260903-4a156e
    assumptions:
    - ASM-20260903-d603da
    - ASM-20260903-463ab0
  source_action_key: chat:RUN-20260903-c4fcae:tool:f0170aa5d38c084859a7aeeb
- action_id: ACT-20260903-4d4fed
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:55:19+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-d3b852
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-922925
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:55:19+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-09d49c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-abf47d:answers
- action_id: ACT-20260903-79b58e
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:55:27+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-abf47d:tool:7d7e7ebd5ccb69d2f3dc0644
- action_id: ACT-20260903-875d52
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:55:39+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-28114a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d9eb27
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:55:39+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-d7f748
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c91527:answers
- action_id: ACT-20260903-3469c7
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:55:52+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c91527:tool:bdfb60db5933d5f980228306
- action_id: ACT-20260903-be5d5f
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:56:01+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-552592
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-879be7
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:56:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f49ff8
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-ef60d6:answers
- action_id: ACT-20260903-4da335
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:56:11+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-ef60d6:tool:6399cf43b2f65719a7218c8b
- action_id: ACT-20260903-cf5b75
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:56:25+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-63d872
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-673e47
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:56:25+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-1fa406
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-fe923e:answers
- action_id: ACT-20260903-b70b99
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:56:42+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-fe923e:tool:a93394a45ca194ee61541416
- action_id: ACT-20260903-982b32
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:57:14+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-466da7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0ece0d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:57:14+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-5bdf8d
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-acee7b:answers
- action_id: ACT-20260903-efbd27
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:57:23+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-acee7b:tool:15d54996d78841976a26384b
- action_id: ACT-20260903-e8063b
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:57:49+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-dcd257
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-a29f8e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:57:49+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-9bc4d5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-06225d:answers
- action_id: ACT-20260903-97d696
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:58:00+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-06225d:tool:973bb857932b58dc3afaf8e3
- action_id: ACT-20260903-d05d8e
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:58:16+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-427c71
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-02542a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:58:17+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-3aeb5a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-66008f:answers
- action_id: ACT-20260903-2acf50
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:58:27+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-66008f:tool:897e831b2dbe3175e80541b0
- action_id: ACT-20260903-d331c7
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:58:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-63fd2b
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-98a3ab
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:58:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-15ed09
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-29c0c2:answers
- action_id: ACT-20260903-16c8a8
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:58:57+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-29c0c2:tool:16149428bf6b5f7bf97ce66b
- action_id: ACT-20260903-a20423
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T23:59:22+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-5c1a06
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-67aecb
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T23:59:22+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-433fd5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-61945a:answers
- action_id: ACT-20260903-52f839
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T23:59:32+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-61945a:tool:bee52aca06d9712306944253
working_ask: 'Advise Mosaic Relay on a merchant self-service refund tool for card,
  ACH, and local payment methods: refund and reversal obligations, AML indicators,
  customer disclosures, recordkeeping, controls against misuse, and when to delay,
  reject, or investigate a refund.'
issues:
- 'AML/financial-crime risk: refunds used to move funds between unrelated cards or
  recipients (structuring/layering)'
- Card network rules on refunds vs. reversals and refund windows
- ACH and local payment return/reversal procedures
- Consumer protection and funds-flow disclosure obligations
- Recordkeeping requirements for refunds and reversals
- Controls against misuse and when to delay, reject, or investigate a refund
- Governance of manual operations overrides, especially for closed accounts
- Whether existing transaction-monitoring covers refunds/reversals (unconfirmed)
open_questions:
- Mosaic Relay's legal entity and licensing status, funds-flow/settlement model, and
  acquiring-partner and network contracts
public_research_questions:
- Card network refund vs. reversal rules and refund windows (Visa/Mastercard)
- ACH and local payment return/reversal procedures and timeframes
- AML structuring/layering indicators involving refunds and reversals
intake_answers:
- answer_id: ANS-20260903-64effa
  question_id: q1_jurisdiction
  question: Which jurisdictions will the self-service refund tool be available in
    at launch?
  answer: Not yet defined
  values:
  - not_yet_defined
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-d3b852
  source_action_key: chat:RUN-20260903-abf47d
  answered_at: '2026-09-03T23:55:19+00:00'
  answer_fact_id: FACT-20260903-09d49c
- answer_id: ANS-20260903-5429d9
  question_id: q2_destination
  question: What refund destination rules will the tool enforce by default?
  answer: Original payer by default, with limited exceptions/overrides
  values:
  - original_payer_default_override
  status: answered
  record_target: fact
  source_id: MSG-20260903-28114a
  source_action_key: chat:RUN-20260903-c91527
  answered_at: '2026-09-03T23:55:39+00:00'
  answer_fact_id: FACT-20260903-d7f748
- answer_id: ANS-20260903-8b184a
  question_id: q3_override_controls
  question: What limits and approvals apply to manual operations overrides, especially
    for closed accounts?
  answer: Overrides require two-person approval and are logged/audited
  values:
  - two_person_approval
  status: answered
  record_target: fact
  source_id: MSG-20260903-552592
  source_action_key: chat:RUN-20260903-ef60d6
  answered_at: '2026-09-03T23:56:01+00:00'
  answer_fact_id: FACT-20260903-f49ff8
- answer_id: ANS-20260903-e5e01e
  question_id: monitoring_coverage
  question: Does Mosaic Relay's existing transaction-monitoring cover refunds and
    reversals, or is this a new monitoring surface?
  answer: Not sure
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260903-63d872
  source_action_key: chat:RUN-20260903-fe923e
  answered_at: '2026-09-03T23:56:25+00:00'
  answer_fact_id: FACT-20260903-1fa406
- answer_id: ANS-20260903-dbb542
  question_id: launch_timing
  question: What is the target launch timing for the tool?
  answer: Not yet defined
  values:
  - not_defined
  status: answered
  record_target: target_date
  source_id: MSG-20260903-466da7
  source_action_key: chat:RUN-20260903-acee7b
  answered_at: '2026-09-03T23:57:15+00:00'
  answer_fact_id: FACT-20260903-5bdf8d
- answer_id: ANS-20260903-687cfe
  question_id: intake-recovery-missing-fact-5dfc4a0b0b
  question: Launch jurisdictions
  answer: Not yet defined; launch jurisdictions are pending product and regulatory
    sign-off.
  values:
  - Not yet defined; launch jurisdictions are pending product and regulatory sign-off.
  status: answered
  record_target: fact
  source_id: MSG-20260903-dcd257
  source_action_key: chat:RUN-20260903-06225d
  answered_at: '2026-09-03T23:57:49+00:00'
  answer_fact_id: FACT-20260903-9bc4d5
- answer_id: ANS-20260903-24a483
  question_id: intake-recovery-missing-fact-b39290f392
  question: Refund windows by payment method
  answer: Not yet defined; confirm card, ACH, and local-method refund and return windows
    with each acquiring partner and processor before launch.
  values:
  - Not yet defined; confirm card, ACH, and local-method refund and return windows
    with each acquiring partner and processor before launch.
  status: answered
  record_target: fact
  source_id: MSG-20260903-427c71
  source_action_key: chat:RUN-20260903-66008f
  answered_at: '2026-09-03T23:58:17+00:00'
  answer_fact_id: FACT-20260903-3aeb5a
- answer_id: ANS-20260903-f39b70
  question_id: intake-recovery-missing-fact-c376bfea44
  question: Target launch timing
  answer: Not yet defined; no firm launch date has been set.
  values:
  - Not yet defined; no firm launch date has been set.
  status: answered
  record_target: fact
  source_id: MSG-20260903-63fd2b
  source_action_key: chat:RUN-20260903-29c0c2
  answered_at: '2026-09-03T23:58:48+00:00'
  answer_fact_id: FACT-20260903-15ed09
- answer_id: ANS-20260903-748dc6
  question_id: intake-recovery-finish
  question: Is there any other fact that would materially change the advice?
  answer: 'Yes: confirm Mosaic Relay''s legal entity and licensing status, funds-flow
    and settlement model, and the applicable acquiring-partner and network contracts.'
  values:
  - 'Yes: confirm Mosaic Relay''s legal entity and licensing status, funds-flow and
    settlement model, and the applicable acquiring-partner and network contracts.'
  status: answered
  record_target: fact
  source_id: MSG-20260903-5c1a06
  source_action_key: chat:RUN-20260903-61945a
  answered_at: '2026-09-03T23:59:22+00:00'
  answer_fact_id: FACT-20260903-433fd5
intake_state: complete
---
# Known Facts

- Mosaic Relay supports payment routing and merchant operations but does not hold customer deposits.
- The proposed tool would allow full or partial refunds across card, ACH, and local payment methods.
- The tool would route refund funds back to the original payer where possible.
- The tool would support manual operations overrides when a merchant account is closed.
- Business goal is to shorten refund processing time and reduce support requests.
- Operations has identified cases where a merchant may use refunds to move funds between unrelated cards or recipients.
- Refund requests may arrive immediately after payment or months later.
- Some payment methods may require separate reversal or return procedures.
- Which jurisdictions will the self-service refund tool be available in at launch? — Not yet defined
- What refund destination rules will the tool enforce by default? — Original payer by default, with limited exceptions/overrides
- What limits and approvals apply to manual operations overrides, especially for closed accounts? — Overrides require two-person approval and are logged/audited
- Does Mosaic Relay's existing transaction-monitoring cover refunds and reversals, or is this a new monitoring surface? — Not sure
- What is the target launch timing for the tool? — Not yet defined
- Launch jurisdictions — Not yet defined; launch jurisdictions are pending product and regulatory sign-off.
- Refund windows by payment method — Not yet defined; confirm card, ACH, and local-method refund and return windows with each acquiring partner and processor before launch.
- Target launch timing — Not yet defined; no firm launch date has been set.
- confirm Mosaic Relay's legal entity and licensing status, funds-flow and settlement model, and the applicable acquiring-partner and network contracts.

## Assumptions

- [Assumption] Refund destination is restricted to the original payer's funding source unless an override applies
- [Assumption] Mosaic Relay's refund obligations vary by payment method and network rules
