import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type ElementNode = { type: unknown; props: Record<string, unknown> };
type ModuleExports = Record<string, unknown> & { default?: (props: Record<string, unknown>) => ElementNode };

function jsx(type: unknown, props: Record<string, unknown> | null): ElementNode {
  return { type, props: props ?? {} };
}

function loadComponent(source: string, fileName: string, extraModules: Record<string, unknown> = {}, stateValues: unknown[] = []): ModuleExports {
  const module = { exports: {} as ModuleExports };
  const output = ts.transpileModule(source, {
    fileName,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  runInNewContext(output, {
    exports: module.exports,
    module,
    require: (name: string) => {
      if (name === "react/jsx-runtime") return { Fragment: "Fragment", jsx, jsxs: jsx };
      if (name === "react") { let stateIndex = 0; return { useId: () => `review-detail-${stateIndex}`, useState: (value: unknown) => [stateIndex < stateValues.length ? stateValues[stateIndex++] : (stateIndex++, value), () => undefined] }; }
      if (name in extraModules) return extraModules[name];
      return {};
    },
  });
  return module.exports;
}

function children(node: unknown): unknown[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap(children);
  if (typeof node !== "object") return [];
  const element = node as ElementNode;
  if (typeof element.type === "function") return children(element.type(element.props));
  return [element, ...children(element.props.children)];
}

function textContent(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  const element = node as ElementNode;
  if (typeof element.type === "function") return textContent(element.type(element.props));
  return textContent(element.props.children);
}

const [workItemSource, orientationSource] = await Promise.all([
  readFile(new URL("../components/workspace/WorkItemSummary.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/OrientationSummary.tsx", import.meta.url), "utf8"),
]);

const workItemModule = loadComponent(workItemSource, "WorkItemSummary.tsx");
const previewIssueTitle = workItemModule.previewIssueTitle as (title: string, limit?: number) => string;
const reviewStatePresentation = workItemModule.reviewStatePresentation as (state: string) => { label: string; className: string; washClassName: string };
const WorkItemSummary = workItemModule.default!;

const fullTitle = "Whether the learning service may collect a very long set of account, device, and classroom details before a teacher confirms the age of each learner";
const preview = previewIssueTitle(fullTitle, 72);
assert.ok(preview.length <= 73 && preview.endsWith("…"), "a long issue gets a bounded word-aware label");
assert.equal(previewIssueTitle("  Keep   the original words  "), "Keep the original words");
assert.equal(JSON.stringify(reviewStatePresentation("needs_attention")), JSON.stringify({ label: "Needs attention", className: "state-attention", washClassName: "wash-attention" }));
assert.equal(JSON.stringify(reviewStatePresentation("agent_work")), JSON.stringify({ label: "Agent work", className: "state-agent", washClassName: "wash-agent" }));
assert.equal(JSON.stringify(reviewStatePresentation("complete")), JSON.stringify({ label: "Complete", className: "state-healthy", washClassName: "wash-healthy" }));
assert.equal(JSON.stringify(reviewStatePresentation("overdue")), JSON.stringify({ label: "Overdue", className: "state-failure", washClassName: "wash-failure" }));

let openedIssue = "";
let closeCount = 0;
const workTree = WorkItemSummary({
  item: { issue_id: "ISS-AGE", reason: "The answer changes the launch path.", actor: "Alex Morgan", action_label: "Review the learner age and consent path before launch", state: "needs_attention", saved_order: 1 },
  issue: { issue_id: "ISS-AGE", title: fullTitle },
  onOpenIssue: (issueId: string) => { openedIssue = issueId; },
  onClosePanel: () => { closeCount += 1; },
});
const workNodes = children(workTree) as ElementNode[];
const workButtons = workNodes.filter((node) => node.type === "button");
assert.equal(textContent(workTree).includes(fullTitle), true, "the full saved issue wording remains in the rendered disclosure");
assert.equal(textContent(workTree).includes("Needs attention"), true, "the attention color has a visible state word");
assert.equal(textContent(workTree).includes("Owner: Alex Morgan"), true, "the state and owner row names its owner");
assert.equal(workButtons.length, 2, "the banner has one work action and one presentation action");
(workButtons[0].props.onClick as () => void)();
assert.equal(openedIssue, "ISS-AGE", "the work action opens the frozen issue identity");
(workButtons[1].props.onClick as () => void)();
assert.equal(closeCount, 1, "Close panel calls only the presentation callback");
assert.equal(openedIssue, "ISS-AGE", "closing the panel does not complete or retarget work");
assert.equal(textContent(workTree).includes("Issue to review"), true, "the title row is visibly labeled");
for (const label of ["State and owner", "Review actions"]) assert.equal(workNodes.some((node) => node.props["aria-label"] === label), true, `${label} remains a separate row`);

const orientationModule = loadComponent(orientationSource, "OrientationSummary.tsx", {
  "@/lib/orientationPresentation": {
    previewOrientationQuestion: (question: string) => question.length > 40 ? `${question.slice(0, 39)}…` : question,
    visibleOrientationActions: () => ({ primary: null, secondary: [] }),
    actionOwnerText: () => null,
    actionStateWord: () => "Ready",
  },
  "./WorkItemSummary": { default: WorkItemSummary },
});
const OrientationSummary = orientationModule.default!;
const compactAnswerPreview = orientationModule.compactAnswerPreview as (answer: string, limit?: number) => { text: string; shortened: boolean; plainText: boolean };
const sectionAnswer = "Let me examine the facts.\n\n### Bottom line\nThe launch needs an audience review [source:SRC-1|Section 2].\n\n### Further limits\nThe operator status remains unknown.";
assert.match(compactAnswerPreview(sectionAnswer).text, /^The launch needs an audience review/);
assert.ok(compactAnswerPreview(sectionAnswer).text.includes("[source:SRC-1|Section 2]"));
assert.ok(compactAnswerPreview(sectionAnswer).shortened, "the full original remains available through expansion");
assert.match(compactAnswerPreview("```md\n### Bottom line\nFake answer\n```\n\nActual text").text, /^```md/, "a fenced heading cannot select a new answer");
let reviewOpen = "";
let showedAll = 0;
const orientationTree = OrientationSummary({
  question: { question_id: "Q-1", revision: "q1", text: "May the learning service launch before the school confirms the learner age and consent route?" },
  shortAnswer: "Launch only after the open age question is answered.",
  qualification: "The school contract has not been supplied.",
  reviewItems: [{ issue_id: "ISS-AGE", reason: "The answer controls the consent path.", actor: "Alex Morgan", action_label: "Review age question", state: "needs_attention", saved_order: 1 }],
  allIssueCount: 6,
  onOpenIssue: (issueId: string) => { reviewOpen = issueId; },
  onShowAllIssues: () => { showedAll += 1; },
});
const orientationNodes = children(orientationTree) as ElementNode[];
const orientationButtons = orientationNodes.filter((node) => node.type === "button");
assert.match(textContent(orientationTree), /Business question[\s\S]*Working answer · Agent work[\s\S]*Material qualification[\s\S]*One next action/, "orientation keeps question, answer, qualification, and one action in reading order");
assert.equal(textContent(orientationTree).includes("View all issues (6)"), true, "the complete issue list remains one action away");
(orientationButtons.find((button) => textContent(button) === "Review age question")!.props.onClick as () => void)();
assert.equal(reviewOpen, "ISS-AGE");
(orientationButtons.find((button) => textContent(button) === "View all issues (6)")!.props.onClick as () => void)();
assert.equal(showedAll, 1);

const supportedOpening = `The service can launch only after the school confirms the age route [source:SRC-COPPA|16 C.F.R. 312.2].\n\n${"Later analysis must stay below the fold. ".repeat(40)}`;
const supportedPreview = compactAnswerPreview(supportedOpening);
assert.equal(supportedPreview.text, "The service can launch only after the school confirms the age route [source:SRC-COPPA|16 C.F.R. 312.2].", "a complete opening paragraph keeps its exact source marker");
assert.equal(supportedPreview.plainText, false, "a complete supported paragraph remains available to the source renderer");
let collapsedRenderedText = "";
const longOrientationTree = OrientationSummary({
  question: { question_id: "Q-2", revision: "q2", text: "May the service launch?" },
  shortAnswer: supportedOpening,
  qualification: "The school confirmation remains open.",
  reviewItems: [{ issue_id: "ISS-AGE", reason: "The launch condition is open.", actor: "Alex Morgan", action_label: "Review launch condition", state: "needs_attention", saved_order: 1 }],
  allIssueCount: 1,
  onOpenIssue: () => undefined,
  onShowAllIssues: () => undefined,
  renderAnswer: (answer: string) => { collapsedRenderedText = answer; return jsx("a", { href: "#source", children: answer }); },
});
const longOrientationText = textContent(longOrientationTree);
assert.equal(collapsedRenderedText, supportedPreview.text, "the collapsed source renderer receives only the complete preview");
assert.equal(longOrientationText.includes("Later analysis must stay below the fold"), false, "later answer paragraphs are not mounted while collapsed");
assert.match(longOrientationText, /Read full answer[\s\S]*Material qualification[\s\S]*One next action/, "the next action remains in the collapsed first-screen tree");
assert.equal((children(longOrientationTree) as ElementNode[]).filter((node) => node.type === "a").length, 1, "only preview citation content can be focusable while collapsed");

const expandedOrientationModule = loadComponent(orientationSource, "OrientationSummary.tsx", {
  "@/lib/orientationPresentation": {
    previewOrientationQuestion: (question: string) => question,
    visibleOrientationActions: () => ({ primary: null, secondary: [] }),
    actionOwnerText: () => null,
    actionStateWord: () => "Ready",
  },
}, [false, true]);
const expandedTree = expandedOrientationModule.default!({
  question: { question_id: "Q-2", revision: "q2", text: "May the service launch?" }, shortAnswer: supportedOpening, reviewItems: [], allIssueCount: 1,
  onOpenIssue: () => undefined, onShowAllIssues: () => undefined,
  renderAnswer: (answer: string) => jsx("div", { children: answer }),
});
const expandedText = textContent(expandedTree);
assert.equal(expandedText.includes("Later analysis must stay below the fold"), true, "expansion mounts the complete saved answer");
assert.match(expandedText, /Show shorter answer/, "the expanded answer can return to the compact view");

const hugeSingleBlock = "One very long continuous answer without sentence punctuation ".repeat(30).trim();
const hugePreview = compactAnswerPreview(hugeSingleBlock);
assert.equal(hugePreview.shortened, true);
assert.equal(hugePreview.plainText, true, "a huge single block uses a safe plain-text preview instead of broken Markdown");
assert.ok(hugePreview.text.length <= 421 && hugePreview.text.endsWith("…"), "the huge single-block preview is bounded at a word boundary");
let hugeRendererCalls = 0;
const hugeTree = OrientationSummary({
  question: { question_id: "Q-3", revision: "q3", text: "What is the answer?" }, shortAnswer: hugeSingleBlock, reviewItems: [], allIssueCount: 0,
  onOpenIssue: () => undefined, onShowAllIssues: () => undefined,
  renderAnswer: () => { hugeRendererCalls += 1; return jsx("a", { href: "#hidden", children: "hidden full answer" }); },
});
assert.equal(hugeRendererCalls, 0, "a truncated single block does not mount hidden focusable source links");
assert.equal((children(hugeTree) as ElementNode[]).some((node) => node.type === "a"), false, "no full-answer link remains focusable in the collapsed single-block tree");

const legacyTree = OrientationSummary({
  orientation: null,
  loading: false,
  error: null,
  onOpenTarget: () => undefined,
  onRefresh: () => undefined,
});
assert.equal(textContent(legacyTree).includes("Saved orientation is unavailable"), true, "existing continuity callers keep the legacy rendering path");

for (const source of [workItemSource, orientationSource]) {
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "review presentation uses shared semantic tokens only");
  assert.doesNotMatch(source, /minWidth:\s*["']?[4-9][0-9]{2}/, "review presentation has no fixed desktop minimum width");
}

console.log("Review render and callback checks passed. Browser width checks remain pending.");
