---
work_product_id: WP-41ce6f357c6a
matter_id: MAT-20260903-df8c06
title: First-Pass Legal Analysis — Deactivation of a High-Risk Merchant
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T09:13:46+00:00'
updated_at: '2026-09-03T09:13:46+00:00'
immutable: false
source_action_key: chat:RUN-20260903-270861:tool:9711be99d01f784662ff7db9
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# First-Pass Legal Analysis — Deactivation of a High-Risk Merchant


      **Matter:** Mosaic Relay UX Test — 04 — Deactivation of a High-Risk Merchant

      **Status:** First-pass analysis (draft for review)

      **Prepared for:** Jordan Lee, Senior Product Counsel

      **Prepared by:** Themis.ai (workspace guidance)

      **Date:** 2026-09-03


      ---


      ## How to read this memo


      This is a **developed first-pass analysis**, not a final legal opinion. It is
      organized so that **supplied facts, assumptions, generated analysis, and unverified
      authorities are clearly labeled** throughout. The background research run is
      still completing; the regulatory citations below are identified as **likely
      material** from the general U.S. framework but have **not been independently
      verified against current primary sources** unless marked otherwise. Every citation
      is labeled **[UNVERIFIED]** and must be confirmed before this memo carries a
      final recommendation.


      This memo draws on two prior Mosaic Relay first-pass analyses already in the
      vault: the **Baseline KYB/KYC, Sanctions Screening, and BSA/AML Onboarding Requirements**
      memo (Matter 01) and the **Payment Holds During Fraud Review** memo (Matter
      03). Those are labeled **[SUPPLIED SOURCE — PRIOR MATTER]** where relied on.


      ---


      ## 1. Executive summary


      **[GENERATED ANALYSIS]** Immediate suspension of the merchant is **likely justified
      as a discretionary, risk-based action** — but not yet as a *mandatory* blocking
      obligation, because the unresolved sanctions alert has not been confirmed as
      a true OFAC SDN match and the high-risk country has not been identified as OFAC-sanctioned.
      The lawful path turns on five conditions that must be resolved before execution:


      1. **Confirm the SAR posture first.** Whether a SAR has been filed or is being
      considered directly controls what Mosaic Relay may tell the merchant (anti-tipping
      under 31 U.S.C. § 5318(g)(2)). **[UNVERIFIED]** This is the single most decision-changing
      unknown and must be resolved before any merchant-facing communication is drafted.

      2. **Confirm the unresolved alert and the high-risk country.** If the alert
      is a true OFAC SDN match, or the country is comprehensively sanctioned, suspension
      becomes a **mandatory blocking obligation** and the analysis shifts. As of intake,
      both are unresolved, so suspension is currently discretionary.

      3. **Confirm the merchant agreement''s terms on pending funds, notice timing,
      and post-termination access.** The general right to suspend for risk/compliance
      concerns is confirmed, but the specifics are not. This governs how Mosaic Relay
      must handle pending refunds and payouts.

      4. **Confirm the amount, aging, and status of pending refunds and payouts, and
      any reserve/hold authority.** Pending customer refunds are potentially time-sensitive
      consumer obligations; seller payouts are pending funds subject to processor,
      network, contractual, and applicable-law requirements.

      5. **Confirm processor and acquiring-partner acceptance** of the suspension,
      payout block, and any reversal mechanics.


      **[GENERATED ANALYSIS]** The single most decision-changing unknown is **SAR
      posture**, because it determines what Mosaic Relay may lawfully communicate
      to the merchant — and a misstep (tipping) is a criminal exposure under the BSA,
      not merely a contract or reputational issue. The second most decision-changing
      unknown is the **unresolved alert / high-risk country**, because it determines
      whether suspension is mandatory or discretionary.


      **[GENERATED ANALYSIS]** The ten-business-day timeline is **tight but workable**
      for the decision, provided the SAR posture and the unresolved alert are resolved
      early. If the SAR posture cannot be confirmed, Mosaic Relay should suspend with
      a **minimal, non-tipping notice** and preserve records, rather than delay the
      suspension itself.


      ---


      ## 2. Scope and assumptions


      ### 2.1 Scope


      **[SUPPLIED FACT]** Risk operations recommends deactivating a Mosaic Relay merchant
      after repeated sanctions-screening alerts, rapid volume growth, and transactions
      involving a newly identified high-risk country. The proposed operation immediately
      blocks new payments and payouts, preserves relevant records, and sends the merchant
      a short notice stating access is suspended under the agreement. A later review
      would decide whether to terminate the relationship or restore service. Operations
      wants a decision within ten business days.


      **[SUPPLIED FACT]** Two sanctions-screening alerts were false positives; one
      alert remains unresolved. The merchant has pending customer refunds and seller
      payouts. The contract includes a general right to suspend service for risk or
      compliance concerns.


      **[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved
      and materially affect this analysis:

      - **SAR posture: NOT DETERMINED.** Whether a SAR has been filed or is being
      considered is unknown. This controls what Mosaic Relay may tell the merchant.

      - **Unresolved alert: STILL UNDER REVIEW.** Whether it is a true OFAC SDN match
      or a false positive is not determined.

      - **High-risk country: NOT IDENTIFIED.** Which country, and whether it is OFAC-sanctioned
      or merely high-risk for AML, is unknown.

      - **Merchant agreement specifics: NOT CONFIRMED.** Terms on pending funds, notice
      timing, and post-termination access are unverified; only the general suspension
      right is confirmed.

      - **Pending funds detail: NOT PROVIDED.** Amounts, aging, status, reserve/hold
      authority, and deadlines for refunds and payouts are unconfirmed.


      ### 2.2 Assumptions


      **[ASSUMPTION]** The following are working assumptions, not established facts:

      - **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United
      States in this scenario; any non-U.S. expansion is subject to separate legal
      review. This memo analyzes U.S. federal obligations only.

      - **A2 — MSB classification.** Mosaic Relay is classified as a money services
      business (MSB) under FinCEN regulations and is subject to BSA/AML program and
      SAR obligations. **[UNVERIFIED]** If Mosaic Relay is not an MSB, the BSA/AML
      analysis changes, though partner and processor requirements would still apply.

      - **A3 — Discretionary, not mandatory.** Because the unresolved alert is not
      yet confirmed as a true OFAC SDN match and the high-risk country is not identified
      as OFAC-sanctioned, immediate suspension is currently a **discretionary risk-based
      action** rather than a mandatory blocking obligation.

      - **A4 — Merchant agreement is the primary contractual basis.** The merchant
      agreement''s general suspension right is the lawful basis for the action; its
      specific terms on pending funds, notice, and post-termination access are unverified.

      - **A5 — Partner and network requirements apply.** Acquiring banks, processors,
      and card networks impose their own rules on suspension, payout blocks, and reversals
      that must be reconciled. The exact terms have not been reviewed.


      ---


      ## 3. Analysis by workstream


      ### 3.1 Is immediate suspension justified?


      **[GENERATED ANALYSIS]** Immediate suspension is **likely justified as a discretionary,
      risk-based action** under the merchant agreement''s general right to suspend
      for risk or compliance concerns, provided the decision is documented and the
      risk rationale is sound. The combination of repeated sanctions-screening alerts
      (even with two false positives), rapid volume growth, and transactions involving
      a newly identified high-risk country is a legitimate basis for a risk-based
      suspension while the unresolved alert is investigated.


      **[GENERATED ANALYSIS]** However, suspension is **not yet a mandatory blocking
      obligation** because:

      - The unresolved alert is **not confirmed as a true OFAC SDN match**; and

      - The high-risk country is **not identified as OFAC-sanctioned**.


      **[GENERATED ANALYSIS]** If either condition is later confirmed (true SDN match,
      or comprehensively sanctioned jurisdiction), the analysis shifts: Mosaic Relay
      would have a **mandatory obligation to block** transactions and would be prohibited
      from processing or paying out to the sanctioned party, and the notice to the
      merchant would be constrained by OFAC''s blocking requirements. **[UNVERIFIED
      — OFAC blocking obligation]**


      **[GENERATED ANALYSIS]** The decision to suspend should be **documented** with
      a written risk assessment recording: the alerts and their disposition, the volume
      growth, the high-risk country, the reason suspension is warranted, and the basis
      for treating it as discretionary (not mandatory) at this stage. This supports
      auditability and defensibility.


      **[GENERATED ANALYSIS]** The ten-business-day timeline is workable for the decision,
      but the **suspension itself should not be delayed** pending the full review.
      Blocking new payments and payouts now, while preserving records, is the lower-risk
      path; the later review decides termination vs. restoration.


      ### 3.2 What communications to the merchant are permitted?


      **[GENERATED ANALYSIS]** This is the most sensitive workstream because of **SAR
      confidentiality / anti-tipping**. If a SAR has been filed or is being considered,
      Mosaic Relay is generally **prohibited from notifying the merchant** that a
      SAR has been filed, and from disclosing information that would reveal the existence
      of a SAR. **[UNVERIFIED AUTHORITY — 31 U.S.C. § 5318(g)(2) anti-tipping]**


      **[SUPPLIED FACT — UNRESOLVED]** Whether a SAR has been filed or is being considered
      is **unknown**. This must be resolved before any merchant-facing communication
      is drafted.


      **[GENERATED ANALYSIS]** Two paths depending on SAR posture:

      - **If a SAR is filed or contemplated:** The suspension notice must be **minimal
      and non-tipping** — it should state only that access is suspended under the
      agreement, without referencing the SAR, the sanctions screening, or the reason
      tied to the SAR. Mosaic Relay should not disclose that a SAR was or may be filed.
      The notice should be reviewed by compliance and legal before sending.

      - **If no SAR is filed or contemplated:** Mosaic Relay has more latitude to
      explain the reason for suspension (e.g., risk/compliance review), but should
      still avoid over-disclosing internal risk methodology or screening details.


      **[GENERATED ANALYSIS]** Regardless of SAR posture, the notice should be **plain-language**
      and should state: (a) access is suspended under the agreement; (b) new payments
      and payouts are blocked; (c) how the merchant can contact support; and (d) that
      a review will determine next steps. It should **not** disclose internal risk
      methodology, screening thresholds, or any SAR-related information.


      **[GENERATED ANALYSIS]** The proposed "short notice stating access is suspended
      under the agreement" is the **right shape** — it is minimal and non-tipping.
      Mosaic Relay should not expand it to explain the sanctions alerts or the high-risk
      country until the SAR posture is confirmed.


      ### 3.3 How to handle pending customer refunds and seller payouts?


      **[SUPPLIED FACT]** The merchant has pending customer refunds and seller payouts.
      Amounts and transaction-level details were not provided.


      **[SUPPLIED FACT — UNRESOLVED]** Amounts, aging, status, reserve or hold authority,
      and any deadlines are unconfirmed. Risk, finance, and support must confirm these
      before execution.


      **[GENERATED ANALYSIS]** Pending funds must be handled carefully because they
      are **not Mosaic Relay''s funds** — they are merchant proceeds and consumer
      obligations. The lawful basis for blocking or holding them is **primarily contractual**
      (the merchant agreement''s suspension/reserve provisions) plus network and processor
      rules. **[SUPPLIED SOURCE — PRIOR MATTER: Payment Holds memo, § 3.1]**


      **[GENERATED ANALYSIS]** Two categories with different treatment:

      - **Pending customer refunds:** These are potentially **time-sensitive consumer
      obligations**. If consumers are owed refunds, Mosaic Relay should ensure refunds
      that are due are processed or that the merchant''s ability to issue them is
      preserved, subject to the suspension. Blocking refunds owed to consumers could
      create consumer-protection exposure (e.g., under card network chargeback rules
      or state consumer protection law). **[UNVERIFIED]**

      - **Seller payouts:** These are **pending funds** subject to processor, network,
      contractual, and applicable-law requirements. Blocking payouts is a **delay
      in payout**, not the holding of customer deposits, which reduces — but does
      not eliminate — money-transmission and safeguarding concerns. **[SUPPLIED SOURCE
      — PRIOR MATTER: Payment Holds memo, § 3.7]**


      **[GENERATED ANALYSIS]** The safest approach is a **pure freeze** of new payouts
      pending review, while preserving the merchant''s ability to satisfy consumer
      refund obligations and confirming with processors/networks that the payout block
      is permitted. Using held funds to cover chargebacks, returns, or fees should
      be a separate, explicitly authorized capability, added only after the merchant
      agreement is amended to permit it and network rules are confirmed. **[SUPPLIED
      SOURCE — PRIOR MATTER: Payment Holds memo, § 3.3]**


      **[GENERATED ANALYSIS]** Before execution, Mosaic Relay must confirm: the amounts
      and aging of pending refunds and payouts; whether any are time-sensitive (e.g.,
      consumer refunds with deadlines); the reserve or hold authority in the agreement;
      and processor/network acceptance of the payout block. This is a material dependency.


      ### 3.4 What records must be preserved?


      **[GENERATED ANALYSIS]** Mosaic Relay should preserve the full audit trail for
      the merchant, including:

      - All sanctions-screening alerts and their dispositions (including the two false
      positives and the unresolved alert);

      - The risk assessment and decision record for the suspension;

      - All transaction records, including the transactions involving the high-risk
      country;

      - All KYB/KYC and beneficial-owner records;

      - All communications with the merchant and any notice sent;

      - Any SAR-related records (subject to confidentiality);

      - Pending refund and payout records, including amounts, aging, and status.


      **[UNVERIFIED AUTHORITY]** BSA recordkeeping requirements (31 U.S.C. § 5318(h);
      31 C.F.R. § 1010.410) require retention of customer identification records,
      transaction records, and SARs for **five years**. **[UNVERIFIED]** **[SUPPLIED
      SOURCE — PRIOR MATTER: Baseline KYB/KYC memo, § 6.2]**


      **[GENERATED ANALYSIS]** Records should be preserved in a way that is **auditable
      and least-privilege** — accessible only to those who need them, and protected
      from alteration. This supports both regulatory review and any later reinstatement
      or termination decision.


      ### 3.5 What process should govern reinstatement or termination?


      **[SUPPLIED FACT]** A later review would decide whether to terminate the relationship
      or restore service.


      **[GENERATED ANALYSIS]** Mosaic Relay should define a **documented review process**
      with clear ownership and timelines, covering:

      - **Who decides:** a defined reviewer or committee (e.g., risk, compliance,
      and legal) not involved in the original suspension decision, to ensure independence.

      - **What is reviewed:** the unresolved alert, the high-risk country, the volume
      growth, the merchant''s response/evidence, and any SAR posture.

      - **Timeline:** a stated review period (e.g., within the ten-business-day window
      or a defined extension).

      - **Outcomes:** (a) restore service if the alert is cleared and risk is mitigated;
      (b) terminate the relationship if the risk is confirmed; or (c) extend the suspension
      if more information is needed.

      - **Merchant notice:** a clear outcome notice to the merchant, subject to SAR
      confidentiality constraints.


      **[GENERATED ANALYSIS]** Two viable approaches:

      - **Path A — Restore if cleared, terminate if confirmed.** If the unresolved
      alert is cleared as a false positive and the high-risk country is not OFAC-sanctioned,
      restore service. If the alert is confirmed or the country is sanctioned, terminate.
      This is the cleanest risk-based path.

      - **Path B — Terminate on confirmed risk, with restoration as a separate decision.**
      Treat termination as the default on confirmed risk, and require a separate,
      documented decision to restore. More conservative; higher operational cost.


      **[GENERATED ANALYSIS]** For a cautious, control-focused posture, **Path A**
      is likely appropriate: restore if the risk is cleared, terminate if confirmed,
      and document each outcome. The review should be completed within the ten-business-day
      window or a defined extension, with the merchant notified of the outcome (subject
      to SAR constraints).


      ---


      ## 4. Options by workstream


      **[GENERATED ANALYSIS — OPTIONS, NOT A RECORDED DECISION]**


      ### 4.1 Immediate suspension

      - **Option A — Suspend now (recommended).** Block new payments and payouts immediately,
      preserve records, send a minimal non-tipping notice, and complete the review
      within ten business days. Lower risk; preserves the ability to restore or terminate
      later.

      - **Option B — Suspend only after confirming the alert/country.** Delay suspension
      until the unresolved alert and high-risk country are confirmed. Higher risk;
      may allow continued processing during the investigation.


      ### 4.2 Communications

      - **Option A — Minimal non-tipping notice (recommended).** State only that access
      is suspended under the agreement, without referencing SAR, sanctions, or the
      high-risk country. Required if a SAR is filed or contemplated.

      - **Option B — Explanatory notice.** Explain the risk/compliance reason. Only
      permissible if no SAR is filed or contemplated, and even then should avoid internal
      methodology.


      ### 4.3 Pending refunds and payouts

      - **Option A — Pure freeze with consumer-refund preservation (recommended).**
      Block new payouts, preserve the merchant''s ability to satisfy consumer refund
      obligations, and confirm processor/network acceptance.

      - **Option B — Full freeze of all funds.** Block all payouts and refunds. Higher
      consumer-protection risk if refunds are time-sensitive.


      ### 4.4 Record preservation

      - **Option A — Full audit trail (recommended).** Preserve all screening, risk,
      transaction, KYB/KYC, communication, and pending-fund records for five years,
      least-privilege and auditable.

      - **Option B — Minimal preservation.** Preserve only transaction and screening
      records. Lower defensibility.


      ### 4.5 Reinstatement or termination

      - **Option A — Restore if cleared, terminate if confirmed (recommended).** Documented
      review with independent decision-maker, defined timeline, and clear outcomes.

      - **Option B — Terminate on confirmed risk, restoration as separate decision.**
      More conservative.


      ---


      ## 5. Implementation checklist


      **[GENERATED ANALYSIS]** Before execution, Mosaic Relay should complete the
      following:


      1. **Confirm SAR posture** (gating — controls all communications). If a SAR
      is filed or contemplated, use a minimal non-tipping notice.

      2. **Confirm the unresolved alert and high-risk country** — determine whether
      suspension is mandatory (true SDN match / sanctioned country) or discretionary.

      3. **Confirm merchant agreement terms** on pending funds, notice timing, and
      post-termination access.

      4. **Confirm pending refund and payout amounts, aging, status, and deadlines**,
      and any reserve/hold authority.

      5. **Confirm processor and acquiring-partner acceptance** of the suspension,
      payout block, and any reversal mechanics.

      6. **Document the suspension decision** with a written risk assessment.

      7. **Preserve the full audit trail** (five-year retention).

      8. **Define the reinstatement/termination review process** with ownership, timeline,
      and outcomes.


      ---


      ## 6. Recommendation


      **[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**


      **Recommendation: Suspend immediately as a discretionary, risk-based action,
      but resolve the SAR posture before drafting any merchant communication.**


      The ten-business-day timeline is **tight but workable** for the decision, provided
      the following are resolved early:


      1. **Confirm SAR posture** (the single most decision-changing dependency). If
      a SAR is filed or contemplated, use a minimal non-tipping notice and do not
      reference the SAR, sanctions, or the high-risk country.

      2. **Confirm the unresolved alert and high-risk country** to determine whether
      suspension is mandatory or discretionary.

      3. **Confirm merchant agreement terms** on pending funds, notice, and post-termination
      access.

      4. **Confirm pending refund and payout details** and processor/network acceptance
      of the payout block.

      5. **Preserve the full audit trail** and define the reinstatement/termination
      review process.


      **Fallback (lower-risk) path:** If the SAR posture cannot be confirmed, **suspend
      now with a minimal non-tipping notice and preserve records**, rather than delay
      the suspension. The suspension itself should not wait on the full review; only
      the content of the merchant communication should be gated on SAR posture.


      **This is a recommendation only.** It is not a recorded decision. Whether to
      suspend, what to communicate, and how to handle pending funds are decisions
      for Jordan Lee and the business.


      ---


      ## 7. Missing facts and unverified leads


      ### 7.1 Missing facts (must be resolved before finalizing)

      - **SAR posture** — whether a SAR has been filed or is being considered. Controls
      all communications.

      - **Unresolved alert** — whether it is a true OFAC SDN match or a false positive.
      Determines mandatory vs. discretionary.

      - **High-risk country** — which country, and whether OFAC-sanctioned or merely
      high-risk for AML.

      - **Merchant agreement specifics** — pending funds, notice timing, post-termination
      access.

      - **Pending refund and payout details** — amounts, aging, status, reserve/hold
      authority, deadlines.

      - **Processor and acquiring-partner acceptance** of the suspension and payout
      block.


      ### 7.2 Unverified authorities (must be confirmed before finalizing)

      - **SAR anti-tipping** (31 U.S.C. § 5318(g)(2)) — prohibition on notifying the
      merchant of a SAR. **[UNVERIFIED]**

      - **OFAC blocking obligation** for true SDN matches and comprehensively sanctioned
      jurisdictions. **[UNVERIFIED]**

      - **MSB definition** (31 C.F.R. § 1010.100(ff)) and AML program/SAR obligations.
      **[UNVERIFIED]**

      - **Recordkeeping** (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) — five-year
      retention. **[UNVERIFIED]**

      - **Card network rules** (Visa/Mastercard) on merchant suspension, payout holds,
      and reversals. **[UNVERIFIED]**

      - **State money transmission and UCC/NACHA rules** on holding ACH proceeds.
      **[UNVERIFIED]**

      - **Consumer protection** requirements for pending consumer refunds during suspension.
      **[UNVERIFIED]**


      **Recommended next step:** Complete the background research run and verify the
      cited authorities against current primary sources before this memo carries a
      final recommendation.


      ---


      ## 8. What would change this


      - **Working assumption (A3 — discretionary, not mandatory):** If the unresolved
      alert is confirmed as a true OFAC SDN match, or the high-risk country is comprehensively
      sanctioned, suspension becomes a **mandatory blocking obligation** and the notice
      to the merchant is constrained by OFAC''s blocking requirements. The analysis
      shifts from "is suspension justified" to "what must Mosaic Relay block and what
      may it say."

      - **Open fork (SAR posture):** If a SAR has been filed or is being contemplated,
      Mosaic Relay is generally prohibited from notifying the merchant of the SAR
      and must use a minimal non-tipping notice. If no SAR is filed or contemplated,
      Mosaic Relay has more latitude to explain the reason for suspension. This is
      the single most decision-changing fork.

      - **Open fork (pending funds):** If pending customer refunds are time-sensitive
      consumer obligations, Mosaic Relay must preserve the merchant''s ability to
      satisfy them, and blocking them could create consumer-protection exposure. If
      they are not time-sensitive, a full freeze is lower-risk.

      - **Not examined (partner and network contracts):** The specific contractual
      requirements of Mosaic Relay''s acquiring banks, processors, and card networks
      were not reviewed. The analysis assumes they impose their own requirements,
      but the exact terms are unknown.

      - **Not examined (state licensing and UCC/NACHA):** State money transmission
      licensing and UCC Article 4A / NACHA rules on holding ACH proceeds were not
      examined. If Mosaic Relay operates in states imposing additional licensing or
      funds-availability requirements, those must be mapped and satisfied.

      - **Not examined (authority):** The background research run is still completing;
      the regulatory citations in this memo are identified as likely material but
      have not been independently verified against current primary sources. This is
      the single most important gap before this memo carries a final recommendation.

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
# First-Pass Legal Analysis — Deactivation of a High-Risk Merchant

**Matter:** Mosaic Relay UX Test — 04 — Deactivation of a High-Risk Merchant
**Status:** First-pass analysis (draft for review)
**Prepared for:** Jordan Lee, Senior Product Counsel
**Prepared by:** Themis.ai (workspace guidance)
**Date:** 2026-09-03

---

## How to read this memo

This is a **developed first-pass analysis**, not a final legal opinion. It is organized so that **supplied facts, assumptions, generated analysis, and unverified authorities are clearly labeled** throughout. The background research run is still completing; the regulatory citations below are identified as **likely material** from the general U.S. framework but have **not been independently verified against current primary sources** unless marked otherwise. Every citation is labeled **[UNVERIFIED]** and must be confirmed before this memo carries a final recommendation.

This memo draws on two prior Mosaic Relay first-pass analyses already in the vault: the **Baseline KYB/KYC, Sanctions Screening, and BSA/AML Onboarding Requirements** memo (Matter 01) and the **Payment Holds During Fraud Review** memo (Matter 03). Those are labeled **[SUPPLIED SOURCE — PRIOR MATTER]** where relied on.

---

## 1. Executive summary

**[GENERATED ANALYSIS]** Immediate suspension of the merchant is **likely justified as a discretionary, risk-based action** — but not yet as a *mandatory* blocking obligation, because the unresolved sanctions alert has not been confirmed as a true OFAC SDN match and the high-risk country has not been identified as OFAC-sanctioned. The lawful path turns on five conditions that must be resolved before execution:

1. **Confirm the SAR posture first.** Whether a SAR has been filed or is being considered directly controls what Mosaic Relay may tell the merchant (anti-tipping under 31 U.S.C. § 5318(g)(2)). **[UNVERIFIED]** This is the single most decision-changing unknown and must be resolved before any merchant-facing communication is drafted.
2. **Confirm the unresolved alert and the high-risk country.** If the alert is a true OFAC SDN match, or the country is comprehensively sanctioned, suspension becomes a **mandatory blocking obligation** and the analysis shifts. As of intake, both are unresolved, so suspension is currently discretionary.
3. **Confirm the merchant agreement's terms on pending funds, notice timing, and post-termination access.** The general right to suspend for risk/compliance concerns is confirmed, but the specifics are not. This governs how Mosaic Relay must handle pending refunds and payouts.
4. **Confirm the amount, aging, and status of pending refunds and payouts, and any reserve/hold authority.** Pending customer refunds are potentially time-sensitive consumer obligations; seller payouts are pending funds subject to processor, network, contractual, and applicable-law requirements.
5. **Confirm processor and acquiring-partner acceptance** of the suspension, payout block, and any reversal mechanics.

**[GENERATED ANALYSIS]** The single most decision-changing unknown is **SAR posture**, because it determines what Mosaic Relay may lawfully communicate to the merchant — and a misstep (tipping) is a criminal exposure under the BSA, not merely a contract or reputational issue. The second most decision-changing unknown is the **unresolved alert / high-risk country**, because it determines whether suspension is mandatory or discretionary.

**[GENERATED ANALYSIS]** The ten-business-day timeline is **tight but workable** for the decision, provided the SAR posture and the unresolved alert are resolved early. If the SAR posture cannot be confirmed, Mosaic Relay should suspend with a **minimal, non-tipping notice** and preserve records, rather than delay the suspension itself.

---

## 2. Scope and assumptions

### 2.1 Scope

**[SUPPLIED FACT]** Risk operations recommends deactivating a Mosaic Relay merchant after repeated sanctions-screening alerts, rapid volume growth, and transactions involving a newly identified high-risk country. The proposed operation immediately blocks new payments and payouts, preserves relevant records, and sends the merchant a short notice stating access is suspended under the agreement. A later review would decide whether to terminate the relationship or restore service. Operations wants a decision within ten business days.

**[SUPPLIED FACT]** Two sanctions-screening alerts were false positives; one alert remains unresolved. The merchant has pending customer refunds and seller payouts. The contract includes a general right to suspend service for risk or compliance concerns.

**[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved and materially affect this analysis:
- **SAR posture: NOT DETERMINED.** Whether a SAR has been filed or is being considered is unknown. This controls what Mosaic Relay may tell the merchant.
- **Unresolved alert: STILL UNDER REVIEW.** Whether it is a true OFAC SDN match or a false positive is not determined.
- **High-risk country: NOT IDENTIFIED.** Which country, and whether it is OFAC-sanctioned or merely high-risk for AML, is unknown.
- **Merchant agreement specifics: NOT CONFIRMED.** Terms on pending funds, notice timing, and post-termination access are unverified; only the general suspension right is confirmed.
- **Pending funds detail: NOT PROVIDED.** Amounts, aging, status, reserve/hold authority, and deadlines for refunds and payouts are unconfirmed.

### 2.2 Assumptions

**[ASSUMPTION]** The following are working assumptions, not established facts:
- **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United States in this scenario; any non-U.S. expansion is subject to separate legal review. This memo analyzes U.S. federal obligations only.
- **A2 — MSB classification.** Mosaic Relay is classified as a money services business (MSB) under FinCEN regulations and is subject to BSA/AML program and SAR obligations. **[UNVERIFIED]** If Mosaic Relay is not an MSB, the BSA/AML analysis changes, though partner and processor requirements would still apply.
- **A3 — Discretionary, not mandatory.** Because the unresolved alert is not yet confirmed as a true OFAC SDN match and the high-risk country is not identified as OFAC-sanctioned, immediate suspension is currently a **discretionary risk-based action** rather than a mandatory blocking obligation.
- **A4 — Merchant agreement is the primary contractual basis.** The merchant agreement's general suspension right is the lawful basis for the action; its specific terms on pending funds, notice, and post-termination access are unverified.
- **A5 — Partner and network requirements apply.** Acquiring banks, processors, and card networks impose their own rules on suspension, payout blocks, and reversals that must be reconciled. The exact terms have not been reviewed.

---

## 3. Analysis by workstream

### 3.1 Is immediate suspension justified?

**[GENERATED ANALYSIS]** Immediate suspension is **likely justified as a discretionary, risk-based action** under the merchant agreement's general right to suspend for risk or compliance concerns, provided the decision is documented and the risk rationale is sound. The combination of repeated sanctions-screening alerts (even with two false positives), rapid volume growth, and transactions involving a newly identified high-risk country is a legitimate basis for a risk-based suspension while the unresolved alert is investigated.

**[GENERATED ANALYSIS]** However, suspension is **not yet a mandatory blocking obligation** because:
- The unresolved alert is **not confirmed as a true OFAC SDN match**; and
- The high-risk country is **not identified as OFAC-sanctioned**.

**[GENERATED ANALYSIS]** If either condition is later confirmed (true SDN match, or comprehensively sanctioned jurisdiction), the analysis shifts: Mosaic Relay would have a **mandatory obligation to block** transactions and would be prohibited from processing or paying out to the sanctioned party, and the notice to the merchant would be constrained by OFAC's blocking requirements. **[UNVERIFIED — OFAC blocking obligation]**

**[GENERATED ANALYSIS]** The decision to suspend should be **documented** with a written risk assessment recording: the alerts and their disposition, the volume growth, the high-risk country, the reason suspension is warranted, and the basis for treating it as discretionary (not mandatory) at this stage. This supports auditability and defensibility.

**[GENERATED ANALYSIS]** The ten-business-day timeline is workable for the decision, but the **suspension itself should not be delayed** pending the full review. Blocking new payments and payouts now, while preserving records, is the lower-risk path; the later review decides termination vs. restoration.

### 3.2 What communications to the merchant are permitted?

**[GENERATED ANALYSIS]** This is the most sensitive workstream because of **SAR confidentiality / anti-tipping**. If a SAR has been filed or is being considered, Mosaic Relay is generally **prohibited from notifying the merchant** that a SAR has been filed, and from disclosing information that would reveal the existence of a SAR. **[UNVERIFIED AUTHORITY — 31 U.S.C. § 5318(g)(2) anti-tipping]**

**[SUPPLIED FACT — UNRESOLVED]** Whether a SAR has been filed or is being considered is **unknown**. This must be resolved before any merchant-facing communication is drafted.

**[GENERATED ANALYSIS]** Two paths depending on SAR posture:
- **If a SAR is filed or contemplated:** The suspension notice must be **minimal and non-tipping** — it should state only that access is suspended under the agreement, without referencing the SAR, the sanctions screening, or the reason tied to the SAR. Mosaic Relay should not disclose that a SAR was or may be filed. The notice should be reviewed by compliance and legal before sending.
- **If no SAR is filed or contemplated:** Mosaic Relay has more latitude to explain the reason for suspension (e.g., risk/compliance review), but should still avoid over-disclosing internal risk methodology or screening details.

**[GENERATED ANALYSIS]** Regardless of SAR posture, the notice should be **plain-language** and should state: (a) access is suspended under the agreement; (b) new payments and payouts are blocked; (c) how the merchant can contact support; and (d) that a review will determine next steps. It should **not** disclose internal risk methodology, screening thresholds, or any SAR-related information.

**[GENERATED ANALYSIS]** The proposed "short notice stating access is suspended under the agreement" is the **right shape** — it is minimal and non-tipping. Mosaic Relay should not expand it to explain the sanctions alerts or the high-risk country until the SAR posture is confirmed.

### 3.3 How to handle pending customer refunds and seller payouts?

**[SUPPLIED FACT]** The merchant has pending customer refunds and seller payouts. Amounts and transaction-level details were not provided.

**[SUPPLIED FACT — UNRESOLVED]** Amounts, aging, status, reserve or hold authority, and any deadlines are unconfirmed. Risk, finance, and support must confirm these before execution.

**[GENERATED ANALYSIS]** Pending funds must be handled carefully because they are **not Mosaic Relay's funds** — they are merchant proceeds and consumer obligations. The lawful basis for blocking or holding them is **primarily contractual** (the merchant agreement's suspension/reserve provisions) plus network and processor rules. **[SUPPLIED SOURCE — PRIOR MATTER: Payment Holds memo, § 3.1]**

**[GENERATED ANALYSIS]** Two categories with different treatment:
- **Pending customer refunds:** These are potentially **time-sensitive consumer obligations**. If consumers are owed refunds, Mosaic Relay should ensure refunds that are due are processed or that the merchant's ability to issue them is preserved, subject to the suspension. Blocking refunds owed to consumers could create consumer-protection exposure (e.g., under card network chargeback rules or state consumer protection law). **[UNVERIFIED]**
- **Seller payouts:** These are **pending funds** subject to processor, network, contractual, and applicable-law requirements. Blocking payouts is a **delay in payout**, not the holding of customer deposits, which reduces — but does not eliminate — money-transmission and safeguarding concerns. **[SUPPLIED SOURCE — PRIOR MATTER: Payment Holds memo, § 3.7]**

**[GENERATED ANALYSIS]** The safest approach is a **pure freeze** of new payouts pending review, while preserving the merchant's ability to satisfy consumer refund obligations and confirming with processors/networks that the payout block is permitted. Using held funds to cover chargebacks, returns, or fees should be a separate, explicitly authorized capability, added only after the merchant agreement is amended to permit it and network rules are confirmed. **[SUPPLIED SOURCE — PRIOR MATTER: Payment Holds memo, § 3.3]**

**[GENERATED ANALYSIS]** Before execution, Mosaic Relay must confirm: the amounts and aging of pending refunds and payouts; whether any are time-sensitive (e.g., consumer refunds with deadlines); the reserve or hold authority in the agreement; and processor/network acceptance of the payout block. This is a material dependency.

### 3.4 What records must be preserved?

**[GENERATED ANALYSIS]** Mosaic Relay should preserve the full audit trail for the merchant, including:
- All sanctions-screening alerts and their dispositions (including the two false positives and the unresolved alert);
- The risk assessment and decision record for the suspension;
- All transaction records, including the transactions involving the high-risk country;
- All KYB/KYC and beneficial-owner records;
- All communications with the merchant and any notice sent;
- Any SAR-related records (subject to confidentiality);
- Pending refund and payout records, including amounts, aging, and status.

**[UNVERIFIED AUTHORITY]** BSA recordkeeping requirements (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) require retention of customer identification records, transaction records, and SARs for **five years**. **[UNVERIFIED]** **[SUPPLIED SOURCE — PRIOR MATTER: Baseline KYB/KYC memo, § 6.2]**

**[GENERATED ANALYSIS]** Records should be preserved in a way that is **auditable and least-privilege** — accessible only to those who need them, and protected from alteration. This supports both regulatory review and any later reinstatement or termination decision.

### 3.5 What process should govern reinstatement or termination?

**[SUPPLIED FACT]** A later review would decide whether to terminate the relationship or restore service.

**[GENERATED ANALYSIS]** Mosaic Relay should define a **documented review process** with clear ownership and timelines, covering:
- **Who decides:** a defined reviewer or committee (e.g., risk, compliance, and legal) not involved in the original suspension decision, to ensure independence.
- **What is reviewed:** the unresolved alert, the high-risk country, the volume growth, the merchant's response/evidence, and any SAR posture.
- **Timeline:** a stated review period (e.g., within the ten-business-day window or a defined extension).
- **Outcomes:** (a) restore service if the alert is cleared and risk is mitigated; (b) terminate the relationship if the risk is confirmed; or (c) extend the suspension if more information is needed.
- **Merchant notice:** a clear outcome notice to the merchant, subject to SAR confidentiality constraints.

**[GENERATED ANALYSIS]** Two viable approaches:
- **Path A — Restore if cleared, terminate if confirmed.** If the unresolved alert is cleared as a false positive and the high-risk country is not OFAC-sanctioned, restore service. If the alert is confirmed or the country is sanctioned, terminate. This is the cleanest risk-based path.
- **Path B — Terminate on confirmed risk, with restoration as a separate decision.** Treat termination as the default on confirmed risk, and require a separate, documented decision to restore. More conservative; higher operational cost.

**[GENERATED ANALYSIS]** For a cautious, control-focused posture, **Path A** is likely appropriate: restore if the risk is cleared, terminate if confirmed, and document each outcome. The review should be completed within the ten-business-day window or a defined extension, with the merchant notified of the outcome (subject to SAR constraints).

---

## 4. Options by workstream

**[GENERATED ANALYSIS — OPTIONS, NOT A RECORDED DECISION]**

### 4.1 Immediate suspension
- **Option A — Suspend now (recommended).** Block new payments and payouts immediately, preserve records, send a minimal non-tipping notice, and complete the review within ten business days. Lower risk; preserves the ability to restore or terminate later.
- **Option B — Suspend only after confirming the alert/country.** Delay suspension until the unresolved alert and high-risk country are confirmed. Higher risk; may allow continued processing during the investigation.

### 4.2 Communications
- **Option A — Minimal non-tipping notice (recommended).** State only that access is suspended under the agreement, without referencing SAR, sanctions, or the high-risk country. Required if a SAR is filed or contemplated.
- **Option B — Explanatory notice.** Explain the risk/compliance reason. Only permissible if no SAR is filed or contemplated, and even then should avoid internal methodology.

### 4.3 Pending refunds and payouts
- **Option A — Pure freeze with consumer-refund preservation (recommended).** Block new payouts, preserve the merchant's ability to satisfy consumer refund obligations, and confirm processor/network acceptance.
- **Option B — Full freeze of all funds.** Block all payouts and refunds. Higher consumer-protection risk if refunds are time-sensitive.

### 4.4 Record preservation
- **Option A — Full audit trail (recommended).** Preserve all screening, risk, transaction, KYB/KYC, communication, and pending-fund records for five years, least-privilege and auditable.
- **Option B — Minimal preservation.** Preserve only transaction and screening records. Lower defensibility.

### 4.5 Reinstatement or termination
- **Option A — Restore if cleared, terminate if confirmed (recommended).** Documented review with independent decision-maker, defined timeline, and clear outcomes.
- **Option B — Terminate on confirmed risk, restoration as separate decision.** More conservative.

---

## 5. Implementation checklist

**[GENERATED ANALYSIS]** Before execution, Mosaic Relay should complete the following:

1. **Confirm SAR posture** (gating — controls all communications). If a SAR is filed or contemplated, use a minimal non-tipping notice.
2. **Confirm the unresolved alert and high-risk country** — determine whether suspension is mandatory (true SDN match / sanctioned country) or discretionary.
3. **Confirm merchant agreement terms** on pending funds, notice timing, and post-termination access.
4. **Confirm pending refund and payout amounts, aging, status, and deadlines**, and any reserve/hold authority.
5. **Confirm processor and acquiring-partner acceptance** of the suspension, payout block, and any reversal mechanics.
6. **Document the suspension decision** with a written risk assessment.
7. **Preserve the full audit trail** (five-year retention).
8. **Define the reinstatement/termination review process** with ownership, timeline, and outcomes.

---

## 6. Recommendation

**[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**

**Recommendation: Suspend immediately as a discretionary, risk-based action, but resolve the SAR posture before drafting any merchant communication.**

The ten-business-day timeline is **tight but workable** for the decision, provided the following are resolved early:

1. **Confirm SAR posture** (the single most decision-changing dependency). If a SAR is filed or contemplated, use a minimal non-tipping notice and do not reference the SAR, sanctions, or the high-risk country.
2. **Confirm the unresolved alert and high-risk country** to determine whether suspension is mandatory or discretionary.
3. **Confirm merchant agreement terms** on pending funds, notice, and post-termination access.
4. **Confirm pending refund and payout details** and processor/network acceptance of the payout block.
5. **Preserve the full audit trail** and define the reinstatement/termination review process.

**Fallback (lower-risk) path:** If the SAR posture cannot be confirmed, **suspend now with a minimal non-tipping notice and preserve records**, rather than delay the suspension. The suspension itself should not wait on the full review; only the content of the merchant communication should be gated on SAR posture.

**This is a recommendation only.** It is not a recorded decision. Whether to suspend, what to communicate, and how to handle pending funds are decisions for Jordan Lee and the business.

---

## 7. Missing facts and unverified leads

### 7.1 Missing facts (must be resolved before finalizing)
- **SAR posture** — whether a SAR has been filed or is being considered. Controls all communications.
- **Unresolved alert** — whether it is a true OFAC SDN match or a false positive. Determines mandatory vs. discretionary.
- **High-risk country** — which country, and whether OFAC-sanctioned or merely high-risk for AML.
- **Merchant agreement specifics** — pending funds, notice timing, post-termination access.
- **Pending refund and payout details** — amounts, aging, status, reserve/hold authority, deadlines.
- **Processor and acquiring-partner acceptance** of the suspension and payout block.

### 7.2 Unverified authorities (must be confirmed before finalizing)
- **SAR anti-tipping** (31 U.S.C. § 5318(g)(2)) — prohibition on notifying the merchant of a SAR. **[UNVERIFIED]**
- **OFAC blocking obligation** for true SDN matches and comprehensively sanctioned jurisdictions. **[UNVERIFIED]**
- **MSB definition** (31 C.F.R. § 1010.100(ff)) and AML program/SAR obligations. **[UNVERIFIED]**
- **Recordkeeping** (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) — five-year retention. **[UNVERIFIED]**
- **Card network rules** (Visa/Mastercard) on merchant suspension, payout holds, and reversals. **[UNVERIFIED]**
- **State money transmission and UCC/NACHA rules** on holding ACH proceeds. **[UNVERIFIED]**
- **Consumer protection** requirements for pending consumer refunds during suspension. **[UNVERIFIED]**

**Recommended next step:** Complete the background research run and verify the cited authorities against current primary sources before this memo carries a final recommendation.

---

## 8. What would change this

- **Working assumption (A3 — discretionary, not mandatory):** If the unresolved alert is confirmed as a true OFAC SDN match, or the high-risk country is comprehensively sanctioned, suspension becomes a **mandatory blocking obligation** and the notice to the merchant is constrained by OFAC's blocking requirements. The analysis shifts from "is suspension justified" to "what must Mosaic Relay block and what may it say."
- **Open fork (SAR posture):** If a SAR has been filed or is being contemplated, Mosaic Relay is generally prohibited from notifying the merchant of the SAR and must use a minimal non-tipping notice. If no SAR is filed or contemplated, Mosaic Relay has more latitude to explain the reason for suspension. This is the single most decision-changing fork.
- **Open fork (pending funds):** If pending customer refunds are time-sensitive consumer obligations, Mosaic Relay must preserve the merchant's ability to satisfy them, and blocking them could create consumer-protection exposure. If they are not time-sensitive, a full freeze is lower-risk.
- **Not examined (partner and network contracts):** The specific contractual requirements of Mosaic Relay's acquiring banks, processors, and card networks were not reviewed. The analysis assumes they impose their own requirements, but the exact terms are unknown.
- **Not examined (state licensing and UCC/NACHA):** State money transmission licensing and UCC Article 4A / NACHA rules on holding ACH proceeds were not examined. If Mosaic Relay operates in states imposing additional licensing or funds-availability requirements, those must be mapped and satisfied.
- **Not examined (authority):** The background research run is still completing; the regulatory citations in this memo are identified as likely material but have not been independently verified against current primary sources. This is the single most important gap before this memo carries a final recommendation.
