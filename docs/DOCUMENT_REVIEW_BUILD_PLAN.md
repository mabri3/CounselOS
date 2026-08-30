# Word-like document review build plan

## Thesis

Counsel OS must let a lawyer review a document without mentally reconstructing edits from a clean text view. The smallest useful version shows Word-familiar inline insertions and deletions, preserves who made each change or comment, imports existing Word revisions, and supports deliberate one-by-one review. It must keep the readable Markdown document as the source of truth and store review data in that document's front matter.

## Payoff moment

A lawyer uploads a Word document with revisions from several authors, sees each author's inline underlines and strikethroughs in stable colors, adds a Themis change and a threaded comment, and accepts or rejects each change without losing author data on Word export.

## Demo script

1. Open a matter and upload a DOCX fixture that contains one insertion, one deletion, and comments from at least two authors.
2. Open the editable Markdown companion.
3. Confirm that **All Markup** is the default view and that the insertion is underlined, the deletion is struck through, and every change shows its author name and stable author color.
4. Use the **Reviewers** filter to show one author. Confirm that filtering changes only the display and never accepts or rejects a change.
5. Change one imported author's color. Reload the document. Confirm that the color remains the same.
6. Set the active session author to the lawyer's name. Edit the document. Confirm that the new change uses that author across another document in the same browser session.
7. Set the active author to **Themis**. Ask Themis to revise the active file. Confirm that the new revision is attributed to Themis.
8. Select text and add a comment. Confirm that the comment appears beside the text and in the right comment rail.
9. Reply to the comment, resolve it, and confirm the message: **Comment resolved. It remains available under Resolved comments.**
10. Show resolved comments, reopen the thread, resolve it again, and choose **Delete thread permanently…** Confirm that only a content-free deletion event remains.
11. Review changes one at a time with **Accept**, **Reject**, **Accept and next**, and **Reject and next**. Confirm that there are no bulk accept or bulk reject controls and no keyboard shortcuts.
12. Switch between **All Markup**, **No Markup**, and **Original**. Confirm that none of these display choices changes the saved review state.
13. Export to DOCX. Inspect the package and confirm that `w:ins`, `w:del`, revision authors, dates, and Word comment parts remain present.

## Build

### 1. Replace inferred authorship with stored review records

Reuse `backend/app/services/document_review.py`, the existing file review endpoints, and Markdown front matter. Replace the baseline-only review representation with versioned review metadata that stores stable revision segments, authors, colors, comment threads, and content-free deletion events.

Required rules:

- `document.content` remains the current visible Markdown text.
- Open deletions remain in review metadata so they can be rendered and restored.
- Every inserted or deleted segment stores a stable change ID, author ID, author name, author color, and creation time.
- Existing baseline-only records migrate on read. Agent revisions use `last_proposed_by` when available; otherwise use the configured lawyer author.
- Accept and reject remain individual operations. Remove `accept_all` and `reject_all` from backend and frontend contracts.
- A save made while tracking is on must go through the review service with the active author. It must not bypass attribution through the ordinary file-save endpoint.
- The active author is passed into agent tool execution. Themis is the default agent author unless the active session author or an explicit user instruction selects another name.

Reuse the current `SequenceMatcher` tokenization for ordinary text changes. Do not build operational transformation, collaborative editing, or a general revision engine. If an edit directly overlaps an unresolved change, preserve the existing revision and record the new replacement as a separate authored change. Cover this rule with a test.

### 2. Import and export native Word review data

Reuse `backend/app/services/ingestion.py`, `python-docx`, and the existing OOXML package handling in `backend/app/services/document_export.py`.

On DOCX import:

- Parse `word/document.xml` for normal runs, `w:ins`, and `w:del`.
- Read `w:author`, `w:date`, and revision IDs.
- Parse `word/comments.xml` and comment range markers.
- Create the extracted Markdown companion with current visible text plus versioned review metadata.
- Keep all imported author names. Never collapse imported authors into Themis.
- Assign each new author the next unused accessible color and store the author-color map with the document.
- Preserve the existing heading, list, and table extraction behavior for documents without revisions.

On DOCX export:

- Write each revision's stored author and date into `w:ins` or `w:del`.
- Do not set a fixed insertion color or deletion color in Word. Word displays revision colors by author.
- Export open and resolved comment threads. Until native Word reply metadata is earned, flatten replies into the anchored Word comment with clear author and time lines. Prefix resolved threads with `Resolved`.
- Permanently deleted thread content must not appear in the export.

PDF export may use the stored author color because PDF has no Word-style dynamic reviewer coloring.

### 3. Make All Markup part of the main editor

Reuse the current Lexical editor and review components. Add the smallest focused revision-node/plugin layer needed to keep deleted text visible while editing.

Required behavior:

- **All Markup** is the default when open changes or comments exist.
- Insertions use the author's color and underline.
- Deletions use the same author's color and strikethrough.
- Author name and date appear on selection or click. Color is never the only author signal.
- **No Markup** shows the current visible document as if open changes were accepted.
- **Original** shows the document before open changes.
- The three modes are display state only.
- A **Reviewers** filter lists names, colors, and open change counts.
- Author colors are assigned automatically. **Change author colors** lets the lawyer select another color from the approved accessible palette for this document.
- Accept/reject controls work on one change only. The `and next` variants select the next visible change.
- Do not add bulk actions or keyboard shortcuts.

Keep Markdown formatting controls working for unchanged and inserted content. Track text insertions and deletions in this build. Park tracked formatting changes.

### 4. Add Word-like comment threads

Replace the browser prompt with an anchored comment composer.

Required behavior:

- Selected text receives a visible anchor highlight.
- Clicking the anchor opens a small contextual popover.
- A right comment rail lists active threads near their anchors.
- Threads support replies, **Resolve thread**, **Reopen thread**, and **Delete thread permanently…**.
- Resolved threads are hidden from the margin by default and remain under **Resolved comments**.
- Resolution shows: **Comment resolved. It remains available under Resolved comments.**
- The resolved list states: **Resolved comments remain with this document until you delete them.**
- **Delete all resolved threads…** is allowed only after confirmation.
- Permanent deletion removes comment text and replies. Keep only a content-free event such as `Comment thread deleted` with thread ID, actor, and time.
- A user can edit or delete only entries authored under the active lawyer identity. Themis-authored and imported entries remain immutable, but their threads can be resolved or permanently deleted by the lawyer.

### 5. Add session author controls

Reuse the flat Markdown settings store.

- Add a **Document review** settings section with **Lawyer name** and **Default review author**.
- Default review author can be Themis or the configured lawyer name.
- The editor toolbar shows the active author and permits a custom name.
- The active choice is stored in `sessionStorage` and applies across documents until changed or the browser session ends.
- A new session starts from the saved default.
- Matter chat sends the active review author with the request. Agent writes and comments use it.
- Support explicit chat phrases `make these changes in my name`, `make these comments in my name`, and `use Themis as the review author` as deterministic session-author switches. Return the selected author in the chat response so the browser session updates.
- The activity trace records `Created by Themis at the lawyer's direction` when Themis performs an action under the lawyer's visible author name. Do not show that provenance inside the document body.

### 6. Verify the assembled workflow

Add backend tests for migration, exact author attribution, comment lifecycle, deletion without content retention, native DOCX import, and DOCX round-trip. Add frontend type checks and build verification. Use an isolated copy of the vault for browser testing as required by `docs/ACCEPTANCE_TESTS.md`.

The browser walk must inspect the actual page. It must test inline markup while editing, author filters, session author persistence across two documents, comment popover and rail behavior, resolved-history wording, destructive confirmations, individual accept/reject navigation, all three display modes, and exported DOCX package structure.

## Parked backlog

- Native Word reply and resolved-state round-trip. Build it after users need Word to reopen Counsel OS threads as native threaded modern comments. The first build flattens replies into one anchored Word comment without losing readable content.
- Tracked formatting changes. Build after lawyers report that bold, style, table, or list-format revisions are material to review.
- Word move revisions (`w:moveFrom` and `w:moveTo`). Build after a supplied document uses them and the basic insertion/deletion importer passes.
- Simultaneous multi-user editing and conflict resolution. Build only after more than one human edits the same Counsel OS document concurrently.
- Cross-document global color identity. Imported Word author strings do not provide a reliable global identity. Keep colors stable within each document until a real identity system exists.
- Comment assignments, mentions, notifications, and tasks. Build only after a lawyer needs another person to receive and act on comments inside Counsel OS.
