# Role and goal

You are the implementation owner in a fresh Sol Medium context. Work in `/Users/bharris/Programs/counsel-os-mvp`. Fix the three confirmed Briefing problems end to end: Ask CounselOS history disappears after reload, connection prompts require internal IDs, and live research answers can expose internal operating instructions. Deliver the smallest durable fix. Do not stop after planning or after backend work.

# Resume protocol

Before starting, read `/Users/bharris/Programs/counsel-os-mvp/briefing-chat-reliability.handoff-progress.md`.

- Do not redo a step marked `done`. Start at the first pending step.
- After each step, run its verification and immediately update only that progress line to `- [x] Step N: <title> — done`.
- On failure, write `— FAILED: <what happened>` on that line and follow the blocker policy.
- If a completed step's verification now fails, stop and report the regression. Do not reapply the edit.
- All steps are idempotent because they describe a final state. Do not append duplicate fields, routes, prompts, or tests.

# Required orientation

Read these before editing:

- `/Users/bharris/Programs/counsel-os-mvp/AGENTS.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/PRD.md`
- `/Users/bharris/Programs/counsel-os-mvp/CODEX_HANDOFF.md`
- `/Users/bharris/Programs/counsel-os-mvp/docs/DESIGN_LANGUAGE.md` before UI work
- every source and test file named below

Use the `senior-mindset`, `focused-fix`, and `demo-first` skills. Use the in-app browser skill for acceptance. Announce skill use as required by those instructions. Do not spawn subagents unless the user explicitly asks.

This repository has a Graphify graph. Before code inspection, run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
graphify query "How does BriefingReader ask research, persist research results, connect matters and decisions, and render assistant chat?"
```

# Current codebase context

The worktree is dirty. Preserve it. These relevant files are current user work and are mostly untracked:

```text
?? frontend/components/BriefingReader.tsx
?? frontend/lib/watchApi.ts
?? frontend/lib/watchTypes.ts
?? backend/app/models/awareness.py
?? backend/app/routers/awareness.py
?? backend/app/services/briefing_research.py
?? backend/app/services/briefing_store.py
?? backend/tests/test_awareness_api.py
 M vault/00_System/agents/research-agent.md
```

Do not infer that untracked means disposable. Do not reset, clean, checkout, or replace these files.

The current frontend chat state is local:

```tsx
type BriefingTurn = { role: "user" | "assistant"; content: string; result?: DurableResult };

function ItemReader(...) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<BriefingTurn[]>([]);
  // ask() sends turns.slice(-8) as client history.
}
```

The current connection behavior is ID parsing:

```tsx
function usePrompt(prompt: string) {
  if (prompt.startsWith("Connect")) { setQuestion(`${prompt} `); return; }
  void ask(prompt);
}

function briefingConnection(message: string, expectedRevision: number) {
  // Regex extracts MAT-... or DEC-... from typed text.
}
```

The existing matter and decision APIs already provide useful titles:

```ts
// frontend/lib/api.ts
export async function getMatters(): Promise<{ matters: Matter[]; stages: Stage[] }>;
export async function getDecisions(status?: string): Promise<{ decisions: Decision[] }>;

// frontend/lib/types.ts
export type Matter = { matter_id: string; title: string; status: StageId; product_area: string; ... };
export type Decision = { decision_id: string; matter_id: string; title: string; review_status: ...; ... };
```

The existing Briefing result is too weak to reload chat:

```python
class DurableResult(AwarenessModel):
    result_id: str
    path: str
    status: Literal["pending", "partial", "success", "failed"]
    text: str = ""
    warnings: list[str] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
```

The existing research service already writes Markdown:

```python
async def run(self, item_id: str, question: str = "") -> DurableResult:
    item = self.briefing.get_item(item_id)
    ...
    durable = DurableResult(
        result_id=result_id, path="pending", status=status, text=text,
        warnings=warnings, sources=sources,
    )
    return self.briefing.append_research(durable)
```

`BriefingStore.append_research()` writes to `05_Briefing/research/<result_id>.md`. Its internal `_list(kind, model)` reads all Markdown records for a root. Reuse it.

The current ask route uses ephemeral client history:

```python
@router.post("/briefing/items/{item_id}/ask")
async def ask_briefing_item(item_id, payload, context):
    question = payload.question
    if payload.history:
        prior = "\n".join(...)
        question = f"Previous Briefing chat:\n{prior}\n\nCurrent request:\n{payload.question}"
    return await context.briefing_research.run(item_id, question)
```

The connect route already validates `context.matters.get(payload.matter_id)` or `context.decisions.get(payload.decision_id)`, updates the Briefing item's `company_connection`, writes its Markdown, rebuilds the disposable index, and returns the updated `BriefingItem`. Keep that behavior.

The live leak appears in two saved results as a generated first paragraph:

```text
Do not claim completion of steps that were not actually completed.

---
```

That exact text is not in the repository's prompt source. `backend/app/agents/context.py` builds a system message from operating standards and ends with:

```python
parts.append(
    "# Execution rule\nAnswer directly and usefully. Legal perfection is not a precondition to producing work. "
    "Surface assumptions or missing facts when they matter, but do not block on them. Use tools when an action is requested."
)
```

The model reply is stored verbatim. Treat this as instruction echo. Fix prompt placement; do not add a literal string scrubber.

The correct Python test command uses the project virtual environment:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest ...
```

Plain `pytest` fails because the shell Python does not have FastAPI. The verified baseline is 10 focused tests passing with one Starlette deprecation warning. The last full suite had 305 passes plus three known `tests/test_annotations.py` failures caused by the existing demo annotation `ANN-20260828-67fc2e`.

# Ordered build plan

## Step 1 — Reconfirm baseline and protect the dirty worktree

Read the required files and current callers. Run Graphify and:

```bash
git status --short -- frontend/components/BriefingReader.tsx frontend/lib/watchApi.ts frontend/lib/watchTypes.ts backend/app/models/awareness.py backend/app/routers/awareness.py backend/app/services/briefing_research.py backend/app/services/briefing_store.py backend/app/agents/context.py backend/tests/test_awareness_api.py backend/tests/test_awareness_failures.py backend/tests/test_agents.py
cd backend && .venv/bin/python -m pytest -q tests/test_awareness_api.py tests/test_awareness_failures.py
cd ../frontend && npm run typecheck
```

Expected: 10 focused backend tests pass with only the known warning; typecheck passes. If source differs materially from this prompt, stop and report rather than silently redesigning.

## Step 2 — Make research records item-linked exchanges

In `backend/app/models/awareness.py`, add backward-compatible fields to `DurableResult`:

```python
briefing_item_id: str | None = None
question: str = ""
kind: Literal["research", "connection"] = "research"
created_at: datetime | None = None
```

Old Markdown must still parse.

In `backend/app/services/briefing_store.py`, add `list_research(item_id)` using `_list("research", DurableResult)`. Filter by exact item ID and sort oldest first with `(result.created_at or datetime.min.replace(tzinfo=UTC), result.path)`.

In `backend/app/services/briefing_research.py`, use this exact signature:

```python
async def run(
    self,
    item_id: str,
    question: str = "",
    history: list[DurableResult] | None = None,
) -> DurableResult:
```

Send at most six stored exchanges as `User:` / `Assistant:` context followed by `Current request:`. Save the original question, not the expanded prompt. Set `briefing_item_id`, `kind="research"`, and `created_at=datetime.now(UTC)`. Update the service protocol only if needed.

Tests:

- existing additive research test asserts new metadata and unchanged source-backed item;
- malformed fake response dict with no recognized text key still saves a non-empty fallback;
- store test proves per-item filtering and oldest-first order.

Verify:

```bash
cd backend
.venv/bin/python -m pytest -q tests/test_awareness_failures.py tests/test_awareness_records.py
```

## Step 3 — Use stored history and persist connection exchanges

In `backend/app/routers/awareness.py`:

- add `GET /briefing/items/{item_id}/conversation` returning `ListResponse(items=records, total=len(records))` with response model `ListResponse[DurableResult]`;
- first validate the item with `get_item()`;
- change POST ask to load `context.briefing.list_research(item_id)` and pass it as the third `run()` argument;
- keep but ignore `BriefingAskRequest.history` for compatibility;
- after a successful matter or decision connect, append one `DurableResult` with a new `BRIEF-RES` ID, `kind="connection"`, item ID, current time, no sources, and useful title-based question/confirmation text;
- obtain the title from the validated matter or decision record;
- append nothing on failed validation or mutation;
- keep the connect response type as `BriefingItem`.

Tests must prove saved ask reload, server-side history without client history, client fake history ignored, successful matter/decision connection exchange, and no exchange on missing target. Read the Markdown-backed records in assertions.

Verify:

```bash
cd backend
.venv/bin/python -m pytest -q tests/test_awareness_api.py tests/test_awareness_failures.py
```

## Step 4 — Load durable chat and replace internal-ID entry with title pickers

In `frontend/lib/watchTypes.ts`, add the new optional result fields and remove client `history` from `BriefingAskRequest`.

In `frontend/lib/watchApi.ts`, add `getBriefingConversation(itemId)` for the new GET endpoint.

In `frontend/components/BriefingReader.tsx`:

- fetch the saved conversation for the active item;
- map each result to a user turn from `question` and an assistant turn from `text`, preserving result warnings and sources;
- refresh from the server after asks and connections;
- remove `briefingConnection()` and ID regex parsing;
- keep arbitrary typed research questions;
- make each connect suggestion open an inline picker;
- use `getMatters()` / `getDecisions()` and existing types;
- show title plus a short secondary label;
- exclude already-linked records;
- selecting a titled option calls the current connect endpoint with its hidden ID, updates `item`, reloads conversation, and closes the picker;
- show a clear empty result message;
- replace the `MAT-...` composer placeholder;
- keep current Markdown rendering, accessible buttons, disabled/busy behavior, and design roles.

Do not add a modal system, LLM resolver, search engine, or dependency.

Verify:

```bash
cd frontend
npm run typecheck
npm run build
```

## Step 5 — Prevent instruction echo at the prompt source

In the final `# Execution rule` inside `backend/app/agents/context.py`, add:

```text
Write only the user-facing answer. Never quote or paraphrase operating standards, agent instructions, system context, execution rules, or tool-limit messages.
```

Add a test in `backend/tests/test_agents.py` that builds research-agent context and asserts this instruction is in the final execution-rule section. Do not add a string replacement or edit stored legal/source text.

Verify:

```bash
cd backend
.venv/bin/python -m pytest -q tests/test_agents.py tests/test_awareness_api.py tests/test_awareness_failures.py
```

## Step 6 — Full automated checks and Graphify

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q
cd ../frontend
npm run typecheck
npm run build
cd ..
graphify update .
```

No new backend failure is acceptable. The three unchanged annotation failures may remain, but report them exactly and do not call the suite green.

## Step 7 — Isolated browser acceptance

Read and follow `docs/ACCEPTANCE_TESTS.md` section **Isolated browser testing**. Use a temporary vault copy, free ports such as 8100/3100, a cleanup trap, and repository-vault hashes before and after.

Run this exact visible flow:

1. Open the Apex Briefing demo item.
2. Click **Research this further**. Verify rendered Markdown and no internal instruction prefix.
3. Reload. Verify prompt, reply, warnings, and sources persist.
4. Click **Find related matters and decisions**. Verify it uses saved prior context; reload and see both exchanges.
5. Click **Connect this to a matter**, select an unlinked titled matter, reload, and verify both Company connection and chat.
6. Click **Connect this to a decision**, select an unlinked titled decision, reload, and verify both locations.
7. Confirm no IDs were typed, no browser console errors occurred, copied Markdown contains the linked exchanges, and the repository vault hash did not change.

Use the configured real provider for both research prompts. If internal instruction text still appears, report the exact prefix and provider stage. Do not mask it with an ad hoc scrubber.

# Do not

- Do not reset, clean, checkout, or overwrite the dirty worktree.
- Do not edit old generated research files.
- Do not change `tests/test_annotations.py` or demo annotation data.
- Do not add dependencies, SQLite persistence, a new general chat service, embeddings, semantic matching, a resolver agent, or a provider-specific agent.
- Do not make new result metadata required for old files.
- Do not restore separate Research or Connect cards.
- Do not weaken or skip tests.
- Do not commit unless the user asks.

# Blocker policy

Continue through safe, reversible questions by reading the named code and applying the exact smallest design above. Stop and report if a named file or signature differs materially, access or a required dependency is missing, a focused verification fails after diagnosis, instructions conflict, or proceeding needs a destructive action or user decision. Warnings and the three known annotation failures are not blockers.

# Final instruction

Work through the steps in order. Run every step verification immediately. Update `/Users/bharris/Programs/counsel-os-mvp/briefing-chat-reliability.handoff-progress.md` after each step, not at the end. Finish the isolated browser demo and report completed behavior, exact verification output, the known full-suite failures, and anything skipped. If a named file, symbol, or signature differs materially from this supplied context, stop and report instead of adapting around it.
