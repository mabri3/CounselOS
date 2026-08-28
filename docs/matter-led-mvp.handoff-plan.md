# Matter-led MVP implementation handoff

## Goal

Implement the active checkpoint in `docs/BUILD_PLAN.md` as one working end-to-end slice. Keep the matter at the center. Keep audit detail in the background. Reduce the lawyer's cognitive load.

## Verified starting point

- Repository: `/Users/bharris/Programs/counsel-os-mvp`
- Verified on 2026-08-27 with `./scripts/verify.sh`.
- Backend: 51 tests passed. One existing Starlette deprecation warning appeared.
- Frontend: TypeScript and the Next.js production build passed.
- The worktree already contains many user changes. They are not disposable.

## Required product behavior

### Preserve the implemented product design

- Treat the current UI as the design source of truth.
- Preserve the current application shell, navigation, three-pane matter workspace, matter tree, chat flow, Markdown editor, Settings layout, visual tokens, typography, spacing, and control patterns.
- Add the smallest components needed for question cards, matter updates, research status, uploads, dossier links, and work-product links.
- Do not move, rename, or restyle unrelated controls. Do not create a new design system or broad visual refresh.

### Matter, chat, research, work product, and dossier

- The matter owns the full record.
- The existing matter conversation is the intake record. Do not add an intake-session store.
- Research is a non-blocking matter activity.
- Work product is a separate matter artifact.
- The dossier is a generated summary that links to matter records and work product. It owns none of them.

### Intake card

- Create the matter immediately from the raw request.
- Automatically open intake with an understanding check.
- Ask one question per card.
- Use 3–7 choices, `Something else`, `Skip`, and `No more questions`.
- Support single choice, multiple choice, and free text.
- Mark one choice `Suggested` when useful. Never preselect it.
- Show `X of Y` when known. Show `Follow-up` when unknown.
- Put the reason behind an accessible information icon.
- Preserve the original request and exact conversation messages.

### Matter records

- Give each promoted fact a matter-local internal ID.
- Give each relied-upon source a separate source reference. A file reference includes a version or content hash.
- Keep support separate from facts. A support record can support, contradict, or qualify.
- Keep assumptions separate and clearly labeled.
- A material correction supersedes a fact. It does not erase it.
- Only an explicit user answer can resolve a material factual conflict.
- Persist local history and conflict resolution in Markdown metadata and existing events.
- Never show technical IDs in ordinary lawyer-facing UI.
- Show one compact `Matter updated` card after a meaningful turn. Edit and undo must preserve audit records.
- `Save facts from this chat` means the current conversation. Exclude questions, hypotheticals, and model analysis.

### Research

- Use the configured `research-agent` for the research analysis.
- Research all material researchable open items within a small run limit.
- Keep human-dependent questions in chat.
- Run asynchronously in the current process. Persist a small Markdown run record.
- Do not add a queue, broker, daemon, or worker service.
- Keep chat and the rest of the app usable during research.
- Show a looping, non-flashing status indicator that respects reduced motion.
- Preserve useful output if search, citations, tools, or formatting fail.
- Automatic research does not move the matter stage. Keep the current explicit manual research behavior compatible.

### Documents

- Put a plus button in matter chat and Today chat.
- Reuse current PDF, DOCX, Markdown, and text extraction.
- Keep the existing single-file upload behavior and add multiple-file and browser-folder selection.
- If the user supplies an intent, follow it.
- Otherwise, do a read-only quick scan and ask one tailored intent question.
- Use a singular card for one file, a plural card for two or three, and one batch card for more than three or a folder.
- Uploading creates sources. It does not create facts by itself.
- Batch-derived matter updates need one preview and one apply. One undo withdraws the batch records but keeps files and history.

### Dossier and work product

- Keep `dossier.md` editable.
- Keep revisions under `dossier-revisions/`.
- Use a content-hash guard so a background dossier update cannot overwrite a newer lawyer edit.
- A material change can create a draft revision. A non-material change does not force one. Keep `Update dossier anyway`.
- Create work product in `work-product/draft/`.
- Return a chat card that opens it in the current Markdown editor.
- `Finalize` copies a draft to an immutable file under `work-product/final/`.
- Final is not delivered. Preserve the existing delivery actions.
- Keep the current `drafts/` folder and its files compatible.

### Company settings

- Add `Settings -> Company`.
- Read and write `vault/00_System/company.md`.
- Keep its source identity and version in Markdown metadata.
- Do not copy the company profile into `settings.md` or SQLite.

## Small shared contracts

The coordinator owns these contracts before parallel implementation begins.

### Persisted chat cards

Use one small discriminated card union. Do not create a general UI-schema engine.

1. `question`
   - question ID, text, optional reason, selection mode
   - 3–7 choices with label and optional `suggested`
   - optional current and total progress
   - flags for skip, stop, and factual conflict
2. `matter_update`
   - action ID, short summary, short changed sections
   - edit and undo capability flags
3. `research_status`
   - run ID, state, total, completed, short status, dossier effect
4. `work_product`
   - title, vault path, draft or final state, short summary

Add cards to the chat response and assistant-message metadata. Old messages without cards must still load. Send card choices and attachment references through the existing chat request instead of creating a second chat system.

### Matter record service

Use one focused backend service for facts, assumptions, support, issues, conflicts, grouped update actions, and withdrawal. It writes the existing matter Markdown files and events. Do not build repositories, an event bus, a graph, or a new storage layer.

### Background research

Use one in-process task manager and small run-status endpoints. The research service can gather sources, then invoke the existing agent runner with `agent_id="research-agent"`, and persist the reply as the current research packet. Do not expose a recursive `run_research` tool to that agent.

## Dependency-safe execution

Run one Sol Medium coordinator and at most three Sol Light workers. The repository has one shared worktree. Workers must not commit, reset, revert, or spawn more workers.

### Coordinator — shared contracts and integration

Own all shared or high-conflict files:

- `backend/app/models/api.py`
- `backend/app/runtime.py`
- backend router registration and shared routers
- `backend/app/agents/runner.py`
- shared agent tool registration and result plumbing
- `backend/app/services/chat_history.py`
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- final changes in `backend/app/services/matters.py`
- cross-lane integration, tests, browser proof, docs, and `graphify update .`

Before dispatch, define the card, card-action, attachment, research-run, batch-action, work-product, and company contracts. Make only the smallest shared edits needed to let workers compile against them.

### Worker A — matter records, dossier, and work product

Primary ownership:

- new focused services for matter records, dossier revisions, and work product
- new backend tests for those services
- `vault/00_System/agents/intake-agent.md`
- any new declarative tool files that are used only by this lane

Deliver:

- matter-local facts and source references
- separate support and assumptions
- conflict resolution and grouped undo
- `Save facts from...`
- safe dossier revisions
- Draft and Final work product behavior

Do not edit the coordinator-owned shared files. Send exact integration needs to the coordinator.

### Worker B — research runs and document sets

Primary ownership:

- `backend/app/services/research.py`
- one new small async research-run service
- `backend/app/services/ingestion.py`
- research and ingestion tests
- `vault/00_System/agents/research-agent.md`

Deliver:

- configured research-agent routing
- async run status with graceful interruption
- multi-file ingestion while preserving single-file behavior
- read-only quick scan information for intent cards
- batch preview/apply data contracts as specified by the coordinator

Do not edit the coordinator-owned shared files. Send exact integration needs to the coordinator.

### Worker C — lawyer-facing UI

Read `frontend/AGENTS.md` and the relevant installed Next.js documentation before editing.

Primary ownership:

- `frontend/components/ChatPanel.tsx`
- `frontend/components/TodayChat.tsx`
- new focused chat-card and composer components
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/app/settings/page.tsx`
- focused styles and frontend component tests if the repository supports them

Deliver:

- an extension of the current implemented look, feel, and flow, with no broad redesign
- one-question card and accessible reason control
- compact Matter updated card
- background research indicator
- plus-button file, multi-file, and folder selection in both chat composers
- dossier summary and links
- Work Product/Draft/Final labels and links
- Company settings section

Do not edit coordinator-owned API or type files after contract freeze. Send contract defects to the coordinator.

## Integration order

1. Read repo instructions, product docs, this plan, and current diffs.
2. Run the baseline verification and record it in the progress file.
3. Coordinator freezes the shared contracts.
4. Dispatch Workers A, B, and C in parallel.
5. Coordinator reviews each result against its acceptance behavior. Do not accept placeholder UI, TODOs, or unconnected services.
6. Coordinator wires services, routers, runtime, tools, and API clients.
7. Run targeted backend tests after each integrated lane.
8. Run `./scripts/verify.sh`.
9. Start the app and walk the full demo plus Acceptance Tests A–G in the browser.
10. Fix observed defects. Reuse a worker only for a clearly owned, disjoint repair.
11. Run `graphify update .`, then rerun verification if it changes tracked application context.
12. Update the progress file and `docs/ACCEPTANCE_TESTS.md` with observed results.

## Proof required

- Existing 51 backend tests stay green, with new tests added.
- Frontend typecheck and production build pass.
- Existing Acceptance Tests A–G still work.
- A fresh matter completes the end-to-end demo in `docs/BUILD_PLAN.md`.
- Chat stays usable while research runs.
- Card state survives reload.
- Technical IDs do not appear in the normal UI.
- A citation or research failure still gives a labeled, useful answer.
- No unrelated user change is reverted.

## Stop line

Do not add auth, cloud tenancy, a broker, a global fact system, a general audit screen, embeddings, an OCR or vision pipeline, a fixed issue taxonomy, a new agent framework, verifier agents, legal perfection gates, native Word redlining, a contract-review module, external connectors, a new design system, new navigation, or a broad visual refresh.
