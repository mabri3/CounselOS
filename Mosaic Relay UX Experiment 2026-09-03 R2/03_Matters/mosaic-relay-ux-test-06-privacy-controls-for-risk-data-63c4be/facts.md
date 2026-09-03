---
matter_id: MAT-20260903-63c4be
record_type: facts
facts:
- fact_id: FACT-20260903-b700e8
  text: Mosaic Relay plans to combine onboarding information, transaction history,
    device signals, sanctions results, dispute records, and payout behavior to improve
    fraud and risk scoring.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-d5d358
  text: The risk score would support onboarding, transaction review, payout controls,
    and account deactivation.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-c7a13f
  text: Engineering proposes a shared data model and a launch in ten weeks.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-1a7ca2
  text: Mosaic Relay plans to retain risk events for seven years.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-0bd88e
  text: Actors include Mosaic Relay, its business customers, individual payers, sellers,
    contractors, risk vendors, and support teams.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-c76812
  text: The intended data fields and current vendor contracts are known.
  status: active
  material: true
  source_ids:
  - REQ-20260903-0bdc36
  supersedes: null
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- fact_id: FACT-20260903-f35644
  text: Which jurisdictions will the risk-scoring program cover at launch and in the
    near term? This drives which privacy regimes (GDPR Art. 22, CCPA/CPRA, LATAM laws)
    apply. — Global / not yet scoped
  status: active
  material: true
  source_ids:
  - MSG-20260903-5a5a43
  supersedes: null
  created_at: '2026-09-03T17:27:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-e4782e
- fact_id: FACT-20260903-132b78
  text: Does the risk score drive automated decisions, or does a human review before
    action? (This may differ by use case — onboarding, transaction review, payout
    controls, account deactivation.) — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-967cb6
  supersedes: null
  created_at: '2026-09-03T17:28:03+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-453d22
- fact_id: FACT-20260903-ef77b5
  text: Do the current vendor contracts and data-source permissions permit combining
    this data into a shared risk model? — Not yet reviewed / unknown
  status: active
  material: true
  source_ids:
  - MSG-20260903-79d2c8
  supersedes: null
  created_at: '2026-09-03T17:28:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-bd6243
- fact_id: FACT-20260903-5b6785
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260903-fb3a33
  supersedes: null
  created_at: '2026-09-03T17:28:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-accd03
- fact_id: FACT-20260903-850e5a
  text: Are there deletion exceptions to the seven-year retention of risk events (e.g.,
    cleared sanctions hits, resolved disputes, data subject to deletion requests)?
    — Some categories deleted earlier (e.g., cleared sanctions, resolved disputes)
  status: active
  material: true
  source_ids:
  - MSG-20260903-a7ea81
  supersedes: null
  created_at: '2026-09-03T17:29:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-418100
- fact_id: FACT-20260903-8734a6
  text: Jurisdiction coverage at launch and near term — Global at launch; exact jurisdictions
    are not yet scoped. Design must branch for US-only and EU/UK coverage, with Latin
    America assessed before launch.
  status: active
  material: true
  source_ids:
  - MSG-20260903-facf50
  supersedes: null
  created_at: '2026-09-03T17:29:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8ac9f0
- fact_id: FACT-20260903-09b0c9
  text: 'Access roles for the shared risk model and score — Least privilege with role-based
    access: risk operations may view scores and reason codes; model administrators
    and engineering may manage features and models only as needed; support sees limited
    status and approved explanations, not raw sensitive signals; risk vendors receive
    only minimum fields under contract; business customers receive only the decision
    outcome and required explanation. Log, review, and revoke access.'
  status: active
  material: true
  source_ids:
  - MSG-20260903-dbf6d0
  supersedes: null
  created_at: '2026-09-03T17:30:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-d3c8db
- fact_id: FACT-20260903-498c30
  text: Which data fields are sensitive — Treat sanctions results, dispute records,
    device signals, payout behavior, transaction history, and identity or onboarding
    attributes as sensitive or high-risk. Minimize collection, separate raw signals
    from derived scores, and apply stronger access, notice, retention, and audit controls.
  status: active
  material: true
  source_ids:
  - MSG-20260903-b9c232
  supersedes: null
  created_at: '2026-09-03T17:30:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-27e37d
- fact_id: FACT-20260903-16a974
  text: Should individual payers, sellers, and contractors be able to access, correct,
    or delete their risk data, and how? — Full access/correction/deletion workflows
    for individuals
  status: active
  material: true
  source_ids:
  - MSG-20260903-d19659
  supersedes: null
  created_at: '2026-09-03T17:31:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a88644
- fact_id: FACT-20260903-7e7b52
  text: Should the risk score be explainable to individuals and to business customers,
    and to what degree? — Full explanation to individuals and business customers
  status: active
  material: true
  source_ids:
  - MSG-20260903-61d821
  supersedes: null
  created_at: '2026-09-03T17:31:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a9a5f8
- fact_id: FACT-20260903-4bba53
  text: What notices, consent, or opt-out steps should apply to the combined risk
    scoring? — Notice plus opt-out for certain uses
  status: active
  material: true
  source_ids:
  - MSG-20260903-fc1c33
  supersedes: null
  created_at: '2026-09-03T17:32:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c63e47
- fact_id: FACT-20260903-7acca2
  text: When the business needs the legal answer relative to the ten-week launch —
    Before the planned launch in ten weeks. Legal needs a go/no-go package before
    engineering freezes the shared model and launch plan.
  status: active
  material: true
  source_ids:
  - MSG-20260903-61d532
  supersedes: null
  created_at: '2026-09-03T17:33:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-0ccc35
- fact_id: FACT-20260903-ac2225
  text: Jurisdiction coverage is Global at launch; exact jurisdictions are not yet
    scoped; design must branch for US-only and EU/UK coverage, with Latin America
    assessed before launch.
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-5c1fe7
  text: Some risk-event categories are deleted earlier than seven years (e.g., cleared
    sanctions, resolved disputes).
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-d74251
  text: 'Access is least-privilege and role-based: risk ops view scores/reason codes;
    model admins and engineering manage features/models only as needed; support sees
    limited status and approved explanations, not raw sensitive signals; risk vendors
    receive minimum fields under contract; business customers receive only decision
    outcome and required explanation; access is logged, reviewed, and revocable.'
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-cf5b95
  text: Sanctions results, dispute records, device signals, payout behavior, transaction
    history, and identity/onboarding attributes are treated as sensitive or high-risk;
    minimize collection, separate raw signals from derived scores, and apply stronger
    access, notice, retention, and audit controls.
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-9a1147
  text: Individual payers, sellers, and contractors have full access/correction/deletion
    workflows for their risk data.
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-575966
  text: The risk score is fully explainable to individuals and business customers.
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-62710f
  text: The combined risk scoring uses notice plus opt-out for certain uses.
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-ebf529
  text: Legal needs a go/no-go package before engineering freezes the shared model
    and launch plan (launch in ten weeks).
  status: active
  material: true
  source_ids:
  - MSG-20260903-cc997a
  supersedes: null
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- fact_id: FACT-20260903-dfbb3b
  text: 'Lawyer decision recorded: do not approve the launch as proposed; approve
    only a gated, purpose-limited launch after jurisdiction scoping, vendor permissions/contracts,
    data minimization and retention limits, least-privilege access, individual rights
    workflows, notices and opt-out, full explanations, human review and automated-decision
    safeguards, and model-governance controls are completed and verified.'
  status: active
  material: true
  source_ids:
  - MSG-20260903-17cd1e
  supersedes: null
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
sources:
- source_id: REQ-20260903-0bdc36
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-risk-data-63c4be/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T17:27:12+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ef5da5
- source_id: MSG-20260903-5a5a43
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:27:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8d2dfe
- source_id: MSG-20260903-967cb6
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:28:03+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-8d9d07
- source_id: MSG-20260903-79d2c8
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:28:30+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-520fe2
- source_id: MSG-20260903-fb3a33
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:28:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f750db
- source_id: MSG-20260903-a7ea81
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:29:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b2d6ea
- source_id: MSG-20260903-facf50
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:29:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b7b0a8
- source_id: MSG-20260903-dbf6d0
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:30:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7d7d8f
- source_id: MSG-20260903-b9c232
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:30:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-42dda9
- source_id: MSG-20260903-d19659
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:31:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-86af35
- source_id: MSG-20260903-61d821
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:31:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-6a4988
- source_id: MSG-20260903-fc1c33
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:32:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-96c965
- source_id: MSG-20260903-61d532
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:33:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b349f1
- source_id: MSG-20260903-cc997a
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:37:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c34640
- source_id: MSG-20260903-87b877
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-550b00
- source_id: MSG-20260903-17cd1e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c75dfe
support:
- support_id: SUP-20260903-05ac0c
  fact_id: FACT-20260903-b700e8
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: Mosaic Relay plans to combine onboarding information, transaction history,
    device signals, sanctions results, dispute records, and payout behavior to improve
    fraud and risk scoring.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-0988f4
  fact_id: FACT-20260903-d5d358
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: The risk score would support onboarding, transaction review, payout controls,
    and account deactivation.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-5cdda4
  fact_id: FACT-20260903-c7a13f
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: Engineering proposes a shared data model and a launch in ten weeks.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-972aea
  fact_id: FACT-20260903-1a7ca2
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: Mosaic Relay plans to retain risk events for seven years.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-63b333
  fact_id: FACT-20260903-0bd88e
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: Actors include Mosaic Relay, its business customers, individual payers,
    sellers, contractors, risk vendors, and support teams.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-3e0262
  fact_id: FACT-20260903-c76812
  source_id: REQ-20260903-0bdc36
  relationship: support
  statement: The intended data fields and current vendor contracts are known.
  location: ''
  created_at: '2026-09-03T17:27:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- support_id: SUP-20260903-e907c4
  fact_id: FACT-20260903-b700e8
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Mosaic Relay plans to combine onboarding information, transaction history,
    device signals, sanctions results, dispute records, and payout behavior to improve
    fraud and risk scoring.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-377413
  fact_id: FACT-20260903-d5d358
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: The risk score would support onboarding, transaction review, payout controls,
    and account deactivation.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-45e7e2
  fact_id: FACT-20260903-c7a13f
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Engineering proposes a shared data model and a launch in ten weeks.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-6b2b02
  fact_id: FACT-20260903-1a7ca2
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Mosaic Relay plans to retain risk events for seven years.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-8f5cd6
  fact_id: FACT-20260903-ac2225
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Jurisdiction coverage is Global at launch; exact jurisdictions are not
    yet scoped; design must branch for US-only and EU/UK coverage, with Latin America
    assessed before launch.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-f58968
  fact_id: FACT-20260903-5c1fe7
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Some risk-event categories are deleted earlier than seven years (e.g.,
    cleared sanctions, resolved disputes).
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-325a12
  fact_id: FACT-20260903-d74251
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: 'Access is least-privilege and role-based: risk ops view scores/reason
    codes; model admins and engineering manage features/models only as needed; support
    sees limited status and approved explanations, not raw sensitive signals; risk
    vendors receive minimum fields under contract; business customers receive only
    decision outcome and required explanation; access is logged, reviewed, and revocable.'
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-3f5fb6
  fact_id: FACT-20260903-cf5b95
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Sanctions results, dispute records, device signals, payout behavior,
    transaction history, and identity/onboarding attributes are treated as sensitive
    or high-risk; minimize collection, separate raw signals from derived scores, and
    apply stronger access, notice, retention, and audit controls.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-6c8ce9
  fact_id: FACT-20260903-9a1147
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Individual payers, sellers, and contractors have full access/correction/deletion
    workflows for their risk data.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-80f519
  fact_id: FACT-20260903-575966
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: The risk score is fully explainable to individuals and business customers.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-9e1ea9
  fact_id: FACT-20260903-62710f
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: The combined risk scoring uses notice plus opt-out for certain uses.
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-53a4e1
  fact_id: FACT-20260903-ebf529
  source_id: MSG-20260903-cc997a
  relationship: support
  statement: Legal needs a go/no-go package before engineering freezes the shared
    model and launch plan (launch in ten weeks).
  location: ''
  created_at: '2026-09-03T17:37:36+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- support_id: SUP-20260903-7dcc8a
  fact_id: FACT-20260903-b700e8
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Mosaic Relay plans to combine onboarding information, transaction history,
    device signals, sanctions results, dispute records, and payout behavior to improve
    fraud and risk scoring.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-94e176
  fact_id: FACT-20260903-d5d358
  source_id: MSG-20260903-87b877
  relationship: support
  statement: The risk score would support onboarding, transaction review, payout controls,
    and account deactivation.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-9aab77
  fact_id: FACT-20260903-c7a13f
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Engineering proposes a shared data model and a launch in ten weeks.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-30a472
  fact_id: FACT-20260903-1a7ca2
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Mosaic Relay plans to retain risk events for seven years.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-97b0b2
  fact_id: FACT-20260903-0bd88e
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Actors include Mosaic Relay, its business customers, individual payers,
    sellers, contractors, risk vendors, and support teams.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-942f72
  fact_id: FACT-20260903-c76812
  source_id: MSG-20260903-87b877
  relationship: support
  statement: The intended data fields and current vendor contracts are known.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-490a5d
  fact_id: FACT-20260903-ac2225
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Jurisdiction coverage is Global at launch; exact jurisdictions are not
    yet scoped; design must branch for US-only and EU/UK coverage, with Latin America
    assessed before launch.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-2c57b2
  fact_id: FACT-20260903-5c1fe7
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Some risk-event categories are deleted earlier than seven years (e.g.,
    cleared sanctions, resolved disputes).
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-38084f
  fact_id: FACT-20260903-d74251
  source_id: MSG-20260903-87b877
  relationship: support
  statement: 'Access is least-privilege and role-based: risk ops view scores/reason
    codes; model admins and engineering manage features/models only as needed; support
    sees limited status and approved explanations, not raw sensitive signals; risk
    vendors receive minimum fields under contract; business customers receive only
    decision outcome and required explanation; access is logged, reviewed, and revocable.'
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-f32b18
  fact_id: FACT-20260903-cf5b95
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Sanctions results, dispute records, device signals, payout behavior,
    transaction history, and identity/onboarding attributes are treated as sensitive
    or high-risk; minimize collection, separate raw signals from derived scores, and
    apply stronger access, notice, retention, and audit controls.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-a4f62a
  fact_id: FACT-20260903-9a1147
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Individual payers, sellers, and contractors have full access/correction/deletion
    workflows for their risk data.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-8dcd30
  fact_id: FACT-20260903-575966
  source_id: MSG-20260903-87b877
  relationship: support
  statement: The risk score is fully explainable to individuals and business customers.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-49d4c0
  fact_id: FACT-20260903-62710f
  source_id: MSG-20260903-87b877
  relationship: support
  statement: The combined risk scoring uses notice plus opt-out for certain uses.
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-fc7cf9
  fact_id: FACT-20260903-ebf529
  source_id: MSG-20260903-87b877
  relationship: support
  statement: Legal needs a go/no-go package before engineering freezes the shared
    model and launch plan (launch in ten weeks).
  location: ''
  created_at: '2026-09-03T17:38:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- support_id: SUP-20260903-a32e1f
  fact_id: FACT-20260903-b700e8
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Mosaic Relay plans to combine onboarding information, transaction history,
    device signals, sanctions results, dispute records, and payout behavior to improve
    fraud and risk scoring.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-ee01e1
  fact_id: FACT-20260903-d5d358
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: The risk score would support onboarding, transaction review, payout controls,
    and account deactivation.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-dbb9fa
  fact_id: FACT-20260903-c7a13f
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Engineering proposes a shared data model and a launch in ten weeks.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-0a838b
  fact_id: FACT-20260903-1a7ca2
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Mosaic Relay plans to retain risk events for seven years.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-0d645a
  fact_id: FACT-20260903-0bd88e
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Actors include Mosaic Relay, its business customers, individual payers,
    sellers, contractors, risk vendors, and support teams.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-7ae759
  fact_id: FACT-20260903-c76812
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: The intended data fields and current vendor contracts are known.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-1fc97c
  fact_id: FACT-20260903-ac2225
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Jurisdiction coverage is Global at launch; exact jurisdictions are not
    yet scoped; design must branch for US-only and EU/UK coverage, with Latin America
    assessed before launch.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-fc3a70
  fact_id: FACT-20260903-5c1fe7
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Some risk-event categories are deleted earlier than seven years (e.g.,
    cleared sanctions, resolved disputes).
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-e8f1c1
  fact_id: FACT-20260903-d74251
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: 'Access is least-privilege and role-based: risk ops view scores/reason
    codes; model admins and engineering manage features/models only as needed; support
    sees limited status and approved explanations, not raw sensitive signals; risk
    vendors receive minimum fields under contract; business customers receive only
    decision outcome and required explanation; access is logged, reviewed, and revocable.'
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-e46514
  fact_id: FACT-20260903-cf5b95
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Sanctions results, dispute records, device signals, payout behavior,
    transaction history, and identity/onboarding attributes are treated as sensitive
    or high-risk; minimize collection, separate raw signals from derived scores, and
    apply stronger access, notice, retention, and audit controls.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-3c5352
  fact_id: FACT-20260903-9a1147
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Individual payers, sellers, and contractors have full access/correction/deletion
    workflows for their risk data.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-88f183
  fact_id: FACT-20260903-575966
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: The risk score is fully explainable to individuals and business customers.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-0664db
  fact_id: FACT-20260903-62710f
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: The combined risk scoring uses notice plus opt-out for certain uses.
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-ee3fc2
  fact_id: FACT-20260903-ebf529
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: Legal needs a go/no-go package before engineering freezes the shared
    model and launch plan (launch in ten weeks).
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- support_id: SUP-20260903-912ad1
  fact_id: FACT-20260903-dfbb3b
  source_id: MSG-20260903-17cd1e
  relationship: support
  statement: 'Lawyer decision recorded: do not approve the launch as proposed; approve
    only a gated, purpose-limited launch after jurisdiction scoping, vendor permissions/contracts,
    data minimization and retention limits, least-privilege access, individual rights
    workflows, notices and opt-out, full explanations, human review and automated-decision
    safeguards, and model-governance controls are completed and verified.'
  location: ''
  created_at: '2026-09-03T17:39:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
assumptions:
- assumption_id: ASM-20260903-dd7ff9
  text: Jurisdictions are not yet specified; analysis will differ materially between
    US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:27:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- assumption_id: ASM-20260903-1a79c9
  text: Whether the score produces automated decisions or feeds human review is not
    yet established and drives ADM obligations.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:27:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- assumption_id: ASM-20260903-d475a7
  text: Whether the combined data constitutes a consumer report under FCRA is not
    yet established.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:27:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-ed34fd
- assumption_id: ASM-20260903-8f051a
  text: Whether current vendor contracts permit the secondary combination of data
    into a shared model is not yet established.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:29:06+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cc033d
- assumption_id: ASM-20260903-166e25
  text: Exact launch jurisdictions are not yet specified; analysis must branch between
    US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes, with
    LATAM assessed before launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:31:57+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cd4bee
- assumption_id: ASM-20260903-ddcd2c
  text: Jurisdictions are not yet specified; analysis must branch for US-only and
    EU/UK coverage, with Latin America assessed before launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:32:43+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-72d918
- assumption_id: ASM-20260903-1d8fdc
  text: Whether the risk score drives automated decisions or human-reviewed action
    is not yet determined; this determines whether GDPR Art. 22 / ADM obligations
    apply.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:32:43+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-72d918
- assumption_id: ASM-20260903-eec133
  text: Whether current vendor contracts and data-source permissions permit combining
    data into a shared model is not yet reviewed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:32:43+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-72d918
- assumption_id: ASM-20260903-7db70f
  text: Jurisdiction scope is not yet finalized; analysis must branch for US-only
    and EU/UK coverage, with LATAM assessed before launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:33:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-7ca146
- assumption_id: ASM-20260903-6a4585
  text: The seven-year retention of risk events is subject to earlier deletion for
    cleared sanctions and resolved disputes.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:33:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-7ca146
- assumption_id: ASM-20260903-78d685
  text: The risk score is treated as sensitive/high-risk data requiring stronger controls.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:33:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-7ca146
- assumption_id: ASM-20260903-d70b4e
  text: Analysis branches for US (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22);
    LATAM requires additional analysis if in scope at launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:37:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- assumption_id: ASM-20260903-5de376
  text: The score may drive automated decisions for at least some features; if all
    decisions are human-reviewed, ADM obligations are reduced.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:37:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- assumption_id: ASM-20260903-32ec5c
  text: The combined data could constitute a consumer report under FCRA for eligibility
    purposes.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:37:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- assumption_id: ASM-20260903-7ce476
  text: Mosaic Relay is the controller for the combined model; if business customers
    are controllers of end-user data, notice/rights obligations shift.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:37:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- assumption_id: ASM-20260903-79e587
  text: The seven-year retention is assumed to have a legal basis; not yet confirmed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:37:36+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-07df28
- assumption_id: ASM-20260903-d738a9
  text: Mosaic Relay is a data controller for the combined risk data it processes
    (not solely a processor for business customers).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:38:42+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- assumption_id: ASM-20260903-8a423a
  text: The combined risk data does not constitute a consumer report under FCRA; if
    it does, FCRA adverse-action and permissible-purpose obligations attach.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:38:42+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- assumption_id: ASM-20260903-a40ad1
  text: The risk score is used for fraud and risk management (a legitimate interest
    / operational purpose), not for credit eligibility or employment decisions.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:38:42+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- assumption_id: ASM-20260903-985966
  text: The seven-year retention is not independently justified by a specific legal
    or regulatory requirement.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:38:42+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- assumption_id: ASM-20260903-81e9f3
  text: Business customers are separate controllers of their end-user data, so Mosaic
    Relay needs contractual authority to combine and process that data.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:38:42+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-79fb08
- assumption_id: ASM-20260903-b5a6f7
  text: 'A1: Mosaic Relay is a technology/payments-infrastructure provider, not a
    bank, and does not itself hold deposits or provide deposit accounts.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:39:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- assumption_id: ASM-20260903-e331d2
  text: 'A2: Regulatory classification (money transmission, FCRA consumer-report characterization)
    and partner obligations are material assumptions to surface, not established facts.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:39:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- assumption_id: ASM-20260903-2d3881
  text: 'A3: The combined risk data includes personal data of individuals (payers,
    sellers, contractors) in jurisdictions where privacy regimes apply.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:39:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- assumption_id: ASM-20260903-0bd671
  text: 'A4: The shared model and score are used for the four stated features (onboarding,
    transaction review, payout controls, account deactivation) and not yet for other
    purposes.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:39:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
- assumption_id: ASM-20260903-f1746f
  text: 'A5: The ten-week launch timeline is fixed and legal must deliver a go/no-go
    package before engineering freezes the model and launch plan.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T17:39:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-cbb74a
conflicts: []
actions:
- action_id: ACT-20260903-ef5da5
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T17:27:12+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-0bdc36
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-ed34fd
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:27:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b700e8
    - FACT-20260903-d5d358
    - FACT-20260903-c7a13f
    - FACT-20260903-1a7ca2
    - FACT-20260903-0bd88e
    - FACT-20260903-c76812
    sources: []
    support:
    - SUP-20260903-05ac0c
    - SUP-20260903-0988f4
    - SUP-20260903-5cdda4
    - SUP-20260903-972aea
    - SUP-20260903-63b333
    - SUP-20260903-3e0262
    assumptions:
    - ASM-20260903-dd7ff9
    - ASM-20260903-1a79c9
    - ASM-20260903-d475a7
  source_action_key: chat:RUN-20260903-809bbb:tool:d5e86bea0b17ea2a3a67206d
- action_id: ACT-20260903-8d2dfe
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:27:41+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-5a5a43
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-e4782e
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:27:41+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-f35644
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6bfb2f:answers
- action_id: ACT-20260903-960984
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:27:50+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-6bfb2f:tool:b11e470fe775c41d7bd7b57c
- action_id: ACT-20260903-8d9d07
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:28:03+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-967cb6
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-453d22
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:28:03+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-132b78
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-b348c7:answers
- action_id: ACT-20260903-f0df2b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:28:12+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-b348c7:tool:d044004e7d596247fb20ef18
- action_id: ACT-20260903-520fe2
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:28:30+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-79d2c8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-bd6243
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:28:30+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-ef77b5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c83adc:answers
- action_id: ACT-20260903-f750db
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:28:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-fb3a33
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-accd03
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:28:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-5b6785
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-14ed48:answers
- action_id: ACT-20260903-cc033d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:29:06+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-8f051a
  source_action_key: chat:RUN-20260903-14ed48:tool:f6ad9d63fb32e9ec0c9dcf8d
- action_id: ACT-20260903-b2d6ea
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:29:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a7ea81
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-418100
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:29:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-850e5a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c7c55d:answers
- action_id: ACT-20260903-b7b0a8
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:29:42+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-facf50
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-8ac9f0
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:29:42+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-8734a6
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-31fc32:answers
- action_id: ACT-20260903-7d7d8f
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:30:05+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-dbf6d0
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-d3c8db
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:30:05+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-09b0c9
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-58a8b9:answers
- action_id: ACT-20260903-42dda9
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:30:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-b9c232
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-27e37d
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:30:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-498c30
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9b4c42:answers
- action_id: ACT-20260903-ea18a6
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:30:43+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-9b4c42:tool:1c4c193e092f3604e95c9386
- action_id: ACT-20260903-86af35
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:31:07+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-d19659
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-a88644
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:31:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-16a974
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-fa406c:answers
- action_id: ACT-20260903-22bf66
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:31:19+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-fa406c:tool:0bf75442ddebedab820ed417
- action_id: ACT-20260903-6a4988
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:31:46+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-61d821
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-a9a5f8
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:31:46+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7e7b52
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-f623d8:answers
- action_id: ACT-20260903-cd4bee
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:31:57+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-166e25
  source_action_key: chat:RUN-20260903-f623d8:tool:3523b82231900e06a489c564
- action_id: ACT-20260903-96c965
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:32:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-fc1c33
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c63e47
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:32:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-4bba53
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-17235d:answers
- action_id: ACT-20260903-72d918
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:32:43+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-ddcd2c
    - ASM-20260903-1d8fdc
    - ASM-20260903-eec133
  source_action_key: chat:RUN-20260903-17235d:tool:a7af7d4928c122505f4bb7aa
- action_id: ACT-20260903-b349f1
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:33:07+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-61d532
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-0ccc35
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T17:33:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-7acca2
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-02b6e4:answers
- action_id: ACT-20260903-7ca146
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:33:26+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-7db70f
    - ASM-20260903-6a4585
    - ASM-20260903-78d685
  source_action_key: chat:RUN-20260903-02b6e4:tool:4f0ef20506b30f262743cb46
- action_id: ACT-20260903-c34640
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:37:35+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-cc997a
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-07df28
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:37:36+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-ac2225
    - FACT-20260903-5c1fe7
    - FACT-20260903-d74251
    - FACT-20260903-cf5b95
    - FACT-20260903-9a1147
    - FACT-20260903-575966
    - FACT-20260903-62710f
    - FACT-20260903-ebf529
    sources: []
    support:
    - SUP-20260903-e907c4
    - SUP-20260903-377413
    - SUP-20260903-45e7e2
    - SUP-20260903-6b2b02
    - SUP-20260903-8f5cd6
    - SUP-20260903-f58968
    - SUP-20260903-325a12
    - SUP-20260903-3f5fb6
    - SUP-20260903-6c8ce9
    - SUP-20260903-80f519
    - SUP-20260903-9e1ea9
    - SUP-20260903-53a4e1
    assumptions:
    - ASM-20260903-d70b4e
    - ASM-20260903-5de376
    - ASM-20260903-32ec5c
    - ASM-20260903-7ce476
    - ASM-20260903-79e587
  source_action_key: chat:RUN-20260903-f7c5da:tool:98f242928db1f515575b1323
- action_id: ACT-20260903-550b00
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:38:42+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-87b877
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-79fb08
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:38:42+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support:
    - SUP-20260903-7dcc8a
    - SUP-20260903-94e176
    - SUP-20260903-9aab77
    - SUP-20260903-30a472
    - SUP-20260903-97b0b2
    - SUP-20260903-942f72
    - SUP-20260903-490a5d
    - SUP-20260903-2c57b2
    - SUP-20260903-38084f
    - SUP-20260903-f32b18
    - SUP-20260903-a4f62a
    - SUP-20260903-8dcd30
    - SUP-20260903-49d4c0
    - SUP-20260903-fc7cf9
    assumptions:
    - ASM-20260903-d738a9
    - ASM-20260903-8a423a
    - ASM-20260903-a40ad1
    - ASM-20260903-985966
    - ASM-20260903-81e9f3
  source_action_key: chat:RUN-20260903-83b2bd:tool:c8d1a3b7c68e9983026e89f7
- action_id: ACT-20260903-c75dfe
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T17:39:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-17cd1e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-cbb74a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T17:39:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-dfbb3b
    sources: []
    support:
    - SUP-20260903-a32e1f
    - SUP-20260903-ee01e1
    - SUP-20260903-dbb9fa
    - SUP-20260903-0a838b
    - SUP-20260903-0d645a
    - SUP-20260903-7ae759
    - SUP-20260903-1fc97c
    - SUP-20260903-fc3a70
    - SUP-20260903-e8f1c1
    - SUP-20260903-e46514
    - SUP-20260903-3c5352
    - SUP-20260903-88f183
    - SUP-20260903-0664db
    - SUP-20260903-ee3fc2
    - SUP-20260903-912ad1
    assumptions:
    - ASM-20260903-b5a6f7
    - ASM-20260903-e331d2
    - ASM-20260903-2d3881
    - ASM-20260903-0bd671
    - ASM-20260903-f1746f
  source_action_key: chat:RUN-20260903-e8b394:tool:649f4dc72e2a709c5b5d9c2f
working_ask: 'Mosaic Relay wants to combine onboarding information, transaction history,
  device signals, sanctions results, dispute records, and payout behavior to improve
  fraud and risk scoring, supporting onboarding, transaction review, payout controls,
  and account deactivation. Legal must produce a go/no-go package before engineering
  freezes the shared model and launch plan (launch in ten weeks). Lawyer decision
  recorded: do not approve the launch as proposed; approve only a gated, purpose-limited
  launch after jurisdiction scoping, vendor permissions/contracts, data minimization
  and retention limits, least-privilege access, individual rights workflows, notices
  and opt-out, full explanations, human review and automated-decision safeguards,
  and model-governance controls are completed and verified.'
issues:
- Distinguishing permitted operational use from secondary use of combined risk data
- Automated decision-making / profiling obligations (GDPR Art. 22, CCPA/CPRA, state
  ADM laws) depending on whether the score drives automated vs. human-reviewed decisions
- Data-source permissions and vendor contract scope for combining data into a shared
  model
- Retention of risk events for seven years vs. data minimization and deletion obligations,
  with earlier deletion for cleared sanctions and resolved disputes
- Access controls and role-based limits across support teams, risk vendors, and business
  customers
- Individual rights workflows (access, correction, deletion, opt-out) for payers,
  sellers, contractors
- Model explainability and governance for the risk score
- Customer instructions/notices and consent or opt-out steps
- Whether the combined data constitutes a consumer report under FCRA
- Controller relationship for business customers' end-user data
open_questions:
- 'M3: What are the exact jurisdictions covered at launch and in the near term?'
- 'M4: Does the combined risk data constitute a consumer report under FCRA, triggering
  FCRA obligations?'
- 'M5: What is the controller relationship for business customers'' end-user data
  (who is controller vs. processor)?'
public_research_questions:
- What are the FCRA consumer-report and adverse-action obligations for a combined
  fraud/risk scoring model used for onboarding, transaction review, payout controls,
  and account deactivation?
- What are the GDPR Art. 22 and CCPA/CPRA automated-decision-making and profiling
  obligations for a risk score used across these four use cases?
- What are the data minimization, storage limitation, and individual-rights obligations
  under GDPR/CCPA for a seven-year retention of combined risk data?
intake_answers:
- answer_id: ANS-20260903-fcf0ae
  question_id: jurisdictions
  question: Which jurisdictions will the risk-scoring program cover at launch and
    in the near term? This drives which privacy regimes (GDPR Art. 22, CCPA/CPRA,
    LATAM laws) apply.
  answer: Global / not yet scoped
  values:
  - global
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-5a5a43
  source_action_key: chat:RUN-20260903-6bfb2f
  answered_at: '2026-09-03T17:27:41+00:00'
  answer_fact_id: FACT-20260903-f35644
- answer_id: ANS-20260903-051436
  question_id: automated_decisions
  question: Does the risk score drive automated decisions, or does a human review
    before action? (This may differ by use case — onboarding, transaction review,
    payout controls, account deactivation.)
  answer: Not yet determined
  values:
  - undetermined
  status: answered
  record_target: fact
  source_id: MSG-20260903-967cb6
  source_action_key: chat:RUN-20260903-b348c7
  answered_at: '2026-09-03T17:28:03+00:00'
  answer_fact_id: FACT-20260903-132b78
- answer_id: ANS-20260903-eb7f9d
  question_id: vendor_contracts
  question: Do the current vendor contracts and data-source permissions permit combining
    this data into a shared risk model?
  answer: Not yet reviewed / unknown
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260903-79d2c8
  source_action_key: chat:RUN-20260903-c83adc
  answered_at: '2026-09-03T17:28:30+00:00'
  answer_fact_id: FACT-20260903-ef77b5
- answer_id: ANS-20260903-35dc65
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260903-fb3a33
  source_action_key: chat:RUN-20260903-14ed48
  answered_at: '2026-09-03T17:28:48+00:00'
  answer_fact_id: FACT-20260903-5b6785
- answer_id: ANS-20260903-e33846
  question_id: retention_exceptions
  question: Are there deletion exceptions to the seven-year retention of risk events
    (e.g., cleared sanctions hits, resolved disputes, data subject to deletion requests)?
  answer: Some categories deleted earlier (e.g., cleared sanctions, resolved disputes)
  values:
  - some_exceptions
  status: answered
  record_target: fact
  source_id: MSG-20260903-a7ea81
  source_action_key: chat:RUN-20260903-c7c55d
  answered_at: '2026-09-03T17:29:21+00:00'
  answer_fact_id: FACT-20260903-850e5a
- answer_id: ANS-20260903-0ce2ba
  question_id: intake-recovery-missing-fact-dbed23eb57
  question: Jurisdiction coverage at launch and near term
  answer: Global at launch; exact jurisdictions are not yet scoped. Design must branch
    for US-only and EU/UK coverage, with Latin America assessed before launch.
  values:
  - Global at launch; exact jurisdictions are not yet scoped. Design must branch for
    US-only and EU/UK coverage, with Latin America assessed before launch.
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-facf50
  source_action_key: chat:RUN-20260903-31fc32
  answered_at: '2026-09-03T17:29:42+00:00'
  answer_fact_id: FACT-20260903-8734a6
- answer_id: ANS-20260903-97487b
  question_id: intake-recovery-missing-fact-8b6b822141
  question: Access roles for the shared risk model and score
  answer: 'Least privilege with role-based access: risk operations may view scores
    and reason codes; model administrators and engineering may manage features and
    models only as needed; support sees limited status and approved explanations,
    not raw sensitive signals; risk vendors receive only minimum fields under contract;
    business customers receive only the decision outcome and required explanation.
    Log, review, and revoke access.'
  values:
  - 'Least privilege with role-based access: risk operations may view scores and reason
    codes; model administrators and engineering may manage features and models only
    as needed; support sees limited status and approved explanations, not raw sensitive
    signals; risk vendors receive only minimum fields under contract; business customers
    receive only the decision outcome and required explanation. Log, review, and revoke
    access.'
  status: answered
  record_target: fact
  source_id: MSG-20260903-dbf6d0
  source_action_key: chat:RUN-20260903-58a8b9
  answered_at: '2026-09-03T17:30:05+00:00'
  answer_fact_id: FACT-20260903-09b0c9
- answer_id: ANS-20260903-916db1
  question_id: intake-recovery-missing-fact-85fb740029
  question: Which data fields are sensitive
  answer: Treat sanctions results, dispute records, device signals, payout behavior,
    transaction history, and identity or onboarding attributes as sensitive or high-risk.
    Minimize collection, separate raw signals from derived scores, and apply stronger
    access, notice, retention, and audit controls.
  values:
  - Treat sanctions results, dispute records, device signals, payout behavior, transaction
    history, and identity or onboarding attributes as sensitive or high-risk. Minimize
    collection, separate raw signals from derived scores, and apply stronger access,
    notice, retention, and audit controls.
  status: answered
  record_target: fact
  source_id: MSG-20260903-b9c232
  source_action_key: chat:RUN-20260903-9b4c42
  answered_at: '2026-09-03T17:30:32+00:00'
  answer_fact_id: FACT-20260903-498c30
- answer_id: ANS-20260903-d9172c
  question_id: rights_workflows
  question: Should individual payers, sellers, and contractors be able to access,
    correct, or delete their risk data, and how?
  answer: Full access/correction/deletion workflows for individuals
  values:
  - full_rights
  status: answered
  record_target: fact
  source_id: MSG-20260903-d19659
  source_action_key: chat:RUN-20260903-fa406c
  answered_at: '2026-09-03T17:31:07+00:00'
  answer_fact_id: FACT-20260903-16a974
- answer_id: ANS-20260903-d98896
  question_id: q_explainability
  question: Should the risk score be explainable to individuals and to business customers,
    and to what degree?
  answer: Full explanation to individuals and business customers
  values:
  - full_individual
  status: answered
  record_target: fact
  source_id: MSG-20260903-61d821
  source_action_key: chat:RUN-20260903-f623d8
  answered_at: '2026-09-03T17:31:46+00:00'
  answer_fact_id: FACT-20260903-7e7b52
- answer_id: ANS-20260903-96e8d9
  question_id: notices_optout
  question: What notices, consent, or opt-out steps should apply to the combined risk
    scoring?
  answer: Notice plus opt-out for certain uses
  values:
  - notice_optout
  status: answered
  record_target: fact
  source_id: MSG-20260903-fc1c33
  source_action_key: chat:RUN-20260903-17235d
  answered_at: '2026-09-03T17:32:32+00:00'
  answer_fact_id: FACT-20260903-4bba53
- answer_id: ANS-20260903-738700
  question_id: intake-recovery-missing-fact-eba62b8046
  question: When the business needs the legal answer relative to the ten-week launch
  answer: Before the planned launch in ten weeks. Legal needs a go/no-go package before
    engineering freezes the shared model and launch plan.
  values:
  - Before the planned launch in ten weeks. Legal needs a go/no-go package before
    engineering freezes the shared model and launch plan.
  status: answered
  record_target: fact
  source_id: MSG-20260903-61d532
  source_action_key: chat:RUN-20260903-02b6e4
  answered_at: '2026-09-03T17:33:07+00:00'
  answer_fact_id: FACT-20260903-7acca2
intake_state: complete
---
# Known Facts

- Mosaic Relay plans to combine onboarding information, transaction history, device signals, sanctions results, dispute records, and payout behavior to improve fraud and risk scoring.
- The risk score would support onboarding, transaction review, payout controls, and account deactivation.
- Engineering proposes a shared data model and a launch in ten weeks.
- Mosaic Relay plans to retain risk events for seven years.
- Actors include Mosaic Relay, its business customers, individual payers, sellers, contractors, risk vendors, and support teams.
- The intended data fields and current vendor contracts are known.
- Which jurisdictions will the risk-scoring program cover at launch and in the near term? This drives which privacy regimes (GDPR Art. 22, CCPA/CPRA, LATAM laws) apply. — Global / not yet scoped
- Does the risk score drive automated decisions, or does a human review before action? (This may differ by use case — onboarding, transaction review, payout controls, account deactivation.) — Not yet determined
- Do the current vendor contracts and data-source permissions permit combining this data into a shared risk model? — Not yet reviewed / unknown
- When does the business need the legal answer? — Before a planned launch
- Are there deletion exceptions to the seven-year retention of risk events (e.g., cleared sanctions hits, resolved disputes, data subject to deletion requests)? — Some categories deleted earlier (e.g., cleared sanctions, resolved disputes)
- Jurisdiction coverage at launch and near term — Global at launch; exact jurisdictions are not yet scoped. Design must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- Access roles for the shared risk model and score — Least privilege with role-based access: risk operations may view scores and reason codes; model administrators and engineering may manage features and models only as needed; support sees limited status and approved explanations, not raw sensitive signals; risk vendors receive only minimum fields under contract; business customers receive only the decision outcome and required explanation. Log, review, and revoke access.
- Which data fields are sensitive — Treat sanctions results, dispute records, device signals, payout behavior, transaction history, and identity or onboarding attributes as sensitive or high-risk. Minimize collection, separate raw signals from derived scores, and apply stronger access, notice, retention, and audit controls.
- Should individual payers, sellers, and contractors be able to access, correct, or delete their risk data, and how? — Full access/correction/deletion workflows for individuals
- Should the risk score be explainable to individuals and to business customers, and to what degree? — Full explanation to individuals and business customers
- What notices, consent, or opt-out steps should apply to the combined risk scoring? — Notice plus opt-out for certain uses
- When the business needs the legal answer relative to the ten-week launch — Before the planned launch in ten weeks. Legal needs a go/no-go package before engineering freezes the shared model and launch plan.
- Jurisdiction coverage is Global at launch; exact jurisdictions are not yet scoped; design must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- Some risk-event categories are deleted earlier than seven years (e.g., cleared sanctions, resolved disputes).
- Access is least-privilege and role-based: risk ops view scores/reason codes; model admins and engineering manage features/models only as needed; support sees limited status and approved explanations, not raw sensitive signals; risk vendors receive minimum fields under contract; business customers receive only decision outcome and required explanation; access is logged, reviewed, and revocable.
- Sanctions results, dispute records, device signals, payout behavior, transaction history, and identity/onboarding attributes are treated as sensitive or high-risk; minimize collection, separate raw signals from derived scores, and apply stronger access, notice, retention, and audit controls.
- Individual payers, sellers, and contractors have full access/correction/deletion workflows for their risk data.
- The risk score is fully explainable to individuals and business customers.
- The combined risk scoring uses notice plus opt-out for certain uses.
- Legal needs a go/no-go package before engineering freezes the shared model and launch plan (launch in ten weeks).
- Lawyer decision recorded: do not approve the launch as proposed; approve only a gated, purpose-limited launch after jurisdiction scoping, vendor permissions/contracts, data minimization and retention limits, least-privilege access, individual rights workflows, notices and opt-out, full explanations, human review and automated-decision safeguards, and model-governance controls are completed and verified.

## Assumptions

- [Assumption] Jurisdictions are not yet specified; analysis will differ materially between US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes.
- [Assumption] Whether the score produces automated decisions or feeds human review is not yet established and drives ADM obligations.
- [Assumption] Whether the combined data constitutes a consumer report under FCRA is not yet established.
- [Assumption] Whether current vendor contracts permit the secondary combination of data into a shared model is not yet established.
- [Assumption] Exact launch jurisdictions are not yet specified; analysis must branch between US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes, with LATAM assessed before launch.
- [Assumption] Jurisdictions are not yet specified; analysis must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- [Assumption] Whether the risk score drives automated decisions or human-reviewed action is not yet determined; this determines whether GDPR Art. 22 / ADM obligations apply.
- [Assumption] Whether current vendor contracts and data-source permissions permit combining data into a shared model is not yet reviewed.
- [Assumption] Jurisdiction scope is not yet finalized; analysis must branch for US-only and EU/UK coverage, with LATAM assessed before launch.
- [Assumption] The seven-year retention of risk events is subject to earlier deletion for cleared sanctions and resolved disputes.
- [Assumption] The risk score is treated as sensitive/high-risk data requiring stronger controls.
- [Assumption] Analysis branches for US (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22); LATAM requires additional analysis if in scope at launch.
- [Assumption] The score may drive automated decisions for at least some features; if all decisions are human-reviewed, ADM obligations are reduced.
- [Assumption] The combined data could constitute a consumer report under FCRA for eligibility purposes.
- [Assumption] Mosaic Relay is the controller for the combined model; if business customers are controllers of end-user data, notice/rights obligations shift.
- [Assumption] The seven-year retention is assumed to have a legal basis; not yet confirmed.
- [Assumption] Mosaic Relay is a data controller for the combined risk data it processes (not solely a processor for business customers).
- [Assumption] The combined risk data does not constitute a consumer report under FCRA; if it does, FCRA adverse-action and permissible-purpose obligations attach.
- [Assumption] The risk score is used for fraud and risk management (a legitimate interest / operational purpose), not for credit eligibility or employment decisions.
- [Assumption] The seven-year retention is not independently justified by a specific legal or regulatory requirement.
- [Assumption] Business customers are separate controllers of their end-user data, so Mosaic Relay needs contractual authority to combine and process that data.
- [Assumption] A1: Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not itself hold deposits or provide deposit accounts.
- [Assumption] A2: Regulatory classification (money transmission, FCRA consumer-report characterization) and partner obligations are material assumptions to surface, not established facts.
- [Assumption] A3: The combined risk data includes personal data of individuals (payers, sellers, contractors) in jurisdictions where privacy regimes apply.
- [Assumption] A4: The shared model and score are used for the four stated features (onboarding, transaction review, payout controls, account deactivation) and not yet for other purposes.
- [Assumption] A5: The ten-week launch timeline is fixed and legal must deliver a go/no-go package before engineering freezes the model and launch plan.
