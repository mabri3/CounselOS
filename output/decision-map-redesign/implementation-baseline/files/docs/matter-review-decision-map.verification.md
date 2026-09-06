# Matter review and decision map verification

Status: Implementation and final focused verification are complete, subject to the disclosed limits below. Native 200% zoom was explicitly skipped by the user. Final graph refresh passed. No commit, push, or deploy was made.

## Current acceptance evidence — September 5, 19:12 UTC

This section supersedes earlier pending entries. Native 200% zoom is untested and explicitly skipped by the user. No blanket full-suite pass is claimed for the final tree.

| Requirement | Observed result |
| --- | --- |
| Review order, compact first screen | At 1141 × 1006, the complete orientation ends at Y=788.15. At 1042 × 1006 it ends at Y=811.39. Both show the business question, cited answer, qualification, owned action, and All issues (6). Root inspected `review-accepted-1141.jpg` and `review-accepted-1042.jpg`. |
| Actionable issues | Six issues remain reachable. Review shows at most three reasoned actions with owners. Issue detail shows explanation, law/application, shared factual and legal questions, actual option condition, work, and direct lawyer disposition. |
| Direct disposition and work integrity | Cancel changed none of 35 matter Markdown files. Save/reload retained the consent issue's exact reason and Mitigation in progress. New canonical mitigation named Alex Morgan as owner; completing it left the issue open, the matter open, and the recorded decision unchanged. |
| Shared question and reassessment | The reported answer appeared under both linked issues. Reassessment was explicit. A Business reply update was offered without acceptance. No automatic issue resolution occurred. |
| Checkable claims | Issue/map evidence showed the saved Child passage, applicability explanation and gap, source status, public URL, and exact identities. Unsupported issues retained useful text and a Research legal basis action. Unknown sources stay unavailable; known ambiguous passages use source-only access. |
| Live chat provenance | `RUN-20260905-e2321f` saved claim `CLM-1e19ee4bfe3910f8a1a7` with output revision `85118d5cf9b8d8286d451f5d080504b648ee57fe7a6fdab4f36989210582f549`. Browser showed the actual Child passage and Supplied status, with Claim explanation unavailable. It did not borrow the older fixture claim's explanation. `chat-final-claim.jpg` is direct visual evidence. |
| Draft-targeted read-only answer | Before/after file hashes show only the conversation changed, plus three new run/context/inquiry records. Workspace, drafts, facts, issues, and decisions were unchanged. Source Back returned to Discuss with Launch advice still the target. |
| Matter answer publication | After explicit Clear target and Clear scope, a separate live reassessment published the narrow definition and applicability limitation to the current answer. The final review screenshots show its usable citation. Historical malformed replies remain historical; none was rewritten to simulate success. |
| Separate map and keyboard outline | The selected issue, actual option condition, Unknown branch, existing work and recorded decision were visible. Whole-map inspection included completed work and active/superseded facts. The 390-pixel outline wraps full labels, with document scroll width 380. Keyboard Tab/Enter reaches records and discussion controls. `map-accepted-390.jpg` and `map-outline-accepted-390.jpg` were inspected. |
| Hypothetical separation | `RUN-20260905-fdeb8a` saved Adult-only initial launch with its baseline and result. Real facts and decision hashes did not change during analysis. Only explicit Adopt selected facts changed the selected fact. Reopening retained the earlier result and Earlier baseline state. |
| Conversation continuity | Existing unsent text survived map return with the same conversation ID. A new conversation retained text typed while the previous submission completed. Focused checks cover A → New → A, scoped recovery, promotion to the server conversation, and consumed-input clearing. |
| Multiple documents and unsaved edits | Three original products and two sources were visible before the explicit working-copy action made a fourth product. Two drafts retained separate UNSAVED A/B text through switches, close/reopen, route return, and reload recovery. Before explicit export, all draft/source/final hashes stayed unchanged. After the loading correction, a clean browser reload showed four products and two sources; all names and the active Launch advice selection fit before Y=944.02 at 1141 × 1006. Root inspected `documents-accepted-1141.jpg`. |
| Source viewing and action target | Issue, chat, map, and rich-editor references reached the named saved source. Exact passages were highlighted when available. Source and draft remained mounted beside each other at 1440 pixels and stacked at 390 with no page overflow or controls outside the viewport. `draft-source-final.jpg` was inspected. Reading the source did not add request context. |
| Finals, working copy, export | Final Business reply was Read-only with contenteditable=false and Save disabled. Explicit source working copy created a separate editable file. Word export with source preview open saved/exported Launch advice at its exact path/revisions and returned 200. The source, other draft and final stayed unchanged. Final inspection found and corrected missing saved-document destinations. Regenerated DOCX XML and PDF text retain both source paths, the correct draft, and the exported local A edit. |
| Narrow layout and keyboard | Understand measured without page overflow at 1440/1024/768/390. Radio Space, map record Enter, and actual Tab → rich-editor source anchor → Enter worked. Wide/narrow source panes were inspected. Hidden visual-map descendants are not counted as visible outline controls. |
| Native 200% | Skipped at the user’s explicit request. The earlier setup-only probe is not a final pass. |

### Checks and limits

- `cd backend && .venv/bin/pytest`: earlier combined run passed 1,172 tests in 470.82 seconds (`final-backend.log`). Later runs passed 1,174 and 1,176 tests respectively, but each failed the same 0.3-second research deadline test under active browser load (`corrected-backend.log`, `final-corrected-backend.log`). Its isolated rerun passed in 0.49 seconds. The timeout was not widened. Per user steering, no further broad rerun is planned.
- `cd frontend && npm run check:workspace-ux`, `npm run check:single-lawyer-workspace`, `npm run check:lawyer-continuity`, and `npm run check:matter-review-decision-map` passed. Logs: `workspace-ux-harness.log`, `single-lawyer.log`, `lawyer-continuity-harness.log`, `new-behavior.log`, `last-frontend-focused.log`. Extracted JSX harness bindings were updated without removing behavior assertions.
- Focused corrections passed: workspace evidence/review 23; priority/scenario 16; indexed read performance 32; chat/scenario prompt 60; canonical mitigation integration 6 plus matter-action 10 and missing-owner/issue guard; output citation preservation 9 plus 8 surrounding cleanup checks; artifact-target evidence 1; frontend preview, chat recovery, map, and claim integration checks. These are bounded correction checks, not claims that every suite ran on the final tree.
- `cd frontend && npm run typecheck`: pass (`frozen-final-typecheck.log`). Production build pass (`frozen-final-build.log`) using `NODE_OPTIONS='--require /Users/bharris/Programs/counsel-os-mvp/output/matter-review-decision-map-acceptance/isolated-build.cjs' npm run build`. The wrapper preserves the real Next configuration and changes only the output directory. The subsequent loading correction also passed typecheck and production build (`load-correction-typecheck.log`, `load-correction-build.log`).
- Research run `RUN-20260905-a9eddc` saved useful partial work but retrieved no new public authority. A saved eCFR definition was available for narrow source inspection. The historical hypothetical answer overstated what definitions prove; root corrected the prompt, preserved the historical text, and did not label its legal conclusion verified. Later live answers correctly limited their statement to the definition and stated the applicability gap. The reference matter's conclusions were not used as legal authority.
- No complete rerun of every historical journey in `docs/ACCEPTANCE_TESTS.md` is claimed. The plan's affected matter, chat, research, decision, document and integrity flows were walked; the repository checks cover the wider regression surface.
- At 19:12 UTC, all 718 repository-vault baseline files and all authoritative files among the 1,026 reference-vault files were unchanged. Only the reference vault's disposable SQLite cache differed. There were no added protected files, and the active-vault pointer hash was unchanged (`protected-final-check.json`).

### Actual routing and ultimate review

Runtime support was checked before dispatch. Root ran `gpt-6-astra` / `low`. Coding workers used `gpt-5.6-sol` / `medium` for contracts, core behavior, complex integration, corrections and independent review; `gpt-5.6-sol` / `low` for bounded presentation; and `gpt-5.6-terra` / `high` for bounded map presentation and wrapping corrections. Terra did not approve architecture or perform final review. Runtime-rejected dispatches are not counted as work performed. An inherited `review_backend` worker also declined a profile assignment before any read or edit because its model did not match; the replacement profile was explicitly dispatched to `gpt-5.6-sol` / `medium`. Workers did not spawn agents. No more than three workers were active. All work used the shared tree and dependency-safe ownership waves, with C6 after C5b.

Fresh Sol medium review found material integration defects and reviewed their corrections. Its final claim-provenance review found no material defect. The last load correction passed a separate read-only Sol review after fixing the shared-response-order race. Root's ultimate review compared the implementation and observed browser evidence against every requirement above. Root reproduced and required repairs for actual render loops, source return, provenance, keyboard links, canonical mitigation, draft target identity, unsent text, narrow overflow, and partial loading. Compilation and worker reports alone were not accepted as usability proof. The user explicitly removed native 200% zoom from this acceptance pass. The loading correction passed independent review and the actual map-return browser check.

Screenshots made with the target `getScreenshot` API are the accepted visible-page captures. Earlier tiled/cropped Playwright captures and pre-integration native screenshots remain attempt/defect evidence, not final layout proof.


### Final loading correction

A late browser map-return check exposed a real all-or-nothing loading defect: one failed optional request discarded successful document/workspace responses. Duplicate required reads also allowed a stale rejection to show a false refresh failure. The first correction exposed a second race during independent review: an older initial snapshot could overwrite a newer direct-action refresh because they used different counters. All required workspace readers now share one response order; file data commits independently; optional failures preserve successful data. The focused integration check covers these exact orders and passes. Fresh Sol medium accepted the final patch without rerunning tests. Root inspected the source and confirmed the clean browser load now displays the saved documents. A subsequent actual map → Back to matter issue → Draft transition retained the same issue and conversation, showed all four products and two sources, and had no workspace refresh warning. The final browser console read returned no errors. No timeout was widened. A fresh Sol medium read-only profile measured a 1.431-second local route with 217 Markdown reads; idle HTTP reads took 1.45–1.54 seconds, and four concurrent reads took 6.04 seconds. The 12.87-second outlier is consistent with queue amplification from the now-removed duplicate reads. No extra application caching or timeout change was added. The worker used a copy of the isolated 76-file matter, made no provider call, and changed no application file.

Explicit final matter reassessment `RUN-20260905-73dba7` changed only workspace.md and its conversation, plus three run/context/inquiry records (`fixture-final-matter-reassessment.json`). Facts, issues, recorded decisions and drafts remained unchanged.


## Final cleanup and remaining limit

- Final `git diff --check` passed. The final loading patch passed `npm run check:matter-review-integration`, `npm run typecheck`, and the isolated production build. No further full backend or aggregate frontend behavior run was made after the user asked to avoid unnecessary tests.
- Stopped only owned frontend 3123 (PID 33705/33719) and backend 8123 (PID 96531). Both ports were confirmed free. Normal frontend 3000 and backend 8000 remained running and served the later read-only design inspection.
- Restored `frontend/next-env.d.ts` and `frontend/tsconfig.json` to their verified pre-task bytes. Their HEAD hashes matched the baseline before restoration. Removed only `.next-decision-map` and `.next-decision-map-build`, both absent from the baseline. Existing dirty files were preserved; no baseline file was deleted.
- `graphify update .` passed after the temporary build trees were removed (`graphify-final-update.log`): 37,196 nodes, 44,035 edges, 6,102 communities. `graph.json` and `GRAPH_REPORT.md` were updated with AST extraction and no LLM call. HTML visualization was skipped because both full and aggregated graphs exceeded its 5,000-node limit. Some non-code files yielded no nodes; no rerun or semantic-label call was added.
- The isolated vault and reproducible server/build scripts remain in the locations recorded by `environment.json`. The test browser viewport override was reset. The isolated matter tab is retained for continuation, but its test services are stopped.
- **Native 200% zoom is skipped by explicit user instruction.** It is untested, not failed. No Mac unlock is required for this completed acceptance pass.

## Read-only live design follow-up

A separate user task requested inspection of the live Today and reference Matter screens. Root captured them at the actual 1163 × 654 viewport, then restored the reference Matter's original Draft view. No record was saved, no variant was generated, and no design code was changed for this follow-up. The 19:12 protected hash check confirms authoritative files and the active-vault pointer stayed unchanged.

The warm paper palette, serif headings, light borders, and state words follow the design language. Today still uses tall cards for long saved questions, so only one of three attention items fits in this short viewport. The reference Matter's existing active-work banner uses substantial vertical space and crowds its long title/status. Its saved answer is a narrow jurisdiction discussion; styling cannot make that content a complete launch answer. Its legal conclusions were not endorsed. The next action is below the fold at this short height (orientation ends around Y=961). This read-only observation is separate from the isolated plan demo at 1141/1042 × 1006.

Possible later visual comparisons: compact Today rows; a reading-first Matter with a slim active-work strip; or a desktop issue list beside one review panel. These are suggestions only. The originating task received the screenshots, assessment, and limits. A second explicitly requested in-app pass scrolled Today through its composer, opened a reference issue, used Tab/Enter, switched its map from two local records to 34 whole-matter records, and returned to the same issue/conversation without a refresh warning. No console errors were returned. Its full findings are in `output/matter-review-decision-map-acceptance/live-design-review.md`. The original Draft view was restored and temporary inspection tabs were closed.

All logs, snapshots, and images are under `output/matter-review-decision-map-acceptance/`:

| Capture | Purpose |
| --- | --- |
| `review-accepted-1141.jpg`, `review-accepted-1042.jpg` | Question, cited answer and next action before the fold |
| `documents-accepted-1141.jpg` | Four work products, two sources, names and active selection |
| `chat-final-claim.jpg` | Actual new claim revision and saved exact passage |
| `draft-source-final.jpg` | Source beside preserved draft |
| `map-accepted-390.jpg`, `map-outline-accepted-390.jpg` | Narrow map detail and full keyboard outline |
| `two-dirty-drafts.png` | Separate local draft edits |
| `live-today-design.jpg`, `live-matter-understand-design.jpg`, `live-matter-existing-draft-design.jpg` | Read-only current normal-service design inspection |

## Final export-reference correction and user waiver

The final `graphify update .` passed after the export correction (`output/matter-review-decision-map-acceptance/graphify-export-final-update.log`): 37,209 nodes, 44,060 edges, and 6,106 communities. The AST graph and report were updated without an LLM call. HTML generation remained above the tool’s node limit.

The user explicitly chose to skip native 200% zoom and requested only remaining
final checks. No broad suite or frontend build was repeated for this backend-only
correction.

Inspection of the actual prior browser export found that Word retained the two
link labels but omitted their saved-document destinations. The original file is
preserved as `launch-advice-before-reference-fix.docx`; its text/relationship
inspection is in `docx-before-reference-fix.json`.

A bounded `gpt-5.6-sol` / `medium` worker extended the existing export appendix in
`backend/app/services/document_export.py`. Both DOCX and PDF now include
`Document references` with each valid link label and canonical saved vault path,
including a supplied locator fragment. These are readable references, not
clickable external/file hyperlinks or verified legal support. Unsafe, missing,
outside-vault and code-literal targets are omitted. Optional lookup errors retain
useful output. Accepted-text exports exclude pending references.

Fail-before: one targeted regression failed. Final command from `backend`:

```bash
.venv/bin/pytest -q tests/test_claim_export.py tests/test_workspace_drafting.py::test_accepted_export_sources_follow_accepted_citations_only
```

Result: **12 passed in 0.25 seconds**. Python compilation and whitespace checks
passed. The independent Sol medium reviewer accepted the exact patch without
rerunning tests. Root reviewed the helper and generated both formats from the
actual isolated fixture at the original exact body and review revisions.

Root inspected DOCX XML (including tracked insertion runs) and normalized PDF
text. Both contain Launch advice, `UNSAVED A: Keep the audience review open.`,
neither contains the other document's B edit, and both contain the full saved
paths to product-spec.md and coppa-definitions.md. The initial inspection helper
used paragraph-only Word text and literal PDF whitespace; those methods omit
tracked text or split words. The corrected inspection reads Word XML and
normalizes PDF extraction whitespace; this did not require an application change.

Evidence: `docx-content-verification.json`, `launch-advice-verified-markup.docx`,
and `launch-advice-verified-markup.pdf`. All **76** fixture Markdown files are
identical before/after export. Only disposable exports were regenerated. The
briefly restarted isolated backend was stopped; no isolated server is left on
8123. Normal development services and protected reference data were preserved.

Root's final acceptance covers the requested review, issues, citations, map,
hypothetical separation, document/source navigation, unsaved edits, export
references, focused checks, and independent review. Native zoom is intentionally
untested by user instruction. The load-sensitive historical full-suite failure,
partial live research, legacy reference-matter data gaps, and graph visualization
limit remain disclosed; they are not described as successful checks.

## Execution history and ownership amendments

The entries below are chronological history. Earlier pending statements and failed attempts are superseded by the current evidence above.

- C5b corrected recovered local edits: the original base revision remains the mutation basis. A newer saved file produces a conflict and preserves local content. The focused document-reference check passed.
- C2 now stores exact output revisions for current issue claims, preserves unrelated associations and historical inquiry claims, and makes no association change for stale output. Coordinator rerun: `cd backend && .venv/bin/pytest tests/test_answer_contract.py tests/test_workspace_evidence.py -q` — 27 passed in 3.31 seconds.
- C6 owns the additional shared claim renderer, rich-editor link hook, chat publication, and scenario completion/failure seams listed in `output/matter-review-decision-map-acceptance/integration-notes.md`. C6 may run focused checks and typecheck. Full checks, builds, services, browser mutation, and graph output remain coordinator-owned.
- Duplicate fixture facts from the initial seed retry were removed before browser acceptance. The fixture now has two active facts, six issues, three distinct work products (one also has a final version), and two sources.

Final C4 compact-answer correction passed focused checks: long live answers have an explicit full-answer action and do not mount clipped hidden links. C5b review found a stale recovered-edit risk and requested correction before C6: recovered base revisions must not be replaced by current server revisions. C2 has one final association correction for same-ID claim revisions; the coordinator added `claim_output_revisions` to the contract/models and its C4 filter after that owner completed. Earlier evidence remains history.

Additional C2 correction dispatched to fresh `gpt-5.6-sol` / `medium` (`claim_integration_fix`): exact ownership `answer_contract.py`, `workspace_actions.py`, `test_answer_contract.py`, `test_workspace_evidence.py`, after the original C2 owner completed. Root found normal chat had no explicit applicability transport and targeted research did not associate new claims with its issue. The worker will add optional transport with prose/inline fallback and exact issue-ID association; no decisions or dispositions may change. C6 will wait for this correction as well as C5b.

C1 accepted after coordinator source review and rerun: `cd backend && .venv/bin/pytest tests/test_workspace_review.py tests/test_workspace_records.py tests/test_workspace_scenarios.py -q` — 53 passed in 11.62 seconds, one existing Starlette warning. Corrections cover blank reasons, stable retries, historical reference read-back, editor revision agreement, unknown map conditions, and trusted analysis actor.

C4 dispatched to `gpt-5.6-sol` / `medium`; C5 dispatched to `gpt-5.6-terra` / `high`. No nested agents. Coordinator added the optional `selectedNodeDetails` presentation slot to the frozen map props so C6 can render real claim evidence without Terra inventing source paths.

C2 did not edit `backend/app/routers/chat.py`. Its scenario result integration ownership now passes to C6, along with the previously assigned failure handling in `chat_runs.py`.

Coordinator correction ownership after C1 completion: `workspace_review.py` and its focused test. A retry after a later disposition now returns the original result. Editable drafts sort before final versions with the same identity. The runtime rejected a follow-up to the completed C1 worker with an agent-thread-limit error; no model substitution was made. Coordinator rerun: `pytest tests/test_workspace_review.py -q` — 6 passed in 3.05 seconds.

Coordinator correction ownership after C5a completion: `DocumentNavigator.tsx`, `check-document-navigation.ts`, and optional navigator path/revision props in `workspaceTypes.ts`. The picker and current marker now identify the exact selected version. Render/callback check passed. A first edit command used the wrong working-directory prefix and made no edit; the corrected command and check passed.

C4 review corrections requested: explicit disposition open/cancel and frozen revision; actual response options; issue-keyed draft state; done-work label. C4 also owns `OrientationSummary.tsx` now that C3 is complete, for a single source-aware rendered-answer slot.

C5 review corrections requested from Terra: fit actual visible bounds, show selected details before a long outline, and exclude hypothetical/historical/missing edges from active-path helper. Initial C4 and C5 focused coordinator checks passed; these corrections and browser acceptance remain pending.

C5 corrections accepted after source review and coordinator focused rerun. C5b dispatched to `gpt-5.6-sol` / `medium` after C1/C2/C5/C5a acceptance, with only the seven assigned files. C6 has not started.

C4 accepted after the requested corrections and coordinator focused reruns. The final alternate legal-question view also sends `legal_analysis` and offers no fact-request action. Its worker reports all focused checks passing; concurrent C5b editing temporarily prevented a combined typecheck. This is not a completed integration result.

Interim protected-vault hash check: all 718 files in `vault` unchanged. All authoritative files among the 1,026 baseline files in the selected reference vault unchanged; only `.counsel_os_cache.db` differs. The cache is disposable and was not restored over the running development service.

Coordinator owns a further narrow C1 correction in `workspace_scenarios.py` and `test_workspace_review.py`: late failure/run binding updates the original operation but cannot replace a newer scenario result. Focused review/scenario suite: 14 passed in 4.95 seconds. Completed real decisions and facts remain separate.

## Baseline and routing

- September 5, 2026: inspected the dirty tree before dispatch. Existing changes are preserved. File hashes and status are in `output/matter-review-decision-map-acceptance/baseline-files.json` and `baseline-status.txt`.
- Other visible tasks for this repository were idle. Development services were present on ports 3000 and 8000. No other coding worker was dispatched by this coordinator before C0.
- Session runtime confirmed `gpt-6-astra` / `low`. Dispatch supports `gpt-5.6-sol` / `low` and `medium`, and `gpt-5.6-terra` / `high`.
- C0: dispatched Sol medium for contracts. No nested agents. At most three workers. One shared working tree.
- Waves: C0; C1/C2/C3; C4/C5/C5a; C5b; C6; independent C7; C8 evidence; C9 ultimate review. C6 depends on C5b.
- Mutation and browser checks use an isolated vault recorded in `output/matter-review-decision-map-acceptance/environment.json`. The reference matter is not a mutation target.

## Earlier check checkpoint (historical)

- Baseline backend suite: 1,149 passed in 424.42 seconds; one existing Starlette deprecation warning. Exact command: `cd backend && .venv/bin/pytest`. Log: `output/matter-review-decision-map-acceptance/baseline-backend.log`.
- Graph navigation query completed. No graph update or production build has run yet.
- Browser demo, live source applicability, focused behavior checks, combined checks, and independent review: pending.

## Earlier limits (historical)

No completed behavior or usability result is claimed yet. No sources or legal conclusions from the reference matter are treated as verified authority.

## Accepted contracts and active ownership

C0 accepted after contract and type inspection. Worker reported 29 focused backend passes, model probes, Python compile, and frontend typecheck. These prove contract compatibility only.

- C1 Sol medium: workspace service, new review service, scenario service, workspace router, new review tests.
- C2 Sol medium: answer contract, agent context, workspace actions/evidence, answer/evidence tests.
- C3 Sol low: orientation summary, new work summary, new layout check.

The exact file lists remain those in the plan. C6 will wire `workspace_review` into AppContext after C1 supplies its constructor.

The coordinator owns acceptance files under `output/matter-review-decision-map-acceptance/`. Isolated ports are 3123/8123. The frontend uses `.next-decision-map`; Next added two temporary include entries to `frontend/tsconfig.json`. These generated entries will be removed at cleanup. The normal frontend configuration was not edited.

The initial seed attempt used an incorrect `work_product` attribute and stopped before draft creation. Correcting it to the existing `work_products` service completed the seed. The fixture has duplicate seed facts from that retry; these will be removed before acceptance. This is test preparation, not application evidence.

Baseline screenshot capture was attempted at 1141 × 1006. The in-app capture produced tiled content and reported a viewport near 1152 × 1016. This capture does not establish exact-size visual acceptance.

Ownership amendment: C2 also owns `backend/app/routers/chat.py` for the traced `publish_result` source/claim producer seam. C6 will also own `frontend/components/ChatPanel.tsx`, `frontend/components/MarkdownRichEditor.tsx`, and a new `frontend/components/workspace/ClaimMarkdown.tsx` for shared citation and document-reference rendering. No other owner may edit these files.

C3 accepted after source and callback-test review, with one reporting correction: render checks do not measure pixel layouts. C5a started on the same Sol low worker, limited to its three new navigator/tab/check files.

C2 ownership amendment: `backend/app/agents/runner.py` for actual tool-source passage capture, `backend/app/services/document_export.py` for claim support in export, and new `backend/tests/test_claim_export.py`. The traced losses justify these additions. C2 will return its exact marker syntax for shared renderers.

C5a accepted after a material picker correction. Exact version selection now uses ID/path/revision; duplicate titles show a secondary path. Coordinator reran both presentation checks successfully. Browser layout remains pending.

C2 ownership amendment: `backend/app/services/research.py` for the existing source-marker producer. The effective marker can retain an exact locator as `[source:SOURCE_ID|LOCATOR]`; legacy markers remain readable. The final implementation must preserve known source links when a locator cannot be matched.

## Initial demo tracker (historical; see current results below)

| Steps | Required observation | State |
| --- | --- | --- |
| 1–2 | Compact first screen, three review items, accurate all-issue count at both requested sizes | Pending |
| 3–6 | Complete issue detail, actual supporting passages, unsupported issue research, shared answer and explicit reassessment | Pending |
| 7–11 | Map identities/unknown paths, contextual discussion, mitigation, explicit disposition cancel/save/reload and return | Pending |
| 12 | Hypothetical baseline and result, saved return, explicit fact adoption, unchanged decisions | Pending |
| 13 | Three products/two sources visible on entry, two separate dirty drafts retained through switches | Pending |
| 14–15 | Issue/chat/map/draft references, exact or unavailable passage, immutable finals/sources, selected action target | Pending |
| Layout | 1440/1141/1042/1024/768/390 CSS pixels, keyboard access, native 200% zoom | Pending |
| Combined | Required backend/frontend checks, independent Sol medium review, graph update, protected vault hashes | Pending |

Native Chrome's accessibility state confirmed `Zoom: 200%` during tool setup. This proves the test control is available, not that the final implementation passes. Zoom was restored to 100% after the probe.

C6 ownership amendment: `backend/app/services/chat_runs.py` for the existing scenario-targeted failure/timeout/interruption branches to call `workspace_scenarios.fail_analysis`. C2 and C1 coordinate the existing chat success publication; no new execution pipeline is added.


Browser capture setup correction: a separate native Chrome window now contains only the isolated test matter. Its responsive toolbar reports 1141 × 1006. The native **Capture screenshot** action saved `output/matter-review-decision-map-acceptance/native-baseline-1141.png` at 2282 × 2012 (device-pixel ratio 2). This is a clean capture of the pre-integration page, not final acceptance. The in-app tiled capture will not be used as visual proof. The native screenshot workflow can provide exact-size final evidence.


Root map source review found further presentation defects before combined acceptance: the substring test for `resolved` also matched `unresolved`; hypothetical nodes hid their historical/unknown state; and long labels could outgrow fixed layout bounds. A fresh `gpt-5.6-terra` / `high` worker (`map_state_fix`) owns only `DecisionMap.tsx`, `decisionMapLayout.ts`, and `check-decision-map.ts` for these bounded corrections. It runs alongside C6 with disjoint files. No architecture authority or final review is delegated to Terra.


Root C1 resolver correction: the API previously reported `exact` for repeated locator text and could fall back to a heading when the supplied excerpt was absent. A new isolated regression failed with `exact` instead of `document_only`. The resolver now uses the supplied excerpt first, otherwise the locator, and requires one unique occurrence. Source links remain available. Ownership remains coordinator-only for `workspace_review.py` and `test_workspace_review.py`.

Coordinator rerun after the resolver correction: `cd backend && .venv/bin/pytest tests/test_workspace_review.py -q` — 8 passed in 3.57 seconds; one existing Starlette warning.


C5 map correction accepted after source inspection and coordinator rerun of `node --experimental-strip-types scripts/check-decision-map.ts`. It preserves exact semantic states, full accessible titles, fixed canvas bounds, and the saved conditional edge label in the outline. Terra also reports typecheck passed. Browser usability remains pending.

C5b passage correction dispatched to fresh `gpt-5.6-sol` / `medium` (`reference_passage_fix`) after Terra completed. Only `ReferencePreview.tsx` and `check-document-reference-behavior.ts` are assigned. Required correction: scroll the source reading area to a real matched far-down passage and show the resolver's actual historical path. An earlier third-worker dispatch was rejected with an agent-thread-limit error; no worker ran and no model was substituted on that attempt.


C6 ownership correction: the integrator reported editing `DocumentPanel.tsx` before requesting the path amendment. The hunk passes existing document identities and reference callbacks to `MarkdownRichEditor`. The coordinator retained this required integration hunk after checking ownership: the original C5b owner is complete, and the active correction worker owns only ReferencePreview and its check. C6 now owns only this narrow DocumentPanel hook; recovered edit revisions and frozen mutation targets must remain intact. No concurrent owner collision occurred.


C5b passage correction accepted after coordinator source inspection and rerun of `node --experimental-strip-types scripts/check-document-reference-behavior.ts`. The reading pane is a positioned scroll container; only its scrollTop changes to reach the actual unique mark. The worker also reports typecheck passed. Native browser measurement remains pending. `fixture-before-browser.json` records 35 isolated matter Markdown hashes before acceptance mutations.

Interim integration protection check (`protected-interim-integration.json`): all 718 repository-vault baseline files unchanged; all authoritative files among the 1,026 reference-vault baseline files unchanged, with only disposable `.counsel_os_cache.db` changed. The active-vault pointer hash is unchanged.


Combined backend suite started after C6 declared its backend stable: `cd backend && .venv/bin/pytest > ../output/matter-review-decision-map-acceptance/final-backend.log 2>&1`. The owned isolated backend was restarted on 8123; normal services were not stopped. Live API now returns six issues, six review items, two claims, 17 document entries containing three distinct products and two sources, and a 15-node/15-edge map.

Preliminary integrated browser findings (not final acceptance):

- Required work linked by its own explicit `issue_id` was absent from priority owner/action projection. C6 corrected the issue-detail join; root will correct the C1 priority join after the running full suite completes.
- The saved option condition was initially replaced by “Unknown condition.” C6 corrected it; the browser now shows the actual conditional sentence.
- Issue evidence opens the exact saved Child definition with Retrieved status and a narrow support explanation. Opening the saved source at fractional window.scrollY produced a 422 because the API expects integer `origin.scroll_offset`, while the UI also rendered the cached source. C6 received the reproduced failure for a shared request-boundary correction.
- No canonical fixture facts or decisions were changed during these read-only probes.


Continuation verification: initial combined backend run passed 1,172 tests in 470.82 seconds (`final-backend.log`). Root corrected reverse work-item issue links in review priority and added current-answer claim projection; a regression first failed for each. Latest focused review/evidence suite: 23 passed in 6.26 seconds. A corrected full backend run is now in `corrected-backend.log`.

Fresh Sol medium independent review found eight material defects: scenario reset, work-product preview routing, current-answer claim revisions, map return selection, malformed optional scenario results, unsupported source fallback, conversation continuity, and async source races. C6 and C5b corrected these. A second static pass identified residual shared-ID final/draft matching and active historical conversation continuity; correction remains pending. Browser additionally reproduced current-answer source return staying in Draft mode. No final usability acceptance is claimed.

Required check maintenance: a fresh Sol medium worker owns only `check-transport-preservation.ts` and `check-continuity-integrity.ts` to update extracted JSX fixtures for new component bindings. Existing behavioral assertions must remain. Root's whitespace-tolerant clipboard expression and author-fixture `canEdit: true` are retained.


Further combined checks and corrections:

- Corrected full backend run: 1,174 passed and one timing failure in `test_external_provider_hang_uses_one_total_budget_and_saves_partial_packet` (0.3 second outer deadline) during live browser/model work. Its immediate isolated rerun passed in 0.49 seconds. No test timeout was widened. A final full rerun is in `final-corrected-backend.log` after the performance and prompt amendments.
- Required `check:workspace-ux` and `check:lawyer-continuity` pass; harness logs contain complete output. Typecheck and the full new behavior group pass after root corrections.
- Production build passes using `isolated-build.cjs`, which loads the real Next config and changes only the output directory, retaining normal defaults and checks. A prior serialized-config attempt failed before compilation because serialization omitted the default build-ID function. The first wrapper build exposed wrong evidence field names in the new scenario status; corrected to `available_excerpt`, `source_id`, and path/URL. Final successful output is `production-build-isolated.log`. No normal development output was replaced.
- Independent review residuals were corrected: fast-path references now require document ID, exact path and supplied revision; current conversation is carried and validated; source Back restores prior mode; Understand discussion can collapse without unmounting chat; issue research shows queue/status. Root added a scenario citation-gap check based on uniquely matched claims with actual saved passages, including unsupported-known-claim and ambiguous-revision regressions.
- A fresh Sol medium worker diagnosed repeated full matter tree reads for folder lookup. `_base()` now uses indexed `matter_path()`. Extracted companion discovery skips unrelated Markdown. Historical claim scanning is preserved. Focused suite 32 passed. Document projection improved from 0.217 seconds to 0.030–0.035 seconds on the isolated fixture.

Browser observations and mutations (isolated matter only):

- Current answer evidence opens the exact Child definition and saved source with the right revision. Source Back initially stayed in Draft; assigned and corrected, final retest pending.
- Disposition cancel: before/after hashes for all 35 matter files are identical (`fixture-before-browser.json`, `fixture-after-cancel.json`).
- Explicit shared factual answer appears under both audience and consent issues. Both still show No disposition recorded.
- Live research run `RUN-20260905-a9eddc` completed with partial saved research and no retrieved public source. This is a real external research limitation, not verified legal support.
- Live hypothetical `RUN-20260905-fdeb8a` completed; saved scenario named Adult-only initial launch. Before adoption, canonical facts retained the children-10–12 reported answer and the decision file hash was unchanged. Explicit Adopt selected facts replaced only that selected fact; the scenario then shows Earlier baseline, and its analysis remains historical.
- The live model overstated COPPA applicability using definitions alone and did not supply claim citations. This is not accepted as verified legal analysis. Root tightened the existing scenario prompt to distinguish definitions, duties and applicability, keep specific support gaps, and cite actual passages when available. Useful output is preserved; no verifier or answer gate was added. Nearby chat checks: 60 passed.
- Keyboard Space changed workspace views successfully. A prior in-app viewport override caused unreliable pointer actions; reset to the normal viewport before draft checks.
- Two documents retain separate unsaved edits (`UNSAVED A`, `UNSAVED B`) across switches. `two-dirty-drafts.png` records the view. Source and final checks continue.
- Browser exposed Lexical prefixing vault-relative Markdown links with `https://`; assigned to C6 for actual link and round-trip correction. Source navigator target preservation is also under focused review.

`review-integrated-1141.png` is defect evidence, not final layout acceptance: it shows the earlier permanent discussion rail and a slow-refresh status. Final screenshot set remains pending.


Latest browser corrections: keyboard activation of rich-editor source links now uses the same handler as pointer activation; paragraph Enter is unchanged. Source navigator viewing uses the reference preview and retains the named draft request target. Work-product navigation clears a prior preview and invalidates late source responses. Browser confirmed a draft reference opened the saved source and kept the Launch advice local snapshot with its original body/review revisions. Closing and reopening Launch advice recovered `UNSAVED A`; all three draft files and the final file remain identical to baseline (`fixture-after-draft-switches.json`). Final Business reply is explicitly Read-only, its contenteditable attribute is false, and Save is disabled.

A browser-created mitigation exposed a missed integration: the initial C6 form used the legacy awareness mitigation record, so the issue and map had no linked work. The isolated orphan is `03_Matters/MAT-20260905-bfe1be/mitigations/MIT-20260905-cd7dc8.md`. C6 now has a narrow ownership amendment for a POST work-items route calling the existing MatterService mechanism, its frontend API helper, and focused regression tests. It waited for the running backend suite before editing. The existing awareness feature remains unchanged.

Direct disposition save passed in the browser: consent issue now shows Mitigation in progress, the exact supplied reason, and no linked formal decision. Reload verification is underway.

A later full backend run passed 1,176 tests and again hit the same 0.3-second research timing test during active browser work. The user then asked to avoid unnecessary tests. No further full backend rerun will be made; the focused rerun and the earlier full pass remain the evidence, with this load-sensitive failure disclosed. Root selected an explicit saved answer heading for the compact first-screen preview so a model preamble does not replace its actual answer section; full original text remains available, citations remain intact, and fenced headings cannot select an answer. Focused preview checks pass. A Sol low dispatch for this bounded correction was rejected by the runtime thread limit; root performed it. It is not counted as a successful worker assignment.


## Browser correction checkpoint — September 5, 18:30 UTC

The user asked to avoid unnecessary tests. Broad backend and frontend behavior groups are not being repeated. New defects receive only their focused checks; the production build is repeated only because application code changed after its earlier successful build.

- The real React maximum-update-depth failure was traced to a changing editor snapshot callback. A stable callback fixed it. Newer browser logs are checked by timestamp; old captured errors are not described as fresh failures. Intermediate hot reload briefly exposed a declaration-order error while the composer worker was editing; the frozen file declares its state before use. A clean reload is used for final browser observations.
- Canonical mitigation creation now uses POST `/api/matters/{id}/work-items` and the existing MatterService mechanism. The browser created “Document the adult-only launch controls,” owner Alex Morgan, Required/Open. Both issue and map showed it. Browser Complete changed it to Completed, but the issue retained Mitigation in progress, its exact recorded reason, and no formal decision. The matter remained open. API guards require a valid issue and nonblank owner for mitigation; focused missing/blank/cross-matter cases passed.
- The whole map showed the recorded advertising decision, completed and open work, active and superseded facts, and the hypothetical scenario. The option relationship retained its actual condition and Unknown state. Enter activated map records and evidence. The saved scenario reopened as Earlier baseline / Baseline needs review with its original result.
- Issue and map evidence both opened the exact saved Child definition, Retrieved status, narrow generated support explanation, exact claim/output identities, and public eCFR URL. Saved-source preview highlighted the exact sentence. Back restored Understand, the same issue and its scroll position.
- Explicit Create working copy on Lumen product specification produced a fourth work product with a separate path and editable content. Source remained read-only. Before this action there were three products and two sources. The responsive navigator now places product/source groups alongside each other when space permits. At 1141 × 1006, even four product names and both source names end at document Y=895.57, with the active title and counts visible.
- The draft keyboard probe must follow actual Tab order: formatting toolbar → editor → source anchor → Enter. The first direct locator press focused the editable parent and inserted a normal paragraph break; it was not proof of link activation. After the focus correction, actual Tab reached an A element and Enter opened the source. Both source and editor remained mounted. At 1440 pixels, columns measured 794.66 and 587.36 pixels with no page overflow.
- Word export while source preview was open saved/exported **Launch advice**, including its retained local text, via its exact path/review revisions. Server returned 200 for the DOCX export. This explicit export is the first intentional write to that draft during acceptance; earlier switch/cancel hash comparisons remain valid. The supplied source, other draft and final were not export targets.
- Unsent composer text was initially lost when returning from the map. Corrections now use a matter/conversation key, preserve A → New → A, promote unsent New text to the server conversation, preserve text typed while a run starts, and clear only consumed submissions. Map return links carry a validated conversation. Fresh Sol medium static review accepted these exact transitions; final browser retest is pending.
- Actual model runs `RUN-20260905-fc74d8` and `RUN-20260905-0d78b0` returned useful narrow analysis. The first omitted a machine-readable citation. The second emitted the required source marker, but output cleanup changed its ID to “the internal record.” This is an application defect, not a model research failure. A focused sanitizer correction is under review; no historical transcript is rewritten to claim it was correct.
- Understand layout measurements: 1440/1024/768/390 CSS widths all had no page overflow and no controls outside the viewport. Narrow screens use vertical scrolling. `review-390.png` is visually readable. The map at 390 exposed an outline overflow (document width 558); it is being corrected without hiding records.
- `final-production-build.log` passed before these last browser corrections. `browser-corrections-build.log` records the subsequent build. `graphify-update.log` completed with 55,824 nodes and 89,356 edges; its HTML visualization exceeded its configured node limit. Temporary build trees were included by graph extraction, so graph update will run once more after their removal.
- Protection check: 718 repository-vault baseline files and all authoritative files among 1,026 reference-vault baseline files remain unchanged. Only the disposable cache differs. No added protected-vault file and no active-vault pointer change were found.
- Another user task restored the normal backend on port 8000 (reloader PID 92022) without code/build/vault changes. Its normal services are preserved. Our isolated services remain 3123/8123.

