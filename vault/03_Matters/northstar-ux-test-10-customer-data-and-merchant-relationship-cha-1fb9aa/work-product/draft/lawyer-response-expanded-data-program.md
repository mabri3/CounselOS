---
record_type: lawyer_response
matter_id: MAT-20260830-1fb9aa
status: draft
privilege: privileged_and_confidential
---
# Lawyer Response — Expanded Data Program (Tiered Launch)

Matter: Northstar UX Test — 10 — Customer Data and Merchant Relationship Changes
To: Product (requesting team)
From: Legal (Brian Harris, matter owner)
Status: Draft response — privileged and confidential. Not sent. Separate from any recorded decision.

---

Thank you for the request to expand Northstar Pay's use of customer and transaction data for product analytics, fraud prevention, personalized offers, and merchant performance reporting, with a goal of beginning the data program this quarter. We have reviewed the proposal against our existing privacy notices, customer terms, merchant agreements, and vendor and lending-partner arrangements, and we can support a launch this quarter for a defined subset of the program, provided the conditions below are met. The remainder of the program is either gated pending specific legal work or rejected for this launch. This response explains what can move now, what cannot, and what we need from your team to keep the timeline.

## What can launch this quarter

We can support four uses this quarter: internal product analytics, fraud prevention, underwriting improvements, and aggregated merchant performance dashboards. These are the uses most likely to fit within our existing privacy notices and contracts, but each is subject to a verification gate rather than a blank check.

Internal product analytics — analysis of purchase categories, repayment history, device information, approximate location, and app activity to improve the product — is likely within an internal-operations purpose and carries the lowest new-purpose risk. Before launch, we need to confirm the current privacy notice actually covers analytics on these data types, and we need a data map confirming the fields actually collected. Sensitive fields and precise location should be minimized, access should be role-based, and retention must follow a documented schedule rather than an indefinite default.

Fraud prevention using transaction and device signals is a widely recognized compatible purpose and typically does not require opt-in consent, but state law and our notice language still matter. The gate here is confirming the fraud vendor operates under written instructions with restrictions on secondary use, and that retention is tied to dispute and litigation needs.

Underwriting improvements using expanded data inputs are launchable with care, but this is not automatic. Each input and any changed credit term requires model, fairness, accuracy, adverse-action, and lending-partner review. Use of location, device, and app-activity data in credit decisions raises fair-lending, accuracy, and adverse-action considerations, and we must confirm no state in our live footprint (California, Colorado, Georgia, Illinois, New York, Texas, Washington) restricts the data types used. Compliance sign-off on model inputs and the adverse-action flow is required before launch.

Aggregated merchant performance dashboards are launchable as the default merchant reporting experience, but only pending confirmation of our notice language, de-identification and aggregation standards (no re-identification, minimum cohort sizes), and contract terms. Merchants should receive aggregated or de-identified reporting by default; this is a default, not a permanent commitment, and it is subject to those checks.

## What is gated

Three proposed uses are held pending specific legal work and cannot launch this quarter as proposed: personalized offers for new financing products, merchant promotions, and detailed reporting for strategic merchants.

Personalized offers tailored using repayment history, purchase categories, and app activity are a new purpose not covered by our narrower existing notice, and we do not assume existing consent covers a new purpose. Cross-context behavioral advertising and sensitive-data rules — particularly in California and Colorado — may require opt-in or opt-out. Before launch we need an updated privacy notice, a live in-app consent and opt-out flow, a suppression workflow that honors customer choices, and a state-law mapping for our live footprint.

Merchant promotions funded by merchants and surfaced to customers based on Northstar Pay data combine the new-purpose problem with merchant-facing sharing. They require a merchant agreement amendment defining permitted use, plus customer notice and choice, with opt-outs honored across channels.

Detailed reports for strategic merchants require a separate legal review of the purpose, the exact data fields, the contract, customer notice, access controls, and state limits. Identifiable repayment history should not be included absent a documented legal basis and customer choice. If you can tell us which strategic merchants would receive detailed reports and the exact fields involved, we can scope that review now.

## What is rejected for this launch

Two uses are rejected for this launch. Merchants may not use Northstar Pay transaction data — including identifiable repayment history — for their own marketing. Company policy prohibits merchants or advertising partners using identifiable repayment history or sensitive customer data for unrelated marketing without a documented legal basis and the required customer choice, and no such basis or choice mechanism exists today. If the business wants to pursue this, it should be treated as a new matter with a full legal review, not as a launch feature. Similarly, sharing data with advertising partners for targeting or measurement is out of scope for this launch; it would require written agreements with use restrictions, honored customer opt-outs, a notice update, and state-law clearance.

## Required notices and agreements

Before the gated uses can launch, we need: an updated privacy notice; an in-app consent and opt-out flow for personalized offers and merchant promotions; merchant agreement amendments covering permitted-use clauses, detailed-reporting terms, and the commercial program's term changes; vendor agreements placing analytics, fraud, and any future advertising partners under written instructions with use restrictions; alignment with lending partners on data sharing (the partner map is still being finalized); and a documented retention schedule for the new datasets. For the Tier 1 uses, the gates are narrower: notice text review, vendor agreement check, compliance sign-off on underwriting model inputs, and aggregation standards for merchant dashboards.

## Merchant and customer term changes

The proposed commercial program — changes to merchant underwriting rules, pricing, settlement timing, and access to customer data — is a separate workstream from the data gates. Whether we can make these changes unilaterally depends on the amendment and change-of-terms provisions in each merchant agreement; unilateral changes risk breach and state unfair-practices exposure. We need a contract-by-contract review of amendment rights and notice periods before the program is announced to merchants, and older templates may require renegotiation.

Any material change to customer-facing terms, sharing, or retention requires Alex Morgan's approval per company policy, plus updated notice delivery and, where the change is material to existing customers, advance notice and possibly re-consent. That approval track is separate from this launch decision.

## Assumptions, missing facts, and unverified leads

Our analysis rests on assumptions that should be verified: that the current privacy notice and customer terms do not clearly cover personalized offers, merchant promotions, or detailed merchant reporting; that "approximate location" is not precise geolocation (if it is, sensitive-data treatment applies); that Northstar Pay is not exempt from applicable state privacy laws in its live states; that existing merchant agreements contain standard amendment provisions; and that analytics and fraud vendors operate under written-instruction service-provider agreements.

Key missing facts: the actual text of the current privacy notice, customer terms, merchant agreement template, and lending-partner data provisions; which strategic merchants would receive detailed reports and the exact fields; confirmation of the state-by-state product and partner matrix for the live footprint; current retention periods for analytics and reporting datasets; and which uses Product actually needs this quarter.

Unverified leads requiring last-mile legal verification: state privacy-law applicability and sensitive-data and opt-in rules for California, Colorado, and the other live states; whether aggregated merchant dashboards satisfy de-identification standards under applicable state law; the amendment-rights language in current merchant and lending-partner contracts; and whether the existing notice's analytics and fraud language is broad enough for the Tier 1 uses as drafted.

## What we need from Product

To keep the quarter achievable: confirm which uses you actually need this quarter (this scopes the Tier 1 launch); provide the data map of fields actually collected; identify the strategic merchants and fields for any detailed reporting; and route the commercial program's merchant term changes to us now so the contract review can run in parallel. We will begin the notice text review, vendor agreement check, and state-law verification on our side.

This response reflects our current review and is based on the recommendation, privacy and data memo, and draft decision record in this matter. It is a draft for internal review, has not been sent, and is separate from any recorded decision; final approval of any customer-facing term changes rests with Alex Morgan.
