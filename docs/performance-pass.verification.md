# Chat loading and performance pass

Verified on September 12, 2026 against the active local vault and Harbor 2
(`MAT-20260909-d89ad8`). Frontend and backend were restarted.

## Result

The experimental chat loads saved messages independently of the workspace.
The browser showed four conversations, 200 files, and the saved dossier after
reload. There were no browser console errors during the final check.

The reported 611 MiB file was the SQLite index for the whole vault. It was not
the homepage. Most of its size came from storing both the original and lowercase
copies of large Markdown records. Those records contained repeated execution
inputs, including frozen dossier and research snapshots.

| Measurement | Before | After |
| --- | ---: | ---: |
| SQLite file size | 640,454,656 bytes (610.8 MiB) | 102,182,912 bytes (97.5 MiB) |
| Matter request | 33.15 s | 6.18 s |
| Workspace request | 47.87 s | 8.08 s |
| Conversation list | 3.09 s | 1.34 s |
| Selected saved conversation | Not separately measured | 1.09 s |
| Main files for 130 compacted records | 262.0 MiB | 48.1 MiB |

Request times are direct local HTTP measurements. The final measurement sent
seven requests together while the large backend test suite was running. These
are endpoint times, not total browser rendering times. Development mode also
makes duplicate initial requests.

The index still contains 12 matters, 33 work items, three decisions, 1,766
document rows, and 1,790 searchable files. SQLite integrity checking returned
`ok`.

## Changes

- Chat, workspace, and work-status reads have separate loading and error states.
  A failed history read offers retry and does not show a false empty conversation.
  A failed status read does not hide messages that already loaded.
- Navigation, question projections, document lists, status polling, and restart
  checks read compact records. They avoid loading large frozen execution inputs.
  The small question-revision baseline remains available for question history.
- Large frozen inputs are stored once as immutable, content-addressed Markdown
  under `00_System/.execution-inputs`. Ordinary reads restore the full values;
  display reads can omit them. Existing inline records remain readable.
- Search stores original text once and keeps only matching tokens for its
  lowercase form, using SQLite's documented [contentless FTS5 tables](https://sqlite.org/fts5.html#contentless_tables).
  Existing substring, Unicode, scope, ranking, and snippet checks pass.
- Two-character search terms are built from distinct adjacent character pairs.
  A one-million-character comparison returned identical terms and took 0.052 s
  instead of 0.456 s. The Markdown cache keeps its 64 MiB source-byte limit but
  permits more small files, which reduced repeated parsing in the live matter.

## Data preservation

The compaction script saves exact originals before replacing main records.
It checks that the complete restored metadata and Markdown body match the
original record. All 130 changed records passed that comparison.

A separate hash check accounted for all 1,988 original source files. It found
no missing files, no unexpected changes, and no original-backup errors.

The execution-input Markdown files are part of the vault source, not disposable
cache. Keep that directory with vault copies and backups. Exact originals are
retained under `00_System/.execution-inputs/originals`; this pass reduces the
search database and frequently read files, but keeps those backups on disk.

`backend/scripts/compact_execution_inputs.py` reports proposed changes by default.
Its `--apply` mode performs the verified conversion. It can be run again safely.
No saved source documents were deleted, and no paid model runs were started.

## Verification and limits

- Full backend run: 1,736 passed and four failed in 17 minutes 23 seconds.
  Two test read-spies needed to forward the new read option; one assertion needed
  the new cache schema version. Those three now pass.
- One research timing test still fails its 0.3-second whole-operation limit:
  `test_external_provider_hang_uses_one_total_budget_and_saves_partial_packet`.
  It also fails with the prior vault and index implementations substituted in
  the test process. The test was not weakened. The cancellation occurs during
  later dossier work or index rebuilding, after the simulated provider timeout.
- Final focused workspace, history, execution-input, path, and research-scope
  checks: 81 passed. Source-index and discovery checks: 10 passed. Search checks:
  28 passed. Earlier surrounding history and document checks also passed, apart
  from the read-spies subsequently corrected.
- Frontend typecheck and production build passed. The executable chat-loading
  regression verifies independent history loading, separate status failures,
  and ignored late reads after leaving a matter. Existing initial-load checks
  also passed.
- Browser checks covered the reported Harbor chat, saved messages, file menu,
  and opening the saved dossier. The full historical acceptance checklist was
  not repeated, and no research was resumed as a browser test.
- `graphify update .` completed. Existing non-code files that yield no graph
  nodes remain reported by Graphify.

Detailed measurements, preservation manifests, and test logs are in
`output/performance-pass/`. The cache is still rebuilt from Markdown at startup
and at existing mutation boundaries. This pass does not introduce an incremental
index or claim unlimited scale.
