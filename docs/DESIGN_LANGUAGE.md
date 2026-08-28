# Counsel OS design language

Imported from the `Counsel OS` design canvas
(`claude.ai/design/p/df618af1-323e-4c96-ab86-0feb13fb166e`, file `Counsel OS.dc.html`).
That canvas is the source of truth for visual decisions; this file records the
rules so they survive outside it.

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

| Role | Solid | Tint | Deep text | Means |
| --- | --- | --- | --- | --- |
| Needs my attention | `#E0A008` | `#FDEEC0` | `#8A6612` / `#6B4A02` | Blocked on the lawyer, stale, awaiting judgment |
| Healthy / complete | `#146B54` | `#E0EFE9` | — | Done, current, on track |
| Failure / overdue | `#B33A20` | `#F8E3DC` | — | **Reserved.** Never for "high risk" or emphasis |
| Agent-generated | `#5F5AC0` | `#EAE8F9` / `#F4F3FC` | — | Drafts, recommendations, machine claims |
| Human-recorded fact | `#1b1a17` | `#f7f5f1` | — | Decisions, signatures, dates |

Every colour carries a word beside it. A dot alone is never the signal.

## Type

- **Source Serif 4** — matter titles, section headings, memo and draft body,
  recorded decision text. Anything read for minutes rather than scanned.
- **IBM Plex Sans** — every control, label, table cell, chip and status word.
- **IBM Plex Mono** — record metadata only: ids, dates in a register, front
  matter, `10px` with `.09em` tracking, uppercase.

Base UI text is `15px`. Grey is dark enough to read (`#55524b`, not `#8a857c`).

## Agent versus record

This is the one rule that never bends.

- Agent output: **dashed** iris border, iris tint, labelled with the agent's name
  and "not yet reviewed" until a human accepts it.
- Recorded decisions: solid border, serif, a real date, a named human.
- Recommendations never appear inside the decision table. They sit outside it,
  and the only path from one to the other is the act of recording.
- An agent can recommend a decision and can never record one. It can draft a
  reply and can never send one. These are locked settings, not defaults.

## Buttons

One primary (`--ink` on `--paper` text) per region. Secondary is `--raised` with
a `#d6d1c7` border. Ochre `#FDEEC0`/`#F0D896` is the "review now" affordance.
Agent actions are dashed iris on transparent.

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

## Stage vocabulary

The six stages keep their ids and gain plain-language names. The name is the
same in the board, the matter header and chat.

| id | Label | Sub |
| --- | --- | --- |
| `intake` | Just came in | Not yet triaged |
| `research` | Being researched | An agent is gathering the facts |
| `explore` | Waiting on your judgment | Research is done; a path must be chosen |
| `generate` | Being drafted | Work product is being written |
| `respond` | Ready to send | Drafted and approved, not yet out |
| `closed` | Closed | Decided and delivered |
