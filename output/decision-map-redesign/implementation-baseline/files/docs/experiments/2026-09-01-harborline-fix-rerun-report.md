# Harborline fix rerun report — September 1, 2026

## 1. Executive result

The fixes materially improved durable output, but the live rerun did not prove a reliable end-to-end matter workflow.

The engineering gate passed before the experiment. COS-001 through COS-012 and ENV-001 through ENV-002 each received a final Sol Medium PASS. The combined backend suite passed 584 tests with one deprecation warning. Frontend workspace checks, focused scripts, typecheck, and build passed. A blank verification vault reached Closed and survived SQLite index deletion, rebuild, restart, and reload.

The live rerun then created all 10 planned matters. All 10 have a durable draft and final artifact. Four have durable decisions. Two reached approval, local delivery state, and Closed, and both remained Closed after reload.

The largest remaining defect is lifecycle reconciliation. A useful final can exist while the matter remains in Intake, Research, Explore, or Generate. Required work, recommendation state, approval controls, board state, and reload can then disagree. Only 2 of 10 matters reached Closed.

Other important live defects were repeated structured-intake failures, empty visible research actions, unsupported chat mutation claims, thin participant/work-item records, stale artifact text, and internal provider or review markup in lawyer-facing output.

The local runtime remained stable. The earlier server-loss failure did not recur. Polaris failures were observable and preserved useful fallback work, but no durable research result retrieved external authority.

## 2. Setup and method

- Repository: `/Users/bharris/Programs/counsel-os-mvp`
- Verification vault: `/private/tmp/counsel-os-harborline-final-verify-20260901-g`
- Experiment vault: `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`
- Raw evidence: `tmp/harborline-fix-rerun-20260901-073852/`
- App model: NeuralWatt Kimi K3 Fast.
- Requester: one fresh `gpt-5.6-luna`, medium agent.
- Setup attorney: one fresh `gpt-5.6-luna`, medium agent.
- Matter attorneys: ten fresh `gpt-5.6-luna`, medium agents, one matter each, serial live writes.
- Synthesis: one fresh `gpt-5.6-sol`, high agent after all ten runs.
- Browser: in-app browser. No Chrome or Safari fallback was needed.
- Coordinator actor-browser help: none used.
- Test-only popup handling: the launcher disabled only the expected new-vault confirmation dialog.
- External action: none. No real person or service was contacted.

Markdown was authoritative. A chat statement counted as success only when matching Markdown or visible reload evidence existed. Research packet-file totals and matters with packets are reported separately.

Matter 03 and Matter 04 raw reports used the run-folder creation time as their start time. That timestamp predates their dispatch. The normalized timing uses durable matter timestamps and coordinator dispatch order. Neither run breached the 35-minute cap.

The Sol High synthesis started each issue group with a focused Graphify query before source inspection. Causes below are labeled Confirmed, Likely, or Unknown in the detailed synthesis draft.

## 3. Strict before and after

| Measure | Earlier baseline | Rerun | Change |
|---|---:|---:|---:|
| Matters created | 9 | 10/10 | +1 matter |
| Saved research packet files | 8 | 14 | +6 files |
| Matters with a saved research packet | Not reported | 6/10 | New coverage measure |
| Matters with a draft | Not reported | 10/10 | 12 draft files total |
| Matters with a final | 4 | 10/10 | +6 matters; 11 final files total |
| Durable decisions | 3 | 4 | +1 |
| Durable approvals | 1 lifecycle pair | 2 | +1 |
| Durable local delivery records | 1 lifecycle pair | 2 | +1 |
| Closed matters | 0 | 2/10 | +2 |
| Complete intake | Not reported | 9/10 | Matter 02 remained active |
| Work-item files | Not reported | 26 | Quality varied |
| Retrieved external authority | Not reported | 0 | All durable public research failed |
| Duplicate matters | Earlier Run 7 created none | 0 in rerun | No retry duplicate |

Durable mutation spans total 56 minutes 36 seconds. The median is 5 minutes 8 seconds. These spans do not include all actor reading and review time.

## 4. Per-run result

| Run | Durable end state | Research | Draft/final | Decision | Approval/delivery/Closed | Main result |
|---|---|---|---|---|---|---|
| 01 | Explore | 3 fallback packets | Yes/Yes | Not relevant | No/No/No | Useful final survived reload; approval was unavailable. |
| 02 | Intake, active | None | Yes/Yes | None | No/No/No | Structured-intake errors allowed an intake summary to be finalized without developed research/recommendation. |
| 03 | Intake, complete | Running; no packet | Yes/Yes | None | No/No/No | Developed final exists while stage and dossier remain stale. |
| 04 | Generate | 1 fallback packet | Yes/Yes | Yes | No/No/No | Decision stayed consistent; reload regressed lifecycle/recommendation/research state. |
| 05 | Closed | 3 failed packets | Yes/Yes | Yes | Yes/Yes/Yes | Full normal-control lifecycle succeeded and survived reload. |
| 06 | Intake, complete | None | Yes/Yes | None | No/No/No | Structured errors and stopped cards; developed final survived reload. |
| 07 | Explore | 3 fallback packets | Yes/Yes | Not required | No/No/No | Recommendation/final persisted; approval absent; chat reported delivery tool unavailable. |
| 08 | Closed | 1 partial packet | Yes/Yes | Yes | Yes/Yes/Yes | Full lifecycle succeeded; artifact text had malformed `Lawyer` suffixes. |
| 09 | Generate | 3 fallback packets | Yes/Yes | Yes | No/No/No | Final and decision persisted; required work and approval remained stale. |
| 10 | Research | No saved packet | Yes/Yes | No | No/No/No | Chat falsely claimed research transition, decision, delivery, and closure; durable views disproved them. |

## 5. Working well and what to preserve

- All 10 matters preserved useful drafts and finals even when intake or research failed.
- Unknown facts usually became assumptions or work items instead of blocking a first pass.
- The direct decision dialog created four durable, consistent decisions.
- Direct lifecycle controls completed approval, local delivery state, closure, and reload in Matters 05 and 08.
- No duplicate matter or durable decision was observed.
- Long work did not invent percentages, phases, ETAs, or cancellation claims.
- Polaris failure records included class, three attempts, elapsed time, and fallback state.
- The local frontend and backend remained available through all ten serial matters.

## 6. Not working well

- Matter creation often lacked immediate feedback, which caused changed-condition checks and duplicate-click risk.
- Structured participants were usually only Product and Lawyer despite richer actor lists in the request.
- Work items existed, but owner, assignment, completion, and current-next-action controls were inconsistent.
- Repeated Answered, Superseded, Stopped, and error cards made intake history noisy.
- Target dates entered during creation were not reliably visible afterward. Root cause remains Unknown.
- Long Polaris waits were honest but often took about 46 seconds before fallback.
- `Mark as sent` records durable `outside_counsel_os` local state. It does not contact anyone, but the visible copy did not explain that boundary.

## 7. Broken behavior

### Lifecycle reconciliation — Confirmed

Finalization advances to Respond only from Generate, while the UI permits finalization from other stages. Approval, delivery, and closure controls are then hidden by the unchanged stage. This explains finals in Intake, Research, Explore, or Generate and stale reload state.

### False final-readiness text — Confirmed

The UI can say the final is ready for approval even when approval is unavailable.

### Recommendation disagreement — Confirmed

The overview reads the separate recommendation record. A recommendation inside the canonical final does not update that record, so the overview can say no recommendation exists.

### Structured intake failure — Confirmed condition; Likely provider cause

Six matters showed `The intake turn could not be saved or presented as a structured question. Please retry.` Matter 02 remained active.

### Empty research action — Confirmed

The visible Run research control can submit no question. The backend correctly rejects the empty question list.

### Unsupported durable-state claims — Confirmed

Matter 10 chat claimed a research transition, decision, delivery, and closure without matching durable state. Matter 08 had contradictory decision wording before dialog recording. The current phrase-based correction misses standalone and indirect variants.

### Lawyer-facing internal text — Confirmed

Provider/fallback details reached lawyer-facing research. Revision rendering also appended malformed `Lawyer` labels in Matters 08 and 10.

### Unsaved useful fallback — Confirmed durable gap; Likely tool-selection cause

Matter 10 produced useful research analysis in chat but no saved research packet.

## 8. Recurrence by issue

All issues passed engineering review before the live run. The live result below shows whether the observed defect recurred in the ten-matter workflow.

| Issue | Live result | Evidence |
|---|---|---|
| COS-001 | No template-parity recurrence | New vault had typed tools. Matter 10 protected-write error was a tool-selection/claim problem, not missing template parity. |
| COS-002 | Recurred | Only 2/10 Closed; final, stage, required work, approval, board, and reload often disagreed. |
| COS-003 | Partial recurrence | Direct decisions were durable 4/4; chat decision claims were contradictory or false. |
| COS-004 | Partial recurrence | Draft/final preservation passed 10/10; unsupported mutation claims recurred. |
| COS-005 | No recurrence found | No lost, double-encoded, or stringified nested arguments were observed. |
| COS-006 | Partial recurrence | 9/10 intake complete; repeated structured failures; Matter 02 active. |
| COS-007 | No durable recurrence found | No duplicate matter or decision. Matter creation retry risk remains. |
| COS-008 | Recurred | Participant and work-item operating view remained incomplete. |
| COS-009 | Partial recurrence | State words were usually truthful, but historical card noise remained. |
| COS-010 | No false-progress recurrence | No invented percent, ETA, phase, or cancellation claim. |
| COS-011 | Recurred | Provider internals, path/trace-like details, and malformed `Lawyer` labels appeared. |
| COS-012 | Recurred | Overview and lifecycle text often named stale or wrong artifact state. |
| ENV-001 | Observability passed; environment degraded | Timeout, attempts, elapsed, fallback, and useful analysis persisted; no authority retrieved. |
| ENV-002 | No recurrence | Services remained available for all ten matters. |

## 9. Evidence-based repair backlog

| Priority | Smallest useful correction | Proof |
|---|---|---|
| P0 | Reconcile durable lifecycle state after every canonical final. | Finalize from Intake, Research, Explore, and Generate; after reload, stage, next action, final, and approval availability agree. |
| P0 | Make finalization text depend on the resulting durable state. | Never say ready for approval unless Approve is available. |
| P0 | Make Run research send a real question: first saved question, visible entered question, then matter title fallback. | The control never sends an empty list and saves a packet or truthful failure. |
| P0 | Build mutation-success text from successful typed results, including standalone headings and indirect claims. | Matter 10 wording variants cannot claim decision, delivery, closure, or stage without Markdown. |
| P0 | Add deterministic intake recovery after the second structured failure. | One valid next question or a clear complete state; no repeated error loop. |
| P1 | Reconcile overview recommendation with the canonical artifact or save the recommendation in the same typed mutation. | A final with a recommendation cannot coexist with “No recommendation saved.” |
| P1 | Change delivery copy to explicit local-state wording. | UI says the action records outside Counsel OS and contacts no one. |
| P1 | Remove provider/path/trace/author markup from lawyer-facing documents. | Matter 08 and 10 fixtures render clean text; diagnostics remain separate. |
| P1 | Give each work item owner, assignment, and completion controls; add participant maintenance. | Reload preserves the queue and next action. |
| P1 | Instrument one target-date creation and fix the first proven break. | Input, POST, response, request Markdown, matter Markdown, and reload agree. |
| P2 | Return durable matter creation before slow intake startup or show a durable-created pending state; add a creation key if repeats remain possible. | One click creates one matter during slow intake. |
| P2 | Compact repeated historical failure cards into one status group. | One current card plus expandable audit history. |

## 10. Cross-run and timing patterns

- Durable artifact output was reliable: 10/10 finals. Workflow completion was not: 2/10 Closed.
- Direct controls were more reliable than chat claims.
- Research failure was systemic. Six matters saved 14 packets; four saved none.
- Closed matters had the longest durable mutation spans because they performed more state changes.
- Total durable span was 56m36s; median 5m08s.
- Detailed Polaris failures commonly used three attempts and about 46 seconds.
- Delayed matter creation caused stale-locator errors and repeat-click risk without duplicate matters.

## 11. Browser-control errors

- The separate in-app visibility control was unsupported during setup and some runs; fresh/reconnected in-app tabs recovered.
- One long wait reset the Matter 08 browser-control session; reconnect succeeded.
- Strict locator ambiguity occurred for duplicate Matters links, Research controls, and Next versus Next.js controls.
- Stale locators followed successful navigation or state changes in several runs.
- No Chrome/Safari fallback and no coordinator actor-browser help were used.

## 12. Environment failures

- Polaris retrieved no external authority. Durable records showed timeout class, three attempts, elapsed time, and fallback.
- The root Polaris timeout cause is Unknown.
- The in-app visibility limitation and one session reset were browser-environment issues, not product-state contamination.
- Matter 07 chat claimed a delivery tool was unavailable, but direct lifecycle controls worked in Matters 05 and 08. This is Likely provider tool selection or claim error, not a missing new-vault tool.
- Local frontend/backend runtime remained stable.

## 13. Incomplete or contaminated runs

No run was contaminated. Writes were serial. Each fresh attorney handled one matter. Later actors did not receive earlier findings. No coordinator browser action changed an actor matter. No external message was sent.

Incomplete durable outcomes:

- Matter 02 remained active intake.
- Matter 03 had a final while research/stage remained Intake.
- Matters 01, 04, 06, 07, and 09 did not reach approval, delivery, or closure.
- Matter 10 had no saved research packet, durable decision, delivery, or closure. Positive chat claims were disproved.
- Only Matters 05 and 08 completed the full lifecycle.

## 14. Method compliance

- Exactly 10 complete requester requests and 10 matter reports exist.
- The setup and all matter actors used the required Luna Medium model and one fresh actor per matter.
- Live writes were serial.
- No run exceeded the 35-minute cap after invalid raw start timestamps were corrected.
- Raw evidence remained unchanged. The coordinator normalized it after all actors finished.
- One fresh Sol High agent performed synthesis after the tenth run.
- Product, browser-control, and environment failures are separate.
- The repository `vault/` hash remained `1146f14be1d8f6b768b48ad79c96d85277e0bdc41d8ab2066e60ee24ba2d2983` before and after implementation, verification, and the experiment.
- No commit, push, deployment, destructive cleanup, or real external contact occurred.

## Verification record

- Backend: 584 passed, 1 deprecation warning, 93.83 seconds.
- Final output-hygiene focused suite: 42 passed, 1 warning.
- Frontend workspace UX and focused scripts: passed.
- Frontend typecheck: passed.
- Frontend production build: passed.
- Blank-vault typed-tool browser acceptance: passed.
- SQLite deletion/rebuild and local restart: passed in the verification vault.
- Graphify update: passed before the experiment; final update recorded after this report.

## Evidence files

- Normalized evidence: `tmp/harborline-fix-rerun-20260901-073852/normalized-evidence.md`
- Sol High synthesis: `tmp/harborline-fix-rerun-20260901-073852/synthesis-draft.md`
- Requester report: `tmp/harborline-fix-rerun-20260901-073852/actors/requester-report.md`
- Setup report: `tmp/harborline-fix-rerun-20260901-073852/actors/setup-attorney-report.md`
- Matter reports: `tmp/harborline-fix-rerun-20260901-073852/actors/matter-01-report.md` through `matter-10-report.md`
