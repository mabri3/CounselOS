# Implementation status

## Status correction — 2026-08-30

This file is a historical scaffold report. Its test counts and “implemented”
statements are not current completion proof. The authoritative active state is
`current.md`, and the exhaustive closure evidence must be recorded in
`docs/MVP_CLOSURE_AUDIT.md`. Any unfinished item below that is not explicitly
in the canonical Later list must be implemented and verified by
`docs/core-intake-provider-completion.handoff-prompt.md`.

## Current correction — 2026-08-30

The core closure implementation now includes adaptive background intake,
source-linked matter updates, guarded dossier revision, privacy-safe Polaris
matter research, per-agent provider/model/reasoning selection, and the Mock,
OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI catalogs.
`./scripts/verify.sh` passes 482 backend tests, frontend typecheck, and the
production build. The scaffold inventory below remains historical.

## Implemented in this scaffold

- Six-stage legal-workflow command center.
- Drag-and-drop matter stage movement.
- Fast intake and standard matter-folder creation.
- Three-pane matter workspace.
- Matter orientation and next-action synthesis.
- Markdown-backed WYSIWYG editing with a raw Markdown toggle and immutable formatted views.
- PDF and DOCX preservation plus extracted Markdown companions.
- Markdown comments and tracked changes with accept/reject review and native DOCX/PDF review export.
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
- Markdown-backed workspace settings with namespaced keys and provider attestation records.
- Agent editing with real tool choices and agent-level Written-for audiences.
- Persistent research annotations with provider-backed answers.
- Matters stage, table, and twelve-week timeline views with shared filters.
- The Written-for agent default follows `docs/AUDIENCE_SPEC.md`; the per-request override is not implemented.

## UI redesign (Counsel OS design canvas)

The whole interface was rebuilt against the `Counsel OS` design canvas. See
`docs/DESIGN_LANGUAGE.md`. Nine surfaces, all wired to the existing API:

- `/` Today — a ranked briefing derived from matters, decisions and schedules.
- `/workspace` — intake bar, the six-stage board, quarter figures, agent activity.
- `/matters` — counts that are also filters, stage spines, next action in the row.
- `/matters/[id]` — question, agent recommendation, evidence, decision, copilot thread.
- `/matters/[id]/research` — memo reading with citations and a source/notes rail.
- `/decisions` — open recommendations above, the recorded register below.
- `/agents` — the agent builder.
- `/settings` — editable workspace settings and provider policy attestations.
- `/automations` — schedules led by what each one did.

## Deliberately lightweight

- The Markdown editor supports focused formatted drafting and document review, not full source-layout-preserving word processing.
- PDF and DOCX source files remain read-only; extracted Markdown is editable and exports use regenerated layout.
- Chat returns a complete response rather than streaming tokens.
- Search is lexical unless a provider is added.
- The scheduler is in-process and single-instance.
- Decision staleness uses deterministic internal signals, not a production legal-update feed.
- Mock research is an honest scaffold; configure a real provider for substantive model output.

## Not implemented

- Authentication, authorization, multi-tenancy, or collaboration.
- Cloud object storage or Postgres.
- Durable background queue.
- Import or round-trip preservation of existing Word/PDF comments and redlines.
- Source-layout-preserving Word/PDF editing.
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
- DOCX export contains native tracked changes and comments; PDF export contains standard text-markup annotations.

NeuralWatt was configured through the OpenAI-compatible adapter with `deepseek-v4-flash`. A live request returned a valid function tool call through the Counsel OS provider interface. Mock mode remains the verified no-key baseline.

## Attention-audit work in progress

The planned product contract keeps the matter as the full work container and
keeps the dossier as an optional summary. `matter.md` remains the root record
and default agent context. The planned matter tree starts narrow, shows no
visual record selection when no file was requested, and groups structured files
under the exact human-readable Matter Records mapping in
`docs/ACCEPTANCE_TESTS.md`.

The same planned acceptance walk covers visible and editable decision rationale,
an explicit final record action, full **Themis · Not reviewed** styling, readable
tables, **Recorded** and **Needs review** state words, schedule resume, and the
Advanced controls on Settings, Agents, and Skills. It also covers one research
state with no cited sources.

Recommendations remain separate from recorded decisions. Source or action
provenance appears only when stored data supports it. These items are planned
acceptance coverage, not observed pass results. Dated results will be added only
after the coordinator completes the isolated browser walk.
