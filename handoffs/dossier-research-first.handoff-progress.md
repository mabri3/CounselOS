# Progress — research-first dossier build

Target executor: Opus 4.8.
Repository: /Users/bharris/Programs/counsel-os-mvp
Plan: [dossier-research-first.handoff-plan.md](dossier-research-first.handoff-plan.md)
One-shot prompt: [dossier-research-first.handoff-prompt.md](dossier-research-first.handoff-prompt.md)
Plan version: 1
Implementation status: IMPLEMENTED — ACCEPTANCE INCOMPLETE
Completed build steps: 13 of 13
Last updated: September 11, 2026, America/Los_Angeles

This is the build tracker. Runtime dossier research has its own saved parent request and child checkpoints.

Read this file before starting or resuming. Do not reapply done edits. After each step, run its checks, save evidence, update only its checklist row, and update Current position below. Do not batch these updates at the end.

## Checklist

- [x] Step 1: Record baseline and repair known test import — done ([step-01](../output/dossier-research-first/step-01.md))
- [x] Step 2: Add saved parent request contract — done ([step-02](../output/dossier-research-first/step-02.md))
- [x] Step 3: Build preparation pass and complete issue map — done ([step-03](../output/dossier-research-first/step-03.md))
- [x] Step 4: Preserve full issue answers and research history — done ([step-04](../output/dossier-research-first/step-04.md))
- [x] Step 5: Add parent-managed research children — done ([step-05](../output/dossier-research-first/step-05.md))
- [x] Step 6: Execute first and remaining research batches — done ([step-06](../output/dossier-research-first/step-06.md))
- [x] Step 7: Compose and publish a safe dossier per batch — done ([step-07](../output/dossier-research-first/step-07.md))
- [x] Step 8: Repair references through saved output and rendering — done ([step-08](../output/dossier-research-first/step-08.md))
- [x] Step 9: Wire chat, API, and runtime lifecycle — done ([step-09](../output/dossier-research-first/step-09.md))
- [x] Step 10: Finish setup and progress UI — done ([step-10](../output/dossier-research-first/step-10.md))
- [x] Step 11: Prove interruption and publication recovery — done ([step-11](../output/dossier-research-first/step-11.md))
- [x] Step 12: Run complete regression and browser proof — done ([step-12](../output/dossier-research-first/step-12.md))
- [x] Step 13: Run bounded real-model check and close handoff — done ([step-13](../output/dossier-research-first/step-13.md))
- [ ] Acceptance check: all required behavior, recovery, browser, and quality evidence reviewed — FAILED: the configured-model exercise completed, but two workers failed and no dossier revision was published

Use these states:
- pending: not started.
- IN PROGRESS: work exists but checks are not complete.
- done: checked; link the evidence.
- FAILED: a relevant check failed; state the reason.
- BLOCKED: required input/access is unavailable; state what is missing.

Only check the box for done. Do not use done for a skipped check or an unverified model claim.

## Current position

- Active step: none. Steps 1–13 are complete; overall acceptance is incomplete.
- Last verified implementation step: Step 13 (one bounded configured-model exercise and final report).
- Next exact action: add deterministic reproductions for the shared saved-source snapshot mutation and citation-formatting/dossier-publication failure, then repair them with focused checks. Obtain separate authorization before any second configured-model exercise.
- Work in progress: none. The build and bounded exercise are recorded. Defect repair is the remaining work.
- Execution-owned processes: none running (no dev servers, no background pytest).
- Implementation files changed by this execution:
  - Added (untracked): backend/app/models/dossier_request.py, backend/app/services/dossier_requests.py, backend/app/services/dossier_request_execution.py, backend/app/services/dossier_references.py, backend/tests/test_dossier_requests.py, test_dossier_planning.py, test_dossier_content_depth.py, test_dossier_managed_research.py, test_dossier_batch_publication.py, test_dossier_references.py, and output/dossier-research-first/* (evidence).
  - Edited tracked: frontend/lib/api.ts (import fix), backend/app/agents/output.py, backend/app/models/api.py, backend/app/models/research_investigation.py, backend/app/services/research.py, backend/app/services/research_runs.py, backend/app/services/research_execution.py, backend/app/services/research_publication.py, backend/app/services/dossier.py, backend/app/services/workspace.py, backend/app/blank_vault_template/00_System/skills/dossier-generation.md, backend/scripts/refresh_dossier_research.py, backend/tests/test_dossier_research_continuity.py.
  - Edited within pre-existing UNTRACKED dossier modules: backend/app/services/dossier_research.py, backend/app/services/dossier_generation_context.py.
  - Step 9 added: backend/app/routers/dossier_requests.py and backend/tests/test_dossier_request_api.py.
  - Step 9 edited: backend/app/active_context.py, backend/app/main.py, backend/app/models/api.py, backend/app/models/dossier_request.py, backend/app/routers/chat.py, backend/app/runtime.py, backend/app/services/chat_history.py, backend/app/services/chat_runs.py, backend/app/services/dossier_generation_chat.py, backend/app/services/dossier_request_execution.py, backend/app/services/dossier_requests.py, and backend/tests/test_dossier_generation_chat.py.
  - Step 10 added: frontend/lib/dossierRequests.ts, frontend/components/DossierResearchCard.tsx, frontend/components/DossierResearchCard.module.css, and frontend/scripts/check-dossier-research.ts.
  - Step 10 edited: frontend/lib/types.ts, frontend/lib/api.ts, frontend/components/ChatCards.tsx, frontend/components/ChatPanel.tsx, frontend/components/experimental/ExperimentalChat.tsx, and frontend/package.json.
  - Step 11 added: backend/tests/test_dossier_request_lifecycle.py.
  - Step 11 edited within existing untracked build modules: backend/app/services/dossier_request_execution.py and backend/app/services/dossier_generation.py.
  - Step 12 added: backend/tests/manual/serve_dossier_research.py and output/dossier-research-first browser/JUnit/evidence artifacts.
  - Step 12 edited: backend/tests/manual/serve_research_investigation.py, backend/app/services/main_agent_research.py, backend/app/services/research.py, backend/tests/test_main_agent_research.py, backend/tests/test_research.py, frontend/components/DossierResearchCard.tsx, frontend/scripts/check-dossier-research.ts, frontend/tsconfig.json, docs/living-dossier.md, docs/ACCEPTANCE_TESTS.md, and CODEX_HANDOFF.md.
  - Step 13 added: output/dossier-research-first/run-live-quality.py, live-quality-attempt.json, live-quality-result.json, live-quality-assessment.md, live-quality-vault/, step-13.md, and verification.md. Step 13 edited this tracker only; no application code changed.
  - NOT changed by this execution (pre-existing dirty work in the tree — preserved, do not attribute to this build): dispatch_budget.py, runner.py, chat_runs.py, experimental_chat.py, matter_paths_state.py, provider_settings_policy.py, research_collection.py, vault.py, workspace_scenarios.py, research_scope.py, config.py/main.py and the 00_System tools/skills markdown, plus the Mosaic Relay vault edits.
- Existing user work: heavily modified and partly untracked; preserve it.
- Blockers: none. Checks status: all Step 1–12 checks PASS. The final full backend suite passed 1,639 tests; all six separate frontend checks/build steps passed; all 15 isolated browser steps passed. Step 13 ran once and exposed live-quality defects.
- Live-quality check: completed once on synthetic matter `MAT-20260912-f7ed8b`, parent `DOR-20260912-f382af`. Result FAILED/PARTIAL: two children failed with saved source snapshot hash changes, the recommendation proposal was preserved, and dossier publication failed with no revision. No retry is authorized.
- Commit/push/deployment: not authorized.
- Product defaults: the plan's section 2 distinguishes user decisions from planning defaults.

## Author preflight evidence

These are checks of the pre-build checkout, not proof that the new feature exists.

- HEAD: cbac9f39dffd2ffa24f5ae123e332e929a8df770.
- Observed 85 modified tracked paths and 136 default-status untracked entries; directories contain additional files.
- Focused backend command in plan section 3: 71 passed, 1 warning, 17.72 seconds.
- Frontend npm run typecheck: passed.
- Frontend check-citation-reading.ts: passed.
- Frontend check:document-reference-behavior: FAILED before this build with ERR_MODULE_NOT_FOUND on the extensionless ./modelSettingsRows import in frontend/lib/api.ts. Step 1 contains the narrow repair.
- Full backend suite: not rerun by the plan author. Prior saved XML reports 1,575 passing tests.
- New build tests and browser acceptance: not yet implemented or run.
- Real Harbor dossier SHA-256: 43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2.
- Production code and live matter records were not edited by the plan author.

## Evidence index

Add one link after each completed or interrupted step:

| Step | Evidence file | Result |
|---|---|---|
| 1 | output/dossier-research-first/step-01.md | done |
| 2 | output/dossier-research-first/step-02.md | done |
| 3 | output/dossier-research-first/step-03.md | done |
| 4 | output/dossier-research-first/step-04.md | done |
| 5 | output/dossier-research-first/step-05.md | done |
| 6 | output/dossier-research-first/step-06.md | done |
| 7 | output/dossier-research-first/step-07.md | done |
| 8 | output/dossier-research-first/step-08.md | done |
| 9 | output/dossier-research-first/step-09.md | done |
| 10 | output/dossier-research-first/step-10.md | done |
| 11 | output/dossier-research-first/step-11.md | done |
| 12 | output/dossier-research-first/step-12.md | done |
| 13 | output/dossier-research-first/step-13.md | done; live quality failed |

Final report: output/dossier-research-first/verification.md — created; acceptance incomplete.

## Resume rules

1. Inspect the current files and the active step's evidence before continuing.
2. Do not reset the checkout or delete prior output to recover.
3. Recheck the last completed step's relevant checks. If a done result has drifted materially, report it and reconcile the conflicting change; do not blindly repeat the edit.
4. Inspect in-flight processes and existing XML/log output before repeating a long test.
5. Read saved app request/checkpoint IDs before repeating a live evaluation.
6. If you stop, leave the active step unchecked with IN PROGRESS, FAILED, or BLOCKED. Save the exact next command and missing condition.
7. Never mark the acceptance check done while a required check is missing or failed.

## Execution decisions and blockers

- Step 12 safety incident: the first browser-fixture smoke form used `ActiveContextManager` and rebuilt the disposable SQLite index in the saved active Mosaic Relay vault before failing. No server started, the active pointer did not change, and no Markdown source changed. The final fixture uses direct `AppContext`, requires its ownership marker for reset, and rejects configured and saved-active vault paths. The two resulting cache temporary files were left untouched after later instructions prohibited writes in the active vault. Full details and hashes are in `output/dossier-research-first/step-12.md`.

## Final result

Steps 1–13 of 13 are implemented and the required exercises were performed. The backend research-first engine, saved setup/progress UI, conservative restart recovery, full regression, and 15-step browser proof are green. MVP remains runnable.

Overall acceptance remains incomplete. The single configured-model check produced one useful vendor packet, but two issue workers failed with `Saved source snapshot hash changed`, and the dossier publication failed without a new revision.

### Exact next command
Create deterministic tests for the concurrent/shared source snapshot mutation and the citation-formatting/dossier-publication failure. Repair those defects and run focused backend checks. Do not run another configured-model exercise without separate authorization.
