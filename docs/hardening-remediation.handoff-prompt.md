# Implementer prompt — complete hardening-remediation milestone

You are a `gpt-5.6-terra` High coding worker in a fresh context. Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Implement exactly one assigned chunk of the complete hardening-remediation
milestone. This milestone includes every finding in
`docs/ARCHITECTURE_SECURITY_AUDIT.md`. You may not remove, park, or rescope an
item. The coordinator controls dependency waves and assigns one chunk at a
time.

## Dispatch packet — coordinator must fill this before sending

```yaml
chunk_id: {{COPY ID FROM THE PLAN}}
outcome: {{COPY OUTCOME FROM THE PLAN}}
accepted_dependencies: {{COPY ACCEPTED DEPENDENCIES}}
write_scope: {{COPY EXACT WRITE SCOPE}}
read_scope: {{COPY USEFUL CONTEXT PATHS}}
required_work: {{COPY THE COMPLETE CHUNK SPECIFICATION}}
focused_checks: {{COPY EXACT CHECK COMMANDS}}
reviewer: {{COPY RESOLVED REVIEWER POOL}}
```

If any placeholder remains, stop and report `INCOMPLETE DISPATCH`. Do not infer
the missing scope or choose another chunk.

## Progress and resume protocol

Read `docs/hardening-remediation.handoff-progress.md` before starting. The
coordinator owns that file because workers share one tree. Do not edit it.

- Do not redo an accepted chunk.
- If your assigned chunk is already accepted, report `ALREADY COMPLETE`.
- If it is marked implemented but not reviewed, do not change it unless the
  coordinator explicitly assigns a correction.
- If an accepted dependency no longer passes its focused check, stop and
  report the exact failure. Do not reapply or repair that dependency.
- After each step, report the result to the coordinator. The coordinator records
  progress after checking the evidence.

## Read before editing

Read these files in full:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/PRD.md`
4. `CODEX_HANDOFF.md`
5. `docs/ARCHITECTURE_SECURITY_AUDIT.md`
6. `docs/hardening-remediation.handoff-plan.md`
7. `docs/hardening-remediation.handoff-progress.md`
8. Every production file and nearby test in your dispatch packet

Start with:

```bash
graphify query "<symbols, callers, and tests for the assigned chunk>"
```

Then use `rg` to verify every named path, symbol, signature, caller, and
configuration key. The plan is an implementation contract, but the repository
is the source for current code facts.

If the named code differs materially from the plan, stop and report:

```text
PLAN MISMATCH
Expected: <plan statement>
Observed: <path, line, and current behavior>
Needed ownership or decision: <exact item>
```

Do not invent a substitute design.

## Milestone chunk catalog

The coordinator assigns only one of these chunks. Exact specifications and
file ownership are in the dispatch packet.

| ID | Outcome | Dependencies |
| --- | --- | --- |
| `observability-host` | Standard logging foundation and local Host validation | none |
| `index-foundation` | Async rebuild API, matter decision filter, named inserts, dead-alias and duplicate-rebuild cleanup | none |
| `indexed-query-paths` | SQL Briefing filters and FTS5 lexical search with equivalence | `index-foundation`, `agent-tool-boundary`, `matter-service-seams`, `settings-policy` |
| `ingestion-safety` | Bounded upload and DOCX/XML processing with one batch rebuild | `observability-host`, `index-foundation` |
| `request-bounds` | Explicit list and item limits on high-amplification request fields | none |
| `agent-tool-boundary` | Registry caching, prompt role separation, tool permission enforcement, typed capability seam | `observability-host`, `index-foundation` |
| `settings-policy` | Shared provider policy, Polaris consistency, stable activation errors | `observability-host`, `index-foundation` |
| `scheduler-transport` | Indexed due filtering, visible failures, async and batch rebuilds, pooled HTTP client | `observability-host`, `index-foundation`, `matter-service-seams` |
| `matter-service-seams` | Focused matter modules, final-pointer use, async and compound rebuild cleanup | `observability-host`, `index-foundation` |
| `frontend-helper-extraction` | Ten pure helpers moved and tested without UI change | none |
| `repository-hygiene` | Owner-approved artifact disposition and shim documentation | all coding chunks accepted |

`repository-hygiene` is not a normal worker chunk. Its first phase is read-only.
No delete, untrack, history rewrite, or credential action can occur until the
owner approves exact targets and the coordinator sends a new exact write scope.

## Required implementation method

For each behavioral defect in the dispatch packet:

1. Add the narrow regression test.
2. Run that test before the production change.
3. Record the exact failing assertion or exception.
4. Make the smallest change that meets the chunk contract.
5. Run the focused test again.
6. Run the complete focused check from the dispatch packet.

For a mechanical extraction, prove unchanged behavior with the existing check
before and after, then add direct helper or facade tests.

A test that passes before the production change is not fail-first proof. Do not
weaken an assertion, remove a case, hide a failure with a mock, or add a skip.
If an existing test encodes a contract that must change, stop and report it.

When the code consumes content it does not control, include hostile-input tests:

- malformed or oversized archive and XML input for ingestion;
- unknown or privilege-broadening tool IDs for agent creation;
- malformed registry Markdown for registry caching;
- invalid provider response or transport failure for provider work;
- malformed schedule metadata for scheduler work.

For assembled lifecycles, use the real sequence in a focused test. Examples are
provider create/use/close/configure-again, scheduler poll/fail/poll-again, index
rebuild/search/rebuild-after-edit, and legacy final-path lookup/backfill.

## Shared-tree ownership rules

- Write only the paths in `write_scope`.
- Other workers can be active in the same repository.
- If the correct change needs another path, stop and name that path. Do not
  duplicate logic to avoid the boundary.
- Preserve all pre-existing and other accepted changes.
- Do not edit `docs/hardening-remediation.handoff-progress.md`.
- Do not commit, push, deploy, stash, create a branch or worktree, revert user
  work, or spawn agents.
- Run only your focused checks while other workers are active. The coordinator
  runs repository-wide checks at wave boundaries.

## Technical guard rails

- Markdown is authoritative. SQLite is disposable derived state.
- Keep the index temporary-file build, integrity check, WAL retirement, and
  atomic `os.replace` sequence unchanged.
- Do not add a process-local lazy-invalidity flag or reader-side
  `ensure_current()` protocol. Use `rebuild_async()` in async code and explicit
  inner `rebuild=False` plus one owning-boundary rebuild for batches.
- Keep file operations inside `VAULT_PATH` through existing vault methods and
  `ensure_within`.
- Never run a test against `vault/`, `vault2/`, `tmp/`, or experiment data.
- Do not stop a running backend.
- Keep `SafeHttpFetcher`, `OutboundQueryPolicy`, and
  `ActiveContextManager` behavior unchanged.
- Keep recommendations separate from recorded decisions.
- Keep decision, Watch, and lifecycle permission gates.
- Do not add authentication, a queue, a dependency-injection framework, a
  verifier agent, legal-answer gates, refusal behavior, or legal disclaimers.
- `backend/frontmatter.py` is an intentional shim. Do not install
  `python-frontmatter` or change imports to it.
- `defusedxml` is the only planned new backend dependency. The frontend helper
  chunk adds no package.
- Do not log prompts, uploaded text, document bodies, API keys,
  authorization headers, private paths, or other private content.
- Do not make unrelated formatting or cleanup changes.

## Blocker policy

Continue through a safe, reversible uncertainty when reading the named code
gives one clear conservative answer. Stop and report when:

- required input, permission, dependency, or access is unavailable;
- two instructions materially conflict;
- the named file or symbol differs materially from the dispatch packet;
- a correct fix needs a path outside `write_scope`;
- a focused verification still fails after one focused diagnosis;
- an existing user change prevents the scoped edit;
- proceeding needs an irreversible action or owner decision.

Do not stop for a warning, an unrelated pre-existing failure, or an ambiguity
that the named source code resolves.

## Required report

Return exactly these sections:

```text
STATUS: COMPLETE | BLOCKED | FAILED
CHUNK: <chunk_id>

Implemented
- <behavior and path>

Files changed
- <every written path>

Fail-first evidence
- <command and the pre-change failure>

Verification
- <command and observed result>

Preserved contracts
- <important invariant checks>

Uncertainty or risks
- <none, or exact issue>

Coordinator actions
- <progress lines to update, review needed, or ownership change needed>
```

Before returning `COMPLETE`, compare every changed path with `write_scope`, run
all focused checks, and re-read your assigned required work. A missing item
means the chunk is not complete.

# Post-audit dispatch addendum — live workflow findings

This appendix extends the chunk catalog after the Mosaic Relay live-agent UX
experiment. It does not change the instructions above. The coordinator may
dispatch these chunks only after their appended dependencies are accepted.

| ID | Outcome | Dependencies |
| --- | --- | --- |
| `durable-live-run-reconciliation` | Chat, research, artifact, and matter state reach truthful durable terminal results | `indexed-query-paths`, `agent-tool-boundary`, `settings-policy`, `matter-service-seams` |
| `visible-workflow-truth` | The active run, partial result, artifact role, stage, next actor, and next action agree on screen | `durable-live-run-reconciliation`, `frontend-helper-extraction` |

When either appended chunk is assigned, the dispatch packet must copy the
complete corresponding K or L specification and exact write scope from the
post-audit appendix in `docs/hardening-remediation.handoff-plan.md`.

## Additional implementation rules for K

- Start with `graphify query "chat run research run terminal state matter state work product reconciliation"`.
- Reproduce the contradiction in a focused test: one durable mutation succeeds,
  the outer run stops, and the current code reports no completed tool work.
- Treat persisted operation results, changed paths, run metadata, and matter
  metadata as evidence. Do not infer success from prose.
- Preserve partial work without converting a recommendation into a decision or
  bypassing an approval gate.
- Make all queued or running research work terminal after its existing bounded
  execution, restart, or interruption path. Preserve partial packets when they
  contain useful material.
- Use existing run and matter records. Do not add background infrastructure,
  generalized orchestration, or a new durable record type.

## Additional implementation rules for L

- Start with `graphify query "ChatPanel ResearchQueuePanel MatterWorkspace active run save work product next action"`.
- Use the K terminal-state contract; do not recreate workflow truth in a second
  frontend-only state machine.
- Keep only one current primary save action. Historical assistant messages must
  not expose indistinguishable primary controls.
- Prevent status or intake-summary text from silently becoming the canonical
  legal draft.
- State plainly when local progress is hidden but server work continues.
- Refresh once on terminal state and preserve the durable run across reload.
- Reuse current semantic design roles and the existing dependency-free frontend
  check style. Add no package or test framework.

## Added fail-first scenarios

The assigned worker must show the relevant case failing before production
edits and passing afterward:

1. successful tool mutation followed by chat timeout or agent failure;
2. partial research with no public retrieval and later queued work;
3. reload while one durable run is active, followed by terminal refresh;
4. historical assistant messages with multiple otherwise eligible save
   controls;
5. an intake summary followed by a developed response, where only the
   developed response becomes the canonical draft;
6. a ready-to-send matter that also needs assignment, with one clear combined
   explanation and next action.

Do not use a second ten-matter UX experiment as the chunk check. The coordinator
owns the single deterministic acceptance matter described in the plan.
