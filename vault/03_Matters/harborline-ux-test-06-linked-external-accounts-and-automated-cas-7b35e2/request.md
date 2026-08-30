---
request_id: REQ-20260830-e00d7e
matter_id: MAT-20260830-7b35e2
original_text_preserved: true
immutable: true
received_at: '2026-08-30T20:19:11+00:00'
requester: Product
business_objective: 'Harborline wants to let business customers link accounts held
  at other banks and set automated rules that move money between those accounts and
  their Harborline account. A customer could set a minimum balance, authorize '
requested_launch_date: null
urgency: high
---
# Original Request

Harborline wants to let business customers link accounts held at other banks and set automated rules that move money between those accounts and their Harborline account. A customer could set a minimum balance, authorize a daily check, and direct Harborline to initiate an ACH debit from the external account when the Harborline balance falls below that amount. The flow would use a data-aggregation provider for account ownership and balance data, while Harborline or its bank partner would originate the ACH entries. Finance teams could grant different permissions to administrators and employees. We aim to release the feature in twelve weeks. Known facts are that the first release will support U.S. business accounts only and will require multifactor authentication for rule changes. Missing facts include the account-validation method, debit limits, treatment of joint accounts, and whether the customer may link an account owned by an affiliate.

Please advise on the authorization, account-validation, Nacha, electronic-funds-transfer, privacy, and security requirements for this feature. We need a decision on the exact consent and renewal process, whether each automated debit needs advance notice, how Harborline must handle revoked authority and returned entries, and which roles may create or edit a sweep. Please also assess whether showing external balances or using them in automated decisions requires special data-use disclosures, and identify controls needed to prevent an employee from linking an account that the business does not own.
