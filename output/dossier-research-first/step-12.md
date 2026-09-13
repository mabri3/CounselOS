# Step 12 — complete regression and browser proof

Date: September 11, 2026, America/Los_Angeles  
Result: PASS

## Files

Added:

- `backend/tests/manual/serve_dossier_research.py`
- `output/dossier-research-first/browser-results.md`
- `output/dossier-research-first/browser-boundary-counts.json`
- `output/dossier-research-first/browser-backend.log`
- `output/dossier-research-first/browser-frontend.log`
- `output/dossier-research-first/browser-standard-all-five-complete.png`
- `output/dossier-research-first/browser-standard-saved-preview.png`
- `output/dossier-research-first/pytest.xml`
- `output/dossier-research-first/step-12.md`

Edited:

- `backend/tests/manual/serve_research_investigation.py`
- `backend/app/services/main_agent_research.py`
- `backend/app/services/research.py`
- `backend/tests/test_main_agent_research.py`
- `backend/tests/test_research.py`
- `frontend/components/DossierResearchCard.tsx`
- `frontend/scripts/check-dossier-research.ts`
- `frontend/tsconfig.json` (Next.js added the isolated build type paths)
- `docs/living-dossier.md`
- `docs/ACCEPTANCE_TESTS.md`
- `CODEX_HANDOFF.md`
- `handoffs/dossier-research-first.handoff-progress.md`

## Required checks

All commands were run separately as required.

| Command | Exit | Evidence |
|---|---:|---|
| `cd backend && .venv/bin/python -m pytest --junitxml=../output/dossier-research-first/pytest.xml` | 0 | 1,639 passed, 0 failed, 0 errors, 0 skipped, 6 warnings. Console time 920.21s; JUnit time 920.023s. |
| `cd frontend && npm run typecheck` | 0 | TypeScript check passed. |
| `cd frontend && npm run check:dossier-research` | 0 | Dossier setup, progress, hydration, action, and tolerance checks passed. |
| `cd frontend && npm run check:research-queue` | 0 | Research queue checks passed. |
| `cd frontend && npm run check:document-reference-behavior` | 0 | Document-reference checks passed. |
| `cd frontend && node --experimental-strip-types scripts/check-citation-reading.ts` | 0 | Citation-reading checks passed. |
| `cd frontend && PHASE2_DIST_DIR=.next-dossier-research-first-build npm run build` | 0 | Production build passed; 15 of 15 pages generated. |
| `graphify update .` | 0 | Graph updated: 15,678 nodes and 31,137 edges. |
| `git diff --check` | 0 | No whitespace errors. |

The first full-suite run was superseded because browser work exposed two scoped production defects. The recorded JUnit file is from the required later full-suite run after both fixes. No further backend code changed after that run.

## Browser acceptance

The isolated fixture used:

- Vault: `output/dossier-research-first/browser-vault`
- Matter: `MAT-DEMO-BEACON`
- Backend: `127.0.0.1:8199`
- Frontend: `localhost:3199`
- Five issues across employment, privacy, supplier contract, intellectual property, and marketing
- Deterministic fake model, search, and fetch boundaries only

All 15 blueprint steps passed through the actual experimental and standard chat components. The full observation record is in `browser-results.md`. It includes setup choices, three distinct first workers, first publication while later workers remained active, exact revision and source clicks, preserved unsent draft/context/editor/tabs/scroll, Stop across same-vault backend restart, Resume with the same child IDs, standard-chat reload hydration, saved-only generation, preview, and de-duplication.

Final fake-boundary counts:

- 53 model calls
- 5 planning calls
- 14 worker starts, including interrupted attempts
- 38 research-model calls
- 6 writer calls
- 0 workers, searches, or fetches active at cleanup

The fixture contains five parent files: three completed requests and two separate partial attempts retained from defect diagnosis. Completed parents have unique child IDs, publication keys, revision paths, and completion messages. Resume did not repeat completed child/model work.

Saved visual proof:

- `browser-standard-all-five-complete.png`: completed five-of-five card and exact revision controls.
- `browser-standard-saved-preview.png`: no-save preview and exact preview command.

## Defects found and repaired

1. A mature saved dossier could make an internally generated research prompt exceed the public 50,000-character request limit. Internal prompts now keep a bounded beginning and end while the complete frozen context stays attached separately. Focused regression tests cover both internal prompt paths.
2. A saved dossier card could return to Setup after a full reload and would not poll because it looked inactive. The card now performs one scoped hydration read, ignores an older sequence, and then polls near every two seconds only while work is active. The frontend check covers this.

No old manual-generation expectation was weakened. Only call-count assertions that now include the intended writer call were updated while their prior preservation checks stayed in place.

## Existing acceptance walk

`docs/ACCEPTANCE_TESTS.md` now records the exercised B, C, D, G, and H scenarios. It does not claim unrelated closure, automation, export, mobile, zoom, or live-provider coverage. Configured-model quality remains Step 13.

## Safety and cleanup

The required fixture now constructs `AppContext` directly from its execution-owned vault. `--reset` requires the fixture marker and rejects both the configured vault and the saved active-vault path.

During the first smoke attempt, the earlier fixture form used `ActiveContextManager`. It rebuilt the disposable SQLite index in the saved active Mosaic Relay vault before failing. No fixture server started. No active pointer or Markdown source file changed. Two cache temporary files created by that rebuild were left untouched after the instruction not to write in the active vault. This incident is also recorded in `browser-results.md` and `CODEX_HANDOFF.md`.

- Real Harbor dossier SHA-256 still matched the baseline: `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2`.
- Active pointer stayed at the Mosaic Relay vault and retained SHA-256 `7116f19dcdb721ad716f5e95e46f144b5ad55f4973e3bb8787fe809d1feadcd2`.
- Only the execution-owned fixture services were stopped.
- Ports 8199 and 3199 were clear after cleanup.
- Temporary browser tabs and screenshot processes were closed.

## Limits and next action

This deterministic fixture proves application behavior. It does not prove legal research quality. Narrow-screen, keyboard-only, reduced-motion, and 200% zoom checks were outside this blueprint and were not newly claimed.

Next: Step 13 only. Run one bounded configured-model quality check on a separate synthetic matter, preserve the request/run IDs before the paid call, then create the final verification report. Do not use Harbor and do not change the selected model.
