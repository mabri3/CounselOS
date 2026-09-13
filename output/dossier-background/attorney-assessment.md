# Dossier usefulness check — September 12, 2026

## Result

The Harbor dossier is useful as a first-pass attorney work product. My content
grade is **B+**. This is an assessment of the generated draft, not a report of
testing by an independent attorney.

The main record remains the Mosaic-operated asset-purchase migration. The bank
alternatives are part of the dossier, but their assumptions are not adopted facts.

## What changed

- The dossier writer has a five-minute limit and its own model connection.
- Both chat views show background progress and keep separate questions available.
- An explicit request to add a hypothetical can update the general dossier.
- Each saved alternative carries its own assumptions, findings, remaining issues,
  and next action. Similar bank alternatives are not merged.
- Each issue has one current answer. Full saved research stays under that issue.
- The writer receives structured matter records instead of repeated old drafts.
- Writing instructions require useful conditional analysis, clear source limits,
  record conflicts, and a clear difference between proposed work and decisions.
- Current-document discovery no longer decodes old conversation run files.
- Chat display omits frozen execution inputs. The saved audit record stays intact.
  The measured response fell from 22.7 MB to about 1.15 MB.
- Local HTTP reads and submission have a separate 60-second limit. The former
  15-second limit could lose contact with an accepted background job.

## Live evidence

All writer checks used the configured Codex GPT-5.6-Sol model at medium effort.
They used saved Harbor material only. They did not start new legal research.

| Run | Observation |
| --- | --- |
| `RUN-20260912-04958f` | Finished in 105 seconds. Exposed duplicate issue sections, missing timing-test details, and the unwanted alternative-preview rule. |
| `RUN-20260912-31bf8e` | Finished in 176 seconds. Saved the general dossier with both alternatives and the 18-day timing gap. |
| `RUN-20260912-9d7085` | Finished in 148 seconds. Also flagged the state-count conflict and conflicting target dates. |
| `RUN-20260912-3fdaf1` | Finished in 103 seconds. The separate question `RUN-20260912-6942f5` finished 45 seconds before the dossier. Exposed an automatic alternative-analysis save on a read-only question, which caused a review-only revision. That write was then fixed. |
| `RUN-20260912-9f12a0` | Final live check: finished in 105 seconds and updated the current dossier. Read-only question `RUN-20260912-f40bd2` finished in 13 seconds, 24 seconds before the writer. No matter change was recorded by the question. |

The saved draft was checked for all five issues: licensing, customer identity
checks, suspicious activity and alerts, monitoring continuity, and the welcome
offer. Each has a current answer, application to the facts, support limits, and
next work.

The timing-test alternative correctly keeps December 3 bank readiness separate
from November 15 migration. The general bank alternative does not inherit that
test's facts. The current draft also states that 44 minus 41 is three, not four,
and asks for the license lists and meaning of “market.” It does not silently
change the reported figures.

Hashes of `facts.md`, `issues.md`, `recommendations.md`, and `paths/state.md`
were unchanged after the live dossier saves.

## Remaining work in the matter

The dossier is not a completed state-law opinion. The saved licensing research
has four retrieved sources and no verified relevant passages. The other four
issues have initial analysis, not completed research. The draft states these
limits and still gives usable analysis and next steps.

The missing jurisdiction list, conflicting dates, bank operating roles, offer
terms, and compliance records need attorney or business follow-up. Proposed
owners and timing must not be read as assigned work or recorded decisions.

## Checks

Deterministic browser checks passed in both chat views: a question finished while
the writer was held open, completion refreshed the dossier, and an unsent draft
survived. Stop and Retry were checked in the standard view. Reload recovery was
checked in the experimental view. Browser console errors were absent in those
checks.

The frontend type check, production build, and continuity recovery checks passed.
The new regression first failed for both explicit and implicit alternative scope.
It checks that a read-only question leaves the alternative unchanged and that the
concurrent dossier is applied, not left as a review-only revision.

The full backend suite passed in four file-based groups: 437 + 502 + 390 + 369 =
**1,698 tests**. The longest group took 14 minutes 41 seconds. After the display
change, 160 relevant checks passed. After the final read-only publication repair,
148 relevant checks passed, including both new concurrent-save regression cases.
The full suite was not repeated after that last narrow repair.

The final live run saved
`03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-dc2adc8aaff5906e6734.md`
and made it the current dossier. The open document panel showed that version,
including both alternatives, the 18-day gap, and both record conflicts. The final
browser check reported no console errors. Both local services returned HTTP 200.

The code graph was updated. The application changes passed the whitespace check.
Markdown hard-break spaces in generated work product were preserved.
