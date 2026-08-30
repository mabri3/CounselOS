---
matter_id: MAT-DEMO-RELAY
record_type: recommendations
---
# Recommendation

Relay is moving about 280,000 customers from credential-based bank links to OAuth and bank APIs. The current consent is too broad, does not separate necessary account features from proposed marketing and lending uses, and gives no clear deletion period after disconnection.

Recommended path: let existing connections continue for their current uses during a short migration, then obtain a clear, purpose-specific authorization when each customer next reauthenticates. Do not treat continued use as permission for new data uses.

Why this needs counsel now: Product must choose between reauthorization at the next bank-required event or a 90-day deadline for all customers. The choice affects migration cost and how long the old consent remains in use; the aggregator contract also renews on September 15.

## Recommended path

1. Continue existing connections during a short migration period when the bank permits it, but do not add new uses during that period.
2. At reauthentication, show the data categories, selected product purposes, frequency, duration, revocation method, and the parties involved.
3. Treat ACH verification, requested balance display, categorization, fraud prevention, and overdraft-buffer eligibility as distinct stated purposes in the permission record.
4. Exclude cross-product marketing and lending segmentation from the required connection permission. If the business keeps this proposal, present it as a separate optional choice after linking.
5. After disconnection, stop new collection immediately. Delete raw and derived transaction data after 30 days unless a documented legal, fraud, dispute, or accounting need supports a defined exception.
6. Add contract terms for purpose limits, security, subcontractors, incident notice, deletion certification, audit evidence, and migration assistance.

## Counsel decision needed

Choose between:

- **Option A — Recommended:** Permit existing connections to continue without new uses, then obtain affirmative permission at the next required reauthentication.
- **Option B — More conservative:** Require all active users to reauthenticate within 90 days and pause data refresh after that date.

The choice affects migration cost and the period during which the old broad consent remains in use. It does not change the recommendation to separate optional marketing and lending uses.
