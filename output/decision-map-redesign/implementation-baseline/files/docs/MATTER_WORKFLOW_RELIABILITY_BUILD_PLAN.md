# Matter workflow reliability build plan

## 1. Thesis

Counsel OS must treat chat as advice and Markdown as the durable record. A model may interpret a request, draft text, compare choices, and recommend a path. Deterministic code must choose canonical file locations, complete work items, approve a response, record delivery, and close a matter.

This build fixes the product defects found by the ten-agent UX experiment. It does not address service outages, the frontend or backend going down, browser-control selector failures, or test-agent JavaScript errors.

The build stays small:

- Keep the current matter stages, Markdown vault, SQLite index, chat, editor, and three-pane workspace.
- Add narrow tools around existing services. Do not add a workflow engine, queue, verifier agent, or new database.
- Keep general stage movement flexible. Enforce rules only on the actions that change durable lifecycle facts.
- Store approval, delivery, and closure as separate fields on the canonical Markdown matter record, with append-only Markdown events for audit.
- Store file-location settings in the existing Markdown settings file. A setting ships only when a writer uses it in the same build.

## 2. Payoff moment

A lawyer asks Themis to prepare a response. The draft appears in one predictable folder and opens from the matter overview. The lawyer approves one immutable final file. Counsel OS then records that exact file as delivered and closes the matter only after required work is complete. Reloading the page shows the same state because the state comes from Markdown records, not from the chat text.

## 3. Demo script

1. Open Settings and select **Files and outputs**.
2. Set the source-document, draft-output, and final-output folders. Save and reload.
3. Confirm that the values are stored in `00_System/settings.md`.
4. Upload a document to a matter. Confirm that the new file uses the configured source-document folder.
5. Ask Themis to prepare a work product. Confirm that it uses the configured draft-output folder, the Generate action changes to **Review draft**, and the response has an **Open artifact** action.
6. Edit and save the draft in the existing document editor.
7. Finalize the unchanged draft twice. Confirm that both requests return the same immutable final path and create only one final file. Then edit the draft and confirm that it can create a new immutable version.
8. Keep an unrelated required work item open. Confirm that the work item remains the primary next action and that the stage action stays visible as a separate control.
9. Complete one selected work item. Confirm that sibling work items remain open.
10. Approve the final response. Confirm that `matter.md` names the exact approved final file and stores the approval actor and time.
11. Reload the page. Confirm that the approval remains visible.
12. Select **Mark as sent**. Confirm that `matter.md` records delivery of the approved file, the actor, the time, and that delivery occurred outside Counsel OS.
13. Try to close the matter while a required work item is open. Confirm that closure is blocked and the unfinished items are named.
14. Complete the remaining required work and close the matter. Confirm that `matter.md` stores the closure actor and time and that the matter is Closed after reload.
15. Repeat approval, delivery, work-item completion, and closure requests. Confirm that retries return the original records and do not change timestamps or create duplicate events.
16. Start a slow chat request. Confirm that the page shows honest elapsed work text, gives no fake percentage, and prevents only a duplicate submission.
17. Run research twice before reviewing it. Confirm that Counsel OS updates one open `counsel_review` work item for research instead of creating duplicates and does not move a Generate or Respond matter backward.
18. In the company interview, answer the existing website question with `leave blank`. Confirm that the Website field stays blank. Then give a public HTTPS URL and confirm that the UI states whether the website was read.
19. Force a model response that claims an action without a successful mutation tool. Confirm that the UI says **No workspace state change recorded**, no recorded-action card appears, and no durable state changes.

## 4. Build

### Product boundary

Use this rule for every change:

| Work | Owner of the result |
| --- | --- |
| Interpret facts, map issues, draft, compare options, recommend | LLM |
| Select a safe canonical path | Deterministic service |
| Save a user-facing work product | Typed tool and deterministic service |
| Complete one work item | Deterministic service |
| Approve one final artifact | Deterministic service and canonical `matter.md` fields |
| Record delivery | Deterministic service and canonical `matter.md` fields |
| Close a matter | Deterministic service and canonical `matter.md` fields |
| Show recorded success | Persisted state and successful tool result, never chat prose |

The generic `write_markdown` tool remains available for ordinary notes with an explicit safe path. Remove its no-path fallback to the legacy `drafts/` folder. A no-path call fails with a direct instruction to use `save_work_product` or provide an explicit note path. An explicit generic-write path must stay inside the matter and cannot target recommendations, configured work-product folders, final files, or other protected records. Existing legacy `drafts/` files remain readable, but new user-facing work must use the typed work-product tool. This prevents a fourth draft location without building a second note system.

### Durable lifecycle state

Reuse `MatterService`, `matter.md`, and the existing append-only matter events. Do not add a second lifecycle record or a general event system.

Keep `matter.md` as the single lifecycle authority. Extend its metadata only as needed:

- Approval stores the approved immutable artifact path and ID, approval actor, approval time, and approval event path.
- Delivery stores the same approved artifact path and ID, delivery actor, delivery time, delivery method `outside_counsel_os`, optional note, and delivery event path.
- Closure stores closure actor, closure time, and closure event path.

The actor is the active lawyer identity already used by document review. Direct UI requests must send the non-empty `document_review.lawyer_name`. Agent tools must ignore any model-supplied actor and use `ToolExecutionContext.lawyer_author`. If the identity is missing, the mutation fails with a direct error. Do not infer the actor from matter ownership or write a generic `user` value. This is a recorded workspace identity, not an authenticated identity; authentication remains outside the MVP.

Each first successful action also writes one existing-style append-only Markdown event. Extend `append_event` with optional caller-supplied `event_id` and `timestamp`; keep its current random defaults for all other events. Lifecycle actions derive one stable event ID from the matter ID and action, let `append_event` derive the path, and store that path on `matter.md`. On retry, return the stored lifecycle state. If the stored event path is missing, recreate it with the stable ID and original action timestamp. Do not change the first timestamp, add another event, accept an arbitrary event path, or add a second lifecycle receipt file.

The delivery fields mean that the user confirms delivery outside Counsel OS. They do not send email, Slack, or any other message.

Required behavior:

- Finalizing an unchanged draft again returns the original immutable final file. Use a content hash or stored source version. A changed draft may create a new immutable final.
- Approving the same final again returns the original matter state and timestamp.
- Approving a different final after approval returns a clear conflict.
- Marking a response sent requires approval state and uses its artifact path.
- Repeating delivery returns the original matter state and timestamp.
- Closure requires delivery state and no open required work.
- Repeating closure returns the original matter state and timestamp.
- Preserve the existing guard that prevents the normal stage route from moving a matter directly to Closed. Add a regression test; do not rebuild this guard.
- Other manual stage changes remain flexible. Do not add a rigid state machine.
- Approval and delivery require the matter to be in Respond. First closure also requires Respond. A retry of an already recorded closure is valid while the matter is Closed. No lifecycle action moves the matter to Respond automatically.
- Approval is not a recorded legal decision. Keep recommendation, decision, approval, delivery, and closure separate.

Existing lifecycle timestamps remain valid Markdown state. Do not manufacture missing actor, artifact, or event details. Require explicit user confirmation before adding new details or advancing to the next action.

### Work-item completion

Add one narrow operation that completes one work item by ID. It updates that work item's Markdown status and `completed_at`. It must not complete sibling items.

Expose the same operation through HTTP, the matter UI, and one agent tool named `complete_work_item`. A retry returns success with the original completion time.

Keep the initial **Orient to the request** item. Let the lawyer or agent complete it explicitly. Do not infer completion from a stage label or from chat text.

Change the matter overview so that it has two separate visible concepts:

- The highest-priority open required work item remains the primary next action.
- The stage or lifecycle action remains visible as a separate control.

An open work item must not hide **Record decision**, **Draft work product**, **Review draft**, **Approve response**, **Mark as sent**, or **Close matter**. Closure can still be blocked when required work remains.

If the primary work item directly represents the same action, the UI can show one combined control. For example, **Approve response** can approve the selected final and complete that one approval work item after approval succeeds. Pass the exact work-item ID. Do not complete items by title or type in bulk.

Remove the three bulk-by-type effects from the assembled workflow:

- Approval completes only the exact `work_item_id` supplied with the approval action.
- Recording a durable decision does not complete every decision item. Leave work open unless the caller separately completes one exact item.
- Research completes only the exact research work-item ID supplied for that run. If none is supplied, it completes no work item.

Keep a private compatibility helper only if an unrelated caller still needs it. None of the approval, decision, or research paths may use bulk-by-type completion.

### Canonical files and Markdown settings

Add one **Files and outputs** section to the current Settings page. Persist these flat keys in `vault/00_System/settings.md`:

| Setting key | Default | Use |
| --- | --- | --- |
| `matter_files.source_documents_dir` | `documents` | New uploads and extracted source companions |
| `matter_files.draft_outputs_dir` | `work-product/draft` | New generated drafts and response work |
| `matter_files.final_outputs_dir` | `work-product/final` | New immutable final work products |

These are paths relative to each matter folder. They are not arbitrary host file-system paths. Keep `recommendations.md`, `research/`, `decisions/`, `work-items/`, `events/`, and the internal `documents/batches/` records fixed because they are product records, not user output preferences. Changing the source-document folder does not move document-batch records.

Add one small `MatterPathPolicy` service. It reads the existing `SettingsService` and resolves the three folder settings under the matter path. It rejects:

- absolute paths;
- empty paths;
- `.` or `..` traversal;
- backslashes;
- paths outside the matter;
- protected record names and folders;
- duplicate or overlapping configured locations.

Allow the default source folder `documents`, but reserve its `documents/batches` child for internal batch records. No configured output folder or generic write may equal or sit under that reserved child.

Do not add path templates, variables, a settings framework, or file migration. A changed setting affects new files only. Existing files remain visible and editable at their stored paths. Finalization, approval, delivery, export, and matter-tree links must continue to accept valid older artifacts.

Wire each setting to its real consumer in this build:

- Ingestion uses `source_documents_dir`.
- Draft creation and the typed work-product tool use `draft_outputs_dir`.
- Finalization uses `final_outputs_dir`.
- The Settings UI writes and reloads all three values.

Work-product discovery must not depend on configured folder names. `WorkProductService` writes `record_type: work_product` and `state: draft|final` on every new work product. Matter-tree enrichment exposes both fields on `FileNode`. The matter workspace uses those fields to find drafts and finals. Existing old work products without those fields use a narrow legacy path fallback so they remain visible.

If a user edits `settings.md` by hand and enters an invalid path, do not write outside the matter. Return one direct configuration error and leave existing files unchanged.

### Typed agent tools and recorded-action results

Add thin declarative tools that call the existing services:

- `save_work_product`
- `complete_work_item`
- `approve_response`
- `mark_response_sent`
- `close_matter`

`save_work_product` accepts a matter ID, title, content, and a small artifact kind enum. `recommendation` writes the fixed `recommendations.md` record. `draft` and `response` write to the configured draft-output folder. Only the existing finalization action can create an immutable final file. The service chooses every path and its metadata. The tool must not accept a caller-selected raw path.

The mutation tools return the current matter state, the changed matter or work-item path, the stable event path when applicable, and `changed_paths`. They do not repeat lifecycle rules in tool handlers. Lifecycle requests carry `artifact_path` for approval, optional `note` for delivery, optional exact `work_item_id`, and required `actor`. The HTTP route accepts the actor from the active lawyer UI identity. Agent handlers ignore model actor arguments and use the current `lawyer_author` context.

Approval, delivery, and closure tools are available to the model only when the current user message explicitly asks for that exact action. Reuse the existing deterministic permission pattern for `record_decision` in `backend/app/agents/runner.py`. Do not ask another model to infer permission. Direct UI buttons remain explicit user actions and call the same services.

Permission tests must prove that a drafting request cannot expose approval, delivery, or closure tools; that an approval request exposes only `approve_response` among the gated lifecycle tools; and that delivery or closure requires its own explicit wording.

Update the Counsel Copilot instructions:

- Use typed tools for user-facing work products and lifecycle mutations.
- Never claim that a state change succeeded without a successful tool result in the current turn.
- A tool failure must not discard useful draft or analysis text.
- Approval, delivery, closure, and a recorded decision are separate actions.
- Delivery is a record of an outside action for this MVP.

The UI renders recorded-action cards only from successful tool results and persisted records. It refreshes matter state after a mutation. When the user requested a workspace change, or when a mutation tool failed, the turn shows either the recorded changes or **No workspace state change recorded**. Ordinary advice and drafting turns do not show this extra line. Chat prose can explain an action, but it cannot create a green success state, timestamp, badge, or closed stage.

### Research and company interview repairs

Research keeps its current synchronous service and existing run polling. Do not add a queue or streaming system.

When research completes:

- Reuse and update the existing open work item whose real `item_type` is `counsel_review` and whose Markdown metadata has `source_kind: research_review`.
- Create a new `counsel_review` item with `source_kind: research_review` only if the earlier item was completed before the new run. Do not add an index column or a general deduplication system; scan the current matter's small work-item list and read the candidate Markdown metadata.
- Link the current packet or run in the work item.
- Keep the useful research answer even if citation formatting or a later step fails.
- Complete only the exact research work-item ID supplied for the run.
- Auto-advance to Explore only when the run started in Intake or Research. Supplementary research started in Explore, Generate, or Respond preserves that stage.

For the company interview:

- Reuse the existing Website field, `CompanyProfile.website_url`, and `website_used` response field. Do not add another request or profile field.
- Treat blank input and direct phrases such as `leave blank`, `none`, and `no website` as no website.
- When the focused interview question is `website_url`, store only a URL that passes the existing public HTTPS validation. Otherwise leave the field blank and return the existing warning when relevant.
- Never copy the raw website answer into the profile before validation.
- Render **Website read** from the existing `website_used` field only when the backend confirms that it used the website.
- On a blocked, private, or unreadable URL, show a clear warning and continue the interview from the user's supplied facts.
- Do not add a crawler, domain search, multi-page scrape, or verification gate.

### Matter workspace and progress

Reuse `MatterWorkspace`, `DocumentPanel`, `MatterTree`, the current Markdown editor, and the existing Matter materials artifact links.

Promote the existing artifact links near the primary action instead of building a second block. Keep the dossier and latest research links. Add the current recommendation, metadata-classified draft, and approved or final response when they exist. After a successful typed write, offer **Open artifact** for the exact user-facing `changed_path`. Never auto-open an event, conversation, work item, or matter metadata record.

Replace the current legacy `findFirstFile(detail.tree, "drafts")` draft check. Determine `hasDraft` from `record_type: work_product` plus `state: draft`, with the same narrow legacy fallback used by artifact discovery. A draft in a configured folder must change the Generate action from **Draft work product** to **Review draft**.

Keep raw Markdown mode for exact edits. Do not build a second editor. Verify that Open, Edit, Save, reload, and export all use the same stored path.

Enhance the existing **Working…** labels in matter chat, Today chat, and company interview with local elapsed-time copy such as **Still working…**. Do not add a progress subsystem or show a percentage, backend phase, or estimated completion time. Disable only duplicate submit for that request. Keep the matter tree, existing document, and safe navigation usable.

### Finding coverage

The 23 child tasks included repeated reports of the same root defects. This build consolidates the applicable product findings as follows:

| Finding class | Build response |
| --- | --- |
| Chat said a stage changed, sent, or closed when durable state did not | Typed mutation tools, canonical `matter.md` state, event-backed results, and state refresh |
| Agent could not approve, deliver, close, or complete selected work | Five narrow tools that call existing services |
| Open work hid the real stage action | Required work stays primary, while the stage action remains separately visible |
| Required work remained open or all matching items could complete together | Complete one work item by ID, with retry-safe state |
| Drafts and outputs appeared in several folders | Three consumed path settings and one path-policy service |
| The model invented paths and record metadata | Typed `save_work_product`; generic writes remain for notes only |
| Finalization or action retries could duplicate files or events | Content-version final paths, canonical lifecycle fields, and stable event paths |
| Research runs created repeated review work | Reuse one open `counsel_review` item marked `source_kind: research_review` |
| Generated artifacts were hard to find or reopen | Extend the existing artifact links and add an exact Open artifact action |
| Long operations showed only a vague busy state | Honest elapsed local progress, no new job system |
| `leave blank` became the company website | Validate the existing focused Website answer before storing it |
| Website use was not visible | Render the existing response flag as a clear status or warning |
| Tool availability and chat claims disagreed | Stable typed tool allow-list, structured successful results, persisted state as authority |

Service downtime, browser-driver failures, selector failures, and test-script syntax or policy errors are excluded. They did not come from this product code and do not belong in this build.

### Deterministic test baseline

The backend test fixture currently copies the live `vault/`. That makes the suite depend on agent-created matters, annotations, company records, malformed dates, cache files, and files that can change during the copy. A verified run before this revision produced 314 passes, 6 failures, and 1 copy error. These are not safe wave gates.

Before feature workers start, create a committed, stable test vault under `backend/tests/fixtures/vault/` containing only the seeded system and demo records required by tests. Change `backend/tests/conftest.py` to copy that fixture, never the live workspace vault. Exclude SQLite files, journals, temporary files, experiment matters, user annotations, and runtime-edited company or schedule data.

Add `backend/tests/test_fixture_isolation.py`. It must prove that a sentinel file placed only in the live vault is absent from `app_context`, and that fixture setup cannot race a live SQLite journal. Run the full backend suite. Do not dispatch feature workers until this deterministic baseline is green. If a failure remains, report the exact stable failure and resolve its ownership before continuing; do not tell workers to ignore a red suite.

### Parallel execution policy

```yaml
parallel:
  optimize_for: quality
  max_active_agents: 4
  coordinator:
    role: orchestrator
    provider: codex
    model: gpt-5.6-sol
    effort: medium
  implementers:
    pool: sol-low-workers
    provider: codex
    model: gpt-5.6-sol
    effort: low
    max_concurrent: 3
  reviewer:
    pool: sol-medium-review
    provider: codex
    model: gpt-5.6-sol
    effort: medium
    max_concurrent: 1
    mode: read_only_combined_review
```

“Sol Light” means `gpt-5.6-sol` with `low` effort. The coordinator and reviewer use `gpt-5.6-sol` with `medium` effort.

All agents use one shared working tree. Workers must not spawn agents, commit, push, deploy, reformat unrelated files, or undo user changes. The Sol Medium coordinator snapshots the dirty tree before each wave, freezes shared contracts, checks ownership after each wave, runs integration checks, and assigns corrections. The Sol Medium reviewer runs only after implementation and is not an implementer.

Frontend typecheck, frontend build, the full backend test suite, browser checks, and `graphify update .` run only at coordinator gates. This prevents parallel workers from competing over generated files.

### Wave 0A — Sol Medium deterministic test baseline

```yaml
id: deterministic_test_baseline
outcome: Make backend tests independent from the live mutable vault and establish a green baseline.
depends_on: []
write:
  - backend/tests/conftest.py
  - backend/tests/fixtures/vault/
  - backend/tests/test_fixture_isolation.py
read:
  - vault/
  - backend/tests/
risk: The fixture must contain the seeded records tests actually require without copying user or runtime state.
implementer: sol-medium-coordinator
reviewer: sol-medium-review
check: Run the full backend suite twice; both runs must pass and produce the same result while the live vault remains active.
provides: A deterministic green backend baseline for all later wave gates.
```

The coordinator owns this shared test seam. Do not delegate fixture creation to a feature worker. The fixture is test data, not a second application vault or migration system.

### Wave 0B — Sol Medium contract freeze

```yaml
id: contract_freeze
outcome: Freeze the API shapes used by all backend and frontend chunks.
depends_on: [deterministic_test_baseline]
write:
  - backend/app/models/api.py
  - frontend/lib/types.ts
  - frontend/lib/api.ts
read:
  - backend/app/routers/matters.py
  - backend/app/routers/settings.py
  - backend/app/services/company_interview.py
risk: These files are shared seams. Only the coordinator edits them.
implementer: sol-medium-coordinator
reviewer: sol-medium-review
check: Focused schema/import checks, then inspect the exact diff.
provides: Lifecycle request and response fields, required lawyer actor, one-item completion request, optional research work-item ID, FileNode work-product metadata, and settings API names.
```

Freeze only the minimum contract. `MatterActionRequest` must add `artifact_path`, `note`, `work_item_id`, and required `actor`. The selected-work endpoint must identify one work item. Research requests may carry one exact `work_item_id`. `FileNode` must expose the work-product `record_type` and `state` supplied by the backend. Do not add a second website field, redesign the API client, or introduce generated schemas.

### Wave 1A — two parallel Sol Low backend chunks

#### Chunk B — file settings, path policy, and content-version finalization

```yaml
id: canonical_artifacts
outcome: Make all new source, draft, and final files use safe user-configured matter-relative folders and self-describing metadata.
depends_on: [contract_freeze]
write:
  - backend/app/services/matter_paths.py
  - backend/app/services/settings.py
  - backend/app/routers/settings.py
  - backend/app/services/ingestion.py
  - backend/app/services/work_product.py
  - backend/app/runtime.py
  - backend/tests/test_settings.py
  - backend/tests/test_ingestion.py
  - backend/tests/test_work_product.py
  - backend/tests/test_matter_paths.py
read:
  - backend/app/services/matters.py
  - backend/app/tools/handlers.py
risk: Existing matters use old paths. New settings must not move or invalidate old files.
implementer: sol-low-workers
reviewer: sol-medium-review
check: Path traversal, protected batch-record path, old-path compatibility, configured-path, metadata, and content-version retry tests.
provides: MatterPathPolicy, consumed settings, self-describing work products, and one immutable final per unchanged draft content version.
```

#### Chunk C — research deduplication and company website handling

```yaml
id: focused_service_repairs
outcome: Prevent repeated open research review work, preserve later matter stages, and prevent blank website instructions from becoming data.
depends_on: [contract_freeze]
write:
  - backend/app/services/research.py
  - backend/app/services/company_interview.py
  - backend/tests/test_research.py
  - backend/tests/test_company_interview.py
read:
  - backend/app/services/matters.py
  - backend/app/models/api.py
risk: Research retries must preserve useful output and must not complete an earlier review item automatically.
implementer: sol-low-workers
reviewer: sol-medium-review
check: Repeat-run, exact research-item completion, later-stage preservation, blank-intent, valid-public-URL, blocked-URL, unreadable-URL, and malformed model-output tests.
provides: Stable `counsel_review` research work, stage-safe reruns, and use of the existing website status contract.
```

### Wave 1A gate — Sol Medium coordinator

The coordinator waits for both workers, checks ownership, runs their focused tests, and freezes the settled `WorkProductService` interface. It does not start lifecycle work while either worker still writes backend services.

### Wave 1B — one Sol Low lifecycle chunk

#### Chunk A — lifecycle state, selected work, and agent tools

```yaml
id: lifecycle_mutations
outcome: Make final approval, delivery, closure, and selected work completion durable, permission-gated, and retry-safe.
depends_on: [contract_freeze, canonical_artifacts, focused_service_repairs]
write:
  - backend/app/services/matters.py
  - backend/app/routers/matters.py
  - backend/app/agents/runner.py
  - backend/app/tools/handlers.py
  - vault/00_System/tools/save_work_product.md
  - vault/00_System/tools/complete_work_item.md
  - vault/00_System/tools/approve_response.md
  - vault/00_System/tools/mark_response_sent.md
  - vault/00_System/tools/close_matter.md
  - vault/00_System/agents/counsel-copilot.md
  - backend/tests/test_matter_lifecycle.py
  - backend/tests/test_matter_action_api.py
  - backend/tests/test_matter_action_tools.py
  - backend/tests/test_agent_action_permissions.py
read:
  - backend/app/services/work_product.py
risk: A partial matter-and-event write can omit the audit event. Caller-supplied stable event IDs and retries must repair the missing event without changing first-action time.
implementer: sol-low-workers
reviewer: sol-medium-review
check: Focused lifecycle, permission, API, and tool tests.
provides: Shared deterministic mutation path for UI and agent calls.
```

### Wave 1B gate — Sol Medium coordinator

The coordinator checks exact ownership and reconciles only shared interfaces. It then runs the focused backend tests and the full backend suite.

Reject the wave if:

- an action can succeed without the required canonical `matter.md` fields;
- a lifecycle mutation accepts a missing, generic, or model-supplied actor;
- a retry changes a first-completion timestamp or creates a duplicate event;
- a configured path can escape the matter;
- a settings key has no real consumer;
- old stored artifacts become unreadable;
- research failure discards a useful answer;
- supplementary research moves an Explore, Generate, or Respond matter backward;
- approval creates a recorded decision.

### Wave 2 — two parallel Sol Low frontend chunks

#### Chunk D — matter actions, artifacts, and honest progress

```yaml
id: matter_workspace_reliability
outcome: Keep the real stage action visible, show work separately, discover configured work products by metadata, and show honest request progress.
depends_on: [lifecycle_mutations, canonical_artifacts, focused_service_repairs]
write:
  - frontend/lib/matterBrief.ts
  - frontend/lib/matterActions.ts
  - frontend/components/MatterWorkspace.tsx
  - frontend/components/ChatPanel.tsx
  - frontend/components/ChatCards.tsx
  - frontend/components/TodayChat.tsx
  - frontend/app/globals.css
  - frontend/scripts/check-matter-brief.ts
read:
  - frontend/components/MatterTree.tsx
  - frontend/components/DocumentPanel.tsx
  - frontend/lib/api.ts
risk: Configured folder names make path-based discovery stale, and a generic changed path can point to an internal record. Classify new work products by metadata and open only known user-facing artifact paths.
implementer: sol-low-workers
reviewer: sol-medium-review
check: Update and run the focused matter-brief script. The coordinator runs typecheck and build.
provides: Separate stage/work controls, recorded-action cards, artifact links, and elapsed progress copy.
```

#### Chunk E — file settings and company interview UI

```yaml
id: settings_and_company_ui
outcome: Let the user control three real file locations and clearly show whether the existing company website value was used.
depends_on: [canonical_artifacts, focused_service_repairs]
write:
  - frontend/lib/stubs.ts
  - frontend/app/settings/page.tsx
  - frontend/components/CompanyInterview.tsx
read:
  - frontend/lib/types.ts
  - frontend/lib/api.ts
risk: Settings must not imply behavior that the backend did not implement. The existing website status must not imply verification.
implementer: sol-low-workers
reviewer: sol-medium-review
check: Focused UI self-review. The coordinator verifies save, reload, and error states in the browser walk.
provides: Markdown-backed Files and outputs controls and explicit website status.
```

### Wave 2 gate — Sol Medium coordinator

The coordinator owns the new acceptance cases in `docs/ACCEPTANCE_TESTS.md`. It adds the path-setting, content-version finalization, lifecycle permission, selected-work completion, research deduplication, and company blank-input cases. It resolves only integration issues, then runs:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest
cd /Users/bharris/Programs/counsel-os-mvp/frontend && node --experimental-strip-types scripts/check-matter-brief.ts && npm run typecheck && npm run build
cd /Users/bharris/Programs/counsel-os-mvp && graphify update .
```

The browser walk uses an isolated copy of the vault and follows the demo script. It must also walk the applicable cases in `docs/ACCEPTANCE_TESTS.md` and `docs/END_TO_END_TEST_KIT.md`.

Required regression proof:

- The backend suite reads only the committed test fixture and passes twice while the live vault changes.
- One final file per unchanged draft content version; changed content can create a new final.
- One canonical matter state and one stable event per approval, delivery, and closure.
- Lifecycle actor fields come from the active lawyer identity, never a model argument or generic fallback.
- One selected work item completes at a time.
- General stage movement stays flexible, but direct Closed movement remains blocked.
- Closure names unfinished required work.
- All new file writes stay inside the matter and use current settings.
- Configured work-product folders remain discoverable because the UI uses metadata, not folder names.
- Existing artifacts at older paths still open, edit, finalize, approve, deliver, and export.
- UI success comes from persisted state and a successful structured tool result, not from model prose.
- The stage action stays visible beside unrelated open work.
- Research does not create duplicate open review items or regress a later stage.
- Company blank intent remains blank and the existing website-use status renders accurately.
- Long work shows honest progress and no false percentage.

### Final Sol Medium review

After all implementation workers stop, start one read-only Sol Medium reviewer. The reviewer checks the combined diff against this plan, the PRD, the design language, the demo script, and the Finding coverage table above. It must focus on record integrity, retry safety, path escape, old-file compatibility, misleading success states, and worker shortcuts.

The reviewer reports findings before any correction work starts. The coordinator assigns each correction to the original file owner when practical. The coordinator then reruns the focused checks, full suites, build, graph update, and browser walk.

## 5. Parked backlog

- Real outbound email, Slack, document-portal, or e-signature delivery. The MVP records that delivery happened elsewhere.
- A general workflow engine or rigid stage state machine. Flexible stages remain useful.
- A queue, server-sent events, token streaming, or a persisted job system. Add these only if honest elapsed progress is not sufficient after use.
- Arbitrary host folders, path templates, variables, cross-vault output, or automatic movement of old files.
- Separate approval, delivery, or closure receipt files. `matter.md` and existing events are enough for this build.
- Automatic completion of work based on model claims or stage movement.
- A verifier agent, multi-agent vote, legal-confidence gate, or refusal gate.
- A second document editor, collaborative editing, or cursor-control repair for browser automation.
- Website discovery, crawling, multi-page extraction, or source-verification gates in company interview.
- Reopening a Closed matter. Add a separate explicit action only after the product needs it.
- Automatic enrichment of old lifecycle timestamps with invented actor, artifact, or event data. Do not manufacture historical proof.
