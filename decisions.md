# Decisions and Milestones

Keep entries chronological and append-only. When a decision changes, add a new entry that names the superseded decision.

### 2026-08-25 — Markdown-first local MVP architecture

- Status: `accepted`
- Context: The product must make legal work inspectable and easy to edit while remaining fast to build as a local single-user application.
- Decision: Use a two-process Next.js and FastAPI application. Store authoritative records as Markdown in the configured vault and use SQLite only as a rebuildable index.
- Rationale: This supports direct human inspection, simple file editing, and fast cross-matter queries without committing the MVP to a database-first or distributed design.
- Consequences: File operations must stay inside `VAULT_PATH`; index rebuild behavior must remain reliable; cloud storage, Postgres, and durable workers remain future seams.
- Supersedes: none.
- Evidence: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`.

### 2026-08-25 — Milestone: MVP scaffold documented

- Outcome: The repository contains the planned command center, matter workspace, chat, research, decisions, automations, sample vault, and backend test suite.
- Verification: `docs/IMPLEMENTATION_STATUS.md` records nine backend tests, API smoke coverage, repository contract audit, and frontend source type-check results. Current-machine runtime verification remains pending because dependencies are not installed.
- Affected areas: `backend/`, `frontend/`, `vault/`, `docs/`.
- Next implication: Complete Wave 0 setup and runtime verification before changing feature scope.

### 2026-08-25 — Milestone: Mock-mode MVP acceptance complete

- Outcome: The local MVP passes backend tests, frontend typecheck and build, core API smoke checks, and browser Acceptance Scenarios A through G.
- Verification: `./scripts/verify.sh` reports 12 passing backend tests and a successful Next.js build. The browser walk verified intake, orientation, chat stage movement, research packet opening, document extraction, decision audit, chat-created automation, and inbox ingestion.
- Durable fixes: Setup selects Python 3.11 or newer; empty PDF and DOCX extraction creates an editable companion; research opens its result; schedules wait for their first interval; mock scheduled tasks cannot recreate their own schedule.
- Affected areas: `scripts/setup.sh`, `backend/`, `frontend/`, `README.md`, `docs/IMPLEMENTATION_STATUS.md`.
- Next implication: Configure one real OpenAI-compatible model and verify one direct answer and one tool call before Wave 5 polish.

### 2026-08-26 — Milestone: Markdown-backed WYSIWYG editing complete

- Outcome: Editable Markdown opens as a formatted editor in the matter workspace third pane and can toggle to raw Markdown without introducing a second document format.
- Verification: A browser walk confirmed Markdown-to-formatted rendering for headings, bold, italic, links, quotes, and lists; a formatted bold action generated Markdown; Save persisted after reload; immutable `request.md` rendered with no edit or save controls. `./scripts/verify.sh` passed 13 backend tests, frontend typecheck, and the production build.
- Durable choice: Keep Markdown as the only saved editor value. Use Lexical only as the in-browser editing model and convert on load and change.
- Affected areas: `frontend/components/DocumentPanel.tsx`, `frontend/components/MarkdownRichEditor.tsx`, `frontend/app/globals.css`, `backend/app/services/vault.py`, tests, and product documentation.
- Deferred: Tables, comments, tracked changes, selection-based AI rewrite, diff, and DOCX round-trip remain evidence-triggered backlog items.

### 2026-08-27 — Decision: Best-effort answers and intake-to-dossier checkpoint

- Status: `accepted`
- Context: Attorney interviews consistently favored issue spotting, focused clarification, sourced synthesis, company context, and a decision-ready dossier over a general legal chatbot. The user also directed that missing or unconfirmed citations must not prevent useful answers.
- Decision: Make Issue-Spotting Intake to Decision-Ready Dossier the next checkpoint. Ask one material question at a time, permit the lawyer to stop early, and always produce the strongest useful dossier with assumptions and unsupported points labeled. Preserve usable model output when citation formatting, structured parsing, search, or another support step fails.
- Product shape: Add Company setup inside Settings backed by `vault/00_System/company.md`; use the existing intake agent and matter chat; write one editable `dossier.md` per matter; show a concise dossier summary and counsel action on the matter page.
- Safeguards: Never fabricate support or represent an unverified source as verified. Keep recommendations separate from explicit recorded decisions. Do not add a mandatory verifier, citation gate, multi-agent review, embeddings, or a broad workflow engine.
- Consequences: The dossier loop takes priority over token streaming and general Wave 5 polish. Integrations, continuous monitoring, advanced retrieval, native Word work, and broader legal modules remain evidence-triggered backlog items.
- Evidence: Attorney interview review completed on 2026-08-27; `AGENTS.md`; `vault/00_System/Agents.md`; `docs/BUILD_PLAN.md`.

### 2026-08-27 — Clarification: Intake record and fact corrections

- Status: `accepted`
- Context: Counsel must be able to return to exactly what a requester supplied and must also be able to correct the matter's current facts without losing history.
- Decision: Treat the existing matter-scoped Markdown conversation as the intake session record. Preserve its exact messages, stable message IDs, and timestamps as read-only. Link derived facts to the original request or source message. Correct a fact by marking the old fact superseded and adding the replacement; do not rewrite the transcript.
- Rationale: This preserves the evidence trail while keeping one conversation system and one current fact record. A separate intake database would duplicate the existing authoritative Markdown history.
- Consequences: The dossier uses current, non-superseded facts and links back to source records. It is a synthesis, not the source of truth for what the requester said.
- Supersedes: none; this clarifies the intake-to-dossier decision above.
- Evidence: `backend/app/services/chat_history.py`, `backend/app/services/matters.py`, `docs/PRD.md`, `docs/BUILD_PLAN.md`.

### 2026-08-29 — Decision: Shared semantic color language

- Status: `accepted`
- Context: Today and Matters used different background strengths for the same waiting and overdue states. Stage color could also imply that every item in a stage had the same work state.
- Decision: Use one shared semantic palette across the app. Rose means overdue or failed, amber means the lawyer's attention is needed, purple means agent work, and green means healthy or complete. Use the light Today-style wash for rows, cards, and matter-title cells. Keep stronger tints for compact controls and focused callouts.
- Safeguards: Show a state word with every semantic color. Derive color from the work state, not the workflow stage. Treat legacy decision status `current` as current, not as a review alert.
- Consequences: `docs/DESIGN_LANGUAGE.md` is the canonical design reference. Application code uses `frontend/lib/design.ts` and matching CSS variables instead of page-local attention colors.
- Evidence: Today and Matters visual comparison on 2026-08-29; `frontend/lib/briefing.ts`; `frontend/lib/design.ts`.

### 2026-08-29 — Decision: Continuous Legal Awareness trust boundary

- Status: `accepted`
- Context: Legal developments must be collected from public sources and matched
  to private company facts without sending private context to an external
  intelligence service.
- Decision: A Watch selects `native`, `polaris`, or `both`. Before a provider
  call, Themis.ai converts editable public intent into a validated immutable
  outbound query. Company aliases, internal products, matter IDs, paths,
  emails, and distinctive document excerpts stay local. Explicitly classified
  public Watch subjects are allowed. Company-specific matching runs only after
  collection and only inside Themis.ai.
- Provider limits: Polaris uses the fixed Polaris service and
  `polaris-advisor`. It is advisor-read-only. It has no model discovery, tools,
  function calls, embeddings, arbitrary response schema, redirects, or
  endpoint override. A Polaris citation is Supplied until Themis.ai retrieves
  and checks it.
- Failure behavior: `WatchScanService` coordinates Both mode, preserves useful
  output when one provider fails, reports Partial, and advances only the
  successful provider's checkpoint.
- Consequences: Watch defines collection; saved view defines presentation;
  digest is an immutable view snapshot; review packet prepares judgment. A
  review packet never becomes a decision, and a mitigation requires an
  explicit lawyer record action.
- Supersedes: The 2026-08-27 statement that continuous monitoring remained a
  deferred backlog item.
- Evidence: `backend/app/intelligence/`,
  `backend/app/services/watch_scans.py`,
  `backend/app/services/awareness_matching.py`, and
  `backend/app/services/review_outcomes.py`.

### 2026-08-30 — Decision: Exhaustive MVP closure before Later work

- Status: `accepted`
- Context: Implemented code, acceptance records, and handoff progress files no longer agree. The user directed that one execution prompt finish every buildable MVP item that is not intentionally parked for later.
- Decision: `docs/core-intake-provider-completion.handoff-prompt.md` is the canonical active checkpoint. Completion requires an exhaustive audit of `current.md`, `docs/BUILD_PLAN.md`, `docs/ACCEPTANCE_TESTS.md`, and every handoff progress file. Each unfinished item must be implemented and verified, proven historical or superseded with current evidence, or matched to the explicit Later list. No other disposition is allowed.
- Completion rule: The checkpoint cannot be complete while any non-Later item is pending, failed, unchecked, unverified, omitted, or moved to `Next`. At completion, `current.md` has no `Now` or `Next` work and only the explicit Later backlog remains.
- Safeguards: Preserve historical claims with dated corrections. Do not mark work complete from old check marks alone. Do not silently relabel unfinished work as Later.
- Supersedes: The prior split between an awareness verification goal, a separate intake Next list, and generic provider/research Later items.
- Evidence: User direction on 2026-08-30; `current.md`; `docs/core-intake-provider-completion.handoff-plan.md`.

### 2026-08-30 — Decision: Per-agent model routing and Polaris matter research are MVP scope

- Status: `accepted`
- Context: The current runtime shares one provider across agents, while the user needs each agent to select its own provider and model. Polaris already exists for public intelligence and the user selected it for matter research.
- Decision: Each Markdown-defined agent may persist optional provider, model, and reasoning-effort fields. Empty fields inherit the workspace default. An explicit unavailable selection fails visibly and never silently falls back. The MVP provider set is Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI.
- Research decision: Polaris is the primary public source for on-demand matter research. Public collection goes through the existing outbound privacy policy. Private company and matter context is combined with the public result only inside Themis.ai by the selected Research Agent.
- Consequences: Native provider adapters and Polaris matter research move into the active closure checkpoint. Additional research providers remain Later. Existing recommendation and decision-integrity rules do not change.
- Supersedes: The 2026-08-27 deferral of native provider adapters and the open choice of a commercial research provider for the MVP.
- Evidence: Existing provider boundary in `backend/app/providers/`; Polaris boundary in `backend/app/intelligence/polaris.py`; user direction on 2026-08-30.

### 2026-08-30 — Implementation result: core closure routing and intake

- Status: `implemented`
- Result: Agent definitions persist optional provider, model, and reasoning effort. Each run records the resolved immutable selection. New matters start a background Intake Agent conversation, update source-linked records, protect lawyer-edited dossiers with a content hash, and can queue privacy-safe Polaris research for local Research Agent synthesis.
- Safety boundary: CLI providers receive only the selected agent's typed Themis.ai tools. Polaris receives only validated public research intent. Missing providers fail visibly and do not silently fall back.
- Evidence: 482 backend tests, frontend typecheck and build, and the isolated BSA/AML browser walk on 2026-08-30.

### 2026-08-31 — Milestone: Themis.ai reliability build complete

- Status: `implemented`
- Result: One matter can move from durable intake and truthful research through a recorded decision, one canonical editable work product, linked finalization, approval, delivery recording, and closure. Reload preserves the same work, artifact, risk, decision, activity, and lifecycle state.
- Integrity choices: Deterministic services own mutation evidence, work-item identity, current draft and linked final paths, lifecycle transitions, source classes, and decision records. Useful model output remains visible when a support or mutation step fails. Human edits and decisions keep human attribution.
- Compatibility: Supported legacy drafts are adopted only when no canonical draft pointer exists. Stable stored identifiers and legacy read keys remain mapped at presentation boundaries. Visible product and active-document naming is Themis.ai.
- Review: One independent read-only Sol High reviewer found nine issues. Sol Light corrections resolved all findings and the later revision-warning, company-attribution, and legacy-final compatibility regressions. The same reviewer reported no unresolved material finding after two rechecks.
- Verification: 550 backend tests; every `frontend/scripts/check-*.ts` script; workspace checks; typecheck; production build; graph refresh; isolated browser lifecycle demo; unchanged repository-vault hash; and `git diff --check`.
- Evidence: `docs/themis-ai-reliability-build.handoff-plan.md`, `docs/themis-ai-reliability-build.handoff-progress.md`, and `docs/ACCEPTANCE_TESTS.md`.

### 2026-09-01 — Milestone: Workflow reconciliation complete

- Status: `implemented`
- Result: One matter now moves from immediate visible intake through a durable serial research queue, one canonical draft, a versioned recommendation, explicit lawyer proposal acceptance or direct edit, a disposition-linked durable decision, finalization, approval, manual delivery, required-work completion, and closure.
- Integrity choices: Chat prepares material actions but does not perform them. Approval, durable decision recording, manual delivery, and closure require direct controls. Recommendation proposals do not replace the current version until accepted. SQLite remains disposable and rebuilds from Markdown.
- Provider choices: Research Agent uses exact model ID `kimi-k3-fast`. Matter research supports Polaris, Tavily, or no public provider and preserves useful local/model output with truthful support labels when a public step fails.
- Repair choice: List and board surfaces report durable lifecycle contradictions. Only the derived final-before-Respond mismatch has an automatic repair control. Material approval, delivery, closure, and decision facts are not inferred.
- Verification: 629 backend tests; all focused frontend checks; the older lifecycle check; typecheck; production build; `git diff --check`; fresh visible vault D workflow; disposable SQLite deletion and rebuild; unchanged protected repository-vault hash; and a combined Sol Medium PASS for all 12 review groups.
- Evidence: `docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`, `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md`, and `docs/ACCEPTANCE_TESTS.md`.

### 2026-09-02 — Decision: One authority per matter concept

- Status: `implemented`
- Decision: Use one durable Markdown authority for each matter concept. `matter.md` owns lifecycle data, `facts.md` owns facts and assumptions, `issues.md` owns issues, `participants.md` owns people and roles, conversation records own answered intake cards, and `MatterStateService` owns the resolved next action. SQLite remains a disposable index.
- Read rule: The UI, agents, and deterministic recovery use the resolved matter projection. The projection must not drop frontmatter fields that SQLite does not index.
- Edit rule: Reconcile only the defined structured list forms at the file-write boundary. Keep history and provenance. Do not infer typed facts from arbitrary prose and do not add a general bidirectional synchronization engine.
- Chat rule: Reject a duplicate card answer before queueing or appending it. Create success UI only from a successful typed mutation. Keep internal failed attempts in the trace instead of the main chat card stack.
- Repair: Added complete frontmatter projection, early duplicate-answer validation, answered-card-aware intake recovery, structured record edit reconciliation, and truthful chat-card rendering.
- Verification: 658 backend tests; frontend typecheck and production build; live reload of `MAT-20260902-23c0d3` with zero failed workspace-action cards, zero synthetic `Matter updated` cards, one resolved jurisdiction value, and the saved intake question equal to the resolved next action; graph refresh; and `git diff --check`.
- Evidence: Focused regressions in `backend/tests/test_matters.py`, `backend/tests/test_chat_runs.py`, `backend/tests/test_matter_records.py`, and `backend/tests/test_matter_led_contracts.py`.

### 2026-09-02 — Decision: Runtime-owned built-in contracts and durable card answers

- Status: `implemented`
- Context: An older vault could supply stale built-in agent instructions while the application supplied current tool schemas. A valid question-card answer remained only in the transcript when the model did not call `update_matter_intake`. The same question could then return, while the UI presented an unsupported save claim or an unhelpful priority label.
- Decision: The application owns the current contract, permissions, schemas, and step limit for each built-in agent. Vault agent text remains editable workspace guidance. Each built-in turn receives both, and the current contract wins on conflict. Custom agents remain fully vault-managed.
- Answer rule: Resolve and validate card actions against the saved active question. Save the exact question, explicit answer, source message, and answer status before model analysis. Close the matching open question. Create a source-linked fact. Project a named `record_target` only when the question explicitly declares that target.
- Failure rule: A missing model tool call cannot erase the user's answer. The provider can still add analysis and the next question. Duplicate grouped answers fail before transcript append. Recovery does not present a sole **Continue with assumptions** choice. The UI says **Follow-up question** unless true priority metadata exists.
- Scope limit: Do not infer typed state from arbitrary chat prose. Do not add a general semantic synchronization engine or a vault migration framework.
- Verification: 665 backend tests; frontend typecheck and production build; graph refresh; and a visible old-vault browser check that showed current app-managed tools, removed the resolved CIP card, removed generic no-change text, and recovered a new exception question with three useful choices.
- Evidence: `backend/app/agents/registry.py`, `backend/app/agents/context.py`, `backend/app/routers/chat.py`, `backend/app/services/matter_records.py`, `backend/app/agents/runner.py`, `frontend/components/ChatCards.tsx`, and focused fail-then-pass tests.
