# Counsel OS end-to-end test kit

Use this guide to test Counsel OS as one product lawyer would use it. You do
not need legal, product, or software-testing experience to use the core
journey. Follow the steps in their listed order.

This is a manual acceptance test, not a legal-quality scorecard. Check that
Counsel OS saves the right work, shows the right next action, and lets the
lawyer move from an incoming request to a delivered result.

## Start here if Counsel OS is new to you

Counsel OS is a workspace for legal work. It helps a lawyer turn an incoming
request into organized research, a draft, a decision record, and a delivered
answer. It does not make the final legal decision for the lawyer.

### First five minutes

1. Open Counsel OS in your web browser. If this is a local installation, the
   normal address is `http://localhost:3000`.
2. Look at the navigation at the top. Select **Today**. This is the daily
   work list.
3. Select **Workspace**. This is the board that shows where each matter is in
   its work cycle.
4. Select **Matters**. This is the complete list of matters.
5. Return to **Today**. This is where the main test begins.

If the page does not open, stop here and send this message to the person who
set up Counsel OS:

```text
I cannot start the Counsel OS end-to-end test because the app does not open at
http://localhost:3000. Please start the test environment and send me the app URL.
```

### Words used in this guide

| Word | Simple meaning |
| --- | --- |
| Matter | One complete piece of legal work, such as a product launch request. |
| Today | The daily work list. It shows what needs attention now. |
| Workspace | The board view. It shows matters moving through their work stages. |
| Stage | The current place in the work cycle. A matter moves from Just came in to Being researched, Waiting on your judgment, Being drafted, Ready to send, and Closed. |
| Themis | The name used for Counsel OS agent work. It can research, draft, organize, and take only the actions you ask it to take. |
| Chat | The place where you ask Themis to answer, research, draft, or make a requested record change. |
| Trace or Actions taken | The short list that says what the agent changed. It does not show hidden reasoning. |
| Source | A file you upload, such as an email, a product specification, or marketing copy. |
| Work item | A tracked task that must be done by a named person. |
| Research packet | A saved first-pass research note. It is a starting point for lawyer review, not a final legal opinion. |
| Review packet | A saved note that explains a later development and which matters or decisions may need lawyer review. |
| Recommendation | The proposed path. It is not a formal decision. |
| Decision | A formal record that the lawyer explicitly chooses to save for future use. |
| Audit | An explicit check of saved decisions to see whether a review date passed or a linked source changed. |
| Dossier | An optional editable summary of the matter. |
| Redline | A tracked edit. It shows text added and removed during review. |
| Markdown | A simple text file that can use headings, lists, and links. You can read it as ordinary text. |
| Mock mode | A built-in test assistant. It works without an API key. |
| Configured provider | A connected AI service. It is optional for this test kit. |
| Vault | The local folder where Counsel OS stores its Markdown records and uploaded files. |

### How to record each test

Each row has a test ID, an action, an input, and an expected result.

- **Pass** means the expected result happened.
- **Fail** means the result did not happen or the app showed the wrong result.
- **Blocked** means you could not continue because of a setup problem.
- **Not applicable** is allowed only for an optional service you do not have,
  such as a configured AI or external intelligence provider. Write why.

For a Fail or Blocked result, write the test ID, what you clicked, what you
expected, what happened, and a screenshot if possible. You do not need to
understand the technical cause.

### Test files you can upload now

You do not need to create the three text files by hand. Download or drag these
files into Counsel OS when the guide tells you to upload them:

- [`nimbus-product-spec.txt`](test-fixtures/nimbus-product-spec.txt)
- [`nimbus-marketing-copy.txt`](test-fixtures/nimbus-marketing-copy.txt)
- [`nimbus-vendor-email.txt`](test-fixtures/nimbus-vendor-email.txt)

For the PDF and DOCX upload tests, use the marketing-copy text in section 2.4:
paste it into Word or Google Docs, then save one copy as `.docx` and one copy
as a text-based `.pdf`. If you cannot make those files, mark DOC-02 and
DOC-03 Blocked; complete the other tests.

### Suggested test sessions

You do not need to complete all 100 checks in one sitting.

| Session | Run | What you learn |
| --- | --- | --- |
| First session, about 30 minutes | Sections 1–3 through E2E-10. | You can create a matter, answer intake questions, see it on the main screens, and use chat safely. |
| Core product session, about 60–90 minutes | E2E-11 through E2E-30, then sections 4–7. | You test uploads, research, board movement, draft work, decisions, and closure. |
| Extended product session | Sections 8–11. | You test reusable skills, configuration, automations, watches, recovery, and accessibility. |

Stop and record a failure when the expected result does not happen. You do not
need to work around a failure to continue. If the failure blocks the connected
journey, mark later connected tests **Blocked** and continue with an unrelated
screen check.

## How to use this kit

1. If you are only learning the app, use the local sample workspace. Do not
   upload real, confidential, or privileged material.
2. For a repeatable formal test, ask a developer to start the app with a
   temporary test vault. This prevents your test work from changing the shared
   sample records. The developer instructions are in section 1.1.
3. Start with the baseline checks in section 1.
4. Complete the core journey in order. It creates one matter named **Nimbus
   Teen Savings Launch**.
5. Use the short screen checks after the core journey.
6. Mark each test Pass, Fail, Blocked, or Not applicable. Save a screenshot or a short note
   for every failure.

The text in shaded code blocks is designed for copy and paste. Text in square
brackets, such as `[today + 14 days]`, is an instruction for you to replace.

## What good looks like

At the end, you should have one matter that has:

- its original request;
- saved intake answers and a useful issue map;
- uploaded sources with stable source references;
- a research packet;
- a saved draft and a final work-product file;
- separate approval, delivery, decision, and closure actions;
- a visible history in the matter, Today, Workspace, Matters, and Decisions.

Counsel OS does not need to give a legally final answer to pass this test. It
does need to give useful first-pass work, state material assumptions, and keep
the lawyer in control of recorded decisions.

## 1. Test setup and baseline

### 1.1 Isolated test data (developer-assisted formal test)

This step is not required for a first learning pass. It is required if you
need a clean, repeatable result or you want to test deletion and recovery.

Ask the developer who runs Counsel OS to create a temporary test vault and
start the frontend and backend against it. The technical steps are in
[`docs/ACCEPTANCE_TESTS.md`](ACCEPTANCE_TESTS.md), under **Isolated browser
testing**. Do not delete files or databases yourself unless you know that you
are in the temporary test vault.

Use this message if needed:

```text
Please start Counsel OS with a temporary test vault for the end-to-end test
kit. I need the browser URL and confirmation that I can safely create, edit,
and delete test records there.
```

Record the test start time and the temporary vault path here:

```text
Tester:
Date and time:
App URL:
Temporary vault path:
Model mode: Mock / Configured provider
Browser and version:
```

Expected result:

- The app opens without a blank page or browser-console errors.
- The main navigation shows Today, Briefing, Workspace, Matters, Decisions,
  Skills, Automations, Agents, and Settings.
- Existing demo records can remain. Your new Nimbus matter must be easy to
  identify by title.

### 1.2 Smoke check every main screen

Open each item in the main navigation once.

| Screen | Check | Expected result |
| --- | --- | --- |
| Today | Open `/`. | A date, attention list, new-matter entry, and Today chat load. |
| Briefing | Open Briefing. | Briefing items load, or an honest empty state is shown. |
| Workspace | Open Workspace. | New-matter entry, board, summary counts, and agent activity load. |
| Matters | Open Matters. | Table and Stages controls load. |
| Decisions | Open Decisions. | A decision register or an honest empty state loads. |
| Skills | Open Skills. | The guided skill builder loads. |
| Automations | Open Automations. | Saved schedules load. |
| Agents | Open Agents. | Agent list and editable agent details load. |
| Settings | Open Settings. | Model, document-review, provider, and Company controls load as available. |

Pass condition: each page is usable. A missing optional provider must show an
honest configuration state, not a fake success state.

## 2. Copy-and-paste test data

Use these inputs throughout the kit.

### 2.1 Main intake request

Paste this into **The request, as it arrived**.

```text
Slack thread — Nimbus Teen Savings launch

Product wants to launch Nimbus Teen Savings in California on November 15. A parent opens and funds the account. A teen age 13–17 can see the balance, set savings goals, and receive push notifications. The teen cannot transfer money or withdraw funds.

For launch, the team proposes to use a third-party analytics SDK. The SDK collects device identifiers, app events, and coarse location. The vendor says it will use the data to improve its services unless we turn off its product-improvement setting. Marketing also wants to say: "A safe first bank account for every teen."

Please tell us whether we can launch on November 15, what conditions we need, and what we should say to Marketing. We need a decision by [today + 14 days].

Participants: Maya Chen (Product), Leo Park (Privacy), Asha Shah (Marketing), Brian Harris (Legal).
```

Use these form values:

| Field | Value |
| --- | --- |
| Matter title | Nimbus Teen Savings Launch |
| Type | Product launch |
| Priority | High |
| Target date | `[today + 14 days]` |

### 2.2 Intake answers

Use the following answers if the intake cards ask equivalent questions. Use
**Skip** only when the test tells you to test skip behavior.

```text
Launch geography: California only for the first release.

Account model: The parent is the account holder. The teen has a limited view-only profile.

Data use: Turn off the vendor product-improvement setting before launch. Do not use teen data to train Nimbus models.

Notifications: Product notifications only. No advertising or cross-sell messages at launch.

Business decision needed: Approve a limited California launch if the data-use, notice, consent, and marketing conditions are complete.
```

### 2.3 Source file A — product specification

Create a local file named `nimbus-product-spec.txt` with this content. You can
paste it into a plain-text editor and save it before upload.

```text
Nimbus Teen Savings — Product Specification v0.3

Launch: California only, November 15.
Users: Parent account holder; teen profile available to ages 13–17.
Teen permissions: View balance, savings goals, and push-notification settings.
Teen restrictions: No transfers, withdrawals, account closure, or linked-card management.

Analytics SDK data: device ID, app screen views, button clicks, crash data, coarse location, and notification-open events.
Default vendor setting: the vendor may use received data for product improvement.
Requested Nimbus setting: disable vendor product improvement before production data is sent.

Success measure: 25 percent of eligible parent account holders create a teen profile in the first quarter.
```

### 2.4 Source file B — proposed marketing copy

Create a local file named `nimbus-marketing-copy.txt` with this content.

```text
Proposed landing-page copy

Headline: A safe first bank account for every teen.
Body: Help your teen learn money habits with a Nimbus Teen Savings profile.
Body: Parents stay in control while teens see progress toward their savings goals.
Footer: Available to eligible Nimbus customers in California at launch.
```

### 2.5 Source file C — vendor email

Create a local file named `nimbus-vendor-email.txt` with this content.

```text
From: Account Team, MetricsCloud
Subject: Nimbus mobile SDK settings

The MetricsCloud mobile SDK sends device identifiers, application events,
coarse location, and diagnostic information to our service. The Product
Improvement setting is enabled by default. When it is enabled, MetricsCloud
may use collected information to improve and develop its products.

Nimbus may disable Product Improvement in the dashboard before sending
production traffic. The setting does not affect basic analytics reporting.
```

### 2.6 Chat prompts

Use these exact prompts at the indicated point. They are deliberately clear
about which actions are allowed.

```text
Summarize this matter in five bullets. List the business goal, material facts,
open questions, major issues, and the next action. Do not change any records.
```

```text
Create a work item titled "Confirm MetricsCloud product-improvement setting is disabled". Assign it to Leo Park. Make it required before launch. Do not move the matter.
```

```text
Run first-pass research for this matter. Save the research packet. Separate internal sources from external sources, state assumptions, and do not record a decision.
```

```text
Draft a concise launch recommendation for the business. Recommend a path,
conditions, owners, and exact changes to the proposed marketing claim. Save it
in this matter as a Markdown draft. Do not approve, send, close, or record a decision.
```

```text
Move this matter to Research and explain what changed. Do not record a decision.
```

```text
Check whether this matter is ready for a decision. Do not change any records.
```

```text
Record this decision: Approve a limited California launch only after MetricsCloud product improvement is disabled, the parent/teen notice and consent flow is approved, and Marketing replaces "safe" with a specific supported claim. Owner: Brian Harris. Review date: [today + 90 days].
```

### 2.7 Document-edit text

Use this exact replacement when testing redlines in the marketing file:

```text
Headline: A parent-controlled savings profile that helps teens build money habits.
```

Use this comment when testing comments:

```text
Confirm that this claim is supported by the shipped parental controls and the final customer disclosure.
```

## 3. Core journey: intake to closure

Complete these tests in order. Each row is one end-to-end behavior.

### Start the Nimbus matter

For E2E-01, take these exact steps:

1. Select **Today** in the top navigation.
2. Select **New matter** in the box that says `Paste a request`.
3. Copy all of section 2.1 and paste it into **The request, as it arrived**.
4. Enter the four values in the table below the request.
5. Select **Open in Just came in**.
6. Wait for the Nimbus matter page to open. Do not use the browser Back
   button while it is opening.

In the rows below, **open** means select the named item in the top navigation
or the named item in the matter file tree. **Reload** means refresh the web
page with your browser’s reload button. If a label differs slightly, use the
label with the same meaning and record the difference in your test note.

| ID | Action | Exact input | Expected result |
| --- | --- | --- | --- |
| E2E-01 | Create the matter from Today. | Use section 2.1. | The matter opens in **Just came in**. The original request is saved. A saved intake conversation starts. |
| E2E-02 | Reload the new matter. | No input. | The title, request, target date, priority, owner, stage, and next action still show. |
| E2E-03 | Find the matter on Today. | Return to Today. | Nimbus appears in attention or other matters with its real next action and owner. |
| E2E-04 | Find the matter in Workspace. | Open Workspace. | Nimbus appears as a card in the Just came in board column. Counts update. |
| E2E-05 | Find the matter in Matters. | Open Matters, Table view. | Nimbus appears as a row with stage, risk, next action, owner, and target-date state. |
| E2E-06 | Answer intake cards. | Use section 2.2. | Each response is saved. Meaningful answers create a saved matter update and can start background research. The stage does not silently change. |
| E2E-07 | Test a card with no answer. | Use Skip on one non-material question, then choose **No more questions** if offered. | The card records the choice. No default answer is selected for you. The matter remains usable. |
| E2E-08 | Inspect the reason for a question. | Open the question’s reason control. | A plain explanation says why the information matters. It can be opened by mouse and keyboard. |
| E2E-09 | Ask for orientation. | First prompt in section 2.6. | The answer is useful and matter-specific. It names assumptions or open questions. It does not change records. |
| E2E-10 | Inspect chat history. | Reload the page, then open saved chat. | The question and answer remain. The answer renders Markdown correctly. Any actions are in a closed Actions taken or trace control. |
| E2E-11 | Create work through chat. | Second prompt in section 2.6. | A work item is saved with the requested title and owner. The trace names the action. The stage is unchanged. |
| E2E-12 | Test single-file upload. | Upload `nimbus-product-spec.txt`. | The source is saved with a stable source reference. An intent card asks what Themis should do. No fact is silently promoted yet. |
| E2E-13 | Give file intent. | `Extract material facts and add only supported facts to the matter. Flag any assumptions.` | The file intent is part of the saved message. Any extracted work identifies its source. The original source remains available. |
| E2E-14 | Test a document set. | Attach the marketing and vendor files together. | The UI identifies a set of two files and asks for one intent. Preview does not apply changes automatically. |
| E2E-15 | Preview and apply a document set. | `Compare these documents to the matter. Propose factual updates and marketing risks.` Then use Preview, Apply once, and Undo. | Preview is read-only. Apply has one grouped, visible result. Undo reverses the grouped applied result but keeps uploaded files. |
| E2E-16 | Open source text. | Select each uploaded text file or its extracted companion in Documents. | The document pane opens. Text is readable and editable when the file is not read-only. Source and extracted companion are distinguishable. |
| E2E-17 | Run research. | Third prompt in section 2.6, or the matter’s Run research action. | Research starts without blocking the chat composer. A saved timestamped packet appears under Research. When the completed run changes the stage, the card ends in **Waiting on your judgment**. |
| E2E-18 | Inspect research result. | Open the newest packet. | It uses the request, facts, issues, company context, and playbooks when available. It separates internal sources, external sources, and unverified leads. No-search mode says that external search did not run but still gives useful work. |
| E2E-19 | Move via chat. | Fifth prompt in section 2.6. | The trace shows the move. After refresh, the matter is in **Being researched** across the matter header, Workspace board, Matters stages, and table. |
| E2E-20 | Move on a board. | On Workspace, drag Nimbus from **Being researched** to **Waiting on your judgment**. | The card moves and stays in that column after refresh. The event history records the move. Do not drag directly to Closed. |
| E2E-21 | Test work-state wording. | Return to Today and Matters. | The same next action, owner, and work-state signal are shown across screens. Purple/agent work, amber/needs attention, rose/overdue, and green/complete each have a state word beside the color. |
| E2E-22 | Ask for decision readiness. | Sixth prompt in section 2.6. | The response is read-only. It says what remains without creating a decision or modifying a previous audit time. |
| E2E-23 | Record a decision explicitly. | Seventh prompt in section 2.6, or use the Record decision action. | A durable decision is created only after the explicit request or form submit. The decision is distinct from the recommendation. |
| E2E-24 | Check the decision register. | Open Decisions. | Nimbus appears with the real matter title, decision text, owner, review date, and audit state. Opening it returns to Nimbus. |
| E2E-25 | Draft work product. | Fourth prompt in section 2.6. | A Markdown draft is saved in the matter. It gives a recommendation, conditions, owners, and proposed marketing edits. It does not send, approve, close, or record a decision. |
| E2E-26 | Review the draft. | Open the draft in Work product. | The Markdown editor opens. Formatted and raw Markdown modes preserve headings, emphasis, links, quotes, and lists. Saving survives refresh. |
| E2E-27 | Finalize work product. | Use Finalize on the reviewed draft. | An immutable final file is created under Work product → Final. The original draft remains available. |
| E2E-28 | Complete approval and delivery. | Use the stage-specific action buttons. | Approval and delivery are separate persisted actions. The matter cannot close before delivery and required work are complete. |
| E2E-29 | Test blocked closure. | Try Close while the Leo Park work item is still open. | Closure is prevented with a useful explanation of unfinished work. Existing content is not damaged. |
| E2E-30 | Close successfully. | Mark the required work item done, then use Mark as sent and Close. | The matter closes. It appears in Closed after refresh. Its history shows separate approval, delivery, decision, and closure events. |

## 4. Matter workspace screen checks

Run these while Nimbus is open. They test the screen that the lawyer uses for
the last mile of work.

| ID | What to test | Expected result |
| --- | --- | --- |
| MAT-01 | Header | Shows matter title, stage, risk, owner, date state, next action, and a clear primary action. |
| MAT-02 | Primary action by stage | The action changes with state: orient, research, review/decide, draft/review, approve, mark sent, or close. It does not offer a false shortcut. |
| MAT-03 | Overview | Shows question, proposed path, open questions, evidence, work remaining, and the lawyer’s next step without requiring the file tree. |
| MAT-04 | Tree first level | Shows Original request, Documents, Chats, Research, Work product, and Dossier only when it exists. Legacy Drafts appears only when it exists. |
| MAT-05 | Matter Records | Starts collapsed. Its helper text explains that these are structured records. The labels use human names: Matter details, Facts/sources/assumptions, Issue map, People/roles, Working recommendations, Work to do, Recorded decisions, Activity history, and Dossier revisions. |
| MAT-06 | Original request protection | Open `request.md`. The original request is read-only. |
| MAT-07 | Editable records | Open `facts.md`, `issues.md`, or `recommendations.md`, add a harmless line, save, reload, and confirm the line remains. Then remove the test line and save. |
| MAT-08 | Pane controls | Collapse and reopen tree, overview, and document panes. Resize the visible panes with mouse and keyboard. At least one pane remains open. |
| MAT-09 | Chat-to-file link | Ask chat to create or open a document. The document opens in the document pane without losing the current matter context. |
| MAT-10 | Dossier | If the dossier exists, edit and save it. Confirm a revision is preserved. If its source data changes, a generated revision does not overwrite your current edited version. |
| MAT-11 | Event history | Confirm intake, uploads, moves, work actions, research, decision, delivery, and closure create understandable events when performed. |

## 5. Document review and export

This section tests text editing, review, and export. Text files test upload
and editing. A DOCX or text-based PDF also tests extraction and export.

### 5.1 Upload-format coverage

| ID | Action | Expected result |
| --- | --- | --- |
| DOC-01 | Upload `nimbus-marketing-copy.txt`. | The source is stored and its contents are editable. |
| DOC-02 | Upload a small text-based PDF with the same marketing copy. | A `.extracted.md` companion is created. Its text opens in the editor. |
| DOC-03 | Upload a small DOCX with the same marketing copy. | A `.extracted.md` companion is created. Headings, lists, and tables extract into readable Markdown where present. |
| DOC-04 | Upload a PNG or JPG. | The source is retained as source-only. The UI does not falsely claim text extraction. |
| DOC-05 | Attempt an unsupported extension. | Upload is rejected with the supported file types. Existing files remain unchanged. |

### 5.2 Review flow

1. Open the marketing source or extracted companion.
2. Turn **Redline** on.
3. Replace the headline with the text in section 2.7.
4. Open **All Markup** and confirm the old and new text are visible.
5. Open **Review changes**. Reject the first test change once, then make the
   same replacement again and accept it.
6. Select part of the new headline and add the comment from section 2.7.
7. Open Comments, read the thread, and resolve it.
8. Test **No Markup** and **Original** views.

Expected result:

- Track Changes records new edits against a saved baseline.
- Each insertion and deletion can be accepted or rejected individually.
- Bulk accept/reject is available when multiple changes exist.
- Comment anchors point to the selected text. A resolved comment remains
  available as resolved history.
- The active author and author color are visible and editable.

### 5.3 Export

Export a reviewed DOCX and PDF after at least one accepted or pending redline
and comment.

Expected result:

- DOCX opens in Word or a compatible reader and shows native tracked changes
  and comments.
- PDF opens normally and shows review annotations without clipped text or
  overlapping content.
- Export does not overwrite the source document.

## 6. Today, Workspace, and Matters

These screens should give the lawyer orientation before details.

| ID | Screen | Action | Expected result |
| --- | --- | --- | --- |
| NAV-01 | Today | Open Today after each important Nimbus state change. | Nimbus appears in the appropriate attention or other-matters group. The item says what needs attention and by whom. |
| NAV-02 | Today | Use Today chat: `What needs my judgment today? Do not change records.` | The answer refers to current saved matters and decisions. It does not create records. |
| NAV-03 | Today | Use the new-matter intake bar with a short request, then cancel. | The form opens and closes without creating a matter. |
| NAV-04 | Workspace | Check the board after move and close actions. | Each active card is in its saved workflow stage. Closed work is not shown as active. |
| NAV-05 | Workspace | Check the quarter summary and agent activity. | Counts match the underlying records. Failed schedules are clearly marked. |
| NAV-06 | Matters | Switch Table and Stages. | The same Nimbus state is visible in both views. |
| NAV-07 | Matters | Filter by owner, product area, risk, and each count chip. | Filters narrow results accurately. Clear filters restores all records. |
| NAV-08 | Matters | Expand/collapse a stage group and use drag-and-drop. | Group state works. A valid drag persists after refresh. Closed cannot be reached by board drag. |
| NAV-09 | Matters | Inspect words beside state colors. | There is a state word, not color alone: for example Overdue, Waiting, Themis is working, Needs assignment, or No action needed. |

## 7. Decisions

Create the explicit Nimbus decision in E2E-23 before these checks.

| ID | Action | Expected result |
| --- | --- | --- |
| DEC-01 | Open Decisions. | All saved decisions load across matters. |
| DEC-02 | Open the Nimbus record. | It links back to Nimbus and shows the saved decision, owner, dates, and audit explanation. |
| DEC-03 | Set Nimbus’s review date to yesterday in the decision record, then refresh. | The state becomes Stale and gives the date reason. Restore the planned review date after the test. |
| DEC-04 | Change a linked source after a decision is recorded, then run the explicit decision audit. | The decision becomes Review Recommended and names the changed source. |
| DEC-05 | Ask chat: `Check decisions, but do not change records.` | The answer is read-only. It does not update audit timestamps or decision files. |
| DEC-06 | Run the Decisions-page audit. | This explicit write action updates the audit result and says how many decisions need review. |

## 8. Skills, agents, settings, and automations

### 8.1 Guided reusable skills

| ID | Action | Expected result |
| --- | --- | --- |
| SKL-01 | Open Skills and start a skill with goal: `Review a product launch request and return a go, go with conditions, or do not launch recommendation.` | The helper asks the fixed sequence: job, success, inputs, then optional anything else. |
| SKL-02 | Answer job: `Review product launches.` Success: `Give the lawyer a short, evidence-backed recommendation and clear conditions.` Inputs: `Matter request, facts, issues, sources, company context, and draft marketing copy.` | The helper keeps the answers and explains its next step in plain language. |
| SKL-03 | Choose Build it now, then No, build it. | An editable draft appears. No skill file is written yet. |
| SKL-04 | Create the skill. | A Markdown skill is saved under `00_System/skills/`. |
| SKL-05 | Open Nimbus chat, type `/`, and select the new command. | The command is offered and can be sent with existing attachments and chat history still available. |
| SKL-06 | Send the command on Nimbus. | The response says Applied skill: [skill name]. The label remains after reload. |
| SKL-07 | Use Find repeated work in mock mode. | It gives an honest configured-model warning and does not fabricate suggestions. In a configured mode, each suggestion has stored evidence and only pre-fills the helper. |

### 8.2 Agents

| ID | Action | Expected result |
| --- | --- | --- |
| AGT-01 | Open Agents and select Counsel Copilot. | User-facing name, role, purpose, available context, and start behavior are understandable. |
| AGT-02 | Change one non-sensitive description field, save, reload, and restore it. | Save persists. Discard removes unsaved changes. |
| AGT-03 | Open Advanced controls. | Tool permissions and file path are visible only here. Unselected tools are unavailable to the agent. |
| AGT-04 | Follow Manage automations. | It opens Automations, not a fake scheduling control in Agents. |

### 8.3 Settings

| ID | Action | Expected result |
| --- | --- | --- |
| SET-01 | Open model settings. Change reasoning effort, save, reload, and restore the original value. | The current model and saved value are clear. Only valid efforts for the selected model can be chosen. |
| SET-02 | Open Document review settings. Change lawyer display name and default review author, save, reload, then restore. | The document-review controls reflect saved settings. |
| SET-03 | Open Company. Add a temporary phrase to a company field, save, reload, then remove it and save. | The company profile writes to the versioned company Markdown source and affects new agent context. |
| SET-04 | Open Watch providers. | Each provider honestly shows Configured/Ready, Configured/Unavailable, or Not configured. Provider keys do not display. |

### 8.4 Automations and inbox watcher

| ID | Action | Expected result |
| --- | --- | --- |
| AUT-01 | Open Automations. | Markdown schedules list with title, state, timing, last run, and last status. |
| AUT-02 | Run a safe existing schedule once. | Last-run time and status update. A failed run is shown as failed with useful detail. |
| AUT-03 | In chat, ask: `Create an agent named Weekly launch monitor that reviews open product-launch matters and reports missing required work. Do not run it.` | An agent file is created. It does not run by itself. |
| AUT-04 | In chat, ask: `Create a paused weekly Monday 9:00 AM automation for Weekly launch monitor. Do not run it now.` | A schedule file references the agent and appears in Automations as paused. |
| AUT-05 | Inbox watcher. Put a supported test file into the watched inbox path, then run the watcher once. | A new matter is created from the file. It has the source, original request or intake record, and an understandable next action. Remove the test matter when finished. |

## 9. Briefing and Watches (continuous legal awareness)

These are current application screens. Run them when your setup includes
briefing sample data or a configured public-intelligence provider.

| ID | Action | Expected result |
| --- | --- | --- |
| BRF-01 | Open Briefing. | Items and filters load, or an honest empty state explains that there are no saved developments. |
| BRF-02 | Open one briefing item and its source information. | The item distinguishes supplied/internal evidence, verified sources, and unverified leads. |
| BRF-03 | Open a review packet for an affected matter or decision. | It identifies the change, affected records, and recommended lawyer action without silently changing those records. |
| WAT-01 | Open a Watch from Briefing or the Watches route. | Watch scope, sources, state, recent scans, and affected records are visible. |
| WAT-02 | Create a narrow test watch. | The builder asks for topic, scope, sources, and intended action. Preview is separate from activation. |
| WAT-03 | Scan a test watch when a provider is configured. | The scan stores usable results or a clear failure record. It does not invent sources. |
| WAT-04 | Activate then pause the test watch. | State changes persist. Pausing stops later scheduled scans. |

## 10. Negative, integrity, and recovery tests

These tests are important because Counsel OS holds the lawyer’s work records.

| ID | Action | Expected result |
| --- | --- | --- |
| INT-01 | Stop the backend, delete only the temporary vault’s `.counsel_os_cache.db`, then restart. | Dashboard, matter, decision, schedule, and work state rebuild from Markdown. |
| INT-02 | Try a file path containing `../` through a supported API or UI path field, if exposed. | The operation fails. No file outside `VAULT_PATH` is read or changed. |
| INT-03 | Add an unknown Markdown tool handler key only in the temporary vault, then invoke the related agent. | The unknown handler does not execute. The app reports a useful error and remains usable. |
| INT-04 | Start an edit, force a failed save with invalid input or interrupted network, then reopen the original file. | The existing file was not truncated or overwritten by partial content. |
| INT-05 | With mock mode and no key, send a basic matter-chat prompt. | The app returns a useful mock response rather than an API-key crash. |
| INT-06 | With a configured provider, send the same prompt. | The provider response appears, or a clear provider failure is displayed without losing the message or matter state. |
| INT-07 | Upload a file over 25 MB only in a disposable test environment. | The app rejects it with the size limit. Existing matter files remain unchanged. |

## 11. Accessibility and layout pass

Run these checks at 1,280 px and 768 px wide. Use keyboard-only navigation for
at least one pass.

| ID | Action | Expected result |
| --- | --- | --- |
| A11Y-01 | Tab through each main screen. | Focus is visible. Controls have names. Keyboard access reaches navigation, forms, menus, disclosures, cards, and dialogs. |
| A11Y-02 | Use Enter and Space on question reasons, stage collapse controls, comment controls, and modal buttons. | Each operates without a mouse. Escape closes popovers and dialogs where appropriate. |
| A11Y-03 | Inspect state colors. | State words appear with each meaningful color. Color is not the only signal. |
| A11Y-04 | Resize Today, Workspace, Matters, Decisions, Agents, Skills, Automations, Settings, and Nimbus. | No horizontal overflow hides controls. Columns stack or scroll only where the design requires it. |
| A11Y-05 | Read a saved long chat answer and a research packet. | Markdown headings, links, lists, emphasis, and quotes remain readable. Raw HTML is not rendered as active content. |

## 12. Final evidence and result

Record the outcome. A failure is useful only when it names the screen, action,
expected result, actual result, and evidence.

```text
Overall result: Pass / Fail / Blocked

Tests passed:
Tests failed:
Tests blocked:

Most important failure:
Screen:
Steps to reproduce:
Expected result:
Actual result:
Screenshot, console error, or saved-record path:

Data cleanup completed: Yes / No
Temporary vault removed: Yes / No
```

## Simple explanation

This guide treats one made-up launch like a real piece of legal work. You put
the request in, add its papers, ask for help, move the work forward, make a
decision, and close it. At every stop, you check that the same story is still
visible. It is like following one package from a delivery truck, to a shelf,
to a customer: the package must not disappear, change label, or say it was
delivered before it really was.
