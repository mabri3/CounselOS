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
