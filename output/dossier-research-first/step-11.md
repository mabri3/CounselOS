# Step 11 — Interruption and publication recovery

Date/time: 2026-09-11 22:25 PDT
Result: done

## Files added

- `backend/tests/test_dossier_request_lifecycle.py` — actual `AppContext`, route, coordinator, managed-child, checkpoint, publication, and restart coverage for all ten interruption boundaries.

## Files changed in Step 11

- `backend/app/services/dossier_request_execution.py` — resumes a fully collected batch whose parent publication receipt is missing; reuses terminal managed children; saves and replays the writer response through the parent request.
- `backend/app/services/dossier_generation.py` — accepts internal saved writer content and its saved model selection for deterministic publication replay without a second model call.
- `output/dossier-research-first/step-11.md`, `handoffs/dossier-research-first.handoff-progress.md` — save evidence and advance the verified checkpoint to Step 12.

The two production modules were existing untracked files from earlier build steps. Their existing behavior was preserved.

## Verification

- Focused new suite: `.venv/bin/python -m pytest -q tests/test_dossier_request_lifecycle.py` — EXIT 0; 10 passed, 1 warning in 8.39s after the final test assertions before the combined run.
- Required backend command: `.venv/bin/python -m pytest -q tests/test_dossier_request_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_dossier_generation_integrity.py` — EXIT 0; 27 passed, 1 warning in 15.62s.
- Repository root: `git diff --check` — EXIT 0.
- Repository root: `graphify update .` — EXIT 0; graph rebuilt with 15,645 nodes and 31,037 edges. It reported the five existing zero-node configuration/data files and optional community relabeling.

The warning is the existing Starlette/httpx deprecation warning from `fastapi.testclient`.

## Interruption evidence

1. Parent saved before the first child: restart marks it interrupted; API Resume completes it.
2. Child saved before its ID reaches the parent: deterministic `(parent, issue)` identity reuses the child and creates no duplicate.
3. Two completed children and one collecting: restart calls the model only for the unfinished child; all three identities remain unique and saved budgets do not decrease.
4. Unknown source-call outcome: recovery keeps `outcome_unknown`, the attempt count stays one, and the fetch budget does not increase without explicit retry.
5. Writer response saved before publication: a forced process death before commit leaves saved writer text; restart publishes it with zero repeated writer calls.
6. Recommendation saved before receipt: restart keeps the same proposal version ID and completes the missing receipts.
7. Dossier saved before receipt: restart reuses the same deterministic revision and makes zero repeated writer calls.
8. Conversation saved before receipt: restart keeps the same assistant message ID and creates one batch message.
9. Stop racing the last child: `stop_requested` is durable, the parent ends stopped, and a new request can acquire and complete on the same matter.
10. Corrupt saved source snapshot: recovery shows the affected issue as failed/partial and performs no model or refetch call.

A completed parent remains completed across a fresh `AppContext`. Calling Resume through the real API is passive and makes zero model calls. Publication recovery produces one parent publication, one exact batch message, one deterministic dossier revision, and no repeated completed child calls.

## Intentional expectation changes

None. Existing checkpoint, publication, and dossier-generation integrity assertions remain unchanged.

## Safe next action

Start Step 12 only. Add the isolated five-issue browser fixture, run the full backend and required frontend checks once, then complete the two-screen browser proof. Do not start the paid Step 13 check until Step 12 is verified and recorded.
