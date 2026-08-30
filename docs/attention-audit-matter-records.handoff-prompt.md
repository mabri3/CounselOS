# New-context implementation prompt

You are the **Sol Medium orchestrator and reviewer** for a shared-tree implementation in:

`/Users/bharris/Programs/counsel-os-mvp`

Complete the Counsel OS attention-audit and Matter Records build in one continuous run. Use up to three **Sol Light** implementers at one time. You review every worker result, integrate the shared tree, run all checks, complete the browser walk, and do not stop while safe in-scope work remains.

## Model and review policy

- Orchestrator/reviewer: `gpt-5.6-sol`, medium reasoning.
- Implementers: `gpt-5.6-sol`, low reasoning.
- Maximum active implementers: three.
- Review: coordinator-only. Do not create separate reviewer agents.
- Workers must not spawn agents.
- Use the current shared working tree. Do not create worktrees, clones, temporary commits, or patch-transfer steps.
- Do not commit, push, deploy, or undo unrelated changes.
- Stop all front-end workers before type check, build, or browser checks.

## Resume protocol

Read `docs/attention-audit-matter-records.handoff-progress.md` first.

- Start at the first pending line.
- Do not redo a completed step.
- Mark a line done immediately after its required review and check pass.
- If a step fails, add `FAILED: <short reason>` to that line and continue with safe diagnosis and repair.
- If a completed step is no longer valid, stop and report the exact mismatch before redoing it.

## Required first reads

Read these files completely before dispatching work:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `docs/ATTENTION_AUDIT_IMPLEMENTATION_PLAN.md`
6. `docs/attention-audit-matter-records.handoff-plan.md`

Use the `senior-mindset`, `parallel-plan-executor`, `focused-fix`, `demo-first`, and `practical-simplicity` skills if they are available. Follow their shared-tree and verification rules.

If `graphify-out/graph.json` exists, first run:

```bash
graphify query "Implement attention audit Matter Records narrow matter tree dossier decision rationale automations settings agents skills research tables"
```

Use graphify for codebase questions before broad raw search. Run `graphify update .` after application changes.

## Repository facts already checked

- The working tree is dirty. Existing changes belong to the user. Preserve them.
- The front end currently passes `npm run typecheck` and `npm run build`.
- The backend virtual environment is `backend/.venv`.
- The correct backend command runs from `backend`.
- Baseline on 2026-08-28: 127 backend tests pass and exactly these three fail:
  - `tests/test_annotations.py::test_annotations_round_trip`
  - `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
  - `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`
- The failures come from an existing annotation in the demo vault copied by the test fixture. They are not part of this build. Accept them only if the same three remain and no new failure appears.
- The front end has no unit-test runner. Do not add one for this work.
- `MatterWorkspace` currently defaults both `activePath` and `treeActivePath` to `matter.md`.
- `ChatPanel` sends the active file to chat. `ContextBuilder` also includes core matter records.
- Keep `activePath` on `matter.md` by default, but clear the initial visual `treeActivePath` when no file route exists.
- The initial tree weight is currently `0.55`; change it to `0.24` and keep the 210-pixel minimum.
- `RecordDecisionModal` receives a suggested path. `MatterWorkspace` currently derives hidden rationale from `detail.orientation.why_now`. The final modal must show and let the lawyer edit that rationale before record.
- A dossier is optional. It is an editable summary, not the matter root. Do not create dossiers or change revision/hash behavior.

## Product decisions you must not reopen

1. Matter is the full work container and root domain object.
2. Dossier is an optional summary. It may support orientation but does not replace Matter.
3. `matter.md` stays the default model context.
4. The first-level tree shows direct lawyer-facing items. Structured/internal records appear under a collapsed virtual **Matter Records** group.
5. The Matter Records group is a front-end view only. No vault file moves or renames.
6. Do not call all facts “extracted.” Use `Facts, sources & assumptions` because current provenance is mixed.
7. Recommendations are not recorded decisions.
8. A Themis draft can prefill a decision, but the lawyer sees and edits the decision, rationale, and decider before explicit submit.
9. Use Themis as the visible assistant name. Keep `agent_id: counsel-copilot` and role `Counsel Copilot`.
10. Use `Recorded` and `Needs review` as decision status language.
11. Keep Skills, Agents, and Automations separate.
12. Keep accessible native controls. Do not replace them with custom controls.
13. Remove the weak Matters Timeline. Keep Table as default and Stages as the alternate.
14. Add real schedule pause/resume only. Do not add schedule editing, deletion, or a larger automation system.

## Matter Records mapping

Implement this exact visible mapping without changing paths:

- `matter.md` → `Matter details`
- `facts.md` → `Facts, sources & assumptions`
- `issues.md` → `Issue map`
- `participants.md` → `People & roles`
- `recommendations.md` → `Working recommendations`
- `work-items/` → `Work to do`
- `decisions/` → `Recorded decisions`
- `events/` → `Activity history`
- `dossier-revisions/` → `Dossier revisions`

Show `request.md` directly as `Original request`. Keep Documents, Chats, Research, Work product, Dossier when present, and legacy Drafts when present at the first level. Use this helper text for Matter Records:

`Structured records captured from intake, documents, chat, lawyer edits, and system actions.`

## Baseline and snapshot procedure

1. Record `git status --short`.
2. Run the front-end and backend baseline commands.
3. Confirm the observed result matches the facts above.
4. Before each wave, create a directory outside the repository with `mktemp -d`.
5. From the repository root, use `rsync -aR` to copy every path owned by that wave into the snapshot.
6. Give every worker exact ownership.
7. Require every worker to return the exact files changed and a short self-review.
8. At each gate, compare worker files with the snapshot. Do not rely only on Git status because the owned files already have user changes.

## Wave 1 — dispatch three Sol Light workers in parallel

### Worker 1A — matter workspace and record integrity

Own only:

- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/lib/matterActions.ts`
- `frontend/app/globals.css`

Give the worker Sections 2, 3, 4, and Chunk 1A from `docs/ATTENTION_AUDIT_IMPLEMENTATION_PLAN.md`. Require the narrow tree, exact Matter Records mapping, preserved default agent context, empty initial visual selection, one primary action, full `Themis · Not reviewed` styling, visible editable rationale, explicit final record, closed trace disclosure, human file labels, responsive CSS, and accessible native controls.

### Worker 1B — Today, Workspace, and Matters

Own only:

- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTimeline.tsx` for deletion only
- `frontend/components/NewMatterForm.tsx` only if risk help needs it

Require honest scoped counts, `Recorded`/`Needs review`, state-based empty language, no active action on closed matters, full names and dates, separate Owner/Area/Risk filters, Table default, Timeline removal, one risk definition, `Not assessed`, useful sorting, corrected grammar, and labelled controls.

### Worker 1C — decisions and research

Own only:

- `frontend/app/decisions/page.tsx`
- `frontend/components/DecisionTable.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`

Require consistent decision states, real matter titles, full names/dates, full wrapping review reasons, one recommendation rule, `Check sources again`, no fake `unreviewed` state, one `No cited sources` empty state, human source names, and existing safe Markdown rendering. It may import date helpers from Worker 1B but must not edit their file.

Tell all Wave 1 workers not to run front-end checks. Wait for all three. Review each diff against its snapshot and exact ownership. Resolve only integration seams. Then run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
npm run build
```

Do not start Wave 2 until both pass.

## Wave 2 — dispatch three Sol Light workers in parallel

### Worker 2D — automation lifecycle

Own only:

- `backend/app/models/api.py`
- `backend/app/routers/automations.py`
- `backend/app/services/scheduler.py`
- `backend/tests/test_scheduler.py`
- `backend/tests/test_automations_api.py`
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- `frontend/components/AutomationPanel.tsx`
- `frontend/app/automations/page.tsx`

Require `ScheduleUpdate(enabled: bool)`, `PATCH /api/automations/schedules/{schedule_id}`, Markdown persistence, index rebuild, future `next_run_at` on resume, no immediate run, preserved last-run state on pause, 404 on missing ID, typed front-end call, and exact action labels: `Pause schedule`, `Resume schedule`, `Run it now`, and `Retry now`. Do not add edit/delete/reconnect systems. The worker may run only the focused backend tests for its owned tests.

### Worker 2E — Settings, Agents, and Skills

Own only:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/agents/page.tsx`
- `frontend/app/skills/page.tsx`
- `frontend/components/SkillBuilder.tsx`

Require a simple current-model summary with real controls under Advanced, no invented profiles, preserved settings storage, plain agent identity before advanced Markdown/permissions/paths, stable Themis ID and role, separate object models, clear Skill definition and post-save summary, the requested raw prompt under a clear label/Advanced, and stable save buttons with separate Saved status.

### Worker 2F — acceptance and product documents

Own only:

- `docs/ACCEPTANCE_TESTS.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/IMPLEMENTATION_STATUS.md`

Require acceptance coverage and product-language updates from Chunk 2F. Preserve historical notes. Do not record pass results before the browser walk.

Wait for all three. Review each diff and exact ownership. Run the focused automation tests, front-end type check, and front-end build. Fix only integration defects.

## Full verification

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

There must be no new backend failure. Report the three known annotation failures clearly.

Then use the browser-control skill with a copied temporary vault. Do not mutate the user's main vault. Walk the updated acceptance checks at 1280×720, 1024 pixels, and 768 pixels. Check the console and keyboard access. Specifically prove:

- initial tree width is 210–250 pixels at 1280×720;
- no Matter Records item looks selected without a file route;
- chat still sends `matter.md` as default active context;
- optional dossier behavior works with and without `dossier.md`;
- every mapped record opens the original path once;
- the decision modal shows editable decision, rationale, and decider;
- cancel writes nothing and final record writes once;
- research missing-source copy appears once;
- decision status, full names, dates, and tables are readable;
- paused schedules resume with a future next run;
- Settings, Agents, and Skills show plain language before Advanced details;
- there are no console errors.

After the walk, add dated observed results to `docs/ACCEPTANCE_TESTS.md`.

## Do not do

- Do not change matter/dossier semantics.
- Do not move or rename vault files.
- Do not add blanket provenance fields or label all facts as extracted.
- Do not add legal-answer gates, verifier agents, confidence thresholds, or generic disclaimers.
- Do not merge Skills, Agents, and Automations.
- Do not build custom native controls.
- Do not add a front-end test framework.
- Do not fix the unrelated annotation fixture debt unless a new change causes it.
- Do not delete or overwrite unrelated dirty-tree work.

Finish only after every progress line is done. In the final report, lead with the implemented result. Then list verification, the exact known backend failures, changed-file groups, and any remaining risk.

