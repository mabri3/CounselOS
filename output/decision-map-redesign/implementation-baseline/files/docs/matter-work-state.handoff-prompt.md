# Implementation prompt — Matter work state

You are the medium-effort coordinator for a focused Counsel OS implementation in:

`/Users/bharris/Programs/counsel-os-mvp`

Your model is `gpt-5.6-sol` with `medium` effort. Use `gpt-5.6-sol` workers with `low` effort for the implementation chunks described below. You own decomposition, contract enforcement, worker-scope checks, integration, review, and final verification.

## Goal

Create one authoritative derived `work_state` projection for each matter. Markdown remains the durable source of truth. A focused Python service reads matter, required work-item, and saved research-run records and calculates the next action, next owner, execution state, and display signal. Matter APIs, the frontend, and agent context must use that same result. A matter in Research or Generate must never say **Themis is working** unless a saved research-run record is actually `queued` or `running`.

Do not build a general workflow engine.

## Resume protocol

Before starting, read:

`docs/matter-work-state.handoff-progress.md`

- Do not redo a step marked `done`. Begin at the first pending step whose dependencies are complete.
- If a completed step’s verification now fails, stop and report. Do not blindly reapply it.
- After each step, run its exact verification. Then immediately change only that progress line to `- [x] Step N: <title> — done`.
- On failure, change the line to `— FAILED: <short reason>` and follow the blocker policy.
- Do not batch progress updates at the end.

## Required repository reading

Before dispatching workers, read these files completely:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/ARCHITECTURE.md`
5. `docs/API.md`
6. `docs/ACCEPTANCE_TESTS.md`
7. `backend/app/services/matters.py`
8. `backend/app/services/research_runs.py`
9. `backend/app/agents/context.py`
10. `backend/app/runtime.py`
11. `frontend/lib/types.ts`
12. `frontend/lib/design.ts`
13. `frontend/lib/briefing.ts`

Run `git status --short` before dispatch. The repository is already heavily dirty. Preserve all existing changes. Do not clean, reset, restore, or revert files you do not own.

Because `graphify-out/graph.json` exists, run this before raw exploration:

```bash
graphify query "Where do matter workflow transitions, next-action rules, work ownership, agent execution state, and UI status signals come together?" --budget 7000
```

After application changes, run `graphify update .`.

## Current code facts

These facts were verified before this prompt was written.

### Matter service construction

`backend/app/services/matters.py` currently has:

```python
class MatterService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        workflow: WorkflowService,
    ):
        self.vault = vault
        self.index = index
        self.workflow = workflow
```

`MatterService.list()` already groups indexed work items by matter and adds `open_work_items` and `required_work_items` counts.

`MatterService.get()` currently selects `next_work` independently:

```python
work_items = self.index.list_work_items(matter_id)
required = [
    item for item in work_items if item["required"] and item["status"] not in {"done", "closed"}
]
next_work = next((item for item in work_items if item["status"] not in {"done", "closed"}), None)
```

It then uses `next_work["title"]` for `orientation.next_action`. Replace this duplicate selection with the new service result.

`MatterService.move_stage()` contains a local `next_actions` dictionary. Move that mapping into the new service and call it from `move_stage()`.

### Research execution

`backend/app/services/research_runs.py` writes each run to:

`<matter path>/research/runs/<run id>.md`

The saved states are `queued`, `running`, `completed`, `failed`, and `interrupted`. The private `_tasks` dictionary is in-memory only. Do not use it for the durable projection.

### Agent context

`backend/app/agents/context.py::ContextBuilder.build()` currently appends the indexed matter record and selected matter Markdown files. It does not append a combined work-state summary. Add exactly one JSON section named `# Current matter work state`.

### Frontend inference that must be removed

`frontend/lib/design.ts` currently contains:

```typescript
export function matterIsAgentWorking(matter: Matter): boolean {
  return matter.status === "research" || matter.status === "generate";
}
```

It also keeps separate `GENERIC_RESEARCH_ACTIONS` and `STAGE_ACTION_DETAILS` next-action rules. Remove those business rules from TypeScript. Presentation color mapping may remain.

### Work-item owner

`backend/app/models/api.py::WorkItemCreate` declares:

```python
owner: str = ""
```

`backend/app/tools/handlers.py::create_work_item()` preserves an empty owner. Keep this behavior. Unknown ownership must remain unknown.

### API and frontend

`GET /api/matters` returns `{matters, stages}` from `context.matters.list()` and `context.workflow.stages()`.

`GET /api/matters/{matter_id}` returns `context.matters.get(matter_id)`.

`frontend/lib/api.ts` already types both paths as `Matter[]` and `MatterDetail`; no endpoint change is required.

### Current callers of frontend state helpers

Inspect and update every relevant caller in:

- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MattersTimeline.tsx`

Do not update only the board.

## Baseline verification

The baseline was observed on 2026-08-28.

```bash
cd backend && .venv/bin/pytest -q
```

Result: `108 passed, 3 failed`. The three failures are pre-existing and are caused by a saved Apex annotation in the repository vault:

- `tests/test_annotations.py::test_annotations_round_trip`
- `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
- `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`

Do not fix, delete, or rewrite sample data for those failures.

```bash
cd backend && .venv/bin/pytest -q tests/test_matters.py tests/test_research.py
```

Result: `11 passed`.

```bash
cd frontend && npm run typecheck && npm run build
```

Result: both pass.

## Architecture decision

Use this boundary:

```text
Matter, work-item, and research-run Markdown
                    ↓
        MatterStateService (Python)
                    ↓
             work_state JSON
              ↙           ↘
         frontend       agent context
```

`MatterStateService` calculates current meaning. `MatterService` still performs writes and lifecycle actions. Do not persist `work_state`.

## Frozen `work_state` contract

Every matter returned by list and detail must contain:

```json
{
  "work_state": {
    "next_action": "Confirm the data-retention period",
    "next_work_item_id": "WI-123",
    "next_owner": "Brian Harris",
    "next_actor": "named_owner",
    "due_at": "2026-09-01",
    "execution_state": "not_running",
    "active_run_id": null,
    "execution_note": "",
    "signal": {
      "kind": "waiting_on_owner",
      "label": "Waiting on Brian Harris"
    }
  }
}
```

Allowed `next_actor` values: `themis`, `named_owner`, `unassigned`, `you`, `none`.

Allowed `execution_state` values: `queued`, `running`, `not_running`, `unknown`.

Allowed signal kinds: `overdue`, `agent_working`, `execution_unknown`, `blocked`, `needs_assignment`, `ready_for_themis`, `waiting_on_owner`, `waiting_on_you`, `none`.

## Frozen derivation rules

### Next required work

1. Ignore `done` and `closed`, case-insensitively.
2. Consider only truthy `required` items.
3. Rank priority as `urgent`, `high`, `normal`, `low`. Unknown or blank is `normal`.
4. Within priority, put dated work before undated work, then sort by `due_at`, `created_at`, title, and work-item ID. Missing values must not raise.
5. If none exists, use no work-item ID and no owner. The stage fallback below sets the actor.

### Next action

Use the selected required work-item title, else the saved matter `next_action`, else `MatterStateService.default_next_action(stage)`.

Keep the existing stage-default wording now found in `MatterService.move_stage()`.

### Owner

Strip whitespace. Empty means `unassigned`. Exact case-insensitive `Themis` means `themis`. Any other non-empty value is `named_owner` and keeps its spelling. With no selected required item, Explore means actor `you`; every other stage means actor `none`. Never infer a named person from title, stage, matter owners, or prior chat in Python.

### Execution

Read `<matter path>/research/runs/*.md`. `queued` and `running` are active. Choose the newest active run by `created_at`, with path name as stable fallback. If no active run exists, use `not_running`. If a run cannot be parsed and there is no readable active run, use `unknown` with note `One or more research-run records could not be read.` Do not raise and do not report false `not_running` certainty.

### Due date

Use the selected required item’s `due_at`, else the matter `target_date`. Invalid dates do not count as overdue.

### Primary signal precedence

1. Closed → `none`, empty label.
2. Due before today → `overdue`, `Overdue`.
3. Queued/running → `agent_working`, `Themis is working`.
4. Unknown execution → `execution_unknown`, `Agent status unavailable`.
5. Selected item blocked → `blocked`, `Blocked`.
6. Unassigned → `needs_assignment`, `Needs assignment`.
7. Themis with no active run → `ready_for_themis`, `Ready for Themis`.
8. Named owner → `waiting_on_owner`, `Waiting on <saved owner>`.
9. Actor `you` → `waiting_on_you`, `Waiting on you`.
10. Otherwise → `none`, empty label.

## Parallel execution plan

Use one shared tree. Maximum three workers. Workers may not spawn agents. The coordinator reviews all work.

### Wave 1 — contract implementation

Dispatch one Sol low worker:

```yaml
id: state-core
outcome: tested MatterStateService implementing the frozen contract
depends_on: []
write:
  - backend/app/services/matter_state.py
  - backend/tests/test_matter_state.py
read:
  - backend/app/services/vault.py
  - backend/app/services/research_runs.py
  - backend/app/services/matters.py
  - backend/app/services/index.py
risk: normal
implementer: gpt-5.6-sol low
reviewer: coordinator
check: cd backend && .venv/bin/pytest -q tests/test_matter_state.py
```

Required service signature:

```python
class MatterStateService:
    def __init__(self, vault: VaultService): ...

    def resolve(
        self,
        matter: dict[str, Any],
        work_items: list[dict[str, Any]],
    ) -> dict[str, Any]: ...

    def default_next_action(self, stage: str) -> str: ...
```

The worker must add tests for selection, owner states, active/completed/malformed runs, blocked work, overdue precedence, closed state, and Explore fallback. No new dependency. Keep the service below 300 lines.

After the worker finishes, inspect its exact diff and run the check yourself. Mark Step 1 done only after acceptance.

### Wave 2 — three disjoint consumers

After Step 1 is accepted, dispatch these three Sol low workers in parallel.

#### Chunk `backend-integration`

```yaml
outcome: API matter list/detail, stage defaults, orientation, and agent context use MatterStateService
depends_on: [state-core]
write:
  - backend/app/runtime.py
  - backend/app/services/matters.py
  - backend/app/agents/context.py
  - backend/tests/test_matters.py
  - backend/tests/test_agents.py
read:
  - backend/app/services/matter_state.py
  - backend/app/routers/matters.py
  - backend/app/agents/runner.py
risk: normal
implementer: gpt-5.6-sol low
reviewer: coordinator
check: cd backend && .venv/bin/pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_agents.py tests/test_research.py
```

Required details:

- Instantiate the service before `MatterService` and `ContextBuilder`.
- Inject it explicitly into both constructors.
- Add `work_state` in `MatterService.list()` and `get()`.
- Use `work_state.next_action` for orientation.
- Remove the duplicate `next_work` selection.
- Use `default_next_action()` in `move_stage()`.
- Add exactly one JSON agent-context section named `# Current matter work state`.
- Leave mutation lifecycle logic unchanged.

#### Chunk `frontend-consumer`

```yaml
outcome: every current matter surface presents backend work_state and no stage implies live agent execution
depends_on: [state-core]
write:
  - frontend/lib/types.ts
  - frontend/lib/design.ts
  - frontend/lib/briefing.ts
  - frontend/app/page.tsx
  - frontend/app/workspace/page.tsx
  - frontend/app/matters/page.tsx
  - frontend/components/StageBoard.tsx
  - frontend/components/MattersTable.tsx
  - frontend/components/MatterWorkspace.tsx
  - frontend/components/MattersTimeline.tsx
read:
  - frontend/lib/api.ts
  - frontend/lib/matterActions.ts
  - frontend/app/globals.css
risk: normal
implementer: gpt-5.6-sol low
reviewer: coordinator
check: cd frontend && npm run typecheck && npm run build
```

Required details:

- Add exact TypeScript types and make `Matter.work_state` required.
- `matterNextAction`, `matterAwaitsJudgment`, `matterIsAgentWorking`, `matterNeedsAttention`, and `signalFor` consume `work_state`.
- TypeScript maps signal kinds to color only; it does not decide who is working.
- Delete `GENERIC_RESEARCH_ACTIONS` and `STAGE_ACTION_DETAILS`.
- Compare `signal.kind`, not signal label text.
- Cards and table show saved `next_owner`, `Unassigned` for actor `unassigned`, `You` for actor `you`, and `—` for actor `none`. Never label the matter legal owner as the next owner merely because no required work item exists.
- Table label is `Next owner`.
- Use five Matters summary filters: **Overdue**; **Waiting** (`waiting_on_owner`, `waiting_on_you`, `blocked`, `execution_unknown`); **With Themis** (queued/running execution or actor `themis`); **Needs assignment** (actor `unassigned`); and **Nothing owed** (`none`). Counts may overlap. Only a live run may display **Themis is working**.
- Add `blocked` and `assignment` kinds to Today after overdue and before judgment. Use the next action as title, `Open the matter` as action, and include blocked and unassigned counts in the subhead. Do not treat `waiting_on_owner` alone as lawyer attention.
- Count the Today agent footer from queued/running execution, not stages.
- Preserve the local chat busy spinner.

After build, run this absence check:

```bash
rg -n 'matter.status === "research" \|\| matter.status === "generate"|signal\.word === "Themis is working"|GENERIC_RESEARCH_ACTIONS|STAGE_ACTION_DETAILS' frontend
```

No matches is the expected result.

#### Chunk `agent-docs`

```yaml
outcome: explicit owner rule and documented work-state boundary
depends_on: [state-core]
write:
  - vault/00_System/Agents.md
  - vault/00_System/tools/create_work_item.md
  - docs/ARCHITECTURE.md
  - docs/API.md
  - docs/ACCEPTANCE_TESTS.md
read:
  - docs/PRD.md
  - backend/app/services/matter_state.py
risk: low
implementer: gpt-5.6-sol low
reviewer: coordinator
check: rg -n "Leave the owner empty|MatterStateService|work_state|Themis is working" vault/00_System/Agents.md vault/00_System/tools/create_work_item.md docs/ARCHITECTURE.md docs/API.md docs/ACCEPTANCE_TESTS.md
```

Required owner rule:

- Save a named owner only when the user or supplied source names one.
- Save `Themis` only when the user assigns the work to the agent or an agent run is created for it.
- Leave owner empty when unknown. Do not infer a person from stage or wording.
- Ask one owner question only when needed to move the matter. Otherwise create unassigned work and continue.

Keep `owner` optional. Document Markdown facts → Python projection → API → frontend and agent context. Add the acceptance demo but do not mark it complete.

### Wave 3 — coordinator integration and review

Do not delegate this wave.

1. Inspect all worker diffs and compare changed paths with their ownership.
2. Reject out-of-scope edits. Do not revert unrelated user changes.
3. Confirm `MatterStateService` is the only next-required-item and work-signal selector.
4. Confirm no durable `work_state`, new table, new dependency, workflow language, or general run system was added.
5. Confirm API and agent context use the same service.
6. Confirm malformed run state becomes `execution_unknown`.
7. Confirm approval, delivery, durable-decision, and closure code is unchanged except necessary constructor wiring or stage-default call.
8. Return material findings to the original worker when practical. Review corrections yourself.
9. Run all verification below.
10. Update the progress file immediately after each accepted step.

## Verification

### Focused backend

```bash
cd backend && .venv/bin/pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_agents.py tests/test_research.py
```

Expected: all selected tests pass.

### Complete backend

```bash
cd backend && .venv/bin/pytest -q
```

Acceptable result: no new failures beyond the three named baseline annotation failures. Report exact counts. Do not call the full suite passing if those failures remain.

### Frontend

```bash
cd frontend && npm run typecheck && npm run build
```

Expected: both pass.

### Graph

```bash
graphify update .
```

Dirty graph output is expected.

### Isolated browser acceptance

Follow the existing `docs/ACCEPTANCE_TESTS.md` isolation procedure:

1. Create a temporary directory with `mktemp -d`.
2. Copy `vault/` into it with `rsync -a --exclude '.counsel_os_cache.db'`.
3. Start a fresh backend with `VAULT_PATH` set to the temporary vault.
4. Run the frontend against that backend.
5. Create a matter with no target date through the current form, then move it to Research. Check its card, table, header, Today summary, and next owner.
6. Confirm no browser console error.
7. Stop both processes.
8. Confirm the repository-vault hash is unchanged before removing only the validated temporary directory.

Required visible result: the new Research-stage matter says **Waiting on Brian Harris**, not **Themis is working**. If mock research completes too quickly to observe a live signal, the backend running/completed integration test is sufficient proof for that transition. Do not add sleeps or fake delay.

## Do not do these things

- Do not create worktrees, clones, commits, pushes, deployments, or pull requests.
- Do not clean the dirty worktree.
- Do not edit or delete sample matter data to pass tests.
- Do not create a workflow engine, rules DSL, event store, queue, worker service, or database migration.
- Do not persist `work_state`.
- Do not add dependencies.
- Do not add owner assignment UI, automatic matching, participant directories, or an update-work-item tool.
- Do not infer owners in Python.
- Do not treat a workflow stage as proof that an agent is running.
- Do not read `ResearchRunService._tasks` for durable reporting.
- Do not change approval, delivery, durable decision, or closure semantics.
- Do not rename stages or broadly restyle the application.
- Do not weaken tests.
- Workers may not spawn agents.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named files and taking the smallest decision consistent with the frozen contract.

Do not stop for the three known annotation failures, existing unrelated dirty files, expected Graphify changes, or unrelated warnings.

Stop and report if:

- A named symbol or constructor materially differs from the supplied context.
- A worker needs another worker’s write-owned file before the wave boundary.
- The frozen contract cannot represent required current behavior.
- A focused check still fails after one bounded diagnosis and correction attempt.
- Progress requires deleting user data, adding a dependency, changing a product decision, or expanding scope.

## Parked work

Do not implement a general workflow engine, durable general agent runs, owner-assignment UI, automatic owner inference, custom-agent aliases, multiple simultaneous primary signals, SQLite research-run indexing, or restart retries. Each is intentionally deferred until real use proves it necessary.

## Final instruction

Work through the steps in dependency order. Use Sol low workers only for the named implementation chunks. Run every step’s verification and update `docs/matter-work-state.handoff-progress.md` immediately after each accepted step. The Sol medium coordinator must review the combined implementation and perform final verification. Follow the blocker policy. If a named file, symbol, signature, or baseline differs materially from this prompt, stop and report instead of adapting around it.
