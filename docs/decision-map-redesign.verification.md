# Decision map redesign verification

Date: 2026-09-05 (local). Implementation, review, verification and cleanup complete.

## Result

Normal inquiry and issue-targeted research now save optional issue analysis beside useful prose. The map derives tests, conditions and options from the exact current output. The issue review shows the same analysis. Preview does not record a decision. The existing decision form writes the lawyer's wording beside an exact server-validated analysis/option basis.

Markdown remains authoritative. No database schema, rule engine, model-on-load action, decision approval gate, or second conversation was added. No commit, push, PR or deployment was made.

## Routing

| Chunk | Actual model | Effort |
| --- | --- | --- |
| C0, C5 and coordination | Calling Codex agent | Inherited |
| C1 generation | gpt-5.6-sol | high |
| C2 projection and decisions | gpt-5.6-sol | high |
| C3 graph and responsive corrections | gpt-5.6-terra | high |
| C4 issue/form | gpt-5.6-sol | medium |
| C6 fresh read-only review | gpt-5.6-sol | medium |

The user clarified “Xai meant extra-high ignore it.” No xAI provider or extra-high pool was used. Earlier Luna research was reused, not repeated.

## Evidence and acceptance

Evidence directory: `output/decision-map-redesign/acceptance/`.

| Gate | Observed result | Evidence |
| --- | --- | --- |
| Real publication | Actual UI Analyze paths → existing inquiry runner → parsing → saved output/pointer → three derived options and Unknown. Research also passes through its real runner/publication with only provider doubled. | `ui-paths.json`, `ui-published-map.json`, `publication-integration.log`, `backend/tests/test_decision_map_generation_integration.py` |
| Useful failure | Malformed structure preserves prose/prior analysis in focused backend checks. Failed optional scenario/reuse requests preserve the map in browser. Missing source support stays labelled; exact support opens when available. | `c1-focused.log`, `ui-readability.json`, `source-proof.json` |
| Stable semantics | Child selection retains the focused issue and sibling identities. Unknown chooses no path. Current, historical, hypothetical and recorded groups remain distinct. Determinate route requirements activate only matching paths; all/any and unknown behavior have regressions. | `ui-paths.json`, `ui-c6-routes.json`, focused map scripts, `ui-readability.json` |
| Explicit decision | Preview/cancel create no decision. Final save records edited wording and exact option revision. Backend tests cover same-key replay, changed-payload conflict, missing original output on replay and explicit historical acceptance. | `ui-recorded-decision.json`, `ui-paths.json`, `c2-collision-focused.log`, `frontend-focused.log` |
| Refresh integrity | Actual fact correction marks Needs review. UI update changes the analysis while the old recorded canonical basis stays equal. Late-run/concurrent issue/source changes have focused backend regressions. | `ui-updated-map.json`, `ui-roundtrips.json` (initial failure preserved), `ui-source-scenario.json`, `c1-focused.log` |
| Visual fidelity | White Matter A surfaces, shared serif/sans fonts, semantic state words, three readable lanes, curved links, detail then outline then collapsed conversation. At 1280×900 the first two fork cards fit before y900. Actual content differs from fictional reference art. | `map-c6-routes-1280.png` (final regenerated map), `focused-map-1440.png`, `issue-review-1280.png`, reference06/02 |
| Readability | Keyboard selection, complete outline, clear-selection/reload and width containment at 1440/1024/768/390 pass. Graph pans internally at narrow sizes. Reduced-motion browser preference was enabled. CSS 200% enlargement works. | `ui-readability.json`, `map-width-*.png`, `map-scaled-200.png` |
| Navigation | Exact source passage opens; return retains selected path, same composer DOM identity and unsent text. Existing scenario flow persists hypothetical analysis without changing actual facts/current analysis; return keeps draft text. | `source-proof.json`, `source-preview-1280.png`, `ui-source-scenario.json`, `ui-scenarios.json`, `scenario-1280.png` |
| Product smoke | Today, Workspace, Matters, Decisions, Agents, Skills, Automations, Settings and matter route load HTTP200 with no page errors or horizontal overflow. Related map/issue journeys tested deeply; historical acceptance checklist is not claimed fully rerun. | `route-smoke.json`, `ui-readability.json` |
| Configured model | Synthetic configured-provider inquiry produced one test, one Unknown condition and three useful connected options with public search disabled. | `configured-model-publication-proof.json`, `configured-model-saved-inquiry.md`, `configured-model-analysis.json`, `configured-model-map.json` |

Configured model: `openai_compatible`, `deepseek-v4-flash`, configured default effort. Two earlier attempts retained prose but did not publish valid paths; they exposed a prompt-shape gap and output cleanup that replaced internal fact IDs. Both were corrected and regression tested before the successful run. The existing actual-fact correction also started its normal configured reassessment during browser verification; that run completed in the same isolated vault. Provider evidence proves generation and publication, not legal correctness.

## Material corrections found by verification

- Optional path transport survived parsing but output cleanup changed its IDs. Recognized structured blocks now pass through cleanup unchanged; display hides only valid transport after prose.
- Same prose and claim ID in different output files collided in generic source lookup. Map and issue status now load claims from the exact analysis source file. Generic claim rows are deduplicated for stable rendering. The collision regression uses different source support with an identical prose hash.
- Graph labels overlapped cards and the first fork was below the desktop fold. Measured layout, compact context, wider connector channels and focused headers corrected this. Full relationship wording remains in the outline.
- At 390px the route title/nav overflowed. Narrow containers now shrink/wrap and the graph keeps its own pan area.
- Existing source-string tests had stale expectations for the document navigation's accessible name and whitespace. The unchanged baseline components were checked; tests now assert accessible identity, active state and the same callback behavior.
- The research API test double did not accept the newly forwarded issue ID. It now tests both absent and present targets.
- C6 found contradictory conditional edges, omitted queued research inputs, and same-length draft identity collisions. The original workers fixed each defect and added focused regressions. The fresh reviewer accepted all three fixes.

## Checks

- First required full backend run: **1,215 passed, 1 failed**, 520.86s. The failure was the research test-double signature above. Its complete11-test file passed after correction.
- Source-collision correction: **42 focused backend tests passed**, including one added regression.
- Second full backend run: **1,218 passed**, 500.13s (`backend-final.log`). This includes the source-collision correction and repaired research test. It predates the C6 material corrections; the final run below includes them.
- C6 generation/research and real publication integration: **66 passed** (`c6-generation-focused.log`).
- C6 projection/decision correction: **43 passed** (`c6-projection-focused.log`).
- Final full backend run on corrected code: **1,222 passed**, 643.61s (`backend-c6-final.log`).
- Frontend typecheck after restoring the original generated paths: passed (`frontend-final-typecheck.log`).
- Map aggregate and both new focused scripts: passed (`frontend-focused.log`).
- `npm run build`: passed on final code (`frontend-final-build.log`). Build output was isolated from the user's live `.next` directory through a process-only config wrapper. Initial wrapper attempts failed before compilation because serialized config lost function fields; no application config workaround was retained.
- Fresh C6 review and material recheck: passed. All three findings resolved. Coordinator then found and accepted a narrow current-order/label correction from C3. The final screenshot and browser geometry check show no overlapping label boxes (`ui-c6-routes.json`).
- Final graph update: passed (`graphify-after-visual-fix.log`), 78,265 nodes and 136,643 edges. Two calls were made: the last screenshot exposed a visual defect after the first call had started, so the second refreshed the corrected files. This departs from the planned single call. Graph HTML was skipped because both raw and aggregated graphs exceed the 5,000-node limit. The tool reported 806 files with no extracted nodes and retained/relabelled community names; no paid semantic-label run was made.
- Protected-file and cleanup audit: passed. Owned acceptance servers stopped, original servers retained, generated Next type paths restored byte-for-byte and owned build directories removed.

Existing warnings: Starlette/httpx deprecation and Node module-type detection in standalone scripts.

## Limits

Native 200% browser zoom could not be verified. CUA exposed only the in-app browser; Chrome was unavailable and zoom shortcuts provided no verifiable zoom state. CSS enlargement and responsive checks are separate evidence, not a substitute claim. The temporary CUA tab was reset and closed.

Some early screenshots and logs intentionally show failures. `configured-model-result.json` predates C2 projection; the saved-inquiry proof links the exact original run to the resolver output. `ui-roundtrips.json` is a superseded partial run: fact correction and update passed, then the source collision failed. Clean `ui-source-scenario.json` and `source-proof.json` replace its source/return/scenario evidence. Use the final named evidence above. No source verification or legal-answer accuracy is implied beyond supplied/exact passage labels.

## Preservation

All mutation tests used the isolated synthetic vault recorded in `environment.json`, with six input issues, shared facts/question, two initial sources, three work products and one legacy decision. No structured analysis or option metadata was seeded. The source proof also used a normal uploaded synthetic contract.

Captured dirty-tree baseline: `output/decision-map-redesign/implementation-baseline/`. Incremental review uses that baseline, not HEAD. Unrelated pre-existing changes and concurrent Phase2 planning files remain intact. Original backend 8000/frontend 3000 services were not stopped. Only owned backend 8137/frontend 3137 acceptance processes are eligible for cleanup. Temporary generated Next type paths were restored after the owned frontend stopped. `cleanup.json` and `protected-after.json` record the final state.
