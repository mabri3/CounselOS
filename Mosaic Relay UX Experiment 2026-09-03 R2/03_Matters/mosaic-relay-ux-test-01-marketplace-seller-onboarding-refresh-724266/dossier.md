---
matter_id: MAT-20260903-724266
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/dossier-revisions/DOS-20260903-c04c13.md
updated_at: '2026-09-03T14:46:23+00:00'
content_hash: beee4c948c3ec375ccdc6e5f63bdae9a83057c53677980b05d92acf3c4fb5fe2
---
# Matter dossier

## Matter summary

Mosaic Relay Holdings, Inc. is building a mobile-first seller onboarding flow for a marketplace customer to reduce abandonment by 25%. The flow collects legal name, business type, tax ID, ownership details, government ID, bank-account information, and a business explanation, with automatic approval for low-risk sellers and manual review for exceptions. Counsel is involved because the flow implicates BSA/AML, money-transmission, sanctions, consumer-protection, and privacy obligations, and the responsibility split between Mosaic Relay and the marketplace remains unresolved. Target launch is 2026-10-15.

## Decision question

What exact onboarding data, disclosures, review steps, approval rules, and responsibility split should legal approve before the 2026-10-15 launch of a US-only mobile-first marketplace seller onboarding flow that uses automatic approval for low-risk sellers and manual review for exceptions?

## Material facts

- Mosaic Relay wants to reduce seller onboarding time for a marketplace customer via a mobile-first flow.
- The proposed flow collects legal name, business type, tax ID, ownership details, government ID, bank-account information for payouts, and a business explanation.
- The marketplace and its sellers are the primary actors in the flow.
- Product wants to launch in six weeks (target date 2026-10-15).
- The flow uses automatic approval for low-risk sellers and manual review for exceptions.
- Current KYC/KYB fields and vendor capabilities are known to the team.
- Product expects a 25% reduction in onboarding abandonment.
- In which jurisdictions do the marketplace and its sellers operate? This drives which KYC/KYB, money-transmission, and privacy rules apply. — Not yet determined
- Who owns the seller relationship and compliance for onboarding and review: Mosaic Relay, the marketplace, or shared? This determines which party is the regulated actor and who must provide notices. — Shared — Mosaic Relay handles payments/KYC, marketplace handles seller relationship
- What risk criteria define 'low-risk' for automatic approval vs. manual review? This is the core of the approval rules legal must approve. — Other / different criteria: Automatic approval only after complete KYC/KYB, sanctions and adverse-media screening, verified payout account, no high-risk geography or prohibited business, and no identity or ownership mismatch. Any exception routes to trained manual review.
- What beneficial-owner threshold should the flow use for collecting ownership details? — 25% (US FinCEN CDD standard)
- What retention period should apply to collected KYC/KYB and government-ID data? — The regulatory minimum required by applicable law
- Which party provides required notices/disclosures to sellers: Mosaic Relay, the marketplace, or shared? — Shared — Mosaic Relay provides KYC/payments notices, marketplace provides seller-facing disclosures
- What kinds of sellers does the marketplace serve? — Mixed (multiple types)
- Customer geography (jurisdictions where the marketplace and its sellers operate) — Not yet determined. Proceed on a US-only assumption for this first-pass analysis, but treat geography confirmation as a pre-launch gate; do not expand beyond the US assumption without a jurisdictional review.

## Assumptions

- The marketplace is a US-based customer unless stated otherwise; geography is currently missing.
- Mosaic Relay acts as the payments-infrastructure provider and the marketplace owns the seller relationship, but the split is unconfirmed.
- Beneficial-owner thresholds follow US FinCEN CDD rules (25%) unless a different standard applies.
- With a shared split, Mosaic Relay provides KYC/payments-related notices and the marketplace provides seller-facing disclosures; this allocation is unconfirmed.
- The marketplace is a US-based customer unless stated otherwise; geography is currently not yet determined.
- Beneficial-owner threshold follows US FinCEN CDD (25%) as confirmed by the lawyer.
- With a shared split, Mosaic Relay provides KYC/payments-related notices and the marketplace provides seller-facing disclosures (confirmed by lawyer).
- US-only geography assumption for this first-pass analysis; geography confirmation is a pre-launch gate and expansion beyond US requires a jurisdictional review.
- Mosaic Relay acts as the payments-infrastructure provider and the marketplace owns the seller relationship, with Mosaic Relay handling payments/KYC and the marketplace handling the seller relationship.
- Beneficial-owner threshold follows US FinCEN CDD (25%).
- With the shared split, Mosaic Relay provides KYC/payments notices and the marketplace provides seller-facing disclosures.

## Issues and workstreams

- KYC/KYB data collection scope and whether each collected field is necessary and proportionate
- Money-transmission / regulatory characterization of the onboarding and payout flow
- Beneficial-ownership (UBO) thresholds and ownership-detail collection requirements
- Data retention periods for collected KYC/KYB and government-ID data
- Privacy/data-protection obligations for collecting government ID and bank-account data
- Disclosure requirements and which party provides required notices
- Automatic-approval vs. manual-review rules and the risk criteria defining 'low-risk'
- Responsibility split between Mosaic Relay and the marketplace for onboarding, review, and compliance

## Open questions

- In which specific states do the marketplace and its sellers operate, and do any sellers reside outside the US?
- Which party is the regulated actor for money transmission: Mosaic Relay, the marketplace, or the acquiring bank/processor?
- What are the exact risk criteria and data sources that define "low-risk" for automatic approval?
- What retention periods apply to government-ID and bank-account data under BSA, state money-transmitter laws, and privacy laws?
- Which party provides each required notice (KYC, privacy, adverse action, funds-flow) to sellers?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/research/RES-20260903-86ede6.md`

- Internal support: **Facts** — Known Facts Mosaic Relay wants to reduce seller onboarding time for a marketplace customer via a mobile-first flow. The proposed flow collects legal name, business type, tax ID, ownership details…

## Options or working recommendation

# Working recommendation

## Recommendation (not a durable decision)

Conditionally approve a limited US-only pilot, not an unrestricted production launch. Automatic approval is allowed only for sellers who satisfy every approved low-risk rule. All other cases route to trained manual review. Do not expand beyond the US assumption until geography and state coverage are confirmed.

## Proposed launch conditions

1. Data scope: collect legal name, seller type, tax ID, ownership and control-person details, government ID, payout-account details, and business explanation only when necessary for the seller type and risk assessment. Use the 25% ownership threshold for legal entities and also collect one control person. Verify identity, business, ownership, and payout account.
2. Screening and review: complete KYC/KYB, sanctions screening, and adverse-media screening before automatic approval and continue monitoring as required. Any sanctions hit, identity or ownership mismatch, high-risk geography, prohibited business, incomplete record, or failed payout verification routes to manual review. Document escalation and adverse-action procedures.
3. Approval rules: Product Operations (Rina Patel) publishes the field map and deterministic low-risk rules. AML Compliance (Marcus Chen) approves screening logic, escalation, reviewer training, and evidence retention. No silent or unexplained auto-approval.
4. Disclosures: Mosaic Relay provides KYC, payments, privacy, and funds-flow notices; the marketplace provides seller-facing onboarding disclosures. Confirm the contract allocation and show notices at or before collection, before payout, and at denial or other adverse action as applicable.
5. Privacy and retention: provide the applicable privacy notice at or before collection, minimize access to government-ID and bank data, define vendor/controller roles, and approve a retention schedule by data element with deletion ownership. Use the regulatory minimum only after jurisdiction-specific verification.
6. Regulated actor: before launch, confirm whether Mosaic Relay, the marketplace, or a bank/processor is the regulated actor and confirm licenses, agent status, AML-program ownership, and funds-control responsibilities.
7. Marketing: do not present the 25% abandonment reduction as guaranteed. Use it only with competent substantiation or label it clearly as a goal or projection.

## Assumptions and missing facts

This recommendation assumes US-only operations, mixed seller types, a shared responsibility split, a 25% UBO threshold, and regulatory-minimum retention. Confirm specific states, non-US sellers, the regulated actor, exact risk data sources, retention periods, and notice allocation before launch. All research authorities are unverified leads because no public source was retrieved.

## Owners

Rina Patel owns the product field map, UX notices, and launch evidence. Marcus Chen owns AML screening, review operations, and escalation evidence. Legal owns final source verification and the launch decision.

## Next counsel action

Approve the final response.

## Work product links

- Draft: [US-only first-pass launch review — mobile-first marketplace seller onboarding flow](03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/work-product/draft/us-only-first-pass-launch-review-mobile-first-marketplace-seller-531d31.md)
- Final: [US-only first-pass launch review — mobile-first marketplace seller onboarding flow](03_Matters/mosaic-relay-ux-test-01-marketplace-seller-onboarding-refresh-724266/work-product/final/us-only-first-pass-launch-review-mobile-first-marketplace-seller-531d31-41be52.md)
