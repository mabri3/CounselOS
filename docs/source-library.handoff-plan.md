# Markdown + SQLite source library — implementation blueprint

Date: 2026-09-10
Target executor: Astra Light, using the user's selected preset. Do not infer an API model name or change model settings from that label.
Repository: /Users/bharris/Programs/counsel-os-mvp
Status: PLANNED. No application implementation has been performed by the plan author.

## Outcome and proof

A lawyer adds a long source, asks a question whose answer is near its end, and receives useful analysis linked to the exact saved passage. The original file and extracted Markdown remain available. Restarting the app or rebuilding SQLite does not lose the source, selected passages, or published answer.

Build the source library and its real harness integration. This is not a request for a new research agent, a general wiki engine, or automatic model-written memory.

Success requires a deterministic, assembled application test of a 1,000-page native-text PDF, a smaller mixed scanned PDF, and a long HTML source. Use synthetic sources and mocked provider/network boundaries. Test the actual upload/collection → save → index → search → read → checkpoint → answer → dossier → reload sequence. A scripted provider proves plumbing, not model quality. Report that limit.

## Evidence and architectural decisions

AltBench showed source tools could answer across 1,000-page corpora; full-context requests exceeded a provider input-character limit above 100 pages. At 100 pages, final-answer input was about 87% lower with tools. This was not a total-cost measurement. Unstable grading and defective record retention prevent a general quality or memory conclusion. These findings motivate selective reading; they do not validate Markdown over SQL or an agent-written wiki.

Decisions for this build:
1. Original bytes remain the evidence artifact. Canonical extracted text and metadata are Markdown. SQLite is disposable.
2. Reuse the existing SQLite database, VaultService, research loop, source IDs, scope rules, and publication flow.
3. Use page/section Markdown files for long sources. Never place an entire source corpus in YAML frontmatter, tool responses, or initial model context.
4. Add a deterministic matter source index page. Do not spend model calls writing index descriptions or topic articles.
5. Keep source extraction separate from generated analysis. Existing editable document companions and lawyer work product remain editable; new evidence snapshots are immutable through app editing routes.
6. Retain bounded execution, fetch, OCR, and evidence limits. Separate storage capacity from model-read size.
7. Keep the main agent in charge of research questions, source selection, further reads, and synthesis. The collector only obtains requested public evidence.
8. Preserve existing facts, corrections, recorded decisions, and checkpoints. Do not introduce automatic conversation compaction or model-written memory in this implementation.

## Verified current code and gaps

Paths below are repository-relative unless otherwise stated. Read the actual files before editing because this checkout contains substantial unrelated work.

| Existing location | Verified behavior | Required extension |
|---|---|---|
| backend/app/services/vault.py | VaultService resolves inside the vault; atomic Markdown/byte writes; read_markdown strips frontmatter | Reuse. Hash the persisted read-back content, not a pre-normalized string. |
| backend/app/services/index.py | IndexService; schema version 4; atomic whole-index rebuild; vault_search uses FTS5 trigram plus bigram lookup | Add source metadata and passage lookup to this database. Preserve legacy lexical_search semantics. |
| backend/app/services/research.py | _save_retrieved_sources saves immutable URL/text-version snapshots under research/sources | Integrate library registration without duplicating full source payloads in the agent result. Keep old snapshot compatibility. |
| backend/app/services/research_reader.py | read_source saves fetched bytes; extracted_result cache; 100,000-character text ceiling | Persist admitted text beyond the model-read ceiling. Return compact references. Preserve bounded network checks. |
| backend/app/services/research_documents.py | extract_document uses a child process; 5 MB, 30 pages, 6 OCR pages, 45 seconds; 20,000 chars/page | Add resumable page-file extraction for the new library path. Do not simply remove all limits. |
| backend/app/services/ingestion.py | upload_to_matter, _persist_source preserve originals and existing companions; PDF extraction loses explicit page IDs; DOCX has review data | Register uploads and add page-preserving PDF extraction. Do not alter DOCX review/import behavior. |
| backend/app/services/research_collection.py | ResearchCollection._fetch, capture_local, read; run-scoped source snapshots and selected passages | Connect library versions and bounded reads to the current investigation. |
| backend/app/models/research_investigation.py | ResearchSourceRead: page <=30, start <=100000, max_chars <=6000 | Extend valid storage address space while keeping 6000-character reads and old semantics. |
| backend/app/tools/research_investigation.py | authorized checks server-owned ResearchCollection; read handler calls synchronous read | Reuse authorization. If async continuation is added, update this caller and all discovered callers/tests together. |
| backend/app/tools/registry.py | scope checks and cached tool results; read_file invokes capture_local | Ensure new source tools and legacy reads obey the same scope/exclusion and journal rules. |
| backend/app/tools/handlers.py | read_file clips large ordinary reads; search_vault defaults to current matter | Provide library navigation without bypassing these boundaries. |
| backend/app/services/research_checkpoints.py | sequence-checked Markdown checkpoints; conservative call receipts; snapshot hashes; evidence_chars=48000 | Keep budgets and receipts. Add references to pinned library versions, not full page catalogs. |
| backend/app/agents/context.py | ContextBuilder builds bounded context with source references and active-file handling | Include a small library pointer, not all source pages. Avoid duplicate evidence injection. |
| backend/app/runtime.py | constructs IndexService, ingestion and other services | Wire one SourceLibraryService here. |
| backend/app/services/matter_paths.py | configurable source-document folder via MatterPathPolicy.folder | Respect configured original upload location. Internal research library stays under the resolved matter root. |

Fragile excerpts:
- VaultService.write_markdown uses content.strip() + "\\n". Compute offsets and hashes from read_markdown(path)["content"].
- Current ResearchCollection.read uses text.find(find_text, ...) and returns absolute start/end. Page and find override start. Preserve this legacy behavior for old snapshots.
- Current model-read maximum is 6000 characters; increasing page count must not increase that maximum.
- IndexService.rebuild creates a temporary SQLite file, checks integrity, and atomically swaps it. Extend that path instead of building a separate cache service.
- ResearchCheckpoints.load verifies old snapshot hashes. Keep its old-version reader intact.

## Storage blueprint

Use resolved matter root M = app.matters.matter_path(matter_id). Do not hardcode a matter name or bypass MatterPathPolicy for original uploads.

New managed layout under M/research/source-library/:
- index.md — deterministic current-source catalog; links and extraction states only.
- <source_id>/<source_version>/manifest.md — immutable published extraction manifest.
- <source_id>/<source_version>/pages/p000001.md ... — immutable extracted page text.
- For non-paginated HTML/text/DOCX, use sections/s000001.md ... and label section locators, never invented PDF pages.
- jobs/<job_id>.md — mutable, atomic extraction checkpoint referencing original bytes and completed page files.
- jobs/<job_id>/... — staging page files before manifest publication.

Original PDFs and uploaded files stay in their existing source location. Fetched byte caches may be reused if their hash and matter ownership validate. A published manifest pins original_path and original_sha256. Do not follow an arbitrary frontmatter path outside the vault or authorized matter.

Source identity:
- Preserve existing source_id when present. For a new public source use the existing URL-derived convention; for uploaded sources preserve the ingestion ID.
- source_version identifies exact extracted evidence, not only the URL or original filename.
- Build the version digest deterministically from original byte hash, extraction format version, ordered page/section IDs and their saved body hashes, and extraction status. No volatile timestamps in the digest.
- A later successful OCR/extraction is a new version. Old citations continue to resolve to the old version.
- Idempotent ingestion of the same bytes and extraction result returns the existing version. Changed bytes at the same URL create a new version. Do not silently replace an old version.
- A failed extraction creates a visible job/partial result, not a fabricated complete source.

Manifest frontmatter schema (new proposed contract; implement validation):
- record_type: source_manifest
- schema_version: 1
- matter_id, source_id, source_version
- title, source_kind: supplied | retrieved
- original_path, original_sha256
- requested_url and final_url when available; retrieved_at for public retrieval
- published_at/effective_at/jurisdiction only when actually supplied or extracted; unknown remains null
- extraction_format_version
- extraction_state: complete | partial | unavailable
- page_count for actual paginated sources; null otherwise
- extracted_unit_count, total_chars
- units: ordered entries with unit_id, relative path, body_sha256, char_count, page_number or section label, extraction_method, warning, image_path if present
- warnings; predecessor_version if there is one

The manifest body is a readable title, provenance, extraction coverage, and links. The full unit list stays on disk, never automatically in a model request. A page Markdown file repeats its source identity, unit_id, page_number, method, and hash metadata; body is literal extracted text. Avoid duplicating text in frontmatter.

Canonical offsets are Unicode character offsets in the persisted Markdown BODY, start inclusive/end exclusive. Prefix headings/page labels go in metadata or outside the literal body; do not shift offsets after returning them. Store PDF page_number as one-based file page. Printed page labels, if known, are a separate field. Do not infer printed labels.

Atomic publication:
1. Save and hash original bytes first using existing safe operations.
2. Persist a job checkpoint before extraction.
3. Write each unit atomically; read back and hash; then add its receipt to the job checkpoint.
4. Stage a manifest referencing only durable units.
5. Publish the immutable version directory/manifest without overwriting a different existing version.
6. Update catalog and SQLite after the source is durable.
A crash after step 5 but before step 6 must be repaired locally without refetching or another model call. Orphan staging files can remain; do not add automatic deletion in this build.

## Extraction and continuation

Native PDF target: up to 1,000 pages per admitted file, bounded by the existing configured upload limit. Keep the existing remote fetch byte limits; a larger remote file must report that limit and can be supplied through upload. Do not increase global transport limits to claim large-file support.

Implement the library extractor as an extension of research_documents.py, split into a focused helper if needed. Keep the old extraction entry point as a compatibility adapter until its callers are migrated.

- Child process writes per-page Markdown and durable progress; it does not return megabytes through stdout.
- Keep a 45-second bound per extraction invocation. Completed pages survive timeout.
- Native extraction covers available pages within that invocation. No fixed 30-page cutoff for the new library path.
- Keep six OCR pages per invocation and eight seconds per OCR subprocess. Do not automatically loop OCR invocations until the whole source is scanned.
- Partial source reports unread page count and next resume position. Main agent can request continuation within the existing run's remaining time budget. The existing upload response can show partial state and a reference; it must not claim completion.
- Provide targeted extraction of a requested page, so a scan-heavy prefix does not make page 900 unreachable.
- Persist full native page text within an explicit 1,000,000-character per-page resource ceiling. If exceeded, mark partial and retain original; do not silently slice it as complete.
- Total admitted extracted text ceiling: 20,000,000 characters per source for this demo. This is a storage/extraction ceiling, not active context. Report an explicit partial state at the ceiling.
- Preserve page images for attempted OCR. If OCR is unavailable, retain native text and page image and label the OCR failure. Never invent recognized text.
- For HTML preserve useful headings/paragraph boundaries from the fetched body; exclude script/style. Deterministically split long content at paragraph boundaries into <=12,000-character storage units; a longer paragraph can span units with explicit continuation. Preserve the admitted original body and extraction coverage.
- DOCX keeps existing review extraction and companion. Register that saved text as section-based supplied content; do not manufacture stable page numbers for reflowable documents.
- Existing editable companions are not silently replaced with immutable evidence pages. An explicit edited companion is supplied user content, distinct from extraction of original bytes.

All extracted content is untrusted data. Embedded instructions do not change tool permissions or cause code execution.

## SQLite projection and freshness

Add a focused source_index.py helper invoked by IndexService._build. Proposed new tables:
- source_versions: primary key (matter_id, source_id, source_version); manifest_path, original_path, title, source_kind, extraction_state, manifest_hash.
- source_units: primary key (matter_id, source_id, source_version, unit_id); path, body_hash, page_number, section_label, char_count, method.
Reuse the existing vault_search index over these Markdown unit files. Search results are joined/mapped to source_units for precise locators. Do not add embeddings or a second database.

Update SCHEMA_VERSION, SCHEMA, TABLES, TABLE_COLUMNS where applicable, schema checks and rebuild tests together. Parameterize SQL values. Validate record paths and hashes before indexing. Malformed manifests produce index errors while valid sources remain searchable.

Preserve current search_vault semantics: whitespace-separated terms, case-insensitive ANY-term substring matching; not Boolean syntax, not semantic search. Keep existing regression tests for one/two/three-character behavior and Unicode. Generated catalogs and extraction job metadata must not crowd source search: filter new source search to registered unit paths, not all vault text.

Freshness policy:
- App-mediated source publication attempts one index refresh after a batch, not after every page.
- Persist a small per-matter catalog generation in Markdown. SQLite records indexed generation; mismatch triggers one local refresh before source search.
- Before returning a hit or passage, check the actual referenced file/hash. A stale hit must not be presented as current evidence.
- If SQLite is missing, corrupt, or refresh fails, serve bounded direct file reads and an explicit index warning. A deterministic scan of this matter's registered unit files is an acceptable fallback; report its time/coverage limit instead of claiming no match.
- External edits to a registered immutable page fail integrity checks; do not silently turn them into a new original. User-edited companions can be registered as a new supplied snapshot through normal app paths.
- Files manually added outside registration remain reachable by existing vault tools. This build does not promise an automatic global filesystem watcher.
- Index rebuild must recover all committed library versions without provider calls and must not rewrite canonical Markdown.

## Proposed service and tool contracts

New module backend/app/services/source_library.py; class SourceLibraryService(vault, index, matters). Wire as app.source_library. New signatures below are target contracts, not claims about existing methods:
- register_saved_source(matter_id, original_path, *, source_id, title, source_kind, provenance) → compact source descriptor/job reference.
- async extract_or_resume(matter_id, job_id, *, page_number=None) → compact descriptor with extraction state and cursor.
- search(matter_id, query, *, source_id=None, source_version=None, limit=5) → bounded hits.
- read(matter_id, source_id, source_version, unit_id, *, start=0, max_chars=6000) → literal bounded passage.
- catalog(matter_id, *, cursor=None, limit=20) → metadata only.

Keep file operations within vault, validate matter ownership, and apply the existing frozen research scope/excluded paths at the tool adapter before calling service methods. The service must also reject mismatched matter IDs/paths.

Add ONE tool, search_research_sources, to the authorized investigation:
Input: query (1..2000 chars), optional source_id and source_version, limit default 5/max 10.
Output hits: source_id/version, unit_id, page/section, body offset, <=400-char snippet, title, extraction status, next read arguments. Whole response text budget <=6000 chars; deterministic ordering and explicit results_omitted flag.
No match returns not_found, query semantics and a suggestion to use source wording or catalog navigation; it does not mean the rule does not exist.

Extend read_research_source additively with optional source_version, unit_id, and continuation cursor for library records. Preserve source_id-only legacy behavior for pinned run sources. A tool may read only sources registered in the current authorized run; searching an allowed stored source registers/pins its version in that run before returning the ID. Do not allow arbitrary user/model-supplied path reads through this API.

Library read result:
- status: read | not_found | partial | unavailable | stale_source
- source_id, source_version, unit_id, body_hash
- start/end, page_number or section_label, extraction_method
- text <=6000 chars
- has_more_in_unit, next_read arguments for same unit or next unit
- extraction_complete separately from has_more
- original_file_path, page_image_path where available
- warnings, remaining_budget

Avoid source_version ambiguity: a request using only source_id resolves the version pinned by the current run, never whichever version is newest now. Wrong version/cursor returns a recoverable error with valid navigation choices. Cursor is validated structured data, not executable text.

Paragraph handling: return up to the requested cap. Prefer ending at a paragraph boundary within that cap, provided it advances. If the paragraph exceeds the cap, return a marked continuation. Never imply a paragraph is complete because a character cap was hit. A page-crossing exception can require a next-unit read. Preserve exact offsets, including Unicode and repeated text.

Budget rules:
- Keep 6000 chars/read and the existing 48000 evidence-character run budget.
- Count all newly admitted search snippets and passage text; cached identical tool replay does not charge twice.
- Reserve and report extraction time against existing run execution controls. Storage-only extraction does not spend model evidence budget.
- Keep only selected excerpts and compact source references in model messages and research checkpoints. Source manifests/page arrays stay on disk.
- Keep a compact catalog pointer in initial context (<=2000 chars added, no full-page text). Catalog may be read via read_file; large catalogs must expose pagination rather than auto-injecting all rows.
- Existing final-answer-only behavior at execution limits remains mandatory.

## Main-agent instructions and visible behavior

Update shipped declarative Markdown tools, schemas and MAIN_AGENT_CONTRACT together. Include exact examples with returned IDs, versions, unit IDs, page locators and next_read arguments. Preserve the previous clarified search/read semantics and old-vault bundled precedence without rewriting user vault tool files.

Instruction content:
- Use the source catalog/search to locate likely evidence.
- Read the controlling passage before treating a snippet as support.
- Follow continuation when the paragraph is incomplete; read relevant definitions, exceptions, and cross-references when they can change the answer.
- Sources and extracted text are evidence; generated analysis and working notes are labeled interpretations.
- A source being stored or retrieved does not mean its rule applies.
- State material extraction gaps briefly; deliver the strongest useful answer.
- Return recommendations with conditions, owner/next action when supported, and cited selected passages. Keep recommendations separate from recorded decisions.
- Carry results through existing publication to the originating conversation and dossier. Do not create a disconnected wiki answer.

Use the existing research/source reader and document navigation. Show Source saved / Partial extraction / Text unavailable as clear text. A source link opens its saved passage; the original file and page image remain accessible. Do not build a new dashboard. Read docs/DESIGN_LANGUAGE.md before any necessary frontend change and reuse semantic design roles.

## Checkpoint and recovery contract

There are TWO checkpoint purposes:
1. Extraction job: original hash, extractor version, completed unit receipts/hashes, unread pages, last error, next position, elapsed resource allowance, sequence.
2. Research run: pinned source/version/unit references, selected passages, pending call receipts, remaining budgets, next main-agent step, publication receipts.

Keep Markdown authoritative for both. Never use SQLite as the only durable memory.

For any checkpoint replacement: validate the full proposed record before atomic replacement; failed serialization, oversize, stale sequence or interrupted write preserves the last valid checkpoint. Never clear the previous record to make a new record fit. Save an error receipt separately where possible. This is required for this build's source checkpoints; it does not authorize adding a model-memory feature.

Restart rules:
- Reuse valid fetched bytes and completed extracted units.
- Never refetch because the index was lost.
- A completed provider call replays its saved output.
- An ambiguous external call keeps outcome_unknown; do not silently retry or reset budget.
- A bad source hash leaves prior answer/work product visible and marks that source unavailable. Do not refetch silently.
- Existing publication receipts prevent duplicate conversation messages, dossier revisions and recommendations.

## Ordered implementation steps

Before starting, read docs/PRD.md, CODEX_HANDOFF.md, current.md, docs/ARCHITECTURE.md, docs/ACCEPTANCE_TESTS.md and applicable AGENTS.md. Run graphify query before raw code exploration. Record baseline dirty paths and protect actual vaults. Use an isolated test vault; do not change the user's active vault pointer.

### Step 1 — Baseline and contracts
Read the named callers. Use rg to enumerate all calls to read_source, extract_document, ResearchCollection.read/capture_local, _save_retrieved_sources and upload_to_matter. Record them in the verification file before signature edits. Add the typed manifest/job/read models and contract fixtures. Confirm local SQLite FTS5 availability with the existing backend interpreter. No provider calls.
Verification: existing targeted baseline command below; new model tests reject missing keys, bad enums, negative offsets, duplicate unit IDs and escaping/symlink paths. New tests must fail meaningfully before implementation. Do not mark an expected pre-implementation failure as a passing test.

### Step 2 — Durable source store and extraction
Implement source_library.py and focused extraction helpers. Wire existing upload and fetched-source save paths to registration. Add page-preserving extraction with the limits above. Preserve editable companions and original upload collision handling. Implement immutable version publication and local resume.
Verification: new test_source_library.py and test_source_library_extraction.py cover actual persisted readback, identical reimport, changed bytes, 1000-page native PDF, page 900 read, mixed OCR, missing OCR, malformed/encrypted input, oversized page, timeout, interruption and resume. Use real generated PDF files for extraction tests; mock OCR failure as well as checking an available real OCR binary. No paid OCR service.

### Step 3 — Index, catalog and recovery
Add source_index.py projection and connect IndexService._build. Build deterministic source index.md. Implement freshness checks, stale-hit rejection, scoped search and fallback.
Verification: new test_source_library_index.py plus existing test_awareness_index.py. Prove deleting ONLY the isolated SQLite file and rebuilding yields identical source IDs, versions and search hits. Failed index refresh preserves source files and a readable result. Cross-matter excluded text never leaks through snippets/catalog.

### Step 4 — Tools and bounded context
Add search_research_sources; extend read_research_source; register tools through existing handlers/registry and shipped Markdown. Wire ResearchCollection and ContextBuilder. Keep compatibility adapters and old-vault tool precedence.
Verification: new test_source_library_tools.py and existing research instruction/scope tests. Test exact offsets, multibyte text, end-of-unit, repeated phrase, cross-page continuation, source version pinning, <=6000 response text, <=2000 added initial context, evidence budget, identical replay, malformed arguments and permission boundaries. Capture actual serialized provider requests to prove full pages/manifests are not automatically included.

### Step 5 — Publication and assembled restart
Connect descriptors to the existing source reader/citation path and publication. Make only necessary UI changes for precise locators/partial status. Do not alter decision records automatically.
Verification: new test_source_library_lifecycle.py drives real tool registry and run services with scripted provider. Search target near page 900, read a cross-page exception, interrupt after evidence receipt, resume, produce useful answer, publish once, reload, rebuild index, open citation. Assert source hash/version and corrected facts/owner/pending decision remain unchanged. Simulate malformed final structured metadata and prove useful prose remains visible.

### Step 6 — Browser demo, required checks and handoff
Use an isolated vault/server based on backend/tests/manual/serve_research_investigation.py. Extend that fixture or create backend/tests/manual/serve_source_library.py; do not point it at the real vault. Record exact launch commands, ports, mock boundaries and cleanup in verification.
Walk docs/ACCEPTANCE_TESTS.md. Explicitly demonstrate upload, partial extraction, source index navigation, late-page search/read, original/page access, answer+dossier return, restart and source-version retention. Use native browser tooling. Do not claim browser testing from API tests.
Run full backend suite, frontend typecheck/build, graphify update ., git diff --check. Record counts and failures. Update progress after each verified step.

## Commands and verification status

Plan author inspected paths and contracts and ran the targeted baseline on 2026-09-10: 37 passed in 2.26 seconds, with one existing Starlette/httpx deprecation warning. This proves only the existing baseline. Future feature tests do not exist yet and have NOT been run. The executor must create them before running these acceptance commands. Baseline commands are separate from future acceptance.

From repository root:
~~~bash
cd backend
.venv/bin/python -m pytest tests/test_research_tool_instructions.py tests/test_research_checkpoints.py tests/test_awareness_index.py -q
~~~

Focused acceptance after implementation, from backend:
~~~bash
.venv/bin/python -m pytest tests/test_source_library.py tests/test_source_library_extraction.py tests/test_source_library_index.py tests/test_source_library_tools.py tests/test_source_library_lifecycle.py tests/test_research_documents.py tests/test_research_tool_instructions.py tests/test_research_checkpoints.py tests/test_research_scope.py tests/test_ingestion.py tests/test_ingestion_limits.py tests/test_awareness_index.py -q
~~~

Required final checks, each from its stated directory:
~~~bash
# backend
.venv/bin/python -m pytest
# frontend
npm run typecheck
npm run build
# repository root
graphify update .
git diff --check
~~~

All newly added behavior tests must pass. Preserve baseline failures as baseline findings, investigate relevant regressions, and never weaken assertions merely to make the run green. An unrelated warning alone is not a blocker. If a required check cannot run, name it and the reason; do not claim full verification.

## Acceptance matrix and measurable report

| Area | Evidence required |
|---|---|
| Capacity | 1000 distinct native PDF pages; target near end accessible; exact total chars and extracted/unread counts |
| Context | Serialized request capture; max single read, snippets, added initial context and total admitted evidence |
| Completeness | Cross-page paragraph/exception readable; partial extraction separate from unread remainder |
| Recovery | Crash at unit write/manifest publication/index refresh/run evidence receipt; resume without duplicate calls |
| Integrity | Original hash; immutable version and body hashes; source edit or wrong locator detected |
| Scope | Unauthorized matter/path/cursor and source injection do not expand scope |
| Compatibility | Legacy run/source IDs, old tool instructions, editable companions, DOCX review data |
| User flow | Same conversation and dossier updated once; citations reopen selected source version; useful prose survives failures |
| Cost | Zero paid calls for implementation verification; benchmark time/bytes reported without invented monetary estimates |

Write docs/source-library.verification.md with changed paths, baseline versus final checks, demonstrated behavior, screenshots/replay links, remaining limits and exact resume instructions. Report a deterministic storage/harness demo separately from real-model quality. Do not claim that this implementation solved memory or established legal accuracy.

## Resume protocol

Progress file: docs/source-library.handoff-progress.md.
Read it first. Begin at the first pending step. Verify done steps still hold; if a done step now fails, investigate and report the discrepancy rather than blindly reapplying it. After each step, record its status, checks, evidence paths and next step immediately. All operations should be idempotent. Never repeat a paid/ambiguous call as a way to recover.

Continue through safe reversible implementation details consistent with these contracts. If code has materially changed, document the exact mismatch before changing architecture. Stop only for a material instruction conflict, unavailable required dependency/access, an unresolved relevant failure after focused diagnosis, or an action requiring new authorization. Do not stop for unrelated dirty files or optional polish.

No commits, pushes, deployments, real-vault migrations, new paid calls, automatic retry policies, provider changes, verifier agents, embeddings, graph database, global watcher, or background wiki-writing agent are authorized by this handoff.

## Not scheduled and evidence triggers

- Model-written working records: consider only after the independent AltBench reduced-history test shows a repeatable benefit.
- Agent-written topic wiki: consider when users repeatedly need the same synthesis and source indexes are insufficient; preserve source links and version basis.
- Semantic/vector retrieval: consider after measured misses on known relevant sources with the existing lexical tools.
- Incremental indexing beyond per-batch refresh: consider if the 1000-page demo's measured refresh cost is unacceptable. Keep the current simple rebuild first.
- More than 1000 pages/file, remote fetch limit increases, large OCR runs: require observed need and explicit resource budgets.
- Multi-user transactional database architecture and cloud infrastructure: outside this local MVP.

## Prompting reference

The target label Astra Light is preserved as the user's execution preset; this blueprint makes no claim about its API mapping, pricing or context window. The handoff uses explicit outcomes, constraints and completion evidence, following official guidance: https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices.

