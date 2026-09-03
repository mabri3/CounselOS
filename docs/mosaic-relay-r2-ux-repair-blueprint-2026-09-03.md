# Mosaic Relay R2 UX repair blueprint

## Purpose

This blueprint maps each accepted R2 repair to the current source of truth, data contract, UI control, and test proof. It is for one Sol Medium implementer. It does not authorize new product scope.

## Current sources of truth

| Domain | Canonical state | Derived or display state | Rule |
|---|---|---|---|
| Document content | `VaultDocument.content` read by `GET /files?path=...` and saved to Markdown | Lexical editor state, dirty flag, review preview | `Saved` is valid only when canonical read-back equals the submitted Markdown. |
| Recommendation | Matter `recommendations.md` and `RecommendationState.current_version_id` | Overview summary and recommendation editor | A fetch failure must not turn a canonical saved recommendation into an empty display. |
| Decision | Append-only decision record | Decision cards, workspace summary | Never update a decision because a recommendation changed. |
| Matter lifecycle | `matter.md` approval, delivery, close timestamps and event paths | Stage, next-action text, direct controls, chat prose | Typed lifecycle results and canonical matter metadata control all success claims. |
| Work requirements | Work-item Markdown `required` and `status` | Queue counts and close guidance | Required open work blocks closure. Optional open work does not. |
| Chat execution | Chat-run Markdown with state, response, trace, operation results, and changed paths | Run card, transcript, Retry, typed cards | Preserve partial useful output. Never infer a mutation from prose. |
| Intake | Saved intake conversation, facts, open questions, and question cards | Current/superseded question display | Recovery can ask only a question grounded in saved state. |
| Research | Research packet and research-run Markdown | Research card, queue status, dossier research section | No public source is a support status, not a reason to discard analysis. |
| Dossier | Editable `dossier.md` plus immutable dossier revisions | Orientation sections | Canonical artifacts win. A hash conflict creates a visible review state, not an overwrite. |
| Briefing | Watch/scan-produced development and item records | Briefing list and counts | Do not invent items because a new vault is empty. |

## Typed operation contract

The existing operation-result contract is the authority for workspace mutations. The implementation must keep these meanings:

| Status | Meaning | Allowed user-facing claim |
|---|---|---|
| `changed` | Canonical state changed and `changed_paths` identifies saved records. | The named mutation completed. |
| `no_change` | No new mutation occurred. Existing `entity_refs` can prove an idempotent prior record. | Already recorded only when entity evidence exists; otherwise no change. |
| `confirmation_required` | A proposal exists but has not changed state. | A real confirmation control is available. Never claim completion. |
| `proposed` | Reviewable proposed content exists. | Proposal prepared. Never claim accepted or applied. |
| `failed` | The typed action failed. Useful earlier output can still exist. | Failure plus preserved work and recovery. |

`ChatCards` is the only chat control renderer. Markdown reply text is not a control surface.

## Repair-to-contract map

### MR2-01 — Document-end insertion

Current flow:

1. `MarkdownRichEditor` imports Markdown into Lexical.
2. `RevisionPlugin` handles bare Home/End but passes Ctrl/Meta modified keys through.
3. Review preview synchronization can clear the current selection.
4. The next text edit is converted back to Markdown through `onChange`.

Target flow:

1. The editor receives Ctrl+End or Meta+End.
2. One editor-owned command selects the final editable text position in the root.
3. Review synchronization does not move that selection before the next input.
4. Typing changes only the final block.

Control and state changes:

- Control: keyboard command inside the rich editor.
- State: Lexical range selection only. Do not add React document state.
- Files: `frontend/components/MarkdownRichEditor.tsx`, `frontend/components/RevisionPlugin.tsx`.
- Proof: interactive editor test with H1, paragraph, list, and table; Markdown round trip; title unchanged.

### MR2-02 — Saved-content truth

Current flow:

1. `DocumentPanel.save()` sends `document.content` through review save or `saveFile`.
2. It sets `dirty=false` after the request.
3. It reads review metadata but not the saved document content.

Target flow:

```text
local Markdown snapshot
        |
        v
save existing endpoint ---- failure ---> keep local text + show error
        |
        v
GET canonical document
        |
        +---- equal after newline rule ---> set canonical document + Saved
        |
        +---- different/read failure ----> keep local snapshot + Save conflict
```

Contract changes:

- No backend persistence schema change is required.
- Use existing `getFile` and `saveFile`/review endpoints.
- Add a client save state such as `clean | saving | conflict | error`; do not overload `dirty`.
- `dirty` remains true for conflict or read failure.
- The conflict UI must provide Retry save and Reload canonical. Reload must warn before replacing local text.

Proof:

- Unit or harness tests for equality, one trailing newline, mismatch, and read failure.
- Visible test: edit, save, close, reopen, and compare.

### MR2-03 — Typed lifecycle wording

Current flow:

1. The agent returns prose plus tool results.
2. `clean_user_facing_reply` removes internal material.
3. `reconcile_user_facing_reply` removes some unsupported mutation claims.
4. `ChatCards` renders controls only from typed operation results.
5. Bracketed model prose remains plain text and can look like a button.

Target flow:

1. Finalize operation results first.
2. Reconcile the reply against those results.
3. Remove closed-list pseudo-control lines such as `[ Approve ] [ Edit ] [ Hold ]`.
4. If the matching result is `confirmation_required`, let the existing typed card carry the action.
5. If no matching result exists, add one factual status line and preserve the analysis.
6. On conversation reload, run the same reconciliation so old saved prose cannot regain a false affordance.

Action map:

| Prose action | Required typed operation | Completion proof |
|---|---|---|
| Approve | `approve_response` | `changed` plus canonical approval metadata |
| Mark Delivered / delivery complete | `mark_as_sent` | `changed` plus `response_sent_at` and delivery event |
| Close | `close_matter` | `changed` plus `status: closed` and closure event |
| Record decision | `record_decision` | `changed` or idempotent entity reference |
| Finalize | existing typed work-product finalization result | `changed` plus final path/ID |

Files: `backend/app/agents/output.py`, `backend/app/services/chat_runs.py`, `backend/app/routers/chat.py`, `frontend/components/ChatCards.tsx`, and `frontend/components/ChatPanel.tsx`.

Proof: exact observed pseudo-control fixtures; every result status; reloaded conversation; surrounding legal analysis byte-preserved where possible.

### MR2-04 — Closure tool boundary

Current mismatch:

- `move_matter_stage.md` includes `closed` in `new_stage.enum`.
- `MatterLifecycleService.move_stage()` rejects `closed`.
- `close_matter` already exists as a separate confirmation tool.

Target contract:

- Generic stage enum: `intake | research | explore | generate | respond`.
- `closed` is not a normal stage mutation.
- Legacy request `move_matter_stage(closed)` returns a typed no-change recovery result. It must not throw a raw tool error into chat.
- Explicit closure intent uses `close_matter` and its confirmation proposal.
- Confirmation application remains deterministic in `_confirm_saved_operation`.

Prerequisite order shown to the user:

1. Current final work product exists.
2. Response approval is recorded.
3. Manual delivery is recorded.
4. No required work item remains open.
5. Close can be confirmed.

Do not require optional work. Do not infer approval or delivery from a draft, final file, chat prose, or decision.

Proof: tool-schema test, legacy handler test, lifecycle service tests, confirmation persistence test, visible sequential controls.

### MR2-05 — Chat failure classes

Add one optional field to both backend and frontend `ChatRun`:

```text
failure_class: provider | timeout | output_shape | tool_validation | tool_execution | interrupted | unknown | null
```

Use the smallest set supported by actual catch boundaries. If `interrupted` is already fully represented by run state, omit it from the field. Do not infer a class from exception message text in the browser.

Persistence rules:

- Write `failure_class` and a correlation ID to the existing chat-run Markdown metadata.
- Keep `failure_detail` short and safe.
- Keep raw diagnostic detail in existing server logging only.
- Before failed state, persist any non-empty reply, trace, `operation_results`, and `changed_paths`.
- Never replace a useful reply with the failure sentence.

UI map:

| Class | Safe detail | Primary recovery |
|---|---|---|
| provider / timeout | The model service did not finish. | Retry once or continue from saved work. |
| output_shape | The response could not be turned into the required structured action. | Use the direct control or send a narrower request. |
| tool_validation | The requested action needs corrected input. | Show the safe validation message and keep the draft. |
| tool_execution | The workspace action did not complete. | Open the direct control or retry after the stated prerequisite. |
| unknown | The request stopped before completion. | Review saved output, then retry or continue manually. |

Files: `backend/app/agents/runner.py`, `backend/app/services/chat_runs.py`, `backend/app/models/api.py`, `frontend/lib/types.ts`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`.

Proof: injected exceptions at each boundary and one multi-tool turn where early useful work survives a later failure.

### MR2-06 — Intake recovery

Current flow: `recover_intake_question` starts another provider-backed intake run. The UI Retry calls the same endpoint.

Target flow:

```text
missing current question
        |
one provider recovery attempt
        |
        +---- typed question returned ---> show it
        |
        +---- failure -------------------> inspect saved unresolved state
                                                  |
                                                  +-- question exists --> typed local card
                                                  |
                                                  +-- none ------------> Review / Finish intake
```

Grounding order:

1. Saved identified open question not already answered.
2. Saved material missing fact that maps to an existing intake record target.
3. No question. Offer finish/review.

Do not generate a new legal topic. Use the existing deterministic question helper where it accepts these saved inputs. Store the recovery message normally so reload does not restart the same loop.

Proof: provider failure, duplicate filtering, no-question path, reload, and repeated Retry.

### MR2-07 — Recommendation overview

Current inputs:

- `MatterDetail.recommendation`: canonical recommendation content and current version included in matter detail.
- `getRecommendation(matter_id)`: separate endpoint with the same content and fuller version history.
- Local `recommendation` string: currently starts as null and controls overview empty state.

Target precedence:

1. Successful direct recommendation mutation result.
2. Newer `MatterDetail.recommendation` by current version ID.
3. Supplemental endpoint response for the same matter and version.
4. Confirmed canonical absence.

A supplemental request error must keep the last canonical value. A response for an old matter or old version must be ignored.

UI controls:

- Overview summary uses the canonical content.
- Recommendation editor uses the same `RecommendationState`.
- Proposal state remains separate from the accepted current version.

Proof: slow response, failure, stale response ordering, mutation, reload, and confirmed absence.

### MR2-08 — Dossier projection

Current behavior:

- `ResearchService` updates research orientation and the latest research pointer.
- `WorkProductService` calls its private `_project_dossier_work_state`.
- `RecommendationService` does not project the dossier.
- `DossierService.update_work_state` already returns `applied`, `not_required`, or `review_required`.

Target projection input:

```text
matter_id
current recommendation content
current draft {path, title} or null
current final {path, title} or null
canonical next_action
expected dossier hash
```

Target ownership:

- One shared in-process projection method owns this shape.
- Recommendation, work-product, and relevant research pointer mutations call it after the primary canonical save.
- The method can read canonical current state instead of trusting caller snapshots.
- It returns projection outcome in the existing typed mutation result.
- A projection exception becomes a warning/recovery field. It does not undo the primary artifact.

UI control:

- `applied`: normal refreshed dossier.
- `not_required`: no notice.
- `review_required`: amber state word `Dossier update needs review` and a direct link to the immutable revision.
- failure: `Work saved; dossier did not refresh` with Reload. Never say the work failed.

Proof: recommendation-only save, draft, final, research pointer, combined operation, hash conflict, projection exception, and one index rebuild.

### MR2-09 — Work requirement clarity

Current data is sufficient: `WorkItem.required` and `WorkItem.status` already exist in `MatterDetail`.

Target UI:

- Queue header: `N required open · M optional open`.
- Each open row: text badge `Required` or `Optional`.
- Lifecycle area: list remaining required titles before the Close control.
- Closed matter: optional rows remain visible as `Optional · Open after closure` or equivalent plain state wording.

No backend invariant change is required. The backend continues to block only open required work.

Proof: mixed items, all-required complete, optional remains after close, and color-independent accessible text.

### MR2-10 — Scoped pending feedback

Current state: one `busy` boolean in `MatterWorkspace` disables many unrelated controls. Participant add and owner assignment each wait for a synchronous index rebuild and full matter reload.

Target client state:

```text
pendingAction: null
  | {kind: "add_participant"}
  | {kind: "assign_owner", workItemId: string}
```

Control behavior:

- Disable only the submitted control and any exact duplicate.
- Show `Adding participant…` or `Assigning owner…` on that control.
- Apply the returned participant/work-item state to the visible row.
- Reconcile with canonical matter reload.
- Roll back the temporary view on error.

Do not change `IndexService` until timing separates index rebuild from network and reload cost. If a focused index refresh is later justified, keep Markdown authoritative and SQLite disposable.

Proof: delayed promise harness, duplicate submission, rollback, unrelated action remains usable, canonical reload.

### MR2-11 — Durable progress

Use existing chat run and typed result fields. Add only a durable milestone field if the backend cannot express the last safe step through `status`.

Allowed milestones:

- Queued.
- Model is working.
- Last successful safe tool summary.
- Partial work saved.
- Finalizing response.
- Completed.
- Failed with preserved work.

The UI keeps elapsed time and `Continue in background`. It must not show a percentage, estimated completion time, or detailed internal chain-of-thought. All displayed summaries pass existing output/path sanitization.

Proof: polling state transitions, navigation away/back, reconnect, partial saved output, completion, and failure.

### MR2-12 — Guided intake compaction

Keep the full transcript and card actions in saved conversation records.

Display rules:

- The current active question is fully expanded.
- A superseded or answered intake turn is collapsed to state word, question text, and saved answer.
- Conflict questions remain expanded until resolved.
- `Expand` reveals original assistant prose and cards read-only.
- When a response contains more than one prioritized question, show the `Answer a set` explanation once.

Prompt rule: after the first intake turn, ask the agent to return only material changes to orientation plus the current question. This is a concision rule, not a completeness gate.

Proof: nine-question transcript, answer-set mode, skip, stop, conflict, expand, reload, and unchanged saved content.

## Test strategy

### Focused backend tests

- `backend/tests/test_agents.py`: output reconciliation, tool routing, partial execution.
- `backend/tests/test_chat_history.py`: saved confirmation and reload behavior.
- `backend/tests/test_chat_runs.py`: failure classes, partial preservation, retry, intake recovery.
- Matter lifecycle tests: stage-tool guard and closure prerequisites.
- `backend/tests/test_dossier.py`: hash guard and projection outcomes.
- `backend/tests/test_recommendations.py`: recommendation projection and version integrity.
- `backend/tests/test_work_product.py`: shared projection and primary-output preservation.
- `backend/tests/test_research.py`: partial research and projection without changing timeout semantics.

### Focused frontend checks

- Extend `frontend/scripts/check-chat-run-recovery.ts` for failure-class and preserved-output wiring.
- Extend `frontend/scripts/check-adaptive-intake.ts` for compact history and grounded recovery controls.
- Extend `frontend/scripts/check-workspace-ux.ts` for recommendation precedence and required/optional labels.
- Extend `frontend/scripts/check-transport-preservation.ts` for save read-back wiring.
- Add a small real editor interaction harness for MR2-01 and MR2-02. Source-regex checks cannot prove caret or save behavior.

### Full verification

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
graphify update .
```

Then use the visible browser for the affected acceptance flows. Use only fictional records.

## Non-goals

- No automatic legal verifier.
- No confidence threshold or citation gate.
- No new agent or multi-agent vote.
- No new task queue, event bus, or background service.
- No auto-generated Briefing content.
- No invented research source.
- No automatic synchronization between matter risk and decision risk.
- No automatic conversion of analysis prose into work items.
- No automatic external delivery.

## Implementation success

The repair is successful when the lawyer can trust four visible statements:

1. `Saved` means the document can be reopened with the same text.
2. An approval, delivery, decision, or closure claim has a matching typed result and canonical record.
3. A failed agent run keeps useful work and gives one truthful next action.
4. Overview, dossier, queue, and lifecycle controls explain canonical state without inventing work or hiding a guard.
