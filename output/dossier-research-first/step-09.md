# Step 9 — Chat, API, and runtime lifecycle

Date/time: 2026-09-11 21:50 PDT
Result: done

## Files added

- `backend/app/routers/dossier_requests.py` — typed list/get/start/stop/resume API under the normal matter route.
- `backend/tests/test_dossier_request_api.py` — HTTP, background execution, idempotency, validation, reload, preview, saved-only, normal-chat, and persistence cases.

## Files changed in Step 9

- `backend/app/main.py` — registers the dossier-request router; unrelated existing CORS edits were preserved.
- `backend/app/runtime.py`, `backend/app/active_context.py` — instantiate the parent service, restore managed ownership before ordinary publication recovery, mark interrupted work, report active work, and wait during shutdown.
- `backend/app/routers/chat.py`, `backend/app/services/dossier_generation_chat.py` — unrestricted manual generation now prepares a saved research request and card; restricted previews retain the saved-input writer.
- `backend/app/services/dossier_requests.py`, `backend/app/models/dossier_request.py` — validate plan, sequence, action identity, issue ownership, source choices, and retry targets; retain submitted model/skill/scope state; add passive status and startup interruption support.
- `backend/app/services/dossier_request_execution.py` — publication messages retain a progress card and saved source records.
- `backend/app/models/api.py`, `backend/app/services/chat_history.py`, `backend/app/services/chat_runs.py` — preserve cards and source records in terminal run state, replay, and saved conversation reads.
- `backend/tests/test_dossier_generation_chat.py` — deliberate manual-generation expectation update described below.
- `output/dossier-research-first/step-09.md`, `handoffs/dossier-research-first.handoff-progress.md` — save this evidence and advance only the Step 9 checkpoint to Step 10.

## Verification

- Backend: `.venv/bin/python -m pytest -q tests/test_dossier_request_api.py tests/test_chat_runs.py tests/test_dossier_generation_chat.py tests/test_research_lifecycle.py` — EXIT 0; 100 passed, 6 warnings in 77.28s. Warnings were the existing Starlette/httpx and PyMuPDF deprecations.
- Repository root: `graphify update .` — EXIT 0; code graph rebuilt with 15,567 nodes and 30,758 edges. It reported five existing zero-node configuration/data files and suggested optional community relabeling.
- Repository root: `git diff --check` — EXIT 0.

## Evidence

- `POST /api/chat` for an unrestricted dossier command saves one `dossier_research` setup card and starts no child research.
- `POST .../start` returns 202 while three managed children remain active in the background. GET polling performs no model call, and a fresh service instance reads the same saved progress.
- Stale plans and conflicting action identities return 409. Invalid issue choices return 400. Missing and wrong-matter request IDs return 404.
- Explicit preview and `saved_only` use the existing no-tools writer and create no managed child.
- A normal chat request still completes through the normal path.
- A completed durable chat run, its replay response, and saved conversation GET retain the same dossier card and `source_records`.
- Runtime recovery restores managed-parent ownership before ordinary saved-publication recovery. It then marks remaining parent and child work interrupted for explicit resume. Constructors do not start recovery work.

## Intentional expectation changes

The old unrestricted manual-generation test no longer expects an immediate saved dossier. It now expects a saved setup request and card, no child research, and no changes to facts, issues, recommendations, or the current dossier. The preservation assertions remain. Explicit preview, automatic saved-input refresh, and explicit `saved_only` still exercise the old writer path.

## Safe next action

Start Step 10 only: add the frontend dossier-request types, API helpers, setup/progress card, scoped polling, and the required frontend checks. Do not start Step 11.
