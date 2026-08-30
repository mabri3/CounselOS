---
{}
---
---
matter_id: MAT-20260830-d76eef
record_type: facts
facts:
- fact_id: FACT-20260830-d298ed
  text: 'Intake response: yes'
  status: active
  material: true
  source_ids:
  - CONV-20260830-3d31f3
  supersedes: null
  created_at: '2026-08-30T08:48:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260830-53bbfc
- fact_id: FACT-20260830-user-01
  text: 'Requester identity: Alex Morgan, product counsel for fictional BNPL company Northstar Pay.'
  status: active
  material: true
  source_ids:
  - CONV-20260830-user-edit
  supersedes: null
  created_at: '2026-08-30T00:00:00+00:00'
  withdrawn_at: null
  action_id: null
- fact_id: FACT-20260830-user-02
  text: 'The six-week launch is an internal planning target, not an approval deadline.'
  status: active
  material: true
  source_ids:
  - CONV-20260830-user-edit
  supersedes: null
  created_at: '2026-08-30T00:00:00+00:00'
  withdrawn_at: null
  action_id: null
sources:
- source_id: CONV-20260830-3d31f3
  kind: conversation
  label: Current matter chat
  path: null
  version: ''
  location: ''
  created_at: '2026-08-30T08:48:07+00:00'
  withdrawn_at: null
  action_id: ACT-20260830-53bbfc
- source_id: CONV-20260830-user-edit
  kind: conversation
  label: User edit instruction (Alex Morgan)
  path: null
  version: ''
  location: ''
  created_at: '2026-08-30T00:00:00+00:00'
  withdrawn_at: null
  action_id: null
support: []
assumptions:
- assumption_id: ASM-20260830-01
  text: 'The initial rollout is US-only.'
  status: open
  source_ids:
  - CONV-20260830-user-edit
- assumption_id: ASM-20260830-02
  text: 'Both ACH bank accounts and debit cards may be offered as autopay payment methods.'
  status: open
  source_ids:
  - CONV-20260830-user-edit
- assumption_id: ASM-20260830-03
  text: 'Customers can enroll in autopay at checkout or in the app.'
  status: open
  source_ids:
  - CONV-20260830-user-edit
- assumption_id: ASM-20260830-04
  text: 'The loan servicer may send notices and reminders.'
  status: open
  source_ids:
  - CONV-20260830-user-edit
- assumption_id: ASM-20260830-05
  text: 'No customer-specific account data was supplied for this review.'
  status: open
  source_ids:
  - CONV-20260830-user-edit
conflicts: []
actions:
- action_id: ACT-20260830-53bbfc
  summary: Saved an intake response
  actor: assistant
  created_at: '2026-08-30T08:48:07+00:00'
  status: applied
  created:
    facts:
    - FACT-20260830-d298ed
    sources:
    - CONV-20260830-3d31f3
    support: []
    assumptions: []
---
# Known Facts

- Intake response: yes
- Requester identity: Alex Morgan, product counsel for fictional BNPL company Northstar Pay.
- The six-week launch is an internal planning target, not an approval deadline.

## Supplied facts (from the original request)

- Northstar Pay plans to make autopay enrollment easier for customers who use installment loans.
- The proposed experience asks customers to select autopay during checkout or in the app, displays the next payment amount and date, allows payment-method changes, and sends reminders before scheduled withdrawals.
- Northstar Pay may offer a discount or other incentive for enrollment.
- Some payment amounts can change after refunds, partial disputes, returned payments, or account adjustments.
- The product team is considering retrying failed payments and using a backup payment method when the primary method fails.
- Proposed launch is in six weeks (internal planning target).

## Assumptions (open, to be confirmed)

- The initial rollout is US-only.
- Both ACH bank accounts and debit cards may be offered as autopay payment methods.
- Customers can enroll in autopay at checkout or in the app.
- The loan servicer may send notices and reminders.
- No customer-specific account data was supplied for this review.

## Missing facts (to be gathered)

- Exact states in scope.
- Loan products in scope (pay-in-4 vs. longer-term installments).
- Payment processors involved.
- Lending partners involved.
- Servicer roles and responsibilities.
- Fee and discount/incentive terms.
- Authorization copy (proposed enrollment language).
- Notice channels and timing.
- Retry count and intervals.
- Backup-method sequencing.
- Cancellation cutoffs (how far before a withdrawal cancellation remains effective).
- Complaint/escalation ownership.
