---
work_product_id: WP-87b7409ebfa3
matter_id: MAT-20260902-d26bf6
title: Privacy Review — Cross-Merchant Transaction Data for Fraud-Model Training (First-Pass
  Legal Analysis)
record_type: work_product
state: final
summary: ''
created_at: '2026-09-02T15:10:41+00:00'
updated_at: '2026-09-02T15:10:41+00:00'
immutable: true
source_action_key: chat:RUN-20260902-df6d94:tool:a28e9d3e0538617638c37fd8
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Privacy Review — Use of Cross-Merchant Transaction Data to Train a Fraud-Detection
      Model


      **Matter:** Mosaic Relay UX Test — 05 — Use of Transaction Data to Improve Fraud
      Models

      **Type:** Privacy review (first-pass legal analysis)

      **Status:** Draft for review — research in progress

      **Privilege:** Privileged and confidential / attorney work product


      ---


      ## 1. Purpose and scope


      Mosaic Relay proposes to use transaction metadata collected from multiple merchants
      to train a fraud-detection model. The data would include device signals, payment
      method details, transaction amounts, merchant category, broad regional location,
      dispute outcomes, and account events. The operation would remove direct identifiers,
      combine data across customers, and retain the training set for seven years.
      Model training would occur monthly, with model outputs used in real-time authorization
      and payout decisions. Mosaic Relay would not sell the data.


      This memo is a first-pass analysis built on the recorded facts, assumptions,
      and open items. It is not a final legal opinion. Several material facts remain
      unconfirmed (identifiers retained, contract terms, human-review practices, processing
      location), and the jurisdiction scope is global and not yet mapped. The analysis
      below flags where each open item changes the conclusion.


      **Working assumption (recorded):** No cross-merchant aggregation or secondary
      fraud-model training right should be assumed unless merchant contracts, DPAs,
      and service terms expressly permit it — including purpose, sharing with fraud
      vendors/cloud providers, retention, and deletion limits.


      ---


      ## 2. Lawful basis for cross-merchant aggregation and model training


      ### 2.1 Threshold question — is the data personal data?


      The analysis begins with whether the aggregated training data is personal data
      at all. Mosaic Relay believes aggregation and pseudonymization reduce privacy
      risk. That is only partially correct:


      - **Pseudonymization is not anonymization.** Under GDPR, pseudonymized data
      that can be linked back to an individual (e.g., via retained device IDs, IP
      addresses, account IDs, or email hashes) remains personal data and is fully
      subject to GDPR. Pseudonymization is a security and minimization measure (Art.
      32), not a route out of the regime.

      - **True anonymization** (irreversible, no reasonable means of re-identification,
      considering all means reasonably likely to be used) would take the data outside
      GDPR and most US state privacy laws. This is a high bar and depends on the exact
      identifiers retained.

      - **Device data is personal in some jurisdictions** (recorded fact). Device
      signals, device IDs, and IP addresses are personal data under GDPR and under
      several US state laws (e.g., CCPA/CPRA''s broad "personal information" definition
      includes identifiers such as IP addresses and device identifiers). This means
      the "mixed, varies by jurisdiction" finding is material: the operation cannot
      rely on a single global "not personal" characterization.


      **Open item that changes this analysis:** Which exact identifiers are retained
      after de-identification (engineering confirmation). If device IDs, IP addresses,
      or account IDs are retained, the data is almost certainly personal data in the
      EU and in several US states, and the full framework applies.


      ### 2.2 Lawful basis under GDPR


      If the data is personal data, Mosaic Relay needs a lawful basis under Art. 6
      for each processing purpose (collection, aggregation, training, and use of model
      outputs).


      - **Legitimate interests (Art. 6(1)(f))** is the most plausible basis for fraud-model
      training, given the strong fraud-prevention interest and the fact that Mosaic
      Relay would not sell the data. This requires a **legitimate-interests assessment
      (LIA)**: document the purpose, test necessity and proportionality, and balance
      against data subjects'' rights and interests. Fraud prevention is generally
      recognized as a legitimate interest, but the balancing must account for the
      sensitivity of the data and the breadth of cross-merchant aggregation.

      - **Contract necessity (Art. 6(1)(b))** is unlikely to cover secondary fraud-model
      training across merchants, because the training is not necessary to perform
      the specific contract with the individual merchant. It may cover the primary
      fraud-screening service but not the cross-merchant model build.

      - **Consent** is generally not practical or appropriate for B2B payment infrastructure
      and would be difficult to obtain from payers/recipients at scale. It should
      not be the primary basis.

      - **Legal obligation (Art. 6(1)(c))** may support some fraud/AML-related processing
      but does not by itself justify a seven-year cross-merchant training set.


      **Recommendation (analysis, not decision):** Rely on legitimate interests for
      the training use, supported by a documented LIA, and ensure the primary service
      basis (contract/legitimate interests) is separately documented. Do not assume
      consent.


      ### 2.3 US state frameworks


      Under CCPA/CPRA and other US state privacy laws, the key questions are whether
      the data is "personal information," whether the use is a "business purpose"
      (which can include fraud prevention and security), and whether any sale/share/use-for-targeted-advertising
      triggers opt-out rights. Fraud prevention is generally a recognized business
      purpose, but the cross-merchant aggregation and retention must be consistent
      with the stated business purpose and with any contractual limits.


      ---


      ## 3. Controller vs processor role allocation


      The roles are likely to vary by data flow and jurisdiction, and must be mapped
      per data category. This is a central issue because it determines who bears the
      obligations and what contracts are required.


      - **Mosaic Relay as processor for merchants:** For the primary payment/fraud
      service, Mosaic Relay likely processes personal data on behalf of merchants
      (controllers) and must operate under a DPA (Art. 28 under GDPR). As a processor,
      Mosaic Relay may only process on documented instructions from the controller
      — **it cannot unilaterally repurpose the data for cross-merchant model training**
      without the merchant''s authorization. This is the crux of the contract issue.

      - **Mosaic Relay as independent controller:** For data Mosaic Relay determines
      the purposes and means of (e.g., its own fraud-model training across merchants,
      its own risk controls), Mosaic Relay may be an independent controller. But this
      role cannot be assumed where the data originates from merchants'' processing;
      it must be established by contract and by actual control over purposes/means.

      - **Merchants:** Likely controllers of their customers'' (payers''/recipients'')
      data.

      - **Fraud vendors and cloud providers:** Likely processors (or sub-processors)
      acting on Mosaic Relay''s instructions, requiring DPAs and sub-processor controls.


      **Key implication:** The cross-merchant aggregation and secondary training use
      requires either (a) express authorization in the merchant contracts/DPAs (making
      Mosaic Relay a controller or joint controller for that use), or (b) a separate
      lawful basis and role allocation. The recorded working assumption — no aggregation
      right absent express permission — is the correct starting point.


      ---


      ## 4. Contract language with merchants and vendors


      Because the aggregation right cannot be assumed, contract language is a gating
      item. Recommended coverage (to be drafted once current contracts are reviewed):


      - **Purpose limitation:** Expressly authorize (or restrict) use of transaction
      data for cross-merchant fraud-model training and secondary fraud-prevention
      purposes.

      - **Role allocation:** Clearly state whether Mosaic Relay acts as processor,
      controller, or joint controller for the training use, and the corresponding
      obligations.

      - **Sharing with fraud vendors and cloud providers:** Authorize sub-processing
      and set sub-processor notice/objection and DPA requirements.

      - **Retention and deletion:** Set the seven-year retention period and deletion
      procedures, with justification tied to model lifecycle and fraud-prevention
      need.

      - **Data subject rights:** Allocate responsibility for handling consumer rights
      requests (access, deletion, opt-out) between Mosaic Relay and merchants.


      **Open item:** Current merchant contracts and data-use schedules have not been
      reviewed. The contract workstream depends on that review.


      ---


      ## 5. Notice and opt-out rights


      - **GDPR:** If Mosaic Relay is a controller for the training use, it must provide
      privacy notice (Arts. 13–14) covering the purposes, lawful basis, retention,
      and any automated decision-making. If the model makes decisions with legal or
      similarly significant effects, Art. 22 rights (below) may apply.

      - **CCPA/CPRA and US states:** Consumers must be informed of the categories
      of personal information collected and the purposes of use. If the use constitutes
      "sharing" or "selling" (broadly defined in some states), opt-out rights may
      attach. Fraud-prevention business purposes generally do not trigger sale/share
      opt-outs, but the characterization must be confirmed.

      - **Opt-out:** Whether consumers currently receive notice or have opt-out rights
      is **unconfirmed** (product/risk follow-up). This is a material gap.


      ---


      ## 6. Seven-year retention and deletion


      - **GDPR storage limitation (Art. 5(1)(e)):** Personal data must be kept no
      longer than necessary. A seven-year retention period for a training set requires
      a documented justification tied to the model''s useful life and fraud-prevention
      need, and a defined deletion schedule. Seven years is a long period and will
      draw scrutiny; it should be justified by model-governance and fraud-detection
      requirements, not convenience.

      - **Deletion procedures:** Mosaic Relay must have defined deletion procedures,
      including for the training set, and must ensure de-identified/anonymized data
      is not re-identifiable.

      - **US state laws:** Several state laws impose retention limits tied to the
      purpose of collection; retention must be consistent with the stated business
      purpose.


      **Open item:** Whether the training set is truly anonymized (and thus outside
      retention rules) depends on the identifiers retained.


      ---


      ## 7. Automated decision-making, human review, and consumer rights


      - **GDPR Art. 22:** A decision based solely on automated processing that produces
      legal or similarly significant effects triggers rights to human intervention,
      an explanation, and the ability to contest the decision. Real-time authorization
      and payout decisions driven by model outputs could qualify if they are "solely"
      automated and have significant effects (e.g., declining a payout). This requires
      analysis of whether human review occurs and whether the decisions are "solely"
      automated.

      - **CCPA/CPRA:** The CPRA regulates automated decision-making technology (profiling)
      and grants rights to access information about the logic and to opt out in certain
      cases. This is an evolving area.

      - **Human review:** Whether authorization/payout decisions are subject to human
      review today is **unconfirmed** (product/risk follow-up). If there is meaningful
      human review, Art. 22 may not apply; if decisions are fully automated, additional
      rights and safeguards are required.


      **Recommendation (analysis):** Confirm the human-review posture and, if decisions
      are solely automated with significant effects, plan for human-review mechanisms,
      explanation, and contest rights.


      ---


      ## 8. Cross-border transfers


      - **GDPR Chapter V:** Any transfer of personal data outside the EEA/UK requires
      a transfer mechanism (adequacy decision, SCCs, etc.). If data is processed/stored
      in cloud providers or fraud vendors outside the EEA/UK, transfer impact assessments
      and SCCs (with supplementary measures) may be required.

      - **Open item:** Where the data will be processed/stored and whether cross-border
      transfers are involved is **unconfirmed** (engineering follow-up). This is a
      material gap for the EU analysis.


      ---


      ## 9. Summary of open items that change the analysis


      | # | Open item | Owner | Impact |

      |---|-----------|-------|--------|

      | 1 | Exact identifiers retained after de-identification | Engineering | Determines
      whether data is personal data at all; drives de-identification standard and
      retention rules |

      | 2 | Jurisdiction scope and processing/storage location | Engineering | Determines
      which regimes apply and whether cross-border transfers are involved |

      | 3 | Current merchant contract terms on data use/aggregation | Contract review
      | Gates whether aggregation is permitted at all |

      | 4 | Human review and consumer notice/opt-out today | Product/Risk | Determines
      whether Art. 22 and notice/opt-out obligations attach |


      ---


      ## 10. Next steps


      1. Await first-pass research results (running in background) to support the
      above analysis with authority.

      2. Obtain engineering confirmation of identifiers retained and processing location.

      3. Review current merchant contracts and data-use schedules.

      4. Confirm human-review and notice/opt-out posture with product/risk.

      5. Draft recommended contract language for merchants and vendors.

      6. Prepare a final recommendation, kept separate from any decision.


      ---


      *This is a first-pass analysis for review. It is not a final legal opinion and
      does not constitute a decision. Recommendations are kept separate from any recorded
      decision.*

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
final_id: FINAL-20260902-c57895
finalized_at: '2026-09-02T15:12:49+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-05-use-of-transaction-data-to-improve-fraud-d26bf6/work-product/draft/privacy-review-cross-merchant-transaction-data-for-fraud-model-t-9ebfa3.md
source_content_hash: 6ca7c9d3c559dc1c3cee4a0a68c1cb59d22145ad531b2556b30d0c77906dcb14
---
# Privacy Review — Use of Cross-Merchant Transaction Data to Train a Fraud-Detection Model

**Matter:** Mosaic Relay UX Test — 05 — Use of Transaction Data to Improve Fraud Models
**Type:** Privacy review (first-pass legal analysis)
**Status:** Draft for review — research in progress
**Privilege:** Privileged and confidential / attorney work product

---

## 1. Purpose and scope

Mosaic Relay proposes to use transaction metadata collected from multiple merchants to train a fraud-detection model. The data would include device signals, payment method details, transaction amounts, merchant category, broad regional location, dispute outcomes, and account events. The operation would remove direct identifiers, combine data across customers, and retain the training set for seven years. Model training would occur monthly, with model outputs used in real-time authorization and payout decisions. Mosaic Relay would not sell the data.

This memo is a first-pass analysis built on the recorded facts, assumptions, and open items. It is not a final legal opinion. Several material facts remain unconfirmed (identifiers retained, contract terms, human-review practices, processing location), and the jurisdiction scope is global and not yet mapped. The analysis below flags where each open item changes the conclusion.

**Working assumption (recorded):** No cross-merchant aggregation or secondary fraud-model training right should be assumed unless merchant contracts, DPAs, and service terms expressly permit it — including purpose, sharing with fraud vendors/cloud providers, retention, and deletion limits.

---

## 2. Lawful basis for cross-merchant aggregation and model training

### 2.1 Threshold question — is the data personal data?

The analysis begins with whether the aggregated training data is personal data at all. Mosaic Relay believes aggregation and pseudonymization reduce privacy risk. That is only partially correct:

- **Pseudonymization is not anonymization.** Under GDPR, pseudonymized data that can be linked back to an individual (e.g., via retained device IDs, IP addresses, account IDs, or email hashes) remains personal data and is fully subject to GDPR. Pseudonymization is a security and minimization measure (Art. 32), not a route out of the regime.
- **True anonymization** (irreversible, no reasonable means of re-identification, considering all means reasonably likely to be used) would take the data outside GDPR and most US state privacy laws. This is a high bar and depends on the exact identifiers retained.
- **Device data is personal in some jurisdictions** (recorded fact). Device signals, device IDs, and IP addresses are personal data under GDPR and under several US state laws (e.g., CCPA/CPRA's broad "personal information" definition includes identifiers such as IP addresses and device identifiers). This means the "mixed, varies by jurisdiction" finding is material: the operation cannot rely on a single global "not personal" characterization.

**Open item that changes this analysis:** Which exact identifiers are retained after de-identification (engineering confirmation). If device IDs, IP addresses, or account IDs are retained, the data is almost certainly personal data in the EU and in several US states, and the full framework applies.

### 2.2 Lawful basis under GDPR

If the data is personal data, Mosaic Relay needs a lawful basis under Art. 6 for each processing purpose (collection, aggregation, training, and use of model outputs).

- **Legitimate interests (Art. 6(1)(f))** is the most plausible basis for fraud-model training, given the strong fraud-prevention interest and the fact that Mosaic Relay would not sell the data. This requires a **legitimate-interests assessment (LIA)**: document the purpose, test necessity and proportionality, and balance against data subjects' rights and interests. Fraud prevention is generally recognized as a legitimate interest, but the balancing must account for the sensitivity of the data and the breadth of cross-merchant aggregation.
- **Contract necessity (Art. 6(1)(b))** is unlikely to cover secondary fraud-model training across merchants, because the training is not necessary to perform the specific contract with the individual merchant. It may cover the primary fraud-screening service but not the cross-merchant model build.
- **Consent** is generally not practical or appropriate for B2B payment infrastructure and would be difficult to obtain from payers/recipients at scale. It should not be the primary basis.
- **Legal obligation (Art. 6(1)(c))** may support some fraud/AML-related processing but does not by itself justify a seven-year cross-merchant training set.

**Recommendation (analysis, not decision):** Rely on legitimate interests for the training use, supported by a documented LIA, and ensure the primary service basis (contract/legitimate interests) is separately documented. Do not assume consent.

### 2.3 US state frameworks

Under CCPA/CPRA and other US state privacy laws, the key questions are whether the data is "personal information," whether the use is a "business purpose" (which can include fraud prevention and security), and whether any sale/share/use-for-targeted-advertising triggers opt-out rights. Fraud prevention is generally a recognized business purpose, but the cross-merchant aggregation and retention must be consistent with the stated business purpose and with any contractual limits.

---

## 3. Controller vs processor role allocation

The roles are likely to vary by data flow and jurisdiction, and must be mapped per data category. This is a central issue because it determines who bears the obligations and what contracts are required.

- **Mosaic Relay as processor for merchants:** For the primary payment/fraud service, Mosaic Relay likely processes personal data on behalf of merchants (controllers) and must operate under a DPA (Art. 28 under GDPR). As a processor, Mosaic Relay may only process on documented instructions from the controller — **it cannot unilaterally repurpose the data for cross-merchant model training** without the merchant's authorization. This is the crux of the contract issue.
- **Mosaic Relay as independent controller:** For data Mosaic Relay determines the purposes and means of (e.g., its own fraud-model training across merchants, its own risk controls), Mosaic Relay may be an independent controller. But this role cannot be assumed where the data originates from merchants' processing; it must be established by contract and by actual control over purposes/means.
- **Merchants:** Likely controllers of their customers' (payers'/recipients') data.
- **Fraud vendors and cloud providers:** Likely processors (or sub-processors) acting on Mosaic Relay's instructions, requiring DPAs and sub-processor controls.

**Key implication:** The cross-merchant aggregation and secondary training use requires either (a) express authorization in the merchant contracts/DPAs (making Mosaic Relay a controller or joint controller for that use), or (b) a separate lawful basis and role allocation. The recorded working assumption — no aggregation right absent express permission — is the correct starting point.

---

## 4. Contract language with merchants and vendors

Because the aggregation right cannot be assumed, contract language is a gating item. Recommended coverage (to be drafted once current contracts are reviewed):

- **Purpose limitation:** Expressly authorize (or restrict) use of transaction data for cross-merchant fraud-model training and secondary fraud-prevention purposes.
- **Role allocation:** Clearly state whether Mosaic Relay acts as processor, controller, or joint controller for the training use, and the corresponding obligations.
- **Sharing with fraud vendors and cloud providers:** Authorize sub-processing and set sub-processor notice/objection and DPA requirements.
- **Retention and deletion:** Set the seven-year retention period and deletion procedures, with justification tied to model lifecycle and fraud-prevention need.
- **Data subject rights:** Allocate responsibility for handling consumer rights requests (access, deletion, opt-out) between Mosaic Relay and merchants.

**Open item:** Current merchant contracts and data-use schedules have not been reviewed. The contract workstream depends on that review.

---

## 5. Notice and opt-out rights

- **GDPR:** If Mosaic Relay is a controller for the training use, it must provide privacy notice (Arts. 13–14) covering the purposes, lawful basis, retention, and any automated decision-making. If the model makes decisions with legal or similarly significant effects, Art. 22 rights (below) may apply.
- **CCPA/CPRA and US states:** Consumers must be informed of the categories of personal information collected and the purposes of use. If the use constitutes "sharing" or "selling" (broadly defined in some states), opt-out rights may attach. Fraud-prevention business purposes generally do not trigger sale/share opt-outs, but the characterization must be confirmed.
- **Opt-out:** Whether consumers currently receive notice or have opt-out rights is **unconfirmed** (product/risk follow-up). This is a material gap.

---

## 6. Seven-year retention and deletion

- **GDPR storage limitation (Art. 5(1)(e)):** Personal data must be kept no longer than necessary. A seven-year retention period for a training set requires a documented justification tied to the model's useful life and fraud-prevention need, and a defined deletion schedule. Seven years is a long period and will draw scrutiny; it should be justified by model-governance and fraud-detection requirements, not convenience.
- **Deletion procedures:** Mosaic Relay must have defined deletion procedures, including for the training set, and must ensure de-identified/anonymized data is not re-identifiable.
- **US state laws:** Several state laws impose retention limits tied to the purpose of collection; retention must be consistent with the stated business purpose.

**Open item:** Whether the training set is truly anonymized (and thus outside retention rules) depends on the identifiers retained.

---

## 7. Automated decision-making, human review, and consumer rights

- **GDPR Art. 22:** A decision based solely on automated processing that produces legal or similarly significant effects triggers rights to human intervention, an explanation, and the ability to contest the decision. Real-time authorization and payout decisions driven by model outputs could qualify if they are "solely" automated and have significant effects (e.g., declining a payout). This requires analysis of whether human review occurs and whether the decisions are "solely" automated.
- **CCPA/CPRA:** The CPRA regulates automated decision-making technology (profiling) and grants rights to access information about the logic and to opt out in certain cases. This is an evolving area.
- **Human review:** Whether authorization/payout decisions are subject to human review today is **unconfirmed** (product/risk follow-up). If there is meaningful human review, Art. 22 may not apply; if decisions are fully automated, additional rights and safeguards are required.

**Recommendation (analysis):** Confirm the human-review posture and, if decisions are solely automated with significant effects, plan for human-review mechanisms, explanation, and contest rights.

---

## 8. Cross-border transfers

- **GDPR Chapter V:** Any transfer of personal data outside the EEA/UK requires a transfer mechanism (adequacy decision, SCCs, etc.). If data is processed/stored in cloud providers or fraud vendors outside the EEA/UK, transfer impact assessments and SCCs (with supplementary measures) may be required.
- **Open item:** Where the data will be processed/stored and whether cross-border transfers are involved is **unconfirmed** (engineering follow-up). This is a material gap for the EU analysis.

---

## 9. Summary of open items that change the analysis

| # | Open item | Owner | Impact |
|---|-----------|-------|--------|
| 1 | Exact identifiers retained after de-identification | Engineering | Determines whether data is personal data at all; drives de-identification standard and retention rules |
| 2 | Jurisdiction scope and processing/storage location | Engineering | Determines which regimes apply and whether cross-border transfers are involved |
| 3 | Current merchant contract terms on data use/aggregation | Contract review | Gates whether aggregation is permitted at all |
| 4 | Human review and consumer notice/opt-out today | Product/Risk | Determines whether Art. 22 and notice/opt-out obligations attach |

---

## 10. Next steps

1. Await first-pass research results (running in background) to support the above analysis with authority.
2. Obtain engineering confirmation of identifiers retained and processing location.
3. Review current merchant contracts and data-use schedules.
4. Confirm human-review and notice/opt-out posture with product/risk.
5. Draft recommended contract language for merchants and vendors.
6. Prepare a final recommendation, kept separate from any decision.

---

*This is a first-pass analysis for review. It is not a final legal opinion and does not constitute a decision. Recommendations are kept separate from any recorded decision.*
