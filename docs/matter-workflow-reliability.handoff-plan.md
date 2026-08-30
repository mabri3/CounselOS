# Handoff plan — Matter workflow reliability

## Goal

Implement [MATTER_WORKFLOW_RELIABILITY_BUILD_PLAN.md](/Users/bharris/Programs/counsel-os-mvp/docs/MATTER_WORKFLOW_RELIABILITY_BUILD_PLAN.md) in one shared working tree. Keep `matter.md` as the canonical lifecycle record. Use deterministic services for file placement, selected work completion, approval, delivery recording, and closure. Use Sol Low implementers, one Sol Medium coordinator, and one separate read-only Sol Medium reviewer.

## Fixed decisions

- Markdown remains the source of truth. SQLite remains a disposable index.
- Delivery records that the user delivered the response outside Counsel OS. Do not build outbound delivery.
- The LLM drafts and analyzes. Deterministic code owns paths and lifecycle changes.
- Keep flexible stage movement. Only direct closure remains blocked.
- Keep the highest-priority required work item as the primary next action. Keep the stage or lifecycle action separately visible.
- Store approval, delivery, and closure fields on `matter.md`. Write one stable append-only event for each first successful action. Do not add receipt files.
- Add only three matter-relative folder settings: source documents, draft outputs, and final outputs.
- A setting must control a real writer in this build.
- Do not migrate old files. Existing stored paths remain valid.
- Finalization is idempotent for unchanged draft content. Changed content can create a new immutable final.
- Show recorded-action UI only from persisted state and successful structured results.
- Exclude server downtime, browser-driver failures, selector failures, and test-script syntax failures.

## Agent policy

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
  reviewer:
    name: sol-medium-review
    role: reviewer
    provider: codex
    model: gpt-5.6-sol
    effort: medium
    max_concurrent: 1
```

The active orchestrator is `gpt-5.6-sol` with `medium` effort. Use the named reviewer pool once, as a combined read-only review after implementation. Do not run per-chunk dedicated review. Use one shared working tree. Workers must not spawn agents. Reviewers are read-only. No agent may commit, push, deploy, create a worktree, remove user data, undo existing changes, or reformat unrelated files.

## Resume protocol

Use `docs/matter-workflow-reliability.handoff-progress.md`.

1. Before work, read it. Do not redo a step marked `done`.
2. After each step, run its check and immediately mark the step `done`.
3. On failure, write `FAILED: <reason>` on that line and follow the blocker policy.
4. If a completed step's check now fails, stop and report. Do not reapply it without diagnosis.

## Step 0 — Baseline and ownership

Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, the source build plan, this handoff, and the progress file. Run a graph query before code exploration because `graphify-out/graph.json` exists.

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "Where do matter lifecycle actions, work-item completion, artifact paths, settings, research review work, and company website interview data flow?" --budget 6000
```

Record the baseline changed-file list. Preserve all existing changes. The known workspace currently contains experiment matter data and unrelated modified runtime records. Do not clean them.

Known pre-handoff verification:

- Frontend matter-brief check, typecheck, and build pass.
- The focused backend command produced 56 passes and one existing failure: `tests/test_agents.py::test_agent_decision_check_does_not_change_decision_files` returned tool status `error` for `audit_decisions`. Diagnose whether the failure remains before attributing it to this build. Do not hide it and do not broaden scope to repair it unless this build directly caused or naturally fixes it.

## Step 1 — Shared contract freeze

The coordinator alone owns:

- `backend/app/models/api.py`
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`

Add the minimum contracts for:

- lifecycle action input with explicit approved artifact path, optional exact work-item ID, and optional note;
- one selected work-item completion request and response;
- structured lifecycle action result with current matter data, changed paths, and stable event path;
- company interview `website_url` input and website-use status;
- the three settings keys already carried by the existing flat settings API.

Keep existing action names: `approve_response`, `mark_as_sent`, and `close_matter`. Do not add generated schemas or redesign the API client.

Check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matters.py tests/test_company_interview.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

## Step 2 — Wave 1A

Run both chunks in parallel. Give each worker its exact write scope and forbid all other edits.

### Chunk B — Canonical artifacts

Outcome: safe, consumed matter-relative file settings and content-version finalization.

Write ownership:

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

- Add `matter_files.source_documents_dir=documents`.
- Add `matter_files.draft_outputs_dir=work-product/draft`.
- Add `matter_files.final_outputs_dir=work-product/final`.
- Resolve only under the selected matter.
- Reject absolute, empty, traversal, backslash, protected, outside-matter, or duplicate configured paths.
- Ingestion uses the source setting.
- Draft creation uses the draft setting.
- Finalization uses the final setting.
- Existing old paths remain readable and valid.
- Use a content hash or equivalent stored content version. Finalizing unchanged content returns the existing final. Changed content can create a new final.
- Do not migrate files and do not add path templates.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_settings.py tests/test_ingestion.py tests/test_work_product.py tests/test_matter_paths.py
```

### Chunk C — Focused service repairs

Outcome: one open research-review item and correct company website handling.

Write ownership:

- `backend/app/services/research.py`
- `backend/app/services/company_interview.py`
- `backend/tests/test_research.py`
- `backend/tests/test_company_interview.py`

Required behavior:

- Reuse and update one existing open research-review work item.
- Create a new review item only after the earlier item was completed and new research ran.
- Keep useful research output when search, analysis, citation formatting, or orientation update fails.
- Use the dedicated `website_url` field. Do not copy `leave blank`, `none`, or `no website` into the profile.
- Fetch only a valid public HTTPS URL through the existing safe fetcher.
- Return `website_used=true` only when fetch content was actually used.
- Continue from user facts when a URL is blocked or unreadable.
- Add malformed model-output and blocked-URL tests.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_research.py tests/test_company_interview.py
```

## Step 3 — Wave 1A gate

Wait for both workers. Compare actual changed files to their ownership. Reject out-of-scope edits. Inspect both diffs. Freeze the resulting `WorkProductService` and `MatterPathPolicy` interfaces. Run both focused commands again. Do not start lifecycle work until both workers have stopped and their changes are accepted.

## Step 4 — Wave 1B

Run one Sol Low lifecycle worker.

Write ownership:

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

- Complete one work item by exact ID. Retry keeps its first `completed_at`.
- Keep `matter.md` as the lifecycle authority.
- Approval binds one immutable final artifact path and ID plus actor, time, and stable event path.
- Delivery uses the approved artifact and records method `outside_counsel_os`, actor, time, note, and stable event path.
- Closure requires delivery and no open required work.
- Retry returns stored state and repairs a missing stable event without changing first-action time.
- Direct stage movement cannot enter Closed. Other stage movement remains flexible.
- A matching approval work item may complete only after approval succeeds and only by exact ID.
- Add `save_work_product`, `complete_work_item`, `approve_response`, `mark_response_sent`, and `close_matter` handlers. All call services; handlers contain no duplicate lifecycle rules.
- `save_work_product` takes no raw path. Recommendation writes fixed `recommendations.md`; draft and response use the configured draft folder; only finalize creates final files.
- In `AgentRunner`, use the existing deterministic `record_decision` permission pattern. Expose approval, delivery, or closure only when the current user message explicitly requests that exact action. An approval request exposes only `approve_response` among gated lifecycle tools. Safe read, search, drafting, and work tools remain available.
- Never create a durable decision from approval or delivery.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matter_lifecycle.py tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_agent_action_permissions.py tests/test_matters.py tests/test_work_product.py
```

## Step 5 — Backend gate

Inspect ownership and the combined backend diff. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_settings.py tests/test_ingestion.py tests/test_work_product.py tests/test_research.py tests/test_company_interview.py tests/test_matters.py tests/test_matter_lifecycle.py tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_agent_action_permissions.py
.venv/bin/python -m pytest
```

The full suite must pass, except that the documented pre-existing `audit_decisions` failure can remain only if the same failure is reproduced from the baseline and the combined diff did not cause it. Report it clearly.

## Step 6 — Wave 2

Run both chunks in parallel.

### Chunk D — Matter workspace reliability

Write ownership:

- `frontend/lib/matterBrief.ts`
- `frontend/lib/matterActions.ts`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/app/globals.css`
- `frontend/scripts/check-matter-brief.ts`

Required behavior:

- Required work remains the primary next action.
- The stage or lifecycle action remains visible as a separate control.
- A combined approval control passes the exact approval work-item ID.
- Show a compact Matter artifacts block with recommendation, latest research, current draft, and final or approved response.
- Open only known user-facing artifact paths. Never auto-open events, conversations, work items, or `matter.md`.
- Show mutation success only from persisted state and successful structured results.
- If a user requested a workspace mutation, show recorded changes or `No workspace state change recorded`.
- Do not add that line to ordinary advice or drafting turns.
- Add honest elapsed working text. No percentage, backend phase, or ETA.
- Disable duplicate submit only. Keep safe navigation and open documents usable.
- Keep the existing editor and raw Markdown mode.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

The Node module-type warning is acceptable. `All checks passed.` is required.

### Chunk E — Settings and company UI

Write ownership:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/components/CompanyInterview.tsx`

Required behavior:

- Add a Files and outputs section for the three real settings.
- Explain that each path is relative to a matter and remains inside the vault.
- Save and reload values through the existing whole-settings API.
- Show one direct backend validation error and keep stored values unchanged on failure.
- Add a dedicated optional website field.
- Show `Website read` only when `website_used` is true.
- Show a clear warning for blocked or unreadable URLs and continue the interview.
- Do not imply verification and do not add a crawler.

Focused check: self-review the owned diff. The coordinator verifies behavior in the browser because there is no frontend component-test command.

## Step 7 — Integration and verification

The coordinator owns only integration changes in the three contract files from Step 1 and new acceptance cases in `docs/ACCEPTANCE_TESTS.md`. Do not redesign accepted worker changes.

Add acceptance cases for path settings, path rejection, unchanged and changed draft finalization, lifecycle permission gates, exact work-item completion, research deduplication, company blank input, recorded-action UI, and stage-action visibility.

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

## Step 8 — Independent review

After all implementers stop, start one new read-only Sol Medium reviewer. It must not be an implementation worker. Give it the source plan, combined diff, checks, and baseline. Ask for concrete findings with file and line references. It must check record integrity, permission gates, retry safety, path escape, old-path compatibility, false success UI, hostile external output, test gaps, and ownership violations.

## Step 9 — Corrections

Return each material finding to its original owner when safe. Serialize corrections that touch shared files. The coordinator reviews every correction and reruns the affected focused checks. Run another dedicated review only for a high-risk or architecture-changing correction.

## Acceptance check

Use an isolated copy of the vault. Walk the complete demo in the source build plan. At minimum prove:

1. Settings save, reload, and control actual new file placement.
2. Invalid paths cannot escape a matter.
3. Unchanged finalize retries reuse one final; changed draft content creates another final.
4. One selected work item completes without changing siblings.
5. Required work remains primary and lifecycle action remains visible.
6. Approval binds one final artifact in `matter.md`.
7. Delivery records the same artifact and `outside_counsel_os`.
8. Closure fails with required work and succeeds after completion.
9. Lifecycle retries keep first timestamps and one event each.
10. A false model claim without a successful mutation shows `No workspace state change recorded` and does not change durable state.
11. Research reuses one open review item.
12. Company `leave blank` remains blank; a real public URL reports whether it was read.
13. Long work shows honest elapsed status without a fake percentage.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest result consistent with this plan. Stop and report if required access or a named dependency is unavailable, a named symbol differs materially, instructions conflict, a focused check still fails after diagnosis, a change requires an irreversible action, or a material product choice is missing. Do not stop for harmless warnings or unrelated pre-existing failures.

## Do not

- Do not add a workflow engine, queue, streaming system, verifier agent, new database, auth, cloud tenancy, or outbound delivery.
- Do not add lifecycle receipt files. Use `matter.md` and existing events.
- Do not add arbitrary host paths, path templates, variables, or file migration.
- Do not add a second editor, crawler, or legal-confidence gate.
- Do not infer successful workspace changes from model prose.
- Do not let workers overlap write scopes.
- Do not run shared frontend builds while frontend workers are active.
- Do not clean or overwrite the experiment matter data or unrelated user changes.
