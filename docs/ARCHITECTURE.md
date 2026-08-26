# Architecture

## 1. Chosen shape

Counsel OS is a two-process local web application:

```text
Browser / Next.js :3000
        |
        | JSON over HTTP
        v
FastAPI :8000
        |
        +--> Markdown vault (authoritative)
        +--> SQLite index (rebuildable)
        +--> LLM provider
        +--> Optional search provider
        +--> In-process scheduler
```

This is the fastest path to a working demo while preserving a future path to Tauri or a cloud deployment.

## 2. Why this is not a single Next.js application

The Python backend is retained because document extraction, local file work, agent orchestration, scheduling, and future research integrations are natural Python workloads. The UI remains a standard web application and does not depend on desktop APIs.

## 3. Why Markdown plus SQLite

Markdown is the authoritative, inspectable record. SQLite solves cross-matter queries without forcing the initial product into a database-first design. The index is rebuilt at startup and after mutations. This intentionally trades scalability for clarity and low implementation risk.

## 4. Main backend components

- `VaultService`: safe file reads/writes, frontmatter, tree construction, and search corpus.
- `IndexService`: rebuilds and queries matters, work items, decisions, schedules, and document metadata.
- `MatterService`: creates matters, derives next actions, moves stages, and writes events.
- `IngestionService`: stores uploads and extracts PDF/DOCX text.
- `ResearchService`: creates first-pass research packets.
- `DecisionMonitor`: deterministic staleness checks.
- `AgentRegistry`: hot-loads agent Markdown.
- `ToolRegistry`: hot-loads tool Markdown and maps descriptions to approved handlers.
- `AgentRunner`: bounded provider/tool loop.
- `SchedulerService`: local schedule polling and execution.

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

## 7. Request flow: chat

```text
POST /api/chat
  -> load selected agent
  -> build system + matter + active file context
  -> call provider with allowed tools
  -> execute tool calls
  -> append observations
  -> repeat up to max steps
  -> return direct answer + operational trace
```

The trace records actions and results, not hidden reasoning.

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

An external legal-change agent is a future extension, not a claim made by this scaffold.

## 11. Scheduler

The scheduler is an asyncio task in the FastAPI process. It reads Markdown schedules, runs due jobs, and updates schedule metadata. This is intentionally not durable across process crashes and is suitable only for a local single-process MVP.

## 12. Frontend boundaries

- `AppShell`: navigation and global framing.
- `KanbanBoard`: configured stages and card movement.
- `MatterWorkspace`: pane coordination.
- `MatterTree`: navigation and uploads.
- `ChatPanel`: messages, presets, and action trace.
- `DocumentPanel`: Markdown editing and native-file links.
- `DecisionTable`: global register.
- `AutomationPanel`: schedules, manual execution, and simple schedule creation.

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
