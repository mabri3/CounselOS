---
work_product_id: WP-20260902-3622f1
matter_id: MAT-20260902-a27949
title: Mosaic Relay UX Test — 02 — Background Checks legal memo
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:40:18+00:00'
updated_at: '2026-09-02T14:40:18+00:00'
immutable: false
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Background Screening for Support and Payment Operations Staff


      ## Executive summary


      Mosaic Relay is a payment-infrastructure provider, not a bank. It does not provide
      accounts or hold deposits. The proposed control may be lawful if it is role-based,
      necessary, transparent, and supported by jurisdiction-specific procedures. A
      single global framework with local carve-outs is workable. A single identical
      rule set is not.


      For a first pass, use identity verification and sanctions screening for roles
      with access to payment data or payment controls when documented risk supports
      the need. Use criminal-record and employment-history checks only after a role-specific
      necessity review and only to the extent permitted by local law. Do not enable
      credit checks by default. Credit checks need a separate, documented business
      justification and may be unavailable or restricted for California and New York
      roles.


      Do not treat a vendor label of “review” as an automatic denial. Keep managers
      from seeing detailed reports. Give HR/Security a controlled review function,
      apply consistent individualized criteria, and provide a dispute path before
      final ineligibility.


      ## Scope and role matrix


      The four proposed trigger categories are: (1) view payment data, (2) change
      payout controls, (3) approve refunds, and (4) investigate disputes. The access
      decision should be tied to actual permissions, not job titles alone.


      - View payment data: identity verification and sanctions screening are the initial
      minimum; add criminal or employment-history checks only where the data sensitivity
      and role risk justify them.

      - Change payout controls: identity, sanctions, and a targeted criminal-history
      review are likely more defensible; assess whether the role has authority to
      move or redirect funds.

      - Approve refunds: identity and sanctions screening, plus a targeted criminal-history
      review where authority and fraud exposure support it.

      - Investigate disputes: identity and sanctions screening; criminal or employment-history
      checks require a documented need based on investigation powers and data access.


      Before launch, map each permission to a role, location, employing entity, and
      responsible decision maker. Rechecks every three years and after role changes
      are business preferences, not legal conclusions. Re-test necessity before each
      recheck and obtain any required fresh authorization.


      ## Lawfulness and jurisdiction


      The United States program may implicate the Fair Credit Reporting Act (FCRA)
      when a consumer reporting agency supplies a report. Use a clear, standalone
      disclosure and written authorization before obtaining a report. If a report
      may support adverse action, provide the report and applicable summary of rights
      before final action, allow a meaningful review period, then send the required
      final notice with vendor information and dispute rights. Treat state and local
      rules as additional requirements.


      California and New York require special care with criminal-history timing, individualized
      review, notice, and credit-check limits. New York City may add fair-chance requirements.
      Texas is less restrictive in some areas but still remains subject to the FCRA
      and anti-discrimination rules. Do not use a California or New York rule as proof
      that the same search is lawful everywhere; use the global baseline plus a local
      override table.


      For Ireland and the United Kingdom, criminal-record information is highly protected
      personal data. Confirm a lawful basis, the applicable employment and data-protection
      conditions, proportionality, access controls, international-transfer safeguards,
      and a documented retention schedule. Do not rely on employee consent alone without
      checking whether consent is freely given in the employment context. Complete
      a data-protection impact assessment if the scale or sensitivity requires one.


      ## Notices, authorization, and process


      The applicant or worker should receive a plain-language notice stating the purpose,
      search categories, vendor, data fields, locations, timing, retention, access
      controls, decision categories, and dispute route. Use separate authorization
      where required. Explain that access is blocked while a check is pending and
      identify who can review an exception.


      The adverse-action workflow should be: preliminary concern; secure pre-adverse
      notice and report; response and dispute window; documented individualized review;
      final decision or clearance; final notice and appeal path. Record the reason
      for the outcome without storing unnecessary report detail. Do not let a manager
      make a decision from an unredacted report.


      ## Review standards and disputes


      “Clear” means no disqualifying issue under the role matrix and jurisdiction
      rules. “Review” means a human review is required. “Ineligible” should be used
      only after the review and dispute process, with documented role-related reasons.
      Consider the nature and gravity of the conduct, time elapsed, evidence of rehabilitation,
      relevance to the role, and any legal restriction on considering the record.


      Give the person a way to identify inaccurate, incomplete, sealed, expunged,
      or mismatched information. Pause the access decision while a timely dispute
      is investigated. Obtain corrected results from the vendor where needed, notify
      the person of the outcome, and keep an audit record separate from the raw report.


      ## Privacy, security, and retention


      Send the vendor only fields needed for the selected search. Restrict raw reports
      to HR/Security/Legal reviewers with a business need. Managers should receive
      only status, decision category, and operational next steps. Encrypt data in
      transit and at rest, log access, and set deletion triggers.


      Retention is not yet decided. Set the shortest period needed for an active access
      decision, dispute, and required audit obligation. Define separate schedules
      for raw reports, decision records, and audit logs. Delete or de-identify data
      when the schedule ends, subject to a documented legal hold. Review the vendor
      contract for sub-processors, breach notice, deletion certification, cross-border
      transfers, and agency reliance.


      ## Assumptions, missing facts, and unverified leads


      Assumptions: the vendor may be a consumer reporting agency for US checks; Mosaic
      Relay may be the decision maker for at least some reports; and the proposed
      cadence is a business preference.


      Missing facts: exact roles and permissions; employing entities and work locations;
      which searches are selected; lookback periods; whether a contractor agency already
      checks workers; local notice and consent requirements; adverse-action timing;
      retention/deletion periods; and applicable regulatory or industry screening
      mandates.


      Unverified leads: FCRA standalone disclosure and adverse-action rules; California
      and New York criminal-history and credit-check limits; New York City fair-chance
      requirements; GDPR/UK GDPR and Irish conditions for criminal-record processing;
      UK transfer and employment-law requirements; and any local ordinance. Verify
      current primary authority and vendor forms before finalizing.


      ## Recommendation (not a recorded decision)


      Adopt a global framework with jurisdiction-specific carve-outs. Start with identity
      and sanctions screening for the four access categories. Add criminal-record
      and employment-history checks only through a role-based necessity matrix. Exclude
      credit checks from the default global bundle pending a separate necessity and
      local-law review. Use a centralized HR/Security review queue, no manager access
      to detailed reports, individualized review, and a documented dispute pause.
      Complete the missing-facts checklist and primary-authority verification before
      production launch.


      ## Proposed next actions


      1. Confirm the search bundle and role-permission matrix.

      2. Obtain contractor-agency screening details and decide whether Mosaic Relay
      relies on them.

      3. Draft global notice, authorization, pre-adverse, final adverse-action, and
      dispute templates.

      4. Build the local override table for California, New York, Texas, Ireland,
      and the UK.

      5. Set retention schedules and vendor data-protection terms.

      6. Pilot with a small internal role group and record exceptions.

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
# Background Screening for Support and Payment Operations Staff

## Executive summary

Mosaic Relay is a payment-infrastructure provider, not a bank. It does not provide accounts or hold deposits. The proposed control may be lawful if it is role-based, necessary, transparent, and supported by jurisdiction-specific procedures. A single global framework with local carve-outs is workable. A single identical rule set is not.

For a first pass, use identity verification and sanctions screening for roles with access to payment data or payment controls when documented risk supports the need. Use criminal-record and employment-history checks only after a role-specific necessity review and only to the extent permitted by local law. Do not enable credit checks by default. Credit checks need a separate, documented business justification and may be unavailable or restricted for California and New York roles.

Do not treat a vendor label of “review” as an automatic denial. Keep managers from seeing detailed reports. Give HR/Security a controlled review function, apply consistent individualized criteria, and provide a dispute path before final ineligibility.

## Scope and role matrix

The four proposed trigger categories are: (1) view payment data, (2) change payout controls, (3) approve refunds, and (4) investigate disputes. The access decision should be tied to actual permissions, not job titles alone.

- View payment data: identity verification and sanctions screening are the initial minimum; add criminal or employment-history checks only where the data sensitivity and role risk justify them.
- Change payout controls: identity, sanctions, and a targeted criminal-history review are likely more defensible; assess whether the role has authority to move or redirect funds.
- Approve refunds: identity and sanctions screening, plus a targeted criminal-history review where authority and fraud exposure support it.
- Investigate disputes: identity and sanctions screening; criminal or employment-history checks require a documented need based on investigation powers and data access.

Before launch, map each permission to a role, location, employing entity, and responsible decision maker. Rechecks every three years and after role changes are business preferences, not legal conclusions. Re-test necessity before each recheck and obtain any required fresh authorization.

## Lawfulness and jurisdiction

The United States program may implicate the Fair Credit Reporting Act (FCRA) when a consumer reporting agency supplies a report. Use a clear, standalone disclosure and written authorization before obtaining a report. If a report may support adverse action, provide the report and applicable summary of rights before final action, allow a meaningful review period, then send the required final notice with vendor information and dispute rights. Treat state and local rules as additional requirements.

California and New York require special care with criminal-history timing, individualized review, notice, and credit-check limits. New York City may add fair-chance requirements. Texas is less restrictive in some areas but still remains subject to the FCRA and anti-discrimination rules. Do not use a California or New York rule as proof that the same search is lawful everywhere; use the global baseline plus a local override table.

For Ireland and the United Kingdom, criminal-record information is highly protected personal data. Confirm a lawful basis, the applicable employment and data-protection conditions, proportionality, access controls, international-transfer safeguards, and a documented retention schedule. Do not rely on employee consent alone without checking whether consent is freely given in the employment context. Complete a data-protection impact assessment if the scale or sensitivity requires one.

## Notices, authorization, and process

The applicant or worker should receive a plain-language notice stating the purpose, search categories, vendor, data fields, locations, timing, retention, access controls, decision categories, and dispute route. Use separate authorization where required. Explain that access is blocked while a check is pending and identify who can review an exception.

The adverse-action workflow should be: preliminary concern; secure pre-adverse notice and report; response and dispute window; documented individualized review; final decision or clearance; final notice and appeal path. Record the reason for the outcome without storing unnecessary report detail. Do not let a manager make a decision from an unredacted report.

## Review standards and disputes

“Clear” means no disqualifying issue under the role matrix and jurisdiction rules. “Review” means a human review is required. “Ineligible” should be used only after the review and dispute process, with documented role-related reasons. Consider the nature and gravity of the conduct, time elapsed, evidence of rehabilitation, relevance to the role, and any legal restriction on considering the record.

Give the person a way to identify inaccurate, incomplete, sealed, expunged, or mismatched information. Pause the access decision while a timely dispute is investigated. Obtain corrected results from the vendor where needed, notify the person of the outcome, and keep an audit record separate from the raw report.

## Privacy, security, and retention

Send the vendor only fields needed for the selected search. Restrict raw reports to HR/Security/Legal reviewers with a business need. Managers should receive only status, decision category, and operational next steps. Encrypt data in transit and at rest, log access, and set deletion triggers.

Retention is not yet decided. Set the shortest period needed for an active access decision, dispute, and required audit obligation. Define separate schedules for raw reports, decision records, and audit logs. Delete or de-identify data when the schedule ends, subject to a documented legal hold. Review the vendor contract for sub-processors, breach notice, deletion certification, cross-border transfers, and agency reliance.

## Assumptions, missing facts, and unverified leads

Assumptions: the vendor may be a consumer reporting agency for US checks; Mosaic Relay may be the decision maker for at least some reports; and the proposed cadence is a business preference.

Missing facts: exact roles and permissions; employing entities and work locations; which searches are selected; lookback periods; whether a contractor agency already checks workers; local notice and consent requirements; adverse-action timing; retention/deletion periods; and applicable regulatory or industry screening mandates.

Unverified leads: FCRA standalone disclosure and adverse-action rules; California and New York criminal-history and credit-check limits; New York City fair-chance requirements; GDPR/UK GDPR and Irish conditions for criminal-record processing; UK transfer and employment-law requirements; and any local ordinance. Verify current primary authority and vendor forms before finalizing.

## Recommendation (not a recorded decision)

Adopt a global framework with jurisdiction-specific carve-outs. Start with identity and sanctions screening for the four access categories. Add criminal-record and employment-history checks only through a role-based necessity matrix. Exclude credit checks from the default global bundle pending a separate necessity and local-law review. Use a centralized HR/Security review queue, no manager access to detailed reports, individualized review, and a documented dispute pause. Complete the missing-facts checklist and primary-authority verification before production launch.

## Proposed next actions

1. Confirm the search bundle and role-permission matrix.
2. Obtain contractor-agency screening details and decide whether Mosaic Relay relies on them.
3. Draft global notice, authorization, pre-adverse, final adverse-action, and dispute templates.
4. Build the local override table for California, New York, Texas, Ireland, and the UK.
5. Set retention schedules and vendor data-protection terms.
6. Pilot with a small internal role group and record exceptions.
