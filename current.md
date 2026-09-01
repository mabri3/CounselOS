# Current Project State

Last updated: 2026-08-31

## Active Goal

The Themis.ai reliability build is complete. The normal matter workflow now
preserves truthful chat and research state, one canonical work product,
decision integrity, lawyer authorship, and the full approval, delivery, and
closure lifecycle. Only the explicit Later backlog remains.

## Why This Goal Now

The previous closure checkpoint proved broad feature coverage. The reliability
build removed the remaining false-success, stale-state, artifact-identity,
provenance, company-profile, and naming defects that prevented a lawyer from
finishing one matter without reconstructing state by hand.

## Work Queue

### Now

- None.

### Next

- None.

### Later

- External Slack, Jira, Asana, and email intake connectors after manual paste becomes a measured bottleneck.
- Additional research providers beyond Polaris and the current native search path after Polaris misses a measured research need.
- Better retrieval after current local and Polaris research misses known relevant material.
- Selection-based rewrite and diff after the focused Markdown editor is validated.
- Source-layout-preserving Word/PDF editing, imported review round trips, native PDF editing, and full comment-thread collaboration after regenerated Markdown-first review proves insufficient.
- Court-grade citation validation, citator integration, and guaranteed comprehensive research after users show that source-status labels and first-pass research are insufficient.
- Authentication, SSO, enterprise RBAC, ethical walls, legal holds, cloud tenancy, Tauri packaging, team collaboration, and permissions after the local single-user workflow proves value.
- Durable or distributed queues, cloud databases, object storage, embeddings, and multi-instance scheduling after local in-process execution reaches a measured limit.
- Multi-agent voting, reviewer veto, autonomous final decisions, and broader legal modules after users validate a need that cannot be met by direct agent work plus explicit lawyer action.
- Full contract lifecycle management after the Product Counsel workflow proves value.
- Arbitrary shell execution, executable Markdown tools, and a general plugin marketplace remain outside the MVP safety boundary.
- Token streaming and broad visual polish after the intake-to-dossier workflow is stable.

### Blocked

- None.

## Active Assumptions

| Assumption | Basis | Confidence | Invalidating evidence |
|---|---|---:|---|
| The local single-user web app is the MVP product boundary. | `docs/PRD.md`, user-approved Later list | high | A user-approved scope change. |
| Markdown remains authoritative and SQLite remains disposable. | `AGENTS.md`, `docs/ARCHITECTURE.md` | high | An approved architecture decision changes the storage boundary. |
| Polaris is the primary public source for ordinary matter research. Private company and matter synthesis stays local. | User direction; existing Polaris trust boundary | high | A verified Polaris limitation blocks the approved demo and requires a user decision. |
| An agent with no override uses the workspace default. An explicit unavailable selection fails visibly and does not silently fall back. | User direction; closure handoff contract | high | A user-approved routing change. |

## Verified Evidence

- The post-review full backend suite passes 550 tests with one existing Starlette deprecation warning.
- Every `frontend/scripts/check-*.ts` script passes. Workspace checks, typecheck, and the production build pass.
- The isolated browser demo completed canonical draft creation, editor review, finalization, approval, delivery recording, closure, and visible navigation away and back.
- The browser demo preserved Closed state, moderate lawyer-set risk, the canonical draft, the linked final, and Themis.ai naming after reload.
- The repository vault hash remained `1f758e0a835e704490a3e4815ab98fb9523cec0a674be0229718f5b48c26380d` during the isolated run.
- The independent Sol High review found nine issues. Sol Light corrections resolved them, and the same reviewer reported no unresolved material finding after two rechecks.
- Queue-time dossier hashes persist on chat runs. A changed generated hash produces a review revision and preserves the lawyer's current dossier.
- Intake and research use one canonical dossier schema. Research support replaces the placeholder and retains labeled sources.
- OpenCode Go translates the complete tool loop to Messages blocks. Explicit agent providers cannot borrow a workspace model.
- Workspace changes and vault switches close cached provider resources. A closed Codex provider cannot restart.
- Research runs persist and reuse one provider selection. Intake research is deduplicated per intake conversation, not for the full matter lifetime.

## Recent Changes

- Made user turns, composer drafts, answered intake cards, long-run state, and unsupported mutation warnings durable and truthful.
- Added one canonical draft pointer and linked final pointer. Guided actions now use the same artifact, including safe legacy-draft adoption.
- Made research stages, source classes, packet titles, saved pointers, and partial public-research failures explicit.
- Added lawyer-set risk, exact work-item completion, meaningful decision conditions and revisit dates, and a cross-instance index rebuild lock.
- Simplified company profile review while preserving saved versions and human authorship.
- Replaced live product and active-document branding with Themis.ai while preserving listed technical compatibility values.

## Open Questions

- None. Optional live credentials can still limit provider smoke tests. Their unavailable states must remain visible.

## Exit Conditions

- [x] Every `M1`–`M11` and `C1`–`C10` outcome in the reliability plan has implementation and verification evidence.
- [x] Chat cannot present an unsupported mutation as saved without a durable warning.
- [x] Current draft, finalization, approval, delivery, and closure use linked persisted artifact identity.
- [x] Matter work, research, decisions, activity, risk, and company-profile state remain truthful after reload.
- [x] Useful research survives public-source failure without overstating support.
- [x] Human edits and decisions use human attribution; generated drafts remain clearly labeled.
- [x] Full backend, all frontend checks, typecheck, build, graph update, isolated browser demo, and vault guard pass.
- [x] The independent Sol High reviewer has no unresolved material finding after the correction rechecks.
- [x] `Now`, `Next`, and `Blocked` contain no remaining work.

## Next Resume Action

No resume action is required. Start new work only from an explicit Later item
or a new user request.
