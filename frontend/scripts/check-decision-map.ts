import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type Exports = Record<string, unknown>;
function load(source: string) {
  const module = { exports: {} as Exports };
  const output = ts.transpileModule(source, { fileName: "decisionMapLayout.ts", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(output, { exports: module.exports, module, require: () => ({}) });
  return module.exports as Record<string, (...args: never[]) => unknown>;
}

const source = await readFile(new URL("../lib/decisionMapLayout.ts", import.meta.url), "utf8");
const layout = load(source);
const nodes = [
  { node_id: "business_question:BQ", record_type: "business_question", record_id: "BQ", label: "Can launch proceed?", state: "open" },
  { node_id: "issue:A", record_type: "issue", record_id: "A", label: "Focused issue", state: "open" },
  { node_id: "issue:B", record_type: "issue", record_id: "B", label: "Other issue", state: "open" },
  { node_id: "fact:SHARED", record_type: "fact", record_id: "SHARED", label: "Shared release fact", state: "unknown", issue_ids: ["A", "B"] },
  { node_id: "legal_test:A", record_type: "legal_test", record_id: "A", label: "A test", state: "saved", issue_ids: ["A"] },
  { node_id: "condition:A", record_type: "condition", record_id: "A", label: "A condition", state: "unknown", issue_ids: ["A"] },
  { node_id: "option:A1", record_type: "option", record_id: "A1", label: "A first option", state: "candidate", issue_ids: ["A"] },
  { node_id: "option:A2", record_type: "option", record_id: "A2", label: "A sibling option", state: "candidate", issue_ids: ["A"] },
  { node_id: "legal_test:B", record_type: "legal_test", record_id: "B", label: "Private B test", state: "saved", issue_ids: ["B"] },
];
const edges = [
  { edge_id: "bq-a", from_node_id: "business_question:BQ", to_node_id: "issue:A", relationship: "depends_on", label: "Includes issue", state: "active" },
  { edge_id: "bq-b", from_node_id: "business_question:BQ", to_node_id: "issue:B", relationship: "depends_on", label: "Includes issue", state: "active" },
  { edge_id: "a-test", from_node_id: "issue:A", to_node_id: "legal_test:A", relationship: "assessed_under", label: "Assessed under", state: "active" },
  { edge_id: "test-condition", from_node_id: "legal_test:A", to_node_id: "condition:A", relationship: "depends_on", label: "Depends on whether", state: "unknown" },
  { edge_id: "shared-condition", from_node_id: "fact:SHARED", to_node_id: "condition:A", relationship: "supports", label: "Supports", state: "active" },
  { edge_id: "condition-a1", from_node_id: "condition:A", to_node_id: "option:A1", relationship: "if", label: "If met", state: "unknown" },
  { edge_id: "condition-a2", from_node_id: "condition:A", to_node_id: "option:A2", relationship: "if", label: "If not met", state: "inactive" },
  { edge_id: "shared-b", from_node_id: "fact:SHARED", to_node_id: "legal_test:B", relationship: "supports", label: "Supports", state: "active" },
];
const focused = layout.focusedDecisionPath({ matter_id: "MAT", revision: "r1", selected_issue_id: "A", nodes, edges }, "A") as { nodes: Array<{ node_id: string; x: number; y: number }>; edges: Array<{ edge_id: string; from_node_id: string; to_node_id: string }>; lanes: Array<{ label: string }> };
const ids = new Set(focused.nodes.map((node) => node.node_id));
for (const edge of focused.edges) {
  const from = focused.nodes.find((node) => node.node_id === edge.from_node_id)!;
  const to = focused.nodes.find((node) => node.node_id === edge.to_node_id)!;
  assert.ok(from.x < to.x, "each downstream step follows its inputs from left to right");
}
for (const id of ["business_question:BQ", "issue:A", "fact:SHARED", "legal_test:A", "condition:A", "option:A1", "option:A2"]) assert.ok(ids.has(id), `focused slice keeps ${id}`);
assert.ok(!ids.has("issue:B") && !ids.has("legal_test:B"), "a shared fact does not pull another issue's private branch into the focused slice");
assert.equal(JSON.stringify([...new Set(focused.edges.map((edge) => edge.edge_id))].sort()), JSON.stringify(edges.filter((edge) => ids.has(edge.from_node_id) && ids.has(edge.to_node_id)).map((edge) => edge.edge_id).sort()), "focused edges retain exactly the visible canonical identities");
assert.ok(focused.edges.some((edge) => edge.edge_id === "condition-a2" && edge.state === "inactive"), "an inactive route remains visible as a canonical structural edge");
const stretched = layout.reflowDecisionPathNodes(focused, { "option:A1": { width: 300, height: 400 } }) as Array<{ node_id: string; y: number }>;
assert.ok(stretched.find((node) => node.node_id === "option:A2")!.y >= stretched.find((node) => node.node_id === "option:A1")!.y + 448, "long cards leave a clear gap before the next card in their column");
assert.ok((layout.decisionMapFitScale({ width: 4800, height: 3200 }, 390, 420) as number) >= .72, "fit retains the readable scale floor");
assert.equal((layout.activeDecisionMapPath([{ node_id: "condition:UNKNOWN", state: "unknown" }], [{ edge_id: "a", from_node_id: "condition:UNKNOWN", to_node_id: "condition:UNKNOWN", state: "active" }], "condition:UNKNOWN") as string[]).length, 0, "unknown never chooses a path");
assert.equal(JSON.stringify(layout.activeDecisionMapPath(
  [{ node_id: "condition:MET", state: "met" }, { node_id: "option:ACTIVE", state: "candidate" }, { node_id: "option:INACTIVE", state: "candidate" }],
  [{ edge_id: "active", from_node_id: "condition:MET", to_node_id: "option:ACTIVE", state: "active" }, { edge_id: "inactive", from_node_id: "condition:MET", to_node_id: "option:INACTIVE", state: "inactive" }],
  "condition:MET",
) as string[]), JSON.stringify(["condition:MET", "option:ACTIVE"]), "inactive routes stay structural but are excluded from the active traversal");
console.log("Decision map focused-slice and readable-fit checks passed.");
