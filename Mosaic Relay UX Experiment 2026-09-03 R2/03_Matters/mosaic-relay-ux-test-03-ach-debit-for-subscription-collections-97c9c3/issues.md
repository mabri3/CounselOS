---
matter_id: MAT-20260903-97c9c3
record_type: issues
review:
  segments:
  - kind: equal
    text: '# Issues and workstreams


      - NACHA Operating Rules govern recurring ACH debit authorization, advance notice,
      and 2-year record retention; consumer accounts additionally trigger Reg E/EFTA
      protections (stop-payment, 60-day error resolution, specific authorization language).

      - Whether the subscription debit amount is fixed or variable determines the
      NACHA advance-notice requirement (10 days before first debit, 7 days before
      each subsequent debit for variable amounts).

      - Retry logic for returned debits may constitute new debits requiring fresh
      authorization and notice; R07/R10/R29 returns must not be reinitiated without
      new authorization.

      - The consumer vs. business account mix determines whether Reg E/EFTA applies
      at all; it remains undetermined.

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

- NACHA Operating Rules govern recurring ACH debit authorization, advance notice, and 2-year record retention; consumer accounts additionally trigger Reg E/EFTA protections (stop-payment, 60-day error resolution, specific authorization language).
- Whether the subscription debit amount is fixed or variable determines the NACHA advance-notice requirement (10 days before first debit, 7 days before each subsequent debit for variable amounts).
- Retry logic for returned debits may constitute new debits requiring fresh authorization and notice; R07/R10/R29 returns must not be reinitiated without new authorization.
- The consumer vs. business account mix determines whether Reg E/EFTA applies at all; it remains undetermined.
