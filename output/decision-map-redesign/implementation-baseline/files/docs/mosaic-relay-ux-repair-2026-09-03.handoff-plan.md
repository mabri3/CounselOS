# Mosaic Relay live-agent UX repair plan — 2026-09-03

## Executive diagnosis

The experiment found useful product behavior, but it also found four connected control defects.

1. Active intake can trap a direct request for research or drafting inside the Intake Agent. This blocks useful work and caused the missing R9 research packet.
2. Intake recovery can ask an answered timing question again. It can then replace usable controls with a generic recovery notice.
3. Research has no normal stop or retry path. A matter can also close while research is still active. This creates a record-integrity conflict.
4. Work-product actions and records can disagree. Historical cards can show duplicate finalization controls. A revised draft keeps an old title. A recommendation in a draft can exist without a separate recommendation record.

The product still delivered a useful foothold in most runs. Five runs reached Ready to send or Closed. Other runs saved useful intake, research, or draft work. The repair must preserve this best-effort behavior.

No P0 issue is supported. The highest-priority work is P1 record integrity, routing, and action clarity. Public-source failure is not diagnosed as an application defect. The repair covers only graceful-degradation state and controls.

## Scope decision

Implement the P1 items first. Then implement the small P2 recovery and progress changes. Keep the P3 copy and projection cleanup last.

The minimum repair has four parts:

- Route explicit substantive work to the Counsel Copilot even when intake is active. Keep structured intake answers with the Intake Agent.
- Make intake fallback topic-aware and stable. Do not repeat a topic that has a durable answer.
- Add stop, resume, and retry controls for research. Block closure while research is queued or running.
- Make the current canonical work product the only actionable work-product surface. Keep durable recommendation state separate and label it correctly.

Do not add a new workflow engine, verifier agent, queue service, confidence gate, or legal-completeness gate.

## Evidence and method

This diagnosis used the normalized ten-run evidence and the saved test-only vault `Mosaic Relay UX Experiment 2026-09-03`. The saved request, conversation, work-product, work-item, dossier, recommendation, research-run, and lifecycle records were read directly. No raw experiment record was changed.

Before each issue group, `graphify query` was used. Relevant source and tests were then inspected directly. The diagnosis did not use actor access to source code during the experiment. It did not rerun any experiment.

Frequency uses ten completed experiment runs as the denominator. A frequency such as 2/10 means that the exact symptom was visible in two runs. It does not mean that only two code paths can reach the defect.

## Working behavior to preserve

- Original request text was kept exactly in the matter record.
- Intake usually produced useful facts, issues, assumptions, and ordered questions.
- Best-effort legal analysis remained useful when public research was partial or unavailable.
- Recommendations stayed separate from recorded decisions.
- Manual delivery was clearly an outside-the-app action.
- Saved, sent, and closed states were normally visible.
- Partial public research was saved instead of being discarded.
- R10 showed that a lawyer can finish a draft while background research remains incomplete. Research must not become a legal-answer gate.

## Repair backlog

### MOS-UX-01 — Answered intake topics repeat and recovery controls disappear

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R2 and R9; Senior Product Counsel; Intake and orientation.
- **Frequency:** Exact restore notice in 2/10 runs. Repeated timing fallback is directly present in both saved conversations.
- **Exact evidence:** The UI showed `The next intake question could not be restored automatically. Send a message to continue.` Structured next-question controls disappeared after 14–35 seconds. The R2 record contains a durable answer to `intake-recovery-timing`, followed by the same timing card again. R9 followed the same recovery pattern.
- **Minimal reproduction:** Create an intake matter without `target_date`. Answer the deterministic timing card with `Before a planned launch`. Return an intake-agent reply without a structured question. Let automatic recovery run again.
- **Current behavior:** `_deterministic_intake_question` selects timing whenever `target_date` is empty. `_answered_intake_topics` recognizes only jurisdiction. A categorical timing answer does not fill a date. The React recovery-attempt set is memory-only and can end in the generic notice.
- **Expected behavior:** A durable answer marks its topic answered even when it does not populate a typed date. Recovery returns one stable, still-unanswered question. The last usable question remains visible until it is answered or replaced.
- **Impact:** The lawyer cannot tell whether the answer was saved. Intake appears broken and can loop indefinitely.
- **Workaround:** Use `Finish intake`, or send free text and hope the model supplies a new structured question. This is not reliable.
- **Cause confidence / evidence:** **Confirmed.** `backend/app/agents/runner.py:574-587` checks `target_date` before jurisdiction, while `backend/app/agents/runner.py:634-667` records only a jurisdiction topic. `frontend/components/ChatPanel.tsx:253-285` replaces recovery with the exact generic notice after a repeated attempt key.
- **Verified code areas:** `backend/app/agents/runner.py`; `backend/app/services/matter_records.py`; `backend/app/routers/chat.py`; `frontend/components/ChatPanel.tsx`; `frontend/lib/chatRunLogic.ts`; `backend/tests/test_agents.py`; `backend/tests/test_chat_runs.py`; `frontend/scripts/check-chat-run-recovery.ts`.
- **Detailed implementation approach:** Extend `_answered_intake_topics` with bounded topic markers for timing, actors, business objective, requested output, jurisdiction, and material fact. Use saved `intake_answers.question_id` and the saved card text. Select a deterministic fallback only from unanswered topics. Give a fallback question a stable ID. In the client, keep the last valid active card during recovery. Show a `Retry intake question` control only after the recovery request itself fails. Do not require a free-text message to restore state.
- **Dependencies / risk:** Do this before agent-routing changes so routing tests have stable intake state. Do not use fuzzy legal-topic matching. Keep the topic list limited to deterministic fallback categories.
- **Tests:** Backend unit tests for categorical timing, repeated recovery, stable IDs, and exhausted fallback categories. Chat-run test for a malformed provider reply after a saved answer. Frontend check that a valid prior card remains and retry is explicit.
- **Visible acceptance:** After `Before a planned launch`, the next visible card asks a different material question. Reloading the matter does not bring timing back. No generic restore notice replaces a usable card.
- **Further diagnosis:** Check whether React remounts caused more than one recovery request for one saved user message. This is not required if the server result and visible card become idempotent.

### MOS-UX-02 — Active intake captures direct research and drafting requests

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R9 directly; likely contributed to R2 and R8; Senior Product Counsel; Intake to Research transition.
- **Frequency:** One exact direct research failure in 10 runs. The routing rule applies to every active-intake matter.
- **Exact evidence:** In R9 the lawyer asked, `Start focused legal research ... Build a saved research packet`. The saved trace used the Intake Agent's tools: reads, searches, and two new work items. It contains no `run_research` operation and no research file. The final reply was only an internal limit sentence.
- **Minimal reproduction:** Keep `intake_state: active`. Enter a free-text request that starts with `Start focused legal research` and requests a saved packet.
- **Current behavior:** The frontend always sends `intake-agent` during active intake. The backend then overrides the requested agent with `intake-agent` again. The Intake Agent has no `run_research` or `save_work_product` tool.
- **Expected behavior:** Structured intake answers, skips, and stops stay with the Intake Agent. An explicit request to research, analyze, draft, or proceed with assumptions uses the Counsel Copilot. Intake may remain open; it must not block useful work.
- **Impact:** A direct user instruction is not performed. Extra work items are created instead. This violates the product rule that clarification is optional help, not a completeness gate.
- **Workaround:** Select `Finish intake`, wait for state refresh, and send the substantive request again.
- **Cause confidence / evidence:** **Confirmed.** `frontend/lib/chatRunLogic.ts:65-68`, `frontend/components/ChatPanel.tsx:307-318`, and `backend/app/routers/chat.py:289-303` force the Intake Agent. The saved R9 operation list matches the Intake Agent allow-list in `backend/app/blank_vault_template/00_System/agents/intake-agent.md`.
- **Verified code areas:** `frontend/lib/chatRunLogic.ts`; `frontend/components/ChatPanel.tsx`; `backend/app/routers/chat.py`; `backend/app/services/chat_runs.py`; both bundled primary-agent Markdown definitions; related chat-run tests and frontend checks.
- **Detailed implementation approach:** Put final routing authority in one backend pure function. Card actions `answer`, `answer_set`, `skip`, and `stop` route to intake. Recovery runs route to intake. Explicit substantive verbs at the start of a free-text instruction route to Counsel Copilot. Include `research`, `analyze`, `draft`, `prepare`, `create a response`, and `proceed/continue with assumptions`. The frontend can send its best choice, but the server remains authoritative. Add one line to the Copilot contract: start the requested typed artifact or research run before optional work-item creation.
- **Dependencies / risk:** Depends on MOS-UX-01 tests. A broad keyword match could misroute an answer such as `Research is not needed`. Use anchored action phrases and card-action state. Unknown text stays with intake.
- **Tests:** Table-driven backend routing tests. End-to-end chat-run test where active intake plus `Start research` yields a `run_research` result and packet queue card. Negative tests for a structured intake answer and `Research is not needed`.
- **Visible acceptance:** With intake still active, send `Start focused legal research and save a packet`. A research run appears immediately. The intake questions remain available for later use.
- **Further diagnosis:** None before implementation. After implementation, inspect whether a substantive turn should share the intake conversation or create a general matter conversation. Keep one conversation for the MVP unless history quality is poor.

### MOS-UX-03 — A compound single-select question loses one answer dimension

- **Classification / priority:** Broken / P2.
- **Affected runs, roles, phases:** R5; Senior Product Counsel; Intake.
- **Frequency:** 1/10 runs.
- **Exact evidence:** The card asked how minors **and** failed matches were handled. It used `selection_mode: single`. Its choices mixed three minors choices with three failed-match choices. The durable answer contains only the selected failed-match choice. No minors answer was saved.
- **Minimal reproduction:** Return one `single` card that asks two independent questions and combines both choice sets. Select one radio choice.
- **Current behavior:** The UI correctly saves one radio value. The provider contract permits a compound question, so the second dimension is silently unanswered.
- **Expected behavior:** One single-select card asks one independently answerable fact. Two dimensions use two cards. Multiple-select is not a substitute when one value is required from each dimension.
- **Impact:** The dossier implies that intake covered the topic, but one requested fact is absent.
- **Workaround:** Type both answers as free text or ask for another intake question.
- **Cause confidence / evidence:** **Confirmed.** The saved R5 card and answer show the schema mismatch. `frontend/components/ChatCards.tsx:262-390` correctly implements radio behavior. The `update_matter_intake` schema has no one-fact rule.
- **Verified code areas:** `backend/app/blank_vault_template/00_System/agents/intake-agent.md`; `backend/app/blank_vault_template/00_System/tools/update_matter_intake.md`; `frontend/components/ChatCards.tsx`; intake schema in `backend/app/models/api.py`.
- **Detailed implementation approach:** Add an explicit contract rule: each `single` question must resolve one fact. Split joined questions before returning them. Add the same description to the tool schema so all providers see it. Do not add a semantic validator or another agent.
- **Dependencies / risk:** Independent. Provider behavior can regress, so keep a fixture-based conformance test.
- **Tests:** Agent-context assertion and fake-provider chat test with separate minors and failed-match cards. Keep the existing multi-answer durability tests.
- **Visible acceptance:** The lawyer sees two short cards. Each answer is visible in intake audit history and in durable facts.
- **Further diagnosis:** None.

### MOS-UX-04 — A matter can close while research is active

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R4 and R6; Senior Product Counsel; Respond and Closed.
- **Frequency:** 2/10 runs.
- **Exact evidence:** Both matters reached Closed while the Research queue still showed Running, Queued, or Partial work. The queue did not reconcile at closure.
- **Minimal reproduction:** Start a research batch. Complete response approval and manual delivery. Close the matter before the active batch ends.
- **Current behavior:** Closure checks delivery and required work items only. Research tasks continue. The research completion handler restores stage only when the current stage is `research`, so a closed matter is not reconciled.
- **Expected behavior:** Closure is blocked while any research run is `queued` or `running`. The user can stop the queue, keep saved partial results, and then close. Completed or failed research does not block closure.
- **Impact:** The durable matter says no active action while agent work still changes matter files. This is a record-integrity defect.
- **Workaround:** Wait for all research to end before closing. There is no current stop control.
- **Cause confidence / evidence:** **Confirmed.** `backend/app/services/matter_lifecycle.py:123-139` does not inspect research state. `backend/app/services/research_runs.py:292-311` exits stage restoration unless the stage is Research. Saved R4 and R6 records show closure and active queue states at the same time.
- **Verified code areas:** `backend/app/services/matter_lifecycle.py`; `backend/app/services/matter_state.py`; `backend/app/services/research_runs.py`; `backend/app/services/matters.py`; lifecycle and research tests.
- **Detailed implementation approach:** In `close_matter`, read the derived `work_state.execution_state`. Reject closure for `queued` or `running` with a short message and `Stop research` recovery. Do not block for partial, completed, failed, or interrupted runs. Add a consistency issue for an already-closed matter that has active research, so old records are visible rather than silently changed.
- **Dependencies / risk:** Implement with MOS-UX-05 so the lawyer has a way out. Do not auto-cancel research during closure.
- **Tests:** Lifecycle rejection with queued and running states; closure allowed after stop; consistency issue for a seeded closed-active matter; no regression to normal close.
- **Visible acceptance:** A close attempt during active research says `Stop or finish active research before closing`. After Stop research, closure succeeds. No background file changes occur after closure.
- **Further diagnosis:** Confirm whether any non-research background process should also block closure. Keep it out of this repair unless a durable active state already exists.

### MOS-UX-05 — Active or failed research has no normal recovery control

- **Classification / priority:** Not working well / P2.
- **Affected runs, roles, phases:** R5, R7, and R10; Research and Explore.
- **Frequency:** 3/10 runs had a queue that was active or mixed when the actor needed a next action.
- **Exact evidence:** R5 showed one Running 0/1 item and two Queued items with no packet, retry, cancel, or continue control. R7 showed Partial, Running, and Queued items while useful draft work already existed. R10 was Ready to send with one queued/running item. The only wait escape was the chat-level `Continue in background` control.
- **Minimal reproduction:** Start a three-question batch with a slow provider. Open the research page while item one is running. Also seed an ordinary interrupted or failed item.
- **Current behavior:** The queue can reorder queued items. Resume appears only for `resumed_from_restart` interrupted items. There is no stop action. Failed items have no retry action. The UI has no elapsed or configured-limit context.
- **Expected behavior:** Active queues have `Continue elsewhere` and `Stop research`. Interrupted and failed items have `Resume` or `Retry`. Saved results remain openable. Drafting and finalization stay available when useful work exists.
- **Impact:** Normal provider delay looks permanent. The lawyer cannot safely close, recover, or choose to proceed with partial work.
- **Workaround:** Wait, restart the app for an interrupted state, or continue from a completed partial item only.
- **Cause confidence / evidence:** **Confirmed** for missing controls. **Unknown** whether any observed provider call exceeded its configured bound; the experiment did not wait long enough in every run. `frontend/components/ResearchQueuePanel.tsx:39-70` contains only reorder, restart-only resume, open packet, and continue-from-partial. `backend/app/services/research_runs.py:123-140` and `:334-339` resume only eligible pending work.
- **Verified code areas:** `backend/app/services/research_runs.py`; `backend/app/routers/settings.py`; `backend/app/routers/matters.py`; `frontend/components/ResearchQueuePanel.tsx`; `frontend/app/matters/[matterId]/research/page.tsx`; `frontend/lib/api.ts`; `frontend/lib/types.ts`; research queue tests and checks.
- **Detailed implementation approach:** Add `stop(matter_id)` to cancel the in-process active task and mark all queued/running items `interrupted` with `resumed_from_restart: false` and a user-stop reason. Preserve result paths and completed counts. Generalize resume to any interrupted item. Add retry for failed items by resetting the selected item to queued with the same durable identity and saved provider selection. Add typed endpoints and operation results. Show elapsed time from `started_at`, but do not promise an exact finish time. Keep `Continue from saved research` for partial completion.
- **Dependencies / risk:** Must land with MOS-UX-04. Cancellation has an asyncio race: mark state after task cancellation is acknowledged, and ensure the `finally` block does not start the queued tail after user stop.
- **Tests:** Stop during running and queued tail; stop with one saved result; resume user-stopped item; retry failed item; no duplicate task; provider selection retained; UI control visibility by state.
- **Visible acceptance:** During a slow run, select Stop research. Running and queued rows become Interrupted. Select Resume. One item becomes Queued/Running. Saved packet links remain present.
- **Further diagnosis:** Decide whether retry should keep the same run ID or create a linked attempt. For the MVP, keep the same ID and add attempt count unless audit requirements already demand a new record.

### MOS-UX-06 — Work-product cards repeat actions and revisions in one turn

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R1 and R6; Draft, Generate, and Respond.
- **Frequency:** Duplicate finalize controls in 1/10; six duplicate cards and repeated saves in 1/10.
- **Exact evidence:** R1 had duplicate visible `Finalize saved draft` controls, causing a strict-mode click failure. R6 saved six work-product cards with the same title and path in one assistant message. The same run made six successful `save_work_product` operations against that path. The final review displayed 67 changes and a very large tracked-change record.
- **Minimal reproduction:** Return several `save_work_product` calls with different content in one provider run. Open the saved conversation. Or show more than one historical draft card while one current draft exists.
- **Current behavior:** Every returned work-product card is appended. Keys include the array index, so same-path cards all render. Every historical draft card redirects its action to the current canonical path and shows `Finalize saved draft`.
- **Expected behavior:** One current canonical artifact appears once per assistant turn. Historical artifact cards are open-only. Finalization appears once in the canonical matter action area. Repeated same-turn saves do not create repeated visible cards.
- **Impact:** The lawyer cannot identify the authoritative action. Repeated agent revisions create noisy redlines and large Markdown frontmatter.
- **Workaround:** Use `Finalize current draft` in the matter overview. Ignore repeated chat cards.
- **Cause confidence / evidence:** **Confirmed** for card and action duplication. **Likely** that repeated same-turn revisions caused the dense R6 redline; the saved run contains six writes and `DocumentReviewService` composes open tracked changes. `frontend/components/ChatCards.tsx:28-55` renders all cards, and `:231-255` redirects and finalizes every draft card.
- **Verified code areas:** `backend/app/agents/runner.py`; `backend/app/services/chat_runs.py`; `backend/app/tools/handlers.py`; `backend/app/services/document_review.py`; `frontend/components/ChatCards.tsx`; `frontend/components/MatterWorkspace.tsx`; chat and document-review tests.
- **Detailed implementation approach:** Dedupe work-product cards by `vault_path`, keeping the last state and the first useful summary. Remove finalization from chat cards; keep `Open artifact`. The matter overview remains the single finalization surface. In the runner, when multiple same-path work-product results occur in one turn, project one latest result/card. Add a Copilot contract rule to save the complete artifact once after gathering context. Do not discard durable operation evidence from the saved trace.
- **Dependencies / risk:** No change to immutable final behavior. Do not collapse distinct paths or distinct work products. Do not rewrite old conversations.
- **Tests:** Card projection dedupe; historical card open-only; one visible finalization action; same-path repeated operations keep latest card but all raw operation evidence; distinct paths remain distinct.
- **Visible acceptance:** The R6-shaped fixture shows one Research Notes card and no chat-card finalization button. The overview shows one `Finalize current draft` control.
- **Further diagnosis:** If dense redlines remain after same-turn save dedupe, inspect same-author revision supersession separately. Do not change tracked-change composition in this repair without a focused failing test.

### MOS-UX-07 — Canonical artifact title and recommendation projection disagree with content

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R1 and R3; Generate and Respond.
- **Frequency:** 2/10 runs.
- **Exact evidence:** R1 chat said a developed memo with a new title was saved, but Draft and Final showed only the baseline title. Direct inspection shows that the baseline canonical file body was revised with the developed memo. R3's draft and final contain a recommendation, while the dossier says `No recommendation has been drafted yet.`
- **Minimal reproduction:** Revise an existing canonical draft with a new `title`. The handler keeps old metadata. For recommendation mismatch, save a new draft containing advice without a separate recommendation mutation.
- **Current behavior:** Existing-draft revision ignores the tool `title` and reports old metadata. The save-work-product tool schema does not expose the handler's `recommendation` argument. On existing-draft revisions, the handler also ignores it. The dossier correctly reads only the typed recommendation record, but its empty-state wording implies that no recommendation exists anywhere.
- **Expected behavior:** Canonical identity and path remain stable, but a supplied title updates metadata, event text, tree label, and result. A draft save can atomically include a separate working recommendation. If no typed recommendation exists, the dossier says `No separate working recommendation is saved; the draft may still contain advice.`
- **Impact:** The UI appears to lose work. It also gives a false negative about recommendation state.
- **Workaround:** Open the baseline-titled artifact to find the revised body. Save the recommendation as a separate operation.
- **Cause confidence / evidence:** **Confirmed** for implementation behavior; **Likely** that title retention is the direct R1 cause because tool arguments are not stored. `backend/app/tools/handlers.py:224-282` uses old title metadata on every revision. `backend/app/tools/handlers.py:283-290` accepts `recommendation` only for creation, while the declarative schema does not define it. `backend/app/services/dossier.py:133-137` uses the absolute empty-state sentence.
- **Verified code areas:** `backend/app/tools/handlers.py`; `backend/app/services/work_product.py`; `backend/app/services/recommendations.py`; `backend/app/services/dossier.py`; `backend/app/blank_vault_template/00_System/tools/save_work_product.md`; `backend/app/routers/matters.py`; recommendation and work-product tests.
- **Detailed implementation approach:** Move current-draft revision into `WorkProductService` so title, content, optional recommendation, matter pointer, event, and dossier projection use one transactional service boundary. Update title metadata without renaming the file. Add optional `recommendation` to the declarative tool schema. Apply it to creation and revision. Preserve recommendation proposal rules. Replace only the empty-state copy; never infer or auto-record a recommendation from draft prose.
- **Dependencies / risk:** Recommendation and draft changes must roll back together on failure. Existing finals stay immutable. A title change must not change `work_product_id` or invalidate a valid path.
- **Tests:** Revision retitles without moving path; event and tree use new title; combined revision and recommendation are atomic; rollback restores both; draft-only advice does not create a recommendation; empty-state copy is precise.
- **Visible acceptance:** Save a developed memo over a baseline draft. The tree shows the new title and opens the same path. Save with separate recommendation text. The dossier shows it as a working recommendation and no durable decision is created.
- **Further diagnosis:** None.

### MOS-UX-08 — Recovered tool failures and internal control text reach the lawyer

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R3, R6, and R9; Research and Generate.
- **Frequency:** Protected generic-write failures in 2/10. Internal limit text in 1/10.
- **Exact evidence:** R3 showed `write_markdown failed: Use a typed tool for protected matter records and work products.` R6 showed it three times before a successful typed save. R9 displayed `Do not mention the tool-step limit.` as the entire assistant answer.
- **Minimal reproduction:** Call `write_markdown` on a protected work-product path, then successfully call `save_work_product`. For leakage, return `Do not mention the tool-step limit.` from the final no-tools provider call.
- **Current behavior:** Operation result cards show each protected failure even when a later typed save recovered the artifact. The output cleaner strips `Do not mention the tool limit` but not `Do not mention the tool-step limit`.
- **Expected behavior:** Raw traces keep all failures. The normal chat view coalesces a recovered protected-write failure under the successful typed save. Internal control sentences never appear in normal display or saved user-facing reply.
- **Impact:** Internal mechanics replace useful work and increase cognitive load. Recovered failures look like unresolved data loss.
- **Workaround:** Ignore failed operation cards and use the saved artifact. There is no workaround for an empty leaked reply.
- **Cause confidence / evidence:** **Confirmed.** `backend/app/agents/output.py:7-18` has the missing regex variant. `frontend/components/ChatCards.tsx:37-42` and `:59-112` show visible failed operation results. Saved R6 evidence contains later successful typed saves.
- **Verified code areas:** `backend/app/agents/output.py`; `backend/app/agents/runner.py`; `backend/app/tools/registry.py`; `backend/app/tools/handlers.py`; `frontend/components/ChatCards.tsx`; output, chat-history, and chat-run tests.
- **Detailed implementation approach:** Make the control-prefix regex accept `tool limit` and `tool-step limit`, including whitespace and hyphen variants. Apply the same cleaner on immediate, timeout, and history display paths. Add a frontend pure projection that hides only a failed protected `write_markdown` result when the same assistant turn contains a changed `save_work_product`. Keep unrelated failures visible. If cleaned final content is empty, use a result-aware fallback such as `The requested research was not started; saved workspace changes are listed below.`
- **Dependencies / risk:** Do not remove raw operation results or traces. Do not hide an unrecovered write failure. Avoid broad text removal that could delete legal analysis about a tool named in a quoted source.
- **Tests:** Exact R9 string; spacing variants; history display; recovered protected-write coalescing; unrelated failure remains; unrecovered protected write remains.
- **Visible acceptance:** The R6-shaped fixture shows one successful saved-artifact result and no protected-write error. The R9 exact string is absent and a useful status remains.
- **Further diagnosis:** None.

### MOS-UX-09 — Intake matters can show `No action needed` while naming required work

- **Classification / priority:** Broken / P1.
- **Affected runs, roles, phases:** R8 directly; R9 has the same derived-state shape; Intake and Matters list.
- **Frequency:** Exact contradiction in 1/10. The state rule affects any active intake with no open required work item.
- **Exact evidence:** R8 showed `No action needed`, stage `Just came in`, and `0 open`, while Required work named retention as the next action.
- **Minimal reproduction:** Complete the required `Orient to the request` item. Keep intake active and save a text `next_action`. Do not create another required work item.
- **Current behavior:** `MatterStateService` uses the saved next action for its headline, but derives `next_actor: none` when no required work item exists. The signal becomes `none`, which the UI labels `No action needed`. `0 open` counts work items, not unanswered intake questions.
- **Expected behavior:** Active intake with a saved next question signals `Waiting on you`. The queue label says `0 open work items` so it does not claim there is no intake work.
- **Impact:** The lawyer can leave a matter that is waiting for an answer because the main status says no action is needed.
- **Workaround:** Open the matter and read the Required work card.
- **Cause confidence / evidence:** **Confirmed.** `backend/app/services/matter_state.py:38-72` derives the text and actor separately. `:176-198` returns no actor without a work item. `:241-260` maps that to no signal. `frontend/components/MatterWorkspace.tsx:966` labels only the work-item count.
- **Verified code areas:** `backend/app/services/matter_state.py`; `backend/app/services/matters.py`; `frontend/lib/design.ts`; `frontend/app/matters/page.tsx`; `frontend/components/MatterWorkspace.tsx`; state tests and workspace checks.
- **Detailed implementation approach:** In state resolution, if intake is active, a saved next action exists, and no required work item supplies an actor, set `next_actor: you` and the configured lawyer as owner when available. Do not create a work item. Change the queue count label to `open work items`.
- **Dependencies / risk:** Implement after MOS-UX-01 so a recovery loop does not create a misleading waiting signal. Do not mark a matter waiting when the next action is only a stage default.
- **Tests:** Active intake plus saved material question; active intake with only default text; open required work item still wins; closed state unchanged; frontend copy check.
- **Visible acceptance:** The R8-shaped matter row says `Waiting on you`. The workspace says `0 open work items` and still shows the next intake question.
- **Further diagnosis:** None.

### MOS-UX-10 — Long operations lack phase-specific progress

- **Classification / priority:** Not working well / P2.
- **Affected runs, roles, phases:** R2, R4, R6, R7, R8, and R10; Intake, Research, and orientation.
- **Frequency:** User-visible waits over about eight seconds in 6/10 runs.
- **Exact evidence:** Intake turns took 8–35 seconds. R6 research took 97 seconds. The main labels were `Working`, `Still working`, or `Continue in background`. R4 still showed `Just came in` during required intake work.
- **Minimal reproduction:** Use a provider that waits 15 seconds after a structured answer or during a research run.
- **Current behavior:** Chat shows elapsed seconds but not the durable phase already completed. Research shows item count but no elapsed or stop control.
- **Expected behavior:** After a card answer, show `Answer saved · Reassessing intake`. During research, show `Research running · 0/1 · elapsed`. Always offer a safe background escape. Do not predict a finish time.
- **Impact:** The lawyer cannot tell whether a click registered or whether the product is stuck.
- **Workaround:** Wait or select `Continue in background` when it appears.
- **Cause confidence / evidence:** **Confirmed** for generic copy. **Unknown** whether provider latency itself is a product defect. `frontend/components/ChatPanel.tsx:538-542` has generic elapsed text. Durable card answers are saved before later provider work, but this fact is not shown immediately.
- **Verified code areas:** `frontend/components/ChatPanel.tsx`; `frontend/lib/chatRunLogic.ts`; `frontend/components/ResearchQueuePanel.tsx`; backend chat-run and research-run status models.
- **Detailed implementation approach:** Derive status copy from operation/card context only. Show durable answer acknowledgment as soon as the saved user message returns. Add research elapsed time from timestamps. Reuse existing background behavior and MOS-UX-05 controls. Do not add streaming or a progress service.
- **Dependencies / risk:** Depends on accurate operation and research state. Avoid claiming `saved` from optimistic local state before the server response.
- **Tests:** Copy state matrix for queued, answer persisted, running, background, completed, failed, and interrupted.
- **Visible acceptance:** A slow card answer first shows `Answer saved`, then `Reassessing intake`. A slow research row shows state, count, and elapsed time with Stop research.
- **Further diagnosis:** Measure provider and tool time separately only if these copy changes do not reduce confusion.

### MOS-UX-11 — Static suggestions and semantic duplicate facts add noise

- **Classification / priority:** Not working well / P3.
- **Affected runs, roles, phases:** R8 for both symptoms; Chat and dossier.
- **Frequency:** 1/10 observed for duplicate facts. `Compare both paths` is present for every matter.
- **Exact evidence:** R8 repeated assumptions as facts and showed `Compare both paths` without defining two paths.
- **Minimal reproduction:** Open any matter chat before two options exist. For facts, let intake restate an existing request fact with changed wording.
- **Current behavior:** `SUGGESTIONS` is a static list. Intake fact dedupe is exact normalized text, so semantic restatements remain separate.
- **Expected behavior:** Show `Compare both paths` only when two named options exist. Intake should be instructed to report only new or materially corrected facts. Exact repeats stay deduped. No fuzzy record merger is added.
- **Impact:** The interface suggests work that has no object and makes the fact list harder to scan.
- **Workaround:** Ignore the suggestion and repeated facts.
- **Cause confidence / evidence:** **Confirmed** for static suggestion. **Likely** for semantic duplicates: saved R8 facts are restatements, and `MatterRecordService` compares exact case-folded text.
- **Verified code areas:** `frontend/components/ChatPanel.tsx:22-26` and `:552-557`; `backend/app/services/matter_records.py`; Intake Agent contract; dossier projection.
- **Detailed implementation approach:** Remove the static `Compare both paths` chip unless the matter API supplies two named options. Keep the other general prompts if useful. Add a prompt rule to omit facts already present unless correcting them; require a clear corrected statement. Do not implement embeddings, similarity scoring, or automatic fuzzy withdrawal.
- **Dependencies / risk:** Last implementation wave. Prompt-only fact cleanup is not a record migration.
- **Tests:** Suggestion hidden without options and shown with two options; exact duplicate behavior retained; provider-contract assertion for new-or-corrected facts.
- **Visible acceptance:** R8-shaped matter has no unexplained comparison chip. New turns do not add verbatim or lightly reformatted repeats in the fixture test.
- **Further diagnosis:** If semantic duplicates remain frequent after the prompt change, collect a small labeled set before designing deterministic normalization.

## Observations that are not product bugs

- **No vault selector in New Matter:** This product uses one active vault for the workspace. The experiment was in the intended test vault. A per-matter vault picker is not required and would add scope.
- **Chrome unavailable, locked Mac, browser display failure, browser kernels, and session timeouts:** These are control-environment limits. DOM-visible in-app Browser control still worked. Do not change Counsel OS for these events.
- **Public research failure:** The provider may have failed in the environment. The application saved partial packets and labeled missing external authority. Preserve this behavior. Fix only queue recovery and lifecycle state.
- **R7 `Prepared request · Not sent`:** The current copy already states that the text is not sent and tells the user to select Send. This is not a confirmed defect.
- **R6 focus on paid search:** The saved final dossier covers website, sales presentations, and paid search. The earlier focus can be a reasonable risk priority. It is not a confirmed bug.
- **R7 finalization blocked by research:** Source inspection shows no general research gate on work-product finalization, and R10 finalized while research remained active. Treat R7 as action discoverability covered by MOS-UX-05, not a separate backend gate defect.
- **R6 67-change redline:** A large revision can validly create many changes. The confirmed defect is six same-path saves and cards. Change the redline algorithm only if a focused regression remains after MOS-UX-06.

## Dependency-safe implementation blueprint

### Wave 1 — Intake recovery, routing, and output hygiene

One owner must take this whole wave because the runner and chat router are coupled.

**Exact ownership:**

- `backend/app/routers/chat.py`
- `backend/app/agents/runner.py`
- `backend/app/agents/output.py`
- `backend/app/blank_vault_template/00_System/agents/intake-agent.md`
- `backend/app/blank_vault_template/00_System/agents/counsel-copilot.md`
- `backend/app/blank_vault_template/00_System/tools/update_matter_intake.md`
- `backend/tests/test_agents.py`
- `backend/tests/test_chat_runs.py`
- `backend/tests/test_chat_history.py`

Implement MOS-UX-01, MOS-UX-02, MOS-UX-03, and the backend part of MOS-UX-08. Keep routing as a pure function with table-driven tests. Stop after focused backend tests pass.

### Wave 2A — Research lifecycle and derived state

This can run in parallel with Wave 2B after Wave 1.

**Exact ownership:**

- `backend/app/services/research_runs.py`
- `backend/app/services/matter_lifecycle.py`
- `backend/app/services/matter_state.py`
- `backend/app/services/matters.py`
- `backend/app/routers/settings.py`
- `backend/app/routers/matters.py`
- `backend/app/models/api.py`
- `backend/tests/test_settings.py`
- `backend/tests/test_research.py`
- `backend/tests/test_matter_lifecycle.py`
- `backend/tests/test_matter_state.py`
- `backend/tests/test_matters.py`

Implement MOS-UX-04, MOS-UX-05, and backend MOS-UX-09. Add stop before enabling the closure guard in the UI.

### Wave 2B — Canonical work-product and recommendation truth

This can run in parallel with Wave 2A. It must not edit Wave 1 or Wave 2A files.

**Exact ownership:**

- `backend/app/tools/handlers.py`
- `backend/app/services/work_product.py`
- `backend/app/services/recommendations.py`
- `backend/app/services/dossier.py`
- `backend/app/blank_vault_template/00_System/tools/save_work_product.md`
- `backend/app/blank_vault_template/00_System/tools/write_markdown.md`
- `backend/tests/test_matter_action_tools.py`
- `backend/tests/test_recommendations.py`
- `backend/tests/test_work_product.py`
- `backend/tests/test_dossier.py`

Implement backend MOS-UX-06 and MOS-UX-07. Do not change `document_review.py` in this wave. First test whether same-turn save projection removes the redline symptom.

### Wave 3 — Frontend action and progress projection

Start only after Waves 2A and 2B define their final API shapes.

**Exact ownership:**

- `frontend/components/ChatPanel.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/components/ResearchQueuePanel.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- `frontend/lib/chatRunLogic.ts`
- `frontend/lib/matterBrief.ts`
- `frontend/scripts/check-adaptive-intake.ts`
- `frontend/scripts/check-chat-run-recovery.ts`
- `frontend/scripts/check-matter-brief.ts`
- `frontend/scripts/check-research-queue.ts`
- `frontend/scripts/check-workspace-ux.ts`

Implement visible parts of MOS-UX-01, MOS-UX-05, MOS-UX-06, MOS-UX-08, MOS-UX-09, MOS-UX-10, and MOS-UX-11. Reuse semantic colors and state words from `frontend/lib/design.ts` and `frontend/app/globals.css`.

### Wave 4 — Integrated verification

Use a fresh copy of the test fixture. Do not mutate the raw Mosaic Relay experiment vault. Do not run the ten-role experiment again as part of this handoff.

Run focused checks first:

```bash
cd backend
pytest tests/test_agents.py tests/test_chat_runs.py tests/test_chat_history.py
pytest tests/test_settings.py tests/test_research.py tests/test_matter_lifecycle.py tests/test_matter_state.py tests/test_matters.py
pytest tests/test_matter_action_tools.py tests/test_recommendations.py tests/test_work_product.py tests/test_dossier.py

cd ../frontend
npm run check:adaptive-intake
npm run check:chat-run-recovery
npm run check:research-queue
npm run check:workspace-ux
```

Then run required full verification:

```bash
cd backend && pytest
cd ../frontend && npm run typecheck && npm run build
cd .. && graphify update .
git diff --check
```

Walk these targeted visible acceptance paths from `docs/ACCEPTANCE_TESTS.md`:

1. Active intake categorical timing answer, reload, and recovery.
2. Active intake direct saved-research request.
3. Slow three-item research batch: background, stop, resume, retry, and packet opening.
4. Attempted closure during active research, then stop and close.
5. Existing canonical draft retitle plus separate recommendation.
6. Same-path repeated save fixture with one card and one overview finalization control.
7. Exact internal text `Do not mention the tool-step limit.` through immediate and history display.
8. Active intake with no open work item but a saved next question.

## Explicit non-goals

- Do not add auth, cloud tenancy, a queue server, embeddings, or a new database role.
- Do not add verifier agents, multi-agent votes, confidence thresholds, or legal-perfect-answer gates.
- Do not require verified public authority before showing useful analysis or allowing a draft.
- Do not auto-record a recommendation from draft prose.
- Do not merge recommendations with durable decisions.
- Do not auto-cancel research when a lawyer tries to close a matter.
- Do not migrate, rewrite, dedupe, or delete raw experiment records.
- Do not add a New Matter vault selector.
- Do not diagnose browser-control or locked-Mac failures as Counsel OS defects.
- Do not redesign the document-review algorithm unless a focused defect remains after save/card dedupe.
- Do not rerun the ten-role experiment in this implementation task.

## Sol Medium implementation handoff

Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `current.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_LANGUAGE.md`, and `docs/ACCEPTANCE_TESTS.md` before edits. Preserve the dirty worktree and the raw `Mosaic Relay UX Experiment 2026-09-03` vault.

Implement in the listed waves. Do not combine them into a new orchestration layer. Use the saved R1, R2, R3, R5, R6, R8, and R9 records as read-only evidence. Write synthetic fixtures for regressions.

For each repair:

- Make the failing test first.
- Make the smallest production change.
- Keep Markdown authoritative.
- Keep every failed or partial result available in raw trace data.
- Keep recommendations separate from decisions.
- Confirm the visible state word and one clear next action.

Stop and ask for review only if one of these occurs:

- A repair requires changing the durable record schema in a non-backward-compatible way.
- A stop/retry design cannot preserve partial research results.
- A canonical retitle would require moving files rather than updating metadata.
- Existing user changes overlap an owned file and cannot be preserved safely.

Otherwise, complete all waves and verification. Report exact changed files, tests, remaining uncertainty, and any targeted acceptance path not completed.

## Known uncertainty

- The exact frontend remount sequence behind repeated recovery calls was not proven. Server idempotence and stable cards remove the user-visible failure without depending on that sequence.
- The provider cause of research delay and public-source failure is unknown. The plan does not treat it as an application defect.
- R1 tool arguments are not stored, so the old-title handler behavior is confirmed while its role in that exact call is likely.
- The R6 dense redline may still need a focused document-review repair after same-turn save dedupe. Do not assume it does.
- R7 did not prove a backend finalization gate. Treat it as research/action discoverability.
