---
matter_id: MAT-20260909-d89ad8
record_type: scenario
scenario_id: SCN-406906c91ab0aba4313b54a6
created_at: '2026-09-10T23:36:06+00:00'
updated_at: '2026-09-11T19:19:33+00:00'
scenario:
  parent_path_id: SCN-490c71c86d9c658974321c1e
  parent_revision: a8ed365925140d9a39580bdac0845adb5bc8d47b106748c24a2608a6bd2f0993
  path_kind: alternative
  archived_at: null
  hypothesis_summary: Test whether a partner-bank custody model could reduce Mosaic
    Relay's money-transmission exposure while preserving the current Harbor migration
    direction.
  actual_basis_refs:
  - 03_Matters/harbor-2-d89ad8/scenarios/history/SCN-490c71c86d9c658974321c1e/a8ed365925140d9a39580bdac0845adb5bc8d47b106748c24a2608a6bd2f0993.md
  current_analysis_ref: null
  recommendation_refs: []
  work_item_refs: []
  memory_ref: 03_Matters/harbor-2-d89ad8/memory/SCN-406906c91ab0aba4313b54a6/working.md
  scenario_id: SCN-406906c91ab0aba4313b54a6
  matter_id: MAT-20260909-d89ad8
  title: Bank-held funds structure
  baseline_revisions:
    03_Matters/harbor-2-d89ad8/matter.md: f2736eea0dc22c7c936695ba3ab3e6c2bff16c81397046aca405e64fc48025a2
    03_Matters/harbor-2-d89ad8/dossier.md: 2ce39ec1eba1ca3e1d5a36129e31576ddba93b5aef99e0b535afbd13973d5bcc
    03_Matters/harbor-2-d89ad8/facts.md: 687ddce08339bd9f40be26added021fb711fcff60d7e5b4cb99556855bf79e83
    03_Matters/harbor-2-d89ad8/issues.md: 6fea2651105b717cfe453d7dacf34a78f4c967840c924ba5f953ad062011247b
    03_Matters/harbor-2-d89ad8/recommendations.md: c5f301e522bf4d681558600f4c608fe21eda1188698224916e4d48fb11c1e90b
    03_Matters/harbor-2-d89ad8/request.md: 0ef0514950d98a1d80a10ec793b28fd26dae95b54a535214904d1fe851738d0e
    business_question: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  issue_ids: []
  proposed_fact_changes:
  - change_id: bank-holds-funds
    fact_id: null
    text: For this hypothetical only, a partner bank holds customer funds.
  unresolved_conditions:
  - Who contracts directly with users.
  - Who controls transfer instructions and settlement.
  - Who records balances and owes repayment to users.
  - How KYC, transaction monitoring, alerts, SARs, privacy, and marketing duties are
    allocated.
  analysis: '“Operative authority” means the **current, effective law or regulator
    instruction that controls the proposed transaction in a specific state**.


    I did not retrieve and inspect an exact state provision that answers:


    - whether Harbor’s license can transfer in an asset sale;

    - whether Harbor or Mosaic must give notice or obtain approval;

    - whether Mosaic can operate while an application is pending;

    - whether Harbor can continue as the licensed provider after closing; or

    - when Harbor can surrender its license and bonds.


    The research found a **model act** and a general New York licensing page. A model
    act is suggested text. It applies only if a state enacted it, and the state can
    change the text. A general licensing page does not answer the transaction-specific
    questions above.


    The four Harbor-only states were also not identified. Therefore, I could not determine
    which enacted state laws or regulator procedures control.


    My earlier statement did **not** mean that no relevant law exists. It meant that
    the available research did not provide enough state-specific legal text to verify
    the conclusion. The recommendation was therefore cautious analysis, not a verified
    state-law determination.'
  source_links: []
  created_at: '2026-09-10T23:36:06+00:00'
  adopted_fact_ids: &id001 []
  related_analysis: &id002 []
  analysis_state: completed
  analysis_run_id: RUN-20260911-4fc268
  analysis_source_action_key: null
  analysis_baseline_revisions:
    03_Matters/harbor-2-d89ad8/matter.md: f2736eea0dc22c7c936695ba3ab3e6c2bff16c81397046aca405e64fc48025a2
    03_Matters/harbor-2-d89ad8/dossier.md: 2ce39ec1eba1ca3e1d5a36129e31576ddba93b5aef99e0b535afbd13973d5bcc
    03_Matters/harbor-2-d89ad8/facts.md: 687ddce08339bd9f40be26added021fb711fcff60d7e5b4cb99556855bf79e83
    03_Matters/harbor-2-d89ad8/issues.md: 6fea2651105b717cfe453d7dacf34a78f4c967840c924ba5f953ad062011247b
    03_Matters/harbor-2-d89ad8/recommendations.md: c5f301e522bf4d681558600f4c608fe21eda1188698224916e4d48fb11c1e90b
    03_Matters/harbor-2-d89ad8/request.md: 0ef0514950d98a1d80a10ec793b28fd26dae95b54a535214904d1fe851738d0e
    business_question: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
  affected_issue_ids: []
  affected_branch_ids: []
  claim_ids: []
  proposed_outcomes: []
  failure_detail: null
  stale:
    is_stale: false
    changed_revisions: {}
  updated_at: null
  revision: ''
adopted_fact_ids: *id001
related_analysis: *id002
source_action:
  key: experimental:6da1ead1-bb7d-48d1-87c9-9eaca72b8afb
  fingerprint: 3ba25b3544f2ef076860e855cf21e550c9627d95296f53e2ae2e3577a6d6ca70
revision: e41d4e3bbcfb9a98099392f15a7453dfb8110fd00675afc78b2d4b7b5be1be1e
immutable: true
captured_at: '2026-09-11T23:31:03+00:00'
snapshot_revision: df831774d4154cb3b3bea7ecfe0b1e275adbc1cf9dffcee913a6c1eebb76e7a4
preserved_records:
  03_Matters/harbor-2-d89ad8/facts.md:
    content: '# Known Facts


      - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).

      - Migration moves 240k consumer users and 12k business accounts into Mosaic
      Relay''s app on day 1 post-close, with one unified account and balance and full
      access to Mosaic''s product set.

      - Plan is no re-verification; Harbor users were already KYC''d by Harbor.

      - Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay
      holds 41; combined footprint is 44 states, opening four new markets.

      - Harbor''s KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
      results for everyone but not the underlying documents for users onboarded before
      2023.

      - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint Harbor''s transaction feed at Mosaic''s engine
      on day 1.

      - Marketing wants a ''Welcome'' campaign with a $50 bonus on first transfer,
      launching close+1.

      - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
      year at Harbor; nobody has read them yet.

      - Migration moves 240k consumer users and 12k business accounts into Mosaic
      Relay''s app on day 1 post-close, with one unified account and balance.

      - Plan is no re-verification of Harbor''s existing KYC; Harbor users were already
      KYC''d.

      - Harbor''s KYC ran through a vendor that shut down in 2024; pass/fail results
      exist for everyone but underlying documents are missing for users onboarded
      before 2023.

      - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint the transaction feed to Mosaic Relay''s engine
      on day 1.

      - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
      year at Harbor; none have been read yet.

      - How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic buys
      Harbor''s assets)

      - Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
      prior KYC without re-verification, or is re-verification required? — Not sure
      / need to check with compliance

      - What is known about Harbor''s ~40 open alerts and the SARs from the last year?
      — Nothing reviewed yet — still in diligence

      - For the four new markets opened by the combined footprint, does Mosaic Relay
      plan to operate under Harbor''s existing licenses or apply for its own? — Use/assume
      Harbor''s licenses

      - For the pre-2023 Harbor users with no underlying KYC documents, what is the
      plan to satisfy Mosaic Relay''s own BSA/AML customer identification and recordkeeping
      obligations? — It is not yet known whether Mosaic Relay''s AML/CIP program permits
      reliance on Harbor''s prior KYC; compliance must confirm.

      - Have the ~40 open alerts and the handful of SARs from the last year been reviewed,
      and what did they reveal? — The open alerts and SAR history have not been reviewed
      and remain in diligence.

      - For the four new markets opened by the combined license footprint, what is
      the plan for state money transmission licensing or approval before onboarding
      those customers? — Mosaic Relay currently plans to use or assume Harbor''s licenses
      for the four new markets.


      ## Assumptions


      - [Assumption] Mosaic Relay''s existing money transmission licenses and Harbor''s
      MTLs are transferable or can be maintained through the acquisition without new
      state approval

      - [Assumption] The KYC pass/fail results are sufficient to satisfy Mosaic Relay''s
      own BSA/AML program obligations without the underlying documents

      - [Assumption] The transaction monitoring repoint can be completed and validated
      before close without a monitoring gap

      - [Assumption] Harbor Pay is a licensed money transmitter subject to state MTL
      regimes and federal BSA/AML obligations (not yet confirmed).

      - [Assumption] Mosaic Relay is itself a licensed money transmitter in 41 states
      (per the request).

      - [Assumption] The acquisition is structured as an asset or stock purchase,
      which affects whether Harbor''s licenses and SAR/alert obligations transfer
      (structure not yet confirmed).

      '
    metadata:
      matter_id: MAT-20260909-d89ad8
      record_type: facts
      facts:
      - fact_id: FACT-20260909-182bcc
        text: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks
          out).
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-551367
        text: Migration moves 240k consumer users and 12k business accounts into Mosaic
          Relay's app on day 1 post-close, with one unified account and balance and
          full access to Mosaic's product set.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-9a0c61
        text: Plan is no re-verification; Harbor users were already KYC'd by Harbor.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-33293c
        text: Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic
          Relay holds 41; combined footprint is 44 states, opening four new markets.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-aea8ec
        text: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic has
          pass/fail results for everyone but not the underlying documents for users
          onboarded before 2023.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-073838
        text: Harbor's transaction monitoring is a third-party SaaS whose contract
          terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's
          engine on day 1.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-19aebc
        text: Marketing wants a 'Welcome' campaign with a $50 bonus on first transfer,
          launching close+1.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-adf2cb
        text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the last
          year at Harbor; nobody has read them yet.
        status: active
        material: true
        source_ids:
        - REQ-20260909-283892
        supersedes: null
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - fact_id: FACT-20260909-4c1fd8
        text: Migration moves 240k consumer users and 12k business accounts into Mosaic
          Relay's app on day 1 post-close, with one unified account and balance.
        status: active
        material: true
        source_ids:
        - MSG-20260909-9835ba
        supersedes: null
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - fact_id: FACT-20260909-f2c49f
        text: Plan is no re-verification of Harbor's existing KYC; Harbor users were
          already KYC'd.
        status: active
        material: true
        source_ids:
        - MSG-20260909-9835ba
        supersedes: null
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - fact_id: FACT-20260909-13d4c1
        text: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail
          results exist for everyone but underlying documents are missing for users
          onboarded before 2023.
        status: active
        material: true
        source_ids:
        - MSG-20260909-9835ba
        supersedes: null
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - fact_id: FACT-20260909-78d5cd
        text: Harbor's transaction monitoring is a third-party SaaS whose contract
          terminates at close; plan is to repoint the transaction feed to Mosaic Relay's
          engine on day 1.
        status: active
        material: true
        source_ids:
        - MSG-20260909-9835ba
        supersedes: null
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - fact_id: FACT-20260909-9f7bde
        text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the last
          year at Harbor; none have been read yet.
        status: active
        material: true
        source_ids:
        - MSG-20260909-9835ba
        supersedes: null
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - fact_id: FACT-20260909-ed9f06
        text: How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic
          buys Harbor's assets)
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:56:00+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9497db
      - fact_id: FACT-20260909-b5e71e
        text: Does Mosaic Relay's AML/CIP program currently permit relying on another
          institution's prior KYC without re-verification, or is re-verification required?
          — Not sure / need to check with compliance
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:56:00+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9497db
      - fact_id: FACT-20260909-849b00
        text: What is known about Harbor's ~40 open alerts and the SARs from the last
          year? — Nothing reviewed yet — still in diligence
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:56:00+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9497db
      - fact_id: FACT-20260909-f0fb01
        text: For the four new markets opened by the combined footprint, does Mosaic
          Relay plan to operate under Harbor's existing licenses or apply for its
          own? — Use/assume Harbor's licenses
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:56:00+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9497db
      - fact_id: FACT-20260909-620c62
        text: For the pre-2023 Harbor users with no underlying KYC documents, what
          is the plan to satisfy Mosaic Relay's own BSA/AML customer identification
          and recordkeeping obligations? — It is not yet known whether Mosaic Relay's
          AML/CIP program permits reliance on Harbor's prior KYC; compliance must
          confirm.
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:57:52+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-7091da
      - fact_id: FACT-20260909-070aec
        text: Have the ~40 open alerts and the handful of SARs from the last year
          been reviewed, and what did they reveal? — The open alerts and SAR history
          have not been reviewed and remain in diligence.
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:57:52+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9196a6
      - fact_id: FACT-20260909-771ee1
        text: For the four new markets opened by the combined license footprint, what
          is the plan for state money transmission licensing or approval before onboarding
          those customers? — Mosaic Relay currently plans to use or assume Harbor's
          licenses for the four new markets.
        status: active
        material: true
        source_ids:
        - MSG-20260909-2e549e
        supersedes: null
        created_at: '2026-09-09T20:57:53+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-a14129
      sources:
      - source_id: REQ-20260909-283892
        kind: immutable_request
        label: Original request
        path: 03_Matters/harbor-2-d89ad8/request.md
        version: ''
        location: ''
        created_at: '2026-09-09T20:52:49+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-754cca
      - source_id: MSG-20260909-9835ba
        kind: conversation_message
        label: Matter intake response
        path: null
        version: ''
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-20855c
      - source_id: MSG-20260909-2e549e
        kind: conversation_message
        label: Matter intake response
        path: null
        version: ''
        location: ''
        created_at: '2026-09-09T20:56:00+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-c347a2
      - source_id: MSG-20260909-2e549e
        kind: conversation
        label: Reported answer
        path: null
        version: ''
        location: MSG-20260909-2e549e
        created_at: '2026-09-09T20:57:52+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-7091da
      - source_id: MSG-20260909-2e549e
        kind: conversation
        label: Reported answer
        path: null
        version: ''
        location: MSG-20260909-2e549e
        created_at: '2026-09-09T20:57:52+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-9196a6
      - source_id: MSG-20260909-2e549e
        kind: conversation
        label: Reported answer
        path: null
        version: ''
        location: MSG-20260909-2e549e
        created_at: '2026-09-09T20:57:53+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-a14129
      support:
      - support_id: SUP-20260909-f1b4e2
        fact_id: FACT-20260909-182bcc
        source_id: REQ-20260909-283892
        relationship: support
        statement: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10
          weeks out).
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-08cb52
        fact_id: FACT-20260909-551367
        source_id: REQ-20260909-283892
        relationship: support
        statement: Migration moves 240k consumer users and 12k business accounts into
          Mosaic Relay's app on day 1 post-close, with one unified account and balance
          and full access to Mosaic's product set.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-0d90cf
        fact_id: FACT-20260909-9a0c61
        source_id: REQ-20260909-283892
        relationship: support
        statement: Plan is no re-verification; Harbor users were already KYC'd by
          Harbor.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-e10882
        fact_id: FACT-20260909-33293c
        source_id: REQ-20260909-283892
        relationship: support
        statement: Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic
          Relay holds 41; combined footprint is 44 states, opening four new markets.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-eea757
        fact_id: FACT-20260909-aea8ec
        source_id: REQ-20260909-283892
        relationship: support
        statement: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic
          has pass/fail results for everyone but not the underlying documents for
          users onboarded before 2023.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-443d01
        fact_id: FACT-20260909-073838
        source_id: REQ-20260909-283892
        relationship: support
        statement: Harbor's transaction monitoring is a third-party SaaS whose contract
          terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's
          engine on day 1.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-7cc15f
        fact_id: FACT-20260909-19aebc
        source_id: REQ-20260909-283892
        relationship: support
        statement: Marketing wants a 'Welcome' campaign with a $50 bonus on first
          transfer, launching close+1.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-3ec21f
        fact_id: FACT-20260909-adf2cb
        source_id: REQ-20260909-283892
        relationship: support
        statement: Diligence flagged ~40 open alerts and 'a handful' of SARs from
          the last year at Harbor; nobody has read them yet.
        location: ''
        created_at: '2026-09-09T20:53:13+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - support_id: SUP-20260909-ce35f6
        fact_id: FACT-20260909-182bcc
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10
          weeks out).
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-68355c
        fact_id: FACT-20260909-4c1fd8
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Migration moves 240k consumer users and 12k business accounts into
          Mosaic Relay's app on day 1 post-close, with one unified account and balance.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-a1f8ea
        fact_id: FACT-20260909-f2c49f
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Plan is no re-verification of Harbor's existing KYC; Harbor users
          were already KYC'd.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-5a5eab
        fact_id: FACT-20260909-33293c
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic
          Relay holds 41; combined footprint is 44 states, opening four new markets.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-ccd85e
        fact_id: FACT-20260909-13d4c1
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail
          results exist for everyone but underlying documents are missing for users
          onboarded before 2023.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-e29698
        fact_id: FACT-20260909-78d5cd
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Harbor's transaction monitoring is a third-party SaaS whose contract
          terminates at close; plan is to repoint the transaction feed to Mosaic Relay's
          engine on day 1.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-6ff656
        fact_id: FACT-20260909-19aebc
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Marketing wants a 'Welcome' campaign with a $50 bonus on first
          transfer, launching close+1.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - support_id: SUP-20260909-2770d9
        fact_id: FACT-20260909-9f7bde
        source_id: MSG-20260909-9835ba
        relationship: support
        statement: Diligence flagged ~40 open alerts and 'a handful' of SARs from
          the last year at Harbor; none have been read yet.
        location: ''
        created_at: '2026-09-09T20:53:14+00:00'
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      assumptions:
      - assumption_id: ASM-20260909-29b823
        text: Mosaic Relay's existing money transmission licenses and Harbor's MTLs
          are transferable or can be maintained through the acquisition without new
          state approval
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:13+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - assumption_id: ASM-20260909-3c5756
        text: The KYC pass/fail results are sufficient to satisfy Mosaic Relay's own
          BSA/AML program obligations without the underlying documents
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:13+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - assumption_id: ASM-20260909-1a519f
        text: The transaction monitoring repoint can be completed and validated before
          close without a monitoring gap
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:13+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-944bfb
      - assumption_id: ASM-20260909-ca7dfd
        text: Harbor Pay is a licensed money transmitter subject to state MTL regimes
          and federal BSA/AML obligations (not yet confirmed).
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:14+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - assumption_id: ASM-20260909-d40239
        text: Mosaic Relay is itself a licensed money transmitter in 41 states (per
          the request).
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:14+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      - assumption_id: ASM-20260909-57e86b
        text: The acquisition is structured as an asset or stock purchase, which affects
          whether Harbor's licenses and SAR/alert obligations transfer (structure
          not yet confirmed).
        reason: Needed to continue
        material: true
        status: open
        created_at: '2026-09-09T20:53:14+00:00'
        resolved_at: null
        withdrawn_at: null
        action_id: ACT-20260909-44937b
      conflicts: []
      actions:
      - action_id: ACT-20260909-754cca
        summary: Linked Original request
        actor: system
        created_at: '2026-09-09T20:52:49+00:00'
        status: applied
        created:
          facts: []
          sources:
          - REQ-20260909-283892
          support: []
          assumptions: []
        source_action_key: null
      - action_id: ACT-20260909-944bfb
        summary: Applied an Intake Agent turn
        actor: assistant
        created_at: '2026-09-09T20:53:13+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-182bcc
          - FACT-20260909-551367
          - FACT-20260909-9a0c61
          - FACT-20260909-33293c
          - FACT-20260909-aea8ec
          - FACT-20260909-073838
          - FACT-20260909-19aebc
          - FACT-20260909-adf2cb
          sources: []
          support:
          - SUP-20260909-f1b4e2
          - SUP-20260909-08cb52
          - SUP-20260909-0d90cf
          - SUP-20260909-e10882
          - SUP-20260909-eea757
          - SUP-20260909-443d01
          - SUP-20260909-7cc15f
          - SUP-20260909-3ec21f
          assumptions:
          - ASM-20260909-29b823
          - ASM-20260909-3c5756
          - ASM-20260909-1a519f
        source_action_key: chat:RUN-20260909-adcddd:tool:81a64318c8ddfceeba36a911
      - action_id: ACT-20260909-20855c
        summary: Linked Matter intake response
        actor: system
        created_at: '2026-09-09T20:53:14+00:00'
        status: applied
        created:
          facts: []
          sources:
          - MSG-20260909-9835ba
          support: []
          assumptions: []
        source_action_key: null
      - action_id: ACT-20260909-44937b
        summary: Applied an Intake Agent turn
        actor: assistant
        created_at: '2026-09-09T20:53:14+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-4c1fd8
          - FACT-20260909-f2c49f
          - FACT-20260909-13d4c1
          - FACT-20260909-78d5cd
          - FACT-20260909-9f7bde
          sources: []
          support:
          - SUP-20260909-ce35f6
          - SUP-20260909-68355c
          - SUP-20260909-a1f8ea
          - SUP-20260909-5a5eab
          - SUP-20260909-ccd85e
          - SUP-20260909-e29698
          - SUP-20260909-6ff656
          - SUP-20260909-2770d9
          assumptions:
          - ASM-20260909-ca7dfd
          - ASM-20260909-d40239
          - ASM-20260909-57e86b
        source_action_key: experimental:902c1082-8933-4f35-be7c-163433bd0a08:tool:c311bec76624632dd2efd032
      - action_id: ACT-20260909-c347a2
        summary: Linked Matter intake response
        actor: system
        created_at: '2026-09-09T20:56:00+00:00'
        status: applied
        created:
          facts: []
          sources:
          - MSG-20260909-2e549e
          support: []
          assumptions: []
        source_action_key: null
      - action_id: ACT-20260909-9497db
        summary: Recorded intake question answers
        actor: user
        created_at: '2026-09-09T20:56:00+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-ed9f06
          - FACT-20260909-b5e71e
          - FACT-20260909-849b00
          - FACT-20260909-f0fb01
          sources: []
          support: []
          assumptions: []
        source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf:answers
      - action_id: ACT-20260909-7091da
        summary: Reported answer to supporting question
        actor: user
        created_at: '2026-09-09T20:57:52+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-620c62
          sources:
          - MSG-20260909-2e549e
          support: []
          assumptions: []
        source_action_key: workspace:workspace:d26fe7118afd55388fb9f7efc30995e5ecdf14973b4b36937e1ed50b21b2222e:answer
      - action_id: ACT-20260909-9196a6
        summary: Reported answer to supporting question
        actor: user
        created_at: '2026-09-09T20:57:52+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-070aec
          sources:
          - MSG-20260909-2e549e
          support: []
          assumptions: []
        source_action_key: workspace:workspace:f5233f9517feca0323f8898b818808c22023079e659354cf126a4701feb2d5c9:answer
      - action_id: ACT-20260909-a14129
        summary: Reported answer to supporting question
        actor: user
        created_at: '2026-09-09T20:57:53+00:00'
        status: applied
        created:
          facts:
          - FACT-20260909-771ee1
          sources:
          - MSG-20260909-2e549e
          support: []
          assumptions: []
        source_action_key: workspace:workspace:696cd84283dc3a90b6fc1cbcf9d74a3be5d4cdb402afd6660f167ad60079b3f0:answer
      working_ask: Does the Harbor Pay acquisition migration require legal review
        before the Nov 15 close, and what legal workstreams must be addressed pre-close
        (money transmission licensing, KYC/BSA-AML, SAR/alerts handling, monitoring
        vendor transition, and the welcome bonus campaign)?
      issues:
      - 'Money transmission licensing: whether Mosaic Relay can operate under the
        combined 44-state footprint and whether Harbor''s MTLs transfer/survive the
        acquisition'
      - 'BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
        documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML
        obligations'
      - 'SAR and alert handling: obligations to review, file, and manage Harbor''s
        ~40 open alerts and SARs, and successor liability'
      - 'Monitoring vendor transition: continuity of transaction monitoring when the
        SaaS contract terminates at close'
      - 'Marketing compliance: the $50 welcome bonus offer and any state money transmission
        or consumer protection implications'
      open_questions:
      - Acquisition structure (asset vs. stock purchase) — determines whether Harbor's
        MTLs and regulatory obligations transfer to Mosaic Relay
      - Whether Harbor's state MTLs can be assumed/transferred or must be re-applied
        for in the four new markets
      - Whether Mosaic Relay's own AML program and CIP can lawfully rely on Harbor's
        prior KYC without re-verification
      - Details of the ~40 open alerts and SARs (nature, age, whether any are unresolved
        or reportable)
      - Whether the $50 welcome bonus is a deposit/interest-like offer implicating
        state money transmission or consumer protection rules
      public_research_questions:
      - State money transmitter license transfer/assumption requirements in an acquisition
        context
      - BSA/AML CIP obligations when relying on a prior financial institution's KYC
        in a merger/acquisition
      - Successor obligations for open SARs and alerts in an acquisition
      intake_answers:
      - answer_id: ANS-20260909-20ba3f
        question_id: Q-ACQ-STRUCTURE
        question: How is the Harbor Pay acquisition structured?
        answer: Asset purchase (Mosaic buys Harbor's assets)
        values:
        - asset_purchase
        status: answered
        record_target: fact
        source_id: MSG-20260909-2e549e
        source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
        answered_at: '2026-09-09T20:56:00+00:00'
        answer_fact_id: FACT-20260909-ed9f06
      - answer_id: ANS-20260909-da570f
        question_id: Q-KYC-RELY
        question: Does Mosaic Relay's AML/CIP program currently permit relying on
          another institution's prior KYC without re-verification, or is re-verification
          required?
        answer: Not sure / need to check with compliance
        values:
        - unknown
        status: answered
        record_target: fact
        source_id: MSG-20260909-2e549e
        source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
        answered_at: '2026-09-09T20:56:00+00:00'
        answer_fact_id: FACT-20260909-b5e71e
      - answer_id: ANS-20260909-9e7b7a
        question_id: Q-SAR-ALERTS
        question: What is known about Harbor's ~40 open alerts and the SARs from the
          last year?
        answer: Nothing reviewed yet — still in diligence
        values:
        - unreviewed
        status: answered
        record_target: fact
        source_id: MSG-20260909-2e549e
        source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
        answered_at: '2026-09-09T20:56:00+00:00'
        answer_fact_id: FACT-20260909-849b00
      - answer_id: ANS-20260909-1833c6
        question_id: Q-MTL-NEW-MARKETS
        question: For the four new markets opened by the combined footprint, does
          Mosaic Relay plan to operate under Harbor's existing licenses or apply for
          its own?
        answer: Use/assume Harbor's licenses
        values:
        - use_harbor_licenses
        status: answered
        record_target: fact
        source_id: MSG-20260909-2e549e
        source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
        answered_at: '2026-09-09T20:56:00+00:00'
        answer_fact_id: FACT-20260909-f0fb01
      intake_state: complete
  03_Matters/harbor-2-d89ad8/recommendations.md:
    content: '## Working position


      The Harbor Pay migration needs legal and compliance review before the planned
      close. The leading concern is that an asset purchase generally requires Mosaic
      Relay to confirm its own authority to operate in each state; the current plan
      to use or assume Harbor''s licenses is not established as legally effective.


      The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether
      its AML/CIP program permits reliance on Harbor''s prior KYC, and underlying
      records are missing for some pre-2023 users. Harbor''s open alerts and SAR history
      also remain unread. These gaps make a day-one migration without re-verification
      or account restrictions difficult to support.


      Transaction monitoring continuity is also material because Harbor''s vendor
      ends at close. The repointed feed should be tested and validated before migrated
      users receive full access. The $50 bonus is lower priority but still needs review
      once its eligibility, funding, terms, and disclosures are known.


      ## Plausible alternatives


      A narrower launch could exclude the four new markets, restrict users whose KYC
      evidence is incomplete, or delay full product access until alert review and
      monitoring validation finish. A full day-one launch remains possible only if
      state licensing, AML/CIP reliance, alert handling, and monitoring continuity
      are confirmed.


      ## Material facts and assumptions


      Reported facts include the asset-purchase structure, the current plan to rely
      on Harbor''s licenses, the lack of a compliance answer on KYC reliance, and
      the unread alerts and SAR history. The analysis assumes both entities conduct
      regulated money-transmission activity and that Mosaic Relay will become the
      operating provider immediately after close. It does not assume that Harbor''s
      licenses transfer or that Harbor''s KYC is sufficient.


      ## What could change this view


      The view could change if state counsel confirms an effective licensing path
      for each affected state, compliance confirms permissible reliance with adequate
      records or remediation, diligence clears the alerts and SAR history, and testing
      shows no monitoring gap. The bonus structure remains unknown.


      ## Support limit


      This is generated analysis based on reported matter facts. No external authority
      was retrieved.

      '
    metadata:
      matter_id: MAT-20260909-d89ad8
      record_type: recommendations
      current_recommendation_version_id: REC-20260909-7112e7
      recommendation_versions:
      - version_id: REC-20260909-7112e7
        number: 1
        content: '## Working position


          The Harbor Pay migration needs legal and compliance review before the planned
          close. The leading concern is that an asset purchase generally requires
          Mosaic Relay to confirm its own authority to operate in each state; the
          current plan to use or assume Harbor''s licenses is not established as legally
          effective.


          The second concern is BSA/AML readiness. Mosaic Relay has not confirmed
          whether its AML/CIP program permits reliance on Harbor''s prior KYC, and
          underlying records are missing for some pre-2023 users. Harbor''s open alerts
          and SAR history also remain unread. These gaps make a day-one migration
          without re-verification or account restrictions difficult to support.


          Transaction monitoring continuity is also material because Harbor''s vendor
          ends at close. The repointed feed should be tested and validated before
          migrated users receive full access. The $50 bonus is lower priority but
          still needs review once its eligibility, funding, terms, and disclosures
          are known.


          ## Plausible alternatives


          A narrower launch could exclude the four new markets, restrict users whose
          KYC evidence is incomplete, or delay full product access until alert review
          and monitoring validation finish. A full day-one launch remains possible
          only if state licensing, AML/CIP reliance, alert handling, and monitoring
          continuity are confirmed.


          ## Material facts and assumptions


          Reported facts include the asset-purchase structure, the current plan to
          rely on Harbor''s licenses, the lack of a compliance answer on KYC reliance,
          and the unread alerts and SAR history. The analysis assumes both entities
          conduct regulated money-transmission activity and that Mosaic Relay will
          become the operating provider immediately after close. It does not assume
          that Harbor''s licenses transfer or that Harbor''s KYC is sufficient.


          ## What could change this view


          The view could change if state counsel confirms an effective licensing path
          for each affected state, compliance confirms permissible reliance with adequate
          records or remediation, diligence clears the alerts and SAR history, and
          testing shows no monitoring gap. The bonus structure remains unknown.


          ## Support limit


          This is generated analysis based on reported matter facts. No external authority
          was retrieved.'
        actor: Themis.ai
        origin: initial_agent
        created_at: '2026-09-09T20:57:53+00:00'
        next_action: Before close planning proceeds, obtain a state-by-state licensing
          determination for the four new markets and review the open alerts and SAR
          history.
      recommendation_updated_at: '2026-09-09T20:57:53+00:00'
      recommendation_updated_by: Themis.ai
      proposed_recommendation:
        version_id: REC-20260911-c7db2f
        number: 2
        content: '### Saved overall view


          The Harbor Pay migration needs legal and compliance review before the planned
          close. The leading concern is that an asset purchase generally requires
          Mosaic Relay to confirm its own authority to operate in each state; the
          current plan to use or assume Harbor''s licenses is not established as legally
          effective.


          The second concern is BSA/AML readiness. Mosaic Relay has not confirmed
          whether its AML/CIP program permits reliance on Harbor''s prior KYC, and
          underlying records are missing for some pre-2023 users. Harbor''s open alerts
          and SAR history also remain unread. These gaps make a day-one migration
          without re-verification or account restrictions difficult to support.


          Transaction monitoring continuity is also material because Harbor''s vendor
          ends at close. The repointed feed should be tested and validated before
          migrated users receive full access. The $50 bonus is lower priority but
          still needs review once its eligibility, funding, terms, and disclosures
          are known.


          ### Workstream positions


          Research progress is separate from the lawyer''s conclusion.


          | Workstream | Current analysis | Research state |

          |---|---|---|

          | Money transmission licensing: whether Mosaic Relay can operate under the
          combined 44-state footprint and whether Harbor''s MTLs transfer/survive
          the acquisition | Do not rely on transferability without an applicable state
          rule, approval, or written regulator position.  The answer must be determined
          state by state and must cover more than technical change-of-control rules.  This
          path is possible only if Harbor remains the real provider and the relevant
          states permit the arrangement. The unified Mosaic account design may conflict
          with that position.  The result depends on the contracts and actual funds
          flow. Custody alone should not be treated as a licensing exemption or transfer
          mechanism. Next: Identify the four Harbor-only states and complete one matrix
          covering license authority, transaction filings, interim operation, bank
          custody, outstanding obligations, and license surrender. [Full research](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
          | Research added. 4 sources retrieved; 0 with passages read. |

          | BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing
          underlying documents for pre-2023 users) satisfies Mosaic Relay''s independent
          CIP/AML obligations | No separate issue position saved. The saved overall
          view remains available. | No research update saved. |

          | SAR and alert handling: obligations to review, file, and manage Harbor''s
          ~40 open alerts and SARs, and successor liability | No separate issue position
          saved. The saved overall view remains available. | No research update saved.
          |

          | Monitoring vendor transition: continuity of transaction monitoring when
          the SaaS contract terminates at close | No separate issue position saved.
          The saved overall view remains available. | No research update saved. |

          | Marketing compliance: the $50 welcome bonus offer and any state money
          transmission or consumer protection implications | No separate issue position
          saved. The saved overall view remains available. | No research update saved.
          |


          ### Latest research update


          Research updated: Money transmission licensing: whether Mosaic Relay can
          operate under the combined 44-state footprint and whether Harbor''s MTLs
          transfer/survive the acquisition. Other workstreams retain their prior position.


          [Read the full research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
          — 4 sources retrieved; 0 with passages read.


          <details>

          <summary>Earlier saved position — 2026-09-09T20:57:53+00:00</summary>


          **Working position**


          The Harbor Pay migration needs legal and compliance review before the planned
          close. The leading concern is that an asset purchase generally requires
          Mosaic Relay to confirm its own authority to operate in each state; the
          current plan to use or assume Harbor''s licenses is not established as legally
          effective.


          The second concern is BSA/AML readiness. Mosaic Relay has not confirmed
          whether its AML/CIP program permits reliance on Harbor''s prior KYC, and
          underlying records are missing for some pre-2023 users. Harbor''s open alerts
          and SAR history also remain unread. These gaps make a day-one migration
          without re-verification or account restrictions difficult to support.


          Transaction monitoring continuity is also material because Harbor''s vendor
          ends at close. The repointed feed should be tested and validated before
          migrated users receive full access. The $50 bonus is lower priority but
          still needs review once its eligibility, funding, terms, and disclosures
          are known.


          **Plausible alternatives**


          A narrower launch could exclude the four new markets, restrict users whose
          KYC evidence is incomplete, or delay full product access until alert review
          and monitoring validation finish. A full day-one launch remains possible
          only if state licensing, AML/CIP reliance, alert handling, and monitoring
          continuity are confirmed.


          **Material facts and assumptions**


          Reported facts include the asset-purchase structure, the current plan to
          rely on Harbor''s licenses, the lack of a compliance answer on KYC reliance,
          and the unread alerts and SAR history. The analysis assumes both entities
          conduct regulated money-transmission activity and that Mosaic Relay will
          become the operating provider immediately after close. It does not assume
          that Harbor''s licenses transfer or that Harbor''s KYC is sufficient.


          **What could change this view**


          The view could change if state counsel confirms an effective licensing path
          for each affected state, compliance confirms permissible reliance with adequate
          records or remediation, diligence clears the alerts and SAR history, and
          testing shows no monitoring gap. The bonus structure remains unknown.


          **Support limit**


          This is generated analysis based on reported matter facts. No external authority
          was retrieved.


          </details>'
        actor: counsel-copilot
        origin: agent_proposal
        created_at: '2026-09-11T21:15:50+00:00'
        next_action: Identify the four Harbor-only states and complete one matrix
          covering license authority, transaction filings, interim operation, bank
          custody, outstanding obligations, and license surrender.
        research_publication:
          key: research:RUN-20260911-d08e84:55935ebb618a3419f18a3f43027cdc18aa00aae9c94768d9e36c451f2698083c
          basis: &id003
            business_question_revision: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
            facts_hash: 2e9897aab6bb8d0eaa4b57c94a80a3117de87748a5da3235cb2f00a998bb2b69
            recommendations_hash: 88edad26d43865c763a77dc571b3f1cf60256b7ff1705850c71ee3a0cbf6f948
            dossier_hash: be51d17000d0a58be2625ac3ead8c7f6cc9ad5b90b7ffabaa8a4ec1dacd7ab4a
          packet_path: 03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md
          reconciliation_pending: true
          assumption_summary: 'This answer did not identify any assumptions it relies
            on. Reported facts remain in Material facts.


            <details>

            <summary>Earlier assumptions awaiting reconciliation</summary>


            These saved assumptions have not been reconciled with this answer. They
            do not override later reported facts.


            - Generated assumption (2026-09-09): Mosaic Relay''s existing money transmission
            licenses and Harbor''s MTLs are transferable or can be maintained through
            the acquisition without new state approval

            - Generated assumption (2026-09-09): The KYC pass/fail results are sufficient
            to satisfy Mosaic Relay''s own BSA/AML program obligations without the
            underlying documents

            - Generated assumption (2026-09-09): The transaction monitoring repoint
            can be completed and validated before close without a monitoring gap

            - Generated assumption (2026-09-09): Harbor Pay is a licensed money transmitter
            subject to state MTL regimes and federal BSA/AML obligations (not yet
            confirmed).

            - Generated assumption (2026-09-09): Mosaic Relay is itself a licensed
            money transmitter in 41 states (per the request).

            - Generated assumption (2026-09-09): The acquisition is structured as
            an asset or stock purchase, which affects whether Harbor''s licenses and
            SAR/alert obligations transfer (structure not yet confirmed).


            </details>'
          source_support: 'Retrieval alone does not establish claim support.


            <details>

            <summary>Money transmission licensing: whether Mosaic Relay can operate
            under the combined 44-state footprint and whether Harbor&#x27;s MTLs transfer/survive
            the acquisition — sources</summary>


            [Research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)


            - Retrieved; passage not reviewed: [[PDF] CSBS Money Transmission Modernization
            Act](03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md)

            - Retrieved; passage not reviewed: [Money Transmitter Licensing | Department
            of Financial Services](03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md)

            - Retrieved; passage not reviewed: [OCC Confirms National Bank Act Preempts
            State Money Transmitter ...](03_Matters/harbor-2-d89ad8/research/sources/SRC-e6c1e4e85e004ccbe413-e75b998a6dec.md)

            - Retrieved; passage not reviewed: [How To Get A Money Transmitter License
            (MTL) in the U.S. - Fenergo](03_Matters/harbor-2-d89ad8/research/sources/SRC-b48d8d40f5a0cfe9a200-fcb5e16956fb.md)


            </details>'
          view_version: 2
          base_position: '## Working position


            The Harbor Pay migration needs legal and compliance review before the
            planned close. The leading concern is that an asset purchase generally
            requires Mosaic Relay to confirm its own authority to operate in each
            state; the current plan to use or assume Harbor''s licenses is not established
            as legally effective.


            The second concern is BSA/AML readiness. Mosaic Relay has not confirmed
            whether its AML/CIP program permits reliance on Harbor''s prior KYC, and
            underlying records are missing for some pre-2023 users. Harbor''s open
            alerts and SAR history also remain unread. These gaps make a day-one migration
            without re-verification or account restrictions difficult to support.


            Transaction monitoring continuity is also material because Harbor''s vendor
            ends at close. The repointed feed should be tested and validated before
            migrated users receive full access. The $50 bonus is lower priority but
            still needs review once its eligibility, funding, terms, and disclosures
            are known.


            ## Plausible alternatives


            A narrower launch could exclude the four new markets, restrict users whose
            KYC evidence is incomplete, or delay full product access until alert review
            and monitoring validation finish. A full day-one launch remains possible
            only if state licensing, AML/CIP reliance, alert handling, and monitoring
            continuity are confirmed.


            ## Material facts and assumptions


            Reported facts include the asset-purchase structure, the current plan
            to rely on Harbor''s licenses, the lack of a compliance answer on KYC
            reliance, and the unread alerts and SAR history. The analysis assumes
            both entities conduct regulated money-transmission activity and that Mosaic
            Relay will become the operating provider immediately after close. It does
            not assume that Harbor''s licenses transfer or that Harbor''s KYC is sufficient.


            ## What could change this view


            The view could change if state counsel confirms an effective licensing
            path for each affected state, compliance confirms permissible reliance
            with adequate records or remediation, diligence clears the alerts and
            SAR history, and testing shows no monitoring gap. The bonus structure
            remains unknown.


            ## Support limit


            This is generated analysis based on reported matter facts. No external
            authority was retrieved.'
          base_position_date: '2026-09-09T20:57:53+00:00'
          issue_positions:
            ISS-c9d7c39f63-94e42e2b38090045:
              position: 'Do not rely on transferability without an applicable state
                rule, approval, or written regulator position.


                The answer must be determined state by state and must cover more than
                technical change-of-control rules.


                This path is possible only if Harbor remains the real provider and
                the relevant states permit the arrangement. The unified Mosaic account
                design may conflict with that position.


                The result depends on the contracts and actual funds flow. Custody
                alone should not be treated as a licensing exemption or transfer mechanism.'
              next_action: Identify the four Harbor-only states and complete one matrix
                covering license authority, transaction filings, interim operation,
                bank custody, outstanding obligations, and license surrender.
              packet_path: 03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md
              basis: *id003
              issue_revision:
                claim_output_revisions: {}
                issue_id: ISS-c9d7c39f63-94e42e2b38090045
                parent_issue_id: null
                title: 'Money transmission licensing: whether Mosaic Relay can operate
                  under the combined 44-state footprint and whether Harbor''s MTLs
                  transfer/survive the acquisition'
                why_it_matters: ''
                fact_ids: []
                assumption_ids: []
                claim_ids: []
                lawyer_state: open
                disposition: null
                disposition_reason: ''
                disposition_history: []
                linked_work_item_ids: []
                linked_decision_ids: []
                priority_reason: ''
                next_action: ''
                action_owner: ''
                updated_at: null
              support: 4 sources retrieved; 0 with passages read
              updated_at: '2026-09-11T16:50:32+00:00'
              source_records: &id004
              - source_id: SRC-37ee676da5b354ba8538
                source_version: 157583424427122470563f33ed38821b0b88597ae4bbab82e613e532750d12bf
                source_hash: 157583424427122470563f33ed38821b0b88597ae4bbab82e613e532750d12bf
                path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md
                url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
                title: '[PDF] CSBS Money Transmission Modernization Act'
                retrieved_at: '2026-09-11T16:49:12.824842+00:00'
                retrieval_method: document_extraction
                content_truncated: true
                source_type: unknown
                pages:
                - page: 1
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 0
                  end: 4100
                - page: 2
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 4100
                  end: 8281
                - page: 3
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 8281
                  end: 10370
                - page: 4
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 10370
                  end: 12901
                - page: 5
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 12901
                  end: 16244
                - page: 6
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 16244
                  end: 18674
                - page: 7
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 18674
                  end: 21388
                - page: 8
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 21388
                  end: 24060
                - page: 9
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 24060
                  end: 26729
                - page: 10
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 26729
                  end: 29142
                - page: 11
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 29142
                  end: 32192
                - page: 12
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 32192
                  end: 35010
                - page: 13
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 35010
                  end: 37424
                - page: 14
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 37424
                  end: 39410
                - page: 15
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 39410
                  end: 42268
                - page: 16
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 42268
                  end: 44651
                - page: 17
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 44651
                  end: 47042
                - page: 18
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 47042
                  end: 49531
                - page: 19
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 49531
                  end: 51930
                - page: 20
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 51930
                  end: 54687
                - page: 21
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 54687
                  end: 57099
                - page: 22
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 57099
                  end: 59734
                - page: 23
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 59734
                  end: 62280
                - page: 24
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 62280
                  end: 65102
                - page: 25
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 65102
                  end: 67624
                - page: 26
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 67624
                  end: 69633
                - page: 27
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 69633
                  end: 71599
                - page: 28
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 71599
                  end: 73754
                - page: 29
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 73754
                  end: 75697
                - page: 30
                  method: pdf_text
                  image_path: null
                  content_truncated: false
                  warning: ''
                  start: 75697
                  end: 78390
                extraction_warnings: []
                original_file_path: 03_Matters/harbor-2-d89ad8/research/sources/8c13e0a468bd4a9bb31fc9b85afd9ba1e233a90d7aa515f1615d37865e9e007d/source.bin
                final_url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
                links: null
                support_state: retrieved
                available_excerpt: "Page 1 (pdf_text)\n \n1 \n \nCSBS MODEL MONEY
                  TRANSMISSION MODERNIZATION ACT \nTABLE OF CONTENTS \nPage \nARTICLE
                  I SHORT TITLE & PURPOSE .....................................................................................3
                  \nSection 1.01 Short Title ....................................................................................................3
                  \nSection 1.02 Purpose .........................................................................................................3
                  \nARTICLE II DEFINITIONS ...........................................................................................................3
                  \nSection 2.01 Definitions....................................................................................................3
                  \nARTICLE III EXEMPTIONS .........................................................................................................8
                  \nSection 3.01 Exemptions ..................................................................................................8
                  \nSection 3.02 Authority to Require Demonstration of Exemption...................................10
                  \nARTICLE IV IMPLEMENTATION, CONFIDENTIALITY, SUPERVISION & \nRELATIONSHIP
                  TO FEDERAL LAW ......................"
                excerpt_notice: Opening excerpt for relevance only; select a literal
                  passage before citing support.
                library_source_id: SRC-37ee676da5b354ba8538
                library_source_version: dd8e38dc121ab8ed7fe079b02c7e158a
                library_extraction_state: complete
                source_label: '[PDF] CSBS Money Transmission Modernization Act'
                locator: ''
                explanation: ''
              - source_id: SRC-71b20ecf65825d6522c4
                source_version: fa80c95c5393f45e8db00c170d35088f747cdbd51d194da43cdbb6e342cdfea0
                source_hash: fa80c95c5393f45e8db00c170d35088f747cdbd51d194da43cdbb6e342cdfea0
                path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md
                url: https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
                title: Money Transmitter Licensing | Department of Financial Services
                retrieved_at: '2026-09-11T16:49:13.970612+00:00'
                retrieval_method: direct_fetch
                content_truncated: false
                source_type: unknown
                pages: null
                extraction_warnings: null
                original_file_path: null
                final_url: null
                links:
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#main-content
                - https://www.dfs.ny.gov/
                - https://www.dfs.ny.gov/consumers
                - https://www.dfs.ny.gov/consumers/auto_insurance/Auto_resource_center
                - https://www.dfs.ny.gov/consumers/banking_money
                - https://www.dfs.ny.gov/consumers/disaster_flood
                - https://www.dfs.ny.gov/consumers/health_insurance/pharmacy-benefits-drug-prices
                - https://www.dfs.ny.gov/consumers/fraud_cyber_protection
                - https://www.dfs.ny.gov/consumers/health_insurance
                - https://www.dfs.ny.gov/consumers/help_for_homeowners
                - https://www.dfs.ny.gov/consumers/small_businesses
                - https://www.dfs.ny.gov/consumers/student_protection
                - https://www.dfs.ny.gov/apps_and_licensing
                - https://www.dfs.ny.gov/apps_and_licensing/annual_assessment_charges
                - https://www.dfs.ny.gov/apps_and_licensing/pharmacy_benefit_managers
                - https://www.dfs.ny.gov/apps_and_licensing/banks_and_trusts/home
                - https://www.dfs.ny.gov/apps_and_licensing/agents_and_brokers/home
                - https://www.dfs.ny.gov/apps_and_licensing/insurance_companies
                - https://www.dfs.ny.gov/apps_and_licensing/mortgage_companies
                - https://www.dfs.ny.gov/apps_and_licensing/virtual_currency_businesses
                - https://www.dfs.ny.gov/industry_guidance
                - https://www.dfs.ny.gov/cybersecurity
                - https://www.dfs.ny.gov/industry_guidance/climate_change
                - https://www.dfs.ny.gov/industry_guidance/diversity
                - https://www.dfs.ny.gov/industry_guidance/innovation
                - https://www.dfs.ny.gov/apps-and-licensing/health-insurers/health-equity-filing
                - https://www.dfs.ny.gov/industry_guidance/enforcement_actions
                - https://www.dfs.ny.gov/industry_guidance/circular_letters
                - https://www.dfs.ny.gov/industry_guidance/industry_letters
                - https://www.dfs.ny.gov/industry_guidance/regulations
                - https://www.dfs.ny.gov/reports_and_publications
                - https://www.dfs.ny.gov/Newsroom
                - https://www.dfs.ny.gov/reports_and_publications/exam_reports
                - https://www.dfs.ny.gov/reports_and_publications/DFS_annual_reports
                - https://www.dfs.ny.gov/reports_and_publications/other_reports
                - https://www.dfs.ny.gov/reports_and_publications/public_hearings
                - https://www.dfs.ny.gov/reports-and-publications/weekly-bulletins
                - https://www.dfs.ny.gov/About_Us
                - https://www.dfs.ny.gov/contact
                - https://www.dfs.ny.gov/complaint
                - https://www.dfs.ny.gov/contact_us/careers_with_dfs
                - https://www.dfs.ny.gov/procurement
                - https://myportal.dfs.ny.gov
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#top
                - https://www.dfs.ny.gov/cdn-cgi/l/email-protection#b58ae6c0d7dfd0d6c188f1d0c5d4c7c1d8d0dbc195dad395f3dcdbd4dbd6dcd4d995e6d0c7c3dcd6d0c68f95f8dadbd0cc95e1c7d4dbc6d8dcc1c1d0c795f9dcd6d0dbc6dcdbd293f7dad1cc88ddc1c1c5c68f9a9ac2c2c29bd1d3c69bdbcc9bd2dac39ad4c5c5c6ead4dbd1ead9dcd6d0dbc6dcdbd29ad8dadbd0cceac1c7d4dbc6d8dcc1c1d0c7c6
                - https://www.facebook.com/share.php?u=https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
                - https://twitter.com/intent/tweet?text=Money Transmitter Licensing&url=https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
                - https://www.dfs.ny.gov/apps_and_licensing/application_fee_schedule
                - https://www.dfs.ny.gov/apps_and_licensing/fingerprinting_procedure
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#toc-sidebar
                - https://mortgage.nationwidelicensingsystem.org/SitePages/default.aspx
                - https://mortgage.nationwidelicensingsystem.org/slr/resources/sitepages/GettingStartedStateCo.aspx
                - https://mortgage.nationwidelicensingsystem.org/slr/PublishedStateDocuments/NY_Money_Transmitter-Company-Transition-Checklist.pdf
                - https://mortgage.nationwidelicensingsystem.org/slr/sitepages/DynamicLicenses.aspx?StateID=ny
                - https://www.dfs.ny.gov/apps_and_licensing/mt/annual_reports/nmls
                - https://www.dfs.ny.gov/apps_and_licensing/mt/annual_reports/non_nmls
                - https://mortgage.nationwidelicensingsystem.org/slr/Pages/DynamicLicenses.aspx?StateID=ny
                - https://www.dfs.ny.gov/apps_and_licensing/personal_questionnaire
                - https://www.dfs.ny.gov/apps_and_licensing/Instructions_on_background_inv_reports
                - https://www.dfs.ny.gov/apps_and_licensing/litigation_affidavit
                - https://www.dfs.ny.gov/apps_and_licensing/authority_release_info
                - https://www.dfs.ny.gov/cdn-cgi/l/email-protection#a7d1ced5d3d2c6cbc4d2d5d5c2c9c4dee7c3c1d489c9de89c0c8d1
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/bonds_ny_instruments
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/bonds_ny_traveler_checks
                - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/deposit_agreement
                - https://www.dfs.ny.gov/apps_and_licensing/financial_statement
                - https://www.dfs.ny.gov/apps_and_licensing/licensee_contact_update
                - https://www.dfs.ny.gov/apps_and_licensing/lost_license_affidavit
                - https://www.dfs.ny.gov/contact-us/check_our_faqs
                - https://www.dfs.ny.gov/contact_us/main
                - https://www.dfs.ny.gov/who_we_supervise
                - https://www.dfs.ny.gov/about_us/advisoryboards
                - https://govt.westlaw.com/nycrr/Index?bhcp=1&transitionType=Default&contextData=(sc.Default)
                - 'http://public.leginfo.state.ny.us/lawssrch.cgi?NVLWO:'
                - https://www.nysenate.gov/legislation
                - https://www.dfs.ny.gov/Accessibility
                - https://www.dfs.ny.gov/disclaimer
                - https://www.dfs.ny.gov/privacy
                - https://www.dfs.ny.gov/sitemap
                - https://www.dfs.ny.gov/language_assistance
                - https://www.linkedin.com/company/nydfs/
                - https://twitter.com/NYDFS
                - https://www.youtube.com/user/nysdfs
                - https://www.facebook.com/NYDFS/
                - https://www.instagram.com/nydfs/
                support_state: retrieved
                available_excerpt: Money Transmitter Licensing | Department of Financial
                  Services Skip to main content DFS Global Navigation Header Department
                  of Financial Services Consumer Information Consumer Information
                  Auto Insurance Banking and Sending Money Disaster and Flood Resources
                  Drug Prices and PBMs Fraud and Cyber Protection Healthcare Homeowners
                  & Tenants Small Business Resources Student Loan Resources and Relief
                  More... Applications & Filings Applications & Filings Application
                  Fees & Assessments Pharmacy Benefit Managers Banks and Trusts Insurance
                  Agents & Brokers Insurance Companies Mortgage Companies Virtual
                  Currency Businesses More... Industry Guidance Industry Guidance
                  Cybersecurity Resource Center Climate Change Diversity, Equity and
                  Inclusion Innovation Health Equity Enforcement & Discipline Circular
                  Letters Industry Letters Regulatory & Legislative Activities Reports
                  & Publications Reports & Publications Newsroom Examinations & Exam
                  Reports DFS Annual Reports Other Reports Hearings Weekly Bulletins
                  About Us About Us Contact Us File a Complaint or Appeal Careers
                  With DFS Newsroom Procurement Search Submit search DFS Portal Money
                  Transmitter Licensing TOP Money Transmitter Licensing SHARE Sectio
                excerpt_notice: Opening excerpt for relevance only; select a literal
                  passage before citing support.
                library_source_id: SRC-71b20ecf65825d6522c4
                library_source_version: d021ece0cde82565eb83511c8122c85b
                library_extraction_state: complete
                source_label: Money Transmitter Licensing | Department of Financial
                  Services
                locator: ''
                explanation: ''
              - source_id: SRC-e6c1e4e85e004ccbe413
                source_version: e75b998a6decb04c45d7d33b6b6db9cabd03d4200ced746a410ceb6f827f759d
                source_hash: e75b998a6decb04c45d7d33b6b6db9cabd03d4200ced746a410ceb6f827f759d
                path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-e6c1e4e85e004ccbe413-e75b998a6dec.md
                url: https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
                title: OCC Confirms National Bank Act Preempts State Money Transmitter
                  ...
                retrieved_at: '2026-09-11T16:49:14.656634+00:00'
                retrieval_method: direct_fetch
                content_truncated: true
                source_type: unknown
                pages: null
                extraction_warnings: null
                original_file_path: null
                final_url: null
                links:
                - https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/#lxb_af-loop
                - https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
                - https://www.troutman.com/
                - https://www.troutmanfinancialservices.com/
                - https://www.troutmanfinancialservices.com/about/
                - https://www.troutmanfinancialservices.com/topics/
                - https://www.troutmanfinancialservices.com/mobile-app/
                - https://www.troutmanfinancialservices.com/contact/
                - https://www.troutmanfinancialservices.com/subscribe/
                - https://www.troutmanfinancialservices.com/podcast/
                - https://www.troutmanfinancialservices.com
                - https://www.troutmanfinancialservices.com/author/keithjbarnett/
                - https://www.troutmanfinancialservices.com/author/ostroff/
                - https://www.troutmanfinancialservices.com/author/jstevens/
                - https://www.troutmanfinancialservices.com/author/carlinmccrory/
                - https://www.troutmanfinancialservices.com/category/bank-regulatory/
                - https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/int1192.pdf
                - mailto:?subject=OCC%20Confirms%20National%20Bank%20Act%20Preempts%20State%20Money%20Transmitter%20Licensing%20for%20Fidelity%20Digital%20Assets%20-%20Financial%20Services%20Blog&body=https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
                - http://twitter.com/share/?text=OCC+Confirms+National+Bank+Act+Preempts+State+Money+Transmitter+Licensing+for+Fidelity+Digital+Assets&url=https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
                - http://www.facebook.com/sharer.php/?u=https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
                - http://www.linkedin.com/shareArticle/?mini=true&url=https%3A%2F%2Fwww.troutmanfinancialservices.com%2F2026%2F06%2Focc-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets%2F&title=OCC+Confirms+National+Bank+Act+Preempts+State+Money+Transmitter+Licensing+for+Fidelity+Digital+Assets+-+Financial+Services+Blog&summary
                - https://www.troutman.com/professionals/keith-j-barnett.html
                - https://www.linkedin.com/in/keith-barnett-102210a/
                - https://www.troutman.com/professionals/ethan-g-ostroff.html
                - https://www.linkedin.com/in/ethanostroff/
                - https://www.troutman.com/professionals/james-w-stevens.html
                - https://www.troutman.com/professionals/carlin-a-mccrory.html
                - https://www.linkedin.com/in/carlin-mccrory-966571a5/
                - https://www.troutmanfinancialservices.com/2026/09/join-troutman-pepper-locke-at-sp-globals-webinar-on-the-21st-century-road-to-housing-act/
                - https://www.troutmanfinancialservices.com/2026/09/georgia-banking-company-inc-completes-55-0-million-subordinated-notes-offering-advised-by-troutman-pepper-locke/
                - https://www.troutmanfinancialservices.com/2026/08/occ-and-fdic-move-to-sharpen-focus-on-material-risks-in-bank-supervision/
                - https://www.troutmanfinancialservices.com/feed/
                - https://www.linkedin.com/company/troutmanpepperlocke/
                - https://x.com/tpllaw
                - https://www.youtube.com/@troutmanpepperlockellp
                - https://www.instagram.com/troutmanpepperlockellp/
                - https://www.troutmanfinancialservices.com/legal-notices/
                - https://www.troutmanfinancialservices.com/global-privacy-notice/
                - https://www.troutmanfinancialservices.com/notice-at-collection/
                - https://www.troutmanfinancialservices.com/your-privacy-choices/
                - https://www.lexblog.com/products/microsites/
                - https://www.troutmanfinancialservices.com/global-privacy-notice
                support_state: retrieved
                available_excerpt: OCC Confirms National Bank Act Preempts State Money
                  Transmitter Licensing for Fidelity Digital Assets | Financial Services
                  Blog Skip to content menu Home About Topics Mobile App Contact Subscribe
                  Podcasts Search Close Enter Search Terms Search Financial Services
                  Blog Analysis and commentary on financial services law, regulation,
                  and business OCC Confirms National Bank Act Preempts State Money
                  Transmitter Licensing for Fidelity Digital Assets By Keith J. Barnett
                  , Ethan G. Ostroff , James Stevens & Carlin McCrory on June 11,
                  2026 Posted in Bank Regulatory On May 12, the Office of the Comptroller
                  of the Currency (OCC) issued a significant interpretive letter confirming
                  that Fidelity Digital Assets, National Association (the recently
                  converted national trust bank formerly known as Fidelity Digital
                  Assets Service, LLC) is not required to hold state money transmitter
                  licenses to conduct its federally authorized activities. The OCC
                  concluded that the National Bank Act preempts any state money transmitter
                  licensing requirement as applied to a national bank. Until December
                  12, 2025, Fidelity Digital Assets operated as a New York-chartered
                  limited liability trust company and held money tran
                excerpt_notice: Opening excerpt for relevance only; select a literal
                  passage before citing support.
                library_source_id: SRC-e6c1e4e85e004ccbe413
                library_source_version: e06621859d4ec9431f2712a7c357b112
                library_extraction_state: complete
                source_label: OCC Confirms National Bank Act Preempts State Money
                  Transmitter ...
                locator: ''
                explanation: ''
              - source_id: SRC-b48d8d40f5a0cfe9a200
                source_version: fcb5e16956fbe20f264f583f2d5948678530b738ff55303e2e5edf9c412dd4a1
                source_hash: fcb5e16956fbe20f264f583f2d5948678530b738ff55303e2e5edf9c412dd4a1
                path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-b48d8d40f5a0cfe9a200-fcb5e16956fb.md
                url: https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license
                title: How To Get A Money Transmitter License (MTL) in the U.S. -
                  Fenergo
                retrieved_at: '2026-09-11T16:49:16.046751+00:00'
                retrieval_method: direct_fetch
                content_truncated: true
                source_type: unknown
                pages: null
                extraction_warnings: null
                original_file_path: null
                final_url: null
                links:
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#main-content
                - https://www.fenergo.com/careers
                - https://www.fenergo.com/life-at-fenergo
                - https://www.fenergo.com/partners
                - https://www.fenergo.com/partners/aws
                - https://www.fenergo.com/partners/salesforce
                - https://www.fenergo.com/partners/deloitte
                - https://www.fenergo.com/partners/pwc
                - https://www.fenergo.com/partners/lseg
                - https://www.fenergo.com/partners/moodys
                - https://www.fenergo.com/partners/lexis-nexis-risk-solutions
                - https://resources.fenergo.com/newsroom
                - https://resources.fenergo.com/blogs
                - https://www.fenergo.com/events
                - https://www.fenergo.com/contact
                - https://www.fenergo.com/
                - https://www.fenergo.com/es
                - https://www.fenergo.com/request-demo
                - https://www.fenergo.com/book-a-demo/
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-0-data-w-pane-0
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-0-data-w-pane-1
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-0-data-w-pane-2
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-0-data-w-pane-3
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-1-data-w-pane-0
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-1-data-w-pane-1
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-1-data-w-pane-2
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-1-data-w-pane-3
                - https://www.fenergo.com/segments/corporate-institutional-banking
                - https://www.fenergo.com/ai-agents
                - https://www.fenergo.com/client-lifecycle-management
                - https://www.fenergo.com/know-your-customer-kyc-solution
                - https://www.fenergo.com/client-onboarding
                - https://www.fenergo.com/identity-verification
                - https://www.fenergo.com/transaction-monitoring
                - https://www.fenergo.com/regulatory-compliance
                - https://www.fenergo.com/salesforce-clm-software
                - https://www.fenergo.com/integrations
                - https://www.fenergo.com/segments/commercial-and-business-banking
                - https://www.fenergo.com/loan-origination
                - https://www.fenergo.com/account-opening
                - https://www.fenergo.com/segments/retail-banking
                - https://www.fenergo.com/segments/private-banking
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-2-data-w-pane-0
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-2-data-w-pane-1
                - https://www.fenergo.com/segments/asset-management
                - https://www.fenergo.com/kyc-and-transaction-compliance
                - https://www.fenergo.com/segments/asset-servicing
                - https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#w-tabs-3-data-w-pane-0
                - https://www.fenergo.com/segments/fintechs
                - https://www.fenergo.com/segments/energy-and-commodity-trading
                - https://fenergo.com/kyc-and-transaction-compliance
                - https://www.fenergo.com/clients
                - https://resources.fenergo.com/case-studies
                - https://resources.fenergo.com/client-news
                - https://resources.fenergo.com/brochures
                - https://resources.fenergo.com/datasheets
                - https://resources.fenergo.com/analyst-relations
                - https://resources.fenergo.com/videos
                - https://resources.fenergo.com/webinars
                - https://resources.fenergo.com/whitepapers
                - https://resources.fenergo.com/reports
                - https://resources.fenergo.com/podcasts
                - https://resources.fenergo.com/de/in-den-nachrichten
                - https://www.fenergo.com/aml-report
                - https://www.fenergo.com/regulatory-horizon-scanning-2026
                - https://www.fenergo.com/global-fincrime-operations-trends-2025
                - https://www.fenergo.com/agentic-ai-in-compliance-report
                - https://www.fenergo.com/experts-guide-to-compliance
                - https://www.fenergo.com/company/discover-fenergo
                - https://www.fenergo.com/company/leadership
                - https://www.fenergo.com/company/awards
                - https://www.fenergo.com/platform
                - https://www.fenergo.com/sustainability
                - https://www.fenergo.com/environmental-social-governance-policy
                - https://www.fenergo.com/modern-slavery-human-trafficking-statement
                - https://www.fenergo.com/privacy-policy
                - https://www.fenergo.com/trust-and-security
                - https://www.fenergo.com/careers/open-opportunities
                - https://www.fenergo.com/newsroom
                - https://www.fenergo.com/contact-us
                - https://fenergo.com
                - https://fenergo.com/es
                - https://resources.fenergo.com/infographic
                - https://resources.fenergo.com/solution
                - https://resources.fenergo.com/corporate
                - https://resources.fenergo.com/thought-leadership
                - https://resources.fenergo.com/engineering
                - https://twitter.com/share?text=How%20To%20Get%20A%20Money%20Transmitter%20License%20(MTL)%20in%20the%20U.S.&url=https%3A%2F%2Fresources.fenergo.com%2Fblogs%2Fhow-to-get-a-money-transmitter-license&via=Fenergo
                - https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fresources.fenergo.com%2Fblogs%2Fhow-to-get-a-money-transmitter-license&title=Fenergo&summary=Explore%20our%20guide%20on%20the%20challenges%20MSBs%20encounter%20when%20applying%20for%20transmitter%20licenses%20in%20the%20U.S.%20Learn%20about%20eligibility%20criteria%20&%20requirements.
                - https://resources.fenergo.com
                - https://www.fincen.gov/
                - https://resources.fenergo.com/blogs/kyc-aml
                - https://www.fincen.gov/money-services-business-definition
                - https://resources.fenergo.com/blogs/5-ways-dnfbps-can-improve-transaction-monitoring
                - https://resources.fenergo.com/blogs/risk-and-compliance-in-banking
                - https://resources.fenergo.com/blogs/what-are-the-3-key-components-of-kyc
                - https://resources.fenergo.com/blogs/new-blueprint-for-banks-to-manage-increased-kyc-costs-after-south-africa-grey-listing
                - https://resources.fenergo.com/blogs/fenergo-recognized-as-industry-leader-by-chartis-risktech-quadrant-for-kyc-solutions-2023
                - https://resources.fenergo.com/blogs/automating-kyc-risk-assessment-across-the-client-lifecycle
                - https://resources.fenergo.com/blogs/how-ai-is-transforming-kyc-compliance
                support_state: retrieved
                available_excerpt: "How To Get A Money Transmitter License in the
                  U.S. Skip to main content Careers Life at\n                     Fenergo
                  Partners AWS Salesforce Deloitte PwC LSEG Moody's LexisNexis Newsroom
                  Blog Newsroom Events Contact EN ES Solutions Clients Resources Company
                  Request a\n                        demo Request\n            a\n
                  \           demo Go Back Filter by Segment Banking Buy-Side Payment
                  & Fintech Corporate Organization Type Corporate & Institutional
                  Banking Commercial & Business Banking Retail Banking Private Banking
                  & Wealth Management Solutions How Fenergo helps Corporate & Institutional
                  Banks Fen-AI Overview of Fenergo CLM Know Your Customer (KYC) Client
                  Onboarding Identity Verification (ID&V) Transaction  Monitoring
                  Regulatory Compliance CLM for Salesforce Integration Hub & Flows
                  Solutions How Fenergo helps Commercial & Business Banks Fen-AI Overview
                  of Fenergo CLM Know Your Customer (KYC) Client Onboarding Identity
                  Verification (ID&V) Transaction  Monitoring Regulatory Compliance
                  Loan Origination Account Opening CLM for Salesforce Integration
                  Hub & Flows Solutions How Fenergo helps Retail Banks Fen-AI Overview
                  of Fenergo CLM Know Your Customer (KYC) Client Onboarding Identity
                  Ver"
                excerpt_notice: Opening excerpt for relevance only; select a literal
                  passage before citing support.
                library_source_id: SRC-b48d8d40f5a0cfe9a200
                library_source_version: 6ebc7b743e605b8e05363eb0628942c1
                library_extraction_state: complete
                source_label: How To Get A Money Transmitter License (MTL) in the
                  U.S. - Fenergo
                locator: ''
                explanation: ''
          updated_issue_ids:
          - ISS-c9d7c39f63-94e42e2b38090045
          summary: Harbor's licenses should not be treated as automatically transferable
            in the asset sale. Mosaic should launch regulated services only under
            its own confirmed authority or a documented state-approved transition.
            Partner-bank custody must be reviewed, but a bank account alone does not
            establish authority. If approvals are not ready, hold the affected state
            launch or maintain a genuine Harbor run-off structure where permitted.
          next_action: Identify the four Harbor-only states and complete one matrix
            covering license authority, transaction filings, interim operation, bank
            custody, outstanding obligations, and license surrender.
          research_question: Research whether a money transmitter license can transfer
            or remain usable after an asset acquisition, including state notice, approval,
            interim-operation, and partner-bank custody issues.
          unassigned_answer: '## Practical answer


            **Do not treat Harbor’s money transmitter licenses as assets that move
            to Mosaic in the asset purchase.** Use this closing rule:


            > **No confirmed authority means no regulated launch by Mosaic in that
            state.**


            The asset purchase can still close. However, Mosaic should not activate
            regulated services in the four Harbor-only states unless one of these
            conditions is met:


            1. Mosaic obtains its own license.

            2. The state approves a transfer or other license change.

            3. The regulator confirms a lawful interim structure.

            4. Harbor remains the real licensed provider under a valid transition
            plan.

            5. Mosaic blocks regulated functions in that state.


            The planned unified Mosaic account is important. It suggests that Mosaic,
            not Harbor, will become the service provider. If that is correct, keeping
            Harbor’s legal entity and licenses alive might not give Mosaic authority
            to operate.


            **No verified operative authority retrieved.** The collection found the
            CSBS Model Money Transmission Modernization Act and a New York regulator
            licensing page. However, no exact provision about an asset sale, license
            transfer, interim operation, or custody was available for review. Also,
            a model act is not proof of the law adopted in a specific state. The state-specific
            conclusions below remain conditional.


            ## Work needed before launch


            | Work | Why | Proposed owner | Needed by | Evidence to proceed | Fallback
            |

            |---|---|---|---|---|---|

            | Identify the four Harbor-only states | These states have the clearest
            authority gap | Licensing team | Now | Confirmed license list and covered
            activities | Block regulated functions in those states |

            | Build a matrix for every affected state | Transfer, notice, approval,
            and surrender rules can differ | State regulatory counsel | Before the
            closing conditions are final | Applicable rule, filing deadline, regulator
            response, and license status | Delay migration in the affected state |

            | Confirm the post-close service provider | The licensed entity must match
            the actual operating model | Product and deal counsel | Before customer
            notices and account design are final | Contracts, user interface, funds-flow
            diagram, and operating roles | Keep Harbor as the actual provider where
            permitted |

            | Review notices and approvals | An asset sale can create separate seller
            and buyer requirements | Licensing team | Before each state deadline |
            Filing receipts and required approvals or non-objections | Make approval
            a state launch condition |

            | Confirm interim operating authority | A pending application should not
            be assumed to permit operation | State regulatory counsel | Before close
            | Applicable rule or written regulator confirmation | Keep Harbor customers
            segregated or restrict transactions |

            | Review partner-bank arrangements | Bank custody does not, by itself,
            establish Mosaic’s licensing position | Payments counsel and bank relationship
            owner | Before balances move | Bank agreements, account titles, control
            rights, reconciliation design, and bank consent | Keep funds and obligations
            in the existing structure |

            | Prepare license run-off and surrender plans | Harbor may retain duties
            for balances, claims, records, and reports | Harbor compliance and deal
            counsel | Before surrender or operational shutdown | Regulator-approved
            plan and continued bonds and financial coverage | Keep Harbor licensed
            and operational longer |


            ## State notice and approval


            Do not search only for a rule called “license transfer.” Review each state
            for:


            - sale of substantially all assets;

            - change of control;

            - change in business plan;

            - change in licensed activities;

            - assignment of outstanding payment obligations;

            - change in responsible persons, locations, or agents;

            - license surrender or termination;

            - customer agreement assignment; and

            - movement of stored balances or customer funds.


            An asset purchase might fall outside a technical “change of control” rule
            because Harbor’s ownership does not change. That does not resolve the
            issue. Harbor might still need a notice or surrender approval. Mosaic
            might separately need authority before it starts the regulated activity.


            The state matrix should distinguish:


            - notice only;

            - approval before closing;

            - approval before customer migration;

            - new license required;

            - operation permitted while an application is pending;

            - regulator-approved transition available; and

            - no supported interim path.


            ## Interim operation


            Harbor could remain the licensed provider for a transition period. However,
            the structure must be real, not only contractual language.


            A supportable structure would normally need to show that:


            - Harbor remains responsible to customers.

            - Customer terms name Harbor as the provider.

            - Harbor controls the regulated activity as required.

            - Harbor’s licenses, bonds, and financial coverage remain active.

            - Customer funds and outstanding obligations remain covered.

            - Harbor can complete reports, refunds, complaints, and examinations.

            - Required records remain available.

            - Mosaic’s operational role is permitted.

            - The partner bank accepts the structure.

            - Each relevant regulator permits or accepts the structure.


            The present plan creates tension with this approach. A single Mosaic account,
            one combined balance, and full access to Mosaic products make it harder
            to show that Harbor remains the true provider.


            ## Partner-bank custody


            A partner bank account is not automatically a substitute for a money transmitter
            license. The key questions concern the complete activity and obligation
            flow.


            For each customer balance and transfer, document:


            1. Who receives the customer’s instruction?

            2. Who accepts the obligation to transmit or return the funds?

            3. In whose name is the bank account held?

            4. Is it a custodial or “for benefit of” account?

            5. Who can direct withdrawals?

            6. Who owns the ledger and resolves errors?

            7. Who bears loss if a transfer fails?

            8. Which entity owes the customer a refund?

            9. Which entity’s license, bond, and permissible investments cover the
            obligation?

            10. Does the bank agreement permit assignment, migration, or a change
            in the program manager?

            11. Is bank consent required before closing or migration?

            12. What happens to funds if Harbor, Mosaic, or the bank relationship
            ends?


            A bank-led model might provide a different licensing analysis if the bank
            is the actual provider and Mosaic performs only permitted services. A
            bank account that merely holds funds for Mosaic or Harbor is different.
            The legal documents, customer terms, control rights, and actual operations
            must all support the claimed model.


            Also review:


            - account segregation;

            - daily reconciliation;

            - shortfalls and reserve funding;

            - bank setoff rights;

            - liens and security interests;

            - continuity if the account is frozen;

            - treatment of pending transfers;

            - return and chargeback duties;

            - insolvency treatment;

            - customer disclosures; and

            - whether any deposit-insurance statement is accurate for the actual account
            structure.


            ## Recommended closing position


            Keep the acquisition closing separate from the regulated-service launch.


            For the four Harbor-only states, use a state launch hold unless Mosaic
            has documented authority. For overlapping states, confirm that Mosaic’s
            existing licenses cover the complete post-close product set and funds
            flow.


            Do not surrender Harbor’s licenses or release its bonds until the applicable
            regulators permit it and all outstanding obligations have been assigned,
            completed, or placed into an approved run-off structure.


            This investigation does not change the current recommendation. It adds
            one material point: **partner-bank custody is part of the licensing analysis,
            but custody alone does not cure an authority gap.**'
          change_summary: ''
          source_records: *id004
          support: 4 sources retrieved; 0 with passages read
        based_on_version_id: REC-20260909-7112e7
  03_Matters/harbor-2-d89ad8/dossier.md:
    content: '# Matter dossier


      ## Matter summary


      Mosaic Relay is acquiring Harbor Pay in an asset purchase targeted to close
      Nov 15 (~10 weeks out). The plan involves migrating 240,000 consumer and 12,000
      business accounts into Mosaic’s app on day 1, relying on Harbor’s prior KYC
      (for which underlying documents are missing for pre-2023 users), assuming Harbor’s
      38 state MTLs to create a combined 44-state footprint, and launching a $50 welcome
      bonus campaign. Harbor has ~40 open alerts and unreviewed SARs, and its transaction-monitoring
      SaaS contract terminates at close.


      ## Decision question


      Does any part of the Harbor Pay acquisition migration need legal review before
      the Nov 15 close?


      ## Material facts


      - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).

      - Migration moves 240k consumer users and 12k business accounts into Mosaic
      Relay''s app on day 1 post-close, with one unified account and balance and full
      access to Mosaic''s product set.

      - Plan is no re-verification; Harbor users were already KYC''d by Harbor.

      - Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay
      holds 41; combined footprint is 44 states, opening four new markets.

      - Harbor''s KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
      results for everyone but not the underlying documents for users onboarded before
      2023.

      - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint Harbor''s transaction feed at Mosaic''s engine
      on day 1.

      - Marketing wants a ''Welcome'' campaign with a $50 bonus on first transfer,
      launching close+1.

      - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
      year at Harbor; nobody has read them yet.


      ## Assumptions


      This answer did not identify any assumptions it relies on. Reported facts remain
      in Material facts.


      <details>

      <summary>Earlier assumptions awaiting reconciliation</summary>


      These saved assumptions have not been reconciled with this answer. They do not
      override later reported facts.


      - Generated assumption (2026-09-09): Mosaic Relay''s existing money transmission
      licenses and Harbor''s MTLs are transferable or can be maintained through the
      acquisition without new state approval

      - Generated assumption (2026-09-09): The KYC pass/fail results are sufficient
      to satisfy Mosaic Relay''s own BSA/AML program obligations without the underlying
      documents

      - Generated assumption (2026-09-09): The transaction monitoring repoint can
      be completed and validated before close without a monitoring gap

      - Generated assumption (2026-09-09): Harbor Pay is a licensed money transmitter
      subject to state MTL regimes and federal BSA/AML obligations (not yet confirmed).

      - Generated assumption (2026-09-09): Mosaic Relay is itself a licensed money
      transmitter in 41 states (per the request).

      - Generated assumption (2026-09-09): The acquisition is structured as an asset
      or stock purchase, which affects whether Harbor''s licenses and SAR/alert obligations
      transfer (structure not yet confirmed).


      </details>


      ## Issues and workstreams


      - Money transmission licensing and state regulatory approval for the four new
      markets and the combined footprint

      - BSA/AML program continuity: KYC records gap (missing underlying documents
      pre-2023), monitoring repoint, and unread open alerts and SARs

      - Consumer protection and funds-flow disclosures for migrated accounts

      - Marketing compliance for the $50 welcome bonus campaign

      - Data migration and privacy/data protection obligations for transferring customer
      personal data


      ## Open questions


      - Whether the four new markets require new state money transmission licenses
      or regulatory approval before onboarding those customers

      - Whether the ~40 open alerts and SARs indicate unresolved suspicious activity
      that must be addressed before or at close

      - Whether the missing pre-2023 KYC underlying documents create a compliance
      gap under Mosaic Relay''s BSA/AML program

      - Whether the $50 welcome bonus is structured as a deposit, incentive, or referral
      and whether it triggers disclosure or state requirements

      - Whether the acquisition structure (asset vs. stock) affects license portability
      and regulatory approval


      ## Research and source support


      Latest review: `03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md`


      Retrieval alone does not establish claim support.


      <details>

      <summary>Money transmission licensing: whether Mosaic Relay can operate under
      the combined 44-state footprint and whether Harbor&#x27;s MTLs transfer/survive
      the acquisition — sources</summary>


      [Research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)


      - Retrieved; passage not reviewed: [[PDF] CSBS Money Transmission Modernization
      Act](03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md)

      - Retrieved; passage not reviewed: [Money Transmitter Licensing | Department
      of Financial Services](03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md)

      - Retrieved; passage not reviewed: [OCC Confirms National Bank Act Preempts
      State Money Transmitter ...](03_Matters/harbor-2-d89ad8/research/sources/SRC-e6c1e4e85e004ccbe413-e75b998a6dec.md)

      - Retrieved; passage not reviewed: [How To Get A Money Transmitter License (MTL)
      in the U.S. - Fenergo](03_Matters/harbor-2-d89ad8/research/sources/SRC-b48d8d40f5a0cfe9a200-fcb5e16956fb.md)


      </details>


      ## Options or working recommendation


      ### Latest research-based proposal — not yet accepted


      ### Saved overall view


      The Harbor Pay migration needs legal and compliance review before the planned
      close. The leading concern is that an asset purchase generally requires Mosaic
      Relay to confirm its own authority to operate in each state; the current plan
      to use or assume Harbor''s licenses is not established as legally effective.


      The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether
      its AML/CIP program permits reliance on Harbor''s prior KYC, and underlying
      records are missing for some pre-2023 users. Harbor''s open alerts and SAR history
      also remain unread. These gaps make a day-one migration without re-verification
      or account restrictions difficult to support.


      Transaction monitoring continuity is also material because Harbor''s vendor
      ends at close. The repointed feed should be tested and validated before migrated
      users receive full access. The $50 bonus is lower priority but still needs review
      once its eligibility, funding, terms, and disclosures are known.


      ### Workstream positions


      Research progress is separate from the lawyer''s conclusion.


      | Workstream | Current analysis | Research state |

      |---|---|---|

      | Money transmission licensing: whether Mosaic Relay can operate under the combined
      44-state footprint and whether Harbor''s MTLs transfer/survive the acquisition
      | Do not rely on transferability without an applicable state rule, approval,
      or written regulator position.  The answer must be determined state by state
      and must cover more than technical change-of-control rules.  This path is possible
      only if Harbor remains the real provider and the relevant states permit the
      arrangement. The unified Mosaic account design may conflict with that position.  The
      result depends on the contracts and actual funds flow. Custody alone should
      not be treated as a licensing exemption or transfer mechanism. Next: Identify
      the four Harbor-only states and complete one matrix covering license authority,
      transaction filings, interim operation, bank custody, outstanding obligations,
      and license surrender. [Full research](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
      | Research added. 4 sources retrieved; 0 with passages read. |

      | BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
      documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML
      obligations | No separate issue position saved. The saved overall view remains
      available. | No research update saved. |

      | SAR and alert handling: obligations to review, file, and manage Harbor''s
      ~40 open alerts and SARs, and successor liability | No separate issue position
      saved. The saved overall view remains available. | No research update saved.
      |

      | Monitoring vendor transition: continuity of transaction monitoring when the
      SaaS contract terminates at close | No separate issue position saved. The saved
      overall view remains available. | No research update saved. |

      | Marketing compliance: the $50 welcome bonus offer and any state money transmission
      or consumer protection implications | No separate issue position saved. The
      saved overall view remains available. | No research update saved. |


      ### Latest research update


      Research updated: Money transmission licensing: whether Mosaic Relay can operate
      under the combined 44-state footprint and whether Harbor''s MTLs transfer/survive
      the acquisition. Other workstreams retain their prior position.


      [Read the full research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
      — 4 sources retrieved; 0 with passages read.


      <details>

      <summary>Earlier saved position — 2026-09-09T20:57:53+00:00</summary>


      **Working position**


      The Harbor Pay migration needs legal and compliance review before the planned
      close. The leading concern is that an asset purchase generally requires Mosaic
      Relay to confirm its own authority to operate in each state; the current plan
      to use or assume Harbor''s licenses is not established as legally effective.


      The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether
      its AML/CIP program permits reliance on Harbor''s prior KYC, and underlying
      records are missing for some pre-2023 users. Harbor''s open alerts and SAR history
      also remain unread. These gaps make a day-one migration without re-verification
      or account restrictions difficult to support.


      Transaction monitoring continuity is also material because Harbor''s vendor
      ends at close. The repointed feed should be tested and validated before migrated
      users receive full access. The $50 bonus is lower priority but still needs review
      once its eligibility, funding, terms, and disclosures are known.


      **Plausible alternatives**


      A narrower launch could exclude the four new markets, restrict users whose KYC
      evidence is incomplete, or delay full product access until alert review and
      monitoring validation finish. A full day-one launch remains possible only if
      state licensing, AML/CIP reliance, alert handling, and monitoring continuity
      are confirmed.


      **Material facts and assumptions**


      Reported facts include the asset-purchase structure, the current plan to rely
      on Harbor''s licenses, the lack of a compliance answer on KYC reliance, and
      the unread alerts and SAR history. The analysis assumes both entities conduct
      regulated money-transmission activity and that Mosaic Relay will become the
      operating provider immediately after close. It does not assume that Harbor''s
      licenses transfer or that Harbor''s KYC is sufficient.


      **What could change this view**


      The view could change if state counsel confirms an effective licensing path
      for each affected state, compliance confirms permissible reliance with adequate
      records or remediation, diligence clears the alerts and SAR history, and testing
      shows no monitoring gap. The bonus structure remains unknown.


      **Support limit**


      This is generated analysis based on reported matter facts. No external authority
      was retrieved.


      </details>


      ## Next counsel action


      Proposed: Identify the four Harbor-only states and complete one matrix covering
      license authority, transaction filings, interim operation, bank custody, outstanding
      obligations, and license surrender.


      ## Work product links


      No work product yet.


      ## Current solution direction


      Current direction: Mosaic-operated migration (SCN-490c71c86d9c658974321c1e).


      Previous approach: SCN-406906c91ab0aba4313b54a6.

      '
    metadata:
      matter_id: MAT-20260909-d89ad8
      record_type: dossier
      editable: true
      source_revision: 03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-c993ab2326efd727cc3d.md
      updated_at: '2026-09-11T21:15:53+00:00'
      content_hash: a0c90a373f8cf91351373874a70856bf77a2e51bdd276b26f0870804a57a2351
basis_revision: b5a241e94b7e97d0dc3c0be5985cdef4a35e69f2e5089a0866d0d317ee98a0fa
captured_work_items:
- work_item_id: WI-20260909-dc797b
  matter_id: MAT-20260909-d89ad8
  path: 03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md
  title: Orient to the request
  description: Confirm the business objective, timing, and facts needed to frame the
    legal work.
  item_type: question
  status: done
  priority: normal
  owner: Lawyer
  due_at: null
  required: 1
  issue_id: null
  created_at: '2026-09-09T20:52:45+00:00'
  completed_at: '2026-09-09T20:56:35+00:00'
---
“Operative authority” means the **current, effective law or regulator instruction that controls the proposed transaction in a specific state**.

I did not retrieve and inspect an exact state provision that answers:

- whether Harbor’s license can transfer in an asset sale;
- whether Harbor or Mosaic must give notice or obtain approval;
- whether Mosaic can operate while an application is pending;
- whether Harbor can continue as the licensed provider after closing; or
- when Harbor can surrender its license and bonds.

The research found a **model act** and a general New York licensing page. A model act is suggested text. It applies only if a state enacted it, and the state can change the text. A general licensing page does not answer the transaction-specific questions above.

The four Harbor-only states were also not identified. Therefore, I could not determine which enacted state laws or regulator procedures control.

My earlier statement did **not** mean that no relevant law exists. It meant that the available research did not provide enough state-specific legal text to verify the conclusion. The recommendation was therefore cautious analysis, not a verified state-law determination.
