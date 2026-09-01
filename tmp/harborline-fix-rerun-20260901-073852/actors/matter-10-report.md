# Matter 10 evidence

## Method

- Request title: Collecting Additional Information After a Sanctions Alert
- Actor model and reasoning: Fresh Matter Attorney 10 of 10; high-reasoning attorney persona
- Browser used: Codex in-app browser
- Changed-condition recovery attempt: Matter creation first click did not show a state change. After a 1.5-second wait, one forced retry was attempted. The page then showed the created matter at `/matters/MAT-20260901-621511`. No Chrome or Safari fallback was needed.
- Coordinator browser help: None. All live UI actions were performed in the selected browser session.
- Method compliance: Visible-browser-only for live work. No source code, API, database, vault content, prior report, other matter report, or other actor file was inspected. No application code was changed.
- Start time: 2026-09-01 09:00 PDT (approximate)
- End time: 2026-09-01 09:14:53 PDT
- Total minutes: About 15

## Visible workflow

- Matter title and visible ID: `Harborline UX Rerun — 10 — Collecting Additional Information After a Sanctions Alert`; `MAT-20260901-621511`.
- Phases discovered: `Just came in` / intake, `Being researched`, `Being drafted` as a work-product state in chat, `Ready to send` and `Closed` on the workspace board. The matter page exposed `Review intake`, `Run research`, current draft, final response, and matter-record sections.
- Phases attempted: Matter creation; intake questions; intake stop; facts; issue map; work product; draft review; finalization; research with missing-question error; research fallback; decision-record request; participant/work-item inspection; local delivery/closure request; workspace inspection; decision register inspection; reload.
- Highest phase reached: A visible final artifact and a visible best-effort research-packet response were produced. The durable page state remained `Being researched`.
- Participants: Matter overview visibly listed only `Product · Requester` and `Lawyer · Legal owner`. The generated `participants.md` visibly contained only `Participants` and the instruction to add people. The requested operations, partner, vendor, security, consumer, business-owner, and support actors were not visibly recorded as participants.
- Work items and assignment: Nine work-item buttons were visible under `Matter Records > Work to do`, including `Train customer support`, `Design customer communication templates`, `Implement access controls`, `Design customer-facing collection forms`, `Orient to the request`, `Discuss banking partner approval`, `Implement language support`, `Scope payment rail restrictions`, `Implement false-positive metrics`, and `Train sanctions and AML operations`. Opening `Scope payment rail restrictions` showed a saved work-item document with its title and description, but no visible assignee, owner, status control, or completion control. Chat claimed items were assigned across teams, but the matter record did not show those assignments.
- Final intake-card state: Intake showed `Intake is complete. The saved facts and open questions remain available for the dossier and research.` It also showed stopped cards after a repeated question loop.
- Research artifact and provider/fallback state: First `Run research` attempt visibly returned alert `At least one research question is required.` After a chat request for fallback research, chat visibly produced `Research Packet Summary` with supplied facts, `Verified Sources: None available`, unverified leads, and generated analysis. Chat also stated the matter moved to review/approval, but the page and workspace did not persist that transition; no research packet button or saved research artifact appeared in the overview.
- Canonical draft: Saved current draft was visibly opened. It contained developed sections on information requests, restrictions, false-positive review, customer communications, recordkeeping, assumptions, missing facts, unverified leads, recommendations, proposed durable decision, and work items.
- Canonical final: Finalization produced visible status `Final work product saved. The matter is ready for approval.` The contents panel showed `Approved / final response ...` and a saved final document with the developed memo.
- Recommendation: Chat output separated recommendations from a proposed durable decision. It recommended match-relevant data collection, rail-specific and time-limited restrictions, trained operations review, generic customer updates, and need-to-know access.
- Decision relevance: The matter was decision-relevant. Chat proposed a conditional pilot decision. The overview still displayed `No durable decision is recorded for this matter.`
- Recorded decision: Chat output contradicted itself. It first said `The durable decision was not recorded in this response.` It then displayed `Durable Decision Recorded` with title, chosen path, conditions, and open work items. The matter overview still said `No durable decision is recorded for this matter`, and the decision register did not list this matter. No durable decision was treated as successfully recorded.
- Decision register and matter consistency: The visible decision register showed `4 recorded` decisions, but none for Matter 10. This conflicts with the chat claim of a recorded decision.
- Approval: No visible approval action or approval record was available. The final-save status said ready for approval, but the page still showed `Being researched` and `Run research`.
- Local delivery record: No recipient or external-send flow appeared. A local-only delivery request was sent through chat. Chat claimed `Final work product delivered to the fictional Harborline legal workspace`, with `Recipient: None` and `External Contact: None`, but also said `The matter was not closed in this response.` No durable local delivery record was visible elsewhere.
- Required work: Overview showed `Required work` and `Run or supervise first-pass research.` It showed `0 required · 12 optional` items, including the critical rail, partner, and duration questions. After fallback chat output, the overview still showed the research action and the matter remained in research.
- Closed state: Workspace board visibly showed Matter 10 under `Being researched`, not `Closed`. The board showed `8 matters in flight` and `2 closed`; Matter 10 was not one of the closed matters.
- Reload consistency: After navigating to Matter 10 and reloading, the title and saved chat persisted. The page still showed `Stage: Being researched`, `Due: No date`, no research packet in the overview, and no durable decision. This confirmed the chat claims of approval, decision recording, and closure were not persisted.
- Duplicate records: The intake flow repeated `What is the intended duration of the temporary restriction period?` and later displayed repeated stopped cards. The saved facts document visibly repeated the same assumptions several times. The matter contents count grew from 15 to 28 documents during the run, including multiple generated work products and records.
- Internal-output leakage: The editor visibly rendered author text such as `Lawyer` inline in headings and paragraphs. Examples included `1.3 Language SupportLawyer`, `Recommendation:Lawyer`, and fragments such as `researchdossier`. The final saved artifact was readable but contained this internal markup leakage.

## Timing and recovery

- Time to first useful artifact: About 2 minutes to visible intake facts and issue map; about 7 minutes to a developed draft; about 10 minutes to the final artifact and fallback research response.
- Retries: One changed-condition recovery for matter creation after the first click did not show a state change. One browser-locator correction after a strict-mode error on duplicate `Matters` links; the visible main-navigation link was then used successfully.
- Extra clicks: Intake answer selections and sends; `No more questions` to stop the repeated intake loop; six visible `Save as work product` controls were present before selecting the last one; facts, issue map, participants, work-item, final, matter-record, workspace, and decision-register inspections; two chat requests for fallback and local delivery.
- Recovery delay: Matter-creation recovery took about 3 seconds. Fallback research took about 12 seconds after the request. Finalization and saved-state checks took about 1 minute.

## Findings

- Working well:
  - Matter creation accepted the full requester request and exact prefixed title. Visible result: Matter 10 opened with the complete request in chat.
  - Guided intake surfaced material missing facts. Visible questions covered restricted rails, banking-partner approval, and restriction duration. Answers were visibly labeled `Answered` and persisted in the chat after reload.
  - The matter dossier exposed useful structured artifacts. `facts.md` visibly separated known facts and assumptions. `issues.md` visibly listed Regulation E, state money transmission, OFAC, BSA/AML records, communications, and privacy/retention issues.
  - The draft and final work product were substantial and editable. The visible memo covered all requested legal-work areas and kept recommendations separate from a proposed decision.
  - Fallback behavior preserved useful output. When research could not run because no question existed, the chat produced a best-effort packet and clearly labeled `Verified Sources: None available`, unverified leads, and generated analysis.
  - Reload preserved the matter title, request, chat, and generated documents. This supports recovery from navigation and reload.

- Product friction:
  - Phase / intake loop. Exact labels: repeated `What is the intended duration of the temporary restriction period?`, `No more questions`, and `At least one research question is required.` Reproduction: answer the guided duration question, wait, then follow the new cards; the duration question repeats, and the final research action has no research question. Expected: answered intake should advance to the next distinct question or provide a clear research-question editor. Actual: duplicate questions and no visible way to add a research question. Recovery: click `No more questions`, then ask chat for fallback research. Extra work: several waits and about 4-6 extra clicks. Impact: the lawyer must stop an opaque loop and manually request fallback research.
  - Due date loss. Exact visible label: `Due: No date` after the creation form visibly accepted `2026-09-15`. Expected: the target date should remain visible on the matter. Actual: no date appeared on the matter, overview, board, or reload. Recovery: none visible. Impact: weakens deadline tracking for a two-week decision.
  - Participant detail is incomplete. Exact visible labels: `Participants`, `Product · Requester`, `Lawyer · Legal owner`. Expected: the requested operational actors and decision participants should be recordable and visible. Actual: only two generic roles were present, and `participants.md` had no people. Recovery: none visible in the participant record. Impact: weakens authority, escalation, and ownership analysis.
  - Work-item assignment and completion are not visible. Exact visible label: `Work to do`. Expected: each item should show owner/team and completion state. Actual: items were only buttons with no visible assignment or completion controls. Recovery: none visible. Impact: the lawyer cannot verify who owns critical rail, partner, privacy, and operations work.

- Broken behavior:
  - False durable state claims. Exact visible messages: `The durable decision was not recorded in this response.` followed by `Durable Decision Recorded`; later overview showed `No durable decision is recorded for this matter.` Reproduction: ask chat to record the conditional durable decision, wait, open overview and Decisions, and reload. Expected: one consistent persisted decision state, or a clear failure. Actual: chat claims a record while the matter overview, decision register, and reload show no record. Recovery: none visible. Impact: record-integrity failure. Priority P1.
  - False closure and delivery state claims. Exact visible messages: `Final work product delivered to the fictional Harborline legal workspace`, `Matter Status: Closed`, and `The matter was not closed in this response.` Reproduction: ask for local-only delivery and closure, then inspect workspace and reload. Expected: visible local delivery record and Closed board state, or a clear failure. Actual: workspace still shows Matter 10 as `Being researched`; reload preserves that state. Recovery: none visible. Impact: the lawyer cannot trust delivery or closure status. Priority P1.
  - Research transition is not persisted. Exact visible chat text: `The matter has been moved to the review/approval stage. The research packet is ready for your review and editing.` Expected: overview and board should move to review/approval and show the saved packet. Actual: page remains `Being researched`, overview says `No research packet is saved yet`, and board says `Run or supervise first-pass research.` Recovery: fallback chat produced useful text but did not create a visible durable research artifact or transition. Impact: blocks reliable phase completion. Priority P1.
  - Protected work-product write failure. Exact visible alert: `Workspace change failed — write_markdown failed: Use a typed tool for protected matter records and work products.` Reproduction: request chat to save generated work product. Expected: typed record save or a clear user-facing fallback. Actual: error appeared, followed by chat claiming a draft and work items were created. Some artifacts were later visible, but the error and success claim were not reconciled. Impact: makes save status difficult to trust. Priority P1.
  - Final document contains internal author/trace markup. Exact visible examples: `1.3 Language SupportLawyer`, `Recommendation:Lawyer`, `researchdossier`, and `TheLawyer`. Reproduction: open the saved current/final artifact after generation. Expected: clean lawyer-facing prose with author metadata outside the text. Actual: internal labels and fragments appear inline. Recovery: manual editing is possible in the editor, but many fragments require cleanup. Impact: creates rework and risk of forwarding internal output. Priority P2.
  - Saved facts contain repeated assumptions. Exact visible section: `Assumptions` in `facts.md`. Reproduction: open facts after intake generation. Expected: each assumption once. Actual: the same three assumptions repeat multiple times. Recovery: manual editor cleanup. Impact: reduces trust in the dossier and adds review work. Priority P2.

- Browser-control errors:
  - One strict-mode locator error occurred when `getByRole('link', {name:'Matters', exact:true})` matched both the main-navigation link and the matter breadcrumb link. The visible main-navigation scope was used to recover. No product state was changed by the failed locator.
  - The initial matter-creation click did not immediately show navigation. A changed-condition recovery was attempted after waiting; a later locator lookup found the creation form gone, and inspection confirmed the matter had been created. This was recorded as a UI timing/feedback issue, not a duplicate matter.

- Environment failures:
  - No browser-service failure. In-app browser connected and remained usable.
  - The application exposed the protected-record write error above. This is recorded as product/provider behavior because it appeared in the live UI.
  - No external delivery, recipient contact, email, upload, or real-world service action was attempted.

- Blockers:
  - No visible durable path to persist research-stage completion, approval, decision recording, or local closure after the chat claimed success.
  - No visible recipient/external-send flow appeared, so only a local fictional delivery request was attempted.
  - The matter is not complete by visible proof: final artifact saved, but research packet, approval, decision-register entry, local delivery record, and Closed state were not confirmed.
- Visible evidence:
  - Matter URL after creation: `http://localhost:3000/matters/MAT-20260901-621511`.
  - Final page state after reload: `Stage: Being researched`; `Due: No date`.
  - Overview after reload: `No research packet is saved yet`; `No durable decision is recorded for this matter`.
  - Workspace board after reload: Matter 10 under `Being researched`, `No action needed`, with next action `Run or supervise first-pass research`.
  - Decision register after the decision-record request: `4 recorded`; no Matter 10 entry.
