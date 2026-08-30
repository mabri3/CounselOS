# Implementation prompt — corrected Counsel OS matter page

You are the only implementation agent for this task. Work directly in the
current `counsel-os-mvp` repository. Do not delegate or create subagents.

## Goal

Redesign `/matters/[matterId]` so it shows one authoritative current task from
the saved work state, one control that matches that task, and every other open
record below it. Do not replace saved or model-produced text with new frontend
questions. Do not invent recommendation author, review, or closing-time
provenance.

This is a frontend-only task. Do not change the backend, model prompts, API
contract, or vault data.

## Resume protocol

Before editing, read `docs/matter-page.handoff-progress.md`.

- Do not redo a step marked `done`. Start at the first pending step.
- If a done step's verification now fails, stop and report it. Do not reapply
  the edit.
- After each step, run that step's verification. Then immediately change only
  that step's progress line to `- [x] ... — done`.
- On failure, change the line to `- [ ] ... — FAILED: <short reason>` and use
  the blocker policy below. Do not batch progress updates.
- Every edit describes a final state and is safe to resume. Do not append a
  second copy of a helper, selector, or JSX section.

The worktree already contains unrelated user changes. Preserve them. Do not
revert, reformat, or commit them. The user did not request commits.

## Read first

Read these files before Step 1:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/DESIGN_LANGUAGE.md`
5. `frontend/components/MatterWorkspace.tsx`
6. `frontend/lib/matterActions.ts`
7. `frontend/lib/types.ts`
8. `frontend/app/globals.css`

Use quoted code and symbol names to find edit sites. Line numbers can move.
If a named file, symbol, type, or current behavior differs materially, stop
and report it instead of adapting around the plan.

## Product and design constraints

- Reduce the lawyer's cognitive load. Show what needs the lawyer, why, and one
  useful action.
- Keep recommendations separate from recorded decisions.
- Show provenance only when stored data supports it.
- Attention uses existing attention tokens and a visible state word. Failure
  color remains reserved for failed or overdue states.
- Use existing CSS variables. Do not add hex values or page-local colors.
- Agent output uses dashed iris only when the record is known to be agent
  output. `recommendations.md` does not currently prove that fact.
- Keep the current three panes, resizing, and collapse behavior.

## Verified source map

Do not treat all visible words as static copy.

| Content | Source and required treatment |
| --- | --- |
| Stage, risk, and due words | Static helpers in `frontend/lib/design.ts` plus API values. Reuse them. |
| `matterAction()` category, label, and detail | Static frontend fallback vocabulary. Reuse it, but do not use its generic detail as the current task when saved work state exists. |
| `detail.work_state.next_action` | Backend picks the highest-priority required open work-item title, then saved `matter.md` `next_action`, then a backend stage default. Render it unchanged as the current task. |
| `detail.work_state.next_work_item_id` | Exact ID of the selected required work item. Use this ID to remove that one record from the secondary list. |
| Work-item fields | Saved Markdown. A user, workflow, seed, or agent tool can create them. Preserve open records by ID. |
| `orientation.decision_question` | Dossier text that research can generate and a lawyer can edit; otherwise saved matter fallback. Do not replace it with a static stage question. Do not make it the focal task in this build. Its source remains accessible through Dossier when present or Matter details for the fallback. |
| `orientation.open_questions` | Dossier questions or required-work fallback. Include only distinct questions below saved work items. |
| Recommendation text | Editable `recommendations.md`. Current metadata does not reliably say who wrote it or whether it was reviewed. Use neutral provenance language. |
| Chat chips | Static `ChatPanel.tsx` prompts that become model input when clicked. They are out of scope. |

## Current code facts

`MatterWorkspace.tsx` already has:

```ts
const primaryAction = matterAction(detail, Boolean(draftPath));
const signal = signalFor(detail);
const due = dueWord(detail);
```

It currently derives `matterQuestion`, `unresolved`, `requiredOpenWork`, and
`openWorkItems`. Those four values will be replaced.

`runPrimaryAction()` currently handles these action IDs:
`review_intake`, `run_research`, `review_and_decide`, `start_work_product`,
`draft_work_product`, `review_draft`, `approve_response`, `mark_as_sent`,
`review_remaining_work`, and `close_matter`. Preserve those behaviors and API
calls. Add one read-only workspace control named `open_work_item`.

`MatterWorkState` already includes `next_work_item_id: string | null`.
`WorkItem` already includes `work_item_id`, `path`, `title`, `status`,
`required`, and `item_type`.

The current recommendation state stores the content of
`recommendations.md`. Keep that fetch. Change only its visible treatment.

## Files allowed to change

- `frontend/lib/matterBrief.ts` — new
- `frontend/scripts/check-matter-brief.ts` — new
- `frontend/tsconfig.json`
- `frontend/components/MatterWorkspace.tsx`
- `frontend/app/globals.css`
- `docs/matter-page.handoff-progress.md` — progress updates only
- `graphify-out/` — generated changes from the required final
  `graphify update .` command only; do not hand-edit it

Do not change `ChatPanel.tsx`, `frontend/lib/matterActions.ts`, backend files,
vault files, or any other handoff file.

## Step 1 — Add record-safe helpers and a direct check

Create `frontend/lib/matterBrief.ts` with these exported types and functions:

```ts
import type { MatterActionId } from "./matterActions";

export type BriefWorkItem = {
  work_item_id: string;
  path: string;
  title: string;
  status: string;
  required: number;
  item_type: string;
};

export type OpenItem = {
  key: string;
  text: string;
  required: boolean;
  source: "work_item" | "open_question";
};

export type MatterControlId = MatterActionId | "open_work_item";

export function currentWorkItemFor(
  workItems: BriefWorkItem[],
  nextWorkItemId: string | null,
): BriefWorkItem | undefined;

export function controlIdForCurrentWork(
  stageActionId: MatterActionId,
  currentWorkItem: BriefWorkItem | undefined,
): MatterControlId;

export function openItemsFor(
  workItems: BriefWorkItem[],
  openQuestions: string[],
  nextWorkItemId: string | null,
  nextAction: string,
): OpenItem[];
```

Implement exactly these rules:

1. Find the current item only by exact `work_item_id`.
2. With no current item, use the stage action ID.
3. Current `research` item -> `run_research`.
4. Current `approval` item plus stage action `approve_response` ->
   `approve_response`.
5. Every other current item, including an unknown type -> `open_work_item`.
6. Open work items are all items whose status is not `done` or `closed`, less
   only the exact `nextWorkItemId`.
7. Never deduplicate work-item records by title. Key each as
   `work:${work_item_id}`.
8. For question duplicate checks only, normalize by trim, lowercase, collapsed
   whitespace, and terminal punctuation removal. No stop words, stemming,
   token overlap, or fuzzy matching.
9. Add nonblank open questions after work items. Skip a question only when its
   normalized text exactly equals the current action, an open work-item title,
   or an earlier question. Questions use `required: false`,
   `source: "open_question"`, and key `question:${normalizedText}`.
10. An unknown `nextWorkItemId` removes nothing.

Build the set of open work-item title keys before excluding the current item.
This prevents the fallback `open_questions` array from adding the current work
item back into the secondary list.

Create `frontend/scripts/check-matter-brief.ts` with direct assertions and a
nonzero exit on failure. It must test:

- ORBIT: current research item -> `run_research`; no secondary item.
- APEX: current question item -> `open_work_item`; privacy review remains
  required.
- HARBOR: current approval item -> `approve_response`; policy item remains
  required.
- CEDAR: no current required item -> `none`; the similar optional 90-day
  review remains visible.
- two saved work items with the same title both remain;
- exact duplicate question removed;
- similar non-identical question retained;
- blank question ignored;
- unknown item type -> `open_work_item`;
- unknown next-work-item ID removes nothing.

The script must end with `All checks passed.` on success. Do not add a test
runner or dependency.

Edit `frontend/tsconfig.json`:

```json
"exclude": [
  "node_modules",
  "scripts"
]
```

Verify:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

Mark Step 1 done only when the script prints `All checks passed.` and both
commands exit 0.

## Step 2 — Select the saved task and its matching control

In `MatterWorkspace.tsx`, import the three helpers and `MatterControlId` from
`@/lib/matterBrief`. Add `type MatterActionView` to the existing import from
`@/lib/matterActions`, then define:

```ts
type MatterControl = Omit<MatterActionView, "id" | "category"> & {
  id: MatterControlId;
  category: MatterActionView["category"] | "Work item";
};
```

After `primaryAction`, derive:

```ts
const currentWorkItem = currentWorkItemFor(
  detail.work_items,
  detail.work_state.next_work_item_id,
);
const currentControlId = controlIdForCurrentWork(primaryAction.id, currentWorkItem);
```

Build one local `currentControl`:

- Reuse `primaryAction` when `currentControlId === primaryAction.id`.
- For `run_research`, use
  `{ id: "run_research", category: "Work action", label: "Run research", detail: "Run the current research work item." }`.
- For `open_work_item`, use
  `{ id: "open_work_item", category: "Work item", label: "Open work item", detail: "Open the saved work item and review its details." }`.

Declare the local object as `const currentControl: MatterControl = ...`. Do not
add `open_work_item` to the shared `MatterActionId`.

Replace the old open/question derivation with:

```ts
const openItems = openItemsFor(
  detail.work_items,
  detail.orientation.open_questions,
  detail.work_state.next_work_item_id,
  detail.work_state.next_action,
);
const requiredCount = openItems.filter((item) => item.required).length;
const currentTask = primaryAction.id === "none"
  ? primaryAction.detail
  : detail.work_state.next_action.trim() || currentWorkItem?.title || primaryAction.detail;
```

Base the button class on `currentControl`, not `primaryAction`.

Rename `runPrimaryAction` to `runCurrentControl`. Switch on
`currentControl.id`. Preserve every existing branch and API call. Add this
first branch:

```ts
if (currentControl.id === "open_work_item" && currentWorkItem) {
  openDocument(currentWorkItem.path);
  return;
}
```

Replace the `review_remaining_work` branch with a plain scroll to
`#remaining-work`; do not cast the target to `HTMLDetailsElement`.

Delete `questionForMatter` after confirming it has no caller.

Verify:

```bash
cd frontend
npm run typecheck
rg -n "questionForMatter|saysTheSame|STOP_WORDS" components lib
```

Typecheck must pass. The `rg` command must return no match and exit 1.

## Step 3 — Replace the duplicate header and competing sections

Add `riskLabel` to the design import.

Header changes:

- `.matter-crumb` contains only the `Matters` back link.
- Delete the separate right-side `Next action` block.
- Add a `.matter-facts` definition list containing `Stage`, `Risk`, and `Due`.
  Values use `stageLabel(detail.status)`, `riskLabel(detail.risk_level)`, and
  the existing `due` object.

Replace the three old overview sections (`Current question`, `Working
recommendation`, and `matter-primary-action`) with one card:

```tsx
<section className={`matter-call ${primaryAction.id === "none" ? "is-complete" : ""}`}>
  <span className="matter-call-kicker">
    {primaryAction.id === "none" ? "Matter status" : "Next action"}
  </span>
  <p className="matter-call-task"><LinkifiedText text={currentTask} /></p>

  {primaryAction.id !== "none" ? (
    <div className="matter-recommendation">
      <div className="matter-recommendation-label">
        Working recommendation · Source and review status not recorded
      </div>
      {recommendation === null ? (
        <p>Reading the saved recommendation…</p>
      ) : recommendationText ? (
        <>
          <p><LinkifiedText text={recommendationText} /></p>
          <div className="matter-record-note">
            This is a working recommendation. It is not an approval or recorded decision.
          </div>
        </>
      ) : (
        <p>No working recommendation is saved.</p>
      )}
    </div>
  ) : null}

  {primaryAction.id !== "none" ? (
    <div className="matter-call-do">
      <span>{currentControl.category}</span>
      <button
        aria-busy={busy}
        className={`${primaryActionClass} matter-call-button`}
        disabled={busy}
        onClick={() => void runCurrentControl()}
        title={currentControl.detail}
        type="button"
      >
        {busy ? "Working…" : currentControl.label}
      </button>
    </div>
  ) : null}
</section>
```

Do not render `orientation.decision_question` in the card. Do not add a static
stage-question map. Do not show `primaryAction.detail` as a second task.

Add these rules in `globals.css`:

```css
.matter-facts { display: flex; gap: 26px; margin: 0; flex: none; }
.matter-facts > div { display: grid; gap: 3px; }
.matter-facts dt {
  font: 500 11px var(--sans);
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--ink-5);
}
.matter-facts dd {
  margin: 0;
  font: 500 13px var(--sans);
  color: var(--ink-2);
  white-space: nowrap;
}
.matter-call {
  margin: 0 0 22px;
  border: 1px solid var(--attention-edge);
  border-left: 4px solid var(--attention);
  border-radius: 10px;
  background: var(--attention-wash);
  padding: 18px 22px 20px;
}
.matter-call.is-complete {
  border-color: var(--line-soft);
  border-left-color: var(--ink-6);
  background: var(--rail);
}
.matter-call-kicker {
  display: block;
  margin-bottom: 10px;
  font: 600 12px var(--sans);
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--attention-deepest);
}
.matter-call.is-complete .matter-call-kicker { color: var(--ink-4); }
.matter-call-task {
  margin: 0;
  font: 600 21px/1.4 var(--serif);
  color: var(--ink);
  text-wrap: pretty;
}
.matter-recommendation {
  margin-top: 17px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--raised);
  padding: 13px 15px;
}
.matter-recommendation-label {
  font: 600 11.5px/1.4 var(--sans);
  color: var(--ink-4);
}
.matter-recommendation p {
  margin: 8px 0 0;
  font: 400 15px/1.6 var(--serif);
  color: var(--ink-2);
}
.matter-call-do {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--attention-edge);
}
.matter-call-do > span {
  font: 600 12px var(--sans);
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--attention-deepest);
}
.matter-call-button { flex: none; }
```

Do not add sticky positioning.

Update the mobile query so facts wrap and `.matter-call-do` stacks with the
button aligned to the start:

```css
.matter-facts { flex-wrap: wrap; gap: 10px 22px; }
.matter-call-do { align-items: stretch; flex-direction: column; gap: 12px; }
.matter-call-button { align-self: flex-start; }
```

Verify:

```bash
cd frontend
npm run typecheck
npm run build
rg -n 'Current question|Which path should we take\?|matter-primary-action|matter-context-question' components/MatterWorkspace.tsx
```

Both build commands must pass. The `rg` command must return no match.

## Step 4 — Make recommendation provenance honest

Step 3 already placed the active `.matter-recommendation` block. Do not add a
second copy. Style it with a solid neutral border and raised background. Do not
use `.agent-note`, iris, or a dashed border for this saved record.

Closed matters do not show the block in the task card. As the first section in
the reference body, add:

```tsx
{primaryAction.id === "none" && recommendationText ? (
  <section>
    <h2>Saved recommendation</h2>
    <div className="matter-recommendation">
      <div className="matter-recommendation-label">
        Source and review status not recorded
      </div>
      <p><LinkifiedText text={recommendationText} /></p>
      <div className="matter-record-note">
        This saved recommendation is not a recorded decision.
      </div>
    </div>
  </section>
) : null}
```

In `collectEvidence()`, change the `recommendations.md` mapping to:

```ts
{
  name: "Working recommendation",
  kind: "Matter record",
  note: "Saved recommendation; source and review status are not recorded",
}
```

Do not add the words `Themis`, `Never reviewed`, `at the time of closing`, or
`Final recommendation` to new interface copy.

Verify:

```bash
cd frontend
npm run typecheck
rg -n 'Never reviewed|at the time of closing|Themis analysis' components/MatterWorkspace.tsx
```

Typecheck must pass. The `rg` command must return no match. Other chat
components can still correctly label full assistant messages as Themis.

## Step 5 — Show all other open records

Replace `What remains unresolved` with:

```tsx
<section className="matter-open" id="remaining-work">
  <div className="matter-open-head">
    <h2>{openItems.length ? "Also open on this matter" : "Nothing else is open"}</h2>
    {openItems.length ? (
      <span>{requiredCount} required · {openItems.length - requiredCount} optional</span>
    ) : null}
  </div>
  {openItems.length ? (
    <ul className="matter-open-list">
      {openItems.map((item) => (
        <li className={item.required ? "is-required" : ""} key={item.key}>
          <span aria-hidden="true" className="matter-open-mark" />
          <span className="matter-open-text"><LinkifiedText text={item.text} /></span>
          {item.required ? <span className="matter-open-tag">Required</span> : null}
        </li>
      ))}
    </ul>
  ) : (
    <p className="matter-open-empty">No other open records are saved.</p>
  )}
</section>
```

Add this CSS:

```css
.matter-open { margin: 0 0 20px; }
.matter-open-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}
.matter-open-head h2 { margin: 0; font: 600 15px var(--sans); color: var(--ink-3); }
.matter-open-head > span { flex: none; font: 500 12.5px var(--sans); color: var(--ink-4); }
.matter-open-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }
.matter-open-list li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  font: 400 14.5px/1.5 var(--sans);
  color: var(--ink-2);
}
.matter-open-list li.is-required { background: var(--attention-wash); }
.matter-open-text { flex: 1; min-width: 0; }
.matter-open-mark {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-6);
  transform: translateY(-1px);
}
.matter-open-list li.is-required .matter-open-mark { background: var(--attention); }
.matter-open-tag {
  flex: none;
  font: 600 11px var(--sans);
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--attention-deep);
}
.matter-open-empty { margin: 0; font: 400 14.5px/1.5 var(--sans); color: var(--ink-4); }
```

A required row uses the attention wash, an attention dot, and the visible word
`Required`. An optional row uses neutral tokens. Do not hide or downgrade
optional records.

Verify:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

Both commands must pass and the direct check must print `All checks passed.`

## Step 6 — Align brief and chat columns

This layout problem exists on the current APEX page. Fix CSS only. Do not edit
`ChatPanel.tsx`.

Set these final rules in `globals.css`:

```css
.brief-pane {
  --matter-gutter: max(34px, calc((100% - 920px) / 2));
  border-right: 1px solid var(--line-soft);
  background: var(--raised);
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.brief-scroll {
  flex: 0 1 auto;
  min-height: 0;
  max-height: 62%;
  overflow-y: auto;
  padding: 0;
  border-bottom: 1px solid var(--line-faint);
  background: var(--raised);
}
.matter-brief { padding: 20px var(--matter-gutter) 26px; }
.chat-panel { flex: 1; min-height: 260px; display: flex; flex-direction: column; }
.thread {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px var(--matter-gutter) 18px;
  border-top: 1px solid var(--line-faint);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.composer {
  flex: none;
  border-top: 1px solid var(--line-faint);
  background: var(--raised);
  padding: 12px var(--matter-gutter) 16px;
}
```

Remove the old `.matter-brief` max width and auto margin. Keep mobile padding
at 18px.

Verify:

```bash
cd frontend
npm run build
rg -n 'max-height: 70%' app/globals.css
```

Build must pass. The `rg` command must return no match.

## Step 7 — Delete only proven CSS orphans and run acceptance

Search before deleting:

```bash
cd frontend
rg -n 'className=.*(matter-context|the-question|decision-call|matter-summary|open-questions|orientation-question-label|brief-section-label)' app components
```

Delete an old selector only if no JSX reference remains. Expected candidates
include the old `.matter-context*`, `.the-question`, `.decision-call*`,
`.matter-summary`, `.open-questions*`, `.orientation-question-label`,
`.brief-section-label`, `.matter-priority-section`,
`.matter-context-question`, `.matter-primary-action`, `.matter-action-copy`,
`.matter-action-button`, and `.matter-section-heading` rules.

Do not delete `.agent-note`, `.agent-label`, `.matter-record-note`, evidence
rules, or chat rules.

Verify code:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
npm run build
```

Then start or reuse the local servers. Use `http://localhost:3000`, not
`127.0.0.1`, because the frontend API default is localhost.

Do not click `Run research` or `Approve response` on the user's live vault.
Those actions mutate data. The direct check proves their control selection.

Browser acceptance:

- ORBIT: header has Stage/Risk/Due and no separate task. Card says
  `Run adverse-action research` once. Button says `Run research`. No other item
  remains. Recommendation provenance is neutral.
- APEX: card says `Confirm whether audio is used for model training` once.
  Button says `Open work item`. Clicking it opens
  `WI-MAT-DEMO-APEX-1.md` without a vault mutation. Privacy research remains
  required. The overview does not invent `Which path should we take?`.
- HARBOR: `Overdue` remains visible. Card says `Approve customer response`
  once. Button says `Approve response`. The policy item remains required.
- CEDAR: complete card says `The work was delivered or otherwise resolved.`
  and has no button. `Review first 90 days of reconciliation exceptions`
  remains as one optional open record. Reference details show `Saved
  recommendation` without Themis, review, or closing-time claims.
- At 1280 by 720, brief and chat share one gutter and chat is at least 260px
  high. The task card is not sticky. At the mobile breakpoint, facts and the
  control row wrap without horizontal overflow.

Mark Step 7 done only after the code checks and browser walk pass, or record the
exact unverified visual line.

## Final repository checks

From the repository root:

```bash
cd frontend && npm run typecheck && npm run build
cd ../backend && .venv/bin/pytest -q
cd .. && graphify update .
```

Frontend baseline was clean before this handoff.

Backend baseline on 2026-08-30 was `3 failed, 317 passed, 1 error`. The three
failures were in `tests/test_annotations.py` because the user's live vault has
saved annotation data. The error occurred while the fixture copied a transient
SQLite file for `tests/test_company_interview.py`. Do not change backend code,
tests, or vault data to make these unrelated failures green. Report whether
the baseline is unchanged and whether any new failure appears.

`graphify update .` is required after application edits. Do not edit graph
files by hand.

## Do not

- Do not change backend code, model prompts, API shapes, or vault records.
- Do not rewrite saved dynamic strings.
- Do not add stage-question copy.
- Do not use fuzzy matching, stop words, or word-overlap scores.
- Do not remove a saved work item because its title resembles another string.
- Do not invent author, model, review, approval, or closing-time provenance.
- Do not change `matterAction()` or `MatterActionId`.
- Do not change `ChatPanel.tsx` or its suggestions.
- Do not make the task card sticky.
- Do not add a dependency, test runner, CSS framework, or component library.
- Do not change the pane grid, resizers, collapse behavior, or pane defaults.
- Do not reformat unrelated code.
- Do not commit.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and
using the smallest implementation consistent with this prompt. Do not stop for
warnings or the recorded unrelated backend baseline.

Stop and report if:

- a named file, symbol, or API shape differs materially;
- a direct helper check, frontend typecheck, or frontend build fails after
  focused diagnosis;
- the task would require backend, prompt, vault, or unrelated-file edits;
- the edit would overwrite unrelated user work;
- an irreversible action or user decision is required.

## Final report

Work through Steps 1–7 in order. After every verified step, update the progress
file immediately. At the end, report:

1. each completed step;
2. the direct-check, typecheck, build, backend baseline, and graph-update
   results;
3. the result for each of the four browser matters;
4. any skipped or unverified line;
5. every file changed.

If a named file, symbol, or signature differs materially from this prompt,
stop and report it. Do not silently adapt around it.
