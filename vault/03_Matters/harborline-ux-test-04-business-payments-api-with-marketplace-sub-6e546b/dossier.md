---
matter_id: MAT-20260830-6e546b
record_type: dossier
editable: true
source_revision: 03_Matters/harborline-ux-test-04-business-payments-api-with-marketplace-sub-6e546b/dossier-revisions/DOS-20260830-9c3bf2.md
updated_at: '2026-08-30T20:20:42+00:00'
content_hash: 1806c9cc270a56ec1331be5bdb05e48605154dd323dc23c672e9b0f557f5411b
---
# Matter dossier

## Current ask

Harborline wants to offer an API that lets software platforms accept customer payments and direct funds to their participating small businesses. A platform would create a Harborline profile for each business, submit onbo

## Known facts

- Intake response: yes

## Missing information

- Continue focused intake as needed.

## Work product

No work product yet.

## Summary

Harborline (fintech operating software and risk operations; deposit accounts held at a partner bank) wants to launch an API letting software platforms accept customer payments and route proceeds to participating small businesses, with splits among the business, the platform, and Harborline fees. Harborline would manage processing, risk, reserves, returns, and support; platforms would not hold customer funds directly, and Harborline contracts with each business. Key structure decisions are open: pooled custodial vs. individual accounts, platform refund control, and reserve duration. Product wants a limited beta in four months.

## Decision question

Which funds-flow structure should Harborline approve for the Business Payments API — pooled custodial account vs. individual subaccounts at the partner bank, who may issue payment instructions and refunds, and whether the platform may deduct its fee before settlement — given that the choice determines money-transmission and payment-facilitator exposure for Harborline and the platforms, required account titles and agreements, and the four-month beta timeline?

## Open questions

- Pooled custodial account vs. individual subaccounts per business — which does the partner bank support, and what titling/ledger controls does each require?
- Will platforms be permitted to initiate refunds, and if so, under whose rules and liability?
- How long may reserves be held, and what triggers release?
- Does the platform's fee deduction occur pre-settlement (gross-to-net split) or post-settlement (pull from business account)?
- What do the card network and ACH agreements say about payment facilitator registration, sub-merchant onboarding, and chargeback liability?

## Research

Latest review: `03_Matters/harborline-ux-test-04-business-payments-api-with-marketplace-sub-6e546b/research/RES-20260830-fb4a84.md`
