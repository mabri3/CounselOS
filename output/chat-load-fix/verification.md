# Harbor chat load repair

Verified on 2026-09-11 in the existing working tree. Baseline commit: `cbac9f39dffd2ffa24f5ae123e332e929a8df770`.

## Result

The reported timeout no longer appeared in the live Harbor chat. The matter title, history, files, and saved conversation loaded. A second browser reload with the saved conversation selected also succeeded. Both local servers were left running.

The saved dossier was not regenerated or replaced. Its SHA-256 hash matched the isolated pre-repair copy: `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2`.

## Cause and repair

The backend was running, but repeated reads parsed large Markdown records over and over. The Harbor matter held about 33 MB of records, including a conversation of about 10.6 MB. Profiling showed that repeated frontmatter parsing took more than 90% of the measured load time. A health check alone did not reveal this problem.

The repair is limited to `backend/app/services/vault.py` and regression tests in `backend/tests/test_vault.py`. The file reader now reuses parsed records. It checks file metadata on each read and returns separate copies of mutable data. A lock prevents parallel requests from parsing the same record at the same time. Retained entries are limited to 256 files and 32 MiB of source bytes. Parsed metadata adds memory overhead beyond that source-byte limit.

The existing frontmatter shim and Markdown source of truth are unchanged. No database migration or new service was added.

## Checks

- Reproduced the original browser timeout before the repair.
- Reproduced unnecessary parsing in a regression test: nine reads caused nine parses before the repair; the same test passes with one parse after the repair.
- Focused tests: `pytest -q tests/test_vault.py tests/test_frontmatter.py` — 10 passed.
- The new tests cover repeated and parallel reads, nested metadata isolation, local and external edits, atomic replacement, deletion, symlink escape rejection, edits during parsing, cache limits, and separate vaults.
- Frontend: `npm run typecheck` passed.
- Frontend: `PHASE2_DIST_DIR=.next-chat-load-build npm run build` passed. Build-generated TypeScript configuration changes were restored to their pre-run state.
- Full backend: `pytest -q` — 1,548 passed, 14 failed, 6 warnings, in 745.39 seconds. The run completed; it was not stopped early.
- `git diff --check` passed for the repair files.
- `graphify update .` completed.
- Browser checks at `http://127.0.0.1:3000/experimental/chat?matter=MAT-20260909-d89ad8` showed Harbor 2, History 2, Files 57, the saved draft dossier conversation, and an enabled message input without the timeout banner.

Live HTTP samples before the repair were 5.882 seconds for the matter and 7.224 seconds for the workspace. Warm samples after the repair were 0.452 and 0.851 seconds. A later workspace check during comparison tests returned HTTP 200 in 1.934 seconds. These are samples, not latency guarantees. Cold reads still need to parse records once.

No chat generation or dossier regeneration was requested during verification. The full browser acceptance workflow was not repeated.

## Remaining backend test failures

Thirteen failures also occurred with the original file reader. For these checks, the original `VaultService` from the baseline commit was loaded in an isolated test process. The other current working-tree code was retained. Neither the working file nor the running server was reverted.

- Five main-agent research tests expect two model calls but now observe three, including a dossier update.
- Two research action API tests expect a scope object without the current `collection_enabled` field.
- One dossier orientation test finds that the decision question includes later sections of the generated document. This needs a behavior review, not just an updated assertion.
- Two source-library tests exceed their serialized-request size limit: 411,014 characters against a limit of 400,000.
- Three hypothetical-scenario tests observe `run_research` in the available tools, contrary to their expected tool sets.

The fourteenth failure, the finalization event-count test, passed when run alone with either the repaired or original reader. It also passed with the original reader and a fixed clock. Its full-run failure is not yet explained. It must not be reported as a confirmed pre-existing failure or as fixed.

Exact failing tests from the full run:

```text
tests/test_main_agent_research.py::test_real_main_runner_owns_collection_and_final_answer
tests/test_main_agent_research.py::test_collection_failure_or_hostile_page_keeps_useful_main_answer[no_results]
tests/test_main_agent_research.py::test_collection_failure_or_hostile_page_keeps_useful_main_answer[malformed]
tests/test_main_agent_research.py::test_collection_failure_or_hostile_page_keeps_useful_main_answer[timeout]
tests/test_main_agent_research.py::test_collection_failure_or_hostile_page_keeps_useful_main_answer[malicious]
tests/test_matter_action_api.py::test_research_run_api_forwards_source_action_key[None]
tests/test_matter_action_api.py::test_research_run_api_forwards_source_action_key[ISS-TARGET]
tests/test_matter_action_api.py::test_finalize_moves_generate_to_respond_and_retry_is_idempotent
tests/test_research.py::test_research_refreshes_precomputed_dossier_orientation
tests/test_source_library_lifecycle.py::test_assembled_lifecycle_answers_from_a_late_page_and_survives_restart
tests/test_source_library_repairs.py::test_published_library_citations
tests/test_workspace_interactions.py::test_q5_scenario_runner_and_executor_deny_mutations_and_alias_then_adopt
tests/test_workspace_interactions.py::test_q5_saved_scenario_and_recovery_remain_read_only
tests/test_workspace_interactions.py::test_q5_direct_scenario_retry_cannot_unlock_actual_scope
```

## Recommended next work

Repair dossier request detection, including the observed `Genrate a dossier` request that bypassed dossier generation. Review the related dossier and research failures above. Then compare a generated preview with the earlier dossier before replacing any saved work. Preserve hypothetical scope during that comparison. This product work was not started as part of the load repair.
