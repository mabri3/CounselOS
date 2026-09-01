# Matter 03 evidence

## Method

- Request title: Delayed Settlement for Higher-Risk Payment Recipients
- Actor model and reasoning: Senior product counsel focused on BSA/AML, banking regulation, payments, settlement authority, notices, fairness, and controls. Fictional Harborline facts only. Recommendations were kept separate from recorded decisions.
- Browser used: Codex in-app Browser. Chrome and Safari were not needed because the in-app Browser connected and worked.
- Changed-condition recovery attempt: After the guided intake produced “The intake turn could not be saved or presented as a structured question. Please retry,” I waited for a retry, then reloaded the matter once. The reload preserved state and allowed intake to continue. A second background structured-question error still appeared in the transcript.
- Coordinator browser help: Not needed. No browser-control blocker.
- Method compliance: Created exactly one prefixed matter. Used the visible in-app Browser first. Did not inspect prior actor reports, other matters, source code, handoff files, or other actor files. Stopped before external contact or delivery.
- Start time: Approximately 2026-09-01 07:38 PDT (run folder timestamp 07:38:52).
- End time: 2026-09-01 08:05:16 PDT.
- Total minutes: Approximately 26 minutes.

## Visible workflow

- Matter title and visible ID: “Harborline UX Rerun — 03 — Delayed Settlement for Higher-Risk Payment Recipients”; visible URL ID `MAT-20260901-bb4979`.
- Phases discovered: Intake/orientation; guided material questions; matter overview; facts; issue map; recommendation; required work; research request; current draft; final work product; matter contents/records; reload.
- Phases attempted: Created matter; completed orientation; answered business-only recipient scope; recorded contract review not yet done; recorded state money-transmission analysis not started; recorded interest/fee treatment as undecided; recorded auto-release at day 7 regardless of appeal status; inspected overview and artifacts; assigned required work to Lawyer; created and saved a current draft; finalized the draft; inspected final, dossier, work-to-do, recorded-decisions, and matter contents; requested in-app research/fallback; reloaded.
- Highest phase reached: Final work product saved and marked by the app as ready for approval; research was also started in the background.
- Participants: Visible overview showed Product · Requester and Lawyer · Legal owner. Other actors were captured in the request and facts, but not added as participant records.
- Work items and assignment: Required contract/processor settlement-rights review was created, then assigned to Lawyer. The state money-transmission analysis was also recorded as scheduled required work in chat, but no separate visible work-item card for it was shown. Contract work was not completed because it had not been performed. The app later showed `0 required · 6 optional`, with contract and state analysis listed as scheduled/open items.
- Final intake-card state: Intake complete. Visible facts included business-recipient-only scope; one-business-day low-risk settlement; holds up to seven calendar days; dashboard notice and appeal; card-funded and bank-funded rails; payroll excluded; other exclusions undefined; internal loss data; auto-release at day 7; contract review scheduled; state analysis scheduled; interest/fee treatment pending product input.
- Research artifact and provider/fallback state: No research packet was saved during the observed run. The app said: “Research is running in the background for the delayed-settlement matter,” covering banking partner, card-network, ACH/Nacha, and state money-transmission threads. The requested fallback instruction was preserved in the chat request, but no fallback packet was visible before the run ended.
- Canonical draft: Created and saved a current draft titled “Harborline UX Rerun — 03 — Delayed Settlement for Higher-Risk Payment Recipients response.” It contained rail-by-rail assessment, terms/notices, fairness/explanation risk, BSA/AML controls, assumptions, missing facts, unverified leads, and a separate recommendation.
- Canonical final: Finalized successfully. The app showed “Final work product saved. The matter is ready for approval” and displayed an “Approved / final response” artifact. No separate approval action was visible.
- Recommendation: Draft recommendation was to use a gated business-only pilot only after written partner/processor authority and state analysis; use separate card/bank controls, a firm cap, notices, appeal handling, and automatic release. This remained labeled as a recommendation, not a recorded decision.
- Decision relevance: The app correctly treated business-only scope and day-7 auto-release as material facts. It kept interest/fee treatment undecided and assigned that gap to Product. It flagged contractual authority and state analysis as schedule-critical against the eight-week launch.
- Recorded decision: No durable decision was recorded. Matter text stated “No durable decision is recorded for this matter.”
- Decision register and matter consistency: Matter contents showed “Recorded decisions” expanded with no decision entries. Matter overview said no durable decision. This was consistent. The dossier was stale: it showed “Research has not been added yet,” “No recommendation has been drafted yet,” and “No work product yet” even after the current draft and final were saved.
- Approval: Not completed. The visible status said ready for approval, but no Approve button or approval form appeared in the overview, final artifact, dossier, or matter contents.
- Local delivery record: No local-only delivery control or delivery record was visible. No external delivery was attempted.
- Required work: Contract/processor agreement review and state money-transmission analysis remained open/scheduled. Interest/fee treatment remained required product input. Excluded categories, recipient classification, and appeal process remained open items.
- Closed state: Not reached. The matter remained “Waiting on you,” stage “Just came in,” and there was no visible close control.
- Reload consistency: After reload, the title, ID, intake answers, repeated error messages, final artifact state, and research-running chat state remained. The matter did not lose the saved work.
- Duplicate records: No duplicate matter was created. The chat contained repeated “structured question” error messages and repeated/superseded question records. Matter contents changed from 19 to 23 documents during draft/research activity and later showed 21/22 during background processing; no second matter was visible.
- Internal-output leakage: No external message, recipient, or delivery was visible. The app did show internal workstream notes and draft content in the matter, as expected for the local test.

## Timing and recovery

- Time to first useful artifact: About 4–5 minutes after matter creation; orientation saved reported facts, assumptions, six workstreams, and missing facts.
- Retries: One retry by waiting after the first structured-question error; one changed-condition recovery attempt by reloading; continued waiting through background processing; no blind repeat after the reload.
- Extra clicks: Closed/opened document views for Facts, Issue map, Recommendation, Dossier, and final; opened matter contents; expanded Final, Matter Records, Work to do, and Recorded decisions; opened the required work item; assigned it to Lawyer; opened Chat; created draft; finalized draft.
- Recovery delay: Approximately 7 seconds after the first structured-question error, then one reload and about 12 seconds to resume. Background intake and research waits totaled about 1–2 minutes of observed delay.

## Findings

- Working well: One prefixed matter was created. Guided questions identified decision-changing forks. Business-only scope, state-analysis status, interest/fee uncertainty, and day-7 auto-release were recorded with useful downstream issue updates. The app created a required work item, allowed assignment, preserved assumptions and unverified-lead labels, allowed a best-effort draft without research, and finalized the draft. Reload preserved state. No external delivery occurred.
- Product friction: Background work often stayed in “Working” for long intervals. The app exposed many superseded questions and repeated error messages. Approval was announced but not actionable. The dossier did not refresh to show saved recommendation, draft, final, or research state. Participants were limited to Product and Lawyer even though many actors were named.
- Broken behavior: Guided intake twice reported “The intake turn could not be saved or presented as a structured question. Please retry.” The first error did not expose a retry control. Research remained “running in the background” without a visible packet or provider/fallback result. After finalization, the app still said “No research packet is saved yet,” “No working recommendation is saved yet,” and the dossier still said “No work product yet.” The matter stage did not advance after finalization.
- Browser-control errors: None. The in-app Browser connected, navigated, clicked, typed, reloaded, and returned visible DOM state.
- Environment failures: No browser environment failure. Research/backend work did not finish during the observed run. No Chrome or Safari fallback was needed.
- Blockers: No approval control, no visible local-only delivery control, no close control, no saved research packet, and open required legal work prevented a claim of approval, delivery, closure, or completed legal review.
- Visible evidence: Matter ID `MAT-20260901-bb4979`; final status “Final work product saved. The matter is ready for approval”; required work owner Lawyer; chat status “Research is running in the background for the delayed-settlement matter”; no durable decision; stage “Just came in”; no close or approval control visible.
