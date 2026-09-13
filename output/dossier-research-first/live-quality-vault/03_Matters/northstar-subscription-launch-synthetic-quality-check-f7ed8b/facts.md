---
matter_id: MAT-20260912-f7ed8b
record_type: facts
facts:
- fact_id: FACT-20260912-ace060
  text: Product reports a planned public launch event on November 2, 2026.
  status: active
  material: true
  source_ids:
  - SRC-20260912-2e949f
  supersedes: null
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-73d897
- fact_id: FACT-20260912-20dc16
  text: The fixture record was administered on September 12, 2026; this is not the
    launch event date or a legal deadline.
  status: active
  material: true
  source_ids:
  - SRC-20260912-2e949f
  supersedes: null
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-73d897
- fact_id: FACT-20260912-3ea97e
  text: Product reports that the monthly subscription renews until cancelled and should
    have an online cancellation path.
  status: active
  material: true
  source_ids:
  - SRC-20260912-2e949f
  supersedes: null
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-73d897
- fact_id: FACT-20260912-f481a7
  text: The synthetic vendor contract makes console access end at termination and
    generally requires a written export request before termination.
  status: active
  material: true
  source_ids:
  - SRC-20260912-87fe8e
  supersedes: null
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-73d897
sources:
- source_id: SRC-20260912-2e949f
  kind: file
  label: Synthetic product brief
  path: 03_Matters/northstar-subscription-launch-synthetic-quality-check-f7ed8b/documents/synthetic-product-brief.md
  version: ce4284411beecd1046e87889a7cb50688d3dc23eb838146227a7f128df8d38b0
  location: ''
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-197754
- source_id: SRC-20260912-87fe8e
  kind: file
  label: SYNTHETIC vendor contract — not law
  path: 03_Matters/northstar-subscription-launch-synthetic-quality-check-f7ed8b/documents/synthetic-vendor-contract.md
  version: 71cc351972bffa2357f15b15f6a21ff590f8f2c853ec651fb413aabe491a8f1f
  location: ''
  created_at: '2026-09-12T06:26:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260912-197754
support: []
assumptions:
- assumption_id: ASM-20260912-2f0732
  text: 'Inferred assumption: the planned California subscription flow is offered
    to at least one person covered by applicable California consumer rules.'
  reason: The product brief gives geography and a consumer subscription model but
    not legal classification for each user.
  material: true
  status: open
  created_at: '2026-09-12T06:26:33+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260912-73d897
conflicts: []
actions:
- action_id: ACT-20260912-197754
  summary: Record synthetic quality-check sources
  actor: Synthetic fixture
  created_at: '2026-09-12T06:26:33+00:00'
  status: applied
  created:
    facts: []
    sources:
    - SRC-20260912-2e949f
    - SRC-20260912-87fe8e
    support: []
    assumptions: []
  source_action_key: step13:live-quality:sources:20260912-01
- action_id: ACT-20260912-73d897
  summary: Record synthetic reported facts and one explicit inferred assumption
  actor: Synthetic fixture
  created_at: '2026-09-12T06:26:33+00:00'
  status: applied
  created:
    facts:
    - FACT-20260912-ace060
    - FACT-20260912-20dc16
    - FACT-20260912-3ea97e
    - FACT-20260912-f481a7
    sources: []
    support: []
    assumptions:
    - ASM-20260912-2f0732
  source_action_key: step13:live-quality:facts:20260912-01
working_ask: ''
issues:
- 'Subscription enrollment and cancellation: Confirm affirmative consent, renewal
  disclosure, cancellation, and any material exception before launch.'
- 'Consumer privacy notice and vendor controls: Confirm notice at collection and limits
  for a service provider handling account data.'
- 'Vendor termination, export, and continuity: Apply the synthetic vendor contract''s
  access-loss and export conditions to launch continuity.'
- 'Accessibility readiness: Keep the product accessibility review visible while legal
  research proceeds.'
- 'Brand and trademark clearance: Keep brand clearance visible while legal research
  proceeds.'
open_questions: []
public_research_questions: []
intake_answers: []
intake_state: active
---
# Known Facts

- Product reports a planned public launch event on November 2, 2026.
- The fixture record was administered on September 12, 2026; this is not the launch event date or a legal deadline.
- Product reports that the monthly subscription renews until cancelled and should have an online cancellation path.
- The synthetic vendor contract makes console access end at termination and generally requires a written export request before termination.

## Assumptions

- [Assumption] Inferred assumption: the planned California subscription flow is offered to at least one person covered by applicable California consumer rules.
