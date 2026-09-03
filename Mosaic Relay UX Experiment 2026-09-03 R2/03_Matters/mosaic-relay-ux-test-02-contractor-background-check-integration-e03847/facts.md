---
matter_id: MAT-20260903-e03847
record_type: facts
facts:
- fact_id: FACT-20260903-0599b7
  text: A software platform wants to use Mosaic Relay to pay contractors.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-d04cc7
  text: The platform proposes adding a background-check vendor to screen contractors
    for identity, criminal history, sanctions, and work eligibility before the first
    payout.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-588fd6
  text: The platform would receive a 'clear', 'review', or 'fail' result from the
    screening.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-ac3a12
  text: Mosaic Relay would process identity data and payout instructions.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-7789b8
  text: Actors are Product, the platform, the screening vendor, and contractors.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-2c9ab5
  text: Target launch is eight weeks away (2026-10-29).
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-c5a349
  text: The vendor's API and stated coverage in the United States are known.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-a65675
  text: The initial use case involves delivery contractors.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- fact_id: FACT-20260903-08d5dd
  text: Who makes the final decision when a contractor receives a 'review' or 'fail'
    screening result? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-a791df
  supersedes: null
  created_at: '2026-09-03T16:09:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f8d50f
- fact_id: FACT-20260903-19a96d
  text: Are the background-check reports 'consumer reports' under FCRA, and is the
    screening vendor a consumer reporting agency (CRA)? — Unknown — need to confirm
    with vendor
  status: active
  material: true
  source_ids:
  - MSG-20260903-14cf58
  supersedes: null
  created_at: '2026-09-03T16:10:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b64189
- fact_id: FACT-20260903-a622e3
  text: Are the delivery contractors employees or independent contractors of the platform?
    — Independent contractors
  status: active
  material: true
  source_ids:
  - MSG-20260903-c588d6
  supersedes: null
  created_at: '2026-09-03T16:11:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3ab57f
- fact_id: FACT-20260903-8e8094
  text: Which states will screening and payouts cover at launch? — Unknown
  status: active
  material: true
  source_ids:
  - MSG-20260903-f9b44e
  supersedes: null
  created_at: '2026-09-03T16:11:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-443e9b
- fact_id: FACT-20260903-ccd1c6
  text: Who will own the adverse-action workflow — pre-adverse and adverse-action
    notices, and the dispute/reinvestigation process? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260903-e927d7
  supersedes: null
  created_at: '2026-09-03T16:12:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fa289f
- fact_id: FACT-20260903-c6834f
  text: Exact reports used and data sources — Unknown. Obtain the vendor API schema
    and documentation that identify each report, data source, retention period, match
    logic, sanctions lists, work-eligibility source, permissible purpose, and geographic
    coverage. Product should own the request; the platform and vendor must provide
    the documents before launch.
  status: active
  material: true
  source_ids:
  - MSG-20260903-9f2f1b
  supersedes: null
  created_at: '2026-09-03T16:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d7ce29
- fact_id: FACT-20260903-fc14df
  text: Dispute process and contractor reinvestigation rights — Not yet decided. Product
    must provide a contractor-facing dispute path, identify the screening vendor,
    deliver any required pre-adverse notice with the report summary and FCRA rights,
    allow a reasonable response period, pause any adverse action while a timely dispute
    is reinvestigated, and send the final notice with dispute and reporting-agency
    contact details. The platform should own the user-facing workflow unless the contract
    assigns it to Mosaic Relay; Vendor must reinvestigate and correct errors. Confirm
    owner, SLA, escalation, and state-specific timing before launch.
  status: active
  material: true
  source_ids:
  - MSG-20260903-77dbca
  supersedes: null
  created_at: '2026-09-03T16:13:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-28e2d8
- fact_id: FACT-20260903-eb38ce
  text: Is there any other fact that would materially change the advice? — Yes. Confirm
    the platform’s permissible purpose and role, whether Mosaic Relay receives full
    reports or only status codes, identity-data categories, retention and deletion,
    contractor geography, sanctions screening cadence, work-eligibility basis, accessibility
    and language support, human review, appeal SLA, and whether any score or automated
    rule affects payout. Product must define least-privilege access, audit logs, encryption,
    tenant isolation, incident response, and a launch kill switch. Legal must review
    the customer DPA, FCRA allocation and certifications, vendor flow-downs, confidentiality,
    security, deletion, audit, indemnity, insurance, regulatory cooperation, and no-use-of-data
    terms.
  status: active
  material: true
  source_ids:
  - MSG-20260903-71959d
  supersedes: null
  created_at: '2026-09-03T16:13:59+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-71bf9d
- fact_id: FACT-20260903-ca2d95
  text: The delivery contractors are independent contractors of the platform (not
    employees).
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- fact_id: FACT-20260903-c63199
  text: Whether Mosaic Relay receives full reports or only status codes — Require
    Mosaic Relay to receive only the minimum status code and decision metadata needed
    for payout operations. Do not expose full criminal, identity, or eligibility reports
    to Mosaic Relay unless a documented legal purpose and role require it. Keep the
    full report with the responsible party, use field-level access controls, segregate
    identifiers, log every access, and prohibit secondary use.
  status: active
  material: true
  source_ids:
  - MSG-20260903-ba677e
  supersedes: null
  created_at: '2026-09-03T16:14:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e8b4ff
- fact_id: FACT-20260903-463072
  text: State-specific adverse-action timing and dispute SLAs — Unknown until the
    launch-state list is fixed. Legal should require a state-by-state matrix for ban-the-box
    and fair-chance rules, notice delivery and waiting periods, permissible report
    contents, dispute and reinvestigation SLAs, language/accessibility, and any pay-to-screen
    restrictions. Product must block screening or payout where the required state
    configuration, notice, or response timer is missing.
  status: active
  material: true
  source_ids:
  - MSG-20260903-d92f97
  supersedes: null
  created_at: '2026-09-03T16:15:31+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ec77dd
- fact_id: FACT-20260903-0aa2e6
  text: Target launch is 2026-10-29 (eight weeks out).
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- fact_id: FACT-20260903-9779b1
  text: Mosaic Relay should receive only the minimum status code and decision metadata
    needed for payout operations, not full criminal, identity, or eligibility reports.
  status: active
  material: true
  source_ids:
  - REQ-20260903-9ae20a
  supersedes: null
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
sources:
- source_id: REQ-20260903-9ae20a
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-02-contractor-background-check-integration-e03847/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T16:08:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-90361e
- source_id: MSG-20260903-a791df
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:09:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6cd7e4
- source_id: MSG-20260903-14cf58
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:10:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2646ad
- source_id: MSG-20260903-c588d6
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:11:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7e25ba
- source_id: MSG-20260903-f9b44e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:11:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b7032c
- source_id: MSG-20260903-e927d7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:12:13+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6977aa
- source_id: MSG-20260903-9f2f1b
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:12:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6fc5af
- source_id: MSG-20260903-77dbca
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:13:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-43e821
- source_id: MSG-20260903-71959d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:13:59+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-925af3
- source_id: MSG-20260903-ba677e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:14:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-5b4ec9
- source_id: MSG-20260903-d92f97
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:15:31+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b507fc
support:
- support_id: SUP-20260903-668a2a
  fact_id: FACT-20260903-0599b7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: A software platform wants to use Mosaic Relay to pay contractors.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-99cefe
  fact_id: FACT-20260903-d04cc7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform proposes adding a background-check vendor to screen contractors
    for identity, criminal history, sanctions, and work eligibility before the first
    payout.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-9163ab
  fact_id: FACT-20260903-588fd6
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform would receive a 'clear', 'review', or 'fail' result from
    the screening.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-bd7bc9
  fact_id: FACT-20260903-ac3a12
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Mosaic Relay would process identity data and payout instructions.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-521b5a
  fact_id: FACT-20260903-7789b8
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Actors are Product, the platform, the screening vendor, and contractors.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-ebd8e9
  fact_id: FACT-20260903-2c9ab5
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Target launch is eight weeks away (2026-10-29).
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-74f837
  fact_id: FACT-20260903-c5a349
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The vendor's API and stated coverage in the United States are known.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-f45ea6
  fact_id: FACT-20260903-a65675
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The initial use case involves delivery contractors.
  location: ''
  created_at: '2026-09-03T16:09:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- support_id: SUP-20260903-2d8aba
  fact_id: FACT-20260903-0599b7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: A software platform wants to use Mosaic Relay to pay contractors.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-44a4ce
  fact_id: FACT-20260903-d04cc7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform proposes adding a background-check vendor to screen contractors
    for identity, criminal history, sanctions, and work eligibility before the first
    payout.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-d41eea
  fact_id: FACT-20260903-588fd6
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform would receive a 'clear', 'review', or 'fail' result from
    the screening.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-3cfe92
  fact_id: FACT-20260903-ac3a12
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Mosaic Relay would process identity data and payout instructions.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-dd1dd5
  fact_id: FACT-20260903-7789b8
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Actors are Product, the platform, the screening vendor, and contractors.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-ff2161
  fact_id: FACT-20260903-2c9ab5
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Target launch is eight weeks away (2026-10-29).
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-876f46
  fact_id: FACT-20260903-c5a349
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The vendor's API and stated coverage in the United States are known.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-d54771
  fact_id: FACT-20260903-a65675
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The initial use case involves delivery contractors.
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-3bfc65
  fact_id: FACT-20260903-ca2d95
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The delivery contractors are independent contractors of the platform
    (not employees).
  location: ''
  created_at: '2026-09-03T16:14:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- support_id: SUP-20260903-13c31b
  fact_id: FACT-20260903-0599b7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: A software platform wants to use Mosaic Relay to pay contractors.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-bea833
  fact_id: FACT-20260903-d04cc7
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform proposes adding a background-check vendor to screen contractors
    for identity, criminal history, sanctions, and work eligibility before the first
    payout.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-4c7086
  fact_id: FACT-20260903-588fd6
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The platform would receive a 'clear', 'review', or 'fail' result from
    the screening.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-ac8b97
  fact_id: FACT-20260903-ac3a12
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Mosaic Relay would process identity data and payout instructions.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-50e2da
  fact_id: FACT-20260903-0aa2e6
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Target launch is 2026-10-29 (eight weeks out).
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-64f1db
  fact_id: FACT-20260903-a65675
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The initial use case involves delivery contractors.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-713a20
  fact_id: FACT-20260903-ca2d95
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: The delivery contractors are independent contractors of the platform
    (not employees).
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- support_id: SUP-20260903-676889
  fact_id: FACT-20260903-9779b1
  source_id: REQ-20260903-9ae20a
  relationship: support
  statement: Mosaic Relay should receive only the minimum status code and decision
    metadata needed for payout operations, not full criminal, identity, or eligibility
    reports.
  location: ''
  created_at: '2026-09-03T16:16:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-394a77
assumptions:
- assumption_id: ASM-20260903-6036b0
  text: The background-check reports are consumer reports under FCRA and the vendor
    is a consumer reporting agency (to be confirmed)
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:09:12+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- assumption_id: ASM-20260903-2e6928
  text: Contractors are independent contractors, not employees, of the platform (to
    be confirmed)
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:09:12+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- assumption_id: ASM-20260903-e03789
  text: The screening is used for an employment/engagement decision, triggering adverse-action
    obligations
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:09:12+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- assumption_id: ASM-20260903-5967ba
  text: Mosaic Relay's role is limited to processing identity data and payout instructions,
    not making the screening decision
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:09:12+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6156bd
- assumption_id: ASM-20260903-5d889a
  text: The background-check reports are consumer reports under FCRA and the vendor
    is a consumer reporting agency (to be confirmed with vendor)
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:11:18+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-985ab4
- assumption_id: ASM-20260903-8bb4dd
  text: The screening is used for an engagement decision, triggering adverse-action
    obligations
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:11:18+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-985ab4
- assumption_id: ASM-20260903-d254a2
  text: Mosaic Relay is a technology/payments-infrastructure provider, not a bank,
    and does not hold deposits or operate as a money transmitter itself
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:14:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- assumption_id: ASM-20260903-11ed04
  text: The platform is the party making the hiring/engagement decision about contractors
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:14:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-2a3e55
- assumption_id: ASM-20260903-49a402
  text: The screening reports are likely 'consumer reports' under FCRA and the vendor
    a CRA, but this must be confirmed with the vendor.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:08+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-e0e306
- assumption_id: ASM-20260903-1d06d7
  text: Mosaic Relay is a technology/payments-infrastructure provider, not a bank,
    and does not hold deposits.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:08+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-e0e306
- assumption_id: ASM-20260903-4355c6
  text: The platform is the party with a permissible purpose to obtain consumer reports
    for employment/contractor screening.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:08+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-e0e306
- assumption_id: ASM-20260903-0c7cee
  text: State coverage is unknown, so state-specific ban-the-box, pay-to-screen, and
    adverse-action timing cannot yet be pinned down.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:08+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-e0e306
- assumption_id: ASM-20260903-3616a5
  text: The screening reports are consumer reports under FCRA and the vendor is a
    consumer reporting agency (CRA) — to be confirmed with the vendor.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:51+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6306ab
- assumption_id: ASM-20260903-ef49a5
  text: Mosaic Relay is a technology and payments-infrastructure provider, not a bank,
    and does not hold deposits.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:51+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6306ab
- assumption_id: ASM-20260903-7f3174
  text: The platform is the party that contracts with contractors and makes the engagement
    decision.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:15:51+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-6306ab
- assumption_id: ASM-20260903-c069fc
  text: The background-check reports are consumer reports under FCRA and the vendor
    is a CRA (to be confirmed with vendor).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:16:16+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-394a77
- assumption_id: ASM-20260903-b1e563
  text: The screening is used for an engagement decision, triggering adverse-action
    obligations.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:16:16+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-394a77
conflicts: []
actions:
- action_id: ACT-20260903-90361e
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T16:08:55+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-9ae20a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-6156bd
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:09:12+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0599b7
    - FACT-20260903-d04cc7
    - FACT-20260903-588fd6
    - FACT-20260903-ac3a12
    - FACT-20260903-7789b8
    - FACT-20260903-2c9ab5
    - FACT-20260903-c5a349
    - FACT-20260903-a65675
    sources: []
    support:
    - SUP-20260903-668a2a
    - SUP-20260903-99cefe
    - SUP-20260903-9163ab
    - SUP-20260903-bd7bc9
    - SUP-20260903-521b5a
    - SUP-20260903-ebd8e9
    - SUP-20260903-74f837
    - SUP-20260903-f45ea6
    assumptions:
    - ASM-20260903-6036b0
    - ASM-20260903-2e6928
    - ASM-20260903-e03789
    - ASM-20260903-5967ba
  source_action_key: chat:RUN-20260903-2365b3:tool:7007834f7296ba1229229283
- action_id: ACT-20260903-6cd7e4
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:09:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a791df
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f8d50f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:09:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-08d5dd
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-22bdac:answers
- action_id: ACT-20260903-9c7061
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:10:07+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-22bdac:tool:60e59a64d7b000b951da66f7
- action_id: ACT-20260903-2646ad
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:10:38+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-14cf58
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-b64189
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:10:38+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-19a96d
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-657314:answers
- action_id: ACT-20260903-f6d10e
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:10:48+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-657314:tool:670a42b42abc562ac738fabf
- action_id: ACT-20260903-7e25ba
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:11:10+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-c588d6
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-3ab57f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:11:10+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-a622e3
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-169ad4:answers
- action_id: ACT-20260903-985ab4
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:11:18+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-5d889a
    - ASM-20260903-8bb4dd
  source_action_key: chat:RUN-20260903-169ad4:tool:eefc74fdc8a3b15c8953e04a
- action_id: ACT-20260903-b7032c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:11:42+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-f9b44e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-443e9b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:11:42+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-8e8094
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-04369b:answers
- action_id: ACT-20260903-ef5b6a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:11:51+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-04369b:tool:1c4b7641325b0389ab72994c
- action_id: ACT-20260903-6977aa
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:12:13+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-e927d7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-fa289f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:12:13+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-ccd1c6
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-687ff0:answers
- action_id: ACT-20260903-6fc5af
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:12:46+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9f2f1b
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d7ce29
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:12:46+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-c6834f
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-4d123a:answers
- action_id: ACT-20260903-43e821
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:13:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-77dbca
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-28e2d8
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:13:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-fc14df
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c0770f:answers
- action_id: ACT-20260903-925af3
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:13:59+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-71959d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-71bf9d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:13:59+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-eb38ce
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-87b45b:answers
- action_id: ACT-20260903-2a3e55
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:14:34+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-ca2d95
    sources: []
    support:
    - SUP-20260903-2d8aba
    - SUP-20260903-44a4ce
    - SUP-20260903-d41eea
    - SUP-20260903-3cfe92
    - SUP-20260903-dd1dd5
    - SUP-20260903-ff2161
    - SUP-20260903-876f46
    - SUP-20260903-d54771
    - SUP-20260903-3bfc65
    assumptions:
    - ASM-20260903-d254a2
    - ASM-20260903-11ed04
  source_action_key: chat:RUN-20260903-74b071:tool:5682869768132a2fda7b0fe5
- action_id: ACT-20260903-5b4ec9
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:14:54+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ba677e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e8b4ff
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:14:54+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-c63199
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-17d172:answers
- action_id: ACT-20260903-e0e306
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:15:08+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-49a402
    - ASM-20260903-1d06d7
    - ASM-20260903-4355c6
    - ASM-20260903-0c7cee
  source_action_key: chat:RUN-20260903-17d172:tool:bbe749074cdec7e2f21d2f6b
- action_id: ACT-20260903-b507fc
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:15:31+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-d92f97
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-ec77dd
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:15:31+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-463072
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-54b49a:answers
- action_id: ACT-20260903-6306ab
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:15:51+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-3616a5
    - ASM-20260903-ef49a5
    - ASM-20260903-7f3174
  source_action_key: chat:RUN-20260903-54b49a:tool:95c4ac9862bdf0502f7c23d2
- action_id: ACT-20260903-394a77
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:16:16+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0aa2e6
    - FACT-20260903-9779b1
    sources: []
    support:
    - SUP-20260903-13c31b
    - SUP-20260903-bea833
    - SUP-20260903-4c7086
    - SUP-20260903-ac8b97
    - SUP-20260903-50e2da
    - SUP-20260903-64f1db
    - SUP-20260903-713a20
    - SUP-20260903-676889
    assumptions:
    - ASM-20260903-c069fc
    - ASM-20260903-b1e563
  source_action_key: chat:RUN-20260903-7b15cf:tool:f15b3c5f436abea008df7766
working_ask: A software platform wants to use Mosaic Relay to pay contractors. The
  platform proposes adding a background-check vendor to screen contractors for identity,
  criminal history, sanctions, and work eligibility before the first payout. The platform
  would receive a 'clear', 'review', or 'fail' result, while Mosaic Relay would process
  identity data and payout instructions. Target launch is 2026-10-29 (eight weeks
  out). Map the privacy, consumer-reporting (FCRA), employment, discrimination, and
  payments risks, and specify the exact product behavior, consent language, notices,
  dispute rights, access controls, and customer contract terms legal should require.
issues:
- FCRA consumer-reporting characterization and who is the 'user' of the consumer report
- Adverse-action notice obligations (pre-adverse and adverse-action) and who provides
  them
- State background-check, ban-the-box, and pay-to-screen laws
- Disparate-impact discrimination risk from criminal-history screening
- Privacy and data-minimization for identity data collection and processing
- Money-transmission characterization and which party is the regulated actor
- Contractor dispute and reinvestigation rights
open_questions:
- Whether the reports are consumer reports under FCRA and the vendor is a CRA (confirm
  with vendor)
public_research_questions:
- FCRA adverse-action notice requirements for consumer-report users
- State ban-the-box and fair-chance hiring laws applicable to independent-contractor
  screening
- EEOC disparate-impact guidance on criminal-history screening
intake_answers:
- answer_id: ANS-20260903-bc443f
  question_id: decision_maker
  question: Who makes the final decision when a contractor receives a 'review' or
    'fail' screening result?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-a791df
  source_action_key: chat:RUN-20260903-22bdac
  answered_at: '2026-09-03T16:09:57+00:00'
  answer_fact_id: FACT-20260903-08d5dd
- answer_id: ANS-20260903-7373c5
  question_id: fcra_characterization
  question: Are the background-check reports 'consumer reports' under FCRA, and is
    the screening vendor a consumer reporting agency (CRA)?
  answer: Unknown — need to confirm with vendor
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-14cf58
  source_action_key: chat:RUN-20260903-657314
  answered_at: '2026-09-03T16:10:38+00:00'
  answer_fact_id: FACT-20260903-19a96d
- answer_id: ANS-20260903-4b7b66
  question_id: contractor_classification
  question: Are the delivery contractors employees or independent contractors of the
    platform?
  answer: Independent contractors
  values:
  - independent_contractors
  status: answered
  record_target: fact
  source_id: MSG-20260903-c588d6
  source_action_key: chat:RUN-20260903-169ad4
  answered_at: '2026-09-03T16:11:10+00:00'
  answer_fact_id: FACT-20260903-a622e3
- answer_id: ANS-20260903-59ae6f
  question_id: state_coverage
  question: Which states will screening and payouts cover at launch?
  answer: Unknown
  values:
  - unknown
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-f9b44e
  source_action_key: chat:RUN-20260903-04369b
  answered_at: '2026-09-03T16:11:42+00:00'
  answer_fact_id: FACT-20260903-8e8094
- answer_id: ANS-20260903-451896
  question_id: adverse_action_owner
  question: Who will own the adverse-action workflow — pre-adverse and adverse-action
    notices, and the dispute/reinvestigation process?
  answer: Not yet decided
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-e927d7
  source_action_key: chat:RUN-20260903-687ff0
  answered_at: '2026-09-03T16:12:13+00:00'
  answer_fact_id: FACT-20260903-ccd1c6
- answer_id: ANS-20260903-767c37
  question_id: intake-recovery-missing-fact-e0e71b963f
  question: Exact reports used and data sources
  answer: Unknown. Obtain the vendor API schema and documentation that identify each
    report, data source, retention period, match logic, sanctions lists, work-eligibility
    source, permissible purpose, and geographic coverage. Product should own the request;
    the platform and vendor must provide the documents before launch.
  values:
  - Unknown. Obtain the vendor API schema and documentation that identify each report,
    data source, retention period, match logic, sanctions lists, work-eligibility
    source, permissible purpose, and geographic coverage. Product should own the request;
    the platform and vendor must provide the documents before launch.
  status: answered
  record_target: fact
  source_id: MSG-20260903-9f2f1b
  source_action_key: chat:RUN-20260903-4d123a
  answered_at: '2026-09-03T16:12:46+00:00'
  answer_fact_id: FACT-20260903-c6834f
- answer_id: ANS-20260903-4b2a85
  question_id: intake-recovery-missing-fact-a838382f88
  question: Dispute process and contractor reinvestigation rights
  answer: Not yet decided. Product must provide a contractor-facing dispute path,
    identify the screening vendor, deliver any required pre-adverse notice with the
    report summary and FCRA rights, allow a reasonable response period, pause any
    adverse action while a timely dispute is reinvestigated, and send the final notice
    with dispute and reporting-agency contact details. The platform should own the
    user-facing workflow unless the contract assigns it to Mosaic Relay; Vendor must
    reinvestigate and correct errors. Confirm owner, SLA, escalation, and state-specific
    timing before launch.
  values:
  - Not yet decided. Product must provide a contractor-facing dispute path, identify
    the screening vendor, deliver any required pre-adverse notice with the report
    summary and FCRA rights, allow a reasonable response period, pause any adverse
    action while a timely dispute is reinvestigated, and send the final notice with
    dispute and reporting-agency contact details. The platform should own the user-facing
    workflow unless the contract assigns it to Mosaic Relay; Vendor must reinvestigate
    and correct errors. Confirm owner, SLA, escalation, and state-specific timing
    before launch.
  status: answered
  record_target: fact
  source_id: MSG-20260903-77dbca
  source_action_key: chat:RUN-20260903-c0770f
  answered_at: '2026-09-03T16:13:21+00:00'
  answer_fact_id: FACT-20260903-fc14df
- answer_id: ANS-20260903-1ce898
  question_id: intake-recovery-finish
  question: Is there any other fact that would materially change the advice?
  answer: Yes. Confirm the platform’s permissible purpose and role, whether Mosaic
    Relay receives full reports or only status codes, identity-data categories, retention
    and deletion, contractor geography, sanctions screening cadence, work-eligibility
    basis, accessibility and language support, human review, appeal SLA, and whether
    any score or automated rule affects payout. Product must define least-privilege
    access, audit logs, encryption, tenant isolation, incident response, and a launch
    kill switch. Legal must review the customer DPA, FCRA allocation and certifications,
    vendor flow-downs, confidentiality, security, deletion, audit, indemnity, insurance,
    regulatory cooperation, and no-use-of-data terms.
  values:
  - Yes. Confirm the platform’s permissible purpose and role, whether Mosaic Relay
    receives full reports or only status codes, identity-data categories, retention
    and deletion, contractor geography, sanctions screening cadence, work-eligibility
    basis, accessibility and language support, human review, appeal SLA, and whether
    any score or automated rule affects payout. Product must define least-privilege
    access, audit logs, encryption, tenant isolation, incident response, and a launch
    kill switch. Legal must review the customer DPA, FCRA allocation and certifications,
    vendor flow-downs, confidentiality, security, deletion, audit, indemnity, insurance,
    regulatory cooperation, and no-use-of-data terms.
  status: answered
  record_target: fact
  source_id: MSG-20260903-71959d
  source_action_key: chat:RUN-20260903-87b45b
  answered_at: '2026-09-03T16:13:59+00:00'
  answer_fact_id: FACT-20260903-eb38ce
- answer_id: ANS-20260903-dfb150
  question_id: intake-recovery-missing-fact-2473f336f5
  question: Whether Mosaic Relay receives full reports or only status codes
  answer: Require Mosaic Relay to receive only the minimum status code and decision
    metadata needed for payout operations. Do not expose full criminal, identity,
    or eligibility reports to Mosaic Relay unless a documented legal purpose and role
    require it. Keep the full report with the responsible party, use field-level access
    controls, segregate identifiers, log every access, and prohibit secondary use.
  values:
  - Require Mosaic Relay to receive only the minimum status code and decision metadata
    needed for payout operations. Do not expose full criminal, identity, or eligibility
    reports to Mosaic Relay unless a documented legal purpose and role require it.
    Keep the full report with the responsible party, use field-level access controls,
    segregate identifiers, log every access, and prohibit secondary use.
  status: answered
  record_target: fact
  source_id: MSG-20260903-ba677e
  source_action_key: chat:RUN-20260903-17d172
  answered_at: '2026-09-03T16:14:54+00:00'
  answer_fact_id: FACT-20260903-c63199
- answer_id: ANS-20260903-0bce7f
  question_id: intake-recovery-missing-fact-abd1d1534b
  question: State-specific adverse-action timing and dispute SLAs
  answer: Unknown until the launch-state list is fixed. Legal should require a state-by-state
    matrix for ban-the-box and fair-chance rules, notice delivery and waiting periods,
    permissible report contents, dispute and reinvestigation SLAs, language/accessibility,
    and any pay-to-screen restrictions. Product must block screening or payout where
    the required state configuration, notice, or response timer is missing.
  values:
  - Unknown until the launch-state list is fixed. Legal should require a state-by-state
    matrix for ban-the-box and fair-chance rules, notice delivery and waiting periods,
    permissible report contents, dispute and reinvestigation SLAs, language/accessibility,
    and any pay-to-screen restrictions. Product must block screening or payout where
    the required state configuration, notice, or response timer is missing.
  status: answered
  record_target: fact
  source_id: MSG-20260903-d92f97
  source_action_key: chat:RUN-20260903-54b49a
  answered_at: '2026-09-03T16:15:31+00:00'
  answer_fact_id: FACT-20260903-463072
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - A software platform wants to use Mosaic Relay to pay contractors.

      - The platform proposes adding a background-check vendor to screen contractors
      for identity, criminal history, sanctions, and work eligibility before the first
      payout.

      - The platform would receive a ''clear'', ''review'', or ''fail'' result from
      the screening.

      - Mosaic Relay would process identity data and payout instructions.

      - Actors are Product, the platform, the screening vendor, and contractors.

      - Target launch is eight weeks away (2026-10-29).

      - The vendor''s API and stated coverage in the United States are known.

      - The initial use case involves delivery contractors.

      - Who makes the final decision when a contractor receives a ''review'' or ''fail''
      screening result? — Not yet decided

      - Are the background-check reports ''consumer reports'' under FCRA, and is the
      screening vendor a consumer reporting agency (CRA)? — Unknown — need to confirm
      with vendor

      - Are the delivery contractors employees or independent contractors of the platform?
      — Independent contractors

      - Which states will screening and payouts cover at launch? — Unknown

      - Who will own the adverse-action workflow — pre-adverse and adverse-action
      notices, and the dispute/reinvestigation process? — Not yet decided

      - Exact reports used and data sources — Unknown. Obtain the vendor API schema
      and documentation that identify each report, data source, retention period,
      match logic, sanctions lists, work-eligibility source, permissible purpose,
      and geographic coverage. Product should own the request; the platform and vendor
      must provide the documents before launch.

      - Dispute process and contractor reinvestigation rights — Not yet decided. Product
      must provide a contractor-facing dispute path, identify the screening vendor,
      deliver any required pre-adverse notice with the report summary and FCRA rights,
      allow a reasonable response period, pause any adverse action while a timely
      dispute is reinvestigated, and send the final notice with dispute and reporting-agency
      contact details. The platform should own the user-facing workflow unless the
      contract assigns it to Mosaic Relay; Vendor must reinvestigate and correct errors.
      Confirm owner, SLA, escalation, and state-specific timing before launch.

      - Is there any other fact that would materially change the advice? — Yes. Confirm
      the platform’s permissible purpose and role, whether Mosaic Relay receives full
      reports or only status codes, identity-data categories, retention and deletion,
      contractor geography, sanctions screening cadence, work-eligibility basis, accessibility
      and language support, human review, appeal SLA, and whether any score or automated
      rule affects payout. Product must define least-privilege access, audit logs,
      encryption, tenant isolation, incident response, and a launch kill switch. Legal
      must review the customer DPA, FCRA allocation and certifications, vendor flow-downs,
      confidentiality, security, deletion, audit, indemnity, insurance, regulatory
      cooperation, and no-use-of-data terms.

      - The delivery contractors are independent contractors of the platform (not
      employees).

      - Whether Mosaic Relay receives full reports or only status codes — Require
      Mosaic Relay to receive only the minimum status code and decision metadata needed
      for payout operations. Do not expose full criminal, identity, or eligibility
      reports to Mosaic Relay unless a documented legal purpose and role require it.
      Keep the full report with the responsible party, use field-level access controls,
      segregate identifiers, log every access, and prohibit secondary use.

      - State-specific adverse-action timing and dispute SLAs — Unknown until the
      launch-state list is fixed. Legal should require a state-by-state matrix for
      ban-the-box and fair-chance rules, notice delivery and waiting periods, permissible
      report contents, dispute and reinvestigation SLAs, language/accessibility, and
      any pay-to-screen restrictions. Product must block screening or payout where
      the required state configuration, notice, or response timer is missing.

      - Target launch is 2026-10-29 (eight weeks out).

      - Mosaic Relay should receive only the minimum status code and decision metadata
      needed for payout operations, not full criminal, identity, or eligibility reports.


      ## Assumptions


      - [Assumption] The background-check reports are consumer reports under FCRA
      and the vendor is a consumer reporting agency (to be confirmed)

      - [Assumption] Contractors are independent contractors, not employees, of the
      platform (to be confirmed)

      - [Assumption] The screening is used for an employment/engagement decision,
      triggering adverse-action obligations

      - [Assumption] Mosaic Relay''s role is limited to processing identity data and
      payout instructions, not making the screening decision

      - [Assumption] The background-check reports are consumer reports under FCRA
      and the vendor is a consumer reporting agency (to be confirmed with vendor)

      - [Assumption] The screening is used for an engagement decision, triggering
      adverse-action obligations

      - [Assumption] Mosaic Relay is a technology/payments-infrastructure provider,
      not a bank, and does not hold deposits or operate as a money transmitter itself

      - [Assumption] The platform is the party making the hiring/engagement decision
      about contractors

      - [Assumption] The screening reports are likely ''consumer reports'' under FCRA
      and the vendor a CRA, but this must be confirmed with the vendor.

      - [Assumption] Mosaic Relay is a technology/payments-infrastructure provider,
      not a bank, and does not hold deposits.

      - [Assumption] The platform is the party with a permissible purpose to obtain
      consumer reports for employment/contractor screening.

      - [Assumption] State coverage is unknown, so state-specific ban-the-box, pay-to-screen,
      and adverse-action timing cannot yet be pinned down.

      - [Assumption] The screening reports are consumer reports under FCRA and the
      vendor is a consumer reporting agency (CRA) — to be confirmed with the vendor.

      - [Assumption] Mosaic Relay is a technology and payments-infrastructure provider,
      not a bank, and does not hold deposits.

      - [Assumption] The platform is the party that contracts with contractors and
      makes the engagement decision.

      - [Assumption] The background-check reports are consumer reports under FCRA
      and the vendor is a CRA (to be confirmed with vendor).

      - [Assumption] The screening is used for an engagement decision, triggering
      adverse-action obligations.

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

- A software platform wants to use Mosaic Relay to pay contractors.
- The platform proposes adding a background-check vendor to screen contractors for identity, criminal history, sanctions, and work eligibility before the first payout.
- The platform would receive a 'clear', 'review', or 'fail' result from the screening.
- Mosaic Relay would process identity data and payout instructions.
- Actors are Product, the platform, the screening vendor, and contractors.
- Target launch is eight weeks away (2026-10-29).
- The vendor's API and stated coverage in the United States are known.
- The initial use case involves delivery contractors.
- Who makes the final decision when a contractor receives a 'review' or 'fail' screening result? — Not yet decided
- Are the background-check reports 'consumer reports' under FCRA, and is the screening vendor a consumer reporting agency (CRA)? — Unknown — need to confirm with vendor
- Are the delivery contractors employees or independent contractors of the platform? — Independent contractors
- Which states will screening and payouts cover at launch? — Unknown
- Who will own the adverse-action workflow — pre-adverse and adverse-action notices, and the dispute/reinvestigation process? — Not yet decided
- Exact reports used and data sources — Unknown. Obtain the vendor API schema and documentation that identify each report, data source, retention period, match logic, sanctions lists, work-eligibility source, permissible purpose, and geographic coverage. Product should own the request; the platform and vendor must provide the documents before launch.
- Dispute process and contractor reinvestigation rights — Not yet decided. Product must provide a contractor-facing dispute path, identify the screening vendor, deliver any required pre-adverse notice with the report summary and FCRA rights, allow a reasonable response period, pause any adverse action while a timely dispute is reinvestigated, and send the final notice with dispute and reporting-agency contact details. The platform should own the user-facing workflow unless the contract assigns it to Mosaic Relay; Vendor must reinvestigate and correct errors. Confirm owner, SLA, escalation, and state-specific timing before launch.
- Is there any other fact that would materially change the advice? — Yes. Confirm the platform’s permissible purpose and role, whether Mosaic Relay receives full reports or only status codes, identity-data categories, retention and deletion, contractor geography, sanctions screening cadence, work-eligibility basis, accessibility and language support, human review, appeal SLA, and whether any score or automated rule affects payout. Product must define least-privilege access, audit logs, encryption, tenant isolation, incident response, and a launch kill switch. Legal must review the customer DPA, FCRA allocation and certifications, vendor flow-downs, confidentiality, security, deletion, audit, indemnity, insurance, regulatory cooperation, and no-use-of-data terms.
- The delivery contractors are independent contractors of the platform (not employees).
- Whether Mosaic Relay receives full reports or only status codes — Require Mosaic Relay to receive only the minimum status code and decision metadata needed for payout operations. Do not expose full criminal, identity, or eligibility reports to Mosaic Relay unless a documented legal purpose and role require it. Keep the full report with the responsible party, use field-level access controls, segregate identifiers, log every access, and prohibit secondary use.
- State-specific adverse-action timing and dispute SLAs — Unknown until the launch-state list is fixed. Legal should require a state-by-state matrix for ban-the-box and fair-chance rules, notice delivery and waiting periods, permissible report contents, dispute and reinvestigation SLAs, language/accessibility, and any pay-to-screen restrictions. Product must block screening or payout where the required state configuration, notice, or response timer is missing.
- Target launch is 2026-10-29 (eight weeks out).
- Mosaic Relay should receive only the minimum status code and decision metadata needed for payout operations, not full criminal, identity, or eligibility reports.

## Assumptions

- [Assumption] The background-check reports are consumer reports under FCRA and the vendor is a consumer reporting agency (to be confirmed)
- [Assumption] Contractors are independent contractors, not employees, of the platform (to be confirmed)
- [Assumption] The screening is used for an employment/engagement decision, triggering adverse-action obligations
- [Assumption] Mosaic Relay's role is limited to processing identity data and payout instructions, not making the screening decision
- [Assumption] The background-check reports are consumer reports under FCRA and the vendor is a consumer reporting agency (to be confirmed with vendor)
- [Assumption] The screening is used for an engagement decision, triggering adverse-action obligations
- [Assumption] Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not hold deposits or operate as a money transmitter itself
- [Assumption] The platform is the party making the hiring/engagement decision about contractors
- [Assumption] The screening reports are likely 'consumer reports' under FCRA and the vendor a CRA, but this must be confirmed with the vendor.
- [Assumption] Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not hold deposits.
- [Assumption] The platform is the party with a permissible purpose to obtain consumer reports for employment/contractor screening.
- [Assumption] State coverage is unknown, so state-specific ban-the-box, pay-to-screen, and adverse-action timing cannot yet be pinned down.
- [Assumption] The screening reports are consumer reports under FCRA and the vendor is a consumer reporting agency (CRA) — to be confirmed with the vendor.
- [Assumption] Mosaic Relay is a technology and payments-infrastructure provider, not a bank, and does not hold deposits.
- [Assumption] The platform is the party that contracts with contractors and makes the engagement decision.
- [Assumption] The background-check reports are consumer reports under FCRA and the vendor is a CRA (to be confirmed with vendor).
- [Assumption] The screening is used for an engagement decision, triggering adverse-action obligations.
