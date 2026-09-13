# Step 7 — Compose and publish one safe dossier per batch

Date/time: 2026-09-11
Result: done

## Files changed
- backend/app/services/dossier_request_execution.py — real `publish_batch` (async): folds all batch children into ONE combined publication via chained `prepare_publication`; checks frozen basis (stale) and independent advice edits (changed_advice, with own-detection via `dossier_request_id` on the publication); writes at most one proposed recommendation (or initial working view) + one dossier revision through `generate_dossier` (stable writer run_id → prepared-content replay, no duplicate model call); records receipts (recommendation/dossier/conversation); idempotent on batch key (request id + ordered child output revisions); review-only path preserves current recommendation; `_record_publication` advances parent expected hashes only after an uncontested applied own publication; idempotent conversation update. `_compose_batch`/`run` now async.
- backend/app/services/dossier_generation_context.py — `retain_issues` now preserves full analysis depth (Detailed analysis disclosure) from resolved `issue_analysis`, not just a one-line position.
- backend/app/blank_vault_template/00_System/skills/dossier-generation.md — starter updated: research-first writer role (overview + initial answers + full researched analysis under each issue marker), reference labels, proposed-date labeling. (Starter template only; installed matter skills untouched.)

## Files added
- backend/tests/test_dossier_batch_publication.py — 5 cases.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_batch_publication.py tests/test_dossier_generation.py tests/test_dossier_generation_integrity.py tests/test_dossier_generation_chat.py tests/test_dossier_content_depth.py tests/test_dossier_research_continuity.py` → 67 passed. EXIT 0.

## Cases covered
three siblings → one combined proposed update covering all three, no false conflict, applied; full multi-condition checklist + per-issue proposed_actions with a correctly computed proposed date (anchor 2026-09-01 offset -30 → 2026-08-02) survive in the combined proposal; same-batch retry creates no duplicate proposal/revision/entry (replay); facts changed after Start → review-only publication (current not rebased); failed whole-dossier writer still saves the combined issue analysis (proposal present) and records a non-applied publication.

## Fixes made during step
- Pre-create ALL planned children at Start (not just the first batch) so each freezes its brief from the pre-research state; a later-created child otherwise inherited the enlarged recommendation and overflowed the 50k dispatch limit.

## Next action
Step 8: dossier_references.py scoped reference catalog + binding before cleanup; persist source records; wire ClaimMarkdown in both chat surfaces + document readers; tolerant missing-reference behavior. Add tests/test_dossier_references.py + extend frontend citation checks; run backend + frontend checks.
