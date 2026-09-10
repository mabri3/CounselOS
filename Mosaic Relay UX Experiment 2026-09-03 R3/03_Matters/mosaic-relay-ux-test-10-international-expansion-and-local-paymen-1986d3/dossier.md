---
matter_id: MAT-20260904-1986d3
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-10-international-expansion-and-local-paymen-1986d3/dossier-revisions/DOS-20260904-0ba5fd.md
updated_at: '2026-09-04T01:18:13+00:00'
content_hash: 66e527790bca3d7e1f6dc8ec944d959b2b77f3177b586ed9e9d7b35690f142d3
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment infrastructure company (not a bank, does not hold deposits), plans to support merchants accepting cards, ACH, and selected local payment methods across several new countries. The proposed experience uses one global onboarding flow, local checkout options, automated currency conversion, and cross-border payouts to sellers and contractors. Counsel is involved because the expansion triggers licensing, AML/KYC, privacy, consumer protection, tax, sanctions, disclosure, and payout requirements that vary by country and must be documented before any country is added to the launch list. Product development begins this quarter, with a pilot in six months and broader release after operational testing.

## Decision question

Which specific countries can Mosaic Relay add to its international launch list, and what minimum facts and documentation must each candidate country clear — covering licensing/agent structure, funds flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements — before it is approved for the six-month pilot?

## Material facts

- Mosaic Relay is not a bank, does not hold deposits, and works through external payment and infrastructure providers.
- The proposed experience uses one global onboarding flow, local payment options at checkout, automated currency conversion, and cross-border payouts to sellers and contractors.
- Product development would begin this quarter, with a pilot in six months and broader release after operational testing.
- The business goal is to help existing customers expand without building separate payment operations for each country.
- Which specific countries are the target for this international expansion? This drives everything downstream — licensing, AML/KYC, privacy, and disclosures are all country-specific. — The target countries are not yet selected. Treat the country list as a launch gate. Do not approve a country until its licensing, funds flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements are documented.
- In the proposed cross-border flow, who holds customer funds at each step — does Mosaic Relay ever take custody of funds, or do acquiring/local payment providers and payout providers hold and move all funds? — Not yet determined — funds flow is still being designed
- Which Mosaic Relay entity would contract with merchants, sellers, and local payment providers in the new countries — a single global entity, or local/regional entities per country? — Not yet determined — contracting structure is still being designed
- Which payout provider(s) would carry the cross-border payouts to sellers and contractors? — Not yet determined — payout provider not yet selected
- Where will customer and merchant data be located for the new countries — stored in existing Mosaic Relay data centers/regions, or in-country/local data storage? — Not yet determined — data locations not yet decided

## Assumptions

- Mosaic Relay's existing acquiring/processing partners and local payment providers will carry the licensed money-transmission activity in each new country (agent/partner-of-record model), rather than Mosaic Relay obtaining new licenses itself.
- The 'several new countries' are within Mosaic Relay's existing footprint (North America, UK, EU, selected other markets) unless stated otherwise.
- Cross-border payouts to sellers and contractors are made through external payout providers rather than Mosaic Relay holding funds.

## Issues and workstreams

- Money transmission / licensing exposure in each target country (Mosaic Relay is not a bank and does not hold deposits, but cross-border payouts and local payment acceptance may still trigger licensing or agent/partner-of-record structures)
- Cross-border AML/KYC controls: sanctions screening, KYB/KYC for merchants and recipients, transaction monitoring across jurisdictions
- Consumer protection and funds-flow disclosures: cancellation rights, local disclosures, payout restrictions
- Privacy and data protection: data locations, cross-border data transfers, controller/processor allocation
- Contracting structure: which entity contracts with merchants, sellers, and local payment providers
- Marketing limits and local disclosure requirements
- Country-approval gate: no country is approved until its licensing, funds flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements are documented

## Open questions

- Which specific countries are the target for this expansion? (Drives all downstream analysis — licensing, AML/KYC, privacy, disclosures are country-specific.)
- In the proposed cross-border flow, who holds customer funds at each step — does Mosaic Relay ever take custody, or do acquiring/local payment providers and payout providers hold and move all funds?
- Which Mosaic Relay entity would contract with merchants, sellers, and local payment providers in the new countries — a single global entity, or local/regional entities per country?
- Which payout provider(s) would carry the cross-border payouts to sellers and contractors?
- Where will customer and merchant data be located for the new countries — existing Mosaic Relay data centers/regions, or in-country/local data storage?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-10-international-expansion-and-local-paymen-1986d3/research/RES-20260904-4431a2.md`

- Internal support: **Money Transmission Licensing And Agent Partner Of Record Analysi 622E0F** — What would change this Working assumption — no custody: The analysis assumes Mosaic Relay will not take custody of customer funds at any point. If it does take custody (even momentarily), it will…

## Options or working recommendation

# Recommendations

These are proposed recommendations only. No durable decision is recorded.

1. Treat the target-country list, funds-flow diagram, custody/control analysis, contracting entity, payout providers, and data locations as launch gates.
2. For the six-month pilot, prefer a partner-led agent or partner-of-record model only where local counsel confirms that path and the partner holds the required licenses.
3. Keep Mosaic Relay outside custody and control of funds unless and until it has the required permissions; if the design changes, restart the licensing analysis.
4. Use risk-based KYB/KYC, enhanced due diligence, sanctions screening, transaction monitoring, clear allocation of SAR/STR duties, and human review for exceptions.
5. Prepare country-specific checkout, fee/FX, refund, cancellation, complaint, payout, privacy, data-transfer, tax, and marketing disclosures.
6. Require local counsel confirmation and documented partner licenses before approving any country.

## Next counsel action

Complete required work before closing the matter.

## Work product links

- Draft: [Country-Approval Gate Framework — International Expansion and Local Payment Methods](03_Matters/mosaic-relay-ux-test-10-international-expansion-and-local-paymen-1986d3/work-product/draft/money-transmission-licensing-and-agent-partner-of-record-analysi-622e0f.md)
- Final: [Country-Approval Gate Framework — International Expansion and Local Payment Methods](03_Matters/mosaic-relay-ux-test-10-international-expansion-and-local-paymen-1986d3/work-product/final/money-transmission-licensing-and-agent-partner-of-record-analysi-622e0f-3bca8c.md)
