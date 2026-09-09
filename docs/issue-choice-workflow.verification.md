# Issue choice workflow verification

Verified 2026-09-07. Real matter decisions and work were not changed.

## Implemented flow

The top issue form records a chosen path, editable reason, explicit lawyer conclusion, and follow-up work. Recommendations remain separate from recorded decisions. A candidate does not imply risk acceptance.

The selected path and its saved work appear on the map. Unknown conditions stay unknown. A different path, reason, or condition starts a matter-wide analysis request. Saved decisions remain intact if analysis fails. Existing analysis is marked for review when recorded choices change.

Proceeding with follow-up creates or reuses a required lawyer review task. Completing implementation does not resolve the issue. The lawyer records the final conclusion. Other required work remains open even after risk acceptance. Existing approval, delivery, and closure controls still apply.

Drafts show a review notice when their recorded-choice context changes. Their text is not overwritten. Refreshing analysis does not silently approve a draft or another issue.

## Automated checks

- Full backend suite: 1,238 passed. One dependency deprecation warning.
- Five issue-choice tests passed again after the final backend change.
- Frontend type check and production build passed.
- Issue review, matter review integration, decision path layout, decision path recording, and workspace drafting checks passed.
- Issue-choice tests cover replay, partial-save recovery, stale and foreign basis validation, retained work, required lawyer review, map state, analysis context, draft preservation, approval, delivery, closure, and index rebuild.
- Graphify code graph updated. HTML output was skipped because the graph exceeds its size limit.

## Browser checks and limits

Used `backend/tests/serve_issue_choice_demo.py` with an isolated temporary vault and the Mock provider. Recorded a candidate with edited reasons and a required task. Checked the selected map path, pending work count, unknown conditions, work completion, final review action, and draft review notice. Opened the draft and confirmed its original text remained intact.

The original localhost:3000 matter still showed saved analysis without the earlier load error. No decision was submitted there.

Approval, delivery, and closure were verified by API integration tests, not a complete browser walk of those screens. This was a focused workflow check, not a full repeat of every acceptance-test scenario. No live model quality assessment was performed. The test servers were stopped; the original development services were left running.
