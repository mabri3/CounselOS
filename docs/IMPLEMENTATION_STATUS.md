# Implementation status

## Implemented in this scaffold

- Six-stage legal-workflow command center.
- Drag-and-drop matter stage movement.
- Fast intake and standard matter-folder creation.
- Three-pane matter workspace.
- Matter orientation and next-action synthesis.
- Markdown-backed WYSIWYG editing with a raw Markdown toggle and immutable formatted views.
- PDF and DOCX preservation plus extracted Markdown companions.
- Markdown source of truth and rebuildable SQLite read model.
- Hot-loaded `Soul.md`, `Agents.md`, user, company, memory, workflows, agents, tools, and schedules.
- Bounded agent/tool loop with visible operational trace.
- Mock provider that performs representative tool actions without an API key.
- OpenAI-compatible Chat Completions provider adapter.
- Internal lexical search and optional Tavily external search.
- First-pass research packet generation and workflow progression.
- Decision register and deterministic staleness audit.
- In-process scheduler, inbox watcher, manual run, and chat-created schedules/agents.
- Sample vault with six matters covering every stage.

## Deliberately lightweight

- The Markdown editor supports focused formatted drafting, not full word-processing features such as comments or tracked changes.
- PDF and DOCX files are read-only; extracted text is editable.
- Chat returns a complete response rather than streaming tokens.
- Search is lexical unless a provider is added.
- The scheduler is in-process and single-instance.
- Decision staleness uses deterministic internal signals, not a production legal-update feed.
- Mock research is an honest scaffold; configure a real provider for substantive model output.

## Not implemented

- Authentication, authorization, multi-tenancy, or collaboration.
- Cloud object storage or Postgres.
- Durable background queue.
- Native Word tracked changes or round-trip export.
- Native PDF editing.
- Citation validation, citator integration, or mandatory legal-review gates.
- Multi-agent consensus or reviewer-veto workflows.
- Tauri packaging or local shell execution.
- External email/calendar connectors.

## Verification completed in the build environment

- Thirteen backend tests passed on Python 3.12.
- FastAPI smoke checks passed for health, configuration, matters, decisions, and automations.
- Repository contract audit passed for 12 tools, 4 agents, and 6 sample matters.
- Frontend TypeScript typecheck passed.
- The Next.js production build passed and generated all five application routes.
- Browser Acceptance Scenarios A through G passed in mock mode.
- Research started from the command center opens the new packet in the matter editor.
- PDF and DOCX uploads always create an editable extraction companion, including when no text can be extracted.
- New schedules wait for their first interval, and a scheduled task cannot recreate its own schedule in mock mode.
- The third pane round-trips headings, bold, italic, links, quotes, and lists between formatted and raw Markdown modes; save persists after reload.
- Immutable Markdown renders as formatted read-only content with no edit or save controls.

NeuralWatt was configured through the OpenAI-compatible adapter with `deepseek-v4-flash`. A live request returned a valid function tool call through the Counsel OS provider interface. Mock mode remains the verified no-key baseline.
