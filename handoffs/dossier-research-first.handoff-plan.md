# Build blueprint: research-first dossier generation

Prepared for Opus 4.8. Author: Codex / GPT-6 Astra.
Repository: /Users/bharris/Programs/counsel-os-mvp
Prepared: September 11, 2026, America/Los_Angeles.
Status: ready to implement. No application changes were made while preparing this plan.

## 1. Goal and observable result

When a lawyer asks “Generate a dossier,” the application must do the work expected from a junior associate: identify the material issues, propose priorities, research the selected issues, read relevant source passages, apply the findings, and deliver an editable dossier.

The lawyer sees three suggested priorities and a choice to research the top three issues or all identified material issues. The first dossier contains deep answers for the selected first three and an initial answer for every other issue. If all issues were selected, the remaining research continues in the application. The dossier shows real progress and preserves useful prior work.

The proof is visible: the lawyer accepts the proposed scope, sees three different issues being researched, receives a useful first dossier, edits it, leaves the page, and returns to find saved research and a clear update that has preserved those edits. After a backend restart, completed research is still available and unfinished work can resume.

“Research complete” describes the work performed within the saved scope. It does not mean that an issue is legally resolved or that a business action is approved.

## 2. Decisions, defaults, and scope

### Decisions supplied by the user

1. This must work across legal subjects. Do not implement Harbor-specific rules.
2. The default first pass researches three priority issues in depth.
3. Every other material issue gets an initial answer and an honest research status.
4. Suggest three priorities from the matter. Let the lawyer accept, change, or skip them.
5. Ask whether the lawyer wants the top three researched or all identified issues.
6. Explain that researching all issues takes longer.
7. Preserve per-issue work, readable citations, facts, and meaningful next steps.
8. Make this build trackable and resumable.

### Defaults chosen for this implementation plan

These choices make the plan executable. They are planning defaults, not statements that the user separately approved each detail.

| Choice | Build default |
|---|---|
| Initial scope selection | Top three. Offer All identified material issues beside it. |
| Delivery when All is selected | Deliver after the first three finish or reach their limits. Continue the remainder in background batches of up to three. |
| Priorities versus legal issues | Priorities describe the lawyer's desired outcomes. Show the three legal issues mapped to them. The lawyer can change the order or selected issues. |
| Skip priorities | Use the suggested order. Do not skip the research scope or source choice the lawyer actually made. |
| Research budget | Retain the current allowance per issue: 13 main model calls, 600 active seconds, 3 collection batches, 12 evidence requests, 16 fetches, 48,000 evidence characters. Reserve the last main call and 90 seconds for an answer. |
| New settings | No new budget settings screen. Save the existing limits into each run. |
| Timing copy | Show order, issue count, elapsed time, and actual status. State that full research takes longer. Do not claim a measured delivery estimate before measuring it. |
| Manual request | Generate, regenerate, prepare, build, or other recognized dossier commands enter this flow. An explicit saved-material-only request uses the existing writer directly. |
| Automatic refresh | Uses saved inputs only. It never starts fresh research. |
| Preview, hypothetical path, or excluded sources | Retain the existing restricted preview path. Do not start this unrestricted whole-matter research flow from it. Clearly explain the scope of the preview. |
| Repeated request while active | Show the existing request and its progress. Do not start duplicate workers. |
| Restart | Recover saved effects without paid calls where possible. Mark remaining work Interrupted. Resume uses the saved scope and remaining budgets. |
| Notifications | In-app updates in the originating conversation. No email, Slack, browser push, cron, or Codex automation. |
| Unexpected urgent issue | Show the issue, why it may matter, and its next action. Do not silently replace a lawyer-selected priority. |
| Later issue discovery | All means all material issues in the displayed plan at Start. Later discoveries stay visible as new, unresearched work. Offer a normal research follow-up for those named issues, with the saved priorities available. Never claim full matter coverage while new gaps remain. |

The last scope rule prevents an open-ended research loop. The UI must say “All N identified issues,” not promise exhaustive research into every issue that could ever emerge. The preparation pass must inspect the supplied request and prior analysis as well as the canonical issue list, so an old incomplete list cannot silently limit coverage.

The user did not choose an overall time or dollar budget. Do not silently impose a short chat timeout on all issues. Do not present 10–15 minutes as a guaranteed or benchmarked delivery time. The existing per-issue controls give a concrete initial bound. Record actual first-pass and total times for later calibration.

### In scope

- One setup card in the current conversation.
- Three distinct issue research runs at once, using the existing research harness.
- One saved parent request that records choices, child identities, progress, and publication receipts.
- Detailed per-issue state, retained research history, and full useful analysis.
- Source and internal-record reference repair.
- Supplied-fact provenance and dated proposed work.
- Safe first-pass and later publication.
- Stop, resume, reload, and restart behavior.
- Focused tests, a real browser story, and one bounded configured-model quality check.

### Not scheduled

| Item | Add only when |
|---|---|
| General workflow engine or message queue | The existing single-process application cannot support observed use. |
| Multi-host workers or cloud execution | A real deployment requires them. |
| Automatic endless discovery and research | Measured use shows the bounded displayed issue set is inadequate and cost controls are designed. |
| Automatic merge into lawyer-edited prose | The existing review revision proves inadequate in actual use. |
| A new legal verifier or voting stage | Do not add as part of this feature. Missing support must still yield useful work. |
| A universal deadline/calendar engine | Actual matters require rule-aware business-day and holiday calculations beyond explicit proposed dates. |
| Research freshness by a guessed age threshold | A measured need supports a policy. Input changes and source versions already provide concrete evidence. |
| Rich analytics and delivery prediction | Enough real runs exist to support an estimate. |
| Global settings or model migration | This feature demonstrates a need beyond existing run selections. |

## 3. Verified baseline and important evidence

The implementation must start from this working checkout, not a clean checkout of main. Most of the relevant dossier code is currently untracked.

- HEAD: cbac9f39dffd2ffa24f5ae123e332e929a8df770.
- Branch observed earlier in this task: main. Verify again before work.
- Author preflight observed 85 modified tracked paths and 136 default-status untracked entries. Directory entries hide additional untracked files. Counts are evidence, not a required equality.
- Nothing was staged by the plan author.
- Do not reset, clean, stash, replace the checkout, or stage all files.
- Preserve the local backend/frontmatter.py compatibility shim.
- Read AGENTS.md, docs/PRD.md, CODEX_HANDOFF.md, docs/DESIGN_LANGUAGE.md, and current.md if present before application edits.
- This plan supersedes the old manual-generation “saved inputs only” product behavior. The final dossier writer and automatic refresh remain saved-input operations.

The latest inspected Harbor run is:
Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260912-13f42a.md

It used the dossier-generation skill and openai_compatible / deepseek-v4-flash / default. It returned a preview on a non-mainline path. Do not describe it as the older mistyped-command run, and do not change the user's active path to force a save.

The raw response has identifiable records. Passing it through current cleanup produced 25 instances of “the internal record,” five of “the saved file,” and one raw Q-BONUS. Q-BONUS is a real saved question. It needs a readable reference.

The previous detailed licensing answer was already present in the model input. The frozen dispatch contained 241,849 bytes under a 256,000-byte limit, with no omitted context indices. The detail loss in that run was a writing/composition problem, not just missing research or truncation.

Useful older artifacts, for read-only comparison:
- Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-4cc39b05492c9b214333.md
- Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md
- output/dossier-research-fix/verification.md
- output/dossier-research-fix/pytest.xml
- docs/living-dossier.md

The author did not modify the real Harbor dossier. Its SHA-256 was:
43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2

Use a temporary fixture vault for all mutation tests. Do not run this new flow against Harbor while implementing it.

### Author preflight checks

Passed during plan preparation:

~~~text
cd /Users/bharris/Programs/counsel-os-mvp/backend
.venv/bin/python -m pytest -q tests/test_dossier_generation.py tests/test_dossier_generation_chat.py tests/test_dossier_generation_integrity.py tests/test_dossier_research_continuity.py tests/test_output_citations.py tests/test_research_checkpoints.py
# 71 passed, 1 warning in 17.72s

cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run typecheck
# exit 0

node --experimental-strip-types scripts/check-citation-reading.ts
# citation-reading and dossier-marker checks passed
~~~

Known pre-existing failure:

~~~text
cd /Users/bharris/Programs/counsel-os-mvp/frontend
npm run check:document-reference-behavior
# ERR_MODULE_NOT_FOUND:
# frontend/lib/api.ts imports "./modelSettingsRows" without the .ts extension.
~~~

frontend/tsconfig.json already allows importing TypeScript extensions. Step 1 includes the narrow import fix. Do not change the whole package to ESM or add a new dependency to repair this check.

The FastAPI/Starlette httpx deprecation warning and Node MODULE_TYPELESS_PACKAGE_JSON warning are acceptable baseline warnings. They are not permission to change dependencies.

The saved full-suite XML reports 1,575 passing tests from prior work. The author did not rerun the full suite for this planning task. The new tests below do not yet exist and have not passed. All future verification commands are implementation requirements, not completed evidence.

## 4. Existing architecture to reuse

Paths below are relative to the repository root.

| Existing file / symbol | Actual behavior and required use |
|---|---|
| backend/app/services/dossier_generation.py: requested, preview_only | Existing explicit-command recognition, including narrow typo correction, and scope protection. Retain both. |
| backend/app/services/dossier_generation_chat.py: respond | Current manual chat entry into the writer. Route unrestricted manual generation into the new preparation card here. Keep explicit preview/saved-only handling here. |
| backend/app/routers/chat.py: execute_chat | Recognizes the dossier request, freezes its skill and inputs, calls respond, saves the reply. Preserve normal chat behavior. |
| backend/app/services/chat_runs.py | Durable chat request and response. The setup turn must finish normally; background research must outlive this short chat turn. |
| backend/app/services/dossier_generation.py: generate_dossier | One tools=None model call; 120-second default writer timeout; frozen inputs; useful fallback; stable revision key; hash/basis checks. Keep it as the writer. |
| backend/app/services/dossier_generation_context.py: capture, basis, retain_issues | Captures all issues but only the latest research body, sliced at 24,000 characters. Existing retention checks headings/markers, not depth. Extend this deliberately. |
| backend/app/services/dossier_research.py: prepare_publication, render_publication | Existing research_publication.issue_positions map. Stores position, next_action, packet_path, basis, issue revision, support, and source records. Extend this map instead of introducing another current-answer database. |
| backend/app/models/research_investigation.py: ResearchIssueUpdate, extract_research_synthesis | Optional per-issue structured output. Invalid entries must not erase useful prose. |
| backend/app/services/research_runs.py: ResearchRunService | Saved Markdown runs and in-process asyncio tasks. Current start accepts one issue_id for a batch of up to three QUESTIONS; that is not three distinct issue workers. Current scheduling is serial per matter. |
| backend/app/services/research_checkpoints.py: ResearchCheckpoints | Budget reservations, source hashes, completed-call replay, unknown call outcomes, and remaining budgets. Reuse these controls for every child. |
| backend/app/services/main_agent_research.py: run_main_research, research_basis | Routes research through the shared main-agent tool loop. The current basis includes the question, facts, recommendation hash, and dossier hash. |
| backend/app/services/research_execution.py | Research instructions and the final-answer reserve. Use the research allowance, not MainChatCheckpointAccess's shorter chat allowance. |
| backend/app/services/research_collection.py | Actual search, fetch, source-library search, passage reads, and scope enforcement. Do not replace it. |
| backend/app/services/research.py: ResearchService.run | Saves full packets, source records, optional analyses, and a latest-research pointer. Inspect and suppress shared-record effects for parent-managed children as specified below. |
| backend/app/services/research_publication.py: publish_research_result | Publishes one normal research answer with receipts. Its changed_advice check would treat a sibling's publication as a conflict. Keep normal-run protections. Use one group publication path for dossier children. |
| backend/app/services/recommendations.py: RecommendationService | Keeps accepted/current working view separate from the proposed view. Research does not accept a proposal. |
| backend/app/services/workspace.py: issues, save_issues, update_issue | Stable issue IDs and revision checks. save_issues explicitly prohibits adding/removing IDs. Add a narrow append helper; do not weaken that existing contract. |
| backend/app/services/problem_analysis.py: capture | Has an existing reference catalog with fact/issue/question IDs, text, paths, and revisions. Reuse its record conventions. |
| backend/app/agents/output.py | Preserves closed source/claim markers and named vault links; replaces bare IDs and paths. Fix reference binding before cleanup, not by inventing more generic labels. |
| frontend/components/workspace/ClaimMarkdown.tsx | Existing source-marker renderer, safe document navigation, and disclosures. Reuse it. |
| frontend/components/workspace/EvidenceDrawer.tsx and ReferencePreview.tsx | Existing evidence and exact-passage reading surfaces. Extend record presentation through them. |
| frontend/components/ResearchScopeChoice.tsx: ResearchScopeFields | Existing scope controls. Reuse these within the setup card rather than opening another wizard. |
| frontend/components/ChatCards.tsx | Shared typed-card rendering. Add one dossier card type and component. |
| frontend/components/experimental/ExperimentalChat.tsx and ChatPanel.tsx | Both chat surfaces must show the same setup and persistent progress. |
| frontend/components/experimental/ExperimentalDocument.tsx | Already reads metadata.source_records into ClaimMarkdown. Dossier references must survive this saved-document path too. |
| frontend/lib/documentNavigation.ts | Exact identity/version matching and passage offsets. Retain safe-path checks and no guessed highlights. |
| backend/app/runtime.py: AppContext | Initializes services; marks runs interrupted; tracks active work. Add the parent service to these paths. |
| backend/app/main.py | Registers API routers and application lifecycle. Wire the new router through the normal app. |

Important existing signatures:

~~~python
ResearchRunService.start(
    matter_id, questions, *,
    source_action_key=None, origin="user",
    expected_question_revision=None, issue_id=None,
    search_scope=None, origin_conversation_id=None,
    origin_message_id=None,
)

generate_dossier(
    app, matter_id, *, request="Generate the dossier.",
    resolved_provider=None, snapshot=None, expected_hash=None,
    save=True, run_id=None, frozen_context=None,
    execution_state=None, checkpoint=None,
)

publish_research_result(
    app, *, matter_id, run_id, packet_path, prose, synthesis,
)

WorkspaceService.save_issues(
    matter_id, nodes, *, expected_revision,
)
~~~

Do not call start(matter, [q1, q2, q3], issue_id=one_id) and claim it covers three issues. Each selected issue needs its own run, frozen brief, and checkpoint.

## 5. Minimal architecture

Add one parent request record and one small coordinator. Keep the existing child research records and dossier revisions.

~~~mermaid
flowchart TD
    A[Generate a dossier] --> B[Prepare issue map and suggested priorities]
    B --> C[One setup card: priorities, top three or all, source scope]
    C --> D[Save parent request and frozen choices]
    D --> E[Up to three independent issue research runs]
    E --> F[Save each issue answer and evidence]
    F --> G[Combine one batch and write first dossier]
    G --> H{All selected?}
    H -->|Yes, work remains| I[Research next batch of up to three]
    I --> J[Save an updated dossier or review revision]
    J --> H
    H -->|No, or finished| K[Show completed work and remaining gaps]
~~~

The coordinator controls order and records progress. It does not supply a second legal opinion. There is no verifier agent, vote, general task engine, message broker, or additional scheduler.

Proposed new production files:

- backend/app/models/dossier_request.py — request/card contracts, saved-record shape, validation.
- backend/app/services/dossier_requests.py — preparation, saved request operations, and recovery entry points.
- backend/app/services/dossier_request_execution.py — bounded batch execution and group publication coordination.
- backend/app/services/dossier_references.py — scoped reference catalog and binding.
- backend/app/routers/dossier_requests.py — typed request endpoints.
- frontend/lib/dossierRequests.ts — API-facing types and pure progress helpers.
- frontend/components/DossierResearchCard.tsx
- frontend/components/DossierResearchCard.module.css

These are new symbols/files, not existing APIs. Keep each responsibility small. Do not add a generic base service, dependency-injection framework, event bus, plugin, or new database table.

### Parent record

Store it through VaultService at:

~~~text
03_Matters/<matter-directory>/research/dossier-requests/<request_id>.md
~~~

Use a server-generated DOR identifier and record_type: dossier_research_request. The record is Markdown with frontmatter. SQLite can index it later if the existing index naturally does so; correctness must not depend on a new index schema.

Required fields:

~~~yaml
schema_version: 1
record_type: dossier_research_request
request_id: DOR-<server-generated>
matter_id: MAT-<existing>
source_action_key: <original Generate action identity>
start_action_key: null
submission_digest: null
sequence: 0
state: awaiting_choices
phase: setup
origin:
  conversation_id: CONV-<existing>
  message_id: MSG-<existing>
created_at: <UTC ISO timestamp>
updated_at: <UTC ISO timestamp>
plan_revision: <hash>
execution_mode: null
scope: null
priorities: []
first_issue_ids: []
planned_issue_ids: []
new_issue_candidates: []
frozen_context: {}
skill_snapshot: {}
model_selections: {}
source_scope: null
input_basis: {}
expected_dossier_hash: null
expected_recommendations_hash: null
issues: {}
publications: []
stop_requested: false
first_pass_ready_at: null
finished_at: null
last_error: null
~~~

- Keep the exact preparation result, initial answers, rationale, source-safe query topics, and issue mapping in this record.
- priorities entries have a stable local key, human text, mapped issue IDs, and whether the lawyer changed them.
- issues is keyed by actual issue ID. Each entry includes title, brief, initial answer, planned order, child run ID, state, packet reference, source counts, and last error.
- Store immutable record/source references with their captured revisions. Do not put all nested conversation traces into every child.
- execution_mode is research or saved_only after Start. scope is top_three or all for research, and remains null for saved_only.
- state is planning, awaiting_choices, running, completed, partial, stopped, interrupted, or failed.
- phase is setup, first_batch, first_compose, remaining_batch, update_compose, or finished.
- First-pass readiness is a timestamp and a publication reference. It is not a terminal state while the remainder runs.
- Publication state is separate: not_written, applied, review_required, or failed.
- Issue work state is not legal status. Use not_selected, queued, running, saved, partial, failed, interrupted, or newly_identified.
- Never reset budgets or child IDs on reload.
- Use the existing serialized record lock for short read/validate/write operations. Never hold it across model or network awaits.
- source_action_key identifies preparation. On Start, save start_action_key and submission_digest for the normalized choices. Do not compare the preparation payload to the Start payload as if they were the same operation.
- Save choices before creating tasks. Each child uses a deterministic source_action_key derived from parent request ID and issue ID. A repeat submission with the same key and same payload returns the existing request; a different payload with the same key returns a conflict.
- Treat saved metadata as untrusted input. Reject malformed state/budgets without erasing the record or resetting it to a fresh request.

### New service contract

Implement these explicit operations on the parent service; exact internal helpers can stay private:

~~~python
class DossierRequestService:
    def __init__(self, app): ...
    async def prepare(self, payload, *, resolved_provider, run_id=None) -> dict: ...
    def get(self, matter_id, request_id) -> dict: ...
    def list(self, matter_id, *, conversation_id=None) -> list[dict]: ...
    async def start(self, matter_id, request_id, choices, *, expected_sequence) -> dict: ...
    async def stop(self, matter_id, request_id, *, expected_sequence) -> dict: ...
    async def resume(self, matter_id, request_id, *, expected_sequence, retry_unknown=False, retry_issue_ids=None) -> dict: ...
    def recover_interrupted(self) -> None: ...
    async def wait_for_active_work(self) -> None: ...
~~~

These signatures are proposed. Keep one instance at AppContext.dossier_requests. Give it has_active_work. Runtime tasks are owned by it and ResearchRunService; the Markdown record remains the durable truth.


## 6. Preparation and priority selection

Use one bounded, tools=None preparation call through the selected main model. This call reads the matter; it does not perform public research or mutate legal records.

Input:

- Exact saved decision question and stated business objective.
- Supplied request and active reported facts, with provenance.
- Existing issues and their stable IDs.
- Open questions and material conflicts.
- Current/proposed working view and prior problem breakdown.
- Existing research status and compact per-issue positions.
- Known event dates, contract dates, work-item dates, and their distinct roles.
- The frozen conversation scope. Do not replace restricted input with unrestricted vault reads.

Ask for useful prose plus an optional structured dossier-plan block with:

1. A complete material issue map.
2. Three suggested business priorities and why each matters.
3. Three distinct suggested first issue IDs, mapped to those priorities.
4. An initial conditional answer and next action for each other issue.
5. A focused public-safe topic for each issue.
6. Any material issue missing from the saved map.
7. Any urgent matter outside the proposed first three.
8. Date conflicts and facts that could change the result.

Ranking guidance is general: the lawyer's stated objective, dependencies that block it, time-sensitive or irreversible effects, consequences, and where research could change the advice. Do not implement a numeric legal-risk score or a Harbor keyword table.

Use only actual IDs for existing issues. For additions, the model supplies a temporary candidate key, title, why it matters, and source references. The server assigns the persistent ID on Start. Add a narrow append_generated_issues helper to WorkspaceService that:

- Checks the expected issue-map revision.
- Preserves every existing node, title, parent, and lawyer disposition.
- Validates referenced fact IDs and parent IDs.
- Adds only candidates the saved plan contains.
- Records generated origin and request identity.
- Is idempotent on the same candidate key.
- Does not alter the existing save_issues ID-retention rule.
- Does not add issues when preparing a preview or merely displaying the card.

On Start, append accepted plan candidates under the saved issue-map revision before freezing the execution basis. Resolve temporary keys to persistent issue IDs in all priorities and briefs, and save that mapping once. Capture the basis after these exact own changes. A repeated Start must reuse the mapping.

A candidate can be a subissue of a saved issue. Do not multiply issues just to produce three workers. If there are fewer than three material issues, research the available number.

Malformed optional planning data must leave the useful preparation answer visible. Save the raw model response for diagnostics, but do not expose a raw dossier-plan control block in the lawyer's reply. Extract valid fields independently; keep useful prose and a short plain-language warning when the block is malformed. Use existing issue order and existing titles as a conservative fallback. An initial answer can state its fact dependency; it must not consist only of “needs research.” Do not invent a supplied fact, jurisdiction, partner, agreement, or license to fill a gap.

The card must show the issue mapping. Accepting three broad priorities must not silently authorize nine first-pass workers. Deduplicate the mapped issues and display the actual first three before Start. If the lawyer changes a priority, let them select its mapped issue(s) from the displayed list. If a new priority needs remapping, one bounded preparation refresh may do that before Start; do not create a separate interview.

The source controls belong in this same setup card. Reuse ResearchScopeFields, including external sources, other matters, public topic, method, and follow-up permission. “All issues” changes issue coverage, not the permission to search other matters or use a new provider.

Source topic handling:

- Save one approved overall public topic and one focused topic per selected issue.
- Show focused topics in an expandable section so the lawyer can inspect/edit them. Where follow-up is off, preserve the existing restriction; never quietly enable it to improve depth.
- Preserve external=false, other_matters=false, follow-up restrictions, and provider choices.
- Do not pre-authorize fallback providers, new credentials, or other-matter search.
- Each child receives its own confirmed focused topic and the saved flags.
- A “skip priorities” action accepts the suggested order; it cannot turn external search on.
- A “Use saved material now” action invokes the saved-input writer and leaves clear research gaps. This prevents the setup card from becoming a completeness gate.

## 7. Issue research and depth

### Three workers means three actual investigations

Create one existing ResearchRun per selected issue. Use a separate provider execution state, source read ledger, immutable brief, and ResearchCheckpoints record for each. Each worker gets the main/collection model selections saved for this request. Resolve a separate execution/session from the saved selection for each child; do not share mutable provider conversation or CLI session IDs between workers. Test that one issue's messages cannot appear in another issue's context.

Give every worker:

- The exact overall objective and question.
- Its one issue and relevant supplied facts.
- The lawyer's priorities and why this issue was selected.
- The full prior useful analysis for this issue, with dates and input basis.
- Relevant source versions and references to additional saved research.
- Applicable event dates and source restrictions.
- Its own remaining budget and explicit answer-writing reserve.

Do not give every worker the entire conversation/run trace. Do not make a collector's note into a legal source.

Each worker must investigate the assigned issue, not merely suggest searches. Its instructions must cover:

- Entity/activity/jurisdiction/time applicability.
- Operative rules or controlling contract provisions.
- Material definitions, exceptions, conditions, and contrary material.
- Source passage reads and relevant cross-references.
- Application to supplied facts and a useful conditional answer.
- Practical tests, matrices, checklists, or questions where the issue requires them.
- Event-triggered clocks, notice/consent requirements, deadlines, information access, preservation, and third-party dependencies where applicable.
- Proposed owner role, concrete next action, timing basis, and fallback.
- What actually ran, what was read, and what remains unresolved.

These are issue-analysis prompts, not hardcoded legal conclusions. Do not bake in SAR rules, OFAC, GLBA, licensing lead times, or any particular deadline. The original critique supplies examples of missed dimensions; it does not establish law for every matter.

The model may finish early when the issue is adequately answered. Do not force a turn count or a minimum source count. For a substantial unresolved issue, do not stop at search snippets when relevant passages are available and the saved scope permits reading them. Research sufficiency is explained in the answer; it is not an automated refusal gate.

### Preserve the existing budget controls

Retain the current defaults in ResearchCheckpoints. Do not reduce them to fit the normal five-minute chat run. A worker should normally have up to twelve iterative main calls plus one tools=None final attempt, with 600 active seconds total and the last 90 seconds reserved.

The preparation call and whole-dossier writing call have separate bounds. Use the existing writer timeout, currently 120 seconds. One difficult issue must not consume another issue's allowance.

On a search, fetch, parser, or model failure:

1. Save actual completed work.
2. Use the existing final-answer attempt with collected information.
3. Mark the issue Partial or Failed as appropriate.
4. Deliver useful analysis and concrete gaps.
5. Let other workers finish.

Do not restart budgets to obtain another final attempt. The existing unknown-outcome reservation rule still applies.

### Extend current per-issue state

Extend ResearchIssueUpdate with optional fields; retain existing position and next_action for compatibility:

~~~text
analysis_markdown       full current issue answer; up to 60,000 characters
rule_and_support       optional structured explanation
application            optional structured application
remaining_gaps         optional list
proposed_actions       optional structured work/timing proposals
new_issue_candidates   optional linked follow-up issues
~~~

Validate each optional field or list entry independently. A bad date or candidate must not discard a valid position or full prose.

Extend research_publication.issue_positions in the existing recommendation metadata to view_version 3:

~~~yaml
issue_positions:
  ISS-<existing>:
    position: <short current answer>
    rule_and_support: <useful text or null>
    application: <useful text or null>
    next_action: <text>
    analysis_markdown: <full useful issue answer>
    packet_path: <latest exact packet>
    packet_revision: <exact output revision>
    basis: <input basis>
    issue_revision: <captured issue>
    updated_at: <timestamp>
    support: <derived human label>
    source_records: []
    remaining_gaps: []
    proposed_actions: []
    research_history:
      - run_id: <existing child>
        packet_path: <exact saved packet>
        output_revision: <exact revision>
        basis: <captured basis>
        updated_at: <timestamp>
~~~

History is a list of references to full saved work, deduplicated by run and output revision. It is not an ever-growing copy of all prior text in every prompt.

Preservation rules:

- Updating issue B cannot overwrite issue A's fields, full analysis, or research history.
- Updating issue A supplies its previous full analysis to the worker. The worker must retain useful tests and conditions, and explain material changes.
- The current detailed answer is the research worker's full useful analysis, not a short second summary written by the whole-dossier writer.
- Keep old full analyses available under dated history within that issue. Superseded advice must be labeled as earlier analysis, not silently treated as current.
- Missing optional fields preserve prior valid fields, with a visible note if reconciliation is incomplete.
- If only a new short update is available, show it as a partial update beside the prior detailed analysis. Do not erase the prior answer and claim a fully refreshed issue.
- Do not use word count as a quality gate. Tests must check retention of meaningful conditions and source references.

Legacy loading:

- Read version-2 issue_positions without bulk migration.
- Resolve each issue's packet_path within the matter and load research_prose or its Working Analysis.
- Read references from the full relevant research history, not only matter.latest_research_path.
- If only a narrative exists, retain it as dated saved analysis. Do not invent per-issue research completion.
- If a packet is missing, keep its saved position and show the missing-record gap.
- Never infer “researched” because a heading exists.

## 8. Coordinator and publication

### Separate collection from shared publication

The existing ResearchRunService._execute publishes a recommendation, projects a dossier, and may call generate_pending after every normal research item. The new grouped path must not do those shared effects independently in each child.

Add an internal managed mode with a saved parent request ID. It must not be a client-controlled bypass flag.

For parent-managed children:

- Create and initialize the run before scheduling.
- Freeze the parent's approved scope and issue brief. Add an internal managed-run creation path that accepts the already captured server-side inputs. Do not call the existing unrestricted _freeze_research_inputs and silently substitute new or excluded matter data. The public ResearchRunStart endpoint must not accept this internal override.
- Run the same research harness.
- Save the packet, sources, full useful answer, and checkpoint.
- Persist a clear “result ready for dossier composition” state.
- Do not independently replace/propose the whole recommendation, generate the whole dossier, emit a full completion message, or restore the matter stage after each child.
- Keep optional issue analysis in the packet. Publish current workspace pointers only through the parent's checked publication step.
- In ResearchService.run, suppress shared latest-research/stage/index/projection effects for managed children until the parent handles them. Preserve packet/source writes. This avoids incidental sibling writes changing the parent's basis.
- In recover_saved_publications, exclude managed children from the normal single-run publisher. Parent recovery owns those effects.

Do not globally disable changed_advice, expected hashes, scenario checks, or publication receipts.

### Scheduling

Use direct asyncio tasks and batches of up to three. No new queue system.

The parent reserves this matter's dossier-research work while active. Ordinary research already running can finish first; the parent shows Waiting for current research. Ordinary research requested during the grouped flow stays in the existing saved pending list. It must not consume a fourth concurrent slot.

Use an explicit, small matter-ownership check in ResearchRunService. Put ownership acquisition, the check for existing standalone work, and managed launch decisions under one short serialized operation so simultaneous starts cannot create a fourth worker. Exclude managed children from its ordinary _pending scheduling and restart logic. The parent launches and awaits the three exact child tasks. Grouped child finally blocks must not start unrelated ordinary runs. Release ownership when the parent stops or finishes, then allow the existing normal scheduler to proceed.

Retain normal one-at-a-time behavior for standalone research. Ensure parent ownership covers composition time too, when no child task may be active.

A Generate request while a parent is active returns that parent's progress before making another preparation call. A materially different scope needs a new request after Stop or completion; do not mutate an active parent's frozen choices.

The first batch is the selected first three. Later batches contain only the remaining planned issue IDs when scope=all. A failed child must not cancel its siblings. Wait for the batch's bounded workers, then compose from saved results and gaps. Attempt first-pass publication and deliver available text before starting the remainder. If model synthesis fails, use the deterministic saved-answer composition. If saving itself fails, show the retained text and the publication failure; do not claim First dossier ready.

### One publication per batch

Add a group publication helper in dossier_request_execution.py that reuses prepare_publication, render_publication, RecommendationService, and generate_dossier.

Use this order:

1. Under the record lock, load the parent and exact child packets. Verify ownership, output revisions, original input basis, and that this batch has not already been published.
2. Combine all valid issue updates into one candidate map. Read current saved state before merging so unrelated issue entries survive.
3. Check facts, question, issue map, source restrictions, selected path, and independent lawyer/advice edits. Group metadata and task progress are not legal input changes.
4. If the original basis is still current, write one proposed recommendation, or the initial working view only where the existing rule allows it.
5. If the basis or independent advice changed, preserve the current recommendation and save review-only research/dossier output. Do not force a current pointer or silently rebase.
6. Capture the writer inputs after this batch's saved issue update. Never reuse the preparation turn's pre-research dossier_inputs.
7. Release the lock and run the bounded no-tools writer.
8. Preserve full issue content as described below.
9. Save through the existing dossier revision/hash protection.
10. Save publication receipts and update the originating conversation.
11. Record first_pass_ready_at once. Continue the next batch if requested.

After an uncontested own publication, advance the parent's expected hashes to exactly the hashes produced by that publication. Do not treat any arbitrary newer recommendation as the parent's work. Use saved publication identity and receipts to distinguish own changes from lawyer or other-run edits.

If facts change while later research runs, the frozen work may finish, but its results must be labeled as based on the earlier facts and offered for review. A fresh generation can use the new facts. Do not quietly switch frozen inputs midway through a run.

### Dossier composition must preserve detail

The whole-dossier model writes the overview, initial answers for unresearched issues, overall next actions, and cross-issue implications. It may summarize research in the overview. It must not be the only copy of the researched issue analysis.

Extend capture to supply:

- All canonical issues and planned additions.
- Compact current positions for all issues.
- Full, resolved current analysis per researched issue.
- Initial answers for unresearched issues.
- Source/reference catalogs and honest research states.
- Current proposed/accepted/recorded views as distinct data.
- Date candidates and proposed work with their basis.

Keep a full local content map for final composition. Pass bounded, useful content to the writer; do not repeatedly inject the full prior dossier, all history, all packets, and every structured copy of the same answer.

After the writer returns, assemble each researched issue from its saved full analysis under its existing issue marker. Use the existing disclosure support for “Detailed analysis” and “Earlier research.” The visible issue section must still have a current answer, support summary, application, next action, and research state. The detailed analysis must contain the actual useful tests and conditions.

Do not use a heading-presence test as proof of preserved content. retain_issues remains a last-resort structural fallback, not the depth mechanism.

If model input exceeds the dispatch cap, keep all issues in the local composition map and reduce duplicated overview context. Do not silently truncate one issue's only detailed answer. If no model synthesis can run, assemble a useful dossier from saved issue answers and state that the cross-issue synthesis did not complete.

### Publication replay

Use a stable key per parent and ordered batch, based on request ID plus exact child output revisions. Save the following separately:

- Model call reserved.
- Model response saved.
- Recommendation effect recorded.
- Dossier revision saved.
- Conversation message saved.

Use the existing writer checkpoint callback to retain useful model content before publication. Extend the writer with an internal replay path for already-saved prepared content so a crash after response capture does not require another model call. Keep its existing default signature behavior for ordinary callers.

A crash after a revision or conversation write but before its receipt must be recovered by locating the exact existing publication/message key. Never create a duplicate revision, recommendation, message, or research run to repair a missing receipt.

An external call can complete remotely before the process records its reply. In that case the outcome is unknown. Do not claim exactly-once billing. Show the existing retry warning and require the explicit Resume/Retry action before a possibly repeated call. Completed calls replay without spending again.

## 9. References, provenance, and dates

### Readable references

Build a scoped reference catalog before cleanup. Use real record IDs and exact captured text/revisions. Reuse the source-marker format and source_records reading path rather than adding a second citation syntax.

For records, a source record needs:

~~~text
source_id          exact FACT-, ASM-, MSG-, Q-, ISS-, DEC-, etc. identifier
source_label       readable kind + short distinguishing text
source_class       reported_fact, generated_assumption, open_question,
                   recorded_decision, saved_artifact, supplied_source,
                   or retrieved_source
path               validated matter/vault path
available_excerpt  exact cited record text, where present
record_revision    digest of the captured record
output_revision    dossier/research output that owns the reference
locator            exact saved locator if one exists
~~~

Do not mark a reported fact as independently verified authority. Record excerpts are not legal source passage reads.

Bind known bare record references to existing [source:ID|locator] markers before clean_user_facing_reply. Convert known artifact paths to named Markdown links with the actual document title. Do not fabricate names or locations for unknown IDs.

Persist the catalog with the generated dossier revision and the originating assistant output. Pass those saved source records into ClaimMarkdown in both chat surfaces. ExperimentalDocument already loads metadata.source_records; extend the main document/dossier reading path consistently.

Use EvidenceDrawer/ReferencePreview to show the captured record text, kind, exact ID in details, and a link to its saved file. Only highlight a passage when the exact captured excerpt exists uniquely in the correct document version. A changed or unavailable record must be labeled. Never jump to a guessed paragraph.

For old saved conversations, bind known references in a read-only display projection from the original raw saved text. Do not rewrite the historical transcript. If the stored text already contains only a generic replacement, report that the exact reference is unavailable; do not reconstruct it from surrounding prose by guessing.

Current caller paths to cover:

- backend/app/routers/matters.py: saved matter conversation display.
- backend/app/routers/chat.py: ordinary/daily display and response persistence.
- backend/app/services/chat_runs.py: saved response/replay.
- backend/app/agents/output.py: closed marker preservation.
- frontend/components/ChatPanel.tsx: saved replies and retained run response.
- frontend/components/experimental/ExperimentalChat.tsx: saved replies.
- frontend/components/experimental/ExperimentalDocument.tsx: dossier/revision view.
- frontend/components/MatterWorkspace.tsx: main dossier/review reading.
- frontend/components/workspace/ClaimMarkdown.tsx and evidence readers.

Keep default behavior of shared functions when a reference catalog is absent. Do not make every cleanup call scan the whole vault. Resolve only IDs actually present in the output and only within its authorized scope.

Unknown references must remain distinguishable, such as “Reference unavailable: Q-…”. Never turn five different unresolved references into the same label. Add no fake source counts.

### Research coverage

Derive status and counts from child/checkpoint/source records, not model assertions.

Track separately:

- Sources discovered.
- Sources retrieved.
- Sources with actual passages read.
- Propositions with source support, if valid assessments exist.
- Sources found irrelevant or inapplicable.
- Search, extraction, reading, or analysis gaps.

Use source identity plus pinned version to avoid double-counting the same evidence. Preserve the distinction between legal source reads and supplied record reads.

“Four sources retrieved; zero with passages read” must remain possible. It must not become Researched merely because a run ended. A sourced answer can still have unresolved subquestions. A failed worker can still have useful saved passages and partial analysis.

### Supplied facts and assumptions

Take an active requester-supplied fact as a reported fact. Lack of independent verification is not a reason to make it an open assumption.

Use existing fact/action provenance. Keep inferred facts and assumptions separate. Do not overwrite facts or the original request to make the dossier consistent. If later supplied information explicitly corrects an earlier report, use the existing correction lineage.

Only show assumptions relied on by the current answer in its main assumptions block. Earlier generated assumptions awaiting reconciliation belong in dated history. Use the existing retire_generated_assumption rules only for validated references and permitted generated assumptions.

If optional reconciliation fails, show the reported fact and the unresolved conflict clearly. Do not discard the answer. Never retire a lawyer-supplied assumption by model guess.

### Dates and critical work

Pass dates to planning and research as typed candidates with role, value, source reference, and provenance. Distinguish:

- Matter administration due date.
- Planned business event/closing/launch.
- Contract end/access loss.
- A legal or contractual deadline.
- A proposed work date.

Do not treat an administrative target_date as proof of the transaction date. Do not resolve two conflicting dates silently.

When an event date is supported, the model may propose a backward work plan. Use a simple action table:

Work | Why it matters | Proposed owner role | Needed by | Basis | Evidence to proceed | Fallback

Use concrete calendar dates where the anchor and assumptions permit it. Proposed offsets must be explicit. Validate date arithmetic with the standard date library. Do not claim business-day or holiday precision without a supplied applicable rule.

Use a compact proposed-action shape: issue_id, action, proposed_owner_role, due_date (YYYY-MM-DD or null), anchor_reference_id (or null), offset_calendar_days (or null), timing_basis, evidence_to_proceed, and fallback. Keep recorded work-item owner/date references separate. A proposed offset is an integer number of calendar days, signed relative to its anchor; calculate the resulting date in code. Missing or invalid timing fields leave the action useful and its date unknown.

A legal deadline requires both the applicable rule/contract and triggering facts. If either is missing, state the conditional clock and the action to establish the trigger. A processing-time range requires applicable support; do not invent one to force a conclusion.

When no supported event date exists, give relative sequencing and identify the missing anchor. When work is already overdue, say so. Do not move an overdue action into the future just to create a clean schedule.

These are proposed actions in the dossier. Do not create or assign WorkItems, accept recommendations, record decisions, send notices, or change lifecycle state merely by writing the plan.


## 10. API, UI, and runtime behavior

### API

Register a small router under the normal /api prefix. Use these routes:

~~~text
GET  /api/matters/{matter_id}/dossier-requests
GET  /api/matters/{matter_id}/dossier-requests/{request_id}
POST /api/matters/{matter_id}/dossier-requests/{request_id}/start
POST /api/matters/{matter_id}/dossier-requests/{request_id}/stop
POST /api/matters/{matter_id}/dossier-requests/{request_id}/resume
~~~

Preparation happens through the existing dossier chat entry, which returns a saved request ID in a new dossier_research ChatCard. Do not create a second natural-language command router in the frontend.

Start accepts execution_mode, expected_sequence, plan_revision, ordered priority selections, scope, source choices, and source_action_key. execution_mode=research requires a valid scope and source choice. execution_mode=saved_only calls the existing no-tools writer with the saved scope, creates no child runs, saves its result through the usual hash checks, and completes this same parent. Wire “Use saved material now” to that mode; do not leave an orphaned active setup card. Validate that all selected IDs belong to this saved plan and matter. Do not trust client-supplied frozen_context, provider credentials, parent-child identities, or arbitrary paths.

Return 202 after the start record and child identities are saved. Do not wait for research in the HTTP request. Return 409 for stale choices or conflicting reuse of an action identity, 404 for a missing/wrong-matter record, and 400 for invalid choices.

GET requests are read-only. Opening, polling, reloading, or viewing a completed card must not start a model call, repair a recommendation, or publish a dossier.

Use the server's current search-options validation before Start. Persist the actual selected main and collector models. Do not silently swap them after a settings change or restart. An unavailable selected model yields a clear failed/interrupted state with retained work.

### UI

Add DossierResearchCard to shared ChatCards. It has setup and progress presentations, backed by the same saved request.

Setup:

- Heading: “Prepare your dossier”.
- Three editable suggested priorities with short reasons.
- The first three mapped legal issues, in order.
- Scope choice: “Research the top three” or “Research all N identified issues”.
- One source-choice section using the existing fields.
- Copy for All: “We will deliver the first dossier after the first three issues. The remaining issues will be researched in the background. This takes longer.”
- Primary action: “Start dossier research”.
- Secondary action: “Use saved material now”.
- Skip priorities retains the suggestions. Cancel leaves the saved setup available and starts nothing.

Progress:

- “Researching 3 of N issues”, followed by the actual issue rows.
- Each row has title, state word, support/read counts, and a link to its saved answer when available.
- Show “First dossier ready” with the exact revision link once saved.
- Show which issues are still running, unselected, newly found, partial, or failed. A new-issue follow-up can prepare a normal chat request naming those issues and previous priorities. Preserve existing draft text when inserting it. Use the normal research/source-choice flow; discovery itself does not launch new work.
- Show Stop while active; Resume for interrupted/stopped work; Retry only for the affected failed step.
- Do not display a fake progress percentage based on elapsed time.
- Do not display private query internals or run IDs as the main product text. Put diagnostic IDs in details.
- Display “Update ready for review” when the current dossier could not be replaced.
- Preserve the existing proposed-versus-accepted recommendation labels.

Poll the compact parent status while it is active, at roughly two-second intervals. Fetch/re-render the originating conversation only when a saved publication/message revision changes. Stop polling on unmount or a terminal state. Cancel stale responses when the matter/conversation changes.

Preserve the typed chat draft, selected context, active document, unsaved editor snapshots, comments, and scroll position. Background updates must not push a newly typed question out of the composer or replace an open dirty document.

Use docs/DESIGN_LANGUAGE.md and frontend/lib/design.ts. Reuse existing colors and small controls. Purple means agent work, amber attention, rose failure/overdue, green complete; each needs a state word. Do not introduce a new visual theme or restyle unrelated screens.

### Conversation updates

Use one idempotent assistant message per publication batch, with a short change summary and the dossier link. The first publication may include the full useful dossier, consistent with current manual-generation behavior.

Later messages should state which issues changed, whether the recommendation changed, and what remains. Do not emit one full assistant report per child in addition to the dossier.

Use stable message keys. An update must return to the originating conversation even if another conversation is currently open. Returning later must reveal it without a new user prompt.

### Stop and resume

On Stop:

1. Persist stop_requested before cancelling tasks.
2. Stop scheduling new children.
3. Cancel only this parent's active children and writer.
4. Preserve completed calls, sources, partial text, packets, and already published revisions.
5. A late callback must not overwrite Stopped with Complete.
6. Release matter ownership. Do not stop unrelated saved requests.

On backend restart:

1. Initialize all required services, including the parent, chat history, and publication dependencies, before either normal research recovery or parent replay. Defer the existing early recovery calls if needed. Do not run recovery in the new service constructor. Make managed-child ownership visible before normal research recovery.
2. Recover saved publication receipts without new model or search calls.
3. Mark remaining in-flight parent/child work Interrupted.
4. Never mark a parent Complete just because no in-memory tasks exist.
5. Preserve unknown external-call outcomes and budgets.
6. Show Resume. Do not silently restart paid external calls.

Resume reconciles the parent with saved child records. Reuse exact child IDs and completed evidence. Only schedule unfinished work. If a previous call outcome is unknown, require retry_unknown=true from the explicit action and display that it may incur another charge. Other incomplete steps with saved results can resume without repeating a paid call.

Retry can supply retry_issue_ids containing only failed/unfinished children of this parent. Omission resumes all eligible unfinished work. Validate the IDs; never retry completed children or increase a spent budget. If an issue exhausted its allowance, a new research request is the route to more work.

A finished parent remains finished after restart. A completed publication can still have partial research coverage; retain that distinction.

## 11. Ordered implementation steps

Complete these steps in order. Each ends with passing targeted checks and an immediate update to handoffs/dossier-research-first.handoff-progress.md. Do not stop after scaffolding or after the first visible card.

New test files named below must be created as part of their step. They are not pre-existing proof. Tests must exercise behavior through real services and, for the lifecycle steps, the real API/runtime.

Run each command separately and capture its exit code. A later passing command must not hide an earlier failure.

### Step 1 — Record the baseline and repair the known test import

Read project instructions and the named architecture files. Inspect git status, existing local changes, and the current source. Run graphify query before code investigation as required by AGENTS.md.

Create output/dossier-research-first/ for this execution's evidence. Save an initial changed/untracked path inventory and hashes of the relevant source files. Record the real Harbor dossier hash and active-vault identity without printing credentials. Do not copy the whole vault or confidential transcripts into the report.

Change only the known import in frontend/lib/api.ts from ./modelSettingsRows to ./modelSettingsRows.ts. The current tsconfig permits this. If the actual file has materially changed, diagnose the new state before editing.

Start a synthetic fixture using the existing tests/fixtures/vault and AppContext test patterns. All later tests must use this fixture or a separately created temporary vault.

Verify:

~~~text
# backend working directory
.venv/bin/python -m pytest -q tests/test_dossier_generation.py tests/test_dossier_generation_chat.py tests/test_dossier_generation_integrity.py tests/test_dossier_research_continuity.py tests/test_output_citations.py tests/test_research_checkpoints.py

# frontend working directory; run separately
npm run typecheck
npm run check:document-reference-behavior
node --experimental-strip-types scripts/check-citation-reading.ts
~~~

Expected: all commands exit 0. The two named baseline warning classes are acceptable. Do not silently accept a newly failing behavioral assertion. Record any other pre-existing failure separately and continue independent work only under the blocker policy.

### Step 2 — Add the saved parent request contract

Create backend/app/models/dossier_request.py and the persistence portion of backend/app/services/dossier_requests.py. Implement validated read/create/update operations, sequence checks, idempotency, ownership, and compact status projection.

Add the dossier_research ChatCard variant in backend/app/models/api.py with a saved request ID and compact state. Do not remove or reinterpret existing card variants.

Add backend/tests/test_dossier_requests.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_requests.py
~~~

Required cases: create/read/reload; repeated identical action; same key/different payload conflict; cross-matter request rejection; stale sequence; malformed saved metadata; no tasks/model calls on GET; no budget reset on a malformed record.

### Step 3 — Build the preparation pass and issue map

Implement the bounded tools=None preparation call in dossier_requests.py. Add per-entry tolerant parsing. Store the exact plan and useful prose.

Add WorkspaceService.append_generated_issues with the narrow rules in section 6. Preserve save_issues behavior. Add tests for a request with an issue missing from the old canonical list and for a matter with fewer than three issues.

Add backend/tests/test_dossier_planning.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_planning.py tests/test_workspace_interactions.py
~~~

Required cases: three suggested priorities map to three distinct issues; all issues get initial answers; lawyer changes/skip; unknown model IDs; malformed optional plan; no research during preparation; repeated candidate application creates one issue; existing lawyer dispositions preserved; excluded context is not restored.

### Step 4 — Preserve full issue answers and history

Extend ResearchIssueUpdate parsing, prepare_publication, render_publication, publication_sources, and dossier capture according to section 7. Add view_version 3 with backward-compatible loading.

Update the research instruction contract so workers receive prior full analysis and produce full useful analysis. Do not change all agents' step limits. Keep the existing direct-research path working.

Add backend/tests/test_dossier_content_depth.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_content_depth.py tests/test_dossier_research_continuity.py tests/test_main_agent_research.py
~~~

Required cases: issue A has a meaningful multi-condition checklist; research B; regenerate; A's actual conditions, analysis, and evidence still appear. Update A and keep prior full analysis/history available. A short partial update cannot erase A's prior detailed answer. Missing latest packet and malformed optional fields preserve useful prose. Source counts come from records.

### Step 5 — Add parent-managed research children

Extend ResearchRunService with internal parent-managed creation/execution and matter ownership. Each issue must have a distinct child run, checkpoint, selected topic, and budget.

Update ResearchService.run, _execute, normal scheduling, stage restoration, and recovery to distinguish managed children. Preserve all normal-run behavior. Do not loosen publication freshness checks.

Add backend/tests/test_dossier_managed_research.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_managed_research.py tests/test_research_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_research_scope.py
~~~

Required cases: independent issue identities and budgets; managed result saves a packet without shared advice publication; standalone research remains serial; managed children cannot escape into normal startup publication; no fourth worker; ordinary research waits and resumes after the parent releases the matter.

### Step 6 — Execute first and remaining batches

Create backend/app/services/dossier_request_execution.py. Implement the first batch, the All continuation, failure isolation, compact progress, and persisted control state. Wire parent start/stop/wait operations to it.

Use event-controlled fake providers in tests. Assert actual concurrent starts before any worker is released; do not infer concurrency from elapsed wall time alone.

Extend backend/tests/test_dossier_requests.py and test_dossier_managed_research.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_requests.py tests/test_dossier_managed_research.py
~~~

Required cases: top-three starts exactly three distinct issues; All eventually researches five fixture issues; issue four starts after the first publication boundary; one child fails without cancelling the others; remaining issues receive their own full allowance; Stop prevents additional starts; duplicate Start returns the same children.

### Step 7 — Compose and publish one safe dossier per batch

Implement group publication and receipt replay. Extend generate_dossier only where needed for prepared-content replay and full issue-section composition. Preserve its existing saved-only caller contract.

Keep the current/proposed view separation. Advance expected hashes only after a known own publication. Handle independent edits with a review revision. Do not consume another operation's generation_pending marker.

Update the starter dossier-generation.md to explain the writer's role, preserved full analysis, reference labels, and proposed timing. Keep Uses: answer and existing editing/snapshot support.

Do not overwrite a customized installed skill. A missing starter can be installed normally. Update an installed default only if it exactly matches a known old starter and preserve its prior content; otherwise retain it and let the application's structural rules carry the new behavior. Do not edit the real Harbor skill as a test shortcut.

Add backend/tests/test_dossier_batch_publication.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_batch_publication.py tests/test_dossier_generation.py tests/test_dossier_generation_integrity.py tests/test_dossier_generation_chat.py
~~~

Required cases: three sibling results produce one combined proposed update; no sibling false-conflict; all five issue sections have actual answers; full detailed conditions survive a short overview; lawyer edit before/during writing is preserved; first-time creation checks basis; same publication retry creates no duplicate; failed writer returns saved issue analysis; reserved final response is reused.

Add date/provenance cases here or in test_dossier_content_depth.py: reported fact stays a fact; inferred assumption stays separate; conflicting administrative/event dates stay distinct; a supported anchor produces a correctly calculated proposed date; no anchor produces a clear gap; no legal deadline is invented.

### Step 8 — Repair traceability through saved output and rendering

Create dossier_references.py and integrate catalog binding before cleanup. Persist reference source records with the parent response, exact dossier revision, and applied canonical dossier when applicable.

Extend output cleanup with optional supplied reference context, keeping existing callers compatible. Read-only legacy display repair must use raw saved text. Add tolerant missing-reference behavior.

Wire source records into ClaimMarkdown in both chat surfaces and dossier/document readers. Reuse the evidence drawer. Show an exact record excerpt with its provenance; a file link alone is not an exact-record view.

Add backend/tests/test_dossier_references.py and extend frontend/scripts/check-citation-reading.ts plus check-document-reference-behavior.ts.

Verify:

~~~text
# backend
.venv/bin/python -m pytest -q tests/test_dossier_references.py tests/test_output_citations.py

# frontend; run separately
npm run typecheck
npm run check:document-reference-behavior
node --experimental-strip-types scripts/check-citation-reading.ts
~~~

Required cases: two facts cited in one sentence have different readable labels and correct records; five artifacts have their actual titles and paths; Q-style questions resolve; citation inside full analysis survives regeneration/reload; unavailable or ambiguous references remain honest; no external source counts are inflated by internal facts; malicious URLs/path traversal and another matter's ID are rejected. Test the renderer behavior, not only source-code string matches.

### Step 9 — Wire the actual chat, API, and runtime lifecycle

Create and register the new router. Route dossier_generation_chat.respond into preparation for unrestricted manual research-first requests. Preserve explicit preview and saved-only execution.

Instantiate the parent service in AppContext. Wire startup interruption/recovery, has_active_work, waiting, and shutdown behavior. Ensure normal research recovery skips managed children before it can publish them.

Extend response/history persistence so new cards and reference source records survive a completed chat run and a saved conversation GET. Do not make the chat run wait for all research.

Add backend/tests/test_dossier_request_api.py.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_request_api.py tests/test_chat_runs.py tests/test_dossier_generation_chat.py tests/test_research_lifecycle.py
~~~

Required cases through HTTP: Generate yields the saved setup card; Start returns 202 without waiting for model completion; polling is read-only; reload restores progress; explicit preview/source exclusion starts no unrestricted research; automatic refresh starts no research; normal chat still works; same action is idempotent.

Update old manual-generation tests deliberately to distinguish research-first setup from explicit saved-only writing. Do not change mock call counts blindly or remove old preservation assertions.

### Step 10 — Finish the setup and progress UI

Create frontend/lib/dossierRequests.ts and DossierResearchCard. Add API helpers in frontend/lib/api.ts and matching types in frontend/lib/types.ts where existing types live. Wire through ChatCards and both chat screens.

Implement scoped polling, exact publication refresh, normal source fields, accessible state words, first-pass link, and stop/resume actions. Preserve drafts, context, editor state, and scroll.

Add frontend/scripts/check-dossier-research.ts and register npm run check:dossier-research in frontend/package.json.

Verify:

~~~text
npm run typecheck
npm run check:dossier-research
npm run check:research-queue
node --experimental-strip-types scripts/check-citation-reading.ts
~~~

Required cases in pure-helper/render tests: legacy cards with no new fields, malformed status/source arrays without a page crash, scope/order serialization; no duplicate selection; first pass versus full completion; partial states; stale polling result ignored after conversation change; counts from saved data; Stop/Resume visibility; no erased draft on a background update. The browser test in step 12 must prove the actual component wiring.

### Step 11 — Prove interruption and publication recovery

Add backend/tests/test_dossier_request_lifecycle.py. Use the actual AppContext, real new routes, real coordinator, normal child harness, and controlled model/network boundaries.

Inject interruptions at these points:

1. Parent saved before first child creation.
2. One child created before its ID is copied to the parent.
3. Two children complete while one is still collecting.
4. A source call has an unknown outcome.
5. Writer response is saved before publication.
6. Recommendation saved before receipt.
7. Dossier saved before receipt.
8. Conversation saved before receipt.
9. Stop races with the last child completing.
10. A saved source snapshot is missing or corrupt.

Construct a fresh AppContext on the same temporary vault and resume through the API. Also test a completed parent across restart and create-stop-create reuse of the same matter.

Verify:

~~~text
.venv/bin/python -m pytest -q tests/test_dossier_request_lifecycle.py tests/test_research_checkpoints.py tests/test_research_publication.py tests/test_dossier_generation_integrity.py
~~~

Pass criteria: no repeated completed external/model calls, no duplicate children/publications/messages, budgets never decrease, unfinished items remain visible, unknown outcomes do not automatically retry, stop is durable, and fresh work can use the matter after recovery.

### Step 12 — Run the complete regression and browser proof

Create backend/tests/manual/serve_dossier_research.py using tests.manual.serve_research_investigation.make_app and the normal routers. Ensure that shared fixture helper includes the new dossier_requests router, as the production app does; do not test a private endpoint substitute. Fake only model/search/fetch boundaries. The fixture must use five issues from at least three subjects, for example employment, privacy, supplier contract, IP, and marketing.

Make the fixture support these explicit CLI options:
--port, --frontend-origin, --vault, and --reset.
Reset must refuse any directory it did not create as its own test fixture. Never permit the active vault as the fixture path.

For a reproducible browser session, use an execution-owned vault under output/dossier-research-first/browser-vault and verify the ownership marker before reset. Add delayed worker controls to demonstrate first-pass delivery and later updates.

Run all final code checks once after the implementation is stable:

~~~text
# repository root
graphify update .

# backend
.venv/bin/python -m pytest --junitxml=../output/dossier-research-first/pytest.xml

# frontend; run separately
npm run typecheck
npm run check:dossier-research
npm run check:research-queue
npm run check:document-reference-behavior
node --experimental-strip-types scripts/check-citation-reading.ts
PHASE2_DIST_DIR=.next-dossier-research-first-build npm run build
~~~

Do not broadly repeat the full suite after it passes unless later changes justify it. The earlier full suite took about sixteen minutes. Keep user updates while long commands run.

Check that the fixture ports are free. If they are occupied by another task, use a different free pair and record both changed URLs. Do not stop a process this execution did not start.

Launch the isolated fixture:

~~~text
# backend
.venv/bin/python -m tests.manual.serve_dossier_research --port 8199 --frontend-origin http://localhost:3199 --vault ../output/dossier-research-first/browser-vault

# frontend, separate terminal
NEXT_PUBLIC_API_BASE_URL=http://localhost:8199/api PHASE2_DIST_DIR=.next-dossier-research-first-dev npm run dev -- --port 3199
~~~

The author verified the existing serve_dossier_generation module pattern and Next environment variables; this new fixture CLI is a required implementation, not an already available command.

Browser acceptance script:

1. Open the fixture's experimental conversation and request Generate a dossier.
2. Inspect three proposed priorities, mapped issues, all five issue answers, and the source choice.
3. Change one priority and select All five. Start.
4. Observe three real controlled workers active, each for a different issue.
5. Release those workers. Open the first dossier while later issues are still running.
6. Confirm full conditions/checklists, citations, reported facts, and a proposed date with its basis.
7. Click two distinct internal references and an external passage. Confirm correct text and source versions.
8. Type an unsent chat draft and edit an open dossier/document.
9. Complete remaining research. Verify the draft/context survive and edits are preserved through a review revision.
10. Navigate away, reload, and return. Confirm exact progress and saved links.
11. In a second fixture request, stop mid-run. Restart the fixture backend with the SAME vault and without --reset. Resume and confirm completed work is reused.
12. Repeat the setup/progress/reload path in the standard matter chat.
13. Run an explicit saved-only refresh and a hypothetical preview. Neither starts new unrestricted research.
14. Confirm no duplicate recommendations, revisions, or completion messages.
15. Walk docs/ACCEPTANCE_TESTS.md. Record which existing scenarios were exercised and any remaining limits.

Save screenshots, relevant request/response summaries, actual model-call counts from the fake boundaries, and browser results under output/dossier-research-first/. Do not count a scripted source-string check as proof that a button works.

Update docs/living-dossier.md, docs/ACCEPTANCE_TESTS.md, and CODEX_HANDOFF.md with the resulting behavior, exact verification, and limits. Preserve historical evidence and correct any statement this feature now supersedes.

### Step 13 — Run one bounded real-model quality check and close the handoff

Deterministic tests prove the application works. They do not prove that a real model researches deeply or writes useful analysis.

When this execution prompt is used, run ONE configured-model exercise on a separate synthetic matter, with up to three issue workers using the existing per-issue limits. This is authorized by the execution prompt. Use only already configured providers and search methods. Do not change the workspace's selected model, buy credits, install tools, or use the real Harbor matter.

Use a synthetic business request with:
- Three distinct legal issues, and two other workstreams to keep visible.
- Supplied facts and one explicitly inferred assumption.
- A supported event date and an independently recorded administration date.
- At least one source with a material exception or condition away from its opening paragraph.
- A concrete vendor/access-loss dependency.
- No private customer, employee, or transaction data.

Use normal application source-choice records. The live check can combine a clearly labeled synthetic supplied contract with real public primary sources. Do not label a synthetic rule as real law or use fake network output as proof of live search. Record the test request and run IDs before launch so an interrupted session does not start a second paid evaluation by mistake.

Verify actual search and passage-read traces. A worker that only retrieves snippets must be labeled partial. Inspect whether the result contains the operative support, application, conditions, concrete next step, and retained other issues. Do not require invented numbers of legal sources or declare legal correctness from this test.

Measure preparation time, each issue's active time/call count, first useful dossier time, full request time, evidence reads, and publication count. If the provider does not expose costs, state cost unavailable; do not guess dollars.

Save the request, selected models, run IDs, output paths, trace summary, and a short quality assessment. This is a single bounded check, not an open-ended benchmark. Do not loop paid evaluations until the prose looks attractive. A failure should lead to a focused diagnosis and a clearly recorded remaining limit.

If configured provider/search access is unavailable, finish all independent code, test, and documentation work. Mark the live-quality item blocked with the exact missing dependency. Do not silently substitute mock output and declare it passed. Report implementation status separately from that unmet check.

Review the final diff against the initial working-tree inventory. Confirm that the real Harbor dossier hash and active configuration were not changed by testing. Remove only execution-owned temporary test processes and artifacts that are clearly disposable; keep verification evidence.

Write output/dossier-research-first/verification.md with:
- Implemented behavior.
- Files changed by this execution, separate from prior dirty work.
- Tests/commands, exit codes, and artifact links.
- Browser results.
- Real-model observations and limits.
- Any remaining defect/blocker.
- Whether all acceptance items are done.
- Exact next step if work remains.

Then update the progress file. Do not commit, push, merge, or deploy unless the user separately asked for it.

## 12. Progress and resume protocol

The build tracker is:
handoffs/dossier-research-first.handoff-progress.md

This tracks implementation, not the application's research tasks. The application's separate parent request/checkpoints track runtime research.

Before starting or resuming:

1. Read this plan and the complete progress file.
2. Read the current project instructions.
3. Inspect git status and the current files named by the active step.
4. Start at the first pending or in-progress step. Do not reapply done edits.
5. Verify the most recent completed step's relevant checks and inspect its evidence. If the saved result has drifted materially, report the conflict; do not reset the files or blindly repeat edits.
6. Reconcile an interrupted test process before starting a duplicate full run.

After EVERY step:

1. Run that step's checks.
2. Save command/exit-code evidence under output/dossier-research-first/step-NN.md.
3. Change only that checklist row to done when its checks pass.
4. Update Current position with the next step, in-flight processes, changed paths, decisions, and blockers.
5. Write the next exact command/action before a context reset or interruption.

For an interrupted step, leave the box unchecked and use IN PROGRESS. For a failed check, use FAILED with the reason. For an unavailable external dependency, use BLOCKED with what is missing. Never reset completed rows to pending just because the session changed.

Each evidence file must contain:
- Step number and date/time.
- Result: done, in progress, failed, or blocked.
- Files changed by that step.
- Commands actually run, exit codes, and concise results.
- Relevant fixture/run IDs and file paths.
- Any intentional test expectation change and why.
- Safe next action.

No migration here should require an uncontrolled rerun. Use desired final states, revision checks, deterministic request/child identities, and publication receipts. If a one-time operation is needed, label it NOT RERUNNABLE and record its exact result before continuing.

The same one-shot prompt can be used again after interruption. The progress file determines where execution resumes.

## 13. Guardrails and blocker policy

- Implement the full specified flow. Do not stop at a plan, scaffold, fake progress display, or three agents that never feed the dossier.
- Do not hardcode Harbor names, legal rules, counts, market states, source titles, or conclusions into production code.
- Do not claim a source was read without a saved read.
- Do not discard useful text because optional model structure is malformed.
- Do not add legal perfection gates, verifier agents, votes, or generic refusals.
- Do not change provider/model settings. Opus 4.8 is the implementation model, not a required application provider.
- Do not add dependencies unless a demonstrated blocker cannot be solved with the existing stack; report that blocker first.
- Do not start coding subagents. This plan is ordered for one executor. The requested three agents are application research workers.
- Do not change the original request, reported facts, lawyer issue status, accepted decisions, or real client data to make tests pass.
- Do not disable hash/version checks, broaden source scope, overwrite lawyer edits, or accept proposals automatically.
- Do not remove failing tests, skip new acceptance checks, or weaken meaningful assertions merely to obtain green results.
- Do not rewrite unrelated modules or reformat broad files.
- Do not commit, push, merge, deploy, send messages, purchase credits, or create automations.
- All application file access uses VaultService and stays inside its configured VAULT_PATH. Repository code, handoff, and test-evidence files are normal development artifacts.
- Preserve all pre-existing dirty and untracked work.

Continue through safe, reversible uncertainty that can be resolved from the named code. Record a small decision when needed. Do not ask the user again about a default already specified here.

Stop the affected step, preserve all work, and report the concrete blocker if:
- A required permission, credential, dependency, or source is unavailable.
- Current code differs materially enough that the plan would overwrite another implementation.
- Instructions materially conflict.
- A targeted verification still fails after focused diagnosis and a safe fix cannot be established.
- Proceeding would require an irreversible action outside this prompt.

Warnings and unrelated pre-existing failures are not a reason to abandon independent authorized work. They must remain visible in the final report. A partial implementation is not complete.

## 14. Opus 4.8 execution guidance

Use a capable coding session with repository and shell access. This is a complete specification; do not reconstruct the requirements from prior chat.

If the execution host supports Opus 4.8 effort settings, xhigh is the recommended setting for this task. Keep the user's actual selected model; do not change application settings to match it. Give short progress updates focused on findings and next steps. Use tools to inspect, edit, and verify rather than returning a proposed implementation.

This prompt uses explicit scope, ordered work, observable checks, and concise progress instructions in line with [Anthropic's Opus 4.8 prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8). No context-window size, pricing, or host support is assumed.

Work through all steps, update the tracker after each one, and finish with observed evidence. Before any pause, save enough state for a fresh session to continue without this conversation.
