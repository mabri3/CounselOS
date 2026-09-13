# Step 3 — Preparation pass and issue map

Date/time: 2026-09-11
Result: done

## Files changed
- backend/app/services/dossier_requests.py — added `parse_dossier_plan` (tolerant ```dossier-plan/json extraction; strips control block from prose; malformed → prose + warning), `DossierRequestService.prepare` (one bounded tools=None call via BoundedDispatch on the selected main model; respects frozen scope through `capture`; no research, no mutation), `_preparation_messages`, `_build_preparation_fields` (issue map keyed by real IDs, candidates, 3 priorities → 3 distinct issues, first-three selection with fallback to existing order, per-issue focused topics, input_basis, source_scope defaults restrictive), `_clean_answer` (never only "needs research", never invents facts), digest-based idempotency.
- backend/app/services/workspace.py — added `append_generated_issues` (@serialized): checks issues revision, preserves all existing nodes/dispositions, validates fact + parent IDs, idempotent on candidate_key, deterministic generated IDs, records generated origin + request id; does NOT weaken save_issues.
- backend/tests/test_dossier_planning.py — 9 cases.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_planning.py` → 9 passed. EXIT 0.
- `.venv/bin/python -m pytest -q tests/test_workspace_interactions.py` → 17 passed. EXIT 0.

## Cases covered
tolerant plan parse; 3 priorities → 3 distinct issues; every issue gets a non-empty initial answer (no bare "needs research"); missing material issue surfaces as a candidate; malformed plan → prose retained + fallback to existing order; model selection recorded; excluded context not restored (issues.md excluded → empty issue map); idempotent on action key; fewer-than-three issues → research available number; append idempotent + preserves dispositions; append checks revision.

## Notes / decisions
- Strict model-ID validation deferred to Start/API (Step 9); preparation records the resolved selection.
- Candidates live in `new_issue_candidates` until Start resolves them to real issue IDs via `append_generated_issues`.

## Next action
Step 4: extend ResearchIssueUpdate optional fields; prepare_publication/render_publication/publication_sources/capture; view_version 3 backward-compatible loading; research instruction contract for full analysis. Add tests/test_dossier_content_depth.py; run with tests/test_dossier_research_continuity.py tests/test_main_agent_research.py.
