---
work_product_id: WP-20260902-51cf57
matter_id: MAT-20260902-5a485e
title: Juniper Ledger UX Test — 02 — Business Account Background Checks for Beneficial
  Owners response
record_type: work_product
state: final
summary: ''
created_at: '2026-09-02T06:28:52+00:00'
updated_at: '2026-09-02T06:28:52+00:00'
immutable: true
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Juniper Ledger automated business-account screening


      ## Executive answer


      Proceed only with a controlled pilot after the data map, vendor contract, notices,
      and sponsor-bank approval are complete. Use identity/KYB and sanctions screening
      for all required owners, controllers, and authorized users. Do not auto-deny
      on criminal or civil records. Route adverse or ambiguous results to trained
      compliance staff and to Cedar Harbor Bank, N.A. when its program agreement or
      law requires.


      ## Legally acceptable checks and sources


      - Collect only the beneficial-owner and control information needed for CIP/KYB,
      sanctions/AML, fraud prevention, and account servicing. Apply the stated 25%
      ownership threshold, plus control-person information where required.

      - Use authoritative identity, EIN/address, sanctions, and PEP sources with documented
      provenance, update frequency, matching logic, and false-positive handling. PEP
      status is a risk signal, not proof of wrongdoing or an automatic denial.

      - Treat criminal, civil, and other public-record data as sensitive, purpose-limited
      risk information. Do not use it for automatic exclusion. Exclude consumer credit
      unless Product proves a lawful permissible purpose, obtains any required authorization,
      confirms the vendor''s FCRA role, and completes a separate fair-lending review.

      - Confirm whether the screening vendor is a consumer-reporting agency and whether
      its reports are consumer reports. This is an unverified lead pending the vendor
      contract. If yes, use a permissible purpose, obtain required disclosures/authorization
      where applicable, provide pre-adverse and adverse-action notices, identify the
      vendor, and provide the required dispute route.

      - Document a source inventory and retention/deletion schedule for applicant
      and non-applicant owner data. Limit vendor and sponsor-bank access by role and
      contract.


      ## Notices and dispute rights


      Give clear, layered notices before collection. State the purposes, categories
      of data, sources or source types, recipients (including the sponsor bank and
      vendor), retention, automated risk scoring, human review, and how an owner can
      correct information. Give non-applicant owners a practical notice path even
      though they are not the applicant.


      Before a denial based in whole or part on a consumer report, send a pre-adverse-action
      notice with the report or required summary and a reasonable opportunity to dispute.
      After the decision, send an adverse-action notice with specific principal reasons,
      the CRA''s identity and contact information, and the dispute/free-report rights
      required by the FCRA. Provide an accessible owner challenge channel for mismatches,
      with a hold on denial while a timely dispute is investigated.


      For business-account denials, confirm the account''s coverage and the decision-maker''s
      duties under ECOA/Regulation B with counsel and Cedar Harbor. Use a plain, specific
      denial reason. Never state that a person is “high risk” without the underlying
      reasons and review record.


      ## Human and sponsor-bank decisions


      The risk engine may prioritize and recommend. It must not make the final decision
      on criminal/civil records, material discrepancies, sanctions/PEP possible matches,
      or an adverse account outcome. A trained compliance reviewer must document the
      evidence, resolution, reason codes, and escalation.


      Cedar Harbor must approve the program design, risk appetite, escalation rules,
      vendor oversight, and any account denial or restriction that the program agreement
      reserves to the bank. Juniper Ledger should not represent that it alone made
      a bank decision. Preserve an auditable decision record that separates the system
      recommendation from the human and bank decision.


      ## Pre-launch controls


      1. Complete the vendor contract and FCRA classification; require accuracy, source,
      update, audit, security, deletion, incident, subcontractor, and dispute-support
      terms.

      2. Complete a data protection impact assessment and a state-law review for criminal-record
      use, privacy, biometric/identity data, and non-applicant notices.

      3. Approve a written data-source matrix, matching thresholds, manual-review
      playbook, sanctions escalation, and exception policy.

      4. Test false positives, disparate impact, accessibility, language, and correction/dispute
      turnaround with representative synthetic cases.

      5. Implement role-based access, encryption, immutable audit logs, retention
      timers, deletion workflows, vendor monitoring, and incident response.

      6. Obtain compliance, privacy, product, and Cedar Harbor sign-off. Launch first
      with a limited pilot, kill switch, daily exception review, and post-launch monitoring.


      ## Assumptions and missing facts


      Assumptions: Cedar Harbor Bank, N.A. is the sponsor bank; the 25% threshold
      is intended to apply; the product serves U.S. small businesses; and the stated
      vendor is the source of screening data.


      Missing facts: vendor contract and CRA status; exact jurisdictions; account
      coverage under ECOA/Reg B; precise public-record sources; whether biometrics
      or SSNs are stored; denial reason codes; sponsor-bank allocation of decision
      authority; retention basis; and the process for notifying non-applicant owners.
      These facts can change the notice and data-source conclusion. Research fetch
      failed in this run, so all legal leads above are unverified and require confirmation
      before launch.


      ## Recommendation


      Do not launch the minutes-to-account flow on the current record. Approve a gated
      pilot only after the controls above are evidenced, the vendor classification
      is resolved, and Cedar Harbor signs off. The recommended product rule is: identity/KYB
      and sanctions/PEP checks may support straight-through low-risk approval when
      matches are clear; every adverse, uncertain, criminal, or civil result pauses
      issuance for human review; and every denial has a documented, reviewable reason
      and an appropriate notice/dispute path.

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
final_id: FINAL-20260902-6b3da6
finalized_at: '2026-09-02T06:29:26+00:00'
source_draft: 03_Matters/juniper-ledger-ux-test-02-business-account-background-checks-for-5a485e/work-product/draft/juniper-ledger-ux-test-02-business-account-background-checks-for-51cf57.md
source_content_hash: e4bed800d75a1b29ad70e1196a2d77c0082f860a844aada38c1d78954f9d90bc
---
# Juniper Ledger automated business-account screening

## Executive answer

Proceed only with a controlled pilot after the data map, vendor contract, notices, and sponsor-bank approval are complete. Use identity/KYB and sanctions screening for all required owners, controllers, and authorized users. Do not auto-deny on criminal or civil records. Route adverse or ambiguous results to trained compliance staff and to Cedar Harbor Bank, N.A. when its program agreement or law requires.

## Legally acceptable checks and sources

- Collect only the beneficial-owner and control information needed for CIP/KYB, sanctions/AML, fraud prevention, and account servicing. Apply the stated 25% ownership threshold, plus control-person information where required.
- Use authoritative identity, EIN/address, sanctions, and PEP sources with documented provenance, update frequency, matching logic, and false-positive handling. PEP status is a risk signal, not proof of wrongdoing or an automatic denial.
- Treat criminal, civil, and other public-record data as sensitive, purpose-limited risk information. Do not use it for automatic exclusion. Exclude consumer credit unless Product proves a lawful permissible purpose, obtains any required authorization, confirms the vendor's FCRA role, and completes a separate fair-lending review.
- Confirm whether the screening vendor is a consumer-reporting agency and whether its reports are consumer reports. This is an unverified lead pending the vendor contract. If yes, use a permissible purpose, obtain required disclosures/authorization where applicable, provide pre-adverse and adverse-action notices, identify the vendor, and provide the required dispute route.
- Document a source inventory and retention/deletion schedule for applicant and non-applicant owner data. Limit vendor and sponsor-bank access by role and contract.

## Notices and dispute rights

Give clear, layered notices before collection. State the purposes, categories of data, sources or source types, recipients (including the sponsor bank and vendor), retention, automated risk scoring, human review, and how an owner can correct information. Give non-applicant owners a practical notice path even though they are not the applicant.

Before a denial based in whole or part on a consumer report, send a pre-adverse-action notice with the report or required summary and a reasonable opportunity to dispute. After the decision, send an adverse-action notice with specific principal reasons, the CRA's identity and contact information, and the dispute/free-report rights required by the FCRA. Provide an accessible owner challenge channel for mismatches, with a hold on denial while a timely dispute is investigated.

For business-account denials, confirm the account's coverage and the decision-maker's duties under ECOA/Regulation B with counsel and Cedar Harbor. Use a plain, specific denial reason. Never state that a person is “high risk” without the underlying reasons and review record.

## Human and sponsor-bank decisions

The risk engine may prioritize and recommend. It must not make the final decision on criminal/civil records, material discrepancies, sanctions/PEP possible matches, or an adverse account outcome. A trained compliance reviewer must document the evidence, resolution, reason codes, and escalation.

Cedar Harbor must approve the program design, risk appetite, escalation rules, vendor oversight, and any account denial or restriction that the program agreement reserves to the bank. Juniper Ledger should not represent that it alone made a bank decision. Preserve an auditable decision record that separates the system recommendation from the human and bank decision.

## Pre-launch controls

1. Complete the vendor contract and FCRA classification; require accuracy, source, update, audit, security, deletion, incident, subcontractor, and dispute-support terms.
2. Complete a data protection impact assessment and a state-law review for criminal-record use, privacy, biometric/identity data, and non-applicant notices.
3. Approve a written data-source matrix, matching thresholds, manual-review playbook, sanctions escalation, and exception policy.
4. Test false positives, disparate impact, accessibility, language, and correction/dispute turnaround with representative synthetic cases.
5. Implement role-based access, encryption, immutable audit logs, retention timers, deletion workflows, vendor monitoring, and incident response.
6. Obtain compliance, privacy, product, and Cedar Harbor sign-off. Launch first with a limited pilot, kill switch, daily exception review, and post-launch monitoring.

## Assumptions and missing facts

Assumptions: Cedar Harbor Bank, N.A. is the sponsor bank; the 25% threshold is intended to apply; the product serves U.S. small businesses; and the stated vendor is the source of screening data.

Missing facts: vendor contract and CRA status; exact jurisdictions; account coverage under ECOA/Reg B; precise public-record sources; whether biometrics or SSNs are stored; denial reason codes; sponsor-bank allocation of decision authority; retention basis; and the process for notifying non-applicant owners. These facts can change the notice and data-source conclusion. Research fetch failed in this run, so all legal leads above are unverified and require confirmation before launch.

## Recommendation

Do not launch the minutes-to-account flow on the current record. Approve a gated pilot only after the controls above are evidenced, the vendor classification is resolved, and Cedar Harbor signs off. The recommended product rule is: identity/KYB and sanctions/PEP checks may support straight-through low-risk approval when matches are clear; every adverse, uncertain, criminal, or civil result pauses issuance for human review; and every denial has a documented, reviewable reason and an appropriate notice/dispute path.
