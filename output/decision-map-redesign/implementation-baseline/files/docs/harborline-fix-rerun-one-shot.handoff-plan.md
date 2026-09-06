# Harborline fix and rerun plan

## Outcome

Repair every fixable product or local-runtime issue found in the Harborline Financial live-agent experiment. Preserve fixes that are already present in the dirty worktree. Verify the combined application. Then run the same 10-matter experiment in a new test vault.

The task is complete only after the coding checks, visible browser checks, 10 live matters, and final Sol High synthesis are complete or a stated safety stop condition prevents further work.

## Payoff moment

In a vault created after the fixes, a fresh Luna Medium attorney can create one complete matter, finish intake, save useful research and work product, record a separate decision when relevant, finalize the correct artifact, record local fictional delivery, close the matter, reload, and see consistent state without duplicate records or hidden failures. Ten independent matters then test whether this result repeats.

## Baseline experiment

- Business: fictional fintech with consumer and business bank accounts through a banking partner, plus substantial payments work.
- Company: Harborline Financial, fictional and not affiliated with Chime.
- Requester: Senior product manager.
- Attorney: Senior product counsel focused on BSA/AML, banking regulation, and payments.
- Themes: onboarding, background checks, payments, deactivation, privacy, and marketing.
- Public reference: Chime, broad public business model only.
- Planned iterations: 10.
- Earlier strict result: 9 matters created, 8 saved research packets, 4 canonical final work products, 3 canonical decisions, 1 recorded approval/delivery, and 0 Closed matters.
- Earlier Run 7 created no matter because the local server was unavailable.

## Required issue outcomes

| ID | Priority | Required outcome |
|---|---:|---|
| COS-001 | P0 | A newly created vault has the same required typed tools and agent permissions as the current shipped vault. |
| COS-002 | P0 | Finalization, approval, local delivery recording, required-work completion, stage, header, board, and reload show one reconciled lifecycle state. |
| COS-003 | P0 | A recorded decision is durable and consistent in the decision register, matter record, recent activity, and reload. Recommendations remain separate. |
| COS-004 | P0 | Save and finalize operations target the canonical work product, preserve useful text, and never claim an unsupported mutation. |
| COS-005 | P1 | Structured intake accepts supported nested JSON/tool arguments and normalizes them once at the provider boundary. |
| COS-006 | P0 | A final intake update supersedes active intake questions. Old intake cards become durable inert history. |
| COS-007 | P1 | Safe retries are idempotent. They do not create duplicate work products, decisions, or equivalent records. |
| COS-008 | P1 | Participants and work items are created, shown, assigned, completed, and reflected in the current work queue. |
| COS-009 | P2 | Historical intake cards have truthful state and no active controls. |
| COS-010 | P1 | Long operations show honest elapsed or continuing state without invented percent, phase, ETA, or cancellation claims. |
| COS-011 | P1 | Internal prompts, paths, IDs, tool syntax, and system instructions do not leak into normal chat or work product. Useful output remains available. |
| COS-012 | P3 | Artifact empty states and save text accurately describe what exists and what changed. |
| ENV-001 | P1 | Polaris or public-research failures expose useful classification, correlation, and recovery evidence while preserving best-effort analysis. |
| ENV-002 | P1 | Local backend and frontend startup, health checks, and logs are stable enough for a 10-run test. |

External browser-plugin failures are experiment-environment evidence. Do not change product code to hide them.

## Agent policy

```yaml
coordinator:
  model: gpt-5.6-sol
  reasoning_effort: medium
implementation:
  model: gpt-5.6-sol
  reasoning_effort: medium
  max_parallel_writers: 6
issue_review:
  model: gpt-5.6-sol
  reasoning_effort: medium
  mode: read-only
  verdicts: one independent verdict per issue ID
code_escalation:
  model: gpt-5.6-sol
  reasoning_effort: high
  mode: read-only
  count: one shared reviewer, used only for unresolved review questions
experiment_requester:
  model: gpt-5.6-luna
  reasoning_effort: medium
experiment_setup_and_attorneys:
  model: gpt-5.6-luna
  reasoning_effort: medium
  live_writes: serial
experiment_synthesis:
  model: gpt-5.6-sol
  reasoning_effort: high
  count: one fresh agent after all live runs
```

Workers and reviewers must not spawn other agents. Reviewers are read-only. No agent may commit, push, deploy, reset, clean, stash, or discard existing changes.

## Execution waves

### Wave 0 — Coordinator audit

Read the project instructions and the live experiment skill. Record the dirty baseline. Use Graphify and focused tests to classify every issue as `already fixed`, `still failing`, or `needs diagnosis`. Do not infer a failure from old evidence when the current dirty tree now passes the acceptance check.

### Wave 1 — Shared contracts, then six parallel Sol Medium chunks

Complete and review `C0-contracts` first. It freezes shared API, structured-intake, progress, actor, and idempotency fields.

Then run these disjoint chunks in parallel:

1. `C1-new-vault-parity` — COS-001.
2. `C2-matter-record-integrity` — COS-002, COS-004, COS-005, COS-006, COS-007, and COS-008 backend behavior.
3. `C3-decision-integrity` — COS-003 and decision retry behavior.
4. `C4-run-reliability` — chat retry behavior, COS-010 backend timing, and COS-011.
5. `C5-polaris-observability` — ENV-001.
6. `C6-local-runtime` — ENV-002.

The one-shot prompt contains exact non-overlapping file lists. A worker must stop and report a newly discovered cross-scope dependency instead of editing another worker's files.

### Wave 2 — Reviews, then two parallel frontend chunks

Review C1 through C6 in parallel. Then run `C7-chat-lifecycle-ux` and `C8-matter-artifact-state` in parallel after their dependencies pass. Review both. Every issue ID receives an explicit independent Sol Medium verdict of `PASS`, `FIX`, or `ESCALATE` with current code, focused checks, and visible acceptance evidence where applicable.

Use `ESCALATE` only when the reviewer cannot resolve a correctness ambiguity, a repeated verification failure, or a cross-chunk conflict after inspecting the evidence. Send only that narrow question to the one shared read-only Sol High reviewer. The original Sol Medium implementer applies any correction. A Sol Medium reviewer then rechecks it.

### Wave 3 — Integration and full verification

The coordinator resolves API seams after all writers stop. Run focused checks, the complete backend suite, frontend checks, browser acceptance, and `graphify update .`. Keep the repository vault unchanged during automated and browser acceptance; use temporary vaults.

### Wave 4 — Fresh-vault live experiment

Use `$live-agent-ux-experiment`. Create one new dedicated test vault through the normal supported product flow. Use one Luna Medium requester, one Luna Medium setup attorney, and ten fresh Luna Medium matter attorneys. Live UI writes are serial. Each matter has a 35-minute wall-clock cap. Later actors receive no earlier findings.

### Wave 5 — Sol High synthesis

After all live runs end, create one fresh Sol High synthesis agent. It receives normalized raw evidence and repository access. It must keep product, browser-control, and environment errors separate. The coordinator checks the synthesis against the raw reports and baseline metrics.

## Required verification

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

Walk `docs/ACCEPTANCE_TESTS.md` in a visible browser against an isolated test vault. Then run the 10-matter experiment in a second, new vault.

## Stop conditions

Stop only when continuing could alter non-test data, contact a real person or service, discard user changes, or when no permitted visible browser can be recovered after the skill's required fallback attempts. Preserve partial evidence and state the exact blocker. Test or provider failures are not a reason to claim completion.

## Parked items

- Real outbound delivery, external account actions, and contact with Chime or any other person or service.
- New research providers, queues, auth, cloud tenancy, embeddings, or verifier pipelines.
- Fuzzy semantic deduplication. Implement deterministic idempotency only.
- Product changes made only to accommodate a browser-control plugin failure.
- Broad redesigns or naming work that do not prove an issue outcome above.
