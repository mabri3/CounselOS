# Themis.ai workflow reconciliation build plan

## 1. Thesis

Themis.ai must let safe work continue in the background while keeping material legal and audit actions under direct lawyer control. Chat can interpret, draft, research, and propose changes. Durable success must come from typed operation results and Markdown records, never from chat wording. This build repairs the failures found in the September 1 Harborline rerun without adding a distributed queue, event-sourcing system, verifier agent, or general workflow engine.

The smallest useful design is a hybrid:

- Safe and reversible work can run automatically.
- Decisions, approval, delivery, closure, and destructive actions require a user click.
- One app-wide structured result contract tells chat, the matter workspace, and the board what actually changed.
- Matter lifecycle state and background-work state remain separate. Waiting for approval must not stop research or other safe work.
- Markdown remains authoritative. SQLite remains a rebuildable index.

## 2. Payoff moment

A lawyer watches research continue while a final waits for approval, sees the same truthful state in chat, the matter workspace, and the board, then clicks to approve, record delivery, and close the matter without any state disagreement after reload.

## 3. Demo script

Use a new test vault. Do not use the repository vault, an earlier verification vault, or an earlier experiment vault.

1. Open Settings. Select a primary external research provider, an external fallback provider or **None**, and Kimi K3 Fast as the enabled model-only fallback. Save and reload. Confirm that the same values return from Markdown-backed settings.
2. Create a matter with a target date, requester, business owner, legal owner, and named participants. Confirm immediate **Matter created** feedback before intake work finishes. Confirm one click creates one matter.
3. Force two malformed structured-intake replies. Confirm that useful prose and saved facts remain. Confirm that the app shows one deterministic, material next question instead of a retry loop.
4. Answer the recovery question by clicking a suggested choice. Confirm that the prior failed turns are compacted into expandable history and only the current question is interactive.
5. Add three research questions. Confirm that the first starts automatically and the other two enter a visible durable queue. Move the third question above the second. Confirm that the running item is not interrupted and the pending order changes.
6. Force the primary external provider to fail. Confirm that the configured external fallback is attempted. If external retrieval still fails, confirm that Kimi K3 Fast creates useful model-only analysis labeled **No external authority retrieved**.
7. Confirm that ordinary lawyer-facing research shows legal usefulness: question answered, external authority retrieved or not retrieved, internal support, assumptions, and remaining gaps. Provider attempts, timing, and diagnostics remain in a separate technical detail view.
8. Create a draft and a structured working recommendation in one operation. Confirm that the work product and overview show the same recommendation version.
9. Finalize the draft while the matter is not in Generate. Confirm that the canonical final, stage, next action, approval control, board, and reload reconcile to the same state.
10. While approval is pending, let the research queue finish another item. Confirm that approval remains pending and the new research appears as background work. Confirm that research does not move the matter backward.
11. Have an agent propose a changed recommendation. Confirm that it appears as a proposal and does not replace the working recommendation. Accept it with one click and confirm a new recommendation version.
12. Edit the working recommendation directly as the lawyer. Confirm that the structured recommendation updates automatically and keeps version history. Confirm that an existing recorded decision does not change.
13. Record a decision with one click. Select **Followed**, **Modified**, or **Not followed** for the recommendation and save a reason when it was modified or not followed. Confirm that the decision remains separate from recommendation and approval records.
14. Assign and complete work items from the visible queue. Use clickable participant and owner suggestions. Confirm that each item keeps its own owner, status, priority, and completion state after reload.
15. Force chat prose to claim a save or lifecycle change without a successful typed result. Confirm that no success card, badge, stage change, or durable record appears. Confirm that the turn has a structured **No workspace change recorded** result without using phrase matching.
16. Seed one safe legacy inconsistency, such as a canonical final on a pre-Respond matter. Confirm that the board identifies the exact inconsistency. Use the explicit safe repair control. Confirm that it changes only derived lifecycle fields and does not create a decision, approval, delivery, or closure record.
17. Approve the final with a user click. Confirm that chat cannot execute approval directly. Confirm that the approved version remains fixed while later background work is shown as proposed updates.
18. Confirm that delivery shows two choices: **Record manual delivery** and disabled **Send directly — coming later**. Use manual delivery. Confirm that the UI states that no person or service was contacted.
19. Close the matter with a user click after required work is complete. Reload, rebuild SQLite, reload again, and confirm that the final, recommendation, decision, approval, delivery, closure, work queue, and board remain consistent.
20. Inspect chat, research, drafts, finals, and revision views. Confirm that provider names, internal paths, trace fields, tool syntax, internal IDs, and malformed inline `Lawyer` suffixes do not appear in ordinary lawyer-facing content.

This script is the engineering acceptance gate. The later ten-matter experiment tests independent usability and recurrence after this gate passes.

## 4. Build

### 4.1 Fixed product decisions

These decisions are authoritative for implementation:

1. Safe reversible work can continue in the background. Approval is not a global work lock.
2. A user click is required to record a decision, approve, record delivery, close, or perform a destructive action.
3. Chat can propose those material actions. It cannot execute them directly.
4. Safe support work can execute through typed tools without a confirmation click. Examples include research, work-item maintenance, stage reconciliation, and artifact saves.
5. Typed operation results and persisted Markdown are the only authority for state-change success. Remove phrase or string matching as the authority for mutation truth.
6. The app-wide result contract must serve chat, the workspace, and the board.
7. A lawyer's direct recommendation edit updates the structured working recommendation and creates version history.
8. An agent recommendation change is a proposal until the lawyer accepts it.
9. Recommendations, recorded decisions, approval, delivery, and closure are separate records and concepts.
10. Research has a durable per-matter queue. The first question starts automatically. The user can reprioritize pending questions. A running question normally finishes.
11. Research provider fallback is app-wide for the MVP. There is no per-matter provider override.
12. Settings include a primary external research provider, an external fallback provider or **None**, a model-only fallback toggle, the model-only provider and model, and provider timeout/retry values.
13. Kimi K3 Fast on NeuralWatt is the initial model-only fallback. Resolve its exact catalog ID from the configured model catalog. Do not invent or silently substitute an ID.
14. Model-only analysis is useful fallback work. It must state that no external authority was retrieved.
15. The board is a deterministic audit surface. It can identify safe state mismatches and offer an explicit repair. It must not infer or manufacture material records.
16. **Record manual delivery** records local `outside_counsel_os` state only. It contacts no person or service.
17. Show disabled **Send directly — coming later** as a future control. Do not implement external delivery in this build.
18. Suggested answers, owners, and relevant next actions should be mouse-selectable where practical.

### 4.2 Core invariants

- Keep all file operations inside the active `VAULT_PATH`.
- Keep `matter.md` as lifecycle authority.
- Keep canonical work products and recommendation versions in Markdown.
- Keep SQLite disposable and rebuildable.
- Never infer a durable success from assistant prose.
- Never make a recorded recommendation become a decision.
- Never let background research change a later matter stage backward.
- Never let a background result replace an approved artifact silently.
- Never hide useful analysis because retrieval, citation formatting, schema output, or one tool step failed.
- Preserve user changes already present in the dirty worktree.
- Do not commit, push, deploy, reset, clean, stash, or create a worktree.

### 4.3 App-wide typed operation result

Extend the existing result and tool-trace contracts. Do not build a general event bus.

Every state-changing HTTP action and typed tool must return a common result with the minimum fields needed by all surfaces:

```text
action_id or source_action_key
operation
status: changed | no_change | failed | proposed | confirmation_required
summary
matter_id
entity references
changed_paths
resulting matter state
available next actions
required user action, if any
safe error and recovery text, if any
```

Use successful typed results plus reloaded Markdown to render recorded-action cards, badges, and success text. Chat prose remains useful analysis, but it cannot create a recorded-success state.

For material actions, return a structured proposal or confirmation card. The click calls the same deterministic service used by direct workspace controls. Do not use a wording classifier or regular expression to decide whether approval, delivery, closure, or decision recording occurred.

For explicit mutation requests that produce no successful result, return structured status `failed` or `confirmation_required`. Show **No workspace change recorded** from that field. Do not scan the assistant text for phrases.

### 4.4 Lifecycle reconciliation and safe board repair

Reuse `MatterService`, `MatterStateService`, `WorkProductService`, and existing append-only matter events. Do not add a second lifecycle store.

After every canonical finalization:

- persist the current final path and ID;
- reconcile any pre-Closed matter to Respond;
- compute the truthful next action from final, recommendation, required work, approval, delivery, and closure state;
- return the actual resulting state to the caller;
- leave active or queued background work independent from the matter stage.

Research can run while the matter is in Respond or waiting for approval. Its status is shown as background work. It cannot move Respond or Closed backward.

Add deterministic consistency codes to matter state for contradictions that can exist in legacy or partially written records. Examples include final-with-pre-Respond-stage, approval-without-current-final, delivered-without-approved-artifact, and Closed-without-required durable fields. Only safe derived-field repair is automatic or user-repairable. A repair cannot create approval, delivery, closure, or a decision.

Finalization and lifecycle copy must use the returned state. Never say **Ready for approval** unless approval is actually available.

### 4.5 Deterministic intake recovery

Keep the existing intake agent and structured question cards. After the second malformed structured reply:

1. Preserve useful reply text and any successful saved facts.
2. Inspect the current durable intake record.
3. Select the highest-value unresolved intake category from the existing matter structure: business objective, requested legal output, key actors or flow, timing, jurisdiction, material known fact, or material missing fact.
4. Render one valid question card with clickable suggested answers when grounded suggestions are available.
5. Always offer a clear **Continue with assumptions** or **Finish intake** route when more detail is not necessary.
6. Never show a generic retry loop or create repeated active cards.

The model can improve wording when it succeeds. The deterministic fallback owns card validity and completion state.

Compact repeated failed, superseded, answered, and stopped intake turns into one current card plus expandable audit history. Keep the Markdown records.

### 4.6 Durable research queue and usefulness status

Extend the existing in-process `ResearchRunService`. Do not add Redis, Celery, a broker, or a distributed worker.

Use current research run records where practical. Add only the smallest Markdown queue representation needed to preserve question ID, text, priority/order, state, run link, origin, and timestamps. There is at most one actively executing research item per matter for this MVP.

Required behavior:

- The first queued item starts automatically.
- New questions can be added while another item runs.
- The lawyer can move pending items up or down by click or drag.
- Reprioritization does not cancel the running item.
- The queue continues while approval is pending.
- On local restart, durable queued work is visible and can resume safely without duplicates.
- Each question creates or links to one truthful result packet or failure record.
- The visible **Run research** control always submits a non-empty question: selected saved question, entered question, then matter title as the final safe fallback.

Research status must focus on legal usefulness:

- question answered or not answered;
- external authority retrieved or not retrieved;
- supplied sources used;
- internal support used;
- assumptions used;
- remaining gaps;
- whether the result is model-only.

Move provider, attempt, elapsed-time, correlation, and timeout detail to a separate technical details section. Keep enough diagnostic metadata for engineering.

Revise the research-agent prompt so that it prioritizes a useful first-pass answer, distinguishes source classes, states material assumptions, identifies remaining gaps, and never presents generated analysis as retrieved authority.

### 4.7 Provider fallback settings and Polaris diagnosis

Use the existing Markdown settings service and provider adapters. Add flat app-wide settings. Do not build a new settings framework.

Minimum settings:

```text
research.primary_external_provider
research.fallback_external_provider
research.model_fallback_enabled
research.model_fallback_provider
research.model_fallback_model
research.external_timeout_seconds
research.external_retry_count
```

`research.fallback_external_provider` can be `none`. Provider options must come from supported configured adapters. The model fallback provider and model must come from the existing model catalog.

For this build, the supported external research choices are `polaris`, `tavily`, and `none`. The native intelligence scanner is a separate component. It is not an external legal-research fallback and is outside this change.

Use NeuralWatt through the existing OpenAI-compatible provider and its live model catalog. Do not create a NeuralWatt-specific adapter.

Keep the configuration boundary explicit:

- Environment configuration owns credentials, provider base URLs, and hard safety limits.
- Markdown settings own non-secret provider choices, model choices, timeout preferences, and retry preferences.
- Runtime code combines the two and bounds user preferences by backend safety limits.
- Never write credentials or secret values to Markdown.

`SettingsService.write` remains the existing free-form Markdown persistence seam. Do not add validation there unless a focused test proves that it is necessary. If it becomes necessary, stop and report the coordinator seam before editing `backend/app/services/settings.py`.

Before changing timeout behavior, diagnose Polaris configuration with one focused request. Separate credential/configuration, network, provider, and timeout causes. A legal research request can validly take longer than 46 seconds. Use operation-specific settings and honest elapsed state. Do not use one universal short timeout to classify all longer research as stalled.

Fallback sequence:

1. Try the configured primary external provider.
2. On a safe provider failure, try the configured external fallback if it is not `none` and is not the same provider.
3. If no external authority is retrieved and model fallback is enabled, use the configured model to preserve useful analysis.
4. Record exactly which legs ran and what each leg produced.
5. Label the final result truthfully.

Do not claim that a second language model retrieved sources unless a retrieval provider actually returned them.

### 4.8 Recommendation versions and decision disposition

Keep `recommendations.md` as the current working recommendation. Add narrow Markdown version history. Do not build a general document versioning subsystem.

Required behavior:

- Initial work-product generation can save the work product and structured recommendation in one typed operation.
- The result links the work product to the recommendation version used.
- A direct lawyer edit in the recommendation control updates the current recommendation and creates a version snapshot automatically.
- An agent revision creates a proposed recommendation version. It does not replace the current version until the lawyer clicks **Accept recommendation update**.
- An edited work product that was based on an older recommendation version shows a review-needed link. Do not parse arbitrary prose headings to guess that a recommendation changed.
- An approved final keeps the exact recommendation version or snapshot it contained. Later research or proposals do not change the approved artifact.

Extend decision recording with a recommendation disposition:

```text
followed | modified | not_followed | not_applicable
```

Require a short reason for `modified` or `not_followed`. Store the referenced recommendation version. The decision remains append-only and separate.

### 4.9 Participants and work queue

Use the existing participants and work-item Markdown records.

- Show all open work items, not only the current one.
- Let the lawyer assign, reprioritize, and complete each item.
- Preserve one visible current next action while keeping the rest of the queue available.
- Populate owner suggestions from named participants and configured lawyer identity.
- Make suggestions clickable. Keep free text available.
- Add or maintain participants through a small direct control.
- Do not require clicks for agent-created non-substantive work items.
- Do not let work-item state hide the independent lifecycle action.

### 4.10 Delivery, output hygiene, dates, and creation feedback

Delivery:

- Rename the live action to **Record manual delivery**.
- Before confirmation, state: **This records delivery outside Themis.ai. It does not send or contact anyone.**
- Keep `outside_counsel_os` as the compatibility value.
- Show disabled **Send directly — coming later** with a short explanation.
- Do not implement email, Slack, or other external sending.

Output hygiene:

- Keep internal diagnostics out of ordinary chat, research, draft, final, and revision content.
- Keep technical diagnostics inspectable in a separate view.
- Remove malformed revision author pseudo-text such as inline `Lawyer` suffixes.
- Preserve useful legal content when cleanup removes internal text.

Target dates:

- Instrument one visible create request from date input through request payload, API model, `request.md`, `matter.md`, response, index, and reload.
- Fix the first proven break only.
- C0 adds backend regression coverage for request model, API persistence, Markdown, index, and reload.
- C4 adds a frontend script that proves the date input reaches the create request.
- The visible-browser verification proves the complete end-to-end chain.

Creation feedback:

- Return or show durable matter creation before slow intake startup finishes.
- Show distinct **Matter created; intake is starting** state.
- Keep one submission disabled only while that creation request is pending.
- Use a narrow source-action key if repeat submission can still create duplicates.

### 4.11 Worker configuration

Use Codex workers in one shared working tree.

```yaml
parallel:
  optimize_for: balanced
  max_agents: 4
  workers:
    - name: sol-medium-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 3
    - name: sol-medium-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 1
    - name: sol-high-escalation-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
```

Use one combined Sol Medium review after the accepted implementation waves. Do not make the Sol Medium reviewer serialize independent implementation chunks. The Sol High reviewer is read-only and is used only under the escalation rule below.

Workers may read any repository file. They may write only their assigned paths. They must use the current tree state, preserve user changes, and report any needed out-of-scope file instead of editing it.

Before each worker or wave, the coordinator records an exact baseline path snapshot. After each worker or wave, compare every changed path to that snapshot and the accepted write scopes. For parallel C1 and C2, use one shared Wave 1 baseline and require each worker to report its exact changed paths. Never assign an unexpected path to a worker by guess.

### 4.12 Wave 0 — coordinator baseline and diagnosis

Before dispatch:

1. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, this plan, the Harborline rerun report, and the live experiment skill.
2. Record branch, commit, full `git status --short`, active vault path, and an exact changed-path snapshot. Do not print secrets.
3. Record both a full hash of repository `vault/` and a protected hash or manifest that excludes only these three allowed prompt files:

   ```text
   vault/00_System/agents/counsel-copilot.md
   vault/00_System/agents/intake-agent.md
   vault/00_System/agents/research-agent.md
   ```

   Only these three repository-vault prompt files may change during implementation. All other repository `vault/` paths must continue to match the protected baseline.
4. Create `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md` from the supplied template if it does not exist.
5. Run focused Graphify queries for lifecycle/action results, intake, research/provider settings, recommendation/decision, and board/create flow.
6. Run the current backend suite and frontend checks once. Record exact baseline failures. Do not erase or reclassify pre-existing failures.
7. Use temporary isolated vaults for reproduction. Do not write test data to repository `vault/`.
8. Diagnose the target-date chain and one Polaris request before code changes.
9. Query the configured live model catalog without printing environment values or secrets. Record the exact catalog ID for NeuralWatt Kimi K3 Fast. If it is absent, stop before implementation and report an environment-configuration blocker. Do not add a new adapter or silently substitute another model.

### 4.13 Chunk C0 — shared result and lifecycle foundation

Run one Sol Medium implementer alone.

Outcome: every durable action returns one structured result, canonical finalization reconciles the matter, background work remains independent, and all later chunks have frozen contracts.

Exclusive write scope:

```text
backend/app/models/api.py
backend/app/services/matter_state.py
backend/app/services/matters.py
backend/app/services/work_product.py
backend/app/routers/matters.py
backend/app/tools/handlers.py
backend/app/tools/registry.py
backend/tests/test_matter_action_api.py
backend/tests/test_matter_action_tools.py
backend/tests/test_matter_lifecycle.py
backend/tests/test_matter_state.py
backend/tests/test_matters.py
backend/tests/test_work_product.py
frontend/lib/types.ts
frontend/lib/api.ts
frontend/lib/matterActions.ts
frontend/lib/matterBrief.ts
```

Implement:

- the common operation-result contract;
- explicit confirmation results for decision, approval, delivery, closure, and destructive actions;
- direct UI mutation routes using the same deterministic services;
- canonical-final lifecycle reconciliation from any pre-Closed stage;
- background-work state independent from lifecycle stage;
- consistency issue codes and a safe repair route;
- truthful next-action and finalization text fields;
- durable matter creation returned before slow intake startup, with a narrow source-action key if repeat submission can still duplicate a matter;
- the target-date fix if Wave 0 proves the break inside this scope;
- focused contract and lifecycle tests.

Do not implement a generic action log, event bus, or strict state machine.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_matter_lifecycle.py tests/test_matter_state.py tests/test_matters.py tests/test_work_product.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

The coordinator inspects ownership and the diff, runs the check, and freezes the contracts before Wave 1.

### 4.14 Wave 1 — two parallel Sol Medium chunks

#### Chunk C1 — chat truth and deterministic intake

Dependencies: C0.

Outcome: mutation truth no longer depends on string matching, malformed intake recovers deterministically, suggestions are clickable, and history stays readable.

Exclusive write scope:

```text
backend/app/agents/runner.py
backend/app/agents/output.py
backend/app/routers/chat.py
backend/app/services/chat_runs.py
backend/app/services/chat_history.py
backend/app/services/matter_records.py
backend/tests/test_agents.py
backend/tests/test_chat_runs.py
backend/tests/test_chat_history.py
backend/tests/test_matter_records.py
frontend/components/ChatPanel.tsx
frontend/components/ChatCards.tsx
frontend/lib/chatRunLogic.ts
frontend/lib/chatCardLogic.ts
frontend/scripts/check-adaptive-intake.ts
frontend/scripts/check-chat-run-recovery.ts
frontend/scripts/check-transport-preservation.ts
vault/00_System/agents/counsel-copilot.md
vault/00_System/agents/intake-agent.md
backend/app/blank_vault_template/00_System/agents/counsel-copilot.md
backend/app/blank_vault_template/00_System/agents/intake-agent.md
backend/tests/fixtures/vault/00_System/agents/counsel-copilot.md
backend/tests/fixtures/vault/00_System/agents/intake-agent.md
```

Implement the structured result rendering, material-action proposal cards, no-change result, deterministic second-failure intake recovery, clickable choices, and compact history. Remove phrase matching as mutation authority. Keep narrow output sanitization only for internal control leakage.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_agents.py tests/test_chat_runs.py tests/test_chat_history.py tests/test_matter_records.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-adaptive-intake.ts
node --experimental-strip-types scripts/check-chat-run-recovery.ts
node --experimental-strip-types scripts/check-transport-preservation.ts
```

The two allowed repository-vault files in this chunk must stay in parity with their blank-vault-template and fixture mirrors.

#### Chunk C2 — research queue, provider fallback, and usefulness

Dependencies: C0.

Outcome: research runs from a durable user-prioritized queue, uses explicit app-wide fallback settings, and preserves truthful useful output.

Exclusive write scope:

```text
backend/app/config.py
backend/app/intelligence/polaris.py
backend/app/services/research.py
backend/app/services/research_runs.py
backend/app/services/search.py
backend/app/routers/settings.py
backend/app/providers/factory.py
backend/app/runtime.py
backend/tests/test_intelligence_providers.py
backend/tests/test_research.py
backend/tests/test_settings.py
frontend/app/settings/page.tsx
frontend/app/matters/[matterId]/research/page.tsx
frontend/lib/types.ts
frontend/lib/api.ts
frontend/lib/stubs.ts
frontend/lib/research.ts
frontend/lib/researchQueue.ts
frontend/scripts/check-research-queue.ts
vault/00_System/agents/research-agent.md
backend/app/blank_vault_template/00_System/agents/research-agent.md
backend/tests/fixtures/vault/00_System/agents/research-agent.md
```

Implement the small durable queue, pending reorder, restart-safe visibility/resume, non-empty visible action, provider chain, Kimi K3 Fast model-only fallback, useful status, technical diagnostics separation, and stronger researcher prompt.

Ownership of `frontend/lib/types.ts` and `frontend/lib/api.ts` transfers from C0 after C0 acceptance. C2 may extend the frozen contracts for settings and research, but must preserve backward compatibility. C2 owns `frontend/lib/stubs.ts` because it contains the default settings. `backend/app/services/settings.py` is read-only for this chunk unless the coordinator accepts a test-proven seam.

Wave 0 must prove that the exact Kimi K3 Fast catalog model exists before C2 starts. If the configured catalog later becomes unavailable, fail truthfully and stop the gate. Do not save an unset fallback, build a new provider adapter, or substitute Polaris or another model.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_intelligence_providers.py tests/test_research.py tests/test_settings.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-research-queue.ts
node --experimental-strip-types scripts/check-provider-admin.ts
```

### 4.15 Wave 1 gate

Wait for C1 and C2. Compare every changed path to the shared Wave 1 baseline and each worker's exact ownership report. Run both focused checks. Then run the cross-chunk gates once:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_blank_vault_parity.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

Confirm that the three allowed repository-vault prompt files match their mirrors and that every other repository-vault path still matches the protected baseline. Resolve contract mismatches centrally only when the edit is small and clearly belongs to the frozen C0 seam. Record each integration edit in progress.

Do not start Wave 2 until C1 and C2 are accepted.

### 4.16 Wave 2 — recommendation and work-state integration

#### Chunk C3 — recommendations, decisions, participants, and work queue

Dependencies: C0, C1, and C2.

Outcome: recommendations are versioned and synchronized by explicit origin rules, decisions record disposition, and all work remains visible and assignable.

Exclusive write scope transfers after Wave 1 acceptance:

```text
backend/app/services/recommendations.py
backend/app/models/api.py
backend/app/agents/context.py
backend/app/services/work_product.py
backend/app/services/matters.py
backend/app/services/matter_paths.py
backend/app/services/decisions.py
backend/app/services/document_review.py
backend/app/tools/handlers.py
backend/app/routers/matters.py
backend/app/routers/decisions.py
backend/tests/test_recommendations.py
backend/tests/test_demo_content.py
backend/tests/test_work_product.py
backend/tests/test_matters.py
backend/tests/test_matter_paths.py
backend/tests/test_decisions.py
backend/tests/test_document_review.py
frontend/components/MatterWorkspace.tsx
frontend/components/RecordDecisionModal.tsx
frontend/components/DocumentReview.tsx
frontend/components/RevisionPlugin.tsx
frontend/components/RevisionTextNode.tsx
frontend/lib/types.ts
frontend/lib/api.ts
frontend/lib/reviewAuthor.ts
frontend/lib/recommendations.ts
frontend/app/globals.css
frontend/scripts/check-recommendation-integrity.ts
```

Ownership of `backend/app/models/api.py` transfers from C0 after Wave 1. Ownership of `frontend/lib/types.ts` and `frontend/lib/api.ts` transfers through C0 to C2 and then to C3. Extend them for recommendation versions, decision disposition, participant maintenance, and work-item controls. Do not weaken or incompatibly replace the accepted C0 operation-result contract or C2 research/settings contracts.

Implement atomic initial save, working and proposed recommendation versions, direct-lawyer version updates, accept-proposal click, work-product version references, decision disposition/reason, all-item queue controls, participant maintenance, clickable owner suggestions, manual-delivery wording and buttons, and revision-author output cleanup. Remove malformed author suffixes at their source, including CSS pseudo-element output, instead of trimming valid revision text.

Material actions must remain explicit clicks. Background work can create proposals and non-substantive work items.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_recommendations.py tests/test_demo_content.py tests/test_work_product.py tests/test_matters.py tests/test_matter_paths.py tests/test_decisions.py tests/test_document_review.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-recommendation-integrity.ts
npm run typecheck
```

### 4.17 Wave 3 — board audit, dates, and creation feedback

Run C4 after C3 is accepted so it reads the final shared frontend types and API client.

#### Chunk C4 — board audit, dates, and creation feedback

Dependencies: C0 and C3.

Outcome: creation has immediate durable feedback, target dates survive the full path, and the board shows truthful consistency issues and safe repair controls.

Exclusive write scope:

```text
frontend/components/NewMatterForm.tsx
frontend/components/StageBoard.tsx
frontend/components/MattersTable.tsx
frontend/app/matters/page.tsx
frontend/lib/design.ts
frontend/lib/types.ts
frontend/lib/api.ts
frontend/scripts/check-matter-creation.ts
frontend/scripts/check-workspace-ux.ts
```

Ownership of `frontend/lib/types.ts` and `frontend/lib/api.ts` transfers from C3 only after C3 acceptance. Use the final shared API contract. Add immediate created/pending-intake feedback, repeat-click protection, a date-input-to-request regression script, audit issue labels, review links, and the explicit safe repair control. Keep color semantic and always pair color with a state word.

If the proven target-date break requires a backend file outside this scope, report it to the coordinator. The original C0 implementer makes the narrow correction after C4 stops.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-creation.ts
node --experimental-strip-types scripts/check-workspace-ux.ts
npm run typecheck
```

### 4.18 Wave 3 gate and integration

After C3, inspect ownership and run its focused checks before starting C4. After C4, inspect ownership and run its focused checks. Compare every wave against its exact baseline path snapshot. The coordinator owns only these final seams:

```text
docs/ACCEPTANCE_TESTS.md
docs/ARCHITECTURE.md
docs/DESIGN_LANGUAGE.md
README.md
CODEX_HANDOFF.md
current.md
contextmap.md
decisions.md
graphify-out/**
```

Update current product documentation only when behavior changed. Do not rewrite historical experiment reports or old handoff plans.

### 4.19 Combined Sol Medium review

After all implementation waves pass focused checks, create one fresh read-only Sol Medium reviewer. It must not be an implementer from this build.

Give it:

- this plan and progress file;
- baseline and current diffs;
- all focused test output;
- the Harborline rerun report;
- the fixed product decisions;
- exact changed-file ownership.

Require one verdict for each group:

```text
AR — typed action results and confirmation boundary
LC — lifecycle reconciliation and background-work independence
IN — deterministic intake recovery and card history
RQ — research queue and prioritization
PF — external and model fallback settings
RC — recommendation versions and decision disposition
WQ — participants and work-item controls
OH — output hygiene
DL — delivery boundary and future control
TD — target date durability
MC — creation feedback and retry safety
BA — board audit and safe repair
```

Format:

```text
Group: <ID>
Verdict: PASS | FIX | ESCALATE
Evidence: <code and test or reproduction>
Risk: <remaining risk or none>
Smallest correction: <for FIX>
Escalation question: <for ESCALATE>
```

A `FIX` returns to the original Sol Medium implementer when possible. The coordinator checks the correction. The same Sol Medium reviewer then rechecks only affected groups plus cross-group regressions.

### 4.20 Sol High escalation rule

Use one fresh read-only Sol High reviewer only when the Sol Medium reviewer returns `ESCALATE` with evidence. Do not escalate for preference, broad reassurance, or because a task is large.

Valid escalation triggers:

- Markdown and rebuilt SQLite still disagree after one focused correction.
- Lifecycle repair could manufacture or destroy a material record.
- A reproducible research queue race or restart duplication survives one changed-condition correction.
- Recommendation version or decision provenance cannot be made unambiguous with the current record model.
- A cross-component correctness failure remains after one focused reproduction and one changed-condition retry.

Give Sol High only the narrow question, relevant files, diff, tests, and evidence. Sol High does not edit. The original Sol Medium implementer applies the decision. The Sol Medium reviewer gives the final verdict.

### 4.21 Full engineering verification

After all review groups pass:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
node --experimental-strip-types scripts/check-research-queue.ts
node --experimental-strip-types scripts/check-recommendation-integrity.ts
node --experimental-strip-types scripts/check-matter-creation.ts
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

After implementation, prove that only the three allowed repository-vault prompts differ from the baseline protected manifest. Record a new full post-build repository-vault hash. Then create a new isolated verification vault through the normal UI. Walk the demo script in a visible browser. Verify matching Markdown after every material mutation. Delete only that verification vault's disposable SQLite index, rebuild it through the supported path, restart locally, and confirm the same state. Re-hash repository `vault/` and prove that the full hash still matches the post-build hash.

Do not classify the expected new-vault confirmation dialog as a stall. For tests, use the existing test-only bypass or click **OK** when it appears.

### 4.22 Fresh-vault Harborline recurrence experiment

After engineering verification passes, use `$live-agent-ux-experiment`.

- Create a new experiment vault. Do not reuse the verification vault or any earlier experiment vault.
- Use the same Harborline fictional company, ten-request themes, and strict metrics as the September 1 rerun so results remain comparable.
- Use Luna Medium for the requester, setup attorney, and each fresh matter attorney, matching the September 1 rerun. Use Sol High for post-run synthesis.
- Use one fresh attorney per matter. Keep live UI writes serial.
- Keep implementation and experiment evidence separate. Do not fix code during actor runs.
- Treat new-vault update confirmation dialogs as expected test setup. Use the test-only bypass or click **OK**. Do not count them as a product stall.
- Actors should control their own visible browser first. If an actor cannot see or control the in-app browser, and Chrome or Safari is also unavailable or broken, the coordinator may open the in-app browser and provide the minimum navigation or click assistance needed to continue, as the user explicitly authorized. Mark the run **assisted**. Keep product-state evidence, but exclude assisted navigation from independent discoverability claims. Repeat unaided later only when a strict discoverability measure is required.
- No real external contact or delivery is allowed.
- After the experiment, re-hash repository `vault/` and prove that it still matches the full post-build hash.

Use the same before/after measures, plus:

- structured result truth across chat, workspace, and board;
- background research while approval waits;
- intake fallback use and click count;
- research queue reorder and completion;
- primary, external fallback, and model-only fallback results;
- recommendation version and decision disposition consistency;
- board audit warnings and safe repair use;
- target date persistence;
- creation feedback time;
- output-hygiene recurrence.

Create a new timestamped raw-evidence folder and a new dated report. Do not overwrite the September 1 evidence or report.

### 4.23 Completion standard

The one-shot build is complete only when:

- C0 through C4 are accepted with no out-of-scope worker edits;
- all twelve review groups have final Sol Medium PASS verdicts;
- any Sol High escalation followed the narrow read-only rule and returned to Sol Medium for the final verdict;
- all focused and full checks pass, or a pre-existing failure is proved and reported without being hidden;
- the visible demo passes in a new verification vault;
- SQLite rebuild and restart preserve Markdown-backed state;
- only the three allowed repository-vault prompt files differ from the pre-build protected baseline;
- the full post-build repository-vault hash remains unchanged through visible verification and the recurrence experiment;
- a separate new Harborline experiment vault exists;
- the ten-matter recurrence experiment and checked synthesis report are complete, unless a documented safety or environment stop applies;
- no commit, push, deployment, destructive cleanup, or real external contact occurred;
- the progress file names every remaining risk and any assisted experiment run.

### 4.24 Issue traceability

| Finding or decision | Primary build area | Proof |
|---|---|---|
| Lifecycle disagreement | C0 | Finalize from every pre-Closed stage; reload and board agree |
| Unsupported chat mutation claims | C0 + C1 | Structured result only; no phrase-matcher authority |
| Structured intake failures | C1 | Second malformed reply yields one valid clickable question |
| Empty Run research action | C2 | Non-empty fallback chain and saved result/failure |
| Research prioritization | C2 | Durable queue, background execution, pending reorder |
| Polaris and provider fallback | C2 | Explicit app-wide chain and truthful per-leg result |
| Recommendation disagreement | C3 | Atomic initial save, versions, proposals, direct edit rule |
| Decision departure reason | C3 | Disposition and reason linked to recommendation version |
| Participants and work items | C3 | All items assignable/completable with clickable suggestions |
| Internal output leakage | C1 + C2 + C3 | Clean ordinary output; separate diagnostics |
| Delivery boundary | C3 | Explicit manual record and disabled future send |
| Target-date loss | C0 + C4 | One date survives input through reload |
| Creation feedback | C4 | Immediate durable-created state; no repeat duplicate |
| Historical card noise | C1 | One current card plus expandable history |
| Board as audit surface | C0 + C4 | Deterministic issue codes and safe explicit repair |

## 5. Parked backlog

These items are understood but are not part of this build:

- Real direct delivery from Themis.ai. Build only after a separate security, recipient-confirmation, audit, and integration design is approved.
- Per-matter research-provider overrides. Add only after users show that app-wide settings cannot support normal work.
- More than one concurrent research item per matter. Add only after measured queue delay shows one active item is insufficient.
- Distributed research workers, broker, or cloud queue. Add only after local in-process work cannot meet demonstrated reliability or scale needs.
- Automatic semantic extraction of a recommendation from arbitrary edited prose. Add only after the dedicated recommendation control and version links cause material user friction.
- Automatic interruption of running research when priority changes. Add only after users demonstrate that finishing the current item is materially harmful.
- Automatic repair of approval, decision, delivery, or closure records. Do not add without a separate record-integrity design and explicit user approval.
- General event sourcing or a universal workflow engine. Add only when multiple validated workflows cannot be represented by current Markdown records and narrow services.
