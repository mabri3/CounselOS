# Review findings

Verdict: **defects prevent readiness** for a controlled user trial. The review is complete. Required checks, independent probes, browser evidence and limits are recorded in verification.md. No repairs were applied.

P1 means a core deliverable, record integrity or required recovery behavior fails. P2 means a material feature requirement fails. IDs stay stable across checkpoints. All findings below are reproduced unless their evidence field says otherwise. Attribution is to current code, not to a named implementer: this checkout had substantial prior changes. AR01 is in inherited research/source infrastructure exposed by this feature.

## AR04 — P1: Saved lawyer edits can be overwritten before composition

- **Location:** [backend/app/services/dossier_request_execution.py:156](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:156)
- **Requirement:** Steps 7 and 11: preserve independent edits; advance expected hashes only after a known own publication.
- **Trigger:** Change canonical dossier text through VaultService while a child is still working, without changing the business-question or fact revision; then let the batch finish. Markdown is the project’s source of truth.
- **Expected and actual:** The new result must be a review revision and the saved lawyer text must remain current. The publisher takes the current dossier hash at line 198 as its expected hash. The writer then applies over the edit. Recommendation changes are also exempted merely because the prior proposal carries this parent ID.
- **Impact:** A background result can remove a saved lawyer condition. 
- **Evidence:** Reproduced by test_AR04_edit_before_writer_is_preserved. The publication says applied and the exact edited dossier is replaced. The actual browser editor path did preserve its edit because another basis revision changed. That passing path does not cover the direct saved-text edit in this probe. Fresh review content is covered separately by AR22.
- **Smallest repair:** Use the parent’s saved expected hashes and original issue/path/fact basis. Check and save under the existing short workspace lock. Pass combined candidate analysis directly to review-only composition. Advance hashes only from matching successful receipts.
- **Regression proof:** Save dossier and recommendation edits before and during writing. Change a fact and issue map. Assert current bytes are unchanged, a labeled review revision contains every new child answer, and replay does not promote stale content.

## AR02 — P1: Writer failure leaves no first dossier but reports readiness

- **Location:** [backend/app/services/dossier_request_execution.py:228](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:228)
- **Requirement:** Steps 6–7 and acceptance: useful saved answers survive writer/limit failures and first-pass status is honest.
- **Trigger:** All three children save useful answers, then the dossier writer raises or the assembled input exceeds the dispatch limit.
- **Expected and actual:** Compose a useful first dossier from saved answers and show the failure. Instead no revision is written. Lines 237–239 discard the writer’s fallback content/warnings; lines 83–85 set first_pass_ready_at even for failed/not_written; line 263 announces ready; lines 448–458 can mark the parent completed.
- **Impact:** The central deliverable is absent and controls can imply completion. Failed publication receipts are skipped by later batch selection, and the UI offers no writer-only retry.
- **Evidence:** Reproduced by test_AR02_failed_writer_still_publishes_saved_answers. The saved live event EVT-20260912-946607 independently records “Selected dossier inputs exceed the model dispatch size limit”. capture() includes repeated recommendations, issue analysis, prior dossier and packets. The live result has no dossier revision.
- **Smallest repair:** Build a bounded, nonduplicated writer input. If writing fails, structurally compose saved full issue analysis and initial answers into a labeled result. Preserve the failure reason. Set readiness only after a real revision; retain a retryable writer/publication state.
- **Regression proof:** Force input overflow, writer error and zero useful packets through the real route. Assert a useful saved result or explicit incomplete state, no false ready message, and a writer-only retry that reuses all child calls.

## AR03 — P1: A short writer output with issue headings loses full conditions

- **Location:** [backend/app/services/dossier_generation_context.py:162](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py:162)
- **Requirement:** Steps 4 and 7: overview writing must not erase detailed conditions, exceptions or checklists.
- **Trigger:** A worker saves a multi-condition answer. The writer returns a short overview with the correct issue headings or markers.
- **Expected and actual:** Full saved analysis must remain in each issue section. retain_issues skips any issue with an existing marker or matching heading, regardless of its content. Full analysis reaches the writer input but disappears from the saved revision.
- **Impact:** The dossier can lose the conditions that made its recommendation useful.
- **Evidence:** Reproduced by test_AR03_writer_headings_cannot_erase_full_analysis with written consent, executed transfer schedule, successful export test and a marketing-use exception. Existing tests inspect helper output or proposed recommendations. The browser fixture writer inserts the desired detail itself.
- **Smallest repair:** Compose full issue sections deterministically from saved issue state. Let the writer supply the overview and connections. Preserve superseded analysis under explicit history.
- **Regression proof:** Use a writer that returns correct headings plus short prose. Assert the actual final dossier and reload retain each condition and its source, after researching another issue and regenerating.

## AR01 — P1: Line-ending changes make valid fetched sources appear corrupt

- **Location:** [backend/app/services/research.py:918](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research.py:918)
- **Requirement:** Steps 5, 11 and live acceptance: durable source snapshots must remain readable; useful output must survive a source failure.
- **Trigger:** Fetch source text with interior CRLF line endings, save it and reload its checkpoint.
- **Expected and actual:** The same source should validate. _save_retrieved_sources hashes text before saving. VaultService.read_markdown uses universal-newline reading (vault.py:51), changing CRLF to LF. ResearchCheckpoints.load:46 rejects the different hash. The failure handler also loads this checkpoint and loses normal best-effort finalization.
- **Impact:** Ordinary fetched pages can fail an entire issue even though their saved bytes did not change. This affected two of the three live workers.
- **Evidence:** Reproduced by test_AR01_crlf_source_is_readable_without_false_corruption. live-source-audit.json identifies the two saved CRLF sources and useful checkpoint prose. Their paths contain source versions, so the author’s shared-source mutation explanation is not supported by these records.
- **Smallest repair:** Use one canonical text representation before hashing and saving, or hash the exact persisted bytes consistently. Reconcile old CRLF snapshots only when their original bytes prove the saved hash. Preserve useful checkpoint text without requiring successful source validation.
- **Regression proof:** Fetch/save/reload LF and CRLF text through the real collection/checkpoint path. Assert stable hashes and retained prose. An actual changed byte and a missing snapshot must still produce an explicit source gap.

## AR05 — P1: Reference catalog exists only as an unused helper

- **Location:** [backend/app/services/dossier_references.py:29](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_references.py:29)
- **Requirement:** Step 8: bind captured records before cleanup; persist exact versions; legacy read-only repair; both chat and document readers.
- **Trigger:** The real saved-only chat writer cites two different saved FACT IDs in one sentence.
- **Expected and actual:** Each reference must get its own readable label, captured record and source record. The route returns bare IDs and an empty source_records array. No production caller invokes build_catalog or supplies the cleaner’s references argument. Both ChatPanel ClaimMarkdown calls (lines 764/769) and ExperimentalChat (line 346) omit message.source_records. Legacy display repair is absent.
- **Impact:** Traceability is not implemented end to end. Passing helper tests and file links do not prove exact record resolution.
- **Evidence:** Reproduced after seeding two synthetic facts: diagnostic-fact-route.log/xml and test_AR05. The first diagnostics run stopped on an empty fixture precondition and is not counted as evidence for this finding. Scoped rg confirms no production build_catalog caller. Browser fixture links are whole-file links, not exact facts.
- **Smallest repair:** Build a scoped catalog from the frozen output basis in the actual preparation/writer/publication paths. Bind before cleanup and save it with the exact output revision and conversation. Pass those records to both renderers. Add read-only legacy repair only where raw IDs still exist.
- **Regression proof:** Through HTTP and both browser screens, cite two facts, five artifacts, a Q reference and two source versions. Reload and click each. Assert exact excerpts/versions and distinct unavailable labels; reject cross-matter and unsafe targets.

## AR06 — P2: All omits accepted candidates outside the first priorities

- **Location:** [backend/app/services/dossier_requests.py:669](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:669)
- **Requirement:** Steps 3 and 6: All N freezes every material issue shown at Start, including accepted generated candidates.
- **Trigger:** The saved setup has an additional candidate outside the first-three/priorities. Submit scope=all and include it in accepted_candidate_keys.
- **Expected and actual:** The candidate must be materialized and scheduled. The implementation materializes only candidates referenced by first_issue_ids or priority issue_ids. accepted_candidate_keys is not used in this decision.
- **Impact:** All N can silently research fewer issues than the lawyer accepted.
- **Evidence:** Reproduced by test_AR06_all_includes_accepted_candidate_outside_first_three. The accepted Tax withholding issue never appears in parent issue rows.
- **Smallest repair:** Validate and materialize the exact accepted candidate set before freezing All. Keep later discoveries separate. Make all validation precede canonical issue mutations.
- **Regression proof:** Choose All with a fourth/fifth candidate outside priorities. Assert the count shown at Start equals persisted scheduled IDs and every candidate is created once; invalid choices must leave issues unchanged.

## AR07 — P2: Children do not use the approved source choices

- **Location:** [backend/app/services/research_runs.py:289](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research_runs.py:289)
- **Requirement:** Steps 3, 5 and 10: save and execute the source scope, public topic and model choices the lawyer confirmed.
- **Trigger:** Submit a new public topic, native search and Firecrawl choice in the real Start payload.
- **Expected and actual:** The child should receive those approved settings. create_managed_child omits native and allow_firecrawl and substitutes hidden focused_topic/overall_topic for public_query. dossier_requests.py:752 excludes model choice fields while children keep preparation-time selections.
- **Impact:** The visible selection and executed request differ. A revised public topic is not the one used by research.
- **Evidence:** Reproduced by test_AR07_public_source_choice_is_the_one_children_receive. The child search_scope records differ from the submitted payload. The actual browser presents editable public topic and native-search controls; it provides no editable per-issue topics.
- **Smallest repair:** Persist and pass the validated final ResearchScope without dropping fields. Derive or expose per-issue public topics from the confirmed topic. Save the selected model identities and use them on resume.
- **Regression proof:** Change every supported source/model field in setup. Inspect actual child briefs, scopes and boundary calls before release and after restart. Assert exclusions and approved public text remain exact.

## AR08 — P2: Retry failed issues skips the failed child

- **Location:** [backend/app/services/dossier_request_execution.py:373](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:373)
- **Requirement:** Steps 6, 10 and 11: failed unfinished work can resume with its remaining allowance.
- **Trigger:** A child has failed with unused budget. Use Retry/Resume for that issue.
- **Expected and actual:** The child should attempt unfinished work within the saved allowance. Resume queues the parent row, but _run_batch treats managed_state=failed as terminal and never launches it.
- **Impact:** Retry can return successfully without doing any recovery work.
- **Evidence:** Reproduced by test_AR08_retry_failed_child_uses_remaining_budget through the real Resume route. Provider worker calls remain zero.
- **Smallest repair:** On explicit retry, move only retryable child state back to the proper resumable stage. Keep saved outputs, pending-call state, call identities and consumed allowances.
- **Regression proof:** Fail one child before its first call and after some evidence. Retry only that issue; assert real additional work, no repeated completed calls and no budget reset.

## AR09 — P2: Malformed optional output discards useful results

- **Location:** [backend/app/services/dossier_requests.py:418](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:418)
- **Requirement:** Steps 3–4: parse entries and optional fields tolerantly; keep useful prose.
- **Trigger:** The model returns useful prose plus issue_map=null, first_issue_ids=7 or date_candidates=false; or one issue has a malformed optional rule_and_support value.
- **Expected and actual:** Keep prose and valid entries with a short warning. The preparation code iterates unchecked non-list values and raises TypeError outside the provider fallback. ResearchIssueUpdate fallback validates the entire entry and discards its valid answer when one optional field is bad.
- **Impact:** A cosmetic schema error can end setup or lose a useful issue answer. raw_preparation_available is set without storing the actual raw reply.
- **Evidence:** Four independent AR09 cases reproduce the TypeErrors and discarded full issue update. See diagnostics.xml/log and models/research_investigation.py:168–175.
- **Smallest repair:** Normalize collection types before iteration and parse optional fields independently. Save the exact raw reply plus useful prose. Keep valid answer fields when another field is invalid.
- **Regression proof:** Mix valid and malformed entries/fields through the real chat and worker route. Assert useful prose and valid issue answers persist and reload, with specific parsing warnings.

## AR10 — P2: Proposed dates accept missing anchors and wrong arithmetic

- **Location:** [backend/app/models/research_investigation.py:112](/Users/bharris/Programs/counsel-os-mvp/backend/app/models/research_investigation.py:112)
- **Requirement:** Step 7 provenance/date cases and section 9: a proposed date needs a supported event/rule and correct calculation basis.
- **Trigger:** A proposed action contains a well-formed due_date, an unresolved anchor_reference_id and a conflicting anchor_date/offset.
- **Expected and actual:** The date must resolve to the captured anchor and match its stated arithmetic, or remain an explicit gap. sanitize_proposed_actions accepts any valid ISO due_date. It computes only when due_date is absent and trusts model-provided anchor_date without resolving a record.
- **Impact:** The UI can display an unsupported date with an apparently recorded basis. Typed preparation date candidates are stored but not passed into issue briefs.
- **Evidence:** Reproduced by test_AR10_date_requires_real_anchor_and_correct_arithmetic: October 1 is accepted despite a missing fact and a November 2 minus seven days basis.
- **Smallest repair:** Resolve event roles and anchor IDs against frozen records, then calculate dates in code. Preserve both business-event and administration dates. Keep unresolved timing as a gap and owner names as suggestions.
- **Regression proof:** Assert correct arithmetic for a real captured event, rejection of missing/mismatched anchors, distinct administrative dates, and no promotion to a recorded commitment.

## AR11 — P2: Repeated Generate during work spends another planning call

- **Location:** [backend/app/services/dossier_requests.py:289](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:289)
- **Requirement:** Sections 5/10 and Step 9: repeated Generate returns the active request instead of duplicate work.
- **Trigger:** Start a request, hold its workers, then send Generate again with a new chat action identity.
- **Expected and actual:** Show the active request. prepare only reuses a matching action identity. It calls the planner and creates another awaiting_choices parent while the original owns the matter.
- **Impact:** The user gets duplicate setup and can spend avoidable planning calls before Start later rejects ownership.
- **Evidence:** Reproduced by test_AR11_repeated_generate_shows_active_parent_without_new_call through /api/chat. Two different request IDs and two planning calls.
- **Smallest repair:** Find and return the active matter request before provider dispatch. Preserve normal same-key conflicts and an explicit later fresh request after completion.
- **Regression proof:** Send repeated Generate with both same and new action keys while work runs. Assert one parent, one preparation call and one child set.

## AR12 — P1: An unknown writer outcome is silently called again on resume

- **Location:** [backend/app/services/dossier_request_execution.py:209](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:209)
- **Requirement:** Step 11: unknown model outcomes do not retry without an explicit choice.
- **Trigger:** The writer call starts and the process ends before useful text is checkpointed. Recreate AppContext and call Resume with retry_unknown=false.
- **Expected and actual:** Persist the in-flight call before dispatch, classify the outcome as unknown, and require a deliberate retry. Only non-empty writer responses are saved. No writer reservation exists, so Resume calls it again.
- **Impact:** An unknown paid call can repeat without the required choice. The UI also always sends retry_unknown=false and has no explicit unknown-call option.
- **Evidence:** Reproduced by test_AR12_unknown_writer_outcome_does_not_retry_without_choice using the actual writer resolver and a fresh AppContext. Existing lifecycle _install changes child resolvers only; its writer_calls assertions can stay zero while the actual writer runs.
- **Smallest repair:** Reserve writer dispatch durably with its input basis and call identity. Reuse known saved responses; expose unknown status and an explicit retry choice. Do not claim exactly-once billing for unknown outcomes.
- **Regression proof:** Interrupt before dispatch, during provider completion, after response save and after publication. Assert actual writer boundary counts, no implicit unknown retry, and exact saved-input reuse.

## AR13 — P2: Saved-material Start blocks the HTTP request

- **Location:** [backend/app/services/dossier_requests.py:834](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:834)
- **Requirement:** Step 9 and setup behavior: Start returns promptly and managed work survives the short request.
- **Trigger:** Choose Use saved material now and hold the writer response.
- **Expected and actual:** Persist the parent, return 202 and run the writer under the parent lifecycle. _start_saved_only awaits generate_dossier directly before returning. It is not registered as active parent work.
- **Impact:** The setup control waits for model completion. Stop/restart do not share the normal managed writer lifecycle.
- **Evidence:** Reproduced by test_AR13_parent_saved_only_start_returns_before_model_finishes. The real HTTP task remains pending until the gate is released.
- **Smallest repair:** Run saved-only writing through the same saved parent coordinator, with zero child research. Keep Stop, waiting, shutdown and response receipts consistent.
- **Regression proof:** Gate the saved-only writer. Assert prompt 202, passive polling, durable Stop, restart response reuse and zero research calls.

## AR14 — P1: Unresearched issues lose their prepared initial answers

- **Location:** [backend/app/services/dossier_generation_context.py:68](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py:68)
- **Requirement:** Steps 3 and 7 and first-pass acceptance: every material issue has an initial answer while the selected issues receive deep research.
- **Trigger:** Prepare initial answers for all issues, research only the selected first issues and compose the first dossier.
- **Expected and actual:** The writer must receive all prepared initial answers. capture() reads current issue analysis and old saved content but never the parent’s initial_answer fields. compact_status omits those answers too.
- **Impact:** The first dossier can show generic “research not complete” text instead of the substantive initial answers already generated. The setup card cannot show those saved answers.
- **Evidence:** Reproduced by test_AR14_unresearched_initial_answers_reach_writer: a sentinel answer for an unselected issue is absent from actual writer input. Browser first pass shows generic placeholders for IP and marketing.
- **Smallest repair:** Pass the frozen parent issue map and initial answers into deterministic issue composition. Retain an honest unresearched status and display the saved initial answer in setup/progress.
- **Regression proof:** Use five distinct issues and distinctive initial answers. Research three and hold the other two. Assert the first saved dossier and both UIs contain those actual remaining answers.

## AR15 — P2: Repeated partial updates discard prior detailed issue state

- **Location:** [backend/app/services/dossier_research.py:101](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_research.py:101)
- **Requirement:** Step 4: a shorter update must not erase current full detail, support or useful history.
- **Trigger:** Save full issue analysis with rule/application, then publish two short updates that omit those optional fields.
- **Expected and actual:** Retain the original detailed state until explicitly superseded, with version history. Each update replaces fields with None/empty arrays and keeps only one prior_analysis_markdown slot. The second short update replaces that slot with the first short answer.
- **Impact:** The current full-analysis projection loses the original detail and rule/application. Old packet paths may remain, but the next writer does not reconstruct their full history.
- **Evidence:** Reproduced by test_AR15_two_short_updates_retain_original_detail_and_fields. The current and prior slots contain only Short answer 2 and Short answer 1.
- **Smallest repair:** Merge omitted fields with prior state and retain explicit analysis versions. Do not treat a brief partial answer as an implicit supersession. Feed the current full record to composition.
- **Regression proof:** Publish a detailed answer followed by two different partial answers. Assert all original conditions/support remain available in the current dossier and prior versions are separately identifiable.

## AR17 — P1: A fourth worker starts after a fixed 30-second wait

- **Location:** [backend/app/services/dossier_request_execution.py:345](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:345)
- **Requirement:** Step 5 and section 8: at most three active workers per matter; ordinary research waits or finishes before managed work.
- **Trigger:** Keep an ordinary research provider call active for more than 30 seconds, then Start three dossier issues.
- **Expected and actual:** Wait for actual ordinary completion. _await_existing_standalone exits after 600 sleeps even when work is still active, and the coordinator launches three more calls.
- **Impact:** The matter runs four investigations at once. The normal serial path and the promised resource limit are broken.
- **Evidence:** test_AR17_no_fourth_worker_after_thirty_seconds used a real ordinary run and real parent coordinator. Four provider entries occurred before the shared gate was released. diagnostics-boundaries.log.
- **Smallest repair:** Wait on actual task completion or an explicit state change, with Stop cancellation and a visible waiting state. Do not proceed merely because a timer expired.
- **Regression proof:** Hold ordinary work beyond 30 seconds. Assert one active provider call until release, then at most three; Stop while waiting must launch none.

## AR18 — P2: Edited priorities never enter worker briefs

- **Location:** [backend/app/services/dossier_requests.py:792](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:792)
- **Requirement:** Steps 3, 5 and 10: accepted or edited priorities must guide the selected issue work.
- **Trigger:** Edit priority text and its reason in setup, then Start.
- **Expected and actual:** The worker should receive the accepted priorities. They are saved in the parent but _issue_question uses only the old issue title and brief. Neither worker inputs nor writer capture includes the edited priority.
- **Impact:** A control that appears to change the work has no effect on the research instructions.
- **Evidence:** test_AR18_priority_edit_is_sent_to_workers asserts a distinctive edited priority is in actual worker input. It is absent. Browser setup did accept an edit.
- **Smallest repair:** Include the accepted priorities, reasons and relevant date/event context in each frozen issue brief. Keep public search text separately scoped.
- **Regression proof:** Edit a priority to a materially different condition. Assert the exact text reaches only the relevant issue briefs and survives restart without restoring the old priority.

## AR19 — P2: Changed priority text is treated as the same Start payload

- **Location:** [backend/app/services/dossier_requests.py:584](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:584)
- **Requirement:** Step 2 and Step 11: same action key with conflicting choices must conflict.
- **Trigger:** Reuse a Start action key but change a priority text or reason while keeping its key and issue mapping.
- **Expected and actual:** Return a conflict. _normalize_choices hashes only the priority key and issue_ids. The altered payload returns 202 as an identical replay.
- **Impact:** A changed lawyer instruction is silently ignored. Saved choices do not match the submitted action.
- **Evidence:** test_AR19_action_reuse_conflicts_on_changed_priority_text reproduces 202 instead of 409 through HTTP.
- **Smallest repair:** Include all meaningful normalized priority fields in the action digest. Retain order for ordered selections. Compare the exact accepted payload.
- **Regression proof:** Replay identical choices successfully; change text, reason, order and scope separately and assert a conflict with no new work.

## AR20 — P2: Coverage counts include internal excerpts and duplicate records

- **Location:** [backend/app/services/dossier_request_execution.py:405](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:405)
- **Requirement:** Section 9 and Steps 4/10: distinguish discovered, retrieved and passage-read external sources from internal facts.
- **Trigger:** A saved packet contains a supplied fact excerpt and repeated copies of one external source.
- **Expected and actual:** Report one distinct external source read. _packet_counts counts every nonempty selected_passages record, regardless of source class or duplicate identity. No discovered count is projected. A failed packet also reports zero even when its checkpoint has retrieved sources.
- **Impact:** Coverage can overstate legal research or hide collected evidence after failure.
- **Evidence:** test_AR20_internal_passage_and_duplicate_records_are_not_external_reads reports 3 reads for one distinct external source plus an internal fact and duplicate. Production capture_local creates supplied selected_passages, so internal inclusion is not hypothetical. Failed live parent rows also show no packet-based evidence.
- **Smallest repair:** Derive coverage from canonical saved evidence identities and source class. Count distinct source/version reads consistently; include discovered/retrieved/read status and saved checkpoint evidence when no packet exists.
- **Regression proof:** Mix two versions, duplicate records, local facts, discovered-only URLs, retrieved text without reads and failed-packet checkpoints. Assert separate honest counts and visible gaps.

## AR21 — P2: Combined references drop a captured source version

- **Location:** [backend/app/services/dossier_request_execution.py:61](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:61)
- **Requirement:** Step 8: each citation resolves to its captured source and version.
- **Trigger:** Two issue answers cite different versions of the same source ID.
- **Expected and actual:** Preserve both versions and resolve each citation to its own record. _combined_source_records deduplicates only by source ID/path/URL and keeps the first record.
- **Impact:** A later answer can resolve to the wrong version or lose its passage evidence.
- **Evidence:** test_AR21_distinct_source_versions_survive_combined_catalog supplies original and changed clauses for one ID. Only the original version survives.
- **Smallest repair:** Use source ID plus captured version/hash and locator where needed. Bind output references to those identities before deduplication and cleanup.
- **Regression proof:** Publish two siblings with different source versions, reload both dossier and chat, and click each reference. Assert the correct version, literal passage and no invented highlight.

## AR22 — P1: Review-only composition omits fresh child findings

- **Location:** [backend/app/services/dossier_request_execution.py:183](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:183)
- **Requirement:** Step 7 and section 8: changed facts preserve current records and produce a useful labeled review result with the new research.
- **Trigger:** Change a fact after Start but before the children finish.
- **Expected and actual:** Pass the saved combined child analysis to review-only composition. The stale branch skips the recommendation save, then generate_dossier captures the current old recommendation. The new combined object is used for source metadata only, not writer content.
- **Impact:** The review revision can omit sibling answers and receive only the one packet selected as latest research. Preserving the current file alone does not deliver the new work.
- **Evidence:** test_AR22_review_revision_includes_fresh_sibling_analysis, narrowed to selected issues, reproduces two of the three selected fresh issue answers absent from actual writer input. One packet is admitted through latest_research; its two siblings are omitted. diagnostic-review-input.log/xml. The browser review path retained the lawyer edit; this test checks the missing candidate content.
- **Smallest repair:** Pass an explicit frozen candidate snapshot to the writer and deterministic issue composer for both normal and stale publication. Keep the old canonical record and label the candidate’s basis.
- **Regression proof:** Give three distinct issue answers, change facts, then publish. Assert current bytes are unchanged and the review revision contains all three new answers with the earlier basis label.

## AR23 — P2: A zero-issue request completes with no dossier

- **Location:** [backend/app/services/dossier_request_execution.py:326](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_request_execution.py:326)
- **Requirement:** Review pass B.3: zero, one, two, three and more issues must behave sensibly; Generate should give useful work or a clear next action.
- **Trigger:** Generate and Start on a matter with no identified issue nodes.
- **Expected and actual:** Produce a useful saved-material first pass or show an explicit incomplete next action. The loop finds no batch and _finalize marks the request completed, with no publication or first dossier.
- **Impact:** An apparently successful Generate does not deliver its requested result.
- **Evidence:** test_AR23_zero_issues_still_produces_a_useful_saved_dossier uses a real empty issue list and chat/Start routes. The completed parent has publications=[]. Controls for one, two and three issues pass.
- **Smallest repair:** Route an empty plan to bounded saved-only composition, retaining the setup answer and any material gaps. Do not mark completion without the requested output.
- **Regression proof:** Start with zero issues and missing optional plan. Assert a useful saved result or explicit next action; retain passing 1/2/3/5 cases.

## AR24 — P2: Generated candidate keys collide across requests

- **Location:** [backend/app/services/workspace.py:412](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/workspace.py:412)
- **Requirement:** Step 3: stable candidate IDs and safe canonical issue creation preserve distinct material issues.
- **Trigger:** Two different requests use the common local candidate key candidate-1 for unrelated issue titles.
- **Expected and actual:** Treat candidate identity as request plus key. Existing_by_key searches all issues without request scope and deterministic IDs exclude request_id. The second title silently resolves to the old unrelated issue.
- **Impact:** A new legal workstream can be mapped onto a different old issue and never be created.
- **Evidence:** test_AR24_generated_candidate_keys_are_local_to_the_request adds Tax withholding then Export classification under different parents. Both map to one ID.
- **Smallest repair:** Namespace model candidate keys by the saved parent/plan identity. Reuse a canonical issue only through a deliberate validated mapping, while repeated application of one parent remains idempotent.
- **Regression proof:** Reuse the same key with distinct titles in two requests and assert two nodes. Retry the original request and assert no duplicate and unchanged lawyer dispositions.

## AR25 — P2: Rejected Start still changes the canonical issue list

- **Location:** [backend/app/services/dossier_requests.py:679](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_requests.py:679)
- **Requirement:** Steps 2–3: validate choices before side effects; rejected/conflicting Start must preserve records.
- **Trigger:** Start with a selected generated candidate and an invalid external source choice, such as an empty public query.
- **Expected and actual:** Reject without mutation. append_generated_issues runs before ResearchScope/public-query/provider/ownership validation. The API returns an error after the issue has already been appended.
- **Impact:** An action that says it failed leaves a new canonical issue. The old plan revision can then prevent a corrected retry.
- **Evidence:** test_AR25_invalid_start_does_not_mutate_issues verifies a rejected Start changes issues_revision.
- **Smallest repair:** Perform all validation and ownership checks before canonical mutations. Save the narrow candidate mapping and parent Start effect under the existing lock with replayable identity.
- **Regression proof:** Reject empty query, changed provider, competing owner and stale sequence. Assert no canonical changes or child records; a corrected retry must create each accepted node once.

## AR26 — P2: A local source read removes the entire formatted source list

- **Location:** [backend/app/services/research.py:966](/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research.py:966)
- **Requirement:** Steps 4/8 and live acceptance: malformed optional source fields must preserve readable references and useful output.
- **Trigger:** The research worker reads a local source through ResearchCollection.capture_local, then formats the result packet sources.
- **Expected and actual:** Show that source and all valid other sources. capture_local (research_collection.py:342) stores title but no source_label. _source_lines indexes source_label directly, raising KeyError. The packet-level fallback replaces the whole source list with one warning.
- **Impact:** The completed vendor packet has useful analysis but no formatted source list, despite saved evidence.
- **Evidence:** test_AR26_local_source_records_do_not_break_the_sources_footer reproduces KeyError source_label using actual local capture. live-source-format-audit.json reproduces the same error from the saved vendor packet; five local records lack the field. This is separate from dossier input overflow.
- **Smallest repair:** Normalize local and external records to the shared evidence shape at capture. Make source formatting tolerant per record, using a supplied title/path label without inventing provenance.
- **Regression proof:** Mix valid external, local and missing-label sources through the real packet path. Assert useful prose and every resolvable source remain visible with honest labels; only the affected unavailable field gets a gap.

## Boundaries that passed

AR16 was a suspected partial-batch omission. Its independent test passed: the two completed children are reused and all three siblings publish. It is not a finding. The 1/2/3-child controls and all four receipt-replay tests with the actual writer resolver also passed. Source and unknown-writer failures are reported specifically, without a blanket recovery-failure claim.
