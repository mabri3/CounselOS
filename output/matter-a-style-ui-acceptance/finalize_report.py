from pathlib import Path
import json,difflib
h=Path('output/matter-a-style-ui-acceptance'); report=Path('docs/matter-a-style-ui.verification.md');old=report.read_text();(h/'verification-history.md').write_text(old)
ledger=json.loads((h/'browser-ledger.json').read_text())
ledger['B21']={'status':'partial','evidence':['navigation-final.json','lower-sections-dom.txt','materials-dom.txt'],'observation':'All five section destinations were opened. Final Enter activation opens the two direct Explore disclosures and leaves Correct a fact closed. Focus lands on the first summary inside Explore. Materials opens its ancestor and own disclosure. Local note and handoff input survived view changes. New chat is covered by the retained callback check; its final browser click was not run.'}
ledger['B23']={'status':'partial','evidence':['mobile-form.png','mobile-evidence.png','mobile-source.png','source-900.png','mobile-final-measurement.json'],'observation':'Earlier 390-pixel issue, evidence, form and source checks had no page overflow. Editor and source stack at 900 pixels. Final normal-answer DOM measurement is 433×938: action top 727.19 and bottom 771.19, after the full qualification. The final 390×844 rerun is NOT RUN: viewport override stopped applying. Latest screenshot is corrupt and excluded. User clarified that phone support is optional and tests should remain proportional.'}
ledger['B24']={'status':'partial','evidence':['navigation-final.json','claim-evidence-dom.txt'],'observation':'Tab, Space, Enter and Escape were exercised on views, section navigation, map selection and source/evidence controls. Evidence Escape returned focus to its source button. Final Enter navigation focuses the Explore summary. This was a focused keyboard check, not an exhaustive accessibility audit. 200% zoom was waived.'}
ledger['B26']={'status':'pass-with-limit','evidence':['protected-final.json','outside-application-scope-final.json','console-final.json','network-errors-final.json','health-final.json'],'observation':'All previously hashed files in both protected vault roots and the active pointer are unchanged. Only disposable cache lock files appeared. Final captured console has no errors or warnings. API errors were the existing outside-counsel packet 422 probe and two intentional isolated 503 failures. Earlier test-service restarts produced connection errors; these are not treated as application regressions. All fixture actions used the isolated mock vault.'}
# Correct compressed wording in earlier notes without changing their claims.
replacements={'measured1280x900':'measured 1280×900','top499.78px':'top 499.78px','sixfullissueentries':'six full issue entries','honestlyunavailable':'honestly unavailable','linked to2 issues':'linked to 2 issues','history1':'history 1','Local6 records and whole34 records':'Local 6 records and whole 34 records','with4changed':'with 4 changed','andmapreferences':'and map references','requestedrevision/locator andusefulmapparent; originalbytesrestored':'requested revision/locator and useful map parent; original bytes restored','validdisabledemptyroster showsNo configuredpeople anddisabledCreate. Settingsbytesrestored. Source-onlyCMP36446707c60b466f24c37139preparedwithoutpriorwork.':'valid disabled empty roster shows No configured people and disabled Create. Settings bytes restored. Source-only CMP36446707c60b466f24c37139 prepared without prior work.','ExplicitfixtureFinalize createdfinal; explicitApprove revealedmanualdelivery. Deliveryconfirmationstatesnothingissent;separatesubmitrevealedClosematter. Addparticipant,manualNewdraft,decisionrationale,materials/research/maintenance retained. Matterleftopen.':'Explicit fixture Finalize created a final version; explicit Approve revealed manual delivery. Delivery confirmation states nothing is sent; separate submit revealed Close matter. Add participant, manual New draft, decision rationale, materials, research and maintenance remain. Matter left open.','Emptymatterisreadable. Acceptance-only503forreuse/handoffreferencesretainedanswer/map/history/forms. Reopeningafterflagclearloadedreferences;oldnoticepersistsuntilreload(C0behavior). No duplicateinquiry ornewretrycontrol. Sourcebytes/settingsrestored.':'Empty matter is readable. Acceptance-only 503 responses for reuse/handoff references retained answer, map, history and forms. Reopening after flag removal loaded references; the old notice persists until reload (C0 behavior). No duplicate inquiry or new retry control. Source bytes and settings restored.'}
for row in ledger.values():
 for a,b in replacements.items():row['observation']=row['observation'].replace(a,b)
(h/'browser-ledger.json').write_text(json.dumps(ledger,indent=2))
checks=json.loads((h/'checks.json').read_text());latest={r['label']:r for r in checks};table='\n'.join(f"| {k} | {'Pass' if r['exit']==0 else '1190 passed; 2 timing failures'} | `{r['log']}` |" for k,r in latest.items())
control=old.split('## Control destinations after leaf implementation\n',1)[1].split('\nThe section index',1)[0]
rows='\n'.join(f"| {k} | {v['status']} | {v['observation']} |" for k,v in ledger.items())
text=f'''# Matter A UI verification

Status: C0–C9 integrated. The desktop UI rebuild is complete. Frontend checks and production build pass. The isolated browser demo covered review, evidence, hypothetical analysis, conversation, drafting, source reading and attached workflows. Remaining browser gaps and backend/export limits are listed below. The user later asked for proportional tests and made phone support optional; no broad suite was repeated after that direction.

## Scope, routing and preservation

Actual models: `gpt-6-astra` low coordinator; `gpt-5.6-terra` high implementers; fresh `gpt-5.6-sol` medium independent reviewer. Three implementation workers at most, no nested workers. Exact C1–C9 paths are in `output/matter-a-style-ui-acceptance/ownership.json`. Baseline source, hashes, status and chunk handoffs are retained there. This was a dirty shared tree; comparisons use C0, not HEAD. All 47 valid source survey images and all 12 final design images were reviewed.

The three views retain mounted content and one ChatPanel. Markdown remains authoritative. Existing request, revision, source, draft, hypothetical and lifecycle behavior is retained. The sole local integration contract adds optional `sectionNavigation?: React.ReactNode` to Understand. No backend behavior, editor internals, global state model or design-token migration was added. `globals.css` and all existing application files outside owned scope match C0. The original Next-generated config files were restored from exact preflight copies.

Final `implementation.diff`, `test-diff.patch`, `control-audit.json`, `state-audit.json` and `outside-application-scope-final.json` record the result. All original leaf callback expressions remain. Intentional additions are latest-answer navigation, map scope controls, opening map discussion, and the native section index. Existing state/effect expressions remain; additions are a latest-answer ref and the section-index memo/callback.

## Control destinations
{control}

The section index uses native buttons. It opens the required ancestors before focus and scroll. Explore opens only its two direct child disclosures. Materials opens the work ancestor and its own disclosure. New navigation uses non-animated scrolling.

## Checks

Paths below are relative to the repository. `checks.json` retains every attempt; this table shows the final result per check.

| Check | Result | Log |
|---|---|---|
{table}

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
{rows}

## Independent review and corrections

Fresh Sol medium reviewed design fidelity, interaction preservation, code/test changes and evidence. Material findings corrected by the exact Terra owner: narrow action visual order, ambiguous narrow draft identity, full revision overflow, overly broad Explore expansion, and forced smooth scrolling. The final narrow layout keeps the complete qualification and Read full answer control. Full text remains reachable. Exact 390-pixel first-screen confirmation remains an evidence limit under the user's reduced mobile/testing scope. The latest independent re-review result is recorded in `independent-review-final.md`.

## Protected data and service cleanup

`protected-final.json`: no changed or missing baseline files in the repository vault or selected Mosaic Relay vault; active-vault pointer unchanged. Only disposable cache lock files appeared. No application file outside owned scope changed. The real reference matter was not used for test actions. Fixture settings and temporarily hidden sources were restored; injected optional failures are off. Final health confirms the temporary vault and mock provider.

Owned frontend 3123 (session 9079) and API 8123 (session 27526) were stopped with Ctrl-C and exited 0. Earlier owned API replacements were stopped during harness work. Browser viewport reset and owned test tab closed. Pre-existing 3000/8000 processes were never stopped by this work; their original PIDs were no longer present at final inspection. Evidence and temporary fixture files remain. No commit, push or deployment.

`graphify update .` exited 0 and updated the graph/report: 63,383 nodes and 103,628 edges. Tool limits: 591 files produced no nodes, graph size prevented HTML visualization, and community labels need a separate semantic refresh. No labeling or graph optimization was run.

## Known limits and historical attempts

The PDF exporter clips a long reference path at the right page edge. Word and PDF carry the correct A document identity and content, with no B draft marker; Word renders cleanly. Backend export code is unchanged. A browser download handle supplied no path, so evidence bytes were fetched from the exact UI-observed export URLs. The existing optional outside-counsel packet probe returned 422. Two intentional 503 responses tested graceful degradation. Earlier service restarts and an initial logging middleware caused transient connection errors; the harness was corrected without production code changes. Final captured browser console is empty.

Full chronological intermediate notes are in `verification-history.md`. They include superseded measurements and failures and must not override this current report. Final testing is deliberately proportional: no exhaustive accessibility audit, no 200% zoom, no final New chat browser click, no repeated upload matrix, and no second full backend run.
'''
report.write_text(text)
p=Path('docs/matter-a-style-ui.handoff-progress.md');s=p.read_text();s=s.replace('Status: C0 accepted; implementation waves in progress.','Status: C0–C9 integrated; focused verification complete with explicit limits. Current result: docs/matter-a-style-ui.verification.md. Entries below preserve chronological execution history.');p.write_text(s+'\n\n## Final checkpoint — 2026-09-05\nC0–C9 accepted. Final frontend typecheck, build and all named aggregates pass. Backend 1190 pass / 2 timing failures; unchanged focused retry 2 pass. Browser ledger records partial mobile, keyboard and New chat coverage under the user’s proportional-testing direction. Fresh Sol review corrections are applied. Graphify update exited 0 with size/label limits. Protected baseline files and active pointer are unchanged. Owned 3123/8123 services stopped, viewport reset and test tab closed. No commit, push or deploy. Read the current verification report before resuming; do not repeat broad checks.\n')
# Regenerate final test patch after the last exact-toggle test correction.
base=json.loads((h/'baseline-test-source.json').read_text());patch=''
for p in sorted(set(base)|{'frontend/scripts/check-matter-a-navigation.ts'}):
 before=base.get(p,'');after=Path(p).read_text() if Path(p).exists() else '';patch+=''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='C0/'+p,tofile='current/'+p))
(h/'test-diff.patch').write_text(patch)
