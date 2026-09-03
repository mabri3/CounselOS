---
matter_id: MAT-20260903-fe95b6
record_type: facts
facts:
- fact_id: FACT-20260903-b150a0
  text: Mosaic Relay already calculates transaction risk scores for customers.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-9f6040
  text: Mosaic Relay already manages payout controls for customers.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-ce8067
  text: Proposed UX shows the merchant a banner explaining a review is in progress
    and prevents payout for the affected amount.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-1915ec
  text: The proposed UX lets the merchant submit invoices or fulfillment evidence
    during the review.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-ba6391
  text: Operations may release the funds, extend the review, reverse the payment,
    or deactivate processing.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-00281a
  text: The hold applies to card and ACH proceeds.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-c6dd9c
  text: Product wants an initial version live in one quarter.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-8d6fe6
  text: Actors include the merchant, its customers, Mosaic Relay risk and operations
    teams, acquiring banks, processors, card networks, and fraud vendors.
  status: active
  material: true
  source_ids:
  - REQ-20260903-3031c7
  supersedes: null
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- fact_id: FACT-20260903-b021b1
  text: What is the proposed maximum hold period, and will it differ for card vs.
    ACH transactions? — Not decided yet
  status: active
  material: true
  source_ids:
  - MSG-20260903-792733
  supersedes: null
  created_at: '2026-09-03T09:00:37+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6f6c1a
- fact_id: FACT-20260903-095e8e
  text: What does the current merchant agreement permit regarding holds on proceeds?
    — Unknown — need to check
  status: active
  material: true
  source_ids:
  - MSG-20260903-68c9cc
  supersedes: null
  created_at: '2026-09-03T09:00:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-827e21
- fact_id: FACT-20260903-f33225
  text: May the held funds be used to cover chargebacks, returns, or fees? — Not decided
    yet
  status: active
  material: true
  source_ids:
  - MSG-20260903-849641
  supersedes: null
  created_at: '2026-09-03T09:01:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-872522
- fact_id: FACT-20260903-968a72
  text: Is a specific appeal process required for merchants to contest a hold? — Not
    decided yet
  status: active
  material: true
  source_ids:
  - MSG-20260903-61befe
  supersedes: null
  created_at: '2026-09-03T09:01:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-5bd52e
- fact_id: FACT-20260903-adcb11
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260903-9dd8c7
  supersedes: null
  created_at: '2026-09-03T09:01:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7bea4f
sources:
- source_id: REQ-20260903-3031c7
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-03-payment-holds-during-fraud-review-fe95b6/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T08:59:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7f525c
- source_id: MSG-20260903-792733
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:00:37+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-5d6e57
- source_id: MSG-20260903-68c9cc
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:00:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-979e6d
- source_id: MSG-20260903-849641
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:01:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-aa503a
- source_id: MSG-20260903-61befe
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:01:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0ee3c5
- source_id: MSG-20260903-9dd8c7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:01:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-24c1cb
support:
- support_id: SUP-20260903-4dc497
  fact_id: FACT-20260903-b150a0
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Mosaic Relay already calculates transaction risk scores for customers.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-21da6a
  fact_id: FACT-20260903-9f6040
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Mosaic Relay already manages payout controls for customers.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-98f602
  fact_id: FACT-20260903-ce8067
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Proposed UX shows the merchant a banner explaining a review is in progress
    and prevents payout for the affected amount.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-15e016
  fact_id: FACT-20260903-1915ec
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: The proposed UX lets the merchant submit invoices or fulfillment evidence
    during the review.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-5b2768
  fact_id: FACT-20260903-ba6391
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Operations may release the funds, extend the review, reverse the payment,
    or deactivate processing.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-24c4cd
  fact_id: FACT-20260903-00281a
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: The hold applies to card and ACH proceeds.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-2505db
  fact_id: FACT-20260903-c6dd9c
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Product wants an initial version live in one quarter.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- support_id: SUP-20260903-c77405
  fact_id: FACT-20260903-8d6fe6
  source_id: REQ-20260903-3031c7
  relationship: support
  statement: Actors include the merchant, its customers, Mosaic Relay risk and operations
    teams, acquiring banks, processors, card networks, and fraud vendors.
  location: ''
  created_at: '2026-09-03T09:00:06+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
assumptions:
- assumption_id: ASM-20260903-ad7f28
  text: Mosaic Relay does not hold deposits or operate as a bank; holds are of merchant
    proceeds pending payout, not customer deposits.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:00:06+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- assumption_id: ASM-20260903-b9b527
  text: The merchant agreement is the primary source of contractual hold authority
    and will need to permit the hold.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:00:06+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- assumption_id: ASM-20260903-8537d8
  text: U.S. scope for this initial version, consistent with the company profile.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:00:06+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-f3b23c
- assumption_id: ASM-20260903-3825d4
  text: The merchant agreement is the primary source of contractual hold authority
    and will need to permit the hold; its current terms are unverified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:02:05+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-4ed621
conflicts: []
actions:
- action_id: ACT-20260903-7f525c
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T08:59:56+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-3031c7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f3b23c
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:00:06+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b150a0
    - FACT-20260903-9f6040
    - FACT-20260903-ce8067
    - FACT-20260903-1915ec
    - FACT-20260903-ba6391
    - FACT-20260903-00281a
    - FACT-20260903-c6dd9c
    - FACT-20260903-8d6fe6
    sources: []
    support:
    - SUP-20260903-4dc497
    - SUP-20260903-21da6a
    - SUP-20260903-98f602
    - SUP-20260903-15e016
    - SUP-20260903-5b2768
    - SUP-20260903-24c4cd
    - SUP-20260903-2505db
    - SUP-20260903-c77405
    assumptions:
    - ASM-20260903-ad7f28
    - ASM-20260903-b9b527
    - ASM-20260903-8537d8
  source_action_key: chat:RUN-20260903-4cc14d:tool:5f0746d68d9282856da9a46d
- action_id: ACT-20260903-5d6e57
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:00:37+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-792733
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6f6c1a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:00:37+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b021b1
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0251ff:answers
- action_id: ACT-20260903-50b1a9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:00:45+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0251ff:tool:79dbcee7482486bea2a56688
- action_id: ACT-20260903-979e6d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:00:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-68c9cc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-827e21
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:00:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-095e8e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-5ddfa5:answers
- action_id: ACT-20260903-c0910f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:01:05+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-5ddfa5:tool:2ef2770f2af7fbced45a4544
- action_id: ACT-20260903-aa503a
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:01:16+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-849641
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-872522
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:01:16+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f33225
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-4bdb8a:answers
- action_id: ACT-20260903-e658c5
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:01:25+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-4bdb8a:tool:c6eef2f75b8503e30704b388
- action_id: ACT-20260903-0ee3c5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:01:43+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-61befe
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-5bd52e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:01:43+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-968a72
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-494b6e:answers
- action_id: ACT-20260903-24c1cb
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:01:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9dd8c7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-7bea4f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:01:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-adcb11
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-a8db02:answers
- action_id: ACT-20260903-4ed621
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:02:05+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-3825d4
  source_action_key: chat:RUN-20260903-a8db02:tool:56492c86612d2c8caa744b6f
working_ask: Advise on lawful hold authority, timing limits, disclosure language,
  treatment of funds, appeal rights, and any regulatory or network requirements for
  a payment-operations control that temporarily holds a merchant's card or ACH proceeds
  during fraud review, before Product approves the design for a one-quarter launch.
issues:
- Lawful authority to hold merchant proceeds pending fraud review (contractual vs.
  regulatory basis)
- Timing limits on holds for card vs. ACH and any maximum hold period
- Treatment of held funds (whether they can be used to cover chargebacks, returns,
  or fees)
- Required customer-facing disclosure language and notice timing
- Whether a specific appeal process is required
- Card network and processor rules governing holds, reversals, and deactivation
- Money transmission / funds-flow implications of holding proceeds
open_questions:
- Current merchant agreement hold provisions
- Whether a specific appeal process is required
- Required customer-facing notice language and timing
public_research_questions:
- Card network rules (Visa/Mastercard) on merchant holds, reversals, and deactivation
  during fraud review
- State money transmission and UCC Article 4A / NACHA rules on holding ACH proceeds
- Consumer protection and merchant disclosure requirements for holds on proceeds
intake_answers:
- answer_id: ANS-20260903-34280a
  question_id: hold_period
  question: What is the proposed maximum hold period, and will it differ for card
    vs. ACH transactions?
  answer: Not decided yet
  values:
  - not_decided
  status: answered
  record_target: fact
  source_id: MSG-20260903-792733
  source_action_key: chat:RUN-20260903-0251ff
  answered_at: '2026-09-03T09:00:37+00:00'
  answer_fact_id: FACT-20260903-b021b1
- answer_id: ANS-20260903-9c93aa
  question_id: merchant_agreement_authority
  question: What does the current merchant agreement permit regarding holds on proceeds?
  answer: Unknown — need to check
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-68c9cc
  source_action_key: chat:RUN-20260903-5ddfa5
  answered_at: '2026-09-03T09:00:57+00:00'
  answer_fact_id: FACT-20260903-095e8e
- answer_id: ANS-20260903-009e66
  question_id: q_treatment_funds
  question: May the held funds be used to cover chargebacks, returns, or fees?
  answer: Not decided yet
  values:
  - not_decided
  status: answered
  record_target: fact
  source_id: MSG-20260903-849641
  source_action_key: chat:RUN-20260903-4bdb8a
  answered_at: '2026-09-03T09:01:16+00:00'
  answer_fact_id: FACT-20260903-f33225
- answer_id: ANS-20260903-52a12b
  question_id: appeal_process
  question: Is a specific appeal process required for merchants to contest a hold?
  answer: Not decided yet
  values:
  - not_decided
  status: answered
  record_target: fact
  source_id: MSG-20260903-61befe
  source_action_key: chat:RUN-20260903-494b6e
  answered_at: '2026-09-03T09:01:43+00:00'
  answer_fact_id: FACT-20260903-968a72
- answer_id: ANS-20260903-193f18
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260903-9dd8c7
  source_action_key: chat:RUN-20260903-a8db02
  answered_at: '2026-09-03T09:01:57+00:00'
  answer_fact_id: FACT-20260903-adcb11
intake_state: complete
---
# Known Facts

- Mosaic Relay already calculates transaction risk scores for customers.
- Mosaic Relay already manages payout controls for customers.
- Proposed UX shows the merchant a banner explaining a review is in progress and prevents payout for the affected amount.
- The proposed UX lets the merchant submit invoices or fulfillment evidence during the review.
- Operations may release the funds, extend the review, reverse the payment, or deactivate processing.
- The hold applies to card and ACH proceeds.
- Product wants an initial version live in one quarter.
- Actors include the merchant, its customers, Mosaic Relay risk and operations teams, acquiring banks, processors, card networks, and fraud vendors.
- What is the proposed maximum hold period, and will it differ for card vs. ACH transactions? — Not decided yet
- What does the current merchant agreement permit regarding holds on proceeds? — Unknown — need to check
- May the held funds be used to cover chargebacks, returns, or fees? — Not decided yet
- Is a specific appeal process required for merchants to contest a hold? — Not decided yet
- When does the business need the legal answer? — Before a planned launch

## Assumptions

- [Assumption] Mosaic Relay does not hold deposits or operate as a bank; holds are of merchant proceeds pending payout, not customer deposits.
- [Assumption] The merchant agreement is the primary source of contractual hold authority and will need to permit the hold.
- [Assumption] U.S. scope for this initial version, consistent with the company profile.
- [Assumption] The merchant agreement is the primary source of contractual hold authority and will need to permit the hold; its current terms are unverified.
