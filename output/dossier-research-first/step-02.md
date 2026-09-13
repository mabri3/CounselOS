# Step 2 — Saved parent request contract

Date/time: 2026-09-11
Result: done

## Files added
- backend/app/models/dossier_request.py — enums (states/phases/modes/scopes/issue-states/publication-states), typed errors (NotFound/Conflict/Validation w/ status_code+detail), `new_request_metadata`, `validate_saved_metadata` (rejects malformed without erasing), `compact_status` projection.
- backend/app/services/dossier_requests.py — `DossierRequestService` persistence: paths under `<matter>/research/dossier-requests/<DOR-id>.md`, `_load_record` (validate + cross-matter guard), `get`/`get_record`/`list`, idempotent `create_record` (source_action_key + payload digest), `save_record`/`_mutate` (optimistic sequence check under WORKSPACE_LOCK, identity fields locked), `has_active_work`/`wait_for_active_work`.
- backend/tests/test_dossier_requests.py — 8 cases.

## Files changed
- backend/app/models/api.py — added `DossierResearchCard` (type `dossier_research`, request_id/matter_id/state/phase/presentation/status) and added it to the `ChatCard` discriminated union. No existing variant altered.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_requests.py` → 8 passed, 1 warning. EXIT 0.
- Pydantic discriminated-union round-trip for the new card → ok.

## Cases covered
create/read/reload; repeated identical action returns same request; same key/different payload conflict; cross-matter rejection; stale sequence conflict; malformed metadata rejected without erasing (budgets preserved); GET read-only (no tasks, no sequence change); list filters by conversation.

## Notes / decisions
- Record uses frontmatter metadata for structured state; preparation prose is the Markdown body.
- Sequence-based optimistic concurrency; identity + idempotency fields locked across saves.
- Service instantiated directly in tests; AppContext wiring is Step 9.

## Next action
Step 3: implement bounded tools=None preparation pass in dossier_requests.py (`prepare`), tolerant plan parsing, `WorkspaceService.append_generated_issues`; add tests/test_dossier_planning.py.
