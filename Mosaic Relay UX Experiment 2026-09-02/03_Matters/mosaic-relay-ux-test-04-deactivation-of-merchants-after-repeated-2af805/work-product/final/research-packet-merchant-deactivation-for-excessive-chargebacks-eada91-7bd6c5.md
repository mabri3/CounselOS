---
work_product_id: WP-5ef955eada91
matter_id: MAT-20260902-2af805
title: Research Packet — Merchant Deactivation for Excessive Chargebacks
record_type: work_product
state: final
summary: ''
created_at: '2026-09-02T14:59:03+00:00'
updated_at: '2026-09-02T14:59:03+00:00'
immutable: true
source_action_key: chat:RUN-20260902-fa06c5:tool:eebbdf42564c64d557745e33
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Research Packet — Merchant Deactivation for Excessive Chargebacks


      **Matter:** Mosaic Relay UX Test — 04 — Deactivation of Merchants After Repeated
      Chargebacks

      **Prepared:** 2026-09-02

      **Status:** Working packet — background research runs in progress; verify network
      thresholds and local rules with Risk and Compliance before rollout.


      This packet separates **verified sources**, **supplied facts**, **assumptions**,
      and **unverified leads** so counsel can see at a glance what is established,
      what is assumed, and what still needs confirmation.


      ---


      ## 1. Verified sources


      > These are the primary card-network program frameworks that govern chargeback
      monitoring, notice, and cure. They are the authoritative source layer for the
      metric and process design. Exact numeric thresholds and program names should
      be confirmed against the current Visa and Mastercard rulebooks (see Unverified
      leads).


      ### Visa — Chargeback Monitoring Program (VMP) / Visa Fraud Monitoring Program
      (VFMP)

      - **Source:** Visa Core Rules and Visa Product and Service Rules (Visa Rules),
      Chargeback Monitoring Program (VMP) and Visa Fraud Monitoring Program (VFMP).

      - **What it covers:** Visa monitors merchants for chargeback and fraud activity
      above defined thresholds and notifies the acquirer (and, in some cases, the
      merchant) when a merchant enters a monitoring program.

      - **Relevance to this matter:** These are the "network-specific thresholds"
      the metric is designed to track. Visa program entry is a network-level trigger
      that Mosaic Relay''s acquiring-bank partners must manage; deactivation for excessive
      chargebacks is a separate, contractual step Mosaic Relay controls.

      - **Label:** Verified framework — confirm current thresholds and program tiers.


      ### Mastercard — Excessive Chargeback Merchant (ECM) program

      - **Source:** Mastercard Rules (Mastercard Chargeback Guide and Standards),
      Excessive Chargeback Merchant (ECM) program.

      - **What it covers:** Mastercard identifies merchants whose chargeback activity
      exceeds defined thresholds and requires the acquirer to take action, including
      possible termination of the merchant.

      - **Relevance to this matter:** Mirrors the Visa framework as the second network-specific
      threshold layer. Mastercard''s ECM program can itself require acquirer action
      (including termination), which interacts with Mosaic Relay''s internal deactivation
      process.

      - **Label:** Verified framework — confirm current thresholds and program tiers.


      ### Acquirer/processor obligations under network rules

      - **Source:** Visa and Mastercard rules on acquirer responsibilities for monitoring,
      remediation, and termination of high-chargeback merchants.

      - **What it covers:** Networks impose obligations on the **acquiring bank**
      (Mosaic Relay''s partner) to monitor and act on excessive chargebacks. Mosaic
      Relay, as the processor coordinating with acquiring banks, must align its internal
      process with these acquirer obligations so its deactivation decisions do not
      conflict with or duplicate network-mandated actions.

      - **Relevance to this matter:** Explains why Mosaic Relay has "network monitoring
      obligations" and why the internal threshold and the network thresholds must
      be reconciled.

      - **Label:** Verified framework — confirm allocation of duties between Mosaic
      Relay and its acquiring-bank partners.


      ---


      ## 2. Supplied facts


      > These are the facts provided by the requester and the intake answers. They
      are recorded in the matter and treated as established for drafting purposes.


      - Mosaic Relay wants to deactivate merchants whose chargeback rate remains above
      a defined threshold for **three consecutive months**.

      - The proposed experience: **warn** the merchant, **require a remediation plan**,
      **restrict new payment methods**, then **disable processing** if performance
      does not improve.

      - Warnings begin after the **first month** above threshold; deactivation occurs
      after the **third month** unless a documented exception is approved.

      - Existing **refunds and dispute responses remain available for 90 days** after
      deactivation.

      - The merchant agreement **permits suspension for excessive disputes** but does
      **not** define notice content, cure period, or appeal process.

      - Mosaic Relay has **network monitoring obligations** and wants a consistent
      process.

      - Merchants sell **digital goods, physical goods, or recurring services** (mixed
      portfolio).

      - Actors: merchants, their customers, Mosaic Relay Risk and Support, card networks,
      acquiring banks, and marketplace customers.

      - **Metric:** network-specific thresholds (Visa/Mastercard monitoring program
      levels) **plus** an internal Mosaic Relay-defined threshold; excludes successfully
      rebutted false/friendly-fraud disputes, pending authorizations, and consumer-law
      complaints (metric tracks chargebacks only).

      - **Marketplace override:** only with documented exception approval.

      - **Cure/appeal:** 30-day cure with written appeal.

      - **Scope:** initial U.S. launch covering Visa and Mastercard through Mosaic
      Relay''s acquiring-bank partners; no launch date set.


      ---


      ## 3. Assumptions


      > These are recorded assumptions in the matter. They are reasonable working
      premises but are **not** verified facts and should be flagged in any draft.


      - The defined chargeback threshold and three-month window are treated as **business-set
      parameters** pending confirmation of network-specific thresholds.

      - Deactivation is a **contractual suspension/termination right** under the merchant
      agreement, **not a new regulatory obligation**.

      - Network-specific thresholds and the internal Mosaic Relay threshold are **both
      used**, with the **internal threshold treated as the operative trigger** pending
      confirmation of how the two interact.

      - Initial scope is a **U.S. launch** covering Visa and Mastercard through acquiring-bank
      partners.


      ---


      ## 4. Unverified leads


      > These items need confirmation before rollout. They are the highest-risk open
      items and map to the open work items in the matter.


      ### Network-specific thresholds and program tiers (HIGH)

      - **Confirm with Risk and Compliance / acquiring-bank partners:** the current
      Visa VMP/VFMP and Mastercard ECM threshold values, program tiers, and timelines
      that apply to a U.S. merchant. The metric references these but the exact numbers
      are not yet verified.

      - **Interaction question:** how the internal Mosaic Relay threshold interacts
      with the network thresholds — which is the operative trigger for warning vs.
      deactivation. This is an open work item.


      ### Local notice and cure rules (HIGH)

      - **Confirm applicable jurisdictions and local notice rules** before rollout.
      Even though the initial launch is U.S., state and local consumer-protection
      and notice requirements may apply to merchant termination. The matter flags
      this as a pre-rollout confirmation.


      ### Consumer-law complaints in the metric (MEDIUM)

      - The metric **excludes** consumer-law complaints (tracks chargebacks only).
      Confirm this aligns with how the networks define chargebacks and that excluding
      them does not create a gap where a merchant with high consumer complaints but
      low chargebacks escapes monitoring.


      ### Post-deactivation refund and dispute obligations (MEDIUM)

      - The 90-day post-deactivation window for refunds and dispute responses is a
      business-set parameter. Confirm it satisfies network dispute-response timelines
      and any U.S. rules (e.g., Regulation E / card network dispute windows) so Mosaic
      Relay does not miss a response deadline after deactivation.


      ### Reporting and customer communications (MEDIUM)

      - Any required reporting to networks/banks after deactivation, and any customer
      communications, are undefined. Confirm whether the networks or acquiring banks
      require Mosaic Relay to report deactivations, and whether merchants'' customers
      must be notified.


      ### Marketplace override mechanics (LOW)

      - Marketplace customers can override only with documented exception approval.
      The mechanics of that exception path (who approves, what documentation) are
      not yet defined.


      ---


      ## Next steps


      1. **Background research runs** are in progress on: (a) Visa/Mastercard monitoring
      thresholds and timelines, (b) network notice/cure/appeal requirements before
      termination, and (c) post-termination refund and dispute obligations. Memos
      will be saved to the research folder when complete.

      2. **Confirm with Risk and Compliance** the applicable jurisdictions, network
      programs, and local notice rules before rollout (open work item).

      3. **Define the internal-threshold / network-threshold interaction** (open work
      item).

      4. Then draft the warning and termination notice templates and the process documentation.

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
final_id: FINAL-20260902-7bd6c5
finalized_at: '2026-09-02T14:59:52+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-04-deactivation-of-merchants-after-repeated-2af805/work-product/draft/research-packet-merchant-deactivation-for-excessive-chargebacks-eada91.md
source_content_hash: 319887520aba33bea01df90676430b59edead1db901c02ee0e57e404c716953b
---
# Research Packet — Merchant Deactivation for Excessive Chargebacks

**Matter:** Mosaic Relay UX Test — 04 — Deactivation of Merchants After Repeated Chargebacks
**Prepared:** 2026-09-02
**Status:** Working packet — background research runs in progress; verify network thresholds and local rules with Risk and Compliance before rollout.

This packet separates **verified sources**, **supplied facts**, **assumptions**, and **unverified leads** so counsel can see at a glance what is established, what is assumed, and what still needs confirmation.

---

## 1. Verified sources

> These are the primary card-network program frameworks that govern chargeback monitoring, notice, and cure. They are the authoritative source layer for the metric and process design. Exact numeric thresholds and program names should be confirmed against the current Visa and Mastercard rulebooks (see Unverified leads).

### Visa — Chargeback Monitoring Program (VMP) / Visa Fraud Monitoring Program (VFMP)
- **Source:** Visa Core Rules and Visa Product and Service Rules (Visa Rules), Chargeback Monitoring Program (VMP) and Visa Fraud Monitoring Program (VFMP).
- **What it covers:** Visa monitors merchants for chargeback and fraud activity above defined thresholds and notifies the acquirer (and, in some cases, the merchant) when a merchant enters a monitoring program.
- **Relevance to this matter:** These are the "network-specific thresholds" the metric is designed to track. Visa program entry is a network-level trigger that Mosaic Relay's acquiring-bank partners must manage; deactivation for excessive chargebacks is a separate, contractual step Mosaic Relay controls.
- **Label:** Verified framework — confirm current thresholds and program tiers.

### Mastercard — Excessive Chargeback Merchant (ECM) program
- **Source:** Mastercard Rules (Mastercard Chargeback Guide and Standards), Excessive Chargeback Merchant (ECM) program.
- **What it covers:** Mastercard identifies merchants whose chargeback activity exceeds defined thresholds and requires the acquirer to take action, including possible termination of the merchant.
- **Relevance to this matter:** Mirrors the Visa framework as the second network-specific threshold layer. Mastercard's ECM program can itself require acquirer action (including termination), which interacts with Mosaic Relay's internal deactivation process.
- **Label:** Verified framework — confirm current thresholds and program tiers.

### Acquirer/processor obligations under network rules
- **Source:** Visa and Mastercard rules on acquirer responsibilities for monitoring, remediation, and termination of high-chargeback merchants.
- **What it covers:** Networks impose obligations on the **acquiring bank** (Mosaic Relay's partner) to monitor and act on excessive chargebacks. Mosaic Relay, as the processor coordinating with acquiring banks, must align its internal process with these acquirer obligations so its deactivation decisions do not conflict with or duplicate network-mandated actions.
- **Relevance to this matter:** Explains why Mosaic Relay has "network monitoring obligations" and why the internal threshold and the network thresholds must be reconciled.
- **Label:** Verified framework — confirm allocation of duties between Mosaic Relay and its acquiring-bank partners.

---

## 2. Supplied facts

> These are the facts provided by the requester and the intake answers. They are recorded in the matter and treated as established for drafting purposes.

- Mosaic Relay wants to deactivate merchants whose chargeback rate remains above a defined threshold for **three consecutive months**.
- The proposed experience: **warn** the merchant, **require a remediation plan**, **restrict new payment methods**, then **disable processing** if performance does not improve.
- Warnings begin after the **first month** above threshold; deactivation occurs after the **third month** unless a documented exception is approved.
- Existing **refunds and dispute responses remain available for 90 days** after deactivation.
- The merchant agreement **permits suspension for excessive disputes** but does **not** define notice content, cure period, or appeal process.
- Mosaic Relay has **network monitoring obligations** and wants a consistent process.
- Merchants sell **digital goods, physical goods, or recurring services** (mixed portfolio).
- Actors: merchants, their customers, Mosaic Relay Risk and Support, card networks, acquiring banks, and marketplace customers.
- **Metric:** network-specific thresholds (Visa/Mastercard monitoring program levels) **plus** an internal Mosaic Relay-defined threshold; excludes successfully rebutted false/friendly-fraud disputes, pending authorizations, and consumer-law complaints (metric tracks chargebacks only).
- **Marketplace override:** only with documented exception approval.
- **Cure/appeal:** 30-day cure with written appeal.
- **Scope:** initial U.S. launch covering Visa and Mastercard through Mosaic Relay's acquiring-bank partners; no launch date set.

---

## 3. Assumptions

> These are recorded assumptions in the matter. They are reasonable working premises but are **not** verified facts and should be flagged in any draft.

- The defined chargeback threshold and three-month window are treated as **business-set parameters** pending confirmation of network-specific thresholds.
- Deactivation is a **contractual suspension/termination right** under the merchant agreement, **not a new regulatory obligation**.
- Network-specific thresholds and the internal Mosaic Relay threshold are **both used**, with the **internal threshold treated as the operative trigger** pending confirmation of how the two interact.
- Initial scope is a **U.S. launch** covering Visa and Mastercard through acquiring-bank partners.

---

## 4. Unverified leads

> These items need confirmation before rollout. They are the highest-risk open items and map to the open work items in the matter.

### Network-specific thresholds and program tiers (HIGH)
- **Confirm with Risk and Compliance / acquiring-bank partners:** the current Visa VMP/VFMP and Mastercard ECM threshold values, program tiers, and timelines that apply to a U.S. merchant. The metric references these but the exact numbers are not yet verified.
- **Interaction question:** how the internal Mosaic Relay threshold interacts with the network thresholds — which is the operative trigger for warning vs. deactivation. This is an open work item.

### Local notice and cure rules (HIGH)
- **Confirm applicable jurisdictions and local notice rules** before rollout. Even though the initial launch is U.S., state and local consumer-protection and notice requirements may apply to merchant termination. The matter flags this as a pre-rollout confirmation.

### Consumer-law complaints in the metric (MEDIUM)
- The metric **excludes** consumer-law complaints (tracks chargebacks only). Confirm this aligns with how the networks define chargebacks and that excluding them does not create a gap where a merchant with high consumer complaints but low chargebacks escapes monitoring.

### Post-deactivation refund and dispute obligations (MEDIUM)
- The 90-day post-deactivation window for refunds and dispute responses is a business-set parameter. Confirm it satisfies network dispute-response timelines and any U.S. rules (e.g., Regulation E / card network dispute windows) so Mosaic Relay does not miss a response deadline after deactivation.

### Reporting and customer communications (MEDIUM)
- Any required reporting to networks/banks after deactivation, and any customer communications, are undefined. Confirm whether the networks or acquiring banks require Mosaic Relay to report deactivations, and whether merchants' customers must be notified.

### Marketplace override mechanics (LOW)
- Marketplace customers can override only with documented exception approval. The mechanics of that exception path (who approves, what documentation) are not yet defined.

---

## Next steps

1. **Background research runs** are in progress on: (a) Visa/Mastercard monitoring thresholds and timelines, (b) network notice/cure/appeal requirements before termination, and (c) post-termination refund and dispute obligations. Memos will be saved to the research folder when complete.
2. **Confirm with Risk and Compliance** the applicable jurisdictions, network programs, and local notice rules before rollout (open work item).
3. **Define the internal-threshold / network-threshold interaction** (open work item).
4. Then draft the warning and termination notice templates and the process documentation.
