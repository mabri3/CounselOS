# Matter page redesign — corrected handoff plan

Target: `/matters/[matterId]`, rendered by
`frontend/components/MatterWorkspace.tsx`.

Target executor: one medium-capability coding agent. Do not delegate.

## Thesis

The matter page must show one authoritative current task. The task must come
from `detail.work_state`, not from new frontend wording. The control beside it
must act on that task when the current frontend has a safe action for it. All
other open records must remain visible. The page must not claim that saved
recommendation text came from Themis or was reviewed when the stored record
does not contain that provenance.

This is a frontend behavior and presentation change. It does not change the
backend, the model prompt, the API contract, or any vault record.

## Payoff moment

A lawyer opens a matter and sees one saved current task, one control that
matches that task, and every other open record below it without invented copy
or provenance.

## Demo script

1. Open ORBIT. See `Run adverse-action research` once and a `Run research`
   button. No second open item repeats that work.
2. Open APEX. See `Confirm whether audio is used for model training` once and
   an `Open work item` button. The separate privacy-research review remains
   visible as required work.
3. Open HARBOR. See `Approve customer response` once and the existing
   `Approve response` control. The policy decision remains visible as required
   work.
4. Open CEDAR. See a completed matter card with no action button. The optional
   90-day reconciliation review remains visible. It must not disappear because
   its words resemble the saved matter note.
5. On every matter, saved recommendation text is clearly separate from a
   recorded decision. Its visible label says that source and review status are
   not recorded. Closed matters do not claim that the recommendation existed
   at the time of closing.

## Verified source map

This table is a constraint. Do not treat every visible phrase as frontend
copy.

| Visible content | Actual source | Rule for this build |
| --- | --- | --- |
| Stage, risk, due labels | Static frontend vocabulary in `frontend/lib/design.ts` plus API values | Safe to restyle. Do not change the vocabulary. |
| Action categories, labels, and generic details | Static frontend values returned by `matterAction()` in `frontend/lib/matterActions.ts` | Reuse them. Do not use a generic detail as the current task. |
| `detail.work_state.next_action` | Backend `MatterStateService.resolve()`: highest-priority required open work-item title, then saved `matter.md` `next_action`, then a backend stage default | This is the authoritative current-task sentence. Render it unchanged. |
| `detail.work_state.next_work_item_id` | Backend ID for the required work item selected above | Use this ID, not text similarity, to remove the current item from the secondary list. |
| Work-item title, type, owner, status, and required flag | Saved work-item Markdown. A user, system workflow, seed fixture, or agent tool call can create it. | Preserve every open work-item record except the one selected by `next_work_item_id`. |
| `orientation.decision_question` | `dossier.md` `Decision question`, which research can generate and a lawyer can edit; otherwise it falls back to saved `matter.md` `next_action` | Do not rewrite it into a static stage question. Do not show it as the main task in this build. Its source record remains available through the dossier when present or Matter details for the fallback. |
| `orientation.open_questions` | `dossier.md` open questions, which can be generated or edited; otherwise required work-item titles | Include distinct questions below the current task. Remove only exact normalized duplicates. |
| Recommendation text | Editable `recommendations.md` | The current record has no reliable author or review-state field. Do not label it `Themis`, `Not reviewed`, `Never reviewed`, or `at the time of closing`. |
| Chat suggestion chips | Static `SUGGESTIONS` in `ChatPanel.tsx`; clicking one sends that text to the model as a user message | Out of scope. Do not change `ChatPanel.tsx`. |

## Why the original Opus plan was unsafe

The original plan must not be followed for these points:

- Its 80% word-overlap rule hides a real, optional CEDAR work item. Similar
  words are not record identity.
- Its stage-question table replaces saved or generated orientation text with
  new static questions. That is a product decision, not a wording cleanup.
- Its fused card puts `Record decision` beside APEX's fact-confirmation task
  and `Review intake` beside ORBIT's research task. The controls do not match
  the displayed work.
- `Themis · Never reviewed` and `Recommendation at the time of closing` invent
  provenance and timing that are not stored.
- Stage-aware chat chips alter prompts sent to the model. They are a behavior
  change unrelated to the current-task problem.
- A sticky card is unsafe with variable recommendation length and is not needed
  to prove the redesign.

## Files to change

| File | Change |
| --- | --- |
| `frontend/lib/matterBrief.ts` | New pure helpers for record-safe open-item selection and current control selection. |
| `frontend/scripts/check-matter-brief.ts` | New direct Node check with the four real fixture shapes and hostile cases. |
| `frontend/tsconfig.json` | Exclude `scripts` so the direct Node `.ts` import does not affect app typechecking. |
| `frontend/components/MatterWorkspace.tsx` | Use the helpers, render the new card and open list, and route `Open work item`. |
| `frontend/app/globals.css` | Matter-card, open-list, recommendation, and column-layout rules; remove only proven orphans. |

Do not change `ChatPanel.tsx`, `frontend/lib/matterActions.ts`, any backend file,
or any vault file.

`graphify-out/` may change only as generated output from the required final
`graphify update .` command. Do not hand-edit it.

## Build

### Step 1 — Add record-safe pure helpers and their direct check

Create `frontend/lib/matterBrief.ts`.

Required exported types and signatures:

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

Implement these exact rules:

1. `currentWorkItemFor` returns the item whose `work_item_id` equals
   `nextWorkItemId`. It returns `undefined` for a null or unknown ID.
2. `controlIdForCurrentWork` returns the stage action when there is no current
   work item.
3. A current item with `item_type === "research"` returns `run_research`.
4. A current item with `item_type === "approval"` returns
   `approve_response` only when the stage action is already
   `approve_response`.
5. Every other current item returns `open_work_item`. Unknown item types must
   use this safe fallback.
6. `openItemsFor` starts with every work item whose status is not `done` or
   `closed`, except the exact `nextWorkItemId`.
7. Never deduplicate work items by title. Two records with the same title are
   still two records. Use `work:${work_item_id}` as each key.
8. Add open questions after work items. Normalize only for exact duplicate
   checks: trim, lowercase, collapse whitespace, and remove terminal `.`, `?`,
   or `!` characters. Do not use stop words, token overlap, stemming, or fuzzy
   matching.
9. Do not add an open question when its normalized text exactly equals the
   current action or any open work-item title. Deduplicate questions by the
   same normalized text. Use `question:${normalizedText}` as the key.
10. Ignore blank questions. Questions are not structured work-item records, so
    return them with `required: false` and `source: "open_question"`.

Build the set of open work-item title keys before excluding the current item,
so the fallback open-question array cannot add the current record back.

Create `frontend/scripts/check-matter-brief.ts`. It must cover:

- ORBIT: current research item; control `run_research`; no secondary item.
- APEX: current question item; control `open_work_item`; the separate research
  review remains required.
- HARBOR: current approval item; control `approve_response`; the separate
  policy item remains required.
- CEDAR: no current required item; control `none`; the similar optional 90-day
  review remains visible.
- Two open work-item records with the same title both remain visible.
- An exact duplicate open question is removed.
- A similar but non-identical open question remains visible.
- A blank open question is ignored.
- An unknown work-item type returns `open_work_item`.
- An unknown `nextWorkItemId` returns no current item and does not remove any
  work-item record.

Use simple assertions that print `ok` or `FAIL` and exit nonzero on failure.
Do not add a dependency or test runner.

Edit `frontend/tsconfig.json` so `exclude` is:

```json
"exclude": [
  "node_modules",
  "scripts"
]
```

Verification:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

Expected: the script ends with `All checks passed.` and both commands exit 0.

### Step 2 — Select the saved current task and a matching control

Edit `frontend/components/MatterWorkspace.tsx`.

Add this import:

```ts
import {
  controlIdForCurrentWork,
  currentWorkItemFor,
  openItemsFor,
  type MatterControlId,
} from "@/lib/matterBrief";
```

Add `type MatterActionView` to the existing `@/lib/matterActions` import, then
define this local render type near the imports:

```ts
type MatterControl = Omit<MatterActionView, "id" | "category"> & {
  id: MatterControlId;
  category: MatterActionView["category"] | "Work item";
};
```

Keep the existing `primaryAction = matterAction(...)`. It remains the stage
fallback. After it, derive:

```ts
const currentWorkItem = currentWorkItemFor(
  detail.work_items,
  detail.work_state.next_work_item_id,
);
const currentControlId = controlIdForCurrentWork(primaryAction.id, currentWorkItem);
```

Create `currentControl` with one of three sources:

- If `currentControlId === primaryAction.id`, reuse `primaryAction` unchanged.
- If it is `run_research`, use this static frontend view:

  ```ts
  { id: "run_research", category: "Work action", label: "Run research", detail: "Run the current research work item." }
  ```

- If it is `open_work_item`, use:

  ```ts
  { id: "open_work_item", category: "Work item", label: "Open work item", detail: "Open the saved work item and review its details." }
  ```

Declare the local object as `const currentControl: MatterControl = ...`. Do not
add `open_work_item` to `MatterActionId`; it is a workspace-only control, not a
workflow action.

Replace the old derived values `matterQuestion`, `unresolved`,
`requiredOpenWork`, and `openWorkItems` with:

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

Base `primaryActionClass` on `currentControl.category` and
`currentControl.id`, not on `primaryAction`.

Rename `runPrimaryAction` to `runCurrentControl`. Switch on
`currentControl.id`. Preserve all existing branches and API calls. Add this
first branch:

```ts
if (currentControl.id === "open_work_item" && currentWorkItem) {
  openDocument(currentWorkItem.path);
  return;
}
```

Change the `review_remaining_work` branch so it only scrolls to the new
section. It is no longer a `<details>` element:

```ts
if (currentControl.id === "review_remaining_work") {
  document.getElementById("remaining-work")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  return;
}
```

Every other branch keeps its current behavior. Do not add a completion action
for generic work items.

Delete `questionForMatter`. Confirm there is no caller first.

Verification:

```bash
cd frontend
npm run typecheck
rg -n "questionForMatter|saysTheSame|STOP_WORDS" components lib
```

Expected: typecheck exits 0. The `rg` command returns no match and exit 1.

### Step 3 — Replace the duplicate header and three competing sections

In `MatterWorkspace.tsx`, add `riskLabel` to the existing design import.

In the header:

- Keep only the `Matters` back link in `.matter-crumb`.
- Replace the right-side `Next action` block with a `.matter-facts` definition
  list for `Stage`, `Risk`, and `Due`.
- Use `stageLabel(detail.status)`, `riskLabel(detail.risk_level)`, and the
  existing `due` value.

Replace the `Current question`, `Working recommendation`, and
`matter-primary-action` sections with one `.matter-call` section.

Required order inside the card:

1. Static kicker: `Next action` for active matters, `Matter status` when
   `primaryAction.id === "none"`.
2. `currentTask` as the largest text. Render it unchanged with
   `LinkifiedText`.
3. On active matters only, the saved recommendation block from Step 4.
4. On active matters only, one control row. Show `currentControl.category` as
   the state word and the button with `currentControl.label`. Use
   `title={currentControl.detail}` and call `runCurrentControl()`.

Do not render `orientation.decision_question` in this card. Do not add a
stage-question table. Do not show `primaryAction.detail` as a second task
sentence.

Required skeleton:

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

Use the exact `.matter-facts`, `.matter-call`, `.matter-recommendation`, and
mobile CSS values embedded in `docs/matter-page.handoff-prompt.md`. Reuse only
existing semantic tokens. Active uses the attention wash and edge. Complete
uses neutral rail and line tokens. Do not make the card sticky.

The control-row state word must remain visible. Color must not be the only
signal.

Update the existing mobile media query so `.matter-call-do` stacks and the
button aligns to the start.

Verification:

```bash
cd frontend
npm run typecheck
npm run build
rg -n 'Current question|Which path should we take\?|matter-primary-action|matter-context-question' components/MatterWorkspace.tsx
```

Expected: typecheck and build exit 0. The `rg` command returns no match and
exit 1.

### Step 4 — Make recommendation provenance honest

The current `recommendations.md` records do not store a reliable author or
review status. Change only the visible treatment. Do not add backend fields.

Step 3 already placed the active-matter `.matter-recommendation` block. Do not
add a second copy. Style it with a solid neutral border and `--raised`
background. Do not use `.agent-note`, iris, or a dashed border because author
provenance is unknown.

For closed matters, do not render the recommendation in the action card. In
the reference details, before `Matter materials`, add a section only when
`recommendationText` is non-empty:

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

Do not use the words `Themis`, `Never reviewed`, `at the time of closing`, or
`Final recommendation` in new UI copy.

Also change the `collectEvidence()` mapping for `recommendations.md` from
`kind: "Themis analysis"` to `kind: "Matter record"`, and change its note to
`"Saved recommendation; source and review status are not recorded"`.

Verification:

```bash
cd frontend
npm run typecheck
rg -n 'Never reviewed|at the time of closing|Themis analysis' components/MatterWorkspace.tsx
```

Expected: typecheck exits 0. The `rg` command returns no match and exit 1.
Existing chat UI can still contain `Themis · Not reviewed`; this check is
limited to `MatterWorkspace.tsx`.

### Step 5 — Show every remaining open record with its real required state

Replace the old `What remains unresolved` section with `.matter-open`.

Use this structure:

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

Use the exact `.matter-open*` CSS values embedded in
`docs/matter-page.handoff-prompt.md`. Required rows use the attention wash, an
attention dot, and the word `Required`. Optional rows use neutral tokens and no
required tag. Do not infer that optional means unimportant.

Verification:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
```

Expected: `All checks passed.` and exit 0 for both commands.

### Step 6 — Align the brief and chat columns and give chat usable space

This layout issue was verified on the current APEX page. Keep it in scope, but
do not change chat prompts or behavior.

In `globals.css`:

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

.chat-panel {
  flex: 1;
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

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

Remove the old `.matter-brief` max-width and auto margins. Keep the existing
mobile padding overrides at 18px. Do not edit `ChatPanel.tsx`.

Verification:

```bash
cd frontend
npm run build
rg -n 'max-height: 70%' app/globals.css
```

Expected: build exits 0. The `rg` command returns no match and exit 1.

### Step 7 — Remove only proven CSS orphans and run acceptance

Before deleting any selector, run:

```bash
cd frontend
rg -n 'className=.*(matter-context|the-question|decision-call|matter-summary|open-questions|orientation-question-label|brief-section-label)' app components
```

Delete an old rule only when the selector has no remaining JSX reference.
Expected candidates are the old `.matter-context*`, `.the-question`,
`.decision-call*`, `.matter-summary`, `.open-questions*`,
`.orientation-question-label`, `.brief-section-label`,
`.matter-priority-section`, `.matter-context-question`,
`.matter-primary-action`, `.matter-action-copy`, `.matter-action-button`, and
`.matter-section-heading` rules.

Do not delete `.agent-note`, `.agent-label`, `.matter-record-note`, evidence
rules, or shared chat rules.

Run:

```bash
cd frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run typecheck
npm run build
```

Then run the browser demo below.

## Browser acceptance

Use `http://localhost:3000`, not `127.0.0.1`, because the frontend's default
API base is `http://localhost:8000/api`.

Do not click `Run research` or `Approve response` against the user's live
vault. Those actions mutate matter records. The direct check proves their
selection. Browser acceptance checks labels, layout, and the read-only
`Open work item` path.

### ORBIT — `/matters/MAT-DEMO-ORBIT`

- Header shows Stage, Risk, and Due. It has no separate `Next action` block.
- Card says `Run adverse-action research` once.
- Button says `Run research`.
- The page says `Nothing else is open`.
- Recommendation label says source and review status are not recorded.

### APEX — `/matters/MAT-DEMO-APEX`

- Card says `Confirm whether audio is used for model training` once.
- Button says `Open work item`.
- Clicking it opens `WI-MAT-DEMO-APEX-1.md` in the document pane and changes no
  vault data.
- `Review first-pass privacy research` remains visible with `Required`.
- The overview does not invent `Which path should we take?`.
- The saved recommendation has neutral styling and no Themis provenance claim.

### HARBOR — `/matters/MAT-DEMO-HARBOR`

- `Overdue` remains visible with the failure color and word.
- Card says `Approve customer response` once.
- Button says `Approve response`.
- `Set the account-hold notice and remedy policy` remains visible with
  `Required`.

### CEDAR — `/matters/MAT-DEMO-CEDAR`

- Card uses the complete style, says
  `The work was delivered or otherwise resolved.`, and has no action button.
- `Review first 90 days of reconciliation exceptions` remains visible as one
  optional open record.
- The reference details show `Saved recommendation` and do not claim Themis,
  review state, or timing at closure.

### Layout

- At 1280 by 720, the brief and chat text share one horizontal gutter.
- The chat region has at least 260px height.
- The task card scrolls normally. It is not sticky.
- At the mobile breakpoint, facts wrap, the control row stacks, and the page
  has no horizontal overflow.

## Final repository checks

From the repository root:

```bash
cd frontend && npm run typecheck && npm run build
cd ../backend && .venv/bin/pytest -q
```

Frontend baseline was clean before this handoff.

Backend baseline on 2026-08-30 was not clean because the user's live vault
contains annotation data and a running process creates a transient SQLite
file during fixture copies: `3 failed, 317 passed, 1 error`. The failures were
in `tests/test_annotations.py`; the error was fixture setup for
`tests/test_company_interview.py`. Do not change backend code, tests, or vault
data for those unrelated failures. Report whether the result is unchanged and
whether any new failure appeared.

## Guardrails

- Do not change backend code, API shapes, model prompts, or vault files.
- Do not change or restate saved dynamic strings.
- Do not add fuzzy text matching.
- Do not hide an open work-item record because its words resemble another
  field.
- Do not invent author, model, review, approval, or closing-time provenance.
- Do not change `matterAction()` or its static vocabulary.
- Do not change `ChatPanel.tsx` or chat suggestions.
- Do not add sticky positioning to the task card.
- Do not add dependencies, test runners, CSS frameworks, or components.
- Do not change the three-pane grid, resizers, collapse behavior, or default
  collapsed panes.
- Do not reformat unrelated code.
- Do not edit `graphify-out/` manually. After application edits, run
  `graphify update .` from the repository root as required by `AGENTS.md`.
- Do not commit. The user did not request commits.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and
using the smallest choice consistent with this plan. Do not stop for warnings
or the recorded unrelated backend baseline.

Stop and report when:

- a named file, symbol, or API shape differs materially from this plan;
- a step-specific direct check, frontend typecheck, or frontend build fails
  after focused diagnosis;
- a change would require backend, prompt, or vault edits;
- proceeding would overwrite unrelated user work;
- a user decision is required.

## Parked backlog

- Add recommendation author and review provenance only after every writer has
  a stored contract for those fields. Evidence trigger: the product must show
  different treatments for human-authored and model-authored recommendations.
- Show dossier decision questions in the focal card only after the API carries
  source/type metadata or the producer guarantees a question contract.
  Evidence trigger: lawyers need both a current task and a distinct decision
  question in the first viewport.
- Add stage-aware chat chips only after testing them as prompt behavior.
  Evidence trigger: users repeatedly choose irrelevant default chips.
- Consider a sticky task card only after testing long saved recommendations at
  supported viewport heights. Evidence trigger: users lose the task while
  scrolling and a bounded sticky summary is designed.
