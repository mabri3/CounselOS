# Matter 09 evidence

## Method

- Request title: Targeted Offers for Faster Payment Settlement
- Actor model and reasoning: Senior product counsel for BSA/AML, banking regulation, and payments. Used the saved profile. Harborline Financial was treated as fictional. Chime pages were not used.
- Browser used: Codex in-app Browser.
- Changed-condition recovery attempt: The first create click did not show navigation. I checked the visible state and retried once. The matter then opened at `MAT-20260901-81e05e`.
- Coordinator browser help: None needed. No agents were spawned.
- Method compliance: One matter was created. I followed visible phases in order. I did not inspect prior reports, other matters, handoff files, or source code. I did not send external messages or contact anyone.
- Start time: 2026-09-01 PDT, approximately 08:44 (first browser action; approximate because no timestamp was captured at that moment).
- End time: 2026-09-01T16:04:44Z / 2026-09-01 09:04:44 PDT.
- Total minutes: Approximately 20 minutes wall-clock, including visible wait periods.

## Visible workflow

- Matter title and visible ID: `Harborline UX Rerun — 09 — Targeted Offers for Faster Payment Settlement`; `MAT-20260901-81e05e`.
- Phases discovered: Just came in; intake/orientation; Being researched; Waiting on your judgment; Being drafted; final work product ready for approval; Waiting on your judgment after reload. The page also exposed research, draft, final, decision, and required-work controls.
- Phases attempted: Created intake; answered guided intake questions; completed the orientation work item; inspected overview and matter contents; ran the visible research action; inspected fallback research; created and saved a developed draft; finalized the draft; reloaded; recorded a durable decision; started required work product; reviewed the draft again.
- Highest phase reached: Being drafted after the decision. A final work product was also saved, with visible status “Final work product saved. The matter is ready for approval.” After reload the matter visibly persisted as Waiting on your judgment.
- Participants: Product — Requester. Lawyer — Legal owner. No other participants were visible.
- Work items and assignment: “Orient to the request” was assigned to Lawyer and completed. The overview then tracked fee terms, rail and partner rules, and pricing-versus-eligibility as open launch-gating work. Later required work changed to “Review the research packet and choose the legal path to test,” then “Create work product based on the chosen path.”
- Final intake-card state: Intake completed and saved. Visible facts included unknown fee terms, multiple but unidentified rails, unconfirmed partner/network rules, and Product/Pricing not yet deciding whether variables affect pricing or only eligibility. Three launch-gating items were tracked.
- Research artifact and provider/fallback state: Research artifacts were visible for ECOA/Reg B, state money transmission, and network/partner rules. The visible research document said “The Research Agent used Mock. No model-generated research analysis was filed,” “4 internal and 0 external source(s),” and “Polaris request failed (timeout)” with `attempts: 3`, `fallback: scaffold_saved`. The page also exposed “Public research failed” on research records. A second research run was attempted and correctly returned the visible alert “At least one research question is required.”
- Canonical draft: Created and saved a developed Markdown draft at the visible artifact `harborline-ux-rerun-09-targeted-offers-for-faster-payment-settle-85edf1.md`. It covered known facts, unverified assumptions, fair-lending/ECOA/Reg B, UDAAP, payments and partner rules, privacy, state and accessibility issues, pre-acceptance terms, a randomized holdout test, metrics, stop conditions, and correction/appeal handling.
- Canonical final: Finalized and saved. The visible artifact was `harborline-ux-rerun-09-targeted-offers-for-faster-payment-settle-85edf1-72f10b.md`, labeled “Approved / final response.”
- Recommendation: Working recommendation was to hold launch until the fee term sheet, rails and partner rules, and pricing-versus-eligibility model are confirmed, then use a narrow uniform eligibility-only pilot with clear terms, appeal, and monitoring. It was kept separate from the durable decision.
- Decision relevance: The matter showed a durable decision form and a decision register relationship list. The decision rested on facts, issue map, working recommendation, and three failed public-research records.
- Recorded decision: “Hold launch; if gating facts are resolved, run a narrow eligibility-only pilot with one uniform offer.” Rationale, conditions, and not-decided items were entered. Revisit date was visibly set to 2026-12-01 and Decided by was Lawyer.
- Decision register and matter consistency: The dialog visibly confirmed “Decision recorded. The refreshed matter and decision register now include it.” The overview then showed “Recorded decision” and the decision text remained consistent with the matter facts and recommendation.
- Approval: No visible Approve, Send for approval, or equivalent control appeared. Finalization showed “ready for approval,” but the page exposed no approval action. After reload the matter showed Waiting on your judgment.
- Local delivery record: No recipient, external-send, or local-delivery-record flow appeared. No delivery record was created.
- Required work: Orientation was completed. Research was attempted and later had no active research question. Work product was started, reviewed, and finalized. The post-decision required-work label remained “Generate the work product that supports the recommended path,” although the final artifact existed.
- Closed state: No Closed control or closed status appeared. The matter remained open and Waiting on your judgment after reload.
- Reload consistency: Reload preserved the exact matter ID and title, the intake facts, research artifacts, current draft, final artifact, and recorded decision. Stage changed from an in-session Being researched/Being drafted display to Waiting on your judgment after reload.
- Duplicate records: Exactly one new matter was created. No duplicate matter title or second matter ID was created. The matter contents count increased as intake, research, draft, final, and decision records were added.
- Internal-output leakage: The UI exposed internal provider and failure details: “Mock,” “No model-generated research analysis was filed,” “Polaris,” timeout attempts and elapsed time, `fallback: scaffold_saved`, and “Public research failed.”

## Timing and recovery

- Time to first useful artifact: Intake record and orientation facts became visible after the initial background work. The first useful substantive artifact was the saved fallback research packet after approximately 10–15 minutes of visible waits; the developed draft was saved later in the same run.
- Retries: One create retry after the first create click showed no navigation. One explicit research retry was attempted and returned “At least one research question is required.” The app also displayed repeated “Please retry” intake-save messages during background processing.
- Extra clicks: Opened Overview, Matter contents, Review intake, Chat, research artifact, current draft, final artifact, Record durable decision, and required-work controls. Closed each document after inspection. No external-send or delivery action was attempted because none was visible.
- Recovery delay: Approximately 1 second after the create retry, then repeated 5–20 second visible waits for intake, research fallback, and draft generation. Reload was used as a persistence check.

## Findings

- Working well: Matter creation preserved the full request. Guided intake ordered questions by decision impact and recorded useful facts and assumptions. The overview showed participants, owner, work items, artifacts, open facts, and required work. Draft and final artifact flows worked. The decision dialog clearly separated decision, rationale, conditions, and not-decided items. Reload preserved the record.
- Product friction: Guided intake produced several superseded questions and repeated “intake turn could not be saved or presented as a structured question” messages. The UI showed many repeated “Save as work product” controls. Research controls were not clear after the fallback packet existed. The stage and required-work text lagged behind visible artifact completion.
- Broken behavior: Public research timed out after three attempts and saved scaffold fallback content rather than substantive research. A later research action failed with “At least one research question is required” even though research artifacts were present. The final artifact was saved and marked ready for approval, but no approval control was visible. Required work remained open after finalization and after a durable decision.
- Browser-control errors: No browser-control or connection error occurred. The only selector failure was a stale attempt to click the create button after the first click had already opened the matter; the visible state check showed the matter URL and resolved the condition.
- Environment failures: Public research provider timeout; 0 external sources. The research document reported Mock provider use and scaffold fallback.
- Blockers: No visible approval action; no visible local delivery record; no visible Closed state; no substantive verified public research; research rerun blocked by no active question; required-work status did not visibly close after final work product and decision.
- Visible evidence: Matter URL `/matters/MAT-20260901-81e05e`; title and ID persisted after reload; visible “Intake is now complete and saved to the matter record”; visible “Current draft saved”; visible “Final work product saved. The matter is ready for approval”; visible “Decision recorded. The refreshed matter and decision register now include it”; visible reload state “Waiting on your judgment”; visible research warning with timeout, attempts 3, and scaffold fallback.
