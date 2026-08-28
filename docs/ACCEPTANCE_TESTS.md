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
