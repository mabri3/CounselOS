---
work_product_id: WP-87b7409ebfa3
matter_id: MAT-20260902-d26bf6
title: Privacy Review — Cross-Merchant Transaction Data for Fraud-Model Training (First-Pass
  Legal Analysis)
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T15:10:41+00:00'
updated_at: '2026-09-02T15:14:56+00:00'
immutable: false
source_action_key: chat:RUN-20260902-df6d94:tool:a28e9d3e0538617638c37fd8
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
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
    change_id: CHG-20260902-5784dc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T15:14:56+00:00'
  - kind: insert
    text: '# Privacy Review — Use of Cross-Merchant Transaction Data to Train a Fraud-Detection
      Model

      ## Developed Lawyer Response (First-Pass, Pre-Launch)


      **Matter:** Mosaic Relay UX Test — 05 — Use of Transaction Data to Improve Fraud
      Models

      **Type:** Privacy review — developed lawyer response

      **Status:** Draft for review — research in progress (first-pass)

      **Privilege:** Privileged and confidential / attorney work product

      **Prepared for:** Mosaic Relay (Product) — needed before planned launch


      ---


      ## 0. How to read this response


      This is a **usable first-pass response** built on the recorded facts, assumptions,
      and open items. It is **not a final legal opinion** and does **not** constitute
      a decision. Four material facts remain unconfirmed and are flagged throughout;
      where an open item changes the conclusion, it is marked **[OPEN — changes analysis]**.
      The recommendation in Section 11 is analysis only and is kept separate from
      any durable decision.


      **Confirmed facts (recorded):**

      - Data is collected while Mosaic Relay provides payment and fraud services to
      merchants.

      - Mosaic Relay would not sell the data.

      - The operation would remove direct identifiers and combine data across customers.

      - The training set would be retained for seven years.

      - Model training would occur monthly, with outputs used in real-time authorization
      and payout decisions.

      - Data categories: device signals, payment method details, transaction amounts,
      merchant category, broad regional location, dispute outcomes, and account events.

      - Actors: Mosaic Relay, merchants, payers, recipients, fraud vendors, cloud
      providers, model-governance staff.

      - Device data treatment is **mixed — varies by jurisdiction**.

      - Legal answer is needed **before a planned launch**.


      **Working assumption (recorded):** No cross-merchant aggregation or secondary
      fraud-model training right should be assumed unless merchant contracts, DPAs,
      and service terms expressly permit it — including purpose, sharing with fraud
      vendors/cloud providers, retention, and deletion limits.


      **Missing facts (open items, all logged as work items):**

      1. Which exact identifiers are retained after de-identification (engineering).

      2. Where data is processed/stored and whether cross-border transfers are involved
      (engineering).

      3. Current merchant contract terms on data use and cross-merchant aggregation
      (contract review).

      4. Whether authorization/payout decisions are subject to human review today,
      and whether consumers receive notice/opt-out (product/risk).


      **Unverified research leads (flagged):** The first-pass research ran on model
      analysis only; **no external authority was retrieved** (external research timed
      out). The GDPR/CPRA principles cited below are standard and well-established,
      but the specific citations and any jurisdiction-specific nuances should be verified
      by counsel before the response is finalized or relied upon for launch.


      ---


      ## 1. Executive recommendation


      **Recommendation (analysis, not a decision):** Mosaic Relay should **not launch
      the cross-merchant fraud-model training as currently scoped** until it (a) confirms
      the exact identifiers retained, (b) secures express contractual authorization
      for cross-merchant aggregation, and (c) resolves the automated-decision and
      retention posture. The single most important gating issue is **contractual authorization**:
      as a processor for merchants, Mosaic Relay cannot unilaterally repurpose transaction
      data for cross-merchant model training. Absent express permission, the operation
      is not lawful regardless of technical de-identification.


      The lowest-risk path is to **treat the data as personal data** (do not rely
      on pseudonymization as a compliance shield), secure the aggregation right in
      merchant contracts, shorten the retention period to a defensible term, and implement
      human-review and consumer-rights safeguards for automated decisions. If engineering
      confirms **true anonymization** (irreversible, no re-identification means),
      the burden drops materially — but that is a high bar and should not be assumed.


      ---


      ## 2. Lawful purposes and lawful-basis analysis


      ### 2.1 Threshold: is the data personal data?

      The analysis starts with whether the aggregated training data is personal data
      at all. Mosaic Relay''s belief that aggregation and pseudonymization reduce
      privacy risk is only partially correct:


      - **Pseudonymization is not anonymization.** Under GDPR, pseudonymized data
      that can be linked back to an individual (via retained device IDs, IP addresses,
      account IDs, or email hashes) remains personal data and is fully subject to
      GDPR. Pseudonymization is a security/minimization measure (Art. 32), not a route
      out of the regime.

      - **True anonymization** (irreversible; no reasonable means of re-identification
      considering all means reasonably likely to be used) takes data outside GDPR
      and most US state privacy laws. This is a high bar and depends on the exact
      identifiers retained.

      - **Device data is personal in some jurisdictions** (recorded fact). Device
      signals, device IDs, and IP addresses are personal data under GDPR and under
      several US state laws (e.g., CCPA/CPRA''s broad "personal information" definition
      includes IP addresses and device identifiers). The "mixed, varies by jurisdiction"
      finding is material: Mosaic Relay cannot rely on a single global "not personal"
      characterization.


      **[OPEN — changes analysis]** Which exact identifiers are retained after de-identification
      (engineering). If device IDs, IP addresses, or account IDs are retained, the
      data is almost certainly personal data in the EU and several US states, and
      the full framework applies.


      ### 2.2 Lawful basis under GDPR

      If the data is personal data, Mosaic Relay needs a lawful basis under Art. 6
      for each purpose (collection, aggregation, training, and use of model outputs):


      - **Legitimate interests (Art. 6(1)(f))** is the most plausible basis for fraud-model
      training, given the strong fraud-prevention interest and that Mosaic Relay would
      not sell the data. This requires a **legitimate-interests assessment (LIA)**:
      document the purpose, test necessity and proportionality, and balance against
      data subjects'' rights and interests. Fraud prevention is generally recognized
      as a legitimate interest, but the balancing must account for the breadth of
      cross-merchant aggregation and the seven-year retention.

      - **Contract necessity (Art. 6(1)(b))** is unlikely to cover secondary cross-merchant
      model training, because the training is not necessary to perform the specific
      contract with the individual merchant. It may cover the primary fraud-screening
      service but not the cross-merchant model build.

      - **Consent** is generally not practical or appropriate for B2B payment infrastructure
      and would be difficult to obtain from payers/recipients at scale. It should
      not be the primary basis.

      - **Legal obligation (Art. 6(1)(c))** may support some fraud/AML-related processing
      but does not by itself justify a seven-year cross-merchant training set.


      **Recommendation (analysis):** Rely on legitimate interests for the training
      use, supported by a documented LIA, and separately document the primary service
      basis. Do not assume consent.


      ### 2.3 US state frameworks

      Under CCPA/CPRA and other US state privacy laws, the key questions are whether
      the data is "personal information," whether the use is a "business purpose"
      (which can include fraud prevention and security), and whether any sale/share/use-for-targeted-advertising
      triggers opt-out rights. Fraud prevention is generally a recognized business
      purpose, but the cross-merchant aggregation and retention must be consistent
      with the stated business purpose and with contractual limits.


      ---


      ## 3. Controller vs processor role map


      Roles likely vary by data flow and jurisdiction and must be mapped per data
      category. This is central because it determines who bears obligations and what
      contracts are required.


      | Actor | Likely role | Key obligation |

      |-------|-------------|----------------|

      | **Merchants** | Controllers of their customers'' (payers''/recipients'') data
      | Provide notice; authorize any secondary use |

      | **Mosaic Relay (primary service)** | Processor for merchants | Operate under
      a DPA (Art. 28); process only on documented instructions |

      | **Mosaic Relay (training use)** | Independent or joint controller (if it determines
      purposes/means) | Own lawful basis, notice, rights, retention, DPIA |

      | **Fraud vendors / cloud providers** | Processors / sub-processors | DPAs and
      sub-processor controls |


      **Key implication:** For the primary payment/fraud service, Mosaic Relay likely
      processes personal data on behalf of merchants (controllers) and must operate
      under a DPA. As a processor, Mosaic Relay may only process on documented instructions
      from the controller — **it cannot unilaterally repurpose the data for cross-merchant
      model training** without the merchant''s authorization. This is the crux of
      the contract issue. The cross-merchant aggregation and secondary training use
      requires either (a) express authorization in the merchant contracts/DPAs (making
      Mosaic Relay a controller or joint controller for that use), or (b) a separate
      lawful basis and role allocation. The recorded working assumption — no aggregation
      right absent express permission — is the correct starting point.


      ---


      ## 4. Contract clauses to add or confirm


      Because the aggregation right cannot be assumed, contract language is a **gating
      item**. Recommended coverage (to be finalized once current contracts are reviewed):


      1. **Purpose limitation** — Expressly authorize (or restrict) use of transaction
      data for cross-merchant fraud-model training and secondary fraud-prevention
      purposes.

      2. **Role allocation** — State clearly whether Mosaic Relay acts as processor,
      controller, or joint controller for the training use, and the corresponding
      obligations.

      3. **Sharing with fraud vendors and cloud providers** — Authorize sub-processing
      and set sub-processor notice/objection and DPA requirements.

      4. **Retention and deletion** — Set the retention period and deletion procedures,
      with justification tied to model lifecycle and fraud-prevention need.

      5. **Data subject rights** — Allocate responsibility for handling consumer rights
      requests (access, deletion, opt-out) between Mosaic Relay and merchants.

      6. **De-identification standard** — Contractually commit to the de-identification
      standard and prohibit re-identification.


      **[OPEN — changes analysis]** Current merchant contracts and data-use schedules
      have not been reviewed. The contract workstream depends on that review.


      ---


      ## 5. Notice and opt-out requirements


      - **GDPR:** If Mosaic Relay is a controller for the training use, it must provide
      privacy notice (Arts. 13–14) covering purposes, lawful basis, retention, and
      any automated decision-making. If the model makes decisions with legal or similarly
      significant effects, Art. 22 rights (Section 7) apply.

      - **CCPA/CPRA and US states:** Consumers must be informed of the categories
      of personal information collected and the purposes of use. If the use constitutes
      "sharing" or "selling" (broadly defined in some states), opt-out rights may
      attach. Fraud-prevention business purposes generally do not trigger sale/share
      opt-outs, but the characterization must be confirmed.

      - **Opt-out:** Whether consumers currently receive notice or have opt-out rights
      is **unconfirmed** (product/risk follow-up). This is a material gap.


      ---


      ## 6. Seven-year retention and deletion controls


      - **GDPR storage limitation (Art. 5(1)(e)):** Personal data must be kept no
      longer than necessary. A seven-year retention period for a training set requires
      a documented justification tied to the model''s useful life and fraud-prevention
      need, plus a defined deletion schedule. Seven years is a long period and will
      draw scrutiny; it should be justified by model-governance and fraud-detection
      requirements, not convenience. Industry norms for fraud-model training are typically
      shorter (roughly 2–5 years), so seven years is an outlier that needs a strong
      documented basis.

      - **Deletion procedures:** Mosaic Relay must have defined deletion procedures
      for the training set and must ensure de-identified/anonymized data is not re-identifiable.

      - **US state laws:** Several state laws impose retention limits tied to the
      purpose of collection; retention must be consistent with the stated business
      purpose.


      **Recommendation (analysis):** Shorten the retention period to a defensible
      term (e.g., 3–4 years) unless a documented legitimate-interest assessment supports
      longer, and implement automated deletion at the end of the period.


      **[OPEN — changes analysis]** Whether the training set is truly anonymized (and
      thus outside retention rules) depends on the identifiers retained.


      ---


      ## 7. De-identification standard


      - **GDPR:** Pseudonymized data remains personal data if the controller or a
      third party can re-identify individuals using additional information or reasonable
      means (Recital 26, Art. 4(5)). True anonymization requires irreversible de-identification
      such that re-identification is impossible using all means reasonably likely
      to be used. Device identifiers (IP addresses, device IDs, cookie identifiers)
      are expressly personal data under GDPR (Recital 30) even when pseudonymized.

      - **CCPA/CPRA:** De-identified data (Cal. Civ. Code § 1798.140(m)) is information
      that cannot reasonably be linked to a consumer or household, requiring technical
      and organizational safeguards to prevent re-identification. Pseudonymized data
      generally remains "personal information" unless it meets this high bar. California
      expressly includes IP addresses and device identifiers in the definition of
      personal information (§ 1798.140(o)(1)).

      - **Practical standard:** If Mosaic Relay retains device IDs, IP addresses,
      or account IDs (even hashed, if a key or lookup exists), the data is personal
      data. True anonymization requires removing all direct and indirect identifiers,
      aggregating to cohort level, applying differential privacy or k-anonymity thresholds,
      and prohibiting re-identification contractually and technically.


      **Recommendation (analysis):** Do not rely on pseudonymization as a compliance
      shield. Either (a) achieve true anonymization (lowest risk, but may reduce model
      utility) or (b) treat the data as personal data and comply with the full framework.


      **[OPEN — changes analysis]** Whether engineering can confirm irreversible hashing
      with no key retention determines whether anonymization is achievable.


      ---


      ## 8. Automated-decision and human-review requirements


      - **GDPR Art. 22:** A decision based solely on automated processing that produces
      legal or similarly significant effects triggers rights to human intervention,
      an explanation, and the ability to contest the decision. Real-time authorization
      and payout decisions driven by model outputs could qualify if they are "solely"
      automated and have significant effects (e.g., declining a payout or blocking
      access to funds). Exceptions (Art. 22(2)) include contract necessity, authorization
      by law, or explicit consent; even where an exception applies, Art. 22(3) requires
      safeguards including human intervention, the right to express a point of view,
      and the right to contest.

      - **CCPA/CPRA:** The CPRA regulates automated decision-making technology (profiling)
      and grants rights to access information about the logic and to opt out in certain
      cases. This is an evolving area.

      - **Human review:** Whether authorization/payout decisions are subject to human
      review today is **unconfirmed** (product/risk follow-up). If there is meaningful
      human review, Art. 22 may not apply; if decisions are fully automated, additional
      rights and safeguards are required.


      **Recommendation (analysis):** Confirm the human-review posture. If decisions
      are solely automated with significant effects, plan for human-review mechanisms,
      explanation, and contest rights before launch.


      **[OPEN — changes analysis]** Human-review and notice/opt-out posture (product/risk).


      ---


      ## 9. Cross-border transfer safeguards


      - **GDPR Chapter V:** Any transfer of personal data outside the EEA/UK requires
      a transfer mechanism (adequacy decision, standard contractual clauses, etc.).
      If data is processed/stored in cloud providers or fraud vendors outside the
      EEA/UK, transfer impact assessments and SCCs (with supplementary measures) may
      be required.

      - **Open item:** Where the data will be processed/stored and whether cross-border
      transfers are involved is **unconfirmed** (engineering follow-up). This is a
      material gap for the EU analysis.


      **Recommendation (analysis):** Once processing/storage locations are confirmed,
      map transfer flows and put in place the required transfer mechanisms and transfer
      impact assessments before launch.


      **[OPEN — changes analysis]** Processing/storage location and cross-border transfer
      scope (engineering).


      ---


      ## 10. Prioritized implementation checklist (pre-launch)


      **Gate 1 — Must resolve before launch (blocking):**

      1. **Confirm exact identifiers retained** after de-identification with engineering.
      Determines whether the data is personal data at all and which de-identification
      standard applies.

      2. **Secure contractual authorization** for cross-merchant aggregation and secondary
      fraud-model training in merchant contracts/DPAs. Without it, the operation is
      not lawful.

      3. **Confirm human-review posture** for authorization/payout decisions and consumer
      notice/opt-out with product/risk. Determines whether Art. 22 and notice/opt-out
      obligations attach.


      **Gate 2 — Must complete before launch (required):**

      4. **Map jurisdictions** of merchants, payers, and recipients; confirm device-data
      treatment in each location.

      5. **Confirm processing/storage locations** and cross-border transfer scope
      with engineering; put in place transfer mechanisms and transfer impact assessments.

      6. **Document the lawful basis** (legitimate-interests assessment) for the training
      use.

      7. **Conduct a DPIA** under GDPR Art. 35 (large-scale processing, automated
      decision-making, systematic monitoring).

      8. **Shorten and document retention** to a defensible term with automated deletion
      procedures.

      9. **Draft/update privacy notices** covering purposes, lawful basis, retention,
      and automated decision-making.

      10. **Implement Art. 22(3) safeguards** — human intervention, explanation, and
      contest rights — if automated decisions have significant effects.

      11. **Finalize contract language** with merchants and vendors (Section 4).


      **Gate 3 — Ongoing:**

      12. **Monitor regulatory developments** in automated decision-making and AI
      regulation (e.g., EU AI Act) that may impose additional requirements.


      ---


      ## 11. Recommendation (analysis only — kept separate from any decision)


      Based on the current facts, the **lowest-risk and most defensible path** is
      to treat the data as personal data, secure the aggregation right in merchant
      contracts, shorten retention, and implement human-review and consumer-rights
      safeguards. This is prudent because the exact identifiers retained, contract
      terms, human-review posture, and processing location are all unconfirmed — so
      assuming personal-data status and full compliance is the safe default.


      If engineering confirms **true anonymization** (irreversible, no re-identification
      means), the burden drops materially. If merchant contracts already permit the
      use and human review is in place, the burden also drops. These facts should
      be verified before finalizing the recommendation.


      **This is analysis and a recommendation only. It is not a durable decision.**
      The decision on how to proceed (including acceptable risk, retention term, and
      rollout scope) should be made by Mosaic Relay''s counsel and business leadership.
      Should this become a durable decision, that should be recorded separately.


      ---


      ## 12. Unverified research leads and caveats


      - **No external authority retrieved.** The first-pass research ran on model
      analysis only; external research timed out. The GDPR/CPRA principles cited are
      standard and well-established, but specific citations and jurisdiction-specific
      nuances should be verified by counsel before reliance.

      - **Jurisdiction scope is global and unmapped.** The analysis is jurisdiction-agnostic
      at the framework level; a jurisdiction map is required to confirm which specific
      laws apply.

      - **This is a first-pass response for pre-launch planning.** It is not a final
      legal opinion and does not constitute a decision.


      ---


      *This is a first-pass developed response for review. It is not a final legal
      opinion and does not constitute a decision. Recommendations are kept separate
      from any recorded decision.*

      '
    change_id: CHG-20260902-5784dc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T15:14:56+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-02T15:14:56+00:00'
last_source_action_key: chat:RUN-20260902-5a13bd:tool:d91d622a2a985809dfc612c4
---
# Privacy Review — Use of Cross-Merchant Transaction Data to Train a Fraud-Detection Model
## Developed Lawyer Response (First-Pass, Pre-Launch)

**Matter:** Mosaic Relay UX Test — 05 — Use of Transaction Data to Improve Fraud Models
**Type:** Privacy review — developed lawyer response
**Status:** Draft for review — research in progress (first-pass)
**Privilege:** Privileged and confidential / attorney work product
**Prepared for:** Mosaic Relay (Product) — needed before planned launch

---

## 0. How to read this response

This is a **usable first-pass response** built on the recorded facts, assumptions, and open items. It is **not a final legal opinion** and does **not** constitute a decision. Four material facts remain unconfirmed and are flagged throughout; where an open item changes the conclusion, it is marked **[OPEN — changes analysis]**. The recommendation in Section 11 is analysis only and is kept separate from any durable decision.

**Confirmed facts (recorded):**
- Data is collected while Mosaic Relay provides payment and fraud services to merchants.
- Mosaic Relay would not sell the data.
- The operation would remove direct identifiers and combine data across customers.
- The training set would be retained for seven years.
- Model training would occur monthly, with outputs used in real-time authorization and payout decisions.
- Data categories: device signals, payment method details, transaction amounts, merchant category, broad regional location, dispute outcomes, and account events.
- Actors: Mosaic Relay, merchants, payers, recipients, fraud vendors, cloud providers, model-governance staff.
- Device data treatment is **mixed — varies by jurisdiction**.
- Legal answer is needed **before a planned launch**.

**Working assumption (recorded):** No cross-merchant aggregation or secondary fraud-model training right should be assumed unless merchant contracts, DPAs, and service terms expressly permit it — including purpose, sharing with fraud vendors/cloud providers, retention, and deletion limits.

**Missing facts (open items, all logged as work items):**
1. Which exact identifiers are retained after de-identification (engineering).
2. Where data is processed/stored and whether cross-border transfers are involved (engineering).
3. Current merchant contract terms on data use and cross-merchant aggregation (contract review).
4. Whether authorization/payout decisions are subject to human review today, and whether consumers receive notice/opt-out (product/risk).

**Unverified research leads (flagged):** The first-pass research ran on model analysis only; **no external authority was retrieved** (external research timed out). The GDPR/CPRA principles cited below are standard and well-established, but the specific citations and any jurisdiction-specific nuances should be verified by counsel before the response is finalized or relied upon for launch.

---

## 1. Executive recommendation

**Recommendation (analysis, not a decision):** Mosaic Relay should **not launch the cross-merchant fraud-model training as currently scoped** until it (a) confirms the exact identifiers retained, (b) secures express contractual authorization for cross-merchant aggregation, and (c) resolves the automated-decision and retention posture. The single most important gating issue is **contractual authorization**: as a processor for merchants, Mosaic Relay cannot unilaterally repurpose transaction data for cross-merchant model training. Absent express permission, the operation is not lawful regardless of technical de-identification.

The lowest-risk path is to **treat the data as personal data** (do not rely on pseudonymization as a compliance shield), secure the aggregation right in merchant contracts, shorten the retention period to a defensible term, and implement human-review and consumer-rights safeguards for automated decisions. If engineering confirms **true anonymization** (irreversible, no re-identification means), the burden drops materially — but that is a high bar and should not be assumed.

---

## 2. Lawful purposes and lawful-basis analysis

### 2.1 Threshold: is the data personal data?
The analysis starts with whether the aggregated training data is personal data at all. Mosaic Relay's belief that aggregation and pseudonymization reduce privacy risk is only partially correct:

- **Pseudonymization is not anonymization.** Under GDPR, pseudonymized data that can be linked back to an individual (via retained device IDs, IP addresses, account IDs, or email hashes) remains personal data and is fully subject to GDPR. Pseudonymization is a security/minimization measure (Art. 32), not a route out of the regime.
- **True anonymization** (irreversible; no reasonable means of re-identification considering all means reasonably likely to be used) takes data outside GDPR and most US state privacy laws. This is a high bar and depends on the exact identifiers retained.
- **Device data is personal in some jurisdictions** (recorded fact). Device signals, device IDs, and IP addresses are personal data under GDPR and under several US state laws (e.g., CCPA/CPRA's broad "personal information" definition includes IP addresses and device identifiers). The "mixed, varies by jurisdiction" finding is material: Mosaic Relay cannot rely on a single global "not personal" characterization.

**[OPEN — changes analysis]** Which exact identifiers are retained after de-identification (engineering). If device IDs, IP addresses, or account IDs are retained, the data is almost certainly personal data in the EU and several US states, and the full framework applies.

### 2.2 Lawful basis under GDPR
If the data is personal data, Mosaic Relay needs a lawful basis under Art. 6 for each purpose (collection, aggregation, training, and use of model outputs):

- **Legitimate interests (Art. 6(1)(f))** is the most plausible basis for fraud-model training, given the strong fraud-prevention interest and that Mosaic Relay would not sell the data. This requires a **legitimate-interests assessment (LIA)**: document the purpose, test necessity and proportionality, and balance against data subjects' rights and interests. Fraud prevention is generally recognized as a legitimate interest, but the balancing must account for the breadth of cross-merchant aggregation and the seven-year retention.
- **Contract necessity (Art. 6(1)(b))** is unlikely to cover secondary cross-merchant model training, because the training is not necessary to perform the specific contract with the individual merchant. It may cover the primary fraud-screening service but not the cross-merchant model build.
- **Consent** is generally not practical or appropriate for B2B payment infrastructure and would be difficult to obtain from payers/recipients at scale. It should not be the primary basis.
- **Legal obligation (Art. 6(1)(c))** may support some fraud/AML-related processing but does not by itself justify a seven-year cross-merchant training set.

**Recommendation (analysis):** Rely on legitimate interests for the training use, supported by a documented LIA, and separately document the primary service basis. Do not assume consent.

### 2.3 US state frameworks
Under CCPA/CPRA and other US state privacy laws, the key questions are whether the data is "personal information," whether the use is a "business purpose" (which can include fraud prevention and security), and whether any sale/share/use-for-targeted-advertising triggers opt-out rights. Fraud prevention is generally a recognized business purpose, but the cross-merchant aggregation and retention must be consistent with the stated business purpose and with contractual limits.

---

## 3. Controller vs processor role map

Roles likely vary by data flow and jurisdiction and must be mapped per data category. This is central because it determines who bears obligations and what contracts are required.

| Actor | Likely role | Key obligation |
|-------|-------------|----------------|
| **Merchants** | Controllers of their customers' (payers'/recipients') data | Provide notice; authorize any secondary use |
| **Mosaic Relay (primary service)** | Processor for merchants | Operate under a DPA (Art. 28); process only on documented instructions |
| **Mosaic Relay (training use)** | Independent or joint controller (if it determines purposes/means) | Own lawful basis, notice, rights, retention, DPIA |
| **Fraud vendors / cloud providers** | Processors / sub-processors | DPAs and sub-processor controls |

**Key implication:** For the primary payment/fraud service, Mosaic Relay likely processes personal data on behalf of merchants (controllers) and must operate under a DPA. As a processor, Mosaic Relay may only process on documented instructions from the controller — **it cannot unilaterally repurpose the data for cross-merchant model training** without the merchant's authorization. This is the crux of the contract issue. The cross-merchant aggregation and secondary training use requires either (a) express authorization in the merchant contracts/DPAs (making Mosaic Relay a controller or joint controller for that use), or (b) a separate lawful basis and role allocation. The recorded working assumption — no aggregation right absent express permission — is the correct starting point.

---

## 4. Contract clauses to add or confirm

Because the aggregation right cannot be assumed, contract language is a **gating item**. Recommended coverage (to be finalized once current contracts are reviewed):

1. **Purpose limitation** — Expressly authorize (or restrict) use of transaction data for cross-merchant fraud-model training and secondary fraud-prevention purposes.
2. **Role allocation** — State clearly whether Mosaic Relay acts as processor, controller, or joint controller for the training use, and the corresponding obligations.
3. **Sharing with fraud vendors and cloud providers** — Authorize sub-processing and set sub-processor notice/objection and DPA requirements.
4. **Retention and deletion** — Set the retention period and deletion procedures, with justification tied to model lifecycle and fraud-prevention need.
5. **Data subject rights** — Allocate responsibility for handling consumer rights requests (access, deletion, opt-out) between Mosaic Relay and merchants.
6. **De-identification standard** — Contractually commit to the de-identification standard and prohibit re-identification.

**[OPEN — changes analysis]** Current merchant contracts and data-use schedules have not been reviewed. The contract workstream depends on that review.

---

## 5. Notice and opt-out requirements

- **GDPR:** If Mosaic Relay is a controller for the training use, it must provide privacy notice (Arts. 13–14) covering purposes, lawful basis, retention, and any automated decision-making. If the model makes decisions with legal or similarly significant effects, Art. 22 rights (Section 7) apply.
- **CCPA/CPRA and US states:** Consumers must be informed of the categories of personal information collected and the purposes of use. If the use constitutes "sharing" or "selling" (broadly defined in some states), opt-out rights may attach. Fraud-prevention business purposes generally do not trigger sale/share opt-outs, but the characterization must be confirmed.
- **Opt-out:** Whether consumers currently receive notice or have opt-out rights is **unconfirmed** (product/risk follow-up). This is a material gap.

---

## 6. Seven-year retention and deletion controls

- **GDPR storage limitation (Art. 5(1)(e)):** Personal data must be kept no longer than necessary. A seven-year retention period for a training set requires a documented justification tied to the model's useful life and fraud-prevention need, plus a defined deletion schedule. Seven years is a long period and will draw scrutiny; it should be justified by model-governance and fraud-detection requirements, not convenience. Industry norms for fraud-model training are typically shorter (roughly 2–5 years), so seven years is an outlier that needs a strong documented basis.
- **Deletion procedures:** Mosaic Relay must have defined deletion procedures for the training set and must ensure de-identified/anonymized data is not re-identifiable.
- **US state laws:** Several state laws impose retention limits tied to the purpose of collection; retention must be consistent with the stated business purpose.

**Recommendation (analysis):** Shorten the retention period to a defensible term (e.g., 3–4 years) unless a documented legitimate-interest assessment supports longer, and implement automated deletion at the end of the period.

**[OPEN — changes analysis]** Whether the training set is truly anonymized (and thus outside retention rules) depends on the identifiers retained.

---

## 7. De-identification standard

- **GDPR:** Pseudonymized data remains personal data if the controller or a third party can re-identify individuals using additional information or reasonable means (Recital 26, Art. 4(5)). True anonymization requires irreversible de-identification such that re-identification is impossible using all means reasonably likely to be used. Device identifiers (IP addresses, device IDs, cookie identifiers) are expressly personal data under GDPR (Recital 30) even when pseudonymized.
- **CCPA/CPRA:** De-identified data (Cal. Civ. Code § 1798.140(m)) is information that cannot reasonably be linked to a consumer or household, requiring technical and organizational safeguards to prevent re-identification. Pseudonymized data generally remains "personal information" unless it meets this high bar. California expressly includes IP addresses and device identifiers in the definition of personal information (§ 1798.140(o)(1)).
- **Practical standard:** If Mosaic Relay retains device IDs, IP addresses, or account IDs (even hashed, if a key or lookup exists), the data is personal data. True anonymization requires removing all direct and indirect identifiers, aggregating to cohort level, applying differential privacy or k-anonymity thresholds, and prohibiting re-identification contractually and technically.

**Recommendation (analysis):** Do not rely on pseudonymization as a compliance shield. Either (a) achieve true anonymization (lowest risk, but may reduce model utility) or (b) treat the data as personal data and comply with the full framework.

**[OPEN — changes analysis]** Whether engineering can confirm irreversible hashing with no key retention determines whether anonymization is achievable.

---

## 8. Automated-decision and human-review requirements

- **GDPR Art. 22:** A decision based solely on automated processing that produces legal or similarly significant effects triggers rights to human intervention, an explanation, and the ability to contest the decision. Real-time authorization and payout decisions driven by model outputs could qualify if they are "solely" automated and have significant effects (e.g., declining a payout or blocking access to funds). Exceptions (Art. 22(2)) include contract necessity, authorization by law, or explicit consent; even where an exception applies, Art. 22(3) requires safeguards including human intervention, the right to express a point of view, and the right to contest.
- **CCPA/CPRA:** The CPRA regulates automated decision-making technology (profiling) and grants rights to access information about the logic and to opt out in certain cases. This is an evolving area.
- **Human review:** Whether authorization/payout decisions are subject to human review today is **unconfirmed** (product/risk follow-up). If there is meaningful human review, Art. 22 may not apply; if decisions are fully automated, additional rights and safeguards are required.

**Recommendation (analysis):** Confirm the human-review posture. If decisions are solely automated with significant effects, plan for human-review mechanisms, explanation, and contest rights before launch.

**[OPEN — changes analysis]** Human-review and notice/opt-out posture (product/risk).

---

## 9. Cross-border transfer safeguards

- **GDPR Chapter V:** Any transfer of personal data outside the EEA/UK requires a transfer mechanism (adequacy decision, standard contractual clauses, etc.). If data is processed/stored in cloud providers or fraud vendors outside the EEA/UK, transfer impact assessments and SCCs (with supplementary measures) may be required.
- **Open item:** Where the data will be processed/stored and whether cross-border transfers are involved is **unconfirmed** (engineering follow-up). This is a material gap for the EU analysis.

**Recommendation (analysis):** Once processing/storage locations are confirmed, map transfer flows and put in place the required transfer mechanisms and transfer impact assessments before launch.

**[OPEN — changes analysis]** Processing/storage location and cross-border transfer scope (engineering).

---

## 10. Prioritized implementation checklist (pre-launch)

**Gate 1 — Must resolve before launch (blocking):**
1. **Confirm exact identifiers retained** after de-identification with engineering. Determines whether the data is personal data at all and which de-identification standard applies.
2. **Secure contractual authorization** for cross-merchant aggregation and secondary fraud-model training in merchant contracts/DPAs. Without it, the operation is not lawful.
3. **Confirm human-review posture** for authorization/payout decisions and consumer notice/opt-out with product/risk. Determines whether Art. 22 and notice/opt-out obligations attach.

**Gate 2 — Must complete before launch (required):**
4. **Map jurisdictions** of merchants, payers, and recipients; confirm device-data treatment in each location.
5. **Confirm processing/storage locations** and cross-border transfer scope with engineering; put in place transfer mechanisms and transfer impact assessments.
6. **Document the lawful basis** (legitimate-interests assessment) for the training use.
7. **Conduct a DPIA** under GDPR Art. 35 (large-scale processing, automated decision-making, systematic monitoring).
8. **Shorten and document retention** to a defensible term with automated deletion procedures.
9. **Draft/update privacy notices** covering purposes, lawful basis, retention, and automated decision-making.
10. **Implement Art. 22(3) safeguards** — human intervention, explanation, and contest rights — if automated decisions have significant effects.
11. **Finalize contract language** with merchants and vendors (Section 4).

**Gate 3 — Ongoing:**
12. **Monitor regulatory developments** in automated decision-making and AI regulation (e.g., EU AI Act) that may impose additional requirements.

---

## 11. Recommendation (analysis only — kept separate from any decision)

Based on the current facts, the **lowest-risk and most defensible path** is to treat the data as personal data, secure the aggregation right in merchant contracts, shorten retention, and implement human-review and consumer-rights safeguards. This is prudent because the exact identifiers retained, contract terms, human-review posture, and processing location are all unconfirmed — so assuming personal-data status and full compliance is the safe default.

If engineering confirms **true anonymization** (irreversible, no re-identification means), the burden drops materially. If merchant contracts already permit the use and human review is in place, the burden also drops. These facts should be verified before finalizing the recommendation.

**This is analysis and a recommendation only. It is not a durable decision.** The decision on how to proceed (including acceptable risk, retention term, and rollout scope) should be made by Mosaic Relay's counsel and business leadership. Should this become a durable decision, that should be recorded separately.

---

## 12. Unverified research leads and caveats

- **No external authority retrieved.** The first-pass research ran on model analysis only; external research timed out. The GDPR/CPRA principles cited are standard and well-established, but specific citations and jurisdiction-specific nuances should be verified by counsel before reliance.
- **Jurisdiction scope is global and unmapped.** The analysis is jurisdiction-agnostic at the framework level; a jurisdiction map is required to confirm which specific laws apply.
- **This is a first-pass response for pre-launch planning.** It is not a final legal opinion and does not constitute a decision.

---

*This is a first-pass developed response for review. It is not a final legal opinion and does not constitute a decision. Recommendations are kept separate from any recorded decision.*
