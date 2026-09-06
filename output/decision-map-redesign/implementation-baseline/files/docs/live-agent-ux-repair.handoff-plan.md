# Handoff plan — Live-agent UX repairs

## Objective

Finish and verify the repair defined in `docs/LIVE_AGENT_UX_REPAIR_BUILD_PLAN.md`. The implementation is present in the shared working tree. Do not recreate accepted work. Use the progress file to resume at the first pending step.

## Fixed model policy

```yaml
parallel:
  max_active_workers: 3
  implementers:
    provider: codex
    model: gpt-5.6-sol
    effort: medium
  reviewer:
    provider: codex
    model: gpt-5.6-sol
    effort: medium
    mode: read-only
  escalation:
    provider: codex
    model: gpt-5.6-sol
    effort: high
    when: only when the Medium reviewer finds a material issue and cannot determine a concrete correction
```

Use one shared tree. Workers must not spawn agents, commit, push, deploy, create worktrees, or edit outside their assigned ownership. The reviewer must not edit.

## Implemented chunks

### A — Artifact, lifecycle, context, and tool contracts

Core files:

- `backend/app/tools/handlers.py`
- `backend/app/agents/runner.py`
- `backend/app/agents/context.py`
- `backend/app/routers/matters.py`
- `backend/app/services/work_product.py`
- related backend tests
- live and fixture tool declarations

Delivered behavior:

- Recommendations do not become finalizable work-product cards.
- The typed tool can revise an existing canonical mutable draft.
- Revision and finalization require the configured draft folder or the supported legacy draft folder.
- API finalization moves Generate to Respond once and never moves a later stage backward.
- Durable decisions are included in context and malformed optional decision details do not block an agent turn.

### B — Intake actions and research source hygiene

Core files:

- `backend/app/routers/chat.py`
- `backend/app/services/research.py`
- related backend tests

Delivered behavior:

- Only `intake-*` card actions use automatic intake persistence and research behavior.
- Skip and stop are deterministic and do not start research.
- Partly, change, and other answers with detail save clarification without starting research.
- Non-intake question answers still reach the model and do not become intake facts.
- Internal research source lines use clean labels and bounded body excerpts.

### C — Matter workspace behavior

Core files:

- `frontend/components/NewMatterForm.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/lib/research.ts`
- focused frontend checks

Delivered behavior:

- Review intake opens `request.md`.
- Recommendation state refreshes once when new matter detail arrives.
- Single-choice answers require an explicit Continue action.
- Clarification choices collect detail.
- Decision recording shows saved, refresh-retry, and confirmed states without duplicate creation.
- New matter ownership uses the configured lawyer name or stays unassigned.
- Source cards hide internal vault paths and raw frontmatter.

## Review result

The read-only Sol Medium reviewer first found five issues:

1. intake rules intercepted non-intake cards;
2. optional decision context could fail the full agent turn;
3. draft validation trusted metadata outside canonical folders;
4. recommendation reload made duplicate requests;
5. transport and Markdown preservation checks were too weak.

All five corrections are present. The same reviewer checked the correction diff and reported no unresolved material issue. No Sol High escalation was needed.

## Resume and verification

1. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, the build plan, this plan, and the progress file.
2. Record `git status --short`. Preserve all existing changes.
3. Do not redo a completed progress item unless its check now fails.
4. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q

cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run check:workspace-ux
npm run typecheck
npm run build
```

5. If application code changes, run `graphify update .` from the repository root.
6. If the in-app browser is available, walk the payoff test in `docs/LIVE_AGENT_UX_REPAIR_BUILD_PLAN.md` with an isolated test matter. Do not treat browser-tool or server availability failures as product failures.
7. Update the progress file immediately after each accepted step.

## Blocker and escalation policy

- A failed test is not automatically an escalation. Diagnose it and make the smallest in-scope correction.
- Ask the user only when a product choice changes the required result.
- A Medium reviewer may request Sol High only with this exact structure:

```text
ESCALATION REQUIRED
Issue:
Evidence:
Why Sol Medium could not resolve it:
Files involved:
Checks already run:
```

- Sol High remains read-only. The Sol Medium coordinator applies an accepted correction and reruns proportionate checks.

