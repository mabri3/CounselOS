---
request_id: REQ-20260903-3031c7
matter_id: MAT-20260903-fe95b6
original_text_preserved: true
immutable: true
received_at: '2026-09-03T08:59:56+00:00'
requester: Product
business_objective: Mosaic Relay wants to add a payment-operations control that temporarily
  holds a merchant’s card or ACH proceeds when transaction-risk signals indicate possible
  fraud. The proposed user experience shows the merchant a ban
requested_launch_date: null
urgency: normal
---
# Original Request

Mosaic Relay wants to add a payment-operations control that temporarily holds a merchant’s card or ACH proceeds when transaction-risk signals indicate possible fraud. The proposed user experience shows the merchant a banner explaining that a review is in progress, prevents payout for the affected amount, and lets the merchant submit invoices or fulfillment evidence. Operations may release the funds, extend the review, reverse the payment, or deactivate processing. The actors are the merchant, its customers, Mosaic Relay risk and operations teams, acquiring banks, processors, card networks, and fraud vendors. The product team wants an initial version live in one quarter.

Known facts are that Mosaic Relay already calculates transaction risk scores and manages payout controls for customers. We have not determined the maximum hold period, whether rules will differ for card and ACH transactions, or whether the held funds can be used to cover chargebacks, returns, or fees. We also do not know what the merchant agreement currently permits, what customer-facing notices are required, or whether Mosaic Relay must provide a specific appeal process. Please advise on lawful hold authority, timing limits, disclosure language, treatment of funds, appeal rights, and any regulatory or network requirements before we approve the design.
