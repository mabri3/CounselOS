# Discuss tab UI survey — Instant payouts Q1

Matter URL: http://localhost:3000/matters/MAT-20260904-abf788
Survey scope: Matter workspace > Discuss. Read-only inspection. No messages, research, save, decision, work-item, file upload, or source mutation was performed.

## Current matter shell

- Matter: “Instant payouts Q1”. Stage is “Waiting on your judgment”. Risk control is “Set risk” with options Set risk, Low, Moderate, High. Due date: Sep 5, 2026.
- Work banner: “Redesign identity collection: collect CIP at onboarding, not at $3,000 payout threshold”, state open / Unassigned. Controls: Open saved work, Complete work, Hide work banner.
- Workspace tabs: Understand, Discuss (selected), Draft. Supporting text says one matter conversation stays available while reading and drafting.
- Tools and history is collapsed by default; expansion exposes Files & context, Output templates, Business replies, Hand off work, Compare supplied versions.

## Discuss conversation surface

Conversation scope shows “Matter context” and “Document WI-cb249d811c96.md”, with Clear scope. Target shows WI-cb249d811c96.md, with Clear target. Recent saved actions is collapsed by default; expanded state showed one applied action: “Save Inquiry Result”, with Open RUN-20260905-d1755b.md.

The saved conversation is long and complete. It contains:

- A completed THEMIS.AI turn with the supplied Priya PM request and full facts.
- “Summary of the request” and “My read before we go further”, including six prioritized compliance issues and four intake questions.
- Recorded workspace actions with Open Facts, sources & assumptions; Open Issue map; Open Matter details; Open Dossier; and Intake audit history (1).
- Answered intake facts: engineering choice for the $3,000 threshold; agent / bank partner posture; Asia; later Mexico. The conversation itself calls out the conflict between Asia and Mexico.
- “Assessment complete — Q1 as designed is not shippable”, “What I’ve set up”, and “What would change this”, including six created work items and two unresearched high-value research items.
- Additional saved responses: “Where we stand — Instant Payouts Q1”, a beneficial-owner deep dive, and the jurisdiction-question analysis with conditional answer and short alternative.
- Each recorded workspace action includes updated-record links and Open Work item controls where applicable.

## History disclosures

- Intake audit history (1) expands to an earlier question: “Is the nightly batch OFAC screening acceptable, or must screening occur before payouts are released? The current design screens after the day’s payouts have already gone out.”
- Two earlier intake update disclosures can be expanded. They show what was known at that point, the prior answer choices, what changed, and updated record links. The UI says the latest turn shows current status.
- This preserves earlier assumptions and exposes the conflicting jurisdiction answers. It is useful for record integrity, but the repeated long-form content makes the conversation hard to scan.

## Tools and history panels

### Files & context

Panel controls: Close; tabs Matter files and Inquiry context; Add files to library; Add files to inquiry. A note says several files can be added while earlier files prepare, and dropped files go to the current view.

Matter files view:

- Search field: Find by name or folder.
- Folder view disclosure.
- Three saved generated outputs, each with path, saved timestamp, source ID, Add to next inquiry, and Open generated output.
  - RES-20260904-9dbd39.md — 03_Matters/instant-payouts-q1-abf788/research/RES-20260904-9dbd39.md — Source ID SRC-EC12F4299D194101.
  - RES-20260904-9f1415.md — Source ID SRC-71C869372138037F.
  - RES-20260904-9e2048.md — Source ID SRC-714B903A08DD5ED9.

Inquiry context view:

- “Next inquiry” heading and explanation that these choices apply only to the next inquiry; removing a choice does not delete the saved file or change an earlier run.
- Three unchecked generated-output checkboxes. Each says saved and available, but will not be supplied directly to the next inquiry until selected.
- Empty state: “No submitted inquiry selected”. The panel explains that actual included, partial, omitted, unavailable, and later-read material appears after an inquiry starts.

Safe preview observation: opening a generated output navigated to Draft and showed a saved matter record with a Reference preview. The requested source revision was unavailable, with “Reference unavailable”, “Source unavailable”, and the explicit note “Reading this source does not add it to the agent request.” A background file-listing step appeared in Discuss afterward. This was not continued or stopped.

### Output templates

Panel shows Create blank template and an output template list with unchecked selectable defaults: Business Decision Brief, Change Impact Note, Contract Clause Revision, Decision Record / Draft Decision Rationale, Fact Confirmation Request, Implementation Requirements, Meeting Preparation Brief, Outside Counsel Brief, Regulatory Memorandum, Short Business Email, Transaction Checklist. Empty guidance says select a template to inspect, copy, edit, set as default, or preview. No template was selected.

### Business replies

Panel title: Request and record an answer. Supporting question dropdown defaults to “Choose a saved question”; available saved questions include the $3,000 threshold, licensing posture, jurisdiction, and OFAC timing questions, with duplicates visible. Editable request text area, Requested person field, Requested date (optional) date field, Prepare request disabled, Copy disabled. Helper text says only “Record external request” changes state; that control was not visible in the current empty selection state.

### Hand off work

Panel supports scope dropdown default “Whole matter”; other scopes include Orient to the request and the six named work items. Team recipient dropdown says No configured people. Fields: Exact ask, Current basis (optional), Open questions, one per line, Requested date (optional). Current owner is Lawyer; state is explore. Create pending handoff is disabled; Draft handoff brief is enabled. Empty state: “No handoffs for this scope.”

### Compare supplied versions

Panel says it does not edit earlier work. Choose versions and earlier work is expanded. Earlier version is disabled and says Earlier text not supplied. Current supplied version is disabled until chosen. Earlier saved work area initially says no earlier saved work; after loading, selectable unchecked saved workspace answer, working recommendation, multiple saved assistant advice entries, and a saved inquiry appear. Source-only scope is explicit: no earlier advice, recommendation, decision, or draft will be assessed. Prepare comparison is disabled. Empty state says no comparison selected.

## Composer and lower state

At the end of the conversation: Save current work product is disabled; shortcut buttons Which other matters does this touch?, What would change your view?, and Add files are disabled; entry area is present; Send is disabled. The disabled state is consistent with the saved chat being complete. Footer text says Themis.ai can research, draft and move the matter, and records a decision only when explicitly asked. Available work product is an empty state: No saved work product is available yet.

## Screenshots

- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-00-top.png — initial Discuss viewport.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-01-scroll.png — lower conversation and disabled composer.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-02-header.png — matter header and Discuss top.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-03-files-context.png — Files & context, Inquiry context view.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-04-business-replies.png — Business replies empty state.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-05-compare-versions.png — Compare supplied versions panel.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-06-recent-actions.png — expanded Recent saved actions.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-07-bottom-expanded.png — lower conversation with expanded earlier intake update.

## Observed vs unexercised limits

Observed: completed saved chat; long history; scope and target; one recent saved action; three saved generated outputs; empty next-inquiry selection; unavailable source revision; disabled composer actions; no saved work product; no configured handoff recipients; no comparison prepared; disabled version selectors until selection.

Unexercised by design: sending a chat or research request; selecting inquiry files; adding files; saving work product; recording an external request; creating a handoff; selecting a template; preparing a comparison; changing scope or target; changing risk; opening or completing work; editing decisions or work items; changing selected identity or agent context. Legal text was treated as unverified product content.

The design-language file could not be opened through the in-app browser: file URL access was blocked and the localhost route returned 404. No design-language claims are inferred beyond the visible UI.

## Compact A-style recommendations

1. Keep Discuss as the durable conversation surface, but add a compact “conversation map” with jump links for request, current assessment, open questions, recorded actions, and latest answer. This preserves the full history while reducing scroll cost.
2. Keep scope and target visible, but place Clear scope / Clear target in a secondary menu with a concise confirmation preview. Their current placement makes high-impact context changes look like routine controls.
3. Group Tools and history into two labeled bands: Context (Files & context, saved actions) and Workflows (templates, replies, handoff, compare). Keep disabled reasons visible beside disabled actions.
4. Make the disabled composer state explicit: “Chat complete — start a new inquiry to continue” with one safe, clear next action. Preserve the current no-send behavior.
5. In Files & context, show source status badges before preview: Saved, Available for next inquiry, Reference unavailable. Keep the useful “does not add it to the agent request” disclosure.
6. Treat conflict visibility as a first-class record feature. Surface “Asia” vs “Mexico” as a compact unresolved fact banner with links to the two source turns.
7. Keep the audit history disclosure, but collapse repeated updated-record links behind a single “View affected records” control per turn.
8. In empty panels, explain the enabling condition next to the disabled button: recipient required, question required, version required, or chat complete.


## Additional form captures

- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-08-compare-lower.png — comparison selectors and saved-work checkboxes.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-09-compare-bottom.png — remaining saved inquiry checkboxes, source-only scope, disabled Prepare comparison, and No comparison selected state.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-10-handoff-form.png — handoff scope and exact-scope header.
- /Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/discuss/discuss-11-handoff-lower.png — Recipient, Exact ask, Current basis, Open questions, Requested date, Included references, disabled Create pending handoff, Draft handoff brief, and No handoffs state.

The “Which other matters does this touch?” shortcut became active after the saved chat reloaded. A prior click then produced a saved assistant response in the conversation. This was an observed UI side effect during read-only inspection; no follow-up, save, or decision action was taken. The response names five related matters: risk-based merchant onboarding, international expansion/local payments, OFAC blocking/reporting, consumer disclosures for payment risk holds, and privacy controls for payment operations.
