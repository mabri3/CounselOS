# Verification

Verdict: **defects prevent readiness**. The required suite and build passed, but independent acceptance probes reproduce material feature failures. The review and required verification are complete. No feature repairs were applied.

## Source and scope

- Checkout: /Users/bharris/Programs/counsel-os-mvp. Branch main; HEAD cbac9f39dffd2ffa24f5ae123e332e929a8df770 plus the recorded pre-existing changes.
- Baseline inventory and hashes: baseline.json, file-inventory.txt, git-status-start.txt.
- User scope: review and proposed repairs only. No application, existing-test, tracker, live-record or provider-setting edits; no paid run, coding agents, commit, push or deployment.
- Latest tracker: all 13 implementation steps checked; acceptance explicitly FAILED. The older CODEX_HANDOFF Step 13 status was not used as the current claim.
- Graphify query ran before source navigation. Graphify update was not run because no application code changed.

## Required checks

The full backend command passed **1,639 tests** with 6 warnings, in 736.62 seconds of pytest time (737.431 seconds for the process). The focused backend set passed **79 tests**. Frontend typecheck, dossier, queue, reference and citation scripts all passed. The production build passed in an owned copy of the exact frontend source, so Next did not change the original tsconfig or build directory.

The first copied build failed because its node_modules symlink escaped the Turbopack root. It passed after dependencies were cloned into that owned directory. This was a review setup failure. The first live-audit helper failed because the backend module search path was absent; the corrected PYTHONPATH=. audit passed without model calls. Neither failure is an application finding.

| Run | Command | Exit | Seconds | Machine-readable record |
|---|---|---:|---:|---|
| diagnostic-fact-route | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR05 --junitxml=../output/dossier-research-first/astra-review/diagnostic-fact-route.xml` | 1 | 2.24 | `diagnostic-fact-route.result.json` |
| diagnostic-review-input | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR22 --junitxml=../output/dossier-research-first/astra-review/diagnostic-review-input.xml` | 1 | 1.82 | `diagnostic-review-input.result.json` |
| diagnostic-source-footer | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR26 --junitxml=../output/dossier-research-first/astra-review/diagnostic-source-footer.xml` | 1 | 0.968 | `diagnostic-source-footer.result.json` |
| diagnostic-valid-source-counts | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR20 --junitxml=../output/dossier-research-first/astra-review/diagnostic-valid-source-counts.xml` | 1 | 2.176 | `diagnostic-valid-source-counts.result.json` |
| diagnostics-boundaries | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR16 or AR17 or AR18 or AR19 or AR20 or AR21 --junitxml=../output/dossier-research-first/astra-review/diagnostics-boundaries.xml` | 1 | 42.023 | `diagnostics-boundaries.result.json` |
| diagnostics-final-boundaries | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py -k AR22 or AR23 or AR24 or AR25 or test_control --junitxml=../output/dossier-research-first/astra-review/diagnostics-final-boundaries.xml` | 1 | 25.295 | `diagnostics-final-boundaries.result.json` |
| diagnostics | `.venv/bin/python -m pytest -q -s ../output/dossier-research-first/astra-review/test_review_diagnostics.py --junitxml=../output/dossier-research-first/astra-review/diagnostics.xml` | 1 | 30.024 | `diagnostics.result.json` |
| focused-backend | `.venv/bin/python -m pytest -q tests/test_dossier_requests.py tests/test_dossier_planning.py tests/test_dossier_content_depth.py tests/test_dossier_managed_research.py tests/test_dossier_batch_publication.py tests/test_dossier_references.py tests/test_dossier_request_api.py tests/test_dossier_request_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_dossier_generation_integrity.py --junitxml=../output/dossier-research-first/astra-review/focused-backend.xml` | 0 | 53.552 | `focused-backend.result.json` |
| frontend-build-owned-copy | `env PHASE2_DIST_DIR=.next-astra-build npm run build` | 0 | 11.917 | `frontend-build-owned-copy.result.json` |
| frontend-build | `env PHASE2_DIST_DIR=.next-astra-build npm run build` | 1 | 1.626 | `frontend-build.result.json` |
| frontend-citations | `node --experimental-strip-types scripts/check-citation-reading.ts` | 0 | 0.304 | `frontend-citations.result.json` |
| frontend-dossier | `npm run check:dossier-research` | 0 | 0.127 | `frontend-dossier.result.json` |
| frontend-queue | `npm run check:research-queue` | 0 | 0.11 | `frontend-queue.result.json` |
| frontend-references | `npm run check:document-reference-behavior` | 0 | 0.254 | `frontend-references.result.json` |
| frontend-typecheck | `npm run typecheck` | 0 | 1.212 | `frontend-typecheck.result.json` |
| full-backend | `.venv/bin/python -m pytest --junitxml=../output/dossier-research-first/astra-review/full-backend.xml` | 0 | 737.431 | `full-backend.result.json` |
| live-read-only-audit-final | `env PYTHONPATH=. .venv/bin/python ../output/dossier-research-first/astra-review/audit_live.py` | 0 | 4.431 | `live-read-only-audit-final.result.json` |
| live-read-only-audit | `.venv/bin/python ../output/dossier-research-first/astra-review/audit_live.py` | 1 | 0.024 | `live-read-only-audit.result.json` |

Each result JSON records its working directory, full command, start time, exit code, duration and baseline version. Matching .log and .xml files hold output and test counts. Failed diagnostic tests are acceptance probes; no existing test was changed.

## Independent probes

The current diagnostic file has 36 distinct tests. Across the saved latest results, 28 acceptance assertions fail and 8 control/recovery checks pass. There are 25 material finding IDs; AR09 has four malformed-output cases. AR16 passed and is not a finding.

The initial fact-reference test stopped at an empty synthetic-fixture precondition. It was corrected to seed two facts and then reproduced the production binding failure. AR22 was narrowed to the selected issues and still failed: two of three answers were absent; the third arrived through latest_research. The count probe was also repeated with a valid supplied-source state and still overstated external reads. Those early broader/precondition results are not used as proof. No passing repository assertion was weakened.

The actual-writer recovery controls independently re-ran saved-response, recommendation, dossier and conversation effect-before-receipt boundaries. They passed with a provider spy installed at the real writer resolver. This corrects the observation gap in the author's child-only spy. Unknown writer outcomes remain a reproduced defect. One-, two- and three-child controls and partial three-child restart also passed.

## Browser evidence

Owned backend/frontend: http://localhost:8207 and http://localhost:3207. Vault: browser-vault, with its matching .dossier-research-browser-fixture.json. No reset was used. The production fixture routers, AppContext, parent coordinator, child harness, chat history and document APIs were used. Only declared model/search/fetch boundaries were fake.

Experimental: setup, priority edit, All-five, public topic, three active workers, first dossier with two later workers active, two distinct internal file links, canonical Markdown edit, background completion, review revision, draft/context preservation and reload were observed. The external saved-passage click produced no visible source view; an exact record/passage drawer is not verified. The fixture’s writer supplies checklist prose itself, and its unresearched issue text is generic. This does not prove the required full-depth or exact-reference behavior.

Standard: setup, Skip, Start, three active workers, Stop, same-vault backend restart without reset, stopped-state reload, Resume with the same IDs, completion and opening the exact revision were observed. The stopped calls had not completed, so this browser case proves identity/state recovery, not reuse of a previously completed call; the latter is covered by the independent partial-batch test. Explicit saved-only chat added one writer/revision with no parent or research calls. The hypothetical preview added one writer call, no parent, no revision and no canonical change. Ordinary chat returned a saved answer with one model call and no research or dossier mutation. browser-after-saved-only.json, browser-after-preview.json and browser-after-normal-chat.json record the counts.

Screenshots browser-01 through browser-15 and named AX/state JSON files record these observations.

## Saved live-model evidence

No new paid evaluation ran. audit_live.py read the author’s separate synthetic evidence and initialized only live-audit-copy. It read the recorded parent/run identities, scopes, budgets, saved source bodies, checkpoint reads, vendor packet and failure event.

- Parent DOR-20260912-f382af on synthetic matter MAT-20260912-f7ed8b. Selected main opencode_go/deepseek-v4.1-flash/max; collector same provider/model with default effort.
- Subscription RUN-7cc4ffbe990727e9 failed: 2 main calls, 4 retrieved sources, 3 not-found searches, no nonempty passage read.
- Privacy RUN-72ac3d54d92d026d failed: 1 main call, 10 retrieved sources, no passage read.
- Vendor RUN-959dbc35258d60cb saved RES-20260912-996d5f: 8 main calls, 12 retrieved sources; 7 nonempty reads from 5 public sources (24,300 passage characters), plus 2 not-found searches.
- Raw bodies of both allegedly changed sources exactly match their saved hashes. Universal-newline reads alone change their hashes. The independent CRLF fetch test reproduces this failure.
- Historical event EVT-20260912-946607 explicitly records model input-size overflow. A fresh capture from the owned audit copy measures 523,615 input bytes against the current default 256,000-byte ceiling, mainly duplicated proposal and latest-research source data. This measurement is not the exact historical dispatch payload.
- The separate KeyError is source_label: five captured local records lack the formatter’s required field. It removes the source footer but is not the recorded cause of dossier generation failure.
- The vendor body correctly applies the supplied fictional Section 6 breach-only/payment/read-only/ten-calendar-day exception, states operational conditions and keeps the other workstreams open. Its supporting public passages are practice commentary/vendor guidance. This is not proof of legal correctness or completed public-law research for the other issues.
- Author timings: preparation 83.155s; child elapsed 85/162/389s; request 472.208s. Saved timestamps/budgets are consistent with those order-of-magnitude timings. The first-pass metric was set at 471.473s, but no useful new dossier existed. Cost was unavailable.

Detailed evidence: live-source-audit.json, live-audit-summary.json, live-source-format-audit.json, live-read-only-audit-final.log and the saved original Step 13 artifacts. The original synthetic vault is unchanged.

## Limits

This review tests the feature and relevant existing B/C/D/G/H acceptance behavior. It does not repeat unrelated matter closure, scheduling, paid live-provider, multi-person workflow, export, mobile, 200% zoom or reduced-motion journeys. Deterministic checks are separate from the saved live-quality assessment. No claim of exhaustive legal correctness or exactly-once external billing is made.

## File preservation and cleanup

The end check compared all **11,527 pre-review file hashes**. Application source, existing tests, build tracker, original Step 13 synthetic evidence, active-vault pointer and protected Harbor dossier are unchanged. No original file is missing and no new path exists outside the review directory. `git diff --check` passed.

One existing full-suite test (`backend/tests/test_matter_memory_sources.py:25`) rewrites `output/matter-memory-paths/capacity.json`. The first preservation check caught that side effect. The exact pre-review body was recovered from existing Git object eeac8cb97377a9576fafa1992864349a86fb18cf, verified against the original SHA-256, and restored after checking no later writer had changed it. The new measurement is retained as full-suite-capacity-side-effect.json. The initial hash, recovery evidence and final check are in preservation-check.json and capacity-recovery-search.json. Future review runs should route this benchmark to an owned output or preserve its body first. No existing test was edited.

Owned browser tabs are closed. Ports 8207 and 3207 are clear. Owned backend and frontend server process IDs and termination records are in owned-server-cleanup.json. The fixture was never reset. Logs, screenshots and the review fixture remain available. Original build output was not used or replaced.

## Acceptance map and next action

- Existing B/H: matter, saved dossier/revision, Markdown editor, save/reload, preserved local draft/context and review-only update were exercised. The direct saved-text edit failure remains AR04; UI preservation in one path does not prove all paths.
- Existing C: standard and experimental chat, saved history, usable composer, ordinary mock response, no implicit decision and no new research for saved-only/preview were exercised.
- Existing D: distinct managed runs, saved packets, source choices, source and checkpoint read traces were checked. Depth, source counts and reference defects remain.
- Existing G: owned vault/reset refusal code, malformed parent validation, path checks, crash/replay tests and the final original-file hash comparison were checked. Other historical browser journeys are not newly claimed as passed.
- New feature browser cases: setup, edit/skip, All-five batching, early first pass, two internal file links, edit/reload, Stop/restart/Resume, standard flow, saved-only, hypothetical preview and unique output identities were checked. Exact fact/passages are defective or unverified as stated above.

Repair the findings before a controlled user trial. First address AR01/AR26 source persistence and formatting; AR02/AR03/AR14/AR15/AR22 deterministic full-content composition and fallback; AR04 publication basis checks; then AR05/AR20/AR21 references and coverage, followed by source/priority controls, concurrency and recovery. Use the saved independent probes as acceptance tests and keep the passing controls. Do not repeat a paid quality check under this review’s authorization.
