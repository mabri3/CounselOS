# Live-agent UX repair build plan

## Goal

Repair the product defects confirmed after the ten-matter live-agent run. A fresh attorney must be able to open a matter, answer focused intake questions, produce and revise legal work, finalize the correct artifact, record a decision, and understand the next action after reload.

This plan does not treat the contaminated relay experiment as proof of subjective usability. It uses the run only to identify reproducible product defects, and it verifies each defect in code or with a regression test.

## Payoff test

1. Open a matter with a target date. The saved matter and request show that date.
2. Select **Review intake**. Counsel OS opens `request.md`, not the nearly empty `matter.md` body.
3. Answer a focused question. An answer that needs detail stays in intake. **Skip** and **No more questions** do not start research.
4. Ask Themis to save a recommendation. The card opens the recommendation and never offers **Finalize**.
5. Ask Themis to create or revise a response draft. The card opens the canonical draft and offers **Finalize**.
6. Finalize the response. The immutable final is created and a Generate matter moves to Respond.
7. Record a durable decision. The UI confirms success after persisted state reloads, and later agent context includes the decision.
8. Reload the matter. The latest recommendation, decision, next action, and clean source labels remain correct.

## Confirmed repair scope

| Defect | Required result |
| --- | --- |
| Recommendations appear as finalizable work products | Recommendation saves return a recommendation record result, not a generic draft card. Only canonical work-product drafts can show **Finalize**. |
| The agent cannot revise its existing canonical draft | `save_work_product` accepts an optional existing canonical draft path and revises that mutable draft safely. It cannot revise a final file or another matter. |
| Finalization leaves Generate matters in the wrong stage | A successful finalization through the matter API moves Generate to Respond. Retries remain idempotent. Later stages never move backward. |
| Current decisions are missing from agent context | Context includes the matter's durable decision records with clear labels and bounded content. |
| Single-choice intake commits too early | Choice selection and submission are separate. The user can add detail for **Partly** or **Something else** before continuing. |
| Every intake answer starts research | Only a direct, complete intake answer can start the existing automatic research path. **Skip**, **No more questions**, and clarification answers do not. |
| Tool text does not match tool behavior | Declarative tool schemas and descriptions match required paths, protected records, draft creation, and draft revision. Test fixtures stay in sync. |
| Review intake opens the wrong file | The control opens immutable `request.md`. |
| Recommendation display becomes stale | Matter reload and successful chat refresh re-read `recommendations.md`, even when the path does not change. |
| Decision recording has weak feedback | Keep the modal open through reload, then show a clear persisted success state before close or in the matter workspace. |
| Research source UI exposes internal paths and frontmatter snippets | Store useful internal evidence, but render a clean document label and excerpt. Do not show vault paths or raw frontmatter to the lawyer. |
| New matter owner is hard-coded | Use the configured lawyer name when available. If none is configured, leave ownership unassigned. Do not invent a person. |

## Verification-only findings

These items were reported in the live run but are not yet proven defects in the current code. Do not change them without a failing regression test.

- Target date loss: the controlled form, API model, and Markdown writer already pass `target_date`. Add a regression check around the API and verify the browser flow. Fix only if the check reproduces the loss.
- Markdown tables and H1 formatting: the document panel already has a raw Markdown mode, and the rich editor supports headings. Verify that switching modes preserves a pipe table and H1. Add rich table editing only if preservation fails.
- Automatic privilege classification: changing the default is a policy decision, not a narrow defect repair. Record it as follow-up unless a current requirement defines the correct value.
- Automatic lifecycle advancement after orientation: work-item completion and stage movement are intentionally separate. Fix false **No action needed** signals, but do not add a rigid workflow state machine.

## Architecture limits

- Keep Markdown as the source of truth and SQLite as a disposable index.
- Reuse `MatterService`, `WorkProductService`, `ContextBuilder`, chat cards, and the current document editor.
- Do not add a queue, new database, verifier agent, confidence gate, or workflow engine.
- Recommendations remain separate from durable decisions and final work products.
- Do not expose internal vault paths in user-facing research source cards.
- Preserve existing files and all unrelated working-tree changes.

## Parallel execution

Run three `gpt-5.6-sol` implementers with `medium` reasoning in one shared tree. Workers must not spawn agents, commit, push, deploy, or edit outside their ownership.

### Chunk A — Artifact, lifecycle, context, and tool contracts

Owned files:

- `backend/app/tools/handlers.py`
- `backend/app/agents/runner.py`
- `backend/app/agents/context.py`
- `backend/app/routers/matters.py`
- `backend/app/services/work_product.py`
- `backend/tests/test_matter_action_tools.py`
- `backend/tests/test_work_product.py`
- `backend/tests/test_matter_action_api.py`
- `backend/tests/test_agents.py`
- `backend/tests/test_chat_history.py` only for artifact-card assertions
- `vault/00_System/tools/save_work_product.md`
- `vault/00_System/tools/write_markdown.md`
- matching files under `backend/tests/fixtures/vault/00_System/tools/`

Checks:

```bash
cd backend
.venv/bin/python -m pytest -q tests/test_matter_action_tools.py tests/test_work_product.py tests/test_matter_action_api.py tests/test_agents.py tests/test_chat_history.py
```

### Chunk B — Intake actions and research source hygiene

Owned files:

- `backend/app/routers/chat.py`
- `backend/app/services/research.py`
- `backend/tests/test_chat_runs.py`
- `backend/tests/test_research.py`
- new focused backend test files for these two services

Checks:

```bash
cd backend
.venv/bin/python -m pytest -q tests/test_chat_runs.py tests/test_research.py
```

### Chunk C — Matter workspace and browser-facing behavior

Owned files:

- `frontend/components/NewMatterForm.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/components/DocumentPanel.tsx` only if a preservation check fails
- `frontend/components/MarkdownRichEditor.tsx` only if a preservation check fails
- `frontend/lib/research.ts`
- focused files under `frontend/scripts/`
- `frontend/package.json` only to add a focused check script; do not add a dependency unless required by a failing preservation test

Checks:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
npm run build
```

## Integration gates

1. Confirm each worker changed only owned files.
2. Inspect all diffs and resolve cross-chunk assumptions centrally.
3. Run the complete backend suite.
4. Run frontend typecheck and production build.
5. Run `graphify update .`.
6. Walk the payoff test in the browser with an isolated test matter when the local app is available.

## Independent review and escalation

After integration, run one read-only reviewer using `gpt-5.6-sol` with `medium` reasoning. The reviewer checks the combined diff, tests, record integrity, UX states, security boundaries, and the payoff test. The reviewer does not edit files and does not review its own work.

If that reviewer identifies a material issue but cannot give a concrete correction after inspecting the relevant code and tests, it must return:

```text
ESCALATION REQUIRED
Issue:
Evidence:
Why Sol Medium could not resolve it:
Files involved:
Checks already run:
```

Only then run one `gpt-5.6-sol` reviewer with `high` reasoning for that specific issue. The high-reasoning reviewer is also read-only. The coordinator applies any accepted correction and reruns proportionate checks.

## Done condition

- Every confirmed defect has a regression test or focused executable check.
- All accepted changes are present in the shared tree.
- Full backend tests, frontend typecheck, and frontend build pass.
- The independent review has no unresolved material finding.
- Any verification-only item is either proven and fixed or clearly recorded as not reproduced.
