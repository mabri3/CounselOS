# Comparison recovery repair

## Cause and change

Three saved Harbor 2 comparison runs failed with "Codex CLI provider is closed."
The Codex provider is cached and reused. Cancellation and turn timeout called
its permanent close method. Later requests therefore failed before reaching
the model, including the final answer attempt.

Cancellation and timeout now stop the current server transport without
permanently closing the provider. A later request can start a fresh server.
Explicit application shutdown still closes the provider permanently.
The failed model turn is not automatically replayed.

The Approaches controls also now use the conversation loading, draft readiness,
and upload states. The comparison button cannot appear ready while send would
silently reject the action.

## Verification

- New parameterized regression reproduced the closed-provider failure for both
  cancellation and timeout before the repair. Both cases pass after the repair.
- Provider, conformance, and comparison submission tests: 25 passed.
- Explicitly closed providers still cannot restart; interrupted turns are not
  automatically replayed.
- Full backend suite: 1,494 passed, 6 dependency warnings, in 720.76 seconds.
- Frontend typecheck and production build passed.
- Browser loading test held the conversation response: Compare was disabled
  while loading and enabled after the response arrived. No model call was made.
- Harbor 2 live runs RUN-20260911-7a3eb3 and RUN-20260911-3306dc completed using
  Codex / gpt-5.6-sol / medium. They took 57 and 71 seconds respectively.
- The second live browser run clicked Compare, received HTTP 202, waited for
  completion, and verified that a comparison appeared in chat. The saved reply
  and screenshot are adjacent to this report.
- Neither completed run records a matter mutation. The failed historical
  messages remain in the conversation. New comparisons are appended normally.
- Graphify updated. Diff whitespace check passed.

See provider-recovery-runs.json, live-compare-recovery.log,
live-compare-recovery-answer.md, live-compare-recovery.png,
compare-loading.log, and provider-recovery-build.log.

This verifies connection recovery and comparison delivery. It is not a legal
accuracy evaluation. The historical reader-context and wording experiments are
separate from this repair.
