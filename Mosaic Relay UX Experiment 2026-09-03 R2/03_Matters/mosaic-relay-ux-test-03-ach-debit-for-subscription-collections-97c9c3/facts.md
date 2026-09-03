---
matter_id: MAT-20260903-97c9c3
record_type: facts
facts:
- fact_id: FACT-20260903-1ea918
  text: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-e4bd9d
  text: A user would enter a bank account, agree to recurring debits, receive confirmation,
    and be able to cancel through the platform.
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-0bfe39
  text: The actors are the platform, its users, Mosaic Relay, the originating bank,
    and the ACH operator.
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-93d49d
  text: Product wants a pilot in 30 days (target launch 2026-10-03).
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-a0d945
  text: Known facts include the proposed authorization screen, debit schedule, return
    handling, and expected transaction volume.
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-a61dc1
  text: Missing facts include the customer's cancellation process, authorization record
    format, notice timing, retry logic, consumer versus business account mix, and
    treatment of unauthorized returns.
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- fact_id: FACT-20260903-b849ca
  text: What is the mix of consumer versus business accounts expected in the pilot?
    This determines the entire regulatory framework (Reg E/EFTA protections for consumers
    vs. NACHA-only for businesses). — Not yet known / to be determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-8ea56a
  supersedes: null
  created_at: '2026-09-03T16:43:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-833c9e
- fact_id: FACT-20260903-beaff0
  text: Is the subscription debit amount fixed or variable? This drives the NACHA
    advance-notice requirement (10 days before the first debit, 7 days before each
    subsequent debit for variable amounts). — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-9cbffb
  supersedes: null
  created_at: '2026-09-03T16:44:00+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7b7c18
- fact_id: FACT-20260903-c84882
  text: 'How does a user''s cancellation propagate from the platform to Mosaic Relay''s
    operations, and who owns the stop obligation? — Shared: platform forwards the
    cancel, Mosaic Relay executes the stop'
  status: active
  material: true
  source_ids:
  - MSG-20260903-75f122
  supersedes: null
  created_at: '2026-09-03T16:44:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-060bdb
- fact_id: FACT-20260903-628360
  text: What format and retention period will Mosaic Relay use for the recurring-debit
    authorization record? NACHA requires the ODFI to retain the authorization (or
    a record of it) for 2 years in a reproducible format. — Electronic record retained
    2 years (reproducible)
  status: active
  material: true
  source_ids:
  - MSG-20260903-6a4b2d
  supersedes: null
  created_at: '2026-09-03T16:44:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-1c1571
- fact_id: FACT-20260903-121099
  text: What is the proposed retry logic for returned debits? NACHA prohibits reinitiating
    R07 (authorization revoked), R10 (unauthorized), and R29 (corporate authorization
    revoked) returns without new authorization. — Retry only non-revocation returns
    (e.g., insufficient funds) with limits, never R07/R10/R29
  status: active
  material: true
  source_ids:
  - MSG-20260903-9d3a3e
  supersedes: null
  created_at: '2026-09-03T16:45:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d2964b
- fact_id: FACT-20260903-7d32ce
  text: 'What is the platform''s role in the recurring ACH debit flow: originator,
    third-party sender, or service provider? — Originator'
  status: active
  material: true
  source_ids:
  - MSG-20260903-94cebd
  supersedes: null
  created_at: '2026-09-03T16:46:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0d86eb
- fact_id: FACT-20260903-7e405c
  text: Which countries or regions are in scope? — United States only
  status: active
  material: true
  source_ids:
  - MSG-20260903-c65a12
  supersedes: null
  created_at: '2026-09-03T16:46:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d8c0f5
- fact_id: FACT-20260903-202da1
  text: 'The platform''s role: originator, third-party sender, or service provider
    (affects who bears the obligations). — The platform is the originator; Mosaic
    Relay coordinates ODFI-side processing as the payment partner.'
  status: active
  material: true
  source_ids:
  - MSG-20260903-cd48d5
  supersedes: null
  created_at: '2026-09-03T16:47:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-bba22d
- fact_id: FACT-20260903-fc169a
  text: Is there any other fact that would materially change the advice? — Yes. Consumer
    versus business account mix, fixed versus variable amounts, notice timing, cancellation
    process, retry limits, unauthorized-return treatment, and the exact authorization
    record format could materially change the advice.
  status: active
  material: true
  source_ids:
  - MSG-20260903-8b36f2
  supersedes: null
  created_at: '2026-09-03T16:47:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f8abf8
- fact_id: FACT-20260903-cddaaa
  text: 'Cancellation propagation: shared — platform forwards the cancel, Mosaic Relay
    executes the stop.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- fact_id: FACT-20260903-ea828e
  text: 'Authorization record: electronic record retained 2 years in a reproducible
    format.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- fact_id: FACT-20260903-9745df
  text: 'Retry logic: retry only non-revocation returns (e.g., insufficient funds)
    with limits, never R07/R10/R29.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- fact_id: FACT-20260903-df1f75
  text: 'Platform role: the platform is the originator; Mosaic Relay coordinates ODFI-side
    processing as the payment partner.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- fact_id: FACT-20260903-f164b6
  text: 'Jurisdiction scope: United States only.'
  status: active
  material: true
  source_ids:
  - REQ-20260903-c6434e
  supersedes: null
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
sources:
- source_id: REQ-20260903-c6434e
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-03-ach-debit-for-subscription-collections-97c9c3/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T16:42:20+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3eb679
- source_id: MSG-20260903-8ea56a
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:43:15+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-3de0d2
- source_id: MSG-20260903-9cbffb
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:44:00+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b4f500
- source_id: MSG-20260903-75f122
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:44:28+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-af3b3c
- source_id: MSG-20260903-6a4b2d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:44:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-91a4cf
- source_id: MSG-20260903-9d3a3e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:45:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4a9a60
- source_id: MSG-20260903-94cebd
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:46:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fd986d
- source_id: MSG-20260903-c65a12
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:46:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-405b8f
- source_id: MSG-20260903-cd48d5
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:47:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-46839c
- source_id: MSG-20260903-8b36f2
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:47:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0599f5
support:
- support_id: SUP-20260903-ca0a06
  fact_id: FACT-20260903-1ea918
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-7b9b72
  fact_id: FACT-20260903-e4bd9d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-8290bd
  fact_id: FACT-20260903-0bfe39
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-2072ea
  fact_id: FACT-20260903-93d49d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Product wants a pilot in 30 days (target launch 2026-10-03).
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-77d48d
  fact_id: FACT-20260903-a0d945
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Known facts include the proposed authorization screen, debit schedule,
    return handling, and expected transaction volume.
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-710a37
  fact_id: FACT-20260903-a61dc1
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Missing facts include the customer's cancellation process, authorization
    record format, notice timing, retry logic, consumer versus business account mix,
    and treatment of unauthorized returns.
  location: ''
  created_at: '2026-09-03T16:42:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- support_id: SUP-20260903-185ccc
  fact_id: FACT-20260903-1ea918
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-3e0b43
  fact_id: FACT-20260903-e4bd9d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-fe1f16
  fact_id: FACT-20260903-0bfe39
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-3fd427
  fact_id: FACT-20260903-93d49d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Product wants a pilot in 30 days (target launch 2026-10-03).
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-af0b34
  fact_id: FACT-20260903-cddaaa
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Cancellation propagation: shared — platform forwards the cancel, Mosaic
    Relay executes the stop.'
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-e89e55
  fact_id: FACT-20260903-ea828e
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Authorization record: electronic record retained 2 years in a reproducible
    format.'
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-f8b5bf
  fact_id: FACT-20260903-9745df
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Retry logic: retry only non-revocation returns (e.g., insufficient funds)
    with limits, never R07/R10/R29.'
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-add5d2
  fact_id: FACT-20260903-df1f75
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Platform role: the platform is the originator; Mosaic Relay coordinates
    ODFI-side processing as the payment partner.'
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-05cdce
  fact_id: FACT-20260903-f164b6
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Jurisdiction scope: United States only.'
  location: ''
  created_at: '2026-09-03T16:47:55+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- support_id: SUP-20260903-430f44
  fact_id: FACT-20260903-1ea918
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-60c147
  fact_id: FACT-20260903-e4bd9d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-92a156
  fact_id: FACT-20260903-0bfe39
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-0c45ee
  fact_id: FACT-20260903-93d49d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Product wants a pilot in 30 days (target launch 2026-10-03).
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-d9abe0
  fact_id: FACT-20260903-cddaaa
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Cancellation propagation: shared — platform forwards the cancel, Mosaic
    Relay executes the stop.'
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-47a55d
  fact_id: FACT-20260903-ea828e
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Authorization record: electronic record retained 2 years in a reproducible
    format.'
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-4ea4fb
  fact_id: FACT-20260903-9745df
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Retry logic: retry only non-revocation returns (e.g., insufficient funds)
    with limits, never R07/R10/R29.'
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-23c104
  fact_id: FACT-20260903-df1f75
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Platform role: the platform is the originator; Mosaic Relay coordinates
    ODFI-side processing as the payment partner.'
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-b85651
  fact_id: FACT-20260903-f164b6
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Jurisdiction scope: United States only.'
  location: ''
  created_at: '2026-09-03T16:48:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- support_id: SUP-20260903-f329bd
  fact_id: FACT-20260903-1ea918
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-50eaf3
  fact_id: FACT-20260903-e4bd9d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-454c2a
  fact_id: FACT-20260903-0bfe39
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-b1fee4
  fact_id: FACT-20260903-93d49d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Product wants a pilot in 30 days (target launch 2026-10-03).
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-d3bddc
  fact_id: FACT-20260903-cddaaa
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Cancellation propagation: shared — platform forwards the cancel, Mosaic
    Relay executes the stop.'
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-d4d16b
  fact_id: FACT-20260903-ea828e
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Authorization record: electronic record retained 2 years in a reproducible
    format.'
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-070dd4
  fact_id: FACT-20260903-9745df
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Retry logic: retry only non-revocation returns (e.g., insufficient funds)
    with limits, never R07/R10/R29.'
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-be6ca3
  fact_id: FACT-20260903-df1f75
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Platform role: the platform is the originator; Mosaic Relay coordinates
    ODFI-side processing as the payment partner.'
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-ad9b09
  fact_id: FACT-20260903-f164b6
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Jurisdiction scope: United States only.'
  location: ''
  created_at: '2026-09-03T16:49:11+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8f7230
- support_id: SUP-20260903-377760
  fact_id: FACT-20260903-1ea918
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-027d46
  fact_id: FACT-20260903-e4bd9d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-bf78db
  fact_id: FACT-20260903-0bfe39
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-ad68b5
  fact_id: FACT-20260903-93d49d
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: Product wants a pilot in 30 days (target launch 2026-10-03).
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-a874a7
  fact_id: FACT-20260903-cddaaa
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Cancellation propagation: shared — platform forwards the cancel, Mosaic
    Relay executes the stop.'
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-72ce2d
  fact_id: FACT-20260903-ea828e
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Authorization record: electronic record retained 2 years in a reproducible
    format.'
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-3f0167
  fact_id: FACT-20260903-9745df
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Retry logic: retry only non-revocation returns (e.g., insufficient funds)
    with limits, never R07/R10/R29.'
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-9804b3
  fact_id: FACT-20260903-df1f75
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Platform role: the platform is the originator; Mosaic Relay coordinates
    ODFI-side processing as the payment partner.'
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
- support_id: SUP-20260903-0062b4
  fact_id: FACT-20260903-f164b6
  source_id: REQ-20260903-c6434e
  relationship: support
  statement: 'Jurisdiction scope: United States only.'
  location: ''
  created_at: '2026-09-03T16:49:52+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
assumptions:
- assumption_id: ASM-20260903-dca79e
  text: Mosaic Relay acts as or coordinates with the ODFI/originator for these debits;
    the originating bank is a regulated partner.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:42:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- assumption_id: ASM-20260903-c87aa7
  text: The pilot is US-only unless otherwise stated; NACHA rules and Reg E/EFTA apply
    to US consumer accounts.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:42:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- assumption_id: ASM-20260903-1ad020
  text: NACHA Operating Rules and, for consumer accounts, Reg E/EFTA apply to the
    recurring ACH debits.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:42:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-33098e
- assumption_id: ASM-20260903-b02dfd
  text: The pilot is US-only; NACHA rules and Reg E/EFTA apply to US consumer accounts.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:47:55+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-d3f345
- assumption_id: ASM-20260903-b1bd64
  text: US-only scope means NACHA Operating Rules and, for consumer accounts, Reg
    E/EFTA are the governing framework.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:48:27+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- assumption_id: ASM-20260903-ef0544
  text: As originator, the platform bears the NACHA authorization, notice, and recordkeeping
    obligations; Mosaic Relay coordinates ODFI-side processing.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:48:27+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-11f9d4
- assumption_id: ASM-20260903-d688d3
  text: US-only scope confirmed; NACHA Operating Rules and, for consumer accounts,
    Reg E/EFTA are the governing framework.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:49:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-fb8dec
conflicts: []
actions:
- action_id: ACT-20260903-3eb679
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T16:42:20+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-c6434e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-33098e
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:42:36+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-1ea918
    - FACT-20260903-e4bd9d
    - FACT-20260903-0bfe39
    - FACT-20260903-93d49d
    - FACT-20260903-a0d945
    - FACT-20260903-a61dc1
    sources: []
    support:
    - SUP-20260903-ca0a06
    - SUP-20260903-7b9b72
    - SUP-20260903-8290bd
    - SUP-20260903-2072ea
    - SUP-20260903-77d48d
    - SUP-20260903-710a37
    assumptions:
    - ASM-20260903-dca79e
    - ASM-20260903-c87aa7
    - ASM-20260903-1ad020
  source_action_key: chat:RUN-20260903-aee730:tool:4198334a0278851816421ad2
- action_id: ACT-20260903-3de0d2
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:43:15+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8ea56a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-833c9e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:43:15+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b849ca
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2280a3:answers
- action_id: ACT-20260903-22d1d7
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:43:26+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-2280a3:tool:7f9e5d0a24e47651d89a0e93
- action_id: ACT-20260903-b4f500
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:44:00+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9cbffb
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-7b7c18
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:44:00+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-beaff0
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6972e1:answers
- action_id: ACT-20260903-56ac1a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:44:11+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6972e1:tool:fdce44f632f25b02792b87f1
- action_id: ACT-20260903-af3b3c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:44:28+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-75f122
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-060bdb
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:44:28+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-c84882
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-e22784:answers
- action_id: ACT-20260903-deda50
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:44:40+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-e22784:tool:c0b1dd7f5a084ffd387b5201
- action_id: ACT-20260903-91a4cf
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:44:55+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-6a4b2d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-1c1571
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:44:55+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-628360
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-719ce2:answers
- action_id: ACT-20260903-b1e45a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:45:11+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-719ce2:tool:1f9118054dc7b98a1cbab0ac
- action_id: ACT-20260903-4a9a60
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:45:38+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-9d3a3e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d2964b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:45:38+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-121099
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-50bf1e:answers
- action_id: ACT-20260903-362984
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:45:49+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-50bf1e:tool:ae89d088c38a7422c3f3000e
- action_id: ACT-20260903-fd986d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:46:09+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-94cebd
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0d86eb
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:46:09+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7d32ce
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-da6dbb:answers
- action_id: ACT-20260903-405b8f
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:46:39+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-c65a12
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d8c0f5
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:46:39+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7e405c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-fcfbf4:answers
- action_id: ACT-20260903-46839c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:47:07+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-cd48d5
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-bba22d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:47:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-202da1
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c64041:answers
- action_id: ACT-20260903-0599f5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:47:34+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-8b36f2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f8abf8
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:47:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-fc169a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-abf104:answers
- action_id: ACT-20260903-d3f345
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:47:55+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-cddaaa
    - FACT-20260903-ea828e
    - FACT-20260903-9745df
    - FACT-20260903-df1f75
    - FACT-20260903-f164b6
    sources: []
    support:
    - SUP-20260903-185ccc
    - SUP-20260903-3e0b43
    - SUP-20260903-fe1f16
    - SUP-20260903-3fd427
    - SUP-20260903-af0b34
    - SUP-20260903-e89e55
    - SUP-20260903-f8b5bf
    - SUP-20260903-add5d2
    - SUP-20260903-05cdce
    assumptions:
    - ASM-20260903-b02dfd
  source_action_key: chat:RUN-20260903-9cd7f4:tool:43f74517da43facd13548d86
- action_id: ACT-20260903-11f9d4
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:48:27+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support:
    - SUP-20260903-430f44
    - SUP-20260903-60c147
    - SUP-20260903-92a156
    - SUP-20260903-0c45ee
    - SUP-20260903-d9abe0
    - SUP-20260903-47a55d
    - SUP-20260903-4ea4fb
    - SUP-20260903-23c104
    - SUP-20260903-b85651
    assumptions:
    - ASM-20260903-b1bd64
    - ASM-20260903-ef0544
  source_action_key: chat:RUN-20260903-90ce5b:tool:f866f2d7aa8731d5e07e53f0
- action_id: ACT-20260903-8f7230
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:49:11+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support:
    - SUP-20260903-f329bd
    - SUP-20260903-50eaf3
    - SUP-20260903-454c2a
    - SUP-20260903-b1fee4
    - SUP-20260903-d3bddc
    - SUP-20260903-d4d16b
    - SUP-20260903-070dd4
    - SUP-20260903-be6ca3
    - SUP-20260903-ad9b09
    assumptions: []
  source_action_key: chat:RUN-20260903-762864:tool:92a6e570a37b3878063a958b
- action_id: ACT-20260903-fb8dec
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:49:52+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support:
    - SUP-20260903-377760
    - SUP-20260903-027d46
    - SUP-20260903-bf78db
    - SUP-20260903-ad68b5
    - SUP-20260903-a874a7
    - SUP-20260903-72ce2d
    - SUP-20260903-3f0167
    - SUP-20260903-9804b3
    - SUP-20260903-0062b4
    assumptions:
    - ASM-20260903-d688d3
  source_action_key: chat:RUN-20260903-5de5b8:tool:ebaa29ef9fc4c59095b6bbeb
working_ask: Mosaic Relay plans to support recurring ACH debits for a software platform
  that collects monthly subscription fees. A user enters a bank account, agrees to
  recurring debits, receives confirmation, and can cancel through the platform. Product
  wants a pilot in 30 days (target 2026-10-03). Legal must approve the exact authorization,
  recurring-debit, cancellation, notice, return, and recordkeeping requirements.
issues:
- NACHA Operating Rules govern recurring ACH debit authorization, advance notice,
  and 2-year record retention; consumer accounts additionally trigger Reg E/EFTA protections
  (stop-payment, 60-day error resolution, specific authorization language).
- Whether the subscription debit amount is fixed or variable determines the NACHA
  advance-notice requirement (10 days before first debit, 7 days before each subsequent
  debit for variable amounts).
- Retry logic for returned debits may constitute new debits requiring fresh authorization
  and notice; R07/R10/R29 returns must not be reinitiated without new authorization.
- The consumer vs. business account mix determines whether Reg E/EFTA applies at all;
  it remains undetermined.
open_questions: []
public_research_questions: []
intake_answers:
- answer_id: ANS-20260903-0446ee
  question_id: account_mix
  question: What is the mix of consumer versus business accounts expected in the pilot?
    This determines the entire regulatory framework (Reg E/EFTA protections for consumers
    vs. NACHA-only for businesses).
  answer: Not yet known / to be determined
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-8ea56a
  source_action_key: chat:RUN-20260903-2280a3
  answered_at: '2026-09-03T16:43:15+00:00'
  answer_fact_id: FACT-20260903-b849ca
- answer_id: ANS-20260903-e911ec
  question_id: fixed_variable
  question: Is the subscription debit amount fixed or variable? This drives the NACHA
    advance-notice requirement (10 days before the first debit, 7 days before each
    subsequent debit for variable amounts).
  answer: Not yet determined
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-9cbffb
  source_action_key: chat:RUN-20260903-6972e1
  answered_at: '2026-09-03T16:44:00+00:00'
  answer_fact_id: FACT-20260903-beaff0
- answer_id: ANS-20260903-20960d
  question_id: cancellation_propagation
  question: How does a user's cancellation propagate from the platform to Mosaic Relay's
    operations, and who owns the stop obligation?
  answer: 'Shared: platform forwards the cancel, Mosaic Relay executes the stop'
  values:
  - shared
  status: answered
  record_target: fact
  source_id: MSG-20260903-75f122
  source_action_key: chat:RUN-20260903-e22784
  answered_at: '2026-09-03T16:44:28+00:00'
  answer_fact_id: FACT-20260903-c84882
- answer_id: ANS-20260903-5e2e22
  question_id: auth_record
  question: What format and retention period will Mosaic Relay use for the recurring-debit
    authorization record? NACHA requires the ODFI to retain the authorization (or
    a record of it) for 2 years in a reproducible format.
  answer: Electronic record retained 2 years (reproducible)
  values:
  - electronic_2yr
  status: answered
  record_target: fact
  source_id: MSG-20260903-6a4b2d
  source_action_key: chat:RUN-20260903-719ce2
  answered_at: '2026-09-03T16:44:55+00:00'
  answer_fact_id: FACT-20260903-628360
- answer_id: ANS-20260903-760677
  question_id: retry_logic
  question: What is the proposed retry logic for returned debits? NACHA prohibits
    reinitiating R07 (authorization revoked), R10 (unauthorized), and R29 (corporate
    authorization revoked) returns without new authorization.
  answer: Retry only non-revocation returns (e.g., insufficient funds) with limits,
    never R07/R10/R29
  values:
  - retry_non_revocation
  status: answered
  record_target: fact
  source_id: MSG-20260903-9d3a3e
  source_action_key: chat:RUN-20260903-50bf1e
  answered_at: '2026-09-03T16:45:38+00:00'
  answer_fact_id: FACT-20260903-121099
- answer_id: ANS-20260903-306904
  question_id: platform_role
  question: 'What is the platform''s role in the recurring ACH debit flow: originator,
    third-party sender, or service provider?'
  answer: Originator
  values:
  - originator
  status: answered
  record_target: fact
  source_id: MSG-20260903-94cebd
  source_action_key: chat:RUN-20260903-da6dbb
  answered_at: '2026-09-03T16:46:09+00:00'
  answer_fact_id: FACT-20260903-7d32ce
- answer_id: ANS-20260903-f9dfca
  question_id: intake-recovery-jurisdiction
  question: Which countries or regions are in scope?
  answer: United States only
  values:
  - choice_1
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-c65a12
  source_action_key: chat:RUN-20260903-fcfbf4
  answered_at: '2026-09-03T16:46:39+00:00'
  answer_fact_id: FACT-20260903-7e405c
- answer_id: ANS-20260903-324883
  question_id: intake-recovery-missing-fact-d48258358b
  question: 'The platform''s role: originator, third-party sender, or service provider
    (affects who bears the obligations).'
  answer: The platform is the originator; Mosaic Relay coordinates ODFI-side processing
    as the payment partner.
  values:
  - The platform is the originator; Mosaic Relay coordinates ODFI-side processing
    as the payment partner.
  status: answered
  record_target: fact
  source_id: MSG-20260903-cd48d5
  source_action_key: chat:RUN-20260903-c64041
  answered_at: '2026-09-03T16:47:07+00:00'
  answer_fact_id: FACT-20260903-202da1
- answer_id: ANS-20260903-adf140
  question_id: intake-recovery-finish
  question: Is there any other fact that would materially change the advice?
  answer: Yes. Consumer versus business account mix, fixed versus variable amounts,
    notice timing, cancellation process, retry limits, unauthorized-return treatment,
    and the exact authorization record format could materially change the advice.
  values:
  - Yes. Consumer versus business account mix, fixed versus variable amounts, notice
    timing, cancellation process, retry limits, unauthorized-return treatment, and
    the exact authorization record format could materially change the advice.
  status: answered
  record_target: fact
  source_id: MSG-20260903-8b36f2
  source_action_key: chat:RUN-20260903-abf104
  answered_at: '2026-09-03T16:47:35+00:00'
  answer_fact_id: FACT-20260903-fc169a
intake_state: active
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay plans to support recurring ACH debits for a software platform
      that collects monthly subscription fees.

      - A user would enter a bank account, agree to recurring debits, receive confirmation,
      and be able to cancel through the platform.

      - The actors are the platform, its users, Mosaic Relay, the originating bank,
      and the ACH operator.

      - Product wants a pilot in 30 days (target launch 2026-10-03).

      - Known facts include the proposed authorization screen, debit schedule, return
      handling, and expected transaction volume.

      - Missing facts include the customer''s cancellation process, authorization
      record format, notice timing, retry logic, consumer versus business account
      mix, and treatment of unauthorized returns.

      - What is the mix of consumer versus business accounts expected in the pilot?
      This determines the entire regulatory framework (Reg E/EFTA protections for
      consumers vs. NACHA-only for businesses). — Not yet known / to be determined

      - Is the subscription debit amount fixed or variable? This drives the NACHA
      advance-notice requirement (10 days before the first debit, 7 days before each
      subsequent debit for variable amounts). — Not yet determined

      - How does a user''s cancellation propagate from the platform to Mosaic Relay''s
      operations, and who owns the stop obligation? — Shared: platform forwards the
      cancel, Mosaic Relay executes the stop

      - What format and retention period will Mosaic Relay use for the recurring-debit
      authorization record? NACHA requires the ODFI to retain the authorization (or
      a record of it) for 2 years in a reproducible format. — Electronic record retained
      2 years (reproducible)

      - What is the proposed retry logic for returned debits? NACHA prohibits reinitiating
      R07 (authorization revoked), R10 (unauthorized), and R29 (corporate authorization
      revoked) returns without new authorization. — Retry only non-revocation returns
      (e.g., insufficient funds) with limits, never R07/R10/R29

      - What is the platform''s role in the recurring ACH debit flow: originator,
      third-party sender, or service provider? — Originator

      - Which countries or regions are in scope? — United States only

      - The platform''s role: originator, third-party sender, or service provider
      (affects who bears the obligations). — The platform is the originator; Mosaic
      Relay coordinates ODFI-side processing as the payment partner.

      - Is there any other fact that would materially change the advice? — Yes. Consumer
      versus business account mix, fixed versus variable amounts, notice timing, cancellation
      process, retry limits, unauthorized-return treatment, and the exact authorization
      record format could materially change the advice.

      - Cancellation propagation: shared — platform forwards the cancel, Mosaic Relay
      executes the stop.

      - Authorization record: electronic record retained 2 years in a reproducible
      format.

      - Retry logic: retry only non-revocation returns (e.g., insufficient funds)
      with limits, never R07/R10/R29.

      - Platform role: the platform is the originator; Mosaic Relay coordinates ODFI-side
      processing as the payment partner.

      - Jurisdiction scope: United States only.


      ## Assumptions


      - [Assumption] Mosaic Relay acts as or coordinates with the ODFI/originator
      for these debits; the originating bank is a regulated partner.

      - [Assumption] The pilot is US-only unless otherwise stated; NACHA rules and
      Reg E/EFTA apply to US consumer accounts.

      - [Assumption] NACHA Operating Rules and, for consumer accounts, Reg E/EFTA
      apply to the recurring ACH debits.

      - [Assumption] The pilot is US-only; NACHA rules and Reg E/EFTA apply to US
      consumer accounts.

      - [Assumption] US-only scope means NACHA Operating Rules and, for consumer accounts,
      Reg E/EFTA are the governing framework.

      - [Assumption] As originator, the platform bears the NACHA authorization, notice,
      and recordkeeping obligations; Mosaic Relay coordinates ODFI-side processing.

      - [Assumption] US-only scope confirmed; NACHA Operating Rules and, for consumer
      accounts, Reg E/EFTA are the governing framework.

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

- Mosaic Relay plans to support recurring ACH debits for a software platform that collects monthly subscription fees.
- A user would enter a bank account, agree to recurring debits, receive confirmation, and be able to cancel through the platform.
- The actors are the platform, its users, Mosaic Relay, the originating bank, and the ACH operator.
- Product wants a pilot in 30 days (target launch 2026-10-03).
- Known facts include the proposed authorization screen, debit schedule, return handling, and expected transaction volume.
- Missing facts include the customer's cancellation process, authorization record format, notice timing, retry logic, consumer versus business account mix, and treatment of unauthorized returns.
- What is the mix of consumer versus business accounts expected in the pilot? This determines the entire regulatory framework (Reg E/EFTA protections for consumers vs. NACHA-only for businesses). — Not yet known / to be determined
- Is the subscription debit amount fixed or variable? This drives the NACHA advance-notice requirement (10 days before the first debit, 7 days before each subsequent debit for variable amounts). — Not yet determined
- How does a user's cancellation propagate from the platform to Mosaic Relay's operations, and who owns the stop obligation? — Shared: platform forwards the cancel, Mosaic Relay executes the stop
- What format and retention period will Mosaic Relay use for the recurring-debit authorization record? NACHA requires the ODFI to retain the authorization (or a record of it) for 2 years in a reproducible format. — Electronic record retained 2 years (reproducible)
- What is the proposed retry logic for returned debits? NACHA prohibits reinitiating R07 (authorization revoked), R10 (unauthorized), and R29 (corporate authorization revoked) returns without new authorization. — Retry only non-revocation returns (e.g., insufficient funds) with limits, never R07/R10/R29
- What is the platform's role in the recurring ACH debit flow: originator, third-party sender, or service provider? — Originator
- Which countries or regions are in scope? — United States only
- The platform's role: originator, third-party sender, or service provider (affects who bears the obligations). — The platform is the originator; Mosaic Relay coordinates ODFI-side processing as the payment partner.
- Is there any other fact that would materially change the advice? — Yes. Consumer versus business account mix, fixed versus variable amounts, notice timing, cancellation process, retry limits, unauthorized-return treatment, and the exact authorization record format could materially change the advice.
- Cancellation propagation: shared — platform forwards the cancel, Mosaic Relay executes the stop.
- Authorization record: electronic record retained 2 years in a reproducible format.
- Retry logic: retry only non-revocation returns (e.g., insufficient funds) with limits, never R07/R10/R29.
- Platform role: the platform is the originator; Mosaic Relay coordinates ODFI-side processing as the payment partner.
- Jurisdiction scope: United States only.

## Assumptions

- [Assumption] Mosaic Relay acts as or coordinates with the ODFI/originator for these debits; the originating bank is a regulated partner.
- [Assumption] The pilot is US-only unless otherwise stated; NACHA rules and Reg E/EFTA apply to US consumer accounts.
- [Assumption] NACHA Operating Rules and, for consumer accounts, Reg E/EFTA apply to the recurring ACH debits.
- [Assumption] The pilot is US-only; NACHA rules and Reg E/EFTA apply to US consumer accounts.
- [Assumption] US-only scope means NACHA Operating Rules and, for consumer accounts, Reg E/EFTA are the governing framework.
- [Assumption] As originator, the platform bears the NACHA authorization, notice, and recordkeeping obligations; Mosaic Relay coordinates ODFI-side processing.
- [Assumption] US-only scope confirmed; NACHA Operating Rules and, for consumer accounts, Reg E/EFTA are the governing framework.
