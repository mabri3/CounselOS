> Repair update (2026-09-10): The original completion claims below were later challenged by review. See [source-library repair verification](source-library.repair-verification.md) for the corrected behavior and current checks. The earlier report is retained as history.

# Progress — Markdown + SQLite source library

Update after EACH step. Keep exact check results and evidence links; do not batch updates at the end.

- [x] Step 1: Baseline and contracts — DONE 2026-09-10
- [x] Step 2: Durable source store and extraction — DONE 2026-09-10
- [x] Step 3: Index, catalog and recovery — DONE 2026-09-10
- [x] Step 4: Tools and bounded context — DONE 2026-09-10
- [x] Step 5: Publication and assembled restart — DONE 2026-09-10
- [x] Step 6: Browser demo and required checks — DONE 2026-09-10

## Step 1 result

Baseline reproduced: `.venv/bin/python -m pytest tests/test_research_tool_instructions.py
tests/test_research_checkpoints.py tests/test_awareness_index.py -q` → **37 passed, 1 warning in 2.29s**
(the existing Starlette/httpx deprecation warning). Matches the plan author's baseline.

FTS5 trigram confirmed on the backend interpreter: SQLite 3.53.1, `CREATE VIRTUAL TABLE ... USING
fts5(..., tokenize="trigram")` succeeds.

Enumerated callers recorded (rg over backend/frontend, excluding .venv):
- `research_reader.read_source` — app/services/research_collection.py:173, app/services/native_research.py:149;
  tests: test_native_research.py (57,73,77,168,172), test_research_scope.py:66,
  test_research_review_followup.py:77, test_main_agent_research.py (107,174,209,254,287),
  test_research_checkpoints.py:96.
- `research_documents.extract_document` — app/services/research_reader.py:109; tests: test_research_documents.py.
- `ResearchCollection.read` / `.capture_local` — app/tools/research_investigation.py, app/tools/registry.py:163;
  tests: test_research_tool_instructions.py (61,102), test_main_agent_research.py:312.
- `ResearchService._save_retrieved_sources` — app/services/research.py:258,
  app/services/research_collection.py:180; test_main_agent_research.py:130.
- `IngestionService.upload_to_matter` — app/routers/matters.py:599, app/services/ingestion.py:166;
  tests: test_ingestion.py, test_ingestion_limits.py, test_workspace_files.py, test_change_impact.py,
  test_document_review_docx.py, test_workspace_evidence.py.

Added: `backend/app/models/source_library.py` (SourceManifest, SourceUnitEntry, ExtractionJob,
UnitReceipt, SourceSearchRequest) and `backend/tests/test_source_library.py`.

Check: `.venv/bin/python -m pytest tests/test_source_library.py -q` → **4 passed, 3 failed**.
The 4 contract tests pass. The 3 behavior tests fail on `AppContext has no attribute 'source_library'` —
an expected, meaningful pre-implementation failure, NOT a passing test.

## Step 2 result

Added `backend/app/services/source_library.py` (SourceLibraryService) and
`backend/app/services/source_extraction.py` (resumable child-process page extraction plus
deterministic section splitting). Wired `app.source_library` in `backend/app/runtime.py`,
registration from `IngestionService.upload_to_matter` and from `ResearchCollection._fetch`.

Design note — smaller equivalent adopted: the blueprint asks for a job-checkpoint receipt after
every unit. That is O(n^2) YAML rewrites and made the 1,000-page case unusably slow. Every unit body
is already durable in the job staging area (`jobs/<job_id>/units/`) before any receipt is written, so
receipts are checkpointed every 50 units and again at the end (`CHECKPOINT_EVERY`). A crash
re-persists at most 50 units idempotently from staged text; no refetch and no provider call. Recovery
behavior is preserved, the quadratic cost is not.

Publication order is stage → read back → hash → compute version digest → move into the immutable
version directory → write manifest → refresh catalog. The version digest is therefore computed from
the persisted body, not a pre-normalized string.

Checks:
- `.venv/bin/python -m pytest tests/test_source_library.py -q` → **7 passed**.
- `.venv/bin/python -m pytest tests/test_source_library_extraction.py -q` → **9 passed** in 10.5s,
  covering 1,000-page native PDF (page 900 readable, 1000 units, complete), targeted page extraction
  behind a scanned prefix, real tesseract OCR recognition, mocked OCR-unavailable (page images
  retained, no invented text), encrypted and malformed PDFs (`unavailable`, 0 units, original bytes
  intact), interrupted extraction resumed to complete with the earlier partial version still
  resolving, OCR budget bounded to one invocation, and deterministic section splitting.
- Regression: `tests/test_source_library.py test_source_library_extraction.py
  test_main_agent_research.py test_research_tool_instructions.py test_research_checkpoints.py
  test_ingestion.py test_ingestion_limits.py test_workspace_files.py test_document_review_docx.py`
  → **80 passed**.

## Step 3 result

Added `backend/app/services/source_index.py` (`source_versions`, `source_units`, `source_catalogs`
tables plus `index_source_library`), called from `IndexService._build`. `SCHEMA_VERSION` 4 → 5;
`SCHEMA`, `TABLES` extended together. Added `SourceLibraryService._ensure_fresh` (one local refresh
on catalog-generation mismatch) and a deterministic `index.md` catalog.

Checks:
- `.venv/bin/python -m pytest tests/test_source_library_index.py -q` → **8 passed**, covering the
  projection, deleting ONLY the isolated SQLite file and rebuilding to identical source IDs,
  versions, catalog generation and search hits (0 index errors), stale-hit rejection after an
  external edit, readable results when the index query and lexical search both fail, one refresh on
  generation mismatch, cross-matter isolation (no other matter's text in snippets or catalog), a
  malformed manifest producing an index error while valid sources stay searchable, and unchanged
  legacy `lexical_search` semantics against `VaultService.lexical_search`.
- `tests/test_source_library.py test_source_library_extraction.py test_awareness_index.py`
  → **43 passed**.

## Step 4 result

Added the `search_research_sources` tool (`app/tools/research_investigation.py`, handler map in
`app/tools/handlers.py`, investigation set in `app/tools/registry.py` and
`ResearchCollection.INVESTIGATION_TOOLS`, agent tool list in the shipped `counsel-copilot.md`).
Extended `ResearchSourceRead` additively with `source_version`, `unit_id`, page ceiling 30 → 1000 and
start ceiling 100k → 20M; `max_chars` stays 6000. Legacy `source_id`-only reads keep their old
semantics (`text.find`, absolute offsets, page/find override start). Regenerated the shipped
`read_research_source.md` and new `search_research_sources.md` from the models. Extended
`INVESTIGATION_CONTRACT`. Added `ContextBuilder._source_library_pointer` (≤2000 chars, metadata only)
into the run context.

Two existing assertions were updated, not weakened: the investigation tool set in
`test_main_agent_research.py` now includes the new tool, and the shipped `read_research_source`
description was regenerated (its existing "6000 characters" / "omit page_number and find_text"
assertions still hold).

Checks:
- `.venv/bin/python -m pytest tests/test_source_library_tools.py -q` → **10 passed**, covering exact
  offsets against the saved body, multibyte text, end-of-unit, repeated phrases, cross-page
  continuation via `next_read`, version pinning (a second version is refused for a pinned source),
  identical replay charged once, `≤6000`-char search response, `≤400`-char snippets, `≤2000`-char
  added initial context with no page text, malformed arguments, cross-matter refusal, permission
  boundary without an authorized investigation, and a serialized system+context+tool-result capture
  proving whole pages, manifests and unit hashes are never auto-included (a 200-page source's marker
  appears exactly twice: one snippet, one deliberate read).
- Focused acceptance (11 files incl. `test_research_documents.py`, `test_research_scope.py`,
  `test_ingestion*.py`, `test_awareness_index.py`) → **104 passed** in 35.3s.

## Step 5 result

Pinned library sources now flow into publication: `ResearchCollection._read_library` records each
selected passage with its unit path, offsets, page/section locator and body hash, and
`main_agent_research` includes `library_sources` in the problem-analysis capture references and in the
published result. No decision record is altered automatically.

No new UI was required. `extraction_state: "partial"` already renders as "Partial text" with the
attention tone in `frontend/components/workspace/MatterFilesPanel.tsx`, and the upload response's
`failure_detail` now reads "Source saved; N pages are not extracted yet." Read results carry
`original_file_path` and `page_image_path` so the original and page image stay reachable through the
existing document routes. Noted limit: the editable `.extracted.md` companion keeps its own
`extraction_state` (its pypdf text is available) while the library reports evidence extraction state
separately — both are truthful and describe different artifacts.

Checks:
- `.venv/bin/python -m pytest tests/test_source_library_lifecycle.py -q` → **3 passed** in 18.4s.
  The assembled test drives the real tool registry and run services with a scripted provider over a
  1,000-page source: search finds page 900, reads it, follows the cross-page continuation to page
  901, and produces a useful conditional answer. Deliberately malformed final structured metadata is
  supplied and the useful prose still reaches the published packet. It asserts the run pinned exactly
  one source_id/source_version, that both units are recorded as selected passages, that no bulk page
  or manifest reached the provider (page 500's body, hash and path absent; total serialized request
  < 400 KB), that evidence stayed within the 48,000-character budget, that a second wait publishes
  nothing more, and that after reopening the app and deleting and rebuilding the SQLite file the
  checkpoint, source version, original hash and citation all resolve to identical text.
  The other two tests cover interrupt-then-resume with no duplicate charge, and an externally edited
  unit marking only that source `stale_source` while other sources stay searchable.
- `tests/test_source_library_tools.py tests/test_main_agent_research.py` → **26 passed**.

## Step 6 result

Added `backend/tests/manual/serve_source_library.py` — an isolated browser-demo fixture that copies
the committed fixture vault to a throwaway temp directory, scripts the main provider, blocks all
outbound network calls, and refuses to resume a vault it did not create. Added a `source-library-demo`
entry to `.claude/launch.json`. A `next dev` server was already running in `frontend/`, so the demo
frontend ran from a scratchpad copy on port 3128 against the fixture backend on port 8128. Both demo
servers and every `source-library-browser-*` temp vault were stopped and deleted afterwards; the
user's own dev server and vault were never touched.

Demonstrated in the browser: saved source with state and original/extracted links; partial extraction
rendered as "Partial text" with "6 pages are not extracted yet"; a research run that searched the
library, found page 900 of a 1,000-page source, followed the cross-page continuation to page 901, and
returned a conditional answer with owner and next action to the same conversation plus a dossier
revision; restart with the SQLite cache deleted preserving the answer and the same source version;
and a deterministic catalog with the 1,000 internal unit files correctly excluded from user file lists.
Not demonstrated in the browser: uploading through the browser's own file input (the in-app browser
has no file-upload tool) — that upload used the real API endpoint and only its display was verified;
and opening a page image for an OCR-failed page.

**Defect found and fixed during the walk.** The seeded 1,000-page source hung the matter workspace;
the unseeded fixture loaded fine, so the regression was mine. Matter-wide `.md` walks parsed all 1,000
unit files per request. Fixed by skipping the internal library in `VaultService.iter_files` /
`list_tree` and in `IndexService.lexical_search` unless the caller opts in or scopes into it; the
search index still ingests units. `/workspace` 2.77s → 0.74s, `workspace/files` 0.80s → 0.10s,
`mitigations` 1.16s → 0.11s. Also surfaced the library's own extraction state in the saved-file
listing (`workspace_evidence`) so a partial source does not read as fully saved after reload, and
corrected now-inaccurate "bounded to 30 pages" copy in `ResearchScopeChoice.tsx`.

Required final checks:
- `frontend`: `npm run typecheck` → **passed** (no output).
- `frontend`: `npm run build` → **passed**, all routes compiled.
- repo root: `graphify update .` → **passed**, 14,527 nodes / 28,241 edges / 1,493 communities.
- repo root: `git diff --check` → **clean**.
- `backend`: `.venv/bin/python -m pytest` → **1427 passed, 0 failed, 6 warnings in 491.41s**.

Delivered `docs/source-library.verification.md`.

## Last valid checkpoint

All six steps complete. Full backend suite 1427 passed / 0 failed. Frontend typecheck and build pass.
graphify updated. `git diff --check` clean. `docs/source-library.verification.md` delivered.
Demo servers stopped and every `source-library-browser-*` temp vault deleted; the user's own dev
server and vault were never touched.

## Verification notes

Baseline and feature results are recorded separately. No provider calls, no real-vault writes.
