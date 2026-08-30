# Counsel OS chat reliability and UX repair plan

## Thesis

Prove that a lawyer can answer the first intake question, leave or reload the matter, and still receive exactly one useful result with one consistent research state. A failed request must remain visible and retryable. The same repair must also protect company-profile replacement. Keep the MVP local, Markdown-first, and free of queues or new infrastructure.

## Payoff moment

During a slow intake run, the lawyer reloads the matter, sees the same active run, receives the answer once, sees one first-pass research packet, and can continue the workflow.

## Demo script

1. Open a new matter and select `Yes` on the first intake card.
2. Delay the fake provider long enough to reload the page.
3. Reload and see `Working` for the same durable run.
4. Let the run complete and see one assistant answer without another reload.
5. Confirm that chat controls become usable and only one research packet exists.
6. Repeat with a provider failure. See a saved failure message and a `Retry` action, not `Failed to fetch`.
7. Retry. Confirm that the original user answer is not duplicated and the final answer appears once.
8. Open company setup with an existing different company. Confirm that Save names both companies and requires replacement confirmation.

## Model and coordination policy

- Orchestrator: Codex, `gpt-5.6-sol`, medium reasoning.
- Implementers: Codex, `gpt-5.6-sol`, low reasoning.
- Reviewer: Codex, `gpt-5.6-sol`, medium reasoning.
- Maximum active implementation workers: 3. This fits the four-slot runtime when the orchestrator is active.
- Review policy: one dedicated combined-implementation review after the first implementation wave. The reviewer is read-only.
- Optimization: balanced. Do not create work only to fill a slot.
- Shared working tree only. No worktrees, clones, commits, pushes, or patch transport.
- Workers may not spawn agents.

## Baseline rules

The worktree is already dirty, including several target files. Treat all existing changes as user-owned. Before dispatch, the orchestrator must record `git status --short` and a scoped diff for every owned file. Never reset or revert existing work.

Before any code change, every actor must read:

- `AGENTS.md`
- `docs/PRD.md`
- `CODEX_HANDOFF.md`
- `docs/DESIGN_LANGUAGE.md` for UI work

For each code issue, run a focused `graphify query` before source inspection. After the final code changes, the orchestrator runs `graphify update .`.

## Contract decisions

These decisions are fixed. Workers must not choose a different architecture.

1. Keep `POST /api/chat` for existing synchronous callers and tests.
2. Add a matter-scoped durable API:
   - `POST /api/matters/{matter_id}/chat-runs` returns HTTP 202 and a `ChatRun` record.
   - `GET /api/matters/{matter_id}/chat-runs/{run_id}` returns current state and the final `ChatResponse` when complete.
   - `POST /api/matters/{matter_id}/chat-runs/{run_id}/retry` resumes only `failed` or `interrupted` runs and returns HTTP 202.
3. Persist each run as Markdown under `<matter>/conversations/runs/<run_id>.md` with `record_type: chat_run`.
4. Run states are `queued`, `running`, `completed`, `failed`, and `interrupted`.
5. A run owns one logical user turn. Retry must reuse the run and must not append a second user message or repeat successful mutations.
6. Use `asyncio.create_task`, following `ResearchRunService`. Do not add Celery, Redis, a broker, a database table, or a distributed queue.
7. At startup, mark saved `queued` or `running` chat runs as `interrupted`.
8. `Stop waiting` only releases the local UI lock. It does not cancel server work, and the label must say that work continues.
9. Automatic intake research has one owner: `_apply_matter_actions`. If the same agent turn already completed `run_research`, reuse that result and do not start another run.
10. Use the intake card ID as the stable source-action key for automatic research deduplication.
11. Company replacement stays single-company. The existing `CompanyProfile.version` is the optimistic concurrency token. Do not add multi-company management.

## Parallel implementation chunks

### Chunk A — Backend durable chat runs and research deduplication

```yaml
id: backend-chat-runs
outcome: Matter chat work persists as a resumable Markdown run, failures are durable, retries are idempotent, and intake creates at most one research packet.
depends_on: []
implementer: sol-low-backend
reviewer: sol-medium-combined-review
risk: high
write:
  - backend/app/models/api.py
  - backend/app/routers/chat.py
  - backend/app/services/chat_runs.py
  - backend/app/services/chat_history.py
  - backend/app/services/research_runs.py
  - backend/app/services/matters.py
  - backend/app/agents/runner.py
  - backend/app/config.py
  - backend/app/runtime.py
  - backend/app/main.py
  - backend/tests/test_chat_runs.py
  - backend/tests/test_chat_history.py
  - backend/tests/test_research.py
  - backend/tests/test_matters.py
read:
  - backend/app/services/research_runs.py
  - backend/app/providers/openai_compatible.py
  - backend/app/services/vault.py
check:
  - cd backend && pytest tests/test_chat_runs.py tests/test_chat_history.py tests/test_research.py tests/test_matters.py
provides:
  - Durable ChatRun API and Markdown lifecycle
  - Retry and startup interruption behavior
  - One automatic research run per intake action
```

Required behavior:

- Introduce Pydantic response types for `ChatRun` and its state.
- Extract the current chat execution body so synchronous `/api/chat` and durable runs call the same implementation.
- Save the user turn once when the run starts. Save the assistant turn only when a useful final response exists.
- Persist structured failure text without stack traces, provider payloads, or secrets.
- Preserve non-empty model output and successful tool traces if a later step fails.
- Add an overall chat-run limit. Use a configuration value with a conservative default of 180 seconds.
- When the overall limit is reached, make one final provider call without tools using collected messages and tool observations. Limit that final call to 30 seconds.
- If that call also fails, save a deterministic summary of completed tool work and remaining work. Do not invent legal analysis.
- Retry only failed or interrupted runs. Reuse the original request and user message.
- If a successful mutation already occurred, do not execute it again on retry.
- Add a source-action key to automatic research runs and return the existing run when the same intake action asks again.
- Exclude `record_type: research_run` files from substantive matter artifacts. Only research packets are artifacts.

Required tests:

- queued → running → completed persistence;
- reload-equivalent GET during a slow fake provider;
- startup marks unfinished runs interrupted;
- provider exception creates a durable failed run;
- malformed provider reply preserves a useful deterministic failure result;
- retry creates one user turn and one assistant turn;
- retry does not repeat a successful mutation;
- completed card actions still reject true duplicates;
- one intake answer produces one research run, packet, and completion event even when the model requested `run_research`;
- a later explicit, different research question still produces a new packet;
- research-run metadata is not exposed as a substantive research artifact.

### Chunk B — Frontend run reconnection, failure UX, and research consistency

```yaml
id: frontend-chat-recovery
outcome: The matter chat starts and polls durable runs, reconnects after reload, shows useful failure/retry controls, and presents one consistent research state.
depends_on: []
implementer: sol-low-frontend
reviewer: sol-medium-combined-review
risk: high
write:
  - frontend/lib/types.ts
  - frontend/lib/api.ts
  - frontend/components/ChatPanel.tsx
  - frontend/components/ChatCards.tsx
  - frontend/components/MatterWorkspace.tsx
  - frontend/lib/matterBrief.ts
  - frontend/scripts/check-chat-run-recovery.ts
  - frontend/scripts/check-matter-brief.ts
read:
  - frontend/app/globals.css
  - frontend/lib/design.ts
  - backend/app/models/api.py
check:
  - cd frontend && npm run typecheck
  - cd frontend && npx tsx scripts/check-chat-run-recovery.ts
  - cd frontend && npx tsx scripts/check-matter-brief.ts
provides:
  - Visible durable run state and reload reconnection
  - Safe Retry and Stop waiting actions
  - Consistent research card and artifact rendering
```

Required behavior:

- Matter chat uses the new chat-run API. Daily workspace chat may keep synchronous `/api/chat` in this change.
- On matter load, query for the latest active or failed run in the selected conversation and reconnect to it.
- Poll only while state is queued or running. Stop polling on terminal state.
- Render clear state words: `Queued`, `Working`, `Completed`, `Failed`, or `Interrupted`.
- Never render raw `Failed to fetch` text. Use `Themis could not finish this request.` plus the saved failure detail when safe.
- Show `Retry` only for failed or interrupted runs.
- Show `Stop waiting` while active, with text that server work continues.
- Keep navigation and documents usable while work continues. Disable only controls that would submit a conflicting chat turn.
- On completion, append the final assistant response once, refresh the matter once, and clear the local lock.
- On reload, do not append a duplicate optimistic user message.
- `ResearchCard` must fetch current state immediately, then poll. When it reaches a terminal state, call the parent refresh once.
- `matterArtifacts` must exclude paths under `/research/runs/` and include only substantive research packets.
- Use existing semantic colors and state labels. Do not add page-local attention colors.

Required tests:

- active run reconnects after remount;
- completed result appears once;
- network rejection shows the product error, never `Failed to fetch`;
- retry calls the same run ID;
- Stop waiting releases the local UI without marking the server run failed;
- completed research does not reappear as queued after reload;
- research-run metadata is excluded from artifacts.

### Chunk C — Company replacement warning and version conflict

```yaml
id: company-profile-protection
outcome: Saving a different company requires explicit replacement confirmation, and stale drafts cannot overwrite newer company data.
depends_on: []
implementer: sol-low-company
reviewer: sol-medium-combined-review
risk: normal
write:
  - backend/app/services/company.py
  - backend/app/routers/settings.py
  - backend/tests/test_company_interview.py
  - frontend/components/CompanyInterview.tsx
read:
  - backend/app/models/api.py
  - frontend/lib/api.ts
  - frontend/lib/types.ts
  - frontend/app/globals.css
  - frontend/lib/design.ts
check:
  - cd backend && pytest tests/test_company_interview.py
  - cd frontend && npm run typecheck
provides:
  - Explicit company replacement confirmation
  - Optimistic concurrency using CompanyProfile.version
```

Required behavior:

- `CompanyProfileService.write` compares the submitted non-empty `version` with the current saved version.
- A stale version fails without changing `company.md`.
- The settings router maps the conflict to HTTP 409 with a plain message.
- If the saved company name and draft company name are both non-empty and differ after normalization, show a confirmation that names both companies.
- Do not send Save until the user confirms replacement.
- Do not show the warning for an empty profile or ordinary edits to the same company.
- Keep the existing review-before-save card.

Required tests:

- same-company edit saves without replacement confirmation;
- different-company save requires confirmation;
- stale version returns 409 and preserves the file;
- empty first-run profile saves normally.

## Dependency waves

### Wave 0 — Sol Medium orchestrator

1. Record the dirty baseline and current branch.
2. Run the focused pre-change tests.
3. Run the three focused graph queries.
4. Confirm that the named files and endpoints still match this plan.
5. Dispatch Chunks A, B, and C together. Give each worker only its listed write scope.

### Wave 1 — Three Sol Low implementers in parallel

- Worker A implements Chunk A.
- Worker B implements Chunk B.
- Worker C implements Chunk C.
- Each worker runs only its focused checks and reports files changed, checks run, failures, and uncertainty.
- Workers do not edit files outside their scopes.

### Wave 2 — Sol Medium orchestrator integration

1. Compare actual changed paths with ownership.
2. Resolve contract seams without moving ownership retroactively.
3. Run all focused checks.
4. Run `cd backend && pytest`.
5. Run `cd frontend && npm run typecheck && npm run build`.

### Wave 3 — Sol Medium reviewer

The reviewer is read-only. Review the combined diff for:

- lost or duplicated user and assistant turns;
- duplicate tool or matter mutations;
- invalid retry transitions;
- unsafe exposure of provider errors or secrets;
- stale-run recovery after restart;
- research duplication and conflicting state labels;
- stale company-profile overwrite;
- missing hostile-output and assembled-lifecycle tests;
- violations of Markdown source-of-truth or `VAULT_PATH` boundaries.

The reviewer must return findings with priority, file, line, reproduction, and required correction. If there are no material findings, it must say so directly.

### Wave 4 — Corrections and final verification

- Route each finding back to the original owner when possible.
- Use Sol Medium for a correction only when the finding is cross-cutting or a Sol Low worker fails focused verification twice.
- Re-run focused tests after every correction.
- Run the complete backend and frontend commands again.
- Run the browser demo script.
- Run `graphify update .`.

## End-to-end acceptance gate

The implementation is complete only when all of these are visibly verified:

1. A deliberately slow intake turn survives reload and completes once.
2. The same logical action creates one user turn, one assistant turn, and one research packet.
3. A simulated provider or transport failure is durable and shows Retry.
4. Retry completes without duplicating a user answer, tool mutation, or research packet.
5. Research header, card, and artifact labels agree.
6. A different company name triggers a named replacement warning.
7. A stale company draft returns 409 and preserves the current profile.
8. Backend tests, frontend typecheck, and frontend build pass.

## Parked backlog

- Distributed job queue: add only after real use shows that one-process background tasks cannot meet reliability needs.
- Cross-device run continuation: add only after the product has multiple authenticated devices or users.
- Multi-company profile management: add only after users need to switch active companies in one vault.
- Streaming tokens: add only after durable non-streaming runs pass the end-to-end acceptance gate.
- Provider-specific retry policies: add only after retained failure data shows a repeated provider-specific pattern.

## Do not do

- Do not add Redis, Celery, a message broker, WebSockets, server-sent events, or a new database.
- Do not add authentication, tenancy, or multi-company profile switching.
- Do not change recommendation-versus-decision rules.
- Do not hide failures or claim a run completed without a durable result.
- Do not weaken or delete tests to obtain a pass.
- Do not reset or overwrite user changes in the dirty worktree.
- Do not commit, push, deploy, or create a pull request.
