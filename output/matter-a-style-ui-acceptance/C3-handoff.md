# C3 bounded Terra high implementation

## Goal
Implement the Matter A presentation rebuild for your exact components in /Users/bharris/Programs/counsel-os-mvp. This is authorized implementation, not another plan.

Actually view these final image files:
/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/03-discuss.png

## Exact write ownership
frontend/components/ChatPanel.tsx
frontend/components/workspace/ConversationDock.tsx
frontend/components/workspace/MatterConversation.module.css
Only these files. Do not edit global CSS (C9 must request approval first). Preserve all existing dirty/untracked changes. No agents, worktrees, commits, push, deploy, services, browser changes, backend, types, manifests, tests, docs, or other application files. Stop after your report; do not begin another chunk.

## Local instructions
# Counsel OS coding-agent instructions

Read `docs/PRD.md` and `CODEX_HANDOFF.md` before changing the application.

## Product north star

Reduce the product lawyer's cognitive load. Every screen and agent action should help the lawyer understand the matter, see what work remains, and reach the decision they are uniquely positioned to make.

The system is the subway, not the last mile. It must reliably carry the lawyer from raw request to an organized, researched, editable foothold. It is not required to produce legally perfect answers.

## Do not add legal-answer theater

Do not add mandatory verifier agents, legal perfection gates, generic disclaimers, confidence thresholds, multi-agent votes, or refusal behavior just because the work is legal. Produce the strongest useful first pass, state material assumptions briefly, and continue toward work product.

Keep recommendations separate from explicitly recorded decisions. That is record integrity, not a legal-answer guardrail.

## Deliver the best available answer

- A missing or unconfirmed citation may reduce support for an answer. It must not prevent the answer from being delivered.
- Never invent a source or imply that an unverified source was verified. Label supplied sources, verified sources, unverified leads, assumptions, and generated analysis clearly.
- Preserve and show useful model output when citation formatting, schema parsing, tool-call decoding, search, fetch, memory, or trace handling fails. Record the failure and continue to a best-effort answer when non-empty output is available.
- Degrade gracefully toward an answer. A failed research or tool step may reduce context, but it must not turn into a refusal or an empty result when a useful answer can still be produced.
- Step, cost, and timeout limits are execution controls. When a limit is reached, make a final answer-only attempt using the information already collected.
- Clarification is optional assistance, not a completeness gate. Ask one question only when its answer could materially change the issue map, analysis, or recommendation. Otherwise state the assumption and continue.
- Prefer a prompt, focused context change, or direct tool improvement before adding a service, pipeline stage, verifier, or new agent. New machinery must earn its place through observable lawyer usefulness.

## Engineering rules

- Keep the MVP runnable at the end of every change.
- Preserve Markdown as the source of truth and SQLite as a disposable index.
- Keep providers, agents, tools, workflows, and schedules modular.
- Markdown tool files are declarative; never execute embedded Markdown code.
- `backend/frontmatter.py` is the intentional local compatibility shim. Do not install `python-frontmatter` or rewrite its imports to use that package.
- Keep all file operations inside `VAULT_PATH`.
- Prefer focused files and boring, testable code.
- Do not introduce auth, cloud tenancy, a queue, embeddings, Tauri, native Word redlining, or a plugin marketplace before the core acceptance tests pass.

## Design language

- Treat `docs/DESIGN_LANGUAGE.md` as the source of truth for visual and interaction rules.
- Reuse semantic roles from `frontend/lib/design.ts` and matching variables in `frontend/app/globals.css`. Do not add page-local attention colors.
- Color must show meaning: rose is overdue or failed, amber needs the lawyer's attention, purple is agent work, and green is healthy or complete.
- Put a clear state word beside each color. Never make color the only signal.
- Use light washes on rows and title cells to guide attention. Reserve stronger tints for small controls, badges, and selected states.

## Verification

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

Then walk `docs/ACCEPTANCE_TESTS.md` in the browser.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After building or modifying application code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# Themis.ai design language

This file is the source of truth for visual and interaction decisions. It was
first imported from the `Themis.ai` design canvas
(`claude.ai/design/p/df618af1-323e-4c96-ab86-0feb13fb166e`, file `Themis.ai.dc.html`).
All screens use the shared tokens in `frontend/lib/design.ts` and
`frontend/app/globals.css`.

## The premise

The lawyer's scarce resource is attention, not information. Every screen answers
three questions in order: **what needs you**, **why**, and **the one thing to do**.
Boards, metrics, traces and file trees are all one layer down from that answer.

## Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f7f5f1` | Page ground |
| `--raised` | `#fffefb` | Cards, rows, the document itself |
| `--sunken` | `#efece5` | Segmented controls, chat bubbles from the lawyer |
| `--rail` | `#f4f2ec` | Side rails, tab strips, editor gutters |
| `--ink` | `#1b1a17` | Primary text and the one primary button per region |

Rules: `--line` `#ded9d0`, `--line-soft` `#e2ded4`, `--line-faint` `#eae6de`,
`--line-hair` `#f2efe8`, control borders `#d6d1c7`.

Text: `--ink` `#1b1a17`, `--ink-2` `#3a3733` (body), `--ink-3` `#55524b`
(secondary), `--ink-4` `#5f5b54` (labels), `--ink-5` `#8a857c` (placeholder),
`--ink-6` `#a8a298` (disabled).

## Colour roles — meaning, not decoration

| Role | Solid | Light wash | Strong tint | Means |
| --- | --- | --- | --- | --- |
| Needs my attention | `#E0A008` | `#FFFDF4` | `#FDEEC0` | Blocked on the lawyer, stale, awaiting judgment |
| Healthy / complete | `#146B54` | — | `#E0EFE9` | Done, current, on track |
| Failure / overdue | `#B33A20` | `#FFFAF8` | `#F8E3DC` | **Reserved.** Never for "high risk" or emphasis |
| Agent-generated | `#5F5AC0` | `#FDFDFF` | `#EAE8F9` / `#F4F3FC` | Drafts, recommendations, machine claims |
| Human-recorded fact | `#1b1a17` | `#f7f5f1` | — | Decisions, signatures, dates |

Every colour carries a word beside it. A dot alone is never the signal.

Use the light wash for a row, card, or matter-title cell. Its purpose is to
guide the eye without filling the screen with strong color. Use the strong tint
only for a small badge, button, selected filter, or focused callout. Stage names
do not receive a semantic color because a stage does not prove who is waiting.

Emphasis is not a colour role. Unread, new, and selected are shown with weight,
an ink spine, or a border — never with ochre. On Briefing, ochre belongs only to
an item whose review packet is **Required**, because that is the only item on
the page that is genuinely waiting on the lawyer.

The state controls the color. A page, route, or component must not assign a
different color to the same state. Use the shared role tokens instead of a local
hex value.

## Type

- **Source Serif 4** — matter titles, section headings, memo and draft body,
  recorded decision text. Anything read for minutes rather than scanned.
- **IBM Plex Sans** — every control, label, table cell, chip and status word.
- **IBM Plex Mono** — record metadata only: ids, dates in a register, front
  matter, `10px` with `.09em` tracking, uppercase.

Base UI text is `15px`. Grey is dark enough to read (`#55524b`, not `#8a857c`).

## Agent versus record

This is the one rule that never bends.

- Agent output keeps the **dashed** iris border and iris tint. Ordinary Themis.ai
  conversation is labelled **Themis.ai**.
- **Themis.ai · Not yet reviewed by an attorney** appears only on qualifying
  generated work product with an explicit current unreviewed state, such as an
  unsaved company-profile draft or an open generated review packet.
- Saved company profiles use **Company profile · Saved**. Resolved or
  monitoring review packets do not show an unreviewed status.
- Recorded decisions: solid border, serif, a real date, a named human.
- Recommendations never appear inside the decision table. They sit outside it,
  and the only path from one to the other is the act of recording.
- Matter artifacts label an immutable current final as **Final response**. They
  label it **Approved response** only when its exact path is the recorded
  approved artifact path. Do not combine these states in one caption.
- The first saved recommendation becomes the working recommendation. Later
  agent changes appear as **Proposed · Agent work** and require **Accept
  recommendation update**. A direct lawyer edit creates a separate version.
- An agent can recommend a decision. It records a durable decision only after
  the user explicitly instructs it to record that decision. It never converts a
  recommendation into a recorded decision on its own. An agent can draft a
  reply and can never send one. These are locked settings, not defaults.
- The full assistant block uses the dashed iris treatment and the label
  **Themis.ai**. A small icon alone is not enough.
- Source support and attorney review are separate states. Do not infer either
  state from a folder, file name, or missing metadata.
- Show source or action provenance only when the stored data supports it. Never
  invent provenance or describe every fact as extracted.

## Matter and dossier

- The matter is the full work container. Work, decisions, research, chat, files,
  events, ownership, dates, stage, and risk attach to it.
- `matter.md` remains the root record and the default agent context.
- A dossier is an optional, editable summary. It improves orientation when it
  exists, but it does not replace the matter.
- The left pane starts narrow and remains resizable. Direct lawyer-facing files
  appear first. Structured records sit in one collapsed **Matter Records** group.
- With no requested file, the interface shows no selected tree record even
  though `matter.md` remains the active agent context.

Matter Records uses these exact labels:

| Vault path | Label |
| --- | --- |
| `matter.md` | Matter details |
| `facts.md` | Facts, sources & assumptions |
| `issues.md` | Issue map |
| `participants.md` | People & roles |
| `recommendations.md` | Working recommendations |
| `work-items/` | Work to do |
| `decisions/` | Recorded decisions |
| `events/` | Activity history |
| `dossier-revisions/` | Dossier revisions |

## Buttons

One primary (`--ink` on `--paper` text) per region. Secondary is `--raised` with
a `#d6d1c7` border. Ochre `#FDEEC0`/`#F0D896` is the "review now" affordance.
Agent actions are dashed iris on transparent.

Segmented controls use a native radio group inside a `fieldset`, with one
screen-reader-only legend and a visible keyboard focus ring. Each option uses
the same radio `name`. The selected style does not replace the native checked
state.

Decision recording always ends with an explicit submit action. A Themis.ai draft
can prefill the modal, but the lawyer can edit both the decision and its visible
rationale before recording it. Opening or cancelling the modal changes no
record.

Approval, durable decision recording, manual delivery, and closure always end
with a direct lawyer control. Chat can prepare the action only. **Record manual
delivery** must say that the action happened outside Themis.ai. **Send directly
— coming later** stays disabled until real delivery is intentionally built.

Research queue rows use clear state words such as **queued**, **running**,
**completed**, **failed**, and **interrupted**. Reorder controls change saved
queue order only. They do not imply parallel execution.

## Tables and state words

- Table body text is at least `15px`, has readable contrast, wraps when needed,
  and changes to readable rows on narrow screens.
- Recorded decision state uses only **Recorded** and **Needs review**.
- Automation actions use stable labels: **Pause schedule**, **Resume schedule**,
  **Run it now**, and **Retry now**.
- Research with no citations says **No cited sources** once. It does not invent a
  review state.

## Advanced controls

- Settings shows the current model in plain language. Provider, exact model, and
  reasoning effort are under **Advanced model options**.
- Agents shows name, role, and purpose first. Standing Markdown instructions,
  tool permissions, and file paths are under **Advanced controls**.
- Built-in agents show **Effective tool access** as noninteractive
  **Available** or **Not available** rows with **Application-managed · Read-only**.
  Custom agents keep editable tool-permission checkboxes.
- Skills explains the object in plain language. The requested raw prompt remains
  available under a clear label or Advanced details.

## Document review

- The editable document is the review surface. Do not place redlines in a separate preview.
- Use **All Markup**, **No Markup**, and **Original** as local display modes. A display mode never changes saved review data.
- Open a document in **No Markup**. Keep saved redlines and review history unchanged. Switch to **All Markup** only when the lawyer selects it, starts redlining, or opens the tracked-change review.
- Insertions are underlined. Deletions use a strike-through. Both use the saved document author color and show the author name.
- Author colors come only from the Themis.ai review palette. Color is not an identity by itself.
- Each tracked change has individual **Accept**, **Reject**, **Accept and next**, and **Reject and next** actions. There are no bulk review actions.
- Comments open from selected text. Show the same thread in a contextual popover and the document comment rail.
- Resolved comments remain visible until the lawyer explicitly deletes them.

## Layout

Two shapes carry most screens.

- `page-header` names the destination: an eyebrow, a serif headline, and a
  `page-lede` that says in one or two sentences what the page is for and what it
  will not do. Counts sit under it as `stat-chip` filters wherever a count is
  also a way to narrow the list.
- `work-rail-layout` puts the thing being read or worked in the wide left
  column (`work-main`) and actions, context and provenance in the narrow sticky
  right column (`work-rail`). The rail never takes the width from the work.
  Each `rail-card` names one job and carries a sentence of help under the name.

## Screens

| Screen | Route | Canvas |
| --- | --- | --- |
| Today — ranked briefing | `/` | `3a` |
| Workspace — board, quarter, agent activity | `/workspace` | `3b` |
| Matters — counts as filters, stage spines | `/matters` | `5a` |
| Matter — question, recommendation, evidence, decision | `/matters/[id]` | `2b` |
| Research reading — citations and annotations | `/matters/[id]/research` | `6a` |
| Decision register | `/decisions` | `1f` |
| Agents — the agent builder | `/agents` | `4b` |
| Settings | `/settings` | `4a` |
| Automations — led by effect | `/automations` | `2d` |

## Continuous Legal Awareness

- Briefing is a reading surface. Today remains the required-attention queue.
- `/briefing` and `/watches/**` use the Briefing navigation state. Do not add a
  separate top-level Watches destination.
- Watch Builder keeps **Save draft**, **Scan now**, **Change something**, and
  **Start Watch** as distinct actions. Scan now never implies an active
  schedule.
- Show provider names, source coverage, and warnings in every scan preview.
  Use the word **Partial** when one selected provider fails and useful output
  remains.
- Show source type and Watch role as separate fields. Roles are **Primary**,
  **Secondary**, **Discovery only**, and **Excluded**.
- Use **Supplied**, **Retrieved**, **Verified**, and **Unverified lead** for
  source support. A Polaris source cannot appear as Verified only because
  Polaris cited it.
- A Briefing item can stay **Briefing only**. Only **Required** review packets
  enter Today.
- Review packet actions must name the durable outcome. Opening or cancelling a
  packet changes nothing. Mitigations and revised decisions require an explicit
  lawyer action.

## Stage vocabulary

The six stages keep their ids and gain plain-language names. The name is the
same in the board, the matter header and chat.

| id | Label | Sub |
| --- | --- | --- |
| `intake` | Just came in | Not yet triaged |
| `research` | Being researched | An agent is gathering the facts |
| `explore` | Waiting on your judgment | Research is done; a path must be chosen |
| `generate` | Being drafted | Work product is being written |
| `respond` | Respond | Review, approve, and deliver |
| `closed` | Closed | Decided and delivered |

## Lawyer continuity surfaces

- Today shows at most three ranked action cards. Preserve the briefing order. Link other matters without repeating the same high-attention cards.
- A matter starts with a compact question, useful saved answer, material qualification, and one specific next action with its owner. Keep complete saved wording available. If an explicit Current answer section is shown first, keep all earlier text visible under a neutral label.
- Fact requests, local handoffs, and source comparison use contextual controls. Do not keep all of these panels expanded by default. Use the same matter conversation and document editor.
- Label the optional roster selector View as. Keep the explanation in a disclosure. It simulates a local lawyer identity; it does not represent authentication or permissions.
- A copied request is not a sent request. A supplied reply is not verified evidence. A local handoff acceptance is not a legal approval. A proposed edit is not a recorded decision.
- Show saved comparison history before the new-comparison form. Separate literal source passages from generated significance. Keep useful prose visible when precise affected-work links are unavailable. An explicitly selected draft must remain actionable in that case.
- Show state words beside all attention colors. Wrap long action labels at narrow widths. Source paths, comparison tables, and code must stay inside their containers.
- Preserve local input across matter and person changes. Explain timeouts without claiming that a durable save failed. Reuse the same action for safe retry. Never hide saved work because a later refresh failed.

## Matter review and decision map

- Understand leads with the business question, short working answer, qualification, and one owned action. Show at most three review items, with a reason and a link to all issues.
- Keep issue explanations, claim support, shared questions, options, work, and the lawyer's disposition together. Collapse title/parent editing and supporting history.
- The decision map has its own route and a keyboard-accessible outline. Show the same record identities and labeled conditions in both views. Unknown conditions stay Unknown. Hypothetical and historical analysis remain distinct from active facts and recorded decisions.
- Show document names, counts, versions, and the active editable document before the editor. Source previews sit beside the draft on wide screens and stack on narrow screens. Reading a source does not select agent context or replace the draft action target.
- Evidence shows the actual claim revision, source status, available passage, and applicability explanation or support gap. A source-only link must not imply exact claim support. Keep useful answers visible when optional evidence is missing.


User overrides: Do not run broad checks per chunk; coordinator alone runs final checks. No graph updates by workers. Do not use actual protected matter MAT-20260904-abf788. Read source only. Mockup sample data must never enter defaults.

## Frozen contracts
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


## Your design requirements
### 5.3 Discuss — C3

Make the current target readable above the conversation. Keep issue/document/passage/local-draft context distinct. Long paths and selected text wrap or expand. Clear scope and Clear target stay separate with accurate labels.

The conversation occupies the wide reading column. Keep one existing thread scroll area on desktop and a visible composer. Avoid page-scroll inside an already scrollable narrow dock plus another thread scroll. At <=760 px use normal page flow except the existing textarea/thread mechanics required for usability. The composer cannot cover the last message or focused control.

Keep saved actions, old intake answers, updated-record links, attachments and complete history. Give latest-answer navigation an explicit label. Do not delete old turns or change their chronological order. A running, complete, interrupted or failed run uses actual state. A completed run does not by itself disable future messages.

Show shortcut execution labels. Retain busy/disabled behavior and one-submit protection. Keep answer saving and pending/recovered output visible when a refresh fails. Optional research/parsing failure never replaces a useful answer with an empty card.


## Example states
- C3: complete chat with enabled composer; running chat; failed refresh retaining answer; long historical intake; attachments; separate scope/target resets; shortcut starts exactly one inquiry on fixture only.

## Current caller excerpts
### frontend/components/MatterWorkspace.tsx:5270
```tsx
            </details>
          </>
        }
        conversation={
          <ConversationDock
            matterId={detail.matter_id}
            target={effectiveTarget}
            onTargetChange={(target) =>
              setConversationTarget(
                target ?? {
                  matter_id: detail.matter_id,
                  business_question_revision: workspace?.question.revision,
                },
              )
            }
            receipts={workspace?.receipts ?? []}
            onOpenArtifact={openDocument}
          >
            {researchIssueTitle ? (
              <div>
                <p className="matter-action-notice" role="status">
                  Research for {researchIssueTitle} is {researchQueueActive ? "running" : savedResearch.savedPacketCount ? "saved" : "starting"}.
                </p>
                <ResearchQueuePanel items={researchQueue} mode="summary" />
              </div>
            ) : null}
            <ChatPanel
              contextKey={contextKey}
              matterId={detail.matter_id}
              matterTitle={detail.title}
              activeFile={activePath}
              activeAgentId={detail.active_agent_id}
              currentWorkProductDraftPath={draftPath}
              decisionOptions={detail.orientation.options}
              initialConversationId={initialConversationId ?? detail.intake_conversation_id}
              initialRunId={detail.intake_run_id}
              intakeActive={detail.intake_state === "active"}
              intakeAnswers={detail.intake_answers}
              target={effectiveTarget ?? undefined}
              expectedQuestionRevision={workspace?.question.revision}
              contextSelections={selections}
              onFilesAttached={(refs) => setComposerFileSelection(refs, true)}
              onFilesRemoved={(refs) => setComposerFileSelection(refs, false)}
              selectedTemplateId={selectedTemplateId}
              externalRun={externalRun}
              onBeforeSubmit={() => {
                chatSubmission.current = {
                  matter: detail.matter_id,
                  runId: null,
```
### frontend/components/MatterWorkspace.tsx:5292
```tsx
                </p>
                <ResearchQueuePanel items={researchQueue} mode="summary" />
              </div>
            ) : null}
            <ChatPanel
              contextKey={contextKey}
              matterId={detail.matter_id}
              matterTitle={detail.title}
              activeFile={activePath}
              activeAgentId={detail.active_agent_id}
              currentWorkProductDraftPath={draftPath}
              decisionOptions={detail.orientation.options}
              initialConversationId={initialConversationId ?? detail.intake_conversation_id}
              initialRunId={detail.intake_run_id}
              intakeActive={detail.intake_state === "active"}
              intakeAnswers={detail.intake_answers}
              target={effectiveTarget ?? undefined}
              expectedQuestionRevision={workspace?.question.revision}
              contextSelections={selections}
              onFilesAttached={(refs) => setComposerFileSelection(refs, true)}
              onFilesRemoved={(refs) => setComposerFileSelection(refs, false)}
              selectedTemplateId={selectedTemplateId}
              externalRun={externalRun}
              onBeforeSubmit={() => {
                chatSubmission.current = {
                  matter: detail.matter_id,
                  runId: null,
                  scene: { ...latestScene.current },
                };
              }}
              onRunStarted={(run) => {
                if (chatSubmission.current)
                  chatSubmission.current.runId = run.run_id;
              }}
              onRunComplete={(run) => {
                void showRunContext(run);
              }}
              onClearTarget={() =>
                setConversationTarget({
                  matter_id: detail.matter_id,
                  business_question_revision: workspace?.question.revision,
                })
              }
              onRefresh={refreshAfterChatRun}
              onOpenDocument={openDocument}
              onOpenReference={(target) => void openReference(target)}
              onOpenEvidence={(evidence) => void openEvidence(evidence)}
              workspaceClaims={workspace?.claims ?? []}
              workspaceDocuments={workspace?.documents ?? []}
```
### frontend/app/matters/[matterId]/decision-map/page.tsx:604
```tsx
          }
        />
        <section className="decision-map-discussion" id="decision-map-discussion">
          <h2>Discuss the selected path</h2>
          <ChatPanel
            contextKey={contextKey}
            matterId={matterId}
            matterTitle={detail.title}
            activeFile={null}
            activeAgentId={detail.active_agent_id}
            initialConversationId={initialConversationId}
            onConversationChange={(conversationId) => {
              if (conversationId) setInitialConversationId(conversationId);
            }}
            target={
              conversationTarget ?? {
                matter_id: matterId,
                issue_id: selectedIssue?.issue_id,
                business_question_revision: workspace.question.revision,
              }
            }
            expectedQuestionRevision={workspace.question.revision}
            workspaceClaims={workspace.claims ?? []}
            workspaceDocuments={workspace.documents ?? []}
            onOpenReference={(target) => void openReference(target)}
            onOpenEvidence={(evidence) =>
              evidence.path &&
              void openReference({
                document_id: evidence.source_id,
                path: evidence.path,
                revision: evidence.source_version,
                locator: evidence.locator,
                available_excerpt: evidence.available_excerpt,
                exact_passage_available: Boolean(
                  evidence.available_excerpt || evidence.locator,
                ),
                origin: { surface: "conversation", record_id: selectedNodeId },
              })
            }
            onRefresh={load}
            onOpenDocument={(path) => {
              const document = workspace.documents?.find(
                (item) => item.path === path,
              );
              if (document)
                void openReference({
                  document_id: document.document_id,
                  path,
                  revision: document.revision,
```

## Current component context
### frontend/components/ChatPanel.tsx
```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards, { WorkspaceReceiptCards } from "@/components/ChatCards";
import SkillCommandMenu from "@/components/SkillCommandMenu";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { cancelChatRun, getChatRun, getChatRuns, getConversation, getConversations, getSkills, recoverIntakeQuestion, retryChatRun, saveWorkProductDraft, startChatRun, uploadDocuments } from "@/lib/api";
import { chatAgentId, chatDraftStorageKey, chatFailureGuidance, chatProgressLabel, chatRunStateLabel, chatRunStorageKey, chatSuggestions, conversationChatDraftStorageKey, durableChatProgress, historicalQuestionStates, intakeRecoveryKey, legacyChatDraftStorageKey, legacyChatRunStorageKey, mergeChatMessages, needsIntakeQuestionRecovery, pendingChatRunId, promoteConversationComposer, rememberChatRun, remainingComposerValue, safeChatFailureDetail, shouldCompactIntakeTurn, shouldShowChatRunStatus, storeConversationComposer } from "@/lib/chatRunLogic";
import { legacyQuestionModeStorageKey, questionModeStorageKey } from "@/lib/chatCardLogic";
import { skillBuilderGoal } from "@/lib/skills";
import type { AppliedSkillSummary, AttachmentReference, CardAction, ChatCard, ChatRun, IntakeAnswer, OperationResult, QuestionMode, SkillDefinition, ToolTrace } from "@/lib/types";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import type { DocumentIdentity, DocumentReferenceTarget, WorkspaceClaim } from "@/lib/workspaceTypes";

type ChatOperationResult = OperationResult & { proposal?: Record<string, unknown> };
type Message = { message_id?: string; run_id?: string; workspace_action?: string | null; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[]; applied_skills?: AppliedSkillSummary[]; card_action?: CardAction | null; operation_results?: ChatOperationResult[] };

function terminalRunToken(run: ChatRun): string | null {
  return ["completed", "failed", "interrupted"].includes(run.state) && run.finished_at && Number.isFinite(Date.parse(run.finished_at))
    ? JSON.stringify([run.run_id, run.state, run.finished_at]) : null;
}

function reconciliationHint(contextKey: string | undefined, matterId: string, conversationId?: string | null, value?: string | null): string | null {
  if (!contextKey) return null;
  const key = JSON.stringify(["themis.ai:chat-run-reconciled:v1", contextKey, matterId, conversationId ?? "new"]);
  try {
    if (value === null) window.localStorage.removeItem(key);
    else if (value !== undefined) window.localStorage.setItem(key, value);
    return window.localStorage.getItem(key);
  } catch { return null; } // Optional refresh hint; storage failure must not hide saved work.
}

function shouldRefreshReconnectedRun(run: ChatRun, messages: Message[], conversationId: string | null, pendingRunId: string | null, hint: string | null = null): boolean {
  const token = terminalRunToken(run);
```
### frontend/components/workspace/ConversationDock.tsx
```tsx
"use client";

import type { ConversationDockProps, ConversationTarget, InteractionReceipt } from "@/lib/workspaceTypes";

function fileName(path: string): string {
  return path.split("/").filter(Boolean).at(-1) || "saved file";
}

function targetParts(target: ConversationTarget | null): Array<{ label: string; value?: string }> {
  if (!target) return [{ label: "Matter context" }];
  const parts: Array<{ label: string; value?: string }> = [{ label: "Matter context" }];
  if (target.business_question_id) parts.push({ label: "Business question" });
  if (target.issue_id) parts.push({ label: "Selected issue" });
  if (target.source_id) parts.push({ label: "Selected source" });
  if (target.scenario_id) parts.push({ label: "Saved scenario" });
  if (target.artifact_path) parts.push({ label: "Document", value: fileName(target.artifact_path) });
  if (target.selected_range?.text) parts.push({ label: "Selected passage", value: target.selected_range.text });
  if (target.local_draft_snapshot) parts.push({ label: "Local draft snapshot", value: "Not saved" });
  return parts;
}

function receiptLabel(receipt: InteractionReceipt): string {
  return receipt.operation.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function receiptState(receipt: InteractionReceipt): { label: string; className: string } {
  if (receipt.state === "applied") return { label: "Applied", className: "state-healthy" };
  if (receipt.state === "proposed") return { label: "Proposed", className: "state-agent" };
  return { label: "Not saved", className: "state-failure" };
}

function ReceiptRow({ receipt, onOpenArtifact }: { receipt: InteractionReceipt; onOpenArtifact: (path: string) => void }) {
  const state = receiptState(receipt);
  return <li className="conversation-receipt">
    <span className={`state-label ${state.className}`}>{state.label}</span>
    <span>{receiptLabel(receipt)}</span>
    {receipt.failure_detail ? <span className="conversation-receipt__detail">{receipt.failure_detail}</span> : null}
    {receipt.changed_links?.map((path) => <button className="btn tiny quiet" key={path} onClick={() => onOpenArtifact(path)} type="button">Open {fileName(path)}</button>)}
```

## Steps
1. Read each owned component completely, its direct callers above, imported prop definitions, current semantic tokens, and relevant survey inventory. View the named images using view_image. Do not explore unrelated files.
2. Convert presentation to the owned CSS Module. Use 16px/1.65 serif reading text, 15px/1.5 sans controls/rows, minimum 12px metadata, 36px desktop controls and 44px below 760px, max 10px radius, thin separators and existing semantic variables. Responsive normal flow; no mockup aspect ratio. Preserve callbacks, state, identity, hidden mounting, async targets, complete useful prose and every control.
3. Check normal, empty, busy, error, long text and all listed example states by static code review. Do not run broad tests or builds. You may run git diff --check restricted to owned paths. Report an unresolved coupling before changing any prop except the exact C1 sectionNavigation seam.
4. Return exact files changed, behavior/control mapping, checks actually run, uncertainty and remaining risks. Your report is not acceptance or browser proof.

Coordinator will run npm run typecheck and all named aggregate checks at a stable boundary. Read-only source checks may have old JSX regex assumptions; report those, never weaken them. Do not edit tests.
