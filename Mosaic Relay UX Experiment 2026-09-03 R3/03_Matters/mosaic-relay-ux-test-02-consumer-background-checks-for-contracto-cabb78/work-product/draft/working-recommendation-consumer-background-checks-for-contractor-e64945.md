---
work_product_id: WP-8e32c6e64945
matter_id: MAT-20260903-cabb78
title: Working Recommendation — Consumer Background Checks for Contractor Payouts
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T22:02:41+00:00'
updated_at: '2026-09-03T22:02:41+00:00'
immutable: false
source_action_key: chat:RUN-20260903-32228d:tool:9f48601076247ea893a8858e
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Working Recommendation — Consumer Background Checks for Contractor Payouts


      **Status:** Working draft for counsel review. Not a durable decision. No durable
      decision has been recorded.


      ---


      ## Bottom line


      Mosaic Relay **may** provide this contractor-screening feature, but only if
      the product is built so that the **platform customer** (the confirmed decision-maker)
      carries the FCRA "user" obligations — permissible-purpose certification, standalone
      disclosure and written authorization, and the two-step adverse-action notice
      process — and Mosaic Relay acts as a compliant service provider that supports
      and contractually enforces that allocation. The feature is lawful and commercially
      viable, but it is **not** a "return a status code and walk away" product: the
      FCRA adverse-action workflow, dispute handling, and data controls must be designed
      in before launch.


      ---


      ## 1. May Mosaic Relay provide the service?


      **Yes, with conditions.** Nothing in the request makes the service itself unlawful.
      The controlling question is not whether the service may exist but how FCRA duties
      are allocated and whether the product enforces them.


      **Key structural point:** The platform customer makes the final eligibility
      decision (confirmed fact). Under FCRA, the party that uses a consumer report
      to make a decision bearing on the consumer is the "user" who bears the disclosure,
      authorization, and adverse-action duties. Because the customer decides, the
      customer is the FCRA user. Mosaic Relay''s role is that of a service provider
      that procures and processes the report on the customer''s behalf.


      **The design fork that matters most:** whether Mosaic Relay returns only a status
      code ("eligible" / "manual review" / "not eligible") or whether the customer
      ever receives report contents. This determines whether the customer is the sole
      user or whether Mosaic Relay is also a user. The business goal — not exposing
      detailed reports to platform staff — points toward Mosaic Relay applying decision
      rules and returning only status codes, which keeps the customer as the user
      while shielding report contents. But Mosaic Relay must still be careful: if
      Mosaic Relay itself procures the report and applies the decision rules that
      produce the adverse outcome, regulators and courts may treat Mosaic Relay as
      a co-user with its own duties, even if the customer formally makes the final
      call. The safest design treats both as users with clearly allocated, contractually
      documented duties.


      ---


      ## 2. FCRA permissible purpose, standalone disclosure, and written authorization


      **Permissible purpose.** Screening contractors for payout eligibility is most
      naturally analyzed under the "employment purposes" permissible purpose (FCRA
      § 604(a)(3)(B), defined at § 603(h)). The FTC and courts have generally treated
      independent-contractor screening for work eligibility as within this purpose.
      **This is an assumption, not a verified holding** — the characterization of
      contractors (not employees) under § 603(h) should be confirmed against current
      FTC/CFPB guidance before launch.


      **Standalone disclosure and written authorization (FCRA § 604(b)(2)).** Before
      procuring a consumer report for employment purposes, the user must:

      - Provide a **clear and conspicuous disclosure** in a document **consisting
      solely of the disclosure** that a consumer report may be obtained for employment
      purposes; and

      - Obtain the consumer''s **written authorization**.


      **Product implication:** The consent screen cannot be buried in general terms.
      It must be a standalone disclosure document, and the contractor''s authorization
      must be captured and retained. Because screening recurs annually and after events,
      the question of whether fresh disclosure/authorization is needed for each recheck
      must be resolved (see § 7).


      ---


      ## 3. CRA / user / furnisher roles


      - **The vendor is a CRA** (confirmed by intake — limited report, criminal/identity).
      As a CRA it must maintain reasonable procedures to assure maximum possible accuracy
      (§ 607(b)) and reinvestigate disputes (§ 611).

      - **The platform customer is the user** (confirmed decision-maker). It bears
      the § 604(b)(2) disclosure/authorization and § 604(b)(3)/§ 615(a) adverse-action
      duties, and must certify permissible purpose to the CRA (§ 604(f)).

      - **Mosaic Relay is a service provider / potential co-user.** Its exposure depends
      on the data flow. If Mosaic Relay procures the report and applies decision rules,
      it should be treated as a user with its own duties and should contractually
      require the customer to comply.

      - **Furnisher duties** apply to entities that furnish information to CRAs. Mosaic
      Relay is not currently a furnisher of the criminal/identity data (the CRA sources
      it), but if Mosaic Relay ever feeds screening outcomes or dispute results back
      to a CRA, furnisher accuracy and dispute duties (§ 623) would attach. **Not
      currently implicated on the stated facts.**


      ---


      ## 4. Adverse-action notices (pre-adverse and final)


      This is the highest-risk area and must be built into the product.


      **Pre-adverse action notice (FCRA § 604(b)(3)).** Before taking adverse action
      based in whole or in part on a consumer report, the user must provide the consumer
      with:

      - A copy of the consumer report; and

      - The CFPB''s "Summary of Your Rights Under the Fair Credit Reporting Act."


      **Final adverse-action notice (FCRA § 615(a)).** After taking adverse action,
      the user must provide notice containing:

      - The name, address, and phone number of the CRA that furnished the report;

      - A statement that the CRA did not make the decision and cannot give reasons
      for it;

      - Notice of the right to obtain a free copy of the report from the CRA within
      60 days; and

      - Notice of the right to dispute the accuracy or completeness of the information.


      **Product implication:** Both "manual review" and "not eligible" outcomes that
      result in a denial or restriction of payouts are adverse actions and trigger
      this two-step process. The product must route the report copy and Summary of
      Rights to the contractor **before** the adverse decision is finalized, and the
      final notice **after**. Because the customer is the decision-maker, the customer
      must send these notices — but Mosaic Relay should build the workflow and templates
      so the customer cannot skip them.


      ---


      ## 5. Accuracy, reinvestigation, disputes, and vendor oversight


      - **CRA duties:** The vendor must reinvestigate disputes within the statutory
      timeframe (§ 611) and maintain accuracy procedures (§ 607(b)).

      - **User duties:** The customer (and Mosaic Relay as co-user) must notify the
      CRA of disputes and follow accuracy procedures.

      - **Mosaic Relay vendor oversight:** Mosaic Relay should contractually require
      the CRA to maintain FCRA-compliant accuracy, reinvestigation, and data-quality
      processes, and should audit the vendor''s performance. This is a vendor-management
      obligation consistent with Mosaic Relay''s stated risk posture.

      - **Dispute handling:** The product must have a defined dispute path so a contractor
      who disputes a record can trigger reinvestigation and, if the record is corrected,
      have the eligibility decision revisited.


      ---


      ## 6. Sanctions and identity screening separation


      - **Sanctions (OFAC) screening** is generally **not** a consumer report under
      FCRA when it is based solely on matching a name against a government list without
      assembling or evaluating other consumer information. It is a separate compliance
      obligation (sanctions screening), not a consumer-report obligation.

      - **Identity verification** may or may not be a consumer report depending on
      the data sources and whether the vendor assembles/evaluates the information.

      - **Critical caveat:** If sanctions or identity data is **bundled into the CRA''s
      consumer report**, it becomes part of the consumer report and is subject to
      FCRA. The product should keep sanctions/identity screening **separate** from
      the criminal/identity consumer report to preserve the cleaner treatment, or
      accept that bundling pulls it under FCRA.


      ---


      ## 7. Payout restrictions and fair-lending / discrimination risk


      - **Payout restriction vs. onboarding gate.** If screening only gates whether
      a contractor can begin work (onboarding), the consumer-protection issues are
      simpler. If screening results **restrict, delay, or condition payouts for already-completed
      work**, the risk is materially higher: withholding pay for completed work based
      on a screening result could be challenged as unfair or deceptive if not clearly
      disclosed upfront, and it triggers the full adverse-action process before the
      restriction takes effect.

      - **Funds-flow disclosure.** Mosaic Relay''s role as payment infrastructure
      means payout timing and conditions should be clearly disclosed in the platform''s
      contractor terms.

      - **Fair-lending / discrimination risk.** Criminal-record screening that drives
      eligibility carries disparate-impact risk under federal and state anti-discrimination
      and fair-employment law. The decision rules should be designed to avoid disproportionate
      exclusion, and the customer should apply individualized assessment where state
      law requires it. **State ban-the-box and fair-chance laws are not in the vault
      and were not examined** — this is a material gap given US-only scope.


      ---


      ## 8. Annual and event-triggered rechecks


      - Annual and event-triggered rechecks are permissible in principle, but each
      recheck that can produce an adverse outcome must follow the same disclosure/authorization
      and adverse-action process.

      - **Open question:** whether a fresh standalone disclosure and written authorization
      are required for each annual/event recheck, or whether a single onboarding authorization
      can cover recurring screening. This should be resolved against current FCRA
      guidance before the product is built. **Not examined in the vault.**


      ---


      ## 9. Retention and access controls


      - **Retention:** Consumer-report data and identifying information should be
      retained only as long as needed for the stated purpose, with defined retention
      periods and secure disposal. FCRA § 628 and the FTC Disposal Rule govern disposal
      of consumer-report information. **Specific retention periods are not set and
      were not examined.**

      - **Access controls:** The product should enforce least-privilege access so
      detailed report contents are visible only to those who need them — consistent
      with the business goal of shielding platform staff. Status codes can be broadly
      visible; report contents should be restricted.


      ---


      ## Recommended path forward


      1. **Confirm the data flow** — whether Mosaic Relay returns only status codes
      or the customer receives report contents. This drives the user allocation.

      2. **Confirm the vendor''s CRA status and report contents** in the vendor contract
      (criminal/identity only, per intake).

      3. **Resolve the recheck authorization question** (fresh disclosure per recheck
      vs. single authorization).

      4. **Determine contractor state distribution** to scope state ban-the-box and
      consumer-reporting overlay.

      5. **Confirm whether screening affects payouts for completed work** or only
      gates future work.

      6. **Build the FCRA workflow** (standalone disclosure, authorization, pre-adverse
      + final adverse-action notices, dispute path) into the product before launch.

      7. **Contractually allocate duties** among Mosaic Relay, the customer, and the
      CRA.


      ---


      ## Labeled analysis


      ### Known facts (confirmed)

      - Mosaic Relay wants to offer a platform customer a feature that screens contractors
      before payouts.

      - Flow: consent → collect identifying info → vendor background report → return
      "eligible" / "manual review" / "not eligible" to the customer.

      - Business goal: reduce fraud and meet trust requirements without exposing detailed
      reports to platform staff.

      - Screening at onboarding, annually, and after certain fraud/dispute events.

      - May use criminal-record, identity, sanctions, and address information; exact
      contents unsettled.

      - **US only** (confirmed).

      - **Platform customer makes the final eligibility decision** (confirmed).

      - **Vendor is a CRA providing a limited report (criminal/identity only)** (confirmed).


      ### Assumptions (unconfirmed)

      - Contractors are individuals (consumers) in the US, making FCRA the primary
      framework.

      - Screening falls within the "employment purposes" permissible purpose under
      § 603(h) (contractor, not employee, characterization unverified).

      - Mosaic Relay and/or the customer is a "user" of a consumer report under FCRA.

      - The customer is the sole user if it receives only status codes; Mosaic Relay
      may be a co-user if it procures/applies decision rules.


      ### Missing facts (need to be gathered)

      - Exact data flow (status code vs. report contents to customer).

      - Adverse-action and dispute-handling procedures currently in place.

      - Retention periods for screening data.

      - Source and accuracy process for the records used.

      - Contractor state distribution.

      - Whether screening affects payouts for completed work or only gates future
      work.


      ### Unverified leads (not confirmed against authority)

      - FTC/CFPB treatment of independent-contractor screening under § 603(h) "employment
      purposes."

      - Whether fresh disclosure/authorization is required for each annual/event recheck.

      - State ban-the-box and fair-chance laws in contractor states (not in vault).

      - Whether sanctions/identity screening bundled into a CRA report becomes a consumer
      report (analysis is reasoned, not authority-verified).


      ### Generated analysis (reasoned, not authority-verified)

      - The customer-as-user allocation and the two-step adverse-action framework
      are reasoned from FCRA''s structure and the confirmed decision-maker fact.

      - The fair-lending/disparate-impact and payout-restriction analysis is reasoned
      risk assessment, not a verified legal holding.


      ---


      ## Sources


      **Verified / internal:**

      - Original request (REQ-20260903-b1c06e) — matter facts.

      - Matter facts record (facts.md) — confirmed facts and intake answers.

      - Matter issues list (issues.md).

      - First-pass research memo (RES-20260903-3ed787) — FCRA framework analysis.


      **Unverified (not independently confirmed against external authority):**

      - FCRA statutory citations (§ 603, § 604, § 611, § 615, § 623, § 628) and the
      FTC Disposal Rule are cited from the research memo''s model analysis; **no external
      authority was retrieved** (external research timed out). These should be verified
      against current statute and CFPB/FTC guidance before the final answer.

      - All state-law references (ban-the-box, fair-chance) are unverified leads;
      no state-specific research is in the vault.


      ---


      ## What would change this


      - **Working assumption:** The customer is the sole FCRA user if it receives
      only status codes. If Mosaic Relay procures the report and applies the decision
      rules, Mosaic Relay is likely a co-user with its own adverse-action duties —
      materially increasing Mosaic Relay''s compliance burden and changing the product
      design.

      - **Open fork:** Whether screening gates onboarding only or can restrict payouts
      for completed work. If the latter, the consumer-protection, funds-flow disclosure,
      and adverse-action timing issues are materially more acute.

      - **Not examined:** State ban-the-box and fair-chance laws in the contractors''
      states. These vary significantly and can impose individualized-assessment, waiting-period,
      and notice requirements beyond federal FCRA. The vault does not contain state-specific
      research.

      - **Not examined:** The platform customer''s existing contractor terms and payout
      flow. Whether screening can affect payouts for completed work changes the analysis.
      The vault does not contain the customer''s terms.

      - **Not examined:** Current CFPB/FTC guidance on gig-economy/contractor screening.
      External research timed out; no authority was retrieved. The FCRA framework
      here is reasoned from the statute''s structure and should be verified.

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
# Working Recommendation — Consumer Background Checks for Contractor Payouts

**Status:** Working draft for counsel review. Not a durable decision. No durable decision has been recorded.

---

## Bottom line

Mosaic Relay **may** provide this contractor-screening feature, but only if the product is built so that the **platform customer** (the confirmed decision-maker) carries the FCRA "user" obligations — permissible-purpose certification, standalone disclosure and written authorization, and the two-step adverse-action notice process — and Mosaic Relay acts as a compliant service provider that supports and contractually enforces that allocation. The feature is lawful and commercially viable, but it is **not** a "return a status code and walk away" product: the FCRA adverse-action workflow, dispute handling, and data controls must be designed in before launch.

---

## 1. May Mosaic Relay provide the service?

**Yes, with conditions.** Nothing in the request makes the service itself unlawful. The controlling question is not whether the service may exist but how FCRA duties are allocated and whether the product enforces them.

**Key structural point:** The platform customer makes the final eligibility decision (confirmed fact). Under FCRA, the party that uses a consumer report to make a decision bearing on the consumer is the "user" who bears the disclosure, authorization, and adverse-action duties. Because the customer decides, the customer is the FCRA user. Mosaic Relay's role is that of a service provider that procures and processes the report on the customer's behalf.

**The design fork that matters most:** whether Mosaic Relay returns only a status code ("eligible" / "manual review" / "not eligible") or whether the customer ever receives report contents. This determines whether the customer is the sole user or whether Mosaic Relay is also a user. The business goal — not exposing detailed reports to platform staff — points toward Mosaic Relay applying decision rules and returning only status codes, which keeps the customer as the user while shielding report contents. But Mosaic Relay must still be careful: if Mosaic Relay itself procures the report and applies the decision rules that produce the adverse outcome, regulators and courts may treat Mosaic Relay as a co-user with its own duties, even if the customer formally makes the final call. The safest design treats both as users with clearly allocated, contractually documented duties.

---

## 2. FCRA permissible purpose, standalone disclosure, and written authorization

**Permissible purpose.** Screening contractors for payout eligibility is most naturally analyzed under the "employment purposes" permissible purpose (FCRA § 604(a)(3)(B), defined at § 603(h)). The FTC and courts have generally treated independent-contractor screening for work eligibility as within this purpose. **This is an assumption, not a verified holding** — the characterization of contractors (not employees) under § 603(h) should be confirmed against current FTC/CFPB guidance before launch.

**Standalone disclosure and written authorization (FCRA § 604(b)(2)).** Before procuring a consumer report for employment purposes, the user must:
- Provide a **clear and conspicuous disclosure** in a document **consisting solely of the disclosure** that a consumer report may be obtained for employment purposes; and
- Obtain the consumer's **written authorization**.

**Product implication:** The consent screen cannot be buried in general terms. It must be a standalone disclosure document, and the contractor's authorization must be captured and retained. Because screening recurs annually and after events, the question of whether fresh disclosure/authorization is needed for each recheck must be resolved (see § 7).

---

## 3. CRA / user / furnisher roles

- **The vendor is a CRA** (confirmed by intake — limited report, criminal/identity). As a CRA it must maintain reasonable procedures to assure maximum possible accuracy (§ 607(b)) and reinvestigate disputes (§ 611).
- **The platform customer is the user** (confirmed decision-maker). It bears the § 604(b)(2) disclosure/authorization and § 604(b)(3)/§ 615(a) adverse-action duties, and must certify permissible purpose to the CRA (§ 604(f)).
- **Mosaic Relay is a service provider / potential co-user.** Its exposure depends on the data flow. If Mosaic Relay procures the report and applies decision rules, it should be treated as a user with its own duties and should contractually require the customer to comply.
- **Furnisher duties** apply to entities that furnish information to CRAs. Mosaic Relay is not currently a furnisher of the criminal/identity data (the CRA sources it), but if Mosaic Relay ever feeds screening outcomes or dispute results back to a CRA, furnisher accuracy and dispute duties (§ 623) would attach. **Not currently implicated on the stated facts.**

---

## 4. Adverse-action notices (pre-adverse and final)

This is the highest-risk area and must be built into the product.

**Pre-adverse action notice (FCRA § 604(b)(3)).** Before taking adverse action based in whole or in part on a consumer report, the user must provide the consumer with:
- A copy of the consumer report; and
- The CFPB's "Summary of Your Rights Under the Fair Credit Reporting Act."

**Final adverse-action notice (FCRA § 615(a)).** After taking adverse action, the user must provide notice containing:
- The name, address, and phone number of the CRA that furnished the report;
- A statement that the CRA did not make the decision and cannot give reasons for it;
- Notice of the right to obtain a free copy of the report from the CRA within 60 days; and
- Notice of the right to dispute the accuracy or completeness of the information.

**Product implication:** Both "manual review" and "not eligible" outcomes that result in a denial or restriction of payouts are adverse actions and trigger this two-step process. The product must route the report copy and Summary of Rights to the contractor **before** the adverse decision is finalized, and the final notice **after**. Because the customer is the decision-maker, the customer must send these notices — but Mosaic Relay should build the workflow and templates so the customer cannot skip them.

---

## 5. Accuracy, reinvestigation, disputes, and vendor oversight

- **CRA duties:** The vendor must reinvestigate disputes within the statutory timeframe (§ 611) and maintain accuracy procedures (§ 607(b)).
- **User duties:** The customer (and Mosaic Relay as co-user) must notify the CRA of disputes and follow accuracy procedures.
- **Mosaic Relay vendor oversight:** Mosaic Relay should contractually require the CRA to maintain FCRA-compliant accuracy, reinvestigation, and data-quality processes, and should audit the vendor's performance. This is a vendor-management obligation consistent with Mosaic Relay's stated risk posture.
- **Dispute handling:** The product must have a defined dispute path so a contractor who disputes a record can trigger reinvestigation and, if the record is corrected, have the eligibility decision revisited.

---

## 6. Sanctions and identity screening separation

- **Sanctions (OFAC) screening** is generally **not** a consumer report under FCRA when it is based solely on matching a name against a government list without assembling or evaluating other consumer information. It is a separate compliance obligation (sanctions screening), not a consumer-report obligation.
- **Identity verification** may or may not be a consumer report depending on the data sources and whether the vendor assembles/evaluates the information.
- **Critical caveat:** If sanctions or identity data is **bundled into the CRA's consumer report**, it becomes part of the consumer report and is subject to FCRA. The product should keep sanctions/identity screening **separate** from the criminal/identity consumer report to preserve the cleaner treatment, or accept that bundling pulls it under FCRA.

---

## 7. Payout restrictions and fair-lending / discrimination risk

- **Payout restriction vs. onboarding gate.** If screening only gates whether a contractor can begin work (onboarding), the consumer-protection issues are simpler. If screening results **restrict, delay, or condition payouts for already-completed work**, the risk is materially higher: withholding pay for completed work based on a screening result could be challenged as unfair or deceptive if not clearly disclosed upfront, and it triggers the full adverse-action process before the restriction takes effect.
- **Funds-flow disclosure.** Mosaic Relay's role as payment infrastructure means payout timing and conditions should be clearly disclosed in the platform's contractor terms.
- **Fair-lending / discrimination risk.** Criminal-record screening that drives eligibility carries disparate-impact risk under federal and state anti-discrimination and fair-employment law. The decision rules should be designed to avoid disproportionate exclusion, and the customer should apply individualized assessment where state law requires it. **State ban-the-box and fair-chance laws are not in the vault and were not examined** — this is a material gap given US-only scope.

---

## 8. Annual and event-triggered rechecks

- Annual and event-triggered rechecks are permissible in principle, but each recheck that can produce an adverse outcome must follow the same disclosure/authorization and adverse-action process.
- **Open question:** whether a fresh standalone disclosure and written authorization are required for each annual/event recheck, or whether a single onboarding authorization can cover recurring screening. This should be resolved against current FCRA guidance before the product is built. **Not examined in the vault.**

---

## 9. Retention and access controls

- **Retention:** Consumer-report data and identifying information should be retained only as long as needed for the stated purpose, with defined retention periods and secure disposal. FCRA § 628 and the FTC Disposal Rule govern disposal of consumer-report information. **Specific retention periods are not set and were not examined.**
- **Access controls:** The product should enforce least-privilege access so detailed report contents are visible only to those who need them — consistent with the business goal of shielding platform staff. Status codes can be broadly visible; report contents should be restricted.

---

## Recommended path forward

1. **Confirm the data flow** — whether Mosaic Relay returns only status codes or the customer receives report contents. This drives the user allocation.
2. **Confirm the vendor's CRA status and report contents** in the vendor contract (criminal/identity only, per intake).
3. **Resolve the recheck authorization question** (fresh disclosure per recheck vs. single authorization).
4. **Determine contractor state distribution** to scope state ban-the-box and consumer-reporting overlay.
5. **Confirm whether screening affects payouts for completed work** or only gates future work.
6. **Build the FCRA workflow** (standalone disclosure, authorization, pre-adverse + final adverse-action notices, dispute path) into the product before launch.
7. **Contractually allocate duties** among Mosaic Relay, the customer, and the CRA.

---

## Labeled analysis

### Known facts (confirmed)
- Mosaic Relay wants to offer a platform customer a feature that screens contractors before payouts.
- Flow: consent → collect identifying info → vendor background report → return "eligible" / "manual review" / "not eligible" to the customer.
- Business goal: reduce fraud and meet trust requirements without exposing detailed reports to platform staff.
- Screening at onboarding, annually, and after certain fraud/dispute events.
- May use criminal-record, identity, sanctions, and address information; exact contents unsettled.
- **US only** (confirmed).
- **Platform customer makes the final eligibility decision** (confirmed).
- **Vendor is a CRA providing a limited report (criminal/identity only)** (confirmed).

### Assumptions (unconfirmed)
- Contractors are individuals (consumers) in the US, making FCRA the primary framework.
- Screening falls within the "employment purposes" permissible purpose under § 603(h) (contractor, not employee, characterization unverified).
- Mosaic Relay and/or the customer is a "user" of a consumer report under FCRA.
- The customer is the sole user if it receives only status codes; Mosaic Relay may be a co-user if it procures/applies decision rules.

### Missing facts (need to be gathered)
- Exact data flow (status code vs. report contents to customer).
- Adverse-action and dispute-handling procedures currently in place.
- Retention periods for screening data.
- Source and accuracy process for the records used.
- Contractor state distribution.
- Whether screening affects payouts for completed work or only gates future work.

### Unverified leads (not confirmed against authority)
- FTC/CFPB treatment of independent-contractor screening under § 603(h) "employment purposes."
- Whether fresh disclosure/authorization is required for each annual/event recheck.
- State ban-the-box and fair-chance laws in contractor states (not in vault).
- Whether sanctions/identity screening bundled into a CRA report becomes a consumer report (analysis is reasoned, not authority-verified).

### Generated analysis (reasoned, not authority-verified)
- The customer-as-user allocation and the two-step adverse-action framework are reasoned from FCRA's structure and the confirmed decision-maker fact.
- The fair-lending/disparate-impact and payout-restriction analysis is reasoned risk assessment, not a verified legal holding.

---

## Sources

**Verified / internal:**
- Original request (REQ-20260903-b1c06e) — matter facts.
- Matter facts record (facts.md) — confirmed facts and intake answers.
- Matter issues list (issues.md).
- First-pass research memo (RES-20260903-3ed787) — FCRA framework analysis.

**Unverified (not independently confirmed against external authority):**
- FCRA statutory citations (§ 603, § 604, § 611, § 615, § 623, § 628) and the FTC Disposal Rule are cited from the research memo's model analysis; **no external authority was retrieved** (external research timed out). These should be verified against current statute and CFPB/FTC guidance before the final answer.
- All state-law references (ban-the-box, fair-chance) are unverified leads; no state-specific research is in the vault.

---

## What would change this

- **Working assumption:** The customer is the sole FCRA user if it receives only status codes. If Mosaic Relay procures the report and applies the decision rules, Mosaic Relay is likely a co-user with its own adverse-action duties — materially increasing Mosaic Relay's compliance burden and changing the product design.
- **Open fork:** Whether screening gates onboarding only or can restrict payouts for completed work. If the latter, the consumer-protection, funds-flow disclosure, and adverse-action timing issues are materially more acute.
- **Not examined:** State ban-the-box and fair-chance laws in the contractors' states. These vary significantly and can impose individualized-assessment, waiting-period, and notice requirements beyond federal FCRA. The vault does not contain state-specific research.
- **Not examined:** The platform customer's existing contractor terms and payout flow. Whether screening can affect payouts for completed work changes the analysis. The vault does not contain the customer's terms.
- **Not examined:** Current CFPB/FTC guidance on gig-economy/contractor screening. External research timed out; no authority was retrieved. The FCRA framework here is reasoned from the statute's structure and should be verified.
