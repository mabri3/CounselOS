---
matter_id: MAT-20260903-97c9c3
record_type: recommendations
current_recommendation_version_id: REC-20260903-c28507
recommendation_versions:
- version_id: REC-20260903-c28507
  number: 1
  content: '# Recommendation


    ## Proposed approval path

    Approve a gated US pilot only after Product and Mosaic Relay close the two open
    facts: consumer versus business account mix and fixed versus variable debit amount.
    Treat consumer accounts as in scope until confirmed otherwise.


    ## Authorization

    Use a clear recurring ACH authorization. State the debit amount or method for
    calculating it, cadence, start date, duration, account identifier, and how the
    user can cancel. Capture affirmative consent with an electronic record that can
    be reproduced and audited. Preserve the authorization and proof of assent for
    at least two years, with access controls and an audit trail.


    ## Recurring debits and notices

    For a fixed monthly amount, send confirmation before the first debit and after
    material changes. For variable amounts, send the required advance notice before
    the first debit and before each later debit, with the amount/date or a clear calculation
    method. Do not debit outside the authorized cadence or amount method.


    ## Cancellation and stop controls

    The platform must expose a simple cancellation path and time-stamp the request.
    The platform forwards the cancellation to Mosaic Relay, which executes the stop
    before the next eligible debit. Reconcile cancellation events to the debit queue,
    alert on failures, and confirm cancellation to the user. Support consumer stop-payment
    and error-resolution handling where Reg E applies.


    ## Returns, unauthorized activity, and retries

    Classify returns. Never reinitiate R07, R10, or R29 without fresh authorization.
    Limit retries for non-revocation returns, document each attempt, and stop on an
    unauthorized claim. Provide an investigation and refund/escalation path for unauthorized
    returns and preserve related evidence.


    ## Operational evidence and owners

    Product owns the user journey, notices, and cancellation UI. Mosaic Relay owns
    ODFI-side execution, return classification, and stop confirmation. Legal owns
    the requirement checklist and approval decision. Maintain immutable event logs
    for consent, notice, debit, cancellation, return, retry, and resolution.


    ## Launch gate

    Do not launch the pilot until the account mix and amount model are confirmed,
    the authorization screen and cancellation flow pass an end-to-end test, notice
    timing is evidenced, retry rules are configured, and the 2-year reproducible record
    is verified. This is a recommendation for counsel review, not a durable decision.'
  actor: Lawyer
  origin: lawyer_edit
  created_at: '2026-09-03T16:50:29+00:00'
recommendation_updated_at: '2026-09-03T16:50:29+00:00'
recommendation_updated_by: Lawyer
proposed_recommendation: null
---
# Recommendation

## Proposed approval path
Approve a gated US pilot only after Product and Mosaic Relay close the two open facts: consumer versus business account mix and fixed versus variable debit amount. Treat consumer accounts as in scope until confirmed otherwise.

## Authorization
Use a clear recurring ACH authorization. State the debit amount or method for calculating it, cadence, start date, duration, account identifier, and how the user can cancel. Capture affirmative consent with an electronic record that can be reproduced and audited. Preserve the authorization and proof of assent for at least two years, with access controls and an audit trail.

## Recurring debits and notices
For a fixed monthly amount, send confirmation before the first debit and after material changes. For variable amounts, send the required advance notice before the first debit and before each later debit, with the amount/date or a clear calculation method. Do not debit outside the authorized cadence or amount method.

## Cancellation and stop controls
The platform must expose a simple cancellation path and time-stamp the request. The platform forwards the cancellation to Mosaic Relay, which executes the stop before the next eligible debit. Reconcile cancellation events to the debit queue, alert on failures, and confirm cancellation to the user. Support consumer stop-payment and error-resolution handling where Reg E applies.

## Returns, unauthorized activity, and retries
Classify returns. Never reinitiate R07, R10, or R29 without fresh authorization. Limit retries for non-revocation returns, document each attempt, and stop on an unauthorized claim. Provide an investigation and refund/escalation path for unauthorized returns and preserve related evidence.

## Operational evidence and owners
Product owns the user journey, notices, and cancellation UI. Mosaic Relay owns ODFI-side execution, return classification, and stop confirmation. Legal owns the requirement checklist and approval decision. Maintain immutable event logs for consent, notice, debit, cancellation, return, retry, and resolution.

## Launch gate
Do not launch the pilot until the account mix and amount model are confirmed, the authorization screen and cancellation flow pass an end-to-end test, notice timing is evidenced, retry rules are configured, and the 2-year reproducible record is verified. This is a recommendation for counsel review, not a durable decision.
