# Matter review and decision map implementation plan

Status: Proposed. Planning only; no application changes or agent dispatch yet.
Date: 2026-09-05
Reference matter: `MAT-20260904-abf788`.

User additions: include interactive hypothetical exploration in the decision map.
Redesign document navigation for multiple work products and reference documents,
including consistent behavior when a document is linked elsewhere in the UI.

## 1. Thesis

A lawyer should see what needs review, why it matters, and what to do next
without reading the whole matter page. An issue should connect its explanation,
supporting law, factual questions, possible responses, work, and recorded
decisions. A separate decision map should make those relationships visible.

Use a decision map with conditional branches. A strict tree is too restrictive:
one question or authority can affect several issues. The map is a view of saved
matter records, not another source of truth or an automated legal decision engine.

### Evidence from the current implementation

- `frontend/components/workspace/IssueNavigator.tsx` exposes title, parent, and
  lawyer state. Its states are Open, Explored, and Set aside. It does not present
  a complete path to mitigation or resolution.
- `backend/app/models/workspace.py` already has issue-to-fact, assumption, and
  claim references. Supporting questions already have an optional `issue_id`.
- `UnderstandPanel.tsx` places supporting questions and issues in separate
  sections. It also renders saved answers and claim evidence separately.
- `EvidenceDrawer.tsx` already supports a source URL, saved source, exact
  available passage, location, support state, and generated explanation.
- `workspace_actions.py` can save claim evidence and parse `[source:ID]`
  references. `workspace_evidence.py` preserves source identity and support state.
- `answer_contract.py` already instructs the model to cite material claims.
  Another prompt alone will not prove that links reach every relevant surface.
- `MatterWorkspace.tsx` renders the selected work item as one crowded inline
  surface. `DraftWorkspace.tsx` reserves a large second column for conversation.
- `workspace_scenarios.py` already stores issue links, proposed fact changes,
  unresolved conditions, analysis, and source links. Reuse these for branches.
- `DraftWorkspace.tsx` already lists multiple artifacts under **Available work
  product**, below the editor and drafting tools. `MatterFilesPanel.tsx` has
  source, extracted-text, and generated-output links in a separate drawer.
  Multiple documents exist in the model but are not prominent in the reading UI.

These are code observations and screenshot findings. The reference matter's
legal conclusions have not been verified. Do not treat its BSA, CIP, AML, or
money-transmission assertions as correct test expectations.

## 2. Payoff moment

The lawyer opens a priority issue, checks its legal basis, answers a linked
question, sees which proposed path changes, and records a mitigation or decision
that remains visible after reload.

## 3. Demo script

Use an isolated test vault with a realistic matter based on the reported layout.
Preserve the user's reference matter. Include long titles, six issues, shared
questions, an unanswered legal question, incomplete source support, and a
recorded decision.

1. Open the matter at 1141 × 1006 and 1042 × 1006. The first screen shows the
   business question, a short working answer, and the first action needing review.
   General tools and completed history do not push these below the first screen.
2. Read up to three items under **Needs your review**. Each names the issue,
   explains why it appears here, shows who must act, and has a specific action.
   **All issues** remains one click away, with an accurate count.
3. Open an issue. See a short title, full explanation, applicable law and its
   application, related questions, possible responses, and existing work/decisions.
   Title and parent editing are under **Edit issue details**.
4. Select an inline citation. Read the exact available passage, section reference,
   source status, and explanation of how it supports this claim. Open its public
   URL or saved source. Return to the same issue and position.
5. Open an issue with no source support. See **No cited sources** and a contextual
   **Research legal basis** action. Useful analysis remains visible.
6. Answer a factual question from the issue. The saved answer appears in both
   the question view and the issue. Start reassessment explicitly. It produces
   a proposed update; it does not silently resolve the issue.
7. Open **Decision map**. Select the same issue. Follow a labeled condition to
   a proposed option, mitigation work, and any recorded decision. Show an
   unanswered condition as unknown, not as a selected path.
8. Select **Discuss this issue** or **Discuss this path** well below the page
   header. The same conversation opens with the selected context visible.
   Unsent text and earlier conversation remain intact.
9. Create mitigation work using the existing work mechanism. Its owner and state
   appear under the issue and in the map. Completing work alone does not record
   a legal decision or close the matter.
10. Record an issue disposition with a reason through a direct lawyer action.
    Where a formal decision is needed, use the existing decision form. Cancel
    once to prove that opening the form changes nothing. Then save and reload.
11. Return from the map. Selection, saved state, source links, and conversation
    context agree. Historical analysis remains available when facts change.
12. From a map branch, select **Try a different assumption**. Enter a hypothetical
    fact and run analysis. See the baseline and proposed outcome, affected issues,
    sources, and unresolved conditions. The matter's real facts do not change.
    Save the scenario, return later, and explicitly adopt a fact change only
    through the existing fact action. Recording a decision remains separate.
13. Open Draft with three work products and two source documents. Before scrolling,
    see document counts, names, the active document, and how to switch. Open two
    drafts, edit one, switch away and back, and confirm its unsaved text remains.
14. Follow a source reference from an issue, chat answer, map detail, and draft.
    Each opens the named source and cited passage where an exact locator exists.
    Read it beside the draft, then return to the originating passage or issue.
15. Open a final work product and a supplied source. Their read-only state is
    explicit. Editing a source requires an explicit working copy. Export/revise
    actions name and operate on the selected editable work product, even when
    a source preview has focus. Closing a tab does not delete the document.

Repeat layout checks at 1440, 1024, 768, and 390 pixels and native 200% zoom.
Keyboard users must reach the same records and actions without using the canvas.

## 4. Build

### A. Review order and page layout

- Put a compact question and working answer at the top. Keep material
  qualifications beside the answer. Keep full wording behind **Read full answer**.
- Follow with **Needs your review**, then **All issues**, then collapsed
  supporting material and history. Show answered questions within their issue
  rather than a long expanded list before the issues.
- Reuse orientation and work state for a simple stable order: explicit required
  lawyer actions first, then unresolved items with a recorded material impact,
  then remaining open issues. Use existing due dates and saved order as tie-breaks.
  Show the reason for priority. Missing priority means unranked, not low risk.
- Reuse semantic colors and state words from the design language. Amber means
  lawyer attention, purple means agent work, green means complete, and rose means
  failed or overdue. Do not present every open issue as the same purple badge.
- Show short issue labels with the full original statement available. Do not
  silently replace a lawyer's wording with an AI summary.
- Move secondary matter tools into a compact tools menu. Make the work banner
  wrap into separate title, state/owner, and action rows as space narrows. Label
  its dismiss control **Close panel** to distinguish it from closing work.
- Keep one conversation. In Understand view, use a collapsible discussion rail
  so it does not always take half the reading width. Contextual Discuss controls
  open it at the relevant issue, claim, question, or path. Discuss mode remains
  available at the top; do not repeat the whole mode switch for every section.
- Use section navigation that remains reachable on a long page. On narrow
  screens, discussion opens as a focused panel with a clear return action.

### B. Issues that support action

Each issue detail has this reading order:

1. **What needs your judgment**: current state and one next action.
2. **Why this matters**: consequence for the business request.
3. **Legal basis**: material claims, authority, and why the rule applies.
4. **Questions that change the answer**: saved answers, open facts, and legal
   research questions. A legal interpretation question must not be stored as a
   reported business fact merely because the lawyer entered an answer.
5. **Ways forward**: proposed options, conditions, and mitigation work.
6. **Your recorded position**: disposition, reason, actor, date, and linked decision.

Reuse existing issue IDs and question links. Add optional many-issue links only
where needed for shared questions; continue reading legacy `issue_id` values.
Validate that linked IDs belong to this matter. Never infer saved relationships
from similar titles. Model-suggested links remain labeled as proposed.

Keep exploration state separate from disposition. Preserve old Open/Explored/
Set aside data. Add an explicit disposition such as unresolved, mitigation in
progress, resolved, risk accepted, or not applicable, with a short reason and
references to work or decisions. **Explored** must not mean **Resolved**.
Risk acceptance uses an explicit recorded decision. A model may propose these
outcomes; the lawyer records them. Support reopening with preserved history.

Use existing Markdown metadata, event/action receipts, revision checks, and
retry identities. Do not introduce a second issue store. A resolved issue does
not automatically close its siblings or the matter. Changed facts flag affected
analysis for review without rewriting prior decisions.

### C. Checkable claims and “show the work”

For each material legal proposition, show the specific authority and location,
the relevant source passage when available, and a short explanation of its
application to the matter. Identify the regulated actor, jurisdiction, and
factual assumptions when they affect applicability. Expand acronyms on first use.

“Show the work” means sources, assumptions, and a concise rationale. It does
not require private model reasoning or a transcript of internal deliberation.

- Legal claims link to actual authority when available. Matter facts link to
  supplied documents or reported answers. Recommendations link to supporting
  claims and assumptions. Do not attach an irrelevant statute to every sentence.
- Keep source title, URL/path, section locator, exact available excerpt, source
  status, claim ID, and output revision together through saving and rendering.
- Use the same claim/source references in the current answer, issue details,
  conversation, map details, and generated work product. Preserve citations in
  existing export paths. Avoid a separate source list with no claim-level links.
- Trace the current generation-to-display path before adding fields. Reuse
  `ClaimEvidence`, source records, and the existing evidence drawer. A fetched
  page is Retrieved; it does not become Verified just because it loaded.
- Strengthen the effective runtime instructions and output contract for legal
  applicability and claim-level links. Cover both existing and blank vaults.
  Preserve custom instructions; do not overwrite an edited answer contract.
- If references are missing or parsing fails, keep useful prose and valid links.
  Show the support gap near the affected claim. Offer targeted research through
  the existing research action. Do not add a mandatory verifier or answer gate.
- Old uncited output stays historical. Opening the page must not fabricate
  citations or trigger research. A lawyer-requested research/reassessment action
  saves a new supported result without overwriting recorded decisions.

### D. Separate decision map

Route: `/matters/[id]/decision-map`, linked from the matter and individual issues.
Initial selection is addressable by issue ID. Back navigation restores the issue.

Use automatic layout with these connected record types:

| Record | What the lawyer sees |
| --- | --- |
| Business question | The outcome being assessed |
| Issue | The concern and current review/disposition state |
| Fact or question | What drives the branch, including unknown answers |
| Option or scenario | A possible response and its explicit conditions |
| Work or decision | Proposed mitigation, saved work state, or recorded position |

Edges say what they mean: **depends on**, **if**, **supports**, **mitigated by**,
or **decided by**. Sources open in node details to keep the canvas readable.
Shared questions have one identity with several links. Show the selected issue's
neighborhood first, with **Show whole matter**, fit, zoom, and pan controls.
Provide a keyboard-accessible outline with the same labels and actions.

Derive the map from saved records and saved proposed scenario relationships.
Do not ask the model to redraw or re-infer the legal map on each page load.
Generate proposed branch descriptions during explicit analysis/reassessment and
persist them with source revisions. Keep unknown and hypothetical paths visible.
Automatic layout must handle shared nodes, disconnected records, and cycles
without hiding records or changing their meaning.

#### Interactive hypothetical exploration — included

- Reuse the existing scenario service and scenario UI behavior. From a selected
  issue or condition, offer **Try a different assumption** with the current
  reported fact beside an editable hypothetical value.
- Keep edits local until the lawyer selects **Analyze scenario**. That action
  submits a hypothetical snapshot through the existing agent path. It may save
  a run record, but it must not change canonical facts or decisions.
- Label results **Hypothetical · Agent analysis**. Show changed assumptions,
  affected branches, proposed outcomes, supporting claims, and remaining unknowns.
  Keep the baseline available. Do not imply that a model reassessment is instant
  deterministic legal calculation; show running and failed states honestly.
- **Save scenario** retains a named scenario for return and comparison. **Use
  this fact in the matter** is a separate explicit action with a visible review
  of the proposed fact change. It does not accept recommendations or decisions.
- If baseline facts change while analysis runs, retain the result against its
  original baseline and identify it as based on earlier facts. Do not replace
  the current path with a late result.
- Compare one scenario with the baseline in the first build. No general scenario
  simulation engine is required.

Use framework primitives for the first implementation if they meet the demo.
Any graph package decision belongs to the integration owner after a small
layout/accessibility probe. Do not build a general Figma-style editor, drag-to-
rewrite legal records, or a separate graph database.

### E. Multiple documents and consistent references

Keep **Draft** as the workspace mode for now, but give its document area the
clear heading **Documents**. Viewing a source must never imply that it is a draft.

- Put a document navigator before or beside the editor, visible on entry. Group
  **Work products (count)** and **Sources (count)**. Keep **Matter records**
  collapsed. Show friendly titles, document type, saved state, and active selection.
  Keep earlier versions under their document rather than counting each revision
  as another work product. Distinct work products remain separately visible.
- Provide a compact row of open-document tabs for fast switching. The navigator
  shows the complete library; tabs show only opened documents. Handle overflow
  with an accessible menu. On narrow screens, use a document picker with counts.
- Keep one main editor. Reuse existing document loading, review, and export
  functions. Track unsaved content and selection per document and per matter.
  Opening another document must not silently save, discard, or replace edits.
  If a tab with unsaved work is closed, retain a recoverable local draft and
  say so; discard requires a distinct explicit action.
- Show **Reading source**, **Editing draft**, **Final**, or the accurate saved
  approval state beside the title. Do not infer approval from the file name.
  Keep the canonical draft/final identity separate from the document being viewed.
- Use a secondary reference preview for a cited source. On a wide screen it can
  sit beside the editor; it shares the secondary area with discussion so the
  page does not become three narrow reading columns. On a small screen, show a
  focused preview with **Back to [document]**.
- Internal document references use one shared opening behavior across issues,
  chat, map details, evidence, and draft text. Resolve a stable document/path
  identity, optional revision, and locator. Prefer an existing open tab to a
  duplicate. Indicate the referenced version when it is historical.
- A citation first exposes its evidence details and an **Open passage** action.
  A named internal document link opens that document directly. When opened while
  drafting, a source goes to reference preview and a work product opens a tab.
  Public URLs remain clearly labeled external links.
- Preserve the origin, scroll position, and focus for a return action. Highlight
  the cited passage only when the saved locator matches. Otherwise open the
  document and say **Exact passage unavailable**. Never invent a page location.
- Opening a source for reading does not add it to agent context. Keep **Use in
  this request** explicit. Reading-source focus does not retarget a draft rewrite;
  the action names its destination and freezes that identity when submitted.
- Use existing original-file and extracted-text support. Label extracted text.
  If a format cannot be previewed, offer the original file and available extracted
  text without presenting extraction as the original document layout.
- Existing final/approved files remain immutable. A requested revision creates
  or opens the existing supported editable successor. Creating a new work product
  must not overwrite another product merely because it is the canonical draft.

### F. Agent assignments and execution waves

Confirmed user preference: **Astra light** orchestrator and ultimate reviewer,
with **Sol light**, **Sol medium**, and **Terra high** workers.
Terra is the weaker model in this plan. Reasoning effort is not model capability.
Map light to the runtime's `low` value. Check exact dispatch support before
execution; never silently substitute a model. Proposed global cap: three active
workers, excluding the coordinator. No nested agents. One shared working tree.

| Pool | Exact intended model / effort | Role and cap |
| --- | --- | --- |
| Astra light | `gpt-6-astra` / `low` | Orchestrator and final acceptance reviewer; one coordinator outside the worker cap |
| Sol light | `gpt-5.6-sol` / `low` | Small presentation work and bounded docs; cap 1 |
| Sol medium | `gpt-5.6-sol` / `medium` | Contracts, core implementation, integration, independent review; cap 2 |
| Terra high | `gpt-5.6-terra` / `high` | Bounded map rendering after contracts are fixed; cap 1 |

The Astra light coordinator reviews every chunk and owns repository-wide checks.
Use a fresh Sol medium worker for independent review of the combined result.
Astra light then performs the ultimate review of the combined diff, user
requirements, browser evidence, and test results, and decides whether the planned
work is complete. A worker must not review its own work. Terra reports uncertainty
instead of changing contracts or broadening its scope. These are software
implementation reviews, not mandatory legal-answer reviewer agents in the app.

Before execution, verify the orchestrator is actually running on Astra with low
reasoning effort. Writing this assignment does not change the current session's
model. Do not claim the requested routing was used without runtime confirmation.

The repository has many existing modified and untracked files. Before execution,
record the baseline and active writers. Preserve all existing work. Recheck exact
paths before dispatch. If another active task owns a needed file, sequence the work.

| ID / wave | Outcome and dependencies | Implementer | Exclusive write ownership |
| --- | --- | --- | --- |
| C0 / 0 | Freeze minimal data, action, and component contracts; define fixtures and layout | Sol medium | New `docs/matter-review-decision-map.contract.md`; `backend/app/models/workspace.py`; `frontend/lib/workspaceTypes.ts`; new `frontend/lib/decisionMapTypes.ts` |
| C1 / 1 | Persist issue dispositions and links; expose complete review/map data; depends C0 | Sol medium | `backend/app/services/workspace.py`; new `backend/app/services/workspace_review.py`; `backend/app/services/workspace_scenarios.py`; `backend/app/routers/workspace.py`; new `backend/tests/test_workspace_review.py` |
| C2 / 1 | Claim support survives generation and saving; depends C0 | Sol medium | `backend/app/services/answer_contract.py`; `backend/app/agents/context.py`; `backend/app/services/workspace_actions.py`; `backend/app/services/workspace_evidence.py`; `backend/tests/test_answer_contract.py`; `backend/tests/test_workspace_evidence.py` |
| C3 / 1 | Wrap work banner and simplify orientation component; depends C0 | Sol light | `frontend/components/workspace/OrientationSummary.tsx`; new `frontend/components/workspace/WorkItemSummary.tsx`; new `frontend/scripts/check-review-layout.ts` |
| C4 / 2 | Main review page, actionable issue detail, and inline evidence; depends C1/C2/C3 | Sol medium | `frontend/components/workspace/UnderstandPanel.tsx`; `frontend/components/workspace/IssueNavigator.tsx`; `frontend/components/workspace/EvidenceDrawer.tsx`; new `frontend/components/workspace/IssueReviewDetail.tsx`; new `frontend/scripts/check-issue-review.ts` |
| C5 / 2 | Map canvas and accessible outline from frozen typed data; depends C1 | Terra high | New `frontend/components/workspace/DecisionMap.tsx`; new `frontend/lib/decisionMapLayout.ts`; new `frontend/scripts/check-decision-map.ts` |
| C5a / 2 | Document navigator and tab presentation using frozen props; depends C0 | Sol light | New `frontend/components/workspace/DocumentNavigator.tsx`; new `frontend/components/workspace/DocumentTabs.tsx`; new `frontend/scripts/check-document-navigation.ts` |
| C5b / 3 | Per-document edit preservation, reference opening, and scenario interactions; depends C1/C2/C5/C5a | Sol medium | `frontend/components/workspace/ScenarioPanel.tsx`; `frontend/components/workspace/MatterFilesPanel.tsx`; `frontend/components/DocumentPanel.tsx`; `frontend/lib/workspaceDrafting.ts`; new `frontend/lib/documentNavigation.ts`; new `frontend/components/workspace/ReferencePreview.tsx`; new `frontend/scripts/check-document-reference-behavior.ts` |
| C6 / 3 | Integrate routes, data, discussion targeting, and shared styles; depends C4/C5 | Sol medium | `frontend/components/MatterWorkspace.tsx`; `frontend/components/workspace/DraftWorkspace.tsx`; `frontend/components/workspace/ConversationDock.tsx`; `frontend/lib/workspaceApi.ts`; new `frontend/app/matters/[id]/decision-map/page.tsx`; `frontend/app/globals.css`; `frontend/package.json`; `frontend/package-lock.json`; `backend/app/runtime.py`; `backend/app/main.py`; `backend/app/models/api.py`; `frontend/lib/types.ts` |
| C7 / 4 | Independent combined review, then owner corrections | Fresh Sol medium | Read-only reviewer; corrections return to the listed owner |
| C8 / 5 | Run full demo and checks; publish evidence | Coordinator; Sol light writes report after evidence exists | New `docs/matter-review-decision-map.verification.md`; `docs/ACCEPTANCE_TESTS.md`; `docs/DESIGN_LANGUAGE.md`; generated `graphify-out/` owned only by coordinator |
| C9 / final | Ultimate review and completion assessment; depends C7/C8 and all corrections | Astra light orchestrator | Read-only final review; corrections return to assigned owners |

Each chunk owns its focused behavioral tests. New test fixtures should remain
inside its test file unless C0 assigns an exact shared fixture to one owner.
Do not run tests that mutate shared vaults in parallel. Any additional producer,
template, chat renderer, or export changes discovered by tracing go to a named
owner before editing; do not let workers touch them opportunistically.

For the expanded scope, run C6 only after C5b as well as C4/C5; treat it as the
next serial integration wave, followed by C7 and C8. Run at most three workers
in wave 2 and respect the Sol light pool cap. C0 must also freeze document
identity, reference targets, per-document local state, and hypothetical scenario
actions. C1 owns any scenario-service additions. C2 owns source/claim references.
C6 owns all shared parent wiring and any chat/document-link renderer changes
after exact paths are assigned. Terra builds the typed map presentation only;
Sol medium owns hypothetical analysis semantics and record changes.

Worker handoffs must contain the frozen contract, a concrete example, exact read
and write scope, current baseline, expected behavior, failure cases, and check
commands. Require files changed, checks actually run, and remaining uncertainty.
Terra's map handoff must include a small shared-question/cycle fixture and an
expected accessible outline. It may not infer legal relationships from prose.

### G. Verification and completion

Focused behavioral checks must prove:

- Old issues load with stable IDs and preserved text. A question answer does not
  resolve an issue. A disposition or decision requires the matching direct action.
- Repeated saves do not duplicate decisions/work. Stale revisions do not replace
  newer edits. Reopen and reload preserve the reason and prior record.
- Factual answers and legal analysis have distinct provenance. Shared question
  links work from both issues. Missing IDs remain visible as missing references.
- Several claims can cite different passages of the same source. Missing sources,
  malformed optional structure, and failed retrieval retain the useful answer.
- Citations stay with the right claim and revision after save, refresh, map
  navigation, and existing document export. Unsafe URLs remain blocked.
- A generic source mention is not counted as proof of a particular legal rule.
  The live-model demo must inspect whether cited text supports the stated actor,
  jurisdiction, and rule. Use real retrieved authority; report access limits.
- Priority ordering is stable and explainable. No claim disappears because it
  is unranked or lacks support. Long labels and banner actions do not overlap.
- Map and outline expose the same saved identities. Unknown facts do not select
  paths. Cycles terminate layout. Stale branches retain their historical context.
- Discuss controls preserve unsent text and target the selected record. Returning
  from a drawer or map restores focus and useful reading position.
- Hypothetical input changes no canonical record before an explicit adoption.
  Saved scenarios retain their baseline. Failed or late analysis preserves local
  input and cannot replace newer results.
- Counts distinguish work products, sources, and versions. Multiple open drafts
  retain separate edits through switching and return. Duplicate file names do
  not confuse identity. Missing references show an actionable unavailable state.
- Draft actions and exports affect the named target, not whichever source pane
  was last focused. Delayed generation and file-loading results cannot replace
  another active document. Source viewing does not silently select agent context.
- Source links from every named surface reach the correct file/version and return
  location. Finals remain immutable. Native previews and extracted text are labeled.

After focused checks, run the repository-required backend suite, frontend
typecheck and production build, the workspace UX, single-lawyer, and lawyer-
continuity script groups, then the new behavior checks. Walk
`docs/ACCEPTANCE_TESTS.md` in the browser and the demo above. Run
`graphify update .` after application changes. Keep build and graph mutations
serial and coordinate with running development servers.

Record exact commands, results, screenshots, test vault, live-model source
evidence, failures, and corrections. Compilation alone does not prove the page
is less overwhelming. The final browser session must visibly demonstrate the
payoff moment. Planning does not require application tests to run.

## 5. Parked backlog

| Deferred item | Evidence needed before building |
| --- | --- |
| Full freeform diagram editor | Lawyers cannot express needed relationships through issue and scenario controls |
| Automatic legal path selection | Repeated evidence shows explicit conditional analysis cannot support the workflow |
| Learned priority scoring | Simple saved-state ordering repeatedly puts the wrong item first |
| Large graph infrastructure | Measured matter size defeats the local derived view |
| Mandatory legal verifier or consensus agents | Not part of this plan; source visibility and useful first-pass work remain the product rule |
| Bulk regeneration of historical matters | A separate user request after the single-matter flow is verified |
| Comprehensive citator service | Users need treatment history beyond linked primary authority and clear source status |

The user confirmed hypothetical exploration. The plan now includes a separate
automatic decision map, explicit scenario analysis, contextual discussion,
multiple-document navigation, reference previews, and a main page focused on
the lawyer's next review action. These are planned changes, not implemented ones.
