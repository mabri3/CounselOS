# Acceptance tests

## Matter review and decision map (September 5, 2026)

Use the 15-step browser demo in `docs/matter-review-decision-map.plan.md` and the
current results in `docs/matter-review-decision-map.verification.md`. Do not
treat earlier checks in this file as proof of this implementation.

Use an isolated vault with six issues, shared questions, incomplete evidence,
a recorded decision, three work products, and two sources. Verify review order,
claim-specific passages, direct dispositions, canonical mitigation work, and
the separate map with explicit hypothetical adoption. Verify document switching,
source return, the named draft action target, and separate unsaved edits.
Completing work must not resolve the issue or close the matter. A source view
must not change request context. Repeat at the specified desktop and narrow
sizes, with keyboard use and native 200% zoom. Record blocked checks explicitly.

Run focused regression checks for a material correction. Do not repeat broad
suites without a new reason.

## MVP closure rule

The original check marks below are historical evidence, not a blanket current
pass. During the canonical closure checkpoint, record every unchecked, failed,
or stale item in `docs/MVP_CLOSURE_AUDIT.md`. A non-Later item is closed only
after current automated or browser proof. It may be marked historical or
superseded only when current evidence proves that disposition. Do not move an
unfinished item to another plan or to Later unless it matches the explicit
Later list in `current.md`.

**Current verification — 2026-08-30:** Sections A–G were rechecked through
the current 495-test backend suite and the isolated browser run. The browser
run loaded Today, a real configured provider, the five-provider status view,
a saved matter, direct Chat, the matter tree, and the editable dossier with no
console errors. The suite directly covers stage changes, files, chat tools,
research, decisions, schedules, index rebuild, path isolation, handler
allow-lists, and atomic write failure.

## A. Command center

- [x] Sample matters load in all configured stages.
- [x] Attention Required shows the stale sample decision.
- [x] Quick intake creates a new Intake card.
- [x] Dragging a card changes its stage after refresh.
- [x] Run research creates a packet and moves the card to Explore.

## B. Matter workspace

- [x] Matter header shows stage, risk, owner, and next action.
- [x] Tree shows standard records and folders.
- [x] Selecting Markdown opens editable content.
- [x] Editable Markdown opens in a formatted WYSIWYG editor by default.
- [x] Formatted and raw Markdown modes preserve headings, emphasis, links, quotes, and lists when toggled.
- [x] Saving persists after refresh.
- [x] `request.md` is read-only.
- [x] Uploading a PDF or DOCX creates an extracted Markdown file.
- [x] Primary action changes by stage: Review and decide, draft/review, approve, mark as sent, and close.
- [x] Record durable decision appears only when the matter has a material choice.
- [x] Approval, delivery, durable recording, and closure each persist as separate actions.
- [x] A matter cannot close until delivery is complete and required work is done.

## C. Chat

- [x] Mock mode answers without an API key.
- [x] A real provider can answer when configured.
- [x] “Move this to Research” invokes a tool and persists.
- [x] “Create a work item…” writes a work-item file.
- [x] “Draft a response and save it…” writes a Markdown artifact.
- [x] Trace shows actions without hidden reasoning.
- [x] Chat does not record a durable decision unless the user explicitly asks it to do so.

## D. Research

- [x] Research reads request, facts, issues, company, and playbooks.
- [x] Research writes a timestamped packet.
- [x] Packet distinguishes internal and external sources.
- [x] No-search mode remains useful and discloses that external search was not run.

## E. Decisions

- [x] Decisions page loads records across matters.
- [x] Past review date is Stale.
- [x] Modified linked source is Review Recommended.
- [x] Audit reason is visible.
- [x] Decision opens its matter.

## F. Automations

- [x] Automations page lists Markdown schedules.
- [x] Run Now updates last run status.
- [x] Chat can create an agent file.
- [x] Chat can create a schedule referencing that agent.
- [x] Inbox watcher creates a matter from a new supported file.

## G. Integrity

- [x] Deleting the SQLite database and restarting rebuilds the same dashboard state.
- [x] Attempts to read `../` outside the vault fail.
- [x] Unknown Markdown handler keys do not execute.
- [x] Failed mutations do not truncate existing files.

## H. Matter-led intake, sources, dossier, and work product

**Status correction — 2026-08-30:** These checks record the deterministic
matter-led slice observed on 2026-08-28. They do not prove the approved
adaptive LLM intake. The live product still showed a context-free fixed
understanding card with a hard-coded question count and opened Overview before
chat. Re-run this section under the canonical closure checkpoint. Preserve the
historical checks below, but do not use them as current proof of adaptive
intake.

**Resolution — 2026-08-30:** The canonical isolated run now opens the new
matter directly in Chat, shows the reading state, saves a request-specific
answer and question, and writes the canonical dossier. Current intake, chat
run, matter-record, dossier, and research tests replace the stale defect note.

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

## Historical friction-audit demo

This earlier plan is kept for history. Its checks were observed on 2026-08-28
and are recorded in the evidence section directly below. Section N is the
newer acceptance vocabulary.

- [x] Open Today, Workspace, and Matters with the same vault.
- [x] Confirm that each count has a precise scope. Today shows all attention items. Workspace states how many matters await judgment. Matters shows separate overdue, waiting, and agent-working counts.
- [x] Confirm that Today does not say work is waiting on someone else when the page lists work for the lawyer.
- [x] Confirm that the Coming up section does not claim there is nothing to do.
- [x] Open Project Apex at 1280 by 720.
- [x] Confirm that the question, proposed path, and primary action are visible without a 60-pixel overview window.
- [x] Select Review and decide. Confirm that a focused review state opens. It must not only put text in chat.
- [x] Open Record this decision. Confirm that the proposed path is prefilled, unresolved assumptions stay outside the decision text, and no decision is written before submit.
- [x] Edit and record the decision. Confirm that the register shows the real matter title and the complete review reason.
- [x] Open a saved long chat answer. Confirm that the answer appears before a closed Actions taken disclosure and that Focus answer widens the reading area without changing records.
- [x] Open a research note answer. Confirm that headings, emphasis, code, lists, and links render as Markdown.
- [x] Open Settings. Confirm that only controls with real behavior are shown. There must be no fake people, access, integrations, citation gate, spend gate, retention, or reconnect state.
- [x] Open Agents. Confirm that the default view uses plain language, technical permissions are under Advanced controls, and only Save and Discard remain.
- [x] Open Skills, Automations, and Matters. Confirm the simplified entry actions, honest run labels, consistent dates, and conditional Owner column.
- [x] Confirm that the browser-test matter is absent from all normal views.
- [x] Complete the relevant browser acceptance tests with no console errors.

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
- Agents showed Themis.ai as the user-facing name and Workspace assistant as the role.
  Skills showed one Build a skill action and one Find repeated work action.
  Automations used Run once for the paused schedule. The test matter was absent.
- Today, Workspace, Matters, Decisions, Agents, Skills, Automations, Settings,
  and the Beacon matter had no horizontal overflow at 1,024 or 768 pixels.
  Project Apex had no horizontal overflow at 1,280 pixels. Matters table headers
  rendered in sentence case. The browser console had no errors.

## M. Derived matter work state

- [x] Create a matter with no target date. Confirm that its first required work item is assigned to Brian Harris.
- [x] Move the matter to Research. Confirm that it stays in the Research column and says **Waiting on Brian Harris**, not **Themis.ai is working**.
- [x] Confirm that the matter card, table, matter header, Today summary, and agent context use the same `next_action` and `work_state` result.
- [x] Confirm that the displayed next owner comes from the selected required work item.
- [x] Add a saved research-run record with `state: running`. Confirm through the API that `execution_state` is `running` and the signal says **Themis.ai is working**.
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
- [x] Confirm that the modal labels the prefilled decision as a Themis.ai draft and lets the lawyer edit it.
- [x] Confirm that the rationale is visible and editable before recording. It can be empty, but it must not store a hidden orientation value.
- [x] Confirm that the decider defaults only from the matter legal owner. Decision and decider are required before submit.
- [x] Open and cancel the modal. Confirm that no decision is written. Then use the final explicit record action and confirm that exactly one decision is written.
- [x] Open a full assistant answer. Confirm that the full block, not only a small icon, uses the dashed iris agent treatment and is labelled `Themis.ai`.
- [x] Confirm that `Themis.ai · Not yet reviewed by an attorney` appears only on qualifying generated work product with an explicit current unreviewed state.
- [x] Confirm that `Actions taken (N)` follows the answer in a closed disclosure.

### Readability, state language, and administration

- [x] At 1280 by 720, 1024 pixels wide, and 768 pixels wide, confirm that tables use at least 15-pixel readable body text, strong contrast, wrapping text, and responsive rows without horizontal overflow.
- [x] Confirm that decision pages and counts use only `Recorded` and `Needs review`. Confirm that recommendations remain outside the recorded-decision table.
- [x] Pause a schedule and then select `Resume schedule`. Confirm that it becomes active, keeps its saved interval and last-run state, and receives a future `next_run_at` without running immediately.
- [x] Confirm that active schedules show `Pause schedule` and `Run it now`; paused schedules show `Resume schedule` and `Run it now`; failed runs use `Retry now`.
- [x] Open Settings. Confirm that the current model has a simple summary and that provider, exact model, and reasoning effort are under `Advanced model options`. Confirm that saved hidden keys remain unchanged.
- [x] Open Agents. Confirm that Themis.ai appears as the name, Workspace assistant as the role, and purpose appears before technical details. Confirm that standing Markdown instructions, tool permissions, and file paths are under `Advanced controls`.
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

**Verified — 2026-08-30:** The completed Continuous Legal Awareness browser
acceptance is recorded in
`docs/continuous-legal-awareness.handoff-progress.md`. The current 495-test
suite rechecked Watch persistence, provider isolation, partial results,
Briefing navigation and saved views, immutable digests, source states, review
outcomes, mitigations, outbound privacy, and hostile input. These checks are
current acceptance evidence, not a future plan.

### Watch Builder and scans

- [x] Confirm that Today and Briefing are separate. Today contains only
  required attention. At least one useful item remains Briefing-only.
- [x] Start Watch Builder in plain language. Confirm that it infers defaults,
  asks one material question at a time, and saves an editable Markdown Watch.
- [x] Confirm that Native, Polaris, and Both survive save, reload, and editing.
- [x] Confirm that source type and Watch role are separate. Change a source
  among Primary, Secondary, Discovery only, and Excluded and reload it.
- [x] Select **Scan now** on a draft. Confirm that the run survives refresh and
  that no enabled schedule is created.
- [x] Confirm that scan output names each provider and shows source coverage,
  warnings, created items, and final state.
- [x] In Both mode, make one provider fail. Confirm that the other provider's
  useful output remains and the run says **Partial**.
- [x] Select **Start Watch**. Confirm that one enabled schedule is linked to the
  Watch. Pause it and run it manually. Confirm that the manual scan does not
  change saved cadence.

### Briefing and review

- [x] Search, filter, sort, and group Briefing. Confirm that the URL changes and
  state survives refresh and browser Back.
- [x] Create, rename, restore, and delete a saved view. Create a digest, change
  the view, and confirm that the old digest remains unchanged.
- [x] Open a Briefing item. Confirm that it shows stored provenance and honest
  Supplied, Retrieved, Verified, or Unverified lead labels.
- [x] Confirm that a Polaris citation starts as **Supplied**, not **Verified**.
- [x] Ask Themis.ai about the item and request more research. Confirm that
  useful partial text remains visible with warnings when a support step fails.
- [x] Connect one item to a matter and one to a decision. Confirm that the
  decision-linked item produces a focused review packet.
- [x] Open and cancel the packet. Confirm that no decision, mitigation, or
  outcome record changes.
- [x] With isolated fixtures, record Keep current, Revise decision, Create
  follow-up, Not relevant, and Keep monitoring. Confirm that the original
  decision body remains intact.
- [x] Record a mitigation explicitly and confirm that it appears on the linked
  matter. Confirm that a generated packet alone never creates it.

### Trust boundary and isolation

- [x] Capture outbound native and Polaris requests. Confirm that they contain
  only the immutable public query and public source instructions. They must not
  contain company facts, matter IDs, internal paths, decisions, mitigations,
  email addresses, or document excerpts.
- [x] Put a private identifier in each editable free-text query position.
  Confirm that validation returns 422 and makes zero provider network calls.
- [x] Change an internal fact and scan again. Confirm that local matching
  changes without adding the fact to an outbound request.
- [x] Confirm that the browser console has no errors and that the repository
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

**Verified — 2026-08-30:** The current isolated browser run rechecked the two
middle-pane headers, direct Chat opening, the saved conversation, matter tree,
document pane, Themis.ai labels, and the exact Vault and provider administration
surfaces. `tests/test_vault_management.py`, `tests/test_active_context.py`,
the chat recovery check, and the full suite cover blank/load/restart selection,
path rejection, lease waiting, active-work Busy behavior, state preservation,
and provider cleanup.

- [x] Open a matter at normal and short viewport heights. Confirm that
  **Overview** and **Chat with Themis.ai** remain visible as two headers and that
  the selected section uses the available middle-pane height.
- [x] Type an unsent chat message, add attachments, select a saved
  conversation, and switch sections. Confirm that chat state and scroll state
  remain intact and that the left tree and right document pane do not collapse.
- [x] Use a saved conversation, new chat, and seeded chat action. Confirm that
  each action opens **Chat with Themis.ai**. Confirm that both headers are keyboard
  buttons with matching expanded state and labelled regions.
- [x] Confirm that ordinary matter chat, company interview, and Briefing
  answers use `Themis.ai`. Confirm that only an unsaved generated company-profile
  draft and an open generated review packet use
  `Themis.ai · Not yet reviewed by an attorney`.
- [x] In Settings → Vaults, confirm the current vault name and exact path.
  Create a blank vault at a new absolute path. Confirm that it has no user work,
  can create one matter, and can complete one mock chat.
- [x] Load an existing current-format vault. Confirm that the prior vault is
  unchanged, no files were moved or deleted, and the page navigates to `/`.
- [x] Restart with a different repository `VAULT_PATH`. Confirm that a valid
  `.counsel-os/active-vault.json` selection wins and each vault uses its own
  disposable SQLite index.
- [x] Attempt unsafe, overlapping, aliased, and symlink-escaping paths. Confirm
  that each is rejected without a partial target or authoritative-file change.
- [x] Attempt a switch during a request lease, scheduled task, and research
  run. Confirm that the switch waits for the lease and returns **Busy** for
  active work without cancelling it.

## R. Canonical MVP closure

These checks are part of the active closure checkpoint. Run them with an
isolated vault after the final code change.

**Verification — 2026-08-30:** The checks below use the isolated BSA/AML
browser walk plus the provider, routing, intake, records, dossier, research,
privacy, hostile-output, restart, and persistence tests in the 482-test full
backend suite. Frontend contract checks, typecheck, and production build also
passed. Optional live credentials were absent and their unavailable states
were shown honestly.

### Per-agent model routing

- [x] Settings shows Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and
  Antigravity CLI with honest readiness details and model catalogs.
- [x] Set Intake Agent and Research Agent to different provider, model, and
  reasoning-effort combinations. Confirm save, reload, backend restart, and
  the recorded run snapshots preserve each selection.
- [x] Confirm that an agent with empty overrides uses the workspace default.
  Confirm that an explicit unavailable selection fails visibly and does not
  silently use another provider or model.
- [x] Confirm that CLI-backed providers expose only the typed tools allowed by
  the selected Themis.ai agent and do not expose shell, file, browser, app, or
  plugin tools.

### Adaptive matter intake and dossier

- [x] Submit the BSA/AML marketplace-payout request from the canonical handoff
  prompt. Confirm that the new matter opens directly in Chat with Themis.ai and
  shows an honest background reading state.
- [x] Confirm that the first Intake Agent turn summarizes the actual request
  and asks one material request-specific question. The old context-free
  understanding sentence and fake hard-coded question count must not appear.
- [x] Answer, correct, skip, and stop intake. Confirm that questions adapt,
  skipped items do not become facts, intake can stop without blocking useful
  work, and the immutable request and exact transcript remain unchanged.
- [x] Confirm that facts and corrections link to the request or stable user
  message IDs, meaning-changing corrections supersede rather than overwrite,
  conflicts remain open until the user resolves them, and grouped undo
  withdraws records without deleting history.
- [x] Confirm that a useful `dossier.md` exists with the matter summary,
  decision question, material facts, assumptions, issues, open questions,
  support labels, recommendation or options, next counsel action, and work
  product links. Confirm that a later material update does not overwrite an
  unsaved or lawyer-edited dossier.

### Polaris matter research and graceful failure

- [x] Confirm that intake sends only validated public research intent to
  Polaris. The captured payload must not contain company aliases, matter IDs,
  internal paths, email addresses, private product names, or document
  excerpts.
- [x] Confirm that Polaris citations start as **Supplied**. Confirm that the
  selected Research Agent combines the public result with private company and
  matter context locally, saves a Markdown packet, and updates the dossier.
- [x] Force provider, Polaris, malformed-output, citation-format, and
  persistence-side failures. Confirm that useful non-empty output remains
  visible, files remain valid, and each missing support step is labeled.
- [x] Restart during intake or research. Confirm that interrupted work is
  shown honestly, can be retried, and does not lose persisted selections,
  source records, or useful partial work.

### Exhaustive closure

**Verified — 2026-08-30:** The post-review remediation has current evidence:
495 backend tests, all five focused frontend checks, typecheck, production
build, an isolated browser run with no console errors, and a refreshed graph.
The closure audit now uses section-specific evidence instead of the former
blanket historical disposition.

- [x] Confirm that `docs/MVP_CLOSURE_AUDIT.md` inventories every current
  plan, status file, handoff progress file, unchecked acceptance item, and real
  application placeholder. Every row must be verified complete, verified
  historical/superseded, or matched to an existing Later category.
- [x] Confirm that the full backend suite, focused frontend checks, typecheck,
  production build, graph update, and final isolated browser walk pass after
  the last code change.
- [x] Confirm that no non-Later item remains pending, failed, unchecked,
  unverified, omitted, or moved to a new plan. `current.md` must contain no
  Now or Next work; only Later may remain.

## Themis.ai reliability build

**Verified — 2026-08-31:** The isolated browser lifecycle used a copied vault.
It created and reviewed the canonical draft, finalized it, approved it,
recorded outside delivery, closed the matter, and preserved Closed state,
moderate lawyer-set risk, and artifact identity after visible navigation away
and back. Safari physical-key input confirmed Home, End, and Shift+ArrowLeft
selection in the editor. The repository vault hash was unchanged.

After the browser run, the final correction tree passed 550 backend tests,
every `frontend/scripts/check-*.ts` script, workspace checks, typecheck,
production build, graph refresh, and `git diff --check`. One independent
read-only Sol High reviewer found nine issues. Sol Light workers corrected
them. The same reviewer completed two correction rechecks and reported no
unresolved material finding.

### Truthful intake, chat, and research

- [x] Confirm that the submitted user turn is durable before background work,
  appears immediately, merges without duplicates, and restores or preserves
  unrelated composer text and attachments after failure or card actions.
- [x] Confirm that answered intake cards are inert saved records with labelled
  native controls and qualified free text. Completing intake must remove the
  stale orientation action.
- [x] Force a failed mutation tool call. Confirm that useful text remains
  visible below a durable, action-specific failure notice. Confirm that
  successful and no-change mutation tool results show the matching workspace
  status without inspecting the assistant's prose.
- [x] Confirm that research uses the saved latest-packet pointer, distinct
  question-based titles, explicit public-research status, and fail-closed
  source classes. Missing or failed public research must not look verified or
  fully successful.

### Canonical work product and matter lifecycle

- [x] Confirm that Chat save, manual draft creation, document review,
  finalization, and Overview use one persisted current draft path. No new loose
  root `work-product.md` may be created.
- [x] Finalize Draft A, then create Draft B. Confirm that approval is disabled
  until a final linked to Draft B exists and cannot approve Final A by mistake.
- [x] Finalize a supported legacy draft when no canonical pointer exists.
  Confirm that it is safely adopted and can be approved. Confirm that it cannot
  replace an existing canonical draft.
- [x] Confirm the normal guided path reaches Being drafted, Respond,
  approved, sent outside the system, and Closed with visible saved outcomes.
- [x] Confirm that Today, Matters, the matter header, and Overview agree on
  required work, next action, owner, risk, research state, and lifecycle state
  after reload.

### Decisions, company profile, review, and naming

- [x] Confirm that the decision form supports removable basis records,
  Conditions, Not decided, and revisit date. The configured lawyer must be the
  default decision maker, and the saved decision must appear in the register
  and newest Recent activity.
- [x] Confirm that an existing company profile is visible, stale replacement
  is rejected, settled fields are not asked twice, and direct lawyer edits use
  neutral or mixed human attribution instead of generated-only attribution.
- [x] Confirm Overview and Chat remain mutually exclusive, hidden controls are
  absent from the accessibility tree, and editor review does not create
  punctuation-only change cards.
- [x] Confirm all live product surfaces and active help text use `Themis.ai`.
  Remaining old names must match the compatibility exceptions in
  `docs/themis-ai-reliability-build.handoff-progress.md`.

## Q. Workflow reconciliation

- [x] Create a matter with a target date. Confirm that the page opens while
  intake is visibly running and that the date is present in the header,
  `matter.md`, and `request.md`.
- [x] Answer intake and use **Finish intake**. Confirm that the orientation
  work item completes and the matter moves to Being researched.
- [x] Add a participant through Overview. Confirm `participants.md` is updated.
- [x] Start research from Overview with no typed question. Confirm that the
  saved question is non-empty. Confirm that each question has one durable queue
  record and that moving a queued item changes its saved order.
- [x] Save one canonical draft and one working recommendation. Confirm that a
  later agent revision is proposed, a lawyer must accept it, and a direct
  lawyer edit creates the next recommendation version.
- [x] Record a durable decision with a recommendation version, disposition,
  and reason. Confirm that opening the confirmation does not record it.
- [x] Change a work item's priority and owner. Complete it only with a direct
  control and confirm the Markdown fields.
- [x] Finalize, approve, record manual delivery, and close with separate direct
  controls. Confirm direct sending is disabled and required work blocks closure.
- [x] Seed a safe legacy final/stage mismatch in a disposable vault. Confirm the
  board shows the named warning and that **Repair safe stage mismatch** changes
  only the derived stage.
- [x] Delete only the disposable SQLite index, restart the backend, and confirm
  the index rebuild restores the same closed matter, decision, work product,
  approval, delivery, target date, and work-item state from Markdown.

**Verified — 2026-09-01:** The fresh visible run used
`/private/tmp/themis-workflow-verification-20260901-d`. Matter
`MAT-20260901-fa13a5` completed the full workflow. The repository-vault
protected hash remained
`4e7ead57bd49e00a37dbd144ef227593ffe15032fb7803b8c262a16b1baeec3e`.
The final gate passed 629 backend tests, all focused frontend checks, the older
lifecycle check, typecheck, production build, and `git diff --check`.

## Cycle 10: Research snapshots and lifecycle focus

- [ ] Run more than one research item. Confirm that the matter queue shows the
  live run, packet, and saved-support totals. Confirm that each run says how
  much support is saved, including an honest zero-support state.
- [ ] Open the current draft while research is active or newly complete.
  Confirm that the page says the draft uses a saved research snapshot and does
  not change automatically.
- [ ] Select **Update draft from saved research**. Confirm that Chat opens with
  a request to update the active draft through tracked revisions. Confirm that
  the draft does not change until that agent action saves a revision.
- [ ] Keep required work open while a final response exists. Confirm that
  approval is the current lawyer action with no unrelated current work item.
  Record approval and confirm that delivery has the same coherent state.
- [ ] Record delivery. Confirm that the required item becomes current again and
  that closure stays unavailable until the required item is complete.

## Single-lawyer workspace integration (2026-09-05)

Use a temporary vault and an isolated active-context pointer. Do not run this
walk against the repository vault or a lawyer's selected vault. A configured
provider run and browser observations are separate evidence from deterministic
provider tests. Record the current browser results in the workspace progress
log; the list below does not claim a blanket browser pass.

The workspace has one conversation across Understand, Discuss and Draft.
Check the following journeys at 1440, 1024, 768 and 390 pixels:

1. Edit the business question, propose a reframe, reject it, restore an earlier
   question, and reload. Only the canonical dossier question controls scope.
2. Answer a supporting question in chat. The reported fact and answer remain
   linked after reload; a repeat does not create another fact.
3. Explain an issue, stress-test a view, and draft a question for the business.
   Each shortcut continues the same conversation and gives useful prose.
4. Save a hypothetical scenario and analyze it. Actual facts and decisions stay
   unchanged. Adopt only selected changes through an explicit action.
5. Correct an actual fact. The reassessment shows the changed reasoning, related
   historical scenarios and differences. A saved draft stays unchanged until an
   update offer is accepted or a later explicit revision is requested.
6. Edit the business flow. Proposed factual changes are separate from diagram
   edits; accept only the selected changes and check the resulting facts.
7. Open a claim's evidence. Check source label, exact available excerpt or its
   absence, locator, retrieval state and working source link. A supplied source
   must not become a verified authority merely because of its heading.
8. Upload multiple files through picker and drop. Check full, partial and failed
   outcomes; exact original bytes, separate extracted text, name search and
   retry. Optional files are available separately from the next-run selection.
9. Inspect the completed run's context record. Check excluded original and
   extracted aliases, source-derived facts, history, selected draft text and
   scenario overlays. Later tool reads must not reintroduce excluded content.
   Changing selection affects the next run, not a saved run's immutable record.
10. Save audience, constraints and an accepted lawyer contribution in chat.
    Reopen the matter and check that later work uses those instructions without
    promoting them to externally verified facts.
11. Include prior work explicitly. Draft, edit, save and apply a practice note
    through the existing Skill Builder. Neither action records a decision or
    applies unrequested learning.
12. Create an assumption watch from named saved assumptions. Review and activate
    it through the existing Watch Builder. A later review packet identifies the
    affected assumptions and does not change a decision automatically.
13. Create a memo, supplied-clause review copy and checklist as separate editable
    artifacts. Revise only the selected artifact or exact range. Check dirty and
    stale proposal recovery, version notes, preview/Keep states, native markup
    and accepted-text exports. Prepare an outside-counsel brief and separate
    cover email; select outgoing originals separately and review the packet
    before download. No send or delivery occurs.
14. Find all eleven output-template starters in Draft and Skills. Copy one, edit
    all seven default fields plus instructions and outline, save it, set a
    default, preview with real matter context, and use a one-run override. Check
    the saved template revision/hash on the artifact; preview and override must
    not alter the reusable template or current work-product pointer.

Across these journeys, retain unsent text, scroll position, selected files and
local editor changes when switching views. Open each artifact beside the same
conversation. A late run must not change a newer view, target or dirty editor.
Stop and retry an active request; retain useful text and saved work after a
provider timeout, optional context-record failure or scenario save failure.

Automated HTTP evidence is in `backend/tests/test_workspace_lifecycle.py` and
`backend/tests/test_workspace_interactions.py`. The provider is deterministic
there; the real routers, runner, tools, review/export services and temporary
vault records are used. The six workspace checks are available with
`npm run check:single-lawyer-workspace`; they do not replace the browser walk.

### Browser file-drop regression

`frontend/scripts/check-workspace-file-drop.ts` runs the assembled application in a separate headless Chromium browser. It requires an explicitly isolated running vault and matter. It sends no chat request. It uses actual file-picker inputs, browser `File` and `DataTransfer` objects, React drop handlers, and the real upload and context routes in Understand, Discuss, and Draft.

From `frontend`, run:

```bash
WORKSPACE_DROP_URL=http://localhost:3107 \
WORKSPACE_DROP_MATTER=MAT-DEMO-RELAY \
WORKSPACE_DROP_ISOLATED=1 \
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
npm run check:workspace-file-drop
```

Use the frontend origin allowed by the isolated backend. `PLAYWRIGHT_MODULE` can point to a temporary test installation; no production dependency is required. The test creates uniquely named files only in the selected fixture matter. It checks additive batches, unchanged unsent text and composer identity across views, truthful inquiry selections, unsuccessful retries with the exact retained `File`, and successful retry after one simulated transport failure. Chromium omits multipart file bodies from its network inspection API, so the test observes the actual `FormData` at `fetch` without changing it. This is browser automation evidence; it does not replace the separate configured-model or manual pointer-drag acceptance record.

## Lawyer workflow expansion (September 5, 2026)

The current evidence is maintained in `docs/lawyer-workflow-expansion.verification.md`
and `docs/lawyer-workflow-expansion.usability.md`. Earlier check counts in this
file describe historical builds.

Use a copied temporary vault with explicit unused ports. Never use a real vault
for these mutation checks. The acceptance IDs and exact negative cases are in
section 11 of `docs/lawyer-workflow-expansion.handoff-plan.md`.

1. Open Today and continue the same matter action as its displayed owner. Read the short answer, important qualification, full wording, and source.
2. Prepare and edit a request from a supporting question. Copy exact wording. Confirm there is no sent claim. Explicitly record an external request. Paste a partial reply with line breaks and trailing spaces. Record its linked reported fact and reassess in the same conversation.
3. Hand only one required work item to another local lawyer. Accept it, open its packet/source, return a written result, and accept the reciprocal return. Verify the matter owner and other tasks do not change. Separately transfer the whole matter to a lawyer with no specialty and return it.
4. Switch View as during a model run and with unsent text. Confirm the original actor and target stay fixed, input is separate per person, and only the active person's explicit Mark seen changes their cursor.
5. Upload two supplied specification versions as separate originals. Compare exact passages against earlier saved advice before a draft or decision exists. Repeat with a formatting-only version. Keep source text separate from generated analysis.
6. Select a saved working draft and request a comparison-bound proposal. Preserve direct lawyer edits and original text. Review selected tracked wording, decline a separate offered update, reload, and export the selected saved version. A stale local edit must not overwrite newer saved work.
7. Use the existing decision, finalization, manual delivery, required-work and closure controls when applicable. Return to Today and confirm its next action and owner agree with the matter.
8. Repeat the affected navigation at 1440, 1024, 768 and 390 pixels, with keyboard-only use, actual 200% browser zoom and reduced motion. Recheck material usability repairs with an independent goal-led inspection.

Use deterministic HTTP/race tests for stale scope, contradictory replies,
partial writes, removed-person retries, extraction failure, immutable finals,
declined offers, and read-only requests. Record those separately from configured
model and browser results. Rebuild SQLite and verify authoritative Markdown,
source originals, and team queues remain intact.

## Matter memory and solution paths — September 10, 2026

The isolated scripted browser walk exercised the applicable matter-header, chat, source, integrity and skill-edit checks above. It did not repeat unrelated approval, delivery, scheduling or live-provider journeys.

- [x] Both chat views create and preserve A/B/C paths, compare them, select direction and restore the original approach.
- [x] Mainline and per-conversation working focus survive reload. Explicitly open each saved conversation when checking separate focus.
- [x] Actual correction remains after restoration. Path selection creates no formal decision or implementation fact.
- [x] Working-note details and pending conditions are readable. Shared skill edits apply to later runs; old captured revisions remain.
- [x] Saved dense page 99 continues to page 100. OCR page 20 retains text and image access.
- [x] SQLite deletion/rebuild preserves Markdown paths, notes, receipts and saved-source reads.
- [x] Concurrent dossier edit remains intact; a committed direction can show “Dossier: review needed” after restart.
- [x] No duplicate assistant answer or transition appears from repeated polling.
- [ ] Native browser file upload: not exercised. Real ingestion API upload passed.
- [ ] Live semantic model evaluation: not authorized or run.

Reproduction, exact limits and artifacts: `output/matter-memory-paths/browser.md` and `docs/matter-memory-paths.verification.md`.

## Research-first dossier — September 11, 2026

The isolated `browser-vault` walk exercised the relevant items in B, C, D, G,
and H. It used five synthetic issues across employment, privacy, supplier
contract, intellectual property, and marketing. It did not re-run unrelated
matter closure, automations, export, mobile layout, zoom, or live-provider work.

- [x] Experimental chat shows three priorities, all five mapped answers, the first-three selectors, All-five scope, and normal source fields before work starts.
- [x] All-five starts three distinct first workers. The first dossier is readable while two later workers remain active.
- [x] The first and latest exact revisions contain full conditions, checklists, reported facts, and the proposed date with its saved basis.
- [x] Two different internal citation controls and one external saved-passage control open the correct source text and saved version.
- [x] An unsent draft, selected context, open-document state, and a lawyer dossier edit survive later publication and reload.
- [x] Stop persists through a same-vault backend restart. Resume reuses the saved child IDs and does not repeat completed model work.
- [x] Standard matter chat shows setup, live progress, current state after reload, and final exact revision.
- [x] Explicit saved-only generation and `Generate dossier without saving.` start no unrestricted research. Preview saves no parent request or dossier revision.
- [x] Successful parents have unique child IDs, publication keys, revision paths, and completion message keys.
- [x] Execution-owned servers stop cleanly and ports 8199 and 3199 are clear.
- [ ] Configured-model legal quality: deferred to Step 13. The deterministic fixture proves application behavior only.
- [ ] Narrow-screen, keyboard-only, reduced-motion, and 200% zoom: not required by this feature blueprint and not newly exercised.

Exact browser observations, counts, screenshots, logs, resolved defects, and the
active-vault safety note are in `output/dossier-research-first/browser-results.md`.
