# Harborline fix and rerun progress

Update this file during the one-shot run. Do not mark a line complete from an agent report alone.

## Baseline

- [x] Read required project instructions, selected skills, and experiment protocol.
- [x] Record branch `main`, commit `13f8db7`, and the full `git status --short` without changing the tree. The worktree had 300 modified or untracked path entries; all are preserved.
- [x] Record the original active vault `/private/tmp/counsel-os-harborline-ux-20260831` and confirm test-only vault safety.
- [x] Repository `vault/` baseline hash: `1146f14be1d8f6b768b48ad79c96d85277e0bdc41d8ab2066e60ee24ba2d2983`.
- [x] Classify current findings from implementation and focused review: COS-001, COS-003, COS-006, COS-007, COS-010, COS-011, ENV-001, and ENV-002 required correction; COS-002, COS-004, COS-005, and COS-008 passed review; COS-009 and COS-012 remain in frontend review.
- [x] Freeze shared API and record contracts; existing contracts were retained and the C0 worker produced no accepted patch.

## Implementation

- [x] C0 accepted: shared contracts. The existing narrow API and idempotency contracts were retained; no C0 patch was needed.
- [x] C1 accepted: new-vault parity. Focused proof: 24 passed.
- [x] C2 accepted: matter-record integrity. Focused proof: 53 passed.
- [x] C3 accepted: decision integrity. Focused proof: 15 passed; frontend typecheck/build passed.
- [x] C4 accepted: run reliability and output hygiene. Focused proof: 65 passed.
- [x] C5 accepted: Polaris observability. Focused proof: 48 passed.
- [x] C6 accepted: local runtime. Focused proof: 3 passed plus launcher checks.
- [x] C7 accepted: chat and lifecycle UX. Frontend recovery and adaptive-intake checks passed; the terminal refresh race was corrected and rechecked.
- [x] C8 accepted: artifact state. Matter brief and exact artifact-class text checks passed.
- [x] Every issue has a separate Sol Medium review verdict. COS-001 through COS-012 and ENV-001 through ENV-002 have final PASS results.
- [x] Every `FIX` finding is corrected and rechecked. The last COS-011 recheck passed after completed-action claim matching was narrowed; 42 focused tests passed.
- [x] No issue required Sol High engineering escalation.

## Verification

- [x] Focused tests pass. The final output-hygiene and truth-correction suite passed 42 tests.
- [x] Backend full test suite passes: 584 passed, 1 deprecation warning, in 93.83 seconds.
- [x] Frontend workspace UX check passes.
- [x] Frontend focused scripts pass, including transport, provider administration, adaptive intake, chat-run recovery, and matter brief checks.
- [x] Frontend typecheck passes.
- [x] Frontend build passes with 13 generated routes.
- [x] Blank-vault browser acceptance passes in `/private/tmp/counsel-os-harborline-final-verify-20260901-g` through the normal visible Settings flow. Typed-tool work created and finalized a canonical draft; normal controls reached Closed.
- [x] Markdown state survives deletion and normal rebuild of the verification vault's disposable `.counsel_os_cache.db`; Closed state reloaded.
- [x] Repository vault hash is unchanged by verification: `1146f14be1d8f6b768b48ad79c96d85277e0bdc41d8ab2066e60ee24ba2d2983`.
- [x] `graphify update .` completed after the final code correction.

## Experiment

- [x] New dedicated live-experiment vault created through visible Settings and recorded: `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`. NeuralWatt Kimi K3 Fast is saved.
- [x] Luna Medium requester produced exactly 10 complete requests. Coordinator audit confirmed 10 unique numbered requests, two substantial paragraphs each, and all seven required fields.
- [x] Luna Medium setup attorney completed company setup through a directly controlled in-app browser. Visible proof showed `Company profile · Saved`, no unsaved changes, version `31fffbfac2a0fe34`, and save time 7:42:16 AM. One fresh-tab recovery handled an unsupported visibility-control call; no coordinator help was needed.
- [x] Run 01 complete with evidence: one matter, completed intake, failed public research with saved fallback, canonical draft and final, reload consistency, no relevant recorded decision, and no visible approval, local delivery, or closure controls.
- [x] Run 02 complete with evidence: one matter and a saved/finalized intake artifact. Repeated structured-intake errors blocked completed intake, research, and a developed recommendation; no visible approval, delivery, or closure path was found.
- [x] Run 03 complete with evidence: completed intake, assigned required work, developed draft and final, research still running, stale stage/dossier, and no visible approval, local delivery, or close controls. Normalize timing from durable matter timestamps because the actor start-time estimate was inconsistent.
- [x] Run 04 complete with evidence: completed intake, saved fallback research, developed draft/final, saved recommendation, and one consistent durable decision. Reload regressed final/recommendation/research state; approval, delivery, and closure were unavailable. Normalize timing from the matter creation timestamp.
- [x] Run 05 complete with evidence: completed intake, failed research records, developed draft/final, durable decision, approval, local delivery-state record, Closed state, and reload consistency. The `Mark as sent` boundary lacked explicit local-only wording.
- [x] Run 06 complete with evidence: intake ended after structured-question errors and stopped cards; a developed draft/final survived reload; research, decision, approval, delivery, and closure were not completed.
- [x] Run 07 complete with evidence: completed intake, two timeout fallback research records, recommendation, draft/final, consistent no-decision state, reload persistence, unavailable approval control, and delivery-tool failure; not Closed.
- [x] Run 08 complete with evidence: completed intake, useful partial research, developed draft/final, durable decision and register proof, approval, local delivery record, Closed state, and reload consistency. Malformed `Lawyer` suffixes and contradictory decision chat wording were recorded.
- [x] Run 09 complete with evidence: intake recovered from repeated errors, timeout fallback research, developed draft/final, durable decision, reload persistence, and no visible approval, delivery, or closure path.
- [x] Run 10 complete with evidence: completed intake, developed draft/final and useful unsaved fallback analysis, but durable state remained Research. False chat claims for decision, research transition, delivery, and closure were disproved by overview, register, workspace, and reload.
- [x] Raw evidence normalized after all ten actors finished, without giving earlier findings to later actors. Durable audit: 10 matters; 6 matters with 14 research packet files; 10 matters with drafts and finals; 4 decisions; 2 approvals, deliveries, and Closed matters.
- [x] Fresh Sol High synthesis complete in `tmp/harborline-fix-rerun-20260901-073852/synthesis-draft.md`; no raw evidence or code was changed by the synthesizer.
- [x] Coordinator audited all ten raw reports against experiment-vault Markdown. Unsupported chat claims were rejected; actor timing errors in Runs 03 and 04 were corrected from durable timestamps and dispatch order.
- [x] Final report includes strict before/after metrics, every COS/ENV recurrence result, browser and environment failures, incomplete runs, and all method exceptions: `docs/experiments/2026-09-01-harborline-fix-rerun-report.md`.

## Current blocker or note

The one-shot work order is complete. All engineering issues have final reviewer PASS results and the combined gate passed. The dedicated experiment remains intact and active at `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`. Exactly 10 requests, 10 matter reports, normalized evidence, one fresh Sol High synthesis, and the checked final report exist. The final repository `vault/` hash remains `1146f14be1d8f6b768b48ad79c96d85277e0bdc41d8ab2066e60ee24ba2d2983`. The app is ready and points to the experiment vault. No coordinator actor-browser help, commit, push, deployment, destructive cleanup, or real external contact occurred.
