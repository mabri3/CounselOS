# Harborline fix rerun — normalized evidence

## Evidence rules

- Raw actor reports are preserved in `actors/matter-01-report.md` through `actors/matter-10-report.md`.
- Durable success is counted only when the experiment vault Markdown or a visible reload supports the claim.
- A chat claim without matching matter, decision, delivery, or closure state is counted as a failure.
- Research is counted by both matters with at least one saved packet and total saved packet files. This avoids gaming the denominator when one matter has several packets.
- Draft and final success are counted by matters with at least one artifact. Extra artifact files are reported separately.
- The durable mutation span is `matter.md created_at` to `updated_at`. It is not total actor wall time.
- Matter 03 and Matter 04 raw reports used the run-folder creation time as the actor start time. That source predates their dispatch and is invalid for per-matter timing. Their durable timestamps and coordinator dispatch order show no 35-minute cap breach.

## Method and isolation

- Experiment vault: `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`
- Earlier active verification vault: `/private/tmp/counsel-os-harborline-final-verify-20260901-g`
- Raw run folder: `tmp/harborline-fix-rerun-20260901-073852/`
- App model: NeuralWatt Kimi K3 Fast.
- Requester: one `gpt-5.6-luna`, medium agent; exactly 10 complete requests.
- Setup: one fresh `gpt-5.6-luna`, medium agent through the in-app browser.
- Matters: ten fresh `gpt-5.6-luna`, medium agents, one matter each, with serial live writes.
- Browser: every setup/matter actor used the in-app browser. Several subagents could not use the separate visibility control but recovered by opening or reconnecting a fresh in-app tab. No Chrome or Safari fallback was needed.
- Coordinator browser help: none used for actor runs. The coordinator only operated the browser before the actors to create the isolated vault and save Kimi K3 Fast.
- Test-only vault confirmation: disabled by the local launcher so expected vault-update confirmation dialogs were not counted as stalls.
- External action: none. `Mark as sent` was used only where no recipient, address, or external-send flow appeared. The product recorded `outside_counsel_os` delivery state locally.
- Contaminated runs: none.

## Strict before and after

Earlier strict baseline:

- 9 matters created.
- 8 saved research packets.
- 4 canonical final work products.
- 3 canonical decisions.
- 1 recorded approval/delivery.
- 0 Closed matters.
- Earlier Run 7 created no matter because the local server was unavailable.

Rerun durable result:

- 10/10 matters created.
- 9/10 matters have complete intake; Matter 02 remains active intake.
- 6/10 matters have at least one saved research packet; 14 packet files total. Matter 10 has useful fallback chat analysis but no saved research packet.
- 10/10 matters have at least one draft; 12 draft files total.
- 10/10 matters have at least one final artifact; 11 final files total. Matter 08 has two final files, with one later approved canonical final.
- 4/10 matters have one durable decision; 4 decision files total.
- 2/10 matters have durable approval.
- 2/10 matters have durable local delivery state.
- 2/10 matters are Closed and remained Closed after reload.
- 26 work-item files exist across the ten matters.
- No retrieved external authority was recorded. All durable public-research statuses were failed and saved with fallback where a packet exists.
- No duplicate matter was created.
- Durable mutation spans total 56 minutes 36 seconds; median 5 minutes 8 seconds. These spans do not include all actor review time.

## Per-run durable table

| Run | Matter | Final durable status | Intake | Research packets | Drafts / finals | Decision | Approval / delivery / Closed | Durable mutation span | Key evidence |
|---|---|---|---|---:|---:|---|---|---:|---|
| 01 | MAT-20260901-ef7e21 | Explore | Complete | 3 failed fallback packets | 1 / 1 | Not relevant; none | No / No / No | 5m12s | Useful recommendation and final survived reload; approval controls not visible. |
| 02 | MAT-20260901-d57a6d | Intake | Active | 0 | 1 / 1 | Relevant, none | No / No / No | 3m26s | Structured-intake errors; intake summary could be finalized without research or developed recommendation. |
| 03 | MAT-20260901-bb4979 | Intake | Complete | 0; research remained running | 1 / 1 | None | No / No / No | 4m45s | Developed final exists while stage remains Intake; dossier and lifecycle state stayed stale. |
| 04 | MAT-20260901-215228 | Generate | Complete | 1 failed fallback packet | 1 / 1 | Yes; register/matter consistent | No / No / No | 5m31s | Reload regressed final/recommendation/research state and required-work state. |
| 05 | MAT-20260901-802a6f | Closed | Complete | 3 failed packets | 1 / 1 | Yes; consistent | Yes / Yes / Yes | 8m47s | End-to-end normal controls reached Closed and survived reload. Delivery wording did not clearly explain the local-only boundary. |
| 06 | MAT-20260901-acb55f | Intake | Complete | 0 | 1 / 1 | Relevant, none | No / No / No | 5m04s | Structured-intake errors and stopped cards; developed final survived reload. |
| 07 | MAT-20260901-08e52c | Explore | Complete | 3 failed fallback packets | 1 / 1 | Not required; none | No / No / No | 4m28s | Recommendation/final survived reload; approval absent; delivery tool reported unavailable. |
| 08 | MAT-20260901-5ba046 | Closed | Complete | 1 partial failed packet | 2 / 2 | Yes; register/matter consistent | Yes / Yes / Yes | 8m20s | Full lifecycle succeeded. Research artifact contained malformed `Lawyer` suffixes; earlier chat decision claim was contradictory before dialog recording. |
| 09 | MAT-20260901-81e05e | Generate | Complete | 3 failed fallback packets | 2 / 1 | Yes; consistent | No / No / No | 7m45s | Final and decision persisted, but required work and approval path remained open/stale. |
| 10 | MAT-20260901-621511 | Research | Complete | 0 saved; useful chat fallback only | 1 / 1 | No; chat claim disproved | No / No / No | 3m18s | False chat claims for research transition, decision, delivery, and closure; overview, register, board, and reload stayed Research. |

## Cross-run evidence

Working well:

- All ten matters were created; the earlier local-server matter-loss failure did not recur.
- Every matter preserved a useful draft and final artifact, even when research or structured intake failed.
- Unknown facts usually became assumptions or work items instead of blocking useful first-pass work.
- Direct decision-dialog writes were durable and consistent in all four recorded-decision matters.
- Direct lifecycle controls completed approval, local delivery state, closure, and reload consistency in Matters 05 and 08.
- No duplicate matter or duplicate durable decision was observed.
- Long work used elapsed/working states without invented percentages, phases, or ETAs.
- Polaris failures showed timeout class, three attempts, elapsed time, and fallback state while useful analysis remained available.
- The local services stayed available for all ten matters.

Product friction and broken behavior:

- Structured intake repeatedly showed `The intake turn could not be saved or presented as a structured question. Please retry.` in Matters 02, 03, 05, 06, 07, and 09. Matter 02 remained active intake.
- The visible Run research control often rejected work with `At least one research question is required`, even when research leads existed.
- Provider research retrieved no external authority. Saved fallback packets existed in six matters; Matter 10 fallback analysis was not saved as a packet.
- Final artifacts often existed while stage, required work, dossier, or overview remained at Intake, Research, Explore, or Generate.
- Overview repeatedly said no working recommendation was saved even when recommendation content existed in the canonical draft.
- Approval and delivery controls were discoverable only after specific state transitions. Only two matters reached Closed.
- `Mark as sent` records local `outside_counsel_os` state but does not clearly say that it contacts no one.
- Chat made unsupported durable-state claims in Matter 08 before dialog recording and in Matter 10 for decision, research transition, delivery, and closure. Matter 10 durable views disproved all claims.
- Matter 10 also displayed a protected-write typed-tool error while later chat text implied success.
- Lawyer-facing artifacts exposed internal provider/fallback details and, in Matters 08 and 10, malformed inline `Lawyer`/trace fragments.
- Participant records were generally only Product and Lawyer despite richer actor lists in requests.
- Work items were created, but owner, assignment, completion, and current-next-action visibility were inconsistent.
- Creation feedback was delayed in most runs, causing changed-condition checks and duplicate-click risk.
- Due dates entered during creation were not consistently visible afterward.

## Preliminary recurrence map for synthesis

- COS-001: Template/tool parity passed engineering verification. Live typed tools generally worked, but Matter 10 showed one protected-write error; classify the specific live writer/tool path separately from template parity.
- COS-002: Recurred. Only 2/10 reached Closed; stage, required work, final, approval, board, overview, and reload often disagreed.
- COS-003: Direct dialog durability worked for 4/4 recorded decisions. Unsupported chat claims still occurred.
- COS-004: Useful canonical drafts/finals existed in 10/10, but extra drafts/finals and unsupported mutation claims show partial recurrence.
- COS-005: No lost or stringified nested provider argument was identified in actor evidence.
- COS-006: Partial recurrence. Nine intakes completed, but Matter 02 stayed active and repeated structured-question errors were common.
- COS-007: No duplicate matter/decision was observed; extra draft/final files and repeated cards require review.
- COS-008: Recurred. Participant and work-item assignment/completion visibility remained incomplete.
- COS-009: Historical cards usually became Answered, Superseded, or Stopped, but repeated and duplicate-looking cards remained noisy.
- COS-010: No fake percent, ETA, or cancellation claim observed; long waits remained a friction issue.
- COS-011: Recurred. Provider internals, path-like details, internal labels, and malformed `Lawyer` fragments appeared.
- COS-012: Recurred. Overview and lifecycle text often named the wrong or stale artifact state.
- ENV-001: Passed core observability and fallback behavior, while public retrieval failed across all durable research attempts.
- ENV-002: Passed. The local launch remained available for all ten serial matters.
