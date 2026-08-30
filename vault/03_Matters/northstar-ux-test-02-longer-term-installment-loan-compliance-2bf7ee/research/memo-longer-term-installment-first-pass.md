---
matter_id: MAT-20260830-2bf7ee
record_type: research_memo
status: first_pass
---
# First-Pass Research Memo — Longer-Term Installment Loan at Checkout

**Matter:** Northstar UX Test — 02 — Longer-Term Installment Loan Compliance
**Prepared for:** Brian Harris (legal owner)
**Status:** First-pass analysis; not court-ready. No external sources were searched; all regulatory statements below are generated analysis from general regulatory knowledge and matter facts and must be verified against current law before launch approval.

## Provenance Legend

- **Supplied facts:** drawn from the product request and the Northstar Pay company profile.
- **Assumptions:** reasonable working assumptions stated to keep moving; each must be confirmed.
- **Unverified leads:** issues flagged for last-mile verification; no source confirmed.
- **Generated analysis:** counsel-workbench analysis applying general regulatory knowledge to the supplied facts.

---

## 1. Regulation Z / TILA — Multi-Term Checkout Display

The proposed checkout experience shows several repayment terms, an estimated monthly payment, the APR, total amount paid, and any down payment before the customer selects a term and undergoes underwriting. Because this is a longer-term installment loan (not a pay-in-4 product), it is closed-end credit subject to the full Regulation Z framework, and the checkout display is very likely an "advertisement" under 12 C.F.R. §1026.24. Stating any triggering term — a rate of finance charge, the amount of any payment, or the number of payments — requires the ad to also state the APR (using that term), the terms of repayment, and the down payment requirement. A multi-term display that shows payment amounts and APRs for each term therefore must carry the full set of corresponding disclosures for each term shown, not just one. If the APR varies with creditworthiness or state, the display must say so (e.g., "subject to credit approval; rates and terms vary by state and credit profile"), and estimated payments must be clearly labeled as estimates rather than firm offers.

The most consequential design decision is whether the pre-selection display shows **generic terms** (advertising treatment under §1026.24) or **personalized, pre-underwritten terms** (which may constitute a prequalification or even a firm offer of credit). If Northstar Pay pulls a credit report or applies underwriting logic before displaying terms, the display moves from advertising into prequalification/offer territory, which changes the required disclosures, the FCRA permissible-purpose analysis, and the risk-of-liability profile. The cleanest structure for an eight-week launch is a generic multi-term display with clear "estimate" labeling and a "subject to credit approval" qualifier, followed by underwriting and a final, fully disclosed offer. This is generated analysis; the exact classification depends on the final UX flow and must be confirmed against the actual screens.

**Assumptions:** the display is shown to all customers generically before underwriting; no credit report is pulled before term selection. **Must be confirmed:** final UX flow, whether any pre-screening occurs, and whether any state imposes point-of-sale disclosure rules beyond Reg Z.

## 2. APR and Payment Representations

The APR shown in both the checkout display and the final offer must be computed in accordance with Regulation Z Appendix J, and the disclosed APR is subject to accuracy tolerances under §1026.22 — generally a small tolerance for closed-end credit, with zero tolerance for understatement beyond the allowed variance in some configurations. Estimated payments in the display must be labeled as estimates; the final offer must reflect the actual computed APR, finance charge, amount financed, total of payments, and payment schedule. Any merchant-subsidized interest or promotional rate changes the finance charge and therefore the APR computation, and must be reflected accurately in both the display and the final disclosures. Payment representations that turn out to be inaccurate at consummation create TILA liability and, if systematic, UDAAP exposure.

**Generated analysis:** Northstar Pay should build a single APR/payment calculation engine used by both the display and the final offer so the numbers cannot diverge, and should test it against Appendix J sample calculations before launch. **Must be confirmed:** actual term lengths, APR ranges, and fee schedule by state; whether any proposed pricing exceeds state caps (see Section 5).

## 3. Disclosures Before Acceptance and at Consummation

Before the customer accepts the loan agreement, the final offer must present the full set of closed-end credit disclosures under §§1026.17 and 1026.18: APR, finance charge, amount financed, total of payments, payment schedule, late-fee terms, prepayment provisions (or their absence), and required identity and security-interest disclosures. These must be delivered in the required form and sequence, and electronic delivery requires a compliant ESIGN consent flow — demonstrable consent to receive disclosures electronically before they are provided. The loan agreement acceptance must occur after the customer has had the opportunity to review the disclosures; the UX should present disclosures as a distinct, reviewable step rather than a scroll-through clickwrap, consistent with the company's stated risk posture of clear customer-facing disclosure of amounts, dates, fees, and conditions before acceptance.

**Assumptions:** electronic-only delivery; no paper fallback needed. **Must be confirmed:** ESIGN flow design, state-specific addenda (some states require additional notices for installment loans), and whether any launch state requires a waiting period between disclosure and consummation.

## 4. Underwriting and Adverse-Action Implications

If underwriting uses consumer reports, FCRA requires a permissible purpose for the pull, and adverse action notices under FCRA and ECOA/Regulation B are required for denials, counteroffers not accepted, and unfavorable term changes. Reg B requires notification within 30 days of a completed application, with the specific content required by §1002.9 (including the ECOA notice and, where applicable, the right to a statement of specific reasons). If credit reporting is enabled for the product (furnishing), Metro 2 accuracy, dispute-handling workflows, and the FCRA direct-dispute rules apply. If underwriting is done by the lending partner rather than Northstar Pay, the program agreement must clearly allocate who issues adverse-action notices and who holds the FCRA/ECOA obligations — but note that courts and regulators have not always honored contractual allocation where the consumer-facing party controls the experience.

**Assumptions:** credit reporting will be enabled consistent with the company profile's "when reporting is enabled" framing. **Must be confirmed:** whether credit reports are pulled pre-selection or post-selection; who is the FCRA/ECOA responsible party in each partner configuration; whether any scoring model or pricing tiering requires fair-lending model review.

## 5. State-by-State Licensing, Rate, and Fee Limits

The company profile establishes that no state is automatically available, that longer-term installment products are limited to a smaller approved state list after partner review, and that different lending partners may be used by product and state. For each launch state, counsel must confirm: (a) which entity is the creditor (true-lender analysis where a bank partner is involved — the bank must retain the predominant economic interest, and substance controls over form); (b) whether Northstar Pay's role as arranger/servicer triggers lender, broker, CFL, or loan-servicer licensing in that state; (c) whether the proposed rates and fees comply with the state's installment-loan statute, usury limits, and fee caps (late fees, origination fees); and (d) whether the state imposes disclosure, notice, or filing requirements beyond Reg Z. Bank-partner structures may support rate exportation under valid-when-made principles, but non-bank lending partners face state rate caps directly, and several states have active true-lender enforcement positions.

The state-by-state product and partner matrix — including excluded states, the responsible entity, servicing vendor, payment processor, and contract terms per state — is flagged in the company profile as an open implementation fact that legal must confirm before launch, and Alex Morgan should see it before approving expansion. **This is the gating work item for the eight-week timeline.** Licensing timelines for any state where a license is not already held will almost certainly exceed eight weeks, so the launch state list should be limited to states where the applicable entity is already licensed or where a bank partner's preemption applies.

**Unverified leads:** current licensing status of each entity in each candidate state; state-specific installment-loan statutes and fee caps for the actual term lengths and amounts; any state restrictions on merchant involvement in credit terms (see Section 6).

## 6. Merchant Subsidies and Promotional Rates

The product team has not decided whether merchants may subsidize interest or offer promotional rates to selected customer groups. This is a material open decision because it changes the compliance analysis in three ways. First, disclosure: subsidized or promotional APRs must be accurately reflected in the finance charge, APR, and total-of-payments figures, and promotional-rate advertising has specific Reg Z requirements (the promotional rate must be stated clearly, with the rate/term after the promotional period if it reverts). Second, fair lending: targeting promotional rates to selected customer groups requires a documented, non-discriminatory basis for the selection criteria, and a fair-lending review of the targeting logic before launch. Third, steering: merchants influencing which credit terms a customer selects raises steering and, in some configurations, broker-compensation concerns; some states restrict merchant participation in credit terms. The company profile also requires that any merchant data access beyond aggregated reporting go through separate legal review.

**Recommendation (generated analysis):** for v1, defer merchant-subsidized interest and promotional rates to a phase 2, and launch with standard pricing only. This removes the fair-lending targeting review, the promotional-rate disclosure set, and the steering analysis from the critical path. If the business insists on subsidies for v1, the targeting basis must be documented and reviewed before launch. **Must be confirmed:** the product decision itself, and state-specific merchant-participation restrictions.

## 7. Fair-Lending and Steering Risks

Beyond promotional-rate targeting, fair-lending exposure arises from underwriting and pricing models (disparate impact from proxies for protected classes), from the merchant network itself (if the product is available at some merchants but not others on a basis correlated with protected-class geography), and from steering within checkout (if the UX defaults or nudges customers toward particular terms). ECOA/Reg B applies to the extension of credit regardless of entity structure, and regulators have applied fair-lending scrutiny to point-of-sale fintech programs. Generated analysis: Northstar Pay should document the underwriting and pricing model logic, run a disparate-impact review of any model or tiering before launch, and ensure the checkout UX presents terms neutrally (no pre-selected default term, equal prominence across options).

## 8. Lending-Partner Allocation

Because different entities may be the creditor by state, the program agreements must clearly allocate: who is the Reg Z creditor and disclosure provider; who bears licensing responsibility; who handles underwriting, adverse action, and credit reporting; who services and collects; and indemnities for compliance failures. The partner map is still being finalized per the company profile, and the same customer-facing experience may not be usable in every state — meaning the disclosure set, fee schedule, and possibly the checkout flow must be parameterized by state and partner. **Must be confirmed before launch:** the finalized partner matrix, and contract terms consistent with it.

## 9. Servicing and Vendor Controls

Operating controls required before launch include: servicing-conduct compliance (payment allocation, payoff statements, late-fee assessment consistent with disclosures); collections conduct under the FDCPA and state debt-collection statutes where vendors collect; credit-reporting accuracy and dispute handling if reporting is enabled; vendor oversight with audit rights and compliance responsibility allocation in the servicing contracts; role-based access controls and vendor restrictions per the company's data practices; and a documented retention schedule rather than indefinite retention, with account-closure triggering deletion/suppression review. The company profile's data-practice constraints apply: merchants receive aggregated reporting by default, and any more detailed merchant reporting requires separate legal review.

## 10. Launch Approvals

Before launch, the following approvals should be in place: (1) the state-by-state product and partner matrix approved by legal (Brian Harris) and, per the company profile, reviewed by Alex Morgan before expansion approval; (2) final disclosure templates reviewed against §§1026.17, .18, .22, .24 and Appendix J with actual product parameters; (3) the ESIGN flow confirmed; (4) the promotional-rate decision made and, if proceeding, fair-lending review completed; (5) servicing vendor contracts executed with compliance allocation and audit rights; (6) licensing confirmed for each entity/state; and (7) a documented retention and data-sharing map for the new product. The eight-week clock runs from legal approval, so the partner matrix and disclosure set are the critical-path items.

---

## Product Constraints (Summary)

1. Checkout display must carry full §1026.24 advertising disclosures for each term shown; estimates labeled as estimates; "rates vary" qualifier.
2. No credit pull or personalized terms before underwriting unless prequalification disclosures are added.
3. Final offer must present full §§1026.17/.18 disclosures before acceptance, via a compliant ESIGN flow.
4. APR/payment engine must be Appendix J-compliant and consistent between display and final offer.
5. Launch states limited to the approved longer-term state list with confirmed partner, licensing, and rate/fee compliance.
6. Merchant-subsidized interest and promotional rates deferred or separately reviewed (fair-lending targeting basis documented).
7. Neutral term presentation; no steering defaults.
8. Merchant reporting limited to aggregated data absent separate legal review.

## Operating Controls (Summary)

1. Adverse-action notice workflow (FCRA/Reg B) with allocated responsibility per partner.
2. Credit-reporting accuracy, dispute handling, and Metro 2 furnishing controls if enabled.
3. Servicing-conduct and collections compliance program for vendors.
4. Vendor oversight with audit rights and compliance allocation.
5. Documented retention schedule; account-closure deletion/suppression review.
6. Fair-lending model documentation and disparate-impact review.
7. State/parameterized disclosure configuration management.

## Open Items Requiring Confirmation Before Launch

- Finalized state-by-state partner matrix (gating).
- Licensing status per entity/state.
- Actual term lengths, APR ranges, fee schedule vs. state caps.
- Promotional-rate/merchant-subsidy product decision.
- Credit-reporting enablement and responsible party.
- Final UX flow (advertising vs. prequalification classification).
- ESIGN flow design.
- State-specific disclosure addenda and any waiting periods.
