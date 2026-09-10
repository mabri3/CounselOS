---
work_product_id: WP-20260904-8f49e5
matter_id: MAT-20260904-696f08
title: Mosaic Relay UX Test — 06 — Privacy Controls for Payment Operations Data response
record_type: work_product
state: final
summary: ''
created_at: '2026-09-04T00:22:15+00:00'
updated_at: '2026-09-04T00:22:15+00:00'
immutable: true
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Mosaic Relay privacy controls — draft


      ## Recommendation (not a recorded decision)

      Do not launch the unified dashboard until Mosaic Relay documents a data map,
      role-based access matrix, export controls, and vendor allocation. Use purpose-limited
      views by role and matter. Default to the least data needed for reconciliation
      or investigation; mask identity and payout fields unless the role and purpose
      require them. Log searches, views, exports, and administrative changes. Require
      a reason, narrow date range, and approval for bulk exports, with rate limits
      and alerts.


      ## Roles and notices

      Treat the customer as controller for its own end-user data where it determines
      purposes and means. Treat Mosaic Relay as processor for customer-directed dashboard
      processing, subject to a data processing agreement and documented instructions.
      Mosaic Relay may be an independent controller for its own fraud prevention,
      security, legal, and compliance duties only to the extent required by applicable
      law. Confirm the allocation per data flow and vendor. Update customer and individual-facing
      notices to cover collection, sources, purposes, categories, recipients, vendors,
      retention, transfers, profiling, rights, and complaint routes. Do not use dashboard
      data for customer marketing unless a separate purpose, lawful basis, notice,
      and permission support it.


      ## Lawful basis and minimization

      Select and document a lawful basis per purpose and jurisdiction. Contract may
      support requested payment services; legal obligation may support AML, sanctions,
      accounting, and dispute duties; legitimate interests may support security and
      fraud prevention after a necessity and balancing review. Consent should not
      be the default for core service processing. Separate sensitive identity/KYC
      data from general operations views, define field-level access, and prohibit
      unrestricted person-wide search.


      ## Automated decisions

      Inventory fraud scores and risk rules. If they produce legal or similarly significant
      effects, provide required notice and meaningful information, human review, challenge
      routes, and safeguards. Do not let a score alone deny service or freeze funds
      without documented review and escalation.


      ## Retention, deletion, and transfers

      Set a schedule by purpose and record type. Keep legal, fraud, accounting, and
      support holds separate; suspend deletion only for a documented exception and
      release it when the reason ends. Define deletion, correction, and access workflows
      across Mosaic Relay and vendors. Confirm countries, hosting locations, sub-processors,
      transfer mechanisms, and supplementary safeguards before EU/UK data moves cross-border.


      ## Assumptions and missing facts

      Assumptions: jurisdictions are unknown; customer platforms usually determine
      purposes for their users; Mosaic Relay is a non-bank infrastructure provider;
      the dashboard is for authorized operations and compliance staff. Missing facts:
      countries, data map, role rules, export limits, profiling effects, contracts,
      retention schedules, deletion exceptions, and marketing use.


      ## Evidence status

      Supplied facts are from the request. The role allocation and controls above
      are generated analysis based on those facts. No external source was supplied
      or verified; legal citations and jurisdiction-specific requirements remain unverified
      leads pending country and product details.

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
final_id: FINAL-20260904-aae96e
finalized_at: '2026-09-04T00:29:12+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--696f08/work-product/draft/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--8f49e5.md
source_content_hash: f2b364a07d700dc9ca4abf19d4915631fb7aaee41db2da4a8d05b568832591d7
---
# Mosaic Relay privacy controls — draft

## Recommendation (not a recorded decision)
Do not launch the unified dashboard until Mosaic Relay documents a data map, role-based access matrix, export controls, and vendor allocation. Use purpose-limited views by role and matter. Default to the least data needed for reconciliation or investigation; mask identity and payout fields unless the role and purpose require them. Log searches, views, exports, and administrative changes. Require a reason, narrow date range, and approval for bulk exports, with rate limits and alerts.

## Roles and notices
Treat the customer as controller for its own end-user data where it determines purposes and means. Treat Mosaic Relay as processor for customer-directed dashboard processing, subject to a data processing agreement and documented instructions. Mosaic Relay may be an independent controller for its own fraud prevention, security, legal, and compliance duties only to the extent required by applicable law. Confirm the allocation per data flow and vendor. Update customer and individual-facing notices to cover collection, sources, purposes, categories, recipients, vendors, retention, transfers, profiling, rights, and complaint routes. Do not use dashboard data for customer marketing unless a separate purpose, lawful basis, notice, and permission support it.

## Lawful basis and minimization
Select and document a lawful basis per purpose and jurisdiction. Contract may support requested payment services; legal obligation may support AML, sanctions, accounting, and dispute duties; legitimate interests may support security and fraud prevention after a necessity and balancing review. Consent should not be the default for core service processing. Separate sensitive identity/KYC data from general operations views, define field-level access, and prohibit unrestricted person-wide search.

## Automated decisions
Inventory fraud scores and risk rules. If they produce legal or similarly significant effects, provide required notice and meaningful information, human review, challenge routes, and safeguards. Do not let a score alone deny service or freeze funds without documented review and escalation.

## Retention, deletion, and transfers
Set a schedule by purpose and record type. Keep legal, fraud, accounting, and support holds separate; suspend deletion only for a documented exception and release it when the reason ends. Define deletion, correction, and access workflows across Mosaic Relay and vendors. Confirm countries, hosting locations, sub-processors, transfer mechanisms, and supplementary safeguards before EU/UK data moves cross-border.

## Assumptions and missing facts
Assumptions: jurisdictions are unknown; customer platforms usually determine purposes for their users; Mosaic Relay is a non-bank infrastructure provider; the dashboard is for authorized operations and compliance staff. Missing facts: countries, data map, role rules, export limits, profiling effects, contracts, retention schedules, deletion exceptions, and marketing use.

## Evidence status
Supplied facts are from the request. The role allocation and controls above are generated analysis based on those facts. No external source was supplied or verified; legal citations and jurisdiction-specific requirements remain unverified leads pending country and product details.
