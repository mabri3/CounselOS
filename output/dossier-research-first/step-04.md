# Step 4 — Preserve full issue answers and history

Date/time: 2026-09-11
Result: done

## Files changed
- backend/app/models/research_investigation.py — extended `ResearchIssueUpdate` with optional depth fields (analysis_markdown ≤60k, rule_and_support, application, remaining_gaps, proposed_actions, new_issue_candidates); added `sanitize_gaps` and `sanitize_proposed_actions` (compact proposed-action shape; signed offset resolved via stdlib date; bad date → useful action, unknown date).
- backend/app/services/dossier_research.py — `prepare_publication` now writes `view_version=3`, carries the richer fields into `issue_positions`, appends dedup `research_history` (run_id + output_revision), and preserves a prior detailed answer as `prior_analysis_markdown` on a short partial update; `render_publication` renders v3 detailed-analysis disclosures (detail, rule/support, application, gaps, proposed-work table, earlier detailed analysis, earlier research) — backward compatible with v2.
- backend/app/services/dossier.py — the two `view_version == 2` gates now accept `in (2, 3)`.
- backend/app/services/dossier_generation_context.py — `capture` now supplies `data["issue_analysis"]`; added `resolve_issue_analysis` (v3 inline, v2 packet-load, legacy narrative; missing packet → gap not inferred completion) and `_packet_full_analysis`/`named_section_text`.
- backend/app/services/research_execution.py — extended INVESTIGATION_CONTRACT to describe the richer issue_updates fields and prior-analysis retention.
- scripts/refresh_dossier_research.py — legacy-recomposition guard now skips `view_version in (2, 3)` (both are modern schema).
- backend/tests/test_dossier_research_continuity.py — deliberate updates: parse-shape assertion now checks preserved position/next_action + new default fields (bad entry still dropped); view_version assertion accepts (2,3).

## Files added
- backend/tests/test_dossier_content_depth.py — 7 cases.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_content_depth.py tests/test_dossier_research_continuity.py tests/test_main_agent_research.py` → 36 passed. EXIT 0.
- Also confirmed green: test_research_publication.py, test_dossier_generation.py (45 passed combined).

## Cases covered
issue A multi-condition checklist survives researching B + regenerate; updating A keeps prior full analysis + dedup history; short partial update cannot erase prior detailed answer (Earlier detailed analysis disclosure); source counts derived from records; malformed optional fields preserve position (bad gap/action entries dropped, bad date → unknown); missing packet → packet_missing state, position retained, unresearched honestly marked; updating one issue does not touch another.

## Notes / decisions
- Bumped all research publications to view_version 3 (backward-compatible read of v2). Updated the two consumer gates + the legacy recomposition script + one deliberate test assertion accordingly.

## Next action
Step 5: parent-managed research children in ResearchRunService (distinct child run/checkpoint/topic/budget; managed mode; suppress shared advice effects; ownership; no fourth worker). Add tests/test_dossier_managed_research.py; run with test_research_lifecycle/checkpoints/publication/scope.
