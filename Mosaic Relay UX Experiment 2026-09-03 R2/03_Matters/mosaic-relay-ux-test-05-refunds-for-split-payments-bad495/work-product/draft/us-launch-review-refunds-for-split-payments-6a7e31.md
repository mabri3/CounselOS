---
work_product_id: WP-fb124d6a7e31
matter_id: MAT-20260903-bad495
title: US Launch Analysis — Refunds for Split Payments
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T17:18:36+00:00'
updated_at: '2026-09-03T17:20:02+00:00'
immutable: false
source_action_key: chat:RUN-20260903-6527bd:tool:014eac6cd02fff1ca2a5f01a
recommendation_version_id: REC-20260903-30ff92
recommendation_snapshot: 'Proceed with the split-payment partial-refund tool, but
  do not launch until the seller term amendments are drafted and effective and the
  launch conditions are met. The core architecture (immutable ledger source of truth,
  prorated fee reversal, negative-balance holds, refund-reduces-dispute, named-approver
  overrides) is sound and consistent. The single material gap is that seller terms
  are silent, so the tool''s behavior is not contractually supported; that must be
  closed before launch. Launch conditions: (1) seller term amendments drafted and
  effective; (2) fee-reversal absorption decided and reflected in terms and disclosure;
  (3) timing language validated against card-network and NACHA deadlines with issuance-vs-posting
  disclosure; (4) ledger immutability and daily reconciliation implemented with the
  double-recovery invariant enforced; (5) negative-balance and payout-hold controls
  implemented with seller notice and contractual right; (6) chargeback sequencing
  implemented so refund and dispute flows share the same snapshot; (7) override workflow
  implemented with named-approver approval and auditable events; (8) tax treatment
  confirmed by tax counsel; (9) regulated-actor confirmation of who holds funds and
  owns the buyer/seller relationship.'
last_source_action_key: chat:RUN-20260903-bed7f1:tool:736eff32c6905347200abdae
review:
  segments:
  - kind: delete
    text: '# US Launch Review — Refunds for Split Payments


      **Matter:** Mosaic Relay UX Test — 05 — Refunds for Split Payments

      **Scope:** United States only

      **Status:** First-pass research packet — model-only analysis grounded in the
      matter facts. No external authority retrieved; no citations are invented. Every
      legal proposition below is a lead to verify, not a confirmed citation.


      ---


      ## 1. Question


      A marketplace wants to issue partial refunds for orders funded by several payment
      methods (card and ACH) and distributed among multiple sellers. The tool lets
      a marketplace operator select line items, calculate each seller''s share, reverse
      the platform fee, and send status updates to the buyer and sellers. Product
      wants to release in one quarter. Legal must specify the refund rules, disclosures,
      timing promises, ledger controls, seller notices, and exception approvals to
      require.


      This packet covers: card vs. ACH refund timing, refund disclosures, seller notices,
      allocation and fee-reversal rules, negative balances, chargeback interaction,
      ledger controls, support overrides, tax treatment, and the source of truth for
      disputed allocations.


      ## 2. Recorded decisions (source: matter facts)


      These are settled inputs, not assumptions:


      - **Refund timing promise:** within standard card-network/ACH refund windows
      (e.g., 5–7 business days).

      - **Platform fee on partial refund:** prorated to the refunded amount.

      - **Negative seller balance:** allowed to go negative; future payouts are held
      until the balance is recovered.

      - **Chargeback interaction:** a refund reduces or closes the dispute amount
      (refunds and disputes are not handled independently).

      - **Jurisdiction:** United States only.

      - **Source of truth:** immutable order ledger with a versioned allocation snapshot
      at capture. Every refund and chargeback references that snapshot and appends
      an auditable event. A dispute adjustment may only be made by an approved reconciliation
      record; no support edit may overwrite the original allocation.

      - **Customer-support overrides:** allowed only with a named approver (e.g.,
      manager/legal).

      - **Seller terms:** silent on refunds, fee reversal, and notice; must be added/amended.


      ## 3. Likely rules and issues


      ### 3.1 Card vs. ACH refund timing

      - **Card refunds** are governed by the card-network operating rules (Visa, Mastercard,
      etc.) and the merchant/acquiring agreement. Card-network rules generally require
      refunds to be processed to the original payment method and within defined windows;
      a 5–7 business day promise is a common framing but the exact network deadline
      and the acquiring-bank SLA must be confirmed.

      - **ACH refunds** are governed by the NACHA Operating Rules. ACH credits (including
      refunds) settle on defined effective dates; the 5–7 business day promise must
      be reconciled against NACHA settlement timing and the originating/return windows.

      - **Key issue:** The single "5–7 business days" promise may not hold identically
      for card and ACH. The tool must either make a per-method promise or a single
      promise that the slower method can always meet. Verify the network and NACHA
      deadlines before committing the promise in buyer-facing copy.


      ### 3.2 Refund disclosures to buyers

      - Consumer-protection framing (e.g., FTC Act § 5 on deceptive practices, state
      UDAP statutes) requires that any refund timing or "money back" promise be accurate
      and not misleading. If the tool promises a refund within 5–7 business days,
      the promise must be achievable for both card and ACH and for partial refunds.

      - **Key issue:** The buyer-facing disclosure must state (a) what is refunded
      (the selected line items / seller shares), (b) the timing, (c) the original
      payment method, and (d) how a partial refund interacts with any dispute. Confirm
      whether the marketplace or Mosaic Relay owns this disclosure.


      ### 3.3 Seller notices

      - Seller terms are silent, so the tool''s behavior is not contractually supported.
      Seller notices must be added to the seller agreement covering: refund obligation,
      prorated fee reversal, negative-balance recovery via held payouts, refund timing,
      and dispute/chargeback interaction.

      - **Key issue:** Whether the marketplace can unilaterally amend seller terms
      or needs seller consent determines rollout path and timing against the one-quarter
      release. This is an open fork.


      ### 3.4 Allocation and fee-reversal rules

      - The recorded decision is that the platform fee is prorated to the refunded
      amount. This must be defined precisely: prorated on the refunded line-item amount,
      and whether the fee reversal is credited to the buyer or absorbed by the platform/seller.

      - **Key issue:** Confirm who absorbs the reversed fee (buyer credit vs. platform
      absorbing) and how the proration is calculated when an order spans multiple
      sellers and payment methods. The allocation snapshot at capture is the reference
      for this calculation.


      ### 3.5 Negative seller balances

      - Recorded decision: allow negative balances but hold future payouts until recovered.
      This creates a credit/collection exposure for the marketplace and Mosaic Relay.

      - **Key issue:** Define the recovery mechanics (order of payout application,
      interest/collection, write-off threshold), the seller notice when a balance
      goes negative, and the contractual right to hold payouts. Verify the money-transmission
      characterization: if Mosaic Relay holds or controls funds, state money-transmitter
      licensing may apply; if it is a pure technology provider to a regulated partner,
      the exposure sits with the partner.


      ### 3.6 Chargeback interaction

      - Recorded decision: a refund reduces or closes the dispute amount. This is
      the highest double-recovery risk: a refund issued against an allocation that
      a dispute already reduced (or vice versa) could refund the same amount twice.

      - **Key issue:** The refund and dispute flows must share the same source of
      truth (the immutable order ledger snapshot) and reconcile against each other.
      Verify the card-network rules on whether a refund issued after a chargeback
      is initiated is credited against the dispute, and the ACH return/claim windows.


      ### 3.7 Ledger controls

      - Recorded decision: immutable order ledger with versioned allocation snapshot
      at capture; every refund and chargeback appends an auditable event; dispute
      adjustments only via approved reconciliation record; no support edit overwrites
      the original allocation.

      - **Key issue:** Define the technical controls that make the ledger immutable
      (append-only, no in-place updates), the versioning of the allocation snapshot,
      and the audit trail. This is the control backbone for the double-recovery and
      override risks.


      ### 3.8 Support overrides

      - Recorded decision: override allowed only with a named approver (e.g., manager/legal).

      - **Key issue:** Define the exception-approval workflow: who can request, who
      approves, what evidence is required, and how the override is recorded as an
      auditable event that does not overwrite the original allocation. The override
      must reference the snapshot and append a new event, not mutate the original.


      ### 3.9 Tax treatment

      - Refunds and fee reversals have tax implications for the marketplace, sellers,
      and Mosaic Relay (e.g., revenue recognition, sales/use tax on refunded amounts,
      1099-K reporting of gross payment volume, and whether a reversed fee is a refund
      of revenue or an expense).

      - **Key issue:** Confirm the tax treatment of (a) the refunded amount to the
      buyer, (b) the prorated fee reversal, and (c) negative-balance recovery. This
      is an open question in the matter and needs tax counsel input.


      ### 3.10 Source of truth for disputed allocations

      - Recorded decision: the immutable order ledger and its versioned allocation
      snapshot at capture is the source of truth; every refund and chargeback references
      it.

      - **Key issue:** Confirm that the snapshot captures the full allocation (line
      items, sellers, payment methods, fees) at capture time and that both the refund
      tool and the dispute flow read from the same snapshot. This is the control that
      prevents double recovery.


      ## 4. Assumptions


      - **Mosaic Relay is a technology/payments-infrastructure provider, not a bank,
      and does not hold deposits; funds flow through regulated partners.** If Mosaic
      Relay holds or controls funds, money-transmission characterization and the negative-balance
      exposure change materially.

      - **The marketplace operator, not Mosaic Relay, holds the direct relationship
      with buyers and sellers for refund decisions.** If Mosaic Relay issues refunds
      directly or holds the buyer/seller relationship, the disclosure and consumer-protection
      obligations shift.

      - **US-centric regulatory framing applies** (jurisdiction scope confirmed as
      United States only).

      - **The 5–7 business day promise is achievable for both card and ACH.** This
      is unverified against network and NACHA deadlines.


      ## 5. What must be verified before launch


      1. **Card-network and NACHA refund deadlines** — confirm the exact card-network
      refund windows and ACH settlement/return timing so the 5–7 business day promise
      is accurate for both methods.

      2. **Seller term amendment path** — confirm whether seller terms can be amended
      unilaterally or require consent, and who owns the amendment (this is the lead
      work item).

      3. **Fee-reversal allocation** — confirm who absorbs the prorated fee reversal
      (buyer credit vs. platform) and the exact proration formula across sellers and
      payment methods.

      4. **Negative-balance recovery mechanics** — confirm the payout-hold order,
      write-off threshold, seller notice, and contractual right to hold payouts.

      5. **Chargeback/refund reconciliation** — confirm the card-network rules on
      refunds issued after a chargeback is initiated and that the refund and dispute
      flows share the same ledger snapshot.

      6. **Ledger immutability controls** — confirm the append-only design, snapshot
      versioning, and audit trail are implemented as specified.

      7. **Override workflow** — confirm the named-approver workflow and that overrides
      append events without mutating the original allocation.

      8. **Tax treatment** — obtain tax counsel input on refunds, fee reversals, and
      negative-balance recovery.

      9. **Regulated-actor confirmation** — confirm whether Mosaic Relay or the marketplace
      is the regulated actor for money transmission, which determines who owns the
      funds-flow and disclosure obligations.


      ## 6. What would change this


      - **Working assumption — marketplace holds the buyer/seller relationship.**
      If Mosaic Relay issues refunds directly or holds that relationship, the disclosure
      and consumer-protection obligations shift materially.

      - **Working assumption — Mosaic Relay is not a bank and holds no deposits.**
      If funds flow through Mosaic Relay''s own accounts, money-transmission characterization
      and the negative-balance hold design change.

      - **Open fork — seller term amendment scope.** Whether the marketplace can unilaterally
      amend seller terms or needs consent determines the rollout path and timing against
      the one-quarter release.

      - **Open fork — fee-reversal absorption.** Whether the prorated fee is credited
      to the buyer or absorbed by the platform changes the economics and the disclosure.

      - **Not examined — the actual seller agreement and the card-network/NACHA rules.**
      The specific seller contract language and the exact card-network and ACH refund/chargeback
      rules were not read; the 5–7 business day promise and dispute-reduction mechanics
      must be validated against them.

      - **Not examined — tax treatment.** The tax consequences of refunds, fee reversals,
      and negative-balance recovery were not analyzed and need tax counsel input.


      ---


      **No external authority retrieved.** This packet is model-only analysis based
      on the matter facts and general legal principles. It does not cite retrieved
      external authority. The lawyer should verify the applicable statutes, regulations,
      network rules, and guidance before making a final decision.

      '
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '# '
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: 'Lawyer review note: The recommendation is launch-gated. Seller terms, timing
      rules, fee absorption, tax treatment, and regulated-actor roles remain open
      conditions. No external authority was retrieved, so cited rules must be verified
      before launch.'
    change_id: CHG-20260903-886eaf
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
  - kind: insert
    text: 'US Launch Analysis — Refunds for Split Payments


      **Matter:** Mosaic Relay UX Test — 05 — Refunds for Split Payments

      **Scope:** United States only

      **Status:** Legal and operational analysis for launch. Grounded in the recorded
      matter facts and the first-pass research packet. No external authority was retrieved;
      no citations are invented. Every legal proposition below is a lead to verify
      against the applicable network rules, statutes, and the actual seller agreement
      before launch.


      ---


      ## 1. Scope and inputs


      A marketplace wants to issue partial refunds for orders funded by several payment
      methods (card and ACH) and distributed among multiple sellers. The tool lets
      a marketplace operator select line items, calculate each seller''s share, reverse
      the platform fee, and send status updates to the buyer and sellers. Product
      wants to release in one quarter.


      This analysis covers: exact refund rules for line-item and split-tender allocations;
      fee reversal and seller economics; card versus ACH timing language; buyer disclosures;
      seller notices and contract amendments; ledger invariants and reconciliation;
      negative-balance and payout-hold controls; chargeback sequencing and double-recovery
      prevention; support override approval and audit; tax and records; evidence and
      missing facts. It closes with a working recommendation, launch conditions, and
      explicit owners.


      ### Recorded decisions (settled inputs, not assumptions)


      - **Refund timing promise:** within standard card-network/ACH refund windows
      (e.g., 5–7 business days).

      - **Platform fee on partial refund:** prorated to the refunded amount.

      - **Negative seller balance:** allowed to go negative; future payouts are held
      until the balance is recovered.

      - **Chargeback interaction:** a refund reduces or closes the dispute amount
      (refunds and disputes are not handled independently).

      - **Jurisdiction:** United States only.

      - **Source of truth:** immutable order ledger with a versioned allocation snapshot
      at capture. Every refund and chargeback references that snapshot and appends
      an auditable event. A dispute adjustment may only be made by an approved reconciliation
      record; no support edit may overwrite the original allocation.

      - **Customer-support overrides:** allowed only with a named approver (e.g.,
      manager/legal).

      - **Seller terms:** silent on refunds, fee reversal, and notice; must be added/amended.


      ---


      ## 2. Exact refund rules for line-item and split-tender allocations


      ### 2.1 What a partial refund must compute'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-302b51
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'For any partial refund, the tool must determine, from the **versioned allocation
      snapshot at capture**:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-ed47c1
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Which line items** are being refunded (operator-selected).

      - **Each seller''s share** of the refunded line items, per the allocation snapshot.

      - **Each payment method''s share** of the refund, so the refund is returned
      to the original tender(s) in the correct proportion (split-tender refund).

      - **The prorated platform fee** attributable to the refunded amount.


      ### 2.2 Split-tender rule'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-8c1067
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'When an order was funded by more than one payment method (e.g., part card,
      part ACH), a partial refund must be allocated across the original tenders in
      proportion to how the refunded line items were funded. The tool must not refund
      to a method that did not fund the refunded portion. The allocation snapshot
      must record the per-line-item, per-method funding split so this is determinable.


      ### 2.3 Line-item rule'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-a8717c
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'A partial refund is defined at the line-item level. The refund amount equals
      the sum of the selected line items'' refundable amounts, less any already-refunded
      or already-disputed portion of those line items (see §7 on double-recovery prevention).
      The tool must reject a refund that exceeds the remaining refundable amount for
      the selected line items.


      ### 2.4 Required validation before a refund is issued'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-a3b2b0
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- Refund amount ≤ remaining refundable amount for the selected line items.

      - Refund references the correct allocation snapshot version.

      - No open dispute on the same line items that would create double recovery (see
      §7).

      - Named approver present if the refund is an exception/override (see §8).


      ---


      ## 3. Fee reversal and seller economics


      ### 3.1 Recorded rule'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-89dade
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The platform fee is prorated to the refunded amount. This must be defined
      precisely:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-cc239c
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Proration basis:** fee is prorated on the refunded line-item amount
      relative to the order (or the seller''s line-item amount), not a flat fee.

      - **Who absorbs the reversed fee:** the recorded decision does not say whether
      the prorated fee is (a) credited back to the buyer, (b) absorbed by the platform,
      or (c) charged back to the seller. This is an **open fork** that changes the
      economics and the disclosure.


      ### 3.2 Seller economics'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-f00e5a
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- If the fee reversal is charged to the seller, the seller''s refund obligation
      includes the fee component, and the seller''s balance is reduced by the refunded
      amount plus the reversed fee.

      - If the fee reversal is absorbed by the platform, the seller''s balance is
      reduced only by the refunded amount, and the platform books the fee reversal
      as a cost.

      - The seller agreement must state which, and the seller notice must reflect
      the actual deduction.


      ### 3.3 Recommendation on the fork'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-c67b78
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Until the marketplace decides who absorbs the reversed fee, the tool cannot
      produce an accurate seller balance or seller notice. This must be resolved before
      the seller term amendments are drafted. The default that best protects the buyer
      and is simplest to disclose is to **credit the prorated fee back to the buyer**
      and have the platform absorb the fee-reversal cost, with the seller''s balance
      reduced only by the refunded amount. This avoids a seller dispute over fee clawback
      and keeps the buyer whole.


      ---


      ## 4. Card versus ACH timing language


      ### 4.1 The risk'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-a8a2ea
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The recorded promise is "within standard card-network/ACH refund windows
      (e.g., 5–7 business days)." The single promise may not hold identically for
      card and ACH:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-2f7b1c
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Card refunds** are governed by card-network operating rules (Visa,
      Mastercard, etc.) and the merchant/acquiring agreement. Network rules generally
      require refunds to the original payment method within defined windows; the exact
      deadline and the acquiring-bank SLA must be confirmed.

      - **ACH refunds** are governed by the NACHA Operating Rules. ACH credits settle
      on defined effective dates; the promise must be reconciled against NACHA settlement
      and return windows.


      ### 4.2 Required timing language'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-6eb963
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- The buyer-facing promise must be **per-method or a single promise the
      slower method can always meet**. Do not promise "5–7 business days" if ACH can
      take longer.

      - Recommended language: "Refunds are issued to your original payment method
      within [X] business days of approval. Credit to your account may take additional
      time depending on your bank or card issuer." This separates **issuance** (the
      tool''s obligation) from **posting** (the bank''s timing), which the tool cannot
      control.

      - The tool should state the **issuance** deadline it can actually meet, and
      disclose that posting time is outside its control.


      ### 4.3 Verification required'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-879266
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Confirm the exact card-network refund windows and NACHA settlement/return
      timing before committing the promise in buyer-facing copy. This is a launch
      condition (§11).


      ---


      ## 5. Buyer disclosures


      ### 5.1 What must be disclosed'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-b202ae
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Consumer-protection framing (e.g., FTC Act § 5 on deceptive practices;
      state UDAP statutes) requires that any refund timing or "money back" promise
      be accurate and not misleading. The buyer-facing disclosure must state:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-79f590
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **What is refunded** — the selected line items / seller shares, not the
      whole order.

      - **The timing** — issuance vs. posting, per §4.

      - **The original payment method(s)** — refund returns to the original tender(s).

      - **How a partial refund interacts with a dispute** — a refund reduces or closes
      the dispute amount; the buyer should not receive both a refund and a dispute
      credit for the same amount.

      - **Who owns the disclosure** — confirm whether the marketplace or Mosaic Relay
      owns the buyer-facing refund disclosure. This is an open item.


      ### 5.2 Non-misleading requirement'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-80a001
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The tool must not imply a full refund when only selected line items are
      refunded, and must not promise timing it cannot meet. Status updates to the
      buyer must be accurate at each step (approved, issued, posted).


      ---


      ## 6. Seller notices and contract amendments


      ### 6.1 The gap'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-a2418a
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Seller terms are silent on refunds, fee reversal, and notice. The tool''s
      behavior is therefore **not contractually supported**. This is the lead work
      item.


      ### 6.2 What the seller agreement must add'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-6976d3
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Refund obligation:** seller authorizes the marketplace to issue partial
      refunds for its line items per the allocation snapshot.

      - **Fee reversal:** how the prorated fee is handled (per §3) and whether it
      is deducted from the seller''s balance.

      - **Negative-balance recovery:** seller authorizes the marketplace to hold future
      payouts until a negative balance is recovered (per §8).

      - **Refund timing:** seller acknowledges the refund timing promise made to buyers.

      - **Dispute/chargeback interaction:** seller acknowledges that a refund reduces
      or closes the dispute amount and that the seller''s balance is adjusted accordingly.

      - **Notice:** seller receives notice when a refund is issued against its line
      items and when its balance goes negative.


      ### 6.3 Amendment path — open fork'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-8033c3
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Whether the marketplace can **unilaterally amend** seller terms or needs
      **seller consent** determines the rollout path and timing against the one-quarter
      release. If consent is required, the rollout must account for the consent cycle.
      This must be confirmed before drafting.


      ---


      ## 7. Ledger invariants and reconciliation


      ### 7.1 The control backbone'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-795605
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The recorded source-of-truth rule is the immutable order ledger with a
      versioned allocation snapshot at capture. The technical controls that make this
      real:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-121df7
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Append-only ledger:** no in-place updates; every refund, chargeback,
      and override appends an event referencing the snapshot version.

      - **Snapshot versioning:** the allocation snapshot (line items, sellers, payment
      methods, fees) is versioned at capture and immutable thereafter.

      - **Audit trail:** every event records actor, timestamp, snapshot version, amount,
      and reason.


      ### 7.2 Reconciliation invariants'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-85f867
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The following invariants must hold continuously:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-730794
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **No double recovery:** a line item''s refunded amount + disputed amount
      ≤ the original funded amount for that line item.

      - **Split-tender conservation:** the sum of refunds across payment methods equals
      the refunded amount, and each refund maps to the original tender.

      - **Fee conservation:** the prorated fee reversal is booked consistently (buyer
      credit vs. platform cost vs. seller deduction) and reconciles to the fee originally
      charged.

      - **Balance conservation:** seller balances, negative-balance holds, and payout
      releases reconcile to the ledger.


      ### 7.3 Reconciliation cadence'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-22fa07
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Daily reconciliation against the ledger and against partner settlement
      reports. Any mismatch must be flagged and resolved via an approved reconciliation
      record — never a silent edit.


      ---


      ## 8. Negative-balance and payout-hold controls


      ### 8.1 Recorded rule'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-b9eb60
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Negative seller balances are allowed; future payouts are held until the
      balance is recovered. This creates a credit/collection exposure for the marketplace
      and Mosaic Relay.


      ### 8.2 Required controls'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-84b945
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Recovery mechanics:** define the order of payout application (new payouts
      offset the negative balance first), the write-off threshold, and any interest/collection
      policy.

      - **Seller notice:** seller is notified when a refund drives its balance negative
      and when payouts are held.

      - **Contractual right:** the seller agreement must grant the right to hold payouts
      to recover a negative balance (per §6).

      - **Regulated-actor confirmation:** if Mosaic Relay holds or controls funds,
      state money-transmitter licensing may apply; if it is a pure technology provider
      to a regulated partner, the exposure sits with the partner. This is a launch
      condition.


      ---


      ## 9. Chargeback sequencing and double-recovery prevention


      ### 9.1 The highest risk'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-ded744
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The recorded decision — a refund reduces or closes the dispute amount —
      is the highest double-recovery risk. A refund issued against an allocation that
      a dispute already reduced (or vice versa) could refund the same amount twice.


      ### 9.2 Required sequencing'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-84ca45
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Single source of truth:** the refund tool and the dispute flow must
      read from the same immutable ledger snapshot.

      - **Sequencing rule:** before issuing a refund, check for an open dispute on
      the same line items. If a dispute exists, the refund must be applied against
      the dispute amount (reducing it), not issued as a separate full refund.

      - **Post-chargeback refunds:** verify the card-network rules on whether a refund
      issued after a chargeback is initiated is credited against the dispute, and
      the ACH return/claim windows.

      - **Reconciliation:** dispute adjustments may only be made by an approved reconciliation
      record; no support edit may overwrite the original allocation.


      ### 9.3 Double-recovery invariant'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-86485d
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Refunded amount + disputed amount for any line item ≤ original funded amount.
      This invariant must be enforced in the ledger (§7).


      ---


      ## 10. Support override approval and audit


      ### 10.1 Recorded rule'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-5819d3
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Override allowed only with a named approver (e.g., manager/legal).


      ### 10.2 Required workflow'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-b81dc6
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Request:** support staff may request an override but cannot execute
      one alone.

      - **Approval:** a named approver (manager/legal) must approve, with the reason
      and evidence recorded.

      - **Audit:** the override appends an auditable event referencing the snapshot
      version; it must **not** mutate the original allocation.

      - **Evidence:** the override record must capture what was changed, why, by whom,
      and the approval.


      ### 10.3 Control principle'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-b25123
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'An override is a new auditable event on the immutable ledger, not an edit
      to the original allocation. This preserves the source-of-truth rule while allowing
      legitimate exceptions.


      ---


      ## 11. Tax and records


      ### 11.1 Tax treatment — open question'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-739276
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'Refunds and fee reversals have tax implications for the marketplace, sellers,
      and Mosaic Relay:'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-4dee2b
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Refunded amount to the buyer:** revenue recognition and sales/use tax
      on the refunded amount.

      - **Prorated fee reversal:** whether it is a refund of revenue or an expense.

      - **Negative-balance recovery:** whether recovered amounts are income.

      - **1099-K reporting:** gross payment volume reporting of refunded amounts.


      This is an open question in the matter and needs **tax counsel input** before
      launch. It is a launch condition.


      ### 11.2 Records'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-577403
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: 'The immutable ledger and audit trail serve as the tax and dispute records.
      Retention must satisfy applicable record-keeping requirements, and the ledger
      must be exportable for tax and audit purposes.


      ---


      ## 12. Evidence and missing facts


      ### 12.1 What is established (recorded facts)'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-427fed
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- Refund timing promise (5–7 business days).

      - Prorated fee reversal.

      - Negative-balance payout holds.

      - Refund reduces/closes dispute.

      - US-only scope.

      - Immutable ledger source of truth.

      - Named-approver overrides.

      - Seller terms silent; must be amended.


      ### 12.2 Missing facts that must be resolved before launch'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-ca1d62
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '1. **Card-network and NACHA refund deadlines** — to validate the timing
      promise.

      2. **Seller term amendment path** — unilateral vs. consent.

      3. **Fee-reversal absorption** — buyer credit vs. platform vs. seller.

      4. **Negative-balance recovery mechanics** — payout-hold order, write-off threshold,
      notice.

      5. **Chargeback/refund reconciliation rules** — post-chargeback refund treatment.

      6. **Ledger immutability implementation** — append-only design, snapshot versioning,
      audit trail.

      7. **Override workflow** — named-approver roles and evidence.

      8. **Tax treatment** — tax counsel input.

      9. **Regulated-actor confirmation** — who holds funds and owns the buyer/seller
      relationship.


      ---


      ## 13. Working recommendation


      **Recommendation:** Proceed with the split-payment partial-refund tool, but
      **do not launch until the seller term amendments are drafted and effective and
      the launch conditions below are met.** The core architecture (immutable ledger
      source of truth, prorated fee reversal, negative-balance holds, refund-reduces-dispute,
      named-approver overrides) is sound and consistent. The single material gap is
      that seller terms are silent, so the tool''s behavior is not contractually supported;
      that must be closed before launch.


      ### Launch conditions (all must be met)'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-61779b
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '1. **Seller term amendments drafted and effective** covering refund obligation,
      fee reversal, negative-balance recovery, refund timing, dispute interaction,
      and notice. (Owner: Legal, with Product input.)

      2. **Fee-reversal absorption decided** (buyer credit vs. platform vs. seller)
      and reflected in the seller terms and buyer disclosure. (Owner: Product/Business,
      with Legal.)

      3. **Timing language validated** against card-network and NACHA deadlines; buyer-facing
      promise states issuance vs. posting. (Owner: Product, with Legal review.)

      4. **Ledger immutability and reconciliation implemented** — append-only, snapshot
      versioning, audit trail, daily reconciliation, double-recovery invariant enforced.
      (Owner: Engineering, with Risk.)

      5. **Negative-balance and payout-hold controls implemented** with seller notice
      and contractual right. (Owner: Engineering/Payments Ops, with Legal.)

      6. **Chargeback sequencing implemented** — refund and dispute flows share the
      same snapshot; double-recovery invariant enforced. (Owner: Engineering, with
      Risk.)

      7. **'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: Ove****rride
    change_id: CHG-20260903-c2b1ad
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: Override
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: Override
  - kind: insert
    text: ' workflow implemented** — named-approver approval and auditable event,
      no mutation of original allocation. (Owner: Payments Ops, with Legal.)

      8. **Tax treatment confirmed** by tax counsel. (Owner: Tax/Finance.)

      9. **Regulated-actor confirmation** — who holds funds and owns the buyer/seller
      relationship. (Owner: Legal/Compliance.)


      ### Explicit owners'
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-d071a4
    author_id: author-lawyer
    author_name: Lawyer
    author_color: '#7030A0'
    created_at: '2026-09-03T17:22:32+00:00'
    replaced_segments:
    - kind: insert
      text: '

        '
      change_id: CHG-20260903-8c65bb
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T17:20:03+00:00'
    replaced_text: '

      '
  - kind: insert
    text: '- **Legal:** seller term amendments, buyer disclosure review, override
      approval policy, regulated-actor confirmation.

      - **Product:** fee-reversal absorption decision, timing language, buyer-facing
      copy.

      - **Engineering:** ledger immutability, reconciliation, chargeback sequencing,
      override workflow implementation.

      - **Payments Ops:** negative-balance and payout-hold controls, override execution.

      - **Risk:** double-recovery invariant, reconciliation monitoring.

      - **Tax/Finance:** tax treatment of refunds, fee reversals, and negative-balance
      recovery.


      ---


      ## 14. What would change this


      - **Working assumption — marketplace holds the buyer/seller relationship.**
      If Mosaic Relay issues refunds directly or holds that relationship, the disclosure
      and consumer-protection obligations shift materially.

      - **Working assumption — Mosaic Relay is not a bank and holds no deposits.**
      If funds flow through Mosaic Relay''s own accounts, money-transmission characterization
      and the negative-balance hold design change.

      - **Open fork — seller term amendment scope.** Whether the marketplace can unilaterally
      amend seller terms or needs consent determines the rollout path and timing against
      the one-quarter release.

      - **Open fork — fee-reversal absorption.** Whether the prorated fee is credited
      to the buyer or absorbed by the platform changes the economics and the disclosure.

      - **Not examined — the actual seller agreement and the card-network/NACHA rules.**
      The specific seller contract language and the exact card-network and ACH refund/chargeback
      rules were not read; the 5–7 business day promise and dispute-reduction mechanics
      must be validated against them.

      - **Not examined — tax treatment.** The tax consequences of refunds, fee reversals,
      and negative-balance recovery were not analyzed and need tax counsel input.


      ---


      **No external authority retrieved.** This analysis is model-only, grounded in
      the matter facts and general legal principles. It does not cite retrieved external
      authority. The lawyer should verify the applicable statutes, regulations, network
      rules, and guidance before making a final decision.

      '
    change_id: CHG-20260903-8c65bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T17:20:03+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  - author_id: author-lawyer
    name: Lawyer
    color: '#7030A0'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T17:20:03+00:00'
---
# Lawyer review note: The recommendation is launch-gated. Seller terms, timing rules, fee absorption, tax treatment, and regulated-actor roles remain open conditions. No external authority was retrieved, so cited rules must be verified before launch.US Launch Analysis — Refunds for Split Payments

**Matter:** Mosaic Relay UX Test — 05 — Refunds for Split Payments
**Scope:** United States only
**Status:** Legal and operational analysis for launch. Grounded in the recorded matter facts and the first-pass research packet. No external authority was retrieved; no citations are invented. Every legal proposition below is a lead to verify against the applicable network rules, statutes, and the actual seller agreement before launch.

---

## 1. Scope and inputs

A marketplace wants to issue partial refunds for orders funded by several payment methods (card and ACH) and distributed among multiple sellers. The tool lets a marketplace operator select line items, calculate each seller's share, reverse the platform fee, and send status updates to the buyer and sellers. Product wants to release in one quarter.

This analysis covers: exact refund rules for line-item and split-tender allocations; fee reversal and seller economics; card versus ACH timing language; buyer disclosures; seller notices and contract amendments; ledger invariants and reconciliation; negative-balance and payout-hold controls; chargeback sequencing and double-recovery prevention; support override approval and audit; tax and records; evidence and missing facts. It closes with a working recommendation, launch conditions, and explicit owners.

### Recorded decisions (settled inputs, not assumptions)

- **Refund timing promise:** within standard card-network/ACH refund windows (e.g., 5–7 business days).
- **Platform fee on partial refund:** prorated to the refunded amount.
- **Negative seller balance:** allowed to go negative; future payouts are held until the balance is recovered.
- **Chargeback interaction:** a refund reduces or closes the dispute amount (refunds and disputes are not handled independently).
- **Jurisdiction:** United States only.
- **Source of truth:** immutable order ledger with a versioned allocation snapshot at capture. Every refund and chargeback references that snapshot and appends an auditable event. A dispute adjustment may only be made by an approved reconciliation record; no support edit may overwrite the original allocation.
- **Customer-support overrides:** allowed only with a named approver (e.g., manager/legal).
- **Seller terms:** silent on refunds, fee reversal, and notice; must be added/amended.

---

## 2. Exact refund rules for line-item and split-tender allocations

### 2.1 What a partial refund must compute

For any partial refund, the tool must determine, from the **versioned allocation snapshot at capture**:

- **Which line items** are being refunded (operator-selected).
- **Each seller's share** of the refunded line items, per the allocation snapshot.
- **Each payment method's share** of the refund, so the refund is returned to the original tender(s) in the correct proportion (split-tender refund).
- **The prorated platform fee** attributable to the refunded amount.

### 2.2 Split-tender rule

When an order was funded by more than one payment method (e.g., part card, part ACH), a partial refund must be allocated across the original tenders in proportion to how the refunded line items were funded. The tool must not refund to a method that did not fund the refunded portion. The allocation snapshot must record the per-line-item, per-method funding split so this is determinable.

### 2.3 Line-item rule

A partial refund is defined at the line-item level. The refund amount equals the sum of the selected line items' refundable amounts, less any already-refunded or already-disputed portion of those line items (see §7 on double-recovery prevention). The tool must reject a refund that exceeds the remaining refundable amount for the selected line items.

### 2.4 Required validation before a refund is issued

- Refund amount ≤ remaining refundable amount for the selected line items.
- Refund references the correct allocation snapshot version.
- No open dispute on the same line items that would create double recovery (see §7).
- Named approver present if the refund is an exception/override (see §8).

---

## 3. Fee reversal and seller economics

### 3.1 Recorded rule

The platform fee is prorated to the refunded amount. This must be defined precisely:

- **Proration basis:** fee is prorated on the refunded line-item amount relative to the order (or the seller's line-item amount), not a flat fee.
- **Who absorbs the reversed fee:** the recorded decision does not say whether the prorated fee is (a) credited back to the buyer, (b) absorbed by the platform, or (c) charged back to the seller. This is an **open fork** that changes the economics and the disclosure.

### 3.2 Seller economics

- If the fee reversal is charged to the seller, the seller's refund obligation includes the fee component, and the seller's balance is reduced by the refunded amount plus the reversed fee.
- If the fee reversal is absorbed by the platform, the seller's balance is reduced only by the refunded amount, and the platform books the fee reversal as a cost.
- The seller agreement must state which, and the seller notice must reflect the actual deduction.

### 3.3 Recommendation on the fork

Until the marketplace decides who absorbs the reversed fee, the tool cannot produce an accurate seller balance or seller notice. This must be resolved before the seller term amendments are drafted. The default that best protects the buyer and is simplest to disclose is to **credit the prorated fee back to the buyer** and have the platform absorb the fee-reversal cost, with the seller's balance reduced only by the refunded amount. This avoids a seller dispute over fee clawback and keeps the buyer whole.

---

## 4. Card versus ACH timing language

### 4.1 The risk

The recorded promise is "within standard card-network/ACH refund windows (e.g., 5–7 business days)." The single promise may not hold identically for card and ACH:

- **Card refunds** are governed by card-network operating rules (Visa, Mastercard, etc.) and the merchant/acquiring agreement. Network rules generally require refunds to the original payment method within defined windows; the exact deadline and the acquiring-bank SLA must be confirmed.
- **ACH refunds** are governed by the NACHA Operating Rules. ACH credits settle on defined effective dates; the promise must be reconciled against NACHA settlement and return windows.

### 4.2 Required timing language

- The buyer-facing promise must be **per-method or a single promise the slower method can always meet**. Do not promise "5–7 business days" if ACH can take longer.
- Recommended language: "Refunds are issued to your original payment method within [X] business days of approval. Credit to your account may take additional time depending on your bank or card issuer." This separates **issuance** (the tool's obligation) from **posting** (the bank's timing), which the tool cannot control.
- The tool should state the **issuance** deadline it can actually meet, and disclose that posting time is outside its control.

### 4.3 Verification required

Confirm the exact card-network refund windows and NACHA settlement/return timing before committing the promise in buyer-facing copy. This is a launch condition (§11).

---

## 5. Buyer disclosures

### 5.1 What must be disclosed

Consumer-protection framing (e.g., FTC Act § 5 on deceptive practices; state UDAP statutes) requires that any refund timing or "money back" promise be accurate and not misleading. The buyer-facing disclosure must state:

- **What is refunded** — the selected line items / seller shares, not the whole order.
- **The timing** — issuance vs. posting, per §4.
- **The original payment method(s)** — refund returns to the original tender(s).
- **How a partial refund interacts with a dispute** — a refund reduces or closes the dispute amount; the buyer should not receive both a refund and a dispute credit for the same amount.
- **Who owns the disclosure** — confirm whether the marketplace or Mosaic Relay owns the buyer-facing refund disclosure. This is an open item.

### 5.2 Non-misleading requirement

The tool must not imply a full refund when only selected line items are refunded, and must not promise timing it cannot meet. Status updates to the buyer must be accurate at each step (approved, issued, posted).

---

## 6. Seller notices and contract amendments

### 6.1 The gap

Seller terms are silent on refunds, fee reversal, and notice. The tool's behavior is therefore **not contractually supported**. This is the lead work item.

### 6.2 What the seller agreement must add

- **Refund obligation:** seller authorizes the marketplace to issue partial refunds for its line items per the allocation snapshot.
- **Fee reversal:** how the prorated fee is handled (per §3) and whether it is deducted from the seller's balance.
- **Negative-balance recovery:** seller authorizes the marketplace to hold future payouts until a negative balance is recovered (per §8).
- **Refund timing:** seller acknowledges the refund timing promise made to buyers.
- **Dispute/chargeback interaction:** seller acknowledges that a refund reduces or closes the dispute amount and that the seller's balance is adjusted accordingly.
- **Notice:** seller receives notice when a refund is issued against its line items and when its balance goes negative.

### 6.3 Amendment path — open fork

Whether the marketplace can **unilaterally amend** seller terms or needs **seller consent** determines the rollout path and timing against the one-quarter release. If consent is required, the rollout must account for the consent cycle. This must be confirmed before drafting.

---

## 7. Ledger invariants and reconciliation

### 7.1 The control backbone

The recorded source-of-truth rule is the immutable order ledger with a versioned allocation snapshot at capture. The technical controls that make this real:

- **Append-only ledger:** no in-place updates; every refund, chargeback, and override appends an event referencing the snapshot version.
- **Snapshot versioning:** the allocation snapshot (line items, sellers, payment methods, fees) is versioned at capture and immutable thereafter.
- **Audit trail:** every event records actor, timestamp, snapshot version, amount, and reason.

### 7.2 Reconciliation invariants

The following invariants must hold continuously:

- **No double recovery:** a line item's refunded amount + disputed amount ≤ the original funded amount for that line item.
- **Split-tender conservation:** the sum of refunds across payment methods equals the refunded amount, and each refund maps to the original tender.
- **Fee conservation:** the prorated fee reversal is booked consistently (buyer credit vs. platform cost vs. seller deduction) and reconciles to the fee originally charged.
- **Balance conservation:** seller balances, negative-balance holds, and payout releases reconcile to the ledger.

### 7.3 Reconciliation cadence

Daily reconciliation against the ledger and against partner settlement reports. Any mismatch must be flagged and resolved via an approved reconciliation record — never a silent edit.

---

## 8. Negative-balance and payout-hold controls

### 8.1 Recorded rule

Negative seller balances are allowed; future payouts are held until the balance is recovered. This creates a credit/collection exposure for the marketplace and Mosaic Relay.

### 8.2 Required controls

- **Recovery mechanics:** define the order of payout application (new payouts offset the negative balance first), the write-off threshold, and any interest/collection policy.
- **Seller notice:** seller is notified when a refund drives its balance negative and when payouts are held.
- **Contractual right:** the seller agreement must grant the right to hold payouts to recover a negative balance (per §6).
- **Regulated-actor confirmation:** if Mosaic Relay holds or controls funds, state money-transmitter licensing may apply; if it is a pure technology provider to a regulated partner, the exposure sits with the partner. This is a launch condition.

---

## 9. Chargeback sequencing and double-recovery prevention

### 9.1 The highest risk

The recorded decision — a refund reduces or closes the dispute amount — is the highest double-recovery risk. A refund issued against an allocation that a dispute already reduced (or vice versa) could refund the same amount twice.

### 9.2 Required sequencing

- **Single source of truth:** the refund tool and the dispute flow must read from the same immutable ledger snapshot.
- **Sequencing rule:** before issuing a refund, check for an open dispute on the same line items. If a dispute exists, the refund must be applied against the dispute amount (reducing it), not issued as a separate full refund.
- **Post-chargeback refunds:** verify the card-network rules on whether a refund issued after a chargeback is initiated is credited against the dispute, and the ACH return/claim windows.
- **Reconciliation:** dispute adjustments may only be made by an approved reconciliation record; no support edit may overwrite the original allocation.

### 9.3 Double-recovery invariant

Refunded amount + disputed amount for any line item ≤ original funded amount. This invariant must be enforced in the ledger (§7).

---

## 10. Support override approval and audit

### 10.1 Recorded rule

Override allowed only with a named approver (e.g., manager/legal).

### 10.2 Required workflow

- **Request:** support staff may request an override but cannot execute one alone.
- **Approval:** a named approver (manager/legal) must approve, with the reason and evidence recorded.
- **Audit:** the override appends an auditable event referencing the snapshot version; it must **not** mutate the original allocation.
- **Evidence:** the override record must capture what was changed, why, by whom, and the approval.

### 10.3 Control principle

An override is a new auditable event on the immutable ledger, not an edit to the original allocation. This preserves the source-of-truth rule while allowing legitimate exceptions.

---

## 11. Tax and records

### 11.1 Tax treatment — open question

Refunds and fee reversals have tax implications for the marketplace, sellers, and Mosaic Relay:

- **Refunded amount to the buyer:** revenue recognition and sales/use tax on the refunded amount.
- **Prorated fee reversal:** whether it is a refund of revenue or an expense.
- **Negative-balance recovery:** whether recovered amounts are income.
- **1099-K reporting:** gross payment volume reporting of refunded amounts.

This is an open question in the matter and needs **tax counsel input** before launch. It is a launch condition.

### 11.2 Records

The immutable ledger and audit trail serve as the tax and dispute records. Retention must satisfy applicable record-keeping requirements, and the ledger must be exportable for tax and audit purposes.

---

## 12. Evidence and missing facts

### 12.1 What is established (recorded facts)

- Refund timing promise (5–7 business days).
- Prorated fee reversal.
- Negative-balance payout holds.
- Refund reduces/closes dispute.
- US-only scope.
- Immutable ledger source of truth.
- Named-approver overrides.
- Seller terms silent; must be amended.

### 12.2 Missing facts that must be resolved before launch

1. **Card-network and NACHA refund deadlines** — to validate the timing promise.
2. **Seller term amendment path** — unilateral vs. consent.
3. **Fee-reversal absorption** — buyer credit vs. platform vs. seller.
4. **Negative-balance recovery mechanics** — payout-hold order, write-off threshold, notice.
5. **Chargeback/refund reconciliation rules** — post-chargeback refund treatment.
6. **Ledger immutability implementation** — append-only design, snapshot versioning, audit trail.
7. **Override workflow** — named-approver roles and evidence.
8. **Tax treatment** — tax counsel input.
9. **Regulated-actor confirmation** — who holds funds and owns the buyer/seller relationship.

---

## 13. Working recommendation

**Recommendation:** Proceed with the split-payment partial-refund tool, but **do not launch until the seller term amendments are drafted and effective and the launch conditions below are met.** The core architecture (immutable ledger source of truth, prorated fee reversal, negative-balance holds, refund-reduces-dispute, named-approver overrides) is sound and consistent. The single material gap is that seller terms are silent, so the tool's behavior is not contractually supported; that must be closed before launch.

### Launch conditions (all must be met)

1. **Seller term amendments drafted and effective** covering refund obligation, fee reversal, negative-balance recovery, refund timing, dispute interaction, and notice. (Owner: Legal, with Product input.)
2. **Fee-reversal absorption decided** (buyer credit vs. platform vs. seller) and reflected in the seller terms and buyer disclosure. (Owner: Product/Business, with Legal.)
3. **Timing language validated** against card-network and NACHA deadlines; buyer-facing promise states issuance vs. posting. (Owner: Product, with Legal review.)
4. **Ledger immutability and reconciliation implemented** — append-only, snapshot versioning, audit trail, daily reconciliation, double-recovery invariant enforced. (Owner: Engineering, with Risk.)
5. **Negative-balance and payout-hold controls implemented** with seller notice and contractual right. (Owner: Engineering/Payments Ops, with Legal.)
6. **Chargeback sequencing implemented** — refund and dispute flows share the same snapshot; double-recovery invariant enforced. (Owner: Engineering, with Risk.)
7. **Ove****rride workflow implemented** — named-approver approval and auditable event, no mutation of original allocation. (Owner: Payments Ops, with Legal.)
8. **Tax treatment confirmed** by tax counsel. (Owner: Tax/Finance.)
9. **Regulated-actor confirmation** — who holds funds and owns the buyer/seller relationship. (Owner: Legal/Compliance.)

### Explicit owners

- **Legal:** seller term amendments, buyer disclosure review, override approval policy, regulated-actor confirmation.
- **Product:** fee-reversal absorption decision, timing language, buyer-facing copy.
- **Engineering:** ledger immutability, reconciliation, chargeback sequencing, override workflow implementation.
- **Payments Ops:** negative-balance and payout-hold controls, override execution.
- **Risk:** double-recovery invariant, reconciliation monitoring.
- **Tax/Finance:** tax treatment of refunds, fee reversals, and negative-balance recovery.

---

## 14. What would change this

- **Working assumption — marketplace holds the buyer/seller relationship.** If Mosaic Relay issues refunds directly or holds that relationship, the disclosure and consumer-protection obligations shift materially.
- **Working assumption — Mosaic Relay is not a bank and holds no deposits.** If funds flow through Mosaic Relay's own accounts, money-transmission characterization and the negative-balance hold design change.
- **Open fork — seller term amendment scope.** Whether the marketplace can unilaterally amend seller terms or needs consent determines the rollout path and timing against the one-quarter release.
- **Open fork — fee-reversal absorption.** Whether the prorated fee is credited to the buyer or absorbed by the platform changes the economics and the disclosure.
- **Not examined — the actual seller agreement and the card-network/NACHA rules.** The specific seller contract language and the exact card-network and ACH refund/chargeback rules were not read; the 5–7 business day promise and dispute-reduction mechanics must be validated against them.
- **Not examined — tax treatment.** The tax consequences of refunds, fee reversals, and negative-balance recovery were not analyzed and need tax counsel input.

---

**No external authority retrieved.** This analysis is model-only, grounded in the matter facts and general legal principles. It does not cite retrieved external authority. The lawyer should verify the applicable statutes, regulations, network rules, and guidance before making a final decision.
