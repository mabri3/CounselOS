---
matter_id: MAT-20260903-df8c06
record_type: facts
facts:
- fact_id: FACT-20260903-385bf4
  text: Risk operations recommends deactivating a Mosaic Relay merchant after repeated
    sanctions-screening alerts, rapid volume growth, and transactions involving a
    newly identified high-risk country.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-bb2c47
  text: The proposed operation immediately blocks new payments and payouts, preserves
    relevant records, and sends the merchant a short notice stating access is suspended
    under the agreement.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-6d17cf
  text: A later review would decide whether to terminate the relationship or restore
    service.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-f427ec
  text: Two sanctions-screening alerts were false positives; one alert remains unresolved.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-3f1624
  text: The merchant has pending customer refunds and seller payouts.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-2b38e3
  text: The contract includes a general right to suspend service for risk or compliance
    concerns.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-33639f
  text: It has not been confirmed whether the contract addresses pending funds, notice
    timing, or post-termination access.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-b2778c
  text: It is unknown whether filing or considering a suspicious-activity report limits
    what Mosaic Relay may tell the merchant.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-919b46
  text: Operations wants a decision within ten business days.
  status: active
  material: true
  source_ids:
  - REQ-20260903-f2d112
  supersedes: null
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- fact_id: FACT-20260903-514a48
  text: Has a suspicious-activity report (SAR) been filed, or is one being considered,
    for this merchant? This directly controls what Mosaic Relay may lawfully tell
    the merchant about the suspension. — Not sure / need to check
  status: active
  material: true
  source_ids:
  - MSG-20260903-2090a4
  supersedes: null
  created_at: '2026-09-03T09:09:31+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4a129e
- fact_id: FACT-20260903-592aa0
  text: What is the status of the unresolved sanctions-screening alert — is it a true
    match (e.g., OFAC SDN List) or a false positive? — Still under review, not determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-4da98a
  supersedes: null
  created_at: '2026-09-03T09:09:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b11a9b
- fact_id: FACT-20260903-9058ba
  text: Which high-risk country is involved, and is it sanctioned by OFAC or merely
    high-risk for AML purposes? — Not sure / need to check
  status: active
  material: true
  source_ids:
  - MSG-20260903-2b6f9d
  supersedes: null
  created_at: '2026-09-03T09:10:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ea5239
- fact_id: FACT-20260903-4ecd89
  text: What do the merchant agreement's terms say about pending funds, notice timing,
    and post-termination access? The general right to suspend for risk/compliance
    concerns is confirmed, but these specifics are not. — Not sure / need to check
  status: active
  material: true
  source_ids:
  - MSG-20260903-998418
  supersedes: null
  created_at: '2026-09-03T09:10:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c4cb89
- fact_id: FACT-20260903-d232fb
  text: What is the amount and nature of the pending customer refunds and seller payouts,
    and are any time-sensitive (e.g., refunds owed to consumers)? — Amounts and transaction-level
    details were not provided. Treat pending customer refunds as potentially time-sensitive
    consumer obligations and seller payouts as pending funds subject to processor,
    network, contractual, and applicable law requirements. Risk, finance, and support
    must confirm amounts, aging, status, reserve or hold authority, and any deadlines
    before execution.
  status: active
  material: true
  source_ids:
  - MSG-20260903-1ff2d2
  supersedes: null
  created_at: '2026-09-03T09:12:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e52181
sources:
- source_id: REQ-20260903-f2d112
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-04-deactivation-of-a-high-risk-merchant-df8c06/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T09:08:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7de45a
- source_id: MSG-20260903-2090a4
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:09:31+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-73f6fa
- source_id: MSG-20260903-4da98a
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:09:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d64b05
- source_id: MSG-20260903-2b6f9d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:10:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a0495e
- source_id: MSG-20260903-998418
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:10:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8716be
- source_id: MSG-20260903-1ff2d2
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:12:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e4e4f8
support:
- support_id: SUP-20260903-fcef95
  fact_id: FACT-20260903-385bf4
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: Risk operations recommends deactivating a Mosaic Relay merchant after
    repeated sanctions-screening alerts, rapid volume growth, and transactions involving
    a newly identified high-risk country.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-ef31b9
  fact_id: FACT-20260903-bb2c47
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: The proposed operation immediately blocks new payments and payouts, preserves
    relevant records, and sends the merchant a short notice stating access is suspended
    under the agreement.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-97fa43
  fact_id: FACT-20260903-6d17cf
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: A later review would decide whether to terminate the relationship or
    restore service.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-5f5d64
  fact_id: FACT-20260903-f427ec
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: Two sanctions-screening alerts were false positives; one alert remains
    unresolved.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-b260aa
  fact_id: FACT-20260903-3f1624
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: The merchant has pending customer refunds and seller payouts.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-321dae
  fact_id: FACT-20260903-2b38e3
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: The contract includes a general right to suspend service for risk or
    compliance concerns.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-3f6730
  fact_id: FACT-20260903-33639f
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: It has not been confirmed whether the contract addresses pending funds,
    notice timing, or post-termination access.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-4d0b49
  fact_id: FACT-20260903-b2778c
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: It is unknown whether filing or considering a suspicious-activity report
    limits what Mosaic Relay may tell the merchant.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- support_id: SUP-20260903-2def01
  fact_id: FACT-20260903-919b46
  source_id: REQ-20260903-f2d112
  relationship: support
  statement: Operations wants a decision within ten business days.
  location: ''
  created_at: '2026-09-03T09:09:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
assumptions:
- assumption_id: ASM-20260903-90240d
  text: Mosaic Relay operates primarily in the U.S. and is subject to U.S. BSA/AML,
    OFAC sanctions, and payments regulation (per company profile).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:09:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- assumption_id: ASM-20260903-6ce013
  text: Mosaic Relay is classified as a money services business (MSB) subject to BSA/AML
    program and SAR obligations (per prior matter analysis, unverified).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:09:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- assumption_id: ASM-20260903-a97a0c
  text: The merchant agreement is the primary contractual basis for suspension; its
    specific terms on pending funds, notice, and post-termination access are unverified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:09:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6c75fd
- assumption_id: ASM-20260903-f0980a
  text: Because the unresolved alert is not yet confirmed as a true OFAC SDN match,
    immediate suspension is currently a discretionary risk-based action rather than
    a mandatory blocking obligation.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:09:59+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07aefe
conflicts: []
actions:
- action_id: ACT-20260903-7de45a
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T09:08:55+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-f2d112
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6c75fd
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:09:10+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-385bf4
    - FACT-20260903-bb2c47
    - FACT-20260903-6d17cf
    - FACT-20260903-f427ec
    - FACT-20260903-3f1624
    - FACT-20260903-2b38e3
    - FACT-20260903-33639f
    - FACT-20260903-b2778c
    - FACT-20260903-919b46
    sources: []
    support:
    - SUP-20260903-fcef95
    - SUP-20260903-ef31b9
    - SUP-20260903-97fa43
    - SUP-20260903-5f5d64
    - SUP-20260903-b260aa
    - SUP-20260903-321dae
    - SUP-20260903-3f6730
    - SUP-20260903-4d0b49
    - SUP-20260903-2def01
    assumptions:
    - ASM-20260903-90240d
    - ASM-20260903-6ce013
    - ASM-20260903-a97a0c
  source_action_key: chat:RUN-20260903-1d4055:tool:8eae03accc3d4bc73dd32929
- action_id: ACT-20260903-73f6fa
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:09:31+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-2090a4
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-4a129e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:09:31+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-514a48
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-f14935:answers
- action_id: ACT-20260903-2d1e6f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:09:38+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-f14935:tool:64784b6c4af852b790599ae4
- action_id: ACT-20260903-d64b05
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:09:50+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-4da98a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-b11a9b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:09:50+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-592aa0
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-718244:answers
- action_id: ACT-20260903-07aefe
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:09:59+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-f0980a
  source_action_key: chat:RUN-20260903-718244:tool:e22236c1918ca5e67d009b60
- action_id: ACT-20260903-a0495e
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:10:18+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-2b6f9d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-ea5239
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:10:18+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-9058ba
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-76a234:answers
- action_id: ACT-20260903-5205cc
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:10:27+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-76a234:tool:d2747dae966bede758dbaff2
- action_id: ACT-20260903-8716be
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:10:46+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-998418
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c4cb89
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:10:46+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-4ecd89
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-43ab4e:answers
- action_id: ACT-20260903-debaf9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:10:56+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-43ab4e:tool:d2f1abe1da149a667afa675f
- action_id: ACT-20260903-e4e4f8
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:12:28+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-1ff2d2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e52181
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:12:28+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-d232fb
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-175042:answers
- action_id: ACT-20260903-a88b5f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:12:38+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-175042:tool:755f7af7f82077a760b5b94b
working_ask: Advise whether immediate suspension of a high-risk Mosaic Relay merchant
  is justified, what communications are permitted, how to handle pending transactions
  and funds, what records must be preserved, and what process should govern reinstatement
  or termination. Decision needed within ten business days (target 2026-09-17).
issues:
- Whether immediate suspension is justified given one unresolved sanctions alert and
  transactions involving a high-risk country
- What communications to the merchant are permitted, including whether SAR confidentiality
  limits disclosure
- How to handle pending customer refunds and seller payouts during suspension
- What records must be preserved
- What process should govern reinstatement or termination
open_questions:
- Amounts, aging, status, reserve/hold authority, and deadlines for pending customer
  refunds and seller payouts
public_research_questions:
- What are the OFAC blocking and reporting obligations when a merchant is suspected
  of being a sanctioned party or transacting with a sanctioned jurisdiction?
- What are the SAR confidentiality and anti-tipping restrictions under 31 U.S.C. 5318(g)(2)
  on disclosing a suspension to a merchant?
- What are the money transmitter / MSB requirements for handling pending funds, refunds,
  and payouts upon suspension or termination?
intake_answers:
- answer_id: ANS-20260903-cae665
  question_id: q1_sar_status
  question: Has a suspicious-activity report (SAR) been filed, or is one being considered,
    for this merchant? This directly controls what Mosaic Relay may lawfully tell
    the merchant about the suspension.
  answer: Not sure / need to check
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-2090a4
  source_action_key: chat:RUN-20260903-f14935
  answered_at: '2026-09-03T09:09:31+00:00'
  answer_fact_id: FACT-20260903-514a48
- answer_id: ANS-20260903-2cbcbb
  question_id: q2
  question: What is the status of the unresolved sanctions-screening alert — is it
    a true match (e.g., OFAC SDN List) or a false positive?
  answer: Still under review, not determined
  values:
  - under_review
  status: answered
  record_target: fact
  source_id: MSG-20260903-4da98a
  source_action_key: chat:RUN-20260903-718244
  answered_at: '2026-09-03T09:09:50+00:00'
  answer_fact_id: FACT-20260903-592aa0
- answer_id: ANS-20260903-ca49de
  question_id: q_high_risk_country
  question: Which high-risk country is involved, and is it sanctioned by OFAC or merely
    high-risk for AML purposes?
  answer: Not sure / need to check
  values:
  - unknown
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-2b6f9d
  source_action_key: chat:RUN-20260903-76a234
  answered_at: '2026-09-03T09:10:18+00:00'
  answer_fact_id: FACT-20260903-9058ba
- answer_id: ANS-20260903-37078e
  question_id: agreement_terms
  question: What do the merchant agreement's terms say about pending funds, notice
    timing, and post-termination access? The general right to suspend for risk/compliance
    concerns is confirmed, but these specifics are not.
  answer: Not sure / need to check
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-998418
  source_action_key: chat:RUN-20260903-43ab4e
  answered_at: '2026-09-03T09:10:46+00:00'
  answer_fact_id: FACT-20260903-4ecd89
- answer_id: ANS-20260903-4f9990
  question_id: pending_funds
  question: What is the amount and nature of the pending customer refunds and seller
    payouts, and are any time-sensitive (e.g., refunds owed to consumers)?
  answer: Amounts and transaction-level details were not provided. Treat pending customer
    refunds as potentially time-sensitive consumer obligations and seller payouts
    as pending funds subject to processor, network, contractual, and applicable law
    requirements. Risk, finance, and support must confirm amounts, aging, status,
    reserve or hold authority, and any deadlines before execution.
  values:
  - Amounts and transaction-level details were not provided. Treat pending customer
    refunds as potentially time-sensitive consumer obligations and seller payouts
    as pending funds subject to processor, network, contractual, and applicable law
    requirements. Risk, finance, and support must confirm amounts, aging, status,
    reserve or hold authority, and any deadlines before execution.
  status: answered
  record_target: fact
  source_id: MSG-20260903-1ff2d2
  source_action_key: chat:RUN-20260903-175042
  answered_at: '2026-09-03T09:12:28+00:00'
  answer_fact_id: FACT-20260903-d232fb
intake_state: complete
---
# Known Facts

- Risk operations recommends deactivating a Mosaic Relay merchant after repeated sanctions-screening alerts, rapid volume growth, and transactions involving a newly identified high-risk country.
- The proposed operation immediately blocks new payments and payouts, preserves relevant records, and sends the merchant a short notice stating access is suspended under the agreement.
- A later review would decide whether to terminate the relationship or restore service.
- Two sanctions-screening alerts were false positives; one alert remains unresolved.
- The merchant has pending customer refunds and seller payouts.
- The contract includes a general right to suspend service for risk or compliance concerns.
- It has not been confirmed whether the contract addresses pending funds, notice timing, or post-termination access.
- It is unknown whether filing or considering a suspicious-activity report limits what Mosaic Relay may tell the merchant.
- Operations wants a decision within ten business days.
- Has a suspicious-activity report (SAR) been filed, or is one being considered, for this merchant? This directly controls what Mosaic Relay may lawfully tell the merchant about the suspension. — Not sure / need to check
- What is the status of the unresolved sanctions-screening alert — is it a true match (e.g., OFAC SDN List) or a false positive? — Still under review, not determined
- Which high-risk country is involved, and is it sanctioned by OFAC or merely high-risk for AML purposes? — Not sure / need to check
- What do the merchant agreement's terms say about pending funds, notice timing, and post-termination access? The general right to suspend for risk/compliance concerns is confirmed, but these specifics are not. — Not sure / need to check
- What is the amount and nature of the pending customer refunds and seller payouts, and are any time-sensitive (e.g., refunds owed to consumers)? — Amounts and transaction-level details were not provided. Treat pending customer refunds as potentially time-sensitive consumer obligations and seller payouts as pending funds subject to processor, network, contractual, and applicable law requirements. Risk, finance, and support must confirm amounts, aging, status, reserve or hold authority, and any deadlines before execution.

## Assumptions

- [Assumption] Mosaic Relay operates primarily in the U.S. and is subject to U.S. BSA/AML, OFAC sanctions, and payments regulation (per company profile).
- [Assumption] Mosaic Relay is classified as a money services business (MSB) subject to BSA/AML program and SAR obligations (per prior matter analysis, unverified).
- [Assumption] The merchant agreement is the primary contractual basis for suspension; its specific terms on pending funds, notice, and post-termination access are unverified.
- [Assumption] Because the unresolved alert is not yet confirmed as a true OFAC SDN match, immediate suspension is currently a discretionary risk-based action rather than a mandatory blocking obligation.
