# Lawyer continuity contract

Package A. Date: 2026-09-05. Status: independently accepted after retry-identity repair. Integration in progress.

This document freezes the additive seams for packages B–H. Python wire models are in `backend/app/models/continuity.py`; their TypeScript counterparts and component props are in `frontend/lib/continuityTypes.ts`. These are contracts, not a claim that routes are connected. The payoff is the connected story in handoff-plan section 3. No second conversation, fact ledger, ownership store, runner, or draft editor is introduced.

## 1. Current callers and decisions

`WorkspaceService.questions/save_question/answer_question` own supporting-question identity. `MatterRecordService.apply_update` owns facts, source links, supersession and deterministic action lookup. `WorkspaceActionsService.reassess_changed_facts`, `offer_update` and `decline_offer` already exist. `ChatRunService.start` owns saved conversations and runs. `WorkspaceService.get` uses only `workspace.md.snapshot.short_answer`; the coordinator's isolated baseline found ten legacy matters with empty snapshots but saved conversation history. B must therefore accept a saved-advice fallback with a real path and keep its source label visible.

`MatterWorkItemService.assign` currently uses a free-text owner and index lookup. `MatterParticipantService.list/add` currently projects only name/role. `SettingsService.write` currently reconstructs metadata. `WorkspaceService.source_revisions` hashes much of matter metadata. These are known I changes, not capabilities leaf workers may assume already exist.

The coordinator reproduced a historical manifest 404 at `/workspace/context/RUN-20260904-614612` for a copied old matter. This is missing historical context, not proof that the saved answer was lost. Keep the conversation advice visible and provide a local context recovery message. No backend deadlock was established.

Use authoritative Markdown reads for the small team queue. Do not add owner-ID SQL columns or change the index schema. The existing SQLite rebuild remains a projection, never an owner or request authority. Existing methods and HTTP responses remain compatible; new response fields are additive.

## 2. Identity, request context and freshness

- Settings keys are exactly `continuity.demo_enabled` (boolean, absent means false) and `continuity.people` (list of `DemoPerson`). Explicit configuration supplies unique stable IDs and nonblank display names. Duplicate display names are allowed; controls disambiguate with ID. Optional specialty has no behavior. Disabled mode does not create a roster on read.
- `WorkspaceTeamService.roster()` returns `DemoRoster`. `vault_key` is `digest(str(vault.resolve("")))[:24]`, an opaque local namespace, never a saved selection pointer. `revision` hashes only the two roster values. Reads do not migrate or seed. Roster writes merge the latest settings values, body and unrelated frontmatter under `WORKSPACE_LOCK`.
- GET and mutation requests may carry `X-Themis-Person-Id`. GET and **first submissions only** resolve it against the selected vault's current roster. Mutations first perform the exact durable-operation lookup below, before validating the header against the roster. For a first submission with demo enabled, absent means the first configured person; an unknown ID is 422. With demo disabled, absent means `ActionActor(person_id="local-lawyer", display_name=<nonblank matters.default_owner or "Unattributed lawyer">, mode="single")`; a supplied demo ID is rejected. An unknown header without a matching durable operation remains 422. The mode is a local simulation, not authentication or private access.
- The route obtains the saved actor for a matched retry, or resolves a current actor for a first submission, then passes `actor=ActionActor` to the service. Mutation bodies cannot set it. I adds trusted `action_actor` to the internal ChatRequest/run/context/history/review flow and clears any client-supplied value before assigning it. Generated text, tool arguments, `review_author` and `lawyer_author` cannot replace the actor. Generated document wording still belongs to Themis.ai; the human requester is separate provenance.
- First submission freezes actor, target, original command, source-action key and fingerprint in the durable operation/run. Retrying an existing key with the identical command resumes that operation with its original actor and target, even after a view switch. Changed command/target with the same key is 409 `action_key_conflict`. Never reread the current selected person to finish/retry an operation. A new intended action gets a new key. A renamed/removed roster entry cannot rewrite historical actors or prevent recovery of a previously valid action.
- Local keys are `themis.continuity.v1:<vault_key>:<person_id>:<matter_id>:<slot>` (encode each variable with `encodeURIComponent`). Slots include view, composer, target, selection, editor-recovery, fact-request-drafts, handoff-drafts, impact-drafts. The selected person itself uses `themis.continuity.v1:<vault_key>:person` in sessionStorage so browser contexts can differ. Save the old person's dirty editor recovery before switching; do not write it as the new person's edit. Saved conversation ID is shared and is not person-scoped.
- Per-person seen state lives in `workspace.md` metadata `continuity_seen[person_id]` as `PersonViewState`. Single mode reads/writes legacy `local_seen` only. Demo users never inherit `local_seen`. GET does not mark seen. Mark seen validates the displayed recap revision before merging that one cursor. First visit means no cursor, not that all files just changed.
- Distinguish legal-content freshness from operational revisions. Seen state, roster, UI preferences, request journals, receipts, handoff status, actor attribution and assignment-only metadata must not stale legal answers, scenarios or comparisons. I excludes `continuity_seen`, `continuity_requests`, `continuity_operations`, `local_seen`, ownership/assignment and timestamp-only fields from legal-content hashes. For `matter.md`, exclude `owner`, `legal_owner`, `owner_id`, `legal_owner_id`, `ownership_revision`, `ownership_action_key`, `assigned_by`, `assigned_at`, `updated_at`, `updated_by` and actor fields. Preserve actual content/question/facts/assumptions/source/recommendation changes. Ownership and packet checks use their own revision tokens. Do not exclude an entire source merely to suppress a warning.

### Exact I route protocol for retry identity

I implements these two helpers in the already leased `backend/app/routers/workspace.py`; other leased mutation routers import them. They are internal helpers, not public endpoints or client-supplied callbacks:

```python
def find_continuity_operation(context, matter_id: str, *, operation: str,
                              source_action_key: str) -> dict | None: ...

def resolve_continuity_actor(context, matter_id: str, *, operation: str,
                             source_action_key: str, command: dict,
                             target: dict, person_id: str | None) -> ActionActor: ...
```

`find_continuity_operation` reads only the selected context's vault and the supplied matter. Its return shape is `{operation, source_action_key, command, target, actor, fingerprint, record_path}` from an existing authoritative journal/run. It must not accept a client record_path, use another matter's key, scan another vault or construct a saved actor from the current roster. Absent record returns None; unreadable/malformed matched records report their actual failure and must not fall through to a new submission.

The fixed lookup mapping is: `fact_request.create/edit/act/save_reply/record_reply` → workspace.md.continuity_operations; `handoff.create/act` → the matter's handoff records and their operations journals; `impact.prepare/prepare_update` → the matter's impact preparation/update operation metadata; `chat.start` → that matter's conversations/runs records with their saved request; `document_review.apply` → saved document-review operation receipts within that matter. The lookup is by operation/key, not by the client's proposed target path; this permits detection of a changed target on retry. The route sets operation from this mapping; model/body values cannot select it. The route target includes matter_id and every relevant request_id, reply_id, handoff_id, comparison_id, document path or submitted conversation target. Source keys are namespaced by operation and selected vault/matter; a different operation is not a replay of the same key. I persists original normalized command/target and the actor before any consequential subwrite, including review actions, so each mapping has a durable first-submission record.

`resolve_continuity_actor` first calls that lookup. If found, it compares the validated submitted command and target with the saved command/target and fingerprint (`digest({operation, command, target})`). Apply the same model defaults for both sides; do not include the header or a client author field. Any changed command, missing required target or changed target is 409 action_key_conflict **before** roster lookup. An exact match returns the saved actor, including the saved mode/name, without a current roster membership check. This applies both to a removed original ID and to a different valid viewer retrying the operation. If no match exists, call `context.workspace_team.resolve_actor(person_id)` and perform normal first-submission recipient/scope checks before journaling. This is a narrow replay rule, not a general header-validation bypass. GET, Mark seen without a replay key, and all unmatched new submissions continue to require the current viewer.

For the existing `/chat-runs/{run_id}/retry` route, first load that exact run from the selected vault/matter, verify the path run_id matches its durable record, then reuse its saved source_action_key, operation, command, target and actor. No replacement command is accepted on this endpoint. Call ChatRunService.retry with the saved run; it must not re-resolve the header. A legacy run without saved human identity keeps an explicit unknown historical actor; it must never gain the current viewer's name. `ChatRunService.start`'s existing key lookup (currently line 45) and `retry`'s existing saved-run load (currently line 137) must preserve this order when I adds actor transport. The route must not perform a roster dependency check before either lookup.

Leaf retry handlers also look up and validate their operation before first-submission actor/recipient checks. They replay using the journal actor even if called directly by a service, not only through HTTP. They still enforce the saved operation's recovery conditions: a newer ownership token, changed question or changed source can conflict. A matched retry never authorizes a fresh transfer or a different target. Tests must cover a removed original ID, a different valid current viewer, an unknown unmatched header, changed target with the same key, and the same key in another matter/vault.

## 3. Storage and shared write rule

All paths below are beneath `matters.matter_path(matter_id)` and validated through `VaultService.resolve`. User IDs, filenames and action keys are never concatenated into a path without validation; IDs made from action keys use `digest([matter_id, operation, source_action_key])[:24]`.

| Record | Exact location and authority |
| --- | --- |
| Request | `workspace.md` metadata `continuity_requests`, list of `FactRequest` storage records. The question remains in `questions`, the fact remains in `facts.md`. |
| Request operation journal | `workspace.md` metadata `continuity_operations`, list of `{source_action_key, operation, fingerprint, command, actor, target, completed_parts, receipt}`. Record the immutable command before the first consequential subwrite. Private storage extensions need not enter wire models. |
| Supplied reply | `continuity/replies/RPL-<digest>.md`, immutable body containing the exact pasted text, metadata includes source ID, actor, reported speaker/date, request/question snapshot and text hash. The request's reply projection can acquire fact links; the supplied reply file never changes. |
| Handoff | `continuity/handoffs/HOF-<digest>.md`, current handoff state plus immutable initial packet, `operations` journal and receipt history. Scope owner fields are snapshots, never current ownership authority. |
| Immutable references | `continuity/snapshots/REF-<digest>.md`, exact frozen text and original path/version/hash/lineage. If file exists, compare bytes/content before reuse; never overwrite a different snapshot. |
| Comparison | `continuity/impacts/CMP-<digest>.md`, `record_type: workspace_impact`, frozen input metadata and saved generated prose body. This is analysis history, not a mutable draft or decision. |
| Owner | Canonical `matter.md.legal_owner_id` plus compatible `legal_owner`, or selected work-item file `owner_id` plus compatible `owner`. |

Every writer of `workspace.md` must use the existing `app.services.dossier.serialized` / `WORKSPACE_LOCK` around a fresh read, revision check, narrow merge and write. Never write an older metadata dictionary after a nested service wrote the file. C/D use this lock now; I audits all old writers, including publication and receipts. The same lock covers owner check/commit and all direct ownership writers. Never hold it over model/network calls. Atomic file replacement is not a cross-file transaction.

Use existing `WorkspaceConflict` for 409 errors, with `revision_conflict`, `action_key_conflict`, `ownership_conflict`, or `source_conflict`. Missing matter-local IDs are 404; invalid input is 422. Partial writes return a result with `InteractionReceipt.state="not_saved"`, exact `completed_parts`, links and failure detail. Do not erase a successful canonical write to make the UI simpler. If nothing could persist, retain input and return the failed operation clearly; GET does not attempt repair.

## 4. B: read-only orientation

Implement in `workspace_orientation.py`:

```python
class WorkspaceOrientationService:
    def __init__(self, vault, matters, workspace): ...
    def get(self, matter_id: str, *, actor: ActionActor,
            requests: list[dict] = (), team_items: list[dict] = (),
            seen: dict | None = None) -> dict: ...  # Orientation
    @staticmethod
    def derive(*, snapshot: dict, matter: dict, work_items: list[dict],
               actor: ActionActor, requests: list[dict] = (),
               team_items: list[dict] = (), seen: dict | None = None,
               saved_advice: dict | None = None,
               warnings: list[str] = ()) -> dict: ...  # Orientation
```

The dicts are actual current `workspace.get`, `matters.get` and authoritative work-item metadata shapes. `saved_advice` is `{text, path, revision, label}` from a real saved inquiry, assistant message, or working recommendation. `get` may read those existing records when the snapshot answer is blank; it may not ask a model or write. Prefer current snapshot, then current working recommendation, then latest saved useful inquiry/assistant answer. Do not mistake tool progress/error text for advice. Keep the earlier-source label/path and uncertainty if its question basis is unknown. The `answer` field contains the full selected saved text; previews may not discard caveats. Use `warnings` for local load recovery, never erase a useful answer.

Use one `Orientation.primary_action` for Today and matter. It has a concrete `WorkTarget` and truthful owner. Resolve required outstanding work after delivery to its work-item ID before generic close. Incoming recipient handoff can target that handoff; an open real fact request can yield Waiting on its named contact, while Discuss/Draft stay available. Active run is agent work with its run ID. Unknown owner stays null, never inferred from the viewer. Keep existing lifecycle prerequisites; do not manufacture legal uncertainty tasks. `secondary_actions` has at most two default entries. Closed means no required action, not a fake completion button.

Changes use receipts or saved prior/current text. Hash-only evidence must say, for example, “Facts changed; earlier text is unavailable.” First-visit material is labelled first visit. No raw path title, inferred semantic diff or read-side seen update. `current_revision` is the recap revision expected by Mark seen, not the legal basis hash.

## 5. C: fact requests and replies

Implement in `fact_requests.py`. Commands are the exact Pydantic models above; methods accept a model or its JSON dict and return JSON dictionaries matching their declared model.

```python
class FactRequestService:
    def __init__(self, vault, matters, workspace, records): ...
    def list(self, matter_id: str) -> list[dict]: ...
    def get(self, matter_id: str, request_id: str) -> dict: ...
    def create(self, matter_id: str, command: FactRequestCommand | dict,
               *, actor: ActionActor) -> dict: ...  # FactRequestResult
    def edit(self, matter_id: str, request_id: str, command: FactRequestEdit | dict,
             *, actor: ActionActor) -> dict: ...
    def act(self, matter_id: str, request_id: str, command: FactRequestAction | dict,
            *, actor: ActionActor) -> dict: ...
    def save_reply(self, matter_id: str, request_id: str, command: FactReplyCommand | dict,
                   *, actor: ActionActor) -> dict: ...
    def record_reply(self, matter_id: str, request_id: str, reply_id: str,
                     command: RecordReplyCommand | dict, *, actor: ActionActor) -> dict: ...
```

Create checks stable question ID/source_revision and current business-question revision; optional issue/work item must belong to the matter. Initial state is `prepared`. Copy is a browser clipboard action and changes no state. Only explicit `act(requested_externally)` sets that state and requested_at; it cannot regress a answered/partial/reply-saved record. `edit` changes a prepared request only; to change a request already used, prepare a new request. Leave open is explicit. Save reply is allowed without requested_externally and sets `reply_saved` while preserving requested_at and earlier answer links. Full recorded reply gives `answer_recorded`. Partial gives `partly_answered` and requires nonblank remaining_question; question state stays open with its original text and linked facts, and the remaining part is visible on the request. Leave open never removes facts. Later replies may continue a partial/left-open request. Record is explicit; interpretation preview alone creates no fact.

`record_reply` checks both current question source revision and business-question revision before starting any fact write. An old request can still receive an exact reply, but a stale/reframed scope cannot be marked answered. Its supplied reply remains readable. A recorded fact can link to a stale reply only through an explicit separately prepared current-scope correction, not silent reattachment. Contradiction uses `supersedes_fact_id`; validate that prior fact exists and belongs to this matter. Preserve prior fact and source.

Recovery order: journal immutable command/actor → save exact reply if applicable → canonical `records.apply_update` → current question link/state through `workspace.save_question` → freshly merged request and receipt. Fact action key is `continuity:<record source_action_key>:fact`; use existing `apply_update(... actor=actor.display_name, source_action_key=..., action_metadata={"action_actor": actor.model_dump(), "reply_id": ..., "request_id": ...})`. Source kind is file, with reply path/hash; factual text is the explicit answer_text, not an invented paraphrase. Speaker/date remain in immutable source provenance and request projection, separate from entering actor.

Before resuming, read the journal and canonical action: an already-created fact is reused even when question revision has advanced due to this same operation. If a *different* action reframed/changed the question after the fact saved, retain the fact and return a partial/conflict receipt; never overwrite the new question. Inspect canonical actions when apply_update throws after its fact save. Receipt completion parts are `reply_source`, `reported_fact`, `supporting_question`, `fact_request`; only list actual saved parts. Ordinary GET does not resume the journal.

Successful fact recording returns `ReassessmentIntent` with saved fact IDs, frozen target and deterministic `source_action_key + ":reassess"`. I uses existing `WorkspaceActionsService.reassess_changed_facts`/ChatRunService in the same conversation, freezing the original actor. Failure to start reassessment leaves facts saved. C never calls a model, creates draft revisions or records decisions. Request-only state changes do not stale the legal answer; an actual fact change does.

## 6. D: people, handoffs, queue and seen state

```python
class WorkspaceTeamService:
    def __init__(self, vault, matters, workspace, settings,
                 *, transfer_owner: OwnerTransfer): ...
    def roster(self) -> dict: ...  # DemoRoster
    def configure(self, command: DemoRosterCommand | dict) -> dict: ...
    def resolve_actor(self, person_id: str | None = None) -> ActionActor: ...
    def scope(self, matter_id: str, *, work_item_id: str | None = None) -> dict: ...
    def list_handoffs(self, matter_id: str) -> list[dict]: ...
    def create_handoff(self, matter_id: str, command: HandoffCommand | dict,
                       *, actor: ActionActor) -> dict: ...  # HandoffResult
    def act_on_handoff(self, matter_id: str, handoff_id: str,
                       command: HandoffAction | dict, *, actor: ActionActor) -> dict: ...
    def queue(self, *, actor: ActionActor, view: str = "my_work") -> list[dict]: ...
    def seen(self, matter_id: str, *, actor: ActionActor) -> dict: ...
    def mark_seen(self, matter_id: str, *, actor: ActionActor,
                  expected_revision: str) -> dict: ...  # PersonViewState
```

`OwnerTransfer` is an importable callable Protocol in continuity.py. Its exact keyword call is `transfer_owner(expected=ScopeSnapshot, recipient=DemoPerson, actor=ActionActor, source_action_key=str) -> ScopeSnapshot`. It returns the actual committed scope or raises WorkspaceConflict/OSError. D tests it with a small fixture adapter that reads and writes canonical Markdown, including partial-failure recovery; do not use a MagicMock that assumes transfer succeeded. I implements the real adapter through MatterService/owner services and HTTP race tests. This is the only new shared callable D needs; do not call imaginary MatterService methods.

Scope reads are authoritative Markdown, including when SQLite was rebuilt or is behind. Owner IDs are never inferred by matching names: legacy names project owner_name with owner_id null. Explicit assignment/handoff writes a stable ID and compatible display name. Scope ownership revision is persisted `ownership_revision` or, for untouched legacy files, `digest({owner_id, owner_name, assigned_at, ownership_action_key})`. Scope content revision covers title/body/status/target links, excluding assignment attribution/timestamps. Validate supplied path/title/scope against current scope; never trust a body-supplied path as ownership authority.

Pending creation freezes sender, recipient display, exact ask, source/target references and current scope revisions. Snapshot each selected reference with real actual text/version; reject invented or cross-matter references. The sender remains responsible until acceptance. Preview/copy/brief generation cannot create a handoff. On the **first submission** of acceptance, the resolved current actor ID must match recipient, initial owner revision must still be current, and command.expected_content_revision must match current content. Journal that validated actor/recipient/target before transfer. On a matched retry, validate the frozen command/target and use that saved actor; do not require the current header or current roster to match the historical recipient again. Recovery still checks ownership tokens so a newer assignment cannot be overwritten. If content changed, show old/current scope and let a new explicit acceptance command acknowledge the current content revision; ownership change always conflicts and needs a newly prepared handoff. Decline is recipient-only with a nonblank reason and withdraw is sender-only while pending on their first submissions; their matched replays use the saved actors by the same rule. Neither assigns/completes anything.

Acceptance recovery: journal first → adapter canonical compare-and-set → matching participant projection (matter only) → handoff accepted receipt/event → index refresh. Canonical owner write includes deterministic new ownership_revision and `ownership_action_key` from this accept. Adapter replay detects its exact saved action token and repairs missing participant/index work without assigning twice. If current ownership_action_key/revision belongs to a newer direct assignment, return ownership_conflict even if the owner display name is the same. I must make all direct assignments participate in the same lock and issue a new token; unrelated status/priority changes do not reset ownership tokens. Never undo a committed transfer after a later step fails.

Whole-matter adapter updates `matter.md.legal_owner_id/legal_owner` and the single matching legal_owner participant projection with `person_id`; it does not touch task owners. Work-item adapter updates only that item. Preserve unrelated participants, metadata and task statuses. A partial participant save is an incomplete receipt until retry repairs it; reads expose canonical owner truth without repairing it.

Return is an action on an accepted handoff by its recipient/current owner. It creates a **new reciprocal pending handoff**, sender=current actor, recipient=original sender, prior_handoff_id=accepted ID, exact current scope snapshot and editable nonblank reason/ask. Original accepted record stays accepted and links return_handoff_id. Current owner stays unchanged. Retry returns the same reciprocal ID; partial parent-link failure must discover it by deterministic key before creating anything. A second distinct pending return for the same accepted handoff is rejected. A newer assignment before return creation or acceptance conflicts. Accepting the reciprocal transfer assigns only that scope back. Complete work uses the existing task action; queue reads may show linked results, and do not require Return.

Queue transitions: pending → recipient incoming My work and sender Waiting; accepted → recipient scoped My work and sender shared result visibility; declined/withdrawn → no incoming action, original owner's work remains; reciprocal pending → original sender incoming and current owner Waiting while retaining responsibility; reciprocal accepted → original sender owns scope. Team lists shared work for all. Do not treat mere appearance in Waiting as completion or private access. Match by IDs, not specialty or duplicate name. Request waiting comes from open actual requests; integrate it in B/Today without hiding other research/drafting work.

## 7. E: supplied changes and effect on saved advice

```python
class ChangeImpactService:
    def __init__(self, vault, matters, workspace, evidence, work_products, actions): ...
    def list(self, matter_id: str) -> list[dict]: ...
    def get(self, matter_id: str, comparison_id: str) -> dict: ...
    def candidates(self, matter_id: str) -> dict: ...  # {sources: [...], targets: [...]}
    def prepare(self, matter_id: str, command: ComparisonCommand | dict,
                *, actor: ActionActor) -> dict: ...  # SpecComparison
    def run_context(self, matter_id: str, comparison_id: str) -> dict: ...
    def publish(self, matter_id: str, comparison_id: str,
                publication: ImpactPublication | dict) -> dict: ...  # SpecComparison
    def prepare_update(self, matter_id: str, comparison_id: str,
                       command: ImpactUpdateCommand | dict,
                       *, actor: ActionActor) -> dict: ...  # ImpactUpdateIntent
```

Candidate arrays contain `ReferenceSelection` fields plus optional title for UI display. Source selection is supplied file/original/extracted-companion lineage, never filename inference. `expected_revision` must match the actual source/target content revision supplied by candidates. `after.kind` and nonnull before.kind must be source. Advice/recommendation/decision/draft targets must be real saved records in this matter. Advice includes `workspace.md.snapshot` when useful and saved inquiry/assistant text; bind message/run identity and actual text, not only the conversation file's latest title. `reference_id` disambiguates multiple items in one file. Recommendations use the current or explicitly selected saved recommendation version. No fabricated decision/draft is needed when advice alone exists.

Prepare validates every selection, freezes real before/after text plus question, active fact/assumption basis and selected earlier work into immutable reference snapshots, then saves the comparison. A binary's original_hash and extraction companion hash are separate. A hash alone is never the prior text. Missing baseline permits before=null and difference=unavailable with useful current source/basis. Missing/partial extraction records its state and coverage limits; empty unavailable text does not mean a deletion. Use actual source text for passages; limit analysis to selected matter work. No cross-vault graph or external research claim.

`run_context` returns `{comparison_id, actor, target, frozen_context, instruction}`. Actor comes from saved preparation. Frozen context includes actual source, question, basis and target text; the prompt treats them as untrusted evidence. I starts `workspace_action="analyze_change_impact"` on existing ChatRunService with same conversation and source key. Model output cannot choose a new actor, target, source, original text, revision or command. No read-side model calls.

Literal `ChangedPassage` entries are derived from exact text with line locators, separate from generated `ImpactFinding` significance. Formatting-only comparison can say no material textual change; it cannot imply legal equivalence. Findings reference known target IDs/passage IDs; unknown model IDs are omitted with a coverage note while useful prose stays saved. `linked` requires actual recorded links or exact quoted target/source support; mere model assertion is `inferred`. Preserve generated uncertainty and explain potential relevance. `publish` saves useful prose even when optional structure fails, compares current legal basis and selected source/target revisions to frozen values, and labels late results stale without replacing current advice/decisions/drafts. Repeat run ID with same text is deterministic; differing output for same completed publication is a conflict. Do not label prose lost in a save failure as saved.

`prepare_update` requires an explicit selected draft/work-product target, current comparison revision, current artifact revision and current source/basis. It returns a frozen `ConversationTarget` and instruction using the saved comparison. It can compose existing `actions.offer_update` for a mutable draft, with stable offer ID, but never revise the draft itself. Reuse declined offers without reviving them. I submits the later explicit action through the existing draft/review run path. A selected immutable final returns `ImpactUpdateIntent.requires_working_copy=true`, with the original frozen target intact. I then creates a separate working draft through existing WorkProductService.create_draft, records original-final lineage and the explicit action key, and freezes that resulting target before the revision run. Retry reuses this same working copy. The comparison's original target remains historical. Never mutate or silently rebase a final. Old draft text, selected accepted wording, revision exports and final records remain intact. A decision impact is analysis only and cannot mutate the decision record.

## 8. HTTP and integration ownership

I adds these routes and matching `continuityApi.ts` methods, always using the current request's leased vault context. Prefix W means `/api/matters/{matter_id}/workspace`.

| Route | Service/callback |
| --- | --- |
| GET `/api/team`; PUT `/api/team` | roster / configure(DemoRosterCommand) |
| GET `/api/team/work?view=my_work\|waiting\|team` | queue(actor, view) |
| GET W`/orientation` | B.get with D.seen and C/D projections |
| GET W`/scope?work_item_id=...` | D.scope |
| GET/POST W`/fact-requests` | C.list/create |
| PATCH W`/fact-requests/{id}` | C.edit |
| POST W`/fact-requests/{id}/actions` | C.act |
| POST W`/fact-requests/{id}/replies` | C.save_reply |
| POST W`/fact-requests/{id}/replies/{reply_id}/record` | C.record_reply |
| POST W`/fact-requests/reassess` | saved ReassessmentIntent plus conversation_id; server verifies saved fact/request operation and actor |
| GET/POST W`/handoffs` | D.list_handoffs/create_handoff |
| POST W`/handoffs/{id}/actions` | D.act_on_handoff |
| GET W`/impact-candidates`; GET/POST W`/impacts` | E.candidates/list/prepare |
| GET W`/impacts/{id}` | E.get |
| POST W`/impacts/{id}/analyze` | ContinuityRunCommand → run_context + existing runner |
| POST W`/impacts/{id}/update-draft` | ImpactUpdateCommand plus conversation_id → prepare_update + existing runner |
| existing POST W`/seen` | D.mark_seen when demo enabled; old behavior otherwise |

Wording/brief assistance uses existing W`/actions` or chat with explicit target and same conversation; response is editable generated prose and does not submit a request/handoff. I may extend WorkspaceActionsService's action vocabulary with `prepare_handoff`; supplied request wording uses existing `ask_business`. No new declarative tools or seed files are required: **the exact planned declarative tool/seed change list is empty**. Existing runner publication dispatches comparison output server-side; new records need no model-selected mutation tool. Existing explicit draft tools remain their boundaries. Do not alter manifest or root/test/template vault files under a broad seed permission. If actual integration needs a new tool, pause that change, name exact paths and revise this contract under coordinator lease.

Missing shared seams, implemented by I (not mocked as finished): trusted actor/header transport; canonical OwnerTransfer and direct-assignment tokens; actor-aware seen route/source-hash exclusions; old workspace writer merge audit; ChatRun retry freeze/publication dispatch; actor-safe document route/review/history; real reassessment/draft callbacks and Today mounting. Leaf C/B use current real workspace/records services. D's one injected adapter is explicit. E's `run_context`/`publish` boundary does not start another runner. No new shared helper is required before B/C/D unit implementation. Real HTTP/model checks remain I work.

I needs the additional exact path `backend/app/routers/files.py` to replace request-body review actor authority with resolved actor; the coordinator must lease it before edits. All other I paths stay those in plan section 8. `app/routers/dependencies.py` need not change: resolve header locally in leased routers against context.workspace_team. Frontend identity context can live in existing leased lib/api.ts/reviewAuthor.ts; no unleased context-provider file is assumed.

## 9. F–H component contracts

Export default components named `OrientationSummary`, `FactRequestPanel`, `HandoffPanel`, `DemoLawyerSwitcher`, `TeamWorkList`, `ChangeImpactPanel` with the same-name Props interface from continuityTypes.ts. Existing F components accept additive `ContinuityUnderstandPanelProps`, `ContinuityChangeRecapProps`, `ContinuityInquiryActionsProps`; all old required callbacks still work. F changes its own import/signature only; I later mounts new props. Components never import continuityApi directly. I owns API calls, identity persistence, matter refresh, navigation, and one conversation.

`onOpenTarget` opens exactly the supplied ID/path and view; it does not perform a mutation. `onOpenEvidence` uses existing ClaimEvidence/drawer. Command callbacks resolve on an honest partial result; components inspect receipt.state/completed_parts and retain input. Rejecting a callback also retains input. Only successful durable save clears the corresponding form. Generate one action key at explicit submission and retain its full command for Retry; edits create a new logical action key. Avoid duplicate submission by busy state. Show the actor name and precise handoff scope before submit.

I supplies controlled `drafts` and `onDraftChange` under contextKey. G fields: `request.wording`, `request.person`, `request.due`, `reply.text`, `reply.speaker`, `reply.date`, `answer.text`, `answer.coverage`, `answer.remaining`, `answer.supersedes`, `handoff.recipient`, `handoff.ask`, `handoff.basis`, `handoff.questions`, `handoff.date`, `handoff.reason`. H fields: `impact.before`, `impact.after`, `impact.targets` (JSON ID array), `impact.instruction`. Prefix selected request/handoff ID where multiple simultaneous forms need separate values. Do not store full source text as an editable comparison baseline. Draft form state changes do not mutate saved records.

F shows full question by expansion, complete material caveats, current answer provenance, one primary action, at most two default shortcuts and three default recap entries. New actions are contextual callbacks beside questions/work/sources; no extra persistent rail. G says Copy, Requested externally, Reply saved, Answer recorded, Partly answered, Pending, Accepted, Declined, Withdrawn and Return work truthfully. H separates literal passages from generated significance and shows supported/inferred/unavailable findings. It offers an update only for actual draft targets. Same-specialty/no-specialty people have identical controls. All panels use shared semantic tokens, labelled native controls and keyboard focus; no local attention colors.

## 10. Contract examples and required focused proof

- Legacy snapshot has no short_answer; an assistant message has saved useful advice. Orientation returns that exact advice and path with a basis warning. No useful text anywhere gives unavailable plus a real recovery action, never a fabricated answer.
- Request asks two things. Reply answers one. Source text/actor/speaker survive reload; exactly one fact is added, request is partly_answered, supporting question remains open and remaining_question is visible. Reframe before Record returns conflict and leaves exact reply available.
- Inject failure after fact action save but before workspace merge. Receipt lists reported_fact only among completed canonical work. Retry the same command creates no second fact and finishes its links. Retry after another question edit preserves the saved fact and new question.
- Add a sentinel metadata key, concurrent context selection and a new receipt to workspace.md. A request, mark-seen, publication and handoff operation must preserve all of them under serialized fresh merges.
- Handoff WI-1 from Alex to Jordan remains pending with Alex owner. Acceptance changes only WI-1. Return creates HOF-2 pending to Alex while Jordan owns WI-1; HOF-1 stays accepted. Casey's newer direct assignment makes HOF-2 acceptance conflict, including owner-name ABA. Partial canonical owner commit recovers matching participant/index state with no second transfer.
- Compare a revised source against its frozen prior text and saved advice only. There are no decisions or drafts. Show exact changed passages and supported/inferred effect on that advice. Formatting-only, deleted passages, absent baseline and unavailable extraction remain distinct. Original source bytes never change.
- Queue a run/review as Alex, switch to Jordan, finish/retry it. Saved actor and target stay Alex's. Jordan's seen cursor and composer remain separate. Mark seen changes no legal freshness hash. GET content manifests before/after match.

Package checks use copied temporary vaults and focused tests. Model/schema import and standalone TS checks establish contract validity only. The coordinator owns full suites/builds, graph update and connected browser proof. Independent Astra Low review is required before dependent coding. No package claims connected behavior from fixtures alone.
