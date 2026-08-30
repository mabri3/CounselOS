---
matter_id: MAT-20260830-f3c248
record_type: orientation_issue_map
prepared_for: Alex Morgan
phase: explore
---
# Orientation and Issue Map — Late Fees and Missed-Payment Treatment

**Prepared for:** Alex Morgan (legal owner of record: Brian Harris)
**Matter:** Northstar UX Test — 06 — Late Fees and Missed-Payment Treatment
**Status:** Explore phase. No decision recorded. First-pass research complete; citations not yet verified for court- or regulator-ready reliance.

---

## 1. Business Objective and Requested Decision

Northstar Pay is revising its late-fee policy for its pay-in-4 and longer-term installment products. The business goal is to recover reasonable servicing costs on missed payments while reducing customer complaints and keeping the products affordable for the customers who use them. Product has proposed a policy built around a grace period, reminders sent before any fee is charged, and clear display of any late fee in the app and in account history. Product is also considering waiving a first late fee for customers who meet certain criteria. The requested decision is whether and on what terms Northstar Pay may implement this late-fee policy across its live states and both product lines before the next major product release. In practice, that decision requires counsel to approve (a) permissible fee amounts by product and state, (b) the minimum grace period and reminder cadence, (c) the required disclosures at checkout, in the app, and in the loan agreement, (d) the first-fee waiver criteria, and (e) the operational controls that prevent fees from being charged incorrectly. The timing pressure is real but should not drive the analysis: an incorrectly charged fee in a capped or prohibited state creates refund obligations, complaint volume, and regulator attention that cost more than a delayed launch.

## 2. Actors and Product Scope

The affected products are the app-based pay-in-4 product and the longer-term installment products offered at merchant checkout and in the Northstar Pay app. The actors whose conduct the policy must govern include customers; Northstar Pay itself; the FDIC-insured bank and lending partners that originate or hold the credit (which differ by product and state); payment processors that handle payment attempts and returns; servicing vendors that send reminders and apply fees; and collections vendors that may receive fee-inclusive balances. Because the responsible entity, servicing vendor, payment processor, and contract terms may differ by product and state, the same customer-facing late-fee experience may not be permissible everywhere. The scope of this matter therefore includes the fee-charging mechanics across the full lifecycle: missed payment, grace period, reminder, fee assessment, display, waiver, refund, credit reporting, and collections referral.

## 3. Known Facts

The following facts are established from the request and the company profile. Northstar Pay is currently live for pay-in-4 in California, Colorado, Georgia, Illinois, New York, Texas, and Washington; longer-term installment products are limited to a smaller approved state list after partner review, and that list is not yet finalized. State law may limit late fees or prohibit them for certain products. Fees may differ based on loan type, customer location, payment method, and the reason a payment was missed. The proposed policy includes a grace period, pre-fee reminders, in-app and account-history display of fees, and a possible first-fee waiver for customers meeting certain criteria. The company's risk posture requires that customer-facing experiences clearly disclose amounts due, payment dates, fees, material conditions, and choices before acceptance. Merchants receive aggregated reporting by default, and any merchant access to repayment data is out of scope here. First-pass research (unverified) indicates that the CFPB's 2024 interpretive rule treating BNPL like credit cards under Regulation Z would impose card-style grace-period and late-fee constraints on pay-in-4, but that rule's status is in flux and must be confirmed before reliance.

## 4. Missing Facts and Assumptions

**Missing facts (material, must be obtained or assumed before final recommendation):**

- The proposed fee amount(s) and fee structure (flat vs. percentage, caps per missed payment and in aggregate).
- The proposed grace-period length and reminder cadence.
- The finalized state and partner list for longer-term installments, and the state-by-state product/partner matrix generally.
- The proposed first-fee waiver criteria and whether waivers would be automated or discretionary.
- Whether late fees will be credit-reported and included in collection balances, and how partner contracts allocate fee ownership.
- Payment methods in scope and whether any returned-payment/NSF fee is proposed alongside the late fee.
- The actual release date for the next major product release.

**Assumptions (stated for planning; confirm before decision):**

- *Assumption A:* Pay-in-4 is originated through a bank-partner structure such that the true-lender and preemption analysis determines which state fee limits apply; this is assumed unresolved until the partner matrix is confirmed.
- *Assumption B:* Late fees are intended to be charged by the applicable lending partner or Northstar Pay as servicer under contract; the charging entity's licensing status in each state is assumed to require confirmation.
- *Assumption C:* The first-fee waiver, if adopted, will use objective, automated criteria applied uniformly; discretionary waivers are assumed out of scope.
- *Assumption D:* Reminders will be delivered electronically under existing e-consent; no new consent channel is assumed.

**Unverified leads (from first-pass research; do not rely without verification):**

- *Unverified:* The CFPB 2024 BNPL interpretive rule's current status (rescission efforts and the late-fee-cap litigation) and its practical effect on pay-in-4 grace periods and fee amounts.
- *Unverified:* Whether Illinois's 36% all-in PLPA cap counts late fees toward the cap for longer-term installments, and the equivalent treatment in other live states.
- *Unverified:* State-specific minimum grace periods or pre-fee notice requirements in the seven live pay-in-4 states.

## 5. Legal Issues to Analyze

**Pay-in-4 versus longer-term installments.** The two products sit in different regulatory frames. Pay-in-4 may be treated as a credit-card-like product under the CFPB's BNPL interpretive rule, which (if operative) would import Regulation Z grace-period and late-fee constraints; longer-term installments are governed by state consumer-loan and installment-sale statutes with their own fee schedules. The analysis must run each product separately and must not assume a single uniform fee rule.

**State and partner variation.** Each live state (CA, CO, GA, IL, NY, TX, WA for pay-in-4; the approved list for longer-term products) has its own rate and fee limits, licensing rules, and treatment of late fees, and the true-lender/bank-partner structure may or may not displace those limits. The state-by-state product and partner matrix is an open implementation fact that legal must confirm before any fee schedule is finalized; the same customer-facing experience may not be usable in every state.

**Grace period and reminders.** Determine the minimum grace period and any required pre-fee notice by state and product, including form and timing of the reminder, and whether the proposed reminder cadence satisfies both legal minimums and the company's customer-clarity posture.

**Fee amount and disclosure limits.** Determine permissible fee amounts (flat caps, percentage caps, aggregate limits, and whether late fees count toward all-in rate caps such as Illinois's), and the required disclosures of the fee's amount, timing, and conditions at checkout, in the loan agreement, in the app, and in account history. Disclosed fee must equal charged fee in every state/product/partner combination.

**Waiver criteria.** A first-fee waiver conditioned on customer criteria is generally defensible if the criteria are objective, automated, and uniformly applied; discretionary or loosely defined criteria create fair-lending disparate-treatment and UDAAP consistency risk. The criteria must be documented and the automation tested.

**Failed payments and returned-payment fees.** Keep late fees and returned-payment/NSF fees analytically and operationally distinct; charging both for a single missed event is a leading complaint driver and a UDAAP exposure. Confirm whether different fees by payment method are permissible in each state and disclose any such difference.

**Credit reporting and collections balances.** Confirm whether late fees may be included in credit-reported balances and collection-referral balances, the FCRA furnisher-accuracy obligations that follow, FDCPA and state collections-conduct limits on fee-inclusive balances, and how partner contracts allocate fee ownership and refund responsibility.

**Implementation controls.** The controls needed to prevent incorrect charging include a state/product/partner fee-configuration matrix; tested fee-calculation and waiver logic; a refund/reversal workflow; audit records of every fee assessed, waived, and reversed; complaint monitoring keyed to fee events; and a pre-launch reconciliation proving disclosed fee equals charged fee across all combinations.

---

## Work Plan

The work plan below sequences research, exploration, memo generation, recommendation, decision review, and response. Work items have been created in the matter and are listed in the matter's work-item tracker.
