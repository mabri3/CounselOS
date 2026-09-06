# Progress — Themis.ai reliability build

Read this file before starting or resuming. Do not redo a completed step unless its verification now fails. After each accepted step, update its line immediately. On failure, append `— FAILED: <short evidence>`.

## Baseline

- Branch at plan creation: `main`
- Commit at plan creation: `13f8db7 Update Counsel OS implementation and project artifacts`
- Backend baseline: 501 passed, 1 warning
- Frontend baseline: typecheck and build passed
- Known baseline issue: `npm run check:workspace-ux` fails the brittle `Review intake must open the original request` source-shape assertion. Verify behavior before changing the assertion.

## Execution

- [x] Step 0: Preflight and uncertain-cause diagnosis — done 2026-08-31
- [x] Step 1: Shared contracts and matter-state foundations — done 2026-08-31; coordinator verified 45 focused backend tests and frontend typecheck
- [x] Step 2A: Chat truth, transport, answered intake, and recovery — done 2026-08-31; coordinator verified 79 focused backend tests, both frontend transport scripts, and typecheck. Canonical direct-save UI integration remains assigned to Step 6 after Step 4A freezes the lifecycle API.
- [x] Step 2B: Research truth and distinct artifacts — done 2026-08-31; coordinator verified 81 focused backend tests and typecheck. Provider-resolution failure now leaves Intake unchanged and creates no orphan run.
- [x] Step 2C: Decision integrity and visibility — done 2026-08-31; coordinator verified 18 focused backend tests and typecheck.
- [x] Step 3: Wave 1 ownership and combined gate — done 2026-08-31; ownership matched the three assigned chunks, `git diff --check` passed, 128 combined backend tests passed, and frontend typecheck passed.
- [x] Step 4A: Canonical work product and reachable lifecycle — done 2026-08-31; coordinator inspected the diff, corrected ISO fallback ordering, and verified 44 focused backend tests.
- [x] Step 4B: Company-profile integrity and simple setup — done 2026-08-31; coordinator inspected the diff and verified 23 focused backend tests plus frontend typecheck.
- [x] Step 4C: Human document authorship and review noise — done 2026-08-31; coordinator inspected the diff and verified 31 focused backend tests plus frontend typecheck. Physical Home → End → Shift+ArrowLeft remains in the Step 8 browser gate.
- [x] Step 5: Wave 2 ownership and full backend gate — done 2026-08-31; ownership matched all three assigned chunks, `git diff --check` passed, and the full backend suite passed with 531 tests and one existing deprecation warning.
- [x] Step 6: Matter workspace integration — done 2026-08-31; coordinator inspected the diff and reran matter-brief, the full workspace UX checks, typecheck, production build, and `git diff --check`. A narrow typed draft endpoint was added and verified with 46 lifecycle tests so Chat recovery performs a direct persisted save.
- [x] Step 7: Themis.ai naming pass and exception audit — done 2026-08-31 after correcting one coupled old-heading assertion; exact negative inventory is classified below, all frontend source-check scripts passed, workspace checks/typecheck/build passed, full backend passed with 534 tests and one existing deprecation warning, and `git diff --check` passed
- [x] Step 8: Full checks, graph update, and isolated browser demo — done 2026-08-31 after correcting the browser-found legacy-draft selection. The isolated matter now shows the canonical draft, completes approve → send → close, and preserves Closed, moderate risk, and the canonical artifact after visible navigation away and back. Safari physical-key input proved Home → End → Shift+ArrowLeft selection works in the editor; the in-app Shift chord failure also reproduced in a plain textarea and is a browser-control limit.
- [x] Step 9: Independent read-only Sol High combined review — done 2026-08-31; reviewer reported 9 actionable findings: 3 critical, 3 high, and 3 medium. The reviewer made no edits and is reserved for the required same-reviewer recheck.
- [x] Step 10: Corrections, reviewer recheck, and project-memory reconciliation — done 2026-08-31; Sol Light workers corrected all 9 findings plus 3 recheck regressions, the same Sol High reviewer completed two read-only rechecks and reported no unresolved material finding, the final full verification set passed, and `current.md`, `CODEX_HANDOFF.md`, `contextmap.md`, `decisions.md`, and active acceptance evidence were reconciled

## Diagnosis record

- Finalize endpoint result: In an isolated pytest vault, a valid canonical draft returned HTTP 200, moved `generate` to `respond`, and an exact retry returned the same final path with no second stage event. The backend endpoint is live; the observed inert path is frontend artifact selection or stale client state.
- Chat user-turn persistence timing: A normal `ChatRunService.start()` returns its queued record before a conversation exists. `execute_chat()` appends the user turn only after the event loop starts the background task. Intake is the deliberate exception: `_start_intake()` appends the user message first and binds the run to it.
- Human-keyboard editor reproduction: Reproduced in the visible in-app browser on a real editable Lexical document. After a direct coordinate click, physical Home, End, and Shift+ArrowLeft input left the caret at the first title span offset 0 and did not create a selection. A focused Lexical correction is permitted; do not broaden it beyond this reproduced behavior.
- Matter materials render location: `frontend/components/MatterWorkspace.tsx`, inside the `Materials, activity, and decision maintenance` details section under `Matter materials`.
- Matter contents count definition: The current local `countFiles()` counts every leaf in the raw API tree, including operational records. The approved replacement is the number of current user-facing document nodes after operational records are filtered, using one pure helper for the tree and displayed count.
- Research-agent mock-selection cause: The active copied vault stores `provider: mock`, `model: mock`, and `reasoning_effort: default` on `research-agent.md`, while `/api/config` reports workspace provider `openai_compatible`. `ProviderRouter.resolve()` correctly honors this explicit agent override. Keep it selected and add a visible warning; do not silently inherit.
- Concurrent index rebuild reproduction: Deterministically reproduced with two `IndexService` instances sharing one cache. A paused stale snapshot replaced a newer rebuild after the newer rebuild indexed `DEC-RACE-PROBE`; the Markdown decision still existed while SQLite no longer returned it. The per-instance `RLock` does not coordinate rebuild generations across instances.

## Naming compatibility exceptions

- `COUNSEL_OS_PYTHON` remains an environment-variable compatibility name in `README.md`.
- `.counsel_os_cache.db` remains the rebuildable SQLite cache name in runtime code and active documentation.
- `.counsel-os/active-vault.json` and `.counsel-os-vault.json` remain persisted vault-selection and vault-marker compatibility paths.
- `outside_counsel_os` remains the stable response-delivery API enum.
- `agent_id: counsel-copilot` and its file name remain stable agent identifiers. Its shipped name and all display aliases are `Themis.ai`.
- `next_actor: themis`, `ready_for_themis`, and `author-themis` remain stable stored/API identifiers. Their visible labels are `Themis.ai`.
- Stored review author value `Themis` remains a legacy read in backend and frontend compatibility code. New values write `Themis.ai`.
- Old browser keys under `counsel-os.review-author`, `counsel-os:chat-run`, `counsel-os:chat-draft`, and `counsel-os:question-mode` remain legacy reads. New state writes under `themis.ai` keys.
- The phrase `use themis as the review author` remains an accepted legacy natural-language instruction and resolves to `Themis.ai`.
- The Polaris service URL and brain ID contain `themis_lime`; these are fixed upstream technical endpoint values. The visible provider label is `Polaris`.
- The existing logo asset file name contains `themis-ai`; this is a technical asset path. Its visible alt text is `Themis.ai`.
- Negative tests contain old author and browser-key strings only to prove compatibility and prevent old display copy from returning.

## Final evidence

- Backend full suite: 550 passed, 1 existing Starlette deprecation warning
- Frontend workspace checks: passed, including matter-brief, transport preservation, provider administration, adaptive intake, chat-run recovery, middle-pane accordion, and review-status copy; every `frontend/scripts/check-*.ts` script passed
- Frontend typecheck: passed
- Frontend production build: passed
- Isolated browser demo: passed on `MAT-20260831-68af29` in `/private/tmp/counsel-os-acceptance2.J0hZ6V/vault`; canonical draft, editor selection, approve, send, close, and navigation persistence verified
- Repository vault unchanged: pre-browser and post-browser SHA-256 inventory hashes both `1f758e0a835e704490a3e4815ab98fb9523cec0a674be0229718f5b48c26380d`
- Sol High review: completed read-only; 9 actionable findings (3 critical, 3 high, 3 medium)
- Sol High correction recheck: completed twice by the same reviewer; final result was no unresolved material finding and no new material regression
