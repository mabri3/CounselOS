# Codex handoff prompt

## Research-first dossier checkpoint — September 11, 2026

Manual unrestricted dossier generation now creates a saved setup card before
research starts. The lawyer can edit priorities, choose the first three or all
mapped issues, select sources, and then Start. One durable parent owns normal
research children, publishes the first three as a useful first dossier, and can
publish a later review revision. Stop, same-vault restart, Resume, saved-only
generation, preview, exact revision links, and saved-conversation hydration work
in both experimental and standard matter chat.

The isolated five-issue browser fixture used ports 8199 and 3199 and the owned
vault under `output/dossier-research-first/browser-vault`. It proved real card,
button, editor, citation, reload, and recovery behavior with deterministic model,
search, and fetch boundaries. Exact results are in
`output/dossier-research-first/browser-results.md`. Full-suite and final Step 12
evidence are in `output/dossier-research-first/pytest.xml` and `step-12.md`.
Step 13 remains: run one bounded configured-model quality check on a separate
synthetic matter. Do not use Harbor or change the selected model.

The first fixture smoke attempt rebuilt the disposable SQLite index in the saved
active Mosaic Relay vault before it failed. It did not change the active pointer
or Markdown source files. The fixture now constructs `AppContext` directly from
its owned vault and refuses configured or saved-active vault paths. See the Step
12 safety record before any future fixture reset.

## Matter-path implementation checkpoint — September 10, 2026

The isolated worktree includes preserved solution paths, a single mainline pointer, per-conversation focus, bounded working notes, shared editable/frozen guidance and bounded source/archive reads. Full backend check passed 1,480 tests. Frontend typecheck/build and both scripted browser stories passed, with limits in `docs/matter-memory-paths.verification.md`. Source-library baseline changes were preserved before this work. The saved source checkout remains unchanged. No paid semantic evaluation ran; use the frozen evaluation artifacts before any later authorized benchmark. Changes are uncommitted and undeployed.


You are the senior coding agent responsible for maintaining the runnable local MVP of Themis.ai.

## Read first

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/BUILD_PLAN.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `README.md`
6. The Markdown configuration and sample data under `vault/`

## Phase 2 UI checkpoint — September 6, 2026

The Phase 2 pages now use the selected A-style references. This includes Today,
portfolio and intake, Decisions, Briefing and Watches, templates and skills,
agent administration, automations, Settings, and the research reader. Matter
and decision-map interiors keep their compact presentation. Shared components
use optional Phase 2 variants and preserve their default Matter presentation.

Evidence and measured differences are in
`output/uiphase2-implementation/visual-matrix.md` and `browser-demo.md`.
Required backend tests passed 1,222 cases; final frontend typecheck and build
passed. One focused continuity check still expects three refresh endpoints,
while unchanged baseline code uses a fourth (`/handoff-references`). This is
recorded as a failure, not a passed check. Browser mutation tests used an isolated
vault and mock providers. The user waived 200% zoom. Real vault files and the
active pointer are unchanged. See `docs/uiphase2-a-style-ui.handoff-progress.md`
for the final review state and exact model routing.

## Current authoritative checkpoint

The September 5 lawyer workflow expansion implements all four approved areas:
clear orientation, business fact replies, generic local lawyer handoffs, and
changed-specification impact through the existing conversation and editor.
The current implementation, independent review, exact evidence and limits are
in `docs/lawyer-workflow-expansion.verification.md` and its usability report.
Use `docs/lawyer-workflow-expansion.handoff-progress.md` for the final check state.

The final backend suite passed 1,149 tests, including the final read repairs. Frontend typecheck and the workspace
UX, single-lawyer and lawyer-continuity groups passed. The connected Harbor
browser story includes configured-model reassessment, handoff brief, source
comparison and tracked draft revision, selected Word/PDF export, explicit
approval/delivery/work completion/closure, and a preserved return visit. Final
cold-load, return, editor, native zoom and cleanup checks passed. The normal
frontend build is restored. Read the verification report for measured limits
and the two unregistered legacy source-string checks.

Markdown is authoritative. SQLite is disposable. View as is a local simulation,
not authentication. Keep reported speakers distinct from entering lawyers;
keep proposals distinct from decisions, approval, delivery and closure. Preserve
local edits and frozen action identities across retries and person changes.

Earlier Mosaic Relay, reconciliation and single-lawyer results are historical.
Their counts do not describe this build. Read `current.md` before new work.

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
