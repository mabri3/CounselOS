# Themis.ai MVP

Themis.ai is a web-first, Markdown-backed product-counsel workspace. It is designed to reduce a lawyer's cognitive load by turning ambiguous intake into organized matters, research, work product, decisions, and follow-up.

This repository is a runnable first-pass scaffold, not a production legal system.

## Product stance

- The assistant should be useful, direct, and willing to produce first-pass work.
- Legal perfection is not assumed or required.
- Uncertainty should be stated briefly, not used to block an answer.
- The product organizes the forest and gets the lawyer close to the last mile.
- Recommendations are useful work product; a formal decision is recorded only when the user explicitly chooses to record one.

A coding agent should read [`AGENTS.md`](AGENTS.md), [`docs/PRD.md`](docs/PRD.md), [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md), and [`CODEX_HANDOFF.md`](CODEX_HANDOFF.md) first.

## Included

- Next.js command center with legal-workflow Kanban
- Three-pane matter workspace
- Markdown editing and file tree
- PDF/DOCX ingestion with editable Markdown extraction
- Markdown comments and tracked changes with native Word/PDF review export
- FastAPI backend
- Markdown source of truth plus rebuildable SQLite index
- Markdown-loaded agents, tools, workflows, schedules, company context, user context, and memory
- Mock LLM mode that runs without an API key
- OpenAI-compatible tool-calling provider adapter
- Research packets
- Decision register and staleness checks
- Scheduler and inbox watcher
- Continuous Legal Awareness with editable Watches and scheduled scans
- Native public collection and optional Polaris public intelligence
- Briefing reading, saved views, immutable digests, and review packets
- Local matching to company matters, decisions, and mitigations

## Quick start

Themis.ai requires Python 3.11 or newer and a current Node.js release.

For the standard setup, run:

```bash
./scripts/setup.sh
```

The setup script selects an installed compatible Python version. Set
`COUNSEL_OS_PYTHON` when you need to use a specific Python executable.

### 1. Configure

```bash
cp .env.example .env
```

The default `LLM_PROVIDER=mock` requires no API key.

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### One-command development

After dependencies are installed:

```bash
./scripts/dev.sh
```

The launcher checks the local commands, installed backend and frontend
dependencies, and ports before it starts. It writes backend and frontend output
to separate files, waits up to 60 seconds for health and readiness checks, and
then prints the application URLs and log paths. Press `Ctrl-C` once to stop both
services and their development child processes.

The default ports are `8000` for the backend and `3000` for the frontend. You
can change the ports, startup time limit, or log directory for one run:

```bash
BACKEND_PORT=8100 FRONTEND_PORT=3100 DEV_START_TIMEOUT_SECONDS=90 \
  DEV_LOG_DIR=/tmp/themis-ai-logs ./scripts/dev.sh
```

## Configure a real model

Set values in `.env`:

```dotenv
LLM_PROVIDER=openai_compatible
LLM_PROVIDER_LABEL=OpenAI
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your-key
LLM_MODEL=your-model-name
```

The adapter uses an OpenAI-compatible Chat Completions tool-calling payload. Other provider-native adapters can be added under `backend/app/providers/`.

After the endpoint and API key are configured, use **Settings → Agents & model**
to select the active provider, a model advertised by that provider, and the
reasoning effort. The saved choice applies to new model requests without an app
restart.

## Optional external search

The research service supports an optional Tavily adapter:

```dotenv
SEARCH_PROVIDER=tavily
TAVILY_API_KEY=your-key
```

Without it, research still runs against the matter, company context, playbooks, and prior vault records.

## Optional Polaris intelligence

Polaris is an optional public-intelligence source for Watches. It is separate
from the main model provider.

```dotenv
POLARIS_API_KEY=your-key
```

Choose **Native**, **Polaris**, or **Both** in Watch Builder. Polaris uses the
fixed Polaris service and cannot receive company, matter, decision, document,
or other private context. Themis.ai checks the editable public query before a
network call. Company-specific matching stays local. If one provider in Both
mode fails, the scan keeps the other provider's useful output and shows a
**Partial** state.

Open **Briefing** to read monitored developments. Open **Watches** from the
Briefing area to create or edit collection rules. **Scan now** runs once and
does not start a schedule. **Start Watch** creates or enables the schedule.

## Important development warning

This scaffold has no authentication, tenant isolation, enterprise authorization, or production secret management. Do not expose it directly to the public internet or load real privileged material into an untrusted environment.

## Repository map

```text
frontend/              Next.js UI
backend/               FastAPI API, agents, tools, scheduler, and index
vault/                 Markdown source of truth and sample matters
docs/                  PRD, architecture, build plan, and acceptance tests
CODEX_HANDOFF.md       Coding-agent instructions
```

## Tests

```bash
cd backend
pytest
```

Frontend validation:

```bash
cd frontend
npm run typecheck
npm run build
```

## First build priorities

1. Run the app in mock mode.
2. Confirm the sample matters and decisions load.
3. Run backend tests.
4. Fix any environment-specific build issues.
5. Configure a real model.
6. Walk the acceptance scenarios in `docs/ACCEPTANCE_TESTS.md`.
7. Improve only the workflow that fails or feels cognitively heavy.

Do not begin with cloud tenancy, source-layout-preserving document round trips, embeddings, multi-agent voting, or a general plugin framework.
