# Handoff plan — Counsel OS attention audit and Matter Records

## Goal

Implement `docs/ATTENTION_AUDIT_IMPLEMENTATION_PLAN.md` with Sol Light workers and one Sol Medium orchestrator/reviewer. Preserve the matter as the root work container. Keep the dossier as an optional summary. Make the left tree narrow and understandable without changing the default `matter.md` agent context.

## Step 1 — context and baseline

1. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/ACCEPTANCE_TESTS.md`, and `docs/ATTENTION_AUDIT_IMPLEMENTATION_PLAN.md` completely.
2. If `graphify-out/graph.json` exists, run a graphify query about the audit implementation before raw code browsing.
3. Read `docs/attention-audit-matter-records.handoff-progress.md` and start at the first pending step.
4. Record `git status --short`. The tree is dirty. Preserve all existing user changes.
5. Run the baseline from the correct folders.
6. Expected baseline: front-end type check and build pass; backend has 127 passes and exactly three existing failures in `tests/test_annotations.py`. Stop if there is a new or different failure.
7. Mark Step 1.

## Step 2 — Wave 1

Create one external snapshot that includes every Wave 1 owned path. Dispatch three workers in parallel. Use `gpt-5.6-sol` with low reasoning. Give each worker the full Chunk 1A, 1B, or 1C specification from the implementation plan. Tell each worker:

- edit only its owned paths;
- preserve existing work;
- do not spawn agents;
- do not commit, push, deploy, or run shared front-end checks;
- return the exact changed-file list and a self-review.

Chunk 1A owns the matter workspace, tree, chat, decision modal, document panel, action helper, and global CSS. Chunk 1B owns Today, Workspace, Matters, shared attention/date helpers, table/stage views, and deletes only `MattersTimeline.tsx`. Chunk 1C owns Decisions and Research.

As each worker returns, review it against its snapshot and mark the matching chunk only after acceptance.

## Step 3 — Wave 1 gate

After all workers stop:

1. Check ownership and shared contracts.
2. Verify `matter.md` remains the default agent active file.
3. Verify the initial visual tree selection is empty without a file route.
4. Verify all Matter Records nodes map to existing paths exactly once.
5. Verify decision rationale is visible and editable.
6. Resolve CSS and date-helper seams.
7. Run `npm run typecheck` and `npm run build` from `frontend`.
8. Fix only integration problems.
9. Mark Step 3.

## Step 4 — Wave 2

Create a new external snapshot for every Wave 2 owned path. Dispatch three low-reasoning `gpt-5.6-sol` workers in parallel.

- Chunk 2D implements the schedule enable/disable endpoint, service behavior, front-end controls, and focused tests.
- Chunk 2E simplifies Settings, Agents, and Skills while keeping their object models separate.
- Chunk 2F updates acceptance and product documents. It must not write observed results.

Give each worker its exact ownership and the same shared-tree rules. Review each result and mark the matching chunk only after acceptance.

## Step 5 — Wave 2 gate

After all workers stop:

1. Review ownership and all changes.
2. Run the focused scheduler and automations API tests.
3. Run front-end type check and build.
4. Confirm schedule resume sets a future `next_run_at` and does not run immediately.
5. Confirm Settings and Agents keep technical data under Advanced without changing storage formats.
6. Fix only integration defects.
7. Mark Step 5.

## Step 6 — full checks

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

Accept the backend result only if the same three annotation failures remain and there is no new failure. Mark Step 6.

## Step 7 — isolated browser acceptance

Use the browser-control skill. Use a copied temporary vault and temporary runtime files. Do not change the user's main vault. Walk the updated acceptance checks at 1280×720, 1024 pixels, and 768 pixels. Test keyboard access and the browser console. Test the Matter Records mapping, default context, optional dossier behavior, visible rationale, cancel/record behavior, research empty state, decisions, responsive tables, and schedule resume. Record dated results only after the walk. Mark Step 7.

## Step 8 — final review

Review the full diff against the audit matrix and scope limits. Confirm no existing user work was reverted. Report changed files, checks, the three known backend failures, and any true remaining risk. Mark Step 8 only when no required work remains.

## Stop conditions

Stop and ask the user only if:

- a requested change requires a data migration outside the plan;
- a required file has incompatible user edits that cannot be preserved;
- baseline failures differ from the recorded three;
- a new external service or product decision is required;
- the implementation would change matter/dossier semantics.

Do not stop for ordinary integration work. State a small assumption and continue when it stays inside this plan.

