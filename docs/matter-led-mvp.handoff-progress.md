# Matter-led MVP handoff progress

## Status correction — 2026-08-30

The check marks below preserve the deterministic slice that was implemented
and observed on 2026-08-28. They are not current proof that the approved
adaptive LLM intake is complete. Current code still creates a context-free
fixed intake question with a hard-coded count, opens Overview before chat, and
does not use the Intake Agent to derive the first matter-specific question.

This file is historical. Current completion is tracked in
`docs/core-intake-provider-completion.handoff-progress.md` and must be proved
through `docs/MVP_CLOSURE_AUDIT.md`. Do not erase the original record below.

**Resolution — 2026-08-30:** The replacing adaptive Intake Agent flow is now
implemented. A fresh-vault browser walk proved direct Chat opening, a
request-specific first response, one material question, and no fixed counter.
The full repository verification passed with 482 backend tests.

Update this file after every completed step. Write the command or browser check that proves the step. If work resumes after context loss, read this file first and continue from the first incomplete item.

## Starting state

- [x] Build plan revised from the full product discussion.
- [x] Existing code paths reviewed for chat, intake, research, uploads, matters, settings, dossier placement, and work product.
- [x] Baseline verified on 2026-08-27 with `./scripts/verify.sh`.
  - Backend: 51 passed; one existing Starlette deprecation warning.
  - Frontend: typecheck passed.
  - Frontend: production build passed.
- [x] Handoff plan and clean-context prompt created.
- [x] Implementation started.

## Resume checks

- [x] Read root `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/BUILD_PLAN.md`, and `docs/matter-led-mvp.handoff-plan.md`.
- [x] Read current `git status --short` and preserve all unrelated work.
- [x] Run `graphify query` for the active slice because `graphify-out/graph.json` exists.
- [x] Rerun `./scripts/verify.sh` and record any baseline change.

## Implementation

- [x] Shared API and persisted-card contracts frozen by the coordinator.
- [x] Worker A complete: matter records, dossier, and work product.
- [x] Worker B complete: async research-agent runs and document sets.
- [x] Worker C complete: question cards, status, uploads, matter links, and Company settings UI.
- [x] Coordinator integration complete.
- [x] Targeted backend tests pass.
- [x] Card state survives conversation reload.
- [x] Existing single-file upload and manual research behavior remain compatible.
- [x] Frontend typecheck passes.
- [x] Frontend production build passes.

## Browser proof

- [x] End-to-end demo in `docs/BUILD_PLAN.md` passed for the implemented matter-led slice.
- [x] Existing Acceptance Tests A–G preserved by automated verification and browser smoke checks.
- [x] New controls preserve the current shell, three-pane workspace, chat flow, editor, Settings pattern, and visual style.
- [x] No unrelated control moved, changed name, or received a broad restyle.
- [x] Chat remained usable during background research.
- [x] Keyboard, hover, focus, click, and touch behavior checked for the question reason control.
- [x] Reduced-motion CSS behavior checked for the research indicator; the browser did not expose a live preference override.
- [x] Technical IDs did not appear in normal matter-tree and artifact UI after label fixes; IDs remain available in the explicit action trace.
- [x] Research or citation failure still produced a useful labeled answer in the focused failure test.

## Final proof

- [x] `./scripts/verify.sh` passed after integration fixes (74 backend tests, typecheck, build).
- [x] `graphify update .` completed after application changes.
- [x] `docs/ACCEPTANCE_TESTS.md` records the new observed checks.
- [x] No TODO, placeholder, dead service, or unconnected UI remains in this slice.
- [x] Final response lists changed behavior, exact verification, remaining limits, and no unverified success claim.

## Work log

Add dated entries here. Keep them short.

- 2026-08-27: Plan handoff created. No application implementation started.
- 2026-08-27: Added the current implemented UI as the design source of truth. The implementation must extend it without a broad redesign.
- 2026-08-27: Resume checks completed. `graphify query "matter intake chat cards asynchronous research document upload dossier work product company settings"` returned the active API, runtime, chat, matter, research, upload, and UI paths. `./scripts/verify.sh` passed with 51 backend tests, frontend typecheck, and frontend production build.
- 2026-08-27: Froze the persisted chat-card, card-action, attachment, research-run, batch-action, work-product, and company-profile contracts in `backend/app/models/api.py`, `frontend/lib/types.ts`, and `frontend/lib/api.ts`.
- 2026-08-28: Integrated all three worker lanes. Added runtime services and focused endpoints for intake, research status, multi-upload, batch actions, finalization, workspace uploads, and company settings. Added deterministic card persistence and mock-compatible actions.
- 2026-08-28: `./scripts/verify.sh` passed with 74 backend tests, frontend typecheck, and frontend production build.
- 2026-08-28: In-app browser verified Company save; new matter intake; card reload persistence; accessible reason disclosure; research polling; matter and Today plus controls; one-file upload intent; dossier link; draft work product; immutable finalization; useful matter-tree labels; and no browser console warnings or errors. Fixed workspace creation navigation, internal labels, and the missing Finalize control found during the walk.
- 2026-08-28: `graphify update .` rebuilt 1,684 nodes and 3,136 edges. Final `./scripts/verify.sh` passed with 74 backend tests, frontend typecheck, and frontend production build. `git diff --check` passed.
