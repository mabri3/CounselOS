# Themis.ai workflow reconciliation build progress

## Status

- Overall: Complete
- Current wave: Complete — engineering gate and live recurrence reported
- Blocker: None recorded

## Baseline

- Branch: `main`
- Commit: `9c73a94ff159758b0fbd7ecf17ed1b9523973e61`
- Active vault: `/Users/bharris/Programs/counsel-os-mvp/vault`
- Repository `vault/` full hash before work: `1146f14be1d8f6b768b48ad79c96d85277e0bdc41d8ab2066e60ee24ba2d2983`
- Repository `vault/` protected hash or manifest before work, excluding only the three allowed agent prompts: `4e7ead57bd49e00a37dbd144ef227593ffe15032fb7803b8c262a16b1baeec3e`
- Allowed prompt hashes before work:
  - `counsel-copilot.md`: `e30fc88e5fd555a7fa11e3ef02bffb16cd4018dd8fe59ceda6317ad27fc1449c`
  - `intake-agent.md`: `4ac578288a3c325ad8cd1f93192b4b47a43cd41229f32e5a551f86ba5efff023`
  - `research-agent.md`: `eae69c4196bde2627b68795cb79a6a16247b44afc9645423c3ea7367ce084f41`
- Initial `git status --short` snapshot:
  - `M docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`
  - `M docs/themis-ai-workflow-reconciliation-build.handoff-progress.md`
  - `M docs/themis-ai-workflow-reconciliation-build.handoff-prompt.md`
- Wave and worker changed-path snapshots:
  - C0 pre-dispatch: the three pre-existing handoff document changes plus coordinator-owned `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md` and `graphify-out/cache/last_query_stamp`; no application or repository-vault path differed.
  - C0 accepted paths: `backend/app/models/api.py`, `backend/app/routers/matters.py`, `backend/app/services/matter_state.py`, `backend/app/services/matters.py`, `backend/app/services/work_product.py`, `backend/app/tools/handlers.py`, `backend/app/tools/registry.py`, `backend/tests/test_matter_action_api.py`, `backend/tests/test_matter_action_tools.py`, `backend/tests/test_matter_lifecycle.py`, `backend/tests/test_matters.py`, `backend/tests/test_work_product.py`, `frontend/lib/api.ts`, `frontend/lib/matterActions.ts`, `frontend/lib/types.ts`. No unexpected worker path.
  - Shared Wave 1 pre-dispatch snapshot: exactly the accepted C0 paths above, the three pre-existing changed handoff documents (`plan`, `progress`, and `prompt`), and coordinator-owned `graphify-out/cache/last_query_stamp`. Repository-vault full and protected hashes still match Wave 0.
  - C1 accepted paths: `backend/app/agents/output.py`, `backend/app/agents/runner.py`, `backend/app/routers/chat.py`, `backend/app/services/chat_history.py`, `backend/app/services/chat_runs.py`, `backend/tests/test_agents.py`, `backend/tests/test_chat_history.py`, `backend/tests/test_chat_runs.py`, `frontend/components/ChatCards.tsx`, `frontend/components/ChatPanel.tsx`, `frontend/scripts/check-adaptive-intake.ts`, `frontend/scripts/check-chat-run-recovery.ts`, `frontend/scripts/check-transport-preservation.ts`, the two allowed repository prompts `counsel-copilot.md` and `intake-agent.md`, and their blank-template/fixture mirrors. No unexpected worker path.
  - C2 accepted paths: `backend/app/blank_vault_template/00_System/agents/research-agent.md`, `backend/app/config.py`, `backend/app/intelligence/polaris.py`, `backend/app/routers/settings.py`, `backend/app/runtime.py`, `backend/app/services/research.py`, `backend/app/services/research_runs.py`, `backend/app/services/search.py`, `backend/tests/fixtures/vault/00_System/agents/research-agent.md`, `backend/tests/test_intelligence_providers.py`, `backend/tests/test_research.py`, `backend/tests/test_settings.py`, `frontend/app/matters/[matterId]/research/page.tsx`, `frontend/lib/api.ts`, `frontend/lib/research.ts`, `frontend/lib/stubs.ts`, `frontend/lib/types.ts`, `frontend/lib/researchQueue.ts`, `frontend/scripts/check-research-queue.ts`, and the allowed repository prompt `vault/00_System/agents/research-agent.md`. No unexpected worker path.
  - C3 pre-dispatch snapshot: exactly all accepted C0, C1, and C2 paths above; the three pre-existing changed handoff documents (`plan`, `progress`, and `prompt`); and coordinator-owned `graphify-out/cache/last_query_stamp`. No other changed path.
  - C3 accepted paths: `backend/app/agents/context.py`, `backend/app/models/api.py`, `backend/app/routers/decisions.py`, `backend/app/routers/matters.py`, `backend/app/services/decisions.py`, `backend/app/services/matters.py`, `backend/app/services/recommendations.py`, `backend/app/services/work_product.py`, `backend/app/tools/handlers.py`, `backend/tests/test_decisions.py`, `backend/tests/test_recommendations.py`, `frontend/app/globals.css`, `frontend/components/MatterWorkspace.tsx`, `frontend/components/RecordDecisionModal.tsx`, `frontend/lib/api.ts`, `frontend/lib/recommendations.ts`, `frontend/lib/types.ts`, and `frontend/scripts/check-recommendation-integrity.ts`. No unexpected worker path.
  - C4 pre-dispatch snapshot: exactly all accepted C0–C3 paths above; the three pre-existing changed handoff documents (`plan`, `progress`, and `prompt`); and coordinator-owned `graphify-out/cache/last_query_stamp`. No other changed path.
  - C4 accepted paths: `frontend/components/NewMatterForm.tsx`, `frontend/components/StageBoard.tsx`, `frontend/components/MattersTable.tsx`, `frontend/app/matters/page.tsx`, `frontend/lib/design.ts`, transferred `frontend/lib/types.ts`, transferred `frontend/lib/api.ts`, `frontend/scripts/check-matter-creation.ts`, and `frontend/scripts/check-workspace-ux.ts`. No unexpected worker path.
- Backend baseline: `584 passed, 1 warning in 108.24s`
- Frontend baseline: existing workspace checks, typecheck, and production build passed. The planned scripts `check-research-queue.ts`, `check-recommendation-integrity.ts`, and `check-matter-creation.ts` do not exist yet, so the combined command stopped at the first missing script.
- Target-date diagnosis: PASS in isolated vault `/tmp/themis-target-date-wave0-safe.W1PmeS`. The value `2026-09-15` matched the HTTP 201 response, `matter.md`, `request.md`, SQLite index, and a new `AppContext` reload. Static inspection also confirms `NewMatterForm` sends the same field. The earlier three probe attempts and the restored isolation incident remain recorded under risks.
- Polaris diagnosis: Configured. One focused public request failed with `http_status` after 3 attempts and 22,814 ms. This excludes the observed timeout and network failure classes; provider-side or credential/configuration rejection remains.
- NeuralWatt Kimi K3 Fast catalog ID: `kimi-k3-fast`
- NeuralWatt Kimi K3 Fast preflight status: PASS — live NeuralWatt catalog ready; exactly one matching model found.

## Chunk tracking

| Chunk | Implementer | Status | Focused check | Ownership checked | Notes |
|---|---|---|---|---|---|
| C0 — result and lifecycle foundation | Sol Medium (`gpt-5.6-sol`, medium) | Accepted | Coordinator rerun: 92 passed, 1 warning; frontend typecheck passed | PASS | Common operation result, material confirmation boundary, final reconciliation, safe repair, creation retry key, and date reload coverage. |
| C1 — chat and intake | Sol Medium (`gpt-5.6-sol`, medium) | Accepted after two focused corrections | Coordinator final rerun: 105 passed, 1 warning; all 3 frontend scripts and typecheck passed; blank parity and prompt mirror checks passed | PASS | First correction removed the user-message regex. Wave 2 review then found that chat decision confirmation omitted disposition/reason and only changed local UI state. The second correction routes decision and lifecycle clicks through saved chat proposals, records typed results durably, requires disposition/reason, and shows only the latest result per durable source action after reload. |
| C2 — research and provider fallback | Sol Medium (`gpt-5.6-sol`, medium) | Accepted after focused correction | Coordinator rerun: 61 passed, 1 warning; research queue and provider-admin scripts passed | PASS | First focused run found one compatibility failure because an unconfigured Tavily warning overflowed a bounded source block; worker corrected it. Coordinator review then found diagnostics in ordinary memo content; focused correction moved them to metadata and a collapsed technical view. |
| C3 — recommendation, decision, and work queue | Sol Medium (`gpt-5.6-sol`, medium) | Accepted after focused correction | Coordinator rerun: 100 passed, 1 warning; recommendation integrity script and typecheck passed; diff check passed | PASS | Initial review found that a failed combined recommendation/draft save could leave partial state and that decision recording accepted an unrelated recommendation version. Focused correction now restores source records byte-for-byte, removes only operation-owned files, validates current or historical same-matter versions, and integrates the completed C1 durable confirmation seam. |
| C4 — board, date, and creation UX | Sol Medium (`gpt-5.6-sol`, medium) | Accepted after focused correction | Coordinator rerun: both planned scripts passed; typecheck and diff check passed | PASS | Initial review found that the post-submit success state was hidden by the collapsed form branch. The focused correction renders `Matter created. Intake is starting.` in the collapsed branch and tests its reachable state order. No backend target-date change was needed. |

## Combined Sol Medium review

| Group | Verdict | Evidence or correction |
|---|---|---|
| AR — typed action results | PASS | Final re-review confirmed typed results for participant, recommendation, research reorder, and research resume routes, including domain data and changed/proposed/no-change states. |
| LC — lifecycle reconciliation | PASS | Final reconciliation, safe stage preservation, and lifecycle regression coverage passed review. |
| IN — intake recovery | PASS | Deterministic second-malformed fallback, clickable continuation, and compact audit history passed review. |
| RQ — research queue | PASS | One durable item per question, serial execution, independent reorder, retry/restart idempotency, and legacy aggregate compatibility passed final re-review. |
| PF — provider fallback | PASS | App-wide settings, bounded fallback order, exact Kimi model, and useful output preservation passed review. |
| RC — recommendation and decisions | PASS | Version history, proposals, atomic combined save, same-matter version validation, disposition, and reason passed review. |
| WQ — participants and work queue | PASS | All open work, owner suggestions, priority, completion, and participant controls passed review. |
| OH — output hygiene | PASS | Chat cleanup, useful-output preservation, collapsed research diagnostics, and author-suffix cleanup passed review. |
| DL — delivery boundary | PASS | Both delivery operation names map to **Record manual delivery**; direct sending remains disabled and no external contact is implemented. |
| TD — target dates | PASS | Form transport, Markdown records, SQLite, and reload evidence passed review. |
| MC — matter creation | PASS | Immediate durable pending-intake truth and post-background Markdown reload passed final re-review. |
| BA — board audit | PASS | Exact consistency rules, material-field preservation, warnings, and explicit safe repair passed review. |

Interim combined-review findings:

- Confirmed contract-test regression: `test_recommendation_save_returns_a_non_finalizable_record` still asserted the pre-version exact result shape. The C0 owner is applying a test-only focused correction for the accepted C3 `current_version_id` and `proposal` fields.
- Confirmed RQ design gap: a three-question start created one run record, so pending questions two and three were not independent queue items and could not be reordered. The C2 owner is applying a focused per-question durable queue correction with retry and restart coverage.
- No Sol High escalation has been requested.

Correction evidence sent for final re-review:

- C0 strict recommendation-result test and durable-first matter-creation contract are corrected; the C0 gate remains 92 passed.
- C1 chat maps both delivery operation names to **Record manual delivery**; all three C1 scripts and typecheck pass.
- C2 creates one durable queue item per question and returns typed reorder/resume results with domain data; coordinator C2 gate is 66 passed.
- C3 participant and recommendation writes return `TypedOperationResult`; proposals use `proposed`, identical repeats use `no_change`, and version links remain explicit; coordinator C3 gate is 102 passed.
- All eight frontend focused scripts, typecheck, and `git diff --check` pass together after integration.

Final combined Sol Medium verdict: **PASS** for all 12 groups. Combined seam run: 200 passed. Required fixes: none. Sol High escalation: none.

## Sol High engineering escalations

- None.

## Full engineering gate

- Backend full suite: PASS — 629 passed, 1 existing Starlette/httpx deprecation warning, 122.94s.
- Frontend focused scripts: PASS — `check:workspace-ux`, research queue, recommendation integrity, and matter creation.
- Frontend typecheck: PASS.
- Frontend build: PASS — Next.js production build completed and all 13 static pages generated.
- Graphify update: PASS — 8,707 nodes, 15,534 edges, 1,155 communities; expected zero-node warning for eight non-code/config files and label-refresh advisory recorded.
- Verification vault: `/private/tmp/themis-workflow-verification-20260901-d`.
- Visible demo: PASS — matter `MAT-20260901-fa13a5` opened while intake was still visibly running; saved target date `2026-09-15`; completed intake; added Morgan Lee; started non-empty research; reordered a queued question; saved the canonical draft; created, proposed, accepted, and directly edited recommendation versions; recorded a durable decision with version, `modified` disposition, and reason; changed work priority and owner; finalized; approved; recorded manual delivery; confirmed direct send disabled; completed required work; and closed.
- SQLite rebuild and restart: PASS — deleted only `/private/tmp/themis-workflow-verification-20260901-d/.counsel_os_cache.db` (147,456 bytes), restarted the backend, and confirmed the rebuilt index restored the closed matter and its Markdown-backed state.
- Safe legacy repair: PASS — seeded `final_with_pre_respond_stage`, showed the board warning and direct repair control, repaired only the derived stage, and preserved approval, delivery, closure, decision, and work-item records. The disposable fixture was restored to its closed stage before the final index rebuild.
- Protected repository-vault allowlist result after implementation: PASS — only the three allowed repository agent prompts differ.
- Repository `vault/` full post-build hash: `75cd3752ae40c352b351f0846e9c96e0110846249aa17e650f1f93f269189e5e`.
- Repository `vault/` full hash after verification: `75cd3752ae40c352b351f0846e9c96e0110846249aa17e650f1f93f269189e5e`.
- Protected repository-vault hash after verification: `4e7ead57bd49e00a37dbd144ef227593ffe15032fb7803b8c262a16b1baeec3e`.

Visible verification attempt 1: FAILED and stopped at target-date truth. New isolated vault `/private/tmp/themis-workflow-verification-20260901` was created through Settings. The form visibly showed `2026-09-15`, but matter `MAT-20260901-94b99b` showed **No date** and its Markdown stored `target_date: null`. The original C4 implementer is applying a focused form-submit correction. This vault will remain preserved as failure evidence and will not be reused for the passing verification.

Visible verification attempt 2: target date passed in `/private/tmp/themis-workflow-verification-20260901-b`, but creation still waited for intake startup because FastAPI `BackgroundTasks` delayed request completion. C0 moved intake startup to a retained application task with wait/shutdown support. Attempt 3 in `/private/tmp/themis-workflow-verification-20260901-c` then showed the matter with `Sep 15, 2026` while intake was visibly still working, but stopped when the direct **Run research** button returned `At least one research question is required.` C3 is applying the non-empty visible research-action correction. All failed verification vaults remain preserved and are not reused for the passing gate.

## Wave 1 gate

- Blank-vault parity: 3 passed, 1 existing warning.
- Frontend typecheck: passed.
- Allowed prompt parity: all three repository/template/fixture triples match exactly.
- Protected repository-vault hash: `4e7ead57bd49e00a37dbd144ef227593ffe15032fb7803b8c262a16b1baeec3e` — unchanged from baseline.
- Repository-vault full hash after Wave 1 prompt changes: `75cd3752ae40c352b351f0846e9c96e0110846249aa17e650f1f93f269189e5e`.

## Harborline recurrence experiment

- Experiment vault: `/private/tmp/counsel-os-harborline-workflow-reconciliation-20260901-i`.
- Raw evidence folder: `tmp/harborline-workflow-reconciliation-20260901-135832/`.
- Final report: `docs/experiments/2026-09-01-harborline-workflow-reconciliation-rerun-report.md`.
- Matters created: 10/10, with no duplicates.
- Complete intake: 10/10.
- Matters with research packets: 8/10 at the normalized cutoff; 23 packet files. Two more background packets arrived seconds after the cutoff and are disclosed but excluded.
- Drafts/finals: 10/10 matters with drafts; 9/10 with finals.
- Decisions: 0 durable decisions. Chat falsely claimed four decisions; the typed results were `no_change`.
- Approvals/manual delivery/Closed: 9/10 approvals; 1/10 local delivery; 1/10 Closed.
- External authority retrieved: 0.
- Assisted runs: 0 coordinator browser interventions.
- Repository `vault/` full hash after experiment: `75cd3752ae40c352b351f0846e9c96e0110846249aa17e650f1f93f269189e5e`.
- Main recurrence result: creation, target date, intake, finalization, approval, and reload materially improved. Repeated native delivery confirmation hangs blocked eight approval-ready runs. Generic recommendation edits bypassed typed history, and four chat decision confirmations were unsupported.
- Final Graphify update: PASS — 8,881 nodes, 15,683 edges, 1,196 communities; the expected eight zero-node config warning and label-refresh advisory remain.

## Remaining risks

- Polaris returned an HTTP failure during Wave 0. External fallback and model-only fallback must preserve useful output and label authority status truthfully.
- Wave 0 isolation incident: probes 2 and 3 created exactly two uniquely named test matter folders in the prior Harborline experiment vault because the application lifespan honored `.counsel-os/active-vault.json`. Both folders were moved intact to recoverable quarantine `/tmp/themis-wave0-quarantine.n4qsFC`; the prior vault index was rebuilt from Markdown; it again contains 10 indexed matters and zero probe folders. Future isolated probes must construct `AppContext` directly with an explicit vault and must not use the global application lifespan.
