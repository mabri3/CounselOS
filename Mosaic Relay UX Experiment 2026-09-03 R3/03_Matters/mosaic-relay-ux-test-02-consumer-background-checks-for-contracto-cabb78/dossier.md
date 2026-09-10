---
matter_id: MAT-20260903-cabb78
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-02-consumer-background-checks-for-contracto-cabb78/dossier-revisions/DOS-20260903-71f99f.md
updated_at: '2026-09-03T22:05:01+00:00'
content_hash: 266e8aac1f5c10ce90d7d52547037d147a58376861c255f13a1a4ceb582510be
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment infrastructure provider, wants to offer platform customers a feature that screens contractors before they can receive payouts. The feature would collect contractor consent and identifying information, obtain background reports from a vendor, and return eligibility results to the platform. Counsel is involved because the feature implicates federal FCRA obligations, state consumer-reporting laws, and questions about who bears compliance duties when screening affects payment access. The platform customer has been confirmed as the final decision-maker, and the service would operate US-only with screening at onboarding, annually, and after certain fraud events.

## Decision question

Whether Mosaic Relay may treat sanctions screening and identity verification as separate from FCRA consumer-report obligations when those checks are bundled with or used alongside criminal background reports that determine contractor payout eligibility, and if separation is possible, what product architecture and contractual terms are required to maintain that distinction without creating co-user FCRA liability for Mosaic Relay.

## Material facts

- Mosaic Relay wants to offer a customer (a platform) a feature that screens contractors before they can receive payouts.
- The proposed experience asks contractors for consent, collects identifying information, obtains a background report from a vendor, and returns 'eligible', 'manual review', or 'not eligible' to the customer.
- The business goal is to help platforms reduce fraud and meet internal trust requirements without exposing detailed reports to platform staff who do not need them.
- Screening would occur during onboarding and again annually, with urgent rechecks after certain fraud or dispute events.
- The feature may use criminal-record, identity, sanctions, and address information, but exact report contents and decision rules are unsettled.
- Actors include Mosaic Relay, the platform customer, contractors, background-screening vendors, Mosaic Relay operations staff, and payout recipients.
- Which jurisdictions are in scope for the contractors being screened and the platform customer? — US only
- Who makes the final eligibility decision that determines whether a contractor can receive payouts? — The platform customer makes the final decision
- but a limited report (e.g., criminal/identity only).
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- The contractors being screened are individuals (consumers) in the US, making the FCRA the primary governing framework; this is unconfirmed.
- The background-screening vendor is a consumer reporting agency (CRA) subject to FCRA, rather than a non-FCRA data provider.
- Mosaic Relay and/or the customer would be a 'user' of a consumer report under FCRA.

## Issues and workstreams

- FCRA applicability: whether the background report is a 'consumer report' and Mosaic Relay / the customer are 'users' with permissible-purpose and adverse-action obligations
- Who is the decision-maker on eligibility (customer vs Mosaic Relay) and who bears adverse-action / notice duties
- Whether sanctions screening and identity checks are separate from consumer-report obligations
- Whether payout restriction based on screening results triggers additional consumer-protection or funds-flow disclosure duties
- US-only scope confirmed; state-level consumer-reporting and ban-the-box laws may still apply in addition to federal FCRA

## Open questions

- Does the background-screening vendor operate as a consumer reporting agency (CRA) under FCRA, or does it provide only non-FCRA data services such as sanctions list matching or identity verification?
- Will sanctions and identity data be included in the same report as criminal-record information, or delivered through separate API calls or report sections?
- Does Mosaic Relay procure the background report from the vendor on behalf of the platform customer, or does the platform contract directly with the vendor?
- Will Mosaic Relay apply decision rules or scoring to the screening results, or only transmit vendor-supplied data to the platform?
- Are contractors located in states with consumer-reporting laws that impose duties beyond federal FCRA, such as California's Investigative Consumer Reporting Agencies Act or New York's Fair Credit Reporting Act?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-02-consumer-background-checks-for-contracto-cabb78/research/RES-20260903-01c5bb.md`

- Internal support: **Working Recommendation Consumer Background Checks For Contractor E64945** — What would change this Working assumption: The customer is the sole FCRA user if it receives only status codes. If Mosaic Relay procures the report and applies the decision rules, Mosaic Relay is…

## Options or working recommendation

# Recommendation

Mosaic Relay may offer the contractor-screening service only as a controlled US pilot, subject to the conditions below. This is a working recommendation, not a durable decision.

## Conditions before launch

1. Treat the background vendor as a CRA and treat the platform customer as the decision-maker and FCRA user unless the data flow shows Mosaic Relay procures the report or applies the rules. If Mosaic Relay does either, allocate co-user duties by contract and build the same notice workflow for Mosaic Relay.
2. Use a standalone, clear disclosure that a consumer report may be obtained for work eligibility and capture written authorization. Confirm whether one authorization covers annual and event-triggered rechecks.
3. Build a pre-adverse step: send the report and the current Summary of Rights before any “manual review” or “not eligible” outcome becomes final. Then send the final adverse-action notice with CRA identity/contact, statement that the CRA did not decide, free-report rights, and dispute rights.
4. Give contractors a clear dispute and reinvestigation path. Pause final adverse action while a timely dispute is handled, and revisit the result after correction.
5. Keep sanctions screening and identity verification separate from the CRA report unless Mosaic Relay accepts that bundled data is handled under FCRA. Apply documented, proportionate rules and individualized review where required.
6. Do not restrict, delay, or condition payment for completed work until counsel confirms the payout terms, state overlays, and notice timing. Start with onboarding/future-work gating only, with least-privilege report access and documented retention/disposal.
7. Confirm contractor states, report contents, accuracy sources, retention periods, and adverse-action ownership before launch. Verify all statutory and agency citations against current authority.

## Lawyer action requested

Approve a limited design phase to confirm these facts and implement the FCRA workflow. Do not record a durable launch approval until the missing facts and authority checks are complete.

## Conditions before launch

1. Treat the background vendor as a CRA and treat the platform customer as the decision-maker and FCRA user unless the data flow shows Mosaic Relay procures the report or applies the rules. If Mosaic Relay does either, allocate co-user duties by contract and build the same notice workflow for Mosaic Relay.
2. Use a standalone, clear disclosure that a consumer report may be obtained for work eligibility and capture written authorization. Confirm whether one authorization covers annual and event-triggered rechecks.
3. Build a pre-adverse step: send the report and the current Summary of Rights before any “manual review” or “not eligible” outcome becomes final. Then send the final adverse-action notice with CRA identity/contact, statement that the CRA did not decide, free-report rights, and dispute rights.
4. Give contractors a clear dispute and reinvestigation path. Pause final adverse action while a timely dispute is handled, and revisit the result after correction.
5. Keep sanctions screening and identity verification separate from the CRA report unless Mosaic Relay accepts that bundled data is handled under FCRA. Apply documented, proportionate rules and individualized review where required.
6. Do not restrict, delay, or condition payment for completed work until counsel confirms the payout terms, state overlays, and notice timing. Start with onboarding/future-work gating only, with least-privilege report access and documented retention/disposal.
7. Confirm contractor states, report contents, accuracy sources, retention periods, and adverse-action ownership before launch. Verify all statutory and agency citations against current authority.

## Lawyer action requested

Approve a limited design phase to confirm these facts and implement the FCRA workflow. Do not record a durable launch approval until the missing facts and authority checks are complete.

## Conditions before launch

1. Treat the background vendor as a CRA and treat the platform customer as the decision-maker and FCRA user unless the data flow shows Mosaic Relay procures the report or applies the rules. If Mosaic Relay does either, allocate co-user duties by contract and build the same notice workflow for Mosaic Relay.
2. Use a standalone, clear disclosure that a consumer report may be obtained for work eligibility and capture written authorization. Confirm whether one authorization covers annual and event-triggered rechecks.
3. Build a pre-adverse step: send the report and the current Summary of Rights before any “manual review” or “not eligible” outcome becomes final. Then send the final adverse-action notice with CRA identity/contact, statement that the CRA did not decide, free-report rights, and dispute rights.
4. Give contractors a clear dispute and reinvestigation path. Pause final adverse action while a timely dispute is handled, and revisit the result after correction.
5. Keep sanctions screening and identity verification separate from the CRA report unless Mosaic Relay accepts that bundled data is handled under FCRA. Apply documented, proportionate rules and individualized review where required.
6. Do not restrict, delay, or condition payment for completed work until counsel confirms the payout terms, state overlays, and notice timing. Start with onboarding/future-work gating only, with least-privilege report access and documented retention/disposal.
7. Confirm contractor states, report contents, accuracy sources, retention periods, and adverse-action ownership before launch. Verify all statutory and agency citations against current authority.

## Lawyer action requested

Approve a limited design phase to confirm these facts and implement the FCRA workflow. Do not record a durable launch approval until the missing facts and authority checks are complete.

## Next counsel action

Close the matter.

## Work product links

- Draft: [Working Recommendation — Consumer Background Checks for Contractor Payouts](03_Matters/mosaic-relay-ux-test-02-consumer-background-checks-for-contracto-cabb78/work-product/draft/working-recommendation-consumer-background-checks-for-contractor-e64945.md)
- Final: [Working Recommendation — Consumer Background Checks for Contractor Payouts](03_Matters/mosaic-relay-ux-test-02-consumer-background-checks-for-contracto-cabb78/work-product/final/working-recommendation-consumer-background-checks-for-contractor-e64945-17d6ea.md)
