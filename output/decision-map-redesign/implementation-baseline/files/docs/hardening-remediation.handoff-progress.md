# Progress — complete hardening-remediation milestone

This file is the coordinator's durable execution record. Workers and reviewers
must not edit it because they share one working tree.

Allowed states:

- `pending`
- `in progress — <worker or owner>`
- `implemented — review pending`
- `corrections required — <short reason>`
- `accepted — <evidence>`
- `blocked — <exact external requirement>`
- `failed — <exact observed failure>`

Only the coordinator changes a line after checking the worker report, changed
paths, and test evidence. Do not mark an item accepted from a worker claim
alone. Do not use `deferred` or `not scheduled`; every audit finding is part of
this milestone.

## Baseline

- [x] Repository instructions read — accepted
- [x] Audit and codebase reviewed — accepted
- [x] Pre-existing dirty-tree state recorded — accepted
- [x] Backend baseline — accepted: 682 passed, 1 warning in 126.39s
- [x] Frontend baseline — accepted: typecheck and production build clean
- [ ] Baseline status attached to each dispatch — pending

## Wave 1

### A · `observability-host`

- [x] A1: Add standard-library logging configuration — accepted
- [x] A2: Configure logging before FastAPI construction without replacing server logging — accepted
- [x] A3: Enforce localhost, loopback, and test Host headers — accepted
- [x] A-check: focused tests pass — accepted: 3 passed, 1 existing dependency warning
- [x] A-review: Sol Medium review accepted — accepted: no findings

### D · `request-bounds`

- [x] D1: Bound chat message and history count — accepted
- [x] D2: Bound each nested chat message content value — accepted
- [x] D3: Bound file, matter, and recommendation text fields — accepted
- [x] D4: Bound document-review content, body, quote, author, and ID fields — accepted
- [x] D5: Prove exact-limit acceptance and over-limit rejection — accepted
- [x] D-check: focused tests pass — accepted: 17 passed, 1 existing dependency warning
- [x] D-review: Sol Medium review accepted — accepted: no findings after correction

### I · `frontend-helper-extraction`

- [x] I1: Identify and record the ten pure helpers — accepted: ten helpers covered by direct check
- [x] I2: Extract helpers without moving render or state behavior — accepted
- [x] I3: Add dependency-free Node checks and package script — accepted
- [x] I4: Preserve current workspace checks and typecheck — accepted
- [x] I-review: Sol Medium review accepted — accepted: no findings

## Wave 2

### B1 · `index-foundation`

- [x] B1.1: Add fail-first async rebuild coverage — accepted: focused regression test
- [x] B1.2: Add `rebuild_async()` around the unchanged atomic rebuild — accepted
- [x] B1.3: Add optional matter filter to `list_decisions` — accepted
- [x] B1.4: Convert all positional index inserts to explicit mappings — accepted: schema mapping check
- [x] B1.5: Remove the unused `AwarenessIndex` alias — accepted: no callers
- [x] B1.6: Remove duplicate startup rebuild without losing freshness — accepted: one startup rebuild test
- [x] B1-check: focused tests pass — accepted: 32 passed, 1 existing dependency warning
- [x] B1-review: Sol High dependency-gate review accepted — accepted: no findings

## Wave 3

### C · `ingestion-safety`

- [x] C1: Add `defusedxml` dependency in the existing requirement style — accepted
- [x] C2: Add fail-first bounded upload read tests — accepted
- [x] C3: Read uploads in fixed-size chunks with a running cap — accepted
- [x] C4: Add fail-first whole-package DOCX limit and malformed archive tests — accepted
- [x] C5: Preflight before custom parsing and `DocxDocument` — accepted
- [x] C6: Enforce member, XML part, total, actual-byte, and encryption limits — accepted
- [x] C7: Add fail-first DOCX and feed entity tests — accepted
- [x] C8: Make XML parsing entity-safe and security rejection terminal — accepted
- [x] C9: Validate and extract before persistence — accepted
- [x] C10: Run PDF and DOCX extraction off the event loop — accepted
- [x] C11: Use async rebuilds in both upload paths — accepted
- [x] C12: Rebuild once per batch with tested partial-failure behavior — accepted
- [x] C-check: focused tests pass — accepted: 59 passed, 1 existing dependency warning
- [x] C-review: Sol High review accepted — accepted after two corrections, no findings

### E · `agent-tool-boundary`

- [x] E1: Add complete registry fingerprint and cache tests — accepted
- [x] E2: Cache agent and tool registries with add, edit, delete, and vault-switch invalidation — accepted
- [x] E3: Add fail-first provider-message role and ordering tests — accepted
- [x] E4: Separate trusted system rules from fenced user-role data — accepted
- [x] E5: Keep saved history after context and current request last — accepted
- [x] E5a: Verify all provider adapters accept the resulting message sequence — accepted
- [x] E6: Use matter-scoped decision reads in context — accepted
- [x] E7: Reject unknown tool IDs in direct create and update — accepted
- [x] E8: Prevent tool-driven permission broadening from the creator's effective set — accepted after runtime-ID correction
- [x] E9: Carry creator capabilities through runner and execution context — accepted
- [x] E10: Add focused `ToolCapabilities` protocol without a new container — accepted
- [x] E11: Convert four async handler rebuilds — accepted
- [x] E12: Prove protected decision, Watch, and lifecycle gates remain effective — accepted
- [x] E-check: focused tests pass — accepted: 87 passed, 1 existing dependency warning
- [x] E-review: Sol High review accepted — accepted after P1 correction, no findings

### H · `matter-service-seams`

- [x] H1: Add characterization tests for facade behavior — accepted
- [x] H2: Extract work-item behavior into its focused module — accepted
- [x] H3: Extract participant behavior into its focused module — accepted
- [x] H4: Extract lifecycle behavior into its focused module — accepted
- [x] H5: Keep `MatterService` as the public facade — accepted after duplicate-method corrections
- [x] H6: Use matter-scoped decision reads in matter detail — accepted
- [x] H7: Use and validate stored final-path metadata first — accepted
- [x] H8: Keep legacy final-path fallback and safe backfill — accepted
- [x] H9: Add eager-by-default inner matter create rebuild option for batches — accepted
- [x] H10: Convert research and Watch scan async rebuilds — accepted including failure paths
- [x] H11: Collapse verified compound duplicate rebuilds — accepted after ordering correction
- [x] H12: Preserve recommendation and decision record separation — accepted
- [x] H-check: focused tests pass — accepted: 120 passed, 1 existing dependency warning
- [x] H-review: Sol High review accepted — accepted after corrections, no findings

## Wave 4

### G · `scheduler-transport`

- [x] G1: Filter indexed schedule rows before reading due Markdown — accepted
- [x] G2: Preserve disabled, due-time, malformed, retry, and state behavior — accepted
- [x] G3: Convert both async scheduler rebuilds — accepted
- [x] G4: Rebuild once per inbox batch with tested partial failure — accepted
- [x] G5: Log outer poll failure and prove a later poll runs — accepted
- [x] G6: Store stable scheduler failure text and log local detail — accepted
- [x] G7: Reuse one HTTP client per OpenAI-compatible provider instance — accepted
- [x] G8: Close clients through `ProviderRouter.close()` — accepted
- [x] G9: Prove a provider configuration swap does not reuse the old client — accepted including rebuild race correction
- [x] G-check: focused tests pass — accepted: 24 passed, 1 existing dependency warning
- [x] G-review: Sol Medium review accepted — accepted after P1 correction, no findings

### F · `settings-policy`

- [x] F1: Extract provider selection and validation policy — accepted
- [x] F2: Use the policy from the settings router and `AppContext` — accepted including stored transport values
- [x] F3: Add public Polaris configuration instead of private-field mutation — accepted
- [x] F4: Keep router HTTP mapping and useful field errors — accepted
- [x] F5: Replace raw vault-activation failures with stable text and local logs — accepted
- [x] F6: Prove settings and Polaris policy equivalence — accepted
- [x] F-check: focused tests pass — accepted: 66 passed, 1 existing dependency warning
- [x] F-review: Sol Medium review accepted — accepted after P1 corrections, no findings

## Wave 5

### B2 · `indexed-query-paths`

- [x] B2.1: Add old-versus-new Briefing query equivalence tests — accepted: 336 differential cases
- [x] B2.2: Move all filters, ordering, counts, and cursor pagination into SQL — accepted
- [x] B2.3: Preserve exact list-overlap and page-boundary behavior — accepted
- [x] B2.4: Add FTS5 schema, build population, and schema-version tests — accepted
- [x] B2.5: Add indexed lexical-search equivalence and stale-content replacement tests — accepted
- [x] B2.6: Inject the index into live search through `AppContext` — accepted
- [x] B2.7: Update search, research, and tool-handler callers to the indexed path — accepted
- [x] B2.8: Preserve scope, containment, result shape, limit, and ordering — accepted after lexical corrections
- [x] B2-check: focused tests pass — accepted: 127 passed, 1 existing dependency warning
- [x] B2-review: Sol High review accepted — accepted after P1/P2 corrections, no findings

## Wave 6 · integration and combined review

- [x] All actual changed paths match baseline plus accepted ownership — accepted: remediation paths were reviewed in their recorded scopes; pre-existing dirty paths were preserved
- [x] All ten async rebuild call sites use `rebuild_async()` — accepted: four handler calls use `_rebuild_index`, with two ingestion, two scheduler, one research, and one Watch-scan async call
- [x] All chunk-focused checks rerun by coordinator — accepted: full backend suite and all frontend checks passed
- [x] Sol High combined review has no unresolved material finding — accepted: each high-risk chunk was accepted after its final Sol High review
- [x] Sol Medium combined review has no unresolved material finding — accepted: each normal-risk chunk was accepted after its final Sol Medium review
- [x] Corrections implemented and re-reviewed where required — accepted
- [x] Full backend suite exceeds 682 tests and passes — accepted: 776 passed, 1 existing dependency warning
- [x] Frontend workspace checks and helper check pass — accepted: workspace UX, provider admin, adaptive intake, chat recovery, research queue, and helper checks passed
- [x] Frontend typecheck and production build pass — accepted
- [x] Browser acceptance walk completes with fresh evidence — accepted: upload control, chat terminal state, Briefing search, automation state, settings, and saved draft retrieval observed
- [x] Repository vault remains unchanged by tests and acceptance work — accepted: no new repository-vault status entries; the three modified agent files were already in the dirty baseline
- [x] `graphify update .` completes after final code — accepted: 2 September 2026 graph refresh completed

## Wave 7 · J repository hygiene and contributor guidance

- [x] J1: Produce exact tracked and untracked artifact inventory — accepted: `tmp/` 244 tracked and 25 untracked; `graphify-out/` 1,930 tracked and 2,315 untracked; `vault/` 715 tracked; `vault2/` 23 tracked and 93 untracked
- [x] J2: Classify required, generated, synthetic, and possibly confidential groups — accepted: graph is required generated workflow output; `tmp/` is synthetic experiment evidence; both vault roots are possibly confidential until owner review; handoff documents are project documentation
- [x] J3: Present exact `.gitignore`, untracking, deletion, history, and credential actions — accepted: the owner later selected local retention, root-anchored ignore rules, and index-only untracking for the four named directories; local deletion, history rewriting, and credential rotation were not selected
- [x] J4: Record owner decision for every group — accepted: owner directed that `tmp/`, `graphify-out/`, `vault/`, and `vault2/` remain on the local machine, be ignored by Git, and be removed from Git tracking
- [x] J5: Record exact approved write or destructive scope — accepted: add root-anchored ignore rules for the four named directories and remove only those paths from the Git index; do not delete their local contents
- [x] J6: Apply only owner-approved repository actions — accepted: the four named directories were added to `.gitignore` and their tracked paths were removed from the Git index with local contents preserved
- [x] J7: Keep or replace `graphify-out/` through an explicit owner decision — accepted: keep the local generated graph, stop tracking it, and regenerate it with `graphify update .` in a fresh clone
- [x] J8: Record separate remote-history and credential response when applicable — accepted: untracking does not remove prior Git history; no history rewrite or credential rotation was authorized
- [x] J9: Document the intentional local `frontmatter.py` shim — accepted: contributor guidance names the local shim and forbids `python-frontmatter`
- [x] J-check: verify tracked state matches the owner decision — accepted: all four directories remain present locally, are ignored, and have no tracked paths
- [x] J-review: owner and coordinator accept the result — accepted: owner supplied the disposition and the coordinator applied only that scope

## Milestone closeout

- [ ] Every SEC-1 through SEC-6 finding is accepted — pending
- [ ] OPS-1 is accepted — pending
- [ ] Every PERF-1 through PERF-8 finding is accepted — pending
- [ ] ARCH-1 settings, tool, and matter seams are accepted — pending
- [ ] Every QUAL-1 through QUAL-6 finding is accepted or has its required recorded owner disposition — pending
- [ ] No item is deferred, parked, or silently omitted — pending
- [ ] Final implementation and evidence summary delivered — pending

# Post-audit progress addendum — Mosaic Relay live workflow findings

This appendix adds K and L after the ten-matter visible-browser experiment. It
does not change any status recorded above. Run K after Wave 5 and run L after K
and I. Both must be accepted before the existing Wave 6 combined review can be
accepted.

## Experiment evidence

- [x] Ten independent fictional matters created — accepted: Mosaic Relay runs 01 through 10
- [x] Visible-browser evidence normalized — accepted: repeated run-state, research, stage, intake, and artifact findings recorded
- [x] Non-product failures separated — accepted: disabled research provider and browser-control failures remain environment evidence
- [x] No second verification experiment authorized — accepted: use one deterministic acceptance matter

## Added Wave 5A · K `durable-live-run-reconciliation`

- [x] K1: Add fail-first durable-mutation-then-run-failure test — accepted
- [x] K2: Reconcile useful partial work from operation results and changed paths — accepted
- [x] K3: Make all chat timeout, exception, restart, and interruption paths terminal — accepted
- [x] K4: Make no-provider and partial research queues terminal without losing useful packets — accepted
- [x] K5: Reconcile saved artifacts and lifecycle mutations into matter work state — accepted
- [x] K6: Restore one exact next intake question or one stable recovery state — accepted
- [x] K7: Preserve recommendation, decision, approval, and delivery gates — accepted
- [x] K-check: focused backend tests pass — accepted: 122 passed, 1 existing dependency warning
- [x] K-review: Sol High review accepted — accepted after correction, no findings

## Added Wave 5B · L `visible-workflow-truth`

- [x] L1: Resume one durable active run across reload and refresh on terminal state — accepted
- [x] L2: Replace ambiguous local-progress wording and preserve server-run identity — accepted
- [x] L3: Show explicit partial, failed, interrupted, and completed state words and actions — accepted
- [x] L4: Explain stage and next-actor combinations as one clear state — accepted
- [x] L5: Scope the primary work-product save action to the current eligible response — accepted
- [x] L6: Prevent intake or status text from replacing the canonical legal draft — accepted including Markdown headings
- [x] L7: Show terminal partial research packets and permit the next safe action — accepted
- [x] L8: Preserve accessible names and semantic design roles — accepted
- [x] L-check: frontend recovery, queue, workspace, and type checks pass — accepted
- [x] L-review: Sol High review accepted — accepted after corrections, no findings

## Added integration evidence

- [x] K and L actual changed paths match their appended ownership — accepted: final changes remained in the recorded K and L scopes
- [x] Mutation-then-failure returns truthful saved-work evidence — accepted: K fail-first lifecycle tests passed
- [x] Disabled public research produces terminal partial work — accepted: K tests and browser-visible completed-partial research packet passed
- [x] Reload preserves one durable run and exposes one next action — accepted: L recovery tests passed and browser showed terminal completion with its next action
- [x] Developed response, not intake summary, is the canonical draft — accepted: browser opened the saved Draft work product, separate from intake messages
- [x] One deterministic acceptance matter completes the appended script — accepted: focused K/L deterministic tests passed and the browser walk confirmed the persisted partial-work path

## Post-review corrections — 2 September 2026

- [x] Contributor guidance documents the intentional local frontmatter shim — accepted
- [x] The research-queue check has a package script and runs in the workspace aggregate — accepted
- [x] Untrusted context uses a delimiter longer than any contained backtick run — accepted: fail-first prompt-boundary regression
- [x] Lexical search uses indexed n-gram candidates without a full content-table scan and preserves two-character substring searches — accepted: query-plan and equivalence regressions
- [x] Tool handlers require `IndexCapabilities.rebuild_async()` and test fakes implement that contract — accepted
- [x] A timed-out run with no useful work is failed and retryable — accepted
- [x] Agent fingerprints distinguish a missing source directory from an empty source directory — accepted
- [x] Chat-run terminal state is written before optional conversation-history synchronization — accepted
- [x] Final verification — accepted: 788 backend tests passed; frontend workspace checks, helper check, typecheck, and production build passed; isolated browser checks passed with no console errors and an unchanged repository-vault hash; graph refresh completed
