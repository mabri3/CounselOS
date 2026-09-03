---
decision_id: DEC-BFDEDDF53780DF7678C8
matter_id: MAT-20260903-724266
title: Mosaic Relay UX Test — 01 — Marketplace Seller Onboarding Refresh
decision_type: legal_decision
chosen_path: Conditional approval for a limited US-only pilot; no unrestricted production
  launch
rationale: The first-pass analysis supports a controlled US-only pilot because the
  requested fields and shared operating model can support KYC/KYB and payout review,
  but geography, regulated-actor status, source verification, state coverage, retention
  mapping, and notice ownership remain unresolved. The pilot must preserve manual
  review for exceptions and must not be described as approved for broad production
  until the launch conditions are evidenced.
decision_maker: Lawyer
conditions:
- Confirm customer and seller geography, including states and any non-US sellers,
  before expansion.
- Confirm regulated actor, money-transmission licensing or agent status, AML-program
  owner, and funds-control duties.
- Approve the field-by-field KYC/KYB map for mixed seller types, including 25% UBO
  and one control person.
- Run sanctions and adverse-media screening before approval; route hits, mismatches,
  high-risk or prohibited cases, incomplete records, and payout failures to trained
  manual review.
- Publish deterministic low-risk rules, reviewer escalation, and adverse-action procedures
  with Product Operations and AML Compliance sign-off.
- 'Provide and test the shared notice split: Mosaic Relay for KYC/payments/privacy/funds-flow
  notices; marketplace for seller-facing disclosures.'
- Verify jurisdiction-specific retention by data element and deletion ownership; substantiate
  or qualify the 25% abandonment claim.
not_decided:
- Specific states and whether any sellers are outside the US.
- Which party is the regulated actor and what licenses or bank/processor arrangements
  apply.
- Exact risk data sources, retention periods per data element, and final notice allocation.
- Whether cited authorities can be verified before the pilot.
linked_paths:
- 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/research/RES-20260903-86ede6.md
- 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/facts.md
- 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/issues.md
- 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/recommendations.md
- 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/request.md
mitigation_ids: []
review_packet_ids: []
revises_decision_id: null
decided_at: '2026-09-03T14:45:55+00:00'
next_review_at: '2026-12-03'
last_reviewed_at: '2026-09-03T14:45:55+00:00'
risk_level: high
review_status: fresh
staleness_reason: ''
privilege: privileged_and_confidential
source_action_key: decision:ui:84ea8f1f-c733-4da7-bdf8-d621b7bedb80
recorded_event_id: EVT-DEC-BFDEDDF53780DF7678C8
recording_complete: true
recommendation_disposition: followed
recommendation_disposition_reason: ''
recommendation_version_id: REC-20260903-f43327
---
# Mosaic Relay UX Test — 01 — Marketplace Seller Onboarding Refresh

## Chosen path

Conditional approval for a limited US-only pilot; no unrestricted production launch

## Rationale

The first-pass analysis supports a controlled US-only pilot because the requested fields and shared operating model can support KYC/KYB and payout review, but geography, regulated-actor status, source verification, state coverage, retention mapping, and notice ownership remain unresolved. The pilot must preserve manual review for exceptions and must not be described as approved for broad production until the launch conditions are evidenced.

## Recommendation disposition

Followed

## Conditions

- Confirm customer and seller geography, including states and any non-US sellers, before expansion.
- Confirm regulated actor, money-transmission licensing or agent status, AML-program owner, and funds-control duties.
- Approve the field-by-field KYC/KYB map for mixed seller types, including 25% UBO and one control person.
- Run sanctions and adverse-media screening before approval; route hits, mismatches, high-risk or prohibited cases, incomplete records, and payout failures to trained manual review.
- Publish deterministic low-risk rules, reviewer escalation, and adverse-action procedures with Product Operations and AML Compliance sign-off.
- Provide and test the shared notice split: Mosaic Relay for KYC/payments/privacy/funds-flow notices; marketplace for seller-facing disclosures.
- Verify jurisdiction-specific retention by data element and deletion ownership; substantiate or qualify the 25% abandonment claim.

## Not decided

- Specific states and whether any sellers are outside the US.
- Which party is the regulated actor and what licenses or bank/processor arrangements apply.
- Exact risk data sources, retention periods per data element, and final notice allocation.
- Whether cited authorities can be verified before the pilot.
