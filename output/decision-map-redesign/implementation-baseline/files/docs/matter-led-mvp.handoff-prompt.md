You are the implementation coordinator for Counsel OS. Run this task with `gpt-5.6-sol` at medium reasoning. Use `$parallel-plan-executor`, `$senior-mindset`, `$practical-simplicity`, and `$demo-first` if those skills are available.

Work in `/Users/bharris/Programs/counsel-os-mvp`.

Complete the full matter-led MVP slice below. Do not stop after planning, scaffolding, or a backend-only result. Keep working until the application is integrated, tested, and walked in the browser. I will not be present to answer normal design questions. Make the smallest safe assumption that follows this prompt and record it in `docs/matter-led-mvp.handoff-progress.md`.

## Read and resume first

Before changing application code:

1. Read the complete root `AGENTS.md`.
2. Read `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/BUILD_PLAN.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/matter-led-mvp.handoff-plan.md`, and `docs/matter-led-mvp.handoff-progress.md`.
3. Read `frontend/AGENTS.md` before frontend work. Read the relevant installed Next.js documentation it requires.
4. Run `git status --short`. The worktree is already dirty with user work. Do not reset, revert, discard, or overwrite unrelated changes.
5. Because `graphify-out/graph.json` exists, run:

   `graphify query "matter intake chat cards asynchronous research document upload dossier work product company settings"`

   Use `graphify path` or `graphify explain` only if the scoped query is not enough.
6. Run `./scripts/verify.sh`. The last verified baseline was 51 backend tests passing, frontend typecheck passing, and frontend production build passing on 2026-08-27. Record the new baseline.
7. Update `docs/matter-led-mvp.handoff-progress.md` after each completed step. If context is compacted or work resumes, read that file and continue from the first incomplete item. Do not restart finished work.

## Product result

Counsel OS must turn an incomplete business request into an organized matter with little lawyer effort. It must give a useful first answer, ask focused questions, run useful research in the background, accept documents throughout the work, create editable work product, and maintain a concise dossier summary.

The MVP is for in-house lawyers. Many first matters will be product-related, but do not add a fixed product-law questionnaire or hardcoded legal taxonomy.

The current implemented UI is the design source of truth. Preserve the existing application shell, navigation, three-pane matter workspace, matter tree, chat flow, Markdown editor, Settings layout, button patterns, typography, spacing, and visual tokens. Add only the smallest controls needed for this slice. Do not redesign the look, feel, flow, navigation, or page layout. Do not move, rename, or restyle unrelated controls.

Use these lawyer-facing meanings:

- `Matter`: the complete and changing body of work. Facts, support, issues, chat, research, events, decisions, and work product belong here.
- `Chat`: the working conversation. The start of the first matter conversation is also intake. There is no separate intake-session store.
- `Research`: a non-blocking matter activity.
- `Work Product`: a separate draft or final matter document.
- `Dossier`: a generated summary of the matter at a point in time. It summarizes and links. It does not own records or trigger work.

Do not add a general `Basis and history` page. A lawyer can open support or change history from the specific fact, assumption, issue, recommendation, conclusion, or conflict it explains.

## User-visible behavior

### Intake and question cards

- Create a matter immediately from the original request. Keep `request.md` immutable.
- Automatically start its intake conversation with: `Here is what I understand you are asking. Is that correct?`
- The answer changes the working ask, not the original request.
- The intake agent creates a short, adaptive primer of material questions. It is prompt-guided, not a second pipeline.
- Ask one question in one card.
- Offer 3–7 clear choices, `Something else`, `Skip`, and `No more questions`.
- Support single choice, multiple choice, and free text.
- A single choice submits at once. Multiple choice uses `Continue`. Free text uses Enter or Send.
- No option starts selected. The model can label one option `Suggested`.
- Show `X of Y` when a planned total is known. Show `Follow-up` when it is not. Let the total change when a material follow-up appears.
- Put the short reason behind an accessible information icon. It must work with hover, keyboard focus, click, and tap.
- After a meaningful answer, show one compact `Matter updated` card. It can list changed facts, issues, assumptions, missing information, people, dates, or work items. It has focused edit and undo actions.
- `No more questions` stops intake questions. It does not block research, an answer, a dossier, or work product.
- If a structured card cannot be parsed, preserve and display useful model text. Do not return an empty result.

### Matter records and integrity

- Create a matter-local internal ID when a reported statement becomes a fact. Do not create global facts.
- Keep a separate source reference. Reuse existing request and message IDs. For a file or profile, keep stable source identity plus a version or content hash.
- Company and user profiles are sources. They are not shared facts.
- A fact is what was reported. A supporting statement is a separate support record. It can support, contradict, or qualify and includes a source locator when available.
- A meaning-changing correction creates a new fact and supersedes the earlier fact. A wording-only edit can keep the fact.
- An unanswered item can become an assumption only if it is needed to continue. Show it clearly with Confirm, Correct, and Leave. Confirm creates a new fact and retains the resolved assumption record.
- A material factual conflict becomes the next chat question. The model can suggest a resolution. Only an explicit user answer can resolve it.
- Keep conflict detection, competing statements and sources, the question, responder, resolution, status, and affected output in record-local history.
- Undo withdraws records created by that action. It never deletes sources, messages, or events.
- Do not show technical IDs in normal UI or ordinary reports. Show a useful description instead.
- `Save facts from this chat` means the current conversation. Exclude questions, hypotheticals, and model analysis. Repeated reports add support. Clear corrections supersede. Preserve conflicts. Also support explicit forms such as `Save facts from these meeting notes` or `Save facts from the company profile`.

Use one focused matter-record service that writes the current `facts.md`, `issues.md`, other small matter Markdown records where needed, and existing matter events. Do not add a repository layer, event bus, event database, or graph.

### Background research

- Identify all material open items that can be answered from sources. Separate them from questions that need a human.
- Start research for the material researchable items within a small execution limit.
- Route research analysis through the existing configured `research-agent`. Reuse the current search service and research packet behavior.
- Avoid recursion: the research agent must not invoke the research workflow that invoked it.
- Run asynchronously with one in-process task manager and small Markdown run records. Do not add a broker, queue, daemon, or worker service.
- Chat and the rest of the app stay usable while a run continues.
- Automatic research does not move the matter stage. Keep the existing explicit manual research action compatible, including its current stage behavior.
- If the app restarts during a run, mark it interrupted and allow a rerun. Do not build durable job recovery.
- Show a small looping, non-flashing indicator. Respect reduced motion. Show total questions, completed questions, useful support, human questions left, and dossier effect in an expandable view.
- Completion uses the same Matter updated pattern and never steals focus.
- Search, fetch, citation, tool, or formatting failure can reduce support. It must not suppress a useful answer. Label supplied sources, verified sources, unverified leads, assumptions, and generated analysis honestly.

### Documents in chat

- Add a plus button to `frontend/components/ChatPanel.tsx` and `frontend/components/TodayChat.tsx`.
- Reuse current PDF, DOCX, Markdown, and text extraction.
- Keep the existing one-file upload path working. Add multiple-file and browser-folder selection.
- Store attachment references on the chat turn so they survive reload.
- If the lawyer states an intent with the upload, follow it.
- Otherwise, do a read-only quick scan. Do not mutate matter records.
- For one file, ask a focused singular intent question. For two or three, use a plural card. For more than three or a folder, show one tailored batch card.
- Useful actions include: tell me what is here, combined summary, chronology, compare, conflicts or missing documents, answer my question, propose matter updates, draft work product, research, and something else.
- Uploading adds sources, not facts.
- A batch instruction applies to the set unless the lawyer excludes files.
- Batch-derived matter changes require one Preview updates action and one Apply updates action. One Undo batch action withdraws all records made by the batch while preserving files and history.
- Do not build OCR or a vision pipeline. Preserve image uploads as sources only.

### Dossier

- Keep the current editable document at `dossier.md`.
- Keep generated and explicitly saved revisions under `dossier-revisions/`.
- The dossier summarizes the current ask, known facts, missing information, assumptions, material issues, sources and support, options, working recommendation, relevant decisions, and work-product links.
- It can show up to three possible next actions, but those actions belong to the matter and chat.
- Create the first dossier when normal intake has a useful foothold. Intake can continue.
- A material new fact or useful research can create a new draft dossier revision when analysis changes. A non-material fact does not force one. Keep `Update dossier anyway`.
- Use a content-hash guard. Background work must not overwrite newer lawyer edits in `dossier.md`. If hashes differ, keep the AI revision separate and show Review or Apply.
- Keep prior revisions. Do not snapshot every keystroke.
- Preserve useful dossier text when citations or research fail, and record the gap.

### Work product

- A work-product request starts drafting immediately if there is enough context.
- Ask only one material question if its answer would change the product. Otherwise, state an assumption and continue.
- Create new files under `work-product/draft/`.
- Return a work-product chat card. Its link opens the file in the existing Markdown editor.
- The matter tree displays `Work Product`, then `Draft` and `Final`.
- `Finalize` copies the selected draft to an immutable file under `work-product/final/` and returns a chat link.
- Final does not mean sent or delivered. Keep the current approval, delivery, decision, and closure actions separate.
- Do not delete or break the existing `drafts/` folder or its files.

### Company settings

- Add a Company section to the existing Settings screen.
- Read and write `vault/00_System/company.md` through a small vault-backed API.
- Include simple fields for company summary, business model, products or services, jurisdictions, regulatory context, data practices, and risk posture. Do not turn this into a company database.
- Keep stable source identity and version metadata in `company.md`.
- Do not copy these values into `settings.md` or SQLite.

## Small shared API contract

Before parallel work, the coordinator must define and freeze one small persisted chat-card union:

1. `question`: question ID, text, optional reason, selection mode, 3–7 choices with optional suggested flag, optional progress current and total, and skip/stop/conflict flags.
2. `matter_update`: action ID, short summary, short changed sections, edit flag, and undo flag.
3. `research_status`: run ID, state, total, completed, short status, and dossier effect.
4. `work_product`: title, vault path, draft/final state, and short summary.

Add `cards` to chat responses and assistant-message metadata. Old messages without cards must still load. Extend the existing chat request for card actions and attachment references. Add focused endpoints only for work that is not a chat turn: intake start, research-run status, batch apply/undo, work-product finalization, and company settings.

Keep mock-provider behavior deterministic so the end-to-end intake and card flow can be tested without a real API key.

## Parallel execution

You are the coordinator and own all shared contracts and integration. Spawn at most three `gpt-5.6-sol` workers at low reasoning. All agents share the same worktree. Tell every worker:

- Read root `AGENTS.md` and relevant nested instructions.
- Do not spawn subagents.
- Do not commit, push, reset, revert, or edit outside assigned ownership.
- Preserve user changes.
- Run focused tests for its work.
- Report changed files, proof, risks, and exact integration needs.

Freeze the card, card-action, attachment, research-run, batch-action, work-product, and company contracts before workers edit dependent code.

### Coordinator ownership

Own these high-conflict files and all final integration:

- `backend/app/models/api.py`
- `backend/app/runtime.py`
- backend router registration and shared router edits
- `backend/app/agents/runner.py`
- shared agent-tool registration and result plumbing
- `backend/app/services/chat_history.py`
- `backend/app/services/matters.py` final integration
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- combined verification, browser testing, docs, and graph update

### Worker A: matter records, dossier, and work product

Assign new focused backend services, their tests, `vault/00_System/agents/intake-agent.md`, and lane-specific declarative tools. It implements facts, sources, support, assumptions, conflicts, grouped undo, Save facts from..., dossier revisions, and Draft/Final work product. It does not edit coordinator-owned files.

### Worker B: research runs and document sets

Assign `backend/app/services/research.py`, one small async research-run service, `backend/app/services/ingestion.py`, their tests, and `vault/00_System/agents/research-agent.md`. It implements research-agent routing, async state, interruption handling, multi-file ingestion, read-only quick scan data, and the frozen batch-preview contract. It does not edit coordinator-owned files.

### Worker C: lawyer-facing UI

Assign `frontend/components/ChatPanel.tsx`, `frontend/components/TodayChat.tsx`, new focused card/composer components, `frontend/components/MatterWorkspace.tsx`, `frontend/components/MatterTree.tsx`, `frontend/app/settings/page.tsx`, and focused styles. It first studies and reuses the current components and CSS. It implements the question card, reason control, Matter updated card, research indicator, both plus buttons, upload-set card, dossier links, Work Product labels and links, and Company settings UI without a broad redesign. It does not edit coordinator-owned API or type files after freeze.

Review every worker result. Do not accept TODOs, placeholder controls, unconnected services, dead endpoints, or assertions based only on reading code. Reuse a worker for a repair only when ownership remains disjoint.

## Integration and proof order

1. Freeze contracts and make the smallest shared edits.
2. Run Workers A, B, and C in parallel.
3. Integrate services into runtime, routers, tools, chat history, API clients, and the existing matter workspace.
4. Run focused backend tests after each lane.
5. Update `docs/ACCEPTANCE_TESTS.md` with the new matter-led checks. Do not remove A–G.
6. Run `./scripts/verify.sh` until it passes.
7. Start the backend and frontend. Use the browser to walk every step in the active checkpoint's end-to-end demo and existing Acceptance Tests A–G.
8. Check hover, focus, click, tap, keyboard use, and reduced motion where relevant.
9. Compare each changed screen with the implemented screen. Confirm that the shell, layout, navigation, editor, Settings pattern, and visual style remain intact and that unrelated controls did not move or change names.
10. Confirm chat stays usable during research and card state survives reload.
11. Confirm technical IDs do not appear in normal UI.
12. Force a research or citation failure and confirm a labeled useful answer remains.
13. Fix every defect found in the browser, then rerun the relevant tests and the full verification.
14. Run `graphify update .` after application changes.
15. Update `docs/matter-led-mvp.handoff-progress.md` with exact commands and observed browser results.

## Guardrails

- Follow root `AGENTS.md`, especially its best-available-answer and graceful-degradation rules.
- Reduce lawyer cognitive load. Use lawyer terms. Keep audit mechanics in the background.
- Preserve Markdown as the source of truth and SQLite as a disposable index.
- Keep providers, agents, tools, workflows, and schedules modular.
- Prefer a prompt, direct tool, or small service change before adding machinery.
- Do not add a fixed legal taxonomy, separate intake store, global fact registry, general audit page, provenance graph, evidence dashboard, verifier agent, confidence gate, citation gate, multi-agent vote, refusal gate, auth, cloud tenancy, broker, queue service, embeddings, vector database, OCR, vision system, new agent framework, native Word redlining, contract-review module, regulatory monitor, business-user portal, external connector, new design system, new navigation model, new page shell, or broad visual refresh.
- Do not fabricate sources or imply verification that did not occur.
- Do not change or delete unrelated user work.
- Do not commit, push, deploy, or send anything outside the repository.

## Blocker policy

Do not ask me routine questions. Inspect the repository and use the product rules above. If one lane is blocked, record the blocker and continue all independent work. Use a safe reversible fallback when possible. Stop only for a true blocker that requires a secret, destructive action, external authority, or a product choice not answered here. Do not call the task complete if required behavior remains unimplemented or unverified.

## Completion report

Finish with:

- the user-visible result;
- the main files changed;
- exact test and browser proof;
- any behavior that remains limited or unverified;
- confirmation that existing A–G behavior was preserved;
- confirmation that the progress file and graph were updated.

Do not return a plan-only answer. Implement and prove the complete slice.
