# Step 5 — Parent-managed research children

Date/time: 2026-09-11
Result: done

## Files changed
- backend/app/services/research.py — `ResearchService.run` gains `managed: bool=False`. When managed it saves the packet + source records but suppresses shared effects: issue_analysis.publish, problem_analysis.publish, the matter.md `latest_research_path` pointer + research_completed event, and index.rebuild_async. Normal-run behavior unchanged.
- backend/app/services/research_runs.py —
  - Matter ownership: threading-locked `_managed_owner`; `acquire_matter_ownership` / `release_matter_ownership` / `matter_owner` / `_has_active_standalone`. A different active owner blocks; existing standalone may finish first (reported via waiting_for_standalone).
  - `_pending` now excludes managed children (never scheduled by the ordinary queue).
  - Owner guards added to `start`, `_execute` finally, `retry`, and `resume` so ordinary research cannot start a fourth concurrent worker while a parent owns the matter; `resume` also excludes managed and defers to parent when owned.
  - `mark_running_interrupted` still marks managed children interrupted but skips ordinary stage restore for them; `recover_saved_publications` skips managed children (parent recovery owns publication).
  - New: `create_managed_child` (deterministic run_id from parent+issue, server-side freeze, parent scope + focused topic, own checkpoint/budget; only managed-run creator), `launch_managed_child`, `_execute_managed` (packet-only, no publish/stage/generate/tail-schedule), `schedule_next_pending`, `managed_children`.
- backend/tests/test_dossier_managed_research.py — 5 cases.

## Verify
- `.venv/bin/python -m pytest -q tests/test_dossier_managed_research.py tests/test_research_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_research_scope.py` → 42 passed. EXIT 0.

## Cases covered
independent identity + full per-issue budget + deterministic reuse; managed result saves a packet with NO shared advice publication and NO latest-research pointer move; three managed workers run concurrently (asserted max_active==3 before release) with no fourth worker while owned; standalone queues while owned then resumes after release + schedule_next_pending; managed children excluded from recovery publisher and ordinary pending; standalone research remains serial (max_active==1).

## Notes / decisions
- Managed flag is set only via create_managed_child; the public ResearchRunStart cannot set it (wired in Step 9).
- Concurrency proven with an event-gated provider, not wall-clock timing.

## Next action
Step 6: dossier_request_execution.py — first/remaining batches, failure isolation, compact progress, persisted control state; wire parent start/stop/wait. Extend tests/test_dossier_requests.py + test_dossier_managed_research.py; run both.
