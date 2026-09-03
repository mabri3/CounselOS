---
matter_id: MAT-20260902-d26bf6
record_type: facts
facts:
- fact_id: FACT-20260902-d32a90
  text: Data is collected while Mosaic Relay provides payment and fraud services to
    merchants.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-fee0ee
  text: Mosaic Relay would not sell the data.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-f96e2d
  text: The proposed operation would remove direct identifiers and combine data across
    customers.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-2cd1f8
  text: The training set would be retained for seven years.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-6d5e7e
  text: Model training would occur monthly, with outputs used in real-time authorization
    and payout decisions.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-ce6315
  text: Data categories include device signals, payment method details, transaction
    amounts, merchant category, broad regional location, dispute outcomes, and account
    events.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-765fe7
  text: Actors include Mosaic Relay, merchants, payers, recipients, fraud vendors,
    cloud providers, and model-governance staff.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-f8750f
  text: Mosaic Relay believes aggregation and pseudonymization reduce privacy risk.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- fact_id: FACT-20260902-ceaddd
  text: Which jurisdictions are in scope for the merchants, payers, and recipients,
    and where will the data be processed and stored? — Multiple/global — need to map
  status: active
  material: true
  source_ids:
  - MSG-20260902-7230aa
  supersedes: null
  created_at: '2026-09-02T15:06:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-24c7c1
- fact_id: FACT-20260902-bd2ed7
  text: Which exact identifiers are retained after de-identification (e.g., device
    IDs, IP addresses, account IDs, email hashes)? — Not sure — need to confirm with
    engineering
  status: active
  material: true
  source_ids:
  - MSG-20260902-2a2689
  supersedes: null
  created_at: '2026-09-02T15:07:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-2c40a2
- fact_id: FACT-20260902-99ee9a
  text: 'What do current merchant contracts say about use of transaction data, and
    do they permit cross-merchant aggregation? — Unknown. Current merchant agreements
    and data-use schedules have not been reviewed. Working assumption for analysis:
    no cross-merchant aggregation or secondary fraud-model training right should be
    assumed unless the contracts, DPAs, and service terms expressly permit it, including
    purpose, sharing with fraud vendors/cloud providers, retention, and deletion limits.'
  status: active
  material: true
  source_ids:
  - MSG-20260902-e5e152
  supersedes: null
  created_at: '2026-09-02T15:07:22+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-2ccbc8
- fact_id: FACT-20260902-f86cf1
  text: When does the business need the legal answer? — Before a planned launch
  status: active
  material: true
  source_ids:
  - MSG-20260902-dd9e84
  supersedes: null
  created_at: '2026-09-02T15:07:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-d739a3
- fact_id: FACT-20260902-3d0593
  text: Jurisdiction scope is multiple/global and needs to be mapped.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- fact_id: FACT-20260902-9d2a13
  text: Legal answer is needed before a planned launch.
  status: active
  material: true
  source_ids:
  - REQ-20260902-db7c44
  supersedes: null
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- fact_id: FACT-20260902-0a1502
  text: Are the model's authorization and payout decisions subject to human review
    today, and do consumers currently receive notice or have opt-out rights regarding
    this data use? — Not sure — need to confirm with product/risk teams
  status: active
  material: true
  source_ids:
  - MSG-20260902-ec46d8
  supersedes: null
  created_at: '2026-09-02T15:08:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-30671c
- fact_id: FACT-20260902-2045f3
  text: Where will the data be processed and stored, and are cross-border transfers
    involved? — Not sure — need to confirm with engineering
  status: active
  material: true
  source_ids:
  - MSG-20260902-99e139
  supersedes: null
  created_at: '2026-09-02T15:08:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1b5bba
- fact_id: FACT-20260902-26ff17
  text: Is device data (device signals, device IDs, IP addresses) treated as personal
    information in the relevant locations where merchants, payers, and recipients
    are based? — Mixed — it varies by jurisdiction
  status: active
  material: true
  source_ids:
  - MSG-20260902-7d3faa
  supersedes: null
  created_at: '2026-09-02T15:09:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-e0eb15
sources:
- source_id: REQ-20260902-db7c44
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-05-use-of-transaction-data-to-improve-fraud-d26bf6/request.md
  version: ''
  location: ''
  created_at: '2026-09-02T15:06:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-04dd84
- source_id: MSG-20260902-7230aa
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:06:43+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1284ac
- source_id: MSG-20260902-2a2689
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:07:01+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-85f260
- source_id: MSG-20260902-e5e152
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:07:22+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-291b8c
- source_id: MSG-20260902-dd9e84
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:07:42+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-275504
- source_id: MSG-20260902-ec46d8
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:08:17+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-08639e
- source_id: MSG-20260902-99e139
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:08:38+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-2f7952
- source_id: MSG-20260902-7d3faa
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T15:09:16+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-4fc589
support:
- support_id: SUP-20260902-3ef220
  fact_id: FACT-20260902-d32a90
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data is collected while Mosaic Relay provides payment and fraud services
    to merchants.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-25c6b6
  fact_id: FACT-20260902-fee0ee
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay would not sell the data.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-a93d88
  fact_id: FACT-20260902-f96e2d
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The proposed operation would remove direct identifiers and combine data
    across customers.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-1fe1ae
  fact_id: FACT-20260902-2cd1f8
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The training set would be retained for seven years.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-8c4b56
  fact_id: FACT-20260902-6d5e7e
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Model training would occur monthly, with outputs used in real-time authorization
    and payout decisions.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-6c18e1
  fact_id: FACT-20260902-ce6315
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data categories include device signals, payment method details, transaction
    amounts, merchant category, broad regional location, dispute outcomes, and account
    events.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-5bb1f7
  fact_id: FACT-20260902-765fe7
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Actors include Mosaic Relay, merchants, payers, recipients, fraud vendors,
    cloud providers, and model-governance staff.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-6df0e9
  fact_id: FACT-20260902-f8750f
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay believes aggregation and pseudonymization reduce privacy
    risk.
  location: ''
  created_at: '2026-09-02T15:06:18+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- support_id: SUP-20260902-f20563
  fact_id: FACT-20260902-d32a90
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data is collected while Mosaic Relay provides payment and fraud services
    to merchants.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-ea069c
  fact_id: FACT-20260902-fee0ee
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay would not sell the data.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-68025e
  fact_id: FACT-20260902-f96e2d
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The proposed operation would remove direct identifiers and combine data
    across customers.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-d6694a
  fact_id: FACT-20260902-2cd1f8
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The training set would be retained for seven years.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-93edb1
  fact_id: FACT-20260902-6d5e7e
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Model training would occur monthly, with outputs used in real-time authorization
    and payout decisions.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-762c7e
  fact_id: FACT-20260902-ce6315
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data categories include device signals, payment method details, transaction
    amounts, merchant category, broad regional location, dispute outcomes, and account
    events.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-130c37
  fact_id: FACT-20260902-765fe7
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Actors include Mosaic Relay, merchants, payers, recipients, fraud vendors,
    cloud providers, and model-governance staff.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-2fc56a
  fact_id: FACT-20260902-f8750f
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay believes aggregation and pseudonymization reduce privacy
    risk.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-5f86ce
  fact_id: FACT-20260902-3d0593
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Jurisdiction scope is multiple/global and needs to be mapped.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-9b5545
  fact_id: FACT-20260902-9d2a13
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Legal answer is needed before a planned launch.
  location: ''
  created_at: '2026-09-02T15:07:58+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- support_id: SUP-20260902-efb7b9
  fact_id: FACT-20260902-d32a90
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data is collected while Mosaic Relay provides payment and fraud services
    to merchants.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-6874b3
  fact_id: FACT-20260902-fee0ee
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay would not sell the data.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-4fa71a
  fact_id: FACT-20260902-f96e2d
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The proposed operation would remove direct identifiers and combine data
    across customers.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-b64cdf
  fact_id: FACT-20260902-2cd1f8
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: The training set would be retained for seven years.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-fede80
  fact_id: FACT-20260902-6d5e7e
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Model training would occur monthly, with outputs used in real-time authorization
    and payout decisions.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-633f34
  fact_id: FACT-20260902-ce6315
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Data categories include device signals, payment method details, transaction
    amounts, merchant category, broad regional location, dispute outcomes, and account
    events.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-5a98cb
  fact_id: FACT-20260902-765fe7
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Actors include Mosaic Relay, merchants, payers, recipients, fraud vendors,
    cloud providers, and model-governance staff.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-c89c69
  fact_id: FACT-20260902-f8750f
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Mosaic Relay believes aggregation and pseudonymization reduce privacy
    risk.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-bd6e6b
  fact_id: FACT-20260902-3d0593
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Jurisdiction scope is multiple/global and needs to be mapped.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- support_id: SUP-20260902-c48b33
  fact_id: FACT-20260902-9d2a13
  source_id: REQ-20260902-db7c44
  relationship: support
  statement: Legal answer is needed before a planned launch.
  location: ''
  created_at: '2026-09-02T15:08:53+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-010bac
assumptions:
- assumption_id: ASM-20260902-4d8ed9
  text: Mosaic Relay acts as a processor or controller depending on the data flow
    and jurisdiction; roles need mapping per data category.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:06:18+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- assumption_id: ASM-20260902-dbbbee
  text: The matter spans multiple jurisdictions (North America and Europe), so GDPR
    and US state privacy laws are likely relevant.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:06:18+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-f9722a
- assumption_id: ASM-20260902-efa648
  text: No cross-merchant aggregation or secondary fraud-model training right should
    be assumed unless merchant contracts, DPAs, and service terms expressly permit
    it.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:07:58+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- assumption_id: ASM-20260902-349bbb
  text: Merchant contracts have not been reviewed; working assumption is no cross-merchant
    aggregation or secondary fraud-model training right unless contracts, DPAs, and
    service terms expressly permit it.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:07:58+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-1080d6
- assumption_id: ASM-20260902-711863
  text: No cross-merchant aggregation or secondary fraud-model training right should
    be assumed unless merchant contracts, DPAs, and service terms expressly permit
    it (purpose, sharing with fraud vendors/cloud providers, retention, deletion).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-b53c2f
- assumption_id: ASM-20260902-00502e
  text: GDPR and US state privacy laws are likely in scope given the global/multi-jurisdiction
    footprint; exact regimes need mapping.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-b53c2f
- assumption_id: ASM-20260902-4551db
  text: Mosaic Relay's controller/processor role likely varies by data flow and jurisdiction.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:26+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-b53c2f
- assumption_id: ASM-20260902-4ef6ea
  text: No cross-merchant aggregation or secondary fraud-model training right should
    be assumed unless merchant contracts, DPAs, and service terms expressly permit
    it (including purpose, sharing with fraud vendors/cloud providers, retention,
    and deletion limits).
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:53+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- assumption_id: ASM-20260902-63a292
  text: Aggregation and pseudonymization alone may not be sufficient to avoid personal-data
    obligations; de-identification standard depends on identifiers retained.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:53+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- assumption_id: ASM-20260902-e60bc0
  text: Merchant contracts and data-use schedules have not been reviewed; working
    assumption is no cross-merchant aggregation or secondary fraud-model training
    right unless contracts, DPAs, and service terms expressly permit it.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:08:53+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-010bac
- assumption_id: ASM-20260902-72ca9d
  text: Device data is personal information in at least some in-scope jurisdictions,
    so the analysis must be jurisdiction-specific.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T15:09:25+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-a58597
conflicts: []
actions:
- action_id: ACT-20260902-04dd84
  summary: Linked Original request
  actor: system
  created_at: '2026-09-02T15:06:10+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260902-db7c44
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-f9722a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:06:18+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-d32a90
    - FACT-20260902-fee0ee
    - FACT-20260902-f96e2d
    - FACT-20260902-2cd1f8
    - FACT-20260902-6d5e7e
    - FACT-20260902-ce6315
    - FACT-20260902-765fe7
    - FACT-20260902-f8750f
    sources: []
    support:
    - SUP-20260902-3ef220
    - SUP-20260902-25c6b6
    - SUP-20260902-a93d88
    - SUP-20260902-1fe1ae
    - SUP-20260902-8c4b56
    - SUP-20260902-6c18e1
    - SUP-20260902-5bb1f7
    - SUP-20260902-6df0e9
    assumptions:
    - ASM-20260902-4d8ed9
    - ASM-20260902-dbbbee
  source_action_key: chat:RUN-20260902-e87229:tool:c71d78fdc20d130e4d188179
- action_id: ACT-20260902-1284ac
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:06:43+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-7230aa
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-24c7c1
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:06:43+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-ceaddd
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-d7c530:answers
- action_id: ACT-20260902-6aa43d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:06:49+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-d7c530:tool:cf61bc73078d88a583307b81
- action_id: ACT-20260902-85f260
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:07:01+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-2a2689
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-2c40a2
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:07:01+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-bd2ed7
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-fe435d:answers
- action_id: ACT-20260902-e8dcd2
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:07:09+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-fe435d:tool:43514df4e3900cf22fab7e0d
- action_id: ACT-20260902-291b8c
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:07:22+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-e5e152
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-2ccbc8
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:07:22+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-99ee9a
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-1acc20:answers
- action_id: ACT-20260902-275504
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:07:42+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-dd9e84
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-d739a3
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:07:42+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-f86cf1
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-97d84e:answers
- action_id: ACT-20260902-1080d6
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:07:58+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-3d0593
    - FACT-20260902-9d2a13
    sources: []
    support:
    - SUP-20260902-f20563
    - SUP-20260902-ea069c
    - SUP-20260902-68025e
    - SUP-20260902-d6694a
    - SUP-20260902-93edb1
    - SUP-20260902-762c7e
    - SUP-20260902-130c37
    - SUP-20260902-2fc56a
    - SUP-20260902-5f86ce
    - SUP-20260902-9b5545
    assumptions:
    - ASM-20260902-efa648
    - ASM-20260902-349bbb
  source_action_key: chat:RUN-20260902-eacf95:tool:9e724fb05f3738146dc05d67
- action_id: ACT-20260902-08639e
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:08:17+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-ec46d8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-30671c
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:08:17+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-0a1502
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-e879ec:answers
- action_id: ACT-20260902-b53c2f
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:08:26+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-711863
    - ASM-20260902-00502e
    - ASM-20260902-4551db
  source_action_key: chat:RUN-20260902-e879ec:tool:85861650cc7688abe4501c9b
- action_id: ACT-20260902-2f7952
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:08:38+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-99e139
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-1b5bba
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:08:38+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-2045f3
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-e86bb7:answers
- action_id: ACT-20260902-010bac
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:08:53+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support:
    - SUP-20260902-efb7b9
    - SUP-20260902-6874b3
    - SUP-20260902-4fa71a
    - SUP-20260902-b64cdf
    - SUP-20260902-fede80
    - SUP-20260902-633f34
    - SUP-20260902-5a98cb
    - SUP-20260902-c89c69
    - SUP-20260902-bd6e6b
    - SUP-20260902-c48b33
    assumptions:
    - ASM-20260902-4ef6ea
    - ASM-20260902-63a292
    - ASM-20260902-e60bc0
  source_action_key: chat:RUN-20260902-fbba01:tool:813f6b02f197c4c4b8071aa0
- action_id: ACT-20260902-4fc589
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T15:09:16+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-7d3faa
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-e0eb15
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T15:09:16+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-26ff17
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-f103f4:answers
- action_id: ACT-20260902-a58597
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T15:09:25+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-72ca9d
  source_action_key: chat:RUN-20260902-f103f4:tool:6b8726570aac05f21b6c7278
working_ask: Mosaic Relay wants to use transaction metadata from multiple merchants
  to train a fraud-detection model. Data includes device signals, payment method details,
  transaction amounts, merchant category, broad regional location, dispute outcomes,
  and account events. The operation would remove direct identifiers, combine data
  across customers, and retain the training set for seven years. Model training would
  occur monthly, with outputs used in real-time authorization and payout decisions.
  Legal advice is requested on lawful purposes, controller/processor roles, contract
  language, notice requirements, retention, de-identification standards, and whether
  the model's decisions require human review or additional consumer rights. Legal
  answer is needed before a planned launch.
issues:
- Lawful basis for cross-merchant aggregation and model training
- Controller vs processor role allocation across Mosaic Relay, merchants, and vendors
- Whether de-identification/pseudonymization is sufficient to avoid personal-data
  obligations, given device data is personal in some jurisdictions
- Seven-year retention justification and deletion procedures
- Automated decision-making and human-review requirements for authorization/payout
  decisions
- Cross-border transfer compliance
- Contract language with merchants and vendors
open_questions:
- Merchant contract terms on data use and cross-merchant aggregation (contract review)
- Whether automated authorization/payout decisions are subject to human review and
  whether consumers receive notice/opt-out (product/risk)
public_research_questions:
- What de-identification and pseudonymization standards do GDPR and major US state
  privacy laws (e.g., CCPA/CPRA) recognize for training data, and when does pseudonymized
  data remain personal data?
- What are the GDPR Article 22 and comparable automated-decision-making requirements
  for real-time authorization and payout decisions, and when is human review required?
- What are the cross-border transfer requirements (GDPR Chapter V, adequacy, SCCs)
  for processing and storing transaction data across regions?
intake_answers:
- answer_id: ANS-20260902-bea805
  question_id: jurisdiction
  question: Which jurisdictions are in scope for the merchants, payers, and recipients,
    and where will the data be processed and stored?
  answer: Multiple/global — need to map
  values:
  - global_multi
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260902-7230aa
  source_action_key: chat:RUN-20260902-d7c530
  answered_at: '2026-09-02T15:06:43+00:00'
  answer_fact_id: FACT-20260902-ceaddd
- answer_id: ANS-20260902-9844b0
  question_id: identifiers_retained
  question: Which exact identifiers are retained after de-identification (e.g., device
    IDs, IP addresses, account IDs, email hashes)?
  answer: Not sure — need to confirm with engineering
  values:
  - unsure
  status: answered
  record_target: fact
  source_id: MSG-20260902-2a2689
  source_action_key: chat:RUN-20260902-fe435d
  answered_at: '2026-09-02T15:07:01+00:00'
  answer_fact_id: FACT-20260902-bd2ed7
- answer_id: ANS-20260902-122fff
  question_id: q_contracts
  question: What do current merchant contracts say about use of transaction data,
    and do they permit cross-merchant aggregation?
  answer: 'Unknown. Current merchant agreements and data-use schedules have not been
    reviewed. Working assumption for analysis: no cross-merchant aggregation or secondary
    fraud-model training right should be assumed unless the contracts, DPAs, and service
    terms expressly permit it, including purpose, sharing with fraud vendors/cloud
    providers, retention, and deletion limits.'
  values:
  - 'Unknown. Current merchant agreements and data-use schedules have not been reviewed.
    Working assumption for analysis: no cross-merchant aggregation or secondary fraud-model
    training right should be assumed unless the contracts, DPAs, and service terms
    expressly permit it, including purpose, sharing with fraud vendors/cloud providers,
    retention, and deletion limits.'
  status: answered
  record_target: fact
  source_id: MSG-20260902-e5e152
  source_action_key: chat:RUN-20260902-1acc20
  answered_at: '2026-09-02T15:07:22+00:00'
  answer_fact_id: FACT-20260902-99ee9a
- answer_id: ANS-20260902-a5762d
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Before a planned launch
  values:
  - choice_1
  status: answered
  record_target: fact
  source_id: MSG-20260902-dd9e84
  source_action_key: chat:RUN-20260902-97d84e
  answered_at: '2026-09-02T15:07:42+00:00'
  answer_fact_id: FACT-20260902-f86cf1
- answer_id: ANS-20260902-e65489
  question_id: q_human_review_notice
  question: Are the model's authorization and payout decisions subject to human review
    today, and do consumers currently receive notice or have opt-out rights regarding
    this data use?
  answer: Not sure — need to confirm with product/risk teams
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260902-ec46d8
  source_action_key: chat:RUN-20260902-e879ec
  answered_at: '2026-09-02T15:08:17+00:00'
  answer_fact_id: FACT-20260902-0a1502
- answer_id: ANS-20260902-757622
  question_id: q_storage_location
  question: Where will the data be processed and stored, and are cross-border transfers
    involved?
  answer: Not sure — need to confirm with engineering
  values:
  - unknown
  status: answered
  record_target: fact
  source_id: MSG-20260902-99e139
  source_action_key: chat:RUN-20260902-e86bb7
  answered_at: '2026-09-02T15:08:38+00:00'
  answer_fact_id: FACT-20260902-2045f3
- answer_id: ANS-20260902-9179d3
  question_id: device_pii
  question: Is device data (device signals, device IDs, IP addresses) treated as personal
    information in the relevant locations where merchants, payers, and recipients
    are based?
  answer: Mixed — it varies by jurisdiction
  values:
  - mixed
  status: answered
  record_target: fact
  source_id: MSG-20260902-7d3faa
  source_action_key: chat:RUN-20260902-f103f4
  answered_at: '2026-09-02T15:09:16+00:00'
  answer_fact_id: FACT-20260902-26ff17
intake_state: complete
---
# Known Facts

- Data is collected while Mosaic Relay provides payment and fraud services to merchants.
- Mosaic Relay would not sell the data.
- The proposed operation would remove direct identifiers and combine data across customers.
- The training set would be retained for seven years.
- Model training would occur monthly, with outputs used in real-time authorization and payout decisions.
- Data categories include device signals, payment method details, transaction amounts, merchant category, broad regional location, dispute outcomes, and account events.
- Actors include Mosaic Relay, merchants, payers, recipients, fraud vendors, cloud providers, and model-governance staff.
- Mosaic Relay believes aggregation and pseudonymization reduce privacy risk.
- Which jurisdictions are in scope for the merchants, payers, and recipients, and where will the data be processed and stored? — Multiple/global — need to map
- Which exact identifiers are retained after de-identification (e.g., device IDs, IP addresses, account IDs, email hashes)? — Not sure — need to confirm with engineering
- What do current merchant contracts say about use of transaction data, and do they permit cross-merchant aggregation? — Unknown. Current merchant agreements and data-use schedules have not been reviewed. Working assumption for analysis: no cross-merchant aggregation or secondary fraud-model training right should be assumed unless the contracts, DPAs, and service terms expressly permit it, including purpose, sharing with fraud vendors/cloud providers, retention, and deletion limits.
- When does the business need the legal answer? — Before a planned launch
- Jurisdiction scope is multiple/global and needs to be mapped.
- Legal answer is needed before a planned launch.
- Are the model's authorization and payout decisions subject to human review today, and do consumers currently receive notice or have opt-out rights regarding this data use? — Not sure — need to confirm with product/risk teams
- Where will the data be processed and stored, and are cross-border transfers involved? — Not sure — need to confirm with engineering
- Is device data (device signals, device IDs, IP addresses) treated as personal information in the relevant locations where merchants, payers, and recipients are based? — Mixed — it varies by jurisdiction

## Assumptions

- [Assumption] Mosaic Relay acts as a processor or controller depending on the data flow and jurisdiction; roles need mapping per data category.
- [Assumption] The matter spans multiple jurisdictions (North America and Europe), so GDPR and US state privacy laws are likely relevant.
- [Assumption] No cross-merchant aggregation or secondary fraud-model training right should be assumed unless merchant contracts, DPAs, and service terms expressly permit it.
- [Assumption] Merchant contracts have not been reviewed; working assumption is no cross-merchant aggregation or secondary fraud-model training right unless contracts, DPAs, and service terms expressly permit it.
- [Assumption] No cross-merchant aggregation or secondary fraud-model training right should be assumed unless merchant contracts, DPAs, and service terms expressly permit it (purpose, sharing with fraud vendors/cloud providers, retention, deletion).
- [Assumption] GDPR and US state privacy laws are likely in scope given the global/multi-jurisdiction footprint; exact regimes need mapping.
- [Assumption] Mosaic Relay's controller/processor role likely varies by data flow and jurisdiction.
- [Assumption] No cross-merchant aggregation or secondary fraud-model training right should be assumed unless merchant contracts, DPAs, and service terms expressly permit it (including purpose, sharing with fraud vendors/cloud providers, retention, and deletion limits).
- [Assumption] Aggregation and pseudonymization alone may not be sufficient to avoid personal-data obligations; de-identification standard depends on identifiers retained.
- [Assumption] Merchant contracts and data-use schedules have not been reviewed; working assumption is no cross-merchant aggregation or secondary fraud-model training right unless contracts, DPAs, and service terms expressly permit it.
- [Assumption] Device data is personal information in at least some in-scope jurisdictions, so the analysis must be jurisdiction-specific.
