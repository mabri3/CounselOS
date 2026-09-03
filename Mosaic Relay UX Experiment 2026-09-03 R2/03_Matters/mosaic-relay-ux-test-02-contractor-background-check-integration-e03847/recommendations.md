---
matter_id: MAT-20260903-e03847
record_type: recommendations
current_recommendation_version_id: REC-20260903-1c4c19
recommendation_versions:
- version_id: REC-20260903-1c4c19
  number: 1
  content: '# Working Recommendation — Contractor Background-Check Integration Launch


    **Matter:** Mosaic Relay UX Test — 02 — Contractor Background-Check Integration

    **Status:** Working recommendation (not a durable decision)

    **Target launch:** 2026-10-29 (eight weeks out)


    ---


    ## Recommendation


    **Do not launch screening-linked payout gating on 2026-10-29 unless and until
    all of the following conditions are met.** This is a conditional recommendation:
    launch may proceed only when each condition below is satisfied and verified, not
    merely planned. If any condition is unmet at the launch date, the launch should
    be deferred or the screening-linked payout gating should be decoupled from payouts
    (e.g., run screening in a non-gating "informational" mode) until the condition
    clears.


    The recommendation is grounded in the saved facts, the three partial research
    packets, and the revised FCRA adverse-action draft. It treats regulatory classification
    and partner obligations as material assumptions to surface, per the company risk
    posture.


    ---


    ## Conditions for launch (all must be met)


    ### 1. Platform is the sole decision-maker

    - The platform — not Mosaic Relay, not the vendor, and not an unattended automated
    rule — makes the final decision on every "review" and "fail" result.

    - Mosaic Relay receives only the minimum status code and decision metadata needed
    for payout operations. No full criminal, identity, or eligibility reports flow
    to Mosaic Relay.

    - No payout is auto-denied on a "review" result; holds are reversible and require
    human review with a documented trigger and review path.

    - A launch kill switch exists so screening-linked gating can be disabled without
    disrupting core payout operations.


    ### 2. Vendor report/CRA status and exact reports/data sources confirmed

    - Confirm whether the vendor''s output is an FCRA "consumer report" and whether
    the vendor is a consumer reporting agency (CRA).

    - Obtain and review the vendor API schema and documentation identifying each report,
    data source, retention period, match logic, sanctions lists, work-eligibility
    source, permissible purpose, and geographic coverage.

    - Confirm what criminal-history data the vendor returns (arrests vs. convictions,
    lookback period, offense categories) and whether the vendor offers an individualized-assessment
    module.


    ### 3. Launch states and state-by-state matrix fixed

    - Fix the launch-state list.

    - Build and maintain a state-by-state matrix covering ban-the-box and fair-chance
    rules, notice delivery and waiting periods, permissible report contents, dispute
    and reinvestigation SLAs, language/accessibility, and any pay-to-screen restrictions.

    - Product must block screening or payout where the required state configuration,
    notice, or response timer is missing.


    ### 4. FCRA consent and pre-adverse/adverse-action notices implemented

    - Standalone written disclosure and authorization obtained before any report is
    procured.

    - Permissible-purpose certification in place.

    - Pre-adverse notice delivered with the report and FCRA rights summary, with a
    reasonable response period.

    - Adverse-action notice delivered with all four required elements (CRA contact
    info, statement the CRA did not make the decision, right to a free report within
    60 days, right to dispute).


    ### 5. Dispute/reinvestigation rights and SLAs tested

    - Contractor-facing dispute path is live, identifies the screening vendor, and
    is accessible.

    - Reinvestigation pauses any adverse action while a timely dispute is pending.

    - Vendor reinvestigation and correction SLAs are defined, tested, and escalated;
    final written outcome is delivered.

    - State-specific timing is confirmed against the launch-state matrix.


    ### 6. Status-code-only data minimization and access controls verified

    - Field-level access controls, identifier segregation, and audit logging of every
    access are implemented and tested.

    - Encryption, tenant isolation, least-privilege access, and incident response
    are verified.

    - Prohibition on secondary use of screening data is enforced.


    ### 7. Customer/vendor contracts allocate duties and liability

    - Customer DPA and FCRA allocation and certifications are in place.

    - Vendor flow-downs cover confidentiality, security, deletion, audit, indemnity,
    insurance, regulatory cooperation, and no-use-of-data terms.

    - Roles for adverse-action workflow, dispute ownership, and liability are contractually
    assigned.


    ---


    ## Additional control areas required before launch


    ### BSA/AML and sanctions

    - Sanctions screening cadence and lists are defined; sanctions screening is not
    conflated with criminal-history screening.

    - Confirm which party runs sanctions screening and against which lists, and that
    results are handled under the appropriate framework (not FCRA consumer-reporting
    where not applicable).


    ### Payments

    - Money-transmission characterization is confirmed and which party is the regulated
    actor is documented.

    - Funds-flow boundaries are clear; payout holds have documented triggers and review
    paths; reconciliation and audit trails are in place.


    ### Privacy

    - Identity-data categories, retention, and deletion are defined and minimized.

    - Data minimization, access controls, audit trails, and prompt incident handling
    are implemented.


    ### Discrimination

    - EEOC disparate-impact analysis is completed: arrest vs. conviction distinction,
    no blanket exclusions, targeted screen plus individualized assessment, and business-necessity
    support for the delivery-work context.

    - Disparate-impact risk from criminal-history screening is assessed and mitigated.


    ### Consumer protection

    - FCRA adverse-action, dispute, and reinvestigation rights are implemented and
    tested.

    - Accessibility and language support are provided for notices and dispute paths.


    ### Marketing

    - Marketing and customer-facing claims about screening, "clear/review/fail," and
    payout gating are reviewed for accuracy and to avoid overstating what Mosaic Relay
    does or does not do.


    ---


    ## Assumptions (label as unverified)


    - **Regulatory classification is a material assumption.** Whether the vendor''s
    output is an FCRA consumer report, whether the vendor is a CRA, and whether Mosaic
    Relay is a "user" are not yet confirmed and materially change the obligations.

    - **Independent-contractor classification is assumed** for the delivery contractors;
    if any are reclassified as employees, additional employment-law obligations (including
    state fair-chance and ban-the-box rules and potential Title VII exposure) attach.

    - **No external authority was retrieved** in the research packets (the research
    runs timed out on external search). FCRA statute sections (15 U.S.C. §§ 1681a,
    1681b, 1681i) and EEOC guidance are cited from the packets but should be verified
    against current text before reliance.

    - **Launch-state list is unknown**; the state-by-state matrix cannot be finalized
    until it is fixed.


    ---


    ## Unverified legal leads (to confirm before reliance)


    - Whether a payout hold for an independent contractor constitutes FCRA "adverse
    action" (fact-specific; safer to over-notice).

    - Whether the vendor''s criminal-history data includes arrests vs. convictions
    and the applicable lookback and offense categories.

    - Whether the vendor offers an individualized-assessment module.

    - State-specific ban-the-box, fair-chance, notice, waiting-period, and pay-to-screen
    requirements for the actual launch states.

    - Whether any automated score or rule affects payout, which would implicate additional
    notice and adverse-action obligations.


    ---


    ## Decision point


    This is a working recommendation, not a durable decision. The lawyer should decide
    whether to (a) adopt this conditional recommendation as the launch gate, (b) decouple
    screening from payout gating for the initial launch, or (c) defer the launch.
    If the lawyer wants this to become a durable recorded decision, that should be
    recorded separately.'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-03T16:24:42+00:00'
recommendation_updated_at: '2026-09-03T16:24:42+00:00'
recommendation_updated_by: Themis.ai
proposed_recommendation: null
---
# Working Recommendation — Contractor Background-Check Integration Launch

**Matter:** Mosaic Relay UX Test — 02 — Contractor Background-Check Integration
**Status:** Working recommendation (not a durable decision)
**Target launch:** 2026-10-29 (eight weeks out)

---

## Recommendation

**Do not launch screening-linked payout gating on 2026-10-29 unless and until all of the following conditions are met.** This is a conditional recommendation: launch may proceed only when each condition below is satisfied and verified, not merely planned. If any condition is unmet at the launch date, the launch should be deferred or the screening-linked payout gating should be decoupled from payouts (e.g., run screening in a non-gating "informational" mode) until the condition clears.

The recommendation is grounded in the saved facts, the three partial research packets, and the revised FCRA adverse-action draft. It treats regulatory classification and partner obligations as material assumptions to surface, per the company risk posture.

---

## Conditions for launch (all must be met)

### 1. Platform is the sole decision-maker
- The platform — not Mosaic Relay, not the vendor, and not an unattended automated rule — makes the final decision on every "review" and "fail" result.
- Mosaic Relay receives only the minimum status code and decision metadata needed for payout operations. No full criminal, identity, or eligibility reports flow to Mosaic Relay.
- No payout is auto-denied on a "review" result; holds are reversible and require human review with a documented trigger and review path.
- A launch kill switch exists so screening-linked gating can be disabled without disrupting core payout operations.

### 2. Vendor report/CRA status and exact reports/data sources confirmed
- Confirm whether the vendor's output is an FCRA "consumer report" and whether the vendor is a consumer reporting agency (CRA).
- Obtain and review the vendor API schema and documentation identifying each report, data source, retention period, match logic, sanctions lists, work-eligibility source, permissible purpose, and geographic coverage.
- Confirm what criminal-history data the vendor returns (arrests vs. convictions, lookback period, offense categories) and whether the vendor offers an individualized-assessment module.

### 3. Launch states and state-by-state matrix fixed
- Fix the launch-state list.
- Build and maintain a state-by-state matrix covering ban-the-box and fair-chance rules, notice delivery and waiting periods, permissible report contents, dispute and reinvestigation SLAs, language/accessibility, and any pay-to-screen restrictions.
- Product must block screening or payout where the required state configuration, notice, or response timer is missing.

### 4. FCRA consent and pre-adverse/adverse-action notices implemented
- Standalone written disclosure and authorization obtained before any report is procured.
- Permissible-purpose certification in place.
- Pre-adverse notice delivered with the report and FCRA rights summary, with a reasonable response period.
- Adverse-action notice delivered with all four required elements (CRA contact info, statement the CRA did not make the decision, right to a free report within 60 days, right to dispute).

### 5. Dispute/reinvestigation rights and SLAs tested
- Contractor-facing dispute path is live, identifies the screening vendor, and is accessible.
- Reinvestigation pauses any adverse action while a timely dispute is pending.
- Vendor reinvestigation and correction SLAs are defined, tested, and escalated; final written outcome is delivered.
- State-specific timing is confirmed against the launch-state matrix.

### 6. Status-code-only data minimization and access controls verified
- Field-level access controls, identifier segregation, and audit logging of every access are implemented and tested.
- Encryption, tenant isolation, least-privilege access, and incident response are verified.
- Prohibition on secondary use of screening data is enforced.

### 7. Customer/vendor contracts allocate duties and liability
- Customer DPA and FCRA allocation and certifications are in place.
- Vendor flow-downs cover confidentiality, security, deletion, audit, indemnity, insurance, regulatory cooperation, and no-use-of-data terms.
- Roles for adverse-action workflow, dispute ownership, and liability are contractually assigned.

---

## Additional control areas required before launch

### BSA/AML and sanctions
- Sanctions screening cadence and lists are defined; sanctions screening is not conflated with criminal-history screening.
- Confirm which party runs sanctions screening and against which lists, and that results are handled under the appropriate framework (not FCRA consumer-reporting where not applicable).

### Payments
- Money-transmission characterization is confirmed and which party is the regulated actor is documented.
- Funds-flow boundaries are clear; payout holds have documented triggers and review paths; reconciliation and audit trails are in place.

### Privacy
- Identity-data categories, retention, and deletion are defined and minimized.
- Data minimization, access controls, audit trails, and prompt incident handling are implemented.

### Discrimination
- EEOC disparate-impact analysis is completed: arrest vs. conviction distinction, no blanket exclusions, targeted screen plus individualized assessment, and business-necessity support for the delivery-work context.
- Disparate-impact risk from criminal-history screening is assessed and mitigated.

### Consumer protection
- FCRA adverse-action, dispute, and reinvestigation rights are implemented and tested.
- Accessibility and language support are provided for notices and dispute paths.

### Marketing
- Marketing and customer-facing claims about screening, "clear/review/fail," and payout gating are reviewed for accuracy and to avoid overstating what Mosaic Relay does or does not do.

---

## Assumptions (label as unverified)

- **Regulatory classification is a material assumption.** Whether the vendor's output is an FCRA consumer report, whether the vendor is a CRA, and whether Mosaic Relay is a "user" are not yet confirmed and materially change the obligations.
- **Independent-contractor classification is assumed** for the delivery contractors; if any are reclassified as employees, additional employment-law obligations (including state fair-chance and ban-the-box rules and potential Title VII exposure) attach.
- **No external authority was retrieved** in the research packets (the research runs timed out on external search). FCRA statute sections (15 U.S.C. §§ 1681a, 1681b, 1681i) and EEOC guidance are cited from the packets but should be verified against current text before reliance.
- **Launch-state list is unknown**; the state-by-state matrix cannot be finalized until it is fixed.

---

## Unverified legal leads (to confirm before reliance)

- Whether a payout hold for an independent contractor constitutes FCRA "adverse action" (fact-specific; safer to over-notice).
- Whether the vendor's criminal-history data includes arrests vs. convictions and the applicable lookback and offense categories.
- Whether the vendor offers an individualized-assessment module.
- State-specific ban-the-box, fair-chance, notice, waiting-period, and pay-to-screen requirements for the actual launch states.
- Whether any automated score or rule affects payout, which would implicate additional notice and adverse-action obligations.

---

## Decision point

This is a working recommendation, not a durable decision. The lawyer should decide whether to (a) adopt this conditional recommendation as the launch gate, (b) decouple screening from payout gating for the initial launch, or (c) defer the launch. If the lawyer wants this to become a durable recorded decision, that should be recorded separately.
