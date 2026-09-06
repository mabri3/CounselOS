# Handoff plan — complete hardening-remediation milestone

## Objective

Close every finding in `docs/ARCHITECTURE_SECURITY_AUDIT.md` without changing
the approved MVP product scope. The milestone includes all security,
operations, performance, architecture, and code-quality work in the audit.
Severity controls order and review depth. It does not remove work.

The audit has 22 finding IDs. Several findings have separate implementation
parts, which the earlier draft described as a 28-item punch list. Completion is
checked against every finding and every listed part, not against a fragile task
count.

## Observable completion

The milestone is complete only when:

1. All 22 audit findings have implementation or an approved owner decision.
2. Each implementation has a fail-first regression test or a recorded reason
   why fail-first proof is not applicable to a mechanical refactor.
3. Normal upload, matter chat, search, Briefing, scheduler, settings, provider,
   and work-product flows still work.
4. The full backend suite passes above the 682-test baseline.
5. Frontend typecheck, checks, and production build pass.
6. The browser walk in `docs/ACCEPTANCE_TESTS.md` is complete.
7. `graphify update .` is complete after code changes.
8. Repository hygiene has an owner-approved disposition and the approved
   actions are complete.

## Verified baseline

Recorded on 2 September 2026 before document revision:

```text
backend: 682 passed, 1 warning in 126.39s
frontend: typecheck clean; production build clean
HEAD: 9c73a94
working tree: dirty; existing changes belong to the user
```

The pass count is a regression floor, not proof of complete behavior. The final
count must be higher because this milestone adds tests.

## Execution policy

```yaml
parallel:
  optimize_for: balanced
  max_agents: 3                 # excludes coordinator; runtime has four total slots
  workers:
    - name: terra-high-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-terra
      effort: high
      max_concurrent: 3
    - name: sol-medium-reviewers
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: medium
      max_concurrent: 1
    - name: sol-high-reviewers
      role: reviewer
      provider: codex
      model: gpt-5.6-sol
      effort: high
      max_concurrent: 1
  review:
    policy: risk-based
```

These are exact model requests. Stop if a requested model is unavailable. Do
not silently change model, provider, effort, or role.

All workers use one shared working tree. Workers must not spawn agents, commit,
push, deploy, create worktrees, stash, or edit outside their exact write scope.
Reviewers are read-only. The coordinator owns integration, broad checks, and
`docs/hardening-remediation.handoff-progress.md`.

## Global guard rails

1. Read `AGENTS.md`, `CLAUDE.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, the audit,
   this plan, and the progress file before editing.
2. Start each chunk with `graphify query "<chunk question>"`. Confirm every
   symbol and caller with `rg` before writing.
3. Preserve all pre-existing user changes. Record the baseline path status
   before dispatch.
4. Markdown remains authoritative. SQLite remains disposable derived state.
5. Keep file operations inside `VAULT_PATH` through existing vault methods and
   `ensure_within`.
6. Preserve `SafeHttpFetcher`, `OutboundQueryPolicy`, atomic vault writes,
   `ActiveContextManager`, and the index rebuild-and-swap sequence.
7. `backend/frontmatter.py` is a deliberate local shim. Do not install
   `python-frontmatter` or change its imports.
8. Use temporary vaults or `backend/tests/fixtures/vault`. Never run tests
   against `vault/`, `vault2/`, `tmp/`, or experiment data.
9. A backend can be using the repository vault. Do not stop it.
10. Do not weaken, remove, or skip existing tests. Record a contract reason
    before changing an assertion.
11. Do not add authentication, a queue, a dependency-injection framework, a
    verifier agent, legal-answer gates, refusal behavior, or legal disclaimers.
12. Do not log prompts, uploaded text, document bodies, API keys,
    authorization headers, or private vault content.
13. A worker that needs another production path must stop. The coordinator must
    revise ownership before that path is changed.
14. Workers report evidence. Only the coordinator edits the progress file.

## Ownership map

There are ten coding chunks plus one owner-gated repository chunk. This fixes
the earlier count of nine, which omitted one coding chunk.

| Chunk | Findings | Exact write scope | Risk | Review |
| --- | --- | --- | --- | --- |
| A · observability and Host boundary | SEC-3; OPS-1 foundation | `backend/app/observability.py`, `backend/app/main.py`, `backend/tests/test_observability.py` | normal | Sol Medium |
| B1 · index foundation | PERF-1a/c; PERF-4a; QUAL-1; QUAL-2 | `backend/app/services/index.py`, `backend/app/runtime.py`, `backend/tests/test_awareness_index.py`, `backend/tests/test_awareness_rebuild.py`, `backend/tests/test_decisions.py` | high | Sol High before dependents |
| B2 · indexed Briefing and search | PERF-3; PERF-7 | `backend/app/services/index.py`, `backend/app/services/vault.py`, `backend/app/services/search.py`, `backend/app/services/research.py`, `backend/app/tools/handlers.py`, `backend/app/runtime.py`, `backend/tests/test_awareness_api.py`, `backend/tests/test_awareness_index.py`, `backend/tests/test_vault.py`, `backend/tests/test_research.py`, `backend/tests/test_agents.py` | high | Sol High |
| C · ingestion safety | SEC-1; SEC-2 upload; PERF-1a/b | `backend/app/services/ingestion.py`, `backend/app/intelligence/native.py`, `backend/requirements.txt`, `backend/tests/test_ingestion.py`, `backend/tests/test_ingestion_limits.py`, `backend/tests/test_document_review_docx.py`, `backend/tests/test_intelligence_security.py` | high | Sol High |
| D · request bounds | SEC-2 request fields | `backend/app/models/api.py`, `backend/tests/test_api_limits.py` | normal | Sol Medium |
| E · agent and tool boundary | SEC-4; SEC-5; PERF-2; PERF-4b; ARCH-1b; PERF-1a | `backend/app/tools/capabilities.py`, `backend/app/tools/registry.py`, `backend/app/tools/handlers.py`, `backend/app/agents/registry.py`, `backend/app/agents/context.py`, `backend/app/agents/runner.py`, `backend/app/routers/automations.py`, `backend/tests/test_agents.py`, `backend/tests/test_agent_action_permissions.py`, `backend/tests/test_automations_api.py`, `backend/tests/test_prompt_trust_boundary.py`, `backend/tests/test_provider_conformance.py` | high | Sol High |
| F · settings policy | SEC-6a; ARCH-1a; QUAL-5 | `backend/app/services/provider_settings_policy.py`, `backend/app/services/settings.py`, `backend/app/routers/settings.py`, `backend/app/intelligence/polaris.py`, `backend/app/runtime.py`, `backend/tests/test_settings.py`, `backend/tests/test_intelligence_providers.py`, `backend/tests/test_vault_management.py` | normal | Sol Medium |
| G · scheduler and provider transport | OPS-1 completion; SEC-6b; PERF-1a/b; PERF-6; PERF-8 | `backend/app/services/scheduler.py`, `backend/app/providers/openai_compatible.py`, `backend/tests/test_scheduler.py`, `backend/tests/test_openai_compatible_provider.py`, `backend/tests/test_provider_conformance.py`, `backend/tests/test_scheduler_observability.py` | normal | Sol Medium |
| H · matter service seams | PERF-1a/b/c; PERF-4c; PERF-5; ARCH-1c | `backend/app/services/matters.py`, `backend/app/services/matter_work_items.py`, `backend/app/services/matter_participants.py`, `backend/app/services/matter_lifecycle.py`, `backend/app/services/work_product.py`, `backend/app/services/research.py`, `backend/app/services/watch_scans.py`, `backend/tests/test_matters.py`, `backend/tests/test_matter_state.py`, `backend/tests/test_matter_lifecycle.py`, `backend/tests/test_work_product.py`, `backend/tests/test_research.py`, `backend/tests/test_watch_scans.py` | high | Sol High |
| I · frontend helper extraction | QUAL-3 | `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matter-workspace.ts`, `frontend/scripts/check-matter-workspace-helpers.ts`, `frontend/package.json` | normal | Sol Medium |
| J · repository hygiene | QUAL-4; QUAL-6 | Read-only inventory first. Exact write scope is recorded only after owner approval. | high/destructive | owner and coordinator |

`B1` and `B2` share index and runtime files and must run in separate waves.
`B2` also updates callers first changed by E and H, and F changes runtime, so B2
runs after all four chunks. No active workers can write a listed path at the
same time.

## Chunk specifications

### A · Observability and localhost Host boundary

```yaml
id: observability-host
depends_on: []
implementer: terra-high-implementers
reviewer: sol-medium-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_observability.py -q
```

Required work:

- Add standard-library logging configuration. Read `LOG_LEVEL`, default to
  `INFO`, and do not replace an existing Uvicorn logging setup.
- Configure logging before FastAPI application construction.
- Add `TrustedHostMiddleware` for `localhost`, `127.0.0.1`, and `testserver`.
- Classify the 18 silent exception blocks. Log only genuine unexpected
  no-signal failures in their owning chunks. Keep expected cancellation,
  cleanup, and fallback paths quiet or at `debug`.

### B1 · Index foundation and decision scope

```yaml
id: index-foundation
depends_on: []
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_awareness_index.py tests/test_awareness_rebuild.py tests/test_decisions.py -q
provides:
  - IndexService.rebuild_async
  - IndexService.list_decisions(matter_id=...)
```

Required work:

- Add `rebuild_async()` using `asyncio.to_thread` around the existing rebuild.
  Do not change the atomic rebuild algorithm.
- Keep synchronous mutations eager. Do not add a process-local stale flag or
  reader-side `ensure_current()` protocol.
- Add optional `matter_id` filtering to `list_decisions` while preserving
  current unfiltered behavior and ordering.
- Convert all current positional index `INSERT` paths to explicit named column
  or table-specific mappings. Test column-order safety. Do not use a hard-coded
  statement count.
- Remove `AwarenessIndex = IndexService` after `rg` proves there are no callers.
- Remove the verified duplicate runtime rebuild without changing startup index
  freshness.

The Sol High review must be accepted before C, E, G, or H uses the new API.

### B2 · SQLite Briefing and FTS5 search

```yaml
id: indexed-query-paths
depends_on: [index-foundation, agent-tool-boundary, matter-service-seams, settings-policy]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_awareness_api.py tests/test_awareness_index.py tests/test_vault.py tests/test_research.py tests/test_agents.py -q
```

Required work:

- Move all Briefing filters, sort, total count, and cursor pagination into
  SQLite. The project runtime was verified to provide SQLite JSON1.
- Preserve current null handling, stable tie-breaks, cursor boundaries, list
  overlap behavior, and response shape with old-versus-new equivalence tests.
- Use `json_each` for the list-overlap filters. Do not filter a SQL page again
  in Python because that can make totals and cursor boundaries incorrect.
- Add an FTS5 table to the disposable index and populate it in the existing
  index build. The project runtime was verified with `ENABLE_FTS5`. Update the
  schema version because this is a real schema change.
- Add the lexical query to `IndexService`, inject the index into `SearchService`
  through `AppContext`, and update the three current caller paths in search,
  research, and tool handlers. Retain
  `VaultService.lexical_search` only as a compatibility fallback if `rg` finds
  a caller outside this owned set. Do not make `VaultService` depend on an
  index instance. Preserve scope, limit, result shape, stable ordering, and path
  containment.
- Prove a rebuild replaces stale search content and Markdown remains the source
  of truth.

### C · Ingestion, DOCX, and native XML safety

```yaml
id: ingestion-safety
depends_on: [observability-host, index-foundation]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_ingestion.py tests/test_ingestion_limits.py tests/test_document_review_docx.py tests/test_intelligence_security.py -q
```

Required work:

- Add `defusedxml>=0.7,<1` in the existing requirement style. Do not add
  `python-frontmatter`.
- Read uploads in fixed-size chunks. Stop after the configured limit plus one
  chunk. Prove no unlimited read is requested.
- Run PDF and DOCX extraction through `asyncio.to_thread`.
- Preflight the complete DOCX package before custom parsing or `DocxDocument`.
  Enforce member count, per-XML-part bytes, total expanded bytes, streamed
  actual bytes, encryption rejection, and malformed-archive rejection.
- Use entity-safe parsing for Word XML and RSS or Atom XML. A security rejection
  is terminal and cannot fall back to `python-docx`.
- Validate and extract before new source or companion persistence. Preserve an
  existing source if a later step fails.
- Use `await index.rebuild_async()` in both async upload paths.
- Make each upload batch call inner writes with `rebuild=False`, then rebuild
  once after the successful batch. Define and test partial-batch behavior.
- Log unexpected failures without including names or document content.

Tests must create small payloads in memory. Do not commit bomb fixtures.

### D · High-amplification request bounds

```yaml
id: request-bounds
depends_on: []
implementer: terra-high-implementers
reviewer: sol-medium-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_api_limits.py -q
```

Bound these exact surfaces:

- `ChatRequest.message` and `ChatRequest.history`.
- Each `ChatMessage.content`; a list bound alone is insufficient.
- `FileUpdate.content`.
- `MatterCreate.request_text` and `MatterCreate.description`.
- `RecommendationUpdateRequest.content`.
- `DocumentReviewAction.content`, `body`, `quote`, author fields, and ID fields.

Name shared limits once near the models. Prove exact-limit acceptance and
over-limit rejection for each limit category. Do not claim a global HTTP-body
limit.

### E · Agent registries, prompt roles, tool permissions, and capabilities

```yaml
id: agent-tool-boundary
depends_on: [observability-host, index-foundation]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_agents.py tests/test_agent_action_permissions.py tests/test_automations_api.py tests/test_prompt_trust_boundary.py tests/test_provider_conformance.py -q
```

Required work:

- Cache agent and tool registries by a fingerprint of all sorted source files
  across bundled and vault directories: relative path, `st_mtime_ns`, and size.
  Prove add, edit, delete, and vault-switch invalidation.
- Keep trusted operating and agent rules in the system message. Put user,
  company, memory, matter, work-state, decision, matter-file, and active-file
  data in a fenced user-role context message.
- Put saved history after the context and the current user request last on the
  first provider call. Preserve provider adapter contracts and content caps.
- Use `list_decisions(matter_id=...)` for matter context.
- Reject unknown tool IDs during direct human agent create and update.
- For tool-driven create, enforce that requested tools are a subset of the
  creating agent's effective allowed set. Pass this effective set through
  `AgentRunner` and `ToolExecutionContext`; registry existence alone is not
  enough.
- Keep decision, Watch, and lifecycle permission gates unchanged.
- Replace the broad handler `Any` dependency with a small structural
  `ToolCapabilities` protocol. Name only services and methods handlers use. Do
  not add a container or dependency-injection framework.
- Replace all four async handler rebuild calls with `await rebuild_async()`.
- Log unexpected tool or registry failures without logging prompts or content.

The prompt regression test must inspect the exact message list sent to a
capturing provider. Markers inside one system string are not proof.

### F · Provider settings policy and stable activation errors

```yaml
id: settings-policy
depends_on: [observability-host, index-foundation]
implementer: terra-high-implementers
reviewer: sol-medium-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_settings.py tests/test_intelligence_providers.py tests/test_vault_management.py -q
```

Required work:

- Extract provider selection and validation from HTTP transport into one small
  policy module.
- Use the same policy from the settings router and the `AppContext` load and
  configure paths. Give `PolarisIntelligenceProvider` a public configuration
  method so the router does not mutate its private timeout and retry fields.
  Preserve useful field-specific validation and current provider defaults.
- Keep the settings router responsible for HTTP request and response mapping.
- Return stable vault-activation failure text and log diagnostic exception
  details locally. Do not log paths that are not already part of the supported
  local API response.
- Add tests that prove settings and Polaris cannot accept conflicting provider
  states.

### G · Scheduler due filtering, failure messages, and connection reuse

```yaml
id: scheduler-transport
depends_on: [observability-host, index-foundation, matter-service-seams]
implementer: terra-high-implementers
reviewer: sol-medium-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_scheduler.py tests/test_scheduler_observability.py tests/test_openai_compatible_provider.py tests/test_provider_conformance.py -q
```

Required work:

- Filter existing indexed schedule rows by `enabled`, `kind`, and
  `next_run_at`, then read Markdown only for due rows. Add an index method only
  if the existing row shape cannot express this contract.
- Preserve disabled, due-time, malformed-record, retry, and run-state behavior.
- Replace both async scheduler rebuild calls with `await rebuild_async()`.
- For an inbox batch, use the H-provided inner matter create option and rebuild
  once after the batch. Test partial failure and final freshness.
- Log an unexpected outer poll failure and prove a later poll runs.
- Store a stable scheduler failure message. Put exception detail only in the
  local log.
- Reuse one `httpx.AsyncClient` per OpenAI-compatible provider instance. Add
  `close()` and prove `ProviderRouter.close()` closes it. A configuration swap
  must not reuse the old client.

### H · Matter facade split, final-path pointer, and async callers

```yaml
id: matter-service-seams
depends_on: [observability-host, index-foundation]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_matters.py tests/test_matter_state.py tests/test_matter_lifecycle.py tests/test_work_product.py tests/test_research.py tests/test_watch_scans.py -q
provides:
  - MatterService.create(..., rebuild=False) for an owning batch
```

Required work:

- Extract work-item, participant, and lifecycle behavior into the three owned
  focused modules. Keep `MatterService` as the public facade so existing imports
  and callers continue to work.
- Do not move unrelated methods only to reduce line count. Each extracted
  module must have one clear responsibility and direct tests.
- Use `list_decisions(matter_id=...)` for matter detail.
- Read and validate `current_work_product_final_path` first. Keep a tested
  legacy scan fallback and backfill the pointer when safe.
- Add the explicit inner-create `rebuild=False` contract needed by scheduler
  batches. Default behavior remains eager and current.
- Replace async rebuild calls in research and Watch scans with
  `await rebuild_async()`.
- Collapse verified compound-operation duplicate rebuilds to one final rebuild.
- Keep recommendation records separate from explicitly recorded decisions.
- Log unexpected research and Watch failures without private content.

### I · Frontend pure-helper extraction

```yaml
id: frontend-helper-extraction
depends_on: []
implementer: terra-high-implementers
reviewer: sol-medium-reviewers
check:
  - cd frontend && npm run check:matter-workspace-helpers
  - cd frontend && npm run typecheck
```

Required work:

- Move the ten identified pure helpers from `MatterWorkspace.tsx` into
  `frontend/lib/matter-workspace.ts`.
- Export and test them with the repository's dependency-free Node check style.
- Add only the matching package script. Do not add a test framework or package.
- Preserve rendered structure, state ownership, design roles, and behavior.

### J · Repository hygiene and compatibility documentation

```yaml
id: repository-hygiene
depends_on: [all coding chunks accepted]
implementer: owner-gated
reviewer: owner-and-coordinator
```

This chunk is part of the milestone. It is not optional, but its destructive
steps require owner approval.

Required sequence:

1. Produce a read-only inventory of tracked `tmp/`, `graphify-out/`, `vault/`,
   `vault2/`, top-level handoff documents, and untracked experiment data.
2. Classify each group as required, generated, synthetic, or possibly
   confidential. Do not infer confidentiality from a pattern scan.
3. Present exact proposed `.gitignore`, untracking, deletion, history-rewrite,
   and credential-rotation actions separately.
4. Obtain explicit owner approval for the exact targets.
5. Record the approved write scope in the progress file. Apply only that scope.
6. Keep `graphify-out/` unless the owner also approves a replacement for the
   repository workflow that depends on it.
7. If confidential data reached a remote, do not claim `git rm --cached` cleans
   history. Record and execute the separately approved recovery plan.
8. Add a contributor note that `backend/frontmatter.py` is the intentional
   compatibility shim and `python-frontmatter` must not be installed.

If the owner chooses to keep an artifact group, record the reason. That recorded
decision closes the item. Silence or a missing decision does not.

## Dependency waves

The runtime permits at most three active workers in addition to the
coordinator.

```text
Wave 1: A · D · I
         review each completed chunk

Wave 2: B1
         Sol High must accept B1 before its dependents start

Wave 3: C · E · H
         all depend on the accepted B1 contract

Wave 4: G · F
         G depends on H; F is serialized after B1 because both own runtime.py

Wave 5: B2
         serialized after B1, E, H, and F because it owns their integration seams

Wave 6: corrections · combined integration review · broad verification

Wave 7: J read-only inventory · owner decision · approved hygiene actions
```

Unused capacity is acceptable. Do not split work only to fill a slot.

## Review and escalation policy

The coordinator reviews ownership and focused evidence for every chunk. Sol
High reviews B1, B2, C, E, and H. Sol Medium reviews A, D, F, G, and I. A
reviewer must not be the same worker instance as the implementer.

Each review returns one result:

- `APPROVED`
- `CORRECTIONS REQUIRED`
- `ESCALATED`

Escalate before integration when:

- a worker changed a path outside its recorded scope;
- a required fail-first test did not fail for the expected reason;
- an existing assertion was weakened without a contract reason;
- a DOCX security rejection can reach `DocxDocument`;
- rejected ingestion leaves a new vault source or companion;
- any async function still calls synchronous `rebuild()`;
- a batch can return with a stale index or rebuild once per item;
- a registry fingerprint misses file addition, edit, or deletion;
- untrusted matter or file content remains in a system-role message;
- tool-driven agent creation can broaden the creator's tool set;
- FTS5 changes search scope, result shape, or stable ordering;
- the final-path fallback breaks an older vault;
- a protected decision, Watch, or lifecycle gate changes;
- private content can enter a log;
- the backend pass count falls below 682;
- any destructive repository action lacks exact owner approval.

Material corrections return to the original implementer when its scope still
fits. Re-review high-risk corrections.

## Coordinator integration and final verification

1. Compare all changed paths with the baseline, approved ownership, and owner
   hygiene decision.
2. Confirm all ten async `.rebuild()` call sites identified at planning time
   now use the async path:
   - four in `backend/app/tools/handlers.py`;
   - two in `backend/app/services/ingestion.py`;
   - two in `backend/app/services/scheduler.py`;
   - one in `backend/app/services/research.py`;
   - one in `backend/app/services/watch_scans.py`.
3. Re-run every chunk check.
4. Run:

   ```bash
   cd backend && .venv/bin/pytest -q
   cd frontend && npm run check:workspace-ux && npm run check:matter-workspace-helpers
   cd frontend && npm run typecheck && npm run build
   ```

5. Walk `docs/ACCEPTANCE_TESTS.md` in the browser. Capture fresh evidence for
   upload, matter chat, search, Briefing, scheduler-visible state, settings,
   and final work-product retrieval.
6. Run `graphify update .` after code is final.
7. Confirm tests and browser work did not change a repository vault.
8. Complete an owner-approved repository-vault guard or tracked-file check.
9. Update the progress file only from observed results.

No finding can be marked `DEFERRED` to complete this milestone. A failed item,
an unmade owner decision, or an unresolved material review finding keeps the
milestone open.

# Post-audit addendum — Mosaic Relay live workflow findings

This appendix was added after the 2 September 2026 Mosaic Relay live-agent UX
experiment. It appends six product findings to the milestone. It does not
change or replace the original 22 audit findings, chunks A through J, their
ownership, their baseline, or their acceptance rules.

## Added objective and payoff moment

Close the demonstrated gap between durable agent work and the state shown to
the lawyer. The payoff moment is one visible matter in which a long-running
comparison preserves useful work, reaches a truthful terminal state, exposes
the correct next action, and saves the intended legal response under the
correct artifact role even when public research is unavailable.

## Evidence and scope boundary

The experiment created ten independent fictional matters through visible UI
only. Runs 3, 6, 7, 8, 9, and 10 did not complete a normal end-to-end path.
Material repeated evidence was:

- chat or comparison work remained `Queued`, `Running`, `Working…`, or
  `Still working…` long enough to block the next action;
- saved artifacts and visible stage or work-state labels disagreed;
- a failed run claimed `No tool work completed` even though useful durable
  artifacts existed;
- research queues remained partial or queued when external authority was not
  available;
- repeated historical `Save as work product` controls made the active action
  ambiguous and sometimes saved an intake summary as the current draft;
- guided intake could repeat an answered question or fail to restore the next
  question automatically.

Public research was disabled in the observed local configuration. That is an
environment condition, not a request to add a provider or guarantee authority.
The existing best-effort, honestly labeled model-only output is a strength to
preserve. Browser-control timeouts, subagent visibility limits, and temporary
browser disconnections are also outside product scope.

## Added ownership map

| Chunk | Findings | Exact write scope | Risk | Review |
| --- | --- | --- | --- | --- |
| K · durable live-run reconciliation | UX-1; UX-2; UX-3; UX-5 backend | `backend/app/services/chat_runs.py`, `backend/app/services/research_runs.py`, `backend/app/services/matter_state.py`, `backend/app/services/work_product.py`, `backend/app/routers/chat.py`, `backend/tests/test_chat_runs.py`, `backend/tests/test_research.py`, `backend/tests/test_matter_state.py`, `backend/tests/test_work_product.py` | high | Sol High |
| L · visible workflow truth and active actions | UX-3 frontend; UX-4; UX-5 frontend; UX-6 | `frontend/components/ChatPanel.tsx`, `frontend/components/ChatCards.tsx`, `frontend/components/ResearchQueuePanel.tsx`, `frontend/components/MatterWorkspace.tsx`, `frontend/lib/matterActions.ts`, `frontend/scripts/check-chat-run-recovery.ts`, `frontend/scripts/check-research-queue.ts`, `frontend/scripts/check-workspace-ux.ts` | high | Sol High |

K starts only after B2, E, F, and H are accepted because it depends on their
settled provider, runner, research, work-product, matter, and index seams. L
starts after K and I are accepted. No K or L worker may edit a path owned by an
unfinished earlier chunk.

## K · Durable live-run reconciliation

```yaml
id: durable-live-run-reconciliation
depends_on: [indexed-query-paths, agent-tool-boundary, settings-policy, matter-service-seams]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd backend && .venv/bin/pytest tests/test_chat_runs.py tests/test_research.py tests/test_matter_state.py tests/test_work_product.py -q
```

Required work:

- Add fail-first lifecycle tests for a chat run that performs durable mutations
  and then times out or raises `AgentExecutionError`. Its terminal response
  must describe the useful saved work and must never claim `No tool work
  completed` when successful operation results or changed paths prove
  otherwise.
- Keep the existing bounded execution and final answer-only timeout attempt.
  Every chat run must finish as `completed`, `failed`, or `interrupted`, with a
  persisted `finished_at`, a useful stable status, preserved partial response,
  and retry eligibility where applicable.
- Make durable operation results and changed paths the reconciliation evidence.
  Do not depend only on an in-memory trace summary. Do not invent successful
  work when no durable evidence exists.
- Add a restart and timeout test showing that a queued or running research item
  reaches a terminal state. When public retrieval is unavailable but useful
  generated analysis was saved, use the existing completed-partial contract;
  do not leave later queue items indefinitely queued.
- Preserve research provenance. `No external authority retrieved`, supplied
  sources, verified sources, assumptions, and model-only analysis must remain
  distinct. A missing provider must not block delivery of useful work.
- Reconcile matter work state after saved draft, finalized work product,
  recommendation, decision, approval, and manual-delivery mutations. The
  stored artifacts remain authoritative evidence; a failed outer chat turn
  must not erase or contradict a successful inner mutation.
- Preserve recommendation-versus-decision separation and all protected
  lifecycle gates.
- Repair intake-question continuation so a saved answer cannot be presented as
  a new unanswered question. Automatic recovery must either restore one exact
  next question or reach a stable visible recovery state.
- Use the existing in-process run services and Markdown records. Do not add a
  queue, event bus, workflow engine, verifier agent, retry daemon, or new
  record type.

## L · Visible workflow truth and active actions

```yaml
id: visible-workflow-truth
depends_on: [durable-live-run-reconciliation, frontend-helper-extraction]
implementer: terra-high-implementers
reviewer: sol-high-reviewers
check:
  - cd frontend && npm run check:workspace-ux
  - cd frontend && npm run check:chat-run-recovery
  - cd frontend && npm run check:research-queue
  - cd frontend && npm run typecheck
```

Required work:

- Show one unambiguous current run state and next action. Polling may continue
  in the background, but the UI must distinguish `Continue in background`,
  `Retry`, partial completion, terminal failure, and completed work.
- Replace ambiguous `Stop showing progress` wording with wording that makes it
  clear that server work continues. Hiding local progress must not clear the
  durable active-run identity or enable an incompatible second action.
- Refresh the matter, research queue, current artifacts, and lifecycle action
  once a run reaches a terminal state. A reconnect or reload must resume the
  same durable run instead of presenting a second current run.
- Explain combined state when stage and next actor are both material. For
  example, `Ready to send` may coexist with an assignment requirement only if
  the UI states who must be assigned and why. Do not show a bare contradictory
  pair such as `Needs assignment` and `Ready to send`.
- Make the primary save control belong only to the current eligible assistant
  response. Historical responses may remain readable, but they must not
  present an indistinguishable primary action. Do not add a new modal or
  artifact-management subsystem.
- Do not offer a generic work-product save for intake progress, research-status
  text, or other system-state messages. Saving a developed response must
  preserve its intended draft role and a useful title; it must not silently
  replace the canonical draft with an intake summary.
- Keep research items individually visible with terminal state words. When the
  result is partial, show the saved packet and allow the next safe lawyer
  action. Do not require successful public retrieval before drafting.
- Ensure every icon-only control in these changed surfaces has a stable
  accessible name. Preserve the existing `Close document` contract.
- Keep the current visual design roles and do not add page-local attention
  colors.

## Added dependency wave

Run this appended wave after Wave 5 and before the existing Wave 6 integration
and combined review:

```text
Wave 5A: K
           Sol High must accept the durable state contract

Wave 5B: L
           depends on accepted K and I behavior

Wave 6:   existing corrections, combined review, and broad verification
```

## Added acceptance script

This is one deterministic acceptance matter, not another ten-run experiment:

1. Use a temporary vault and configure public research as unavailable.
2. Create one matter with a developed comparison request.
3. Let one tool mutation save useful work, then force the outer chat run to its
   tested timeout or safe failure path.
4. Observe a terminal partial or failed state that names the saved work and
   never says no tool work completed.
5. Reload the matter and confirm the same terminal run, saved artifact, stage,
   next actor, and next action.
6. Open the saved artifact and confirm that an intake summary did not replace
   the developed legal draft.
7. Finish the draft-to-final-to-approval path and confirm each visible state
   word changes once.

## Added completion rules

- K and L focused checks pass with fail-first evidence for each behavioral
  defect.
- The existing Wave 6 broad checks include K and L paths and tests.
- The acceptance script passes without a second full UX experiment.
- Disabled public research still yields honest, useful, terminal partial work.
- No new queue, workflow engine, artifact type, provider requirement, or legal
  answer gate was added.
