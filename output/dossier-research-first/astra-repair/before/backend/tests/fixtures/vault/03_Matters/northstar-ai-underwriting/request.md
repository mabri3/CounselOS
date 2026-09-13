---
request_id: REQ-MAT-DEMO-NORTHSTAR
matter_id: MAT-DEMO-NORTHSTAR
immutable: true
original_text_preserved: true
received_at: '2026-08-19T17:30:00+00:00'
requester: Aisha Patel
---
# Original Request

Risk and Product want to replace the current rules for small-business card credit-line increases with Northstar v3 on October 15. The model reviews six months of business cash flow, repayment history, account tenure, device consistency, and approximately 180 derived features. It would evaluate both customer-requested increases and the monthly portfolio review. The output can approve an increase, keep the current line, reduce the line, or suspend new spend pending manual review.

The model team says performance is materially better than v2, mainly because it recognizes cash-flow stability that the current revenue threshold misses. Their validation deck shows aggregate approval and loss rates. It does not yet show outcomes by prohibited-basis proxy group, and the team has not completed a less-discriminatory-alternative analysis. They can generate the top five SHAP features for each result, but some feature names are not suitable for customer notices. For example, `night_device_velocity_30d` and `merchant_graph_density` may be important even when the applicant has never heard those terms.

Operations currently chooses an adverse-action reason from a list after reviewing the file. With v3, Product wants the system to map model features to one of twelve approved reason codes and send the notice without manual review. The bank partner asked us to confirm that each reason is specific, accurate, and tied to the factors actually used. Privacy also flagged that device data was originally collected for account security, not underwriting.

Can Legal review the proposed reason-code map, tell us what testing and documentation we need for fair-lending approval, and decide whether device signals can be used for line decisions? Engineering needs final reason codes by September 10. The model cannot ship without the bank's model-risk approval, but they want Legal's issue list now so they can update validation in parallel.
