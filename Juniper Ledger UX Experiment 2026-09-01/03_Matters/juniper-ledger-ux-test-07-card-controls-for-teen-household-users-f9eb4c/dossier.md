---
matter_id: MAT-20260902-f9eb4c
record_type: dossier
editable: true
source_revision: 03_Matters/juniper-ledger-ux-test-07-card-controls-for-teen-household-users-f9eb4c/dossier-revisions/DOS-20260902-490102.md
updated_at: '2026-09-02T07:32:32+00:00'
content_hash: 953a64d702051131a6a081801c6c36e0c8721898da222a0ec2479f786572d282
---
# Matter dossier

## Matter summary

Juniper Ledger, a fintech that operates through sponsor bank Cedar Harbor Bank, N.A., is designing a household feature that would let an adult primary account holder issue a virtual or physical card to a teenager who may be under 18. The adult would set spending categories and limits, view transactions, and approve merchants; the teen could make purchases and receive refunds but could not initiate ACH or account-to-account transfers. Counsel is involved because issuing payment cards to minors implicates age and consent rules, cardholder status, COPPA and financial privacy law, dispute liability, and sponsor-bank and card-network requirements. Product wants research-ready requirements for a limited beta targeted for next summer.

## Decision question

Can Juniper Ledger launch a limited beta next summer that issues restricted debit cards to teenagers under an adult's primary account, and if so, must the teen be structured as an authorized user rather than a customer, what minimum age applies, what consent and privacy notices are required, and how must disputes, marketing, and data use be handled to satisfy COPPA, Reg E, GLBA/Reg P, and Cedar Harbor's program rules?

## Material facts

- The adult is the primary account holder on the Juniper Ledger account.
- The teenager may be under 18.
- The proposed flow requires the adult to invite the teenager, set spending categories and limits, view transactions, and approve selected merchants.
- The teenager could use the card for purchases and receive refunds, but could not initiate ACH or account-to-account transfers.
- Product wants research-ready requirements for a limited beta next summer.
- Juniper Ledger does not hold a banking charter and relies on sponsor bank Cedar Harbor Bank, N.A. for deposit and payment services.
- Will the teenager be a Juniper Ledger customer in their own right, or an authorized user on the adult's account? — Not decided yet
- Whether the teenager is a Juniper Ledger customer in their own right or an authorized user on the adult's account is not yet decided.
- What is the proposed minimum age for the teenager to receive a card? — Not decided yet
- How will the adult's consent be collected and documented for issuing a card to the teenager? — Not decided yet
- The proposed minimum age for the teenager to receive a card is not yet decided.
- How the adult's consent will be collected and documented for issuing a card to the teenager is not yet decided.
- Who should receive privacy notices (GLBA/Reg P and COPPA) for the teenager? — Not decided yet
- May marketing, transaction data, and behavioral analytics include the teenager? — Not decided yet
- Who should receive privacy notices (GLBA/Reg P and COPPA) for the teenager is not yet decided.
- Whether marketing, transaction data, and behavioral analytics may include the teenager is not yet decided.
- How will disputes and unauthorized use be handled for the teenager's card? — Not decided yet
- How disputes and unauthorized use will be handled for the teenager's card is not yet decided.
- Have Cedar Harbor's program requirements or card-network age rules been reviewed for this feature? — Not reviewed yet
- Cedar Harbor's program requirements and card-network age rules have not yet been reviewed for this feature.
- What is the target date for the limited beta? — next summer
- The target date for the limited beta is next summer.

## Assumptions

- The feature is limited to U.S. customers, consistent with Juniper Ledger's U.S.-only operations.
- The teenager is a minor under 18 and not an adult co-owner of the account.
- The card is issued under the sponsor bank's program and card-network rules apply.
- A limited beta next summer implies a target launch window of roughly mid-2027.
- The feature will be offered to U.S. customers only, consistent with Juniper Ledger's current footprint.
- The sponsor bank (Cedar Harbor) and card networks will need to approve the design and may impose their own age and program requirements.
- COPPA will apply only if the minimum age is set at or below 13; if the minimum age is 13 or above, COPPA's direct-child provisions are less likely to apply.
- The sponsor bank Cedar Harbor Bank, N.A. will need to approve the program design and may impose its own age and cardholder requirements.
- Card-network rules (e.g., Visa/Mastercard age and authorized-user requirements) will apply to the physical and virtual cards.
- The sponsor bank (Cedar Harbor) and card networks will need to approve the design and may impose age and disclosure requirements.
- The teenager's card is a debit-style card tied to the adult's account rather than a separate credit product.
- The feature will be structured so the adult remains the primary account holder and bears primary liability, with the teenager as an authorized user rather than a customer in their own right (to be confirmed by product).
- The limited beta will be U.S.-only, consistent with Juniper Ledger's current customer base.

## Issues and workstreams

- Age and consent: minors generally cannot enter binding contracts, so card issuance to a teenager requires adult consent and careful structuring of who is the cardholder and who bears liability.
- Account/cardholder status: whether the teenager is a customer of Juniper Ledger or an authorized user on the adult's account changes KYC, privacy, and disclosure obligations.
- Privacy: COPPA applies to online collection of personal information from children under 13; state privacy laws and GLBA/Reg P may also apply depending on data flows.
- Marketing and analytics: use of a minor's transaction and behavioral data for marketing raises COPPA and state privacy concerns.
- Dispute and unauthorized-use liability: Reg E and card-network rules allocate liability, but the teenager's status and the adult's control affect who bears loss.
- Disclosures: required cardholder and privacy disclosures depend on whether the teenager is a cardholder and who receives them.
- Sponsor bank and card-network rules: Cedar Harbor's program requirements and network age rules may constrain the design.

## Open questions

- Will the teenager be a Juniper Ledger customer in their own right or an authorized user on the adult's account? (Not decided; this drives KYC, privacy, disclosure, and liability analysis.)
- What minimum age will Product set, and will any participants be under 13? (Under-13 triggers COPPA verifiable parental consent; 13+ may avoid COPPA but still implicates state minor-privacy laws.)
- How will the adult's consent be collected and documented, and who receives privacy notices (GLBA/Reg P and, if applicable, COPPA direct notice)?
- How will disputes and unauthorized use be allocated between the adult, the teen, Juniper Ledger, and Cedar Harbor under Reg E and card-network rules?
- Have Cedar Harbor's program requirements and card-network age rules been reviewed and confirmed for this design? (Not yet reviewed; sponsor approval is a gating item.)

## Research and source support

Latest review: `03_Matters/juniper-ledger-ux-test-07-card-controls-for-teen-household-users-f9eb4c/research/RES-20260902-90702d.md`

- Internal support: **Facts** — Known Facts The adult is the primary account holder on the Juniper Ledger account. The teenager may be under 18. The proposed flow requires the adult to invite the teenager, set spending categories…
- Internal support: **Juniper Ledger Ux Test 07 Card Controls For Teen Household Users 537A70 0F41D7** — Teen household card beta — research-ready requirements Executive summary Juniper Ledger can test a teen-card beta if it first fixes the operating model and limits the beta to a clearly defined age…
- Internal support: **Juniper Ledger Ux Test 07 Card Controls For Teen Household Users 537A70** — Teen household card beta — research-ready requirements Executive summary Juniper Ledger can test a teen-card beta if it first fixes the operating model and limits the beta to a clearly defined age…

## Options or working recommendation

No recommendation has been drafted yet.

## Next counsel action

Review the working ask and answer the next material question.

## Work product links

No work product yet.
