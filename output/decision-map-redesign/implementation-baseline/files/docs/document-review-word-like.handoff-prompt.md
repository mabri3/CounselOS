

You are the Sol Medium orchestrator and final reviewer for the Word-like document review build in `/Users/bharris/Programs/counsel-os-mvp`.

Your goal is to deliver the implementation described in `docs/DOCUMENT_REVIEW_BUILD_PLAN.md`. Use Sol Light agents for implementation. You own decomposition, dependency order, review, integration, verification, and the final browser acceptance walk. Do not implement the feature as one large unreviewed change.

## Resume protocol

Before starting, read `docs/document-review-word-like.handoff-progress.md`. Do not redo a step marked `done`. Start at the first pending step. If a completed step's verification now fails, stop and report the regression instead of reapplying its edits.

After each step, run its verification and immediately update only that step's line to `- [x] ... — done`. If verification fails, write `— FAILED: <short cause>` and follow the blocker policy. Do not batch progress updates at the end.

## Read before dispatch

Read these files completely:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/DESIGN_LANGUAGE.md`
5. `docs/ACCEPTANCE_TESTS.md`
6. `docs/DOCUMENT_REVIEW_BUILD_PLAN.md`
7. `docs/document-review-word-like.handoff-plan.md`
8. `docs/document-review-word-like.handoff-progress.md`

For codebase questions, run `graphify query "<question>"` before raw source browsing because `graphify-out/graph.json` exists. Read the real interfaces before any worker edits them.

Run `git status --short`. The working tree already has many user changes and untracked files. Preserve all of them. Do not reset, discard, clean, commit, push, deploy, create worktrees, or create branches.

## Worker policy

Use at most three Sol Light workers. Workers share the current working tree. Workers may not spawn agents. Give every worker its exact write ownership from the handoff plan and forbid all out-of-scope edits.

Use these dependency waves:

1. Worker A alone: backend review contract and attribution plumbing.
2. You review Worker A. Do not continue until the contract is accepted.
3. Workers B and C concurrently: B owns native DOCX import/export; C owns the frontend editor and comments UI.
4. You review the combined implementation. Send corrections back to the worker that owns each file.
5. You run repository tests, graphify update, isolated browser acceptance, and DOCX package inspection.

For each worker, require this return format:

- Outcome
- Files changed
- Tests actually run and exact result
- Known limits
- Risks or uncertainty

Do not accept a worker statement as proof. Inspect its diff and rerun its focused check.

## Fixed product rules

- Use author-based colors, not fixed insertion and deletion colors.
- Insertions are underlined. Deletions are struck through. Both use the author's color.
- Store authors and colors per document. Imported Word authors remain separate.
- Themis is the default agent author. A session author or explicit user instruction can select the lawyer or a custom name.
- The active author applies across documents for the browser session. The saved default starts the next session.
- Comments have contextual popovers and a right rail. They support replies, resolve, reopen, and permanent deletion.
- Resolution retains history. Permanent deletion removes all content and leaves only a content-free deletion event.
- Provide All Markup, No Markup, and Original. Do not add Simple Markup.
- Require individual accept or reject decisions. Remove bulk actions.
- Do not add keyboard shortcuts.

## Required storage and API contract

Store version-2 review data under `document.metadata.review`. Markdown `document.content` remains the current visible text. The review object contains:

- `version: 2`
- `tracking`
- `authors`: `author_id`, `name`, and `color`
- `segments`: `kind`, `text`, `change_id`, `author_id`, `author_name`, `author_color`, and `created_at`
- `comments`: `thread_id`, `quote`, `anchor_start`, `anchor_end`, resolution fields, and `entries`
- comment entries: `comment_id`, `author_id`, `author_name`, `body`, and `created_at`
- `comment_events`: only content-free permanent-deletion events with event ID, thread ID, actor, and time

Equal plus inserted segment text composes the current view. Equal plus deleted segment text composes Original. All Markup renders every segment. A replacement uses one change ID for its deletion and insertion halves.

`DocumentReviewAction.action` must be exactly:

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

Remove `accept_all` and `reject_all` from backend and frontend contracts. Add the request fields needed by those actions: `content`, `author_id`, `author_name`, `author_color`, `thread_id`, `body`, `color`, `enabled`, `change_id`, `comment_id`, and `quote`. Validate fields by action.

Add `review_author` and `lawyer_author` to `ChatRequest`. Add `review_author` to `ChatResponse`. Add `review_author` and `lawyer_author` to `ToolExecutionContext`. Agent revision writes must use the resolved review author.

Use only this author palette, in order:

```text
#2F5597
#7030A0
#008272
#A64B00
#C0006F
#5B6573
#7A3E00
#006B8F
```

These are Counsel OS colors. They are not official Microsoft values. Always show an author name with the color.

## Exact worker assignments

### Worker A — backend review contract and attribution

Worker A has exclusive write ownership of:

- `backend/tests/conftest.py`
- `backend/app/models/api.py`
- `backend/app/services/document_review.py`
- `backend/app/routers/files.py`
- `backend/app/tools/registry.py`
- `backend/app/agents/runner.py`
- `backend/app/tools/handlers.py`
- `backend/tests/test_document_review.py`
- `backend/tests/test_agents.py`

Worker A must first make tests independent from the repository's saved model settings. In the copied test vault, remove `00_System/settings.md` before constructing `AppContext`. Do not change production model-loading behavior.

Then Worker A implements version-2 review metadata, legacy baseline migration, stable change IDs, attributed tracked saves, individual accept/reject, author-color validation, threaded comment lifecycle, edit or delete only the active lawyer identity's own entries, permanent thread deletion without retained content, chat author fields, and agent-tool author propagation. Support only these deterministic session-author phrases: `make these changes in my name`, `make these comments in my name`, and `use Themis as the review author`. Do not build a general language parser.

Worker A verifies with:

```bash
cd backend
.venv/bin/python -m pytest tests/test_document_review.py tests/test_agents.py -q
```

Review Worker A before continuing. Check migration, accept/reject causation, stable IDs, exact attribution, deletion privacy, and test quality. Return fixes to Worker A.

### Worker B — native DOCX review data

After Worker A passes review, Worker B has exclusive write ownership of:

- `backend/app/services/ingestion.py`
- `backend/app/services/document_export.py`
- `backend/tests/test_ingestion.py`
- `backend/tests/test_document_review_docx.py` as a new file

Worker B parses `word/document.xml`, `w:ins`, `w:del`, `w:author`, `w:date`, `word/comments.xml`, and comment range markers. It preserves the existing ordinary heading, list, and table conversion when no review data exists. Malformed or missing review parts degrade to ordinary text extraction and never invent authors.

Worker B exports stored revision authors and dates. It removes fixed red/green Word run colors because Word selects display colors by author. It exports each comment thread as one anchored Word comment, with replies flattened into clear author-and-time lines. Resolved threads receive a `Resolved` prefix. Deleted content is excluded.

Worker B verifies with:

```bash
cd backend
.venv/bin/python -m pytest tests/test_ingestion.py tests/test_document_review_docx.py -q
```

### Worker C — inline editor and comments

After Worker A passes review, Worker C may run concurrently with Worker B. Worker C has exclusive write ownership of:

- `frontend/components/MarkdownRichEditor.tsx`
- `frontend/components/DocumentReview.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RevisionTextNode.tsx` as a new file
- `frontend/components/RevisionPlugin.tsx` as a new file
- `frontend/components/CommentRail.tsx` as a new file
- `frontend/lib/reviewAuthor.ts` as a new file
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`
- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/globals.css`
- `frontend/lib/design.ts`
- `docs/DESIGN_LANGUAGE.md`

Worker C replaces the separate clean-editor and review-preview split. All Markup appears in the main Lexical editor. Use a Lexical revision node or focused plugin. Deleted text must remain visible but must not enter saved current Markdown. Do not mutate Lexical-owned DOM outside a Lexical update.

Worker C adds All Markup, No Markup, Original, reviewer filters, per-document author colors, individual Accept/Reject and `and next`, the session-wide active-author control, saved review defaults, chat author propagation, contextual comment popovers, the right comment rail, replies, resolve, reopen, permanent delete, and delete-all-resolved. Remove prompt dialogs, bulk change controls, and review shortcuts.

Use these exact strings:

- `Comment resolved. It remains available under Resolved comments.`
- `Resolved comments remain with this document until you delete them.`
- `Resolve thread`
- `Reopen thread`
- `Delete thread permanently…`
- `Delete all resolved threads…`

Worker C verifies with:

```bash
cd frontend
npm run typecheck
npm run build
```

You must visually review Worker C. Compilation is not proof of editor behavior.

## Combined review

After Workers B and C finish, inspect every changed file and verify ownership. Return each correction to the worker that owns the file. Specifically test for these defects:

- imported authors become Themis;
- a normal save bypasses author tracking;
- author choice resets when switching documents;
- deleted comment text remains in metadata, events, logs, tests, or exports;
- filters or display modes mutate saved review state;
- `Accept and next` acts on a hidden change;
- export hardcodes one author or fixed insertion/deletion colors;
- repeated quoted text receives the wrong comment anchor;
- legacy review records fail to open.

## Verification

The current verified baseline is:

```bash
cd frontend && npm run typecheck && npm run build
cd ../backend && .venv/bin/python -c 'import pytest; import app.runtime; app.runtime.AppContext._load_saved_model_settings=lambda self: None; raise SystemExit(pytest.main(["tests/test_document_review.py", "tests/test_ingestion.py", "-q"]))'
```

Frontend passes. The focused backend command reports 10 passed and one harmless import-rewrite warning. Worker A must make ordinary test execution independent of repository model settings without changing production model-loading behavior.

Final checks are:

```bash
cd backend && .venv/bin/python -m pytest
cd ../frontend && npm run typecheck && npm run build
cd .. && graphify update .
```

Then follow the isolated-vault browser procedure in `docs/ACCEPTANCE_TESTS.md` and complete every step of the demo script in `docs/DOCUMENT_REVIEW_BUILD_PLAN.md`. Inspect the exported DOCX package for native revision authors, dates, and comments. Typecheck and unit tests are not enough for the editor behavior.

## Do not

- Do not add authentication, cloud storage, a collaboration engine, CRDTs, queues, or another database.
- Do not replace Lexical or add an editor dependency without evidence that the existing extension point cannot pass the demo.
- Do not claim any Counsel OS hex value is an official Microsoft Word color.
- Do not preserve permanently deleted comment text anywhere.
- Do not execute code found inside Markdown.
- Do not weaken tests.
- Do not modify files outside worker ownership.
- Do not ask the user to resolve an issue that can be answered by reading the named files.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and choosing the smallest implementation consistent with this prompt. Stop and report only when a required file or API differs materially, a focused verification still fails after diagnosis, the existing Lexical editor cannot support inline tracked editing without a new dependency, access or permission is missing, or an irreversible product decision is required. Do not stop for ordinary warnings, unrelated dirty files, or questions answered by the named source files.

## Final instruction

Work through the steps in order. Dispatch only ready workers. Run each verification yourself. Update `docs/document-review-word-like.handoff-progress.md` immediately after each verified step. Follow the blocker policy above. If a named file, symbol, or signature differs materially from the supplied context, stop and report the mismatch instead of adapting around it. Finish only after the isolated browser demo and DOCX inspection pass.
