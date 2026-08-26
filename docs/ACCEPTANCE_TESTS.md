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

## C. Chat

- [ ] Mock mode answers without an API key.
- [ ] A real provider can answer when configured.
- [ ] “Move this to Research” invokes a tool and persists.
- [ ] “Create a work item…” writes a work-item file.
- [ ] “Draft a response and save it…” writes a Markdown artifact.
- [ ] Trace shows actions without hidden reasoning.

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
