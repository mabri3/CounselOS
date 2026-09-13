# Research-first dossier repair checkpoint

Status: IN PROGRESS. User authorized repairs after the completed independent review.

Failure: useful research, approved choices, reference identity, and durable progress can be lost across generation and restart. The saved review contains 25 findings with reproducible evidence.

Scope: repair AR01–AR26 except AR16 (passed). Preserve prior changes and review evidence. No paid evaluation, live matter mutation, commit, push, deployment, or coding subagents.

Baseline and original source copies: `baseline.json`, `before/`. Original build tracker acceptance remains failed.

## Areas
- Source snapshots and evidence shape (AR01, AR26): repaired. Both saved independent probes pass (`sources.log`). Source checkpoint and main-agent regression is running (`source-regression.log`).
- Full content and safe publication (AR02, AR03, AR04, AR14, AR15, AR22): pending.
- Durable execution (AR08, AR12, AR13, AR17, AR23): pending.
- Approved setup and identities (AR06, AR07, AR09, AR11, AR18, AR19, AR24, AR25): pending.
- References, coverage, dates (AR05, AR10, AR20, AR21): pending.
- Full regression, browser checks, graph update, final report: pending.

No repair-owned processes running. Next: fix source newline normalization and local source labels; run the saved source diagnostic tests. Back up/restore `output/matter-memory-paths/capacity.json` around the full suite because an existing test writes it.

Checkpoint: source normalization, legacy exact-byte verification, final-answer recovery, and tolerant source labels are implemented. Full-content projection and bounded writer inputs are now edited; publication integration is next.

## Implementation checkpoint
- Source regression: 29 passed (`source-regression.log`).
- First repair diagnostic run: 30 passed, 2 failed (saved-only/zero issue `packet_path` lookup). The empty-batch code is now corrected.
- Full content, candidate review input, expected dossier hash, writer reservations, retry state, Start scope validation, accepted candidates, local candidate identities, priorities, and three-worker wait are implemented.
- Reference binding now uses captured facts and full source versions. Both chat readers receive saved records. Source detail UI shows literal captured text. Standard document view has a Reading mode. Unknown writer retry has an explicit control.
- Source coverage and frozen-date resolution are implemented.
- Preserved review probes were copied to `backend/tests/test_dossier_research_repairs.py` (review copy/logs unchanged). Second diagnostic run and first frontend typecheck are in progress.
- Running sessions: pytest 51394 (`repair-diagnostics-2.log`); typecheck 10991 (`typecheck-1.log`). No app servers.
- Next: inspect those results; add regression checks for frozen date arithmetic, old CRLF source, oversized composition, unknown retry and frozen reference display; run focused subsystem suite, then required full suite/build/browser. Final integrity review remains.

## Regression checkpoint
- All 36 promoted review diagnostics passed (`repair-diagnostics-2.xml`). Seven extra tests now cover supported date arithmetic, old CRLF integrity, missing-source answer preservation, oversized input, explicit unknown-writer retry, frozen fact versions, and legacy display repair.
- Focused surrounding suite: 206 passed, 5 failed (`focused.xml`). Four old assertions required the defective behavior: unchecked model dates, no fallback publication, failed preview at an input limit, and blocking saved-only Start. Replaced each with a stronger assertion for the repaired contract. The fifth exposed Resume rejecting damaged sources before finalization; repaired with explicit source-unavailable recovery while keeping source hashes and all call/budget records.
- Typecheck and all four frontend dossier/research/reference/citation checks pass. First run had a missing standard-message source_records type; repaired type and fallback hydration. Existing control contract kept: Resume for stopped/interrupted; separate Retry saving dossier for publication failure; explicit unknown-call choice.
- Running: focused recheck session 10494 (`focused-recheck.log`), build (owned frontend copy, `.next-astra-repair`, `build.log`), isolated backend on 8207 (`browser-backend.log`, owned `browser-vault`). Frontend source copy made after current edits. No paid providers.
- Browser fixture now supplies two real saved facts and a deliberately short writer response, so the real composer must supply full detail.
- Next: inspect recheck/build, start owned frontend on 3207, walk both chat surfaces and exact captured facts. Then full backend suite with capacity-file backup, graph update, preservation/diff review, and final report.

## Full validation checkpoint
- Focused recheck: 102 passed in 92.71 seconds, no failures.
- Frontend production build passed in the owned copy.
- Full backend suite is starting; current capacity output was copied to capacity-before-full-suite.json and will be restored after this known test side effect.
- Isolated browser backend remains on 8207. Starting frontend on 3207.

## Browser and reference checkpoint
- Browser first pass: 3 complete, 2 running; first exact revision has full saved research and the two prepared initial answers. Two captured facts opened distinct literal text and hashes; unsent chat draft retained. Saved browser AX evidence 01–04.
- Browser exposed visible saved-analysis HTML boundary text; repaired renderer and added static regression.
- Final source audit extended exact binding to per-issue captured source versions, selected artifact paths and saved conversation messages. Preparation replies now also persist their frozen reference catalog. Frozen issue list is used when facts/issues change during research.
- Full backend suite running session 32467; focused new reference check is running. Frontend final type/citation checks running. Servers still use prior built copy; restart/rebuild before final browser checks.

- Final browser source details show original and amended clauses with different hashes and literal text; ambiguous/unknown IDs stay distinct and unavailable. Saved AX and PNG evidence 07–08. All five final answers are visible; composition markers are hidden; the unsent draft survives reload.
- Broader changed-code recheck: 101 passed. Two new test setup mistakes were corrected; both added reference tests pass.
- Browser exposed own initial question being mistaken for an outside edit on the next batch. Repair now stores the known committed question revision separately from the frozen research basis. Replayed revisions count as applied only when current content still equals that exact revision. A specific regression is starting.
- Full suite remains running (about 72%); two failures appeared. Inspect full failure details when it finishes, then repair and rerun the affected checks.

## Final integration checkpoint
- First full suite: 1,679 passed; 3 failed in 833.32 seconds. The short external timeout passes isolated without a test change. Orientation now uses a readable file link; test checks the actual target. Source-library test now distinguishes research packets from internal-reference catalogs and still resolves every library passage.
- Browser Stop, restart and Resume reused the same child IDs. Lawyer dossier bytes were preserved; the new result is a review revision.
- Standard workspace opens revisions through ReferencePreview, so it now uses ClaimMarkdown for saved Markdown outputs with catalogs; literal passage views retain the existing exact-range reader. Typecheck is running, then rebuild and verify both chat/document paths.
- Initial generated-question and later lawyer-edit replay tests pass. The broader run exposed one stale-input replay status assertion; preserved review_required when facts changed while keeping failed saves failed.
- Next: finish the active focused check, run a quiet full backend suite on final code, rebuild current UI, finish saved-only/preview browser checks, update graph and final integrity report.

## Final suite checkpoint
- The final writer/receipt checks pass: 7 tests, including changed facts, own initial question, later lawyer edit, and all four publication interruption boundaries.
- Final frontend typecheck, all four scripts and the ReferencePreview production build pass. Graph updated on this code.
- Starting a quiet full backend run on final-validation-snapshot.json. No more source edits planned. Capacity output backed up again. Browser remains isolated on 8207/3207; finishing the standard reference/saved-only/preview checks and report while this runs.

## Final browser checkpoint
- Both fact records opened exact saved text and hashes in the standard reader. The source detail panel now scrolls into view and takes keyboard focus; browser-15-visible-details.png records the visible result.
- Final frontend typecheck, citation script and production build pass after the focus repair. Graph updated. Full backend run 81924 is still running without a failure so far.
- Owned backend was restarted on final code against the same marked vault; session 21840, browser-backend-complete.log. Owned frontend remains session 84880 on 3207.
- Next: saved-only generation, preview and normal chat through both chat surfaces, then full test result, capacity restoration and final preservation audit. The original build tracker stays unchanged; final repair state belongs in this report.

## Browser checks complete
- Both real chat surfaces opened the same frozen fact and version. Source detail panels scroll into view, and Close returns focus to the correct button after rendering; browser-17 through browser-19 record this.
- Saved-only generation used one writer and zero new planning, research, search or fetch calls. It created exactly one review revision and preserved the earlier lawyer edit, as the UI stated.
- Preview used one writer, created no revision, and changed only conversation records. Normal chat produced its synthetic answer and changed only conversation records, with zero dossier/research calls. Hash/count assertions pass in browser-scope-verification.json.
- Final frontend typecheck/citation/build pass. Final graph update passes. Full backend run 81924 remains running near completion. Owned servers: backend 21840 (8207), frontend 64444 (3207).
- Next: full suite result, restore capacity file, final diff/integrity report, then close both owned tabs and stop only these servers.

## Resume checkpoint — final tests passed
- Final full backend suite: 1,686 passed, 6 dependency warnings, 830.63 seconds; session 81924 exited 0. Full logs and XML are saved. No backend source changed during this run.
- Known capacity-file test overwrite is restored byte-for-byte and verified.
- Both owned browser tabs are closed. Owned backend 21840 and frontend 64444 exited 143 after the deliberate stop. Ports 8207 and 3207 are free, recorded in cleanup.json. No review-owned process remains.
- Next: compare all original review hashes and repair source copies, refresh the repair-only diff, and finish repairs.md/verification.md. Keep the original build tracker and review evidence unchanged.
