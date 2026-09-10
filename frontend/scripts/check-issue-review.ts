import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type ElementNode = { type: unknown; props: Record<string, unknown> };
type Component = (props: Record<string, unknown>) => ElementNode | null;

function jsx(type: unknown, props: Record<string, unknown> | null): ElementNode { return { type, props: props ?? {} }; }

function hookRuntime() {
  const values: unknown[] = [];
  let cursor = 0;
  return {
    reset: () => { cursor = 0; },
    module: {
      useId: () => `hook-id-${cursor++}`,
      useState: (initial: unknown) => {
        const index = cursor++;
        if (!(index in values)) values[index] = initial;
        return [values[index], (next: unknown) => { values[index] = typeof next === "function" ? (next as (value: unknown) => unknown)(values[index]) : next; }];
      },
      useRef: (initial: unknown) => {
        const index = cursor++;
        if (!(index in values)) values[index] = { current: initial };
        return values[index];
      },
      useEffect: () => undefined,
    },
  };
}

function load(source: string, fileName: string, reactModule: Record<string, unknown>, modules: Record<string, unknown> = {}) {
  const module = { exports: {} as Record<string, unknown> & { default?: Component } };
  const output = ts.transpileModule(source, { fileName, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  runInNewContext(output, { crypto: { randomUUID: () => "test-key" }, exports: module.exports, module, require: (name: string) => name === "react/jsx-runtime" ? { Fragment: "Fragment", jsx, jsxs: jsx } : name === "react" ? reactModule : modules[name] ?? {} });
  return module.exports;
}

function nodes(node: unknown): ElementNode[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (typeof node !== "object") return [];
  const element = node as ElementNode;
  if (typeof element.type === "function") return nodes((element.type as Component)(element.props));
  return [element, ...nodes(element.props.children)];
}

function text(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  const element = node as ElementNode;
  if (typeof element.type === "function") return text((element.type as Component)(element.props));
  return text(element.props.children);
}

const [detailSource, navigatorSource, evidenceSource, understandSource, orientationSource] = await Promise.all([
  readFile(new URL("../components/workspace/IssueReviewDetail.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/IssueNavigator.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/EvidenceDrawer.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/UnderstandPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/OrientationSummary.tsx", import.meta.url), "utf8"),
]);

const hooks = hookRuntime();
const detailModule = load(detailSource, "IssueReviewDetail.tsx", hooks.module);
const IssueReviewDetail = detailModule.default!;
assert.equal((detailModule.dispositionLabel as (value: string | null) => string)(null), "No disposition recorded");
assert.equal((detailModule.dispositionLabel as (value: string | null) => string)("risk_accepted"), "Risk accepted");

const analysis = {
  schema_version: 1,
  issue_id: "ISS-AGE",
  analysis_id: "AN-AGE",
  analysis_revision: "analysis-r3",
  source_path: "03_Matters/demo/research/age-paths.md",
  output_revision: "output-r4",
  source_revisions: { "claim:CLM-AGE": "out7" },
  input_basis: { issue: "issue-r1" },
  run_id: "RUN-AGE",
  display_title: "Age route",
  explanation: "The age and operator tests control which launch route is available.",
  business_effect: "The release plan changes if verified consent is required.",
  tests: [{ test_id: "TEST-COPPA", title: "Child-directed service test", summary: "Assess the audience and operator role.", kind: "legal_test", actor: "Learning service operator", jurisdiction: "United States", effective_at: "2026-07-01", exceptions: "A verified school-authorized route may apply.", applicability: "Applies to the planned collection.", claim_ids: ["CLM-AGE"], condition_ids: ["COND-AGE"] }],
  conditions: [{ condition_id: "COND-AGE", question: "Is the learner under 13?", assessment: "unknown", assessment_basis: "Age is not collected before release.", fact_ids: [], question_ids: ["Q-LAW"], claim_ids: ["CLM-AGE"] }],
  options: [{ option_id: "OPT-AGE-GATE", option_revision: "option-r2", title: "Add an age gate before collection", kind: "conditional_path", condition_summary: "Use when age is unknown before collection.", requirements: [{ condition_id: "COND-AGE", state: "met" }], combination: "all", consequence: "Delay collection until the route is known.", trade_off: "Adds one release step.", remaining_work: ["Draft the age gate"], recommendation: "recommended", recommendation_reason: "It resolves the unknown input.", claim_ids: ["CLM-AGE"], work_item_ids: ["WORK-NOTICE"] }, { option_id: "OPT-SCHOOL", option_revision: "option-r1", title: "Use the school-authorized route", kind: "business_alternative", condition_summary: "Available if the school authorization is verified.", requirements: [], combination: null, consequence: "Use the school workflow.", remaining_work: [], recommendation: "candidate", claim_ids: [], work_item_ids: [] }],
  warnings: [],
};
const calls = { map: "", analyzed: "", path: null as null | Record<string, unknown>, discussed: "", researched: "", mitigation: "", decision: "", evidence: [] as string[], question: null as null | Record<string, unknown> };
const props = {
  matterId: "MAT-DEMO",
  issue: { issue_id: "ISS-AGE", title: "Whether the service may collect learner details before age is known", why_it_matters: "The answer controls the launch path.", claim_ids: ["CLM-AGE", "CLM-OPERATOR"], disposition: null, linked_work_item_ids: [], linked_decision_ids: [] },
  issuesRevision: "issues-r1",
  questions: [{ question_id: "Q-LAW", business_question_id: "BQ-1", business_question_revision: "bq-r1", issue_id: "ISS-AGE", issue_ids: ["ISS-AGE", "ISS-CONSENT"], question_kind: "legal", text: "Which consent rule applies?", state: "open", source_revision: "q-r1" }],
  claims: [
    { claim_id: "CLM-AGE", text: "Historical claim with the same ID.", claim_revision: "cr0", output_revision: "out-old", evidence: [{ claim_id: "CLM-AGE", source_id: "SRC-OLD", locator: "Obsolete section", support_state: "verified", source_label: "Obsolete source" }] },
    { claim_id: "CLM-AGE", text: "The age rule applies to the operator.", claim_revision: "cr1", output_revision: "out7", applicability: { regulated_actor: "Learning service operator", jurisdiction: "United States", explanation: "The service collects data from learners." }, evidence: [{ claim_id: "CLM-AGE", source_id: "SRC-COPPA", locator: "16 CFR 312.2 — child", support_state: "retrieved", source_label: "COPPA Rule" }] },
    { claim_id: "CLM-OPERATOR", text: "Operator status depends on the service role.", claim_revision: "cr1", output_revision: "out7", support_gap: "No exact operator passage is saved.", evidence: [] },
  ],
  responseOptions: [{ option_id: "OPT-NOTICE", title: "Launch with a revised notice", condition: "Only if the school confirms the age route", state: "selected" }, { option_id: "OPT-UNKNOWN", title: "Use a different consent path", state: "unknown" }],
  workItems: [{ work_item_id: "WORK-NOTICE", title: "Prepare revised notice", state: "done", owner: "Alex Morgan", required: true }],
  decisions: [],
  analysisStatus: { issue_id: "ISS-AGE", state: "saved", analysis, warnings: [] },
  onIssueUpdate: async () => [],
  onQuestionAnswer: async (_id: string, command: Record<string, unknown>) => { calls.question = command; return { receipt_id: "R-1", source_action_key: String(command.source_action_key), operation: "answer", target: { matter_id: "MAT-DEMO" }, state: "applied" }; },
  onDisposition: async () => { throw new Error("not used"); },
  onOpenEvidence: (evidence: { locator?: string }) => { calls.evidence.push(evidence.locator ?? ""); },
  onOpenDocument: () => undefined,
  onResearchLegalBasis: (id: string) => { calls.researched = id; },
  onCreateMitigation: (id: string) => { calls.mitigation = id; },
  onRecordDecision: (id: string) => { calls.decision = id; },
  onDiscuss: (target: { issue_id?: string }) => { calls.discussed = target.issue_id ?? ""; },
  onOpenDecisionMap: (id: string) => { calls.map = id; },
  onAnalyzePaths: (id: string) => { calls.analyzed = id; },
  onRecordPath: (prefill: Record<string, unknown>) => { calls.path = prefill; },
};

function renderDetail() { hooks.reset(); return IssueReviewDetail(props); }
let tree = renderDetail();
const rendered = text(tree);
assert.match(rendered, /What needs your judgment[\s\S]*Your recorded position[\s\S]*Why this matters[\s\S]*Legal basis[\s\S]*Questions that change the answer[\s\S]*Ways forward/, "the disposition controls precede supporting analysis");
assert.match(rendered, /Learning service operator[\s\S]*United States[\s\S]*The service collects data from learners/, "claim applicability names actor, jurisdiction, and application");
assert.match(rendered, /COPPA Rule · 16 CFR 312.2 — child · Retrieved/, "claim evidence keeps its exact locator and support state");
assert.match(rendered, /Support gap:[\s\S]*No exact operator passage is saved[\s\S]*No claim-level evidence is saved/, "an unsupported claim remains visible with its gap");
assert.match(rendered, /Legal question[\s\S]*Shared with 2 issues/, "a shared legal question has explicit provenance");
assert.match(rendered, /OPT-NOTICE[\s\S]*Launch with a revised notice[\s\S]*Only if the school confirms the age route[\s\S]*OPT-UNKNOWN[\s\S]*Unknown condition/, "saved response options retain stable IDs, text, and unknown conditions");
assert.match(rendered, /Prepare revised notice[\s\S]*Completed[\s\S]*Owner: Alex Morgan[\s\S]*Required/, "backend done work renders as completed and healthy");
assert.match(rendered, /Saved issue analysis[\s\S]*The age and operator tests control[\s\S]*Child-directed service test[\s\S]*Is the learner under 13\?[\s\S]*Add an age gate before collection/, "issue review shows the exact saved explanation, test, condition, and option");
assert.match(rendered, /Recommended · Agent analysis[\s\S]*Consequence:[\s\S]*Delay collection[\s\S]*Still needed:[\s\S]*Draft the age gate/, "a saved path keeps its recommendation, consequence, and remaining work distinct");
const legalTestCard = nodes(tree).find((node) => node.type === "article" && text(node).includes("Child-directed service test") && !text(node).includes("Claims and applicability"))!;
assert.match(text(legalTestCard), /Actor:[\s\S]*Learning service operator[\s\S]*Jurisdiction:[\s\S]*United States[\s\S]*Effective:[\s\S]*2026-07-01[\s\S]*Exceptions:[\s\S]*verified school-authorized route[\s\S]*Saved support[\s\S]*CLM-AGE[\s\S]*Retrieved · COPPA Rule · 16 CFR 312.2 — child/, "a legal test shows its saved scope, exceptions, and exact support availability");
assert.doesNotMatch(text(legalTestCard), /Obsolete source/, "a historical claim with the same ID cannot lend support to the captured analysis output");
assert.match(rendered, /Legacy option history[\s\S]*Legacy state · selected[\s\S]*OPT-NOTICE/, "legacy options beside current analysis are clearly historical and selection is only a legacy state");
const candidateState = nodes(tree).find((node) => node.type === "span" && text(node) === "Candidate · Agent analysis")!;
assert.match(String(candidateState.props.className), /state-agent/);
assert.doesNotMatch(String(candidateState.props.className), /state-attention|state-healthy/, "a candidate is agent analysis, not attention or a chosen decision");
const legacySelectedState = nodes(tree).find((node) => node.type === "span" && text(node) === "Legacy state · selected")!;
assert.doesNotMatch(String(legacySelectedState.props.className), /state-attention|state-healthy/, "legacy selection is neutral and does not imply a healthy recorded choice");

let buttons = nodes(tree).filter((node) => node.type === "button");
for (const [label, expected] of [["Open decision map", "map"], ["Discuss this issue", "discussed"], ["Create mitigation work", "mitigation"], ["Record formal decision", "decision"]] as const) {
  const action = buttons.find((button) => text(button).trim() === label);
  assert.ok(action, `${label} is rendered; available buttons: ${buttons.map((button) => JSON.stringify(text(button).trim())).join(", ")}`);
  (action.props.onClick as () => void)();
  assert.equal(calls[expected], "ISS-AGE", `${label} keeps the selected issue identity`);
}
(buttons.find((button) => text(button).includes("COPPA Rule"))!.props.onClick as () => void)();
assert.deepEqual(calls.evidence, ["16 CFR 312.2 — child"], "the exact claim evidence row opens without source-level merging");
(buttons.find((button) => text(button) === "Update analysis")!.props.onClick as () => void)();
assert.equal(calls.analyzed, "ISS-AGE", "analysis refresh keeps the saved issue identity");
const pathHooks = hookRuntime();
const PathDetail = load(detailSource, "IssueReviewDetail.tsx", pathHooks.module, {
  "./IssueChoiceForm": (input: Record<string, unknown>) => jsx("form", { "data-option": input.initialOptionId }),
}).default!;
pathHooks.reset();
let pathTree = PathDetail(props);
(nodes(pathTree).find(node => node.type === "button" && text(node) === "Record this path")!.props.onClick as Function)();
pathHooks.reset();
pathTree = PathDetail(props);
assert.equal(nodes(pathTree).find(node => node.type === "form")?.props["data-option"], "OPT-AGE-GATE", "path recording opens the shared choice and work form with the exact option");
assert.equal(calls.path, null, "the separate legacy decision dialog is not used");

const unsupportedHooks = hookRuntime();
const unsupportedDetail = load(detailSource, "IssueReviewDetail.tsx", unsupportedHooks.module).default!;
unsupportedHooks.reset();
const unsupportedTree = unsupportedDetail({ ...props, claims: [] });
assert.equal((text(unsupportedTree).match(/No cited sources\./g) ?? []).length, 1, "an issue without claim support states the gap once");
(nodes(unsupportedTree).find((node) => node.type === "button" && text(node) === "Research legal basis")!.props.onClick as () => void)();
assert.equal(calls.researched, "ISS-AGE", "research starts with the saved issue identity");

const legalInput = nodes(tree).find((node) => node.type === "textarea" && String(node.props.placeholder).includes("will not create a reported fact"))!;
assert.ok(legalInput, "legal-answer guidance says that the answer will not create a reported fact");
(legalInput.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "The federal rule applies to this operator." } });
tree = renderDetail();
buttons = nodes(tree).filter((node) => node.type === "button");
await (buttons.find((button) => text(button) === "Save legal analysis")!.props.onClick as () => Promise<void>)();
assert.equal(calls.question?.answer_kind, "legal_analysis", "a legal answer is sent as legal analysis");
assert.equal(calls.question?.answer, "The federal rule applies to this operator.");

const choiceSource = await readFile(new URL("../components/workspace/IssueChoiceForm.tsx", import.meta.url), "utf8");
for (const scenario of ["recommended", "candidate", "custom", "edited", "conditions", "failed", "stale", "risk", "open"] as const) {
  const choiceHooks = hookRuntime();
  const ChoiceForm = load(choiceSource, "IssueChoiceForm.tsx", choiceHooks.module).default!;
  const events: string[] = [];
  let recorded: Record<string, unknown> = {};
  let position = "";
  const choiceProps = { ...props, onCancel: () => events.push("close"),
    onDisposition: async (_id: string, command: Record<string, unknown>) => {
      events.push("record"); recorded = command;
      if (scenario === "failed") throw new Error("Save not confirmed");
      return {};
    },
    onAnalyzePaths: (_id: string, value: string) => { events.push("analyze"); position = value; },
  };
  const render = (input = choiceProps) => { choiceHooks.reset(); return ChoiceForm(input); };
  let view = render();
  const field = (tag: string, label: string) => nodes(view).find(node => node.type === "label" && text(node).startsWith(label)) && nodes(nodes(view).find(node => node.type === "label" && text(node).startsWith(label))).find(node => node.type === tag)!;
  assert.equal(events.length, 0, "rendering does not record or analyze");
  const choice = field("select", "Starting choice")!;
  assert.equal(choice.props.value, "OPT-AGE-GATE");
  if (["candidate", "custom"].includes(scenario)) {
    (choice.props.onChange as Function)({ target: { value: scenario === "candidate" ? "OPT-SCHOOL" : "custom" } }); view = render();
  }
  if (["custom", "edited", "failed"].includes(scenario)) {
    (field("textarea", "Reason")!.props.onChange as Function)({ target: { value: "Use an adult-only pilot." } });
    (field("input", "Chosen path")!.props.onChange as Function)({ target: { value: "Adult pilot" } }); view = render();
  }
  if (scenario === "conditions") {
    (field("textarea", "Conditions still to confirm")!.props.onChange as Function)({ target: { value: "Partner confirmation must cover the new launch region." } }); view = render();
  }
  if (scenario === "risk" || scenario === "open") {
    (field("select", "Your conclusion")!.props.onChange as Function)({ target: { value: scenario === "risk" ? "risk_accepted" : "unresolved" } }); view = render();
  }
  if (scenario === "stale") view = render({ ...choiceProps, issuesRevision: "r2" });
  const submit = nodes(view).find(node => node.type === "button" && /Record decision and follow-up|Record open question and follow-up/.test(text(node)))!;
  if (scenario === "stale") assert.equal(submit.props.disabled, true);
  await (submit.props.onClick as Function)();
  if (scenario === "stale") { assert.deepEqual(events, []); continue; }
  assert.equal(recorded.workflow, true);
  assert.equal(recorded.disposition, scenario === "risk" ? "risk_accepted" : scenario === "open" ? "unresolved" : "mitigation_in_progress");
  if (scenario === "recommended") {
    assert.equal((recorded.map_basis as Record<string, unknown>).selected_option_revision, "option-r2");
    assert.equal((recorded.follow_up as unknown[]).length, 1);
    assert.deepEqual(events, ["record", "close"]);
  }
  if (scenario === "failed") {
    view = render();
    assert.match(text(view), /Your text is retained/);
    assert.equal(field("textarea", "Reason")!.props.value, "Use an adult-only pilot.");
    assert.deepEqual(events, ["record"]);
  } else if (["candidate", "custom", "edited", "conditions", "open"].includes(scenario)) {
    assert.deepEqual(events, ["record", "close", "analyze"]);
    assert.ok(position.includes(String(recorded.reason)));
  }
}
assert.match(detailSource, /IssueChoiceForm/, "issue page uses the tested unified form");
assert.match(detailSource, /onCompleteWork/, "linked work has a completion action");
const resumeHooks = hookRuntime();
const ResumeChoice = load(choiceSource, "IssueChoiceForm.tsx", resumeHooks.module).default!;
resumeHooks.reset();
const resumeTree = ResumeChoice({ ...props, onCancel: () => undefined, decisions: [{ decision_id: "D-current", title: "School path", chosen_path: "Use the school-authorized route", rationale: "School authorization confirmed.", map_basis: { selected_option_id: "OPT-SCHOOL" }, conditions: [], decided_at: "2026-09-07" }] });
assert.equal(nodes(resumeTree).find(node => node.type === "input" && node.props.value === "Use the school-authorized route")?.props.value, "Use the school-authorized route", "returning to review preserves the recorded path, not the recommendation");
assert.equal(nodes(resumeTree).find(node => node.type === "select" && text(node).includes("Recommended —"))?.props.value, "OPT-SCHOOL");
assert.doesNotMatch(text(resumeTree), /New task 1/, "reviewing completed work does not recreate the recommendation tasks");

const readOnlyHooks = hookRuntime();
const readOnlyDetail = load(detailSource, "IssueReviewDetail.tsx", readOnlyHooks.module).default!;
readOnlyHooks.reset();
const readOnlyTree = readOnlyDetail({ ...props, onDisposition: undefined, onQuestionAnswer: undefined, onOpenDecisionMap: undefined });
assert.match(text(readOnlyTree), /This action will be available after the matter page finishes loading its review controls/, "missing C6 actions do not hide saved issue detail");
assert.equal(nodes(readOnlyTree).find((node) => node.type === "button" && text(node) === "Open decision map")?.props.disabled, true, "an unavailable write or navigation action is clearly disabled");
readOnlyHooks.reset();
const emptyOptionsTree = readOnlyDetail({ ...props, responseOptions: [] });
assert.match(text(emptyOptionsTree), /Current saved paths are shown in Saved issue analysis above/, "current structured paths do not produce a false legacy-option empty state");
let missingAnalysisWrites = 0;
readOnlyHooks.reset();
let missingAnalysisTree = readOnlyDetail({ ...props, analysisStatus: { issue_id: "ISS-AGE", state: "not_mapped", analysis: null, warnings: [] }, onAnalyzePaths: (id: string) => { assert.equal(id, "ISS-AGE"); missingAnalysisWrites += 1; } });
assert.match(text(missingAnalysisTree), /Not mapped[\s\S]*No saved path analysis is linked to this issue[\s\S]*Analyze paths/, "a legacy issue remains readable and offers analysis without fake branches");
assert.match(text(missingAnalysisTree), /Legacy option fallback[\s\S]*Legacy state · selected/, "legacy options are labelled as fallback when no current analysis pointer exists");
assert.equal(missingAnalysisWrites, 0, "rendering an unmapped issue does not start analysis");
(nodes(missingAnalysisTree).find((node) => node.type === "button" && text(node) === "Analyze paths")!.props.onClick as () => void)();
assert.equal(missingAnalysisWrites, 1, "analysis starts only after the explicit action");
readOnlyHooks.reset();
const missingPointerTree = readOnlyDetail({ ...props, analysisStatus: { issue_id: "ISS-AGE", state: "missing", analysis: null, warnings: ["The pointed output is unavailable."], reference: { analysis_id: "AN-MISSING", source_path: "03_Matters/demo/research/missing.md" } } });
assert.match(text(missingPointerTree), /Missing analysis[\s\S]*The pointed output is unavailable[\s\S]*Legacy option history/, "a missing pointed output keeps legacy options in history rather than presenting them as current fallback");

const renderedClaimTree = readOnlyDetail({ ...props, renderSupportedText: ({ text: value, surface }: { text: string; surface: string }) => jsx("mark", { children: `${surface}:${value}` }) });
assert.match(text(renderedClaimTree), /issue_claim:The age rule applies to the operator/, "the source renderer receives claim text as a React node slot");

const navHooks = hookRuntime();
const navigatorModule = load(navigatorSource, "IssueNavigator.tsx", navHooks.module);
assert.equal((navigatorModule.compactIssueTitle as (title: string, limit?: number) => string)("A very long issue title with complete saved wording", 24), "A very long issue title…");
let selected = "";
navHooks.reset();
const navTree = navigatorModule.default!({ issues: [props.issue, { issue_id: "ISS-CHILD", parent_issue_id: "ISS-AGE", title: "Consent path", lawyer_state: "open" }], selectedIssueId: null, onSelect: (id: string) => { selected = id; } });
assert.match(text(navTree), /Issues \(2\)[\s\S]*All issues[\s\S]*No disposition recorded[\s\S]*Consent path[\s\S]*Open/, "the compact hierarchy shows complete counts and visible state words");
(nodes(navTree).find((node) => node.type === "button" && text(node).includes("Consent path"))!.props.onClick as () => void)();
assert.equal(selected, "ISS-CHILD", "the hierarchy selects the saved issue ID");

const evidenceHooks = hookRuntime();
const EvidenceDrawer = load(evidenceSource, "EvidenceDrawer.tsx", evidenceHooks.module, { "@/lib/research": { isSafeSourceUrl: (url: string) => url.startsWith("https://"), isSafeVaultPath: (path: string) => !path.startsWith("/") } }).default!;
let openedPath = "";
evidenceHooks.reset();
const evidenceTree = EvidenceDrawer({ evidence: { claim_id: "CLM-AGE", claim_revision: "cr1", output_revision: "out7", source_id: "SRC-COPPA", source_label: "COPPA Rule", locator: "16 CFR 312.2 — child", available_excerpt: "Child means an individual under age 13.", support_state: "retrieved", path: "sources/coppa.md", explanation: "This passage defines the age threshold used by the claim." }, open: true, onClose: () => undefined, onOpenArtifact: (path: string) => { openedPath = path; } });
assert.match(text(evidenceTree), /Retrieved[\s\S]*Saved passage[\s\S]*16 CFR 312.2 — child[\s\S]*Claim revision[\s\S]*cr1/, "the drawer keeps exact claim support together");
assert.doesNotMatch(text(evidenceTree), /Verified support|Legally applicable/, "retrieved evidence must not become verified or imply legal applicability");
(nodes(evidenceTree).find((node) => node.type === "button" && text(node) === "Read saved copy")!.props.onClick as () => void)();
assert.equal(openedPath, "sources/coppa.md", "the evidence action opens the saved source path");

assert.match(understandSource, /review_items \?\? \[\]\)\.filter[\s\S]*\.slice\(0, 3\)/, "the review page shows at most three saved review items");
assert.match(understandSource, /Supporting material and history/, "secondary material is under one collapsed disclosure in review mode");
assert.match(understandSource, /effectiveQuestionLinks\(question\)\.includes\(selectedIssue\.issue_id\)/, "questions join to issues through explicit IDs");
assert.match(understandSource, /selectedIssue\.claim_ids[\s\S]*claim\.claim_id/, "claims join to issues through explicit IDs");
assert.match(understandSource, /key=\{selectedIssue\.issue_id\}/, "changing the selected issue remounts issue-local forms and selections");
assert.doesNotMatch(understandSource, /question\.text.*issue\.title|issue\.title.*question\.text/, "the review page does not infer record links from titles");

const understandHooks = hookRuntime();
const emptyComponent = () => jsx("div", {});
const UnderstandPanel = load(understandSource, "UnderstandPanel.tsx", understandHooks.module, {
  "react-markdown": ({ children }: { children?: unknown }) => jsx("markdown", { children }),
  "remark-gfm": () => undefined,
  "@/lib/orientationPresentation": { canCompareSuppliedSource: () => false, canRequestFact: () => true, orientationAnswer: (_orientation: unknown, answer?: string) => ({ text: answer ?? "", label: "Saved answer", state: "current" }) },
  "./ChangeRecap": emptyComponent,
  "./IssueNavigator": emptyComponent,
  "./IssueReviewDetail": emptyComponent,
  "./OrientationSummary": emptyComponent,
  "./WorkItemSummary": emptyComponent,
}).default!;
let alternateQuestionCommand: Record<string, unknown> | null = null;
let factRequestCount = 0;
const understandProps = {
  snapshot: { matter_id: "MAT-DEMO", revision: "w1", question: { question_id: "BQ", revision: "bq1", text: "May the service launch?" }, short_answer: "Review the legal question.", review_items: [], issues: [], questions: [{ question_id: "Q-LEGAL-ALT", business_question_id: "BQ", business_question_revision: "bq1", question_kind: "legal", text: "Which rule applies?", state: "open", source_revision: "q1" }] },
  selectedIssueId: null,
  onSelectIssue: () => undefined,
  onQuestionChange: async () => { throw new Error("not used"); },
  onProposalAction: async () => { throw new Error("not used"); },
  onQuestionAnswer: async (_id: string, command: Record<string, unknown>) => { alternateQuestionCommand = command; return { receipt_id: "R-ALT", source_action_key: String(command.source_action_key), operation: "answer", target: { matter_id: "MAT-DEMO" }, state: "applied" }; },
  onRefresh: () => undefined,
  onTargetChange: () => undefined,
  onAction: async () => ({ run_id: "RUN", state: "queued" }),
  onOpenArtifact: () => undefined,
  onOpenEvidence: () => undefined,
  onFactRequest: () => { factRequestCount += 1; },
};
function renderUnderstand() { understandHooks.reset(); return UnderstandPanel(understandProps); }
let understandTree = renderUnderstand();
assert.match(text(understandTree), /Legal question[\s\S]*Legal analysis[\s\S]*Save legal analysis/, "the alternate supporting-material view labels legal analysis consistently");
assert.equal(text(understandTree).includes("Request a fact"), false, "the alternate legal-question view does not offer a factual request action");
const alternateLegalInput = nodes(understandTree).find((node) => node.type === "textarea" && String(node.props.placeholder).includes("will not create a reported fact"))!;
(alternateLegalInput.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "The rule applies to the operator." } });
understandTree = renderUnderstand();
await (nodes(understandTree).find((node) => node.type === "button" && text(node) === "Save legal analysis")!.props.onClick as () => Promise<void>)();
assert.equal(alternateQuestionCommand?.answer_kind, "legal_analysis", "the alternate legal-answer callback sends legal_analysis");
assert.equal(alternateQuestionCommand?.answer, "The rule applies to the operator.");
assert.equal(factRequestCount, 0, "the alternate legal question never invokes the factual-request callback");

const orientationHooks = hookRuntime();
const OrientationSummary = load(orientationSource, "OrientationSummary.tsx", { ...orientationHooks.module, useId: () => "orientation" }, { "@/lib/orientationPresentation": { previewOrientationQuestion: (value: string) => value, visibleOrientationActions: () => ({ primary: null, secondary: [] }), actionOwnerText: () => null, actionStateWord: () => "Ready" } }).default!;
orientationHooks.reset();
const orientationTree = OrientationSummary({ question: { question_id: "BQ", revision: "r1", text: "May the service launch?" }, shortAnswer: "Answer with [source:SRC|section 1]", reviewItems: [], allIssueCount: 1, onOpenIssue: () => undefined, onShowAllIssues: () => undefined, renderAnswer: (value: string) => jsx("mark", { children: `Rendered answer: ${value}` }) });
assert.match(text(orientationTree), /Rendered answer: Answer with \[source:SRC\|section 1\]/, "the first-screen answer renderer returns a React node without stringifying it");

for (const source of [detailSource, navigatorSource, evidenceSource, understandSource, orientationSource]) assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "review surfaces use shared semantic color tokens");

console.log("Issue review render and callback checks passed.");
