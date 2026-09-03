---
decision_id: DEC-76ED9BD0C1FC32F2F502
matter_id: MAT-20260903-bad495
title: Mosaic Relay UX Test — 05 — Refunds for Split Payments
decision_type: legal_decision
chosen_path: Proceed with the split-payment partial-refund tool only as a launch-gated
  release; do not launch until seller terms and all listed controls are effective.
rationale: The core model is workable, but silent seller terms create a material contract
  gap. Split tender, card/ACH timing, fee reversal, negative seller balances, and
  chargeback reduction require clear disclosures and an auditable source of truth.
  The recommendation is followed with explicit launch conditions.
decision_maker: Lawyer
conditions:
- Seller refund, fee-reversal, payout-hold, notice, and dispute terms are drafted,
  approved, and effective.
- Product records the fee-absorption/proration rule and buyer-facing refund policy.
- Legal and Payments Ops validate card-network and ACH issuance/posting windows; copy
  separates issuance from bank posting.
- Buyer and seller notices show amount, original tender, seller allocation, timing
  caveat, status, and dispute effect.
- Engineering enforces append-only versioned ledger, idempotency, reconciliation,
  and refunded-plus-disputed-not-greater-than-funded invariant.
- Risk and Payments Ops link refunds and disputes to one allocation snapshot and prevent
  duplicate recovery.
- Negative seller balances require contractual payout holds, seller notice, recovery
  and write-off approval.
- Support overrides require named approver, reason, evidence, and immutable audit
  event.
- Tax/Finance confirms tax treatment, accounting, and record retention; regulated-actor
  roles are confirmed.
not_decided:
- 'Who absorbs the prorated fee: buyer credit, platform, or seller.'
- Whether seller amendments can be unilateral or require seller consent.
- Exact card-network and ACH deadlines and treatment of ACH returns versus voluntary
  refunds.
- Tax treatment and any corrected seller tax reporting.
- Whether Mosaic Relay's role changes money-transmission characterization.
linked_paths:
- 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/research/RES-20260903-f59c6c.md
- 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/facts.md
- 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/issues.md
- 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/recommendations.md
- 03_Matters/mosaic-relay-ux-test-05-refunds-for-split-payments-bad495/request.md
mitigation_ids: []
review_packet_ids: []
revises_decision_id: null
decided_at: '2026-09-03T17:21:54+00:00'
next_review_at: '2026-12-03'
last_reviewed_at: '2026-09-03T17:21:54+00:00'
risk_level: unknown
review_status: fresh
staleness_reason: ''
privilege: privileged_and_confidential
source_action_key: decision:ui:8e572fa4-6852-4792-8b27-71c8f58396a6
recorded_event_id: EVT-DEC-76ED9BD0C1FC32F2F502
recording_complete: true
recommendation_disposition: followed
recommendation_disposition_reason: ''
recommendation_version_id: REC-20260903-0fad1e
---
# Mosaic Relay UX Test — 05 — Refunds for Split Payments

## Chosen path

Proceed with the split-payment partial-refund tool only as a launch-gated release; do not launch until seller terms and all listed controls are effective.

## Rationale

The core model is workable, but silent seller terms create a material contract gap. Split tender, card/ACH timing, fee reversal, negative seller balances, and chargeback reduction require clear disclosures and an auditable source of truth. The recommendation is followed with explicit launch conditions.

## Recommendation disposition

Followed

## Conditions

- Seller refund, fee-reversal, payout-hold, notice, and dispute terms are drafted, approved, and effective.
- Product records the fee-absorption/proration rule and buyer-facing refund policy.
- Legal and Payments Ops validate card-network and ACH issuance/posting windows; copy separates issuance from bank posting.
- Buyer and seller notices show amount, original tender, seller allocation, timing caveat, status, and dispute effect.
- Engineering enforces append-only versioned ledger, idempotency, reconciliation, and refunded-plus-disputed-not-greater-than-funded invariant.
- Risk and Payments Ops link refunds and disputes to one allocation snapshot and prevent duplicate recovery.
- Negative seller balances require contractual payout holds, seller notice, recovery and write-off approval.
- Support overrides require named approver, reason, evidence, and immutable audit event.
- Tax/Finance confirms tax treatment, accounting, and record retention; regulated-actor roles are confirmed.

## Not decided

- Who absorbs the prorated fee: buyer credit, platform, or seller.
- Whether seller amendments can be unilateral or require seller consent.
- Exact card-network and ACH deadlines and treatment of ACH returns versus voluntary refunds.
- Tax treatment and any corrected seller tax reporting.
- Whether Mosaic Relay's role changes money-transmission characterization.
