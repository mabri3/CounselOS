---
record_type: workspace_inquiry
matter_id: MAT-20260906-1b2102
run_id: RUN-20260906-0106ca
question_revision: legacy:9daa566e96142bcca3e63a7f094f836946f9a5535198bb036b2c79cf54754f38
source_revisions:
  03_Matters/harbor-sandbox-release-timing-1b2102/matter.md: d7ee6f8b42faf589223df132a6c3b1d0922e503e59aa8ee8549cbd56b12f7fad
  03_Matters/harbor-sandbox-release-timing-1b2102/dossier.md: 293d240f8e2f73fced0ba8054495f14b7902126f494d30cd0fc9d6638e171488
  03_Matters/harbor-sandbox-release-timing-1b2102/facts.md: dc44f458da1111cdd1f074fe1f55ccbe1f15b503429e3ca77f0177378dbec884
  03_Matters/harbor-sandbox-release-timing-1b2102/issues.md: df54a0197bd18a79f18f27326bfa54cfc009b9754dfa6bed46982f5529129daf
  03_Matters/harbor-sandbox-release-timing-1b2102/recommendations.md: 003877ad7c7395bfe465ccc28cee25bc7eb93dfd818709a583e9d330a227f2ae
  business_question: legacy:9daa566e96142bcca3e63a7f094f836946f9a5535198bb036b2c79cf54754f38
output_revision: 1fb312f3a7ce3f86f11eb3043830602c3e35c78d8f994624591418b60134f4c3
created_at: '2026-09-06T04:16:51+00:00'
sources:
- source_id: SRC-FICTIONAL
  source_label: 03_Matters/harbor-sandbox-release-timing-1b2102/documents/fictional-supplier-contract.md
  path: 03_Matters/harbor-sandbox-release-timing-1b2102/documents/fictional-supplier-contract.md
  url: null
  available_excerpt: '# Fictional supplier contract


    ## Section 4 — Release


    The operator must complete screening before releasing a payment. A limited pilot
    of at most ten test accounts may use manual screening. This exception does not
    waive screening.


    ## Section 5 — Audit


    The operator keeps a dated screening record.

    '
  locator: ''
  support_state: supplied
  retrieved_at: null
  source_version: 4558ff11897d6fe283fa042e07e414e2f75f46ea88e79d55cd54448f0d824cc9
  source_hash: 4558ff11897d6fe283fa042e07e414e2f75f46ea88e79d55cd54448f0d824cc9
  explanation: ''
- source_id: 03_Matters/harbor-sandbox-release-timing-1b2102/issues.md
  source_label: 03_Matters/harbor-sandbox-release-timing-1b2102/issues.md
  path: 03_Matters/harbor-sandbox-release-timing-1b2102/issues.md
  url: null
  available_excerpt: '# Issues


    - Screening before release <!-- issue:ISS-TIMING -->

    - A limited pilot with a long title about the vendor exception and the operational
    work required before a wider rollout <!-- issue:ISS-PILOT -->

    - Support access <!-- issue:ISS-UNMAPPED -->

    '
  locator: ''
  support_state: supplied
  retrieved_at: null
  source_version: 3b8d282de6d6a3f68d6e7dd6e989fdbfe27f5af5ed8503a0a10958a64a5e9c4e
  source_hash: 3b8d282de6d6a3f68d6e7dd6e989fdbfe27f5af5ed8503a0a10958a64a5e9c4e
  explanation: ''
- source_id: 03_Matters/harbor-sandbox-release-timing-1b2102/facts.md
  source_label: 03_Matters/harbor-sandbox-release-timing-1b2102/facts.md
  path: 03_Matters/harbor-sandbox-release-timing-1b2102/facts.md
  url: null
  available_excerpt: '# Known Facts


    - Product has not confirmed whether screening completes before release.

    - Product has not confirmed whether screening completes before release.


    ## Assumptions


    No open assumptions.

    '
  locator: ''
  support_state: supplied
  retrieved_at: null
  source_version: e31ffb70a6295a26097e2a13f7fbc9d3208c7a87d936fe6de57ea3105085640d
  source_hash: e31ffb70a6295a26097e2a13f7fbc9d3208c7a87d936fe6de57ea3105085640d
  explanation: ''
- source_id: 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/context/RUN-20260906-d31937.md
  source_label: 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/context/RUN-20260906-d31937.md
  path: 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/context/RUN-20260906-d31937.md
  url: null
  available_excerpt: '# Submitted inquiry context

    '
  locator: ''
  support_state: supplied
  retrieved_at: null
  source_version: 53c390f7aad2b9f7bf75335fd9122edbc717687e122d652058077a566d026f5d
  source_hash: 53c390f7aad2b9f7bf75335fd9122edbc717687e122d652058077a566d026f5d
  explanation: ''
- source_id: 03_Matters/harbor-sandbox-release-timing-1b2102/dossier.md
  source_label: 03_Matters/harbor-sandbox-release-timing-1b2102/dossier.md
  path: 03_Matters/harbor-sandbox-release-timing-1b2102/dossier.md
  url: null
  available_excerpt: '# Matter dossier


    ## Decision question


    Which release path can Harbor use under its fictional supplier contract?


    ## Options or working recommendation


    # Screening before release — release-path analysis


    ## The rule

    Section 4 of the fictional supplier contract requires the operator to **complete
    screening before releasing a payment**. This is a sequencing obligation: screening
    must finish first, then release may occur. Section 5 reinforces it by requiring
    the operator to keep a dated screening record, which supports audit of that sequencing.


    ## The actor

    The regulated actor is the **operator** (Harbor) — the party that releases payments
    under the supplier contract. The obligation is on Harbor to complete screening
    before any release.


    ## The exception

    The contract carves out a **limited pilot**: at most **ten test accounts** may
    use **manual screening**. Two limits matter:

    - **Scale**: capped at ten test accounts.

    - **Method**: manual screening is permitted for those accounts.


    Critically, the exception **does not waive screening**. So even in the pilot,
    screening must still occur — it just may be done manually rather than through
    the automated pipeline. The pilot is not a screening-free release.


    ## The unknown timing

    The controlling unknown is whether **screening completes before release**. This
    is recorded as an open supporting question (Q-SCREENING) and an open fact: Product
    has not confirmed whether screening completes before release. Until that is answered,
    we cannot say which full-release path is available.


    ## Two conditional routes


    ### Route 1 — Delayed release (screening completes first)

    If screening does complete before release, Harbor may release payments through
    the normal path. This satisfies Section 4''s sequencing requirement. The trade-off
    is timing: release is pushed until screening finishes, which may delay the launch.


    ### Route 2 — Limited pilot (manual screening, ≤10 test accounts)

    If screening cannot be confirmed to complete before a full release, Harbor may
    still proceed with a **limited pilot** of at most ten test accounts using manual
    screening. This is the exception path. It preserves learning and limits first-release
    exposure, but it is capped at ten accounts and still requires screening (manual).
    It does not authorize a wider rollout.


    ## Business alternative

    A **business alternative** is to treat the pilot as the first release and defer
    the wider rollout until screening timing is confirmed and the pilot''s operational
    work (the subject of ISS-PILOT) is complete. This keeps Harbor within the contract
    while gathering data, at the cost of a smaller initial footprint.


    ## Why the fact matters

    The order of screening and release determines which route is available. If screening
    completes first, the full release is open. If not, only the capped manual-screening
    pilot is available. The unknown timing is therefore the pivot between the two
    conditional routes.


    ## Next counsel action


    Orient to the request


    ## Work product links


    - Draft: [Business reply](03_Matters/harbor-sandbox-release-timing-1b2102/work-product/draft/business-reply-1b25ff.md)

    '
  locator: ''
  support_state: supplied
  retrieved_at: null
  source_version: 8780636130cf2049d44b54aa92a5d17fd355d7a973dc664ad52b87be889167e3
  source_hash: 8780636130cf2049d44b54aa92a5d17fd355d7a973dc664ad52b87be889167e3
  explanation: ''
receipt:
  receipt_id: RCP-0cb2ec00da86f7d67c20
  source_action_key: map-configured-analysis-3
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260906-1b2102
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-TIMING
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:9daa566e96142bcca3e63a7f094f836946f9a5535198bb036b2c79cf54754f38
  after_revision: 1fb312f3a7ce3f86f11eb3043830602c3e35c78d8f994624591418b60134f4c3
  source_message_id: null
  run_id: RUN-20260906-0106ca
  changed_links:
  - 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/inquiries/RUN-20260906-0106ca.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T04:16:51+00:00'
claims: []
issue_analyses:
- schema_version: 1
  issue_id: ISS-TIMING
  analysis_id: IAN-b22c217582c4f526485bf91d
  analysis_revision: f2674c79427960567af9809250d2540b352a902a0d8d5fe1b992efbf4972e349
  source_path: 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/inquiries/RUN-20260906-0106ca.md
  output_revision: 1fb312f3a7ce3f86f11eb3043830602c3e35c78d8f994624591418b60134f4c3
  source_revisions: {}
  input_basis:
    business_question: 790f1fc5181a9db3af964850f6c32ef4a3162d9c830058b34f86d0b72fb3a4a0
    issue: 16b9716d32e980e1c7e0e2c47f7510bc1286a15a60f6e715f7c3c926079d7439
    facts: e132126863700c0bd631bcff119d3cb3a611d6a7f49333669b7fae817389b8f1
    assumptions: 4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945
    questions: 352221ebd27247d10d885757eb91c2c1fbc6f3b84a85531452fec7f8a69ebc13
    ? projection:eyJpbmNsdWRlZF9yb2xlcyI6IFsiQWN0aXZlIG1hdHRlciByZWNvcmQiLCAiQ3VycmVudCBidXNpbmVzcyBxdWVzdGlvbiAoY2Fub25pY2FsIHNjb3BlKSIsICJDdXJyZW50IG1hdHRlciB3b3JrIHN0YXRlIiwgIlN1cHBvcnRpbmcgcXVlc3Rpb25zIChhbnN3ZXJlZCBpcyBub3QgaW5kZXBlbmRlbnRseSB2ZXJpZmllZCBvciBpc3N1ZSByZXNvbHZlZCkiLCAiYWNjZXB0ZWRfbGF3eWVyX2NvbnRyaWJ1dGlvbnMiLCAiY29udmVyc2F0aW9uX3RhcmdldCIsICJjdXJyZW50X2ZhY3RzIiwgImhpc3RvcmljYWxfcXVlc3Rpb25fY2hhbmdlc19ub3RfY3VycmVudF9zY29wZSIsICJpc3N1ZXMiLCAibWF0dGVyX2xvY2FsX3ByZWZlcmVuY2VzIiwgIm9yaWdpbmFsX3JlcXVlc3RfaGlzdG9yaWNhbF9ub3RfY3VycmVudF9mYWN0cyIsICJ3b3JraW5nX2Fzc3VtcHRpb25zIl0sICJtYW5pZmVzdF9wcmVzZW50IjogdHJ1ZSwgInBhdGhzIjogW10sICJyZWZlcmVuY2VfaWRzIjogW119
    : b408bab71d5551c8ae3a36b73acf14afd3c05e2f4243b475864566eafe326268
  run_id: RUN-20260906-0106ca
  display_title: Screening before release
  explanation: Section 4 requires screening to complete before any release; the only
    exception is a capped manual-screening pilot that does not waive screening. Whether
    screening completes before release decides which route is available.
  business_effect: If screening completes first, Harbor can run a full release. If
    not, Harbor is limited to a ten-account manual-screening pilot and must defer
    the wider rollout.
  tests:
  - test_id: TST-136ef4cb8720520ee7b2
    title: Sequencing obligation under Section 4
    summary: The operator must complete screening before releasing a payment; Section
      5 requires a dated screening record.
    kind: contract
    actor: Harbor (operator)
    jurisdiction: Fictional supplier contract
    effective_at: Current contract term
    exceptions: Limited pilot of at most ten test accounts may use manual screening;
      the exception does not waive screening.
    applicability: Harbor is the operator that releases payments under the fictional
      supplier contract, so Section 4's sequencing obligation applies to it.
    claim_ids: []
    condition_ids:
    - CON-b1ae2f11405bff50a6eb
  conditions:
  - condition_id: CON-b1ae2f11405bff50a6eb
    question: Does screening complete before release?
    assessment: unknown
    assessment_basis: Product has not confirmed whether screening completes before
      release; recorded as an open supporting question and an open fact.
    fact_ids:
    - FACT-20260906-5f6cae
    - FACT-20260906-c18380
    question_ids:
    - Q-SCREENING
    claim_ids: []
  options:
  - option_id: OPT-98a7e452fa347b4b003e
    option_revision: 4555cacec002a8a355a6a14d2e1175b602de7314d99cde10a383da4dee4a197e
    title: Delayed full release (screening completes first)
    kind: conditional_path
    condition_summary: Screening completes before release
    requirements:
    - condition_id: CON-b1ae2f11405bff50a6eb
      state: met
    combination: all
    consequence: Harbor may release payments through the normal path, satisfying Section
      4's sequencing requirement.
    trade_off: Release is delayed until screening finishes, pushing back launch timing.
    remaining_work:
    - Confirm screening completes before release
    recommendation: candidate
    recommendation_reason: This is the only route that permits a full (uncapped) release
      under the contract.
    claim_ids: []
    work_item_ids: []
  - option_id: OPT-e66618162577f2aeaa0b
    option_revision: 43e137aece4fb9ddc6b8a05590dbe4df3dc4355ce6d48e1c8dcd0e4ee555bd24
    title: Limited pilot (manual screening, at most ten test accounts)
    kind: conditional_path
    condition_summary: Screening cannot be confirmed to complete before a full release
    requirements:
    - condition_id: CON-b1ae2f11405bff50a6eb
      state: not_met
    combination: all
    consequence: Harbor may proceed only with a limited pilot of at most ten test
      accounts using manual screening; the wider rollout must wait.
    trade_off: Capped at ten accounts and still requires screening (manual); does
      not authorize a wider rollout.
    remaining_work:
    - Confirm screening timing
    - Complete pilot operational work (ISS-PILOT)
    recommendation: candidate
    recommendation_reason: This is the only contract-compliant path when screening
      timing is unconfirmed.
    claim_ids: []
    work_item_ids: []
  - option_id: OPT-c4ef37aaf12deebe2887
    option_revision: f5e645be0531f8f297f28ef446ad02c08f18f0de6ec106a0b3535e988021b91d
    title: Treat the pilot as the first release and defer the wider rollout
    kind: business_alternative
    condition_summary: Business choice independent of the timing fact
    requirements: []
    combination: all
    consequence: Harbor stays within the contract while gathering data, deferring
      the wider rollout until screening timing is confirmed and pilot operational
      work is complete.
    trade_off: Smaller initial footprint and slower scale-up.
    remaining_work:
    - Confirm screening timing
    - Complete pilot operational work (ISS-PILOT)
    recommendation: candidate
    recommendation_reason: Preserves learning and contract compliance while limiting
      first-release exposure.
    claim_ids: []
    work_item_ids: []
  warnings: []
---
I have the full picture. The dossier already contains a thorough analysis. Let me provide the answer directly, explaining the selected issue (ISS-TIMING, "Screening before release") with the rule, actor, exception, unknown timing, two conditional routes, and a business alternative, plus the optional decision-paths structure.
## The issue: Screening before release
**Why the fact matters.** The order of screening and release is the pivot that decides which launch path Harbor can lawfully use. If screening completes before release, the full release is open. If it does not, only the capped manual-screening pilot is available. Until that timing is confirmed, Harbor cannot know which route it is on — which is exactly why this is the controlling issue.
**The rule.** Section 4 of the fictional supplier contract requires the operator to **complete screening before releasing a payment**. This is a sequencing obligation: screening must finish first, then release may occur. Section 5 reinforces it by requiring a dated screening record, which supports audit of that sequencing.
**The actor.** The regulated actor is the **operator — Harbor** — the party that releases payments under the supplier contract. The obligation to complete screening before any release sits on Harbor.
**The exception.** Section 4 carves out a **limited pilot**: at most **ten test accounts** may use **manual screening**. Two limits matter:
- **Scale** — capped at ten test accounts.
- **Method** — manual screening is permitted for those accounts.
Critically, the exception **does not waive screening**. Even in the pilot, screening must still occur; it just may be done manually rather than through the automated pipeline. The pilot is not a screening-free release.
**The unknown timing.** The controlling unknown is whether **screening completes before release**. This is recorded as an open supporting question and an open fact: Product has not confirmed whether screening completes before release. Until that is answered, we cannot say which full-release path is available.
**Two conditional routes.**
*Route 1 — Delayed release (screening completes first).* If screening does complete before release, Harbor may release payments through the normal path. This satisfies Section 4's sequencing requirement. The trade-off is timing: release is pushed until screening finishes, which may delay launch.
*Route 2 — Limited pilot (manual screening, ≤10 test accounts).* If screening cannot be confirmed to complete before a full release, Harbor may still proceed with a limited pilot of at most ten test accounts using manual screening. This is the exception path. It preserves learning and limits first-release exposure, but it is capped at ten accounts and still requires screening (manual). It does not authorize a wider rollout.
**Business alternative.** Treat the pilot as the first release and defer the wider rollout until screening timing is confirmed and the pilot's operational work is complete. This keeps Harbor within the contract while gathering data, at the cost of a smaller initial footprint.
**Contrast.** Compare the two routes directly: a delayed full release gets the whole customer base live but only after screening finishes; the pilot gets only ten test accounts live now, using manual screening, while the wider rollout waits. The choice between them is not a legal preference — it is dictated by the unknown timing fact.


The single material unknown is whether screening completes before release. Once Product confirms that, the correct route is determined: full release if yes, capped manual-screening pilot if no.
