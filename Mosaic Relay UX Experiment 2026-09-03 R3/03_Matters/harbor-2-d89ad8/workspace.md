---
matter_id: MAT-20260909-d89ad8
questions:
- question_id: Q-SAR
  business_question_id: BQ-c9d7c39f6380eb60
  business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  issue_id: null
  issue_ids: []
  question_kind: factual
  linked_fact_ids:
  - FACT-20260909-070aec
  answer_origin: reported
  source_message_id: MSG-20260909-2e549e
  source_action_key: workspace:f5233f9517feca0323f8898b818808c22023079e659354cf126a4701feb2d5c9
  source_revision: e6d30d422808ad91b171ef67ac4d673cd11e84fabfb2d5b3af1ab97ce90d6957
  text: Have the ~40 open alerts and the handful of SARs from the last year been reviewed,
    and what did they reveal?
  consequence: Unread open alerts and SARs are the highest-risk item; they can create
    BSA/AML exposure that must be addressed before close and could affect the deal
    itself.
  state: answered
  answer: The open alerts and SAR history have not been reviewed and remain in diligence.
  answer_kind: reported_fact
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-09T20:57:52+00:00'
- question_id: Q-KYC
  business_question_id: BQ-c9d7c39f6380eb60
  business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  issue_id: null
  issue_ids: []
  question_kind: factual
  linked_fact_ids:
  - FACT-20260909-620c62
  answer_origin: reported
  source_message_id: MSG-20260909-2e549e
  source_action_key: workspace:d26fe7118afd55388fb9f7efc30995e5ecdf14973b4b36937e1ed50b21b2222e
  source_revision: 146d87746a7ddafe6ca4db1807829d01197945da44738d350213dcf9a7e0a88a
  text: For the pre-2023 Harbor users with no underlying KYC documents, what is the
    plan to satisfy Mosaic Relay's own BSA/AML customer identification and recordkeeping
    obligations?
  consequence: Whether the missing underlying documents create a compliance gap depends
    on how Mosaic plans to satisfy its own CIP/recordkeeping obligations for these
    users.
  state: answered
  answer: It is not yet known whether Mosaic Relay's AML/CIP program permits reliance
    on Harbor's prior KYC; compliance must confirm.
  answer_kind: reported_fact
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-09T20:57:52+00:00'
- question_id: Q-MTL
  business_question_id: BQ-c9d7c39f6380eb60
  business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  issue_id: null
  issue_ids: []
  question_kind: factual
  linked_fact_ids:
  - FACT-20260909-771ee1
  answer_origin: reported
  source_message_id: MSG-20260909-2e549e
  source_action_key: workspace:696cd84283dc3a90b6fc1cbcf9d74a3be5d4cdb402afd6660f167ad60079b3f0
  source_revision: 31f43158e6078c30621c04d3ffa3814c8c69c99e52806846c348fd1c62e1fd1d
  text: For the four new markets opened by the combined license footprint, what is
    the plan for state money transmission licensing or approval before onboarding
    those customers?
  consequence: Whether the four new markets can be served at close depends on license
    transferability and state approval, which is a gating regulatory question.
  state: answered
  answer: Mosaic Relay currently plans to use or assume Harbor's licenses for the
    four new markets.
  answer_kind: reported_fact
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-09T20:57:53+00:00'
- question_id: Q-BONUS
  business_question_id: BQ-c9d7c39f6380eb60
  business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  issue_id: null
  issue_ids: []
  question_kind: factual
  linked_fact_ids: []
  answer_origin: legacy_intake
  source_message_id: MSG-20260909-2e549e
  source_action_key: workspace:373a04d75401d4a952f08c90d69d73409fe250c96ce0b19b6d97bebe339cd52f
  source_revision: 99180a18bd6ed5cd51af9cf8f56cf605bb77c47f7a72dbfb1109ef8281584e1b
  text: How is the $50 welcome bonus structured?
  consequence: The structure determines whether the bonus triggers consumer disclosure,
    funds-flow, or state promotional requirements.
  state: left_open
  answer: null
  answer_kind: null
  answer_source_ids: []
  answer_claim_ids: []
  updated_at: '2026-09-09T20:57:52+00:00'
interaction_receipts:
- receipt_id: IRC-41459a495fb83ae7aaa05f57
  source_action_key: workspace:d26fe7118afd55388fb9f7efc30995e5ecdf14973b4b36937e1ed50b21b2222e
  operation: answer_question
  target:
    condition_id: null
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260909-d89ad8
    business_question_id: BQ-c9d7c39f6380eb60
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
  before_revision: ce627559e94411b9a57a6fdea072a98d191d301793b616e574512ada69b92130
  after_revision: 146d87746a7ddafe6ca4db1807829d01197945da44738d350213dcf9a7e0a88a
  source_message_id: MSG-20260909-2e549e
  run_id: RUN-20260909-167143
  changed_links:
  - 03_Matters/harbor-2-d89ad8/facts.md
  - 03_Matters/harbor-2-d89ad8/workspace.md
  completed_parts:
  - reported_fact
  - supporting_question
  failure_detail: null
  created_at: '2026-09-09T20:57:52+00:00'
  request_fingerprint: 06cd1441719f0179f189b8186adb755628b3118550d53a7bd2a7f2a8a32035a7
- receipt_id: IRC-7537b1b92ff7eddb5bde7019
  source_action_key: workspace:f5233f9517feca0323f8898b818808c22023079e659354cf126a4701feb2d5c9
  operation: answer_question
  target:
    condition_id: null
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260909-d89ad8
    business_question_id: BQ-c9d7c39f6380eb60
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
  before_revision: 4e8963e29c6ebaf9e50182e15b78439fc00b9ab5fa2f2036ff39ff96f8195038
  after_revision: e6d30d422808ad91b171ef67ac4d673cd11e84fabfb2d5b3af1ab97ce90d6957
  source_message_id: MSG-20260909-2e549e
  run_id: RUN-20260909-167143
  changed_links:
  - 03_Matters/harbor-2-d89ad8/facts.md
  - 03_Matters/harbor-2-d89ad8/workspace.md
  completed_parts:
  - reported_fact
  - supporting_question
  failure_detail: null
  created_at: '2026-09-09T20:57:52+00:00'
  request_fingerprint: bb2b13b54cb1902e595ec3663d9983407390022128833ae77c292e94c712bffb
- receipt_id: IRC-d168c22ed70cec2cf492ddfa
  source_action_key: workspace:373a04d75401d4a952f08c90d69d73409fe250c96ce0b19b6d97bebe339cd52f
  operation: answer_question
  target:
    condition_id: null
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260909-d89ad8
    business_question_id: BQ-c9d7c39f6380eb60
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
  before_revision: 44579a6cc38c02b4cdaed375c8f3cbec6727063bc9175bfe991469f9d9e166d2
  after_revision: 99180a18bd6ed5cd51af9cf8f56cf605bb77c47f7a72dbfb1109ef8281584e1b
  source_message_id: MSG-20260909-2e549e
  run_id: RUN-20260909-167143
  changed_links:
  - 03_Matters/harbor-2-d89ad8/workspace.md
  completed_parts:
  - supporting_question
  failure_detail: null
  created_at: '2026-09-09T20:57:52+00:00'
  request_fingerprint: c9d67c841928b8d79379560dfc391596a45bb8552d51a704f016b99c00b2375b
- receipt_id: IRC-efa6600d61e0cd4ba041e1ed
  source_action_key: workspace:696cd84283dc3a90b6fc1cbcf9d74a3be5d4cdb402afd6660f167ad60079b3f0
  operation: answer_question
  target:
    condition_id: null
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260909-d89ad8
    business_question_id: BQ-c9d7c39f6380eb60
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
  before_revision: 7973708978173e66e329af44cf9ffd93e29bfbaa075a521b0dd10b719028cf5c
  after_revision: 31f43158e6078c30621c04d3ffa3814c8c69c99e52806846c348fd1c62e1fd1d
  source_message_id: MSG-20260909-2e549e
  run_id: RUN-20260909-167143
  changed_links:
  - 03_Matters/harbor-2-d89ad8/facts.md
  - 03_Matters/harbor-2-d89ad8/workspace.md
  completed_parts:
  - reported_fact
  - supporting_question
  failure_detail: null
  created_at: '2026-09-09T20:57:53+00:00'
  request_fingerprint: e7fa6eb6177437d411e4efce333c3cc4065378410f25368dc2e700e9311c3800
- receipt_id: RCP-3c48fdd1fe4de58ab05f
  source_action_key: experimental:5f80b069-c117-4f3c-bfa3-b0259c6b96b1
  operation: save_inquiry_result
  target:
    condition_id: null
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260909-d89ad8
    business_question_id: BQ-c9d7c39f6380eb60
    business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
    issue_id: null
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  after_revision: 587254741affc3b0c9151198854de84921ebe38129b3e20d3c78347074d8b02a
  source_message_id: null
  run_id: RUN-20260909-ba4ca3
  changed_links:
  - 03_Matters/harbor-2-d89ad8/conversations/inquiries/RUN-20260909-ba4ca3.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-09T21:07:05+00:00'
snapshot:
  short_answer: '**Issue** — The four workstreams are licensing, KYC/AML, alerts and
    monitoring, and marketing.


    **Rule** — State licensing rules, Mosaic’s AML program, federal financial-crime
    duties, and consumer-protection rules may apply. **No external authority retrieved.**


    **Analysis**


    - **Licensing:** Asset purchases usually require state review of license transfer,
    assignment, or new applications. The four new markets may not be available at
    close.

    - **KYC/AML:** Mosaic must confirm whether its program permits reliance on Harbor’s
    checks. Missing records may require new verification or account limits.

    - **Alerts and monitoring:** Unresolved alerts need review. The monitoring transfer
    needs testing, audit records, and a plan that prevents coverage gaps.

    - **Marketing:** The $50 bonus needs clear eligibility, payment, expiry, tax,
    and advertising terms. State promotion rules may also apply.


    **Conclusion** — All four need legal or compliance review before launch. Licensing
    and unread alerts are the likely closing risks.'
  answer_links:
  - 03_Matters/harbor-2-d89ad8/conversations/inquiries/RUN-20260909-ba4ca3.md
  run_id: RUN-20260909-ba4ca3
  generated_at: '2026-09-09T21:07:05+00:00'
  source_revisions:
    03_Matters/harbor-2-d89ad8/matter.md: a4c0776e04adefb0814fbfc95c877fff08b9875a6fefd9c72111937a366142e7
    03_Matters/harbor-2-d89ad8/dossier.md: ca0b7bd6f93a45825e751e78716cf27699fe6aa4fe085c7219cb61b496e74a3e
    03_Matters/harbor-2-d89ad8/facts.md: 687ddce08339bd9f40be26added021fb711fcff60d7e5b4cb99556855bf79e83
    03_Matters/harbor-2-d89ad8/issues.md: 6fea2651105b717cfe453d7dacf34a78f4c967840c924ba5f953ad062011247b
    03_Matters/harbor-2-d89ad8/recommendations.md: c5f301e522bf4d681558600f4c608fe21eda1188698224916e4d48fb11c1e90b
    03_Matters/harbor-2-d89ad8/request.md: 0ef0514950d98a1d80a10ec793b28fd26dae95b54a535214904d1fe851738d0e
    business_question: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  claims: []
issue_analyses:
  ISS-c9d7c39f63-94e42e2b38090045:
    analysis_id: IAN-b40c290911d6717ea4044cca
    analysis_revision: cb3eac1aa5b79f60e900483161374d0e4ad61899443ba42f633604cfb0114ddc
    source_path: 03_Matters/harbor-2-d89ad8/research/RES-20260910-fab195.md
    output_revision: 77e9820caed5326f40c60645d194ae115e81e2d93e0e2027ecf359b565238016
    run_id: RUN-20260910-ad73ff
    captured_at: '2026-09-10T00:47:43.220179+00:00'
problem_analysis_reference:
  analysis_id: PA-ae6c336e881248d925512cee
  analysis_revision: e427d255de93cd84a8dd0a3579ce26fd892f767d4f0684d9bf79565eb5b874c4
  source_path: 03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md
  output_revision: 55935ebb618a3419f18a3f43027cdc18aa00aae9c94768d9e36c451f2698083c
  run_id: RUN-20260911-d08e84
  captured_at: '2026-09-11T16:46:35.419344+00:00'
---
# Workspace
