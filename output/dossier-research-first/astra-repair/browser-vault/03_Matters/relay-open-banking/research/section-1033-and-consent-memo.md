---
research_id: RES-MAT-DEMO-RELAY
matter_id: MAT-DEMO-RELAY
record_type: research_packet
research_status: complete
title: Open-banking authorization and migration research
created_at: '2026-08-28T12:30:00+00:00'
---
# Open-Banking Authorization and Migration Research

## Executive answer

Relay does not need to freeze the API migration while federal rulemaking remains uncertain. The durable path is to use clear, purpose-specific permission, collect only what the selected product needs, make revocation easy, and give deletion instructions that the company and aggregator can execute.

As of August 28, 2026, the CFPB's public compliance page says a court stayed the compliance dates for the 2024 Personal Financial Data Rights Rule. That stay changes the schedule. It does not make broad or misleading data practices low risk, and it does not eliminate contract, privacy, data-security, or consumer-protection duties.

## Analysis

### 1. Migration and reauthorization

The current phrase “provide and improve Relay services” does not tell a customer that the same transaction history may support ACH verification, cash-flow underwriting, fraud controls, product analytics, and marketing. Relay should not treat technical continued use as permission for materially broader purposes.

A practical migration can distinguish collection from expansion. Existing data flows may continue for their current disclosed functions during a defined transition if the bank and aggregator allow it. Relay should obtain an affirmative permission record before it adds a new purpose or when the customer next completes bank reauthentication.

### 2. Optional secondary uses

Cross-product marketing and lending segmentation are not necessary to connect an account. Bundling them into required permission makes the customer's choice less meaningful and complicates revocation. The clean product approach is a separate, optional choice with no loss of the requested linking feature if the customer says no.

### 3. Retention and deletion

“Keep data while useful” is not an operating rule. Relay needs a table that connects each data set to its purpose, retention period, deletion event, and exception owner. A 30-day post-disconnection deletion target is workable for product data. Narrow evidence may be retained longer for active disputes, security events, legal holds, and required records, but the exception must not keep the full transaction feed by default.

### 4. Contract controls

The aggregator contract should bind the vendor and its subcontractors to documented instructions, limit independent use, require suitable security, set incident-notice timing, provide deletion evidence, permit audit evidence, and support export and deletion during transition. Relay should also know which party can answer a customer's access, revocation, and deletion request.

## Sources

### Verified primary sources

- [CFPB personal financial data rights compliance resources](https://www.consumerfinance.gov/compliance/compliance-resources/other-applicable-requirements/personal-financial-data-rights/) — reports the court-ordered stay and links the operative rule materials.
- [CFPB Personal Financial Data Rights Rule page](https://www.consumerfinance.gov/rules-policy/final-rules/required-rulemaking-on-personal-financial-data-rights/) — describes the final rule and authorized-third-party framework.
- [12 C.F.R. Part 1033](https://www.ecfr.gov/current/title-12/chapter-X/part-1033) — regulation text; legal status and compliance dates must be rechecked before launch.

### Internal sources

- Relay current connection screen, supplied by Product on August 7, 2026.
- Aggregator renewal draft dated August 20, 2026.
- Connected-data inventory exported August 24, 2026.

## Assumptions and limits

- This packet assumes Relay is acting as an authorized third party rather than a covered data provider for the data flow at issue.
- State privacy-law analysis is limited to the proposed migration design and must be updated if Product adds advertising profiles or data sales.
- Rule status is time-sensitive and must be checked again before the approved migration begins.
