# Problem decomposition — plan pre-flight

Date: September 10, 2026. This records plan preparation only. Implementation is pending.

## Observed baseline

From `backend`:

```bash
./.venv/bin/python -m pytest tests/test_issue_analysis.py tests/test_workspace_actions.py tests/test_decision_map_generation_integration.py tests/test_main_agent_research.py tests/test_research_publication.py tests/test_living_dossier.py -q
```

Result: **65 passed, 1 warning, 27.99 seconds**. Warning: existing Starlette/httpx deprecation. No dependency changes made.

From `frontend`: `npm run typecheck` passed.

From repository root: `git diff --check` passed.

Graphify query was used for initial navigation. No graph update is needed for this documentation-only turn. The executor must update it after application edits.

## Plan audit findings resolved

- Reuse the existing issue tests, conditions, options, and recommendation records. The new projection supplies business/factual decomposition and links to those records.
- Ordinary chat publication excludes many mutation-bearing turns. The plan names a separate eligible decomposition effect without weakening the existing short-answer snapshot guard.
- Initial intake creates facts after context capture. The plan requires observed same-run receipt amendments and preserves concurrent-change detection.
- Research packet prose differs from raw provider text. Publication must use the final saved packet hash.
- New questions can exist before canonical issue IDs. They stay visible and discussable without fake IDs or automatic changes to issue dispositions.
- Prior generated maps can leak excluded context. The plan requires source-lineage filtering and omission when uncertain.
- A narrow issue research answer cannot replace the full matter decomposition.
- Model/transport failure must retain prose and earlier valid analysis.
- A one-shot prompt must contain the blueprint inline; it must not depend on this conversation.

## Limits

No feature implementation, new feature tests, full build, browser walk, or configured-model quality comparison was performed in this planning task. All are specified as implementation acceptance work. Live model availability was not tested. Existing working-tree changes were preserved. No unresolved product choice prevents starting the planned implementation.

## Implementation baseline — September 10, 2026

Initial working tree (before application edits):

```text
 M backend/app/agents/context.py
 M backend/app/agents/output.py
 M backend/app/agents/runner.py
 M backend/app/blank_vault_template/00_System/agents/counsel-copilot.md
 M backend/app/blank_vault_template/00_System/tools/read_file.md
 M backend/app/blank_vault_template/00_System/tools/run_research.md
 M backend/app/blank_vault_template/00_System/tools/save_work_product.md
 M backend/app/blank_vault_template/00_System/tools/search_vault.md
 M backend/app/experimental_skills/research.md
 M backend/app/intelligence/fetch.py
 M backend/app/models/api.py
 M backend/app/models/awareness.py
 M backend/app/routers/chat.py
 M backend/app/routers/matters.py
 M backend/app/runtime.py
 M backend/app/services/chat_runs.py
 M backend/app/services/dossier.py
 M backend/app/services/index.py
 M backend/app/services/matter_records.py
 M backend/app/services/matter_state.py
 M backend/app/services/matters.py
 M backend/app/services/recommendations.py
 M backend/app/services/research.py
 M backend/app/services/research_runs.py
 M backend/app/services/scheduler.py
 M backend/app/services/vault.py
 M backend/app/services/workspace_review.py
 M backend/app/tools/capabilities.py
 M backend/app/tools/handlers.py
 M backend/app/tools/registry.py
 M backend/requirements.txt
 M backend/tests/test_agents.py
 M backend/tests/test_firecrawl.py
 M backend/tests/test_matter_action_api.py
 M backend/tests/test_output_citations.py
 M backend/tests/test_research.py
 M frontend/app/matters/[matterId]/research/page.tsx
 M frontend/app/matters/page.tsx
 M frontend/components/AppShell.tsx
 M frontend/components/ChatCards.tsx
 M frontend/components/MatterWorkspace.tsx
 M frontend/components/Phase2Icon.tsx
 M frontend/components/experimental/ExperimentalChat.module.css
 M frontend/components/experimental/ExperimentalChat.tsx
 M frontend/components/experimental/ExperimentalDocument.tsx
 M frontend/components/experimental/ExperimentalNextSteps.tsx
 M frontend/lib/api.ts
 M frontend/lib/types.ts
 M scripts/setup.sh
?? .tmp/
?? "Mosaic Relay UX Experiment 2026-09-03 R3/"
?? backend/app/blank_vault_template/00_System/tools/collect_research_evidence.md
?? backend/app/blank_vault_template/00_System/tools/read_research_source.md
?? backend/app/models/research_investigation.py
?? backend/app/models/research_scope.py
?? backend/app/services/main_agent_research.py
?? backend/app/services/matter_storage.py
?? backend/app/services/native_research.py
?? backend/app/services/research_checkpoints.py
?? backend/app/services/research_collection.py
?? backend/app/services/research_documents.py
?? backend/app/services/research_execution.py
?? backend/app/services/research_publication.py
?? backend/app/services/research_reader.py
?? backend/app/tools/research_investigation.py
?? backend/tests/manual/
?? backend/tests/test_living_dossier.py
?? backend/tests/test_main_agent_research.py
?? backend/tests/test_matter_storage.py
?? backend/tests/test_native_research.py
?? backend/tests/test_research_checkpoints.py
?? backend/tests/test_research_documents.py
?? backend/tests/test_research_lifecycle.py
?? backend/tests/test_research_publication.py
?? backend/tests/test_research_review_followup.py
?? backend/tests/test_research_scope.py
?? backend/tests/test_research_tool_instructions.py
?? docs/living-dossier.md
?? docs/main-agent-research-dossier.handoff-plan.md
?? docs/main-agent-research-dossier.handoff-progress.md
?? docs/main-agent-research-dossier.handoff-prompt.md
?? docs/main-agent-research-dossier.verification.md
?? docs/matter-storage.md
?? docs/problem-decomposition.handoff-plan.md
?? docs/problem-decomposition.handoff-progress.md
?? docs/problem-decomposition.handoff-prompt.md
?? docs/problem-decomposition.verification.md
?? docs/research-review-followup.verification.md
?? docs/research-source-choices.md
?? frontend/.next-card-drag-build/
?? frontend/.next-choice-workflow-dev/
?? frontend/.next-citation-reading-build/
?? frontend/.next-dossier-check/
?? frontend/.next-firecrawl-repair-build/
?? frontend/.next-matter-a-build/
?? frontend/.next-matter-a-dev/
?? frontend/.next-matter-storage-check/
?? frontend/.next-matter-storage-dev/
?? frontend/.next-native-research-build/
?? frontend/.next-native-research-dev/
?? frontend/.next-phase2-build/
?? frontend/.next-phase2-dev/
?? frontend/.next-research-gate-check/
?? frontend/.next-research-gate-dev/
?? frontend/.next-research-investigation/
?? frontend/.next-research-scope-build/
?? frontend/.next-research-scope-dev/
?? frontend/.next-sol-followup/
?? frontend/app/matters/storage/
?? frontend/components/ResearchScopeChoice.module.css
?? frontend/components/ResearchScopeChoice.tsx
?? frontend/components/experimental/nextSteps.ts
?? frontend/lib/researchScope.ts
?? frontend/scripts/check-next-steps.ts
?? output/choice-revision-captures/
?? output/experimental-chat/
?? output/living-dossier/
?? output/main-agent-research-dossier/
?? output/matter-storage/
?? output/problem-decomposition/
?? output/research-scope/
?? output/shared-questions/
?? output/uiphase2-implementation/test-root/
?? test-results/
```

Frontend `npm run typecheck`: passed. Application source baseline copies: `output/problem-decomposition/baseline/files/`.

Focused backend baseline: **65 passed, 1 warning in 27.82 seconds**. Command is the focused baseline command above.

Missing behavior before implementation: `backend/app/models/problem_analysis.py` and `backend/app/services/problem_analysis.py` do not exist; `WorkspaceSnapshot` has no `problem_analysis` field.

Configured-model baseline: the first synthetic request returned `ReadTimeout` after 120.11s. Exact selection, prompt and context are saved in `output/problem-decomposition/before-model.json`. No provider setting was changed. The second request remains in flight while independent implementation proceeds.

Baseline model result: second request returned in 11.44s. It inferred a customer-facing disclosure from an internal description and treated fresh consent as required without a supplied jurisdiction. This is a baseline judgment failure, not verified legal advice. First request timed out, so the two-turn comparison is incomplete. Exact outputs: `output/problem-decomposition/before-model.json`.

Step 2 initial tests found two fixture setup errors: existing issue IDs cannot be deleted through save_issues, and a new workspace file must be created before update. The no-issue test now creates an actual new matter. A follow-up run also caught a missing required request_text in that fixture; corrected. Production assertions were not relaxed.

Step 2 final check: 36 passed, 1 warning in 5.54s. Step 3 command: `cd backend && ./.venv/bin/python -m pytest tests/test_problem_analysis.py tests/test_workspace_actions.py tests/test_issue_analysis.py -q`. Initial added source test omitted the required selection role; fixed the fixture.

Step 3 final: 55 passed, 1 warning in 9.03s. Step 4 required group: 89 passed, 1 warning in 29.58s before the added synchronous amended-context checkpoint write; the same group was rerun after that change. Intake fixture corrections used working_ask and reported_facts.statement, matching the existing API.

Step 4 final required group after synchronous checkpoint amendment: 89 passed, 1 warning in 35.63s. Step 5 required group: 48 passed, 6 warnings in 65.67s. Final optional-map unit/integration recheck: 37 passed, 6 warnings in 33.58s. Warnings are existing Starlette/httpx and PDF-library deprecations. The public evidence is a fictional PDF from the existing network-boundary fixture. Scripted outputs prove storage and transport only.

Step 6 typecheck passed. Required matter-review group fails at pre-existing EvidenceDrawer text ordering: check-issue-review.ts:286 expects Claim revision before the passage and the phrase Exact available passage. The current drawer shows Saved passage before Technical details. `cmp` confirms EvidenceDrawer.tsx is byte-identical to the captured baseline. This failure is not treated as a pass and was not changed to fit the test. Independent UI work continues.

Step 6 browser evidence: `output/problem-decomposition/browser-results.json` (8 state/surface checks; no page errors), `browser-normal-*.png`, `browser-experimental-*.png`, `browser-history.png`. Normal view: saved, partial, stale, no map, keyboard Enter, new question, exact earlier breakdown, discuss prefill. Experimental: all four states, preserves typed draft when discussing a question, refreshing and reloading; 390px check found no page overflow. Early browser checks waited only for element presence and raced initial loading/draft restoration; final checks wait for the expected loaded state. Added workspace guard avoids showing Not yet analyzed while experimental workspace data is loading.

Fixture server command: `backend/.venv/bin/python output/problem-decomposition/serve_fixture.py` (8136). Frontend: `PHASE2_DIST_DIR=.next-problem-decomposition NEXT_PUBLIC_API_BASE_URL=http://localhost:8136/api npm run dev -- --port 3136`. Fixture identities: `output/problem-decomposition/browser-fixture.json`. Existing services were left running.

## Implementation result — September 10, 2026

The feature is implemented. Full acceptance is **not** claimed. The new transport, immutable saved envelope, current reference, freshness projection, intake/chat/research publication, and shared breakdown view are present. No decision, issue disposition, or confirmed fact is created by the generated map itself. Typed lawyer actions retain their existing authority and provenance.

The final source changes were reviewed against the saved starting copies, rather than treating all existing Git changes as this implementation. The changed-file inventory is `output/problem-decomposition/incremental-changed-files.json`. New feature files are `backend/app/models/problem_analysis.py`, `backend/app/services/problem_analysis.py`, `backend/app/services/problem_analysis_validation.py`, `backend/app/services/problem_analysis_contract.py`, `frontend/lib/problemAnalysisTypes.ts`, and `frontend/components/workspace/ProblemBreakdown.tsx`. New tests are `backend/tests/test_problem_analysis.py` and `backend/tests/test_problem_analysis_integration.py`.

### Final checks and failed checks

- Initial full backend run: **1,383 passed, 3 failed, 6 warnings, 546.80s** (`full-backend.log`). Two failures exposed optional capture rejecting permitted prior-matter research. Fixed by omitting foreign canonical references from the map while preserving the existing research scope. Both affected source-scope cases passed in the focused recheck.
- Latest focused regression: **138 passed, 6 warnings, 122.00s** (`final-regression.log`). Command from `backend`: `./.venv/bin/python -m pytest tests/test_problem_analysis.py tests/test_problem_analysis_integration.py tests/test_research_scope.py tests/test_agents.py tests/test_workspace_interactions.py -q`.
- `npm run typecheck`: passed (`final-typecheck.log`). Production build with `PHASE2_DIST_DIR=.next-problem-decomposition-build npm run build`: passed (`build-final.log`). No dependency was added.
- `check:decision-path-layout` and `check:decision-path-recording`: passed.
- `check:workspace-ux`: FAILED at `check-workspace-ux.ts:61`, the matter-total initial-loading assertion. The affected matters page was not edited in this task. Earlier transport, saved receipt, draft recovery and offset checks in this group passed. Later chained scripts were not reached.
- `check:single-lawyer-workspace`: FAILED at `check-workspace-exploration.ts:12`, the scenario historical-boundary wording assertion. `ScenarioPanel.tsx` is byte-identical to the starting copy. Later chained scripts were not reached.
- `check:lawyer-continuity`: FAILED in the server-render harness for ChangeImpactPanel. The harness returns an object for the unhandled MatterIcon import. ChangeImpactPanel and MatterIcon are byte-identical to the starting copies. Orientation and team presentation checks passed first.
- `check:matter-review-decision-map`: FAILED at the unchanged EvidenceDrawer wording/order assertion described above. Later chained scripts were not reached.
- The original `test_timeout_research_run_finishes_and_does_not_move_respond_backward` **still fails its 0.4-second whole-run deadline**. It passed against a separate copy of the starting application (`baseline-timeout.log`, 0.71s total test time). The final code failed the original assertion in isolation (`timeout-isolated.log`, 0.79s total test time). The run was waiting for the disposable index rebuild. This is not labelled a pre-existing pass/failure. Diagnostic test changes tried separating search cancellation from disk work; they exposed that the old search callback is not the new queued collector path. Those changes were removed. The original assertion remains. No production timeout was increased, and no assertion was weakened to obtain a pass.

The full suite was run again while independent browser work continued. Its exact result is appended below. That run collected a temporary diagnostic version of the timeout test; the final repository retains the original version. Therefore its result is not presented as a clean full-suite pass for the final tree.

### Browser and lifecycle evidence

All browser data was synthetic. The provider used for these checks was explicitly scripted. It proves transport and record integrity, not legal judgment. The fixture server scripts are `serve_fixture.py` and `serve_stories.py` under `output/problem-decomposition/`. The final fixture identities are in `stories-fixture.json`. Earlier fixture identities remain in `browser-fixture-original.json`. All fixtures use disposable copied vaults; the active vault pointer and provider configuration were not changed.

- Eight state/surface checks passed: saved, partial, stale and no-map in Understand and experimental chat. Keyboard disclosure, exact earlier-version reading, unsent draft preservation after discussion, refresh and reload, and the 390px page-overflow check passed. Evidence: `browser-results.json`, `browser-normal-*.png`, `browser-experimental-*.png`, `browser-history.png`.
- The repeated browser pass exposed a load race: the breakdown could offer a discussion action before the saved composer draft was restored. The panel now waits for that restoration. It does not send the question automatically.
- Story A passed through visible experimental-chat submission: intake facts, actual correction, revised answer/map, preserved earlier statement and correction link, hypothetical synthetic-data discussion with unchanged facts/current pointer, reload, and exact prior-map inspection. Story B passed applicability/exception display, linked prior decision, different-jurisdiction/proposal no-change output, no duplicate issues and unchanged recorded decision. Story C passed the framing, combined-plan condition and alternative display. Exact identities and assertions: `browser-stories-results.json`; screenshots: `story-A-history.png`, `story-B-no-change.png`, `story-C-combined.png`.
- Story D was assembled through real services and HTTP chat in the same disposable browser vault: create matter, intake, typed supporting answer, analysis, queued research, concurrent correction and reassessment, late research publication, saved-packet retry, malformed output, index rebuild, and reopen. The late packet kept the earlier reference; retry made no research/model call and created no duplicate fact. Evidence: `story-D-results.json` and `story_d.py`. The script initially used counsel-copilot for an intake-only tool; it was corrected to use the Intake Agent. This was a fixture error.
- The D result was then reopened in the browser. The current reference matched exactly after rebuild. Opening and returning from the saved answer preserved the unsent draft. Immutable inquiry files that are absent from experimental document tabs now open through the existing normal matter file viewer in a separate tab. Evidence: `browser-followthrough-results.json`, `story-D-reopen.png`, `story-D-saved-answer.png`, `story-D-normal.png`, `story-D-normal-390.png`.
- Malformed transport, foreign IDs/paths, no-source answers, PDF selected passage, pointer-write failure and saved-packet replay, edited/missing maps, and concurrent current-pointer publication are covered by the feature tests. These failure variants were not all repeated as one continuous browser story.
- Current route smoke checks visited matters, decisions, automations, settings and the saved D matter. This is **not** a full pass of `docs/ACCEPTANCE_TESTS.md`, its fifteen-step matter-review walkthrough, native 200% zoom, or every source/decision/draft interaction. Those broader browser acceptance items remain unverified. The old checked boxes in that document were not reused as current evidence.

### Configured-model judgment evaluation

App provider: `openai_compatible`, model `deepseek-v4-flash`, as resolved from existing settings. This is separate from the coding agent. No provider/model setting changed. All inputs were synthetic; rules in B were fictional. No public collection was authorized or performed in the direct comparison. The model's legal statements below are evaluation outputs, not verified law.

Artifacts:

- `before-model.json`: original pre-change A requests and complete system input. First request timed out after **120.11s**. Correction response took **11.44s**. Because the first answer is missing, the A two-turn baseline comparison is incomplete.
- `model-more-initial.json`: B/C baseline responses generated later using the exact captured pre-change system message, same app model and same synthetic inputs. B: **10.00s**, then **2.28s**; C: **5.92s**. This is a reconstructed prompt baseline, not a rerun of the old HTTP application.
- `after-model-initial.json` and `after-model-second.json`: earlier post-change runs that omitted the optional map. This led to a focused prompt fix: the final user-facing-only rule now explicitly permits the separate structured block.
- Final `after-model.json`: A responses took **13.75s** and **11.14s**. Final `model-more.json`: B **12.17s**, then **11.59s**; C **21.76s**. All five final structured blocks passed the actual transport parser. They were direct provider calls, one model call per response, zero tool calls. A valid structure does not establish sound judgment.
- `live-http.json`: supplemental actual `/api/chat` run on a new copied synthetic matter. Both turns returned HTTP 200 and saved **partial** breakdowns. First turn: **166.73s**, seven successful tool actions (scope, file list, four reads, recommendation save). Correction: **21.76s**, four successful tool actions (scope, two workspace actions, recommendation save). No research tool was called. The synchronous HTTP response does not expose a complete provider-call count, so none is inferred from the tool count. Exact run IDs: `RUN-20260910-e42fe2` and `RUN-20260910-54fff5`. The second map points to the first. Several unsupported `reported` parts were correctly downgraded to `assumed`; unresolved external authority also kept the result partial.

| Criterion | Observed result | Evidence and limit |
|---|---|---|
| Business objective and framing | Partial | A separates support improvement from vendor reuse. C challenges “instant earnings access,” but its objective field describes the analysis assignment instead of simply supplying funds before payday. |
| Material activities and relationships | Pass in observed examples | A distinguishes collection/retention, internal evaluation and vendor processing. The correction gives vendor training its own treatment. No extra canonical issues were created by the map. |
| Characterization tied to differentiating facts | Partial / fail on certainty | C uses the charge and personal recourse as differentiating facts. It nevertheless states “The substance is a short-term, small-dollar consumer loan” without a supplied jurisdiction or legal definition. |
| Applicability, timing and exceptions | Fail on timing; other elements observed | B applies the Alder activity scope, rejects the Birch rule and preserves proposal status. It incorrectly says the September amendment “imposes a pilot approval requirement effective 2026-01-01,” confusing the base rule date and amendment date and inventing retroactivity. |
| Adverse facts and competing interpretation | Pass in observed A | The correction answer says it “changes the picture materially” and treats general-model training as a separate purpose. This is not a claim of exhaustive issue spotting. |
| Explained next step | Pass in observed examples | A asks whether reuse can be disabled and explains the pilot effect. C asks about license scope and failed-deduction liability. B adds a synthetic-pipeline question whose value is less clear on the supplied identifiable-data facts. |
| New input changes structure and answer | Pass in observed A | Final A adds an `assessment_changed` explanation. The real HTTP correction saved a new map with the exact prior reference and revised integrated answer. |
| Whole-plan answer and practical alternative | Pass, with legal-certainty limit above | C addresses the combined arrangement and offers nonrecourse/fee-free and other design alternatives. A offers separation of internal work and vendor training. |
| No invented facts, authority or decisions | Fail on facts/dates | C adds “Likely no underwriting,” which was not supplied. B invents the temporal treatment above. No external verification was claimed and no generated map recorded a decision. The baseline A also inferred a customer disclosure and asserted consent without supplied jurisdiction. |
| Lawyer effort | Mixed | The map is inspectable and discussion is one action without automatic send. Repeated or unnecessary questions remain in model output, including B's question about turning the assessment into a decision. Live first-turn latency was 166.73s. This is not validated as low effort or production latency. |

The added map is useful and its storage behavior is demonstrated. Model judgment is **not fully validated**, and the failed examples are retained. No verifier, confidence gate, extra agent, mandatory research step or legal-perfection block was added to hide these failures.

### Final follow-up results

The second full backend command returned **1,387 passed, 1 failed, 6 warnings in 705.69s** (`full-backend-final.log`). The only failure was the timeout test discussed above. The original, restored timeout test was then rerun without the full suite and with the graph process briefly paused; it still failed, **0.86s total test time** (`timeout-original-final.log`). This remains an unresolved check.

The downstream UI scripts were also run separately so the earlier failures did not suppress independent checks. Twelve passed: `check:initial-load-integrity`, `check:provider-admin`, `check:adaptive-intake`, `check:chat-run-recovery`, `check:research-queue`, `check:workspace-reuse`, `check:workspace-drafting`, `check:output-templates`, `check:decision-map`, `check:document-navigation`, `check:document-reference-behavior`, and `check:matter-review-integration`. `check:workspace-evidence` failed on the same unchanged EvidenceDrawer labels. `check-continuity-integrity.ts` failed at line 318 because it expected no `/handoff-references` read outside the handoff panel; that loader behavior is unchanged from the starting source. These failures were not hidden by changing assertions.

The final production build and typecheck passed after the saved-answer link fix. Typecheck also passed after removing this task's generated Next.js path additions from the originally clean `next-env.d.ts` and `tsconfig.json`. Final `git diff --check` passed. Only the fixture backend on 8136 and fixture frontend on 3136 were stopped. Other application servers, real vaults, runtime provider settings and the active-vault pointer were not changed. No commit, push or deployment was made.

### Graph update limitation

`graphify update .` completed AST extraction of 6,550 uncached files but did not finish the graph merge. It was stopped after several minutes. A second attempt, `graphify update . --no-cluster`, completed extraction of 6,208 uncached files and reported 2,470 files with zero nodes. It still did not finish. A macOS process sample measured a **21.0 GB physical footprint** while processing the existing **370 MB** graph (`graphify-sample.txt`). That process was stopped to release memory. No LLM graph operation was used. **Graph refresh is incomplete**; neither command is reported as a successful update. The application and its saved-map tests do not depend on this graph. The graph tool's generated report was not treated as proof of the final source state.

## Acceptance continuation — September 10, 2026

The user requested “finish acceptance.” This continuation preserved the existing dirty tree and used a new isolated fixture. No commit, push, deployment, provider change, real-vault mutation, or delegated agent was used.

### Repairs and current automated evidence

- **Original timeout fixed in production.** The unchanged `test_timeout_research_run_finishes_and_does_not_move_respond_backward` failed again (`acceptance-timeout-before.log`). Profiling found repeated pure-Python YAML writes (`timeout-profile.pstats`). The existing local `backend/frontmatter.py` adapter now selects PyYAML's `CSafeDumper`, with `SafeDumper` fallback. Safe serialization is retained; no package or import replacement was introduced. The same 0.4-second test and frontmatter/vault checks passed: **6 passed in 0.58s**. No deadline was increased.
- **Stale frontend tests corrected.** Inspection confirmed current labels, layout wrappers, whitespace, and actual loader behavior. Checks now use “Saved passage,” “Read saved copy,” the current scenario/flow wording, current loaded-state wrappers, and fact-panel handoff references. The change-impact render harness now supplies its missing MatterIcon stub. Source support still comes from the saved evidence status, not a link click. No production UI was changed to satisfy old wording. All four required groups pass: `check:workspace-ux`, `check:single-lawyer-workspace`, `check:lawyer-continuity`, and `check:matter-review-decision-map`. Logs: `acceptance-ux.log`, `acceptance-single.log`, `acceptance-continuity.log`, `acceptance-map.log`.
- **Browser-discovered draft read defect fixed.** An untracked save with a leading blank line was normalized by the existing vault writer, but the saved review segments still described the pre-normalized text. The document read then reported a false loading conflict. `DocumentReviewService._review` now reconciles untracked segments with authoritative Markdown, without writing during GET. The existing tracked branch is unchanged. A regression verifies exact saved-body agreement and read-only projection. **26 document-review tests passed in 4.29s.** The existing affected draft then reopened as Saved, with its lawyer edit intact, and exported successfully through the browser. Vault whitespace normalization itself was not changed.
- The first complete backend run passed **1,388 tests, 6 warnings, 419.54s**. The final complete run after all production repairs passed **1,389 tests, 6 warnings, 418.38s** (`acceptance-backend-final.log`).
- Frontend `npm run typecheck` and `PHASE2_DIST_DIR=.next-problem-decomposition-build npm run build` passed (`acceptance-typecheck.log`, `acceptance-build.log`).
- **Graph refresh repaired and completed.** `.graphifyignore` excludes generated `.next*` directories and old acceptance output. The first completed update produced 14,278 nodes. The final `graphify update .` produced **14,283 nodes, 27,686 edges, 1,491 communities**, with no LLM calls. Four JSON configuration files produced no nodes; extraction records that warning. Logs: `acceptance-graph.log`, `acceptance-graph-final.log`. The old generated-code graph was replaced, not retained as current evidence.

### New browser workflow evidence

Fixture: `output/problem-acceptance/environment.json`; vault under `/var/folders/.../T/themis-decision-map-acceptance-oyk_603c/vault`; matter **MAT-20260910-0e3709**. Backend 8136 and frontend 3136. Fixture sources and replies are synthetic. The deterministic provider tests application behavior, not legal judgment.

The current 15-step review walkthrough was exercised as follows:

1. Business question, short answer and named next action are on the first desktop screen. Screenshots and measured CSS sizes cover 1141, 1042, 1440, 1024, 768 and 390 pixels. No page overflow. `review-css-*.png`, `css-widths.json`; the 1024 recheck measured width 1024 and next-action bottom 811px in a 1006px viewport. The initial measurements at physical viewport sizes reflected the browser's existing 110% scale; they are retained separately and are not exact CSS-size evidence.
2. Expanded Needs your review: three issues, reasons, owner words and direct actions. All six issues remain accessible.
3. Selected the audience issue: full title disclosure, application, linked factual question, work and saved conditional paths. Unknown remains visible. An empty test/claim link is labeled as missing support.
4. Opened the inline source drawer: exact “Child” passage, Retrieved status, generated explanation, and technical details. Read saved copy opens the exact excerpt and returns to the same issue.
5. Opened Data retention: useful explanation remains visible with “No cited sources” and Research legal basis.
6. Saved the factual answer “The launch includes children aged 10 to 12.” through the issue. It appears in the issue and the map's question/fact records. Old paths become Needs review. Explicit Analyze paths saved the useful fixture answer. The fixture deliberately returns no replacement path fence; the UI truthfully retains old paths as Needs review. This is graceful-failure evidence, not proof of a newly generated legal path.
7. Opened the separate map: same issue, two candidate paths, unknown condition and labeled relationships. All records shows the reported fact, answered question, open work and completed mitigation.
8. Entered “Keep this unsent acceptance note.” in map discussion and selected Discuss this path. The text and existing conversation remained. The current source return retained selected issue state.
9. Created “Confirm the launch audience controls,” owner Alex Morgan. Completed it through the issue. It appears as Done in the full map. The issue remained open; completion did not record a decision or close the matter.
10. Cancelled the disposition form, then explicitly recorded an unresolved position with a lawyer reason. Reload retained it. Separately cancelled the formal decision form and then submitted a synthetic retention decision. The final audit finds the original fixture decision plus exactly this new decision.
11. Returned from the map with selection and saved state. Earlier analysis remains Needs review after factual changes.
12. From a path, opened Try a different assumption. Analyzed and saved “Adult-only alternative.” The baseline retained the real child-audience fact. Reload found the saved scenario. Only after selecting its change and clicking Adopt selected facts did the new fact enter the real record. The scenario then showed Earlier baseline and remained historical.
13. Draft initially showed three work products and two sources. Edited Launch advice, switched to Product control checklist, and returned: unsaved text remained. Saving exposed the review mismatch described above. After its fix, a fresh browser tab loaded Saved and retained the edit.
14. Exact issue citation and draft-library source opens/returns were exercised. With a linked fixture claim, the map source opens the exact Child passage and returns to the same map (`map-source.txt`). A supported saved-document link in chat opens the correct path and saved revision, then returns to the same conversation (`chat-source.txt`, `chat-source-return.txt`). A plain document reference has no saved excerpt and correctly says Exact passage unavailable while showing the full source. A fixture link with an unsupported `#Child` suffix rendered as unavailable text; the supported document-path format was used for the navigation check. Existing document-reference behavior and integration checks also pass.
15. Created an explicit working copy of the supplied product specification; original source remains read-only. Added a canonical immutable final fixture and opened its final history entry: “Final · Read-only,” disabled Save, no edit mode. Exported saved Launch advice via Word: the server returned HTTP 200 with the exact path and content/review revisions. The generated DOCX contains the lawyer edit. Final-fixture creation was service-level setup, not a browser finalization test.

`output/problem-acceptance/audit.json` verifies: Markdown unchanged by index rebuild; unresolved issue; completed mitigation; two decisions; explicit scenario adoption; immutable final; original supplied source text retained; saved-body/review agreement; exported DOCX contains the selected draft edit. `browser-console.json` contains no warnings or errors for the final test tab. The first tab stopped responding during a reload; a fresh tab completed the repaired read and export. No full-session console-clean claim is made for that abandoned tab.

**Native 200% zoom remains unavailable.** The in-app browser exposes viewport sizing but no native zoom setting. Sending the reset shortcut did not change its measured 110% scale. Native Codex app control was rejected by the computer-use tool for safety; Chrome is not available in this session. This is not a 200% pass. The viewport tests do not substitute for native zoom. Keyboard Enter opened the problem breakdown.

### Configured-model re-evaluation

`acceptance_model.py` used the existing configured provider/model, with synthetic A–C inputs, tools disabled and no public research. All **five responses supplied parser-valid maps**, with zero tool calls. Times: A 7.12s / 9.03s, B 10.14s / 11.02s, C 17.77s. Full outputs: `acceptance-model.json`.

The existing reasoning contract now distinguishes business outcome from analysis assignment, binds each rule/amendment to its own date, and asks for conditional classification when definitions or jurisdiction are absent. B now uses the September 15 amendment date correctly, separates the synthetic-data exception, and treats the unrelated Birch rule and pending proposal as no present change. A changes vendor-reuse analysis after the correction.

**Judgment remains mixed.** A still overstates internal-only use as safe without jurisdiction or source support. C improves its threshold wording, but invents “before it is earned,” speculates about usury limits without a governing jurisdiction, and recommends a recovery structure whose permissions are not supplied. These are retained findings, not concealed by schema success. There is no new verifier, refusal, mandatory research gate, extra model call, or legal-perfection requirement. The configured-model evaluation is complete; it does not justify a blanket judgment-quality pass.

### Acceptance disposition

Automated acceptance passes, including the full backend suite, typecheck, production build, all four required frontend groups, and graph refresh. The browser workflow and fixture integrity audit are complete with the limits stated above. Acceptance is **conditional**, not an unrestricted pass: native 200% zoom could not be tested with the available browser controls, and configured-model judgment remains mixed. Earlier failed-test and incomplete-graph statements above describe the previous run and are superseded by this continuation.

Final cleanup: both fixture browser tabs and only the owned servers on ports 3136/8136 were closed. Generated Next.js path changes were restored to their entry state. Typecheck passed again after restoration (`acceptance-typecheck-final.log`), the final integrity audit passed, the final tab console had no warnings/errors, and `git diff --check` passed.
