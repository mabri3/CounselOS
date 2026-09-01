# One-shot prompt — fix Harborline findings and rerun the experiment

Execute this full work order now in one task. Do not return only a plan. Do not ask for another setup prompt. Continue through audit, implementation, review, verification, all 10 live matters, and final synthesis. Give normal progress updates, but do not end until the completion conditions or a safety stop condition are met.

## Repository and authority

Work in `/Users/bharris/Programs/counsel-os-mvp`.

This request authorizes application changes, tests, focused active documentation, new test vaults, and local fictional state changes in those vaults. It does not authorize a commit, push, deploy, destructive cleanup, changes to non-test vault data, or contact with a real person or external service.

The current branch is `main` at starting commit `13f8db7`, but the worktree is very dirty. Existing modified and untracked files are user-owned and may contain partial fixes. Preserve them. Never use `git reset`, `git checkout --`, `git clean`, `git stash`, or an equivalent command. Audit current content and diffs first. Keep every already-correct fix.

Use and update:

- `docs/harborline-fix-rerun-one-shot.handoff-plan.md`
- `docs/harborline-fix-rerun-one-shot.handoff-progress.md`

This prompt controls if those files differ.

## Required reading and skills

Before code work, read completely and follow `senior-mindset`, `parallel-plan-executor`, `focused-fix`, `practical-simplicity`, and `demo-first`. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, and `docs/ACCEPTANCE_TESTS.md`.

Before live testing, read completely and follow:

- `.agents/skills/live-agent-ux-experiment/SKILL.md`
- `.agents/skills/live-agent-ux-experiment/references/experiment-protocol.md`
- the skill for each browser surface before using it

Use Graphify first for codebase questions because `graphify-out/graph.json` exists.

## Objective

Fix every current, fixable product or local-runtime problem from the first Harborline Financial experiment. Review every issue with Sol Medium. Escalate only a narrow unresolved review question to one shared Sol High engineering reviewer. Verify the combined application. Then rerun the same 10-matter experiment in a new vault with Luna Medium actors. After all live runs, use one fresh Sol High agent to analyze and synthesize the evidence.

Markdown remains authoritative. SQLite remains a disposable index. Preserve useful model output when research, parsing, citation, tool, or provider steps fail. State failures honestly and continue to the best available answer. Keep recommendations separate from recorded decisions. Do not add legal-answer gates, verifier pipelines, queues, services, auth, cloud tenancy, embeddings, or broad frameworks.

## Fixed agent configuration

Use these exact roles. Do not silently substitute models or reasoning levels.

```yaml
coordinator: {model: gpt-5.6-sol, reasoning_effort: medium}
implementers:
  model: gpt-5.6-sol
  reasoning_effort: medium
  shared_tree: true
  maximum_parallel_writers: 6
issue_reviewers:
  model: gpt-5.6-sol
  reasoning_effort: medium
  mode: read-only
  rule: different from implementer; separate verdict for each mapped issue
engineering_escalation_reviewer:
  model: gpt-5.6-sol
  reasoning_effort: high
  mode: read-only
  count: one shared reviewer
  use: only for an unresolved correctness question, repeated verification failure, or cross-chunk contract conflict
experiment_requester: {model: gpt-5.6-luna, reasoning_effort: medium}
experiment_setup_attorney: {model: gpt-5.6-luna, reasoning_effort: medium}
experiment_matter_attorneys:
  model: gpt-5.6-luna
  reasoning_effort: medium
  count: ten fresh agents, one matter each
  live_writes: serial
  wall_clock_cap_per_matter: 35 minutes
experiment_synthesis:
  model: gpt-5.6-sol
  reasoning_effort: high
  count: one fresh agent after all live runs
```

If capacity is lower, use the largest safe parallel set and keep the same model settings. Use subagents, not user-owned tasks. Workers and reviewers must not spawn agents. The Sol High engineering reviewer and the Sol High experiment synthesizer are different roles.

## Baseline

- Fictional company: Harborline Financial, not affiliated with Chime.
- Business: fintech with consumer and business bank accounts through a banking partner, plus substantial payments work.
- Requester: Senior product manager.
- Attorney: Senior product counsel focused on BSA/AML, banking regulation, and payments.
- Themes: onboarding, background checks, payments, deactivation, privacy, and marketing.
- Public reference: Chime public pages, broad business model only.
- Planned runs: 10.
- Earlier strict result: 9 matters created, 8 saved research packets, 4 canonical final work products, 3 canonical decisions, 1 recorded approval/delivery, and 0 Closed matters.
- Earlier Run 7 created no matter because the local server was unavailable.
- Largest confirmed cause: the new-vault template lacked typed-tool parity, so protected writes failed generically.

## Findings and acceptance outcomes

Classify each current dirty-tree item as `already fixed`, `still failing`, or `needs diagnosis`. A passing focused test plus inspected implementation is required for `already fixed`. Every item still requires a Sol Medium review verdict.

| ID | Required outcome |
|---|---|
| COS-001 P0 | A new vault has all required typed tools, declarations, and agent permissions. Semantic parity is tested. |
| COS-002 P0 | Finalization, approval, local delivery recording, required work, stage, header, board, Today, and reload agree. Normal visible controls can reach Closed. |
| COS-003 P0 | One decision is durable and consistent in the register, matter, recent activity, reload, and index rebuild. Recommendations remain separate. |
| COS-004 P0 | Save and finalize target one canonical work product, preserve useful text, and never claim an unsupported mutation. |
| COS-005 P1 | Supported nested JSON and tool arguments normalize once at the provider boundary without lost or stringified fields. |
| COS-006 P0 | Final intake ends active questions. Historical cards become inert answered, superseded, or stopped records. |
| COS-007 P1 | Safe retries are idempotent for affected chat mutations, work products, decisions, and matter records. |
| COS-008 P1 | Participants and work items are structured, visible, assignable, completable, and reflected in the work queue and next action. |
| COS-009 P2 | Historical intake cards have truthful state and no active controls. |
| COS-010 P1 | Long work shows honest elapsed or continuing state, with no invented percent, phase, ETA, or cancellation claim. |
| COS-011 P1 | Internal prompts, paths, IDs, tool syntax, and instructions do not leak. Useful non-internal output remains. |
| COS-012 P3 | Empty-state and save text names the exact artifact class and says accurately whether anything changed. |
| ENV-001 P1 | Polaris failures provide safe class, correlation or attempt evidence, timing, and fallback state while preserving useful analysis. |
| ENV-002 P1 | One repeatable local launch path checks dependencies and ports, starts both services, waits for health, separates logs, and stops cleanly. |

Treat browser-control plugin failures as environment evidence. Do not hide them with product changes.

## Wave 0 — audit and shared contracts

As coordinator:

1. Record branch, commit, full `git status --short`, active vault, and a hash of repository `vault/` in the progress file. Do not print secrets.
2. Run current backend and frontend checks once. Record exact baseline failures.
3. Use focused Graphify queries and focused tests for every issue group.
4. Inspect current diffs. Preserve valid partial fixes.
5. Reproduce uncertain failures only in temporary vaults. Do not touch the repository vault.
6. Use one Sol Medium implementer for `C0-contracts`, then a different read-only Sol Medium reviewer.

`C0-contracts` exclusively owns:

```text
backend/app/models/api.py
backend/app/runtime.py
backend/app/providers/openai_compatible.py
backend/app/tools/registry.py
backend/app/tools/handlers.py
backend/app/routers/chat.py
backend/app/routers/matters.py
frontend/lib/types.ts
frontend/lib/api.ts
backend/tests/test_matter_action_api.py
backend/tests/test_matter_action_tools.py
backend/tests/test_provider_conformance.py
```

C0 freezes narrow source-action or idempotency keys, structured intake fields, progress fields, actor handling, and API shapes. It must not add a generic deduplication framework, event bus, queue, lifecycle engine, or new dependency. Inspect the diff and run focused tests before reviewer acceptance.

## Wave 1 — six parallel Sol Medium chunks

After C0 passes review, run C1 through C6 in parallel. File ownership is exclusive. Workers can read any file but can edit only listed files. If another file is required, report the dependency instead of cross-editing.

Every worker must inspect the current diff, keep correct user changes, make the smallest architecture-level fix, use `apply_patch`, add focused tests, run them, and report changed files and proof. No worker may commit, push, deploy, reset, clean, stash, or spawn agents.

### C1 — new-vault parity

Issue: COS-001.

```text
backend/app/blank_vault_template/**
backend/app/vault_manager.py
vault/00_System/agents/counsel-copilot.md
vault/00_System/agents/intake-agent.md
vault/00_System/agents/research-agent.md
vault/00_System/tools/**
backend/tests/fixtures/vault/00_System/agents/counsel-copilot.md
backend/tests/fixtures/vault/00_System/agents/intake-agent.md
backend/tests/fixtures/vault/00_System/agents/research-agent.md
backend/tests/fixtures/vault/00_System/tools/**
backend/tests/test_vault_management.py
backend/tests/test_blank_vault_parity.py (new only if useful)
```

Prove that a newly created vault gets every required typed tool and agent permission. Compare semantic declarations and permissions, not only file counts. Keep all file operations inside the selected vault path.

### C2 — matter-record integrity

Issues: COS-002, COS-004 backend, COS-005 record handling, COS-006, affected COS-007 writers, and COS-008 backend.

```text
backend/app/services/matters.py
backend/app/services/matter_records.py
backend/app/services/chat_history.py
backend/app/services/work_product.py
backend/app/services/matter_state.py
backend/tests/test_matter_lifecycle.py
backend/tests/test_matter_records.py
backend/tests/test_work_product.py
backend/tests/test_matter_state.py
```

Use existing services. Do not add a broad lifecycle service. Final intake ends active questions. Participants and work items are structured and durable. Work-product writes preserve exact useful content and target the canonical path. Use narrow deterministic keys for safe retries.

### C3 — decision integrity

Issues: COS-003 and decision part of COS-007.

```text
backend/app/services/decisions.py
backend/app/routers/decisions.py
backend/app/services/index.py
frontend/app/decisions/page.tsx
frontend/components/RecordDecisionModal.tsx
backend/tests/test_decisions.py
frontend/scripts/check-decision-integrity.ts (new only if useful)
```

Use one canonical Markdown decision. It appears once in matter detail and once in the register after reload and SQLite rebuild. A retry cannot create a second decision. Preserve recommendation versus recorded-decision integrity.

### C4 — run reliability and output hygiene

Issues: chat part of COS-007, COS-010 backend, and COS-011.

```text
backend/app/agents/runner.py
backend/app/agents/output.py
backend/app/services/chat_runs.py
backend/tests/test_agents.py
backend/tests/test_chat_runs.py
```

Preserve retry checkpoints and stable mutation fingerprints. Record useful elapsed or progress detail. Filter internal control text narrowly. Never erase useful legal analysis because another part is malformed or internal. At a step, cost, or time limit, make the best final-answer attempt from collected context.

### C5 — Polaris observability

Issue: ENV-001.

```text
backend/app/intelligence/polaris.py
backend/app/services/research.py
backend/app/services/research_runs.py
backend/tests/test_intelligence_providers.py
backend/tests/test_research.py
```

Persist and show safe failure class, attempt or correlation evidence, timing, and fallback status. Never log secrets, tokens, private request text, or unnecessary personal data. A provider failure reduces support; it does not erase useful analysis.

### C6 — local runtime

Issue: ENV-002.

```text
scripts/dev.sh
backend/app/main.py
backend/app/routers/system.py
README.md
backend/tests/test_system.py (new only if useful)
```

Provide one repeatable launch path with existing dependencies. It checks ports and prerequisites, starts both services, waits for health, identifies separate logs, and stops both children cleanly. Do not add a supervisor, container stack, queue, or package unless the project cannot run without it.

## Review and escalation rule

After each worker stops, inspect its diff and ownership. Create a different read-only Sol Medium reviewer for that chunk. Reviews can run in parallel. The reviewer gives a separate result for each issue mapped to the chunk:

```text
Issue: <ID>
Verdict: PASS | FIX | ESCALATE
Evidence: <current code plus focused test or reproduction>
Risk: <remaining risk or none>
Smallest correction: <only for FIX>
Escalation question: <only for ESCALATE>
```

`FIX` returns to the original Sol Medium implementer. The same reviewer rechecks it. `ESCALATE` is allowed only after one focused reproduction and one changed-condition retry do not resolve the question. Send only the narrow question and evidence to the one shared read-only Sol High engineering reviewer. That reviewer does not edit. The original implementer applies the answer, and Sol Medium gives the final verdict.

## Wave 2 — two parallel frontend chunks

Run C7 and C8 in parallel after their dependencies pass. Use the same implementer, ownership, review, and escalation rules.

### C7 — chat and lifecycle UX

Dependencies: C0, C2, and C4. Issues: COS-002 UI, COS-004 UI, COS-006 UI, COS-007 UI, COS-008 UI, COS-009, and COS-010 UI.

```text
frontend/components/ChatPanel.tsx
frontend/components/ChatCards.tsx
frontend/lib/chatRunLogic.ts
frontend/lib/matterActions.ts
frontend/scripts/check-adaptive-intake.ts
frontend/scripts/check-chat-run-recovery.ts
frontend/scripts/check-transport-preservation.ts
```

Only the current intake card can be interactive. Historical cards show answered, superseded, or stopped. Long work shows elapsed and safe activity without fake precision. Save-as-work-product uses a stable source-message key and shows the true result. Lifecycle, local delivery, closure, participants, work items, and retries use accepted contracts with visible success or error.

### C8 — matter and artifact state

Dependencies: C0, C2, and C3. Issues: COS-002 cross-surface state, COS-003 UI, COS-004 artifact state, COS-008 work queue, and COS-012.

```text
frontend/components/MatterWorkspace.tsx
frontend/lib/matterBrief.ts
frontend/components/DecisionTable.tsx
frontend/scripts/check-matter-brief.ts
```

Matter header, overview, board brief, current work, decisions, and artifact text derive from accepted durable state. Empty text names the exact missing artifact class and never claims no artifacts when facts, issues, research, recommendations, decisions, or drafts exist.

## Integration and full verification

After all workers and reviewers stop, the coordinator resolves only small cross-contract seams. Record why an integration edit is needed. The coordinator alone owns active acceptance docs, dependency manifests, `.env.example`, generated build files, and `graphify-out/**`. Do not change dependencies unless existing commands cannot run. Do not rewrite historical reports or the older `themis-ai-reliability-build` handoff files.

Do not start the live experiment until every known issue has a final PASS and the combined app passes:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
test ! -f scripts/check-decision-integrity.ts || node --experimental-strip-types scripts/check-decision-integrity.ts
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

After implementation, hash repository `vault/` again to establish the pre-browser-test value. Then create an isolated blank verification vault through the normal supported flow. Walk relevant `docs/ACCEPTANCE_TESTS.md` paths in a visible browser. Prove typed-tool parity through a real matter. Verify Markdown after mutations. Delete only that vault's disposable SQLite index, rebuild it normally, and confirm the same visible state. Test one safe retry for a work product, decision, and matter update. Test one public-research failure and one local restart. Re-hash repository `vault/` after the browser tests and prove those tests did not change it.

If a gate fails, return it to the smallest Sol Medium chunk, review again, and rerun the focused and full checks. Use Sol High only under the escalation rule.

## Fresh-vault 10-matter experiment

After the gate passes, use `$live-agent-ux-experiment`. Create a second new vault dedicated to the live experiment. Do not reuse the verification vault, first Harborline vault, repository vault, or unrelated user data. Use the normal supported vault-creation and selection flow. Record its absolute path and test-only purpose. Preserve the earlier active-vault pointer for recovery, but leave the experiment vault intact.

Create a unique run folder under `tmp/harborline-fix-rerun-<timestamp>/` for raw actor reports, screenshots, timing, and normalized evidence. Save the checked final report as `docs/experiments/<YYYY-MM-DD>-harborline-fix-rerun-report.md`. Do not overwrite an existing run folder or report.

State this setup once:

```text
Business type: Fintech with consumer and business bank accounts through a banking partner and substantial payments work.
Fictional company: Harborline Financial, not affiliated with Chime.
Requester role: Senior product manager.
Attorney role: Senior product counsel focused on BSA/AML, banking regulation, and payments.
Iterations: 10.
Themes: onboarding, background checks, payments, deactivation, privacy, and marketing.
Application: http://localhost:3000
Requester: gpt-5.6-luna, medium reasoning.
Setup attorney: gpt-5.6-luna, medium reasoning.
Matter attorneys: gpt-5.6-luna, medium reasoning.
Synthesis: gpt-5.6-sol, high reasoning.
Public reference: Chime public pages, broad business model only.
Matter prefix: Harborline UX Rerun — NN —
Per-matter wall-clock cap: 35 minutes.
Final action: local fictional state changes are allowed; stop before real external contact or delivery.
```

Follow these rules:

1. One Luna Medium requester generates exactly 10 complete, varied requests. Each has at least two substantial paragraphs and includes the business goal, proposed flow, actors, timing, known facts, missing facts, and advice requested.
2. One Luna Medium setup attorney creates the fictional profile through a directly controlled visible browser.
3. Ten fresh Luna Medium attorneys each handle exactly one matter. Never split a matter or reuse an attorney.
4. Live UI writes are serial. Request generation and post-run analysis can be parallel.
5. Give each attorney clean context containing only experiment rules, persona, company facts, and its one request. Do not disclose earlier findings.
6. Every actor controls a visible browser itself. Order: in-app browser, Chrome, Safari. The actor reads the skill, makes one changed-condition recovery attempt per failed surface, then moves to the next. The coordinator never operates UI for an actor.
7. The attorney learns phases from the visible UI and attempts every visible phase in order. Work must be useful and developed. State assumptions, missing facts, and unverified leads. Keep recommendations separate from decisions.
8. Cap each matter at 35 wall-clock minutes. At the cap, preserve evidence and make the best safe final attempt. Never claim completion to meet the cap.
9. Inspect every save, state change, artifact, decision, local delivery record, closure, and reload on screen. No visible proof means no success claim.
10. Local fictional delivery recording is allowed only when it sends nothing. Stop before real contact or external action.
11. Mark a browser-boundary violation or coordinator-operated run contaminated. Repeat it with a fresh Luna Medium attorney when safe.
12. Keep working-well evidence, product friction, broken behavior, browser-control errors, and environment failures separate.

After each run, record:

- question, browser, fallback attempts, and method compliance;
- phases discovered, attempted, and reached;
- matter creation, participants, work items, and intake-card state;
- saved research and provider or fallback state;
- canonical draft and final artifact;
- recommendation, decision relevance, decision, and register/matter consistency;
- approval, local delivery record, required work, Closed state, and reload consistency;
- duplicate records and internal-output leakage;
- time to first useful artifact, total time, retries, extra clicks, and recovery delay;
- working well, friction, broken behavior, browser errors, environment failures, blockers, and visible evidence.

Do not game denominators. A decision is required only when relevant, but record relevance for every run. Attempt closure whenever the visible fictional workflow permits it. A provider outage does not erase useful local analysis and does not become false success.

## Sol High synthesis

Only after the final live run, create one fresh Sol High synthesis agent. Give it all normalized raw evidence, setup, method exceptions, per-run completion data, earlier baseline metrics, and repository access.

It may inspect source, tests, logs, and docs. It starts each issue group with a focused Graphify query. It does not alter raw observations or implement fixes. It labels causes `Confirmed`, `Likely`, or `Unknown`.

Require:

1. Executive result.
2. Setup and method.
3. Strict before/after metrics.
4. Per-run table.
5. Working well and what to preserve.
6. Not working well.
7. Broken behavior.
8. Recurrence result for every COS and ENV issue.
9. New evidence-based repair backlog, if needed.
10. Cross-run and timing patterns.
11. Browser-control errors.
12. Environment failures.
13. Incomplete or contaminated runs.
14. Method compliance.

The coordinator checks the draft against raw evidence. Do not hide failed runs or merge product defects with browser or environment failures.

## Completion standard

Finish only when all are true or a safety stop is documented:

- every issue has current proof and final Sol Medium verdict;
- every correction is rechecked;
- any escalation used only the one shared Sol High engineering reviewer and returned to Sol Medium;
- full backend, frontend, blank-vault, retry, index-rebuild, research-failure, and restart checks pass;
- the repository vault hash is unchanged;
- a new live experiment vault exists;
- exactly 10 requests and 10 matter reports exist unless the skill requires an environment stop;
- all live actors used Luna Medium, one fresh attorney per matter, serial writes, and a 35-minute cap;
- one fresh Sol High synthesis exists and the coordinator checked it;
- strict before/after metrics and every exception are reported;
- the progress file is current;
- no commit, push, deployment, destructive cleanup, or real external contact occurred.

## Safety stops

Stop only if continuing could change non-test data, contact a real person or service, discard user work, or if no permitted visible browser can be recovered after required attempts. Also stop if Markdown and rebuilt SQLite still disagree after focused correction and the shared Sol High reviewer cannot resolve the record-integrity question.

On stop, preserve partial work and evidence. State the blocker, last proven state, affected runs, and safest next action. Do not mark complete.

## Final response

Lead with the outcome. Include issue status by ID, exact verification counts, verification-vault and experiment-vault paths, strict before/after experiment metrics, links to the final report and progress file, unresolved product or environment issues, and confirmation that no commit, push, deploy, destructive cleanup, or real external contact occurred.

Start now with Wave 0. Continue autonomously through this full one-shot work order.
