---
work_product_id: WP-ce2fbef7e8ec
matter_id: MAT-DEMO-APEX
title: Working draft
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-06T08:51:47+00:00'
updated_at: '2026-09-06T08:51:47+00:00'
immutable: false
source_action_key: template-preview:e5a6760c-4f71-481e-be94-0e8353c3f41b
source_action_payload: 8b670debcdef3633099cbd08b880a69351d2cc18b39b425ef5ce2864c0a696fc
output_type: business_decision_brief
template_use:
  template_id: output-business-decision-brief-copy-143145e2
  output_type: business_decision_brief
  revision: 4:7154b4cdd09545e9
  content_hash: 7154b4cdd09545e92d7e7c25fae88685b55e40a0270a6654ace7d49e106073c4
  revision_path: 00_System/skills/output_templates/history/output-business-decision-brief-copy-143145e2/4-7154b4cdd09545e9.md
  instructions_snapshot: State the decision needed in plain language. Compare realistic
    options and their tradeoffs. Give a working recommendation with material assumptions
    and unknowns. This is analysis for a decision; it does not record or make the
    decision.
  section_outline_snapshot: Decision needed; Options; Tradeoffs; Recommendation; Unknowns;
    Next step
  defaults_snapshot:
    audience: Business owner
    purpose: Confirm supplied process ownership and version.
  overrides:
    audience: Operations
    purpose: Confirm owner
    tone: Direct
    length: One page
    instruction: Use supplied process facts only.
  state: applied
  failure_detail: null
  path: 00_System/skills/output-business-decision-brief-copy-143145e2.md
  status: applied
preview: true
source_run_id: RUN-20260906-378c95
claim_ids: []
draft_context:
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-DEMO-APEX
    business_question_id: BQ-09622fc729219256
    business_question_revision: legacy:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    issue_id: null
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  source_revisions:
    03_Matters/project-apex-ai/matter.md: ca4e7a301ef297e229674a1ff54e71aad94b49706baeae416d3f9b71719d5a8c
    03_Matters/project-apex-ai/facts.md: d8c4b1f57b8711d7c42c7b8e45c9e0214f6bdcc055bb80106a2abb9ca177283d
    03_Matters/project-apex-ai/issues.md: 5890672cfd1c536da742dcf7964be68fd0ace0bd4b221def905db90245dcc41c
    03_Matters/project-apex-ai/recommendations.md: 6bbd48124f450bbff35ab1fc9a0dd032187a8f73e0484ccb8080edcf02d02b6e
    business_question: legacy:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  action_actor:
    person_id: alex-test
    display_name: Alex Test
    mode: demo
  recovery: complete_saved_response
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  **Working path:** approve a limited launch with explicit opt-in, a shorter default
  retention period, vendor purpose restrictions, and deletion testing. Counsel must
  confirm the training purpose and final retention period.'
---
Here is the useful first-pass view: start with the business objective and the decision that must be made, then identify the two or three facts that could change the path. The active matter context and source files are available in the workspace. In mock mode I can also move the matter, run a scaffolded research pass, create work items, audit decisions, and create basic schedules. Configure an OpenAI-compatible provider in `.env` for model-generated analysis.
