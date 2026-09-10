# Source library repair verification

Repairs address the September 10 review. The earlier review remains a record of the submitted version.

## Corrected behavior

- Fetched PDF bytes are detected independently of the cache filename.
- HTML uses the retained response body, with paragraph boundaries. A 100,000-character preview no longer clips the stored source.
- Search selects one current or pinned version. Excluded sources are filtered before snippets or catalog metadata enter the inquiry.
- A read requires a version selected by this inquiry. Registration rejects originals from another matter.
- Published manifests and units cannot be edited through normal file or document controls.
- A crash before manifest publication can resume. Extraction completion alone does not mean publication succeeded.
- Failed OCR and page or character limits produce partial state with unread pages. A targeted local retry can produce a new version; old citations remain readable.
- The existing read tool supports `continue_extraction`. A repeated successful call reuses its saved receipt and budget charge.
- Published research keeps the selected unit path, body hash, version, locator, and exact excerpt. The document resolver checks that immutable unit against its manifest.
- Reference requests accept the frontend origin view. Source links use text revisions, rather than extraction version IDs or an original PDF hash for its text companion.

## Verification scope

All work used an isolated copy and synthetic fixture vaults. Provider and network boundaries were scripted. No live vault or paid provider was used. This verifies storage, routing, and source reading, not model quality or legal accuracy.

The regression suite covers all twelve original review probes plus targeted extraction through the real tool registry. It also checks published source records through the real document resolver. Existing lifecycle tests cover restart and rebuilding SQLite from Markdown.

Browser checks used the isolated 1,000-page PDF fixture. The source file was shown once in the file list. Opening extracted text displayed the saved source after correcting the companion revision. The scripted research run completed and saved page 900 and 901 records. Automated resolution confirmed exact passages.

The full generic acceptance checklist was not repeated. Results and remaining limits are recorded below.

## Check results

- Existing source-library storage, extraction, index, and tool tests: 35 passed.
- Final regression, tool-instruction, and source-tool checks: 27 passed (39.80 seconds).
- Analysis integration checks after correcting the text revision contract: 18 passed (29.26 seconds).
- Final crash recovery and lifecycle checks: 4 passed (18.83 seconds).
- Frontend type check: passed.
- Frontend production build with `--webpack`: passed. The isolated copy used a dependency symlink; the default Turbopack build was not repeated.
- Frontend document-reference behavior checks: passed.
- `git diff --check`: passed.
- `graphify update .`: passed; 14,689 nodes and 28,484 edges.

The existing 1,000-page and storage limits remain. A capped source is now labeled partial; this repair does not remove those limits. Local OCR still needs Tesseract. No old live-vault extraction was rewritten. Existing callers can re-register a retained original using extraction format 2.

Full backend run: **1,437 passed, 2 failed in 561.83 seconds**. The run began before the final revision correction. Its analysis-pointer failure was corrected; all 18 analysis integration tests then passed. The remaining blank-vault parity test requires `PROJECT_ROOT/vault`, which was deliberately omitted from the isolated copy. It also failed in the original review for that reason. No test assertion was weakened. The full suite was not repeated after the focused correction.

Changes were copied back only after matching the original file hashes. No commit, push, deployment, active-vault edit, or paid call was made. Temporary browser servers were stopped.

## Follow-up: portable blank-vault test

The remaining parity test is now fixed. It compares the new vault against the committed synthetic fixture already copied by the test, rather than `PROJECT_ROOT/vault`. All agent and tool contract assertions remain. The isolated test run failed before this change (1 failed, 2 passed) and passes afterward (3 passed). This was a test-environment dependency, not an observed application defect. The full suite was not repeated for this test-only change.
