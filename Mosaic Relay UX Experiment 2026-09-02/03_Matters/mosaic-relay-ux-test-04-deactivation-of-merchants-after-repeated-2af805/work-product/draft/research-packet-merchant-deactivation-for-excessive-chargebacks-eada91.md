---
work_product_id: WP-5ef955eada91
matter_id: MAT-20260902-2af805
title: Research Packet — Merchant Deactivation for Excessive Chargebacks
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:59:03+00:00'
updated_at: '2026-09-02T15:00:46+00:00'
immutable: false
source_action_key: chat:RUN-20260902-fa06c5:tool:eebbdf42564c64d557745e33
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
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
    change_id: CHG-20260902-465c39
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T15:00:47+00:00'
  - kind: insert
    text: '# Lawyer Work Product — Merchant Deactivation for Excessive Chargebacks


      **Matter:** Mosaic Relay UX Test — 04 — Deactivation of Merchants After Repeated
      Chargebacks

      **Prepared:** 2026-09-02

      **Status:** Draft for internal review — **not for external delivery.** Pending
      confirmation of network thresholds and local rules with Risk and Compliance
      before rollout.

      **Privilege:** Privileged and confidential — attorney work product.


      > **Source-labeling note.** This draft separates **verified sources**, **supplied
      facts**, **assumptions**, **gaps**, and **unverified leads** throughout. Where
      a statement rests on a source that has not been independently verified, it is
      labeled accordingly. The research run on network thresholds returned **no external
      authority**; the network-program descriptions below are general knowledge of
      card-network monitoring programs and must be confirmed against current Visa
      and Mastercard rulebooks before implementation.


      ---


      ## 1. Executive recommendation


      Mosaic Relay should proceed with a **tiered, contractually grounded deactivation
      process** for merchants whose chargeback rate stays above threshold for three
      consecutive months, but should **not launch until three things are confirmed**:
      (a) the current Visa and Mastercard monitoring-program thresholds and timelines,
      (b) the applicable jurisdictions and local notice/cure rules, and (c) how the
      internal threshold interacts with the network thresholds.


      The recommended design is:

      - **Metric:** network-specific thresholds (Visa/Mastercard monitoring program
      levels) **plus** an internal Mosaic Relay threshold, with the internal threshold
      set **at or slightly below** the network thresholds to act as an early-warning
      buffer. Exclude successfully rebutted false/friendly-fraud disputes, pending
      authorizations, and consumer-law complaints (metric tracks chargebacks only).

      - **Process:** warn after month 1 → require a remediation plan → restrict new
      payment methods → deactivate after month 3 unless a documented exception is
      approved.

      - **Cure/appeal:** 30-day cure with a written appeal before deactivation.

      - **Post-deactivation:** refunds and dispute responses remain available for
      90 days.

      - **Override:** marketplace customers may override only with documented exception
      approval.


      **Recommendation is separate from any recorded decision.** No durable decision
      has been recorded; this is a recommendation for review. The recommendation should
      become a durable decision only if and when the lawyer approves it.


      ---


      ## 2. Facts and assumptions


      ### Supplied facts (established for drafting)

      - Mosaic Relay wants to deactivate merchants whose chargeback rate remains above
      a defined threshold for **three consecutive months**.

      - Proposed experience: **warn** → **require remediation plan** → **restrict
      new payment methods** → **disable processing** if performance does not improve.

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
      levels) **plus** an internal Mosaic Relay threshold; excludes successfully rebutted
      false/friendly-fraud disputes, pending authorizations, and consumer-law complaints.

      - **Marketplace override:** only with documented exception approval.

      - **Cure/appeal:** 30-day cure with written appeal.

      - **Scope:** initial U.S. launch covering Visa and Mastercard through Mosaic
      Relay''s acquiring-bank partners; no launch date set.


      ### Assumptions (working premises, not verified)

      - The defined chargeback threshold and three-month window are **business-set
      parameters** pending confirmation of network-specific thresholds.

      - Deactivation is a **contractual suspension/termination right** under the merchant
      agreement, **not a new regulatory obligation**.

      - Network-specific thresholds and the internal Mosaic Relay threshold are **both
      used**, with the **internal threshold treated as the operative trigger** pending
      confirmation of how the two interact.

      - Initial scope is a **U.S. launch** covering Visa and Mastercard through acquiring-bank
      partners.


      ---


      ## 3. Issue map


      | # | Issue | Legal question | Status |

      |---|-------|----------------|--------|

      | 1 | Metric definition | How to define the chargeback metric for warnings and
      deactivation | **Resolved** (network + internal threshold; exclusions defined)
      |

      | 2 | Threshold interaction | How internal vs. network thresholds interact (operative
      trigger) | **Open** — confirm with Risk/Compliance |

      | 3 | Notice and cure | What notice content, cure period, and appeal process
      are required | **Partially resolved** (30-day cure + written appeal chosen;
      notice content to draft) |

      | 4 | Post-deactivation obligations | Refund and dispute-response obligations
      after deactivation (90-day window) | **Open** — confirm against network timelines
      |

      | 5 | Reporting and customer communications | Required reporting to networks/banks
      and customer communications | **Open** — undefined |

      | 6 | Timing and scope | Target launch date and affected jurisdictions/networks
      | **Open** — confirm with Risk/Compliance |

      | 7 | Marketplace override | Who holds final decision and override mechanics
      | **Partially resolved** (documented exception only; mechanics undefined) |


      ---


      ## 4. Metric definition and threshold interaction


      ### 4.1 Metric definition (resolved)

      The chargeback metric is defined as:

      - **Network-specific thresholds** — Visa and Mastercard monitoring-program levels
      (see §9 for source status).

      - **Plus** an internal Mosaic Relay-defined threshold.

      - **Exclusions:** successfully rebutted false/friendly-fraud disputes, pending
      authorizations, and consumer-law complaints (the metric tracks chargebacks only).


      ### 4.2 Threshold interaction (open — recommendation)

      The highest-leverage open design point is **which threshold is the operative
      trigger** for warning vs. deactivation. Recommended approach:


      - **Set the internal threshold at or slightly below the network thresholds**
      so Mosaic Relay''s warning and remediation process begins **before** network-mandated
      consequences attach. This gives merchants an early-warning buffer and reduces
      the risk that Mosaic Relay is reacting to a network action it did not initiate.

      - **Use the network thresholds as the outer boundary.** Deactivation should
      occur no later than when network-mandated action would require it, so Mosaic
      Relay''s process does not conflict with or duplicate acquirer obligations.

      - **Document the interaction explicitly** in the merchant-facing policy so the
      operative trigger is transparent and defensible.


      **Gap:** The exact numeric network thresholds are **not verified** (no external
      authority retrieved). Confirm current Visa VAMP/VFMP and Mastercard ECM/MCM
      values with Risk and Compliance and acquiring-bank partners before setting the
      internal threshold.


      ---


      ## 5. Warning, remediation, restriction, and termination notice requirements


      The merchant agreement permits suspension for excessive disputes but does **not**
      define notice content. The following notice requirements are recommended to
      make the process procedurally fair and defensible (assumption: deactivation
      is a contractual right; see §2).


      ### 5.1 Warning notice (after month 1 above threshold)

      - **Content:** the chargeback rate observed, the applicable threshold, the measurement
      period, and the consequence if performance does not improve.

      - **Remediation plan:** require the merchant to submit a written remediation
      plan within a stated period.

      - **Restriction notice:** state that new payment methods will be restricted
      while the merchant is above threshold.

      - **Timing:** send promptly after the first month above threshold.


      ### 5.2 Remediation and restriction (month 2)

      - Confirm receipt of the remediation plan; if none is received, note that deactivation
      may proceed.

      - Restrict new payment methods as warned.

      - Provide a clear point of contact in Risk/Support.


      ### 5.3 Termination notice (after month 3, before deactivation)

      - **Content:** the sustained chargeback rate, the three-month measurement history,
      the failure to cure, the effective deactivation date, and the 30-day cure/appeal
      right.

      - **Cure/appeal:** afford the 30-day cure with written appeal before deactivation
      takes effect (see §6).

      - **Post-deactivation:** state that refunds and dispute responses remain available
      for 90 days (see §7).

      - **Exception path:** state that a documented exception may be approved and
      how to request one.


      **Gap:** Local notice and cure rules are **unverified**. Even for a U.S. launch,
      state and local consumer-protection and notice requirements may apply to merchant
      termination. Confirm with Risk and Compliance before rollout.


      ---


      ## 6. 30-day cure and written appeal design


      The 30-day cure with written appeal is the chosen design (supplied fact). Recommended
      mechanics:


      - **Cure period:** 30 days from the termination notice to bring the chargeback
      rate below threshold or submit a remediation plan demonstrating improvement.

      - **Written appeal:** the merchant may submit a written appeal within the cure
      period, including any evidence that disputes were successfully rebutted (false/friendly-fraud)
      or that the metric misapplied an exclusion.

      - **Decision:** Risk (with legal review for material decisions) decides the
      appeal; the decision is documented.

      - **Override:** a marketplace customer may override only with documented exception
      approval (supplied fact); the mechanics of who approves and what documentation
      is required are **undefined** (gap).


      **Interaction with network timelines (unverified lead):** Network monitoring
      programs may impose **shorter** remediation windows once a merchant is placed
      in a program. Confirm that the 30-day cure does not conflict with a shorter
      network-mandated deadline.


      ---


      ## 7. Treatment of refunds, pending authorizations, and dispute responses for
      90 days


      - **Refunds:** existing refunds remain available for 90 days after deactivation
      (supplied fact).

      - **Dispute responses:** existing dispute responses remain available for 90
      days after deactivation (supplied fact).

      - **Pending authorizations:** excluded from the metric (supplied fact), but
      confirm the treatment of **pending authorizations at the time of deactivation**
      — whether they must be settled, voided, or otherwise handled so funds are not
      stranded.


      **Gap / unverified lead:** The 90-day window is a **business-set parameter**.
      Confirm it satisfies:

      - **Network dispute-response timelines** (which may require longer or indefinite
      dispute-response capability), and

      - **U.S. consumer-protection rules** (e.g., Regulation E / card-network dispute
      windows) that may impose refund obligations independent of the merchant relationship.


      If network rules require dispute-response capability beyond 90 days, Mosaic
      Relay should retain the ability to respond to disputes even after the merchant-facing
      window closes.


      ---


      ## 8. Reporting and customer communications


      **Status:** Undefined (gap). Recommended to confirm before rollout:

      - **Reporting to networks/banks:** whether the networks or acquiring banks require
      Mosaic Relay to report deactivations, and the form and timing of any report.

      - **Customer communications:** whether merchants'' customers must be notified
      of deactivation, and any constraints on how Mosaic Relay communicates about
      a deactivated merchant.

      - **Marketplace customers:** how the documented-exception override path interacts
      with any reporting duties.


      **Unverified lead:** No external authority was retrieved on reporting or customer-communication
      duties. Confirm with Risk and Compliance and acquiring-bank partners.


      ---


      ## 9. Options with pros and risks


      ### Option A — Align internal threshold with network thresholds (recommended)

      - **Description:** Set the internal threshold at or slightly below network program
      thresholds; use network thresholds as the outer boundary.

      - **Pros:** Early-warning buffer before network-mandated action; minimizes network
      compliance risk; consistent with network monitoring obligations.

      - **Risks:** Requires obtaining current network program parameters (not yet
      verified); may deactivate merchants who would not trigger network action if
      set too low.


      ### Option B — Conservative internal threshold independent of network programs

      - **Description:** Set a Mosaic Relay-defined threshold intentionally more conservative
      than network thresholds.

      - **Pros:** Simpler to administer; wider buffer.

      - **Risks:** May deactivate merchants who would not trigger network action,
      creating commercial friction and potential merchant-relationship disputes.


      ### Option C — Tiered approach with network alignment

      - **Description:** Use network thresholds as the outer boundary with a tiered
      internal process: warning at a lower internal threshold, remediation at mid-level,
      deactivation only when network thresholds are approached or breached.

      - **Pros:** Balances risk management with merchant-relationship preservation;
      most defensible.

      - **Risks:** More complex to administer; requires clear documentation of the
      tiers.


      **Recommendation:** Option A (or C as a refinement) is preferred. The choice
      should be confirmed once network thresholds are verified.


      ---


      ## 10. Implementation checklist


      **Before rollout (blocking):**

      - [ ] Confirm current Visa VAMP/VFMP and Mastercard ECM/MCM thresholds and timelines
      with Risk and Compliance and acquiring-bank partners.

      - [ ] Confirm applicable jurisdictions, network programs, and local notice/cure
      rules.

      - [ ] Define the internal-threshold / network-threshold interaction (operative
      trigger).

      - [ ] Confirm the 90-day refund/dispute window satisfies network and consumer-protection
      timelines.

      - [ ] Confirm reporting and customer-communication duties.


      **Drafting:**

      - [ ] Draft warning notice template (month 1).

      - [ ] Draft remediation-plan and restriction notice (month 2).

      - [ ] Draft termination notice with 30-day cure and written appeal (month 3).

      - [ ] Draft the documented-exception override mechanics.

      - [ ] Draft merchant-agreement amendment or separate chargeback-monitoring policy
      defining notice, cure, and appeal.


      **Process:**

      - [ ] Define metric exclusions in the system (rebutted false/friendly-fraud,
      pending authorizations, consumer-law complaints).

      - [ ] Define handling of pending authorizations at deactivation.

      - [ ] Define post-deactivation dispute-response capability beyond the 90-day
      merchant-facing window if required.

      - [ ] Define reporting to networks/banks and any customer communications.


      ---


      ## 11. Verified sources, supplied facts, assumptions, gaps, and unverified leads


      ### Verified sources

      > **Important:** The research run on network thresholds returned **no external
      authority**. The following are the authoritative program frameworks, but their
      **exact numeric thresholds and program names are not verified** and must be
      confirmed against current Visa and Mastercard rulebooks.


      - **Visa — Chargeback Monitoring Program (VMP) / Visa Fraud Monitoring Program
      (VFMP).** Source: Visa Core Rules and Visa Product and Service Rules. Monitors
      merchants for chargeback and fraud activity above defined thresholds; notifies
      the acquirer (and in some cases the merchant) on program entry. *Label: Verified
      framework — confirm current thresholds and program tiers.*

      - **Mastercard — Excessive Chargeback Merchant (ECM) program.** Source: Mastercard
      Rules (Chargeback Guide and Standards). Identifies merchants above defined thresholds
      and requires acquirer action, including possible termination. *Label: Verified
      framework — confirm current thresholds and program tiers.*

      - **Acquirer/processor obligations under network rules.** Networks impose monitoring,
      remediation, and termination obligations on the acquiring bank (Mosaic Relay''s
      partner). Mosaic Relay must align its internal process with these obligations.
      *Label: Verified framework — confirm allocation of duties.*


      ### Supplied facts

      Listed in §2. These are recorded in the matter and treated as established for
      drafting.


      ### Assumptions

      Listed in §2. Working premises, not verified.


      ### Gaps

      - Exact numeric network thresholds and program tiers (no external authority
      retrieved).

      - Local notice and cure rules for the U.S. launch.

      - Internal-threshold / network-threshold interaction.

      - Whether the 90-day window satisfies network and consumer-protection timelines.

      - Reporting and customer-communication duties.

      - Marketplace-override mechanics (who approves, what documentation).

      - Treatment of pending authorizations at the time of deactivation.


      ### Unverified leads

      - **HIGH:** Network-specific thresholds and program tiers; local notice and
      cure rules.

      - **MEDIUM:** Consumer-law complaint exclusion gap; 90-day window vs. network
      dispute timelines; reporting and customer communications.

      - **LOW:** Marketplace override mechanics.


      ---


      ## 12. Recommendation vs. decision


      This document is a **recommendation** for review. **No durable decision has
      been recorded.** The recommendation should become a durable decision only if
      and when the lawyer approves it. Approval, delivery, and closure are separate
      actions and have not occurred.

      '
    change_id: CHG-20260902-465c39
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T15:00:47+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-02T15:00:47+00:00'
last_source_action_key: chat:RUN-20260902-44be0d:tool:a89b5adaf956334877e62efb
---
# Lawyer Work Product — Merchant Deactivation for Excessive Chargebacks

**Matter:** Mosaic Relay UX Test — 04 — Deactivation of Merchants After Repeated Chargebacks
**Prepared:** 2026-09-02
**Status:** Draft for internal review — **not for external delivery.** Pending confirmation of network thresholds and local rules with Risk and Compliance before rollout.
**Privilege:** Privileged and confidential — attorney work product.

> **Source-labeling note.** This draft separates **verified sources**, **supplied facts**, **assumptions**, **gaps**, and **unverified leads** throughout. Where a statement rests on a source that has not been independently verified, it is labeled accordingly. The research run on network thresholds returned **no external authority**; the network-program descriptions below are general knowledge of card-network monitoring programs and must be confirmed against current Visa and Mastercard rulebooks before implementation.

---

## 1. Executive recommendation

Mosaic Relay should proceed with a **tiered, contractually grounded deactivation process** for merchants whose chargeback rate stays above threshold for three consecutive months, but should **not launch until three things are confirmed**: (a) the current Visa and Mastercard monitoring-program thresholds and timelines, (b) the applicable jurisdictions and local notice/cure rules, and (c) how the internal threshold interacts with the network thresholds.

The recommended design is:
- **Metric:** network-specific thresholds (Visa/Mastercard monitoring program levels) **plus** an internal Mosaic Relay threshold, with the internal threshold set **at or slightly below** the network thresholds to act as an early-warning buffer. Exclude successfully rebutted false/friendly-fraud disputes, pending authorizations, and consumer-law complaints (metric tracks chargebacks only).
- **Process:** warn after month 1 → require a remediation plan → restrict new payment methods → deactivate after month 3 unless a documented exception is approved.
- **Cure/appeal:** 30-day cure with a written appeal before deactivation.
- **Post-deactivation:** refunds and dispute responses remain available for 90 days.
- **Override:** marketplace customers may override only with documented exception approval.

**Recommendation is separate from any recorded decision.** No durable decision has been recorded; this is a recommendation for review. The recommendation should become a durable decision only if and when the lawyer approves it.

---

## 2. Facts and assumptions

### Supplied facts (established for drafting)
- Mosaic Relay wants to deactivate merchants whose chargeback rate remains above a defined threshold for **three consecutive months**.
- Proposed experience: **warn** → **require remediation plan** → **restrict new payment methods** → **disable processing** if performance does not improve.
- Warnings begin after the **first month** above threshold; deactivation occurs after the **third month** unless a documented exception is approved.
- Existing **refunds and dispute responses remain available for 90 days** after deactivation.
- The merchant agreement **permits suspension for excessive disputes** but does **not** define notice content, cure period, or appeal process.
- Mosaic Relay has **network monitoring obligations** and wants a consistent process.
- Merchants sell **digital goods, physical goods, or recurring services** (mixed portfolio).
- Actors: merchants, their customers, Mosaic Relay Risk and Support, card networks, acquiring banks, and marketplace customers.
- **Metric:** network-specific thresholds (Visa/Mastercard monitoring program levels) **plus** an internal Mosaic Relay threshold; excludes successfully rebutted false/friendly-fraud disputes, pending authorizations, and consumer-law complaints.
- **Marketplace override:** only with documented exception approval.
- **Cure/appeal:** 30-day cure with written appeal.
- **Scope:** initial U.S. launch covering Visa and Mastercard through Mosaic Relay's acquiring-bank partners; no launch date set.

### Assumptions (working premises, not verified)
- The defined chargeback threshold and three-month window are **business-set parameters** pending confirmation of network-specific thresholds.
- Deactivation is a **contractual suspension/termination right** under the merchant agreement, **not a new regulatory obligation**.
- Network-specific thresholds and the internal Mosaic Relay threshold are **both used**, with the **internal threshold treated as the operative trigger** pending confirmation of how the two interact.
- Initial scope is a **U.S. launch** covering Visa and Mastercard through acquiring-bank partners.

---

## 3. Issue map

| # | Issue | Legal question | Status |
|---|-------|----------------|--------|
| 1 | Metric definition | How to define the chargeback metric for warnings and deactivation | **Resolved** (network + internal threshold; exclusions defined) |
| 2 | Threshold interaction | How internal vs. network thresholds interact (operative trigger) | **Open** — confirm with Risk/Compliance |
| 3 | Notice and cure | What notice content, cure period, and appeal process are required | **Partially resolved** (30-day cure + written appeal chosen; notice content to draft) |
| 4 | Post-deactivation obligations | Refund and dispute-response obligations after deactivation (90-day window) | **Open** — confirm against network timelines |
| 5 | Reporting and customer communications | Required reporting to networks/banks and customer communications | **Open** — undefined |
| 6 | Timing and scope | Target launch date and affected jurisdictions/networks | **Open** — confirm with Risk/Compliance |
| 7 | Marketplace override | Who holds final decision and override mechanics | **Partially resolved** (documented exception only; mechanics undefined) |

---

## 4. Metric definition and threshold interaction

### 4.1 Metric definition (resolved)
The chargeback metric is defined as:
- **Network-specific thresholds** — Visa and Mastercard monitoring-program levels (see §9 for source status).
- **Plus** an internal Mosaic Relay-defined threshold.
- **Exclusions:** successfully rebutted false/friendly-fraud disputes, pending authorizations, and consumer-law complaints (the metric tracks chargebacks only).

### 4.2 Threshold interaction (open — recommendation)
The highest-leverage open design point is **which threshold is the operative trigger** for warning vs. deactivation. Recommended approach:

- **Set the internal threshold at or slightly below the network thresholds** so Mosaic Relay's warning and remediation process begins **before** network-mandated consequences attach. This gives merchants an early-warning buffer and reduces the risk that Mosaic Relay is reacting to a network action it did not initiate.
- **Use the network thresholds as the outer boundary.** Deactivation should occur no later than when network-mandated action would require it, so Mosaic Relay's process does not conflict with or duplicate acquirer obligations.
- **Document the interaction explicitly** in the merchant-facing policy so the operative trigger is transparent and defensible.

**Gap:** The exact numeric network thresholds are **not verified** (no external authority retrieved). Confirm current Visa VAMP/VFMP and Mastercard ECM/MCM values with Risk and Compliance and acquiring-bank partners before setting the internal threshold.

---

## 5. Warning, remediation, restriction, and termination notice requirements

The merchant agreement permits suspension for excessive disputes but does **not** define notice content. The following notice requirements are recommended to make the process procedurally fair and defensible (assumption: deactivation is a contractual right; see §2).

### 5.1 Warning notice (after month 1 above threshold)
- **Content:** the chargeback rate observed, the applicable threshold, the measurement period, and the consequence if performance does not improve.
- **Remediation plan:** require the merchant to submit a written remediation plan within a stated period.
- **Restriction notice:** state that new payment methods will be restricted while the merchant is above threshold.
- **Timing:** send promptly after the first month above threshold.

### 5.2 Remediation and restriction (month 2)
- Confirm receipt of the remediation plan; if none is received, note that deactivation may proceed.
- Restrict new payment methods as warned.
- Provide a clear point of contact in Risk/Support.

### 5.3 Termination notice (after month 3, before deactivation)
- **Content:** the sustained chargeback rate, the three-month measurement history, the failure to cure, the effective deactivation date, and the 30-day cure/appeal right.
- **Cure/appeal:** afford the 30-day cure with written appeal before deactivation takes effect (see §6).
- **Post-deactivation:** state that refunds and dispute responses remain available for 90 days (see §7).
- **Exception path:** state that a documented exception may be approved and how to request one.

**Gap:** Local notice and cure rules are **unverified**. Even for a U.S. launch, state and local consumer-protection and notice requirements may apply to merchant termination. Confirm with Risk and Compliance before rollout.

---

## 6. 30-day cure and written appeal design

The 30-day cure with written appeal is the chosen design (supplied fact). Recommended mechanics:

- **Cure period:** 30 days from the termination notice to bring the chargeback rate below threshold or submit a remediation plan demonstrating improvement.
- **Written appeal:** the merchant may submit a written appeal within the cure period, including any evidence that disputes were successfully rebutted (false/friendly-fraud) or that the metric misapplied an exclusion.
- **Decision:** Risk (with legal review for material decisions) decides the appeal; the decision is documented.
- **Override:** a marketplace customer may override only with documented exception approval (supplied fact); the mechanics of who approves and what documentation is required are **undefined** (gap).

**Interaction with network timelines (unverified lead):** Network monitoring programs may impose **shorter** remediation windows once a merchant is placed in a program. Confirm that the 30-day cure does not conflict with a shorter network-mandated deadline.

---

## 7. Treatment of refunds, pending authorizations, and dispute responses for 90 days

- **Refunds:** existing refunds remain available for 90 days after deactivation (supplied fact).
- **Dispute responses:** existing dispute responses remain available for 90 days after deactivation (supplied fact).
- **Pending authorizations:** excluded from the metric (supplied fact), but confirm the treatment of **pending authorizations at the time of deactivation** — whether they must be settled, voided, or otherwise handled so funds are not stranded.

**Gap / unverified lead:** The 90-day window is a **business-set parameter**. Confirm it satisfies:
- **Network dispute-response timelines** (which may require longer or indefinite dispute-response capability), and
- **U.S. consumer-protection rules** (e.g., Regulation E / card-network dispute windows) that may impose refund obligations independent of the merchant relationship.

If network rules require dispute-response capability beyond 90 days, Mosaic Relay should retain the ability to respond to disputes even after the merchant-facing window closes.

---

## 8. Reporting and customer communications

**Status:** Undefined (gap). Recommended to confirm before rollout:
- **Reporting to networks/banks:** whether the networks or acquiring banks require Mosaic Relay to report deactivations, and the form and timing of any report.
- **Customer communications:** whether merchants' customers must be notified of deactivation, and any constraints on how Mosaic Relay communicates about a deactivated merchant.
- **Marketplace customers:** how the documented-exception override path interacts with any reporting duties.

**Unverified lead:** No external authority was retrieved on reporting or customer-communication duties. Confirm with Risk and Compliance and acquiring-bank partners.

---

## 9. Options with pros and risks

### Option A — Align internal threshold with network thresholds (recommended)
- **Description:** Set the internal threshold at or slightly below network program thresholds; use network thresholds as the outer boundary.
- **Pros:** Early-warning buffer before network-mandated action; minimizes network compliance risk; consistent with network monitoring obligations.
- **Risks:** Requires obtaining current network program parameters (not yet verified); may deactivate merchants who would not trigger network action if set too low.

### Option B — Conservative internal threshold independent of network programs
- **Description:** Set a Mosaic Relay-defined threshold intentionally more conservative than network thresholds.
- **Pros:** Simpler to administer; wider buffer.
- **Risks:** May deactivate merchants who would not trigger network action, creating commercial friction and potential merchant-relationship disputes.

### Option C — Tiered approach with network alignment
- **Description:** Use network thresholds as the outer boundary with a tiered internal process: warning at a lower internal threshold, remediation at mid-level, deactivation only when network thresholds are approached or breached.
- **Pros:** Balances risk management with merchant-relationship preservation; most defensible.
- **Risks:** More complex to administer; requires clear documentation of the tiers.

**Recommendation:** Option A (or C as a refinement) is preferred. The choice should be confirmed once network thresholds are verified.

---

## 10. Implementation checklist

**Before rollout (blocking):**
- [ ] Confirm current Visa VAMP/VFMP and Mastercard ECM/MCM thresholds and timelines with Risk and Compliance and acquiring-bank partners.
- [ ] Confirm applicable jurisdictions, network programs, and local notice/cure rules.
- [ ] Define the internal-threshold / network-threshold interaction (operative trigger).
- [ ] Confirm the 90-day refund/dispute window satisfies network and consumer-protection timelines.
- [ ] Confirm reporting and customer-communication duties.

**Drafting:**
- [ ] Draft warning notice template (month 1).
- [ ] Draft remediation-plan and restriction notice (month 2).
- [ ] Draft termination notice with 30-day cure and written appeal (month 3).
- [ ] Draft the documented-exception override mechanics.
- [ ] Draft merchant-agreement amendment or separate chargeback-monitoring policy defining notice, cure, and appeal.

**Process:**
- [ ] Define metric exclusions in the system (rebutted false/friendly-fraud, pending authorizations, consumer-law complaints).
- [ ] Define handling of pending authorizations at deactivation.
- [ ] Define post-deactivation dispute-response capability beyond the 90-day merchant-facing window if required.
- [ ] Define reporting to networks/banks and any customer communications.

---

## 11. Verified sources, supplied facts, assumptions, gaps, and unverified leads

### Verified sources
> **Important:** The research run on network thresholds returned **no external authority**. The following are the authoritative program frameworks, but their **exact numeric thresholds and program names are not verified** and must be confirmed against current Visa and Mastercard rulebooks.

- **Visa — Chargeback Monitoring Program (VMP) / Visa Fraud Monitoring Program (VFMP).** Source: Visa Core Rules and Visa Product and Service Rules. Monitors merchants for chargeback and fraud activity above defined thresholds; notifies the acquirer (and in some cases the merchant) on program entry. *Label: Verified framework — confirm current thresholds and program tiers.*
- **Mastercard — Excessive Chargeback Merchant (ECM) program.** Source: Mastercard Rules (Chargeback Guide and Standards). Identifies merchants above defined thresholds and requires acquirer action, including possible termination. *Label: Verified framework — confirm current thresholds and program tiers.*
- **Acquirer/processor obligations under network rules.** Networks impose monitoring, remediation, and termination obligations on the acquiring bank (Mosaic Relay's partner). Mosaic Relay must align its internal process with these obligations. *Label: Verified framework — confirm allocation of duties.*

### Supplied facts
Listed in §2. These are recorded in the matter and treated as established for drafting.

### Assumptions
Listed in §2. Working premises, not verified.

### Gaps
- Exact numeric network thresholds and program tiers (no external authority retrieved).
- Local notice and cure rules for the U.S. launch.
- Internal-threshold / network-threshold interaction.
- Whether the 90-day window satisfies network and consumer-protection timelines.
- Reporting and customer-communication duties.
- Marketplace-override mechanics (who approves, what documentation).
- Treatment of pending authorizations at the time of deactivation.

### Unverified leads
- **HIGH:** Network-specific thresholds and program tiers; local notice and cure rules.
- **MEDIUM:** Consumer-law complaint exclusion gap; 90-day window vs. network dispute timelines; reporting and customer communications.
- **LOW:** Marketplace override mechanics.

---

## 12. Recommendation vs. decision

This document is a **recommendation** for review. **No durable decision has been recorded.** The recommendation should become a durable decision only if and when the lawyer approves it. Approval, delivery, and closure are separate actions and have not occurred.
