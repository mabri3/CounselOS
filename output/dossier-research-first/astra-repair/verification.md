# Research-first dossier repair verification

All 25 material findings have a repair and a passing regression. AR16 remains a passing control. This record describes software verification. It does not claim that a new paid model run passed.

## Source checked

- Repository: `/Users/bharris/Programs/counsel-os-mvp`.
- HEAD: `cbac9f39dffd2ffa24f5ae123e332e929a8df770`.
- The checkout was already modified. [Original copies](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/before) and the [repair-only diff](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/repair.diff) separate these repairs from earlier work.
- [Final backend input snapshot](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/final-validation-snapshot.json) was saved before the full run. No backend source changed during that run.
- The only later source change was source-panel focus handling in `frontend/components/workspace/ClaimMarkdown.tsx`. It passed typecheck, citation checks, the production build and a real browser check.
- [Frontend copy audit](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/frontend-copy-validation.json) verifies matching application source. Next adjusted only its two generated type paths for the owned output directory.

## Final checks

| Check | Command and working directory | Result | Evidence |
|---|---|---|---|
| Full backend | In `/Users/bharris/Programs/counsel-os-mvp/backend`: `.venv/bin/python -m pytest -q --junitxml=../output/dossier-research-first/astra-repair/full-backend-final.xml` | Exit 0. **1,686 passed; 0 failed; 0 skipped.** 830.63 seconds. Six dependency deprecation warnings. | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/full-backend-final.log), [XML](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/full-backend-final.xml) |
| TypeScript | In the owned frontend copy: `npm run typecheck` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/typecheck-focus-final.log) |
| Dossier controls | Same copy: `npm run check:dossier-research` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/frontend-dossier-final.log) |
| Research queue | Same copy: `npm run check:research-queue` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/frontend-queue-final.log) |
| Document references | Same copy: `npm run check:document-reference-behavior` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/frontend-references-final.log) |
| Citation reading | Same copy: `node scripts/check-citation-reading.ts` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/citation-focus-final.log) |
| Production build | Same copy: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8207/api PHASE2_DIST_DIR=.next-astra-repair npm run build` | Exit 0 | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/build-focus-final.log) |
| Graph | In the repository: `graphify update .` | Exit 0. Local syntax-tree update. No semantic model call. | [Log](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/graphify-focus-final.log) |

The owned frontend copy is `/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/frontend-copy`. The current workspace's existing build directories were not used for this production build.

The first repair full suite had 1,679 passes and 3 failures. A 0.3-second timeout test passed unchanged on an isolated rerun and in the final full suite. Two reference tests needed different assertions because output now contains readable artifact links and captured internal record catalogs. The [repair report](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/repairs.md) explains those changes. No test was skipped.

All 36 promoted independent diagnostics passed. The final full suite includes 47 tests in the repair regression file. These include meaningful retained conditions, source failures, date arithmetic, writer interruption, source versions, artifact and message references, and independent lawyer edits. The final receipt check also passed all four interrupted-publication boundaries.

## Browser checks

The browser used an owned marked fixture at `/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-vault`, with backend port 8207 and frontend port 3207. It exercised real application routes, context, parent coordinator, child runs, publication, conversation persistence and UI. Only model, search and fetch boundaries were synthetic. No paid provider was called.

| Flow | Observed result | Evidence |
|---|---|---|
| Generate, edit priorities, All five | Three first workers and two later workers. First dossier appeared before the later workers finished. It retained full research and both pending initial answers despite a deliberately short writer response. | [Setup](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-01-setup.ax.txt), [first dossier](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-02-first-pass.ax.txt), [final dossier](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-06-final-dossier.ax.txt) |
| Captured facts and versions | Two distinct facts opened their own saved text and hashes in both readers. The synthetic original and amended clauses kept distinct versions. Unknown and ambiguous IDs remained unavailable. Real per-issue binding is covered by the backend test. | [Original](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-07-original-version.ax.txt), [amended](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-08-amended-version.ax.txt), [standard fact](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-13-standard-fact.ax.txt), [second fact](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-14-standard-second-fact.ax.txt) |
| Stop, restart, Resume | Same parent and child IDs resumed. A lawyer edit made while research was held remained byte-for-byte unchanged. The new result was a review revision. | [Recovery assertions](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-recovery-verification.json), [lawyer edit](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-11-lawyer-edit.ax.txt) |
| Source panel | Details became visible and took focus. Close returned focus to the exact source button after rendering. Both real chat replies opened captured fact version `7b09754d53b5`. | [Visible panel](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-15-visible-details.png), [focus result](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-18-focus-return.json), [standard chat](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-17-standard-chat-fact.txt), [experimental chat](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-19-experimental-chat-fact.txt) |
| Saved-only generation | One writer call. One review revision. Existing lawyer dossier preserved. Zero new parent, child, planning, research, search or fetch work. | [UI](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-16-standard-saved-only.txt), [hash and count checks](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-scope-verification.json) |
| Preview | One writer call. No new dossier revision. Only conversation records changed. | [UI](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-20-preview.txt), [hash and count checks](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-scope-verification.json) |
| Normal chat | Returned the fixed synthetic answer. Only conversation records changed. Zero dossier or research calls. This proves routing and record behavior, not answer quality. | [UI](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-21-normal-chat.txt), [hash and count checks](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-scope-verification.json) |
| Draft retention | Unsent text survived research updates and reload. Internal composition markers stayed hidden in rendered views. | [Reload](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-05-reloaded.ax.txt), [final reader](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/browser-06-final-dossier.ax.txt) |

## Preservation and cleanup

The [final audit](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/preservation-final.json) checked 11,527 original baseline files. It found 11,493 unchanged files, 34 intended code/test edits, no missing file and no unexpected change. One new repair regression file was added. The original tracker and live evaluation dossier remain unchanged. The original review evidence was retained and was not edited; it is outside the pre-review hash baseline.

The full test suite has a known side effect on `output/matter-memory-paths/capacity.json`. The original bytes were backed up before each run and restored after each run. The [final restoration record](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/capacity-final-restoration.json) confirms SHA-256 `1e2fd0c7078ea0a8c773b650ff9e87957f58623335f1c2091e36a8a2ff39cc3f`.

Both owned browser tabs are closed. The owned backend and frontend were stopped after their work completed. Ports 8207 and 3207 are free. See [cleanup](/Users/bharris/Programs/counsel-os-mvp/output/dossier-research-first/astra-repair/cleanup.json).

## Remaining evidence limit

The earlier configured-model live run failed. Its artifacts remain unchanged. These repairs address the reproduced code failures, but no new paid quality run was authorized or performed. Legal answer quality and new live acceptance are therefore unverified. No repair or routine software check remains pending.
