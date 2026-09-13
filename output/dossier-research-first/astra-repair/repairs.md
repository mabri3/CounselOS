# Research-first dossier repairs

Status: all 25 material review findings are repaired. Final backend, frontend and browser checks pass.

The user authorized these repairs after the independent review. This report records the current repair state. The original findings, build tracker and logs remain unchanged. AR16 was a passing control, so there are 25 repairs, not 26.

No paid model evaluation, live matter edit, commit, push or deployment was performed. The original configured-model quality failure remains historical evidence. Live model quality acceptance was not repeated.

## Repairs

| Finding | Repair | Proof |
|---|---|---|
| AR01 — Line-ending changes make valid fetched sources appear corrupt | Normalize new source line endings before hashing. Verify old CRLF snapshots against their original bytes. Missing or damaged sources keep a useful saved answer and an honest support warning. | [AR01 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:121); included in the passing full suite. |
| AR02 — Writer failure leaves no first dossier but reports readiness | Publish a deterministic dossier from saved answers when the writer fails or exceeds its input limit. Mark readiness only after a real revision is saved. | [AR02 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:137); included in the passing full suite. |
| AR03 — A short writer output with issue headings loses full conditions | Append complete saved issue answers independently of the writer. A short overview cannot erase rules, conditions, application, gaps or proposed work. | [AR03 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:147); included in the passing full suite. |
| AR04 — Saved lawyer edits can be overwritten before composition | Keep the Start hashes and frozen input basis. Save independent lawyer changes as a separate review revision. Record only proven own writes, and check actual content when replaying a saved revision. | [AR04 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:156); included in the passing full suite. |
| AR05 — Reference catalog exists only as an unused helper | Bind frozen records in real preparation and writer calls. Persist catalogs with outputs and messages. Both chat surfaces and both document readers open captured text and versions. Legacy display uses saved raw IDs and catalogs without rewriting history. | [AR05 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:170); included in the passing full suite. |
| AR06 — All omits accepted candidates outside the first priorities | All includes every accepted candidate, even if it is outside the first priorities. | [AR06 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:191); included in the passing full suite. |
| AR07 — Children do not use the approved source choices | Carry the approved public query, search method, provider choices, fallbacks and model selections into each child. | [AR07 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:205); included in the passing full suite. |
| AR08 — Retry failed issues skips the failed child | Explicit retry moves the selected failed child back to a resumable state. Keep its identity, saved calls and remaining budget. | [AR08 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:220); included in the passing full suite. |
| AR09 — Malformed optional output discards useful results | Validate optional plan lists and issue fields separately. Keep useful prose and valid fields when another optional field is malformed. | [AR09 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:235); included in the passing full suite. |
| AR10 — Proposed dates accept missing anchors and wrong arithmetic | Resolve proposed date arithmetic from frozen facts or literal saved passages. An unproved model date stays unresolved. Do not create commitments. | [AR10 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:249); included in the passing full suite. |
| AR11 — Repeated Generate during work spends another planning call | Return the active parent for repeated Generate. Do not spend another planning call. | [AR11 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:256); included in the passing full suite. |
| AR12 — An unknown writer outcome is silently called again on resume | Save a writer reservation before the call. Reuse saved output. An unknown outcome requires the explicit Retry unknown call choice and states that another charge is possible. | [AR12 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:267); included in the passing full suite. |
| AR13 — Saved-material Start blocks the HTTP request | Run saved-material Start through the background parent coordinator. The HTTP request returns before the writer finishes. | [AR13 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:279); included in the passing full suite. |
| AR14 — Unresearched issues lose their prepared initial answers | Pass all prepared initial answers into composition and show them in setup. Pending issues retain their substantive answers and an honest research state. | [AR14 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:290); included in the passing full suite. |
| AR15 — Repeated partial updates discard prior detailed issue state | Merge omitted fields with prior detail and retain analysis versions. Repeated partial updates cannot silently supersede full saved analysis. | [AR15 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:301); included in the passing full suite. |
| AR17 — A fourth worker starts after a fixed 30-second wait | Wait for actual ordinary-research completion. Never launch a fourth worker after a timer. Show the waiting state and honor Stop. | [AR17 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:330); included in the passing full suite. |
| AR18 — Edited priorities never enter worker briefs | Include accepted priority text, reasons and relevant date leads in frozen private worker briefs. | [AR18 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:348); included in the passing full suite. |
| AR19 — Changed priority text is treated as the same Start payload | Include all meaningful priority edits and ordered choices in the Start action digest. Conflicting action reuse is rejected. | [AR19 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:358); included in the passing full suite. |
| AR20 — Coverage counts include internal excerpts and duplicate records | Count distinct external source/version identities. Separate discovery, retrieval and literal passage reads. Use saved checkpoint evidence when no packet exists. | [AR20 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:367); included in the passing full suite. |
| AR21 — Combined references drop a captured source version | Keep separate captured source versions. Qualify per-issue references through the existing marker locator slot. Ambiguous unqualified references stay unavailable. | [AR21 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:378); included in the passing full suite. |
| AR22 — Review-only composition omits fresh child findings | Build the review candidate from all fresh sibling answers and the frozen initial basis. Keep current advice and dossier bytes intact. | [AR22 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:386); included in the passing full suite. |
| AR23 — A zero-issue request completes with no dossier | Send an empty issue plan through saved-material composition. Completion requires useful saved output. | [AR23 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:407); included in the passing full suite. |
| AR24 — Generated candidate keys collide across requests | Namespace generated candidate keys by request. Replaying one request stays idempotent; a later unrelated request gets a distinct issue. | [AR24 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:443); included in the passing full suite. |
| AR25 — Rejected Start still changes the canonical issue list | Validate all choices and ownership before appending canonical issues. Rejected Start leaves no issue mutation. | [AR25 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:451); included in the passing full suite. |
| AR26 — A local source read removes the entire formatted source list | Give local sources readable labels and make source-list formatting tolerant per record. | [AR26 regression](/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_repairs.py:462); included in the passing full suite. |

AR16 was a passing control in the independent review. It remains covered and was not treated as a defect.

Additional proof covers supported date arithmetic, old CRLF files, missing-source answer delivery, oversized inputs, explicit unknown-writer retry, frozen fact versions, read-only legacy display, two source versions, five selected artifact paths, a saved message, an initial generated question across batches, and a later lawyer edit before replay.

## Test changes that affect prior expectations

- Saved-only Start now returns 202 while writing continues. The test waits for real completion and checks the revision and zero children.
- Writer failure and input overflow now retain useful output. The tests check real saved content or preview content instead of requiring a failed result.
- A proposed date with no actual saved anchor now stays unresolved. A separate positive check proves date arithmetic from a real frozen anchor.
- The orientation test now checks the named link to the exact research artifact. Raw file paths in inline code are converted to usable links.
- The source-library check still requires library evidence on research packets and verifies every published library passage. It now allows dossier catalogs to contain internal facts and issues without treating them as external authority.

## Verification

- Final full backend result: **1,686 passed, 0 failed, 0 skipped** in 830.63 seconds. All 47 tests in the new repair regression file pass. Six dependency deprecation warnings remain. The first full run had 1,679 passes and 3 failures. The timeout passed unchanged in the final suite; the two reference expectations were repaired as described above.
- All 36 preserved review diagnostics passed during repair. Subsequent focused runs verified added repairs and surrounding behavior. The final receipt check passed all 7 tests, including the four publication interruption boundaries.
- Frontend typecheck, dossier controls, research queue, document-reference behavior and citation reading pass. The final production build passes in an owned frontend copy. All application files match current source. Only the two expected Next-generated type paths differ in the copy. The build did not use the user’s existing build directory.
- The graph was updated with the local AST tool. No semantic model call was made.

## Browser evidence

- An isolated owned vault ran real routes, records, coordinator, writer publication and UI. Only model, search and fetch boundaries were synthetic.
- All-five flow: three completed answers produced the first revision while two continued. The revision retained full research despite a deliberately short writer response. It also retained both pending initial answers. The final revision contains five saved answers.
- Experimental reader: two actual saved facts opened different literal text and hashes. Two source versions opened the original and amended literal clauses. Ambiguous and missing IDs remained distinct and unavailable.
- Stop, backend restart and Resume preserved all child IDs. A lawyer edit saved during held research stayed byte-for-byte unchanged; the new research was saved as a review revision.
- The standard source reader now renders dossier references. Both fact references opened their own saved text and hashes.
- Unsent chat text survived progress updates and reload. Internal composition markers stay hidden in rendered views.
- The source panel scrolls into view and takes keyboard focus. Closing it returns focus to the correct source button after rendering.
- Standard saved-only generation produced exactly one review revision and used one writer call. It preserved the earlier lawyer edit. Planning, research, search and fetch call counts did not increase.
- Experimental preview used one writer call and changed only conversation records. It created no dossier revision. Normal chat returned the fixed test-provider answer and also changed only conversation records. It started no dossier or research work.
- Both chat replies opened the actual captured launch fact with saved version `7b09754d53b5`. Browser observations and hash/count checks are saved in this directory. The two-version clause artifact is a synthetic UI fixture; a separate backend regression proves real per-issue version binding.

## Preservation

The repair baseline, original source copies and repair-only diff are saved here. The final audit checked all 11,527 files in the original review baseline: 11,493 were unchanged, 34 had intended code/test repairs, and none were missing. One new regression file was added. No unexpected baseline file changed.

The active-vault pointer, original live evaluation dossier, original build tracker and restored capacity output match their original hashes. The known test overwrite of `output/matter-memory-paths/capacity.json` was restored byte-for-byte after each full run. Original review evidence was not edited.

Both owned browser tabs are closed. Both owned servers stopped. Test ports 8207 and 3207 are free. No repair-owned process remains.

The software checks prove these code paths and state rules. They do not prove the quality of a new paid research run or legal correctness.

## Evidence files

- [Verification record](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/verification.md)
- [Final backend log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/full-backend-final.log)
- [Full test results](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/full-backend-final.xml)
- [Final frontend build](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/build-focus-final.log)
- [Browser scope checks](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-scope-verification.json)
- [Browser recovery checks](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-recovery-verification.json)
- [Final preservation audit](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/preservation-final.json)
- [Repair-only diff](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/repair.diff)
- [Final checkpoint](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/progress.md)
