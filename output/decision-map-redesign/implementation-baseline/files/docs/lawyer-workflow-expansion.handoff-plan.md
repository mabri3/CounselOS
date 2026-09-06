# Themis: clarity, fact replies, lawyer handoff, and change impact

Date: 2026-09-05
Status: Proposed execution plan. This task creates planning documents only.
Orchestrator: gpt-6-astra / medium.
Repository: /Users/bharris/Programs/counsel-os-mvp
Companion prompt: docs/lawyer-workflow-expansion.handoff-prompt.md
Execution tracker: docs/lawyer-workflow-expansion.handoff-progress.md

## 1. Thesis and authority

Build all four approved improvements in one coordinated execution: clear orientation and next actions; a complete business-fact request/reply loop; generic lawyer-to-lawyer handoff in a local team demo; and the effect of a changed supplied specification on earlier advice and drafts. Finish with an integrated usability pass and repair its findings. The result must reduce the work needed to understand and continue a matter, while preserving enough information for professional judgment.

The user requested the plan and one-shot prompt now. Application implementation starts when the companion prompt is used. During that execution, all four areas and the final usability repairs are authorized. Do not stop after area 1, replace later areas with mock buttons, or insert customer interviews or commercial-validation gates. Work in dependency waves, not separate approval milestones. No wall-clock or token estimate is a completion guarantee.

Handoff is between any two lawyers. It must not depend on one being product counsel and the other privacy counsel. Two lawyers with the same specialty must work exactly as two lawyers with different specialties. Names are configurable. Practice labels, if present, are optional descriptive text and never control assignment, actions, or access. This does not require new substantive legal modules or a rewrite of the existing matter stages.

## 2. Payoff moment

A lawyer returns to a matter, understands its current answer and next action, records a business reply, passes a focused piece of work to another lawyer, and later sees how a revised specification affects the earlier advice—without reconstructing chat history or losing an edit.

## 3. Demo script and acceptance story

Use fictional data in copied temporary vaults. Three demo lawyers are Alex Morgan, Jordan Lee, and Casey Chen; all have the same available lawyer actions. A business contact is a named participant, not a fourth required account. Include one product-launch matter and one ordinary policy or contract-review matter using the existing workflow. Avoid practice-specific labels in the handoff controls.

1. Open Today as Alex. It shows a short ranked list, why each item needs attention, who has the next action, and a button that opens the exact work.
2. Open a returning matter. See a compact question, useful current answer, material caveat, one next action, and a short change summary. Open the full question and evidence on demand. Discuss and Draft remain directly available.
3. From an unanswered supporting question, prepare an editable fact request for a business contact. Copy it. The app does not claim it was sent. Record an external request only through an explicit action.
4. Paste a reply against that request. Review the proposed reported fact where interpretation is needed, then record it. The source reply, entering lawyer, reported speaker, linked question, and resulting fact remain traceable after reload. A partial reply leaves the unanswered part visible. A reassessment can run without overwriting drafts or decisions.
5. Hand a selected work item or document-review task to Jordan. The packet contains the exact ask, current basis, relevant artifact links, open questions, and requested date if supplied. Jordan sees the incoming handoff, accepts it, opens the relevant work, and completes or returns the scoped work. Alex sees the result. Other work and matter ownership stay unchanged for a scoped task.
6. Exercise a whole-matter handoff separately. Acceptance changes the existing legal-owner record. It does not silently reassign every other person's work item. Repeat a scoped handoff between two lawyers with the same optional specialty label.
7. Switch people during an active run. The submitted action retains its original actor and target. Each person retains their own seen state and unsent composer text. Saved matter conversation and artifacts remain shared.
8. Add a revised supplied specification as a separate source. Select its earlier version and compare. Read exact before/after passages, material changes, the affected assumptions and earlier decision basis, and the affected draft sections. A formatting-only change must also be demonstrated.
9. Choose an affected draft and request an update. Review the proposed changes in the existing editor. Keep an earlier draft, decline an offer, accept selected wording, and reopen/export the selected saved version. Prior decisions and source originals remain intact.
10. Return as the first lawyer. Today and the matter agree about the owner and next action. Seen state is individual. The recap explains the saved changes. Finish the normal decision/finalization/delivery/closure path through the existing controls when applicable.

The coordinator must run this connected story in the actual application. Isolated service tests and static screenshots alone do not establish the story.

## 4. Current system and reuse map

Read AGENTS.md, docs/PRD.md, CODEX_HANDOFF.md, current.md, docs/DESIGN_LANGUAGE.md, frontend/AGENTS.md, and docs/single-lawyer-workspace.verification.md before implementation. The September 5 verification report and actual source are newer than parts of current.md and CODEX_HANDOFF.md. Old test counts and completion statements are historical, not a fresh baseline.

The planning review inspected the actual services and screens. The live sample showed a very long question heading, file-path change notices, buried useful controls, a generic closure action, and an answer/context-load warning. Diagnose the warning in an isolated copy; do not assume its cause or turn it into a broad rewrite.

| Existing surface | Reuse for this build |
| --- | --- |
| backend/app/services/workspace.py and backend/app/models/workspace.py | Supporting-question identity, revision checks, receipts, snapshots, recap and seen state |
| backend/app/services/matter_records.py | Canonical reported facts, corrections and source links |
| backend/app/services/workspace_actions.py | Same-conversation actions, useful-answer publication, reassessment and update offers |
| backend/app/services/matter_state.py, matters.py, matter_work_items.py, matter_participants.py | Current work, legal owner, participants, assignment and lifecycle truth |
| backend/app/services/workspace_evidence.py and ingestion.py | Supplied files, extracted text, source identity, exact evidence and run manifests |
| backend/app/services/workspace_scenarios.py | Preserved hypothetical analysis and explicit actual-fact adoption |
| backend/app/services/work_product.py, document_review.py, document_export.py | Existing draft, proposal, direct edit, selected accept/reject and export loop |
| backend/app/services/review_packets.py and watches.py | Existing links to decision assumptions and review outcomes; no new watch engine |
| frontend/components/MatterWorkspace.tsx and workspace/DraftWorkspace.tsx | One connected Understand/Discuss/Draft workspace |
| frontend/components/workspace/UnderstandPanel.tsx, ChangeRecap.tsx, InquiryActions.tsx | Orientation, meaningful recap and actions near relevant content |
| frontend/app/page.tsx, frontend/lib/briefing.ts, frontend/components/BriefingList.tsx | Today ranking and action destinations |
| frontend/components/ChatPanel.tsx, workspace/ConversationDock.tsx | One matter conversation, visible target, retained unsent input |
| frontend/lib/design.ts and frontend/app/globals.css | Shared semantic styles; no page-local attention colors |

Do not rebuild prior-work search, templates, scenario analysis, source drawers, document review, or the scheduler. Compose them. A new focused service is acceptable for a new bounded behavior, not as a general workflow engine.

## 5. Build requirements

### Area 1 — Clear orientation and useful guidance

- Show the current business question in a compact reading form. Preserve its full stored wording. Do not silently rewrite scope to make a short heading. A short display summary must be labelled as such; use a faithful expandable preview when a reliable summary is absent.
- Put the current useful answer, material assumption or limitation, and next action near the top. Long answers can expand. Do not hide a decision-changing caveat to meet a word target.
- Preserve the last useful Understand/Discuss/Draft view on return. Understand is the fallback, not a forced landing page. A compact orientation remains reachable while drafting; do not take the lawyer away from their current document.
- Use one primary action in the orientation region. Show at most two secondary shortcuts there. This is a default information budget, not a rule that hides urgent failures or material facts.
- Derive the next action from saved work, lifecycle state, active runs, current person and required inputs. Use a real target ID/path and a visible reason. Today and matter view must consume compatible state rather than different guesses.
- A lifecycle instruction such as completing required work must name/open an actual required work item when one exists. Unknown ownership stays unknown. Agent work is not automatically assigned to a human. Legal uncertainty alone is not a blocking task.
- Preserve a useful saved answer when optional context or recap loading fails. Show one local recovery message with a useful action. Do not replace the whole reading surface with an error or hide a real failure with styling.
- Replace raw path recaps with titles and meaningful changes from saved receipts, explicit before/after records or available revisions. Old hash-only cursors cannot prove prior text: show “Facts changed; earlier text is unavailable” rather than inventing a semantic difference. Distinguish first visit from a change since last review.
- Show no more than three recap items by default, with Show all for the rest. Avoid an attention-colored empty panel. Essential current risks belong with the answer, not hidden in this recap limit.
- Use short contextual instructions. An optional “Help me move this forward” control can expose a few applicable steps with links. It must not become a mandatory wizard or a second workflow state machine.
- Put useful actions beside the facts, issues or drafts they affect. Keep secondary tools discoverable without permanently showing every panel. Reduce repeated completion cards and duplicate answer text while retaining history on demand.
- Preserve meaningful state words and source labels. Green means saved/complete, not legally correct. A recommendation, recorded decision, approved artifact and delivered response remain distinct.

### Area 2 — Business fact requests and replies

- Extend the existing supporting question. Do not create a second fact ledger or a second chat. A request links to a stable question and optional issue/work item; it can name any business contact or lawyer.
- Retain request wording, optional due date, requested person, entering actor, source question/version, request status, replies and linked facts. No due date or recipient is invented.
- Suggested minimum state wording: Prepared, Requested externally, Reply saved, Answer recorded, Partly answered, Left open. Freeze the actual internal enum and transition rules in package A. Copy is never Send. “Requested externally” needs an explicit record action; receipt of a reply does not require a prior sent-state gate.
- Paste preserves the exact reply as supplied source text. The reported speaker is separate from the lawyer who entered it. Unknown speaker and unknown date remain unknown. Pasted text is data, not new system instructions.
- An explicit “Record this answer” action may save the linked reported fact directly. Where a reply has several possible meanings, show a small editable proposal or ask one focused question. Do not require a second confirmation after an explicit unambiguous recording instruction.
- Partial replies close only the parts actually answered. Contradictory replies preserve prior facts and use the existing correction/supersession path. A stale or reframed question must not be marked answered by a reply to a different question.
- A fact write and its request/receipt update must recover from partial failure without duplicate facts. Report which parts saved. Retain unsaved input. Retry with the same source-action key resumes the original operation.
- After a fact is recorded, show its effect on the current question and next action. Reuse the existing reassessment run. Failure of reassessment does not undo a saved reply/fact. Offer draft changes only when relevant, and require a later explicit draft-update instruction.
- Show Waiting on [name] only from an actual open request. It does not block research or drafting with assumptions. No email/Slack connector, automatic nudge, or stakeholder portal is required.

### Area 3 — Generic lawyer-to-lawyer handoff

- Provide an optional local demo mode with three configurable lawyer identities and a labelled “View as” control. It is a simulation, not authentication or a permission boundary. No passwords, practice-specific roles or hierarchy.
- Reuse the existing vault settings record for the small namespaced identity roster and demo-enabled flag. Default existing vaults to single-lawyer behavior. An explicit enable/configure action can populate the roster; test setup seeds only copied temporary vaults. Keep roster controls simple; do not build an account-management area.
- Use stable local person IDs and display names. Resolve the current demo person per browser context/request. Never mutate a server-global current user or workspace-default lawyer setting when switching. Default single-lawyer mode must still work.
- Scope local view preferences, unsent chat text, selection and seen state by vault, person and matter as appropriate. Preserve a prior person's unsaved editor text before a switch; retain it or require save/keep/discard only when necessary to prevent loss. Do not claim collaborative live editing.
- Freeze the initiating person ID and display-name snapshot with queued runs, retries, saved replies, handoffs and document review actions. Model output cannot choose its own human actor. Switching the UI mid-run must not change attribution. Historical entries with unknown authors keep that label.
- Today offers simple My work, Waiting on others and Team views within the existing surface. Incoming pending handoffs appear for the recipient. Each queue item has a specific action and relevant owner. Views filter shared local data; they do not imply private access.
- “Hand off work” supports a selected existing work item and a whole matter. A request to review a selected issue/document can create a normal work item with that target, then hand off that item. Do not create delegated branches or a generic routing engine.
- A handoff has sender, recipient, scope, precise ask, relevant immutable source/artifact revision references, brief current basis, open questions, optional requested date, state and receipt. Generate a useful editable brief through the existing agent when requested; a direct handoff must also work without a model.
- Previewing a handoff changes nothing. Creating it makes a pending local handoff, not an external message. Recipient acceptance assigns only the specified scope through existing ownership services. Until acceptance, the original owner remains responsible. Sender can withdraw a pending handoff; recipient can decline it with a short reason. Decline/withdraw leave owner and work-item status unchanged and remove the pending recipient action.
- After acceptance, “Return work” creates a new reciprocal pending handoff to the original sender, with an editable response/reason and the current scope revision. It does not undo the accepted handoff or mark work complete. The current owner stays responsible until the original sender accepts the return; that acceptance transfers only the stated scope. A newer direct assignment makes the return/accept conflict rather than overwrite it. A completed task can simply expose its linked response/result to the sender using existing task completion; returning ownership is not required to finish a task. Retry reuses the same return record. Record these distinct queue transitions in A's contract.
- Work-item acceptance changes that item's owner, not matter legal_owner. Whole-matter acceptance changes the canonical legal_owner and matching participant projection, not every task owner. Existing unassigned or separately assigned work remains visible. Completing the handed-off task uses the existing work-item completion action, not an automatic matter close.
- Keep the handoff packet as historical context. If its source or owner changed, show the difference and require a current acceptance target; do not silently accept an obsolete ownership transfer. Repeated accept/withdraw/retry is deterministic. Concurrent direct assignment must not be overwritten by a stale handoff.
- Per-person Mark seen never marks another person's changes seen. Read-only page loads never acknowledge changes. Legacy local_seen belongs to the legacy single-lawyer view; do not apply it to every demo person.
- Test any-lawyer handoff, including two lawyers with identical specialty text and lawyers without specialty text. No product/privacy pairing appears in required UI or behavior.

### Area 4 — Changed specification and effect on prior advice

- Use two explicitly selected supplied sources or their saved versions. Uploading the revised spec preserves the original. Do not infer a complete version chain merely from filenames. If an earlier version is missing, permit a useful current analysis but say comparison is unavailable.
- Freeze actual compared text, source hashes/versions, current question, fact/assumption basis and selected decision/draft versions at submission. Use vault-contained immutable snapshots where needed; a hash alone cannot display earlier text. Original binary files and extracted companions keep their lineage.
- Include earlier saved advice and working recommendations as explicit comparison targets, with ID/path, version and actual text. State which earlier advice remains supported, changes or may need review. This must work when there is useful earlier analysis but no recorded decision and no draft. Do not require the lawyer to create a decision just to compare its basis.
- Show material before/after passages with usable locators and source status. Separate literal textual differences from generated assessment of significance. Handle formatting-only changes, deletions, missing extraction and partial documents without inventing a reversal.
- Limit initial analysis to this matter and explicitly selected linked work. Link affected assumptions, recorded decision basis and draft sections where support exists. Explain potential relevance when only an inference exists. Do not claim exhaustive impact coverage or build a cross-vault dependency graph.
- Display a compact result: what changed, why it may matter, affected work and next action. The full comparison remains available. “No material effect found in the compared material” is valid; it is not a completeness guarantee.
- Comparison is analysis, not actual-fact adoption. A revised spec is a supplied proposal unless the lawyer explicitly adopts its selected changes as actual facts. Reuse the fact-correction path for adoption. Do not change the current business question, decision, recommendation or draft merely by comparing files.
- Link an impact result to an existing draft-update offer. The lawyer can open the evidence, keep the draft, request a proposed revision, or record a separate decision through the existing explicit path. Accepting proposed wording is not accepting a legal decision.
- A requested draft update uses the existing conversation and review engine, correct artifact/review revision, template snapshot and selected section. Preserve direct edits, unsaved text, pending proposals, approved/final identity and exports. If the target is an immutable final, create a new working revision through the existing lifecycle; do not alter it in place.
- If sources, facts or drafts change during analysis, retain the useful result with its old basis and offer a current rerun. Do not publish it as current or overwrite newer work. Retry must not duplicate the impact packet, offered update or proposed revision.
- Use the current provider, job/run and context-manifest boundaries. Private specs remain within the approved private-context provider path; never send them to the public Polaris query path. Missing public research does not prevent useful local comparison. No additional verifier agent or external watcher is required.

## 6. Contract freeze before parallel coding

Package A/I defines the minimal additive Python and TypeScript contracts in docs/lawyer-workflow-expansion.contract.md before feature workers start. Names below are proposals, not assertions that APIs already exist. Read actual methods before wiring.

| Contract | Minimum meaning and storage boundary |
| --- | --- |
| Orientation / NextAction | Current answer reference, display question, reason, state, target, actor/owner, basis revision; derived from existing records, not another authoritative matter store |
| MeaningfulChange | Title, supported before/after details or honest unavailable state, record links, relevant saved versions; no model call required on page load |
| DemoPerson / ActionActor | Stable local identity, name snapshot, explicit demo flag; small optional vault-local roster; browser selection is not access control |
| PersonViewState | Per-person seen cursor and local view keys; exclude these from legal-content freshness hashes |
| FactRequest / Reply | Existing supporting-question metadata plus immutable supplied-reply source, status, named contact, due date, source lineage and receipt |
| Handoff | Matter/work-item scope, sender/recipient, ask, frozen packet references, pending/accepted/declined/withdrawn states, optional prior-handoff link for a return, expected ownership revision and retry receipt |
| SpecComparison / Impact | Existing generated work-product/review-packet form with compared source snapshots, earlier saved advice/recommendation text and versions, affected record references, claim evidence, coverage limits and linked update offers |

Prefer metadata in workspace.md for lightweight question/request/seen projections, existing events/work items for handoff lifecycle, and existing work-product records for comparison output. Where independent retry or immutable text requires a separate Markdown record, name its exact path and authority in the contract. Do not add an event bus or a second current owner/fact/draft store.

A/I must explicitly settle: storage authority and named record paths; method signatures and component props; actor transport for GET versus mutations/runs; legal-owner and work-owner string compatibility with IDs; identity-aware local keys; refresh and conflict behavior; handoff commit/recovery order; first-visit/legacy seen behavior; source baseline preservation; effect of fact replies and impact offers on Today. Record before/after examples and partial-failure fixtures.

All existing workspace.md writers must retain current metadata under the existing serialized read/check/write lock. Do not hold a lock across model or network work. Multi-record mutations need an idempotent recovery order and truthful partial receipts, not assumed cross-file atomicity. Read-only requests must not write migration or acknowledgement state.

## 7. Execution policy and model routing

Use the parallel-plan-executor skill and its policy reference. Use one shared working tree. Preserve all starting changes, including untracked source. No commits, pushes, deployment, worktrees, resets or destructive cleanup. Workers do not spawn agents. Reviewers are read-only.

The normal runtime has four active slots including the coordinator. Maximum active children is three, including any reviewer. Pool caps do not add capacity. When fewer slots are available, use smaller waves without silently changing models. Do not create tasks in the sidebar; use bounded subagents.

| Pool | Model / effort | Role | Max active |
| --- | --- | --- | --- |
| Coordinator | gpt-6-astra / medium | Orchestration, contract acceptance, integration checks, final evidence | 1 coordinator |
| Complex implementation | gpt-6-astra / high | Shared contracts, attribution, integration, impact boundaries | 1 child |
| Stateful implementation | gpt-5.6-sol / medium | Fact loop, handoffs, orientation derivation and impact UI | 3 children |
| Presentation implementation | gpt-5.6-terra / high | Bounded layout, contextual guidance and final visual repairs | 1 child |
| Focused implementation | gpt-5.6-sol / low | Bounded team/request controls and helpers | 1 child |
| Independent review | gpt-6-astra / low | Contract check and final combined code + UX review | 1 child |
| Review escalation | gpt-6-astra / medium, then high when needed | Resolve a specific uncertain material finding | 1 child |

Use the user’s capability order: Sol Medium owns the harder stateful work ahead of Terra High. Terra High owns bounded presentation work; Astra owns the most complex shared contracts and integration. “Light” means low for Astra and Sol. The latest user direction permits Sol Low and Medium only; do not route or escalate any package to Sol High. All workers use Codex and explicit supported model identifiers. Use task-local context (fork_turns none) with exact file scope and read references.

The coordinator checks each package's diff, scope and focused evidence. Run one dedicated Astra Low review of the high-risk contract before dependent coding, and one dedicated review of the assembled build after integration. Do not insert a separate full independent review gate after every ordinary component. Re-review material corrections and the final usability repairs.

An Astra Low reviewer reports uncertainty with the exact contract, file, failing case and unresolved question. The orchestrator dispatches a bounded read-only Astra Medium review; use Astra High for unresolved cross-component or record-integrity questions. A reviewer never silently writes repairs. Return findings to the original implementer. For implementation difficulty, Sol Low may rise to Sol Medium; unresolved correctness/identity/retry problems can transfer to Astra Medium or High with a recorded lease after the previous owner stops. User approval for these named models is already present. Escalation is based on evidence, not just elapsed time. Do not substitute another model without authorization.

## 8. Packages and exact initial write ownership

Paths below are repository-relative. New files are explicitly proposed. They are ownership permissions, not instructions to touch every listed file. Before dispatch, check whether newer source already provides a helper. Narrow an unused scope; add a newly discovered path only through a recorded coordinator lease. Shared files stay with A/I. Test files belong to their implementer. No two live agents may write the same path.

### A/I — Contracts, shared integration and lifecycle seams

- Implementer: Astra High. Risk: high. A starts after baseline. I resumes after feature packages are ready.
- Outcome: agreed contracts and one connected application. Own shared transport, run attribution, metadata integration and the real end-to-end routes. Keep core services small; compose package helpers.
- Writes: docs/lawyer-workflow-expansion.contract.md; backend/app/models/continuity.py (new); backend/app/models/workspace.py; backend/app/models/api.py; backend/app/runtime.py; backend/app/main.py; backend/app/routers/workspace.py; backend/app/routers/team.py (new); backend/app/routers/chat.py; backend/app/routers/matters.py; backend/app/services/workspace.py; backend/app/services/workspace_actions.py; backend/app/services/matter_records.py; backend/app/services/matters.py; backend/app/services/matter_state.py; backend/app/services/matter_participants.py; backend/app/services/matter_work_items.py; backend/app/services/chat_runs.py; backend/app/services/chat_history.py; backend/app/services/work_product.py; backend/app/services/document_review.py; backend/app/services/workspace_scenarios.py; backend/app/services/workspace_evidence.py; backend/app/services/ingestion.py; backend/app/agents/context.py; backend/app/agents/runner.py; backend/app/agents/output.py; backend/app/tools/handlers.py; backend/app/tools/capabilities.py; backend/app/tools/registry.py; frontend/lib/continuityTypes.ts (new); frontend/lib/continuityApi.ts (new); frontend/lib/workspaceTypes.ts; frontend/lib/workspaceApi.ts; frontend/lib/api.ts; frontend/lib/types.ts; frontend/lib/reviewAuthor.ts; frontend/lib/workspaceDrafting.ts; frontend/components/MatterWorkspace.tsx; frontend/components/ChatPanel.tsx; frontend/components/DocumentPanel.tsx; frontend/components/AppShell.tsx; frontend/components/workspace/DraftWorkspace.tsx; frontend/components/workspace/ConversationDock.tsx; frontend/app/page.tsx; frontend/lib/briefing.ts; frontend/components/BriefingList.tsx; frontend/app/settings/page.tsx; frontend/app/globals.css; frontend/lib/design.ts; frontend/package.json; backend/app/blank_vault_template/manifest.json.
- A also declares the exact new/changed declarative tool and seed file list in the contract before changing it. These files remain A/I-owned; no broad permission to alter unrelated tools.
- Tests owned: backend/tests/test_continuity_integration.py, test_continuity_identity.py, test_continuity_recovery.py (all new); frontend/scripts/check-continuity-integrity.ts (new). Existing test changes need a named lease from the coordinator.
- Additional shared persistence paths reserved to A/I: backend/app/services/settings.py; backend/app/routers/settings.py; backend/app/services/index.py. If owner IDs enter index queries, extend the rebuildable projection and schema version. Do not rely on a free-text owner column as stable identity. A small authoritative Markdown queue read is also acceptable when it avoids needless schema work; choose once in A's contract.
- Provides: frozen contract and fixtures after A; all real services/routes/tools/page callbacks after I; npm check:lawyer-continuity registration and actor-safe tests.
- Check: focused HTTP/run tests for actor freeze, partial writes, metadata preservation, stale publication, same conversation, old-vault behavior and all four connected areas; typecheck after integration. A alone need not run a full build for contract-only changes.

### B — Orientation and meaningful recap derivation

- Implementer: Sol Medium. Risk: normal. Depends on accepted A.
- Writes: backend/app/services/workspace_orientation.py (new); backend/tests/test_workspace_orientation.py (new).
- Read: work state, canonical lifecycle, current workspace snapshots/receipts and A's request/team projections.
- Outcome: one read projection for compact answer, supported changes and target-specific next action. Keep fallbacks useful without manufacturing facts or hiding errors. Works for legacy single-lawyer and demo-person views.
- Provides: pure/read-oriented helper consumed by A/I and F.
- Check: exact action targets, required/optional distinction, owner/viewer changes, no-answer/context failure, hash-only history, stale and first-visit cases, no read-side writes.

### C — Fact requests and supplied replies

- Implementer: Sol Medium. Risk: high. Depends on accepted A.
- Writes: backend/app/services/fact_requests.py (new); backend/tests/test_fact_requests.py (new).
- Read: supporting-question, matter-record, source and action services. Shared changes go to A/I.
- Outcome: prepare/copy/external-request state, exact reply capture, linked reported answer, partial/contradictory reply and retry recovery. Expose reassessment request data through the agreed existing run seam.
- Provides: durable request/reply operations and fixtures for G and A/I.
- Check: source text/actor/speaker distinction, no false sent state, partial answer, question reframe, duplicate reply retry, injected failure after fact save, unchanged decisions/drafts.

### D — Demo identities and generic handoffs

- Implementer: Sol Medium. Risk: high. Depends on accepted A.
- Writes: backend/app/services/workspace_team.py (new); backend/tests/test_workspace_team.py (new).
- Read: existing owner/participant/work-item services and A's actor/cursor contract.
- Outcome: roster projection, scoped handoff lifecycle, person queue and seen-state helpers. No practice-role restriction, authentication or auto-routing.
- Provides: operation results and fixtures for G and A/I. A/I wires identity transport and canonical owner changes.
- Check: same-specialty pair, work-item versus whole-matter transfer, accept/return/withdraw/retry, reassignment conflict, per-person seen state, unknown/duplicate names and vault separation.

### E — Supplied-spec comparison and impact

- Implementer: Astra High. Risk: high. Depends on accepted A. Schedule when the complex-implementation pool is free.
- Writes: backend/app/services/change_impact.py (new); backend/tests/test_change_impact.py (new).
- Read: evidence, source ingestion, scenarios, work product, review packets and existing update-offer services.
- Outcome: frozen source comparison, bounded generated effect on selected linked work, supported passages and coverage limits. No silent actual-fact/decision/draft mutation.
- Provides: comparison/run publication and impact-to-offer contracts for H and A/I. A/I wires the existing model run and tool boundaries.
- Check: unchanged/formatting-only source, added/deleted passages, missing/partial extraction, missing prior baseline, stale source/target, unknown links, duplicate retry, untrusted document instructions and preservation of originals/decisions.

### F — Orientation, guidance and information hierarchy

- Implementer: Terra High. Risk: normal. Depends on accepted A; can build against frozen B fixtures while B runs.
- Writes: frontend/components/workspace/UnderstandPanel.tsx; frontend/components/workspace/ChangeRecap.tsx; frontend/components/workspace/InquiryActions.tsx; frontend/components/workspace/OrientationSummary.tsx (new); frontend/lib/orientationPresentation.ts (new); frontend/scripts/check-orientation-presentation.ts (new).
- Outcome: short first screen, visible caveats and next action, meaningful recap, contextual discovery and optional path. Avoid a new permanent rail. Send shared CSS and Today integration requirements to A/I.
- Provides: composable display/action props; responsive and keyboard behavior. Do not add a second composer.
- Check: long wording, blank/partial/stale answer, default/expanded content, actionable links, one primary action, keyboard and narrow-screen reading. Static source-string assertions are not a substitute for browser checks.

### G — Fact-reply and handoff controls

- Implementer: Sol Low. Risk: normal. Depends on accepted A; C/D fixtures may be used until services are integrated.
- Writes: frontend/components/workspace/FactRequestPanel.tsx, HandoffPanel.tsx, DemoLawyerSwitcher.tsx, TeamWorkList.tsx (new); frontend/lib/teamPresentation.ts (new); frontend/scripts/check-team-interactions.ts (new).
- Outcome: small contextual request/reply and generic handoff controls; unambiguous person/scope/status; compact queues. No new top-level navigation destination. A/I owns mounting and identity persistence.
- Check: exact scope confirmation, plain names with no specialty requirements, copy versus sent status, retained input on error, pending/accepted/returned actions, keyboard focus and mobile layout. If state coupling exceeds the fixed contract, escalate to Sol Medium with evidence.

### H — Change-impact reading and actions

- Implementer: Sol Medium. Risk: normal. Depends on accepted A; E fixtures may be used until integrated.
- Writes: frontend/components/workspace/ChangeImpactPanel.tsx (new); frontend/lib/impactPresentation.ts (new); frontend/scripts/check-change-impact-presentation.ts (new).
- Outcome: readable before/after comparison, short effect summary, precise affected-work links, unavailable/stale states and existing draft-update callbacks. Evidence opens in the existing drawer.
- Check: small/large changes, no material effect, exact source passages, partial support, stale comparison, unchanged draft until requested, retained declined status and narrow-screen layout.

### J — Final integrated usability and repair

- Implementer: Terra High for final UX repairs, under explicit temporary leases after all other frontend writers stop. A/I handles remaining shared/backend corrections. Risk: normal; depends on integrated I and the first combined review.
- Start read-only: walk all acceptance journeys and produce prioritized usability findings. Judge user experience and information load, not only spacing or color. The coordinator records findings in docs/lawyer-workflow-expansion.usability.md. Only then assign exact repair paths to J or original owners; no overlapping broad frontend lease.
- Outcome: complete, calm work flow across all four areas. Repair new confusion caused by combining individually correct panels.
- Check: section 10 rubric and section 11 journeys, including actual screen captures. Independent Astra Low rechecks material repairs. This is required implementation work, not an optional polish backlog.

### Coordinator-only paths and operations

- Writes: this plan, companion prompt, progress tracker, docs/lawyer-workflow-expansion.verification.md, docs/lawyer-workflow-expansion.usability.md, docs/ACCEPTANCE_TESTS.md, docs/DESIGN_LANGUAGE.md, current.md, contextmap.md and CODEX_HANDOFF.md. Update project state only to match actual accepted work. Decisions.md changes only for a real new architecture decision.
- Own baseline manifests, temporary vault/server lifecycle, final integration evidence, graphify-out generated updates, production builds, full suites and browser session/viewport. Name any new acceptance fixtures/scripts in the ownership ledger before creating them.
- New evidence goes under output/lawyer-workflow-expansion-acceptance/. App-created records go only inside the selected temporary VAULT_PATH. Do not use real user vaults for test writes.

## 9. Dependency waves

1. Baseline and bounded inspection. Coordinator records existing dirty/untracked files and protected vault/server state. A/I freezes contracts. A separate Astra Low reviewer checks high-risk actor, storage, ownership and source-version seams. Repair contract findings before dependent coding.
2. B, C and D run in parallel after A is accepted. Coordinator verifies their files/checks. No runtime/router changes outside A/I.
3. E, F and G run in parallel. F/G may start earlier in a free slot after A only if B/C/D interfaces remain frozen. E consumes the single complex-implementation slot.
4. H completes. A/I resumes integration when E releases that pool and the services are ready. H and I may overlap only on the agreed disjoint paths; shared contract changes pause affected dependents. Finish real model/run and browser wiring, not fixture-only screens.
5. Run the first independent Astra Low combined review. Return material findings to owners and run focused rechecks. Escalate exact uncertain findings to Astra Medium/High as needed.
6. J runs the integrated usability pass, then assigned repairs. Independent review rechecks material code and UX changes. Backend correctness and usability work are both required.
7. Coordinator runs final suites, actual browser journeys, graph update, changed-path audit and normal-config production build. Update evidence and project context. Do not declare success while a required item is merely planned or mocked.

Each worker returns outcome, changed files, checks actually run, evidence, unresolved risks and any needed integration changes. A failed launch is not a completed package. No silent provider/model substitution. No dedicated reviewer may review its own implementation.

## 10. Final usability pass: enough information, without overload

Use actual saved data and the assembled UI. Inspect at 1440, 1024, 768 and 390 pixels, with keyboard-only navigation, 200% zoom and reduced motion. Restore temporary browser settings afterward. Record observations; do not present agent timings as measured lawyer productivity.

| Test | Required visible result |
| --- | --- |
| First glance | At normal desktop width the current answer or honest unavailable state, material qualification and next action appear before long history; the question heading does not consume the screen |
| Information balance | Current answer, important uncertainty and source path remain reachable. Shortening does not delete a qualification, unresolved decision or required action |
| Competing controls | One primary action in the active work region; at most two default secondary shortcuts there; advanced history and technical IDs are secondary |
| Discovery | A lawyer can find fact request, handoff and change comparison from the relevant question/work/source without knowing an agent command or opening unrelated settings |
| Continuity | Switching views/people, leaving and returning, or an optional-load failure preserves saved work and unsent text with clear ownership |
| Reading | No permanent stack of file rail, issue rail, evidence rail and chat squeezing the document. Long text wraps; titles and evidence remain readable |
| Meaning | Waiting, requested externally, reply saved, accepted handoff, proposed revision and recorded decision have distinct truthful labels |
| Empty/error/running | Useful output stays visible. Retry points to the failed step. Optional failure is local. Progress never claims a save that did not occur |
| Recap | Explains supported changes in ordinary language. No raw paths as the primary recap. No new-change badge for an unchanged/seen record |
| Generic team | Handoff works for any two configured lawyers, with the same actions and no required specialty or seniority pairing |
| Accessibility | Visible focus, labelled controls, focus return on drawer close, no hover-only essential content, color plus words, usable narrow layout |

Use a read-only independent reviewer who has not implemented the UI. Give that reviewer task instructions without click-by-click directions first. Record where they hesitate, take a wrong path, cannot find an action, see too much competing information, or miss a material caveat. This is an agent-led usability inspection, not a claim of human validation. Repair material failures in this run.

Proposed human-use targets for later observation are finding the next action within 15 seconds and resuming a handoff within 60 seconds. They are design targets, not claimed gains or brittle browser performance tests. Current acceptance is that the required information/action is visible and the journey actually works.

## 11. Verification and negative cases

Capture a fresh baseline. Use backend/.venv/bin/pytest if the shell Python lacks packages. Do not install python-frontmatter. Read the installed Next.js guidance before changing frontend APIs.

Required final commands, adjusted only for verified local runtime paths:

    cd backend && .venv/bin/pytest
    cd frontend && npm run typecheck
    cd frontend && npm run check:workspace-ux
    cd frontend && npm run check:single-lawyer-workspace
    cd frontend && npm run check:lawyer-continuity
    cd frontend && npm run build
    graphify update .
    git diff --check

The new check group must be registered by A/I and exercise meaningful helper/component behavior. Add real HTTP integration tests and actual browser journeys for the consequential state changes. Run docs/ACCEPTANCE_TESTS.md with fresh evidence for affected journeys; retain historical evidence as historical. Use isolated fixtures for parallel tests; keep builds/shared browser runs serial. Do not weaken tests to obtain green results.

| ID | Required proof |
| --- | --- |
| LC-01 | Today and matter show the same specific action and owner, including required work after manual delivery |
| LC-02 | Old/long matter opens with a useful compact answer or honest recovery path; full wording and caveats remain available |
| LC-03 | Request wording can be edited/copied; no sent claim; exact reply source becomes a linked reported answer and survives reload |
| LC-04 | Partial, contradictory, ambiguous and stale-scope replies remain truthful; injected partial-write failure retries without duplicate facts |
| LC-05 | Any two lawyers can create/accept a scoped handoff, decline before acceptance, or return after acceptance via a reciprocal handoff; queue/owner transitions and retries preserve unrelated or newer assignments |
| LC-06 | Whole-matter handoff updates canonical legal owner and participants; older pending transfer conflicts after reassignment |
| LC-07 | Switch person mid-run and during unsent input; original run/review actor stays fixed; per-person cursor/text survives; legacy single-lawyer mode works |
| LC-08 | Spec comparison shows exact prior/current passages and effect on saved earlier advice, recommendations and affected work, including a matter with no recorded decision/draft; source originals and recorded decisions are byte-identical |
| LC-09 | Formatting-only, absent prior source, extraction failure, stale comparison and no-material-effect cases show honest scope without losing useful analysis |
| LC-10 | Explicit draft update creates proposed changes in the existing editor; direct edits, declined offers, immutable finals and selected export version are preserved |
| LC-11 | Partial provider/tool/schema failure keeps useful saved output; retry does not duplicate handoffs, facts, impact results or draft proposals |
| LC-12 | Saved persona state is vault-specific; read requests do not migrate/write/mark seen; SQLite rebuild preserves authoritative records and queues |
| LC-13 | Full connected story in section 3 passes with real routes, same saved conversation and an available configured model |
| LC-14 | Final usability rubric passes across sizes and keyboard; material findings repaired and independently rechecked |

Use deterministic provider fixtures for error and race tests. Also use an available configured provider for fact-reply interpretation/reassessment, handoff brief generation and spec-impact-to-draft revision. Distinguish these evidence types. Never fabricate legal authority or claim live external research when only supplied sources were used. If credentials are unavailable, finish all independent work and report the exact blocked live checks; do not relabel fixtures as live success.

Protect the repository vault and selected user vault with baseline/final content manifests. Do not print secrets. Use copied vaults and unused explicit ports; preserve existing servers and selection pointers. Restore the normal frontend build after any temporary API override. Stop only servers created by this run. Keep failed attempts in evidence. No external messages or real notifications are sent by this build.

## 12. Parked backlog and completion report

All four approved areas and the final usability pass are scheduled in this execution. Park only: real authentication/SSO/permissions and concurrent editing (after the local team workflow needs real independent sessions); Slack/email connectors and automatic reminders (after copy/paste is a concrete bottleneck); auto-routing and organization charts (after manual assignment fails); broad cross-matter impact graphs (after scoped comparison misses a demonstrated need); extra legal modules (a separate scope); the earlier optional prior-advice comparison and publication-review ideas (not part of this request).

No new generic agent framework, second conversation, completeness score, legal-answer verifier, autonomous decision, hidden send, or decorative-only redesign. Do not use the parked list to cut an approved area.

Final report leads with what works across all four areas. Link the plan, contract, usability findings and verification record. State actual models/efforts, escalations, accepted packages, tests, configured-model versus fixture evidence, browser observations, protected-vault results and remaining limits. A successful component or passed build alone is not completion. Leave the app runnable and do not commit or deploy.
