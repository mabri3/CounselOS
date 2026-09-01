# Matter 05 evidence

## Method

- Request title: Privacy Controls for Payment Recipient Data
- Actor model and reasoning: Fresh Matter Attorney 05 of 10; model/reasoning not exposed in the app
- Browser used: Codex in-app browser (IAB), selected first and used for the full run
- Changed-condition recovery attempt: Initial IAB visibility call failed because visibility is not supported in this actor session. One changed-condition recovery was made by opening a fresh IAB tab and continuing without visibility control. The app then operated reliably. No Chrome or Safari fallback was needed.
- Coordinator browser help: None. All app actions and visible-state checks were performed by this actor.
- Method compliance: Browser-only live-app work. No source code, API, curl, database, vault files, network requests, hidden DOM changes, headless browser, or other actor report was used. No app code was changed. Chime was mentioned only as broad context in the fictional request; no public page was opened.
- Start time: 2026-09-01T08:05:00-07:00 (approximate, first live app load)
- End time: 2026-09-01T08:24:20-07:00
- Total minutes: Approximately 19

## Visible workflow

- Matter title and visible ID: `Harborline UX Rerun — 05 — Privacy Controls for Payment Recipient Data`; `MAT-20260901-802a6f`
- Phases discovered: `Just came in` → `Being researched` → `Waiting on your judgment` → `Being drafted` → `Ready to send`. `Closed` was not reached.
- Phases attempted: Intake/orientation, guided intake questions, research, draft, finalization, durable decision, approval, work-product transition, reload, and closure request. External delivery was not attempted.
- Highest phase reached: `Ready to send`
- Participants: Visible overview listed `Product · Requester` and `Lawyer · Legal owner`. The request also named payments/data engineering, privacy, security, partner, processors, senders, recipients, and support, but these were not visible as assigned participants.
- Work items and assignment: Orientation work item was visibly owned by `Lawyer`; the screen showed `Assign owner`, `Open work item`, and `Complete this work item`. Completing it visibly moved the matter to research. The app then created visible work items for controller/processor roles, data location, device fields, AML/payment retention, non-customer notice, and GLBA notice flow-down. The overview later showed `0 required · 17 optional`, with no visible assignment controls for each listed item.
- Final intake-card state: Intake was visibly recorded. The card captured the working ask, facts, issues, an open fraud/suggestion pipeline decision, and a mix of customer and non-customer recipients. The first answer was visibly recorded as `Not yet decided / unknown`; the second as `A mix of both`. The UI also showed several later questions as `Superseded`.
- Research artifact and provider/fallback state: Three research records were visible in the durable-decision form. Each showed `Public research failed`: comprehensive state privacy notice, banking-partner GLBA notice flow, and state money-transmission/AML retention floor. The app preserved the research leads and continued. A direct `Run research` attempt first showed the visible alert `At least one research question is required.` A later chat request to create a structured research question and run research ended with `The research run could not be started in this response.`
- Canonical draft: Saved successfully as `Harborline UX Rerun — 05 — Privacy Controls for Payment Recipient Data response`. It contained developed sections for executive recommendation, notice and consent, purpose limitation/minimization, retention/deletion/suppression/rights, vendors/security, low-risk launch design, open facts/unverified leads, and a recommendation separate from decision.
- Canonical final: Finalization visibly reported `Final work product saved. The matter is ready for approval.` The contents showed `Approved / final response ...`.
- Recommendation: The draft recommended a narrow, reversible sender-side pilot; separate suggestion, payment, and fraud data; exclude invoice free text and broad device signals from suggestions; provide explicit suppression, deletion, and opt-out paths; and confirm missing facts before launch. The overview still showed `No working recommendation is saved yet.` even though the draft included a recommendation.
- Decision relevance: Relevant and visibly available through `Record decision`. The decision form stated that decisions are recorded against the matter and decision register.
- Recorded decision: Successfully recorded and visibly confirmed: `Proceed only with a narrow, reversible sender-recipient suggestion pilot; keep suggestion data separate from fraud-decision data.` Conditions and not-decided points were entered. The form reported `Decision recorded. The refreshed matter and decision register now include it.`
- Decision register and matter consistency: The matter contents visibly showed `Recorded decision Harborline UX Rerun — 05 — Privacy Controls for Payment Recipient Data`. The decision was also visibly confirmed after reload. The matter's overview and decision record were consistent on the pilot direction, but the stage changed back to a work-product flow after a later transition.
- Approval: Initial chat request to approve failed with `The approval could not be recorded in this response.` After re-finalizing the draft, the overview exposed `Approve response`; clicking it visibly reported `Approval recorded for the final work product.`
- Local delivery record: After approval, the overview showed `Delivery` and `Mark as sent`. The control was not clicked because it may represent delivery. No real contact or external delivery occurred.
- Required work: Visible progression was `Orient to the request and identify the first missing facts` → `Run or supervise first-pass research` → `Review the research packet and choose the legal path to test` → `Create work product based on the chosen path` → `Review, decide, and deliver the response`. After approval, the screen showed `Send the approved response`.
- Closed state: Not reached. A chat request to close locally ended with the visible response `The matter could not be closed in this response.`
- Reload consistency: Reload preserved the matter ID, title, recorded intake, research failure records, final response, and decision. Reload changed the visible stage from `Being drafted`/`Ready to send` activity to `Waiting on your judgment` before the decision flow, and the later re-finalization returned it to `Ready to send`. This was inspected as visible state, not inferred.
- Duplicate records: No duplicate matter was created. One matter ID was visible. The contents count grew as expected when intake, research, draft, final, and decision records were saved. Multiple repeated failure messages appeared as separate chat outputs, but no duplicate matter was visible.
- Internal-output leakage: No internal prompts, source code, hidden data, or other matter content was visible in the app output. The saved artifacts contained only the fictional Harborline request and the legal work entered for this matter.

## Timing and recovery

- Time to first useful artifact: Approximately 14 seconds after matter creation, when intake orientation and five visible questions appeared.
- Retries: One browser-condition recovery; one wait after matter creation because the button remained active while the matter opened; one direct research attempt after orientation; one changed-condition chat attempt to create a research question and run research; one chat continuation request after the intake presentation failure; one approval chat request; one local-closure chat request; one re-finalization after the durable decision to expose the approval control.
- Extra clicks: Approximately 15–20 extra clicks beyond a clean intake-to-final path, mainly opening/collapsing Overview, Matter contents, Chat, document review, and the decision form, plus recovery attempts.
- Recovery delay: Approximately 2–3 minutes waiting for intake and continuation responses; approximately 1 minute for draft/final/decision state changes. The research failure path added approximately 2 minutes and did not produce a usable research packet.

## Findings

- Working well:
  - Intake orientation was strong. The visible card summarized the ask, key facts, and issue map and clearly stated that unanswered facts would be treated as assumptions rather than a blocking gate.
  - The UI separated recommendations from durable decisions. The chat explicitly stated that it records a decision only when asked, and the decision form provided separate fields for decision, rationale, conditions, and not-decided points.
  - Guided questions were decision-relevant. The first question identified the fraud/suggestion pipeline as the most decision-changing fact. Answers visibly changed facts, issues, assumptions, and later questions.
  - The app degraded toward useful work after research failure. It preserved research leads marked `Public research failed` and allowed a full draft, final response, durable decision, and approval.
  - Draft editing and finalization were reliable once opened. The saved editor visibly showed the full developed memo, and finalization visibly created an approved/final response.
  - Decision recording was clear and auditable. The form named the matter as the record target, allowed conditions and unresolved points, and confirmed the refreshed matter and register.
  - Reload preserved the main artifacts and decision. This supported record integrity for the saved work.

- Product friction:
  - Phase: Intake. Exact wording: `The intake turn could not be saved or presented as a structured question. Please retry.` Minimal reproduction: answer the second guided question with `A mix of both` and send it. Expected: the next structured question or a clean fallback. Actual: the answer was recorded, but several follow-on questions became `Superseded`, and repeated retry messages appeared. Recovery: the chat continuation request eventually completed intake and moved the matter to research. Extra delay: about 1–2 minutes. Impact: reduced confidence that the structured intake state matched the visible question flow.
  - Phase: Research. Exact wording: `At least one research question is required.` Minimal reproduction: open Overview after intake and click `Run research` while the visible work list contains research leads but no structured research question. Expected: the system should use the visible research leads or explain how to create a question. Actual: run was rejected. Recovery: ask Chat to create a structured question and run research; that also returned a failure. Impact: research could not be initiated through the visible work action.
  - Phase: Research. Exact wording: `The research run could not be started in this response.` Minimal reproduction: send the visible Chat request to create a structured research question focused on non-customer notice and purpose limitation. Expected: a structured question, provider attempt, and preserved result/fallback. Actual: only a failure response was shown, while three research records later appeared as `Public research failed`. Impact: source-backed research was unavailable, and the attorney had to rely on labeled assumptions and a best-effort draft.
  - Phase: Overview/work product. Exact wording: `No working recommendation is saved yet.` Minimal reproduction: save a draft containing a clear recommendation and finalize it, then inspect Overview. Expected: recommendation artifact or status should reflect the draft's recommendation. Actual: the draft and final were saved, but Overview still showed no working recommendation artifact. Impact: the visible artifact summary was incomplete and required opening the draft to verify the recommendation.
  - Phase: Decision/work-product transition. Exact wording: `Start work product` followed by `Review draft`. Minimal reproduction: record a durable decision after finalization, then inspect Overview. Expected: the matter should remain in an internally consistent reviewed/final state or clearly explain the next action. Actual: the stage moved to `Waiting on your judgment`, the required work changed to `Create work product`, and the existing final response remained present. Clicking `Start work product` moved it to `Being drafted`; re-finalizing was needed to reach `Ready to send` and expose approval. Impact: extra navigation and uncertainty about whether the already-saved final remained authoritative.
  - Phase: Delivery. Exact wording: `Mark as sent`. Minimal reproduction: approve the response and inspect Delivery. Expected: a clear local-only delivery option or a clear external-send warning. Actual: the control was visible, but its side-effect boundary was not explained. The actor stopped before clicking. Impact: the experiment could not safely verify local delivery or closure.

- Broken behavior:
  - Phase: Intake/research. The structured-question and research path failed repeatedly enough to block the intended research phase. The app did preserve useful failure records and allowed continued drafting, so this is a core workflow failure with a best-effort workaround, not a total matter blocker.
  - Phase: Approval/closure. Chat requests to record approval and to close failed even though the UI later exposed direct controls after re-finalization. The first approval request produced `The approval could not be recorded in this response`, and the closure request produced `The matter could not be closed in this response.` Normal recovery required discovering and clicking direct Overview controls and re-finalizing. Closure remained unavailable after approval because delivery was pending.

- Browser-control errors:
  - The initial request to enable IAB visibility returned `IAB visibility is not supported in a subagent thread`. This was an environment capability limitation, not a locator or app error. One changed-condition recovery used a fresh IAB tab without visibility control. No further browser-control errors occurred.

- Environment failures:
  - IAB visibility was unsupported in this actor session. The in-app browser itself remained usable.
  - The research provider visibly failed for three research records with `Public research failed`. This was recorded as provider/fallback state by the app. No Chrome/Safari fallback was needed.

- Blockers:
  - External-delivery boundary: `Mark as sent` was visible after approval. It was not clicked because the user required stopping before real contact or external delivery and the control did not visibly state that it was local-only.
  - Product closure: no visible `Closed` state was reached. The app stated that the matter could not be closed in the local-closure request.
  - Research: no usable research packet was visibly produced; the app preserved failed research records and allowed best-effort legal work.

- Visible evidence:
  - Matter URL after creation and reload: `http://localhost:3000/matters/MAT-20260901-802a6f`
  - Visible matter title and ID matched the requested prefix and exactly one matter was created.
  - Visible success messages: `New current draft saved.`, `Final work product saved. The matter is ready for approval.`, `Decision recorded. The refreshed matter and decision register now include it.`, and `Approval recorded for the final work product.`
- Final visible state at end: Stage `Ready to send`; Required work `Send the approved response`; Delivery control `Mark as sent`; no external delivery; not closed.

## Continuation: delivery, closure, and reload

- Re-open time: 2026-09-01T08:25:00-07:00 (approximate)
- Continuation end time: 2026-09-01T08:26:40-07:00
- Added time: Approximately 2 minutes
- Matter reopened: Same visible URL and matter ID: `http://localhost:3000/matters/MAT-20260901-802a6f`; title remained `Harborline UX Rerun — 05 — Privacy Controls for Payment Recipient Data`.
- Browser recovery: The prior IAB session was unavailable. One changed-condition recovery reconnected a fresh IAB tab and opened the same Matter 05 URL. No other browser surface was used. No coordinator browser help was used.
- Delivery control inspection: Overview showed Stage `Ready to send`, Required work `Send the approved response`, and button `Mark as sent`. No confirmation dialog or explanatory pre-click text was visible. The control was clicked under the user's explicit authorization for local fictional delivery recording. The immediate visible status was exact: `Delivery outside the system recorded for the approved work product.` The button briefly showed `Working…` and no external contact form, recipient field, email address, or send-to-person control appeared. The UI wording records delivery as outside the system, but it does not explicitly say that no person or external service was contacted. Therefore, the evidence supports a local delivery-state record in Counsel OS, but the no-external-contact boundary remains not explicitly stated by the UI.
- Post-delivery state: After the delivery action, the visible required work changed to `Complete required work, then close the matter`, and a visible `Close matter` button appeared. This was the first direct visible closure control.
- Closure attempt: Clicked `Close matter`. Visible status: `Matter closed.` The banner and Stage both changed to `Closed`. Overview text changed to `Matter status` and `The work was delivered or otherwise resolved.`
- Reload result: Reloaded the same Matter 05 URL. Visible banner remained `Closed`; Stage remained `Closed`; matter title and ID remained unchanged. The saved intake, decision, approved/final response, and matter artifacts remained visible. No duplicate matter was created.
- Final state: Matter 05 is visibly `Closed`. The local delivery record is present as the status `Delivery outside the system recorded for the approved work product.` No recipient or external destination was shown, and no real contact was initiated by the actor. The UI did not provide an explicit statement that delivery sends nothing.
- Added finding: Delivery wording is ambiguous. The product records a state described as outside the system without showing a destination or a clear local-only explanation. This creates a safety boundary concern even though the observed action exposed no external-send UI and the matter closed successfully.
