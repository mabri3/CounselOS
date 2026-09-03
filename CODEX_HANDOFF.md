# Codex handoff prompt

You are the senior coding agent responsible for turning this scaffold into a reliable MVP of Themis.ai.

## Read first

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/BUILD_PLAN.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `README.md`
6. The Markdown configuration and sample data under `vault/`

## Current authoritative checkpoint

The Mosaic Relay R2 UX repair is implemented. It covers `MR2-01` through
`MR2-12` in `docs/experiments/2026-09-03-mosaic-relay-r2-ux-experiment-report.md`.
The full backend suite passes 838 tests. The full frontend UX check, typecheck,
production build, graph refresh, and a visible existing-matter browser check
also pass. A focused Sol High recheck found no remaining material defect after
the dossier-projection and latest-request refresh corrections. Read
`current.md` for the exact visible evidence and current queue.

The Themis.ai workflow reconciliation build is complete. Its authoritative
plan, execution record, and reusable prompt are:

- `docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`
- `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md`
- `docs/themis-ai-workflow-reconciliation-build.handoff-prompt.md`

The full backend suite passes 629 tests. All focused frontend checks, the older
lifecycle check, typecheck, production build, graph refresh, fresh visible
workflow demo, SQLite rebuild, and repository-vault guard pass. The combined
Sol Medium review passed all 12 groups. No Sol High engineering escalation was
required.

There is no active or Next checkpoint. Read `current.md` before new work. Start
only from an explicit Later item or a new user request.

## Product objective

Build a product-counsel workspace that reduces cognitive load and eliminates setup work. The lawyer should quickly understand what the matter is, what work has already happened, and what decision or action is next.

The application is a subway, not the destination: it gets the lawyer from unstructured intake to the stop near the final work. The lawyer performs the last mile.

## Mandatory product assumption

Legal perfection is not a requirement. Do not add mandatory legal-answer guardrails, reviewer vetoes, confidence gates, multi-agent consensus, or refusal behavior merely because the subject is legal. The assistant should deliver the best useful work it can, state material assumptions or uncertainty briefly, and keep moving toward work product.

Do preserve the separation between an AI recommendation and a formally recorded user decision. That is data integrity, not an answer-quality gate.

## Engineering constraints

- Keep the MVP small and runnable.
- Prefer boring, testable code.
- Keep files focused and generally under 300 lines.
- Preserve Markdown as the source of truth.
- Treat SQLite as a rebuildable index.
- Keep model providers behind the existing interface.
- Keep agents, tools, schedules, and workflows editable through Markdown.
- Do not execute arbitrary code embedded in Markdown.
- Keep all file operations inside the configured vault.
- Do not add a cloud database, authentication, Docker orchestration, a message broker, embeddings, or Tauri until the local web workflow is working.
- Do not rewrite the stack unless a concrete blocker is demonstrated.

## Working method

For each wave:

1. Run the current tests and app.
2. Identify the smallest missing behavior that prevents the acceptance scenario.
3. Implement it.
4. Add or update a test.
5. Verify the UI manually where appropriate.
6. Update documentation only when behavior changed.
7. Leave the application in a runnable state.

## Historical initial task order

This order describes the original scaffold. It is not the current backlog.
Use the authoritative checkpoint above for current work.

1. Make backend tests pass.
2. Start backend and verify `/api/health`, `/api/config`, `/api/matters`, `/api/decisions`, and `/api/automations`.
3. Install frontend dependencies and make `npm run typecheck` and `npm run build` pass.
4. Walk Acceptance Scenarios A through G.
5. Fix end-to-end mismatches between API contracts and frontend types.
6. Configure one real OpenAI-compatible model and verify tool calling.
7. Improve loading, errors, and empty states.
8. Add token streaming only after the non-streaming workflow is reliable.

## What not to build yet

- Native Word tracked changes
- Native PDF editing
- Full collaboration
- Multi-tenant cloud architecture
- Legal research citator integrations
- Reviewer/quorum agent systems
- Autonomous final decisions
- Arbitrary shell execution
- General marketplace/plugin platform

## Definition of success

A lawyer can create or ingest a matter, understand it immediately, ask the assistant to do useful work, run research, edit the output, move the matter through the legal workflow, record or review a decision, and create an automation—without reconstructing state manually.
