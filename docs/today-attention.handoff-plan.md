# Today page — attention hierarchy rebuild (handoff plan)

Target executor: GPT-5 "Sol", medium reasoning.
Author: design review of `app/page.tsx` conducted 2026-08-29 against the live app
at `localhost:3000` with the backend on `localhost:8000`.

## Why this change exists

The Today page is the front door. Its thesis — a ranked list of what needs the
lawyer, not a dashboard — is correct and is **not** being changed. Open matters
stay below the ranked list. The problem is that the execution undercuts the
thesis in six specific ways:

1. Rank ① is *less* urgent than rank ②. Items are sorted by `kind` only, so
   within `overdue` the order is whatever order matters arrived in. Today the
   list literally reads "① 0 days late, ② 2 days late". A numbered list makes an
   explicit promise about priority and the first two rows break it.
2. The subhead is a stat dump that is 5/7 zeros, wraps to two lines, and repeats
   what the headline just said.
3. Row *mass* overrides row *rank*. Item ③'s title is 24 words of 19px serif;
   items ①② are 6–7 words. The eye lands on ③ first regardless of its number.
4. Overdue (vermilion) and needs-review (ochre) read as the same temperature
   because both washes are near-white.
5. The list is never sliced. On a busy week it becomes an unbounded scroll
   headed "Twenty things need your attention".
6. Open matters are rendered as the visually weakest element on the page — four
   bare text rows with no container, no total, and no link to the rest.

Plus two layout faults: a ~360px dead gutter at 1440px, and a ~300px void above
the footer band caused by `.page { flex: 1 }`.

## Scope

Six files. No backend changes. No new dependencies. No new npm scripts.

| # | File | Change |
|---|------|--------|
| 1 | `frontend/app/globals.css` | Additive CSS block only |
| 2 | `frontend/lib/design.ts` | Export one existing function |
| 3 | `frontend/lib/briefing.ts` | Ranking, copy, clamping, counts |
| 4 | `frontend/components/BriefingList.tsx` | Status pill, overflow disclosure |
| 5 | `frontend/components/PracticeRail.tsx` | New file |
| 6 | `frontend/app/page.tsx` | Two-column layout, order swap, drop footer band |

---

## Design specification (read before writing any code)

### Colour and meaning

Existing tokens only. Do not invent colours. From `frontend/lib/design.ts`:

```ts
role.failure       = "#B33A20"   // overdue, failed — never "high risk"
role.failureTint   = "#F8E3DC"
role.failureWash   = "#FFFAF8"
role.attention     = "#E0A008"   // needs the lawyer
role.attentionTint = "#FDEEC0"
role.attentionDeep = "#8A6612"
role.attentionWash = "#FFFDF4"
role.agent         = "#5F5AC0"   // agent-generated
role.ink           = "#1b1a17"   // human record
role.quiet         = "#5f5b54"
```

**The pill rule.** The bare `.dot` plus coloured word is replaced by a single
tinted pill. This is deliberate and permitted: `docs/DESIGN_LANGUAGE.md` says
light washes go on rows, and stronger tints are reserved for "small controls,
badges, and selected states". A status pill is a badge.

- Overdue / failing pill: background `role.failureTint`, text `role.failure`
  (6.2:1 contrast — passes AA).
- Every attention pill: background `role.attentionTint`, text
  `role.attentionDeep` (~4.6:1 — passes AA).

Note the deliberate split: the **spine** keeps the bright `role.attention`
(#E0A008) because it is a 3px graphic, but the **pill text** uses
`role.attentionDeep` (#8A6612) because #E0A008 on #FDEEC0 is unreadable. Do not
use `role.attention` as text on a tint anywhere.

The word always sits beside the colour. Never remove the status word.

### Row mass

Two mechanisms, each with a distinct job:

- **Data clamp (`clampText`, 72 chars, word boundary).** Applied uniformly to
  every briefing item title. This exists for `packet.what_happened`, which is
  structurally a sentence rather than a label, and for any unusually long
  `next_action`. 72 characters is roughly one line of 19px Source Serif 4 in the
  1000px column.
- **CSS `-webkit-line-clamp: 2`** on `.brief-title` and `.brief-why`. This is a
  narrow-viewport backstop only — the full text stays in the DOM for screen
  readers.

### Urgency without shouting

Overdue rows get a 4px spine instead of 3px (`padding-left` drops 21px → 20px so
the text stays aligned). Washes are **not** made heavier — the design language
puts strength in badges, not row fills.

### The rail

296px, sticky at `top: 75px` (measured topbar height is 53px + 22px breathing
room). It is a **quiet list, not tiles**. `docs/DESIGN_LANGUAGE.md` forbids "a
dashboard of tiles"; the moment this becomes stat chips it violates the design
language. Rules:

- Stage rows are plain text + a tabular number. Zero-count stages dim to
  `--ink-6` and drop to weight 400. They stay visible — an empty stage is
  information.
- Stage rows are **not** links. `frontend/app/matters/page.tsx` filters via local
  React state, not URL params; there is no `?stage=` to link to. One
  "Open the workspace" link at the foot, and the whole card is reachable from nav.
- Vocabulary matches `/matters`: the phrase is "with Themis", and the predicate
  is `execution_state ∈ {queued, running} || next_actor === "themis"` — the same
  test `frontend/app/matters/page.tsx` uses for its "With Themis" count. Do not
  write "being worked by an agent"; that phrase appears nowhere else.

### Layout arithmetic

```
grid = minmax(0, 1000px) + 28px gap + 296px rail = 1324px
page padding = 40px each side
container maxWidth = 1324
```

The first track is `minmax(0, 1000px)`, so it **shrinks** rather than overflowing
when the viewport is tight. The 1180px breakpoint is therefore a judgment about
when the rail stops earning its width, not an overflow guard. Below 1180px the
grid collapses to one column and the rail stacks below "Your other matters" and
above the intake bar — which is an acceptable reading order.

`.today-start` is capped at 1000px so the intake bar and chat align with the
left column rather than stretching under the rail.

### Order

Intake bar moves **above** the chat. Rationale: a product lawyer's day starts one
of two ways — something needs me, or something just landed in Slack. The second
path is currently the last element on the page. The intake bar is ~60px and the
chat card is ~200px, so the swap costs almost nothing.

The chat stays below both. Its first suggestion chip is "What needs my attention
today?", which the entire screen above it already answers. It is the follow-up
surface, not the front door.

### Footer band

Deleted from `page.tsx`. Its three stats now live in the rail, where they are
actually read, and removing it also removes the ~300px void that `.page
{ flex: 1 }` creates above it. **Leave the `.footer-band` CSS in `globals.css`
untouched** — the rule at line ~1172 shares a selector with `.admin-foot`, which
is still in use elsewhere. Intentional dead CSS; do not "clean it up".

---

## Step 1 — `frontend/app/globals.css`

Purely additive. Append this block at the very end of the file. Change nothing
that already exists.

```css

/* ── Today — attention hierarchy (3a revision) ────────────────────────── */

/* The status pill replaces the bare dot. Colour plus the word, in a small
   tinted control — the design language reserves stronger tints for badges. */
.brief-status {
  display: inline-flex; align-items: center;
  border-radius: 5px; padding: 2px 8px;
  font: 600 12.5px/1.35 var(--sans);
}

/* Titles and reasons are capped so a long row cannot out-weigh a higher-ranked
   short one. The full text stays in the DOM. */
.brief-title, .brief-why {
  display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;
}
.brief-title { -webkit-line-clamp: 2; }
.brief-why { -webkit-line-clamp: 2; }

/* Overdue reads hotter than waiting without a heavier wash: a wider spine. */
.brief-row.is-late { border-left-width: 4px; padding-left: 20px; }

.brief-more {
  display: block; width: 100%; text-align: left;
  background: var(--raised); border: 0; border-top: 1px solid var(--line-hair);
  padding: 13px 24px 13px 21px; cursor: pointer;
  font: 500 14px var(--sans); color: var(--ink-3);
}
.brief-more:hover { background: var(--hover); color: var(--ink); }

/* Two-column Today: the ranked list keeps its width, the practice sits beside
   it instead of in a footer nobody reads. */
.today-grid {
  margin-top: 26px;
  display: grid; grid-template-columns: minmax(0, 1000px) 296px;
  gap: 28px; align-items: start;
}
.today-col { min-width: 0; display: flex; flex-direction: column; gap: 22px; }
.today-rail { min-width: 0; position: sticky; top: 75px; }

.rail-head {
  display: flex; align-items: baseline; gap: 10px;
  padding: 14px 18px 12px; border-bottom: 1px solid var(--line-hair);
}
.rail-head-title { flex: 1; font: 600 16px var(--serif); color: var(--ink); }
.rail-head-count { font: 400 13.5px var(--sans); color: var(--ink-5); }

.rail-stage {
  display: flex; align-items: baseline; gap: 12px;
  padding: 9px 18px; border-bottom: 1px solid var(--line-hair);
}
.rail-stage:last-of-type { border-bottom: 0; }
.rail-stage-label { flex: 1; font: 400 14px/1.4 var(--sans); color: var(--ink-2); }
.rail-stage-count {
  flex: none; font: 600 16px var(--serif); color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.rail-stage.is-empty .rail-stage-label { color: var(--ink-6); }
.rail-stage.is-empty .rail-stage-count { color: var(--ink-6); font-weight: 400; }

.rail-note {
  display: flex; align-items: baseline; gap: 9px;
  padding: 11px 18px; border-top: 1px solid var(--line-soft);
  font: 400 13.5px/1.5 var(--sans); color: var(--ink-3);
}
.rail-foot { padding: 12px 18px 14px; border-top: 1px solid var(--line-soft); }

/* "Your other matters" gets a container so it stops reading as a footnote. */
.quiet-head {
  display: flex; align-items: baseline; gap: 12px;
  padding: 12px 20px; border-bottom: 1px solid var(--line-hair);
}
.quiet-head-title { font: 600 16px var(--serif); color: var(--ink); }
.quiet-head-count { flex: 1; font: 400 13.5px var(--sans); color: var(--ink-5); }
.quiet-head-link { font: 500 13.5px var(--sans); color: var(--agent); }
.quiet-head-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.quiet-inset { padding: 2px 20px 6px; }
.quiet-inset .quiet-row:last-child { border-bottom: 0; }

@media (max-width: 1180px) {
  .today-grid { grid-template-columns: minmax(0, 1fr); gap: 22px; }
  .today-rail { position: static; }
}
```

**Verify:**
```bash
cd frontend && npm run typecheck
```
Expected: exits 0, no output. (CSS is not typechecked; this only proves nothing
else broke.)
```bash
grep -c "brief-status\|today-grid\|rail-stage-count\|quiet-head-link" frontend/app/globals.css
```
Expected: `4` or more.

---

## Step 2 — `frontend/lib/design.ts`

`parseDisplayDate` is currently module-private (line ~187) but Step 3 needs it to
build a due-date sort key. Export it. One-word change.

Find:
```ts
function parseDisplayDate(value: string): Date {
```
Replace with:
```ts
export function parseDisplayDate(value: string): Date {
```

Change nothing else in this file.

**Verify:**
```bash
grep -n "export function parseDisplayDate" frontend/lib/design.ts
```
Expected: exactly one line, `187:export function parseDisplayDate(value: string): Date {` (line number may differ).
```bash
cd frontend && npm run typecheck
```
Expected: exits 0.

---

## Step 3 — `frontend/lib/briefing.ts`

Five changes to one file. All of them are in or around `buildBriefing`.

### 3a. Imports

Add `parseDisplayDate` to the existing named import from `./design`. The current
import is:

```ts
import { daysLate, decisionNeedsReview, formatShortDate, matterAwaitsJudgment, matterNextAction, role, stageLabel } from "./design";
```

Add `parseDisplayDate` to that list (alphabetical position: after `matterNextAction`).

### 3b. Extend the item type and add constants

Add these fields to `BriefingItem` (keep every existing field):

```ts
  /** Sort key inside a kind. Lower is more urgent. */
  order: number;
  /** Status-pill fill. Tint, not wash — a badge may carry a stronger colour. */
  pillBg: string;
  /** Status-pill text. Never role.attention on a tint; it is unreadable. */
  pillInk: string;
  /** Overdue and failing rows carry a wider spine. */
  late: boolean;
```

Add to `Briefing`:

```ts
  /** Every matter eligible for "Your other matters", before the slice of 4. */
  comingUpTotal: number;
```

Add these module constants near `RANK`:

```ts
/** A ranked list only reads as ranked if every row has similar mass. */
const TITLE_MAX = 72;

/** How many items show before the disclosure. The value of a ranked list is
    that it ends. */
export const VISIBLE_LIMIT = 6;

const PILL = {
  failure: { bg: role.failureTint, ink: role.failure },
  attention: { bg: role.attentionTint, ink: role.attentionDeep },
} as const;
```

### 3c. Two helpers

Add near the other module-level helpers (`whyFor`, `matterHref`):

```ts
function clampText(value: string, max = TITLE_MAX): string {
  const clean = (value || "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  const kept = space > max * 0.6 ? cut.slice(0, space) : cut;
  return `${kept.replace(/[,;:.\s]+$/, "")}…`;
}

/** Due-date sort key. Undated work sorts last, never first. */
function dueOrder(dueAt: string | null | undefined): number {
  if (!dueAt) return Number.MAX_SAFE_INTEGER;
  const parsed = parseDisplayDate(dueAt);
  return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
}
```

### 3d. Populate the new fields on all seven pushes

Apply `clampText(...)` to **every** `title:`. Set `order`, `pillBg`, `pillInk`,
`late` on each item exactly as below.

**overdue** — also fix the "0 days late" copy:
```ts
      const late = daysLate(matter);
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: "overdue",
        status: "Overdue",
        color: role.failure,
        rowBg: role.failureWash,
        title: clampText(matterNextAction(matter)),
        why: matter.description || matter.title,
        when: late === 0 ? "Due today" : late === 1 ? "1 day late" : `${late} days late`,
        action: matter.status === "respond" ? "Review and send" : "Open the matter",
        href: matterHref(matter),
        primary: true,
        order: -late,
        pillBg: PILL.failure.bg,
        pillInk: PILL.failure.ink,
        late: true,
      });
```
`order: -late` makes 2 days late (−2) sort before 0 days late (0).

**blocked / assignment** — note `color` changes from `role.attentionDeep` to
`role.attention`. The spine is a graphic and takes the bright ochre; the dark
ochre moves to the pill text. The two states stay distinguishable by their word
("Blocked" vs "Needs assignment"), which is the design language's rule.
```ts
        color: role.attention,
        rowBg: role.attentionWash,
        title: clampText(matterNextAction(matter)),
        ...
        order: dueOrder(matter.work_state.due_at),
        pillBg: PILL.attention.bg,
        pillInk: PILL.attention.ink,
        late: false,
```

**judgment:**
```ts
        title: clampText(matter.title),
        ...
        order: dueOrder(matter.work_state.due_at),
        pillBg: PILL.attention.bg,
        pillInk: PILL.attention.ink,
        late: false,
```

**review** (decisions) — stale sorts above review-recommended:
```ts
      title: clampText(decision.title),
      ...
      order: decision.review_status === "stale" ? 0 : 1,
      pillBg: PILL.attention.bg,
      pillInk: PILL.attention.ink,
      late: false,
```

**packet:**
```ts
      title: clampText(packet.what_happened),
      ...
      order: 0,
      pillBg: PILL.attention.bg,
      pillInk: PILL.attention.ink,
      late: false,
```

**failing** (schedules):
```ts
      title: clampText(`Reconnect ${schedule.title.toLowerCase()}`),
      ...
      order: 0,
      pillBg: PILL.failure.bg,
      pillInk: PILL.failure.ink,
      late: true,
```

### 3e. The sort

Replace:
```ts
  items.sort((a, b) => RANK[a.kind] - RANK[b.kind]);
```
with:
```ts
  items.sort((a, b) => RANK[a.kind] - RANK[b.kind] || a.order - b.order);
```

### 3f. `comingUpTotal`

Replace the single chained `comingUp` expression with a two-step version so the
true total survives the slice:

```ts
  const others = matters
    .filter((matter) => !items.some((item) => item.id === `matter-${matter.matter_id}`))
    .filter((matter) => matter.status !== "closed" && matter.status !== "intake");

  const comingUp: ComingUpItem[] = others.slice(0, 4).map((matter) => ({
    id: matter.matter_id,
    text: `${matter.title} — ${lowerFirst(matterNextAction(matter))}`,
    when: matter.work_state.due_at ? formatShortDate(matter.work_state.due_at) : stageLabel(matter.status),
    href: matterHref(matter),
  }));
```

### 3g. The subhead

Zeros are noise. Build the line from non-zero counts only and drop the
"Across matters, decisions, review packets, and schedules:" preamble — it is a
list of categories, not information. Replace the `subhead` value in the returned
object:

```ts
  const parts = [
    { n: overdue, label: `${overdue} overdue` },
    { n: blocked, label: `${blocked} blocked` },
    { n: assignment, label: `${assignment} unassigned` },
    { n: judgment, label: `${judgment} awaiting your judgment` },
    { n: review, label: `${review} ${review === 1 ? "decision" : "decisions"} to review` },
    { n: packets, label: `${packets} review ${packets === 1 ? "packet" : "packets"}` },
    { n: failing, label: `${failing} failed ${failing === 1 ? "schedule" : "schedules"}` },
  ].filter((part) => part.n > 0).map((part) => part.label);
```

and in the return:
```ts
    comingUpTotal: others.length,
    subhead: parts.length
      ? `${parts.join(" · ")}.`
      : "Nothing is overdue, blocked, or waiting on your judgment.",
```

Leave `headline` exactly as it is. The headline counts **all** items, not the
visible six — capping the display must not cap the truth.

**Verify:**
```bash
cd frontend && npm run typecheck
```
Expected: exits 0.
```bash
grep -n "RANK\[a.kind\] - RANK\[b.kind\] || a.order - b.order" frontend/lib/briefing.ts
grep -c "Across matters, decisions" frontend/lib/briefing.ts
```
Expected: first prints one line; second prints `0`.

---

## Step 4 — `frontend/components/BriefingList.tsx`

Three changes. The file becomes a client component because of the disclosure
state; `app/page.tsx` is already `"use client"` so this costs nothing.

1. Add `"use client";` as the first line and `import { useState } from "react";`.
2. Import `VISIBLE_LIMIT` alongside the existing `BriefingItem` type import:
   ```ts
   import { VISIBLE_LIMIT, type BriefingItem } from "@/lib/briefing";
   ```
3. Replace the dot + coloured word with the pill, add `is-late`, and add the
   disclosure row.

Signature and body:

```tsx
export default function BriefingList({ items, limit = VISIBLE_LIMIT }: { items: BriefingItem[]; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
```

Keep the empty state exactly as it is, but **remove** its `style={{ marginTop: 26 }}`
— vertical rhythm is now owned by `.today-grid` and `.today-col`.

The populated branch:

```tsx
  const visible = expanded ? items : items.slice(0, limit);
  const hidden = items.length - visible.length;

  return (
    <div className="card">
      <div className="row-list">
        {visible.map((item, index) => (
          <div
            className={`row brief-row${item.late ? " is-late" : ""}`}
            key={item.id}
            style={{ borderLeftColor: item.color, background: item.rowBg }}
          >
            <div className="brief-index">{index + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="brief-meta">
                <span className="brief-status" style={{ background: item.pillBg, color: item.pillInk }}>
                  {item.status}
                </span>
                <span>{item.when}</span>
              </div>
              <div className="brief-title"><LinkifiedText text={item.title} /></div>
              <div className="brief-why"><LinkifiedText text={item.why} /></div>
            </div>
            <div style={{ flex: "none", paddingTop: 24 }}>
              <Link className={`btn brief-action ${item.primary ? "primary" : ""}`} href={item.href}>
                {item.action}
              </Link>
            </div>
          </div>
        ))}
      </div>
      {hidden > 0 || expanded ? (
        <button className="brief-more" onClick={() => setExpanded(!expanded)} type="button">
          {expanded
            ? "Show fewer"
            : `Show ${hidden} more ${hidden === 1 ? "item" : "items"} that need you`}
        </button>
      ) : null}
    </div>
  );
```

Note what was removed: the `<span className="dot" …/>` and the
`<span className="faint">·</span>` separator. `.brief-meta` already has `gap: 9px`,
so the pill and the timing word space correctly without a bullet.

The overflow control is a **disclosure, not a link**. Overflow items can be
matters, decisions, packets, or schedules, so no single destination is honest.

**Verify:**
```bash
cd frontend && npm run typecheck && npm run build
```
Expected: both exit 0. The build prints route sizes; warnings about unrelated
routes are acceptable, errors are not.

---

## Step 5 — `frontend/components/PracticeRail.tsx` (new file)

Create exactly this file:

```tsx
import Link from "next/link";
import { STAGES, matterIsAgentWorking, role } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";

/**
 * Canvas 3a. The practice, beside the ranked list rather than in a footer band
 * nobody scrolls to. Deliberately a quiet list and not a row of tiles: the
 * ranking is the product, and this is the reference beside it.
 */
export default function PracticeRail({ matters, decisions }: { matters: Matter[]; decisions: Decision[] }) {
  const open = matters.filter((matter) => matter.status !== "closed");
  const withThemis = open.filter(
    (matter) => matterIsAgentWorking(matter) || matter.work_state.next_actor === "themis",
  ).length;

  return (
    <aside className="card today-rail">
      <div className="rail-head">
        <span className="rail-head-title">The practice</span>
        <span className="rail-head-count">{open.length} in flight</span>
      </div>

      {STAGES.filter((stage) => stage.id !== "closed").map((stage) => {
        const count = open.filter((matter) => matter.status === stage.id).length;
        return (
          <div className={`rail-stage${count === 0 ? " is-empty" : ""}`} key={stage.id}>
            <span className="rail-stage-label">{stage.label}</span>
            <span className="rail-stage-count">{count}</span>
          </div>
        );
      })}

      <div className="rail-note">
        <span className="dot" style={{ background: withThemis ? role.agent : role.quiet }} />
        <span>
          {withThemis === 0
            ? "Nothing is with Themis right now."
            : `${withThemis} ${withThemis === 1 ? "matter is" : "matters are"} with Themis.`}
        </span>
      </div>

      <div className="rail-note">
        <span className="dot" style={{ background: role.ink }} />
        <span>
          {decisions.length} {decisions.length === 1 ? "decision" : "decisions"} recorded.
        </span>
      </div>

      <div className="rail-foot">
        <Link className="btn compact quiet" href="/workspace">Open the workspace</Link>
      </div>
    </aside>
  );
}
```

Why the dots stay here but leave the briefing rows: in the briefing the colour is
carried by the pill and the spine, so a dot is redundant. In the rail there is no
spine and no pill, so the dot is the only carrier — and it is paired with a full
sentence, satisfying "never make colour the only signal".

**Verify:**
```bash
cd frontend && npm run typecheck
```
Expected: exits 0. (The component is unused until Step 6; this only proves it
compiles.)

---

## Step 6 — `frontend/app/page.tsx`

### 6a. Imports

Add:
```ts
import PracticeRail from "@/components/PracticeRail";
```

### 6b. Delete dead state

Remove these two lines — their content moved into `PracticeRail`:
```ts
  const inFlight = matters.filter((matter) => matter.status !== "closed").length;
  const working = matters.filter((matter) =>
    matter.work_state.execution_state === "queued" || matter.work_state.execution_state === "running"
  ).length;
```

### 6c. Replace the whole `return (...)` body

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <AppShell>
      <main className="page">
        <div style={{ maxWidth: 1324 }}>
          <div className="day">{today}</div>
          {loaded ? <h1 className="headline">{briefing.headline}</h1> : <h1 className="headline">Reading the vault…</h1>}
          <p className="subhead">{loaded ? briefing.subhead : "One moment."}</p>

          {error ? <p className="error">{error}</p> : null}
          {!loaded && !error ? <div className="loading">Loading the briefing…</div> : null}

          {loaded && !error ? (
            <div className="today-grid">
              <div className="today-col">
                <BriefingList items={briefing.items} />

                {briefing.comingUp.length ? (
                  <section className="card">
                    <div className="quiet-head">
                      <span className="quiet-head-title">Your other matters</span>
                      <span className="quiet-head-count">
                        Showing {briefing.comingUp.length} of {briefing.comingUpTotal}
                      </span>
                      <Link className="quiet-head-link" href="/matters">All matters →</Link>
                    </div>
                    <div className="quiet-list quiet-inset">
                      {briefing.comingUp.map((item) => (
                        <Link className="quiet-row" href={item.href} key={item.id}>
                          <span style={{ flex: 1 }}>{item.text}</span>
                          <span>{item.when}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <PracticeRail decisions={decisions} matters={matters} />
            </div>
          ) : null}

          <div className="today-start" style={{ maxWidth: 1000 }}>
            <NewMatterForm
              busy={creating}
              onCreate={async (payload) => {
                setCreating(true);
                try {
                  const matter = await createMatter(payload);
                  router.push(`/matters/${encodeURIComponent(matter.matter_id)}`);
                } finally {
                  setCreating(false);
                }
              }}
            />
            <TodayChat onRefresh={load} />
          </div>
        </div>
      </main>
    </AppShell>
  );
```

Four things changed structurally, all intentional:
- `style={{ paddingBottom: 0 }}` is gone from `<main className="page">`. It only
  existed to butt against the footer band.
- The entire `<div className="footer-band">…</div>` block is gone.
- The heading "Coming up" became "Your other matters" inside a real container.
- `NewMatterForm` now precedes `TodayChat`.

**Verify:**
```bash
cd frontend && npm run typecheck && npm run build
```
Expected: both exit 0.
```bash
grep -c "footer-band\|inFlight" frontend/app/page.tsx
```
Expected: `0`.

---

## Acceptance check (this is the real gate)

`npm run typecheck` and `npm run build` prove the code compiles. They do **not**
prove the design works. The page fetches its data in `useEffect`, so server-side
HTML is empty and `curl` cannot verify it. The acceptance walk below is the only
check that can fail for the right reasons — do not skip it and do not report the
task complete without it.

Both servers should already be running. If not:
```bash
cd backend && .venv/bin/uvicorn app.main:app --port 8000 --app-dir .
```
```bash
cd frontend && npm run dev
```

Open `http://localhost:3000` at a **1440 × 900** viewport.

These are the exact observations recorded on the pre-change build on 2026-08-29.
Each must now read differently:

| # | Before | After |
|---|--------|-------|
| 1 | ① "Clarify which manual review step is being removed" — `Overdue · 0 days late` | ① "Approve customer response" — `Overdue · 2 days late` |
| 2 | ② "Approve customer response" — `Overdue · 2 days late` | ② "Clarify which manual review step is being removed" — `Overdue · Due today` |
| 3 | Subhead is two lines containing four `0 …` counters | Subhead is one line, no `0` anywhere: `2 overdue · 2 decisions to review · 1 review packet.` |
| 4 | ③'s title wraps to two full lines of serif | ③'s title is one line ending in `…` |
| 5 | Status is a small dot plus coloured text | Status is a filled tinted pill; "Overdue" is vermilion-on-blush, "Needs review" is dark ochre-on-cream |
| 6 | Rows ①② and ③④⑤ have identical 3px spines | Rows ①② have a visibly thicker (4px) spine |
| 7 | "Coming up" — bare rows, no container, no total | "Your other matters" — bordered card, "Showing 4 of 8", "All matters →" |
| 8 | ~360px empty gutter on the right | A 296px "The practice" card reading "8 in flight" with a per-stage count list |
| 9 | Chat card above the "Paste a request" bar | "Paste a request" bar above the chat card |
| 10 | Footer band "The rest of the practice" after ~300px of void | No footer band; the page ends at the chat card |

If any seed data has changed and the specific titles differ, the **relationships**
still hold and are what actually matter: rank ① must have a `days late` value
greater than or equal to rank ②'s, and no `Overdue` row may read `0 days late`.

Then check the responsive collapse: resize to **1100 × 900**. The rail must move
below "Your other matters" and above the intake bar, and the page must not scroll
horizontally.

Finally, click "Show fewer"/"Show N more" if more than six items are present. With
today's five items no disclosure row should appear at all.

## Do NOT

- Do not move the ranked attention list. It stays first. Open matters stay below
  it. This is the product thesis, not a layout preference.
- Do not turn the rail into stat chips, tiles, or a card grid.
  `docs/DESIGN_LANGUAGE.md` explicitly forbids "a dashboard of tiles".
- Do not add page-local colours. Every colour must come from `role` in
  `frontend/lib/design.ts` or a `--token` in `globals.css`.
- Do not use vermilion for anything other than overdue or failed. It is never
  "high risk" or "important".
- Do not use `role.attention` (#E0A008) as text on any tinted background.
- Do not remove a status word to leave colour alone carrying meaning.
- Do not edit the existing `.footer-band` rules in `globals.css`. They share a
  media-query selector with `.admin-foot`.
- Do not modify anything under `backend/` or `vault/`.
- Do not add dependencies, npm scripts, or a test runner.
- Do not reformat, re-indent, or reorder code you were not asked to change.
- Do not link rail stage rows to `/matters?stage=…`. That param does not exist;
  `frontend/app/matters/page.tsx` filters in local React state.
- Do not cap `briefing.headline`'s count to the visible six. The headline tells
  the truth about the total.
- If a step's verification fails, or a named file, function, or field turns out
  not to exist as described, stop and report. Do not improvise a workaround.

## Known limitation

There is no frontend test runner in this project (`frontend/package.json` has no
`test` script) and adding one is out of scope. The per-step verifications are
therefore compilation plus targeted greps, which prove the change landed but not
that it behaves. The acceptance table above is the behavioural gate and is
mandatory.
