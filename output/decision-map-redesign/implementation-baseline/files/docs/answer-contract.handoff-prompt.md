# Task: add a hot-editable Answer Contract to Themis.ai

You are a coding agent working in the `counsel-os-mvp` repository. Work directly
in the repo on the current branch.

## Goal

Add `00_System/Answer.md` — a single Markdown document, editable from Settings,
injected into every agent turn, hot-reloaded with no restart. It defines the
required *shape* of a finished answer.

Its first tenet is a section called **"What would change this"**: every
substantive answer must end with a ranked list of the working assumptions, open
forks, and unexamined scope that the answer rests on.

The strategic point: a lawyer's professional fear is not being wrong — it is not
being able to bound what they missed. This contract makes the edge of the
system's work visible so the lawyer can be responsible for a bounded thing.

**This is a presentation contract, never a gate.** It must not introduce a
verifier, a confidence threshold, a citation gate, a refusal, or any delay to the
answer. `AGENTS.md` forbids all of those and this task does not change that. The
full answer always ships first, at full strength; the contract only governs what
is appended to it.

You are implementing a specification. Every design decision below has already
been made.

## Before you start: resume protocol

1. Read `docs/answer-contract.handoff-progress.md`. Steps marked `done` are
   already applied — do **not** redo them. Begin at the first step not marked
   `done`.
2. After each step, run that step's verification and immediately update only that
   step's line. Mark it `done` when it passes. If a new task-caused failure remains
   after focused diagnosis, mark it `FAILED: <what happened>` and stop. If the
   same failure was recorded in the baseline, note it as pre-existing and
   continue unless it prevents verification of this task.
3. Do not commit or stage any file. The worktree already contains user changes,
   including changes in files this task must edit. Preserve them and leave this
   task's diff for review.

Every step is idempotent — each says what the file should end up looking like.

Before editing application files, read `AGENTS.md`, `CODEX_HANDOFF.md`,
`docs/PRD.md`, and `current.md`. Run the current focused tests before Step 1 so
you can distinguish a task regression from a pre-existing failure.

The worktree is dirty. Treat every existing change as user-owned. Read each
target immediately before editing it. Never reset, restore, clean, or overwrite
unrelated work. If a target already differs from the context below, preserve the
existing change and stop only if the difference makes the specified final state
unsafe or ambiguous.

Baseline command:

```bash
cd backend
.venv/bin/pytest tests/test_agents.py tests/test_settings.py tests/test_vault_management.py
```

Record the result in the progress file before editing Step 1 files.

## Context you must not get wrong

These were verified against the current code. Violating any one of them breaks
the app or the user's existing vaults.

1. **Never add `00_System/Answer.md` to `CORE_FILES`** in
   `backend/app/vault_manager.py`. `validate()` raises
   `"The vault is missing X"` for every entry, and the user has four existing
   vaults without this file. Adding it there makes them all unloadable.
2. **New-vault content lives in `backend/app/blank_vault_template/manifest.json`**,
   a `{relative_path: file_content}` string map — *not* as loose files in
   `blank_vault_template/00_System/` (that directory holds only `agents/` and
   `tools/`). `Soul.md` and `Agents.md` are entries in that JSON.
3. **Inject the contract BEFORE the `# Execution rule` block** in
   `ContextBuilder.build_system`. `backend/tests/test_agents.py` does
   `rsplit("# Execution rule", maxsplit=1)[1]`; injecting after it breaks that test.
4. **Do not put `immutable: true` in the frontmatter.** `VaultService.read_document`
   sets `editable = not immutable`, and `PUT /api/files` rejects non-editable files.
5. **Existing vaults will not have this file.** The service must be self-healing:
   the first agent turn or Settings GET that reads a missing file writes the
   default and returns it. Do not write a migration script or a startup hook.
6. `VaultService.read_text` has no caching, so hot reload is already free. Do not
   add a cache, a watcher, or an invalidation hook.
7. Settings sections are defined **client-side** in `frontend/lib/stubs.ts` as
   `DEFAULT_SETTINGS`, and `frontend/app/settings/page.tsx` special-cases certain
   section ids to render custom panels. Follow the existing `company` section
   pattern exactly.
8. `VaultService.write_markdown(path, content, metadata)` expects a Markdown body
   and a separate metadata mapping. Never pass a complete frontmatter-bearing
   document as `content`; doing so creates nested frontmatter.
9. `AgentRegistry.global_standards()` and `VaultService.read_text()` read from the
   active vault without content caching. The Answer Contract must use the same
   active-vault service instance as the current `AppContext`.

## Step 1: the default contract text and its service

Create `backend/app/services/answer_contract.py`.

It holds these constants:

- `DEFAULT_ANSWER_CONTRACT` — the complete canonical document below, including
  frontmatter. This is the value copied into the new-vault manifest.
- `DEFAULT_ANSWER_CONTRACT_CONTENT` — the parsed Markdown body only.
- `DEFAULT_ANSWER_CONTRACT_METADATA` — the parsed frontmatter mapping.
- `MAX_ANSWER_CONTRACT_CHARS = 12000` — the maximum saved body length. Reject a
  longer body instead of silently truncating it during prompt assembly.

Parse the canonical document once with the repository-local `frontmatter`
adapter. Do not duplicate the default body or metadata by hand.

Add an `AnswerContractService` with `PATH = "00_System/Answer.md"` and three
methods:

- `read()` — if the file is absent, write the default first; then return
  `{"path", "content", "metadata", "updated_at", "is_default", "max_content_chars"}`.
  Read the stored file with `read_markdown()`. `content` is the body without
  frontmatter. `is_default` is `True` when the normalized stored body equals
  `DEFAULT_ANSWER_CONTRACT_CONTENT`.
- `write(content)` — save via `self.vault.write_markdown(self.PATH, content, metadata)`,
  preserving existing frontmatter metadata. If the file is absent, use
  `DEFAULT_ANSWER_CONTRACT_METADATA`. Reject content longer than
  `MAX_ANSWER_CONTRACT_CHARS` with `ValueError`. Empty content is valid. Return
  the same shape as `read()`.
- `reset()` — write `DEFAULT_ANSWER_CONTRACT_CONTENT` with
  `DEFAULT_ANSWER_CONTRACT_METADATA`, then return the same shape as `read()`.

Follow `backend/app/services/settings.py` for construction style
(`def __init__(self, vault: VaultService)`).

The default file content is exactly:

```markdown
---
record_type: answer_contract
version: 0.1.0
---
# Answer contract

The shape a finished answer must take. Edit this file to change how Themis.ai
answers. Changes apply to the next message. Nothing needs restarting.

## Standing rule

This contract governs presentation, never permission. The full answer always
ships first, at full strength. Nothing here is a gate, a confidence threshold, or
a reason to withhold, hedge, shorten, delay, or refuse an answer.

The section below is co-equal work product, not metadata on the answer. An edge
item maps a fork in the reasoning or the boundary of the work. It is not merely a
task to complete.

## What would change this

End every substantive answer with a section under this heading. It is never empty
and never omitted.

Three kinds of item:

- **Working assumption** — a fact the analysis leaned on that is not established.
  Name what was assumed, and what the answer becomes if it is wrong.
- **Open fork** — a question whose answer sends the matter down materially
  different paths. State both paths.
- **Not examined** — what was in scope but not read, searched, or checked. Name
  the specific document, source, or jurisdiction.

Rules:

- Rank by how much the answer moves, not by how easily the item resolves.
- Three to six items. If only one surfaces, the reasoning has not been examined.
- Every item names a specific fact, a specific fork, or a specific unread source.
- Never write a hedge that would be true of any matter. Banned: "further research
  may be advisable", "consult local counsel", "laws may change", "this is not
  legal advice", "results may vary".
- Prefer the unwelcome item. The one worth naming is the one the lawyer has not
  thought of yet.
- If the vault could have answered an item but was not consulted, say so plainly.
```

**Verify:** from `backend/`, run:

```bash
.venv/bin/python -c "from app.services.answer_contract import DEFAULT_ANSWER_CONTRACT, DEFAULT_ANSWER_CONTRACT_CONTENT, DEFAULT_ANSWER_CONTRACT_METADATA, AnswerContractService"
```

## Step 2: inject it into every turn

Wire one shared `AnswerContractService` into the runtime:

1. In `backend/app/runtime.py`, create `self.answer_contract =
   AnswerContractService(self.vault)` immediately after `self.settings_store`.
2. Pass `self.answer_contract` to `ContextBuilder` when `self.agent_context` is
   created.
3. In `backend/app/agents/context.py`, add an `answer_contract:
   AnswerContractService` constructor parameter and store it. Do not create a
   second service or read a different vault.

Then update `ContextBuilder.build_system`:

**2a.** After the existing `Soul.md` block and **before** the
`parts.append("# Execution rule\n...")` call, add:

```python
answer_contract = self.answer_contract.read()["content"].strip()
if answer_contract:
    parts.append(
        "The following editable answer contract defines the required shape of a "
        "finished answer. It takes priority over conflicting or older workspace "
        "guidance about presentation. It never changes permissions and never gates, "
        "delays, shortens, or replaces the answer itself.\n\n"
        f"{answer_contract}"
    )
```

`read()` creates the default for an existing vault that lacks the file. Because
the service reads the Markdown body on each call, saved changes apply to the next
agent turn without a restart. Do not add a cache, watcher, or invalidation hook.

The blank-body check is deliberate: clearing the textarea and saving disables
the editable contract block for A/B comparison. A missing file is not the off
state; it is initialized with the default. An existing empty file remains empty.

**2b.** In the same method, in the `# Execution rule` string, replace:

```
Surface assumptions or missing facts when they matter, but do not block on them.
```

with this conditional instruction:

```
When an answer contract is present above, follow it for how to present assumptions, open forks, and unexamined scope. When it is empty, surface assumptions or missing facts when they matter. Never let them block, delay, or shorten the answer itself.
```

Change nothing else in that string — `test_agents.py` asserts on its final
sentence verbatim.

**2c.** In `vault/00_System/Soul.md`, replace principle 5 with:

```markdown
5. **Do not turn uncertainty into paralysis.** Deliver the strongest useful first pass, then map material assumptions, open forks, and unexamined scope per the active answer contract. If the contract is empty, state material assumptions and gaps briefly.
```

Make an equivalent edit to the shorter `00_System/Soul.md` entry inside
`backend/app/blank_vault_template/manifest.json`. Preserve its compact style; do
not replace the complete manifest value with the longer repository-vault file.

**2d.** In `vault/00_System/Agents.md`, replace:

```markdown
- Treat missing facts as work items, not automatic blockers.
```

with:

```markdown
- When the active answer contract has content, treat its ranked map of assumptions, forks, and unexamined scope as co-equal work product, not a hedge or task list. Missing facts can also become work items when action is useful, but they are never automatic blockers.
```

Make an equivalent compact edit to the `00_System/Agents.md` entry in
`backend/app/blank_vault_template/manifest.json`. Do not copy the full answer
contract into `Agents.md`; `Answer.md` is the single editable source of truth for
its detailed wording.

**Verify:** `cd backend && .venv/bin/pytest` — all tests pass, including
`test_research_agent_execution_rule_forbids_instruction_echo`.

## Step 3: the API

In `backend/app/routers/settings.py`, add three routes following the existing
`/company` routes as the pattern:

- `GET /api/settings/answer-contract` → `context.answer_contract.read()`
- `PUT /api/settings/answer-contract` → body `{content: str}` → `.write(content)`
- `POST /api/settings/answer-contract/reset` → `.reset()`

Add response/request models to `backend/app/models/api.py` matching the style of
`CompanyProfileResponse`:

- request: `content: str`; the service is the authoritative length check, so do
  not import a service constant into `models/api.py`;
- response: `path: str`, `content: str`, `metadata: dict[str, Any]`,
  `updated_at: float`, `is_default: bool`, and `max_content_chars: int`.

Map a service `ValueError` to HTTP 422. Step 2 already wires
`answer_contract` into `AppContext`; reuse that instance.

Do not route this through `PUT /api/files` — that path calls `index.rebuild()` on
every save, which is wasted work on a large vault.

**Verify:** add the API round-trip test specified in Step 5. With the backend
running, this optional smoke check must return HTTP 200 and the response body:

```bash
curl -fsS localhost:8000/api/settings/answer-contract | head -c 200
```

## Step 4: ship it to new vaults

Add a fifth entry to `backend/app/blank_vault_template/manifest.json` under
`files`, keyed `00_System/Answer.md`, whose value is exactly
`DEFAULT_ANSWER_CONTRACT`.

Do **not** touch `CORE_FILES` or `CORE_TREES` in `backend/app/vault_manager.py`.

**Verify:** from `backend/`, use `.venv/bin/python` to load the manifest and
assert that the entry equals `DEFAULT_ANSWER_CONTRACT`. Add the same assertion as
a real test in Step 5.

## Step 5: tests

Add `backend/tests/test_answer_contract.py` covering:

1. `read()` on a vault with no `Answer.md` creates it and returns `is_default: True`.
2. `write()` persists, and a second `read()` returns the new body with
   `is_default: False`.
3. `reset()` restores the default.
4. `write()` on a vault where the file is still absent uses the default metadata
   and does not fail.
5. A body longer than `MAX_ANSWER_CONTRACT_CHARS` is rejected without changing
   the stored file.
6. `build_system` on a vault where the file is absent creates the default and
   contains `# Answer contract`.
7. `build_system` output does **not** contain `# Answer contract` when the stored
   body is blank.
8. The `# Answer contract` block appears **before** `# Execution rule` in the
   built system prompt.
9. Hot reload: build once, write a distinctive changed rule, build again without
   reconstructing `AppContext`, and confirm only the second prompt contains it.
10. The `manifest.json` entry for `00_System/Answer.md` equals
   `DEFAULT_ANSWER_CONTRACT` (drift guard).
11. An existing vault that lacks the file still passes `VaultManager.validate()`.
12. A `TestClient` GET/PUT/reset round trip returns the declared response shape,
    persists the PUT body, restores the default, and returns HTTP 422 for an
    over-limit body.

**Verify:** `cd backend && .venv/bin/pytest` — all green.

## Step 6: the Settings panel

**6a.** `frontend/lib/types.ts` — add an `AnswerContract` type
(`path`, `content`, `metadata`, `updated_at`, `is_default`,
`max_content_chars`).

**6b.** `frontend/lib/api.ts` — add `getAnswerContract()`, `saveAnswerContract(content)`,
`resetAnswerContract()`. Follow the existing `getCompanyProfile` / `saveCompanyProfile`
style.

**6c.** `frontend/lib/stubs.ts` — add a section to `DEFAULT_SETTINGS`:

```ts
{
  id: "answer-contract",
  label: "Answer contract",
  title: "Answer contract",
  sub: "The required shape of a finished answer. Changes apply to the next message.",
  rows: [],
}
```

Place it directly after the `agents` section.

**6d.** `frontend/app/settings/page.tsx` — add `const answerSection = section === "answer-contract";`
next to the existing `companySection` line, include it in the `activeDirty`
exclusion list, and render a custom panel when it is active:

- Load `getAnswerContract()` in the existing Settings `load()` call. Store both
  the saved response and a separate draft string so dirty state is based only on
  `draft !== saved.content`.
- Include the answer-contract state in the loading guard. A failed contract load
  must use the existing Settings error surface.

- A monospace `<textarea>` bound to the contract body — at least 24 rows, full
  width, `font-family: var(--mono)`. **Do not use `MarkdownRichEditor`**; the user
  must see literal text, not rendered Markdown. Set `maxLength` from
  `max_content_chars` and show the current character count.
- A **Save** button (disabled when unchanged).
- A **Reset to default** button behind the existing confirmation pattern used by
  the vault controls. Show it when the saved contract is not the default or the
  current draft differs from the saved default, so an unsaved edit can also be
  restored without reloading the page.
- A muted line showing last-saved time, and a note that an empty contract disables
  the block.
- After save or reset, replace both saved state and draft state with the API
  response so the panel is no longer dirty.
- Exclude `answerSection` from the existing generic `admin-foot` condition. The
  custom panel must not show a second disabled Settings Save/Discard footer.

Use existing tokens and classes from `globals.css`. Add no page-local colours.

**Verify:** `cd frontend && npm run typecheck && npm run build` both pass. In the
browser, confirm there is only one Save control for this section and that an
over-limit value cannot be entered.

## Step 7: end-to-end check

1. Start the app on an existing vault that has no `00_System/Answer.md`. Ask a
   substantive question. Confirm the default file is created lazily and the reply
   ends with **What would change this** carrying three to six specific items.
2. Open **Settings → Answer contract**. Confirm the body loads without YAML
   frontmatter, the character limit is visible, and the panel has one Save area.
3. Add one distinctive presentation rule, save, and ask another substantive
   question **without restarting anything**. Confirm the next answer follows that
   rule.
4. Clear the textarea and save. Confirm the next built system prompt omits the
   editable Answer Contract block. A model answer can still state material gaps
   briefly under the remaining baseline guidance; do not require two
   nondeterministic answers to be otherwise identical.
5. Reset to default. Confirm the default body and `is_default` state return, then
   ask again and confirm the default **What would change this** shape returns.
6. Load each of the user's existing vaults through **Settings → Vaults** and
   confirm each still opens. Restore the original active vault when finished.
7. Walk the applicable chat, Settings, Markdown-rendering, and vault-loading checks
   in `docs/ACCEPTANCE_TESTS.md`. Record what was observed.
8. Record the experiment result in plain language: whether at least one item made
   the lawyer think “I had not considered that,” and whether the **Not examined**
   items made the work feel more bounded or more anxious. This is an n=1 signal,
   not proof that the product thesis is validated.

## Definition of done

- `cd backend && .venv/bin/pytest` passes.
- `cd frontend && npm run typecheck && npm run build` pass.
- Step 7 and the applicable browser acceptance checks are walked manually.
- All four of the user's existing vaults still load from Settings → Vaults.
- `git status` shows no unintended changes to `vault/03_Matters/` or
  `.counsel-os/active-vault.json`.
- `graphify update .` completes after the application changes.
- No task file is staged or committed.

## Out of scope

Do not build: a new record type, an `edge` field on `update_matter_intake`, a
`facts.md` migration, a matter-page panel, changes to `research.py`, or a settings
toggle. Do not change `AGENTS.md`. Do not add a verifier, critic, confidence gate,
or citation gate.
