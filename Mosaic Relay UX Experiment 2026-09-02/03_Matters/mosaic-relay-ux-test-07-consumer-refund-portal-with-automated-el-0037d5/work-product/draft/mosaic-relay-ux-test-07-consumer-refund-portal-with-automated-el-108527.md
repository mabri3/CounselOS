---
work_product_id: WP-37ba65108527
matter_id: MAT-20260902-0037d5
title: Mosaic Relay UX Test — 07 — Consumer Refund Portal with Automated Eligibility
  response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T15:55:26+00:00'
updated_at: '2026-09-02T15:55:26+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-0037d5:MSG-20260902-99825a
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'Good question — this pushes on the assumptions behind the cross-matter
      analysis. Here''s what would change my view on the overlaps and dependencies:

      **On the ACH holds overlap (Test 03):**

      - If the ACH holds matter turns out to be about *pre-funding holds on merchant
      payouts* (risk controls on the merchant side) rather than *payer-initiated returns*,
      the overlap is much weaker. The refund portal''s ACH interaction is about payer
      error/unauthorized returns, which is a different mechanism and timeline.

      - If the two matters use different ACH return codes or different notice obligations,
      the "keep them consistent" recommendation would need to be revisited.

      **On the chargeback deactivation overlap (Test 04):**

      - If the deactivation matter is purely about *merchant risk thresholds* (chargeback
      ratios triggering account action) and doesn''t actually touch the *payer-facing
      refund/dispute flow*, the overlap is mostly cosmetic — they''d share vocabulary
      but not design decisions.

      - If Mosaic Relay decides the refund portal *does* resolve some card-network
      disputes (contrary to the current "does not resolve disputes" fact), that would
      materially change the relationship and make the two matters much more tightly
      coupled.

      **On the fraud-detection overlap (Test 05):**

      - If the fraud matter is about *using transaction data for merchant risk scoring*
      rather than *payer identity verification before releasing funds*, the shared
      "fraud controls" theme is thinner than it appears. The refund portal''s authentication
      question is payer-side; the fraud matter may be merchant-side.

      **On the agency-role question (Test 01):**

      - If Mosaic Relay decides it is *not* acting as the merchant''s agent (independent
      decision-maker), the merchant-agreement framing shared with the onboarding matter
      becomes less relevant to this portal.

      **The biggest single driver:** the **undecided agency role** and the **undecided
      authentication method**. Both are open facts. If those resolve one way, the
      portal''s liability, routing, and fraud-control design — and therefore its overlap
      with the other matters — shifts meaningfully.

      **What would most change my view overall:** evidence that the refund portal
      is intended to *resolve* (not just route) card-network disputes or ACH claims,
      or that it will handle partial/recurring refunds. Those two changes would turn
      the portal from a facilitation layer into a decision-maker, which would substantially
      increase its coupling with the dispute and holds matters.

      Would you like me to pull the actual conclusions from the ACH holds and chargeback
      matters to test these assumptions against what''s actually recorded there?

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: false
  authors: []
  comment_events: []
---
Good question — this pushes on the assumptions behind the cross-matter analysis. Here's what would change my view on the overlaps and dependencies:
**On the ACH holds overlap (Test 03):**
- If the ACH holds matter turns out to be about *pre-funding holds on merchant payouts* (risk controls on the merchant side) rather than *payer-initiated returns*, the overlap is much weaker. The refund portal's ACH interaction is about payer error/unauthorized returns, which is a different mechanism and timeline.
- If the two matters use different ACH return codes or different notice obligations, the "keep them consistent" recommendation would need to be revisited.
**On the chargeback deactivation overlap (Test 04):**
- If the deactivation matter is purely about *merchant risk thresholds* (chargeback ratios triggering account action) and doesn't actually touch the *payer-facing refund/dispute flow*, the overlap is mostly cosmetic — they'd share vocabulary but not design decisions.
- If Mosaic Relay decides the refund portal *does* resolve some card-network disputes (contrary to the current "does not resolve disputes" fact), that would materially change the relationship and make the two matters much more tightly coupled.
**On the fraud-detection overlap (Test 05):**
- If the fraud matter is about *using transaction data for merchant risk scoring* rather than *payer identity verification before releasing funds*, the shared "fraud controls" theme is thinner than it appears. The refund portal's authentication question is payer-side; the fraud matter may be merchant-side.
**On the agency-role question (Test 01):**
- If Mosaic Relay decides it is *not* acting as the merchant's agent (independent decision-maker), the merchant-agreement framing shared with the onboarding matter becomes less relevant to this portal.
**The biggest single driver:** the **undecided agency role** and the **undecided authentication method**. Both are open facts. If those resolve one way, the portal's liability, routing, and fraud-control design — and therefore its overlap with the other matters — shifts meaningfully.
**What would most change my view overall:** evidence that the refund portal is intended to *resolve* (not just route) card-network disputes or ACH claims, or that it will handle partial/recurring refunds. Those two changes would turn the portal from a facilitation layer into a decision-maker, which would substantially increase its coupling with the dispute and holds matters.
Would you like me to pull the actual conclusions from the ACH holds and chargeback matters to test these assumptions against what's actually recorded there?
