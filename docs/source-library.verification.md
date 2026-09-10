> Repair update (2026-09-10): The original completion claims below were later challenged by review. See [source-library repair verification](source-library.repair-verification.md) for the corrected behavior and current checks. The earlier report is retained as history.

# Verification — Markdown + SQLite source library

Date: 2026-09-10. Executor: Claude Opus 5 (medium effort), acting on the user's selected preset.
No model/provider settings were changed. No paid model or OCR-service call was made at any point.

**Scope of this claim.** This is a deterministic storage-and-harness result. Every provider call in
every test and in the browser demo is scripted. Nothing here demonstrates model quality, legal
accuracy, or a solved memory problem, and no such claim is made.

---

## 1. What was built

| Path | Change |
|---|---|
| `backend/app/models/source_library.py` | **New.** `SourceManifest`, `SourceUnitEntry`, `UnitReceipt`, `ExtractionJob`, `SourceSearchRequest`; ceilings (1,000 pages/source, 1,000,000 chars/unit, 20,000,000 chars/source, 12,000-char sections, 6,000-char reads). |
| `backend/app/services/source_library.py` | **New.** `SourceLibraryService`: register, extract/resume, publish, describe, read, search, catalog, freshness. |
| `backend/app/services/source_extraction.py` | **New.** Child-process page extraction writing one file per page plus durable progress; deterministic section splitting. |
| `backend/app/services/source_index.py` | **New.** `source_versions`, `source_units`, `source_catalogs` projection. |
| `backend/app/services/index.py` | `SCHEMA_VERSION` 4 → 5; schema/`TABLES` extended; `_build` calls the projection; `lexical_search` excludes the internal library unless the scope is inside it. |
| `backend/app/services/vault.py` | `iter_files(..., include_source_library=False)` and `list_tree` skip the internal library; callers that need it opt in. |
| `backend/app/services/ingestion.py` | Registers every matter upload; PDFs/images get page-preserving extraction, DOCX/text keep their existing supplied extraction as sections. DOCX review/import behavior untouched. |
| `backend/app/services/research_collection.py` | `search_sources`, `_read_library`, run-scoped version pinning; retrieved sources registered into the library. Legacy `source_id`-only reads unchanged. |
| `backend/app/services/main_agent_research.py` | `library_sources` carried into the problem-analysis capture and the published result. |
| `backend/app/services/workspace_evidence.py` | Saved-file listing reports the library's own extraction state so a partial source does not read as fully saved after reload. |
| `backend/app/services/research_execution.py` | `INVESTIGATION_CONTRACT` extended with library search/read/continuation instructions. |
| `backend/app/agents/context.py` | `_source_library_pointer`: ≤2,000-char metadata-only pointer in the run context. |
| `backend/app/models/research_investigation.py` | `ResearchSourceRead` gains `source_version`, `unit_id`; page ceiling 30 → 1,000, start ceiling 100,000 → 20,000,000. `max_chars` still 6,000. |
| `backend/app/tools/research_investigation.py`, `handlers.py`, `registry.py` | `search_research_sources` registered through the existing authorization path. |
| `backend/app/blank_vault_template/00_System/tools/` | `search_research_sources.md` new; `read_research_source.md` regenerated from the model. `counsel-copilot.md` tool list extended. |
| `backend/app/runtime.py` | `app.source_library` wired; passed to ingestion and workspace evidence. |
| `backend/tests/manual/serve_source_library.py` | **New.** Isolated browser-demo fixture. |
| `backend/tests/test_source_library*.py` (5 files) | **New.** 39 tests. |
| `frontend/components/ResearchScopeChoice.tsx` | Corrected copy: the 30-page/6-OCR bound applies to fetched PDFs; saved matter sources are extracted to full length. |
| `.claude/launch.json` | `source-library-demo` entry for the isolated demo. |

Storage layout, under `<matter>/research/source-library/`: `index.md` (deterministic catalog),
`<source_id>/<source_version>/manifest.md`, `.../pages/pNNNNNN.md` or `.../sections/sNNNNNN.md`,
`jobs/<job_id>.md` and `jobs/<job_id>/` staging. Originals stay where they were saved.

---

## 2. Baseline vs final checks

**Baseline** (before any edit), from `backend`:
`.venv/bin/python -m pytest tests/test_research_tool_instructions.py tests/test_research_checkpoints.py tests/test_awareness_index.py -q`
→ **37 passed, 1 warning in 2.29s**. Matches the plan author's recorded baseline. The one warning is
the pre-existing Starlette/httpx deprecation. FTS5 trigram confirmed on the backend interpreter
(SQLite 3.53.1).

**Focused acceptance**, from `backend`:
`.venv/bin/python -m pytest tests/test_source_library.py tests/test_source_library_extraction.py tests/test_source_library_index.py tests/test_source_library_tools.py tests/test_source_library_lifecycle.py tests/test_research_documents.py tests/test_research_tool_instructions.py tests/test_research_checkpoints.py tests/test_research_scope.py tests/test_ingestion.py tests/test_ingestion_limits.py tests/test_awareness_index.py -q`
→ **104 passed** (recorded mid-build at Step 4).

Final full backend suite: **1427 passed, 0 failed, 6 warnings in 491.41s (8m11s)**. The 39 new
source-library tests are included. No baseline failure existed before this work and none exists now;
the only warnings are the pre-existing Starlette/httpx deprecation and PyMuPDF SWIG import notices.

**Required final checks:**

| Check | Result |
|---|---|
| `backend`: `.venv/bin/python -m pytest` | **1427 passed, 0 failed, 6 warnings in 491.41s** |
| `frontend`: `npm run typecheck` | **passed**, no output |
| `frontend`: `npm run build` | **passed**, all routes compiled |
| repo root: `graphify update .` | **passed** — 14,527 nodes, 28,241 edges, 1,493 communities |
| repo root: `git diff --check` | **clean** |

Two existing assertions were updated, never weakened: the investigation tool set in
`test_main_agent_research.py` now includes `search_research_sources`, and the shipped
`read_research_source` description was regenerated from its model (its existing
"6000 characters" and "omit page_number and find_text" assertions still hold).

---

## 3. Acceptance matrix

| Area | Evidence |
|---|---|
| **Capacity** | A real 1,000-page native-text PDF is extracted to 1,000 distinct page units, `extraction_state: complete`, **95,929 characters** total, 0 unread, ~8.8 MB on disk. Page 900 is directly readable and searchable. `test_source_library_extraction.py`, `test_source_library_lifecycle.py`, and the browser demo. |
| **Context** | In the browser demo the whole answer cost **599 admitted evidence characters** out of the 48,000 budget, over 4 main calls, against a 95,929-character source. Max single read 6,000 chars; max snippet 400 chars; added initial context ≤2,000 chars. A serialized system+context+tool-result capture over a 200-page source shows the marker exactly twice (one snippet, one deliberate read) and no unit hash or path for unread pages; over the 1,000-page source, page 500's body, hash and path are all absent and the total request is <400 KB. |
| **Completeness** | A paragraph split across pages 900–901 is read through the returned `next_read`; `paragraph_continues` marks the cut. `has_more_in_unit` and `extraction_complete` are separate fields, and `unread_page_count` is reported separately from both. |
| **Recovery** | Interrupted extraction resumes to `complete` with the earlier partial version still resolving (`predecessor_version` links them). An interrupted run recovers with identical budgets: replaying the same search and read charges nothing. Deleting only the SQLite file and rebuilding restores identical source IDs, versions, catalog generation and search hits with 0 index errors — proven both in tests and in the browser. |
| **Integrity** | Manifests pin `original_path` and `original_sha256`; every unit carries `body_sha256`, checked before any hit or passage is returned. An externally edited unit returns `status: stale_source` with the tampered text withheld, is excluded from search with a warning, and does **not** affect other units or other sources. |
| **Scope** | Another matter's text never appears in snippets, catalog or serialized context. Reading another matter's version is refused. Malformed arguments (empty/oversized query, `limit` 0/11/99, negative start, `max_chars` 6001, oversized `unit_id`, cursor path traversal, unknown fields) all raise validation errors. Unit paths that escape their version directory, are absolute, or contain `..` are rejected at the model layer. Both tools refuse to run without an authorized investigation. |
| **Compatibility** | Legacy `source_id`-only reads keep `text.find`, absolute offsets and page/find-override-start semantics. Old snapshot hashes still load. Editable `.extracted.md` companions and DOCX review data are untouched. Legacy `lexical_search` semantics (one/two/three-character behavior, ANY-term substrings, Unicode) are asserted identical to `VaultService.lexical_search`. |
| **User flow** | One conversation, one packet, one dossier revision; a second wait adds nothing. Citations reopen the exact saved version and offsets after a reload. Deliberately malformed final structured metadata was supplied and the useful prose still reached the published packet. |
| **Cost** | Zero paid calls. Real local tesseract used for OCR; OCR failure also tested by mock. Timings and byte counts reported; no monetary estimate invented. |

---

## 4. Browser demonstration

Isolated fixture: `backend/tests/manual/serve_source_library.py`. It copies the committed fixture
vault to a throwaway temp directory, scripts the main provider, and **blocks all outbound network
calls** (`native_research.discover` and `SafeHttpFetcher.fetch_binary` raise). It refuses to resume a
vault it did not create. It never touches a real vault.

```bash
cd backend
.venv/bin/python -m tests.manual.serve_source_library --port 8128 --frontend-origin http://localhost:3128
# resume the same vault:  --resume-fixture <printed path>
# skip seeding to upload in the browser instead:  --no-seed
```

Frontend: `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8128/api` on port 3128 (the
`source-library-demo` entry in `.claude/launch.json`). A `next dev` server was already running in
`frontend/`, and Next refuses a second dev server in the same directory, so the demo frontend was run
from a copy of `frontend/` in the session scratchpad. **Cleanup:** stop both servers and delete the
`source-library-browser-*` temp directory and the scratchpad copy.

Demonstrated in the browser, in the real UI:

1. **Saved source visible** — `synthetic-authority.pdf` listed as a supplied source, "Text ready",
   with source ID, "Open original" and "Open extracted text".
2. **Partial extraction** — a 12-page scan-heavy PDF renders as **"Partial text"** with
   "Source saved; 6 pages are not extracted yet.", after a reload, alongside the complete source's
   "Text ready".
3. **Late-page search and read** — asked "Research when consent is not required…"; the run used
   `search_research_sources`, found **page 900** of the 1,000-page source, read it, followed the
   cross-page continuation to **page 901**, and returned a conditional answer naming its locator,
   condition, owner and next action.
4. **Answer returns to the conversation and the dossier** — the answer appears in the same
   conversation with "Open full research", "Review the research-based recommendation proposal — not a
   recorded decision", and "Open dossier revision"; a "Research-based dossier revision" record exists.
5. **Restart and version retention** — the server was stopped, `.counsel_os_cache.db` **deleted**, and
   restarted with `--resume-fixture`. The conversation, the answer and the same source version
   `70fbdf928162a46a5d4d0ec414fcecdd` all survived; the file listing still reports the source complete.
6. **Catalog navigation** — the deterministic catalog `…/research/source-library/index.md` records
   `catalog_generation`, `source_count`, and one line per version with its state, unit count,
   character count, manifest link and original path. The document picker lists real matter records and
   sources only; the 1,000 internal unit files are correctly excluded (Files 10 → 14 with two sources).

**Not demonstrated in the browser:** uploading a file through the browser's own file input (the
in-app browser has no file-upload tool) — the scan-heavy PDF was uploaded through the real
`POST /api/matters/{id}/upload` endpoint on the running fixture server, and only its **display** was
verified in the browser. Opening a page image for an OCR-failed page was not exercised in the UI;
`page_image_path` is returned by the read API and the images are on disk.

---

## 5. Defect found and fixed during the browser walk

Seeding the 1,000-page source made the matter workspace **hang**; the unseeded fixture loaded fine, so
the regression was mine. Cause: matter-wide `.md` walks (`workspace._output_revisions`,
`source_revisions`, the workspace-review scans, `list_tree`) parsed every one of the 1,000 unit files
on each request. Fix: the internal source library is skipped by `VaultService.iter_files` and
`list_tree` unless a caller opts in or walks into it directly, and `IndexService.lexical_search`
excludes it unless the scope is inside it. The search index still ingests units
(`include_source_library=True`), so library search is unaffected.

`GET /api/matters/MAT-DEMO-BEACON/workspace`: **2.77s → 0.74s**; `workspace/files` 0.80s → 0.10s;
`mitigations` 1.16s → 0.11s. Regression test: the document picker and file listing show only real
matter files.

---

## 6. Design details reduced to a smaller equivalent

**Per-unit job checkpoints → batched receipts.** The blueprint asks for a job-checkpoint write after
every unit. That is O(n²) YAML rewrites and made the 1,000-page case unusably slow. Every unit body is
already durable in the job staging area (`jobs/<job_id>/units/`) *before* any receipt is written, so
receipts are checkpointed every 50 units and again at the end (`CHECKPOINT_EVERY`). A crash
re-persists at most 50 units idempotently from staged text — no refetch, no provider call. The
recovery guarantee is preserved; only the quadratic cost is not.

Publication order is stage → read back → hash → compute the version digest → move into the immutable
version directory → write the manifest → refresh the catalog. The digest is therefore computed from
the persisted body, never from a pre-normalized string, which the blueprint explicitly requires.

---

## 7. Remaining limits

- **Scripted provider only.** No statement about model quality, legal accuracy, or memory.
- **Extraction ceilings are real:** 1,000 pages per source, 1,000,000 characters per page,
  20,000,000 characters per source, 6 OCR pages and 45 seconds per invocation. Exceeding any of them
  produces an explicit `partial` state with `unread_page_count` and `next_page`, never a silent slice.
  OCR is not looped automatically; the main agent or the user must request continuation.
- **Remote fetch limits are unchanged.** A large remote file still reports the transport limit; supply
  it by upload instead.
- **The editable `.extracted.md` companion keeps its own `extraction_state`** (its pypdf text may be
  available while library evidence extraction is partial). Both are truthful and describe different
  artifacts; the file listing now shows the library state so the distinction is visible.
- **No automatic filesystem watcher.** Files added outside registration stay reachable by the existing
  vault tools but are not library sources.
- **Orphan staging files are not deleted** (as the blueprint directs for this build).
- Not added, and not authorized: embeddings, a graph database, incremental indexing beyond the
  per-batch refresh, verifier agents, a wiki-writing agent, model-written memory, automatic retries.

---

## 8. Exact resume instructions

Progress: `docs/source-library.handoff-progress.md` (all six steps recorded complete).

```bash
cd backend && .venv/bin/python -m pytest tests/test_source_library.py tests/test_source_library_extraction.py tests/test_source_library_index.py tests/test_source_library_tools.py tests/test_source_library_lifecycle.py -q
```

To re-run the browser demo, follow §4. To resume a partial extraction in code:

```python
descriptor = await app.source_library.extract_or_resume(matter_id, job_id)             # continue at next_page
descriptor = await app.source_library.extract_or_resume(matter_id, job_id, page_number=900)  # targeted page
```

Both are idempotent. Never repeat a paid or ambiguous call to recover.
