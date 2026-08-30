# Acceptance tests

## A. Command center

- [ ] Sample matters load in all configured stages.
- [ ] Attention Required shows the stale sample decision.
- [ ] Quick intake creates a new Intake card.
- [ ] Dragging a card changes its stage after refresh.
- [ ] Run research creates a packet and moves the card to Explore.

## B. Matter workspace

- [ ] Matter header shows stage, risk, owner, and next action.
- [ ] Tree shows standard records and folders.
- [ ] Selecting Markdown opens editable content.
- [ ] Editable Markdown opens in a formatted WYSIWYG editor by default.
- [ ] Formatted and raw Markdown modes preserve headings, emphasis, links, quotes, and lists when toggled.
- [ ] Saving persists after refresh.
- [ ] `request.md` is read-only.
- [ ] Uploading a PDF or DOCX creates an extracted Markdown file.
- [ ] Primary action changes by stage: Review and decide, draft/review, approve, mark as sent, and close.
- [ ] Record durable decision appears only when the matter has a material choice.
- [ ] Approval, delivery, durable recording, and closure each persist as separate actions.
- [ ] A matter cannot close until delivery is complete and required work is done.

## C. Chat

- [ ] Mock mode answers without an API key.
- [ ] A real provider can answer when configured.
- [ ] “Move this to Research” invokes a tool and persists.
- [ ] “Create a work item…” writes a work-item file.
- [ ] “Draft a response and save it…” writes a Markdown artifact.
- [ ] Trace shows actions without hidden reasoning.
- [ ] Chat does not record a durable decision unless the user explicitly asks it to do so.

## D. Research

- [ ] Research reads request, facts, issues, company, and playbooks.
- [ ] Research writes a timestamped packet.
- [ ] Packet distinguishes internal and external sources.
- [ ] No-search mode remains useful and discloses that external search was not run.

## E. Decisions

- [ ] Decisions page loads records across matters.
- [ ] Past review date is Stale.
- [ ] Modified linked source is Review Recommended.
- [ ] Audit reason is visible.
- [ ] Decision opens its matter.

## F. Automations

- [ ] Automations page lists Markdown schedules.
- [ ] Run Now updates last run status.
- [ ] Chat can create an agent file.
- [ ] Chat can create a schedule referencing that agent.
- [ ] Inbox watcher creates a matter from a new supported file.

## G. Integrity

- [ ] Deleting the SQLite database and restarting rebuilds the same dashboard state.
- [ ] Attempts to read `../` outside the vault fail.
- [ ] Unknown Markdown handler keys do not execute.
- [ ] Failed mutations do not truncate existing files.

## H. Matter-led intake, sources, dossier, and work product

- [x] A new matter stores the original request and starts a saved intake conversation with the understanding check.
- [x] Question cards support suggested single choice, multiple choice, free text, progress, Skip, and No more questions without a default selection.
- [x] The question reason opens from its accessible control, and CSS also exposes it on hover and keyboard focus.
- [x] A meaningful answer produces a saved Matter updated card and starts non-blocking research without changing the stage itself.
- [x] Research status polls to completion and keeps the chat composer usable.
- [x] Matter chat and Today chat show multi-file and folder controls.
- [x] Uploading one file adds a source, preserves its stable reference, and asks for intent without adding a fact.
- [x] Document sets have Preview, one-time Apply, and grouped Undo behavior that preserves the uploaded files.
- [x] The dossier is editable, stores revisions, and keeps a generated revision separate when the current content hash changed.
- [x] Draft work product opens in the Markdown editor; Finalize creates an immutable file under Work Product → Final.
- [x] Settings → Company reads and writes the versioned `00_System/company.md` source.
- [x] Internal IDs are replaced by useful labels in the matter tree and normal matter artifacts.

Observed on 2026-08-28 with the local application and in-app browser. Full automated verification passed with 74 backend tests, frontend typecheck, and frontend production build. Browser checks covered Company save, matter creation and intake, card persistence after reload, reason disclosure, background research completion, one-file upload intent, dossier link, draft opening, finalization, both plus controls, and a clean browser console. The reduced-motion media rule was inspected in the built stylesheet; the browser session did not expose a live reduced-motion preference override.

## I. Guided skills

- [x] Skills appears between Agents and Automations.
- [x] The fixed question IDs appear as `job`, `success`, then `inputs`.
- [x] **Build it now** after question three opens `anything_else` before draft generation.
- [x] **No, build it** shows an editable draft without writing a skill file.
- [x] **Create skill** writes `00_System/skills/product-launch-review.md`.
- [x] Typing `/` in Beacon matter chat offers `/product-launch-review`.
- [x] Sending the command shows **Applied skill: Product Launch Review**, including after reload.
- [x] Existing chat attachments and cards remain available.
- [x] Mock repeated-work review shows the configured-model warning and no fabricated suggestion.
- [x] Suggestions never create or update a skill without **Create skill**.

Observed on 2026-08-28 with matter `MAT-DEMO-BEACON` in the in-app browser. The helper showed `job`, `success`, and `inputs` in order. **Build it now** then opened `anything_else`. **No, build it** produced an editable draft while the skill path was absent. **Create skill** wrote `00_System/skills/product-launch-review.md`. The slash menu offered the saved command. The assistant showed **Applied skill: Product Launch Review** immediately and after a reload. The attachment control, prompt cards, history, and editor remained available. In mock mode, **Find repeated work** showed `Repeated-work suggestions require a configured model.` and returned no suggestion. The skill file hash and modification time did not change during that review. Focused backend proof passed with 46 tests. Frontend typecheck and production build passed and included `/skills`. Full verification reported 96 passed and the same three Apex sample-annotation failures. The previous malformed-Harbor failure now passes because the frontmatter reader accepts indented Markdown horizontal rules inside stored chat content.

## J. Live UI and wording review

- [x] Today, Workspace, Matters, Decisions, Agents, Skills, Automations, and Settings load with the shared navigation and no browser console errors.
- [x] Matters stage, table, timeline, and high-risk views render the expected records.
- [x] Every Settings section loads and keeps its controls within the page width.
- [x] The Beacon matter shows its contents, saved chat, applied-skill label, chat controls, matter overview, and Markdown editor.
- [x] Matter and Today chat offer the saved slash command, and the explicit helper phrase opens Skills without creating a chat message.
- [x] The complete five-question skill interview supports the rules **Something else** field, final optional question, draft generation, and saved-skill editing.
- [x] Repeated-work review shows progress, excludes invocations of existing skills, uses stored evidence, and clears its suggestion cards when the lawyer starts building.
- [x] Skills, Agents, and Settings stack without horizontal overflow at 1,024 and 768 pixels.

Observed on 2026-08-28 in the in-app browser. The review found and fixed six defects: existing skill commands could be suggested as new skills; suggestion cards remained after moving into the builder; long model requests had no visible progress state; an empty completed review had no result message; several pages exposed technical or design-only wording; and the Skills and Agents rails stayed 280 pixels wide after the admin layout stacked. The repeated browser pass confirmed the fixes. Focused backend proof passed with 47 tests. Frontend typecheck and production build passed. Full verification reported 97 passed and only the three known Apex sample-annotation failures.

## K. Real-world legal use cases

- [x] A product lawyer can apply a saved launch-review skill and receive a supported go-with-conditions recommendation.
- [x] The launch review identifies sources, assumptions, legal issues, and the decision counsel must make.
- [x] A customer-response review flags admissions, control disclosures, policy conflicts, and promises that may not be kept.
- [x] The response review gives exact edits and does not send, approve, record a decision, or change matter records.
- [x] Today chat separates a passed decision-review date from a linked source that changed.
- [x] A chat-based decision check is read-only when the lawyer says not to change records.
- [x] Repeated-work review uses stored user messages and only pre-fills a new skill interview.

Observed on 2026-08-28 with the configured real provider and the in-app browser. In Project Apex, `/product-launch-review` returned **Go with conditions**, cited the matter record, stated material assumptions, and identified retention and model-training choices. **Applied skill: Product Launch Review** remained after reload. In Harbor, the assistant reviewed the saved customer response, found four concrete risks, proposed exact edits, and left approval, delivery, decisions, and matter files unchanged. In Today, the assistant correctly separated the Apex passed review date from the Mason changed-source trigger. This test found one record-integrity defect: the chat decision-check tool refreshed `audited_at` even after a no-change instruction. Chat-based checks are now read-only; the explicit Decisions-page audit remains the write action. A live repeat showed `Checked 2 decision(s); 2 need review.` and unchanged hashes for both decision files. Repeated-work review returned three suggestions, each backed by two stored user messages, and **Build this skill** only prefilled the helper. Focused backend proof passed 50 tests. Frontend typecheck and production build passed with `/skills`. Full verification reported 98 passed and only the three known Apex sample-annotation failures.

## L. Document review and export

- [x] Selecting an uploaded DOCX or text-based PDF opens its editable Markdown companion.
- [x] Track Changes records typed edits against a saved baseline.
- [x] Agent replacement language becomes a reviewable redline for existing work product.
- [x] Review mode shows insertions and deletions and supports individual or bulk accept/reject.
- [x] A comment can be attached to selected editor text and resolved.
- [x] DOCX export contains native `w:ins`, `w:del`, and Word comment parts.
- [x] PDF export contains standard underline, strikeout, and highlight annotations.
- [x] Generated Word and PDF pages render without clipping or overlap.

Observed on 2026-08-28 with focused backend tests, structural OOXML/PDF checks, rendered output pages, and the in-app browser. The live editor check covered the Track Changes switch, inline review view, individual reject, bulk accept, and turning tracking off after review. Frontend typecheck passed. The full backend suite reported 103 passing tests and the same three known Apex sample-annotation failures.

## Isolated browser testing

Run browser tests against a temporary copy of the vault. Do not let acceptance
actions or the disposable SQLite index change the repository vault.

1. Create a temporary directory with `mktemp -d`.
2. Copy `vault/` into it with `rsync -a --exclude '.counsel_os_cache.db'`.
3. Start a fresh backend with `VAULT_PATH` set to the temporary directory.
4. Run the browser checks against that backend.
5. Stop the backend and frontend.
6. Confirm that the path is under `/tmp/` or `/var/folders/`, then remove only
   that temporary directory.

Use a shell `trap` for cleanup so the copied vault is removed after a successful
check, a failed check, or an interruption. Compare repository-vault hashes before
and after the browser run. Treat a changed repository hash as a failed check.

## Planned friction-audit demo

This earlier plan is kept for history. Section N supersedes it for the next
browser walk.

- [ ] Open Today, Workspace, and Matters with the same vault.
- [ ] Confirm that each count has a precise scope. Today shows all attention items. Workspace states how many matters await judgment. Matters shows separate overdue, waiting, and agent-working counts.
- [ ] Confirm that Today does not say work is waiting on someone else when the page lists work for the lawyer.
- [ ] Confirm that the Coming up section does not claim there is nothing to do.
- [ ] Open Project Apex at 1280 by 720.
- [ ] Confirm that the question, proposed path, and primary action are visible without a 60-pixel overview window.
- [ ] Select Review and decide. Confirm that a focused review state opens. It must not only put text in chat.
- [ ] Open Record this decision. Confirm that the proposed path is prefilled, unresolved assumptions stay outside the decision text, and no decision is written before submit.
- [ ] Edit and record the decision. Confirm that the register shows the real matter title and the complete review reason.
- [ ] Open a saved long chat answer. Confirm that the answer appears before a closed Actions taken disclosure and that Focus answer widens the reading area without changing records.
- [ ] Open a research note answer. Confirm that headings, emphasis, code, lists, and links render as Markdown.
- [ ] Open Settings. Confirm that only controls with real behavior are shown. There must be no fake people, access, integrations, citation gate, spend gate, retention, or reconnect state.
- [ ] Open Agents. Confirm that the default view uses plain language, technical permissions are under Advanced controls, and only Save and Discard remain.
- [ ] Open Skills, Automations, and Matters. Confirm the simplified entry actions, honest run labels, consistent dates, and conditional Owner column.
- [ ] Confirm that the browser-test matter is absent from all normal views.
- [ ] Complete the relevant browser acceptance tests with no console errors.

## Friction-audit UI observed on 2026-08-28

The isolated browser run used a copied vault and ports 3100 and 8100. The
repository-vault guard reported no hash mismatch when the backend stopped.

- Today showed a broad six-item attention total with its overdue, judgment,
  decision, and schedule breakdown. Workspace showed two matters awaiting
  judgment. Matters kept overdue, waiting, and agent-working counts separate.
- Project Apex kept 246 visible pixels for the overview at 1280 by 720. The
  question, limited-launch proposal, primary action, open questions, evidence,
  and long saved answer were available in the same reading path.
- Review and decide opened a focused local layout and did not seed chat. The
  decision modal prefilled only the labelled limited-launch path and the legal
  owner. Opening the modal did not create a decision. Final submit created a
  decision in the copied vault, and the register showed the real matter title.
- Saved chat showed a human skill label, the answer before a closed Actions
  taken disclosure, and Focus answer and Restore workspace controls. The
  controls and disclosures use native keyboard-accessible elements.
- The research packet rendered Markdown headings and lists. Research-note
  answers use the same Markdown renderer with raw HTML disabled.
- Settings showed only Company and model controls. Reasoning effort changed
  from `default` to `high`, survived reload, and was restored to `default`.
  Provider `openai_compatible` and model `deepseek-v4-flash` were unchanged.
- Agents showed Themis as the user-facing name and Counsel Copilot as the role.
  Skills showed one Build a skill action and one Find repeated work action.
  Automations used Run once for the paused schedule. The test matter was absent.
- Today, Workspace, Matters, Decisions, Agents, Skills, Automations, Settings,
  and the Beacon matter had no horizontal overflow at 1,024 or 768 pixels.
  Project Apex had no horizontal overflow at 1,280 pixels. Matters table headers
  rendered in sentence case. The browser console had no errors.

## M. Derived matter work state

- [x] Create a matter with no target date. Confirm that its first required work item is assigned to Brian Harris.
- [x] Move the matter to Research. Confirm that it stays in the Research column and says **Waiting on Brian Harris**, not **Themis is working**.
- [x] Confirm that the matter card, table, matter header, Today summary, and agent context use the same `next_action` and `work_state` result.
- [x] Confirm that the displayed next owner comes from the selected required work item.
- [x] Add a saved research-run record with `state: running`. Confirm through the API that `execution_state` is `running` and the signal says **Themis is working**.
- [x] Change the saved research-run record to `completed`. Confirm that the signal returns to the work-item owner or **Needs assignment**.
- [x] Delete the disposable SQLite index and restart. Confirm that the same `work_state` is derived from Markdown.
- [x] Confirm that the browser console has no errors and that the repository vault hash is unchanged.

Observed on 2026-08-28 with an isolated vault and the in-app browser. A new
no-target-date matter stayed in Research and showed **Waiting on Brian
Harris**, **Orient to the request**, and Brian Harris as the next owner on the
matter header, card, table, and Today. The running-to-completed transition was
proved by the focused backend integration suite. Deleting and rebuilding the
temporary SQLite index preserved the same `work_state`. The browser console
had no errors. The repository-vault guard matched before and after for all
durable files except `00_System/schedules/inbox-watcher.md`, which a
pre-existing live scheduler updates independently; disposable SQLite files
were also excluded.

## N. Planned attention-audit acceptance walk

These checks are planned. They do not record observed results. Run them in an
isolated browser session as described above.

### Matter model and workspace

- [x] Confirm that the matter is the full work container. Identity, ownership, stage, risk, dates, work, decisions, research, chat, files, and events attach to the matter.
- [x] Confirm that Dossier appears only when `dossier.md` exists. A matter without a dossier still has a complete overview from its matter, request, work-item, and orientation data.
- [x] Confirm that a dossier is an optional, editable summary. It does not replace the matter and is not created only to support the interface.
- [x] Open a matter at 1280 by 720 with the document pane collapsed. Confirm that the open tree is 210–250 pixels wide, remains resizable, and keeps its 210-pixel minimum.
- [x] Open a matter with no `file` query. Confirm that no hidden Matter Records node looks selected.
- [x] From that same state, send a new chat message. Confirm that the agent request still uses `matter.md` as the active file and default matter context.
- [x] Confirm that the first tree level shows Original request, Documents, Chats, Research, Work product, Dossier only when present, and Legacy Drafts only when present.
- [x] Confirm that Matter Records is collapsed initially and shows this helper text: `Structured records captured from intake, documents, chat, lawyer edits, and system actions.`
- [x] Confirm the exact Matter Records mapping: `matter.md` → Matter details; `facts.md` → Facts, sources & assumptions; `issues.md` → Issue map; `participants.md` → People & roles; `recommendations.md` → Working recommendations; `work-items/` → Work to do; `decisions/` → Recorded decisions; `events/` → Activity history; `dossier-revisions/` → Dossier revisions.
- [x] Open every Matter Records item. Confirm that each item opens its original vault path once and that no file or folder is lost or duplicated.
- [x] Confirm that source or action provenance appears only when current data supports it. The interface must not label all facts as extracted or invent provenance.

### Recommendations, decisions, and generated work

- [x] Confirm that a recommendation is not shown as a recorded decision and does not enter the decision register without an explicit user action or instruction.
- [x] Select the primary decision action. Confirm that it opens the record modal directly, without a separate focused-review step.
- [x] Confirm that the modal labels the prefilled decision as a Themis draft and lets the lawyer edit it.
- [x] Confirm that the rationale is visible and editable before recording. It can be empty, but it must not store a hidden orientation value.
- [x] Confirm that the decider defaults only from the matter legal owner. Decision and decider are required before submit.
- [x] Open and cancel the modal. Confirm that no decision is written. Then use the final explicit record action and confirm that exactly one decision is written.
- [x] Open a full assistant answer. Confirm that the full block, not only a small icon, uses the dashed iris agent treatment and is labelled `Themis`.
- [x] Confirm that `Themis · Not yet reviewed by an attorney` appears only on qualifying generated work product with an explicit current unreviewed state.
- [x] Confirm that `Actions taken (N)` follows the answer in a closed disclosure.

### Readability, state language, and administration

- [x] At 1280 by 720, 1024 pixels wide, and 768 pixels wide, confirm that tables use at least 15-pixel readable body text, strong contrast, wrapping text, and responsive rows without horizontal overflow.
- [x] Confirm that decision pages and counts use only `Recorded` and `Needs review`. Confirm that recommendations remain outside the recorded-decision table.
- [x] Pause a schedule and then select `Resume schedule`. Confirm that it becomes active, keeps its saved interval and last-run state, and receives a future `next_run_at` without running immediately.
- [x] Confirm that active schedules show `Pause schedule` and `Run it now`; paused schedules show `Resume schedule` and `Run it now`; failed runs use `Retry now`.
- [x] Open Settings. Confirm that the current model has a simple summary and that provider, exact model, and reasoning effort are under `Advanced model options`. Confirm that saved hidden keys remain unchanged.
- [x] Open Agents. Confirm that Themis appears as the name, Counsel Copilot as the role, and purpose appears before technical details. Confirm that standing Markdown instructions, tool permissions, and file paths are under `Advanced controls`.
- [x] Open Skills. Confirm that it says `A skill is reusable guidance for one chat request.` Confirm that the primary action builds a skill, the secondary action finds repeated work, and a saved skill shows its name, purpose, and use. Confirm that the requested raw prompt remains available under a clear label or Advanced details.
- [x] Open one research note with no citations. Confirm that it says `No cited sources` once, does not say `unreviewed`, and still shows the useful answer.
- [x] Confirm that research shows source provenance only when supported and never invents or implies verification of a source.

Observed on 2026-08-28 with a copied temporary vault and the in-app browser.
At 1280 by 720, the initial tree measured 237.67 pixels. No tree item was
selected without a file route. The workspace still loaded `matter.md` as the
active document. A browser message sent through a local mock provider was
captured at the temporary API boundary with
`active_file: 03_Matters/project-apex-ai/matter.md`; no configured external
model was contacted.
Project Apex worked without a dossier, while Relay showed one Dossier entry.
The record labels were unique, each available record opened or expanded once,
and the original vault paths remained unchanged.

The decision modal opened from the primary action. Decision, rationale, and
decider were editable. Cancel kept the decision count at one. Final submit
increased it to two and created one matching browser-test decision. A paused
weekly schedule resumed with its 604800-second interval, unchanged never-run
state, and a future `next_run_at` without an immediate run. A temporary
no-citation research note showed `No cited sources` once, omitted `unreviewed`,
and kept its useful answer.

Today, Workspace, Matters, Decisions, Agents, Skills, Automations, Settings,
and the Project Apex matter had no horizontal overflow at 1,024 or 768 pixels.
The 1,280-pixel decision table used 15-pixel body text, full dates, full review
reasons, and consistent state words. The pane separator responded to keyboard
resizing, disclosures and tree controls kept native semantics, and the browser
console had no errors. The repository-vault hash was
`f52bcd1186818d6bdecc8b570dfd238cea97775f` before and after the run. The
temporary runtime directory was moved to Trash after both servers stopped.

## O. Continuous Legal Awareness and Decision Maintenance

These checks are planned for final integration. They do not record an observed
result. Use the isolated browser procedure above.

### Watch Builder and scans

- [ ] Confirm that Today and Briefing are separate. Today contains only
  required attention. At least one useful item remains Briefing-only.
- [ ] Start Watch Builder in plain language. Confirm that it infers defaults,
  asks one material question at a time, and saves an editable Markdown Watch.
- [ ] Confirm that Native, Polaris, and Both survive save, reload, and editing.
- [ ] Confirm that source type and Watch role are separate. Change a source
  among Primary, Secondary, Discovery only, and Excluded and reload it.
- [ ] Select **Scan now** on a draft. Confirm that the run survives refresh and
  that no enabled schedule is created.
- [ ] Confirm that scan output names each provider and shows source coverage,
  warnings, created items, and final state.
- [ ] In Both mode, make one provider fail. Confirm that the other provider's
  useful output remains and the run says **Partial**.
- [ ] Select **Start Watch**. Confirm that one enabled schedule is linked to the
  Watch. Pause it and run it manually. Confirm that the manual scan does not
  change saved cadence.

### Briefing and review

- [ ] Search, filter, sort, and group Briefing. Confirm that the URL changes and
  state survives refresh and browser Back.
- [ ] Create, rename, restore, and delete a saved view. Create a digest, change
  the view, and confirm that the old digest remains unchanged.
- [ ] Open a Briefing item. Confirm that it shows stored provenance and honest
  Supplied, Retrieved, Verified, or Unverified lead labels.
- [ ] Confirm that a Polaris citation starts as **Supplied**, not **Verified**.
- [ ] Ask Counsel OS about the item and request more research. Confirm that
  useful partial text remains visible with warnings when a support step fails.
- [ ] Connect one item to a matter and one to a decision. Confirm that the
  decision-linked item produces a focused review packet.
- [ ] Open and cancel the packet. Confirm that no decision, mitigation, or
  outcome record changes.
- [ ] With isolated fixtures, record Keep current, Revise decision, Create
  follow-up, Not relevant, and Keep monitoring. Confirm that the original
  decision body remains intact.
- [ ] Record a mitigation explicitly and confirm that it appears on the linked
  matter. Confirm that a generated packet alone never creates it.

### Trust boundary and isolation

- [ ] Capture outbound native and Polaris requests. Confirm that they contain
  only the immutable public query and public source instructions. They must not
  contain company facts, matter IDs, internal paths, decisions, mitigations,
  email addresses, or document excerpts.
- [ ] Put a private identifier in each editable free-text query position.
  Confirm that validation returns 422 and makes zero provider network calls.
- [ ] Change an internal fact and scan again. Confirm that local matching
  changes without adding the fact to an outbound request.
- [ ] Confirm that the browser console has no errors and that the repository
  vault hash is unchanged before and after the full run.

## P. Matter workflow reliability

These checks were completed with the isolated browser procedure above.

### Files and work products

- [x] Save and reload all three **Files and outputs** settings. Confirm that
  `00_System/settings.md` stores the values and new sources, drafts, and finals
  use the configured matter-relative folders.
- [x] Enter an absolute path, a traversal path, an overlapping folder, and a
  protected matter-record path. Confirm that each value is rejected and that
  no file is written outside the matter or over a protected record.
- [x] Finalize one unchanged draft twice. Confirm that both requests return the
  same final path and ID and that only one immutable final exists.
- [x] Edit that draft and finalize it again. Confirm that a new immutable final
  is created and that the earlier final remains unchanged and can still open.

### Exact workflow changes

- [x] Ask for drafting without approval, delivery, or closure language.
  Confirm that lifecycle tools are not available for that message. Then ask
  for each lifecycle action explicitly and confirm that only the requested
  tool is available.
- [x] Complete one selected work item by exact ID. Confirm that its siblings
  remain open and that a retry does not change its first completion time or
  create a second stable event.
- [x] Keep required work open after delivery. Confirm that required work stays
  the primary action and that **Close matter** stays visible as a separate
  lifecycle action. Confirm that closure fails and names the unfinished items.
- [x] Approve, mark sent, and close through successful structured actions.
  Confirm that `matter.md` persists the artifact, actor, first timestamp, and
  event path. Confirm that retries do not change first timestamps or duplicate
  stable events.
- [x] Force model prose that claims a workspace change without a successful
  mutation tool. Confirm that the UI shows **No workspace state change
  recorded**, shows no success card, and makes no durable change.

### Research, company, and progress

- [x] Run research twice before review. Confirm that both runs reuse one open
  research-review work item. Complete it, run research again, and confirm that
  exactly one new review item is created.
- [x] Enter `leave blank` for the company website. Confirm that Website remains
  blank. Enter a public HTTPS URL and confirm that **Website read** appears only
  when the backend reports that it used the site.
- [x] Use a blocked or unreadable website. Confirm that one warning appears and
  that the company interview continues with useful output.
- [x] Start a slow chat or interview request. Confirm that the UI shows honest
  elapsed time, no percentage, backend phase, or ETA; prevents a duplicate
  submit; and leaves safe navigation and existing documents usable.

Observed on 2026-08-30 with two temporary vault copies and the in-app browser.
The first walk covered configured file placement, upload, draft editing,
unchanged and changed finalization, required-work priority, exact completion,
approval, reload, delivery, blocked and successful closure, retry timestamps
and event counts, false mutation prose, research-review reuse, website status,
warnings, and elapsed progress. The correction walk confirmed the exact
**Open artifact** and **Finalize** actions, direct **Complete work item** action,
expanded no-change wording, and the non-repeating **Leave blank** flow. Focused
tests covered lifecycle tool exposure and cross-matter symbolic-link rejection.
The browser console had no errors. The repository-vault hash was
`79bd335cfd0d61327ee0696bcde3d919e381908910f8c124f9ddf6031d945964`
before and after both walks. Both temporary vaults were moved to Trash after
their servers stopped.

## Q. Middle pane, review labels, and vault selection

These checks are planned. They do not record observed browser results.

- [ ] Open a matter at normal and short viewport heights. Confirm that
  **Overview** and **Chat with Themis** remain visible as two headers and that
  the selected section uses the available middle-pane height.
- [ ] Type an unsent chat message, add attachments, select a saved
  conversation, and switch sections. Confirm that chat state and scroll state
  remain intact and that the left tree and right document pane do not collapse.
- [ ] Use a saved conversation, new chat, and seeded chat action. Confirm that
  each action opens **Chat with Themis**. Confirm that both headers are keyboard
  buttons with matching expanded state and labelled regions.
- [ ] Confirm that ordinary matter chat, company interview, and Briefing
  answers use `Themis`. Confirm that only an unsaved generated company-profile
  draft and an open generated review packet use
  `Themis · Not yet reviewed by an attorney`.
- [ ] In Settings → Vaults, confirm the current vault name and exact path.
  Create a blank vault at a new absolute path. Confirm that it has no user work,
  can create one matter, and can complete one mock chat.
- [ ] Load an existing current-format vault. Confirm that the prior vault is
  unchanged, no files were moved or deleted, and the page navigates to `/`.
- [ ] Restart with a different repository `VAULT_PATH`. Confirm that a valid
  `.counsel-os/active-vault.json` selection wins and each vault uses its own
  disposable SQLite index.
- [ ] Attempt unsafe, overlapping, aliased, and symlink-escaping paths. Confirm
  that each is rejected without a partial target or authoritative-file change.
- [ ] Attempt a switch during a request lease, scheduled task, and research
  run. Confirm that the switch waits for the lease and returns **Busy** for
  active work without cancelling it.
