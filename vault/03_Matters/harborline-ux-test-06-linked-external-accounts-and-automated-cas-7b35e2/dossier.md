---
matter_id: MAT-20260830-7b35e2
record_type: dossier
editable: true
source_revision: 03_Matters/harborline-ux-test-06-linked-external-accounts-and-automated-cas-7b35e2/dossier-revisions/DOS-20260830-5a0597.md
updated_at: '2026-08-30T20:20:42+00:00'
content_hash: 1b8860d692133f61bc234c4f2e0ce6d691bfd190f997467b5a39405f306f7847
---
# Matter dossier

## Current ask

Harborline wants to let business customers link accounts held at other banks and set automated rules that move money between those accounts and their Harborline account. A customer could set a minimum balance, authorize 

## Known facts

- Intake response: yes

## Missing information

- Continue focused intake as needed.

## Work product

No work product yet.

## Summary

Harborline (U.S. fintech operating with a sponsor bank partner) wants to let business customers link external bank accounts and set automated sweep rules that pull funds via ACH debit when the Harborline balance falls below a set minimum. The flow uses a data-aggregation provider for ownership/balance data, with Harborline or its bank partner originating ACH entries, and role-based permissions for finance teams. Product targets release in twelve weeks. Counsel must advise on authorization, account validation, Nacha, EFT, privacy, and security requirements before build decisions are locked.

## Decision question

What consent, account-validation, and notice design should Harborline adopt for automated external-account sweeps — including the exact authorization and renewal process, whether each debit requires advance notice, how revoked authority and returned entries are handled, and which roles may create or edit sweep rules — so the feature launches in twelve weeks without violating Nacha rules, EFTA/Regulation E, or partner-bank requirements?

## Open questions

- Who is the Originator of record for the ACH entries — Harborline or the sponsor bank — and what does the ODFI agreement require for account validation and return-rate monitoring?
- Will the first release include sole proprietors or any consumer-purpose accounts, or strictly business entities?
- What account-validation method will the build use, and can the aggregator verify that the linked account is owned by the business rather than the individual user?
- Will affiliate-owned or joint external accounts be permitted, and if so under what controls?
- What per-debit and aggregate sweep limits will apply, and what is the protocol for R05/R10/R29 returns and Nacha return-rate thresholds?

## Research

Latest review: `03_Matters/harborline-ux-test-06-linked-external-accounts-and-automated-cas-7b35e2/research/RES-20260830-91e6ad.md`
