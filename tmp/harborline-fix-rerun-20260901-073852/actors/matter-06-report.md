# Matter 06 evidence

## Method

- Request title: Marketing a “No Monthly Fee” Business Account
- Actor model and reasoning: Matter Attorney 06 of 10; senior product counsel focused on BSA/AML, banking regulation, and payments. Model details were not exposed in the UI.
- Browser used: Codex in-app Browser.
- Changed-condition recovery attempt: Yes. The first create click showed no immediate navigation. I waited for the page to settle and checked the button and URL. The matter then opened at the visible URL below. I did not switch browsers.
- Coordinator browser help: None. I controlled the browser directly. No agent was spawned.
- Method compliance: Visible-browser-only live work. I used visible controls and visible results. I did not use APIs, curl, source code, repository documents, database access, vault files, network requests, hidden DOM mutation, or a headless browser. I read only the required experiment instructions, browser instructions, and evidence template. I did not inspect prior reports or other matters.
- Start time: 2026-09-01T08:17:00-07:00 (recorded to the minute at run start)
- End time: 2026-09-01T08:34:08-07:00
- Total minutes: About 17

## Visible workflow

- Matter title and visible ID: “Harborline UX Rerun — 06 — Marketing a No Monthly Fee Business Account”; `MAT-20260901-acb55f`.
- Phases discovered: Intake/orientation, guided intake questions, work item, research/dossier area, current draft, final response, approval-ready state, decision and delivery record areas, required work, and closure state. The UI exposed these through Matter overview, Matter contents, Chat, Work product, Draft, Final, Dossier, Matter Records, and visible status text.
- Phases attempted: Created the matter; completed visible orientation work; answered four guided intake questions; selected high lawyer-set risk; opened and reviewed the original request; opened and saved a developed current draft; finalized the draft; reloaded the matter; inspected Matter contents and Overview. I attempted to stop the repeated intake loop with “No more questions.”
- Highest phase reached: Final work product saved. The visible status said: “Final work product saved. The matter is ready for approval.”
- Participants: Visible Overview listed Product · Requester and Lawyer · Legal owner.
- Work items and assignment: Visible current work item was “Orient to the request,” assigned to Lawyer. “Complete this work item” produced the visible status “Work item completed.” The Overview then showed “Review intake.” Required work remained for the partner marketing review SLA/turnaround.
- Final intake-card state: Intake eventually showed “Intake is complete. The saved facts and open questions remain available for the dossier and research.” Four later questions were also visibly marked “Stopped: Intake stopped before this question was answered.”
- Research artifact and provider/fallback state: No research packet was saved. No research provider or fallback result was visibly available. The first-pass chat included legal references and enforcement-pattern statements, but the drafted work product labeled these as unverified leads and stated that no external source was verified in this run.
- Canonical draft: Saved visibly as “Current draft — Harborline UX Rerun — 06 — Marketing a No Monthly Fee Business Account response.” It contained developed sections for executive answer, assumptions and known facts, claim accuracy/net impression, payment-fee disclosure, consumer/business versions, required work items, recommendation, and unverified leads.
- Canonical final: Saved visibly as “Approved / final response — Harborline UX Rerun — 06 — Marketing a No Monthly Fee Business Account response.” The visible status confirmed: “Final work product saved. The matter is ready for approval.”
- Recommendation: Separate from decision. The final text recommended a two-track review, adjacent fee qualifiers, fee-table proximity, pre-opt-in pricing, partner approval, and no launch approval until missing facts are confirmed. It explicitly said “Recommendation — not a recorded decision.”
- Decision relevance: Relevant because the recommendation was conditional and depended on fee schedule, product classification, partner approval, audience, geography, eligibility, hierarchy, and substantiation.
- Recorded decision: None. Overview visibly stated: “No durable decision is recorded for this matter.”
- Decision register and matter consistency: The matter-level record was consistent with no recorded decision. I did not open the global Decisions register because it could expose unrelated matters; no current-matter decision-register view was visible in the matter.
- Approval: No approval button or approval form was visible. The only approval signal was the status that the final response was ready for approval.
- Local delivery record: No local delivery-state control was visible. Chat “Send” was disabled. I did not send or deliver anything.
- Required work: Overview visibly displayed: “Does the banking partner have a standard marketing review SLA or turnaround time for compliance sign-off on consumer-facing deposit marketing?” It remained required/open in the Overview.
- Closed state: No visible close/close-matter action was available after finalization. The matter was not visibly Closed.
- Reload consistency: After reload, the matter URL, title, high risk, request, first-pass analysis, answered intake facts, stopped questions, and saved final content remained visible. The reload preserved the saved result.
- Duplicate records: One matter was created. No duplicate matter was created during recovery. One visible ID was used throughout.
- Internal-output leakage: None observed. The work product showed user-facing legal analysis and clearly labeled assumptions, missing facts, and unverified leads.

## Timing and recovery

- Time to first useful artifact: About 2 minutes after creation; the visible chat produced a developed first-pass analysis.
- Retries: One changed-condition recovery for matter creation. One stale-target click attempt on “Stop showing progress” after the visible status had already changed. One reload to verify persistence. One “No more questions” attempt to stop the repeated intake loop.
- Extra clicks: Matter creation required the recovery wait; risk selection; opening Overview; opening and closing the orientation document; opening and closing the request and draft documents; Matter contents expansion; Chat/Overview toggles; and “No more questions.”
- Recovery delay: About 1.8 seconds for the matter-create recovery, then roughly 1–2 minutes of repeated visible processing across intake turns. Reload took about 1.8 seconds to restore the saved matter.

## Findings

- Working well: Matter creation accepted the full requester text, title, marketing-review type, high priority, and target date entry. Visible result: the exact title and full request were present in the new matter. Guided intake used plain answer choices and recorded material facts. Visible results included “Workspace state change recorded,” “Answered,” and updated working ask/facts/issues/open questions. The lawyer could complete and inspect the orientation work item. The draft editor accepted a substantial structured work product and showed “Saved.” Finalization was clear and reliable: the status explicitly said the final work product was saved and ready for approval. Reload preserved the saved work. These behaviors reduced duplicate entry and preserved a usable legal foothold.
- Product friction: The create action gave no immediate feedback. After the first click, the form still appeared open and the button looked active; only after waiting did the URL change to the new matter. The due date entered in the form did not appear in the matter header, which showed “Due: No date.” The Matter overview repeated long chat and intake content, making the current phase and next action hard to scan. The UI exposed “Ready for approval” but no approval control. The global Decisions register was not safely inspectable without risking unrelated-matter exposure. The matter lacked a visible local delivery-state record. These issues were recoverable or limited, but they added checking and uncertainty.
- Broken behavior: During guided intake, after the fourth answer, the visible chat repeatedly showed: “The intake turn could not be saved or presented as a structured question. Please retry.” No retry control was visible. The engine continued to generate and supersede questions, then “No more questions” stopped the remaining questions and marked them “Stopped.” This prevented completion of the full visible intake sequence and left the required partner-SLA work unresolved. The saved final draft remained available, so the failure did not erase the developed work product. Reproduction: create the matter, answer the visible guided questions with Unknown where facts are missing, wait for the next question, and observe the exact structured-question error; expected behavior is a visible retry or a stable fallback question; actual behavior is a repeated error, continued processing, and later stopped questions. Recovery was to use “No more questions,” continue through the visible draft workflow, save the draft, finalize it, and reload. Impact: research/intake completeness and phase progression were unclear, and the lawyer had to verify that the final artifact was still usable.
- Browser-control errors: One locator click for “Stop showing progress” failed because the visible status had already changed and the control no longer existed. This was an actor targeting error caused by a changing page state, not evidence of a product defect. No other browser-control error occurred.
- Environment failures: The app showed long-running visible “Working” states during intake. The structured-question error was visible in the app, but no provider or browser fallback failure was shown. The in-app browser remained usable. No Chrome or Safari fallback was needed.
- Blockers: Full research and the remaining intake questions were not completed. No approval, durable decision, local delivery record, or closure action was visible. Real external contact or delivery was not attempted.
- Visible evidence: Matter URL `http://localhost:3000/matters/MAT-20260901-acb55f`; title and ID above; statuses “Work item completed,” “Final work product saved. The matter is ready for approval,” and “Intake is complete”; exact error “The intake turn could not be saved or presented as a structured question. Please retry.”; Overview statements “No research packet is saved yet,” “No durable decision is recorded for this matter,” and the open Required work paragraph; Chat “Send” disabled; reload preserved the saved final response.
