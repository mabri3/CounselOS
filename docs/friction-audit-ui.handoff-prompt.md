# Clean-context implementation prompt

You are the Sol Medium coordinator for a shared-tree implementation in:

`/Users/bharris/Programs/counsel-os-mvp`

Your goal is to complete the accepted Counsel OS friction-audit work in one continuous run. Use up to three parallel Sol Light implementers per wave. You review every result, integrate the shared tree, run all checks, and finish the browser acceptance walk. The result must make the lawyer's attention, decision, and reading paths clear without building deferred systems.

## Resume protocol

Before starting, read `docs/friction-audit-ui.handoff-progress.md`.

- Do not redo steps marked done. Start at the first pending line.
- After each chunk or gate, run its verification and immediately mark that line `done`.
- On failure, write `FAILED: <what happened>` on that line and follow the blocker policy.
- If a completed step's check now fails, stop and report instead of reapplying it.

## Required first reads

Read these files completely before dispatch:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `docs/FRICTION_AUDIT_IMPLEMENTATION_PLAN.md`
6. `docs/friction-audit-ui.handoff-plan.md`

Use the `senior-mindset`, `parallel-plan-executor`, `focused-fix`, `demo-first`, and `practical-simplicity` skills if they are available. Follow their repository and shared-tree rules. Workers must not spawn agents.

## Agent policy

- Coordinator/reviewer: `gpt-5.6-sol`, medium effort.
- Implementers: `gpt-5.6-sol`, low effort. This is the requested Sol Light pool.
- Maximum concurrent implementers: three, excluding you.
- Review policy: coordinator-only review at each wave boundary.
- Use the current shared working tree. Do not create worktrees, clones, temporary commits, or patch-transfer steps.
- Workers must not run frontend typecheck, build, or browser checks in parallel. You run them after each wave stops because those commands share generated state.
- Do not silently change model, effort, ownership, or review policy.

## Repository facts already verified

- The working tree is dirty. Existing changes belong to the user. Preserve them.
- The frontend has no unit-test runner. Its supported checks are `npm run typecheck` and `npm run build`. Do not add a test framework for this work.
- The frontend currently passes typecheck and build.
- The backend virtual environment is `backend/.venv`.
- The correct backend command is:

  `cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest`

- Baseline backend result on 2026-08-28: 107 passed and exactly three failures in `tests/test_annotations.py`:
  - `test_annotations_round_trip`
  - `test_annotation_answer_survives_a_hostile_model_reply`
  - `test_blank_annotation_answer_is_not_stored`
- Those failures come from the existing committed Apex annotation. They are not part of this task. Accept them only if the same three remain and no new failure appears.
- Live measurement at 1280×720: `.brief-scroll` has 60 visible pixels and 1,197 pixels of content. The chat thread has 301 visible pixels and 3,762 pixels of content. The implementation must remove this failure mode.
- `RecordDecisionModal` currently initializes `chosenPath` from `suggestion` and hard-codes Brian Harris when no legal owner exists.
- `MatterWorkspace.runPrimaryAction()` currently handles `review_and_decide` by seeding chat.
- `DecisionTable` currently puts `decision.title` in the Matter column.
- Research note answers currently use `LinkifiedText`, which does not parse Markdown.
- `DEFAULT_SETTINGS` contains many controls that only persist values. Only Company and provider/model/effort have real current behavior.
- `SettingsService.write()` merges keys. Hiding a setting does not delete its saved value.
- The PRD allows an agent to record a durable decision only after an explicit user instruction. It forbids autonomous conversion of a recommendation into a decision.
- The exact committed browser-test matter is `vault/03_Matters/referral-launch-browser-check-e78bd8/`, with `matter_id: MAT-20260828-e78bd8` and title `Referral launch browser check`.

## Product decisions you must not reopen

1. Use **Themis** as the user-facing assistant name. Keep stable `agent_id: counsel-copilot` and show “Counsel Copilot” as its role in Agents.
2. Do not force identical numbers across Today, Workspace, and Matters. Share matter-attention logic, but label each scope precisely.
3. Keep a prefilled proposed decision. Keep unresolved facts outside its chosen-path text. Require explicit final submit.
4. Keep the file tree, chat, editor, raw Markdown, tracked changes, risk metadata, Stages, Timeline, Skills, and Automations.
5. Make Table the default Matters view.
6. Hide fake settings. Do not build the systems behind them.
7. Do not rename Skills to Playbooks. Playbooks already mean something else.

## Step 1 — baseline

Record `git status --short`. Run the frontend and backend baseline commands. Confirm the observed results match the facts above. Mark Step 1 immediately.

Before each wave, create a snapshot outside the repository. From the repository root, run `wave_snapshot_dir=$(mktemp -d)`, then use `rsync -aR` with every quoted path owned by that wave and destination `"$wave_snapshot_dir/"`. Each worker must return the exact files it changed. At each gate, compare every reported file with its snapshot copy using `diff -u` or `diff -ru`, then compare the list with `git status --short`. Do not rely on Git status alone because owned files already contain user work.

## Step 2 — dispatch Wave 1 in parallel

Give each worker a self-contained prompt with its exact ownership, outcome, required changes, checks, and the prohibitions from this prompt. Tell each worker not to edit outside its ownership, not to undo user changes, not to commit, and not to spawn agents.

### Worker 2A — attention language, matter lists, and dates

Own only:

- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/MattersTimeline.tsx`
- `frontend/lib/research.ts`

Implement:

- Shared pure helpers for matter-attention state and `en-US` short, long, and date-time display.
- Today keeps the broad attention total and states its breakdown. Its subhead must never deny visible lawyer work.
- Workspace says `N matters await your judgment`; it must not claim to equal Today.
- Matters keeps state counts separate, labels the second filter group `Scope`, shows active filters, and provides Clear filters.
- Rename `Coming up — nothing to do yet` to `Coming up`.
- Use existing stage-action detail when stored next action is empty or the known generic research placeholder.
- Make Table the default. Sort open overdue/soonest due first, then open no-date, then closed.
- Use sentence-case headers. Hide Owner only when all visible rows have the same owner. Show empty/unknown risk as `Not assessed`.
- Remove duplicate column-level `Themis is working`; keep per-matter status and useful count/filter.

Export `formatShortDate`, `formatLongDate`, `formatDateTime`, and `formatTime`; keep compatible aliases if current callers need them. Do not remove Stages or Timeline. Do not edit shared CSS. Self-review and return the exact changed-file list. Do not run frontend checks.

### Worker 2B — settings and agent truth

Own only:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/agents/page.tsx`
- settings mapping in `frontend/lib/api.ts` only if required

Implement:

- Settings shows Company plus provider/model/effort only. Hide General, Matters, Data & retention, People & access, Integrations, citation gate, tool-limit claim, spend, retention, backup, privilege, and reconnect claims.
- Preserve hidden saved keys.
- Initialize the selected settings section to a remaining ID such as `agents`. Make writes target `current.id`, not the removed `general` ID.
- Put reasoning effort under `Advanced model options`; keep the full model catalog.
- Present `counsel-copilot` as Themis, role Counsel Copilot. Do not rename its ID or Markdown heading.
- Replace “not a prompt template” with accurate standing-instruction copy.
- Put tool permissions and paths under `Advanced controls`; do not change permissions.
- Keep the explicit-user-instruction decision rule.
- Keep only `Discard changes` and `Save agent`. Maintain a last loaded/saved baseline. Use one clear confirmation before a dirty agent switch.
- Remove normal-surface build/path copy.

Do not modify backend settings behavior. Self-review and return the exact changed-file list. Do not run frontend checks.

### Worker 2C — decision register and research Markdown

Own only:

- `frontend/components/DecisionTable.tsx`
- `frontend/app/decisions/page.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`

Implement:

- Map `matter_id` to the real matter title and pass the map to the table.
- Use an honest ID fallback only if the matter is missing.
- Show complete wrapping review reasons. Do not shorten to an ellipsis or tooltip.
- State the recommendation-versus-decision rule once.
- Render research note answers with existing `react-markdown` and `remark-gfm`; raw HTML stays disabled.
- Keep recommendation cards outside the recorded table.
- Leave the direct research-note time formatter unchanged. You will connect it to Worker 2A's `formatTime` helper at the Wave 1 gate.

Self-review and return the exact changed-file list. Do not run frontend checks.

## Step 3 — Wave 1 gate

Wait for all workers. Compare every reported file with its pre-wave snapshot. Inspect reported and actual paths. Compare each diff with ownership and the request. Replace the research page's direct time formatter with Worker 2A's `formatTime`. Run frontend typecheck and build. Fix only integration defects. Mark each chunk and the gate immediately after acceptance.

## Step 4 — dispatch Wave 2 in parallel

### Worker 4D — matter workspace, decision path, and chat reading

Own only:

- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/lib/matterActions.ts`
- `frontend/app/globals.css`

Implement:

- Reorder overview content: question, proposed path, primary decision action, open questions, evidence, artifacts, trace/history.
- Ensure the overview cannot shrink to 60 pixels when chat is long.
- Start document collapsed unless a file/research route requests it; file selection expands it. Start non-core tree folders collapsed.
- Make Review and decide open focused review in the overview. It must show question, proposal, unresolved questions, evidence, and record action.
- Extract only the proposed chosen path from recommendations. Strip Markdown emphasis only for matching. If the first substantive paragraph begins `No recommendation` or `No launch recommendation`, return empty. Accept only same-line `Working path:` or `Recommended path:` labels. Take text after the label, then remove sentences beginning `Counsel must confirm`, `Confirm`, `Pending`, or `Open question`. Do not synthesize from numbered sections, `orientation.next_action`, or arbitrary non-heading lines. Apex must prefill only its limited-launch sentence. Relay must prefill its labelled migration path. Pulse and Beacon must be empty.
- Prefill decision and `detail.legal_owner`. Remove hard-coded Brian Harris. Require both decision and decider.
- Opening/cancelling does not write; only final submit calls `createDecision()`.
- Answer first, then a closed `Actions taken (N)` disclosure.
- Show a human applied-skill label without making the slash command dominant. Preserve stored provenance.
- Add Focus answer and Restore workspace. These only alter local layout state.
- Remove normal storage-path copy from document footer. Preserve raw Markdown and the current accessible Track Changes label.
- Reduce redundant resize/collapse controls without removing keyboard access.
- Add CSS for `.nav-group`, `.nav-primary`, and `.nav-admin`. Worker 4E owns the matching markup.

Self-review and return the exact changed-file list. Do not run frontend or browser checks while Worker 4E is active.

### Worker 4E — navigation, Skills, Automations, and identity

Own only:

- `frontend/components/AppShell.tsx`
- `frontend/components/SkillBuilder.tsx`
- `frontend/components/AutomationPanel.tsx`
- `frontend/app/automations/page.tsx`
- `frontend/components/TodayChat.tsx`
- `frontend/components/UploadIntentCard.tsx`

Implement:

- Use Themis in Today chat and upload intent. Worker 4D owns matter chat, Worker 2C owns research, and Worker 2B owns Agents.
- Put Today, Workspace, Matters, Decisions, Skills, and Automations inside `<span className="nav-group nav-primary">`. Put Agents and Settings inside `<span className="nav-group nav-admin">`. Worker 4D owns the matching CSS. Do not create a new route.
- Skills home has one primary Build a skill action, one secondary Find repeated work action, and this explanation: `A skill is reusable guidance for one chat request.`
- Failed automation action is Retry now. Paused action is Run once. Neither claims reconnect or resume.
- Keep create/run behavior. Use Worker 2A date helpers.

Do not add pause/resume/edit/delete/reconnect APIs. Self-review and return the exact changed-file list. Do not run frontend checks.

### Worker 4F — test-data cleanup and docs

Own only:

- `vault/03_Matters/referral-launch-browser-check-e78bd8/`
- `backend/tests/test_demo_content.py`
- `docs/ACCEPTANCE_TESTS.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/IMPLEMENTATION_STATUS.md` only if required

Implement:

- Read the exact matter file first. Stop unless ID and title match the verified values.
- Require `git ls-files -- 'vault/03_Matters/referral-launch-browser-check-e78bd8/**'` to return tracked files. Then delete only that exact directory. This recoverable, verified cleanup is the only deletion exception.
- Add a demo-content test rejecting committed browser-test IDs/titles.
- Document temporary copied vaults for browser tests and cleanup after the run.
- Align design language with PRD: an agent records only after explicit user instruction and never converts a recommendation autonomously.
- Add the planned demo checklist only. Do not add observed results. The coordinator adds a new dated observed-results section after the final browser walk. Do not rewrite old observation records.

Verify with `cd backend && .venv/bin/python -m pytest tests/test_demo_content.py`.

## Step 5 — Wave 2 gate and integration

Wait for all workers. Compare every reported file with the pre-wave snapshot. Inspect ownership and diffs. Resolve imports, shared wording, and style seams yourself. Run frontend typecheck/build only after all workers have stopped. Reserve the Settings persistence check for the isolated final browser walk. Do not redesign accepted work. Confirm:

- no visible fake setting remains;
- Themis is the normal assistant name and Counsel Copilot remains the role/ID;
- no recommendation records itself;
- no raw Markdown appears in research answers;
- no worker touched unowned files.

## Step 6 — full verification

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest
cd /Users/bharris/Programs/counsel-os-mvp/frontend && npm run typecheck && npm run build
cd /Users/bharris/Programs/counsel-os-mvp && graphify update .
```

Accept only the same three existing annotation failures. Diagnose and fix any new failure.

## End-to-end acceptance

Use the exact isolated-vault procedure below. Walk Acceptance Tests A, B, C, E, F, H, I, J, K, and L plus the complete demo script in `docs/FRICTION_AUDIT_IMPLEMENTATION_PLAN.md`. Test 1280×720, 1024 wide, and 768 wide. Test keyboard access. Check browser console errors. Record the observed results in a new dated section of `docs/ACCEPTANCE_TESTS.md`.

After the test-matter deletion is accepted, start one terminal or persistent command session with this complete command. It creates the copy, starts the fresh isolated backend, verifies the real vault on exit, and removes the guarded temporary copy:

```bash
set -e
counsel_repo='/Users/bharris/Programs/counsel-os-mvp'
cd "$counsel_repo"
acceptance_vault_dir=$(mktemp -d)
rsync -a --exclude '.counsel_os_cache.db' 'vault/' "$acceptance_vault_dir/"
repo_vault_hash_before=$(find vault -type f ! -name '.counsel_os_cache.db' -print | LC_ALL=C sort | while IFS= read -r path; do shasum "$path"; done | shasum | awk '{print $1}')
cleanup_acceptance_vault() {
  cd "$counsel_repo"
  repo_vault_hash_after=$(find vault -type f ! -name '.counsel_os_cache.db' -print | LC_ALL=C sort | while IFS= read -r path; do shasum "$path"; done | shasum | awk '{print $1}')
  if test "$repo_vault_hash_before" != "$repo_vault_hash_after"; then
    echo 'Repository vault changed during isolated acceptance.'
    return 1
  fi
  case "$acceptance_vault_dir" in
    /tmp/*|/var/folders/*) rm -rf -- "$acceptance_vault_dir" ;;
    *) echo "Unsafe temporary path: $acceptance_vault_dir"; return 1 ;;
  esac
}
trap cleanup_acceptance_vault EXIT
cd "$counsel_repo/backend"
VAULT_PATH="$acceptance_vault_dir" FRONTEND_ORIGIN='http://localhost:3100' SCHEDULER_ENABLED=false .venv/bin/python -m uvicorn app.main:app --port 8100
```

In a second terminal:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
NEXT_PUBLIC_API_BASE_URL='http://localhost:8100/api' npm run dev -- --port 3100
```

At `http://localhost:3100`, record the original provider, model, and effort. Change one valid value, save, reload, and verify the change. Restore all original values, save, reload, and verify the restoration before Acceptance Test K or any other test that needs the real provider. Complete the remaining browser walk. Stop the frontend, then stop the backend. The backend exit trap must report no hash error and remove the copied vault. A hash mismatch is a blocker and keeps the copy for diagnosis.

## Do not list

- Do not add auth, RBAC, connectors, citation enforcement, spend enforcement, full automation management, a frontend test framework, or infrastructure.
- Do not rename Skills to Playbooks.
- Do not remove Stages, Timeline, risk, raw Markdown, Track Changes, or the file tree.
- Do not force the lawyer to retype a useful proposed decision.
- Do not let opening a modal or reading a recommendation write a decision.
- Do not delete any repository matter except the exact verified, Git-tracked browser-test matter. Do not perform any other destructive repository cleanup. Guarded removal of temporary directories created by this prompt is allowed.
- Do not weaken tests, erase user changes, commit, push, or deploy.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest option that follows this prompt. Stop and report if:

- a named path, symbol, or signature differs materially from this context;
- a worker needs to edit another worker's owned file;
- the exact test-matter identity does not match;
- a new verification failure remains after focused diagnosis;
- instructions materially conflict; or
- proceeding requires an irreversible action or a user product decision outside this plan.

Now work through the steps in order. Dispatch only dependency-safe chunks. Run each verification. Update `docs/friction-audit-ui.handoff-progress.md` immediately after every accepted chunk and gate. Do not stop after producing another plan. Implement, review, verify, and complete the browser acceptance walk.
