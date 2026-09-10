# Main-agent research verification

Verification date: September 9–10, 2026. This is an implementation report.
Overall acceptance is **not yet complete**. The live-model evaluation failed.
The backend suite and focused final checks passed. Local checks and cleanup are complete.

## Implemented behavior

The existing main runner owns research direction, local reads, public evidence
requests, follow-up and the answer. New research runs save separate main and
collector selections. The collector receives public queries and returns evidence
locations and attributed notes. Only the main run can publish advice.

Ordinary main chat uses the same behavior and call journal. Simple drafting
requires no research job. The synchronous API retains its existing error codes
and typed-action retries. Investigation-only tools require a server-owned run
object, matching matter, saved scope and active checkpoint.

The reader supports exact public URLs, linked PDFs, text extraction and bounded
OCR. It retains original bytes, saved text, page numbers, extraction methods and
warnings. Selected passages carry hashes and offsets. Local text reads also save
hashed copies. Preview text and local reads count against the evidence limit.
The reader does not present a PDF byte stream as UTF-8 webpage evidence.

Publication starts from a saved packet. Separate receipts cover recommendation,
dossier revision and the original conversation. Changed facts or questions keep
advice historical. Intervening advice is review-only. Lawyer edits survive.
Generated assumptions can be retired by saved ID and provenance. The operation
cannot turn generated legal analysis into reported business facts or decisions.

## Recovery and bounds

The existing Markdown run stores versioned checkpoints, full main messages,
call reservations, results, sources, passages and publication receipts. Completed
calls replay from saved results. A process interruption marks unfinished calls
`outcome_unknown`; explicit retry may incur another charge. There is no
exactly-once billing claim. Consumed budgets cannot decrease. An unfinished timed
operation conservatively consumes its saved maximum time on recovery.

Default limits: three collection batches, four propositions per batch, sixteen
source URLs, twelve main turns plus a final attempt, 600 active seconds, and
48,000 evidence characters. Each document has a 5 MB byte limit, 30-page limit,
six-page OCR limit, 45-second extraction limit and eight-second OCR-call limit.
PDF/OCR dependencies are PyMuPDF and a local `tesseract` executable. No dependency
was installed during this work. Completed extraction pages are saved for replay.

## Observed checks

Logs are under `output/main-agent-research-dossier/`.

| Check | Observed result |
|---|---|
| Initial focused baseline | 46 passed |
| Main/publication/checkpoint/chat group | 72 passed |
| First full backend attempt | 1,306 passed; 17 failed; failures diagnosed and repaired |
| Second full backend attempt | 1,323 passed; four mock-status failures; repaired |
| Affected API/dossier/research group | 179 passed; one research-section failure; repaired |
| Later focused research/chat group | 62 passed |
| Synchronous journal, API and typed-action regression | 64 passed |
| Named source-link cleanup and HTTP lifecycle | 12 passed |
| Real text/scanned/mixed PDF extraction | Passed |
| Real six-page OCR limit and extraction replay | Passed after compressing the synthetic fixture; the 5 MB limit was not raised |
| Frontend typecheck and production build | Passed, including the later read-only document fix |
| Frontend chat-run-recovery and research-queue checks | Passed |
| Protected file hashes | All 2,129 matched the preflight snapshot at the latest check |
| Full backend run | **1,334 passed**, six dependency warnings, 516.94s; see full-backend-final-verified.txt |
| Final source/publication/scope/main group | 35 passed, 60.61s |
| Same advice from a new run and recommendation regressions | 25 passed, 17.59s |
| Full local text, late exception and recovery | 18 passed, 18.24s |
| Reader/lifecycle/native group | 22 passed, 22.66s; includes mixed-PDF timeout and real OCR resume |
| Hostile/no-result/malformed/timeout main group | 15 passed, 9.88s |
| Fallback and publication restart group | 17 passed, 19.71s |
| Graph update | Completed: 213,715 nodes, 469,425 edges, 13,917 communities; see graphify-complete-update.txt |

The full suite finished before three final browser/review fixes: local-source publication, same-text publication identity, and full local-text capture. The affected groups above passed after those fixes. This report does not claim a second full-suite run after them.

One earlier full run had 1,330 passes and one 0.4-second index-wait timeout under heavy concurrent graph load. That test passed unchanged after the load ended and in the later full suite. Its deadline was not relaxed.

The graph JSON and report were updated. Graphify skipped HTML output because
both the full graph and its grouped view exceed the 5,000-node display limit.
It also reported 2,239 files with no extracted code nodes. No paid semantic
labeling was run. `git diff --check` passed.

The tests use temporary vaults. There is no real-vault migration. No commit or
push was made. Pre-existing edits were preserved. The test browser and servers
were closed. The user’s port-3000 frontend was left running. The two generated
Next config files, proven clean at preflight, were restored. Typecheck passed
after restoration. Final protected-file comparison: all 2,129 unchanged.

## Browser observations

The helper `backend/tests/manual/serve_research_investigation.py` served the real
API on port 8127 and the real frontend on port 3127. Only model and public-network
boundaries were scripted. The fixture vault is recorded in browser-backend logs.

Observed in experimental chat:

- Created a synthetic acquisition matter through the application.
- Source choices displayed saved main and collection roles and follow-up scope.
- One confirmation started the public investigation.
- The run completed and inserted an answer without another user message.
- Reload and backend restart retained the answer and run identity.
- The saved PDF link opened literal page 1 text in the source pane.
- The internal-only vendor case returned a conditional 30/60-day comparison.
- The internal-only status explicitly said external search was not selected.
- The dossier revision link opened the latest proposed answer before the earlier
  position, with an explicit “not yet accepted” label.
- Read-only records displayed without edit controls after the browser-found fix.

Screenshots were captured in the task. The browser walk found two real issues:
output cleanup destroyed file links; optional comment loading hid read-only text.
Both were fixed. The internal fixture was also strengthened to require real
contract tool reads before its scripted answer. That stronger sequence passed. When older transcripts filled the first ten search results, the scripted main made a second search limited to the documents folder. It read both contracts, saved two hashed copies, and displayed their links in the dossier. The 60-day contract link opened its literal saved text as read-only. Reload and switching to the public matter and back retained the answer and source.

The browser also exposed missing local sources in packet publication and reuse of old source information when a new run produced the same advice text. Both were fixed and covered by focused tests. A request-timeout notice appeared under test load while the saved research still completed; reload cleared the notice.

Final fixture record checks are in browser-verified-records.json: public run RUN-20260910-250009 and internal run RUN-20260910-d09de5 are completed, with exactly one completion message each.

This is not an exhaustive walk of every historical item in ACCEPTANCE_TESTS.md.
The relevant chat, research, source, dossier and persistence paths were exercised.
Deterministic hostile-output checks cover no results, malformed collector text, provider timeout and an instruction-bearing page. They prove saved partial answers and narrow tool access; they do not prove live-model resistance to malicious text. Recovery checks cover completed versus unknown transport calls, paid-fallback replay, source corruption, monotonic budgets, local text retention, PDF/OCR continuation and restart after the conversation write before its receipt. A crash at every individual file-write boundary was not exhaustively injected.

## Live-model result: failed

The configured environment supplied `openai_compatible / deepseek-v4-flash` for
main analysis. The isolated fixture's collector agent was `mock`; public requests
used the configured search services. No private matter records were sent.

The first two evaluations used one main call each. They finished in 5.96 and 3.32
seconds but returned plans to investigate instead of answers. Those are failed
model-quality results, regardless of the then-completed run status. The shared
loop now makes one bounded continuation for a short unfinished plan and prevents
an unresolved plan from becoming advice.

A second evaluation used three main calls and one batch of three propositions
for the acquisition case. It took 186.99 seconds and retrieved no source pages.
Later main calls failed and only partial output remained. The internal case used
two main calls and ended incomplete in 1.26 seconds. A separate one-call,
tool-free adapter diagnostic reached its 20-second timeout. That call's outcome
is unknown; it was not automatically repeated.

These observations do **not** establish live evidence quality, good legal
judgment, successful collection, or successful live synthesis. They establish
that configured live access did not satisfy acceptance in these evaluations.
Do not use the scripted results as a substitute for that missing evidence.

## Live retry after Wi-Fi restored — September 10, 2026

The user reported being off Wi-Fi and explicitly requested another live test.
The retry used a new isolated synthetic vault. Previous results and run budgets
were retained. No application code or provider settings changed.

DeepSeek model access worked. Both runs saved a packet, recommendation proposal,
dossier revision and exactly one completion message in their original conversation.

| Case | Result | Wall time | Calls and evidence |
|---|---|---|---|
| Public acquisition | Useful partial answer; **evidence acceptance failed** | 467.00s | 10 main calls, 3 batches, 5 requests, 1 attempted fetch, zero saved public sources |
| Internal termination | Compared both actual supplied contracts; conditional 30/60-day answer | 14.33s | 3 main calls, zero collection batches, zero fetches, two local contract snapshots |

The public case had Polaris timeouts and a malformed structured response. The
main agent also made invalid follow-up requests and attempted a direct fetch.
It eventually delivered a substantial answer and clearly stated that no external
authority was retrieved. Its broad legal assertions remain unverified. It also
mixed the synthetic acquisition with the fixture's older Beacon onboarding issue;
a fresh acquisition matter is needed for a clean live quality evaluation.

The internal main attempted an external collection call despite the internal-only
instruction. The application blocked it before any network request. The final
answer correctly identified the two notice periods and the unknown signature
status. This passes the basic comparison and scope-enforcement check, but the
unnecessary tool attempt is still a model-behavior issue.

Both cases logged `Research citation formatting failed: KeyError`. Useful prose
and publication survived. This is an unresolved implementation failure, not a
connectivity failure. The public result also discussed record updates as future
work even though publication then occurred; that wording needs improvement.

Overall acceptance remains incomplete. Next: diagnose the citation-formatting
error and Polaris response/timeout handling, then rerun the public case in a fresh
synthetic matter. Do not treat `state: completed` as proof of evidence quality.

Evidence: `live-wifi-retry.txt`, `live-wifi-retry-results.json`, and
`live-wifi-retry-checks.json` under `output/main-agent-research-dossier/`.
The final comparison still found all 2,129 protected files unchanged.

## DeepSeek through OpenCode comparison — September 10, 2026

At the user's request, the main remained `openai_compatible / deepseek-v4-flash`.
Collection changed to `opencode_go / deepseek-v4-flash` with native web search.
Polaris was excluded from this test's scope. The same public question and fixture
setup were reused in a new isolated vault. Workspace defaults were not changed.
The reproducible wrapper is `output/main-agent-research-dossier/run-opencode-comparison.py`.

| Measure | Polaris retry | OpenCode DeepSeek |
|---|---:|---:|
| Wall time | 467.00s | 278.52s |
| Public pages saved | 0 | 13 |
| Literal passage reads | 0 | 5 |
| Main calls | 10 | 12 |
| Collection batches / requests | 3 / 5 | 2 / 4 |
| Completion messages | 1 | 1 |

The OpenCode path successfully collected evidence. The main read passages from
Goodwin, Cornell LII and CFPB pages, made a focused follow-up, and published its
answer and recommendation proposal. It distinguished some unread leads from
passages it had read. This supports changing collection routing; it does not show
that a different main model was needed or that every legal conclusion is correct.

Important limits remain:

- The 13 saved pages include search results, navigation and sign-in pages. This
  count is not a count of 13 authoritative or relevant sources. URL extraction
  from collector events admits this noise.
- The citation formatter still logged `KeyError`.
- The model's synthesis used invalid assumption-update and proposition-assessment
  shapes. Those entries were ignored and reconciliation remained partial. Its
  output also listed the rejected assumption as relied on while saying it should
  not be relied on. Full coherent-dossier acceptance therefore still fails.
- The answer contains tension between permitting close before migration and its
  blanket delayed-close recommendation. This is a model-quality finding from the
  output, not a verified legal conclusion. The reused Beacon fixture remains a
  limitation of this comparison.

Run: `RUN-20260910-58c98e`. Evidence: `live-opencode-comparison.txt`,
`live-opencode-results.json`, and `live-opencode-checks.json` in the output folder.
Both the source reads and exactly one completion message were checked in the
saved records. All 2,129 protected files remained unchanged. No application code,
account settings or workspace defaults changed during this comparison.

Next: fix source-label formatting and synthesis reconciliation, improve source
selection, then verify the complete public flow using the working OpenCode route
in a fresh synthetic acquisition matter. Overall acceptance remains incomplete.

## Remaining work before acceptance

1. Fix citation formatting and invalid synthesis reconciliation. OpenCode DeepSeek
   collection now works; Polaris remains unresolved. Preserve saved call outcomes
   and budgets.
2. Run the two live cases successfully before marking overall acceptance complete.
   Live proposition selection, evidence quality and synthesis remain unverified.
3. The full historical ACCEPTANCE_TESTS.md browser list and every possible
   publication file-write crash boundary were not repeated in this task. The
   scoped paths and actual interruption points above are the verified coverage.

## Simple explanation

The main agent decides what to read. A cheaper worker finds public pages.
The application keeps the pages and remembers completed work. It puts the answer
back in the same conversation. The local tests show this path can work. The live
model tests have not yet shown that it works well with the configured providers.
