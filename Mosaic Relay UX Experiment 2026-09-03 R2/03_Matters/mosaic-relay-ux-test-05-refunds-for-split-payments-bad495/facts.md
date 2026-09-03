---
matter_id: MAT-20260903-bad495
record_type: facts
facts:
- fact_id: FACT-20260903-7329f7
  text: A marketplace wants to issue partial refunds for orders funded by several
    payment methods and distributed among multiple sellers.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-1bc33d
  text: The proposed tool lets a marketplace operator select line items, calculate
    each seller's share, reverse the platform fee, and send status updates to the
    buyer and sellers.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-e36c58
  text: Actors are the marketplace operator, buyer, sellers, Mosaic Relay, and payment
    partners.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-4667ab
  text: Product wants to release the tool in one quarter.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-96f361
  text: Known facts include the allocation rules, refund API, and a requirement to
    support card and ACH transactions.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-63c603
  text: Missing facts include refund deadlines, seller contract terms, tax treatment,
    negative seller balances, chargeback interaction, customer-support overrides,
    and the source of truth for disputed allocations.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2b563
  supersedes: null
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- fact_id: FACT-20260903-e5b653
  text: What refund timing promise does the marketplace intend to make to buyers (e.g.,
    how quickly a refund must be issued and credited back to the original payment
    method)? — Within standard card-network/ACH refund windows (e.g., 5-7 business
    days)
  status: active
  material: true
  source_ids:
  - MSG-20260903-8e7da0
  supersedes: null
  created_at: '2026-09-03T17:13:00+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-1585fd
- fact_id: FACT-20260903-788a6c
  text: On a partial refund, is the platform fee reversed to the buyer, and who absorbs
    the cost? — Fee is prorated to the refunded amount
  status: active
  material: true
  source_ids:
  - MSG-20260903-b5f8a8
  supersedes: null
  created_at: '2026-09-03T17:13:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-5cc06e
- fact_id: FACT-20260903-0a986a
  text: How should a partial refund be handled when it would drive a seller's balance
    negative (e.g., refund exceeds the seller's available funds)? — Allow negative
    but hold future payouts until recovered
  status: active
  material: true
  source_ids:
  - MSG-20260903-300f55
  supersedes: null
  created_at: '2026-09-03T17:13:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2d5632
- fact_id: FACT-20260903-989f35
  text: Does a partial refund close or reduce an existing chargeback/dispute, or are
    refunds and disputes handled independently? — A refund reduces or closes the dispute
    amount
  status: active
  material: true
  source_ids:
  - MSG-20260903-19f014
  supersedes: null
  created_at: '2026-09-03T17:14:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-405627
- fact_id: FACT-20260903-5a209e
  text: Which countries or regions are in scope? — United States only
  status: active
  material: true
  source_ids:
  - MSG-20260903-9f8469
  supersedes: null
  created_at: '2026-09-03T17:14:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ce2980
- fact_id: FACT-20260903-7308b6
  text: Whether a partial refund closes or reduces a chargeback/dispute, or runs independently
    — Use the immutable order ledger and its versioned allocation snapshot at capture
    as the source of truth. Every refund and chargeback must reference that snapshot
    and append an auditable event. A dispute adjustment may only be made by an approved
    reconciliation record; no support edit may overwrite the original allocation.
  status: active
  material: true
  source_ids:
  - MSG-20260903-d9c261
  supersedes: null
  created_at: '2026-09-03T17:15:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f9a7ca
- fact_id: FACT-20260903-b77bb7
  text: Can customer-support staff override the calculated allocation, and who approves
    exceptions? — Override allowed only with a named approver (e.g., manager/legal)
  status: active
  material: true
  source_ids:
  - MSG-20260903-9e9563
  supersedes: null
  created_at: '2026-09-03T17:15:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-afe50d
- fact_id: FACT-20260903-1c5925
  text: What do the seller agreements say about refunds, fee reversal, and notice?
    — Seller terms are silent; need to add/amend terms
  status: active
  material: true
  source_ids:
  - MSG-20260903-584ebe
  supersedes: null
  created_at: '2026-09-03T17:16:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e97f38
sources:
- source_id: REQ-20260903-f2b563
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T17:12:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-bf38cb
- source_id: MSG-20260903-8e7da0
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:13:00+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-1f699c
- source_id: MSG-20260903-b5f8a8
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:13:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-aa8551
- source_id: MSG-20260903-300f55
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:13:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-933585
- source_id: MSG-20260903-19f014
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:14:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3d5fdf
- source_id: MSG-20260903-9f8469
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:14:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d6fabb
- source_id: MSG-20260903-d9c261
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:15:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6399a3
- source_id: MSG-20260903-9e9563
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:15:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-00e42c
- source_id: MSG-20260903-584ebe
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:16:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb13b5
support:
- support_id: SUP-20260903-08ba7e
  fact_id: FACT-20260903-7329f7
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: A marketplace wants to issue partial refunds for orders funded by several
    payment methods and distributed among multiple sellers.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- support_id: SUP-20260903-6d14ec
  fact_id: FACT-20260903-1bc33d
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: The proposed tool lets a marketplace operator select line items, calculate
    each seller's share, reverse the platform fee, and send status updates to the
    buyer and sellers.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- support_id: SUP-20260903-4b61c6
  fact_id: FACT-20260903-e36c58
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: Actors are the marketplace operator, buyer, sellers, Mosaic Relay, and
    payment partners.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- support_id: SUP-20260903-9438bf
  fact_id: FACT-20260903-4667ab
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: Product wants to release the tool in one quarter.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- support_id: SUP-20260903-bf5c39
  fact_id: FACT-20260903-96f361
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: Known facts include the allocation rules, refund API, and a requirement
    to support card and ACH transactions.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- support_id: SUP-20260903-34c9fe
  fact_id: FACT-20260903-63c603
  source_id: REQ-20260903-f2b563
  relationship: support
  statement: Missing facts include refund deadlines, seller contract terms, tax treatment,
    negative seller balances, chargeback interaction, customer-support overrides,
    and the source of truth for disputed allocations.
  location: ''
  created_at: '2026-09-03T17:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
assumptions:
- assumption_id: ASM-20260903-46c7a1
  text: Mosaic Relay is a technology/payments-infrastructure provider, not a bank,
    and does not hold deposits; funds flow through regulated partners.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:12:46+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- assumption_id: ASM-20260903-4d09f3
  text: The marketplace operator, not Mosaic Relay, holds the direct relationship
    with buyers and sellers for refund decisions.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:12:46+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- assumption_id: ASM-20260903-e50930
  text: US-centric regulatory framing applies unless a specific jurisdiction is identified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:12:46+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6acc79
- assumption_id: ASM-20260903-e3609d
  text: US-centric regulatory framing applies (jurisdiction scope confirmed as United
    States only).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:15:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-8f20b0
conflicts: []
actions:
- action_id: ACT-20260903-bf38cb
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T17:12:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-f2b563
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6acc79
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:12:46+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7329f7
    - FACT-20260903-1bc33d
    - FACT-20260903-e36c58
    - FACT-20260903-4667ab
    - FACT-20260903-96f361
    - FACT-20260903-63c603
    sources: []
    support:
    - SUP-20260903-08ba7e
    - SUP-20260903-6d14ec
    - SUP-20260903-4b61c6
    - SUP-20260903-9438bf
    - SUP-20260903-bf5c39
    - SUP-20260903-34c9fe
    assumptions:
    - ASM-20260903-46c7a1
    - ASM-20260903-4d09f3
    - ASM-20260903-e50930
  source_action_key: chat:RUN-20260903-7b2d1b:tool:9d6ade7430c506dfa508829a
- action_id: ACT-20260903-1f699c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:13:00+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8e7da0
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-1585fd
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:13:00+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-e5b653
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-33d184:answers
- action_id: ACT-20260903-1a0225
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:13:07+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-33d184:tool:6b1157740224a57085a523c3
- action_id: ACT-20260903-aa8551
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:13:26+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-b5f8a8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-5cc06e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:13:26+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-788a6c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-04b96d:answers
- action_id: ACT-20260903-7e528b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:13:40+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-04b96d:tool:ca4fc8869da2862811a5051b
- action_id: ACT-20260903-933585
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:13:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-300f55
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-2d5632
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:13:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0a986a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-e620c3:answers
- action_id: ACT-20260903-3694cc
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:14:10+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-e620c3:tool:69311036c206afad02ff1c3b
- action_id: ACT-20260903-3d5fdf
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:14:30+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-19f014
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-405627
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:14:30+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-989f35
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-785002:answers
- action_id: ACT-20260903-d6fabb
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:14:54+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9f8469
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-ce2980
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:14:54+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-5a209e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-206c13:answers
- action_id: ACT-20260903-6399a3
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:15:18+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-d9c261
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f9a7ca
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:15:18+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7308b6
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-8281f1:answers
- action_id: ACT-20260903-8f20b0
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:15:34+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-e3609d
  source_action_key: chat:RUN-20260903-8281f1:tool:b40a5891805022aae9fc4435
- action_id: ACT-20260903-00e42c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:15:55+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9e9563
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-afe50d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:15:55+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b77bb7
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-be54b8:answers
- action_id: ACT-20260903-6a5083
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:16:06+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-be54b8:tool:fbbc9a5592aa242cb9f8b61a
- action_id: ACT-20260903-eb13b5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:16:18+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-584ebe
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e97f38
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:16:19+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-1c5925
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2ef720:answers
- action_id: ACT-20260903-5c2e3d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:16:32+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2ef720:tool:d462988a0c0690d8f90fad09
working_ask: A marketplace wants to issue partial refunds for orders funded by several
  payment methods and distributed among multiple sellers. The proposed tool lets a
  marketplace operator select line items, calculate each seller's share, reverse the
  platform fee, and send status updates to the buyer and sellers. Product wants to
  release in one quarter. Legal must specify the refund rules, disclosures, timing
  promises, ledger controls, seller notices, and exception approvals to require.
issues:
- Seller contract terms are silent on refunds, fee reversal, and notice - the tool's
  behavior is not currently contractually supported and terms must be amended
- Double-recovery risk between partial refunds and chargebacks/disputes - mitigated
  by the immutable order ledger source-of-truth rule
- Tax treatment of refunds and fee reversals is unaddressed
- Ledger controls for negative seller balances and held payouts need build-out
- Customer-support override requires a named-approver control and audit trail
open_questions:
- Tax treatment of refunds and fee reversals
- Refund deadlines per payment method (card vs ACH) beyond the 5-7 business day promise
- Whether seller term amendments are drafted and who owns them
public_research_questions: []
intake_answers:
- answer_id: ANS-20260903-87b4d0
  question_id: q1_refund_timing
  question: What refund timing promise does the marketplace intend to make to buyers
    (e.g., how quickly a refund must be issued and credited back to the original payment
    method)?
  answer: Within standard card-network/ACH refund windows (e.g., 5-7 business days)
  values:
  - network_standard
  status: answered
  record_target: fact
  source_id: MSG-20260903-8e7da0
  source_action_key: chat:RUN-20260903-33d184
  answered_at: '2026-09-03T17:13:00+00:00'
  answer_fact_id: FACT-20260903-e5b653
- answer_id: ANS-20260903-2972d9
  question_id: q2_fee_reversal
  question: On a partial refund, is the platform fee reversed to the buyer, and who
    absorbs the cost?
  answer: Fee is prorated to the refunded amount
  values:
  - fee_prorated
  status: answered
  record_target: fact
  source_id: MSG-20260903-b5f8a8
  source_action_key: chat:RUN-20260903-04b96d
  answered_at: '2026-09-03T17:13:26+00:00'
  answer_fact_id: FACT-20260903-788a6c
- answer_id: ANS-20260903-8b7aa5
  question_id: q3_negative_balance
  question: How should a partial refund be handled when it would drive a seller's
    balance negative (e.g., refund exceeds the seller's available funds)?
  answer: Allow negative but hold future payouts until recovered
  values:
  - hold_future_payouts
  status: answered
  record_target: fact
  source_id: MSG-20260903-300f55
  source_action_key: chat:RUN-20260903-e620c3
  answered_at: '2026-09-03T17:13:57+00:00'
  answer_fact_id: FACT-20260903-0a986a
- answer_id: ANS-20260903-373d23
  question_id: q_chargeback
  question: Does a partial refund close or reduce an existing chargeback/dispute,
    or are refunds and disputes handled independently?
  answer: A refund reduces or closes the dispute amount
  values:
  - refund_reduces
  status: answered
  record_target: fact
  source_id: MSG-20260903-19f014
  source_action_key: chat:RUN-20260903-785002
  answered_at: '2026-09-03T17:14:30+00:00'
  answer_fact_id: FACT-20260903-989f35
- answer_id: ANS-20260903-48c0b9
  question_id: intake-recovery-jurisdiction
  question: Which countries or regions are in scope?
  answer: United States only
  values:
  - choice_1
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-9f8469
  source_action_key: chat:RUN-20260903-206c13
  answered_at: '2026-09-03T17:14:54+00:00'
  answer_fact_id: FACT-20260903-5a209e
- answer_id: ANS-20260903-54c722
  question_id: intake-recovery-missing-fact-629d3432cf
  question: Whether a partial refund closes or reduces a chargeback/dispute, or runs
    independently
  answer: Use the immutable order ledger and its versioned allocation snapshot at
    capture as the source of truth. Every refund and chargeback must reference that
    snapshot and append an auditable event. A dispute adjustment may only be made
    by an approved reconciliation record; no support edit may overwrite the original
    allocation.
  values:
  - Use the immutable order ledger and its versioned allocation snapshot at capture
    as the source of truth. Every refund and chargeback must reference that snapshot
    and append an auditable event. A dispute adjustment may only be made by an approved
    reconciliation record; no support edit may overwrite the original allocation.
  status: answered
  record_target: fact
  source_id: MSG-20260903-d9c261
  source_action_key: chat:RUN-20260903-8281f1
  answered_at: '2026-09-03T17:15:18+00:00'
  answer_fact_id: FACT-20260903-7308b6
- answer_id: ANS-20260903-cafe69
  question_id: q_override
  question: Can customer-support staff override the calculated allocation, and who
    approves exceptions?
  answer: Override allowed only with a named approver (e.g., manager/legal)
  values:
  - override_with_approval
  status: answered
  record_target: fact
  source_id: MSG-20260903-9e9563
  source_action_key: chat:RUN-20260903-be54b8
  answered_at: '2026-09-03T17:15:55+00:00'
  answer_fact_id: FACT-20260903-b77bb7
- answer_id: ANS-20260903-d4d14a
  question_id: Q-seller-terms
  question: What do the seller agreements say about refunds, fee reversal, and notice?
  answer: Seller terms are silent; need to add/amend terms
  values:
  - contract_silent
  status: answered
  record_target: fact
  source_id: MSG-20260903-584ebe
  source_action_key: chat:RUN-20260903-2ef720
  answered_at: '2026-09-03T17:16:19+00:00'
  answer_fact_id: FACT-20260903-1c5925
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - A marketplace wants to issue partial refunds for orders funded by several
      payment methods and distributed among multiple sellers.

      - The proposed tool lets a marketplace operator select line items, calculate
      each seller''s share, reverse the platform fee, and send status updates to the
      buyer and sellers.

      - Actors are the marketplace operator, buyer, sellers, Mosaic Relay, and payment
      partners.

      - Product wants to release the tool in one quarter.

      - Known facts include the allocation rules, refund API, and a requirement to
      support card and ACH transactions.

      - Missing facts include refund deadlines, seller contract terms, tax treatment,
      negative seller balances, chargeback interaction, customer-support overrides,
      and the source of truth for disputed allocations.

      - What refund timing promise does the marketplace intend to make to buyers (e.g.,
      how quickly a refund must be issued and credited back to the original payment
      method)? — Within standard card-network/ACH refund windows (e.g., 5-7 business
      days)

      - On a partial refund, is the platform fee reversed to the buyer, and who absorbs
      the cost? — Fee is prorated to the refunded amount

      - How should a partial refund be handled when it would drive a seller''s balance
      negative (e.g., refund exceeds the seller''s available funds)? — Allow negative
      but hold future payouts until recovered

      - Does a partial refund close or reduce an existing chargeback/dispute, or are
      refunds and disputes handled independently? — A refund reduces or closes the
      dispute amount

      - Which countries or regions are in scope? — United States only

      - Whether a partial refund closes or reduces a chargeback/dispute, or runs independently
      — Use the immutable order ledger and its versioned allocation snapshot at capture
      as the source of truth. Every refund and chargeback must reference that snapshot
      and append an auditable event. A dispute adjustment may only be made by an approved
      reconciliation record; no support edit may overwrite the original allocation.

      - Can customer-support staff override the calculated allocation, and who approves
      exceptions? — Override allowed only with a named approver (e.g., manager/legal)

      - What do the seller agreements say about refunds, fee reversal, and notice?
      — Seller terms are silent; need to add/amend terms


      ## Assumptions


      - [Assumption] Mosaic Relay is a technology/payments-infrastructure provider,
      not a bank, and does not hold deposits; funds flow through regulated partners.

      - [Assumption] The marketplace operator, not Mosaic Relay, holds the direct
      relationship with buyers and sellers for refund decisions.

      - [Assumption] US-centric regulatory framing applies unless a specific jurisdiction
      is identified.

      - [Assumption] US-centric regulatory framing applies (jurisdiction scope confirmed
      as United States only).

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

- A marketplace wants to issue partial refunds for orders funded by several payment methods and distributed among multiple sellers.
- The proposed tool lets a marketplace operator select line items, calculate each seller's share, reverse the platform fee, and send status updates to the buyer and sellers.
- Actors are the marketplace operator, buyer, sellers, Mosaic Relay, and payment partners.
- Product wants to release the tool in one quarter.
- Known facts include the allocation rules, refund API, and a requirement to support card and ACH transactions.
- Missing facts include refund deadlines, seller contract terms, tax treatment, negative seller balances, chargeback interaction, customer-support overrides, and the source of truth for disputed allocations.
- What refund timing promise does the marketplace intend to make to buyers (e.g., how quickly a refund must be issued and credited back to the original payment method)? — Within standard card-network/ACH refund windows (e.g., 5-7 business days)
- On a partial refund, is the platform fee reversed to the buyer, and who absorbs the cost? — Fee is prorated to the refunded amount
- How should a partial refund be handled when it would drive a seller's balance negative (e.g., refund exceeds the seller's available funds)? — Allow negative but hold future payouts until recovered
- Does a partial refund close or reduce an existing chargeback/dispute, or are refunds and disputes handled independently? — A refund reduces or closes the dispute amount
- Which countries or regions are in scope? — United States only
- Whether a partial refund closes or reduces a chargeback/dispute, or runs independently — Use the immutable order ledger and its versioned allocation snapshot at capture as the source of truth. Every refund and chargeback must reference that snapshot and append an auditable event. A dispute adjustment may only be made by an approved reconciliation record; no support edit may overwrite the original allocation.
- Can customer-support staff override the calculated allocation, and who approves exceptions? — Override allowed only with a named approver (e.g., manager/legal)
- What do the seller agreements say about refunds, fee reversal, and notice? — Seller terms are silent; need to add/amend terms

## Assumptions

- [Assumption] Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not hold deposits; funds flow through regulated partners.
- [Assumption] The marketplace operator, not Mosaic Relay, holds the direct relationship with buyers and sellers for refund decisions.
- [Assumption] US-centric regulatory framing applies unless a specific jurisdiction is identified.
- [Assumption] US-centric regulatory framing applies (jurisdiction scope confirmed as United States only).
