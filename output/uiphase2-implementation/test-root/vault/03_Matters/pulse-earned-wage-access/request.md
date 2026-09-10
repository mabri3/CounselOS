---
request_id: REQ-MAT-DEMO-PULSE
matter_id: MAT-DEMO-PULSE
immutable: true
original_text_preserved: true
received_at: '2026-08-28T15:20:00+00:00'
requester: Jordan Lee
---
# Original Request

Hi Legal — we want to pilot Pulse, our direct-to-consumer earned wage access feature, in California, Nevada, and New York in October. This is the product that lets a user connect their payroll account, see wages they appear to have earned, and take up to $150 before payday. We would fund the advance from our program account and recover it by ACH after the expected payday. There is no credit check, no collections, and no report to a credit bureau. If repayment fails, the user cannot take another advance until the balance is paid, but we do not overdraw the user's account on a retry.

The current design has free delivery in two to three business days. A user can instead pay $3.99 for delivery within minutes. The last screen also asks whether the user wants to leave a tip of $0, $2, $4, or a custom amount. Product wants $2 preselected because our test group rarely chose a tip without a default. The tip can be changed to zero, but that takes two taps. Revenue thinks we need both the instant fee and tips for the pilot economics to work.

We are not launching through an employer. We use payroll-login data from Pinwheel and bank-transaction data from Plaid to estimate accrued wages and payday. The model applies a lower cap when the data is incomplete. The advance agreement currently says Pulse is not a loan and that tips are optional. Design has not added a cost-of-credit disclosure because Finance believes the product falls outside lending laws.

Could you tell us whether we can launch the current flow, which licenses or registrations may be required in each state, and what must change in the screens and agreement? We have attached the product brief, but Treasury is still confirming whether funds move from us directly or through our sponsor bank. We need a practical answer by September 4 so Engineering can lock the October build.
