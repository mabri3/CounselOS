---
matter_id: MAT-20260903-f37f48
record_type: facts
facts:
- fact_id: FACT-20260903-a2f536
  text: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-09c222
  text: A user would enter a bank account, agree to recurring debits, receive confirmation,
    and be able to cancel through the platform.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-46c8d7
  text: The actors are the platform, its users, Mosaic Relay, the originating bank,
    and the ACH operator.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-a80305
  text: Product wants a pilot in 30 days.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-1cd982
  text: Known facts include the proposed authorization screen, debit schedule, return
    handling, and expected transaction volume.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-a7bc4a
  text: Missing facts include the customer's cancellation process, authorization record
    format, notice timing, retry logic, consumer versus business account mix, and
    treatment of unauthorized returns.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- fact_id: FACT-20260903-239983
  text: What is the mix of consumer versus business accounts expected in the pilot?
    This determines the entire regulatory framework (Reg E/EFTA protections for consumers
    vs. NACHA-only for businesses). — Not yet known / to be determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-e156a1
  supersedes: null
  created_at: '2026-09-03T16:31:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-512445
- fact_id: FACT-20260903-84c65f
  text: Is the subscription debit amount fixed or variable? — Not yet known / to be
    determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-ed1449
  supersedes: null
  created_at: '2026-09-03T16:32:03+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-aaa23d
- fact_id: FACT-20260903-62584d
  text: How does a user's cancellation propagate from the platform to Mosaic Relay's
    operations to stop future debits, and who owns the stop obligation? — Not yet
    known / to be determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-1292e9
  supersedes: null
  created_at: '2026-09-03T16:32:27+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-36eb71
- fact_id: FACT-20260903-2871a3
  text: What is the authorization record format and retention period for the recurring
    debits? — Not yet known / to be determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-4dbbcd
  supersedes: null
  created_at: '2026-09-03T16:32:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-be6eab
- fact_id: FACT-20260903-34f981
  text: How should retries of returned debits be handled? Retries may constitute new
    debits requiring fresh authorization and notice, and returned-debit codes (R07,
    R10, R29) need defined handling to avoid continued debits after a user revokes
    authorization. — Not yet known / to be determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-3ecf0f
  supersedes: null
  created_at: '2026-09-03T16:33:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-61638b
- fact_id: FACT-20260903-0f8f25
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260903-a46d0d
  supersedes: null
  created_at: '2026-09-03T16:33:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-df51d2
- fact_id: FACT-20260903-07f4c8
  text: Which countries or regions are in scope? — United States only
  status: active
  material: true
  source_ids:
  - MSG-20260903-7dad0f
  supersedes: null
  created_at: '2026-09-03T16:33:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f2927c
- fact_id: FACT-20260903-e5d9c6
  text: Is there any other fact that would materially change the advice? — No additional
    facts beyond the listed gaps are confirmed. The legal answer could also change
    with the platform's role (originator, third-party sender, or service provider),
    state licensing or money-transmission scope, debit amount limits, consumer disclosure
    language, data retention/security controls, and whether the pilot uses prenotes
    or a third-party processor.
  status: active
  material: true
  source_ids:
  - MSG-20260903-ddddcc
  supersedes: null
  created_at: '2026-09-03T16:34:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e17d6b
- fact_id: FACT-20260903-0e2e59
  text: The business needs the legal answer before a planned launch.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- fact_id: FACT-20260903-1fd5d6
  text: Jurisdiction scope is United States only.
  status: active
  material: true
  source_ids:
  - REQ-20260903-26f176
  supersedes: null
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- fact_id: FACT-20260903-508369
  text: What role does the platform play in the ACH flow? — Not yet known
  status: active
  material: true
  source_ids:
  - MSG-20260903-10c195
  supersedes: null
  created_at: '2026-09-03T16:35:08+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f55f30
sources:
- source_id: REQ-20260903-26f176
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-03-ach-debit-for-subscription-collections-f37f48/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T16:31:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7baa18
- source_id: MSG-20260903-e156a1
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:31:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-17b02d
- source_id: MSG-20260903-ed1449
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:32:03+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-63239d
- source_id: MSG-20260903-1292e9
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:32:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-78b7ea
- source_id: MSG-20260903-4dbbcd
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:32:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ab0dc5
- source_id: MSG-20260903-3ecf0f
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:33:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ae6147
- source_id: MSG-20260903-a46d0d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:33:29+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-2d7a80
- source_id: MSG-20260903-7dad0f
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:33:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6e1fa6
- source_id: MSG-20260903-ddddcc
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:34:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e61611
- source_id: MSG-20260903-10c195
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T16:35:08+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a4e0c1
support:
- support_id: SUP-20260903-32dd28
  fact_id: FACT-20260903-a2f536
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-ab3544
  fact_id: FACT-20260903-09c222
  source_id: REQ-20260903-26f176
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-0fdf46
  fact_id: FACT-20260903-46c8d7
  source_id: REQ-20260903-26f176
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-3ab307
  fact_id: FACT-20260903-a80305
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Product wants a pilot in 30 days.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-7c5b42
  fact_id: FACT-20260903-1cd982
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Known facts include the proposed authorization screen, debit schedule,
    return handling, and expected transaction volume.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-e93e73
  fact_id: FACT-20260903-a7bc4a
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Missing facts include the customer's cancellation process, authorization
    record format, notice timing, retry logic, consumer versus business account mix,
    and treatment of unauthorized returns.
  location: ''
  created_at: '2026-09-03T16:31:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- support_id: SUP-20260903-357fb3
  fact_id: FACT-20260903-a2f536
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Mosaic Relay plans to support recurring ACH debits for a software platform
    that collects monthly subscription fees.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-10d209
  fact_id: FACT-20260903-09c222
  source_id: REQ-20260903-26f176
  relationship: support
  statement: A user would enter a bank account, agree to recurring debits, receive
    confirmation, and be able to cancel through the platform.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-bb7e68
  fact_id: FACT-20260903-46c8d7
  source_id: REQ-20260903-26f176
  relationship: support
  statement: The actors are the platform, its users, Mosaic Relay, the originating
    bank, and the ACH operator.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-a9486d
  fact_id: FACT-20260903-a80305
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Product wants a pilot in 30 days.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-fec6c8
  fact_id: FACT-20260903-1cd982
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Known facts include the proposed authorization screen, debit schedule,
    return handling, and expected transaction volume.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-5cce2c
  fact_id: FACT-20260903-0e2e59
  source_id: REQ-20260903-26f176
  relationship: support
  statement: The business needs the legal answer before a planned launch.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
- support_id: SUP-20260903-93a3cc
  fact_id: FACT-20260903-1fd5d6
  source_id: REQ-20260903-26f176
  relationship: support
  statement: Jurisdiction scope is United States only.
  location: ''
  created_at: '2026-09-03T16:34:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-eb3525
assumptions:
- assumption_id: ASM-20260903-2b10da
  text: Mosaic Relay acts as or coordinates with the ODFI/originator for these debits;
    the originating bank is a regulated partner.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:31:23+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- assumption_id: ASM-20260903-b7d5d6
  text: The pilot is US-only unless otherwise stated; NACHA rules and Reg E/EFTA apply
    to US consumer accounts.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:31:23+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-a56498
- assumption_id: ASM-20260903-8a47ce
  text: The pilot is US-only; NACHA rules and Reg E/EFTA apply to US consumer accounts.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:34:28+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-ff9e5f
- assumption_id: ASM-20260903-4f7dea
  text: NACHA Operating Rules and, for consumer accounts, Reg E/EFTA apply to the
    recurring ACH debits given US-only scope.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:35:19+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-5c0e4b
- assumption_id: ASM-20260903-45bcce
  text: Mosaic Relay acts as the ODFI or coordinates with an originating bank that
    holds ODFI obligations; the platform's role is unresolved.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T16:35:19+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-5c0e4b
conflicts: []
actions:
- action_id: ACT-20260903-7baa18
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T16:31:10+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-26f176
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-a56498
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:31:23+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-a2f536
    - FACT-20260903-09c222
    - FACT-20260903-46c8d7
    - FACT-20260903-a80305
    - FACT-20260903-1cd982
    - FACT-20260903-a7bc4a
    sources: []
    support:
    - SUP-20260903-32dd28
    - SUP-20260903-ab3544
    - SUP-20260903-0fdf46
    - SUP-20260903-3ab307
    - SUP-20260903-7c5b42
    - SUP-20260903-e93e73
    assumptions:
    - ASM-20260903-2b10da
    - ASM-20260903-b7d5d6
  source_action_key: chat:RUN-20260903-b2adfb:tool:b70b991d54ef7df79d4589c8
- action_id: ACT-20260903-17b02d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:31:43+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-e156a1
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-512445
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:31:43+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-239983
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-640163:answers
- action_id: ACT-20260903-80c71f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:31:52+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-640163:tool:97a2fd8da798674aa54a7c5d
- action_id: ACT-20260903-63239d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:32:03+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ed1449
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-aaa23d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:32:03+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-84c65f
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9fee25:answers
- action_id: ACT-20260903-b7240d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:32:18+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9fee25:tool:5bf8cb83911c08a65d8e355f
- action_id: ACT-20260903-78b7ea
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:32:26+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-1292e9
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-36eb71
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:32:27+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-62584d
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-bba7e7:answers
- action_id: ACT-20260903-c732ce
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:32:35+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-bba7e7:tool:782c3c26ef97729daed052fa
- action_id: ACT-20260903-ab0dc5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:32:47+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-4dbbcd
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-be6eab
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:32:47+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-2871a3
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-823a48:answers
- action_id: ACT-20260903-51b1c0
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:32:56+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-823a48:tool:fe0fb08aa0a62ab338aebf82
- action_id: ACT-20260903-ae6147
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:33:07+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-3ecf0f
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-61638b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:33:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-34f981
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-a556df:answers
- action_id: ACT-20260903-c8eebd
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:33:18+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-a556df:tool:7301bc0e7da2c2f42ff14a7b
- action_id: ACT-20260903-2d7a80
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:33:29+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a46d0d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-df51d2
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:33:29+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0f8f25
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6c5cb5:answers
- action_id: ACT-20260903-d9bfaf
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:33:40+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6c5cb5:tool:7147be9cd9d05ae9562a2173
- action_id: ACT-20260903-6e1fa6
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:33:58+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-7dad0f
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f2927c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:33:58+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-07f4c8
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-70f93b:answers
- action_id: ACT-20260903-e61611
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:34:17+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-ddddcc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e17d6b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:34:17+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-e5d9c6
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0696b5:answers
- action_id: ACT-20260903-ff9e5f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:34:28+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-8a47ce
  source_action_key: chat:RUN-20260903-0696b5:tool:76e71a68fee2c00a344e73dd
- action_id: ACT-20260903-eb3525
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:34:43+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-0e2e59
    - FACT-20260903-1fd5d6
    sources: []
    support:
    - SUP-20260903-357fb3
    - SUP-20260903-10d209
    - SUP-20260903-bb7e68
    - SUP-20260903-a9486d
    - SUP-20260903-fec6c8
    - SUP-20260903-5cce2c
    - SUP-20260903-93a3cc
    assumptions: []
  source_action_key: chat:RUN-20260903-f4fd97:tool:74c0780da3017a54f2bf1180
- action_id: ACT-20260903-a4e0c1
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T16:35:08+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-10c195
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-f55f30
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T16:35:08+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-508369
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-0ad3b7:answers
- action_id: ACT-20260903-5c0e4b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T16:35:19+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-4f7dea
    - ASM-20260903-45bcce
  source_action_key: chat:RUN-20260903-0ad3b7:tool:289b353bbe508d9c707158f0
working_ask: Mosaic Relay plans to support recurring ACH debits for a software platform
  that collects monthly subscription fees. A user would enter a bank account, agree
  to recurring debits, receive confirmation, and be able to cancel through the platform.
  Product wants a pilot in 30 days; legal answer is needed before launch. Jurisdiction
  scope is United States only. Legal must approve the exact authorization, recurring-debit,
  cancellation, notice, return, and recordkeeping requirements.
issues:
- NACHA Operating Rules govern recurring ACH debit authorization, notice, and recordkeeping;
  consumer accounts additionally trigger Reg E/EFTA protections (stop-payment, 60-day
  error resolution, specific authorization language).
- Whether the subscription debit amount is fixed or variable determines the NACHA
  advance-notice requirement (10 days before first debit, 7 days before each subsequent
  debit for variable amounts).
- Retry logic for returned debits may constitute new debits requiring fresh authorization
  and notice, and may implicate unauthorized-return handling (R07, R10, R29).
- Cancellation must propagate from the user through the platform to Mosaic Relay's
  operations to prevent unauthorized continued debits.
- The consumer vs. business account mix remains unresolved and determines whether
  Reg E/EFTA applies at all.
- NACHA requires the ODFI to retain the authorization (or a record of it) for 2 years
  in a reproducible format; format and retention must be confirmed for recordkeeping
  approval.
- The platform's role (originator, third-party sender, or service provider) is unresolved
  and affects NACHA and money-transmission obligations.
open_questions:
- Retry/return handling for R07, R10, R29
- The platform's role in the ACH flow (originator, third-party sender, or service
  provider)
public_research_questions:
- What are the current NACHA Operating Rules requirements for recurring ACH debit
  authorization, advance notice, and 2-year record retention?
- What are the Reg E/EFTA requirements for consumer recurring ACH debits, including
  stop-payment and error-resolution rights?
intake_answers:
- answer_id: ANS-20260903-64e386
  question_id: Q1
  question: What is the mix of consumer versus business accounts expected in the pilot?
    This determines the entire regulatory framework (Reg E/EFTA protections for consumers
    vs. NACHA-only for businesses).
  answer: Not yet known / to be determined
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-e156a1
  source_action_key: chat:RUN-20260903-640163
  answered_at: '2026-09-03T16:31:43+00:00'
  answer_fact_id: FACT-20260903-239983
- answer_id: ANS-20260903-208b65
  question_id: Q2
  question: Is the subscription debit amount fixed or variable?
  answer: Not yet known / to be determined
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-ed1449
  source_action_key: chat:RUN-20260903-9fee25
  answered_at: '2026-09-03T16:32:03+00:00'
  answer_fact_id: FACT-20260903-84c65f
- answer_id: ANS-20260903-c98165
  question_id: Q3
  question: How does a user's cancellation propagate from the platform to Mosaic Relay's
    operations to stop future debits, and who owns the stop obligation?
  answer: Not yet known / to be determined
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-1292e9
  source_action_key: chat:RUN-20260903-bba7e7
  answered_at: '2026-09-03T16:32:27+00:00'
  answer_fact_id: FACT-20260903-62584d
- answer_id: ANS-20260903-41eec7
  question_id: auth_record_format
  question: What is the authorization record format and retention period for the recurring
    debits?
  answer: Not yet known / to be determined
  values:
  - not_known
  status: answered
  record_target: fact
  source_id: MSG-20260903-4dbbcd
  source_action_key: chat:RUN-20260903-823a48
  answered_at: '2026-09-03T16:32:47+00:00'
  answer_fact_id: FACT-20260903-2871a3
- answer_id: ANS-20260903-214620
  question_id: retry_handling
  question: How should retries of returned debits be handled? Retries may constitute
    new debits requiring fresh authorization and notice, and returned-debit codes
    (R07, R10, R29) need defined handling to avoid continued debits after a user revokes
    authorization.
  answer: Not yet known / to be determined
  values:
  - not_known
  status: answered
  record_target: fact
  source_id: MSG-20260903-3ecf0f
  source_action_key: chat:RUN-20260903-a556df
  answered_at: '2026-09-03T16:33:07+00:00'
  answer_fact_id: FACT-20260903-34f981
- answer_id: ANS-20260903-47dec0
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260903-a46d0d
  source_action_key: chat:RUN-20260903-6c5cb5
  answered_at: '2026-09-03T16:33:29+00:00'
  answer_fact_id: FACT-20260903-0f8f25
- answer_id: ANS-20260903-3b3c10
  question_id: intake-recovery-jurisdiction
  question: Which countries or regions are in scope?
  answer: United States only
  values:
  - choice_1
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-7dad0f
  source_action_key: chat:RUN-20260903-70f93b
  answered_at: '2026-09-03T16:33:58+00:00'
  answer_fact_id: FACT-20260903-07f4c8
- answer_id: ANS-20260903-e43a75
  question_id: intake-recovery-finish
  question: Is there any other fact that would materially change the advice?
  answer: No additional facts beyond the listed gaps are confirmed. The legal answer
    could also change with the platform's role (originator, third-party sender, or
    service provider), state licensing or money-transmission scope, debit amount limits,
    consumer disclosure language, data retention/security controls, and whether the
    pilot uses prenotes or a third-party processor.
  values:
  - No additional facts beyond the listed gaps are confirmed. The legal answer could
    also change with the platform's role (originator, third-party sender, or service
    provider), state licensing or money-transmission scope, debit amount limits, consumer
    disclosure language, data retention/security controls, and whether the pilot uses
    prenotes or a third-party processor.
  status: answered
  record_target: fact
  source_id: MSG-20260903-ddddcc
  source_action_key: chat:RUN-20260903-0696b5
  answered_at: '2026-09-03T16:34:17+00:00'
  answer_fact_id: FACT-20260903-e5d9c6
- answer_id: ANS-20260903-23666a
  question_id: platform_role
  question: What role does the platform play in the ACH flow?
  answer: Not yet known
  values:
  - not_yet_known
  status: answered
  record_target: fact
  source_id: MSG-20260903-10c195
  source_action_key: chat:RUN-20260903-0ad3b7
  answered_at: '2026-09-03T16:35:08+00:00'
  answer_fact_id: FACT-20260903-508369
intake_state: complete
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

      - Product wants a pilot in 30 days.

      - Known facts include the proposed authorization screen, debit schedule, return
      handling, and expected transaction volume.

      - Missing facts include the customer''s cancellation process, authorization
      record format, notice timing, retry logic, consumer versus business account
      mix, and treatment of unauthorized returns.

      - What is the mix of consumer versus business accounts expected in the pilot?
      This determines the entire regulatory framework (Reg E/EFTA protections for
      consumers vs. NACHA-only for businesses). — Not yet known / to be determined

      - Is the subscription debit amount fixed or variable? — Not yet known / to be
      determined

      - How does a user''s cancellation propagate from the platform to Mosaic Relay''s
      operations to stop future debits, and who owns the stop obligation? — Not yet
      known / to be determined

      - What is the authorization record format and retention period for the recurring
      debits? — Not yet known / to be determined

      - How should retries of returned debits be handled? Retries may constitute new
      debits requiring fresh authorization and notice, and returned-debit codes (R07,
      R10, R29) need defined handling to avoid continued debits after a user revokes
      authorization. — Not yet known / to be determined

      - When does the business need the legal answer? — Before a planned launch

      - Which countries or regions are in scope? — United States only

      - Is there any other fact that would materially change the advice? — No additional
      facts beyond the listed gaps are confirmed. The legal answer could also change
      with the platform''s role (originator, third-party sender, or service provider),
      state licensing or money-transmission scope, debit amount limits, consumer disclosure
      language, data retention/security controls, and whether the pilot uses prenotes
      or a third-party processor.

      - The business needs the legal answer before a planned launch.

      - Jurisdiction scope is United States only.

      - What role does the platform play in the ACH flow? — Not yet known


      ## Assumptions


      - [Assumption] Mosaic Relay acts as or coordinates with the ODFI/originator
      for these debits; the originating bank is a regulated partner.

      - [Assumption] The pilot is US-only unless otherwise stated; NACHA rules and
      Reg E/EFTA apply to US consumer accounts.

      - [Assumption] The pilot is US-only; NACHA rules and Reg E/EFTA apply to US
      consumer accounts.

      - [Assumption] NACHA Operating Rules and, for consumer accounts, Reg E/EFTA
      apply to the recurring ACH debits given US-only scope.

      - [Assumption] Mosaic Relay acts as the ODFI or coordinates with an originating
      bank that holds ODFI obligations; the platform''s role is unresolved.

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
- Product wants a pilot in 30 days.
- Known facts include the proposed authorization screen, debit schedule, return handling, and expected transaction volume.
- Missing facts include the customer's cancellation process, authorization record format, notice timing, retry logic, consumer versus business account mix, and treatment of unauthorized returns.
- What is the mix of consumer versus business accounts expected in the pilot? This determines the entire regulatory framework (Reg E/EFTA protections for consumers vs. NACHA-only for businesses). — Not yet known / to be determined
- Is the subscription debit amount fixed or variable? — Not yet known / to be determined
- How does a user's cancellation propagate from the platform to Mosaic Relay's operations to stop future debits, and who owns the stop obligation? — Not yet known / to be determined
- What is the authorization record format and retention period for the recurring debits? — Not yet known / to be determined
- How should retries of returned debits be handled? Retries may constitute new debits requiring fresh authorization and notice, and returned-debit codes (R07, R10, R29) need defined handling to avoid continued debits after a user revokes authorization. — Not yet known / to be determined
- When does the business need the legal answer? — Before a planned launch
- Which countries or regions are in scope? — United States only
- Is there any other fact that would materially change the advice? — No additional facts beyond the listed gaps are confirmed. The legal answer could also change with the platform's role (originator, third-party sender, or service provider), state licensing or money-transmission scope, debit amount limits, consumer disclosure language, data retention/security controls, and whether the pilot uses prenotes or a third-party processor.
- The business needs the legal answer before a planned launch.
- Jurisdiction scope is United States only.
- What role does the platform play in the ACH flow? — Not yet known

## Assumptions

- [Assumption] Mosaic Relay acts as or coordinates with the ODFI/originator for these debits; the originating bank is a regulated partner.
- [Assumption] The pilot is US-only unless otherwise stated; NACHA rules and Reg E/EFTA apply to US consumer accounts.
- [Assumption] The pilot is US-only; NACHA rules and Reg E/EFTA apply to US consumer accounts.
- [Assumption] NACHA Operating Rules and, for consumer accounts, Reg E/EFTA apply to the recurring ACH debits given US-only scope.
- [Assumption] Mosaic Relay acts as the ODFI or coordinates with an originating bank that holds ODFI obligations; the platform's role is unresolved.
