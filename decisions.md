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
