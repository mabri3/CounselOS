# Decision map redesign contract

Frozen C0 contract, September 5, 2026. Additive types are in backend/app/models/workspace.py and frontend/lib/decisionMapTypes.ts. Existing callers remain valid.

## Saved analysis

Use IssueAnalysis, LegalTest, PathCondition, IssueOption, IssueAnalysisStatus and DecisionMapBasis exactly as declared. Model output is useful prose plus an optional `decision-paths` fenced JSON object: `{ "issue_analysis": { "issue_id": "<real issue ID>", "explanation": "...", "tests": [], "conditions": [], "options": [] } }`. Whole-matter output may use `issue_analyses: [...]`. Independent claim-support transport remains supported. Malformed structure never removes useful prose or prior valid analysis. Unknown never chooses a path. Missing/invalid combination with nonempty requirements is incomplete; reject that option with a warning, or retain the analysis as partial. Mixed nested logic must be separate routes, never flattened.

The server rejects duplicate local IDs and foreign issue/fact/question/work/claim links. Local test/condition/option IDs map consistently to analysis-scoped IDs. Compute the analysis digest over normalized provider content, issue ID, run ID and captured input basis, before server IDs/revisions. Compute option digests over analysis revision and canonical option fields excluding option_revision. Server revisions cannot come from a model. No arbitrary metadata enters canonical digests.

Save prose first in the existing inquiry/research output. Save `issue_analyses` as an array in that output's metadata, with output_revision and exact claims. In workspace.md metadata, `issue_analyses[issue_id]` points to `{analysis_id, analysis_revision, source_path, output_revision, run_id, captured_at}`. The pointed file and exact revision are the only current structured analysis. Missing pointers stay missing; legacy options are labelled fallback/history. Previous output files remain readable. A retry cannot overwrite a different existing run output.

## C1 service boundary

C1 owns new IssueAnalysisService(vault, matters, workspace=None) in services/issue_analysis.py. Expose:

- `capture(matter_id, issue_id=None, *, frozen_context=None) -> dict`: serializable captured input containing issue input_basis per real issue, actual supplied context, capture time and prior current references.
- `publish(matter_id, *, path, run_id, output_revision, structure, capture, claims=None) -> dict`: validates and saves optional structure to existing saved prose; publishes valid current pointers under existing serialized lock. Returns warnings and saved analysis data.
- `resolve(matter_id, issue_id) -> dict`: IssueAnalysisStatus shape; no write/model call. Compares captured canonical inputs and returns saved/partial/needs_review/missing/not_mapped.
- `load(matter_id, path, analysis_id, analysis_revision) -> dict`: validates matter-owned path and exact immutable saved analysis, or raises a validation error.

C1 may refine internal helpers but must report any change to these seams before C2 dispatch. ContextBuilder captures analysis inputs inside frozen context under `issue_analysis_capture`. WorkspaceActionsService.publish_result gains optional `frozen_context` and uses this captured data. Coordinator owns the narrow routers/chat.py wiring needed to pass the actual run frozen context; C1 must not edit routers/chat.py. ResearchRunService freezes target and actual context when queued; ResearchService executes that frozen context and preserves it through packet publication. Direct legacy publication without captured input must not invent a fresh basis.

Issue-local basis hashes the business question's canonical text/identity, selected issue's substantive title/why/parent/fact links, actual supplied fact/question content, selected source content and company/playbook inputs. Exclude generated output, claim-link maintenance, disposition/status/timestamps, current pointers, dossier and research writes. Pin input claims to immutable output revisions. Use a projection of captured context selections; excluded input must not leak back. Compare each captured canonical identity with current value. Both issues can publish concurrently without overwriting the other's pointer. Also compare captured prior pointer or ordering token so an older run with unchanged inputs cannot replace a newer accepted run. Re-read workspace.md inside serialized publication.

## Projection and decision boundary

Snapshot `issue_analyses` is a dictionary of IssueAnalysisStatus by issue ID, in both WorkspaceSnapshot and DecisionMapSnapshot. Nodes use `<record_type>:<record_id>` IDs. Added kinds: legal_test, condition. Added relationships: assessed_under, requires. Node data contains the typed canonical test/condition/option for the inspector; analysis_id, analysis_revision, analysis_path and output_revision identify exact support. Node group is current, legacy, historical, hypothetical or missing. Shared facts remain one canonical node. Preserve existing custom edges and disconnected records.

DecisionCreate.map_basis is optional. Client supplies exact identifiers and use_historical_basis only; canonical_option and input_basis are always resolved by the server. Server freezes canonical option, analysis reference, input basis and requirements separately from lawyer wording/conditions. A stale basis returns conflict unless use_historical_basis is explicitly true. Validate membership even for historical requests. The request fingerprint covers normalized submitted decision fields, exact canonical basis, and revision/mitigation links; exclude generated dates/IDs and action key. Check replay fingerprint before returning a prior decision. Same key/different request conflicts. Existing legacy records remain readable. No implicit disposition, approval, delivery or closure.

## UI boundary

DecisionMapProps retains existing props and gains optional focusedIssueId, onFocusIssue(issueId), onAnalyzePaths(issueId), onRecordPath(DecisionPathPrefill). focusedIssueId is independent of selectedNodeId. This issue uses semantic test/condition/option columns and the full canonical issue slice; selection cannot prune siblings. All issues is the existing whole_matter scope. Full grouped outline shares snapshot IDs/relationships. First fork readable at 1280x900; measured curved connectors; selected detail below; white Matter A tokens and shared fonts.

IssueReviewDetailProps gains optional analysisStatus, onAnalyzePaths and onRecordPath. RecordDecisionModal gains optional `pathPrefill: DecisionPathPrefill`; all existing props remain valid. Prefill has map_basis, option, analysis, state, hypothetical. The modal freezes the submitted payload/key for uncertain retries, preserves edits after conflicts and has explicit historical-basis selection. A saved decision only retries refresh. Controls must not write on opening/preview/cancel.

ConversationTarget and ScenarioLaunchIntent have optional exact analysis/option IDs/revisions. C5 routes these through existing conversation/scenario services. Source return retains issue and selected node. One existing conversation instance and unsent text remain intact.

## Ownership and checks

Exact ownership is C0–C6 in build-plan.md. Coordinator additionally owns narrow routers/chat.py argument wiring, routers/decisions.py HTTP 409 conflict mapping, UnderstandPanel.tsx callback pass-through, and any necessary index metadata projection. Coordinator owns narrow backend/app/agents/output.py structured-transport preservation and backend/tests/test_decision_map_generation_integration.py for real HTTP/runner publication with only a provider-boundary double. Coordinator also owns narrow ClaimMarkdown.tsx valid decision-paths display filtering, checked in the already-owned check-matter-review-integration.ts. Workers must not spawn agents, start/stop services, run broad suites/builds, edit shared contracts or tracking. No commits/push/deploy/PR. Only synthetic isolated vault mutations.

Baseline: output/decision-map-redesign/implementation-baseline/manifest.json and files/. Review incremental changes against these copies, including initially untracked files. C0 focused checks: model import/default validation and frontend typecheck. Worker checks follow the build plan; coordinator verifies claims before acceptance.

## Exact source support correction after browser evidence

Two output files can have the same prose hash and claim ID but different observed evidence. `IssueAnalysisStatus.claims` is an additive, default-empty list of claims read from the validated analysis source file. Map projection resolves claims inside that exact file as well as checking output revision. The issue caller gives these exact claims precedence over the generic workspace claim list. This avoids cross-file collisions without changing saved digests or rewriting historical decisions.

## C6 correction: route states and frozen input identity

`DecisionMapEdge.state` includes `inactive`. It means a known assessment does not satisfy the route. It is not a record decision and does not prevent preview or an explicit lawyer decision. Structural connectors remain visible; neither inactive nor unknown connectors enter active-path traversal.

For an `all` option, any known mismatch makes every requirement connector inactive. With no mismatch, an unresolved or conflicting assessment makes every connector unknown. Only a complete match is active. For an `any` option, each matched requirement is active, each known mismatch is inactive, and each unresolved requirement is unknown. Historical state overrides this display evaluation.

A supplied selection or unsaved draft pins its exact `supplied_revision` under the immutable context basis. Saved-file freshness is a separate `context-file:` digest. A different same-length draft cannot share the same basis merely because its saved file revision is unchanged.

Queued research includes the exact active facts, open assumptions, current supporting questions, issue and business question in its frozen prompt. Explicit included roles bind those inputs to publication freshness. A later input change preserves the prior pointer and publishes the late result as historical.
