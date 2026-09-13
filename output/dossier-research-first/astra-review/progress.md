# Astra review progress

Status: **complete — defects prevent readiness**. Findings and proposed repairs only. No application or tracker changes remain.

## Final checkpoint

- Latest implementation tracker reviewed: all 13 steps checked; acceptance failed. All 13 steps plus acceptance are mapped in coverage.md.
- 25 material findings, AR01–AR26 except AR16, are in findings.md. Each has severity, exact location, requirement, trigger, impact, evidence, smallest repair and regression proof. AR16 passed and is explicitly not a finding.
- Required checks: 1,639 backend tests passed; 79 focused tests passed; frontend typecheck, four focused scripts and owned-copy production build passed.
- Independent probes: 36 distinct tests; 28 acceptance assertions failed and 8 controls passed. Latest per-test evidence is in diagnostic-summary.json. Fact fixture and selected-issue probe corrections are recorded in verification.md. AR22 omitted two of the three selected answers; the third arrived through latest_research. Earlier checkpoint wording saying all three was too broad.
- Both chat surfaces were walked using real routes and orchestration in the separate marked browser-vault. Setup/edit/skip, All-five batching, early first dossier, document opening/editing, draft/context preservation, reload, Stop, same-vault restart, Resume, saved-only, hypothetical preview and ordinary chat were checked. Whole-file links worked; exact fact/passage resolution did not receive a complete browser pass.
- Original saved Step 13 run audited without paid calls. Exact raw source hashes prove CRLF normalization caused false corruption; the saved failure event proves writer input overflow; missing source_label separately breaks the source footer. Owned-copy input measured 523,615 bytes against the 256,000 default ceiling.
- All 11,527 pre-review file hashes match after restoring one benchmark report written by an existing full-suite test. The exact prior bytes were recovered and verified. Code, existing tests, implementation tracker, provider settings, original synthetic vault, active pointer and Harbor dossier are unchanged. See preservation-check.json.
- CUA tabs 1 and 2 closed. Owned server PIDs 90359 (first backend), 92428 (restarted backend), 90358/90373/90375 (frontend tree) stopped. Ports 8207 and 3207 are clear. No review-owned model or test process remains.
- No paid call, coding agent, commit, push, merge, deployment or message to others. Review code and evidence exist only under this directory.

## Area status

| Area | Status | Evidence |
|---|---|---|
| Baseline and scope | Complete | baseline.json; inventory; final preservation check |
| Plan coverage | Complete | coverage.md: all 13 steps and acceptance |
| Actual user flow | Complete within stated browser limits | browser screenshots, AX/state files; verification.md |
| Substance and references | Complete | AR01–AR07, AR09–AR10, AR14–AR15, AR18, AR20–AR26 |
| Publication and recovery | Complete | AR02/AR04/AR08/AR12/AR17/AR19/AR22; eight passing controls |
| Verification | Complete | command/result/log/XML files; verification.md |
| Final report | Complete | findings.md, coverage.md, verification.md |

## Resume and next action

No review work remains pending. Read findings.md and verification.md before starting repairs. The smallest first repairs are source text normalization/formatting, bounded full-content dossier composition/fallback, and correct publication basis checks. Then repair references, choices, concurrency and recovery. A new paid quality run is outside this review authorization. Do not rerun passed broad checks without changed code or a new concern.

All owned fixture logs and data are retained under this review directory. No server is running. If browser reproduction is needed later, use its matching ownership marker and start the saved commands without resetting the vault.

## Earlier checkpoints — historical


Status: active. Findings only. No application edits, existing-test edits, tracker edits, paid calls, commits, or agents.

## Baseline and scope
- No prior checkpoint was present.
- Implementation task `Continue implementation with Sol` (01a093df-5dac-7721-a5d6-68818e963173) is idle. Last turn is complete. Its final message says Sol stopped and no execution-owned process remains.
- Latest tracker: all 13 build steps checked; acceptance explicitly failed after Step 13.
- Full repository inventory, initial hashes, HEAD and branch are in baseline.json, file-inventory.txt, and git-status-start.txt. Existing changes include pre-build work; attribution must use step evidence.
- Review prompt, root and frontend AGENTS.md, senior-mindset and handoff-review skills read. Required project documents and blueprint are next.

## Area status
| Area | Status | Evidence / findings | Next action |
|---|---|---|---|
| Baseline and scope | Complete | baseline.json; instructions, project docs, blueprint, tracker, step evidence read; graphify query succeeded | Validate source against claims |
| Plan coverage | Not started | — | Build all 13 rows plus acceptance |
| User flow | Not started | — | Trace real chat route, coordinator, UI |
| Substance and references | Not started | — | Inspect persistence, source reads, references |
| Publication and recovery | Not started | — | Inspect and exercise failure boundaries |
| Verification | Not started | — | Focused checks, required suite, owned browser fixture |
| Final report | Not started | — | Consolidate findings and proposed repairs |

## Running work and resume
- Review-owned processes: focused backend run starting; command/results/logs use run_check.py and focused-backend.*. No paid calls. No fixture server.
- Review-owned fixture: none.
- Exact next action: read docs/PRD.md, CODEX_HANDOFF.md, docs/DESIGN_LANGUAGE.md, current.md, and handoffs/dossier-research-first.handoff-plan.md; read all step evidence; query graphify before source navigation.
- No findings yet. All feature files are unreviewed.

## Checkpoint — baseline area complete
- Read all 13 step reports and the latest final report. Step 13 explicitly records failed acceptance. CODEX_HANDOFF still says Step 13 remains; use the tracker instead.
- Source inspection is beginning. Existing untracked dossier modules predate part of this implementation. Do not use HEAD diff as sole attribution.
- Next: run focused checks and inspect the real lifecycle tests, parent service, child harness, composition, and reference binding.

## Checkpoint — plan coverage and source trace
- Read production parent models/service/executor, managed children, writer/capture, issue publication, reference catalog, research budget adapter, router/history/runtime wiring, setup card/helpers, and the lifecycle, batch, API and reference test bodies.
- 79 focused tests passed (focused-backend.xml, 37.12s pytest / 53.55s process). Full suite still running: full-backend.process.json and full-backend.log, exec session 47946.
- Frontend typecheck and all four focused frontend scripts passed. Build in owned copy first failed because a node_modules symlink escaped Turbopack's root. Cloned dependencies into the owned copy and restarted build only (frontend-build-owned-copy.*, session 16158). This is a review environment issue, not an application defect.
- Active independent diagnostic tests: diagnostics.* / test_review_diagnostics.py. Expect acceptance assertions to fail; investigate each failure before making a finding.
- Source-supported candidate findings: full detail skipped when writer includes heading; prepared initial answers never enter composition; no deterministic fallback on writer failure; failed publication still announces readiness; saved dossier edits before writer capture are adopted as expected hash; dead reference catalog (no production build_catalog callers); dropped source-choice fields; All ignores later candidate; failed child retry skips terminal child; unreserved writer calls on restart; malformed optional fields; date anchor validation; duplicate Generate while active.
- Live-source-audit.json reads only saved synthetic evidence: each failed worker has one CRLF source mismatch; dossier_generation_failed event names model dispatch size overflow. The author's shared-source mutation / citation-publication causal claim is not supported by these records.
- Source inspection still needed: UI source readers and chat refresh details, full standalone scheduling race, packet source normalization and saved live packet quality, remaining plan requirement tests.
- Next exact action: inspect diagnostics.log, write coverage.md and findings.md from reproduced outcomes; launch separate owned browser fixture on free ports 8207/3207 using frontend-copy; preserve original build outputs.
- Review-owned fixture is not launched yet. No paid model or network call was made.

## Checkpoint — independent acceptance probes
- Diagnostics completed: 17 acceptance failures reproduced; one fact-reference test stopped at a missing synthetic fact fixture and must be corrected before it counts. See diagnostics.xml/log; no production edits.
- Reproduced IDs AR01–AR04, AR06–AR15 cover false CRLF corruption, missing writer fallback, lost detailed analysis, pre-writer lawyer edit loss, ignored accepted candidates/source choices, ineffective failed-child retry, malformed optional output, unsupported dates, duplicate Generate, unknown writer retry, blocking saved-only Start, lost unresearched initial answers, and repeated partial-update detail loss.
- Frontend build now passed in the owned source/dependency copy (frontend-build-owned-copy.result.json). Original tsconfig and build outputs were preserved. Full backend suite remains active at full-backend.process.json.
- Owned browser servers launched: backend PID 90359, exec session 97562, localhost:8207; frontend exec session 55111, localhost:3207. Logs and process records browser-backend.* and browser-frontend.*. Vault browser-vault has the matching .dossier-research-browser-fixture.json marker. No reset used. Experimental browser tab 1 created through CUA.
- Next: correct AR05 fixture, save plan matrix and findings, then complete actual browser interaction and recovery gaps.

## Checkpoint — substance and reference area
- coverage.md now contains all 13 steps plus acceptance. findings.md records AR01–AR15 with exact paths, requirements, reproductions, smallest repairs and regression checks. All are review artifacts only.
- AR05 now reproduced through real chat after correcting the missing two-fact synthetic fixture. No binding/source records appear (diagnostic-fact-route.*). Both chat ClaimMarkdown callers omit message source records; experimental document has source props.
- Browser completed setup, edited a priority, selected All 5 and a public topic, observed 3 distinct active workers, then saw a first revision while 2 remained active. Two internal whole-file links opened. External saved-passage link had no visible effect; exact-record drawer remains unproved.
- Canonical dossier edited through the actual Markdown UI and autosave confirmed. browser-dossier-edit-before.json proves saved condition and hash. Remaining workers released; next check is edit preservation, draft/context, completed state and reload.
- Additional boundary diagnostics running: diagnostics-boundaries.*, exec session 68808. Tests cover partial batch restart, fourth-worker timeout, priority brief propagation, changed-payload action identity, external counts and source versions.
- Full backend suite still running (above 90 percent). Next: inspect new diagnostics, browser completion and full suite; then complete saved-live evidence audit, restart/standard chat/browser acceptance and final report.

## Checkpoint — required regression and first browser journey complete
- Full required backend suite passed: 1,639 tests, 6 warnings, exit 0; 736.62s pytest / 737.431s process. full-backend.xml/log/result.json. Do not repeat it without source changes or a new concern.
- Additional probes: AR17 fourth worker, AR18 priority text ignored, AR19 changed-priority idempotency, AR20 inflated external read counts and AR21 collapsed source versions reproduced. AR16 partial three-child restart PASSED and is not a finding. See diagnostics-boundaries.*.
- First experimental browser journey finished: 5 distinct children, 2 writers, 2 publications. First dossier was ready with two workers active. UI draft/context and canonical lawyer edit survived completion and reload. Second publication is review_required due a changed question/fact basis; this browser path does not negate AR04's independent edit-loss reproduction. Screenshots 01–08 and before/after hashes are saved.
- Standard chat browser tab 2 is open at /matters/MAT-DEMO-BEACON. A second Generate was submitted to inspect setup/Stop/restart/Resume. Fixture gates were reset only after zero active workers.
- diagnostics-final-boundaries.* running (exec 70873): stale-basis fresh analysis, zero issue, 1/2/3 controls, actual writer receipt recovery, candidate-key scoping and rejected Start mutations.
- Next: complete standard browser path and owned backend restart; inspect saved live packet/traces and remaining test results; update findings/coverage/verification and final hash comparison. No application/tracker edits.

## Checkpoint — publication/recovery and saved live evidence
- AR16 partial batch recovery and 1/2/3-child controls passed. Re-ran the four author receipt boundaries with the actual writer resolver installed: writer response, recommendation, dossier and conversation recovery all passed. This narrows the recovery defect to unknown writer outcomes (AR12) and failed issue retry (AR08); no blanket replay-failure claim.
- New reproduced defects: AR22 stale-basis review writer omits all fresh selected child analysis; AR23 zero-issue completion writes no dossier; AR24 candidate keys alias unrelated requests; AR25 rejected Start still appends an issue. AR22 was tightened to test only selected issues and still fails (diagnostic-review-input.*).
- Read-only saved-live audit now independently proves both raw CRLF source bodies exactly match saved hashes; normalized reads alone differ. Owned-copy capture is 523,615 bytes vs current default ceiling 256,000. Original saved event proves historical input overflow. live-audit-summary.json and live-read-only-audit-final.* hold measurements. Original synthetic/live data untouched.
- Read the actual synthetic contract and completed vendor packet. Section 6 breach-only, paid-undisputed-invoices, ten-day read-only exception is applied. Vendor made 7 nonempty passage reads from 5 public sources; failed privacy/subscription workers made none. Source footer fails separately with KeyError source_label; 5 captured local records lack that field. AR26 diagnostic is running (diagnostic-source-footer.*).
- Browser standard request stopped with 3 active workers. Owned backend PID 90359 was terminated only after Stop and zero active workers. Restart uses same marked vault without reset: browser-backend-restart.*, exec 40259. CUA tab 2 showed STOPPED after reload; Resume used the same 3 child IDs. Gates released; next inspect completion and explicit saved-only/preview/normal chat. Frontend remains exec 55111, port 3207.
- No paid calls. No code, existing test, tracker, provider-setting or original-vault edits. Next: finish browser, append remaining findings, complete verification report and final hashes, stop owned servers.
