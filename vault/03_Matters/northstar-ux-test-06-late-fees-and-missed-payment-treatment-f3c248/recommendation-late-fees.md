---
matter_id: MAT-20260830-f3c248
phase: generate
type: recommendation
legal_owner: Brian Harris
reviewer: Alex Morgan
---
# Recommendation — Late Fees and Missed-Payment Treatment

**To:** Alex Morgan, Northstar Pay; Product Team
**From:** Legal (Generate-phase work product for review by Brian Harris)
**Matter:** Northstar UX Test — 06 — Late Fees and Missed-Payment Treatment
**Privilege:** Privileged and Confidential — Attorney Work Product
**Status:** Recommendation only. No decision recorded.

## Recommendation

Launch a single, conservative, uniform late-fee policy for pay-in-4 now, and gate the longer-term installment fee schedule on the finalized state-and-partner matrix. Specifically: a late fee capped at the lowest applicable state cap among live states (a conservative ceiling pending the proposed numbers), a 21-day grace period, pre-fee reminders stating the amount and date, an objective automated first-fee waiver, no stacking of late fees with returned-payment fees, full disclosure of the fee at checkout, in the loan agreement, in the app, and in account history, and a default of excluding late fees from credit reporting and from referred collection balances until accuracy workflows and partner fee-ownership terms are confirmed. This path recovers reasonable servicing costs, materially reduces complaint risk, keeps the product affordable, and can be implemented before the next major release without waiting on the unsettled CFPB BNPL rule status or the unfinished partner matrix.

## Reasons

The two products face different legal exposure, and the recommendation prices that asymmetry. For pay-in-4, the controlling legal question — whether the CFPB's interpretive rule treating BNPL like credit cards under Regulation Z is in force — is an **unverified lead**. A policy built to the card-style framework (21-day grace, conservative fee, clear disclosures) is compliant on either branch of that question: if the rule applies, the policy satisfies it; if it does not, the policy is defensible under state law because it is set below every state cap. Waiting for the rule to settle would delay the release for a question the conservative design makes moot. For longer-term installments, the permissible fee, grace period, and disclosure obligations turn on which entity is the true lender and which state license applies in each state — a **missing fact** (the partner matrix). Rather than delay, the recommendation gates the longer-term fee schedule on that matrix: no fee goes live in a state until the partner, license type, and state cap are confirmed for that state, and the fee is set at or below that state's cap, tested against any all-in cap (notably Illinois's 36% PLPA question, an **unverified lead**).

The complaint-reduction and affordability objectives are served by the design choices themselves. The 21-day grace period and pre-fee reminders mean most customers who miss a payment cure before any fee is charged. The objective first-fee waiver removes the single largest complaint trigger — a first missed payment generating a fee — while avoiding fair-lending and UDAAP risk because the criteria are automated and uniformly applied. The no-stacking rule (a late fee or a returned-payment fee for a single event, never both) eliminates the double-charge pattern that drives complaints and, in some states, is impermissible. The disclosure and account-history treatment — the fee amount, trigger conditions, grace period, and waiver availability shown consistently at checkout, in the agreement, in the app, and in account history — satisfies the company's stated customer-clarity risk posture **[supplied fact]** and is itself a UDAAP control.

## Fee Amount

The proposed fee amount is a **missing fact**. This recommendation therefore states only a conservative cap: the fee should be set at or below the lowest applicable state cap among live states, and below the historical card-style late-fee limits ($29 first / $40 subsequent, with the $8-cap rule in litigation — **unverified lead**) for pay-in-4. Once Product supplies the proposed number, it should be tested against each state cap, the Illinois all-in-cap question, and the card-style limits. If the proposed fee exceeds the conservative cap, the choice is to lower it or adopt state-tiered pricing, which this recommendation defers as a later phase.

## Grace Period, Reminders, and Waiver

A 21-day grace period before any late fee is the conservative default for both products. Pre-fee reminders should be sent during the grace period, stating the fee amount, the date it will be charged, and how to avoid it. The first-fee waiver should apply automatically when objective criteria are met — recommended: first missed payment on the account, account otherwise in good standing, and fee below a threshold — executed by the servicing system with an audit log, disclosed in the fee disclosure itself, and documented in a policy operations cannot vary ad hoc. The waiver criteria themselves are a **missing fact**; the criteria above are the recommended default.

## Failed Payments, Reporting, and Collections

For a single failed-payment event, charge either a late fee or a returned-payment fee, never both; if an NSF fee is proposed (a **missing fact**), test it against state NSF-fee limits and disclose it separately. The reporting and collections default is exclusion: late fees should not be credit-reported and should not be included in referred collection balances until (a) the FCRA furnisher-accuracy workflow is confirmed, (b) partner contracts allocate fee ownership, and (c) collections-vendor conduct controls are in place. This rests on **Assumption B** (fees are not currently credit-reported), which is falsified if reporting is enabled.

## Ownership and Controls

Fee ownership must be specified in each partner contract — which entity charges the fee, keeps it, refunds it, and handles complaints about it — keyed to the state/product/partner matrix. Minimum launch controls: the fee-configuration matrix; tested fee and waiver logic with audit logs; a refund/reversal workflow; late-fee vs. NSF-fee separation in the ledger; complaint monitoring keyed to fee events; and a pre-launch reconciliation proving disclosed fee equals charged fee in every state/product/partner combination.

## Launch Gates

1. Proposed fee amount supplied and tested against the conservative cap.
2. CFPB BNPL rule status verified as of launch date (**unverified lead**).
3. For longer-term products: state/partner matrix confirmed per state before that state's fee goes live.
4. Illinois all-in-cap treatment of late fees confirmed (**unverified lead**).
5. Pre-launch reconciliation completed.

## Assumptions

- **A:** A bank or lending partner originates the longer-term product; Northstar Pay services it. Falsified if Northstar Pay is the lender in any state.
- **B:** Late fees are not currently credit-reported. Falsified if reporting is enabled.
- **C:** A uniform national fee is preferred over state-tiered fees. Falsified if Product requires state-tiered pricing.
- **D:** The customer-facing experience can vary by state where required. Falsified if a single national experience is mandatory.

## Missing Facts

Proposed fee amount; grace-period length; waiver criteria; finalized longer-term state/partner list; payment methods in scope; NSF-fee proposal; whether fees will be reported or included in collection balances; release date.

## Unverified Leads

CFPB BNPL interpretive-rule status; late-fee-cap litigation; Illinois PLPA treatment of late fees; New York Madden effect; state-specific notice forms and timing for longer-term products; California financing-law treatment of pay-in-4.

## Alternatives

1. **Delay everything until the CFPB rule and partner matrix settle.** Cleanest legally, but forfeits the release window and the conservative design already makes the pay-in-4 path safe on either branch. Not recommended.
2. **State-tiered fees from day one.** Maximizes revenue in high-cap states but multiplies configuration, disclosure, and reconciliation risk before the partner matrix is final. Defer to a later phase.
3. **No late fees at launch.** Lowest complaint risk, but abandons cost recovery and creates an affordability-subsidy question; also unnecessary given the conservative design. Not recommended.

## Decision

No decision is recorded. This recommendation is ready for review by Brian Harris and Alex Morgan; if adopted, it should be recorded as a durable decision on explicit instruction.
