# Context Map

Last verified: 2026-08-29

## Selective Reading Guide

Start with `AGENTS.md` and `current.md`. Read only the paths mapped to the active task. Consult `decisions.md` before changing the storage model, provider boundary, tool safety boundary, or scheduler design.

## Repository Map

| Area | Authoritative paths | Purpose | Read when |
|---|---|---|---|
| Entry points | `backend/app/main.py`, `frontend/app/page.tsx`, `scripts/dev.sh` | FastAPI app, Next.js command center, local startup | Starting services or tracing app boot |
| Core domain | `backend/app/services/`, `backend/app/agents/`, `backend/app/tools/` | Matters, vault/index behavior, research, decisions, agents, tools, scheduling | Changing backend behavior |
| Interfaces/API | `backend/app/routers/`, `backend/app/models/api.py`, `docs/API.md`, `frontend/lib/api.ts`, `frontend/lib/types.ts` | HTTP routes, request/response models, frontend client contracts | Changing or debugging API behavior |
| Document editor | `frontend/components/DocumentPanel.tsx`, `frontend/components/MarkdownRichEditor.tsx`, `frontend/app/globals.css`, `backend/app/services/vault.py` | Third-pane mode selection, Markdown-rich-text conversion, editor presentation, editability contract | Changing formatted drafting or read-only document behavior |
| Design language | `docs/DESIGN_LANGUAGE.md`, `frontend/lib/design.ts`, `frontend/app/globals.css` | Canonical semantic colors, light washes, shared state labels, typography, and interaction rules | Changing any screen, state color, badge, table, card, or control |
| Intake and dossier checkpoint | `docs/BUILD_PLAN.md`, `vault/00_System/agents/intake-agent.md`, `frontend/components/NewMatterForm.tsx`, `frontend/components/ChatPanel.tsx`, `frontend/components/MatterWorkspace.tsx`, `backend/app/services/chat_history.py`, `backend/app/services/matters.py`, `backend/app/services/research.py` | Preserved intake transcript, traceable fact corrections, issue spotting, focused clarification, dossier generation, and matter-page summary | Planning or implementing the active checkpoint |
| Agent answer standards | `AGENTS.md`, `vault/00_System/Agents.md`, `vault/00_System/Soul.md`, `backend/app/agents/runner.py` | Best-effort answer delivery, graceful degradation, source honesty, and question gating | Changing agent behavior or failure handling |
| Company context | `vault/00_System/company.md`, `frontend/app/settings/page.tsx`, `backend/app/routers/settings.py`, `backend/app/services/settings.py` | Current company source and planned Settings editing surface | Changing company setup or agent grounding |
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
| Provider boundary | `backend/app/providers/base.py`, `backend/app/providers/factory.py` | Agent runner and chat router | Mock and OpenAI-compatible providers are available. |
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

## Known Navigation Gaps

- No CI configuration or Git metadata is present at the current repository path.
- Real-provider behavior is not verified because `.env` has no API key or model name.
