# One-shot prompt — repair the Themis.ai live-result defects and rerun recurrence

Execute the complete repair and recurrence plan in:

`/Users/bharris/Programs/counsel-os-mvp/docs/themis-ai-live-result-defects-build.handoff-plan.md`

Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Do not stop after restating or refining the plan. Implement it, review it, verify it, run the fresh-vault payoff demo, run the focused delivery recurrence, and then run the ten-matter live experiment unless a documented safety or environment stop condition applies.

## Read first

Read these files completely before changing code:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/DESIGN_LANGUAGE.md`
5. `docs/ARCHITECTURE.md`
6. `docs/ACCEPTANCE_TESTS.md`
7. `docs/themis-ai-live-result-defects-build.handoff-plan.md`
8. `docs/themis-ai-live-result-defects-build.handoff-progress.md`
9. `docs/experiments/2026-09-01-harborline-workflow-reconciliation-rerun-report.md`
10. `.agents/skills/live-agent-ux-experiment/SKILL.md`
11. `.agents/skills/live-agent-ux-experiment/references/experiment-protocol.md`

Use `$parallel-plan-executor` for implementation coordination. Apply `$focused-fix` to each bounded correction. Apply `$demo-first` and `$practical-simplicity` judgment. Use `$live-agent-ux-experiment` only after the engineering and verification gates pass.

## Required outcome

Repair these observed failures without adding production machinery:

1. Replace every production frontend `window.confirm` with one accessible in-product `ConfirmationDialog`. Cover manual delivery, create/load vault, company-profile replacement, discard-and-switch agent, and saved-Briefing-view deletion. Cancel must make no change. Confirm alone calls the existing action.
2. Make assistant mutation claims obey finalized typed operation results in the immediate response and saved history. Preserve useful analysis.
3. Make the typed recommendation editor the only write path for `recommendations.md`. Preserve legacy text without inventing history.
4. Show and poll the complete existing research queue in the matter overview and Research page until all items are terminal.
5. Show `Approved — required work remains` with count and titles. Do not block approval or delivery. Keep closure blocked.
6. Add safe Polaris HTTP status classification. Do not change provider, timeout, retry, or fallback policy without new evidence.

## Fixed product decisions

- Material decisions, approval, manual delivery, closure, and destructive actions require a lawyer click.
- Manual delivery records an outside-Themis.ai action. It contacts no one.
- Browser-native confirmation dialogs are not permitted because they can block visible-browser experiment actors outside the page DOM.
- Approval and manual delivery remain available while required work is open. Closure does not.
- Typed operation results and Markdown are mutation authority. Chat text is not.
- Useful analysis remains visible when no mutation occurred.
- Lawyer recommendation edits create typed versions. Agent changes remain proposals until accepted.
- Legacy recommendation text enters typed history on the first explicit lawyer save.
- Keep the current serial Markdown research queue.
- Keep Polaris settings unchanged until a controlled trace supports a change.
- Do not modify repository `vault/` or agent prompts for this repair.

## Worker routing

Use one shared working tree. Do not create worktrees, clones, temporary commits, or patch transport.

```yaml
parallel:
  optimize_for: balanced
  max_agents: 3
  workers:
    - name: terra-medium-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-terra
      effort: medium
      max_concurrent: 2
    - name: terra-high-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-terra
      effort: high
      max_concurrent: 2
    - name: terra-xhigh-combined-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-terra
      effort: xhigh
      max_concurrent: 1
    - name: sol-high-escalation-implementer
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
```

Run Wave 0 alone. Run C1, C2, and C3 in parallel. Run C4 after the provider probe while accepted C1-C3 work is inspected. Run C5 only after C2 and C3 are accepted. Follow every exact write scope and dependency in the plan. Workers may read other files but may not edit outside scope. Workers may not spawn agents.

Use one fresh read-only Terra extra-high reviewer on the combined accepted implementation. It must return PASS, FIX, or ESCALATE for TR, RI, RQ, LC, PV, and XS. Send a bounded FIX to the original implementer. Use Sol high only after the plan's evidence rule is met. Temporarily reassign only the exact escalated files. The Terra extra-high reviewer rechecks the result.

Do not silently change any provider, model, effort, role, ownership, or review rule.

## Baseline and safety

Preserve the current dirty-tree baseline and all user-owned changes.

Before dispatch:

- record branch, commit, `git status --short`, active vault, exact path hashes for all planned scopes, and the full repository `vault/` hash;
- update the progress file;
- run baseline focused checks once;
- run the focused Graphify queries named in the plan;
- reproduce the recommendation bypass and false no-tool success in isolated tests;
- reproduce the recommendation bypass through generic file save, review read, `save_untracked`, and `save_revision`;
- record all five current `window.confirm` locations and their protected actions;
- run one privacy-safe Polaris probe without exposing secrets or content;
- use only isolated temporary vaults for mutation tests.

Before each wave, create one exact path-and-SHA-256 manifest. After each worker stops, compare all changes with the manifest and its assigned scope. Do not use dirty Git status alone to infer ownership.

Do not write test data to repository `vault/`. Do not overwrite old experiment evidence. Do not reveal secrets. Do not commit, push, deploy, reset, clean, stash, create a worktree, or delete user data.

Use `apply_patch` for manual edits. Keep all application file operations inside the selected `VAULT_PATH`. Keep Markdown authoritative and SQLite disposable.

## Implementation boundary

- Extend existing typed results, recommendation service, research queue API, and lifecycle action.
- Do not add an event bus, workflow engine, verifier agent, distributed queue, broker, database, provider adapter, auth, embeddings, or direct delivery.
- Do not solve chat truth with a broad prompt rewrite or phrase matching as the authority.
- Constrain chat reconciliation to complete current-turn mutation-success sentences from an explicit closed list, and apply it only after a typed non-success result. Preserve historical, quoted, recommended, negative, and non-mutation uses of words such as `saved` and `recorded`.
- Protect any matter `recommendations.md` from generic file save and both review endpoints before those paths can write metadata or content.
- Do not backfill invented recommendation history.
- Do not make open required work block approval or manual delivery.
- Do not change Polaris default timeout or retry values.
- Preserve useful model output and truthful source labels when retrieval fails.

Follow the chunk outcomes, file scopes, tests, review groups, and completion rules in the build plan exactly.

## Verification

After focused checks and final Terra extra-high PASS verdicts, run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
for script in scripts/check-*.ts; do node --experimental-strip-types "$script"; done
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
git diff --check
```

Prove that the full repository `vault/` hash matches the dirty working-tree bytes recorded before dispatch. `HEAD` is not the reference.

Create a new visible verification vault through the normal UI. Its confirmation must be an in-page dialog controlled by the browser actor; do not use a native-popup bypass for acceptance. Run the complete demo script in the plan. Verify Markdown after material actions. Rebuild only that vault's SQLite index, restart, and confirm the same state. Then run the three-matter manual-delivery recurrence. Stop and correct C5 if any confirmation uses a native dialog, any actor stalls at a confirmation, any Cancel mutates state, or delivery duplicates.

## Ten-matter recurrence experiment

Only after engineering, review, payoff demo, and focused recurrence pass, run a new ten-matter Harborline experiment with `$live-agent-ux-experiment`.

- Create a separate new experiment vault.
- Preserve the September 1 themes and strict before/after measures.
- Use Luna medium for the requester and one fresh visible-browser attorney per matter.
- Run all live UI writes serially.
- Every actor must control its own visible browser. The coordinator must not operate the UI for an actor.
- Do not change code during actor runs.
- Do not contact a real person or external delivery service.
- Treat any browser-native confirmation or actor stall at a confirmation as a product recurrence failure.
- Wait for the full queue to become terminal before freezing research counts, or record the exact cutoff and remaining run IDs.
- Treat external-authority retrieval as a diagnostic measure, not a passing threshold. Zero retrieved authority does not fail the build when fallback output is useful and truthfully labeled and safe provider evidence is preserved.
- Use one fresh Sol-high synthesis agent after all ten runs.
- Create new timestamped raw evidence and a new dated report. Do not overwrite earlier evidence.
- Keep product defects, browser-control errors, and environment/provider failures separate.

## Progress and final report

Update `docs/themis-ai-live-result-defects-build.handoff-progress.md` after every baseline, accepted chunk, failed check, review verdict, correction, escalation, engineering gate, demo, and experiment run.

Lead the final report with the actual result. Include:

- exact worker routing and changed paths for C1-C5;
- coordinator scope verdicts;
- all Terra extra-high review verdicts;
- any Sol-high escalation and its evidence;
- focused and full checks actually run;
- verification-vault and three-matter recurrence results;
- ten-matter before/after metrics;
- browser-control and provider/environment failures;
- unresolved risks;
- initial and final repository `vault/` hashes;
- confirmation that no commit, push, deployment, destructive cleanup, repository-vault mutation, or real external contact occurred.

Do not claim completion from worker reports. Inspect the diffs and rerun the evidence yourself.
