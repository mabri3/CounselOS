---
matter_id: MAT-20260830-28952f
record_type: working_recommendation
status: draft
review:
  segments:
  - kind: equal
    text: '# Working Recommendation for Product — Refunds, Returns, and Transaction
      Disputes


      Matter: Northstar UX Test — 07 — Refunds, Returns, and Transaction Disputes

      Status: Recommendation only — privileged and confidential attorney work product.
      Not a recorded decision. Launch is subject to the prerequisites below.


      ## Recommended Dispute Standard


      Northstar Pay should adopt a single, card-equivalent dispute standard across
      all products. For unauthorized-transaction disputes, the customer should not
      owe the disputed amount while the investigation is pending; Northstar Pay should
      acknowledge the dispute within five business days, complete the investigation
      within two complete billing cycles or ninety days, whichever is shorter, and
      provide written or in-app notice of the outcome. For merchant-conduct disputes
      — defective goods or non-delivery — the flow should route the claim through
      the applicable card-network chargeback process within network timelines, with
      clear up-front disclosure that payments may continue while the claim is reviewed.
      This tiered treatment is a design choice calibrated to the card-equivalent standard
      rather than a confirmed legal floor; the precise legal requirements depend on
      the unverified leads below.


      ## Refund Allocation


      Refunds should be applied to the outstanding balance using a default last-payment-first
      rule: the final scheduled installments are reduced or eliminated first, and
      the customer''s remaining obligation shrinks visibly and predictably. The rule
      should be documented in the customer agreement so allocation is a contractual
      term rather than an operational improvisation. Where a merchant sends a partial
      refund without item-level detail, the default rule should apply at the order
      level, and the gap should be logged and escalated to the merchant relationship
      team. Merchant contracts should be amended to require item-level data where
      available.


      ## Schedule Changes


      When a refund is applied, the repayment schedule should be recalculated the
      same business day, and the customer should receive an in-app notice of the adjusted
      schedule within one business day of application. Following a dispute resolution,
      any schedule change should be applied within one business day of the outcome.


      ## Notices


      The notice set should include: refund-applied confirmation showing the amount,
      new balance, and recalculated schedule; a schedule-change notice whenever a
      refund alters future payments; dispute acknowledgment within five business days;
      an interim notice if an investigation extends beyond the initial window; and
      a resolution notice stating the outcome, any credit or resumed obligation, and
      the recalculated schedule. In-app delivery is the recommended primary channel,
      with an alternative channel where the governing product terms or applicable
      state law requires one. E-SIGN consent for electronic delivery should be confirmed
      for the customer base.


      ## Merchant Duties


      Merchants should be contractually required to: transmit refund notifications
      within a defined SLA of issuing the refund; include item-level detail where
      available; use a unique refund identifier to enable duplicate suppression; accept
      liability for refunds retransmitted in error; and cooperate with dispute investigations
      within network timelines. Current merchant contract terms on refund timing and
      data format are a missing fact; the recommendation assumes amendments are feasible
      before launch.


      ## Launch Prerequisites


      Before launch, Northstar Pay should: (1) verify the current status and scope
      of the CFPB''s 2024 interpretive rule treating BNPL providers as card issuers,
      including any litigation or revision; (2) confirm the state-law overlay for
      refund application, schedule-adjustment timing, and notices in California, Colorado,
      Georgia, Illinois, New York, Texas, and Washington, plus the longer-term installment
      state list; (3) review card-network and bank-partner agreement provisions on
      dispute and refund handling; (4) confirm the creditor/servicer-of-record map
      with the lending partners; and (5) confirm with engineering that the idempotent
      refund identifier control is implemented.


      ## Assumptions


      The first release may cover pay-in-4 and other installment products, but legal
      treatment may differ by product and state. Northstar Pay may use a bank or lending
      partner as creditor or servicer of record; the partner map is not finalized.
      The flow will use an idempotent refund identifier or equivalent control to prevent
      double application. Customer-facing notices will be delivered in-app, with another
      channel where required by the governing product terms or law.


      ## Missing Facts


      Which entity is creditor and servicer of record for each product and state;
      which products and states are in scope for the first release; whether any funding
      instrument is subject to Regulation E or Regulation Z error-resolution rules;
      what the card-network and bank-partner agreements require for dispute and refund
      handling; what merchant contracts currently say about refund timing and data
      fields; how non-itemized partial refunds should be allocated when item-level
      data is absent; whether payments are paused or still due during each dispute
      path under current terms; and what notice channels and retention rules apply.


      ## Unverified Leads


      Current status and scope of the CFPB''s 2024 interpretive rule treating BNPL
      providers as card issuers, including any litigation or revision; state servicing,
      dispute, and notice requirements for the seven live pay-in-4 states plus the
      longer-term installment state list; card-network chargeback and refund-processing
      rules applicable to the underlying payment instruments; and bank and lending
      partner agreement provisions on error-resolution duty allocation and refund
      pass-through.


      ## Provenance


      Verified sources: none — external search was not enabled for this run. Supplied
      sources: the Product request and the matter conversation record. Generated analysis:
      the dispute standard, allocation rule, schedule-change timing, notice set, merchant
      duties, and launch prerequisites above.

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
# Working Recommendation for Product — Refunds, Returns, and Transaction Disputes

Matter: Northstar UX Test — 07 — Refunds, Returns, and Transaction Disputes
Status: Recommendation only — privileged and confidential attorney work product. Not a recorded decision. Launch is subject to the prerequisites below.

## Recommended Dispute Standard

Northstar Pay should adopt a single, card-equivalent dispute standard across all products. For unauthorized-transaction disputes, the customer should not owe the disputed amount while the investigation is pending; Northstar Pay should acknowledge the dispute within five business days, complete the investigation within two complete billing cycles or ninety days, whichever is shorter, and provide written or in-app notice of the outcome. For merchant-conduct disputes — defective goods or non-delivery — the flow should route the claim through the applicable card-network chargeback process within network timelines, with clear up-front disclosure that payments may continue while the claim is reviewed. This tiered treatment is a design choice calibrated to the card-equivalent standard rather than a confirmed legal floor; the precise legal requirements depend on the unverified leads below.

## Refund Allocation

Refunds should be applied to the outstanding balance using a default last-payment-first rule: the final scheduled installments are reduced or eliminated first, and the customer's remaining obligation shrinks visibly and predictably. The rule should be documented in the customer agreement so allocation is a contractual term rather than an operational improvisation. Where a merchant sends a partial refund without item-level detail, the default rule should apply at the order level, and the gap should be logged and escalated to the merchant relationship team. Merchant contracts should be amended to require item-level data where available.

## Schedule Changes

When a refund is applied, the repayment schedule should be recalculated the same business day, and the customer should receive an in-app notice of the adjusted schedule within one business day of application. Following a dispute resolution, any schedule change should be applied within one business day of the outcome.

## Notices

The notice set should include: refund-applied confirmation showing the amount, new balance, and recalculated schedule; a schedule-change notice whenever a refund alters future payments; dispute acknowledgment within five business days; an interim notice if an investigation extends beyond the initial window; and a resolution notice stating the outcome, any credit or resumed obligation, and the recalculated schedule. In-app delivery is the recommended primary channel, with an alternative channel where the governing product terms or applicable state law requires one. E-SIGN consent for electronic delivery should be confirmed for the customer base.

## Merchant Duties

Merchants should be contractually required to: transmit refund notifications within a defined SLA of issuing the refund; include item-level detail where available; use a unique refund identifier to enable duplicate suppression; accept liability for refunds retransmitted in error; and cooperate with dispute investigations within network timelines. Current merchant contract terms on refund timing and data format are a missing fact; the recommendation assumes amendments are feasible before launch.

## Launch Prerequisites

Before launch, Northstar Pay should: (1) verify the current status and scope of the CFPB's 2024 interpretive rule treating BNPL providers as card issuers, including any litigation or revision; (2) confirm the state-law overlay for refund application, schedule-adjustment timing, and notices in California, Colorado, Georgia, Illinois, New York, Texas, and Washington, plus the longer-term installment state list; (3) review card-network and bank-partner agreement provisions on dispute and refund handling; (4) confirm the creditor/servicer-of-record map with the lending partners; and (5) confirm with engineering that the idempotent refund identifier control is implemented.

## Assumptions

The first release may cover pay-in-4 and other installment products, but legal treatment may differ by product and state. Northstar Pay may use a bank or lending partner as creditor or servicer of record; the partner map is not finalized. The flow will use an idempotent refund identifier or equivalent control to prevent double application. Customer-facing notices will be delivered in-app, with another channel where required by the governing product terms or law.

## Missing Facts

Which entity is creditor and servicer of record for each product and state; which products and states are in scope for the first release; whether any funding instrument is subject to Regulation E or Regulation Z error-resolution rules; what the card-network and bank-partner agreements require for dispute and refund handling; what merchant contracts currently say about refund timing and data fields; how non-itemized partial refunds should be allocated when item-level data is absent; whether payments are paused or still due during each dispute path under current terms; and what notice channels and retention rules apply.

## Unverified Leads

Current status and scope of the CFPB's 2024 interpretive rule treating BNPL providers as card issuers, including any litigation or revision; state servicing, dispute, and notice requirements for the seven live pay-in-4 states plus the longer-term installment state list; card-network chargeback and refund-processing rules applicable to the underlying payment instruments; and bank and lending partner agreement provisions on error-resolution duty allocation and refund pass-through.

## Provenance

Verified sources: none — external search was not enabled for this run. Supplied sources: the Product request and the matter conversation record. Generated analysis: the dispute standard, allocation rule, schedule-change timing, notice set, merchant duties, and launch prerequisites above.
