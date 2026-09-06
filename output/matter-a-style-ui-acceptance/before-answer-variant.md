---
matter_id: MAT-20260905-f025e4
questions:
- question_id: Q-DEMO-AUDIENCE
  business_question_id: BQ-c7fd36e074742c4a
  business_question_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
  issue_id: ISS-c7fd36e074-beceace28ad3b977
  issue_ids:
  - ISS-c7fd36e074-beceace28ad3b977
  - ISS-c7fd36e074-f4adb6d37c427ddb
  question_kind: factual
  linked_fact_ids: []
  answer_origin: null
  source_message_id: null
  source_action_key: null
  source_revision: 05f1c7c83856e9a2e0ec16e2ef5d07a020eccfae5d6fbb56221ec31e562e4d6f
  text: Will the US launch include children under 13?
  consequence: The answer can change the required launch controls.
  state: open
  answer: null
  answer_kind: null
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-05T21:17:54+00:00'
- question_id: Q-DEMO-IDENTIFIER
  business_question_id: BQ-c7fd36e074742c4a
  business_question_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
  issue_id: ISS-c7fd36e074-dfedecd1f6e194c9
  issue_ids:
  - ISS-c7fd36e074-dfedecd1f6e194c9
  question_kind: legal
  linked_fact_ids: []
  answer_origin: null
  source_message_id: null
  source_action_key: null
  source_revision: 21bf2e74b2b0f1a361e25a040cc278467526135d1901182f04ef8b14877a4b1e
  text: Does this identifier use fit a permitted internal-operations purpose under
    the rule?
  consequence: The answer can change the required launch controls.
  state: open
  answer: null
  answer_kind: null
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-05T21:17:54+00:00'
- question_id: Q-DEMO-SUPPORT
  business_question_id: BQ-c7fd36e074742c4a
  business_question_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
  issue_id: ISS-c7fd36e074-6a74558db33a76cc
  issue_ids:
  - ISS-c7fd36e074-6a74558db33a76cc
  question_kind: factual
  linked_fact_ids: []
  answer_origin: null
  source_message_id: null
  source_action_key: null
  source_revision: c911bf920cbbbfcc1d03ac5d3fd73fb5ade4b62365082c7172909074add0d475
  text: Who handles family account recovery?
  consequence: ''
  state: answered
  answer: Support contacts the family account owner.
  answer_kind: null
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-05T21:27:47+00:00'
  source_paths:
  - 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/product-spec.md
claims:
- claim_id: CLM-DEMO-CHILD
  text: The rule defines a child as an individual under 13.
  claim_revision: demo-claim-1
  output_revision: demo-output-1
  applicability:
    regulated_actor: Lumen, proposed online service operator
    jurisdiction: United States
    explanation: Lumen proposes a commercial US online service. Audience age is unknown.
      This definition alone does not establish coverage or a consent duty.
  support_gap: Coverage and exceptions require further analysis.
  evidence:
  - claim_id: CLM-DEMO-CHILD
    claim_revision: demo-claim-1
    output_revision: demo-output-1
    source_id: SRC-COPPA
    source_label: 16 CFR 312.2 — definitions
    locator: Child
    available_excerpt: Child means an individual under the age of 13.
    support_state: supplied
    path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/coppa-definitions.md
    url: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2
    explanation: The saved passage supports this narrow definition. It does not establish
      applicability.
- claim_id: CLM-DEMO-IDENTIFIER
  text: The rule includes certain persistent identifiers in personal information.
  claim_revision: demo-claim-1
  output_revision: demo-output-1
  applicability:
    regulated_actor: Lumen, proposed online service operator
    jurisdiction: United States
    explanation: Lumen uses an identifier across sessions. Whether it meets the full
      definition and whether an exception applies remain legal questions.
  support_gap: Coverage and exceptions require further analysis.
  evidence:
  - claim_id: CLM-DEMO-IDENTIFIER
    claim_revision: demo-claim-1
    output_revision: demo-output-1
    source_id: SRC-COPPA
    source_label: 16 CFR 312.2 — definitions
    locator: Personal information (7)
    available_excerpt: A persistent identifier that can be used to recognize a user
      over time and across different websites or online services.
    support_state: supplied
    path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/coppa-definitions.md
    url: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2
    explanation: The saved passage supports this narrow definition. It does not establish
      applicability.
snapshot:
  short_answer: 'Here is the useful first-pass view: start with the business objective
    and the decision that must be made, then identify the two or three facts that
    could change the path. The active matter context and source files are available
    in the workspace. In mock mode I can also move the matter, run a scaffolded research
    pass, create work items, audit decisions, and create basic schedules. Configure
    an OpenAI-compatible provider in `.env` for model-generated analysis.'
  qualification: Working analysis. Audience coverage and the internal-operations question
    remain open.
  claims: []
  answer_links:
  - 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/conversations/inquiries/RUN-20260905-811892.md
  run_id: RUN-20260905-811892
  generated_at: '2026-09-05T22:18:27+00:00'
  source_revisions:
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/matter.md: 3ac54a1f731437726cfb9d07b27ab2772b5c6bf399db606a6d50382df44b9191
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/dossier.md: 8476b98d93b712801da38e3a7f8ad1df9a42c767a4898310481be58127102ac6
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/facts.md: 5a2bef82cf0686aaa6eec2ef2788d811400dd07f969f314256e2633bdaad3989
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/issues.md: 15535640ad4d9445ad8936202a4d0df1f6c7d6c0c5a6252e49886da00e232194
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/recommendations.md: 3d06ab54aff74a9a79fa39e6f76bb53f556e1572d3a096b13a9df7921e17572b
    03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/flow.md: f8f3612b735daf6e7ec7efeb5724ce320432338d8530b049491f7d2204d07f9c
    business_question: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
options:
- option_id: OPT-DEMO-NOTICE
  label: Prepare parental notice and consent controls
  condition: If the launch includes a covered child audience
  issue_ids:
  - ISS-c7fd36e074-beceace28ad3b977
  - ISS-c7fd36e074-f4adb6d37c427ddb
interaction_receipts:
- receipt_id: RCP-0a454e72be8f1d105de6
  source_action_key: chat:759eb308-8310-40e0-9d14-a459a60a132d
  operation: save_inquiry_result
  target:
    matter_id: MAT-20260905-f025e4
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-c7fd36e074-beceace28ad3b977
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
  after_revision: 7ab9bc9ed6ec78f462213e0691a97f3d3ab3373653ebe304a833f7294ee71d96
  source_message_id: null
  run_id: RUN-20260905-811892
  changed_links:
  - 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/conversations/inquiries/RUN-20260905-811892.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-05T22:18:27+00:00'
continuity_operations:
- operation: fact_request.create
  source_action_key: request-create:5fdc677b-deb5-4cd5-916e-53cbebde8346
  fingerprint: 48b5863e38b5017f52a85234fd01fc2c979f0f4046a71c56a39cae4fbbb489ed
  command:
    question_id: Q-DEMO-AUDIENCE
    expected_question_revision: 05f1c7c83856e9a2e0ec16e2ef5d07a020eccfae5d6fbb56221ec31e562e4d6f
    business_question_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
    wording: Please confirm the youngest intended user age for the US launch.
    requested_person: Sam Patel
    due_at: null
    issue_id: null
    work_item_id: null
    source_action_key: request-create:5fdc677b-deb5-4cd5-916e-53cbebde8346
  target:
    matter_id: MAT-20260905-f025e4
    question_id: Q-DEMO-AUDIENCE
    request_id: FRQ-5df71b7d922f6b96b6f47f82
  actor:
    person_id: alex-morgan
    display_name: Alex Morgan
    mode: demo
  created_at: '2026-09-05T22:31:24+00:00'
  receipt:
    receipt_id: IRC-b6b6a48affdfbd79aa6d3e4c
    source_action_key: request-create:5fdc677b-deb5-4cd5-916e-53cbebde8346
    operation: fact_request.create
    target:
      matter_id: MAT-20260905-f025e4
      business_question_id: BQ-c7fd36e074742c4a
      business_question_revision: null
      issue_id: null
      source_id: null
      scenario_id: null
      artifact_path: null
      artifact_revision: null
      artifact_review_revision: null
      selected_range: null
      local_draft_snapshot: null
    state: applied
    before_revision: null
    after_revision: d5fd4a32da330932e796dff623acc6ed1b4453f3d850eb3bd29edf17720816e6
    source_message_id: null
    run_id: null
    changed_links:
    - 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/workspace.md
    completed_parts:
    - fact_request
    failure_detail: null
    created_at: '2026-09-05T22:31:24+00:00'
  after_revision: d5fd4a32da330932e796dff623acc6ed1b4453f3d850eb3bd29edf17720816e6
- operation: fact_request.act
  source_action_key: request-external:FRQ-5df71b7d922f6b96b6f47f82:f5d9378b-14c8-43e9-845e-740603715d90
  fingerprint: 28297e100d16520d11f6b32f8bd786602450a19f601278479959977fee979a20
  command:
    action: requested_externally
    expected_revision: d5fd4a32da330932e796dff623acc6ed1b4453f3d850eb3bd29edf17720816e6
    source_action_key: request-external:FRQ-5df71b7d922f6b96b6f47f82:f5d9378b-14c8-43e9-845e-740603715d90
  target:
    matter_id: MAT-20260905-f025e4
    request_id: FRQ-5df71b7d922f6b96b6f47f82
  actor:
    person_id: alex-morgan
    display_name: Alex Morgan
    mode: demo
  created_at: '2026-09-05T22:31:42+00:00'
  receipt:
    receipt_id: IRC-d2cbb0851bfb27739c36b88c
    source_action_key: request-external:FRQ-5df71b7d922f6b96b6f47f82:f5d9378b-14c8-43e9-845e-740603715d90
    operation: fact_request.act
    target:
      matter_id: MAT-20260905-f025e4
      business_question_id: BQ-c7fd36e074742c4a
      business_question_revision: null
      issue_id: null
      source_id: null
      scenario_id: null
      artifact_path: null
      artifact_revision: null
      artifact_review_revision: null
      selected_range: null
      local_draft_snapshot: null
    state: applied
    before_revision: d5fd4a32da330932e796dff623acc6ed1b4453f3d850eb3bd29edf17720816e6
    after_revision: e44c11c22ff053267868f416820f85b162171b4e235ab9ad8ae428d8ade3f2ac
    source_message_id: null
    run_id: null
    changed_links:
    - 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/workspace.md
    completed_parts:
    - fact_request
    failure_detail: null
    created_at: '2026-09-05T22:31:42+00:00'
  after_revision: e44c11c22ff053267868f416820f85b162171b4e235ab9ad8ae428d8ade3f2ac
continuity_requests:
- request_id: FRQ-5df71b7d922f6b96b6f47f82
  matter_id: MAT-20260905-f025e4
  question_id: Q-DEMO-AUDIENCE
  question_text: Will the US launch include children under 13?
  question_revision: 05f1c7c83856e9a2e0ec16e2ef5d07a020eccfae5d6fbb56221ec31e562e4d6f
  business_question_revision: legacy:de5ce42a42be7d25a595cf35215f309958b2e19c3fa6d8e7ac608e79aa836e9c
  wording: Please confirm the youngest intended user age for the US launch.
  requested_person: Sam Patel
  due_at: null
  issue_id: null
  work_item_id: null
  created_by:
    person_id: alex-morgan
    display_name: Alex Morgan
    mode: demo
  created_at: '2026-09-05T22:31:24+00:00'
  revision: e44c11c22ff053267868f416820f85b162171b4e235ab9ad8ae428d8ade3f2ac
  state: requested_externally
  requested_at: '2026-09-05T22:31:42+00:00'
  replies: []
  linked_fact_ids: []
  remaining_question: null
  stale: false
context_selection:
- reference_id: SRC-LUMEN-SPEC
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/product-spec.md
  role: source_file
  selected: false
  mandatory: false
  revision: 4a92dd0dcb3f710160dde50784b0d61519f4b0a959864113e7ff211ec96ba640
- reference_id: SRC-LUMEN-REVISED
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/product-spec-revised.md
  role: source_file
  selected: false
  mandatory: false
  revision: 6514fdff12f3baec5d1a8669101b86fb630ac5815678425bff86b3fbda0a7d86
- reference_id: SRC-MAP-SIZE
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/map-size-fixture.md
  role: source_file
  selected: false
  mandatory: false
  revision: 44bb37f0833a763b826b11c6e9fb9925c61aed3598b2b9bfc404b882167de584
- reference_id: SRC-COPPA
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/documents/coppa-definitions.md
  role: source_file
  selected: true
  mandatory: false
  revision: 00c4b9639a6875537521a5ef8b90e3a83d61725590580f1a3c90a6fce983f1d8
- reference_id: SRC-77317C91B9134853
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/draft/working-draft-5a7be3.md
  role: generated_output
  selected: false
  mandatory: false
  revision: 77317c91b91348530482d9003243afb707e4336181621daa0fc4d94f2a60532c
- reference_id: SRC-B901282055260709
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/draft/launch-advice-bd4145.md
  role: generated_output
  selected: false
  mandatory: false
  revision: b9012820552607094bab0d6106e91260fe10b0f53e1dda621e9551a1a36e691a
- reference_id: SRC-FE00D65003E03691
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/draft/launch-advice-97628f.md
  role: generated_output
  selected: false
  mandatory: false
  revision: fe00d65003e036914b4459cda8a8efe32e125472cc906580190ccb5cc7beaf68
- reference_id: SRC-2ECF582A778DC73A
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/draft/business-reply-f22594.md
  role: generated_output
  selected: false
  mandatory: false
  revision: 2ecf582a778dc73abce7f1c866dcf02e2324ae3ce31a511f7a0a9d05cd1bec7a
- reference_id: SRC-D7B84927A1C8DB1D
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/draft/product-control-checklist-7960e7.md
  role: generated_output
  selected: false
  mandatory: false
  revision: d7b84927a1c8db1d9401455a0d0627500c361cabebbe6ca119fc497e4174ca1c
- reference_id: SRC-8CCEC639A45B16B3
  path: 03_Matters/lumen-learning-us-family-launch-with-analytics-and-shared-device-f025e4/work-product/final/launch-advice-97628f-4d52f1.md
  role: generated_output
  selected: false
  mandatory: false
  revision: 8ccec639a45b16b3f3d3f00f9a3e1723bd412ba1852836b9039b2b83685a64d8
---
# Workspace
