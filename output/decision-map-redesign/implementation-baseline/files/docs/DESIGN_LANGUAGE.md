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

## Matter A reference alignment (September 5, 2026)

The supplied Matter A images govern the current visual rebuild. Shared surface tokens now use white and cool neutral rules. Agent purple is vivid (#4922ff), with a light lavender wash and a visible dashed border. Attention uses orange text and a pale amber badge; state words remain mandatory. Primary actions use dark navy. Matter view tabs use line icons and an underline. Working answers span the reading width; qualifications and the next action each have their own row. These rules supersede the older beige surface values and muted iris values above. Existing record and action distinctions remain unchanged.
