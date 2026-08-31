# Implementation prompt — Finish core intake, Polaris research, and per-agent model routing

You are the Sol Medium implementation coordinator for Counsel OS. Use Codex
`gpt-5.6-sol` with `medium` reasoning. Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Use `$parallel-plan-executor` to run the required Sol Medium worker pool.
Use `$senior-mindset`, `$practical-simplicity`, `$focused-fix`, and
`$demo-first` if they are available. Do not return a plan-only answer.
Implement, integrate, test, review, and walk the complete result in the
browser. Do not silently replace the required parallel execution with serial
work.

## Goal

Finish every unfinished Counsel OS MVP item while leaving only the explicit
`Later` backlog in `current.md`. Search all planning, status, progress,
acceptance, and application-marker sources. Do not assume the named defects
are the complete list. The complete result must:

1. replace the fixed intake card with a contextual, adaptive LLM intake;
2. open a new matter directly in Chat with Themis while intake runs in the background;
3. preserve intake messages and source-linked matter records;
4. generate and safely revise a useful dossier;
5. use Polaris as the primary external source for on-demand matter research;
6. let each agent use its own provider, model, and reasoning-effort combination;
7. add OpenCode Go, Codex CLI, and Antigravity CLI beside Mock and OpenAI-compatible;
8. complete pending automated and browser acceptance work;
9. correct stale and false implementation-plan status without erasing history;
10. prove in `docs/MVP_CLOSURE_AUDIT.md` that no non-Later item remains pending, failed, unchecked, unverified, omitted, or moved to another plan.

The payoff moment is this: a lawyer assigns models to the Intake and Research agents, submits a detailed BSA/AML request, lands directly in Chat with Themis, sees a request-specific understanding and question from the selected Intake model, answers it, watches privacy-safe Polaris research run, and then opens an updated dossier with sources, assumptions, open questions, and the next counsel action.

## Required agent configuration

```yaml
parallel:
  optimize_for: quality
  max_agents: 5
  workers:
    - name: sol-medium-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 3
    - name: sol-medium-reviewer
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 1
    - name: sol-high-escalation
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
  review:
    policy: risk-based
```

The coordinator is also `gpt-5.6-sol` with `medium` reasoning and does not
count against `max_agents`. Dispatch three Sol Medium implementers
concurrently for each listed three-chunk wave. Reuse the same workers across
waves when practical. Do not collapse the waves into serial execution. Use
fewer only when a named chunk is proven to be a no-op and record that evidence
before dispatch. Use one separate read-only Sol Medium reviewer for the
accepted combined implementation. The reviewer must not be an implementer and
must not edit files.

The Sol High pool is conditional. Use it only when the Sol Medium reviewer
identifies a material question and cannot determine a concrete answer after
inspecting the relevant code, tests, and current evidence. The Medium reviewer
must pause that question and return the structured escalation request below.
The coordinator then dispatches one read-only Sol High agent for that exact
question. Do not use Sol High for ordinary implementation, duplicate review,
or general exploration.

If agent dispatch is unavailable, stop and report that the required parallel
execution cannot start. Do not continue serially without user approval.

## Resume protocol

Before starting:

1. Read `docs/core-intake-provider-completion.handoff-progress.md`.
2. Read `docs/MVP_CLOSURE_AUDIT.md`.
3. Do not redo a step marked `done`. Start at the first pending step.
4. If a completed step's verification now fails, stop and report the mismatch instead of blindly reapplying edits.
5. After each step, run its verification and immediately change only that progress line to `- [x] ... — done`.
6. On failure, change the line to `— FAILED: <short evidence>` and follow the blocker policy below. Do not batch progress updates at the end.

This repository is intentionally dirty. Run `git status --short` before editing. Preserve every unrelated change. Never reset, revert, discard, clean, or overwrite user work. Do not commit, push, deploy, open a pull request, or send data outside the systems named in this prompt.

## Read first

Read these files completely before changing application code:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/DESIGN_LANGUAGE.md`
5. `current.md`
6. `contextmap.md`
7. `decisions.md`
8. `docs/BUILD_PLAN.md`
9. `docs/ACCEPTANCE_TESTS.md`
10. `docs/core-intake-provider-completion.handoff-plan.md`
11. `docs/core-intake-provider-completion.handoff-progress.md`
12. `docs/matter-led-mvp.handoff-plan.md`
13. `docs/matter-led-mvp.handoff-progress.md`
14. `docs/live-agent-ux-repair.handoff-plan.md`
15. `docs/live-agent-ux-repair.handoff-progress.md`
16. `docs/continuous-legal-awareness.handoff-progress.md`
17. `docs/IMPLEMENTATION_STATUS.md`
18. `docs/MVP_CLOSURE_AUDIT.md`
19. `frontend/AGENTS.md`, if present, before frontend edits

Then enumerate and read every current planning/status source:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
rg --files docs | rg '(PLAN|STATUS|handoff-plan|handoff-progress|ACCEPTANCE)'
rg -n --glob '*.md' --glob '!graphify-out/**' '(^- \[ \])|(FAILED|pending|not implemented|not started|TODO|FIXME|placeholder|stub)' current.md CODEX_HANDOFF.md docs
rg -n --glob '!graphify-out/**' --glob '!vault/**' --glob '!backend/.venv/**' --glob '!frontend/node_modules/**' '(TODO|FIXME|NotImplemented|not implemented|placeholder|stub)' backend frontend
```

Read each match in context. Do not treat examples, historical prose, generated
artifacts, or explicit Later text as active defects without checking their
meaning. Add every real or ambiguous unfinished item to
`docs/MVP_CLOSURE_AUDIT.md` before implementation.

Because `graphify-out/graph.json` exists, run this before broad source search:

```bash
graphify query "intake chat runs agent provider model routing Polaris matter research dossier"
```

Use `graphify path` or `graphify explain` only when the first query does not answer a relationship question.

## Current facts that must guide the work

- `backend/app/routers/matters.py::_start_intake` creates a fixed QuestionCard with the context-free text `Here is what I understand you are asking. Is that correct?` and hard-coded `1 of 3`. It does not call an LLM.
- `frontend/app/page.tsx` pushes a new matter to `/matters/{id}` with no chat selection.
- `frontend/components/MatterWorkspace.tsx` initializes the middle section as `overview`.
- `frontend/components/ChatPanel.tsx` submits every matter turn with `agent_id: "counsel-copilot"`.
- `backend/app/routers/chat.py` currently contains deterministic intake interception. The dirty live-agent changes make skip, stop, and clarification bypass the Intake Agent. Replace only the parts that conflict with adaptive intake; preserve unrelated live-agent fixes.
- `backend/app/runtime.py` builds one global provider. `AgentRunner`, research, Skill Builder, Company interview, and timeout fallback share it.
- `backend/app/agents/registry.py::AgentDefinition` has no provider/model/effort fields.
- `backend/app/providers/base.py::LLMProvider.complete(messages, tools)` is the provider boundary to preserve.
- `backend/app/services/chat_runs.py` already provides durable in-process background chat runs, interruption marking, polling, retry, and partial-output preservation. Reuse it for initial intake.
- `backend/app/services/matter_records.py` and `backend/app/services/dossier.py` exist. Reuse them. Do not create a second intake store or dossier store.
- `backend/app/intelligence/polaris.py::PolarisIntelligenceProvider` is already implemented for Watches. It uses the fixed Themis Lime brain and `polaris-advisor`, bounded HTTP, supplied-citation labels, and no model discovery or tools.
- `backend/app/services/research.py` currently uses `SearchService` plus `research-agent`. It does not use Polaris for matter research.
- Company Settings, fact supersession support, dossier storage, document upload, Draft/Final work product, work state, and Continuous Legal Awareness code already exist. Verify and connect them; do not rebuild them.

## Plan truth

Treat current code and observed tests as the source of truth. Preserve plan history, but correct false status claims:

- `docs/BUILD_PLAN.md` has useful product requirements, but its “execution has not started” statement is stale.
- `docs/matter-led-mvp.handoff-progress.md` falsely says intake acceptance passed. Add a dated correction note. Do not erase the original claim.
- `docs/CONTINUOUS_LEGAL_AWARENESS_BUILD_PLAN.md` says implementation did not start, while its progress file says complete. Re-audit before changing that header.
- `docs/matter-work-state.handoff-progress.md` says pending even though later work implemented it. Mark it superseded after verification. Do not implement a second work-state system.
- `docs/live-agent-ux-repair.handoff-progress.md` has one pending browser payoff test. Complete it.
- `docs/document-review-word-like.handoff-progress.md` preserves an old three-test failure. Resolve that historical status from a fresh full test run.
- `docs/IMPLEMENTATION_STATUS.md` is a historical scaffold report. Audit its implemented, lightweight, not-implemented, and work-in-progress claims against current code and the canonical Later list.

## Scope

Implement the active intake-to-dossier workflow, the provider/model work in
this prompt, Polaris matter research, and every non-Later unfinished item
found in the closure audit.

Every audit item must finish in exactly one state:

1. **Verified complete** with current automated or browser evidence.
2. **Verified historical/superseded** with current evidence and the replacing behavior or plan.
3. **Later** with an exact match to an existing Later category in `current.md`.

Do not add a fourth disposition. Do not create a new Later category, a new
active plan, or a new Next item to avoid implementation. If a discovered item
does not match Later and is not obsolete, it is part of this build.

Leave these items parked under Later:

- Slack, Jira, Asana, and email intake;
- research providers other than Polaris and the current native search path;
- broader retrieval improvements;
- selection-based rewrite/diff;
- source-layout-preserving document editing, imported review round trips, native PDF editing, and full collaboration;
- court-grade citation validation, citator integration, and guaranteed comprehensive research;
- authentication, SSO, enterprise RBAC, ethical walls, legal holds, cloud tenancy, Tauri, team permissions, and collaboration;
- durable/distributed queues, cloud databases, object storage, embeddings, and multi-instance scheduling;
- multi-agent voting, reviewer veto, autonomous final decisions, broader legal modules, and full contract lifecycle management;
- arbitrary shell execution, executable Markdown tools, and a general plugin marketplace;
- token streaming and broad visual polish.

The earlier Later item “native provider adapters” is superseded by this prompt. The earlier generic “commercial legal research integration” item becomes “additional research providers after Polaris is validated.”

## Architecture and safety rules

- Markdown remains authoritative. SQLite remains a disposable index.
- Keep the current Next.js, FastAPI, vault, and in-process task architecture.
- Keep `LLMProvider.complete(messages, tools)` as the small provider execution contract.
- Do not add a runtime provider plugin system, queue, broker, worker service, event database, evidence graph, embeddings, auth, cloud tenancy, or new agent framework.
- Do not add legal-perfection gates, verifier agents, multi-agent voting, citation gates, confidence gates, or empty refusals.
- Preserve the separation of recommendation, approval, delivery, durable decision, and closure.
- Keep file operations inside the configured vault. Provider credential and CLI-session handling is runtime configuration, never vault data.
- Never print, persist, return, or log secrets. Never read or copy `.env` values from PlayMaker, AltBench, or DeepBench.
- Do not import PlayMaker, AltBench, or DeepBench at runtime. Inspect and adapt behavior into focused Counsel OS code.
- Do not send private matter or company context to Polaris.
- Do not expose Codex, Antigravity, or OpenCode shell, file, browser, app, or plugin tools. The models may request only the typed tools allowed by the selected Counsel OS agent.
- Do not silently fall back when an agent explicitly selects an unavailable provider/model. Show a clear error and preserve existing files.
- Preserve non-empty provider output when structured parsing, tool decoding, citation formatting, search, or persistence of a secondary artifact fails.

## Provider contract to implement

Use exactly these provider IDs:

| ID | User label | Readiness source |
|---|---|---|
| `mock` | Mock (offline) | always ready |
| `openai_compatible` | configured endpoint label | `LLM_API_KEY` plus `/models` |
| `opencode_go` | OpenCode Go | `OPENCODE_GO_API_KEY` or `OPENCODE_API_KEY` plus `/models` |
| `codex` | Codex CLI | installed CLI and existing `codex login` session |
| `antigravity_cli` | Antigravity CLI | installed CLI and signed-in `agy` session |

Create one focused provider registry/router. It owns provider construction, model catalog lookup, readiness, cleanup, and resolving an immutable run selection. Do not make routers or frontend code instantiate providers.

Each catalog provider object must include:

- `id`;
- `label`;
- `readiness`: `ready`, `missing`, `unavailable`, or `development_only`;
- `readiness_detail` with no secret data;
- `models`, each with ID, label, and supported reasoning efforts.

Catalog failure keeps a saved provider/model visible as unavailable. It never selects a replacement model.

Implement Counsel OS-owned adapters by inspecting these proven local references:

- OpenCode Go:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/opencode_api.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/providers/opencode_api.py`
- Antigravity CLI:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/antigravity_cli.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/providers/antigravity_cli.py`
- Codex CLI:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/chatgpt_codex.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/codex.py`
- Catalogs and effort values:
  - `/Users/bharris/Programs/PlayMaker/playmaker/provider_models.py`
  - `/Users/bharris/Programs/PlayMaker/playmaker/model_selection.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/settings/catalog.py`
- AltBench's use of the PlayMaker boundary:
  - `/Users/bharris/Documents/ChatGPT/AltBench/src/altbench/providers.py`

Do not copy an entire framework. Adapt the smallest needed behavior.

### OpenCode Go

- Use the direct OpenCode Go API at the proven endpoint.
- Resolve only `OPENCODE_GO_API_KEY` or `OPENCODE_API_KEY` from the process environment.
- Query `/models` for the catalog.
- Support the actual protocol for each accepted catalog model. Reject unknown protocol/model combinations instead of guessing from arbitrary names.
- Preserve native tool-call responses and normalize them to `ProviderToolCall`.
- Bound response size, timeout, tool names, arguments, and malformed JSON.

### Codex CLI

- Use a persistent `codex app-server` in an isolated temporary working directory.
- Use the signed-in ChatGPT/Codex session. Do not ask for or persist a token.
- Query `model/list` for models and supported efforts.
- Disable external Codex shell, browser, apps, plugins, MCP, file, image, and web-search tools.
- Send only Counsel OS context and typed tool schemas.
- Normalize model-requested tool calls into `ProviderToolCall`.
- Permit one one-shot `codex exec` fallback only when app-server failure occurs before a turn starts. Never replay a turn after it may have produced a tool request or mutation.
- Bound input, output, events, time, cancellation, and process cleanup.

### Antigravity CLI

- Run `agy` headless with `--output-format json`, `--sandbox`, disabled slash commands, a selected model, bounded timeout, and an isolated temporary directory.
- Parse either useful text or exactly one validated Counsel OS tool request.
- Query `agy models` for the catalog.
- Close on timeout/cancellation and reject oversized or malformed output.
- Antigravity 1.1.13 places the prompt in process arguments. The Settings and Agent UI must show: `Development only — do not use confidential matter data.` Do not weaken or hide this warning.

## Per-agent model selection

Extend agent Markdown frontmatter, `AgentDefinition`, create/update API models, API responses, frontend types, and Agent editor with optional:

```yaml
provider: codex
model: gpt-5.6-luna
reasoning_effort: medium
```

Empty or absent values mean `Use workspace default`. Existing agents and user-created agents remain valid. The workspace default remains in Settings for non-agent LLM work and agents with no override.

At the start of each run, persist this immutable snapshot on the run record:

```yaml
agent_id: intake-agent
provider: codex
model: gpt-5.6-luna
reasoning_effort: medium
```

A setting change affects the next run only. It does not change an active run.

Change `AgentRunner` so every normal call and the final answer-only call use the same resolved provider. Change `ChatRunService._timeout_result` to use the run snapshot, not `context.provider`. Schedules, Briefing research, matter research, and intake already run through agents and must inherit their selected models. Company interview and Skill Builder remain on the workspace default because they are not agent runs.

Keep a small fake-provider injection seam for tests. Do not require global monkeypatching across all services.

In `frontend/app/agents/page.tsx`, add a visible Model section before Advanced controls with:

- Provider, including `Use workspace default`;
- Model from the selected provider's catalog;
- Reasoning effort supported by that model;
- readiness and safety text.

Save to that agent's Markdown file. Preserve the current dirty-switch warning. Show all providers in Settings with honest readiness, even when missing. Do not add secret inputs.

## Real intake behavior

Delete the fixed `_start_intake` card. Do not replace it with a fixed questionnaire or legal taxonomy.

When `POST /api/matters` creates a matter:

1. Keep `request.md` immutable.
2. Create one conversation with `conversation_kind: intake`, `intake_state: active`, and `active_agent_id: intake-agent`.
3. Add the exact submitted request as the first user message and link it to the immutable request source.
4. Queue a durable `ChatRunService` request with `agent_id="intake-agent"`.
5. Return the matter plus intake conversation/run identifiers without waiting for the LLM.
6. From Today, navigate directly to the matter's Chat view and begin polling that run.
7. Show `Themis is reading your request…` while the initial run is queued or running.

The first assistant turn must include a short factual summary of the actual request before asking whether it is correct. For example, a BSA/AML request must mention the actual product, transaction or customer behavior, timing, and requested decision supplied in the request. The old context-free question is forbidden.

Use one typed intake-turn tool, following the current typed-tool pattern. Do not parse arbitrary Markdown into cards. The tool accepts validated data for:

- working-ask summary;
- reported facts;
- issues/workstreams;
- assumptions;
- material missing facts;
- human-dependent questions;
- public research questions;
- at most one next QuestionCard;
- active or complete intake state;
- optional provisional dossier orientation.

The tool returns record changes plus at most one QuestionCard and one compact MatterUpdateCard. Its backend execution context receives the trusted request or saved user-message source ID. The model never supplies or invents source IDs.

After each answer, call the Intake Agent again with the exact transcript and current matter records. It must ask one material question at a time. Choices may be single, multiple, or free text. Use 3–7 plain-language choices where helpful, plus Something else, Skip, and No more questions. Suggested is a label, never a preselection.

Show `X of Y` only when the Intake Agent supplied a real current plan. Otherwise show `Follow-up`. The count may change after an answer. Never hard-code a total.

- `Skip`: save no answer, then let the Intake Agent choose the next question.
- `No more questions`: save no answer, mark intake complete, and queue the best available dossier/research finalization. It must not block useful work.
- `Partly` or `Something else`: preserve the detail and let the Intake Agent update the working ask. Do not intercept it with a fixed response.
- A conflict: ask the conflict question next. Only the user's clear answer resolves it.

While `intake_state` is active, ChatPanel sends to `intake-agent`. When complete, set `active_agent_id: counsel-copilot`. Do not infer this only from matter stage.

## Matter records and dossier

Reuse `MatterRecordService` and `DossierService`.

- Facts extracted from the immutable request link to that request source.
- Facts from later answers link to stable user-message IDs.
- Repeated statements add support.
- Meaning-changing corrections add a replacement fact and supersede the prior fact.
- Assumptions remain labeled.
- Conflicts retain both statements, sources, question, response, resolution, and affected output.
- Undo withdraws records created by the action. It does not delete sources, messages, or events.
- Technical IDs remain hidden from normal lawyer-facing UI.

Create a provisional `dossier.md` after the first successful Intake Agent turn, even before all questions are answered. Label unconfirmed material honestly. Update it after material answers and useful research. Use the existing content-hash guard so background work never overwrites a newer lawyer edit. Keep reviewable revisions.

The dossier must contain:

1. Matter summary
2. Decision question
3. Material facts
4. Assumptions
5. Issues and workstreams
6. Open questions
7. Research and source support
8. Options or working recommendation
9. Next counsel action
10. Work product links

If a model, citation, or formatting step fails, save and show every useful non-empty section and label the missing support. Do not replace useful output with a generic failure.

## Polaris matter research

Polaris is an external public legal-research source. It is not a chat-model provider and must not appear in the agent model dropdown.

Extend the existing Polaris code for one-shot matter research. Reuse its fixed endpoint, `polaris-advisor`, bounded network behavior, response parsing, and Supplied citation status. Do not create a persistent temporary Watch for each matter question.

Create one small public research-query model. Refactor `OutboundQueryPolicy` so Watches and one-shot matter research share the deterministic private-data validation. Allowed outbound data includes public legal questions, jurisdictions, regulators, courts, public entities explicitly classified as public, and public source URLs. Reject:

- matter IDs;
- emails;
- vault or local paths;
- company aliases not explicitly public;
- private product names;
- internal document excerpts;
- distinctive private fragments.

The Intake Agent identifies researchable and human-dependent questions locally. It proposes public query candidates. The deterministic policy is the final authority before any Polaris call. If validation fails, do not call Polaris. Keep the local question and show a privacy warning.

Polaris returns public observations and supplied citations. Then run `research-agent` on that agent's chosen provider/model to synthesize Polaris material with private company and matter context locally. Never send that private context back to Polaris.

Bound automatic intake research to three material questions per cycle. Reuse existing in-process research runs, status polling, interruption handling, packet writing, and dossier updates. Automatic research must not change the matter stage. Manual research keeps its current explicit stage behavior.

## Required implementation order

### Step 0 — Preflight and baseline

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "intake chat runs agent provider model routing Polaris matter research dossier"
./scripts/verify.sh
cd frontend
npm run check:workspace-ux
```

Record exact results in the progress file. Do not treat warnings or historical plan text as current failures.

Populate `docs/MVP_CLOSURE_AUDIT.md` before changing application code. Its
source inventory must include every file found by the discovery commands. Its
item matrix must contain every unchecked, failed, stale, ambiguous, or real
placeholder item. Assign an owner step and expected proof to every non-Later
row. Step 0 is not done while a matching source has not been read or an item
has no row.

### Step 1 — Freeze shared contracts

Freeze provider catalog/readiness shapes, agent override fields, run selection snapshot, intake conversation metadata, matter-create response additions, and typed intake-turn input/output before parallel work. Keep old API fields compatible.

Add focused contract tests that fail against the current code and pass only after the new behavior exists.

### Step 2 — Provider adapters and catalogs

Implement OpenCode Go, Codex, and Antigravity in focused files under `backend/app/providers/`. Add one shared conformance test suite plus provider-specific tests. Do not continue until text, tool-call, malformed-output, timeout/cancellation, cleanup, and catalog tests pass.

### Step 3 — Per-agent backend routing

Extend agent persistence and route AgentRunner, timeout fallback, schedules, intake, and research through immutable per-run selections. Add restart and different-agent/different-provider tests.

### Step 4 — Provider and Agent UI

Update Settings and Agents screens, API clients, and TypeScript types. Verify save, reload, switching, unavailable states, and the Antigravity safety warning.

### Step 5 — Background adaptive intake

Replace `_start_intake`, wire ChatRunService, route new matters directly to chat, implement the typed intake turn, and remove conflicting deterministic interception. Prove the BSA/AML first question includes request facts and no hard-coded total.

### Step 6 — Records and dossier

Connect trusted source IDs, corrections, conflicts, supersession, undo, provisional dossier creation, material revisions, and the content-hash guard. Prove useful partial dossier delivery.

### Step 7 — Polaris matter research

Add privacy-safe one-shot public research, local Research Agent synthesis, bounded async runs, status, packet persistence, and dossier updates. Prove no private data enters the Polaris request.

### Step 8 — Hostile and assembled tests

Add tests for all hostile external outputs and the full assembled lifecycle. Run the complete backend and frontend checks.

### Step 9 — Browser acceptance and documentation truth

Use an isolated temporary vault. Walk the full demo below. Finish the pending
live-agent payoff test. Re-audit every unchecked non-Later item in
`docs/ACCEPTANCE_TESTS.md`, including Continuous Legal Awareness and
vault/workspace behavior. Fix observed non-Later defects. Mark only directly
observed results complete.

Add dated correction or supersession notes to stale progress documents. Update `current.md`, `contextmap.md`, `decisions.md`, `docs/PRD.md`, `docs/BUILD_PLAN.md`, `.env.example`, API/provider documentation, and `graphify`. Do not erase historical claims.

### Step 10 — Exhaustive closure audit and final state

Finish every row in `docs/MVP_CLOSURE_AUDIT.md`. For code that already
exists, run current proof. For a stale item, add a dated correction or
supersession note and cite the replacing behavior. For unfinished non-Later
work, implement and verify it. For Later, cite the exact matching category in
`current.md`.

Run all final verification after the final code change. If the audit finds a
defect after the browser walk, fix it and repeat every affected automated and
browser check. Reconcile the PRD, build plan, implementation status,
acceptance file, all progress files, `current.md`, `contextmap.md`, and
`decisions.md`.

Step 10 passes only when:

- every audit source is marked audited;
- every discovered item has one row and direct evidence;
- no row is pending, failed, unverified, omitted, or deferred to a new plan;
- every non-Later item is verified complete or verified historical/superseded;
- every Later row cites an existing category in `current.md`;
- every active non-Later checkbox in acceptance and progress files is checked;
  an obsolete checkbox is replaced by or annotated with a dated
  historical/superseded disposition and evidence;
- every line in the canonical progress file is done;
- no other progress file presents a non-Later pending or failed item as active;
- `current.md` has no remaining Now or Next work.

### Step 11 — Independent Sol Medium review and conditional Sol High escalation

After the coordinator accepts the combined implementation and Step 10 evidence,
dispatch one separate read-only Sol Medium reviewer. Give it the original
request, this full prompt, the baseline status, ownership map, combined diff,
focused and full test output, browser observations, security boundaries, and
`docs/MVP_CLOSURE_AUDIT.md`.

The reviewer must inspect:

- correctness and regressions across all worker chunks;
- source and record integrity;
- per-agent provider/model routing and unavailable-provider behavior;
- provider tool isolation and secret handling;
- Polaris outbound privacy and local private synthesis;
- adaptive intake, partial-output preservation, and dossier revision safety;
- frontend behavior and the final browser payoff;
- stale-plan reconciliation and the claim that only Later remains;
- missing, weak, or bypassed tests.

The reviewer must return concrete findings with severity, file references,
evidence, and reproduction steps. It must not edit. Send accepted corrections
to the original Sol Medium implementer when practical. The coordinator owns
cross-chunk corrections. Re-run all affected focused checks, full checks,
browser checks, and the closure audit.

If the reviewer cannot resolve a material question, it must return exactly:

```text
ESCALATION REQUIRED
Issue:
Evidence:
Why Sol Medium could not resolve it:
Files involved:
Checks already run:
Exact question for Sol High:
```

The coordinator must then dispatch one `gpt-5.6-sol` reviewer with `high`
reasoning for only that question. Sol High is read-only. It returns a finding,
evidence, and a concrete correction, or says that the evidence is
insufficient. Apply accepted corrections through the coordinator or original
Sol Medium implementer and repeat proportionate review and verification. If
Sol High also cannot resolve a material question, record a true blocker and
ask the user; do not guess.

Step 11 passes only when the independent Sol Medium reviewer has no unresolved
material finding, every accepted correction is verified, every required Sol
High escalation is resolved, and all final closure evidence still passes
after the last correction. If Sol High cannot resolve a material question,
Step 11 is blocked and cannot pass.

## Parallel work policy

Use one shared working tree. Do not create worktrees, clones, temporary commits,
or patch-transfer steps. Workers may read any relevant file but must have exact
disjoint write ownership before dispatch. Workers must not spawn agents,
commit, push, deploy, reset, revert, clean, or edit outside their lane.

The Sol Medium coordinator owns:

- Step 0 and Step 1;
- `backend/app/models/api.py`;
- `backend/app/runtime.py`;
- `backend/app/providers/base.py`;
- `backend/app/providers/factory.py`;
- `backend/app/providers/__init__.py`;
- package manifests and lockfiles;
- cross-lane contract changes and integration seams;
- repository-wide tests, browser acceptance, graph updates, documentation,
  progress, closure audit, and final report.

Before each wave, record each chunk in the progress file or closure audit with
its outcome, dependencies, exact write list, focused check, implementer, and
review state. Compare every worker's changed paths against the baseline and
ownership before acceptance.

### Parallel Wave 1 — provider, routing, and administration

Dispatch three Sol Medium implementers concurrently after Step 1 passes.

**Chunk W1-A — provider adapters and catalogs**

Own only:

- new focused adapter and catalog files under `backend/app/providers/`, such
  as `opencode_go.py`, `codex_cli.py`, `antigravity_cli.py`, and one new
  catalog helper if needed;
- new `backend/tests/test_provider_conformance.py`;
- new `backend/tests/test_opencode_go_provider.py`;
- new `backend/tests/test_codex_cli_provider.py`;
- new `backend/tests/test_antigravity_cli_provider.py`.

Do not edit coordinator-owned provider files. Return the construction and
catalog interfaces needed by the coordinator.

**Chunk W1-B — agent persistence and run routing**

Own only:

- `backend/app/agents/registry.py`;
- `backend/app/agents/runner.py`;
- `backend/app/services/settings.py`;
- `backend/app/routers/settings.py`;
- `backend/tests/test_agents.py`;
- `backend/tests/test_settings.py`;
- one new focused per-agent-routing test file if needed.

Use only the Step 1 contracts. Do not edit runtime construction or shared API
models.

**Chunk W1-C — provider and Agent administration UI**

Own only:

- `frontend/app/settings/page.tsx`;
- `frontend/app/agents/page.tsx`;
- `frontend/lib/api.ts`;
- `frontend/lib/types.ts`;
- new `frontend/scripts/check-provider-admin.ts`.

Do not edit backend contracts. Report any mismatch to the coordinator.

The coordinator checks ownership, integrates provider construction and shared
contracts, runs the focused Wave 1 checks, and accepts the wave before Wave 2.

### Parallel Wave 2 — intake, Polaris research, and matter UI

Dispatch three Sol Medium implementers concurrently after Wave 1 is
accepted and the coordinator freezes the Wave 2 call shapes.

**Chunk W2-A — adaptive intake, records, and dossier**

Own only:

- `backend/app/routers/matters.py`;
- `backend/app/routers/chat.py`;
- `backend/app/services/chat_runs.py`;
- `backend/app/services/chat_history.py`;
- `backend/app/services/matter_records.py`;
- `backend/app/services/dossier.py`;
- `backend/app/services/matters.py`;
- `vault/00_System/agents/intake-agent.md`;
- `backend/tests/test_chat_runs.py`;
- `backend/tests/test_chat_history.py`;
- `backend/tests/test_matter_records.py`;
- `backend/tests/test_dossier.py`;
- `backend/tests/test_matters.py`;
- `backend/tests/test_matter_led_contracts.py`;
- one new focused adaptive-intake lifecycle test file if needed.

Do not edit `backend/app/services/research.py` or Polaris files.

**Chunk W2-B — Polaris matter research**

Own only:

- `backend/app/intelligence/outbound_policy.py`;
- `backend/app/intelligence/polaris.py`;
- `backend/app/services/research.py`;
- `backend/app/services/research_runs.py`;
- `vault/00_System/agents/research-agent.md`;
- `backend/tests/test_intelligence_security.py`;
- `backend/tests/test_intelligence_providers.py`;
- `backend/tests/test_research.py`;
- one new focused Polaris matter-research test file if needed.

Do not edit intake, matter-record, dossier, or shared API model files.

**Chunk W2-C — new-matter and intake UI**

Own only:

- `frontend/components/NewMatterForm.tsx`;
- `frontend/components/MatterWorkspace.tsx`;
- `frontend/components/ChatPanel.tsx`;
- `frontend/components/ChatCards.tsx`;
- `frontend/scripts/check-workspace-ux.ts`;
- `frontend/scripts/check-chat-run-recovery.ts`;
- one new focused adaptive-intake check file if needed.

Use the accepted frontend contracts from Wave 1. Do not edit Settings, Agents,
or backend files.

The coordinator checks ownership, resolves cross-lane seams, runs focused
Wave 2 checks, and then performs Step 8 assembled verification. No worker
reviews its own chunk.

After integration, use the independent review process in Step 11. Do not
accept TODOs, placeholder UI, dead services, unconnected code, or tests that
bypass the real entry point.

## Required tests

Every new provider must pass a shared conformance suite for:

- plain text;
- one and multiple tool calls;
- no tools when none were supplied;
- unknown tool rejection;
- malformed arguments;
- malformed or oversized responses;
- timeout and cancellation;
- resource cleanup;
- missing credentials or CLI session;
- model catalog success and malformed catalog;
- no secret reflection in output or errors.

Add assembled tests for:

- create matter → queued Intake Agent run → contextual summary/question → answer → record update → dossier;
- Intake and Research agents using different fake providers in one matter;
- skip, stop, correction, conflict, supersession, and undo;
- intake public question → deterministic privacy check → Polaris payload → local research-agent synthesis → packet and dossier;
- Polaris failure and malformed citation behavior;
- provider failure preserving useful text;
- restart with persisted agent selections and interrupted runs;
- vault switch closing provider resources and loading the new vault's agent overrides;
- existing manual research stage behavior;
- old agent files without provider fields;
- old chat messages without new metadata.

Do not weaken existing tests. Replace the existing test that only proves the fixed generic intake card with a behavioral test that proves the LLM or fake Intake provider received the complete request and produced a contextual question.

## Browser demo — acceptance gate

Use a fresh isolated vault and a deterministic fake or local ready provider first.

1. Open Settings and see all five model providers with honest states.
2. Set Intake Agent and Research Agent to different provider/model/effort selections.
3. Reload and confirm both selections remain.
4. Submit this request:

   `We are considering allowing small-business customers to receive international marketplace payouts into our U.S. accounts. Some sellers may have owners in higher-risk countries, and the marketplace may send one combined payment for many sales. Product wants to launch in eight weeks. We need to know what BSA/AML controls, customer due diligence, sanctions screening, transaction monitoring, and partner-bank approvals are needed before launch.`

5. Confirm the app opens Chat with Themis, not Overview.
6. Confirm a visible background state says Themis is reading the request.
7. Confirm the first response summarizes the marketplace payouts, higher-risk ownership, combined payments, eight-week timing, and requested BSA/AML decision before asking for confirmation.
8. Confirm no fixed `1 of 3` appears unless the model produced a real plan.
9. Correct one fact and confirm the original request remains unchanged.
10. Answer one material question. Confirm the next question changes based on the answer.
11. Skip one question. Confirm no fake fact is saved and a useful next question appears.
12. Select No more questions. Confirm intake stops, but a useful dossier and research work still continue.
13. Inspect records. Confirm stable source links, superseded corrections, assumptions, and unresolved human questions.
14. Inspect the network-captured Polaris payload in the test harness. Confirm no company alias, matter ID, path, email, or private excerpt appears.
15. Confirm Polaris citations are labeled Supplied until fetched and checked.
16. Confirm Research Agent synthesis uses that agent's selected model and updates a Markdown packet and dossier.
17. Edit the dossier, trigger another update, and confirm the lawyer edit is not overwritten.
18. Force provider and Polaris failures. Confirm useful partial work remains and failures are visible.
19. Restart. Confirm selections and records persist and interrupted work is honest/retryable.
20. Complete the pending live-agent browser payoff and every non-Later Continuous Legal Awareness/vault acceptance item.
21. Open `docs/MVP_CLOSURE_AUDIT.md` and confirm that no non-Later row remains open and that `current.md` contains only Later work.

Then run one live catalog and one live text/tool-call smoke test for each locally ready provider. If a credential or CLI session is absent, keep the provider shown as not ready and record the environment limit. Do not fake a live pass.

## Final verification

Run, in this order:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:workspace-ux
npm run typecheck
npm run build

cd /Users/bharris/Programs/counsel-os-mvp
graphify update .
./scripts/verify.sh
```

The final browser walk must occur after the final code change. Record exact test counts, build results, live-provider availability, browser observations, and any warning in the progress and acceptance files.

If Step 11 produces a correction, run this final verification again and repeat
all browser checks affected by that correction. The final recorded test and
browser evidence must be newer than the last accepted correction.

After the commands pass, run the closure discovery commands again. Compare the
results with `docs/MVP_CLOSURE_AUDIT.md`. Any new real item reopens Step 10.
Examples and historical wording may remain only when the audit explains why
they are not active work.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and
choosing the smallest design consistent with this prompt. Do not stop for
warnings, stale documentation, or missing optional live credentials.
Pre-existing failures may be left only when the closure audit proves that they
are historical/superseded or match Later. Otherwise fix them.

Stop and report only when:

- a required file or interface differs materially from this verified context;
- a required implementation needs a secret or external permission that is unavailable and no fake/contract proof can complete the code path;
- a focused verification still fails after diagnosis and two distinct correction attempts;
- instructions materially conflict;
- proceeding would destroy or overwrite user work;
- a product choice not answered here would materially change the result.
- the required parallel worker dispatch is unavailable;
- Sol High cannot resolve a material question escalated by the Sol Medium
  reviewer and proceeding would require a guess.

Do not call the task complete while a required progress line or any non-Later
closure-audit row remains pending, failed, unchecked, unverified, or omitted.
Do not call it complete while `current.md` contains Now or Next work.
Do not leave a non-Later unchecked checkbox in another acceptance or progress
file without converting it to a dated, evidence-backed historical/superseded
disposition.

## Final report

Lead with the user-visible result. Then provide:

- the provider/model combinations now available;
- how per-agent selection is stored and routed;
- how initial intake now works;
- how Polaris is used without receiving private context;
- the exact automated and browser proof;
- live-provider readiness and any environment-only limit;
- stale plans corrected or superseded;
- the closure-audit count by disposition and confirmation that only Later remains;
- any environment-only live-provider limit, clearly separated from unfinished code;
- the Sol Medium coordinator, implementation chunks, independent Sol Medium
  review result, and every Sol High escalation or a clear statement that none
  was needed;
- links to the high-value changed files and the completed progress file.

Before finishing, re-read this prompt,
`docs/core-intake-provider-completion.handoff-progress.md`, and
`docs/MVP_CLOSURE_AUDIT.md`. Work through the steps in order, verify each
one, and update the progress file immediately. Do not stop with a plan, a new
backlog, or a non-Later open row. If a named file, symbol, or signature differs
materially from the supplied context, stop and report instead of adapting
around it silently.
