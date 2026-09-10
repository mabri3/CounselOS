# Explicit problem decomposition — implementation blueprint

Prepared September 10, 2026. Repository: `/Users/bharris/Programs/counsel-os-mvp`.
Target executor: Sol medium or Astra light (the host exposes Astra effort as `low`). Keep the user's selected coding model. Do not change the application's provider settings.
Status: plan only. No application implementation is claimed.

## 1. Outcome and scope

Make the main counsel agent explicitly construct, test, and revise its understanding of a matter. The lawyer must be able to inspect how the business decision breaks into factual and legal questions, why each question matters, what evidence supports the current view, what could change it, and how the parts combine into practical options.

This is more than extracting facts or producing an issue list. It includes:

1. Distinguish the business objective from the proposed method and the stated legal question.
2. Test whether the question contains an unsupported premise. Propose a reframe when useful; do not silently change the controlling question.
3. Describe the actual activity: actors, actions, relationships, geography, timing, and flows of data, money, goods, or obligations where relevant.
4. Break compound factual statements into independently understandable propositions without losing their source, qualifications, or relationships. Do not split every sentence mechanically.
5. Identify plausible legal characterizations. A business label does not decide the legal category.
6. Break legal questions into applicability, definitions, requirements, exceptions, and consequences. Use applicable contracts and company policies as well as public law.
7. Connect each retained issue to facts or an explained material unknown. Check for omitted and interacting issues.
8. Test important conclusions against adverse facts, alternative interpretations, and fact changes that would reverse or qualify the answer.
9. Prioritize research and business questions by their expected effect on the decision.
10. Recombine the parts into a practical answer and feasible alternatives, including changes to the proposed design.
11. Revisit the structure when facts, sources, the business question, or law change. A change may invalidate the original decomposition, not merely one answer.

The main agent performs this work within the existing chat/research loop. The implementation must not introduce a separate decomposition agent, legal verifier, workflow engine, automatic legal monitoring service, or mandatory intake questionnaire. Useful answers remain available when structure or tools fail.

### Payoff demonstration

The lawyer submits an ambiguous product request. The answer identifies the real decision and a small set of linked subquestions. A later fact defeats an initial assumption. The saved breakdown changes, a newly relevant issue appears, and the lawyer sees exactly why the overall recommendation changed. Refreshing the page preserves both the new breakdown and the earlier evidence. No business fact or decision is invented.

### Research basis and limits

The sources support a method, not a proven AI improvement:

- [Georgetown, The Art and Craft of Strategic Legal Research](https://www.law.georgetown.edu/wp-content/uploads/2018/02/strategicresearch.pdf): organize the factual situation; split the problem into fact-specific questions; research threshold questions first; revise research as understanding develops.
- [ABA, Guideline B-3 on Investigation](https://www.americanbar.org/groups/legal_aid_indigent_defense/resource_center_for_access_to_justice/standards-and-policy/updated-standards-for-the-provision-of-civil-legal-aid/appendix/guideline-b-3-on-investigation/): connect facts to issues and client objectives; investigate missing and unfavorable information; test strategy against new facts.
- [ABA, Guideline B-4 on Legal Analysis and Research](https://www.americanbar.org/groups/legal_aid_indigent_defense/resource_center_for_access_to_justice/standards-and-policy/updated-standards-for-the-provision-of-civil-legal-aid/appendix/guideline-b-4-on-legal-analysis-and-research/): facts guide research, research suggests alternative theories and further investigation, and the process continues as the case develops.

Much of this guidance addresses litigation or legal aid. Adapt its analytical method to product counseling. Do not import conflict screening, litigation discovery, adversarial procedure, or supervisory approval as new product requirements.

## 2. Existing code and boundaries

Read `AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`, `current.md`, `docs/DESIGN_LANGUAGE.md`, `docs/decision-map-redesign.contract.md`, `docs/living-dossier.md`, and `docs/research-source-choices.md`. Read `frontend/AGENTS.md` and the relevant installed Next.js documentation before frontend edits. Older plans are context; this blueprint defines this change.

The working tree contains extensive uncommitted research, dossier, and frontend work. Those changes are the starting point. Do not reset, clean, stash, restore, or replace them. Do not run bulk migrations against any real vault. Test on copied fixtures with the scheduler and public search disabled unless a specific live test explicitly uses configured source permissions.

Verified integration points:

| Existing file / symbol | Role in this build |
|---|---|
| `backend/app/agents/context.py::ContextBuilder.build_system` | Loads runtime-owned built-in contracts; appends shared main-agent instructions for counsel. Add the shared decomposition contract for intake and counsel, without changing custom agents. |
| `ContextBuilder.build_run_context` | Freezes supplied context, exclusions, manifest, publication baseline, and `issue_analysis_capture`. Add a matter-level capture and a bounded prior decomposition projection. |
| `backend/app/services/research_execution.py::MAIN_AGENT_CONTRACT`, `INVESTIGATION_CONTRACT` | Existing single-main-agent reasoning and evidence loop. Make decomposition part of this loop, including revisiting it after research. |
| `backend/app/agents/runner.py::RunnerExecutionState` | Already includes `raw_final_output`, frozen context, and recovery state. Preserve optional decomposition transport in every final/recovery path. |
| `backend/app/agents/output.py::_STRUCTURED_OUTPUT` | Protects existing structured fences during output cleanup. Add the new transport without removing existing claim/decision/research structures. |
| `backend/app/tools/handlers.py::update_matter_intake` | Applies intake, returns saved record IDs, and conditionally advances `intake_publication_baseline` after the turn's own writes. Extend narrowly for decomposition's observed input basis. |
| `backend/app/models/api.py::IntakeTurn` | Already has facts, issues, assumptions, missing facts, and questions. Keep its public shape unchanged; decomposition uses final-output transport. |
| `backend/app/services/matter_records.py::apply_intake_turn` | Persists typed facts and merges intake issues. Reuse unchanged semantics; do not make generated decomposition another fact-ingestion path. |
| `backend/app/services/workspace_actions.py::WorkspaceActionsService.publish_result` | Saves inquiry prose first, validates optional claim/decision structure, then updates pointers. Extend with independent optional decomposition publication. |
| `backend/app/routers/chat.py::execute_chat` | Publishes intake and read-only inquiry results in conditional branches. Add explicit decomposition publication for eligible actual-matter answers after typed mutations too. Keep artifact, scenario, preview, and no-save boundaries. |
| `backend/app/services/issue_analysis.py::IssueAnalysisService` | Existing exact saved tests, conditions, options, references, and freshness checks. Reuse its pattern; do not replace it or store a second version of legal tests in the new map. |
| `backend/app/models/workspace.py::LegalTest`, `PathCondition`, `IssueOption`, `IssueConnection` | Already represent rule applicability, exceptions, fact links, options, and cross-issue effects. Keep their identities and decision semantics. |
| `backend/app/services/workspace.py::WorkspaceService.get`, `issues`, `save_issues`, `business_question` | Snapshot projection, canonical issues, and question authority. Add an optional problem-analysis projection. Never rewrite question text from model transport. |
| `backend/app/services/main_agent_research.py::run_main_research` | Runs counsel in the existing evidence phase, preserves raw final output and frozen context. Add decomposition transport and preserve it on resume. |
| `backend/app/services/research.py::ResearchService.run` | Extracts optional output, saves research packet and issue analyses. Publish decomposition onto this same packet after its final prose/hash is known. |
| `backend/app/services/research_runs.py` | Freezes queued research inputs. Add the same bounded prior map/capture to queued and direct research. |
| `backend/app/services/research_publication.py` | Separates recommendation, dossier, and conversation effects. Add a replay-safe decomposition receipt; keep existing stale/review-only protection. |
| `backend/app/services/recommendations.py`, `backend/app/services/dossier.py` | Keep recommendation proposal/acceptance and lawyer edit rules. A generated analysis map does not accept a recommendation or overwrite lawyer prose. |
| `frontend/lib/workspaceTypes.ts::WorkspaceSnapshot` | Add an optional typed decomposition status. Old responses remain valid. |
| `frontend/components/workspace/UnderstandPanel.tsx` | Add a compact shared breakdown component below orientation. |
| `frontend/components/experimental/ExperimentalChat.tsx` | Already loads `WorkspaceSnapshot`. Expose the same breakdown in an expandable panel beside the existing conversation tools. |
| `frontend/components/workspace/ClaimMarkdown.tsx` | Existing structured-output display handling. Hide valid transport, preserve substantive prose and a useful failure indication. |

Current signature anchors (re-read before editing):

```python
WorkspaceActionsService.publish_result(self, matter_id, *, run_id, text,
    source_revisions, expected_question_revision, structure=None, sources=None,
    source_action_key=None, target=None, frozen_context=None,
    update_current_snapshot=True)
IssueAnalysisService.capture(self, matter_id, issue_id=None, *, frozen_context=None)
IssueAnalysisService.publish(self, matter_id, *, path, run_id, output_revision,
    structure, capture, claims=None)
IssueAnalysisService.resolve(self, matter_id, issue_id)
ContextBuilder.build_run_context(self, agent, *, matter_id=None, active_file=None,
    run_id="", created_at=None, selections=None, target=None, attachments=None,
    applied_notes=None, expected_question_revision=None, budget=60000)
WorkspaceService.save_issues(self, matter_id, nodes, *, expected_revision)
```

The intake publication branch currently admits only scope selection, local reads, and `update_matter_intake`. The ordinary inquiry branch also excludes most mutation turns. Do not assume adding a parser to `publish_result` will wire the feature into substantive advice turns that save recommendations or facts.

## 3. Chosen architecture

Use one new **optional matter-level projection** called `problem_analysis`. Save it in the frontmatter of the existing inquiry or research Markdown output. Store only its current reference in `workspace.md`. There is no separate database table or mutable `analysis-map.md` source of truth.

This projection adds the business/factual decomposition missing above existing issue-level analysis. It references canonical facts, sources, questions, issues, and exact issue analysis where available. It does not duplicate the existing facts ledger, rule/condition/option models, recommendations, or decisions.

```text
Actual intake / matter conversation / authorized research
  -> existing frozen context + prior problem breakdown
  -> existing main agent decomposes, investigates, revises, and answers
  -> useful Markdown + optional problem-analysis JSON fence
  -> existing inquiry or research output saved first
  -> validate optional projection, save exact version beside output
  -> conditionally advance workspace pointer
  -> one shared “Problem breakdown” UI, with links to existing records
```

No extra LLM call is required to parse, repair, judge completeness, or publish the map. Do not perform hidden full analysis on page load or upload. A relevant submitted turn performs reassessment. A direct record edit makes the old map show `Needs review` on the next read; the existing conversation action can request reassessment.

### 3.1 Reasoning contract

Add `backend/app/services/problem_analysis_contract.py` with one shared contract constant. It must state the eleven outcomes in section 1 in direct instructions and include these operational rules:

- Scale to the matter. A simple question can have one subquestion. A wording edit or unrelated conversation need not generate a map.
- Before the first substantive external collection, formulate a provisional breakdown and let it guide the actual requested propositions. Record a concise planning summary in the existing assistant/tool-loop journal when useful. Do not request private chain-of-thought or expose internal deliberation.
- Do not assign a legal category solely from the user's label. Keep plausible characterizations tentative until supported. Do not invent law, sources, factual certainty, dates, owners, or jurisdiction.
- First identify what happened or is proposed. Then examine applicable rules and exceptions. Revise the facts-to-questions mapping as sources reveal distinctions. Preserve relations across the parts.
- An unknown is useful when its answer could change the analysis. Explain that consequence. Use existing question cards, at most one question at a time in step-by-step mode; preserve grouped intake's existing short-set behavior and skip/stop controls.
- A credible competing interpretation is useful when the facts support one. Do not manufacture one for every issue or impose a fixed number of issues.
- Check whether the initial question omits a material activity, relationship, jurisdiction, timing issue, or interaction. Record only material inclusions, exclusions, and unresolved coverage gaps with reasons. Never claim exhaustive coverage.
- Finish with an integrated answer and practical alternatives, not just a plan or populated map.
- New facts/law can add, split, merge, retire, or reframe subquestions. Explain material changes and unchanged conclusions. Do not silently close canonical issues or change recorded decisions.
- Decomposition output is generated analysis. Quoted documents are sources; assumptions are not reported facts. A legal proposition must not become a business fact.
- Keep existing source permissions, citation honesty, scoped tool access, execution limits, and useful-output fallback.
- Append optional transport only when a material breakdown was created or reassessed. If unavailable, deliver the answer; do not ask the user to repair JSON.

Built-in intake and counsel must get this contract in existing and new vaults. Use `ContextBuilder.build_system`, not only blank-vault Markdown. Update `backend/app/blank_vault_template/00_System/agents/intake-agent.md` and `counsel-copilot.md` to agree. Do not rewrite user-owned runtime vault files. Keep custom-agent permissions unchanged.

### 3.2 Proposed data contract

New models live in `backend/app/models/problem_analysis.py`. All names in this subsection are **new**, not pre-existing symbols. Use Pydantic and existing project conventions, no dependencies. Strict enums; reject extra provider keys in the new payload. Defaults permit missing optional lists. Validate useful nonempty strings where required.

Provider transport:

````text
Useful answer in Markdown.

```problem-analysis
{"schema_version":1,"objective":"Improve support quality","proposed_method":"Use customer chats to train a support tool","framing_note":"The use and recipient must be distinguished before assessing permission.","parts":[],"questions":[],"coverage":[],"changes":[],"integrated_answer":"Assess internal use and vendor reuse separately before choosing the deployment design.","alternative_paths":[],"next_step":"Establish whether the vendor uses inputs for its own purposes."}
```
````

The empty arrays above illustrate transport only. They are not a passing substantive output for a complex case.

Define these nested records:

| Record | Exact fields |
|---|---|
| `ProblemReference` | `kind`: `fact`, `source`, `question`, `issue`, or `decision`; `record_id`: string. Resolve server-side. No provider-authored paths or revisions. |
| `ProblemPart` | `key`, `label`, `description`: strings; `category`: `activity`, `actor`, `relationship`, `flow`, `timing`, or `constraint`; `status`: `reported`, `assumed`, `disputed`, or `unknown`; `references`: list of ProblemReference. |
| `ProblemQuestion` | `key`, `question`, `why_it_matters`: strings; `kind`: `business`, `fact`, `applicability`, `characterization`, `requirement`, `exception`, or `consequence`; `part_keys`: list of local part keys; `issue_id`: optional canonical issue ID; `parent_key`: optional question key; `depends_on`: list of question keys; `characterizations`: list of short strings; `assessment`, `counterpoint`, `answer_changing_fact`: strings default empty; `state`: `open`, `conditional`, `answered`, or `not_relevant`; `priority`: `decision_changing`, `supporting`, or `deferred`; `references`: list of ProblemReference; `next_action`: `ask_business`, `research`, `inspect_source`, or `none`; `next_action_reason`: string. |
| `CoverageNote` | `topic`, `reason`: strings; `state`: `included`, `not_relevant`, or `unresolved`; `part_keys`, `question_keys`: lists. |
| `ProblemChange` | `kind`: `added`, `reframed`, `split`, `merged`, `retired`, `assessment_changed`, or `no_material_change`; `prior_question_keys`, `current_question_keys`: lists; `reason`, `answer_effect`: strings; `references`: list of ProblemReference. Prior keys refer only to the captured prior map. |
| `ProblemAlternative` | `title`, `proposed_change`, `benefit`, `tradeoff`, `remaining_condition`: strings; `question_keys`: list of local question keys. This is a proposed design path, never a recorded decision. |
| `ProblemAnalysisPayload` | `schema_version: Literal[1]`; `objective`, `proposed_method`, `framing_note`: strings; `parts`, `questions`, `coverage`, `changes`, `alternative_paths`: lists; `integrated_answer`, `next_step`: strings. Require objective and integrated_answer to be nonempty. |

Limits are transport bounds, not required counts: maximum 40 parts, 40 questions, 20 coverage notes, 20 changes, 10 alternatives, 20 references per item; 4,000 characters per narrative field; 200,000 characters for the fence. Do not truncate silently; reject invalid optional payload with a warning and preserve prose. No minimum issue count.

Server envelope `SavedProblemAnalysis` adds `analysis_id`, `analysis_revision`, `matter_id`, `run_id`, `source_path`, `output_revision`, `captured_at`, `input_basis`, `prior_reference`, `resolved_references`, and `warnings`. Model output cannot set these. Keep provider keys local to this version. Derive stable analysis ID from matter/run identity and revision from normalized payload plus frozen basis. Identical retry is a no-op; different content for the same saved run conflicts.

`ProblemAnalysisStatus` contains `state` (`not_analyzed`, `saved`, `partial`, `needs_review`, `missing`, or `historical`), optional `analysis`, optional `reference`, and `warnings`. Add it as optional/default-null `WorkspaceSnapshot.problem_analysis` in Python and TypeScript. `saved` means stored on the stated input basis, not legally verified or lawyer accepted. Use `partial` for a saved map with validation downgrades or explicitly unresolved coverage; unanswered business questions alone do not make transport invalid. An empty first-run map is `not_analyzed`; a structurally valid but thin map is not evidence of good reasoning.

### Populated shape example

This is a synthetic shape example, not legal advice or the expected wording of production answers. Test setup must replace `FACT_VENDOR_USE` with the actual ID returned by its fixture record creation. All omitted list fields use their declared defaults. This example shows one slice, not the whole initial matter.

```json
{
  "schema_version": 1,
  "objective": "Improve the quality of support responses",
  "proposed_method": "Provide customer chats to the support-tool vendor",
  "framing_note": "Internal evaluation and vendor reuse are different activities to assess.",
  "parts": [
    {
      "key": "vendor_reuse",
      "label": "Vendor reuse of chats",
      "description": "The vendor retains inputs for training its general model.",
      "category": "activity",
      "status": "reported",
      "references": [{"kind": "fact", "record_id": "FACT_VENDOR_USE"}]
    }
  ],
  "questions": [
    {
      "key": "vendor_purpose",
      "question": "What does the vendor do for our purposes and for its own purposes?",
      "kind": "characterization",
      "why_it_matters": "The earlier internal-use description does not cover the reported reuse.",
      "part_keys": ["vendor_reuse"],
      "issue_id": null,
      "characterizations": ["Processing for our support service", "Reuse for a separate vendor purpose"],
      "assessment": "The supplied fact requires assessment of the separate reuse arrangement.",
      "counterpoint": "The contract may restrict reuse despite a broad product description; inspect the actual terms.",
      "answer_changing_fact": "Whether reuse can be disabled and whether that restriction is reflected in the governing terms.",
      "state": "conditional",
      "priority": "decision_changing",
      "references": [{"kind": "fact", "record_id": "FACT_VENDOR_USE"}],
      "next_action": "inspect_source",
      "next_action_reason": "Inspect the supplied contract before deciding which arrangement to assess."
    }
  ],
  "coverage": [{"topic": "Vendor's separate reuse", "reason": "Newly reported purpose extends beyond internal evaluation.", "state": "included", "part_keys": ["vendor_reuse"], "question_keys": ["vendor_purpose"]}],
  "changes": [{"kind": "added", "prior_question_keys": [], "current_question_keys": ["vendor_purpose"], "reason": "New reported use was absent from the earlier description.", "answer_effect": "The pilot recommendation must now address the reuse arrangement.", "references": [{"kind": "fact", "record_id": "FACT_VENDOR_USE"}]}],
  "integrated_answer": "Assess the reuse terms before relying on the earlier internal-use recommendation.",
  "alternative_paths": [{"title": "Pilot with reuse disabled", "proposed_change": "Seek a service configuration and terms that exclude vendor training reuse.", "benefit": "Addresses the newly identified activity directly.", "tradeoff": "Availability and commercial impact are not yet known.", "remaining_condition": "Confirm configuration and contract terms.", "question_keys": ["vendor_purpose"]}],
  "next_step": "Read the governing vendor terms already supplied to the matter."
}
```

#### Link and integrity rules

- Validate all local keys for uniqueness and all local references for existence. Reject self-parenting and cycles in `parent_key` or `depends_on`. These are static explanation links, not an execution graph.
- A supplied canonical ID must belong to the matter and the captured permitted context, or a recorded same-run tool result. Never bind unknown IDs by fuzzy matching or accept another matter's fact.
- Resolve source references to exact supplied/saved versions. A link is not a claim of verification. Preserve source class and availability in the resolved reference.
- A `reported` part needs a reference to a reported fact or a user-supplied source available in the run. This means reported in a source, not independently verified. Otherwise retain it as `assumed` with a warning; never insert a new canonical fact.
- Newly spotted questions can have no canonical issue ID. Show them as **New issue to assess**. They remain first-class visible subquestions in the saved map. Do not invent an issue ID or silently modify a lawyer's issue disposition. Existing intake issue creation continues unchanged.
- For a linked existing issue, show existing exact `IssueAnalysisStatus` tests/conditions/options through links. Do not copy those values into a competing rule tree. The question's assessment is a short contextual explanation, not an alternative canonical condition state.
- Unlinked new questions must remain usable for focused conversation. Pass their exact saved map reference and question text through the existing conversation instruction, not an invalid `ConversationTarget.issue_id`.
- Malformed payload, foreign links, duplicate keys, or cyclic structure: reject the optional map as a unit; save useful prose and retain the prior valid pointer. `reported` without support is the one explicit safe downgrade above. Do not partially adopt a misleading dependency graph.

### 3.3 Storage service and freshness

Add `backend/app/services/problem_analysis.py` with:

```python
extract_problem_analysis(text: str) -> tuple[str, dict | None, list[str]]

class ProblemAnalysisService:
    def __init__(self, vault, matters, workspace=None): ...
    def capture(self, matter_id, *, frozen_context) -> dict: ...
    def publish(self, matter_id, *, path, run_id, output_revision,
                structure, capture, current_eligible=True) -> dict: ...
    def resolve(self, matter_id) -> dict: ...
    def load(self, matter_id, *, reference) -> dict: ...
```

Use existing `serialized` locking and VaultService path validation. Keep normalization helpers in `backend/app/services/problem_analysis_validation.py` if needed to keep files focused. Do not extract a generalized graph/storage framework.

Capture includes: controlling business question identity/text/revision; supplied canonical facts and open assumptions; relevant issue text and links; answered/open supporting questions; selected source and company/playbook content identities; exact unsaved selections; existing recorded decisions relevant to supplied context; prior map reference; exclusions; and capture time. Store enough normalized input to compare what changed. Reuse the context manifest/projection pattern in `IssueAnalysisService`, but do not call private issue-specific methods against a fabricated issue.

Hash input content, not mutable output. Exclude dossier-generated orientation, recommendation publication timestamps, current map pointers, claim-link maintenance, and the new output itself. Otherwise every publication immediately invalidates itself. Keep recommendation text as labeled context, but do not treat an agent's same-run recommendation save as a changed business fact. Preserve explicit lawyer corrections and selected recommendation versions as provenance.

Only actually supplied inputs may ground the map. A hidden or excluded file cannot leak back through a saved map summary. If a prior map relies on excluded sources, omit the affected generated summary; if lineage is uncertain, omit the prior map and state that in the manifest. Do not imply the whole vault was considered when context was limited.

Publication sequence:

1. The caller saves final useful prose and computes its existing output revision.
2. Validate that output path is inside this matter, run identity matches, and exact prose hash matches. Do not trust provider paths.
3. Parse and validate optional map. Save the server envelope in the output's Markdown frontmatter under `problem_analysis`. Never replace different saved content for the same run.
4. Re-read `workspace.md` under the existing lock. Compare captured inputs with current canonical inputs. Also compare the captured prior pointer, so an older run cannot replace a newer result merely because facts did not change.
5. If current and eligible, write `workspace.md` metadata `problem_analysis_reference` only. Preserve all other metadata and prose.
6. If stale, scope-limited, or concurrent advice changed in a way that existing publication treats as review-only, retain the saved output as historical. Return its link and reason. Do not advance the current pointer.
7. Return independent saved/projection receipts and warnings. If pointer update fails after output save, retry only that effect; do not regenerate or research again.

The resolver is read-only. Recompute input freshness, validate exact referenced output, and return `needs_review` when material input changed. A missing/corrupt map cannot hide the matter or its answer. Old matters return `not_analyzed`; no migration or model call occurs.

#### Changes during a run

Do not capture a fresh basis at the end and pretend the model saw it. Initial capture stays frozen. After an existing typed tool saves facts/questions that the same run actually receives, advance only those input entries using a trusted receipt and a before/after revision check. Mirror the existing intake baseline technique, including its concurrent-change protection. Persist this amendment in the existing run's frozen context/checkpoint so resume sees the same basis.

If the pre-tool baseline already differs, keep the answer historical. Never forgive unrelated concurrent changes. If a tool gives only IDs without the actual saved text, read the records through existing permitted tools before treating them as observed. If observation cannot be established, retain the map with an earlier-basis label.

## 4. Trigger behavior and publication wiring

| Event | Required behavior |
|---|---|
| Initial intake | Provisional business/factual breakdown; ranked material questions; useful first answer. Final map survives `update_matter_intake` writes. |
| Intake answer | Reassess affected subquestions; preserve exact reported answer through existing save path; do not ask answered questions again. |
| Ordinary actual-matter advice | Use and revise the prior map when material. Save optional map even when the answer also saves a recommendation. No extra research job for a supported local answer. |
| Simple wording edit/unrelated chat | No compulsory decomposition, question card, or research call. |
| New fact/source submitted in actual scope | Compare with prior assumptions and questions; add/reframe/retire as needed; state answer effect. A document upload alone is a source, not confirmed facts. |
| Direct file/fact edit outside chat | Read-only freshness marks Needs review; user can request reassessment through existing chat. No unsolicited background model run. |
| Authorized research | Provisional questions guide collection; research can revise the whole breakdown; final map lives on the same saved packet. |
| Newly supplied law | Establish actual source, status, scope, jurisdiction, effective date, relevant definitions/exceptions, and temporal applicability as available; connect to activities and decisions. Unknown stays unknown. A proposed rule or an out-of-scope update is not automatically applicable law. |
| Irrelevant change | Preserve the substantive answer; record concise no-material-change explanation when reassessed. No duplicate issues or tasks. |
| Scenario, preview, draft/artifact-only work, explicit no-save | May discuss a breakdown in prose; do not update current actual-matter map. Retain existing scenario and artifact save behavior. |
| Existing decision affected | Explain the reason to revisit and link the decision. Do not revoke, replace, accept, or change its disposition. |

Chat changes must use the same existing inquiry publisher once per run. Add optional `publish_problem_analysis`/eligibility parameters only if required to keep existing answer-snapshot rules separate. For an actual-matter mutation turn with valid transport, save an inquiry with `update_current_snapshot=False` and publish only eligible decomposition. Do not call `publish_result` twice for the same run. Do not broaden the existing generic short-answer snapshot mutation guard.

Extract transport before user-facing cleanup alters IDs or payload. Preserve `problem-analysis` through the shared runner output protection and final-limit recovery. Retain a separate raw/parsed structure while returning cleaned prose to the conversation. Frontend must not display valid JSON as the answer. With malformed structure, preserve substantive prose and a short warning; raw malformed text may remain in the saved diagnostic output but must not replace the useful answer.

Research must use the existing packet's **final saved body** and hash, after wrappers/citation sections. Do not hash raw provider prose and attach that revision to a different saved packet. Keep the existing `decision-paths`, `claim-support`, and `research-synthesis` extractors composable in any fence order. Add an independent receipt to existing publication; retries reuse saved raw/parsed output. No duplicate packet, map, recommendation, or conversation message.

## 5. User interface

Add `frontend/components/workspace/ProblemBreakdown.tsx` and `frontend/lib/problemAnalysisTypes.ts`. Both normal Understand and experimental chat use this component. Use existing semantic tokens and ordinary disclosure controls; no new graph canvas or page.

Default view: a compact expandable **Problem breakdown** control, a state word, saved date, and the next useful step. The main answer remains first. Expanding shows:

1. Business objective, proposed method, and any suggested reframe, labeled as a suggestion.
2. Parts of the situation, with reported/assumed/disputed/unknown labels and source links.
3. Subquestions in priority order, with why each matters, current assessment, what would change it, and next action. Show parent/dependency relationships in plain text. Linked issues open their existing review; new ones show New issue to assess.
4. A collapsed coverage section for important inclusions, exclusions, and unresolved gaps.
5. Practical alternatives and the integrated answer.
6. What changed from the exact prior saved breakdown, with links to prior output and affected records.

Use `Needs review` for changed inputs and show the reason. Missing/partial map must not hide the answer. Do not show `Complete`, `Verified`, a completeness percentage, or a confidence score. Show `Saved analysis` for a current generated map.

Support correction through the existing conversation and record editors. Add **Discuss this question** and **Reassess breakdown** callbacks that prefill or invoke the existing conversation action without silently submitting factual answers. Preserve unsent composer text and selected document. Do not create a separate map editor or allow a model payload to rewrite lawyer corrections. Read-only historical map views remain available through the existing saved output link.

For source navigation use existing document/evidence callbacks and matter validation. Never fabricate a hyperlink from an arbitrary provider path. In experimental chat, the panel must use the same `workspace` refresh result already used for claims. It must survive research completion refresh without clearing a draft.

## 6. Strict execution order

All steps describe idempotent desired final states. No commits, pushes, deployments, or external messages are requested. The new test files listed below do not exist yet; the executor writes them. Their commands are proposed checks, not author-run evidence.

### Step 1 — Establish the baseline and executable examples

Read the required context and named functions. Record `git status --short` in `docs/problem-decomposition.verification.md` without copying sensitive data. Inspect current contracts; ordinary line drift is not a blocker. A material architecture change requires a plan note before dependent edits.

Run the focused baseline command in section 8 and frontend typecheck. Capture two pre-change configured-model outputs on synthetic fixtures if the provider is available: initial ambiguous chat use and the later vendor-own-use fact. Save prompts, model selection, supplied context, and responses under `output/problem-decomposition/`. Do not use client vaults or change provider defaults. If live access is absent, record that limitation and continue deterministic work.

Done: exact baseline evidence and before-case material exist, or unavailable live access is explicitly recorded. Update Step 1 immediately.

### Step 2 — Implement typed optional transport and input capture

Create the new models, contract module, parser/validation service, and capture function. Add optional snapshot types and AppContext service wiring in `backend/app/runtime.py`. Add `problem_analysis_capture` and permitted prior-map context in ContextBuilder; wire the contract to intake/counsel. Preserve no-map legacy behavior.

Write `backend/tests/test_problem_analysis.py` for valid payload, bad JSON, wrong enums, missing required strings, duplicate keys, cycle, foreign IDs, size limits, unsupported reported-part downgrade, excluded source context, and stable capture excluding output-only writes. Include actual no-issue intake, not only fixtures with existing issues.

Check: `cd backend && ./.venv/bin/python -m pytest tests/test_problem_analysis.py tests/test_issue_analysis.py -q`.

Done: valid capture/transport succeeds; invalid optional output does not alter canonical state; no existing issue-analysis regression. Update Step 2.

### Step 3 — Implement immutable publication and read projection

Implement `publish`, `load`, `resolve`; attach to existing saved Markdown output and expose optional snapshot in `WorkspaceService.get`. Add no new database table. Implement exact retry/conflict and current-pointer ordering. Preserve older outputs and unrelated metadata.

Extend `test_problem_analysis.py`: prose-first save; same-key retry; changed same-run payload; input change during run; older run after newer run; missing/corrupt output; lawyer-edited source; pointer failure/retry; rebuild index and re-read identical map; no write on resolve. Test source path escape and cross-matter reference attempts.

Check: `cd backend && ./.venv/bin/python -m pytest tests/test_problem_analysis.py tests/test_workspace_actions.py tests/test_issue_analysis.py -q`.

Done: current/historical/missing state is correct and replay does not duplicate or overwrite. Update Step 3.

### Step 4 — Wire intake and ordinary chat end to end

Update runner/output transport, chat publication, and inquiry parser. Implement trusted same-run input amendments in the intake/tool boundary without post-hoc recapture. Include ordinary advice that saves a recommendation. Add the contract to blank-vault built-ins; existing vaults receive it through runtime contract assembly.

Create `backend/tests/test_problem_analysis_integration.py` following `test_decision_map_generation_integration.py`: real HTTP router, real runner, real tools, real fixture storage; double only provider/network boundaries. Exercise initial intake, one answer, current advice, same-turn recommendation save, new fact, no-save, scenario, preview, artifact-only work, malformed final output, and final-limit recovery. Assert visible prose, exact source IDs, current pointer eligibility, no changed decisions, and no repeated question. Assert simple drafting makes zero research calls.

Check: `cd backend && ./.venv/bin/python -m pytest tests/test_problem_analysis_integration.py tests/test_decision_map_generation_integration.py tests/test_agents.py tests/test_living_dossier.py -q`.

Done: both intake and mutation-bearing advice reach the real saved projection; scenario/no-save controls remain intact. Update Step 4.

### Step 5 — Wire queued/direct research and change reassessment

Update research frozen inputs, `run_main_research`, packet extraction/publication, and existing research publication receipts. Maintain raw output on checkpoint/restart. Add the same prior map to research context with exclusions honored. Keep collector role, budgets, and source permission unchanged.

Extend integration tests with research via real `ResearchRunService`, fake public evidence, and real publication. Cover all three optional existing fences alongside the new fence, changed facts while queued, relevant/irrelevant legal updates, a proposed rule, new question creation without canonical issue ID, partial fetch failure, malformed structure, and interruption/retry after packet save before pointer update. Include a frozen issue-target run: it cannot replace a whole-matter map with a narrow answer; retain it as historical/scoped support unless it explicitly received and reassessed the full matter context.

Check: `cd backend && ./.venv/bin/python -m pytest tests/test_problem_analysis_integration.py tests/test_main_agent_research.py tests/test_research_publication.py tests/test_research_lifecycle.py tests/test_research_checkpoints.py -q`.

Done: collection is guided by actual subquestions, research can change the structure, final packet and visible answer agree, and replay reuses completed work. Update Step 5.

### Step 6 — Add the shared visible breakdown

Implement the shared component and types. Add it to Understand and experimental chat. Update ClaimMarkdown transport handling. Reuse existing conversation and source callbacks; if a new optional callback is needed, add it compatibly to the owning prop type and callers. Do not redesign the decision map, editor, navigation, or recommendation controls.

Check: `cd frontend && npm run typecheck && npm run check:matter-review-decision-map && npm run check:decision-path-layout && npm run check:decision-path-recording`.

Browser-check current, no-map, partial, stale, new-issue, and historical states with fixtures. Expand/collapse by keyboard; follow a source and return; discuss a subquestion; preserve composer text; refresh after research. Confirm no raw JSON or unsupported legal certainty label is shown.

Done: one shared readable projection works on both matter surfaces. Update Step 6.

### Step 7 — Prove the full story, evaluate judgment, and document

Run the acceptance stories and the full required checks in sections 7–8. Add configured-model after-runs using the same pre-change prompts and inputs. Keep coding-agent model selection separate from app model selection. Fix demonstrated defects; do not add more machinery to meet a test that merely checks field counts.

Write `docs/problem-decomposition.verification.md` with exact commands, counts, browser evidence, baseline/after comparison, failures, limitations, and fixture/provider identities. Update `docs/living-dossier.md` only to explain where the new map lives and its separation from recommendations. Run `graphify update .` after application edits. Do not mark current project history as fully verified by copying old counts.

Done: required tests/build and browser acceptance pass, or the exact blocked check is recorded without claiming completion. Update Step 7 and Acceptance.

## 7. Acceptance stories and evaluation

Use synthetic matters in isolated copied fixture vaults. Fixture legal rules are explicitly fictional, deterministic evidence; do not present them as real law or hard-code them in production prompts.

### A. Ambiguous use of customer chats

1. Submit: “Can we use customer chats to improve our support product? We want a pilot next month.”
2. Supply fixture facts showing collection, retention, internal evaluation, vendor processing, and unresolved vendor reuse. Do not supply an answer to the reuse question yet.
3. Expected initial map distinguishes the objective from the method, separates those activities, identifies the vendor-use unknown, and explains why it matters. The system gives a conditional answer without blocking on the unknown.
4. Provide: “The vendor retains the chats and uses them to train its general model. Our earlier description of internal-only use was wrong.”
5. Expected revised map withdraws reliance on the internal-only assumption, adds or reframes the vendor-use subquestion, and changes the integrated answer where warranted. It preserves the original statement and correction provenance.
6. Ask “What if we used synthetic chats instead?” Expected hypothetical discussion, no actual fact or map-pointer mutation.
7. Refresh and reopen. Saved answer, map, links, and prior version remain available. No decision was recorded.

### B. Legal update and non-update

1. On a synthetic matter, supply a fictional policy/rule with named jurisdiction, activity scope, effective date, requirement, and exception.
2. Introduce a fictional amendment affecting the actual activity and date. Expect the specific affected subquestion and linked earlier decision to be identified, with applicability and exception analysis and a reason to revisit the decision.
3. Introduce a different-jurisdiction update that does not apply on supplied facts. Expect explained no material change, no duplicate issues, and no changed decision.
4. Introduce a proposed rule with no final effective date. Expect proposal status and uncertainty preserved; no invented present obligation.

### C. Misleading business label and recombination

Use a synthetic “instant earnings access” or asset-acquisition request. Give facts that make the business label incomplete. Expected output identifies plausible characterizations, asks or researches the differentiating facts, and separates threshold questions from supporting ones. Include two individually feasible components whose combination has an unresolved condition. The final answer must address the combined plan and a feasible design alternative, not merely list separate conclusions.

### D. Integrity and lifecycle

Assemble create matter -> intake -> typed answer -> analysis -> research -> concurrent correction -> late publication -> refresh -> retry -> index rebuild -> reopen. Assert exact historical/current identities and no duplicate records. Test the same path with malformed model output, foreign IDs, no sources, a failed fetch, missing saved map, and pointer-write failure. Preserve useful prose and lawyer edits throughout.

### Judgment evaluation

Compare pre-change and post-change runs on the same app model and same synthetic inputs. Report each criterion as observed/pass/fail with excerpts, not a numerical legal-confidence score:

- Correct business objective and potential framing error identified.
- Material activities/relationships separated without irrelevant issue inflation.
- Plausible legal characterization tied to differentiating facts.
- Threshold/applicability questions and exceptions handled.
- Material adverse fact or competing interpretation considered when supported.
- Next question/research step has an explained decision effect.
- A new fact or source can change the structure and the final answer.
- Whole-plan conclusion and practical alternative provided.
- No invented facts, authority, source verification, or recorded decisions.
- Lawyer effort: unnecessary questions, repeated questions, correction burden, latency, and model/tool calls recorded.

Deterministic fakes prove plumbing and record integrity. They do not prove issue spotting quality. If live-model access is unavailable, finish deterministic/UI work and explicitly leave judgment evaluation unverified. Do not describe a scripted answer as a successful live-model experiment.

## 8. Verification commands and author pre-flight

Observed author baseline on September 10: frontend `npm run typecheck` passed. The focused backend command below passed **65 tests in 27.99 seconds**, with one existing Starlette/httpx deprecation warning. `git diff --check` passed. These are current baseline results, not proof of the planned feature. No application code was changed during plan preparation.

Focused baseline command (run from repository root with explicit subshell):

```bash
(cd backend && ./.venv/bin/python -m pytest tests/test_issue_analysis.py tests/test_workspace_actions.py tests/test_decision_map_generation_integration.py tests/test_main_agent_research.py tests/test_research_publication.py tests/test_living_dossier.py -q)
(cd frontend && npm run typecheck)
```

Final required checks:

```bash
(cd backend && ./.venv/bin/python -m pytest)
(cd frontend && npm run typecheck && npm run build)
(cd frontend && npm run check:workspace-ux && npm run check:single-lawyer-workspace && npm run check:lawyer-continuity && npm run check:matter-review-decision-map && npm run check:decision-path-layout && npm run check:decision-path-recording)
git diff --check
graphify update .
```

Then walk `docs/ACCEPTANCE_TESTS.md` in the browser, plus stories A–D above. Record screenshot paths and exact run IDs in the verification note. Use existing isolated fixture-server patterns in `backend/tests/serve_grouped_intake_demo.py`; read them before use. Do not stop or repurpose unrelated servers. Use an isolated frontend build directory via the existing `PHASE2_DIST_DIR` support if a dev server is active, and state the exact command used. Do not install dependencies to silence warnings. The existing Starlette/httpx deprecation warning is acceptable noise.

The plan author verified the named entry-point signatures and existing types, and identified the mutation-turn publication gap and packet-hash boundary. Proposed new tests cannot be executed before implementation. Do not represent their commands as pre-verified passing tests. The executor must first show a meaningful missing behavior, then prove it passes through the real path.

Prompt design uses explicit outcomes, context, constraints, and observable completion evidence. It does not request hidden reasoning or depend on undocumented model behavior. The author checked [official OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model). Preserve Sol medium or Astra light/low as the user's executor choice; do not substitute a model or change runtime model settings.

## 9. Resume, blockers, and guardrails

Read `docs/problem-decomposition.handoff-progress.md` before starting. Begin at the first pending step. Do not redo done steps. Inspect their evidence; if a done step's relevant check fails after drift, diagnose and report rather than blindly reapplying edits. After each step, run its verification and immediately update that step's line to done with evidence. Record `FAILED: <reason>` for a relevant unresolved failure. Do not batch all progress updates at the end.

Continue through safe reversible implementation details resolved by reading the named code. Do not stop for unrelated pre-existing failures or warnings; record them and continue independent work. Stop dependent work only for a material contract conflict, missing required access, an unresolved relevant failure after focused diagnosis, or an irreversible/user-owned decision. Explain the exact blocker. Do not silently substitute a different architecture.

Do not:

- Overwrite or discard the current uncommitted work.
- Add dependencies, auth, cloud tenancy, queues, embeddings, a rule engine, a graph database, or another agent role.
- Add a legal-answer gate, verifier vote, confidence threshold, mandatory questionnaire, or mandatory research on every turn.
- Create a second canonical facts ledger, issue tree, recommendation store, or decision store.
- Convert generated interpretation, document content, or hypotheticals into confirmed business facts.
- Auto-accept a reframe/recommendation, close issues, or alter decision/approval/delivery/closure states.
- Send private matter facts to public collection or bypass current source authorization.
- Globally expand custom-agent tool permissions or modify source/provider routing.
- Rewrite the shared runner, historical outputs, real vault records, or `backend/frontmatter.py`.
- Fake evaluation success with keyword/field-presence tests or hard-coded scenario answers.

### Not scheduled

Automatic legal monitoring and portfolio-wide impact propagation require a separate user request and evidence that manual supplied updates are inadequate. A visual dependency editor requires evidence that the simple expandable view is hard to use. Automatic promotion/merging of newly spotted issues requires evidence that existing intake and conversation handling is insufficient. A global legal taxonomy requires repeated observed omissions that prompt/context improvements do not fix. None is part of this build.

## Simple explanation

The assistant first checks what problem we are solving. It breaks that problem into useful questions, connects each question to the facts, and investigates what could change the answer. It then puts the answers together. The lawyer can inspect and correct that picture. When new information arrives, the picture can change without erasing the earlier record.
