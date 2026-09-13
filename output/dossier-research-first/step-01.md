# Step 1 — Baseline and known test-import repair

Date/time: 2026-09-11 (America/Los_Angeles)
Result: done

## Files changed by this step
- frontend/lib/api.ts — import `./modelSettingsRows` → `./modelSettingsRows.ts` (narrow fix for ERR_MODULE_NOT_FOUND).

## Baseline facts
- HEAD: cbac9f39dffd2ffa24f5ae123e332e929a8df770, branch main.
- Modified tracked paths: 85. Untracked entries: 136 (matches plan's evidence).
- Real Harbor dossier SHA-256: 43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2 (UNCHANGED, matches plan).
- None of the 8 new production files or 9 new test files exist yet — this is a from-scratch feature build.
- Inventory saved: baseline-git-status.txt (222 entries incl. header), baseline-source-hashes.txt.

## Commands run (each separately) and exit codes
- backend: `.venv/bin/python -m pytest -q tests/test_dossier_generation.py tests/test_dossier_generation_chat.py tests/test_dossier_generation_integrity.py tests/test_dossier_research_continuity.py tests/test_output_citations.py tests/test_research_checkpoints.py` → 71 passed, 1 warning. EXIT 0.
- frontend: `npm run typecheck` → EXIT 0.
- frontend: `npm run check:document-reference-behavior` → passed (previously FAILED; fixed by import). EXIT 0.
- frontend: `node --experimental-strip-types scripts/check-citation-reading.ts` → passed. EXIT 0.

Accepted baseline warnings: Starlette httpx deprecation; Node MODULE_TYPELESS_PACKAGE_JSON. No dependency changes made.

## Safe next action
Step 2: create backend/app/models/dossier_request.py + persistence portion of backend/app/services/dossier_requests.py; add `dossier_research` ChatCard variant in models/api.py; add tests/test_dossier_requests.py.
