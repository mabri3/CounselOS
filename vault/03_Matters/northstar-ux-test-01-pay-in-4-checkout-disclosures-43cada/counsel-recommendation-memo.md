---
matter_id: MAT-20260830-43cada
record_type: recommendation
status: draft
---
# Counsel Recommendation Memo — Pay-in-4 Checkout Redesign

**To:** Product Team
**From:** Legal (Brian Harris)
**Re:** Northstar UX Test 01 — Pay-in-4 Checkout Disclosures
**Status:** Draft work product — privileged and confidential. First-pass research; CFPB rule status and state-specific details are unverified leads requiring confirmation before launch.

## Recommendation (summary)

The proposed checkout redesign can launch next quarter **if** the following changes are made and the flagged facts are confirmed: (1) add a full pre-acceptance disclosure set including total of payments and late-fee trigger conditions; (2) add an explicit E-SIGN consent step before electronic delivery of the loan agreement; (3) build one core disclosure set to the strictest state standard (likely California SB 975) with state-specific overlays for fee and partner differences; (4) confirm the CFPB BNPL interpretive rule's current status and the state-by-state partner matrix before finalizing disclosure ownership.

## 1. Federal disclosure timing and content

**Applicability.** Pay-in-4 is likely "credit" under TILA/Reg Z even with no interest, because late fees generally count as finance charges. The CFPB's 2024 interpretive rule (effective July 2025) may treat BNPL providers as credit card providers, adding periodic-statement, dispute-rights, and ability-to-repay obligations. **This is the single biggest unverified fact** — its current litigation/amendment status must be confirmed before the disclosure set is finalized.

**Before approval (identity/eligibility checks):**
- No affirmative pre-approval disclosure is federally required, but state rules may impose one.
- Reg B adverse action notice process must exist for declined applicants (within 30 days).

**Before acceptance (the critical gate):**
- Full payment schedule: four payment amounts with specific dates.
- Amount due today, shown distinctly from the remaining payments.
- All fees: late fee amount and trigger conditions, plus any rescheduling or other charges.
- Total of payments / total cost of the purchase.
- Identity of the creditor.
- Disclosures must be clear and conspicuous and provided before the consumer becomes obligated.

**Gap in proposed UX:** the current design shows purchase amount, four payments, dates, fees, amount due today, and a loan agreement link — but omits total of payments and fee trigger conditions, and does not specify that disclosures appear before the accept action.

## 2. Agreement delivery and E-SIGN consent

- A bare link to the loan agreement is **not** E-SIGN consent. Add an explicit consent step before the agreement link becomes active.
- Consent language must cover: what is delivered electronically, how to withdraw consent, hardware/software requirements, and the right to a paper copy.
- Provide reasonable notice of rights and confirmation of ability to access the electronic record.
- Retain consent records and delivered agreements.
- App-channel customers may already have E-SIGN consent on file from account creation; merchant web and mobile web customers are likely new and need a fresh consent step.

## 3. State-law overlays (CA, CO, GA, IL, NY, TX, WA)

- **California SB 975:** BNPL-specific disclosures including late fee terms, reinstatement rights, and prohibited practices; format may exceed Reg Z. Likely the strictest overlay.
- **New York:** general consumer protection and licensing-driven requirements; no BNPL-specific statute confirmed in this pass.
- **IL, CO, GA, TX, WA:** general consumer credit/UDAP rules; fee caps and licensing vary.
- The partner matrix (creditor identity, servicing vendor, contract terms by state) is not finalized; disclosure ownership and agreement terms may differ by state.
- Late fee amounts must be verified against state fee caps; presentation must vary if any state caps fees below the product default.

**Recommended approach:** one core disclosure set built to the strictest common denominator (likely California), with state-specific overlays for fee and partner differences. This fits the next-quarter timeline.

## 4. Channel-specific UX changes

**Merchant website:**
- Add explicit E-SIGN consent step before the loan agreement link becomes active.
- Display total of payments and late fee trigger conditions on the main checkout screen, not behind a tooltip.
- Ensure disclosures appear before the "accept" button, not after.

**Mobile web:**
- Same substantive content as desktop; verify disclosure prominence on small screens (no collapsed or hidden fee terms).
- Confirm the payment schedule is visible without scrolling past the accept action.

**Northstar Pay app:**
- Check whether existing E-SIGN consent from account creation covers loan agreement delivery; if not, add the consent step.
- Ensure in-app disclosures match the web flow in content, even if presentation adapts.

**All channels:** substantive disclosure content must be equivalent across channels even if presentation differs.

## 5. Assumptions

- Pay-in-4 is consumer-purpose credit; late fees are finance charges, making the product "credit" under TILA/Reg Z even with no interest.
- The bank-partner model may or may not make Northstar Pay the creditor for disclosure purposes depending on state configuration.
- Checkout runs on merchant web, mobile web, and the app; substantive disclosure content must be equivalent across channels.

## 6. Missing facts that could change the advice

1. Creditor identity by state and product configuration (partner matrix not finalized).
2. Fee schedule and state fee caps for late fees and other charges.
3. Whether the app channel already has E-SIGN consent on file from account creation.
4. Current status of the CFPB BNPL interpretive rule (litigation, amendment, rescission).
5. Whether any live state imposes BNPL-specific disclosure timing/format beyond Reg Z (California SB 975 is the likely strictest overlay).

## 7. Launch recommendation

**Conditional go for next quarter**, subject to:
1. Confirming the CFPB BNPL interpretive rule's current status and required disclosure set.
2. Obtaining the state-by-state partner matrix (creditor identity per state).
3. Obtaining the fee schedule by state and confirming against state fee caps.
4. Implementing the E-SIGN consent step and pre-acceptance disclosure changes above.
5. Verifying California SB 975 disclosure text and timing against the proposed UX.
6. Delivering a state-overlay disclosure matrix for Product to implement.

This memo is a recommendation only. Any durable decision (e.g., approving the disclosure set or the launch path) is a separate step that only counsel may record.
