---
work_product_id: WP-a317538d6f9f
matter_id: MAT-20260903-6d7dcf
title: Sanctions Screening Change — Legal Analysis and Recommendation
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T18:32:26+00:00'
updated_at: '2026-09-03T18:34:08+00:00'
immutable: false
source_action_key: chat:RUN-20260903-1f0c2f:tool:11b558c8522949c2ac137069
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
    text: '# Sanctions Screening Change — Research Packet


      **Matter:** Mosaic Relay UX Test — 09 — Sanctions Screening Alert Handling

      **Purpose:** Map the change from manual to vendor-based sanctions screening
      across operational controls, sanctions compliance, privacy and cross-border
      data transfer, and recordkeeping. Compare current vs proposed controls, identify
      the exact controls legal should approve, and scope migration-readiness work
      for the two-month weekend cutover.

      **Status:** Research packet (no legal decision recorded; no external response
      sent).


      ---


      ## 1. Verified sources


      - **Company profile (SRC-COMPANY)** — Mosaic Relay is a payments-infrastructure
      provider, not a bank; coordinates regulated partners (acquiring banks, processors,
      card networks, identity/fraud vendors, sanctions-data providers). Risk posture
      prioritizes clear funds-flow boundaries, partner oversight, strong onboarding,
      sanctions and fraud controls, payout holds with documented triggers and review
      paths, reconciliation, audit trails, data minimization, access controls, security
      testing, and prompt incident handling.

      - **Original request (REQ-20260903-f9e4cf)** — Compliance wants to replace manual
      sanctions screening at onboarding and before selected payouts with a vendor
      returning potential matches and confidence signals. Product proposes auto-blocking
      exact matches, allowing low-confidence matches to proceed, and sending review
      cases to an offshore operations team. Migration planned as a weekend cutover
      in two months.

      - **Intake responses (conversation messages)** — Confirmed: hold funds on low-confidence
      matches until human review clears; global/multi-jurisdiction coverage; legal
      answer needed before launch; offshore ops team in a different region (cross-border
      data transfer); two-person (maker/checker) review decides true vs false match
      and releases held payouts; fall back to manual screening if vendor unavailable;
      daily list refresh, vendor-managed.


      ## 2. Supplied facts (confirmed)


      1. Screening applies at onboarding and before selected payouts.

      2. Vendor returns potential matches plus confidence signals.

      3. Exact matches are auto-blocked.

      4. Low-confidence matches: funds are held until a human review clears the match.

      5. Review cases route to an offshore operations team in a different region (cross-border
      data transfer).

      6. Coverage is global/multi-jurisdiction.

      7. Two-person (maker/checker) review decides true vs false match and releases
      held payouts.

      8. Fallback to manual screening if the vendor is unavailable.

      9. Vendor list refreshes daily, vendor-managed.

      10. Migration is a weekend cutover in two months; legal answer needed before
      launch.


      ## 3. Unverified leads (need confirmation)


      - **Specific offshore location** — "different region" is confirmed, but the
      specific country/region and the applicable data-transfer mechanism (e.g., adequacy
      decision, SCCs, derogation) are not. This drives the privacy analysis.

      - **Vendor identity and contract terms** — which vendor, its data-processing
      terms, sub-processors, and where it stores/processes data.

      - **Proposed matching thresholds** — the actual confidence-score cutoffs for
      auto-block vs hold vs proceed are referenced as "known" but not specified in
      the record.

      - **Vendor coverage** — which lists the vendor actually covers (OFAC, EU, UN,
      UK, etc.) vs the global/multi-jurisdiction aspiration.

      - **API response times** — referenced as known but not specified; relevant to
      the weekend cutover and fallback design.

      - **Independent verification of the daily refresh** — vendor-managed refresh
      is confirmed, but no independent verification mechanism is defined.


      ## 4. Assumptions (open)


      - Mosaic Relay is a payments-infrastructure provider, not a bank, and coordinates
      regulated partners (per company profile).

      - Sanctions screening obligations are driven by OFAC/regulatory expectations
      and partner (acquiring bank/processor) requirements.

      - Global/multi-jurisdiction coverage means the program must reconcile conflicting
      or divergent sanctions lists across jurisdictions.


      ## 5. Open questions (decision-changing)


      1. **Evidence standards** — what documentation is required for a true vs false
      match determination, and who attests to it.

      2. **Customer communications** — what notice is given for blocked vs held payouts,
      and when.

      3. **Record retention** — retention schedule for screening inputs, match results,
      review decisions, and release/block actions.

      4. **Independent list-refresh verification** — how the daily vendor-managed
      refresh is verified to support global coverage.

      5. **Escalation path** — what happens when the two-person review cannot reach
      a decision or is unavailable.

      6. **Access restrictions** — who may view sanctions review data, and least-privilege
      controls over the offshore review queue.


      ---


      ## 6. Current vs proposed controls comparison


      | Control | Current (manual) | Proposed (vendor) | Gap / risk |

      |---|---|---|---|

      | Screening trigger | Manual at onboarding and before selected payouts | Same
      events, vendor-driven | Confirm the exact event list and that "selected payouts"
      is defined |

      | Matching | Human judgment | Vendor confidence signals; auto-block exact, hold
      low-confidence | Thresholds not specified; false-positive/negative rates unknown
      |

      | Review | Manual, in-house | Offshore ops team (different region) | Cross-border
      data transfer; access controls; evidence standard |

      | Decision authority | (not defined) | Two-person maker/checker | Escalation
      path when no decision reached |

      | Funds handling | (not defined) | Hold on low-confidence until cleared | Hold
      duration, customer notice, release trigger |

      | Fallback | N/A (manual is the baseline) | Manual screening if vendor unavailable
      | Manual capacity and SLA during outage |

      | List refresh | (not defined) | Daily, vendor-managed | Independent verification
      for global coverage |

      | Records | (not defined) | (not defined) | Retention schedule and evidence
      standard missing |

      | Notices | (not defined) | (not defined) | Customer communications plan missing
      |


      ---


      ## 7. Controls legal should approve (proposed scope)


      ### Screening events

      - Onboarding (merchant, seller, contractor, beneficial owner, payer as applicable).

      - Before selected payouts (define which payouts are "selected").

      - Re-screening on list refresh or material data change (confirm whether existing
      customers are re-screened when the daily list updates).


      ### Matching rules

      - Exact match → auto-block.

      - Low-confidence match → hold funds pending two-person review.

      - High-confidence-but-not-exact → review case to offshore ops.

      - Define the confidence thresholds and the disposition for each band.


      ### Manual-review steps

      - Maker/checker two-person review for true vs false determination.

      - Documented evidence standard for each determination.

      - Escalation path when reviewers disagree or cannot decide.


      ### Access restrictions

      - Least-privilege access to sanctions review data.

      - Role-based access for the offshore review queue; no broad export.

      - Audit trail of who viewed/decided each case.


      ### Notices

      - Customer notice for blocked payouts.

      - Customer notice for held payouts (timing and content).

      - Regulatory/partner notification obligations where applicable.


      ### Record retention

      - Retention schedule for screening inputs, match results, review decisions,
      and release/block actions.

      - Evidence standard and attestation for true vs false determinations.


      ### Fallback procedures

      - Manual screening fallback when vendor unavailable (onboarding and pre-payout).

      - SLA and capacity for manual fallback.

      - Re-screening once vendor returns.


      ---


      ## 8. Migration-readiness work (two-month weekend cutover)


      1. **Define the exact screening event list** and "selected payouts" scope before
      cutover.

      2. **Set and document confidence thresholds** and disposition bands.

      3. **Finalize the offshore location** and execute the data-transfer mechanism
      (adequacy/SCCs/derogation) and vendor DPA.

      4. **Define evidence standards and retention schedule** for review decisions.

      5. **Build the customer communications plan** for blocked and held payouts.

      6. **Define the escalation path** for the two-person review.

      7. **Establish independent verification** of the daily vendor-managed list refresh.

      8. **Test the manual fallback** and confirm manual capacity during outages.

      9. **Run a pilot/parallel run** before the weekend cutover to validate thresholds
      and false-positive rates.

      10. **Confirm partner (acquiring bank/processor) requirements** are met by the
      vendor flow.


      ---


      ## 9. Research and source support


      First-pass research run is queued and will be appended when complete. This packet
      reflects the supplied facts and workspace records as of the intake close.

      '
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: insert
    text: '# '
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: 'Attorney review note: do not approve the weekend cutover until the vendor
      contract, exact thresholds, offshore transfer mechanism, evidence standard,
      retention schedule, and fallback test are complete.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: Sanctions Screening Change — Legal Analysis and Recommendation
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      Attorney review note: cutover remains conditional on final thresholds, transfer
      terms, evidence and retention controls, and tested fallback.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '


      **Matter:** Mosaic Relay UX Test — 09 — Sanctions Screening Alert Handling

      **Purpose:** Legal analysis and recommendation for replacing manual sanctions
      screening at onboarding and before selected payouts with a vendor that returns
      potential matches and confidence signals.

      **Status:** Recommendation only. No legal decision recorded, no external response
      sent, matter not closed.

      **Basis:** Grounded in the saved research packet (Sanctions Screening Change
      — Research Packet) and the confirmed facts, unverified leads, assumptions, and
      open questions recorded there.


      ---


      ## 1. Executive recommendation


      Legal should approve the vendor-based screening change **only on condition**
      that the controls below are designed, documented, and validated before the weekend
      cutover. The core proposal is sound in direction — vendor screening with confidence
      signals, auto-block of exact matches, and human review of ambiguous matches
      is consistent with Mosaic Relay''s risk posture and partner expectations. But
      three features of the proposal as currently framed create material exposure
      and must be resolved before approval:


      1. **"Allow low-confidence matches to proceed" is not acceptable as proposed.**
      The confirmed intake answer is that low-confidence matches are **held until
      human review clears** — that is the correct control and should be locked in.
      Any disposition that lets a low-confidence match proceed without review is a
      funds-flow and sanctions exposure that legal should not approve.

      2. **The offshore review team in a different region is the highest-risk dependency.**
      The specific location and the data-transfer mechanism are unverified. Approval
      must be conditioned on finalizing the location and executing the applicable
      transfer mechanism and vendor DPA before cutover.

      3. **The two-month weekend cutover is aggressive** given that evidence standards,
      customer notices, retention, escalation, and independent list verification are
      all still undefined. Legal should approve the design now but gate the cutover
      on completion of the migration-readiness checklist in Section 10.


      **Recommended posture:** Approve the change as a conditional design, with the
      controls in this document as the approval conditions. Do not approve the cutover
      date until the readiness gate is met.


      ---


      ## 2. Exact screening events


      **Confirmed:** Screening applies at onboarding and before selected payouts.


      **Recommended scope of screening events (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Onboarding** of each applicable actor: merchant, seller, contractor,
      beneficial owner, and payer, as applicable to the product flow.

      - **Before selected payouts.** "Selected payouts" must be defined as a finite,
      documented set before cutover. Legal should not approve an open-ended or undefined
      payout scope. Recommend defining the set (e.g., payouts above a threshold, payouts
      to new payees, payouts in high-risk jurisdictions) and documenting the rationale.

      - **Re-screening on list refresh or material data change.** Because the vendor
      list refreshes daily, confirm whether existing customers are re-screened when
      the list updates. Recommend re-screening existing screened parties on each daily
      refresh (or at least on material data changes) to support global coverage; otherwise
      a newly listed party could remain unscreened until the next onboarding or payout
      event.


      **Condition:** The exact event list and the definition of "selected payouts"
      must be documented and approved before cutover.


      ---


      ## 3. Matching thresholds and dispositions


      **Confirmed:** Vendor returns potential matches plus confidence signals; exact
      matches are auto-blocked; low-confidence matches are held until human review
      clears.


      **Recommended disposition bands (with assumptions where thresholds are missing):**


      | Band | Disposition | Assumption / condition |

      |---|---|---|

      | Exact match | **Auto-block** (no payout; no onboarding) | Confirmed. Block
      is irreversible absent documented review. |

      | High-confidence, not exact | **Review case** to offshore ops team | Assumed
      band exists; threshold not specified. |

      | Low-confidence | **Hold funds** pending two-person review | Confirmed. Funds
      held until maker/checker clears. |

      | No match | **Proceed** | Confirmed by implication. |


      **Assumptions (thresholds missing):** The actual confidence-score cutoffs for
      auto-block vs hold vs review vs proceed are referenced as "known" but are **not
      specified in the record**. Legal should not approve specific numeric thresholds
      without seeing them. The recommendation is:'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- The thresholds must be **documented and versioned** before cutover.

      - The disposition for each band must be **binary and deterministic** — no band
      may "proceed" without a defined review path.

      - **No low-confidence match may proceed automatically.** This is the single
      most important control. If Product''s original "allow low-confidence to proceed"
      intent resurfaces, legal should reject it.


      **Condition:** Thresholds and disposition bands must be set, documented, and
      validated in a pilot before cutover (see Section 10).


      ---


      ## 4. Maker/checker manual-review procedure and escalation


      **Confirmed:** Two-person (maker/checker) review decides true vs false match
      and releases held payouts.


      **Recommended procedure (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Maker** performs the initial review of the flagged match, gathers evidence,
      and records a preliminary determination (true match / false match / escalate).

      - **Checker** independently reviews the same case and evidence and must concur
      before a release or block is finalized. No single person may both decide and
      release a held payout.

      - **Evidence standard:** each determination must record the basis — the matched
      list entry, the matched field(s), the confidence signal, and the reason for
      the true/false conclusion. (Evidence standard is an open question; see Section
      8.)

      - **Release trigger:** a held payout is released only after the checker concurs
      and the release is logged with an audit trail.


      **Escalation path (open question — must be defined):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- If the maker and checker **disagree**, the case escalates to a defined
      senior reviewer (e.g., Compliance or a designated sanctions lead) rather than
      defaulting to either release or block.

      - If reviewers are **unavailable** (e.g., offshore team offline), the case must
      remain held — it must not auto-release. Define a maximum hold duration and a
      documented escalation for stale holds.

      - Recommend a **defined decision SLA** and a **stale-case review** so holds
      do not persist indefinitely without oversight.


      **Condition:** The escalation path and the "no auto-release on reviewer unavailability"
      rule must be documented before cutover.


      ---


      ## 5. Access restrictions and offshore transfer safeguards


      **Confirmed:** Review cases route to an offshore operations team in a different
      region (cross-border data transfer).


      **Unverified lead:** The specific offshore location and the applicable data-transfer
      mechanism (adequacy decision, standard contractual clauses, or derogation) are
      not confirmed. This is the highest-priority open item.


      **Recommended access restrictions (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Least-privilege access** to sanctions review data; role-based access
      for the offshore review queue.

      - **No broad export** of screening data; only the minimum fields needed for
      review are accessible to the offshore team.

      - **Audit trail** of who viewed and decided each case, with tamper-evident logging.

      - **Data minimization** — only the data necessary for the true/false determination
      is transferred offshore.


      **Offshore transfer safeguards (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Finalize the specific offshore location** before cutover and confirm
      whether it is an adequacy-recognized jurisdiction.

      - **Execute the applicable transfer mechanism** (adequacy reliance, SCCs, or
      documented derogation) and the **vendor DPA** with sub-processor terms before
      any data flows.

      - Confirm the **vendor''s storage/processing locations** and sub-processors;
      these are unverified and drive both the privacy and the partner-requirement
      analysis.

      - Confirm the offshore team''s access is **contractually and technically limited**
      to the review function.


      **Condition:** The offshore location, transfer mechanism, and vendor DPA must
      be finalized and documented before cutover. This is a hard gate.


      ---


      ## 6. Customer and partner notices


      **Open question (must be defined):** No customer communications plan is defined
      for blocked or held payouts.


      **Recommended notices (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Blocked payout notice:** a clear customer notice that a payout is blocked
      due to a sanctions match, with the applicable legal basis and a defined review/appeal
      path. Timing and content must be documented.

      - **Held payout notice:** a notice that a payout is temporarily held pending
      review, with an expected resolution timeframe. This is important because holds
      can persist and customers need a defined expectation.

      - **Regulatory/partner notifications:** confirm whether the acquiring bank,
      processor, or card-network rules require notification of blocked or held transactions,
      and build those into the flow.


      **Condition:** A customer communications plan for blocked and held payouts must
      be drafted and approved before cutover.


      ---


      ## 7. Records, evidence, and retention


      **Open question (must be defined):** No evidence standard or retention schedule
      is defined.


      **Recommended records and evidence (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Evidence standard:** each true/false determination must document the
      matched list entry, matched field(s), confidence signal, and the reviewer''s
      basis. This supports both internal audit and any regulator or partner inquiry.

      - **Attestation:** the maker/checker determination should be recorded with reviewer
      identity and timestamp (audit trail).


      **Recommended retention (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- Retain screening inputs, match results, review decisions, and release/block
      actions for a defined period. Recommend aligning the retention schedule with
      the applicable regulatory/partner expectations and the company''s recordkeeping
      policy.

      - Define retention for **both** blocked and released cases, and for the underlying
      evidence.

      - Confirm the retention schedule covers the offshore review records and that
      they are retrievable for audit.


      **Condition:** Evidence standard and retention schedule must be documented before
      cutover.


      ---


      ## 8. Vendor-outage fallback


      **Confirmed:** Fall back to manual screening if the vendor is unavailable.


      **Recommended fallback procedure (conditions to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- **Onboarding fallback:** if the vendor is unavailable at onboarding,
      fall back to manual screening before the party is onboarded. Do not onboard
      unscreened.

      - **Pre-payout fallback:** if the vendor is unavailable before a payout, fall
      back to manual screening. Do not release a payout unscreened.

      - **Manual capacity and SLA:** define the manual screening capacity and a response
      SLA so the fallback does not silently stall onboarding or payouts.

      - **Re-screening on vendor return:** once the vendor is available again, re-screen
      any parties screened manually during the outage so the vendor-based record is
      complete and consistent.


      **Condition:** The manual fallback procedure, capacity, and SLA must be tested
      before cutover (see Section 10).


      ---


      ## 9. Independent list-refresh verification


      **Confirmed:** Vendor list refreshes daily, vendor-managed.


      **Open question (must be defined):** No independent verification of the daily
      refresh is defined.


      **Recommended verification (condition to approve):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- Because coverage is global/multi-jurisdiction and the refresh is vendor-managed,
      legal should require **independent verification** that the vendor''s daily refresh
      is actually applied and that the covered lists match the global scope.

      - Recommend a periodic reconciliation of the vendor''s list coverage against
      the required lists (OFAC, EU, UN, UK, and any others in scope), and a documented
      check that the daily refresh is applied to screening.

      - Confirm whether the vendor''s coverage actually matches the global/multi-jurisdiction
      aspiration (unverified lead).


      **Condition:** An independent list-refresh verification mechanism must be defined
      before cutover.


      ---


      ## 10. Migration-readiness gate plan (two-month weekend cutover)


      **Confirmed:** Migration is a weekend cutover in two months; legal answer needed
      before launch.


      **Recommended posture:** Legal should approve the design now but **gate the
      cutover** on completion of the following readiness items. The two-month timeline
      is achievable only if these are completed in parallel and validated before the
      weekend.


      **Readiness gate checklist (all must be complete before cutover):**'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '1. **Define the exact screening event list** and the "selected payouts"
      scope.

      2. **Set and document confidence thresholds** and disposition bands (no low-confidence
      auto-proceed).

      3. **Finalize the offshore location** and execute the data-transfer mechanism
      (adequacy/SCCs/derogation) and vendor DPA.

      4. **Define evidence standards and retention schedule** for review decisions.

      5. **Build the customer communications plan** for blocked and held payouts.

      6. **Define the escalation path** for the two-person review, including the no-auto-release
      rule.

      7. **Establish independent verification** of the daily vendor-managed list refresh.

      8. **Test the manual fallback** and confirm manual capacity and SLA during outages.

      9. **Run a pilot/parallel run** before the weekend cutover to validate thresholds
      and false-positive rates.

      10. **Confirm partner (acquiring bank/processor) requirements** are met by the
      vendor flow.


      **Gate rule:** The weekend cutover should not proceed until items 1–10 are complete
      and documented. Items 3, 4, 5, and 9 are the highest-risk gates.


      ---


      ## 11. Confirmed facts, unverified leads, assumptions, and conditions


      ### Confirmed facts'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '1. Screening applies at onboarding and before selected payouts.

      2. Vendor returns potential matches plus confidence signals.

      3. Exact matches are auto-blocked.

      4. Low-confidence matches: funds are held until human review clears.

      5. Review cases route to an offshore operations team in a different region (cross-border
      data transfer).

      6. Coverage is global/multi-jurisdiction.

      7. Two-person (maker/checker) review decides true vs false match and releases
      held payouts.

      8. Fallback to manual screening if the vendor is unavailable.

      9. Vendor list refreshes daily, vendor-managed.

      10. Migration is a weekend cutover in two months; legal answer needed before
      launch.


      ### Unverified leads (need confirmation before cutover)'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- Specific offshore location and applicable data-transfer mechanism.

      - Vendor identity, contract terms, sub-processors, and storage/processing locations.

      - Actual confidence thresholds (referenced as "known" but not specified).

      - Vendor list coverage vs the global/multi-jurisdiction aspiration.

      - API response times (referenced as known but not specified).

      - Independent verification of the daily refresh.


      ### Assumptions (open)'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '- Mosaic Relay is a payments-infrastructure provider, not a bank, and coordinates
      regulated partners.

      - Sanctions screening obligations are driven by OFAC/regulatory expectations
      and partner (acquiring bank/processor) requirements.

      - Global/multi-jurisdiction coverage means the program must reconcile conflicting
      or divergent sanctions lists across jurisdictions.


      ### Conditions that must be met for approval'
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '1. No low-confidence match proceeds automatically; funds held until maker/checker
      clears.

      2. "Selected payouts" and the exact screening event list are defined and documented.

      3. Confidence thresholds and disposition bands are set, documented, and pilot-validated.

      4. Offshore location finalized and data-transfer mechanism + vendor DPA executed
      before cutover.

      5. Evidence standard and retention schedule documented.

      6. Customer communications plan for blocked and held payouts drafted and approved.

      7. Escalation path defined, including no-auto-release on reviewer unavailability.

      8. Independent list-refresh verification established.

      9. Manual fallback tested with defined capacity and SLA.

      10. Migration-readiness gate (Section 10) complete before the weekend cutover.


      ---


      *This is a recommendation only. No legal decision has been recorded, no external
      response has been sent, and the matter has not been closed.*

      '
    change_id: CHG-20260903-0fb107
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:34:08+00:00'
  comments: []
  version: 2
  tracking: false
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T18:34:08+00:00'
last_source_action_key: chat:RUN-20260903-353eed:tool:ebafa64b9bfc983209d05ced
---
# Attorney review note: do not approve the weekend cutover until the vendor contract, exact thresholds, offshore transfer mechanism, evidence standard, retention schedule, and fallback test are complete.Sanctions Screening Change — Legal Analysis and Recommendation

Attorney review note: cutover remains conditional on final thresholds, transfer terms, evidence and retention controls, and tested fallback.

**Matter:** Mosaic Relay UX Test — 09 — Sanctions Screening Alert Handling
**Purpose:** Legal analysis and recommendation for replacing manual sanctions screening at onboarding and before selected payouts with a vendor that returns potential matches and confidence signals.
**Status:** Recommendation only. No legal decision recorded, no external response sent, matter not closed.
**Basis:** Grounded in the saved research packet (Sanctions Screening Change — Research Packet) and the confirmed facts, unverified leads, assumptions, and open questions recorded there.

---

## 1. Executive recommendation

Legal should approve the vendor-based screening change **only on condition** that the controls below are designed, documented, and validated before the weekend cutover. The core proposal is sound in direction — vendor screening with confidence signals, auto-block of exact matches, and human review of ambiguous matches is consistent with Mosaic Relay's risk posture and partner expectations. But three features of the proposal as currently framed create material exposure and must be resolved before approval:

1. **"Allow low-confidence matches to proceed" is not acceptable as proposed.** The confirmed intake answer is that low-confidence matches are **held until human review clears** — that is the correct control and should be locked in. Any disposition that lets a low-confidence match proceed without review is a funds-flow and sanctions exposure that legal should not approve.
2. **The offshore review team in a different region is the highest-risk dependency.** The specific location and the data-transfer mechanism are unverified. Approval must be conditioned on finalizing the location and executing the applicable transfer mechanism and vendor DPA before cutover.
3. **The two-month weekend cutover is aggressive** given that evidence standards, customer notices, retention, escalation, and independent list verification are all still undefined. Legal should approve the design now but gate the cutover on completion of the migration-readiness checklist in Section 10.

**Recommended posture:** Approve the change as a conditional design, with the controls in this document as the approval conditions. Do not approve the cutover date until the readiness gate is met.

---

## 2. Exact screening events

**Confirmed:** Screening applies at onboarding and before selected payouts.

**Recommended scope of screening events (conditions to approve):**

- **Onboarding** of each applicable actor: merchant, seller, contractor, beneficial owner, and payer, as applicable to the product flow.
- **Before selected payouts.** "Selected payouts" must be defined as a finite, documented set before cutover. Legal should not approve an open-ended or undefined payout scope. Recommend defining the set (e.g., payouts above a threshold, payouts to new payees, payouts in high-risk jurisdictions) and documenting the rationale.
- **Re-screening on list refresh or material data change.** Because the vendor list refreshes daily, confirm whether existing customers are re-screened when the list updates. Recommend re-screening existing screened parties on each daily refresh (or at least on material data changes) to support global coverage; otherwise a newly listed party could remain unscreened until the next onboarding or payout event.

**Condition:** The exact event list and the definition of "selected payouts" must be documented and approved before cutover.

---

## 3. Matching thresholds and dispositions

**Confirmed:** Vendor returns potential matches plus confidence signals; exact matches are auto-blocked; low-confidence matches are held until human review clears.

**Recommended disposition bands (with assumptions where thresholds are missing):**

| Band | Disposition | Assumption / condition |
|---|---|---|
| Exact match | **Auto-block** (no payout; no onboarding) | Confirmed. Block is irreversible absent documented review. |
| High-confidence, not exact | **Review case** to offshore ops team | Assumed band exists; threshold not specified. |
| Low-confidence | **Hold funds** pending two-person review | Confirmed. Funds held until maker/checker clears. |
| No match | **Proceed** | Confirmed by implication. |

**Assumptions (thresholds missing):** The actual confidence-score cutoffs for auto-block vs hold vs review vs proceed are referenced as "known" but are **not specified in the record**. Legal should not approve specific numeric thresholds without seeing them. The recommendation is:

- The thresholds must be **documented and versioned** before cutover.
- The disposition for each band must be **binary and deterministic** — no band may "proceed" without a defined review path.
- **No low-confidence match may proceed automatically.** This is the single most important control. If Product's original "allow low-confidence to proceed" intent resurfaces, legal should reject it.

**Condition:** Thresholds and disposition bands must be set, documented, and validated in a pilot before cutover (see Section 10).

---

## 4. Maker/checker manual-review procedure and escalation

**Confirmed:** Two-person (maker/checker) review decides true vs false match and releases held payouts.

**Recommended procedure (conditions to approve):**

- **Maker** performs the initial review of the flagged match, gathers evidence, and records a preliminary determination (true match / false match / escalate).
- **Checker** independently reviews the same case and evidence and must concur before a release or block is finalized. No single person may both decide and release a held payout.
- **Evidence standard:** each determination must record the basis — the matched list entry, the matched field(s), the confidence signal, and the reason for the true/false conclusion. (Evidence standard is an open question; see Section 8.)
- **Release trigger:** a held payout is released only after the checker concurs and the release is logged with an audit trail.

**Escalation path (open question — must be defined):**

- If the maker and checker **disagree**, the case escalates to a defined senior reviewer (e.g., Compliance or a designated sanctions lead) rather than defaulting to either release or block.
- If reviewers are **unavailable** (e.g., offshore team offline), the case must remain held — it must not auto-release. Define a maximum hold duration and a documented escalation for stale holds.
- Recommend a **defined decision SLA** and a **stale-case review** so holds do not persist indefinitely without oversight.

**Condition:** The escalation path and the "no auto-release on reviewer unavailability" rule must be documented before cutover.

---

## 5. Access restrictions and offshore transfer safeguards

**Confirmed:** Review cases route to an offshore operations team in a different region (cross-border data transfer).

**Unverified lead:** The specific offshore location and the applicable data-transfer mechanism (adequacy decision, standard contractual clauses, or derogation) are not confirmed. This is the highest-priority open item.

**Recommended access restrictions (conditions to approve):**

- **Least-privilege access** to sanctions review data; role-based access for the offshore review queue.
- **No broad export** of screening data; only the minimum fields needed for review are accessible to the offshore team.
- **Audit trail** of who viewed and decided each case, with tamper-evident logging.
- **Data minimization** — only the data necessary for the true/false determination is transferred offshore.

**Offshore transfer safeguards (conditions to approve):**

- **Finalize the specific offshore location** before cutover and confirm whether it is an adequacy-recognized jurisdiction.
- **Execute the applicable transfer mechanism** (adequacy reliance, SCCs, or documented derogation) and the **vendor DPA** with sub-processor terms before any data flows.
- Confirm the **vendor's storage/processing locations** and sub-processors; these are unverified and drive both the privacy and the partner-requirement analysis.
- Confirm the offshore team's access is **contractually and technically limited** to the review function.

**Condition:** The offshore location, transfer mechanism, and vendor DPA must be finalized and documented before cutover. This is a hard gate.

---

## 6. Customer and partner notices

**Open question (must be defined):** No customer communications plan is defined for blocked or held payouts.

**Recommended notices (conditions to approve):**

- **Blocked payout notice:** a clear customer notice that a payout is blocked due to a sanctions match, with the applicable legal basis and a defined review/appeal path. Timing and content must be documented.
- **Held payout notice:** a notice that a payout is temporarily held pending review, with an expected resolution timeframe. This is important because holds can persist and customers need a defined expectation.
- **Regulatory/partner notifications:** confirm whether the acquiring bank, processor, or card-network rules require notification of blocked or held transactions, and build those into the flow.

**Condition:** A customer communications plan for blocked and held payouts must be drafted and approved before cutover.

---

## 7. Records, evidence, and retention

**Open question (must be defined):** No evidence standard or retention schedule is defined.

**Recommended records and evidence (conditions to approve):**

- **Evidence standard:** each true/false determination must document the matched list entry, matched field(s), confidence signal, and the reviewer's basis. This supports both internal audit and any regulator or partner inquiry.
- **Attestation:** the maker/checker determination should be recorded with reviewer identity and timestamp (audit trail).

**Recommended retention (conditions to approve):**

- Retain screening inputs, match results, review decisions, and release/block actions for a defined period. Recommend aligning the retention schedule with the applicable regulatory/partner expectations and the company's recordkeeping policy.
- Define retention for **both** blocked and released cases, and for the underlying evidence.
- Confirm the retention schedule covers the offshore review records and that they are retrievable for audit.

**Condition:** Evidence standard and retention schedule must be documented before cutover.

---

## 8. Vendor-outage fallback

**Confirmed:** Fall back to manual screening if the vendor is unavailable.

**Recommended fallback procedure (conditions to approve):**

- **Onboarding fallback:** if the vendor is unavailable at onboarding, fall back to manual screening before the party is onboarded. Do not onboard unscreened.
- **Pre-payout fallback:** if the vendor is unavailable before a payout, fall back to manual screening. Do not release a payout unscreened.
- **Manual capacity and SLA:** define the manual screening capacity and a response SLA so the fallback does not silently stall onboarding or payouts.
- **Re-screening on vendor return:** once the vendor is available again, re-screen any parties screened manually during the outage so the vendor-based record is complete and consistent.

**Condition:** The manual fallback procedure, capacity, and SLA must be tested before cutover (see Section 10).

---

## 9. Independent list-refresh verification

**Confirmed:** Vendor list refreshes daily, vendor-managed.

**Open question (must be defined):** No independent verification of the daily refresh is defined.

**Recommended verification (condition to approve):**

- Because coverage is global/multi-jurisdiction and the refresh is vendor-managed, legal should require **independent verification** that the vendor's daily refresh is actually applied and that the covered lists match the global scope.
- Recommend a periodic reconciliation of the vendor's list coverage against the required lists (OFAC, EU, UN, UK, and any others in scope), and a documented check that the daily refresh is applied to screening.
- Confirm whether the vendor's coverage actually matches the global/multi-jurisdiction aspiration (unverified lead).

**Condition:** An independent list-refresh verification mechanism must be defined before cutover.

---

## 10. Migration-readiness gate plan (two-month weekend cutover)

**Confirmed:** Migration is a weekend cutover in two months; legal answer needed before launch.

**Recommended posture:** Legal should approve the design now but **gate the cutover** on completion of the following readiness items. The two-month timeline is achievable only if these are completed in parallel and validated before the weekend.

**Readiness gate checklist (all must be complete before cutover):**

1. **Define the exact screening event list** and the "selected payouts" scope.
2. **Set and document confidence thresholds** and disposition bands (no low-confidence auto-proceed).
3. **Finalize the offshore location** and execute the data-transfer mechanism (adequacy/SCCs/derogation) and vendor DPA.
4. **Define evidence standards and retention schedule** for review decisions.
5. **Build the customer communications plan** for blocked and held payouts.
6. **Define the escalation path** for the two-person review, including the no-auto-release rule.
7. **Establish independent verification** of the daily vendor-managed list refresh.
8. **Test the manual fallback** and confirm manual capacity and SLA during outages.
9. **Run a pilot/parallel run** before the weekend cutover to validate thresholds and false-positive rates.
10. **Confirm partner (acquiring bank/processor) requirements** are met by the vendor flow.

**Gate rule:** The weekend cutover should not proceed until items 1–10 are complete and documented. Items 3, 4, 5, and 9 are the highest-risk gates.

---

## 11. Confirmed facts, unverified leads, assumptions, and conditions

### Confirmed facts

1. Screening applies at onboarding and before selected payouts.
2. Vendor returns potential matches plus confidence signals.
3. Exact matches are auto-blocked.
4. Low-confidence matches: funds are held until human review clears.
5. Review cases route to an offshore operations team in a different region (cross-border data transfer).
6. Coverage is global/multi-jurisdiction.
7. Two-person (maker/checker) review decides true vs false match and releases held payouts.
8. Fallback to manual screening if the vendor is unavailable.
9. Vendor list refreshes daily, vendor-managed.
10. Migration is a weekend cutover in two months; legal answer needed before launch.

### Unverified leads (need confirmation before cutover)

- Specific offshore location and applicable data-transfer mechanism.
- Vendor identity, contract terms, sub-processors, and storage/processing locations.
- Actual confidence thresholds (referenced as "known" but not specified).
- Vendor list coverage vs the global/multi-jurisdiction aspiration.
- API response times (referenced as known but not specified).
- Independent verification of the daily refresh.

### Assumptions (open)

- Mosaic Relay is a payments-infrastructure provider, not a bank, and coordinates regulated partners.
- Sanctions screening obligations are driven by OFAC/regulatory expectations and partner (acquiring bank/processor) requirements.
- Global/multi-jurisdiction coverage means the program must reconcile conflicting or divergent sanctions lists across jurisdictions.

### Conditions that must be met for approval

1. No low-confidence match proceeds automatically; funds held until maker/checker clears.
2. "Selected payouts" and the exact screening event list are defined and documented.
3. Confidence thresholds and disposition bands are set, documented, and pilot-validated.
4. Offshore location finalized and data-transfer mechanism + vendor DPA executed before cutover.
5. Evidence standard and retention schedule documented.
6. Customer communications plan for blocked and held payouts drafted and approved.
7. Escalation path defined, including no-auto-release on reviewer unavailability.
8. Independent list-refresh verification established.
9. Manual fallback tested with defined capacity and SLA.
10. Migration-readiness gate (Section 10) complete before the weekend cutover.

---

*This is a recommendation only. No legal decision has been recorded, no external response has been sent, and the matter has not been closed.*
