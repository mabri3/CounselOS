# Current Project State

Last updated: 2026-08-26

## Active Goal

Hold after the completed Markdown WYSIWYG checkpoint until the next user-approved Wave 5 task.

## Why This Goal Now

The third pane now supports formatted drafting and raw Markdown with one shared Markdown value. The checkpoint is complete and verified, so no additional feature work should start without a new direction.

## Work Queue

### Now

- [ ] Select the next Wave 5 checkpoint with user direction before implementation.

### Next

- [ ] Continue Wave 5 loading, empty, error, navigation, and artifact-open polish after the editor checkpoint.
- [ ] Add token streaming only after the configured provider workflow is reliable.

### Later

- Native provider adapters after the OpenAI-compatible path is reliable.
- Better retrieval and external legal research integrations after the local research flow is useful.
- Selection-based rewrite and diff after the focused Markdown editor is validated.
- Cloud tenancy, Tauri packaging, team collaboration, and permissions after the local workflow proves value.

### Blocked

- Full repository change audit — the current path is not a Git working tree, so no Git status or diff is available.

## Active Assumptions

| Assumption | Basis | Confidence | Invalidating evidence |
|---|---|---:|---|
| The local web app is the current product boundary. | `docs/PRD.md`, `docs/ARCHITECTURE.md` | high | A user-approved scope change. |
| Mock mode is the baseline because it needs no model key. | `.env.example`, `README.md` | high | Startup requires a configured external provider. |
| Markdown is authoritative and SQLite is disposable. | `AGENTS.md`, `docs/ARCHITECTURE.md` | high | Code or an approved design decision makes another store authoritative. |

## Verified Evidence

- FastAPI backend, Next.js frontend, Markdown vault, and SQLite index are the documented architecture — `docs/ARCHITECTURE.md`.
- Six sample matters, four agents, twelve tools, and two schedules exist in `vault/`.
- Core API routes are documented for health, configuration, matters, files, chat, decisions, and automations — `docs/API.md`.
- Thirteen backend tests pass — `./scripts/verify.sh`.
- Frontend typecheck and the Next.js production build pass — `./scripts/verify.sh`.
- Health, config, matters, decisions, and automations return HTTP 200 with the six-matter sample vault.
- Browser Acceptance Scenarios A through G pass in mock mode.
- A live OpenAI-compatible provider request returned a valid function tool call through the existing provider interface — `docs/IMPLEMENTATION_STATUS.md`.
- The third pane rendered Markdown headings, emphasis, links, quotes, and lists; formatted edits generated Markdown; save persisted after reload.
- Immutable `request.md` rendered as formatted read-only content with no toolbar or Save button.
- `./scripts/verify.sh` reports 13 passing backend tests, a passing frontend typecheck, and a successful production build.

## Recent Changes

- Completed Wave 0 and the mock-mode MVP acceptance walk.
- Made setup select Python 3.11 or newer and made direct `pytest` collection reliable.
- Opened command-center research results directly in the matter editor.
- Added an editable companion for empty or image-only PDF and DOCX extractions.
- Prevented new schedules from running immediately and prevented mock scheduled tasks from creating schedule copies.
- Replaced the plain Markdown preview with a Lexical-backed WYSIWYG editor and a Formatted/Markdown toggle in the third pane.
- Made immutable Markdown read-only at the vault document boundary and added a regression test.

## Open Questions

- None for this checkpoint.

## Exit Conditions

- [x] Editable Markdown opens as a formatted document in the third pane.
- [x] Formatted and raw Markdown edits round-trip without a second storage format.
- [x] Saving persists after reload, and immutable Markdown stays read-only.
- [x] Backend tests, frontend typecheck, frontend build, and the focused browser walk pass.

## Next Resume Action

Wait for user direction, then select one bounded Wave 5 checkpoint from the remaining queue.
