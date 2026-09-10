---
work_product_id: WP-20260903-eb78b3
matter_id: MAT-20260903-7576cf
title: Mosaic Relay UX Test — 01 — Counsel Report
record_type: work_product
state: final
summary: ''
created_at: '2026-09-03T21:54:41+00:00'
updated_at: '2026-09-03T21:54:41+00:00'
immutable: true
source_action_key: null
recommendation_version_id: REC-20260903-f53e00
recommendation_snapshot: '# Recommendation — Risk-Based Merchant Onboarding


  ## Executive recommendation

  Proceed with a controlled, jurisdiction-gated pilot for general retail and services
  sellers. Permit minutes-level limited activity only after required identity and
  sanctions checks return clear results. Keep payouts disabled until enhanced review
  is complete and the seller''s payout destination is verified. Treat this as a working
  recommendation, not a recorded decision.


  ## Required onboarding data

  Collect the seller''s legal name, trading name, formation and registration details,
  business address, operating locations, tax identification details, entity type,
  industry and goods/services, expected ticket size and volume, cross-border activity,
  ownership chart, each beneficial owner and control person, government ID and date
  of birth where required, sanctions-screening identifiers, and verified payout destination.
  Capture the marketplace relationship, seller terms acceptance, consent and notices,
  source and time of each check, result, reviewer, and reason for any override.


  ## Risk-based shortcut

  For general retail/services sellers with no red flags, allow limited card acceptance
  after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative
  cap on volume, transaction count, and duration. Do not allow payouts during the
  limited window unless the payout destination and control person checks are complete.
  Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity
  or liveness, inconsistent legal name/address/tax data, missing ownership evidence,
  an unverifiable payout destination, unexpected velocity, or manual analyst concern.
  A potential sanctions match or identity failure is a hard stop for acceptance and
  payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions,
  and abnormal patterns should require enhanced review before any activity.


  ## Beneficial-owner standard

  Use a 25% ownership threshold as the US baseline plus the control-person prong.
  Verify identity with documentary or reliable non-documentary evidence, reconcile
  ownership and control information, and record the method and result. Do not assume
  the US threshold is sufficient for UK/EU operations: map local rules, register checks,
  control definitions, and any lower or different thresholds before launch. Marketplace-led
  verification may be used only with written standards, audit rights, access to evidence,
  change notification, and Mosaic Relay oversight.


  ## Sanctions and fraud controls

  Screen the seller, beneficial owners, control persons, and payout recipient against
  applicable US, UK, EU, and partner-required lists before activation. Re-screen at
  least weekly and on material changes, list updates, ownership changes, payout changes,
  and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership,
  blocking, rescreening, and release authority. Feed fraud and transaction monitoring
  into the same hold and review workflow.


  ## Disclosures and recordkeeping

  Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay''s role,
  that it is not a bank and does not hold deposits, what data is collected and why,
  vendor involvement, screening and review timing, limited-activity limits, reasons
  for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention
  practices. Retain KYB/KYC, ownership, screening, decision, and transaction records
  for at least six years as the current cross-jurisdiction working standard, subject
  to a documented legal basis, minimization, deletion exceptions, and local requirements.


  ## Activation criteria

  Enable limited card acceptance only when seller identity, business information,
  sanctions screening, fraud controls, and required marketplace attestations are complete
  and clear. Enable full acceptance only after enhanced review closes all flags. Enable
  payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination
  verification, and any acquiring-partner conditions are satisfied. Suspend or hold
  on new sanctions alerts, identity failure, material data change, unexplained velocity,
  or adverse review.


  ## Assumptions and missing facts

  Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace;
  verify the actual contracts and operational flow. Validate country-level coverage,
  seller categories, non-US ownership thresholds, licensing status and partner allocation,
  vendor locations and transfer terms, retention/deletion rules, escalation SLAs,
  chargeback/refund handling, payout timing, and acquiring-partner requirements.


  ## Unverified leads

  The saved research is model-only and has no external authority retrieved. Treat
  references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law,
  and any CTA/BOI reporting position as leads for counsel to verify against current
  primary sources and the applicable contracts. A 50-state and country-by-country
  survey was not completed.


  ## Decision status

  Recommendation only. No durable decision recorded. Lawyer review is required before
  launch.'
review:
  segments:
  - kind: equal
    text: '# Mosaic Relay Merchant Onboarding — Counsel Report


      ## Question

      What onboarding data, risk-based shortcuts, beneficial-owner verification, sanctions
      controls, disclosures, recordkeeping, and activation criteria should Mosaic
      Relay use for a marketplace seller flow across the US, UK, and EU?


      ## Short answer

      Proceed with a controlled pilot for general retail/services sellers. Permit
      capped card acceptance only after clear automated KYB/KYC, identity, sanctions,
      and fraud checks. Complete enhanced review before full activity and before payouts.
      Treat any potential sanctions match or identity/liveness failure as a hard stop.


      ## Required data and evidence

      Collect legal and trading names; entity type and registration; business and
      operating addresses; tax identifiers; industry and goods/services; owners and
      control persons; ownership chart; government ID and date of birth where required;
      expected volumes, ticket sizes, countries, and cross-border activity; payout
      destination; marketplace terms acceptance; consents and notices; check sources,
      timestamps, results, reviewer, and overrides.


      ## Permissible shortcut

      For low-risk general retail/services sellers, allow a limited card-acceptance
      window after automated checks pass. Set conservative volume, count, and duration
      caps. Do not release payouts in the limited window unless payout destination
      and control-person checks are complete. Escalate at risk score >=70/100, a potential
      sanctions match, failed identity/liveness, inconsistent data, missing ownership
      evidence, unverifiable payout destination, unexpected velocity, or manual concern.
      High-risk categories, complex ownership, high-risk jurisdictions, or adverse
      signals require enhanced review before activity.


      ## Beneficial owners

      Use 25% ownership plus the control-person prong as the US baseline. Verify with
      documentary or reliable non-documentary evidence and retain the method and result.
      Map UK/EU local rules and register checks before launch; do not assume identical
      thresholds or timing. Marketplace-led verification needs written standards,
      audit rights, access to evidence, change notices, and oversight.


      ## Sanctions and fraud

      Screen sellers, beneficial owners, control persons, and payout recipients against
      applicable US, UK, EU, and partner-required lists before activation. Re-screen
      weekly and on material changes, list updates, ownership changes, payout changes,
      and risk events. Define fuzzy-match disposition, blocking, escalation owner,
      rescreening, release authority, and linked fraud/transaction-monitoring holds.


      ## Disclosures and records

      Provide full terms and a funds-flow notice. Explain Mosaic Relay''s role, that
      it is not a bank and does not hold deposits, the data collected, vendors, review
      timing, limits, holds, rejection reasons, payout prerequisites, support/appeal
      routes, and privacy/retention. Use six years as the working cross-jurisdiction
      retention period only after confirming local law, minimization, deletion, and
      legal-basis requirements.


      ## Activation criteria

      Limited card acceptance requires complete and clear identity, business, sanctions,
      fraud, and marketplace checks. Full acceptance requires enhanced review with
      no unresolved flags. Payouts require beneficial-owner/control verification,
      sanctions clearance, payout-destination verification, and partner requirements.
      Suspend or hold on new alerts, identity failure, material changes, unusual velocity,
      or adverse review.


      ## Assumptions, missing facts, and unverified leads

      Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace.
      Confirm country-level coverage, seller categories, non-US thresholds, licensing
      and partner allocation, vendor locations and transfers, retention/deletion rules,
      escalation SLAs, chargebacks/refunds, payout timing, and acquiring contracts.
      Saved research is model-only; no external authority was retrieved. Verify FinCEN
      CDD/BOI, UK MLR/PSC, EU AML rules, and state money-transmission positions against
      current primary sources.


      ## Recommendation and decision

      Recommendation: approve a jurisdiction-gated pilot with a stricter payout gate
      and the hard stops above. Durable decision recorded as Modified on September
      3, 2026, with revisit on December 3, 2026. Open points remain on licensing,
      non-US ownership rules, exact caps, vendor locations, and escalation SLAs.

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
final_id: FINAL-20260903-e96ee4
finalized_at: '2026-09-03T21:54:56+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-01-risk-based-merchant-onboarding-for-a-mar-7576cf/work-product/draft/mosaic-relay-ux-test-01-counsel-report-eb78b3.md
source_content_hash: 2c4ed8feb448a51a3cd8c12ecec90c145be79a13598f12b0c7e3b056ecb65f99
---
# Mosaic Relay Merchant Onboarding — Counsel Report

## Question
What onboarding data, risk-based shortcuts, beneficial-owner verification, sanctions controls, disclosures, recordkeeping, and activation criteria should Mosaic Relay use for a marketplace seller flow across the US, UK, and EU?

## Short answer
Proceed with a controlled pilot for general retail/services sellers. Permit capped card acceptance only after clear automated KYB/KYC, identity, sanctions, and fraud checks. Complete enhanced review before full activity and before payouts. Treat any potential sanctions match or identity/liveness failure as a hard stop.

## Required data and evidence
Collect legal and trading names; entity type and registration; business and operating addresses; tax identifiers; industry and goods/services; owners and control persons; ownership chart; government ID and date of birth where required; expected volumes, ticket sizes, countries, and cross-border activity; payout destination; marketplace terms acceptance; consents and notices; check sources, timestamps, results, reviewer, and overrides.

## Permissible shortcut
For low-risk general retail/services sellers, allow a limited card-acceptance window after automated checks pass. Set conservative volume, count, and duration caps. Do not release payouts in the limited window unless payout destination and control-person checks are complete. Escalate at risk score >=70/100, a potential sanctions match, failed identity/liveness, inconsistent data, missing ownership evidence, unverifiable payout destination, unexpected velocity, or manual concern. High-risk categories, complex ownership, high-risk jurisdictions, or adverse signals require enhanced review before activity.

## Beneficial owners
Use 25% ownership plus the control-person prong as the US baseline. Verify with documentary or reliable non-documentary evidence and retain the method and result. Map UK/EU local rules and register checks before launch; do not assume identical thresholds or timing. Marketplace-led verification needs written standards, audit rights, access to evidence, change notices, and oversight.

## Sanctions and fraud
Screen sellers, beneficial owners, control persons, and payout recipients against applicable US, UK, EU, and partner-required lists before activation. Re-screen weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match disposition, blocking, escalation owner, rescreening, release authority, and linked fraud/transaction-monitoring holds.

## Disclosures and records
Provide full terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, the data collected, vendors, review timing, limits, holds, rejection reasons, payout prerequisites, support/appeal routes, and privacy/retention. Use six years as the working cross-jurisdiction retention period only after confirming local law, minimization, deletion, and legal-basis requirements.

## Activation criteria
Limited card acceptance requires complete and clear identity, business, sanctions, fraud, and marketplace checks. Full acceptance requires enhanced review with no unresolved flags. Payouts require beneficial-owner/control verification, sanctions clearance, payout-destination verification, and partner requirements. Suspend or hold on new alerts, identity failure, material changes, unusual velocity, or adverse review.

## Assumptions, missing facts, and unverified leads
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace. Confirm country-level coverage, seller categories, non-US thresholds, licensing and partner allocation, vendor locations and transfers, retention/deletion rules, escalation SLAs, chargebacks/refunds, payout timing, and acquiring contracts. Saved research is model-only; no external authority was retrieved. Verify FinCEN CDD/BOI, UK MLR/PSC, EU AML rules, and state money-transmission positions against current primary sources.

## Recommendation and decision
Recommendation: approve a jurisdiction-gated pilot with a stricter payout gate and the hard stops above. Durable decision recorded as Modified on September 3, 2026, with revisit on December 3, 2026. Open points remain on licensing, non-US ownership rules, exact caps, vendor locations, and escalation SLAs.
