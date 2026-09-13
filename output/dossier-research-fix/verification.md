# Dossier and research repair verification

Date: 2026-09-11. Work took place in the existing dirty `main` checkout. Earlier changes were preserved. No commit was made.

## Result

The repair is verified. All 1,575 backend tests passed, including the 14 failures reported in the preceding backend run. Frontend type checks, the production build, and the focused browser checks also passed.

## Repairs

- Dossier commands accept a missing, repeated, or swapped letter in the action word. The reported `Genrate a dossier` request now uses the shared writer. Negated requests, skill edits, ordinary reading requests, and past-tense reports do not trigger it.
- Heading normalization leaves embedded recommendations, collapsed history, and code blocks intact. Research headings can no longer become the dossier's own decision-question or open-question fields through this transformation. The original research-orientation test passes without changing its assertions.
- Chat can present research source choices after hypothetical scope has been selected. The runner and tool executor now agree. Presenting choices does not start research or change the saved matter. Source confirmation remains a separate action.
- Tests now account for the existing, intended dossier-writing call after research. The research call-count checks still require the exact number of calls. The added call must use the shared no-tools dossier action.
- The 1,000-page source test retains the investigation's 400,000-character total limit. It checks the separate dossier call against the configured dispatch limit. Bulk source text and the page manifest remain excluded across all calls. A repeated wait must not make another model call.
- The API test now checks the existing `collection_enabled: false` default explicitly.
- The finalization retry test now counts stage-event IDs in the full saved audit history. The UI's six-event window cannot establish the total event count. The test still requires exactly one new stage event, the same final file on retry, and a no-change retry result.

Production changes are limited to:

- [Dossier command routing](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation.py)
- [Dossier heading normalization](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py)
- [Scenario tool execution](/Users/bharris/Programs/counsel-os-mvp/backend/app/agents/runner.py) — one condition changed in this repair.

The existing shared writer, publication checks, source rules, editable skill, providers, and storage model remain in place. No new model call or service was added by this repair.

## Automated checks

- Before the repair, the new routing and embedded-heading checks showed six failures. They passed after the changes.
- The dossier and source-library group passed 85 tests in 95.58 seconds.
- The research, API, scope, and workspace group passed 68 tests; two errors in the newly adjusted tests were then corrected and both passed in a focused rerun. The full suite below checks the combined result.
- `npm run typecheck` passed.
- `PHASE2_DIST_DIR=.next-dossier-research-build npm run build` passed. Build-generated TypeScript configuration changes were restored to their pre-run values.
- `git diff --check` passed for the repair files.
- `graphify update .` completed. Its five zero-node JSON-file warnings are unrelated to these changes.
- Full backend command: `pytest -q --tb=short --junitxml=../output/dossier-research-fix/pytest.xml`. Result: **1,575 passed, six dependency deprecation warnings, no failures**, in 942.98 seconds. [Machine-readable test results](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-fix/pytest.xml).

The durable-chat regression also checks a non-mainline hypothetical path. The typo request produces a full preview, preserves the current direction, and leaves the saved dossier, facts, issues, and recommendations unchanged.

## Browser checks

The browser used an isolated fixture vault and the existing deterministic dossier writer on temporary ports 3199 and 8199. It did not use Harbor's records or a paid model.

- `Genrate a dossier` returned the full dossier with three workstreams and the exact saved decision question.
- The saved-revision link opened the correct read-only document.
- `Genrate a dossier without saving.` returned a full preview with an explicit no-save status.
- The saved dossier's SHA-256 stayed `559f7958f509f7a1c1cfc74a71cd2f353cc361de3f32ef0ada78a948b56dd162` before and after the preview.
- The saved conversation and preview remained visible after reload. The message input was enabled and no timeout appeared.
- The temporary browser tab was closed and both test servers were stopped. The user's servers on ports 3000 and 8000 remain running.

Harbor's saved dossier was not regenerated or replaced. Its SHA-256 remains `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2`. A live Harbor workspace read returned HTTP 200 during verification.

These checks establish application behavior, not the legal quality of a new real-model dossier. No new Harbor research, dossier comparison, recommendation acceptance, or decision recording was performed. The full historical A-G browser workflow was not repeated.
