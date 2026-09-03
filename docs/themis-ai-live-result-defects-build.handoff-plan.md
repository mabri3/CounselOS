# Themis.ai live-result defect repair plan

## 1. Result

The September 1 live rerun found four product defects that need code changes, one state-clarity defect, and one provider failure that needs better diagnosis before behavior changes.

The repair must keep the current architecture. Markdown remains authoritative. SQLite remains a rebuildable index. Material legal actions still require a lawyer click. No new workflow engine, event bus, verifier agent, provider adapter, distributed queue, or approval gate is needed.

This plan is ready to build. No product decision is blocked on user input.

## 2. Source evidence

Primary evidence:

- `docs/experiments/2026-09-01-harborline-workflow-reconciliation-rerun-report.md`
- `tmp/harborline-workflow-reconciliation-20260901-135832/synthesis-draft.md`
- the saved experiment vault and normalized evidence in `tmp/harborline-workflow-reconciliation-20260901-135832/`
- the current implementation and tests in this repository

Observed result:

| Area | Live result | Cause confidence | Repair decision |
|---|---:|---|---|
| Browser-native confirmations | 1 of 10 matters reached delivery and Closed; Matters 03-10 hung before the delivery request. Five frontend paths use blocking `window.confirm`. | Confirmed delivery trigger; the other four are the same experiment-control risk | Replace every `window.confirm` with one shared in-product confirmation dialog. Keep each existing action and safety check. |
| Durable decisions | Four assistant replies said a decision was saved; zero decision records existed | Confirmed | Reconcile assistant text with typed operation results before save and return. Preserve useful analysis. |
| Recommendation history | Seven matters had substantive recommendation text; zero had typed version history | Confirmed | Make the typed recommendation editor the only write path for `recommendations.md`. |
| Research queue state | Eight of ten matters had packets at the frozen cutoff; two more arrived later | Confirmed state-projection gap | Show and poll the full existing queue on the matter overview. Freeze evidence only after the queue is terminal or a recorded cutoff expires. |
| Approval clarity | Approval could look final while required work remained open | Confirmed display gap | Show `Approved — required work remains` with count and titles. Do not block approval or delivery. Keep closure blocked. |
| Polaris public research | 18 timeouts, 2 HTTP failures, and no retrieved authority | Failure confirmed; root cause unknown | Keep the useful model-only fallback. Add safe HTTP status classification. Do not change provider, timeout, or retry defaults without a controlled trace. |
| Intake radio locators | Some actors had stale locator errors and recovered | Browser-control error, not proven product defect | Do not change intake code in this repair. Track separately in the recurrence report. |

## 3. Fixed product decisions

1. Approval and manual delivery remain available while required work is open.
2. Closure remains blocked until required work is complete.
3. Manual delivery is only a local record of an action outside Themis.ai. It sends nothing.
4. Legacy recommendation text opens in the typed editor. The first explicit lawyer save creates version one and shows that history begins with that save.
5. Agent recommendation changes remain proposals until a lawyer accepts them.
6. Typed operation results and Markdown are the authority for mutation success. Assistant prose is not authority.
7. Useful analysis must remain visible when no mutation occurred.
8. The current serial Markdown research queue is retained. No new queue service is added.
9. Polaris remains the configured primary external provider until evidence supports a settings or provider change.
10. No repository `vault/` file needs to change for this repair. Do not rewrite agent prompts to solve a runtime truth defect.
11. Browser-native confirmation dialogs are not permitted. They block page JavaScript and are not reliably visible or controllable through the live experiment browser tools. Every confirmation must be an accessible dialog in the page DOM.

## 4. Thesis

One matter must move from intake through research, a tracked recommendation, a recorded decision, final approval, manual delivery, and closure with the same truthful state in chat, the matter overview, the research page, and reloaded Markdown.

## 5. Payoff moment

The lawyer sees useful chat analysis plus `No workspace change recorded` when no typed action occurred. The lawyer then opens the tracked recommendation, accepts a real proposal, sees all research items finish, approves with an open required item, records manual delivery in an in-product dialog, completes the item, closes the matter, and sees the same result after reload and SQLite rebuild.

## 6. Demo script

1. Open Settings and create a new isolated verification vault. Confirm that the confirmation is an in-page `alertdialog`, Cancel makes no change, and Confirm creates the vault. No browser-native popup may appear.
2. In the verification vault, exercise the company-replacement confirmation when applicable. Confirm that Cancel preserves the saved profile and Confirm performs the existing replacement action. No browser-native popup may appear.
3. Create one fictional matter with one required work item.
4. Open legacy `recommendations.md` from the artifact link, the tree, and a `?file=` deep link. Confirm that each route opens the typed recommendation editor.
5. Save a lawyer edit. Confirm version one, actor, origin, content, and reload persistence.
6. Create an agent recommendation proposal through the typed tool. Confirm that it does not replace the working version. Accept it by click. Reload and confirm the accepted version.
7. Use a controlled no-tool model response that says a decision or research run was saved. Confirm that useful analysis remains, the unsupported success statement is removed, the response contains the exact durable status, and no durable record exists.
8. Prepare a decision through chat, use the confirmation card, choose a recommendation disposition, and record it. Confirm one decision record and its recommendation-version link.
9. Queue three research questions. When the first completes and the second is active, confirm that the matter overview and Research page show the same three run IDs, order, and states without reload.
10. Wait until every run is terminal. Confirm packet links and freeze the evidence count only then. If the wait limit expires, record the remaining run IDs and states.
11. Run one privacy-safe Polaris probe with current settings. If it fails, confirm a useful partial/model-only packet, `No external authority retrieved`, and safe failure class, attempts, elapsed time, correlation ID, and HTTP status when available.
12. Finalize and approve while the required item is open. Confirm `Approved — required work remains`, its count, and its title.
13. Click **Record manual delivery**. Confirm an in-product dialog. Cancel it and reload; confirm no delivery record.
14. Open the dialog again and confirm. Confirm exactly one delivery event, clear outside-Themis.ai wording, no external contact, and the reloaded delivery state.
15. Try to close. Delivery is already recorded, so this step specifically proves that the remaining required item still blocks closure.
16. Complete the required item, close the matter, reload, rebuild only the verification vault's SQLite index, restart, and confirm the same Closed state.

The payoff demo is the first acceptance gate. The ten-matter recurrence experiment starts only after it passes.

## 7. Implementation blueprint

### 7.1 Shared-tree rules

- Use one shared working tree.
- Do not create worktrees, clones, temporary commits, or patch transport.
- Preserve the current dirty-tree baseline. Every existing change is user-owned unless this plan assigns it.
- Workers may read any file. They may edit only their exact write scope.
- Workers may not spawn agents.
- Use `apply_patch` for manual edits.
- Do not commit, push, deploy, reset, clean, stash, or delete user data.
- Use only isolated temporary vaults for mutation tests.
- Do not write test data or repair code to repository `vault/`.

Before every wave, the coordinator must save an exact path-and-SHA-256 manifest for all assigned write scopes. After each worker stops, compare current hashes with that manifest and the worker's exact changed-path report. A dirty Git status alone cannot prove ownership.

### 7.2 Worker routing

```yaml
parallel:
  optimize_for: balanced
  max_agents: 3
  workers:
    - name: terra-medium-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-terra
      effort: medium
      max_concurrent: 2
    - name: terra-high-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-terra
      effort: high
      max_concurrent: 2
    - name: terra-xhigh-combined-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-terra
      effort: xhigh
      max_concurrent: 1
    - name: sol-high-escalation-implementer
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
```

Do not silently change a model, effort, role, or ownership assignment.

### 7.3 Normalized chunk manifest

This manifest is authoritative for dispatch. The combined Terra extra-high review happens after all chunks are accepted. It is not a per-chunk review gate.

```yaml
chunks:
  C1-truthful-chat-result:
    outcome: Immediate chat responses and saved history show the same typed mutation outcome, with useful analysis preserved and unsupported success claims removed.
    depends_on: [wave-0-baseline]
    write:
      - backend/app/agents/output.py
      - backend/app/agents/runner.py
      - backend/app/models/api.py
      - backend/app/routers/chat.py
      - backend/app/services/chat_runs.py
      - backend/tests/test_agents.py
      - backend/tests/test_chat_history.py
      - backend/tests/test_chat_runs.py
      - frontend/lib/types.ts
      - frontend/components/ChatPanel.tsx
      - frontend/scripts/check-chat-run-recovery.ts
    read:
      - backend/app/services/chat_history.py
      - backend/app/tools/handlers.py
      - backend/app/tools/registry.py
      - frontend/components/ChatCards.tsx
      - frontend/scripts/check-review-status-copy.ts
      - vault/00_System/agents/counsel-copilot.md
    risk: high
    implementer: terra-high-implementers
    reviewer: coordinator
    check: cd backend && .venv/bin/python -m pytest tests/test_agents.py tests/test_chat_history.py tests/test_chat_runs.py && cd ../frontend && node --experimental-strip-types scripts/check-chat-run-recovery.ts && node --experimental-strip-types scripts/check-review-status-copy.ts
    provides: One finalized typed operation-result seam for response text, ChatResponse, chat-run storage, and conversation history.

  C2-protected-recommendation-path:
    outcome: Every normal API and UI path for any matter recommendation is read-only or uses RecommendationService and produces truthful typed version or proposal state.
    depends_on: [wave-0-baseline]
    write:
      - backend/app/routers/files.py
      - backend/app/services/recommendations.py
      - backend/tests/test_recommendations.py
      - frontend/components/RecommendationPanel.tsx
      - frontend/scripts/check-recommendation-integrity.ts
    read:
      - backend/app/routers/matters.py
      - backend/app/services/matters.py
      - backend/app/services/document_review.py
      - frontend/lib/api.ts
      - frontend/lib/recommendations.ts
      - frontend/lib/types.ts
      - frontend/components/DocumentPanel.tsx
    risk: high
    implementer: terra-high-implementers
    reviewer: coordinator
    check: cd backend && .venv/bin/python -m pytest tests/test_recommendations.py && cd ../frontend && node --experimental-strip-types scripts/check-recommendation-integrity.ts
    provides: A protected backend write boundary and a reusable typed RecommendationPanel for C5.

  C3-full-research-queue-view:
    outcome: One reusable component renders the complete existing matter research queue and polls until every item is terminal.
    depends_on: [wave-0-baseline]
    write:
      - frontend/components/ResearchQueuePanel.tsx
      - frontend/app/matters/[matterId]/research/page.tsx
      - frontend/lib/researchQueue.ts
      - frontend/scripts/check-research-queue.ts
    read:
      - frontend/lib/api.ts
      - frontend/lib/types.ts
      - backend/app/routers/settings.py
      - backend/app/services/research_runs.py
    risk: normal
    implementer: terra-medium-implementers
    reviewer: coordinator
    check: cd frontend && node --experimental-strip-types scripts/check-research-queue.ts
    provides: ResearchQueuePanel and one active-queue polling predicate for C5.

  C4-safe-polaris-classification:
    outcome: Polaris failure metadata can distinguish a safe numeric HTTP status without exposing request, response, credential, header, or URL data.
    depends_on: [wave-0-polaris-probe]
    write:
      - backend/app/intelligence/polaris.py
      - backend/tests/test_intelligence_providers.py
      - backend/tests/test_research.py
    read:
      - backend/app/services/research.py
      - backend/app/config.py
      - backend/app/routers/settings.py
    risk: normal
    implementer: terra-medium-implementers
    reviewer: coordinator
    check: cd backend && .venv/bin/python -m pytest tests/test_intelligence_providers.py tests/test_research.py
    provides: Safe failure-class evidence for provider diagnosis with unchanged provider behavior.

  C5-workspace-lifecycle-integration:
    outcome: The matter workspace uses typed recommendation and full-queue views, every frontend confirmation uses one accessible in-product dialog, and conditional approval state is clear.
    depends_on:
      - C2-protected-recommendation-path
      - C3-full-research-queue-view
    write:
      - frontend/components/MatterWorkspace.tsx
      - frontend/components/ConfirmationDialog.tsx
      - frontend/components/CompanyInterview.tsx
      - frontend/components/BriefingWorkspace.tsx
      - frontend/app/settings/page.tsx
      - frontend/app/agents/page.tsx
      - frontend/lib/matterActions.ts
      - frontend/scripts/check-workspace-ux.ts
      - frontend/scripts/check-matter-brief.ts
      - frontend/scripts/check-middle-pane-accordion.ts
      - frontend/scripts/check-confirmation-dialogs.ts
      - backend/tests/test_matter_lifecycle.py
    read:
      - frontend/components/RecommendationPanel.tsx
      - frontend/components/ResearchQueuePanel.tsx
      - frontend/components/DocumentPanel.tsx
      - frontend/lib/api.ts
      - frontend/lib/matterBrief.ts
      - frontend/lib/types.ts
      - backend/app/services/matters.py
      - docs/DESIGN_LANGUAGE.md
    risk: high
    implementer: terra-high-implementers
    reviewer: coordinator
    check: cd backend && .venv/bin/python -m pytest tests/test_matter_lifecycle.py && cd ../frontend && node --experimental-strip-types scripts/check-confirmation-dialogs.ts && node --experimental-strip-types scripts/check-middle-pane-accordion.ts && node --experimental-strip-types scripts/check-workspace-ux.ts && node --experimental-strip-types scripts/check-matter-brief.ts && node --experimental-strip-types scripts/check-research-queue.ts && node --experimental-strip-types scripts/check-recommendation-integrity.ts && npm run typecheck
    provides: The integrated lawyer-visible workflow needed by the payoff demo and recurrence run.
```

### 7.4 Wave 0 — coordinator baseline and diagnosis

Run alone. Do not delegate.

1. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, `docs/ARCHITECTURE.md`, `docs/ACCEPTANCE_TESTS.md`, this plan, and the live report.
2. Record branch, commit, `git status --short`, active vault, and exact working-tree hashes for every planned write path.
3. Hash the complete current repository `vault/` bytes. This dirty working-tree state, not `HEAD`, is the reference. The same hash must remain after engineering, visible verification, and recurrence testing.
4. Run focused Graphify queries for chat mutation truth, recommendation write paths, research queue projection, lifecycle delivery, and Polaris observability.
5. Run the current focused checks once to establish the inherited baseline. Record failures without repairing them outside a chunk.
6. Reproduce the recommendation bypass through generic file save, review-record read, `save_untracked`, and `save_revision` API paths in an isolated vault.
7. Reproduce a no-tool response with false success prose through a deterministic test provider.
8. Make one privacy-safe Polaris probe with current settings. Do not print credentials, environment values, request content, or response body. Retain only safe diagnostic fields.
9. Record all current `window.confirm` locations and the existing action each one protects. This list is the fail-then-pass baseline for C5.

### 7.5 Wave 1 — parallel foundation chunks

Dispatch C1, C2, and C3 together. This uses all three child slots.

#### C1 — truthful chat result contract

- Worker: `terra-high-implementers`
- Model: `gpt-5.6-terra`, high
- Depends on: Wave 0
- Risk: high; record integrity and persistence

Write scope:

```text
backend/app/agents/output.py
backend/app/agents/runner.py
backend/app/models/api.py
backend/app/routers/chat.py
backend/app/services/chat_runs.py
backend/tests/test_agents.py
backend/tests/test_chat_history.py
backend/tests/test_chat_runs.py
frontend/lib/types.ts
frontend/components/ChatPanel.tsx
frontend/scripts/check-chat-run-recovery.ts
```

Required result:

1. Add finalized `operation_results` to `ChatResponse` and its frontend type. Use the existing typed result shape; do not create a second contract.
2. Project the same finalized results into the immediate run response and saved conversation history.
3. Add one deterministic reply-reconciliation function after operation results are final and before response persistence.
4. For `no_change`, `failed`, `proposed`, or `confirmation_required`, remove only complete sentences that make an unsupported current-turn mutation-success claim from an explicit closed list of operations and verbs. Apply this filter only after the typed result proves the current action did not occur.
5. Add a short exact status line derived from the typed result. For a research request with no `run_research` result, use `No durable research run was started.` For a generic no-tool matter turn, use `No workspace change recorded.`
6. Do not infer success from text. Do not broadly ban words such as “saved” or “recorded.” Preserve quotations, recommendations, historical statements, and non-mutation uses of those words.
7. Treat an idempotent no-change result as already recorded only when its service-generated typed result has the existing entity reference. Never invent an entity reference for the generic projected fallback.
8. Ensure timeout and useful-partial response paths use the same projection.
9. Ensure the immediate-response fallback in `ChatPanel` carries operation results when history reload fails.

Focused proof:

- False `Decision recorded` with no tool: analysis remains; success claim is absent; result is `no_change`; no decision file exists.
- Decision proposal: response says confirmation is required; no decision file exists.
- Confirmed decision: response and history show `changed`; one entity reference exists.
- False `Research started` with no tool: response says no durable research run started.
- Timeout with useful content: content remains and the typed outcome is still visible.
- Historical and non-mutation sentences remain unchanged, including `The decision recorded last week remains current.`, `This saves a filing step.`, and `I recommend saving a copy.`
- A negative sentence such as `No decision was recorded.` remains unchanged.

#### C2 — protected recommendation write path

- Worker: `terra-high-implementers`
- Model: `gpt-5.6-terra`, high
- Depends on: Wave 0
- Risk: high; current recommendation record and version history

Write scope:

```text
backend/app/routers/files.py
backend/app/services/recommendations.py
backend/tests/test_recommendations.py
frontend/components/RecommendationPanel.tsx
frontend/scripts/check-recommendation-integrity.ts
```

Required result:

1. Protect every configured matter `recommendations.md`, including legacy files without typed metadata. Reject generic `PUT /files`, `GET /files/review`, and `PUT /files/review` before any generic file or review service can write it. Return a clear message that identifies the typed recommendation endpoint.
2. Prove that rejected generic reads and writes leave content and metadata byte-for-byte unchanged. Cover `save_untracked` and `save_revision` review actions.
3. Keep all existing typed service behaviors: initial agent version, lawyer edit version, agent proposal, explicit accept, idempotency, and decision linkage.
4. Do not invent history for legacy text. The first explicit lawyer save creates version one with origin `lawyer_edit`.
5. Build a reusable typed `RecommendationPanel`. It must show current content, version number, actor, origin, proposal state, the legacy-history label, lawyer edit save, and proposal accept.
6. The component must not call the generic file API.
7. Re-scope `check-recommendation-integrity.ts` to the recommendation service, typed component, and pure recommendation logic. Do not make it assert future `MatterWorkspace` integration.
8. Do not change `MatterWorkspace.tsx` in this chunk. C5 owns all cross-surface integration assertions in `check-workspace-ux.ts`.

Focused proof:

- Generic save of `recommendations.md` returns a client error and changes no bytes.
- Opening its review record, `save_untracked`, and `save_revision` each return a client error and change no bytes.
- A generic save of an ordinary editable note still works.
- Legacy text loads in the typed service with no invented version.
- First lawyer save creates version one.
- Agent proposal does not replace current content until accept.
- Accept records actor, origin, accepted time, and current version.

#### C3 — reusable full research queue view

- Worker: `terra-medium-implementers`
- Model: `gpt-5.6-terra`, medium
- Depends on: Wave 0
- Risk: medium; UI projection only

Write scope:

```text
frontend/components/ResearchQueuePanel.tsx
frontend/app/matters/[matterId]/research/page.tsx
frontend/lib/researchQueue.ts
frontend/scripts/check-research-queue.ts
```

Required result:

1. Extract the existing Research-page queue display and controls into `ResearchQueuePanel`.
2. Keep the current API and backend queue. Do not add another polling service.
3. Render every item with run ID, question, order, clear state word, and packet link when present.
4. Preserve pending-item reprioritization and resume behavior on the Research page.
5. Support a read-only summary mode for the matter overview. C5 will wire it.
6. Export a single helper that says whether polling must continue when any item is `queued` or `running`.
7. Keep `check-research-queue.ts` focused on the reusable component, Research page, ordering helper, and polling predicate. C5 owns the later MatterWorkspace integration assertions.

Focused proof:

- Three items render in stable order.
- Polling remains active after the first item completes while another is queued or running.
- Polling stops only when every item is terminal.
- Moving a pending item does not move the running item.
- Partial, failed, interrupted, and complete state words are distinct.

### 7.6 Wave 2 — parallel diagnosis and workspace integration preparation

After C1-C3 stop, the coordinator must run `npm run check:workspace-ux` once as the Wave 1 integration check. Then accept the chunks or return a bounded correction. After C1-C3 pass coordinator scope and focused checks, dispatch C4. Keep C5 waiting for C2 and C3. C4 can run while the coordinator inspects accepted C1-C3 work.

#### C4 — safe Polaris failure classification

- Worker: `terra-medium-implementers`
- Model: `gpt-5.6-terra`, medium
- Depends on: Wave 0 provider probe
- Risk: medium; provider diagnostics only

Write scope:

```text
backend/app/intelligence/polaris.py
backend/tests/test_intelligence_providers.py
backend/tests/test_research.py
```

Required result:

1. Preserve the current bounded timeout, retry, redirect, response-size, and URL-safety behavior.
2. Add a sanitized HTTP status field to Polaris observability when an HTTP response produced the failure.
3. Do not store headers, request bodies, response bodies, credentials, or URLs in observability.
4. Preserve failure class, attempt count, elapsed time, fallback status, and correlation ID.
5. Keep fallback packets useful and clearly labeled when no external authority was retrieved.
6. Do not change timeout values, retry counts, provider selection, or add a provider.

Focused proof:

- Timeout remains `timeout` with no invented HTTP status.
- HTTP 401, 429, and 5xx expose only the numeric status and existing safe fields.
- Retryable statuses keep the current bounded retry behavior.
- Saved packet metadata and technical details contain the safe fields.
- Ordinary lawyer-facing prose does not expose diagnostics.

### 7.7 Wave 3 — workspace integration

Run C5 only after C2 and C3 are accepted. C1 and C4 may be complete in parallel but must finish before combined review.

#### C5 — matter workspace, lifecycle clarity, and component integration

- Worker: `terra-high-implementers`
- Model: `gpt-5.6-terra`, high
- Depends on: C2 and C3
- Risk: high; large shared UI and lifecycle action surface

Write scope:

```text
frontend/components/MatterWorkspace.tsx
frontend/components/ConfirmationDialog.tsx
frontend/components/CompanyInterview.tsx
frontend/components/BriefingWorkspace.tsx
frontend/app/settings/page.tsx
frontend/app/agents/page.tsx
frontend/lib/matterActions.ts
frontend/scripts/check-workspace-ux.ts
frontend/scripts/check-matter-brief.ts
frontend/scripts/check-middle-pane-accordion.ts
frontend/scripts/check-confirmation-dialogs.ts
backend/tests/test_matter_lifecycle.py
```

Required result:

1. Create one small reusable `ConfirmationDialog` rendered in the page DOM with `role="alertdialog"`, an accessible name and description, Cancel, and an explicit Confirm button. Reuse existing modal styles and semantic state colors. Do not add a dialog framework.
2. Replace all five current `window.confirm` calls: manual delivery, create/load vault, replace company profile, discard unsaved agent edits, and delete a saved Briefing view. No `window.confirm` may remain in production code under `frontend/app`, `frontend/components`, or `frontend/lib`.
3. Preserve each current confirmation message and action meaning. Cancel closes the dialog and performs no API call, navigation, deletion, replacement, or state change. Confirm alone performs the existing action.
4. For asynchronous actions, disable Confirm while busy. On API error, keep the dialog open, show the error, and allow retry. Prevent duplicate clicks.
5. Manual delivery must still say: `This records delivery outside Themis.ai. It does not send or contact anyone.` Confirm calls the existing `performMatterAction` path with `mark_as_sent`.
6. Vault create/load keeps the current-vault preservation statement. Company replacement passes the existing replacement confirmation value only after Confirm. Agent switching discards edits only after Confirm. Briefing deletion keeps past digests available as it does now.
7. Add `check-confirmation-dialogs.ts`. It must scan `frontend/app`, `frontend/components`, and `frontend/lib` for zero `window.confirm` calls and assert that all five actions use `ConfirmationDialog` with their existing safe action paths.
8. Route every path equal to the current recommendation path to `RecommendationPanel`, including artifact links, tree clicks, evidence links, chat links, and the initial `?file=` path. Never mount `DocumentPanel` for that path.
9. Remove the duplicate buried recommendation editor after the typed panel is available. Keep a compact read-only recommendation summary and direct `Open recommendation` action in the overview.
10. Replace singular `researchRun` state with the full queue from existing `getResearchQueue`. Poll while any item is queued or running. Render the shared queue panel in read-only overview mode.
11. After starting research, reload the full queue rather than storing only the first returned run.
12. Derive `approvedWithRequiredWorkOpen` from persisted approval and required open work. Show `Approved — required work remains`, count, and titles near approval and delivery.
13. Do not block approval or manual delivery. Keep the existing backend close gate. Closure still requires recorded delivery and every required work item to be complete.
14. Add one backend regression test that proves approval and delivery can occur with required work open, and closure cannot occur until delivery is recorded and required work is complete.
15. Put recommendation-path and full-queue cross-surface assertions in `check-workspace-ux.ts`. Keep component-local assertions in the C2 and C3 scripts.

Focused proof:

- No `window.confirm` remains in production code under `frontend/app`, `frontend/components`, or `frontend/lib`.
- Each of the five confirmation paths supports Cancel without mutation and Confirm through its existing action.
- Delivery open, cancel, confirm, failure, retry, and duplicate-click states are explicit.
- All recommendation entry paths use the typed panel.
- Overview and Research page use the same queue IDs and state words.
- Approval with zero, one, and multiple required open items has correct text.
- Closure remains blocked until delivery is recorded and required work is complete.

## 8. Coordinator acceptance after each chunk

For every worker:

1. Inspect its exact diff against the wave hash manifest.
2. Reject edits outside scope.
3. Run its focused checks yourself.
4. Check that no repository `vault/` path changed.
5. Record PASS or return one bounded correction to the same worker.
6. Do not accept a worker's completion claim without direct evidence.

## 9. Combined Terra extra-high review

After C1-C5 pass coordinator acceptance, start one fresh read-only `gpt-5.6-terra` reviewer at extra-high reasoning. It must not edit files or spawn agents.

The reviewer must return `PASS`, `FIX`, or `ESCALATE` for every group:

| Group | Review question |
|---|---|
| TR — Truth result | Can any assistant response or fallback path still claim a durable mutation that its typed result and Markdown do not support? |
| RI — Recommendation integrity | Can any normal UI or generic API path still mutate `recommendations.md` without typed version history? |
| RQ — Research queue | Do the overview and Research page show and poll the same complete queue until terminal state? |
| LC — Lifecycle and confirmation | Does any `window.confirm` remain, can any confirmation mutate on Cancel or duplicate on Confirm, and can delivery hide required open work? |
| PV — Provider visibility | Are Polaris failures classified with safe evidence, useful fallback, and no secret or lawyer-facing diagnostic leak? |
| XS — Cross-surface safety | Are Markdown authority, direct-click material actions, reload behavior, design language, and dirty-tree boundaries preserved? |

A `FIX` must include exact evidence, file, invariant, and smallest correction. Return it to the original implementer. The coordinator then reruns focused checks and asks the same Terra extra-high reviewer to recheck the changed groups.

### Sol-high escalation rule

Use `gpt-5.6-sol`, high, only when all conditions are true:

1. A material group still fails after one bounded correction cycle, or the Terra extra-high reviewer cannot identify a safe bounded correction.
2. The reviewer provides a source or test contradiction, the failed invariant, attempted correction evidence, and exact files involved.
3. The coordinator narrows and temporarily reassigns those exact files to one Sol-high escalated worker.

Sol high may diagnose and implement only the escalated issue. It may not broaden scope. After its focused checks pass, the Terra extra-high reviewer rechecks the group. The coordinator owns the final decision.

## 10. Engineering gate

Run after all combined review groups pass:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
for script in scripts/check-*.ts; do node --experimental-strip-types "$script"; done
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
git diff --check
```

Then prove that the repository `vault/` hash still matches the dirty working-tree bytes recorded in Wave 0. `HEAD` is not the reference because the repository vault was already modified before this repair.

## 11. Visible acceptance and recurrence

### 11.1 Verification vault

Run the demo script in Section 6 through the visible UI. Use the normal UI to create a new verification vault. The confirmation must be visible inside the page and controllable by the assigned browser actor. A browser-native popup is a product failure because it can block the experiment.

After every material click, inspect the visible result and then verify its Markdown record. Rebuild only the verification vault's SQLite index. Restart and verify the same state.

### 11.2 Three-matter focused recurrence

Before the full experiment, use three fresh fictional matters in the verification vault:

1. Approve each matter.
2. Open and cancel manual delivery once.
3. Open and confirm manual delivery once.
4. Reload after every matter.
5. Confirm three delivery records, no duplicates, no browser-native dialogs, and no stalled actor.

If this fails, stop the recurrence experiment and return to the owning chunk.

### 11.3 Ten-matter Harborline recurrence experiment

After the engineering gate, payoff demo, and focused recurrence pass, use `$live-agent-ux-experiment` with its full protocol.

- Create a new dedicated experiment vault. Do not reuse the verification vault or an earlier experiment vault.
- Preserve the ten September 1 request themes and before/after measures.
- Use Luna medium for the requester and one fresh visible-browser attorney per matter. Run live writes serially.
- Use one fresh Sol-high synthesis agent only after all ten actor runs finish.
- Actors must control their own visible browser. The coordinator must not operate it for them.
- Do not change code during actor runs.
- Do not contact any real person or external delivery service.
- Mark browser-control and environment errors separately from product defects.
- Treat any browser-native confirmation or actor stall at a confirmation as a product recurrence failure. Do not use a popup bypass for acceptance after this repair.
- Wait for each matter's full research queue to become terminal before freezing packet totals, or record the exact timed-out run IDs and states.
- Treat `packets with external authority` as a diagnostic measure, not a passing threshold. Zero retrieved authority does not fail the build when fallback output is useful and truthfully labeled and the safe provider trace is preserved.
- Create new timestamped raw evidence and a new dated report. Do not overwrite prior evidence.

Minimum before/after measures:

```text
matters created
intakes completed
research questions queued
research runs terminal at cutoff
packets saved
packets with external authority
typed recommendation versions
typed proposals accepted
durable decisions
finals
approvals
manual deliveries
closures
false mutation claims
native-dialog stalls
conditional approval states shown
browser-control errors
environment/provider failures
```

## 12. Completion criteria

The build is complete only when:

1. C1-C5 pass focused checks and scope checks.
2. All six combined review groups have a final Terra extra-high `PASS`.
3. Any Sol-high escalation is documented and rechecked.
4. Full backend tests, frontend checks, typecheck, build, Graphify update, and `git diff --check` pass.
5. The payoff demo passes in a fresh visible verification vault.
6. Three consecutive manual-delivery recurrence matters pass.
7. The fresh ten-matter experiment finishes or stops under a documented skill stop condition.
8. Repository `vault/` has the same full hash as Wave 0.
9. `rg -n "window\.confirm" frontend/app frontend/components frontend/lib` returns no matches.
10. No commit, push, deployment, destructive cleanup, or real external contact occurred.

## 13. Parked backlog

- A new external research provider or provider adapter.
- Changes to default Polaris timeout or retry values without measured trace evidence.
- A distributed or multi-worker research queue.
- A general semantic classifier for user intent or assistant truth.
- Automatic conversion of recommendations into decisions.
- Blocking approval or delivery when required work remains.
- Backfilling invented recommendation history for legacy text.
- A general workflow, approval, verification, or voting engine.
- Broad intake locator changes based only on browser-actor errors.
