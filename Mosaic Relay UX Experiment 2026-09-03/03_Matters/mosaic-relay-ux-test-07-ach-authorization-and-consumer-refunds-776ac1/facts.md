---
matter_id: MAT-20260903-776ac1
record_type: facts
facts:
- fact_id: FACT-20260903-69ed59
  text: The merchant wants to accept recurring ACH payments from consumers for a subscription
    service.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-451343
  text: The proposed checkout asks the consumer to enter bank details, agree to recurring
    debit terms, and receive an email confirmation.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-e0854b
  text: Mosaic Relay would submit debits through its payment partners, show pending
    and returned status in the dashboard, and initiate refunds when the customer cancels.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-c14f32
  text: The merchant's subscriptions can renew monthly.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-16c164
  text: Some consumers may use the service for digital goods.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-4cebb6
  text: The customer wants to release the feature in nine weeks (target 2026-11-05).
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-346751
  text: The authorization language, evidence format, cancellation process, prenotification
    practice, return handling, debit timing, and consumer support responsibilities
    are not yet finalized.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-b856a4
  text: It is not yet known whether the merchant will use variable amounts, how it
    will handle unauthorized-debit claims, or whether Mosaic Relay's dashboard will
    be the system of record.
  status: active
  material: true
  source_ids:
  - REQ-20260903-8031da
  supersedes: null
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- fact_id: FACT-20260903-a14154
  text: Will the merchant use variable or fixed recurring debit amounts? — Both /
    not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-c40b4a
  supersedes: null
  created_at: '2026-09-03T09:42:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6b9a19
- fact_id: FACT-20260903-0e6b1c
  text: Will Mosaic Relay's dashboard be the system of record for authorization evidence,
    and who retains and produces it when a consumer's financial institution requests
    proof of authorization? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-4c0f66
  supersedes: null
  created_at: '2026-09-03T09:43:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3d9b2d
- fact_id: FACT-20260903-f94533
  text: How will consumers cancel or stop recurring payments, and what is the merchant's
    cancellation and refund process? — Not yet decided. Recommend a clear in-product
    cancellation and stop-payment path plus support escalation, with the merchant
    responsible for honoring cancellations and Mosaic Relay enforcing the stop before
    the next debit when technically possible. Define cutoffs, confirmation, audit
    trail, and refund to the original payment method, with timing and exceptions disclosed.
  status: active
  material: true
  source_ids:
  - MSG-20260903-4521ff
  supersedes: null
  created_at: '2026-09-03T09:43:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-9f701b
- fact_id: FACT-20260903-bef73f
  text: Will the merchant use prenotification (prenotes) before the first debit? —
    Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-15ca8e
  supersedes: null
  created_at: '2026-09-03T09:44:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7cee38
- fact_id: FACT-20260903-4a48df
  text: How will unauthorized-debit claims be handled, and who responds to the consumer's
    financial institution? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-8927da
  supersedes: null
  created_at: '2026-09-03T09:44:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e9557a
sources:
- source_id: REQ-20260903-8031da
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-07-ach-authorization-and-consumer-refunds-776ac1/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T09:42:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-95fde3
- source_id: MSG-20260903-c40b4a
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:42:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-063c49
- source_id: MSG-20260903-4c0f66
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:43:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-92664d
- source_id: MSG-20260903-4521ff
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:43:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c4acf8
- source_id: MSG-20260903-15ca8e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:44:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2fad4e
- source_id: MSG-20260903-8927da
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:44:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4b2af0
support:
- support_id: SUP-20260903-0eccb1
  fact_id: FACT-20260903-69ed59
  source_id: REQ-20260903-8031da
  relationship: support
  statement: The merchant wants to accept recurring ACH payments from consumers for
    a subscription service.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-d77845
  fact_id: FACT-20260903-451343
  source_id: REQ-20260903-8031da
  relationship: support
  statement: The proposed checkout asks the consumer to enter bank details, agree
    to recurring debit terms, and receive an email confirmation.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-6ec263
  fact_id: FACT-20260903-e0854b
  source_id: REQ-20260903-8031da
  relationship: support
  statement: Mosaic Relay would submit debits through its payment partners, show pending
    and returned status in the dashboard, and initiate refunds when the customer cancels.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-9601ca
  fact_id: FACT-20260903-c14f32
  source_id: REQ-20260903-8031da
  relationship: support
  statement: The merchant's subscriptions can renew monthly.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-804a7c
  fact_id: FACT-20260903-16c164
  source_id: REQ-20260903-8031da
  relationship: support
  statement: Some consumers may use the service for digital goods.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-a908cb
  fact_id: FACT-20260903-4cebb6
  source_id: REQ-20260903-8031da
  relationship: support
  statement: The customer wants to release the feature in nine weeks (target 2026-11-05).
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-d73b48
  fact_id: FACT-20260903-346751
  source_id: REQ-20260903-8031da
  relationship: support
  statement: The authorization language, evidence format, cancellation process, prenotification
    practice, return handling, debit timing, and consumer support responsibilities
    are not yet finalized.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- support_id: SUP-20260903-985e1f
  fact_id: FACT-20260903-b856a4
  source_id: REQ-20260903-8031da
  relationship: support
  statement: It is not yet known whether the merchant will use variable amounts, how
    it will handle unauthorized-debit claims, or whether Mosaic Relay's dashboard
    will be the system of record.
  location: ''
  created_at: '2026-09-03T09:42:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
assumptions:
- assumption_id: ASM-20260903-875265
  text: Mosaic Relay acts as a third-party service provider / ODFI agent submitting
    debits through payment partners, not as the originating bank.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:42:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- assumption_id: ASM-20260903-6d0dff
  text: The consumer-facing recurring-debit authorization is governed by NACHA Rules
    and, for consumer accounts, Reg E (EFTA) protections.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:42:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
- assumption_id: ASM-20260903-9a9b28
  text: U.S. scope only, consistent with the company profile.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:42:35+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-4f139e
conflicts: []
actions:
- action_id: ACT-20260903-95fde3
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T09:42:23+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-8031da
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-4f139e
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:42:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-69ed59
    - FACT-20260903-451343
    - FACT-20260903-e0854b
    - FACT-20260903-c14f32
    - FACT-20260903-16c164
    - FACT-20260903-4cebb6
    - FACT-20260903-346751
    - FACT-20260903-b856a4
    sources: []
    support:
    - SUP-20260903-0eccb1
    - SUP-20260903-d77845
    - SUP-20260903-6ec263
    - SUP-20260903-9601ca
    - SUP-20260903-804a7c
    - SUP-20260903-a908cb
    - SUP-20260903-d73b48
    - SUP-20260903-985e1f
    assumptions:
    - ASM-20260903-875265
    - ASM-20260903-6d0dff
    - ASM-20260903-9a9b28
  source_action_key: chat:RUN-20260903-ae5ba6:tool:67a46f1a105ef44303ba6f2d
- action_id: ACT-20260903-063c49
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:42:53+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-c40b4a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6b9a19
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:42:53+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-a14154
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-babc3a:answers
- action_id: ACT-20260903-ac8fa5
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:43:01+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-babc3a:tool:a9fd80b1ea39eedb3646da1a
- action_id: ACT-20260903-92664d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:43:29+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-4c0f66
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-3d9b2d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:43:29+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0e6b1c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-1fb2e9:answers
- action_id: ACT-20260903-2b6b96
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:43:39+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-1fb2e9:tool:4237e8b18bd24025fa6bd080
- action_id: ACT-20260903-c4acf8
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:43:51+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-4521ff
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-9f701b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:43:51+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f94533
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-dd532f:answers
- action_id: ACT-20260903-1eb7fc
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:44:00+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-dd532f:tool:c60a73c6b118af1cbc235f3d
- action_id: ACT-20260903-2fad4e
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:44:11+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-15ca8e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-7cee38
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:44:11+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-bef73f
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-38eb46:answers
- action_id: ACT-20260903-476b35
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:44:21+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-38eb46:tool:0bfdd39cc96d9088cf04fb13
- action_id: ACT-20260903-4b2af0
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:44:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8927da
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e9557a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:44:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-4a48df
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2d8d64:answers
- action_id: ACT-20260903-ef6d77
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:44:40+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2d8d64:tool:e0851ab7c41e6a8c45fe9b18
working_ask: 'Advise on a Mosaic Relay customer accepting recurring ACH debits from
  consumers for a subscription service: authorization and recordkeeping requirements,
  recurring-debit disclosures, cancellation and refund obligations, return and dispute
  handling, allocation of responsibilities between Mosaic Relay and the merchant,
  and limits on the proposed checkout UX. Target launch 2026-11-05.'
issues:
- ACH authorization and recordkeeping requirements (NACHA Rules, Reg E)
- Recurring-debit disclosures to consumers
- Cancellation and refund obligations
- Return and dispute handling (unauthorized-debit claims, return codes)
- Allocation of responsibilities between Mosaic Relay and the merchant
- Limits on the proposed checkout user experience
open_questions:
- Finalized authorization language and evidence format
public_research_questions:
- What are the NACHA Rules requirements for recurring (standing authorization) ACH
  debits, including authorization format, evidence retention, and per-debit notification
  for variable amounts?
- What are the Reg E (EFTA) requirements for consumer recurring ACH debits, including
  stop-payment and error-resolution rights?
- What are the NACHA return-code timeframes and evidence-production requirements for
  unauthorized-debit claims (R10/R11/R29/R51)?
intake_answers:
- answer_id: ANS-20260903-c70610
  question_id: variable_amounts
  question: Will the merchant use variable or fixed recurring debit amounts?
  answer: Both / not yet decided
  values:
  - both
  status: answered
  record_target: fact
  source_id: MSG-20260903-c40b4a
  source_action_key: chat:RUN-20260903-babc3a
  answered_at: '2026-09-03T09:42:53+00:00'
  answer_fact_id: FACT-20260903-a14154
- answer_id: ANS-20260903-68adcd
  question_id: system_of_record
  question: Will Mosaic Relay's dashboard be the system of record for authorization
    evidence, and who retains and produces it when a consumer's financial institution
    requests proof of authorization?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-4c0f66
  source_action_key: chat:RUN-20260903-1fb2e9
  answered_at: '2026-09-03T09:43:29+00:00'
  answer_fact_id: FACT-20260903-0e6b1c
- answer_id: ANS-20260903-46e82b
  question_id: cancellation_process
  question: How will consumers cancel or stop recurring payments, and what is the
    merchant's cancellation and refund process?
  answer: Not yet decided. Recommend a clear in-product cancellation and stop-payment
    path plus support escalation, with the merchant responsible for honoring cancellations
    and Mosaic Relay enforcing the stop before the next debit when technically possible.
    Define cutoffs, confirmation, audit trail, and refund to the original payment
    method, with timing and exceptions disclosed.
  values:
  - Not yet decided. Recommend a clear in-product cancellation and stop-payment path
    plus support escalation, with the merchant responsible for honoring cancellations
    and Mosaic Relay enforcing the stop before the next debit when technically possible.
    Define cutoffs, confirmation, audit trail, and refund to the original payment
    method, with timing and exceptions disclosed.
  status: answered
  record_target: fact
  source_id: MSG-20260903-4521ff
  source_action_key: chat:RUN-20260903-dd532f
  answered_at: '2026-09-03T09:43:51+00:00'
  answer_fact_id: FACT-20260903-f94533
- answer_id: ANS-20260903-fba11f
  question_id: prenote
  question: Will the merchant use prenotification (prenotes) before the first debit?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-15ca8e
  source_action_key: chat:RUN-20260903-38eb46
  answered_at: '2026-09-03T09:44:11+00:00'
  answer_fact_id: FACT-20260903-bef73f
- answer_id: ANS-20260903-73c2a2
  question_id: unauthorized_claims
  question: How will unauthorized-debit claims be handled, and who responds to the
    consumer's financial institution?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-8927da
  source_action_key: chat:RUN-20260903-2d8d64
  answered_at: '2026-09-03T09:44:32+00:00'
  answer_fact_id: FACT-20260903-4a48df
intake_state: complete
---
# Known Facts

- The merchant wants to accept recurring ACH payments from consumers for a subscription service.
- The proposed checkout asks the consumer to enter bank details, agree to recurring debit terms, and receive an email confirmation.
- Mosaic Relay would submit debits through its payment partners, show pending and returned status in the dashboard, and initiate refunds when the customer cancels.
- The merchant's subscriptions can renew monthly.
- Some consumers may use the service for digital goods.
- The customer wants to release the feature in nine weeks (target 2026-11-05).
- The authorization language, evidence format, cancellation process, prenotification practice, return handling, debit timing, and consumer support responsibilities are not yet finalized.
- It is not yet known whether the merchant will use variable amounts, how it will handle unauthorized-debit claims, or whether Mosaic Relay's dashboard will be the system of record.
- Will the merchant use variable or fixed recurring debit amounts? — Both / not yet decided
- Will Mosaic Relay's dashboard be the system of record for authorization evidence, and who retains and produces it when a consumer's financial institution requests proof of authorization? — Not yet decided
- How will consumers cancel or stop recurring payments, and what is the merchant's cancellation and refund process? — Not yet decided. Recommend a clear in-product cancellation and stop-payment path plus support escalation, with the merchant responsible for honoring cancellations and Mosaic Relay enforcing the stop before the next debit when technically possible. Define cutoffs, confirmation, audit trail, and refund to the original payment method, with timing and exceptions disclosed.
- Will the merchant use prenotification (prenotes) before the first debit? — Not yet decided
- How will unauthorized-debit claims be handled, and who responds to the consumer's financial institution? — Not yet decided

## Assumptions

- [Assumption] Mosaic Relay acts as a third-party service provider / ODFI agent submitting debits through payment partners, not as the originating bank.
- [Assumption] The consumer-facing recurring-debit authorization is governed by NACHA Rules and, for consumer accounts, Reg E (EFTA) protections.
- [Assumption] U.S. scope only, consistent with the company profile.
