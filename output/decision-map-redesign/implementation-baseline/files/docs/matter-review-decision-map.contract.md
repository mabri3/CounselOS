# Matter review and decision map contract

Status: Frozen for C1–C6 implementation.
Date: 2026-09-05.
Scope: Minimal extensions to existing Markdown records and workspace APIs.

## Invariants

- Markdown remains authoritative. The map, review queue, and document library are derived views.
- Existing issue IDs, question `issue_id`, scenario files, work-product paths, and claim evidence remain readable.
- Exploration state and disposition are separate. `explored` never means `resolved`.
- A question answer does not change an issue disposition. Work completion does not record a decision.
- A generated proposal, option, scenario outcome, or analysis is not a recorded position.
- All durable lawyer actions use an expected revision and a retry-safe `source_action_key`.
- Missing links stay visible as missing references. They do not remove useful prose or other valid links.
- Opening a document, source, citation, modal, or scenario changes no authoritative record.

## Record normalization

### Issues and dispositions

`IssueNode` keeps the existing `lawyer_state`. New records may also contain:

- `disposition`: `unresolved`, `mitigation_in_progress`, `resolved`, `risk_accepted`, or `not_applicable`.
- `disposition_reason`, `linked_work_item_ids`, and `linked_decision_ids`.
- ordered `disposition_history` entries with actor, date, issue revision, action key, and links.
- derived `priority_reason`, `next_action`, and `action_owner` for review presentation.

For an old issue with no disposition, return `disposition: null`. The UI says **No disposition recorded** or **Unresolved** as presentation text. It must not create a history entry on read.

A disposition command appends one history entry and projects its value and reason onto the issue. Recording `unresolved` after another disposition is a reopen action. It appends an entry with `action: reopened` and preserves all earlier entries. `risk_accepted` requires at least one decision ID that belongs to the matter. All supplied work and decision IDs must belong to the matter.

The client does not supply the disposition actor. The route resolves the actor from the existing trusted local-person header and stores that resolved actor in history.

The issue revision is the revision of `issues.md`, including `issue_nodes` metadata. A successful save changes it. A stale `expected_revision` returns the current revision and makes no write.

### Retry identity

For each mutation, store the action key with a fingerprint of the normalized command and target. A repeated key with the same fingerprint returns the first result and creates no duplicate history, fact, work item, or decision. The same key with a different fingerprint fails with `action_key_conflict`. A partial failure reports completed parts and remains safe to retry.

### Shared questions and answer provenance

`WorkspaceQuestion.issue_id` remains the legacy single link. `issue_ids` is the ordered, de-duplicated many-issue link.

On read, calculate effective links as ordered unique values from `[issue_id, ...issue_ids]`. For a new shared question, write all links to `issue_ids` and write the first link to `issue_id` for old callers. A mutation rejects issue IDs outside the matter. A malformed saved link remains visible through the derived map as a missing reference.

`question_kind` is `factual` or `legal`. An answered factual question uses `answer_kind: reported_fact` and may create one linked fact through the existing action record. An answered legal question uses `answer_kind: legal_analysis`, links claims or sources, and creates no reported fact. Old questions default to factual. Old factual answer commands that omit `answer_kind` normalize to `reported_fact`. A new legal answer must state `legal_analysis`.

`answer_source_ids` and `answer_claim_ids` preserve support. `linked_fact_ids` is only for recorded facts. `left_open` clears no historical answer record and selects no map branch.

### Claims and applicability

`WorkspaceClaim` contains stable `claim_id`, text, `claim_revision`, `output_revision`, applicability, evidence, and an optional support gap. Applicability names the regulated actor and jurisdiction and links the facts and assumptions used. Missing applicability data is an explicit gap; it does not hide the claim.

Each `ClaimEvidence` carries both `claim_revision` and `output_revision`. Evidence identity is the tuple `(claim_id, claim_revision, source_id, locator)`. Two claims may cite the same source with different locators and excerpts. Do not merge those evidence rows by source ID.

`support_state` describes source support. Fetching and storing a page can establish `retrieved`; it does not establish `verified`, and neither state proves that the rule applies to the actor, jurisdiction, or facts. Applicability remains the saved claim-specific explanation and inputs. A generic source mention is not claim support.

Old uncited output remains visible. Reassessment writes a new claim/output revision. It must not rewrite earlier claims, decisions, or disposition history.

## Derived review and map data

`WorkspaceSnapshot` may add `qualification`, `review_items`, `claims`, and `documents`. Omitted arrays normalize to empty arrays.

Review order is stable:

1. Explicit required lawyer actions.
2. Unresolved issues with recorded material impact.
3. Other open issues.

Use existing due date and saved order as tie-breakers. `IssueReviewItem.reason`, `actor`, `action_label`, and `state` are display data backed by saved records. Missing priority is unranked. It is not low risk.

`DecisionMapSnapshot` contains only saved or explicitly proposed records. Node IDs are stable as `<record_type>:<record_id>`. Edge IDs are stable from relationship plus endpoint IDs. Allowed relationships are `depends_on`, `if`, `supports`, `mitigated_by`, and `decided_by`.

Unknown answers use an edge state of `unknown`. They remain visible and do not select an active path. Hypothetical and historical edges remain labeled. A missing target creates a `missing_reference` node and a `missing` edge. Do not infer a replacement by matching titles.

The map derivation must use an iterative visited set. It must return every node once when records share a question, have disconnected parts, or contain a cycle. Neighborhood filtering changes visibility only. It never changes identities or meanings. The accessible outline receives the same node and edge arrays as the canvas.

## Documents and references

`DocumentIdentity.document_id` is stable across opens and revisions. Prefer the saved `work_product_id` or `source_id`; otherwise use the existing deterministic `FILE-<path hash>` identity. A path revision is not a new document. Different paths with the same file name are different documents.

`kind` is `work_product`, `source`, or `matter_record`. `lifecycle_state` is `editing_draft`, `reading_source`, `final`, `approved`, or `matter_record`. `editable` and `immutable` come from saved file and lifecycle data. Never infer approval from a file name.

`DocumentReferenceTarget` freezes `document_id`, path, optional revision, saved locator/excerpt, exact-passage state, and return origin. Internal links resolve by ID and path within the matter. Public URLs continue through the existing safe-URL path. If the document exists but the locator does not match, open it and show **Exact passage unavailable**.

Opening a work product selects or opens its tab. Opening a source while drafting opens reference preview. It does not change the draft action target or add the source to agent context. The explicit **Use in this request** action controls context.

Local edits are keyed by `(matter_id, document_id)`. `LocalEditorSnapshot` retains path, content, base and review revisions, dirty state, selection, recoverable state, and update time. Switching documents preserves one snapshot per document. Closing a dirty tab marks its snapshot recoverable. Only an explicit discard deletes it.

Draft, rewrite, save, review, and export submissions freeze the target document ID, path, and revision. A later source focus or tab switch cannot retarget the result. A final or approved document is immutable; revision opens or creates an editable successor through the existing work-product behavior.

## Scenario actions

Creation accepts `ScenarioCreateCommand`. It stores a named snapshot, linked issues, changed assumptions, baseline source revisions, and action key. It changes no canonical fact.

Analysis accepts `ScenarioAnalyzeCommand`. It uses the saved scenario revision and the supplied baseline snapshot. State is `queued`, `running`, `completed`, or `failed`. A result stores its run ID, action key, analysis baseline, affected issues and branches, claim IDs, proposed outcomes, unresolved conditions, sources, and failure detail. It is labeled **Hypothetical · Agent analysis**.

A late result attaches to its original run and baseline. If the scenario revision or baseline changed, mark it historical/stale. It cannot replace a newer result. A failed run retains the local instruction and earlier saved result.

Adoption accepts `ScenarioAdoptCommand`. It requires selected change IDs, current expected revisions, and a direct lawyer action. It creates facts through the existing matter-fact action. It does not accept a recommendation, disposition, or decision. Retry rules are the same as other mutations.

## API methods for C1 and C6

Keep the existing base `/matters/{matter_id}/workspace`.

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `GET` | `/` | none | `WorkspaceSnapshot` with review, claim, and document projections |
| `PATCH` | `/issues/{issue_id}` | existing `IssueUpdate` | `IssueNode[]` |
| `POST` | `/issues/{issue_id}/disposition` | `IssueDispositionCommand` | `IssueDispositionResult` |
| `GET` | `/decision-map?issue_id=...` | optional issue ID | `DecisionMapSnapshot` |
| `GET` | `/scenarios` | optional `issue_id` | `Scenario[]` |
| `POST` | `/scenarios` | `ScenarioCreateCommand` | `Scenario` |
| `POST` | `/scenarios/{scenario_id}/analyze` | `ScenarioAnalyzeCommand` | `WorkspaceActionResult` |
| `POST` | `/scenarios/{scenario_id}/adopt` | `ScenarioAdoptCommand` | `InteractionReceipt` |
| `GET` | `/documents` | none | `DocumentIdentity[]` |
| `POST` | `/documents/resolve` | `DocumentReferenceTarget` | `ResolvedDocumentReference` with `exact`, `document_only`, or `missing` passage state |

C6 adds matching typed functions in `frontend/lib/workspaceApi.ts`. Route integration reads an initial `issue_id`, preserves it in the back link, and does not put unsaved editor content in the URL.

Use existing error transport. Missing matter or record returns 404. Invalid links or mismatched matter IDs return 422. Stale revisions and reused keys with different fingerprints return 409 with `current_revision` and a recoverable error code. Unsafe paths and URLs are blocked. Retrieval or parsing failures retain useful saved content and identify the unavailable part.

## Component props

- C3 uses `ReviewOrientationProps` and `WorkItemSummaryProps`. The summary gets one saved review item and issue. `onClosePanel` only closes presentation.
- C4 uses `UnderstandPanelProps`, `IssueNavigatorProps`, and `IssueReviewDetailProps`. The detail receives already-linked questions, claims, work, and decisions. It never performs title matching.
- C5 uses `DecisionMapProps` and `DecisionMapOutlineProps` from `decisionMapTypes.ts`. Canvas and outline share the same nodes and edges. Layout positions are presentation only. The map emits `ScenarioLaunchIntent` and renders an optional scenario-panel slot. Terra does not implement analysis or persistence semantics.
- C5a uses `DocumentNavigatorProps` and `DocumentTabsProps`. The navigator gets the full library. Tabs get only opened documents and per-document local edits.
- C5b uses `ScenarioInteractionProps`, `ReferencePreviewProps`, and `DocumentPanelProps`. Every document mutation names its frozen target. Reference preview receives a frozen return origin.

Parent components own fetching and route state. Child components report explicit actions through callbacks. No child writes Markdown directly.

C5/C6 amendment: `DecisionMapProps.selectedNodeDetails?: ReactNode` supplies the selected node's claim and evidence details outside the canvas. C6 joins `claim_ids` to workspace claims and resolves actual document targets. C5 must not invent a source path from a claim ID.

C5a/C6 amendment: optional `DocumentNavigatorProps.activeDocumentPath` and `activeDocumentRevision` identify the exact selected version in the picker. Stable document ID alone cannot distinguish a final from its editable draft.

C2/C4/C6 amendment: `IssueNode.claim_output_revisions` optionally maps a claim ID to its current output revision. New targeted publication updates this map. Issue and map details select that revision while earlier inquiry claims remain readable history. Legacy missing maps do not hide claims.

## Contract examples

A shared factual question can have `issue_id: ISS-1` and `issue_ids: [ISS-1, ISS-2]`. One saved answer has one question identity and one linked fact. Both issue details and both map edges point to that question.

Two claim evidence rows may be:

```json
{"claim_id":"CLM-AGE","claim_revision":"cr1","output_revision":"out7","source_id":"SRC-COPPA","locator":"16 CFR 312.2 — child","available_excerpt":"..."}
{"claim_id":"CLM-OPERATOR","claim_revision":"cr1","output_revision":"out7","source_id":"SRC-COPPA","locator":"16 CFR 312.2 — operator","available_excerpt":"..."}
```

The shared source can be `retrieved`. Each claim still needs its own excerpt and applicability explanation.

## Terra shared-question and cycle fixture

Use a fictitious learning-app matter. Do not encode a conclusion from the reference matter.

The fixture has six issues. `Q-AUDIENCE` is factual and links `ISS-AGE` and `ISS-CONSENT`. Its answer is unknown. One source supports two claims through different 16 CFR 312.2 locators. Include a disconnected issue. Include these saved edges:

- `issue:ISS-AGE depends_on question:Q-AUDIENCE`
- `issue:ISS-CONSENT depends_on question:Q-AUDIENCE`
- `option:OPT-NOTICE mitigated_by work:WORK-NOTICE`
- `issue:ISS-CYCLE-A depends_on issue:ISS-CYCLE-B`
- `issue:ISS-CYCLE-B depends_on issue:ISS-CYCLE-A`

Expected result: all nodes occur once; both issues connect to the one shared question node; the unknown question is labeled unknown and selects no path; the cycle terminates; the disconnected issue remains in whole-matter mode; canvas and outline expose identical record labels, relationship labels, and actions. Source details open outside the canvas. Keyboard users can select every visible node and return to the originating issue.

## Required failure cases

- Old issue or question has none of the new fields.
- Shared question contains a missing issue ID.
- Disposition action repeats with the same key, then repeats with changed content.
- Disposition save uses a stale issue revision.
- `risk_accepted` has no matter-owned decision.
- Legal answer is submitted as a reported fact.
- Two claims cite one source at different locators; one locator is missing.
- Map has a cycle, shared node, disconnected node, and missing edge target.
- Scenario analysis fails or returns after baseline change.
- Scenario adoption retries after the fact write succeeds but receipt write fails.
- Two documents share a file name; a historical revision is referenced.
- A dirty tab closes, a source gains focus, and a delayed draft/export result returns.
- Reference path is unsafe, file is missing, or exact locator no longer matches.


## Current-answer claim projection amendment

`WorkspaceSnapshot.answer_claims` is an optional/default-empty array of `WorkspaceClaim`. It contains only the validated claim identities and exact claim/output revisions saved with the current snapshot answer. `claims` continues to include immutable historical output claims. Render the current answer with `answer_claims`; do not choose its evidence from the historical aggregate. This is a derived response projection from existing Markdown snapshot metadata, not another authoritative store. Missing legacy support remains a visible gap.


## Browser integration amendments

- `ReferenceOrigin.workspace_view` optionally retains the originating Understand/Discuss/Draft view. Source viewing preserves the named draft target. On wide layouts the editor stays mounted beside the source; narrow layouts stack them.
- Scenario presentation may receive saved claims to distinguish actual cited passages from mere known IDs. An optional parse failure preserves useful scenario prose.
- The matter-scoped POST work-items route reuses `WorkItemCreate` and MatterService. Mitigation requires a nonblank owner and a valid issue in that matter. Completion does not change a disposition, decision or matter closure.
- Map return links carry the current conversation ID; the matter route validates that ID against saved conversations. Unsent text is retained per matter/conversation through route changes and New/server-ID promotion.
- `WorkspaceActionsService.publish_result(update_current_snapshot=False)` saves inquiry prose and claim evidence for artifact-target chat without replacing the current answer or issue associations. Default current-answer publication remains unchanged. A renderer may show claim-level support only for saved claim text present in the rendered answer. An unmatched known source remains a source-only link, without a borrowed claim or excerpt.
- Citation markers use the downstream parser grammar. Prose humanization must preserve the whole marker, including path-shaped source IDs and locators, before rewriting unrelated IDs and paths.

### Export reference preservation amendment

Existing DOCX/PDF exports retain valid saved-document destinations in a readable
`Document references` appendix: link label, canonical vault-relative path, and
any supplied locator fragment. These are document references, not verified
legal support. Do not invent a public URL or emit a broken file hyperlink.
Use only the selected export text (and displayed original text in markup mode).
Exclude code literals, missing files, unsafe destinations, and paths outside
the vault. Optional reference lookup failure must preserve useful exported text.
