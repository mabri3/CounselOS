# Current Project State

Last updated: 2026-09-06

## Phase 2 UI checkpoint — September 6, 2026

The Phase 2 pages now use the selected A-style references. This includes Today,
portfolio and intake, Decisions, Briefing and Watches, templates and skills,
agent administration, automations, Settings, and the research reader. Matter
and decision-map interiors keep their compact presentation. Shared components
use optional Phase 2 variants and preserve their default Matter presentation.

Evidence and measured differences are in
`output/uiphase2-implementation/visual-matrix.md` and `browser-demo.md`.
Required backend tests passed 1,222 cases; final frontend typecheck and build
passed. One focused continuity check still expects three refresh endpoints,
while unchanged baseline code uses a fourth (`/handoff-references`). This is
recorded as a failure, not a passed check. Browser mutation tests used an isolated
vault and mock providers. The user waived 200% zoom. Real vault files and the
active pointer are unchanged. See `docs/uiphase2-a-style-ui.handoff-progress.md`
for the final review state and exact model routing.

## Completed Goal

The decision map redesign is complete. Normal inquiry and issue research save
optional analysis beside useful prose. The map and issue review share the exact
saved tests, conditions and paths. Preview is separate from an explicit decision,
which retains the exact analysis and option basis beside the lawyer's wording.

The final backend suite passed 1,222 tests. Frontend typecheck, map checks and
production build passed. The fresh Sol Medium review's three material findings
were fixed and rechecked. Browser proof includes configured-model publication,
source/scenario/decision return, responsive widths and clear regenerated paths.
Native 200% browser zoom remains unverified; CSS enlargement passed separately.
The graph updated, but its HTML view exceeded the tool's size limit.

Only owned test servers and build outputs were removed. Original services,
protected authoritative vault files and the active-vault pointer are preserved.
See `docs/decision-map-redesign.verification.md` for evidence and tool limits.
Earlier checkpoint details below remain historical.

## Previous Completed Goal

The lawyer workflow expansion is complete. It covers clear orientation,
business fact replies, generic local lawyer handoffs, and changed specification
impact through one matter conversation and the existing editor.

Independent review and material usability repairs passed. The connected Harbor
browser/model story completed reply, handoff, comparison, proposed revision,
selected Word/PDF export, explicit approval/delivery/work completion/closure,
and return with the saved answer and lawyer edits intact.

The final backend suite passed 1,149 tests. Frontend typecheck, all three required
groups, production build, graph update and whitespace checks passed. Final
browser checks covered 1440/1024/768/390 pixels, native 200% zoom, keyboard and
reduced motion. The normal frontend build is restored. Only owned test servers
were stopped. Protected authoritative vault files and the selection pointer
are unchanged; the selected vault has only its known disposable cache delta.

Use `docs/lawyer-workflow-expansion.verification.md` for exact evidence and
limits, including two unregistered legacy source-string checks. The progress
and usability reports distinguish failed attempts from completed proof.
Older checkpoints below remain historical.

## Previous Goal Context

The previous closure checkpoint proved broad feature coverage. The reliability
build removed the remaining false-success, stale-state, artifact-identity,
provenance, company-profile, and naming defects that prevented a lawyer from
finishing one matter without reconstructing state by hand.

## Work Queue

### Now

- None. The requested decision map redesign is complete.

### Next

- No new feature work is queued.

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

- The Mosaic Relay R2 UX repair passes 838 backend tests, the full frontend UX check, frontend typecheck and production build, graph refresh, and a visible existing-matter browser check. The browser showed split required/optional work, compact superseded intake turns, matching recommendation presence, scoped participant/owner controls, and no console warnings or errors.
- The final Sol High review found two dossier/reload P1 contracts and one stale-failure race. The corrections reserve dossier review links for real revision records, preserve successful work when dossier projection fails, and make only the latest matter refresh able to update state or report failure. The focused recheck found no remaining material defect.
- The runtime-contract and durable-card-answer repair passes 665 backend tests, frontend typecheck and production build, graph refresh, and a visible old-vault browser check. The affected matter now shows CIP as answered and asks the CIP-exception question with three useful choices.
- The matter-authority repair passes 658 backend tests, frontend typecheck and production build, graph refresh, `git diff --check`, and a live reload of the affected matter with no failed or synthetic update cards.
- The post-review full backend suite passes 629 tests with one existing Starlette deprecation warning.
- All focused frontend checks, the older lifecycle check, workspace checks, typecheck, and the production build pass.
- Fresh vault D completed visible intake, research, recommendation proposal and acceptance, lawyer edit, decision disposition, finalization, approval, manual delivery, required-work completion, closure, safe repair, and SQLite rebuild.
- The protected repository-vault hash remains `4e7ead57bd49e00a37dbd144ef227593ffe15032fb7803b8c262a16b1baeec3e`.
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

- Added exact saved issue analysis, conditional map paths, explicit decision basis, frozen research inputs and source/scenario return. See `docs/decision-map-redesign.contract.md` and `docs/decision-map-redesign.verification.md`.

- Repaired modified-End placement and canonical save read-back, typed lifecycle wording and close recovery, safe chat failure classes and durable progress, saved-state intake recovery, canonical recommendation precedence, shared dossier work-state projection, required/optional work labels, scoped mutation feedback, and compact guided-intake history.
- Added a runtime-owned contract for built-in agents, while preserving old-vault workspace guidance and custom-agent permissions.
- Made active intake-card answers durable before model analysis. Saved answers now close their question, retain source links, and can project an explicitly named matter field.
- Made question-card validation cover grouped duplicates and active saved choices. Changed the generic priority label to **Follow-up question** and removed the sole **Continue with assumptions** fallback.
- Repaired matter record authority: complete frontmatter now reaches the resolved API, answered intake cards prevent repeated fallback questions, duplicate answers fail before queueing, structured file edits reconcile typed state, and internal tool failures stay out of the primary chat cards.
- Added one durable serial research queue record per question with stable keys, reorder, retry, and restart recovery.
- Added versioned working recommendations, agent proposals that require lawyer acceptance, and direct lawyer versions.
- Added recommendation version, disposition, and reason to durable decisions.
- Added visible participant, work-item priority and owner, target-date, consistency warning, and safe repair controls.
- Made matter creation return before retained intake startup completes. Kept approval, delivery, decision recording, and closure behind direct controls.
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
- [x] Full backend, all frontend checks, typecheck, build, graph update, fresh browser demo, SQLite rebuild, and vault guard pass.
- [x] The independent Sol High reviewer has no unresolved material finding after the correction rechecks.
- [x] `Now`, `Next`, and `Blocked` contain no remaining work.

## Next Resume Action

Read `docs/decision-map-redesign.tracking.md` before resuming.
Do not start a competing writer on an assigned file.
