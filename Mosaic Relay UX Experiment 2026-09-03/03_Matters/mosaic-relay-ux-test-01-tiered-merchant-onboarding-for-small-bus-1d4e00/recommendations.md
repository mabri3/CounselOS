---
matter_id: MAT-20260903-1d4e00
record_type: recommendations
current_recommendation_version_id: REC-20260903-e9c857
recommendation_versions:
- version_id: REC-20260903-e9c857
  number: 1
  content: '# Working recommendation


    [GENERATED ANALYSIS] Conditional proceed for the six-week launch. Mosaic Relay
    should not launch the lower-verification tier until it completes the controls
    below.


    [SUPPLIED FACT — UNRESOLVED] The payment methods and jurisdictions remain undecided.
    [SUPPLIED FACT — UNRESOLVED] The monthly threshold has no documented risk basis.
    [SUPPLIED FACT — UNRESOLVED] Pending-review processing, beneficial-owner fields
    and refresh cadence, and partner acceptance are not confirmed.


    [GENERATED ANALYSIS] Required launch conditions:

    1. Complete KYB/KYC for the business and owners, including beneficial-owner ownership/control
    data required by applicable law and partner rules.

    2. Complete sanctions screening before API credentials or transaction access,
    with ongoing rescreening and escalation.

    3. Document a method- and jurisdiction-specific risk assessment and threshold.
    Do not use one unvalidated volume number across card, ACH, local methods, or non-U.S.
    jurisdictions.

    4. Obtain written acceptance from each acquiring partner and processor. Reconcile
    partner rules with the product flow.

    5. Decide pending-review processing. Preferred path is no transactions until review
    completes. If limited processing is approved, apply strict caps, no payouts or
    refunds beyond defined controls, monitoring, auto-stop triggers, and full audit
    logging.

    6. Confirm Mosaic Relay''s MSB and state money-transmitter status, then implement
    any required AML program, reporting, retention, and independent testing.

    7. Give clear customer notices about collected data, screening, manual review,
    limits, adverse outcomes, privacy use, and appeal/contact paths.


    [ASSUMPTION] U.S.-primary scope with card, ACH, and local methods. [NOT EXAMINED]
    Partner contracts, state licensing map, and current primary-source verification
    remain open.


    [GENERATED ANALYSIS] Recommendation status: proceed only as a gated pilot after
    these conditions are evidenced; otherwise delay the holiday launch. This is a
    recommendation, not a recorded decision.'
  actor: Lawyer
  origin: lawyer_edit
  created_at: '2026-09-03T08:43:51+00:00'
recommendation_updated_at: '2026-09-03T08:43:51+00:00'
recommendation_updated_by: Lawyer
proposed_recommendation: null
---
# Working recommendation

[GENERATED ANALYSIS] Conditional proceed for the six-week launch. Mosaic Relay should not launch the lower-verification tier until it completes the controls below.

[SUPPLIED FACT — UNRESOLVED] The payment methods and jurisdictions remain undecided. [SUPPLIED FACT — UNRESOLVED] The monthly threshold has no documented risk basis. [SUPPLIED FACT — UNRESOLVED] Pending-review processing, beneficial-owner fields and refresh cadence, and partner acceptance are not confirmed.

[GENERATED ANALYSIS] Required launch conditions:
1. Complete KYB/KYC for the business and owners, including beneficial-owner ownership/control data required by applicable law and partner rules.
2. Complete sanctions screening before API credentials or transaction access, with ongoing rescreening and escalation.
3. Document a method- and jurisdiction-specific risk assessment and threshold. Do not use one unvalidated volume number across card, ACH, local methods, or non-U.S. jurisdictions.
4. Obtain written acceptance from each acquiring partner and processor. Reconcile partner rules with the product flow.
5. Decide pending-review processing. Preferred path is no transactions until review completes. If limited processing is approved, apply strict caps, no payouts or refunds beyond defined controls, monitoring, auto-stop triggers, and full audit logging.
6. Confirm Mosaic Relay's MSB and state money-transmitter status, then implement any required AML program, reporting, retention, and independent testing.
7. Give clear customer notices about collected data, screening, manual review, limits, adverse outcomes, privacy use, and appeal/contact paths.

[ASSUMPTION] U.S.-primary scope with card, ACH, and local methods. [NOT EXAMINED] Partner contracts, state licensing map, and current primary-source verification remain open.

[GENERATED ANALYSIS] Recommendation status: proceed only as a gated pilot after these conditions are evidenced; otherwise delay the holiday launch. This is a recommendation, not a recorded decision.
