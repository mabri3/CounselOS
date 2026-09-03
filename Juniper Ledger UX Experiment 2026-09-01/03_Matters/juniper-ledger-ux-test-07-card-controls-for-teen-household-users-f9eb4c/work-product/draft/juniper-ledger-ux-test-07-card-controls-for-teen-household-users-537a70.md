---
work_product_id: WP-20260902-537a70
matter_id: MAT-20260902-f9eb4c
title: Juniper Ledger UX Test — 07 — Card Controls for Teen Household Users response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T07:23:31+00:00'
updated_at: '2026-09-02T07:23:31+00:00'
immutable: false
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Teen household card beta — research-ready requirements


      ## Executive summary


      Juniper Ledger can test a teen-card beta if it first fixes the operating model
      and limits the beta to a clearly defined age band. The safest starting model
      is a supplementary card for an adult primary account holder, with no teen-initiated
      transfers, no credit, and no marketing use of teen data. The teen should be
      treated as a cardholder/authorized user for product and support purposes, even
      if the adult remains the bank customer. This is a recommendation for beta design,
      not a conclusion that any sponsor-bank or network rule has been confirmed.


      The beta should not launch until Product, Cedar Harbor, and the card networks
      confirm age eligibility, customer classification, KYC/CIP treatment, consent,
      disclosures, and dispute procedures.


      ## Age and consent


      - Set a single minimum age after sponsor-bank and network review. A 13+ beta
      is the simplest research boundary because COPPA applies to online services directed
      to children under 13 and to covered collection from a known child under 13.
      A 16–17-only pilot reduces minor-risk but does not remove state-law, contract-capacity,
      privacy, or network questions.

      - If under-13 users are in scope, use a COPPA-compliant verifiable parental-consent
      method before collecting personal information. Document the consenting adult''s
      identity, authority, notice version, time, scope, and withdrawal path.

      - Use an electronic cardholder/household agreement. The adult must accept funding,
      controls, dispute, and monitoring terms. Give the teen an age-appropriate explanation
      and obtain an acknowledgment where required by the selected model.

      - Do not rely on the adult''s generic account consent to cover teen data, marketing,
      or behavioral profiling. Separate operational consent from optional marketing
      and analytics choices.


      ## Account, customer, and cardholder status


      The pivotal product choice is whether the teen is a separate customer or an
      authorized user. The recommended beta model is: adult remains the primary customer
      and funding source; teen is a named supplementary cardholder with a restricted
      profile; no teen-owned deposit account; no ACH or account-to-account transfers;
      no credit.


      Even in the authorized-user model, decide whether the teen receives a login,
      whether the teen can see all or only their own transactions, whether support
      may speak with the teen, what KYC/CIP data is collected, and whether the teen
      can request closure or replacement. If the teen becomes a customer, plan for
      separate onboarding, age/identity checks, direct notices, account records, complaint
      handling, and a legally reviewed contract model.


      ## Privacy, marketing, and analytics


      - Map data flows for invitation, identity, card issuance, merchant approval,
      transaction details, refunds, support, fraud, and telemetry.

      - Provide the adult with the financial privacy notice and explain what the teen
      can see. If the teen is a customer or a known child under 13, give the teen
      and/or parent the notices required by the final model. Confirm state privacy-law
      thresholds and teen-sensitive-data rules for each beta state.

      - Treat transaction history, merchant names, categories, location, device data,
      and behavioral profiles as sensitive financial or personal information. Use
      data minimization and a short retention period.

      - Default off: personalized offers, cross-product marketing, sale/share, ad
      targeting, and behavioral profiling based on teen data. Require a separate,
      granular adult choice for any optional use, and do not make card access conditional
      on it.

      - Define deletion, correction, access, and withdrawal workflows. Propagate suppression
      to vendors, sponsor-bank systems, analytics, and support tools.


      ## Disputes, unauthorized use, and refunds


      - Assign a single intake path that the adult and teen can use, with clear escalation
      to support and the sponsor bank. Record who reported the event, when, card status,
      merchant evidence, and the decision.

      - Do not promise that the adult always bears liability. Map Regulation E, network
      rules, the account agreement, and state law to distinguish unauthorized electronic
      transfers, card transactions, merchant disputes, and the teen''s authorized
      use.

      - Set a provisional rule for testing: the adult remains responsible for funding
      and account-level obligations; Juniper Ledger and Cedar Harbor process unauthorized-use
      claims under the applicable account and network rules; neither the adult nor
      teen loses protection because the teen is a minor. Obtain sponsor-bank approval
      before launch.

      - Define merchant-error, non-receipt, duplicate, counterfeit, lost/stolen, and
      refund-not-received flows. Show refund status to the user who can act. Do not
      allow the teen to move funds out of the account.

      - Add immediate freeze/unfreeze, card replacement, spending-limit reset, merchant-approval
      revocation, and notification controls. Preserve an audit trail and a human escalation
      route.


      ## Required disclosures and controls


      Before issuance, show: who funds the card; whether the teen is a customer or
      authorized user; permitted and blocked transaction types; spending categories
      and limits; merchant-approval behavior; transaction visibility; refund handling;
      dispute and unauthorized-use steps; freeze and replacement; fees; privacy notices;
      data uses; support permissions; and how to end the feature.


      Controls should include category and amount limits, daily and periodic caps,
      merchant allow/block lists, approval-required merchants, pause/freeze, notifications,
      a clear available-balance view, and no overdraft or credit. Prevent circumvention
      through wallet tokens, recurring charges, offline/stand-in authorizations, refunds,
      tips, and split transactions where feasible. Test edge cases, including a birthday
      crossing the minimum age, parent withdrawal of consent, account closure, lost
      device, and family-member access.


      ## Decisions required before user testing


      1. Beta states and minimum age.

      2. Authorized-user versus separate-customer model.

      3. Adult authority and consent evidence.

      4. Direct teen notices and teen access rights.

      5. COPPA applicability and consent method.

      6. Financial privacy and state privacy notices.

      7. Marketing, analytics, retention, deletion, and vendor-use policy.

      8. Reg E, network, and sponsor-bank dispute allocation.

      9. Card-network and Cedar Harbor age, KYC, wallet, and physical-card rules.

      10. Funding, refunds, fees, limits, merchant approval, and blocked transfers.

      11. Support permissions, complaint escalation, and records retention.

      12. Beta success criteria, rollback triggers, and incident response.


      ## Working recommendation


      Proceed only with a 13+ (or older) authorized-user beta after Cedar Harbor and
      network approval. Make the teen a restricted supplementary cardholder, keep
      the adult as primary account holder and funder, prohibit transfers and credit,
      use verifiable parental-consent controls when required, deliver clear notices
      to both adult and teen as appropriate, and keep teen marketing/behavioral analytics
      off by default. Treat all age, consent, privacy, and dispute choices as explicit
      launch gates for user testing.

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
# Teen household card beta — research-ready requirements

## Executive summary

Juniper Ledger can test a teen-card beta if it first fixes the operating model and limits the beta to a clearly defined age band. The safest starting model is a supplementary card for an adult primary account holder, with no teen-initiated transfers, no credit, and no marketing use of teen data. The teen should be treated as a cardholder/authorized user for product and support purposes, even if the adult remains the bank customer. This is a recommendation for beta design, not a conclusion that any sponsor-bank or network rule has been confirmed.

The beta should not launch until Product, Cedar Harbor, and the card networks confirm age eligibility, customer classification, KYC/CIP treatment, consent, disclosures, and dispute procedures.

## Age and consent

- Set a single minimum age after sponsor-bank and network review. A 13+ beta is the simplest research boundary because COPPA applies to online services directed to children under 13 and to covered collection from a known child under 13. A 16–17-only pilot reduces minor-risk but does not remove state-law, contract-capacity, privacy, or network questions.
- If under-13 users are in scope, use a COPPA-compliant verifiable parental-consent method before collecting personal information. Document the consenting adult's identity, authority, notice version, time, scope, and withdrawal path.
- Use an electronic cardholder/household agreement. The adult must accept funding, controls, dispute, and monitoring terms. Give the teen an age-appropriate explanation and obtain an acknowledgment where required by the selected model.
- Do not rely on the adult's generic account consent to cover teen data, marketing, or behavioral profiling. Separate operational consent from optional marketing and analytics choices.

## Account, customer, and cardholder status

The pivotal product choice is whether the teen is a separate customer or an authorized user. The recommended beta model is: adult remains the primary customer and funding source; teen is a named supplementary cardholder with a restricted profile; no teen-owned deposit account; no ACH or account-to-account transfers; no credit.

Even in the authorized-user model, decide whether the teen receives a login, whether the teen can see all or only their own transactions, whether support may speak with the teen, what KYC/CIP data is collected, and whether the teen can request closure or replacement. If the teen becomes a customer, plan for separate onboarding, age/identity checks, direct notices, account records, complaint handling, and a legally reviewed contract model.

## Privacy, marketing, and analytics

- Map data flows for invitation, identity, card issuance, merchant approval, transaction details, refunds, support, fraud, and telemetry.
- Provide the adult with the financial privacy notice and explain what the teen can see. If the teen is a customer or a known child under 13, give the teen and/or parent the notices required by the final model. Confirm state privacy-law thresholds and teen-sensitive-data rules for each beta state.
- Treat transaction history, merchant names, categories, location, device data, and behavioral profiles as sensitive financial or personal information. Use data minimization and a short retention period.
- Default off: personalized offers, cross-product marketing, sale/share, ad targeting, and behavioral profiling based on teen data. Require a separate, granular adult choice for any optional use, and do not make card access conditional on it.
- Define deletion, correction, access, and withdrawal workflows. Propagate suppression to vendors, sponsor-bank systems, analytics, and support tools.

## Disputes, unauthorized use, and refunds

- Assign a single intake path that the adult and teen can use, with clear escalation to support and the sponsor bank. Record who reported the event, when, card status, merchant evidence, and the decision.
- Do not promise that the adult always bears liability. Map Regulation E, network rules, the account agreement, and state law to distinguish unauthorized electronic transfers, card transactions, merchant disputes, and the teen's authorized use.
- Set a provisional rule for testing: the adult remains responsible for funding and account-level obligations; Juniper Ledger and Cedar Harbor process unauthorized-use claims under the applicable account and network rules; neither the adult nor teen loses protection because the teen is a minor. Obtain sponsor-bank approval before launch.
- Define merchant-error, non-receipt, duplicate, counterfeit, lost/stolen, and refund-not-received flows. Show refund status to the user who can act. Do not allow the teen to move funds out of the account.
- Add immediate freeze/unfreeze, card replacement, spending-limit reset, merchant-approval revocation, and notification controls. Preserve an audit trail and a human escalation route.

## Required disclosures and controls

Before issuance, show: who funds the card; whether the teen is a customer or authorized user; permitted and blocked transaction types; spending categories and limits; merchant-approval behavior; transaction visibility; refund handling; dispute and unauthorized-use steps; freeze and replacement; fees; privacy notices; data uses; support permissions; and how to end the feature.

Controls should include category and amount limits, daily and periodic caps, merchant allow/block lists, approval-required merchants, pause/freeze, notifications, a clear available-balance view, and no overdraft or credit. Prevent circumvention through wallet tokens, recurring charges, offline/stand-in authorizations, refunds, tips, and split transactions where feasible. Test edge cases, including a birthday crossing the minimum age, parent withdrawal of consent, account closure, lost device, and family-member access.

## Decisions required before user testing

1. Beta states and minimum age.
2. Authorized-user versus separate-customer model.
3. Adult authority and consent evidence.
4. Direct teen notices and teen access rights.
5. COPPA applicability and consent method.
6. Financial privacy and state privacy notices.
7. Marketing, analytics, retention, deletion, and vendor-use policy.
8. Reg E, network, and sponsor-bank dispute allocation.
9. Card-network and Cedar Harbor age, KYC, wallet, and physical-card rules.
10. Funding, refunds, fees, limits, merchant approval, and blocked transfers.
11. Support permissions, complaint escalation, and records retention.
12. Beta success criteria, rollback triggers, and incident response.

## Working recommendation

Proceed only with a 13+ (or older) authorized-user beta after Cedar Harbor and network approval. Make the teen a restricted supplementary cardholder, keep the adult as primary account holder and funder, prohibit transfers and credit, use verifiable parental-consent controls when required, deliver clear notices to both adult and teen as appropriate, and keep teen marketing/behavioral analytics off by default. Treat all age, consent, privacy, and dispute choices as explicit launch gates for user testing.
