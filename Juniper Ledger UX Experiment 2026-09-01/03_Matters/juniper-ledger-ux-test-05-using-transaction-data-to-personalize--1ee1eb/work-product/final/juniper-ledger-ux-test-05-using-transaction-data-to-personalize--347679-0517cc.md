---
work_product_id: WP-20260902-347679
matter_id: MAT-20260902-1ee1eb
title: Juniper Ledger UX Test — 05 — Using Transaction Data to Personalize Offers
  — Legal Advice Draft
record_type: work_product
state: final
summary: ''
created_at: '2026-09-02T07:03:23+00:00'
updated_at: '2026-09-02T07:03:23+00:00'
immutable: true
source_action_key: null
recommendation_version_id: REC-20260902-be5705
recommendation_snapshot: '# Recommendation


  Proceed only with an opt-in, off-by-default launch. Use derived, non-sensitive segments;
  exclude health, religion, political activity, and other sensitive categories; do
  not share identifiable segments with offer providers; set a disclosed 12–24 month
  profile limit with automatic deletion; and obtain sponsor-bank and card-network
  approval. Require a clear consent flow, layered privacy notice, persistent cross-channel
  opt-out, and access/deletion controls before launch. Treat default-on personalization
  as not recommended. This is a preliminary recommendation based on reported facts
  and assumptions; the five design decisions remain open and no durable decision is
  recorded.'
review:
  segments:
  - kind: equal
    text: '# Personalized Offers Using Transaction Data — Preliminary Legal Advice


      ## 1. Scope and assumptions

      [SUPPLIED FACT] Juniper Ledger wants to analyze purchase categories, recurring
      payments, account balances, and payment behavior to show offers in-app and by
      email. Personalization is proposed on by default with a settings opt-out. Juniper
      Ledger owns the product and marketing experience; Cedar Harbor sponsor bank
      provides oversight; launch is planned for next quarter.

      [ASSUMPTION] U.S. state comprehensive privacy laws apply. Treat account-linked
      transaction data and derived profiles as personal information. Confirm the sponsor-bank
      program agreement, card-network rules, applicable state coverage, and whether
      business-account users have different protections.

      [OPEN FACTS] Sensitive-category use, raw-description use, provider sharing,
      profile duration, business-user treatment, and final consent/notice/opt-out/deletion
      language are not decided.


      ## 2. Lawful basis and notice

      [GENERATED ANALYSIS] For ordinary personalization, document a specified marketing
      purpose and a lawful basis under each applicable state framework. Do not rely
      on a vague service-improvement statement. Give just-in-time, plain-language
      notice before collection/use that states the data elements (including categories,
      recurring payments, balances, and payment behavior), purposes, in-app and email
      channels, profile logic at a useful level, sharing recipients, retention period,
      rights, and how to withdraw permission. Coordinate the notice with the sponsor
      bank and any financial-privacy notice duties.


      ## 3. Sensitive-data restrictions

      [GENERATED ANALYSIS] Exclude health, religion, political activity, and other
      sensitive inferences from targeting by default. Do not use raw transaction descriptions
      unless a documented necessity review shows that derived, minimized fields cannot
      meet the purpose. If any sensitive data will be used, gate that use behind separate,
      specific affirmative opt-in consent, with no pre-checked control, and honor
      withdrawal immediately. Add technical classification and suppression rules,
      human review of category mappings, and an audit trail.


      ## 4. Sharing and retention

      [GENERATED ANALYSIS] Do not share identifiable transactions or identifiable
      segments with offer providers for the first release. If a provider is needed,
      share the minimum aggregate or de-identified signal only after re-identification
      and onward-use testing, contract limits, security terms, deletion duties, and
      provider-level opt-out propagation. Define a short, purpose-based profile lifetime
      (recommended 12 months, maximum 24 months pending review), disclose it, delete
      or de-identify on opt-out, deletion request, and account closure, and run an
      auditable deletion job.


      ## 5. Default settings

      [GENERATED ANALYSIS] Default-on personalization is not recommended for this
      financial transaction use. Use a separate, informed opt-in that is off by default
      for all customers. Do not condition core account services on consent. If product
      insists on default-on for non-sensitive segments, obtain jurisdiction-by-jurisdiction
      review, prominent notice, easy one-step opt-out, and sponsor-bank approval;
      sensitive uses still require opt-in.


      ## 6. Required controls before launch

      1. Separate consent control: off by default, affirmative, purpose-specific,
      versioned, and withdrawable.

      2. Privacy notice: layered, channel-specific, and complete on data categories,
      profiling, sharing, retention, rights, and contact path.

      3. Persistent settings: one-step personalized-offers toggle, separate email
      toggle, status confirmation, and suppression across all channels.

      4. Access/deletion: self-service request for the profile and source data, identity
      verification, status tracking, statutory response workflow, and deletion propagation
      to vendors.

      5. Sensitive-data guardrail: block prohibited categories and raw descriptions
      from feature and model inputs; log exceptions.

      6. Data minimization: category-only fields, no balances or payment behavior
      unless necessary and disclosed.

      7. Retention automation: disclosed expiry, deletion/de-identification, failure
      alerts, and audit logs.

      8. Provider governance: inventory, contract restrictions, no sale/secondary
      use, security, incident notice, and deletion certification.

      9. Sponsor-bank/card-network gate: written approval and documented allocation
      of Juniper Ledger and Cedar Harbor duties.

      10. Launch evidence: DPIA/privacy review, test cases for opt-out/deletion/suppression,
      and counsel sign-off on final copy.


      ## 7. Recommendation (not a decision)

      Proceed only with an opt-in, off-by-default launch using derived, non-sensitive
      segments, no third-party sharing of identifiable data, a 12-month profile limit
      with automatic deletion, and sensitive categories excluded. Ship all controls
      above and obtain sponsor-bank/card-network approval before launch. Treat default-on
      personalization, raw descriptions, sensitive targeting, and identifiable provider
      sharing as out of scope until separately approved.


      ## 8. Open decisions and research status

      Resolve five design decisions: sensitive-category targeting; raw vs. derived
      data; provider sharing and detail; retention duration; business-account treatment.
      Research was attempted in the visible app but returned “Failed to fetch,” so
      no source-backed research packet is saved. This draft is generated analysis
      based on the supplied facts and stated assumptions. No durable decision is recorded.

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
final_id: FINAL-20260902-0517cc
finalized_at: '2026-09-02T07:03:34+00:00'
source_draft: 03_Matters/juniper-ledger-ux-test-05-using-transaction-data-to-personalize--1ee1eb/work-product/draft/juniper-ledger-ux-test-05-using-transaction-data-to-personalize--347679.md
source_content_hash: 5bd1f09219eb4b43c890ad00d98eba9c88afcab2068ed1affbde9af41e072f68
---
# Personalized Offers Using Transaction Data — Preliminary Legal Advice

## 1. Scope and assumptions
[SUPPLIED FACT] Juniper Ledger wants to analyze purchase categories, recurring payments, account balances, and payment behavior to show offers in-app and by email. Personalization is proposed on by default with a settings opt-out. Juniper Ledger owns the product and marketing experience; Cedar Harbor sponsor bank provides oversight; launch is planned for next quarter.
[ASSUMPTION] U.S. state comprehensive privacy laws apply. Treat account-linked transaction data and derived profiles as personal information. Confirm the sponsor-bank program agreement, card-network rules, applicable state coverage, and whether business-account users have different protections.
[OPEN FACTS] Sensitive-category use, raw-description use, provider sharing, profile duration, business-user treatment, and final consent/notice/opt-out/deletion language are not decided.

## 2. Lawful basis and notice
[GENERATED ANALYSIS] For ordinary personalization, document a specified marketing purpose and a lawful basis under each applicable state framework. Do not rely on a vague service-improvement statement. Give just-in-time, plain-language notice before collection/use that states the data elements (including categories, recurring payments, balances, and payment behavior), purposes, in-app and email channels, profile logic at a useful level, sharing recipients, retention period, rights, and how to withdraw permission. Coordinate the notice with the sponsor bank and any financial-privacy notice duties.

## 3. Sensitive-data restrictions
[GENERATED ANALYSIS] Exclude health, religion, political activity, and other sensitive inferences from targeting by default. Do not use raw transaction descriptions unless a documented necessity review shows that derived, minimized fields cannot meet the purpose. If any sensitive data will be used, gate that use behind separate, specific affirmative opt-in consent, with no pre-checked control, and honor withdrawal immediately. Add technical classification and suppression rules, human review of category mappings, and an audit trail.

## 4. Sharing and retention
[GENERATED ANALYSIS] Do not share identifiable transactions or identifiable segments with offer providers for the first release. If a provider is needed, share the minimum aggregate or de-identified signal only after re-identification and onward-use testing, contract limits, security terms, deletion duties, and provider-level opt-out propagation. Define a short, purpose-based profile lifetime (recommended 12 months, maximum 24 months pending review), disclose it, delete or de-identify on opt-out, deletion request, and account closure, and run an auditable deletion job.

## 5. Default settings
[GENERATED ANALYSIS] Default-on personalization is not recommended for this financial transaction use. Use a separate, informed opt-in that is off by default for all customers. Do not condition core account services on consent. If product insists on default-on for non-sensitive segments, obtain jurisdiction-by-jurisdiction review, prominent notice, easy one-step opt-out, and sponsor-bank approval; sensitive uses still require opt-in.

## 6. Required controls before launch
1. Separate consent control: off by default, affirmative, purpose-specific, versioned, and withdrawable.
2. Privacy notice: layered, channel-specific, and complete on data categories, profiling, sharing, retention, rights, and contact path.
3. Persistent settings: one-step personalized-offers toggle, separate email toggle, status confirmation, and suppression across all channels.
4. Access/deletion: self-service request for the profile and source data, identity verification, status tracking, statutory response workflow, and deletion propagation to vendors.
5. Sensitive-data guardrail: block prohibited categories and raw descriptions from feature and model inputs; log exceptions.
6. Data minimization: category-only fields, no balances or payment behavior unless necessary and disclosed.
7. Retention automation: disclosed expiry, deletion/de-identification, failure alerts, and audit logs.
8. Provider governance: inventory, contract restrictions, no sale/secondary use, security, incident notice, and deletion certification.
9. Sponsor-bank/card-network gate: written approval and documented allocation of Juniper Ledger and Cedar Harbor duties.
10. Launch evidence: DPIA/privacy review, test cases for opt-out/deletion/suppression, and counsel sign-off on final copy.

## 7. Recommendation (not a decision)
Proceed only with an opt-in, off-by-default launch using derived, non-sensitive segments, no third-party sharing of identifiable data, a 12-month profile limit with automatic deletion, and sensitive categories excluded. Ship all controls above and obtain sponsor-bank/card-network approval before launch. Treat default-on personalization, raw descriptions, sensitive targeting, and identifiable provider sharing as out of scope until separately approved.

## 8. Open decisions and research status
Resolve five design decisions: sensitive-category targeting; raw vs. derived data; provider sharing and detail; retention duration; business-account treatment. Research was attempted in the visible app but returned “Failed to fetch,” so no source-backed research packet is saved. This draft is generated analysis based on the supplied facts and stated assumptions. No durable decision is recorded.
