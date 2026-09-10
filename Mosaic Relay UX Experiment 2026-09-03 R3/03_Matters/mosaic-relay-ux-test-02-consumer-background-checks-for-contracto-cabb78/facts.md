---
matter_id: MAT-20260903-cabb78
record_type: facts
facts:
- fact_id: FACT-20260903-7a3ab4
  text: Mosaic Relay wants to offer a customer (a platform) a feature that screens
    contractors before they can receive payouts.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-d228f3
  text: The proposed experience asks contractors for consent, collects identifying
    information, obtains a background report from a vendor, and returns 'eligible',
    'manual review', or 'not eligible' to the customer.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-429c22
  text: The business goal is to help platforms reduce fraud and meet internal trust
    requirements without exposing detailed reports to platform staff who do not need
    them.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-6616d8
  text: Screening would occur during onboarding and again annually, with urgent rechecks
    after certain fraud or dispute events.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-321a94
  text: The feature may use criminal-record, identity, sanctions, and address information,
    but exact report contents and decision rules are unsettled.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-c30c93
  text: Actors include Mosaic Relay, the platform customer, contractors, background-screening
    vendors, Mosaic Relay operations staff, and payout recipients.
  status: active
  material: true
  source_ids:
  - REQ-20260903-b1c06e
  supersedes: null
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- fact_id: FACT-20260903-5618ed
  text: Which jurisdictions are in scope for the contractors being screened and the
    platform customer? — US only
  status: active
  material: true
  source_ids:
  - MSG-20260903-7b8ef1
  supersedes: null
  created_at: '2026-09-03T21:58:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2c7b6a
- fact_id: FACT-20260903-97896c
  text: Who makes the final eligibility decision that determines whether a contractor
    can receive payouts? — The platform customer makes the final decision
  status: active
  material: true
  source_ids:
  - MSG-20260903-ad9e92
  supersedes: null
  created_at: '2026-09-03T21:58:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0596f9
- fact_id: FACT-20260903-475937
  text: but a limited report (e.g., criminal/identity only).
  status: active
  material: true
  source_ids:
  - MSG-20260903-b1142c
  supersedes: null
  created_at: '2026-09-03T21:59:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4c60ae
- fact_id: FACT-20260903-690db5
  text: When does the business need the legal answer? — Continue with assumptions
  status: active
  material: true
  source_ids:
  - MSG-20260903-6346e7
  supersedes: null
  created_at: '2026-09-03T21:59:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c62cb1
sources:
- source_id: REQ-20260903-b1c06e
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-02-consumer-background-checks-for-contracto-cabb78/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T21:57:44+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-37425c
- source_id: MSG-20260903-7b8ef1
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T21:58:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-27cb42
- source_id: MSG-20260903-ad9e92
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T21:58:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b21914
- source_id: MSG-20260903-b1142c
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T21:59:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-dd31a1
- source_id: MSG-20260903-6346e7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T21:59:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-78658a
support:
- support_id: SUP-20260903-d7a73d
  fact_id: FACT-20260903-7a3ab4
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: Mosaic Relay wants to offer a customer (a platform) a feature that screens
    contractors before they can receive payouts.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- support_id: SUP-20260903-2b1df6
  fact_id: FACT-20260903-d228f3
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: The proposed experience asks contractors for consent, collects identifying
    information, obtains a background report from a vendor, and returns 'eligible',
    'manual review', or 'not eligible' to the customer.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- support_id: SUP-20260903-86d010
  fact_id: FACT-20260903-429c22
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: The business goal is to help platforms reduce fraud and meet internal
    trust requirements without exposing detailed reports to platform staff who do
    not need them.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- support_id: SUP-20260903-08429d
  fact_id: FACT-20260903-6616d8
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: Screening would occur during onboarding and again annually, with urgent
    rechecks after certain fraud or dispute events.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- support_id: SUP-20260903-6fb9a1
  fact_id: FACT-20260903-321a94
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: The feature may use criminal-record, identity, sanctions, and address
    information, but exact report contents and decision rules are unsettled.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- support_id: SUP-20260903-6a9204
  fact_id: FACT-20260903-c30c93
  source_id: REQ-20260903-b1c06e
  relationship: support
  statement: Actors include Mosaic Relay, the platform customer, contractors, background-screening
    vendors, Mosaic Relay operations staff, and payout recipients.
  location: ''
  created_at: '2026-09-03T21:57:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
assumptions:
- assumption_id: ASM-20260903-712d77
  text: The contractors being screened are individuals (consumers) in the US, making
    the FCRA the primary governing framework; this is unconfirmed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T21:57:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- assumption_id: ASM-20260903-ef99ed
  text: The background-screening vendor is a consumer reporting agency (CRA) subject
    to FCRA, rather than a non-FCRA data provider.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T21:57:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
- assumption_id: ASM-20260903-ad8b27
  text: Mosaic Relay and/or the customer would be a 'user' of a consumer report under
    FCRA.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T21:57:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d0081c
conflicts: []
actions:
- action_id: ACT-20260903-37425c
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T21:57:44+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-b1c06e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d0081c
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T21:57:52+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7a3ab4
    - FACT-20260903-d228f3
    - FACT-20260903-429c22
    - FACT-20260903-6616d8
    - FACT-20260903-321a94
    - FACT-20260903-c30c93
    sources: []
    support:
    - SUP-20260903-d7a73d
    - SUP-20260903-2b1df6
    - SUP-20260903-86d010
    - SUP-20260903-08429d
    - SUP-20260903-6fb9a1
    - SUP-20260903-6a9204
    assumptions:
    - ASM-20260903-712d77
    - ASM-20260903-ef99ed
    - ASM-20260903-ad8b27
  source_action_key: chat:RUN-20260903-f02694:tool:2422a2624f3279349dd368d2
- action_id: ACT-20260903-27cb42
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T21:58:36+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-7b8ef1
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-2c7b6a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T21:58:36+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-5618ed
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-cebfa8:answers
- action_id: ACT-20260903-949a7b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T21:58:44+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-cebfa8:tool:10516f807bdaa9b9bf7b2db4
- action_id: ACT-20260903-b21914
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T21:58:55+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ad9e92
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0596f9
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T21:58:55+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-97896c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0e3be0:answers
- action_id: ACT-20260903-60efd7
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T21:59:02+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0e3be0:tool:15fbe971e75259f298f1a1e2
- action_id: ACT-20260903-dd31a1
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T21:59:15+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-b1142c
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-4c60ae
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T21:59:15+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-475937
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0a7b6f:answers
- action_id: ACT-20260903-78658a
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T21:59:30+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-6346e7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c62cb1
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T21:59:30+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-690db5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c8ce60:answers
working_ask: 'Whether Mosaic Relay may lawfully offer a customer-facing feature that
  screens contractors (via a background-screening vendor) before they can receive
  payouts, and if so: which consumer notices and consents are required, who bears
  compliance duties, how adverse decisions must be handled, and whether any of the
  collected information may be used to restrict payouts.'
issues:
- 'FCRA applicability: whether the background report is a ''consumer report'' and
  Mosaic Relay / the customer are ''users'' with permissible-purpose and adverse-action
  obligations'
- Who is the decision-maker on eligibility (customer vs Mosaic Relay) and who bears
  adverse-action / notice duties
- Whether sanctions screening and identity checks are separate from consumer-report
  obligations
- Whether payout restriction based on screening results triggers additional consumer-protection
  or funds-flow disclosure duties
- US-only scope confirmed; state-level consumer-reporting and ban-the-box laws may
  still apply in addition to federal FCRA
open_questions:
- Adverse-action and dispute-handling procedures currently in place
- Retention periods for the screening data
- Source and accuracy process for the records used
- How are adverse decisions and disputes currently handled, and what retention period
  applies to the screening data?
public_research_questions:
- FCRA requirements for users of consumer reports in employment/contractor screening
  and adverse action
- State-level ban-the-box and consumer-reporting laws affecting contractor screening
- Whether sanctions and identity screening fall outside FCRA consumer-report obligations
intake_answers:
- answer_id: ANS-20260903-efb357
  question_id: jurisdiction
  question: Which jurisdictions are in scope for the contractors being screened and
    the platform customer?
  answer: US only
  values:
  - us_only
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-7b8ef1
  source_action_key: chat:RUN-20260903-cebfa8
  answered_at: '2026-09-03T21:58:36+00:00'
  answer_fact_id: FACT-20260903-5618ed
- answer_id: ANS-20260903-426927
  question_id: decision_maker
  question: Who makes the final eligibility decision that determines whether a contractor
    can receive payouts?
  answer: The platform customer makes the final decision
  values:
  - customer
  status: answered
  record_target: fact
  source_id: MSG-20260903-ad9e92
  source_action_key: chat:RUN-20260903-0e3be0
  answered_at: '2026-09-03T21:58:55+00:00'
  answer_fact_id: FACT-20260903-97896c
- answer_id: ANS-20260903-877d95
  question_id: vendor_cra
  question: Is the background-screening vendor a consumer reporting agency (CRA),
    and what does the report contain?
  answer: Yes — but a limited report (e.g., criminal/identity only)
  values:
  - limited_cra
  status: answered
  record_target: fact
  source_id: MSG-20260903-b1142c
  source_action_key: chat:RUN-20260903-0a7b6f
  answered_at: '2026-09-03T21:59:15+00:00'
  answer_fact_id: FACT-20260903-475937
- answer_id: ANS-20260903-826cf2
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Continue with assumptions
  values:
  - continue_with_assumptions
  status: answered
  record_target: fact
  source_id: MSG-20260903-6346e7
  source_action_key: chat:RUN-20260903-c8ce60
  answered_at: '2026-09-03T21:59:30+00:00'
  answer_fact_id: FACT-20260903-690db5
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay wants to offer a customer (a platform) a feature that screens
      contractors before they can receive payouts.

      - The proposed experience asks contractors for consent, collects identifying
      information, obtains a background report from a vendor, and returns ''eligible'',
      ''manual review'', or ''not eligible'' to the customer.

      - The business goal is to help platforms reduce fraud and meet internal trust
      requirements without exposing detailed reports to platform staff who do not
      need them.

      - Screening would occur during onboarding and again annually, with urgent rechecks
      after certain fraud or dispute events.

      - The feature may use criminal-record, identity, sanctions, and address information,
      but exact report contents and decision rules are unsettled.

      - Actors include Mosaic Relay, the platform customer, contractors, background-screening
      vendors, Mosaic Relay operations staff, and payout recipients.

      - Which jurisdictions are in scope for the contractors being screened and the
      platform customer? — US only

      - Who makes the final eligibility decision that determines whether a contractor
      can receive payouts? — The platform customer makes the final decision

      - but a limited report (e.g., criminal/identity only).

      - When does the business need the legal answer? — Continue with assumptions


      ## Assumptions


      - [Assumption] The contractors being screened are individuals (consumers) in
      the US, making the FCRA the primary governing framework; this is unconfirmed.

      - [Assumption] The background-screening vendor is a consumer reporting agency
      (CRA) subject to FCRA, rather than a non-FCRA data provider.

      - [Assumption] Mosaic Relay and/or the customer would be a ''user'' of a consumer
      report under FCRA.

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

- Mosaic Relay wants to offer a customer (a platform) a feature that screens contractors before they can receive payouts.
- The proposed experience asks contractors for consent, collects identifying information, obtains a background report from a vendor, and returns 'eligible', 'manual review', or 'not eligible' to the customer.
- The business goal is to help platforms reduce fraud and meet internal trust requirements without exposing detailed reports to platform staff who do not need them.
- Screening would occur during onboarding and again annually, with urgent rechecks after certain fraud or dispute events.
- The feature may use criminal-record, identity, sanctions, and address information, but exact report contents and decision rules are unsettled.
- Actors include Mosaic Relay, the platform customer, contractors, background-screening vendors, Mosaic Relay operations staff, and payout recipients.
- Which jurisdictions are in scope for the contractors being screened and the platform customer? — US only
- Who makes the final eligibility decision that determines whether a contractor can receive payouts? — The platform customer makes the final decision
- but a limited report (e.g., criminal/identity only).
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- [Assumption] The contractors being screened are individuals (consumers) in the US, making the FCRA the primary governing framework; this is unconfirmed.
- [Assumption] The background-screening vendor is a consumer reporting agency (CRA) subject to FCRA, rather than a non-FCRA data provider.
- [Assumption] Mosaic Relay and/or the customer would be a 'user' of a consumer report under FCRA.
