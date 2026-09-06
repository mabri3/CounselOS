# Decision map build plan

Date: September 5, 2026. Status: ready for contract preflight after model-name resolution. No application implementation performed by the planning task.

Read `docs/decision-map-redesign.blueprint.md` for the behavior and proposed data contract. Use `docs/decision-map-redesign.tracking.md` as the execution ledger. The one-shot prompt is `docs/decision-map-redesign.one-shot.md`.

## 1. Thesis

An issue map becomes useful when it explains the choice. A lawyer must be able to open an issue, see the applicable test and facts that change the answer, inspect realistic conditional paths, and record a chosen path with its basis. Ordinary issue analysis must populate these structures. A graph populated only by test fixtures does not prove the thesis.

## 2. Payoff moment

The lawyer clicks a condition, sees how the available paths differ, then records one path and reopens the exact choice after the analysis changes.

## 3. Demo script

Use a disposable vault with one fictional matter, two source documents, six issues, a shared fact, and an unlinked legacy decision. No testing mutations in the reference matter `MAT-20260904-abf788` or its active vault.

1. Open a legacy issue with no path structure. The issue text remains readable. The map offers **Analyze paths**. Loading did not start a run.
2. Start a normal issue-targeted inquiry through the UI. A deterministic provider test double may emit known prose and optional path structure, but it must pass through the actual run, parse and save code. No direct metadata enrichment may stand in for this step.
3. Reopen the issue. See its short title, explanation, one or more scoped rules, source labels, an unknown condition, and at least two conditional options. Match the reference visual language at 1280 × 900.
4. Click each option. The issue and sibling routes remain in place. Read business effect, condition, basis and remaining work. No fact, disposition or decision changes.
5. Open the legal source and its available passage. Return to the same path. Exercise a missing source once; useful analysis remains visible.
6. Open a hypothetical change using ScenarioPanel. Run its existing flow. Show **Hypothetical**, while actual facts and the current analysis remain unchanged. Cancel/return retains the issue context.
7. Open **Record this path**, edit the rationale and conditions, then cancel. No decision exists. Open again and submit. The register and Markdown show the human, date, exact analysis/option revision, conditions and chosen wording. Issue disposition remains open until its separate action.
8. Correct one actual fact using the existing fact action. Existing analysis says **Needs review**. Run updated analysis. The new map changes, while the earlier decision still shows the recorded version. Do not silently relink by option label.
9. Return to **All issues**. See the compact overview and actual counts. Reach shared/disconnected/missing/legacy records through the full outline. Return to the focused issue and conversation without losing local text.
10. Complete one configured-model run using only the synthetic matter and its local source content, with public search disabled. Observe whether meaningful paths were produced. Record the model and actual result. If credentials/runtime are unavailable, report the gap; do not claim deterministic fixtures prove model quality.

Also exercise the issue-targeted research path through normal service APIs. It must retain the issue ID through enqueue/start/save and publish to the same analysis pointer. Keep the browser story focused on one issue; targeted backend tests can cover the transport variants.

## 4. Build

### Routing and execution rules

One shared working tree. Maximum three active workers plus coordinator, limited by runtime capacity. No nested agents. No worktrees, commits, push, pull request or deployment. Preserve every pre-existing change. The coordinator owns scope, contracts, integration, tracking, combined review and final verification.

Requested model interpretation:

| Pool | Model | Effort | Role and cap |
| --- | --- | --- | --- |
| Terra | `gpt-5.6-terra` | high | Visual implementation; up to 2 independent chunks |
| Sol | `gpt-5.6-sol` | high | Generation, persistence, revision integrity; up to 2 independent chunks |
| Sol Medium | `gpt-5.6-sol` | medium | Bounded form/entry integration; cap 1; a fresh separate instance reviews combined work |
| Xai | Unresolved | Unresolved | User wording does not match a callable model. Resolve before assigning or dispatching this pool |
| Luna High | `gpt-5.6-luna` | high | Read-only design research, already completed; no extra research needed by default |

The unresolved name might mean Terra **xhigh**, Astra, or an xAI provider. Those are different requests. Do not silently select one. The plan can be inspected and C0 baseline work can proceed while resolution is pending. Hold only the affected dispatch. Once resolved, record the exact model/provider/effort and assign it to C3 if it is a suitable implementation pool, or to coordinator/design review if that is the user's intent. The known Terra and Sol assignments remain valid unless the user changes them.

Do not infer a price, speed or quality ranking from the names. The split follows file ownership and risk. Use fewer workers when tasks are coupled. Run the fresh Sol Medium review once on the integrated result, not as a ceremony after every leaf.

### C0 — Baseline and frozen contract (coordinator, serial)

Outcome: ready workers have exact contracts and disjoint write scopes.

- Read AGENTS, frontend/AGENTS, full PRD/handoff, current design language including its final amendment, current map plan and verification, then this blueprint. Run the required graphify query.
- Capture current status, HEAD, hashes and copies of intended files. A comparison against HEAD alone is invalid because the tree is already dirty. Re-check for concurrent work before editing.
- Inspect actual Pydantic models, writer/read paths and all callers. Finalize defaults, model-local ID normalization, claim revision lookup, conditional semantics, stale publication and decision-basis validation in `docs/decision-map-redesign.contract.md`.
- Own the additive backend models in `backend/app/models/workspace.py`, `backend/app/models/api.py`; frontend contract files `frontend/lib/decisionMapTypes.ts`, `frontend/lib/workspaceTypes.ts`, `frontend/lib/types.ts`; API client files `frontend/lib/workspaceApi.ts`, `frontend/lib/api.ts`; and any `backend/app/runtime.py` constructor wiring. Read local Next.js guides before changing route code later.
- Keep old clients valid. Export empty/default optional fields. Add types and optional prop signatures without requiring unimplemented runtime behavior. Own package scripts/lockfiles if a demonstrated need arises; no new graph library by default.
- Freeze the blueprint's issue-local `input_basis`, enqueue-time input capture, exact current-pointer precedence, and non-circular analysis/option digests. Do not use broad shared-file revision equality for this pointer. Confirm the publication basis cannot immediately become stale due to its own claims/pointer/research writes. Confirm two concurrent valid issue outputs both become current. Confirm immutable/history semantics of the selected inquiry/packet file.
- Define stable component props for C3/C4: focused issue ID, selected node ID, current analysis, optional selected path, callbacks for analysis, discussion, evidence, scenarios, and decision prefill. C4 supplies inert optional controls until integration.

Check: additive typecheck and focused model validation. Provide `contract.md`, baseline, exact ownership ledger and fixture schema to workers. No dependent writer starts before the contract is accepted.

### C1 — Analysis generation and publication (Sol High)

Depends on C0. Risk: high. Coordinator review at boundary.

**Write ownership:**

- `backend/app/services/answer_contract.py`
- `backend/app/agents/context.py`
- `backend/app/services/workspace_actions.py`
- `backend/app/services/research.py`
- `backend/app/services/research_runs.py`
- `backend/app/routers/matters.py`
- new `backend/app/services/issue_analysis.py`
- new `backend/tests/test_issue_analysis.py`
- `backend/tests/test_workspace_actions.py`
- `backend/tests/test_research.py`

Read: frozen models; existing source/evidence parser; workspace serialization and source revisions; research tests; runtime. Do not edit C0 files.

Implement the optional output supplement and normal text transport. The existing `extract_claim_support()` helper is in `workspace_actions.py`; extend or compose it there with the new owned analysis helper. Persist useful prose first. Save analysis beside its source output. Update one current pointer per issue only for current captured input. Expose issue-targeted research through the existing run path. Preserve older analysis on absent or malformed structure. Save stale late results as historical. Resolve claims by the saved output revision, not only the latest global claim array.

Do not rewrite Answer.md, add a new provider, or route all ordinary answers through a mandatory JSON schema. Use real current IDs. No label-based guessing between issues.

Focused checks: ordinary inquiry/research publication, plain-text fenced transport, claims plus path blocks, malformed block independence, no-structure preservation, stale late output, duplicate/foreign IDs, concurrent A/B publication, shared-fact invalidation, enqueue-time target/input preservation, self-staleness after claim and research writes, all/any and mixed-logic handling, useful prose on write/parse failure. Provider-double output must enter through production code, not direct pointer seeding.

Provides: saved analysis contract and current-pointer resolver used by C2 and route.

### C2 — Derived graph and exact decision basis (Sol High)

Depends on C0 and C1. Risk: high. Coordinator review at boundary.

**Write ownership:** `backend/app/services/workspace_review.py`, `backend/app/services/decisions.py`, `backend/app/services/workspace.py`, `backend/tests/test_workspace_review.py`, `backend/tests/test_decisions.py`.

Read: accepted C1 resolver, frozen API models, decision router and index behavior, legacy scenarios. Do not edit C1 or C0 files. If index projection drops new metadata, notify coordinator; it owns any narrow index change.

Project issue/test/condition/options into the map and shared workspace issue analysis. The exact pointed output is the only current structured analysis for its issue. Preserve legacy options as fallback/history, plus custom edges, scenario branches, missing references and disconnected records in labelled groups; never mix legacy branches into the current pointed set. Expose source support and scope without inventing validation. Keep invalid optional records from taking down the snapshot.

Add optional exact map basis to the existing explicit decision flow. Validate matter membership and server-derived option revision. Freeze canonical requirements, consequence, recommendation and analysis basis alongside separate lawyer wording/conditions. Store and compare a normalized request fingerprint for new decisions. Preserve existing retry/refresh semantics, check payload/key conflicts, and show old recorded paths after regeneration. Do not alter disposition or closure behavior.

Focused checks: projection from C1-written analysis, all/any and unknown conditions, multiple/shared tests, invalid missing targets, old metadata readers, decision roundtrip including rebuilt index/API response, cancellation/no write via existing frontend flow, exact-option validation, idempotent retry and different-payload conflict, stale submit and explicit historical basis, regenerated analysis with preserved decision text/identity.

Provides: real graph snapshot and decision roundtrip for C5.

### C3 — Focused graph, layout and outline (Terra High; candidate for resolved Xai pool)

Depends on C0. Can run alongside C1 and C4. Risk: normal. Coordinator review at boundary.

Dispatch is held until the ambiguous pool name is resolved. Before launch, replace this provisional heading and the wave table with exactly one implementer assignment. If Xai was intended as another implementation pool, record whether it replaces this assignment or receives a new dependency-safe subdivision. Do not run two writers in C3's files. If it means Terra xhigh, use that exact effort. Do not count a requested but unused/unavailable pool as completed work.

**Write ownership:** `frontend/components/workspace/DecisionMap.tsx`, `frontend/components/workspace/MatterMap.module.css`, `frontend/lib/decisionMapLayout.ts`, `frontend/scripts/check-decision-map.ts`, new `frontend/components/workspace/DecisionPathGraph.tsx`, new `frontend/components/workspace/DecisionMapInspector.tsx`, new `frontend/components/workspace/DecisionMapOutline.tsx`, new `frontend/scripts/check-decision-path-layout.ts`.

Read: all map reference images, frozen contract, map route, existing semantic tokens, baseline map checks. Keep route and shared types frozen.

Implement This issue / All issues with a stable issue anchor and separate selected record. Use the three-column focused graph, curved measured connectors, clear conditional labels, complete detail and grouped outline. Retain a cycle-safe optional general graph. Keep visual and outline data identical. Support multiple tests and shared records. Keep the first fork readable. Do not recolor all nodes by type or use green for recommended/selected options. Retain one canonical selected identity and complete titles.

Focused checks: descendant selection retains issue/ancestors/siblings; no ID-based ranking in semantic local lanes; outline identity/edge parity; long text, missing and shared references; legacy cycles do not crash; fit scale floor; no click mutation; keyboard selection and visible focus. Style/source-string tests do not substitute for later browser review.

Provides: complete leaf UI against the frozen props. No model calls or backend writes in leaf components.

### C4 — Issue entry and decision form (Sol Medium)

Depends on C0. Can run alongside C1 and C3. Risk: normal. Coordinator review at boundary.

**Write ownership:** `frontend/components/workspace/IssueReviewDetail.tsx`, `frontend/components/workspace/MatterIssue.module.css`, `frontend/components/RecordDecisionModal.tsx`, `frontend/scripts/check-issue-review.ts`, new `frontend/scripts/check-decision-path-recording.ts`.

Read: issue callers, existing MatterIssue CSS module, frozen types, current modal retry code, shared reference/evidence components. If the stylesheet has other callers, preserve their behavior.

Show the same saved explanation/tests/conditions/options inside issue review. Add clear map entry with stable issue context and **Analyze paths** when missing. Extend modal with optional frozen map prefill, conditions and basis; keep old callers working. Preserve text on conflicts and existing record/refresh behavior. The final record action stays explicit. Hypothetical or stale basis remains labelled.

Focused checks: no preview/cancel write, exact option prefill and changed wording, stable submit payload, retry after saved-but-refresh-failed, legacy modal callers, unsaved text after conflict, separate disposition. No schema ownership here.

### C5 — Route and application integration (coordinator, serial)

Depends on C1–C4. Risk: high due to shared orchestration.

**Write ownership:** `frontend/app/matters/[matterId]/decision-map/page.tsx`, `frontend/components/MatterWorkspace.tsx`, `frontend/components/workspace/ScenarioPanel.tsx` only if the frozen optional target fields require it, `frontend/lib/continuityApi.ts` only if current helpers need a narrow extension, `frontend/scripts/check-matter-review-integration.ts`, `frontend/scripts/check-document-reference-behavior.ts`; C0-owned contract/API/runtime files for integration corrections. Coordinator owns any script registration and docs.

Wire real snapshots, analyze/update actions, issue-targeted research, exact discussion target, sources, scenarios, record modal and refresh. Reuse existing inquiry actions and shared conversation; do not add another chat component. Preserve draft state and contextual return routes.

Split core map loading from optional data so a scenario/reuse/source failure does not leave a blank screen. Guard late asynchronous results across issue/matter switches. Scope session state with vault/actor/matter and clear stored selections correctly. Freeze path revision for actions. Show stale historical basis on conflict and retain form values.

Inspect all live callbacks before changes. Keep unrelated editor, global navigation, business handoff and lifecycle surfaces unchanged. New endpoint/service needs must be justified by a failed demo step, not convenient abstraction.

Focused checks: connected map entry, real analysis refresh, exact target preservation, stale-selection handling, source return, hypothetical boundary, optional data failure, one conversation instance and retained unsent text.

### C6 — Combined review, correction and evidence (fresh Sol Medium + coordinator)

Depends on C5. No implementation writer runs while review reads the final shared diff.

Reviewer is read-only and a fresh instance, not the C4 implementer. Review the C0 incremental diff, blueprint, actual screenshots and test evidence. Check visual fidelity, normal generation/save path, preview/record separation, source and revision integrity, graceful failure, and accidental scope expansion. Report material findings with exact files and expected behavior. Route fixes to the original owner. Re-review only material changes.

Coordinator verifies each claim, runs final checks, updates tracking and current project checkpoint, and leaves the app runnable. No requirement that all cosmetic preferences receive a new model approval.

### Waves and shared side effects

| Wave | Active work | Reason |
| --- | --- | --- |
| 0 | C0 coordinator | Contracts and ownership must be fixed first |
| 1 | C1 Sol High + C3 Terra/resolved pool + C4 Sol Medium | Disjoint backend, graph leaf and form/issue files |
| 2 | C2 Sol High; accepted leaf corrections may proceed in their own files | C2 needs C1's accepted resolver |
| 3 | C5 coordinator | Shared route and API integration is serial |
| 4 | C6 fresh Sol Medium; coordinator prepares evidence | Read-only review after writers stop |
| 5 | Scoped corrections, final checks and ledger | Run only checks justified by corrections |

Workers return outcome, changed files, tests actually run, unresolved questions and risks. They do not start services, run the full backend suite, run builds, edit trackers or update graphify. Coordinator owns those side effects. Escalation requires observed failures or material uncertainty; no silent model/provider substitution.

### Verification ledger

The coordinator records one result per gate with command, timestamp, outcome and evidence path. Do not mark pending browser rows passed from code inspection.

| Gate | Required observation |
| --- | --- |
| V1 Real publication | A production inquiry and issue research run save branches; no enrichment shortcut |
| V2 Useful failure | Malformed paths, missing evidence and optional API failures retain prose and prior map |
| V3 Stable semantics | Unknown/conflicting/hypothetical/recorded states remain distinct; sibling routes remain visible |
| V4 Explicit decision | Preview and cancel have no record effect; submit creates exact frozen basis; retry creates no duplicate |
| V5 Refresh integrity | Changed fact marks prior analysis; late run cannot overwrite; old recorded path survives regeneration |
| V6 Visual fidelity | Side-by-side 06-map/02-issue comparison plus new focused view at 1280 × 900 and 1440 × 1000 |
| V7 Readability | First fork without pan, no clipped essential labels, no overlapping connectors, long titles accessible |
| V8 Navigation | Issue/path/source/scenario/return retain context; outline can perform equivalent selection |
| V9 Product smoke | Required repository acceptance walkthrough; map-related behavior in depth, unrelated routes proportionately |
| V10 Configured model | One synthetic real-model analysis produces useful connected paths, or exact blocker reported |

Run focused checks with their owners. Run required repository commands once after integration:

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

Also run `npm run check:matter-review-decision-map` and the new registered focused scripts. Walk `docs/ACCEPTANCE_TESTS.md` in the browser. Record pre-existing failures separately; never relax a test to conceal regression. Do not keep rerunning unrelated broad suites once evidence is adequate. Run `graphify update .` once after application changes. Record size or tool limitations honestly.

Visual acceptance is specific: white/cool surfaces; actual shared fonts; real state words; readable three-column local map; curved labelled connectors; selected detail below the map; outline and collapsed discussion below; no forced 10% fit; all visible controls connected to real behavior. Do not claim pixel equality to a synthetic screenshot with different content.

### Preservation and cleanup

Use an isolated vault for all mutations. Record original selected vault and service PIDs. Leave existing services alone. Start only clearly owned local acceptance services on free ports, with mock/search/scheduler settings confined to the isolated environment. Do not print credentials. Stop only owned processes; close temporary tabs and reset only viewport overrides made for testing. Hash authoritative vault files before/after when any shared live runtime is used; ignore only disposable cache files. The production reference content must not be edited to fit the design.

## 5. Parked backlog

| Item not scheduled | Evidence required to reconsider |
| --- | --- |
| Full legal rule execution or DMN engine | Repeated user need for deterministic, validated rule evaluation beyond readable conditional analysis |
| Automatic whole-vault branch generation | Manual Analyze paths is repeatedly too slow for observed use |
| Graph library, minimap, automatic graph editing | Existing focused DOM/SVG layout fails concrete readability or interaction tests |
| Drag-to-author arbitrary nodes and edges | Lawyers cannot correct the useful analysis through existing issue edits/chat |
| Automatic matching of option identity across analyses | Repeated need to compare many generations that exact revision links cannot serve |
| Multi-issue scenario solver | Real matters require simultaneous interacting assumptions beyond existing scenarios |
| Automatic work creation on branch click | Users repeatedly ask to turn reviewed requirements into tasks; still retain explicit action |
| Collaboration, permissions, approval hierarchy | Validated multi-user product demand |
| Dedicated mobile map editor | Observed phone use justifies the cost |
| New source verification agent or legal perfection gate | Not a remedy for this feature; maintain useful first-pass output and honest support labels |
