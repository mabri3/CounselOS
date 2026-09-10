---
matter_id: MAT-20260904-75af25
record_type: facts
facts:
- fact_id: FACT-20260904-03f65e
  text: Mosaic Relay proposes a risk-control feature that temporarily delays a merchant
    payout when transaction-risk scoring identifies unusual activity, high dispute
    risk, or incomplete verification.
  status: active
  material: true
  source_ids:
  - REQ-20260904-fc8f52
  supersedes: null
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- fact_id: FACT-20260904-fe6695
  text: The merchant would see a status such as 'review required', receive a general
    explanation, and submit documents through a secure portal.
  status: active
  material: true
  source_ids:
  - REQ-20260904-fc8f52
  supersedes: null
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- fact_id: FACT-20260904-35d508
  text: Holds could begin automatically within minutes of a transaction and last from
    several hours to multiple weeks depending on review results.
  status: active
  material: true
  source_ids:
  - REQ-20260904-fc8f52
  supersedes: null
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- fact_id: FACT-20260904-5cb70b
  text: Mosaic Relay provides payout controls and risk scoring but does not hold deposits
    or operate as a bank.
  status: active
  material: true
  source_ids:
  - REQ-20260904-fc8f52
  supersedes: null
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- fact_id: FACT-20260904-3d095e
  text: The business goal is to prevent losses while giving legitimate merchants a
    clear path to resume payouts.
  status: active
  material: true
  source_ids:
  - REQ-20260904-fc8f52
  supersedes: null
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- fact_id: FACT-20260904-7d2bb5
  text: When a payout is held, whose funds are being delayed — the merchant's own
    funds, or funds that belong to underlying sellers or consumers who are paid through
    the merchant? — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-30bc15
  supersedes: null
  created_at: '2026-09-04T00:35:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-423b67
- fact_id: FACT-20260904-6df99e
  text: Which jurisdictions must this feature comply with for disclosure and timing
    obligations? — US only
  status: active
  material: true
  source_ids:
  - MSG-20260904-0edabc
  supersedes: null
  created_at: '2026-09-04T00:35:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-d2ddd7
- fact_id: FACT-20260904-6243a4
  text: Does the current merchant agreement already grant Mosaic Relay authority to
    delay or hold payouts for risk review, and does it state notice, timing, or appeal
    terms? — Need to check
  status: active
  material: true
  source_ids:
  - MSG-20260904-d80abb
  supersedes: null
  created_at: '2026-09-04T00:36:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-d3778c
- fact_id: FACT-20260904-b56c94
  text: Is the hold triggered automatically by the risk-scoring model without human
    review, or does a human analyst confirm before a hold is placed? — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-aabb6c
  supersedes: null
  created_at: '2026-09-04T00:36:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-18bdd0
- fact_id: FACT-20260904-27b6a9
  text: During the hold, do interest or fees accrue, and what happens if a merchant
    cannot provide the requested documents? — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-ea98b6
  supersedes: null
  created_at: '2026-09-04T00:37:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-530ef0
- fact_id: FACT-20260904-8a8d03
  text: Is there any other fact that would materially change the advice? — No additional
    facts are confirmed. Proceed with the stated US-only working assumption, treat
    funds ownership, contract authority, automation review, fee or interest treatment,
    notice timing, appeal rights, and document-failure outcomes as open material facts,
    and label any legal sources as verified or unverified.
  status: active
  material: true
  source_ids:
  - MSG-20260904-9c1ecc
  supersedes: null
  created_at: '2026-09-04T00:37:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-e80d21
sources:
- source_id: REQ-20260904-fc8f52
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-07-consumer-disclosures-for-payment-risk-ho-75af25/request.md
  version: ''
  location: ''
  created_at: '2026-09-04T00:34:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-6fffe3
- source_id: MSG-20260904-30bc15
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:35:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-6fdf31
- source_id: MSG-20260904-0edabc
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:35:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-381caf
- source_id: MSG-20260904-d80abb
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:36:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-a104db
- source_id: MSG-20260904-aabb6c
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:36:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-76acdf
- source_id: MSG-20260904-ea98b6
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:37:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-d1f13c
- source_id: MSG-20260904-9c1ecc
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:37:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-a8da5b
support:
- support_id: SUP-20260904-a5e8f8
  fact_id: FACT-20260904-03f65e
  source_id: REQ-20260904-fc8f52
  relationship: support
  statement: Mosaic Relay proposes a risk-control feature that temporarily delays
    a merchant payout when transaction-risk scoring identifies unusual activity, high
    dispute risk, or incomplete verification.
  location: ''
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- support_id: SUP-20260904-89d5b3
  fact_id: FACT-20260904-fe6695
  source_id: REQ-20260904-fc8f52
  relationship: support
  statement: The merchant would see a status such as 'review required', receive a
    general explanation, and submit documents through a secure portal.
  location: ''
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- support_id: SUP-20260904-95524c
  fact_id: FACT-20260904-35d508
  source_id: REQ-20260904-fc8f52
  relationship: support
  statement: Holds could begin automatically within minutes of a transaction and last
    from several hours to multiple weeks depending on review results.
  location: ''
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- support_id: SUP-20260904-ec6f37
  fact_id: FACT-20260904-5cb70b
  source_id: REQ-20260904-fc8f52
  relationship: support
  statement: Mosaic Relay provides payout controls and risk scoring but does not hold
    deposits or operate as a bank.
  location: ''
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- support_id: SUP-20260904-fbe689
  fact_id: FACT-20260904-3d095e
  source_id: REQ-20260904-fc8f52
  relationship: support
  statement: The business goal is to prevent losses while giving legitimate merchants
    a clear path to resume payouts.
  location: ''
  created_at: '2026-09-04T00:34:40+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
assumptions:
- assumption_id: ASM-20260904-6058cc
  text: Mosaic Relay's direct contractual counterparty is the merchant/platform, not
    the end consumer; consumer-protection exposure likely flows through the merchant's
    own obligations unless Mosaic Relay holds funds belonging to consumers.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:34:40+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-1d8784
- assumption_id: ASM-20260904-cc7be4
  text: Analysis proceeds on a US-only jurisdiction basis; EU/UK obligations are out
    of scope for the primary analysis.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:38:03+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-d2554d
- assumption_id: ASM-20260904-d2ba28
  text: Legal sources cited in the eventual advice should be labeled verified or unverified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:38:03+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-d2554d
conflicts: []
actions:
- action_id: ACT-20260904-6fffe3
  summary: Linked Original request
  actor: system
  created_at: '2026-09-04T00:34:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260904-fc8f52
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-1d8784
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:34:40+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-03f65e
    - FACT-20260904-fe6695
    - FACT-20260904-35d508
    - FACT-20260904-5cb70b
    - FACT-20260904-3d095e
    sources: []
    support:
    - SUP-20260904-a5e8f8
    - SUP-20260904-89d5b3
    - SUP-20260904-95524c
    - SUP-20260904-ec6f37
    - SUP-20260904-fbe689
    assumptions:
    - ASM-20260904-6058cc
  source_action_key: chat:RUN-20260904-0d7078:tool:bd874cbaaee59126f8e97074
- action_id: ACT-20260904-6fdf31
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:35:07+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-30bc15
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-423b67
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:35:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-7d2bb5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-161486:answers
- action_id: ACT-20260904-9aef04
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:35:18+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-161486:tool:0e491b8445faf2df118b09bf
- action_id: ACT-20260904-381caf
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:35:41+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-0edabc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-d2ddd7
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:35:41+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-6df99e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-ae204f:answers
- action_id: ACT-20260904-0a04f6
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:35:53+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-ae204f:tool:e8186d179d8d9c268c842a02
- action_id: ACT-20260904-a104db
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:36:16+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-d80abb
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-d3778c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:36:16+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-6243a4
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-4abeb8:answers
- action_id: ACT-20260904-aaada9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:36:24+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-4abeb8:tool:ff150d755de58e2636eade1e
- action_id: ACT-20260904-76acdf
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:36:38+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-aabb6c
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-18bdd0
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:36:38+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-b56c94
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-e0c369:answers
- action_id: ACT-20260904-512144
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:36:52+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-e0c369:tool:07c2dda56e8b7049ec2a45a0
- action_id: ACT-20260904-d1f13c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:37:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-ea98b6
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-530ef0
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:37:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-27b6a9
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-f3c080:answers
- action_id: ACT-20260904-dea75a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:37:31+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-f3c080:tool:cb5a1e21493701c2b60c14ff
- action_id: ACT-20260904-a8da5b
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:37:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-9c1ecc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-e80d21
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:37:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-8a8d03
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-867bbf:answers
- action_id: ACT-20260904-d2554d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:38:03+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260904-cc7be4
    - ASM-20260904-d2ba28
  source_action_key: chat:RUN-20260904-867bbf:tool:fa227562ed5fe5418ee31f3a
working_ask: Advise on Mosaic Relay's proposed risk-control feature that temporarily
  delays a merchant payout when transaction-risk scoring flags unusual activity, high
  dispute risk, or incomplete verification — covering consumer and merchant disclosure
  language, timing and duration limits, fairness and transparency of automated risk
  decisions, handling of funds, escalation duties, and records needed to justify a
  hold. US-only jurisdiction.
issues:
- Whether held funds belong to the merchant or to underlying sellers/consumers, which
  determines whether this is a merchant-contract/regulatory matter or a consumer-protection
  matter
- Whether Mosaic Relay has contractual authority to delay payouts and what the merchant
  agreement currently says about holds
- Fairness and transparency obligations for automated risk decisions under US law
  (state automated-decision laws, FTC unfair/deceptive practices)
- Interest/fee treatment and what happens if a merchant cannot provide documents
- Whether the hold is triggered automatically by the risk-scoring model without human
  review
open_questions:
- Whether held funds belong to the merchant or to underlying sellers/consumers (determines
  merchant-contract vs consumer-protection framing)
- Interest/fee treatment during the hold and outcome if a merchant cannot provide
  documents
- Notice timing and available appeal rights
public_research_questions:
- What US state laws impose notice, timing, or transparency obligations on automated
  risk decisions that delay or withhold funds (e.g., California, Colorado, Illinois
  automated-decision laws)?
- What FTC unfair/deceptive-practices exposure attaches to automated holds on merchant
  payouts and to disclosure of hold reasons?
- What payment-facilitator and money-transmission rules govern holding funds pending
  risk review in the US?
intake_answers:
- answer_id: ANS-20260904-09e61d
  question_id: funds_ownership
  question: When a payout is held, whose funds are being delayed — the merchant's
    own funds, or funds that belong to underlying sellers or consumers who are paid
    through the merchant?
  answer: Not sure yet
  values:
  - unsure
  status: answered
  record_target: fact
  source_id: MSG-20260904-30bc15
  source_action_key: chat:RUN-20260904-161486
  answered_at: '2026-09-04T00:35:07+00:00'
  answer_fact_id: FACT-20260904-7d2bb5
- answer_id: ANS-20260904-9008cd
  question_id: jurisdiction_scope
  question: Which jurisdictions must this feature comply with for disclosure and timing
    obligations?
  answer: US only
  values:
  - us
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-0edabc
  source_action_key: chat:RUN-20260904-ae204f
  answered_at: '2026-09-04T00:35:41+00:00'
  answer_fact_id: FACT-20260904-6df99e
- answer_id: ANS-20260904-a89e76
  question_id: contractual_authority
  question: Does the current merchant agreement already grant Mosaic Relay authority
    to delay or hold payouts for risk review, and does it state notice, timing, or
    appeal terms?
  answer: Need to check
  values:
  - need_check
  status: answered
  record_target: fact
  source_id: MSG-20260904-d80abb
  source_action_key: chat:RUN-20260904-4abeb8
  answered_at: '2026-09-04T00:36:16+00:00'
  answer_fact_id: FACT-20260904-6243a4
- answer_id: ANS-20260904-0aaa20
  question_id: hold_automation
  question: Is the hold triggered automatically by the risk-scoring model without
    human review, or does a human analyst confirm before a hold is placed?
  answer: Not sure yet
  values:
  - unsure
  status: answered
  record_target: fact
  source_id: MSG-20260904-aabb6c
  source_action_key: chat:RUN-20260904-e0c369
  answered_at: '2026-09-04T00:36:39+00:00'
  answer_fact_id: FACT-20260904-b56c94
- answer_id: ANS-20260904-9354a9
  question_id: interest_fees
  question: During the hold, do interest or fees accrue, and what happens if a merchant
    cannot provide the requested documents?
  answer: Not sure yet
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260904-ea98b6
  source_action_key: chat:RUN-20260904-f3c080
  answered_at: '2026-09-04T00:37:21+00:00'
  answer_fact_id: FACT-20260904-27b6a9
- answer_id: ANS-20260904-c28003
  question_id: intake-recovery-finish
  question: Is there any other fact that would materially change the advice?
  answer: No additional facts are confirmed. Proceed with the stated US-only working
    assumption, treat funds ownership, contract authority, automation review, fee
    or interest treatment, notice timing, appeal rights, and document-failure outcomes
    as open material facts, and label any legal sources as verified or unverified.
  values:
  - No additional facts are confirmed. Proceed with the stated US-only working assumption,
    treat funds ownership, contract authority, automation review, fee or interest
    treatment, notice timing, appeal rights, and document-failure outcomes as open
    material facts, and label any legal sources as verified or unverified.
  status: answered
  record_target: fact
  source_id: MSG-20260904-9c1ecc
  source_action_key: chat:RUN-20260904-867bbf
  answered_at: '2026-09-04T00:37:48+00:00'
  answer_fact_id: FACT-20260904-8a8d03
intake_state: complete
---
# Known Facts

- Mosaic Relay proposes a risk-control feature that temporarily delays a merchant payout when transaction-risk scoring identifies unusual activity, high dispute risk, or incomplete verification.
- The merchant would see a status such as 'review required', receive a general explanation, and submit documents through a secure portal.
- Holds could begin automatically within minutes of a transaction and last from several hours to multiple weeks depending on review results.
- Mosaic Relay provides payout controls and risk scoring but does not hold deposits or operate as a bank.
- The business goal is to prevent losses while giving legitimate merchants a clear path to resume payouts.
- When a payout is held, whose funds are being delayed — the merchant's own funds, or funds that belong to underlying sellers or consumers who are paid through the merchant? — Not sure yet
- Which jurisdictions must this feature comply with for disclosure and timing obligations? — US only
- Does the current merchant agreement already grant Mosaic Relay authority to delay or hold payouts for risk review, and does it state notice, timing, or appeal terms? — Need to check
- Is the hold triggered automatically by the risk-scoring model without human review, or does a human analyst confirm before a hold is placed? — Not sure yet
- During the hold, do interest or fees accrue, and what happens if a merchant cannot provide the requested documents? — Not sure yet
- Is there any other fact that would materially change the advice? — No additional facts are confirmed. Proceed with the stated US-only working assumption, treat funds ownership, contract authority, automation review, fee or interest treatment, notice timing, appeal rights, and document-failure outcomes as open material facts, and label any legal sources as verified or unverified.

## Assumptions

- [Assumption] Mosaic Relay's direct contractual counterparty is the merchant/platform, not the end consumer; consumer-protection exposure likely flows through the merchant's own obligations unless Mosaic Relay holds funds belonging to consumers.
- [Assumption] Analysis proceeds on a US-only jurisdiction basis; EU/UK obligations are out of scope for the primary analysis.
- [Assumption] Legal sources cited in the eventual advice should be labeled verified or unverified.
