# Matter 07 evidence

## Method

- Request title: Reinstating Customers After Automated Deactivation
- Actor model and reasoning: Senior product counsel for BSA/AML, banking regulation, and payments. Harborline Financial is fictional. The pilot request covers consumers and business admins, with Product, Identity Engineering, Fraud/AML Operations, Support, the banking partner, and a document vendor in scope.
- Browser used: Codex in-app Browser. Chrome/Safari were not needed.
- Changed-condition recovery attempt: After intake moved from working to complete, the progress-control locator disappeared. I re-read the visible DOM, opened Matter contents, used exact button labels after a strict-mode collision, navigated to Decisions, returned with Back, and reloaded the matter.
- Coordinator browser help: None needed. No external contact or delivery was attempted.
- Method compliance: One matter created. No agents, prior reports, other matters, source code, or other actor files inspected. No app code changed. All visible phases were attempted in order. Only this report was written.
- Start time: 2026-09-01 08:20 PDT (first browser action; approximate)
- End time: 2026-09-01 08:42 PDT
- Total minutes: About 22

## Visible workflow

- Matter title and visible ID: Harborline UX Rerun — 07 — Reinstating Customers After Automated Deactivation; MAT-20260901-08e52c
- Phases discovered: Just came in; Being researched; Waiting on your judgment. The visible closure response described the internal workflow as explore → generate, but the matter reached Waiting on your judgment after finalization.
- Phases attempted: Created intake; answered guided intake; ran the visible research action; inspected facts, issue map, participants, work items, research, recommendation, draft, final, Decisions register, delivery, closure controls; reloaded.
- Highest phase reached: Waiting on your judgment. The final work product was saved and the matter was not closed.
- Participants: Visible matter overview showed Product · Requester and Lawyer · Legal owner. The other named actors were not shown as participant records.
- Work items and assignment: Closure controls showed open work. Visible assignments included banking partner agreement review (Lawyer + Product), sanctions/AML re-screening ownership (Fraud/AML Operations), business authority rules (Lawyer + Product), accessibility compliance (Product), and audit logging (Identity Engineering). The visible work also listed reason taxonomy and notices/appeals dependencies. None were visibly complete.
- Final intake-card state: Intake complete. Recorded answers were: reason scope undecided and needs a recommendation; partner constraints unknown and must be checked; risk-based identity verification; risk-based sanctions/AML re-screening.
- Research artifact and provider/fallback state: Two research artifacts were visible: BSA/AML and sanctions re-screening, and consumer protection/adverse-action notices. Both showed Mock, no model-generated substantive analysis, 0 external sources, and a Polaris timeout fallback. The AML artifact showed 2 internal sources, 3 attempts, 46,567 ms elapsed, fallback scaffold_saved. The consumer-protection artifact showed 4 internal sources, 3 attempts, 46,319 ms elapsed, fallback scaffold_saved.
- Canonical draft: Saved and finalized. It recommended a narrow pilot for confirmed inactivity and low-risk remediable failed-verification cases, with human review for ATO, sanctions/AML, compliance-review, unresolved identity mismatch, and business-authority cases; it kept higher-risk payments limited.
- Canonical final: Visible tree showed “Approved / final response …” and the app reported “Final work product saved. The matter is ready for approval.”
- Recommendation: A separate recommendations.md was saved with a working recommendation. It remained explicitly separate from a durable decision.
- Decision relevance: The app said a durable decision was not required to preserve the recommendation and that no record_decision call had been made.
- Recorded decision: None. Overview and Decisions register showed no durable decision for this matter.
- Decision register and matter consistency: Decisions page showed 2 recorded decisions and 1 open recommendation, but not Matter 07. Matter overview said no durable decision was recorded. This was consistent.
- Approval: Not completed. The app reported “Pending your review.” No visible approve control appeared. Chat review said the work product was “Draft (awaiting your review)” and the next available step was move to generate, despite the final artifact already being present.
- Local delivery record: Attempted only after confirming no recipient or external-send flow was visible. The app reported: “The delivery record could not be created because the required tool is unavailable in this environment.” No external send occurred.
- Required work: Closure response showed “All required work completed — Not met.” It listed open workstreams and stated that first-pass research must be run or supervised. Research fallback artifacts existed, but open dependencies remained.
- Closed state: Not reached. Closure controls showed work product approval pending, unresolved dependencies, no durable decisions, and no delivery record. No Close control was visible.
- Reload consistency: Reloaded at 2026-09-01 08:42 PDT. Matter ID, title, Waiting on your judgment stage, intake answers, final artifact, no durable decision, and open dependencies persisted.
- Duplicate records: No duplicate matter was created. Intake generated repeated visible “structured question” error messages and duplicate-looking assumptions in facts.md, but only one matter ID was present.
- Internal-output leakage: Visible internal status exposed “Mock,” “Polaris,” timeout class, attempts, elapsed time, scaffold_saved, and internal artifact IDs. The final work product itself clearly labeled unverified leads and contained no external citations.

## Timing and recovery

- Time to first useful artifact: About 10 minutes from first browser action; intake completion and the issue/facts artifacts were visible after guided answers.
- Retries: Research fallback recorded 3 Polaris attempts for each visible research artifact. I made one exact-label retry after a strict-mode selector error and one page reload.
- Extra clicks: New matter; guided answers for four intake questions; Matter contents; Overview; failed Run research attempt; Issue map; Facts; New draft; draft save; Research artifact review; Recommendation edit/save; finalization; Decisions register; return; local-delivery request; closure request; reload.
- Recovery delay: About 1 minute for exact-selector recovery, about 1 minute for reload, and about 20–30 seconds after each chat request before the response appeared.

## Findings

- Working well: Intake captured the request and converted answers into facts, assumptions, issue map, dependencies, and work items. The same recovery shell was treated as a routing shell in the recommendation. Recommendations stayed separate from durable decisions. Finalization created a visible final artifact. Reload preserved the matter state.
- Product friction: The app initially showed five prioritized questions but superseded four old question cards and replaced them with a longer sequence. The Research button was visible but failed with “At least one research question is required.” Approval was described as available but had no visible action. The matter stayed Waiting on your judgment after finalization.
- Broken behavior: Guided intake produced repeated “The intake turn could not be saved or presented as a structured question. Please retry.” messages, while later stating intake was complete. The separate recommendation save did not update the overview text, which continued to say no working recommendation was saved. Finalization and approval state were inconsistent: a final artifact existed, but chat still called it a draft awaiting review and described explore → generate as the next step.
- Browser-control errors: One strict-mode selector error occurred because a research button matched both the tree row and artifact link. One click for “Stop showing progress” failed because the control had disappeared after the state changed. Both were recovered by fresh DOM inspection and exact selectors.
- Environment failures: Polaris research timed out after 3 attempts for each visible research artifact. The app saved scaffold fallback output with no substantive model-generated analysis and no external sources. Local delivery failed because the required delivery tool was unavailable.
- Blockers: Approval had no visible control. Six workstreams remained open. Closure controls reported all required work not met, approval pending, unresolved dependencies, no durable decision, and no delivery record. The matter could not reach Closed without additional user/app actions.
- Visible evidence: Matter MAT-20260901-08e52c; stage Waiting on your judgment after reload; “Final work product saved. The matter is ready for approval”; “Pending your review”; “Not created (tool unavailable)”; “No durable decision is recorded for this matter”; and the saved final/research artifact rows in Matter contents.
