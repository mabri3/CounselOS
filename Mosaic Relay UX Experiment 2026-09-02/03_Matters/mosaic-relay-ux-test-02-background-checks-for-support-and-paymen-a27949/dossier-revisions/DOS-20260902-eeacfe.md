---
revision_id: DOS-20260902-eeacfe
matter_id: MAT-20260902-a27949
record_type: dossier_revision
status: applied
base_content_hash: ebd85beb6b8541f2541af8416a5c1f3284c077961a57d8ede7c294aa2829bfa9
content_hash: 31825108a920e373b88bbaf26cc4677169c60ec3e81a99c89346961b42df870a
created_at: '2026-09-02T14:42:07+00:00'
immutable: true
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment-infrastructure provider, plans to require background checks for employees and contractors who can view payment data, change payout controls, approve refunds, or investigate disputes. The program would collect consent, send identifying information to a vendor, and block access until checks complete, with results categorized as clear, review, or ineligible. Counsel is involved because the company operates in California, New York, Texas, Ireland, and the United Kingdom, and the business wants one global policy despite varying local rules on criminal-record data, credit checks, and privacy. Checks would occur before access and every three years, with additional checks after role changes.

## Decision question

Which of the vendor's five search types (criminal-record, identity, sanctions, credit, employment-history) can Mosaic Relay lawfully run for each of the four access categories across California, New York, Texas, Ireland, and the United Kingdom, and what notices, review standards, and dispute processes must accompany them before the program launches?

## Material facts

- Mosaic Relay plans to require background checks for employees and contractors who can view payment data, change payout controls, approve refunds, or investigate disputes.
- The proposed operation would collect consent, send identifying information to a background-check vendor, and block access until the check is complete.
- Results would be categorized as clear, review, or ineligible.
- Checks would occur before access is granted and every three years, with additional checks after certain role changes.
- Mosaic Relay has employees in California, New York, Texas, Ireland, and the United Kingdom.
- The vendor offers criminal-record, identity, sanctions, credit, and employment-history searches, but the business has not selected which searches to use.
- Mosaic Relay wants to use one global policy.
- Mosaic Relay does not want managers to see detailed reports.
- Which of the vendor's searches does the business intend to run for these roles? — Not yet decided
- Which roles or access levels will trigger a background check? — All four categories as stated (view payment data, change payout controls, approve refunds, investigate disputes)
- Do contractor agencies already run their own background checks on their staff, and will Mosaic Relay rely on those or run its own checks? — Not yet decided
- What lookback periods are intended for each search type? — Not yet decided. Mosaic Relay has not selected lookback periods for any search type; propose the minimum period needed for the role and lawful under each jurisdiction, subject to documented necessity and local limits.
- Is the 'one global policy' a hard requirement, or can it include jurisdiction-specific carve-outs where law requires? — Global framework with jurisdiction-specific carve-outs where law requires
- What retention and deletion periods are intended for the background-check data? — Not yet decided. Retain only the minimum data needed to administer access and any required dispute or audit window; define separate deletion rules for raw reports, decision records, and audit logs after jurisdiction-specific review.
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- The background-check vendor is a consumer reporting agency subject to the US Fair Credit Reporting Act (FCRA) for US-based individuals.
- The program will rely on the vendor to supply the required FCRA notices and adverse-action letters.
- The three-year recheck cadence and role-change rechecks are business preferences, not yet validated against legal requirements.

## Issues and workstreams

- US state-law variation (CA, NY, TX) on criminal-history, credit, and ban-the-box rules conflicts with a single uniform global policy
- FCRA adverse-action and pre-adverse-action notice obligations for US individuals
- GDPR/UK GDPR and Irish data-protection requirements for processing criminal-record data and background-check results
- Whether credit checks are lawful/necessary for these roles (restricted in CA and NY)
- Retention limits and minimization for sensitive background-check data

## Open questions

- Which specific searches does the business intend to run for each role, and what lookback periods are planned?
- Do contractor agencies already perform background checks, and will Mosaic Relay rely on those or run its own?
- What retention and deletion periods will apply to raw reports, decision records, and audit logs?
- What are the exact local notice, consent, and adverse-action requirements in each jurisdiction, especially for criminal-record and credit data?
- Which roles or access levels legally require screening, and what is the documented business necessity for each search type?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-02-background-checks-for-support-and-paymen-a27949/research/RES-20260902-63c59f.md`

- Internal support: **Facts** — Known Facts Mosaic Relay plans to require background checks for employees and contractors who can view payment data, change payout controls, approve refunds, or investigate disputes. The proposed…

## Options or working recommendation

# Recommendation

Adopt a global framework with jurisdiction-specific carve-outs. Do not launch a uniform five-search bundle.

1. Start with identity verification and sanctions screening for the four stated access categories, subject to documented necessity and local rules.
2. Add criminal-record and employment-history checks only after a role-and-permission matrix shows a clear, proportionate need. Use individualized review and no automatic exclusion.
3. Exclude credit checks from the default bundle. Revisit only for a defined role, with a separate California/New York analysis and a documented business reason.
4. Use a centralized HR/Security/Legal review queue. Managers receive status and next steps, not detailed reports.
5. Use clear, standalone notices and authorizations. Follow the FCRA pre-adverse and adverse-action sequence where applicable. Pause final ineligibility during a dispute.
6. Limit vendor data, set short retention periods, and create local notices, lawful bases, transfer safeguards, and deletion rules for Ireland and the UK.

This is a recommendation only. It is not a recorded decision. Open items are the selected searches, exact permissions, contractor-agency practice, lookback periods, local requirements, retention schedule, and current primary-authority verification.

## Next counsel action

Approve the final response.

## Work product links

- Draft: [Mosaic Relay UX Test — 02 — Background Checks legal memo](03_Matters/mosaic-relay-ux-test-02-background-checks-for-support-and-paymen-a27949/work-product/draft/mosaic-relay-ux-test-02-background-checks-legal-memo-3622f1.md)
- Final: [Mosaic Relay UX Test — 02 — Background Checks legal memo](03_Matters/mosaic-relay-ux-test-02-background-checks-for-support-and-paymen-a27949/work-product/final/mosaic-relay-ux-test-02-background-checks-legal-memo-3622f1-b8a9bf.md)
