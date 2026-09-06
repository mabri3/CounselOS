# Architecture and security audit

Principal-architect and security review of the working tree whose `HEAD` was
`9c73a94` on 2 September 2026. The working tree was dirty. Findings refer to the
reviewed working tree, not only to committed code.

| | |
| --- | --- |
| Backend | 21,205 LOC at the original audit checkpoint |
| Frontend | 13,698 LOC at the original audit checkpoint |
| Tests | **682 passing** in 126.39s on the reviewed current tree |
| Backend loggers | **0** |
| Findings | 22 observations: 6 security, 8 performance, 1 operations, 1 architecture, 6 quality |

Frontend typecheck and production build also pass on the reviewed current tree.

Companion documents:

- `docs/hardening-remediation.handoff-plan.md` — complete milestone execution plan.
- `docs/hardening-remediation.handoff-prompt.md` — implementer prompt.
- `docs/hardening-remediation.review-prompt.md` — reviewer prompt.
- `docs/hardening-remediation.handoff-progress.md` — coordinator-owned progress.

## Overall health and milestone scope

The local MVP has good core controls. `SafeHttpFetcher` pins DNS results,
revalidates redirects, checks the peer address, and caps decompression.
`OutboundQueryPolicy` limits public egress. Vault paths pass through
`ensure_within`. Vault writes and the SQLite index swap are atomic. Vault
activation uses a lease-and-drain protocol.

This milestone closes every finding in this audit. Severity sets implementation
order and review depth. It does not remove an item from scope. Where the audit
describes an owner decision, that decision and its recorded outcome are part of
milestone completion.

### Scope note on authentication

This is a single-user local application. `scripts/dev.sh` binds both services to
`127.0.0.1`. Authentication remains outside the approved MVP. This audit does
not treat that product decision as a defect. The application must keep the
localhost boundary explicit and reject untrusted Host headers.

### Verdict by dimension

| Dimension | Assessment |
| --- | --- |
| Architecture | Clear service boundaries exist, but `AppContext` and `MatterService` are large. Split useful seams without adding a dependency-injection framework. |
| Security | Egress and path controls are strong. DOCX handling, request bounds, Host validation, prompt trust separation, tool permissions, and error handling need work. |
| Performance | Full rebuilds and repeated Markdown parsing are measurable. This milestone addresses them while preserving Markdown authority and SQLite disposability. |
| Maintainability | Tests are strong. Operational logging and several focused extractions are required. |
| Test baseline | 682 backend tests, frontend typecheck, and frontend production build pass. |

## Security and operations findings

### SEC-1 · DOCX archive expansion is not bounded — High

`_reviewed_docx` calls `ZipFile.read()` on attacker-controlled members. The
fallback then passes the same archive to `python-docx`, whose package reader also
uses unbounded ZIP-member reads. Limiting only `word/document.xml` in the custom
parser does not fix the fallback path.

Required outcome:

- Preflight the complete DOCX package before `_reviewed_docx` or
  `DocxDocument` runs.
- Limit member count, each relevant XML part, and total expanded bytes.
- Stream each member during preflight and enforce actual byte counts. Do not
  trust only `ZipInfo.file_size`.
- Reject encrypted members and malformed archives.
- Use `defusedxml.ElementTree.fromstring` for custom Word XML and native feed
  XML.
- Treat a package-limit or entity rejection as terminal. It must not enter the
  `python-docx` fallback.

Tests must build small malicious payloads in memory. Do not commit archive-bomb
fixtures.

### SEC-2 · Upload and request limits are incomplete — High

Both upload paths call `await upload.read()` without a size argument. The
application materializes the complete file before it checks the configured
limit. Several model fields can also write large text to disk or expand a model
prompt without an explicit item limit.

Required outcome:

- Read uploads in fixed-size chunks and stop after `max_upload_bytes + 1`.
- Run PDF and DOCX extraction through `asyncio.to_thread` in async request
  paths.
- Validate and extract before writing a new source or Markdown companion.
- Bound `ChatRequest.message`, `ChatRequest.history`, each
  `ChatMessage.content`, `FileUpdate.content`, matter request fields,
  recommendation content, and document-review content, body, quote, author,
  and ID fields.
- Use generous limits that support the current workflow. Test both the exact
  limit and one value over it.

These field limits do not create a global HTTP-body limit. Multipart spooling
and other request models remain separate concerns.

### SEC-3 · The localhost boundary has no Host-header validation — Medium

There is no `TrustedHostMiddleware`. Vault create and load endpoints accept
absolute paths, so DNS rebinding can weaken the local-only boundary even though
CORS is configured.

Required outcome:

- Allow `localhost`, `127.0.0.1`, and `testserver`.
- Add another host only when a supported start path proves that it is required.
- Keep authentication out of this milestone.

### SEC-4 · Matter and document data are placed in the system message — Medium

`ContextBuilder.build()` combines operating rules, user-editable matter files,
and the active document into one string. `AgentRunner` sends that string with
the `system` role.

Required outcome:

- Keep operating standards, the active agent contract, skill rules, audience
  guidance, and the final execution rule in the system message.
- Put matter records, work state, durable decisions, matter Markdown files, and
  active-file content in a separate, clearly fenced user-role context message.
- Keep saved history after that context and the current user request last on the
  first model call.
- Keep current content caps and protected-tool gates.

This change requires both `backend/app/agents/context.py` and
`backend/app/agents/runner.py`. A context-only edit cannot change model roles.

### SEC-5 · Agent tool permissions are not fully validated — Low

Direct and tool-driven agent creation accept arbitrary tool IDs. Unknown IDs
create broken agents. A tool-driven agent can also request a broader registered
tool set than its creator.

Required outcome:

- Direct human API creation and update reject unknown tool IDs.
- Tool-driven creation restricts requested tools to the creating agent's
  effective allowed set.
- Pass the creator's effective capability set through the runner and tool
  execution boundary. Checking only that an ID exists is insufficient.
- Preserve the existing decision, Watch, and lifecycle gates.

### SEC-6 · Raw exception text reaches durable or client-visible state — Low

Vault activation and scheduler failure state can include raw exception text.

Required outcome:

- Return or persist a stable, useful message.
- Keep diagnostic detail in local server logs.
- Never log model prompts, document text, API keys, authorization headers, or
  other private content.

### OPS-1 · Unexpected failures can disappear — Medium

The backend has no standard logger configuration. There are 18 `except` blocks
whose only statement is `pass`, but they are not all defects. Cancellation,
disposable-cache cleanup, and optional legacy parsing can be expected paths.

Required outcome:

- Add one standard-library logging configuration that respects an existing
  server logging setup.
- Log unexpected failures where no durable, user-visible failure exists.
- Prove that an unexpected scheduler poll failure is logged and the loop
  continues.
- Keep expected cancellation and fallback paths quiet or at `debug` level.

Do not mechanically log every `except: pass` block.

## Performance findings

### PERF-1 · Index rebuild work is synchronous and repeated

There are 55 explicit `.rebuild()` calls in application code; one is the
`IndexService` constructor path. Ten occur inside `async def`. The audit measured
about 158 ms for a full rebuild of the 715-file repository vault.

Required outcome:

- Add and use a tested `rebuild_async()` path for every async caller.
- Collapse known compound and batch mutations to one final rebuild.
- Remove duplicate rebuilds where a service and its caller both rebuild.
- Keep individual synchronous mutations eager and current before return.
- Preserve the atomic temporary-file build, integrity check, WAL retirement,
  and `os.replace` sequence.

Do not use a process-local `request_rebuild()` / `ensure_current()` stale flag.
It can return stale data after a partial conversion and cannot coordinate
multiple processes. Prefer an explicit `rebuild=False` option on an inner
mutation and one rebuild at the owning batch boundary.

### PERF-2 · Registries reparse Markdown on each lookup

The audit measured about 25 ms for tools and 6 ms for agents.

Required outcome:

- Cache parsed registry results.
- Invalidate from a complete fingerprint of both bundled and vault sources.
- The fingerprint must include each sorted relative path, `st_mtime_ns`, and
  size so that additions, edits, and deletions are detected.

A maximum-directory-mtime key is not correct. It can miss a change or deletion
of a file that did not supply the maximum value.

### PERF-3 · Briefing filtering and pagination happen in Python

Required outcome:

- Move scalar filters, ordering, and cursor pagination into SQLite.
- Preserve exact sort, filter, and cursor behavior with equivalence tests.
- Use the verified SQLite JSON1 support for list-overlap filters. Filtering,
  total count, ordering, and cursor selection all happen before the page is
  returned from SQLite.

### PERF-4 · Matter-scoped decision reads start from all decisions

Required outcome:

- Add an optional `matter_id` filter to `IndexService.list_decisions`.
- Use it from `ContextBuilder`, `MatterService`, and other one-matter callers.
- Preserve the unfiltered call for screens that need all decisions.

### PERF-5 · Matter final-path discovery rescans files

The current working tree already persists
`current_work_product_final_path` and `current_work_product_final_id` during
finalization. The remaining problem is that `MatterService` ignores the pointer
and scans files.

Required outcome:

- Read and validate the stored pointer first.
- Keep a tested legacy fallback for older vaults and backfill the pointer when
  safe.
- Do not add a second final-path field or remove compatibility without proof.

### PERF-6 · OpenAI-compatible calls do not reuse connections

Required outcome:

- Reuse one `httpx.AsyncClient` per provider instance.
- Add `close()` and use the existing `ProviderRouter.close()` lifecycle.
- Do not share a client across a provider configuration swap.

### PERF-7 · Vault lexical search reads every text file

Required outcome:

- Add an FTS5 table to the disposable SQLite index and populate it during the
  existing index build.
- Route lexical search through FTS5 while preserving supported scopes, limits,
  result shape, and stable ordering.
- Add result-equivalence and schema-version tests.
- Keep Markdown authoritative. The FTS table is rebuildable derived state.

### PERF-8 · The scheduler rereads all schedule Markdown every poll

Required outcome:

- Filter the existing indexed schedule rows by `enabled`, `kind`, and
  `next_run_at` before reading Markdown.
- Read only due schedule files.
- Preserve due-time, disabled-schedule, malformed-record, and retry behavior.

This can use the existing `list_schedules()` rows. Do not add another index API
unless the existing result cannot express the contract.

## Architecture finding

### ARCH-1 · `AppContext` and `MatterService` are too broad

`AppContext` is a large service container. `MatterService` was 1,188 lines with
46 methods in the reviewed tree.

Required outcome:

- Move provider-settings selection into a focused policy function used by the
  settings router and Polaris integration.
- Replace the broad tool-handler `Any` boundary with a small structural
  `ToolCapabilities` protocol that names only capabilities handlers use.
- Extract matter work-item, participant, and lifecycle behavior into focused
  modules while keeping `MatterService` as the compatibility facade.

Do not add a dependency-injection framework. Do not rewrite `AppContext`.

## Code-quality findings

### QUAL-1 · `index.py` has dense schema and positional insert code

Convert all current positional `INSERT` paths to explicit named column mapping
or another equally clear table-specific mapping. Cover the mapping with tests
that would fail after a column-order change. Do not rely on a hard-coded count
of statements; the generic model-table insert path represents several tables.

### QUAL-2 · A dead index alias conflicts with a live protocol name

Remove `AwarenessIndex = IndexService` after confirming no imports use it.

### QUAL-3 · `MatterWorkspace.tsx` contains independently testable helpers

Extract the identified pure helpers into a focused frontend module and add unit
tests. Keep rendering, state ownership, and user-visible behavior unchanged.

### QUAL-4 · Repository artifacts need owner classification

The reviewed tree tracks 244 files under `tmp/`, 1,930 under `graphify-out/`,
715 under `vault/`, and 23 under `vault2/`. There are 15 top-level
`*.handoff-{plan,progress,prompt}.md` documents, plus `CODEX_HANDOFF.md`. Dated
UX experiment directories were untracked, not committed.

Required outcome:

- Produce an exact tracked-file inventory and classify generated, required,
  synthetic, and possibly confidential data.
- Keep `graphify-out/` unless the owner approves another durable graph workflow;
  repository instructions use it.
- Obtain owner approval before any untracking or history rewrite.
- Apply the approved `.gitignore` and index cleanup precisely.
- If confidential data was pushed, record the separate history-cleanup and
  credential-rotation decision. `git rm --cached` alone is insufficient.

A source pattern scan found no obvious private keys outside vault content. That
is not a personally identifiable information or confidentiality attestation.

### QUAL-5 · Settings validation mixes policy with transport

Extract the provider-selection and validation rules into a focused service or
policy module. Keep the router responsible for HTTP translation. Reuse the same
policy from Polaris configuration so the two paths cannot drift.

### QUAL-6 · `backend/frontmatter.py` is an intentional compatibility shim

Document this fact in contributor guidance. Do not install
`python-frontmatter` and do not change existing imports to the third-party
package.

## Milestone remediation order

| Wave | Items | Reason |
| ---: | --- | --- |
| 1 | OPS-1 logging foundation, SEC-3, SEC-2 request fields, QUAL-3 | Independent foundations and bounded surface work |
| 2 | PERF-1, PERF-4 index API, QUAL-1, QUAL-2 | Shared index contracts needed by later work |
| 3 | SEC-1, SEC-2 ingestion, SEC-4, SEC-5, PERF-2, PERF-5, ARCH-1 tool and matter seams | Uses reviewed Wave 2 contracts |
| 4 | PERF-3, PERF-7, PERF-6, PERF-8, SEC-6, OPS-1 scheduler proof, ARCH-1 settings policy, QUAL-5 | Serial index query work and dependent runtime work |
| 5 | QUAL-4, QUAL-6, integration review, full verification | Owner-gated hygiene and final evidence |

The handoff plan contains exact file ownership, dependencies, worker routing,
tests, and completion rules.

## Preserved invariants

- `SafeHttpFetcher` and `OutboundQueryPolicy` behavior.
- `ensure_within` and atomic `VaultService` writes.
- `ActiveContextManager` and its vault-switch protocol.
- The index rebuild-and-swap sequence.
- Markdown as source of truth and SQLite as disposable derived state.
- Separation between recommendations and recorded decisions.
- Existing protected-tool gates.
- `backend/frontmatter.py` and its imports.

# Post-audit live-agent UX addendum — Mosaic Relay

This appendix records evidence from the 2 September 2026 Mosaic Relay
visible-browser experiment. Ten independent fictional matters covered
onboarding, background checks, payments, merchant deactivation, privacy,
sanctions, refunds, and marketing. It adds six product findings. It does not
revise the original 22 architecture and security findings or their historical
counts.

The strongest preserved behavior is graceful degradation: the application
usually retained useful legal analysis, labeled missing authority, and kept
recommendations separate from explicitly recorded decisions. The main defect
is that durable work, background-run state, matter stage, and visible next
action can disagree.

## UX-1 · Durable chat runs can outlive clear UI progress and block work — High

Runs 3, 6, 7, 8, 9, and 10 remained in `Being researched`, `Working…`, or
`Still working…` states while later actions were unavailable. Run 8 showed
`Still working… 140s` after `Compare both paths`, with finalization disabled.
Browser-control waits are not product defects, but the persisted product state
remained non-terminal after the browser reconnected.

Required outcome:

- Every chat run reaches a durable terminal state through success, timeout,
  provider failure, application restart, or interruption.
- The UI can stop watching without forgetting the durable run or enabling an
  incompatible second action.
- Reload resumes the same run and refreshes matter state when it becomes
  terminal.
- Terminal failure and partial completion expose a useful recovery or next
  action.

## UX-2 · Failure text can contradict successful durable mutations — High

Run 10 displayed `Themis.ai could not finish this request` and `No tool work
completed` even though facts, issues, a research dossier, and a working
recommendation were visibly saved. Similar runs retained useful artifacts while
the outer action remained failed or running.

Required outcome:

- Persisted operation results and changed paths determine whether tool work
  completed.
- A failed outer model turn cannot erase or contradict successful inner
  mutations.
- Partial responses name saved useful work and identify the remaining action.
- `No tool work completed` appears only when durable evidence confirms that no
  mutation succeeded.

## UX-3 · Research queues do not always reach a usable terminal state — High

Public research was disabled in the observed local configuration. The absence
of authority is therefore an environment condition, not evidence that the
fetcher is defective. The product correctly saved model-only analysis with
labels such as `No external authority retrieved` and `Partial`.

The defect is queue and workflow completion. Runs 2 and 10 left research items
partial or queued, and runs 3, 8, and 9 could not proceed normally after
research or comparison work stalled.

Required outcome:

- Unavailable public research produces terminal, honestly labeled partial or
  failed items.
- Useful partial packets remain available.
- Later queue items do not remain queued indefinitely after an earlier
  no-provider result.
- Drafting can continue from labeled partial research. External authority is
  not a completeness gate.

## UX-4 · Matter stage, next actor, artifacts, and lifecycle action can disagree — High

Run 3 contained 22 artifacts but remained `Being researched`. Run 4 recorded a
durable decision and displayed both `Ready to send` and `Needs assignment` with
no combined explanation. Run 5 finalized the canonical work product while the
response request remained active. Run 6 retained `Just came in` after intake
and a saved draft.

Required outcome:

- Recompute visible work state after every successful draft, finalization,
  recommendation, decision, approval, delivery, and terminal-run mutation.
- Show one clear current state and next action.
- When stage and assignment are both valid, explain their relationship and the
  required assignee instead of presenting a bare contradiction.
- Preserve explicit approval and decision gates.

## UX-5 · Historical response actions and artifact roles are ambiguous — Medium

Several runs displayed 6 to 13 identical `Save as work product` buttons in the
rendered chat history. Actors had to select the last matching control, and runs
6, 8, and 10 saved intake-oriented content as a current draft. Run 4 displayed
lawyer work under a research-packet filename even though the document heading
identified it as lawyer work product.

Required outcome:

- Only the current eligible response exposes the primary save action.
- Intake progress and status messages cannot silently become the canonical
  legal draft.
- Saved drafts retain a useful title and explicit artifact role.
- Historical work remains readable without presenting indistinguishable
  primary actions.

## UX-6 · Intake continuation and progress wording are not reliable — Medium

Run 1 displayed `The next intake question could not be restored automatically`.
Runs 2 and 6 repeated issues that had already been answered or skipped. Run 5
announced one next question and then asked another. Run 10 exposed `Stop showing
progress`; the adjacent text explained that server work continued, but the
control still required interpretation.

Required outcome:

- Persist answered, skipped, and open question state so one answer is not
  presented again as a new question.
- Restore one exact next question or show one stable manual recovery path.
- Keep announced and actual question order consistent.
- Use wording that clearly distinguishes hiding local progress from canceling
  server work.

## Observations that do not add product findings

- The initial Settings `Failed to fetch` screen occurred while no backend was
  listening on port 8000. Normal setup succeeded after the existing backend
  started.
- Public authority retrieval was unavailable because the observed research
  provider was disabled. The addendum does not require a provider.
- Browser-control timeouts, subagent visibility limits, and temporary in-app,
  Chrome, or Safari connection failures are test-environment issues.
- `DocumentPanel` currently gives its close button the accessible name `Close
  document` and has a focused check. The reported locator failures do not prove
  a current product accessibility defect.
- The optional public-website question and company-profile review step added
  limited setup cost but did not block saving and do not warrant new milestone
  machinery.

## Added remediation order

| Wave | Items | Reason |
| ---: | --- | --- |
| 5A | UX-1, UX-2, UX-3, UX-4 backend, UX-6 backend | Establish one durable truth after the existing provider, runner, matter, work-product, and index seams settle |
| 5B | UX-4 frontend, UX-5, UX-6 frontend | Render the settled backend contract and remove ambiguous actions |
| 6 | Existing combined review and full verification | Verify all original and appended findings together |

The exact K and L ownership, tests, dependencies, and deterministic acceptance
script are appended to `docs/hardening-remediation.handoff-plan.md`.

## Additional preserved invariants

- Useful work remains visible when research, citations, schema parsing, or the
  final model turn fails.
- Missing public authority never blocks delivery of a labeled best-effort
  answer.
- Durable artifacts, not transient browser state, determine completed work.
- Recommendations do not become decisions without explicit lawyer action.
