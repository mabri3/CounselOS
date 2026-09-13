# Research recovery — September 12, 2026

## Failure evidence

The selected issue was `ISS-c9d7c39f63-65ae94508dcda1bf` in request
`DOR-20260912-049f9c`. Its child was `RUN-60e4453f6e5c26b3`.
The live records were read only. No paid recovery was started on that matter.

Recorded facts:

- Three main-model calls, no search batches, one external collection request,
  and no source fetches were recorded.
- Two saved-source-library searches preceded the unfinished model call. Their
  saved result reported about 577.4 active seconds remaining.
- The next model call had an unknown outcome and no saved error class.
- The run had `resumed_from_restart: true`.
- Its external collection request recorded `TimeoutError`.
- The final answer-only call also recorded `TimeoutError`, with no answer saved.
- The final budget was 600.119 active seconds against a 600-second limit.
- The analysis failure originated in the provider adapter's collection/iteration
  budget guard, not a large completed batch of web searches.

The code path explains the failed continuation. Restart recovery charges the
maximum reserved duration of an unfinished operation because its exact duration
is unknown. The old resume path kept that charge but supplied no new allowance.
Collection recovery could then start with only about one second before the
90-second final-answer reserve. That collection and the final answer timed out.
This reconstruction matches the saved trace. The record does not establish why
the original model call was interrupted or whether its provider finished remotely.

## Change

- Unfinished rows show a reason and a **Resume research** control, including old
  parents incorrectly marked complete and issues with siblings still running.
- A continuation receives a recorded, bounded allowance. Earlier usage, completed
  calls, source snapshots, and previous outputs remain available.
- Temporary failures can trigger at most two automatic continuations, with short
  delays. Wrapped transport errors are recognized without saving private errors.
- Unknown call outcomes require explicit retry consent. Changed or missing source
  snapshots and Stop are not automatically bypassed.
- No collection starts inside the final-answer reserve. Failed searches may retry
  their exact approved query; successful searches are not repeated.
- Recovery output still requires publication after a restart. Completed siblings
  and shared writer calls are not silently repeated.
- All visible copies of one request's card receive action updates.

## Verification

- The exhausted-run regression failed before the change and passed after it.
- Focused tests cover time charged on restart, preserved counters, completed
  siblings, bounded automatic recovery, wrapped failures, manual recovery after
  the limit, Stop during the retry delay, same-query search recovery, publication
  after restart, and joining an active parent without duplicate workers.
- The ordered API/security/native-search/recovery check passed: 62 tests.
- Frontend typecheck, dossier helper checks, and the production build passed.
- Isolated browser test: a synthetic issue exhausted both automatic attempts;
  its row showed Unfinished, a reason, and Resume research. Resume saved an answer
  and a new dossier revision. A separate issue finished after one automatic
  continuation. Its saved checkpoint confirms that continuation. Completed
  siblings stayed complete and the unselected issue stayed unselected.
- Unsent chat text survived recovery and page reload. Older card copies updated
  together after the shared-status change. The saved answer opened successfully.
  The test browser reported no console errors. The test servers were stopped and
  their owned temporary data and build were moved to Trash.
- The live frontend returned HTTP 200 and the backend health endpoint returned OK.
- The code graph was updated with `graphify update .`.
- Final full backend suite: **1,733 passed**, with six dependency deprecation
  warnings, in 14 minutes 27 seconds. No failures.

The first broad run caught a test-fixture cleanup error: a web-search test left
fake network functions installed for later tests. Its helper now uses pytest's
scoped patch cleanup. The security and native-search tests pass after that test
in the same process. No security assertion was relaxed.
