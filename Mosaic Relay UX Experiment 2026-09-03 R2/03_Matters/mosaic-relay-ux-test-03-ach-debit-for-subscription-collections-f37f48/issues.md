---
matter_id: MAT-20260903-f37f48
record_type: issues
review:
  segments:
  - kind: equal
    text: '# Issues and workstreams


      - NACHA Operating Rules govern recurring ACH debit authorization, notice, and
      recordkeeping; consumer accounts additionally trigger Reg E/EFTA protections
      (stop-payment, 60-day error resolution, specific authorization language).

      - Whether the subscription debit amount is fixed or variable determines the
      NACHA advance-notice requirement (10 days before first debit, 7 days before
      each subsequent debit for variable amounts).

      - Retry logic for returned debits may constitute new debits requiring fresh
      authorization and notice, and may implicate unauthorized-return handling (R07,
      R10, R29).

      - Cancellation must propagate from the user through the platform to Mosaic Relay''s
      operations to prevent unauthorized continued debits.

      - The consumer vs. business account mix remains unresolved and determines whether
      Reg E/EFTA applies at all.

      - NACHA requires the ODFI to retain the authorization (or a record of it) for
      2 years in a reproducible format; format and retention must be confirmed for
      recordkeeping approval.

      - The platform''s role (originator, third-party sender, or service provider)
      is unresolved and affects NACHA and money-transmission obligations.

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
# Issues and workstreams

- NACHA Operating Rules govern recurring ACH debit authorization, notice, and recordkeeping; consumer accounts additionally trigger Reg E/EFTA protections (stop-payment, 60-day error resolution, specific authorization language).
- Whether the subscription debit amount is fixed or variable determines the NACHA advance-notice requirement (10 days before first debit, 7 days before each subsequent debit for variable amounts).
- Retry logic for returned debits may constitute new debits requiring fresh authorization and notice, and may implicate unauthorized-return handling (R07, R10, R29).
- Cancellation must propagate from the user through the platform to Mosaic Relay's operations to prevent unauthorized continued debits.
- The consumer vs. business account mix remains unresolved and determines whether Reg E/EFTA applies at all.
- NACHA requires the ODFI to retain the authorization (or a record of it) for 2 years in a reproducible format; format and retention must be confirmed for recordkeeping approval.
- The platform's role (originator, third-party sender, or service provider) is unresolved and affects NACHA and money-transmission obligations.
