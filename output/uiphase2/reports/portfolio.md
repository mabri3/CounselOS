# UI phase 2 portfolio survey

Date: 2026-09-05  
Route base: `http://localhost:3000/`  
Mode: read-only browser survey. No matter was changed. No board card was dragged. No form was submitted.

## Coverage

### Today — `/`

The page loads as “Three things need your attention”. It reports `1 overdue · 1 unassigned · 1 awaiting your judgment` and shows three matter orientation cards. The protected matter `MAT-20260904-abf788` is present as “Instant payouts Q1” with the next action to collect CIP at onboarding. The other two cards are the international expansion and targeted product email matters. Each card has “Read full question”, a primary next-action button, “Discuss”, and “Draft”.

Lower on the page: “Other matter orientations” has 7 available outside the attention list; “Your other matters” shows 2 of 2; “The practice” reports 5 in flight, 0 just came in, 0 being researched, 2 waiting on judgment, 0 being drafted, 3 respond, no current Themis.ai work, and 2 decisions recorded. The “Ask about your work” panel has three suggested prompts, Add files, a conversation selector, a text entry, disabled Send, and Build a skill.

Observed state: populated, no error or empty state in the main queue. The full-page capture repeated the lower fixed content in the rendered image; this is a capture/layout artifact worth checking in an A-style mockup.

### Workspace — `/workspace`

The page reports 5 matters in flight and 2 awaiting judgment. The board has six stage groups: Just came in (0), Being researched (0), Waiting on your judgment (2), Being drafted (0), Respond (3), and Closed (5). The active cards expose next action, owner, due text, and state words such as Overdue, Waiting on you, and Needs assignment. The page instructs that active cards can be dragged and that closure occurs from the matter page. I did not drag.

The lower “This quarter” section reports 5 matters closed, 5 matters in flight, 2 decisions recorded, and 0 decisions needing review. “What the agents did” is empty: “No automation has run yet.” “All activity” links to `/automations`; source confirms there is no separate quarter or activity route/view in this workspace page.

The New matter intake bar is visible. Opening it is read-only and source-confirmed to only set local component state. The open form shows required request textarea, optional title, Type select (7 choices), Priority select (Low/Normal/High), Target date, Close, and a disabled submit until request text exists. I did not type or submit.

### Matters — `/matters`

The list reports 5 in flight and 5 closed. Two view radios are available: Stages and Table. Count filters are 1 overdue, 3 waiting, 0 with Themis.ai, 2 needs assignment, and 0 no action needed. Owner offers All owners and Lawyer. Area has only All areas. Risk offers All risk levels, high, moderate, and Not assessed. The risk helper text says it is the recorded level of legal or business impact.

Table view shows sortable Stage, Next owner, and Due controls and columns for Matter, Stage, Next action, Next owner, Due, and Risk. Stage view groups the same 10 matters by the six workflow stages and provides collapsible stage headers. Empty groups say “No matters in this stage.”

### Decisions — `/decisions`

The register loads with 2 recorded decisions. Filters are All, Needs review, and Mine (configured lawyer). “Check sources again” is enabled but was not used because it can write/update review state. Two open recommendation cards appear above the register, each with a Review link. The table displays recorded date, decision, matter, decider, basis, and Review state. Both records are marked Recorded. The page footer states that recommendations remain separate from recorded decisions until a lawyer records one.

No “Decision review packets” section rendered because the loaded packet list was empty. The first open recommendation’s Review link opened the protected matter `MAT-20260904-abf788` in its read-only Understand view. It showed Overdue, the business question, a purple agent-work answer labeled “NO CITED SOURCES”, a next action “Review and record a disposition”, a stale-source warning, six open issues, source count 0 with “View sources”, decision “Not recorded” with “Record decision”, and collapsed read-only sections for evidence/history, business flow, prior work/watches, research/work, materials/activity, and supporting history. No review action was taken.

## Source-only coverage

`frontend/app/workspace/page.tsx` confirms one combined board/quarter/activity page and the `/automations` destination for “All activity”. `frontend/components/NewMatterForm.tsx` confirms opening the form does not create a matter; creation occurs only in the submit handler. `frontend/app/decisions/page.tsx` confirms packet panels render only when `packets.length` is non-zero, and that the source-audit button invokes a mutating audit call. `frontend/app/matters/page.tsx` confirms the stage/table radios, count filters, owner/area/risk filters, sortable table controls, and drag-to-move handlers.

## Proposed A-style image splits

1. Today: attention queue top; practice summary and chat lower section.
2. Workspace: board overview; lower quarter/activity strip.
3. Workspace: open New matter form and its disabled submit state.
4. Matters: table view with filter controls and sortable headers.
5. Matters: stage view with empty and populated stage groups.
6. Decisions: recommendations band plus register header/filter state.
7. Decisions: recorded decision rows and review-state treatment.
8. Protected matter detail: orientation, agent answer, issue navigator, and decision/source cards.
9. Reserved empty/error variant: Decisions with no packets; Workspace with no automation activity.

## Screenshot note

Seven full-page screenshot captures were taken during the survey and displayed inline in the browser tool output: Today, Workspace board, Matters table, Matters stages, New matter form, Decisions register, and protected matter detail. The protected detail was opened by clicking the first `Review` link in the Decisions open-recommendations band; it navigated to `/matters/MAT-20260904-abf788`. No writing action was used: no audit, refresh, record, complete, save, create, or drag action occurred.

The original CUA runtime returned screenshot bytes for display but did not expose a filesystem write API in its returned documentation. On the follow-up capture request, the browser provider was unavailable after the owned tab had been closed, including after a CUA runtime reset. Therefore no screenshot byte files were written and no fabricated PNG paths are reported. A fresh browser provider session is required to write the requested upper/lower viewport files.
