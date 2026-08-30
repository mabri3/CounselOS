---
matter_id: MAT-20260830-2bf7ee
record_type: work_product
status: final
review:
  segments:
  - kind: equal
    text: '# Legal Response — Longer-Term Installment Loan at Checkout (Purchases
      Above $500)


      **Matter:** Northstar UX Test — 02 — Longer-Term Installment Loan Compliance

      **Prepared for:** Product, Compliance, Engineering, Operations, and the lending
      partner

      **Status:** Final business-facing response, based on the reviewed launch-readiness
      memo

      **Privilege:** Privileged and confidential


      ## Bottom line


      The longer-term installment loan is **conditionally feasible** for the eight-week
      target, but only with a narrowed phase-one scope: **neutral pricing, no merchant-funded
      subsidy, no selected-customer promotional rate, generic pre-underwriting term
      display, and a launch limited to states confirmed in an approved state-by-state
      partner matrix.** This response is a conditional recommendation and work plan.
      It is **not launch approval**, and nothing in it should be communicated internally
      or externally as approval to launch. The detailed launch-readiness memo remains
      the governing work product; this response summarizes it for the business teams.


      Separately, a decision has been recorded to **defer merchant-subsidized interest
      and promotional rates to phase 2**. That decision is a distinct record from
      this recommendation. Phase 1 assumes neutral pricing and neutral term presentation
      because state, partner, disclosure, licensing, and fair-lending facts are unresolved;
      phase 2 requires objective eligibility criteria, a documented business purpose,
      disclosure review, fair-lending analysis, and anti-steering controls before
      any subsidized or promotional pricing is offered.


      ## Legal approvals required before launch


      Four approval packages must be completed before launch. First, the **state-by-state
      product and partner matrix** must be finalized and reviewed, including the excluded-state
      list and the reason for every exclusion. This is the critical path: the partner
      map is still being finalized, and no state is automatically available. Second,
      legal must approve the **Regulation Z disclosure set and checkout display**,
      using real term lengths, APR ranges, fees, and down-payment values — not placeholders.
      Third, legal and the lending partner must **allocate underwriting, adverse-action,
      and credit-reporting duties** in writing for each partner configuration. Fourth,
      compliance must approve the **servicing and vendor-control package**, covering
      contract allocation, audit rights, collections conduct, complaints, retention,
      account closure, and regulator response.


      ## Product constraints


      - **Checkout display:** Treat the multi-term display as advertising under Reg
      Z §1026.24. Each term shown must carry the corresponding material information
      (amount financed or cash price, down payment, payment schedule, APR, total of
      payments). Estimates must be clearly labeled, and the experience must state
      that final terms depend on underwriting, state, and creditworthiness.

      - **Generic terms before underwriting:** v1 should show generic, non-personalized
      term examples. Personalized terms based on a pre-selection credit pull would
      change the regulatory treatment and add permissible-purpose, pricing-notice,
      and adverse-action issues earlier in the flow.

      - **Single pricing source of truth:** A versioned pricing and fee matrix keyed
      by state, creditor, term, APR, fees, and down payment must be the single source
      consumed by engineering for both the display and the final offer, using one
      Appendix J-compliant APR calculation engine. Any pricing change requires legal
      review.

      - **No merchant subsidy or promotion in v1:** Per the recorded decision, v1
      excludes merchant-funded subsidies and selected-customer promotional rates,
      with neutral pricing and neutral term presentation for all similarly situated
      customers.

      - **State availability:** Launch only in states where the creditor, Northstar
      Pay''s role, licenses, servicing arrangements, and rates and fees are confirmed.
      Engineering must not lock state routing until the matrix is approved.


      ## Operating controls


      - **Underwriting and adverse action:** Each consumer-report pull needs a permissible
      purpose. Denials and less-favorable counteroffers require accurate principal
      reasons and applicable Reg B/FCRA notice content, with a documented owner for
      each notice in each partner configuration.

      - **Credit reporting:** Whether repayment history is furnished is still an open
      fact. If enabled, the furnishing entity needs accuracy, dispute, and direct-dispute
      controls; if not, product and marketing must not imply credit-building benefits.

      - **Servicing and vendors:** Contracts must allocate compliance duties and include
      audit and remediation rights. Operations needs approved support scripts and
      escalation routes covering payments, collections, complaints, hardship requests,
      displayed-vs-final-term disputes, account closure, and regulator inquiries.

      - **Retention and closure:** A documented retention schedule based on legal,
      contract, dispute, reporting, tax, and litigation needs; account closure triggers
      the approved deletion, suppression, or restricted-retention workflow.


      ## Seven launch gates


      1. Approved state and partner matrix (including excluded states and reasons)

      2. Approved Reg Z display and disclosure set (with real product parameters)

      3. Assigned underwriting and adverse-action duties per partner configuration

      4. Versioned and validated pricing matrix as engineering''s single source of
      truth

      5. Approved servicing and vendor controls

      6. Implementation of the merchant-rate deferral in the v1 build

      7. Final legal sign-off


      None of these gates is closed. The recommended mitigation for the eight-week
      target is to launch in the smallest set of already-licensed and operational
      states, with other states as fast-follow.


      ## Open facts and unverified leads


      **Open facts to confirm:** the creditor and lending partner by state; Northstar
      Pay''s role (lender, broker, servicer) in each configuration; actual APRs, fees,
      and term lengths; the credit-reporting choice; the servicing vendor and payment
      processor; and the ESIGN consent flow.


      **Unverified leads requiring last-mile confirmation:** specific state statutes
      and licensing status, current rate and fee limits by state, the precise Reg
      Z classification of the final UX flow, and any partner-specific disclosure or
      servicing rules. No external state-law research was run for this first pass;
      the analysis is strong first-pass guidance, not a verified state-law opinion.


      ## What we need from each team


      - **Product:** finalize the pricing matrix inputs and confirm no v1 subsidy
      or promotion; supply real term lengths, APR ranges, fees, and down-payment values.

      - **Compliance:** own the servicing and vendor-control package and the underwriting/adverse-action
      allocation with the lending partner.

      - **Engineering:** do not lock state routing until the matrix is approved; consume
      the versioned pricing matrix as the single source of truth; implement the ESIGN
      flow.

      - **Operations:** prepare support scripts and escalation routes for the new
      product.

      - **Lending partner:** confirm creditor status, licenses, and disclosure/servicing
      responsibilities per state.


      The detailed launch-readiness memo in the matter''s work-product folder governs
      where this response and the memo differ in detail.

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
# Legal Response — Longer-Term Installment Loan at Checkout (Purchases Above $500)

**Matter:** Northstar UX Test — 02 — Longer-Term Installment Loan Compliance
**Prepared for:** Product, Compliance, Engineering, Operations, and the lending partner
**Status:** Final business-facing response, based on the reviewed launch-readiness memo
**Privilege:** Privileged and confidential

## Bottom line

The longer-term installment loan is **conditionally feasible** for the eight-week target, but only with a narrowed phase-one scope: **neutral pricing, no merchant-funded subsidy, no selected-customer promotional rate, generic pre-underwriting term display, and a launch limited to states confirmed in an approved state-by-state partner matrix.** This response is a conditional recommendation and work plan. It is **not launch approval**, and nothing in it should be communicated internally or externally as approval to launch. The detailed launch-readiness memo remains the governing work product; this response summarizes it for the business teams.

Separately, a decision has been recorded to **defer merchant-subsidized interest and promotional rates to phase 2**. That decision is a distinct record from this recommendation. Phase 1 assumes neutral pricing and neutral term presentation because state, partner, disclosure, licensing, and fair-lending facts are unresolved; phase 2 requires objective eligibility criteria, a documented business purpose, disclosure review, fair-lending analysis, and anti-steering controls before any subsidized or promotional pricing is offered.

## Legal approvals required before launch

Four approval packages must be completed before launch. First, the **state-by-state product and partner matrix** must be finalized and reviewed, including the excluded-state list and the reason for every exclusion. This is the critical path: the partner map is still being finalized, and no state is automatically available. Second, legal must approve the **Regulation Z disclosure set and checkout display**, using real term lengths, APR ranges, fees, and down-payment values — not placeholders. Third, legal and the lending partner must **allocate underwriting, adverse-action, and credit-reporting duties** in writing for each partner configuration. Fourth, compliance must approve the **servicing and vendor-control package**, covering contract allocation, audit rights, collections conduct, complaints, retention, account closure, and regulator response.

## Product constraints

- **Checkout display:** Treat the multi-term display as advertising under Reg Z §1026.24. Each term shown must carry the corresponding material information (amount financed or cash price, down payment, payment schedule, APR, total of payments). Estimates must be clearly labeled, and the experience must state that final terms depend on underwriting, state, and creditworthiness.
- **Generic terms before underwriting:** v1 should show generic, non-personalized term examples. Personalized terms based on a pre-selection credit pull would change the regulatory treatment and add permissible-purpose, pricing-notice, and adverse-action issues earlier in the flow.
- **Single pricing source of truth:** A versioned pricing and fee matrix keyed by state, creditor, term, APR, fees, and down payment must be the single source consumed by engineering for both the display and the final offer, using one Appendix J-compliant APR calculation engine. Any pricing change requires legal review.
- **No merchant subsidy or promotion in v1:** Per the recorded decision, v1 excludes merchant-funded subsidies and selected-customer promotional rates, with neutral pricing and neutral term presentation for all similarly situated customers.
- **State availability:** Launch only in states where the creditor, Northstar Pay's role, licenses, servicing arrangements, and rates and fees are confirmed. Engineering must not lock state routing until the matrix is approved.

## Operating controls

- **Underwriting and adverse action:** Each consumer-report pull needs a permissible purpose. Denials and less-favorable counteroffers require accurate principal reasons and applicable Reg B/FCRA notice content, with a documented owner for each notice in each partner configuration.
- **Credit reporting:** Whether repayment history is furnished is still an open fact. If enabled, the furnishing entity needs accuracy, dispute, and direct-dispute controls; if not, product and marketing must not imply credit-building benefits.
- **Servicing and vendors:** Contracts must allocate compliance duties and include audit and remediation rights. Operations needs approved support scripts and escalation routes covering payments, collections, complaints, hardship requests, displayed-vs-final-term disputes, account closure, and regulator inquiries.
- **Retention and closure:** A documented retention schedule based on legal, contract, dispute, reporting, tax, and litigation needs; account closure triggers the approved deletion, suppression, or restricted-retention workflow.

## Seven launch gates

1. Approved state and partner matrix (including excluded states and reasons)
2. Approved Reg Z display and disclosure set (with real product parameters)
3. Assigned underwriting and adverse-action duties per partner configuration
4. Versioned and validated pricing matrix as engineering's single source of truth
5. Approved servicing and vendor controls
6. Implementation of the merchant-rate deferral in the v1 build
7. Final legal sign-off

None of these gates is closed. The recommended mitigation for the eight-week target is to launch in the smallest set of already-licensed and operational states, with other states as fast-follow.

## Open facts and unverified leads

**Open facts to confirm:** the creditor and lending partner by state; Northstar Pay's role (lender, broker, servicer) in each configuration; actual APRs, fees, and term lengths; the credit-reporting choice; the servicing vendor and payment processor; and the ESIGN consent flow.

**Unverified leads requiring last-mile confirmation:** specific state statutes and licensing status, current rate and fee limits by state, the precise Reg Z classification of the final UX flow, and any partner-specific disclosure or servicing rules. No external state-law research was run for this first pass; the analysis is strong first-pass guidance, not a verified state-law opinion.

## What we need from each team

- **Product:** finalize the pricing matrix inputs and confirm no v1 subsidy or promotion; supply real term lengths, APR ranges, fees, and down-payment values.
- **Compliance:** own the servicing and vendor-control package and the underwriting/adverse-action allocation with the lending partner.
- **Engineering:** do not lock state routing until the matrix is approved; consume the versioned pricing matrix as the single source of truth; implement the ESIGN flow.
- **Operations:** prepare support scripts and escalation routes for the new product.
- **Lending partner:** confirm creditor status, licenses, and disclosure/servicing responsibilities per state.

The detailed launch-readiness memo in the matter's work-product folder governs where this response and the memo differ in detail.
