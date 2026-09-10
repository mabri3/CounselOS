---
matter_id: MAT-20260904-696f08
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--696f08/dossier-revisions/DOS-20260904-3f4fff.md
updated_at: '2026-09-04T00:30:19+00:00'
content_hash: abbc215273c2d040e2533c4df6d196ad657d7124550f8349b22905cb771a7270
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment infrastructure provider, plans to launch a unified operations dashboard combining transaction details, identity-verification results, KYB/KYC data, fraud scores, dispute records, support notes, and payout information. Authorized customer users would search and export these records for reconciliation and investigations. Counsel is involved because the design may expose more personal information than necessary, implicating GDPR/UK GDPR controller-processor rules, data minimization, and cross-border transfer restrictions. The launch timing is normal priority, but the architecture decisions made now will determine compliance obligations and vendor contract requirements.

## Decision question

Should Mosaic Relay proceed with the unified dashboard under a processor-only model (acting on customer instructions) or a hybrid model (processor for customer-directed operations, independent controller for fraud/security/compliance), and what specific access controls, export restrictions, and vendor contract amendments are required before launch to prevent unlawful secondary use and excessive data exposure?

## Material facts

- Mosaic Relay wants to build a unified operations dashboard combining transaction details, identity-verification results, KYB/KYC data, fraud scores, dispute records, support notes, and payout information.
- Authorized customer users would search by person, business, payment, or recipient and export selected records for reconciliation and investigations.
- The business goal is to reduce fragmented investigations and improve response time.
- The proposed design may expose more personal information than each user needs.
- Data would be collected during onboarding and payment activity, displayed throughout the customer relationship, and retained for legal, fraud, accounting, and support purposes.
- Mosaic Relay works with identity, fraud, acquiring, processing, cloud, and other vendors.
- Mosaic Relay is not a bank and does not hold or take deposits; it sells API and hosted payment infrastructure to online businesses, marketplaces, and software platforms.

## Assumptions

- Mosaic Relay acts as a processor (and possibly independent controller for its own compliance obligations) while customer platforms are controllers of their end-user data
- The dashboard is intended for Mosaic Relay's customer operations users and compliance staff, not for public or broad internal access
- Mosaic Relay acts as a processor (and possibly independent controller for its own compliance obligations) while customer platforms are controllers of their end-user data.
- The dashboard is intended for Mosaic Relay's customer operations users and compliance staff, not for public or broad internal access.
- Jurisdictions of users and data subjects are unknown; analysis is jurisdiction-agnostic with a jurisdiction map provided as unverified leads.
- Customer platforms are controllers of their end-user data where they determine purposes and means; Mosaic Relay acts as processor for customer-directed dashboard processing and as independent controller only for its own legal, security, and fraud duties.
- The dashboard is intended for authorized customer operations users and compliance staff, not public or broad internal access.
- Mosaic Relay is a non-bank payment infrastructure provider that does not hold deposits.

## Issues and workstreams

- Controller/processor role allocation between Mosaic Relay and its customer platforms for the combined dashboard data
- Lawful bases for processing the combined personal data, especially sensitive KYB/KYC and identity data
- Data minimization and least-privilege access given the dashboard combines many data categories
- Cross-border transfer compliance if users or data subjects are in the EU/UK
- Automated decision-making / profiling requirements if fraud scores or risk logic drive decisions
- Retention and deletion obligations and exceptions across legal, fraud, accounting, and support purposes
- Restrictions on secondary use (e.g., customer marketing) of dashboard data

## Open questions

- Which specific countries are the data subjects (payers, recipients, merchants) located in, and which countries will customer operations users access the dashboard from?
- Do existing vendor contracts (identity verification, fraud scoring, acquiring banks, cloud providers) classify Mosaic Relay as a processor, controller, or joint controller, and do they permit the data combination and export functionality contemplated?
- What is the specific profiling logic and automated decision-making threshold for fraud scores displayed in the dashboard—do they trigger automatic blocks or merely flag for human review?
- Will customers be permitted to use exported dashboard data for their own marketing purposes, or is use strictly limited to reconciliation and fraud investigation?
- What are the retention periods and deletion exceptions for each data category (legal hold, accounting, fraud prevention) across the combined dataset?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--696f08/research/RES-20260904-5d8f62.md`

- Internal support: **Facts** — Known Facts Mosaic Relay wants to build a unified operations dashboard combining transaction details, identity-verification results, KYB/KYC data, fraud scores, dispute records, support notes, and…
- Internal support: **Dos 20260904 2Fdcaa** — Matter dossier Matter summary Mosaic Relay, a payment infrastructure provider, wants to build a unified operations dashboard that combines transaction details, identity-verification results, KYB/KYC…

## Options or working recommendation

# Recommendations

1. Proceed only after a documented data map and controller/processor allocation for each flow. Mosaic Relay should act as processor for customer-directed operations processing and as an independent controller only for its own legal, security, and fraud duties where required.

2. Use purpose- and role-limited views. Mask identity, KYC/KYB, fraud, dispute, support, and payout fields by default. Require reason-coded, time-limited access for investigations.

3. Restrict exports. Permit only selected fields and date ranges, require approval for bulk export, log every search/view/export, alert on unusual volume, and apply retention and deletion to exported copies.

4. Update notices and document a lawful basis per purpose. Keep service, legal obligation, fraud/security, and any separate marketing purpose distinct. Do not allow customer marketing reuse without separate purpose, notice, and lawful basis.

5. Inventory fraud scores and profiling. Where output has legal or similarly significant effects, provide required information, human review, challenge, and escalation.

6. Set purpose-specific retention schedules and deletion holds. Confirm countries, vendors, hosting, transfer mechanisms, and supplementary safeguards before EU/UK data crosses borders.

This is a working recommendation, not a recorded decision. Jurisdiction-specific citations and vendor terms are unverified leads because no external sources or contracts were supplied.

## Next counsel action

Approve the final response.

## Work product links

- Draft: [Mosaic Relay UX Test — 06 — Privacy Controls for Payment Operations Data response](03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--696f08/work-product/draft/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--8f49e5.md)
- Final: [Mosaic Relay UX Test — 06 — Privacy Controls for Payment Operations Data response](03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--696f08/work-product/final/mosaic-relay-ux-test-06-privacy-controls-for-payment-operations--8f49e5-aae96e.md)
