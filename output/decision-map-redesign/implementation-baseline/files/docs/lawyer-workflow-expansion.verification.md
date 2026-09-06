# Lawyer workflow expansion — verification

Status: Complete. All four areas, shared integration, independent review, material repairs and the connected browser/model story passed. Required checks and normal-build cleanup passed. Two unregistered legacy source-string checks remain failing; see the limits below.

## Scope and evidence

The work order is [the handoff plan](lawyer-workflow-expansion.handoff-plan.md). The coordinator's [execution tracker](lawyer-workflow-expansion.handoff-progress.md) records file leases, model assignments, failed attempts and repair reviews. [Usability evidence](lawyer-workflow-expansion.usability.md) records agent-led inspection; it is not measured human productivity.

All named evidence files below are under `output/lawyer-workflow-expansion-acceptance/`. Tests wrote only to copied temporary vaults. The connected browser application used backend 8117 and frontend 3117, with the exact temporary root in `environment.json`. The configured provider was `openai_compatible` / `deepseek-v4-flash`. Public search was disabled. Its legal analysis used supplied material; this is not evidence of external legal research or verified authority.

## Latest checks

| Check | Result | Evidence |
| --- | --- | --- |
| Full backend | 1,149 passed in 414.17 seconds; one existing Starlette deprecation warning | integrated-backend-final-read-load.log |
| Latest draft routing and partial-save recovery | 123 focused tests passed; independent review accepted | I package result in tracker; test_continuity_recovery.py |
| Frontend typecheck and required groups | Passed on the final return-reconciliation source | final-frontend-return-hint.log |
| Isolated production build | Passed with final return-reconciliation repair | integrated-build-final-return-hint.log |
| SQLite rebuild | 2,233 entries, zero errors; 1,124 authoritative files unchanged; all three team queues identical | integrated-index-rebuild-integrity.json |
| Native 200% browser zoom and keyboard | Passed: factor 2, 720 CSS pixels, no overflow, reduced motion, visible focus, Enter/Escape drawer flow | native-zoom-final.json and native-zoom-final-native-surface.png |
| Protected files | Repository vault and selection pointer unchanged; selected vault differs only in disposable cache | protected-final.json |
| Graph refresh | Passed; 36,553 nodes and 42,715 edges; HTML visualization exceeds installed size limit | final-graphify-update.log |
| Whitespace audit | Passed after current source and report edits | final-diff-check.log |
| Normal build and isolated server cleanup | Passed; client API restored to localhost:8000, no temporary 8117 URL; owned 3117/8117 servers stopped | final-normal-build.log; final-cleanup.json |

The baseline was 1,040 backend passes. Earlier integrated checkpoints were 1,124 passes with three failures, then 1,134 passes, then 1,136, 1,141 and 1,144 passes. These are historical results. Failed attempts remain in their original files. One obsolete source-string frontend assertion was replaced with a production-helper runtime check that verifies full Markdown reference preservation; it was not weakened to suppress a behavior failure.

## Connected configured-model browser story

The Harbor Relay matter is `MAT-20260905-0a2378`. It retains one conversation, `CONV-20260905-9d68db`, throughout the following sequence.

1. Alex returned to useful saved advice and a specific supporting question. Alex and Jordan retained different unsent composer text across switches and reload. The original saved advice has 2,454 characters.
2. The browser prepared editable request wording, copied it exactly, and separately recorded an external request. Preparation alone did not mark it sent. Request `FRQ-0cabb8bc23b74d91b36c28ce` preserves exact reply `RPL-e0c3cafcf8e9b9661d851fd4`, including trailing spaces and line breaks. Sam Patel is the reported speaker; Alex is the entering lawyer. The linked reported fact is `FACT-20260905-233a65`. Retention remained unanswered. See harbor-exact-reply-integrity.json.
3. Reassessment `RUN-20260905-91436f` first failed on a provider tool request but kept useful output. Browser Retry completed the same run with the same actor and conversation, without another fact. See harbor-reassessment-retry-integrity.json.
4. Handoff brief `RUN-20260905-25b836` completed across Alex/Jordan/Alex and restored Alex's form. Handoff `HOF-cf5169d3b58915f55e9d284d` transferred only `WI-20260905-177aed` to Jordan. Jordan reviewed the source and reply, returned written findings through reciprocal `HOF-090130438a1c630ab21eb0a2`, and Alex accepted the return. The matter owner remained Alex. Both lawyers have the same optional specialty.
5. Whole-matter `HOF-c3593b48708688b1c0863892` transferred canonical ownership and participants to Casey, who has no specialty label. The work item stayed Alex. Casey returned the matter through `HOF-c0c12a8a7d5cd1eb7a11791c`; Alex accepted. Exactly four handoffs remain, all accepted, without a duplicate return. See harbor-all-handoffs-returned.json.
6. The browser uploaded v2 and a formatting-only copy as separate source originals. Advice-only comparison `CMP-a4c631a0d478e3b70db97124` froze original assistant message `MSG-20260905-89cd85` before a decision or draft existed. `RUN-20260905-72b948` completed with 5,705 characters. Exact passages show retention changing from 30 to 180 days and customer-only access changing to ticket-gated, logged support access. The result has no structured affected-work findings; useful prose remains available with that limit. Original advice, v1 sources and request were unchanged. See harbor-advice-impact-integrity.json.
7. Formatting comparison `CMP-ecb96d62152393e78ce91e87` was prepared through the 390-pixel UI. It correctly reports whitespace-only changes without claiming legal equivalence. Alex's explicit Mark seen changed only Alex's cursor; Jordan remained on first visit and shared content freshness did not change.
8. An explicit new-draft request returned useful complete wording but no artifact because structured draft intent incorrectly routed to the intake agent. After repair, retry of completed `RUN-20260905-52fc2c` saved `WP-7a72aa55b2ed` through the existing work-product service without another model run. The full original response stayed in the conversation. See journey-recover-saved-draft.json and harbor-recovered-drafts.json.
9. The lawyer directly saved a cleaned version 1 working baseline and an exact Lawyer note. Comparison `CMP-f5de3e24ed40f4ae1479e17a` froze that edited draft and the original advice. `RUN-20260905-87df1d` kept 5,905 characters of useful analysis with no structured findings. Its explicit Request draft update control produced 62 pending tracked changes in the same draft. The exact lawyer note and earlier review history remain. See harbor-post-proposal-draft-review.json.
10. A separate explicit fact correction clarified that Sam's report remains unverified despite consistency with supplied v2. It created `FACT-20260905-7c76be` and `OFFER-a57b6ad05e23073a7a63`. The browser declined that offer. Draft revision, review revision, all pending changes and history stayed unchanged. See journey-declined-update-retained.json and harbor-declined-offer-integrity.json.

11. On the final build, an attempted stale save returned HTTP 409 and retained local text. Confirmed Reload saved file opened all 62 pending proposal changes. The lawyer accepted three selected retention changes and rejected one title change. Word markup contained tracked edits; accepted-text Word contained none. Both retained the exact Lawyer note and accepted 180-day retention wording. Accepted-text PDF also retained that note. See journey-final-stale-save.json, journey-reload-saved-proposal.json, journey-accept-selected-wording.json, journey-export-selected-versions-recheck.json and harbor-selected-export-integrity.json. The original baseline remains in saved review history.

12. The lawyer completed tracked review, saved the final response, explicitly recorded a hold-launch decision, and finalized the draft. The final artifact is `FINAL-20260905-b8411b`. Finalization saved durably despite a transport timeout. A live approval attempt exposed an old dependency on blank global review settings; the repair now freezes the selected roster actor for approval, delivery, task changes, closure and finalization. Independent review and HTTP/callback tests accepted it.
13. On the repaired build, Alex explicitly approved the response and confirmed the external-delivery record (HTTP 200 each). Today and the matter both showed that required work remained, owned by Alex. Alex completed `WI-20260905-177aed`, then explicitly closed the matter (HTTP 200). Today removed it from active work. Returning showed Closed and retained Alex's unsent note. Sources, original request/advice, final artifact and recorded decision have unchanged hashes; exactly one conversation remains. See journey-final-approval.json, journey-final-delivery-confirmed.json, journey-final-today-required.json, journey-final-explicit-closure.json, journey-final-today-closed.json, journey-final-return-closed.json and harbor-final-lifecycle-integrity.json.

14. Final completion-based browser checks passed at 1440 and 390 pixels, including a same-context away/return visit, saved comparison history and the actual loaded editor. The exact Lawyer note remains in the saved memo. Orientation returned HTTP 200 in about 9 seconds; comparison catalogs returned in about 4.3 seconds. No page errors or horizontal page overflow were found. Native 200% zoom, reduced motion and the keyboard drawer flow passed on the final build without Refresh. See root-final-return-*.json/png, root-final-editor-*.json/png and native-zoom-final.json.

The final Terra High evidence review found no remaining material usability blocker. An earlier return-failure report was retracted: its 4.5-second observation and invalid asynchronous wait did not establish a failed read. The corrected harness waits for the actual orientation, comparison history and editor content. Preserve the earlier captures as failed test attempts, not proof of an application defect.

An ordinary policy matter was also exercised through real HTTP and the configured model. Cedar Desk (`MAT-20260905-329d59`) compared laptop-loan policy versions against saved earlier inquiry advice. `RUN-20260905-34b117` completed as Jordan in `CONV-20260905-95d1c0`; both source originals and the exact selected inquiry remained unchanged (live-cedar-impact-result.json and live-cedar-impact-integrity.json). This is supplementary HTTP/model evidence, not a second full browser journey.

## Acceptance coverage

| ID | Evidence established | Final status |
| --- | --- | --- |
| LC-01 | Today ranking and owner/action derivation; real scoped/whole-matter transitions; required-work-after-delivery runtime test | Passed; delivery, required work, closure and Today return verified |
| LC-02 | Long saved answer, caveat and full wording preserved; status-only fallback; no precise source link invented | Passed through current orientation build |
| LC-03 | Exact UI copy, explicit external record, exact reply and linked reported fact across reload | Passed |
| LC-04 | Live partial reply; deterministic contradiction, ambiguity, stale scope and partial-write retry in test_fact_requests.py | Passed |
| LC-05 | Live same-specialty scoped transfer and reciprocal return; test_workspace_team.py decline, retry and ABA reassignment cases | Passed |
| LC-06 | Live whole-matter transfer/return with canonical participants and unchanged task owner; stale transfer HTTP tests | Passed |
| LC-07 | Live person switch during wording/brief runs and unsent input; trusted actor, removed-person retry, legacy-mode HTTP tests | Passed |
| LC-08 | Live exact versions and frozen prior advice without decision/draft; subsequent draft target; deterministic decision/assumption snapshot preservation | Passed |
| LC-09 | Live formatting-only state; test_change_impact.py missing/extraction/unchanged/stale/partial cases | Passed |
| LC-10 | Live tracked proposal, direct edit, preserved earlier review history and declined offer; deterministic immutable-final checks | Passed; selected Word/PDF exports verified |
| LC-11 | Live same-run provider recovery and completed-draft recovery; deterministic partial-write, schema and duplicate command tests | Passed |
| LC-12 | Pure GET, actor/seen/vault isolation HTTP tests; live per-person Mark seen; actual index rebuild | Passed |
| LC-13 | One connected matter/conversation with configured wording, reassessment, handoff brief, comparison and revision | Passed; selected review/export and closed return verified |
| LC-14 | Four-width goal-led inspection, meaningful repairs, real zoom, keyboard and reduced motion | Passed; final return/editor and native zoom rechecked |

Negative cases use `test_workspace_orientation.py`, `test_fact_requests.py`, `test_workspace_team.py`, `test_change_impact.py`, `test_continuity_identity.py`, `test_continuity_integration.py`, and `test_continuity_recovery.py`. They are deterministic tests, not live provider observations.

## Independent review and model routing

Astra Medium coordinated. Astra High implemented A/I and E serially. Sol Medium implemented B/C/D/H. Terra High implemented F and the final bounded presentation repairs. G began with Sol Low; persistent retry work escalated to authorized Sol Medium. Independent Astra Low reviewed contracts, combined integration and material corrections, and performed goal-led browser inspection. No Sol High or unapproved model substitution was used. Failed worker launches were not counted as delivered packages.

The first five independent findings were repaired and accepted: communication replacing legal advice, failed-run retry, stable comment actor IDs, obsolete accepted Return, and editor GET writing review metadata. Later accepted repairs cover communication completion across person changes, recovery purpose, answer provenance, incoming scope selection, canonical owner refresh, truthful timeout wording, saved comparison reading, prose-only draft update controls, explicit draft routing and partial-save draft recovery. The final editor save/reload repair and delayed-review typing preservation were independently accepted and verified through actual controls and production callback tests. Later reviews accepted trusted lifecycle attribution, reserved-history exclusion, request-local catalog reuse, closed-state priority, contextual panel loading and delayed mutation refresh of the current panel. The final read investigation also removed a duplicate full-page refresh when restoring an already-saved terminal intake run; pending and new run completion still refresh normally. A small context-scoped terminal reconciliation hint prevents repeating that full refresh on return while retaining the exact failed-run retry key. Missing or invalid hints use the normal refresh path.

## Protection and limits

No commit, push, deployment, worktree, reset, clean or stash was used. The large pre-existing dirty/untracked tree is recorded in baseline-status.txt and baseline-files.json. The repository vault has 718 unchanged files. The selected user vault has 1,011 files and only its disposable cache differs. The saved selection pointer is unchanged. No live cache was restored.

The original frontend remains on port 3000. The original backend parent and port 8000 listener disappeared during the long run; the coordinator did not stop them and did not restart an unowned server. Final cleanup stopped only the isolated servers started for this task. The normal frontend build is restored, and port 3000 remains on its original process. Do not claim that both original servers are still running.

Some browser calls timed out after a durable save. Saved work remained available, and exact retry/reload recovered it. The UI now distinguishes a timeout from inability to reach the service. Profiling identified repeated current-file parsing of internal review snapshots and repeated comparison catalog scans. Repairs exclude reserved history from default discovery, share current comparison reads only within one request, and defer unused UI catalogs. Instrumented clone profile times improved; these are not browser latency measurements. Final cold-load and return results are recorded above. The roughly 9-second orientation time is an observed limit of this copied-vault run, not a general performance benchmark. Failed selectors, wrong expected labels, cold-load failures and cropped full-page zoom screenshots are retained and do not count as successful acceptance proof.

Two unregistered legacy source-string scripts were also attempted during the actor repair. `check-matter-brief.ts` still expects the retired literal “Question to resolve”; `check-confirmation-dialogs.ts` rejects the editor's browser discard confirmation. These standalone assertions remain unchanged and fail. They are outside the three required registered groups, which pass; the editor's actual cancel/confirm/reload and input-preservation callbacks are verified.
