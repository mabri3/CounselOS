# Step 10 — Setup and progress UI

Date/time: 2026-09-11 22:14 PDT
Result: done

## Files added

- `frontend/lib/dossierRequests.ts` — API-facing normalization, ordered-choice serialization, progress, publication, polling-scope, control, and draft-preservation helpers.
- `frontend/components/DossierResearchCard.tsx` — saved setup and progress views, scoped polling, exact publication refresh, source choices, document links, Stop, Resume, and failed-issue Retry.
- `frontend/components/DossierResearchCard.module.css` — existing semantic role colors and responsive card layout.
- `frontend/scripts/check-dossier-research.ts` — pure-helper and source-wiring checks for the Step 10 behavior contract.

## Files changed in Step 10

- `frontend/lib/types.ts`, `frontend/lib/api.ts` — dossier request/card types, saved source records, and get/start/stop/resume helpers.
- `frontend/components/ChatCards.tsx` — renders the dossier card through the shared card surface.
- `frontend/components/ChatPanel.tsx` — refreshes only the active originating conversation and preserves the typed draft and non-following scroll position.
- `frontend/components/experimental/ExperimentalChat.tsx` — retains its existing safe saved-conversation refresh and adds draft-preserving new-issue follow-up insertion.
- `frontend/package.json` — registers `check:dossier-research`.
- `handoffs/dossier-research-first.handoff-progress.md` — reconciles the verified Step 9 summary and advances this completed checkpoint to Step 11.

The pre-existing edits in `ChatCards.tsx`, `ExperimentalChat.tsx`, and `api.ts` were retained and merged. No unrelated screen was restyled.

## Verification

- Frontend: `npm run typecheck` — EXIT 0.
- Frontend: `npm run check:dossier-research` — EXIT 0; dossier research checks passed. Node reported the existing module-type warning.
- Frontend: `npm run check:research-queue` — EXIT 0; research queue checks passed. Node reported the existing module-type warning.
- Frontend: `node --experimental-strip-types scripts/check-citation-reading.ts` — EXIT 0; citation reading and dossier issue-marker checks passed. Node reported the existing module-type warning.
- Repository root: `git diff --check` — EXIT 0.
- Repository root: `graphify update .` — EXIT 0; graph rebuilt with 15,614 nodes and 30,899 edges. It reported the five existing zero-node data/configuration files and optional community relabeling.

## Evidence

- Setup shows three editable priorities and reasons, three distinct ordered issues, top-three/all scope, the existing research source fields, saved-material use, skip, and non-starting Cancel.
- Research Start sends the saved plan revision, expected sequence, ordered priorities/issues, accepted candidate keys, selected scope, source choices, and one action identity. The HTTP helper returns without waiting for child research.
- Active cards poll only their request at about two seconds. A publication token change refreshes only the saved originating conversation. Matter or conversation changes cancel or ignore stale replies.
- Progress uses saved issue states and saved read/retrieval counts. It shows exact first and later revision links, review-required updates, new issues, saved answers, Stop, Resume, and failed-issue-only Retry.
- Standard chat retains the composer and restores a non-following scroll position. Experimental chat retains draft, context, open document/editor state, comments, and scroll through its existing scoped refresh path. New-issue follow-up text is appended to, not substituted for, an unsent draft.
- Legacy cards and malformed status/source arrays normalize to safe empty values instead of crashing the page.

## Intentional expectation changes

None. Step 10 adds a new focused frontend check and preserves the existing research-queue and citation-reading expectations.

## Safe next action

Start Step 11 only. Add `backend/tests/test_dossier_request_lifecycle.py`, prove the ten interruption/recovery boundaries with a fresh `AppContext`, and run the exact four backend test files listed in the plan. Do not start Step 12 until Step 11 is recorded.
