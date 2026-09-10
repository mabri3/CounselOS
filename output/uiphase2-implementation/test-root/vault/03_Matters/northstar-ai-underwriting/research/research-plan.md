---
matter_id: MAT-DEMO-NORTHSTAR
record_type: research_plan
research_status: in_progress
created_at: '2026-08-27T18:00:00+00:00'
---
# Northstar Research Plan

## Questions in scope

1. For each proposed outcome, determine the notice timing, content, and recipient rules under ECOA and Regulation B.
2. Determine how specific reasons must be when a complex model is used.
3. Review whether the proposed feature-to-reason map describes actual principal factors rather than nearby concepts.
4. Identify the fair-lending tests and governance evidence needed before launch.
5. Review whether device data collected for security can be reused for underwriting.

## Primary sources collected

- [Regulation B, 12 C.F.R. § 1002.9](https://www.consumerfinance.gov/rules-policy/regulations/1002/9/)
- [CFPB Circular 2022-03 on complex algorithms and adverse-action reasons](https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/)
- [CFPB Circular 2023-03 on specific and accurate reasons](https://www.consumerfinance.gov/compliance/circulars/circular-2023-03-adverse-action-notification-requirements-and-the-proper-use-of-the-cfpbs-sample-forms-provided-in-regulation-b/)

## Work in progress

- [x] Create outcome taxonomy.
- [x] Compare four sample model outputs with proposed reason codes.
- [ ] Obtain production feature dictionary.
- [ ] Complete notice back-test on at least 100 adverse outcomes.
- [ ] Review proxy-group results and less-discriminatory alternatives.
- [ ] Confirm device-data notice and vendor limits.

## Early finding

The model's complexity does not excuse a vague notice. The current mappings for device velocity and merchant-network density do not yet explain the specific principal reason used for the result. This finding is preliminary because the production feature definitions are still missing.
