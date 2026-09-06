# Decision map blueprint

Date: September 5, 2026. Status: proposed design; application implementation not started.

## The product decision

Make the decision map the place where a lawyer can see why an issue matters, what changes the answer, and what each available path would require. The payoff is a visible change in understanding: selecting a fact or option reveals its effect without requiring the lawyer to reconstruct the reasoning from chat.

The reading order is:

**Business question → issue → applicable law or test → facts that change the answer → conditional paths → consequences, work and recorded decision.**

These are five reasoning steps after the business question, not five mandatory columns. A focused desktop map uses three columns. The issue explanation is above it. Consequences and actions are below it. This leaves enough room to read the first fork at 1280 pixels.

### Simple explanation

Think of a road map. An issue is the place where the road splits. A sign explains why it splits. A fact tells us which roads might fit. Clicking a road shows where it leads. It does not mean we have chosen to travel on it. The lawyer records that choice separately.

## What the inspection established

The reference task is **Implement Matter A UI rebuild**, ID `01a0736b-65c6-7253-b9f0-4d8a9562d268`. Its final numbered concepts are in `output/matter-ui-design-survey/designs/`.

| Evidence | Finding | Design consequence |
| --- | --- | --- |
| `06-map.png` | White page, serif titles, small readable graph, curved connectors, selected detail below, outline and discussion below that | Keep this anatomy and visual language |
| `02-issue.png` | Explanation, business effect, claims/applicability, facts/questions, options, recorded position | Use the same reading order inside the map inspector |
| `01-understand.png`, `07-scenario.png` | Clear answer/action hierarchy; hypothetical work separated from actual facts | Keep map entry from issue review and separate hypothetical state |
| Live map on September 5, `MAT-20260904-abf788` | 34 records. Selecting the owner-information issue leaves only the business question and issue. Inspector has title, state and actions, without a legal test or alternatives | This is both a data gap and a focus problem |
| `decisionMapLayout.ts` | One-hop neighborhood reanchors on every selected record. Layout uses graph rank and record IDs | Separate focused issue from inspected node. Add a semantic layout for focused paths |
| `DecisionMap.tsx`, `MatterMap.module.css` | 224 × 116 nodes, one-line title clipping, short edge labels, straight diagonal lines | Use short display titles, multiline cards, measured curved connectors and full outline text |
| `workspace_review.py:decision_map()` | Reads options from workspace metadata or scenario outcomes | Keep legacy readers, but add the missing ordinary analysis writer |
| `test_workspace_review.py`, acceptance `enrich_demo.py` | Earlier populated options were inserted directly | Seeded graph tests cannot prove real-matter generation |
| `workspace_actions.py:publish_result()` | Saves prose and claims; no current ordinary option writer | Extend this existing answer-first persistence path |
| `DecisionCreate`, `DecisionService.record()` | Free-text chosen path lacks exact map option identity | Preserve readable decision text and add optional frozen option references |

Live matter content was observed as application data. Its legal assertions were not checked or adopted as this design's legal conclusions. No live analysis, chat submission, fact correction or decision was performed.

## Visual design

### Reference priority

1. This user's request for branches, useful detail and reference fidelity.
2. Project record integrity and semantic color rules.
3. The September 5 **Matter A reference alignment** at the end of `docs/DESIGN_LANGUAGE.md`. It supersedes the older beige palette table in that file.
4. `06-map.png` for page composition; `02-issue.png` for the inspector; the interactive blueprint for the new expanded behavior.

The old map concept shows only a question and issues. Matching it exactly would repeat the functional gap. Keep its style, proportions and page anatomy while extending the selected issue into a real branch view. Do not copy generated sample words, source claims, state labels or counts into real matters.

### Page anatomy

1. Keep AppShell and existing navigation. Use the real matter title, **Back to matter**, and Understand / Discuss / Draft / Decision map navigation. Preserve issue and conversation identity on return.
2. Header: **Decision map**; short line **See what changes the answer.** Scope controls: **This issue** / **All issues**.
3. Compact issue selector with short labels and real state words. The selected issue stays visible.
4. Issue focus card: full short title, original issue wording available, explanation, business effect and current position. No empty generic disclaimer.
5. Graph with three semantic columns: **Law or test**, **What changes the answer**, **Possible paths**.
6. Selected detail immediately below: **What this means**, **Why this path**, **Still needed**, sources, and the appropriate action.
7. Equivalent grouped outline. Secondary discussion stays collapsed until opened. Retain one mounted conversation instance and its unsent text.

### Geometry and type

At a 1280 × 900 viewport, retain normal app margins and target about 1120–1184 pixels of content. Use 24 pixels of card padding. Split graph content into three roughly 260–300 pixel columns with 40–56 pixel connector gaps. At 1440 × 1000, allow more reading width, not more permanent panels.

Use actual shared Source Serif 4 and IBM Plex Sans variables. Main matter heading: 36–42 pixels. Map heading: 28–32 pixels. Selected issue: 24–28 pixels. Node title: 16–18 pixels over up to three lines. Body: 15–16 pixels. Edge condition: 13–14 pixels. Small metadata: 12–13 pixels. No essential visible text below 13 pixels in the default focused map.

Cards have light surfaces, a 1-pixel border, about 8-pixel corners, and restrained spacing. Keep the white canvas without a dot grid. No heavy shadows, oversized badges, decorative gradients or page-local colors. Use shared tokens; no global palette migration.

Use a short saved `display_title` for scanning. Preserve the full original title in the issue reading block and outline. When a short title is absent, wrap the original and expand on demand; do not make an ellipsis the only visible meaning.

The first rule, first controlling condition, and at least two candidate paths must be readable without pan or zoom. Additional tests can expand within the same issue. Do not impose fixed record-count limits that discard useful analysis. Progressive disclosure changes visibility only.

### Connectors and meaning

Use curved left-to-right connectors with small arrowheads. Compute endpoints from rendered card bounds. Allocate a connector channel for each branch so labels do not overlap cards or each other. Unknown conditional routes use a dashed line and the word **Unknown**. Browsing a path uses an ink outline/spine and a stronger line; this means **Exploring**, not that the condition is true.

| Link | Meaning | Example visible label |
| --- | --- | --- |
| Issue → test | This rule or test bears on this issue | `Assessed under` |
| Test → condition | This input changes how the rule applies | `Depends on whether` |
| Condition → option | This route is available under the stated premise | `If release occurs first` |
| Fact/source → test or condition | Evidence supports the analysis; it does not choose a route | `Supported by` |
| Option → work | Work needed to use the option | `Requires` |
| Option → decision | A named person recorded this exact option version | `Recorded as` |

Do not translate every arrow into **Active**. A structural relationship is not evidence that a legal condition is met. Keep recommendation, condition assessment, source support, hypothetical status and human decision status separate.

### Two scopes

**All issues** opens an overview with the business question and compact issue cards, matching `06-map.png`. Cards show saved explanation snippets and actual test/path counts. Selecting an issue expands **This issue**. A grouped **All records** outline exposes shared, disconnected, missing and historical records. A raw full graph is optional under a disclosure. Never auto-fit all 34 records into unreadable text.

**This issue** retains one stable issue anchor. Selecting a rule, fact or option changes the inspector and highlighted reading path. Ancestors and sibling alternatives remain visible. Related issues appear as links with their own IDs. A shared fact has one canonical identity; references may appear in multiple issue views, clearly marked **Also affects…**.

**Fit this issue** fits the focused diagram within a readable scale floor. If it cannot fit at that floor, retain readable scale and allow pan/scroll inside the graph. Explain the scope through labels, not a warning. **Reset view** changes the viewport only; it must not erase assumptions, decisions, conversation drafts or focus.

At 1024 pixels, use a compact issue header and fewer simultaneously expanded tests. Below about 900 pixels, stack semantic sections or lead with the outline. Mobile optimization is not a release criterion. Keyboard users must reach all content and actions without dragging.

## Interaction contract

| User action | Visible result | Saved effect |
| --- | --- | --- |
| Open map | Existing saved analysis appears; useful partial content remains | None; never start a model on page load |
| Select issue | Explanation plus tests, conditions and paths expand | Local view preference only |
| Select test | Full rule summary, actor, jurisdiction, exceptions, available source and applicability | None |
| Select condition | Actual fact/question, source, assessment, alternatives if it changes | None |
| Select path | Consequence, trade-offs, required work, recommendation basis, conditions and sibling routes | Local preview only |
| Discuss this path | Existing composer opens with issue ID, analysis revision and exact option context | No message sent until Send |
| Try a different assumption | Existing ScenarioPanel opens with the exact fact/condition/path target | Existing explicit scenario save/analyze semantics; actual facts unchanged |
| Record this path | Existing decision modal is prefilled with path, conditions and basis | None until final record action |
| Record durable decision | Decision file and event retain human, date, rationale, conditions and exact option version | Existing explicit decision flow; no automatic issue disposition, delivery or closure |
| Record disposition | Existing issue action records resolved, not applicable, etc. | Existing disposition flow only |
| Analyze paths / Update analysis | Existing issue inquiry runs and saves useful prose plus optional branch structure | Existing run and inquiry records; proposed analysis only |
| Correct fact | Existing fact form shows actual record target | Only explicit fact correction changes facts |
| Open source then return | Source at exact available locator; return to same issue/path/scroll position | None |

Show **Candidate**, **Recommended · Agent analysis**, **Exploring**, **Hypothetical**, **Recorded**, and **Needs review** only when supported by their respective records. A recommended option does not turn the issue green. A recorded decision with conditions does not mean those conditions are complete.

Unknown is a real outcome of analysis. Do not force Yes or No. If a condition is unknown or conflicting, show both conditional routes and the one useful question. Do not mark the unknown route as legal permission. A path can be a business choice rather than a factual fork; label these as **Alternative** and keep them separate from condition answers.

No mandatory approval chain, legal verifier, confidence threshold, automated legal conclusion engine or multi-agent vote is part of the product.

## Data blueprint

### Storage and identity

Reuse Markdown and existing run/inquiry/research files. Add one versioned analysis structure to the saved inquiry/packet metadata. In `workspace.md`, keep a small `issue_analyses` map from issue ID to the current saved analysis reference. Resolve that reference for API reads. Do not create a second mutable copy of all branch text. SQLite remains disposable.

For an issue with a valid current pointer, that exact inquiry/packet revision is the only current structured analysis. Do not merge legacy options or another analysis into its current branches. When no current pointer exists, legacy options remain a labelled fallback. When a pointer exists but its file is unavailable, show that missing reference and offer the retained legacy/history view explicitly. Do not silently replace it. Older analyses, scenario outputs and recorded historical options remain reachable in their own labelled groups.

Freeze the precise contract in C0 before parallel writers start. Proposed shape:

```typescript
type IssueAnalysis = {
  schema_version: 1;
  issue_id: string;
  analysis_id: string;             // server derived; scoped to matter/issue/run
  analysis_revision: string;       // hash of normalized analysis and captured basis
  source_path: string;             // existing saved inquiry or research packet
  source_revisions: Record<string, string>;
  input_basis: Record<string, string>; // issue-local input content hashes
  run_id: string;
  display_title?: string;
  explanation: string;
  business_effect?: string;
  tests: LegalTest[];
  conditions: PathCondition[];
  options: IssueOption[];
};
type LegalTest = {
  test_id: string;
  title: string;
  summary: string;
  kind: 'law' | 'regulation' | 'contract' | 'policy' | 'legal_test';
  actor?: string;
  jurisdiction?: string;
  effective_at?: string;
  exceptions?: string;
  applicability?: string;
  claim_ids: string[];
  condition_ids: string[];
};
type PathCondition = {
  condition_id: string;
  question: string;
  assessment: 'met' | 'not_met' | 'unknown' | 'conflicting';
  assessment_basis: string;        // concise generated explanation, not proof
  fact_ids: string[];
  question_ids: string[];
  claim_ids: string[];
};
type IssueOption = {
  option_id: string;
  option_revision: string;        // server digest; definition below
  title: string;
  kind: 'conditional_path' | 'business_alternative' | 'clarify';
  condition_summary: string;
  requirements: {condition_id: string; state: 'met' | 'not_met'}[];
  combination: 'all' | 'any';
  consequence: string;
  trade_off?: string;
  remaining_work: string[];        // proposed prose, not automatically created tasks
  recommendation: 'candidate' | 'recommended';
  recommendation_reason?: string;
  claim_ids: string[];
  work_item_ids: string[];
};
```

The `requirements` list describes the proposed reasoning. It is not executable law. Empty requirements for business alternatives or clarification do not imply satisfied legal conditions. Do not compute factual truth from clicks or missing values. All/any must be explicit when requirements exist; missing or invalid combination keeps the prose and marks this structure incomplete. Multiple rules may apply at once. No arbitrary expressions, scripts or rule-language evaluation.

Represent mixed logic such as `(A and B) or (C and D)` as separate conditional routes, each with one explicit combination. They may describe the same business action but retain separate route identities and premises. If the model cannot express the split safely, keep its complete prose and mark the structure incomplete. Do not guess a flattening or introduce a nested expression engine.

Hypothetical condition values live in existing scenario records, not in the current actual analysis. A scenario may say assumed met/not met, but its entire overlay remains hypothetical. Keep actual assessment, provenance and hypothetical status distinct.

Server-derived identities include the analysis revision. Model-local IDs are validated within a single analysis and mapped consistently. Stable issue/fact/question/claim identities remain unchanged. Do not match options across new runs by label. A regenerated option is a new version, even if its title is the same.

Compute `analysis_revision` from normalized analysis content and captured input basis, excluding server revision fields to avoid circular hashes. Then compute `option_revision` as a digest of `analysis_revision` plus the normalized canonical option content, also excluding server revision fields. Canonical content includes title, kind, requirements, combination, consequence, trade-off, remaining work, recommendation and evidence/work links. The provider cannot supply either revision.

### Snapshot and graph

Extend `DecisionMapRecordType` with `legal_test` and `condition`. Reuse `option`, `work`, `decision`, `scenario`, `fact`, and `question`. Consequence is first-class option detail, so it does not need another record store. Add typed `assessed_under` and `requires` relationships if the existing vocabulary cannot state the direction correctly. Preserve existing relationship readers.

Add per-issue analysis availability and freshness to the snapshot. Distinguish **Not mapped**, **Partial**, **Saved**, **Needs review**, and historical analysis. Do not confuse these with source verification or issue disposition.

The focused view is a presentation graph over the canonical records. Show tests and conditions by semantic stage, not UUID order. Reuse the current cycle-safe general layout for the optional full graph. The outline uses the same visible identities and relationships, with complete titles, explicit conditions and link direction. Do not duplicate shared records as independent facts.

Add `focusedIssueId` separately from `selectedNodeId`. Namespace local preferences by vault, actor and matter using the existing continuity helpers. Include analysis revision in option selection. On regeneration preserve the issue, but clear a missing/stale local option preview and show its prior selection as historical if available. Clear selection must also clear its stored value.

### How real matters acquire branches

1. **Analyze paths** starts an existing issue-targeted inquiry. **Research legal basis** carries the same issue ID through `ResearchRunStart`, the run record, service call and saved result. At enqueue time freeze issue ID, business-question revision, issue-local input basis and the actual input content through the existing context-manifest/snapshot mechanism. Execution uses that captured context. Publication compares it to current canonical inputs. Never reconstruct a different target or pretend newly read facts were the queued input. Reuse existing run and research routing.
2. The execution context includes the actual issue ID, business question, facts, answered questions, saved claims and sources, and existing useful analysis. Do not require the user to recreate it.
3. Ask for useful prose first, plus optional `issue_analysis` structure. Extend the existing output transport with a small fenced `decision-paths` object when the provider does not return a separate structure. Parse this independently of `claim-support`; one malformed block must not erase the other.
4. Save prose using existing persistence before parsing optional structure. Validate records and cross-references without executing text. Resolve evidence using existing claim/source services; the model cannot assign Verified status or invent excerpts.
5. Save accepted structure beside its prose. Only after source/issue revision checks pass, update the one current issue-analysis reference in `workspace.md`. Re-read metadata inside the existing serialization boundary so concurrent issue A and issue B do not lose each other's pointers.
6. Issue review and the map read this same analysis. Subsequent ordinary issue-targeted answers that contain valid structure can update that issue. Responses with no structure leave its branch set intact. Whole-matter answers may contain an array keyed by supplied issue IDs; uncertain issue matching never attaches analysis by title.
7. For an older matter with no structure, show the saved issue immediately and **Analyze paths**. Never add plausible sample branches. No automatic bulk migration or model call on read.

Keep the editable Answer.md presentation contract intact. Add the small runtime structure supplement through the existing execution-context mechanism. Do not replace user-authored standing instructions or add a new specialist agent just to produce a JSON shape.

### Freshness and failures

- Use a small issue-local `input_basis`, not a hash of every shared matter file. Capture the business question, the selected issue's substantive input fields, each fact/question actually supplied, each source passage/file revision supplied, and any selected company/playbook input. Hash normalized record content by canonical ID. An actual input change invalidates its dependent analysis. A metadata-only change or an unrelated issue edit does not.
- Exclude output files, current-analysis pointers, generated claim-link maintenance, receipt/event timestamps, research run status, stage metadata and generated dossier projection from the input digest. If a generated claim was itself an input, pin its immutable output revision instead of hashing the latest mutable claim list. Treat source content changes as substantive; do not exclude them because a research run found the source.
- Save captured input hashes separately from a post-publication file baseline used for display/diagnosis. Publishing claims can alter the containing `issues.md` file without altering this issue's input basis. The current broad `source_revisions()` equality is not the acceptance test for the new per-issue pointer. Reuse its source lookup helpers but do not weaken unrelated stale checks.
- Test two concurrent issues whose valid outputs both become current. Also test a changed shared fact: both dependent analyses must then need review. Test a queued research job after an input changes: its saved result remains historical, with the queued target and context preserved.
- Malformed optional structure retains prose, valid claims, and the prior valid analysis. Show **Analysis saved; map structure incomplete** near the update result.
- Partial valid structure can show a useful test or explanation, with unmapped paths labelled. Never invent missing joins. Duplicate IDs or invalid reference targets produce a specific warning and a readable missing-reference state.
- Late output for changed issue/facts stays in history. It cannot overwrite the current pointer. A failed later run does not clear a successful branch set.
- Optional scenarios, reuse data, source fetches or conversations failing must not blank the map. Load the core map independently and retain partial content. Keep old useful data during a refresh failure.
- A stale current analysis remains readable as **Needs review**. Recording against it requires an explicit choice of that historical basis in the existing form, not silent rebasing or a legal-perfection gate. A stale request detected during submit returns a conflict without writing; the form preserves text and offers refreshed basis or explicit historical-basis selection.

### Recording a decision

Extend existing decision input and Markdown with optional `issue_ids`, `selected_option_id`, `selected_option_revision`, `analysis_id`, `analysis_revision`, and `analysis_path`. Use one optional `map_basis` object if this makes cross-field validation simpler. Old inputs remain valid.

When present, validate the issue and option against a saved analysis inside this matter, freeze the canonical option text, conditions and basis in the decision, and retain the editable `chosen_path` as the lawyer's wording. The modal must explain when the lawyer changes that wording. Do not trust client labels as the saved option identity.

The saved `map_basis` includes the canonical option revision, requirements/combination, consequence, recommendation and its immutable analysis reference. Lawyer-edited `chosen_path` and `conditions` are separate fields; they do not rewrite that canonical snapshot. Persist a normalized request fingerprint covering the exact map basis and all submitted decision fields. Validate it before returning a prior source-action-key result. Legacy decisions without a fingerprint retain their existing readable data; apply this stronger conflict check to new requests without inventing a past fingerprint.

Retain source-action-key retry behavior. A repeated identical record request returns the same decision. Reusing that key with a different map basis or payload returns a conflict; it must not silently return an unrelated earlier decision. Freeze the target and user form values on submit. Failed refresh retries confirmation, not a second write.

Load map links from authoritative decision Markdown; verify the global register API also returns optional link fields after rebuilding SQLite. Do not add new mandatory database schema if current metadata indexing suffices. After regeneration, show the recorded option version as historical basis and the new candidate separately. Decision audit and issue disposition remain separate existing actions.

## Evidence behind the design choices

Luna High examined primary guidance. The design applies it selectively:

- Keep each question tied to a real downstream consequence. Focus one issue at a time, while retaining nearby alternatives. This adapts the [GOV.UK form-structure guidance](https://www.gov.uk/service-manual/design/form-structure) to an expert reading tool; it does not turn the map into a required questionnaire.
- Reveal simple details near a control. Put a larger assumption or decision form in a clearly named surface. Announce changed context for keyboard and screen-reader users. See [GOV.UK conditional-reveal guidance](https://design-system.service.gov.uk/components/checkboxes/).
- Decision requirements can be a network, with shared inputs and human judgments. Several conditions can apply together. Use those distinctions from [OMG Decision Model and Notation 1.4](https://www.omg.org/spec/DMN/1.4/PDF), without adopting its notation or building its execution engine.

React Flow and a minimap were considered. They are not selected for this first build. The project already has DOM cards, SVG edges and a cycle-safe layout. Introduce a library only if observed connector/layout failures cannot be repaired with this focused view.

## Blueprint preview limits

The interactive preview demonstrates issue expansion, path inspection, source detail, a hypothetical overlay and an explicit simulated record form. It uses fictional contract content. It is not a working application feature or verified legal analysis. The actual implementation must use the current shared fonts/tokens, live saved records, real run APIs, and existing modal/scenario components.

The prototype's five-step reading model is binding. Sample text, compact chrome, its small data set and illustrative form are not production contracts. Full graph zoom, typed evidence links, keyboard graph parity, live persistence, failure recovery and version checks must be implemented and tested under the build plan.
