# Written for — audience-shaped work product

Status: **specification, not yet built.** Supersedes the "Voice" control on the
agent builder (canvas `4b`).

## Why this exists

A lawyer rewrites the same analysis three times for three readers. The retention
question in the Nimbus matter is one set of facts, but it reaches:

- **outside counsel** as clause numbers and a position to hold,
- **the CEO** as a cost, a date, and a recommendation,
- **the product team** as a list of what they may and may not ship.

That rewriting is real work and it is not tone. It changes what is included,
what is assumed, what is named, and what is left out. A three-way *Voice* switch
(Plain / Formal / Terse) does not describe it — those are register, and register
is the smallest part of the difference.

So the control is **Written for**, and it names a reader.

## The mechanic

1. A row of **audience chips**, read from the vault.
2. Clicking one **fills an editable text field** with that audience's prompt text.
3. The lawyer edits it. From that point the words are theirs.
4. On send, that text is added to the model's context.

The preset is a starting point, never a constraint. The editable field is the
actual contract with the model — a lawyer who writes "the reader is our banking
partner's compliance officer, who has already read the DPA" gets exactly that,
and it is visible on screen rather than buried in a prompt template.

**Clicking a preset replaces the field.** No confirmation dialog: the Agents
screen already has Discard, and nothing is written until Save.

## Where it lives

| Scope | Holds | Status |
| --- | --- | --- |
| Vault | The presets themselves | Build now |
| Agent | That agent's default audience | Build now |
| Request | An override for one draft or one answer | Next increment |

Audience genuinely varies per artifact, not per agent — the same agent writes to
the CEO on Monday and to counsel on Tuesday. The agent-level default is the
useful first half: it stops every draft defaulting to no audience at all. The
per-request override belongs on the composer and on **Ask Themis to redraft**,
and is specified below but deliberately not in the first build.

**Precedence when both exist:** request override → agent default → nothing
injected.

## Storage

### Presets — `00_System/audiences.md`

```yaml
---
record_type: audiences
audiences:
  - audience_id: counsel
    label: Another lawyer
    prompt: >-
      The reader is a lawyer. Cite the clause and section for every position.
      Use the terms of art; do not gloss them. State the counter-argument you
      expect and why it fails. Do not explain background law they already know.
  - audience_id: executive
    label: An executive
    prompt: >-
      The reader decides and does not practise law. Lead with the recommendation
      and what it costs — money, delay, or risk carried. One paragraph of
      reasoning, no clause numbers. Name who owns the risk and by when. If there
      are two defensible paths, say which you would take.
  - audience_id: product
    label: The product team
    prompt: >-
      The reader is shipping something. Say what they may build, what they may
      not, and what has to be true first. Write the conditions as a checklist
      they can work from. No legal reasoning unless it changes what they build.
  - audience_id: partner
    label: A partner or counterparty
    prompt: >-
      The reader is outside the company and their counsel will read this after
      them. State our position and the basis for it. Concede nothing not already
      conceded in writing. Neutral, complete, no internal risk assessment and no
      speculation about our own exposure.
  - audience_id: regulator
    label: A regulator or auditor
    prompt: >-
      The reader is examining us. Be complete, dated, and precise about what was
      done, when, and by whom. Cite the record. Claim nothing that is not
      evidenced in the vault. No advocacy, no characterisation.
  - audience_id: record
    label: The record
    prompt: >-
      This is a memo to file. Neutral and complete. Label every assumption as an
      assumption and every gap as a gap. Write for a lawyer who picks this up in
      two years knowing none of the context.
---
# Audiences

Each entry seeds the "Written for" field. The lawyer edits the text after
choosing; the edited text, not the preset, is what reaches the model.
```

The label is what the chip says. `audience_id` is stable and referenced by
agents. A workspace can add, edit, or delete audiences by editing this file —
that is the reason presets are data rather than a TypeScript constant.

### Agent default — agent front matter

```yaml
audience_id: counsel
audience_prompt: >-
  The reader is a lawyer. Cite the clause and section for every position…
```

Both are stored. The id highlights the chip; the prompt is what is actually
injected. Storing only the id would silently discard the lawyer's edits the next
time the presets changed.

Empty `audience_prompt` means nothing is injected. That is the correct default
for a new agent — no audience is better than a wrong one.

## Injection

`ContextBuilder.build()` (`backend/app/agents/context.py`) currently emits:

```python
f"# Active agent: {agent.name}\n{agent.instructions}"
```

It gains an audience section immediately after, only when the prompt is
non-empty:

```python
f"# Written for\n{audience_prompt}"
```

It sits next to the agent's standing instruction, before the core context files,
so it frames the work rather than trailing it. It is a separate heading rather
than being concatenated into `instructions` so that the two stay independently
editable and independently visible in the UI.

## UI

Replaces the **Voice** block on `/agents`:

```
Written for
Who reads this. Choose a starting point, then say it in your own words.

[ Another lawyer ] [ An executive ] [ The product team ]
[ A partner or counterparty ] [ A regulator or auditor ] [ The record ]

┌──────────────────────────────────────────────────────────────┐
│ The reader is a lawyer. Cite the clause and section for      │
│ every position. Use the terms of art; do not gloss them…     │
└──────────────────────────────────────────────────────────────┘
```

- Chips use the existing `.btn.compact` / `.btn.compact.primary` pair — the
  selected chip is the primary.
- The field is `textarea.text-input.prose` (serif — it is prose the lawyer
  writes, not a control label).
- When the text matches no preset exactly, no chip is highlighted and the label
  reads **Written for · edited**.
- Empty field, nothing chosen: placeholder *"No audience set — the agent writes
  for the record by default."*

## Next increment — per-request override

Not in the first build. Recorded so the storage above does not have to change
when it lands.

- The matter composer gains the same chip row, collapsed behind a **Written
  for** link showing the current audience.
- **Ask Themis to redraft** (canvas `4c`) opens the same control, so redrafting
  *for a different reader* is one click — the single most common use of this
  feature.
- `ChatRequest` gains `audience_prompt: str = ""`. When non-empty it replaces
  the agent default for that call only, and nothing is written to disk.
- The chosen audience is recorded on the resulting draft's front matter as
  `written_for: executive`, so a document carries its intended reader.

## Not doing

- No automatic audience detection from the request text. Guessing the reader
  wrong is worse than not guessing.
- No per-audience output templates or section scaffolds. The prompt text is the
  whole mechanism; a template would fight the lawyer's edits.
- No tone/register control alongside this. Register is part of audience, and two
  controls that can disagree is the problem the Voice switch already had.
