# Hypothetical path repair — September 10, 2026

## Failure and repair

Harbor 2 run `RUN-20260910-ab563a` received “Consider an alternative where the bank holds the funds. Keep this hypothetical.” It selected scenario scope and returned prose, but did not save an alternative. Its frozen shared matter-path guidance was enabled. Its frozen experimental dialogue instructions still said to keep scenario exploration read-only. This was a concrete instruction conflict, not a missing model capability or a failed database write.

The bundled experimental dialogue now delegates path behavior to the shared skill. The shared skill explicitly preserves a concrete requested alternative in the same turn, gives the mutation argument structure, and distinguishes keeping assumptions hypothetical from refusing to save them. General conceptual questions, quoted examples, and explicit no-save requests remain distinct. No phrase classifier or additional model stage was added.

The experimental path panel now follows the existing workspace refresh counter, so completed chat actions can refresh the displayed paths. An unchanged mainline focus does not reset the document target during refresh. The panel explains how to enable comparison. The user guide states that Compare selected paths prepares a message and Send runs it.

## Live verification

Used the normal application at localhost:3000/8000 and the user's existing Harbor 2 experimental conversation with GPT-5.6-Sol, medium. These were real model runs, not scripted fixtures.

- Repeated the exact original message in the browser. Run `RUN-20260910-87d760` completed with successful inspect_paths and explore_path actions. It saved **Bank-held funds structure**, with the bank custody assumption and four unresolved conditions. The current direction stayed **Current approach**.
- The solution-path panel displayed both entries. Selected the original approach first and the bank alternative second. Compare selected paths populated the message with those two stable IDs in that order.
- Sent that comparison. Run `RUN-20260910-b4bb9a` completed with compare_paths and a two-path answer in chat. No direction transition occurred.
- Reloaded the page. Both saved answers and both paths remained available. Conversation focus remained on the bank alternative; current direction remained the original approach.
- Compared SHA-256 hashes before and after both runs. All nine checked files (eight top-level matter records and the mainline state file) remained byte-identical, including facts, dossier, recommendations and matter state. The test added conversation history and the requested hypothetical path.

Compact run evidence: live-run-comparison.json, live-comparison.json. Record hashes: before.json and record-integrity.json. Full run receipts remain in the matter's conversation/runs directory.

## Checks and limits

The focused backend tests passed: 20 tests across shared skill freezing, path lifecycle and experimental chat. The frontend typecheck, production build and existing path-presentation check passed. The full backend suite passed: 1,487 tests, six warnings, in 681.49 seconds. Final output is in backend-tests.log. Graphify was updated without a model call.

This verifies the reported live request and a subsequent comparison. It does not establish that every model and every paraphrase will choose tools reliably. No new memory-generation or broad legal-quality evaluation was run. The full historical browser acceptance suite was not repeated; the browser walk focused on exploration, comparison and reload.
