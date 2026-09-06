import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const mapStyles = await readFile(new URL("../components/workspace/MatterMap.module.css", import.meta.url), "utf8");
function cssRule(name: string) { return [...mapStyles.matchAll(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`, "g"))].map(match => match[1]).join(";"); }
type ElementNode = { type: unknown; props: Record<string, unknown> };
type ModuleExports = Record<string, unknown> & { default?: (props: Record<string, unknown>) => ElementNode };

function jsx(type: unknown, props: Record<string, unknown> | null): ElementNode { return { type, props: props ?? {} }; }
function load(source: string, fileName: string, modules: Record<string, unknown> = {}): ModuleExports {
  const module = { exports: {} as ModuleExports };
  const output = ts.transpileModule(source, { fileName, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  runInNewContext(output, { exports: module.exports, module, require: (name: string) => {
    if (name === "react/jsx-runtime") return { Fragment: "Fragment", jsx, jsxs: jsx };
    if (name === "react") return { useEffect: () => undefined, useMemo: (fn: () => unknown) => fn(), useRef: (value: unknown) => ({ current: value }), useState: (value: unknown) => [value, () => undefined] };
    if (name.endsWith(".module.css")) return { __esModule: true, default: new Proxy({}, { get: (_target, key) => String(key) }) };
    return modules[name] ?? {};
  } });
  return module.exports;
}
function expand(node: unknown): ElementNode[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap(expand);
  if (typeof node !== "object") return [];
  const element = node as ElementNode;
  if (typeof element.type === "function") return expand((element.type as (props: Record<string, unknown>) => unknown)(element.props));
  return [element, ...expand(element.props.children)];
}
function text(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  return text((node as ElementNode).props.children);
}

const [layoutSource, componentSource] = await Promise.all([
  readFile(new URL("../lib/decisionMapLayout.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DecisionMap.tsx", import.meta.url), "utf8"),
]);
const layout = load(layoutSource, "decisionMapLayout.ts", { "./decisionMapTypes": {} });
const layoutDecisionMap = layout.layoutDecisionMap as (data: Record<string, unknown>) => { nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>>; width: number; height: number };
const visibleDecisionMap = layout.visibleDecisionMap as (layout: Record<string, unknown>, snapshot: Record<string, unknown>, scope: string, selected: string | null) => { nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
const activeDecisionMapPath = layout.activeDecisionMapPath as (nodes: Array<Record<string, unknown>>, edges: Array<Record<string, unknown>>, selected: string | null) => string[];
const decisionMapFitScale = layout.decisionMapFitScale as (layout: { width: number; height: number }, width: number, height: number) => number;
const relationshipLabel = layout.relationshipLabel as (relationship: string) => string;
const nodeStateLabel = layout.nodeStateLabel as (node: Record<string, unknown>) => string;

const nodes = [
  { node_id: "business_question:BQ-LEARNING", record_type: "business_question", record_id: "BQ-LEARNING", label: "Can the learning app launch its audience flow?", state: "open" },
  { node_id: "issue:ISS-AGE", record_type: "issue", record_id: "ISS-AGE", label: "Learner age", state: "open" },
  { node_id: "issue:ISS-CONSENT", record_type: "issue", record_id: "ISS-CONSENT", label: "Consent route", state: "open" },
  { node_id: "issue:ISS-NOTICE", record_type: "issue", record_id: "ISS-NOTICE", label: "Notice wording", state: "open" },
  { node_id: "issue:ISS-CYCLE-A", record_type: "issue", record_id: "ISS-CYCLE-A", label: "Cycle A", state: "open" },
  { node_id: "issue:ISS-CYCLE-B", record_type: "issue", record_id: "ISS-CYCLE-B", label: "Cycle B", state: "open" },
  { node_id: "issue:ISS-DISCONNECTED", record_type: "issue", record_id: "ISS-DISCONNECTED", label: "Offline classroom access", state: "open" },
  { node_id: "question:Q-AUDIENCE", record_type: "question", record_id: "Q-AUDIENCE", label: "Who is the audience?", state: "unknown", issue_ids: ["ISS-AGE", "ISS-CONSENT"], claim_ids: ["CLM-AGE", "CLM-OPERATOR"] },
  { node_id: "option:OPT-NOTICE", record_type: "option", record_id: "OPT-NOTICE", label: "Use a clearer notice", state: "proposed", issue_ids: ["ISS-NOTICE"] },
  { node_id: "option:OPT-ADULTS", record_type: "option", record_id: "OPT-ADULTS", label: "Limit launch to adult learners", state: "proposed", issue_ids: ["ISS-CONSENT"] },
  { node_id: "work:WORK-NOTICE", record_type: "work", record_id: "WORK-NOTICE", label: "Update notice work", state: "in_progress", issue_ids: ["ISS-NOTICE"] },
  { node_id: "question:MISSING-SCHOOL", record_type: "question", record_id: "MISSING-SCHOOL", label: "Missing school agreement", state: "missing", missing_reference: true, issue_ids: ["ISS-NOTICE"] },
];
const edges = [
  { edge_id: "E-AGE-AUDIENCE", from_node_id: "issue:ISS-AGE", to_node_id: "question:Q-AUDIENCE", relationship: "depends_on", label: "depends on", state: "unknown" },
  { edge_id: "E-CONSENT-AUDIENCE", from_node_id: "issue:ISS-CONSENT", to_node_id: "question:Q-AUDIENCE", relationship: "depends_on", label: "depends on", state: "unknown" },
  { edge_id: "E-AUDIENCE-NOTICE", from_node_id: "question:Q-AUDIENCE", to_node_id: "option:OPT-NOTICE", relationship: "if", label: "If launch includes a covered child audience", state: "unknown" },
  { edge_id: "E-AUDIENCE-ADULTS", from_node_id: "question:Q-AUDIENCE", to_node_id: "option:OPT-ADULTS", relationship: "if", label: "If launch is limited to adult learners", state: "unknown" },
  { edge_id: "E-NOTICE-WORK", from_node_id: "option:OPT-NOTICE", to_node_id: "work:WORK-NOTICE", relationship: "mitigated_by", label: "mitigated by", state: "active" },
  { edge_id: "E-CYCLE-AB", from_node_id: "issue:ISS-CYCLE-A", to_node_id: "issue:ISS-CYCLE-B", relationship: "depends_on", label: "depends on", state: "active" },
  { edge_id: "E-CYCLE-BA", from_node_id: "issue:ISS-CYCLE-B", to_node_id: "issue:ISS-CYCLE-A", relationship: "depends_on", label: "depends on", state: "active" },
  { edge_id: "E-MISSING", from_node_id: "issue:ISS-NOTICE", to_node_id: "question:MISSING-SCHOOL", relationship: "supports", label: "supports", state: "missing" },
];
const evidence = [
  { claim_id: "CLM-AGE", source_id: "SRC-COPPA", locator: "16 CFR 312.2 — child" },
  { claim_id: "CLM-OPERATOR", source_id: "SRC-COPPA", locator: "16 CFR 312.2 — operator" },
];

const snapshot = { matter_id: "MAT-LEARNING", revision: "map-r1", selected_issue_id: "ISS-AGE", nodes, edges };
const map = layoutDecisionMap(snapshot);
const secondMap = layoutDecisionMap({ nodes: [...nodes].reverse(), edges: [...edges].reverse() });
assert.equal(map.nodes.length, nodes.length, "all identities, including the disconnected issue, receive one layout node");
assert.equal(new Set(map.nodes.map((node) => node.node_id)).size, nodes.length, "labels never deduplicate distinct records");
assert.deepEqual(map.nodes.map((node) => [node.node_id, node.x, node.y]), secondMap.nodes.map((node) => [node.node_id, node.x, node.y]), "layout is deterministic regardless of input order");
assert.ok(map.width > 0 && map.height > 0, "cycle-safe layout supplies a usable canvas extent");
assert.equal(map.nodes.filter((node) => node.node_id === "question:Q-AUDIENCE").length, 1, "the shared factual question is one record");
assert.equal(map.edges.filter((edge) => edge.to_node_id === "question:Q-AUDIENCE").length, 2, "both issue links reach the one shared question");
assert.equal(activeDecisionMapPath(nodes, edges, "question:Q-AUDIENCE").length, 0, "an unknown answer selects no active path");
assert.equal(activeDecisionMapPath([{ node_id: "question:HYPOTHETICAL-UNKNOWN", state: "unknown", hypothetical: true }], [{ edge_id: "active", from_node_id: "question:HYPOTHETICAL-UNKNOWN", to_node_id: "question:HYPOTHETICAL-UNKNOWN", state: "active" }], "question:HYPOTHETICAL-UNKNOWN").length, 0, "a hypothetical unknown answer still selects no active path");
assert.ok(activeDecisionMapPath(nodes, edges, "issue:ISS-CYCLE-A").includes("issue:ISS-CYCLE-B"), "a cycle terminates while retaining both saved records");
const local = visibleDecisionMap(map, snapshot, "neighborhood", null);
assert.deepEqual(new Set(local.nodes.map((node) => node.node_id)), new Set(["issue:ISS-AGE", "question:Q-AUDIENCE"]), "default local scope is the selected issue neighborhood");
assert.equal(Math.min(...local.nodes.map((node) => Number(node.x))), 32, "local visibility rebases nodes instead of preserving hidden-record coordinates");
assert.ok(Number(local.width) < map.width && Number(local.height) < map.height, "local visibility uses only its own presentation bounds");
const whole = visibleDecisionMap(map, snapshot, "whole_matter", null);
assert.ok(whole.nodes.some((node) => node.node_id === "issue:ISS-DISCONNECTED"), "whole-matter scope includes the disconnected issue");
assert.ok(decisionMapFitScale({ width: 4800, height: 3200 }, 390, 420) < 0.1, "fit map can scale below manual zoom limits for a large whole-matter layout");
assert.equal(JSON.stringify(activeDecisionMapPath([{ node_id: "issue:A", state: "open" }, { node_id: "option:B", state: "proposed" }], [{ edge_id: "historic", from_node_id: "issue:A", to_node_id: "option:B", state: "historical" }], "issue:A")), JSON.stringify(["issue:A"]), "historical edges do not imply a real active path");
assert.equal(relationshipLabel("mitigated_by"), "mitigated by", "relationship labels use their saved meaning");
assert.equal(nodeStateLabel({ node_id: "scenario:HISTORICAL", state: "historical", hypothetical: true }), "Hypothetical · Historical", "hypothetical records retain their saved historical state");
assert.equal(nodeStateLabel({ node_id: "question:UNKNOWN", state: "unknown", hypothetical: true }), "Hypothetical · Unknown", "hypothetical records retain their saved unknown state");
assert.equal(nodeStateLabel({ node_id: "work:FAILED", state: "failed", hypothetical: true }), "Hypothetical · Failed", "hypothetical records retain their saved failed state");
assert.equal(new Set(evidence.map((item) => `${item.claim_id}:${item.source_id}:${item.locator}`)).size, 2, "two claim evidence rows keep their separate source locators");

const component = load(componentSource, "DecisionMap.tsx", { "@/lib/decisionMapLayout": layout, "@/lib/decisionMapTypes": {}, "@/lib/workspaceTypes": {} });
const DecisionMap = component.default!;
const DecisionMapOutline = component.DecisionMapOutline as (props: Record<string, unknown>) => ElementNode;
let selected = "";
let discussed: Record<string, unknown> | null = null;
const outlineTree = DecisionMapOutline({ nodes: whole.nodes, edges: whole.edges, selectedNodeId: null, onSelectNode: (id: string) => { selected = id; }, onOpenDocument: () => undefined, onDiscuss: (target: Record<string, unknown>) => { discussed = target; }, matterId: "MAT-LEARNING" });
const outlineNodes = expand(outlineTree);
assert.match(text(outlineTree), /Who is the audience\?[\s\S]*Unknown[\s\S]*Learner age depends on Who is the audience\? · Unknown/, "outline exposes the same saved label, relationship, and unknown state");
assert.match(text(outlineTree), /If launch includes a covered child audience/, "the first saved conditional edge label remains in the accessible outline");
assert.match(text(outlineTree), /If launch is limited to adult learners/, "the second saved conditional edge label remains distinct in the accessible outline");
const audienceButton = outlineNodes.find((node) => node.type === "button" && text(node).includes("Who is the audience?") && text(node).includes("Unknown"))!;
(audienceButton.props.onClick as () => void)();
assert.equal(selected, "question:Q-AUDIENCE", "keyboard-reachable outline selection returns the stable node identity");
const discussButton = outlineNodes.find((node) => node.type === "button" && text(node) === "Discuss this path")!;
(discussButton.props.onClick as () => void)();
assert.equal(discussed?.matter_id, "MAT-LEARNING", "outline discussion retains the parent matter identity");

let cleared: string | null = "not-cleared";
let scenario: Record<string, unknown> | null = null;
let back = "";
const mapTree = DecisionMap({ snapshot, layout: map, selectedNodeId: "question:Q-AUDIENCE", scope: "whole_matter", onSelectNode: (id: string | null) => { cleared = id; }, onScopeChange: () => undefined, onFit: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, onTryDifferentAssumption: (intent: Record<string, unknown>) => { scenario = intent; }, onBackToIssue: (issueId: string) => { back = issueId; }, selectedNodeDetails: "Resolved source detail slot", scenarioPanel: "Hypothetical · Agent analysis" });
const mapNodes = expand(mapTree);
const mapText = text(mapTree);
assert.match(mapText, /Resolved source detail slot[\s\S]*Hypothetical · Agent analysis/, "selected detail and scenario content render outside the canvas");
assert.match(mapText, /Claim references: CLM-AGE, CLM-OPERATOR/, "claim IDs remain a truthful fallback without an invented document target");
assert.match(mapText, /This condition is unknown\. It does not select an active path\./, "the selected unknown condition does not imply an active branch");
assert.ok(mapText.indexOf("Map outline") < mapText.indexOf("Selected Question"), "whole-matter mode leads with the complete readable outline");
assert.ok(mapText.indexOf("Resolved source detail slot") < mapText.indexOf("Show visual map"), "selected support remains outside the optional visual map");
assert.ok(mapNodes.some((node) => node.type === "button" && String(node.props["aria-label"] || "").includes("Who is the audience?")), "the visual map has a keyboard-selectable node");
(mapNodes.find((node) => node.type === "button" && text(node) === "Try a different assumption")!.props.onClick as () => void)();
assert.equal(JSON.stringify(scenario), JSON.stringify({ issue_id: "ISS-AGE", question_id: "Q-AUDIENCE", fact_id: null }), "hypothetical action reports only the selected saved IDs");
(mapNodes.find((node) => node.type === "button" && text(node) === "Back to issue")!.props.onClick as () => void)();
assert.equal(back, "ISS-AGE", "back action returns to the linked issue identity");
(mapNodes.find((node) => node.type === "button" && text(node) === "Clear selection")!.props.onClick as () => void)();
assert.equal(cleared, null, "clear selection reports no active node");

const longLabel = "This deliberately long unresolved issue label must remain readable in selected details and the outline without growing into the next map record";
const presentationNodes = [
  { node_id: "issue:UNRESOLVED", record_type: "issue", record_id: "UNRESOLVED", label: longLabel, state: "unresolved" },
  { node_id: "issue:NEXT", record_type: "issue", record_id: "NEXT", label: "Next saved issue", state: "open" },
];
const presentationSnapshot = { matter_id: "MAT-PRESENTATION", revision: "map-r2", nodes: presentationNodes, edges: [] };
const presentationMap = layoutDecisionMap(presentationSnapshot);
const presentationTree = DecisionMap({ snapshot: presentationSnapshot, layout: presentationMap, selectedNodeId: null, scope: "whole_matter", onSelectNode: () => undefined, onScopeChange: () => undefined, onFit: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, onTryDifferentAssumption: () => undefined, onBackToIssue: () => undefined });
const presentationNodesTree = expand(presentationTree);
const visualSummary = presentationNodesTree.find((node) => node.type === "summary" && text(node).includes("Show visual map"));
assert.ok(visualSummary, "the visual map is optional while the full outline stays available");
assert.ok(presentationNodesTree.some(node => node.type === "h2" && text(node) === "Map outline"));
const longLabelButton = presentationNodesTree.find((node) => node.type === "button" && String(node.props["aria-label"] || "").includes(longLabel))!;
const longLabelStyle = longLabelButton.props.style as Record<string, unknown>;
assert.equal(longLabelButton.props.title, longLabel, "the canvas keeps the full source label in its title");
assert.equal(longLabelStyle.height, presentationMap.nodes.find((node) => node.node_id === "issue:UNRESOLVED")!.height, "a long canvas label cannot grow beyond its allocated layout height");
assert.ok(String(longLabelButton.props.className).includes("canvasNode"));
assert.match(cssRule("canvasNode"), /overflow:\s*hidden/, "a long canvas label is clipped inside its allocated layout bounds");
assert.notEqual(longLabelStyle.background, "var(--healthy-wash)", "the exact unresolved semantic state is not styled as healthy");
assert.match(text(longLabelButton), /…/, "the canvas uses a deterministic short label while the full label remains available elsewhere");
const presentationOutline = DecisionMapOutline({ nodes: presentationMap.nodes, edges: presentationMap.edges, selectedNodeId: null, onSelectNode: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, matterId: "MAT-PRESENTATION" });
assert.match(text(presentationOutline), new RegExp(longLabel), "the outline retains the full source label");
const presentationOutlineNodes = expand(presentationOutline);
const outlineRecord = presentationOutlineNodes.find((node) => node.type === "button" && text(node).includes(longLabel))!;
assert.ok(String(outlineRecord.props.className).includes("outlineSelect"));
for (const selector of ["outlineSelect", "outlineDiscuss"]) {
  assert.match(cssRule(selector), /white-space:\s*normal/, "outline controls wrap");
  assert.match(cssRule(selector), /overflow-wrap:\s*anywhere/, "unspaced labels wrap");
  assert.match(cssRule(selector), /min-width:\s*0/, "controls can shrink");
  assert.match(cssRule(selector), /max-width:\s*100%/, "controls remain bounded");
}
const outlineDiscuss = presentationOutlineNodes.find((node) => node.type === "button" && text(node) === "Discuss this path")!;
assert.ok(String(outlineDiscuss.props.className).includes("outlineDiscuss"));
const longRelationship = "supports this deliberately long relationship label that must remain fully visible inside the outline card";
const relationshipOutline = DecisionMapOutline({ nodes: presentationMap.nodes, edges: [{ edge_id: "LONG-RELATIONSHIP", from_node_id: "issue:UNRESOLVED", to_node_id: "issue:NEXT", relationship: "supports", label: longRelationship, state: "historical" }], selectedNodeId: null, onSelectNode: () => undefined, onOpenDocument: () => undefined, onDiscuss: () => undefined, matterId: "MAT-PRESENTATION" });
const relationshipRow = expand(relationshipOutline).find((node) => node.type === "li" && text(node).includes(longRelationship))!;
assert.ok(String(relationshipRow.props.className).includes("outlineRelationship"));
assert.match(mapStyles, /\.outlineRelationship\s*\{[^}]*overflow-wrap:\s*anywhere/, "relationship labels wrap");
assert.match(cssRule("outlineRelationship"), /min-width:\s*0/, "relationship rows can shrink");

for (const source of [layoutSource, componentSource]) {
  assert.doesNotMatch(source, /localStorage|fetch\(|saveDocument|deleteDocument/, "map presentation does not persist or infer records");
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "map presentation uses shared semantic design variables");
}
console.log("Decision map layout, outline, selection, and callback checks passed. Browser width and zoom checks remain for the coordinator.");
