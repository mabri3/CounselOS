import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type Element = { type: unknown; props: Record<string, unknown> };
function jsx(type: unknown, props: Record<string, unknown> | null): Element { return { type, props: props ?? {} }; }
function text(node: unknown): string { if (node === null || node === undefined || typeof node === "boolean") return ""; if (typeof node === "string" || typeof node === "number") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text((node as Element).props.children); }
function expand(node: unknown): Element[] { if (node === null || node === undefined || typeof node === "boolean") return []; if (Array.isArray(node)) return node.flatMap(expand); if (typeof node !== "object") return []; const element = node as Element; if (typeof element.type === "function") return expand((element.type as (props: Record<string, unknown>) => unknown)(element.props)); return [element, ...expand(element.props.children)]; }
function react() { return { useEffect: () => undefined, useMemo: (fn: () => unknown) => fn(), useRef: (value: unknown) => ({ current: value }), useState: (value: unknown) => [value, () => undefined] }; }
function compile(source: string, name: string, modules: Record<string, unknown>) {
  const module = { exports: {} as Record<string, unknown> };
  const output = ts.transpileModule(source, { fileName: name, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  runInNewContext(output, { exports: module.exports, module, ResizeObserver: undefined, require: (id: string) => id === "react/jsx-runtime" ? { Fragment: "Fragment", jsx, jsxs: jsx } : id === "react" ? react() : id.endsWith(".module.css") ? { __esModule: true, default: new Proxy({}, { get: (_target, key) => String(key) }) } : modules[id] ?? {} });
  return module.exports;
}

const [layoutSource, outlineSource, inspectorSource, graphSource] = await Promise.all([
  readFile(new URL("../lib/decisionMapLayout.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DecisionMapOutline.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DecisionMapInspector.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DecisionPathGraph.tsx", import.meta.url), "utf8"),
]);
const layout = compile(layoutSource, "decisionMapLayout.ts", {});
const modules = { "@/lib/decisionMapLayout": layout, "@/lib/decisionMapTypes": {}, "@/lib/workspaceTypes": {} };
const Outline = compile(outlineSource, "DecisionMapOutline.tsx", modules).default as (props: Record<string, unknown>) => Element;
const Inspector = compile(inspectorSource, "DecisionMapInspector.tsx", modules).default as (props: Record<string, unknown>) => Element;
const Graph = compile(graphSource, "DecisionPathGraph.tsx", modules).default as (props: Record<string, unknown>) => Element;

const option = { option_id: "OPT-A", option_revision: "opt-r1", title: "A very long path title that remains readable in the graph and full outline", kind: "conditional_path", condition_summary: "Screening finishes before release", requirements: [{ condition_id: "CON-A", state: "met" }], combination: "all", consequence: "", trade_off: "Release waits for screening.", remaining_work: ["Confirm timing"], recommendation: "recommended", recommendation_reason: "Matches the saved test.", claim_ids: ["CLM-A"], work_item_ids: [] };
const analysis = { schema_version: 1, issue_id: "ISS-A", analysis_id: "AN-A", analysis_revision: "analysis-r1", source_path: "03_Matters/a/inquiries/a.md", output_revision: "out-r1", source_revisions: {}, input_basis: { issue: "r1" }, run_id: "RUN-A", explanation: "The timing rule changes the available release route.", business_effect: "A full launch must wait for screening.", tests: [], conditions: [{ condition_id: "CON-A", question: "Does screening finish before release?", assessment: "unknown", assessment_basis: "Not confirmed.", fact_ids: [], question_ids: [], claim_ids: [] }], options: [option], warnings: [] };
const nodes = [
  { node_id: "issue:ISS-A", record_type: "issue", record_id: "ISS-A", label: "Timing", state: "open" },
  { node_id: "legal_test:TST-A", record_type: "legal_test", record_id: "TST-A", label: "Sequencing rule", state: "saved", issue_ids: ["ISS-A"], analysis_id: "AN-A", analysis_revision: "analysis-r1", output_revision: "out-r1", data: { summary: "Complete screening before release.", actor: "Operator", jurisdiction: "Contract", effective_at: "Current term", exceptions: "Pilot only.", applicability: "The operator releases funds." } },
  { node_id: "condition:CON-A", record_type: "condition", record_id: "CON-A", label: "Does screening finish before release?", state: "unknown", issue_ids: ["ISS-A"], analysis_id: "AN-A", analysis_revision: "analysis-r1", output_revision: "out-r1" },
  { node_id: "option:OPT-A", record_type: "option", record_id: "OPT-A", label: option.title, state: "recommended", issue_ids: ["ISS-A"], analysis_id: "AN-A", analysis_revision: "analysis-r1", output_revision: "out-r1", data: { ...option, claim_support: [{ claim_id: "CLM-A", text: "Screening is first.", evidence: [{ claim_id: "CLM-A", source_id: "SRC-A", source_label: "Supplier contract", path: "02_Sources/supplier.md", locator: "Section 4", available_excerpt: "Screen first.", source_version: "src-r1" }] }] } },
  { node_id: "option:OPT-OLD", record_type: "option", record_id: "OPT-OLD", label: "Historical version", state: "recorded", group: "historical", issue_ids: ["ISS-A"], analysis_id: "AN-OLD", analysis_revision: "analysis-old", output_revision: "out-old", data: { ...option, option_id: "OPT-OLD", option_revision: "opt-old" } },
];
const edges = [
  { edge_id: "test-condition", from_node_id: "legal_test:TST-A", to_node_id: "condition:CON-A", relationship: "depends_on", label: "Depends on whether screening finishes before release", state: "unknown" },
  { edge_id: "condition-option", from_node_id: "condition:CON-A", to_node_id: "option:OPT-A", relationship: "if", label: "All · if met", state: "inactive" },
];
const status = { issue_id: "ISS-A", state: "saved", analysis, warnings: [] };
const pathLayout = (layout.focusedDecisionPath({ matter_id: "MAT-A", revision: "r1", selected_issue_id: "ISS-A", nodes, edges }, "ISS-A") as Record<string, unknown>);
const positionedNodes = pathLayout.nodes as Array<{ node_id: string; y: number }>;
assert.ok(positionedNodes.find((node) => node.node_id === "option:OPT-A")!.y < positionedNodes.find((node) => node.node_id === "option:OPT-OLD")!.y, "current route cards sort before historical cards in the same lane");
const graph = Graph({ layout: pathLayout, selectedNodeId: null, onSelectNode: () => undefined });
assert.ok(expand(graph).some((node) => node.type === "button" && String(node.props["aria-label"]).includes(option.title)), "long graph card has a full accessible title");
assert.ok(expand(graph).some((node) => node.type === "path"), "focused graph renders curved SVG connectors");
const inactiveConnector = expand(graph).find((node) => node.type === "path" && node.props.stroke === "var(--line)")!;
assert.equal(inactiveConnector.props.markerEnd, "url(#decision-path-inactive-arrow)", "inactive routes use a muted structural connector");
assert.equal(inactiveConnector.props.strokeDasharray, "5 5", "inactive routes are visibly non-active");

let selected = ""; let discussed: Record<string, unknown> | null = null;
const outline = Outline({ nodes, edges, selectedNodeId: null, focusedIssueId: "ISS-A", matterId: "MAT-A", onSelectNode: (id: string) => { selected = id; }, onDiscuss: (target: Record<string, unknown>) => { discussed = target; } });
assert.match(text(outline), new RegExp(option.title), "outline keeps full record titles");
assert.match(text(outline), /Inactive/, "outline identifies an inactive structural route in plain text");
assert.equal(new Set(nodes.map((node) => node.node_id)).size, new Set(expand(outline).filter((node) => node.type === "button" && String(node.props.title || "")).map((node) => String(node.props.title))).size, "outline has one select control per graph identity");
const selectOption = expand(outline).find((node) => node.type === "button" && String(node.props.title).includes("Historical version"))!;
(selectOption.props.onClick as () => void)(); assert.equal(selected, "option:OPT-OLD", "outline selection returns the stable canonical identity");
const discuss = expand(outline).find((node) => node.type === "button" && text(node) === "Discuss this path")!;
(discuss.props.onClick as () => void)(); assert.equal(discussed?.issue_id, "ISS-A", "shared-record discussion keeps the focused issue");

let prefill: Record<string, unknown> | null = null; let opened: Record<string, unknown> | null = null;
const inspector = Inspector({ focusedIssueId: "ISS-A", node: nodes[3], status, onSelectNode: () => undefined, onAnalyzePaths: () => undefined, onRecordPath: (value: Record<string, unknown>) => { prefill = value; }, onOpenDocument: (value: Record<string, unknown>) => { opened = value; }, onDiscuss: () => undefined, onTryDifferentAssumption: () => undefined, onBackToIssue: () => undefined });
assert.match(text(inspector), /All listed conditions apply to this route[\s\S]*Does screening finish before release\? — must be met[\s\S]*Business effect[\s\S]*A full launch must wait for screening/, "inspector shows readable requirements, agent recommendation state, and the generated business effect");
const record = expand(inspector).find((node) => node.type === "button" && text(node) === "Record this path")!;
(record.props.onClick as () => void)(); assert.equal((prefill?.map_basis as Record<string, unknown>).analysis_id, "AN-A", "record callback receives the exact current analysis basis without writing");
const source = expand(inspector).find((node) => node.type === "button" && text(node) === "Open source")!;
(source.props.onClick as () => void)(); assert.equal(JSON.stringify(opened), JSON.stringify({ document_id: "SRC-A", path: "02_Sources/supplier.md", revision: "src-r1", locator: "Section 4", available_excerpt: "Screen first.", exact_passage_available: true, origin: { surface: "decision_map", record_id: "option:OPT-A" } }), "source callback receives the exact saved document target");
const testInspector = Inspector({ focusedIssueId: "ISS-A", node: nodes[1], status, onSelectNode: () => undefined, onAnalyzePaths: () => undefined, onRecordPath: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, onTryDifferentAssumption: () => undefined, onBackToIssue: () => undefined });
assert.match(text(testInspector), /Operator[\s\S]*Contract[\s\S]*Current term[\s\S]*Pilot only/, "inspector exposes the legal test actor, jurisdiction, effective date, and exception");
const historical = Inspector({ focusedIssueId: "ISS-A", node: nodes[4], status, onSelectNode: () => undefined, onAnalyzePaths: () => undefined, onRecordPath: () => { throw new Error("historical path must not use current analysis"); }, onOpenDocument: () => undefined, onDiscuss: () => undefined, onTryDifferentAssumption: () => undefined, onBackToIssue: () => undefined });
assert.ok(!expand(historical).some((node) => node.type === "button" && text(node) === "Record this path"), "historical option never mixes with the current analysis basis");
const stale = Inspector({ focusedIssueId: "ISS-A", node: nodes[2], status: { ...status, state: "needs_review" }, onSelectNode: () => undefined, onAnalyzePaths: () => undefined, onRecordPath: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, onTryDifferentAssumption: () => undefined, onBackToIssue: () => undefined });
assert.ok(expand(stale).some((node) => node.type === "button" && text(node) === "Update paths"), "a stale analysis provides the update action without changing a record");
console.log("Decision path graph, inspector, outline, source, and callback checks passed.");
