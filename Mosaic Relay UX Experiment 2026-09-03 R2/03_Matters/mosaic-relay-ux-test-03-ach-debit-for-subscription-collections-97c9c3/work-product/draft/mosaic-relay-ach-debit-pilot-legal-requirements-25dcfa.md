---
work_product_id: WP-20260903-25dcfa
matter_id: MAT-20260903-97c9c3
title: Mosaic Relay ACH Debit Pilot — Legal Requirements
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T16:51:11+00:00'
updated_at: '2026-09-03T16:51:11+00:00'
immutable: false
source_action_key: null
recommendation_version_id: REC-20260903-c28507
recommendation_snapshot: '# Recommendation


  ## Proposed approval path

  Approve a gated US pilot only after Product and Mosaic Relay close the two open
  facts: consumer versus business account mix and fixed versus variable debit amount.
  Treat consumer accounts as in scope until confirmed otherwise.


  ## Authorization

  Use a clear recurring ACH authorization. State the debit amount or method for calculating
  it, cadence, start date, duration, account identifier, and how the user can cancel.
  Capture affirmative consent with an electronic record that can be reproduced and
  audited. Preserve the authorization and proof of assent for at least two years,
  with access controls and an audit trail.


  ## Recurring debits and notices

  For a fixed monthly amount, send confirmation before the first debit and after material
  changes. For variable amounts, send the required advance notice before the first
  debit and before each later debit, with the amount/date or a clear calculation method.
  Do not debit outside the authorized cadence or amount method.


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

  Product owns the user journey, notices, and cancellation UI. Mosaic Relay owns ODFI-side
  execution, return classification, and stop confirmation. Legal owns the requirement
  checklist and approval decision. Maintain immutable event logs for consent, notice,
  debit, cancellation, return, retry, and resolution.


  ## Launch gate

  Do not launch the pilot until the account mix and amount model are confirmed, the
  authorization screen and cancellation flow pass an end-to-end test, notice timing
  is evidenced, retry rules are configured, and the 2-year reproducible record is
  verified. This is a recommendation for counsel review, not a durable decision.'
review:
  segments:
  - kind: equal
    text: '# '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '# Mosaic Relay ACH Debit Pilot — Legal Requirements


      ## Executive summary'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'Legal can support a US-only pilot in principle, but launch is gated. The
      pilot must resolve the account mix and amount model, prove the authorization
      and cancellation flows, and evidence notice, return, and recordkeeping controls.


      ## 1. Authorization requirements'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Use an electronic recurring ACH authorization with clear, conspicuous
      terms.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- State the debit amount or calculation method, cadence, first debit date,
      duration, account identifier, and cancellation method.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Capture affirmative assent and retain a reproducible authorization record
      plus proof of assent for at least two years.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Make the authorization available for retrieval and audit.


      ## 2. Recurring-debit and notice requirements'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Debit only within the authorized cadence and amount or calculation method.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Provide confirmation before the first debit and after material changes.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- If amounts are variable, send advance notice before the first debit and
      before each later debit, with date and amount or a clear calculation method.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Log notice content, delivery time, recipient, and delivery result.


      ## 3. Cancellation requirements'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Provide a simple, always-available cancellation path.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Time-stamp the request and send confirmation.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- The platform forwards the cancellation to Mosaic Relay; Mosaic Relay
      executes the stop before the next eligible debit.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Reconcile cancel events to the debit queue and alert on any failed handoff.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Support consumer stop-payment rights and error resolution where Regulation
      E applies.


      ## 4. Returns and unauthorized debits'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Classify return codes and preserve the return record.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Never reinitiate R07, R10, or R29 without fresh authorization.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Retry only permitted non-revocation returns, with defined limits, notice,
      and a stop condition.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Pause retries for an unauthorized claim. Provide investigation, refund/escalation,
      and evidence preservation.


      ## 5. Recordkeeping and operational controls'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Preserve the authorization, assent, notices, debit events, cancellations,
      returns, retries, and resolutions in an electronic, reproducible audit trail
      for at least two years.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Product owns the user journey, notices, and cancellation UI. Mosaic Relay
      owns ODFI-side execution, return classification, and stop confirmation. Legal
      owns the requirement checklist and approval decision.


      ## 6. Open facts and launch gate'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Confirm consumer versus business account mix. Apply the consumer protections
      if any consumer accounts are in scope until confirmed otherwise.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Confirm fixed versus variable amounts.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Confirm customer cancellation process, notice timing, retry logic, unauthorized-return
      treatment, and record format.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Do not launch until end-to-end tests pass and the evidence is reviewable.


      ## Recommendation'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Approve a gated pilot only after the launch gate is met. This draft is legal
      work product for review and is separate from the durable launch decision.
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      ## Counsel review


      Reviewed in the matter workspace. Open facts remain the account mix and fixed-versus-variable
      amount model. Approval is conditional on the launch gate.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: false
  authors: []
  comment_events: []
---
# # Mosaic Relay ACH Debit Pilot — Legal Requirements

## Executive summary

Legal can support a US-only pilot in principle, but launch is gated. The pilot must resolve the account mix and amount model, prove the authorization and cancellation flows, and evidence notice, return, and recordkeeping controls.

## 1. Authorization requirements

- Use an electronic recurring ACH authorization with clear, conspicuous terms.

- State the debit amount or calculation method, cadence, first debit date, duration, account identifier, and cancellation method.

- Capture affirmative assent and retain a reproducible authorization record plus proof of assent for at least two years.

- Make the authorization available for retrieval and audit.

## 2. Recurring-debit and notice requirements

- Debit only within the authorized cadence and amount or calculation method.

- Provide confirmation before the first debit and after material changes.

- If amounts are variable, send advance notice before the first debit and before each later debit, with date and amount or a clear calculation method.

- Log notice content, delivery time, recipient, and delivery result.

## 3. Cancellation requirements

- Provide a simple, always-available cancellation path.

- Time-stamp the request and send confirmation.

- The platform forwards the cancellation to Mosaic Relay; Mosaic Relay executes the stop before the next eligible debit.

- Reconcile cancel events to the debit queue and alert on any failed handoff.

- Support consumer stop-payment rights and error resolution where Regulation E applies.

## 4. Returns and unauthorized debits

- Classify return codes and preserve the return record.

- Never reinitiate R07, R10, or R29 without fresh authorization.

- Retry only permitted non-revocation returns, with defined limits, notice, and a stop condition.

- Pause retries for an unauthorized claim. Provide investigation, refund/escalation, and evidence preservation.

## 5. Recordkeeping and operational controls

- Preserve the authorization, assent, notices, debit events, cancellations, returns, retries, and resolutions in an electronic, reproducible audit trail for at least two years.

- Product owns the user journey, notices, and cancellation UI. Mosaic Relay owns ODFI-side execution, return classification, and stop confirmation. Legal owns the requirement checklist and approval decision.

## 6. Open facts and launch gate

- Confirm consumer versus business account mix. Apply the consumer protections if any consumer accounts are in scope until confirmed otherwise.

- Confirm fixed versus variable amounts.

- Confirm customer cancellation process, notice timing, retry logic, unauthorized-return treatment, and record format.

- Do not launch until end-to-end tests pass and the evidence is reviewable.

## Recommendation

Approve a gated pilot only after the launch gate is met. This draft is legal work product for review and is separate from the durable launch decision.

## Counsel review

Reviewed in the matter workspace. Open facts remain the account mix and fixed-versus-variable amount model. Approval is conditional on the launch gate.
