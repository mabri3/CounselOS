---
work_product_id: WP-91b3ba21dcb5
matter_id: MAT-20260902-a607f7
title: Instant Payouts Before Settlement — Legal Analysis and Pilot Recommendation
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T06:40:52+00:00'
updated_at: '2026-09-02T06:40:52+00:00'
immutable: false
source_action_key: chat:RUN-20260902-0965ec:tool:3dab3f7f1c9d03e6a02ca5c0
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Instant Payouts Before Funds Are Fully Settled — Legal Analysis and Pilot
      Recommendation


      **Matter:** Juniper Ledger UX Test — 03 — Instant Payouts Before Funds Are Fully
      Settled

      **Prepared by:** Themis.ai (workspace guidance), for legal review

      **Status:** Draft for review — research runs pending

      **Privilege:** Privileged and confidential / attorney work product


      ---


      ## 1. Executive Recommendation


      **Recommendation: Hold the pilot until the four core mechanics are decided and
      Cedar Harbor Bank, N.A. approves the feature.**


      The proposed instant-payout feature is legally consequential because it changes
      *who holds the money and who bears the credit risk* during the gap between card
      acceptance and settlement. The single most important decision is the **legal
      characterization of the reserve/advance** — whether the feature is (a) a settlement/hold
      on the merchant''s own unsettled proceeds, or (b) a loan or advance funded by
      Juniper Ledger''s own capital. That characterization drives everything downstream:
      money-transmission exposure, lending/credit licensing, UDAAP risk, merchant
      agreement terms, disclosures, reserve and collection practices, and sponsor-bank
      approvals.


      Because the four core mechanics (characterization, funding source, liability
      period, and collection) are all undetermined, and because Cedar Harbor has not
      yet been engaged, the pilot **should not launch on the assumed October 15, 2026
      date** until those items are resolved and the sponsor bank approves. This is
      a recommendation for the lawyer to consider; it is not a recorded decision.


      ---


      ## 2. Legal Characterization: Hold vs. Loan/Advance


      > **Label: Analysis.** This section is legal analysis based on the requester
      facts. It is not a recorded decision.


      ### 2.1 The two candidate structures


      **Option A — Settlement/hold on unsettled proceeds.** Juniper Ledger makes available
      funds that are the merchant''s *own* card-acceptance proceeds, which are already
      owed to the merchant but not yet settled. The "reserve" is a hold on those proceeds
      to cover chargebacks, refunds, reversals, and network adjustments. Juniper Ledger
      is not advancing its own capital; it is accelerating the merchant''s access
      to money the merchant has already earned. The credit risk stays with the merchant
      (their proceeds are the source of repayment).


      **Option B — Loan/advance of Juniper Ledger''s own capital.** Juniper Ledger
      pays the merchant *before* the proceeds exist or are sufficient, using Juniper
      Ledger''s own funds, and is later repaid from the merchant''s future proceeds.
      Here Juniper Ledger bears the credit risk if the merchant''s proceeds are insufficient,
      and the merchant owes Juniper Ledger a debt.


      ### 2.2 Why the distinction matters


      The distinction is not cosmetic. It determines:


      - **Money transmission exposure.** If Juniper Ledger is merely holding and settling
      the merchant''s own proceeds, it is operating within the settlement/payment-processing
      function. If Juniper Ledger is taking in and moving funds in a way that constitutes
      receiving money for transmission, it may trigger state money-transmission licensing.
      The structure must be analyzed against each state''s money-transmission definition
      and the relevant exemptions (e.g., the "delayed delivery" or settlement exemptions).

      - **Lending/credit licensing.** If the feature is a loan or advance of Juniper
      Ledger''s own capital with a fee, it may constitute a loan or credit product
      requiring lending licenses, and the fee may be characterized as interest. This
      implicates state lending laws, usury limits, and possibly the federal Truth
      in Lending Act (TILA) and Regulation Z if the product is consumer credit (here,
      merchants are businesses, so commercial-lending rules and state commercial-financing
      disclosure laws may apply instead).

      - **UDAAP exposure.** Regardless of structure, the fee, timing, reserve, and
      suspension terms must be clearly and accurately disclosed to avoid unfair, deceptive,
      or abusive acts or practices.


      ### 2.3 Key facts that will drive the characterization


      The following facts are undetermined and are **material** to the characterization:


      1. **Who funds the payout before settlement?** If Juniper Ledger''s own capital
      funds it, that points toward a loan/advance. If it is funded from the merchant''s
      own accrued-but-unsettled proceeds, it points toward a settlement/hold.

      2. **Who bears the credit risk if proceeds are insufficient?** If Juniper Ledger
      bears it, that is a hallmark of a loan/advance. If the merchant bears it (via
      the reserve and future-proceeds debits), it is closer to a settlement feature.

      3. **How is the fee structured?** A flat service fee for accelerated settlement
      is more consistent with a settlement feature; a fee that scales with time or
      amount and functions as compensation for the use of money points toward credit.

      4. **How long does merchant liability persist, and how are negative balances
      collected?** A defined repayment obligation with collection mechanics is characteristic
      of a loan.


      ### 2.4 Working view


      **Working view (analysis, not a decision):** The structure most likely to minimize
      regulatory exposure is **Option A — a settlement/hold on the merchant''s own
      unsettled proceeds**, where Juniper Ledger accelerates access to proceeds the
      merchant has already earned, the reserve is a hold on those proceeds, and the
      merchant bears the credit risk. This avoids lending-license and money-transmission
      triggers that a loan/advance of Juniper Ledger''s own capital would raise.


      However, this working view **depends on the undetermined facts above**. If Juniper
      Ledger funds the payout from its own capital and bears the credit risk, the
      feature is more likely a loan/advance and must be treated as a credit product.
      **This is the pivotal decision Juniper Ledger must make before the pilot.**


      ---


      ## 3. Merchant Agreement Terms and Disclosures


      > **Label: Analysis.** Required terms and disclosures based on the requester
      facts; subject to confirmation of the characterization.


      The merchant agreement and in-flow disclosures must cover, at minimum:


      - **Fee.** The estimated fee and how it is calculated (flat vs. percentage vs.
      time-based), shown before the merchant confirms.

      - **Timing.** When funds are made available, when settlement occurs, and any
      delay or suspension.

      - **Reserve.** A clear explanation of the reserve — what it is, how it is sized,
      what it covers (chargebacks, refunds, reversals, network adjustments), and how
      and when it is released.

      - **Risk allocation.** Who bears the credit risk if proceeds are insufficient,
      and the merchant''s liability for chargebacks, refunds, reversals, and network
      adjustments.

      - **Liability period.** How long the merchant remains liable after payout for
      these items.

      - **Payout suspension.** The criteria under which Juniper Ledger may suspend
      payouts (e.g., increased fraud risk), and how the merchant is notified.

      - **Negative-balance collection.** How negative balances are collected if the
      reserve or account is insufficient.

      - **Optionality.** Confirmation that the service is optional and does not change
      the merchant''s underlying settlement rights.


      **UDAAP note:** All of these must be disclosed clearly and accurately before
      the merchant confirms. The proposed flow (showing an estimated fee and reserve
      explanation before confirmation) is a good start, but the disclosures must be
      complete and not misleading, particularly around the reserve, the liability
      period, and suspension criteria.


      ---


      ## 4. Reserve and Collection Practices


      > **Label: Analysis.** Permissible practices; subject to confirmation of the
      characterization and card-network rules.


      - **Reserve sizing.** The reserve should be sized based on merchant history
      and fraud signals, as proposed. It should be documented and applied consistently
      to avoid UDAAP risk.

      - **Debiting the reserve.** Juniper Ledger may debit the reserve or account
      for chargebacks, refunds, reversals, and network adjustments, consistent with
      the merchant agreement and card-network rules.

      - **Negative-balance collection.** If the reserve or account is insufficient,
      collection must be governed by the merchant agreement and must comply with applicable
      debt-collection rules. The collection mechanism (debit from future proceeds,
      ACH, invoice, etc.) must be disclosed and agreed in advance.

      - **Liability period.** The merchant''s liability period must be defined and
      disclosed. It should align with the chargeback and network-adjustment windows.

      - **Card-network rules.** The reserve and collection practices must comply with
      the applicable card-network rules (e.g., Visa, Mastercard) governing merchant
      reserves, chargebacks, and settlement.


      ---


      ## 5. Sponsor-Bank Approvals and Oversight


      > **Label: Analysis.** Cedar Harbor has not yet been engaged; program-agreement
      requirements are undetermined.


      - **Cedar Harbor is not yet engaged.** The program-agreement requirements for
      this feature still need to be determined.

      - **Program-agreement implications.** Because Cedar Harbor is the named bank
      for deposit accounts and payment rails, the instant-payout feature likely requires
      Cedar Harbor''s approval under the program-management and banking-services agreement.
      The feature changes how funds flow and who holds them, which is material to
      the bank''s oversight obligations.

      - **Bank-partner oversight.** Juniper Ledger''s conservative posture for regulated
      activity (documented controls, escalation, human review) should extend to this
      feature, and Cedar Harbor''s compliance and risk teams should review the reserve,
      settlement, and collection mechanics.

      - **Required approvals.** Before the pilot, Juniper Ledger should obtain Cedar
      Harbor''s written approval of the feature, including the characterization, reserve
      mechanics, and any program-agreement amendments.


      ---


      ## 6. Decisions Required Before Pilot Approval


      > **Label: Analysis.** These are the decisions Juniper Ledger must make; none
      are recorded decisions.


      Before the pilot can be approved, Juniper Ledger must decide:


      1. **Characterization** — Is the reserve/advance a hold on unsettled proceeds,
      a loan/advance of Juniper Ledger''s own capital, or another structure?

      2. **Funding source** — Who funds the payout before settlement, and who bears
      the credit risk if proceeds are insufficient?

      3. **Liability period** — How long do merchants remain liable after payout for
      chargebacks, refunds, reversals, and network adjustments?

      4. **Collection mechanics** — How are negative balances collected if the reserve
      or account is insufficient?

      5. **Disclosures** — Finalize the fee, timing, reserve, risk-allocation, and
      suspension disclosures.

      6. **Sponsor-bank approval** — Obtain Cedar Harbor''s written approval under
      the program agreement.


      Until items 1–4 are decided and item 6 is obtained, the pilot should be held.


      ---


      ## 7. Assumptions, Missing Facts, and Unverified Leads


      > **Label: Analysis.** These are assumptions and open items, not recorded decisions.


      ### Assumptions

      - Pilot scope assumed: launch October 15, 2026; 10 established merchants; $25,000
      per-payout cap; $100,000 aggregate daily cap. **Subject to change after compliance
      and sponsor-bank review.**

      - The service is optional for merchants.

      - Juniper Ledger may suspend payouts when fraud risk increases.


      ### Missing facts (material, undetermined)

      - Characterization of the reserve/advance (hold vs. loan vs. other).

      - Who funds the payout before settlement, and who bears the credit risk.

      - How long merchants remain liable after payout.

      - How negative balances are collected.

      - Cedar Harbor program-agreement requirements (bank not yet engaged).

      - Fee structure and calculation.

      - Card-network rules applicable to the reserve and settlement.


      ### Unverified leads (preserved pending research)

      - Whether the feature triggers state money-transmission licensing or qualifies
      for a settlement exemption.

      - Whether the fee constitutes interest or a service fee for lending/credit purposes.

      - Applicable state commercial-financing disclosure laws.

      - Specific card-network reserve and chargeback rules.

      - Cedar Harbor''s program-agreement approval requirements.


      ---


      ## 8. Status of Research


      Two first-pass research runs were initiated (legal characterization of the reserve/advance;
      Cedar Harbor sponsor-bank approvals). **Both remain queued/running and have
      not yet produced memos.** This draft is a best-effort work product prepared
      from the requester facts and should be updated when the research memos land.
      The pending research status is preserved as evidence in the matter record.

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
# Instant Payouts Before Funds Are Fully Settled — Legal Analysis and Pilot Recommendation

**Matter:** Juniper Ledger UX Test — 03 — Instant Payouts Before Funds Are Fully Settled
**Prepared by:** Themis.ai (workspace guidance), for legal review
**Status:** Draft for review — research runs pending
**Privilege:** Privileged and confidential / attorney work product

---

## 1. Executive Recommendation

**Recommendation: Hold the pilot until the four core mechanics are decided and Cedar Harbor Bank, N.A. approves the feature.**

The proposed instant-payout feature is legally consequential because it changes *who holds the money and who bears the credit risk* during the gap between card acceptance and settlement. The single most important decision is the **legal characterization of the reserve/advance** — whether the feature is (a) a settlement/hold on the merchant's own unsettled proceeds, or (b) a loan or advance funded by Juniper Ledger's own capital. That characterization drives everything downstream: money-transmission exposure, lending/credit licensing, UDAAP risk, merchant agreement terms, disclosures, reserve and collection practices, and sponsor-bank approvals.

Because the four core mechanics (characterization, funding source, liability period, and collection) are all undetermined, and because Cedar Harbor has not yet been engaged, the pilot **should not launch on the assumed October 15, 2026 date** until those items are resolved and the sponsor bank approves. This is a recommendation for the lawyer to consider; it is not a recorded decision.

---

## 2. Legal Characterization: Hold vs. Loan/Advance

> **Label: Analysis.** This section is legal analysis based on the requester facts. It is not a recorded decision.

### 2.1 The two candidate structures

**Option A — Settlement/hold on unsettled proceeds.** Juniper Ledger makes available funds that are the merchant's *own* card-acceptance proceeds, which are already owed to the merchant but not yet settled. The "reserve" is a hold on those proceeds to cover chargebacks, refunds, reversals, and network adjustments. Juniper Ledger is not advancing its own capital; it is accelerating the merchant's access to money the merchant has already earned. The credit risk stays with the merchant (their proceeds are the source of repayment).

**Option B — Loan/advance of Juniper Ledger's own capital.** Juniper Ledger pays the merchant *before* the proceeds exist or are sufficient, using Juniper Ledger's own funds, and is later repaid from the merchant's future proceeds. Here Juniper Ledger bears the credit risk if the merchant's proceeds are insufficient, and the merchant owes Juniper Ledger a debt.

### 2.2 Why the distinction matters

The distinction is not cosmetic. It determines:

- **Money transmission exposure.** If Juniper Ledger is merely holding and settling the merchant's own proceeds, it is operating within the settlement/payment-processing function. If Juniper Ledger is taking in and moving funds in a way that constitutes receiving money for transmission, it may trigger state money-transmission licensing. The structure must be analyzed against each state's money-transmission definition and the relevant exemptions (e.g., the "delayed delivery" or settlement exemptions).
- **Lending/credit licensing.** If the feature is a loan or advance of Juniper Ledger's own capital with a fee, it may constitute a loan or credit product requiring lending licenses, and the fee may be characterized as interest. This implicates state lending laws, usury limits, and possibly the federal Truth in Lending Act (TILA) and Regulation Z if the product is consumer credit (here, merchants are businesses, so commercial-lending rules and state commercial-financing disclosure laws may apply instead).
- **UDAAP exposure.** Regardless of structure, the fee, timing, reserve, and suspension terms must be clearly and accurately disclosed to avoid unfair, deceptive, or abusive acts or practices.

### 2.3 Key facts that will drive the characterization

The following facts are undetermined and are **material** to the characterization:

1. **Who funds the payout before settlement?** If Juniper Ledger's own capital funds it, that points toward a loan/advance. If it is funded from the merchant's own accrued-but-unsettled proceeds, it points toward a settlement/hold.
2. **Who bears the credit risk if proceeds are insufficient?** If Juniper Ledger bears it, that is a hallmark of a loan/advance. If the merchant bears it (via the reserve and future-proceeds debits), it is closer to a settlement feature.
3. **How is the fee structured?** A flat service fee for accelerated settlement is more consistent with a settlement feature; a fee that scales with time or amount and functions as compensation for the use of money points toward credit.
4. **How long does merchant liability persist, and how are negative balances collected?** A defined repayment obligation with collection mechanics is characteristic of a loan.

### 2.4 Working view

**Working view (analysis, not a decision):** The structure most likely to minimize regulatory exposure is **Option A — a settlement/hold on the merchant's own unsettled proceeds**, where Juniper Ledger accelerates access to proceeds the merchant has already earned, the reserve is a hold on those proceeds, and the merchant bears the credit risk. This avoids lending-license and money-transmission triggers that a loan/advance of Juniper Ledger's own capital would raise.

However, this working view **depends on the undetermined facts above**. If Juniper Ledger funds the payout from its own capital and bears the credit risk, the feature is more likely a loan/advance and must be treated as a credit product. **This is the pivotal decision Juniper Ledger must make before the pilot.**

---

## 3. Merchant Agreement Terms and Disclosures

> **Label: Analysis.** Required terms and disclosures based on the requester facts; subject to confirmation of the characterization.

The merchant agreement and in-flow disclosures must cover, at minimum:

- **Fee.** The estimated fee and how it is calculated (flat vs. percentage vs. time-based), shown before the merchant confirms.
- **Timing.** When funds are made available, when settlement occurs, and any delay or suspension.
- **Reserve.** A clear explanation of the reserve — what it is, how it is sized, what it covers (chargebacks, refunds, reversals, network adjustments), and how and when it is released.
- **Risk allocation.** Who bears the credit risk if proceeds are insufficient, and the merchant's liability for chargebacks, refunds, reversals, and network adjustments.
- **Liability period.** How long the merchant remains liable after payout for these items.
- **Payout suspension.** The criteria under which Juniper Ledger may suspend payouts (e.g., increased fraud risk), and how the merchant is notified.
- **Negative-balance collection.** How negative balances are collected if the reserve or account is insufficient.
- **Optionality.** Confirmation that the service is optional and does not change the merchant's underlying settlement rights.

**UDAAP note:** All of these must be disclosed clearly and accurately before the merchant confirms. The proposed flow (showing an estimated fee and reserve explanation before confirmation) is a good start, but the disclosures must be complete and not misleading, particularly around the reserve, the liability period, and suspension criteria.

---

## 4. Reserve and Collection Practices

> **Label: Analysis.** Permissible practices; subject to confirmation of the characterization and card-network rules.

- **Reserve sizing.** The reserve should be sized based on merchant history and fraud signals, as proposed. It should be documented and applied consistently to avoid UDAAP risk.
- **Debiting the reserve.** Juniper Ledger may debit the reserve or account for chargebacks, refunds, reversals, and network adjustments, consistent with the merchant agreement and card-network rules.
- **Negative-balance collection.** If the reserve or account is insufficient, collection must be governed by the merchant agreement and must comply with applicable debt-collection rules. The collection mechanism (debit from future proceeds, ACH, invoice, etc.) must be disclosed and agreed in advance.
- **Liability period.** The merchant's liability period must be defined and disclosed. It should align with the chargeback and network-adjustment windows.
- **Card-network rules.** The reserve and collection practices must comply with the applicable card-network rules (e.g., Visa, Mastercard) governing merchant reserves, chargebacks, and settlement.

---

## 5. Sponsor-Bank Approvals and Oversight

> **Label: Analysis.** Cedar Harbor has not yet been engaged; program-agreement requirements are undetermined.

- **Cedar Harbor is not yet engaged.** The program-agreement requirements for this feature still need to be determined.
- **Program-agreement implications.** Because Cedar Harbor is the named bank for deposit accounts and payment rails, the instant-payout feature likely requires Cedar Harbor's approval under the program-management and banking-services agreement. The feature changes how funds flow and who holds them, which is material to the bank's oversight obligations.
- **Bank-partner oversight.** Juniper Ledger's conservative posture for regulated activity (documented controls, escalation, human review) should extend to this feature, and Cedar Harbor's compliance and risk teams should review the reserve, settlement, and collection mechanics.
- **Required approvals.** Before the pilot, Juniper Ledger should obtain Cedar Harbor's written approval of the feature, including the characterization, reserve mechanics, and any program-agreement amendments.

---

## 6. Decisions Required Before Pilot Approval

> **Label: Analysis.** These are the decisions Juniper Ledger must make; none are recorded decisions.

Before the pilot can be approved, Juniper Ledger must decide:

1. **Characterization** — Is the reserve/advance a hold on unsettled proceeds, a loan/advance of Juniper Ledger's own capital, or another structure?
2. **Funding source** — Who funds the payout before settlement, and who bears the credit risk if proceeds are insufficient?
3. **Liability period** — How long do merchants remain liable after payout for chargebacks, refunds, reversals, and network adjustments?
4. **Collection mechanics** — How are negative balances collected if the reserve or account is insufficient?
5. **Disclosures** — Finalize the fee, timing, reserve, risk-allocation, and suspension disclosures.
6. **Sponsor-bank approval** — Obtain Cedar Harbor's written approval under the program agreement.

Until items 1–4 are decided and item 6 is obtained, the pilot should be held.

---

## 7. Assumptions, Missing Facts, and Unverified Leads

> **Label: Analysis.** These are assumptions and open items, not recorded decisions.

### Assumptions
- Pilot scope assumed: launch October 15, 2026; 10 established merchants; $25,000 per-payout cap; $100,000 aggregate daily cap. **Subject to change after compliance and sponsor-bank review.**
- The service is optional for merchants.
- Juniper Ledger may suspend payouts when fraud risk increases.

### Missing facts (material, undetermined)
- Characterization of the reserve/advance (hold vs. loan vs. other).
- Who funds the payout before settlement, and who bears the credit risk.
- How long merchants remain liable after payout.
- How negative balances are collected.
- Cedar Harbor program-agreement requirements (bank not yet engaged).
- Fee structure and calculation.
- Card-network rules applicable to the reserve and settlement.

### Unverified leads (preserved pending research)
- Whether the feature triggers state money-transmission licensing or qualifies for a settlement exemption.
- Whether the fee constitutes interest or a service fee for lending/credit purposes.
- Applicable state commercial-financing disclosure laws.
- Specific card-network reserve and chargeback rules.
- Cedar Harbor's program-agreement approval requirements.

---

## 8. Status of Research

Two first-pass research runs were initiated (legal characterization of the reserve/advance; Cedar Harbor sponsor-bank approvals). **Both remain queued/running and have not yet produced memos.** This draft is a best-effort work product prepared from the requester facts and should be updated when the research memos land. The pending research status is preserved as evidence in the matter record.
