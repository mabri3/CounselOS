# Mosaic Relay R2 UX repair handoff plan

## Outcome

One Sol Medium implementer should repair the confirmed record-integrity and workflow defects first. Then it should repair the misleading state and repeated cognitive-load problems. Keep the existing architecture. Do not add agents, services, queues, verifiers, legal-quality gates, or new persistence systems.

The implementation source is the accepted backlog `MR2-01` through `MR2-12` in `docs/experiments/2026-09-03-mosaic-relay-r2-ux-experiment-report.md`. The blueprint in `docs/mosaic-relay-r2-ux-repair-blueprint-2026-09-03.md` defines current contracts and control mappings.

## Scope rules

- Preserve Markdown as the source of truth. SQLite remains a disposable index.
- Preserve useful assistant output, successful tool work, partial research, and changed paths after failures.
- Keep recommendations separate from recorded decisions.
- Keep approval, delivery, required-work, and closure guards.
- Do not create content to fill an empty Briefing.
- Do not treat public-research timeout as a product bug.
- Do not turn missing citations into a refusal.
- Do not use the generic stage tool to bypass lifecycle actions.
- Preserve all pre-existing dirty changes. Read the current diff before every edit.

## Required order

### Phase 1 — Record integrity and lifecycle truth

Implement these items serially. Run focused tests after each item.

#### MR2-03 — Typed lifecycle action wording

- Priority: P1.
- Owners/files: `backend/app/agents/output.py`, `backend/app/services/chat_runs.py`, `backend/app/routers/chat.py`, `frontend/components/ChatCards.tsx`, `frontend/components/ChatPanel.tsx`, `backend/tests/test_agents.py`, `backend/tests/test_chat_history.py`.
- Dependencies: none.
- Implementation:
  1. Add a closed list of button-like lifecycle text patterns for Approve, Edit, Hold, Finalize, Mark Delivered, and Close.
  2. Reconcile prose only after typed operation results are final.
  3. When a matching `confirmation_required` result exists, remove pseudo-controls and keep the real card.
  4. When no matching result exists, remove the pseudo-control or unsupported success sentence and append a factual no-change status.
  5. Preserve useful legal analysis and recommendations around the removed text.
- Tests: use exact run-09 and run-10 prose shapes; cover `confirmation_required`, `changed`, `failed`, `no_change`, history reload, and analysis preservation.
- Visible acceptance: no bracket text looks actionable; each action button has a typed proposal; completion wording matches the canonical matter record.
- Risks: broad regex can remove ordinary legal language. Match only closed button syntax and closed lifecycle success claims.

#### MR2-04 — Valid close path

- Priority: P1.
- Owners/files: `backend/app/blank_vault_template/00_System/tools/move_matter_stage.md`, `backend/app/tools/handlers.py`, `backend/app/services/matter_lifecycle.py`, `backend/app/blank_vault_template/00_System/agents/counsel-copilot.md`, `backend/tests/test_agents.py`, `backend/tests/test_matter_action_tools.py`, `backend/tests/test_matter_lifecycle.py`, `backend/tests/test_chat_history.py`.
- Dependencies: MR2-03, so returned recovery wording cannot become another false control.
- Implementation:
  1. Remove `closed` from the generic stage enum.
  2. Guard `move_matter_stage` against `closed` for old vault tool specs.
  3. Return a typed recovery result that points to the explicit `close_matter` action.
  4. For explicit close intent, use the existing confirmation flow and report the first unmet canonical prerequisite.
  5. Keep approval, delivery, and required-work checks unchanged.
- Tests: new and legacy tool specs; explicit close confirmation; idempotent apply; missing final, approval, delivery, and required work.
- Visible acceptance: no `move_matter_stage failed` message appears for close intent. The lawyer sees a real Close action or one exact prerequisite.
- Risks: old vaults retain declarative tool files. The handler guard is required even after template repair.

#### MR2-01 — Stable document-end insertion

- Priority: P1.
- Owners/files: `frontend/components/MarkdownRichEditor.tsx`, `frontend/components/RevisionPlugin.tsx`, `frontend/components/DocumentPanel.tsx`, a new focused editor interaction harness under `frontend/scripts/` only if no existing harness can exercise Lexical.
- Dependencies: none.
- Implementation:
  1. Reproduce the selection state with a real Lexical editor before changing code.
  2. Register one modified-End behavior owned by the editor.
  3. Move the caret to the end of the last editable block after review synchronization.
  4. Keep bare Home/End, tables, lists, comments, and Markdown conversion unchanged.
- Tests: Ctrl+End and Meta+End on H1 plus paragraphs, list, and table; type; save; reopen; compare existing content.
- Visible acceptance: text appends after the last block in all shapes; the H1 never changes.
- Risks: the current cause is Likely, not Confirmed. Stop and trace selection if the test does not reproduce.

#### MR2-02 — Saved-content read-back

- Priority: P1.
- Owners/files: `frontend/components/DocumentPanel.tsx`, `frontend/lib/api.ts`, existing document endpoint tests, `frontend/scripts/check-transport-preservation.ts` plus a real browser interaction test.
- Dependencies: implement after MR2-01 so the round-trip test covers the repaired keyboard path.
- Implementation:
  1. Capture the exact Markdown submitted by Save.
  2. Read the canonical document after the save response.
  3. Compare with only the repository's existing trailing-newline normalization.
  4. Show `Saved` only on equality.
  5. On mismatch or read failure, keep local text, show a conflict state, and offer retry or reload without data loss.
- Tests: equality, newline normalization, mismatch, read failure, concurrent change, and reload persistence.
- Visible acceptance: `Saved` always survives reopen; mismatch never displays `Saved`; local text remains recoverable.
- Risks: do not overwrite a newer server version. Do not lose review metadata or comments.

### Phase 2 — Failure recovery and canonical state

#### MR2-05 — Safe chat failure classes

- Priority: P1.
- Owners/files: `backend/app/agents/runner.py`, `backend/app/services/chat_runs.py`, `backend/app/models/api.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/tests/test_agents.py`, `backend/tests/test_chat_runs.py`, `frontend/scripts/check-chat-run-recovery.ts`.
- Dependencies: MR2-03 for output reconciliation.
- Implementation:
  1. Add a closed, safe `failure_class` field to the existing chat-run data contract.
  2. Assign classes only at known provider, output-shape, tool-validation, tool-execution, and timeout boundaries.
  3. Persist correlation ID for server diagnosis and a safe UI recovery sentence.
  4. Preserve all partial reply, trace, operation results, and changed paths before setting failed state.
  5. Keep `unknown` when evidence does not support a class.
- Tests: one injected failure per boundary; partial useful reply; earlier successful tool; reload; retry; safe copy.
- Visible acceptance: a failed card says what failed, what was saved, and the next action. No useful output disappears.
- Risks: do not expose provider URLs, raw exceptions, secrets, paths, or internal IDs.

#### MR2-06 — Deterministic intake recovery

- Priority: P2.
- Owners/files: `backend/app/routers/chat.py`, `backend/app/agents/runner.py`, `backend/app/services/chat_runs.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/tests/test_chat_runs.py`.
- Dependencies: MR2-05 for a stable recovery-failure signal.
- Implementation:
  1. Keep one provider recovery attempt.
  2. If it fails, select the next unresolved question only from saved open questions or missing-fact state.
  3. Emit one normal typed question card.
  4. If no grounded question exists, emit a Review/Finish intake state.
  5. Make repeated Retry idempotent.
- Tests: failed provider fallback, no question, duplicate prevention, answered-question exclusion, reload, repeated retry.
- Visible acceptance: after one recovery failure, an answerable card or a clear finish action appears.
- Risks: do not invent a legal question or ask an answered question.

#### MR2-07 — Canonical recommendation overview

- Priority: P2.
- Owners/files: `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matter-workspace.ts`, `frontend/lib/types.ts`, `frontend/scripts/check-workspace-ux.ts`.
- Dependencies: none.
- Implementation:
  1. Seed visible recommendation content and version from `detail.recommendation`.
  2. Treat `getRecommendation` as supplemental version history.
  3. Do not replace canonical content with empty text on fetch failure.
  4. Ignore stale fetch responses by matter ID and version ID.
  5. Reconcile after direct save and matter reload.
- Tests: immediate content, slow fetch, fetch failure, stale response, save, confirmed deletion.
- Visible acceptance: the editor and overview always state the same recommendation presence and version.
- Risks: confirmed deletion must still clear the overview.

#### MR2-08 — Shared dossier work-state projection

- Priority: P2.
- Owners/files: `backend/app/services/dossier.py`, `backend/app/services/recommendations.py`, `backend/app/services/work_product.py`, `backend/app/services/research.py`, `backend/app/services/matters.py`, `frontend/components/MatterWorkspace.tsx`, `backend/tests/test_dossier.py`, `backend/tests/test_recommendations.py`, `backend/tests/test_work_product.py`, `backend/tests/test_research.py`.
- Dependencies: MR2-07 establishes the canonical recommendation display contract.
- Implementation:
  1. Extract the current work-state projection into one shared in-process method.
  2. Read recommendation, draft, final, and next action from canonical records.
  3. Call it after successful recommendation, work-product, and research pointer mutations.
  4. Preserve the dossier hash guard.
  5. Return `applied`, `not_required`, or `review_required` through existing mutation results.
  6. Show a direct review link for `review_required`.
  7. Keep the primary mutation successful if dossier projection fails.
- Tests: each caller, one projection per mutation, hash conflict, exception, no duplicate rebuild, visible revision link.
- Visible acceptance: the dossier matches canonical work after refresh or clearly says that an update needs review.
- Risks: avoid circular imports and repeated full index rebuilds. Do not overwrite lawyer-edited dossier text.

#### MR2-09 — Required and optional work labels

- Priority: P2.
- Owners/files: `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matterActions.ts`, `frontend/lib/types.ts`, `backend/app/services/matter_lifecycle.py`, `frontend/scripts/check-workspace-ux.ts`, `backend/tests/test_matter_lifecycle.py`.
- Dependencies: MR2-04 preserves the close contract.
- Implementation:
  1. Show `Required` or `Optional` on every open work row.
  2. Split the open counts.
  3. Show all remaining required blockers in the lifecycle area before Close.
  4. Keep optional work open after closure.
- Tests: mixed queue, required blocker, optional open after close, accessible text.
- Visible acceptance: a lawyer can identify closure blockers without clicking Close.
- Risks: do not make optional work mandatory.

### Phase 3 — Repeated cognitive load

#### MR2-10 — Scoped pending feedback

- Priority: P2.
- Owners/files: `frontend/components/MatterWorkspace.tsx`, `frontend/lib/api.ts`, `backend/app/services/matter_participants.py`, `backend/app/services/matter_work_items.py`, `backend/tests/test_matter_records.py`, `backend/tests/test_matter_lifecycle.py`, `frontend/scripts/check-workspace-ux.ts`.
- Dependencies: none.
- Implementation: use action keys instead of one broad `busy` value for participant and owner mutations; show exact pending and saved labels; update from the mutation result; reconcile by reload; profile the full index rebuild before changing index code.
- Tests: slow success, error rollback, duplicate click, unrelated controls, reload.
- Visible acceptance: feedback is immediate and one click creates one record.
- Risks: optimistic state must never replace canonical state.

#### MR2-11 — Durable progress milestones

- Priority: P2.
- Owners/files: `backend/app/services/chat_runs.py`, `backend/app/agents/runner.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, chat recovery tests.
- Dependencies: MR2-05 supplies safe failure and milestone data.
- Implementation: show only existing durable milestones and last safe successful tool summary; keep elapsed time and background behavior; do not add streaming or percentages.
- Tests: long run, navigation/reconnect, partial save, failure, empty milestone fallback.
- Visible acceptance: after 15 seconds, the lawyer sees the last known durable step and knows that navigation is safe.
- Risks: sanitize summaries before display.

#### MR2-12 — Compact guided intake history

- Priority: P2.
- Owners/files: `frontend/components/ChatPanel.tsx`, `frontend/components/ChatCards.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/app/blank_vault_template/00_System/agents/intake-agent.md`, `frontend/scripts/check-adaptive-intake.ts`.
- Dependencies: MR2-06 should land first so current versus superseded cards are reliable.
- Implementation: keep the saved transcript unchanged; collapse superseded intake turns to question, answer, and state; keep an Expand action; explain `Answer a set` before long sequences; ask the intake agent for only changed assessment after the first turn.
- Tests: current and superseded cards, conflicts, skipped answers, expansion, set mode, transcript persistence.
- Visible acceptance: the current question stays in view after a nine-question intake; all history remains available.
- Risks: never hide a conflict, material assumption, or active question.

## Items that the Medium implementer must not repair in this pass

- Company website `Leave blank`: current code and tests already skip it. Reproduce first.
- Empty Briefing: no Watch-produced development records were present.
- Public-research timeout: preserve the current partial packet and support labels.
- Automatic work-item creation from analysis prose: no such action was requested.
- `Continue from saved research`: prepared-not-sent is deliberate and safe.
- The canonical work-product and required-work guards: preserve them.
- Matter risk versus decision risk: these are separate records. Do not synchronize them automatically.

## Verification after each phase

1. Run the focused backend tests named in the changed items.
2. Run the relevant frontend checks.
3. Run the full required commands:

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

4. Run `graphify update .` after application code changes.
5. Walk the affected flows in `docs/ACCEPTANCE_TESTS.md` with the visible browser.
6. Re-run these R2 cases with fictional test data:
   - editor Ctrl/Meta+End, save, reload;
   - approval, delivery, and close through chat and direct controls;
   - failed chat after useful output;
   - failed intake recovery;
   - saved recommendation during slow supplemental fetch;
   - mixed required and optional work;
   - long background run and reconnect.

## Completion checkpoint

The Medium implementer is done only when all changed tests pass, the full backend/frontend verification passes, and the visible acceptance checks show no false action claim, no editor data loss, and no lifecycle bypass. Report any live-provider root cause as Unknown unless a correlation trace proves it.
