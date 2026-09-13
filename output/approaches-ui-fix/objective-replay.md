**Objective**

Complete the acquisition while avoiding an unlawful or weakly controlled day-one migration. Closing the acquisition and launching all services are separate milestones.

**Current approach**

Mosaic would migrate Harbor users into its app and become the operating provider.

- **Makes the objective easier:** It avoids a late redesign of contracts, product flows, and operations.
- **Makes it harder:** Mosaic must establish its own authority in the four new markets. It must also resolve KYC record gaps, review Harbor’s alerts and SAR history, and test transaction monitoring.
- **Possible adjustment:** Close the acquisition, but limit markets, users, or product access until each required control is ready.

**Bank-held funds structure**

A partner bank would hold customer funds. This fact alone does not determine Mosaic’s licensing position.

- **Makes the objective easier:** It could reduce Mosaic’s money-transmission exposure if the bank also controls accounts, transfer instructions, settlement, balance records, and repayment duties.
- **Makes it harder:** It requires new contracts, user terms, funds flows, system controls, and a clear division of compliance duties. This work could affect launch timing.
- **Issues that remain:** KYC, alerts, SARs, transaction monitoring, privacy, and the $50 promotion do not disappear only because the bank holds funds.

**Working view**

Use the current approach as the planning baseline. Do not assume this supports a full day-one launch. Keep the bank structure hypothetical unless its complete operating model shows a clear legal benefit that justifies the extra work.

**Next step**

Prepare a funds-flow and responsibility map for the bank option. In parallel, obtain the state-by-state licensing determination and review the alerts and SAR history. These results will show whether the better choice is the current launch, a narrower launch, or further development of the bank structure.

**No external authority retrieved.** The regulatory effect of each structure remains unverified and can differ by state.

```problem-analysis
{"schema_version":1,"objective":"Complete the Harbor acquisition while avoiding an unlawful or weakly controlled post-close migration.","proposed_method":"Compare the current migration with a hypothetical partner-bank custody structure.","framing_note":"The acquisition close and the service launch are separate milestones. Bank custody alone does not establish Mosaic’s regulatory status.","questions":[{"key":"state_authority","question":"What authority permits Mosaic to serve each of the four new markets under each structure?","why_it_matters":"The answer can require a narrower or delayed launch without preventing the acquisition close.","kind":"applicability","state":"open","priority":"decision_changing","next_action":"research","next_action_reason":"Obtain a state-by-state licensing determination."},{"key":"bank_control","question":"Who contracts with users and controls accounts, transfers, settlement, balances, and repayment under the bank structure?","why_it_matters":"These functions can affect whether bank custody provides a meaningful regulatory benefit.","kind":"characterization","state":"open","priority":"decision_changing","next_action":"ask_business","next_action_reason":"Prepare a funds-flow and responsibility map."},{"key":"compliance_readiness","question":"Can KYC, alert review, SAR handling, and monitoring operate adequately at launch?","why_it_matters":"These issues remain under both structures and can require launch restrictions.","kind":"requirement","state":"open","priority":"decision_changing","next_action":"inspect_source","next_action_reason":"Review the compliance program, alerts, SAR history, and monitoring test results."}],"coverage":[{"topic":"Marketing bonus","reason":"The bonus remains unresolved under both approaches, but it does not currently distinguish them.","state":"unresolved"}],"integrated_answer":"Use the current approach as the planning baseline, but separate closing from full launch. Keep the bank structure hypothetical until its contracts and operating model show a clear legal benefit. A narrower launch remains available if licensing or compliance readiness is incomplete.","next_step":"Complete the state licensing analysis, review alerts and SAR history, and compare the result with a bank-option funds-flow and responsibility map."}
```