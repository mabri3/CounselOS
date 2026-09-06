# Decision map redesign tracking

Date: 2026-09-05. Status: C0–C6 complete. Final code, review corrections, browser evidence, required checks and cleanup verified. Native browser 200% zoom remains a documented tool limit.

## Scope

Implement the complete decision map redesign from the supplied one-shot prompt. The planning ledger below is historical; the implementation ledger records the later authorized build, integration and verification.

## Planning evidence

| ID | Work | Owner | State | Evidence |
| --- | --- | --- | --- | --- |
| P0 | Read project constraints and current map | Coordinator | Done | PRD, handoff, design language, graphify query, source inspection |
| P1 | Locate reference images | Coordinator | Done | Task “Implement Matter A UI rebuild”; `output/matter-ui-design-survey/designs/06-map.png`, `02-issue.png` |
| P2 | Inspect live map without record changes | Coordinator | Done | 34-record map. Selecting owner-information issue shows only business question and issue; details have title, state, and actions |
| P3 | Research interaction references | Luna High | Done | GOV.UK branching/form guidance, OMG DMN, focus/context references |
| P4 | Audit records and generation path | Sol High | Done | `map_contract_audit`; normal option writer absent, scenario-only generation, unlinked decisions, moving focus found |
| P5 | Audit visual fidelity | Terra High | Done | `map_visual_audit`; fixed clipped cards/straight lines/flat outline findings incorporated |
| P6 | Create blueprint, proposed contract, plan and prompt | Coordinator | Done | Deliverables below; final frozen code contract belongs to implementation C0 |
| P7 | Inspect blueprint interactions and review plan | Coordinator + fresh Sol Medium | Done | Preview actions verified; six plan findings addressed; reviewer recheck found no remaining substantive defect; no implementation checks claimed |

## Deliverables

- `docs/decision-map-redesign.blueprint.md`: product interaction, source/design findings, exact visual direction, proposed data/persistence contract, evidence and limits.
- `docs/decision-map-redesign.build-plan.md`: thesis, demo, C0–C6 file ownership, waves, routing, checks and deferred work.
- `docs/decision-map-redesign.one-shot.md`: complete copyable implementation prompt.
- `output/decision-map-redesign/decision-map-blueprint.html`: repository copy of the interactive preview fragment.
- Inline source: `/Users/bharris/.codex/visualizations/2026/09/06/01a07422-fe4b-7f13-80a1-7f6b74558425/decision-map-blueprint.html`.
- `output/decision-map-redesign/planning-verification.md`: planning/prototype evidence and limits.

## Routing

Actual planning agents: `gpt-5.6-luna` high, `gpt-5.6-sol` high, `gpt-5.6-terra` high. Maximum three workers plus coordinator. No nested agents.

Resolved: the user said “Xai meant extra-high ignore it.” C3 used `gpt-5.6-terra` high. No xAI or extra-high pool was used. Sol Medium maps to `gpt-5.6-sol` medium.

## Build status

| Chunk | Outcome | Depends on | Planned owner | State | Evidence |
| --- | --- | --- | --- | --- | --- |
| C0 | Baseline and frozen executable contract | — | Coordinator | Accepted | 661-file baseline; frozen contract; additive model checks and frontend typecheck passed |
| C1 | Normal analysis/research creates saved branches | C0 | Sol High | Accepted | Coordinator 74 tests + provider-boundary HTTP regression + configured-model publication |
| C2 | Map projection and exact decision basis | C0, C1 | Sol High | Accepted and integrated | Exact decision/browser proof, source-collision and all/any route regressions; final 43 focused tests passed |
| C3 | Focused graph, layout and outline | C0 | Terra High | Accepted | Final regenerated screenshot, disjoint connector labels, current-first order and inactive route checks passed |
| C4 | Issue entry and decision form | C0 | Sol Medium | Accepted and integrated | Focused checks, final-save browser proof and issue review screenshot |
| C5 | Route and application integration | C1–C4 | Coordinator | Accepted | Production publication, source/scenario/decision round trips and responsive browser proof |
| C6 | Independent review, corrections, final evidence | C5 | Fresh Sol Medium + coordinator | Accepted | Three findings fixed and rechecked; 1,222 final backend tests, final build/typecheck/browser/graph checks and preservation audit passed |

For each future chunk, record actual model/effort, start/end, changed paths, checks actually run, reviewer findings and disposition, evidence links, remaining risk and next action. Keep the plan's V1–V10 gates separate from chunk completion. A completed component is not a passed browser demo.

## Planning review corrections

The fresh Sol Medium reviewer identified six material plan gaps. The coordinator added: issue-local input hashes with self-write exclusions; exact current-pointer precedence over legacy fallback; defined option digests and canonical map basis/request fingerprint; enqueue-time target/input capture; split mixed all/any logic; and an explicit C3 dispatch hold until model resolution. The final correction check found all six resolved and no remaining substantive defect.

## Preservation

This is a dirty shared tree. `output/decision-map-redesign/planning-baseline.json` records the starting HEAD, status, and application hashes. Existing changes belong to earlier work. No commit, push, deployment, active-vault change, or legal record mutation is part of planning.

Final check: 243 application source hashes unchanged. Git status adds only the four planning documents and `output/decision-map-redesign/`. The inline preview and repository copy match. Preview JavaScript syntax check passed. The owned preview server on 8766 exited 0; both temporary inspection tabs were closed; the viewport override was reset. Existing app services were not stopped. See `output/decision-map-redesign/planning-final-check.json`.


## Implementation ledger

### C0 accepted

Actual owner: coordinator (inherited runtime model/effort). Baseline captured before application writes in `output/decision-map-redesign/implementation-baseline/manifest.json`, with 661 file copies. This baseline includes dirty and untracked source files. All four supplied PNGs opened. Required graphify query completed; its 337-node result was limited to 50 nodes. Full PRD, handoff, design amendment, blueprint and build plan read.

Changed: backend/app/models/workspace.py, backend/app/models/api.py, frontend/lib/decisionMapTypes.ts, frontend/lib/workspaceTypes.ts, frontend/lib/types.ts, frontend/lib/api.ts, and docs/decision-map-redesign.contract.md. Two minimal compatibility label entries were added in frontend/components/workspace/DecisionMap.tsx and frontend/lib/decisionMapLayout.ts before C3 ownership starts. Backend additive model imports/defaults passed. Initial typecheck found missing exhaustive labels; corrected and typecheck passed. No runtime behavior, vault mutation, model run or browser gate is claimed.

C1 boundary addition: coordinator owns narrow backend/app/routers/chat.py wiring to pass run frozen_context to publication. C1 owns the new optional service argument. This avoids changing the worker's file scope.

Routing: Codex Sol High (`gpt-5.6-sol`, high), cap 1 active persistence worker; Codex Sol Medium (`gpt-5.6-sol`, medium), cap 1 form worker, later a fresh read-only reviewer. C3 is held for unresolved Xai; no substitution. Maximum 3 workers plus coordinator. C1/C4 exact ownership follows build plan. Workers cannot spawn, edit shared types/ledger, start services or run broad suites/builds. Coordinator checks each chunk; one fresh combined review at C6.

V1–V10 remain pending. Next: dispatch C1/C4 and integrate frozen context wiring while they work.

Implementation checkpoint: synthetic input seed now uses the existing issue marker format. First setup attempt rejected its issue link before any analysis was run; corrected in the isolated vault. Input setup contains no generated options or analysis. Protected-vault hash and selection-pointer check passed. Prepared configured-model smoke uses existing openai_compatible / deepseek-v4-flash with public search disabled; not run yet. Early coordinator review sent concrete capture/revision and uncertain-submit findings to the active owners.


Coordinator integration support (before C5): runtime now exposes the shared IssueAnalysisService. The decision router maps WorkspaceConflict to HTTP 409. The existing frontend API Error retains HTTP status/detail so C4 can distinguish definite no-write conflicts from an uncertain network failure. These are additive contract/error-transport changes. UnderstandPanel.tsx will need a narrow C5 pass-through because it is the actual caller of IssueReviewDetail; this coupling was found by reading live callers and added to coordinator ownership in the frozen contract.

C4 coordinator checks: both dynamic component checks passed after initial corrections. Remaining identity corrections returned to C4: missing current output must not become legacy fallback, and legal-test support must require exact output revision. C4 remains unaccepted until these corrections are checked. C1 helper and research wiring are present; focused tests are in progress. The current incremental changed-file inventory contains only planned worker files and documented coordinator seams.


### C4 accepted — component boundary

Actual owner: Codex `gpt-5.6-sol`, medium, task c4_issue_form. Changed exactly the five C4-owned files: IssueReviewDetail.tsx, MatterIssue.module.css, RecordDecisionModal.tsx, check-issue-review.ts, check-decision-path-recording.ts (paths per build plan).

Coordinator checked the incremental implementation and reran both scripts after all corrections. Both passed. Frontend typecheck passed. Node emitted its existing MODULE_TYPELESS_PACKAGE_JSON warning; no dependency/manifest change was made to hide it. Verified in component execution: optional path prefill, exact IDs, edited wording, explicit stale basis, no preview/cancel write, frozen uncertain request/key, refresh-only retry, HTTP validation correction, missing-pointer history, and exact claim/output support lookup. Corrected early duplicate-save, claim revision, legacy fallback, missing actor/scope/exception, and selection-color findings. Browser/layout and live API integration remain pending; this acceptance does not pass V4/V6/V8 by itself.

Next: C1 acceptance, then C2; C3 still awaits the exact Xai model/effort. C5 and fresh C6 review have not started.


C1 coordinator review: focused suite passed 73 tests (29.74s). Review then found selected-source edits during a run could replace the pointer before being marked stale; correction and a regression test requested. Configured-provider inquiry completed using openai_compatible / deepseek-v4-flash, default effort, with public search disabled. It retained useful prose but did not publish an analysis: the model chose scenario scope and emitted field names absent from the underspecified optional-structure prompt. C1 is adding a concrete schema example; the synthetic smoke will explicitly request an actual issue inquiry. This is a failed publication gate, not a successful map-generation result. Evidence: acceptance/configured-model-result.json and configured-model-analysis.json under output/decision-map-redesign. No C1 acceptance yet.


Coordinator production-boundary correction: real configured output exposed reply cleanup replacing canonical fact IDs inside decision-paths JSON with “the internal record”. Added a narrow transport preservation change in backend/app/agents/output.py, with new backend/tests/test_decision_map_generation_integration.py. The real HTTP/runner/provider-boundary test failed before the fix and passed after it (1 test, 3.08s); it verifies current saved paths, Unknown, useful malformed follow-up, prior pointer preservation, and no decision/disposition mutation. Existing citation tests (9) and selected output hygiene/reconciliation tests (13) passed. No production service is mocked in the new test. The second real-model attempt preserved prose but used a recommendation-writing tool, so normal inquiry publication did not run. A third attempt uses a clear answer-only inquiry instruction. First and second result files are retained separately.


Configured-model publication now passes: third normal inquiry RUN-20260906-0106ca completed with openai_compatible / deepseek-v4-flash / default effort. The resolver reports saved, with one contract test, one Unknown condition, three options, and no warnings. Exact saved output: 03_Matters/harbor-sandbox-release-timing-1b2102/conversations/inquiries/RUN-20260906-0106ca.md in the isolated vault. Evidence: output/decision-map-redesign/acceptance/configured-model-result.json and configured-model-analysis.json. This proves production publication, not legal correctness or frontend map rendering.


### C1 accepted — publication boundary

Actual owner: Codex gpt-5.6-sol, high, c1_generation. Exactly ten owned files changed (build plan). Coordinator inspected publication, capture, source freshness, replay and research seams; reran the focused C1 suite after corrections: 74 passed in 29.88s, one existing deprecation warning. Worker reports 76 agent/context checks; coordinator independently ran the 13 relevant output hygiene checks and 9 citation checks after its transport correction. The real HTTP/provider-boundary regression and configured-provider inquiry evidence are recorded above. C1 acceptance does not claim browser or legal correctness. C2 dispatched with exact five-file ownership using Codex gpt-5.6-sol high. C3 remains held; no graph model substitution.

Wave scope audit: a new docs/uiphase2-a-style-ui.handoff-plan.md appeared outside this task's ownership. Inspected it: it concerns another UI planning scope and explicitly excludes the Matter interior and map. Its origin is not attributed to this task. Preserved it without changes. All other current incremental application changes match owned chunk/coordinator paths.


Transport display support: frontend/components/workspace/ClaimMarkdown.tsx now hides well-shaped decision-paths metadata after useful prose, matching existing claim-support display behavior. Malformed or structure-only output remains visible. Added assertions in coordinator-owned check-matter-review-integration.ts; script passed. The provider-boundary backend test also now pins a named claim to the exact output revision (passed, 2.93s). Route wiring still awaits C2/C3 and is not claimed complete.


Coordinator provider-boundary verification expanded to ordinary research through the real agent runner and packet publication. Both integration tests pass (2 tests, 3.32s). Frontend typecheck passed after the transport display change. The configured model result remains separate from these deterministic tests.


C2 in-progress review findings sent to owner before acceptance: valid test-to-condition edges must not retain temporary missing states; hypothetical scenario states must not depend on current-analysis pointer presence; map response must include issue_analyses; source support must prefer exact validated output over stale direct metadata; malformed legacy links must not blank the snapshot; canonical option digest must be recomputed; replay must use stored decision basis when the original output is missing; basis check/write must share existing publication serialization. None is marked resolved yet.


### C2 accepted — projection and decision boundary

Actual owner: Codex gpt-5.6-sol, high, c2_projection_decisions. Changed exactly the five owned files. Coordinator reviewed incremental changes against captured baseline and checked all reported corrections. Owned suite passed 41 tests (13.57s). After the final scenario-group correction, the three relevant projection cases passed again (1.16s). Publication and provider-boundary integration regressions passed against C2 (76 tests, 33.54s). Together these are 117 distinct focused backend tests, not the full suite. One existing Starlette/httpx warning remains. Scoped diff whitespace check passed.

Verified server behavior: current versus historical/legacy/hypothetical projections, exact saved claim/output support, malformed pointer isolation, explicit all/any and Unknown, canonical option digest validation, separate lawyer wording, stored canonical decision basis, different-payload action-key conflict, same-request replay after regeneration or lost output, and rebuilt index/API retrieval. No index schema change was needed. Existing retry test now requires a conflict for a changed payload, as the new request specifies; same-request retry still returns one decision. Scenario edges now show hypothetical instead of treating a hypothetical condition as an actual unknown. No blanket legal correctness claim.

The configured-model output projects to a real map snapshot with one legal test, one Unknown condition, three options, and no missing references. Evidence: output/decision-map-redesign/acceptance/configured-model-map.json. This is API/service evidence, not a browser screenshot.

### Checkpoint awaiting model input

C3 remains unassigned. The user has not resolved “Xai”; the prompt expressly requires that resolution before graph dispatch. C5 serial routes and fresh C6 Sol Medium review therefore remain pending. No full backend suite, frontend production build, final map aggregate, browser acceptance, screenshots, final verification document, or graphify update is claimed. Graphify update remains reserved for after all application changes, as requested. Frontend typecheck and the three relevant component/display scripts have passed at their boundaries.

All mutation checks used isolated synthetic/test vaults. Protected authoritative hashes and the active-vault selection pointer remain unchanged. No service was started or stopped, and no commit/push/deployment/PR was made. The synthetic vault is retained without a running service for the remaining browser work. Additional out-of-scope Phase 2 planning files appeared (handoff-progress, handoff-prompt, reference-map); inspected their headings and preserved them without attributing them to this task.

Next action: obtain the exact model and effort intended by Xai, resolve the C3 assignment in this ledger/build plan, dispatch the graph worker, then complete C5/C6 and the required final checks.


### Routing resolved; implementation resumed

User clarified: “Xai meant extra-high ignore it.” Use the original C3 Terra High assignment: Codex gpt-5.6-terra, high. The extra-high mention is withdrawn. C3 starts in its eight owned files; C5 remains serial after C3 acceptance, then fresh C6 Sol Medium. All earlier accepted work and baseline remain in place.


Isolated browser preparation: backend8137 and frontend3137 running against the retained synthetic vault. Initial custom Next server was blocked by the existing dev-server lock; no existing process was stopped. The test process now uses an isolated Next config/build directory through process-local config. Next added only its temporary generated-type paths to tsconfig/next-env; these are tracked for restoration after stopping this test frontend. Nine unrelated-route smoke reads passed at 1280×900 (HTTP200, no page errors, no horizontal overflow). Evidence: output/decision-map-redesign/acceptance/route-smoke.json. This does not claim deep map or responsive acceptance.

### C3 accepted at leaf boundary; C5 started

Actual owner: Codex gpt-5.6-terra, high, c3_graph. Exactly eight owned files changed. Coordinator reviewed focused slice, measured geometry, source shape, exact prefill and navigation. Corrected findings include invalid JSX, duplicate scaling, foreign issue traversal, nested claim evidence, wrong source return identity, and missing needs-review update action. Coordinator reran both focused scripts and frontend typecheck successfully. Existing Node module-type warnings only. Browser visuals remain pending and may require scoped owner corrections; this is component acceptance, not V6/V7 completion.

C5 is now serial coordinator work. Local Next hook guides read. UnderstandPanel.tsx is the previously documented narrow coordinator caller seam. Synthetic inputs now contain six issues, two sources, three work products and one explicit legacy decision; no analysis/options were seeded. The configured model output remains the sole current structured timing analysis before the UI publication test.

### C5 wiring accepted for combined browser verification

Coordinator connected map analysis to existing inquiry actions, issue-targeted research, saved issue review, exact decision prefill, frozen scenario instruction basis, and one collapsed retained conversation. Selection is scoped to vault/actor/matter; focus and preview are separate; core reads survive optional failures; late reads are guarded. Source returns retain node and scroll. Changed the two planned callers and narrow UnderstandPanel seam; no new production endpoint/service. Registered both new focused scripts. Typecheck, integration, source behavior, and decision-recording scripts pass. Updated the existing return-link assertion to expect focusedIssueId rather than stale query-only issue; no behavioral gate removed.

Initial browser screenshot found a material visual failure: the graph begins too low at 1280×900 and labels run behind context cards. C3 owner will correct its visual files before C6. Browser action and failure tests are in progress, not yet accepted. Test-only provider endpoint exists only in output acceptance wrapper and substitutes only the provider; production routes are unmodified.

### Browser corrections and verification before C6

Real UI action proof: Analyze paths published three options with Unknown; preview and cancel wrote no decision; final explicit action recorded separate edited wording and exact server basis. Correcting a synthetic fact marked analysis Needs review; updating it changed the map while the old decision basis remained unchanged. A normal source tool read exposed a same-prose/output-hash collision in generic claim lookup. C2 fixed source-local lookup and added a regression; coordinator reran 42 tests successfully. The additive status.claims seam is documented in contract.md and wired into UnderstandPanel.

Source proof now resolves passage_state=exact and opens the supplied excerpt. Returning preserves selected path and the same composer DOM identity/unsent text. Existing ScenarioPanel ran the hypothetical analysis; actual facts/current analysis stayed byte-equivalent via API and the composer survived return. Final source/scenario pass had no page errors. Initial errors and failed selectors remain in earlier logs; they are not claimed passed.

C3 visual corrections put the first two fork paths above y=900 at1280 and restored generated business effect below the graph. Responsive checks passed1440/1024/768;390 initially failed. Owner corrected narrow title/header/nav and reports page/body width390; coordinator rerun pending. Chrome is unavailable through CUA; only the in-app browser is exposed. Its page-zoom shortcuts did not provide verifiable native200% zoom. The temporary tab was reset/closed. CSS200% enlargement is tested separately and is not claimed as native zoom.

Required full backend run: 1,215 passed and1 failed of1,216 in520.86s. Failure was an existing research API test double that lacked the new optional issue_id keyword. Extended it to verify both None and an issue ID; its11-test file now passes. Added collision regression also passes. No production failure remains from that full run; do not report a second all-green full run that did not occur.

Frontend aggregate and both new focused scripts pass. Two document-navigation assertions were stale against unchanged captured-baseline components: the Documents name is an aria-label, and tab spacing changed. Assertions now check the accessible nav name and exact active tab plus its title/lifecycle/Unsaved text; callback/identity checks remain. This is a reported test repair, not an application style change.

### C6 review and scoped corrections in progress

Fresh read-only reviewer: Codex `gpt-5.6-sol` medium. Review completed against the captured implementation baseline. Three material findings: determinate conditional edges could activate contradictory options (P1); queued issue research omitted exact facts/questions from its frozen prompt and freshness basis (P1); same-length selected passages or unsaved drafts could share a basis (P2). The reviewer found no further material visual defect in the supplied final screenshots. No app writes ran during that review.

Returned corrections to original C1 Sol High, C2 Sol High and C3 Terra High instances, with their original disjoint ownership. Coordinator added the additive `inactive` edge state to backend/TS shared types. No extra reviewer or nested worker was added. Unknown remains distinct from a known unmet requirement. A complete `all` route with any mismatch is inactive; unresolved `all` is unknown; `any` activates only matching requirements. The graph retains structural edges without treating inactive or unknown as selected path evidence.

Evidence packaging: `configured-model-publication-proof.json` and `configured-model-saved-inquiry.md` read the existing original successful inquiry and match its run, analysis, analysis revision and output revision to the C1 resolver artifact. The original configured result's empty map predates C2 projection. No model rerun or manual publication was used to produce this proof. `ui-roundtrips.json` is an initial partial/failing run, superseded for source/return/scenario behavior by `ui-source-scenario.json` and `source-proof.json`; its fact-correction/update checks passed before the old source collision failed.

### C6 three material corrections accepted

C1 Sol High changed `issue_analysis.py`, `research.py`, `research_runs.py`, `test_issue_analysis.py` and `test_research.py`. Coordinator reran the complete focused generation/research files plus the real provider-boundary publication integration: **66 passed** (`c6-generation-focused.log`). C2 Sol High changed `workspace_review.py` and `test_workspace_review.py`; coordinator reran both projection/decision files: **43 passed** (`c6-projection-focused.log`). C3 Terra High added inactive connector presentation and checks. Coordinator reran the map aggregate and both new scripts successfully, and the isolated production build passed (`frontend-c6-build.log`).

The same fresh Sol Medium reviewer rechecked only these material corrections and evidence packaging, and reported no unresolved material finding. The live regenerated map shows the `met` branch active, the `not_met` branch inactive, and the inactive option still previewable with zero page errors (`ui-c6-routes.json`).

Coordinator image inspection then caught a remaining display defect in that regenerated state: historical paths sorted before current paths and some historical/current connector label boxes overlapped. Returned this narrow ordering/label correction to C3. This is a new observed visual defect; backend code is frozen and the final **1,222-test** suite is running. The graph refresh was already in progress when this screenshot defect was found; any needed final incremental refresh will be recorded rather than claiming the first refresh includes later changes.


### Final verification and cleanup accepted

Final backend run: **1,222 passed**, one existing Starlette/httpx deprecation warning, 643.61s (`backend-c6-final.log`). It includes every backend correction. Final frontend build passed (`frontend-final-build.log`); typecheck passed after restoring generated Next type paths (`frontend-final-typecheck.log`). The complete map aggregate and both new checks passed after the route-state correction; graph/layout checks passed again after the final visual correction.

Final image inspection accepted `map-c6-routes-1280.png`: current paths are first, both first-fork cards fit, and active/inactive labels are readable. Browser geometry proves visible connector labels do not overlap. Shared identities and full outline relationships remain. C3's final narrow changes were `decisionMapLayout.ts`, `DecisionPathGraph.tsx`, and `check-decision-path-layout.ts`; the coordinator checked them directly. No additional reviewer was added.

`graphify update .` completed twice. The first was already running when the final screenshot exposed the ordering/label defect. The second includes that correction and finished with 78,265 nodes and 136,643 edges. This is an explicit departure from the planned one call. Both raw and aggregated HTML views exceeded the tool's 5,000-node limit; 806 source files yielded no AST nodes. No paid semantic-label run was made. Logs preserve the exact warnings.

Only owned acceptance backend 8137/frontend 3137 servers were stopped. Original backend 8000/frontend 3000 remain running. Next type files match their pre-server copies byte-for-byte. Only the two owned generated build directories were removed. Synthetic vault and evidence remain available. The final protected-file check reports no authoritative changes and an unchanged active-vault pointer. Incremental changed-path and added-line whitespace checks passed against the captured dirty-tree baseline. Concurrent Phase2 planning files remain separate and preserved.

Project context now points to this completed checkpoint. See `docs/decision-map-redesign.verification.md`, `output/decision-map-redesign/acceptance/cleanup.json`, `protected-after.json`, and `c6-review-summary.json`. No commit, push, PR or deployment was made. Remaining limits: native 200% browser zoom could not be verified; CSS enlargement was verified separately, and graph HTML was too large. No material implementation finding remains.
