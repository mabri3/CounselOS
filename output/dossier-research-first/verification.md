# Research-first dossier build — final verification

Date: September 11, 2026, America/Los_Angeles  
Implementation status: COMPLETE  
Overall acceptance status: INCOMPLETE — live configured-model quality check failed

## Implemented behavior

The build adds a saved, research-first dossier request that:

- prepares an issue map before research;
- keeps complete issue answers, history, source records, and references;
- starts up to three managed research children without making the short chat request wait;
- publishes safe recommendation and dossier updates by completed batch;
- resumes conservatively across interruption and restart without repeating completed external work;
- exposes list, get, start, stop, and resume API routes;
- routes unrestricted manual dossier generation into the saved parent flow while preserving explicit preview and saved-material-only behavior;
- persists and replays dossier research cards through chat history;
- shows setup, scoped polling, progress, stop/resume, source details, exact revision links, and first-pass links in both chat screens;
- preserves the user's draft, context, editor state, tabs, and scroll during polling and refresh.

## Files changed by this execution

Added application and test files:

- `backend/app/models/dossier_request.py`
- `backend/app/routers/dossier_requests.py`
- `backend/app/services/dossier_generation.py`
- `backend/app/services/dossier_generation_chat.py`
- `backend/app/services/dossier_generation_context.py`
- `backend/app/services/dossier_references.py`
- `backend/app/services/dossier_request_execution.py`
- `backend/app/services/dossier_requests.py`
- `backend/app/services/dossier_research.py`
- `backend/app/blank_vault_template/00_System/skills/dossier-generation.md`
- `backend/scripts/refresh_dossier_research.py`
- `backend/tests/manual/serve_dossier_research.py`
- `backend/tests/test_dossier_batch_publication.py`
- `backend/tests/test_dossier_content_depth.py`
- `backend/tests/test_dossier_managed_research.py`
- `backend/tests/test_dossier_planning.py`
- `backend/tests/test_dossier_references.py`
- `backend/tests/test_dossier_request_api.py`
- `backend/tests/test_dossier_request_lifecycle.py`
- `backend/tests/test_dossier_requests.py`
- `frontend/components/DossierResearchCard.module.css`
- `frontend/components/DossierResearchCard.tsx`
- `frontend/lib/dossierRequests.ts`
- `frontend/scripts/check-dossier-research.ts`

Edited application, test, and documentation files:

- `backend/app/active_context.py`
- `backend/app/agents/output.py`
- `backend/app/main.py`
- `backend/app/models/api.py`
- `backend/app/models/dossier_request.py`
- `backend/app/models/research_investigation.py`
- `backend/app/routers/chat.py`
- `backend/app/runtime.py`
- `backend/app/services/chat_history.py`
- `backend/app/services/chat_runs.py`
- `backend/app/services/dossier.py`
- `backend/app/services/dossier_request_execution.py`
- `backend/app/services/dossier_requests.py`
- `backend/app/services/main_agent_research.py`
- `backend/app/services/research.py`
- `backend/app/services/research_execution.py`
- `backend/app/services/research_publication.py`
- `backend/app/services/research_runs.py`
- `backend/app/services/workspace.py`
- `backend/tests/manual/serve_research_investigation.py`
- `backend/tests/test_dossier_generation_chat.py`
- `backend/tests/test_main_agent_research.py`
- `backend/tests/test_research.py`
- `frontend/components/ChatCards.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/DossierResearchCard.tsx`
- `frontend/components/experimental/ExperimentalChat.tsx`
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- `frontend/package.json`
- `frontend/scripts/check-dossier-research.ts`
- `frontend/tsconfig.json`
- `docs/ACCEPTANCE_TESTS.md`
- `docs/living-dossier.md`
- `CODEX_HANDOFF.md`
- `handoffs/dossier-research-first.handoff-progress.md`

The complete evidence directory `output/dossier-research-first/` was also added. It contains step records, JUnit XML, browser evidence, the isolated fixture vaults, and the live-quality evidence.

Pre-existing dirty work was preserved. The execution does not claim unrelated changes to agent dispatch/runner code, provider settings and providers, research collection, vault and workspace scenario services, experimental chat, matter-path state, unrelated tools/skills, the Mosaic Relay vault, or other output folders. Some dossier modules were untracked before this build; this execution edited them in place instead of replacing unrelated work. The baseline is recorded in `baseline-git-status.txt` and `baseline-source-hashes.txt`.

## Automated verification

Detailed commands and exit codes are in `step-01.md` through `step-13.md`. Key final checks were:

| Scope | Command | Result |
|---|---|---|
| Step 9 integration | `cd backend && .venv/bin/python -m pytest -q tests/test_dossier_request_api.py tests/test_chat_runs.py tests/test_dossier_generation_chat.py tests/test_research_lifecycle.py` | EXIT 0; 100 passed |
| Step 10 UI | `npm run typecheck`; `npm run check:dossier-research`; `npm run check:research-queue`; `node --experimental-strip-types scripts/check-citation-reading.ts` | All EXIT 0 |
| Step 11 recovery | `cd backend && .venv/bin/python -m pytest -q tests/test_dossier_request_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_dossier_generation_integrity.py` | EXIT 0; 27 passed |
| Final backend suite | `cd backend && .venv/bin/python -m pytest --junitxml=../output/dossier-research-first/pytest.xml` | EXIT 0; 1,639 passed, 0 failed, 0 errors, 0 skipped |
| Final frontend checks | Typecheck, dossier research, research queue, document references, citation reading | All EXIT 0 |
| Final frontend build | `cd frontend && PHASE2_DIST_DIR=.next-dossier-research-first-build npm run build` | EXIT 0; 15 of 15 pages generated |
| Final whitespace check | `git diff --check` | EXIT 0 |

The final backend suite ran after the two defects found during browser work were repaired. No later backend application code changed. Step 13 changed evidence and tracker files only, so the full suite and build were not repeated.

## Browser result

All 15 blueprint browser steps passed through the actual experimental and standard chat components. The isolated fixture used ports 8199 and 3199 and fake model/search/fetch boundaries. The proof covers setup choices, staged publication, exact source/revision navigation, state preservation, Stop across backend restart, Resume with stable child IDs, reload hydration, saved-only generation, preview, and publication de-duplication.

Artifacts:

- `browser-results.md`
- `browser-boundary-counts.json`
- `browser-standard-all-five-complete.png`
- `browser-standard-saved-preview.png`
- `browser-backend.log`
- `browser-frontend.log`

The browser fixture finished with zero active fake workers, searches, or fetches. Ports 8199 and 3199 were clear after cleanup.

## Live configured-model result

Exactly one configured-model exercise ran. The saved provider/search configuration was available. Preflight identity evidence was written before the first external call.

- Preparation: 83.155 seconds.
- Child active times and main calls: subscription 85 seconds / 2; privacy 162 seconds / 1; vendor 389 seconds / 8.
- Full request: 472.208 seconds.
- Search: 7 Firecrawl legs; 24 unique retrieved source IDs.
- Passage records: 12 total; 7 with non-empty text and 5 `not_found`.
- Publication: 1 attempted; 0 successful dossier revisions.
- Cost: unavailable; no estimate made.

The vendor worker produced a useful partial packet. It applied the deep synthetic contract exception, separated contract terms from public commentary, explained the vendor/access-loss dependency, proposed conditions, gave a concrete next step, and retained the other issues. The parent record separated the launch event from the administration date and kept reported facts separate from the inferred assumption.

The quality check failed overall. Subscription and privacy stopped with `ValueError: Saved source snapshot hash changed.` Privacy retrieved primary-law results but saved no passage reads. The recommendation proposal was saved, but the dossier receipt failed and no new revision was created. The console also reported a citation-formatting `KeyError`. See `live-quality-assessment.md`, `live-quality-attempt.json`, and `live-quality-result.json`.

## Safety incident and final state

During Step 12, the first browser-fixture smoke form used `ActiveContextManager`. It rebuilt the disposable SQLite index in the saved active Mosaic Relay vault before failing. No fixture server started. The active pointer did not change. No Markdown source changed in that attempt. The fixture was corrected to use direct `AppContext` and now rejects configured and saved-active vault paths.

Two SQLite temporary files from that incident remain because safe execution ownership cannot be proved:

- `Mosaic Relay UX Experiment 2026-09-03 R3/..counsel_os_cache.db.ctrn13dm.tmp`
- `Mosaic Relay UX Experiment 2026-09-03 R3/..counsel_os_cache.db.ctrn13dm.tmp-journal`

They were not removed or modified.

Final safety checks:

- Real Harbor dossier SHA-256: `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2` — matches baseline.
- Active pointer SHA-256: `7116f19dcdb721ad716f5e95e46f144b5ad55f4973e3bb8787fe809d1feadcd2` — matches Step 12 and still selects the Mosaic Relay vault.
- Step 13 used only `output/dossier-research-first/live-quality-vault`.
- No execution-owned service remains. Ports 8199 and 3199 are clear.
- No commit, push, merge, or deployment was done.

## Acceptance and next action

Steps 1–13 are implemented and their required exercises were performed. Deterministic automated and browser acceptance passed. Overall acceptance is not complete because the required live-quality exercise exposed failures that prevented two issue packets and the final dossier publication.

Exact next action: add deterministic reproductions for concurrent/shared saved-source snapshot mutation and the citation-formatting/dossier-publication path. Repair only those defects and run focused backend checks. Before any second configured-model exercise, obtain separate authorization because the single authorized attempt has been used.
