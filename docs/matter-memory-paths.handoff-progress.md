# Progress — matter memory, alternatives, and mainline continuity

Status: COMPLETE for authorized implementation and local verification. Live semantic model behavior remains unverified.
Executor: GPT-6 Astra, low reasoning effort (user selection). No subagents.

## Resume protocol

Before work, read this tracker and the handoff prompt. Start at the first pending step. Do not blindly repeat completed mutations. Check saved evidence and current file hashes if the checkout changed. After each step, run its checks, immediately update that step's line, and append evidence below. A checked line requires implementation AND its specified verification. Use FAILED or BLOCKED with an exact reason for unfinished work; continue independent authorized work where possible. Do not batch all updates at the end.

The original source-library implementation is a dependency to inspect, not a license to repeat or replace its entire build. The independent Opus grading report, if available, is evidence to review. Do not overwrite it.

## Steps

- [x] Step 1: Capture baseline, dependency status, and reproducible fixtures — DONE; 51 + 41 + 2 tests passed; frontend typecheck passed.
- [x] Step 2: Extend path records and preserve historical baselines — DONE; 10 tests passed.
- [x] Step 3: Implement atomic mainline transitions and recovery — DONE; 17 tests passed.
- [x] Step 4: Implement bounded per-path memory and lineage — DONE; 19 tests passed.
- [x] Step 5: Add shared editable skill and freeze its revision — DONE; 37 tests passed.
- [x] Step 6: Wire path tools and per-turn interpretation into the harness — DONE; 97 tests passed.
- [x] Step 7: Build bounded context and archive retrieval — DONE; 33 tests passed.
- [x] Step 8: Connect local/source research and verify full capacity — DONE; dense corpus, real OCR, 44 library tests passed.
- [x] Step 9: Publish notes and durable records without duplicate authority — DONE; 32 tests passed.
- [x] Step 10: Extend dossier and both conversation interfaces — DONE; typecheck and three presentation check groups passed.
- [x] Step 11: Finish checkpoint, usage, exclusion, and concurrency integration — DONE; 25 focused tests passed.
- [x] Step 12: Deliver frozen semantic evaluation and scorer breakdown — DONE; four fixture/scorer tests, dry-run, replay and offline live-harness smoke passed.
- [x] Step 13: Run the complete browser story and source recovery — DONE; both scripted views and index rebuild exercised; native browser upload not exercised.
- [x] Step 14: Final verification, documentation and delivery audit — DONE; full suite, focused audit, frontend checks/build, graph and whitespace checks passed.

## Completion claims

- [x] Tested deterministic lifecycle and integrity acceptance — verified; evidence below
- [x] Dense 1,000-page source and ten 200-page sources — verified; evidence below
- [x] Real local OCR continuation and page-image navigation — verified; evidence below
- [x] Ordinary and experimental browser sequence (API upload; native input untested) — verified; evidence below
- [x] Shared skill edit and frozen replay demonstrated — verified; evidence below
- [x] Evaluation dry-run and replay; no semantic quality score awarded — verified; evidence below
- [x] Full backend suite, frontend typecheck/build, graph update — verified; evidence below
- [x] Verification report and product documentation updated — verified; evidence below

Live semantic model evaluation: NOT RUN; no paid run authorized by this handoff. This is a verification limitation, not a deterministic test pass. Deliver the runnable evaluation and exact supported live command. If later authorized, record the explicit budget and result here. Do not conflate scripted behavior with model understanding.

## Planning baseline (already observed; not implementation completion)

- Date: 2026-09-10.
- Source HEAD: eff3c50585c84376cd4ae3e64dc768da6d7e44b1 plus substantial uncommitted changes.
- From backend: `.venv/bin/python -m pytest tests/test_workspace_scenarios.py tests/test_workspace_context.py tests/test_skills.py tests/test_research_checkpoints.py tests/test_source_library_tools.py -q`.
- Result: 51 passed, 6 existing deprecation warnings, 11.22 seconds.
- No new feature tests, full-suite run, frontend build, browser demo, or paid model calls were performed by the plan author for this handoff.

## Execution checkpoint

- Current step: complete.
- Current candidate source hashes/artifact: output/matter-memory-paths/baseline-manifest.json.
- Last completed operation: final audit, evidence report and test-server shutdown.
- Next action: user review of uncommitted changes; paid evaluation requires separate authorization.
- Running test/server processes created by this task: none; both fixture servers stopped.
- Pending local effects: none.
- External calls with unknown outcome: none.
- Authorized paid evaluation budget: zero.
- Open blocker: none for authorized local work. Live model behavior is unverified.

## Evidence log

Append one entry after each step:

### Step N — date/time

- Changed files and behavior:
- Check command(s), result(s), elapsed time:
- Evidence paths:
- Baseline failures versus new regressions:
- Contract-preserving departures from the blueprint and reason:
- Remaining limits or pending effects:
- Next action:

## Final report checklist

State what is implemented, what was actually exercised, what remains unverified, whether every historical path/source survives, whether canonical facts stayed intact during exploration, and whether actual usage data exists. Distinguish source-library repairs from new work. Include links to the verification report, score breakdown, browser evidence, and failure reproductions. Do not claim a general model quality or cost winner.

### Step 1 — 2026-09-10

Evidence: output/matter-memory-paths/baseline.md, baseline-manifest.json, baseline-tests.log, source-baseline-tests.log, baseline-request-sizes.json. Source repair changes were present beyond planning; preserved in scoped baseline. Captured request 74,014 bytes. Full suite/build and live semantics remain unverified. No pending effects.

### Step 2 — 2026-09-10

Added compatible scenario fields, MatterPathService and runtime wiring. Passive reads, idempotent baseline, parent inheritance, same-title identity and historical fact/recommendation/dossier/work snapshots tested. Existing scenario suite retained. `step2-tests.log`: 10 passed in 1.79s. No actual facts changed.

### Step 3 — 2026-09-10

One pointer commit, prepared/committed receipts, revision conflicts, restore, archive and paginated state APIs added. Pending dossier projection uses existing edit-protected revisions. Failure injection after prepared/snapshot/pointer/committed/projection boundaries recovered with one transition. Facts and current tasks unchanged; restore after correction preserves corrected facts. `step3-tests.log`: 17 passed in 3.41s. Conversation focus integration remains Step 6.

### Step 4 — 2026-09-10

Strict aggregate 4000-character payload; 6000-character projection; server message/run provenance; conflict detection; staged validation and immutable history; manual-body edit detection and malformed fallback. Source exclusions conservatively withhold the whole note because task/next-action prose has no item lineage. Fact correction marks dependent findings unresolved. Initial fixture lacked a fact; corrected fixture setup. `step4-tests.log`: 19 passed in 4.12s.

### Step 5 — 2026-09-10

Shared matter-paths Markdown fallback and editor added, 8000-character validation, explicit disabled state, submission freeze, both-surface dispatch capture, explicit skill coexistence. Expected applied-skill list updated to include the newly required automatic skill; original explicit skill and history assertions retained. `step5-tests.log`: 37 passed in 11.35s. Service runtime name is solution_paths to preserve the existing matter_paths filesystem policy.

### Step 6 — 2026-09-10

Typed path actions share workspace_action; scope filters and runtime guards agree. Explicit correction remains a narrow action; changing scope cannot expand authority in the same run. Path identity is independent from target scope and captured at submission. Actual registry promotion/memory and hostile payload tests pass. Existing scenario tool-set assertions now include permitted scope interpretation and the narrow action set; fact/adoption denial assertions retained. `step6-tests.log`: 97 passed in 43.53s. These tests are scripted plumbing, not semantic evidence.

### Step 7 — 2026-09-10

Existing context builder now packs complete JSON records, ranks corrections and query matches, bounds recent history to 12 messages/24000 characters, reserves path/note space, and omits bulk prior-research loading. Oversized breakdowns retain compact whole fields. Research replacement context preserves path packet. Exact bounded conversation archive added. Existing unstructured source excerpts retain explicit truncation. `step7-tests.log`: 33 passed in 8.82s.

### Step 8 — 2026-09-10

Added authorized ordinary local-source reads through workspace_action, source version pins, 48000-character admission and replay receipts. Dense corpus: 4060224 chars/1000 pages; collection 8562380 chars/2000 pages. Capacity tests 2 passed in 147.89s; real OCR targeted page 20, image and immutable partial version check passed in 2.57s. Existing library suite 44 passed in 39.63s. Reproduced and fixed subprocess working-directory dependency (root-launched extraction previously unavailable). Evidence: capacity.json, capacity-tests.log, ocr-tests.log, step8-library-tests.log.

### Step 9 — 2026-09-10

Optional working-memory structure preserves prose and prior note on failure. Pending payload retained; no extra provider call. Path identity protects historical publication. Existing typed records remain authoritative. `step9-tests.log`: 32 passed in 14.20s.

### Step 10 — 2026-09-10

Shared SolutionPaths controls in both conversations with current/working distinction, comparison, promotion, restore, archive, note detail and pending dossier status. Typecheck, single-lawyer, lawyer-continuity and focused presentation checks passed. Browser verification underway separately.

### Step 11 — 2026-09-10

Complete dispatch measurement and configurable 256000-byte ceiling added. Unknown usage stays null. Optional context removal retains tool pairing; mandatory overflow preserves useful output without oversized dispatch. Existing checkpoint/exclusion/lifecycle focused run: 25 passed in 25.58s. No paid calls.

### Step 12 — 2026-09-10

Frozen 28 two-turn cases include held-out paraphrases, explicit A/B/C expected identities, non-effects, assumptions, source and note constraints. Six rubric dimensions total 100. `evaluation-final.log`: four tests passed. `eval-dry-run-final` and `eval-replay-final` retain hashes and unscored denominators. `eval-mock-harness-final` exercises the live command with the offline provider: two provider calls, zero paid calls. The earlier mock manifest incorrectly labeled provider calls as paid; it is superseded by the final artifact. No live model understanding was assessed. Input is estimated and output is requested by instruction; the adapter cannot enforce a hard output-token limit. Environmental fault events remain deterministic lifecycle checks, separate from qualitative conversation review.

### Integration regression audit — 2026-09-10

First full run: 1468 passed, six failed. Correction fixtures now supply explicit instruction quotes; the unsupported hypothetical correction remains rejected. The scenario fixture now expects the required preserved baseline as well as its new alternative. The shared-skill message legitimately adds a system message. That assertion then exposed a real direct-run context bug: adding the frozen skill caused absent workspace context to be treated as present. Fixed and the complete trust-boundary tests passed. Browser focus-loss and nested-panel layout defects are under final retest. Full rerun is in progress.

### Step 13 — 2026-09-10

Both UI stories exercised exploration, inherited alternatives, comparisons, promotion, restoration, explicit correction, saved-source reads, note details and shared skill edit. Two conversations retain separate focus. The index rebuild preserved all 65 captured Markdown hashes. Eleven captured runs have one assistant answer each; four unique transition receipts remain. Three dossier updates applied and one preserved a concurrent lawyer edit with review-required status. See `output/matter-memory-paths/browser.md`, `browser-runs.json`, `browser-final-state.json` and `recovery.json`. Browser uploads used the ingestion API; the native file input was not tested. Screenshots were inspected in the task. No paid provider or real vault was used.

### Final audit — 2026-09-10

After the full suite passed, focused review added regression checks for excluded selection conditions, fresh actual-basis snapshots with unchanged path revision, normal editor access to bundled guidance, and old saved comparison order. Exclusion test failed before the fix and passed afterward. `release-focused.log`: 71 passed in 18.37s. Final context-only check covers the minimal identity fallback. The release dry-run/replay artifacts freeze the final application hash. No quality points or live model claims were added.

### Step 14 — 2026-09-10

Full backend suite: 1,480 passed, 7 deprecation warnings, 798.37s (`full-backend-final.log`). Final focused audit: 71 passed in 18.37s (`release-focused.log`); final minimal-context check: seven passed in 1.51s (`final-context.log`). Frontend typecheck/build and single-lawyer, continuity and path presentation checks passed. `graphify update .` completed with 14,908 nodes and 29,093 edges; AST-only, no paid semantic extraction. `git diff --check` passed. PRD, architecture, acceptance, handoff, current and context map now describe actual behavior. Full detail and the unrun live command are in `docs/matter-memory-paths.verification.md`. Both test servers are stopped. The synthetic temporary fixture remains available for local review. No real vault, source checkout, credentials, user model settings, commit, push or deployment was changed.
