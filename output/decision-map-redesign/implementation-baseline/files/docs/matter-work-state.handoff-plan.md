# Matter work state — handoff plan

## Decision

This change makes sense if it stays narrow. Counsel OS needs one authoritative **derived work-state projection**. It does not need a general workflow engine.

Markdown remains the durable source of truth. Python reads the matter, required work items, and saved research-run records and calculates one `work_state` object. The API returns that object. The frontend and the agent use it instead of independently guessing who acts next or whether Themis is working.

The existing `MatterService` remains responsible for writes, events, approval, delivery, closure, and stage changes. The new service owns only the rules that combine saved records into current work state.

## Thesis

A lawyer should not have to reconstruct who has the next move from a stage, several work items, and a chat spinner. One small Python service can derive that answer from the existing Markdown records and make the same answer available everywhere without introducing another durable store.

## Payoff moment

Open a matter that is in Research but has no active run and see **Waiting on Brian Harris** or **Needs assignment**, not **Themis is working**; when a saved research run is actually `queued` or `running`, the same matter reports **Themis is working**.

## Demo script

1. Start the app against an isolated copy of `vault/`.
2. Create a matter with no target date through the existing form. The form creates its first required work item for Brian Harris.
3. Move the new matter to Research. Confirm that it stays in the Research column but its signal says **Waiting on Brian Harris**. It must not say **Themis is working**.
4. Confirm that the matter card, table, matter header, Today summary, and agent context use the same `next_action` and work-state result.
5. In an automated integration test, add a saved research-run record with `state: running`, fetch the matter again, and confirm that `execution_state` is `running` and the signal is **Themis is working**.
6. Change that run to `completed`, fetch again, and confirm that the signal returns to the work-item owner or **Needs assignment**.
7. Delete and rebuild SQLite. Confirm that the same `work_state` is derived from Markdown.

## Current problem, verified in the repository

- `vault/00_System/workflows/product-counsel.md` declares stage names and descriptions.
- `backend/app/services/matters.py` chooses saved next-action text and performs mutations.
- `frontend/lib/design.ts` currently equates `research` and `generate` with **Themis is working**.
- `backend/app/services/research_runs.py` is the only code that records actual background research execution.
- `backend/app/agents/context.py` gives the model the matter record but no authoritative combined work-state summary.
- `owner` is optional. `backend/app/models/api.py::WorkItemCreate` and the `create_work_item` handler preserve an empty owner.

There is no single current state machine. This plan does not pretend otherwise. It creates one projection for the rules discussed above and leaves existing mutation boundaries intact.

## Authoritative boundary

### Markdown stores facts

- Matter stage, target date, legal owner, and saved fallback `next_action` remain in `matter.md`.
- Work-item title, status, priority, owner, `required`, and due date remain in individual work-item Markdown files.
- Research-run state remains in `research/runs/*.md`.
- Matter events remain append-only Markdown records.
- Workflow stage configuration remains in `vault/00_System/workflows/product-counsel.md`.

### Python derives meaning

Add `backend/app/services/matter_state.py` with one `MatterStateService`. It reads existing record values and returns the same `work_state` shape for matter lists, matter detail, and agent context.

### The frontend presents the result

TypeScript may map a signal kind to colors and layout. It must not infer agent execution from the matter stage or choose a different next work item.

### The agent proposes actions

The agent receives the derived state. Its Markdown standards tell it when owner information may be saved. Python tools still perform all mutations.

## Frozen `work_state` contract

Every matter returned by `MatterService.list()` and `MatterService.get()` must include:

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

Allowed `next_actor` values:

- `themis`
- `named_owner`
- `unassigned`
- `you`
- `none`

Allowed `execution_state` values:

- `queued`
- `running`
- `not_running`
- `unknown`

Allowed signal kinds:

- `overdue`
- `agent_working`
- `execution_unknown`
- `blocked`
- `needs_assignment`
- `ready_for_themis`
- `waiting_on_owner`
- `waiting_on_you`
- `none`

Do not add a second persisted copy of this object. It is calculated on read.

## Frozen derivation rules

### Select the next work item

1. Ignore work items whose status is `done` or `closed`, case-insensitively.
2. Consider only open work items whose `required` value is truthy.
3. Sort by priority rank `urgent`, `high`, `normal`, `low`. Treat an unknown or empty priority as `normal`.
4. Within one priority, sort dated items before undated items, then by `due_at`, then `created_at`, then title, then work-item ID. Normalize missing values to empty strings so sorting never raises.
5. Select the first item. If no required open item exists, `next_work_item_id` and `next_owner` are `null`. Set `next_actor` from the stage fallback rule below.

### Select the next action

1. If a next required work item exists, use its non-empty title.
2. Otherwise use the matter’s non-empty saved `next_action`.
3. Otherwise use the stage default from `MatterStateService.default_next_action(stage)`.

Move the existing stage-default mapping from the local dictionary inside `MatterService.move_stage()` into `MatterStateService`. Keep the existing wording to avoid unnecessary product changes.

### Select the next actor

1. Strip owner whitespace.
2. Empty owner means `unassigned` and `next_owner: null`.
3. Owner equal to `Themis`, case-insensitively, means `themis`.
4. Any other non-empty owner means `named_owner`. Preserve the saved spelling in `next_owner`.
5. When there is no selected required item and the matter stage is `explore`, use `you`.
6. When there is no selected required item and the stage is not `explore`, use `none`.
7. Do not infer a person from title text, matter stage, `legal_owner`, `business_owner`, or prior chat. The `explore` fallback is a workflow role, not a named-person inference.

### Select execution state

1. Read Markdown files under `<matter path>/research/runs/`.
2. A run with state `queued` or `running`, case-insensitively, is active.
3. If more than one active record exists, choose the newest by `created_at`, with path name as a stable fallback.
4. If no active record exists, use `not_running`.
5. If one or more run records cannot be read or have invalid frontmatter and no readable active run exists, use `unknown` and set `execution_note` to `One or more research-run records could not be read.`
6. A malformed record must not make the matters API fail and must not be reported as `not_running`.
7. Do not inspect the private in-memory `_tasks` dictionary. Durable reporting comes from Markdown.

### Select the due date

Use the next required work item’s `due_at` when present. Otherwise use the matter’s `target_date`. Invalid or empty values are displayed but do not count as overdue.

### Select the primary signal

Apply this exact order:

1. Closed matter → `none`, empty label.
2. Valid due date before today → `overdue`, label `Overdue`.
3. Execution `queued` or `running` → `agent_working`, label `Themis is working`.
4. Execution `unknown` → `execution_unknown`, label `Agent status unavailable`.
5. Selected work item status `blocked` → `blocked`, label `Blocked`.
6. Actor `unassigned` → `needs_assignment`, label `Needs assignment`.
7. Actor `themis` with no active run → `ready_for_themis`, label `Ready for Themis`.
8. Actor `named_owner` → `waiting_on_owner`, label `Waiting on <saved owner>`.
9. Actor `you` → `waiting_on_you`, label `Waiting on you`.
10. Otherwise → `none`, empty label.

The signal is one compact display verdict. The other fields remain available even when `overdue` has display priority.

## Worker routing

Use one shared working tree. Do not create worktrees or commits.

```yaml
parallel:
  optimize_for: balanced
  max_agents: 3
  workers:
    - name: sol-low-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: low
      max_concurrent: 3
  review:
    policy: coordinator-only
  coordinator:
    provider: codex
    model: gpt-5.6-sol
    effort: medium
```

The medium-effort coordinator owns decomposition, scope checks, contract resolution, integration, review, and final verification. Low-effort workers may not spawn agents or review their own work.

### Dependency waves

| Chunk | Wave | Depends on | Implementer | Reviewer |
|---|---:|---|---|---|
| `state-core` | 1 | none | Sol low | Sol medium coordinator |
| `backend-integration` | 2 | `state-core` accepted | Sol low | Sol medium coordinator |
| `frontend-consumer` | 2 | `state-core` accepted | Sol low | Sol medium coordinator |
| `agent-docs` | 2 | `state-core` accepted | Sol low | Sol medium coordinator |
| `integration-acceptance` | 3 | all accepted | Sol medium coordinator | self-review plus tests |

## Build

### Step 1 — `state-core`: add the derived work-state service

**Outcome:** One tested Python service implements the frozen contract without changing application wiring.

**Write ownership:**

- `backend/app/services/matter_state.py` — new
- `backend/tests/test_matter_state.py` — new

**Read context:**

- `backend/app/services/vault.py`
- `backend/app/services/research_runs.py`
- `backend/app/services/matters.py`
- `backend/app/services/index.py`
- `backend/app/utils/time.py`
- Representative `vault/03_Matters/*/matter.md`, work-item, and research-run files

**Required implementation:**

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

Keep the module focused and below 300 lines. Use small private helpers for normalization, sorting, due-date parsing, and active-run reading. Do not add Pydantic models, a rules framework, a database table, or a new dependency.

**Tests required:**

- Highest-priority required open item wins.
- Non-required work does not replace the stage or stored fallback action.
- `done` and `closed` items are ignored case-insensitively.
- Unknown priority behaves like `normal` and never crashes sorting.
- Blank owner produces `needs_assignment` and does not infer the matter legal owner.
- Named owner produces `waiting_on_owner` with preserved spelling.
- Owner `Themis` without a run produces `ready_for_themis`.
- `queued` and `running` records produce `agent_working`.
- A completed run does not produce `agent_working`.
- A malformed run record produces `execution_unknown` without raising.
- A blocked required item produces `blocked`.
- A matter or work-item due date before today produces `overdue` before other display signals.
- A closed matter produces `none`.
- Explore with no required open item produces `waiting_on_you`.

**Verification:**

```bash
cd backend && .venv/bin/pytest -q tests/test_matter_state.py
```

Expected: all tests in `test_matter_state.py` pass.

### Step 2 — `backend-integration`: expose the same state to API and agent

**Outcome:** Matter list, matter detail, stage changes, orientation, and agent context use `MatterStateService`.

**Depends on:** Step 1 accepted by the coordinator.

**Write ownership:**

- `backend/app/runtime.py`
- `backend/app/services/matters.py`
- `backend/app/agents/context.py`
- `backend/tests/test_matters.py`
- `backend/tests/test_agents.py`

**Read context:**

- `backend/app/services/matter_state.py`
- `backend/app/routers/matters.py`
- `backend/app/agents/runner.py`
- `backend/app/services/index.py`

**Required implementation:**

1. Construct `MatterStateService(self.vault)` in `AppContext` before `MatterService` and `ContextBuilder`.
2. Add it as an explicit constructor dependency of `MatterService` and `ContextBuilder`.
3. In `MatterService.list()`, keep existing work-item counts and attach `work_state` to every matter using the already grouped work items.
4. In `MatterService.get()`, resolve `work_state` from that matter and its indexed work items. Return it at the top level.
5. Set `orientation.next_action` from `work_state["next_action"]`. Do not select a second next item in `MatterService.get()`.
6. In `move_stage()`, remove the local `next_actions` dictionary and use `self.matter_state.default_next_action(stage)`.
7. In `ContextBuilder.build()`, add a `# Current matter work state` section containing JSON for the same resolved object. Use `json.dumps(..., ensure_ascii=False, default=str)`.
8. Do not load all work-item bodies into the prompt. The compact resolved state is enough for this slice.
9. Keep approval, delivery, decision, and closure mutations in `MatterService`. Do not move or rewrite those flows.

**Tests required:**

- `MatterService.list()` and `get()` return equal `work_state` for the same matter.
- A Research-stage sample matter with no active run is not `agent_working`.
- Adding a running research-run Markdown record changes both list and detail to `agent_working` without changing `matter.md`.
- Changing that record to completed restores the owner-derived signal.
- `orientation.next_action` equals `work_state.next_action`.
- A stage move saves the same default next action returned by `MatterStateService`.
- Built agent context contains exactly one `# Current matter work state` section and its signal label.
- Existing tool and decision-integrity tests remain unchanged.

**Verification:**

```bash
cd backend && .venv/bin/pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_agents.py tests/test_research.py
```

Expected: all selected tests pass.

### Step 3 — `frontend-consumer`: remove frontend work-state inference

**Outcome:** All current matter surfaces render the backend’s `work_state`. No frontend helper equates a stage with agent execution.

**Depends on:** Step 1 accepted. Use the frozen contract exactly; do not wait for Step 2 file edits.

**Write ownership:**

- `frontend/lib/types.ts`
- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MattersTimeline.tsx`

**Read context:**

- `frontend/lib/api.ts`
- `frontend/lib/matterActions.ts`
- Existing CSS classes in `frontend/app/globals.css`

**Required implementation:**

1. Add exact TypeScript types for `MatterWorkState`, `MatterSignalKind`, `NextActor`, and `ExecutionState`. Make `Matter.work_state` required because the backend will always return it.
2. Change `matterNextAction(matter)` to return `matter.work_state.next_action`, with `matter.next_action` only as a defensive fallback for a stale API response.
3. Change `matterAwaitsJudgment`, `matterIsAgentWorking`, and `matterNeedsAttention` to use `work_state`, not `matter.status`.
4. Change `signalFor()` to use `work_state.signal.kind` and the backend-provided label. TypeScript may choose colors and backgrounds only.
5. Delete `GENERIC_RESEARCH_ACTIONS` and `STAGE_ACTION_DETAILS` from `frontend/lib/design.ts`.
6. Replace every comparison of `signal.word` to a business label with a comparison of `signal.kind`.
7. Matter cards and the table must show the next-task owner from `work_state`: saved `next_owner`, `Unassigned` for actor `unassigned`, `You` for actor `you`, and `—` for actor `none`. Do not fall back to the matter’s legal owner and call that the next owner.
8. Rename the table column to `Next owner` when it is shown. Sort that column by the same displayed value.
9. Use five Matters summary filters: **Overdue**; **Waiting** (`waiting_on_owner`, `waiting_on_you`, `blocked`, or `execution_unknown`); **With Themis** (`execution_state` queued/running or actor `themis`); **Needs assignment** (actor `unassigned`); and **Nothing owed** (`none`). These counts may overlap when, for example, active agent work is also overdue. Only individual `agent_working` signals may say **Themis is working**.
10. Add **Needs assignment**, **Blocked**, and **Agent status unavailable** to attention treatment using existing colors. In `buildBriefing()`, add `blocked` and `assignment` kinds after overdue and before judgment; use the matter next action as the title and `Open the matter` as the action. Add blocked and unassigned counts to the subhead. Do not treat `waiting_on_owner` alone as a lawyer-attention item.
11. Update the Today footer’s agent count to count only `execution_state` values `queued` and `running`. Do not count all Research and Generate stages.
12. Keep the local chat `busy` spinner. It describes the current HTTP request and is not the durable matter signal.
13. Keep `isOverdue()` only for date display helpers if needed. It must not override `work_state.signal`.

**Verification:**

```bash
cd frontend && npm run typecheck && npm run build
```

Expected: TypeScript passes and the production build completes.

Also run:

```bash
rg -n 'matter.status === "research" \|\| matter.status === "generate"|signal\.word === "Themis is working"|GENERIC_RESEARCH_ACTIONS|STAGE_ACTION_DETAILS' frontend
```

Expected: no matches. A non-zero `rg` exit status is success for this absence check.

### Step 4 — `agent-docs`: state the owner rule and architecture boundary

**Outcome:** The agent does not invent owners, and maintainers have one documented place to understand derived work state.

**Depends on:** Step 1 accepted.

**Write ownership:**

- `vault/00_System/Agents.md`
- `vault/00_System/tools/create_work_item.md`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/ACCEPTANCE_TESTS.md`

**Required implementation:**

1. Add this owner rule to `Agents.md` in direct language:
   - Use an explicitly named owner when the user or a supplied source names one.
   - Use `Themis` only when the user assigns the work to the agent or an agent run is being created for it.
   - Leave the owner empty when it is unknown. Do not infer a person from the matter stage or task wording.
   - Ask one owner question only when ownership is needed to move the matter. Otherwise create useful unassigned work and continue.
2. Add equivalent guidance to the `owner` property description in `create_work_item.md`. Keep `owner` optional.
3. Update `docs/ARCHITECTURE.md` with the boundary: Markdown facts → `MatterStateService` projection → API → frontend and agent context. Explain that `MatterService` still owns mutations.
4. Update `docs/API.md` with the frozen `work_state` response shape and state that it appears on matter list and detail responses.
5. Add a focused acceptance section to `docs/ACCEPTANCE_TESTS.md` using the demo script above. Do not mark it complete before the coordinator performs the browser check.
6. Do not modify `docs/PRD.md`; its Markdown-source and next-required-work requirements already support this design.

**Verification:**

```bash
rg -n "Leave the owner empty|MatterStateService|work_state|Themis is working" vault/00_System/Agents.md vault/00_System/tools/create_work_item.md docs/ARCHITECTURE.md docs/API.md docs/ACCEPTANCE_TESTS.md
```

Expected: each named file has at least one relevant match. This is a documentation check; behavioral proof remains in Steps 1, 2, 3, and 5.

### Step 5 — `integration-acceptance`: medium coordinator review and proof

**Outcome:** The combined application has one honest work-state projection with no new regression.

**Owner:** Sol medium coordinator. Do not delegate final integration or final review.

**Required review:**

1. Compare every changed path to the worker scopes and the pre-existing dirty worktree. Do not attribute or revert unrelated changes.
2. Inspect the combined diff. Confirm there is no durable `work_state` copy, no new table, no workflow language, and no frontend inference of agent execution from stage.
3. Confirm `MatterStateService` is the only place that selects the next required item and primary work signal.
4. Confirm the API and agent context call the same service.
5. Confirm malformed run records degrade to `execution_unknown` instead of false certainty or an endpoint failure.
6. Confirm approval, delivery, durable decisions, and closure remain separate and unchanged.
7. Run focused tests, the complete backend suite, frontend checks, and graph update.
8. Perform the isolated browser demo. Preserve repository-vault hashes before and after.

**Focused verification:**

```bash
cd backend && .venv/bin/pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_agents.py tests/test_research.py
```

Expected: all selected tests pass.

**Complete backend verification:**

```bash
cd backend && .venv/bin/pytest -q
```

Baseline on 2026-08-28: `108 passed, 3 failed`. The three known failures are all in `tests/test_annotations.py` and are caused by a pre-existing saved Apex annotation in the repository vault:

- `test_annotations_round_trip`
- `test_annotation_answer_survives_a_hostile_model_reply`
- `test_blank_annotation_answer_is_not_stored`

The implementation must introduce no additional failure. Do not fix or delete the sample annotation as part of this task.

**Frontend verification:**

```bash
cd frontend && npm run typecheck && npm run build
```

Baseline: both commands pass.

**Graph update:**

```bash
graphify update .
```

Dirty `graphify-out/` files are expected. Do not clean or revert them.

**Isolated browser acceptance:**

Follow `docs/ACCEPTANCE_TESTS.md` under **Isolated browser testing**. Use a temporary vault copy. Verify at minimum:

- A new no-target-date matter is moved to Research and says **Waiting on Brian Harris**, not **Themis is working**.
- Matter card, table, header, and Today use the same next action.
- The displayed next owner comes from the selected required work item.
- No browser console error occurs.
- The repository vault hash is unchanged.

If a genuine live run is too fast to observe in mock mode, rely on the backend running/completed integration test for that transition. Do not add sleeps or fake production delays.

## Guardrails

- Preserve all pre-existing worktree changes.
- Do not edit or delete sample matter records to make tests pass.
- Do not create a workflow engine, rule language, reducer framework, event store, queue, broker, worker process, or database migration.
- Do not persist derived `work_state` in Markdown or SQLite.
- Do not add authentication, tenancy, permissions, embeddings, or new dependencies.
- Do not add owner matching, automatic assignment, participant directories, or an assignment UI in this checkpoint.
- Do not infer a named owner from conversation text in Python. The agent may use explicit statements from its supplied context.
- Do not treat a stage as proof that an agent is running.
- Do not inspect `ResearchRunService._tasks` for durable state.
- Do not change approval, delivery, decision, or closure behavior.
- Do not rename stages or broadly restyle pages.
- Do not commit, push, deploy, or create a pull request.
- Do not weaken or delete tests.
- Workers must not spawn subagents.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and using the smallest decision consistent with this plan.

Do not stop for:

- The three known annotation failures.
- Existing dirty files outside the assigned scope.
- Graphify-generated changes after the required update.
- Warnings that do not change the focused verification result.

Stop and report when:

- A named file, symbol, or constructor differs materially from this plan.
- A worker would need to edit another worker’s file before the wave boundary.
- The frozen `work_state` contract cannot represent a required current behavior.
- Focused verification fails after one bounded diagnosis and correction attempt.
- Proceeding requires deleting user data, changing a product decision, adding a dependency, or expanding scope.

## Parked backlog

- **General workflow engine.** Build only after more than one workflow needs materially different conditional transition rules that cannot fit focused Python services.
- **Durable general agent-run records.** Add only when drafting or other agent work actually continues outside one HTTP request and must survive reloads.
- **Owner-assignment UI and update tool.** Add after users repeatedly encounter unassigned work and need assignment without opening Markdown or using chat.
- **Automatic owner inference.** Add only after explicit owner capture is measurably too slow and there is labeled evidence for a safe inference rule.
- **Custom-agent ownership aliases.** Add when work items are assigned to multiple configured agents, not only `Themis`.
- **Multiple simultaneous activity signals.** Add when users need to see agent execution and a human blocker at the same time. The MVP keeps one primary signal and exposes the other fields in `work_state`.
- **Indexing research runs in SQLite.** Add only if scanning the small run folders becomes a measured performance problem.
- **Automatic retries or resume after restart.** Add only when interrupted local research is a demonstrated usability problem.
