# New-context prompt — Counsel OS chat reliability and UX repairs

You are the Sol Medium orchestrator for a parallel repair of Counsel OS in `/Users/bharris/Programs/counsel-os-mvp`.

Use Codex `gpt-5.6-sol` with medium reasoning for yourself and the dedicated reviewer. Use Codex `gpt-5.6-sol` with low reasoning for implementation workers. Run at most three implementation workers at once. Use one shared working tree. Do not create worktrees, clones, commits, pushes, deployments, or pull requests.

Your goal is to fix every material issue found in the Harborline live UX experiment: durable and resumable chat work, useful failure and retry behavior, orphaned intake answers, duplicate first-pass research, contradictory research status and artifact labels, company-profile replacement protection, and the resulting failure to progress beyond intake.

## Resume protocol

Before starting, read `chat-reliability-ux-fixes.handoff-progress.md` and `chat-reliability-ux-fixes.handoff-plan.md` completely.

- Do not redo a step marked `done`.
- Start at the first pending step.
- After each wave or chunk passes its verification, immediately mark its line `done` in the progress file.
- On failure, write `FAILED: <specific cause>` on that line and apply the blocker policy below.
- If a completed step no longer passes its verification, stop and report. Do not blindly reapply it.

## Required repository context

Read before changing code:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/DESIGN_LANGUAGE.md`
5. `chat-reliability-ux-fixes.handoff-plan.md`

The repository has a knowledge graph. For each issue group, start with a focused `graphify query`. After changing application code, run `graphify update .`.

The worktree is already dirty. Existing changes are user-owned. Record `git status --short` and scoped diffs before dispatch. Never reset, revert, or overwrite unrelated changes.

## Verified current path

The frontend API helper in `frontend/lib/api.ts` uses:

```ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { /* headers and no-store */ });
  // Non-2xx responses become structured Error objects.
}

export async function sendChat(payload: Record<string, unknown>): Promise<ChatResponse> {
  return request("/chat", { method: "POST", body: JSON.stringify(payload) });
}
```

`frontend/components/ChatPanel.tsx::submit` currently holds `busy` only in React memory, awaits `sendChat`, renders the raw caught error text, and clears `busy` in `finally`.

`backend/app/routers/chat.py::chat` currently:

1. validates the request;
2. appends the user turn;
3. awaits `context.runner.run`;
4. applies matter actions;
5. appends the assistant turn;
6. returns `ChatResponse`.

`backend/app/services/research_runs.py::ResearchRunService` is the approved small pattern. It persists Markdown state, stores local `asyncio.Task` objects, marks active runs interrupted on restart, and exposes start/get/wait operations.

`backend/app/routers/chat.py::_apply_matter_actions` currently starts automatic intake research after an answered intake card. The agent can also call `run_research`, which caused two packets in one observed run.

`frontend/components/ChatCards.tsx::ResearchCard` initializes from a saved card snapshot and polls later. It does not refresh the parent matter on terminal state.

`frontend/lib/matterBrief.ts::matterArtifacts` and `backend/app/services/matters.py` currently allow research-run metadata to appear as a research artifact.

`backend/app/services/company.py::CompanyProfileService.write` currently excludes `version` from content but does not compare the submitted version with the saved version. `frontend/components/CompanyInterview.tsx` saves the draft directly after review.

## Fixed architecture decisions

- Keep synchronous `POST /api/chat` for existing callers.
- Add matter-scoped durable chat-run start, status, and retry endpoints exactly as specified in the handoff plan.
- Persist chat runs as Markdown under the matter conversation directory.
- Use `asyncio.create_task`; do not add a queue or broker.
- Retry reuses one logical user turn and does not repeat successful mutations.
- Automatic intake research has one owner and one stable source-action key.
- Use `CompanyProfile.version` for optimistic concurrency. Keep the single-company MVP.
- `Stop waiting` releases only the local UI lock. It does not cancel server work.

## Worker pools

Create these pools:

```yaml
parallel:
  optimize_for: balanced
  max_agents: 3
  workers:
    - name: sol-low-backend
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: low
      max_concurrent: 1
    - name: sol-low-frontend
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: low
      max_concurrent: 1
    - name: sol-low-company
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: low
      max_concurrent: 1
    - name: sol-medium-review
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 1
  review:
    policy: coordinator-only
```

The runtime has four total slots including you. Therefore, three implementation workers is the maximum useful parallel wave.

## Execution plan

### Wave 0 — You, Sol Medium orchestrator

1. Read all required files.
2. Record the dirty baseline.
3. Run focused graph queries for chat-run lifecycle, research trigger/status, and company-profile save.
4. Run the current focused tests.
5. Confirm that all named paths and symbols still exist.
6. If they match, dispatch all three implementation chunks in parallel.

### Wave 1 — Parallel Sol Low implementation

Dispatch these exact chunks.

#### Chunk A — Backend durable chat runs and research deduplication

Outcome: matter chat work persists as a resumable Markdown run; failures are durable; retries are idempotent; one intake action creates at most one research packet.

Write scope only:

```text
backend/app/models/api.py
backend/app/routers/chat.py
backend/app/services/chat_runs.py
backend/app/services/chat_history.py
backend/app/services/research_runs.py
backend/app/services/matters.py
backend/app/agents/runner.py
backend/app/config.py
backend/app/runtime.py
backend/app/main.py
backend/tests/test_chat_runs.py
backend/tests/test_chat_history.py
backend/tests/test_research.py
backend/tests/test_matters.py
```

Required implementation:

- Add the 202 start, GET status, and 202 retry endpoints from the fixed architecture.
- Store Markdown run records under `<matter>/conversations/runs/`.
- Extract one shared chat-execution function used by synchronous and durable paths.
- Save the user turn once. Save the assistant turn once when useful output exists.
- Mark active saved runs interrupted at startup.
- Add a 180-second overall run limit, one final no-tools provider call limited to 30 seconds, and a deterministic tool-summary fallback if that call fails.
- Persist safe failure details without secrets or provider payloads.
- Retry only failed or interrupted runs. Do not repeat successful mutations.
- Deduplicate automatic intake research with a stable source-action key based on matter, conversation, and card ID.
- Exclude research-run metadata from substantive artifacts.

Focused checks:

```bash
cd backend && pytest tests/test_chat_runs.py tests/test_chat_history.py tests/test_research.py tests/test_matters.py
```

Tests must cover lifecycle persistence, slow-run status, startup interruption, provider exception, malformed provider output, retry idempotency, true duplicate rejection, one automatic research packet, later explicit research, and artifact exclusion.

#### Chunk B — Frontend reconnection, failure UX, and research consistency

Outcome: matter chat starts and polls durable runs, reconnects after reload, shows useful failure and retry controls, and presents one current research state.

Write scope only:

```text
frontend/lib/types.ts
frontend/lib/api.ts
frontend/components/ChatPanel.tsx
frontend/components/ChatCards.tsx
frontend/components/MatterWorkspace.tsx
frontend/lib/matterBrief.ts
frontend/scripts/check-chat-run-recovery.ts
frontend/scripts/check-matter-brief.ts
```

Required implementation:

- Matter chat uses durable start/status/retry. Daily chat stays synchronous.
- Reconnect to the latest active or failed matter run after reload.
- Poll only queued or running runs.
- Render `Queued`, `Working`, `Completed`, `Failed`, or `Interrupted` as text.
- Never show raw `Failed to fetch`.
- Show Retry only for failed or interrupted runs.
- `Stop waiting` releases the local lock and says server work continues.
- Keep navigation and documents usable. Disable only conflicting chat submission.
- Append the final answer once and refresh the matter once.
- Fetch current research state immediately; refresh the parent once on terminal state.
- Exclude `/research/runs/` from artifacts and use one `First-pass research` label.
- Use existing semantic colors from `design.ts` and `globals.css`.

Focused checks:

```bash
cd frontend && npm run typecheck
cd frontend && npx tsx scripts/check-chat-run-recovery.ts
cd frontend && npx tsx scripts/check-matter-brief.ts
```

Tests must cover remount reconnection, one completed result, normalized network failure, retry using the same run ID, Stop waiting, current research after reload, and artifact exclusion.

#### Chunk C — Company replacement warning and version conflict

Outcome: saving a different company requires explicit confirmation, and a stale draft cannot overwrite newer company data.

Write scope only:

```text
backend/app/services/company.py
backend/app/routers/settings.py
backend/tests/test_company_interview.py
frontend/components/CompanyInterview.tsx
```

Required implementation:

- Compare the submitted non-empty `CompanyProfile.version` with the current saved version.
- Fail stale writes without changing `company.md`.
- Map the conflict to HTTP 409 with a plain message.
- If saved and draft company names are non-empty and differ after normalization, show a confirmation that names both companies.
- Do not send Save before confirmation.
- Do not warn for first-run or same-company edits.
- Preserve the existing review-before-save card.

Focused checks:

```bash
cd backend && pytest tests/test_company_interview.py
cd frontend && npm run typecheck
```

Tests must cover same-company save, different-company confirmation, stale-version 409 with file preservation, and empty first-run save.

Each worker prompt must include:

- the repository path;
- its concrete outcome;
- exact write and read scopes;
- required behavior and tests;
- the dirty-worktree warning;
- no nested agents;
- no out-of-scope edits;
- no commits or destructive actions;
- a required report of files changed, checks run, failures, uncertainty, and risks.

Do not let workers edit each other’s files. Do not manufacture a fourth implementation chunk.

### Wave 2 — Integration

1. Compare changed files with assigned ownership.
2. Inspect every scoped diff.
3. Resolve contract seams yourself.
4. Run all focused worker checks.
5. Run:

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

### Wave 3 — Dedicated Sol Medium review

Start a fresh, read-only `gpt-5.6-sol` medium reviewer. Give it the original UX evidence, fixed requirements, combined diff, and test output.

It must inspect for:

- duplicate or lost turns;
- repeated mutations on retry;
- invalid lifecycle transitions;
- restart recovery;
- raw transport or provider errors;
- missing useful fallback output;
- duplicate research;
- contradictory research labels;
- stale company overwrite;
- missing hostile-output or assembled-lifecycle tests;
- violations of Markdown source-of-truth and `VAULT_PATH`.

Require findings with priority, file, line, reproduction, and correction. The reviewer must not edit files.

### Wave 4 — Corrections and acceptance

Return findings to the original owner when possible. Use Sol Medium for cross-cutting corrections or after two failed focused checks by a Sol Low worker.

Then run the full checks again, perform the browser demo from the plan, and run `graphify update .`.

## Blocker policy

Continue through safe and reversible uncertainty using the smallest choice consistent with the fixed architecture.

Stop and report only when:

- a required file, symbol, model, or tool is unavailable;
- repository instructions conflict materially;
- the named code differs enough that the fixed architecture no longer fits;
- focused verification still fails after diagnosis;
- a change would require an irreversible action or user decision;
- existing user changes cannot be preserved safely.

Do not stop for warnings, unrelated pre-existing failures, or ambiguity that can be resolved by reading the named code.

## Do not

- Do not add Redis, Celery, a broker, WebSockets, server-sent events, auth, tenancy, or a new database.
- Do not add multi-company profile management.
- Do not add streaming before the durable non-streaming path works.
- Do not weaken tests.
- Do not expose secrets, provider payloads, or stack traces.
- Do not change recommendation-versus-decision rules.
- Do not reset, revert, commit, push, deploy, or create a pull request.

## Done when

The work is complete only when:

- a slow matter chat run survives reload and completes once;
- failure is durable and retryable without `Failed to fetch`;
- retry does not duplicate user turns, assistant turns, mutations, or research;
- one intake answer creates one first-pass research packet;
- research header, card, and artifact labels agree;
- different-company replacement requires named confirmation;
- stale company save returns 409 and preserves the current profile;
- all backend tests pass;
- frontend typecheck and build pass;
- the browser acceptance script passes;
- graphify is updated;
- the progress file is fully marked done.

Work through the waves in order. Update `chat-reliability-ux-fixes.handoff-progress.md` immediately after each verified wave or chunk. If a named file, symbol, or signature differs materially from this prompt, stop and report instead of adapting around it.
