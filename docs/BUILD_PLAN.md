# Build plan

## Rule for every wave

A wave ends with a working application that can be demonstrated. Do not leave broad scaffolding that cannot be exercised.

## Active checkpoint — Markdown WYSIWYG editor

**Status:** Completed and verified on 2026-08-26.

### Thesis

Prove that a lawyer can draft in the third pane as a formatted document without giving up inspectable Markdown as the source of truth. The editor must use one Markdown value for formatted and raw modes, and the existing file API must save that value without a backend storage change.

### Payoff moment

The lawyer formats a Markdown artifact in the third pane, switches to raw Markdown and sees the matching syntax, saves it, and sees the same formatted document after reload.

### Demo script

1. Open an editable Markdown file from a matter tree.
2. Confirm the third pane opens in the formatted editor.
3. Add a heading, bold text, a link, a quote, and a list.
4. Switch to raw Markdown and confirm the matching Markdown is present.
5. Edit the Markdown and switch back to confirm the formatted document changes.
6. Save, reload the file, and confirm the content persists.
7. Open `request.md` and confirm it remains read-only.

### Build

1. Reuse `DocumentPanel` and the existing `VaultDocument` value as the single editing state.
2. Add one focused rich-editor component that converts Markdown to editor state on load and editor state back to Markdown on change.
3. Replace the current Edit/Preview control with a clear Formatted/Markdown toggle. Keep the existing explicit Save action and dirty-state message.
4. Add only the common Markdown controls needed by the demo: headings, bold, italic, links, quotes, and lists.
5. Reuse the current `PUT /api/files` save path. Do not change vault storage or the backend API.
6. Verify conversion behavior, frontend type safety and production build, backend regression tests, and the browser demo script.

### Parked backlog

- Add tables only after real work product shows that lawyers need to create or change tables in the browser.
- Add comments, tracked changes, and accept/reject controls only after the basic formatted drafting flow is validated.
- Add selection-based AI rewrite and diff only after users can reliably edit and save the underlying Markdown.
- Add DOCX round-trip export only after browser-authored Markdown is useful enough to require delivery in Word format.

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

- Native provider adapters.
- Better retrieval.
- External legal research integrations.
- Selection-based rewrite and diff.
- Cloud tenancy.
- Tauri packaging.
- Team collaboration and permissions.
