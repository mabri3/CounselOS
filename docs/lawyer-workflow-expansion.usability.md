# Lawyer workflow expansion — usability evidence

Status: Complete. This is agent-led usability inspection, not measured human productivity. All four workflow areas were inspected together in the actual copied-vault application. Material repairs passed independent review and final browser checks.

## Method

The coordinator performed the connected Harbor Relay story through real browser controls and an available configured model. Terra High performed bounded usability inspection and presentation repairs. Independent Astra Low received task goals without click-by-click directions: find the matter, identify who acts next, inspect a business reply, read a handoff and compare supplied versions. Source review and deterministic tests were kept separate from observed browser behavior.

Evidence is under `output/lawyer-workflow-expansion-acceptance/`. Preserve failed attempts. A capture that still says Refreshing is a loading observation. A screenshot without errors does not establish that a mutation completed.

## Findings, repairs and evidence

| Observed issue | Repair | Before and after evidence |
| --- | --- | --- |
| Today showed 12 orientation cards under a three-item heading | Preserve the exact ranked briefing sequence; show at most three action cards and a quiet link for other matters | journey-today-settled; j-usability-today-settled-390; runtime Today checks |
| Local demo explanation overlapped the narrow header | Compact labelled View as selector with an optional explanation | j-usability-evidence/j-usability-harbor-390; after-repair-390; native zoom captures |
| A long primary action made a 390-pixel screen 570 pixels wide | Wrap action labels inside the orientation card | Failed narrow capture retained; subsequent 390-pixel journeys have equal viewport/page widths |
| Request wording completed during a person switch but did not return to the form | Save completed wording to the originating context; keep later edits and show Ready | journey-wording-run failure; subsequent same-run recovery and handoff-brief switch evidence |
| An unrelated intake recovery replaced useful advice with a status message | Constrain recovery purpose; exclude communication publication; recover earlier useful answer with honest source | Independent review, B/I tests and live restored answer |
| Incoming handoff scope defaulted to whole matter before the packet loaded | Resolve the deep-linked packet scope once; preserve later manual choices | Incoming handoff browser evidence and production callback checks |
| Accepted ownership was saved but the form showed the old owner | Refresh canonical detail separately and invalidate older scope reads | Whole-matter return accepted through UI; harbor-all-handoffs-returned |
| Completed reassessment said Queued; reported fact field had no linked label | Show state-aware completion and a stable label/field association | FactRequestPanel checks and independent review |
| Execution preface dominated a long saved answer | Show explicit Current answer content first and retain all earlier text visibly under a neutral label | Independent review rejected hidden-prefix variant; corrected production helper and live answer inspected |
| Saved comparison sat below the new form and displayed raw Markdown | Put saved history first, close creation details when comparisons exist, and render contained Markdown | reviewer-usability-impact-* before; current comparison captures after |
| Useful prose with no structured findings had no draft-update action | Give each explicitly frozen draft one update action independent of optional findings | Independent P1 source finding; live CMP-f5de3e24ed40f4ae1479e17a produced a tracked proposal |
| A 15-second timeout claimed the service was unreachable after a durable save | Say the request timed out and the save may have completed; retain the exact retry | Whole-matter return failure and exact recovery; production timeout check |
| Explicit draft request routed to intake agent and produced text without an artifact | Route structured draft intent to the capable existing agent; recover completed new-draft output without a second run | RUN-20260905-52fc2c failure; journey-recover-saved-draft and partial-projection recovery tests |
| Old dirty editor text hid the saved proposal, and saves omitted version checks | Guard text/review versions; preserve local input; offer confirmed reload and scoped discard | Live stale save 409 retains input; confirmed reload opens proposal; runtime recovery checks pass |
| Review action completion could discard text typed during the request | Preserve newer local text during delayed review completion | Independent P2 source finding repaired and accepted; delayed callback checks pass; not attributed to the earlier raw-save capture |
| Selected View as lawyer could not approve with blank older global name setting | Freeze selected actor for lifecycle actions and retain trusted stable attribution | Failed approval made no request; repaired approval and delivery POST200; closed return verified |
| Closed header conflicted with historical waiting-on-business action | Give canonical Closed state precedence while keeping all historical answer/reply text | J final Understand capture; closed-first service and no-write tests pass |
| Main orientation waited behind unused panel catalogs | Load optional catalogs when their panel opens and apply each read promptly; late save/run refresh uses the current panel | J15000ms orientation abort; delayed production callback tests and independent review pass |
| Restoring an old completed intake run repeated the whole first-page load | Use one restoration sequence; skip full refresh for exact already-saved non-pending terminal replies; keep pending/new completion recovery | J15-second aborts persisted after catalog fixes; exact Harbor run/message match and thirteen production callback cases pass |
| Return visits treated an already reconciled failed-run retry key as active work | Keep the retry key and an optional context-scoped terminal-attempt hint; clear it on Retry and running state | Fresh reads passed but return aborted; callback remount/new-attempt/storage-failure cases and independent review pass |
| Cold reads parsed internal review snapshots and rebuilt the same comparison catalog repeatedly | Exclude reserved history from default discovery; share catalog only within one comparison-list request | Two failed J reads retained; focused service/HTTP checks and independent review pass; completion-based final browser recheck passed |

The first combined engineering review also repaired same-run Retry, stable comment authors, obsolete accepted Return after reassignment, and source review GET writes. Those are source/HTTP findings, not inferred from screenshots.

## Connected observations

- Alex and Jordan retain separate unsent text. A completed handoff brief stays attributed to Alex through switches. The matter keeps one saved conversation.
- The browser copied exact editable request wording without a sent claim. A separate explicit action recorded an external request. Sam's exact partial reply remains separate from Alex's entry and linked reported fact.
- Jordan accepted a scoped work item, opened its source/packet, and returned written findings. The matter owner stayed Alex. Casey accepted and returned the whole matter while the work item stayed Alex. Casey has no specialty label.
- The comparison clearly shows retention30→180 days and customer-only→ticket-gated logged support access. Earlier advice can be selected before any draft or decision exists. Supplied text remains separate from analysis. The configured result with no structured links remains useful and actionable.
- The formatting-only comparison correctly states its limited meaning. Mark seen changes only the current person's cursor.
- The model produced tracked changes in the same lawyer-edited draft and kept the exact Lawyer note. A separate offered update was explicitly declined, retaining the draft and review state. The first harness assertion expected the wrong status label; the actual Earlier facts · Draft retained label passed.

## Sizes, keyboard and motion

| Condition | Actual evidence |
| --- | --- |
| 1440 pixels | Return/orientation, request, exact reply, scoped handoff, draft creation and proposal reading |
| 1024 pixels | Handoff actions, reported-fact correction and declined update |
| 768 pixels | Whole-matter handoff and exact supplied-source comparison |
| 390 pixels | Formatting comparison, individual seen state and narrow contextual navigation; no horizontal page overflow after action wrapping |
| Keyboard | Tab exposes a2-pixel focus outline; Enter opens Files & context; Escape closes it and returns focus to the opener |
| Reduced motion | Enabled in the actual browser contexts and recorded in journey dimensions |
| Actual200% zoom | chrome.tabs.setZoom(2) returned2;1440→720 CSS pixels and pixel ratio1→2; page width720, no page errors; keyboard drawer flow passed |

The actual zoom proof is native-zoom-final.json and its native-surface PNG. It used a dedicated temporary Chromium profile and restored zoom before closing. No extension was installed in the user's browser. The earlier720 CSS-pixel simulation and reviewer's CSS zoom are reflow evidence only. Full-page screenshots at native zoom cropped Chromium's scaled surface; they are not the visual acceptance proof. The viewport/native-surface capture was inspected.

The zoom harness follows the documented [Playwright extension setup](https://playwright.dev/docs/chrome-extensions) and [Chrome zoom API](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom).

## Final results and limits

Earlier real cold reads aborted at15seconds. The final repairs removed internal review snapshots from default discovery, reused the comparison catalog within one request, loaded optional catalogs when their panel opens, and stopped duplicate full-page refreshes during saved-run restoration and return. The final orientation reads completed in about 9 seconds; comparison reads took about 4.3 seconds. This is an observed copied-vault result, not a general benchmark.

Final completion-based checks passed at 1440 and 390 pixels. They waited for the actual orientation heading, saved comparison history and exact Lawyer note inside the loaded document editor. The saved draft and review loaded successfully. The memo states that supplied version2 is not independent verification. It retains the hold-launch position, open confirmations and exact Lawyer note. Closed remains the primary state; the historical waiting request does not become an active next action. The earlier useful answer remains visibly labelled with its older question/source basis.

Evidence: root-final-return-initial/loaded/comparison.json and viewport PNGs; root-final-editor-return-initial/loaded/comparison.json; root-final-editor-loaded-390.json/png and root-final-editor-loaded-1440.json/png. Native-zoom-final.json confirms actual factor 2,720 CSS pixels, reduced motion, no overflow or page errors, and keyboard Enter/Escape with returned focus. Its native-surface PNG was visually inspected. The final Terra High evidence review found no material blocker.

The earlier returnhint capture does not establish a return failure. It observed only4.5seconds after return; an invalid async predicate ended its comparison wait immediately. The reviewer retracted that finding. Other captures that stopped at Loading document are not accepted editor proof. These failed test attempts remain available beside the completed checks.

A historical provider-tool failure remains visible with its useful saved response. It is distinct from a current load failure. The connected story separately proved same-run retry and preserved work on partial failure. No external message was sent by copy, local request recording, handoff or manual-delivery controls.
