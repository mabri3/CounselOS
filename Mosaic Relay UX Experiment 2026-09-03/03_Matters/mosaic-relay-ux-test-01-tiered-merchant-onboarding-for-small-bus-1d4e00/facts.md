---
matter_id: MAT-20260903-1d4e00
record_type: facts
facts:
- fact_id: FACT-20260903-2d657f
  text: Mosaic Relay provides payment infrastructure and does not hold deposits or
    operate as a bank.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-128a0b
  text: 'Product proposes a tiered onboarding flow: business provides legal name,
    registration details, owners, expected volume, countries, and payment methods;
    Mosaic Relay runs KYB, identity verification, sanctions screening, and risk scoring.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-39e6c2
  text: Low-risk applicants would receive API credentials within minutes; higher-risk
    or incomplete applications move to a manual review queue.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-e0961c
  text: Product expects to apply lower verification requirements to businesses below
    a proposed monthly volume threshold.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-193c38
  text: The monthly volume threshold has not been confirmed as suitable for all payment
    methods or jurisdictions.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-062bcf
  text: Beneficial-owner information to collect, refresh cadence, and whether merchants
    may process limited transactions while review is pending have not been settled.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-6ec50a
  text: Target launch is in six weeks before the holiday sales period.
  status: active
  material: true
  source_ids:
  - REQ-20260903-fd7421
  supersedes: null
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- fact_id: FACT-20260903-30209e
  text: Which payment methods and jurisdictions will the tiered onboarding flow cover?
    This determines whether a single volume threshold can apply uniformly. — Not yet
    decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-ffe0ce
  supersedes: null
  created_at: '2026-09-03T08:35:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-30a19b
- fact_id: FACT-20260903-56c3df
  text: What is the proposed monthly volume threshold for the lower-verification tier,
    and what is the basis for setting it? — The proposed monthly volume threshold
    has not been set. Product has not documented a risk-based basis, and suitability
    across payment methods or jurisdictions is unconfirmed.
  status: active
  material: true
  source_ids:
  - MSG-20260903-73b131
  supersedes: null
  created_at: '2026-09-03T08:36:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4fd649
- fact_id: FACT-20260903-d2d4d0
  text: Should a merchant be allowed to process limited transactions while their application
    is in manual review? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-8b3415
  supersedes: null
  created_at: '2026-09-03T08:36:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79ad22
- fact_id: FACT-20260903-838463
  text: Which beneficial-owner information does Product plan to collect, and how often
    should it be refreshed? — Product has not settled the beneficial-owner data set
    or refresh cycle. The legal name, registration details, owners, and identity verification
    are proposed inputs, but required ownership percentages, control-person details,
    supporting documents, and refresh triggers or frequency remain open.
  status: active
  material: true
  source_ids:
  - MSG-20260903-65edd5
  supersedes: null
  created_at: '2026-09-03T08:37:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-76a583
- fact_id: FACT-20260903-ee2157
  text: not yet confirmed.
  status: active
  material: true
  source_ids:
  - MSG-20260903-4f3522
  supersedes: null
  created_at: '2026-09-03T08:38:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-052404
sources:
- source_id: REQ-20260903-fd7421
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-01-tiered-merchant-onboarding-for-small-bus-1d4e00/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T08:35:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-301171
- source_id: MSG-20260903-ffe0ce
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T08:35:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-910557
- source_id: MSG-20260903-73b131
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T08:36:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-21d41d
- source_id: MSG-20260903-8b3415
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T08:36:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-bb7f28
- source_id: MSG-20260903-65edd5
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T08:37:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-49e803
- source_id: MSG-20260903-4f3522
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T08:38:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-51a174
support:
- support_id: SUP-20260903-29af0e
  fact_id: FACT-20260903-2d657f
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: Mosaic Relay provides payment infrastructure and does not hold deposits
    or operate as a bank.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-055444
  fact_id: FACT-20260903-128a0b
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: 'Product proposes a tiered onboarding flow: business provides legal name,
    registration details, owners, expected volume, countries, and payment methods;
    Mosaic Relay runs KYB, identity verification, sanctions screening, and risk scoring.'
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-9eccaa
  fact_id: FACT-20260903-39e6c2
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: Low-risk applicants would receive API credentials within minutes; higher-risk
    or incomplete applications move to a manual review queue.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-2b1239
  fact_id: FACT-20260903-e0961c
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: Product expects to apply lower verification requirements to businesses
    below a proposed monthly volume threshold.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-d33e4c
  fact_id: FACT-20260903-193c38
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: The monthly volume threshold has not been confirmed as suitable for all
    payment methods or jurisdictions.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-ca7c5a
  fact_id: FACT-20260903-062bcf
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: Beneficial-owner information to collect, refresh cadence, and whether
    merchants may process limited transactions while review is pending have not been
    settled.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- support_id: SUP-20260903-a6327c
  fact_id: FACT-20260903-6ec50a
  source_id: REQ-20260903-fd7421
  relationship: support
  statement: Target launch is in six weeks before the holiday sales period.
  location: ''
  created_at: '2026-09-03T08:35:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
assumptions:
- assumption_id: ASM-20260903-5f5997
  text: Mosaic Relay operates primarily in the United States in this scenario; any
    non-US expansion is subject to separate legal review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T08:35:29+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- assumption_id: ASM-20260903-e46ecd
  text: The tiered flow applies to Mosaic Relay's standard card, ACH, and local payment
    methods unless otherwise specified.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T08:35:29+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
- assumption_id: ASM-20260903-18495a
  text: Mosaic Relay's acquiring partners and processors impose their own onboarding
    and underwriting requirements that must be reconciled with the tiered flow.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T08:35:29+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6e3629
conflicts: []
actions:
- action_id: ACT-20260903-301171
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T08:35:13+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-fd7421
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6e3629
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:35:29+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-2d657f
    - FACT-20260903-128a0b
    - FACT-20260903-39e6c2
    - FACT-20260903-e0961c
    - FACT-20260903-193c38
    - FACT-20260903-062bcf
    - FACT-20260903-6ec50a
    sources: []
    support:
    - SUP-20260903-29af0e
    - SUP-20260903-055444
    - SUP-20260903-9eccaa
    - SUP-20260903-2b1239
    - SUP-20260903-d33e4c
    - SUP-20260903-ca7c5a
    - SUP-20260903-a6327c
    assumptions:
    - ASM-20260903-5f5997
    - ASM-20260903-e46ecd
    - ASM-20260903-18495a
  source_action_key: chat:RUN-20260903-544fb0:tool:a633adc5e594c2b4a9ec991d
- action_id: ACT-20260903-910557
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T08:35:51+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ffe0ce
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-30a19b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T08:35:51+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-30209e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9ccefa:answers
- action_id: ACT-20260903-26644f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:36:01+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9ccefa:tool:3b0607b8075685a0804cf689
- action_id: ACT-20260903-21d41d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T08:36:17+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-73b131
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-4fd649
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T08:36:17+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-56c3df
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-45dc13:answers
- action_id: ACT-20260903-93873f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:36:27+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-45dc13:tool:087dbbf5bf4bf93025606a0c
- action_id: ACT-20260903-bb7f28
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T08:36:50+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8b3415
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-79ad22
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T08:36:50+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-d2d4d0
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-8e5539:answers
- action_id: ACT-20260903-4dfb1e
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:37:01+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-8e5539:tool:b278dcaf347f34406144439a
- action_id: ACT-20260903-49e803
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T08:37:28+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-65edd5
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-76a583
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T08:37:28+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-838463
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-877047:answers
- action_id: ACT-20260903-3216d7
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:37:44+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-877047:tool:7d31dcf07eec7e5e1d099671
- action_id: ACT-20260903-51a174
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T08:38:13+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-4f3522
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-052404
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T08:38:13+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-ee2157
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-3f1887:answers
- action_id: ACT-20260903-bae37f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T08:38:21+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-3f1887:tool:ee672550854424ad03fa892b
working_ask: Advise on the required onboarding checks, permissible tiering and transaction
  limits, recordkeeping, customer notices, and whether the proposed tiered merchant
  onboarding launch flow is legally acceptable for small online businesses, targeting
  launch in six weeks before the holiday sales period.
issues:
- Tiering based on a monthly volume threshold may not be permissible uniformly across
  payment methods (card vs ACH vs local) and jurisdictions.
- Lower verification for low-volume businesses must still satisfy KYB/KYC, sanctions
  screening, and BSA/AML baseline requirements.
- Beneficial-owner data collection and refresh cadence are undefined.
- Whether a merchant may process limited transactions during pending manual review
  is unresolved.
- Recordkeeping and customer notice obligations for the tiered flow are not yet mapped.
- Payment methods and jurisdictions in scope remain undecided, so a single volume
  threshold cannot yet be validated.
- The proposed monthly volume threshold is unset and has no documented risk-based
  basis, so the tiering structure cannot yet be validated.
- Whether acquiring partners and processors will accept the tiered verification levels
  and lower threshold is unconfirmed.
open_questions:
- Payment methods and jurisdictions in scope for the tiered flow
- Proposed monthly volume threshold and its risk-based basis
- Whether merchants may process limited transactions during pending manual review
- Beneficial-owner data set and refresh cadence
- Acquiring partner and processor acceptance of tiered verification levels
public_research_questions:
- What are the baseline KYB/KYC, sanctions screening, and BSA/AML onboarding requirements
  for a payments infrastructure provider in the U.S.?
- What are the card network and processor rules on merchant onboarding, underwriting,
  and transaction limits that constrain tiered verification?
- What are the recordkeeping and customer notice obligations applicable to merchant
  onboarding and tiered verification in the U.S.?
intake_answers:
- answer_id: ANS-20260903-d04c78
  question_id: q_scope_methods_jurisdictions
  question: Which payment methods and jurisdictions will the tiered onboarding flow
    cover? This determines whether a single volume threshold can apply uniformly.
  answer: Not yet decided
  values:
  - not_yet_decided
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-ffe0ce
  source_action_key: chat:RUN-20260903-9ccefa
  answered_at: '2026-09-03T08:35:51+00:00'
  answer_fact_id: FACT-20260903-30209e
- answer_id: ANS-20260903-3f2a07
  question_id: q_volume_threshold
  question: What is the proposed monthly volume threshold for the lower-verification
    tier, and what is the basis for setting it?
  answer: The proposed monthly volume threshold has not been set. Product has not
    documented a risk-based basis, and suitability across payment methods or jurisdictions
    is unconfirmed.
  values:
  - The proposed monthly volume threshold has not been set. Product has not documented
    a risk-based basis, and suitability across payment methods or jurisdictions is
    unconfirmed.
  status: answered
  record_target: fact
  source_id: MSG-20260903-73b131
  source_action_key: chat:RUN-20260903-45dc13
  answered_at: '2026-09-03T08:36:17+00:00'
  answer_fact_id: FACT-20260903-56c3df
- answer_id: ANS-20260903-c838c7
  question_id: pending_review_processing
  question: Should a merchant be allowed to process limited transactions while their
    application is in manual review?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-8b3415
  source_action_key: chat:RUN-20260903-8e5539
  answered_at: '2026-09-03T08:36:50+00:00'
  answer_fact_id: FACT-20260903-d2d4d0
- answer_id: ANS-20260903-935ea0
  question_id: bo_data
  question: Which beneficial-owner information does Product plan to collect, and how
    often should it be refreshed?
  answer: Product has not settled the beneficial-owner data set or refresh cycle.
    The legal name, registration details, owners, and identity verification are proposed
    inputs, but required ownership percentages, control-person details, supporting
    documents, and refresh triggers or frequency remain open.
  values:
  - Product has not settled the beneficial-owner data set or refresh cycle. The legal
    name, registration details, owners, and identity verification are proposed inputs,
    but required ownership percentages, control-person details, supporting documents,
    and refresh triggers or frequency remain open.
  status: answered
  record_target: fact
  source_id: MSG-20260903-65edd5
  source_action_key: chat:RUN-20260903-877047
  answered_at: '2026-09-03T08:37:29+00:00'
  answer_fact_id: FACT-20260903-838463
- answer_id: ANS-20260903-536272
  question_id: q_partner_acceptance
  question: Have acquiring partners and processors confirmed they will accept the
    tiered verification levels and the lower-verification threshold?
  answer: No, not yet confirmed
  values:
  - not_confirmed
  status: answered
  record_target: fact
  source_id: MSG-20260903-4f3522
  source_action_key: chat:RUN-20260903-3f1887
  answered_at: '2026-09-03T08:38:13+00:00'
  answer_fact_id: FACT-20260903-ee2157
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay provides payment infrastructure and does not hold deposits or
      operate as a bank.

      - Product proposes a tiered onboarding flow: business provides legal name, registration
      details, owners, expected volume, countries, and payment methods; Mosaic Relay
      runs KYB, identity verification, sanctions screening, and risk scoring.

      - Low-risk applicants would receive API credentials within minutes; higher-risk
      or incomplete applications move to a manual review queue.

      - Product expects to apply lower verification requirements to businesses below
      a proposed monthly volume threshold.

      - The monthly volume threshold has not been confirmed as suitable for all payment
      methods or jurisdictions.

      - Beneficial-owner information to collect, refresh cadence, and whether merchants
      may process limited transactions while review is pending have not been settled.

      - Target launch is in six weeks before the holiday sales period.

      - Which payment methods and jurisdictions will the tiered onboarding flow cover?
      This determines whether a single volume threshold can apply uniformly. — Not
      yet decided

      - What is the proposed monthly volume threshold for the lower-verification tier,
      and what is the basis for setting it? — The proposed monthly volume threshold
      has not been set. Product has not documented a risk-based basis, and suitability
      across payment methods or jurisdictions is unconfirmed.

      - Should a merchant be allowed to process limited transactions while their application
      is in manual review? — Not yet decided

      - Which beneficial-owner information does Product plan to collect, and how often
      should it be refreshed? — Product has not settled the beneficial-owner data
      set or refresh cycle. The legal name, registration details, owners, and identity
      verification are proposed inputs, but required ownership percentages, control-person
      details, supporting documents, and refresh triggers or frequency remain open.

      - not yet confirmed.


      ## Assumptions


      - [Assumption] Mosaic Relay operates primarily in the United States in this
      scenario; any non-US expansion is subject to separate legal review.

      - [Assumption] The tiered flow applies to Mosaic Relay''s standard card, ACH,
      and local payment methods unless otherwise specified.

      - [Assumption] Mosaic Relay''s acquiring partners and processors impose their
      own onboarding and underwriting requirements that must be reconciled with the
      tiered flow.

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

- Mosaic Relay provides payment infrastructure and does not hold deposits or operate as a bank.
- Product proposes a tiered onboarding flow: business provides legal name, registration details, owners, expected volume, countries, and payment methods; Mosaic Relay runs KYB, identity verification, sanctions screening, and risk scoring.
- Low-risk applicants would receive API credentials within minutes; higher-risk or incomplete applications move to a manual review queue.
- Product expects to apply lower verification requirements to businesses below a proposed monthly volume threshold.
- The monthly volume threshold has not been confirmed as suitable for all payment methods or jurisdictions.
- Beneficial-owner information to collect, refresh cadence, and whether merchants may process limited transactions while review is pending have not been settled.
- Target launch is in six weeks before the holiday sales period.
- Which payment methods and jurisdictions will the tiered onboarding flow cover? This determines whether a single volume threshold can apply uniformly. — Not yet decided
- What is the proposed monthly volume threshold for the lower-verification tier, and what is the basis for setting it? — The proposed monthly volume threshold has not been set. Product has not documented a risk-based basis, and suitability across payment methods or jurisdictions is unconfirmed.
- Should a merchant be allowed to process limited transactions while their application is in manual review? — Not yet decided
- Which beneficial-owner information does Product plan to collect, and how often should it be refreshed? — Product has not settled the beneficial-owner data set or refresh cycle. The legal name, registration details, owners, and identity verification are proposed inputs, but required ownership percentages, control-person details, supporting documents, and refresh triggers or frequency remain open.
- not yet confirmed.

## Assumptions

- [Assumption] Mosaic Relay operates primarily in the United States in this scenario; any non-US expansion is subject to separate legal review.
- [Assumption] The tiered flow applies to Mosaic Relay's standard card, ACH, and local payment methods unless otherwise specified.
- [Assumption] Mosaic Relay's acquiring partners and processors impose their own onboarding and underwriting requirements that must be reconciled with the tiered flow.
