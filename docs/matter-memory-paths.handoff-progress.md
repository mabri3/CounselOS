# Progress — matter memory, alternatives, and mainline continuity

Status: NOT STARTED. This tracker describes implementation work, not planning completion.
Executor: not selected. The user may choose Astra or Opus 5. Preserve the selected model settings.

## Resume protocol

Before work, read this tracker and the handoff prompt. Start at the first pending step. Do not blindly repeat completed mutations. Check saved evidence and current file hashes if the checkout changed. After each step, run its checks, immediately update that step's line, and append evidence below. A checked line requires implementation AND its specified verification. Use FAILED or BLOCKED with an exact reason for unfinished work; continue independent authorized work where possible. Do not batch all updates at the end.

The original source-library implementation is a dependency to inspect, not a license to repeat or replace its entire build. The independent Opus grading report, if available, is evidence to review. Do not overwrite it.

## Steps

- [ ] Step 1: Capture baseline, dependency status, and reproducible fixtures — pending
- [ ] Step 2: Extend path records and preserve historical baselines — pending
- [ ] Step 3: Implement atomic mainline transitions and recovery — pending
- [ ] Step 4: Implement bounded per-path memory and lineage — pending
- [ ] Step 5: Add shared editable skill and freeze its revision — pending
- [ ] Step 6: Wire path tools and per-turn interpretation into the harness — pending
- [ ] Step 7: Build bounded context and archive retrieval — pending
- [ ] Step 8: Connect local/source research and verify full capacity — pending
- [ ] Step 9: Publish notes and durable records without duplicate authority — pending
- [ ] Step 10: Extend dossier and both conversation interfaces — pending
- [ ] Step 11: Finish checkpoint, usage, exclusion, and concurrency integration — pending
- [ ] Step 12: Deliver frozen semantic evaluation and scorer breakdown — pending
- [ ] Step 13: Run the complete browser story and source recovery — pending
- [ ] Step 14: Final verification, documentation and delivery audit — pending

## Completion claims

- [ ] Complete deterministic lifecycle and integrity acceptance — pending
- [ ] Dense 1,000-page source and ten 200-page sources — pending
- [ ] Real local OCR continuation and page-image navigation — pending
- [ ] Ordinary and experimental browser sequence — pending
- [ ] Shared skill edit and frozen replay demonstrated — pending
- [ ] Evaluation dry-run and replay with reconciled dimension scores — pending
- [ ] Full backend suite, frontend typecheck/build, graph update — pending
- [ ] Verification report and product documentation updated — pending

Live semantic model evaluation: NOT RUN; no paid run authorized by this handoff. This is a verification limitation, not a deterministic test pass. Deliver the runnable evaluation and exact supported live command. If later authorized, record the explicit budget and result here. Do not conflate scripted behavior with model understanding.

## Planning baseline (already observed; not implementation completion)

- Date: 2026-09-10.
- Source HEAD: eff3c50585c84376cd4ae3e64dc768da6d7e44b1 plus substantial uncommitted changes.
- From backend: `.venv/bin/python -m pytest tests/test_workspace_scenarios.py tests/test_workspace_context.py tests/test_skills.py tests/test_research_checkpoints.py tests/test_source_library_tools.py -q`.
- Result: 51 passed, 6 existing deprecation warnings, 11.22 seconds.
- No new feature tests, full-suite run, frontend build, browser demo, or paid model calls were performed by the plan author for this handoff.

## Execution checkpoint

- Current step: 1.
- Current candidate source hashes/artifact: not captured by implementer.
- Last completed operation: none.
- Next action: capture baseline and inspect source-library dependency.
- Running test/server processes created by this task: none.
- Pending local effects: none.
- External calls with unknown outcome: none.
- Authorized paid evaluation budget: zero.
- Open blocker: none known before implementation.

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
