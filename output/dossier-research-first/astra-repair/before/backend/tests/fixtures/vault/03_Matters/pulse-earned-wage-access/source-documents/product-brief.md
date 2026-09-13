---
matter_id: MAT-DEMO-PULSE
record_type: source_document
title: Pulse product brief v0.8
source_owner: Jordan Lee
source_status: supplied_unverified
updated_at: '2026-08-27'
---
# Pulse Product Brief v0.8

## Goal

Give users a small liquidity bridge between work and payday. The pilot success metric is repeat use without increased payment failures or support contacts.

## Proposed experience

1. The user connects payroll and a repayment account.
2. Pulse estimates earned wages and shows an available amount from $25 to $150.
3. The user selects an amount.
4. The user chooses free delivery in two to three business days or instant delivery for $3.99.
5. The user chooses a tip. The current prototype defaults to $2.
6. The user accepts the agreement and authorizes one ACH debit after expected payday.

## Eligibility rules

- At least two recurring payroll deposits detected.
- Expected payday within 14 days.
- No unpaid prior Pulse balance.
- Advance cap is the lower of $150, 25% of estimated net accrued wages, or a model risk limit.

## Open product questions

- Should free delivery receive equal visual weight?
- Should the tip screen appear before or after agreement acceptance?
- Can a user revoke repayment authorization in the app?
- What happens if payroll data changes after the advance is sent?
