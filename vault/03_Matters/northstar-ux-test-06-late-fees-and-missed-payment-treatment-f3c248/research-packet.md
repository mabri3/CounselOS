---
matter_id: MAT-20260830-f3c248
record_type: research_packet
phase: explore
prepared_for: Alex Morgan
---
# Research Packet — Late Fees and Missed-Payment Treatment

**Matter:** Northstar UX Test — 06 — Late Fees and Missed-Payment Treatment
**Prepared for:** Alex Morgan (legal owner of record: Brian Harris)
**Status:** First-pass research, organized by product. Not court-ready; last-mile verification required before any fee schedule is finalized.

**Provenance and tagging key.** Each item below is tagged: **[Supplied]** (from the request or matter files), **[Verified]** (confirmed against a source in the workspace), **[Assumption]** (working assumption stated to keep the analysis moving), **[Missing fact]** (needed to complete the analysis), **[Unverified lead]** (generated legal analysis or rule statement not yet confirmed against primary authority). No external sources were searched in this pass; all state-law and CFPB-rule statements are unverified leads until the last-mile verification is done.

---

## Part I — Pay-in-4 (BNPL)

### 1. Permissible fee amounts

The threshold question for pay-in-4 is which regulatory regime applies. The CFPB's 2024 interpretive rule treated BNPL providers like credit card issuers for Regulation Z purposes, importing the CARD Act late-fee framework: a late fee is generally permitted only after a 21-day grace period, must be disclosed, and cannot exceed the card-issuer late-fee limits (historically $29 first / $40 subsequent; the $8 cap rule has been in litigation and its status is uncertain). **[Unverified lead]** The CFPB under new leadership has moved to rescind the BNPL interpretive rule, so the governing framework for pay-in-4 late fees is genuinely unsettled as of this research pass. **[Unverified lead]** Until the current status of the interpretive rule and the late-fee-cap litigation is confirmed, any pay-in-4 late fee should be designed to the stricter of the plausible regimes (card-style limits with a 21-day grace period) or deferred. **[Generated analysis]**

If the pay-in-4 product is originated by an FDIC-insured bank partner, federal preemption may apply to the originating bank's charges, but state UDAP/UDAAP theories and state licensing regimes (notably California DFPI's treatment of BNPL under the California Financing Law and New York's BNPL licensing law) may still reach the program. **[Unverified lead]** The true-lender analysis for pay-in-4 is therefore a gating item, not a footnote. **[Generated analysis]**

### 2. Grace period and reminders

Under the card-style framework, a 21-day grace period before any late fee is the safe harbor. **[Unverified lead]** State installment-loan analogs vary; some states require written notice of default before a fee may be charged. **[Unverified lead]** The proposed pre-fee reminders are consistent with, and likely exceed, minimum requirements, but the specific timing and form must be mapped per state before launch. **[Generated analysis]** The proposed grace-period length has not been supplied. **[Missing fact]**

### 3. Disclosures

If the interpretive rule framework applies, Reg Z periodic-statement analogs may apply to pay-in-4, meaning the fee amount, trigger, and timing must appear in the loan agreement, at checkout before acceptance, in the app, and in account history. **[Unverified lead]** Northstar Pay's risk posture independently requires clear pre-acceptance disclosure of amounts due, dates, fees, and conditions, so the company standard is at least as demanding as the likely legal floor. **[Supplied]**

### 4. First-fee waiver

A first-late-fee waiver with objective, documented, automated criteria (e.g., first occurrence, account in good standing, autopay enrollment) is generally permissible and low-risk. **[Unverified lead]** Discretionary or inconsistently applied waivers create disparate-treatment (fair-lending) and UDAAP consistency risk. **[Unverified lead]** The proposed waiver criteria have not been supplied. **[Missing fact]**

### 5. Failed payments and returned-payment fees

Late fees and returned-payment/NSF fees are distinct charges under both federal and state law; charging both for a single missed payment event is a common complaint driver and a UDAAP risk. **[Unverified lead]** Card-network rules may constrain card-recovery fees. **[Unverified lead]** Which payment methods are in scope and whether a separate NSF fee is proposed are unknown. **[Missing fact]**

### 6. Credit reporting and collections

If credit reporting is enabled for pay-in-4, late fees included in the reported balance must be accurate, with FCRA furnisher accuracy and dispute duties (Reg V) applying. **[Unverified lead]** Collection referrals of fee-inclusive balances must comply with the FDCPA for third-party collectors and state collections statutes. **[Unverified lead]** Whether pay-in-4 late fees will be credit-reported or included in collection balances has not been decided. **[Missing fact]**

---

## Part II — Longer-Term Installments

### 1. Permissible fee amounts and state variation

Longer-term installments are closed-end installment loans governed state-by-state under the applicable licensing regime: California Financing Law fee caps; Texas OCCC fee schedules; the Illinois Predatory Loan Prevention Act's 36% all-in cap (whether late fees count toward the cap materially changes the analysis); New York licensed-lender rules; the Georgia Installment Loan Act; and Colorado and Washington consumer-loan statutes. **[Unverified lead — each state's specific late-fee/returned-payment provision must be pulled for the actual lending partner and license type before reliance.]** The approved state and partner list for longer-term installments is smaller than the pay-in-4 list and still being finalized. **[Supplied]**

### 2. True-lender and preemption

Whether the bank-partner structure imports the bank's home-state rates (valid-when-made doctrine, and Madden issues in New York) is a threshold question in each state. **[Unverified lead]** Because different partners are used by product and state, and the responsible entity, servicing vendor, and contract terms may differ, the fee analysis cannot be finalized until the state/partner matrix is confirmed. **[Supplied]**

### 3. Grace period, notices, and disclosures

State installment-loan laws vary on grace periods and pre-fee default notices; some require written notice before a fee accrues. **[Unverified lead]** Disclosures of the fee amount, trigger, and timing must appear in the loan agreement, at checkout, in the app, and in account history, and the disclosed fee must match the configured fee logic exactly. **[Generated analysis, consistent with the company's customer-clarity posture — Supplied]**

### 4. Waivers, failed payments, reporting, and collections

The fair-lending/UDAAP analysis of waiver criteria and the late-fee/NSF-fee distinction described for pay-in-4 apply equally here. **[Unverified lead]** For longer-term loans, late fees generally may be included in the balance due and, where reporting is enabled, must be accurately furnished under FCRA/Reg V; collection referrals must comply with FDCPA and state collections statutes. **[Unverified lead]** Partner contracts must be confirmed to allocate fee ownership and reporting responsibility. **[Missing fact]**

---

## Part III — Cross-Cutting Implementation Controls

Regardless of the fee structure chosen, the controls needed to prevent incorrect charging are: a state/product/partner fee-configuration matrix; fee-calculation and waiver logic tested against that matrix; a refund/reversal workflow; complaint monitoring tagged to late fees; audit logs; and a pre-launch reconciliation proving that the disclosed fee equals the charged fee in every state/product/partner combination. **[Generated analysis]** The proposed fee amounts, grace-period length, waiver criteria, payment methods in scope, and release date are all still missing from Product. **[Missing fact]**

---

## Facts That Could Change the Answer

- The rescission or litigation outcome on the CFPB BNPL interpretive rule and the credit-card late-fee cap rule. **[Unverified lead]**
- The finalized longer-term installment state/partner list and whether the true-lender structure supports preemption in each state. **[Missing fact]**
- Whether late fees count toward rate caps, especially Illinois's 36% PLPA cap. **[Unverified lead]**
- Whether fees will be credit-reported or referred to collections with balances. **[Missing fact]**
- Proposed fee amounts and grace-period length versus state minimums. **[Missing fact]**

## Last-Mile Verification for Counsel

1. Confirm the current status of the CFPB BNPL interpretive rule and the late-fee-cap litigation before finalizing pay-in-4 fees.
2. Pull the specific late-fee and returned-payment provisions of each live state's applicable statute and regulation for the actual lending partner and license type (CA CFL/DFPI, NY licensed lender plus BNPL law, IL PLPA, TX OCCC, CO, GA, WA).
3. Confirm the state/partner matrix with operations and each lending partner before any fee schedule is locked.
4. Have compliance test the fee-configuration and waiver logic against the final matrix, and document the waiver criteria for fair-lending consistency.

**Provenance note:** This packet is a first-pass analysis built from the matter files and generated legal analysis. No external sources were searched and no citations have been verified. All state-law and CFPB-rule statements are unverified leads until the last-mile verification above is completed.
