# Matter 01 evidence

## Method

- Request title: Expanding Instant Account Opening for Small Businesses
- Actor model and reasoning: Senior product counsel focused on BSA/AML, banking regulation, and payments. Harborline is fictional. Chime was treated only as broad business-model context and no Chime process was treated as a Harborline fact.
- Browser used: Codex in-app Browser, connected to `http://localhost:3000`.
- Changed-condition recovery attempt: The first Create matter click did not show an immediate change. I waited, checked the visible page and browser logs, then retried once. The second check showed navigation to the created matter. No Chrome or Safari fallback was needed.
- Coordinator browser help: Not needed.
- Method compliance: Used the in-app browser first and controlled the visible UI. Used visible normal controls and agent actions. No agents were spawned. No application code was changed. Created exactly one matter with the required title prefix.
- Start time: 2026-09-01, approximately 07:39 PDT.
- End time: 2026-09-01, approximately 07:50 PDT.
- Total minutes: Approximately 11.

## Visible workflow

- Matter title and visible ID: `Harborline UX Rerun — 01 — Expanding Instant Account Opening for Small Businesses`; visible URL ID `MAT-20260901-ef7e21`.
- Phases discovered: Just came in; Being researched; Waiting on your judgment. The overview then showed research, working draft, final response, decision, and matter-maintenance controls.
- Phases attempted: Created matter; completed guided intake; ran the visible Run research action; inspected the research fallback; generated a best-effort recommendation in chat; saved it as work product; opened and inspected the draft; finalized the current draft; inspected the durable-decision form without submitting it; reloaded the matter.
- Highest phase reached: Waiting on your judgment, with final work product saved and visible status “Final work product saved. The matter is ready for approval.”
- Participants: Visible matter overview showed Product · Requester and Lawyer · Legal owner. No banking partner, KYC/KYB vendor, onboarding engineering, applicant, beneficial-owner, or operations participant was visibly added.
- Work items and assignment: Three open items were visible under “Things to consider,” all marked optional: banking partner provisional-access rules; KYC/KYB vendor match thresholds; operations review service-level commitment. The overview showed “0 required · 3 optional.” No explicit assignee was visible for these items.
- Final intake-card state: “Intake is complete. The matter record now reflects the full dossier: confirmed facts, three open work items, seven legal workstreams, and three assumptions needed to proceed.” Each of the five guided questions was visibly answered; the three unknowns were preserved as gaps/work items.
- Research artifact and provider/fallback state: The dossier visibly reported `Research warning: Polaris: Polaris request failed (timeout).` It also reported `Polaris status: failed; class: timeout; attempts: 3; elapsed: 46662 ms; fallback: scaffold_saved.` The matter contents later showed three research buttons, each labeled “Public research failed.” The overview also showed the UI alert “At least one research question is required” when Run research was clicked, although a fallback research packet was later present.
- Canonical draft: Saved as current draft. Visible text included “Current draft saved.” The draft covered confirmed facts, key recommendations, assumptions, and no durable decisions.
- Canonical final: Saved. Visible status was “Final work product saved. The matter is ready for approval.” Matter contents showed “Approved / final response Harborline UX Rerun — 01 — Expanding Instant Account Opening for Small Businesses response.”
- Recommendation: Developed and visible. It recommended a pre-account experience where possible; written banking-partner confirmation before pilot; deposit-only pending status; collection of 25%+ beneficial owners and one control person; vendor verification with documentary/manual fallback; disclosures for limits, verification, failed verification, fund return, and realistic timing; escalation for foreign owners, off-list industries, sanctions/PEP/adverse media hits, mismatches, low vendor confidence, unsupported entity types, and duplicates; five-year post-closure retention for CIP/beneficial-owner records; event-driven refresh at minimum; and a narrow pilot with capped weekly volume. It clearly stated that external research failed and marked partner, vendor, and operations details as unverified.
- Decision relevance: The visible Record durable decision dialog explained that a decision is for “a material position, recurring risk, future advice, or a condition that must be monitored.” The recommendation contained decision points and conditions, but the user request did not ask for a durable decision.
- Recorded decision: None. The dialog was opened and then cancelled. The matter visibly continued to say “No durable decision is recorded for this matter.”
- Decision register and matter consistency: No decision was recorded. The recommendation itself stated “Decisions — None recorded, per your instruction.”
- Approval: No separate approval control was visible. The final-save status said the matter was ready for approval, not approved by a separate user action.
- Local delivery record: No local delivery-record control was visible. No external contact, send, upload, or delivery was attempted.
- Required work: Before research, the overview said “Run or supervise first-pass research.” After the final save, the overview said “Review the research packet and choose the legal path to test.” The visible count remained “0 required · 3 optional.”
- Closed state: No Close or Closed control/state was visible after finalization. The matter remained “Waiting on your judgment.”
- Reload consistency: After reload, the exact title, matter ID URL, completed intake answers, assumptions, work items, and saved chat content were visible. The matter remained “Waiting on your judgment.” The visible alert “At least one research question is required” also persisted.
- Duplicate records: One matter was created. No duplicate matter title or second matter ID was visible. The matter contents count changed as artifacts were added: 15 documents after intake, 19 after the recommendation chat, and 21 after saving the draft/final artifacts.
- Internal-output leakage: The visible dossier and recommendation included internal path-style references such as `03_Matters/.../research/RES-...md` and raw provider/fallback labels. This is useful evidence for auditability but is also internal-output leakage if shown to an end user.

## Timing and recovery

- Time to first useful artifact: Approximately 2 minutes from matter creation to the visible completed intake dossier and open work items; the first visible useful answer was the completed guided intake.
- Retries: One retry of the matter-creation interaction after the first delayed click. Research itself reported three provider attempts and a timeout.
- Extra clicks: Opened Overview, Issue map, Facts, Dossier, Matter contents, New chat, and the Record durable decision dialog for inspection. Clicked Run research once. Clicked Save as work product once and Finalize current draft once. Opened and cancelled decision recording. Reloaded once.
- Recovery delay: Approximately 2–3 seconds for delayed matter navigation; research fallback took roughly 46.7 seconds according to the visible dossier record, with additional waiting for intake/recommendation completion.

## Findings

- Working well: Intake asked the gating partner question first. Unknown answers became explicit work items instead of blocking the matter. The UI preserved confirmed facts, assumptions, issue map, recommendation, draft, and final artifact. The recommendation was developed, separated recommendations from decisions, and stated the provider failure rather than inventing authority. Finalization and reload persistence worked.
- Product friction: The first matter-creation click gave no immediate visible feedback. The research action presented “At least one research question is required” even though the matter had completed legal workstreams and later generated research fallback artifacts. Matter contents showed headings and artifact counts but did not visibly show all child documents without further navigation. Work-item assignment was not visible. Approval and local delivery were not visibly available after finalization.
- Broken behavior: The visible Run research action failed with “At least one research question is required.” The UI then still produced research-result entries and a fallback packet through later agent work. The matter stayed in “Being researched” during some completed-artifact states and only later showed “Waiting on your judgment.”
- Browser-control errors: One Playwright selector timeout occurred on the retry call because the create button no longer matched after delayed navigation. A fresh snapshot showed the matter had opened successfully. No console warning or error logs were visible.
- Environment failures: Polaris/public research timed out after three attempts, with visible class `timeout`, elapsed `46662 ms`, and `fallback: scaffold_saved`. The research buttons were visibly labeled “Public research failed.”
- Blockers: Partner provisional-access rules, KYC/KYB match thresholds, and operations SLA remained unverified. No separate approval, local delivery, or Closed state could be attempted from visible controls. No coordinator browser help was needed.
- Visible evidence: Exact visible matter title and ID URL; stage labels; participant list; five answered intake regions; three optional work items; dossier facts, assumptions, seven workstreams, and open questions; research warning and timeout metadata; recommendation text; “Current draft saved”; “Final work product saved. The matter is ready for approval”; “No durable decision is recorded for this matter”; and reload persistence.
