# Harborline Counsel OS UX rerun — checked synthesis

## 1. Executive result

The rerun materially improved durable output, but it did not prove a reliable end-to-end matter workflow.

All 10 matters were created. All 10 have a durable draft and final artifact. Four decisions were recorded. Two matters reached approval, local delivery state, and Closed, and both remained Closed after reload. This is better than the strict baseline of 9 created matters, 4 canonical finals, 3 decisions, 1 approval/delivery, and 0 Closed matters.

The main remaining defect is state reconciliation. A useful final can exist while the matter remains in Intake, Research, Explore, or Generate. The overview, required work, recommendation, approval controls, board, and reload can then disagree. Only 2 of 10 matters reached Closed.

Other important defects recurred:

- Structured intake failed visibly in 6 matters. Matter 02 remained in active intake.
- The visible **Run research** control often submitted no question and was rejected.
- Chat made unsupported durable-state claims in Matters 08 and 10.
- Participant, work-item, target-date, and next-action records did not give a reliable operating view.
- Internal provider and review markup reached lawyer-facing output.
- The local delivery record was not explained clearly. `outside_counsel_os` is durable local state. It does not contact a person or external service. The visible wording did not make that no-contact boundary explicit.

The local runtime was stable. The earlier Run 7 server-loss failure did not recur. Polaris failure handling was observable and preserved useful fallback work, but no external authority was retrieved in any durable research result.

No run was contaminated. No duplicate matter or duplicate durable decision was found. The normalized coordinator counts are correct; I found no arithmetic or source mismatch that requires a correction.

## 2. Setup and method

This was a read-only synthesis of the completed rerun. I did not run a new matter, change the application, alter the experiment vault, or edit any raw report.

- Repository: `/Users/bharris/Programs/counsel-os-mvp`
- Experiment vault: `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`
- Raw and normalized evidence: `tmp/harborline-fix-rerun-20260901-073852/`
- Scenario: Harborline was a fictional fintech company and was not a Chime affiliate.
- App model: NeuralWatt Kimi K3 Fast.
- Request generation: one fresh `gpt-5.6-luna` medium agent produced exactly 10 complete requests. Each had two substantial paragraphs and all seven required fields.
- Company setup: one fresh `gpt-5.6-luna` medium actor used the in-app browser. The profile visibly showed Saved, no unsaved changes, version `31fffbfac2a0fe34`, and save time 7:42:16 AM. Unsupplied data-practice and risk-posture fields were left blank.
- Matter runs: 10 fresh `gpt-5.6-luna` medium actors, one matter each, with serial live writes.
- Synthesis: one fresh Sol High agent. No subagents were used.
- Browser: in-app browser only. No Chrome or Safari fallback was used.
- Coordinator browser help during actor runs: none.
- Test-vault confirmation: the local launcher disabled only the expected test-only confirmation dialog. This method adaptation was not counted as a stall.
- External action: none.

Markdown was the authority for durable state. A chat statement counted as success only when a matching Markdown record or a visible reload supported it. I treated the normalized durable counts as the coordinator audit and checked the packet distinction directly. The vault has 14 `RES-*.md` packet files in 6 matter folders. It also has 6 separate `research/runs/RUN-*.md` operational records. Those run records are not research packets.

I used the current implementation only to explain observed causes. Each issue group received a focused Graphify query before source inspection. These are the working queries and the evidence they scoped:

| Issue group | Focused Graphify query | Working evidence |
|---|---|---|
| Lifecycle and stale state | `graphify query "Why can a matter with a finalized work product remain in intake research explore or generate, show stale required work or recommendation state, and hide approval or closure controls after reload?"` | Finalization, matter-state resolution, action gating, recommendation loading, and workspace rendering. |
| Mutation truth | `graphify query "How are chat typed-tool mutation results for save work product, record decision, approval, delivery, and closure validated before the assistant claims durable success?"` | Agent runner, output correction, typed tools, protected writes, and mutation outcomes. |
| Intake and research start | `graphify query "How does adaptive intake persist structured questions, finalize intake, retire old cards, and create research questions for the Run research control?"` | Intake record application, intake runner recovery, research queueing, and the visible research action. |
| Retry safety | `graphify query "How do matter creation, work product saves, decisions, and chat retries enforce idempotency and prevent duplicate durable records?"` | Source-action keys, content hashes, finalization, matter creation, and form busy state. |
| Structured operating records | `graphify query "How are matter participants, work-item owners and completion, current next action, and target dates persisted and rendered?"` | Matter creation, participants, work items, current-work rendering, and target-date transport. |
| Long work | `graphify query "How does Counsel OS render honest elapsed status for long agent research and chat work, and avoid invented percent ETA phase or cancellation claims?"` | Research run state and chat progress rendering. |
| Output hygiene | `graphify query "Where is lawyer-facing chat and Markdown output cleaned to remove internal prompts paths IDs provider labels tool syntax and malformed author labels such as Lawyer?"` | Output cleanup, Markdown rendering, review author display, and revision markup. |
| Research failure | `graphify query "How does Polaris public research record timeout class attempts elapsed time fallback packets external source status and unsaved fallback analysis?"` | Polaris retries, failure classes, packet metadata, and fallback generation. |
| Delivery boundary | `graphify query "Where does the UI label Mark as sent and explain that outside_counsel_os is only durable local state and does not contact a person or external service?"` | Matter action labels and durable lifecycle mutation. |
| Runtime | `graphify query "How do the local launcher health checks frontend backend startup logs ports and shutdown support a stable ten-run experiment?"` | Launcher and health-check paths. |

Cause labels in this report mean:

- **Confirmed:** the observed result and the current code or durable record directly match.
- **Likely:** the evidence supports the cause, but it does not prove the full live path.
- **Unknown:** the evidence proves the failure but not its root cause.

Matter 03 and Matter 04 raw start times used the run-folder timestamp `2026-09-01 07:38:52`, which predates their dispatch and is not a valid actor start time. The normalized spans use durable matter timestamps and coordinator dispatch order. Neither run breached the 35-minute cap.

## 3. Strict before/after metrics

The baseline had 9 matters because its earlier Run 7 created no matter when the local server was unavailable. The rerun denominator is 10 matters.

| Strict measure | Earlier baseline | Rerun | Change |
|---|---:|---:|---:|
| Matters created | 9 | 10/10 | +1 matter |
| Saved research packet files | 8 | 14 | +6 files |
| Matters with at least one saved research packet | Not reported | 6/10 | New coverage measure; do not infer a baseline delta |
| Matters with at least one draft | Not reported | 10/10 | 12 draft files total |
| Matters with at least one final | 4 canonical finals | 10/10 | +6 matters with a final; 11 final files total |
| Durable decisions | 3 | 4 | +1 |
| Recorded approval/delivery | 1 | 2 approvals and 2 local delivery records | +1 completed lifecycle pair |
| Closed matters | 0 | 2/10 | +2 |
| Complete intake | Not reported | 9/10 | Matter 02 remained active |
| Work-item files | Not reported | 26 | Count only; quality varied |
| Retrieved external authority | Not reported | 0 | All durable public-research statuses failed |
| Duplicate matters | Earlier Run 7 created none | 0 in rerun | No retry duplicate observed |

Packet totals and matter coverage are different measures. The rerun has 14 packet files, but only 6 matters have one or more packets. Matter 10 has useful fallback chat analysis but no saved packet, so it is not counted as a matter with research packets.

Durable mutation spans total 56 minutes 36 seconds. The median is 5 minutes 8 seconds. A durable mutation span is the interval from `matter.md` creation to its last durable update. It is not total actor wall time.

## 4. Per-run table

| Run | Matter | Durable end state | Intake | Research packets | Drafts / finals | Decision | Approval / local delivery / Closed | Durable span | Checked result |
|---|---|---|---|---:|---:|---|---|---:|---|
| 01 | `MAT-20260901-ef7e21` | Explore | Complete | 3 failed fallback packets | 1 / 1 | None; not relevant | No / No / No | 5m12s | Useful recommendation and final survived reload. Approval controls were not available. |
| 02 | `MAT-20260901-d57a6d` | Intake | Active | 0 | 1 / 1 | Relevant; none | No / No / No | 3m26s | Repeated structured-intake errors. An intake summary was finalized without saved research or a developed recommendation. |
| 03 | `MAT-20260901-bb4979` | Intake | Complete | 0; research remained running | 1 / 1 | None | No / No / No | 4m45s | A developed final exists while stage remains Intake. Dossier and lifecycle state remained stale. Timing was normalized from durable evidence. |
| 04 | `MAT-20260901-215228` | Generate | Complete | 1 failed fallback packet | 1 / 1 | Yes; matter and register agree | No / No / No | 5m31s | Reload showed stale or regressed final, recommendation, research, and required-work state. Timing was normalized from durable evidence. |
| 05 | `MAT-20260901-802a6f` | Closed | Complete | 3 failed packets | 1 / 1 | Yes; consistent | Yes / Yes / Yes | 8m47s | Normal controls completed the full lifecycle and Closed survived reload. The delivery wording did not state the local-only boundary. |
| 06 | `MAT-20260901-acb55f` | Intake | Complete | 0 | 1 / 1 | Relevant; none | No / No / No | 5m04s | Structured-intake errors and stopped cards remained visible. A developed final survived reload. |
| 07 | `MAT-20260901-08e52c` | Explore | Complete | 3 failed fallback packets | 1 / 1 | None; not required | No / No / No | 4m28s | Recommendation and final survived. Approval was absent. Chat reported the delivery tool unavailable. |
| 08 | `MAT-20260901-5ba046` | Closed | Complete | 1 partial failed packet | 2 / 2 | Yes; matter and register agree | Yes / Yes / Yes | 8m20s | Full lifecycle succeeded. A prior chat decision claim was contradictory. Research display contained malformed `Lawyer` suffixes. |
| 09 | `MAT-20260901-81e05e` | Generate | Complete | 3 failed fallback packets | 2 / 1 | Yes; consistent | No / No / No | 7m45s | Final and decision persisted. Required work and the approval path remained stale or unavailable. |
| 10 | `MAT-20260901-621511` | Research | Complete | 0; useful chat fallback only | 1 / 1 | None; chat claim disproved | No / No / No | 3m18s | Chat falsely claimed a research transition, decision, delivery, and closure. Overview, register, board, Markdown, and reload disproved those claims. |

## 5. Working well and what to preserve

### Durable first-pass work

All 10 matters preserved at least one useful draft and one final. Research or intake failure did not force an empty answer. Unknown facts usually became assumptions or work items. This follows the product goal of giving counsel a useful foothold. Preserve this best-effort behavior.

### Direct durable decisions

The direct decision dialog created one durable, consistent decision in each of Matters 04, 05, 08, and 09. The matter record and decision register agreed in all four. Preserve the separation between a recommendation and a recorded decision.

### Direct lifecycle controls

Matters 05 and 08 show that the direct controls can complete approval, local delivery state, closure, and reload persistence. Both remained Closed. Preserve these explicit controls and their Markdown event history.

### Retry outcomes

No duplicate matter and no duplicate durable decision was observed. The source-action-key and content-hash protections used by typed mutations are useful. Preserve them. The extra draft and final files are not proof of retry duplicates: the evidence shows separate work-product generations, including the later approved final in Matter 08.

### Honest long-work display

No actor found an invented percentage, phase, ETA, or cancellation claim. Long work used elapsed or continuing states. Preserve this truthful pattern, even though waits remained long.

### Research degradation

Polaris failures recorded a failure class, three attempts, elapsed time, and fallback state. Useful analysis or a scaffold remained available. Preserve the failure observability and graceful fallback.

### Local runtime

The frontend and backend remained available through all 10 serial matters. The earlier local-server failure did not recur. Preserve the launcher health checks and stable local-vault flow.

## 6. Not working well

This section covers friction and weak operating support. Section 7 covers incorrect behavior.

### Creation feedback and retry risk

Creation felt delayed in most runs. Actors often checked again after the matter had already been created and navigation had changed the page. The create route writes the matter and then waits for intake startup before it returns. The UI waits for that response before navigation. This cause is **Confirmed**. The form also performs a settings read before the parent sets its busy state, and matter creation has no source-action idempotency key. A duplicate-click risk is **Likely**, although no duplicate matter occurred.

### Participant records

Participant files usually contained only Product as requester and Lawyer as legal owner, despite richer named actors in the request text. Matter creation only creates structured participants from requester, legal owner, and business owner. The workspace renders the list but does not provide a complete participant-maintenance path. Cause: **Confirmed**.

### Work-item usability

Twenty-six work-item files existed, but owner, assignment, completion, and current-next-action controls were inconsistent. The workspace gives richer controls to the current or required item. Optional remaining items can lack equivalent controls. Cause: **Confirmed**. The result is a list of tasks without a reliable operating queue.

### Historical card noise

Answered, Superseded, and Stopped labels were usually truthful. Repeated provider turns still left duplicate-looking question and error cards. The persistence of separate failed turns makes the noise **Likely**; the evidence does not prove that every similar card has the same identity.

### Long waits

The display was honest, but repeated Polaris cycles took about 46 seconds where timing was reported. Closed runs had the longest durable spans: 8m47s and 8m20s. The product needs clearer useful continuation after the timeout, not invented progress.

### Due-date loss

Actors entered target dates in Matters 06, 08, and 10, but every durable `matter.md` and `request.md` has a null target date. The current form, API model, and matter service all include the target-date field. Cause: **Unknown**. A live request-payload capture is needed before assigning this to browser input, frontend state, transport, or backend persistence.

### Local delivery wording

The control says **Mark as sent** and says it records that the response was delivered. The durable mutation writes `response_delivery_method: outside_counsel_os`. That value is durable local state only. It does not send a message, identify a recipient, use an address, or contact an external service. Cause of the unclear boundary: **Confirmed**. The visible wording did not make the no-contact boundary explicit.

## 7. Broken behavior

### Final artifact and lifecycle disagreement

A finalized draft advances to Respond only when the matter is already in Generate. The UI allows finalization in other stages. Approval, delivery, and closure controls are then gated by the unchanged stage. Matter state also resolves from saved status and open work, not from the existence of a current final. Cause: **Confirmed** in `backend/app/services/work_product.py`, `backend/app/services/matters.py`, `backend/app/services/matter_state.py`, `frontend/lib/matterActions.ts`, and `frontend/components/MatterWorkspace.tsx`.

This directly explains developed finals in Intake, Research, Explore, and Generate; hidden approval controls; stale required work; and reload disagreement. It is the largest cross-run product defect.

### False final-readiness text

After finalization, the workspace displays that the final is ready for approval even when the stage did not move to Respond and approval cannot be used. Cause: **Confirmed**. This is incorrect artifact-state text, not only a stale display.

### Recommendation disagreement

The overview reads `recommendations.md`. A recommendation written inside a canonical draft does not update that file unless the model used the recommendation-specific typed save. The overview can therefore say no recommendation exists while the final contains one. Cause: **Confirmed**.

### Structured intake failure

Matters 02, 03, 05, 06, 07, and 09 displayed: `The intake turn could not be saved or presented as a structured question. Please retry.` The runner emits that exact error after two attempts produce neither a successful intake update nor a structured question card. This failure condition is **Confirmed**. Kimi's failure to follow the typed intake contract is the **Likely** upstream cause. Matter 02 remained active, so recovery was not reliable.

### Empty visible research action

The visible **Run research** action calls the research start API with an empty default question. The backend rejects an empty question list with `At least one research question is required`. Other tool paths can fall back to the matter title, but this visible control does not. Cause: **Confirmed**.

### Unsupported durable-state claims

Matter 08 chat first contradicted the decision state. Matter 10 chat claimed a research transition, a durable decision, delivery, and closure that did not exist. The output corrector checks a narrow set of claim phrases against successful mutation traces. It misses variants such as a standalone `Durable Decision Recorded` heading and indirect delivery or Closed headings. Cause: **Confirmed**.

Matter 10 also showed a protected-write error. The generic writer correctly blocks protected matter and work-product paths and tells the model to use a typed tool. The later positive chat text was not reconciled with that failed write. The guard behavior is **Confirmed** and should remain. The model's choice of the generic writer instead of the typed tool is **Likely**. The unsupported success claim is **Confirmed**.

### Lawyer-facing internal text

Research packets intentionally render Polaris failure details, including provider name, failure class, attempts, elapsed milliseconds, and fallback status. Output cleanup is mainly applied to final chat text, not all research and document surfaces. Cause: **Confirmed**.

Malformed inline `Lawyer` suffixes in Matters 08 and 10 match revision markup that appends the author label through CSS after revision spans. Cause: **Confirmed** for the visible suffix. The checked Markdown bodies do not prove equivalent durable content corruption, so the defect should be described as lawyer-facing rendering leakage unless a raw file shows otherwise.

### Missing saved packet for useful fallback

Matter 10 produced useful fallback analysis in chat but no `RES-*.md` file. The visible research start failed before a research packet run, and chat prose alone did not invoke the typed research save path. Cause: **Confirmed** for the missing durable path. Why the model did not choose the typed research tool is **Likely**.

### Public research retrieved no authority

All durable public-research statuses failed. No external authority was recorded as retrieved or verified. The records identify timeout, retries, elapsed time, and fallback. The underlying reason Polaris timed out across the rerun is **Unknown** from the available evidence.

## 8. Recurrence result for COS-001 through COS-012 and ENV-001 through ENV-002

The engineering handoff recorded PASS for all issues, with 584 backend tests passing, frontend typecheck and build passing, focused checks passing, and a blank-vault browser flow reaching durable Closed. The live rerun is the current status evidence below. A live recurrence does not erase the engineering proof; it shows that the tested path did not cover or prevent the observed path.

| Issue | Current live result | Evidence and cause status |
|---|---|---|
| COS-001 — new-vault tool and permission parity | **No recurrence of template parity** | All 10 matters were created in the new vault, direct decisions and lifecycle tools worked, and the tool files existed. Matter 10's protected generic-write error is a tool-selection and claim-truth defect, not proof of missing new-vault parity. Matter 07's “tool unavailable” chat claim is not supported by the vault. Cause of that model claim: **Likely** provider/tool selection. |
| COS-002 — lifecycle reconciliation | **Recurred** | Only 2/10 reached Closed. Finals coexisted with Intake, Research, Explore, or Generate. Required work, recommendation, approval controls, board, and reload disagreed. Cause: **Confirmed** stage-specific finalization and status-gated controls. |
| COS-003 — decision durability and recommendation separation | **Partial recurrence** | Direct dialog decisions were durable and consistent in 4/4 matters. Chat made contradictory or unsupported decision claims in Matters 08 and 10. Durable write path passed; chat truth did not. Cause: **Confirmed** output-matcher gaps. |
| COS-004 — canonical work product and unsupported mutation claims | **Partial recurrence** | All 10 matters have durable drafts and finals. Extra files were reviewed and are not proved retry duplicates. Unsupported mutation claims recurred, especially in Matter 10. Canonical preservation passed; claim integrity failed. Cause: **Confirmed** narrow success-claim correction. |
| COS-005 — nested JSON and tool argument normalization | **No recurrence found** | No actor evidence showed lost, double-encoded, or stringified nested arguments. Current focused tests had passed. |
| COS-006 — final intake retires active questions | **Partial recurrence** | Nine intakes completed, but Matter 02 remained active. Structured-intake errors appeared in 6 matters, and repeated historical cards remained. Failure condition: **Confirmed**; provider contract failure: **Likely**. |
| COS-007 — retry idempotency | **No durable recurrence found** | Zero duplicate matters and zero duplicate durable decisions. Source-action protections worked for typed mutations. Matter creation still lacks an idempotency key and had delayed feedback, so retry risk remains. Risk cause: **Confirmed** code gap; duplicate outcome was not observed. |
| COS-008 — participants and work-item operating view | **Recurred** | Participant records were thin. Work-item owner, assignment, completion, and current-next-action controls were inconsistent. Cause: **Confirmed** creation and rendering limits. |
| COS-009 — truthful inert historical cards | **Partial recurrence** | State words such as Answered, Superseded, and Stopped usually worked. Repeated and duplicate-looking cards remained noisy. Cause: **Likely** separate failed turns retained as history. |
| COS-010 — honest long-work state | **No recurrence of false progress** | No fake percentage, phase, ETA, or cancellation claim was observed. Long waits remain friction, not a truth failure. |
| COS-011 — output hygiene | **Recurred** | Provider and fallback internals, path-like or trace details, and malformed `Lawyer` suffixes reached lawyer-facing views. Causes: **Confirmed** incomplete cleanup coverage and revision author pseudo-label rendering. |
| COS-012 — accurate empty and saved-artifact text | **Recurred** | Overview and lifecycle text named stale or wrong artifact state. Finalization could say “ready for approval” while approval was unavailable. Cause: **Confirmed** split sources of truth and unconditional success text. |
| ENV-001 — Polaris safe failure, attempts, timing, and fallback | **No recurrence of the observability defect; environment remained degraded** | Failure class, 3 attempts, elapsed time, and fallback were recorded. Useful work survived. Public retrieval failed across all durable attempts. Timeout behavior: **Confirmed**; root provider/network cause: **Unknown**. |
| ENV-002 — stable local launch | **No recurrence** | Local services remained available for all 10 serial matters. The earlier baseline server-loss failure did not recur. |

## 9. New evidence-based repair backlog

These are the smallest useful corrections supported by the rerun. They do not require a new service, verifier agent, workflow engine, or legal-answer gate.

| Priority | Correction | Small proof |
|---|---|---|
| P0 | Reconcile lifecycle after every canonical final. Use one shared function to set the durable stage and next action from the current final, decision requirement, and required work. Return the actual resulting state to the UI. | Finalize from Intake, Research, Explore, and Generate. After reload, final, stage, next action, required work, and approval availability agree. |
| P0 | Make finalization text conditional on the returned durable stage. Do not say “ready for approval” unless approval is available. | Finalization from a non-ready state names the actual next action. |
| P0 | Make the visible **Run research** action send a real question. Use the first durable public-research question, then a visible entered question, then the matter title as the safe fallback. | The control never sends an empty question list and always saves a packet or gives a truthful research failure. |
| P0 | Strengthen mutation-claim correction by semantic outcome, not a short phrase list. Build the final claim text from successful typed mutation results. Strip or correct standalone headings and indirect claims when no matching result exists. | Re-run Matter 10 wording variants. No decision, delivery, closure, or stage claim appears without matching Markdown. |
| P0 | Add deterministic intake recovery after the second structured failure. Preserve useful prose, show one valid next question or a clear completion state, and stop creating repeated error cards. | The six observed failure patterns produce one recoverable card. Completed intake has no active question. |
| P1 | Reconcile the overview recommendation with the canonical work product. Either save the recommendation through the recommendation record in the same typed mutation or derive the overview from the current canonical artifact with clear labeling. | A final containing the working recommendation cannot coexist with “No working recommendation saved.” |
| P1 | Change delivery copy to explicit local-state language, for example: “Record delivery outside Counsel OS. This does not send or contact anyone.” Keep `outside_counsel_os` as the durable value. | Before confirmation, the user can state that no external contact will occur. |
| P1 | Remove internal provider, path, trace, and author markup from lawyer-facing document views. Keep diagnostics in metadata or a clearly separate technical detail view. Do not append `Lawyer` inside document text. | Matter 08 and 10 artifact fixtures render clean headings and sentences while diagnostics remain inspectable elsewhere. |
| P1 | Give every open work item visible owner, assignment, and completion controls. Make the durable current next action derive from the selected open item. Add participant maintenance for named request actors. | A matter with required and optional items can assign and complete each item, and reload preserves the queue. |
| P1 | Diagnose target-date loss with one instrumented visible creation. Capture the date input value, POST payload, API response, `request.md`, and `matter.md`. Fix only the first proven break. | The same date appears in all five locations and after reload. Cause remains **Unknown** until this check. |
| P2 | Return the new matter immediately after its durable write, and start intake without blocking creation feedback, or show a distinct durable-created state while intake starts. Add a client creation key if repeat submission remains possible. | A slow intake provider cannot cause ambiguous creation or duplicate submission. One click creates one matter. |
| P2 | Compact repeated historical failure cards into one truthful status group while preserving the audit trail. | Repeated intake recovery shows one current card and an expandable history. |

## 10. Cross-run and timing patterns

- Durable output was much more reliable than workflow state. Draft/final coverage was 10/10, while Closed coverage was 2/10.
- Direct controls were more reliable than chat. The decision dialog succeeded 4/4. Direct lifecycle controls succeeded in the two matters that reached Respond. Chat claims failed truth checks in Matters 08 and 10.
- Research failure was systemic, not matter-specific. No durable result retrieved external authority. Six matters still saved 14 fallback packets.
- Packet volume was concentrated. Six matters had packets; four had none. Multiple packets in one matter must not be used to imply broad matter coverage.
- Closed matters took the longest durable spans: Matter 05 at 8m47s and Matter 08 at 8m20s. This is consistent with more durable lifecycle mutations, not proof that closure itself was slow.
- The total durable mutation span was 56m36s and the median was 5m08s. Actor wall time was longer because it included reading, browser recovery, waiting, and verification.
- Polaris commonly used three attempts and about 46 seconds before fallback where detailed timing was visible. Honest elapsed state prevented a false-progress defect, but the delay amplified actor uncertainty.
- Delayed matter creation caused several actors to test a condition after navigation had already changed. This produced stale locator errors and duplicate-click risk without producing duplicate matters.
- Matters 03 and 04 used an invalid raw start source: the run-folder timestamp `07:38:52`. Durable creation/update times and dispatch order are the normalized timing authority.

## 11. Browser-control errors

These errors are separate from product defects.

- The separate in-app-browser visibility control was unsupported during setup and in Matters 05 and 08. Each actor recovered with a fresh or reconnected in-app tab.
- Matter 08's long wait reset or invalidated the browser-control session. The actor reconnected and continued.
- Strict locator ambiguity occurred for duplicated **Matters** links in Matters 02 and 10, a broad research matcher in Matter 07, and **Next** versus Next.js controls in Matter 08.
- Stale locators followed successful state changes or navigation in Matter 01 after creation, Matter 06 around **Stop**, Matter 07 around progress, and Matter 09 after creation.
- No Chrome or Safari fallback was used.
- No coordinator browser help was used during an actor run.

Some stale locators were triggered by slow product feedback, but the locator failure itself is a browser-control error. The slow feedback and missing stable pending state are product friction and are reported separately.

## 12. Environment failures

### Polaris public research

Every durable public-research status failed. No external authority was retrieved or verified. Recorded failures showed timeout class, three attempts, elapsed time, and fallback state. Useful generated analysis or a scaffold survived where a packet was saved. ENV-001 therefore passed its safe-failure and observability goal, but the research environment remained degraded. The root timeout cause is **Unknown**.

### Local services

The local frontend and backend remained available for all 10 matters. ENV-002 passed. The earlier baseline Run 7 server outage did not recur.

### Browser capability

The unsupported in-app-browser visibility call and one session reset were environment or control-capability failures. They did not contaminate durable product state and did not require a different browser.

### Reported unavailable delivery tool

Matter 07 chat reported that a delivery tool was unavailable. The new vault contained the lifecycle tool definitions, and direct lifecycle controls worked in Matters 05 and 08. This is not classified as an environment failure. It is **Likely** a provider tool-selection or claim problem.

## 13. Incomplete or contaminated runs

No run was contaminated. All actor writes were serial. Each matter actor worked on one assigned matter. No later actor received earlier findings. No coordinator browser action changed an actor's matter. No external message or delivery was sent.

All 10 matter reports exist, and all 10 matters were created. However, several product outcomes were incomplete and must not be hidden:

- Matter 02 remained in active intake. Its final is an intake summary, not a researched and developed answer.
- Matter 03 had a developed final while research remained running and the matter remained in Intake.
- Matters 01, 04, 06, 07, and 09 preserved useful finals but did not reach approval, delivery, or closure.
- Matter 10 preserved a draft and final but saved no research packet, no decision, no delivery, and no closure. Its positive chat claims were disproved.
- Only Matters 05 and 08 completed the full durable lifecycle.

The **Mark as sent** actions in Matters 05 and 08 were permitted because no recipient, address, or external-send flow appeared. They created only local `outside_counsel_os` records. They did not contact anyone.

## 14. Method compliance

| Requirement | Result |
|---|---|
| Read setup, normalized evidence, setup-attorney report, requester report, all 10 matter reports, and handoff progress | Complied; each required file was read completely. |
| Use the experiment vault read-only and treat Markdown as authoritative | Complied. Durable claims were checked against Markdown and reload evidence. |
| Treat normalized counts as coordinator audit unless a concrete mismatch exists | Complied. Packet, run-record, draft, final, decision, work-item, approval, delivery, and closure counts were checked. No correction is needed. |
| Keep packet files separate from matters with packets | Complied: 14 packet files across 6 matters; 6 operational run records are separate. |
| Run a focused Graphify query before each issue-group source review | Complied. The exact working queries are recorded in Section 2. |
| Label causes Confirmed, Likely, or Unknown | Complied throughout Sections 6 through 9. |
| Separate product, browser-control, and environment failures | Complied in Sections 6, 7, 11, and 12. |
| Do not hide failed or incomplete runs | Complied in the per-run table and Section 13. |
| Normalize Matter 03 and 04 invalid raw start times | Complied. Durable evidence and dispatch order were used. |
| Explain local delivery semantics | Complied. `outside_counsel_os` is identified as durable local state with no external contact. |
| Do not spawn agents | Complied. This synthesis used no subagents. |
| Do not implement fixes or alter evidence, vault state, code, tests, history, or actor reports | Complied. Only this synthesis draft was created. |

Checked conclusion: the rerun proves strong durable first-pass artifact creation and two valid full-lifecycle examples. It does not prove dependable lifecycle reconciliation. The highest-value next work is to make the canonical final, durable stage, required work, recommendation, approval controls, and chat claims agree after every mutation and reload.
