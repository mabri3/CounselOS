---
matter_id: MAT-20260902-475535
record_type: facts
facts:
- fact_id: FACT-20260902-7805a6
  text: Mosaic Relay wants an automated control that pauses ACH debits, credits, and
    seller payouts when transaction-risk signals exceed a threshold.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-d96389
  text: The control would place a temporary hold, show the merchant a generic explanation,
    and create an investigation task for Payment Operations.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-75f56b
  text: Signals may include sudden volume growth, account takeover indicators, return
    rates, sanctions-screening matches, and mismatches between merchant profile and
    transaction behavior.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-7db7b0
  text: The control would operate continuously, with an initial hold of 24 hours and
    extensions approved by a risk manager.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-dfd308
  text: The company wants to reduce fraud losses and avoid sending funds that may
    later be returned.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-692a11
  text: The control would not be described as a legal determination, and funds would
    be released when review is complete or the transaction is confirmed legitimate.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-c3308b
  text: Mosaic Relay is not a bank, does not hold deposits, and relies on regulated
    partners for parts of the payment chain.
  status: active
  material: true
  source_ids:
  - REQ-20260902-50455e
  supersedes: null
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- fact_id: FACT-20260902-d51ddf
  text: Which jurisdictions do the merchants, payers, and recipients sit in? This
    drives which ACH rules (e.g., NACHA), Reg E, and state money-transmission laws
    apply. — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260902-50f4b4
  supersedes: null
  created_at: '2026-09-02T14:45:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-51d591
- fact_id: FACT-20260902-641faa
  text: When a hold is placed, do the funds stay with the acquiring/ACH partner, or
    does Mosaic Relay take custody of them? — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260902-360179
  supersedes: null
  created_at: '2026-09-02T14:46:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6f25aa
- fact_id: FACT-20260902-c742fc
  text: Are any of these consumer-originated payments, or is this B2B only? — Not
    sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260902-4d5ad9
  supersedes: null
  created_at: '2026-09-02T14:46:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-11147a
- fact_id: FACT-20260902-81d390
  text: What is the intended maximum hold period and how are extensions handled? —
    24 hours with risk-manager-approved extensions
  status: active
  material: true
  source_ids:
  - MSG-20260902-01c95d
  supersedes: null
  created_at: '2026-09-02T14:47:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-266fb0
- fact_id: FACT-20260902-327973
  text: When does the business need the legal answer? — Continue with assumptions
  status: active
  material: true
  source_ids:
  - MSG-20260902-6f8e1e
  supersedes: null
  created_at: '2026-09-02T14:47:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-e08438
sources:
- source_id: REQ-20260902-50455e
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-03-ach-payment-holds-for-suspicious-merchan-475535/request.md
  version: ''
  location: ''
  created_at: '2026-09-02T14:45:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-48aa12
- source_id: MSG-20260902-50f4b4
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:45:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-cd8964
- source_id: MSG-20260902-360179
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:46:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-b80005
- source_id: MSG-20260902-4d5ad9
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:46:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-e9a8ae
- source_id: MSG-20260902-01c95d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:47:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-d35370
- source_id: MSG-20260902-6f8e1e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:47:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-313477
support:
- support_id: SUP-20260902-163126
  fact_id: FACT-20260902-7805a6
  source_id: REQ-20260902-50455e
  relationship: support
  statement: Mosaic Relay wants an automated control that pauses ACH debits, credits,
    and seller payouts when transaction-risk signals exceed a threshold.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-948cdc
  fact_id: FACT-20260902-d96389
  source_id: REQ-20260902-50455e
  relationship: support
  statement: The control would place a temporary hold, show the merchant a generic
    explanation, and create an investigation task for Payment Operations.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-1336d4
  fact_id: FACT-20260902-75f56b
  source_id: REQ-20260902-50455e
  relationship: support
  statement: Signals may include sudden volume growth, account takeover indicators,
    return rates, sanctions-screening matches, and mismatches between merchant profile
    and transaction behavior.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-b3dd06
  fact_id: FACT-20260902-7db7b0
  source_id: REQ-20260902-50455e
  relationship: support
  statement: The control would operate continuously, with an initial hold of 24 hours
    and extensions approved by a risk manager.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-49af87
  fact_id: FACT-20260902-dfd308
  source_id: REQ-20260902-50455e
  relationship: support
  statement: The company wants to reduce fraud losses and avoid sending funds that
    may later be returned.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-27703b
  fact_id: FACT-20260902-692a11
  source_id: REQ-20260902-50455e
  relationship: support
  statement: The control would not be described as a legal determination, and funds
    would be released when review is complete or the transaction is confirmed legitimate.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- support_id: SUP-20260902-8e9af0
  fact_id: FACT-20260902-c3308b
  source_id: REQ-20260902-50455e
  relationship: support
  statement: Mosaic Relay is not a bank, does not hold deposits, and relies on regulated
    partners for parts of the payment chain.
  location: ''
  created_at: '2026-09-02T14:45:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
assumptions:
- assumption_id: ASM-20260902-e33e84
  text: Mosaic Relay does not itself hold or take custody of the held funds; holds
    are implemented through partner/acquiring arrangements.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:45:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- assumption_id: ASM-20260902-16a4c5
  text: The control applies to ACH transactions in the US governed by NACHA Operating
    Rules.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:45:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
- assumption_id: ASM-20260902-d010e5
  text: Holds are temporary and funds are ultimately released or returned consistent
    with the underlying transaction.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:45:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-3f5d7d
conflicts: []
actions:
- action_id: ACT-20260902-48aa12
  summary: Linked Original request
  actor: system
  created_at: '2026-09-02T14:45:05+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260902-50455e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-3f5d7d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:45:15+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-7805a6
    - FACT-20260902-d96389
    - FACT-20260902-75f56b
    - FACT-20260902-7db7b0
    - FACT-20260902-dfd308
    - FACT-20260902-692a11
    - FACT-20260902-c3308b
    sources: []
    support:
    - SUP-20260902-163126
    - SUP-20260902-948cdc
    - SUP-20260902-1336d4
    - SUP-20260902-b3dd06
    - SUP-20260902-49af87
    - SUP-20260902-27703b
    - SUP-20260902-8e9af0
    assumptions:
    - ASM-20260902-e33e84
    - ASM-20260902-16a4c5
    - ASM-20260902-d010e5
  source_action_key: chat:RUN-20260902-333ab6:tool:5be9c85b7e9a022f91a69a93
- action_id: ACT-20260902-cd8964
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:45:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-50f4b4
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-51d591
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:45:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-d51ddf
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-4e7de1:answers
- action_id: ACT-20260902-d78770
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:45:54+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-4e7de1:tool:a21c15829aee105a5ff7f2cd
- action_id: ACT-20260902-b80005
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:46:13+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-360179
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-6f25aa
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:46:13+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-641faa
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-19d399:answers
- action_id: ACT-20260902-e6d44c
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:46:23+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-19d399:tool:0b3f16aa7f43869e68727ac3
- action_id: ACT-20260902-e9a8ae
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:46:41+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-4d5ad9
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-11147a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:46:41+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-c742fc
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-8df43f:answers
- action_id: ACT-20260902-ab78c2
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:46:51+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-8df43f:tool:6bb0621a5a263c369dfd2396
- action_id: ACT-20260902-d35370
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:47:15+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-01c95d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-266fb0
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:47:15+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-81d390
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-af2114:answers
- action_id: ACT-20260902-313477
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:47:35+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-6f8e1e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-e08438
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:47:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-327973
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-e04d8a:answers
working_ask: Advise on the legal permissibility and design of an automated control
  that pauses ACH debits, credits, and seller payouts when transaction-risk signals
  exceed a threshold. Legal advice is requested on permissible hold and extension
  periods, required notices, recordkeeping, complaint handling, and whether the operation
  creates money-transmission, unfair-practice, or unauthorized-debit risks.
issues:
- 'Money-transmission licensing perimeter: whether pausing/holding funds creates custody
  or transmission exposure'
- NACHA Operating Rules compliance for holds, returns, and notice
- Reg E / unauthorized-debit and consumer-protection exposure for consumer-originated
  payments
- Unfair, deceptive, or abusive acts or practices (UDAAP) risk from generic explanations
  and hold mechanics
- Contractual obligations to acquiring and ACH partners regarding holds and escalation
- Recordkeeping and complaint-handling obligations
open_questions:
- Jurisdictions where merchants, payers, and recipients are located
- Intended maximum hold period and extension mechanics
- Target launch date or design-stage status
- Whether acquiring/ACH partner agreements already contemplate holds or reserves
public_research_questions:
- What do the NACHA Operating Rules require regarding holds, returns, and notice for
  ACH debits, credits, and payouts?
- When does pausing or holding funds create money-transmission licensing exposure
  for a non-bank payment infrastructure provider?
- What Reg E and UDAAP obligations apply to holds on consumer-originated ACH payments?
intake_answers:
- answer_id: ANS-20260902-56c397
  question_id: jurisdiction
  question: Which jurisdictions do the merchants, payers, and recipients sit in? This
    drives which ACH rules (e.g., NACHA), Reg E, and state money-transmission laws
    apply.
  answer: Not sure yet
  values:
  - not_sure
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260902-50f4b4
  source_action_key: chat:RUN-20260902-4e7de1
  answered_at: '2026-09-02T14:45:48+00:00'
  answer_fact_id: FACT-20260902-d51ddf
- answer_id: ANS-20260902-e1f8ba
  question_id: funds_custody
  question: When a hold is placed, do the funds stay with the acquiring/ACH partner,
    or does Mosaic Relay take custody of them?
  answer: Not sure yet
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260902-360179
  source_action_key: chat:RUN-20260902-19d399
  answered_at: '2026-09-02T14:46:13+00:00'
  answer_fact_id: FACT-20260902-641faa
- answer_id: ANS-20260902-7a7356
  question_id: consumer_origin
  question: Are any of these consumer-originated payments, or is this B2B only?
  answer: Not sure yet
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260902-4d5ad9
  source_action_key: chat:RUN-20260902-8df43f
  answered_at: '2026-09-02T14:46:41+00:00'
  answer_fact_id: FACT-20260902-c742fc
- answer_id: ANS-20260902-c0301b
  question_id: hold_duration
  question: What is the intended maximum hold period and how are extensions handled?
  answer: 24 hours with risk-manager-approved extensions
  values:
  - 24h_plus_extensions
  status: answered
  record_target: fact
  source_id: MSG-20260902-01c95d
  source_action_key: chat:RUN-20260902-af2114
  answered_at: '2026-09-02T14:47:15+00:00'
  answer_fact_id: FACT-20260902-81d390
- answer_id: ANS-20260902-0f05a2
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Continue with assumptions
  values:
  - continue_with_assumptions
  status: answered
  record_target: fact
  source_id: MSG-20260902-6f8e1e
  source_action_key: chat:RUN-20260902-e04d8a
  answered_at: '2026-09-02T14:47:35+00:00'
  answer_fact_id: FACT-20260902-327973
intake_state: complete
---
# Known Facts

- Mosaic Relay wants an automated control that pauses ACH debits, credits, and seller payouts when transaction-risk signals exceed a threshold.
- The control would place a temporary hold, show the merchant a generic explanation, and create an investigation task for Payment Operations.
- Signals may include sudden volume growth, account takeover indicators, return rates, sanctions-screening matches, and mismatches between merchant profile and transaction behavior.
- The control would operate continuously, with an initial hold of 24 hours and extensions approved by a risk manager.
- The company wants to reduce fraud losses and avoid sending funds that may later be returned.
- The control would not be described as a legal determination, and funds would be released when review is complete or the transaction is confirmed legitimate.
- Mosaic Relay is not a bank, does not hold deposits, and relies on regulated partners for parts of the payment chain.
- Which jurisdictions do the merchants, payers, and recipients sit in? This drives which ACH rules (e.g., NACHA), Reg E, and state money-transmission laws apply. — Not sure yet
- When a hold is placed, do the funds stay with the acquiring/ACH partner, or does Mosaic Relay take custody of them? — Not sure yet
- Are any of these consumer-originated payments, or is this B2B only? — Not sure yet
- What is the intended maximum hold period and how are extensions handled? — 24 hours with risk-manager-approved extensions
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- [Assumption] Mosaic Relay does not itself hold or take custody of the held funds; holds are implemented through partner/acquiring arrangements.
- [Assumption] The control applies to ACH transactions in the US governed by NACHA Operating Rules.
- [Assumption] Holds are temporary and funds are ultimately released or returned consistent with the underlying transaction.
