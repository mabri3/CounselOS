# Prompt for the Sol Medium orchestrator

You are the implementation orchestrator for Counsel OS in:

`/Users/bharris/Programs/counsel-os-mvp`

Use `gpt-5.6-sol` with `medium` effort for your own work. Implement the Matter Workflow Reliability build. Coordinate dependency-safe `gpt-5.6-sol` workers with `low` effort in one shared working tree. After implementation, use a separate read-only `gpt-5.6-sol` reviewer with `medium` effort.

Your goal is to make Markdown, not chat prose, the authority for matter state. The LLM can interpret, analyze, draft, and recommend. Deterministic services must choose user-facing file paths, complete one selected work item, approve one final artifact, record outside delivery, and close a matter.

Do not stop after planning. Execute the work, verify it, obtain the independent review, correct material findings, and report the verified result.

## Resume protocol

Use this progress file:

`/Users/bharris/Programs/counsel-os-mvp/docs/matter-workflow-reliability.handoff-progress.md`

Before starting, read it. Do not redo a step marked `done`. Begin at the first pending step.

After each step:

1. Run that step's verification.
2. Immediately change only its progress line to `- [x] Step N: <title> — done`.
3. If verification fails, write `— FAILED: <short reason>` on that line and follow the blocker policy.
4. Do not batch progress updates at the end.

If a step is marked done but its verification now fails, stop and report. Do not reapply edits without diagnosis.

## Required repository instructions

Before editing, read these files completely:

- `/Users/bharris/Programs/counsel-os-mvp/AGENTS.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/PRD.md`
- `/Users/bharris/Programs/counsel-os-mvp/CODEX_HANDOFF.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/DESIGN_LANGUAGE.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/MATTER_WORKFLOW_RELIABILITY_BUILD_PLAN.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/matter-workflow-reliability.handoff-plan.md`
- the progress file above

Follow the project rules:

- Markdown is the source of truth. SQLite is a disposable index.
- Keep the app runnable after each accepted wave.
- Keep recommendations separate from recorded decisions.
- Approval, delivery, durable decisions, and closure are separate actions.
- Deliver useful output when optional research or parsing fails.
- Do not add legal-answer theater, verifier agents, confidence gates, or refusal gates.
- All file writes must stay inside `VAULT_PATH`.
- Use existing semantic colors and state words.
- Run `graphify update .` after application code changes.
- Preserve every pre-existing user change.

## Fixed product decisions

These decisions are final. Do not ask workers to choose another architecture.

1. Keep `matter.md` as the single authority for approval, delivery, and closure state.
2. Use the existing append-only Markdown event format for audit. Use one stable event path for each first successful lifecycle action.
3. Do not create separate approval, delivery, or closure receipt files.
4. Delivery means the user confirms that delivery occurred outside Counsel OS. Do not send email, Slack, portal messages, or other outbound data.
5. Keep flexible manual stage movement. The general stage route cannot move directly to Closed.
6. Keep the highest-priority open required work item as the primary next action.
7. Keep the stage or lifecycle action visible as a separate control. An open item must not hide it.
8. Complete work by exact work-item ID. Never complete all items that share a title or type.
9. A matching approval work item can complete only after approval succeeds and only by exact ID.
10. Finalization is idempotent for unchanged draft content. Use a content hash or stored content version. Changed draft content can create another immutable final.
11. Add only three matter-relative folder settings:
    - `matter_files.source_documents_dir`, default `documents`
    - `matter_files.draft_outputs_dir`, default `work-product/draft`
    - `matter_files.final_outputs_dir`, default `work-product/final`
12. A setting ships only if a writer uses it in this build.
13. Do not migrate existing files. Existing stored paths remain readable and valid.
14. Keep `recommendations.md`, `research/`, `decisions/`, `work-items/`, and `events/` fixed.
15. Keep generic `write_markdown` for ordinary notes. Add typed `save_work_product` for user-facing recommendations, drafts, and response work.
16. Show recorded-action UI only from persisted state and successful structured tool results.
17. If the user requested a mutation and none was recorded, show `No workspace state change recorded`.
18. Do not show that line on ordinary advice or drafting turns.
19. Keep existing synchronous research and polling. Do not add a queue, streaming, or a job framework.
20. Exclude server downtime, frontend/backend service outages, browser-driver failures, selector failures, and UX test-script syntax failures.

## Current code facts

Use these facts to locate the current seams. Verify them before editing. Stop if they differ materially.

### Lifecycle API

`backend/app/models/api.py` currently has:

```python
MatterAction = Literal["approve_response", "mark_as_sent", "close_matter"]

class MatterActionRequest(BaseModel):
    action: MatterAction
```

`backend/app/routers/matters.py` currently calls:

```python
return context.matters.perform_action(matter_id, payload.action)
```

`backend/app/services/matters.py::perform_action()` currently stores only timestamps on `matter.md`, completes every open approval item by type, creates a new random event, and treats retries as errors. `complete_open_work_items()` also completes all matches. Replace these behaviors with exact-ID, retry-safe behavior. Do not add a new lifecycle subsystem.

### Agent permission pattern

`backend/app/agents/runner.py::run()` currently computes:

```python
decision_recording_allowed = _explicit_decision_recording_requested(request.message)
```

It removes `record_decision` from provider tools when permission is absent and rejects an unexpected attempted call. Reuse this deterministic pattern for `approve_response`, `mark_response_sent`, and `close_matter`. Do not use another LLM to infer permission.

### Work products

`backend/app/services/work_product.py` currently hard-codes:

```python
.../work-product/draft/<name>.md
.../work-product/final/<name>-<new-id>.md
```

Every finalize call creates a new final. Introduce `MatterPathPolicy` and unchanged-content retry behavior. Old draft and final paths must remain valid.

### Settings

`backend/app/services/settings.py::SettingsService` stores one flat `values` map in:

```python
PATH = "00_System/settings.md"
```

Keep that format. Add validation only for the three new path keys. Do not add a second configuration system.

### Generic write tool

`backend/app/tools/handlers.py::write_markdown()` currently chooses `<matter>/drafts/<name>.md` when no path is supplied. Do not use that behavior for new user-facing work products. Add `save_work_product` and route it through `WorkProductService`.

### Research duplicate

`backend/app/services/research.py::run()` currently calls:

```python
self.matters.create_work_item(
    WorkItemCreate(title="Review the first-pass research packet", ...)
)
```

on every run. Reuse one open research-review item. Create a new one only if the earlier item was completed before the new run.

### Company interview bug

`backend/app/services/company_interview.py::draft()` currently does:

```python
if answer and question_id in PROFILE_FIELDS:
    direct_updates[question_id] = answer
```

This can store `leave blank` as the Website value. Add a dedicated optional `website_url` request field and deterministic blank-intent handling. Keep the safe public HTTPS fetcher.

### Matter action visibility

`frontend/lib/matterBrief.ts::controlIdForCurrentWork()` currently returns `open_work_item` for most open work items. `frontend/components/MatterWorkspace.tsx` then renders only that current control. Change the data model and UI so required work remains primary while the stage action stays separately visible.

### Current verification state

The following frontend command passed before this handoff:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
npm run build
```

The Node module-type warning is acceptable. `All checks passed.`, successful typecheck, and successful build are required.

This focused backend command produced 56 passes and one existing failure:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_settings.py tests/test_ingestion.py tests/test_work_product.py tests/test_research.py tests/test_company_interview.py tests/test_matters.py tests/test_agents.py
```

The failure was:

`tests/test_agents.py::test_agent_decision_check_does_not_change_decision_files`

The `audit_decisions` tool returned status `error`. Reproduce the baseline before assigning cause. Do not hide it. Do not broaden the build merely to repair an unrelated existing failure.

## Parallel policy

Use this exact routing:

```yaml
parallel:
  optimize_for: quality
  max_agents: 3
  implementers:
    name: sol-low-workers
    role: implementer
    provider: codex
    model: gpt-5.6-sol
    effort: low
    max_concurrent: 3
  reviewers:
    name: sol-medium-review
    role: reviewer
    provider: codex
    model: gpt-5.6-sol
    effort: medium
    max_concurrent: 1
```

There are at most three active workers excluding you. Use fewer when the wave has fewer independent chunks. Do not invent work to fill capacity. The named reviewer pool runs once as a combined read-only review after implementation. Do not run per-chunk dedicated reviews.

All workers edit the same working tree. Exact write ownership is mandatory. Workers can read other files but cannot edit them. Workers may not spawn agents. A worker cannot review its own work. Do not start dependent work until its prerequisite wave has stopped, passed focused checks, and been accepted.

Before dispatching a worker, send it:

- repository path;
- overall outcome;
- chunk outcome;
- exact write and read scope;
- required behavior;
- focused verification;
- known dependencies;
- a ban on out-of-scope edits, nested agents, commits, deployment, destructive operations, and undoing user changes;
- required return fields: summary, exact files changed, checks actually run, uncertainties, and risks.

## Execution steps

### Step 0 — Read, inspect, and freeze ownership

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "Where do matter lifecycle actions, work-item completion, artifact paths, settings, research review work, and company website interview data flow?" --budget 6000
```

Record the baseline changed-file list. The workspace contains experiment matters and unrelated changed runtime records. Preserve them. Do not clean the tree.

Confirm that no two planned chunks share a write path. Report the normalized waves and routing before dispatch.

### Step 1 — Freeze shared contracts yourself

You alone own:

- `backend/app/models/api.py`
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`

Add the minimum request and response shapes for:

- lifecycle actions with explicit artifact path, optional exact work-item ID, and optional note;
- completing one selected work item;
- structured action results with current matter, changed paths, and stable event path;
- company interview `website_url` input and website-use status;
- the three flat settings keys.

Keep the existing action names. Do not add generated schemas or redesign the client.

Verify:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matters.py tests/test_company_interview.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

### Step 2 — Dispatch Wave 1A in parallel

#### Chunk B: canonical artifacts

Write scope:

- `backend/app/services/matter_paths.py`
- `backend/app/services/settings.py`
- `backend/app/routers/settings.py`
- `backend/app/services/ingestion.py`
- `backend/app/services/work_product.py`
- `backend/app/runtime.py`
- `backend/tests/test_settings.py`
- `backend/tests/test_ingestion.py`
- `backend/tests/test_work_product.py`
- `backend/tests/test_matter_paths.py`

Required behavior:

- Add `MatterPathPolicy` that resolves only under one matter.
- Reject absolute paths, empty values, `.`, `..`, traversal, backslashes, protected records, paths outside the matter, and duplicate configured folders.
- Ingestion consumes the source setting.
- Draft creation consumes the draft setting.
- Finalization consumes the final setting.
- Existing old paths remain valid.
- Finalizing unchanged content returns the existing final path and ID.
- Changed content creates a new immutable final.
- Use a content hash or stored content version in final metadata.
- Add hostile path-input tests.
- Do not migrate files, add templates, or accept host paths.

Worker check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_settings.py tests/test_ingestion.py tests/test_work_product.py tests/test_matter_paths.py
```

#### Chunk C: focused service repairs

Write scope:

- `backend/app/services/research.py`
- `backend/app/services/company_interview.py`
- `backend/tests/test_research.py`
- `backend/tests/test_company_interview.py`

Required behavior:

- Reuse and update one open research-review item.
- Create a new review item only after the previous item was completed and new research ran.
- Link the current packet or run.
- Preserve useful research output when later steps fail.
- Use the dedicated optional website field.
- Treat blank, `leave blank`, `none`, and `no website` as absent.
- Fetch only valid public HTTPS through the current safe fetcher.
- Return `website_used=true` only when website content was used.
- Continue with a warning for blocked, private, malformed, or unreadable URLs.
- Add malformed LLM-output, missing-key, and blocked-URL tests.
- Do not add discovery, crawling, verification gates, or multi-page fetch.

Worker check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_research.py tests/test_company_interview.py
```

### Step 3 — Gate Wave 1A

Wait for both workers. Compare actual changed paths to ownership and the baseline. Reject or revert no user work; resolve ownership violations deliberately. Inspect every worker diff. Run both focused commands yourself.

Freeze the implemented `MatterPathPolicy` and `WorkProductService` interfaces. Do not start lifecycle work while either Wave 1A worker is active.

### Step 4 — Dispatch Wave 1B

Run one Sol Low lifecycle worker.

Write scope:

- `backend/app/services/matters.py`
- `backend/app/routers/matters.py`
- `backend/app/agents/runner.py`
- `backend/app/tools/handlers.py`
- `vault/00_System/tools/save_work_product.md`
- `vault/00_System/tools/complete_work_item.md`
- `vault/00_System/tools/approve_response.md`
- `vault/00_System/tools/mark_response_sent.md`
- `vault/00_System/tools/close_matter.md`
- `vault/00_System/agents/counsel-copilot.md`
- `backend/tests/test_matter_lifecycle.py`
- `backend/tests/test_matter_action_api.py`
- `backend/tests/test_matter_action_tools.py`
- `backend/tests/test_agent_action_permissions.py`

Required behavior:

- Add exact-ID completion and retry safety.
- Keep `matter.md` authoritative.
- Approval requires Respond and one immutable final owned by the matter. Store artifact path and ID, actor, first approval time, and stable event path.
- Reapproval of the same final returns stored state. A different final conflicts clearly.
- Delivery requires approval and uses that same artifact. Store actor, first delivery time, `outside_counsel_os`, optional note, and stable event path.
- Closure requires delivery and no open required work. Return the unfinished item titles on conflict.
- Retry returns stored state and repairs a missing named event without changing the first action time.
- Direct stage movement cannot enter Closed. Other stage movement remains flexible.
- Combine approval with one approval work item only when the exact ID is passed. Update the item only after approval succeeds.
- Add all five tools. Tool handlers call services and do not duplicate rules.
- `save_work_product` accepts matter ID, title, content, and kind. It does not accept a raw path.
- `recommendation` writes fixed `recommendations.md`.
- `draft` and `response` use the configured draft folder.
- Only finalization can create an immutable final.
- Add deterministic current-message permission gates in `AgentRunner`.
- A drafting request exposes none of the gated lifecycle tools.
- An approval request exposes only `approve_response` among gated lifecycle tools. Safe read, search, and drafting tools remain.
- Delivery and closure each require their own explicit wording.
- Approval or delivery never records a durable decision.
- Preserve useful model output when a tool fails.

Worker check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matter_lifecycle.py tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_agent_action_permissions.py tests/test_matters.py tests/test_work_product.py
```

### Step 5 — Gate the backend

Wait for the worker. Inspect actual ownership and the diff. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_settings.py tests/test_ingestion.py tests/test_work_product.py tests/test_research.py tests/test_company_interview.py tests/test_matters.py tests/test_matter_lifecycle.py tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_agent_action_permissions.py
.venv/bin/python -m pytest
```

All new focused tests must pass. The full suite must pass except a proven unchanged baseline failure. Never describe an unproved failure as pre-existing.

Reject the backend if:

- lifecycle success exists without canonical `matter.md` fields;
- a retry changes the first timestamp or adds an event;
- a path can escape a matter;
- a setting has no consumer;
- old artifacts become invalid;
- a research failure discards useful output;
- approval creates a durable decision;
- a model receives a gated lifecycle tool without exact current-message permission.

### Step 6 — Dispatch Wave 2 in parallel

#### Chunk D: matter workspace reliability

Write scope:

- `frontend/lib/matterBrief.ts`
- `frontend/lib/matterActions.ts`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/app/globals.css`
- `frontend/scripts/check-matter-brief.ts`

Required behavior:

- Required work remains the primary next action.
- The stage or lifecycle action remains separately visible.
- A matching approval control passes an exact work-item ID.
- Add a compact Matter artifacts block for recommendation, latest research, current draft, and final or approved response.
- Open only known user-facing Markdown artifacts.
- Never auto-open events, conversations, work items, or matter metadata.
- Render success from persisted state and successful structured tool results only.
- On a requested or attempted mutation with no success, show `No workspace state change recorded`.
- Do not show that line on ordinary advice or drafting.
- Add honest local elapsed copy. Do not invent percentages, tool phases, or ETAs.
- Prevent duplicate submission while keeping safe navigation and the open editor usable.
- Keep the existing editor and raw Markdown mode.
- Use semantic design tokens. Color is not the only state signal.

Worker check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

The Node module-type warning is acceptable. `All checks passed.` is required.

#### Chunk E: settings and company UI

Write scope:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/components/CompanyInterview.tsx`

Required behavior:

- Add a Files and outputs settings section with the three real keys and defaults.
- Explain that values are relative to each matter and remain inside the vault.
- Use existing generic settings rendering where possible.
- Save and reload through the current whole-settings API.
- Show one direct validation error. Invalid input must not change saved values.
- Add a dedicated optional public HTTPS website field.
- Show `Website read` only when the response says `website_used=true`.
- Show a clear warning for blocked or unreadable URLs and continue.
- Do not imply that website facts were verified.
- Do not add a form framework, crawler, domain discovery, or source gate.

Worker check: inspect the exact owned diff. Browser behavior is verified by you after both frontend workers stop because there is no component-test runner.

Do not run frontend build while either frontend worker is active.

### Step 7 — Integrate and verify

After both workers stop, inspect ownership. You own only integration fixes in:

- `backend/app/models/api.py`
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`
- `docs/ACCEPTANCE_TESTS.md`

Update Acceptance Tests with cases for:

- valid and invalid file settings;
- unchanged-content and changed-content finalization;
- current-message lifecycle permission;
- one selected work-item completion;
- required-work priority plus visible lifecycle action;
- research review-item reuse;
- company blank website input;
- website-used status;
- recorded-action state versus false chat prose;
- honest elapsed progress.

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
npm run build
cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
git diff --check
```

### Step 8 — Run the independent review

Start one new read-only Sol Medium reviewer after all implementation workers stop. It cannot be an implementer from an earlier wave.

Give it:

- this prompt;
- the source build plan;
- the baseline status;
- the combined diff;
- focused and full verification output;
- the exact acceptance requirements.

Require concrete findings ordered by severity, with file and line references and reproduction steps when practical. It must check:

- `matter.md` remains the single lifecycle authority;
- explicit user permission gates cannot be bypassed;
- retries are idempotent;
- stable events cannot duplicate;
- configured paths cannot escape a matter;
- old artifact paths remain valid;
- UI success cannot come from chat prose;
- hostile external output is covered;
- work completion is exact-ID only;
- no worker edited outside ownership;
- no new machinery exceeds the MVP need.

### Step 9 — Correct findings

Send each material finding to the original owner if that worker is still suitable. Serialize corrections that touch shared files. Review every correction yourself. Rerun the affected focused checks.

Run a second dedicated review only if a correction changes architecture, lifecycle integrity, or security behavior.

### Acceptance check — isolated vault browser workflow

Use an isolated copy of the vault. Do not test against or clean the user's real experiment matters.

Complete this workflow:

1. Set and reload all three Files and outputs values. Confirm `00_System/settings.md` stores them.
2. Upload a file. Confirm the configured source folder is used.
3. Ask Themis to create a work product. Confirm the configured draft folder and exact Open artifact action.
4. Edit and save in the existing editor.
5. Finalize the unchanged draft twice. Confirm one final path and ID.
6. Edit the draft and finalize again. Confirm a new immutable final.
7. Keep a required work item open. Confirm it remains primary and the lifecycle action stays visible.
8. Complete one item. Confirm siblings remain open.
9. Approve one final. Confirm `matter.md` stores its path and ID, actor, time, and event path.
10. Reload. Confirm approval persists.
11. Mark sent. Confirm `matter.md` uses the same artifact and records `outside_counsel_os`.
12. Attempt closure with required work. Confirm failure names unfinished items.
13. Complete remaining work and close. Confirm closure persists after reload.
14. Retry completion, approval, delivery, and closure. Confirm first timestamps and event counts do not change.
15. Ask for drafting without approval. Confirm gated lifecycle tools are not exposed.
16. Force or mock false mutation prose without a successful mutation tool. Confirm the UI shows `No workspace state change recorded` and state does not change.
17. Run research twice before review. Confirm one open review item.
18. Complete that review item, run new research, and confirm one new review item.
19. Enter `leave blank` for company website. Confirm Website remains blank.
20. Enter a public HTTPS URL. Confirm Website read appears only when the backend used it.
21. Use a blocked or unreadable URL. Confirm a warning appears and the interview continues.
22. Start a slow request. Confirm honest elapsed text, no fake percentage, no duplicate submit, and usable safe navigation.

Then rerun the full backend suite, frontend check, typecheck, build, `graphify update .`, and `git diff --check`.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest result consistent with these fixed decisions.

Stop and report if:

- required access, dependency, or tool is unavailable;
- a named file, symbol, or signature differs materially from the supplied context;
- repository instructions conflict with this prompt;
- a focused verification still fails after focused diagnosis;
- proceeding requires an irreversible action or a new user product decision;
- shared-tree changes cannot be attributed safely.

Do not stop for harmless warnings, unrelated pre-existing failures, or ambiguity that the named code resolves. Never label a failure pre-existing without reproducing it from the baseline.

## Do not

- Do not create worktrees, clones, snapshots, temporary commits, or patch transport.
- Do not commit, push, deploy, or create a pull request.
- Do not delete or reset user changes or experiment data.
- Do not let workers edit overlapping files.
- Do not let workers spawn agents.
- Do not let an implementer review its own work.
- Do not add a workflow engine, rigid state machine, queue, streaming, new database, auth, cloud tenancy, or outbound delivery.
- Do not add lifecycle receipt files.
- Do not add arbitrary host paths, templates, variables, or automatic file migration.
- Do not add a verifier agent, multi-agent vote, legal-confidence gate, or refusal gate.
- Do not add a second editor, browser-automation cursor repair, website crawler, or source-verification gate.
- Do not treat a recommendation, approval, or delivery as a durable decision.
- Do not infer persisted success from model prose.
- Do not run shared frontend build commands while frontend workers are active.
- Do not reformat unrelated files.

## Final report

Lead with completion status. Then report:

- verified user-visible behavior;
- actual worker and reviewer routing;
- exact files changed by each chunk;
- integration decisions;
- checks actually run and their results;
- whether the known baseline backend failure remained, disappeared, or changed;
- reviewer findings and corrections;
- any remaining risks or skipped acceptance steps.

Work through the steps in order. Run each verification. Update the progress file immediately after each successful step. Follow the blocker policy. If a named file, symbol, or signature differs materially from this prompt, stop and report instead of adapting around it.
