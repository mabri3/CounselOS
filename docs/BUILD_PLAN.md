# Build plan

## Rule for every wave

A wave ends with a working application that can be demonstrated. Do not leave broad scaffolding that cannot be exercised.

## Active checkpoint — Matter-led intake, research, and work product

**Status correction — 2026-08-30:** Implemented and verified by the canonical
completion checkpoint. The earlier 2026-08-28 completion claim did not prove
adaptive LLM intake. Current evidence is recorded in
`docs/core-intake-provider-completion.handoff-progress.md` and
`docs/MVP_CLOSURE_AUDIT.md`.

**Closure rule:** This checkpoint now also includes per-agent provider/model/
reasoning selection, OpenCode Go, Codex CLI, Antigravity CLI, and Polaris for
ordinary matter research. Completion requires the exhaustive audit in
`docs/MVP_CLOSURE_AUDIT.md`. No non-Later item may remain pending, failed,
unchecked, or moved to a new plan.

### Outcome

Prove that Counsel OS can turn an incomplete business request into an organized matter without making the lawyer manage the system. The lawyer gets a useful first answer, focused questions, background research, and editable work product. Missing facts or citations can reduce support. They must not block a useful answer.

The MVP is for in-house counsel. Many early matters will concern product work, but the interface and intake prompt must stay general.

### Product model

| Lawyer term | Meaning in Counsel OS |
|---|---|
| Matter | The complete and changing body of work. Facts, issues, chat, research, sources, events, decisions, and work product belong to the matter. |
| Chat | The lawyer's working conversation with the matter. The first part of a new matter is also its intake record. |
| Research | A background activity that answers material open questions. It does not own the matter or block chat. |
| Work Product | A separate draft or final document created for the matter. |
| Dossier | A generated summary of the matter at a point in time. It summarizes and links. It does not own facts, actions, research, or work product. |

Do not add a separate intake-session store. Reuse the existing matter conversation. Do not add a general **Basis and history** page. Show support and change history only from the fact, assumption, issue, recommendation, conclusion, or conflict that it explains.

### What the lawyer sees

- Preserve the current application shell, navigation, three-pane matter workspace, matter tree, chat flow, Markdown editor, button styles, typography, spacing, and Settings patterns. Extend the implemented design. Do not redesign the product for this checkpoint.
- A new matter opens in chat and starts with: **Here is what I understand you are asking. Is that correct?** The original request stays unchanged. The answer updates the working ask.
- Chat asks one focused question at a time in one card. The card has 3–7 plain-language choices, **Something else**, **Skip**, and **No more questions**. No choice starts selected. One choice can be marked **Suggested**.
- Show **X of Y** when the intake agent knows the planned question count. Show **Follow-up** when it does not. The count can change when an answer reveals a new material issue.
- A small information icon explains why a question matters on hover, focus, click, or tap. Do not spend permanent screen space on this explanation.
- After a meaningful answer, show one quiet **Matter updated** card. It can summarize changed facts, issues, assumptions, missing information, people, dates, or work items. It has focused edit and undo actions.
- A material factual conflict becomes the next chat question. The model can propose a resolution. Only a clear user answer can resolve it.
- Technical IDs stay hidden. Use a short description such as “Launch date reported by Sam” in the interface.
- A small looping research indicator shows that work continues in the background. It must not flash, steal focus, or block the lawyer from using chat.
- Each chat composer has a plus button for documents. This includes matter chat and the Today chat.
- The matter tree uses **Work Product**, with **Draft** and **Final** folders. Chat links directly to generated work product and opens it in the existing Markdown editor.
- The dossier appears as a short matter summary with a link to the full editable document. It summarizes and links to work product. It does not replace the matter.

### Background record rules

- Keep `request.md` and conversation messages immutable. Existing request and message IDs are valid source references.
- Create a matter-local fact ID when a reported statement becomes a matter fact. Do not create a global fact registry.
- Keep a separate source reference for every relied-upon fact. A file source uses a stable source ID plus a version or content hash. Company and user profiles stay sources; they do not become shared facts.
- A fact is what was reported. A supporting statement is a separate support record. It can support, contradict, or qualify a fact and links to its source and exact location when available.
- A material correction creates a replacement fact and marks the earlier fact superseded. A wording-only edit can keep the same fact. Never erase the earlier record.
- An unanswered item can become a clearly labeled assumption only when the system needs it to continue. The lawyer can confirm, correct, or leave it. Confirmation creates a new fact and keeps the resolved assumption in the audit record.
- Record conflict detection, the competing statements and sources, the question, the responder, the resolution, and any affected matter output. Keep this detail behind the relevant item.
- Undo withdraws records created by the action. It does not delete sources, messages, or events.
- Keep this audit detail in Markdown metadata and existing matter events. Do not build an evidence graph, event database, or lawyer-facing audit dashboard.

### End-to-end demo

1. In **Settings → Company**, save the company profile to `vault/00_System/company.md`.
2. Create a matter from an incomplete request. Counsel OS creates the matter immediately and opens its intake conversation.
3. Confirm the understanding check. Answer one suggested single-choice question and one multi-choice question. Skip another question, then select **No more questions**.
4. Confirm that each answer is preserved in the conversation and that one compact **Matter updated** card describes the changes.
5. Confirm that facts are matter-local, supporting statements stay separate, assumptions are labeled, technical IDs are hidden, and a material conflict can only be resolved by the user.
6. Confirm that all researchable material open questions start background work through the configured `research-agent`. Keep chatting while the looping indicator updates.
7. Confirm that completed or failed research updates the matter without suppressing the best available answer. Sources and gaps are labeled honestly.
8. Use the plus button to add one document. Confirm that the active agent reads it, asks what the lawyer wants to do, and does not change matter facts only because the file was uploaded.
9. Add more than three documents. Confirm that Counsel OS first gives a short read of the set and one tailored batch-action card. Preview matter changes, apply them once, and undo the batch without deleting the files.
10. Say **Save facts from this chat**. Confirm that it means the current conversation, excludes questions and model analysis, preserves support and conflicts, and produces one **Matter updated** card.
11. Confirm that the dossier summarizes the current matter and links to work product. Add a material fact and confirm that a new draft dossier revision is created without overwriting unsaved lawyer edits. A non-material fact does not force a revision, but **Update dossier anyway** remains available.
12. Ask for work product. Confirm that drafting starts at once unless one material question is required. Open the result from chat in **Work Product → Draft**. Finalize it and confirm that an immutable copy appears in **Final**. Final is not the same as sent or delivered.
13. Run all existing Acceptance Tests A–G. Existing matter stages, research packets, decisions, automations, uploads, Markdown editing, and integrity rules must still work.

### Build order

#### 1. Freeze the small contracts

- Add only four persisted chat card types: question, matter update, research status, and work product.
- Persist cards with the existing conversation message so they survive reload.
- Keep one matter-record service for facts, assumptions, support, issues, conflicts, grouped undo, and record-local history.
- Use the current Markdown files and matter events. SQLite remains a disposable index.
- Extend the existing chat contract for card actions and attachments. Add focused endpoints only for work that is not a chat turn: intake start, research-run status, batch apply/undo, work-product finalization, and company settings.
- Keep the existing file, chat, matter, research, and settings APIs compatible where practical.

#### 2. Complete the matter intake loop

- Update `intake-agent.md` instead of adding an issue-spotting pipeline or fixed legal questionnaire.
- Let the model make a short primer of material questions. Ask the understanding check first, then adapt the primer after each answer.
- A normal intake adds reported facts to the matter without asking for approval for each fact. The **Matter updated** card provides edit and undo.
- Implement **Save facts from…** commands. The unqualified form uses the current chat. Other valid sources include a selected document, meeting notes, the company profile, and all matter chats.
- Make conflict resolution and assumptions follow the background record rules above.
- Create the first dossier after normal intake has a useful foothold. Chat can continue after that. **No more questions** stops intake questions; it does not block an answer or work product.

#### 3. Make research useful and non-blocking

- Route automatic and manual legal research through the existing configured `research-agent`. Reuse the current search service and packet writer. Do not let the research agent call the research workflow recursively.
- Classify open items as researchable or human-dependent. Start research for all material researchable items, with a small execution limit. Keep human-dependent items in chat.
- Use one in-process async task manager and Markdown run records. Do not add a broker, worker service, or queue. If the app restarts, mark an unfinished run interrupted and let the lawyer run it again.
- Keep the existing manual research action. Automatic background research must not change the matter stage. An explicit manual research action can keep the current stage behavior.
- Poll a small status endpoint. Show question count, completed count, useful support, remaining human questions, and dossier effect. Respect reduced-motion settings.

#### 4. Add documents where the work happens

- Reuse the current PDF, DOCX, Markdown, and text extraction. Extend the upload API to accept multiple files while keeping the existing single-file path working.
- Add the plus button to matter chat and Today chat. Support file selection, multiple selection, and browser folder selection without adding a document-management system.
- If the lawyer states the intent with the upload, do it. Otherwise, scan read-only first. For one to three files, ask a focused document question. For more than three or a folder, show one tailored batch card.
- An upload alone adds sources, not facts. Batch-derived matter changes require one preview and one apply action. Normal conversational intake facts do not require this batch approval.

#### 5. Keep dossier and work product in their proper roles

- Store the editable summary at `dossier.md`. Store generated or explicitly saved revisions under `dossier-revisions/`. Use a content hash check so background generation cannot overwrite newer lawyer edits.
- A material matter change can create a new draft dossier revision. Keep the earlier revision. Show the change in chat. A generation or citation failure is recorded and the useful text is still delivered.
- Create `work-product/draft/` and `work-product/final/` for new and existing matters. Do not remove the current `drafts/` folder or break its files.
- The agent creates work product in Draft and returns a chat link. **Finalize** copies the selected draft to an immutable Final file. Delivery remains the existing separate matter action.
- Add the Company section to the current Settings screen. Write `company.md`; do not copy company profile fields into `settings.md` or a database table.

#### 6. Prove the complete slice

- Add backend tests for record integrity, card persistence, intake stopping, conflicts, grouped undo, dossier revision safety, async research, research-agent routing, upload intent, batch preview/apply, and work-product finalization.
- Add or update browser acceptance tests for keyboard and touch use, question-card progress and choices, uploads in both chat composers, background research, dossier links, and Draft/Final work product.
- Compare the finished screens with the current implemented screens. New cards and controls must look native to the existing product and must not move or rename unrelated controls.
- Run `./scripts/verify.sh`. Then walk the end-to-end demo and Acceptance Tests A–G in the browser.
- Run `graphify update .` after application code changes.

### Do not build in this checkpoint

- No fixed product-law questionnaire or hardcoded legal issue taxonomy.
- No separate intake store, global fact registry, general history page, provenance graph, or evidence dashboard.
- No mandatory verifier, citation gate, confidence gate, multi-agent vote, or legal-perfection refusal.
- No auth, cloud tenancy, message broker, embeddings, vector database, plugin marketplace, or new agent framework.
- No automatic cross-matter fact propagation.
- No source-layout-preserving Word/PDF round trip, contract-review module, regulatory-change monitor, or business-user portal.
- No image OCR or vision pipeline. Preserve an uploaded image as a source only until a real workflow proves that image understanding is required.
- No new design system, navigation model, page shell, matter layout, or broad visual refresh.

## Completed checkpoint — Markdown WYSIWYG editor

**Status:** Completed and verified on 2026-08-26.

The matter workspace uses one Markdown value for formatted and raw editing. Headings, emphasis, links, quotes, and lists round-trip through the existing file API. Immutable request files remain read-only. See `decisions.md` for the durable milestone.

## Completed checkpoint — Markdown document review and export

The editor can track typed or agent-proposed changes, add comments to selected text, and accept or reject changes. DOCX export uses native Word comments and tracked changes. PDF export uses standard highlight, underline, and strikeout annotations. Export regenerates layout from Markdown; it does not preserve the source file's layout or import existing review objects.

## Completed checkpoint — Decision-ready matter orientation

**Thesis:** A busy lawyer should understand the matter and the judgment required without opening another file. `dossier.md` remains the one editable matter summary; the overview must not create or store a second summary.

**Payoff moment:** Open a reviewed matter and see a concrete matter summary, a decision question that names the real choices and stakes, material open questions, and the separate agent recommendation.

**Demo script:**

1. Run or complete a matter review.
2. Confirm that the model writes or updates the `Summary`, `Decision question`, and `Open questions` sections in `dossier.md`.
3. Open the matter overview and confirm that it reads those sections from the dossier.
4. Confirm that a matter without a dossier still shows its existing description and next action.

**Build:**

- Reuse `DossierService` and its content-hash protection. Do not add a summary table, metadata copy, or frontend model call.
- Ask the configured model for a short factual summary, one decision-ready question, and a short list of material open questions as part of research review. Preserve useful research output if orientation parsing fails.
- Treat the dossier as the curated orientation view. Keep detailed facts in `facts.md`, legal issues in `issues.md`, and actionable work in work items. Do not add a separate open-questions file.
- Project the three dossier sections through the existing matter orientation response.
- Render summary, question, open questions, and recommendation as separate concepts in the existing overview pane.
- Add focused tests for dossier extraction, fallback behavior, research updates, and the matter response.

**Parked backlog:** Automatic regeneration after every matter mutation remains deferred until observed stale summaries justify that cost. Intake and research are the current refresh points.

## Wave 0 — Verify the scaffold

- Create `.env` from `.env.example`.
- Install Python and Node dependencies.
- Run backend tests.
- Start both applications.
- Verify sample data appears.
- Fix only environment and contract errors.

**Exit:** The command center, matters, decisions, and automations render from the sample vault.

## Wave 1 — Core matter loop

- Verify quick intake creates the standard matter structure.
- Verify card movement writes `matter.md` and an event.
- Verify the matter workspace loads tree and files.
- Verify Markdown save and immutable request handling.
- Verify upload and extraction.

**Exit:** A matter can move from intake to editable workspace without manual file manipulation.

## Wave 2 — Agentic chat

- Verify mock chat.
- Configure a real compatible model.
- Verify tool schemas are accepted.
- Exercise read, search, stage movement, work item creation, and Markdown writing.
- Improve trace and error reporting.

**Exit:** Chat can answer and perform at least three persisted actions.

## Wave 3 — Research

- Verify internal context selection.
- Add optional external search key.
- Improve packet prompt against real product-counsel questions.
- Ensure packet saves and opens.
- Ensure the matter moves to Explore and work item completes.

**Exit:** A product question produces a useful, editable first-pass research packet.

## Wave 4 — Decisions and automations

- Verify global decision indexing and sorting.
- Verify deterministic staleness rules.
- Verify schedule creation from UI and chat.
- Verify inbox watcher creates matters.
- Add run history or error visibility where needed.

**Exit:** The system preserves institutional memory and performs recurring intake work.

## Wave 5 — Demo polish

- Loading states.
- Empty states.
- Keyboard-friendly navigation.
- Resizable panes if still valuable.
- Better artifact-open behavior after research/upload.
- Streaming responses.

**Exit:** A 10-minute demo works without explaining missing core behavior.

## Backlog after validation

- Additional research providers beyond Polaris and the current native search path.
- Better retrieval.
- Selection-based rewrite and diff.
- Cloud tenancy.
- Tauri packaging.
- Team collaboration and permissions.
