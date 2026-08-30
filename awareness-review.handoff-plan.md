# Handoff plan — repair Continuous Legal Awareness defects

Target: a fresh Sol Medium coding context.

Goal: fix the seven verified Continuous Legal Awareness defects without changing unrelated behavior. Keep the MVP runnable, preserve the privacy boundary, and prove each fix with a regression test that fails on the old behavior and passes after the change.

## Scope

Required:

1. Stop generic company metadata from blocking ordinary public legal queries.
2. Record Watch ownership on developments and rematch only developments owned by the scanning Watch.
3. Let generated matching refresh `attention_state` while preserving lawyer triage.
4. Merge scan-owned Watch state onto the latest Watch revision.
5. Derive scan status from material produced by the current provider run.
6. Read complete non-chunked HTTP response bodies within the byte cap.
7. Stream and bound Polaris responses, and preserve useful plain text.

Not in this handoff:

- The live-vault copy race in `backend/tests/conftest.py`.
- Scheduler background-task retention.
- Extra citation-hostname hardening.
- The three existing `backend/tests/test_annotations.py` failures.

## Resume protocol

Use `awareness-review.handoff-progress.md`.

- Before work, verify every completed step still passes. Do not repeat a completed edit.
- After each step, run its check and update only that progress line.
- If a completed step no longer passes, stop and report the mismatch.
- Do not commit.

## Step 1 — Make the forbidden corpus source-aware

Files:

- `backend/app/models/awareness.py`
- `backend/app/services/internal_knowledge.py`
- `backend/app/intelligence/outbound_policy.py`
- `backend/tests/test_awareness_models.py`
- `backend/tests/test_intelligence_security.py`

Implement this exact contract:

- Keep `ForbiddenCorpus.terms` for private natural-language identities. Match these as complete Unicode-aware words or phrases after NFKC normalization and case folding.
- Add `ForbiddenCorpus.fragments: tuple[str, ...] = ()` for structured identifiers and exact private fragments. Match these by normalized containment.
- The empty-corpus validator must consider both collections. An empty corpus is valid only when `proved_no_private_identifiers=True`.
- Put only explicit identity metadata in `terms`: `company_name`, `aliases`, `alias`, `product`, `products`, `product_name`, `product_names`, and `service_name`.
- Do not harvest broad classification or description keys as identities: `name`, `product_area`, `products_services`, and `service`.
- Put `_ID_KEYS`, internal paths, email addresses, configured internal-scope IDs/paths, and distinctive excerpts in `fragments`.
- If all configured private files were read successfully and no terms or fragments were found, set `proved_no_private_identifiers=True`. A read or parse failure must still propagate.
- Exempt an explicitly public entity only when its normalized name exactly equals a corpus entry. Do not use fuzzy exemptions.
- Do not add a dictionary, model call, or generic common-word list.

Boundary matching must use escaped text and boundaries equivalent to `(?<!\w)<escaped term>(?!\w)`. It must still block `Café Secret`, `PRIVATE-ALIAS` in a URL, matter IDs, internal paths, emails, private product identifiers, and stored distinctive excerpts.

Add a parameterized demo-vault test proving these values pass:

- `What new EU rules affect online platform liability?`
- `What consumer credit regulations changed this quarter?`
- `topics=["platform governance"]`

First run the new test against the old code and confirm it fails because of private-context matching. Then implement the fix.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_models.py tests/test_intelligence_security.py tests/test_awareness_failures.py
```

Expected: all selected tests pass.

## Step 2 — Add durable Watch ownership to developments

Files:

- `backend/app/models/awareness.py`
- `backend/app/services/awareness_contracts.py`
- `backend/app/services/developments.py`
- `backend/app/services/watch_scans.py`
- Direct callers found by `rg -n "record_candidates\(" backend`
- `backend/tests/test_awareness_records.py`
- `backend/tests/test_watch_scans.py`
- Other existing tests that call `record_candidates`

Implement this exact contract:

- Add `watch_ids: list[str] = Field(default_factory=list)` to `Development`. The default is required so old Markdown remains readable.
- Change `DevelopmentService.record_candidates` to require `watch_id` as its first argument: `record_candidates(watch_id, provider_id, candidates)`.
- Update the matching protocol and every caller. `WatchScanService` must pass `watch.watch_id`.
- A new development starts with that Watch ID.
- An existing development unions the Watch ID into `watch_ids` in stable sorted order, even when the provider observation is an exact duplicate.
- Adding only a Watch association does not increment `observation_count`, but it does persist the updated development and update `updated_at`.
- An ownerless legacy development (`watch_ids=[]`) remains readable but is not rematched by any Watch. If a later provider result matches it, add the scanning Watch and then treat it as owned.
- `_rematch_batch` may load only records where `watch.watch_id in development.watch_ids`, plus developments returned during the current scan.
- Keep global development identity and cross-provider deduplication. The same development may belong to several Watches.
- Do not add Watch IDs to the SQLite development table. Markdown remains authoritative and rematching reads Markdown.

Tests must prove:

1. Two Watches that collect different developments never receive each other's item.
2. An ownerless legacy/demo development is not attached to either Watch.
3. When two Watches collect the same canonical development, one development record contains both Watch IDs and each Watch may rematch it.
4. Existing exact deduplication and observation counts remain correct.

First add the two-Watch regression and confirm it fails on the old code. Then implement the schema and service change.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_records.py tests/test_watch_scans.py tests/test_review_packets.py tests/test_awareness_rebuild.py
```

Expected: all selected tests pass.

## Step 3 — Refresh matcher-owned attention fields together

Files:

- `backend/app/services/briefing_store.py`
- `backend/tests/test_awareness_records.py`
- `backend/tests/test_watch_scans.py`

In `BriefingStore.put_item`, preserve only lawyer-owned `read`, `saved`, and `usefulness`, plus the current `review_packet_id` merge and original creation/revision fields. Stop preserving stored `attention_state`.

The incoming generated record must control these three fields as one matcher-owned unit:

- `attention_state`
- `potential_impact`
- `company_connection`

Replace the existing `test_generated_item_refresh_preserves_lawyer_triage` expectation. The test must begin with `briefing_only`, refresh to `required` with `potential_impact="high"` and a company connection, and prove that read/saved/usefulness survive.

Add or extend an assembled scan test so a later internal decision match raises the stored item to `required`.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_records.py tests/test_watch_scans.py tests/test_review_packets.py
```

Expected: all selected tests pass.

## Step 4 — Merge scan state onto the latest Watch

Files:

- `backend/app/services/watches.py`
- `backend/app/services/awareness_contracts.py`
- `backend/app/services/watch_scans.py`
- `backend/tests/test_watch_scans.py`

Add this method to the existing `WatchStore` and its protocol; do not create a new service:

```python
def apply_scan_result(
    self,
    scan: Scan,
    checkpoints: dict[ProviderId, ProviderCheckpoint],
) -> Watch:
    ...
```

It must re-read the current Watch, merge only scan-owned fields, bump from the current revision, and write through `WatchStore._write`. Preserve a current `draft` or `paused` status instead of replacing it with scan health.

Scan-owned fields:

- merged provider checkpoints
- `last_successful_scan_at` only for a successful scan
- health status, except that a current `draft` or `paused` state remains unchanged
- `updated_at`
- `revision`

All other current fields must survive, including title, standing question, public query, purposes, sources and roles, internal scope, provider, recurrence, enabled state, schedule link, briefing behavior, and review behavior. A draft must not become active because it was scanned.

Remove the direct vault write from `WatchScanService._advance_watch`; delegate to the store method instead.

Add a gated provider test:

1. Start a scan from revision 1.
2. While the provider waits, PATCH the Watch to a different provider and title, producing revision 2.
3. Release the provider.
4. Assert the lawyer's values survive, scan checkpoints/state are merged, and final revision is 3.

This enforces the plan rule that mid-run Watch edits apply to the next run.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_watch_scans.py tests/test_awareness_records.py tests/test_awareness_lifecycle.py
```

Expected: all selected tests pass.

## Step 5 — Base terminal status on this provider run

Files:

- `backend/app/services/watch_scans.py`
- `backend/tests/test_watch_scans.py`

Make `_terminal_status` depend only on current provider result statuses:

- any failed plus any success/partial -> `partial`
- all selected providers failed -> `failed`
- no failures but any partial -> `partial`
- otherwise -> `success`

Remove the historical-development `useful` argument. For the separate warning downgrade, define current-run material as a candidate or non-empty bounded excerpt in the current `ProviderScanResult` values. Do not use `preview_items` or `combined.developments` for that decision.

Test a single failing provider with an owned historical development in the lookback window. The scan must be `failed`. Keep the existing both-provider partial test passing.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_watch_scans.py tests/test_awareness_failures.py tests/test_awareness_scheduler.py
```

Expected: all selected tests pass.

## Step 6 — Read complete non-chunked HTTP bodies

Files:

- `backend/app/intelligence/fetch.py`
- `backend/tests/test_intelligence_security.py`

Do not change the chunked branch, DNS approval, peer verification, redirects, retry rules, decompression limits, or content-type checks.

For non-chunked bodies:

- If `Content-Length` exists, validate it as a non-negative integer, reject it when it exceeds the cap, and use `readexactly(length)`.
- Convert an early EOF into a clear connection error; never return a partial body as success.
- Without `Content-Length`, read in bounded chunks until EOF. Raise the existing `compressed response exceeds size limit` error as soon as accumulated bytes exceed the cap.
- Never make an unbounded `read()` call.

Use a real `asyncio.StreamReader` test. Feed the first segment before `_read_body`, feed later segments after one event-loop turn, and prove both the Content-Length and EOF paths return the full body. Keep an over-cap test.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_intelligence_security.py
```

Expected: all selected tests pass.

## Step 7 — Stream, bound, and degrade gracefully for Polaris

Files:

- `backend/app/intelligence/polaris.py`
- `backend/tests/test_intelligence_providers.py`

Implement this exact contract:

- Define a 2 MiB maximum response-body byte constant and keep the 12,000-character stored-text cap.
- Open the response with `async with client.stream("POST", POLARIS_ENDPOINT, headers=headers, json=payload) as response`. Read `aiter_bytes()` chunks, stop and raise `Polaris response exceeds size limit` when the byte cap is exceeded, and close every response through its async context manager.
- Keep the current exact endpoint, authorization, retry statuses, retry count, bounded `Retry-After`, timeout, and redirect rejection.
- Replace `response.json()` with JSON parsing of the bounded bytes.
- If JSON parsing fails, decode the bounded bytes as text with replacement for invalid bytes and pass that text to `_parse`.
- Teach `_parse` to accept a string as useful plain text and add the warning `Polaris response was plain text; useful text was preserved`.
- Empty plain text still produces a failed provider result. Non-empty plain text produces a partial result because it carries a warning.
- Do not add a compatibility path that buffers production responses for the existing fakes. Update `FakeClient`/`FakeResponse` to implement the streaming interface.

Tests must prove:

1. A segmented plain-text 200 response becomes a partial result and preserves its text.
2. A segmented JSON response still succeeds.
3. A response over 2 MiB fails with the size-limit error.
4. Redirect and retry behavior remains unchanged.

Check:

```bash
cd backend && .venv/bin/pytest -q tests/test_intelligence_providers.py tests/test_watch_scans.py
```

Expected: all selected tests pass.

## Acceptance check

Run:

```bash
(cd backend && .venv/bin/pytest -q tests/test_awareness_*.py tests/test_watch_scans.py tests/test_intelligence_*.py tests/test_review_packets.py)
(cd backend && .venv/bin/pytest -q)
(cd frontend && npm run typecheck && npm run build)
graphify update .
```

The awareness/intelligence subset must be fully green. In the full backend suite, the only permitted failures are:

- `tests/test_annotations.py::test_annotations_round_trip`
- `tests/test_annotations.py::test_annotation_answer_survives_a_hostile_model_reply`
- `tests/test_annotations.py::test_blank_annotation_answer_is_not_stored`

The pass count will be higher than the old `287 passed` baseline because this work adds tests. Do not require an exact pass count.

If the full suite alone fails during fixture setup because a live dev server created and removed a dot-prefixed atomic-write file while `copytree` ran, retry that exact full-suite command once. Do not retry or dismiss assertion failures, logic failures, or any repeated setup failure. Do not stop or kill a user-owned dev server.

## Guardrails and blocker policy

- Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, and `docs/CONTINUOUS_LEGAL_AWARENESS_BUILD_PLAN.md` before edits.
- Run the required Graphify query before raw source exploration.
- Preserve all unrelated dirty work. Do not revert, stage, commit, or broadly format.
- Do not add dependencies, services, queues, embeddings, auth, scores, migrations, or legal-answer gates.
- Do not change the three known annotation failures or the three excluded optional findings.
- Do not weaken privacy tests, DNS/peer/redirect defenses, retry bounds, digest immutability, or lawyer triage preservation.
- Stop and report if a named symbol differs materially, a focused check still fails after diagnosis, the privacy rule cannot satisfy both positive and negative tests, or a required edit would overwrite unrelated work.
- Otherwise use the smallest implementation that reaches the exact final states above.
