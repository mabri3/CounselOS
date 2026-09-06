# Themis.ai reliability build plan

## Thesis

Make the existing MVP truthful and finishable. A product lawyer must be able to move one matter from intake through research, a recorded decision, an editable canonical work product, approval, delivery recording, and closure without guessing whether the system saved anything or what work remains.

This build includes every accepted must-fix item `M1` through `M11` and every accepted conditional item `C1` through `C10`. The conditional items are approved scope for this build, not parked ideas.

Use `Themis.ai` as the only visible system name. Remove visible `Counsel OS`, `CounselOS`, and the separate chatbot identity `Themis`. Stable technical identifiers may remain when changing them would break stored data or APIs, but they must not appear as product copy.

## Payoff moment

A lawyer asks the system to draft and save a response. The system either changes the canonical draft and shows the saved artifact, or clearly says that no file changed while preserving the useful text. The lawyer reviews that same document, records a decision with its conditions and review date, finalizes the response, records delivery, and closes the matter. After reload, the matter shows the same document, decision, current required work, next action, research state, and activity history.

## Demo script

1. Create a matter with a long request. The create button clearly says that it creates a matter.
2. Answer the one material intake question with a qualified free-text answer. The card becomes a durable, inert `Answered` record.
3. Start research. While it runs, the matter is visibly `Being researched`. When public research is unavailable, keep the useful analysis and say plainly that no external authority was retrieved.
4. Confirm that research packets have distinct question-based titles and do not cite chat runs, duplicate dossier snapshots, mock text, `.env`, or the packet itself as legal support.
5. Confirm that Today, the matter header, Overview, and Matters list agree on required work, next action, and who must act. Nothing says `Orient to the request` after orientation is complete.
6. Ask Chat to draft and save a response. Confirm that the canonical draft contains the deliverable, not a summary of it, and that no loose root `work-product.md` is created.
7. Force one rejected or missing mutation. Confirm that a prominent failure notice appears above the full useful answer and says that no file changed.
8. Switch between Overview and Chat. Keep them mutually exclusive. Confirm that an unsent composer draft survives and hidden controls are absent from the accessibility tree.
9. Review the draft. Confirm that the current draft, Review action, document pane, and Finalize action all target the same file. Use the manual create and `Save as work product` recovery paths once.
10. Record a decision. Remove an unsuitable basis document. Add conditions and `Not decided` text. Use the configured lawyer as the author. Confirm the revisit date appears in the register and the event appears first in Recent activity.
11. Finalize the draft from Overview, approve the final artifact, record that it was sent outside the system, complete required work, and close the matter.
12. Reload and confirm all durable state. The tab, shell, generated-output labels, settings, prompts, and active help text use only `Themis.ai` as the system name. There is no separate chatbot persona.

## Build

### Fixed scope and traceability

| ID | Severity | Required outcome | Source findings |
|---|---|---|---|
| M1 | Critical | Reconcile save, write, revise, and record claims against successful tool traces. Preserve useful model text, but put a clear failure notice above any unsupported mutation claim. | B1 |
| M2 | Critical | Use one canonical work-product draft. Prevent loose root work products and prevent summaries from becoming the guided deliverable. | B3, F15 |
| M3 | Critical | Make `Being drafted → Ready to send → sent → Closed` reachable from the normal matter workflow with visible success and error states. | B2 |
| M4 | High | Make current required work, next action, ownership, and Today state truthful. Complete orientation work and let real work items close. | F1, F16 |
| M5 | Critical | Make research status, provenance, titles, source classes, and stage truthful. Preserve best-effort analysis when public research fails. | B4, F2, F13 |
| M6 | High | Protect decision-record integrity. Use meaningful draft fields, removable evidence, and human provenance. | F5, F9 |
| M7 | High | Make decisions visible and durable across the register, matter records, Recent activity, revisit date, reload, and concurrent index rebuilds. | F6, F7, B5 |
| M8 | High | Preserve sent messages and composer drafts. Add immediate user echo, merge server history, restore failed text, and show honest long-run state. | B6, F19 |
| M9 | High | Protect company-profile integrity. Show the saved profile, require replacement confirmation, merge field additions, and do not re-ask settled questions. | F20, F30 |
| M10 | High | Make answered intake questions durable and inert. Show the saved answer and support qualified free text with accessible controls. | F4, F27 |
| M11 | High | Use the configured lawyer for human edits and prevent internal paths or record IDs from leaking into ordinary chat and work product. | F12, F18 |
| C1 | Medium | Make risk meaningful through a simple lawyer-set field, or hide it while unset. Do not infer or color-code legal risk. | F3 |
| C2 | Medium | Make `Draft work product` honest. It must start a visible run or clearly prepare and focus an unsent request. | F8 |
| C3 | Medium | Improve document navigation. Default to the current draft, keep stable Facts and Issue map links, and never default the lawyer-facing pane to `matter.md`. | F14, F21 |
| C4 | Medium | Preserve drafts across Overview/Chat switches and remove collapsed controls from the accessibility tree. **Keep Overview and Chat mutually exclusive. Do not show both when space permits.** | F10, user override |
| C5 | Medium | Simplify company setup to one clear review-and-save path, honest saved state, a visible existing profile, and fields sized for review. | F20 |
| C6 | Medium | Add manual recovery: create a draft by hand and save a useful assistant answer as work product. | F25, F26 |
| C7 | Medium | Add structured `Conditions` and `Not decided` decision fields without adding an approval engine. | F28 |
| C8 | Medium | Improve long-run and transcript feedback with elapsed time, clear server-continuation copy, and no fake phases, percentages, ETA, or cancellation claim. | F19 |
| C9 | Medium | Use `Themis.ai` as the whole system. Remove visible `Counsel OS`, `CounselOS`, and the separate chatbot identity `Themis`. | F22, user override |
| C10 | Medium | Remove artifact and review noise: stable record links, synchronized research titles, a defined non-regressing contents count, and no punctuation-only review cards. | F21, F23, F29 |

### Product and architecture decisions

1. Markdown remains the source of truth. SQLite remains a disposable index.
2. Keep the local single-user MVP. Do not add auth, a queue, embeddings, cloud tenancy, verifier agents, multi-agent voting, confidence gates, or legal-answer refusals.
3. Model output may analyze and draft. Deterministic services own paths, saved mutations, work-item completion, lifecycle actions, and record creation.
4. A missing source lowers support. It does not block the answer. Clearly separate external authority, supplied sources, internal matter support, assumptions, and generated analysis.
5. Recommendation and recorded decision remain separate. Do not create a decision from approval, delivery, or agent prose.
6. Delivery means that the lawyer records delivery outside the system. Do not build outbound email, Slack, or payment actions.
7. Keep Overview and Chat mutually exclusive. Switching must not destroy the composer draft. Hidden content must be unmounted, `hidden`, or correctly inert.
8. The risk field is human-set metadata, not an agent score. Vermilion remains reserved for failure and overdue.
9. `Themis.ai` is the product and system name. Generated text may be labelled `Themis.ai · Not reviewed`, but there is no separate person-like chatbot named `Themis`.
10. Preserve stable internal values when required for compatibility, including the repository path, old local-storage keys during migration, `.counsel_os_cache.db`, `outside_counsel_os`, and `agent_id: counsel-copilot`. Map legacy stored display values such as author `Themis` to `Themis.ai` at the presentation boundary. Do not expose the legacy names.
11. Do not rewrite historical handoff reports only to change their historical wording. Update the live application, shipped vault/templates, tests, README, and active product/acceptance documents.

### Agent and review policy

```yaml
execution:
  tree: shared
  max_parallel_implementers: 3
  implementers:
    model: gpt-5.6-sol
    reasoning_effort: low
    user_label: Sol Light
  combined_reviewer:
    model: gpt-5.6-sol
    reasoning_effort: high
    mode: read-only
    count: 1
```

- The runtime calls the requested `Sol Light` setting `low` reasoning. Use `gpt-5.6-sol` with `reasoning_effort: low` for every implementation worker.
- Run one independent, read-only `gpt-5.6-sol` High reviewer after the combined implementation and verification pass.
- Workers must not spawn agents, commit, push, deploy, create worktrees, reset files, or edit outside assigned ownership.
- Keep at most three implementers active. The coordinator remains the fourth active slot.
- File ownership is exclusive within a wave. Ownership may transfer only after the earlier worker stops, its diff is accepted, and the gate checks pass.
- If the High reviewer finds a material issue, dispatch the smallest correction to a Sol Light worker. Then ask the same High reviewer to recheck the correction. The reviewer never edits.

### Resume protocol

Use `docs/themis-ai-reliability-build.handoff-progress.md`.

1. Read it before work. Do not redo a step marked `done` unless its stated check now fails.
2. After each accepted step, run its check and update its line immediately.
3. On failure, write `FAILED: <short evidence>` on that line before diagnosis.
4. Preserve all user changes. Record `git status --short` before every wave and compare worker changes to ownership after every wave.
5. Do not mark a step done from a worker report alone. Inspect the diff and rerun the check.

### Known baseline on 2026-08-31

- Branch: `main`.
- Starting commit: `13f8db7 Update Counsel OS implementation and project artifacts`.
- The tree was clean before planning checks.
- Backend: `501 passed, 1 warning` from `.venv/bin/python -m pytest -q`.
- Frontend: `npm run typecheck && npm run build` passed.
- `npm run check:workspace-ux` failed only at the source-shape assertion `Review intake must open the original request`. The live code has a `review_intake` path, but the script expects `openDocument(requestPath)` within a brittle 120-character window. Verify the behavior, then repair the check. Do not classify the assertion alone as a product regression.

### Step 0 — Preflight and diagnosis

The coordinator must read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, this plan, and the progress file. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "Where do matter state, work-product lifecycle, chat mutations, research provenance, decisions, company interview state, document review authorship, and visible product naming flow?" --budget 8000
```

Before dispatch, diagnose these uncertain observations without changing code:

- Call the existing finalize endpoint against a valid draft in an isolated test vault. Determine whether the observed inert Finalize action is client-side, server-side, or stale state.
- Confirm whether `chat_runs.py` saves the user turn before the start response returns.
- Reproduce the editor Home/End and selection issue by hand in a real browser. If it does not reproduce with a human keyboard, record it as a browser-control artifact and do not change Lexical.
- Locate the exact Matter materials render and define what the contents counter counts. The count must have a stable meaning before it is changed.
- Inspect how a research agent can remain pinned to `mock` while the workspace uses a live provider. Do not treat an explicit user selection as a defect.
- Reproduce the concurrent index rebuild race with a deterministic test before changing index logic.

Write the diagnosis results in the progress file. A wrong cause may change implementation details, but it does not remove an accepted user-visible outcome.

### Step 1 — Sol Light foundation worker

Run one worker alone. This worker freezes shared contracts and repairs matter-state foundations.

Write ownership:

- `backend/app/models/api.py`
- `backend/app/services/matter_state.py`
- `backend/app/services/matters.py`
- `backend/app/routers/matters.py`
- `backend/tests/test_matter_state.py`
- `backend/tests/test_matters.py`
- `backend/tests/test_matter_records.py`
- `frontend/lib/types.ts`
- `frontend/lib/api.ts`
- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`

Required behavior:

- Add only the contracts required by this plan: unsupported-mutation evidence, structured open-question/work-item identity, risk update, decision conditions/not-decided, research truth fields, and lifecycle results.
- Complete or neutralize the generic orientation item when intake completes.
- Prefer a real current action over the stale orientation title.
- In this single-lawyer MVP, map the configured lawyer's work to `you`, not a third-party owner.
- Return work-item identity with required questions and allow exact completion through the existing service.
- Sort Recent activity by event timestamp, not random same-day filename suffixes. Use human event titles.
- Add a simple persisted lawyer-set risk update. If risk remains unset, the frontend contract must permit hiding it.
- Keep existing API names where possible. Do not build a new state service.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_matter_state.py tests/test_matters.py tests/test_matter_records.py tests/test_matter_action_api.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

Freeze the contract shape after this gate. Later changes to these shared files require coordinator approval and serial ownership transfer.

### Step 2 — Wave 1: three Sol Light workers

Run all three chunks in parallel after Step 1 passes.

#### Chunk 2A — Chat truth, transport, answered intake, and recovery

Write ownership:

- `backend/app/agents/runner.py`
- `backend/app/services/chat_runs.py`
- `backend/app/services/chat_history.py`
- `backend/app/routers/chat.py`
- `backend/app/providers/openai_compatible.py` only if diagnosis proves a parsing defect
- `backend/tests/test_agents.py`
- `backend/tests/test_chat_runs.py`
- `backend/tests/test_chat_history.py`
- `backend/tests/test_openai_compatible_provider.py` only if needed
- `frontend/components/ChatPanel.tsx`
- `frontend/components/ChatCards.tsx`
- `frontend/lib/chatRunLogic.ts`
- `frontend/lib/chatCardLogic.ts`
- `frontend/scripts/check-chat-run-recovery.ts`
- `frontend/scripts/check-transport-preservation.ts`
- `vault/00_System/agents/counsel-copilot.md`
- `backend/tests/fixtures/vault/00_System/agents/counsel-copilot.md`

Required behavior:

- Attach structured unsupported-mutation evidence when final prose claims a save/write/revision/record action but no matching mutation succeeded. Include relevant tool errors. Keep the full useful reply.
- Put a clear `Not saved` or `No file changed` notice above the reply. Keep ordinary successful turns free of this notice.
- Use the trace as authority. Phrase matching is only a narrow fallback.
- Echo the user turn immediately. Merge with saved history without duplicates. Restore the composer on submission failure.
- Preserve an unsent composer draft across Overview/Chat unmounts, reload-safe when practical, and clear it only after accepted submission.
- Show elapsed working time and clear `Stop showing progress` copy that says server work continues. Do not show fake phases, percentages, ETA, or claim cancellation.
- Render submitted intake answers as durable, inert human records with the chosen answer and qualifier. Keep only the current unanswered card active.
- Use real labelled radios, checked state, keyboard access, and a free-text qualifier. Remove duplicate inert prose options.
- Add `Save as work product` on a useful assistant answer. It must call the canonical typed save API and show persisted success or failure.
- Strengthen prompt instructions against internal path/ID output and unsupported save claims. Do not add a verifier.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_agents.py tests/test_chat_runs.py tests/test_chat_history.py tests/test_matter_action_tools.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-chat-run-recovery.ts
node --experimental-strip-types scripts/check-transport-preservation.ts
npm run typecheck
```

#### Chunk 2B — Research truth and distinct artifacts

Write ownership:

- `backend/app/services/research.py`
- `backend/app/services/research_runs.py`
- `backend/app/providers/factory.py`
- `backend/app/providers/mock.py`
- `backend/tests/test_research.py`
- `backend/tests/test_intelligence_providers.py`
- `frontend/lib/research.ts`
- `frontend/app/agents/page.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`
- `vault/00_System/agents/research-agent.md`
- `backend/tests/fixtures/vault/00_System/agents/research-agent.md`

Required behavior:

- Expose explicit per-agent provider selection and warn about a `mock` override when the workspace uses a live provider. Do not silently change an explicit selection.
- Never file developer scaffold or provider configuration text as substantive research.
- Keep useful model analysis when public retrieval, citation formatting, or another research leg fails.
- Record and expose the public-research status on the matter. Separate external authority from supplied and internal support. Do not cite chat-run records, duplicate dossier snapshots, or the packet itself as authority.
- Do not report `first_pass_complete` as fully successful when no public source was retrieved. Use a truthful partial/failed-public-leg state and avoid creating a misleading required review item.
- Give each packet a short title derived from its question. Existing packets fall back to their saved question without migration.
- Move an eligible matter into `research` while a run is active and to the correct next stage when it finishes. Do not move later-stage matters backward.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_research.py tests/test_intelligence_providers.py tests/test_intelligence_security.py tests/test_matter_records.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

#### Chunk 2C — Decision integrity and visibility

Write ownership:

- `backend/app/services/decisions.py`
- `backend/app/routers/decisions.py`
- `backend/app/services/index.py`
- `backend/tests/test_decisions.py`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/DecisionTable.tsx`
- `frontend/app/decisions/page.tsx`

Required behavior:

- Seed Decision from a real saved recommendation when available. Do not seed Rationale with a work-queue count.
- Track generated provenance against the current field value. Once the lawyer changes generated text, remove the generated-text label from that field.
- Make each evidence/basis item readable and removable. Failed-public-research status must be visible if the lawyer keeps that item.
- Add optional structured `Conditions` and `Not decided` fields. Store and display them without adding an approval engine.
- Display the revisit date in the decision register and matter decision view.
- Fix only a reproduced index generation race. The Markdown decision remains authoritative.
- A submit must end with confirmed recorded state or a specific visible error. Never close the modal on ambiguous state.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_decisions.py tests/test_awareness_index.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

### Step 3 — Wave 1 gate

Wait for all workers. Reject out-of-scope edits. Inspect all diffs. Run every focused command again, then:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_agents.py tests/test_chat_runs.py tests/test_research.py tests/test_decisions.py tests/test_matter_state.py tests/test_matters.py tests/test_matter_records.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

### Step 4 — Wave 2: three Sol Light workers

Run all three chunks in parallel after Step 3 passes.

#### Chunk 4A — Canonical work product and reachable lifecycle

Ownership transfers from the stopped foundation worker for the listed shared files.

Write ownership:

- `backend/app/services/work_product.py`
- `backend/app/tools/handlers.py`
- `backend/app/services/matters.py`
- `backend/app/routers/matters.py`
- `backend/tests/test_work_product.py`
- `backend/tests/test_matter_lifecycle.py`
- `backend/tests/test_matter_action_api.py`
- `backend/tests/test_matter_action_tools.py`
- `vault/00_System/tools/save_work_product.md`
- `backend/tests/fixtures/vault/00_System/tools/save_work_product.md`

Required behavior:

- Reject generic writes to protected work-product names, including root `work-product.md` and configured draft/final folders.
- `save_work_product(kind=draft)` accepts the deliverable body, not a description. It creates or revises the canonical current draft.
- Preserve read fallback for legacy root `work-product.md` without creating new loose files.
- Finalize only a valid canonical draft. The immutable final must contain the same reviewed content and move `generate` to `respond` once.
- Approval binds one final artifact. Delivery records that same artifact as sent outside the system. Closure requires delivery and no open required work. Retries are idempotent.
- Return structured changed paths and persisted state for every lifecycle mutation.
- Keep recommendation and decision records separate from work product.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_work_product.py tests/test_matter_lifecycle.py tests/test_matter_action_api.py tests/test_matter_action_tools.py tests/test_matters.py
```

#### Chunk 4B — Company-profile integrity and simple setup

Write ownership:

- `backend/app/services/company.py`
- `backend/app/services/company_interview.py`
- `backend/app/routers/settings.py`
- `backend/tests/test_company_interview.py`
- `frontend/components/CompanyInterview.tsx`
- `frontend/app/settings/page.tsx`

Required behavior:

- Show the existing saved company, version/save time, and an explicit `Start again` action. Do not default a returning user to a blank interview.
- Require confirmation that names both companies before replacing a different company.
- Reject stale profile versions without changing the Markdown file.
- Merge later answers into populated fields when they add a distinct fact. Do not replace an earlier licensing answer with an unrelated later answer.
- Mark settled topics and do not re-ask them unless the user explicitly reopens or corrects the topic.
- Use one clear review/edit/save path. Remove the duplicate editor/save controls. Use `No unsaved changes`, not `Saved`, before a save exists.
- Size long attorney-review fields for their content while retaining normal textarea resize and scroll behavior.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_company_interview.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

#### Chunk 4C — Human document authorship and review noise

Write ownership:

- `backend/app/services/document_review.py`
- `backend/tests/test_document_review.py`
- `backend/tests/test_document_review_docx.py`
- `frontend/components/DocumentPanel.tsx`
- `frontend/components/DocumentReview.tsx`
- `frontend/components/MarkdownRichEditor.tsx`
- `frontend/components/RevisionPlugin.tsx`
- `frontend/components/RevisionTextNode.tsx`
- `frontend/lib/reviewAuthor.ts`

Required behavior:

- Offer the configured lawyer name directly and default direct human edits to that lawyer unless the user selects generated authorship.
- Render legacy stored author `Themis` as `Themis.ai` without destroying old review metadata.
- Filter whitespace-only, Markdown separator-only, and punctuation-only segments from review cards while preserving substantive text changes.
- Change Lexical keyboard behavior only if the human-browser diagnosis reproduced the issue. If it did not, add no speculative editor code.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_document_review.py tests/test_document_review_docx.py
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
```

### Step 5 — Wave 2 gate

Wait for all workers. Reject out-of-scope edits. Inspect all diffs. Run the three focused commands again. Then run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q
```

Do not start frontend integration until all backend tests pass.

### Step 6 — Sol Light workspace integration worker

Run one worker alone. Earlier frontend owners have stopped, so ownership may transfer.

Write ownership:

- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/components/NewMatterForm.tsx`
- `frontend/components/ChatPanel.tsx` only for integration with the accepted Chat API
- `frontend/components/ChatCards.tsx` only for integration with canonical work product
- `frontend/lib/matterBrief.ts`
- `frontend/lib/matterActions.ts`
- `frontend/app/globals.css`
- `frontend/scripts/check-matter-brief.ts`
- `frontend/scripts/check-workspace-ux.ts`
- add one focused pure-helper check only if needed

Required behavior:

- Render real current required work and allow exact work-item completion from Overview.
- Show or hide risk according to C1 and persist lawyer changes.
- Keep Overview and Chat mutually exclusive. Preserve the Chat draft across switching. Remove hidden/collapsed controls from the accessibility tree and give every toggle a useful accessible name.
- `Draft work product` either starts a run or clearly prepares, focuses, and labels an unsent request.
- Default the document pane to the canonical current draft or an artifact chooser, never `matter.md`.
- Make the Overview Finalize action visible when a draft exists. Show exact failure or persisted success. Then expose approve, mark sent, and close actions from durable state.
- Keep stable Facts, Issue map, Recommendation, research, draft, and final links in Matter materials. Research must not replace core record links.
- Show recorded decisions in the matter's own artifacts and keep decision activity visible after reload.
- Add a simple `New draft` control under Work product/Draft using the canonical API.
- Define the Matter contents count as the number of current user-facing document nodes after filtering operational records. Use the same pure helper everywhere. The count may decrease only when a visible document is removed or filtered by an explicit state change.
- Sync research labels across the tree, Overview, document header, and decision evidence.
- Rename the create action to `Create matter and open Chat` or equally clear copy.
- Repair the stale `Review intake` source assertion only after confirming that the action opens `request.md`.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
node --experimental-strip-types scripts/check-matter-brief.ts
npm run check:workspace-ux
npm run typecheck
npm run build
```

### Step 7 — Sol Light Themis.ai naming worker

Run one worker alone after all feature workers stop. This is a visible-name pass, not a rewrite of stable storage formats.

First create an occurrence inventory with:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
rg -n -i 'counsel[ ._-]*os|counselos|themis\.ai|\bthemis\b' \
  frontend backend/app vault/00_System backend/tests/fixtures/vault/00_System \
  README.md CLAUDE.md CODEX_HANDOFF.md current.md decisions.md \
  docs/PRD.md docs/DESIGN_LANGUAGE.md docs/ARCHITECTURE.md \
  docs/ACCEPTANCE_TESTS.md docs/END_TO_END_TEST_KIT.md
```

Write ownership is limited to the inventory files above and tests directly coupled to changed strings. Do not edit historical experiment reports or older handoff plans only to restyle history.

Required behavior:

- Browser title, navigation shell, settings, empty states, status copy, generated-output labels, shipped prompts, default author labels, active documentation, and current fixtures use `Themis.ai` as the system name.
- Do not use standalone `Themis` as a person or chatbot. Chat remains a product surface named `Chat` or `Ask Themis.ai`, and system output may be `Themis.ai · Not reviewed`.
- Remove visible `Counsel OS` and `CounselOS` copy.
- Keep stable IDs and compatibility values only when required. Add presentation aliases or read-old/write-new migration for legacy local storage and stored author values.
- Do not rename the repository directory, `.counsel_os_cache.db`, API enum `outside_counsel_os`, or stable agent ID solely for branding.
- Update current tests to expect the new display name.

Checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
rg -n -P -i 'counsel[ ._-]*os|counselos|\bthemis\b(?!\.ai)' \
  frontend backend/app vault/00_System backend/tests/fixtures/vault/00_System \
  README.md CLAUDE.md CODEX_HANDOFF.md current.md decisions.md \
  docs/PRD.md docs/DESIGN_LANGUAGE.md docs/ARCHITECTURE.md \
  docs/ACCEPTANCE_TESTS.md docs/END_TO_END_TEST_KIT.md
```

Every remaining match must be an approved stable identifier, legacy compatibility read, historical explanation, or negative test. List each exception in the progress file.

Then run backend and frontend full checks.

### Step 8 — Combined verification and isolated browser acceptance

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

Walk the Demo script against a copied temporary vault. Hash the repository vault before and after. The repository vault must not change.

Browser order:

1. Use the in-app browser by default.
2. If the in-app browser cannot perform a required action, use the user's Chrome session.
3. If Chrome is unavailable, use Safari through computer control.

Record browser-tool failures separately from product failures. Do not use a hidden or zero-geometry browser pane as product evidence.

### Step 9 — One Sol High combined review

Dispatch one `gpt-5.6-sol` reviewer with `reasoning_effort: high`. The reviewer is read-only and must inspect the combined implementation, not worker summaries.

Review questions:

- Does every `M1`–`M11` and `C1`–`C10` acceptance outcome have code and proof?
- Can any final response still claim a mutation that the trace does not support?
- Can the guided workflow still select, approve, deliver, or close the wrong artifact?
- Can Today, Overview, Matters, research state, decisions, or activity disagree after reload?
- Can a failed external research leg look fully sourced or fully successful?
- Can human text still be attributed to generated output?
- Can a settled intake or company question be answered twice without an explicit reopen?
- Are Overview and Chat still mutually exclusive while drafts survive switching?
- Is any visible `Counsel OS`, `CounselOS`, or standalone chatbot `Themis` left in the live product or active docs?
- Did the implementation add speculative machinery, a legal-answer gate, or a compatibility break?

The reviewer must report each finding with severity, evidence, file/symbol, expected behavior, and smallest correction. If there are no material findings, it must say so explicitly.

### Step 10 — Corrections, final proof, and project memory

- Give each accepted reviewer finding to a Sol Light correction worker with narrow ownership.
- Rerun proportionate focused checks and the full verification set.
- Ask the same Sol High reviewer to recheck corrected findings. The reviewer remains read-only.
- Update `docs/themis-ai-reliability-build.handoff-progress.md` after each result.
- Reconcile `current.md`, `CODEX_HANDOFF.md`, active acceptance docs, and implementation status only after proof. Do not mark the build complete while any accepted outcome is unverified.
- Do not commit or push unless the user asks in the new context.

## Parked backlog

- Side-by-side Overview and Chat, including any rule that shows both when space permits. The user explicitly rejected this part of C4.
- External intake connectors, outbound delivery, authentication, cloud tenancy, collaboration, queues, embeddings, Tauri, and a plugin marketplace.
- Additional research providers beyond the current approved provider paths.
- Court-grade citation validation, mandatory verifier agents, confidence thresholds, and legal-perfection gates.
- Broad redesigns that do not directly prove an accepted `M` or `C` outcome.
- A global rewrite of stable technical identifiers or historical reports solely for branding.
