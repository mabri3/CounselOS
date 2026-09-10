# Matter memory and solution paths — verification

Implemented in the isolated worktree on 2026-09-10. The saved source checkout is unchanged. No commit, push, deployment, real-vault migration or paid model evaluation was performed.

## Result

The matter has one Markdown current-direction pointer. Existing scenario records hold preserved paths and parent revisions. Each conversation has its own working path. Promotion and restoration preserve prior paths and do not restore old actual facts, complete tasks or record formal decisions. Transition receipts support conflict detection and local recovery. Dossier changes use the existing lawyer-edit protection.

Each path can hold a fallible working note. The full model payload is limited to 4,000 Unicode characters. Server-owned provenance, revision checks, immutable history and staged validation protect the last valid note. Malformed optional output preserves useful prose. Excluded sources conservatively withhold unattributed historical notes. Actual facts, questions, recommendations and decisions remain separate typed records.

The shared editable `matter-paths` skill is frozen at submission in both chat views. Narrow path actions, bounded archive reads and pinned saved-source reads use `workspace_action`. Structured context keeps whole records, prioritizes corrections and limits recent history. Complete serialized dispatches have a configurable 256,000-byte ceiling. Old conversation text can be reduced; current instructions, trusted rules, path identity and tool pairs remain. This ceiling is an engineering control, not a token or price claim.

## Checks actually run

| Check | Observed result |
|---|---|
| Full backend suite | 1,480 passed; 7 deprecation warnings; 798.37 seconds |
| Final focused checks after browser repairs | 71 passed; 18.37 seconds; seven final context tests passed |
| Frontend typecheck and production build | Passed, including final browser fixes |
| Single-lawyer, continuity and path presentation checks | Passed; static checks supplement browser evidence |
| Dense single PDF | 1,000 pages; 4,060,224 extracted characters |
| Dense collection | Ten distinct 200-page PDFs; 8,562,380 extracted characters |
| OCR | Real local Tesseract read page 20 beyond initial OCR slice; old version and image retained |
| SQLite rebuild | 65 captured Markdown files unchanged; source reads recovered |
| Browser dispatch capture | 33 dispatches across 11 runs; largest 99,707 bytes; no duplicate saved assistant answers |
| Shared skill | Two later runs captured edited skill; nine earlier runs retained original revision |
| Evaluation | 28 two-turn fixtures; four fixture/scorer tests; dry-run, replay and offline live-command smoke |
| Graph | AST update completed; no paid semantic extraction |
| Diff whitespace | Passed |

Full-suite evidence: [log](../output/matter-memory-paths/full-backend-final.log). Later focused checks cover the final small path-status/context changes: [log](../output/matter-memory-paths/release-focused.log). Frontend: [final build](../output/matter-memory-paths/build-final-after-browser.log). [Browser story](../output/matter-memory-paths/browser.md), [state capture](../output/matter-memory-paths/browser-final-state.json), [source capacity](../output/matter-memory-paths/capacity.json), [recovery](../output/matter-memory-paths/recovery.json), [dispatch sizes](../output/matter-memory-paths/request-sizes.json).

## Failures and fixes

The first full suite had 1,468 passes and six failures. Old correction fixtures lacked the newly required exact instruction quote. The baseline-path and shared-skill assertions also needed to reflect the additive contract. The hypothetical correction denial remained intact. The corrected trust-boundary test exposed a real bug: adding frozen skill data hid missing workspace context on direct runner calls. That bug was fixed and retested. See [first full run](../output/matter-memory-paths/full-backend.log), [focused reproduction](../output/matter-memory-paths/regression-fixes.log), and [trust-boundary pass](../output/matter-memory-paths/trust-boundary-fix.log).

The final audit also reproduced and fixed excluded source text returning through saved selection conditions. Context and tool results now retain only safe path identity under exclusions. Later actual-basis changes produce a new snapshot without overwriting the first path revision snapshot. Saved comparison order remains in context beyond the recent-message window. The normal Skills editor exposes bundled path guidance without installing it on read. [Exclusion failure](../output/matter-memory-paths/excluded-condition-before.log), [pass](../output/matter-memory-paths/excluded-condition-after.log).

Browser checks found and repaired focus loss, nested-panel overlap, ambiguous duplicate labels and nonpersistent dossier status. The final check showed Current approach as the matter direction, Timing as the second conversation focus, and Current approach as the first conversation focus. The dossier's concurrent lawyer edit survived restoration. See the browser report for exact observations and fixture limits.

## Source-library dependency versus new work

The implementation first copied 147 scoped changed/new baseline files from the saved checkout, preserving its source-library and earlier repair work. The manifest records 820 source hashes. Final comparison found no changes in that saved checkout. Playwright and PyMuPDF dependency additions belong to that copied baseline. Memory/path work added no further package dependency. Python 3.12 and local Tesseract were used for checks.

A verified additional source repair sets the extraction subprocess's working directory to the backend package root. Root-launched extraction had failed before this fix. New memory/path work adds ordinary authorized local-source reads, pinned versions and bounded passage admission. It reuses library storage and citations. [Baseline manifest](../output/matter-memory-paths/baseline-manifest.json), [scope diff from copied baseline](../output/matter-memory-paths/scope-diff.json), [source repair tests](../output/matter-memory-paths/step8-library-tests.log).

## Evaluation and limits

**Semantic model behavior is unverified.** Scripted tests prove storage, tool and UI behavior. They do not prove that a model understands indirect selection, ambiguous references or legal application. No independent model reviewer graded this implementation.

The frozen rubric totals 100: intent/reference 25, factual/decision integrity 25, path preservation 20, continuity 15, research/application 10, citations/locators 5. Unavailable answers receive no quality denominator. Dry-run/replay therefore award no quality score. Deductions require expected/observed state or excerpts, evidence, dimension and exact arithmetic. Integrity failures are separate from the average. [Frozen dry-run](../output/matter-memory-paths/eval-release-dry-run/manifest.json), [score breakdown](../output/matter-memory-paths/eval-release-replay/scores.json), [offline command smoke](../output/matter-memory-paths/eval-mock-harness-final/manifest.json).

The live harness prepares actual A/B/C paths, note versions, a pinned synthetic source and comparison history. Environmental interruption/replay events are tested in deterministic lifecycle tests; the live conversation harness does not inject every such event. Qualitative review is manual and remains pending. Native browser upload was not tested; API upload was tested. Browser source navigation used 100 dense pages, while full capacity was verified separately in backend tests.

The current adapters do not expose a hard output-token limit through this interface. The harness prints this limitation before dispatch. Calls and estimated input are bounded, requested output is an instruction allowance, the final call is reserved, and unknown outcomes are not retried. Actual usage and cost are unavailable, not zero. The offline harness made two mock calls and zero paid calls; an earlier superseded mock artifact mislabeled provider calls as paid calls.

After explicit paid authorization, this is a supported command from `backend` for the inspected Codex CLI adapter. It has **not** been run:

```bash
.venv/bin/python scripts/evaluate_matter_paths.py --mode live --provider codex --model gpt-6-astra --effort low --episodes E07,E08 --max-calls 12 --max-estimated-input 180000 --max-requested-output 12000 --output ../output/matter-memory-paths/eval-astra-authorized-01
```

Do not treat requested output allowance as a hard spending cap. No quality, cost or implementer ranking is claimed.
