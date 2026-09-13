# Business-question-led dossier — September 12, 2026

## Result

The build now anchors dossier preparation and writing to the controlling business
question. Relevant discussion supports or challenges that answer. A recent side
question does not silently replace the matter's scope.

The old last-eight-user-message limit is gone from this writer. All eligible
matter conversations are captured with dates, speakers, order, and hypothetical
scope. The writer can search those captured records and read full passages beyond
the opening excerpts. The previous dossier is available as fallible prior work,
not a 6,000-character seed for the next answer.

This is a general context and writing change. No production instruction contains
the fictional test clauses, named matter, date calculation, or legal-area rule.
No new agent, queue, embedding store, verifier, or automatic approval was added.
The existing five-minute limit and background chat workflow remain in use.

## Configured-model checks

Six saved-only generations used Codex GPT-5.6-Sol at medium effort. They ran in
temporary vaults with two unrelated fictional contracts. No live matter was
regenerated for these checks. The fixtures deliberately included:

- A material issue in an older, different conversation, absent from the issue list.
- An earlier wrong understanding, followed by an explicit correction.
- A later hypothetical waiver that was expressly not adopted.
- Ten formatting follow-ups and a latest question unrelated to the business decision.
- An operative clause after more than 9,000 characters of background text.
- Incorrect earlier saved analysis and an unsigned alternative.

The first four generations repeated both matters without changing their inputs.
All four kept the business question, found the missing issue, used the corrected
period, and kept the waiver hypothetical. The two supplier runs reported a
recovered read warning. They still read the operative clause and delivered useful
answers. Error receipts were added so future failed reads can be diagnosed.

One campaign repeat suggested that an anonymized alternative could proceed in
paid social without clearly resolving the remaining channel restriction. A
general instruction now requires the writer to explain which conditions an
alternative removes, which remain, and which have uncertain application. It must
not treat a change in format or asset as automatic exemption from a restriction.

The final two generations completed without warnings:

| Test | Time | Observed answer |
| --- | --- | --- |
| Supplier renewal and exit | 175.2 seconds | Distinguished operational cutover from termination and renewal. Applied the notice-receipt deadline. Found the seven-day deletion-certificate duty outside the issue list. Read the signed rider beyond the initial excerpt. Kept restoration, deletion, and certification separate. Flagged that the saved export right did not expressly guarantee pre-termination access. |
| Customer story campaign | 141.8 seconds | Separated website and paid-ad rights, customer and employee permission, and redaction from final approval. Found the withdrawal issue outside the issue list. Used 24 hours for website removal and 48 hours for separately authorized paid placements, not the earlier 72-hour report. Kept the unsigned waiver hypothetical. Stated unresolved application of the rider to anonymized content. |

Both final drafts gave practical work outputs, dependent activities, and
fallbacks. They distinguished recorded assignments from proposed owners and dates.
Facts, issues, recommendations, and the selected direction remained byte-for-byte
unchanged in all six runs. The controlling question also stayed unchanged.

Final output files:

- [Supplier dossier](/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/dossier-quality-lgvt5cts/vault/03_Matters/synthetic-supplier-renewal-and-exit-98a9c2/dossier-revisions/DOS-c40e6299916829faf31f.md)
- [Campaign dossier](/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/dossier-quality-lgvt5cts/vault/03_Matters/synthetic-customer-story-campaign-9b3ffd/dossier-revisions/DOS-ce6742e16fde64a76701.md)

## Browser checks

An isolated real-API fixture used a held, scripted writer. This tests application
behavior, not model reasoning or legal quality.

1. Saved-only generation showed Working and left the composer available.
2. A separate question completed while the writer was still held.
3. Releasing the writer saved a dossier and showed Ready.
4. A captured fact opened the exact saved record and version.
5. The saved revision opened in the read-only document panel.
6. A newer unsent message survived completion and page reload.
7. Ordinary Generate Dossier still offered three editable priorities, a top-three
   research choice, and an explicit Start action. No research started by itself.
8. The browser reported no console errors after the test server connection was set.

The test tab and test servers were closed. Normal frontend and backend health
checks returned HTTP 200. The normal vault's facts, issues, recommendations, and
selected-direction hashes matched the pre-test values. Only its shared dossier
writing instructions were updated by this change.

## Engineering checks

The old-conversation omission and missing original request were reproduced before
the fix. New checks cover exact frozen passages, paging, exclusions, other-matter
isolation, same-time message order, hypothetical scope, proposal versus accepted
advice, source edits, denied mutations, timeout fallback, and partial-output
retention. The final focused context run passed 41 tests.

The broad run exposed a hidden retention marker being read as an empty business
question. That could invalidate a saved problem-breakdown reference. The parser
now excludes hidden comments from visible section text. The failure and recovery
checks pass. Mock-mode writing was also updated to use the new captured-input
format and preserve its saved research summary and link.

Tests that required a no-tools writer were updated to require exactly
`read_dossier_record`. This is an intentional contract change, not removal of the
no-mutation check. Attempts to call a write tool are still rejected and tested.

The four full-suite groups collected 1,716 tests: 413, 487, 428, and 388. They
reported 1,715 passes and one failure. The failed group had loaded mock-mode code
before the saved research-link fix. That exact case passed after the fix, including
its original source-link assertions. The affected recovery run passed 85 tests;
two additional 0.3/0.4-second timing tests failed under concurrent test load. Both
passed unchanged in a separate three-test run with the research-link case.

The final proposal-access test was added after full-suite collection. It passed
in the later 41-test context run. Current collection is 1,717 tests. The adjacent
XML reports preserve the failures as well as the passing reruns. These are
full-suite groups plus focused reruns, not one monolithic full run after every edit.

Frontend type checking, the production build, citation-reading checks, and
Markdown disclosure checks passed. The build used a separate output directory.
Only the generated test-directory entries were removed from the development
configuration; the post-cleanup type check passed. The application/docs whitespace
check passed. The code graph update completed.

## Limits and assessment

The final outputs are useful attorney working drafts on these tested criteria.
This is a review of two fictional contract matters, not an independent attorney
study or proof that every future dossier deserves an A. The earlier output-only
A grade did not prove complete conversation coverage; these tests specifically
address that missing evidence.

The writer has access to all captured eligible history, but remains selective.
Availability is not proof of reading. Search and writing are bounded. This change
does not establish exhaustive recall in a very large matter or add extraction of
unsupported binary documents. Source exclusions still apply. It does not perform
fresh legal research when saved-only writing is selected.

The model can still leave wording that needs counsel's judgment. In the campaign
draft, the lead recommendation could state the fallback's channel limits more
directly. The later work plan requires permission for every included asset and
channel. No recommendation was automatically adopted.

The implementation uses the same writer with one restricted record reader. The
last small addition made unaccepted recommendation proposals explicitly readable;
it was verified in the focused tests after the configured-model checks.

## Repeat

```bash
cd backend
.venv/bin/python -m tests.manual.check_dossier_quality --provider codex --model gpt-5.6-sol --effort medium --history --repeat 2
```

This makes paid model calls in a new temporary vault. Read the printed output
files. The helper checks record integrity; it does not assign a quality grade.
