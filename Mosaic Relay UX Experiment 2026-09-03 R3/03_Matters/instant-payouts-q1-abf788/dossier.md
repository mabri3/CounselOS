---
matter_id: MAT-20260904-abf788
record_type: dossier
editable: true
source_revision: 03_Matters/instant-payouts-q1-abf788/dossier-revisions/DOS-20260905-83a123.md
updated_at: '2026-09-05T23:06:55+00:00'
content_hash: 1f96b5d1085f7d80d1f3673e58f891912a8849eca1db0da68067cb4bbc984d20
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment infrastructure company, is building an Instant Payouts feature for marketplace sellers with a Q1 launch target. The onboarding design collects only email and bank account at signup, deferring full identity verification until a seller crosses $3,000 in cumulative payouts. Engineering selected $3,000 believing it is "the BSA threshold." Counsel is evaluating whether this deferred-identity design is legally supportable or must be redesigned before launch.

## Decision question

Can Mosaic Relay ship Instant Payouts for marketplace sellers in Q1, given the proposed onboarding (email + bank account only, full identity deferred to $3,000 cumulative payouts), ACH payouts initiated by Mosaic Relay via the bank partner, USDC payouts to international sellers (Mexico) via Circuit, nightly batch OFAC screening, W-9-only business onboarding without owners, and a public $3,000 verification progress bar?

## Material facts

- Sellers onboard with email and bank account only; full identity info is collected only after a seller crosses $3,000 in cumulative payouts.
- Engineering selected the $3,000 cumulative payout threshold because they believe it is 'the BSA threshold.'
- Payouts go out via the bank partner's ACH rails, and Mosaic Relay is the party initiating them.
- International sellers can elect payout in USDC through Circuit (a licensed exchange Mosaic Relay contracts with); the seller provides a wallet address that may be an exchange account or their own wallet.
- OFAC screening runs nightly in batch against the day's payouts; real-time screening adds ~400ms and would undermine the 'instant' promise.
- Business sellers upload a W-9 and Mosaic Relay takes the signer's name; Mosaic Relay is not asking for owners because the UI is already 11 screens.
- Sellers are shown a progress bar reading '$1,240 of $3,000 until full verification.'
- The bank partner has seen the deck.
- What is the legal basis for the $3,000 cumulative payout threshold before collecting full identity? This is the foundation of the onboarding design and appears to rest on a misconception about 'the BSA threshold.' — It was purely an engineering/product choice, no legal basis confirmed
- What is Mosaic Relay's money transmission licensing posture for initiating these ACH payouts? — We operate as an agent / under the bank partner's license
- Which jurisdictions are the international sellers located in for the USDC payout option? — Asia
- Jurisdictions of the international sellers eligible for USDC payouts. — Mexico

## Assumptions

- Mosaic Relay is not a bank and does not hold deposits; the payout flow routes funds to sellers via the bank partner's ACH rails.
- The bank partner's review of the deck does not constitute a legal determination of Mosaic Relay's own compliance obligations.
- The $3,000 figure in the request is being treated by the requester as a compliance threshold, but its legal basis is unverified.
- Operating as an agent under the bank partner's license does not by itself resolve Mosaic Relay's own CIP/AML and sanctions obligations.
- The OFAC screening timing is effectively nightly batch after payouts are released, per the design.

## Issues and workstreams

- The $3,000 cumulative payout threshold is not a recognized BSA customer-identification threshold; there is no $3,000 BSA CIP trigger. Under BSA/AML, a money transmitter must collect CIP before establishing the account relationship, not after a payout threshold. Deferring identity collection until $3,000 is likely non-compliant.
- Operating as an agent under the bank partner's license does not resolve Mosaic Relay's own money transmission licensing posture for initiating ACH payouts, nor its own CIP/AML and sanctions obligations.
- OFAC screening in nightly batch against the day's payouts means payouts are released before screening completes, risking release of funds to sanctioned parties; screening must generally occur before funds are released/blocked.
- USDC payouts to international sellers (Mexico), including to self-hosted wallets, raise sanctions, AML, and virtual-asset money transmission licensing questions distinct from fiat ACH payouts.
- Not collecting beneficial owners for business sellers is a KYB/AML gap and may conflict with beneficial-ownership reporting obligations.
- Publicly displaying the $3,000 verification threshold via a progress bar may facilitate evasion and raises funds-flow/consumer disclosure concerns.

## Open questions

- Does Mosaic Relay's agent relationship with its bank partner extend to virtual-asset payouts, or does initiating USDC transfers to self-hosted wallets require separate money transmitter licenses in the US and Mexico?
- What is the legal status of USDC payouts to self-hosted wallets under Mexican law, and does Mexico require specific licensing or registration for virtual-asset service providers?
- Can OFAC screening be performed pre-release for USDC payouts without undermining the "instant" promise, given that self-hosted wallets lack the account-freeze controls available with exchange accounts?
- Does the $3,000 identity-collection threshold create a window during which sanctioned parties could receive USDC payouts before screening occurs?
- What are the beneficial-ownership and KYB requirements for business sellers receiving USDC payouts, and does the current W-9-only approach satisfy them?

## Research and source support

Latest review: `03_Matters/instant-payouts-q1-abf788/research/RES-20260905-4d88c1.md`

- Internal support: [Facts](03_Matters/instant-payouts-q1-abf788/facts.md) [source:SRC-3a9350fde282eecf6295|Start of document]
  Available excerpt:
  > # Known Facts
  > 
  > - Sellers onboard with email and bank account only; full identity info is collected only after a seller crosses $3,000 in cumulative payouts.
  > - Engineering selected the $3,000 cumulativ

## Options or working recommendation

# Recommendations

No recommendation has been drafted yet.

## Next counsel action

Redesign identity collection: collect CIP at onboarding, not at $3,000 payout threshold

## Work product links

No work product yet.
