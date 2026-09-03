---
matter_id: MAT-20260902-31b575
record_type: dossier
editable: true
source_revision: 03_Matters/juniper-ledger-ux-test-01-freelancer-onboarding-with-variable-in-31b575/dossier-revisions/DOS-20260902-c3c993.md
updated_at: '2026-09-02T06:30:41+00:00'
content_hash: 3eed3d4b41c4157e5ba2b9bc79e6b31116324255825bc2f3aa8b8686de09eee4
---
# Matter dossier

## Matter summary

Juniper Ledger, a fintech without a banking charter, wants to test a streamlined onboarding flow for freelancers opening consumer spending accounts, working through its sponsor bank Cedar Harbor Bank, N.A. The proposed flow would collect identity, tax, occupation, volume, and funding information; run automated identity verification, sanctions screening, and device-risk checks; and issue a virtual card after preliminary approval while restricting physical cards, ACH, and higher limits until further review. Counsel is involved because the flow implicates CIP/KYC, sanctions, consumer-protection, adverse-action, privacy, and sponsor-bank oversight obligations, and Product needs answers before a planned launch next quarter. Key open items include account classification, transaction limits, adverse-action notices, data retention, and whether failed verifications can be appealed.

## Decision question

For next quarter's freelancer consumer spending account pilot, what onboarding sequence, disclosures, account classification, review triggers, and specific control points must Juniper Ledger implement before it may issue a virtual card or enable ACH, given that Cedar Harbor Bank is the named bank and the identity-verification provider's FCRA status is unconfirmed?

## Material facts

- Proposed flow collects identity details, tax identification information, occupation, expected monthly volume, and funding source.
- Flow uses automated identity verification, sanctions screening, device-risk signals, and a small initial deposit.
- Customer may receive a virtual card after preliminary approval; physical cards, ACH transfers, and higher limits remain restricted until review.
- Actors in the flow: Juniper Ledger, sponsor bank (Cedar Harbor Bank, N.A.), identity-verification provider, and customer-support team.
- Product wants to launch a test with selected applicants next quarter.
- Freelancers may have irregular income and may use one account for both personal and business expenses.
- Product has not decided whether to classify the account by intended use, whether to request proof of income, or when sponsor-bank review must occur.
- How should the account be classified for regulatory purposes — consumer, business, or a hybrid given freelancers may use one account for personal and business expenses? — Undecided — advise on the options
- Account classification (consumer, business, or hybrid) is undecided; lawyer asked to advise on the options.
- What are the proposed transaction and balance limits at the preliminary (virtual-card) stage and after full review? — Assume a conservative pilot: preliminary virtual-card stage capped at $250 total balance and $100 per day in card spend, with no ACH, cash withdrawal, or card-to-card transfers. After completed sponsor-bank review and full CIP/identity resolution, assume up to $5,000 balance and $2,500 per day in card spend, with ACH enabled only after review and risk approval. Product must confirm these limits before launch; they are working assumptions, not approved limits.
- Is the identity-verification provider a consumer-reporting agency (i.e., does it furnish consumer reports under the FCRA)? — Not sure — need to check the vendor contract
- When does the business need the legal answer? — Before a planned launch
- Business needs the legal answer before a planned launch.
- When must sponsor-bank (Cedar Harbor) review occur in the flow? — Not yet decided — advise on the options
- Product wants to launch a test with selected applicants next quarter; legal answer needed before launch.
- Whether the identity-verification provider is a consumer-reporting agency under the FCRA is undecided; needs vendor contract check.
- When sponsor-bank (Cedar Harbor) review must occur in the flow is undecided; lawyer asked to advise on the options.
- What data-retention period is proposed for identity, verification, and sanctions-screening records? — No product period is set. Working assumption: retain CIP, account-opening, transaction, and sanctions-screening records for at least five years after account closure or the record, as applicable, while applying a documented privacy schedule, access controls, and deletion when no legal or operational need remains. Confirm the sponsor bank and vendor schedules before launch; this is not a final retention decision.
- Proposed flow collects identity details, tax ID, occupation, expected monthly volume, and funding source.
- Actors: Juniper Ledger, sponsor bank Cedar Harbor Bank N.A., identity-verification provider, and customer-support team.
- Account classification (consumer/business/hybrid) is undecided; lawyer asked to advise on options.
- Whether the identity-verification provider is a consumer-reporting agency under FCRA is undecided; needs vendor contract check.
- When sponsor-bank (Cedar Harbor) review must occur in the flow is undecided; lawyer asked to advise on options.
- we'll offer an appeal/reconsideration process.
- Juniper Ledger will offer an appeal/reconsideration process for failed verification.

## Assumptions

- The account is a consumer spending account (Reg E/Reg CC consumer protections likely apply) unless Product decides otherwise.
- The identity-verification provider may be a consumer-reporting agency, which would trigger FCRA adverse-action duties on denial.
- Cedar Harbor Bank, N.A. is the named bank for deposit accounts and payment rails under the program-management agreement.
- The transaction and balance limits are working assumptions Product must confirm before launch, not approved limits.
- Working limits: preliminary virtual-card stage capped at $250 total balance and $100 per day card spend, with no ACH, cash withdrawal, or card-to-card transfers; after completed sponsor-bank review and full CIP/identity resolution, up to $5,000 balance and $2,500 per day card spend, with ACH enabled only after review and risk approval. Product must confirm these limits before launch; they are working assumptions, not approved limits.
- Transaction/balance limits are working assumptions Product must confirm before launch, not approved limits.
- Whether the IDV provider is a consumer-reporting agency under FCRA is unresolved pending vendor contract review.
- Working limits: preliminary virtual-card stage capped at $250 total balance and $100 per day card spend, no ACH/cash withdrawal/card-to-card transfers; after completed sponsor-bank review and full CIP/identity resolution, up to $5,000 balance and $2,500 per day card spend, ACH enabled only after review and risk approval. Working assumptions, not approved limits.
- Transaction and balance limits are working assumptions Product must confirm before launch, not approved limits.
- Test launch is next quarter; legal answer needed before launch.
- Working limits: preliminary virtual-card stage capped at $250 total balance and $100/day card spend, no ACH/cash withdrawal/card-to-card; after completed sponsor-bank review and full CIP/identity resolution, up to $5,000 balance and $2,500/day card spend, ACH enabled only after review and risk approval.
- Transaction/balance limits are working assumptions Product must confirm before launch.
- Data-retention period is a working assumption; sponsor bank and vendor schedules must be confirmed before launch.
- Account classification, IDV-provider FCRA status, and sponsor-bank review timing remain undecided pending advice.
- Working limits: preliminary virtual-card stage capped at $250 total balance / $100 per day card spend, no ACH, cash withdrawal, or card-to-card transfers; after completed sponsor-bank review and full CIP/identity resolution, up to $5,000 balance / $2,500 per day card spend, ACH enabled only after review and risk approval.
- Data retention working assumption: retain CIP, account-opening, transaction, and sanctions-screening records at least five years after account closure or the record, with documented privacy schedule, access controls, and deletion when no legal/operational need remains; confirm sponsor bank and vendor schedules before launch.
- Data-retention period is a working assumption pending confirmation of sponsor bank and vendor schedules.
- Account classification, IDV-provider FCRA status, and sponsor-bank review timing remain undecided and will be advised on in the analysis.
- Working limits: preliminary virtual-card stage capped at $250 total balance and $100/day card spend, no ACH/cash/card-to-card; after full review up to $5,000 balance and $2,500/day card spend, ACH only after review and risk approval.
- Data retention working assumption: retain CIP, account-opening, transaction, and sanctions-screening records at least five years after closure, with documented privacy schedule, access controls, and deletion when no need remains.

## Issues and workstreams

- Account classification (consumer/business/hybrid) drives Reg E, Reg CC, and disclosure obligations.
- Regulatory sequencing: whether a virtual card may be issued after preliminary approval before full sponsor-bank review, and the exact point ACH and physical cards may be enabled.
- Adverse-action and notice obligations for automated identity-verification and sanctions-screening denials (ECOA/Reg B, and FCRA if the IDV provider is a consumer-reporting agency).
- Data-retention period for identity, verification, and screening records.
- What the appeal/reconsideration process for a failed verification must include.
- Sponsor-bank (Cedar Harbor) review trigger points and program-management agreement obligations.

## Open questions

- Is the identity-verification provider a consumer-reporting agency under the FCRA? (Needs vendor contract review.)
- What are the final approved transaction and balance limits for the preliminary and post-review stages? (Working assumptions are $250 balance / $100/day card spend preliminary; $5,000 balance / $2,500/day post-review.)
- When must Cedar Harbor's sponsor-bank review occur in the flow — before virtual-card issuance, before ACH enablement, or at another trigger point?
- What data-retention period will Product and the sponsor bank commit to for identity, verification, and screening records? (Working assumption is at least five years after account closure.)
- Will the account be classified as consumer, business, or hybrid, and will proof of income be requested by default or only under specific risk triggers?

## Research and source support

Latest review: `03_Matters/juniper-ledger-ux-test-01-freelancer-onboarding-with-variable-in-31b575/research/RES-20260902-c8e6cc.md`

- Internal support: **Facts** — Known Facts Proposed flow collects identity details, tax identification information, occupation, expected monthly volume, and funding source. Flow uses automated identity verification, sanctions…

## Options or working recommendation

No recommendation has been drafted yet.

## Next counsel action

Review the working ask and answer the next material question.

## Work product links

No work product yet.
