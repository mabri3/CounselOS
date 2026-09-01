# Matter 02 evidence

## Method

- Request title: Using Background Checks for Account and Payment Risk
- Actor model and reasoning: Matter Attorney 02 of 10; senior product counsel focused on BSA/AML, banking regulation, and payments.
- Browser used: Codex in-app Browser. Chrome and Safari were not needed.
- Changed-condition recovery attempt: Initial New matter click appeared to have no navigation. Recovery: opened Matters, verified the new matter existed, and opened it by its visible title. Initial guided intake later returned a structured-question error; recovery was to continue with a different answer, wait for queued processing, save the available intake as work product, and use the visible draft/final controls.
- Coordinator browser help: Not needed.
- Method compliance: Used visible in-app browser. Created exactly one matter. Did not inspect source code, earlier actor reports, other matters, handoff files, or prior findings. No application code changed. No external contact or delivery was attempted.
- Start time: 2026-09-01 07:44 PDT (approximate)
- End time: 2026-09-01 07:56 PDT
- Total minutes: Approximately 13

## Visible workflow

- Matter title and visible ID: Harborline UX Rerun — 02 — Using Background Checks for Account and Payment Risk; MAT-20260901-d57a6d.
- Phases discovered: Just came in / intake and orientation; research; work product current draft; final / approval; local delivery and closure controls were not exposed in the visible overview.
- Phases attempted: Created matter; opened chat; answered guided intake questions; inspected overview, facts, and issue map; saved intake as current draft; finalized current draft; inspected matter contents; reloaded.
- Highest phase reached: Final work product saved. Visible status said: “Final work product saved. The matter is ready for approval.”
- Participants: Visible overview showed Product · Requester and Lawyer · Legal owner. Other requested actors were not added by the visible workflow.
- Work items and assignment: Visible current work item “Orient to the request,” assigned to Lawyer. “Open work item” and “Complete this work item” were visible. It was not completed.
- Final intake-card state: Visible answers saved: vendor/module treated as CRA and consumer report (`yes_cra`); criminal-history data excluded (`exclude`); Harborline makes the final deny/limit decision (`Harborline`). Earlier “I don't know — need to check with the vendor” remained visible as a prior answer.
- Research artifact and provider/fallback state: No research packet was saved. The workflow showed queued/working states and repeated “The intake turn could not be saved or presented as a structured question. Please retry.” No provider result or fallback research packet was visible.
- Canonical draft: Saved automatically from the intake summary. Visible document name ended in `-548391.md`; content was the intake summary and five questions, not a developed legal memo.
- Canonical final: Finalized successfully. Visible status: “Final work product saved. The matter is ready for approval.” The visible final document name ended in `-548391-babaf4.md`.
- Recommendation: No working recommendation was saved. Overview explicitly said “No working recommendation is saved yet.”
- Decision relevance: Intake questions were decision-relevant: FCRA/CRA status, criminal-history scope, final decision owner, sanctions process, and banking-partner requirements.
- Recorded decision: No durable decision was recorded. Overview explicitly said “No durable decision is recorded for this matter.”
- Decision register and matter consistency: No decision register entry was visible. Matter remained “Just came in” after finalization.
- Approval: No approval control was visible after finalization. The status said ready for approval, but no visible approval action was found.
- Local delivery record: No local delivery record or send action was visible. No delivery was attempted.
- Required work: Overview showed required work “Orient to the request and identify the first missing facts.” It showed 0 required and 9 optional considerations after intake processing.
- Closed state: Not reached. Matter stayed open and “Just came in.”
- Reload consistency: Reload preserved the matter title, ID, “Just came in” stage, saved intake summary, answers, and current workflow state.
- Duplicate records: One matter was created. The initial click did not visibly navigate, but the matters list showed only one Matter 02 record. Multiple repeated chat summaries and eight visible “Save as work product” buttons appeared in the rendered conversation; these were conversation cards, not additional matters.
- Internal-output leakage: Visible UI exposed internal workflow wording such as “yes_cra,” “exclude,” “Working,” “Queued,” and “Superseded.”

## Timing and recovery

- Time to first useful artifact: About 2 minutes after matter creation; visible intake summary saved facts, assumptions, issues, and open questions.
- Retries: One recovery navigation after the create click appeared inert; one changed-condition intake recovery after structured-question failure; one finalization attempt; one reload verification.
- Extra clicks: Matters navigation, exact matter link, Overview, Facts, Issue map, Chat, Stop showing progress, Save as work product, current draft, Finalize current draft, Matter contents, and reload.
- Recovery delay: About 1 minute for the matter list recovery; about 30–40 seconds of waits across queued intake processing and finalization.

## Findings

- Working well: Matter creation accepted the exact title prefix and preserved the complete request. The intake summary was useful and identified 8 initial workstreams, then reduced them to 7 after answers. Facts, assumptions, issues, open questions, participants, owner, draft, and final artifact were visible. Reload preserved state.
- Product friction: Matter creation gave no immediate confirmation or navigation. The guided intake was slow and required repeated waits. Overview did not expose the requested actor set or a clear way to add participants. Research and recommendation states were not easy to distinguish from queued chat work.
- Broken behavior: The app repeatedly displayed “The intake turn could not be saved or presented as a structured question. Please retry.” It then continued to generate duplicate-looking summaries and still allowed draft and final creation. No research packet or recommendation was produced, yet finalization was allowed.
- Browser-control errors: One strict-mode locator error occurred because two visible “Matters” links matched. Retargeting through the named Main navigation resolved it. This was an actor locator error, not an application defect.
- Environment failures: No browser connection failure, console error, or external-service failure was observed. Research/chat remained queued or working for extended periods without a visible result.
- Blockers: No visible approval, delivery, closure, decision-register, or required-work completion path was found after finalization. Research and developed legal work were blocked by the structured-question and queued-work behavior.
- Visible evidence: Matter URL `/matters/MAT-20260901-d57a6d`; title and stage `Just came in`; overview text `No research packet is saved yet`, `No working recommendation is saved yet`, and `No durable decision is recorded for this matter`; finalization status `Final work product saved. The matter is ready for approval`; repeated error text `The intake turn could not be saved or presented as a structured question. Please retry.`

## Best-effort legal/product work (generated analysis; not a verified research packet)

Assumptions: the vendor is a CRA for the background-screening module; Harborline is the entity making the adverse-action decision; criminal-history data is excluded from the initial launch; the banking partner retains separate CIP/KYC and sanctions responsibilities unless confirmed otherwise.

Recommendation: approve only a narrow fraud/identity pilot after vendor diligence. Keep identity verification, device/account-takeover signals, and payment-fraud signals separate from any background-screening or criminal-history product and data path. Do not use criminal-history data in the initial A/B test. Do not treat a sanctions hit as a generic fraud score; use a separate sanctions-screening workflow with match review and escalation.

If a module produces a consumer report and Harborline uses it for an account or access decision, treat FCRA as applicable pending written vendor confirmation. Confirm permissible purpose, certifications, user responsibilities, accuracy controls, public-record procedures, dispute reinvestigation, retention, source jurisdictions, adverse-action notice content, and vendor/subprocessor controls. Before a denial or limitation based in whole or in part on a report, provide the required pre-adverse process where applicable, a copy/summary of rights, and a final adverse-action notice with the CRA contact information and the principal reasons, subject to counsel confirming the exact product and decision path.

For the experiment, randomize only among eligible applicants after the same baseline onboarding and fraud controls. Keep decision thresholds, notices, manual-review triggers, reviewer guidance, and appeal/dispute handling constant. Log treatment assignment, signals used, overrides, outcomes, and adverse-action reasons. Monitor approval, false-positive, manual-review, dispute, and outcome rates by relevant groups where lawful and appropriate. Stop or revise the test if treatment changes legal rights, causes unexplained group disparities, or creates inconsistent notices.

Missing facts: exact data fields; whether device data is personal information and how it is retained; vendor CRA status by module; permissible purpose and certifications; consent and notice text; data sources and jurisdictions; dispute and reinvestigation SLA; retention/deletion; subprocessors; explainability; existing OFAC process; banking-partner requirements; final decision authority in practice; state-law coverage; and the proposed A/B allocation and metrics.

Unverified leads: the app-generated assumption that the vendor is likely a CRA; the app-generated assumption that the partner has existing CIP/KYC; any legal conclusion above that depends on product-specific facts. No external source was verified during this live UI run.
