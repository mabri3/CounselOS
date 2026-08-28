# Counsel OS — connect the four UI stubs

**Role.** You are working in the `counsel-os-mvp` repository as the engineer who
finishes the August 2026 UI redesign.

**Goal.** Four screens render correctly but forget everything: Settings, the
agent builder, research annotations, and the Matters Table/Timeline views. Make
all four persist against the real backend, in the eight ordered steps below.

Step 3 also replaces the agent builder's Voice control with an audience control
specified in `docs/AUDIENCE_SPEC.md`. **Read that file before Step 3.**

**Autonomy.** Read files, edit code, and run tests and the dev servers without
asking. Do not expand scope, install anything, or touch the vault beyond what a
step names.

---

## Resume protocol

Read `connect-stubs.handoff-progress.md` before you start.

- Steps marked `done` are already applied. Do **not** redo them. Begin at the
  first step not marked `done`.
- After each step: run that step's verification, then immediately rewrite that
  step's line as `- [x] Step N: <title> — done`, or
  `- [ ] Step N: <title> — FAILED: <what happened>` and stop.
- Update the file before starting the next step, never in a batch at the end.
- If a line says `done` but its verification now fails, stop and report. Do not
  re-apply the edit.

Every step is idempotent — each says what a file should end up containing, not
what to append. Commit after each verified step with
`git commit -m "handoff step N: <title>"`.

---

## Verified context

Everything below was read from the repo, not remembered. If any of it does not
match what the executor finds, that is a plan defect — stop and report.

### Backend shape

| Fact | Value |
| --- | --- |
| Routers live in | `backend/app/routers/*.py` |
| Registered in | `backend/app/main.py`, one `for router in (...)` loop, prefix `/api` |
| DI | `context: AppContext = Depends(get_context)` from `app.routers.dependencies` |
| Pydantic models | `backend/app/models/api.py` |
| Services container | `backend/app/runtime.py` (`AppContext.__init__`) |
| Tests | `backend/tests/test_*.py`, one `app_context` fixture in `conftest.py` |
| Test command | `cd backend && .venv/bin/pytest -q` |

`AppContext` exposes: `settings vault index workflow matters ingestion decisions
provider search research agents tools agent_context scheduler runner`.

Helpers you will need, with their exact import paths:

```python
from app.utils.ids import new_id, slugify      # new_id("ANN") -> "ANN-20260826-a1b2c3"
from app.utils.time import iso_now             # "2026-08-26T08:41:00+00:00"
from app.models.api import ChatRequest         # runner.run(ChatRequest(...)) is async
from app.routers.dependencies import get_context
```

`backend/pytest.ini` sets only `pythonpath = .`; pytest-asyncio runs in strict
mode, so every async test needs an explicit `@pytest.mark.asyncio`.

**Acceptable test noise.** `fastapi.testclient` emits
`StarletteDeprecationWarning: Using httpx with starlette.testclient is
deprecated; install httpx2 instead`. That warning is expected and pre-existing.
A run that ends `N passed, 1 warning` is a pass. Do not chase it.

### `VaultService` (`backend/app/services/vault.py`) — exact signatures

```python
def resolve(self, relative_path: str | Path) -> Path
def relative(self, path: Path) -> str
def exists(self, relative_path: str | Path) -> bool
def read_text(self, relative_path: str | Path) -> str
def read_markdown(self, relative_path) -> dict   # {path,name,content,metadata,updated_at}
def read_document(self, relative_path) -> dict   # adds {editable, kind}
def write_markdown(self, relative_path, content: str, metadata: dict | None = None) -> str
def update_markdown(self, relative_path, *, content: str | None = None,
                    metadata_updates: dict | None = None) -> str
def list_tree(self, relative_path: str = "", *, max_depth: int = 8) -> list[dict]
```

`write_markdown` writes YAML front matter + body atomically. All file access is
clamped to `VAULT_PATH` by `ensure_within`.

### `AgentRegistry` (`backend/app/agents/registry.py`)

```python
@dataclass
class AgentDefinition:
    agent_id: str; name: str; description: str; instructions: str
    allowed_tools: list[str]; max_steps: int; path: str

class AgentRegistry:
    def list(self) -> list[dict]           # [definition.__dict__, ...]
    def get(self, agent_id: str) -> AgentDefinition   # raises KeyError
    def create(self, *, agent_id, name, description, instructions,
               allowed_tools, max_steps) -> dict
    def global_standards(self) -> str
    def _load_all(self) -> dict[str, AgentDefinition]   # reads 00_System/agents/*.md
```

`AgentDefinition` is constructed in exactly two places: `registry.py:76` and
`backend/tests/test_agents.py:46` (keyword args). Adding fields **with
defaults** is safe. There is no `update()` — this plan adds one.

`_load_all` skips any agent whose front matter has `enabled: false`.

### `ToolRegistry` (`backend/app/tools/registry.py`)

`context.tools.list()` returns `[{tool_id, description, parameters, handler, path}, ...]`.

**The real tool ids, confirmed by running the registry:**

```
append_memory  audit_decisions  create_agent   create_schedule
create_work_item  list_files    move_matter_stage  read_file
record_decision   run_research  search_vault   write_markdown
```

### `MatterService`

`context.matters.matter_path("MAT-DEMO-APEX")` → `"03_Matters/project-apex-ai"`.

### Existing vault files

- `00_System/settings.md` — **does not exist yet.**
- `00_System/agents/counsel-copilot.md` — front matter keys: `agent_id, name,
  description, enabled, max_steps, allowed_tools`.
- `03_Matters/project-apex-ai/research/annotations.md` — **does not exist yet.**
- Matter folders contain: `matter.md request.md facts.md issues.md
  participants.md recommendations.md` and the folders `documents/ work-items/
  research/ drafts/ decisions/ events/`.
- Agents on disk: `counsel-copilot`, `decision-monitor`, `intake-agent`,
  `research-agent`.
- `00_System/audiences.md` — **does not exist yet.** Step 3 creates it, to the
  schema in `docs/AUDIENCE_SPEC.md`. Read that spec before Step 3; it is the
  authority on the Written-for feature and this plan only implements it.

### Frontend shape

| Fact | Value |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript strict |
| API client | `frontend/lib/api.ts`, all calls go through `request<T>()` |
| Base URL | `NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:8000/api` |
| Design tokens | `frontend/app/globals.css` — use existing classes, do not invent colours |
| Shared vocabulary | `frontend/lib/design.ts` (`STAGES`, `signalFor`, `dueWord`, `role`) |
| Stub data | `frontend/lib/stubs.ts` |
| Verify | `cd frontend && npm run typecheck && npm run build` |

The current stubs are the block marked `── Stubs ──` at the bottom of
`frontend/lib/api.ts`: `getSettings`, `saveSettings`, `getAgentDetail`,
`saveAgentDetail`. `getAgentDetail` is currently **unused** — the Agents page
calls `getAutomations()` and `agentDetailFrom()` directly.

### Corrected claims — read this before Step 1

Three things the redesign asserts on screen are **not true of this codebase**.
The decisions below are settled; do not re-open them.

1. **"An agent can never record a decision" is false.** `record_decision` is a
   live tool (`vault/00_System/tools/record_decision.md` → handler at
   `backend/app/tools/handlers.py:133` → `DecisionService.record`) and it is in
   counsel-copilot's `allowed_tools`. `vault/00_System/Soul.md` principle 9 and
   `docs/PRD.md` §7.8 both permit recording on explicit instruction, including
   from chat. The handler files such decisions with
   `decision_maker="User instructed the chat"`.
   **Decision: relabel, do not enforce.** The row becomes
   `agents.decision_attribution` — "Attribute chat-recorded decisions to the
   chat" — describing what the code actually guarantees.

2. **"Providers can never train on our content" is unenforceable here.** Nothing
   in `backend/app/providers/` touches training or retention; it is a property
   of whatever `LLM_BASE_URL` points at.
   **Decision: make it a recorded attestation** — a dated, attributed statement
   of what the provider contract says, not a runtime switch.

3. **The Organisation default is wrong.** `frontend/lib/stubs.ts` ships
   `"Verso, Inc."`; `vault/00_System/company.md` says **DemoCo Financial**. Fix
   it in Step 2.

Two neighbouring rows, `nosend` ("Send anything to a counterparty") and
`nodelete` ("Delete a source document"), are the same class of problem — no such
tool exists, so they are claims about absent capability rather than settings.
**Leave them as plain toggles for now**; they are out of scope. Flag them in
your final report.

Because nothing is locked any more, `SettingRow.locked`, the `.lock-pill`
rendering branch and the `.lock-pill` / `.lock-glyph` CSS are all removed. See
Steps 1 and 2.

### Known defect this plan must fix

`TOOL_OPTIONS` in `frontend/lib/stubs.ts` invents tool ids that do not exist in
the registry — `read_matter`, `web_search`, `write_file`, `move_matter`,
`notify`. Only `search_vault` and `create_work_item` are real. The agent
builder's checkboxes therefore do not reflect real permissions. Step 5 replaces
this list with the live one from the API.

---

## Step 1 — Settings service and endpoints

**Goal.** `GET`/`PUT /api/settings` persist a namespaced config map to
`00_System/settings.md`.

**Decisions already made — do not revisit.**

1. The vault stores a flat `{config_key: value}` map. The section and row layout
   stays in the frontend. Configuration and presentation are separate concerns,
   and the file has to be readable on its own.
2. Keys are **namespaced and durable**, never React ids. `general.organisation`,
   `matters.default_owner`, `agents.reasoning_model`,
   `data.closed_matter_retention`. Step 2 gives every frontend row a
   `config_key` alongside its existing `id`; `id` stays the React key.
3. **Nothing is locked.** There is no `LOCKED` dict, no 400 on a locked key, and
   no lock UI. See *Corrected claims* above.
4. One key gets server-side behaviour. `data.provider_no_training_attested` is
   an attestation: whenever its value **changes**, the service stamps
   `data.provider_no_training_attested_by` and `data.provider_no_training_attested_at`
   beside it. Re-writing the same value must not re-stamp.

**Files.**

1. New `backend/app/services/settings.py` — `SettingsService(vault: VaultService)`:
   - `PATH = "00_System/settings.md"`
   - `ATTESTATION_KEY = "data.provider_no_training_attested"`
   - `read(self) -> dict[str, Any]` → `{"values": {...}}`. Returns
     `{"values": {}}` when the file does not exist. Never raises, never creates
     the file on read.
   - `write(self, values: dict[str, Any]) -> dict[str, Any]` — merges over what
     is stored (a partial `PUT` must not wipe absent keys), stamps the
     attestation when `ATTESTATION_KEY` is present **and differs** from the
     stored value, writes with `write_markdown`, returns the same shape as
     `read()`.
   - Attribution for the stamp: use the stored `matters.default_owner`, falling
     back to `"Unattributed"`. There is no auth in this MVP, so that is the
     best available signer — say so in the row's help text rather than implying
     an identity the system does not have.
   - Front matter carries `values` plus `updated_at: iso_now()`. Body:
     `"# Workspace settings\n\nWritten from the Settings screen. One flat map of\nnamespaced configuration keys.\n"`.
2. `backend/app/models/api.py` — add
   `class SettingsUpdate(BaseModel): values: dict[str, Any] = Field(default_factory=dict)`.
3. New `backend/app/routers/settings.py` — `APIRouter(prefix="/settings", tags=["settings"])`,
   `GET ""` → `context.settings_store.read()`, `PUT ""` →
   `context.settings_store.write(payload.values)`.
4. `backend/app/runtime.py` — add `self.settings_store = SettingsService(self.vault)`.
   **Name it `settings_store`, not `settings`** — `AppContext.settings` is
   already the pydantic `Settings` object and shadowing it breaks every router.
5. `backend/app/main.py` — import the `settings` router and add it to the
   registration tuple.

**Test.** New `backend/tests/test_settings.py`:

```python
from __future__ import annotations


def test_settings_merge_rather_than_replace(app_context):
    assert app_context.settings_store.read()["values"] == {}
    app_context.settings_store.write({
        "general.organisation": "DemoCo Financial",
        "general.serif_long_documents": False,
    })
    merged = app_context.settings_store.write({"matters.default_owner": "Brian Harris"})["values"]
    assert merged["general.organisation"] == "DemoCo Financial"
    assert merged["general.serif_long_documents"] is False
    assert merged["matters.default_owner"] == "Brian Harris"


def test_settings_are_on_disk_not_in_memory(app_context):
    from app.services.settings import SettingsService
    app_context.settings_store.write({"general.organisation": "DemoCo Financial"})
    fresh = SettingsService(app_context.vault)
    assert fresh.read()["values"]["general.organisation"] == "DemoCo Financial"


def test_training_attestation_is_stamped_once(app_context):
    app_context.settings_store.write({"matters.default_owner": "Brian Harris"})
    values = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert values["data.provider_no_training_attested"] is True
    assert values["data.provider_no_training_attested_by"] == "Brian Harris"
    stamped_at = values["data.provider_no_training_attested_at"]
    assert stamped_at.startswith("20")

    # Re-writing the same value must not re-stamp.
    again = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert again["data.provider_no_training_attested_at"] == stamped_at

    # Changing it does re-stamp.
    changed = app_context.settings_store.write(
        {"data.provider_no_training_attested": False}
    )["values"]
    assert changed["data.provider_no_training_attested_at"] != stamped_at
```

**Verify.** `cd backend && .venv/bin/pytest -q` → `16 passed` (was 13). All
three tests must fail before this step's code exists.

## Step 2 — Point the Settings page at the API

**Goal.** `/settings` loads stored values, saves them, and reports failure.
No lock UI remains.

**Files.**

1. `frontend/lib/types.ts`:
   - Add `config_key?: string;` to `SettingRow`.
   - **Remove `locked?: boolean;` from `SettingRow`.**
   - Add `export type SettingsPayload = { values: Record<string, unknown> };`
2. `frontend/lib/stubs.ts` — rework `DEFAULT_SETTINGS`:
   - Every non-heading row gains a `config_key` in its section's namespace:
     `general.*`, `matters.*`, `agents.*`, `data.*`, `people.*`,
     `integrations.*`. Use readable names — `general.organisation`,
     `matters.default_owner`, `agents.max_tool_calls`,
     `data.closed_matter_retention` — not the React ids.
   - `general.organisation` default becomes **`"DemoCo Financial"`**, matching
     `vault/00_System/company.md`.
   - Replace the `nodec` row with
     `{ id: "decision_attribution", config_key: "agents.decision_attribution",
        kind: "toggle", on: true,
        label: "Attribute chat-recorded decisions to the chat",
        help: "A decision recorded from chat is filed as \"User instructed the chat\", never under your name." }`
   - Replace the `train` row with
     `{ id: "no_training", config_key: "data.provider_no_training_attested",
        kind: "toggle", on: false,
        label: "Our provider contract forbids training on our content",
        help: "Recorded, not enforced — this asserts what your contract says. Stamped with who set it and when." }`
     and move it under a new heading **"Attestations"**, out of "Retention".
   - No row sets `locked` any more.
3. `frontend/lib/api.ts` — delete the `getSettings`/`saveSettings` stubs and the
   `STUB` comments above them. Replace with:
   - `getSettings()` → `request<SettingsPayload>("/settings")`, then clone
     `DEFAULT_SETTINGS` and, for each row whose `config_key` is present in
     `values`, set `row.on` (toggle) or `row.value` (select/text/radio).
     Return `{ sections }` — `WorkspaceSettings` is unchanged, so
     `app/settings/page.tsx` needs no signature change.
   - `saveSettings(settings)` → flatten every non-heading row to
     `{[row.config_key!]: row.kind === "toggle" ? row.on : row.value}` and
     `PUT /settings` with `{ values }`.
4. `frontend/app/settings/page.tsx`:
   - **Delete the `row.kind === "toggle" && row.locked` branch** and the
     `.lock-pill` markup.
   - Footer: replace *"Nothing persists yet — settings have no backend store."*
     with *"Changes apply to everyone in the workspace."*
   - Wrap the Save handler in `try/catch` and render the message with the
     existing `.error` class.
5. `frontend/app/globals.css` — delete the now-unused `.lock-pill` and
   `.lock-glyph` rules.

**Verify.**
1. `cd frontend && npm run typecheck && npm run build` → no errors.
2. `grep -rn "lock-pill\|lock-glyph\|locked" frontend/app frontend/lib frontend/components`
   → no matches.
3. With the backend running: change **Organisation** on `/settings` to
   `Handoff Test`, Save, hard-reload. The field still reads `Handoff Test`.
4. `cat vault/00_System/settings.md` → front matter shows
   `general.organisation: Handoff Test`.
5. Toggle the attestation row on, Save, and confirm
   `data.provider_no_training_attested_by` and `..._at` appear in that file.
6. Set Organisation back to `DemoCo Financial` and save before moving on.

## Step 3 — "Written for" replaces Voice

**Read `docs/AUDIENCE_SPEC.md` before starting.** It is the authority on this
feature; this step implements the "Build now" half of it and nothing more. The
per-request override in that spec is explicitly **out of scope**.

**Goal.** An agent carries an audience — a named reader plus editable prompt
text — and that text reaches the model.

Voice (Plain and direct / Formal / Very terse) is deleted. It described register;
the thing lawyers actually change is the reader.

**Files.**

1. New vault file `vault/00_System/audiences.md` — copy the six presets from
   `docs/AUDIENCE_SPEC.md` § *Presets* verbatim: `counsel`, `executive`,
   `product`, `partner`, `regulator`, `record`. Front matter carries
   `record_type: audiences` and an `audiences:` list of
   `{audience_id, label, prompt}`.
2. `backend/app/agents/registry.py`:
   - Add three fields to `AgentDefinition`, **all with defaults** so the two
     existing construction sites (`registry.py:76`, `tests/test_agents.py:46`)
     keep working:
     `audience_id: str = ""`, `audience_prompt: str = ""`, `schedule_text: str = ""`.
   - Read them from front matter in `_load_all`.
   - Add `audiences(self) -> list[dict[str, Any]]` — reads
     `00_System/audiences.md` and returns the `audiences` list, or `[]` when the
     file is missing. Never raises.
   - Add `update(self, agent_id: str, **fields: Any) -> dict[str, Any]`:
     calls `self.get(agent_id)` (propagating `KeyError`), reads the existing
     document with `read_markdown(definition.path)` so `enabled`, `created_at`
     and any unknown front-matter key survive, applies only
     `name description allowed_tools max_steps audience_id audience_prompt schedule_text`,
     rewrites the body as `f"# {name}\n\n{instructions}\n"` when `instructions`
     is supplied (otherwise keeps the existing body), writes to the **same
     path**, and returns the updated `definition.__dict__`.
     `agent_id` is not editable — ignore it if present in `fields`.
3. `backend/app/agents/context.py` — in `build()`, after the active-agent part,
   append an audience section **only when `agent.audience_prompt` is non-empty**:

   ```python
   parts = [
       "# Operating standards",
       self.agents.global_standards(),
       f"# Active agent: {agent.name}\n{agent.instructions}",
   ]
   if agent.audience_prompt.strip():
       parts.append(f"# Written for\n{agent.audience_prompt.strip()}")
   ```

   A separate heading, not concatenated into `instructions`, so the two stay
   independently editable and independently visible in the UI.

**Test.** Add to `backend/tests/test_agents.py`:

```python
def test_agent_update_persists_and_preserves_enabled(app_context):
    updated = app_context.agents.update(
        "research-agent",
        name="Themis",
        audience_id="executive",
        audience_prompt="The reader decides and does not practise law.",
        schedule_text="Weekdays at 07:00.",
        allowed_tools=["read_file", "search_vault"],
        instructions="Answer with the citation first.",
    )
    assert updated["name"] == "Themis"
    assert updated["audience_id"] == "executive"
    assert updated["allowed_tools"] == ["read_file", "search_vault"]

    reloaded = app_context.agents.get("research-agent")
    assert reloaded.name == "Themis"
    assert reloaded.schedule_text == "Weekdays at 07:00."
    assert "citation first" in reloaded.instructions
    # enabled: true must survive, or the agent vanishes from list()
    assert any(a["agent_id"] == "research-agent" for a in app_context.agents.list())


def test_audience_reaches_the_model_context(app_context):
    app_context.agents.update(
        "research-agent",
        audience_id="executive",
        audience_prompt="The reader decides and does not practise law.",
    )
    agent = app_context.agents.get("research-agent")
    built = app_context.agent_context.build(agent)
    assert "# Written for" in built
    assert "does not practise law" in built


def test_empty_audience_injects_nothing(app_context):
    app_context.agents.update("research-agent", audience_id="", audience_prompt="   ")
    agent = app_context.agents.get("research-agent")
    assert "# Written for" not in app_context.agent_context.build(agent)


def test_audiences_are_read_from_the_vault(app_context):
    ids = {entry["audience_id"] for entry in app_context.agents.audiences()}
    assert {"counsel", "executive", "product", "partner", "regulator", "record"} == ids
    executive = next(e for e in app_context.agents.audiences() if e["audience_id"] == "executive")
    assert executive["label"] == "An executive"
    assert executive["prompt"].strip()


def test_agent_update_rejects_unknown_agent(app_context):
    import pytest
    with pytest.raises(KeyError):
        app_context.agents.update("no-such-agent", name="X")
```

**Verify.** `cd backend && .venv/bin/pytest -q` → `21 passed`. The `enabled`
assertion is the one that catches the classic bug here: rewriting the file
without preserving front matter silently deletes the agent from `list()`.

Note that `conftest.py` copies the whole `vault/` directory into a tmp path, so
`audiences.md` must be committed to the real vault for these tests to see it.

## Step 4 — Agent and tool endpoints

**Goal.** The builder can read one agent, save it, and see the real tool list.

**Files.**

1. `backend/app/models/api.py` — add:
   ```python
   class AgentUpdate(BaseModel):
       name: str | None = None
       description: str | None = None
       instructions: str | None = None
       allowed_tools: list[str] | None = None
       max_steps: int | None = Field(default=None, ge=1, le=20)
       audience_id: str | None = None
       audience_prompt: str | None = None
       schedule_text: str | None = None
   ```
2. `backend/app/routers/automations.py` — add three routes below the existing
   `create_agent`:
   - `GET /agents` → `{"agents": context.agents.list()}`
   - `GET /agents/{agent_id}` → `context.agents.get(agent_id).__dict__`,
     `KeyError` → 404
   - `PUT /agents/{agent_id}` → `context.agents.update(agent_id, **payload.model_dump(exclude_none=True))`,
     `KeyError` → 404, `ValueError` → 400
   - `GET /tools` → `{"tools": context.tools.list()}`
   - `GET /audiences` → `{"audiences": context.agents.audiences()}`

   Match the existing error style in that file:
   ```python
   except KeyError as exc:
       raise HTTPException(status_code=404, detail=str(exc)) from exc
   ```

**Route-order note.** FastAPI matches in declaration order and `POST /agents`
already exists; the new `GET /agents` and `GET /agents/{agent_id}` use different
methods so there is no conflict. Do not reorder existing routes.

**Test.** New `backend/tests/test_automations_api.py` using FastAPI's
`TestClient` against the real app, so the routes are exercised through HTTP and
not just as service calls:

```python
from __future__ import annotations
from fastapi.testclient import TestClient

def _client(app_context):
    from app.main import app
    app.state.context = app_context
    return TestClient(app)

def test_tools_endpoint_lists_real_tool_ids(app_context):
    body = _client(app_context).get("/api/automations/tools")
    assert body.status_code == 200
    ids = {tool["tool_id"] for tool in body.json()["tools"]}
    assert {"read_file", "search_vault", "write_markdown", "record_decision"} <= ids

def test_agent_get_and_put(app_context):
    client = _client(app_context)
    assert client.get("/api/automations/agents/no-such").status_code == 404
    response = client.put(
        "/api/automations/agents/research-agent",
        json={"audience_id": "executive", "audience_prompt": "The reader decides."},
    )
    assert response.status_code == 200
    assert response.json()["audience_id"] == "executive"
    reread = client.get("/api/automations/agents/research-agent").json()
    assert reread["audience_prompt"] == "The reader decides."


def test_audiences_endpoint(app_context):
    body = _client(app_context).get("/api/automations/audiences")
    assert body.status_code == 200
    assert {a["audience_id"] for a in body.json()["audiences"]} >= {"counsel", "executive"}
```

`TestClient` needs `httpx`, which is **already** pinned at `httpx==0.28.1` in
`backend/requirements.txt` and installed in `.venv`. No new dependency is needed
anywhere in this plan.

**Verify.** `cd backend && .venv/bin/pytest -q` → `24 passed`.

---

## Step 5 — Point the Agents page at the API

**Goal.** `/agents` edits a real agent, ticks real tools, sets a real audience,
and saves.

**Files.**

1. `frontend/lib/types.ts`:
   - Add `audience_id: string; audience_prompt: string; schedule_text: string;`
     to `AgentDefinition`.
   - `AgentDetail` reduces to
     `AgentDefinition & { schedule_reads_as: string; state: string }` — drop
     `voice`, `schedule_text` (now on the definition) and `run_count` (nothing
     reads it).
   - Add `export type Audience = { audience_id: string; label: string; prompt: string };`
     and `export type ToolDefinition = { tool_id: string; description: string; path: string };`
2. `frontend/lib/api.ts` — replace the two agent stubs and their `STUB` comments:
   - `getAgentDetail(agentId)` → `request<AgentDefinition>(\`/automations/agents/${encodeURIComponent(agentId)}\`)`,
     wrapped with `agentDetailFrom`.
   - `saveAgentDetail(agent)` → `PUT` the same path with
     `{name, description, instructions, allowed_tools, max_steps, audience_id, audience_prompt, schedule_text}`.
   - `getTools()` → `request<{ tools: ToolDefinition[] }>("/automations/tools")`
   - `getAudiences()` → `request<{ audiences: Audience[] }>("/automations/audiences")`
3. `frontend/lib/stubs.ts`:
   - **Delete `TOOL_OPTIONS` entirely.** It is wrong (see *Known defect*).
   - **Delete `AGENT_VOICES`.** Voice is gone.
   - In `agentDetailFrom`, stop synthesising `voice` and `schedule_text` (they
     arrive from the API) and drop `run_count`. Keep `schedule_reads_as` and
     `state`, which are still derived from the schedule list.
   - Keep `FIXED_AGENT_RULES` and `DEFAULT_SETTINGS`.
   - The file is no longer stubs: rewrite its header comment to describe what it
     now is — presentation vocabulary and defaults the backend does not model —
     and delete the `STUB:` marker above `agentDetailFrom`.
4. `frontend/app/agents/page.tsx`:
   - Load tools and audiences alongside `getAutomations()`.
   - **Tools.** One checkbox per real tool. Label = the first sentence of
     `tool.description`, falling back to `tool.tool_id`. Checked when
     `draft.allowed_tools.includes(tool.tool_id)`. Keep the existing
     `.checkbox-row` / `.checkbox-box` markup.
   - **Replace the Voice block with "Written for"**, per
     `docs/AUDIENCE_SPEC.md` § *UI*:
     - Heading `Written for`, help line
       *"Who reads this. Choose a starting point, then say it in your own words."*
     - One chip per audience: `.btn.compact`, and `.btn.compact.primary` when
       `draft.audience_id === audience.audience_id`.
     - Clicking a chip sets both `audience_id` and `audience_prompt` to that
       preset. **No confirmation dialog** — the screen already has Discard and
       nothing is written until Save.
     - Below the chips, a `textarea.text-input.prose` bound to
       `draft.audience_prompt`. Editing it clears `audience_id` only if the text
       no longer matches any preset exactly; in that case the heading reads
       `Written for · edited` and no chip is highlighted.
     - Empty and nothing chosen: placeholder
       *"No audience set — the agent writes for the record by default."*
   - Footer: replace the stub note with
     `Defined in <mono>{draft.path}</mono>. Saved changes rewrite that file.`
   - Surface save errors with the existing `.error` class instead of swallowing
     them.

**Verify.**
1. `cd frontend && npm run typecheck && npm run build` → no errors.
2. `grep -rn "read_matter\|web_search\|move_matter\b\|TOOL_OPTIONS\|AGENT_VOICES\|voice" frontend/lib frontend/app frontend/components`
   → **no matches.** (`move_matter_stage` is a real tool id and is fine; the
   bare `move_matter` is not.)
3. With the backend running, on `/agents`: pick **Research Agent**, click the
   **An executive** chip — the textarea fills with that preset. Edit one word.
   Untick one tool. Save. Hard-reload → the edited text, the chip state and the
   tool change all persist.
4. `cat vault/00_System/agents/research-agent.md` → front matter shows
   `audience_id: executive`, the edited `audience_prompt`, `enabled: true` still
   present, and the removed tool gone.
5. Revert those edits by hand before moving on.

## Step 6 — Research annotations service and endpoints

**Goal.** A questioned passage and the agent's answer survive a reload.

**Storage.** One file per matter: `{matter_path}/research/annotations.md`.
Front matter:

```yaml
matter_id: MAT-DEMO-APEX
record_type: annotations
annotations:
  - annotation_id: ANN-20260826-a1b2c3
    source_path: 03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md
    citation: s2
    quote: "…retained for up to 30 days…"
    question: "Is 30 days inside our strict DPA variant?"
    answer: ""
    answered: false
    who: Brian Harris
    created_at: "2026-08-26T08:41:00+00:00"
    answered_at: null
```

Body: `"# Annotations\n\nQuestions the lawyer raised against research in this matter.\n"`.

**Files.**

1. New `backend/app/services/annotations.py` — `AnnotationService(vault, matters, runner=None)`:
   - `_path(matter_id)` → `f"{self.matters.matter_path(matter_id)}/research/annotations.md"`
     (propagates `KeyError` for an unknown matter).
   - `list(matter_id) -> list[dict]` — returns `[]` when the file is absent.
     Never creates it on read.
   - `create(matter_id, *, source_path, citation, quote, question, who) -> dict`
     — id from `new_id("ANN")`, `created_at` from `iso_now()`, appends and
     rewrites the file. Creates the file on first write.
   - `async answer(matter_id, annotation_id) -> dict` — raises `KeyError` for an
     unknown id; runs the copilot and stores the reply:
     ```python
     response = await self.runner.run(ChatRequest(
         message=(f"A passage from {annotation['source_path']} reads: "
                  f"\"{annotation['quote']}\"\n\n{annotation['question']}"),
         matter_id=matter_id,
         active_file=annotation["source_path"],
         agent_id="research-agent",
     ))
     ```
     then sets `answer=response.reply`, `answered=True`, `answered_at=iso_now()`.
     **Use `research-agent`, not `counsel-copilot`** — the copilot may take
     workspace actions, and answering a question must not move a matter.
   - `runner` is injected after construction in `runtime.py` (the runner is
     built last), the same way `scheduler.bind(self)` works. Add
     `def bind(self, runner) -> None: self.runner = runner`.
2. `backend/app/models/api.py` — add:
   ```python
   class AnnotationCreate(BaseModel):
       source_path: str
       question: str = Field(min_length=1)
       quote: str = ""
       citation: str = ""
       who: str = "Brian Harris"
   ```
3. `backend/app/routers/matters.py` — add three routes:
   - `GET /{matter_id}/annotations` → `{"annotations": context.annotations.list(matter_id)}`
   - `POST /{matter_id}/annotations` (status 201) → `context.annotations.create(matter_id, **payload.model_dump())`
   - `POST /{matter_id}/annotations/{annotation_id}/answer` → `await context.annotations.answer(...)`

   `KeyError` → 404 in all three, matching the file's existing style. On the
   answer route also translate a provider failure:
   `except RuntimeError as exc: raise HTTPException(status_code=502, detail=str(exc)) from exc`
   — otherwise a flaky provider returns an opaque 500.
4. `backend/app/runtime.py` — construct `self.annotations = AnnotationService(self.vault, self.matters)`
   before the runner, then `self.annotations.bind(self.runner)` on the last line
   next to `self.scheduler.bind(self)`.

**Test.** New `backend/tests/test_annotations.py`:

```python
from __future__ import annotations
import pytest

def test_annotations_round_trip(app_context):
    assert app_context.annotations.list("MAT-DEMO-APEX") == []
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1",
        quote="…bounded opt-in launch…",
        question="Does that survive an audit?",
        who="Brian Harris",
    )
    assert created["annotation_id"].startswith("ANN-")
    assert created["answered"] is False
    stored = app_context.annotations.list("MAT-DEMO-APEX")
    assert len(stored) == 1 and stored[0]["question"] == "Does that survive an audit?"

def test_annotations_unknown_matter_raises(app_context):
    with pytest.raises(KeyError):
        app_context.annotations.list("MAT-NOPE")

@pytest.mark.asyncio
async def test_annotation_answer_is_stored(app_context):
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1", quote="…", question="What would change this?", who="Brian Harris",
    )
    answered = await app_context.annotations.answer("MAT-DEMO-APEX", created["annotation_id"])
    assert answered["answered"] is True
    assert answered["answer"].strip()
    assert app_context.annotations.list("MAT-DEMO-APEX")[0]["answered"] is True

@pytest.mark.asyncio
async def test_annotation_answer_survives_a_hostile_model_reply(app_context, monkeypatch):
    """The provider is not ours. A blank or exploding reply must not corrupt the file."""
    created = app_context.annotations.create(
        "MAT-DEMO-APEX",
        source_path="03_Matters/project-apex-ai/research/RES-MAT-DEMO-APEX.md",
        citation="s1", quote="…", question="Q?", who="Brian Harris",
    )

    async def boom(_request):
        raise RuntimeError("provider exploded")

    monkeypatch.setattr(app_context.runner, "run", boom)
    with pytest.raises(RuntimeError):
        await app_context.annotations.answer("MAT-DEMO-APEX", created["annotation_id"])
    # The annotation must still be readable and still unanswered.
    stored = app_context.annotations.list("MAT-DEMO-APEX")
    assert len(stored) == 1 and stored[0]["answered"] is False
```

That last test is the point of this step: write the answer **after** a
successful run, never before, so a provider failure leaves the file intact.

**Verify.** `cd backend && .venv/bin/pytest -q` → `28 passed`. Then
`git status --short vault/` and delete any `annotations.md` the manual testing
created before committing.

---

## Step 7 — Point the research page at the annotations API

**Goal.** `/matters/[id]/research` notes persist and can be answered.

**Files.**

1. `frontend/lib/types.ts` — extend `ResearchNote` with
   `annotation_id: string; source_path: string; citation: string;` and keep the
   existing display fields.
2. `frontend/lib/api.ts` — add:
   - `getAnnotations(matterId)` → `request<{annotations: ResearchNote[]}>(\`/matters/${encodeURIComponent(matterId)}/annotations\`)`
   - `createAnnotation(matterId, payload)` → `POST` the same path
   - `answerAnnotation(matterId, annotationId)` → `POST .../annotations/${id}/answer`
3. `frontend/app/matters/[matterId]/research/page.tsx`:
   - Load annotations in the existing `load` callback; drop the
     `/* STUB: annotations are session-local… */` comment and the local-only
     `setNotes` append.
   - "Add the note" posts, then refetches.
   - Each unanswered note gets an **Ask Themis** button (`.btn.agent.compact`)
     that calls `answerAnnotation` and refetches. While in flight show
     `Themis is working…` in the existing `.agent-label` style.
   - Replace the *"Notes stay in this session"* stub line with the note count.
   - Map the API's field names onto what the JSX already renders: the component
     reads `n.text` for the question — either rename the field in the JSX to
     `question` or map it in the fetch. Pick one and be consistent.

**Verify.**
1. `cd frontend && npm run typecheck && npm run build` → no errors.
2. With backend running, open `/matters/MAT-DEMO-APEX/research`, switch to
   **Notes & questions**, add a note, **hard-reload the page** — the note is
   still there. This reload is the whole point of the step.
3. Click **Ask Themis** on that note; an answer appears and survives a reload.
4. `cat vault/03_Matters/project-apex-ai/research/annotations.md` shows it.
5. Delete that file before committing:
   `rm vault/03_Matters/project-apex-ai/research/annotations.md`

---

## Step 8 — Matters Table and Timeline views

**Goal.** The three-way switch on `/matters` works. No disabled buttons remain.

Frontend only. No API changes — everything comes from the `matters` array the
page already has.

**Files.** `frontend/app/matters/page.tsx`, plus two new components
`frontend/components/MattersTable.tsx` and `frontend/components/MattersTimeline.tsx`.

Replace the three `<button>`s in the `.segmented` control with real state
(`const [view, setView] = useState<"stages" | "table" | "timeline">("stages")`)
and render the matching component. The count chips and filter chips apply to
all three views — filter first, then hand the same `visible` array to whichever
view is showing.

**Table spec** (reuse `.register`/`.register-grid` classes from `globals.css`):

- Columns, in order: Matter · Stage · Next action · Owner · Due · Risk.
- Grid: `grid-template-columns: minmax(0,2fr) 150px minmax(0,2fr) 120px 110px 90px`.
- Header row uses `.register-head` and `.record-meta`.
- Matter cell: title in `.register-title` (serif), type underneath in
  `.register-cell`.
- Stage cell shows `stageLabel(matter.status)` from `lib/design.ts`.
- Due cell uses `dueWord(matter)` — text and colour both.
- Clicking a row navigates to the matter.
- Header cells for Stage, Owner and Due sort ascending/descending on click;
  default sort is by due date, undated matters last.

**Timeline spec:**

- Horizontal axis of the next 12 weeks starting from the Monday of the current
  week. One column per week, labelled with the week-commencing date in
  `.record-meta`.
- One row per matter that has a `target_date` inside the window, ordered by
  date. Matters with no target date are listed under the grid in a
  `.quiet-list` headed "No target date".
- Each matter renders as a `.board-card`-styled pill positioned in its week
  column, using `signalFor(matter)` for `borderLeftColor` and background —
  same signal colours as everywhere else.
- Overdue matters pin to the first column with the vermilion rail.
- Empty state when nothing falls in the window: the existing `.empty-state`
  class, text "Nothing is scheduled in the next twelve weeks."

Do not invent colours, fonts or spacing. Every value comes from a CSS variable
already defined in `globals.css`.

**Verify.**
1. `cd frontend && npm run typecheck && npm run build` → no errors.
2. `grep -n "disabled" frontend/app/matters/page.tsx` → no match on the
   segmented control.
3. In the browser at `/matters`: switch **Stages → Table → Timeline**; each
   renders. With the **waiting on you** count chip active, all three views show
   only that subset.
4. In Table view, click the **Due** header twice — order reverses.

---

## Acceptance

The original symptom was four screens that looked finished and forgot
everything. With the backend running (`make backend`) and the frontend running
(`make frontend`):

1. `/settings` → change Organisation, Save, **restart the backend**, reload →
   the new value is there.
2. `/settings` → toggle *"Our provider contract forbids training on our
   content"*, Save, then `cat vault/00_System/settings.md` → the value plus
   `data.provider_no_training_attested_by` and `..._at`.
3. `cat vault/00_System/settings.md` → every key is namespaced
   (`general.*`, `matters.*`, `agents.*`, `data.*`). No bare `org`, `tz`, `s1`.
4. `/agents` → pick an audience chip, edit the text, Save, reload → persisted,
   and `vault/00_System/agents/research-agent.md` still has `enabled: true`.
5. The audience actually reaches the model: with an audience set on
   counsel-copilot, ask it anything on a matter and confirm `# Written for`
   appears in the built context (the test in Step 3 covers this; the manual
   check is optional).
6. `/agents` → every checkbox label corresponds to a tool id returned by
   `curl -s localhost:8000/api/automations/tools`.
7. `/matters/MAT-DEMO-APEX/research` → add a note, reload → still there; **Ask
   Themis** → an answer appears and survives a reload.
8. `/matters` → Stages, Table and Timeline all render; no disabled controls.
9. `cd backend && .venv/bin/pytest -q` → 28 passed.
10. `cd frontend && npm run typecheck && npm run build` → clean.
11. `grep -rn "STUB" frontend/lib frontend/app frontend/components` → **no
    matches.** There are 6 today (4 in `lib/api.ts`, 1 in `lib/stubs.ts`, 1 in
    the research page); Steps 2, 5 and 7 remove all of them.

Then update `docs/IMPLEMENTATION_STATUS.md`: delete the "Stubbed by the
redesign" section and move those four items into "Implemented in this scaffold".
Add a line recording that the Written-for feature landed per
`docs/AUDIENCE_SPEC.md`, with the per-request override still outstanding.

## Do NOT

- Do not add any new dependency. Everything needed is already installed.
- Do not touch `backend/app/services/matters.py`, `decisions.py`, `research.py`,
  `index.py`, `scheduler.py`, or `providers/`. They are out of scope.
- Do not rename `AppContext.settings`. Add `settings_store` beside it.
- Do not remove `record_decision` from any agent, and do not add server-side
  enforcement of it. That claim was withdrawn deliberately — see *Corrected
  claims*.
- Do not reintroduce a "locked" settings row in any form.
- Do not remove the `enabled` key, `created_at`, or any unknown front-matter key
  when rewriting an agent file.
- Do not build the per-request audience override from `docs/AUDIENCE_SPEC.md`.
  Agent-level default only.
- Do not reformat files you are not otherwise changing, and do not reorder
  imports in untouched files.
- Do not invent colours, spacing or fonts. Use the CSS variables in
  `frontend/app/globals.css`.
- Do not commit vault files created by manual testing. `00_System/settings.md`
  and `00_System/audiences.md` are intended and should be committed; any
  `research/annotations.md` is test residue and should not.
- Do not weaken or delete a test to make it pass.
- If a step's verification fails, stop and report. Do not improvise a fix and
  carry on.
- If a fact in "Verified context" turns out to be wrong — a named function,
  path or signature does not exist — stop and report that. Do not adapt around it.
- Commit after each verified step: `git commit -m "handoff step N: <title>"`.


---

## Report when you finish or stop

Say which steps ran, paste the verification output verbatim for the last step
you completed, and name anything you skipped or could not verify. Include a note
on the `nosend` / `nodelete` settings rows flagged in *Corrected claims*.

If a fact in "Verified context" turns out to be wrong — a named function, path,
or signature does not exist — stop and report that rather than adapting around
it. That is a defect in this plan, not something for you to work around.
