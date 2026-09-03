---
matter_id: MAT-20260902-0037d5
record_type: facts
facts:
- fact_id: FACT-20260902-5ec6f1
  text: Mosaic Relay wants to launch a self-service refund portal for card and ACH
    payments.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-2b2f2a
  text: A payer enters a transaction reference, verifies a phone number or email,
    selects a reason, and requests a refund.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-f7267a
  text: The system would automatically approve requests within 30 days for defined
    reasons and deny requests outside the window.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-c3adf4
  text: The merchant receives a notice when a request is made.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-e7c00f
  text: The portal would be available at all times, with funds returned to the original
    payment method when possible.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-7daf8a
  text: Mosaic Relay wants to lower support volume and give consumers faster outcomes.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-8177af
  text: Merchants remain responsible for their underlying goods or services.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-074103
  text: The portal would not resolve card-network disputes.
  status: active
  material: true
  source_ids:
  - REQ-20260902-340cfc
  supersedes: null
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- fact_id: FACT-20260902-a01068
  text: Is Mosaic Relay acting as the merchant's agent for these refunds (authorized
    to approve and execute on the merchant's behalf), or as an independent decision-maker?
    — Not yet decided — need legal input on which role to take
  status: active
  material: true
  source_ids:
  - MSG-20260902-47d38d
  supersedes: null
  created_at: '2026-09-02T15:32:14+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-745681
- fact_id: FACT-20260902-143aed
  text: 'Which jurisdictions and product types will the portal serve first? Refund
    and cancellation obligations vary materially by location and product type. — North
    America and Europe (full footprint): Digital goods/subscriptions: Physical goods:
    Services'
  status: active
  material: true
  source_ids:
  - MSG-20260902-bb4d22
  supersedes: null
  created_at: '2026-09-02T15:32:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-88e66c
- fact_id: FACT-20260902-53b1e5
  text: 'What is the target launch date for the refund portal? — Not set. Working
    assumption: a limited pilot in 60 days, subject to legal review and control testing.'
  status: active
  material: true
  source_ids:
  - MSG-20260902-aa11d2
  supersedes: null
  created_at: '2026-09-02T15:33:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-23afb6
- fact_id: FACT-20260902-3d0c82
  text: What authentication method is planned to verify a payer's identity before
    releasing funds? — Not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260902-bddf5d
  supersedes: null
  created_at: '2026-09-02T15:33:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1f6979
- fact_id: FACT-20260902-a3b42b
  text: 'When a request is denied, what escalation path and notice should the payer
    receive, and when must a denied request route to the merchant or another dispute
    process? — Working recommendation, pending jurisdiction-specific review: do not
    silently deny. For an in-window reason that fails eligibility or any out-of-window
    request, show the reason, transaction date/window, refund options, and a clear
    merchant-support route with a response target. Route to the merchant when goods/services,
    partial or recurring charges, merchant approval, or missing transaction data must
    be resolved. Route card-network dispute rights to the payer''s issuer/network
    process and ACH unauthorized or error claims to the bank/processor return process;
    the portal must not imply that a refund request replaces those rights. Preserve
    an appeal/review path and accessible notice in the payer''s language.'
  status: active
  material: true
  source_ids:
  - MSG-20260902-0a422c
  supersedes: null
  created_at: '2026-09-02T15:34:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-44c549
- fact_id: FACT-20260902-6f548c
  text: 'Which defined reasons will qualify for auto-approval within the 30-day window?
    This drives the eligibility and notice wording. — Not as described / defective:
    Did not receive goods/services: Cancellation / change of mind: Duplicate or incorrect
    charge'
  status: active
  material: true
  source_ids:
  - MSG-20260902-96c817
  supersedes: null
  created_at: '2026-09-02T15:34:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-e13311
- fact_id: FACT-20260902-e4dadb
  text: Will the portal support partial refunds and recurring payments? This changes
    the eligibility, timing, and routing analysis. — Full refunds only
  status: active
  material: true
  source_ids:
  - MSG-20260902-0d34d1
  supersedes: null
  created_at: '2026-09-02T15:35:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-5fe311
- fact_id: FACT-20260902-94f246
  text: 'What recordkeeping and audit-trail requirements should apply to the portal''s
    decisions and notices? — Working recommendation, subject to jurisdiction-specific
    confirmation: retain the request, transaction reference, payer verification method
    and result, eligibility inputs, reason selected, rule version, decision, timing,
    refund rail, merchant notice, delivery status, user-facing notice, fraud signals,
    overrides, and escalation outcome. Keep an immutable audit trail with timestamps
    and actor/service IDs; restrict access; preserve evidence for disputes and regulator
    requests; set a documented retention schedule by jurisdiction and legal hold process;
    delete or de-identify after expiry. Do not retain full payment credentials or
    unnecessary contact data.'
  status: active
  material: true
  source_ids:
  - MSG-20260902-0f25d6
  supersedes: null
  created_at: '2026-09-02T15:47:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3df14e
- fact_id: FACT-20260902-2d6417
  text: How should the portal interact with ACH unauthorized/error return processes?
    — Route ACH unauthorized/error claims to the bank/processor return process
  status: active
  material: true
  source_ids:
  - MSG-20260902-c9f8f9
  supersedes: null
  created_at: '2026-09-02T15:47:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-3f7c5b
- fact_id: FACT-20260902-72774e
  text: 'What accessible-language and accessibility standards must the portal notices
    meet across the footprint? — WCAG 2.1/2.2 AA accessibility: Notices in the payer''s
    language across supported markets: Plain-language, consumer-friendly wording'
  status: active
  material: true
  source_ids:
  - MSG-20260902-9783ca
  supersedes: null
  created_at: '2026-09-02T15:48:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1536f7
sources:
- source_id: REQ-20260902-340cfc
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-07-consumer-refund-portal-with-automated-el-0037d5/request.md
  version: ''
  location: ''
  created_at: '2026-09-02T15:31:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9ce69
- source_id: MSG-20260902-47d38d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:32:14+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-a9593d
- source_id: MSG-20260902-bb4d22
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:32:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-497872
- source_id: MSG-20260902-aa11d2
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:33:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-a68466
- source_id: MSG-20260902-bddf5d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:33:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-be4d6f
- source_id: MSG-20260902-0a422c
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:34:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-2ea006
- source_id: MSG-20260902-96c817
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:34:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-4f7fde
- source_id: MSG-20260902-0d34d1
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:35:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-0f7ce8
- source_id: MSG-20260902-0f25d6
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:47:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-67cfeb
- source_id: MSG-20260902-c9f8f9
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:47:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-606da7
- source_id: MSG-20260902-9783ca
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:48:54+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-5790c4
support:
- support_id: SUP-20260902-a7efb1
  fact_id: FACT-20260902-5ec6f1
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: Mosaic Relay wants to launch a self-service refund portal for card and
    ACH payments.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-151199
  fact_id: FACT-20260902-2b2f2a
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: A payer enters a transaction reference, verifies a phone number or email,
    selects a reason, and requests a refund.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-db08be
  fact_id: FACT-20260902-f7267a
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: The system would automatically approve requests within 30 days for defined
    reasons and deny requests outside the window.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-5e1481
  fact_id: FACT-20260902-c3adf4
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: The merchant receives a notice when a request is made.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-0ec3a5
  fact_id: FACT-20260902-e7c00f
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: The portal would be available at all times, with funds returned to the
    original payment method when possible.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-d472b8
  fact_id: FACT-20260902-7daf8a
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: Mosaic Relay wants to lower support volume and give consumers faster
    outcomes.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-c0bbf0
  fact_id: FACT-20260902-8177af
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: Merchants remain responsible for their underlying goods or services.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
- support_id: SUP-20260902-ee89f7
  fact_id: FACT-20260902-074103
  source_id: REQ-20260902-340cfc
  relationship: support
  statement: The portal would not resolve card-network disputes.
  location: ''
  created_at: '2026-09-02T15:31:50+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-946395
assumptions:
- assumption_id: ASM-20260902-81525e
  text: Mosaic Relay is not a bank and does not hold deposits; refunds are executed
    through regulated partners.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:31:50+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-946395
- assumption_id: ASM-20260902-2c6ac4
  text: The portal is intended to operate across North America and Europe (Mosaic
    Relay's footprint), subject to location-specific law.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:31:50+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-946395
- assumption_id: ASM-20260902-b1c1fb
  text: The portal operates across North America and Europe (full footprint), subject
    to location-specific law.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:32:50+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-427f81
- assumption_id: ASM-20260902-b447f0
  text: Target launch is a limited pilot in ~60 days, subject to legal review and
    control testing.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:33:18+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-81dc13
- assumption_id: ASM-20260902-84d666
  text: Escalation/denial path recommendation is pending jurisdiction-specific review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:34:23+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-8907d3
- assumption_id: ASM-20260902-b868d0
  text: The escalation/denial path follows the working recommendation pending jurisdiction-specific
    review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:35:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-fa0a74
- assumption_id: ASM-20260902-74e82f
  text: Limited pilot targeted in ~60 days, subject to legal review and control testing
    (no firm launch date set).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:47:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-7aae20
- assumption_id: ASM-20260902-47ac58
  text: Escalation/denial path and recordkeeping recommendations are working positions
    pending jurisdiction-specific confirmation.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:47:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-7aae20
- assumption_id: ASM-20260902-1abb6b
  text: Limited pilot in ~60 days, subject to legal review and control testing.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:48:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-5c0b32
- assumption_id: ASM-20260902-7c2e59
  text: Do not silently deny; provide reason, window, refund options, and a merchant-support
    route with a response target.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:48:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-5c0b32
- assumption_id: ASM-20260902-0947a3
  text: Route card-network disputes to the payer's issuer/network process and ACH
    unauthorized/error claims to the bank/processor return process; the portal must
    not imply a refund request replaces those rights.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:48:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-5c0b32
- assumption_id: ASM-20260902-054822
  text: Retain a defined immutable audit trail with documented retention by jurisdiction
    and no full payment credentials.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:48:10+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-5c0b32
- assumption_id: ASM-20260902-01a34c
  text: 'Working assumption: a limited pilot in 60 days, subject to legal review and
    control testing (no set launch date).'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:49:05+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-eb2f88
- assumption_id: ASM-20260902-577ca5
  text: Escalation and recordkeeping recommendations are working positions pending
    jurisdiction-specific confirmation.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:49:05+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-eb2f88
conflicts: []
actions:
- action_id: ACT-20260902-f9ce69
  summary: Linked Original request
  actor: system
  created_at: '2026-09-02T15:31:33+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260902-340cfc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-946395
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:31:50+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-5ec6f1
    - FACT-20260902-2b2f2a
    - FACT-20260902-f7267a
    - FACT-20260902-c3adf4
    - FACT-20260902-e7c00f
    - FACT-20260902-7daf8a
    - FACT-20260902-8177af
    - FACT-20260902-074103
    sources: []
    support:
    - SUP-20260902-a7efb1
    - SUP-20260902-151199
    - SUP-20260902-db08be
    - SUP-20260902-5e1481
    - SUP-20260902-0ec3a5
    - SUP-20260902-d472b8
    - SUP-20260902-c0bbf0
    - SUP-20260902-ee89f7
    assumptions:
    - ASM-20260902-81525e
    - ASM-20260902-2c6ac4
  source_action_key: chat:RUN-20260902-3d6453:tool:a3e5a8dce57116b5857ca99d
- action_id: ACT-20260902-a9593d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:32:14+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-47d38d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-745681
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:32:14+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-a01068
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-7e96c9:answers
- action_id: ACT-20260902-719ca9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:32:21+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-7e96c9:tool:d65969e91cd1de74ebfe18a8
- action_id: ACT-20260902-497872
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:32:42+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-bb4d22
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-88e66c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:32:42+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-143aed
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-501ccf:answers
- action_id: ACT-20260902-427f81
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:32:50+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-b1c1fb
  source_action_key: chat:RUN-20260902-501ccf:tool:70ac111483ae9eef263956d3
- action_id: ACT-20260902-a68466
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:33:09+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-aa11d2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-23afb6
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:33:09+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-53b1e5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-3a7bee:answers
- action_id: ACT-20260902-81dc13
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:33:18+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-b447f0
  source_action_key: chat:RUN-20260902-3a7bee:tool:d5c8533647faa8f5553b4a03
- action_id: ACT-20260902-be4d6f
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:33:39+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-bddf5d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-1f6979
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:33:39+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-3d0c82
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-a9f57c:answers
- action_id: ACT-20260902-56de23
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:33:48+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-a9f57c:tool:40566f3d56b6546523e115aa
- action_id: ACT-20260902-2ea006
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:34:10+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-0a422c
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-44c549
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:34:10+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-a3b42b
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-5d3760:answers
- action_id: ACT-20260902-8907d3
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:34:23+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-84d666
  source_action_key: chat:RUN-20260902-5d3760:tool:059c16929b4a54c539f2b167
- action_id: ACT-20260902-4f7fde
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:34:47+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-96c817
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-e13311
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:34:47+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-6f548c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-685459:answers
- action_id: ACT-20260902-bf5cd9
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:35:07+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-685459:tool:88ca5d929f28ff7674dede7b
- action_id: ACT-20260902-0f7ce8
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:35:23+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-0d34d1
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-5fe311
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:35:23+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-e4dadb
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-7fe5cd:answers
- action_id: ACT-20260902-fa0a74
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:35:36+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-b868d0
  source_action_key: chat:RUN-20260902-7fe5cd:tool:df698ff419ce59e162394e44
- action_id: ACT-20260902-67cfeb
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:47:12+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-0f25d6
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-3df14e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:47:12+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-94f246
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-908ae6:answers
- action_id: ACT-20260902-7aae20
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:47:26+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-74e82f
    - ASM-20260902-47ac58
  source_action_key: chat:RUN-20260902-908ae6:tool:c2c2461af4f8a423f2a2e068
- action_id: ACT-20260902-606da7
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:47:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-c9f8f9
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-3f7c5b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:47:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-2d6417
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-da498a:answers
- action_id: ACT-20260902-5c0b32
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:48:10+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-1abb6b
    - ASM-20260902-7c2e59
    - ASM-20260902-0947a3
    - ASM-20260902-054822
  source_action_key: chat:RUN-20260902-da498a:tool:7f619c8491aa778039fe2c83
- action_id: ACT-20260902-5790c4
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:48:54+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-9783ca
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-1536f7
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:48:54+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-72774e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-71e862:answers
- action_id: ACT-20260902-eb2f88
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:49:05+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-01a34c
    - ASM-20260902-577ca5
  source_action_key: chat:RUN-20260902-71e862:tool:f74fcf8471e1c449d3537b37
working_ask: Mosaic Relay wants to launch a self-service refund portal for card and
  ACH payments. A payer enters a transaction reference, verifies a phone number or
  email, selects a reason, and requests a refund. The system auto-approves requests
  within 30 days for defined reasons, denies requests outside the window, and sends
  the merchant a notice. Legal advice is requested on the portal's role, eligibility
  and notice wording, authentication and fraud controls, timing requirements, recordkeeping,
  and when a denied request must route to the merchant or another dispute process.
issues:
- Whether Mosaic Relay acts as the merchant's agent when it auto-approves and executes
  refunds, and the liability/authorization implications (undecided).
- Whether the 30-day auto-approve window and defined-reason eligibility comply with
  applicable refund and cancellation laws by product and location across North America
  and Europe.
- Authentication strength and fraud controls for verifying a payer's identity before
  releasing funds (method undecided).
- Treatment of ACH return rules and how the portal interacts with ACH unauthorized/error
  return processes.
- Accessible-language and notice requirements across the footprint.
- Escalation rights after denial and when a denied request must route to the merchant
  or another dispute process.
- Recordkeeping obligations for the portal's decisions and notices.
open_questions:
- Whether Mosaic Relay acts as the merchant's agent for auto-approving and executing
  refunds (undecided).
- Target launch date (not set).
public_research_questions:
- What refund and cancellation obligations apply by product type (digital goods/subscriptions,
  physical goods, services) across the North America and Europe footprint?
- What authentication and fraud-control standards are expected for releasing funds
  to a verified payer in a self-service refund context?
- What ACH return and card-network dispute rules govern routing of refund and unauthorized/error
  claims?
intake_answers:
- answer_id: ANS-20260902-a3e324
  question_id: agency_role
  question: Is Mosaic Relay acting as the merchant's agent for these refunds (authorized
    to approve and execute on the merchant's behalf), or as an independent decision-maker?
  answer: Not yet decided — need legal input on which role to take
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260902-47d38d
  source_action_key: chat:RUN-20260902-7e96c9
  answered_at: '2026-09-02T15:32:14+00:00'
  answer_fact_id: FACT-20260902-a01068
- answer_id: ANS-20260902-947140
  question_id: jurisdiction_scope
  question: Which jurisdictions and product types will the portal serve first? Refund
    and cancellation obligations vary materially by location and product type.
  answer: 'North America and Europe (full footprint): Digital goods/subscriptions:
    Physical goods: Services'
  values:
  - north_america_and_europe
  - digital_goods
  - physical_goods
  - services
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260902-bb4d22
  source_action_key: chat:RUN-20260902-501ccf
  answered_at: '2026-09-02T15:32:42+00:00'
  answer_fact_id: FACT-20260902-143aed
- answer_id: ANS-20260902-6a1864
  question_id: launch_date
  question: What is the target launch date for the refund portal?
  answer: 'Not set. Working assumption: a limited pilot in 60 days, subject to legal
    review and control testing.'
  values:
  - 'Not set. Working assumption: a limited pilot in 60 days, subject to legal review
    and control testing.'
  status: answered
  record_target: target_date
  source_id: MSG-20260902-aa11d2
  source_action_key: chat:RUN-20260902-3a7bee
  answered_at: '2026-09-02T15:33:09+00:00'
  answer_fact_id: FACT-20260902-53b1e5
- answer_id: ANS-20260902-831599
  question_id: auth_method
  question: What authentication method is planned to verify a payer's identity before
    releasing funds?
  answer: Not yet decided
  values:
  - not_decided
  status: answered
  record_target: fact
  source_id: MSG-20260902-bddf5d
  source_action_key: chat:RUN-20260902-a9f57c
  answered_at: '2026-09-02T15:33:39+00:00'
  answer_fact_id: FACT-20260902-3d0c82
- answer_id: ANS-20260902-0cea17
  question_id: escalation_denial
  question: When a request is denied, what escalation path and notice should the payer
    receive, and when must a denied request route to the merchant or another dispute
    process?
  answer: 'Working recommendation, pending jurisdiction-specific review: do not silently
    deny. For an in-window reason that fails eligibility or any out-of-window request,
    show the reason, transaction date/window, refund options, and a clear merchant-support
    route with a response target. Route to the merchant when goods/services, partial
    or recurring charges, merchant approval, or missing transaction data must be resolved.
    Route card-network dispute rights to the payer''s issuer/network process and ACH
    unauthorized or error claims to the bank/processor return process; the portal
    must not imply that a refund request replaces those rights. Preserve an appeal/review
    path and accessible notice in the payer''s language.'
  values:
  - 'Working recommendation, pending jurisdiction-specific review: do not silently
    deny. For an in-window reason that fails eligibility or any out-of-window request,
    show the reason, transaction date/window, refund options, and a clear merchant-support
    route with a response target. Route to the merchant when goods/services, partial
    or recurring charges, merchant approval, or missing transaction data must be resolved.
    Route card-network dispute rights to the payer''s issuer/network process and ACH
    unauthorized or error claims to the bank/processor return process; the portal
    must not imply that a refund request replaces those rights. Preserve an appeal/review
    path and accessible notice in the payer''s language.'
  status: answered
  record_target: fact
  source_id: MSG-20260902-0a422c
  source_action_key: chat:RUN-20260902-5d3760
  answered_at: '2026-09-02T15:34:10+00:00'
  answer_fact_id: FACT-20260902-a3b42b
- answer_id: ANS-20260902-e8315e
  question_id: refund_reasons
  question: Which defined reasons will qualify for auto-approval within the 30-day
    window? This drives the eligibility and notice wording.
  answer: 'Not as described / defective: Did not receive goods/services: Cancellation
    / change of mind: Duplicate or incorrect charge'
  values:
  - not_as_described
  - did_not_receive
  - cancellation
  - duplicate
  status: answered
  record_target: fact
  source_id: MSG-20260902-96c817
  source_action_key: chat:RUN-20260902-685459
  answered_at: '2026-09-02T15:34:47+00:00'
  answer_fact_id: FACT-20260902-6f548c
- answer_id: ANS-20260902-cb0719
  question_id: partial_recurring
  question: Will the portal support partial refunds and recurring payments? This changes
    the eligibility, timing, and routing analysis.
  answer: Full refunds only
  values:
  - full_refunds_only
  status: answered
  record_target: fact
  source_id: MSG-20260902-0d34d1
  source_action_key: chat:RUN-20260902-7fe5cd
  answered_at: '2026-09-02T15:35:23+00:00'
  answer_fact_id: FACT-20260902-e4dadb
- answer_id: ANS-20260902-e87ae4
  question_id: recordkeeping
  question: What recordkeeping and audit-trail requirements should apply to the portal's
    decisions and notices?
  answer: 'Working recommendation, subject to jurisdiction-specific confirmation:
    retain the request, transaction reference, payer verification method and result,
    eligibility inputs, reason selected, rule version, decision, timing, refund rail,
    merchant notice, delivery status, user-facing notice, fraud signals, overrides,
    and escalation outcome. Keep an immutable audit trail with timestamps and actor/service
    IDs; restrict access; preserve evidence for disputes and regulator requests; set
    a documented retention schedule by jurisdiction and legal hold process; delete
    or de-identify after expiry. Do not retain full payment credentials or unnecessary
    contact data.'
  values:
  - 'Working recommendation, subject to jurisdiction-specific confirmation: retain
    the request, transaction reference, payer verification method and result, eligibility
    inputs, reason selected, rule version, decision, timing, refund rail, merchant
    notice, delivery status, user-facing notice, fraud signals, overrides, and escalation
    outcome. Keep an immutable audit trail with timestamps and actor/service IDs;
    restrict access; preserve evidence for disputes and regulator requests; set a
    documented retention schedule by jurisdiction and legal hold process; delete or
    de-identify after expiry. Do not retain full payment credentials or unnecessary
    contact data.'
  status: answered
  record_target: fact
  source_id: MSG-20260902-0f25d6
  source_action_key: chat:RUN-20260902-908ae6
  answered_at: '2026-09-02T15:47:12+00:00'
  answer_fact_id: FACT-20260902-94f246
- answer_id: ANS-20260902-4df3b2
  question_id: ach_return_rules
  question: How should the portal interact with ACH unauthorized/error return processes?
  answer: Route ACH unauthorized/error claims to the bank/processor return process
  values:
  - route_to_bank
  status: answered
  record_target: fact
  source_id: MSG-20260902-c9f8f9
  source_action_key: chat:RUN-20260902-da498a
  answered_at: '2026-09-02T15:47:57+00:00'
  answer_fact_id: FACT-20260902-2d6417
- answer_id: ANS-20260902-f2d4c5
  question_id: accessible_language
  question: What accessible-language and accessibility standards must the portal notices
    meet across the footprint?
  answer: 'WCAG 2.1/2.2 AA accessibility: Notices in the payer''s language across
    supported markets: Plain-language, consumer-friendly wording'
  values:
  - wcag_aa
  - multi_language
  - plain_language
  status: answered
  record_target: fact
  source_id: MSG-20260902-9783ca
  source_action_key: chat:RUN-20260902-71e862
  answered_at: '2026-09-02T15:48:54+00:00'
  answer_fact_id: FACT-20260902-72774e
intake_state: complete
---
# Known Facts

- Mosaic Relay wants to launch a self-service refund portal for card and ACH payments.
- A payer enters a transaction reference, verifies a phone number or email, selects a reason, and requests a refund.
- The system would automatically approve requests within 30 days for defined reasons and deny requests outside the window.
- The merchant receives a notice when a request is made.
- The portal would be available at all times, with funds returned to the original payment method when possible.
- Mosaic Relay wants to lower support volume and give consumers faster outcomes.
- Merchants remain responsible for their underlying goods or services.
- The portal would not resolve card-network disputes.
- Is Mosaic Relay acting as the merchant's agent for these refunds (authorized to approve and execute on the merchant's behalf), or as an independent decision-maker? — Not yet decided — need legal input on which role to take
- Which jurisdictions and product types will the portal serve first? Refund and cancellation obligations vary materially by location and product type. — North America and Europe (full footprint): Digital goods/subscriptions: Physical goods: Services
- What is the target launch date for the refund portal? — Not set. Working assumption: a limited pilot in 60 days, subject to legal review and control testing.
- What authentication method is planned to verify a payer's identity before releasing funds? — Not yet decided
- When a request is denied, what escalation path and notice should the payer receive, and when must a denied request route to the merchant or another dispute process? — Working recommendation, pending jurisdiction-specific review: do not silently deny. For an in-window reason that fails eligibility or any out-of-window request, show the reason, transaction date/window, refund options, and a clear merchant-support route with a response target. Route to the merchant when goods/services, partial or recurring charges, merchant approval, or missing transaction data must be resolved. Route card-network dispute rights to the payer's issuer/network process and ACH unauthorized or error claims to the bank/processor return process; the portal must not imply that a refund request replaces those rights. Preserve an appeal/review path and accessible notice in the payer's language.
- Which defined reasons will qualify for auto-approval within the 30-day window? This drives the eligibility and notice wording. — Not as described / defective: Did not receive goods/services: Cancellation / change of mind: Duplicate or incorrect charge
- Will the portal support partial refunds and recurring payments? This changes the eligibility, timing, and routing analysis. — Full refunds only
- What recordkeeping and audit-trail requirements should apply to the portal's decisions and notices? — Working recommendation, subject to jurisdiction-specific confirmation: retain the request, transaction reference, payer verification method and result, eligibility inputs, reason selected, rule version, decision, timing, refund rail, merchant notice, delivery status, user-facing notice, fraud signals, overrides, and escalation outcome. Keep an immutable audit trail with timestamps and actor/service IDs; restrict access; preserve evidence for disputes and regulator requests; set a documented retention schedule by jurisdiction and legal hold process; delete or de-identify after expiry. Do not retain full payment credentials or unnecessary contact data.
- How should the portal interact with ACH unauthorized/error return processes? — Route ACH unauthorized/error claims to the bank/processor return process
- What accessible-language and accessibility standards must the portal notices meet across the footprint? — WCAG 2.1/2.2 AA accessibility: Notices in the payer's language across supported markets: Plain-language, consumer-friendly wording

## Assumptions

- [Assumption] Mosaic Relay is not a bank and does not hold deposits; refunds are executed through regulated partners.
- [Assumption] The portal is intended to operate across North America and Europe (Mosaic Relay's footprint), subject to location-specific law.
- [Assumption] The portal operates across North America and Europe (full footprint), subject to location-specific law.
- [Assumption] Target launch is a limited pilot in ~60 days, subject to legal review and control testing.
- [Assumption] Escalation/denial path recommendation is pending jurisdiction-specific review.
- [Assumption] The escalation/denial path follows the working recommendation pending jurisdiction-specific review.
- [Assumption] Limited pilot targeted in ~60 days, subject to legal review and control testing (no firm launch date set).
- [Assumption] Escalation/denial path and recordkeeping recommendations are working positions pending jurisdiction-specific confirmation.
- [Assumption] Limited pilot in ~60 days, subject to legal review and control testing.
- [Assumption] Do not silently deny; provide reason, window, refund options, and a merchant-support route with a response target.
- [Assumption] Route card-network disputes to the payer's issuer/network process and ACH unauthorized/error claims to the bank/processor return process; the portal must not imply a refund request replaces those rights.
- [Assumption] Retain a defined immutable audit trail with documented retention by jurisdiction and no full payment credentials.
- [Assumption] Working assumption: a limited pilot in 60 days, subject to legal review and control testing (no set launch date).
- [Assumption] Escalation and recordkeeping recommendations are working positions pending jurisdiction-specific confirmation.
