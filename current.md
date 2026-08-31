# Current Project State

Last updated: 2026-08-30

## Active Goal

The canonical MVP closure checkpoint and its post-review repair pass are
complete. The implementation now includes the data-integrity, provider,
research-run, verification, and evidence fixes found during the Opus review.
Only the explicit Later backlog remains.

## Why This Goal Now

The repository contains substantial implemented work, but its plans and
progress files no longer agree with the live product. The observed new-matter
flow still uses a context-free fixed intake card, opens Overview before chat,
does not route each agent through its own model selection, and does not use
Polaris for ordinary matter research. Several older documents also claim that
work is complete or not started when neither statement is accurate.

The user approved one exhaustive MVP-closure pass. This pass includes adaptive
intake, source-linked matter records, dossier completion, Polaris matter
research, per-agent provider/model/reasoning selection, OpenCode Go, Codex CLI,
Antigravity CLI, all non-Later acceptance defects, and truthful plan status.

## Work Queue

### Now

- None.

### Next

- None. A new item may not be placed here to avoid the active MVP closure. At checkpoint completion this section must still say `None`.

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

- The post-review full backend suite passes 495 tests.
- All focused frontend checks run from `npm run check:workspace-ux`; typecheck and production build pass.
- Queue-time dossier hashes persist on chat runs. A changed generated hash produces a review revision and preserves the lawyer's current dossier.
- Intake and research use one canonical dossier schema. Research support replaces the placeholder and retains labeled sources.
- OpenCode Go translates the complete tool loop to Messages blocks. Explicit agent providers cannot borrow a workspace model.
- Workspace changes and vault switches close cached provider resources. A closed Codex provider cannot restart.
- Research runs persist and reuse one provider selection. Intake research is deduplicated per intake conversation, not for the full matter lifetime.
- The isolated browser run showed direct Chat opening, a request-specific intake response, the five honest provider states, the canonical dossier, and no console errors.
- The repository vault hash remained `37cc42a5921b4dc39fa78bc7ea6941c7197e2e67e57767542a6ef7b34755f642` during the isolated run.

## Recent Changes

- Created the canonical closure plan, resumable progress file, and complete execution prompt for adaptive intake, Polaris matter research, and per-agent model routing.
- Moved OpenCode Go, Codex CLI, and Antigravity CLI provider adapters into the approved MVP closure scope.
- Made Polaris the approved primary public source for on-demand matter research. Additional research providers remain Later.
- Replaced the stale split backlog with one exhaustive closure checkpoint. Completion now requires a source-by-source closure audit and empty `Now` and `Next` queues.
- Required parallel execution with three Sol Medium implementers, one Sol Medium coordinator, one independent read-only Sol Medium reviewer, and a conditional read-only Sol High escalation for a material question the Medium reviewer cannot resolve.
- Applied the Opus review repairs without new services or pipeline stages. Added only local guards, protocol conversion, lifecycle cleanup, and focused tests.

## Open Questions

- None for the approved MVP closure. Missing optional live credentials may limit live smoke proof, but they do not permit fake readiness or incomplete adapter code.

## Exit Conditions

- [x] Every line in `docs/core-intake-provider-completion.handoff-progress.md` is `done` after its stated verification passes.
- [x] `docs/MVP_CLOSURE_AUDIT.md` lists every previously unchecked, pending, or failed item and classifies it as verified complete, verified historical/superseded, or explicit Later.
- [x] No audit row outside the explicit Later list is pending, failed, unverified, omitted, or silently reclassified.
- [x] Every active non-Later acceptance or progress checkbox is checked; obsolete checkboxes have dated evidence-backed historical/superseded dispositions.
- [x] New matters open in Chat with Themis and receive contextual, adaptive LLM intake instead of the fixed generic card.
- [x] Intake messages, source links, corrections, conflicts, supersession, undo, and dossier revisions preserve history and useful partial work.
- [x] Each agent can persist and use its own provider, model, and reasoning effort, with workspace-default inheritance and honest unavailable states.
- [x] Mock, OpenAI-compatible, OpenCode Go, Codex CLI, and Antigravity CLI satisfy their contract tests and show truthful readiness.
- [x] Polaris supplies privacy-safe public matter research, while the selected Research Agent performs private synthesis locally.
- [x] Full backend tests, focused frontend checks, typecheck, production build, graph update, and the final isolated browser demo pass after the last code change.
- [x] The independent Sol Medium reviewer has no unresolved material finding, and no Sol High escalation was required.
- [x] All stale plan and progress claims have dated correction or supersession notes, and all current product documents agree on scope and status.
- [x] `Now` and `Next` contain no remaining work. Only the explicit Later backlog remains.

## Next Resume Action

No resume action is required for this checkpoint. Start new work only from an
explicit Later item or a new user request.
