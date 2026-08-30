# Counsel OS attention-audit implementation plan

## 1. Result

This build makes the product easier to scan and safer to use.

The matter remains the root work container. The dossier remains an optional, editable summary of that matter. The left pane becomes narrower. Generated and structured files move under a collapsed **Matter Records** group with clear human names. The product keeps every Markdown file and keeps `matter.md` as the default agent context.

The build also fixes the audit issues in the decision path, attention language, tables, research, automations, settings, agents, skills, dates, names, and responsive layout.

One Sol Medium coordinator/reviewer will manage up to three Sol Light implementers at one time. All agents will use the same working tree. The coordinator will review every chunk and the combined result.

## 2. Product model

### Matter and dossier

- A **matter** is the full work container. Identity, ownership, stage, risk, dates, work, decisions, research, chat, files, and events attach to it.
- `matter.md` remains the root matter record and the default active context sent to the agent.
- A **dossier** is an optional summary of the matter. It can improve orientation when present. It does not replace the matter.
- The overview may use dossier summary fields when a dossier exists. It must fall back to matter, request, work-item, and orientation data when no dossier exists.
- Do not create a dossier only to support this interface change.
- Do not change dossier revision or hash-protection behavior.

### Matter contents

The first level of the left pane shows the items that a lawyer is most likely to choose directly:

- Original request
- Documents
- Chats
- Research
- Work product
- Dossier, only when it exists
- Legacy Drafts, only when it exists

The pane also shows one collapsed virtual group named **Matter Records**. This is a front-end grouping only. It does not move or rename vault files.

The group helper text is:

> Structured records captured from intake, documents, chat, lawyer edits, and system actions.

Use these labels:

| Vault path | Visible label | Meaning |
| --- | --- | --- |
| `matter.md` | Matter details | Identity, owner, stage, dates, risk, and next action |
| `facts.md` | Facts, sources & assumptions | Statements captured from intake, documents, chat, and lawyer edits |
| `issues.md` | Issue map | Legal and operational questions |
| `participants.md` | People & roles | Participants, owners, and decision-makers |
| `recommendations.md` | Working recommendations | Proposed paths that are not recorded decisions |
| `work-items/` | Work to do | Tasks, owners, due dates, and state |
| `decisions/` | Recorded decisions | Explicit durable decisions |
| `events/` | Activity history | System and user actions recorded for the matter |
| `dossier-revisions/` | Dossier revisions | Prior dossier versions |

Do not label all facts as “extracted.” Facts can come from more than extraction. Show source or action provenance only where the current data supports it. Do not invent a common provenance field for this build.

### Initial workspace layout

- Keep the tree resizable.
- Change the initial tree weight from `0.55` to `0.24`.
- Keep a 210-pixel minimum. At 1280 pixels wide, with the document pane collapsed, the tree should render between 210 and 250 pixels.
- Keep `activePath` on `matter.md` when no route requests a file. This preserves agent context.
- Set `treeActivePath` to `null` when no route requests a file. A hidden file must not look selected.
- A file or research route selects the requested item and opens the document pane.

## 3. Decision-record integrity

- Show a generated recommendation as **Themis · Not reviewed**.
- Use the full dashed iris treatment on the full assistant block. Do not use a small decorative mark as the only signal.
- The primary decision action opens the record modal directly. Remove the extra focused-review click.
- The modal may prefill a clearly labelled **Themis draft**.
- The lawyer can edit the proposed decision before recording it.
- The modal must show an editable rationale field. It may start with `detail.orientation.why_now`, but it must never record that value without showing it.
- Default the decider only from `detail.legal_owner`. Do not add a hard-coded person.
- Require the decision and decider before submit. Rationale can remain optional.
- Opening or cancelling the modal writes nothing.
- Only the final explicit record action calls `createDecision()`.
- Recommendations remain separate from recorded decisions.

## 4. Audit resolution

| # | Audit point | Resolution |
| --- | --- | --- |
| 1 | Agent messages do not look different | Agree. Style the full agent block and label it `Themis · Not reviewed`. |
| 2 | Decision text is prefilled | Partly agree. Keep the useful draft, name its source, make it editable, and require explicit record. |
| 3 | Four next actions compete | Agree. Show one primary next action. Put secondary tools and history behind clear disclosures. |
| 4 | Decision recording takes two setup clicks | Agree. The primary action opens the modal directly. |
| 5 | Tables are small and pale | Agree. Use at least 15-pixel body text, stronger contrast, wrapping text, and responsive rows. |
| 6 | Decision review terms differ | Agree. Use `Needs review` everywhere. |
| 7 | `0 decisions still current` is awkward | Agree. Use `N recorded · N need review`; omit zero-value claims where they add no value. |
| 8 | A paused monitor looks like a decision warning | Partly agree. Keep decision status factual. Add a real schedule resume action on Automations. |
| 9 | `Nothing owed` is unclear | Agree. Use `No action needed` or `Waiting on <name>` as supported by state. |
| 10 | Raw file names are hard to understand | Agree. Use human labels and the Matter Records group. Keep raw paths in advanced/file details. |
| 11 | A raw prompt in Skills is wrong | Disagree. The user asked for the prompt. Preserve it, with a plain-language label. |
| 12 | Raw model choice is too technical | Partly agree. Show the current selection simply. Keep the real catalog under Advanced. Do not invent profiles. |
| 13 | Agent prompt editing is too technical | Partly agree. Show name and purpose first. Put standing Markdown instructions and permissions under Advanced. |
| 14 | Skills, Agents, and Automations should merge | Disagree. They are different objects. Improve their explanations and links, but keep separate screens. |
| 15 | Matter controls compete | Agree. Keep one primary action. Move trace, history, file details, and secondary tools out of the first reading path. |
| 16 | Scope mixes owner, area, and risk | Agree. Use separate Owner, Area, and Risk filters. |
| 17 | Timeline is weak | Agree. Remove the Timeline view and its component. Keep Table as default and Stages as the alternate view. |
| 18 | Research says no sources and unreviewed | Partly agree. State missing cited sources once. Remove `unreviewed` until a real review state exists. |
| 19 | Skills feels sparse | Partly agree. Add a useful definition, examples, and a clear saved-skill summary. Do not add a new system. |
| 20 | Risk is not explained | Partly agree. Keep real risk metadata, explain it in one line, and show `Not assessed` for missing/unknown. |
| 21 | Buttons use inconsistent words | Agree. Use stable verb-object labels such as `Save changes`, `Run it now`, `Retry now`, and `Resume schedule`. |
| 22 | Closed matters still show a next action | Agree. Closed matters show `Closed` and no active action. |
| 23 | Decision counts invent status words | Agree. Use only `Recorded` and `Needs review`. |
| 24 | Some copy uses metaphors | Agree. Replace metaphorical operational copy with direct words. |
| 25 | Copy has grammar errors | Agree. Correct the cited strings and review adjacent copy. |
| 26 | Names and dates vary | Agree. Show full names and dates with a year. Use one `en-US` format family. |
| 27 | Native controls look generic | Disagree with custom replacements. Keep accessible native controls and apply existing tokens only. |
| 28 | Values are duplicated or broken | Agree. Deduplicate values and render missing data once with an honest label. |
| 29 | Some numbers and icons lack labels | Partly agree. Add short labels or accessible names. Do not add decorative text. |
| 30 | Wide screens drift | Agree. Use a shared readable content width and align page footers with page content. |

## 5. Scope limits

Do not add:

- authentication, tenancy, queues, embeddings, or a plugin marketplace;
- a new dossier service or automatic dossier creation;
- a common provenance migration for every matter record;
- a legal review gate or confidence threshold;
- custom replacements for native select, checkbox, date, or number controls;
- a new research-review workflow;
- schedule edit, delete, dependency, or notification systems;
- a merged Skills/Agents/Automations object model;
- a new front-end test framework.

## 6. Agent policy

```yaml
parallel:
  optimize_for: balanced
  max_concurrent_implementers: 3
  implementers:
    name: Sol Light
    provider: codex
    model: gpt-5.6-sol
    effort: low
  coordinator:
    name: Sol Medium
    roles:
      - orchestrator
      - reviewer
    provider: codex
    model: gpt-5.6-sol
    effort: medium
  review:
    policy: coordinator-only
```

Rules:

- Use one shared working tree.
- Workers must not spawn agents.
- Workers must not commit, push, deploy, reformat unrelated files, or undo existing changes.
- Give each worker exact file ownership.
- The coordinator reviews every worker diff and all integration changes.
- Stop all front-end workers before type check or build. Next.js and TypeScript share generated state.
- Before each wave, snapshot every owned path outside the repository with `mktemp -d` and `rsync -aR`.
- Each worker returns its exact changed-file list and a short self-review.
- The coordinator compares each result with the snapshot because the working tree is already dirty.

## 7. Baseline

Observed on 2026-08-28:

- `frontend/npm run typecheck`: pass.
- `frontend/npm run build`: pass.
- Backend: 127 passed and three existing failures in `tests/test_annotations.py`.
- The three failures are caused by an existing annotation in the copied demo vault. They are outside this plan unless the implementation changes their count or failure shape.

The implementation must not claim a clean backend baseline. It must finish with no new backend failure.

## 8. Wave 1 — main lawyer workflow

Run these three Sol Light chunks in parallel.

### Chunk 1A — matter workspace and record integrity

Outcome: the lawyer gets a narrow, understandable matter pane, one clear action, an honest agent signal, and a safe decision modal.

Own only:

- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/lib/matterActions.ts`
- `frontend/app/globals.css`

Required work:

1. Implement the matter/dossier and Matter Records contracts in sections 2 and 3.
2. Keep the default agent `active_file` as `matter.md`. Do not change `ContextBuilder`.
3. Set initial tree weight to `0.24`; preserve the 210-pixel minimum and keyboard resizing.
4. Do not show `matter.md` as selected when no file was requested.
5. Show direct lawyer-facing files first. Put the exact record nodes under a collapsed virtual Matter Records group. Do not mutate `detail.tree` or vault paths.
6. Use human labels in the tree and overview. Keep raw paths only in file details or advanced copy.
7. Use one primary next action. Remove the separate focused-review state and open the decision modal from the decision action.
8. Implement the visible, editable rationale contract. Keep final submit explicit.
9. Style the full assistant answer as `Themis · Not reviewed`. Put trace after the answer in a closed `Actions taken (N)` disclosure.
10. Keep Focus answer and Restore workspace as local layout controls. They write no record.
11. Remove normal-surface storage paths from the document footer. Preserve raw Markdown and tracked-change behavior.
12. Update shared CSS for readable table text, contrast, responsive register rows, readable page widths, and footer alignment. Existing table class names are the cross-worker contract.
13. Keep all controls accessible. Do not create custom native-control replacements.

Worker check: self-review only. Do not run front-end checks while Chunks 1B and 1C are active.

### Chunk 1B — Today, Workspace, and Matters

Outcome: attention counts, matter state, filters, dates, and next actions use one clear language.

Own only:

- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTimeline.tsx` for deletion only
- `frontend/components/NewMatterForm.tsx` only if its visible risk copy needs the shared definition

Required work:

1. Keep Today's broad attention count, but state its scope. Workspace states how many matters need judgment. Do not imply that these totals must match.
2. Replace `decisions still current` and `flagged` with `recorded` and `need review`.
3. Replace `Nothing owed` with state-based plain language.
4. Give closed matters no active next action. Show `Closed` where a label is necessary.
5. Add shared `en-US` date helpers. Full dates include the year. Keep ISO values in records and traces.
6. Use full names. Do not shorten a person to a first name in a table.
7. Make Table the default. Keep Stages. Remove the Timeline option, import, render path, and component.
8. Split filters into Owner, Area, and Risk. Keep active-filter text and Clear filters.
9. Keep risk metadata. Add one short definition. Show missing or `unknown` as `Not assessed`. Do not use failure red for high risk.
10. Sort open overdue and soonest-due matters first, then open matters with no date, then closed matters.
11. Correct the cited grammar and review adjacent visible copy.
12. Label standalone counts and icons. Do not add repeated labels to every row.

Worker check: self-review only. Do not run front-end checks while other front-end chunks are active.

### Chunk 1C — decisions and research

Outcome: recorded decisions and research notes are readable and use only states that the product has.

Own only:

- `frontend/app/decisions/page.tsx`
- `frontend/components/DecisionTable.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`

Required work:

1. Use `Recorded` and `Needs review` only. Change `Recheck against sources` to `Check sources again`.
2. Show real matter titles with an honest matter-ID fallback.
3. Show full decision-maker names and full visible dates with a year.
4. Show complete review reasons as wrapping text.
5. State the recommendation-versus-recorded-decision rule once.
6. Remove `unreviewed` from research. There is no review-state field.
7. If there are no citations, say `No cited sources` once. Do not repeat the same empty state in the body and rail.
8. Use human source/file labels. Keep raw paths in source details when useful.
9. Render research answers with the existing Markdown renderer. Do not enable raw HTML.
10. Use the date helpers owned by Chunk 1B. Do not edit `frontend/lib/design.ts`.

Worker check: self-review only. Do not run front-end checks while other front-end chunks are active.

### Wave 1 gate — Sol Medium coordinator/reviewer

1. Confirm every changed path is inside its owner list.
2. Review the complete diff for the matter/dossier model, default agent context, and decision rationale integrity.
3. Verify the Matter Records group contains each mapped node once and preserves all other nodes.
4. Verify that one agent block has one visible generated-content signal.
5. Resolve only integration seams, including shared date helpers and CSS class contracts.
6. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
npm run build
```

Do not start Wave 2 until both pass.

## 9. Wave 2 — lifecycle and administration

Run these three Sol Light chunks in parallel.

### Chunk 2D — automation lifecycle

Outcome: a paused schedule can resume. Buttons say exactly what they do.

Own only:

- `backend/app/models/api.py`
- `backend/app/routers/automations.py`
- `backend/app/services/scheduler.py`
- `backend/tests/test_scheduler.py`
- `backend/tests/test_automations_api.py`
- `frontend/lib/api.ts`
- `frontend/lib/types.ts`
- `frontend/components/AutomationPanel.tsx`
- `frontend/app/automations/page.tsx`

Required work:

1. Add `ScheduleUpdate` with one field: `enabled: bool`.
2. Add `PATCH /api/automations/schedules/{schedule_id}`.
3. Add one scheduler service method that edits the existing schedule Markdown and rebuilds the index.
4. When enabling, set `next_run_at` to now plus the saved interval. Do not trigger an immediate surprise run.
5. When disabling, preserve last-run state and stored interval.
6. Return 404 for a missing schedule.
7. Add a typed front-end update call.
8. Active schedules show `Pause schedule` and `Run it now`. Paused schedules show `Resume schedule` and `Run it now`. Failed runs use `Retry now` for the manual run action.
9. Do not add edit, delete, reconnect, dependency, notification, or bulk controls.
10. Add focused service and API tests for pause, resume, future `next_run_at`, preserved state, and missing ID.

Focused worker check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest tests/test_scheduler.py tests/test_automations_api.py
```

### Chunk 2E — Settings, Agents, and Skills

Outcome: each screen explains its object in plain language and puts technical detail behind Advanced.

Own only:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/agents/page.tsx`
- `frontend/app/skills/page.tsx`
- `frontend/components/SkillBuilder.tsx`

Required work:

1. Settings shows a simple current model summary. Keep provider, exact model, and reasoning effort under `Advanced model options`.
2. Keep the real model catalog. Do not invent Fast, Balanced, or Careful mappings.
3. Preserve hidden saved keys. Do not change backend settings storage.
4. Agents shows name, role, and purpose first. Put standing Markdown instructions, tool permissions, and file paths under `Advanced controls`.
5. Keep `counsel-copilot` as the stable ID. Show Themis as the name and Counsel Copilot as the role.
6. Keep Skills, Agents, and Automations separate. Add short cross-links only where useful.
7. Skills explains: `A skill is reusable guidance for one chat request.` Show one primary build action and one secondary repeated-work action.
8. After save, show the skill name, what it does, and how to use it. Keep the requested raw prompt available under a clear label or Advanced details.
9. Use stable save labels. The button stays `Save changes` or `Save agent`; show `Saved` as nearby status, not as a disabled button label.
10. Keep native controls and current data formats.

Worker check: self-review only. Do not run front-end checks while Chunk 2D is active.

### Chunk 2F — acceptance and product documents

Outcome: repository guidance matches the accepted product behavior and gives the coordinator a precise browser walk.

Own only:

- `docs/ACCEPTANCE_TESTS.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/IMPLEMENTATION_STATUS.md`

Required work:

1. Add acceptance steps for the product model, Matter Records mapping, narrow initial tree, hidden tree selection, and preserved default agent context.
2. Add acceptance steps for visible rationale, explicit decision submit, full agent styling, table readability, status terms, schedule resume, settings Advanced controls, and research empty states.
3. State that Matter is the work container and Dossier is an optional summary.
4. State that recommendations are not decisions and provenance is shown only when supported.
5. Do not record observed pass results. The coordinator records those after the final walk.
6. Keep historical acceptance notes intact.

### Wave 2 gate — Sol Medium coordinator/reviewer

1. Review each worker diff against ownership and the product contract.
2. Confirm the schedule endpoint changes only `enabled` and calculated `next_run_at`.
3. Confirm hidden settings are preserved and native controls remain accessible.
4. Run front-end type check and build.
5. Run the focused automation tests.
6. Fix only integration defects.

## 10. Final integration and verification

The Sol Medium coordinator/reviewer owns this serial step.

1. Run the full checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
```

2. Accept the backend run only if the same three baseline annotation tests fail and no new test fails. Report the baseline debt clearly.
3. Use a copied temporary vault for browser checks. Do not mutate the user's main vault.
4. Walk the updated acceptance tests at 1280×720, 1024 pixels wide, and 768 pixels wide.
5. At 1280×720, confirm the open tree is 210–250 pixels before manual resizing.
6. With no `file` query, confirm no hidden Matter Records node appears selected, while a new chat still sends `matter.md` as the active file.
7. Confirm the Dossier entry appears only on matters that have `dossier.md`. Confirm matters without a dossier still have a complete overview.
8. Confirm all Matter Records nodes open the original vault path and no file is lost or duplicated.
9. Confirm the decision modal shows the prefilled decision, editable rationale, and decider before record.
10. Confirm cancel writes no decision. Confirm final record writes one decision.
11. Confirm a paused schedule resumes and gets a future `next_run_at`.
12. Confirm there are no browser console errors and keyboard access works for disclosures, pane controls, and native inputs.
13. Add dated observed results to `docs/ACCEPTANCE_TESTS.md` only after the walk.

## 11. Completion test

The work is complete only when:

- the matter remains the root record;
- the dossier remains optional;
- the left pane is narrow and understandable;
- all structured files remain reachable under Matter Records;
- default agent context still uses `matter.md`;
- generated analysis is visibly marked;
- decision rationale is visible before it is stored;
- only one primary action competes for attention;
- decision status language is consistent;
- paused schedules can resume;
- tables, dates, names, copy, and wide layouts pass the browser walk;
- no new backend failure exists;
- front-end type check and build pass;
- graphify is current;
- all user changes outside this plan remain intact.

