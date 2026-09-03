---
work_product_id: WP-20260902-8fbfcf
matter_id: MAT-20260902-31b575
title: Juniper Ledger UX Test — 01 — Freelancer Onboarding With Variable Income response
record_type: work_product
state: final
summary: ''
created_at: '2026-09-02T06:19:02+00:00'
updated_at: '2026-09-02T06:19:02+00:00'
immutable: true
source_action_key: null
recommendation_version_id: REC-20260902-901dff
recommendation_snapshot: '# Recommendation


  ## Recommended launch posture


  Treat the product as a consumer spending account for this pilot. Do not use a “hybrid”
  label to reduce protections. If Product later offers a separate business account,
  use separate disclosures, eligibility, underwriting, and controls.


  ## Permitted sequence


  1. Show a concise privacy notice and explain the purpose of each requested field.

  2. Collect identity details, taxpayer identification number, occupation, expected
  monthly volume, funding source, and required consent.

  3. Run CIP/identity verification, sanctions screening, and device-risk checks. Route
  failed or ambiguous results to a documented manual review. Do not treat a device-risk
  score alone as a denial reason.

  4. Require the small initial deposit only with clear funding, hold, refund, and
  failure disclosures.

  5. Issue a virtual card only after Cedar Harbor has approved the program''s preliminary
  stage, CIP requirements are satisfied, sanctions screening is cleared or resolved,
  and Juniper Ledger has recorded a preliminary approval. Keep the working cap at
  $250 balance and $100/day card spend; do not enable ACH, cash withdrawal, card-to-card
  transfers, or higher limits.

  6. Send required approval, conditional-approval, or adverse-action notices. If the
  IDV provider furnishes a consumer report, include FCRA adverse-action content and
  the provider''s contact details; otherwise apply ECOA/Reg B requirements as applicable.

  7. Complete sponsor-bank review, enhanced review triggers, and full identity resolution
  before physical-card fulfillment, ACH, or higher limits. Enable ACH only after review
  approval and the confirmed limits are recorded.


  ## Classification and review triggers


  Use intended use and actual product features to classify the account. A consumer
  account should receive Reg E and other applicable consumer protections even if some
  freelancers also use it for business expenses. Require manual review for sanctions
  hits, identity mismatches, repeated failed attempts, unusual device or funding signals,
  material volume above the pilot limit, suspected account takeover, and inconsistent
  personal/business use. Do not request proof of income by default; request it only
  where risk, limits, or a documented underwriting purpose justifies it, with a clear
  explanation and retention rule.


  ## Disclosures and appeals


  Provide privacy/data-use and vendor-sharing disclosures, deposit and funds-availability
  terms, virtual-card restrictions, limits, funding-source and refund terms, and clear
  status messages. Preserve a human appeal/reconsideration path. Tell the applicant
  what failed at a useful level, what documents or corrections can resolve it, the
  review time, and how to contact support. Avoid revealing sanctions-screening logic
  or tipping off suspicious-activity monitoring.


  ## Assumptions and unverified leads


  The limits and five-year retention period are working assumptions, not approvals.
  The IDV provider''s FCRA status is unverified pending contract review. Confirm Cedar
  Harbor''s program agreement, bank review timing, card-network rules, Reg E/Reg CC
  applicability, adverse-action templates, privacy retention schedule, and vendor
  terms before launch. This recommendation is not a recorded decision.'
review:
  segments:
  - kind: equal
    text: '# Juniper Ledger Freelancer Onboarding — Legal Advice


      ## Executive summary


      For this pilot, treat the account as a consumer spending account. A freelancer''s
      mixed use does not create a safe “hybrid” category. Apply consumer protections
      and disclosures to the consumer product, and create a separate business product
      if Product wants different treatment.


      The permitted sequence is: disclose data use and account terms; collect CIP
      and onboarding information; run identity verification, sanctions screening,
      and device-risk checks; resolve exceptions; obtain and post the initial deposit
      under clear terms; issue a restricted virtual card only after Cedar Harbor approves
      the preliminary program stage and Juniper Ledger records preliminary approval;
      then complete sponsor-bank review and any enhanced review before physical-card
      fulfillment, ACH, or higher limits.


      ## Facts and material assumptions


      Known facts: the flow collects identity details, tax ID, occupation, expected
      monthly volume, and funding source. It uses automated identity verification,
      sanctions screening, device-risk signals, and a small initial deposit. A virtual
      card may be offered after preliminary approval. Physical cards, ACH, and higher
      limits remain restricted until review. Actors are Juniper Ledger, Cedar Harbor
      Bank, the verification provider, and customer support. Freelancers may have
      irregular income and mixed personal/business use. Product plans a selected-applicant
      test next quarter.


      Working assumptions: preliminary limits are $250 total balance and $100/day
      card spend, with no ACH, cash withdrawal, or card-to-card transfers. After full
      review, working limits are $5,000 balance and $2,500/day card spend, with ACH
      only after review and risk approval. Retain CIP, account-opening, transaction,
      and screening records for at least five years after closure or the applicable
      record, subject to a documented privacy schedule and deletion when no legal
      or operational need remains. These are not final approvals.


      Unverified leads: the IDV provider''s status as a consumer-reporting agency
      is not confirmed. Confirm Cedar Harbor''s program agreement, card-network rules,
      vendor terms, retention schedule, and current regulatory requirements before
      launch.


      ## Permitted onboarding sequence


      1. Show a short privacy/data-use notice. Explain why each field is needed, vendor
      sharing, retention, and the initial-deposit terms.

      2. Collect identity details, TIN, occupation, expected volume, funding source,
      and required consent. Ask for proof of income only if a documented risk or limit
      decision requires it.

      3. Perform CIP/identity verification, sanctions screening, and device-risk checks.
      Treat a device score as a review signal, not the sole denial reason. Route mismatches,
      sanctions alerts, repeated failures, unusual funding, or material volume changes
      to manual review.

      4. Take the small initial deposit only with clear hold, refund, funds-availability,
      and failure disclosures.

      5. Issue a virtual card only after (a) Cedar Harbor has approved the preliminary
      program stage, (b) CIP requirements are satisfied, (c) sanctions screening is
      cleared or resolved, and (d) Juniper Ledger has recorded preliminary approval.
      Keep the working limits and restrictions visible in-app.

      6. Send approval, conditional approval, or adverse-action notices. If the IDV
      provider furnishes a consumer report, add FCRA notice content and the provider''s
      contact details. Apply ECOA/Reg B requirements as applicable.

      7. Complete Cedar Harbor review, full identity resolution, and enhanced-review
      triggers before physical-card fulfillment, ACH, or higher limits. Enable ACH
      only after the review approval and confirmed limits are recorded.


      ## Account classification


      Use intended use, product features, and actual activity. The recommended launch
      classification is consumer. Reg E and other applicable consumer protections
      should apply. A “hybrid” label should not be used to remove protections. If
      Product later offers a business account, use separate eligibility, disclosures,
      underwriting, controls, and records.


      ## Notices, adverse action, and appeals


      Provide privacy and vendor-sharing disclosures, account and deposit terms, funds-availability
      rules, virtual-card restrictions, limits, funding/refund terms, and clear status
      messages. For a denial or adverse change, state the principal reasons and the
      applicable appeal/contact path. If a consumer report was used, include the reporting
      agency''s identity and contact information and the required dispute rights.
      If the provider is not a consumer-reporting agency, still assess ECOA/Reg B
      and other applicable notice duties. Do not disclose sanctions-monitoring logic
      or file suspicious-activity reports to the applicant.


      Offer human reconsideration. Tell the customer what failed at a useful level,
      what correction or document may resolve it, the review timeframe, and how to
      contact support. Protect against repeated automated retries and account takeover.


      ## Review triggers


      Trigger manual review for sanctions hits or close matches, unresolved identity/TIN
      mismatch, repeated failed verification, anomalous device or funding signals,
      volume or limits above the approved tier, suspected takeover, inconsistent personal/business
      use, and material changes after preliminary approval. Preserve an audit trail
      of the reason, reviewer, evidence, and disposition.


      ## Recommendation and decision status


      Recommendation: use consumer classification; restrict the virtual card to the
      preliminary tier; require Cedar Harbor approval of that tier before issuance;
      hold ACH, physical cards, and higher limits until full review; maintain notices
      and an appeal path.


      This is a working recommendation only. No durable decision is recorded. Product
      must confirm limits, classification, vendor FCRA status, bank review timing,
      retention, and final notice templates before launch.

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
final_id: FINAL-20260902-73c61a
finalized_at: '2026-09-02T06:19:08+00:00'
source_draft: 03_Matters/juniper-ledger-ux-test-01-freelancer-onboarding-with-variable-in-31b575/work-product/draft/juniper-ledger-ux-test-01-freelancer-onboarding-with-variable-in-8fbfcf.md
source_content_hash: edd513bf0dcec6b2099ef9e967873cfed48b4dbe64e108f8010c9a72093afde1
---
# Juniper Ledger Freelancer Onboarding — Legal Advice

## Executive summary

For this pilot, treat the account as a consumer spending account. A freelancer's mixed use does not create a safe “hybrid” category. Apply consumer protections and disclosures to the consumer product, and create a separate business product if Product wants different treatment.

The permitted sequence is: disclose data use and account terms; collect CIP and onboarding information; run identity verification, sanctions screening, and device-risk checks; resolve exceptions; obtain and post the initial deposit under clear terms; issue a restricted virtual card only after Cedar Harbor approves the preliminary program stage and Juniper Ledger records preliminary approval; then complete sponsor-bank review and any enhanced review before physical-card fulfillment, ACH, or higher limits.

## Facts and material assumptions

Known facts: the flow collects identity details, tax ID, occupation, expected monthly volume, and funding source. It uses automated identity verification, sanctions screening, device-risk signals, and a small initial deposit. A virtual card may be offered after preliminary approval. Physical cards, ACH, and higher limits remain restricted until review. Actors are Juniper Ledger, Cedar Harbor Bank, the verification provider, and customer support. Freelancers may have irregular income and mixed personal/business use. Product plans a selected-applicant test next quarter.

Working assumptions: preliminary limits are $250 total balance and $100/day card spend, with no ACH, cash withdrawal, or card-to-card transfers. After full review, working limits are $5,000 balance and $2,500/day card spend, with ACH only after review and risk approval. Retain CIP, account-opening, transaction, and screening records for at least five years after closure or the applicable record, subject to a documented privacy schedule and deletion when no legal or operational need remains. These are not final approvals.

Unverified leads: the IDV provider's status as a consumer-reporting agency is not confirmed. Confirm Cedar Harbor's program agreement, card-network rules, vendor terms, retention schedule, and current regulatory requirements before launch.

## Permitted onboarding sequence

1. Show a short privacy/data-use notice. Explain why each field is needed, vendor sharing, retention, and the initial-deposit terms.
2. Collect identity details, TIN, occupation, expected volume, funding source, and required consent. Ask for proof of income only if a documented risk or limit decision requires it.
3. Perform CIP/identity verification, sanctions screening, and device-risk checks. Treat a device score as a review signal, not the sole denial reason. Route mismatches, sanctions alerts, repeated failures, unusual funding, or material volume changes to manual review.
4. Take the small initial deposit only with clear hold, refund, funds-availability, and failure disclosures.
5. Issue a virtual card only after (a) Cedar Harbor has approved the preliminary program stage, (b) CIP requirements are satisfied, (c) sanctions screening is cleared or resolved, and (d) Juniper Ledger has recorded preliminary approval. Keep the working limits and restrictions visible in-app.
6. Send approval, conditional approval, or adverse-action notices. If the IDV provider furnishes a consumer report, add FCRA notice content and the provider's contact details. Apply ECOA/Reg B requirements as applicable.
7. Complete Cedar Harbor review, full identity resolution, and enhanced-review triggers before physical-card fulfillment, ACH, or higher limits. Enable ACH only after the review approval and confirmed limits are recorded.

## Account classification

Use intended use, product features, and actual activity. The recommended launch classification is consumer. Reg E and other applicable consumer protections should apply. A “hybrid” label should not be used to remove protections. If Product later offers a business account, use separate eligibility, disclosures, underwriting, controls, and records.

## Notices, adverse action, and appeals

Provide privacy and vendor-sharing disclosures, account and deposit terms, funds-availability rules, virtual-card restrictions, limits, funding/refund terms, and clear status messages. For a denial or adverse change, state the principal reasons and the applicable appeal/contact path. If a consumer report was used, include the reporting agency's identity and contact information and the required dispute rights. If the provider is not a consumer-reporting agency, still assess ECOA/Reg B and other applicable notice duties. Do not disclose sanctions-monitoring logic or file suspicious-activity reports to the applicant.

Offer human reconsideration. Tell the customer what failed at a useful level, what correction or document may resolve it, the review timeframe, and how to contact support. Protect against repeated automated retries and account takeover.

## Review triggers

Trigger manual review for sanctions hits or close matches, unresolved identity/TIN mismatch, repeated failed verification, anomalous device or funding signals, volume or limits above the approved tier, suspected takeover, inconsistent personal/business use, and material changes after preliminary approval. Preserve an audit trail of the reason, reviewer, evidence, and disposition.

## Recommendation and decision status

Recommendation: use consumer classification; restrict the virtual card to the preliminary tier; require Cedar Harbor approval of that tier before issuance; hold ACH, physical cards, and higher limits until full review; maintain notices and an appeal path.

This is a working recommendation only. No durable decision is recorded. Product must confirm limits, classification, vendor FCRA status, bank review timing, retention, and final notice templates before launch.
