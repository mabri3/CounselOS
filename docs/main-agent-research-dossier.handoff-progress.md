# Progress — main-agent research and coherent dossier

Implementation preflight started on 2026-09-09. Update the relevant line immediately after each
step's verification. Record actual commands/results and limits. Read this file
before starting or resuming. Do not redo completed work blindly.

- [x] Step 1: Baseline and regression fixtures — 4 fixture tests passed; 46 baseline tests passed
- [x] Step 2: Separate models, scope, and origin — 37 focused tests passed
- [x] Step 3: Collection and exact passage reads — Verified: exact/linked URLs, literal passages, local snapshots, PDF/OCR and bounds
- [x] Step 4: Main-agent investigation loop — Verified: shared main loop, distinct collector, bounded continuation and durable calls
- [x] Step 5: Synthesis parsing and operational answer — Verified: malformed synthesis preserves prose; hostile/no-result/timeout collection keeps useful answers
- [x] Step 6: Reconcile and project the dossier — Verified: publication basis, source links, assumptions, lawyer edits and replay
- [x] Step 7: Durable result in the original conversation — Verified: original conversation delivery, duplicate confirmation and restart after message write
- [x] Step 8: Source choices and completion refresh in the UI — Verified: role/source card, automatic completion refresh, read-only saved links
- [x] Step 9: Full sequence and hostile-output regression — 1,334 full-suite passes; final affected groups 35/25/18 passed; exact coverage limits in verification report
- [ ] Step 10: Browser demo, bounded live evaluation, and handoff — Browser and handoff complete; live evaluation FAILED; acceptance remains incomplete
- [ ] Acceptance check: Both complete sequences and failure matrix; actual verification report — pending

## Current execution checkpoint

Update after each completed substep, before context compaction/handoff, and after
each verification. This is the implementing agent's checkpoint; the application
run checkpoints are specified in blueprint section 4.9a.

- Checkpoint sequence: 12
- Updated at: 2026-09-10 UTC / September 9 Pacific
- Current step/substep: OpenCode live collection comparison passed retrieval; citation formatting and coherent synthesis remain unresolved.
- Last completed action: User-authorized OpenCode comparison completed. Main stayed DeepSeek V4 Flash; collection used OpenCode Go DeepSeek V4 Flash native search, no Polaris. Run RUN-20260910-58c98e: 278.52s, 12 main calls, 2 batches, 4 requests, 13 saved pages, 5 passage reads, one original-conversation completion. Protected files: 2,129 unchanged.
- Next exact action: Fix citation-formatting KeyError and invalid synthesis reconciliation; source selection also admits search/navigation/sign-in pages. Then verify the full public flow with OpenCode in a fresh acquisition matter. Do not claim full acceptance: malformed assumption updates and contradictory reliance fields remain unresolved. No application code or workspace defaults changed during the comparison.
- Owned files changed by implementer: Research models, checkpoint/collection/execution/publication/document services, safe fetcher, shared runner/tools, research/chat routes, dossier/recommendation/record adapters, workspace review's published revisions, output link cleanup, source-choice UI and refresh, new tests/manual helpers, requirements and handoff docs. Existing baseline manifests distinguish unrelated work.
- Verified results: Full suite attempt 1: 1306 passed/17 failed. Attempt 2: 1323 passed/4 failed (mock status, repaired). Affected group: 179 passed/1 failed (research section, repaired). Later groups: 62 passed; 64 passed. Frontend typecheck/build and recovery/queue checks passed. Two real HTTP lifecycle cases and literal PDF link browser flow passed.
- Unverified edits: No untested application edits remain. The final small fixes passed their affected groups. Live-model quality remains unverified. Final graph refresh completed.
- Known failures/blockers: OpenCode DeepSeek successfully retrieves evidence. Citation formatter KeyError persists. Main synthesis emitted invalid and contradictory assumption/proposition fields. Source URLs include irrelevant search/navigation pages. Overall acceptance remains incomplete; exact findings are in the verification report.
- Fixture vault/server paths and owned process IDs: Browser vault /var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/main-research-browser-6phvwnk2/vault retained. Test backend/frontend are stopped and browser tab closed. User frontend PID 14692 port 3000 was preserved. Live vaults are recorded in live-evaluation*.txt; no active live run.
- Resume warning: Preserve unrelated edits and real records. Do not rerun completed paid work. Do not stop the user frontend on port 3000. Review the saved checkpoint before starting any later work.

## Checkpoint evidence log

Append one short entry per verified substep. Keep older entries. Record date,
step, files changed, exact verification command, exit/result, and next action.
For an interrupted external-call test, record whether its outcome was known or
unknown and prove that the budget was retained. Do not log credentials.

2026-09-09 — Preflight: `git status --short` and `graphify query "research runs provider routing and dossier publication"` completed. Saved 690 source hashes and 2,129 protected hashes under `output/main-agent-research-dossier/`. No application edits. Focused baseline running.

2026-09-09 — Baseline: native/scope/living-dossier/recommendation group passed 46 tests (13.79s). New fixture run failed collection because implementer used `MatterRecordsService`; inspected source and corrected to `MatterRecordService`. Next: rerun Step 1 fixtures.

2026-09-09 — Step 1: `cd backend && ./.venv/bin/python -m pytest tests/test_main_agent_research.py tests/test_research_publication.py -q` passed 4 tests in 0.80s. Prior fixture-only run passed 3 tests in 0.47s. Actual direct ResearchService path retained new answer in packet while old recommendation stayed current, with no proposal. Isolated fixture vaults only; no servers. Next: Step 2 role snapshots.

2026-09-09 — Step 2 fail-first: scope test failed with three `extra_forbidden` errors for the missing role/follow-up fields (1 failed, 1 passed). Next: add validated optional fields and queue/proposal snapshots.

2026-09-09 — Step 2 first group: 4 failed, 32 passed. Diagnosed one old single-role expectation, two exact old-schema expectations, and a unit fixture with no conversation ID. Updated tests to assert both roles and all new defaults; optional origin supports legacy/no-origin data. Next: verify updated routing group.

2026-09-09 — Step 2 routing group passed 36 tests in 10.85s. Added bounded payload models and a distinct-role/legacy-record queue test afterward; these new additions await final Step 2 check.

2026-09-09 — Step 2 final group passed 37 tests in 11.27s. Changed scope/API models, research run snapshots, runtime callbacks, source proposal/confirmation/options, and exact model/default assertions. Legacy saved records remain untouched. New runs store version 2 and both roles; main execution switch is Step 4, not yet implemented.

## Architecture clarification — 2026-09-09

User clarification received through the coordinating task overrides dossier-only
scope below. The shared main-agent harness is the default for ordinary chat and
research. It understands context, identifies material propositions or missing
facts, obtains evidence when useful, assesses relevance and exceptions, continues
within limits, and returns an operational answer to its original conversation.
The main agent owns context selection, judgment, continuation and stopping. The
cheap worker only collects requested public evidence and reports provenance/errors.
Web calls are conditional; simple drafting needs none. Do not force a dossier,
research job or document write on each chat turn. Preserve confirmed source scope,
source honesty, useful partial answers, lawyer edits and recommendation/decision
separation. Reuse existing chat/research durable storage and the shared runner.
Checkpoint before external calls and after evidence, main decisions, synthesis and
publication; replay completed effects, retain consumed budgets, and label uncertain
paid calls outcome_unknown. Do not add a second orchestrator or new infrastructure.
Acceptance additionally covers zero-search simple chat, targeted evidence from
substantive ordinary chat, bounded follow-up on weak/conflicting evidence, useful
failure/limit output, appropriate dossier updates, and interruption/resume at
collection, synthesis and publication without duplicates or lost edits.

Checkpoint clarification: Steps 1–2 evidence remains valid. Step 4 must implement the shared default main-agent contract and recovery for ordinary chat as well as the research path. Step 9/10 acceptance must include the additional ordinary-chat cases. No Step 3 application edits yet.

2026-09-09 — Step 3 fail-first passage test: 1 failed, 5 passed. Upstream truncation warning was lost; fixed reader propagation. Late exception, literal saved hash/offset, duplicate passage budget, and forged-context rejection passed. Added collection/checkpoint helpers (checkpoint helper introduced here because collection reservations require it; full Step 4 wiring/testing remains pending). Next: Step 3 regression group.

2026-09-09 — Step 3 group passed 43 tests in 9.31s. Added main-loop adapter and trusted shared instructions as Step 4 work in progress; not yet routed from ResearchService. Added actual collection/follow-up reuse test; next run validates this and then wires research entry points.

## Source-reader extension — 2026-09-09

The user also authorized exact public HTTPS URL retrieval, linked-source reading,
text PDF extraction with page numbers, and bounded OCR for scanned/mixed PDFs.
Reuse source storage, budgets, safe network checks, and durable checkpoints. Keep
usable links. Never decode PDF bytes as UTF-8 webpage text. Preserve partial work,
original URLs, page boundaries, extraction method, truncation and OCR uncertainty.
Use OCR only on pages that need it; no runtime dependency installation or separate
service/orchestrator. Main-agent judgment controls source/page selection. Saved
fetch/extraction results must survive resume without duplicate paid calls.
Tests must include exact and linked URLs, text/scanned/mixed PDFs, bounds, partial
failure, real local extraction/OCR and a full conversation/dossier evidence path.
Inspect dependencies first; report deployment prerequisites and verified paths.


Step 3 extension preflight: backend has pypdf, PyMuPDF (fitz), Pillow and reportlab. Local tesseract and bundled pdftoppm are available. No dependency installed. Shared-loop routing tests passed 7 local fixture tests in 1.07s; complete Step 4 regression remains unrun. Next: prove the real main loop with collection, then extend safe binary reader.

2026-09-09 — Shared-runner sequence: `tests/test_main_agent_research.py` passed 8 tests in 2.13s. Real runner made two main turns with actual collector tool dispatch between them; only worker received public query; retrieved literal text reached main answer. Application publication and shared ordinary-chat recovery still incomplete. Next: full Step 4 group and source-reader extension.

2026-09-09 — Step 4 regression FAILED: interrupted owned pytest PID 79284 after 226.23s because it stalled. 11 failed, 95 passed before interruption. Full output: output/main-agent-research-dossier/step4-tests.txt. Diagnosed old runner fakes rejecting new execution_state/investigation keywords; adapter now filters unsupported callback kwargs. Other failures include prior precollection/research-agent expectations and missing version-2 publication (not built). Do not mark Step 3/4 done. Next: complete source-reader tests, then repair regression semantics and publication.

2026-09-09 — PDF fixture run failed 4 tests: new extraction adapter passed a string to VaultService, which requires Path. Fixed that constructor call; rerunning real extraction/OCR. No external calls made.

2026-09-09 — Real PDF/OCR rerun passed 4 tests in 1.29s (text, scanned, mixed, damaged/oversized). New unverified work: synthesis parsing, recommendation publication metadata, generated-assumption retirement, dossier composition, publication helper, research-run retry/stop wiring, shared ordinary-chat call journal. Next: focused complete-sequence/publication and checkpoint tests before broad regressions.

2026-09-09 — Focused fail-fast run: 1 failed, 3 passed (1.85s). Source-reader test still patched old text-fetch boundary after binary support. Updated it to supply bounded binary text with an exception after 16,000 chars and >100,000 input; browser fallback test now patches binary fetch. Next: rerun.

2026-09-09 — Focused group: 42 passed, 1 failed in 16.74s. Journal converted malformed reply classification from output_shape to provider. Fixed journal to record the returned malformed result and let the existing runner classify it. Next: verify checkpoint/publication fixtures and rerun focused group.

2026-09-09 — Checkpoint/chat group: 60 passed, 1 failed in 31.47s. Diagnosis: synchronous execute_chat test has a submission ID without a ChatRun record. Journal now requires an existing durable run. User-facing matter /chat route adapts through existing ChatRunService; direct internal execute_chat remains compatible. Publication tests passed 6 cases in 4.31s, including stale facts, byte-preserved lawyer edits, generated-assumption retirement without facts, origin completion and idempotent retry. Next: rerun shared-loop/chat group and all research regressions.

2026-09-09 — Focused main/publication/checkpoint/chat group passed 72 tests in 37.48s. Frontend source-role/follow-up fields, publication state, interrupted billing notice and guarded transcript refresh added; typecheck not yet run. Read frontend AGENTS.md and installed Next use-client guide. Next: frontend checks and full research compatibility diagnosis.

2026-09-09 — Frontend typecheck, chat-run-recovery and research-queue checks passed. Research fail-fast run: 1 failed, 1 passed (0.91s); old projection test invoked a direct packet-only caller. Replaced it with actual queued publication failure assertion. Existing external_research helper explicitly tests execution_version=1 compatibility; new main-agent collector tests remain version 2. Added fetched-byte/discovery replay boundaries and collector-unavailable partial path; these latest edits await checks.

2026-09-09 — Research group failed 14, passed 39 in 21.66s. Fixed duplicate direct internal search, missing standalone run records/issue targets, dropped analysis failure metadata, and collection diagnostics. Updated tests to inspect the actual frozen context, separate saved roles, main-provider failure, queued dossier publication and non-evidentiary source previews. Queue fake now saves an actual synthetic packet for real publication. Next: rerun full research tests, then broader required checks.

2026-09-09 — Research/dossier repair group: 64 passed, 1 failed in 30.62s. Fixed heading nesting at the correct work-state boundary; preserved the existing empty question instead of inventing one from the next action. Added ordinary-chat tool result replay, monotonic saved budgets, conservative interrupted-call time, exact origin user message, saved dossier revision replay and PDF per-page extraction checkpoints. Full backend suite is running and has further failures. Frontend typecheck/build passed.

2026-09-09 — Full HTTP lifecycle fail-first: public-source case passed; internal-only scripted provider failed because its fixture expected spaced JSON. Fixed the fixture to recognize compact saved scope. Rerun `tests/test_research_lifecycle.py`: 2 passed in 16.25s. Real API creation, source card, confirmation, main collector follow-up, real PDF extraction, literal page read, original conversation, dossier publication and duplicate confirmation exercised. PDF/checkpoint group also passed 8 tests. Browser servers own PIDs 83823 (8127) and 83848 (3127); vault path in browser-backend.txt. Browser walk in progress.

2026-09-10 — Full attempt 1: 17 failed, 1306 passed in 474.02s. Restored synchronous HTTP contract and added an internal journal at its existing main-run boundary. Fixed nested dossier headings and legacy-source test seams to exercise either explicit version 1 or main-directed version 2. Affected group passed 179 tests with one remaining research-heading assertion; repaired that heading.

2026-09-10 — Browser external case: source choice showed both saved roles/follow-up; confirmation completed and inserted answer without another message. Reload and backend restart preserved the run and answer. Clicked literal saved PDF link and saw page 1 text. Found and fixed output cleanup destroying named file links; link regression group passed 12 tests. Publication revision links were unavailable because historical revisions were excluded from workspace documents; published revisions are now included read-only.

2026-09-10 — Live evaluations used configured openai_compatible/deepseek-v4-flash, fixture collector mock plus configured search services, synthetic records only. First pair completed in 5.96s/3.32s but only returned plans; this is a FAILED model-quality result. Added one bounded planning continuation. Second pair used 3/2 main calls and 1/0 collection batches (three/no propositions), no fetched pages; later main calls failed. Saved outputs retained, with an incomplete-answer path. Helper cleanup typo fixed after first pair; no extra model call for cleanup.

2026-09-10 — Full attempt 2: 4 failed, 1323 passed in 379.89s, all four mock completion status regressions. Repaired status distinction between empty mock output and an incomplete live analysis. The later research group passed 78 tests plus one failed new sync-journal assertion; diagnosed persist_scope wrapping the callback, used execution_state to identify synchronous entry, and verified 64 affected tests passed (103.56s). Latest focused and full runs pending.

2026-09-10 — Checkpoint 6: Full backend run passed 1,330 tests and failed one 0.4-second index-wait test while graph update saturated a core. The same timeout test passed unchanged in the 17-test recovery group after graph update finished. New source reads preserve two supplied snapshots and budget use. Added separate browser/Firecrawl transport receipts and tested interrupted unknown calls versus completed-result replay. Full fresh suite now runs without concurrent graph load.

2026-09-10 — Checkpoint 7: Steps 3–8 marked verified from the collected test evidence. Browser contract search needed a document-scoped second query because old transcripts occupied initial search results; strengthened the script. Actual source reads then exposed a publication filter gap. Trusted snapshot copies now survive that filter and appear in dossier links; 35 related tests passed. The full suite predates this last small fix, which is covered by that affected group. Final graph refresh includes the fix.

2026-09-10 — Checkpoint 8: Full suite passed 1,334 tests. A new run with identical advice now retains its own publication identity, while retry remains idempotent (25 tests passed). Full local-text capture preserves a middle exception outside the opening view (18 tests passed). Final browser records contain exactly one completion message per checked public/internal run. The final graph refresh is running after the last source edit; prior refresh attempts were stopped to include later fixes.

2026-09-10 — Checkpoint 9: Browser switch and reload checks passed; test tab and owned servers closed. Only the two generated Next files were restored from their proven clean preflight state. All 2,129 protected files still match. Final graph update is the remaining running local check.

2026-09-10 — Final checkpoint 10: graphify update completed, source graph/report updated. HTML skipped at the tool display limit; no semantic API call. Restored frontend typecheck and git diff --check passed. All 2,129 protected hashes matched again. Verification report finalized. Live acceptance remains FAILED; no claim of live model quality or exhaustive every-boundary crash testing. No commit, push, dependency installation or real-vault migration.

2026-09-10 — Checkpoint 11: User reported Wi-Fi was off and authorized retry. Ran tests/manual/evaluate_research_investigation.py against new temporary vault main-research-live-vfisxup1. Both runs completed and published; external evidence acceptance FAILED, internal comparison/scope enforcement passed with an unnecessary blocked collection attempt. Both citation formatters raised KeyError and preserved output. Updated verification report with exact results. Old results archived before helper wrote the new results.

2026-09-10 — Checkpoint 12: OpenCode comparison succeeded at retrieval (13 saved pages, five literal passage reads versus zero with Polaris), completed in 278.52s, and published one answer. Remaining source-quality, citation and synthesis failures recorded. Main model unchanged. Test-only native scope; no workspace-default changes.

2026-09-10 — Checkpoint 13: User selected both Sol follow-up and application guidance. Sol independently planned focused searches, found the acquired-account exclusion, and revised its answer. Same-rubric judgment rose from 78/100 to 90/100; this is one case with an extra reasoning turn and web evidence, not a search-provider comparison. Existing application loop now explicitly permits review-directed collection and literal reads. Success, failure and disabled-follow-up tests passed. Full backend suite passed 1,344 tests; frontend typecheck/build passed; isolated browser run completed two linked research requests and saved the answer. Known reader/link display defects remain documented. See docs/research-review-followup.verification.md.

2026-09-10 — Checkpoint 14: Related authorized AltBench instruction improvement applied to the five shipped source tools, model schema descriptions, and main-agent guidance. Documented actual Counsel OS matching, IDs/URLs, character limits, page/find overrides, continuation, no-match recovery, incomplete reads and material cross-references. Existing-vault compatibility uses the existing bundled precedence, verified without vault rewrites. Final related regression group passed 137 tests (six dependency warnings); all 2,129 protected hashes matched. No new paid experiment, default change, context/memory subsystem, service or mandatory review call. Final graph refresh completed: 226,325 nodes, 498,272 edges, 14,064 communities. HTML skipped at the size limit; graph/report updated without semantic API calls.
