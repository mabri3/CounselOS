---
work_product_id: WP-ba423b0c2cc6
matter_id: MAT-20260903-fe95b6
title: First-Pass Legal Analysis — Payment Holds During Fraud Review
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T09:03:40+00:00'
updated_at: '2026-09-03T09:03:40+00:00'
immutable: false
source_action_key: chat:RUN-20260903-13e714:tool:f9cffcc462e91174225a1da9
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# First-Pass Legal Analysis — Payment Holds During Fraud Review


      **Matter:** Mosaic Relay UX Test — 03 — Payment Holds During Fraud Review

      **Status:** First-pass analysis (draft for review)

      **Prepared for:** Jordan Lee, Senior Product Counsel

      **Prepared by:** Themis.ai (workspace guidance)

      **Date:** 2026-09-03


      ---


      ## How to read this memo


      This is a **developed first-pass analysis**, not a final legal opinion. It is
      organized so that **supplied facts, assumptions, generated analysis, and unverified
      authorities are clearly labeled** throughout. The background research runs are
      still completing; the regulatory citations below are identified as **likely
      material** from the general U.S. framework but have **not been independently
      verified against current primary sources** unless marked otherwise. Every citation
      is labeled **[UNVERIFIED]** and must be confirmed before this memo carries a
      final recommendation.


      ---


      ## 1. Executive summary


      **[GENERATED ANALYSIS]** Mosaic Relay can likely build a payment-operations
      control that temporarily holds merchant proceeds during fraud review, **but
      not in the form Product has proposed as currently specified.** The control is
      lawful only if four conditions are met before launch:


      1. **The merchant agreement grants an express right to hold proceeds pending
      fraud review.** This is the primary lawful basis for the control. As of intake,
      the agreement''s hold provisions are **unverified** — if there is no hold clause,
      the agreement must be amended before launch. This is the single most decision-changing
      dependency.

      2. **The hold period is set and documented with a risk-based rationale, and
      card vs. ACH timing is decided.** As of intake, the maximum hold period is **undecided**.
      Card and ACH proceeds are governed by different frameworks (network rules vs.
      UCC Article 4A / NACHA), so timing rules will likely differ by method.

      3. **The treatment of held funds is decided.** Whether held funds may be used
      to cover chargebacks, returns, or fees is **undecided**. This changes the funds-flow
      and network analysis.

      4. **Card networks and processors confirm in writing they accept the hold, reversal,
      and deactivation design.** As of intake, this is **unconfirmed**. If partners
      or networks require different mechanics, the design must change.


      **[GENERATED ANALYSIS]** The single most decision-changing unknown is **merchant
      agreement authority** — without an express hold right, the entire control lacks
      a lawful basis and must be redesigned or the agreement amended. The second most
      decision-changing unknown is the **unset hold period**, which drives the timing-limits
      analysis and network compliance.


      **[GENERATED ANALYSIS]** The one-quarter timeline is **tight but workable**
      for the design and control work, provided the four conditions above are resolved
      early. If the merchant agreement cannot be amended or the hold period cannot
      be set and documented in time, **delaying launch is the lower-risk path** —
      launching without contractual authority or with an undocumented hold period
      creates regulatory and operational risk that outweighs the benefit of meeting
      the one-quarter target.


      ---


      ## 2. Scope and assumptions


      ### 2.1 Scope


      **[SUPPLIED FACT]** Mosaic Relay wants to add a payment-operations control that
      temporarily holds a merchant''s card or ACH proceeds when transaction-risk signals
      indicate possible fraud. The proposed UX shows the merchant a banner explaining
      a review is in progress, prevents payout for the affected amount, and lets the
      merchant submit invoices or fulfillment evidence. Operations may release the
      funds, extend the review, reverse the payment, or deactivate processing. Product
      wants an initial version live in one quarter.


      **[SUPPLIED FACT]** Mosaic Relay already calculates transaction risk scores
      and manages payout controls for customers. It does not hold deposits or operate
      as a bank; holds are of merchant proceeds pending payout, not customer deposits.


      **[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved
      and materially affect this analysis:

      - **Maximum hold period: NOT DECIDED.** Whether it will differ for card vs.
      ACH is undecided.

      - **Merchant agreement hold authority: UNKNOWN — need to check.** The primary
      contractual basis is unverified.

      - **Treatment of held funds: NOT DECIDED.** Whether held funds may cover chargebacks,
      returns, or fees is undecided.

      - **Appeal process: NOT DECIDED.** Whether a specific appeal process is required
      is undecided.

      - **Customer-facing notice timing: NOT DECIDED.** Whether the banner alone satisfies
      disclosure requirements is undecided.


      ### 2.2 Assumptions


      **[ASSUMPTION]** The following are working assumptions, not established facts:

      - **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United
      States in this scenario; any non-U.S. expansion is subject to separate legal
      review. This memo analyzes U.S. federal obligations only.

      - **A2 — Holds are of merchant proceeds, not customer deposits.** Mosaic Relay
      does not hold deposits or operate as a bank; the control holds merchant proceeds
      pending payout. This affects the money-transmission analysis.

      - **A3 — Merchant agreement is the primary contractual basis.** The merchant
      agreement must permit the hold. Its current terms are unverified.

      - **A4 — Partner and network requirements apply.** Acquiring banks, processors,
      and card networks impose their own rules on holds, reversals, and deactivation
      that must be reconciled with the design. The exact terms have not been reviewed.


      ---


      ## 3. Analysis by workstream


      ### 3.1 Lawful authority to hold merchant proceeds


      **[GENERATED ANALYSIS]** The lawful basis for holding merchant proceeds pending
      fraud review is **primarily contractual** — the merchant agreement must grant
      Mosaic Relay the right to withhold or delay payout of proceeds. Absent an express
      hold provision, Mosaic Relay would be withholding funds the merchant is contractually
      entitled to receive, creating breach-of-contract and potential conversion exposure.


      **[SUPPLIED FACT — UNRESOLVED]** Whether the current merchant agreement permits
      holds on proceeds is **unknown — need to check**. This is the single most decision-changing
      dependency.


      **[GENERATED ANALYSIS]** Two viable paths:

      - **Path A — Express hold clause.** The merchant agreement contains (or is amended
      to contain) an express right to hold proceeds pending fraud review, with defined
      triggers, duration, and release conditions. This is the cleanest basis.

      - **Path B — General reserve clause.** If the agreement has a general reserve
      or setoff clause, it may support a hold, but it is weaker and less defensible
      than an express fraud-review hold provision. A general clause may not clearly
      authorize a hold tied to fraud review.


      **[GENERATED ANALYSIS]** Mosaic Relay should not rely on a general reserve clause
      alone for a fraud-review hold. The agreement should be amended to include an
      express provision covering: the trigger (transaction-risk signals indicating
      possible fraud), the hold scope (affected amount), the maximum duration, the
      release conditions, and the merchant''s evidence-submission rights. This also
      supports the disclosure and appeal analysis below.


      **[UNVERIFIED AUTHORITY]** Whether state money transmission law imposes additional
      authority or timing requirements on holding merchant proceeds depends on Mosaic
      Relay''s classification and the states in which it operates. **[UNVERIFIED —
      see § 3.6]**


      ### 3.2 Timing limits on holds (card vs. ACH)


      **[SUPPLIED FACT — UNRESOLVED]** The maximum hold period is **not decided**,
      and whether rules will differ for card vs. ACH is undecided.


      **[GENERATED ANALYSIS]** Card and ACH proceeds are governed by **different frameworks**,
      so timing rules will likely differ by method:


      - **Card proceeds.** Card network rules (Visa/Mastercard) and acquiring-bank
      agreements govern merchant settlement and hold timing. Network rules generally
      require timely settlement and impose limits on how long a merchant''s funds
      can be held, with holds tied to documented risk (e.g., chargeback exposure,
      fraud). **[UNVERIFIED — see § 3.5]**

      - **ACH proceeds.** ACH is governed by NACHA Operating Rules and, for certain
      transfers, UCC Article 4A. NACHA rules impose timing and notification requirements
      on funds availability and returns. **[UNVERIFIED — see § 3.6]**


      **[GENERATED ANALYSIS]** Before launch, Mosaic Relay should set a **maximum
      hold period** with a documented, risk-based rationale, and decide whether it
      differs by payment method. A single uniform hold period may not be defensible
      across card and ACH given their different frameworks. The hold period should
      be calibrated to the time needed to complete a fraud review and obtain evidence,
      and should be disclosed to the merchant.


      **[GENERATED ANALYSIS]** If the hold period is set arbitrarily or without a
      documented risk basis, networks, processors, or regulators may view it as inadequate
      or excessive. The hold period must be:

      - **Documented** with a written risk assessment explaining how it was set and
      why it is appropriate for each payment method; and

      - **Disclosed** to the merchant in the agreement and in the hold notice.


      ### 3.3 Treatment of held funds


      **[SUPPLIED FACT — UNRESOLVED]** Whether held funds may be used to cover chargebacks,
      returns, or fees is **not decided**.


      **[GENERATED ANALYSIS]** This decision materially changes the analysis:

      - **If held funds may cover chargebacks/returns/fees:** The hold functions as
      a funding source for obligations, not just a freeze. This requires the merchant
      agreement to authorize setoff/application of held funds, and implicates card
      network rules on how chargebacks are funded and the order of application. It
      also raises funds-flow and safeguarding questions.

      - **If held funds are a pure freeze:** The hold only delays payout pending review;
      funds are released (or the payment reversed) at the end of review. This is simpler
      and lower-risk, but does not by itself protect Mosaic Relay against chargebacks
      that arise during the hold.


      **[GENERATED ANALYSIS]** The safest design for an initial version is a **pure
      freeze** — hold the affected amount pending review, then release or reverse.
      Using held funds to cover chargebacks, returns, or fees should be a separate,
      explicitly authorized capability, added only after the merchant agreement is
      amended to permit it and network rules are confirmed. This keeps the initial
      version simpler and reduces funds-flow risk.


      ### 3.4 Merchant notice and disclosure language


      **[SUPPLIED FACT]** The proposed UX shows the merchant a banner explaining a
      review is in progress and prevents payout for the affected amount.


      **[SUPPLIED FACT — UNRESOLVED]** Whether the banner alone satisfies disclosure
      requirements, and what notice timing is required, is **not decided**.


      **[GENERATED ANALYSIS]** The in-product banner is a good start but is **likely
      insufficient on its own** as the merchant''s only notice. Mosaic Relay should
      provide:

      - **At-hold notice** (the banner) explaining a review is in progress, the affected
      amount, and that payout is temporarily held;

      - **A durable notice** (e.g., email or in-dashboard notification) with the same
      information, the reason for the hold, the expected review timeline, and how
      to submit evidence; and

      - **A release/extension notice** when the review concludes, explaining the outcome
      and next steps.


      **[GENERATED ANALYSIS]** The notice should be **plain-language** and should
      state: (a) the hold is temporary and pending fraud review; (b) the affected
      amount; (c) the expected review period; (d) how to submit invoices or fulfillment
      evidence; and (e) the merchant''s rights if the hold is extended or the payment
      reversed. This supports the appeal/evidence analysis below and reduces dispute
      risk.


      **[UNVERIFIED AUTHORITY]** Whether specific disclosure language is required
      by regulation or network rule depends on the applicable framework. **[UNVERIFIED
      — see § 3.5 and § 3.6]**


      ### 3.5 Appeal or evidence rights


      **[SUPPLIED FACT]** The proposed UX lets the merchant submit invoices or fulfillment
      evidence during the review.


      **[SUPPLIED FACT — UNRESOLVED]** Whether a specific appeal process is required
      for merchants to contest a hold is **not decided**.


      **[GENERATED ANALYSIS]** The evidence-submission path is the core of the merchant''s
      ability to contest a hold. Even if no formal "appeal" is legally required, Mosaic
      Relay should provide a **defined evidence and review process** so the merchant
      can demonstrate the transactions are legitimate. This is both good customer
      experience and a risk-control measure — it lets operations release funds promptly
      when evidence resolves the concern.


      **[GENERATED ANALYSIS]** Two viable approaches:

      - **Path A — Evidence submission only.** The merchant submits invoices or fulfillment
      evidence; operations review and release, extend, or reverse. Simpler; matches
      the proposed UX.

      - **Path B — Formal appeal with defined rights.** A defined appeal process with
      stated timelines, a review by a person or team not involved in the original
      hold decision, and a written outcome. More robust; higher operational cost.


      **[GENERATED ANALYSIS]** For an initial version, **Path A (evidence submission
      with defined review timelines)** is likely sufficient, provided the merchant
      agreement and notice describe the process and the merchant has a clear way to
      submit evidence and receive an outcome. A formal appeal process (Path B) can
      be added later if disputes or network/regulatory requirements demand it.


      ### 3.6 Card network and processor requirements


      **[SUPPLIED FACT]** Actors include acquiring banks, processors, card networks,
      and fraud vendors.


      **[SUPPLIED FACT — UNRESOLVED]** Whether card networks and processors accept
      the proposed hold, reversal, and deactivation design is **unconfirmed**.


      **[GENERATED ANALYSIS]** Card network rules (Visa/Mastercard) and acquiring-bank
      agreements govern merchant settlement, holds, reversals, and deactivation. These
      rules are **contractual and network-specific** and must be confirmed with the
      acquiring banks and processors before launch. Key questions:

      - Do network rules permit a hold on merchant proceeds pending fraud review,
      and for how long?

      - What are the rules for reversing a payment and deactivating processing during
      a fraud review?

      - Do the networks require specific notice to the merchant or the cardholder?


      **[GENERATED ANALYSIS]** Mosaic Relay must obtain **written confirmation** from
      acquiring banks and processors that they accept the proposed hold, reversal,
      and deactivation mechanics. If partners or networks require different mechanics,
      the design must change. This is a material dependency for the one-quarter timeline.


      ### 3.7 Money transmission / funds-flow implications


      **[ASSUMPTION A2]** Mosaic Relay does not hold deposits or operate as a bank;
      holds are of merchant proceeds pending payout, not customer deposits.


      **[GENERATED ANALYSIS]** Because Mosaic Relay holds merchant proceeds pending
      payout (not customer deposits), the control is a **delay in payout**, not the
      holding of customer funds. This reduces — but does not eliminate — money-transmission
      and safeguarding concerns. The key funds-flow question is whether the hold changes
      Mosaic Relay''s exposure under state money transmission law or its acquiring/processor
      agreements.


      **[UNVERIFIED AUTHORITY]** State money transmission licensing requirements and
      UCC Article 4A / NACHA rules on holding ACH proceeds were **not examined** in
      the research packet. **[UNVERIFIED]** These must be mapped and satisfied before
      launch, particularly for the ACH hold. If Mosaic Relay operates in states that
      impose additional licensing or funds-availability requirements, those must be
      confirmed.


      **[GENERATED ANALYSIS]** The funds-flow design should be documented: where the
      held funds sit during the review, who controls them, and how they are released
      or reversed. This supports auditability and reduces regulatory and operational
      risk.


      ---


      ## 4. Proposed merchant notice language


      **[GENERATED ANALYSIS — DRAFT LANGUAGE, NOT FINAL]** The following is proposed
      plain-language notice language for the at-hold banner and the durable notice.
      It is a starting point for review, not final legal language.


      ### 4.1 At-hold banner (in-product)


      > **Review in progress**

      > We''re reviewing recent activity on your account for possible fraud. While
      the review is underway, **$[amount]** of your available payout is temporarily
      on hold. You can submit invoices or fulfillment evidence to help us complete
      the review faster. We''ll let you know the outcome and release any funds that
      are not affected.


      ### 4.2 Durable notice (email or dashboard notification)


      > **Subject: Your payout is temporarily on hold pending review**

      >

      > We''re reviewing recent activity on your Mosaic Relay account for possible
      fraud. While the review is underway, **$[amount]** of your payout is temporarily
      on hold.

      >

      > **What you can do:** Submit invoices or fulfillment evidence for the affected
      transactions through your dashboard. This helps us complete the review faster.

      >

      > **What happens next:** We''ll complete our review within [X] business days.
      If the transactions are confirmed, we''ll release the held funds. If we need
      more time or need to reverse a payment, we''ll let you know.

      >

      > **Questions?** Contact us at [support contact].


      **[GENERATED ANALYSIS]** The notice should be reviewed against the merchant
      agreement and any network or regulatory disclosure requirements before finalization.
      The bracketed items (amount, review period, support contact) must be filled
      in from the final design.


      ---


      ## 5. Implementation checklist


      **[GENERATED ANALYSIS]** Before launch, Mosaic Relay should complete the following:


      1. **Amend the merchant agreement** to include an express right to hold proceeds
      pending fraud review, with defined triggers, scope, duration, release conditions,
      and evidence-submission rights. (Gating — currently unverified.)

      2. **Set and document the maximum hold period** with a written risk-based rationale,
      and decide whether card vs. ACH timing differs.

      3. **Decide the treatment of held funds** — for the initial version, a pure
      freeze (release or reverse at end of review) is the lower-risk path; using held
      funds for chargebacks/returns/fees should be a separate, explicitly authorized
      capability.

      4. **Define the evidence and review process** — the merchant''s path to submit
      invoices or fulfillment evidence, with defined review timelines and a clear
      outcome.

      5. **Draft and implement the notice language** — at-hold banner plus durable
      notice, with release/extension notice at conclusion.

      6. **Confirm card network and processor acceptance in writing** — that acquiring
      banks, processors, and networks accept the hold, reversal, and deactivation
      mechanics.

      7. **Map state money transmission and UCC/NACHA requirements** for the ACH hold,
      and confirm funds-flow and safeguarding design.

      8. **Implement recordkeeping and audit trails** for holds, reviews, evidence,
      and outcomes.


      ---


      ## 6. Recommendation


      **[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**


      **Recommendation: Proceed toward launch, but only on a conditional basis, and
      only if the conditions below are met early in the one-quarter window. Otherwise,
      delay.**


      The one-quarter timeline is **tight but workable** for the design and control
      work, provided the following are resolved early:


      1. **Confirm merchant agreement hold authority** (the single most decision-changing
      dependency). If the agreement lacks an express hold right, it must be amended
      before launch.

      2. **Set and document the maximum hold period** and decide card vs. ACH timing,
      with a written risk-based rationale.

      3. **Decide the treatment of held funds** — a pure freeze for the initial version
      is the lower-risk path.

      4. **Confirm card network and processor acceptance in writing** of the hold,
      reversal, and deactivation mechanics.

      5. **Define the evidence/review process and notice language**, and map state
      money transmission and UCC/NACHA requirements.


      **Fallback (lower-risk) path:** If the merchant agreement cannot be amended
      or the hold period cannot be set and documented in time, **delay launch.** Launching
      without contractual authority or with an undocumented hold period creates regulatory
      and operational risk that outweighs the benefit of meeting the one-quarter target.


      **This is a recommendation only.** It is not a recorded decision. Whether to
      proceed, delay, or adopt the fallback path is a decision for Jordan Lee and
      the business.


      ---


      ## 7. Missing facts and unverified leads


      ### 7.1 Missing facts (must be resolved before finalizing)


      - **Merchant agreement hold provisions** — unverified; the primary contractual
      basis.

      - **Maximum hold period and card vs. ACH timing** — undecided.

      - **Treatment of held funds** (chargebacks, returns, fees) — undecided.

      - **Appeal/evidence process** — undecided.

      - **Customer-facing notice language and timing** — undecided.

      - **Card network and processor acceptance** — unconfirmed.


      ### 7.2 Unverified authorities (must be confirmed before finalizing)


      - **Card network rules** (Visa/Mastercard) on merchant holds, reversals, and
      deactivation during fraud review. **[UNVERIFIED]**

      - **State money transmission licensing** requirements for holding merchant proceeds.
      **[UNVERIFIED]**

      - **UCC Article 4A / NACHA rules** on holding ACH proceeds and funds availability.
      **[UNVERIFIED]**

      - **Consumer protection and disclosure requirements** for holds on proceeds.
      **[UNVERIFIED]**


      **Recommended next step:** Complete the background research runs and verify
      the cited authorities against current primary sources before this memo carries
      a final recommendation.


      ---


      ## 8. What would change this


      - **Working assumption (A3 — merchant agreement authority):** If the merchant
      agreement already contains an express hold right, the gating dependency resolves
      and the design can proceed more quickly. If it does not, the agreement must
      be amended before launch, which is a material timeline risk for the one-quarter
      target.

      - **Open fork (hold period):** If the hold period is set too long or lacks a
      documented risk-based rationale, networks or regulators may view it as excessive.
      If it is limited to a short, documented period, it is more defensible. Card
      and ACH may require different periods given their different frameworks.

      - **Open fork (treatment of funds):** If held funds may be used to cover chargebacks,
      returns, or fees, the design must include setoff authorization and network-compliant
      application of funds. If the hold is a pure freeze, the design is simpler but
      does not protect against chargebacks arising during the hold.

      - **Not examined (partner and network contracts):** The specific contractual
      requirements of Mosaic Relay''s acquiring banks, processors, and card networks
      were not reviewed. The analysis assumes they impose their own requirements,
      but the exact terms are unknown.

      - **Not examined (state licensing and UCC/NACHA):** State money transmission
      licensing and UCC Article 4A / NACHA rules on holding ACH proceeds were not
      examined. If Mosaic Relay operates in states imposing additional licensing or
      funds-availability requirements, those must be mapped and satisfied before launch.

      - **Not examined (authority):** The background research runs are still completing;
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
# First-Pass Legal Analysis — Payment Holds During Fraud Review

**Matter:** Mosaic Relay UX Test — 03 — Payment Holds During Fraud Review
**Status:** First-pass analysis (draft for review)
**Prepared for:** Jordan Lee, Senior Product Counsel
**Prepared by:** Themis.ai (workspace guidance)
**Date:** 2026-09-03

---

## How to read this memo

This is a **developed first-pass analysis**, not a final legal opinion. It is organized so that **supplied facts, assumptions, generated analysis, and unverified authorities are clearly labeled** throughout. The background research runs are still completing; the regulatory citations below are identified as **likely material** from the general U.S. framework but have **not been independently verified against current primary sources** unless marked otherwise. Every citation is labeled **[UNVERIFIED]** and must be confirmed before this memo carries a final recommendation.

---

## 1. Executive summary

**[GENERATED ANALYSIS]** Mosaic Relay can likely build a payment-operations control that temporarily holds merchant proceeds during fraud review, **but not in the form Product has proposed as currently specified.** The control is lawful only if four conditions are met before launch:

1. **The merchant agreement grants an express right to hold proceeds pending fraud review.** This is the primary lawful basis for the control. As of intake, the agreement's hold provisions are **unverified** — if there is no hold clause, the agreement must be amended before launch. This is the single most decision-changing dependency.
2. **The hold period is set and documented with a risk-based rationale, and card vs. ACH timing is decided.** As of intake, the maximum hold period is **undecided**. Card and ACH proceeds are governed by different frameworks (network rules vs. UCC Article 4A / NACHA), so timing rules will likely differ by method.
3. **The treatment of held funds is decided.** Whether held funds may be used to cover chargebacks, returns, or fees is **undecided**. This changes the funds-flow and network analysis.
4. **Card networks and processors confirm in writing they accept the hold, reversal, and deactivation design.** As of intake, this is **unconfirmed**. If partners or networks require different mechanics, the design must change.

**[GENERATED ANALYSIS]** The single most decision-changing unknown is **merchant agreement authority** — without an express hold right, the entire control lacks a lawful basis and must be redesigned or the agreement amended. The second most decision-changing unknown is the **unset hold period**, which drives the timing-limits analysis and network compliance.

**[GENERATED ANALYSIS]** The one-quarter timeline is **tight but workable** for the design and control work, provided the four conditions above are resolved early. If the merchant agreement cannot be amended or the hold period cannot be set and documented in time, **delaying launch is the lower-risk path** — launching without contractual authority or with an undocumented hold period creates regulatory and operational risk that outweighs the benefit of meeting the one-quarter target.

---

## 2. Scope and assumptions

### 2.1 Scope

**[SUPPLIED FACT]** Mosaic Relay wants to add a payment-operations control that temporarily holds a merchant's card or ACH proceeds when transaction-risk signals indicate possible fraud. The proposed UX shows the merchant a banner explaining a review is in progress, prevents payout for the affected amount, and lets the merchant submit invoices or fulfillment evidence. Operations may release the funds, extend the review, reverse the payment, or deactivate processing. Product wants an initial version live in one quarter.

**[SUPPLIED FACT]** Mosaic Relay already calculates transaction risk scores and manages payout controls for customers. It does not hold deposits or operate as a bank; holds are of merchant proceeds pending payout, not customer deposits.

**[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved and materially affect this analysis:
- **Maximum hold period: NOT DECIDED.** Whether it will differ for card vs. ACH is undecided.
- **Merchant agreement hold authority: UNKNOWN — need to check.** The primary contractual basis is unverified.
- **Treatment of held funds: NOT DECIDED.** Whether held funds may cover chargebacks, returns, or fees is undecided.
- **Appeal process: NOT DECIDED.** Whether a specific appeal process is required is undecided.
- **Customer-facing notice timing: NOT DECIDED.** Whether the banner alone satisfies disclosure requirements is undecided.

### 2.2 Assumptions

**[ASSUMPTION]** The following are working assumptions, not established facts:
- **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United States in this scenario; any non-U.S. expansion is subject to separate legal review. This memo analyzes U.S. federal obligations only.
- **A2 — Holds are of merchant proceeds, not customer deposits.** Mosaic Relay does not hold deposits or operate as a bank; the control holds merchant proceeds pending payout. This affects the money-transmission analysis.
- **A3 — Merchant agreement is the primary contractual basis.** The merchant agreement must permit the hold. Its current terms are unverified.
- **A4 — Partner and network requirements apply.** Acquiring banks, processors, and card networks impose their own rules on holds, reversals, and deactivation that must be reconciled with the design. The exact terms have not been reviewed.

---

## 3. Analysis by workstream

### 3.1 Lawful authority to hold merchant proceeds

**[GENERATED ANALYSIS]** The lawful basis for holding merchant proceeds pending fraud review is **primarily contractual** — the merchant agreement must grant Mosaic Relay the right to withhold or delay payout of proceeds. Absent an express hold provision, Mosaic Relay would be withholding funds the merchant is contractually entitled to receive, creating breach-of-contract and potential conversion exposure.

**[SUPPLIED FACT — UNRESOLVED]** Whether the current merchant agreement permits holds on proceeds is **unknown — need to check**. This is the single most decision-changing dependency.

**[GENERATED ANALYSIS]** Two viable paths:
- **Path A — Express hold clause.** The merchant agreement contains (or is amended to contain) an express right to hold proceeds pending fraud review, with defined triggers, duration, and release conditions. This is the cleanest basis.
- **Path B — General reserve clause.** If the agreement has a general reserve or setoff clause, it may support a hold, but it is weaker and less defensible than an express fraud-review hold provision. A general clause may not clearly authorize a hold tied to fraud review.

**[GENERATED ANALYSIS]** Mosaic Relay should not rely on a general reserve clause alone for a fraud-review hold. The agreement should be amended to include an express provision covering: the trigger (transaction-risk signals indicating possible fraud), the hold scope (affected amount), the maximum duration, the release conditions, and the merchant's evidence-submission rights. This also supports the disclosure and appeal analysis below.

**[UNVERIFIED AUTHORITY]** Whether state money transmission law imposes additional authority or timing requirements on holding merchant proceeds depends on Mosaic Relay's classification and the states in which it operates. **[UNVERIFIED — see § 3.6]**

### 3.2 Timing limits on holds (card vs. ACH)

**[SUPPLIED FACT — UNRESOLVED]** The maximum hold period is **not decided**, and whether rules will differ for card vs. ACH is undecided.

**[GENERATED ANALYSIS]** Card and ACH proceeds are governed by **different frameworks**, so timing rules will likely differ by method:

- **Card proceeds.** Card network rules (Visa/Mastercard) and acquiring-bank agreements govern merchant settlement and hold timing. Network rules generally require timely settlement and impose limits on how long a merchant's funds can be held, with holds tied to documented risk (e.g., chargeback exposure, fraud). **[UNVERIFIED — see § 3.5]**
- **ACH proceeds.** ACH is governed by NACHA Operating Rules and, for certain transfers, UCC Article 4A. NACHA rules impose timing and notification requirements on funds availability and returns. **[UNVERIFIED — see § 3.6]**

**[GENERATED ANALYSIS]** Before launch, Mosaic Relay should set a **maximum hold period** with a documented, risk-based rationale, and decide whether it differs by payment method. A single uniform hold period may not be defensible across card and ACH given their different frameworks. The hold period should be calibrated to the time needed to complete a fraud review and obtain evidence, and should be disclosed to the merchant.

**[GENERATED ANALYSIS]** If the hold period is set arbitrarily or without a documented risk basis, networks, processors, or regulators may view it as inadequate or excessive. The hold period must be:
- **Documented** with a written risk assessment explaining how it was set and why it is appropriate for each payment method; and
- **Disclosed** to the merchant in the agreement and in the hold notice.

### 3.3 Treatment of held funds

**[SUPPLIED FACT — UNRESOLVED]** Whether held funds may be used to cover chargebacks, returns, or fees is **not decided**.

**[GENERATED ANALYSIS]** This decision materially changes the analysis:
- **If held funds may cover chargebacks/returns/fees:** The hold functions as a funding source for obligations, not just a freeze. This requires the merchant agreement to authorize setoff/application of held funds, and implicates card network rules on how chargebacks are funded and the order of application. It also raises funds-flow and safeguarding questions.
- **If held funds are a pure freeze:** The hold only delays payout pending review; funds are released (or the payment reversed) at the end of review. This is simpler and lower-risk, but does not by itself protect Mosaic Relay against chargebacks that arise during the hold.

**[GENERATED ANALYSIS]** The safest design for an initial version is a **pure freeze** — hold the affected amount pending review, then release or reverse. Using held funds to cover chargebacks, returns, or fees should be a separate, explicitly authorized capability, added only after the merchant agreement is amended to permit it and network rules are confirmed. This keeps the initial version simpler and reduces funds-flow risk.

### 3.4 Merchant notice and disclosure language

**[SUPPLIED FACT]** The proposed UX shows the merchant a banner explaining a review is in progress and prevents payout for the affected amount.

**[SUPPLIED FACT — UNRESOLVED]** Whether the banner alone satisfies disclosure requirements, and what notice timing is required, is **not decided**.

**[GENERATED ANALYSIS]** The in-product banner is a good start but is **likely insufficient on its own** as the merchant's only notice. Mosaic Relay should provide:
- **At-hold notice** (the banner) explaining a review is in progress, the affected amount, and that payout is temporarily held;
- **A durable notice** (e.g., email or in-dashboard notification) with the same information, the reason for the hold, the expected review timeline, and how to submit evidence; and
- **A release/extension notice** when the review concludes, explaining the outcome and next steps.

**[GENERATED ANALYSIS]** The notice should be **plain-language** and should state: (a) the hold is temporary and pending fraud review; (b) the affected amount; (c) the expected review period; (d) how to submit invoices or fulfillment evidence; and (e) the merchant's rights if the hold is extended or the payment reversed. This supports the appeal/evidence analysis below and reduces dispute risk.

**[UNVERIFIED AUTHORITY]** Whether specific disclosure language is required by regulation or network rule depends on the applicable framework. **[UNVERIFIED — see § 3.5 and § 3.6]**

### 3.5 Appeal or evidence rights

**[SUPPLIED FACT]** The proposed UX lets the merchant submit invoices or fulfillment evidence during the review.

**[SUPPLIED FACT — UNRESOLVED]** Whether a specific appeal process is required for merchants to contest a hold is **not decided**.

**[GENERATED ANALYSIS]** The evidence-submission path is the core of the merchant's ability to contest a hold. Even if no formal "appeal" is legally required, Mosaic Relay should provide a **defined evidence and review process** so the merchant can demonstrate the transactions are legitimate. This is both good customer experience and a risk-control measure — it lets operations release funds promptly when evidence resolves the concern.

**[GENERATED ANALYSIS]** Two viable approaches:
- **Path A — Evidence submission only.** The merchant submits invoices or fulfillment evidence; operations review and release, extend, or reverse. Simpler; matches the proposed UX.
- **Path B — Formal appeal with defined rights.** A defined appeal process with stated timelines, a review by a person or team not involved in the original hold decision, and a written outcome. More robust; higher operational cost.

**[GENERATED ANALYSIS]** For an initial version, **Path A (evidence submission with defined review timelines)** is likely sufficient, provided the merchant agreement and notice describe the process and the merchant has a clear way to submit evidence and receive an outcome. A formal appeal process (Path B) can be added later if disputes or network/regulatory requirements demand it.

### 3.6 Card network and processor requirements

**[SUPPLIED FACT]** Actors include acquiring banks, processors, card networks, and fraud vendors.

**[SUPPLIED FACT — UNRESOLVED]** Whether card networks and processors accept the proposed hold, reversal, and deactivation design is **unconfirmed**.

**[GENERATED ANALYSIS]** Card network rules (Visa/Mastercard) and acquiring-bank agreements govern merchant settlement, holds, reversals, and deactivation. These rules are **contractual and network-specific** and must be confirmed with the acquiring banks and processors before launch. Key questions:
- Do network rules permit a hold on merchant proceeds pending fraud review, and for how long?
- What are the rules for reversing a payment and deactivating processing during a fraud review?
- Do the networks require specific notice to the merchant or the cardholder?

**[GENERATED ANALYSIS]** Mosaic Relay must obtain **written confirmation** from acquiring banks and processors that they accept the proposed hold, reversal, and deactivation mechanics. If partners or networks require different mechanics, the design must change. This is a material dependency for the one-quarter timeline.

### 3.7 Money transmission / funds-flow implications

**[ASSUMPTION A2]** Mosaic Relay does not hold deposits or operate as a bank; holds are of merchant proceeds pending payout, not customer deposits.

**[GENERATED ANALYSIS]** Because Mosaic Relay holds merchant proceeds pending payout (not customer deposits), the control is a **delay in payout**, not the holding of customer funds. This reduces — but does not eliminate — money-transmission and safeguarding concerns. The key funds-flow question is whether the hold changes Mosaic Relay's exposure under state money transmission law or its acquiring/processor agreements.

**[UNVERIFIED AUTHORITY]** State money transmission licensing requirements and UCC Article 4A / NACHA rules on holding ACH proceeds were **not examined** in the research packet. **[UNVERIFIED]** These must be mapped and satisfied before launch, particularly for the ACH hold. If Mosaic Relay operates in states that impose additional licensing or funds-availability requirements, those must be confirmed.

**[GENERATED ANALYSIS]** The funds-flow design should be documented: where the held funds sit during the review, who controls them, and how they are released or reversed. This supports auditability and reduces regulatory and operational risk.

---

## 4. Proposed merchant notice language

**[GENERATED ANALYSIS — DRAFT LANGUAGE, NOT FINAL]** The following is proposed plain-language notice language for the at-hold banner and the durable notice. It is a starting point for review, not final legal language.

### 4.1 At-hold banner (in-product)

> **Review in progress**
> We're reviewing recent activity on your account for possible fraud. While the review is underway, **$[amount]** of your available payout is temporarily on hold. You can submit invoices or fulfillment evidence to help us complete the review faster. We'll let you know the outcome and release any funds that are not affected.

### 4.2 Durable notice (email or dashboard notification)

> **Subject: Your payout is temporarily on hold pending review**
>
> We're reviewing recent activity on your Mosaic Relay account for possible fraud. While the review is underway, **$[amount]** of your payout is temporarily on hold.
>
> **What you can do:** Submit invoices or fulfillment evidence for the affected transactions through your dashboard. This helps us complete the review faster.
>
> **What happens next:** We'll complete our review within [X] business days. If the transactions are confirmed, we'll release the held funds. If we need more time or need to reverse a payment, we'll let you know.
>
> **Questions?** Contact us at [support contact].

**[GENERATED ANALYSIS]** The notice should be reviewed against the merchant agreement and any network or regulatory disclosure requirements before finalization. The bracketed items (amount, review period, support contact) must be filled in from the final design.

---

## 5. Implementation checklist

**[GENERATED ANALYSIS]** Before launch, Mosaic Relay should complete the following:

1. **Amend the merchant agreement** to include an express right to hold proceeds pending fraud review, with defined triggers, scope, duration, release conditions, and evidence-submission rights. (Gating — currently unverified.)
2. **Set and document the maximum hold period** with a written risk-based rationale, and decide whether card vs. ACH timing differs.
3. **Decide the treatment of held funds** — for the initial version, a pure freeze (release or reverse at end of review) is the lower-risk path; using held funds for chargebacks/returns/fees should be a separate, explicitly authorized capability.
4. **Define the evidence and review process** — the merchant's path to submit invoices or fulfillment evidence, with defined review timelines and a clear outcome.
5. **Draft and implement the notice language** — at-hold banner plus durable notice, with release/extension notice at conclusion.
6. **Confirm card network and processor acceptance in writing** — that acquiring banks, processors, and networks accept the hold, reversal, and deactivation mechanics.
7. **Map state money transmission and UCC/NACHA requirements** for the ACH hold, and confirm funds-flow and safeguarding design.
8. **Implement recordkeeping and audit trails** for holds, reviews, evidence, and outcomes.

---

## 6. Recommendation

**[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**

**Recommendation: Proceed toward launch, but only on a conditional basis, and only if the conditions below are met early in the one-quarter window. Otherwise, delay.**

The one-quarter timeline is **tight but workable** for the design and control work, provided the following are resolved early:

1. **Confirm merchant agreement hold authority** (the single most decision-changing dependency). If the agreement lacks an express hold right, it must be amended before launch.
2. **Set and document the maximum hold period** and decide card vs. ACH timing, with a written risk-based rationale.
3. **Decide the treatment of held funds** — a pure freeze for the initial version is the lower-risk path.
4. **Confirm card network and processor acceptance in writing** of the hold, reversal, and deactivation mechanics.
5. **Define the evidence/review process and notice language**, and map state money transmission and UCC/NACHA requirements.

**Fallback (lower-risk) path:** If the merchant agreement cannot be amended or the hold period cannot be set and documented in time, **delay launch.** Launching without contractual authority or with an undocumented hold period creates regulatory and operational risk that outweighs the benefit of meeting the one-quarter target.

**This is a recommendation only.** It is not a recorded decision. Whether to proceed, delay, or adopt the fallback path is a decision for Jordan Lee and the business.

---

## 7. Missing facts and unverified leads

### 7.1 Missing facts (must be resolved before finalizing)

- **Merchant agreement hold provisions** — unverified; the primary contractual basis.
- **Maximum hold period and card vs. ACH timing** — undecided.
- **Treatment of held funds** (chargebacks, returns, fees) — undecided.
- **Appeal/evidence process** — undecided.
- **Customer-facing notice language and timing** — undecided.
- **Card network and processor acceptance** — unconfirmed.

### 7.2 Unverified authorities (must be confirmed before finalizing)

- **Card network rules** (Visa/Mastercard) on merchant holds, reversals, and deactivation during fraud review. **[UNVERIFIED]**
- **State money transmission licensing** requirements for holding merchant proceeds. **[UNVERIFIED]**
- **UCC Article 4A / NACHA rules** on holding ACH proceeds and funds availability. **[UNVERIFIED]**
- **Consumer protection and disclosure requirements** for holds on proceeds. **[UNVERIFIED]**

**Recommended next step:** Complete the background research runs and verify the cited authorities against current primary sources before this memo carries a final recommendation.

---

## 8. What would change this

- **Working assumption (A3 — merchant agreement authority):** If the merchant agreement already contains an express hold right, the gating dependency resolves and the design can proceed more quickly. If it does not, the agreement must be amended before launch, which is a material timeline risk for the one-quarter target.
- **Open fork (hold period):** If the hold period is set too long or lacks a documented risk-based rationale, networks or regulators may view it as excessive. If it is limited to a short, documented period, it is more defensible. Card and ACH may require different periods given their different frameworks.
- **Open fork (treatment of funds):** If held funds may be used to cover chargebacks, returns, or fees, the design must include setoff authorization and network-compliant application of funds. If the hold is a pure freeze, the design is simpler but does not protect against chargebacks arising during the hold.
- **Not examined (partner and network contracts):** The specific contractual requirements of Mosaic Relay's acquiring banks, processors, and card networks were not reviewed. The analysis assumes they impose their own requirements, but the exact terms are unknown.
- **Not examined (state licensing and UCC/NACHA):** State money transmission licensing and UCC Article 4A / NACHA rules on holding ACH proceeds were not examined. If Mosaic Relay operates in states imposing additional licensing or funds-availability requirements, those must be mapped and satisfied before launch.
- **Not examined (authority):** The background research runs are still completing; the regulatory citations in this memo are identified as likely material but have not been independently verified against current primary sources. This is the single most important gap before this memo carries a final recommendation.
