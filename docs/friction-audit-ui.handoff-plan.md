# Handoff plan — Counsel OS friction-audit UI

## Goal

Implement the complete accepted friction-audit plan in two parallel waves. Make the lawyer's attention, decision, and reading paths clear. Hide misleading stubs. Keep the working MVP architecture and all record-integrity rules.

## Resume protocol

Before starting, read `docs/friction-audit-ui.handoff-progress.md`. Do not redo a line marked done. Start at the first pending line. After each chunk or gate, run its verification and immediately mark that line done. On failure, write `FAILED: <what happened>` on that line and follow the blocker policy. If a done step's check now fails, stop and report instead of reapplying it.

## Execution roles

- Coordinator and reviewer: Codex `gpt-5.6-sol`, medium effort.
- Implementers: Codex `gpt-5.6-sol`, low effort (“Sol Light”).
- Maximum active implementers: three, excluding the coordinator.
- Review policy: coordinator reviews every chunk at wave boundaries.
- Shared tree only. No worktrees, commits, pushes, deployments, or nested agents.
- Workers do not run frontend typecheck, build, or browser checks in parallel. The coordinator runs them after each wave stops.
- The only permitted repository deletion is the verified, Git-tracked browser-test directory in Step 4F. No other destructive repository cleanup is permitted. Guarded removal of temporary directories created by this plan is allowed.

## Step 1 — baseline and ownership audit

Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/ACCEPTANCE_TESTS.md`, and `docs/FRICTION_AUDIT_IMPLEMENTATION_PLAN.md`. Record `git status --short`. Preserve all existing changes.

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest
cd /Users/bharris/Programs/counsel-os-mvp/frontend && npm run typecheck && npm run build
```

Known baseline on 2026-08-28: frontend typecheck and build pass. Backend reports 107 passed and exactly three existing failures in `tests/test_annotations.py` caused by the committed Apex annotation. Those exact three failures are acceptable during this task if they remain unchanged. Any new failure is a blocker.

Before each wave, create an outside-repository snapshot with `wave_snapshot_dir=$(mktemp -d)` and `rsync -aR` every exact owned path into it. Workers must return their exact changed-file lists. At the gate, compare each changed file with the snapshot and compare the list with `git status --short`. Existing dirty files make Git status alone insufficient.

## Step 2 — Wave 1 in parallel

Dispatch three Sol Light implementers with no overlapping writes.

### 2A — attention language, matter lists, and dates

Own: `frontend/lib/design.ts`, `frontend/lib/briefing.ts`, `frontend/app/page.tsx`, `frontend/app/workspace/page.tsx`, `frontend/app/matters/page.tsx`, `frontend/components/StageBoard.tsx`, `frontend/components/MattersTable.tsx`, `frontend/components/MattersTimeline.tsx`, `frontend/lib/research.ts`.

Implement shared matter-attention helpers, honest scoped counts, corrected Today copy, a labelled filter system with clear action, Table default, open-work-first sorting, conditional Owner, neutral Not assessed risk, sentence-case headings, removal of the duplicate column-level agent status, and shared `en-US` short/long/date-time formatters.

Do not force Today's broad total to equal the matter-only totals. Do not remove Stages or Timeline.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run frontend checks while the wave is active.

### 2B — settings and agent truth

Own: `frontend/lib/stubs.ts`, `frontend/app/settings/page.tsx`, `frontend/app/agents/page.tsx`, and settings mapping in `frontend/lib/api.ts` only if required.

Hide settings that only save unused values. Keep Company plus provider/model/effort. Initialize the selected section to a remaining ID such as `agents`, and make writes target `current.id`. Put reasoning effort under Advanced model options. Present the stable `counsel-copilot` as user-facing Themis with role Counsel Copilot. Put tool permissions and paths under Advanced controls. Align the rule to explicit user-instructed durable recording. Keep only Save agent and Discard changes, with a stable loaded/saved baseline and one dirty-switch warning.

Do not delete saved setting keys. Do not change tool permissions or backend allow-lists.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run frontend checks while the wave is active.

### 2C — decision register and research Markdown

Own: `frontend/components/DecisionTable.tsx`, `frontend/app/decisions/page.tsx`, `frontend/app/matters/[matterId]/research/page.tsx`.

Join decisions to matters by `matter_id`, display the real matter title, show complete wrapping review reasons, state the recommendation/decision rule once, and render research note answers through the existing React Markdown stack without raw HTML.

Leave the research time formatter unchanged in the worker. At the gate, the coordinator replaces it with Step 2A's `formatTime` helper.

Do not put recommendation cards into the recorded table.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run frontend checks while the wave is active.

## Step 3 — Wave 1 gate

Wait for all three chunks. Compare every reported file with the pre-wave snapshot. Reject scope violations. Connect the research time call to Step 2A's helper. Run frontend typecheck and build. Correct only integration defects.

## Step 4 — Wave 2 in parallel

Dispatch three new Sol Light implementers with no overlapping writes.

### 4D — matter workspace, decision path, and chat reading

Own: `frontend/components/MatterWorkspace.tsx`, `frontend/components/RecordDecisionModal.tsx`, `frontend/components/ChatPanel.tsx`, `frontend/components/MatterTree.tsx`, `frontend/components/DocumentPanel.tsx`, `frontend/lib/matterActions.ts`, `frontend/app/globals.css`.

Reorder the overview around the question, proposal, and decision action. Prevent the overview from shrinking to 60 pixels. Start the document pane collapsed unless a file is requested, and expand it on file selection. Make Review and decide open a focused overview state. Keep assumptions outside the proposed chosen path. Use only same-line `Working path:` or `Recommended path:` text; reject first substantive `No recommendation` or `No launch recommendation` text and remove sentences that begin `Counsel must confirm`, `Confirm`, `Pending`, or `Open question`. Do not synthesize from headings, `orientation.next_action`, or arbitrary text. Prefill the proposal and known legal owner, require decision and decider, and write only on final submit. Put trace after the answer in a closed Actions taken disclosure. Add Focus answer/Restore workspace without writes. Keep raw Markdown and accessible Track Changes. Remove normal-surface storage-path copy. Add `.nav-group`, `.nav-primary`, and `.nav-admin` CSS for Step 4E's fixed markup contract.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run frontend or browser checks while Step 4E is active.

### 4E — navigation, Skills, Automations, and identity copy

Own: `frontend/components/AppShell.tsx`, `frontend/components/SkillBuilder.tsx`, `frontend/components/AutomationPanel.tsx`, `frontend/app/automations/page.tsx`, `frontend/components/TodayChat.tsx`, `frontend/components/UploadIntentCard.tsx`.

Use Themis in Today chat and upload intent. Step 4D owns matter-chat identity; Step 2C owns research identity; Step 2B owns Agents identity. Put Today, Workspace, Matters, Decisions, Skills, and Automations inside `<span className="nav-group nav-primary">`. Put Agents and Settings inside `<span className="nav-group nav-admin">`. Step 4D owns the matching CSS. Keep Skills, show one Build a skill action and one secondary Find repeated work action, and add the one-sentence explanation. Rename automation actions to Retry now for failed and Run once for paused. Use the shared date helpers.

Do not invent an Assistant route. Do not add automation lifecycle APIs.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run frontend checks while Step 4D is active.

### 4F — demo-data cleanup and documentation

Own only the exact test matter directory, `backend/tests/test_demo_content.py`, `docs/ACCEPTANCE_TESTS.md`, `docs/DESIGN_LANGUAGE.md`, and `docs/IMPLEMENTATION_STATUS.md` if needed.

Verify the exact matter ID and title. Then require `git ls-files -- 'vault/03_Matters/referral-launch-browser-check-e78bd8/**'` to return tracked files before deleting only `vault/03_Matters/referral-launch-browser-check-e78bd8/`. Add a regression test that rejects committed browser-test matters. Document temporary-vault browser testing. Align the design language with explicit user-instructed decision recording. Add only the planned acceptance checklist; the coordinator adds a dated observed-results section after the browser walk. Do not rewrite historical evidence.

Verify: `cd backend && .venv/bin/python -m pytest tests/test_demo_content.py`.

## Step 5 — Wave 2 gate and integration

Wait for all chunks. Compare every reported file with the pre-wave snapshot. Inspect every changed path against ownership and the baseline. Resolve imports, shared wording, and styling seams. Do not broaden scope. Confirm no fake setting remains and all normal assistant labels use Themis. Run frontend typecheck/build only now. Reserve the Settings save-and-reload check for the isolated final browser walk.

## Step 6 — full automated verification

Run backend `.venv/bin/python -m pytest`, frontend typecheck/build, and `graphify update .`. Accept only the three unchanged annotation failures. Any new failure must be diagnosed and fixed before continuing.

## Acceptance check

Use the exact isolated-vault and isolated-port procedure in `docs/FRICTION_AUDIT_IMPLEMENTATION_PLAN.md`. Record the original provider, model, and effort; change and persist one valid value; then restore and re-verify all originals before any test that needs the real provider. Walk Acceptance Tests A, B, C, E, F, H, I, J, K, and L plus the 16-step demo. Test 1280×720, 1024 wide, and 768 wide. Check keyboard access and console errors. Verify the repository-vault hash is unchanged. Record results in a new dated acceptance section.

## Do not

- Do not add auth, RBAC, connectors, citation gates, spend enforcement, full automation management, a new frontend test framework, or new infrastructure.
- Do not rename Skills to Playbooks.
- Do not remove Stages, Timeline, risk metadata, raw Markdown, Track Changes, or the file tree.
- Do not empty the proposed-decision field merely to force retyping.
- Do not change decision creation so a recommendation records itself.
- Do not delete any matter except the exact verified browser-test directory.
- Do not weaken tests or treat a new failure as baseline noise.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest option consistent with this plan. Stop and report if a named path or signature differs materially, a worker needs another worker's file, the exact test matter identity does not match, a new verification failure persists after focused diagnosis, or the work requires a user product decision or irreversible action outside this plan.
