# Graph Report - counsel-os-mvp  (2026-08-26)

## Corpus Check
- 208 files · ~61,336 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1197 nodes · 2179 edges · 166 communities (68 shown, 98 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1665eb98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VaultService
- AppContext
- design.ts
- runtime.py
- Counsel OS MVP
- dependencies
- .__init__
- compilerOptions
- IndexService
- handlers.py
- types.ts
- frontmatter.py
- 10.4 Core records
- test_research_writes_packet_and_moves_to_explore
- layout.tsx
- dev.sh
- agents/__init__.py
- app/__init__.py
- providers/__init__.py
- services/__init__.py
- tools/__init__.py
- next.config.ts
- next-env.d.ts
- setup.sh
- verify.sh
- Build plan
- Current Project State
- Architecture
- 11. Agent architecture
- Product Requirements Document
- 7. Core user journeys
- Acceptance tests
- Context Map
- 17. API requirements
- 21. Functional requirements
- 23. Acceptance scenarios
- 3. Non-negotiable product principles
- 24. Delivery plan
- Decisions and Milestones
- 13. Research design
- 14. Document experience
- 16. Scheduler and automations
- 20. Implementation architecture
- 15. Decision register and staleness monitor
- 18. Visual design requirements
- 8. Information architecture
- 9. Legal workflow model
- Agent Standards
- Company Profile: DemoCo Financial
- Soul
- First-Pass Research Packet
- research/page.tsx
- 2. Product thesis
- 4. Target users
- 5. Goals and success measures
- Memory
- Product Review Playbook
- Approve restricted analytics SDK configuration
- Pilot voice logging with a 30-day cap
- API.md
- frontend/AGENTS.md
- counsel-copilot.md
- decision-monitor.md
- intake-agent.md
- research-agent.md
- decision-audit.md
- inbox-watcher.md
- append_memory.md
- audit_decisions.md
- create_agent.md
- create_schedule.md
- create_work_item.md
- list_files.md
- move_matter_stage.md
- read_file.md
- record_decision.md
- run_research.md
- search_vault.md
- write_markdown.md
- user.md
- product-counsel.md
- decision-review.md
- product-and-funds-flow.md
- beacon-instant-onboarding/events/2026-08-25-seeded.md
- 2026-08-26-EVT-20260826-97e83b.md
- beacon-instant-onboarding/facts.md
- beacon-instant-onboarding/issues.md
- beacon-instant-onboarding/matter.md
- beacon-instant-onboarding/participants.md
- beacon-instant-onboarding/recommendations.md
- beacon-instant-onboarding/request.md
- WI-20260826-d530a9.md
- WI-MAT-DEMO-BEACON-1.md
- WI-MAT-DEMO-BEACON-2.md
- delta-pricing-copy/events/2026-08-25-seeded.md
- delta-pricing-copy/facts.md
- delta-pricing-copy/issues.md
- delta-pricing-copy/matter.md
- delta-pricing-copy/participants.md
- delta-pricing-copy/recommendations.md
- delta-pricing-copy/request.md
- WI-MAT-DEMO-DELTA-1.md
- WI-MAT-DEMO-DELTA-2.md
- harbor-support-response/events/2026-08-25-seeded.md
- harbor-support-response/facts.md
- harbor-support-response/issues.md
- harbor-support-response/matter.md
- harbor-support-response/participants.md
- harbor-support-response/recommendations.md
- harbor-support-response/request.md
- WI-MAT-DEMO-HARBOR-1.md
- WI-MAT-DEMO-HARBOR-2.md
- 2026-07-12-seeded.md
- mason-sdk-closed/facts.md
- mason-sdk-closed/issues.md
- mason-sdk-closed/matter.md
- mason-sdk-closed/participants.md
- mason-sdk-closed/recommendations.md
- mason-sdk-closed/request.md
- WI-MAT-DEMO-MASON-1.md
- orbit-bank-data/events/2026-08-25-seeded.md
- orbit-bank-data/facts.md
- orbit-bank-data/issues.md
- orbit-bank-data/matter.md
- orbit-bank-data/participants.md
- orbit-bank-data/recommendations.md
- orbit-bank-data/request.md
- WI-MAT-DEMO-ORBIT-1.md
- project-apex-ai/events/2026-08-25-seeded.md
- project-apex-ai/facts.md
- project-apex-ai/issues.md
- project-apex-ai/matter.md
- project-apex-ai/participants.md
- project-apex-ai/recommendations.md
- project-apex-ai/request.md
- WI-MAT-DEMO-APEX-1.md
- WI-MAT-DEMO-APEX-2.md
- 04_Inbox/README.md
- briefing.ts
- MatterWorkspace.tsx
- api.ts
- Counsel OS design language
- 2026-08-27-EVT-20260827-4b3ce3.md
- workspace/page.tsx
- 6. MVP scope
- CLAUDE.md
- Counsel OS — connect the four UI stubs
- Connect the Counsel OS UI stubs to real endpoints
- ChatHistoryService
- Written for — audience-shaped work product
- SettingsService
- test_annotations.py
- test_automations_api.py
- 2026-08-27-EVT-20260827-5c5896.md
- connect-stubs.handoff-progress.md
- audiences.md
- settings.md
- WI-20260827-730594.md
- 2026-08-27-EVT-20260827-cd5b0e.md
- ToolRegistry
- test_chat_history.py

## God Nodes (most connected - your core abstractions)
1. `VaultService` - 70 edges
2. `AppContext` - 64 edges
3. `IndexService` - 39 edges
4. `MatterService` - 37 edges
5. `iso_now()` - 28 edges
6. `Product Requirements Document` - 28 edges
7. `request()` - 26 edges
8. `ToolExecutionContext` - 21 edges
9. `AgentRegistry` - 19 edges
10. `Settings` - 19 edges

## Surprising Connections (you probably didn't know these)
- `ContextBuilder` --uses--> `IndexService`  [INFERRED]
  backend/app/agents/context.py → backend/app/services/index.py
- `ContextBuilder` --uses--> `VaultService`  [INFERRED]
  backend/app/agents/context.py → backend/app/services/vault.py
- `AppContext` --uses--> `ContextBuilder`  [INFERRED]
  backend/app/runtime.py → backend/app/agents/context.py
- `AgentDefinition` --uses--> `VaultService`  [INFERRED]
  backend/app/agents/registry.py → backend/app/services/vault.py
- `ToolExecutionContext` --uses--> `AgentDefinition`  [INFERRED]
  backend/app/tools/registry.py → backend/app/agents/registry.py

## Import Cycles
- None detected.

## Communities (166 total, 98 thin omitted)

### Community 0 - "VaultService"
Cohesion: 0.12
Nodes (13): AgentDefinition, AnnotationService, Any, Any, Path, Safe, atomic access to the Markdown-first vault., VaultService, Any (+5 more)

### Community 1 - "AppContext"
Cohesion: 0.07
Nodes (58): lifespan(), get, root(), AnnotationCreate, StageUpdate, create_agent(), create_schedule(), get_agent() (+50 more)

### Community 2 - "design.ts"
Cohesion: 0.17
Nodes (23): CountFilter, MattersPage(), compare(), dateTime(), MattersTable(), SortDirection, SortKey, formatWeek() (+15 more)

### Community 3 - "runtime.py"
Cohesion: 0.06
Nodes (49): ContextBuilder, AgentDefinition, AgentRegistry, Any, AgentRunner, Any, _unique(), AgentUpdate (+41 more)

### Community 4 - "Counsel OS MVP"
Cohesion: 0.05
Nodes (35): Counsel OS coding-agent instructions, Do not add legal-answer theater, Engineering rules, graphify, Product north star, Verification, Codex handoff prompt, Definition of success (+27 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, lexical, @lexical/link, @lexical/list, @lexical/markdown, @lexical/react, @lexical/rich-text, next (+32 more)

### Community 6 - ".__init__"
Cohesion: 0.09
Nodes (23): get_settings(), Path, Runtime settings loaded from the repository-level .env file., Settings, ProviderReply, ProviderToolCall, Any, build_provider() (+15 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 8 - "IndexService"
Cohesion: 0.23
Nodes (6): IndexService, Any, Path, Disposable SQLite read model rebuilt from Markdown records., _sqlite_value(), Connection

### Community 9 - "handlers.py"
Cohesion: 0.16
Nodes (22): AgentCreate, append_memory(), audit_decisions(), build_handlers(), create_agent(), create_schedule(), create_work_item(), _filename() (+14 more)

### Community 10 - "types.ts"
Cohesion: 0.17
Nodes (13): SettingsPage(), getSettings(), saveSettings(), ChatConversation, ChatHistoryMessage, ChatResponse, ResearchResult, SettingKind (+5 more)

### Community 11 - "frontmatter.py"
Cohesion: 0.27
Nodes (8): dumps(), load(), loads(), Post, Any, Path, Tiny python-frontmatter-compatible subset used by the MVP. The project keeps…, TextIO

### Community 12 - "10.4 Core records"
Cohesion: 0.12
Nodes (17): 10.1 Source of truth, 10.2 Record philosophy, 10.3 Vault structure, 10.4 Core records, 10.5 SQLite index, 10. Data architecture, Approval, Decision (+9 more)

### Community 14 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, mono, sans, serif

### Community 28 - "Build plan"
Cohesion: 0.12
Nodes (15): Active checkpoint — Markdown WYSIWYG editor, Backlog after validation, Build, Build plan, Demo script, Parked backlog, Payoff moment, Rule for every wave (+7 more)

### Community 29 - "Current Project State"
Cohesion: 0.13
Nodes (14): Active Assumptions, Active Goal, Blocked, Current Project State, Exit Conditions, Later, Next, Next Resume Action (+6 more)

### Community 30 - "Architecture"
Cohesion: 0.13
Nodes (14): 10. Decision staleness, 11. Scheduler, 12. Frontend boundaries, 13. Future replacement points, 1. Chosen shape, 2. Why this is not a single Next.js application, 3. Why Markdown plus SQLite, 4. Main backend components (+6 more)

### Community 31 - "11. Agent architecture"
Cohesion: 0.15
Nodes (13): 11.1 Cognitive stack, 11.2 Initial agents, 11.3 Agent definition format, 11.4 ReAct loop, 11.5 Context assembly, 11.6 Model-provider strategy, 11.7 No hidden legal validation pipeline, 11.8 Visible execution trace (+5 more)

### Community 32 - "Product Requirements Document"
Cohesion: 0.15
Nodes (13): 12.1 Design, 12.2 Initial tools, 12.3 Tool principles, 12. Tool architecture, 19.1 MVP requirements, 19.2 Not included, 19. Security and integrity requirements, 1. Executive summary (+5 more)

### Community 33 - "7. Core user journeys"
Cohesion: 0.18
Nodes (11): 7.10 Create an automation in chat, 7.1 Open the command center, 7.2 Create a matter manually, 7.3 Ingest a file through the inbox, 7.4 Open a matter and orient, 7.5 Ask the assistant to do work, 7.6 Run research, 7.7 Generate and respond (+3 more)

### Community 34 - "Acceptance tests"
Cohesion: 0.22
Nodes (8): A. Command center, Acceptance tests, B. Matter workspace, C. Chat, D. Research, E. Decisions, F. Automations, G. Integrity

### Community 35 - "Context Map"
Cohesion: 0.25
Nodes (7): Context Map, External Systems, Generated, Vendored, or Heavy Paths, Key Schemas and Contracts, Known Navigation Gaps, Repository Map, Selective Reading Guide

### Community 36 - "17. API requirements"
Cohesion: 0.25
Nodes (8): 17.1 Configuration, 17.2 Matters, 17.3 Files, 17.4 Chat, 17.5 Decisions, 17.6 Automations, 17.7 Health, 17. API requirements

### Community 37 - "21. Functional requirements"
Cohesion: 0.25
Nodes (8): 21. Functional requirements, Automations, Chat and agents, Dashboard and workflow, Data and audit, Decisions, Matter workspace, Research

### Community 38 - "23. Acceptance scenarios"
Cohesion: 0.25
Nodes (8): 23. Acceptance scenarios, Scenario A — Manual intake to orientation, Scenario B — Chat changes workflow state, Scenario C — Research packet, Scenario D — File ingestion, Scenario E — Decision staleness, Scenario F — Chat-created automation, Scenario G — Inbox watcher

### Community 39 - "3. Non-negotiable product principles"
Cohesion: 0.25
Nodes (8): 3.1 Helpful work product over legal perfection, 3.2 Forest before trees, 3.3 Cognitive-load reduction, 3.4 Work product, not conversation for its own sake, 3.5 Transparent and editable intelligence, 3.6 Modular, but not abstract for abstraction’s sake, 3.7 Recommendations are not decisions, 3. Non-negotiable product principles

### Community 40 - "24. Delivery plan"
Cohesion: 0.29
Nodes (7): 24. Delivery plan, Wave 0 — Runnable shell, Wave 1 — Core legal workflow, Wave 2 — Agentic work loop, Wave 3 — Research and documents, Wave 4 — Decisions and automations, Wave 5 — Product polish

### Community 41 - "Decisions and Milestones"
Cohesion: 0.33
Nodes (5): 2026-08-25 — Markdown-first local MVP architecture, 2026-08-25 — Milestone: Mock-mode MVP acceptance complete, 2026-08-25 — Milestone: MVP scaffold documented, 2026-08-26 — Milestone: Markdown-backed WYSIWYG editing complete, Decisions and Milestones

### Community 42 - "13. Research design"
Cohesion: 0.33
Nodes (6): 13.1 Purpose, 13.2 Inputs, 13.3 Output template, 13.4 External search, 13.5 Research button behavior, 13. Research design

### Community 43 - "14. Document experience"
Cohesion: 0.33
Nodes (6): 14.1 Markdown, 14.2 PDF, 14.3 DOCX, 14.4 Drag and drop, 14.5 Future editor capabilities, 14. Document experience

### Community 44 - "16. Scheduler and automations"
Cohesion: 0.33
Nodes (6): 16.1 Schedule record, 16.2 MVP scheduler, 16.3 Initial automation, 16.4 Chat-driven agent and schedule creation, 16.5 Production path, 16. Scheduler and automations

### Community 45 - "20. Implementation architecture"
Cohesion: 0.33
Nodes (6): 20.1 Frontend, 20.2 Backend, 20.3 Storage, 20.4 Desktop path, 20.5 Cloud-native horizon — intentionally not formalized, 20. Implementation architecture

### Community 46 - "15. Decision register and staleness monitor"
Cohesion: 0.40
Nodes (5): 15.1 Decision register, 15.2 MVP staleness rules, 15.3 External legal-change monitoring, 15.4 Audit output, 15. Decision register and staleness monitor

### Community 47 - "18. Visual design requirements"
Cohesion: 0.40
Nodes (5): 18.1 Aesthetic, 18.2 Typography, 18.3 Card design, 18.4 Cognitive-load rules, 18. Visual design requirements

### Community 48 - "8. Information architecture"
Cohesion: 0.40
Nodes (5): 8.1 Top-level navigation, 8.2 Command center hierarchy, 8.3 Matter workspace hierarchy, 8.4 Responsive behavior, 8. Information architecture

### Community 49 - "9. Legal workflow model"
Cohesion: 0.40
Nodes (5): 9.1 Default stages, 9.2 Workflow configuration, 9.3 Stage movement, 9.4 Next-action derivation, 9. Legal workflow model

### Community 50 - "Agent Standards"
Cohesion: 0.40
Nodes (4): Agent Standards, Mutation standard, Output standard, Shared execution loop

### Community 51 - "Company Profile: DemoCo Financial"
Cohesion: 0.40
Nodes (4): Business, Company Profile: DemoCo Financial, Product and data context, Risk posture

### Community 52 - "Soul"
Cohesion: 0.40
Nodes (4): Non-negotiable operating principles, Purpose, Soul, Working style

### Community 53 - "First-Pass Research Packet"
Cohesion: 0.40
Nodes (4): First-Pass Research Packet, Last-mile verification, Orientation, Viable paths

### Community 54 - "research/page.tsx"
Cohesion: 0.18
Nodes (16): newestResearchPath(), ResearchPage(), safeResearchPath(), answerAnnotation(), createAnnotation(), getAnnotations(), MemoRun, parseMemo() (+8 more)

### Community 55 - "2. Product thesis"
Cohesion: 0.50
Nodes (4): 2.1 The core problem, 2.2 The intended outcome, 2.3 Product promise, 2. Product thesis

### Community 56 - "4. Target users"
Cohesion: 0.50
Nodes (4): 4.1 Primary persona, 4.2 Secondary personas, 4.3 Future modules, 4. Target users

### Community 57 - "5. Goals and success measures"
Cohesion: 0.50
Nodes (4): 5.1 MVP goals, 5.2 Primary product metrics, 5.3 Qualitative success test, 5. Goals and success measures

### Community 58 - "Memory"
Cohesion: 0.50
Nodes (3): Durable working preferences, Memory, Recent learning

### Community 59 - "Product Review Playbook"
Cohesion: 0.50
Nodes (3): Expected work product, Forest-first questions, Product Review Playbook

### Community 60 - "Approve restricted analytics SDK configuration"
Cohesion: 0.50
Nodes (3): Approve restricted analytics SDK configuration, Chosen path, Rationale

### Community 61 - "Pilot voice logging with a 30-day cap"
Cohesion: 0.50
Nodes (3): Chosen path, Pilot voice logging with a 30-day cap, Rationale

### Community 142 - "briefing.ts"
Cohesion: 0.14
Nodes (23): DecisionsPage(), TodayPage(), BriefingList(), DecisionTable(), auditDecisions(), getDecisions(), getMatters(), Briefing (+15 more)

### Community 143 - "MatterWorkspace.tsx"
Cohesion: 0.11
Nodes (21): MatterPage(), DocumentPanel(), MARKDOWN_TRANSFORMERS, MarkdownRichEditor(), MatterTree(), collectEvidence(), countFiles(), EvidenceNode (+13 more)

### Community 144 - "api.ts"
Cohesion: 0.14
Nodes (30): AgentsPage(), AutomationsPage(), ChatPanel(), Message, SUGGESTIONS, API_BASE, createDecision(), createSchedule() (+22 more)

### Community 145 - "Counsel OS design language"
Cohesion: 0.20
Nodes (9): Agent versus record, Buttons, Colour roles — meaning, not decoration, Counsel OS design language, Screens, Stage vocabulary, Surfaces, The premise (+1 more)

### Community 147 - "workspace/page.tsx"
Cohesion: 0.24
Nodes (11): WorkspacePage(), AppShell(), links, AutomationPanel(), NewMatterForm(), createMatter(), moveMatter(), cadence() (+3 more)

### Community 148 - "6. MVP scope"
Cohesion: 0.50
Nodes (4): 6.1 Included, 6.2 Explicitly excluded from MVP, 6.3 Why these exclusions are intentional, 6. MVP scope

### Community 150 - "Counsel OS — connect the four UI stubs"
Cohesion: 0.08
Nodes (23): Acceptance, `AgentRegistry` (`backend/app/agents/registry.py`), Backend shape, Corrected claims — read this before Step 1, Counsel OS — connect the four UI stubs, Do NOT, Existing vault files, Frontend shape (+15 more)

### Community 151 - "Connect the Counsel OS UI stubs to real endpoints"
Cohesion: 0.09
Nodes (21): Acceptance, `AgentRegistry` (`backend/app/agents/registry.py`), Backend shape, Connect the Counsel OS UI stubs to real endpoints, Corrected claims — read this before Step 1, Do NOT, Existing vault files, Frontend shape (+13 more)

### Community 152 - "ChatHistoryService"
Cohesion: 0.40
Nodes (3): ChatHistoryService, Any, Stores each matter conversation as an inspectable Markdown record.

### Community 153 - "Written for — audience-shaped work product"
Cohesion: 0.17
Nodes (11): Agent default — agent front matter, Injection, Next increment — per-request override, Not doing, Presets — `00_System/audiences.md`, Storage, The mechanic, UI (+3 more)

### Community 154 - "SettingsService"
Cohesion: 0.33
Nodes (6): Any, SettingsService, _empty_settings(), test_settings_are_on_disk_not_in_memory(), test_settings_merge_rather_than_replace(), test_training_attestation_is_stamped_once()

### Community 155 - "test_annotations.py"
Cohesion: 0.38
Nodes (4): asyncio, test_annotation_answer_is_stored(), test_annotation_answer_survives_a_hostile_model_reply(), test_blank_annotation_answer_is_not_stored()

### Community 156 - "test_automations_api.py"
Cohesion: 0.70
Nodes (4): _client(), test_agent_get_and_put(), test_audiences_endpoint(), test_tools_endpoint_lists_real_tool_ids()

### Community 164 - "ToolRegistry"
Cohesion: 0.39
Nodes (4): AgentDefinition, Any, Handler, ToolRegistry

### Community 165 - "test_chat_history.py"
Cohesion: 0.83
Nodes (3): _client(), test_conversation_cannot_be_read_from_another_matter(), test_matter_chat_is_saved_and_can_start_a_new_conversation()

## Knowledge Gaps
- **450 isolated node(s):** `serif`, `sans`, `mono`, `metadata`, `CountFilter` (+445 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **98 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppContext` connect `AppContext` to `VaultService`, `runtime.py`, `.__init__`, `IndexService`, `ChatHistoryService`, `SettingsService`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `VaultService` connect `VaultService` to `AppContext`, `runtime.py`, `ToolRegistry`, `.__init__`, `IndexService`, `handlers.py`, `ChatHistoryService`, `SettingsService`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `IndexService` connect `IndexService` to `VaultService`, `AppContext`, `runtime.py`, `.__init__`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `VaultService` (e.g. with `ContextBuilder` and `AgentDefinition`) actually correct?**
  _`VaultService` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `AppContext` (e.g. with `ContextBuilder` and `AgentRegistry`) actually correct?**
  _`AppContext` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `IndexService` (e.g. with `ContextBuilder` and `AppContext`) actually correct?**
  _`IndexService` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `MatterService` (e.g. with `AppContext` and `AnnotationService`) actually correct?**
  _`MatterService` has 11 INFERRED edges - model-reasoned connections that need verification._