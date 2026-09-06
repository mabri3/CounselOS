Implement the complete Matter A-style UI blueprint below in this repository:

`/Users/bharris/Programs/counsel-os-mvp`

You are the Astra light coordinator and ultimate reviewer. This is authorization to implement and verify the UI rebuild. It is not a request for another plan. Use the selected A style and the 12 final design images named below. Inspect the 47 actual screenshots and their control inventories to preserve the full working product. Do not replace live data with the mockup's sample content.

Use the parallel-plan-executor skill. Use plan-handoff to prepare concrete worker instructions. Apply senior-mindset and the repository's design and engineering rules. The user wants bounded Terra high workers and independent Sol medium review. Do not create separate user-visible tasks.

Resume protocol:

1. Read `docs/matter-a-style-ui.handoff-progress.md` first. If missing, create it from C0–C9, the named combined checks, B01–B26 and final review steps below. Do not reset an existing checklist.
2. Inspect active writers, dirty/untracked files and running services before dispatch or edits. Preserve all prior changes. Use one shared working tree.
3. Verify exact runtime support: coordinator `gpt-6-astra` with low reasoning; implementers `gpt-5.6-terra` with high reasoning; reviewer `gpt-5.6-sol` with medium reasoning. Light means low. Report the actual coordinator runtime if it differs. Never silently substitute an unavailable worker model or claim routing not used. Use a fresh Sol reviewer after combined implementation.
4. At most three active workers excluding yourself. Workers must not spawn agents. Give each worker only its exact files, relevant code excerpts, full local instructions, example states and meaningful checks. Freeze the contracts before Wave 1.
5. Update progress immediately after each accepted chunk. A worker report alone is not acceptance. On resumption, start with pending work. If accepted work no longer verifies, diagnose the change; do not blindly reapply edits or rerun broad suites.
6. Seed and mutate only an isolated acceptance vault with a separate active-context pointer. Do not run actions against `MAT-20260904-abf788` or activate a test vault in the user's normal app. Record fixture IDs; record-creating fixture actions must not be repeated blindly.
7. Use the in-app browser. The user waived 200% zoom. Do not reinstate it or require native Mac browser access. If browser access fails while the Mac is locked, complete all independent work and report the exact remaining browser gap.
8. Keep checks proportionate. Do not run every suite per worker or repeat checks already included by aggregate commands. Preserve repository-required final checks unless explicitly waived. No commit, push or deploy.

The following is the complete build blueprint. It is included inline so this prompt does not depend on the previous conversation. The named source files and image assets are in the repository. Read their actual contents; do not assume images have been inspected just because their paths are listed.

---

# Matter A-style UI rebuild — build blueprint

Prepared 2026-09-05. Status: planned, not implemented. Scope: the Matter workspace and all attached reading, discussion, drafting, map, source, and work panels. This is a presentation and navigation rebuild over the current working behavior.

## 1. Outcome and scope

A lawyer opens a matter and sees its question, useful working answer, one owned next action, and a compact review list. The lawyer opens an issue, checks its actual support, explores a hypothetical, returns to the issue, switches between two drafts and a source, and continues the same conversation without losing text or changing the wrong target. Every existing lower-page workflow remains reachable through named controls.

Build that full journey. Do not stop at a polished first viewport. The final deliverable is working React UI, observed in the in-app browser, with a before/after control map and evidence report. It is not another mockup, static screenshot page, design-only branch, or replacement of real data with sample content.

Include:

- Matter header, stage/risk/due metadata, active-work strip, view tabs and Tools & history.
- Understand, all issues, selected issue, question editing/history, reported facts and legal questions, actual claim support and source details.
- Discuss, history, scope, action target, receipts, suggestions, composer, attachments and existing inquiry modes.
- Draft, work-product/version navigation, sources, Matter records, editor toolbar, redline/comment access, local drafts, draft requests, templates, preview/update/conflict states, Word/PDF controls.
- Decision map, accessible outline, selected detail, hypothetical form, saved scenarios, explicit adoption and separate fact correction where supported by current records.
- Research, work assignments, participants, recommendations, formal decisions, final/approved/delivery/closure controls, maintenance and activity.
- File context, business replies, handoffs, source-version comparison, business flow, prior work, practice notes and assumption watches.

Keep existing global navigation to Today, Briefing, Workspace, Matters, Decisions, Skills, Automations, Agents and Settings. The concept images abbreviate that navigation for legibility. Do not remove routes or replace the global shell with a three-link mockup. A redesign of unrelated top-level pages, backend APIs, legal analysis, routing architecture or storage is outside this build.

## 2. Authority and required inputs

Resolve conflicts in this order:

1. The user's current instructions and protected-data rules.
2. AGENTS.md, PRD, design-language rules and current record-integrity behavior.
3. The explicit behavior and layout decisions in this blueprint.
4. Live screenshot/control inventory and current code.
5. Generated A-style images as visual targets only.

The images contain sample text, condensed lists and some illustrative controls. They are not permission to invent records, change legal conclusions, simplify action semantics or add requirements. Use real supplied data and existing callbacks. Preserve a control even if it was omitted from a concept image.

Read in full before application edits:

- `AGENTS.md`
- `docs/PRD.md`
- `CODEX_HANDOFF.md`
- `current.md`
- `docs/DESIGN_LANGUAGE.md`
- This blueprint and `docs/matter-a-style-ui.handoff-progress.md`
- `docs/matter-review-decision-map.contract.md`
- `output/matter-ui-design-survey/inventory.md`
- The four `inventory.md` files under `output/matter-ui-design-survey/{understand,discuss,draft,map}/`
- `docs/ACCEPTANCE_TESTS.md`

Visual source directory, absolute:

`/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/`

Open and actually view all 12 final images in `designs/`:

| Image | Purpose |
| --- | --- |
| `01-understand.png` | Question, answer, next action, compact issue rows and secondary navigation |
| `02-issue.png` | Issue explanation, support, questions, mitigation and explicit disposition |
| `03-discuss.png` | One conversation, visible target, history, inquiry modes and composer |
| `04-draft.png` | Multiple work products, unsaved state, editor and optional drafting inputs |
| `05-source.png` | Source preview with draft target retained and explicit context use |
| `06-map.png` | Separate map, record details and equivalent outline |
| `07-scenario.png` | Hypothetical analysis separated from actual fact correction |
| `08-work.png` | Research queue, work, participants, decisions, artifacts and activity |
| `09-explore.png` | Business flow, prior work, practice notes and watches |
| `10-tools.png` | Tools navigation and file/inquiry context |
| `11-business.png` | Business request and handoff forms |
| `12-compare.png` | Version comparison and optional template-library access |

Use only these final numbered files, not earlier generated-image attempts. `designs/manifest.json` records their original paths. The original selected A reference is `/Users/bharris/.codex/generated_images/01a072ce-1894-78e2-81ce-a75ce8818c90/exec-56382c71-f152-4c5e-b326-63cd9620be7e.png`. It is a style reference, not a full interaction spec.

`output/matter-ui-design-survey/screenshots.md` indexes 47 actual browser screenshots. Review screenshots from every cluster, including lower scroll positions. Do not use only the first image from each cluster. The survey report distinguishes live evidence from generated concepts.

### Known survey gaps

Disposition/formal-decision dialogs and an individual template detail were not opened in the final survey. Some lower research/material controls have accessibility inventory but only partial viewport captures. No saved work products, comments, redlines, named scenarios, configured handoff recipients or issue dispositions existed in the reference matter. Those populated states must be inspected in the isolated acceptance fixture during this build. The old temporary vault listed in earlier environment files may no longer exist; do not assume that it does.

A survey worker accidentally ran a suggested question. It was fully recovered to the original conversation hash, with evidence retained. Learn from that incident: suggested questions, Explain, Stress-test, Research, Start inquiry and Draft handoff brief can run agents. They are not read-only preview controls.

## 3. Frozen behavior contracts

These are implementation constraints, not optional review advice.

### 3.1 Data and authority

- Markdown is authoritative. SQLite is disposable. No migration or new persistent record type is needed for this UI rebuild.
- Keep existing issue, question, scenario, evidence, conversation, document, recommendation, work and decision APIs.
- Do not change source parsing, citation verification, legal prompts, provider routing or backend business behavior.
- Never copy sample legal text, file names, counts, people, dates or statuses into application defaults.
- Missing citation support does not hide useful prose. Missing optional parsing does not gate an answer.
- Never infer verification from a saved file or infer applicability from a source link. Show actual claim revision, source status, passage/locator and applicability explanation or explicit gap.
- Recommendation, proposed update, formal decision, final response, approved response, delivery and closure remain distinct states.

### 3.2 Mounting and local input

`DraftWorkspace` is the shared frame despite its name. Preserve its existing three ReactNode slots:

```ts
matterId: string;
view: WorkspaceView;
onViewChange: (view: WorkspaceView) => void;
understand: ReactNode;
conversation: ReactNode;
editor: ReactNode;
```

Render the conversation once. Hide inactive slots with the existing `hidden` behavior. Do not mount separate ChatPanel instances per tab, create a second conversation in a drawer, or add changing keys for layout state. Do not introduce a new conditional unmount for a surface that currently stays mounted, especially Understand, editor and conversation slots. Preserve each existing panel’s current open/close mount behavior and its current parent-backed draft retention. A disclosure used only for the new section index must hide without discarding child state. Preserve local question, fact, template, handoff, scenario, composer and editor text.

Do not replace the existing localStorage preference/snapshot helpers, hydration order, contextKey remount boundary, stable `handleEditorSnapshot` callback, request sequence checks, retry action keys or frozen async targets. A late result must not select a document the lawyer left or overwrite a newer load/save.

### 3.3 Document and source behavior

Preserve the current interfaces in `frontend/lib/workspaceTypes.ts`:

- `DocumentNavigatorProps`: documents, active document id/path/revision, `onOpen(document)`, `onCreateWorkingCopy(document)`.
- `DocumentTabsProps`: documents, active id, localEdits, `onSelect(id)`, `onClose(id)`, `onDiscardLocalEdit(id)`.
- `ReferencePreviewProps`: target, document, loading/error, `onBack(origin)`, `onOpenOriginal(document)`, `onUseInRequest(document)`, `onCreateWorkingCopy(document)`.

A source click calls reference opening. It does not call editable-document selection, context selection or draft submission. A source may have its own version. Duplicate document titles must remain distinguishable by path/version. Dirty state belongs to the exact document identity, not to a global boolean.

Keep both content and review revisions frozen for draft/export actions. Word/PDF output must still refer to the intended document and include saved canonical document references. Do not modify export behavior to achieve visual changes.

### 3.4 Conversation controls

Keep the difference between Clear scope and Clear target. `ConversationDock` clears its scope with `onTargetChange(null)`. ChatPanel's target reset uses the base matter target and current business-question revision. Do not merge the callbacks because both controls sound similar.

Keep composer history chronological in the actual ChatPanel. The mockup places a latest-answer summary above a question for layout illustration; do not reverse or rewrite the stored transcript. Provide a visible jump to the latest answer and collapsed historical blocks where already supported. Keep complete history accessible.

Suggestions that start execution must say what happens, for example the existing question plus a small `Run inquiry` action label. Clicking a suggestion may execute only the existing callback, once. Do not add an automatic send on focus, selection, panel open, hover or restored state.

### 3.5 Issue, work and hypothetical rules

- Issue selection retains issue id and sets the existing conversation scope. Map links carry the selected issue and conversation; return restores them.
- A completed mitigation does not resolve its issue or close the matter.
- Opening/cancelling a disposition or formal-decision form makes no durable change. Preserve revision checks, reason fields and any current requirement for a linked explicit decision when accepting risk.
- Hypothetical analysis stays separate from real facts. Saving a scenario, comparing it, adopting it and correcting a fact are different actions. Preserve their distinct callbacks and confirmation/record steps.
- Unknown conditions remain Unknown. Do not turn an Open issue green because the design image has a green example.
- A copied business request is not a sent request. A prepared handoff is not accepted work. A supplied reply is not verified evidence.

### 3.6 Frozen files

No worker may edit backend code, `workspaceTypes.ts`, `continuityTypes.ts`, `decisionMapTypes.ts`, `workspaceDrafting.ts`, `documentNavigation.ts`, `workspaceApi.ts`, `continuityApi.ts`, `chatRunLogic.ts`, `frontend/lib/design.ts`, package manifests/lockfiles, or the Lexical review plugins without a concrete defect reviewed by the coordinator and Sol. The default solution changes JSX, local presentation classes and view-only navigation.

If a small optional presentation prop is unavoidable, the coordinator freezes its exact type and default, enumerates all callers, and assigns the producer/consumer change to one owner before dispatch. No worker invents a prop contract while another worker edits a caller.

## 4. Visual blueprint

### 4.1 Tokens and geometry

Use existing CSS variables and `frontend/lib/design.ts` semantic roles. Do not hardcode another palette.

| Element | Target |
| --- | --- |
| Page ground / raised content | Existing paper / raised variables |
| Content width | Max 1,440 CSS px; centered, 24 px desktop side padding |
| Tablet/mobile padding | 16 px at 761–1,099; 12 px at 760 and below |
| Reading text | 16 px / 1.65 serif for sustained document/answer prose; 15 px / 1.5 sans for controls and row content |
| Metadata | 12 px minimum for short metadata; never use metadata styling for important instructions |
| Matter title | 28–32 px serif desktop, 24–28 px narrow; no giant repeated title in every subpanel |
| Section title | 20–24 px serif; panel label 12–13 px sans |
| Spacing scale | 4, 8, 12, 16, 24, 32 px |
| Rows | 56–72 px typical desktop; grow naturally for real long text |
| Controls | At least 36 px tall desktop; 44 px touch target on narrow layouts |
| Panel radius | Existing radius, at most 10 px; 1 px neutral border |
| Main / optional rail | `minmax(0, 1fr)` and 320–360 px at >=1,100 px |
| Editor / source preview | Two columns only when both remain readable; stack at <=900 px |
| Motion | No decorative motion; preserve reduced-motion support |

Use thin separators and light washes on rows. Use stronger color only for small state labels or selection. A selected item uses an ink border/spine, not an attention color unless its state also needs attention. An ordinary source is not agent work merely because it is displayed by the application.

Do not use a fixed aspect ratio copied from the portrait images. They are phone-readable review artifacts. Implement normal responsive desktop and mobile layouts.

### 4.2 CSS ownership

Use one new local CSS Module per chunk as listed in the ownership table. Convert inline presentation in owned components where it prevents the design. Do not use widespread `!important` overrides or global `button`, `section`, `details`, `table` rules.

The integrator owns `MatterA.module.css`, imported by the Matter workspace root and shared frame. Its outer root is the opt-in boundary for any descendant legacy styles. Existing global `.btn`, state roles and fonts remain authoritative. Global `globals.css` is frozen by default; if a narrow change is necessary, only the integrator edits it and records affected other routes.

Existing shared components used outside Matter must keep current behavior and reasonable layout there. Prefer scoped module classes or an explicitly frozen optional presentation variant rather than broad global selectors.

### 4.3 Header and work strip

Keep full global navigation. Within Matter, show one compact row: breadcrumb/title and semantic state on the left; Tools & history and small metadata controls on the right. Stage, risk and due date remain available and correctly labelled. On narrow screens wrap these into a second line or a named Matter details disclosure; do not drop them.

Place Understand / Discuss / Draft directly below the matter header. Decision map is a named secondary link. Keep the view switch as the existing native radio group; keyboard selection and visible focus must work.

Turn the active-work banner into a compact strip with title, state, owner, Open saved work, Complete work (when available) and Hide work banner. The long title wraps or has an explicit full-title disclosure; it must not merge visually into the state text. Complete work stays secondary. Hiding the strip does not complete or alter work.

At 1280×900, aim to show the question, short answer, qualification, next action and first review row without page scrolling. Next-action top should be <=540 CSS px for the seeded normal case. Do not pass by hiding the qualification, shrinking type, or truncating away useful text. At 390×844, the owned next action should be visible by the end of the first viewport for the seeded normal case; record real measurements and explain exceptional long content.

### 4.4 Secondary navigation without new state architecture

Keep existing routes. Do not create a route for each lower panel. Add a compact section index below the core review with these destinations:

1. Evidence & question history.
2. Explore & business flow.
3. Prior work & watches.
4. Research & work.
5. Materials & activity.

These controls reveal and focus the existing corresponding section in the same Matter view. Native details/disclosures keep child state mounted. Add stable, matter-specific DOM ids and open the destination before scrolling. A view-only reveal handler must not call a business action or context setter. Focus the revealed heading/summary with `tabIndex={-1}` where needed; return to Review is equally clear. Never use an anchor that scrolls to a still-closed panel.

Use this exact local contract in new `frontend/components/workspace/MatterSectionNav.tsx`:

```ts
type MatterSectionNavProps = {
  entries: ReadonlyArray<{ id: string; label: string }>;
  onReveal: (id: string) => void;
};
```

Freeze one local presentation seam before C1 starts:

```ts
// Add only to UnderstandPanelIntegrationProps in UnderstandPanel.tsx.
// Do not change workspaceTypes.ts.
sectionNavigation?: React.ReactNode;
```

C1 renders `props.sectionNavigation` immediately after the Needs your review block and before selected issue/all-issue/supporting-history content. C9 supplies one `<MatterSectionNav>` through that prop. The default is null, so other callers need no change. C1 owns this seam; C9 owns the navigation component and callback. This is a new presentation-only prop, not a new data/state contract.

Render a labelled `nav` with native `type="button"` controls. Do not store selected state in this component. The supplied callback only reveals, scrolls and focuses. No navigation registry, new router, global store or persistence service.

Freeze these DOM hooks at C0. They are new desired hooks, not a claim that they already exist:

| Destination | ID expression | Owner and existing entry point |
| --- | --- | --- |
| Review | `matter-${matterId}-review` | C1: root review region in UnderstandPanel; use `snapshot.matter_id` |
| Evidence & question history | `matter-${matterId}-evidence` | C1: existing Supporting material and history details in UnderstandPanel |
| Explore & business flow | `matter-${matterId}-explore` | C9: wrapper around the two adjacent workspace-exploration disclosures in MatterWorkspace |
| Prior work & watches | `matter-${matterId}-reuse` | C9: workspace-reuse details |
| Research & work | `matter-${matterId}-work` | C9: workspace-existing-controls details |
| Materials & activity | `matter-${matterId}-materials` | C9: nested matter-reference details |

C9 supplies `detail.matter_id` for its hooks. No C2–C8 worker adds competing section IDs. When revealing a destination, open every closed ancestor `details` inside the current Matter root, then the target details if applicable. For the Explore wrapper, open its two existing child disclosures. Focus the target's first heading/summary after it is visible. Retain the mounted children and all input state. Materials must open both its outer work disclosure and its own disclosure. Return to Review opens/focuses the review region. Do not move navigation into the ChatPanel or call target/context callbacks from it.

## 5. Screen-by-screen implementation details

### 5.1 Understand — C1 + C9

Use actual `orientationAnswer`, question revision and review projection. Keep `longAnswerPreview` behavior, code fences/reference links and full saved wording. The short answer is a reading block with its actual agent/source state. `Read full answer` must reveal all text, including earlier wording retained under its current neutral label.

Order: question → working answer → material qualification → one next action with owner → up to three ranked review rows → View all issues → secondary section index through the frozen `sectionNavigation` seam. Preserve backend ranking. Do not calculate a new urgency score or rewrite long issue titles with an agent. Shorten display with wrapping/disclosure; full title remains reachable and accessible.

Replace repeated tall cards with aligned rows: issue label, explanation of what needs judgment, state/owner, one review action. Review rows and all-issue navigation refer to the same issue id. Keep close/hide behavior local and reversible where currently supported. Avoid showing the same primary action in three places above the fold.

Evidence/history retains facts, question answers, sources, prior outputs, recap, Mark seen, question editing, proposals, revision history and restore. Mark seen is a saved action; do not run it on panel open.

### 5.2 Issue detail — C1

Keep the full chain visible in one reading panel: issue title and why it matters, business effect, claims/applicability, linked factual/legal questions, options/mitigation, recorded lawyer position. Large sections may collapse supporting history, but do not hide the primary source gap or next action.

Keep Open decision map, Discuss this issue, Research legal basis, Create mitigation work, Record formal decision, Record disposition, edit details and disposition history. Empty states should be one concise line, not blank panels or fabricated example content.

Preserve question identity shared across issues, answer type, revision checks, and independent busy state. Legal analysis is not saved as a reported fact. Disposition form retains its real selector options, reason field, decision links, submit/cancel and conflict handling. A reopened issue must still require the existing explicit action/reason. Do not invent new disposition options to match a color palette.

### 5.3 Discuss — C3

Make the current target readable above the conversation. Keep issue/document/passage/local-draft context distinct. Long paths and selected text wrap or expand. Clear scope and Clear target stay separate with accurate labels.

The conversation occupies the wide reading column. Keep one existing thread scroll area on desktop and a visible composer. Avoid page-scroll inside an already scrollable narrow dock plus another thread scroll. At <=760 px use normal page flow except the existing textarea/thread mechanics required for usability. The composer cannot cover the last message or focused control.

Keep saved actions, old intake answers, updated-record links, attachments and complete history. Give latest-answer navigation an explicit label. Do not delete old turns or change their chronological order. A running, complete, interrupted or failed run uses actual state. A completed run does not by itself disable future messages.

Show shortcut execution labels. Retain busy/disabled behavior and one-submit protection. Keep answer saving and pending/recovered output visible when a refresh fails. Optional research/parsing failure never replaces a useful answer with an empty card.

### 5.4 Draft and document navigation — C2 + C9

Place work-product names/counts, source count, version controls and active editable document above the editor. Group repeated versions under the same work-product identity. Keep Matter records in a collapsed group with all existing entries and exact semantic labels where used. Distinguish zero work products from loading or a failed refresh.

Use visible document tabs/rows for open drafts. Each dirty document displays Unsaved. Switching from A to B retains both local buffers. Closing a dirty tab preserves the existing recovery/discard behavior and confirmation; no silent discard. Do not auto-save just to simplify switching.

Do not change Lexical node formats, transforms, selection logic, history or review plugins. Preserve Editing/Markdown, All Markup/No Markup/Original, author selection, Redline, Comments, formatting, link/comment actions and Ask Themis.ai to redraft. No Markup remains the initial document display mode. If existing editor toolbar classes need styling, scope from the owned DocumentPanel wrapper; do not rewrite editor internals.

Below the editor keep Save, Reload saved file, Word, PDF and export mode. Unsaved export/reload behavior remains explicit. Draft request, template choice, template preview, keep preview, update offers and conflict resolution stay visible when relevant. Request text is needed for an empty direct request; sources and templates are optional. Do not invent a source count requirement or new character limit.

### 5.5 Source/evidence reading — C2

On wide screens show source preview beside the same mounted editor. At narrow widths stack it with a persistent Editing: <document> indicator and Back to where you were. Do not change active editor id, draft target or inquiry selection when showing a source.

Show actual title/path/revision, source state, passage or exact-passage gap, applicability or support gap. Keep claim id/output revision available in details. Use in this request is explicit and separate from Open original, Back and Create working copy. Loading, unavailable revision, missing file and failed fetch states retain a clear return path and the draft.

Preserve reference links from answers, issues, documents and map details through the same target mechanism. Do not create a second link parser or generic file-open fallback that loses the locator or origin.

### 5.6 Decision map — C7

Keep the separate route and existing selection/return parameters. Use a compact header with full-question disclosure. Show Local neighborhood/Whole matter, zoom controls, selected record detail, and a complete outline using the same record identities and edge labels.

For Whole matter with many records, default to the readable outline as the primary surface; keep the full visual available through Show visual map. Do not rely on fitting 34 records into unreadable 10% labels. Local view keeps a readable visual and selected detail. No graph library or new layout algorithm is needed. Keep current layout data, node/edge identity, conditions, source actions, keyboard reachability and pan/zoom behavior.

Do not omit records to match the four-node sample. Do not invent edges or infer currentness from position. Unknown and historical/hypothetical conditions stay explicit. Use prose labels for node types in the UI where safely mapped, while preserving raw ids/types in data.

The selected detail retains Discuss this path, Try a different assumption, Back to issue, document references and claim support. The map conversation is one instance for that route; keep it accessible through a named disclosure/jump without copying Matter's chat into another instance on the same route. Returning to Matter preserves existing conversation and issue.

### 5.7 Scenario and flow — C6

Use separate clearly labelled regions for current baseline, hypothetical changes, analysis result and saved scenarios. Preserve the existing current-fact selector, multiple changed values, analysis question, run/cancel, result, save/compare/adopt/rebase controls and historical state. The concept's empty saved list is not a substitute for populated behavior.

Actual fact correction stays a separate neutral disclosure with explicit submit. Do not place it inside a hypothetical form in a way that shares submit handlers or state. Empty/cancelled analysis makes no factual change.

Business flow keeps editable sketch, actors, relationships, remove controls, saved state, Save flow and explicit acceptance of proposed facts. A diagram is not a new source of truth. Preserve existing fields and saved handlers, including validation and local unsaved input.

### 5.8 Research, work, records and lifecycle — C8 + C9

Use compact queue/work rows with state, title, priority, owner and an explicit next action. Preserve required versus optional work, selected work item, assignment controls, participant roles, due information and descriptions. Do not remove less common controls because they sit below the first viewport.

Research rows retain queued/running/complete/partial/failed/interrupted states, exact saved packets, continue/retry/reorder/cancel where currently supported. Do not launch research when opening a row. Saved packets remain readable during partial failures.

Keep recommendations, proposed recommendation updates and explicit acceptance outside recorded decisions. Retain current draft/finalization, exact-artifact approval, manual delivery and closure controls, rationale inputs, consistency notices and repair controls already present. A manual delivery record describes an action outside Themis.ai. Do not enable direct send or collapse lifecycle steps into Complete.

Keep Current task/workflow state, Original request, participant list and Add participant (name, role, disabled/busy state), current/other work assignment controls, Matter artifacts, Record durable decision, and the manual New draft form (title, content, Save current draft). Manual New draft remains separate from the agent draft request.

Materials/activity retains dossier, records, research packets, review packets, timeline and maintenance. These may live in a clearly named section, not an unlabelled catch-all menu. Do not remove the existing outside-counsel packet review/export path if it is available.

### 5.9 Files and templates — C4

Use distinct Matter files and Inquiry context tabs. Keep library upload versus inquiry upload, multi-file progress/results, retry, folder view, search, source ids, saved outputs and per-file inclusion. An Open output control only opens; Add to next inquiry changes inclusion. Do not replace per-file selection with a single ambiguous bulk action as in a simplified image.

Keep the Matter tree’s New chat action. It starts the existing blank conversation through `conversationSeed`; it does not clear document or inquiry context unless current behavior does so. Keep MatterTree mounted/callbacks wired without modifying that frozen component.

Template library preserves all actual templates, versions, selection, create, duplicate, edit, default and preview. Template editor preserves audience, purpose, tone, length, exclusions, source presentation, sample wording, enabled state, instructions, section outline, version checks, save/cancel and preview. Show default only when stored. Do not make template selection a drafting gate.

### 5.10 Business replies, handoffs and comparisons — C5

Business requests retain supporting-question selection, editable request, person/date, prepare/copy, explicit external-request recording, supplied reply, provenance and answer reconciliation. Do not hide existing populated reply history. Explain enabling conditions beside disabled actions.

Handoff retains exact scope, current owner/basis, recipient, ask, open questions, requested date, included references, pending creation, brief, accept/reject/cancel actions and history where supported. No configured recipient is a meaningful empty state. Do not invent a recipient or silently assign work.

Comparison shows saved comparisons first, then the new-comparison form. Preserve supplied version choices, prior-work selection, source-only scope, exact passages versus generated effects, affected draft actions and saved history. Earlier work is optional for source-only comparison. A comparison does not edit previous advice or automatically create a new draft.

### 5.11 Prior work, practice notes, watches — C6

Keep queries, real results, relevance/differences, Include/Open actions, practice-note generation/edit/application, selected assumptions, linked Watch drafts and existing builders. Do not duplicate Skills/Watch implementation. Use compact result rows and named disclosures. Preserve per-matter local inputs and pending/error states.

## 6. Parallel execution policy

Coordinator: exact `gpt-6-astra`, low reasoning, when supported. Implementers: exact `gpt-5.6-terra`, high reasoning. Independent reviewer: exact `gpt-5.6-sol`, medium reasoning. Runtime support must be checked from the dispatch tool before work. Never silently substitute. If the coordinator's own runtime differs, report it rather than claim Astra routing.

Use coding subagents, one shared dirty working tree, at most three active workers excluding the coordinator. Workers must not spawn agents, create user-visible tasks, create worktrees, commit, push, deploy, change services, or run shared builds. Reviewers are read-only. All dependency/contract decisions remain with the coordinator, with Sol review for risky seams; Terra is not the architecture authority.

At preflight, capture dirty status and file hashes, inspect active writers and listeners, and preserve all existing changes. Most workspace files may be untracked. Never use checkout/reset/clean to establish a baseline. Existing dirty graph output is expected.

### Exact ownership table

All paths below are relative to repository root. `w/` in this table means `frontend/components/workspace/`; expand it in every worker prompt. New CSS Modules are allowed only at the named path. No worker edits tests, docs, manifests, shared types or another chunk's files.

| Chunk | Exclusive application write ownership | Dependencies |
| --- | --- | --- |
| C1 Review | `w/UnderstandPanel.tsx`, `w/OrientationSummary.tsx`, `w/WorkItemSummary.tsx`, `w/IssueNavigator.tsx`, `w/IssueReviewDetail.tsx`, `w/ChangeRecap.tsx`, new `w/MatterReview.module.css` | C0 contracts |
| C2 Documents | `w/DocumentNavigator.tsx`, `w/DocumentTabs.tsx`, `w/ReferencePreview.tsx`, `w/EvidenceDrawer.tsx`, `w/ClaimMarkdown.tsx`, `frontend/components/DocumentPanel.tsx`, new `w/MatterDocuments.module.css` | C0 contracts |
| C3 Conversation | `frontend/components/ChatPanel.tsx`, `w/ConversationDock.tsx`, new `w/MatterConversation.module.css` | C0 contracts |
| C4 Files/templates | `w/MatterFilesPanel.tsx`, `w/ContextTray.tsx`, `w/OutputTemplateLibrary.tsx`, `w/OutputTemplateEditor.tsx`, new `w/MatterTools.module.css` | C0 contracts |
| C5 Continuity | `w/FactRequestPanel.tsx`, `w/HandoffPanel.tsx`, `w/ChangeImpactPanel.tsx`, new `w/MatterContinuity.module.css` | C0 contracts |
| C6 Exploration/reuse | `w/ScenarioPanel.tsx`, `w/InquiryActions.tsx`, `w/BusinessFlow.tsx`, `w/PriorWorkPanel.tsx`, `w/PracticeNotePanel.tsx`, `w/AssumptionWatchPanel.tsx`, new `w/MatterExplore.module.css` | C0 contracts |
| C7 Map | `w/DecisionMap.tsx`, `frontend/app/matters/[matterId]/decision-map/page.tsx`, new `w/MatterMap.module.css` | C0; uses unchanged C2/C3/C6 interfaces |
| C8 Work/records | `frontend/components/ResearchQueuePanel.tsx`, `frontend/components/RecommendationPanel.tsx`, `frontend/components/ReviewPacketPanel.tsx`, new `w/MatterWork.module.css` | C0 contracts |
| C9 Integration/frame | `frontend/components/MatterWorkspace.tsx`, `w/DraftWorkspace.tsx`, new `w/MatterSectionNav.tsx`, new `w/MatterA.module.css`; `frontend/app/globals.css` only for coordinator-approved narrow edits | C1–C8 accepted files and frozen hooks |

Coordinator alone owns `docs/matter-a-style-ui.*`, `output/matter-a-style-ui-acceptance/`, and any necessary focused test updates under `frontend/scripts/`. The route `frontend/app/matters/[matterId]/page.tsx`, `AppShell.tsx`, `MarkdownRichEditor.tsx`, `RevisionPlugin.tsx`, `ChatCards.tsx`, `MatterTree.tsx`, `frontend/components/workspace/TeamWorkList.tsx` and all other application files remain frozen by default. The coordinator may amend exact ownership for a demonstrated presentation blocker after checking all callers; record the amendment before dispatch, never let workers guess.

Shared caller rule: C0 records all callers before C4/C8 dispatch. OutputTemplateLibrary/Editor also render on `/skills`; ResearchQueuePanel also renders on `/matters/[matterId]/research`; ReviewPacketPanel also renders on `/decisions`. Default to neutral shared row/card improvements that remain valid at those callers. Do not introduce a Matter-only prop ad hoc. If such a variant is required, the coordinator freezes its exact optional prop/default and serializes producer/caller changes under a recorded ownership amendment. Include one desktop no-regression observation of these three routes in the isolated acceptance environment. Do not redesign those pages. TeamWorkList is used by Today, not MatterWorkspace, and stays frozen.

### Chunk inputs and acceptance boundaries

Each Terra worker reads its owned components completely and every direct caller before edits. C0 supplies a frozen excerpt bundle from the current checkout, not a guessed signature. Include imported props, current return JSX, each callback that can persist or execute, and the relevant responsive CSS. Existing source is required context; the excerpt bundle is not permission to skip the component's other controls.

| Chunk | Primary design images | Required related read scope | Coordinator acceptance before integration |
| --- | --- | --- | --- |
| C1 | 01, 02 | MatterWorkspace call sites; workspaceTypes; orientationPresentation; design tokens; Understand inventory | All review controls mapped; existing review-layout, issue-review and orientation-presentation invariants retained; B01–B06 pending live integration |
| C2 | 04, 05 | DocumentPanel callers; documentNavigation; workspaceTypes; MarkdownRichEditor wrapper/classes; ClaimMarkdown callers; Draft inventory | Document-reference/navigation and evidence invariants retained; no callback/identity changes; B12–B17 pending live integration |
| C3 | 03 | All ChatPanel/ConversationDock callers; chatRunLogic; existing globals scroll rules; Discuss inventory | Single conversation/composer retained; chat-run-recovery and initial-load invariants retained; B10–B11 pending live integration |
| C4 | 10, 12 | MatterWorkspace template/file call sites; workspaceTypes; current upload and template helpers | Template/file destination controls all mapped; output-template and existing file-drop behavior retained; B17–B18 pending live integration |
| C5 | 11, 12 | MatterWorkspace continuity call sites; continuityTypes; impactPresentation | Continuity and change-impact invariants retained; B19–B20 pending live integration |
| C6 | 07, 09 | MatterWorkspace and map callers; workspaceTypes; scenario/reuse/flow helpers; Map inventory | Exploration/reuse invariants retained; real/hypothetical distinctions unchanged; B08–B09/B21 pending live integration |
| C7 | 06, 07 | decisionMapLayout; decisionMapTypes; frozen C2/C3/C6 interfaces; Map inventory | Decision-map invariants retained; outline represents every record/edge available in current projection; B07–B10 pending live integration |
| C8 | 08 | All research/recommendation/packet callers; current lifecycle bindings in MatterWorkspace | Research-queue and workspace-UX invariants retained; lifecycle controls mapped; B06/B22 pending live integration |
| C9 | All 12 | All accepted leaf interfaces/CSS; Matter route; DraftWorkspace; middle-pane and load-integrity checks | All slots remain mounted; exact section reveal hooks wired; no state/API refactor; B01–B26 evaluated after integration |

These are checks of real invariants, not instructions to run each named script after every chunk. During waves, coordinator accepts file ownership, callback/state preservation and static design completeness. It may run a relevant focused check at a stable boundary if code changes warrant it, then records that result once. Final aggregate checks and live acceptance remain separate required steps. A CSS-only leaf acceptance never counts as a browser pass.

### Waves

- C0: coordinator preflight, image/code reading, isolate acceptance environment, freeze CSS/section hooks and control inventory. No Terra implementation until this is recorded.
- Wave 1: C1, C2, C3 in parallel.
- Wave 2: C4, C5, C6 in parallel. C1–C3 corrections can use a slot, but do not exceed three. Contracts remain fixed.
- Wave 3: C7 and C8 in parallel. Use the third slot only for bounded C1–C6 corrections. C7 consumes the accepted C2/C3/C6 components.
- Wave 4: C9 alone, after C1–C8 files and hooks are accepted. It integrates the final markup and does not edit leaf-owned files.
- Wave 5: all application writers stop. The coordinator validates the combined tree and runs the deduplicated check set. It does not make unassigned application edits. Fresh Sol medium independently reviews the combined implementation and actual screenshots. Route each material fix to its exact owning Terra worker, stop that worker after the fix, then rerun only affected checks and re-review material fixes.
- Final: coordinator performs its own end-to-end review, updates graphify and the verification report, cleans up only owned temporary services/artifacts, and reports exact routing/results/limits.

The skill's preference for linear handoffs applies inside each worker task. The user's parallel request controls inter-worker scheduling. Each worker gets a strict local sequence; workers do not schedule each other.

## 7. Worker handoff specification

For every dispatch, send a self-contained message with these sections. Do not tell a worker merely “read the plan and do C2.”

1. Goal: its concrete visible outcome and the relevant image paths.
2. Context: repository root, existing component responsibilities, exact owned paths, frozen interfaces, current source excerpts/signatures and relevant design rules.
3. Steps: inspect own components/callers; restyle owned JSX/classes; preserve every existing callback; check normal/empty/busy/error/long-content states; return findings and owned file list.
4. Constraints: no out-of-scope changes, no agents, no broad tests/build/services, no backend/type/storage changes, no sample data, no refactoring state, no real-reference mutations.
5. Examples and failure cases: use the list below for its cluster.
6. Verification: which focused check the coordinator will run, exact expected user-visible result, and the worker's static audit. A worker may run a named read-only helper only after coordinator approval that it cannot conflict with ongoing edits.
7. Return: files changed, exact behavior retained, checks actually run, screenshot/control gaps, remaining risks, and any requested ownership amendment. Never call compilation a usability pass.

Required examples by chunk:

- C1: a six-issue matter with 300-character titles; no citations; one question linked to two issues; issue edit conflict; disposition cancel; partial question save. No fabricated short labels in saved data.
- C2: two drafts both dirty; duplicate titles at different paths; same product with two versions; source preview while A is active; unavailable source revision; explicit export of A while B remains dirty; late draft completion after user selects B.
- C3: complete chat with enabled composer; running chat; failed refresh retaining answer; long historical intake; attachments; separate scope/target resets; shortcut starts exactly one inquiry on fixture only.
- C4: zero and eleven templates; edit versus preview/keep; partial multi-file upload; library versus inquiry destination; unavailable generated source; duplicate/copy/default semantics.
- C5: no recipient; a configured recipient; prepare/copy without external recording; saved supplied reply; source-only comparison and comparison with earlier work; no automatic prior-work edits.
- C6: empty and saved scenarios; compare historical baseline; cancelled hypothetical; explicit adoption separate from fact correction; dirty flow actor; prior-work empty/results; unchecked/checked assumptions without implicit Watch creation.
- C7: 7-node local and 34+ node whole map; 300-character labels; disconnected records; unknown condition; document node; keyboard outline selection; same issue/conversation return; no pan-induced click submission.
- C8: complete/partial/running research; required/optional work; completed work with open issue; proposed recommendation; final but unapproved artifact; explicit approval/delivery/closure controls; review-packet empty/resolved states.
- C9: all Matter panel clusters together; state retained when disclosures/tabs change; index opens closed section; no duplicate chat/editor; first viewport density; source stacking; no global-route regressions.

## 8. Acceptance environment and protected data

Use an isolated vault for every mutation and browser acceptance. Do not run action buttons on `MAT-20260904-abf788`. Prefer not to open the reference during implementation at all: the 47 saved screenshots provide its design baseline.

Create a new owned acceptance directory: `output/matter-a-style-ui-acceptance/`. Record environment paths, ports, PIDs, fixture ids, hashes and commands there. Do not overwrite the earlier survey or decision-map evidence.

Read `backend/tests/conftest.py`, current fixture creation tests and `output/matter-review-decision-map-acceptance/isolated_server.py` / `audit_fixture.py` before preparing the new harness. Reuse their proven patterns, not stale temporary paths. The old `environment.json` is an inventory, not evidence the old service/vault still exists.

Critical isolation detail verified in current code: `ActiveContextManager(settings, *, pointer_path=...)` reads a saved pointer before `settings.resolved_vault_path`. Setting VAULT_PATH alone is insufficient. The acceptance harness must use a fresh pointer path inside its isolated directory, explicit isolated settings, scheduler disabled and mock/disabled external providers. Do not activate the test vault through the user's normal app. Verify the actual runtime vault root before any mutation.

`frontend/lib/api.ts` uses `NEXT_PUBLIC_API_BASE_URL`, defaulting to localhost:8000/api. Point the acceptance frontend at the isolated API. Do not assume the normal frontend is safe merely because the page shows a test matter. Use unused ports selected after listener inspection; 3123/8123 are historical examples, not reserved promises.

Use a separate Next development/build output directory to avoid corrupting an existing server's `.next`. Inspect/reuse the existing isolated build wrapper only after checking current Next version/config. Retain the real project config and its defaults. Do not rewrite tsconfig or next-env just to create isolation. If Next generates changes there, compare to preflight bytes and restore only that known generated delta after checks. Do not stop or restart unrelated services.

Seed through current services or fixture helpers, entirely inside the isolated vault. Seed enough data once:

- One realistic matter, six issues, short/long question and answer variants.
- Two editable work products with distinguishable names plus duplicate-title/version coverage; one final/approved example where the service can create it legitimately.
- Two source documents, one with a literal known fixture passage, one missing/unavailable reference case.
- Claim support attached to actual fixture text/revisions, and one unsupported claim. Label fixture sources as supplied; do not invent externally verified law.
- Shared factual/legal questions, one unanswered and one answered; options and linked mitigation.
- A recorded decision produced by the current explicit service, and an unresolved issue.
- One completed and one partial research packet, usable saved prose, and a conversation with earlier/latest turns.
- A saved historical hypothetical, a local business flow, a configured test recipient, and sample comparison inputs.
- At least one template, one comment and one tracked change for review controls. These are test records, never added to the reference.

Build a tiny second empty matter to inspect genuine empty states. Do not generate live legal research for a styling demo. If a needed action requires model output, use the existing mock provider or deterministic test stub in the isolated harness and label the result as fixture output. The UI must still call the actual application endpoint and exercise its normal state handling; do not fake success in the page.

Before and after acceptance, hash the repository vault, the active reference vault and `.counsel-os/active-vault.json`. Exclude only disposable SQLite/cache differences from authoritative-change checks. Any unexpected authoritative change stops further mutations and is reported. Recovery requires exact provenance/byte evidence and a backup, never a blanket revert.

## 9. Verification — thorough without repeated broad tests

This document defines future checks. No implementation tests were run merely to write this plan. Named scripts/paths were inspected in the current repository. Previous task results are historical evidence, not proof for this rebuild.

Workers do not each run full suites. Coordinator records one deduplicated check ledger. Run cheap typecheck at a stable wave boundary only when it can catch cross-file mistakes. Do not run it while another worker is halfway through a change. Do not build every chunk.

At the combined stable implementation, run:

```bash
cd frontend
npm run typecheck
npm run check:single-lawyer-workspace
npm run check:matter-review-decision-map
npm run check:workspace-ux
npm run check:lawyer-continuity
node --experimental-strip-types scripts/check-middle-pane-accordion.ts
npm run build
```

The aggregate scripts already include drafting, templates, evidence, issue/map/document checks and related behavior. Do not immediately repeat their individual scripts. If a correction affects only one invariant, rerun its individual check and typecheck; rebuild only after material code changes or an unresolved build concern.

Follow AGENTS.md's backend verification once at final integration (`cd backend && .venv/bin/pytest`, using the existing environment). Do not run a new broad baseline backend suite or repeat it for CSS-only corrections. If the user explicitly waives that check, record the waiver. A prior timing-sensitive research test failed under load and passed alone; do not pre-emptively loosen its timeout. Run the backend suite when the browser is idle and diagnose only actual failures.

Several frontend scripts inspect source text, JSX shape, class names or CSS. Expected markup changes can invalidate a regex without changing behavior. Do not delete the assertion or replace it with a class-exists check. Coordinator alone updates such tests to the same semantic invariant, preferably component/render behavior, and Sol reviews every test diff. No test-only production hooks or dependency additions are authorized.

Do not add tests for every padding/color value. Add or adapt a focused test only for changed section navigation, one-mount retention, explicit execution labels/callback counts, responsive container behavior or another actual regression risk not covered. For malformed/partial API data, reuse current error/empty fixtures and verify useful content remains. Do not create a new parsing layer to pass a visual test.

### Browser procedure

Use the Codex in-app browser. Native Mac browser control and 200% zoom are not required. The user explicitly skipped the 200% check. Do not reintroduce it.

Coordinator alone owns browser acceptance and viewport changes. Workers use saved screenshots for visual references; if a worker needs live inspection, grant one exact isolated tab and forbid resize and mutation unless its scripted fixture action is explicitly assigned. Never let several workers change browser-global viewport state at once.

If the Mac is locked, first try the in-app browser and an existing owned tab through supported tools. If both fail, finish all work that does not need it, document exact missing checks, and report the access blocker. Do not claim browser completion from HTML parsing or compilation, and do not use native/OS/CDP workarounds.

Use 1280×900 and 390×844 as the two full-flow acceptance sizes. Add one 900px-wide check only for the editor/source breakpoint. One keyboard pass at desktop covers the main flow; do not repeat every click at every size. Use real viewport screenshots at upper/lower positions and dialog states. A full-page screenshot alone is insufficient when text is too small to inspect.

### Demo checklist with expected results

| ID | Action in isolated fixture | Expected observation |
| --- | --- | --- |
| B01 | Open normal matter at 1280×900 | Real question/answer/state/owner; next action <=540px top; no giant work banner or fabricated count |
| B02 | Read full answer and all six issues | Full wording/links preserved; ranked three rows + full list refer to same ids |
| B03 | Open issue, source support and linked question | Correct claim revision/passage/gap; shared question identity; no source-use side effect |
| B04 | Open/cancel disposition and formal-decision forms | All fields accessible; zero authoritative hash change |
| B05 | Record fixture disposition through explicit submit | Existing receipt/state/history updates; recommendation remains distinct |
| B06 | Complete linked fixture mitigation | Work completes; issue/matter/decisions do not auto-close/change |
| B07 | Open local/whole map and keyboard outline | Full records/edge labels available; whole map readable via outline; no false green/known state |
| B08 | Open hypothetical, cancel, then analyze fixture once | Cancel changes nothing; analysis preserves real facts/decisions/drafts; actual result visibly hypothetical |
| B09 | Inspect saved historical scenario and explicit adoption controls | Baseline/history/current distinctions preserved; no adoption on selection; correct-fact form separate |
| B10 | Back to issue and Discuss | Same issue/conversation retained; one composer; accurate target |
| B11 | Run one deterministic suggestion in fixture | Exactly one run; pending/result states visible; no duplicate submission |
| B12 | Edit A, switch B, edit B, open source, back A | Both dirty texts retained; source never becomes draft target/context; active doc explicit |
| B13 | Switch same-title/version documents | Path/revision disambiguation; no cross-document local-text leak |
| B14 | Open reference links from answer/issue/editor/map | Consistent preview/origin/locator; missing reference retains useful parent content |
| B15 | Inspect comment and tracked-change controls; accept one fixture change | Same editor surface; No Markup default; author/state correct; no bulk accept behavior |
| B16 | Save/export A while B is dirty | Only intended A action; B retained; actual DOCX/PDF target/reference list checked once |
| B17 | Open template; preview/cancel then explicit keep in fixture | Optional template, preview distinct from kept output, edits retained, real version checks |
| B18 | Open Files/context; select fixture file for next inquiry | Opening alone does not include it; explicit inclusion does; library/inquiry destinations distinct |
| B19 | Business request prepare/copy and external-record form | Copy not shown as sent; saved external record only on explicit action |
| B20 | Handoff and comparison populated/empty states | No-recipient reason; scope/reference fields; history first; source-only comparison works without earlier work |
| B21 | Open every lower index destination | Section reveals before focus/scroll; flow/prior work/watch/research/materials, Original request and New chat reachable; no form remount loss |
| B22 | Inspect final/approval/delivery/closure and maintenance | Existing explicit controls, Add participant, manual New draft and rationale retained; no new automatic lifecycle transitions |
| B23 | 390×844 main review→issue→draft→source and one form | No page horizontal overflow, readable text/buttons, source stacked, keyboard/touch controls visible |
| B24 | Tab/Space/Enter/Escape on view tabs, sections, issue/map/source/dialog | Visible focus; correct native behavior; focus returns; no hidden panel focus or accidental submit |
| B25 | Empty matter, partial read, failed optional support fetch | Honest empty/loading/error, useful prior content retained, Retry not duplicated |
| B26 | Final protected hashes and console/network review | No protected authoritative changes; no new console errors; no duplicate workspace load/run pattern |

Use focused evidence, not dozens of duplicate screenshots. Record one upper/lower set for Understand, each named panel state, the draft/source pair, map/outline, the two missing dialogs and template detail, and mobile/keyboard proof. Every B row gets pass/fail/not-run with artifact path and a one-line observed result. Record the one desktop shared-caller pass for `/skills`, the isolated matter’s `/research` route, and `/decisions` beside this table.

## 10. Independent review and completion

After all implementation writers stop, dispatch a fresh `gpt-5.6-sol` medium reviewer. It must not be a worker reviewing its own changes. Give it this blueprint, exact baseline/diff, all 12 final design images, the 47-source inventory, current screenshots, check ledger, and frozen behavior contracts.

Require review in four passes:

1. Design fidelity: actual browser images follow A's hierarchy, type, spacing, compact rows and semantic states across upper and lower screens. Do not accept only a screenshot of the first viewport.
2. Interaction preservation: compare before/after control inventory; identify missing/disabled/retargeted/remounted behavior, duplicate chat, source/context confusion, wrong lifecycle action or lost local input.
3. Code and checks: inspect changed lines, shared callers, async target/revision handling and every test update. No unrelated refactors or weakened assertions.
4. Evidence: verify that claimed checks actually ran, that mock output is labelled, browser gaps are not called passes, and protected data remained unchanged.

Review output must give concrete material findings with file references, reproduction/expected behavior and suggested scope. Route fixes to the owning Terra worker under a renewed exact ownership lock. Reviewer stays read-only. Re-review material fixes; do not ask for a cosmetic approval round after every small padding change.

Coordinator then performs an ultimate review against sections 1–5 and B01–B26. Passing compile or a worker's report is not proof. Every live control is retained, intentionally relocated with a recorded destination, or listed as a real unresolved defect. No “out of scope” excuse for an existing attached workflow omitted by a mockup.

Run `graphify update .` after final application changes. Record exit/result and tool limitations; do not add an LLM labeling run or optimize graph size as unrelated work. Stop only owned temporary services, preserve normal development services, and keep evidence/fixtures for review. No commit, push or deploy.

## 11. Progress, reports and resumption

`docs/matter-a-style-ui.handoff-progress.md` is coordinator-owned. Track C0–C9, combined checks, browser rows, independent review, corrections and final review separately. After each accepted chunk, record paths, checks and any contract amendment immediately. Do not mark a chunk done because a worker says it is done.

Create `docs/matter-a-style-ui.verification.md` during execution. It must contain: current status first; actual routing; baseline/ownership log; before/after control mapping; screenshots and measurement table; deduplicated command results; B01–B26 statuses; review findings/corrections; protected hashes; known limits; exact service cleanup. Historical attempts belong below the current evidence summary.

On resume, inspect progress and active writers first. Do not repeat completed work or broad tests without a new reason. If a completed chunk no longer verifies, diagnose the changed state; do not reapply the whole patch. Preserve all unrelated work.

## 12. Not scheduled

No backend redesign, new research agent, legal verification gate, global state rewrite, navigation framework, graph engine, chart library, new auth/roles, design-token migration, automated screenshot platform, global top-level-page restyle, live legal research, or production deployment. Add none merely because the plan is detailed. Revisit only if a concrete accepted demo failure cannot be fixed within existing mechanisms.

## 13. Definition of done

All nine UI chunks are integrated. Existing Matter-connected controls survive the rebuild. The isolated real application demonstrates the full review→issue→support→hypothetical→draft/source→conversation journey in A style. Required checks pass or a specific evidenced pre-existing/access limit is plainly reported. Sol medium finds no unresolved material issue, and the coordinator independently confirms the outcome. The verification report is complete, graph updated, protected data preserved, and no unrelated changes/commit/deploy made.


---

Final execution instructions:

Proceed through C0, the dependency-safe waves, combined checks, the browser demo, fresh Sol review, material fixes and your own ultimate review. Continue without asking about routine implementation choices. Resolve minor code drift from current source under the frozen contracts. If a named interface differs materially, serialize the affected work, inspect its callers, and record a coordinator-reviewed contract amendment before changes. Ask only for a material user-owned decision or a genuine input/access blocker that prevents further safe progress. Do not let Terra invent new architecture to bypass a mismatch.

Do not change backend behavior, shared state models, legal conclusions, source verification, storage authority or editor internals for a visual redesign. Do not drop controls omitted by concept images. Do not automatically use an opened source as inquiry context or a draft target. Do not lose local text on tab/disclosure/source changes. Do not turn hypothetical analysis into real facts or decisions. Do not turn completion of work into issue resolution or matter closure. Do not run suggestion/inquiry controls on the protected reference matter.

Run only meaningful, coordinated checks. Maintain `docs/matter-a-style-ui.verification.md` with exact observed results, screenshots, check commands, routing, ownership changes, findings and limitations. Update `docs/matter-a-style-ui.handoff-progress.md` after every accepted step. Mark browser gaps NOT RUN rather than claiming a pass from code or worker reports.

Finish with the working UI and evidence. Your final response must state what changed, what was verified, the actual models/reasoning used, unresolved limits, and links to the verification report and representative screenshots. Do not commit, push, deploy or alter unrelated files.
