---
packet_id: PKT-DEMO-ALTERNATIVE-DATA
path: 05_Briefing/review-packets/PKT-DEMO-ALTERNATIVE-DATA.md
development_ids:
- DEV-DEMO-ALTERNATIVE-DATA
briefing_item_ids:
- ITEM-DEMO-ALTERNATIVE-DATA-DECISION
potential_impact: high
review_priority: today
attention_state: required
what_happened: A synthetic demo signal links public adverse-action explanation guidance to an existing company decision about an AI pilot and its data limits.
legal_status: No new 2026 legal change is asserted. Public guidance requires source review before reliance.
why_surfaced: CounselOS matched the alternative-data topic to DEC-DEMO-APEX-RETENTION inside the local vault.
affected_products: []
affected_policies: []
affected_matters:
- MAT-DEMO-APEX
affected_decisions:
- DEC-DEMO-APEX-RETENTION
affected_mitigations: []
prior_decision_basis: The pilot was allowed with notice and a 30-day raw-audio retention cap because it could test value without indefinite retention or external model training.
existing_mitigations:
- Explicit employee notice
- 30-day raw-audio retention cap
possible_tension: The prior decision addresses collection and retention. It does not record whether decision explanations are specific enough if pilot data later affects eligibility or credit outcomes.
timing: Review before any expansion of the pilot into an eligibility or credit decision.
effective_dates: []
sources:
- title: CFPB Circular 2022-03
  canonical_url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
  publisher: Consumer Financial Protection Bureau
  published_at: null
  effective_at: null
  locator: Public CFPB circular page
  excerpt: Demo fixture stores no quoted source text.
  support_state: retrieved
  warning: Retrieved, but no stored claim-to-excerpt verification was completed.
- title: CFPB Circular 2022-03
  canonical_url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
  publisher: Consumer Financial Protection Bureau
  published_at: null
  effective_at: null
  locator: Citation supplied by Polaris mock response
  excerpt: ''
  support_state: supplied
  warning: Themis · Not reviewed. Supplied support is not verified support.
warnings:
- Synthetic demo packet. It recommends review but records no lawyer outcome.
status: open
revision: 1
created_at: '2026-08-29T15:00:04+00:00'
updated_at: '2026-08-29T15:00:04+00:00'
---
# Review packet PKT-DEMO-ALTERNATIVE-DATA

This packet prepares a lawyer decision. It does not change `DEC-DEMO-APEX-RETENTION`.
