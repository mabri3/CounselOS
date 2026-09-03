---
matter_id: MAT-20260903-567673
record_type: facts
facts:
- fact_id: FACT-20260903-b90ba5
  text: Mosaic Relay wants to help marketplaces pay sellers and contractors by automatically
    assigning recipients to payout tiers.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-bd39be
  text: The proposed system uses identity-verification results, sanctions-screening
    status, transaction history, country, payout amount, and risk score to decide
    whether to release a payout immediately, require additional information, or send
    the payout to review.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-e233b9
  text: The recipient would see a status message and a request for documents when
    needed.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-2c1985
  text: Actors are sellers, contractors, marketplace customers, Mosaic Relay compliance
    and operations, identity and fraud vendors, and payout processors.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-7d0108
  text: Product wants to test this with three customers next quarter.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-fa5b7a
  text: The system may include individuals and small businesses as recipients.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-9b4e11
  text: Some recipients may be outside the United States.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-c56fa4
  text: The team has not determined whether a rejected payout is a compliance block,
    a fraud control, or a customer-directed decision.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-cf6578
  text: The explanation shown to recipients, human-review standard, correction process,
    retention period, and treatment of funds during review are not settled.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-c0c370
  text: The data fields used in the model and how often decisions are re-evaluated
    are not known.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- fact_id: FACT-20260903-01265a
  text: What is the nature of a rejected payout in this system? This determines which
    legal framework applies — a compliance block (OFAC/BSA-AML), a fraud control,
    or a customer-directed decision. — A mix of these depending on the trigger
  status: active
  material: true
  source_ids:
  - MSG-20260903-a7c4f7
  supersedes: null
  created_at: '2026-09-03T09:53:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-691ec4
- fact_id: FACT-20260903-cc1b68
  text: Which data fields will the model use, and how often are payout decisions re-evaluated
    over time? — Not yet finalized. The proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score. Before the pilot, Product and Compliance must document the complete
    field list, source and purpose for each field, thresholds, re-evaluation triggers
    and frequency, manual overrides, model/version history, access, retention, and
    a process to test for disparate impact. Do not use a proxy for a protected trait
    without a documented necessity and review.
  status: active
  material: true
  source_ids:
  - MSG-20260903-17e60b
  supersedes: null
  created_at: '2026-09-03T09:54:25+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c05ed1
- fact_id: FACT-20260903-bf07c5
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260903-609af8
  supersedes: null
  created_at: '2026-09-03T09:54:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-ab4216
- fact_id: FACT-20260903-41cdd8
  text: A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud control,
    and customer-directed decision depending on the trigger.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- fact_id: FACT-20260903-22fbed
  text: The model field list is not yet finalized; proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score. Before the pilot, Product and Compliance must document the complete
    field list, source and purpose per field, thresholds, re-evaluation triggers/frequency,
    manual overrides, model/version history, access, retention, and a disparate-impact
    testing process. No proxy for a protected trait without documented necessity and
    review.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- fact_id: FACT-20260903-9d6c4f
  text: The business needs the legal answer before a planned launch (no specific date
    given).
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- fact_id: FACT-20260903-d68c1c
  text: How are funds treated while a payout is under review? — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-95534c
  supersedes: null
  created_at: '2026-09-03T09:55:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-5c9ebe
- fact_id: FACT-20260903-59cae6
  text: How funds are treated while a payout is under review is not yet determined.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- fact_id: FACT-20260903-9103bd
  text: What explanation will a restricted recipient see, and what correction/appeal
    route will they have? — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-1ae53e
  supersedes: null
  created_at: '2026-09-03T09:56:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-bc3042
- fact_id: FACT-20260903-83478e
  text: Which countries are the non-U.S. recipients in? — Not yet identified. The
    pilot must list every recipient country and processor before launch, then map
    transfer, sanctions, privacy, localization, and payout rules by country. Use a
    U.S.-primary assumption only for this first pass, and treat all non-U.S. coverage
    as an unverified lead until confirmed.
  status: active
  material: true
  source_ids:
  - MSG-20260903-c68b65
  supersedes: null
  created_at: '2026-09-03T09:57:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-57daa7
- fact_id: FACT-20260903-e3e14e
  text: The model field list is not yet finalized; proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- fact_id: FACT-20260903-65cee5
  text: The explanation shown to restricted recipients and their correction/appeal
    route are not yet determined.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- fact_id: FACT-20260903-2d3743
  text: The non-U.S. recipient countries are not yet identified; use a U.S.-primary
    assumption for this first pass and treat all non-U.S. coverage as an unverified
    lead until confirmed.
  status: active
  material: true
  source_ids:
  - REQ-20260903-d7e5df
  supersedes: null
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- fact_id: FACT-20260903-522dcb
  text: Can marketplace customers direct payout outcomes, or is the decision solely
    Mosaic Relay's? — Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-da21b5
  supersedes: null
  created_at: '2026-09-03T09:58:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-9bf9ad
- fact_id: FACT-20260903-2903b8
  text: Who owns the human-review standard and override authority for the pilot? —
    Not yet determined
  status: active
  material: true
  source_ids:
  - MSG-20260903-285bb7
  supersedes: null
  created_at: '2026-09-03T09:58:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-01d2e6
- fact_id: FACT-20260903-12770b
  text: What is the target launch date for the pilot? — Next quarter is the only timing
    provided. No specific launch date is set. Set a date before launch and schedule
    legal, compliance, model-risk, privacy, and operations review before that date.
  status: active
  material: true
  source_ids:
  - MSG-20260903-a8572d
  supersedes: null
  created_at: '2026-09-03T09:59:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-278a53
sources:
- source_id: REQ-20260903-d7e5df
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-08-automated-recipient-payout-decisions-567673/request.md
  version: ''
  location: ''
  created_at: '2026-09-03T09:52:02+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f34e89
- source_id: MSG-20260903-a7c4f7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:53:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-f65afc
- source_id: MSG-20260903-17e60b
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:54:25+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7581b5
- source_id: MSG-20260903-609af8
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:54:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-a30228
- source_id: MSG-20260903-95534c
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:55:39+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-29866a
- source_id: MSG-20260903-1ae53e
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:56:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-abd406
- source_id: MSG-20260903-c68b65
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:57:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7d2cc7
- source_id: MSG-20260903-da21b5
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:58:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-7a8d55
- source_id: MSG-20260903-285bb7
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:58:34+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-4a4abb
- source_id: MSG-20260903-a8572d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-03T09:59:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-1f2f40
support:
- support_id: SUP-20260903-35efd7
  fact_id: FACT-20260903-b90ba5
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Mosaic Relay wants to help marketplaces pay sellers and contractors by
    automatically assigning recipients to payout tiers.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-c3e012
  fact_id: FACT-20260903-bd39be
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The proposed system uses identity-verification results, sanctions-screening
    status, transaction history, country, payout amount, and risk score to decide
    whether to release a payout immediately, require additional information, or send
    the payout to review.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-8b832e
  fact_id: FACT-20260903-e233b9
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The recipient would see a status message and a request for documents
    when needed.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-13935c
  fact_id: FACT-20260903-2c1985
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Actors are sellers, contractors, marketplace customers, Mosaic Relay
    compliance and operations, identity and fraud vendors, and payout processors.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-255cb0
  fact_id: FACT-20260903-7d0108
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Product wants to test this with three customers next quarter.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-681820
  fact_id: FACT-20260903-fa5b7a
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The system may include individuals and small businesses as recipients.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-b4087a
  fact_id: FACT-20260903-9b4e11
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Some recipients may be outside the United States.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-ed9f64
  fact_id: FACT-20260903-c56fa4
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The team has not determined whether a rejected payout is a compliance
    block, a fraud control, or a customer-directed decision.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-81c44b
  fact_id: FACT-20260903-cf6578
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The explanation shown to recipients, human-review standard, correction
    process, retention period, and treatment of funds during review are not settled.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-ed6438
  fact_id: FACT-20260903-c0c370
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The data fields used in the model and how often decisions are re-evaluated
    are not known.
  location: ''
  created_at: '2026-09-03T09:52:26+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- support_id: SUP-20260903-c7c576
  fact_id: FACT-20260903-b90ba5
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Mosaic Relay wants to help marketplaces pay sellers and contractors by
    automatically assigning recipients to payout tiers.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-16153c
  fact_id: FACT-20260903-bd39be
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The proposed system uses identity-verification results, sanctions-screening
    status, transaction history, country, payout amount, and risk score to decide
    whether to release a payout immediately, require additional information, or send
    the payout to review.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-9d80eb
  fact_id: FACT-20260903-e233b9
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The recipient would see a status message and a request for documents
    when needed.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-74022a
  fact_id: FACT-20260903-2c1985
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Actors are sellers, contractors, marketplace customers, Mosaic Relay
    compliance and operations, identity and fraud vendors, and payout processors.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-8e6f92
  fact_id: FACT-20260903-7d0108
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Product wants to test this with three customers next quarter.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-789c7b
  fact_id: FACT-20260903-fa5b7a
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The system may include individuals and small businesses as recipients.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-25db96
  fact_id: FACT-20260903-9b4e11
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Some recipients may be outside the United States.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-5d15b4
  fact_id: FACT-20260903-41cdd8
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud
    control, and customer-directed decision depending on the trigger.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-a358de
  fact_id: FACT-20260903-22fbed
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The model field list is not yet finalized; proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score. Before the pilot, Product and Compliance must document the complete
    field list, source and purpose per field, thresholds, re-evaluation triggers/frequency,
    manual overrides, model/version history, access, retention, and a disparate-impact
    testing process. No proxy for a protected trait without documented necessity and
    review.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-3652de
  fact_id: FACT-20260903-9d6c4f
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The business needs the legal answer before a planned launch (no specific
    date given).
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-9083a4
  fact_id: FACT-20260903-cf6578
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The explanation shown to recipients, human-review standard, correction
    process, retention period, and treatment of funds during review are not settled.
  location: ''
  created_at: '2026-09-03T09:55:05+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-b23938
- support_id: SUP-20260903-ba2e3b
  fact_id: FACT-20260903-b90ba5
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Mosaic Relay wants to help marketplaces pay sellers and contractors by
    automatically assigning recipients to payout tiers.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-c95cd9
  fact_id: FACT-20260903-bd39be
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The proposed system uses identity-verification results, sanctions-screening
    status, transaction history, country, payout amount, and risk score to decide
    whether to release a payout immediately, require additional information, or send
    the payout to review.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-fc3aa5
  fact_id: FACT-20260903-e233b9
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The recipient would see a status message and a request for documents
    when needed.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-e9ed03
  fact_id: FACT-20260903-2c1985
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Actors are sellers, contractors, marketplace customers, Mosaic Relay
    compliance and operations, identity and fraud vendors, and payout processors.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-1bdcc6
  fact_id: FACT-20260903-7d0108
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Product wants to test this with three customers next quarter.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-7d2022
  fact_id: FACT-20260903-fa5b7a
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The system may include individuals and small businesses as recipients.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-66f720
  fact_id: FACT-20260903-9b4e11
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Some recipients may be outside the United States.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-dfec3b
  fact_id: FACT-20260903-41cdd8
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud
    control, and customer-directed decision depending on the trigger.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-47a17f
  fact_id: FACT-20260903-22fbed
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The model field list is not yet finalized; proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score. Before the pilot, Product and Compliance must document the complete
    field list, source and purpose per field, thresholds, re-evaluation triggers/frequency,
    manual overrides, model/version history, access, retention, and a disparate-impact
    testing process. No proxy for a protected trait without documented necessity and
    review.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-06a8cf
  fact_id: FACT-20260903-9d6c4f
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The business needs the legal answer before a planned launch (no specific
    date given).
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-6fd29b
  fact_id: FACT-20260903-59cae6
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: How funds are treated while a payout is under review is not yet determined.
  location: ''
  created_at: '2026-09-03T09:55:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-023161
- support_id: SUP-20260903-e5777d
  fact_id: FACT-20260903-b90ba5
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Mosaic Relay wants to help marketplaces pay sellers and contractors by
    automatically assigning recipients to payout tiers.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-c43612
  fact_id: FACT-20260903-bd39be
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The proposed system uses identity-verification results, sanctions-screening
    status, transaction history, country, payout amount, and risk score to decide
    whether to release a payout immediately, require additional information, or send
    the payout to review.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-70ccfe
  fact_id: FACT-20260903-e233b9
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The recipient would see a status message and a request for documents
    when needed.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-5d66e2
  fact_id: FACT-20260903-7d0108
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Product wants to test this with three customers next quarter.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-542288
  fact_id: FACT-20260903-fa5b7a
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The system may include individuals and small businesses as recipients.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-779aa2
  fact_id: FACT-20260903-9b4e11
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: Some recipients may be outside the United States.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-1541cb
  fact_id: FACT-20260903-41cdd8
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud
    control, and customer-directed decision depending on the trigger.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-b7fb23
  fact_id: FACT-20260903-e3e14e
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The model field list is not yet finalized; proposed fields are identity-verification
    result, sanctions-screening status, transaction history, country, payout amount,
    and risk score.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-a9cffe
  fact_id: FACT-20260903-9d6c4f
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The business needs the legal answer before a planned launch (no specific
    date given).
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-82c402
  fact_id: FACT-20260903-59cae6
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: How funds are treated while a payout is under review is not yet determined.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-ef4124
  fact_id: FACT-20260903-65cee5
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The explanation shown to restricted recipients and their correction/appeal
    route are not yet determined.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
- support_id: SUP-20260903-1e8752
  fact_id: FACT-20260903-2d3743
  source_id: REQ-20260903-d7e5df
  relationship: support
  statement: The non-U.S. recipient countries are not yet identified; use a U.S.-primary
    assumption for this first pass and treat all non-U.S. coverage as an unverified
    lead until confirmed.
  location: ''
  created_at: '2026-09-03T09:57:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260903-072576
assumptions:
- assumption_id: ASM-20260903-2d48d2
  text: U.S.-primary scope for the pilot; any non-U.S. recipient materially changes
    data-protection and sanctions obligations and requires separate review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:52:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- assumption_id: ASM-20260903-4a20be
  text: Mosaic Relay's baseline KYB/KYC, sanctions screening, and BSA/AML obligations
    from prior matters (Matter 01) apply to recipients as they do to merchants.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:52:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- assumption_id: ASM-20260903-52f299
  text: Sanctions screening is a mandatory, non-tierable gate before any payout is
    released, consistent with the baseline framework.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:52:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- assumption_id: ASM-20260903-b31610
  text: The three-customer pilot is a controlled test with defined controls, not a
    full production launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:52:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-c5a91b
- assumption_id: ASM-20260903-586bb6
  text: Because a rejected payout is a mix of triggers, the system must tag each restriction
    with its true basis (compliance vs. fraud vs. customer-directed) so the correct
    notice, review, and escalation path applies.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:53:58+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-a3d6e8
- assumption_id: ASM-20260903-01ae48
  text: U.S.-primary scope; non-U.S. recipients subject to separate review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:55:56+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-023161
- assumption_id: ASM-20260903-46dd37
  text: Baseline KYB/KYC and sanctions-screening obligations carry over to the pilot.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:55:56+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-023161
- assumption_id: ASM-20260903-dacdc0
  text: Sanctions screening is a non-tierable gate (a sanctions hit blocks payout
    regardless of tier).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:55:56+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-023161
- assumption_id: ASM-20260903-16d02e
  text: The pilot is a controlled test with three customers, not a general launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:55:56+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-023161
- assumption_id: ASM-20260903-f4cf8a
  text: The system must tag each restriction with its true basis (compliance vs. fraud
    vs. customer-directed) so the correct notice, review, and escalation path applies.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:55:56+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-023161
- assumption_id: ASM-20260903-70172f
  text: U.S.-primary scope; any non-U.S. expansion subject to separate review.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:56:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-9bfcc2
- assumption_id: ASM-20260903-4860c5
  text: Baseline KYB/KYC, sanctions-screening, and BSA/AML obligations carry over
    to the pilot.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:56:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-9bfcc2
- assumption_id: ASM-20260903-837601
  text: 'Sanctions screening is a non-tierable gate: a confirmed sanctions hit blocks
    payout regardless of tier.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:56:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-9bfcc2
- assumption_id: ASM-20260903-1f956d
  text: The pilot is a controlled test with three customers, not a full production
    launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:56:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-9bfcc2
- assumption_id: ASM-20260903-60cc1c
  text: The system must distinguish the true basis of each restriction (compliance
    vs. fraud vs. customer-directed) rather than treating all rejections alike.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:56:34+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-9bfcc2
- assumption_id: ASM-20260903-ea6c27
  text: U.S.-primary scope for this first pass; all non-U.S. coverage is an unverified
    lead until recipient countries and processors are confirmed.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:57:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-072576
- assumption_id: ASM-20260903-7adc88
  text: Baseline KYB/KYC and sanctions-screening obligations carry over to the payout-tiering
    system.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:57:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-072576
- assumption_id: ASM-20260903-ebb678
  text: 'Sanctions screening is a non-tierable gate: a sanctions hit blocks payout
    regardless of tier, and cannot be overridden by a customer.'
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:57:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-072576
- assumption_id: ASM-20260903-8f2d2f
  text: The pilot is a controlled test with three customers, so controls can be scoped
    to pilot scale but must still be documented and tested.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:57:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-072576
- assumption_id: ASM-20260903-80a72c
  text: The system must tag each restriction with its true basis (compliance, fraud,
    or customer-directed) because each carries different notice and funds-handling
    duties.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:57:21+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-072576
- assumption_id: ASM-20260903-8d6c23
  text: Baseline KYB/KYC and sanctions-screening obligations carry over to the automated
    system.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-746e67
- assumption_id: ASM-20260903-e91a5e
  text: Sanctions screening is a non-tierable gate (a sanctions hit is a block, not
    a tier), separate from fraud/risk tiering.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-746e67
- assumption_id: ASM-20260903-441f78
  text: The pilot is a controlled test with three customers, so controls can be scoped
    to pilot scale but must still be documented and auditable.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-746e67
- assumption_id: ASM-20260903-254e03
  text: Each restriction must be tagged with its true basis (compliance, fraud, or
    customer-directed) because the frameworks differ.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:15+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-746e67
- assumption_id: ASM-20260903-f82cd9
  text: The pilot is a controlled test with a defined customer set and documented
    controls.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-0ea263
- assumption_id: ASM-20260903-d61df2
  text: Mosaic Relay is not a bank or deposit holder and does not hold customer funds.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:58:52+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-0ea263
- assumption_id: ASM-20260903-4493f5
  text: The pilot is a controlled test with a defined customer set, documented controls,
    and review before launch.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:59:50+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-290635
- assumption_id: ASM-20260903-4c1e9f
  text: Each restriction must be tagged with its true basis (compliance, fraud, or
    customer-directed) because the legal framework differs by trigger.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-03T09:59:50+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260903-290635
conflicts: []
actions:
- action_id: ACT-20260903-f34e89
  summary: Linked Original request
  actor: system
  created_at: '2026-09-03T09:52:02+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260903-d7e5df
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c5a91b
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:52:26+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-b90ba5
    - FACT-20260903-bd39be
    - FACT-20260903-e233b9
    - FACT-20260903-2c1985
    - FACT-20260903-7d0108
    - FACT-20260903-fa5b7a
    - FACT-20260903-9b4e11
    - FACT-20260903-c56fa4
    - FACT-20260903-cf6578
    - FACT-20260903-c0c370
    sources: []
    support:
    - SUP-20260903-35efd7
    - SUP-20260903-c3e012
    - SUP-20260903-8b832e
    - SUP-20260903-13935c
    - SUP-20260903-255cb0
    - SUP-20260903-681820
    - SUP-20260903-b4087a
    - SUP-20260903-ed9f64
    - SUP-20260903-81c44b
    - SUP-20260903-ed6438
    assumptions:
    - ASM-20260903-2d48d2
    - ASM-20260903-4a20be
    - ASM-20260903-52f299
    - ASM-20260903-b31610
  source_action_key: chat:RUN-20260903-781d3a:tool:fa63b3336c4074d5047bd090
- action_id: ACT-20260903-f65afc
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:53:39+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a7c4f7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-691ec4
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:53:39+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-01265a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-145789:answers
- action_id: ACT-20260903-a3d6e8
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:53:58+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-586bb6
  source_action_key: chat:RUN-20260903-145789:tool:37db925c4c201ead15133eb2
- action_id: ACT-20260903-7581b5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:54:25+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-17e60b
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-c05ed1
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:54:25+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-cc1b68
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-c95efb:answers
- action_id: ACT-20260903-a30228
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:54:47+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-609af8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-ab4216
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:54:47+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-bf07c5
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-25578a:answers
- action_id: ACT-20260903-b23938
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:55:05+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-41cdd8
    - FACT-20260903-22fbed
    - FACT-20260903-9d6c4f
    sources: []
    support:
    - SUP-20260903-c7c576
    - SUP-20260903-16153c
    - SUP-20260903-9d80eb
    - SUP-20260903-74022a
    - SUP-20260903-8e6f92
    - SUP-20260903-789c7b
    - SUP-20260903-25db96
    - SUP-20260903-5d15b4
    - SUP-20260903-a358de
    - SUP-20260903-3652de
    - SUP-20260903-9083a4
    assumptions: []
  source_action_key: chat:RUN-20260903-692525:tool:e32ca8c983da525d56cdccd2
- action_id: ACT-20260903-29866a
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:55:39+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-95534c
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-5c9ebe
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:55:39+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-d68c1c
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-a3b997:answers
- action_id: ACT-20260903-023161
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:55:56+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-59cae6
    sources: []
    support:
    - SUP-20260903-ba2e3b
    - SUP-20260903-c95cd9
    - SUP-20260903-fc3aa5
    - SUP-20260903-e9ed03
    - SUP-20260903-1bdcc6
    - SUP-20260903-7d2022
    - SUP-20260903-66f720
    - SUP-20260903-dfec3b
    - SUP-20260903-47a17f
    - SUP-20260903-06a8cf
    - SUP-20260903-6fd29b
    assumptions:
    - ASM-20260903-01ae48
    - ASM-20260903-46dd37
    - ASM-20260903-dacdc0
    - ASM-20260903-16d02e
    - ASM-20260903-f4cf8a
  source_action_key: chat:RUN-20260903-62cf1c:tool:5a54a907db85135a536e5b04
- action_id: ACT-20260903-abd406
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:56:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-1ae53e
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-bc3042
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:56:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-9103bd
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-7eea5f:answers
- action_id: ACT-20260903-9bfcc2
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:56:34+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-70172f
    - ASM-20260903-4860c5
    - ASM-20260903-837601
    - ASM-20260903-1f956d
    - ASM-20260903-60cc1c
  source_action_key: chat:RUN-20260903-7eea5f:tool:06c799b7d3f8927744308568
- action_id: ACT-20260903-7d2cc7
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:57:01+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-c68b65
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-57daa7
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:57:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-83478e
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-1a30b4:answers
- action_id: ACT-20260903-072576
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:57:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-e3e14e
    - FACT-20260903-65cee5
    - FACT-20260903-2d3743
    sources: []
    support:
    - SUP-20260903-e5777d
    - SUP-20260903-c43612
    - SUP-20260903-70ccfe
    - SUP-20260903-5d66e2
    - SUP-20260903-542288
    - SUP-20260903-779aa2
    - SUP-20260903-1541cb
    - SUP-20260903-b7fb23
    - SUP-20260903-a9cffe
    - SUP-20260903-82c402
    - SUP-20260903-ef4124
    - SUP-20260903-1e8752
    assumptions:
    - ASM-20260903-ea6c27
    - ASM-20260903-7adc88
    - ASM-20260903-ebb678
    - ASM-20260903-8f2d2f
    - ASM-20260903-80a72c
  source_action_key: chat:RUN-20260903-bd18a9:tool:e09486efb7181d679eb1d06a
- action_id: ACT-20260903-7a8d55
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:58:01+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-da21b5
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-9bf9ad
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:58:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-522dcb
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-796a37:answers
- action_id: ACT-20260903-746e67
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:58:15+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-8d6c23
    - ASM-20260903-e91a5e
    - ASM-20260903-441f78
    - ASM-20260903-254e03
  source_action_key: chat:RUN-20260903-796a37:tool:0a9a11f0de2f796857d5848c
- action_id: ACT-20260903-4a4abb
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:58:34+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-285bb7
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-01d2e6
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:58:34+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-2903b8
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-e4610c:answers
- action_id: ACT-20260903-0ea263
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:58:52+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-f82cd9
    - ASM-20260903-d61df2
  source_action_key: chat:RUN-20260903-e4610c:tool:adade1086f4de4786fbb7d61
- action_id: ACT-20260903-1f2f40
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-03T09:59:17+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260903-a8572d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260903-278a53
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-03T09:59:17+00:00'
  status: applied
  created:
    facts:
    - FACT-20260903-12770b
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260903-761856:answers
- action_id: ACT-20260903-290635
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-03T09:59:50+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260903-4493f5
    - ASM-20260903-4c1e9f
  source_action_key: chat:RUN-20260903-761856:tool:49ee58f496156c5b3e16007b
working_ask: Whether Mosaic Relay may automatically assign recipients (sellers and
  contractors) to payout tiers, and the legal requirements for automated screening
  and payout restrictions, notice and appeal duties, privacy and discrimination risks,
  human oversight, and the minimum controls needed for a three-customer pilot next
  quarter.
issues:
- 'Characterization of a rejected payout: a mix of compliance block (OFAC/BSA-AML),
  fraud control, and customer-directed decision depending on the trigger — each trigger
  carries a different legal framework, notice duty, and funds-handling rule, so the
  system must tag each restriction with its true basis.'
- 'Automated decision-making and notice duties: what explanation must be shown to
  recipients and whether adverse-action or FCRA notice duties attach if the decision
  is eligibility-based.'
- Privacy and data minimization for the model inputs (identity, sanctions, transaction
  history, country, amount, risk score), including retention and cross-border transfer
  for non-U.S. recipients.
- Discrimination and fair-lending/equal-credit risk if model inputs (e.g., country,
  amount, risk score) produce disparate treatment of protected classes.
- 'Human oversight and review standard: what constitutes meaningful human review and
  who owns override authority.'
- Treatment of funds during review and the correction/appeal process for recipients.
open_questions:
- Retention period for model inputs and decision records.
- Which payout processors the pilot will use.
- How the pilot handles small businesses versus individuals differently, if at all.
- The human-review standard and escalation path for a restricted payout.
public_research_questions:
- What are the U.S. notice and adverse-action duties for automated eligibility decisions
  affecting payout of funds (FCRA, ECOA, state money-transmission rules)?
- What are the OFAC and BSA/AML obligations for blocking or delaying payouts to sanctioned
  or unverified recipients?
- What are the data-minimization, retention, and cross-border transfer requirements
  for identity and sanctions data of non-U.S. recipients?
intake_answers:
- answer_id: ANS-20260903-24b4bf
  question_id: q_payout_characterization
  question: What is the nature of a rejected payout in this system? This determines
    which legal framework applies — a compliance block (OFAC/BSA-AML), a fraud control,
    or a customer-directed decision.
  answer: A mix of these depending on the trigger
  values:
  - mixed
  status: answered
  record_target: fact
  source_id: MSG-20260903-a7c4f7
  source_action_key: chat:RUN-20260903-145789
  answered_at: '2026-09-03T09:53:39+00:00'
  answer_fact_id: FACT-20260903-01265a
- answer_id: ANS-20260903-0dfdba
  question_id: model_fields
  question: Which data fields will the model use, and how often are payout decisions
    re-evaluated over time?
  answer: Not yet finalized. The proposed fields are identity-verification result,
    sanctions-screening status, transaction history, country, payout amount, and risk
    score. Before the pilot, Product and Compliance must document the complete field
    list, source and purpose for each field, thresholds, re-evaluation triggers and
    frequency, manual overrides, model/version history, access, retention, and a process
    to test for disparate impact. Do not use a proxy for a protected trait without
    a documented necessity and review.
  values:
  - Not yet finalized. The proposed fields are identity-verification result, sanctions-screening
    status, transaction history, country, payout amount, and risk score. Before the
    pilot, Product and Compliance must document the complete field list, source and
    purpose for each field, thresholds, re-evaluation triggers and frequency, manual
    overrides, model/version history, access, retention, and a process to test for
    disparate impact. Do not use a proxy for a protected trait without a documented
    necessity and review.
  status: answered
  record_target: fact
  source_id: MSG-20260903-17e60b
  source_action_key: chat:RUN-20260903-c95efb
  answered_at: '2026-09-03T09:54:25+00:00'
  answer_fact_id: FACT-20260903-cc1b68
- answer_id: ANS-20260903-840bca
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260903-609af8
  source_action_key: chat:RUN-20260903-25578a
  answered_at: '2026-09-03T09:54:47+00:00'
  answer_fact_id: FACT-20260903-bf07c5
- answer_id: ANS-20260903-04f882
  question_id: funds_treatment
  question: How are funds treated while a payout is under review?
  answer: Not yet determined
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-95534c
  source_action_key: chat:RUN-20260903-a3b997
  answered_at: '2026-09-03T09:55:39+00:00'
  answer_fact_id: FACT-20260903-d68c1c
- answer_id: ANS-20260903-ee5535
  question_id: recipient_notice_appeal
  question: What explanation will a restricted recipient see, and what correction/appeal
    route will they have?
  answer: Not yet determined
  values:
  - undecided
  status: answered
  record_target: fact
  source_id: MSG-20260903-1ae53e
  source_action_key: chat:RUN-20260903-7eea5f
  answered_at: '2026-09-03T09:56:21+00:00'
  answer_fact_id: FACT-20260903-9103bd
- answer_id: ANS-20260903-cc6200
  question_id: q_countries
  question: Which countries are the non-U.S. recipients in?
  answer: Not yet identified. The pilot must list every recipient country and processor
    before launch, then map transfer, sanctions, privacy, localization, and payout
    rules by country. Use a U.S.-primary assumption only for this first pass, and
    treat all non-U.S. coverage as an unverified lead until confirmed.
  values:
  - Not yet identified. The pilot must list every recipient country and processor
    before launch, then map transfer, sanctions, privacy, localization, and payout
    rules by country. Use a U.S.-primary assumption only for this first pass, and
    treat all non-U.S. coverage as an unverified lead until confirmed.
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260903-c68b65
  source_action_key: chat:RUN-20260903-1a30b4
  answered_at: '2026-09-03T09:57:01+00:00'
  answer_fact_id: FACT-20260903-83478e
- answer_id: ANS-20260903-40b30b
  question_id: customer-direction
  question: Can marketplace customers direct payout outcomes, or is the decision solely
    Mosaic Relay's?
  answer: Not yet determined
  values:
  - undetermined
  status: answered
  record_target: fact
  source_id: MSG-20260903-da21b5
  source_action_key: chat:RUN-20260903-796a37
  answered_at: '2026-09-03T09:58:01+00:00'
  answer_fact_id: FACT-20260903-522dcb
- answer_id: ANS-20260903-22858b
  question_id: human_review_owner
  question: Who owns the human-review standard and override authority for the pilot?
  answer: Not yet determined
  values:
  - undetermined
  status: answered
  record_target: business_owner
  source_id: MSG-20260903-285bb7
  source_action_key: chat:RUN-20260903-e4610c
  answered_at: '2026-09-03T09:58:34+00:00'
  answer_fact_id: FACT-20260903-2903b8
- answer_id: ANS-20260903-227ed7
  question_id: target_launch_date
  question: What is the target launch date for the pilot?
  answer: Next quarter is the only timing provided. No specific launch date is set.
    Set a date before launch and schedule legal, compliance, model-risk, privacy,
    and operations review before that date.
  values:
  - Next quarter is the only timing provided. No specific launch date is set. Set
    a date before launch and schedule legal, compliance, model-risk, privacy, and
    operations review before that date.
  status: answered
  record_target: target_date
  source_id: MSG-20260903-a8572d
  source_action_key: chat:RUN-20260903-761856
  answered_at: '2026-09-03T09:59:17+00:00'
  answer_fact_id: FACT-20260903-12770b
intake_state: active
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay wants to help marketplaces pay sellers and contractors by automatically
      assigning recipients to payout tiers.

      - The proposed system uses identity-verification results, sanctions-screening
      status, transaction history, country, payout amount, and risk score to decide
      whether to release a payout immediately, require additional information, or
      send the payout to review.

      - The recipient would see a status message and a request for documents when
      needed.

      - Actors are sellers, contractors, marketplace customers, Mosaic Relay compliance
      and operations, identity and fraud vendors, and payout processors.

      - Product wants to test this with three customers next quarter.

      - The system may include individuals and small businesses as recipients.

      - Some recipients may be outside the United States.

      - The team has not determined whether a rejected payout is a compliance block,
      a fraud control, or a customer-directed decision.

      - The explanation shown to recipients, human-review standard, correction process,
      retention period, and treatment of funds during review are not settled.

      - The data fields used in the model and how often decisions are re-evaluated
      are not known.

      - What is the nature of a rejected payout in this system? This determines which
      legal framework applies — a compliance block (OFAC/BSA-AML), a fraud control,
      or a customer-directed decision. — A mix of these depending on the trigger

      - Which data fields will the model use, and how often are payout decisions re-evaluated
      over time? — Not yet finalized. The proposed fields are identity-verification
      result, sanctions-screening status, transaction history, country, payout amount,
      and risk score. Before the pilot, Product and Compliance must document the complete
      field list, source and purpose for each field, thresholds, re-evaluation triggers
      and frequency, manual overrides, model/version history, access, retention, and
      a process to test for disparate impact. Do not use a proxy for a protected trait
      without a documented necessity and review.

      - When does the business need the legal answer? — Before a planned launch

      - A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud control,
      and customer-directed decision depending on the trigger.

      - The model field list is not yet finalized; proposed fields are identity-verification
      result, sanctions-screening status, transaction history, country, payout amount,
      and risk score. Before the pilot, Product and Compliance must document the complete
      field list, source and purpose per field, thresholds, re-evaluation triggers/frequency,
      manual overrides, model/version history, access, retention, and a disparate-impact
      testing process. No proxy for a protected trait without documented necessity
      and review.

      - The business needs the legal answer before a planned launch (no specific date
      given).

      - How are funds treated while a payout is under review? — Not yet determined

      - How funds are treated while a payout is under review is not yet determined.

      - What explanation will a restricted recipient see, and what correction/appeal
      route will they have? — Not yet determined

      - Which countries are the non-U.S. recipients in? — Not yet identified. The
      pilot must list every recipient country and processor before launch, then map
      transfer, sanctions, privacy, localization, and payout rules by country. Use
      a U.S.-primary assumption only for this first pass, and treat all non-U.S. coverage
      as an unverified lead until confirmed.

      - The model field list is not yet finalized; proposed fields are identity-verification
      result, sanctions-screening status, transaction history, country, payout amount,
      and risk score.

      - The explanation shown to restricted recipients and their correction/appeal
      route are not yet determined.

      - The non-U.S. recipient countries are not yet identified; use a U.S.-primary
      assumption for this first pass and treat all non-U.S. coverage as an unverified
      lead until confirmed.

      - Can marketplace customers direct payout outcomes, or is the decision solely
      Mosaic Relay''s? — Not yet determined

      - Who owns the human-review standard and override authority for the pilot? —
      Not yet determined

      - What is the target launch date for the pilot? — Next quarter is the only timing
      provided. No specific launch date is set. Set a date before launch and schedule
      legal, compliance, model-risk, privacy, and operations review before that date.


      ## Assumptions


      - [Assumption] U.S.-primary scope for the pilot; any non-U.S. recipient materially
      changes data-protection and sanctions obligations and requires separate review.

      - [Assumption] Mosaic Relay''s baseline KYB/KYC, sanctions screening, and BSA/AML
      obligations from prior matters (Matter 01) apply to recipients as they do to
      merchants.

      - [Assumption] Sanctions screening is a mandatory, non-tierable gate before
      any payout is released, consistent with the baseline framework.

      - [Assumption] The three-customer pilot is a controlled test with defined controls,
      not a full production launch.

      - [Assumption] Because a rejected payout is a mix of triggers, the system must
      tag each restriction with its true basis (compliance vs. fraud vs. customer-directed)
      so the correct notice, review, and escalation path applies.

      - [Assumption] U.S.-primary scope; non-U.S. recipients subject to separate review.

      - [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over
      to the pilot.

      - [Assumption] Sanctions screening is a non-tierable gate (a sanctions hit blocks
      payout regardless of tier).

      - [Assumption] The pilot is a controlled test with three customers, not a general
      launch.

      - [Assumption] The system must tag each restriction with its true basis (compliance
      vs. fraud vs. customer-directed) so the correct notice, review, and escalation
      path applies.

      - [Assumption] U.S.-primary scope; any non-U.S. expansion subject to separate
      review.

      - [Assumption] Baseline KYB/KYC, sanctions-screening, and BSA/AML obligations
      carry over to the pilot.

      - [Assumption] Sanctions screening is a non-tierable gate: a confirmed sanctions
      hit blocks payout regardless of tier.

      - [Assumption] The pilot is a controlled test with three customers, not a full
      production launch.

      - [Assumption] The system must distinguish the true basis of each restriction
      (compliance vs. fraud vs. customer-directed) rather than treating all rejections
      alike.

      - [Assumption] U.S.-primary scope for this first pass; all non-U.S. coverage
      is an unverified lead until recipient countries and processors are confirmed.

      - [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over
      to the payout-tiering system.

      - [Assumption] Sanctions screening is a non-tierable gate: a sanctions hit blocks
      payout regardless of tier, and cannot be overridden by a customer.

      - [Assumption] The pilot is a controlled test with three customers, so controls
      can be scoped to pilot scale but must still be documented and tested.

      - [Assumption] The system must tag each restriction with its true basis (compliance,
      fraud, or customer-directed) because each carries different notice and funds-handling
      duties.

      - [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over
      to the automated system.

      - [Assumption] Sanctions screening is a non-tierable gate (a sanctions hit is
      a block, not a tier), separate from fraud/risk tiering.

      - [Assumption] The pilot is a controlled test with three customers, so controls
      can be scoped to pilot scale but must still be documented and auditable.

      - [Assumption] Each restriction must be tagged with its true basis (compliance,
      fraud, or customer-directed) because the frameworks differ.

      - [Assumption] The pilot is a controlled test with a defined customer set and
      documented controls.

      - [Assumption] Mosaic Relay is not a bank or deposit holder and does not hold
      customer funds.

      - [Assumption] The pilot is a controlled test with a defined customer set, documented
      controls, and review before launch.

      - [Assumption] Each restriction must be tagged with its true basis (compliance,
      fraud, or customer-directed) because the legal framework differs by trigger.

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

- Mosaic Relay wants to help marketplaces pay sellers and contractors by automatically assigning recipients to payout tiers.
- The proposed system uses identity-verification results, sanctions-screening status, transaction history, country, payout amount, and risk score to decide whether to release a payout immediately, require additional information, or send the payout to review.
- The recipient would see a status message and a request for documents when needed.
- Actors are sellers, contractors, marketplace customers, Mosaic Relay compliance and operations, identity and fraud vendors, and payout processors.
- Product wants to test this with three customers next quarter.
- The system may include individuals and small businesses as recipients.
- Some recipients may be outside the United States.
- The team has not determined whether a rejected payout is a compliance block, a fraud control, or a customer-directed decision.
- The explanation shown to recipients, human-review standard, correction process, retention period, and treatment of funds during review are not settled.
- The data fields used in the model and how often decisions are re-evaluated are not known.
- What is the nature of a rejected payout in this system? This determines which legal framework applies — a compliance block (OFAC/BSA-AML), a fraud control, or a customer-directed decision. — A mix of these depending on the trigger
- Which data fields will the model use, and how often are payout decisions re-evaluated over time? — Not yet finalized. The proposed fields are identity-verification result, sanctions-screening status, transaction history, country, payout amount, and risk score. Before the pilot, Product and Compliance must document the complete field list, source and purpose for each field, thresholds, re-evaluation triggers and frequency, manual overrides, model/version history, access, retention, and a process to test for disparate impact. Do not use a proxy for a protected trait without a documented necessity and review.
- When does the business need the legal answer? — Before a planned launch
- A rejected payout is a mix of compliance block (OFAC/BSA-AML), fraud control, and customer-directed decision depending on the trigger.
- The model field list is not yet finalized; proposed fields are identity-verification result, sanctions-screening status, transaction history, country, payout amount, and risk score. Before the pilot, Product and Compliance must document the complete field list, source and purpose per field, thresholds, re-evaluation triggers/frequency, manual overrides, model/version history, access, retention, and a disparate-impact testing process. No proxy for a protected trait without documented necessity and review.
- The business needs the legal answer before a planned launch (no specific date given).
- How are funds treated while a payout is under review? — Not yet determined
- How funds are treated while a payout is under review is not yet determined.
- What explanation will a restricted recipient see, and what correction/appeal route will they have? — Not yet determined
- Which countries are the non-U.S. recipients in? — Not yet identified. The pilot must list every recipient country and processor before launch, then map transfer, sanctions, privacy, localization, and payout rules by country. Use a U.S.-primary assumption only for this first pass, and treat all non-U.S. coverage as an unverified lead until confirmed.
- The model field list is not yet finalized; proposed fields are identity-verification result, sanctions-screening status, transaction history, country, payout amount, and risk score.
- The explanation shown to restricted recipients and their correction/appeal route are not yet determined.
- The non-U.S. recipient countries are not yet identified; use a U.S.-primary assumption for this first pass and treat all non-U.S. coverage as an unverified lead until confirmed.
- Can marketplace customers direct payout outcomes, or is the decision solely Mosaic Relay's? — Not yet determined
- Who owns the human-review standard and override authority for the pilot? — Not yet determined
- What is the target launch date for the pilot? — Next quarter is the only timing provided. No specific launch date is set. Set a date before launch and schedule legal, compliance, model-risk, privacy, and operations review before that date.

## Assumptions

- [Assumption] U.S.-primary scope for the pilot; any non-U.S. recipient materially changes data-protection and sanctions obligations and requires separate review.
- [Assumption] Mosaic Relay's baseline KYB/KYC, sanctions screening, and BSA/AML obligations from prior matters (Matter 01) apply to recipients as they do to merchants.
- [Assumption] Sanctions screening is a mandatory, non-tierable gate before any payout is released, consistent with the baseline framework.
- [Assumption] The three-customer pilot is a controlled test with defined controls, not a full production launch.
- [Assumption] Because a rejected payout is a mix of triggers, the system must tag each restriction with its true basis (compliance vs. fraud vs. customer-directed) so the correct notice, review, and escalation path applies.
- [Assumption] U.S.-primary scope; non-U.S. recipients subject to separate review.
- [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over to the pilot.
- [Assumption] Sanctions screening is a non-tierable gate (a sanctions hit blocks payout regardless of tier).
- [Assumption] The pilot is a controlled test with three customers, not a general launch.
- [Assumption] The system must tag each restriction with its true basis (compliance vs. fraud vs. customer-directed) so the correct notice, review, and escalation path applies.
- [Assumption] U.S.-primary scope; any non-U.S. expansion subject to separate review.
- [Assumption] Baseline KYB/KYC, sanctions-screening, and BSA/AML obligations carry over to the pilot.
- [Assumption] Sanctions screening is a non-tierable gate: a confirmed sanctions hit blocks payout regardless of tier.
- [Assumption] The pilot is a controlled test with three customers, not a full production launch.
- [Assumption] The system must distinguish the true basis of each restriction (compliance vs. fraud vs. customer-directed) rather than treating all rejections alike.
- [Assumption] U.S.-primary scope for this first pass; all non-U.S. coverage is an unverified lead until recipient countries and processors are confirmed.
- [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over to the payout-tiering system.
- [Assumption] Sanctions screening is a non-tierable gate: a sanctions hit blocks payout regardless of tier, and cannot be overridden by a customer.
- [Assumption] The pilot is a controlled test with three customers, so controls can be scoped to pilot scale but must still be documented and tested.
- [Assumption] The system must tag each restriction with its true basis (compliance, fraud, or customer-directed) because each carries different notice and funds-handling duties.
- [Assumption] Baseline KYB/KYC and sanctions-screening obligations carry over to the automated system.
- [Assumption] Sanctions screening is a non-tierable gate (a sanctions hit is a block, not a tier), separate from fraud/risk tiering.
- [Assumption] The pilot is a controlled test with three customers, so controls can be scoped to pilot scale but must still be documented and auditable.
- [Assumption] Each restriction must be tagged with its true basis (compliance, fraud, or customer-directed) because the frameworks differ.
- [Assumption] The pilot is a controlled test with a defined customer set and documented controls.
- [Assumption] Mosaic Relay is not a bank or deposit holder and does not hold customer funds.
- [Assumption] The pilot is a controlled test with a defined customer set, documented controls, and review before launch.
- [Assumption] Each restriction must be tagged with its true basis (compliance, fraud, or customer-directed) because the legal framework differs by trigger.
