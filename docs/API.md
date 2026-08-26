# API summary

Base URL: `http://localhost:8000/api`

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health, provider mode, and vault path |
| GET | `/config` | Workflow and runtime configuration |
| GET | `/matters` | List Kanban matter cards and stages |
| POST | `/matters` | Create a structured matter |
| GET | `/matters/{matter_id}` | Matter orientation, tree, work, decisions, and events |
| PATCH | `/matters/{matter_id}/stage` | Move the matter stage |
| POST | `/matters/{matter_id}/research?question=` | Run first-pass research |
| POST | `/matters/{matter_id}/upload` | Upload and extract a supported document |
| GET | `/files/tree?path=` | List a vault subtree |
| GET | `/files?path=` | Read file metadata/content |
| PUT | `/files?path=` | Update an editable Markdown or text file |
| GET | `/files/raw?path=` | Serve a native file |
| POST | `/chat` | Run bounded agentic chat and tools |
| GET | `/decisions` | Global decision register |
| POST | `/decisions` | Record an explicit decision |
| POST | `/decisions/audit` | Run deterministic staleness checks |
| GET | `/automations` | List Markdown schedules and agents |
| POST | `/automations/schedules` | Create a schedule |
| POST | `/automations/schedules/{schedule_id}/run` | Run a schedule now |
| POST | `/automations/agents` | Create a Markdown agent definition |

FastAPI also exposes interactive API documentation at `http://localhost:8000/docs` while the backend is running.
