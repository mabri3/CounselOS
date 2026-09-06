# Core intake, Polaris research, and per-agent model routing

## Thesis

Counsel OS must turn one raw legal request into a useful matter without making the lawyer reconstruct the workflow. The same application must let each Markdown-defined agent use a chosen model-provider combination while keeping Polaris as the public legal-research service, not as a general chat model.

## Payoff moment

A lawyer assigns models to the Intake and Research agents, submits a detailed BSA/AML request, lands directly in Chat with Themis, sees a matter-specific understanding and question from the selected Intake model, answers it, watches privacy-safe Polaris research run, and then opens an updated dossier that preserves sources, assumptions, and open questions.

## Scope decision

This checkpoint includes every unfinished item found in the active queue,
plans, status reports, handoff progress files, acceptance tests, and real
application placeholders unless that item matches the explicit `Later` list
in `current.md`. It does not permit a second active plan or a new `Next`
queue after execution.

Two prior Later decisions move into this checkpoint:

- Native model providers move from Later into this checkpoint: OpenCode Go, Antigravity CLI, and Codex CLI.
- Polaris becomes the primary external source for on-demand matter research. Additional commercial research providers remain Later.

## Parallel execution policy

Use Codex `gpt-5.6-sol` with `medium` reasoning for the coordinator, all
implementation workers, and the independent reviewer.

- One Sol Medium coordinator owns the baseline, shared contracts, ownership
  map, wave gates, integration seams, full verification, browser acceptance,
  documentation truth, and final report.
- Use three Sol Medium implementation workers concurrently for each listed
  three-chunk wave. Reuse the same workers across waves when practical. Do not
  collapse the work into serial execution. Use fewer only when a named chunk
  is proven to be a no-op; record that evidence before dispatch.
- Use one separate read-only Sol Medium reviewer. The reviewer must not have
  implemented any reviewed chunk and must not edit files.
- Use one read-only Sol High agent, `gpt-5.6-sol` with `high` reasoning,
  only when the Sol Medium reviewer identifies a material question and cannot
  determine a concrete answer after inspecting the relevant code, tests, and
  current evidence.
- The global worker ceiling is five active agents, excluding the coordinator:
  three implementers, one Medium reviewer, and one conditional High reviewer.
  The Medium and High reviewers do not work on the same question at the same
  time.

All agents use one shared working tree. Before each wave, the coordinator must
record exact disjoint write ownership. A worker may read outside its lane but
may edit only its assigned files. Shared API models, runtime construction,
provider registry/factory, integration, full-suite checks, browser work, and
closure documents remain coordinator-owned.

The Sol Medium reviewer reviews the accepted combined implementation after
integration. If it cannot resolve a material question, it returns exactly:

```text
ESCALATION REQUIRED
Issue:
Evidence:
Why Sol Medium could not resolve it:
Files involved:
Checks already run:
Exact question for Sol High:
```

The coordinator then dispatches one Sol High read-only reviewer for that exact
question. Sol High must return a finding, evidence, and a concrete correction
or a clear statement that the evidence is insufficient. The coordinator sends
an accepted correction to the original Sol Medium implementer when practical,
integrates it, and reruns affected checks. If Sol High also cannot resolve a
material question, treat it as a true blocker rather than guessing.

## Verified starting point

- `backend/app/routers/matters.py::_start_intake` creates a fixed QuestionCard. It does not invoke an LLM and hard-codes `1 of 3`.
- `frontend/app/page.tsx` opens `/matters/{id}` without selecting chat.
- `frontend/components/MatterWorkspace.tsx` defaults the middle pane to `overview`.
- `frontend/components/ChatPanel.tsx` submits every matter turn as `counsel-copilot`.
- `backend/app/runtime.py` constructs one global provider and gives it to all model-backed services.
- `backend/app/agents/registry.py::AgentDefinition` has no provider, model, or reasoning-effort fields.
- Settings exposes only Mock and one OpenAI-compatible endpoint. The runtime model catalog hides unconfigured providers.
- `backend/app/intelligence/polaris.py::PolarisIntelligenceProvider` is implemented and tested for Watches. It uses the fixed Themis Lime brain and `polaris-advisor`.
- General matter research in `backend/app/services/research.py` uses `SearchService` plus `research-agent`; it does not call Polaris.
- The working tree is already dirty. The current live-agent changes are user work and must be preserved.
- `docs/MVP_CLOSURE_AUDIT.md` is the required source-by-source closure record. It starts pending and must contain every discovered unfinished or stale item before implementation is called complete.

## Existing plans and their status

- `docs/BUILD_PLAN.md`: product direction remains useful, but its “execution has not started” line is stale. The supporting contracts exist; the adaptive intake loop does not.
- `docs/matter-led-mvp.handoff-plan.md`: useful implementation detail, but its progress file incorrectly claims complete acceptance. Add a correction note; do not erase its history.
- `docs/CONTINUOUS_LEGAL_AWARENESS_BUILD_PLAN.md`: header says implementation did not start, but `docs/continuous-legal-awareness.handoff-progress.md` says it completed. Re-audit and correct the header only after proof.
- `docs/matter-work-state.handoff-progress.md`: all items say pending, but work-state code and later reliability acceptance exist. Mark the document superseded after verification; do not reimplement it.
- `docs/live-agent-ux-repair.handoff-progress.md`: only the isolated browser payoff test remains pending.
- `docs/document-review-word-like.handoff-progress.md`: preserves an older three-test failure. The newer recorded baseline says 454 backend tests pass. Resolve the historical line from a fresh full run.

## Demo script

1. Open Settings. See Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI with honest readiness states and model catalogs.
2. Open Agents. Set Intake Agent and Research Agent to different available provider/model/effort combinations. Save, reload, and confirm both selections.
3. Submit a detailed BSA/AML request from Today.
4. Confirm the app opens that matter directly in Chat with Themis and shows “Themis is reading your request” while the intake run works in the background.
5. Confirm the first assistant turn summarizes the actual request and asks a request-specific understanding question. It must not show the old context-free sentence or a fake `1 of 3` count.
6. Correct one fact, answer one choice, skip one question, and choose No more questions. Confirm the next question adapts to prior answers and the transcript keeps all exact messages.
7. Confirm current facts, sources, assumptions, conflicts, and superseded facts link to the request or stable message ID. Undo withdraws created records without deleting history.
8. Confirm researchable questions run through Polaris with no private matter data in the outbound payload. Human-dependent questions stay in chat.
9. Confirm research analysis runs as `research-agent` on that agent's selected model. Chat remains usable while research runs.
10. Confirm `dossier.md` contains a concise matter summary, decision question, material facts, assumptions, open questions, research support labels, and the next counsel action.
11. Edit `dossier.md`, trigger a later update, and confirm the content-hash guard preserves the lawyer edit and creates a reviewable revision.
12. Force provider, Polaris, citation-format, and structured-output failures. Confirm useful partial text remains visible and files are not damaged.
13. Restart the backend. Confirm agent selections and current matter records reload. Confirm an interrupted run is shown honestly and can be retried.
14. Complete every unchecked non-Later browser acceptance item, including the pending live-agent payoff, Continuous Legal Awareness, and vault/workspace checks. Update plan state from observed evidence only.
15. Review `docs/MVP_CLOSURE_AUDIT.md`. Confirm every discovered item is verified complete, verified historical/superseded, or matched to the explicit Later list. Confirm `current.md` has no remaining Now or Next work.

## Build

### Step 0 — Preflight and truthful baseline

Read all repository instructions and active plans. Run `git status --short`,
`graphify query`, the full backend suite, focused frontend checks, typecheck,
and build. Record failures before editing. Add a dated correction section to
the new progress file if current code differs from this plan.

Populate `docs/MVP_CLOSURE_AUDIT.md` before implementation. Inventory
`current.md`, `CODEX_HANDOFF.md`, `docs/PRD.md`, every plan/status file,
every `docs/*.handoff-progress.md`, every unchecked acceptance item, and real
application TODO/FIXME/placeholder/stub markers. Give every discovered item an
audit row. The only final dispositions are verified complete, verified
historical/superseded, and an exact match to the existing Later list.

Verification:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
git status --short
graphify query "intake chat runs agent provider model routing Polaris matter research dossier"
./scripts/verify.sh
cd frontend
npm run check:workspace-ux
```

### Step 1 — Freeze the provider and agent-selection contracts

Keep `LLMProvider.complete(messages, tools)` as the small execution contract. Add a focused provider registry/router rather than changing callers to know provider types.

Use these provider IDs and labels:

| ID | Label | Credential or session |
|---|---|---|
| `mock` | Mock (offline) | none |
| `openai_compatible` | configured endpoint label | `LLM_API_KEY` |
| `opencode_go` | OpenCode Go | `OPENCODE_GO_API_KEY` or `OPENCODE_API_KEY` |
| `codex` | Codex CLI | existing `codex login` session |
| `antigravity_cli` | Antigravity CLI | existing signed-in `agy` session |

Each catalog entry must include provider ID, label, readiness, readiness detail, models, and supported reasoning efforts. Catalog failure must preserve the last configured model as unavailable; it must not silently select another model.

Extend each agent's Markdown frontmatter and API shape with optional `provider`, `model`, and `reasoning_effort`. Empty values mean “Use workspace default.” Existing agent files remain valid.

At run start, resolve one immutable selection snapshot: agent ID, provider, model, and effort. Persist that snapshot on the chat or research run record. An explicit unavailable agent selection fails visibly. It never falls back to another provider. An agent with no override uses the workspace default.

### Step 2 — Add the three model providers and model catalogs

Implement Counsel OS-owned adapters. Do not import PlayMaker, AltBench, or DeepBench at runtime. Reuse their proven behavior by inspection:

- OpenCode Go:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/opencode_api.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/providers/opencode_api.py`
- Antigravity CLI:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/antigravity_cli.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/providers/antigravity_cli.py`
- Codex CLI:
  - `/Users/bharris/Programs/PlayMaker/playmaker/providers/chatgpt_codex.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/codex.py`
- Catalog behavior:
  - `/Users/bharris/Programs/PlayMaker/playmaker/provider_models.py`
  - `/Users/bharris/Programs/PlayMaker/playmaker/model_selection.py`
  - `/Users/bharris/Programs/DeepBench/src/deepbench/llm/settings/catalog.py`
- AltBench usage evidence:
  - `/Users/bharris/Documents/ChatGPT/AltBench/src/altbench/providers.py`

OpenCode Go uses its direct API and native tool-call form for the model's protocol. Codex uses a persistent `codex app-server` in an isolated temporary working directory, with a one-shot pre-turn fallback only if the turn did not start. Disable Codex shell, browser, apps, plugins, and file tools; only Counsel OS tool schemas are available. Antigravity runs `agy` headless with sandboxing, bounded input/output, no shell, an isolated temporary directory, and strict tool-request parsing.

Antigravity 1.1.13 places the prompt in process arguments. Show it as **Development only — do not use confidential matter data** until the CLI supports a safe input channel. This warning is mandatory and is not a blocker to implementing the adapter.

Never log, persist, return, or place credentials in child-process environments. Bound time, output size, model IDs, tool names, JSON depth, and malformed provider output. Close child processes and HTTP clients on timeout, cancellation, vault switch, and app shutdown.

### Step 3 — Route each agent through its selected provider

Change `AgentRunner` to resolve the provider from the loaded `AgentDefinition` once per run. Use the same resolved provider for normal model calls and the final answer-only call after the tool-step limit.

Update `ChatRunService._timeout_result` to use the run's selection snapshot, not `context.provider`. Schedules, Briefing research, matter research, intake, and normal chat already enter through agents and must therefore inherit the selected agent model. Company interview and Skill Builder are not agents; they continue to use the workspace default.

Preserve test injection. Existing tests that set a fake default provider must still have a small supported seam. Add an explicit fake provider registry for routing tests instead of global monkeypatching across unrelated services.

### Step 4 — Add per-agent controls and honest global Settings

Keep Settings as the workspace default. Show all built-in providers, their readiness, and their catalogs. Do not show secrets or a secret-entry form.

Add a Model section to `frontend/app/agents/page.tsx` before Advanced controls:

- Provider: Workspace default, OpenAI-compatible, OpenCode Go, Codex CLI, Antigravity CLI, or Mock.
- Model: catalog models for the selected provider.
- Reasoning effort: only values supported by that model/provider.
- A short readiness or safety note.

Save the override in the selected agent's Markdown frontmatter. Reload and switching agents must preserve unsaved-change protection. A provider/model change applies to the next run, not an active run.

### Step 5 — Replace fixed intake with a real background intake run

Delete the fixed `_start_intake` QuestionCard behavior. Do not replace it with another deterministic legal questionnaire.

When a matter is created:

1. Preserve `request.md` unchanged.
2. Create one conversation marked `conversation_kind: intake` and `intake_state: active`.
3. Add the original request as the initial user message, linked to the request source.
4. Queue a `ChatRunService` request with `agent_id="intake-agent"`.
5. Return the matter plus conversation/run identifiers.
6. Navigate directly to the matter chat and poll the run.

The first Intake Agent turn must state a short, factual understanding of the actual request and then ask whether it is correct. Add one typed intake-turn tool, following the existing typed-tool pattern, to return validated record updates plus at most one QuestionCard. Do not parse arbitrary Markdown into cards.

The typed intake turn must support:

- working-ask summary;
- reported facts and their source;
- issues;
- assumptions;
- material missing facts;
- human-dependent questions;
- public research questions;
- at most one next question with reason, selection mode, choices, and optional honest progress;
- whether intake is active or complete.

Pass the saved request/message source ID into tool execution as internal context. The model must not invent source IDs. The backend attaches the trusted source reference.

After each answer, run the Intake Agent again with the transcript and current records. It decides the next material question. Skip records no answer but asks the next adaptive question. No more questions marks intake complete and requests the best available dossier; it does not create a fake answer. Remove the current deterministic interception that prevents the Intake Agent from seeing clarification answers.

When intake is complete, set the conversation's active agent to `counsel-copilot`. While it is active, matter-chat submissions use `intake-agent`. Do not use matter stage alone as the routing signal.

### Step 6 — Connect intake records and dossier revisions

Reuse `MatterRecordService` and `DossierService`. Do not create a second intake store or evidence graph.

Initial intake may promote facts explicitly reported in the immutable request. Later answers link to their stable user-message IDs. Meaning-changing corrections create replacements and mark prior facts superseded. Repeated statements add support. Conflicts stay open until a clear user answer resolves them.

Create a provisional `dossier.md` from the initial request as soon as the first Intake Agent turn succeeds. Label unconfirmed material as reported or assumed. After a meaningful answer or research result, propose a new revision only when the matter orientation changes. Respect the existing content-hash guard and keep lawyer edits.

The dossier must contain these sections:

- Matter summary
- Decision question
- Material facts
- Assumptions
- Issues and workstreams
- Open questions
- Research and source support
- Options or working recommendation
- Next counsel action
- Work product links

If model output is incomplete, write the useful sections and label the gaps. Never suppress a non-empty dossier because one section or citation failed.

### Step 7 — Use Polaris for on-demand matter research

Polaris is a research-source provider, not an agent model. Do not add Polaris to the agent model dropdown.

Extend the existing Polaris boundary for one-shot public legal research. Reuse its fixed endpoint, model, bounded HTTP behavior, citation parsing, and **Supplied** citation label. Do not create a temporary persistent Watch for each matter question.

Use a small public research-query model and refactor the existing outbound policy so Watches and one-shot matter research share the same deterministic private-data checks. The outbound payload may contain public legal questions, jurisdictions, regulators, courts, public entities explicitly classified as public, and public source URLs. It must reject matter IDs, emails, vault paths, internal company aliases, private product names, and distinctive internal excerpts.

The Intake Agent classifies open items locally. For each material researchable item, it supplies a public query candidate. Local deterministic policy validates it before Polaris. If validation fails, skip that outbound call, preserve the human-readable research question locally, and show the privacy warning.

Polaris returns public observations and supplied citations. Then the configured `research-agent`, using its own selected model, synthesizes those observations with private matter and company context inside Counsel OS. Automatic research does not change the matter stage. Manual research keeps its current explicit stage behavior.

Bound automatic intake research to three material questions per intake cycle. Keep the existing in-process run records and interruption behavior. Update the ResearchStatusCard and dossier when each result completes or fails.

### Step 8 — Prove failure behavior and assembled lifecycles

Add hostile-output tests for every new provider and every LLM-produced intake/research payload:

- missing keys;
- unknown tool names;
- invalid arguments;
- non-object JSON;
- oversized output;
- timeout and cancellation;
- CLI missing or login unavailable;
- credential reflection;
- catalog failure after a saved selection;
- Polaris malformed content and unverified citations.

Add assembled tests for:

- create matter → queued intake → contextual question → answer → record update → dossier;
- different Intake and Research agent providers in the same matter;
- intake research → privacy-safe Polaris payload → local synthesis → dossier update;
- stop/skip/correction/conflict/supersession;
- restart with interrupted runs and persisted selections;
- vault switch closing provider resources and loading that vault's agent overrides;
- provider failure preserving useful partial work.

After focused checks pass, the Sol Medium coordinator inspects every worker
diff against its ownership and resolves only coordinator-owned integration
seams. Do not let one implementer review its own work.

### Step 9 — Browser proof and plan reconciliation

Run the demo script in an isolated vault. Use fakes for deterministic adapter proof. Run one live catalog and one live text/tool call for each locally ready provider. Missing credentials or CLI sessions are environment limits, not reasons to fake readiness.

Complete the pending browser payoff in
`docs/live-agent-ux-repair.handoff-progress.md`. Re-audit every unchecked
non-Later item in `docs/ACCEPTANCE_TESTS.md`, including Continuous Legal
Awareness and vault/workspace behavior. Mark an item complete only after direct
observation. Fix every observed non-Later defect. Do not move an item to Later
unless it already matches the canonical Later list.

Refresh `current.md`, `contextmap.md`, `decisions.md`, `docs/PRD.md`, `docs/BUILD_PLAN.md`, `.env.example`, and provider/API documentation. Preserve old plan history. Add dated correction or supersession notes rather than rewriting prior claims as if they never occurred.

Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp
./scripts/verify.sh
cd frontend
npm run check:workspace-ux
cd ..
graphify update .
./scripts/verify.sh
```

### Step 10 — Exhaustive closure audit and final state

Finish every row in `docs/MVP_CLOSURE_AUDIT.md`. For an item already
implemented, run current proof. For a stale item, add a dated correction or
supersession note and cite the replacing behavior. For a real unfinished item,
implement and verify it. For a Later item, cite the exact matching category in
`current.md`. Do not use “moved to another plan” as a disposition.

Run the full automated checks and final isolated browser walk after the final
code change. If this step finds or fixes a code defect, repeat the affected
Step 8 and Step 9 checks. Then update the PRD, build plan, implementation
status, acceptance file, progress files, `current.md`, `contextmap.md`, and
`decisions.md` so they agree.

At completion:

- every closure-audit row has an allowed final disposition and direct evidence;
- every progress line in this checkpoint is done;
- every active non-Later acceptance or progress checkbox is checked, while an obsolete checkbox has a dated evidence-backed historical/superseded disposition;
- no other handoff progress file presents a non-Later pending or failed item as active;
- `current.md` has no remaining `Now` or `Next` work;
- only the existing Later categories remain.

### Step 11 — Independent Sol Medium review and conditional Sol High escalation

Run one separate read-only Sol Medium reviewer over the accepted combined
implementation, tests, browser evidence, security boundaries, record
integrity, provider routing, Polaris privacy boundary, stale-plan
reconciliation, and closure audit.

The reviewer must report concrete findings with file references and
reproduction steps. It must not edit files. For each material finding, return
the correction to the original Sol Medium implementer when practical. Re-run
the affected focused tests, full verification, browser checks, and closure
audit after corrections.

If the reviewer cannot determine a concrete answer to a material question,
use the structured escalation above. The coordinator must dispatch one
read-only Sol High agent for only that question. Record whether escalation was
not needed, resolved, or blocked in the progress file and final report.

Step 11 passes only when the independent Sol Medium reviewer has no unresolved
material finding, every accepted correction is verified, every required Sol
High escalation is resolved, and the final closure evidence still passes
after the last correction. If Sol High cannot resolve a material question,
Step 11 is blocked and cannot pass.

## Guardrails

- Preserve all unrelated dirty-tree work. Never reset, revert, discard, or overwrite it.
- Do not import PlayMaker, AltBench, or DeepBench as a runtime dependency.
- Do not read, print, copy, or persist another repository's `.env` values.
- Do not store API keys, auth files, CLI tokens, or raw credentials in Markdown or SQLite.
- Do not silently fall back from an explicit per-agent model selection.
- Do not send private company or matter context to Polaris.
- Do not expose Codex, Antigravity, or OpenCode agent-side shell/file/browser tools. Only Counsel OS typed tools may execute.
- Do not add a provider plugin framework, queue, broker, worker service, event database, global fact graph, embeddings, auth, cloud tenancy, or a new design system.
- Do not add legal-perfection gates, verifier agents, multi-agent votes, citation gates, or empty refusals.
- Do not change recommendation, approval, delivery, durable-decision, or closure integrity rules.
- Do not implement the remaining Later backlog.

## Completion standard

The checkpoint is done only when the full demo script passes, the full
automated verification passes, every non-Later browser acceptance item is
recorded, provider/model selections survive reload and restart, the BSA/AML
intake is contextual and adaptive, Polaris research is privacy-safe, useful
partial output survives failures, and stale plans are reconciled honestly.
`docs/MVP_CLOSURE_AUDIT.md` must have no pending, failed, unverified, omitted,
or newly deferred row. `current.md` must have no remaining Now or Next work.
The independent Sol Medium review must have no unresolved material finding.
Any required Sol High escalation must be recorded and resolved before
completion; an unresolved material answer is a blocker, not a guessed pass.

## Parked backlog

- Slack, Jira, Asana, and email intake: add only after manual paste is a measured bottleneck.
- Additional commercial research providers: add only after Polaris fails a measured research need.
- Better retrieval: add only after current local and Polaris research misses known relevant material.
- Selection rewrite/diff: add only after the current editor workflow is validated.
- Source-layout-preserving document editing, imported review round trips, native PDF editing, and full collaboration: add only after regenerated Markdown-first review proves insufficient.
- Court-grade citation validation, citator integration, and guaranteed comprehensive research: add only after users show that source-status labels and first-pass research are insufficient.
- Authentication, SSO, enterprise RBAC, ethical walls, legal holds, cloud tenancy, Tauri, team collaboration, and permissions: add only after the local single-user workflow proves value.
- Durable/distributed queues, cloud databases, object storage, embeddings, and multi-instance scheduling: add only after local execution reaches a measured limit.
- Multi-agent voting, reviewer veto, autonomous final decisions, broader legal modules, and full contract lifecycle management: add only after validated user need.
- Arbitrary shell execution, executable Markdown tools, and a general plugin marketplace remain outside the MVP safety boundary.
- Token streaming and broad polish: add only after the intake-to-dossier workflow is stable.
