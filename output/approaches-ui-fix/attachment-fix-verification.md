# Attachment hypothetical repair

- Numeric source page/section references resolve only against the exact stored source version before working-note validation. Unknown or ambiguous units still fail with a useful correction message.
- Shared guidance distinguishes changed hypothetical assumptions from an existing approach with the same topic.
- Scope selection now supports an explicit new/existing/none path intent. New saves and binds the variant in one call. Legacy scope-only callers remain supported.
- Last comparison is reference context, not an instruction to repeat comparison formatting.
- First replays saved notes on the existing bank path. Those diagnostic notes are preserved under that path's memory/diagnostics directory, excluded from active note reads and fallback.
- Final focused check: 33 tests passed for lifecycle, interactions and memory; 4 skill tests passed. Earlier comparison/source-reference checks also passed.
- Frontend code unchanged in this repair; earlier passing typecheck/build retained.
- Live validation in progress: see attachment-replay-fresh.log and attachment-replay-result.json. Do not treat the earlier unsuccessful live runs as passing branch-creation tests.

## Final live result
RUN-20260911-82db42, new conversation CONV-20260911-20d4ea, replayed the original attachment request with Sol Medium. Saved Bank-held funds timing test (SCN-0f23edfc89ec6ecaf60a13e4) and a working note. The mainline pointer was identical before/after. Browser verified the path, note and original source passage. Earlier failed replay notes remain in memory/diagnostics, not active memory or recovery history.

The live run reached the old 180-second limit after saving and returned a useful answer with an inaccurate unconfirmed-note statement. The configured default is now 300 seconds, and timeout synthesis receives an explicit list of successful tool receipts. These final timeout changes were checked by the chat-run test suite, not another paid model run. The saved note has no claim-level source references; its originating message is recorded, and the source is separately readable. Numeric reference repair was tested with a real ingested source.

55 chat-run tests passed. Frontend typecheck/build passed. Browser log: attachment-browser-final.log. This is a workflow repair, not a legal-quality evaluation.
