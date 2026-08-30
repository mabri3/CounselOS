

You are a Sol Medium coding agent in a fresh context. Work in:

`/Users/bharris/Programs/counsel-os-mvp`

Fix the seven verified Continuous Legal Awareness defects described below. Preserve the privacy boundary, all unrelated user work, and the runnable MVP. Do not redesign the feature. Success means each old failure has a fail-then-pass regression test, the awareness subsystem is green, and the only permitted full-suite failures are the three named annotation baseline failures.

Work through the steps in order. Do not delegate or parallelize these coupled edits.

## Resume protocol

Use `awareness-review.handoff-progress.md` in the repository root.

- Before starting, read the progress file.
- Do not redo a step marked `done`. Run that step's check once. If it no longer passes, stop and report the mismatch.
- For the first pending step, add its regression test and observe the expected old failure before changing production code.
- After the production fix passes the step check, immediately change that line to `- [x] Step N: <title> — done`.
- If a step check still fails after focused diagnosis, write `— FAILED: <short reason>` on that line and follow the blocker policy.
- Do not batch progress updates at the end.
- Do not commit.

## Read and inspect first

Read these files before editing:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `CODEX_HANDOFF.md`
4. `docs/CONTINUOUS_LEGAL_AWARENESS_BUILD_PLAN.md`
5. `awareness-review.handoff-progress.md`

The repository is dirty. Existing changes belong to the user. Do not revert, restage, reformat, or overwrite unrelated work.

Because `graphify-out/graph.json` exists, first run:

```bash
graphify query "For the seven Continuous Legal Awareness review defects, list the exact production symbols, interfaces, callers, and existing tests that must change."
```

Then confirm callers with these exact searches:

```bash
rg -n "record_candidates\(" backend
rg -n "ForbiddenCorpus\(" backend
rg -n "_advance_watch|_terminal_status|_read_body|response\.json" backend
```

If a named symbol or signature differs materially from this prompt, stop and report it. Do not silently invent a different architecture.

## Current facts

- Markdown is authoritative. SQLite is a disposable index.
- `WatchScanService._run_locked` is the scan coordinator.
- `DevelopmentService` owns external-development identity and observations.
- `BriefingStore.put_item` merges generated refreshes with lawyer triage.
- `WatchStore.update` already enforces optimistic revisions for lawyer PATCH operations.
- The current full-suite baseline was `287 passed` plus three pre-existing annotation failures. This repair adds tests, so the final pass count must be higher. Do not require an exact count.
- A user-owned backend may be running against the repository vault. Do not stop it. The test fixture's live-vault copy race is excluded from this handoff.

## Required scope

Fix only these seven defects:

1. Generic private-corpus terms block ordinary public legal queries.
2. Watches absorb developments collected by other Watches.
3. A rescan cannot increase an item's attention state.
4. Scan completion overwrites concurrent lawyer edits to a Watch.
5. Total provider failure can be reported as partial.
6. Non-chunked safe HTTP responses can be truncated.
7. Polaris discards useful plain text and does not cap response bytes.

The following findings are separate work. Do not change them in this handoff:

- `backend/tests/conftest.py` live-vault copy isolation.
- Scheduler background-task retention.
- Polaris citation-hostname defence-in-depth.
- The three known annotation failures.

---

## Step 1 — Make the forbidden corpus source-aware

### Files

- `backend/app/models/awareness.py`
- `backend/app/services/internal_knowledge.py`
- `backend/app/intelligence/outbound_policy.py`
- `backend/tests/test_awareness_models.py`
- `backend/tests/test_intelligence_security.py`

### Existing boundary

`ForbiddenCorpus` currently has only `terms`. `InternalKnowledgeService.forbidden_corpus()` puts broad metadata values such as `product_area: Platform`, `product_area: Credit`, and `product_area: Deposits` into that flat set. `OutboundQueryPolicy.prepare()` then uses raw substring matching.

### Required final design

Use two explicit classes of private material:

```python
class ForbiddenCorpus(AwarenessModel):
    terms: tuple[str, ...] = Field(default_factory=tuple)
    fragments: tuple[str, ...] = Field(default_factory=tuple)
    proved_no_private_identifiers: bool = False
```

- `terms` contains private natural-language identities. Match each normalized term as a complete Unicode-aware word or phrase with escaped boundaries equivalent to `(?<!\w)<term>(?!\w)`.
- `fragments` contains structured identifiers and exact private fragments. Match these by normalized containment.
- The model validator treats the corpus as empty only when both collections are empty. Empty is valid only with `proved_no_private_identifiers=True`.

In `InternalKnowledgeService`:

- Put only these explicit identity keys in `terms`: `company_name`, `aliases`, `alias`, `product`, `products`, `product_name`, `product_names`, `service_name`.
- Do not harvest these broad classification/description keys as identities: `name`, `product_area`, `products_services`, `service`.
- Put `_ID_KEYS`, file paths, email addresses, configured internal-scope IDs and paths, and distinctive document excerpts in `fragments`.
- Keep Unicode/case variants or equivalent normalized coverage.
- A read or parse failure must propagate.
- If every configured source was read successfully and both collections are empty, set `proved_no_private_identifiers=True`. Do not claim proof after an ignored error.

In `OutboundQueryPolicy`:

- Keep the existing direct email, matter-ID, and internal-path checks.
- Normalize NFKC plus case folding before all corpus comparisons.
- Check `terms` by whole word/phrase boundaries.
- Check `fragments` by containment.
- Exempt an explicitly public entity only when its normalized name exactly equals the corpus entry. Do not add fuzzy exemptions.
- Do not add a dictionary, a generic common-word list, a model call, or a new service.

The privacy boundary must still reject all existing cases: `Café Secret`, `PRIVATE-ALIAS` inside a URL, email addresses, matter IDs, internal paths, private product identifiers, and distinctive excerpts.

### Regression

Add one parameterized test that builds the corpus from the real demo vault and proves these public values pass:

- standing question: `What new EU rules affect online platform liability?`
- standing question: `What consumer credit regulations changed this quarter?`
- topic: `platform governance`

Add the test first. Run it against the old code and confirm it fails with `matches private company context`. Then implement the final design. Do not weaken existing privacy assertions.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_models.py tests/test_intelligence_security.py tests/test_awareness_failures.py
```

Expected: all selected tests pass. Mark Step 1 done.

---

## Step 2 — Add durable Watch ownership to developments

### Files and callers

- `backend/app/models/awareness.py`
- `backend/app/services/awareness_contracts.py`
- `backend/app/services/developments.py`
- `backend/app/services/watch_scans.py`
- Every direct test caller returned by `rg -n "record_candidates\(" backend`
- At minimum: `test_awareness_records.py`, `test_watch_scans.py`, `test_review_packets.py`, and `test_awareness_rebuild.py`

### Required final design

Add this backward-compatible field:

```python
class Development(AwarenessModel):
    ...
    watch_ids: list[str] = Field(default_factory=list)
```

Change the service and protocol signature to:

```python
def record_candidates(
    self,
    watch_id: str,
    provider_id: str,
    candidates: Iterable[DevelopmentCandidate],
) -> DevelopmentBatch:
    ...
```

Update every caller. `WatchScanService` must call it with `watch.watch_id`.

Ownership rules:

- A new development starts with `watch_ids=[watch_id]`.
- On an identity match, union the incoming Watch into `watch_ids` and store the sorted unique list.
- Add the Watch even when the provider observation is an exact duplicate.
- Adding only Watch ownership persists the development and updates `updated_at`, but does not increment `observation_count`.
- Old Markdown without the field parses as `watch_ids=[]`.
- An ownerless legacy development is not rematched by any Watch.
- If a later provider result matches an ownerless legacy record, the current Watch becomes an owner.
- `_rematch_batch` loads only records where `watch.watch_id in development.watch_ids`, plus the current run's returned developments.
- Keep global identity and cross-provider deduplication. The same development may belong to several Watches.
- Do not add `watch_ids` to the disposable SQLite development table. This rematch path reads Markdown.

Update existing seeding tests to pass a Watch ID. In `test_internal_rematch_uses_existing_development_without_new_provider_candidate`, seed the development with that test Watch's ID.

### Regressions

Add tests that prove:

1. Watch A and Watch B collect different developments and receive only their own Briefing item and topics.
2. An ownerless legacy/demo development is not attached to either Watch.
3. If both Watches collect the same canonical development, the one record has both sorted Watch IDs and each Watch can rematch it.
4. A duplicate observation from a new Watch changes ownership but leaves `observation_count == 0` for that call.

Add the two-Watch test first and confirm it fails on the old code.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_records.py tests/test_watch_scans.py tests/test_review_packets.py tests/test_awareness_rebuild.py
```

Expected: all selected tests pass. Mark Step 2 done.

---

## Step 3 — Refresh matcher-owned attention fields together

### Files

- `backend/app/services/briefing_store.py`
- `backend/tests/test_awareness_records.py`
- `backend/tests/test_watch_scans.py`

### Required final design

In `BriefingStore.put_item`, preserve only:

- lawyer-owned `read`, `saved`, and `usefulness`
- the current `review_packet_id` merge
- original `created_at` and the current revision behavior

Do not preserve the stored `attention_state`.

The incoming generated item controls this matcher-owned unit:

- `attention_state`
- `potential_impact`
- `company_connection`

Do not calculate one of these fields from the stored value. They must update together.

### Regressions

Replace the existing `test_generated_item_refresh_preserves_lawyer_triage` expectation. Start with a `briefing_only` item. Refresh it to `required` with `potential_impact="high"` and a company connection. Assert:

- the three matcher-owned fields use the incoming values;
- `read`, `saved`, and `usefulness` keep the lawyer values.

Also add or extend an assembled scan/rematch test so a later decision connection makes the stored item `required`.

Run the changed regression before the production edit and confirm the old stored `attention_state` causes failure.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_records.py tests/test_watch_scans.py tests/test_review_packets.py
```

Expected: all selected tests pass. Mark Step 3 done.

---

## Step 4 — Merge scan state onto the latest Watch

### Files

- `backend/app/services/watches.py`
- `backend/app/services/awareness_contracts.py`
- `backend/app/services/watch_scans.py`
- `backend/tests/test_watch_scans.py`

### Required final design

Add this public method to the existing `WatchStore` and its protocol. Do not create a new service:

```python
def apply_scan_result(
    self,
    scan: Scan,
    checkpoints: dict[ProviderId, ProviderCheckpoint],
) -> Watch:
    ...
```

The method must:

1. Re-read the current Watch.
2. Merge only scan-owned fields onto that current record.
3. Bump from the current revision.
4. Write through `WatchStore._write`.
5. Return the saved Watch.

Scan-owned fields are:

- merged provider checkpoints;
- `last_successful_scan_at`, only when the scan status is `success`;
- health status, except a current `draft` or `paused` status remains unchanged;
- `updated_at`;
- `revision`.

All current lawyer-owned/configuration fields must survive: title, standing question, public query, purposes, sources and roles, internal scope, provider, recurrence, enabled state, schedule link, briefing behavior, and review behavior. A draft must not become active only because it was scanned.

Add the method to `awareness_contracts.WatchStore`. Replace the direct vault write in `_advance_watch` with this store method. The correct plan rule is: `Mid-run Watch edits apply to the next run.`

### Regression

Use the existing gated `ProviderFake`:

1. Create revision 1 and start a scan.
2. Wait until the provider is blocked.
3. PATCH the title and provider, producing revision 2.
4. Release the provider.
5. Assert the lawyer values survive, scan state/checkpoints are present, and the final revision is 3.

Run the new test before the production edit and confirm the old scan write restores the stale title/provider.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_watch_scans.py tests/test_awareness_records.py tests/test_awareness_lifecycle.py
```

Expected: all selected tests pass. Mark Step 4 done.

---

## Step 5 — Base terminal status on this provider run

### Files

- `backend/app/services/watch_scans.py`
- `backend/tests/test_watch_scans.py`

### Required final design

Remove the historical-development `useful` argument from `_terminal_status`. Derive status only from current provider result statuses:

- failed plus success/partial -> `partial`
- all selected providers failed -> `failed`
- no failures and any partial -> `partial`
- otherwise -> `success`

For the separate rule that warnings can downgrade success to partial, define current-run material as either:

- at least one current provider candidate; or
- a non-empty current provider `bounded_excerpt`.

Do not use `preview_items` or `combined.developments` to decide provider success or partial status.

### Regression

Seed an owned historical development inside the lookback window. Run one selected provider that raises. Assert the scan is `failed`, even if internal rematching creates a preview item. Keep the existing both-provider test: one success plus one failure is `partial`.

Run the new failure test before the production edit and confirm the old code reports `partial`.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_watch_scans.py tests/test_awareness_failures.py tests/test_awareness_scheduler.py
```

Expected: all selected tests pass. Mark Step 5 done.

---

## Step 6 — Read complete non-chunked HTTP bodies

### Files

- `backend/app/intelligence/fetch.py`
- `backend/tests/test_intelligence_security.py`

### Required final design

Do not change the chunked branch, DNS approval, peer verification, redirect validation, retries, decompression caps, or content-type checks.

For a non-chunked body:

- With `Content-Length`, validate a non-negative integer, reject values over `cap`, and call `readexactly(length)`.
- If the stream ends before that length, raise a clear connection error. Never return the partial bytes as success.
- Without `Content-Length`, repeatedly read bounded chunks until EOF.
- Raise the existing `compressed response exceeds size limit` error as soon as accumulated bytes exceed `cap`.
- Never make an unbounded `read()` call.

### Regression

Use a real `asyncio.StreamReader`, not a fake that always returns the full body. Feed the first bytes before `_read_body`, schedule later bytes after one event-loop turn, and prove:

1. the Content-Length path returns all segments;
2. the no-length EOF path returns all segments;
3. either path still rejects an over-cap body.

Run the segmented test before the production edit and confirm the old function returns only the first segment.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_intelligence_security.py
```

Expected: all selected tests pass. Mark Step 6 done.

---

## Step 7 — Stream, bound, and degrade gracefully for Polaris

### Files

- `backend/app/intelligence/polaris.py`
- `backend/tests/test_intelligence_providers.py`

### Required final design

Define:

- a 2 MiB maximum Polaris response-body byte constant;
- the existing 12,000-character stored-text limit.

For the HTTP path:

- Open the response with `async with client.stream("POST", POLARIS_ENDPOINT, headers=headers, json=payload) as response`.
- Read final response bytes through `aiter_bytes()`.
- Raise `Polaris response exceeds size limit` as soon as accumulated bytes exceed 2 MiB.
- Close every response through its async context manager.
- Keep the exact endpoint, authorization, 15-second timeout, redirect rejection, retry statuses, three-attempt limit, and bounded `Retry-After` behavior.
- Retryable responses do not need their bodies preserved.
- Remove unguarded `response.json()`.
- Parse JSON from the bounded byte buffer.
- On `JSONDecodeError`, decode the same bounded bytes as text with replacement for invalid bytes and pass the string into `_parse`.

Teach `_parse` this rule:

```python
if isinstance(envelope, str):
    return envelope, [], [
        "Polaris response was plain text; useful text was preserved"
    ]
```

Therefore:

- non-empty plain text becomes `partial` and is stored;
- empty plain text remains `failed`;
- valid JSON keeps current behavior.

Update the test fakes to implement the same streaming interface used by production. Do not add a production fallback to buffered `.post()` only to support old fakes.

### Regressions

Prove:

1. segmented plain-text HTTP 200 -> partial with preserved text and warning;
2. segmented JSON HTTP 200 -> existing success behavior;
3. more than 2 MiB -> size-limit error;
4. redirect, retry, and bounded `Retry-After` tests still pass.

Run the plain-text regression before the production edit and confirm the old `response.json()` path fails.

### Check

```bash
cd backend && .venv/bin/pytest -q tests/test_intelligence_providers.py tests/test_watch_scans.py
```

Expected: all selected tests pass. Mark Step 7 done.

---

## Acceptance check

Run these commands in order:

```bash
(cd backend && .venv/bin/pytest -q tests/test_awareness_*.py tests/test_watch_scans.py tests/test_intelligence_*.py tests/test_review_packets.py)
(cd backend && .venv/bin/pytest -q)
(cd frontend && npm run typecheck && npm run build)
graphify update .
```

Required result:

- The awareness/intelligence subset is fully green.
- Frontend typecheck and build pass.
- In the full backend suite, the only permitted failures are exactly:
  - `tests/test_annotations.py::test_annotations_round_trip`
  - `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
  - `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`
- The pass count is higher than 287 because new tests were added.
- Graphify update completes.

If the full backend suite alone fails during fixture setup because a live server created and removed a dot-prefixed atomic-write file during `copytree`, rerun that exact full-suite command once. Do not retry or dismiss assertion failures, logic failures, or any repeated setup failure. Do not stop or kill the user-owned server.

After all checks pass, mark the acceptance line done.

## Do not change

- Unrelated dirty files or user data.
- The three known annotation failures.
- The excluded optional findings.
- `SafeHttpFetcher` DNS pinning, peer verification, redirect revalidation, content restrictions, decompression caps, or retry bounds.
- Scheduler DST and interval logic.
- Digest immutability.
- Preservation of `BriefingItem.read`, `saved`, and `usefulness`.
- Provider secrets, endpoints, or outbound allow-list fields.

Do not add dependencies, a new service, auth, queues, embeddings, numeric legal-risk scores, migrations, verifier agents, or legal-answer gates. Do not weaken a regression test to make it pass.

## Blocker policy

Continue through safe, reversible uncertainty by reading the named code and using the smallest design specified here.

Stop and report when:

- a named file, symbol, or signature differs materially from this prompt;
- a required privacy behavior cannot satisfy both the allow and block tests;
- a focused step check still fails after diagnosis;
- a required edit would overwrite unrelated user work;
- required access or a dependency is unavailable;
- proceeding requires a destructive or irreversible action.

Do not stop for the three named annotation failures, ordinary warnings, or unrelated dirty files.

## Final report

Report:

1. Each completed defect and its regression test name.
2. Each targeted check and its result.
3. The full backend result, with the exact three permitted failures if they remain.
4. Frontend typecheck/build results.
5. Graphify update result.
6. Anything deliberately left unchanged.

Work from the first pending progress line through acceptance. Run each check immediately after its step and update `awareness-review.handoff-progress.md` before continuing.
