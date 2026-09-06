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
  runInNewContext(output, { exports: module.exports, module, require: (name: string) => name === "react/jsx-runtime" ? { Fragment: "Fragment", jsx, jsxs: jsx } : name === "react" ? reactModule : modules[name] ?? {} });
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

const calls = { map: "", discussed: "", researched: "", mitigation: "", decision: "", evidence: [] as string[], question: null as null | Record<string, unknown> };
const props = {
  matterId: "MAT-DEMO",
  issue: { issue_id: "ISS-AGE", title: "Whether the service may collect learner details before age is known", why_it_matters: "The answer controls the launch path.", claim_ids: ["CLM-AGE", "CLM-OPERATOR"], disposition: null, linked_work_item_ids: [], linked_decision_ids: [] },
  issuesRevision: "issues-r1",
  questions: [{ question_id: "Q-LAW", business_question_id: "BQ-1", business_question_revision: "bq-r1", issue_id: "ISS-AGE", issue_ids: ["ISS-AGE", "ISS-CONSENT"], question_kind: "legal", text: "Which consent rule applies?", state: "open", source_revision: "q-r1" }],
  claims: [
    { claim_id: "CLM-AGE", text: "The age rule applies to the operator.", claim_revision: "cr1", output_revision: "out7", applicability: { regulated_actor: "Learning service operator", jurisdiction: "United States", explanation: "The service collects data from learners." }, evidence: [{ claim_id: "CLM-AGE", source_id: "SRC-COPPA", locator: "16 CFR 312.2 — child", support_state: "retrieved", source_label: "COPPA Rule" }] },
    { claim_id: "CLM-OPERATOR", text: "Operator status depends on the service role.", claim_revision: "cr1", output_revision: "out7", support_gap: "No exact operator passage is saved.", evidence: [] },
  ],
  responseOptions: [{ option_id: "OPT-NOTICE", title: "Launch with a revised notice", condition: "Only if the school confirms the age route", state: "proposed" }, { option_id: "OPT-UNKNOWN", title: "Use a different consent path", state: "unknown" }],
  workItems: [{ work_item_id: "WORK-NOTICE", title: "Prepare revised notice", state: "done", owner: "Alex Morgan", required: true }],
  decisions: [],
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
};

function renderDetail() { hooks.reset(); return IssueReviewDetail(props); }
let tree = renderDetail();
const rendered = text(tree);
assert.match(rendered, /What needs your judgment[\s\S]*Why this matters[\s\S]*Legal basis[\s\S]*Questions that change the answer[\s\S]*Ways forward[\s\S]*Your recorded position/, "issue detail keeps the required reading order");
assert.match(rendered, /Learning service operator[\s\S]*United States[\s\S]*The service collects data from learners/, "claim applicability names actor, jurisdiction, and application");
assert.match(rendered, /COPPA Rule · 16 CFR 312.2 — child · Retrieved/, "claim evidence keeps its exact locator and support state");
assert.match(rendered, /Support gap:[\s\S]*No exact operator passage is saved[\s\S]*No claim-level evidence is saved/, "an unsupported claim remains visible with its gap");
assert.match(rendered, /Legal question[\s\S]*Shared with 2 issues/, "a shared legal question has explicit provenance");
assert.match(rendered, /OPT-NOTICE[\s\S]*Launch with a revised notice[\s\S]*Only if the school confirms the age route[\s\S]*OPT-UNKNOWN[\s\S]*Unknown condition/, "saved response options retain stable IDs, text, and unknown conditions");
assert.match(rendered, /Prepare revised notice[\s\S]*Completed[\s\S]*Owner: Alex Morgan[\s\S]*Required/, "backend done work renders as completed and healthy");

let buttons = nodes(tree).filter((node) => node.type === "button");
for (const [label, expected] of [["Open decision map", "map"], ["Discuss this issue", "discussed"], ["Create mitigation work", "mitigation"], ["Record formal decision", "decision"]] as const) {
  (buttons.find((button) => text(button) === label)!.props.onClick as () => void)();
  assert.equal(calls[expected], "ISS-AGE", `${label} keeps the selected issue identity`);
}
(buttons.find((button) => text(button).includes("COPPA Rule"))!.props.onClick as () => void)();
assert.deepEqual(calls.evidence, ["16 CFR 312.2 — child"], "the exact claim evidence row opens without source-level merging");

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

let dispositionWrites = 0;
const dispositionHooks = hookRuntime();
const DispositionDetail = load(detailSource, "IssueReviewDetail.tsx", dispositionHooks.module).default!;
const dispositionProps = { ...props, onDisposition: async () => { dispositionWrites += 1; return { issue: props.issue, receipt: { receipt_id: "R-D", source_action_key: "A-D", operation: "disposition", target: { matter_id: "MAT-DEMO" }, state: "applied" } }; } };
function renderDisposition(nextProps = dispositionProps) { dispositionHooks.reset(); return DispositionDetail(nextProps); }
let dispositionTree = renderDisposition();
(nodes(dispositionTree).find((node) => node.type === "button" && text(node) === "Record disposition")!.props.onClick as () => void)();
dispositionTree = renderDisposition();
assert.match(text(dispositionTree), /Record issue disposition[\s\S]*Cancel/, "the disposition editor opens only after a direct action");
(nodes(dispositionTree).filter((node) => node.type === "button" && text(node) === "Cancel").at(-1)!.props.onClick as () => void)();
dispositionTree = renderDisposition();
assert.equal(nodes(dispositionTree).filter((node) => node.type === "button" && text(node) === "Cancel").length, 1, "cancel closes only the disposition editor");
assert.equal(dispositionWrites, 0, "opening and cancelling a disposition makes no write");

(nodes(dispositionTree).find((node) => node.type === "button" && text(node) === "Record disposition")!.props.onClick as () => void)();
dispositionTree = renderDisposition({ ...dispositionProps, issuesRevision: "issues-r2" });
const reasonInput = nodes(dispositionTree).find((node) => node.type === "textarea" && node.props.placeholder === "Give the reason for this recorded position.")!;
(reasonInput.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "The mitigation is complete." } });
dispositionTree = renderDisposition({ ...dispositionProps, issuesRevision: "issues-r2" });
const staleSubmit = nodes(dispositionTree).find((node) => node.type === "button" && text(node) === "Record disposition")!;
assert.equal(staleSubmit.props.disabled, true, "a changed issue revision disables disposition save");
await (staleSubmit.props.onClick as () => Promise<void>)();
dispositionTree = renderDisposition({ ...dispositionProps, issuesRevision: "issues-r2" });
assert.match(text(dispositionTree), /issue changed while you were choosing a disposition/i, "the stale form explains how to recover");
assert.equal(dispositionWrites, 0, "a stale disposition form never calls the write callback");

const readOnlyHooks = hookRuntime();
const readOnlyDetail = load(detailSource, "IssueReviewDetail.tsx", readOnlyHooks.module).default!;
readOnlyHooks.reset();
const readOnlyTree = readOnlyDetail({ ...props, onDisposition: undefined, onQuestionAnswer: undefined, onOpenDecisionMap: undefined });
assert.match(text(readOnlyTree), /This action will be available after the matter page finishes loading its review controls/, "missing C6 actions do not hide saved issue detail");
assert.equal(nodes(readOnlyTree).find((node) => node.type === "button" && text(node) === "Open decision map")?.props.disabled, true, "an unavailable write or navigation action is clearly disabled");
readOnlyHooks.reset();
const emptyOptionsTree = readOnlyDetail({ ...props, responseOptions: [] });
assert.match(text(emptyOptionsTree), /No saved response options are linked to this issue/, "the option area has a true empty state and invents no option");

const renderedClaimTree = readOnlyDetail({ ...props, renderSupportedText: ({ text: value, surface }: { text: string; surface: string }) => jsx("mark", { children: `${surface}:${value}` }) });
assert.match(text(renderedClaimTree), /issue_claim:The age rule applies to the operator/, "the source renderer receives claim text as a React node slot");

const navHooks = hookRuntime();
const navigatorModule = load(navigatorSource, "IssueNavigator.tsx", navHooks.module);
assert.equal((navigatorModule.compactIssueTitle as (title: string, limit?: number) => string)("A very long issue title with complete saved wording", 24), "A very long issue title…");
let selected = "";
navHooks.reset();
const navTree = navigatorModule.default!({ issues: [props.issue, { issue_id: "ISS-CHILD", parent_issue_id: "ISS-AGE", title: "Consent path", lawyer_state: "open" }], selectedIssueId: null, onSelect: (id: string) => { selected = id; } });
assert.match(text(navTree), /All issues[\s\S]*2 issues[\s\S]*No disposition recorded[\s\S]*Consent path[\s\S]*Open/, "the compact hierarchy shows complete counts and visible state words");
(nodes(navTree).find((node) => node.type === "button" && text(node).includes("Consent path"))!.props.onClick as () => void)();
assert.equal(selected, "ISS-CHILD", "the hierarchy selects the saved issue ID");

const evidenceHooks = hookRuntime();
const EvidenceDrawer = load(evidenceSource, "EvidenceDrawer.tsx", evidenceHooks.module, { "@/lib/research": { isSafeSourceUrl: (url: string) => url.startsWith("https://"), isSafeVaultPath: (path: string) => !path.startsWith("/") } }).default!;
let openedPath = "";
evidenceHooks.reset();
const evidenceTree = EvidenceDrawer({ evidence: { claim_id: "CLM-AGE", claim_revision: "cr1", output_revision: "out7", source_id: "SRC-COPPA", source_label: "COPPA Rule", locator: "16 CFR 312.2 — child", available_excerpt: "Child means an individual under age 13.", support_state: "retrieved", path: "sources/coppa.md", explanation: "This passage defines the age threshold used by the claim." }, open: true, onClose: () => undefined, onOpenArtifact: (path: string) => { openedPath = path; } });
assert.match(text(evidenceTree), /Retrieved[\s\S]*Claim revision[\s\S]*cr1[\s\S]*16 CFR 312.2 — child[\s\S]*Exact available passage/, "the drawer keeps exact claim support together");
assert.match(text(evidenceTree), /Source support and legal applicability are separate/, "the drawer does not treat source status as applicability");
(nodes(evidenceTree).find((node) => node.type === "button" && text(node) === "Open saved source")!.props.onClick as () => void)();
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
