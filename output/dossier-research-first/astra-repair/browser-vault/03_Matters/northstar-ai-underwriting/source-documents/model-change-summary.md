---
matter_id: MAT-DEMO-NORTHSTAR
record_type: source_document
title: Northstar v3 model change summary
source_owner: Diego Alvarez
source_status: supplied_unverified
updated_at: '2026-08-18'
---
# Northstar v3 Model Change Summary

## Proposed changes

- Replace 42 policy rules with a gradient-boosted decision model.
- Add cash-flow volatility, balance persistence, device consistency, and merchant-network features.
- Produce one of four outcomes: increase, no change, decrease, or suspend for review.
- Generate five local feature contributions for each outcome.

## Claimed benefits

- Twelve percent more approvals at the current projected loss rate.
- Better treatment of seasonal businesses.
- Fewer manual reviews for complete files.

## Validation not yet complete

- Proxy-group comparative outcomes.
- Less-discriminatory-alternative search.
- Production-to-validation feature-name reconciliation.
- Back-test of generated adverse-action reasons.
- Performance for applicants with thin linked-account histories.

## Proposed reason examples

| Model feature | Proposed customer reason |
| --- | --- |
| `cashflow_cv_90d` | Recent business cash flow was too variable |
| `avg_available_balance_30d` | Average available account balance was too low |
| `night_device_velocity_30d` | Recent account activity did not meet our requirements |
| `merchant_graph_density` | Business activity did not meet our requirements |

The last two mappings remain disputed because the proposed text may be too broad to explain the factor used.
