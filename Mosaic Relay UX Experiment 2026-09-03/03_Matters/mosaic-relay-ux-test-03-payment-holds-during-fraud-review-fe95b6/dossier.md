---
matter_id: MAT-20260903-fe95b6
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-03-payment-holds-during-fraud-review-fe95b6/dossier-revisions/DOS-20260903-0e8641.md
updated_at: '2026-09-03T09:08:26+00:00'
content_hash: 9cc31bb844676dadcf00530b7fbfd791c14d6b6199dd9e73a8b1348b948ed077
---
# Matter dossier

## Matter summary

Mosaic Relay, a payments technology company, plans to implement a fraud-review control that temporarily holds merchant card and ACH proceeds when transaction-risk signals indicate possible fraud. The proposed UX displays a banner to the merchant, blocks payout for the affected amount, and allows the merchant to submit invoices or fulfillment evidence; Operations may then release the funds, extend the review, reverse the payment, or deactivate processing. Counsel is involved because the company needs to confirm lawful authority to hold funds, determine timing limits, establish disclosure and appeal requirements, and ensure compliance with card-network rules and money-transmission laws before the Product team launches an initial version in one quarter.

## Decision question

Can Mosaic Relay lawfully implement a one-quarter-launch fraud-review hold on merchant card and ACH proceeds that blocks payout pending investigation, and if so, what maximum hold periods, disclosure language, appeal rights, and funds-treatment rules must the design include to comply with contract law, card-network rules, ACH regulations, and money-transmission requirements?

## Material facts

- Mosaic Relay already calculates transaction risk scores for customers.
- Mosaic Relay already manages payout controls for customers.
- Proposed UX shows the merchant a banner explaining a review is in progress and prevents payout for the affected amount.
- The proposed UX lets the merchant submit invoices or fulfillment evidence during the review.
- Operations may release the funds, extend the review, reverse the payment, or deactivate processing.
- The hold applies to card and ACH proceeds.
- Product wants an initial version live in one quarter.
- Actors include the merchant, its customers, Mosaic Relay risk and operations teams, acquiring banks, processors, card networks, and fraud vendors.
- What is the proposed maximum hold period, and will it differ for card vs. ACH transactions? — Not decided yet
- What does the current merchant agreement permit regarding holds on proceeds? — Unknown — need to check
- May the held funds be used to cover chargebacks, returns, or fees? — Not decided yet
- Is a specific appeal process required for merchants to contest a hold? — Not decided yet
- When does the business need the legal answer? — Before a planned launch

## Assumptions

- Mosaic Relay does not hold deposits or operate as a bank; holds are of merchant proceeds pending payout, not customer deposits.
- The merchant agreement is the primary source of contractual hold authority and will need to permit the hold.
- U.S. scope for this initial version, consistent with the company profile.
- The merchant agreement is the primary source of contractual hold authority and will need to permit the hold; its current terms are unverified.

## Issues and workstreams

- Lawful authority to hold merchant proceeds pending fraud review (contractual vs. regulatory basis)
- Timing limits on holds for card vs. ACH and any maximum hold period
- Treatment of held funds (whether they can be used to cover chargebacks, returns, or fees)
- Required customer-facing disclosure language and notice timing
- Whether a specific appeal process is required
- Card network and processor rules governing holds, reversals, and deactivation
- Money transmission / funds-flow implications of holding proceeds

## Open questions

- What does the current merchant agreement permit regarding holds, and does it require amendment to authorize the proposed fraud-review hold?
- What maximum hold period will Mosaic Relay set for card versus ACH transactions, given that network rules and NACHA requirements may differ?
- May held funds be used to cover chargebacks, returns, or fees during the review period, or must they remain segregated and untouched?
- What specific appeal process and evidence-submission rights must be provided to merchants to satisfy due-process and card-network requirements?
- Does holding merchant proceeds pending review trigger any state money-transmission licensing or safeguarding requirements beyond Mosaic Relay's current compliance posture?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-03-payment-holds-during-fraud-review-fe95b6/research/RES-20260903-fe72ae.md`

- Internal support: **First Pass Legal Analysis Payment Holds During Fraud Review 0C2Cc6 64F05C** — 8. What would change this Working assumption (A3 — merchant agreement authority): If the merchant agreement already contains an express hold right, the gating dependency resolves and the design can…
- Internal support: **First Pass Legal Analysis Payment Holds During Fraud Review 0C2Cc6** — 8. What would change this Working assumption (A3 — merchant agreement authority): If the merchant agreement already contains an express hold right, the gating dependency resolves and the design can…

## Options or working recommendation

# Recommendations

No recommendation has been drafted yet.

## Next counsel action

Approve the final response.

## Work product links

- Draft: [First-Pass Legal Analysis — Payment Holds During Fraud Review](03_Matters/mosaic-relay-ux-test-03-payment-holds-during-fraud-review-fe95b6/work-product/draft/first-pass-legal-analysis-payment-holds-during-fraud-review-0c2cc6.md)
- Final: [First-Pass Legal Analysis — Payment Holds During Fraud Review](03_Matters/mosaic-relay-ux-test-03-payment-holds-during-fraud-review-fe95b6/work-product/final/first-pass-legal-analysis-payment-holds-during-fraud-review-0c2cc6-64f05c.md)
