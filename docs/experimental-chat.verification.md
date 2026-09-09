# Experimental chat

Entry point: `/experimental/chat` (optional `?matter=MATTER_ID`).

This adds a separate conversation surface over the existing matter system. It does not replace the current routes. Shared chat execution is opt-in through `experimental_chat`; document autosave is opt-in through `autoSave` and defaults off elsewhere. Pre-existing working-tree changes were retained.

## Implemented

- Existing matter selection and new matters through the current intake form.
- Separate experimental conversation histories, persisted in the existing Markdown chat records. Existing facts, decisions, research, files and templates remain the shared source of context.
- Editable dialogue, intake, research, answer, draft and audit instructions. Defaults are under `backend/app/experimental_skills`. Overrides save inside the active vault under `00_System/experimental-chat`. Each request freezes the instructions used; an edit does not change a running request's instructions.
- Brief dialogue and issue-map guidance, optional model-supplied quick replies, typed alternatives, and `/audit`. Malformed optional quick-reply output preserves useful prose.
- Explicit document context chips. Context follows the active tab until the user types or explicitly changes context, then stays fixed. Multiple saved documents can be included without changing the explicit edit target. Stale document versions are rejected before submission.
- Durable background chat runs with stop, retry and recovery. Submitted context and versions remain in chat/run records. Unsent messages and context recover locally, scoped by vault, person, matter and conversation.
- Source/claim display uses the existing claim Markdown renderer. Source identifiers resolve against saved evidence; unavailable source markers are labeled unavailable. Source honesty is also included in the editable research instructions.
- Comments-first document review, with explicit direct-edit mode using the existing editor. The experimental editor opts into debounced autosave, retaining existing revision/conflict handling. Existing document pages retain manual save.
- Selection comments use the current document review records. A comment question freezes its passage, thread and revisions. The answer is added to the original thread when that version is still current. On a conflict, the answer stays in chat and identifies the thread-save failure.
- Generated work products open in document tabs. Companion explanations retain the original document/comment return point. Comment links can reopen the companion. Open-document layout, return points and unsent comments are preserved locally.
- Existing decision, approval and lifecycle controls remain explicit. The dialogue instructions distinguish hypotheticals, proposed choices and recorded decisions.

## Verification

- Backend full suite: 1,246 passed (one existing Starlette deprecation warning).
- Subsequent focused experimental suite: six tests cover opt-in/frozen guidance, editable skill conflicts, document-version checks, separate history, comment answers, changed-comment conflicts and optional choices.
- Frontend typecheck and production build passed. The build includes `/experimental/chat`.
- Experimental context, existing document navigation, reference behavior and matter review integration checks passed.
- Isolated browser checks use `backend/tests/serve_experimental_chat_demo.py`. They use a disposable fixture vault and a deterministic provider. They do not switch the active-vault pointer or mutate the user's existing matters.
- The complete browser flow passed after fixing stale page-load requests that could hide a new run. Fast terminal responses also open generated documents. Reloading during a running comment answer preserves its original-comment return link.
- Browser scripts and captures are in `output/experimental-chat/`. The checks cover fixed context, two-document questions, saved history, quick replies, saved comments, comment targeting, reload recovery, companion creation/return and direct editing. Desktop/narrow captures use 1440, 1024 and 390 pixel widths.
- Ten existing pages returned HTTP 200 with no JavaScript page errors: Today, Workspace, Matters, Decisions, Skills, Agents, Automations, Settings, Briefing and a matter workspace. This is a regression smoke test, not a full repeat of all historical acceptance scenarios.
- Existing application endpoints `/experimental/chat` and `/api/experimental-chat/skills` returned HTTP 200.

- `graphify update .` completed. The code graph and report were updated; the HTML graph was skipped because the repository graph exceeds its size limit.

## Limits

The browser provider is deterministic. Real-provider legal synthesis, research quality, citation applicability, audit completeness and instruction adherence still need user evaluation. The instructions do not constitute an independent citation verifier or a guarantee that every output follows the intended style. No external legal authority was retrieved for the browser fixture.

The issue map, optional decision-tree explanation, risk discussion, broad change-impact explanation and preference confirmation are behaviors requested through editable instructions and existing tools. This experiment does not add a new risk engine, change-dependency engine, or replacement decision-map application.

Skill edits apply to new runs. Local message recovery and tab/return state depend on browser storage; durable matter records and submitted conversations remain in the vault.

## Presentation refinement — September 7

The experimental page now has a contained conversation area, a persistent message composer, a searchable and collapsible matter rail, and compact history/file/skill menus. Reading widths, type sizes, spacing, neutral surfaces, focus states, document tabs and return controls were revised. Attachment controls use a styled label over the native file input. Enter sends; Shift+Enter adds a line. Assistant blocks retain the shared agent treatment.

Browser checks passed for the live empty state, matter search, document opening, menu dismissal, and the visible mobile composer at 390 pixels. The isolated browser workflow also passed for two-document context, comments, reload during a run, companion return, and saved edits. Typecheck and production build passed. These are presentation changes; no backend files or existing application pages were changed in this refinement.
