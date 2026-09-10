---
matter_id: MAT-20260904-abf788
record_type: facts
facts:
- fact_id: FACT-20260904-c034a8
  text: Sellers onboard with email and bank account only; full identity info is collected
    only after a seller crosses $3,000 in cumulative payouts.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-70d0fc
  text: Engineering selected the $3,000 cumulative payout threshold because they believe
    it is 'the BSA threshold.'
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-3584f8
  text: Payouts go out via the bank partner's ACH rails, and Mosaic Relay is the party
    initiating them.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-8e8a07
  text: International sellers can elect payout in USDC through Circuit (a licensed
    exchange Mosaic Relay contracts with); the seller provides a wallet address that
    may be an exchange account or their own wallet.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-3dca0d
  text: OFAC screening runs nightly in batch against the day's payouts; real-time
    screening adds ~400ms and would undermine the 'instant' promise.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-1b159e
  text: Business sellers upload a W-9 and Mosaic Relay takes the signer's name; Mosaic
    Relay is not asking for owners because the UI is already 11 screens.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-a6154b
  text: Sellers are shown a progress bar reading '$1,240 of $3,000 until full verification.'
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-29ff34
  text: The bank partner has seen the deck.
  status: active
  material: true
  source_ids:
  - REQ-20260904-a360ee
  supersedes: null
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- fact_id: FACT-20260904-968919
  text: What is the legal basis for the $3,000 cumulative payout threshold before
    collecting full identity? This is the foundation of the onboarding design and
    appears to rest on a misconception about 'the BSA threshold.' — It was purely
    an engineering/product choice, no legal basis confirmed
  status: active
  material: true
  source_ids:
  - MSG-20260904-a9faf6
  supersedes: null
  created_at: '2026-09-04T04:06:44+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-75093c
- fact_id: FACT-20260904-c94aaf
  text: What is Mosaic Relay's money transmission licensing posture for initiating
    these ACH payouts? — We operate as an agent / under the bank partner's license
  status: active
  material: true
  source_ids:
  - MSG-20260904-3d2c85
  supersedes: null
  created_at: '2026-09-04T04:47:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-9b542f
- fact_id: FACT-20260904-0835cf
  text: Which jurisdictions are the international sellers located in for the USDC
    payout option? — Asia
  status: active
  material: true
  source_ids:
  - MSG-20260904-cdbc0c
  supersedes: null
  created_at: '2026-09-04T04:54:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-26f1b7
- fact_id: FACT-20260904-15a29a
  text: Jurisdictions of the international sellers eligible for USDC payouts. — Mexico
  status: active
  material: true
  source_ids:
  - MSG-20260904-3865f0
  supersedes: null
  created_at: '2026-09-04T05:17:37+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-cb883e
sources:
- source_id: REQ-20260904-a360ee
  kind: immutable_request
  label: Original request
  path: 03_Matters/instant-payouts-q1-abf788/request.md
  version: ''
  location: ''
  created_at: '2026-09-04T03:42:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-cac939
- source_id: MSG-20260904-a9faf6
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T04:06:44+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-79e596
- source_id: MSG-20260904-3d2c85
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T04:47:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-897005
- source_id: MSG-20260904-cdbc0c
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T04:54:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-410c6c
- source_id: MSG-20260904-3865f0
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T05:17:37+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-ba1954
support:
- support_id: SUP-20260904-5c54fa
  fact_id: FACT-20260904-c034a8
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: Sellers onboard with email and bank account only; full identity info
    is collected only after a seller crosses $3,000 in cumulative payouts.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-2eb1ce
  fact_id: FACT-20260904-70d0fc
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: Engineering selected the $3,000 cumulative payout threshold because they
    believe it is 'the BSA threshold.'
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-5a21cb
  fact_id: FACT-20260904-3584f8
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: Payouts go out via the bank partner's ACH rails, and Mosaic Relay is
    the party initiating them.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-e68fb8
  fact_id: FACT-20260904-8e8a07
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: International sellers can elect payout in USDC through Circuit (a licensed
    exchange Mosaic Relay contracts with); the seller provides a wallet address that
    may be an exchange account or their own wallet.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-3d5d16
  fact_id: FACT-20260904-3dca0d
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: OFAC screening runs nightly in batch against the day's payouts; real-time
    screening adds ~400ms and would undermine the 'instant' promise.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-c4ce4e
  fact_id: FACT-20260904-1b159e
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: Business sellers upload a W-9 and Mosaic Relay takes the signer's name;
    Mosaic Relay is not asking for owners because the UI is already 11 screens.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-0653ae
  fact_id: FACT-20260904-a6154b
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: Sellers are shown a progress bar reading '$1,240 of $3,000 until full
    verification.'
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- support_id: SUP-20260904-385fb8
  fact_id: FACT-20260904-29ff34
  source_id: REQ-20260904-a360ee
  relationship: support
  statement: The bank partner has seen the deck.
  location: ''
  created_at: '2026-09-04T03:43:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
assumptions:
- assumption_id: ASM-20260904-788373
  text: Mosaic Relay is not a bank and does not hold deposits; the payout flow routes
    funds to sellers via the bank partner's ACH rails.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T03:43:13+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- assumption_id: ASM-20260904-9f48b6
  text: The bank partner's review of the deck does not constitute a legal determination
    of Mosaic Relay's own compliance obligations.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T03:43:13+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- assumption_id: ASM-20260904-d7002c
  text: The $3,000 figure in the request is being treated by the requester as a compliance
    threshold, but its legal basis is unverified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T03:43:13+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-668ca6
- assumption_id: ASM-20260904-a4f1d7
  text: Operating as an agent under the bank partner's license does not by itself
    resolve Mosaic Relay's own CIP/AML and sanctions obligations.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T04:47:46+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-b5fa9b
- assumption_id: ASM-20260904-7efa63
  text: The OFAC screening timing is effectively nightly batch after payouts are released,
    per the design.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T05:17:58+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-7f4c9b
conflicts: []
actions:
- action_id: ACT-20260904-cac939
  summary: Linked Original request
  actor: system
  created_at: '2026-09-04T03:42:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260904-a360ee
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-668ca6
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T03:43:13+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-c034a8
    - FACT-20260904-70d0fc
    - FACT-20260904-3584f8
    - FACT-20260904-8e8a07
    - FACT-20260904-3dca0d
    - FACT-20260904-1b159e
    - FACT-20260904-a6154b
    - FACT-20260904-29ff34
    sources: []
    support:
    - SUP-20260904-5c54fa
    - SUP-20260904-2eb1ce
    - SUP-20260904-5a21cb
    - SUP-20260904-e68fb8
    - SUP-20260904-3d5d16
    - SUP-20260904-c4ce4e
    - SUP-20260904-0653ae
    - SUP-20260904-385fb8
    assumptions:
    - ASM-20260904-788373
    - ASM-20260904-9f48b6
    - ASM-20260904-d7002c
  source_action_key: chat:RUN-20260904-614612:tool:973d8ea18ae62ee8f76dd7ac
- action_id: ACT-20260904-79e596
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T04:06:44+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-a9faf6
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-75093c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T04:06:44+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-968919
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-2139b5:answers
- action_id: ACT-20260904-f5a9d8
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T04:06:55+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-2139b5:tool:a7fe85edc2797e5782c54b2a
- action_id: ACT-20260904-897005
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T04:47:36+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-3d2c85
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-9b542f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T04:47:36+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-c94aaf
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-9fcee8:answers
- action_id: ACT-20260904-b5fa9b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T04:47:46+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260904-a4f1d7
  source_action_key: chat:RUN-20260904-9fcee8:tool:5e16ed664cee7b4d095c8233
- action_id: ACT-20260904-410c6c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T04:54:19+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-cdbc0c
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-26f1b7
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T04:54:19+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-0835cf
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-3a5a2f:answers
- action_id: ACT-20260904-ba1954
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T05:17:37+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-3865f0
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-cb883e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T05:17:37+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-15a29a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-3906cd:answers
- action_id: ACT-20260904-7f4c9b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T05:17:58+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260904-7efa63
  source_action_key: chat:RUN-20260904-3906cd:tool:098eaf5a98645c6ce87e4890
working_ask: Can Mosaic Relay ship Instant Payouts for marketplace sellers in Q1,
  given the proposed onboarding (email + bank account only, full identity deferred
  to $3,000 cumulative payouts), ACH payouts initiated by Mosaic Relay via the bank
  partner, USDC payouts to international sellers (Mexico) via Circuit, nightly batch
  OFAC screening, W-9-only business onboarding without owners, and a public $3,000
  verification progress bar?
issues:
- The $3,000 cumulative payout threshold is not a recognized BSA customer-identification
  threshold; there is no $3,000 BSA CIP trigger. Under BSA/AML, a money transmitter
  must collect CIP before establishing the account relationship, not after a payout
  threshold. Deferring identity collection until $3,000 is likely non-compliant.
- Operating as an agent under the bank partner's license does not resolve Mosaic Relay's
  own money transmission licensing posture for initiating ACH payouts, nor its own
  CIP/AML and sanctions obligations.
- OFAC screening in nightly batch against the day's payouts means payouts are released
  before screening completes, risking release of funds to sanctioned parties; screening
  must generally occur before funds are released/blocked.
- USDC payouts to international sellers (Mexico), including to self-hosted wallets,
  raise sanctions, AML, and virtual-asset money transmission licensing questions distinct
  from fiat ACH payouts.
- Not collecting beneficial owners for business sellers is a KYB/AML gap and may conflict
  with beneficial-ownership reporting obligations.
- Publicly displaying the $3,000 verification threshold via a progress bar may facilitate
  evasion and raises funds-flow/consumer disclosure concerns.
open_questions:
- Mosaic Relay's own money transmission licensing status (whether it holds licenses
  or relies solely on the bank partner's license).
- Whether the bank partner's CIP/AML obligations extend to Mosaic Relay's onboarding
  under the agent arrangement.
- The specific Asian/Mexican regulatory treatment of USDC payouts to self-hosted wallets.
- Whether beneficial-ownership information is required for the business sellers in
  the relevant jurisdictions.
public_research_questions:
- What are the state money transmission licensing requirements for a company initiating
  ACH payouts as an agent of a licensed bank?
- What are the OFAC and AML obligations for releasing payouts before sanctions screening
  completes?
- What are the virtual-asset money transmission and sanctions requirements for USDC
  payouts to self-hosted wallets in Mexico?
intake_answers:
- answer_id: ANS-20260904-995be8
  question_id: q1_threshold_basis
  question: What is the legal basis for the $3,000 cumulative payout threshold before
    collecting full identity? This is the foundation of the onboarding design and
    appears to rest on a misconception about 'the BSA threshold.'
  answer: It was purely an engineering/product choice, no legal basis confirmed
  values:
  - engineering_choice
  status: answered
  record_target: fact
  source_id: MSG-20260904-a9faf6
  source_action_key: chat:RUN-20260904-2139b5
  answered_at: '2026-09-04T04:06:44+00:00'
  answer_fact_id: FACT-20260904-968919
- answer_id: ANS-20260904-16280f
  question_id: q2_licensing
  question: What is Mosaic Relay's money transmission licensing posture for initiating
    these ACH payouts?
  answer: We operate as an agent / under the bank partner's license
  values:
  - agent_under_bank
  status: answered
  record_target: fact
  source_id: MSG-20260904-3d2c85
  source_action_key: chat:RUN-20260904-9fcee8
  answered_at: '2026-09-04T04:47:36+00:00'
  answer_fact_id: FACT-20260904-c94aaf
- answer_id: ANS-20260904-d8bf2a
  question_id: q_intl_jurisdictions
  question: Which jurisdictions are the international sellers located in for the USDC
    payout option?
  answer: Asia
  values:
  - asia
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-cdbc0c
  source_action_key: chat:RUN-20260904-3a5a2f
  answered_at: '2026-09-04T04:54:19+00:00'
  answer_fact_id: FACT-20260904-0835cf
- answer_id: ANS-20260904-ddc3db
  question_id: intake-recovery-missing-fact-a224107088
  question: Jurisdictions of the international sellers eligible for USDC payouts.
  answer: Mexico
  values:
  - Mexico
  status: answered
  record_target: fact
  source_id: MSG-20260904-3865f0
  source_action_key: chat:RUN-20260904-3906cd
  answered_at: '2026-09-04T05:17:37+00:00'
  answer_fact_id: FACT-20260904-15a29a
intake_state: complete
---
# Known Facts

- Sellers onboard with email and bank account only; full identity info is collected only after a seller crosses $3,000 in cumulative payouts.
- Engineering selected the $3,000 cumulative payout threshold because they believe it is 'the BSA threshold.'
- Payouts go out via the bank partner's ACH rails, and Mosaic Relay is the party initiating them.
- International sellers can elect payout in USDC through Circuit (a licensed exchange Mosaic Relay contracts with); the seller provides a wallet address that may be an exchange account or their own wallet.
- OFAC screening runs nightly in batch against the day's payouts; real-time screening adds ~400ms and would undermine the 'instant' promise.
- Business sellers upload a W-9 and Mosaic Relay takes the signer's name; Mosaic Relay is not asking for owners because the UI is already 11 screens.
- Sellers are shown a progress bar reading '$1,240 of $3,000 until full verification.'
- The bank partner has seen the deck.
- What is the legal basis for the $3,000 cumulative payout threshold before collecting full identity? This is the foundation of the onboarding design and appears to rest on a misconception about 'the BSA threshold.' — It was purely an engineering/product choice, no legal basis confirmed
- What is Mosaic Relay's money transmission licensing posture for initiating these ACH payouts? — We operate as an agent / under the bank partner's license
- Which jurisdictions are the international sellers located in for the USDC payout option? — Asia
- Jurisdictions of the international sellers eligible for USDC payouts. — Mexico

## Assumptions

- [Assumption] Mosaic Relay is not a bank and does not hold deposits; the payout flow routes funds to sellers via the bank partner's ACH rails.
- [Assumption] The bank partner's review of the deck does not constitute a legal determination of Mosaic Relay's own compliance obligations.
- [Assumption] The $3,000 figure in the request is being treated by the requester as a compliance threshold, but its legal basis is unverified.
- [Assumption] Operating as an agent under the bank partner's license does not by itself resolve Mosaic Relay's own CIP/AML and sanctions obligations.
- [Assumption] The OFAC screening timing is effectively nightly batch after payouts are released, per the design.
