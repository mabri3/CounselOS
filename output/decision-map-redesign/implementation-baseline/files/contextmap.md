# Context Map

Last verified: 2026-09-05

## Selective Reading Guide

Start with `AGENTS.md` and `current.md`. Read only the paths mapped to the active task. Consult `decisions.md` before changing the storage model, provider boundary, tool safety boundary, or scheduler design.

## Repository Map

| Area | Authoritative paths | Purpose | Read when |
|---|---|---|---|
| Lawyer continuity | `docs/lawyer-workflow-expansion.contract.md`, `docs/lawyer-workflow-expansion.verification.md`, `docs/lawyer-workflow-expansion.usability.md`, `backend/app/services/workspace_orientation.py`, `fact_requests.py`, `workspace_team.py`, `change_impact.py`, `backend/app/models/continuity.py`, `frontend/lib/continuityTypes.ts` | Shared orientation, exact business replies, optional local lawyer identities, scoped ownership and frozen supplied-version comparison | Continuing or checking the four-area lawyer workflow |
| Continuity controls and integration | `frontend/components/workspace/OrientationSummary.tsx`, `FactRequestPanel.tsx`, `HandoffPanel.tsx`, `ChangeImpactPanel.tsx`, `DemoLawyerSwitcher.tsx`, `TeamWorkList.tsx`, `frontend/components/MatterWorkspace.tsx`, `backend/app/routers/workspace.py`, `chat.py`, `files.py`, `matters.py` | Contextual catalog loading, one matter conversation, trusted lifecycle/actor transport, repeat-safe commands and canonical target routing | Changing a continuity action or person-scoped input |
| Continuity proof | `backend/tests/test_workspace_orientation.py`, `test_fact_requests.py`, `test_workspace_team.py`, `test_change_impact.py`, `test_continuity_identity.py`, `test_continuity_integration.py`, `test_continuity_recovery.py`, `frontend/scripts/check-continuity-integrity.ts`, `check-transport-preservation.ts` | Runtime callbacks, real HTTP boundaries, delayed/partial writes, stale editor saves and preserved local input | Verifying continuity or document recovery changes |
| Entry points | `backend/app/main.py`, `frontend/app/page.tsx`, `scripts/dev.sh` | FastAPI app, Next.js command center, local startup | Starting services or tracing app boot |
| Core domain | `backend/app/services/`, `backend/app/agents/`, `backend/app/tools/` | Matters, vault/index behavior, research, decisions, agents, tools, scheduling | Changing backend behavior |
| Interfaces/API | `backend/app/routers/`, `backend/app/models/api.py`, `docs/API.md`, `frontend/lib/api.ts`, `frontend/lib/types.ts` | HTTP routes, request/response models, frontend client contracts | Changing or debugging API behavior |
| Document editor | `frontend/components/DocumentPanel.tsx`, `frontend/components/MarkdownRichEditor.tsx`, `frontend/app/globals.css`, `backend/app/services/vault.py` | Third-pane mode selection, Markdown-rich-text conversion, editor presentation, editability contract | Changing formatted drafting or read-only document behavior |
| Design language | `docs/DESIGN_LANGUAGE.md`, `frontend/lib/design.ts`, `frontend/app/globals.css` | Canonical semantic colors, light washes, shared state labels, typography, and interaction rules | Changing any screen, state color, badge, table, card, or control |
| Latest workflow reconciliation build | `docs/themis-ai-workflow-reconciliation-build.handoff-plan.md`, `docs/themis-ai-workflow-reconciliation-build.handoff-progress.md`, `docs/themis-ai-workflow-reconciliation-build.handoff-prompt.md` | Typed result lifecycle, research queue, provider fallback, recommendation integrity, target dates, board consistency, review findings, and final proof | Reviewing the completed checkpoint or tracing a workflow decision |
| Intake and dossier checkpoint | `docs/BUILD_PLAN.md`, `vault/00_System/agents/intake-agent.md`, `frontend/components/NewMatterForm.tsx`, `frontend/components/ChatPanel.tsx`, `frontend/components/MatterWorkspace.tsx`, `backend/app/services/chat_history.py`, `backend/app/services/chat_runs.py`, `backend/app/services/matter_records.py`, `backend/app/services/dossier.py`, `backend/app/services/matters.py`, `backend/app/services/research.py` | Preserved intake transcript, adaptive questions, traceable fact corrections, background runs, dossier generation, and matter-page summary | Implementing or verifying adaptive intake and dossier behavior |
| Matter truth and lifecycle | `backend/app/services/matter_state.py`, `backend/app/services/work_product.py`, `backend/app/services/recommendations.py`, `backend/app/services/matters.py`, `frontend/lib/matterBrief.ts`, `frontend/lib/recommendations.ts`, `frontend/components/MatterWorkspace.tsx` | Required work, recommendation versions, canonical draft/final identity, risk, artifact navigation, typed confirmations, approval, manual delivery, consistency repair, and closure | Changing matter state, recommendation integrity, work-product identity, or guided actions |
| Research queue and fallback | `backend/app/services/research_runs.py`, `backend/app/services/research.py`, `backend/app/services/search.py`, `backend/app/intelligence/polaris.py`, `frontend/app/matters/[matterId]/research/page.tsx`, `frontend/lib/researchQueue.ts` | Durable per-question queue records, serial execution, reorder/retry/resume, Polaris/Tavily/model-only fallback, and support labels | Changing on-demand matter research or provider failure behavior |
| Per-agent model routing | `backend/app/providers/`, `backend/app/agents/registry.py`, `backend/app/agents/runner.py`, `backend/app/runtime.py`, `backend/app/models/api.py`, `backend/app/routers/settings.py`, `frontend/app/agents/`, `frontend/app/settings/`, `frontend/lib/api.ts`, `frontend/lib/types.ts` | Provider adapters and catalogs, persisted agent overrides, immutable run selection, and user controls | Implementing provider/model selection or tracing a model call |
| Polaris matter research | `backend/app/intelligence/polaris.py`, `backend/app/intelligence/outbound_policy.py`, `backend/app/services/research.py`, `backend/app/services/watch_scans.py`, `backend/tests/test_intelligence_security.py` | Existing public-intelligence adapter and privacy boundary to reuse for ordinary matter research | Connecting or verifying external matter research |
| Agent answer standards | `AGENTS.md`, `vault/00_System/Agents.md`, `vault/00_System/Soul.md`, `backend/app/agents/runner.py` | Best-effort answer delivery, graceful degradation, source honesty, and question gating | Changing agent behavior or failure handling |
| Company context | `vault/00_System/company.md`, `frontend/app/settings/page.tsx`, `frontend/components/CompanyInterview.tsx`, `backend/app/services/company.py`, `backend/app/services/company_interview.py` | Saved profile, interview draft, replacement confirmation, versioning, and human/generated attribution | Changing company setup or agent grounding |
| Persistence/schema | `backend/app/services/vault.py`, `backend/app/services/index.py`, `backend/app/utils/paths.py`, `vault/` | Markdown source of truth, safe paths, rebuildable SQLite read model, sample records | Changing storage, file safety, or indexing |
| Tests/fixtures | `backend/tests/`, `vault/03_Matters/` | Backend behavior coverage and sample matter fixtures | Fixing regressions or walking acceptance tests |
| Build/configuration | `frontend/package.json`, `backend/requirements.txt`, `.env.example`, `scripts/setup.sh`, `scripts/verify.sh` | Dependencies, runtime settings, setup, and validation | Installing or verifying the app |
| Documentation/assets | `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/BUILD_PLAN.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/IMPLEMENTATION_STATUS.md`, `CODEX_HANDOFF.md` | Product boundary, architecture, wave order, acceptance, status, handoff | Planning or checking scope |

## Key Schemas and Contracts

| Contract | Defined at | Consumed by | Notes |
|---|---|---|---|
| API contract | `docs/API.md`, `backend/app/routers/`, `backend/app/models/api.py` | `frontend/lib/api.ts`, frontend pages/components | Base URL is `http://localhost:8000/api` in local configuration. |
| Markdown record format | `vault/` frontmatter and record files; `backend/frontmatter.py` | Vault, index, services, UI | Human-readable Markdown is authoritative. |
| Tool safety boundary | `backend/app/tools/registry.py`, `backend/app/tools/handlers.py`, `vault/00_System/tools/` | Agent runner and chat tools | Markdown declares tools; Python maps only approved handler keys. |
| Provider boundary | `backend/app/providers/base.py`, `backend/app/providers/factory.py`, `backend/app/runtime.py` | Agent runner, chat, intake, research, schedules, and model-backed services | Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI share one catalog and completion contract. Agent overrides are resolved and copied into each run snapshot. |
| Workflow stages | `vault/00_System/workflows/product-counsel.md`, `backend/app/services/workflow.py` | Matter service, Kanban UI, research flow | Product Counsel is the only MVP workflow. |

## Generated, Vendored, or Heavy Paths

- `backend/.venv/` — installed Python environment; recreate with `scripts/setup.sh`.
- `frontend/node_modules/` — installed Node dependencies; recreate with `scripts/setup.sh`.
- SQLite index files under the configured vault — rebuildable and not the source of truth.
- `frontend/tsconfig.tsbuildinfo` — compiler cache; do not treat as source.

## External Systems

| System | Local integration point | Source of truth | Safety note |
|---|---|---|---|
| OpenAI-compatible model endpoint | `backend/app/providers/openai_compatible.py`, `.env.example` | Runtime `.env` configuration | Optional; do not place keys in state files. |
| Tavily search | `backend/app/services/search.py`, `.env.example` | Runtime `.env` configuration | Optional; research remains available in disabled mode. |
| Polaris | `backend/app/intelligence/polaris.py`, `backend/app/intelligence/outbound_policy.py` | Existing Themis Lime session and fixed `polaris-advisor` contract | Public intelligence only. Private matter and company context must stay local. |
| Local provider references | `/Users/bharris/Programs/PlayMaker`, `/Users/bharris/Documents/ChatGPT/AltBench`, `/Users/bharris/Programs/DeepBench` | Reference implementations only | Inspect behavior and tests. Do not import these repositories at runtime or read their secrets. |

## Known Navigation Gaps

- Live readiness for OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI depends on local credentials or signed-in CLI sessions. Missing sessions must remain visible as environment limits, not be reported as passing.
