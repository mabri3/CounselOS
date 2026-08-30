# Guided skills implementation handoff

## 1. Thesis

Prove that a busy lawyer can create a useful reusable skill without understanding prompt design or editing Markdown. The primary path is a short, priority-ordered interview. The lawyer may stop after any of the first five questions. Before a draft is generated, the helper always offers one final optional question: **Is there anything else you want this skill to know or do?** The saved skill is a declarative Markdown instruction layer for one chat turn. It does not create an agent, add tools, schedule work, or execute code.

## 2. Payoff moment

The lawyer answers three short questions, accepts the generated skill, invokes it with a slash command in chat, and sees the answer follow the saved instructions.

## 3. Demo script

1. Open **Skills** from the current top navigation.
2. Select **Help me create a skill**.
3. Enter `I often review product launch requests.`
4. Answer the first three priority-ordered questions.
5. Select **Build it now**.
6. The helper asks: **Is there anything else you want this skill to know or do?**
7. Select **No, build it**.
8. Review the generated name, description, instructions, and slash command.
9. Select **Create skill**. Confirm that `vault/00_System/skills/product-launch-review.md` exists.
10. Open matter `MAT-DEMO-BEACON` and type `/product-launch-review Review this launch request.`
11. Confirm that the answer shows **Applied skill: Product Launch Review**, and that this label survives a page reload.
12. Return to **Skills** and select **Find repeated work**.
13. With a configured real provider and enough chat history, confirm that no more than three suggestions appear, each with two or more supporting user-message examples and a **Build this skill** action.
14. Confirm that no suggestion creates or changes a skill until the lawyer selects **Create skill**.

## 4. Build

### Verified starting point

- Repository: `/Users/bharris/Programs/counsel-os-mvp`.
- The worktree was already dirty before this handoff. Preserve all unrelated changes.
- `frontend/next-env.d.ts` was no longer dirty when this handoff was created.
- `frontend` typecheck and production build passed on 2026-08-28.
- `./scripts/verify.sh` currently stops after four pre-existing backend failures and does not reach the frontend commands:
  - `tests/test_annotations.py::test_annotations_round_trip`
  - `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
  - `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`
  - `tests/test_decisions.py::test_recording_durable_decision_does_not_close_matter`
- The first three failures come from an existing saved Apex annotation in the sample vault. The fourth comes from an existing malformed file under `vault/03_Matters/harbor-support-response/conversations/`.
- Do not delete, rewrite, or “fix” those user-data artifacts in this task. Final verification may retain exactly those four failures. It must add no new failures.

### Fixed product decisions

1. A skill is one Markdown file under `vault/00_System/skills/`.
2. A skill contains only a name, description, enabled flag, and plain-language instructions.
3. A skill cannot grant tools. The active agent's current tool allow-list remains unchanged.
4. One skill can apply to one chat turn. Multiple-skill composition is out of scope.
5. A skill is invoked explicitly as the first token in a message: `/<skill-id> <request>`.
6. Unknown or disabled skill commands return a clear HTTP 400 error before the user message is saved.
7. The original slash-command message is preserved in the Markdown transcript. The model receives the request text after the command.
8. The assistant message stores `applied_skills` metadata. Old messages without that field continue to load.
9. The guided helper is the primary creation path. Manual creation remains available as **Write it myself**.
10. Draft generation never saves a skill. Only **Create skill** writes Markdown.
11. Repeated-work analysis is user-started through **Find repeated work**. It is not automatic or interruptive.
12. Repeated-work analysis uses only user-authored messages. It does not analyze assistant answers.
13. Draft generation degrades to a deterministic useful draft if the provider fails or returns malformed output.
14. Suggestion generation degrades to an empty list plus a warning. It never fabricates supporting examples.

### Priority-ordered question contract

Keep this order. Do not let the model reorder or replace these questions in the MVP. Each choice starts unselected. Each question also offers **Something else**, **Skip**, and **Build it now**.

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
5. `rules` — **What should the skill always do or avoid?** This is multiple choice.
   - Identify the sources it used
   - State important assumptions
   - Ask one focused question when needed
   - Keep the answer short
   - Do not change records without an explicit instruction
   - Something else
6. `anything_else` — **Is there anything else you want this skill to know or do?** This is free text and is always the last step after **Build it now** or after question five. Its actions are **Add this and build it** and **No, build it**.

### Skill Markdown contract

Use this exact shape:

```markdown
---
skill_id: product-launch-review
name: Product Launch Review
description: Reviews a launch request and gives counsel a decision-ready summary.
enabled: true
created_at: '2026-08-28T00:00:00+00:00'
updated_at: '2026-08-28T00:00:00+00:00'
---
# Product Launch Review

Start with a one-sentence recommendation.

Then show the business goal, main concerns, missing facts, and recommended next step.
```

The file path is `00_System/skills/<skill_id>.md`. Use the existing `slugify`, `iso_now`, and `VaultService.write_markdown` functions. Reject creation when the target path already exists. Do not overwrite silently.

### API contract

Add a new router with prefix `/skills` and register it in `backend/app/main.py`.

| Method | Path | Result |
|---|---|---|
| `GET` | `/api/skills` | `{ "skills": SkillDefinition[] }` |
| `GET` | `/api/skills/questions` | `{ "questions": SkillQuestion[] }` in the fixed order above |
| `POST` | `/api/skills/draft` | Unsaved `SkillDraftResponse` from `goal` and `answers` |
| `POST` | `/api/skills/suggestions` | At most three evidence-backed suggestions plus optional warning |
| `POST` | `/api/skills` | Create one Markdown skill; HTTP 201 |
| `GET` | `/api/skills/{skill_id}` | Read one enabled skill; HTTP 404 when absent |
| `PUT` | `/api/skills/{skill_id}` | Update name, description, or instructions |

Define the shared Pydantic models in `backend/app/models/api.py` and matching TypeScript types in `frontend/lib/types.ts`.

### Step 1 — Add the skill registry and record contract

Files:

- Create `backend/app/skills/__init__.py`.
- Create `backend/app/skills/registry.py`.
- Modify `backend/app/models/api.py`.
- Create `backend/tests/test_skills.py`.

Implement:

- `SkillDefinition` dataclass with `skill_id`, `name`, `description`, `instructions`, `enabled`, and `path`.
- `SkillRegistry.list()`, `get()`, `create()`, `update()`, and `parse_invocation(message)`.
- IDs must use lower-case letters, digits, and single hyphens. Use `slugify` for created drafts and reject a requested ID that changes after normalization.
- `parse_invocation` returns `(None, original_message)` for normal messages. For `/skill-id request`, it validates the skill and returns `(skill_id, request)`. For `/skill-id` alone, use `Apply this skill to the active matter and file.` as the model request.
- Creation rejects an existing path. Update keeps `created_at` and replaces `updated_at`.
- Disabled skill files do not appear in `list()` and cannot be invoked. They can be re-enabled by editing their inspectable Markdown file.

Required tests:

- `test_skill_registry_round_trip`
- `test_skill_create_rejects_duplicate_or_changed_id`
- `test_skill_invocation_parses_one_enabled_skill`
- `test_unknown_or_disabled_skill_invocation_fails`
- `test_skill_markdown_cannot_define_tools`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k 'registry or invocation or markdown'
```

Expected: all selected tests pass.

### Step 2 — Add ordered questions, draft generation, and evidence collection

Files:

- Create `backend/app/services/skill_builder.py`.
- Modify `backend/app/services/chat_history.py`.
- Extend `backend/tests/test_skills.py`.
- Extend `backend/tests/test_chat_history.py`.

Implement:

- `SkillBuilderService.questions()` returns the fixed six-question contract in exact priority order.
- `SkillBuilderService.draft(goal, answers)` calls the configured provider only when it is not mock mode.
- Ask a real provider for one JSON object with `skill_id`, `name`, `description`, and `instructions`.
- Parse only a JSON object. Permit one surrounding fenced JSON block. Validate the fields with Pydantic.
- If the provider throws, returns empty text, malformed JSON, missing keys, or invalid values, return a deterministic draft built from the goal and non-empty answers. Include a short `warning`; never return an empty draft.
- Add `ChatHistoryService.recent_user_messages(limit=100)`. Read daily files from `00_System/conversations/*.md` and matter files from `03_Matters/*/conversations/CONV-*.md`. Keep only metadata messages whose role is `user`. Return message ID, content, created time, and a scope label. Sort newest first and cap at the requested limit.
- Do not mutate chat history during analysis.

Required tests:

- `test_skill_questions_are_in_priority_order_and_end_open`
- `test_skill_draft_falls_back_when_provider_output_is_malformed`
- `test_skill_draft_uses_non_empty_answers`
- `test_recent_user_messages_excludes_assistant_messages`
- `test_recent_user_messages_is_bounded_and_newest_first`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py -k 'skill_questions or skill_draft or recent_user_messages'
```

Expected: all selected tests pass.

### Step 3 — Add evidence-backed repeated-work suggestions

Files:

- Modify `backend/app/services/skill_builder.py`.
- Extend `backend/tests/test_skills.py`.

Implement:

- `SkillBuilderService.suggestions()` requests at most three candidates from a real provider.
- Send at most 100 user messages. Truncate each content value to 500 characters.
- Require each candidate to contain `name`, `description`, `goal`, and at least two evidence message IDs.
- Validate every evidence ID against the supplied user-message set. Discard unknown IDs and candidates left with fewer than two valid IDs.
- Return the original stored message excerpts for evidence. Do not trust model-written excerpts.
- In mock mode, return no suggestions and the warning `Repeated-work suggestions require a configured model.`
- On provider error or malformed output, return no suggestions and a useful warning.
- Never create or update a skill from this method.

Required hostile-output tests:

- `test_skill_suggestions_use_only_user_message_evidence`
- `test_skill_suggestions_discard_unknown_evidence_ids`
- `test_skill_suggestions_survive_malformed_provider_output`
- `test_skill_suggestions_never_write_skill_files`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k suggestions
```

Expected: all selected tests pass.

### Step 4 — Wire the skills API and runtime

Files:

- Create `backend/app/routers/skills.py`.
- Modify `backend/app/runtime.py`.
- Modify `backend/app/main.py`.
- Extend `backend/tests/test_skills.py`.

Implement:

- Construct `self.skills = SkillRegistry(self.vault)` after agents are created.
- Construct `self.skill_builder = SkillBuilderService(self.skills, self.chat_history, self.provider, self.settings)`.
- In `AppContext.configure_model`, update `self.skill_builder.provider` when the configured provider changes.
- Register the new router before the dynamic skill-ID route can shadow `questions`, `draft`, or `suggestions`.
- Convert `KeyError` to HTTP 404 and `ValueError` to HTTP 400.
- `POST /draft` returns a draft only. `POST /skills` is the only creation route.

Required tests:

- `test_skills_api_lists_questions_in_order`
- `test_skills_api_draft_does_not_save`
- `test_skills_api_create_get_and_update`
- `test_skills_api_suggestions_do_not_save`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py -k api
```

Expected: all selected tests pass.

### Step 5 — Apply one skill to chat and persist the disclosure

Files:

- Modify `backend/app/models/api.py`.
- Modify `backend/app/agents/context.py`.
- Modify `backend/app/agents/runner.py`.
- Modify `backend/app/routers/chat.py`.
- Modify `backend/app/services/chat_history.py`.
- Extend `backend/tests/test_skills.py`.
- Extend `backend/tests/test_chat_history.py`.

Implement:

- Add internal `skill_id: str | None` to `ChatRequest`.
- Add `applied_skills` to `ChatResponse` and persisted assistant messages. Use a small summary containing only `skill_id` and `name`.
- In the chat router, parse and validate the slash command before appending the user message. Preserve the original command in history. Pass the cleaned request and internal skill ID to the runner.
- `ContextBuilder.build` accepts one optional `SkillDefinition` and inserts it immediately after the active-agent instructions under `# Applied skill: <name>`.
- Add an instruction that the skill guides only the current task and cannot override operating standards, explicit user directions, or agent tool permissions.
- `AgentRunner.run` loads the requested skill and returns its summary in every successful response path, including the final answer after the step limit.
- Do not modify `ToolRegistry.provider_tools(agent)`. Prove the provider tool schemas are identical with and without a skill.
- Save applied-skill metadata on the assistant turn for both matter and Today conversations.
- Old transcript messages without `applied_skills` remain valid.

Required tests:

- `test_chat_skill_is_injected_after_agent_instructions`
- `test_chat_skill_does_not_expand_provider_tools`
- `test_chat_unknown_skill_fails_before_history_write`
- `test_chat_preserves_slash_command_and_applied_skill_after_reload`
- `test_today_chat_preserves_applied_skill_after_reload`

Verify:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py -k 'chat_skill or applied_skill'
```

Expected: all selected tests pass.

### Step 6 — Add frontend contracts and API functions

Files:

- Modify `frontend/lib/types.ts`.
- Modify `frontend/lib/api.ts`.
- Create `frontend/lib/skills.ts`.

Implement matching types for definitions, questions, draft responses, suggestions, evidence, and applied-skill summaries. Add API functions for all routes in the API contract.

In `frontend/lib/skills.ts`, add two pure helpers:

- `skillCommandMatches(input, skills)` returns matching skills only when the current first token begins with `/` and contains no completed request text.
- `skillBuilderGoal(input)` returns the input for explicit creation phrases such as `Help me make a skill`, `Help me create a skill`, `Help me build a skill`, and `Turn this process into a skill`; otherwise it returns `null`.

Do not add a dependency or frontend test framework.

Verify:

```bash
cd frontend && npm run typecheck
```

Expected: TypeScript exits with code 0.

### Step 7 — Build the guided Skills page

Files:

- Create `frontend/app/skills/page.tsx`.
- Create `frontend/components/SkillBuilder.tsx`.
- Modify `frontend/components/AppShell.tsx`.
- Modify `frontend/app/globals.css` only for focused skill-builder styles that existing classes cannot express.

Before editing, read `frontend/AGENTS.md` and:

- `frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

Implement:

- Add **Skills** between **Agents** and **Automations** in the existing navigation.
- Reuse the existing `admin-shell`, `admin-rail`, `admin-main`, `admin-body`, `admin-foot`, `agent-rail-item`, `chat-card`, `question-choice`, button, input, and typography patterns.
- Primary entry: **Help me create a skill**.
- Secondary entry: **Write it myself**.
- The guided flow starts with one plain-language goal field.
- Ask one fixed question at a time. No choice starts selected.
- **Skip** advances without an answer.
- **Build it now** always opens the final `anything_else` question instead of calling the draft endpoint immediately.
- After question five, automatically open `anything_else`.
- The final question supports free text, **Add this and build it**, and **No, build it**.
- The review screen exposes editable name, description, instructions, and generated command before saving.
- **Create skill** calls the create endpoint once and then shows the saved path and slash command.
- Existing skills appear in the left rail and can be selected, edited, and saved.
- **Find repeated work** displays at most three suggestions. Each card shows stored evidence excerpts and a **Build this skill** action. This action pre-fills the helper but does not save.
- Display provider warnings without hiding a useful draft.
- Keep keyboard focus visible. Use buttons for actions and labels for fields.

Verify:

```bash
cd frontend && npm run typecheck && npm run build
```

Expected: both commands pass, and the build output includes route `/skills`.

### Step 8 — Add chat discovery, builder routing, and applied-skill labels

Files:

- Create `frontend/components/SkillCommandMenu.tsx`.
- Modify `frontend/components/ChatPanel.tsx`.
- Modify `frontend/components/TodayChat.tsx`.
- Modify `frontend/app/globals.css` only when existing styles are insufficient.

Implement:

- Both composers load the enabled skills list.
- When the current first token starts with `/`, show matching commands with name and description.
- Selecting a result inserts `/<skill-id> ` and returns focus to the textarea.
- Add a small **Build a skill** link near each composer. It opens `/skills`.
- Before sending, use `skillBuilderGoal`. When it returns a value, navigate to `/skills?goal=<encoded text>` instead of creating a chat turn.
- Show **Applied skill: <name>** above each assistant reply when `applied_skills` is present.
- The label must render from both the immediate chat response and reloaded history.
- Preserve current attachments, cards, message history, keyboard submission, and busy behavior.

Verify:

```bash
cd frontend && npm run typecheck && npm run build
```

Expected: both commands pass.

### Step 9 — Update product documentation and prove the complete slice

Files:

- Modify `docs/API.md`.
- Modify `docs/ARCHITECTURE.md`.
- Modify `docs/ACCEPTANCE_TESTS.md`.
- Modify `docs/PRD.md` only to add the approved skills behavior; do not rewrite unrelated product scope.
- Update `skills-helper.handoff-progress.md` after every completed check.

Run focused backend proof:

```bash
cd backend && .venv/bin/pytest -q tests/test_skills.py tests/test_chat_history.py tests/test_agents.py
```

Expected: all tests in these files pass.

Run frontend proof:

```bash
cd frontend && npm run typecheck && npm run build
```

Expected: both commands pass.

Run the full baseline comparison:

```bash
./scripts/verify.sh
```

Acceptable result: the same four baseline backend failures listed above and no new failures. If all tests pass because the unrelated sample-vault state changed outside this task, record that fact; do not restore the failures.

Start the app and walk the demo script in the browser. Use `MAT-DEMO-BEACON`, not the Harbor matter with malformed user data. Confirm:

- priority order;
- early **Build it now**;
- final `anything_else` question;
- draft without save;
- explicit creation;
- slash autocomplete;
- applied-skill label before and after reload;
- no change to available tools;
- user-started suggestions show only stored user evidence;
- suggestions do not save automatically;
- existing chat attachments and cards still work.

Then run:

```bash
graphify update .
git diff --check
```

Expected: Graphify completes, and `git diff --check` exits with code 0.

### Blocker policy

Continue through normal reversible uncertainty by reading the named code and choosing the smallest implementation consistent with this plan. Stop and report only when:

- a named file or signature differs materially from this verified plan;
- a required dependency or command is unavailable;
- a focused new test still fails after diagnosis;
- proceeding would overwrite unrelated user work;
- an irreversible action or a product decision not answered here is required.

Do not stop because the four recorded baseline failures remain unchanged. Do not weaken or skip new tests.

For every backend step, add the named tests first and run the focused command once to observe a relevant failure. Then implement the step and rerun the same command to pass. Record both observations in the progress work log. A collection failure caused by a not-yet-created module counts as the initial failing observation.

### Do not

- Do not spawn subagents. This handoff is for one medium-capability agent.
- Do not add a plugin framework, executable skill packages, arbitrary Markdown code, new tool handlers for skills, embeddings, a vector database, automatic background suggestion scanning, scheduled skill analysis, multiple-skill composition, skill versioning, publishing, approvals, a marketplace, auth, tenancy, or permissions.
- Do not let skills change tool permissions.
- Do not analyze assistant messages for repeated-work suggestions.
- Do not auto-create or auto-update skills.
- Do not add a second chat system or a persistent builder-session store.
- Do not add dependencies or redesign the application shell.
- Do not reset, revert, clean, or delete unrelated worktree files.
- Do not modify the saved Apex annotation, Harbor conversation, or inbox schedule to make baseline tests pass.
- Do not commit, push, deploy, or send external messages.

## 5. Parked backlog

- Automatic repeated-work scanning: add only after user-started scans frequently produce accepted skills.
- Quiet Today-page suggestions: add only after the manual scan proves useful and non-disruptive.
- Multiple skills per chat turn: add only after users repeatedly need combinations.
- Matter-level default skills: add only after users repeatedly invoke the same skill on one matter.
- Skill versions and rollback: add only after real edits require restoration.
- Skill testing, scoring, and comparison labs: add only when normal chat trials are insufficient.
- Shared libraries, imports, and marketplaces: add only after multiple users exchange skills manually.
- Executable skill assets: keep outside this system. New executable capabilities remain approved Python tools.
