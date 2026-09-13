# Step 6 — Execute first and remaining batches

Date/time: 2026-09-11
Result: done

## Files added
- backend/app/services/dossier_request_execution.py — `DossierRequestExecutor` (per request): `_await_existing_standalone` (waits so a managed child never becomes a 4th worker), `_next_batch`/`_batch_order` (first_issue_ids first, then remaining planned, batches of ≤3), `_run_batch` (short locked writes to mark running / record outcomes; launches children; `gather(return_exceptions=True)` for failure isolation), `_packet_counts` (source counts from records), `_compose_batch`→`publish_batch` (records the batch boundary + first_pass_ready_at; Step 7 extends with real composition), `_finalize`/`_mark_interrupted`/`_record_error`.

## Files changed
- backend/app/services/dossier_requests.py — `start` (idempotent on start_action_key + submission_digest; research vs saved_only; validates scope), `_start_research` (append accepted candidates→resolve keys→freeze basis→save running record→acquire ownership→pre-create first-batch children→launch coordinator), `_start_saved_only` (calls generate_dossier, completes same parent), `stop` (persist stop_requested → cancel coordinator+children → finalize stopped → release ownership → resume ordinary queue), `resume` (Step 11 base), `_launch_coordinator`, `_execution_basis`.
- backend/app/services/research_runs.py — managed child `has_analysis` now uses the packet's `question_answered` flag (a saved fallback scaffold is not a researched answer), so a failed/empty child is honestly `partial`.
- backend/tests/test_dossier_requests.py — added Step 6 async cases + helpers.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_requests.py tests/test_dossier_managed_research.py` → 18 passed. EXIT 0.

## Cases covered
top_three starts exactly three distinct issues (fourth stays not_selected); All researches every issue across two batches with a first-pass publication boundary + first_pass_ready_at, ending completed; one child failure (raising provider on its unique issue id) → partial, siblings still saved (no cancellation); duplicate Start returns the same children; Stop prevents additional starts and releases ownership. Confirmed each managed child sees only its own issue id (isolation).

## Next action
Step 7: real group composition + publication (prepare_publication + generate_dossier per batch, one proposed update, review revision on independent edit, replay receipts, expected-hash advance). Extend generate_dossier for prepared-content replay + full issue-section composition; update dossier-generation.md starter. Add tests/test_dossier_batch_publication.py + date/provenance cases; run with test_dossier_generation*.
