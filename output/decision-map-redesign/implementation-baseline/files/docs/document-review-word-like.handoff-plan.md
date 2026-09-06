# Handoff plan — Word-like document review

## Outcome

Implement `docs/DOCUMENT_REVIEW_BUILD_PLAN.md`. The visible result is an inline, author-aware Word-like review experience that imports native DOCX revisions and comments, supports session-wide author choice and threaded comments, requires individual change decisions, and exports authorship back to Word.

## Fixed product decisions

Do not reopen these decisions:

1. Word's default model is **By author**. Insertions are underlined. Deletions are struck through. Both use the same author color.
2. Counsel OS assigns accessible author colors automatically and stores them per document. A lawyer may change an author's color for that document.
3. Imported Word authors remain separate. Imported authors are never renamed Themis.
4. New agent work is visibly authored by **Themis** unless the active session author or an explicit user instruction selects another author.
5. The active author applies across all documents for the browser session. A new session starts from the saved default.
6. Comments appear both as contextual popovers and in a right-side rail. Comments support replies, resolve, reopen, permanent delete, and delete-all-resolved.
7. Resolved comment content remains until explicit permanent deletion. A deletion leaves only a content-free activity event.
8. The display modes are **All Markup**, **No Markup**, and **Original**. Do not add Simple Markup.
9. Every tracked change is accepted or rejected individually. Remove all bulk change decisions.
10. Do not add review keyboard shortcuts.

## Current verified facts

- `backend/app/services/document_review.py` currently infers changes from one `baseline` and current content. It does not store per-change authors.
- `backend/app/services/ingestion.py::_extract_text` uses `python-docx` high-level paragraphs and loses native Word revision and comment metadata.
- `backend/app/services/document_export.py::_docx` writes all revision authors as `Counsel OS` and sets fixed red/green run colors.
- `frontend/components/MarkdownRichEditor.tsx` edits clean Markdown and uses a browser prompt for comments.
- `frontend/components/DocumentReview.tsx` renders redlines only in a separate review view and exposes `Accept all` and `Reject all`.
- `frontend/components/DocumentPanel.tsx::save` calls the ordinary file endpoint, so tracked saves do not carry an author.
- `backend/app/tools/handlers.py::write_markdown` calls `propose_agent_revision` for existing reviewable work product.
- `backend/app/agents/runner.py` creates `ToolExecutionContext` with only `app`, `matter_id`, and `active_file`.
- Frontend typecheck and production build pass before this work.
- Focused backend tests pass only when saved model settings are bypassed. The repository's saved settings currently override the mock provider in `tests/conftest.py`. Fix test isolation before relying on ordinary `pytest` output.

## Required review metadata contract

Store this under `document.metadata.review` in Markdown front matter. Field spelling is fixed.

```yaml
version: 2
tracking: true
authors:
  - author_id: author-themis
    name: Themis
    color: '#2F5597'
segments:
  - kind: equal
    text: 'Payment is due in '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: '10'
    change_id: CHG-...
    author_id: author-alex
    author_name: Alex Chen
    author_color: '#7030A0'
    created_at: '2026-08-29T12:00:00Z'
  - kind: insert
    text: '30'
    change_id: CHG-...
    author_id: author-alex
    author_name: Alex Chen
    author_color: '#7030A0'
    created_at: '2026-08-29T12:00:00Z'
comments:
  - thread_id: COM-...
    quote: '30 days'
    anchor_start: 18
    anchor_end: 25
    resolved: false
    resolved_at: ''
    resolved_by: ''
    entries:
      - comment_id: MSG-...
        author_id: author-brian-harris
        author_name: Brian Harris
        body: Confirm this period.
        created_at: '2026-08-29T12:01:00Z'
comment_events:
  - event_id: EVT-...
    thread_id: COM-...
    action: deleted
    actor: Brian Harris
    created_at: '2026-08-29T12:02:00Z'
```

`document.content` is the current visible Markdown. Equal and inserted segment text compose the current view. Equal and deleted segment text compose Original. No Markup uses the current view. All Markup uses all segments.

Use one change ID for the deletion and insertion halves of a replacement. Use separate IDs for unrelated insertions and deletions.

## API contract

Replace the current bulk actions. `DocumentReviewAction.action` must be exactly:

```text
set_tracking
save_revision
set_author_color
add_comment
reply_comment
edit_comment
delete_comment_entry
resolve_comment
reopen_comment
delete_comment_thread
delete_resolved_comments
accept_change
reject_change
```

Add optional request fields: `content`, `author_id`, `author_name`, `author_color`, `thread_id`, `body`, `color`, and the existing `enabled`, `change_id`, `comment_id`, `quote`. Validate required fields per action. Reject author colors outside the approved palette. Reject missing or empty author names.

`DocumentReview` responses must include `authors`, `segments`, `changes`, `comments`, `comment_events`, and `tracking`. Each grouped change includes its author fields and creation time.

Add `review_author` and `lawyer_author` to `ChatRequest`. Add `review_author` to `ChatResponse`. Add `review_author` and `lawyer_author` to `ToolExecutionContext`. `write_markdown` must pass the resolved author into `propose_agent_revision`.

## Approved author palette

Use this ordered palette. Store the chosen hex value with the document. These are Counsel OS colors, not claimed Microsoft RGB values.

```text
#2F5597  blue
#7030A0  purple
#008272  teal
#A64B00  orange-brown
#C0006F  magenta
#5B6573  slate
#7A3E00  brown
#006B8F  cyan-blue
```

Never identify an author by color alone. Always show the name.

## Execution topology

The Soul Medium context is coordinator and reviewer. It may make only small integration corrections after worker review. Use at most three Soul Lite workers. Workers must not spawn agents. All workers use the same working tree. Do not create worktrees, commits, branches, or patches for transport.

### Step 0 — Resume and baseline

Owner: Soul Medium coordinator. Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, `docs/ACCEPTANCE_TESTS.md`, the build plan, this plan, and the progress file. Run `git status --short`. Preserve every existing change.

Run:

```bash
cd frontend && npm run typecheck && npm run build
cd ../backend && .venv/bin/python -c 'import pytest; import app.runtime; app.runtime.AppContext._load_saved_model_settings=lambda self: None; raise SystemExit(pytest.main(["tests/test_document_review.py", "tests/test_ingestion.py", "-q"]))'
```

Expected baseline: frontend passes; backend reports 10 passed with one harmless import-rewrite warning.

### Step 1 — Soul Lite worker A: review contract and attribution plumbing

Risk: high. Depends on Step 0.

Write ownership only:

- `backend/tests/conftest.py`
- `backend/app/models/api.py`
- `backend/app/services/document_review.py`
- `backend/app/routers/files.py`
- `backend/app/tools/registry.py`
- `backend/app/agents/runner.py`
- `backend/app/tools/handlers.py`
- `backend/tests/test_document_review.py`
- `backend/tests/test_agents.py`

Worker A must:

1. Make backend tests independent from repository model settings by removing `00_System/settings.md` from the fixture's copied vault before `AppContext(settings)` is created. Do not change production model-loading behavior.
2. Implement version-2 review metadata and read-time compatibility for legacy baseline records.
3. Implement tracked `save_revision` with explicit author attribution.
4. Keep change IDs stable until accept or reject.
5. Implement individual accept/reject. Remove bulk actions.
6. Implement author-color validation and per-document color changes.
7. Implement threaded comment actions, edit or delete only the active lawyer identity's own entries, resolved history, permanent thread deletion, and content-free deletion events.
8. Add chat and tool-context author fields and pass them to agent revisions.
9. Add deterministic explicit-author phrase handling for the fixed phrases in the build plan. Do not write a general natural-language parser.
10. Add tests that first fail on the current implementation and pass on the new behavior.

Focused verification:

```bash
cd backend
.venv/bin/python -m pytest tests/test_document_review.py tests/test_agents.py -q
```

Soul Medium review gate: inspect the schema, migration, accept/reject causation, author propagation, deletion privacy, and tests. Return corrections to worker A before Wave 2.

### Step 2 — Wave 2, Soul Lite worker B: native DOCX import and export

Risk: high. Depends on accepted Step 1. May run at the same time as Step 3 because file ownership is disjoint.

Write ownership only:

- `backend/app/services/ingestion.py`
- `backend/app/services/document_export.py`
- `backend/tests/test_ingestion.py`
- `backend/tests/test_document_review_docx.py` (new)

Worker B must:

1. Parse `word/document.xml`, `word/comments.xml`, and comment range markers from the uploaded package.
2. Preserve ordinary heading, list, and table extraction for documents without review markup.
3. Create version-2 review metadata with imported authors, dates, change IDs, stable document colors, and comment anchors.
4. Export stored revision authors and dates. Remove fixed red/green Word run colors.
5. Export comments and flattened replies. Include resolved threads with a `Resolved` prefix. Exclude permanently deleted content.
6. Keep all paths inside `VAULT_PATH`.
7. Test malformed or missing OOXML review parts. Degrade to ordinary text extraction without inventing authors.
8. Add a round-trip package test that imports a fixture, exports it, and inspects `document.xml` and `comments.xml`.

Focused verification:

```bash
cd backend
.venv/bin/python -m pytest tests/test_ingestion.py tests/test_document_review_docx.py -q
```

### Step 3 — Wave 2, Soul Lite worker C: inline editor and comments UI

Risk: high. Depends on accepted Step 1. May run at the same time as Step 2.

Write ownership only:

- `frontend/components/MarkdownRichEditor.tsx`
- `frontend/components/DocumentReview.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RevisionTextNode.tsx` (new)
- `frontend/components/RevisionPlugin.tsx` (new)
- `frontend/components/CommentRail.tsx` (new)
- `frontend/lib/reviewAuthor.ts` (new)
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`
- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/globals.css`
- `frontend/lib/design.ts`
- `docs/DESIGN_LANGUAGE.md`

Worker C must:

1. Replace the separate clean editor/redline split with All Markup in the main editor.
2. Implement revision nodes or a focused plugin that renders deleted text without putting it into saved current Markdown. Do not manipulate Lexical-owned DOM directly outside a Lexical update.
3. Keep normal Markdown editing and formatting controls working.
4. Add the three display modes and reviewer filters. Display mode and filter are local view state only.
5. Add the session-wide active-author hook backed by `sessionStorage`. Load the saved default at session start.
6. Pass the active and lawyer authors to matter chat. Apply `ChatResponse.review_author` to the session hook.
7. Add the author color editor using only the approved palette.
8. Replace browser prompts with the comment composer, contextual popover, and right rail.
9. Implement replies, resolve, reopen, permanent delete, delete-all-resolved, confirmations, and the exact approved wording.
10. Remove bulk change buttons and do not add shortcuts.
11. Use accessible labels, focus return, Escape-to-close for popovers, and author names beside colors.

Focused verification:

```bash
cd frontend
npm run typecheck
npm run build
```

Soul Medium must visually inspect this worker's result. Typecheck alone is not acceptance for editor behavior.

### Step 4 — Soul Medium combined review and corrections

Wait for Steps 2 and 3. Inspect `git diff` and every new file. Confirm that worker paths stayed within ownership. Review these failure cases:

- an imported author's revision is relabeled Themis;
- a normal save bypasses review author attribution;
- a session author resets when switching documents;
- a deleted comment body remains in front matter, an event, or an export;
- a reviewer filter changes saved state;
- Accept and next skips a visible change or acts on a filtered-out change;
- No Markup or Original mutates content;
- Word export hardcodes one author or fixed red/green revision colors;
- comment anchors silently attach to the wrong repeated quote;
- existing legacy review metadata becomes unreadable.

Send concrete findings back to the worker that owns the file. Do not let one worker edit another worker's ownership. After corrections, re-review the changed sections.

### Step 5 — Repository verification

Run:

```bash
cd backend && .venv/bin/python -m pytest
cd ../frontend && npm run typecheck && npm run build
cd .. && graphify update .
```

Do not weaken, skip, or loosen tests. If unrelated pre-existing failures remain, report the exact test names and prove that all focused document-review tests pass.

### Step 6 — Isolated browser acceptance

Follow the isolation procedure in `docs/ACCEPTANCE_TESTS.md`. Use a temporary vault copy. Never test against the repository vault.

Walk the full demo script in `docs/DOCUMENT_REVIEW_BUILD_PLAN.md`. Capture screenshots of:

1. All Markup with two imported authors.
2. The reviewer filter and author color control.
3. A comment popover and the right comment rail together.
4. The resolved-comments notice.
5. The permanent-delete confirmation.
6. Individual Accept and next with no bulk controls visible.

Inspect the exported DOCX as a ZIP and assert author names and comment text in the correct OOXML parts. Confirm repository vault hashes did not change.

## Do not

- Do not add authentication, collaboration servers, operational transformation, CRDTs, queues, or a new database.
- Do not add a new editor framework or tracked-changes dependency before proving the existing Lexical extension point cannot meet the demo. If blocked, stop and report evidence.
- Do not change Markdown as the source of truth or make SQLite durable review storage.
- Do not implement Simple Markup, bulk accept/reject, or keyboard review shortcuts.
- Do not invent Microsoft hex colors or call the approved palette official Word colors.
- Do not collapse imported authors into Themis.
- Do not retain permanently deleted comment content in traces, events, exports, tests, or logs.
- Do not execute Markdown code.
- Do not modify files outside assigned worker ownership.
- Do not commit, push, deploy, reset, or discard existing changes.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest implementation consistent with this plan. Stop and report when a required file or API differs materially, a focused verification still fails after diagnosis, the existing Lexical editor cannot support the required inline editing without a new dependency, or an irreversible product decision is required.
