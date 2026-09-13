# Step 8 — Readable references, provenance, binding before cleanup

Date/time: 2026-09-11
Result: done

## Files added
- backend/app/services/dossier_references.py — `build_catalog` (scoped: only reference-bearing IDs actually present in the output AND belonging to this matter; facts/assumptions/questions/issues/decisions/research), `bind_references` (bare known IDs → `[source:ID]` markers before cleanup; known artifact/decision paths → named Markdown links; unknown reference-shaped IDs → "Reference unavailable: ID"; matter-scoped so traversal/cross-matter paths are never linked), `catalog_source_records`.
- backend/tests/test_dossier_references.py — 6 cases.

## Files changed (this execution)
- backend/app/agents/output.py — `clean_user_facing_reply` gains optional `references` catalog; binds known IDs to markers before humanizing (survives instead of "the internal record"); default behavior unchanged when no catalog.
- backend/app/services/dossier_request_execution.py — publisher persists combined source records onto the dossier revision + current dossier (`_combined_source_records`) so ClaimMarkdown can render each reference's exact record.

## Verify (all EXIT 0)
- backend: `.venv/bin/python -m pytest -q tests/test_dossier_references.py tests/test_output_citations.py` → 16 passed; combined with batch publication → 21 passed.
- frontend: `npm run typecheck` → passed; `npm run check:document-reference-behavior` → passed; `node --experimental-strip-types scripts/check-citation-reading.ts` → passed.

## Cases covered
two facts in one sentence bind to distinct records with distinct labels and survive the real cleaner; unknown references stay honest and are not collapsed into one label; cross-matter id is not bound; only referenced records are catalogued (no inflated counts); malicious/traversal/other-matter paths are never turned into links; default cleaner behavior unchanged without a catalog.

## Notes / limits
- Frontend source-record rendering (ClaimMarkdown / ExperimentalDocument reading metadata.source_records) is largely pre-existing; the backend now persists source_records with the dossier output so those readers have data. Full per-surface UI wiring is finished in Step 10, and proven in the browser in Step 12.
