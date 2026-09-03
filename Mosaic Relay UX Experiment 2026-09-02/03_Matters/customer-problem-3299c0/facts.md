---
matter_id: MAT-20260903-3299c0
record_type: facts
facts:
- fact_id: FACT-20260903-600dc0
  text: A customer reported an unauthorized transfer by phone.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac544d
  supersedes: null
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- fact_id: FACT-20260903-9d04e2
  text: Mosaic Relay's procedures ask the customer to submit a written statement within
    10 business days.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac544d
  supersedes: null
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- fact_id: FACT-20260903-65422d
  text: The question is whether the investigation or provisional credit can be delayed
    until the written statement is received.
  status: active
  material: true
  source_ids:
  - REQ-20260903-ac544d
  supersedes: null
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- fact_id: FACT-20260903-df7eec
  text: What type of account or transfer is involved in this unauthorized-transfer
    report? — Consumer account (individual customer's own funds)
  status: active
  material: true
  source_ids:
  - MSG-20260903-06400b
  supersedes: null
  created_at: '2026-09-03T00:29:02+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2ae09c
sources:
- source_id: REQ-20260903-ac544d
  kind: immutable_request
  label: Original request
  path: 03_Matters/customer-problem-3299c0/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T00:26:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f6e608
- source_id: MSG-20260903-06400b
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T00:29:02+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0b313d
support:
- support_id: SUP-20260903-9b134b
  fact_id: FACT-20260903-600dc0
  source_id: REQ-20260903-ac544d
  relationship: support
  statement: A customer reported an unauthorized transfer by phone.
  location: ''
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- support_id: SUP-20260903-796a87
  fact_id: FACT-20260903-9d04e2
  source_id: REQ-20260903-ac544d
  relationship: support
  statement: Mosaic Relay's procedures ask the customer to submit a written statement
    within 10 business days.
  location: ''
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- support_id: SUP-20260903-11fea2
  fact_id: FACT-20260903-65422d
  source_id: REQ-20260903-ac544d
  relationship: support
  statement: The question is whether the investigation or provisional credit can be
    delayed until the written statement is received.
  location: ''
  created_at: '2026-09-03T00:26:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-da5055
assumptions:
- assumption_id: ASM-20260903-dd612e
  text: The unauthorized transfer relates to a Mosaic Relay payment product or money-movement
    service
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T00:26:55+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- assumption_id: ASM-20260903-927772
  text: The 10-business-day written-statement procedure is an internal Mosaic Relay
    policy rather than a statutory requirement
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T00:26:55+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-da5055
- assumption_id: ASM-20260903-51431c
  text: The unauthorized transfer relates to a Mosaic Relay payment product or money-movement
    service.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T00:29:09+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-fdb689
- assumption_id: ASM-20260903-f2e66d
  text: The 10-business-day written-statement procedure is an internal Mosaic Relay
    policy rather than a statutory requirement.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T00:29:09+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-fdb689
- assumption_id: ASM-20260903-0a320e
  text: The oral phone report constitutes a valid Regulation E error notice that starts
    the investigation clock.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T00:29:09+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-fdb689
conflicts: []
actions:
- action_id: ACT-20260903-f6e608
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T00:26:47+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-ac544d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-da5055
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T00:26:55+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-600dc0
    - FACT-20260903-9d04e2
    - FACT-20260903-65422d
    sources: []
    support:
    - SUP-20260903-9b134b
    - SUP-20260903-796a87
    - SUP-20260903-11fea2
    assumptions:
    - ASM-20260903-dd612e
    - ASM-20260903-927772
  source_action_key: chat:RUN-20260903-eab165:tool:4b921efb1cf65a7152c5f9cb
- action_id: ACT-20260903-0b313d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T00:29:02+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-06400b
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-2ae09c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T00:29:02+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-df7eec
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-1bf751:answers
- action_id: ACT-20260903-fdb689
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T00:29:09+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-51431c
    - ASM-20260903-f2e66d
    - ASM-20260903-0a320e
  source_action_key: chat:RUN-20260903-1bf751:tool:2f9e2fba547a137d9971cc6c
working_ask: A customer reports an unauthorized transfer by phone, but Mosaic Relay's
  procedures ask them to submit a written statement within 10 business days. Can Mosaic
  Relay delay the investigation or provisional credit until it receives the written
  statement?
issues:
- Whether delaying the investigation or provisional credit until a written statement
  is received complies with Regulation E / EFTA error-resolution and provisional-credit
  timing rules (12 CFR 1005.11).
- Whether the 10-business-day written-statement requirement is permissible or conflicts
  with the Regulation E investigation/provisional-credit deadlines, given that an
  oral report starts the clock.
- Whether Mosaic Relay's role as a payment-infrastructure provider (not a bank) affects
  which entity bears the Regulation E error-resolution obligation.
open_questions:
- Which payment rail or product is involved (card, ACH, wire, payout).
- Where the 10-business-day written-statement requirement comes from (internal policy,
  contract, or network/regulatory rule).
- Whether Mosaic Relay is the institution obligated under Regulation E or acts through
  a partner/issuing bank.
public_research_questions:
- What are the investigation and provisional-credit deadlines under Regulation E /
  EFTA (12 CFR 1005.11) for a reported unauthorized electronic fund transfer, and
  can they be conditioned on a written statement?
intake_answers:
- answer_id: ANS-20260903-18e4eb
  question_id: account_type
  question: What type of account or transfer is involved in this unauthorized-transfer
    report?
  answer: Consumer account (individual customer's own funds)
  values:
  - consumer_account
  status: answered
  record_target: fact
  source_id: MSG-20260903-06400b
  source_action_key: chat:RUN-20260903-1bf751
  answered_at: '2026-09-03T00:29:02+00:00'
  answer_fact_id: FACT-20260903-df7eec
intake_state: active
---
# Known Facts

- A customer reported an unauthorized transfer by phone.
- Mosaic Relay's procedures ask the customer to submit a written statement within 10 business days.
- The question is whether the investigation or provisional credit can be delayed until the written statement is received.
- What type of account or transfer is involved in this unauthorized-transfer report? — Consumer account (individual customer's own funds)

## Assumptions

- [Assumption] The unauthorized transfer relates to a Mosaic Relay payment product or money-movement service
- [Assumption] The 10-business-day written-statement procedure is an internal Mosaic Relay policy rather than a statutory requirement
- [Assumption] The unauthorized transfer relates to a Mosaic Relay payment product or money-movement service.
- [Assumption] The 10-business-day written-statement procedure is an internal Mosaic Relay policy rather than a statutory requirement.
- [Assumption] The oral phone report constitutes a valid Regulation E error notice that starts the investigation clock.
