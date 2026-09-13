---
matter_id: MAT-DEMO-RELAY
record_type: dossier
editable: true
updated_at: '2026-08-28T20:00:00+00:00'
---
# Matter dossier

## Summary

Relay is moving about 280,000 customers from credential-based bank connections to OAuth and bank APIs. Product prefers to let existing connections continue until a bank requires reauthentication, while Growth wants to use two years of transaction history for card and lending offers. The current consent does not clearly disclose these uses or set a deletion period after disconnection. Legal guidance is needed before the aggregator contract renews on September 15.

## Decision question

Should Relay let existing bank connections continue until each customer must reauthenticate, or require all 280,000 customers to reauthorize within 90 days? In either case, should marketing and lending uses require separate consent, and should disconnected-account data be deleted after 30 days?

## Open questions

- Which institutions still use stored credentials?
- Can customers keep core account functions after refusing marketing use?
- Which derived transaction-data sets can be deleted within 30 days?
- Can the aggregator certify deletion and identify its subcontractors?

## Research

Latest review: `03_Matters/relay-open-banking/research/section-1033-and-consent-memo.md`

## Work product

No work product yet.
