# Mosaic Relay live UX experiment and remediation plan

## Executive result

Five of ten matters reached verified closure. Runs 1, 2, 4, 6, and 7 completed the full visible workflow. Run 5 reached an approved final that was ready to send. Run 10 reached approval and recorded manual delivery. Runs 3, 8, and 9 stopped before a final usable end state.

The product thesis remains credible. Counsel OS preserved the exact request, built useful facts and issue records, kept recommendations separate from decisions, and produced usable work even when public research failed. Its strongest behavior was graceful research degradation: saved packets clearly said when they were model-only and when no external authority was retrieved.

The main risk is state trust. The live UI sometimes showed an answer as unsaved when it was saved, changed the main decision question after research, showed draft wording inside an immutable or approved final, claimed research was stopped when it was still queued, or displayed duplicate required work that blocked closure. These are record and workflow presentation defects. They should be repaired before more capability is added.

The first implementation priority is the state-integrity slice: UXR3-01 through UXR3-04, UXR3-06, UXR3-08, and UXR3-10. The second priority is a single clear projection of research and lifecycle state. Public-provider reliability must be investigated separately. The evidence does not support replacing model-only output, adding a legal-quality gate, or adding verifier agents.

## Setup and method

- Business: fictional product and payments company.
- Company: Mosaic Relay.
- Requester role: Senior Product Manager.
- Attorney role: Senior Product Counsel.
- Iterations: 10 independent matters.
- Themes: onboarding, background checks, payments, deactivation, privacy, and marketing.
- Live data location: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3`.
- Initial failed location: `/tmp/counsel-os-mosaic-relay-ux-20260903`.
- Application rule: all experiment operations used a directly controlled visible browser. No live actor used source code, an API, the database, direct vault reads, hidden page changes, or a headless browser to operate the product.
- Browser order: in-app browser, then Chrome, then Safari when needed. Browser availability varied by actor. Chrome was repeatedly unavailable. Safari was used often. The normalized evidence does not retain an exact browser name for every run, so this report does not invent that mapping.
- Requester and attorney model IDs: not present in the normalized evidence supplied for synthesis.
- Synthesis: GPT-5.6 Sol with high reasoning, after all live runs were complete.
- Post-run diagnosis: repository code, tests, graph data, and saved test-vault records were inspected only after the experiment. No application code was changed.

The synthesis followed the live-agent UX experiment protocol. Each issue group was queried through Graphify before code locations were named. The relevant services, components, tests, and durable experiment records were then read. Cause labels mean:

- **Confirmed:** the observed state and the code path that produces it are both present.
- **Likely:** code supports the explanation, but the exact live event was not captured well enough to prove causation.
- **Unknown:** the available records cannot distinguish the possible causes.

## Company setup result

The first vault activation at the `/tmp` path failed. A fresh recovery actor created and activated the R3 vault inside the repository and saved the Mosaic Relay company profile. The saved profile identifies Mosaic Relay as fictional and holds detailed business context.

Two setup problems were visible. Choosing **Leave blank** for the optional website asked for the website again. Also, the company summary stored the long overview answer instead of a concise summary. The first behavior is not reproduced by the current focused backend test, so its cause is unknown. The second behavior has a confirmed service cause: the overview answer is copied into `summary` before model merging, and a non-empty current summary always wins over the model's shorter proposed summary.

The failed `/tmp` activation is an environment/setup failure with an unknown root cause. The recovery path worked. Current activation errors log only the exception type and return a broad retry message, so a future repeat would still be hard to diagnose.

## Iteration results

| Run | Question | Phases reached | Main artifacts visibly verified | Decision | Final state | Status |
|---|---|---|---|---|---|---|
| 1 | Risk-based merchant onboarding | Intake through closure and manual delivery | Exact request, facts, issues, 3 research packets, recommendation, draft, final | Recorded | Closed | Complete |
| 2 | Consumer background checks | Intake through closure | Facts, issues, 3 partial research packets, recommendation, final | Recorded | Closed | Complete |
| 3 | Exact question not retained; matter was not created | Create matter only | None; both matter creation and Chat failed | None | No matter | Blocked by `Failed to fetch` |
| 4 | Refunds, reversals, and suspicious payments | Intake through closure | Partial research, recommendation, draft, final | Not stated in normalized evidence | Closed | Complete |
| 5 | Exact question not retained | Intake through approved final | Facts, issues, research, recommendation, approved final | Approval recorded; durable-decision detail not retained | Ready to send | Incomplete: no delivery or closure |
| 6 | Privacy controls for payment operations | Intake through closure | Facts, issues, failed research attempts, manually recovered model-only research draft, final | Not stated in normalized evidence | Closed | Complete |
| 7 | Consumer payment-risk disclosures | Intake through closure | Facts, issues, model-only research, recommendation, final | Not stated in normalized evidence | Closed | Complete |
| 8 | Marketing claims about fraud prevention | Intake through approval/delivery state | Research attempt, recommendation, draft, final | Saved state showed approval and delivery, but the opened final still said it was not approved | Ready to send | Blocked by active queued research and state contradictions |
| 9 | Exact question not retained | Intake and research | Exact request, facts, issues, dossier, recommendation, 5 research records | None | Research / Explore | Incomplete: 1 complete, 1 partial, 1 running, 2 queued |
| 10 | International expansion and local payments | Intake through approval and manual delivery | Facts, issues, 4 partial research packets, recommendation, approved final | Workflow reached approval and delivery | Ready to close, but blocked | Incomplete: duplicate required work remained open |

## What is working well

| ID | Capability | Evidence | Frequency | Why it helps | Preserve during fixes |
|---|---|---|---|---|---|
| WW-01 | Exact request preservation | Run 1 and Run 9 retained the full requester text and correct title; the saved R3 matters keep the original request record separate | Repeated | The lawyer can return to the real business request without reconstructing it | Keep `request.md` read-only and preserve exact input |
| WW-02 | Guided intake creates a useful foothold | Completed runs produced separate facts and issue maps from natural answers | Most created matters | The lawyer gets organized facts before legal analysis | Keep adaptive questions and the facts/issues split |
| WW-03 | Records have distinct meanings | Facts, issues, recommendations, final work, and durable decisions were separate in completed runs | Repeated | Recommendations do not silently become recorded decisions | Do not merge recommendation, approval, delivery, or decision actions |
| WW-04 | Research degrades toward an answer | Runs 1, 2, 4, 6, 7, and 10 produced useful partial or model-only work after public research failed | At least 6 runs | A provider failure does not erase useful analysis | Keep partial packets, internal sources, model-only labels, and honest missing-authority labels |
| WW-05 | Lifecycle actions are explicit | Approval, manual delivery, closure, and decision recording each had visible confirmation | Completed and near-complete runs | The lawyer can tell which material action was recorded | Keep separate explicit actions and immutable final records |
| WW-06 | Manual delivery wording is honest | The delivery control said it records an outside action and does not contact anyone | Runs that reached delivery | It prevents a false belief that Counsel OS contacted a person | Keep direct send disabled until it exists; this is an MVP limit, not a defect |
| WW-07 | Recovery often preserves durable work | Browser resets or timeouts in Runs 1, 4, and 7 did not lose saved matter data | 3 runs | A browser interruption did not force the lawyer to restart | Preserve Markdown as source of truth and idempotent mutation keys |
| WW-08 | Closed state can become quiet | Closed examples showed **No action** | Several closed runs | It supports the product goal of lowering cognitive load | Fix stray prompts without adding new closure gates |

## What is not working well

| ID | Priority | Issue | Frequency | Evidence | Impact | Recovery |
|---|---|---|---|---|---|---|
| UXR3-11 | P2 | Company overview becomes the full summary | Company setup | Saved company summary contains the long overview answer | Agents receive noisy orientation text | Edit the summary in review before saving |
| UXR3-12 | P3 | Optional website **Leave blank** repeated the same question | Company setup | The visible interview asked again after the explicit blank action | Adds a loop to setup | Answer again or move to review |
| UXR3-14 | P3 | Long panes require repeated reopen and scroll | Run 6 | The actor repeatedly reopened panes and scrolled to continue | Context and controls are easy to lose | Reopen the document or scroll back to the action area |
| UXR3-15 | P2 | Guided intake reassessment takes 15–20 or more seconds without first confirming the answer save | Run 1 | Repeated reassessment waits were measured at 15–20+ seconds | The lawyer waits and may not know whether the answer is safe | Leave the page after the durable progress message or wait for the next question |

## What is broken

| ID | Priority | Failure | Frequency | Evidence | Impact | Workaround |
|---|---|---|---|---|---|---|
| UXR3-01 | P1 | A valid intake update failed because a nested question arrived as a JSON string | Run 1 | Visible `QuestionCard` validation error; a later retry saved the answer | Core intake mutation can fail on provider output shape | Retry the answer |
| UXR3-02 | P1 | Saved intake answers are shown as **Superseded — No answer saved** | Runs 5 and 7; similar history clutter in Run 6 | Saved `facts.md` has the answers, but old cards use changed question IDs | The UI gives a false record-history statement | Read facts instead of chat history |
| UXR3-03 | P1 | Research can replace the main decision question with a narrow research question | Run 1 friction; clear post-closure result in Run 2 | Run 2 changed to a sanctions/identity question after the durable decision and closure | The matter's governing question loses authority | Re-read the original request or dossier history |
| UXR3-04 | P2 | Closed matters still show active questions and optional **Things to consider** | Runs 2 and 6 | Run 2 showed five optional items after closure; Run 6 still showed jurisdiction questions | Closed work still looks active | Ignore the optional prompts |
| UXR3-05 | P2 | Research presents competing stage, queue, and artifact signals, after long waits | 9 of 10 runs touched this pattern | Runs 1, 2, 4, 5, 6, 7, 8, 9, and 10 had slow, partial, stale, or contradictory research state | Repeated waiting and checking; next action is unclear | Continue in background, open saved partial packets, or use a manual model-only draft |
| UXR3-06 | P1 | Chat claimed research was stopped while queued research remained active | Run 8 | The trace contains no stop operation; closure said active research remained | The lawyer trusts an action that did not occur and cannot close | Use the visible research queue **Stop research** control |
| UXR3-07 | P2 | Chat exposed a raw protected-record tool error and did not recover with the correct action | Runs 2 and 8; Run 8 blocked the intended stop | `write_markdown failed: Use a typed tool for protected matter records and work products.` | Technical plumbing replaces an actionable user result | Use the matching page control or a typed tool in a new turn |
| UXR3-08 | P1 | Immutable or approved final work can still say **Draft for review** or **not approved** | Runs 4 and 8 | R3 final files retain those exact body lines; Run 8 matter metadata records approval | The work product contradicts its lifecycle record | Edit the draft before finalizing and create a new final |
| UXR3-09 | P1 | Recommendation save state and overview state can disagree | Run 8 | Editor showed saved Version 1; overview said no recommendation was saved | The lawyer cannot know which recommendation is current | Reload the matter and inspect the recommendation file |
| UXR3-10 | P1 | Duplicate required work and unassigned ownership block closure without a clear cleanup path | Run 10 | Seven work items include 3 copies of one title and 3 near-copies of another; 5 remained required and open | A delivered matter cannot close; the lawyer must resolve artificial work | Complete each duplicate separately and assign owners |
| UXR3-13 | P1 | Matter creation and Chat were unavailable with `Failed to fetch` | Run 3 | Failure appeared in both the in-app surface and Safari; no matter was created | The core workflow was unavailable for the full run | A fresh app/backend recovery was needed; no normal in-run recovery was found |

## Detailed repair backlog

### UXR3-15 — Confirm the intake answer before the slow reassessment

**Classification and priority:** Not working well, P2.

**Affected runs, roles, and phases:** Run 1; Senior Product Counsel; guided intake reassessment.

**Frequency:** Repeated within Run 1. Each reassessment took about 15–20 seconds or more.

**Evidence:** The live actor timed several waits. The next useful question eventually appeared and the workflow continued.

**Minimal reproduction:** Submit a guided intake answer with the configured real provider and time the interval until the next question card appears.

**Current behavior:** Matter Chat runs asynchronously and can wait up to 180 seconds. `ChatPanel.tsx` shows elapsed time and, after 15 seconds, a durable-progress message that says the lawyer can leave. Backend tests show that the intake answer can be saved before the model completes, but the initial visible message emphasizes model work rather than the successful answer save.

**Expected behavior:** As soon as the durable answer write succeeds, the card says **Answer saved · Preparing the next question**. The timer and **Continue in background** remain available. The next question appears when ready. No artificial delay, optimistic save claim, or legal-completeness wait is added.

**Lawyer and workflow impact:** The delay breaks intake rhythm and makes the lawyer unsure whether it is safe to leave or answer elsewhere.

**Recovery or workaround:** Wait for the next question or leave after the durable progress message. Saved work remained available in the observed recovery cases.

**Cause confidence:** Unknown for the provider/model latency. Confirmed that the chat run permits a much longer wait and that the UI does not lead with the separate answer-save milestone.

**Cause evidence:** `backend/app/services/chat_runs.py` uses the configured 180-second chat-run timeout. `ChatPanel.tsx` shows elapsed progress and the leave-page message at 15 seconds. Existing backend chat-run tests cover answer persistence before later model work.

**Relevant code areas:** `frontend/components/ChatPanel.tsx`; `frontend/lib/chatRunLogic.ts`; `backend/app/services/chat_runs.py`; `backend/tests/test_chat_runs.py`; `frontend/scripts/check-chat-run-recovery.ts`; `frontend/scripts/check-adaptive-intake.ts`.

**Detailed implementation approach:** Reuse the existing durable operation result for `record_intake_answer` or `update_matter_intake`. When that result is changed or no-change idempotent success and the chat run is still active, render **Answer saved · Preparing the next question** before generic model progress. Keep elapsed time, background navigation, and current timeout behavior. Do not add polling, another model, or a minimum delay. Measure provider time separately before changing the 180-second safety limit.

**Risks and dependencies:** The UI must never claim **Answer saved** from a pending or failed mutation. Derive it only from the saved operation result. This shares frontend files with UXR3-02 and must be implemented in the same ownership chunk.

**Tests to add or update:** Active chat run with successful answer mutation; idempotent no-change success; failed answer mutation; later next-question arrival; reload during reassessment; timer and background control remain visible.

**Visible acceptance criteria:** Within the first durable update, the answered card says **Answer saved · Preparing the next question**. The lawyer can leave the page. Reload shows the answer even if the next question is still being prepared.

**Further diagnosis needed:** Capture provider start, first tool result, answer-save, and next-question timestamps before changing backend timeouts.

### UXR3-01 — Accept a safely encoded nested intake question

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 1; Senior Product Counsel; guided intake.

**Frequency:** One directly observed failure. The provider later produced a valid shape, so the matter continued.

**Evidence:** The saved Run 1 trace records `next_question` as a JSON string and Pydantic reports `Input should be a valid dictionary or instance of QuestionCard`. The answer later persisted on a second update.

**Minimal reproduction:** Send `update_matter_intake` with a valid `next_question` object encoded once as a JSON string. Keep the other `IntakeTurn` fields valid.

**Current behavior:** `backend/app/tools/handlers.py` merges the arguments and calls `IntakeTurn.model_validate` directly. It does not normalize a string-encoded nested card.

**Expected behavior:** A syntactically valid JSON object in `next_question`, or an item in `next_questions`, is decoded once and then validated by the existing strict model. Invalid JSON and non-object values still fail.

**Lawyer and workflow impact:** A useful intake answer can appear to fail. The lawyer must repeat it and may doubt whether facts were recorded.

**Recovery or workaround:** Repeat the answer. This worked in Run 1.

**Cause confidence:** Confirmed.

**Cause evidence:** The exact malformed runtime shape is in the run trace. The handler has no narrow decoding step. The `QuestionCard` model correctly rejects a string.

**Relevant code areas:** `backend/app/tools/handlers.py`; `backend/app/models/api.py`; `backend/tests/test_matter_action_tools.py`; `backend/tests/test_agents.py`.

**Detailed implementation approach:** Add one private normalization function beside `update_matter_intake`. Copy the argument map. For `next_question`, and for each item in `next_questions`, decode only string values with `json.loads`. Accept only a resulting dictionary. Pass the normalized map to `IntakeTurn.model_validate`. Do not add general coercion to Pydantic models. Do not accept Markdown, code fences, arrays, or repeated encoding. Keep the current active-intake requirement for at least one structured next question.

**Risks and dependencies:** Broad coercion could hide bad provider output. The narrow field allow-list and one decode limit are required. No data migration is needed.

**Tests to add or update:** Add fail-then-pass coverage for a string-encoded `next_question`; the same shape inside `next_questions`; invalid JSON; a decoded array; and an already correct dictionary. Confirm source action keys and dossier updates remain idempotent.

**Visible acceptance criteria:** The Run 1 intake action saves once. The answer and next question remain visible after reload. No raw `QuestionCard` error appears.

**Further diagnosis needed:** None before implementation.

### UXR3-02 — Derive intake history from durable answers

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Runs 5 and 7, with related clutter in Run 6; Senior Product Counsel; intake history and later matter review.

**Frequency:** Repeated across at least two matters.

**Evidence:** Earlier questions showed **Superseded — No answer saved** although the corresponding answers exist in `facts.md`. In Run 5, old and new cards used forms such as `q3_trigger_type` versus `q3_trigger`, and `q5_sar_tipping` versus `q5_sar`.

**Minimal reproduction:** Answer an intake question, then let a later adaptive turn ask the same concept with a changed question ID. Complete intake and reload the conversation.

**Current behavior:** `historicalQuestionStates` in `frontend/lib/chatRunLogic.ts` reads only later conversation card actions. Any still-active old card becomes superseded when intake is inactive or any later saved message exists. `ChatPanel.tsx` then adds **No answer saved** when that local state has no values. Durable intake answers are not part of this calculation.

**Expected behavior:** A card is **Answered** when a durable answer record matches its stable question ID. If model question IDs drift, a conservative normalized-question-text match can show **Answered** only when it is unique. **Superseded** must mean a later question replaced it without a saved answer. Unknown cases should say **Earlier question** and must not assert that no answer was saved.

**Lawyer and workflow impact:** The visible history contradicts the source-of-truth facts record. This weakens trust and causes duplicate fact checking.

**Recovery or workaround:** Open Facts and ignore the chat history label.

**Cause confidence:** Confirmed.

**Cause evidence:** The saved facts and card IDs diverge. The frontend function has no durable-answer input and has a blanket supersede fallback.

**Relevant code areas:** `frontend/lib/chatRunLogic.ts`; `frontend/components/ChatPanel.tsx`; `frontend/components/ChatCards.tsx`; `frontend/lib/types.ts`; `backend/app/services/matter_records.py`; `backend/tests/test_matter_records.py`; `frontend/scripts/check-chat-run-recovery.ts`; `frontend/scripts/check-adaptive-intake.ts`.

**Detailed implementation approach:** Reuse the existing durable intake-answer data from the matter record. Expose a small read-only projection in the matter/chat response if the frontend does not already receive it: question ID, normalized question text, action, and saved values. Pass it to `historicalQuestionStates`. Match by exact question ID first. Use normalized text only for one unique match; never guess between multiple answers. Change the fallback label from **Superseded — No answer saved** to neutral wording unless the durable record proves a skip or replacement. Do not rewrite saved conversations or facts.

**Risks and dependencies:** Loose text matching could attach the wrong answer. Exact IDs stay authoritative. The text fallback must require one unique match and should be covered by collision tests.

**Tests to add or update:** Add cases for exact-ID answers, changed-ID/same-text answers, skipped answers, explicit stop, two similar questions, and no durable evidence. Update the frontend scripts to reject a false **No answer saved** label.

**Visible acceptance criteria:** Reload Runs 5 and 7. Questions with saved facts say **Answered** and show the saved value. A truly unanswered old question uses neutral or proved superseded wording.

**Further diagnosis needed:** Confirm the smallest existing API response that can carry durable answers before adding a new field.

### UXR3-03 — Protect the canonical decision question from research output

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 1 friction and Run 2 confirmed post-closure behavior; Senior Product Counsel; research, decision, and closure review.

**Frequency:** At least two runs showed narrowing or replacement.

**Evidence:** Research focus changed the full matter question to a narrow one in Run 1. After Run 2 was closed with a recorded decision, the active question became a sanctions/identity question.

**Minimal reproduction:** Create a matter with a broad decision question. Run research on a narrow sub-question whose generated packet contains a `Decision question` section. Reload the dossier.

**Current behavior:** `ResearchService.run` in `backend/app/services/research.py` parses `Decision question` from the generated packet and sends it to `DossierService.update_orientation`, before the current dossier question. Research therefore has write authority over the canonical question.

**Expected behavior:** Intake or an explicit lawyer action owns the canonical decision question. Research can add support and open questions, but it cannot replace that field. Closure freezes active workflow wording without deleting history.

**Lawyer and workflow impact:** A subtask can silently redefine what counsel is deciding. After closure, the matter can appear to ask a new question.

**Recovery or workaround:** Restore the question by editing the dossier or use the original request as the authority.

**Cause confidence:** Confirmed.

**Cause evidence:** The research service explicitly prefers generated question text. The Run 2 saved dossier contains the narrowed question after the matter's decision and closure.

**Relevant code areas:** `backend/app/services/research.py`; `backend/app/services/dossier.py`; `backend/tests/test_research.py`; `backend/tests/test_dossier.py`; `backend/app/services/matter_records.py`.

**Detailed implementation approach:** Remove `generated_question` from the research orientation update. Pass the current canonical question unchanged. Keep generated research questions in the research packet and merge only genuinely new open questions through the existing dossier path. Add a provenance comment or focused helper name in code so future research changes cannot regain question authority by accident. Do not add a new record type or approval gate.

**Risks and dependencies:** Some current tests may expect research to bootstrap an empty question. Preserve a narrow fallback only when the canonical question is empty and the matter has never completed intake; otherwise use the existing matter `next_action`, not generated research prose.

**Tests to add or update:** Prove that narrow research cannot change a non-empty decision question, including after a recorded decision and after closure. Keep a case for an empty legacy dossier.

**Visible acceptance criteria:** Run a narrow sanctions research question. The packet shows that question. The matter header and dossier keep the original business decision question before and after reload.

**Further diagnosis needed:** Check whether any legacy fixture depends on research being the first writer of a decision question.

### UXR3-04 — Make closed matters quiet without deleting unresolved context

**Classification and priority:** Broken, P2.

**Affected runs, roles, and phases:** Runs 2 and 6; Senior Product Counsel; closure and closed-matter review.

**Frequency:** Two of five closed matters.

**Evidence:** Run 2 showed five optional **Things to consider** after closure. Run 6 kept jurisdiction questions open after closure.

**Minimal reproduction:** Close a matter while optional open questions remain, then reopen its workspace.

**Current behavior:** `MatterWorkspace.tsx` always builds `openItems` from work items and dossier open questions and always renders **Things to consider**. It also reads `orientation.decision_question` without a closed-state presentation rule.

**Expected behavior:** A closed matter leads with **Closed** and **No action**. Optional questions are not presented as current work. Historical unresolved context remains available in a collapsed, clearly past-tense section such as **Open context at closure**. Required open work remains impossible at closure under the existing lifecycle rule.

**Lawyer and workflow impact:** Finished work still asks for attention and increases cognitive load.

**Recovery or workaround:** Ignore the optional section.

**Cause confidence:** Confirmed.

**Cause evidence:** The workspace render path has no closed guard around the current question or remaining-work section.

**Relevant code areas:** `frontend/components/MatterWorkspace.tsx`; `frontend/lib/matterBrief.ts`; `frontend/lib/matterActions.ts`; `frontend/scripts/check-matter-brief.ts`; `frontend/scripts/check-workspace-ux.ts`.

**Detailed implementation approach:** When `detail.status === "closed"`, replace the active question and **Things to consider** presentation with one collapsed historical section. Reuse the same stored open questions. Do not mutate the dossier on closure. Keep recorded decisions, final work, delivery, and closure events visible.

**Risks and dependencies:** Hiding unresolved context entirely would remove useful audit material. The collapsed historical view is required.

**Tests to add or update:** Add frontend checks for a closed matter with optional questions and for a closed matter with none. Confirm no **Required** item can be present through the backend closure tests.

**Visible acceptance criteria:** A closed Run 2-style matter shows **No action** and no active **Things to consider** list. The five old questions remain available under **Open context at closure**.

**Further diagnosis needed:** None.

### UXR3-05 — Present one truthful research and workflow state

**Classification and priority:** Broken, P2.

**Affected runs, roles, and phases:** Runs 1, 2, 4, 5, 6, 7, 8, 9, and 10; Senior Product Counsel; research through response.

**Frequency:** Repeated in nine runs. External research failure itself is an environment/provider event, not a proved product defect.

**Evidence:** Research ran for more than a minute, often ended partial, sometimes lagged a saved artifact, and remained **Running** while a matter said **Ready to send**. Run 9 had one complete, one partial, one running, and two queued items. R3 packets repeatedly state that Polaris timed out within the total external research budget.

**Minimal reproduction:** Start a three-question research batch with an external provider that reaches its 90-second limit. Continue the matter to a draft or final while later queue items remain active.

**Current behavior:** `ResearchRunService.start` creates up to three independent records. `_execute` starts the next pending item only after the current item ends. Each research call can spend the configured external timeout, which defaults to 90 seconds. `MatterWorkspace` polls every two seconds and can show a stage action and an execution-state action from different projections. A packet can be saved shortly before the run record changes to terminal state.

**Expected behavior:** The page states both facts in one sentence, for example **Ready to send · Research still running in the background**, and keeps the lifecycle action visible. Each queue row must use one stable word: Queued, Running, Partial, Complete, Failed, or Stopped. A partial packet is usable but is not called complete. Saved packets should appear as soon as their result path exists.

**Lawyer and workflow impact:** The lawyer waits, reopens panels, and cannot tell whether research blocks the next action.

**Recovery or workaround:** Continue in background, open a partial packet, stop the queue, or draft from current support.

**Cause confidence:** Confirmed for serial execution, configured latency, and competing projections. Unknown for the underlying external-provider timeouts. Likely for the short packet/status lag because the packet is written before the run's terminal update.

**Cause evidence:** `backend/app/services/research.py` defaults external timeout to 90 seconds. `backend/app/services/research_runs.py` serializes queue items. `frontend/components/MatterWorkspace.tsx` combines lifecycle and execution controls. `ResearchQueuePanel.tsx` already has useful elapsed and partial wording that can be reused.

**Relevant code areas:** `backend/app/services/research.py`; `backend/app/services/research_runs.py`; `frontend/components/ResearchQueuePanel.tsx`; `frontend/components/MatterWorkspace.tsx`; `frontend/lib/matterActions.ts`; `backend/tests/test_research.py`; `backend/tests/test_settings.py`; `frontend/scripts/check-workspace-ux.ts`.

**Detailed implementation approach:** Do not add a scheduler or parallel worker system. First, centralize the visible state sentence in `workflowStateExplanation` and always render the stage plus execution suffix. Do not replace the lifecycle control label with **Research is running**. Second, after each packet is saved, persist the result path and completed count in the run record before doing orientation or stage follow-up, so the UI can link the packet promptly. Third, use **Partial** only for terminal partial output and **Running · saved packet available** for a still-active record. Keep Stop and Continue in background controls visible in the workspace summary. Do not lower the external timeout or add concurrency until provider measurements show that this improves completed support.

**Risks and dependencies:** Running questions concurrently may raise provider load and is not supported by this experiment. Changing timeout can reduce useful packets. Both are intentionally out of this repair.

**Tests to add or update:** Add state-matrix tests for Ready to send plus running research, partial terminal output, a saved result on a running record, and closure blocking. Add a service test that observes result-path persistence before the terminal transition. Keep model-only packet tests.

**Visible acceptance criteria:** A Run 5-style matter shows **Ready to send · Research still running in the background**, an active **Approve** or **Record manual delivery** action, a visible Stop control, and a link to every saved packet. No page calls partial research complete.

**Further diagnosis needed:** Capture provider-leg timing and failure classes in a fresh test vault before changing timeouts or execution concurrency.

### UXR3-06 — Give chat a real typed stop-research action

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 8; Senior Product Counsel; research control and closure.

**Frequency:** One observed false success, with direct closure impact.

**Evidence:** Chat said the work was stopped by clearing active state. The run trace shows reads and a failed generic write, but no stop operation. One research item remained queued. Closure then reported **Stop or finish active research before closing the matter.**

**Minimal reproduction:** Start a research queue. Ask matter Chat to stop it. Inspect the durable research-run files and try to close.

**Current behavior:** The page has a stop endpoint backed by `ResearchRunService.stop`, but the counsel-copilot allow-list has no stop-research tool. Output reconciliation has no stop-research success pattern. The model can claim the intent was completed without a matching mutation.

**Expected behavior:** An explicit chat request to stop research calls one typed operation. Queued and running items become interrupted/stopped, saved results remain, the matter returns to its prior stage, and Chat reports success only from the operation result.

**Lawyer and workflow impact:** False action claims break trust and can block closure.

**Recovery or workaround:** Use **Stop research** in the Research queue panel.

**Cause confidence:** Confirmed.

**Cause evidence:** The durable trace has no stop call. The agent allow-list has no such tool. The service and page endpoint already exist and have stop behavior.

**Relevant code areas:** `backend/app/services/research_runs.py`; `backend/app/routers/settings.py`; `backend/app/tools/handlers.py`; `backend/app/tools/capabilities.py`; `backend/app/tools/registry.py`; `backend/app/agents/output.py`; `backend/app/blank_vault_template/00_System/agents/counsel-copilot.md`; matching test-vault agent/tool templates; `backend/tests/test_settings.py`; `backend/tests/test_agents.py`; `backend/tests/test_chat_history.py`.

**Detailed implementation approach:** Add a small typed `stop_research` tool that accepts the active matter ID from trusted context and no file path. Its handler calls the existing `research_runs.stop(matter_id)` service and returns the standard operation contract: action, source action key, status, summary, changed paths, resulting matter state, and available next actions. Add it to the counsel-copilot allow-list and declarative tool template. Add stop claims to output reconciliation so a success sentence is retained only when this operation succeeded. Reuse the existing service. Do not create another cancellation subsystem.

**Risks and dependencies:** Cancellation must retain already saved results and must be idempotent. It must not stop another matter. The trusted active matter scope and current service tests are required.

**Tests to add or update:** Chat tool contract; one queued item; one running plus queued tail; saved partial result retention; repeated stop; no active work; wrong or absent matter; output claim after success and after failure.

**Visible acceptance criteria:** Ask Chat to stop research. Chat shows a plain success result. The queue says **Stopped**, saved packets remain openable, and closure is no longer blocked by execution state.

**Further diagnosis needed:** None.

### UXR3-07 — Keep the protected-write guard and route actions correctly

**Classification and priority:** Broken, P2.

**Affected runs, roles, and phases:** Runs 2 and 8; Senior Product Counsel; work-product and research-control requests.

**Frequency:** At least two matters contain the protected-path error. Some other turns recovered with `save_work_product`; Run 8 did not recover the intended stop action.

**Evidence:** The visible error named `write_markdown` and the protected-record rule. The Run 8 trace used that tool for a protected path and did not complete the intended operation.

**Minimal reproduction:** Ask the copilot for a protected-record action that has no allowed typed tool or is ambiguously described. Let it choose `write_markdown` for a protected path.

**Current behavior:** `_validate_generic_write_path` correctly blocks protected records. The agent prompt says to use typed tools, but tool selection can still be wrong. `visibleOperationResults` hides an older generic-write failure only when a successful typed save follows.

**Expected behavior:** The guard remains strict. Common operations use typed tools. A wrong-tool attempt is translated into an action the lawyer can take; raw handler names and vault plumbing stay in the optional trace.

**Lawyer and workflow impact:** A correct safety guard appears as product breakage and can leave the requested action undone.

**Recovery or workaround:** Use the visible page control or ask again with the exact action.

**Cause confidence:** Confirmed for wrong tool selection and correct guard behavior. Likely that clearer routing plus UXR3-06 removes the observed failure class.

**Cause evidence:** The handler rejects protected paths by design. The traces show `write_markdown`. The agent instructions already name typed work-product tools but have no typed stop tool.

**Relevant code areas:** `backend/app/tools/handlers.py`; `backend/app/agents/output.py`; `frontend/lib/chatRunLogic.ts`; `frontend/components/ChatPanel.tsx`; counsel-copilot templates; `backend/tests/test_agents.py`; `backend/tests/test_chat_history.py`.

**Detailed implementation approach:** Do not weaken `_validate_generic_write_path`. Add a compact operation-to-tool map to the copilot instruction: work product → `save_work_product`; research start → `run_research`; research stop → `stop_research`; ordinary note only → `write_markdown`. When a protected-write failure is the final mutation result, show plain recovery text that names the available action, not the internal tool or path. Keep exact failure detail in the collapsed trace. Let a later successful typed operation supersede the failed card as it does today.

**Risks and dependencies:** Hiding all failures would harm auditability. Only the normal user card changes; the trace remains exact. Depends on UXR3-06 for stop requests.

**Tests to add or update:** Guard remains active; prompt contains the tool map; raw tool name is absent from normal failure text; trace retains it; successful recovery hides the obsolete failure.

**Visible acceptance criteria:** A protected action either succeeds through its typed tool or says what visible control to use. Normal Chat never ends with `write_markdown failed`.

**Further diagnosis needed:** Review other protected-write traces to confirm the small tool map covers every repeated operation before expanding it.

### UXR3-08 — Prevent lifecycle wording from contradicting final state

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Runs 4 and 8; Senior Product Counsel; finalize and approve.

**Frequency:** Two final artifacts. Run 8 is the stronger record-integrity case because approval is recorded while the body says not approved.

**Evidence:** Run 4 showed **Final work product saved** while the pane said **Draft for review**. The Run 8 final file contains `**Status:** Draft for review — not approved`, while matter metadata records approval and manual delivery.

**Minimal reproduction:** Save a draft whose leading status line says it is a draft or not approved. Finalize it and then approve it.

**Current behavior:** `WorkProductService.finalize` hashes and copies draft content unchanged into an immutable final. It changes metadata only. The lifecycle approval validator checks ownership, immutability, source draft, and content hash, but not an explicit contradictory status line.

**Expected behavior:** Before content becomes immutable, the UI blocks finalization when a leading, explicit lifecycle status marker says **draft**, **not final**, or **not approved**. The lawyer is taken back to the editable draft. Legal caveats such as partial research or unverified authority remain allowed.

**Lawyer and workflow impact:** The authoritative file gives two incompatible answers about whether it can be used.

**Recovery or workaround:** Edit the draft's status line and create a new final before approval.

**Cause confidence:** Confirmed.

**Cause evidence:** The final service copies body content without lifecycle-text validation. The saved R3 final files contain the contradictory lines.

**Relevant code areas:** `backend/app/services/work_product.py`; `backend/app/services/matter_lifecycle.py`; `backend/app/routers/matters.py`; `frontend/components/MatterWorkspace.tsx`; `backend/tests/test_work_product.py`; `backend/tests/test_matter_lifecycle.py`.

**Detailed implementation approach:** Add a narrow pre-finalization validator for explicit status metadata in the first part of the draft, such as a line beginning `Status:` or bold `Status:`. Reject only lifecycle claims that say draft/not final/not approved. Return a plain message: **Update the draft status before finalizing. The draft is still editable.** Open or focus the current draft from the UI error action. Do not silently rewrite reviewed text. Do not block on research quality, citations, confidence, assumptions, or legal completeness.

**Risks and dependencies:** A broad word search would reject valid discussion, such as “the policy was not approved in 2024.” Limit the check to a leading status field. Keep partial-research labels valid.

**Tests to add or update:** Exact Run 4 and Run 8 status lines; a valid `Status: Final for approval`; a sentence containing “not approved” outside a status field; a partial-research status; immutable final identity and hash checks.

**Visible acceptance criteria:** A contradictory draft cannot be finalized. The error opens the editable draft. After the status field is corrected, finalization and approval work and the opened final does not claim draft or unapproved state.

**Further diagnosis needed:** Inspect existing final templates for other lifecycle-status forms before fixing the regular expression.

### UXR3-09 — Reproduce and harden recommendation save projection

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 8; Senior Product Counsel; recommendation and overview.

**Frequency:** One observed contradiction.

**Evidence:** The recommendation UI showed saved Version 1. The overview simultaneously said **No working recommendation is saved yet.**

**Minimal reproduction:** Not yet established. The best candidate is a save followed by an out-of-order matter reload while the recommendation file request also returns.

**Current behavior:** `MatterWorkspace.tsx` keeps recommendation state in local state and refs, fetches supplementary recommendation data, and has request-order guards. The inspected code appears intended to prevent stale clearing. The live contradiction proves that one path remains, but the saved trace does not include both response payloads.

**Expected behavior:** After Version 1 is confirmed, the overview shows that exact saved version until a newer durable response replaces it. A refresh failure must say the save succeeded and offer **Reload matter**; it must not show an empty state.

**Lawyer and workflow impact:** The lawyer may recreate a recommendation or distrust later work derived from it.

**Recovery or workaround:** Reload and open the recommendation artifact.

**Cause confidence:** Unknown.

**Cause evidence:** The current frontend has stale-request protection, so code inspection alone does not prove the live cause. No response-order or console log was retained for the moment of failure.

**Relevant code areas:** `frontend/components/MatterWorkspace.tsx`; `frontend/lib/api.ts`; `frontend/lib/types.ts`; `backend/app/services/recommendations.py`; `backend/tests/test_recommendations.py`; `frontend/scripts/check-workspace-ux.ts`.

**Detailed implementation approach:** Start with a deterministic component regression that controls the order of the save response, matter reload, and supplementary recommendation response. Include a failed reload case. If the test reproduces the clear, make `recommendationStateRef.current` the sole comparison source and ignore any response with an older or empty version when a confirmed saved version exists. If it does not reproduce, add temporary development-only structured logging for matter ID, request sequence, and recommendation version; do not ship speculative backend state or a second cache.

**Risks and dependencies:** A guessed fix may preserve stale text after a real deletion or matter switch. Matter identity and version identity must both match. No other chunk depends on this item.

**Tests to add or update:** Save then slow empty reload; save then newer version; switch matter during load; failed reload; explicit empty initial matter.

**Visible acceptance criteria:** After **Working recommendation saved** and Version 1 appear, the overview never says no recommendation is saved. Reload preserves Version 1.

**Further diagnosis needed:** Required. Reproduce the response order before changing production logic.

### UXR3-10 — Prevent duplicate required work and show an ordered closure path

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 10; Senior Product Counsel; work planning, delivery, and closure.

**Frequency:** One matter, with six duplicate or near-duplicate required items created across three chat runs.

**Evidence:** The R3 matter has three **Draft country-approval gate framework** items and three forms of **Confirm funds-flow / custody model**. Source action keys differ. Five required items remain open and have no owner. Approval and manual delivery succeeded, but closure was disabled.

**Minimal reproduction:** Ask Chat to create the same required work in separate turns. Let each turn use its normal new source action key. Complete one copy, approve, record delivery, and try to close.

**Current behavior:** `MatterWorkItemService.create` deduplicates only by `source_action_key`. A new chat turn always has a different key. `matter_lifecycle.py` intentionally permits approval and delivery while required work remains and blocks closure. Existing tests assert this behavior.

**Expected behavior:** The same matter cannot gain another agent-created work item with the same normalized title and required/optional class without an explicit distinct title. After delivery, the primary action lists closure blockers in order and puts **Assign owner** or **Complete** next to each one. Approval and delivery remain separate and remain allowed; only closure stays blocked.

**Lawyer and workflow impact:** Artificial duplicate work creates avoidable cleanup and hides the real path to closure.

**Recovery or workaround:** Assign or complete every duplicate item separately.

**Cause confidence:** Confirmed.

**Cause evidence:** Durable work-item files have different source keys and repeated titles. The service only checks a source key. Lifecycle tests confirm that open required work is a closure gate, not an approval or delivery gate.

**Relevant code areas:** `backend/app/services/matter_work_items.py`; `backend/app/services/matter_lifecycle.py`; `backend/app/models/api.py`; `frontend/components/MatterWorkspace.tsx`; `frontend/lib/matterActions.ts`; `backend/tests/test_matter_lifecycle.py`; `frontend/scripts/check-workspace-ux.ts`.

**Detailed implementation approach:** Add a small matter-local duplicate key for agent-created work: Unicode-normalized, case-folded title, punctuation collapsed, whitespace collapsed, and `/` treated as `and`. Compare within the same matter. If a matching open or completed item exists, return a standard no-change operation pointing to it. Do not build semantic matching, embeddings, or a dedup service. Keep genuinely distinct work possible by using a distinct title. In the workspace, when closure is blocked, show one ordered **Before you can close** list from `closure_prerequisite`: stop research first, then assign/complete required work. Reuse existing assign and complete controls.

**Risks and dependencies:** Over-normalization could merge different tasks. Keep the transform narrow and cover punctuation cases. Existing duplicate records need no automatic destructive cleanup; the lawyer can close them through current controls.

**Tests to add or update:** Same source key; new source key with exact title; case/space/punctuation variants; slash versus `and`; different matter; optional versus required; distinct title; completed existing item; ordered closure blockers; approval and delivery remain allowed.

**Visible acceptance criteria:** Repeat the two Run 10 create requests across three Chat turns. Only one item per normalized title exists. After delivery, the page lists the exact remaining blockers with owner and Complete controls. Completing them enables closure.

**Further diagnosis needed:** Confirm whether manual, non-agent work-item creation needs an explicit duplicate override. Do not add it unless a current workflow uses it.

### UXR3-11 — Produce a concise company summary

**Classification and priority:** Not working well, P2.

**Affected runs, roles, and phases:** Company setup; Senior Product Counsel; company interview review.

**Frequency:** One setup, with persistent effect on all ten matters.

**Evidence:** The saved company summary contains the full long overview answer instead of a short orientation.

**Minimal reproduction:** Start with an empty profile. Give a long answer to the opening `overview` question with a configured model. Inspect the generated draft summary.

**Current behavior:** `CompanyInterviewService.draft` copies the full overview answer into `summary`. `_merge_model_profile` then keeps every non-empty current field, so the model's proposed concise summary cannot replace it.

**Expected behavior:** The full answer may inform all profile fields, while `summary` is a short orientation. The review screen remains editable and nothing is saved until the lawyer confirms.

**Lawyer and workflow impact:** Long repeated context increases reading load and can crowd out the most useful company facts in later prompts.

**Recovery or workaround:** Edit the summary before saving.

**Cause confidence:** Confirmed.

**Cause evidence:** The overview fallback and current-value-first merge are explicit in `backend/app/services/company_interview.py`. The R3 `company.md` shows the long result.

**Relevant code areas:** `backend/app/services/company_interview.py`; `frontend/components/CompanyInterview.tsx`; `backend/tests/test_company_interview.py`.

**Detailed implementation approach:** For the opening overview only, let a valid model-proposed `summary` replace the temporary full-answer fallback. Keep non-empty existing saved profile fields authoritative in later edits. For model failure, create a deterministic local summary from the first complete sentence, with a clear length cap, while the other structured fields retain provided detail. Do not add a summarization service or another model call.

**Risks and dependencies:** Truncation can remove a key qualifier. Prefer a full first sentence and keep the review step. The user's full input still informs structured fields and conversation history.

**Tests to add or update:** Long overview with a model summary; model unavailable; existing saved summary; empty summary; multi-sentence input; review edit and save.

**Visible acceptance criteria:** A long Mosaic Relay overview produces a short summary and detailed structured fields. The lawyer can edit both before save. Reload shows the reviewed values.

**Further diagnosis needed:** Set the exact character cap from current prompt budget conventions, not a new arbitrary configuration field.

### UXR3-12 — Honor optional website skip once

**Classification and priority:** Not working well, P3.

**Affected runs, roles, and phases:** Company setup; Senior Product Counsel; optional website question.

**Frequency:** One observed repeat.

**Evidence:** Clicking **Leave blank** caused the website question to appear again.

**Minimal reproduction:** Not reproduced in current service tests. Use the live component, click **Leave blank**, and record the request and response question IDs.

**Current behavior:** The component sends message `Leave blank` and `website_url: ""`. The service has an explicit skip branch and a focused test that expects the next question not to be `website_url`. The observed result conflicts with that current unit path.

**Expected behavior:** One click records the field as intentionally blank for this interview session and advances to another useful question or review.

**Lawyer and workflow impact:** Setup feels stuck and asks the lawyer to repeat a clear choice.

**Recovery or workaround:** Repeat the choice or go to draft review.

**Cause confidence:** Unknown.

**Cause evidence:** Current code and test should skip the field, but the live run did not. Possible request-state or stale-response causes were not captured.

**Relevant code areas:** `frontend/components/CompanyInterview.tsx`; `backend/app/services/company_interview.py`; `backend/tests/test_company_interview.py`.

**Detailed implementation approach:** First add a component-level test around the exact empty-string request and a delayed prior response. If it reproduces, retain a local `skippedFields` set for the session and reject a stale response that asks a skipped field again. Also send an explicit boolean `website_skipped` only if the current payload cannot distinguish omission from intentional blank. Do not change the profile schema unless the test proves it is necessary.

**Risks and dependencies:** Persisting a permanent skip would stop a later user from adding a website. Keep it interview-session local unless evidence shows a durable need.

**Tests to add or update:** Leave blank once; delayed prior response; restart interview; later explicit URL; model returns website focus after skip.

**Visible acceptance criteria:** **Leave blank** advances after one click. Restarting the interview still permits adding a website.

**Further diagnosis needed:** Required. Capture the component request/response sequence in a focused local browser check.

### UXR3-13 — Recover clearly when the local service cannot be reached

**Classification and priority:** Broken, P1.

**Affected runs, roles, and phases:** Run 3; Senior Product Counsel; matter creation, Today Chat, and initial intake.

**Frequency:** One full run. It affected both the in-app surface and Safari.

**Evidence:** Both matter creation and Chat failed twice with `Failed to fetch`. Today stayed at **Working…** with controls disabled. No matter was created.

**Minimal reproduction:** Stop or disconnect the local backend after the frontend loads. Submit a new matter and a Today message.

**Current behavior:** `frontend/lib/api.ts` uses raw `fetch` with no bounded client timeout and no network-error translation. The submitter waits for that promise. The exact backend or network failure from Run 3 was not logged in the supplied evidence.

**Expected behavior:** The request ends within a bounded time, preserves typed input, re-enables controls, and shows **Counsel OS cannot reach the local service** with Retry. A lost response must not create duplicate matters because the existing source action key is reused.

**Lawyer and workflow impact:** The whole product is unavailable and the screen appears stuck.

**Recovery or workaround:** Restart or reconnect the app service and retry with the same user input. No in-run normal recovery was observed.

**Cause confidence:** Unknown for the service outage. Confirmed for the missing shared fetch timeout and plain network-error handling. Likely that the unbounded pending promise caused the prolonged disabled state.

**Cause evidence:** Failure spanned two browser surfaces. No server log or health result was retained. The shared request function has no `AbortController`, timeout, or network failure mapping.

**Relevant code areas:** `frontend/lib/api.ts`; `frontend/components/NewMatterForm.tsx`; Today chat components; `backend/app/routers/matters.py`; existing matter creation idempotency tests; `frontend/scripts/check-matter-creation.ts`; `frontend/scripts/check-transport-preservation.ts`.

**Detailed implementation approach:** Add one shared request timeout with `AbortController` in `request`, while preserving any caller signal. Translate network and timeout failures to one plain service-unavailable error. On failure, every form must clear busy state and keep its input. Retry must reuse the existing source action key until a success or an intentional form reset. Do not add an offline queue, service worker, or automatic repeated writes.

**Risks and dependencies:** A timeout can occur after the server committed. Reusing the same source action key is required for create and typed mutations. GET requests can retry safely; writes should retry only on the user's click.

**Tests to add or update:** Never-resolving fetch; immediate network rejection; response after timeout; user retry with same key; successful create returned after an earlier lost response; Today busy reset.

**Visible acceptance criteria:** With the backend unavailable, Create matter and Today Chat stop showing **Working…**, keep the entered text, and show one Retry action. After restart, one retry creates only one matter.

**Further diagnosis needed:** If this failure repeats, capture backend process state and a correlation ID before classifying the outage itself as a product defect.

### UXR3-14 — Keep the current action visible while reading long work

**Classification and priority:** Not working well, P3.

**Affected runs, roles, and phases:** Run 6; Senior Product Counsel; research recovery, document review, and closure.

**Frequency:** Repeated within one long matter.

**Evidence:** The actor had to reopen panes and scroll several times to continue the workflow.

**Minimal reproduction:** Not yet measured. Open a long research or final file at the experiment viewport, then move between the file and the next matter action.

**Current behavior:** The workspace stacks orientation, actions, artifacts, remaining work, research queue, and a document pane. The evidence does not identify whether state reset, layout height, or browser automation focus caused each reopen.

**Expected behavior:** Opening a document preserves the selected file and scroll context. The matter's current action remains reachable without reopening the same pane.

**Lawyer and workflow impact:** Extra navigation breaks review context.

**Recovery or workaround:** Reopen the file and scroll back to the actions.

**Cause confidence:** Unknown.

**Cause evidence:** The visible report proves friction but does not isolate a component or state transition.

**Relevant code areas:** `frontend/components/MatterWorkspace.tsx`; document editor/pane components; workspace layout styles; existing workspace browser checks.

**Detailed implementation approach:** Do not redesign the workspace from this evidence. First reproduce at the experiment viewport and record whether the selected path changes or only scroll position is lost. If selection resets, preserve the active path across matter reloads. If only navigation distance is the problem, add one small sticky current-action strip that reuses existing action state and controls. Do not duplicate mutation logic.

**Risks and dependencies:** A sticky control can cover legal text on small screens. Verify 1,024 and 768 pixel layouts and keyboard focus.

**Tests to add or update:** Active path across reload; long-document scroll; sticky control at supported widths; keyboard focus; no duplicate action submission.

**Visible acceptance criteria:** Review a long Run 6-style file, save or reload, and return to the same file. The current matter action remains visible or one click away without reopening the pane.

**Further diagnosis needed:** Required before code changes.

## Cross-run patterns

### Repeated patterns

- Research was the largest source of delay. It was slow, partial, failed, stale, or still active in nine runs.
- Public research often failed, but the product usually preserved useful model-only work. This is a resilience strength and must not be replaced by an empty result.
- State wording drifted between durable records, Chat, the workspace overview, and artifact bodies. Runs 2, 4, 5, 6, 7, 8, and 10 each showed at least one form of this problem.
- The full workflow can complete despite degraded research. Five matters closed, including matters with partial or model-only support.
- Browser timeouts or resets did not normally lose durable data. Runs 1, 4, and 7 recovered saved state.

### One-off but material patterns

- Run 1 exposed a nested tool-argument shape mismatch.
- Run 3 exposed a full local-service availability failure.
- Run 8 exposed a false stop claim and the strongest approval/final contradiction.
- Run 10 exposed cross-turn duplicate work that became a closure blocker.

### Learning effects and limits

- Later actors could often continue from partial research and use manual delivery correctly. They were not given earlier findings, so this appears to come from visible product cues, not cross-run coaching.
- Runs shared one test vault. A matter's background research could remain active while a later run began, but no wrong-matter mutation was reported.
- Briefings with no developments or watch content are not classified as broken because the evidence does not show that a watch or new development existed.
- Direct sending is intentionally unavailable in the MVP. Its disabled control is not a defect.
- Requiring a durable decision before the relevant Explore workflow advances is record integrity. It is not a legal-perfection gate. Run 9 did not finish that step.
- Approval and manual delivery while required work remains are intentional current behavior, covered by lifecycle tests. The defect in Run 10 is duplicate work and an unclear closure path, not the separation of these actions.

## Browser-control errors

- In-app browser access varied by actor. Run 8 explicitly reported that it was unavailable.
- Chrome was repeatedly unavailable across actors.
- Some browser waits timed out or reset in Runs 1, 4, and 7. Reconnection showed that saved data remained.
- These are browser-control environment errors. They are not product defects.
- The normalized evidence does not contain enough per-run detail to list every locator or automation mistake. None is reclassified here as product behavior.

## Environment failures

- The first `/tmp` vault activation failed. A fresh actor created and activated the repository R3 vault. No exception detail beyond the visible failure was retained, so the cause is unknown.
- Run 3 received `Failed to fetch` in both the in-app browser and Safari. This suggests a local service or connection failure, but no server log proves which one.
- Public research repeatedly failed or reached its external timeout. Saved packets name Polaris/public-research timeouts and honestly state **External authority retrieved: No** and **Model-only: Yes**.
- Run 6 had two model/tool execution failures before a manual no-external-tools recovery saved useful research.
- Browser availability and provider availability must stay separate from application defects. UXR3-05 and UXR3-13 address product recovery and state clarity, not an unproved provider or browser root cause.

## Incomplete or contaminated runs

- **Run 3:** blocked before matter creation by the service/connection failure. It is valid evidence for availability and recovery only. It gives no evidence about later workflow phases.
- **Run 5:** reached Ready to send with an approved final. It did not test manual delivery or closure.
- **Run 8:** reached saved approval/delivery state but did not close because research remained active. The final-status and recommendation contradictions remain valid visible evidence.
- **Run 9:** stopped during research with one complete, one partial, one running, and two queued records. It did not test final work, approval, delivery, or closure.
- **Run 10:** recorded approval and manual delivery but did not close because required work remained.
- **Company setup first attempt:** the failed `/tmp` actor did not produce the active test profile. The fresh recovery actor's R3 result is the valid setup state.
- No run was reported as contaminated by coordinator-operated UI work, source inspection during live operation, direct file writes, wrong-matter work, or hidden browser changes.

## Method compliance

The requester produced ten independent fictional requests. Each live attorney actor operated one matter through a directly controlled visible browser and reported visible results. Fallback browser use was allowed and recorded when available. Real external delivery was not performed. **Record manual delivery** only recorded a fictional action outside Counsel OS and explicitly said it contacted no one.

The live actors did not inspect source, call APIs, query the database, read vault files, or change application code. Repository and vault inspection began only after all live work ended. This diagnosis preserves the raw observations and separates product behavior, browser-control errors, and environment failures.

The method has two evidence limits. Exact browser surface and exact requester/attorney model ID were not retained for every run in the normalized synthesis input. Also, Run 3 and the first vault activation have no server log that can establish root cause. This report labels those causes Unknown.

## Normalized execution blueprint

### Thesis

Prove that one Senior Product Counsel can move a matter from exact request to a trusted, usable, and closable work product even when public research is slow or unavailable. The repair must make saved state truthful across Chat, the workspace, research, and final artifacts. It must not add legal-perfection gates or discard useful model-only work.

### Payoff moment

The lawyer approves and records delivery of a model-only-supported final, completes the clearly listed remaining work, and closes the matter without seeing a false answer state, changed decision question, false stop claim, duplicate blocker, or contradictory final status.

### Demo script and acceptance gate

1. Create a new isolated matter with a long exact request.
2. Answer adaptive intake where one nested question is string-encoded in the test provider response. Confirm one save and truthful **Answered** history after reload.
3. Run one broad and one narrow research question with external research forced to time out. Confirm saved model-only/partial packets remain useful and the canonical decision question does not change.
4. Ask Chat to stop the remaining queue. Confirm a typed success result, **Stopped** queue state, retained packets, and no active-research closure blocker.
5. Save a recommendation and force delayed/out-of-order reload responses. Confirm the saved version never becomes an empty overview.
6. Ask Chat three times to create the two Run 10 work items with punctuation variants. Confirm one durable item per normalized title.
7. Try to finalize a draft whose leading status says **Draft for review — not approved**. Confirm finalization is refused with an edit action. Correct the status, finalize, approve, and record manual delivery.
8. Complete the two required work items from the ordered closure list and close the matter.
9. Reopen the closed matter. Confirm **No action**, a quiet closed view, and optional old questions only under **Open context at closure**.
10. Repeat with the backend unavailable during creation. Confirm input is retained, controls recover, and one user retry with the same action key creates only one matter after restart.

### Dependency-safe implementation chunks

The ownership list is exact. An implementer must not edit outside a chunk's files without first updating this plan or handing the file to one owner. Shared files are assigned to only one chunk. Run chunks A through D in order. Chunks E and F start only after their required reproduction tests fail. This avoids speculative changes.

#### Chunk A — Backend record integrity and typed research stop

**Issues:** UXR3-01, UXR3-03, UXR3-06, and backend part of UXR3-08.

**Exact write ownership:**

- `backend/app/tools/handlers.py`
- `backend/app/tools/capabilities.py`
- `backend/app/tools/registry.py`
- `backend/app/models/api.py`
- `backend/app/services/research.py`
- `backend/app/services/research_runs.py`
- `backend/app/services/matters.py`
- `backend/app/services/matter_records.py`
- `backend/app/services/work_product.py`
- `backend/app/agents/output.py`
- `backend/app/blank_vault_template/00_System/agents/counsel-copilot.md`
- `backend/app/blank_vault_template/00_System/tools/stop_research.md` (new)
- `backend/tests/test_matter_action_tools.py`
- `backend/tests/test_agents.py`
- `backend/tests/test_chat_history.py`
- `backend/tests/test_research.py`
- `backend/tests/test_work_product.py`

**Build:** Add narrow nested-card decoding. Expose the smallest existing matter-response projection needed for durable answer history. Remove research authority over a non-empty decision question and persist saved packet results before follow-up projection work. Add the typed stop tool by reusing `ResearchRunService.stop`. Add the leading status-field check before finalization. Keep protected-write validation unchanged.

**Verification:**

```bash
cd backend && pytest tests/test_matter_action_tools.py tests/test_agents.py tests/test_chat_history.py tests/test_research.py tests/test_work_product.py
```

**Exit condition:** The four focused failing cases pass. Existing model-only and protected-path tests still pass.

#### Chunk B — Durable history, one workflow sentence, and quiet closure

**Issues:** UXR3-02, UXR3-04, frontend part of UXR3-05, UXR3-07, frontend part of UXR3-08, and UXR3-15.

**Depends on:** Chunk A operation contract and finalization error text.

**Exact write ownership:**

- `frontend/lib/chatRunLogic.ts`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/lib/matterActions.ts`
- `frontend/lib/matterBrief.ts`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/ResearchQueuePanel.tsx`
- `frontend/lib/types.ts`
- `frontend/scripts/check-chat-run-recovery.ts`
- `frontend/scripts/check-adaptive-intake.ts`
- `frontend/scripts/check-matter-brief.ts`
- `frontend/scripts/check-workspace-ux.ts`

**Build:** Make durable intake answers authoritative and show the answer-save milestone before slow reassessment. Render one combined stage/execution sentence without replacing lifecycle controls. Show saved packet links promptly. Translate protected tool errors into a plain recovery action. Add the quiet closed view. Focus the editable draft after lifecycle-status rejection.

**Verification:**

```bash
cd frontend && npm run typecheck && npm run build
```

Run every checked-in `check-*` script that is part of the existing frontend test command or invoke the four changed scripts by their current repository convention.

**Exit condition:** The state matrix is truthful for closed, Ready to send plus research, partial, stopped, and answered-history cases.

#### Chunk C — Work-item duplicate guard and closure path

**Issue:** UXR3-10.

**Depends on:** Chunk B owns `MatterWorkspace.tsx`. Chunk C must receive that file only after Chunk B is merged and verified.

**Exact write ownership:**

- `backend/app/services/matter_work_items.py`
- `backend/tests/test_matter_lifecycle.py`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/scripts/check-workspace-ux.ts`

**Build:** Add the narrow matter-local normalized-title check. Return the existing item as no-change. Render the ordered closure blocker list with existing assign/complete controls. Do not change approval or manual-delivery rules.

**Verification:**

```bash
cd backend && pytest tests/test_matter_lifecycle.py
cd frontend && npm run typecheck && npm run build
```

**Exit condition:** The Run 10 reproduction creates two work items, not six, and the visible path to closure is complete.

#### Chunk D — Company summary and bounded service recovery

**Issues:** UXR3-11 and confirmed recovery part of UXR3-13.

**Exact write ownership:**

- `backend/app/services/company_interview.py`
- `backend/tests/test_company_interview.py`
- `frontend/lib/api.ts`
- `frontend/components/NewMatterForm.tsx`
- `frontend/components/TodayChat.tsx`
- `frontend/scripts/check-matter-creation.ts`
- `frontend/scripts/check-transport-preservation.ts`

**Build:** Allow a valid model summary to replace the long temporary overview fallback. Add a deterministic no-model summary. Add one bounded request timeout, plain unavailable wording, busy-state recovery, input retention, and same-key user retry.

**Verification:**

```bash
cd backend && pytest tests/test_company_interview.py tests/test_matter_action_api.py tests/test_matters.py
cd frontend && npm run typecheck && npm run build
```

**Exit condition:** A long overview creates a short reviewable summary. An unavailable backend leaves forms usable and one retry creates no duplicate.

#### Chunk E — Recommendation reproduction, then the smallest proved fix

**Issue:** UXR3-09.

**Depends on:** Chunk B, because it owns `MatterWorkspace.tsx` first.

**Exact write ownership:**

- `frontend/components/MatterWorkspace.tsx`
- `frontend/lib/matter-workspace.ts`
- `frontend/scripts/check-workspace-ux.ts`
- `frontend/scripts/check-recommendation-integrity.ts`

**Build:** First write a failing response-order test. Change production state logic only if the test reproduces the empty projection. Use existing refs and version identity. Do not add a backend cache.

**Verification:**

```bash
cd frontend && npm run typecheck && npm run build
```

**Exit condition:** The fail-then-pass test proves saved Version 1 survives stale or failed reloads. If no failing case can be made, stop with diagnosis notes and make no production change.

#### Chunk F — Two diagnosis-gated polish items

**Issues:** UXR3-12 and UXR3-14.

**Depends on:** Chunks B and D.

**Exact write ownership:**

- `frontend/components/CompanyInterview.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/app/globals.css`
- `backend/app/services/company_interview.py` only if the captured payload cannot express skip intent
- `backend/tests/test_company_interview.py` only if the backend contract changes
- `frontend/scripts/check-company-interview.ts` (new)
- `frontend/scripts/check-workspace-ux.ts`

**Build:** Reproduce first. Add session-local skipped-field protection only if a stale response is proved. Add active-path persistence or a small sticky current-action strip only for the measured pane failure. Do not redesign the workspace.

**Verification:**

```bash
cd backend && pytest tests/test_company_interview.py
cd frontend && npm run typecheck && npm run build
```

**Exit condition:** Each production change has its own fail-then-pass reproduction. If an item cannot be reproduced, leave it documented and unchanged.

### Full verification after all accepted chunks

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
graphify update .
```

Then run the demo script above in a new isolated vault. Follow `docs/ACCEPTANCE_TESTS.md`. Confirm the repository vault hash does not change. Record browser surface, viewport, visible labels, console state, and saved artifact paths for the test report.

### Parked backlog with evidence triggers

- **Parallel research execution:** Do not build it now. Consider a concurrency limit only after measured provider-leg timing shows that serial scheduling, rather than provider failure, is the main completion delay.
- **Automatic semantic work-item deduplication:** Do not build embeddings, a matcher, or a merge UI. Reconsider only after normalized exact-title protection still produces harmful duplicates in at least three new matters.
- **Automatic final-text rewriting:** Do not silently change reviewed legal text. Reconsider only if lawyers repeatedly fail to correct the narrow status-field warning.
- **Offline write queue or service worker:** Do not build it. Reconsider only after local-service outages recur and bounded retry with stable action keys is not enough.
- **Permanent company-field skip state:** Keep website skip local to one interview. Reconsider only if users repeatedly need a durable “never use a website” preference.
- **Workspace redesign:** Do not begin from one scrolling report. Reconsider only after a focused reproduction shows the same navigation loss at supported widths in three matters.
- **External-provider replacement or timeout tuning:** Do not change from this experiment alone. First collect provider-leg duration, timeout, and failure-class evidence. Keep useful model-only output in every case.
- **Verifier agents, confidence thresholds, citation gates, or legal-completeness gates:** Not scheduled. They conflict with the product rule to deliver the best available useful answer and are not supported by the observed failures.

## Cause-confidence summary

**Confirmed causes:** UXR3-01; UXR3-02; UXR3-03; UXR3-04; the serial/configured and projection parts of UXR3-05; UXR3-06; the wrong-tool and guard behavior in UXR3-07; UXR3-08; UXR3-10; UXR3-11; the missing bounded fetch recovery in UXR3-13; and the missing answer-save-first presentation in UXR3-15.

**Likely causes:** The brief packet/run status lag in UXR3-05; prompt/tool routing as a contributor to UXR3-07; and an unbounded pending fetch as the reason Run 3 stayed disabled.

**Unknown causes:** The external research provider failures and timeouts themselves; the Run 8 recommendation projection path in UXR3-09; the repeated website question in UXR3-12; the underlying Run 3 service outage; the first `/tmp` vault activation failure; whether pane friction in UXR3-14 is state loss, layout distance, or browser-control focus; and the provider/model latency behind UXR3-15.
