---
request_id: REQ-20260904-a360ee
matter_id: MAT-20260904-abf788
original_text_preserved: true
immutable: true
received_at: '2026-09-04T03:42:55+00:00'
requester: Product
business_objective: 'From: Priya, PM — Marketplace Payments

  Subject: Instant Payouts — can we ship Q1?


  We''re launching Instant Payouts for marketplace sellers. Plan:


  Sellers onboard with email + bank account only. We collect full identity '
requested_launch_date: '2026-09-05'
urgency: normal
---
# Original Request

From: Priya, PM — Marketplace Payments
Subject: Instant Payouts — can we ship Q1?

We're launching Instant Payouts for marketplace sellers. Plan:

Sellers onboard with email + bank account only. We collect full identity info once a seller crosses $3,000 in cumulative payouts — engineering picked that because it's "the BSA threshold."
Payouts go out via our bank partner's ACH rails. We're the ones initiating.
International sellers can elect payout in USDC through Circuit (a licensed exchange we contract with); the seller gives us a wallet address, which may be an exchange account or their own wallet.
OFAC screening runs nightly in batch against the day's payouts. Real-time screening adds ~400ms and tanks the "instant" promise.
Business sellers upload a W-9 and we take the signer's name. We're not asking for owners — the UI is already 11 screens.
We show sellers a progress bar: "$1,240 of $3,000 until full verification."

Bank partner has seen the deck. Can we ship Q1?
