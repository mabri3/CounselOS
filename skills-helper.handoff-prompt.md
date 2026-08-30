You are the sole implementation agent for Counsel OS. Use medium reasoning. Work in `/Users/bharris/Programs/counsel-os-mvp`.

Implement the complete guided-skills slice below. Do not stop after planning, backend scaffolding, or a partial UI. Keep working through the ordered steps until the focused tests, frontend build, browser demo, progress file, and graph update are complete.

Do not spawn subagents. Do not create or manage other threads.

## Goal

Let a busy lawyer create a reusable skill without knowing prompt design. The primary creation path is a short interview with five questions in fixed priority order. The user can select **Build it now** early. Before generating a draft, always ask one final optional question: **Is there anything else you want this skill to know or do?** A saved skill is a Markdown instruction layer that applies to one explicit chat turn. The Skills page can also perform a user-started review of recent user messages and suggest evidence-backed skills. Suggestions never save or change anything without explicit approval.

The user-visible proof is: answer three questions, accept the final optional question, save a skill, invoke it with `/skill-id` in matter chat, and see an **Applied skill** label that survives reload.

## Resume protocol

Use `skills-helper.handoff-progress.md` as durable task memory.

Before starting:

1. Read the complete root `AGENTS.md`.
2. Read `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/ARCHITECTURE.md`, `docs/BUILD_PLAN.md`, `docs/ACCEPTANCE_TESTS.md`, `current.md`, `decisions.md`, `skills-helper.handoff-plan.md`, and `skills-helper.handoff-progress.md`.
3. Run `git status --short`. Preserve all unrelated user work.
4. Because `graphify-out/graph.json` exists, run:

   ```bash
   graphify query "guided skills priority questions skill builder chat slash invocation repeated work suggestions"
   ```

5. Start at the first pending progress item. Do not redo a step marked `done`.

After EACH step:

1. Run the exact verification for that step.
2. Immediately update only that step in `skills-helper.handoff-progress.md` from pending to done.
3. Add one short dated work-log entry with the verification result.

If a completed step's verification now fails, stop and report. Do not reapply the step blindly. Do not batch progress updates at the end.

## Verified baseline

This baseline was observed on 2026-08-28:

- `frontend`: `npm run typecheck && npm run build` passed. The build uses Next.js 16.3.3 and React 19.2.8.
- `./scripts/verify.sh` stopped after backend tests with 70 passed and these four pre-existing failures:
  - `tests/test_annotations.py::test_annotations_round_trip`
  - `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
  - `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`
  - `tests/test_decisions.py::test_recording_durable_decision_does_not_close_matter`
- The annotation failures come from an existing saved Apex annotation in the copied sample vault.
- The decision failure comes from an existing malformed Markdown conversation under `vault/03_Matters/harbor-support-response/conversations/`.
- The worktree already contained changes to `graphify-out/cache/last_query_stamp`, `vault/00_System/schedules/inbox-watcher.md`, and an untracked Harbor conversations directory.

Do not edit, delete, reset, or hide those unrelated artifacts. Final full verification may retain exactly those four failures. It must add no new failures.

## Product and architecture constraints

- Reduce the lawyer's cognitive load.
- Use short, plain labels.
- Keep Markdown as the source of truth. Do not add a database table for skills.
- Keep SQLite disposable.
- Skills are declarative instructions. Never execute Markdown code.
- A skill cannot grant tools or change the active agent's tool allow-list.
- One skill applies to one chat turn.
- One explicit slash command invokes a skill: `/<skill-id> <request>`.
- Draft generation never saves. Only **Create skill** writes the Markdown file.
- Repeated-work review runs only when the user selects **Find repeated work**.
- Analyze user-authored messages only. Never analyze assistant answers for habits.
- Suggestions must show stored source messages. Never accept model-invented evidence.
- Do not add dependencies, a workflow engine, a builder-session store, embeddings, a vector database, background scans, a new agent framework, or a plugin system.
- Preserve the current application shell, Agents page patterns, chat behavior, attachments, cards, editor, typography, spacing, and color tokens.
- Keep files focused and generally under 300 lines. If `frontend/app/skills/page.tsx` grows, move the interview into `frontend/components/SkillBuilder.tsx` instead of leaving a large page.

## Current codebase context

Read every named file before editing it. These facts have been verified and should guide the implementation.

### Vault and IDs

`backend/app/services/vault.py` provides safe, atomic methods:

```python
class VaultService:
    def exists(self, relative_path: str | Path) -> bool: ...
    def read_markdown(self, relative_path: str | Path) -> dict[str, Any]: ...
    def write_markdown(
        self,
        relative_path: str | Path,
        content: str,
        metadata: dict[str, Any] | None = None,
    ) -> str: ...
```

`backend/app/utils/ids.py` already provides:

```python
def slugify(value: str, *, fallback: str = "item") -> str: ...
```

`backend/app/utils/time.py` provides `iso_now()`.

### Agent loading and context

`backend/app/agents/registry.py` uses a dataclass plus hot loading from Markdown. Copy its direct style; do not create a generic registry framework.

`backend/app/agents/context.py` currently builds context in this order:

```python
parts = [
    "# Operating standards",
    self.agents.global_standards(),
    f"# Active agent: {agent.name}\n{agent.instructions}",
]
```

The applied skill belongs immediately after the active-agent instructions. Add an explicit boundary saying that the skill guides only the current task and cannot override operating standards, explicit user directions, or tool permissions.

### Agent runner and tool permissions

`backend/app/agents/runner.py` currently does this:

```python
agent = self.agents.get(request.agent_id)
messages = [{"role": "system", "content": self.context_builder.build(agent, ...)}]
messages.extend(message.model_dump() for message in request.history[-12:])
messages.append({"role": "user", "content": request.message})
provider_tools = self.tools.provider_tools(agent)
```

Keep `self.tools.provider_tools(agent)` unchanged. Skills must not influence it. `AgentRunner.run` has several `ChatResponse(...)` return paths. Every successful path must return the same `applied_skills` summary.

### Chat router and persistence

`backend/app/routers/chat.py::chat` validates the request, saves the user turn, calls `context.runner.run(...)`, and saves the assistant turn. Parse and validate a slash command before the first append. Save the original command text, but pass the cleaned request plus an internal `skill_id` to the runner.

`backend/app/services/chat_history.py` stores message dictionaries in Markdown metadata. Current message values include:

```python
{
    "message_id": new_id("MSG"),
    "role": role,
    "content": content,
    "created_at": now,
    "trace": trace or [],
    "cards": cards or [],
    "attachments": attachments or [],
    "card_action": card_action,
}
```

Add `applied_skills` with a default empty list. Old records lack it and must still load.

Direct callers of chat-history append methods exist in:

- `backend/app/routers/chat.py`
- `backend/app/routers/matters.py::_start_intake`
- `backend/tests/test_chat_history.py`

Add the new parameter with a default so these callers remain compatible.

### Runtime and provider

`backend/app/runtime.py::AppContext.__init__` constructs `ChatHistoryService`, the provider, agents, tools, `ContextBuilder`, and `AgentRunner`. Add the skill registry and builder explicitly. Do not add a dependency-injection library.

`AppContext.configure_model` currently replaces the provider on `self.research` and `self.runner`. It must also replace `self.skill_builder.provider`.

The provider interface is:

```python
async def complete(
    self,
    messages: list[dict[str, Any]],
    tools: list[dict[str, Any]] | None = None,
) -> ProviderReply: ...
```

`ProviderReply.content` is uncontrolled external output. Test malformed and missing JSON. Do not weaken the fallback.

### Router registration

`backend/app/main.py` imports router modules and includes each with prefix `/api`. Add `skills.router`. In the new router, define `/questions`, `/draft`, and `/suggestions` before `/{skill_id}`.

### Frontend patterns

`frontend/components/AppShell.tsx` has one `links` array. Add `{ href: "/skills", label: "Skills" }` between Agents and Automations.

`frontend/app/agents/page.tsx` is the design reference for the Skills administration page. Reuse its `admin-shell`, `admin-rail`, `admin-main`, `admin-scroll`, `admin-body`, `admin-foot`, `agent-rail-item`, fields, and buttons.

`frontend/components/ChatPanel.tsx` and `frontend/components/TodayChat.tsx` both send:

```typescript
sendChat({ message, agent_id: "counsel-copilot", ... })
```

Do not change the selected agent. Add slash discovery and builder routing around the existing composer behavior.

`frontend/lib/api.ts` uses one private generic `request<T>()` function. Add skill functions there. Do not create another HTTP client.

`frontend/lib/types.ts::ChatHistoryMessage` and `ChatResponse` are the places to add applied-skill summaries.

Before frontend edits, read `frontend/AGENTS.md` and this installed Next.js guide in full:

`frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Fixed question contract

Do not reorder, dynamically replace, or add questions. Each choice starts unselected. Questions 1–5 have **Something else**, **Skip**, and **Build it now**.

1. `job` — **What should this skill help you do?**
   - Review or analyze something
   - Draft something
   - Compare options or documents
   - Find or organize information
   - Create a checklist or plan
   - Something else
2. `success` — **What should a good result help you do next?**
   - Make a decision
   - Give advice or a recommendation
   - Send or present a response
   - Identify questions or missing information
   - Complete a repeatable process
   - Something else
3. `inputs` — **What will you usually give this skill to work with?**
   - The active matter and its files
   - A selected document
   - Text entered in chat
   - Company context and playbooks
   - Prior decisions
   - Something else
4. `output` — **What should the result look like?**
   - A short recommendation
   - An issue list
   - A draft response or document
   - A comparison table
   - A checklist or action plan
   - Something else
5. `rules` — **What should the skill always do or avoid?** Multiple choice.
   - Identify the sources it used
   - State important assumptions
   - Ask one focused question when needed
   - Keep the answer short
   - Do not change records without an explicit instruction
   - Something else
6. `anything_else` — **Is there anything else you want this skill to know or do?** Free text. This always appears after **Build it now** or after question five. It has **Add this and build it** and **No, build it**.

## Markdown contract

Write skills only as:

```markdown
---
skill_id: product-launch-review
name: Product Launch Review
description: Reviews a launch request and gives counsel a decision-ready summary.
enabled: true
created_at: '<ISO timestamp>'
updated_at: '<ISO timestamp>'
---
# Product Launch Review

<plain-language instructions>
```

Path: `00_System/skills/<skill_id>.md`.

Reject duplicate creation. Never overwrite an existing skill silently.

## API contract

Implement:

- `GET /api/skills` -> `{ "skills": [...] }`
- `GET /api/skills/questions` -> ordered questions
- `POST /api/skills/draft` -> unsaved useful draft plus optional warning
- `POST /api/skills/suggestions` -> at most three suggestions plus optional warning
- `POST /api/skills` -> create, HTTP 201
- `GET /api/skills/{skill_id}` -> detail
- `PUT /api/skills/{skill_id}` -> update

Use Pydantic models in `backend/app/models/api.py` and matching TypeScript types in `frontend/lib/types.ts`.

## Ordered implementation plan

### Step 1: Skill registry and record models

Create:

- `backend/app/skills/__init__.py`
- `backend/app/skills/registry.py`
- `backend/tests/test_skills.py`

Modify:

- `backend/app/models/api.py`

Implement a `SkillDefinition` dataclass and `SkillRegistry.list`, `get`, `create`, `update`, and `parse_invocation`.

Rules:

- IDs are lower-case letters, digits, and single hyphens.
- Use `slugify`. Reject a caller-supplied ID if normalization changes it.
- `parse_invocation` returns `(None, original_message)` for ordinary messages.
- For `/skill-id request`, return the ID and cleaned request.
- For `/skill-id` alone, cleaned request is `Apply this skill to the active matter and file.`
- Disabled skills are absent from normal lists and cannot be invoked.
- Disabled skills stay out of normal lists and cannot be invoked. They can be re-enabled by editing their inspectable Markdown file.
- Skill metadata cannot define tools. Ignore unknown metadata and never copy it into agent permissions.
- Preserve `created_at`; update `updated_at`.

Add tests named:

- `test_skill_registry_round_trip`
- `test_skill_create_rejects_duplicate_or_changed_id`
- `test_skill_invocation_parses_one_enabled_skill`
- `test_unknown_or_disabled_skill_invocation_fails`
- `test_skill_markdown_cannot_define_tools`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k 'registry or invocation or markdown'
```

Then update the Step 1 progress line.

### Step 2: Ordered questions, safe draft generation, and recent user messages

Create:

- `backend/app/services/skill_builder.py`

Modify:

- `backend/app/services/chat_history.py`
- `backend/tests/test_skills.py`
- `backend/tests/test_chat_history.py`

Implement:

- `SkillBuilderService.questions()` with the exact six questions above.
- `SkillBuilderService.draft(goal, answers)`.
- Use the real provider only outside mock mode.
- Ask for one JSON object with `skill_id`, `name`, `description`, `instructions`.
- Accept raw JSON or one fenced `json` block.
- Validate with Pydantic.
- On provider exception, empty content, malformed JSON, missing keys, or invalid values, generate a deterministic non-empty draft from the goal and non-empty answers. Return a warning.
- `ChatHistoryService.recent_user_messages(limit=100)` reads `00_System/conversations/*.md` and `03_Matters/*/conversations/CONV-*.md`, keeps only role `user`, returns message ID, content, created time, and scope, sorts newest first, and applies the limit.
- Do not write chat or skill files from either read operation.

Add tests named:

- `test_skill_questions_are_in_priority_order_and_end_open`
- `test_skill_draft_falls_back_when_provider_output_is_malformed`
- `test_skill_draft_uses_non_empty_answers`
- `test_recent_user_messages_excludes_assistant_messages`
- `test_recent_user_messages_is_bounded_and_newest_first`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py -k 'skill_questions or skill_draft or recent_user_messages'
```

Then update the Step 2 progress line.

### Step 3: Evidence-backed suggestions

Modify `backend/app/services/skill_builder.py` and `backend/tests/test_skills.py`.

Implement `SkillBuilderService.suggestions()`:

- Use at most 100 user messages.
- Truncate each content field to 500 characters before sending it to the provider.
- Ask for at most three JSON candidates containing `name`, `description`, `goal`, and evidence message IDs.
- Each accepted candidate needs at least two valid IDs from the supplied message set.
- Discard unknown IDs.
- Populate visible evidence excerpts from stored messages, not provider text.
- Mock mode returns `[]` and `Repeated-work suggestions require a configured model.`
- Provider errors or malformed output return `[]` plus a warning.
- Never create or update a skill here.

Add hostile-output tests named:

- `test_skill_suggestions_use_only_user_message_evidence`
- `test_skill_suggestions_discard_unknown_evidence_ids`
- `test_skill_suggestions_survive_malformed_provider_output`
- `test_skill_suggestions_never_write_skill_files`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k suggestions
```

Then update the Step 3 progress line.

### Step 4: Skills API and runtime wiring

Create `backend/app/routers/skills.py`.

Modify:

- `backend/app/runtime.py`
- `backend/app/main.py`
- `backend/tests/test_skills.py`

Wire:

```python
self.skills = SkillRegistry(self.vault)
self.skill_builder = SkillBuilderService(
    self.skills,
    self.chat_history,
    self.provider,
    self.settings,
)
```

Update `self.skill_builder.provider` inside `AppContext.configure_model`.

Define static router paths before `/{skill_id}`. Convert `KeyError` to 404 and `ValueError` to 400. Draft and suggestion endpoints do not save.

Add tests named:

- `test_skills_api_lists_questions_in_order`
- `test_skills_api_draft_does_not_save`
- `test_skills_api_create_get_and_update`
- `test_skills_api_suggestions_do_not_save`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k api
```

Then update the Step 4 progress line.

### Step 5: Chat invocation and persisted disclosure

Modify:

- `backend/app/models/api.py`
- `backend/app/agents/context.py`
- `backend/app/agents/runner.py`
- `backend/app/routers/chat.py`
- `backend/app/services/chat_history.py`
- `backend/tests/test_skills.py`
- `backend/tests/test_chat_history.py`

Implement:

- Internal `skill_id: str | None` on `ChatRequest`.
- `applied_skills` summary list on `ChatResponse` and assistant-message metadata. Summary fields are `skill_id` and `name` only.
- Parse and validate the first slash command in the router before saving the user turn.
- Save the original slash command. Pass cleaned text plus internal skill ID to the runner.
- Inject one skill immediately after active-agent instructions.
- Return applied-skill data from every successful runner exit.
- Keep provider tools based only on the agent.
- Persist disclosure for matter and Today chat.
- Old messages without `applied_skills` load as before.

Add tests named:

- `test_chat_skill_is_injected_after_agent_instructions`
- `test_chat_skill_does_not_expand_provider_tools`
- `test_chat_unknown_skill_fails_before_history_write`
- `test_chat_preserves_slash_command_and_applied_skill_after_reload`
- `test_today_chat_preserves_applied_skill_after_reload`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py -k 'chat_skill or applied_skill'
```

Then update the Step 5 progress line.

### Step 6: Frontend types, API, and pure helpers

Modify:

- `frontend/lib/types.ts`
- `frontend/lib/api.ts`

Create:

- `frontend/lib/skills.ts`

Add matching skill, question, draft, suggestion, evidence, and applied-skill types. Add one API function per route using the existing `request<T>()`.

Add:

- `skillCommandMatches(input, skills)`: show matches only while the first token is an unfinished slash command.
- `skillBuilderGoal(input)`: recognize only explicit phrases `Help me make a skill`, `Help me create a skill`, `Help me build a skill`, and `Turn this process into a skill`. Return the full input as the prefilled goal; otherwise return `null`.

Do not add a test framework or dependency.

Verify:

```bash
cd frontend && npm run typecheck
```

Then update the Step 6 progress line.

### Step 7: Guided Skills page

Before editing, read `frontend/AGENTS.md` and the installed Next.js server/client component guide named above.

Create:

- `frontend/app/skills/page.tsx`
- `frontend/components/SkillBuilder.tsx`

Modify:

- `frontend/components/AppShell.tsx`
- `frontend/app/globals.css` only for small missing styles

Implement:

- Add Skills between Agents and Automations.
- Reuse the current admin layout and visual classes.
- Primary action: **Help me create a skill**.
- Secondary action: **Write it myself**.
- Read optional `?goal=` and prefill the initial goal.
- Ask one fixed question at a time with no default selection.
- `Skip` advances.
- `Build it now` goes to `anything_else`; it does not call draft immediately.
- After question five, go to `anything_else`.
- Final free-text actions are **Add this and build it** and **No, build it**.
- Show editable draft fields before save.
- **Create skill** is the only write.
- Existing skills appear in the rail and can be edited.
- **Find repeated work** renders at most three suggestions with stored evidence and **Build this skill**. It pre-fills the helper only.
- Display warnings without dropping useful drafts.
- Preserve keyboard focus and accessible labels.

Verify:

```bash
cd frontend && npm run typecheck && npm run build
```

The build output must include `/skills`.

Then update the Step 7 progress line.

### Step 8: Chat slash menu, helper routing, and applied labels

Create `frontend/components/SkillCommandMenu.tsx`.

Modify:

- `frontend/components/ChatPanel.tsx`
- `frontend/components/TodayChat.tsx`
- `frontend/app/globals.css` only if needed

Implement in both composers:

- Load enabled skills.
- When the unfinished first token starts with `/`, show matching command, name, and description.
- Selecting one inserts `/<skill-id> ` and restores textarea focus.
- Add a small **Build a skill** link to `/skills`.
- Before sending, call `skillBuilderGoal`. If it matches, navigate to `/skills?goal=<encoded full input>` and do not create a chat turn.
- Render **Applied skill: <name>** above assistant replies from both immediate responses and reloaded history.
- Preserve attachments, question cards, message history, keyboard submit, busy state, and Today read-only history.

Verify:

```bash
cd frontend && npm run typecheck && npm run build
```

Then update the Step 8 progress line.

### Step 9: Documentation, full proof, browser acceptance, and graph

Update:

- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/ACCEPTANCE_TESTS.md`
- the relevant skills sections of `docs/PRD.md`

Do not rewrite unrelated product documentation.

Run focused backend proof:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py tests/test_agents.py
```

All tests in these files must pass.

Run frontend proof:

```bash
cd frontend && npm run typecheck && npm run build
```

Both must pass.

Run the full comparison:

```bash
./scripts/verify.sh
```

Accept exactly the four recorded baseline failures and no new failures. Do not modify unrelated sample-vault data to make the command green.

Start backend and frontend with the repository's documented commands. Use the browser and matter `MAT-DEMO-BEACON`. Walk this exact acceptance script:

1. Open Skills.
2. Start **Help me create a skill** with `I often review product launch requests.`
3. Confirm question IDs appear in order: `job`, `success`, `inputs`.
4. Select **Build it now** after question three.
5. Confirm `anything_else` appears next.
6. Select **No, build it**.
7. Confirm an editable draft appears and no skill file exists yet.
8. Save as `product-launch-review`.
9. Confirm the saved path is `00_System/skills/product-launch-review.md`.
10. Open Beacon chat and type `/`. Confirm the saved skill is offered.
11. Send `/product-launch-review Review this launch request.`
12. Confirm **Applied skill: Product Launch Review** appears.
13. Reload and confirm the label remains.
14. Confirm normal chat attachments and existing cards still work.
15. Select **Find repeated work**. With mock mode, confirm the honest configured-model warning and no fabricated suggestion. If a real provider is configured, confirm every suggestion has at least two stored user-message examples.
16. Confirm no suggestion creates or modifies a skill without **Create skill**.

Record exact observations in `skills-helper.handoff-progress.md` and `docs/ACCEPTANCE_TESTS.md`.

Then run:

```bash
graphify update .
git diff --check
```

Both must complete successfully. Update the final progress items.

## Blocker policy

Do not ask routine questions. Read the named source and make the smallest reversible choice that matches this prompt.

Stop and report only if:

- a named path, function, or signature differs materially from the verified context;
- a required command or dependency is unavailable;
- a focused new test fails after diagnosis;
- proceeding would overwrite unrelated user work;
- instructions materially conflict;
- an irreversible action or a user-owned product decision is required.

Do not stop because the four recorded baseline failures remain unchanged. Do not weaken, skip, or delete tests to continue.

For every backend step, add the named tests first and run the focused command once to observe a relevant failure. Then implement the step and rerun the same command to pass. Record both observations in the progress work log. A collection failure caused by a not-yet-created module counts as the initial failing observation.

## Do not list

- Do not spawn subagents.
- Do not commit, push, deploy, or send external messages.
- Do not reset, revert, clean, or delete unrelated files.
- Do not modify the existing Apex annotation, Harbor conversation files, or inbox schedule to change the baseline.
- Do not add auth, tenancy, permissions, a queue, a worker service, embeddings, a vector store, a plugin system, executable skill packages, arbitrary Markdown code, skill-specific tools, automatic suggestion scanning, scheduled scans, multiple skills per turn, matter defaults, versions, approvals, publishing, imports, sharing, or a marketplace.
- Do not let skills add or remove tools.
- Do not analyze assistant messages for repeated work.
- Do not auto-create or auto-update a skill.
- Do not add a second chat system or persistent builder sessions.
- Do not add dependencies, a new design system, or a broad visual refresh.
- Do not change unrelated navigation labels or matter behavior.

## Completion report

Return:

1. The user-visible result.
2. The main files changed.
3. Exact focused-test, frontend-build, and browser proof.
4. The full verification result, including whether the same four baseline failures remained.
5. Any limitation or unverified behavior.
6. Confirmation that `skills-helper.handoff-progress.md`, product documentation, and Graphify were updated.
7. Confirmation that no unrelated user data was changed.

Work through the steps in order. Run each verification immediately. Update the progress file after each step. If a named file, symbol, or signature differs materially from this prompt, stop and report instead of adapting around it.
