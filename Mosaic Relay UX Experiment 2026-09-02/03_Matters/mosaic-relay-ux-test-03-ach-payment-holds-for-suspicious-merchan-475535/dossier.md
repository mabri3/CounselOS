---
matter_id: MAT-20260902-475535
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-03-ach-payment-holds-for-suspicious-merchan-475535/dossier-revisions/DOS-20260902-4fa065.md
updated_at: '2026-09-02T14:53:25+00:00'
content_hash: 4cb930d64e14edee3a3a107f1bd7656b962e3162415c262c332283d236730281
---
# Matter dossier

## Matter summary

Mosaic Relay, a B2B payment-infrastructure provider, wants to implement an automated control that pauses ACH debits, credits, and seller payouts when transaction-risk signals exceed a threshold. The system would place a temporary 24-hour hold (with risk-manager-approved extensions), show merchants a generic explanation, and create an investigation task for Payment Operations. Counsel is involved because the control implicates NACHA Operating Rules, potential Regulation E exposure for consumer-originated payments, UDAAP risks from generic explanations, and money-transmission licensing perimeter questions. The company is fictional and the launch timing is not yet fixed.

## Decision question

Can Mosaic Relay implement automated 24-hour holds (with extensions) on ACH transactions and seller payouts without violating Regulation E, NACHA rules, or UDAAP prohibitions, and without triggering money-transmission licensing obligations, given that the company does not take custody of funds and the consumer/B2B mix is not yet confirmed?

## Material facts

- Mosaic Relay wants an automated control that pauses ACH debits, credits, and seller payouts when transaction-risk signals exceed a threshold.
- The control would place a temporary hold, show the merchant a generic explanation, and create an investigation task for Payment Operations.
- Signals may include sudden volume growth, account takeover indicators, return rates, sanctions-screening matches, and mismatches between merchant profile and transaction behavior.
- The control would operate continuously, with an initial hold of 24 hours and extensions approved by a risk manager.
- The company wants to reduce fraud losses and avoid sending funds that may later be returned.
- The control would not be described as a legal determination, and funds would be released when review is complete or the transaction is confirmed legitimate.
- Mosaic Relay is not a bank, does not hold deposits, and relies on regulated partners for parts of the payment chain.
- Which jurisdictions do the merchants, payers, and recipients sit in? This drives which ACH rules (e.g., NACHA), Reg E, and state money-transmission laws apply. — Not sure yet
- When a hold is placed, do the funds stay with the acquiring/ACH partner, or does Mosaic Relay take custody of them? — Not sure yet
- Are any of these consumer-originated payments, or is this B2B only? — Not sure yet
- What is the intended maximum hold period and how are extensions handled? — 24 hours with risk-manager-approved extensions
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- Mosaic Relay does not itself hold or take custody of the held funds; holds are implemented through partner/acquiring arrangements.
- The control applies to ACH transactions in the US governed by NACHA Operating Rules.
- Holds are temporary and funds are ultimately released or returned consistent with the underlying transaction.

## Issues and workstreams

- Money-transmission licensing perimeter: whether pausing/holding funds creates custody or transmission exposure
- NACHA Operating Rules compliance for holds, returns, and notice
- Reg E / unauthorized-debit and consumer-protection exposure for consumer-originated payments
- Unfair, deceptive, or abusive acts or practices (UDAAP) risk from generic explanations and hold mechanics
- Contractual obligations to acquiring and ACH partners regarding holds and escalation
- Recordkeeping and complaint-handling obligations

## Open questions

- **Consumer vs. B2B scope**: Are any of the ACH transactions consumer-originated (e.g., consumer bill payments, P2P transfers), or is this strictly B2B? This determines whether Regulation E applies.
- **Fund custody and control**: When a hold is placed, do the funds remain with the acquiring/ACH partner, or does Mosaic Relay take custody or control? This drives money-transmission analysis.
- **Maximum hold period and extension criteria**: What is the longest permissible hold, and what standards govern risk-manager extensions? Indefinite or open-ended holds create higher legal risk.
- **Notice content and timing**: What specific information will the generic explanation contain, and when will it be provided? Vague or misleading notices create UDAAP exposure.
- **Segregated accounts**: Are held funds segregated or commingled? This affects both money-transmission and consumer-protection analysis.

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-03-ach-payment-holds-for-suspicious-merchan-475535/research/RES-20260902-821848.md`

- Internal support: **Mosaic Relay Ux Test 03 Ach Payment Holds For Suspicious Merchan Bbdcc0** — LEGAL WORK PRODUCT — ACH PAYMENT HOLDS FOR SUSPICIOUS MERCHANT ACTIVITY Status: Working draft for lawyer review. This document is legal analysis, not a recorded business decision. Executive…
- Internal support: **Facts** — Known Facts Mosaic Relay wants an automated control that pauses ACH debits, credits, and seller payouts when transaction-risk signals exceed a threshold. The control would place a temporary hold, show…

## Options or working recommendation

# Recommendations

No recommendation has been drafted yet.

## Next counsel action

Run or supervise first-pass research.

## Work product links

- Draft: [Mosaic Relay UX Test — 03 — ACH Payment Holds for Suspicious Merchant Activity response](03_Matters/mosaic-relay-ux-test-03-ach-payment-holds-for-suspicious-merchan-475535/work-product/draft/mosaic-relay-ux-test-03-ach-payment-holds-for-suspicious-merchan-628fa5.md)
