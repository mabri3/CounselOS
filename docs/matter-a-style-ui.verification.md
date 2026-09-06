# Matter A UI verification

> Superseded visual status: the initial delivery below did not match the supplied images. The subsequent corrective rebuild and direct live review are documented in [the current visual verification](../output/matter-a-visual-rebuild/verification.md). Treat the remaining content as a historical implementation record, not current visual acceptance.


Status: C0–C9 integrated. The desktop UI rebuild is complete. Frontend checks and production build pass. The isolated browser demo covered review, evidence, hypothetical analysis, conversation, drafting, source reading and attached workflows. Remaining browser gaps and backend/export limits are listed below. The user later asked for proportional tests and made phone support optional; no broad suite was repeated after that direction.

## Scope, routing and preservation

Actual models: `gpt-6-astra` low coordinator; `gpt-5.6-terra` high implementers; fresh `gpt-5.6-sol` medium independent reviewer. Three implementation workers at most, no nested workers. Exact C1–C9 paths are in `output/matter-a-style-ui-acceptance/ownership.json`. Baseline source, hashes, status and chunk handoffs are retained there. This was a dirty shared tree; comparisons use C0, not HEAD. All 47 valid source survey images and all 12 final design images were reviewed.

The three views retain mounted content and one ChatPanel. Markdown remains authoritative. Existing request, revision, source, draft, hypothetical and lifecycle behavior is retained. The sole local integration contract adds optional `sectionNavigation?: React.ReactNode` to Understand. No backend behavior, editor internals, global state model or design-token migration was added. `globals.css` and all existing application files outside owned scope match C0. The original Next-generated config files were restored from exact preflight copies.

Final `implementation.diff`, `test-diff.patch`, `control-audit.json`, `state-audit.json` and `outside-application-scope-final.json` record the result. All original leaf callback expressions remain. Intentional additions are latest-answer navigation, map scope controls, opening map discussion, and the native section index. Existing state/effect expressions remain; additions are a latest-answer ref and the section-index memo/callback.

## Control destinations

| Existing work | Current destination | Preserved boundary |
|---|---|---|
| Answer, qualification, next action, ranked review | Understand orientation and compact review rows | Full text and actual issue IDs |
| Issue claims/questions/options/disposition | Selected issue detail | Revision checks and explicit save/cancel |
| Sources, revisions, cited passages | Reference preview and Evidence drawer | Opening does not include context or select editable target |
| Draft tabs, comments, tracked changes, save/export | Draft document surface | Existing editor and exact document identity |
| History, run status, attachments, composer | One mounted conversation in Discuss | Stored chronological order and separate reset callbacks |
| Files and inquiry context | Files & context drawer | Library destination, open action and explicit inquiry inclusion stay separate |
| Templates and saved defaults | Optional template library/editor | Preview, overrides, reusable save and keep remain distinct |
| Business requests, external records, replies | Business reply panel | Copy is not sent; explicit external-record action |
| Handoff and comparison | Continuity panels | Frozen scope/references, saved history and explicit actions |
| Hypotheticals and actual corrections | Exploration panels | Separate baseline, analysis, adoption and actual fact correction |
| Business flow, prior work, practice notes, watches | Lower exploration/reuse panels | Local drafts and existing save/include actions |
| Research/recommendations/review packets | Work and records panels; existing shared routes | All states and actions retained |
| Local/whole map, outline and selected detail | Separate map route | Full IDs/edges and one route conversation |


The section index uses native buttons. It opens the required ancestors before focus and scroll. Explore opens only its two direct child disclosures. Materials opens the work ancestor and its own disclosure. New navigation uses non-animated scrolling.

## Checks

Paths below are relative to the repository. `checks.json` retains every attempt; this table shows the final result per check.

| Check | Result | Log |
|---|---|---|
| typecheck | Pass | `output/matter-a-style-ui-acceptance/typecheck-20260905-155524.log` |
| single-lawyer | Pass | `output/matter-a-style-ui-acceptance/single-lawyer-20260905-154810.log` |
| review-map | Pass | `output/matter-a-style-ui-acceptance/review-map-20260905-155621.log` |
| workspace-ux | Pass | `output/matter-a-style-ui-acceptance/workspace-ux-20260905-154813.log` |
| continuity | Pass | `output/matter-a-style-ui-acceptance/continuity-20260905-145529.log` |
| accordion | Pass | `output/matter-a-style-ui-acceptance/accordion-20260905-154815.log` |
| matter-a-navigation | Pass | `output/matter-a-style-ui-acceptance/matter-a-navigation-20260905-154815.log` |
| build | Pass | `output/matter-a-style-ui-acceptance/build-20260905-155526.log` |
| backend | 1190 passed; 2 timing failures | `output/matter-a-style-ui-acceptance/backend-20260905-145542.log` |
| backend-focused-retry | Pass | `output/matter-a-style-ui-acceptance/backend-focused-retry.log` |

The full backend run took about 589 seconds: **1190 passed, 2 failed, 1 warning**. Both failures were timing-sensitive research budget cases. The same two tests passed unchanged in a focused retry: **2 passed in 1.16 seconds**, `backend-focused-retry.log`. The full backend suite was not rerun. Frontend final typecheck/build ran after the last application edit. The final review-map retry fixed a test assumption about the old visual position of Show discussion; it preserves the exact existing toggle and hidden-mounted conversation assertions. The separate rendered-slot check covers all three views with discussion open and closed.

Other test updates follow the actual imported CSS modules, current labels and frozen C0 contracts. Missing pre-existing harness bindings were supplied. Identity callbacks, source boundaries, dirty recovery, async targets and revision checks remain asserted. Navigation tests protect direct-child disclosure behavior and non-animated scrolling. No backend test was changed.

## Browser evidence and measurements

Evidence lives in `output/matter-a-style-ui-acceptance/`. All mutations used temporary fixture `MAT-20260905-f025e4` and its empty companion, with mock provider, disabled search and disabled scheduler. No live legal research was performed. Preview generation used the actual run path with generic mock output; it is not presented as substantive legal analysis.

| Surface | Actual size | Observation | Evidence |
|---|---|---|---|
| Desktop orientation | 1280×900 | Next action top 499.78 px, within the 540 px target | `desktop-upper-final.png` |
| Phone form, evidence, source | 390×844 | Readable controls, no page overflow in the exercised states | `mobile-form.png`, `mobile-evidence.png`, `mobile-source.png` |
| Editor/source stack | 900×900 | Editor bottom 684 px; source starts 826 px | `source-900.png` |
| Final narrow orientation | 433×938 | Question → answer → full qualification → action; action 727.19–771.19 px | `mobile-final-measurement.json` (DOM only) |
| Final exact 390×844 orientation | NOT RUN | Browser override ceased applying. No further mobile tooling work after the user's scope clarification | Earlier failures retained for honesty |

Representative desktop captures: `claim-evidence.png`, `conversation.png`, `draft-source.png`, `map-whole-34.png`, `reuse.png`, `research-work.png`. Shared Research and Decisions route captures are also retained. `before-desktop.png` and `mobile-final.png` are corrupt captures and are excluded. The old mobile action-before-answer approach was rejected and removed; its screenshot is historical, not current proof. No claim of universal first-screen fit is made for arbitrary question/qualification lengths.

## Acceptance ledger

`browser-ledger.json` supplies the exact artifact list for each row. Partial rows are not represented as full passes.

| Row | Status | Observation |
|---|---|---|
| B01 | pass | At measured 1280×900, next action top 499.78px; full question/answer/qualification/state/owner visible. Normal reload after work completion. |
| B02 | pass | Long-answer fixture exposes full end marker and both source markers. Short answer and six full issue entries checked. Fixture claims restored to support source links; without them links honestly unavailable. |
| B03 | pass | Audience claim uses CLM-DEMO-CHILD/demo-claim-1/demo-output-1 and literal Child passage; explicit support gap and one shared factual question linked to 2 issues. |
| B04 | pass | Disposition and formal decision forms opened and cancelled. Authoritative fixture hashes unchanged. |
| B05 | pass | Explicit submit records mitigation_in_progress with supplied reason and history 1. No formal decision is linked automatically. |
| B06 | pass | Explicit Complete changed only the linked work-item Markdown. Issue, matter, and decision files were unchanged. |
| B07 | pass | Local 6 records and whole 34 records render. Native outline Enter selects the stable shared-question record; all full labels and Unknown edge conditions are exposed. |
| B08 | pass | Cancel changed no files. One run RUN-20260905-413437 saved explicitly labelled mock hypothetical analysis; actual facts, decisions and drafts remained byte-identical. |
| B09 | pass | Historical scenario is Earlier baseline with 4 changed revisions; explicit adoption remains separate from actual-fact correction. No adoption was submitted. |
| B10 | pass | Back URL retains original issue and CONV-20260905-1a8401. Discuss shows one composer and selected-issue scope/target. A click before initial restore settled was retried after reading the settled UI. |
| B11 | pass | One explicit suggestion created one chat run; pending disabled actions and completed mock result were shown with earlier history retained. |
| B12 | pass | A and B local edits survived switching and source reading. B remains unsaved after explicit A save/export. |
| B13 | pass | Duplicate titles retain distinct full paths; final version is read-only and current draft remains separate. |
| B14 | pass | Answer, issue, editor and map references use evidence/source surfaces. Temporarily absent isolated source shows exact requested revision/locator and useful map parent; original bytes restored. |
| B15 | pass | No Markup was initial mode. One accepted change reduced three changes to two. Existing Alex Morgan comment remained. |
| B16 | pass-with-limit | UI export requests identify saved A and exact content/review revisions. Rendered Word/PDF show A marker, no B marker, and references. PDF long reference path clips at right edge; backend export code unchanged. Tool download handle had no file path; evidence bytes fetched from the exact observed export URLs. |
| B17 | pass | Reusable template fields/version inspected; local tone edit cancelled. Preview completed on real chat-run path while B stayed active and dirty. Closed library without keeping; artifact showed Preview · Not kept. Separate Keep preview click changed it to Saved work product. Deterministic mock fixture output. |
| B18 | pass | Opening file context left sources Available. Explicit Add to next inquiry made only coppa-definitions Selected. Library and inquiry upload actions remain distinct. |
| B19 | pass | Prepared request to Sam Patel. Copy clipboard matched text and did not send anything. Separate Record external request clicked in isolated fixture; no message sent to a person. |
| B20 | pass | Handoff scope/owner/ask/references/history preserved; valid disabled empty roster shows No configured people and disabled Create. Settings bytes restored. Source-only CMP36446707c60b466f24c37139 prepared without prior work. |
| B21 | partial | All five section destinations were opened. Final Enter activation opens the two direct Explore disclosures and leaves Correct a fact closed. Focus lands on the first summary inside Explore. Materials opens its ancestor and own disclosure. Local note and handoff input survived view changes. New chat is covered by the retained callback check; its final browser click was not run. |
| B22 | pass | Explicit fixture Finalize created a final version; explicit Approve revealed manual delivery. Delivery confirmation states nothing is sent; separate submit revealed Close matter. Add participant, manual New draft, decision rationale, materials, research and maintenance remain. Matter left open. |
| B23 | partial | Earlier 390-pixel issue, evidence, form and source checks had no page overflow. Editor and source stack at 900 pixels. Final normal-answer DOM measurement is 433×938: action top 727.19 and bottom 771.19, after the full qualification. The final 390×844 rerun is NOT RUN: viewport override stopped applying. Latest screenshot is corrupt and excluded. User clarified that phone support is optional and tests should remain proportional. |
| B24 | partial | Tab, Space, Enter and Escape were exercised on views, section navigation, map selection and source/evidence controls. Evidence Escape returned focus to its source button. Final Enter navigation focuses the Explore summary. This was a focused keyboard check, not an exhaustive accessibility audit. 200% zoom was waived. |
| B25 | pass | Empty matter is readable. Acceptance-only 503 responses for reuse/handoff references retained answer, map, history and forms. Reopening after flag removal loaded references; the old notice persists until reload (C0 behavior). No duplicate inquiry or new retry control. Source bytes and settings restored. |
| B26 | pass-with-limit | All previously hashed files in both protected vault roots and the active pointer are unchanged. Only disposable cache lock files appeared. Final captured console has no errors or warnings. API errors were the existing outside-counsel packet 422 probe and two intentional isolated 503 failures. Earlier test-service restarts produced connection errors; these are not treated as application regressions. All fixture actions used the isolated mock vault. |

## Independent review and corrections

Fresh Sol medium reviewed design fidelity, interaction preservation, code/test changes and evidence. Material findings corrected by the exact Terra owner: narrow action visual order, ambiguous narrow draft identity, full revision overflow, overly broad Explore expansion, and forced smooth scrolling. The final narrow layout keeps the complete qualification and Read full answer control. Full text remains reachable. Exact 390-pixel first-screen confirmation remains an evidence limit under the user's reduced mobile/testing scope. The latest independent re-review result is recorded in `independent-review-final.md`.

## Protected data and service cleanup

`protected-final.json`: no changed or missing baseline files in the repository vault or selected Mosaic Relay vault; active-vault pointer unchanged. Only disposable cache lock files appeared. No application file outside owned scope changed. The real reference matter was not used for test actions. Fixture settings and temporarily hidden sources were restored; injected optional failures are off. Final health confirms the temporary vault and mock provider.

Owned frontend 3123 (session 9079) and API 8123 (session 27526) were stopped with Ctrl-C and exited 0. Earlier owned API replacements were stopped during harness work. Browser viewport reset and owned test tab closed. Pre-existing 3000/8000 processes were never stopped by this work; their original PIDs were no longer present at final inspection. Evidence and temporary fixture files remain. No commit, push or deployment.

`graphify update .` exited 0 and updated the graph/report: 63,383 nodes and 103,628 edges. Tool limits: 591 files produced no nodes, graph size prevented HTML visualization, and community labels need a separate semantic refresh. No labeling or graph optimization was run.

## Known limits and historical attempts

The PDF exporter clips a long reference path at the right page edge. Word and PDF carry the correct A document identity and content, with no B draft marker; Word renders cleanly. Backend export code is unchanged. A browser download handle supplied no path, so evidence bytes were fetched from the exact UI-observed export URLs. The existing optional outside-counsel packet probe returned 422. Two intentional 503 responses tested graceful degradation. Earlier service restarts and an initial logging middleware caused transient connection errors; the harness was corrected without production code changes. Final captured browser console is empty.

Full chronological intermediate notes are in `verification-history.md`. They include superseded measurements and failures and must not override this current report. Final testing is deliberately proportional: no exhaustive accessibility audit, no 200% zoom, no final New chat browser click, no repeated upload matrix, and no second full backend run.
