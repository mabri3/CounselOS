**Decision:** Choose the structure that best supports the day-one migration while controlling licensing and compliance risk.

**Current approach**

Mosaic becomes the operating provider after the asset purchase and migrates Harbor users into its app.

This is easier to implement before close. However, Mosaic must confirm its own authority to operate in each state. Harbor’s licenses cannot be assumed to transfer. Mosaic must also resolve the incomplete KYC records, unread alerts and SAR history, and transaction-monitoring transition.

A narrower launch could reduce risk. Mosaic could exclude the four new markets, restrict accounts with incomplete KYC evidence, or delay full product access until monitoring tests and alert reviews are complete.

**Bank-held funds structure**

A partner bank holds customer funds. This could reduce Mosaic’s money-transmission exposure, but only if the full operating structure supports that result.

The key facts remain unknown. These include who contracts with users, controls transfer instructions and settlement, records balances, and owes repayment. The bank agreements must also assign KYC, monitoring, alert, SAR, privacy, and marketing duties.

This option adds contract, product, and operating work before close. Bank custody alone does not resolve the licensing or financial-crime questions.

**Problems under both approaches**

Both approaches still require:

- State-specific advice for the four new markets.
- A decision on reliance on Harbor’s prior KYC.
- Review of the open alerts and SAR history.
- Testing that proves there will be no monitoring gap.
- Review of the $50 bonus after its terms and funds flow are known.

**Working recommendation**

Keep the current approach as the planning baseline. Do not launch the four new markets until the licensing position is confirmed. Consider the bank structure only if a complete funds-flow and responsibility map shows a clear legal benefit that justifies the added work.

The bank structure remains hypothetical. It does not change the current direction or actual facts.

**No external authority retrieved.** The legal effect of each structure remains unverified and can differ by state.

```problem-analysis
{"schema_version":1,"objective":"Choose a Harbor migration structure that supports the planned close while controlling licensing and financial-crime compliance risk.","proposed_method":"Compare the current asset-migration approach with a hypothetical partner-bank custody structure.","framing_note":"Holding funds is only one factor. Customer contracts, transfer control, settlement, balance records, repayment duties, and compliance responsibilities can change the result.","questions":[{"key":"state_authority","question":"Can Mosaic serve each of the four new markets under either structure?","why_it_matters":"The answer determines where Mosaic can launch.","kind":"applicability","state":"open","priority":"decision_changing","next_action":"research","next_action_reason":"State-specific licensing and approval advice is required."},{"key":"bank_control","question":"Who contracts with users and controls accounts, transfers, settlement, balances, and repayment under the bank structure?","why_it_matters":"Bank custody alone does not establish which entity performs the regulated activity.","kind":"characterization","state":"open","priority":"decision_changing","next_action":"ask_business","next_action_reason":"A complete funds-flow and responsibility map is required."},{"key":"compliance","question":"How will KYC, monitoring, alerts, and SAR duties be handled under each structure?","why_it_matters":"These unresolved duties can prevent a safe day-one migration.","kind":"requirement","state":"open","priority":"decision_changing","next_action":"ask_business","next_action_reason":"Compliance ownership and diligence results must be confirmed."}],"coverage":[{"topic":"State licensing","reason":"Included because authority to enter the four new markets is a launch gate.","state":"included","question_keys":["state_authority","bank_control"]},{"topic":"Financial-crime controls","reason":"Included because both structures retain unresolved KYC, alert, SAR, and monitoring questions.","state":"included","question_keys":["compliance"]},{"topic":"Welcome bonus","reason":"The offer requires review, but its structure is not yet known and does not presently distinguish the paths.","state":"unresolved"}],"alternative_paths":[{"title":"Current approach","proposed_change":"Continue the planned migration, subject to pre-close legal and compliance gates.","benefit":"Requires fewer structural changes before close.","tradeoff":"Mosaic retains unresolved licensing, KYC, alert-review, and monitoring risks.","remaining_condition":"Licensing, KYC reliance, alert handling, and monitoring continuity must be confirmed.","question_keys":["state_authority","compliance"]},{"title":"Bank-held funds structure","proposed_change":"Use a partner bank to hold funds and assign meaningful control and duties through the operating model.","benefit":"Could reduce Mosaic’s money-transmission exposure if the complete structure supports that result.","tradeoff":"Adds substantial contract and operating work without automatically removing other duties.","remaining_condition":"The customer relationship, funds flow, control rights, repayment duty, and compliance allocation must be defined.","question_keys":["state_authority","bank_control","compliance"]}],"integrated_answer":"Keep the current approach as the planning baseline, but gate the four new markets and any affected accounts until the material licensing and compliance questions are resolved. Reassess the hypothetical bank structure only after reviewing its contracts and complete operating model.","next_step":"Prepare a funds-flow and responsibility map for the bank structure and compare it with the state-by-state licensing advice."}
```