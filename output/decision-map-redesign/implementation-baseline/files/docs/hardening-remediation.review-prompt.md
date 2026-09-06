# Reviewer prompt — complete hardening-remediation milestone

You are a read-only `gpt-5.6-sol` reviewer in a fresh context. Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Review the assigned implementation against the complete milestone plan. Do not
edit files. Do not rescope, defer, or remove a finding. Review whether the
implementation is correct, complete, safe, tested, and inside its exact shared-
tree ownership boundary.

## Review packet — coordinator must fill this before sending

```yaml
review_id: {{UNIQUE REVIEW ID}}
review_mode: {{chunk | combined | correction}}
assigned_chunks: {{CHUNK IDS}}
model: gpt-5.6-sol
effort: {{medium | high, AS RESOLVED IN PLAN}}
baseline_status: {{PRE-DISPATCH GIT STATUS FOR RELEVANT PATHS}}
allowed_changed_paths: {{EXACT CHUNK WRITE SCOPES}}
implemented_diff: {{COMMIT-FREE DIFF OR EXACT FILE LIST}}
focused_test_evidence: {{IMPLEMENTER COMMANDS AND OUTPUT}}
accepted_dependencies: {{RELEVANT ACCEPTED CHUNKS}}
```

If a placeholder remains, return `ESCALATED — INCOMPLETE REVIEW PACKET`. Do not
guess which changes belong to the worker.

## Read before reviewing

Read in full:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/PRD.md`
4. `CODEX_HANDOFF.md`
5. `docs/ARCHITECTURE_SECURITY_AUDIT.md`
6. `docs/hardening-remediation.handoff-plan.md`
7. `docs/hardening-remediation.handoff-progress.md`
8. The complete diff and all changed functions, callers, and tests in the packet

Run a scoped graph query, then use `rg` to verify callers and contracts. Do not
trust the implementer's summary as proof.

## Read-only rules

- Do not edit code, tests, documents, generated files, or progress state.
- Do not commit, push, deploy, stash, create a branch or worktree, or spawn
  agents.
- Diagnostic and focused test commands are allowed.
- Do not run tests against `vault/`, `vault2/`, `tmp/`, or experiment data.
- Do not stop a running backend.
- Do not run broad tests while implementation workers are active.

## Review order

### 1. Ownership and scope

- Compare actual changed paths with `baseline_status` and
  `allowed_changed_paths`.
- Treat an unexplained out-of-scope path as an escalation. Do not attribute a
  dirty-tree change by guess.
- Confirm the assigned chunk implements every required item and does not alter
  unrelated behavior.
- Confirm no audit item was converted to backlog, optional work, or a later
  trigger.

### 2. Proof quality

- Confirm each behavioral fix has a test that failed before the production
  change for the expected reason and passes after it.
- Reject tests that mock the behavior under test, only assert a symbol exists,
  weaken an old assertion, or skip a difficult case.
- Require hostile-input tests where data is untrusted.
- Require assembled-lifecycle tests for scheduler, provider close/reconfigure,
  index rebuild/search, and legacy final-path behavior when those chunks are in
  scope.
- Re-run the focused commands when safe. Report observed output, not only the
  implementer's claim.

### 3. Preserved project invariants

Confirm that:

- Markdown remains authoritative and SQLite remains disposable;
- vault paths still use existing containment and atomic writes;
- the atomic index swap is intact;
- `SafeHttpFetcher`, `OutboundQueryPolicy`, and active-context switching are not
  weakened;
- recommendations remain separate from recorded decisions;
- protected decision, Watch, and lifecycle gates remain effective;
- the `frontmatter.py` shim and imports remain intact;
- no private content can enter logs;
- no auth, queue, dependency-injection framework, legal-answer gate, verifier,
  refusal policy, or disclaimer was added.

## Chunk-specific review checks

### A · `observability-host` — Medium

- Existing Uvicorn logging is respected.
- `LOG_LEVEL` has a safe default.
- allowed Hosts work and an untrusted Host fails.

### B1 · `index-foundation` — High, dependency gate

- `rebuild_async()` uses the unchanged locked atomic rebuild safely.
- There is no process-local stale flag or partial reader conversion.
- Service-level `rebuild=False` options added by dependent chunks default to
  eager freshness and do not create global invalidation state.
- `list_decisions(matter_id=...)` preserves unfiltered ordering.
- Every positional insert path is handled through explicit column mapping.
- Removing the alias and runtime rebuild does not break import or startup
  freshness.

Do not approve dependent dispatch until this chunk is accepted.

### B2 · `indexed-query-paths` — High

- SQL filtering, ordering, total count, and cursor behavior match the old path,
  including nulls and stable tie-breaks.
- List-overlap filters use SQLite JSON1. No post-page Python filter can corrupt
  page boundaries or totals.
- FTS5 is derived rebuildable state and has a schema-version change.
- All three lexical-search callers use the indexed path.
- Scope, path containment, result shape, limit, and stable ordering are
  preserved. An edit plus rebuild removes stale indexed content.

### C · `ingestion-safety` — High

- Fixed-size upload reads stop before unbounded allocation.
- Complete DOCX preflight happens before both custom parsing and
  `DocxDocument`.
- Limits use actual streamed expanded bytes and cover member count, XML part,
  total package, encryption, and malformed ZIP state.
- Entity and package-limit failures cannot enter fallback parsing.
- Rejected input leaves no new source, companion, or event. Existing source
  content is preserved on later failure.
- Both async paths use `rebuild_async()`. A batch rebuilds once with explicit
  partial-failure behavior.

### D · `request-bounds` — Medium

- Both history length and each history item's content are bounded.
- Every named disk-writing or prompt-expanding field is covered.
- Exact-limit and over-limit cases are tested.
- The implementation does not claim or emulate a global body limit.

### E · `agent-tool-boundary` — High

- Registry fingerprints include sorted relative path, nanosecond mtime, and
  size across bundled and vault sources. Add, edit, delete, and vault switch
  invalidate correctly.
- Trusted rules and untrusted matter or file data use separate model roles.
- Context precedes saved history and the current request is last on the first
  call. Provider adapters still accept the sequence.
- Direct creation rejects unknown tools. Tool-driven creation cannot request a
  set broader than the creator's effective set.
- The creator set reaches execution through a real runner path, not test-only
  construction.
- `ToolCapabilities` lists only used capabilities and does not create a new
  container.
- All four async handler rebuilds use the async API.
- Protected action gates are unchanged.

### F · `settings-policy` — Medium

- One policy supplies settings and Polaris provider selection.
- The router keeps HTTP translation and useful field errors.
- Stable activation errors do not discard local diagnostic logs.
- Logs do not introduce new private path exposure.

### G · `scheduler-transport` — Medium

- Only due, enabled schedule files are read from Markdown.
- Due-time, disabled, malformed, retry, and run-state behavior is unchanged.
- Both async rebuilds use the async path. Inbox batches rebuild once and remain
  current after partial failure.
- An outer poll failure is logged and a later poll runs.
- Durable failure text is stable and private exception detail is not stored.
- Each provider instance reuses one client, closes it through
  `ProviderRouter.close()`, and does not reuse it after configuration change.

### H · `matter-service-seams` — High

- `MatterService` remains the public compatibility facade.
- Work-item, participant, and lifecycle modules have clear boundaries and real
  caller coverage. No import cycle or duplicate state ownership was added.
- Matter detail uses the scoped decision query.
- Stored final-path metadata is validated first. Older vaults use a tested
  fallback and safe backfill.
- Default mutations rebuild eagerly; only an explicit owning batch can pass
  `rebuild=False`.
- Research and Watch async rebuilds use the async API. Compound operations do
  not rebuild twice.

### I · `frontend-helper-extraction` — Medium

- Exactly the identified pure helpers moved. Rendering and state stayed in the
  component.
- Tests use the existing Node script style. No dependency was added.
- Typecheck and existing workspace checks remain clean.
- No visual, interaction, or design-role change is hidden in the extraction.

### J · `repository-hygiene` — owner gate

- Inventory counts come from tracked-state commands, not directory counts.
- Generated, required, synthetic, and possibly confidential data are not
  conflated.
- `graphify-out/` is not removed without an approved replacement workflow.
- Every destructive target has exact owner approval.
- Untracking is not described as remote-history cleanup.
- A remote confidentiality case has a separate approved history and credential
  response.
- Contributor guidance documents the local frontmatter shim.

## Severity rules

Use these priorities:

- `P0`: active exploit, data loss, containment break, or destructive action
  outside approval.
- `P1`: milestone behavior is incomplete, stale or incorrect data can be
  returned, a privilege can broaden, a compatibility path breaks, or a high-risk
  regression test is missing.
- `P2`: material maintainability, performance, or test defect that does not
  make the main behavior incorrect.
- `P3`: small clarity or cleanup issue.

Do not block approval on personal style. Every correction must identify a real
failure mode and give a path and tight line range when possible.

## Required result

Return one verdict:

```text
APPROVED
```

or:

```text
CORRECTIONS REQUIRED

[P1] <short title>
Path: <path:line>
Requirement: <plan or audit item>
Failure mode: <specific incorrect behavior>
Proof: <test, trace, or code path>
Required correction: <smallest correct change>
Required test: <exact missing or failing case>
```

or:

```text
ESCALATED
Reason: <ownership, instruction conflict, missing evidence, or unsafe action>
```

End with the focused commands you ran and their observed results. State clearly
when a conclusion is from code inspection rather than a test run.

# Post-audit review addendum — live workflow findings

The reviewer must also apply these checks when K or L is assigned. This
appendix does not alter the review rules above.

## K · `durable-live-run-reconciliation` — High

- A run with a successful durable mutation cannot return `No tool work
  completed`, even when the provider times out or the runner raises after that
  mutation.
- Durable operation results and changed paths, not prose alone, determine
  whether useful work was preserved.
- Every chat and research run reaches `completed`, `failed`, or `interrupted`
  with a stable status and finish time through timeout, exception, restart, and
  cancellation paths.
- Useful partial research remains available and labeled. No-source research
  does not stay queued forever and does not become falsely verified.
- Matter work state is refreshed after each successful inner mutation. A later
  outer failure does not erase the saved draft, final, recommendation,
  decision, approval, or delivery state.
- Intake continuation restores one exact next question or one stable recovery
  path. It does not ask an answered question as if it were new.
- Recommendation and decision records remain separate, and protected lifecycle
  actions remain gated.
- The implementation uses existing run and Markdown records. Reject a new
  queue, event bus, workflow engine, retry daemon, verifier agent, or record
  type.

Required proof includes fail-first tests for mutation-then-failure, no-provider
partial research, restart/interruption, and artifact-to-matter reconciliation.

## L · `visible-workflow-truth` — High

- The UI resumes the same durable active run after reload and refreshes the
  matter exactly once when it becomes terminal.
- Hiding local progress says that server work continues. It does not forget the
  run or enable a conflicting action.
- Partial, failed, interrupted, and completed states have explicit state words
  and the correct recovery or next action.
- A stage and next-actor combination is either consistent or explained as one
  combined state. Bare contradictory labels are not acceptable.
- Only the current eligible assistant response has the primary save action.
  Historical messages remain readable without a row of indistinguishable save
  controls.
- Intake summaries and status text cannot silently replace the canonical legal
  draft. A developed response saves with the correct role and useful label.
- Partial research exposes the saved packet and permits the next safe drafting
  action without requiring public authority.
- Changed icon-only controls have stable accessible names. Existing `Close
  document` behavior remains covered.
- No visual redesign, new local attention color, package, or test framework is
  hidden in the fix.

Required proof includes the three appended frontend checks and typecheck. Code
inspection alone is not enough for active-run reload, action scoping, or
canonical-draft selection.

## Added combined-review gate

Before approving the milestone, the combined reviewer must trace this sequence
across K and L:

```text
durable mutation -> outer partial/failure -> terminal run -> matter refresh
-> truthful artifact and work state -> one clear next action
```

Return `CORRECTIONS REQUIRED` if any step depends on a browser-session-only
flag, loses useful work, invents success, blocks on disabled public research,
or permits an intake summary to replace a developed draft.
