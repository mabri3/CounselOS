# Single-lawyer workspace contract

Package A contract, 2026-09-04. Python definitions are in `backend/app/models/workspace.py`; matching browser records and every package's component props are in `frontend/lib/workspaceTypes.ts`. Routes are integrated by I0/I. The browser transport in `workspaceApi.ts` reuses `api.ts:request<T>`.

## Canonical records and revision rules

`WorkspaceService(vault, matters, dossiers=None, records=None)` composes DossierService and MatterRecordService. All paths resolve through VaultService within the selected matter. No new fact ledger, chat session or artifact store exists.

`business_question(matter_id)` reads ONLY the `Decision question` section of `dossier.md`. Identity/ownership metadata is `business_question` in that file. The question revision is an opaque generation ID plus the SHA-256 of its actual visible section text. Direct Markdown edits therefore change the revision before any reconciliation; no GET writes. Unmodified legacy questions have `legacy_unknown` origin. The deterministic matter-bound legacy ID remains stable on the first explicit write. `original_request` remains in the existing request record and is never rewritten.

`change_business_question(matter_id, QuestionCommand, origin='explicit_lawyer')` applies the narrow section edit after the expected question revision check. Optional `expected_dossier_revision` checks the whole dossier. `origin='provisional_agent'` is allowed only when the question is empty. An explicit lawyer instruction invokes this same operation without a second confirmation. `propose_business_question` saves a specific pending proposal; it never applies it. `act_on_proposal(matter_id, proposal_id, ProposalAction)` applies or rejects it. Apply checks BOTH proposal base question and current command revision and changes only the question section. Rejection remains durable. Other pending proposals become superseded on a question change. `restore_business_question(matter_id, QuestionRestore)` restores one history entry as a new revision. It does not delete history or touch work product/decisions.

`question_history` reads immutable full dossier snapshots in `dossier-revisions/BQ-*.md` through references in `question_history` metadata, then includes the live current question. Historical snapshots are never a second current-text store. A snapshot written before an interrupted command is harmless; question text, history reference and successful receipt commit together by one atomic dossier replacement. Unknown dossier metadata survives all A writers.

Background `DossierService.propose_update` and `apply_revision` preserve any existing nonempty question, including legacy text. Changes to lawyer-owned scope preserve its current summary when proposed orientation belongs to different question text. `update_orientation(..., expected_question_revision=...)` saves old-scope results as historical when the queue-time scope no longer matches. I0/I MUST freeze the business question in `chat_runs.start` and pass that revision on publication. This supplements existing expected_dossier_hash. It does not discard useful output.

`WorkspaceConflict` is a ValueError with `.detail = {code, message, current_revision, recoverable:true}`. I maps it to HTTP 409, invalid targets to 422, missing records to 404 as applicable, and persistence failure to truthful not_saved receipts while retaining useful assistant output.

## Receipts and retry

Every question mutation needs a stable source_action_key from the original message/tool action. The same key and payload return the original receipt. Reusing that key for a different command gives `action_key_conflict`. Keys must survive reconnect/retry. Do not generate a fresh key merely because transport failed.

A receipt has source message/run, operation, target, before/after revisions, changed_links, completed_parts and optional failure_detail. `applied` means durable mutation; `proposed` means a saved proposal; `not_saved` means the requested operation is incomplete. It never means a decision was recorded. Receipts are metadata beside the operation's existing durable record, not an event bus.

`save_question(matter_id, WorkspaceQuestion, expected_revision=None)` creates or revision-checks a supporting question in `workspace.md`. B reuses its ID for the same issue/question and scope. `answer_question(matter_id, question_id, SupportingQuestionCommand)` persists answered/left_open. An answer composes existing `MatterRecordService.apply_update` under a deterministic action key, creates a reported fact linked to the source message, then commits the supporting-question link and receipt. A failure after fact save returns `not_saved` with `completed_parts=['reported_fact']` and its file link. Retrying resumes the existing fact action. No issue is automatically resolved. Leave open creates no fact. Ambiguous prose is resolved by the real assistant before invoking this command.

## Issue identity and C's seam

`issues(matter_id)` returns IssueNode list; `issues_revision(matter_id)` returns opaque full-document revision. Legacy duplicate labels remain distinct through occurrence-specific IDs. `save_issues(matter_id, nodes, expected_revision=...)` supports explicit rename/reorder/parent/state with the complete existing ID set. `update_issue(matter_id, issue_id, changes, expected_revision=...)` is the narrow wrapper.

First explicit write adds `<!-- issue:ISS-{matter-digest}-{id} -->` at the end of each original list line and `issue_nodes` metadata. It retains all non-list prose and unknown metadata. IDs survive rename/reorder and partial metadata; direct edits remain readable. Cross-matter IDs, duplicate IDs, missing parents and cycles reject on write. Read projection tolerates malformed/missing parent metadata. C MUST strip only this trailing marker when reading legacy issue labels and preserve markers/metadata on intake/reconciliation. C can compose A's issues/save_issues; do not deduplicate by label or replace issues.md wholesale. New issue append behavior belongs to C and must mint a matter-prefixed ID or leave an unmarked list line for A's projection.

Issue editing uses the shared `IssueUpdateCallback = (issueId: string, command: IssueUpdate) => Promise<IssueNode[]>`. Both `UnderstandPanelProps.onIssueUpdate` and `IssueNavigatorProps.onIssueUpdate` use this exact callback. Understand passes `snapshot.issues_revision` to `IssueNavigatorProps.issuesRevision`. Each save includes that revision as `IssueUpdate.expected_revision`; omit unchanged fields and use `parent_issue_id: null` only to clear a parent. The response contains the saved issue nodes.

E renders editable titles, parent links and the lawyer states **Open / Explored / Set aside** (`open / explored / set_aside`). It keeps unsaved input on failure and shows saved state only after the callback succeeds. I binds the callback to `updateWorkspaceIssue`, then reloads the workspace so both nodes and the next `issues_revision` are current before another edit. A conflict keeps local input and offers refresh/retry; it must not silently overwrite newer nodes. These callback/revision props are optional only for additive compatibility during I0 assembly. With no callback or revision, the component is read-only. E/I must wire them for the final editable journey; selection alone does not save a state change.

## Snapshot, context and recap

`get(matter_id)` returns WorkspaceSnapshot plus `issues_revision` and full `question_changes`. `source_revisions` hashes current Markdown records, not SQLite. B may store saved `snapshot` and `context_selection` in workspace.md by preserving other metadata. Saved snapshots carry their source_revisions and run_id; display stale when current source revisions differ. A projects prose from the dossier when no structured answer exists.

`recap(matter_id)` compares `local_seen` source hashes and output revision hashes to current data. It discovers work_product/research record metadata anywhere under the matter, including configured output folders. `new_outputs` includes both new and changed saved outputs. `mark_seen(matter_id, expected_revision=...)` stores the local cursor in workspace.md separately from legal records. GET never acknowledges unseen changes. The cursor is reload safe and deterministic.

ContextSelection represents next inquiry selection. RunContextManifest is immutable per submitted run and records included/truncated/omitted/unavailable, reason, actual version and tool-read evidence. Available/uploaded/selected never implies included, read or verified. FileUploadBatch provides individual saved/partial/failed outcomes. Same-name files need unique preserved originals. A batch failure cannot hide prior saved files. B/G own actual file and manifest projection.

`ChangeRecap.output_read_failures` is a default-empty list of `OutputReadFailure {path, state: 'unavailable', message}`. Expected read/parse failures from optional files appear here; they are not new-output events. E shows a concise optional-file warning with the affected file while keeping the saved question, answer and usable outputs visible. A missing field in older responses means an empty list. Do not replace useful saved work with a full-panel error. A temporary read failure must not make a previously seen version appear new when reading succeeds again.

All B/C/D writers of workspace.md must use `from app.services.dossier import serialized` on synchronous read/check/write methods, or `with WORKSPACE_LOCK:` from that module. Read the current file INSIDE the lock, preserve unknown/current metadata, and perform expected revision checks for user edits. Do not hold this lock across model/network awaits. A's dossier and workspace operations share this same process-wide reentrant lock. This prevents snapshot/context/link saves from replacing concurrent supporting answers or the local seen cursor. Atomic file replacement alone does not protect a read/modify/write operation.

A late run's source baseline must be checked inside the publication lock. Keep useful old-scope output as its existing run/research artifact and a historical snapshot reference; do not replace workspace.md's current snapshot with it. B/I own this publication wiring. No new event bus is needed.

The constrained SourceActionKey is repeated locally in workspace.py's model module (same minimum/maximum/pattern as api.py) to keep api.py free to import workspace models without a circular dependency. Changes to that constraint must update both aliases.

## Targets, drafts and editor ownership

`validate_target(matter_id, ConversationTarget, mutation=False)` verifies matter IDs, question ID, issue/source/scenario links and artifact paths. Mutation checks question revision when supplied and requires saved artifact revision. The artifact revision is `DossierService._hash(document['content'])`, using VaultService.read_document content. Review metadata initialization does not change this content hash. J must retain existing review generation checks in addition when applying proposals.

SelectedRange uses Unicode code-point start/end offsets, exact text and optional prefix/suffix; I converts browser UTF-16 offsets before transport. The target is frozen with the submitted message/run. Changing UI selection never redirects in-flight work. Stale range/hash gives recoverable conflict. Ambiguous “this” with two candidate artifacts requires one target question. local_draft_snapshot is explicitly supplied editor text and is not canonical saved content.

DraftRequest carries target, source_action_key, question revision, instruction, optional audience/purpose/preferences, selected output type and frozen TemplateUse. Return the existing run ID and WorkProductReference/proposal; do not build a separate chat/draft endpoint or pipeline. J implements save/review/export through existing work product services. UpdateOffer and VersionChange preserve offered/accepted/declined/stale, reasons, trigger facts/sources and before/after versions. No fact update automatically rewrites a draft. Decisions remain separate explicit existing actions.

`WorkspaceEditorBridge` and `LocalEditorSnapshot` specify path/content/base_revision/dirty/selected_range callbacks. refreshSignal must refresh saved metadata without clearing dirty editor content. DocumentPanel stays the editor owner; I wires these callbacks. `ConversationDockProps.children` slots ONE mounted ChatPanel. `DraftWorkspaceProps` supplies understand/conversation/editor slots; view switches must preserve those mounted owners, composer text, selected target, scroll and local edits. K owns layout only.

## Scenario capabilities and C/I boundary

Scenario baseline includes question, facts and source revisions. Save/read/list scenario and flow records only within the resolved matter. A scenario is historical analysis, never an actual fact or MatterUpdateCard.

For scenario analysis, I's runner MUST start with the exact current registry allow-list `list_files`, `read_file`, `search_vault`. Do not allow `run_research`: its current handler creates canonical research-run records. Read-only external research may be supplied by B before/within generation only through an explicitly read-only capability. Persist resulting scenario analysis through C's scoped scenario service, not a generic model file-write tool. New tool aliases are denied unless explicitly reviewed as read-only. Exclude write_file, update_file, save_fact, update_matter, intake, question mutations, decision, recommendation, work-product mutation, schedule/watch creation and any generic file mutation aliases. Do not rely on a prompt or a model-supplied hypothetical flag. The executor validates capability again, even for hand-written tool calls. Context remains scenario-labeled.

Selective adoption is a SEPARATE canonical fact-correction command, bound to an explicit user message/action and selected change IDs. Check current expected fact/source revisions; create reported/superseding facts through MatterRecordService, then link adopted_fact_ids to the saved scenario. No wholesale scenario-to-matter apply. The scenario's baseline and analysis remain historical. C owns the service boundary; I owns real runner enforcement.

## Output template contract and D ownership

OutputTemplate extends existing skill projection with kind=output_template. template_id and skill_id identify the same stable skill. Store active Markdown under 00_System/skills and immutable revisions in its dedicated subfolder ignored by the flat loader. Preserve unknown fields. Edits need expected revision; create, duplicate, rename, save and select vault-local default are explicit actions. An output_type is a string so custom outputs remain possible. Exactly one effective enabled default per type: explicit vault default first, then missing-only shipped starter. Never overwrite a customized starter on upgrade. Missing/disabled/ambiguous selections are visible; do not silently swap a selected template.

TemplateUse freezes template ID, output_type, revision, content_hash, revision_path, instructions_snapshot, section_outline_snapshot, defaults_snapshot and overrides AT SUBMISSION. Hash covers the complete effective template instruction/default/outline payload. Revisions are opaque strings; generation never looks up latest content at completion. Run overrides beat defaults for that run only. Failed template parsing sets failed/unavailable with failure_detail and retains useful generated output without claiming template application.

`TemplatePreviewCallback(template, overrides): Promise<DraftResult>` is shared by H/K. I/J capture the full selected snapshot and send DraftRequest.preview=true through the real generation path. The result is a clearly labeled editable preview artifact; it does not overwrite an existing draft. Keeping it as normal work product is explicit. Preview does not approve legal content, change facts or send anything.

D exclusively owns these starter sources:
- backend/app/blank_vault_template/00_System/skills/output-regulatory-memorandum.md
- backend/app/blank_vault_template/00_System/skills/output-short-business-email.md
- backend/app/blank_vault_template/00_System/skills/output-contract-clause-revision.md
- backend/app/blank_vault_template/00_System/skills/output-transaction-checklist.md
- backend/app/blank_vault_template/00_System/skills/output-outside-counsel-brief.md
- backend/app/blank_vault_template/00_System/skills/output-business-decision-brief.md
- backend/app/blank_vault_template/00_System/skills/output-fact-confirmation-request.md
- backend/app/blank_vault_template/00_System/skills/output-implementation-requirements.md
- backend/app/blank_vault_template/00_System/skills/output-meeting-preparation-brief.md
- backend/app/blank_vault_template/00_System/skills/output-change-impact-note.md
- backend/app/blank_vault_template/00_System/skills/output-decision-record.md

I alone owns manifest and initialization/upgrade wiring. D supplies missing-only installer and existing-registry CRUD. H's component contract is in workspaceTypes.ts; no shared editor ownership transfer is implied.

OutsideCounselPacket projects cover email, brief and outgoing attachments. Every attachment has title/path/revision/relevance, selection, reviewed_revision and individual export result. Internal context selection is separate from outgoing attachment selection. Review/export original selected versions through existing download/export support. Exported is not sent; failed export retains all drafts. Output template text is declarative and cannot execute code or override record integrity.

## Integration route map and fixtures

Prefix `/api/matters/{matter_id}/workspace`:

| Method/path | Request | Response / service |
| --- | --- | --- |
| GET / | none | WorkspaceSnapshot / get |
| PATCH /business-question | QuestionCommand | InteractionReceipt / change_business_question |
| POST /business-question/proposals | QuestionCommand | InteractionReceipt / propose_business_question |
| PATCH /business-question/proposals/{id} | ProposalAction | InteractionReceipt / act_on_proposal |
| GET /business-question/history | none | BusinessQuestion[] / question_history |
| POST /business-question/restore | QuestionRestore | InteractionReceipt / restore_business_question |
| PATCH /issues/{id} | IssueUpdate | IssueNode[] / update_issue |
| PATCH /questions/{id} | SupportingQuestionCommand | InteractionReceipt / answer_question |
| POST /actions | WorkspaceActionRequest | existing run ID / B |
| PUT /context | selections, expected_revision | ContextSelection[] / B |
| POST /seen | expected_revision | ChangeRecap / mark_seen |
| GET/POST /scenarios; GET /scenarios/{id} | C's scenario request | Scenario(s) / C |
| POST /fact-corrections | fact_id, replacement, expected_revision, source_action_key, source_message_id, optional scenario/change IDs | canonical fact receipt / C |
| GET/PATCH /flow | flow, expected_revision | Flow / C |
| GET /prior-work | query | candidates / D |
| POST /practice-note-drafts, /assumption-watches | existing skill/watch fields | existing records / D |

I registers all routes using leased get_context. The chat tool boundary uses the same QuestionCommand, ProposalAction, QuestionRestore and SupportingQuestionCommand methods. Tool names proposed for registry seeds: change_business_question, propose_business_question, act_on_question_proposal, restore_business_question, answer_workspace_question. Explicit-vs-proposed authority is established from the user message by I0's assistant/tool boundary, never by a model-supplied confirmed boolean alone.

Representative success fixture: `{state:'applied', operation:'change_business_question', before_revision:'old', after_revision:'new', completed_parts:['business_question'], changed_links:['03_Matters/example/dossier.md']}` plus required receipt identity/target fields.

Conflict fixture (409): `{detail:{code:'revision_conflict', message:'This record changed. Refresh before applying your edit.', current_revision:'new', recoverable:true}}`.

Retry misuse fixture (409): `{detail:{code:'action_key_conflict', message:'This action key was already used for a different request.', current_revision:'new', recoverable:true}}`.

Partial answer fixture: `{state:'not_saved', operation:'answer_question', completed_parts:['reported_fact'], changed_links:['03_Matters/example/facts.md'], failure_detail:'disk write failed'}` plus receipt identity/target/revisions. UI says “Fact saved. Question update not saved.” Retrying uses the identical key/payload.

Mixed upload fixture: `{destination:'inquiry',outcomes:[{name:'terms.pdf',state:'saved',file:{path:'.../terms-unique.pdf',extraction_state:'complete',selected:true},retry_key:'batch:file1'},{name:'bad.xyz',state:'failed',failure_detail:'Unsupported format',retry_key:'batch:file2'}]}`. G fills required file fields; previously selected files and composer text remain.

Manifest fixture: `{reference_id:'SRC-1',role:'supplied',selected:false,state:'omitted',reason:'Excluded from this inquiry',tool_read_evidence:[]}`. Do not claim this if derived content from that source is still included elsewhere; B discloses/rebuilds bounded context.

All exact Python/TypeScript service schemas are authoritative over abbreviated fixtures. Services tests do not prove Q1–Q7 browser/chat journeys. I0/I run the actual endpoint/runner, then assembled browser and live-model checks.

### Review-state revision bridge

J exposes `WorkProductService.reference().review_revision`. `DocumentReviewService.get()` returns `revision` for the full review state and `artifact_revision` for saved content. These are separate because accepting changes or editing comments can change review state without changing the visible content hash.

`ConversationTarget.artifact_review_revision`, `WorkProductReference.review_revision`, and `LocalEditorSnapshot.review_revision` carry this state. I captures both content and review revisions at submission and passes `expected_revision` and `expected_review_revision` to J's mutation methods. K preserves both with the selected editor target. Existing `artifact_revision` and `base_revision` retain their content-hash meaning. The new fields are optional for legacy callers; assembled draft mutation paths must supply them.

For a selected range, revision content is the replacement for that range only. A dirty local snapshot remains separate from canonical saved text. If J returns a conflict with `proposal_path`, I/K expose that useful saved proposal and a refresh/rebase or copy path without replacing the lawyer's editor text.

### E reading surface and J draft projection additions

UnderstandPanelProps optionally accepts questionHistory, onQuestionHistory, onQuestionRestore, materialFacts, businessContext and sourceActions (path or ClaimEvidence). These are projections of existing history, matter records and evidence. I must supply them in the assembled workspace; optional props preserve interim compatibility only. History restores use the existing revision-checked QuestionRestore command. WorkProductReference adds preview and proposal_paths from J list_drafts; proposals remain recoverable after reopen.

### F explicit fact actions

ScenarioPanelProps adds optional facts and onCorrectFact({factId,replacement,expectedRevisions,sourceActionKey}). BusinessFlowProps adds currentRevisions, proposedFactChanges and onAcceptFactChanges(changeIds,expectedRevisions,sourceActionKey). I must wire canonical corrections and explicit flow acceptance separately from scenario/flow save and analysis. These commands use C's revision-checked services with server-bound user authority and normalize durable action outcomes to InteractionReceipt. Pending UI compatibility does not make these actions optional in the completed build.

Scenario onAnalyze also receives a third sourceActionKey argument; I forwards it unchanged on same-payload retries to the existing run service.

UnderstandPanelProps.onMarkSeen delegates the composed recap action to the existing markWorkspaceSeen command; I supplies it in the assembled workspace.

F recovery additions: ScenarioPanelProps.onOpenArtifact opens saved internal source links; BusinessFlowProps.onRefresh fetches current flow without discarding local edits. A rebase is an explicit user choice, never an automatic stale-revision advance.

H label projections: practice-note name; watch title/state/assumption_labels/decision_titles; AssumptionWatchPanelProps.assumptions supplies canonical assumption_id/text choices. I resolves these from existing records. Primary UI selects meaningful named assumptions, not manually typed internal IDs.

H template preview result panels accept onOpenArtifact for an actual returned saved preview. Queued/running results say Preparing; no created/saved claim until artifact persistence. Unsaved reusable edits must not reuse an old template hash; save first or negotiate an actual frozen ephemeral snapshot. Run-only overrides remain separate.

H availability/prior-work projections add OutputTemplate.status/failure_detail and PriorWorkCandidate.date/status/kind/snippet, matching D existing service outputs. I preserves these fields and never invents unknown dates or hides a malformed template.

### K current target and explicit draft actions

DraftWorkspaceProps adds target and businessQuestionRevision plus onKeepPreview, onUpdateOfferAction(artifact,accept|decline), and onResolveDraftConflict(retain_copy|open_current|rebase,artifact). All action callbacks return Promise<void> for truthful busy/failure presentation. I binds current scope, J explicit Keep, B/J update-offer acceptance or decline and existing editor recovery. K never fabricates a missing question revision or treats failed resolution as saved. Optional callbacks preserve interim compatibility, not final omission.

G upload outcome bridge: MatterFilesPanelProps.onUpload returns FileUploadBatch | void (void retains old callers). I returns the actual per-file upload outcomes, including unsupported files with no saved library record. G renders each result without treating HTTP success as all-files-saved; exact failed batch remains retryable.
