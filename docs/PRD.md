# Product Requirements Document

## Counsel OS — Product Counsel Workspace MVP

**Document status:** Build-ready MVP closure PRD
**Version:** 0.2
**Primary user:** In-house product counsel, solo general counsel, or a very small legal team  
**Initial module:** Product Counsel  
**Working product name:** Counsel OS  
**Implementation target:** Local web application for rapid iteration; cloud-native and desktop packaging are future deployment options, not MVP commitments

---

## 1. Executive summary

Counsel OS is an agentic legal workspace designed to reduce the cognitive load of product counsel. It takes scattered requests, documents, company knowledge, legal research, tasks, recommendations, decisions, and follow-up work and organizes them into a predictable legal workflow.

The product is not intended to replace the lawyer’s judgment or to produce legally perfect answers. It is a leverage tool. Its job is to get the lawyer from an unstructured starting point to a useful, organized foothold from which the lawyer can perform the last mile of legal work.

A useful analogy is a subway: the product does not deliver the lawyer to the exact desk where the final decision is made. It gets the lawyer from home to the stop near the destination. The lawyer supplies the last-mile judgment, context, and accountability.

The MVP must feel closer to ChatGPT, Claude, Codex, or a capable legal paralegal than to a rigid compliance workflow. It should answer, investigate, draft, organize, and take permitted actions. Uncertainty should be surfaced, but uncertainty must not become a reason to refuse to help or to block delivery of useful work product.

The MVP combines four product surfaces:

1. A legal-workflow command center that shows what needs attention and what the lawyer should do next.
2. A matter workspace with a file tree, agentic chat, and document editor.
3. A decision register that preserves prior decisions and identifies decisions that may need review.
4. A scheduler and automation system that lets the lawyer create recurring agent work in natural language.

The implementation is Markdown-first. Human-readable Markdown records are the source of truth. A rebuildable SQLite index supplies fast cross-matter queries for the dashboard, decisions, automations, and search.

---

## 2. Product thesis

### 2.1 The core problem

Product counsel work begins in ambiguity. Requests arrive through conversations, email, product specifications, screenshots, policy documents, contracts, spreadsheets, and incomplete descriptions of business goals. The lawyer must repeatedly perform the same cognitive setup work before applying judgment:

- Determine what the business is actually trying to do.
- Identify the material facts and missing facts.
- Find prior company decisions and relevant playbooks.
- Determine what research is necessary.
- Organize the issues and possible paths.
- Draft a response or recommendation.
- Track what was decided and what remains open.
- Revisit the decision when law, policy, product, or facts change.

Most tools either store documents, manage tasks, or answer isolated questions. They do not organize the entire path from intake to decision in the way a product lawyer thinks about the work.

### 2.2 The intended outcome

When the lawyer opens Counsel OS, the system should answer three questions within seconds:

1. What requires my attention?
2. What work has already been done for me?
3. What decision or action do I need to take next?

When the lawyer opens a matter, the system should immediately provide:

- A concise orientation.
- The current stage and next action.
- The controlling request and business objective.
- Material facts, missing facts, and open issues.
- Work already completed by agents.
- The most relevant documents.
- A direct path to asking questions, running research, drafting, or recording a decision.

### 2.3 Product promise

Counsel OS reduces the lawyer’s grunt work and context-switching so the lawyer can spend more time doing what the lawyer does best: exercising judgment and making decisions.

---

## 3. Non-negotiable product principles

### 3.1 Helpful work product over legal perfection

Legal perfection is expressly **not** an MVP requirement or product assumption.

The system must:

- Produce the best useful answer or work product it can with the information available.
- Continue working when facts are incomplete, the law is uncertain, or sources conflict.
- State material assumptions and uncertainty briefly and clearly.
- Avoid boilerplate disclaimers and repetitive warnings.
- Avoid refusing merely because a question is legal, difficult, high-risk, or not fully researched.
- Avoid requiring multi-agent consensus, confidence thresholds, citation validation, or reviewer approval before showing a useful answer.

The system may recommend additional research, identify missing facts, or explain that a conclusion is preliminary. Those observations supplement the answer; they do not replace it.

### 3.2 Forest before trees

Default outputs should help the lawyer understand the shape of the problem:

- What is happening?
- Why does it matter?
- What are the major legal or operational issues?
- What are the realistic options?
- What should happen next?

The system should supply detailed rule analysis when useful or requested, but it should not bury the lawyer under exhaustive legal detail before providing orientation.

### 3.3 Cognitive-load reduction

Every screen must prioritize orientation and next action over completeness. Information density is acceptable only when hierarchy is strong. The product should not force the lawyer to reconstruct matter state from files or chat history.

### 3.4 Work product, not conversation for its own sake

Every meaningful interaction should move toward an artifact or state change, such as:

- A research packet.
- A fact or missing-fact list.
- A work item.
- A draft response.
- A recommendation.
- A decision record.
- A scheduled automation.
- A stage transition.

Chat is an interface to work, not merely a place to talk.

### 3.5 Transparent and editable intelligence

Agent prompts, system identity, company context, user preferences, memory, workflow definitions, schedules, and tool descriptions must remain inspectable and editable as Markdown wherever practical.

### 3.6 Modular, but not abstract for abstraction’s sake

The MVP must contain clear extension points for new agents, tools, workflows, model providers, storage adapters, and legal modules. It must not introduce a general plugin framework, workflow language, distributed queue, or event-sourcing platform before the demonstrated workflow requires one.

### 3.7 Recommendations are not decisions

The assistant may draft a recommendation and may prepare a proposed decision record. A recommendation must not silently become a formal recorded decision. A decision is recorded only through an explicit user action or an explicit user instruction in chat.

This is a matter-integrity rule, not a legal-answer gate. It does not prevent the assistant from answering directly or recommending a course of action.

---

## 4. Target users

### 4.1 Primary persona

A product lawyer working inside a technology or fintech company who:

- Handles frequent “can we ship this?” questions.
- Works across product, compliance, privacy, marketing, operations, and regulatory issues.
- Has limited junior support.
- Receives incomplete and inconsistent intake.
- Must remember company-specific history and risk tolerance.
- Needs usable first-pass research and drafting, not a ceremonial research memo for every question.
- Is comfortable reviewing and correcting model output.

### 4.2 Secondary personas

- Solo general counsel.
- Head of Legal or combined legal-compliance lead.
- Small in-house legal team with a senior lawyer and one or two junior lawyers.
- Outside product counsel supporting a startup or small portfolio of clients.

### 4.3 Future modules

The architecture should permit later modules for:

- Transactional counsel.
- Litigation counsel.

Those modules are not included in the MVP. Product Counsel is the only implemented workflow and vocabulary.

---

## 5. Goals and success measures

### 5.1 MVP goals

1. A user can create or ingest a matter and see it on a legal-workflow board.
2. A user can open a matter and understand its status, context, and next action without searching through files.
3. A user can chat with an agent grounded in system, company, matter, and active-document context.
4. The chat can use tools to read and search files, create work items, move the matter, create documents, run research, create agents, and create schedules.
5. A user can trigger a first-pass research packet and have it saved into the matter.
6. A user can edit Markdown records and extracted document text in the workspace.
7. A user can record and review decisions across matters.
8. The system can flag decisions for review based on age, review date, or changes to linked internal sources.
9. A user can create and run recurring automations through chat or a basic automation page.
10. The application can run locally with Mock and can route each agent through an approved configured provider and model.

### 5.2 Primary product metrics

The MVP should be evaluated principally on usefulness and speed, not abstract legal accuracy scores.

- **Time to orientation:** Median time from opening a matter to identifying the next action.
- **Time to first useful artifact:** Time from intake to a saved research packet, issue map, or draft.
- **Matter clarity:** Percentage of active matters with a visible next action.
- **Agent leverage:** Percentage of matters in which an agent creates or updates an artifact.
- **User correction burden:** How much rewriting is needed before the output becomes useful.
- **Workflow completion:** Percentage of matters that progress from intake to response or closure.
- **Decision reuse:** Number of times prior decisions are surfaced or linked to new work.

### 5.3 Qualitative success test

A product lawyer should be able to use the application for a real product question and say:

> “This did the setup work, showed me the shape of the problem, and got me close enough that I could make the decision.”

---

## 6. MVP scope

### 6.1 Included

- Single-user local web application.
- Next.js browser frontend.
- FastAPI backend.
- Markdown source of truth.
- SQLite rebuildable index.
- Product Counsel workflow stages.
- Dashboard and Kanban board.
- Matter workspace with tree, chat, and editor.
- Markdown editing.
- PDF and DOCX upload with text extraction to an editable Markdown companion.
- Markdown comments, tracked changes, accept/reject review, and regenerated DOCX/PDF export.
- Agent registry loaded from Markdown.
- Tool registry loaded from Markdown descriptions and mapped to approved Python handlers.
- Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI model adapters.
- Per-agent provider, model, and reasoning-effort selection with workspace-default inheritance.
- Internal vault search.
- Polaris-backed public matter research plus the current optional native search path.
- First-pass research packet generation.
- Work items.
- Decision register.
- Deterministic decision-staleness checks.
- Agent-created schedules and agents.
- Inbox watcher.
- Human-readable action trace showing tools used and records changed.
- Guided creation and editing of reusable Markdown skills that apply to one explicit chat turn.

### 6.2 Explicitly excluded from MVP

- Multi-tenant cloud deployment.
- Authentication, SSO, enterprise RBAC, ethical walls, or team permissions.
- Preservation of the source Word/PDF layout during Markdown conversion.
- Import and round-trip preservation of existing Word/PDF review annotations.
- Full comment threads and Google Docs-style collaboration.
- Court-grade citation validation or automated Shepardizing/KeyCiting.
- Guaranteed comprehensive legal research.
- Mandatory source citations for every chat answer.
- Multi-agent voting or reviewer veto.
- Full contract lifecycle management.
- Email, Slack, Google Drive, or Microsoft 365 integrations.
- Arbitrary local shell execution.
- Arbitrary executable code embedded in Markdown tools.
- Production-grade job queues or distributed workers.
- Vector database or embeddings.
- Formal cloud architecture.
- Tauri packaging.

### 6.3 Why these exclusions are intentional

Each excluded feature adds significant implementation and trust complexity but is not necessary to demonstrate the central value proposition: reducing cognitive load and moving a product lawyer from ambiguous intake to useful work product and a decision.

---

## 7. Core user journeys

### 7.1 Open the command center

**Trigger:** User opens the application.

**Expected experience:**

- The top of the screen shows “Attention Required.”
- Stale decisions, blocked work, overdue items, and matters awaiting a decision appear before general metrics.
- The legal workflow board shows matters in Intake, Research, Explore, Generate, Respond, and Closed.
- Each card shows title, risk, owner, next action, and useful status indicators.
- A quick-intake control creates a matter without leaving the page.

**Acceptance:** The user can identify the top three things requiring attention without opening a matter.

### 7.2 Create a matter manually

**Trigger:** User submits a short request in quick intake.

**System behavior:**

- Create a stable matter ID and folder.
- Preserve the original request in an immutable request record.
- Create standard matter records.
- Create a first work item to review intake.
- Add an append-only matter event.
- Index the matter.
- Place the matter in Intake.

### 7.3 Ingest a file through the inbox

**Trigger:** A file appears in `vault/04_Inbox` or the user uploads it to the inbox.

**System behavior:**

- Detect the new file on the next watcher run.
- Create a matter using the filename and available extracted text.
- Move the original file into the matter’s documents folder.
- Extract PDF or DOCX text into an editable Markdown companion.
- Create an intake event and work item.
- Surface the matter in Intake.

### 7.4 Open a matter and orient

**Trigger:** User opens a Kanban card.

**Expected experience:**

- Header shows matter title, stage, risk, owner, target date, and next action.
- Left pane shows structured matter files and documents.
- Center pane shows chat with matter scope.
- Right pane opens the matter overview or selected file.
- A one-click “Orient me” prompt asks the assistant for a concise forest-level explanation.

### 7.5 Ask the assistant to do work

**Examples:**

- “What is the real issue here?”
- “Find prior decisions that are analogous.”
- “Create a work item for Product to answer the open data-retention question.”
- “Move this to Research.”
- “Run the research agent.”
- “Draft a response to the product manager and save it.”
- “Create an agent that checks this folder for updated policies.”
- “Run that agent every weekday morning.”

**System behavior:**

- Assemble system, user, company, memory, matter, and active-file context.
- Offer only tools allowed for the selected agent.
- Run a bounded ReAct/tool loop.
- Show the answer and a concise action trace.
- Persist created work product and state changes.
- Deliver a best-effort answer even if the loop reaches its step limit.

### 7.6 Run research

**Trigger:** User clicks “Run research” or asks chat to run it.

**System behavior:**

- Read the request, facts, issues, company context, playbooks, and relevant prior decisions.
- Search the internal vault.
- Use an optional external search provider when configured.
- Generate a research packet containing:
  - Executive orientation.
  - Issues presented.
  - Material facts and assumptions.
  - Relevant internal sources and prior decisions.
  - External sources, when available.
  - Analysis and practical implications.
  - Missing facts.
  - Options and suggested next steps.
- Save the packet in the matter.
- Complete or update the research work item.
- Move the matter to Explore unless the user has instructed otherwise.

Research is a useful first pass. It is not represented as exhaustive or perfect.

### 7.7 Generate and respond

**Trigger:** User asks the system to draft an output.

**System behavior:**

- Draft a response, recommendation, memo, checklist, or other requested artifact.
- Save the artifact to the matter when requested or when the user invokes a save action.
- Keep recommendation records separate from decision records.
- Move the matter only when instructed by the user or when a defined workflow automation does so.
- Treat approval, delivery, and closure as separate explicit actions.
- Close only after delivery or resolution is recorded and required work is complete.

### 7.8 Record a decision

**Trigger:** User explicitly records a decision through UI or chat.

**System behavior:**

- Create a separate decision record containing chosen path, rationale, decision maker, date, conditions, linked recommendation, review date, and linked source paths.
- Add a matter event.
- Index the decision globally.
- Never infer that a recommendation is final merely because it exists.

### 7.9 Review prior decisions

**Trigger:** User opens Decisions.

**Expected experience:**

- Stale and review-recommended decisions appear first by default.
- User can sort by staleness, risk, age, review date, or matter.
- Each row links to the matter and decision file.
- The reason for the staleness flag is visible.

### 7.10 Create an automation in chat

**Trigger:** User says, for example, “Every 15 minutes, have an intake agent check the inbox and create matters from new files.”

**System behavior:**

- Use `create_agent` if a new agent is requested.
- Use `create_schedule` to create a Markdown schedule record.
- Hot-load the new agent and schedule.
- Display the schedule on the Automations page.
- Log runs and update last/next run timestamps.

---

## 8. Information architecture

### 8.1 Top-level navigation

- **Work:** Command center and Kanban.
- **Decisions:** Global decision register.
- **Automations:** Schedules, agents, and run history.
- **Skills:** Guided reusable instructions, manual editing, and user-started repeated-work review.
- **Matter workspace:** Opened from a matter card or deep link.

A separate generic “Documents” application is not required. Documents are navigated inside the matter workspace.

### 8.2 Command center hierarchy

1. Attention required.
2. Quick intake and global actions.
3. Legal workflow board.
4. Lower-priority metrics and background activity.

### 8.3 Matter workspace hierarchy

The desktop view uses three panes:

1. **Left — Matter tree:** Predictable record structure, source documents, generated work product, and shortcuts to automations.
2. **Center — Copilot:** Context-aware chat, suggested actions, and visible action trace.
3. **Right — Work surface:** Markdown editor, extracted text, or native file viewer/download link.

The page header remains visible and provides stage, risk, target date, and next action.

### 8.4 Responsive behavior

The MVP is desktop-first. Below approximately 1100 pixels, panes may stack or become tabbed. Mobile optimization is not a release criterion.

---

## 9. Legal workflow model

### 9.1 Default stages

1. **Intake** — Understand the request and identify missing facts.
2. **Research** — Gather internal and external legal/business inputs.
3. **Explore** — Evaluate issues, implications, options, and risk.
4. **Generate** — Draft the requested work product.
5. **Respond** — Approve and deliver the work product, then capture follow-up.
6. **Closed** — Archive work that was delivered or otherwise resolved.

### 9.2 Workflow configuration

Stages are declared in `vault/00_System/workflows/product-counsel.md`. The frontend retrieves them from the API. This permits later modules to define different stages without rewriting the Kanban component.

### 9.3 Stage movement

- User may drag a card between stages.
- Chat may move a matter through the `move_matter_stage` tool.
- An agent may move a matter when its instructions explicitly authorize the transition.
- Transitions are logged.
- The MVP does not enforce a rigid state machine. Lawyers may move backward or skip stages.
- Moving a card cannot bypass closure checks. Closure is a separate action on the matter.

### 9.4 Next-action derivation

The system should show the highest-priority open required work item. If none exists, it derives a default next action from the stage:

- Intake: Confirm the request and material facts.
- Research: Run or review research.
- Explore: Evaluate options and unresolved issues.
- Generate: Create or revise the work product.
- Respond: Approve and deliver the work product.
- Closed: No action required.

### 9.5 Separate action and record concepts

- A work action moves the matter forward.
- An approval gives permission to use or send work product.
- A durable decision records a material legal or business position for future reliance.
- Matter closure records that delivery or resolution is complete and no required work remains.

Recording a durable decision may satisfy the central judgment in a matter. It does not approve a response, record delivery, or close the matter.

---

## 10. Data architecture

### 10.1 Source of truth

Markdown files and native attachments under `vault/` are the source of truth. SQLite is a disposable query index and may be deleted and rebuilt at any time.

### 10.2 Record philosophy

A matter is a small root record. Facts, issues, documents, work items, recommendations, decisions, and events remain separate. Generated summaries are views, not authoritative records.

### 10.3 Vault structure

```text
vault/
├── 00_System/
│   ├── Soul.md
│   ├── Agents.md
│   ├── user.md
│   ├── company.md
│   ├── memory.md
│   ├── agents/
│   ├── tools/
│   ├── schedules/
│   └── workflows/
├── 01_Playbooks/
├── 02_Company_Knowledge/
├── 03_Matters/
│   └── <matter-id>/
│       ├── matter.md
│       ├── request.md
│       ├── participants.md
│       ├── facts.md
│       ├── issues.md
│       ├── recommendations.md
│       ├── work-items/
│       ├── decisions/
│       ├── research/
│       ├── drafts/
│       ├── documents/
│       ├── conversations/
│       └── events/
└── 04_Inbox/
```

### 10.4 Core records

#### Matter

Required fields:

- `matter_id`
- `title`
- `description`
- `matter_type`
- `product_area`
- `business_team`
- `requester`
- `legal_owner`
- `business_owner`
- `stage`
- `priority`
- `risk_level`
- `target_date`
- `jurisdiction_scope`
- `privilege`
- `created_at`
- `updated_at`
- `closed_at`

#### Request

- `request_id`
- `matter_id`
- `original_text`
- `requester`
- `source_channel`
- `received_at`
- `business_objective`
- `requested_launch_date`
- `urgency`
- `attachments`
- `immutable: true`

Later changes are stored as events or additional request-version files; the original request is not overwritten.

#### Matter conversation

Matter chat transcripts are the intake session record when the intake agent is active. They are stored as read-only Markdown files under `conversations/` and preserve the exact user and assistant messages, stable message IDs, and timestamps. Derived facts link to the request or to a conversation message. A factual correction updates `facts.md`; it does not rewrite the transcript.

#### Participant

- `participant_id`
- `matter_id`
- `name`
- `role`
- `team`
- `contact`

The MVP may store participants as a structured list in `participants.md` rather than one file per participant.

#### Document or source

- Native file path.
- Matter ID.
- Title.
- Source type.
- Uploaded or created date.
- Optional extracted companion path.
- Optional external URL.

#### Fact and missing fact

The MVP stores these in `facts.md`, with stable identifiers in headings or frontmatter lists.

Fact fields should support:

- Statement.
- Status.
- Materiality.
- Source paths or locators.
- Reported by.
- Confidence.
- Jurisdiction.
- Effective time.
- Conflicting or superseded fact IDs.
- Privilege.

Missing fact fields should support:

- Question.
- Related issue.
- Priority.
- Status.
- Requested from.
- Requested and answered dates.
- Answer fact ID.

#### Issue

- `issue_id`
- `matter_id`
- `question`
- `category`
- `materiality`
- `status`
- `owner`

Formal claim and evidence records are deferred until research-backed recommendations require them. The Markdown structure should permit their addition without changing the Matter record.

#### Work item

Each work item is an individual Markdown file.

- `work_item_id`
- `matter_id`
- `issue_id`
- `type`
- `title`
- `description`
- `status`
- `priority`
- `owner`
- `due_at`
- `required`
- `blocked_reason`
- `evidence_paths`
- `completed_at`

Initial types:

- `question`
- `research`
- `document_review`
- `drafting`
- `business_follow_up`
- `counsel_review`
- `approval`
- `obligation`

#### Recommendation

The MVP may store multiple recommendations in `recommendations.md`; individual files may be introduced later.

- Summary.
- Rationale.
- Related issue and work product.
- Conditions.
- Alternatives.
- Risk if accepted.
- Risk if rejected.
- Confidence.
- Status.
- Created by and date.

#### Decision

Each decision is an individual Markdown file.

- `decision_id`
- `matter_id`
- `title`
- `issue_id`
- `recommendation_id`
- `decision_type`
- `chosen_path`
- `rationale`
- `decision_maker`
- `conditions`
- `decided_at`
- `next_review_at`
- `last_reviewed_at`
- `linked_paths`
- `review_status`
- `staleness_reason`
- `privilege`

#### Approval

For the MVP, approval state may remain on the matter and its approval work item. It must not be stored as a durable decision unless the underlying material policy or risk choice independently meets the durable-decision standard. A separate approval record should be introduced when multiple approvers, parallel approvals, or approval-specific reporting becomes necessary.

#### Matter event

Each event is an append-only Markdown record.

- `event_id`
- `matter_id`
- `event_type`
- `actor_type`
- `actor_id`
- `timestamp`
- `causation_id`
- `parent_event_id`
- Structured payload in frontmatter.
- Human-readable description in the body.

Cryptographic event chains are not required for the MVP.

### 10.5 SQLite index

The backend rebuilds the index at startup and after mutations. Tables include:

- `matters`
- `work_items`
- `decisions`
- `schedules`
- `documents`
- Document metadata used by cross-matter views

For the MVP, a full rebuild is preferred over complex incremental synchronization. The expected vault size is small enough that this is simpler and more reliable.

---

## 11. Agent architecture

### 11.1 Cognitive stack

- `Soul.md` — Identity, product philosophy, response style, and durable operating principles.
- `Agents.md` — Global standards for agent behavior and tool use.
- `user.md` — The lawyer’s background and working preferences.
- `company.md` — The company’s products, business model, risk posture, data flows, vendors, and regulatory context.
- `memory.md` — Append-only learned preferences and durable cross-session observations.
- `agents/*.md` — Individual agent definitions.
- `tools/*.md` — Human-readable tool schemas and descriptions.

### 11.2 Initial agents

#### Counsel Copilot

Default interactive agent. It orients, answers, drafts, searches, and invokes tools.

#### Intake Agent

Creates and enriches new matter records from incoming requests or files.

#### Research Agent

Produces a first-pass research packet from matter, company, playbook, prior-decision, and optional external-search context.

#### Decision Monitor

Checks decision review dates, age, and linked internal sources and prepares a review note.

### 11.3 Agent definition format

Each agent file contains YAML frontmatter:

```yaml
id: research-agent
name: Research Agent
description: Produces a practical first-pass research packet.
tools:
  - read_file
  - search_vault
  - write_markdown
  - create_work_item
  - move_matter_stage
max_steps: 6
```

The Markdown body contains the agent’s prompt.

### 11.4 ReAct loop

1. Assemble context.
2. Ask the model for an answer or tool call.
3. Execute approved tool calls.
4. Return observations to the model.
5. Repeat until the model answers or the step limit is reached.
6. If the limit is reached, make one final answer-only call instructing the model to deliver the best available work product.

The step limit is a cost and runaway-loop control. It must not result in an empty answer.

### 11.5 Context assembly

Default order:

1. `Soul.md`
2. `Agents.md`
3. Selected agent definition
4. `user.md`
5. `company.md`
6. Relevant portion of `memory.md`
7. Matter root and request
8. Key matter records
9. Active file
10. User message

The agent should use tools to search or read additional files rather than automatically injecting the entire vault into every request.

### 11.6 Model-provider strategy

The MVP includes:

- `mock` provider for a no-key runnable demo.
- `openai_compatible` provider using the Chat Completions tool-calling format.
- `opencode_go` provider using the configured OpenCode Go API.
- `codex` provider using the existing signed-in Codex CLI session.
- `antigravity_cli` provider using the existing signed-in Antigravity CLI session.

Each agent definition may store optional `provider`, `model`, and
`reasoning_effort` fields. An empty provider inherits the complete workspace
selection. An explicit provider requires its own model; an empty effort uses
that provider's default. Each run resolves and records one immutable selection
snapshot. An explicit unavailable selection fails visibly and never silently
changes provider or model.

Provider credentials and CLI sessions stay in the runtime environment. They
are not stored in the vault or SQLite. CLI-backed providers expose only
Counsel OS typed tools. They do not expose their own shell, file, browser, or
plugin tools.

Additional provider families are deferred. They must use the same small
provider interface when added.

### 11.7 No hidden legal validation pipeline

The MVP does not add a mandatory extractor, legal checker, reviewer, veto model, or confidence gate around each answer. Specialized agents may be added later as optional workflows, but the default chat path remains direct and responsive.

### 11.8 Visible execution trace

The UI may display:

- Tool name.
- Action performed.
- Files read or changed.
- Matter stage changes.
- Schedule or agent created.
- Success or failure.

It must not expose private chain-of-thought. The trace is an operational audit trail, not a transcript of internal reasoning.

### 11.9 Guided skills

A skill is a declarative Markdown instruction layer under `00_System/skills/`. A fixed five-question interview lets the lawyer build early, but always asks one final optional question before generating an unsaved draft. Only **Create skill** writes the file.

One enabled skill applies to one chat turn through `/<skill-id> <request>`. Its instructions appear after the active agent instructions. It cannot change operating standards, user directions, or the agent tool allow-list. The original slash command and an **Applied skill** summary remain in chat history.

**Find repeated work** is user-started. It analyzes only recent user messages. Each suggestion needs at least two stored message IDs, displays excerpts from those stored messages, and never creates or changes a skill without explicit approval.

---

## 12. Tool architecture

### 12.1 Design

Tools are described in Markdown and executed by whitelisted Python handlers.

This preserves Markdown-driven extensibility without executing arbitrary code embedded in a Markdown file. A new tool generally requires:

1. A Markdown description and JSON-schema-like parameter declaration.
2. A small Python handler registered under the declared handler name.

Changing descriptions, parameters, and agent access is hot-loaded. Adding a genuinely new capability requires code, which is the appropriate boundary for the MVP.

### 12.2 Initial tools

- `read_file`
- `list_files`
- `search_vault`
- `write_markdown`
- `create_work_item`
- `move_matter_stage`
- `run_research`
- `record_decision`
- `audit_decisions`
- `create_agent`
- `create_schedule`
- `append_memory`

### 12.3 Tool principles

- Tools act only inside the configured vault for the MVP.
- Paths are resolved and checked against the vault root.
- Tools return concise, structured observations.
- Mutations write Markdown first and rebuild the index afterward.
- Every meaningful mutation creates an event where practical.
- The MVP does not permit arbitrary shell commands or arbitrary Python execution.

---

## 13. Research design

### 13.1 Purpose

Research provides a practical foothold, not guaranteed exhaustive legal research.

### 13.2 Inputs

- Request.
- Matter facts and issues.
- Company context.
- Playbooks.
- Prior decisions.
- Active documents.
- Internal search results.
- Polaris public-intelligence results and optional native search results.

### 13.3 Output template

- Orientation.
- Question presented.
- Material facts and assumptions.
- Applicable frameworks or sources.
- Analysis.
- Product and operational implications.
- Options.
- Missing facts.
- Suggested next action.
- Sources reviewed.

### 13.4 External search

Polaris is the primary public source for on-demand matter research in the MVP.
The Intake Agent identifies researchable questions and proposes public query
candidates. The deterministic outbound policy removes or rejects private
company and matter data before a Polaris call. Polaris receives public intent
only.

Polaris observations and supplied citations are combined with private company
and matter context only inside Counsel OS by the selected Research Agent.
Polaris citations start as **Supplied** until Counsel OS retrieves and checks
them. If Polaris or native search is unavailable, the system must still
produce the best useful internal packet and identify the missing external
support.

### 13.5 Research button behavior

- Available on matter cards and in the matter workspace.
- Runs synchronously in the first scaffold for simplicity.
- Saves output before returning success.
- May be moved to a background job later without changing the API’s conceptual contract.

---

## 14. Document experience

### 14.1 Markdown

- Native read/write support.
- YAML frontmatter displayed as compact metadata.
- Explicit save button in the first pass.
- Read-only handling for immutable records.

### 14.2 PDF

- Upload and preserve the original file.
- Extract text using the backend.
- Create an editable `.extracted.md` companion.
- Allow opening or downloading the original.
- Export regenerated PDFs with standard highlight, underline, strikeout, and comment annotations for Markdown review data.

### 14.3 DOCX

- Upload and preserve the original file.
- Extract paragraph text to an editable Markdown companion.
- Export regenerated DOCX files with native Word comments and tracked-change elements.

### 14.4 Drag and drop

- User can drag files onto a matter folder or upload control.
- Supported MVP types: `.md`, `.txt`, `.pdf`, `.docx`.
- Upload response identifies any extracted companion.
- Tree refreshes after upload.

### 14.5 Future editor capabilities

- Selection-based AI rewrite.
- Import existing Word/PDF comments and redlines.
- Preserve complex source layout during round trips.

These are post-MVP features and should not block the core workflow.

---

## 15. Decision register and staleness monitor

### 15.1 Decision register

Default sort order:

1. Stale.
2. Review recommended.
3. Fresh.
4. Oldest review date.
5. Highest matter risk.

User-selectable sorts may include age, risk, decision date, review date, and matter.

### 15.2 MVP staleness rules

A decision is **Stale** when:

- `next_review_at` is in the past.

A decision is **Review Recommended** when:

- A linked internal source file has been modified after the decision or last review.
- The decision has not been reviewed within a configurable age threshold.

Otherwise, the decision is **Fresh**.

### 15.3 External legal-change monitoring

The MVP includes Continuous Legal Awareness. A lawyer can create an editable
Watch, select Counsel OS native collection, Polaris, or both, run a one-time
scan, and start or pause a schedule. A scan stores supported public
developments, Briefing items, provider warnings, and source coverage. It then
reloads current company knowledge inside Counsel OS to find links to matters,
decisions, and mitigations.

Briefing is a separate reading surface. Today contains only work that requires
the lawyer's attention. Useful monitored items can remain Briefing-only.

A Watch defines collection. A saved view defines presentation. A digest is an
immutable, dated snapshot of a saved view. A review packet prepares a lawyer's
judgment but never becomes a decision. The lawyer must explicitly choose Keep
current, Revise decision, Create follow-up, Not relevant, or Keep monitoring.

Each source has two separate labels:

- An objective source type, such as regulation, case, regulator material, or
  secondary legal analysis.
- A Watch-specific role: primary, secondary, discovery-only, or excluded.

Polaris supplies public intelligence only. Its citations remain **Supplied**
until Counsel OS retrieves and checks the cited material. A provider failure
does not erase useful output from another provider. The run is shown as
**Partial**, with its warning and successful results preserved.

### 15.4 Audit output

The monitor updates staleness metadata and writes a concise reason. It may create a high-priority work item for review.

---

## 16. Scheduler and automations

### 16.1 Schedule record

Each schedule is a Markdown file containing:

- `schedule_id`
- `name`
- `enabled`
- `agent_id`
- `interval_seconds`
- `target_path`
- `instructions`
- `last_run_at`
- `next_run_at`
- `last_status`
- `last_message`

### 16.2 MVP scheduler

- Lightweight asyncio loop inside FastAPI.
- Polls schedule files at a configurable interval.
- Runs due tasks.
- Updates schedule metadata.
- Supports manual “Run now.”
- Appropriate for a single-process local demo only.

### 16.3 Initial automation

Inbox watcher:

- Checks `vault/04_Inbox`.
- Creates matters for new files.
- Moves originals into the matter.
- Extracts PDF/DOCX text.
- Creates intake work.

### 16.4 Chat-driven agent and schedule creation

The chat can create:

- A new agent file with a name, prompt, and allowed tools.
- A schedule file referencing that agent.

The user may inspect and edit both files directly.

### 16.5 Production path

A cloud or team product should replace the in-process scheduler with a durable job system. This is not formalized in the MVP.

---

## 17. API requirements

### 17.1 Configuration

- `GET /api/config`
- Returns app name, workflow stages, model mode, and feature flags.

### 17.2 Matters

- `GET /api/matters`
- `POST /api/matters`
- `GET /api/matters/{matter_id}`
- `PATCH /api/matters/{matter_id}/stage`
- `POST /api/matters/{matter_id}/actions`
- `POST /api/matters/{matter_id}/research`
- `POST /api/matters/{matter_id}/upload`

### 17.3 Files

- `GET /api/files/tree?path=...`
- `GET /api/files?path=...`
- `PUT /api/files?path=...`
- `GET /api/files/raw?path=...`
- `GET /api/files/review?path=...`
- `PUT /api/files/review?path=...`
- `GET /api/files/export?path=...&format=docx|pdf`

### 17.4 Chat

- `POST /api/chat`
- Input includes message, optional matter ID, active file, and agent ID.
- Output includes response text and operational trace.

Token streaming is desirable but not required for scaffold completion. The response contract should permit a future streaming endpoint.

### 17.5 Decisions

- `GET /api/decisions`
- `POST /api/decisions`
- `POST /api/decisions/audit`

### 17.6 Automations

- `GET /api/automations`
- `POST /api/automations/schedules`
- `POST /api/automations/schedules/{schedule_id}/run`
- `POST /api/automations/agents`

### 17.7 Health

- `GET /api/health`

### 17.8 Skills

- `GET /api/skills`
- `GET /api/skills/questions`
- `POST /api/skills/draft`
- `POST /api/skills/suggestions`
- `POST /api/skills`
- `GET /api/skills/{skill_id}`
- `PUT /api/skills/{skill_id}`

---

## 18. Visual design requirements

### 18.1 Aesthetic

- Sleek, modern, calm, and functional.
- Dark warm charcoal and zinc foundation.
- No bright “SaaS blue” as a dominant color.
- Muted sage for successful/completed states.
- Warm amber or burnt orange for actionable attention.
- Red reserved for genuine failure or overdue risk.

### 18.2 Typography

- Geist, Inter, or system sans-serif.
- Strong but restrained hierarchy.
- Metadata smaller and muted.
- Main action and next step visually dominant.

### 18.3 Card design

Kanban cards should include only information needed to decide whether to open or act:

- Title.
- Matter type or product area.
- Risk.
- Next action.
- Owner.
- Target date when material.
- Agent activity indicator when applicable.

### 18.4 Cognitive-load rules

- Avoid walls of prose on the dashboard.
- Show one primary action per region.
- Hide low-value metadata until needed.
- Keep state vocabulary consistent across board, matter, and chat.
- Use color to signal action, not decoration.
- Preserve screen space for work product.

---

## 19. Security and integrity requirements

These are engineering controls, not legal-answer guardrails.

### 19.1 MVP requirements

- API keys remain server-side in `.env`.
- File paths are constrained to the configured vault root.
- Uploaded filenames are sanitized.
- Unsupported file types are rejected.
- Markdown tool files cannot execute embedded arbitrary code.
- The original request record is immutable through ordinary editing.
- A decision requires an explicit record action.
- The SQLite index is treated as disposable and non-authoritative.

### 19.2 Not included

- Authentication.
- Encryption at rest beyond the host system.
- Tenant isolation.
- Fine-grained privilege access controls.
- Production audit immutability.
- Enterprise retention controls.

The README must make clear that the scaffold is a local development MVP and should not be exposed to the public internet with confidential data.

---

## 20. Implementation architecture

### 20.1 Frontend

- Next.js App Router.
- React and TypeScript.
- Plain CSS design system for speed and minimal dependency surface.
- Client-side API service.
- Native HTML drag and drop for Kanban and file upload.

### 20.2 Backend

- Python 3.11+.
- FastAPI.
- Pydantic Settings.
- Repository-local frontmatter adapter built on PyYAML.
- Built-in SQLite.
- `httpx` for model and optional search calls.
- `pypdf` and `python-docx` for extraction.

### 20.3 Storage

- Markdown and attachments in `vault/`.
- SQLite at `vault/.counsel_os_cache.db`.
- Full rebuild on startup and mutation.

### 20.4 Desktop path

Tauri may later wrap the web frontend and launch a packaged backend sidecar. No Tauri code is included in the MVP. The frontend avoids reliance on Next.js server actions so that a future static export is practical.

### 20.5 Cloud-native horizon — intentionally not formalized

A future cloud application could map:

- Vault files to object storage.
- SQLite to Postgres.
- In-process schedules to durable background jobs.
- Single-user state to workspaces, users, and permissions.

This direction is plausible but not a committed architecture. The MVP should not be burdened with cloud tenancy abstractions before the product workflow is validated.

---

## 21. Functional requirements

### Dashboard and workflow

- **FR-001:** The system shall display matters grouped by configured legal workflow stage.
- **FR-002:** The system shall allow drag-and-drop stage changes.
- **FR-003:** The system shall display a derived next action on each active matter.
- **FR-004:** The system shall display stale decisions and overdue required work in Attention Required.
- **FR-005:** The user shall be able to create a matter from a short intake form.

### Matter workspace

- **FR-010:** The system shall display matter metadata and next action in a persistent header.
- **FR-011:** The system shall display a hierarchical matter tree.
- **FR-012:** The user shall be able to open a file from the tree in the work surface.
- **FR-013:** The user shall be able to edit and save Markdown files unless marked immutable.
- **FR-014:** The user shall be able to upload supported files to a matter folder.
- **FR-015:** The system shall create editable extraction companions for PDF and DOCX files.
- **FR-016:** The matter workspace shall show a stage-aware primary action.
- **FR-017:** Approval, delivery, durable-decision recording, and closure shall persist as separate actions.
- **FR-018:** Matter closure shall require completed delivery or resolution and no open required work.
- **FR-019:** Editable Markdown shall support comments, tracked changes, accept/reject actions, and regenerated Word/PDF export with native review objects.

### Chat and agents

- **FR-020:** The user shall be able to chat in global or matter scope.
- **FR-021:** The chat shall receive active matter and active file context.
- **FR-022:** The selected agent shall be loaded from Markdown at runtime.
- **FR-023:** The agent shall be able to invoke its allowed tools.
- **FR-024:** The system shall return a useful answer after a bounded tool loop.
- **FR-025:** The UI shall display operational tool traces without chain-of-thought.
- **FR-026:** The user shall be able to create an agent through chat.
- **FR-027:** The user shall be able to create a reusable skill through the fixed guided interview without prompt-design knowledge.
- **FR-028:** One explicit slash command shall apply one enabled skill to one chat turn without changing agent tools.
- **FR-029:** Applied-skill disclosure shall persist with matter and Today assistant messages.
- **FR-029A:** Each agent shall persist an optional provider, model, and reasoning effort and shall inherit the workspace default when an override is empty.
- **FR-029B:** An explicit unavailable agent selection shall fail visibly without silently changing provider or model.

### Research

- **FR-030:** The user shall be able to trigger research from the card, workspace, or chat.
- **FR-031:** Research shall use internal matter, playbook, company, and prior-decision context.
- **FR-032:** Research shall use Polaris as the primary public source when available, keep private context local, and degrade to a useful labeled internal packet when external research fails.
- **FR-033:** Research output shall be saved as a Markdown packet.
- **FR-034:** Research completion shall update the matter and related work item.

### Decisions

- **FR-040:** The system shall index and display decisions across matters.
- **FR-041:** The system shall sort flagged decisions first by default.
- **FR-042:** The system shall audit review dates and linked internal source modification times.
- **FR-043:** The system shall store and display the staleness reason.
- **FR-044:** The assistant shall not silently convert a recommendation into a decision.
- **FR-045:** Durable-decision recording shall appear only when a material choice is identified.

### Automations

- **FR-050:** The system shall load schedules from Markdown.
- **FR-051:** The scheduler shall execute due tasks in a local background loop.
- **FR-052:** The user shall be able to run a schedule immediately.
- **FR-053:** The chat shall be able to create a schedule.
- **FR-054:** The default inbox watcher shall create matters from new files.

### Data and audit

- **FR-060:** Markdown shall remain the authoritative record.
- **FR-061:** The SQLite index shall be rebuildable.
- **FR-062:** Material mutations shall create matter events where applicable.
- **FR-063:** File operations shall remain within the vault root.

---

## 22. Non-functional requirements

- **NFR-001 — Startup:** Local startup should require no cloud service and no API key.
- **NFR-002 — Demo resilience:** Mock mode must support navigation, CRUD, stage movement, research scaffolding, decisions, and schedules.
- **NFR-003 — Performance:** Dashboard load should feel immediate for 100 matters and several thousand Markdown files on a typical laptop.
- **NFR-004 — Modularity:** A new agent or schedule must be addable without modifying core UI code.
- **NFR-005 — Provider independence:** Model-provider logic must be behind a small interface.
- **NFR-006 — Inspectability:** The user must be able to inspect the files controlling agent behavior.
- **NFR-007 — Failure behavior:** A failed tool or provider call must produce a visible error and preserve existing files.
- **NFR-008 — Atomic writes:** Markdown mutation should use atomic replacement where practical.
- **NFR-009 — Accessibility:** Interactive controls need labels and visible focus states.
- **NFR-010 — File size:** Code modules should remain focused and generally below 300 lines.

---

## 23. Acceptance scenarios

### Scenario A — Manual intake to orientation

1. Create a matter from the dashboard.
2. Verify it appears in Intake.
3. Verify the new matter opens directly in Chat with Themis while the Intake Agent reads the request in a background run.
4. Verify the first response summarizes the actual request and asks one material, request-specific question.
5. Answer the question and verify the next question adapts to the answer.
6. Stop intake early and verify the exact transcript, source-linked matter records, useful labeled dossier, and next counsel action remain available.

### Scenario B — Chat changes workflow state

1. Open a matter in Intake.
2. Tell chat, “Move this to Research.”
3. Agent invokes `move_matter_stage`.
4. Board and matter header show Research after refresh.
5. Event record exists.

### Scenario C — Research packet

1. Click Run research.
2. System reads matter and internal context.
3. Research packet is created in `research/`.
4. Packet opens in the editor.
5. Matter moves to Explore.
6. Research work item is complete.

### Scenario D — File ingestion

1. Upload a PDF or DOCX into a matter.
2. Original appears under documents.
3. Extracted Markdown companion appears.
4. Companion opens and is editable.
5. User can track edits, add a comment, accept or reject changes, and export a reviewed Word or PDF file.

### Scenario E — Decision staleness

1. Open Decisions.
2. Run audit.
3. A decision with a past review date is marked Stale.
4. A decision linked to a policy modified after the decision is Review Recommended.
5. Reason is visible.

### Scenario F — Chat-created automation

1. Ask chat to create a new agent and schedule.
2. Agent and schedule Markdown files are created.
3. Automation page displays the schedule.
4. Run Now executes it and updates run metadata.

### Scenario G — Inbox watcher

1. Place a supported file in `vault/04_Inbox`.
2. Run the inbox schedule or wait for its interval.
3. A new matter is created.
4. File is moved into the matter.
5. Matter appears in Intake.

### Scenario H — Guided skill to visible chat use

1. Answer the first three guided questions and select **Build it now**.
2. Answer or decline the final optional question.
3. Review the unsaved editable draft, then explicitly create it.
4. Invoke the saved skill with `/<skill-id>` in matter chat.
5. Confirm the assistant shows **Applied skill: <name>** before and after reload.
6. Start **Find repeated work** and confirm suggestions use stored user-message evidence and do not save automatically.

---

## 24. Delivery plan

### Wave 0 — Runnable shell

- Repository and environment setup.
- Sample vault.
- FastAPI health/config endpoints.
- Next.js shell and navigation.
- SQLite schema and rebuild.

### Wave 1 — Core legal workflow

- Matter CRUD.
- Kanban and stage movement.
- Matter workspace and tree.
- Markdown editor.
- Work items and next action.

### Wave 2 — Agentic work loop

- Provider interface.
- Agent and tool registries.
- Chat and operational trace.
- State-changing tools.
- Mock provider.

### Wave 3 — Research and documents

- PDF/DOCX extraction.
- Internal search.
- Optional external search.
- Research packet and stage update.

### Wave 4 — Decisions and automations

- Decision register.
- Staleness audit.
- Scheduler.
- Inbox watcher.
- Chat-created agents and schedules.

### Wave 5 — Product polish

- Better empty states and loading states.
- Keyboard shortcuts.
- Resizable panes.
- Streaming model output.
- More robust tests.

The included scaffold implements the foundation and representative portions of Waves 0–4. The coding agent should first make the included acceptance tests pass before adding post-MVP features.

---

## 25. Open questions intentionally deferred

1. Whether the long-term product is cloud-native, desktop-first, or hybrid.
2. Whether Markdown remains the canonical production store for multi-user deployments.
3. Which additional research providers, if any, should be added after Polaris misses a measured need.
4. Whether company memory should be curated manually, automatically, or through a review queue.
5. Whether later versions must preserve complex source layout and imported review objects during Word/PDF round trips.
6. Whether each company should define its own workflow stages or select from module templates.
7. Whether scheduled agents may make external changes without confirmation in a production team environment.
8. Whether matters need formal privilege walls and legal-hold controls.

None of these questions should block the MVP.

---

## 26. Definition of done for the first demo

The first demo is complete when a lawyer can:

1. Open a polished command center and immediately see what needs attention.
2. Create a matter or ingest a file.
3. Open the matter and understand what it is, what has happened, and what to do next.
4. Ask the assistant a question and receive a direct, useful answer.
5. Ask the assistant to move the matter, create work, or save a draft.
6. Run a first-pass research packet.
7. Edit the resulting Markdown work product.
8. Review a prior decision and see a meaningful staleness flag.
9. Create or run an automation.
10. Inspect the Markdown files that define the system, agents, tools, and records.
11. Assign different provider/model/reasoning combinations to different agents and observe those selections on their runs.
12. Submit an incomplete matter, answer contextual intake questions in Chat with Themis, and receive privacy-safe Polaris research plus a useful editable dossier.

The demo does not need to prove that the assistant is always right. It needs to prove that the assistant materially reduces setup work and gets a lawyer to useful judgment faster.
