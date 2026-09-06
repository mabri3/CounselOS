# Architecture

## 1. Chosen shape

Themis.ai is a two-process local web application:

```text
Browser / Next.js :3000
        |
        | JSON over HTTP
        v
FastAPI :8000
        |
        +--> Markdown vault (authoritative)
        +--> SQLite index (rebuildable)
        +--> .counsel-os/active-vault.json (active-vault pointer only)
        +--> LLM provider
        +--> Optional search provider
        +--> In-process scheduler
```

This is the fastest path to a working demo while preserving a future path to Tauri or a cloud deployment.

## 2. Why this is not a single Next.js application

The Python backend is retained because document extraction, local file work, agent orchestration, scheduling, and future research integrations are natural Python workloads. The UI remains a standard web application and does not depend on desktop APIs.

## 3. Why Markdown plus SQLite

Markdown is the authoritative, inspectable record. SQLite solves cross-matter queries without forcing the initial product into a database-first design. The index is rebuilt at startup and after mutations. This intentionally trades scalability for clarity and low implementation risk.

All legal and product content stays inside the selected vault. The one
administrative exception is `.counsel-os/active-vault.json` at the project
root. It stores only `schema_version` and the canonical `vault_path`. It does
not store matter, company, chat, decision, briefing, or agent content.

## 4. Main backend components

- `VaultService`: safe file reads/writes, frontmatter, tree construction, and search corpus.
- `IndexService`: rebuilds and queries matters, work items, decisions, schedules, and document metadata.
- `MatterStateService`: derives one current work-state projection from saved matter, work-item, and research-run facts.
- `MatterService`: creates matters, moves stages, and owns matter mutations and events.
- `RecommendationService`: stores one current recommendation, immutable version metadata, one pending agent proposal, and explicit lawyer acceptance.
- `IngestionService`: stores uploads and extracts PDF/DOCX text.
- `DocumentReviewService`: stores a review baseline and comments in Markdown frontmatter and applies accept/reject actions.
- `DocumentExportService`: regenerates DOCX files with native Word review objects and PDFs with standard review annotations.
- `ResearchService`: creates first-pass research packets.
- `ResearchRunService`: stores one Markdown queue record per research question and runs each matter queue serially with stable batch and item keys.
- `DecisionMonitor`: deterministic staleness checks.
- `AgentRegistry`: hot-loads agent Markdown.
- `SkillRegistry`: hot-loads enabled declarative skill Markdown and validates one slash invocation.
- `SkillBuilderService`: returns the fixed interview, safe unsaved drafts, and user-started evidence-backed suggestions.
- `ToolRegistry`: hot-loads tool Markdown and maps descriptions to approved handlers.
- `AgentRunner`: bounded provider/tool loop.
- `SchedulerService`: local schedule polling and execution.
- `ActiveContextManager`: leases one runtime context to each request and
  serializes safe active-vault changes.
- `VaultManager`: validates existing vaults and creates new blank vaults by
  staging and renaming a complete candidate directory.

### 4.1 Derived matter work state

Matter work state follows one direction:

```text
Markdown facts
  -> MatterStateService projection
  -> matter list and detail API responses
  -> frontend and agent context
```

Markdown remains the source of truth. `MatterStateService` reads the matter,
required work items, and saved research-run records. It calculates `work_state`
when the matter is read. The service does not save a second copy in Markdown or
SQLite.

The frontend can map a signal to presentation, but it does not infer execution
from a matter stage or select another next work item. The agent receives the
same projection in its context. `MatterService` still owns all mutations,
including stage changes, approval, delivery, closure, and event writes.

Approval, manual delivery, durable decision recording, and closure use typed
confirmation results. Chat can prepare these actions, but the mutation occurs
only after the lawyer uses the direct UI control. Manual delivery records an
action that happened outside Themis.ai. The app does not send the response.

Matter creation writes the request, target date, and first records before it
returns. Intake startup is a retained application task. This lets the matter
page open while intake is visibly running without losing shutdown tracking.

### Matter record authority and reconciliation

Each matter concept has one durable Markdown authority. `matter.md` owns
lifecycle fields and artifact pointers. `facts.md` owns facts, assumptions,
and their source history. `issues.md` owns the issue list. `participants.md`
owns people and roles. Conversation records own the exact intake transcript
and the answered state of question cards. `MatterStateService` owns the
resolved next action. SQLite is only a rebuildable index.

`MatterService.get()` is the resolved read boundary for the UI and agents. It
combines the complete `matter.md` frontmatter with structured records and
derived work state. A lawyer edit to a structured record is reconciled at the
file-write boundary: defined list items update the matching typed frontmatter
while source history and inactive records remain durable. The system does not
infer typed facts from arbitrary prose and does not run bidirectional semantic
synchronization.

An answered intake card is durable progress before the model runs. The exact
question, selected label or write-in answer, source message, answer status, and
optional `record_target` are stored in `facts.md`. An answered question is
removed from the open-question set. The answer also creates a source-linked
reported fact. A declared `record_target` projects the same explicit answer to
its named authority, such as `jurisdiction_scope` in `matter.md`; the system
does not infer targets from ordinary chat prose.

Model analysis may add issues, assumptions, and the next question. It is not
the only write path for the user's answer. Intake updates filter out questions
that the durable answer record already resolved. Deterministic recovery reads
the same record before it asks a fallback question. UI success cards come only
from successful typed mutations. Internal failed tool attempts remain in the
trace and do not appear as primary workspace-action cards.

## 5. Provider boundary

`LLMProvider.complete()` accepts messages and tool schemas and returns text and/or tool calls. The scaffold includes mock and OpenAI-compatible implementations.

Provider-specific details must not leak into routers, services, or frontend code.

## 6. Markdown tool boundary

Tool Markdown defines:

- Name
- Description
- Handler key
- Parameter schema

Python defines the executable handler. The registry refuses unknown handler keys. This is the MVP compromise between hot-editable tools and safe/reliable execution.

### Built-in agent runtime contract

The selected vault stores workspace guidance, provider choices, and custom
agents. The running application owns the current contract for built-in agents:
required tool workflow, tool permissions, schemas, and step limits. Each
built-in turn receives both the vault guidance and the bundled current
contract. The current contract wins if an old vault conflicts with it.

The Agents page marks built-in tool permissions as app-managed and shows the
effective permissions. Custom-agent permissions remain vault-managed and
editable. Loading an old vault does not rewrite its agent files and does not
require a vault migration.

## 7. Request flow: chat

```text
POST /api/chat
  -> load selected agent
  -> add the current built-in runtime contract
  -> resolve and validate any saved question-card action
  -> persist an intake answer before model analysis
  -> validate and remove one optional leading skill command
  -> build system + matter + active file context
  -> insert the skill after active-agent instructions for this turn only
  -> call provider with allowed tools
  -> execute tool calls
  -> append observations
  -> repeat up to max steps
  -> return direct answer + operational trace
```

The trace records actions and results, not hidden reasoning.

Skill Markdown never changes the selected agent or its tool allow-list. The original slash command and the assistant's small applied-skill summary are saved in the conversation record.

## 8.1 Request flow: guided skills

```text
fixed local questions
  -> unsaved provider draft or deterministic fallback
  -> editable review
  -> explicit Create skill
  -> 00_System/skills/<skill-id>.md
```

Repeated-work review runs only after the user selects **Find repeated work**. It reads at most 100 user-authored messages. Accepted suggestions show evidence loaded from those stored messages and do not write a skill.

## 8. Request flow: mutation

```text
UI or tool mutation
  -> write Markdown atomically
  -> create event when applicable
  -> rebuild SQLite index
  -> return updated record
```

## 9. Request flow: research

```text
matter context
  + playbooks
  + company knowledge
  + internal search
  + optional external search
  -> model or mock research packet
  -> write research Markdown
  -> complete work item
  -> move to Explore
  -> rebuild index
```

## 10. Decision staleness

The MVP is deterministic:

- Past `next_review_at` => stale.
- Linked source modified after decision/last review => review recommended.
- Too old without review => review recommended.

Continuous Legal Awareness adds external collection to this deterministic
audit. It does not replace the audit or rewrite an existing decision.

## 10.1 Continuous Legal Awareness

```text
editable Watch
  -> OutboundQueryPolicy (local private-data check)
  -> native and/or Polaris public collection
  -> durable developments and provider observations
  -> local match against current private knowledge
  -> Briefing item and optional review packet
  -> explicit lawyer outcome
```

`IntelligenceProvider.scan()` accepts only an immutable
`OutboundWatchQuery`. The allow-list contains the standing question, public
keywords, topics, jurisdictions, regulators, courts, industries, date window,
public source URLs, and explicitly public entities. Before any network call,
`OutboundQueryPolicy` rejects company aliases, internal products, matter IDs,
paths, email addresses, and distinctive private excerpts. Company-specific
matching happens later, inside Themis.ai.

Native collection uses `SafeHttpFetcher`, which checks DNS answers, the
connected address, redirects, sizes, timeouts, and retry limits. Polaris uses
the fixed Polaris service and `polaris-advisor`. It is advisor-read-only and
does not support model discovery, tools, function calls, embeddings, arbitrary
JSON schemas, endpoint changes, or redirects. The fixed `*.ts.net` origin is a
pinned exception for that one adapter. Polaris citations start as supplied
support, not verified support.

`WatchScanService` alone coordinates `both` mode. It keeps a checkpoint for
each provider and advances only a successful provider. If one provider fails,
it saves the other provider's useful result and marks the scan partial.
`DevelopmentService` owns stable identity, exact URL or official-ID merging,
content versions, and provider provenance. Every scan snapshots the Watch
collection settings, then reloads current private knowledge before local
matching.

Awareness records remain Markdown-first under
`00_System/legal-awareness/`, `05_Briefing/`, and matter `mitigations/`.
SQLite indexes list and query fields. Detail reads return to Markdown.

## 11. Scheduler

The scheduler is an asyncio task in the FastAPI process. It reads Markdown schedules, runs due jobs, and updates schedule metadata. This is intentionally not durable across process crashes and is suitable only for a local single-process MVP.

The scheduler also dispatches `watch_scan` and `briefing_digest` jobs through
bound services. It never calls an intelligence provider directly. **Scan now**
does not enable or change a schedule. A paused Watch creates a visible skipped
run when its schedule is invoked.

### 11.1 Active vault changes

Normal requests lease the active `AppContext`. A vault change blocks new
leases, waits for current leases, and stops the scheduler loop. It returns
**Busy** without cancelling work when a scheduled task or research run is
active.

The candidate context is built and checked before the pointer changes.
Candidate construction can rebuild only that vault's disposable SQLite index;
it does not run interruption recovery or change authoritative Markdown. A
successful change atomically saves the pointer, swaps the context, runs
best-effort interruption recovery, and starts the new scheduler. Recovery is
post-activation work; its failure does not roll the selection back after
candidate Markdown might have changed. A failure before activation restores
the old pointer and context and restarts the old scheduler.

A valid saved pointer wins at startup. `VAULT_PATH` selects the first vault
only when no valid saved pointer exists. The application does not rewrite
`.env`.

## 12. Frontend boundaries

- `AppShell`: navigation and global framing.
- `KanbanBoard`: configured stages and card movement.
- `MatterWorkspace`: pane coordination.
- `MatterTree`: navigation and uploads.
- `ChatPanel`: messages, presets, and action trace.
- `SkillBuilder`: fixed guided interview, editable draft, saved-skill editing, and repeated-work suggestions.
- `DocumentPanel`: Markdown editing, native-file companions, review controls, and DOCX/PDF export.
- `DecisionTable`: global register.
- `AutomationPanel`: schedules, manual execution, and simple schedule creation.
- `WatchBuilder`: one editable draft flow for provider, query, sources, roles,
  and cadence.
- `BriefingWorkspace`: URL-backed reading, filters, saved views, and digests.
- `ReviewPacketPanel`: evidence, company links, and explicit lawyer outcomes.
- Settings `Vaults`: shows the exact active path and provides confirmed,
  non-destructive create and load actions.

The frontend performs no direct file or model access.

## 13. Future replacement points

| Current | Future possibility |
|---|---|
| Local vault | Object storage or synced workspace storage |
| SQLite | Postgres |
| In-process scheduler | Durable job queue |
| Single user | Workspace/user/role model |
| OpenAI-compatible adapter | Native Anthropic, Gemini, or enterprise model gateways |
| Lexical/FTS search | Hybrid retrieval or embeddings |
| Local web app | Tauri wrapper or cloud deployment |

These are seams, not current requirements.
