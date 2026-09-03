# Mosaic Relay R2 live-agent UX experiment

## Executive result

All 10 planned attorney matters produced valid visible-browser evidence. Six matters reached `Closed`. Three stopped before approval, delivery, or closure. Run 10 intentionally stopped before delivery and closure. One first attempt at run 03 was incomplete after the browser-control connection ended; a fresh attorney completed a clean replacement matter.

The main strength was durable work recovery. Actors usually kept useful facts, issues, research, recommendations, decisions, and work product even when public research or a chat run failed. The main broken behavior was action integrity: chat sometimes described buttons or completed lifecycle actions that had no typed control and no matching durable result. The first repair priority is to make every approval, delivery, closure, and decision claim agree with a typed operation result.

This report keeps actor observations separate from post-run source and record diagnosis. It does not classify the repeatedly empty Briefing or public-research timeouts as product defects. The dedicated vault had no Briefing developments, and research saved partial packets as designed when no public source returned.

## Setup and method

- Business type: fictional payment infrastructure and financial-technology platform.
- Fictional company: Mosaic Relay.
- Requester: Senior Product Manager.
- Attorney: Senior Product Counsel.
- Iterations: 10 independent product-law matters.
- Themes: seller onboarding, background checks, ACH debits, account deactivation, split-payment refunds, risk-data privacy, security marketing, consumer disputes, sanctions screening, and referral credits.
- Application: `http://localhost:3000`.
- Requester model: `gpt-5.6-luna`, medium reasoning.
- Attorney model: `gpt-5.6-luna`, high reasoning.
- Synthesis model: `gpt-5.6-sol`, high reasoning.
- Test data boundary: dedicated vault `Mosaic Relay UX Experiment 2026-09-03 R2`. The prior vault was preserved. Mosaic Relay is fictional.
- Live-operation boundary: each setup or matter actor used the visible in-app browser directly. Actors did not use an API, source code, a database, vault files, hidden DOM access, headless browsing, or direct file writes.
- Final-action rule: local fictional records were allowed. No actor contacted a real person or external service.
- Post-run review: a fresh Sol High reviewer inspected normalized evidence, canonical Markdown records, source, and tests after all live runs ended. No application file was changed.

The actors discovered these visible phases: `Just came in`, `Research`, `Waiting on your judgment`, `Being drafted`, `Ready to send`, and `Closed`. Labels varied with state and next owner.

## Company setup result

The setup actor created and saved the Mosaic Relay profile. The visible result showed `Company profile · Saved` and `No unsaved changes`.

The actor selected `Leave blank` for the optional website and saw the website question again. `Review draft now` recovered after about 2–3 seconds. Current source explicitly skips `website_url` after this action, and an existing test covers this case. The observed repeat was not reproduced or explained by the current source. Cause confidence is Unknown. Do not change this flow until a current reproduction identifies the failing state.

## Iteration results

`Completed` in this table means the attorney finished a valid experiment run. It does not mean the matter reached `Closed`.

| Run | Question | Phases reached | Main artifacts visibly verified | Decision | Final state | Status |
|---|---|---|---|---|---|---|
| 01 | Marketplace Seller Onboarding Refresh | All phases | Facts, issues, partial research, recommendation, final response | Recorded | Closed | Valid; closed |
| 02 | Contractor Background-Check Integration | All phases | Facts, three partial research workstreams, revised draft, recommendation, final response | Recorded | Closed | Valid; closed |
| 03 | ACH Debit for Subscription Collections | All phases | Facts, issue map, recommendation, reviewed draft, final response | Recorded | Closed | Valid retry; closed |
| 04 | Payout Hold and Account Deactivation | All phases | Facts, issue map, owner map, recommendation, final response | Recorded | Closed | Valid; closed |
| 05 | Refunds for Split Payments | All phases | Work items, partial research, recommendation v2, final response, seller-term draft | Recorded | Closed | Valid; closed |
| 06 | Privacy Controls for Risk Data | Through Respond | Facts, research, data-flow work, recommendation, and an actor-reported final response; post-run record has only a current draft pointer | Recorded | Ready to send | Valid; not closed |
| 07 | Bank-Level Security Marketing Claim | Through finalization | Research memo, substantiation file, surface inventory, recommendation, final response, and actor-reported local delivery; post-run record has no approval or delivery metadata | Recorded | Ready to send; waiting on Security & Compliance | Valid; not closed |
| 08 | Consumer Dispute Intake and Communications | All phases | Draft, research, recommendation, final response | Recorded manually | Closed | Valid; closed |
| 09 | Sanctions Screening Alert Handling | Through work product | Partial research, seven work items, recommendation, conditional decision, and actor-reported final response and delivery; post-run record has only a current draft pointer and no delivery metadata | Recorded | Waiting on your judgment | Valid; not closed |
| 10 | Promotional Referral Credits | Through finalization | Research, issue map, work items, recommendation, and actor-reported locked final draft; post-run record has only a current draft pointer | Recorded | Waiting on Marketing / judgment | Valid; delivery and closure intentionally not recorded |

Post-run canonical records refine some actor completion statements. Runs 06 and 07 have final stage `respond` but no `response_approved_at` or `response_sent_at`. Run 09 has stage `explore` and no approval or delivery record. These records prove that visible or chat wording did not always equal a completed lifecycle mutation. They do not erase what the actors saw.

## What is working well

| ID | Capability | Evidence | Frequency | Why it helps | Preserve during fixes |
|---|---|---|---|---|---|
| W-01 | Durable matter work | Every valid run saved several canonical Markdown artifacts. Failed chat work in run 08 preserved useful assistant text and successful tool results. | 10/10 runs | A lawyer can resume from real work instead of starting again. | Preserve partial replies, changed paths, operation results, and Markdown as source of truth. |
| W-02 | Recommendation and decision separation | Actors saved a working recommendation and a separate durable decision in all completed matter narratives. | 10/10 runs | Advice can change without rewriting an explicitly recorded decision. | Do not merge recommendation edits into decision records. |
| W-03 | Safe research degradation | When public research timed out, the app commonly saved a packet and said `Partial research is saved; no public source was retrieved.` | Repeated across runs | The lawyer still receives a useful foothold and sees the support gap. | Keep source status, warnings, model-only labels, and saved partial packets. |
| W-04 | Correct work-product and closure guards | Run 05 blocked mutation of a delivered canonical response and saved the seller amendment as a separate draft. Closure also waited for required work. | Run 05; lifecycle checks also passed in six closures | The app protects final records and required work without refusing useful work. | Keep guards. Improve earlier explanation only. |
| W-05 | Direct lifecycle path can work | Runs 01, 02, 03, 04, 05, and 08 reached approved, manually delivered, and closed states. | 6/10 runs | The end-to-end path exists and can produce coherent records. | Keep idempotent approval, delivery, and closure actions. |
| W-06 | Background work survives navigation | Long research and recommendation work could continue while the actor moved away and returned. | Runs 06, 08, 10 | The lawyer is not forced to watch a spinner. | Keep resumable run IDs and visible saved results. |
| W-07 | Direct manual recovery exists | Actors could record a durable decision, complete required work, and use separate drafts when chat failed. | Runs 04, 05, 08 | Core work can continue when one agent turn fails. | Keep direct controls available and make them easier to find. |

## What is not working well

| ID | Priority | Issue | Frequency | Actor evidence | Impact | Recovery |
|---|---|---|---|---|---|---|
| MR2-07 | P2 | Recommendation overview can show an empty state while a saved version is open. | Run 03 | Editor showed `Version 1 · Lawyer · Lawyer edit`; overview said `No working recommendation is saved yet`. | The lawyer must verify the same record in two places. | Trust the editor or reload. |
| MR2-08 | P2 | The dossier can lag behind canonical research, recommendation, and work product. | Run 06 | Dossier said research and work were absent while current artifacts existed. | The orientation surface can misstate what remains. | Open canonical artifacts. |
| MR2-09 | P2 | Required and optional work are not clear in the open queue. | Runs 01, 05 | A closed matter still showed one open optional item. A required item was obvious only when closure failed. | A lawyer cannot tell whether an item blocks closure. | Open each item or attempt closure. |
| MR2-10 | P2 | Small direct saves use one broad `busy` state and weak pending feedback. | Runs 01, 07 | Participant and owner controls stayed disabled; the saved list appeared after 1–3 seconds. | The actor retries or doubts the save. | Wait, then inspect the list. |
| MR2-11 | P2 | Long agent work gives generic progress. | Runs 02, 06, 07, 08, 10 | `Working…` or `Still working…` remained for 18–100+ seconds. | The lawyer cannot tell whether work is active, stuck, or safe to leave. | Continue in background and return later. |
| MR2-12 | P2 | Guided intake produces long, repetitive transcripts. | Runs 02, 04, 08 | Full orientation or topic lists repeated after each serialized answer; run 08 took about two minutes and 18 interactions. | The lawyer scrolls through repeated text and loses the current question. | Choose `Answer a set`, when noticed. |
| O-01 | P3 observation | `Continue from saved research` prepares but does not send a request. | Run 02 | Composer clearly said `Prepared request · Not sent.` | One extra click, but no unsafe automatic action. | Review and select Send. No repair is required. |
| O-02 | P3 observation | The optional website question appeared to repeat. | Setup | `Leave blank` was followed by the same question. | Small setup delay. | `Review draft now`. Current cause is unknown; diagnose before changing. |

## What is broken

| ID | Priority | Failure | Frequency | Actor evidence | Impact | Workaround |
|---|---|---|---|---|---|---|
| MR2-01 | P1 | Document-end keyboard navigation inserts at the start. | Runs 01, 04, 07 | `ControlOrMeta+End` followed by typing placed text before the title and damaged the heading. | High risk of accidental document corruption. | Undo or close without saving. |
| MR2-02 | P1 | `Saved` can appear while a typed note is absent. | Run 09, twice | Editor changed from `Unsaved changes` to `Saved`; the attorney note was missing after save. | Record integrity is uncertain. | None proven. Re-entering and saving again also failed. |
| MR2-03 | P1 | Chat shows false or non-actionable lifecycle controls and completion claims. | Runs 09, 10 | Literal `[ Approve ]`, `[ Finalize ]`, and `[ Mark Delivered ]` text had no controls. Run 09 said a click would deliver, then later said delivery was complete. | The lawyer can believe approval or delivery happened when no durable record exists. | Use a verified direct control or inspect canonical state. |
| MR2-04 | P1 | The generic stage tool accepts `closed`, but the lifecycle service rejects that route. | Runs 06, 07, 09 | `move_matter_stage failed: Use the close matter action so delivery and required work are checked.` | Closure attempts fail through an internally contradictory tool contract. | Complete approval and delivery, then use the direct close action when it appears. |
| MR2-05 | P1 | Chat runs fail repeatedly with no useful cause or targeted recovery. | Runs 04, 06, 08, 09 | Research, drafting, decision, and closure turns showed `Themis.ai could not finish this request` and often `No tool work completed`. | A core workflow can stop, and identical Retry attempts can waste time. | Use direct controls or create artifacts manually. |
| MR2-06 | P2 | A structured intake question cannot always be restored. | Run 03 | `Retry intake question` ran, but the error returned and no answerable account-mix card appeared. | Guided intake is blocked. | Send a free-text message or finish intake. |

## Detailed repair backlog

### MR2-01 — Make document-end insertion stable

- Classification and priority: Broken, P1 record-integrity risk.
- Affected runs, roles, and phases: runs 01, 04, and 07; Senior Product Counsel; artifact editing and document review.
- Frequency: three independent runs.
- Actor evidence: after editor focus and `ControlOrMeta+End`, the next typed text appeared before the original H1 title.
- Minimal reproduction: open a multi-block Markdown artifact; focus the rich editor; press Ctrl+End on Windows/Linux or Command+End on macOS; type a note.
- Current behavior: content can be inserted at document start.
- Expected behavior: the caret moves to the end of the final editable block and text appends there.
- Lawyer and workflow impact: accidental heading and content corruption during normal keyboard navigation.
- Recovery or workaround: Undo or abandon the edit without saving.
- Cause confidence: Likely.
- Post-run cause evidence: `frontend/components/RevisionPlugin.tsx` handles only bare Home/End and passes modified End through. Review synchronization can also clear selection asynchronously. The observed selection transition was not traced in a running browser, so the exact Lexical path is not confirmed.
- Relevant code areas: `frontend/components/MarkdownRichEditor.tsx`, `frontend/components/RevisionPlugin.tsx`, `frontend/components/DocumentPanel.tsx`.
- Detailed implementation approach: add one editor-owned modified-End command that selects the end of the root's final text position after any review synchronization. Do not change bare Home/End behavior. Keep the selection within the editable root. Do not alter Markdown conversion.
- Risks and dependencies: Lexical selection changes can affect lists, tables, and tracked revisions. This item has no dependency on lifecycle repairs.
- Tests to add or update: add a real editor interaction test or minimal browser harness for H1 plus paragraphs and a table; test Ctrl+End and Meta+End; type and round-trip Markdown. Static source assertions alone are not sufficient.
- Visible acceptance criteria: the note appears after the last block in three document shapes; title and prior content remain byte-equivalent after save.
- Further diagnosis needed: capture selection before and after modified End if the interaction test does not reproduce.

### MR2-02 — Verify saved editor content before showing `Saved`

- Classification and priority: Broken, P1 record integrity.
- Affected runs, roles, and phases: run 09; Senior Product Counsel; final document edit.
- Frequency: two attempts in one run.
- Actor evidence: the editor reported `Saved`, but the typed attorney note was absent.
- Minimal reproduction: edit an artifact; wait for `Unsaved changes`; save; inspect the visible content and reopen the file.
- Current behavior: the client trusts the submitted in-memory content and sets `dirty=false` after the save call.
- Expected behavior: `Saved` means the persisted Markdown read-back matches the submitted Markdown. A mismatch stays visible as an error or conflict and keeps the edit recoverable.
- Lawyer and workflow impact: the lawyer can rely on text that is not in the record.
- Recovery or workaround: none proven.
- Cause confidence: Unknown for the lost text; Confirmed for the false assurance gap.
- Post-run cause evidence: `frontend/components/DocumentPanel.tsx` does not read the saved document back or compare content before setting `dirty=false`. The post-run records do not expose where the note was lost.
- Relevant code areas: `frontend/components/DocumentPanel.tsx`, `frontend/lib/api.ts`, the existing document read/save endpoint, and document transport checks.
- Detailed implementation approach: keep the submitted Markdown snapshot; after save, read the canonical document; normalize only the existing newline convention; show `Saved` only on equality. On mismatch, retain the local snapshot, show `Save conflict — review`, and offer retry/reload without discarding either value.
- Risks and dependencies: do not overwrite a concurrent lawyer edit. Preserve review metadata and comments.
- Tests to add or update: success round trip, server-normalized trailing newline, mismatch, read-back failure, and concurrent-change response. Add a browser test that reopens the saved file.
- Visible acceptance criteria: a successful save survives reload; a mismatch never shows `Saved`; the user's local text remains available.
- Further diagnosis needed: reproduce the run-09 sequence with editor change logs to find the original loss point.

### MR2-03 — Allow lifecycle action wording only when a typed action exists

- Classification and priority: Broken, P1 record integrity.
- Affected runs, roles, and phases: runs 09 and 10; approval, finalization, delivery, and closure preparation.
- Frequency: repeated in two late-stage matters.
- Actor evidence: bracketed pseudo-buttons rendered as text; delivery wording promised a click with no button; later prose claimed completion without a delivery record.
- Minimal reproduction: ask chat to approve, finalize, deliver, or close; inspect prose, `ChatCards`, operation results, and the matter record.
- Current behavior: model prose can include button-like labels or success claims without a matching `confirmation_required` or `changed` operation result.
- Expected behavior: only `ChatCards` supplies actionable controls. Prose must not imitate buttons or claim a mutation that typed results do not support.
- Lawyer and workflow impact: false belief that a legally material lifecycle event was approved or delivered.
- Recovery or workaround: use the direct matter control and verify the state word.
- Cause confidence: Confirmed.
- Post-run cause evidence: the run-09 and run-10 chat records contain the prose but no matching lifecycle operation result. `frontend/components/ChatCards.tsx` renders real buttons only from typed results. `backend/app/agents/output.py` reconciles a narrow set of success phrases but does not cover `Delivery complete` or bracketed pseudo-controls.
- Relevant code areas: `backend/app/agents/output.py`, `backend/app/services/chat_runs.py`, `backend/app/routers/chat.py`, `frontend/components/ChatCards.tsx`, `frontend/components/ChatPanel.tsx`, `backend/tests/test_agents.py`, `backend/tests/test_chat_history.py`.
- Detailed implementation approach: detect closed-list lifecycle pseudo-controls and claims after operation results are final. If a matching `confirmation_required` result exists, remove the fake bracket text and keep the typed card. If it does not exist, remove the fake control and add a factual status such as `No approval action was prepared` or `No delivery was recorded`. Keep all useful legal analysis. Never synthesize a changed result.
- Risks and dependencies: avoid stripping ordinary legal uses of “approve” or “delivery.” Match only button-like syntax and closed mutation claims.
- Tests to add or update: run-09 and run-10 prose fixtures; confirmation-required, changed, failed, and no-result cases; history reload; useful-analysis preservation; accessible card button labels.
- Visible acceptance criteria: no bracket pseudo-button is visible; every lifecycle button is clickable and backed by a typed proposal; every completion claim matches canonical state.
- Further diagnosis needed: none for the confirmed output-contract gap.

### MR2-04 — Remove `closed` from the generic stage path

- Classification and priority: Broken, P1 core lifecycle.
- Affected runs, roles, and phases: runs 06, 07, and 09; delivery and closure.
- Frequency: three independent matters.
- Actor evidence: chat attempted closure through `move_matter_stage` and received the lifecycle guard error.
- Minimal reproduction: let the counsel agent call `move_matter_stage` with `new_stage: closed`.
- Current behavior: the declarative tool enum permits `closed`; `MatterLifecycleService.move_stage` rejects it and requires `close_matter`.
- Expected behavior: generic stage movement cannot request closure. An explicit closure request produces a typed `close_matter` confirmation or an exact unmet-prerequisite message.
- Lawyer and workflow impact: a valid safeguard appears as a broken close action.
- Recovery or workaround: use the sequential direct controls after finalization, approval, delivery, and required work.
- Cause confidence: Confirmed.
- Post-run cause evidence: `backend/app/blank_vault_template/00_System/tools/move_matter_stage.md` includes `closed`; `backend/app/services/matter_lifecycle.py` rejects that route; `backend/app/tools/handlers.py` already has a separate `close_matter` confirmation handler. Canonical records show runs 06, 07, and 09 were not eligible for closure because approval or delivery was absent.
- Relevant code areas: `backend/app/blank_vault_template/00_System/tools/move_matter_stage.md`, `backend/app/tools/handlers.py`, `backend/app/services/matter_lifecycle.py`, `backend/app/blank_vault_template/00_System/agents/counsel-copilot.md`, `backend/tests/test_matter_action_tools.py`, `backend/tests/test_matter_lifecycle.py`, `backend/tests/test_chat_history.py`.
- Detailed implementation approach: remove `closed` from the generic tool enum; reject it at the handler boundary with a typed recovery result for legacy vault specs; direct explicit close intent to the existing `close_matter` tool. Return current unmet prerequisites from canonical matter state. Do not bypass approval, delivery, or required-work checks.
- Risks and dependencies: existing vaults can contain old tool Markdown. The handler guard must protect them without a migration service.
- Tests to add or update: old spec requests closed; new spec excludes closed; explicit close creates confirmation only; confirmation applies once; missing approval, delivery, and required work each return exact next action.
- Visible acceptance criteria: chat never shows `move_matter_stage failed` for close intent; the lawyer sees either a real Close card or one clear prerequisite.
- Further diagnosis needed: none.

### MR2-05 — Give failed chat runs a safe failure class and useful recovery

- Classification and priority: Broken, P1 core workflow.
- Affected runs, roles, and phases: runs 04, 06, 08, and 09; research, drafting, decision, and closure.
- Frequency: 11 failed run records across four matters. Several retries also failed.
- Actor evidence: generic failure wording often said no tool work completed. One run preserved a useful response and saved work, which is the behavior to keep.
- Minimal reproduction: inject provider failure, malformed structured output, tool validation failure, and tool execution failure in separate chat runs.
- Current behavior: many non-provider exceptions are wrapped into the same generic `AgentExecutionError`; no durable safe failure category identifies the recovery path.
- Expected behavior: preserve all useful reply and tool work, then show a safe class and one next action: retry transient provider work, correct invalid input, use the direct control, or continue from saved output.
- Lawyer and workflow impact: repeated blind retries and manual reconstruction.
- Recovery or workaround: direct controls and manual artifacts.
- Cause confidence: Unknown for the live failures; Confirmed for the diagnostic collapse.
- Post-run cause evidence: no matching server log exists. `backend/app/agents/runner.py` collapses generic exceptions; `backend/app/services/chat_runs.py` persists generic text. Partial-result persistence is already implemented and worked in run 08.
- Relevant code areas: `backend/app/agents/runner.py`, `backend/app/services/chat_runs.py`, `backend/app/models/api.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/tests/test_agents.py`, `backend/tests/test_chat_runs.py`, `frontend/scripts/check-chat-run-recovery.ts`.
- Detailed implementation approach: add a closed safe `failure_class` to the existing chat-run record, assigned at known boundaries only. Keep raw exception details in server logs with correlation ID, not in the UI. Map each class to one recovery sentence. Preserve non-empty reply, trace, operation results, and changed paths before failure. Do not add a verifier, queue, or new service.
- Risks and dependencies: classification must not expose secrets or replace useful content. Unknown remains valid when no safe class applies.
- Tests to add or update: one test per boundary; partial output plus later failure; successful tool result plus failed later tool; reload persistence; retry retains the original run; UI copy by class.
- Visible acceptance criteria: a failed run says what kind of step failed, what was saved, and the next safe action; useful output remains visible.
- Further diagnosis needed: reproduce with the configured live provider and correlation IDs before claiming the underlying provider/tool bug is fixed.

### MR2-06 — Restore intake from saved matter state when the provider fails

- Classification and priority: Broken, P2 with a free-text workaround.
- Affected runs, roles, and phases: run 03; structured intake.
- Frequency: repeated recovery failure in one matter.
- Actor evidence: `Retry intake question` ran but returned to the same missing-card state.
- Minimal reproduction: save an intake answer, lose the next assistant turn, then make the recovery provider fail.
- Current behavior: `recover_intake_question` starts another provider-dependent intake run. Retry repeats that path.
- Expected behavior: after the first failed recovery, use the next unresolved saved open question or missing fact to build one typed local question. If none exists, offer Review or Finish intake.
- Lawyer and workflow impact: the guided path becomes unusable even though saved matter state exists.
- Recovery or workaround: send free text.
- Cause confidence: Confirmed.
- Post-run cause evidence: `backend/app/routers/chat.py` recovery calls the intake agent again. `backend/app/agents/runner.py` already contains deterministic structured-question logic, but the execution-failure recovery path does not use it. Existing tests cover provider success only.
- Relevant code areas: `backend/app/routers/chat.py`, `backend/app/agents/runner.py`, `backend/app/services/chat_runs.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/tests/test_chat_runs.py`.
- Detailed implementation approach: keep the first provider recovery attempt. On its failure, create one typed question from durable `open_questions` or the saved intake record. Do not invent facts or generic legal questions. If no grounded question exists, return a typed finish/review state instead of looping.
- Risks and dependencies: never ask an already answered question. Keep historical cards immutable.
- Tests to add or update: provider-failure fallback, no-open-question finish path, no duplicate question, reload, and repeated Retry idempotence.
- Visible acceptance criteria: the actor always gets one answerable card or a clear finish path after one failed recovery.
- Further diagnosis needed: none for the fallback gap.

### MR2-07 — Use canonical recommendation data for the overview

- Classification and priority: Not working well, P2 misleading state.
- Affected runs, roles, and phases: run 03; recommendation review.
- Frequency: one direct contradiction.
- Actor evidence: saved Version 1 was open while the overview said none existed.
- Minimal reproduction: load a matter whose detail payload contains a saved recommendation while the separate recommendation fetch is pending or fails.
- Current behavior: `MatterWorkspace` initializes recommendation metadata from `detail.recommendation` but computes overview text from a separate nullable content state.
- Expected behavior: the canonical detail recommendation appears immediately. A later version-history fetch can enrich it but cannot replace it with an empty state on failure.
- Lawyer and workflow impact: duplicate verification and mistrust of saved state.
- Recovery or workaround: open the recommendation editor.
- Cause confidence: Confirmed for the empty-state path; Likely for the exact run timing.
- Post-run cause evidence: `frontend/components/MatterWorkspace.tsx` ignores `detail.recommendation.content` when computing `recommendationText` until `getRecommendation` finishes, and the fetch catch writes an empty string.
- Relevant code areas: `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matter-workspace.ts`, `frontend/lib/types.ts`, workspace UX checks.
- Detailed implementation approach: seed content from `detail.recommendation`; treat the separate endpoint as supplemental version data; keep the last canonical value on fetch error; reconcile by version ID after mutation and reload.
- Risks and dependencies: do not hide a deleted recommendation. A confirmed canonical absence must still render empty.
- Tests to add or update: initial canonical content, slow fetch, fetch failure, saved update, confirmed deletion, and stale response ordering.
- Visible acceptance criteria: overview and editor show the same recommendation status through load, save, and reload.
- Further diagnosis needed: none.

### MR2-08 — Reconcile dossier work state after each canonical mutation

- Classification and priority: Not working well, P2 misleading derived view.
- Affected runs, roles, and phases: run 06; research through response preparation.
- Frequency: one run, several stale sections.
- Actor evidence: dossier said research and work product were absent while current artifacts existed.
- Minimal reproduction: update research, recommendation, and work product in sequence; inspect the dossier after each completed mutation.
- Current behavior: research and work-product services project some dossier sections. Recommendation mutations do not. Work-product projection catches every exception and can create a review-required revision that is visible only in the file tree.
- Expected behavior: canonical records remain authoritative; completed mutations reconcile the relevant dossier sections or show `Dossier update needs review` with a direct revision link.
- Lawyer and workflow impact: the main orientation page can direct the lawyer to work that is already done.
- Recovery or workaround: open canonical artifacts.
- Cause confidence: Confirmed for recommendation projection and hidden review revisions; Unknown for the exact mid-run research/draft lag.
- Post-run cause evidence: `backend/app/services/recommendations.py` never calls dossier work-state projection. `backend/app/services/work_product.py` is the only application caller and suppresses projection exceptions. `backend/app/services/dossier.py` can return `review_required`. Post-run run-06 dossier did later contain research and draft links but still had a recommendation placeholder.
- Relevant code areas: `backend/app/services/dossier.py`, `backend/app/services/recommendations.py`, `backend/app/services/work_product.py`, `backend/app/services/research.py`, `backend/app/services/matters.py`, `frontend/components/MatterWorkspace.tsx`, dossier/recommendation/work-product tests.
- Detailed implementation approach: extract the existing canonical work-state projection into one shared in-process method. Call it after successful recommendation, draft, final, and research pointer changes. Keep the hash guard. Return `applied`, `not_required`, or `review_required` in the existing mutation result. Show a direct review link for `review_required`; never overwrite a lawyer-edited dossier.
- Risks and dependencies: avoid circular imports and duplicate index rebuilds. Dossier failure must not roll back the useful canonical artifact.
- Tests to add or update: each mutation projects once; combined changes; lawyer-edit hash guard; projection exception preserves primary output; visible review link.
- Visible acceptance criteria: dossier sections agree with canonical links after refresh, or a visible review-required state explains the difference.
- Further diagnosis needed: trace the original run-06 timing before changing research-specific behavior beyond the shared projection.

### MR2-09 — Mark every open work item as required or optional

- Classification and priority: Not working well, P2 workflow clarity.
- Affected runs, roles, and phases: runs 01 and 05; closure.
- Frequency: two independent matters.
- Actor evidence: a closed matter showed one open item; another matter exposed the required blocker only when close failed.
- Minimal reproduction: create one required and one optional work item; complete the required item; close; inspect the queue before and after closure.
- Current behavior: the queue count combines both classes and each row lacks a state word for `required`.
- Expected behavior: every row and count says `Required` or `Optional`. The lifecycle panel lists remaining required blockers before close. Optional work may remain open after closure without looking inconsistent.
- Lawyer and workflow impact: unnecessary closure attempts and false concern about a closed record.
- Recovery or workaround: inspect item files or try close.
- Cause confidence: Confirmed.
- Post-run cause evidence: run-01 canonical work item has `required: false`. `MatterWorkspace` shows one combined open count and no required/optional row label. `MatterLifecycleService` correctly blocks only required open items.
- Relevant code areas: `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matterActions.ts`, `frontend/lib/types.ts`, `backend/app/services/matter_lifecycle.py`, `frontend/scripts/check-workspace-ux.ts`, `backend/tests/test_matter_lifecycle.py`.
- Detailed implementation approach: split counts and add a text badge on every row. Feed the existing required-item list into lifecycle detail before the click. Keep optional items open and editable after close unless current product rules say otherwise.
- Risks and dependencies: do not change closure invariants.
- Tests to add or update: required and optional counts, closed with optional open, blocked with required open, and accessible text independent of color.
- Visible acceptance criteria: before close, the lawyer can name every blocker; after close, an open optional item is explicitly optional.
- Further diagnosis needed: none.

### MR2-10 — Show action-specific pending and saved states for direct metadata edits

- Classification and priority: Not working well, P2 repeated feedback gap.
- Affected runs, roles, and phases: runs 01 and 07; participants and work-item ownership.
- Frequency: two independent matters.
- Actor evidence: valid controls stayed disabled and lists updated only after 1–3 seconds.
- Minimal reproduction: add a participant or assign an owner in a non-trivial vault.
- Current behavior: one workspace-wide `busy` boolean disables unrelated controls and often labels the primary action only as `Working…`. Each small mutation performs a synchronous full index rebuild and then a full matter reload.
- Expected behavior: the clicked row shows `Saving participant…` or `Assigning owner…`, then the saved value. Unrelated controls remain usable when safe.
- Lawyer and workflow impact: duplicate clicks and uncertainty about whether a person or owner was recorded.
- Recovery or workaround: wait and inspect.
- Cause confidence: Confirmed for the broad pending state and full rebuild path; the measured delay contribution of each part is not profiled.
- Post-run cause evidence: `frontend/components/MatterWorkspace.tsx` uses one `busy` state. `backend/app/services/matter_participants.py` and `backend/app/services/matter_work_items.py` call synchronous `index.rebuild()` for one record change.
- Relevant code areas: those three files, `frontend/lib/api.ts`, `backend/tests/test_matter_records.py`, `backend/tests/test_matter_lifecycle.py`, `frontend/scripts/check-workspace-ux.ts`.
- Detailed implementation approach: replace the broad state for these mutations with action keys scoped to participant or work-item ID. Render an exact pending label and keep duplicate submission disabled. Update from the mutation result immediately, then reconcile with one reload. Profile before replacing the index rebuild; do not add a background queue.
- Risks and dependencies: optimistic display must roll back on error and must not create a second source of truth.
- Tests to add or update: slow success, duplicate click, error rollback, unrelated control state, and final reload reconciliation.
- Visible acceptance criteria: feedback appears within one frame; one click creates one record; the final list matches persisted state.
- Further diagnosis needed: measure index rebuild and reload separately before a performance change.

### MR2-11 — Report durable progress for long agent work

- Classification and priority: Not working well, P2 repeated delay and weak feedback.
- Affected runs, roles, and phases: runs 02, 06, 07, 08, and 10; research, recommendation, drafting, and finalization.
- Frequency: repeated across half the runs.
- Actor evidence: generic progress remained for 18–100+ seconds.
- Minimal reproduction: start a live provider action lasting more than 15 seconds; remain on the page, then navigate away and return.
- Current behavior: chat shows elapsed time and generic `Working…` / `Still working…`. Research has item counts, but chat does not expose which durable phase or last save completed.
- Expected behavior: show queued/running state, elapsed time, the last durable completed step when known, and that work continues in background. Never invent percentage progress.
- Lawyer and workflow impact: repeated checking and fear that work is stuck.
- Recovery or workaround: continue in background and inspect later.
- Cause confidence: Confirmed for generic UI copy; Unknown for any underlying performance cause.
- Post-run cause evidence: `frontend/lib/chatRunLogic.ts` and `frontend/components/ChatPanel.tsx` use generic labels. Existing run records and operation results already provide state and saved work; no timing profile proves a provider defect.
- Relevant code areas: `backend/app/services/chat_runs.py`, `backend/app/agents/runner.py`, `frontend/components/ChatPanel.tsx`, `frontend/lib/chatRunLogic.ts`, chat recovery checks.
- Detailed implementation approach: expose only existing durable milestones: queued, model working, last successful tool summary, saved partial work, finalizing, complete, or failed. Keep elapsed seconds and background control. Do not add streaming, a queue, or fake percentages.
- Risks and dependencies: tool summaries must be safe for display and must not leak internal IDs or paths.
- Tests to add or update: long queued/running run, milestone update, background navigation/reconnect, partial save, failure, and no-progress-data fallback.
- Visible acceptance criteria: after 15 seconds, the lawyer sees the last known durable milestone and can leave safely.
- Further diagnosis needed: profile live latency separately from this UX repair.

### MR2-12 — Reduce repeated guided-intake text

- Classification and priority: Not working well, P2 repeated cognitive load.
- Affected runs, roles, and phases: runs 02, 04, and 08; intake.
- Frequency: three matters; run 08 used nine serialized questions.
- Actor evidence: orientation and priority lists repeated after each answer.
- Minimal reproduction: keep Guided mode and answer several questions.
- Current behavior: every assistant turn stays fully expanded. Guided mode asks one question at a time even when a set is available.
- Expected behavior: the current question and new assessment are prominent; completed turns collapse to answer summaries; `Answer a set` is explained before a long sequence.
- Lawyer and workflow impact: scrolling hides the current decision and makes intake feel longer.
- Recovery or workaround: select `Answer a set`.
- Cause confidence: Confirmed for transcript rendering; Likely for model repetition.
- Post-run cause evidence: `frontend/components/ChatPanel.tsx` renders all assistant content in full. `frontend/components/ChatCards.tsx` offers both modes. No current source rule limits repeated orientation prose after each answer.
- Relevant code areas: `frontend/components/ChatPanel.tsx`, `frontend/components/ChatCards.tsx`, `frontend/lib/chatRunLogic.ts`, `backend/app/blank_vault_template/00_System/agents/intake-agent.md`, adaptive-intake checks.
- Detailed implementation approach: keep saved transcript content unchanged. Collapse superseded intake assistant turns in the UI to question, answer, and state. Add one short mode hint when more than one question is available. Tighten the intake-agent instruction to return only the changed assessment plus current question after the first turn.
- Risks and dependencies: audit history must remain expandable. Do not hide conflicts, skipped answers, or material new assumptions.
- Tests to add or update: current/superseded question rendering, expand history, set-mode hint, conflict visibility, and saved transcript preservation.
- Visible acceptance criteria: after nine answers, the current question remains in view and prior turns are one-line summaries until expanded.
- Further diagnosis needed: compare model output before and after the prompt change; keep UI compaction even if model wording varies.

## Cross-run patterns

1. Durable work usually survived failure. The repair set must preserve this behavior.
2. Action integrity weakened late in the workflow. Chat prose and generic stage movement were less reliable than typed direct controls.
3. Editor risk repeated across three independent actors. The save-truth defect was separate and appeared twice in run 09. Source does not prove one common cause, so they remain separate items.
4. Derived views lagged canonical records. Recommendation overview and dossier projection have different verified code paths, so they remain separate items.
5. Long waits were common, but no evidence proves one performance cause. The accepted repair concerns truthful progress, not a new execution system.
6. Intake was usable but costly in Guided mode. The existing `Answer a set` path is a useful base.
7. Six matters closed successfully. The three failed closure narratives do not prove the lifecycle guard is wrong; canonical records show missing approval or delivery. The confirmed defect is that the generic stage tool offers an invalid `closed` route and chat wording overstates what happened.
8. Learning effects were limited because each matter used a fresh attorney. Repeated issues therefore indicate interface-level friction rather than one actor's habit.

## Browser-control errors

- The in-app browser control runtime often timed out during long waits. Actors reconnected to the same visible tab and continued.
- The first run-03 actor lost the browser connection before recording the prepared decision. That matter is incomplete and is not the valid run-03 result.
- Browser visibility toggling was unavailable from a subagent thread. This limited coordinator observation but did not cause actors to use a hidden or non-browser path.
- No normalized evidence identified a locator, stale-target, or quoting error as a product defect.

## Environment failures

- Public research often reached its configured external timeout. The app saved partial packets and clear `no public source was retrieved` status. Source and tests confirm this is intended graceful degradation. The underlying provider/network cause is not established.
- Briefing searches returned zero developments. The Briefing page reads developments created by Watches and scans. The dedicated new vault had no evidence of such development records. Empty results are therefore a data-state result, not a proven Briefing defect.
- Eleven chat run records ended failed across runs 04, 06, 08, and 09. No matching server logs exist, so the underlying provider, schema, or tool cause is Unknown. The product defect is the generic diagnostic and recovery experience, not a claimed provider root cause.

## Incomplete or contaminated runs

- Incomplete first run-03 attempt: `MAT-20260903-f37f48`. It ended in `explore` after the browser-control connection ended before the prepared decision was recorded.
- Valid run-03 retry: `MAT-20260903-97c9c3`. A fresh attorney created and completed a separate matter. Evidence was not split across attorneys.
- No valid run was contaminated by coordinator UI work, API use, direct vault writes, source inspection, or another matter.
- Run 10 intentionally did not record delivery or closure. This is a complete experiment run with an intentionally incomplete matter lifecycle.

## Method compliance

All live setup and matter work used the directly controlled visible in-app browser. Actors inspected visible state after changes and reported working, friction, broken, browser, and environment evidence separately. No actor used application source, repository documents, the database, vault files, APIs, network inspection, hidden DOM changes, headless browsing, or direct file writes. No real external delivery occurred.

The post-run reviewer started only after normalized live evidence existed. The reviewer ran a focused `graphify query` before each source issue group, inspected current source, tests, and canonical records, and labeled causes Confirmed, Likely, or Unknown. This source review did not revise actor observations and did not change application code.

## Findings not accepted as product repairs

- Empty Briefing: correct for a new vault with no Watch-produced developments, unless a future run proves missing records.
- Public-research timeout: external environment result with correct partial-save behavior, unless a future trace proves an application timeout defect.
- Run-02 zero work items: analysis text does not automatically create durable work items. No user action requested their creation.
- Run-03 `No research packet`: issue analysis is not a research packet. No evidence showed a completed research mutation at that point.
- Run-05 canonical work-product guard and closure guard: correct behavior.
- `Continue from saved research`: safe prepared-not-sent behavior with explicit copy.
- Run-10 risk and stage labels: matter risk, recorded-decision risk, workflow stage, and next owner are separate records. The labels were confusing, but no record corruption was proved. MR2-03, MR2-08, and MR2-09 address the material state clarity gaps without merging these records.
