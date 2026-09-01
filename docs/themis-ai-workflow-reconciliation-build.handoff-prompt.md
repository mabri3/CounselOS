# One-shot prompt — implement and rerun the Themis.ai workflow reconciliation build

Execute the complete build and recurrence experiment described in:

`/Users/bharris/Programs/counsel-os-mvp/docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`

Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Do not stop after restating or refining the plan. Implement it, review it, verify it, run the fresh-vault recurrence experiment, and deliver the checked result unless a documented safety or environment stop applies.

## Read first

Read these files completely before changing code:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `current.md`
5. `docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`
6. `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md`
7. `docs/experiments/2026-09-01-harborline-fix-rerun-report.md`
8. `.agents/skills/live-agent-ux-experiment/SKILL.md`

Use `$parallel-plan-executor` for implementation coordination. Use `$focused-fix` for each bounded correction. Use `$live-agent-ux-experiment` only after the engineering gate passes. Apply `$demo-first` judgment and do not add production machinery that the plan parks.

## User decisions

These decisions are final:

- Safe reversible work can continue in the background, including research while approval is pending.
- Recording a decision, approval, delivery, closure, and destructive actions always requires a user click.
- Chat can propose material actions but cannot execute them directly.
- Durable success comes from typed operation results and Markdown, not chat wording or string matching.
- The result contract is app-wide and feeds chat, the matter workspace, and the board.
- Lawyer edits update the structured recommendation with version history.
- Agent recommendation changes remain proposals until accepted.
- Decisions can follow, modify, or not follow a recommendation. Modified or rejected recommendations require a saved reason.
- Research uses a durable per-matter background queue. The first item starts automatically. The user can reprioritize pending items without interrupting the running item.
- Research provider fallback is an app-wide setting for the MVP.
- Kimi K3 Fast on NeuralWatt is the initial model-only fallback. Resolve the exact catalog ID. Do not silently substitute a model.
- Another language model does not count as external source retrieval. Label model-only work **No external authority retrieved**.
- The board must show deterministic state inconsistencies and provide only safe explicit repair.
- Target-date persistence must be fixed.
- **Record manual delivery** is an explicit local record. It contacts no one.
- Show disabled **Send directly — coming later**. Do not implement real delivery.
- Suggested answers, owners, and useful next actions should be clickable where practical.

## Worker routing

Use one shared working tree. Do not create worktrees, clones, temporary commits, or patch transport.

```yaml
parallel:
  optimize_for: balanced
  max_agents: 4
  workers:
    - name: sol-medium-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 3
    - name: sol-medium-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 1
    - name: sol-high-escalation-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
```

Run C0 alone. Run C1 and C2 in parallel after C0. Run C3 after Wave 1. Run C4 after C3 is accepted. Use the exact write ownership in the plan. Workers may read other files but may not edit outside their scope. Workers may not spawn agents.

Use one fresh read-only Sol Medium reviewer on the combined accepted implementation. The reviewer must return PASS, FIX, or ESCALATE for every review group in the plan. A FIX returns to the original Sol Medium implementer when possible.

Use one fresh read-only Sol High reviewer only after a Sol Medium ESCALATE verdict meets the evidence rule in the plan. Sol High does not edit. Return the narrow conclusion to the original Sol Medium implementer. The Sol Medium reviewer gives the final verdict.

Do not silently change the provider, model, effort, role, or ownership assignment.

## Baseline and safety

The worktree is already dirty with user-owned implementation and experiment changes. Preserve all of them.

Before dispatch:

- record branch, commit, `git status --short`, active vault, and repository `vault/` hash;
- create or update the progress file;
- run the baseline checks once;
- run focused Graphify queries before source diagnosis;
- diagnose one target-date create chain and one Polaris request;
- use only temporary isolated vaults for mutation tests.

Do not write test data to repository `vault/`. Do not overwrite any earlier experiment vault or evidence. Do not reveal secrets. Do not commit, push, deploy, reset, clean, stash, or delete user data.

Use `apply_patch` for manual file edits. Preserve Markdown as source of truth and SQLite as a rebuildable index. Keep all file operations inside the selected `VAULT_PATH`.

## Implementation boundary

Build the smallest correct solution in the existing architecture:

- Extend existing typed tool results and matter services.
- Do not add an event bus, general workflow engine, verifier agent, distributed queue, broker, new database, auth, or embeddings.
- Extend the current in-process research runner for the durable queue.
- Keep material records separate: recommendation, decision, approval, delivery, and closure.
- Keep useful model output when retrieval, schema formatting, citation formatting, or one tool step fails.
- Keep provider diagnostics available but outside ordinary lawyer-facing content.
- Do not use phrase matching as the authority for a successful workspace mutation.

Follow all chunk outcomes, file scopes, focused checks, wave gates, review rules, and completion criteria in the build plan.

## Verification

After focused checks and final Sol Medium PASS verdicts, run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
test ! -f scripts/check-research-queue.ts || node --experimental-strip-types scripts/check-research-queue.ts
test ! -f scripts/check-recommendation-integrity.ts || node --experimental-strip-types scripts/check-recommendation-integrity.ts
test ! -f scripts/check-matter-creation.ts || node --experimental-strip-types scripts/check-matter-creation.ts
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

Create a new verification vault through the normal visible UI. Walk the complete demo script. Verify Markdown after material actions. Rebuild only that vault's SQLite index, restart locally, and confirm the same visible state. Prove the repository vault hash did not change.

The new-vault confirmation popup is expected test setup. Use the existing test-only bypass or click **OK**. Do not classify it as a stall.

## Recurrence experiment

After the engineering and visible-demo gates pass, run a new ten-matter Harborline experiment with `$live-agent-ux-experiment`.

- Create a separate new experiment vault. Never reuse the verification vault or an earlier experiment vault.
- Preserve the September 1 request themes and strict before/after measures for comparison.
- Use Luna Medium for the requester, setup attorney, and each fresh matter attorney, matching the September 1 rerun. Use Sol High for post-run synthesis.
- Use one fresh visible-browser attorney per matter and serial live writes.
- Do not change code during actor runs.
- Do not contact a real person or external delivery service.
- Use the test-only popup bypass or click **OK** for the expected vault confirmation. Do not call it a product stall.
- Actors control their own browser first. If an actor cannot see or control the in-app browser and Chrome or Safari is also unavailable or broken, the coordinator may provide the minimum in-app navigation or click assistance needed to continue. Mark that run **assisted**. Preserve product-state evidence but exclude assisted navigation from independent discoverability claims.
- Create new timestamped raw evidence and a new dated report. Do not overwrite the September 1 report.

Use a fresh Sol High synthesis agent after all live runs, as required by the experiment skill. This synthesis role is separate from the optional Sol High engineering escalation reviewer.

## Progress and reporting

Update `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md` after every accepted chunk, failed check, review verdict, correction, escalation, engineering gate, and experiment run.

Lead the final report with the actual result. Include:

- implemented chunks and exact Sol Medium routing;
- combined Sol Medium review verdicts;
- any Sol High escalation and why it met the rule;
- focused and full checks actually run;
- visible verification-vault result;
- repository-vault hash result;
- ten-matter before/after metrics;
- assisted browser runs, if any;
- unresolved failures or risks;
- confirmation that no commit, push, deployment, destructive cleanup, or real external contact occurred.

Do not claim completion from worker reports. Inspect diffs and rerun the evidence yourself.
