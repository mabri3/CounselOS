---
request_id: REQ-MAT-DEMO-RELAY
matter_id: MAT-DEMO-RELAY
immutable: true
original_text_preserved: true
received_at: '2026-08-05T16:00:00+00:00'
requester: Omar Haddad
---
# Original Request

We are moving Relay from credential-based bank linking to OAuth and bank APIs. About 280,000 customers have an active linked account today. We use transaction data to verify an account for ACH, show balances, categorize spending, detect possible fraud, and determine eligibility for our optional overdraft buffer. The current connection screen says we use the data to “provide and improve Relay services.” It does not list each use or say how long we keep data after a user disconnects.

Our aggregator wants us to adopt its new authorization screen and migrate existing users when their connection next fails. Product would prefer a quieter migration: keep old connections running, show a reauthentication prompt only when a bank requires it, and treat continued use as acceptance of the new data terms. Growth also wants to use two years of historical transaction data to build customer segments for offers from our card and lending teams. That use is not needed to provide account linking or the overdraft buffer.

The CFPB personal financial data rights rule is part of the discussion, but the team has heard that its compliance dates were stayed and the rule may change. We do not want to build a flow that becomes obsolete, but we also do not want regulatory uncertainty to stop the API migration. Can Legal recommend a consent and reauthentication approach that works now, identify which data uses should be separated or stopped, and give us a retention rule for disconnected accounts? The aggregator contract renewal is September 15, so Procurement also needs any required privacy, security, deletion, and audit terms before then.
