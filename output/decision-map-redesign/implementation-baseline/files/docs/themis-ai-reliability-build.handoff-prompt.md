# New-context prompt — Themis.ai reliability build

You are the implementation coordinator for the Themis.ai reliability build in:

`/Users/bharris/Programs/counsel-os-mvp`

Work until the approved build is implemented, verified, independently reviewed, corrected, and rechecked. Do not stop after making another plan.

## Required agent pool

- Implementation workers: `gpt-5.6-sol`, `reasoning_effort: low`. This is the runtime equivalent of the user's requested **Sol Light** setting.
- Reviewer: one independent `gpt-5.6-sol`, `reasoning_effort: high`, read-only.
- Use one shared working tree.
- Keep at most three implementation workers active at once so the coordinator remains the fourth active slot.
- Workers must not spawn agents, commit, push, deploy, create worktrees, reset files, or edit outside assigned ownership.
- Do not use the High reviewer as an implementer. After correction workers finish, ask the same reviewer to recheck the accepted findings.

## Read first

Read these files before any code change:

- `AGENTS.md`
- `docs/PRD.md`
- `CODEX_HANDOFF.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/themis-ai-reliability-build.handoff-plan.md`
- `docs/themis-ai-reliability-build.handoff-progress.md`

The embedded work order below is self-contained. The plan file is the durable copy. The progress file controls resume state.

This prompt is a new user-approved work order. It supersedes any older `current.md` or `CODEX_HANDOFF.md` statement that no work remains, but it does not erase completed historical work.

## Goal

Make the existing MVP truthful and finishable. A lawyer must be able to move one matter from intake through research, a recorded decision, an editable canonical work product, approval, delivery recording, and closure without guessing whether the system saved anything or what work remains.

Use `Themis.ai` as the only visible system name. Remove visible `Counsel OS`, `CounselOS`, and the separate chatbot identity `Themis`. Stable technical identifiers may remain only for compatibility and must not appear as product copy.

## Approved scope

All items below are required. The `C` items are approved for this build, not optional backlog.

- `M1` Critical — Compare save/write/revise/record claims with successful tool traces. Preserve useful text but show a prominent unsupported-mutation failure above it.
- `M2` Critical — Use one canonical draft. Prevent loose root work products and prevent summaries from becoming the guided deliverable.
- `M3` Critical — Make `Being drafted → Ready to send → sent → Closed` reachable through the normal workflow.
- `M4` High — Make current required work, next action, ownership, Today state, and work-item completion truthful.
- `M5` Critical — Make research status, provenance, titles, source classes, and research stage truthful while preserving best-effort analysis.
- `M6` High — Protect decision integrity with meaningful draft fields, removable evidence, and correct human/generated provenance.
- `M7` High — Show durable decisions in the register, matter records, Recent activity, revisit date, reload, and concurrent index rebuilds.
- `M8` High — Preserve sent messages and drafts. Add immediate echo, safe history merge, error restoration, and honest elapsed state.
- `M9` High — Protect company-profile replacement, merging, and settled-question state.
- `M10` High — Make answered intake questions durable and inert, with accessible qualified answers.
- `M11` High — Attribute human edits to the configured lawyer and prevent internal paths/IDs from leaking into ordinary output.
- `C1` Medium — Let the lawyer set risk simply, or hide it while unset. Do not infer or color-code legal risk.
- `C2` Medium — Make `Draft work product` start a visible run or clearly prepare and focus an unsent request.
- `C3` Medium — Default document navigation to the current draft, retain stable Facts and Issue map links, and never default to `matter.md`.
- `C4` Medium — Preserve the composer across Overview/Chat switches and remove collapsed controls from the accessibility tree. **Keep Overview and Chat mutually exclusive. Do not show both when space permits.**
- `C5` Medium — Use one simple company review/save path with honest state, visible existing profile, and usable field sizing.
- `C6` Medium — Add manual `New draft` and `Save as work product` recovery paths.
- `C7` Medium — Add optional structured `Conditions` and `Not decided` decision fields. Do not add an approval engine.
- `C8` Medium — Add useful elapsed/transcript feedback. No fake phase, percentage, ETA, or cancel claim.
- `C9` Medium — Make `Themis.ai` the whole system name. Remove visible `Counsel OS`, `CounselOS`, and the standalone chatbot `Themis`.
- `C10` Medium — Keep core record links stable, synchronize research titles, define a non-regressing contents count, and remove punctuation-only review cards.

## Fixed product decisions

1. Markdown remains authoritative. SQLite remains a disposable index.
2. Keep the local single-user MVP. Do not add auth, queues, embeddings, cloud tenancy, verifier agents, multi-agent voting, confidence gates, or legal-answer refusals.
3. Models may analyze and draft. Deterministic services own paths, mutations, lifecycle changes, and records.
4. Missing sources do not block a useful answer. Clearly separate external authority, supplied sources, internal support, assumptions, and generated analysis.
5. Keep recommendations separate from recorded decisions.
6. `Mark sent` records delivery outside the system. It sends nothing.
7. Keep Overview and Chat mutually exclusive. Draft survival and correct hidden state are required.
8. Risk is lawyer-set metadata. Vermilion means failure or overdue, never high legal risk.
9. `Themis.ai` is the system. Generated output can say `Themis.ai · Not reviewed`, but there is no person-like chatbot named `Themis`.
10. Keep stable internal compatibility values where needed: repository path, `.counsel_os_cache.db`, `outside_counsel_os`, and `agent_id: counsel-copilot`. Use display aliases and read-old/write-new migration for legacy `Themis` authors or old local-storage keys. Do not expose old names.
11. Do not rewrite historical experiment reports or old handoff plans only for branding. Update the live product, shipped vault/templates, tests, README, and active product/acceptance documents.

## Resume protocol

1. Open `docs/themis-ai-reliability-build.handoff-progress.md`.
2. Do not redo a completed step unless its stated check fails now.
3. Before each wave, record `git status --short` and preserve every existing change.
4. After each worker stops, compare its changed files with its ownership. Reject out-of-scope edits.
5. Inspect the diff and rerun the check yourself. A worker report is not proof.
6. Mark the progress line immediately after acceptance. On failure, append `FAILED: <evidence>` before diagnosis.

## Known baseline

At plan creation on 2026-08-31:

- Branch `main`, commit `13f8db7 Update Counsel OS implementation and project artifacts`.
- The worktree was clean.
- Backend `.venv/bin/python -m pytest -q`: 501 passed, 1 warning.
- Frontend `npm run typecheck && npm run build`: passed.
- `npm run check:workspace-ux`: failed only at a brittle source-shape assertion named `Review intake must open the original request`. Verify the real action first. If it opens `request.md`, repair the assertion rather than inventing a product fix.

## Step 0 — Preflight and diagnosis

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "Where do matter state, work-product lifecycle, chat mutations, research provenance, decisions, company interview state, document review authorship, and visible product naming flow?" --budget 8000
```

Before dispatch, perform read-only diagnosis and write the result in the progress file:

- Test the existing finalize endpoint with a valid draft in an isolated vault.
- Confirm when `chat_runs.py` persists the user turn.
- Test Home/End and selection by hand in a visible real browser. Do not change Lexical if a human cannot reproduce the issue.
- Locate the Matter materials render and define the contents count before changing either.
- Find why a research agent can be pinned to `mock`. Do not override an explicit user selection.
- Reproduce the concurrent index rebuild race deterministically before changing index logic.

A corrected cause may change implementation details. It does not remove an approved user-visible outcome.

## Step 1 — One Sol Light foundation worker

Run alone.

Write only:

```text
backend/app/models/api.py
backend/app/services/matter_state.py
backend/app/services/matters.py
backend/app/routers/matters.py
backend/tests/test_matter_state.py
backend/tests/test_matters.py
backend/tests/test_matter_records.py
frontend/lib/types.ts
frontend/lib/api.ts
frontend/lib/design.ts
frontend/lib/briefing.ts
```

Implement the minimum shared contracts for unsupported-mutation evidence, identified open work/questions, risk updates, decision conditions/not-decided, research truth, and lifecycle results. Complete or neutralize the generic orientation item after intake. Prefer real current work over `Orient to the request`. Map the configured single lawyer to `you`. Return work-item IDs and allow exact completion. Sort Recent activity by metadata timestamp and use human titles. Add simple persisted lawyer-set risk. Do not create a new state service.

Check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_matter_records.py tests/test_matter_action_api.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

Freeze shared contracts after acceptance.

## Step 2 — Wave 1, three parallel Sol Light workers

### Worker 2A — Chat truth and transport

Write only:

```text
backend/app/agents/runner.py
backend/app/services/chat_runs.py
backend/app/services/chat_history.py
backend/app/routers/chat.py
backend/app/providers/openai_compatible.py  # only if diagnosis proves parsing defect
backend/tests/test_agents.py
backend/tests/test_chat_runs.py
backend/tests/test_chat_history.py
backend/tests/test_openai_compatible_provider.py  # only if needed
frontend/components/ChatPanel.tsx
frontend/components/ChatCards.tsx
frontend/lib/chatRunLogic.ts
frontend/lib/chatCardLogic.ts
frontend/scripts/check-chat-run-recovery.ts
frontend/scripts/check-transport-preservation.ts
vault/00_System/agents/counsel-copilot.md
backend/tests/fixtures/vault/00_System/agents/counsel-copilot.md
```

Implement:

- Structured unsupported-mutation evidence when prose claims persistence without a matching successful mutation. Keep the full answer. Show `Not saved` or `No file changed` above it.
- Trace authority with narrow phrase fallback. Ordinary advice must not get a mutation notice.
- Immediate user echo, duplicate-safe merge, composer restoration on error, and draft survival across Overview/Chat unmount.
- Honest elapsed state and `Stop showing progress`; server work continues. No fake phase, percentage, ETA, or cancellation.
- Durable inert answered cards with chosen answer, qualifier, real radios, checked state, accessible labels, and only one active current question.
- `Save as work product` on a useful assistant answer through the canonical typed API.
- Strong prompt rules against internal paths and unsupported save claims. No verifier.

Check backend chat/agent tests, `check-chat-run-recovery.ts`, `check-transport-preservation.ts`, and typecheck.

### Worker 2B — Research truth

Write only:

```text
backend/app/services/research.py
backend/app/services/research_runs.py
backend/app/providers/factory.py
backend/app/providers/mock.py
backend/tests/test_research.py
backend/tests/test_intelligence_providers.py
frontend/lib/research.ts
frontend/app/agents/page.tsx
frontend/app/matters/[matterId]/research/page.tsx
vault/00_System/agents/research-agent.md
backend/tests/fixtures/vault/00_System/agents/research-agent.md
```

Implement:

- Visible explicit per-agent provider selection and a warning for `mock` override against a live workspace. Do not silently change an explicit selection.
- No mock/provider scaffold in durable substantive research.
- Preserve useful analysis when public retrieval or formatting fails.
- Matter-visible public-leg status. Separate external authority, supplied sources, and internal support. Exclude chat runs, duplicate dossier snapshots, and self-citation.
- A truthful partial/failed-public-leg state instead of false full success. Do not create a misleading required review item.
- Distinct short question-based packet titles with saved-question fallback for old packets.
- Enter `research` while eligible research runs and move to the correct next stage on completion without moving later stages backward.

Check `test_research.py`, intelligence provider/security tests, matter-record tests, and typecheck.

### Worker 2C — Decision integrity

Write only:

```text
backend/app/services/decisions.py
backend/app/routers/decisions.py
backend/app/services/index.py
backend/tests/test_decisions.py
frontend/components/RecordDecisionModal.tsx
frontend/components/DecisionTable.tsx
frontend/app/decisions/page.tsx
```

Implement:

- Decision seed from saved recommendation. No queue-count rationale.
- Generated provenance tied to unchanged generated text. Remove that label when the lawyer edits.
- Readable removable basis items and visible failed-public-research state.
- Optional structured Conditions and Not decided fields.
- Revisit date in register and matter view.
- Index change only for a reproduced race. Markdown remains authoritative.
- Submit ends in confirmed recorded state or a specific visible error, never ambiguous closure.

Check decision/index tests and typecheck.

## Step 3 — Wave 1 gate

Wait for all workers. Inspect ownership and diffs. Rerun every focused check. Then run the combined agent/chat/research/decision/matter tests and frontend typecheck. Update progress only after acceptance.

## Step 4 — Wave 2, three parallel Sol Light workers

### Worker 4A — Canonical work product and lifecycle

Earlier shared-file owners have stopped. Ownership transfers for these files:

```text
backend/app/services/work_product.py
backend/app/tools/handlers.py
backend/app/services/matters.py
backend/app/routers/matters.py
backend/tests/test_work_product.py
backend/tests/test_matter_lifecycle.py
backend/tests/test_matter_action_api.py
backend/tests/test_matter_action_tools.py
vault/00_System/tools/save_work_product.md
backend/tests/fixtures/vault/00_System/tools/save_work_product.md
```

Implement:

- Reject generic writes to root `work-product.md` and configured draft/final locations.
- Typed draft save receives the deliverable, creates or revises one canonical draft, and never stores a description as the deliverable.
- Read-only legacy fallback for existing root work product without creating new loose files.
- Finalize only the valid canonical draft. Final content matches reviewed content and moves `generate` to `respond` once.
- Approval binds one final artifact. Delivery records the same artifact outside the system. Closure requires delivery and no required open work. Retries are idempotent.
- Every mutation returns persisted state and changed paths.

Check work-product, lifecycle, action API/tool, and matter tests.

### Worker 4B — Company integrity and setup

Write only:

```text
backend/app/services/company.py
backend/app/services/company_interview.py
backend/app/routers/settings.py
backend/tests/test_company_interview.py
frontend/components/CompanyInterview.tsx
frontend/app/settings/page.tsx
```

Implement:

- Existing profile with version/save time and explicit Start again.
- Confirmation naming both companies before replacement, plus stale-version protection.
- Merge distinct later facts into populated fields. Do not overwrite licensing with a separate card fact.
- Mark settled topics and do not re-ask unless explicitly reopened or corrected.
- One review/edit/save path, `No unsaved changes` before save, no duplicate save controls.
- Review fields sized for long legal prose.

Check company interview tests and typecheck.

### Worker 4C — Human authorship and review noise

Write only:

```text
backend/app/services/document_review.py
backend/tests/test_document_review.py
backend/tests/test_document_review_docx.py
frontend/components/DocumentPanel.tsx
frontend/components/DocumentReview.tsx
frontend/components/MarkdownRichEditor.tsx
frontend/components/RevisionPlugin.tsx
frontend/components/RevisionTextNode.tsx
frontend/lib/reviewAuthor.ts
```

Implement:

- Configured lawyer is a direct author option and the default for direct human edits unless the user selects generated authorship.
- Legacy author `Themis` displays as `Themis.ai` without data loss.
- Filter whitespace-only, separator-only, and punctuation-only review segments while keeping substantive changes.
- Change editor keyboard code only if the visible human-browser diagnosis reproduced the issue.

Check document-review backend tests and typecheck.

## Step 5 — Wave 2 gate

Wait for all workers. Inspect ownership and diffs. Rerun focused checks. Run the full backend suite. Do not start frontend integration until it passes.

## Step 6 — One Sol Light workspace integration worker

Earlier frontend owners have stopped. Write only:

```text
frontend/components/MatterWorkspace.tsx
frontend/components/MatterTree.tsx
frontend/components/NewMatterForm.tsx
frontend/components/ChatPanel.tsx  # accepted API integration only
frontend/components/ChatCards.tsx  # canonical work-product integration only
frontend/lib/matterBrief.ts
frontend/lib/matterActions.ts
frontend/app/globals.css
frontend/scripts/check-matter-brief.ts
frontend/scripts/check-workspace-ux.ts
```

Implement:

- Real required work and exact completion on Overview.
- Simple persisted risk control or hidden unset risk.
- Overview and Chat remain mutually exclusive. Draft survives switching. Collapsed controls leave the accessibility tree and toggles have names.
- Honest Draft work product behavior.
- Document pane defaults to canonical draft or artifact chooser, never `matter.md`.
- Visible Overview Finalize with exact success/failure, followed by durable approve, mark sent, and close actions.
- Stable Facts, Issue map, Recommendation, research, draft, and final links. Research cannot replace core links.
- Recorded decisions in the matter's own artifacts, with decision activity still visible after reload.
- Manual New draft through canonical API.
- Contents count means current user-facing document nodes after operational records are filtered. Use one pure helper everywhere.
- Research title is consistent in tree, Overview, document header, and decision evidence.
- Create button clearly says it creates a matter and opens Chat.
- Repair the stale Review intake check only after proving it opens `request.md`.

Run matter-brief check, full workspace check, typecheck, and build.

## Step 7 — One Sol Light Themis.ai naming worker

Run alone after all feature workers stop.

Inventory:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
rg -n -i 'counsel[ ._-]*os|counselos|themis\.ai|\bthemis\b' \
  frontend backend/app vault/00_System backend/tests/fixtures/vault/00_System \
  README.md CLAUDE.md CODEX_HANDOFF.md current.md decisions.md \
  docs/PRD.md docs/DESIGN_LANGUAGE.md docs/ARCHITECTURE.md \
  docs/ACCEPTANCE_TESTS.md docs/END_TO_END_TEST_KIT.md
```

The worker may edit only files in this inventory plus tests directly coupled to changed strings.

Implement:

- Browser title, shell, settings, empty states, status copy, generated labels, prompts, authors, active docs, shipped vault/templates, and tests use `Themis.ai`.
- No standalone person/chatbot `Themis`. Chat is `Chat` or `Ask Themis.ai`. Generated output may be `Themis.ai · Not reviewed`.
- No visible `Counsel OS` or `CounselOS`.
- Preserve stable technical IDs and support legacy values at presentation or migration boundaries.
- Do not rename the repository, `.counsel_os_cache.db`, `outside_counsel_os`, or stable agent ID solely for branding.
- Do not restyle old historical reports or handoff plans.

Run a negative search with `rg -P -i 'counsel[ ._-]*os|counselos|\bthemis\b(?!\.ai)'` over the same live-product and active-doc scope. Record every remaining approved technical or compatibility exception in the progress file. A visible copy match is not an exception.

Then run full backend and frontend checks.

## Step 8 — Full verification and browser acceptance

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
npm run typecheck
npm run build
cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
git status --short
```

Use a copied temporary vault and hash the repository vault before and after. It must not change.

Walk this browser proof:

1. Create a matter from a long request.
2. Answer one material question with a qualifier; confirm the card becomes inert and durable.
3. Run research; see active research stage and truthful no-external-authority state with useful analysis and distinct titles.
4. Confirm Today, Overview, Matters, required work, next action, and owner agree.
5. Save a canonical draft; confirm all guided surfaces target that exact document.
6. Force an unsupported mutation claim; see a prominent no-change failure above the preserved answer.
7. Switch Overview/Chat; confirm mutual exclusion, draft survival, and no hidden interactive controls.
8. Exercise manual New draft and Save as work product recovery.
9. Record a decision with removable basis, conditions, not-decided text, lawyer author, and revisit date. See it first in Recent activity and in the register.
10. Finalize, approve, record external delivery, complete required work, close, and reload.
11. Confirm the tab, shell, Chat, settings, labels, and active help use only `Themis.ai`, with no separate chatbot identity.

Browser order: in-app browser first; Chrome second if needed; Safari through computer control last. Record browser-tool failures separately from product failures. A hidden or zero-geometry browser pane is not product evidence.

## Step 9 — One read-only Sol High review

Dispatch one `gpt-5.6-sol` worker with `reasoning_effort: high`. Give it the full scope, diff, progress, and verification results. It must inspect code and tests directly.

It must answer:

- Is every M1–M11 and C1–C10 outcome implemented and proven?
- Can prose still claim an unsupported mutation?
- Can the workflow approve, deliver, or close the wrong artifact?
- Can Today, Overview, Matters, research, decisions, or activity disagree after reload?
- Can failed research look sourced or fully successful?
- Can human text be attributed to generated output?
- Can settled intake/company questions become live again without explicit reopen?
- Are Overview and Chat mutually exclusive while drafts survive?
- Is visible `Counsel OS`, `CounselOS`, or standalone chatbot `Themis` left?
- Did the build add speculative machinery, a legal-answer gate, or a compatibility break?

The reviewer is read-only. Each finding needs severity, evidence, file/symbol, expected behavior, and smallest correction. It must state explicitly when there is no material finding.

## Step 10 — Corrections and completion

- Send each accepted review finding to a narrow Sol Light correction worker.
- Run focused and full checks.
- Ask the same Sol High reviewer to recheck the corrected findings.
- Update the progress file after each accepted result.
- Reconcile `current.md`, `CODEX_HANDOFF.md`, active acceptance docs, and implementation status only after proof.
- Do not mark complete with an unverified scope item.
- Do not commit or push unless the user asks.

## Do not build

- Side-by-side Overview and Chat or an auto-open-both rule.
- External connectors, outbound sending, auth, cloud tenancy, collaboration, queues, embeddings, Tauri, or a plugin marketplace.
- More research providers.
- Citation gates, mandatory verifier agents, confidence thresholds, legal-perfection gates, or generic disclaimers.
- Broad visual redesign unrelated to M1–M11 or C1–C10.
- A global rewrite of stable technical identifiers or historical reports solely for branding.

Start now at the first pending line in `docs/themis-ai-reliability-build.handoff-progress.md`.
