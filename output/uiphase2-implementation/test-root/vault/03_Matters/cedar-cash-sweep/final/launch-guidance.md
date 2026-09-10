---
matter_id: MAT-DEMO-CEDAR
record_type: final_work_product
title: Cedar launch guidance
status: final
approved_at: '2026-08-22T20:30:00+00:00'
approved_by: Brian Harris
---
# Cedar Launch Guidance

## Decision summary

Cedar may launch after Product, Finance, Compliance, and the sponsor bank confirm the controls and copy below. The approval is for the eight-bank network and daily allocation process reviewed in this matter. A different ledger, administrator, or insurance maximum requires a new review.

## Approved disclosure structure

### Product card

**Put extra cash to work across our network banks. Earn a variable 3.75% annual percentage yield. Funds placed at network banks may be eligible for FDIC deposit insurance, subject to applicable limits and conditions.**

The annual percentage yield is current as of August 22, 2026, and may change after account opening.

### Detail shown before enrollment

Cedar is provided by Example Fintech, which is not a bank. Funds are held initially at Sponsor Bank, Member FDIC, and may then be placed into deposit accounts at participating network banks. Eligibility for pass-through deposit insurance depends on satisfaction of FDIC requirements. Coverage at a network bank is combined with other deposits the customer holds in the same ownership capacity at that bank. The number of available banks and the maximum potential coverage can change.

### Account view

Show the current annual percentage yield, total swept balance, each receiving bank, each allocation amount, last successful reconciliation time, and a direct link to withdraw or change the target operating balance.

## Required controls

1. Complete a ledger-to-administrator reconciliation each business day.
2. Create an exception when customer ownership or bank allocation differs.
3. Stop new placement into an affected bank for a material unresolved exception.
4. Preserve end-of-day customer and bank allocation files.
5. Test the customer-level ownership export each quarter.
6. Review network capacity and customer-facing maximums before each marketing change.
7. Run the administrator-outage and bank-failure exercise every six months.

## Support guidance

Support may explain the difference between Example Fintech, Sponsor Bank, and a network bank. Support must not promise that every dollar is insured without checking the customer's current allocations and known outside deposits. Questions about an actual bank failure, missing allocation, or ledger exception go to the incident team.

## Authority checked

- [FDIC pass-through deposit insurance coverage guidance](https://www.fdic.gov/financial-institution-employees-guide-deposit-insurance/pass-through-deposit-insurance-coverage)
- [FDIC consumer guidance on banking with third-party apps](https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps)

These sources explain that pass-through coverage depends on actual ownership, account records that show the agency relationship, and records that identify the owners and their interests. Deposit insurance does not protect against the failure of a nonbank company.
