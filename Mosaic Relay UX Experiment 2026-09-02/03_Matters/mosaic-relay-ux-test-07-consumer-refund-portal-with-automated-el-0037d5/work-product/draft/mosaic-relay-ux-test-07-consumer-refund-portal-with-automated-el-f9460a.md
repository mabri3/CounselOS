---
work_product_id: WP-1fa0a3f9460a
matter_id: MAT-20260902-0037d5
title: Mosaic Relay UX Test — 07 — Consumer Refund Portal with Automated Eligibility
  response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T15:52:12+00:00'
updated_at: '2026-09-02T15:52:12+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-0037d5:MSG-20260902-87652e
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'I have enough context. The most natural referent for "both paths" is the
      two escalation/routing paths described in the denial recommendation: (1) route
      to the merchant, and (2) route to another dispute process (card-network or ACH).
      This is the most recent substantive content and the phrase "route to the merchant
      or another dispute process" appears throughout.

      I''ll provide a clear comparison of these two paths, and note the ambiguity
      so the user can redirect if they meant something else (e.g., the agent vs. independent
      role).

      ## Comparing the two escalation paths for a denied refund request

      The working recommendation routes a denied request down one of two paths. Here''s
      how they compare:

      **Path 1 — Route to the merchant**

      - **When it applies:** The request needs merchant judgment or data the portal
      can''t resolve — goods/services disputes, partial or recurring charges, merchant
      approval, or missing transaction data.

      - **What the payer gets:** A clear merchant-support route with a response target,
      plus the reason, transaction date/window, and refund options.

      - **Who owns the outcome:** The merchant decides. Mosaic Relay facilitates the
      handoff but doesn''t resolve the underlying dispute.

      - **Why it matters legally:** Merchants remain responsible for their goods/services,
      so this path keeps that responsibility with the merchant and avoids Mosaic Relay
      taking on liability for the underlying transaction.

      **Path 2 — Route to another dispute process**

      - **When it applies:** The claim is really a payment-rail dispute, not a merchant
      refund — card-network disputes go to the payer''s issuer/network process; ACH
      unauthorized/error claims go to the bank/processor return process.

      - **What the payer gets:** Direction to the correct external process; the portal
      must not imply a refund request replaces those rights.

      - **Who owns the outcome:** The issuer/network or bank/processor, under their
      own rules and timelines.

      - **Why it matters legally:** These are statutory/network rights (e.g., card
      chargeback rights, ACH error-resolution rules) that the portal can''t override
      or extinguish by offering a refund instead.

      **Key differences at a glance**

      | | Merchant path | Dispute-process path |

      |---|---|---|

      | Trigger | Goods/services, partial/recurring, merchant approval, missing data
      | Card-network or ACH unauthorized/error claim |

      | Decision-maker | Merchant | Issuer/network or bank/processor |

      | Portal''s role | Facilitate handoff + notice | Refer out; preserve rights
      |

      | Legal basis | Merchant''s responsibility for goods/services | Network rules
      / statutory error-resolution rights |

      **Bottom line:** The merchant path is for disputes about the *transaction''s
      substance* (did the payer get what they paid for), while the dispute-process
      path is for claims about the *payment itself* (was it authorized/valid). Both
      must be surfaced transparently to the payer with a response target and in the
      payer''s language — never a silent denial.

      ---

      One note: "both paths" could also refer to the two undecided role options (Mosaic
      Relay as the merchant''s agent vs. an independent decision-maker), or to the
      two open research questions. If you meant one of those, let me know and I''ll
      compare those instead.

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
I have enough context. The most natural referent for "both paths" is the two escalation/routing paths described in the denial recommendation: (1) route to the merchant, and (2) route to another dispute process (card-network or ACH). This is the most recent substantive content and the phrase "route to the merchant or another dispute process" appears throughout.
I'll provide a clear comparison of these two paths, and note the ambiguity so the user can redirect if they meant something else (e.g., the agent vs. independent role).
## Comparing the two escalation paths for a denied refund request
The working recommendation routes a denied request down one of two paths. Here's how they compare:
**Path 1 — Route to the merchant**
- **When it applies:** The request needs merchant judgment or data the portal can't resolve — goods/services disputes, partial or recurring charges, merchant approval, or missing transaction data.
- **What the payer gets:** A clear merchant-support route with a response target, plus the reason, transaction date/window, and refund options.
- **Who owns the outcome:** The merchant decides. Mosaic Relay facilitates the handoff but doesn't resolve the underlying dispute.
- **Why it matters legally:** Merchants remain responsible for their goods/services, so this path keeps that responsibility with the merchant and avoids Mosaic Relay taking on liability for the underlying transaction.
**Path 2 — Route to another dispute process**
- **When it applies:** The claim is really a payment-rail dispute, not a merchant refund — card-network disputes go to the payer's issuer/network process; ACH unauthorized/error claims go to the bank/processor return process.
- **What the payer gets:** Direction to the correct external process; the portal must not imply a refund request replaces those rights.
- **Who owns the outcome:** The issuer/network or bank/processor, under their own rules and timelines.
- **Why it matters legally:** These are statutory/network rights (e.g., card chargeback rights, ACH error-resolution rules) that the portal can't override or extinguish by offering a refund instead.
**Key differences at a glance**
| | Merchant path | Dispute-process path |
|---|---|---|
| Trigger | Goods/services, partial/recurring, merchant approval, missing data | Card-network or ACH unauthorized/error claim |
| Decision-maker | Merchant | Issuer/network or bank/processor |
| Portal's role | Facilitate handoff + notice | Refer out; preserve rights |
| Legal basis | Merchant's responsibility for goods/services | Network rules / statutory error-resolution rights |
**Bottom line:** The merchant path is for disputes about the *transaction's substance* (did the payer get what they paid for), while the dispute-process path is for claims about the *payment itself* (was it authorized/valid). Both must be surfaced transparently to the payer with a response target and in the payer's language — never a silent denial.
---
One note: "both paths" could also refer to the two undecided role options (Mosaic Relay as the merchant's agent vs. an independent decision-maker), or to the two open research questions. If you meant one of those, let me know and I'll compare those instead.
