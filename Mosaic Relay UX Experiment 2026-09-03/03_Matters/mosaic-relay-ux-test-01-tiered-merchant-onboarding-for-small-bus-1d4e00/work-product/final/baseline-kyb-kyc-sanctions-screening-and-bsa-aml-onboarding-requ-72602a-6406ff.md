---
work_product_id: WP-cbc0c972602a
matter_id: MAT-20260903-1d4e00
title: Baseline KYB/KYC, Sanctions Screening, and BSA/AML Onboarding Requirements
  for a U.S. Payments Infrastructure Provider
record_type: work_product
state: final
summary: ''
created_at: '2026-09-03T08:41:18+00:00'
updated_at: '2026-09-03T08:42:29+00:00'
immutable: true
source_action_key: chat:RUN-20260903-5ef86f:tool:cf76ebb8142c140b18a47646
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
    text: "# Baseline KYB/KYC, Sanctions Screening, and BSA/AML Onboarding Requirements\
      \ for a U.S. Payments Infrastructure Provider\n\n**Matter:** Mosaic Relay UX\
      \ Test — 01 — Tiered Merchant Onboarding for Small Businesses\n**Status:** Draft\
      \ for review\n**Scope:** Baseline onboarding obligations that apply regardless\
      \ of the tiered-flow design, drawn from the saved research packet.\n\n---\n\n\
      ## 1. Purpose and scope of this draft\n\nThis draft maps the baseline KYB/KYC,\
      \ sanctions screening, and BSA/AML onboarding requirements that a U.S. payments\
      \ infrastructure provider must satisfy, independent of the tiered-flow design.\
      \ It is the foundation for assessing whether Mosaic Relay's proposed tiered\
      \ onboarding flow is legally acceptable. It does not yet resolve the tiering-specific\
      \ questions (volume threshold, beneficial-owner data set, pending-review processing,\
      \ partner acceptance), which are addressed separately.\n\n**Important caveat\
      \ on authority:** The saved research packet is a first-pass, model-only analysis.\
      \ No external authority was retrieved (the external research run timed out).\
      \ The regulatory citations below are identified as likely material from the\
      \ general U.S. framework but have **not** been independently verified against\
      \ current primary sources. This draft should be treated as a working analysis\
      \ to be confirmed before it carries a final recommendation.\n\n---\n\n## 2.\
      \ Baseline KYB/KYC requirements\n\n**What is required at a baseline level:**\n\
      - Collect and verify the business's **legal name, registration details, and\
      \ owners** — the core KYB data elements Mosaic Relay already proposes to collect.\n\
      - Collect **beneficial-owner information** at the **25% ownership threshold**\
      \ and **control-person details**, consistent with FinCEN's Customer Due Diligence\
      \ (CDD) Rule (31 C.F.R. § 1010.230) for covered financial institutions.\n- Verify\
      \ identity of the business and its beneficial owners before onboarding.\n\n\
      **Key point for Mosaic Relay:** Mosaic Relay states it does not hold deposits\
      \ or operate as a bank. Whether the CDD Rule applies directly to Mosaic Relay\
      \ depends on its classification (see BSA/AML section below). However, its **acquiring\
      \ partners and payment processors are likely subject to CDD requirements** and\
      \ may contractually require Mosaic Relay to collect equivalent information.\
      \ The lower-verification tier **cannot skip beneficial-owner collection entirely**\
      \ if partners require it.\n\n**Implication for the tiered flow:** The baseline\
      \ KYB/KYC floor cannot be tiered away. Tiering may reduce *friction* (automation,\
      \ fewer manual steps) but not the *substance* of identity and beneficial-owner\
      \ verification where partners or regulation require it.\n\n---\n\n## 3. Sanctions\
      \ screening requirements\n\n**What is required at a baseline level:**\n- Screen\
      \ all merchants against the **OFAC SDN List** and other applicable sanctions\
      \ lists.\n- Screening is **not tiered or volume-dependent** — every merchant,\
      \ regardless of risk score or transaction volume, must be screened before onboarding\
      \ and on an ongoing basis.\n\n**Key point for Mosaic Relay:** The proposal includes\
      \ sanctions screening, which is correct. But the flow must ensure screening\
      \ is **completed before API credentials are issued**, not after. Issuing credentials\
      \ to a sanctioned party, even briefly, risks facilitating prohibited transactions.\n\
      \n**Implication for the tiered flow:** The \"low-risk applicants receive API\
      \ credentials within minutes\" path is only acceptable if sanctions screening\
      \ is a mandatory, completed gate in that path. This is a hard requirement, not\
      \ a tiering variable.\n\n---\n\n## 4. BSA/AML program requirements\n\n**What\
      \ is required at a baseline level:**\n- If Mosaic Relay is classified as a **money\
      \ services business (MSB)** under FinCEN regulations (31 C.F.R. § 1010.100(ff)),\
      \ it must maintain a **written AML program** with:\n  - a designated compliance\
      \ officer,\n  - employee training,\n  - independent testing/audit, and\n  -\
      \ internal policies, procedures, and controls.\n- MSBs must file **Suspicious\
      \ Activity Reports (SARs)** and **Currency Transaction Reports (CTRs)** when\
      \ applicable.\n\n**Key point for Mosaic Relay:** The tiered flow does **not**\
      \ eliminate these obligations. Lower verification for low-volume merchants is\
      \ permissible only if the overall AML program remains **risk-based and effective**.\
      \ The proposed volume threshold must be supported by a **documented risk-based\
      \ rationale**, and Mosaic Relay must monitor whether low-volume merchants are\
      \ being used to **structure transactions or evade controls**.\n\n**Implication\
      \ for the tiered flow:** Tiering is a risk-based technique, but it must sit\
      \ inside a compliant AML program. A threshold set without a documented basis,\
      \ or one that creates a structuring loophole, undermines the program.\n\n---\n\
      \n## 5. Recordkeeping requirements\n\n**What is required at a baseline level:**\n\
      - Retain customer identification records, transaction records, and SARs for\
      \ **five years** (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410).\n- Log and retain\
      \ all collected data, screening results, risk scores, and onboarding decisions.\n\
      \n**Key point for Mosaic Relay:** The tiered flow must capture and retain the\
      \ full audit trail — including when lower-tier merchants are upgraded, when\
      \ beneficial-owner data is refreshed, and when additional verification is performed.\n\
      \n---\n\n## 6. Customer notices\n\n**What is required at a baseline level:**\n\
      - Provide clear notices to merchants about what information is collected, how\
      \ it is used, and what the tiered verification process entails.\n- Give timely\
      \ notice when a merchant is placed in manual review or subject to transaction\
      \ limits.\n- Comply with applicable privacy laws (e.g., CCPA if California residents\
      \ are involved).\n\n---\n\n## 7. Partner and processor requirements (cross-cutting)\n\
      \nAcquiring banks and payment processors impose their own underwriting and onboarding\
      \ requirements, which may be **more stringent** than Mosaic Relay's proposed\
      \ tiered flow. Mosaic Relay must confirm that partners will accept the lower-verification\
      \ tier and the proposed volume threshold. If partners require full KYB and beneficial-owner\
      \ data for all merchants regardless of volume, the tiered flow is **not viable\
      \ as proposed**.\n\n---\n\n## 8. Baseline requirements that cannot be tiered\
      \ away (summary)\n\n| Requirement | Tierable? | Notes |\n|---|---|---|\n| Sanctions\
      \ screening before credentialing | **No** | Mandatory gate for every merchant,\
      \ before API credentials |\n| Beneficial-owner collection (25% + control persons)\
      \ | **No** (if partners/regulation require) | Cannot be skipped for low-volume\
      \ tier if partners require it |\n| Identity verification of business and owners\
      \ | **No** (substance) | Tiering may reduce friction, not substance |\n| Written\
      \ AML program (if MSB) | **No** | Tiering sits inside the program, does not\
      \ replace it |\n| Recordkeeping (5 years) | **No** | Full audit trail required\
      \ |\n| Risk-based rationale for any threshold | **No** | Threshold must be documented\
      \ and monitored for structuring |\n\n---\n\n## 9. What would change this\n\n\
      - **Working assumption:** Mosaic Relay is classified as a money services business\
      \ (MSB) under FinCEN regulations and is subject to BSA/AML program requirements.\
      \ If Mosaic Relay is not an MSB (e.g., it qualifies for an exemption or operates\
      \ solely as an agent of another MSB), the BSA/AML analysis would change, though\
      \ partner and processor requirements would still apply.\n- **Open fork:** Whether\
      \ acquiring partners and payment processors will accept the tiered verification\
      \ levels and lower volume threshold. If partners require full KYB for all merchants,\
      \ the tiered flow is not viable. If partners accept tiering, Mosaic Relay can\
      \ proceed with a tiered flow subject to documented risk-based controls.\n- **Not\
      \ examined:** The specific contractual requirements of Mosaic Relay's acquiring\
      \ partners and payment processors. The analysis assumes partners impose their\
      \ own onboarding and underwriting requirements, but the exact terms have not\
      \ been reviewed.\n- **Not examined:** State money transmission licensing requirements.\
      \ The analysis focuses on federal BSA/AML and sanctions obligations. If Mosaic\
      \ Relay operates in states that impose additional licensing or onboarding requirements\
      \ for money transmitters, those must be mapped and satisfied before launch.\n\
      - **Not examined (authority):** No external authority was retrieved in the research\
      \ packet (external research timed out). The regulatory citations in this draft\
      \ are identified as likely material but have not been independently verified\
      \ against current primary sources. This is the single most important gap before\
      \ this draft carries a final recommendation.\n\n---\n\n## 10. Recommended next\
      \ steps before finalizing\n\n1. **Verify authority.** Re-run external research\
      \ to confirm the cited regulations (CDD Rule, MSB definition, recordkeeping,\
      \ OFAC screening) against current primary sources.\n2. **Confirm partner and\
      \ processor requirements.** Obtain written confirmation from acquiring banks\
      \ and payment processors that they will accept the tiered verification levels\
      \ and proposed volume threshold.\n3. **Document the risk-based basis for the\
      \ volume threshold.** Prepare a written risk assessment explaining how the threshold\
      \ was set and why it is appropriate for each payment method.\n4. **Define the\
      \ beneficial-owner data set and refresh cadence.**\n5. **Set transaction limits\
      \ for pending review** (if limited processing is allowed), with sanctions screening\
      \ completed before any transactions.\n6. **Implement recordkeeping and audit\
      \ trails** (five-year retention).\n7. **Draft customer notices.**\n"
    change_id: CHG-20260903-c0480c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T08:42:30+00:00'
  - kind: insert
    text: '# Developed First-Pass Legal Memo — Tiered Merchant Onboarding for Small
      Businesses


      **Matter:** Mosaic Relay UX Test — 01 — Tiered Merchant Onboarding for Small
      Businesses

      **Status:** First-pass legal memo (draft for review)

      **Prepared for:** Jordan Lee, Senior Product Counsel

      **Prepared by:** Themis.ai (workspace guidance)

      **Date:** 2026-09-03


      ---


      ## How to read this memo


      This memo is a **developed first-pass analysis**, not a final legal opinion.
      It integrates (a) the saved first-pass research packet on baseline KYB/KYC,
      sanctions, and BSA/AML obligations and (b) the unresolved intake facts on the
      tiered flow. It is organized so that **supplied facts, assumptions, generated
      analysis, and unverified authorities are clearly labeled** throughout.


      **Critical authority caveat (read first):** The saved research packet is **model-only**
      — no external authority was retrieved (the external research run timed out).
      The regulatory citations below (CDD Rule, MSB definition, recordkeeping, OFAC
      screening) are identified as **likely material** from the general U.S. framework
      but have **not been independently verified against current primary sources**.
      Every citation is labeled **[UNVERIFIED]** and must be confirmed before this
      memo carries a final recommendation. This is the single most important gap in
      this memo.


      ---


      ## 1. Executive conclusion


      **[GENERATED ANALYSIS]** Mosaic Relay can likely launch a tiered merchant onboarding
      flow in six weeks, **but not in the form Product has proposed as currently specified.**
      The proposal is legally acceptable only if four conditions are met before launch:


      1. **Sanctions screening is a mandatory, completed gate before any API credentials
      are issued** — for every merchant, regardless of tier or volume. This is a hard,
      non-tierable requirement. The "credentials within minutes" path is only acceptable
      if screening completes first.

      2. **The lower-verification tier does not skip beneficial-owner collection**
      where acquiring partners or processors require it. The baseline KYB/KYC floor
      cannot be tiered away; tiering may reduce friction, not substance.

      3. **The monthly volume threshold is set with a documented, risk-based rationale**
      and is calibrated per payment method and jurisdiction — not a single uniform
      number applied blindly. As of intake, **no threshold has been set and no basis
      documented**.

      4. **Acquiring partners and processors confirm in writing** they will accept
      the tiered verification levels and the lower threshold. As of intake, **this
      is unconfirmed** — and if partners require full KYB for all merchants, the tiered
      flow is **not viable as proposed**.


      **[GENERATED ANALYSIS]** The single most decision-changing unknown is **partner/processor
      acceptance**. Everything else can be designed around; partner rejection of the
      tiered levels would invalidate the flow as proposed. The second most decision-changing
      unknown is the **unset volume threshold** — without a documented risk basis,
      the tiering structure cannot be defended.


      **[GENERATED ANALYSIS]** The six-week timeline is **tight but workable** for
      the design and control work, provided the four conditions above are resolved
      early. If partner confirmation or the risk-based threshold cannot be completed
      in time, **delaying launch is the lower-risk path** — launching with unresolved
      beneficial-owner requirements, an undocumented threshold, or unclear pending-review
      limits creates regulatory and operational risk that outweighs the benefit of
      launching before the holiday sales period.


      ---


      ## 2. Scope and assumptions


      ### 2.1 Scope


      **[SUPPLIED FACT]** Mosaic Relay provides payment infrastructure and does not
      hold deposits or operate as a bank. It proposes a tiered onboarding flow: the
      business provides legal name, registration details, owners, expected volume,
      countries, and payment methods; Mosaic Relay runs KYB, identity verification,
      sanctions screening, and risk scoring; low-risk applicants receive API credentials
      within minutes; higher-risk or incomplete applications move to a manual review
      queue. Target launch is in six weeks before the holiday sales period.


      **[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved
      and materially affect this analysis:

      - **Payment methods and jurisdictions in scope: NOT DECIDED.** This determines
      whether a single volume threshold can apply uniformly.

      - **Monthly volume threshold: NOT SET.** No documented risk-based basis; suitability
      across payment methods/jurisdictions unconfirmed.

      - **Pending-review processing: NOT DECIDED.** Whether a merchant may process
      limited transactions while in manual review is unresolved.

      - **Beneficial-owner data set and refresh cadence: NOT SETTLED.** Ownership
      percentages, control-person details, supporting documents, and refresh triggers/frequency
      remain open.

      - **Partner/processor acceptance: NOT CONFIRMED.** Whether acquiring partners
      and processors will accept the tiered verification levels and lower threshold
      is unconfirmed.


      ### 2.2 Assumptions


      **[ASSUMPTION]** The following are working assumptions, not established facts:

      - **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United
      States in this scenario; any non-U.S. expansion is subject to separate legal
      review. This memo analyzes U.S. federal obligations only.

      - **A2 — Standard methods in scope.** The tiered flow applies to Mosaic Relay''s
      standard card, ACH, and local payment methods unless otherwise specified.

      - **A3 — MSB classification.** Mosaic Relay is classified as a money services
      business (MSB) under FinCEN regulations and is subject to BSA/AML program requirements.
      **[UNVERIFIED]** If Mosaic Relay is not an MSB (e.g., it qualifies for an exemption
      or operates solely as an agent of another MSB), the BSA/AML analysis changes,
      though partner and processor requirements would still apply.

      - **A4 — Partner requirements.** Mosaic Relay''s acquiring partners and processors
      impose their own onboarding and underwriting requirements that must be reconciled
      with the tiered flow. The exact contractual terms have not been reviewed.


      ---


      ## 3. Required KYB/KYC, beneficial-owner, and sanctions checks


      ### 3.1 KYB/KYC baseline


      **[GENERATED ANALYSIS]** At a baseline level, Mosaic Relay must collect and
      verify the business''s **legal name, registration details, and owners** — the
      core KYB data elements it already proposes to collect. It must verify the identity
      of the business and its beneficial owners before onboarding.


      **[UNVERIFIED AUTHORITY]** FinCEN''s Customer Due Diligence (CDD) Rule (31 C.F.R.
      § 1010.230) requires covered financial institutions to collect beneficial-owner
      information at the **25% ownership threshold** and **control-person details**.
      **[UNVERIFIED]** Whether the CDD Rule applies directly to Mosaic Relay depends
      on its classification (see § 6). However, its **acquiring partners and payment
      processors are likely subject to CDD requirements** and may contractually require
      Mosaic Relay to collect equivalent information.


      **[GENERATED ANALYSIS — KEY POINT]** The lower-verification tier **cannot skip
      beneficial-owner collection entirely** if partners require it. The baseline
      KYB/KYC floor cannot be tiered away. Tiering may reduce *friction* (automation,
      fewer manual steps) but not the *substance* of identity and beneficial-owner
      verification where partners or regulation require it.


      ### 3.2 Beneficial-owner data set and refresh cadence


      **[SUPPLIED FACT — UNRESOLVED]** Product has not settled the beneficial-owner
      data set or refresh cycle. Legal name, registration details, owners, and identity
      verification are proposed inputs, but **required ownership percentages, control-person
      details, supporting documents, and refresh triggers or frequency remain open.**


      **[GENERATED ANALYSIS]** Before launch, Mosaic Relay should define:

      - **Data set:** name, date of birth, address, ownership percentage, and control-person
      details, plus supporting documents (e.g., formation documents, ID) as partners
      require.

      - **Refresh cadence:** at minimum on **trigger events** (ownership changes,
      risk-score increases, material changes to the business) and on a periodic cycle
      (e.g., annual) consistent with partner and regulatory expectations.


      **[GENERATED ANALYSIS]** If Mosaic Relay collects only minimal beneficial-owner
      data (e.g., name and ownership percentage) without control-person details or
      supporting documents, it may not satisfy partner or regulatory expectations.
      This is a material gap that must be closed before launch.


      ### 3.3 Sanctions screening


      **[GENERATED ANALYSIS]** OFAC sanctions screening is **not tiered or volume-dependent.**
      Every merchant, regardless of risk score or transaction volume, must be screened
      against the **OFAC SDN List** and other applicable sanctions lists before onboarding
      and on an ongoing basis. **[UNVERIFIED AUTHORITY — OFAC SDN List screening obligation]**


      **[GENERATED ANALYSIS — KEY POINT]** The proposal includes sanctions screening,
      which is correct. But the flow must ensure screening is **completed before API
      credentials are issued, not after.** Issuing credentials to a sanctioned party,
      even briefly, risks facilitating prohibited transactions. This is a **hard,
      non-tierable gate** on the "credentials within minutes" path.


      ---


      ## 4. Risk-based tiering and transaction limits


      ### 4.1 Is tiering permissible?


      **[GENERATED ANALYSIS]** Tiering based on transaction volume is a common risk-based
      approach and is permissible **in principle**, provided it sits inside a compliant
      AML program and the threshold is calibrated to risk. The proposal''s core problem
      is not tiering itself — it is that **the threshold is unset and undocumented**,
      and that a **single uniform threshold may not be suitable across payment methods
      and jurisdictions.**


      ### 4.2 The volume threshold problem


      **[SUPPLIED FACT — UNRESOLVED]** The proposed monthly volume threshold has **not
      been set.** Product has not documented a risk-based basis, and suitability across
      payment methods or jurisdictions is unconfirmed.


      **[GENERATED ANALYSIS]** Card, ACH, and local payment methods have **different
      fraud, chargeback, and money-laundering risk profiles.** A single volume threshold
      may not be suitable across all methods. The threshold must be:

      - **Documented** with a written risk assessment explaining how it was set and
      why it is appropriate for each payment method and jurisdiction; and

      - **Monitored** for structuring or abuse — i.e., whether low-volume merchants
      are being used to evade controls.


      **[GENERATED ANALYSIS]** If the threshold is set arbitrarily or without a documented
      risk basis, regulators or partners may view the tiering as inadequate, and the
      flow would need to be redesigned.


      ### 4.3 Transaction limits


      **[GENERATED ANALYSIS]** If Mosaic Relay permits merchants to process limited
      transactions while in manual review, it must impose **strict transaction caps,
      enhanced monitoring, and immediate suspension triggers** if red flags emerge.
      Sanctions screening must be completed before any transactions are processed.
      If a merchant is later found to be high-risk or sanctioned, Mosaic Relay may
      have facilitated prohibited transactions — so the caps and monitoring must be
      robust.


      **[SUPPLIED FACT — UNRESOLVED]** Whether merchants may process limited transactions
      during pending review is **not yet decided.** This must be resolved before launch,
      with the controls above defined.


      ---


      ## 5. Pending-review processing


      **[SUPPLIED FACT — UNRESOLVED]** Whether a merchant may process limited transactions
      while their application is in manual review is **not yet decided.**


      **[GENERATED ANALYSIS]** Two viable approaches:

      - **Path A — No processing during review.** Merchants in manual review cannot
      process until review completes. Lowest risk; simplest to control. May frustrate
      the "minutes" promise for borderline applicants.

      - **Path B — Limited processing with strict controls.** Merchants may process
      up to defined caps with enhanced monitoring and immediate suspension triggers,
      and only after sanctions screening completes. Higher risk; requires robust controls
      and clear customer notice.


      **[GENERATED ANALYSIS]** Path B is acceptable only if the caps, monitoring,
      and suspension triggers are defined and enforceable, and if sanctions screening
      is a completed gate first. If these controls are not feasible in the six-week
      window, Path A is the safer choice.


      ---


      ## 6. BSA/AML, recordkeeping, privacy, and customer notices


      ### 6.1 BSA/AML program


      **[UNVERIFIED AUTHORITY]** If Mosaic Relay is classified as an MSB under FinCEN
      regulations (31 C.F.R. § 1010.100(ff)), it must maintain a **written AML program**
      with a designated compliance officer, employee training, independent testing/audit,
      and internal policies, procedures, and controls. MSBs must file **Suspicious
      Activity Reports (SARs)** and **Currency Transaction Reports (CTRs)** when applicable.
      **[UNVERIFIED]**


      **[GENERATED ANALYSIS]** The tiered flow does **not** eliminate these obligations.
      Lower verification for low-volume merchants is permissible only if the overall
      AML program remains **risk-based and effective.** The proposed volume threshold
      must be supported by a documented risk-based rationale, and Mosaic Relay must
      monitor whether low-volume merchants are being used to structure transactions
      or evade controls.


      ### 6.2 Recordkeeping


      **[UNVERIFIED AUTHORITY]** BSA recordkeeping requirements (31 U.S.C. § 5318(h);
      31 C.F.R. § 1010.410) require retention of customer identification records,
      transaction records, and SARs for **five years.** **[UNVERIFIED]**


      **[GENERATED ANALYSIS]** The tiered flow must log and retain the full audit
      trail — all collected data, screening results, risk scores, and onboarding decisions
      — including when lower-tier merchants are upgraded, when beneficial-owner data
      is refreshed, and when additional verification is performed.


      ### 6.3 Privacy


      **[GENERATED ANALYSIS]** Mosaic Relay must comply with applicable privacy laws
      (e.g., CCPA if California residents are involved) **[UNVERIFIED — CCPA applicability]**
      and provide clear notices about what information is collected and how it is
      used. Privacy by design and least-privilege access are operating principles
      that should be reflected in the flow.


      ### 6.4 Customer notices


      **[GENERATED ANALYSIS]** Mosaic Relay should provide clear notices to merchants
      about:

      - What information is collected and how it is used;

      - What the tiered verification process entails; and

      - What merchants can expect if placed in manual review or subject to transaction
      limits (timely notice).


      ---


      ## 7. Partner and state-law dependencies


      ### 7.1 Partner and processor requirements


      **[SUPPLIED FACT — UNRESOLVED]** Whether acquiring partners and processors will
      accept the tiered verification levels and lower threshold is **not confirmed.**


      **[GENERATED ANALYSIS]** Acquiring banks and payment processors impose their
      own underwriting and onboarding requirements, which may be **more stringent**
      than Mosaic Relay''s proposed tiered flow. If partners require full KYB and
      beneficial-owner data for all merchants regardless of volume, the tiered flow
      is **not viable as proposed.** Mosaic Relay must obtain **written confirmation**
      from partners that they will accept the tiered verification levels and the proposed
      volume threshold. This is the single most decision-changing dependency.


      ### 7.2 State money transmission licensing


      **[NOT EXAMINED]** State money transmission licensing requirements were **not
      examined** in the research packet. The analysis focuses on federal BSA/AML and
      sanctions obligations. If Mosaic Relay operates in states that impose additional
      licensing or onboarding requirements for money transmitters, those must be mapped
      and satisfied before launch. This is a material gap.


      ---


      ## 8. Launch recommendation for six weeks


      **[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**


      **Recommendation: Proceed toward launch, but only on a conditional basis, and
      only if the four conditions below are met early in the six-week window. Otherwise,
      delay.**


      The six-week timeline is **tight but workable** for the design and control work,
      provided the following are resolved early:


      1. **Confirm partner/processor acceptance in writing** (the single most decision-changing
      dependency). If partners require full KYB for all merchants, the tiered flow
      is not viable as proposed and must be redesigned.

      2. **Set and document the volume threshold** with a written risk-based rationale,
      calibrated per payment method and jurisdiction — not a single uniform number
      applied blindly.

      3. **Define the beneficial-owner data set and refresh cadence**, including ownership
      percentages, control-person details, supporting documents, and trigger events.

      4. **Resolve pending-review processing** and, if limited processing is allowed,
      define caps, monitoring, and suspension triggers with sanctions screening as
      a completed gate first.


      **Fallback (lower-risk) path:** If the four conditions cannot be completed in
      time, **delay launch.** Launching with unresolved beneficial-owner requirements,
      an undocumented threshold, or unclear pending-review limits creates regulatory
      and operational risk that outweighs the benefit of launching before the holiday
      sales period. A safer alternative is to **launch with full KYB and beneficial-owner
      collection for all merchants but automate and streamline the process** — reducing
      onboarding time without tiering away verification substance.


      **This is a recommendation only.** It is not a recorded decision. Whether to
      proceed, delay, or adopt the fallback path is a decision for Jordan Lee and
      the business.


      ---


      ## 9. Missing facts and unverified leads


      ### 9.1 Missing facts (must be resolved before finalizing)


      - **Payment methods and jurisdictions in scope** — undecided; determines whether
      a single volume threshold can apply uniformly.

      - **Monthly volume threshold and its risk-based basis** — unset and undocumented.

      - **Beneficial-owner data set and refresh cadence** — unsettled.

      - **Pending-review processing decision** — undecided.

      - **Partner/processor acceptance** — unconfirmed.


      ### 9.2 Unverified authorities (must be confirmed before finalizing)


      - **CDD Rule** (31 C.F.R. § 1010.230) — beneficial-owner 25% threshold and control-person
      details. **[UNVERIFIED]**

      - **MSB definition** (31 C.F.R. § 1010.100(ff)) and AML program requirements.
      **[UNVERIFIED]**

      - **Recordkeeping** (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) — five-year
      retention. **[UNVERIFIED]**

      - **OFAC SDN List screening obligation.** **[UNVERIFIED]**

      - **CCPA applicability** to Mosaic Relay''s data practices. **[UNVERIFIED]**


      **Recommended next step:** Re-run external research to verify the cited authorities
      against current primary sources before this memo carries a final recommendation.


      ---


      ## 10. What would change this


      - **Working assumption (A3 — MSB classification):** If Mosaic Relay is not an
      MSB (e.g., it qualifies for an exemption or operates solely as an agent of another
      MSB), the BSA/AML analysis changes, though partner and processor requirements
      would still apply.

      - **Open fork (partner acceptance):** If acquiring partners and processors require
      full KYB for all merchants, the tiered flow is not viable as proposed. If they
      accept tiering, Mosaic Relay can proceed with a tiered flow subject to documented
      risk-based controls.

      - **Open fork (volume threshold):** If the threshold is set too high or lacks
      a documented risk-based rationale, regulators or partners may view the tiering
      as inadequate. If it is limited to card payments only, a single threshold may
      be more defensible; if it includes ACH or local methods, separate thresholds
      or full verification may be required.

      - **Not examined (partner contracts):** The specific contractual requirements
      of Mosaic Relay''s acquiring partners and payment processors were not reviewed.
      The analysis assumes partners impose their own requirements, but the exact terms
      are unknown.

      - **Not examined (state licensing):** State money transmission licensing requirements
      were not examined. If Mosaic Relay operates in states imposing additional licensing
      or onboarding requirements, those must be mapped and satisfied before launch.

      - **Not examined (authority):** No external authority was retrieved in the research
      packet (external research timed out). The regulatory citations in this memo
      are identified as likely material but have not been independently verified against
      current primary sources. This is the single most important gap before this memo
      carries a final recommendation.

      '
    change_id: CHG-20260903-c0480c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T08:42:30+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T08:42:30+00:00'
last_source_action_key: chat:RUN-20260903-884695:tool:e3d96872d64c5d4c54845cac
final_id: FINAL-20260903-6406ff
finalized_at: '2026-09-03T08:43:00+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-01-tiered-merchant-onboarding-for-small-bus-1d4e00/work-product/draft/baseline-kyb-kyc-sanctions-screening-and-bsa-aml-onboarding-requ-72602a.md
source_content_hash: 2404b2abd0040ed415e054b440c97c8fdb22172ad07f9cff7d54bc7808c13b2f
---
# Developed First-Pass Legal Memo — Tiered Merchant Onboarding for Small Businesses

**Matter:** Mosaic Relay UX Test — 01 — Tiered Merchant Onboarding for Small Businesses
**Status:** First-pass legal memo (draft for review)
**Prepared for:** Jordan Lee, Senior Product Counsel
**Prepared by:** Themis.ai (workspace guidance)
**Date:** 2026-09-03

---

## How to read this memo

This memo is a **developed first-pass analysis**, not a final legal opinion. It integrates (a) the saved first-pass research packet on baseline KYB/KYC, sanctions, and BSA/AML obligations and (b) the unresolved intake facts on the tiered flow. It is organized so that **supplied facts, assumptions, generated analysis, and unverified authorities are clearly labeled** throughout.

**Critical authority caveat (read first):** The saved research packet is **model-only** — no external authority was retrieved (the external research run timed out). The regulatory citations below (CDD Rule, MSB definition, recordkeeping, OFAC screening) are identified as **likely material** from the general U.S. framework but have **not been independently verified against current primary sources**. Every citation is labeled **[UNVERIFIED]** and must be confirmed before this memo carries a final recommendation. This is the single most important gap in this memo.

---

## 1. Executive conclusion

**[GENERATED ANALYSIS]** Mosaic Relay can likely launch a tiered merchant onboarding flow in six weeks, **but not in the form Product has proposed as currently specified.** The proposal is legally acceptable only if four conditions are met before launch:

1. **Sanctions screening is a mandatory, completed gate before any API credentials are issued** — for every merchant, regardless of tier or volume. This is a hard, non-tierable requirement. The "credentials within minutes" path is only acceptable if screening completes first.
2. **The lower-verification tier does not skip beneficial-owner collection** where acquiring partners or processors require it. The baseline KYB/KYC floor cannot be tiered away; tiering may reduce friction, not substance.
3. **The monthly volume threshold is set with a documented, risk-based rationale** and is calibrated per payment method and jurisdiction — not a single uniform number applied blindly. As of intake, **no threshold has been set and no basis documented**.
4. **Acquiring partners and processors confirm in writing** they will accept the tiered verification levels and the lower threshold. As of intake, **this is unconfirmed** — and if partners require full KYB for all merchants, the tiered flow is **not viable as proposed**.

**[GENERATED ANALYSIS]** The single most decision-changing unknown is **partner/processor acceptance**. Everything else can be designed around; partner rejection of the tiered levels would invalidate the flow as proposed. The second most decision-changing unknown is the **unset volume threshold** — without a documented risk basis, the tiering structure cannot be defended.

**[GENERATED ANALYSIS]** The six-week timeline is **tight but workable** for the design and control work, provided the four conditions above are resolved early. If partner confirmation or the risk-based threshold cannot be completed in time, **delaying launch is the lower-risk path** — launching with unresolved beneficial-owner requirements, an undocumented threshold, or unclear pending-review limits creates regulatory and operational risk that outweighs the benefit of launching before the holiday sales period.

---

## 2. Scope and assumptions

### 2.1 Scope

**[SUPPLIED FACT]** Mosaic Relay provides payment infrastructure and does not hold deposits or operate as a bank. It proposes a tiered onboarding flow: the business provides legal name, registration details, owners, expected volume, countries, and payment methods; Mosaic Relay runs KYB, identity verification, sanctions screening, and risk scoring; low-risk applicants receive API credentials within minutes; higher-risk or incomplete applications move to a manual review queue. Target launch is in six weeks before the holiday sales period.

**[SUPPLIED FACT — UNRESOLVED]** The following intake facts remain unresolved and materially affect this analysis:
- **Payment methods and jurisdictions in scope: NOT DECIDED.** This determines whether a single volume threshold can apply uniformly.
- **Monthly volume threshold: NOT SET.** No documented risk-based basis; suitability across payment methods/jurisdictions unconfirmed.
- **Pending-review processing: NOT DECIDED.** Whether a merchant may process limited transactions while in manual review is unresolved.
- **Beneficial-owner data set and refresh cadence: NOT SETTLED.** Ownership percentages, control-person details, supporting documents, and refresh triggers/frequency remain open.
- **Partner/processor acceptance: NOT CONFIRMED.** Whether acquiring partners and processors will accept the tiered verification levels and lower threshold is unconfirmed.

### 2.2 Assumptions

**[ASSUMPTION]** The following are working assumptions, not established facts:
- **A1 — U.S.-primary operations.** Mosaic Relay operates primarily in the United States in this scenario; any non-U.S. expansion is subject to separate legal review. This memo analyzes U.S. federal obligations only.
- **A2 — Standard methods in scope.** The tiered flow applies to Mosaic Relay's standard card, ACH, and local payment methods unless otherwise specified.
- **A3 — MSB classification.** Mosaic Relay is classified as a money services business (MSB) under FinCEN regulations and is subject to BSA/AML program requirements. **[UNVERIFIED]** If Mosaic Relay is not an MSB (e.g., it qualifies for an exemption or operates solely as an agent of another MSB), the BSA/AML analysis changes, though partner and processor requirements would still apply.
- **A4 — Partner requirements.** Mosaic Relay's acquiring partners and processors impose their own onboarding and underwriting requirements that must be reconciled with the tiered flow. The exact contractual terms have not been reviewed.

---

## 3. Required KYB/KYC, beneficial-owner, and sanctions checks

### 3.1 KYB/KYC baseline

**[GENERATED ANALYSIS]** At a baseline level, Mosaic Relay must collect and verify the business's **legal name, registration details, and owners** — the core KYB data elements it already proposes to collect. It must verify the identity of the business and its beneficial owners before onboarding.

**[UNVERIFIED AUTHORITY]** FinCEN's Customer Due Diligence (CDD) Rule (31 C.F.R. § 1010.230) requires covered financial institutions to collect beneficial-owner information at the **25% ownership threshold** and **control-person details**. **[UNVERIFIED]** Whether the CDD Rule applies directly to Mosaic Relay depends on its classification (see § 6). However, its **acquiring partners and payment processors are likely subject to CDD requirements** and may contractually require Mosaic Relay to collect equivalent information.

**[GENERATED ANALYSIS — KEY POINT]** The lower-verification tier **cannot skip beneficial-owner collection entirely** if partners require it. The baseline KYB/KYC floor cannot be tiered away. Tiering may reduce *friction* (automation, fewer manual steps) but not the *substance* of identity and beneficial-owner verification where partners or regulation require it.

### 3.2 Beneficial-owner data set and refresh cadence

**[SUPPLIED FACT — UNRESOLVED]** Product has not settled the beneficial-owner data set or refresh cycle. Legal name, registration details, owners, and identity verification are proposed inputs, but **required ownership percentages, control-person details, supporting documents, and refresh triggers or frequency remain open.**

**[GENERATED ANALYSIS]** Before launch, Mosaic Relay should define:
- **Data set:** name, date of birth, address, ownership percentage, and control-person details, plus supporting documents (e.g., formation documents, ID) as partners require.
- **Refresh cadence:** at minimum on **trigger events** (ownership changes, risk-score increases, material changes to the business) and on a periodic cycle (e.g., annual) consistent with partner and regulatory expectations.

**[GENERATED ANALYSIS]** If Mosaic Relay collects only minimal beneficial-owner data (e.g., name and ownership percentage) without control-person details or supporting documents, it may not satisfy partner or regulatory expectations. This is a material gap that must be closed before launch.

### 3.3 Sanctions screening

**[GENERATED ANALYSIS]** OFAC sanctions screening is **not tiered or volume-dependent.** Every merchant, regardless of risk score or transaction volume, must be screened against the **OFAC SDN List** and other applicable sanctions lists before onboarding and on an ongoing basis. **[UNVERIFIED AUTHORITY — OFAC SDN List screening obligation]**

**[GENERATED ANALYSIS — KEY POINT]** The proposal includes sanctions screening, which is correct. But the flow must ensure screening is **completed before API credentials are issued, not after.** Issuing credentials to a sanctioned party, even briefly, risks facilitating prohibited transactions. This is a **hard, non-tierable gate** on the "credentials within minutes" path.

---

## 4. Risk-based tiering and transaction limits

### 4.1 Is tiering permissible?

**[GENERATED ANALYSIS]** Tiering based on transaction volume is a common risk-based approach and is permissible **in principle**, provided it sits inside a compliant AML program and the threshold is calibrated to risk. The proposal's core problem is not tiering itself — it is that **the threshold is unset and undocumented**, and that a **single uniform threshold may not be suitable across payment methods and jurisdictions.**

### 4.2 The volume threshold problem

**[SUPPLIED FACT — UNRESOLVED]** The proposed monthly volume threshold has **not been set.** Product has not documented a risk-based basis, and suitability across payment methods or jurisdictions is unconfirmed.

**[GENERATED ANALYSIS]** Card, ACH, and local payment methods have **different fraud, chargeback, and money-laundering risk profiles.** A single volume threshold may not be suitable across all methods. The threshold must be:
- **Documented** with a written risk assessment explaining how it was set and why it is appropriate for each payment method and jurisdiction; and
- **Monitored** for structuring or abuse — i.e., whether low-volume merchants are being used to evade controls.

**[GENERATED ANALYSIS]** If the threshold is set arbitrarily or without a documented risk basis, regulators or partners may view the tiering as inadequate, and the flow would need to be redesigned.

### 4.3 Transaction limits

**[GENERATED ANALYSIS]** If Mosaic Relay permits merchants to process limited transactions while in manual review, it must impose **strict transaction caps, enhanced monitoring, and immediate suspension triggers** if red flags emerge. Sanctions screening must be completed before any transactions are processed. If a merchant is later found to be high-risk or sanctioned, Mosaic Relay may have facilitated prohibited transactions — so the caps and monitoring must be robust.

**[SUPPLIED FACT — UNRESOLVED]** Whether merchants may process limited transactions during pending review is **not yet decided.** This must be resolved before launch, with the controls above defined.

---

## 5. Pending-review processing

**[SUPPLIED FACT — UNRESOLVED]** Whether a merchant may process limited transactions while their application is in manual review is **not yet decided.**

**[GENERATED ANALYSIS]** Two viable approaches:
- **Path A — No processing during review.** Merchants in manual review cannot process until review completes. Lowest risk; simplest to control. May frustrate the "minutes" promise for borderline applicants.
- **Path B — Limited processing with strict controls.** Merchants may process up to defined caps with enhanced monitoring and immediate suspension triggers, and only after sanctions screening completes. Higher risk; requires robust controls and clear customer notice.

**[GENERATED ANALYSIS]** Path B is acceptable only if the caps, monitoring, and suspension triggers are defined and enforceable, and if sanctions screening is a completed gate first. If these controls are not feasible in the six-week window, Path A is the safer choice.

---

## 6. BSA/AML, recordkeeping, privacy, and customer notices

### 6.1 BSA/AML program

**[UNVERIFIED AUTHORITY]** If Mosaic Relay is classified as an MSB under FinCEN regulations (31 C.F.R. § 1010.100(ff)), it must maintain a **written AML program** with a designated compliance officer, employee training, independent testing/audit, and internal policies, procedures, and controls. MSBs must file **Suspicious Activity Reports (SARs)** and **Currency Transaction Reports (CTRs)** when applicable. **[UNVERIFIED]**

**[GENERATED ANALYSIS]** The tiered flow does **not** eliminate these obligations. Lower verification for low-volume merchants is permissible only if the overall AML program remains **risk-based and effective.** The proposed volume threshold must be supported by a documented risk-based rationale, and Mosaic Relay must monitor whether low-volume merchants are being used to structure transactions or evade controls.

### 6.2 Recordkeeping

**[UNVERIFIED AUTHORITY]** BSA recordkeeping requirements (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) require retention of customer identification records, transaction records, and SARs for **five years.** **[UNVERIFIED]**

**[GENERATED ANALYSIS]** The tiered flow must log and retain the full audit trail — all collected data, screening results, risk scores, and onboarding decisions — including when lower-tier merchants are upgraded, when beneficial-owner data is refreshed, and when additional verification is performed.

### 6.3 Privacy

**[GENERATED ANALYSIS]** Mosaic Relay must comply with applicable privacy laws (e.g., CCPA if California residents are involved) **[UNVERIFIED — CCPA applicability]** and provide clear notices about what information is collected and how it is used. Privacy by design and least-privilege access are operating principles that should be reflected in the flow.

### 6.4 Customer notices

**[GENERATED ANALYSIS]** Mosaic Relay should provide clear notices to merchants about:
- What information is collected and how it is used;
- What the tiered verification process entails; and
- What merchants can expect if placed in manual review or subject to transaction limits (timely notice).

---

## 7. Partner and state-law dependencies

### 7.1 Partner and processor requirements

**[SUPPLIED FACT — UNRESOLVED]** Whether acquiring partners and processors will accept the tiered verification levels and lower threshold is **not confirmed.**

**[GENERATED ANALYSIS]** Acquiring banks and payment processors impose their own underwriting and onboarding requirements, which may be **more stringent** than Mosaic Relay's proposed tiered flow. If partners require full KYB and beneficial-owner data for all merchants regardless of volume, the tiered flow is **not viable as proposed.** Mosaic Relay must obtain **written confirmation** from partners that they will accept the tiered verification levels and the proposed volume threshold. This is the single most decision-changing dependency.

### 7.2 State money transmission licensing

**[NOT EXAMINED]** State money transmission licensing requirements were **not examined** in the research packet. The analysis focuses on federal BSA/AML and sanctions obligations. If Mosaic Relay operates in states that impose additional licensing or onboarding requirements for money transmitters, those must be mapped and satisfied before launch. This is a material gap.

---

## 8. Launch recommendation for six weeks

**[GENERATED ANALYSIS — RECOMMENDATION, NOT A RECORDED DECISION]**

**Recommendation: Proceed toward launch, but only on a conditional basis, and only if the four conditions below are met early in the six-week window. Otherwise, delay.**

The six-week timeline is **tight but workable** for the design and control work, provided the following are resolved early:

1. **Confirm partner/processor acceptance in writing** (the single most decision-changing dependency). If partners require full KYB for all merchants, the tiered flow is not viable as proposed and must be redesigned.
2. **Set and document the volume threshold** with a written risk-based rationale, calibrated per payment method and jurisdiction — not a single uniform number applied blindly.
3. **Define the beneficial-owner data set and refresh cadence**, including ownership percentages, control-person details, supporting documents, and trigger events.
4. **Resolve pending-review processing** and, if limited processing is allowed, define caps, monitoring, and suspension triggers with sanctions screening as a completed gate first.

**Fallback (lower-risk) path:** If the four conditions cannot be completed in time, **delay launch.** Launching with unresolved beneficial-owner requirements, an undocumented threshold, or unclear pending-review limits creates regulatory and operational risk that outweighs the benefit of launching before the holiday sales period. A safer alternative is to **launch with full KYB and beneficial-owner collection for all merchants but automate and streamline the process** — reducing onboarding time without tiering away verification substance.

**This is a recommendation only.** It is not a recorded decision. Whether to proceed, delay, or adopt the fallback path is a decision for Jordan Lee and the business.

---

## 9. Missing facts and unverified leads

### 9.1 Missing facts (must be resolved before finalizing)

- **Payment methods and jurisdictions in scope** — undecided; determines whether a single volume threshold can apply uniformly.
- **Monthly volume threshold and its risk-based basis** — unset and undocumented.
- **Beneficial-owner data set and refresh cadence** — unsettled.
- **Pending-review processing decision** — undecided.
- **Partner/processor acceptance** — unconfirmed.

### 9.2 Unverified authorities (must be confirmed before finalizing)

- **CDD Rule** (31 C.F.R. § 1010.230) — beneficial-owner 25% threshold and control-person details. **[UNVERIFIED]**
- **MSB definition** (31 C.F.R. § 1010.100(ff)) and AML program requirements. **[UNVERIFIED]**
- **Recordkeeping** (31 U.S.C. § 5318(h); 31 C.F.R. § 1010.410) — five-year retention. **[UNVERIFIED]**
- **OFAC SDN List screening obligation.** **[UNVERIFIED]**
- **CCPA applicability** to Mosaic Relay's data practices. **[UNVERIFIED]**

**Recommended next step:** Re-run external research to verify the cited authorities against current primary sources before this memo carries a final recommendation.

---

## 10. What would change this

- **Working assumption (A3 — MSB classification):** If Mosaic Relay is not an MSB (e.g., it qualifies for an exemption or operates solely as an agent of another MSB), the BSA/AML analysis changes, though partner and processor requirements would still apply.
- **Open fork (partner acceptance):** If acquiring partners and processors require full KYB for all merchants, the tiered flow is not viable as proposed. If they accept tiering, Mosaic Relay can proceed with a tiered flow subject to documented risk-based controls.
- **Open fork (volume threshold):** If the threshold is set too high or lacks a documented risk-based rationale, regulators or partners may view the tiering as inadequate. If it is limited to card payments only, a single threshold may be more defensible; if it includes ACH or local methods, separate thresholds or full verification may be required.
- **Not examined (partner contracts):** The specific contractual requirements of Mosaic Relay's acquiring partners and payment processors were not reviewed. The analysis assumes partners impose their own requirements, but the exact terms are unknown.
- **Not examined (state licensing):** State money transmission licensing requirements were not examined. If Mosaic Relay operates in states imposing additional licensing or onboarding requirements, those must be mapped and satisfied before launch.
- **Not examined (authority):** No external authority was retrieved in the research packet (external research timed out). The regulatory citations in this memo are identified as likely material but have not been independently verified against current primary sources. This is the single most important gap before this memo carries a final recommendation.
