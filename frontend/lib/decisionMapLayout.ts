import type {
  DecisionMapEdge,
  DecisionMapLayout,
  DecisionMapLayoutNode,
  DecisionMapNode,
  DecisionMapRelationship,
  DecisionMapSnapshot,
} from "./decisionMapTypes";

const NODE_WIDTH = 224;
const NODE_HEIGHT = 116;
const COLUMN_GAP = 78;
const ROW_GAP = 28;
const COMPONENT_GAP = 54;
const PADDING = 32;
export const DECISION_PATH_FIT_FLOOR = 0.72;

export type DecisionPathLane = "law" | "change" | "path" | "context";
export interface DecisionPathLayout extends DecisionMapLayout {
  lanes: Array<{ id: DecisionPathLane; label: string; x: number; width: number }>;
}

type MapData = Pick<DecisionMapSnapshot, "nodes" | "edges">;

export function relationshipLabel(relationship: DecisionMapRelationship): string {
  return ({ depends_on: "depends on", if: "if", supports: "supports", mitigated_by: "mitigated by", decided_by: "decided by", assessed_under: "assessed under", requires: "requires" })[relationship];
}

export function readableMapState(state: string | null | undefined, fallback = "Recorded"): string {
  const value = state?.trim().replace(/_/g, " ");
  if (!value) return fallback;
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizedNodeState(node: DecisionMapNode): string {
  return node.state.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function nodeStateLabel(node: DecisionMapNode): string {
  const labels: string[] = [];
  if (node.missing_reference) labels.push("Missing reference");
  if (node.hypothetical) labels.push("Hypothetical");
  const savedState = readableMapState(node.state, "");
  if (savedState && !labels.some((label) => label.toLowerCase() === savedState.toLowerCase())) labels.push(savedState);
  return labels.join(" · ") || "Recorded";
}

export function edgeStateLabel(edge: DecisionMapEdge): string {
  return readableMapState(edge.state, "Recorded");
}

function sortedIds(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function adjacency(nodes: readonly DecisionMapNode[], edges: readonly DecisionMapEdge[]) {
  const known = new Set(nodes.map((node) => node.node_id));
  const forward = new Map<string, string[]>();
  const reverse = new Map<string, string[]>();
  for (const node of nodes) { forward.set(node.node_id, []); reverse.set(node.node_id, []); }
  for (const edge of edges) {
    if (!known.has(edge.from_node_id) || !known.has(edge.to_node_id)) continue;
    forward.get(edge.from_node_id)!.push(edge.to_node_id);
    reverse.get(edge.to_node_id)!.push(edge.from_node_id);
  }
  for (const list of forward.values()) list.sort();
  for (const list of reverse.values()) list.sort();
  return { forward, reverse };
}

/**
 * Iterative Kosaraju traversal. It gives every saved identity one component,
 * including shared records, disconnected records, and cycles.
 */
function stronglyConnectedComponents(nodes: readonly DecisionMapNode[], edges: readonly DecisionMapEdge[]) {
  const { forward, reverse } = adjacency(nodes, edges);
  const finished: string[] = [];
  const visited = new Set<string>();
  for (const start of sortedIds(forward.keys())) {
    if (visited.has(start)) continue;
    const stack: Array<{ id: string; next: number }> = [{ id: start, next: 0 }];
    visited.add(start);
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const nextId = forward.get(frame.id)![frame.next++];
      if (nextId) {
        if (!visited.has(nextId)) { visited.add(nextId); stack.push({ id: nextId, next: 0 }); }
      } else { finished.push(frame.id); stack.pop(); }
    }
  }
  const componentByNode = new Map<string, number>();
  const components: string[][] = [];
  for (const start of [...finished].reverse()) {
    if (componentByNode.has(start)) continue;
    const component: string[] = [];
    const stack = [start];
    componentByNode.set(start, components.length);
    while (stack.length) {
      const id = stack.pop()!;
      component.push(id);
      for (const nextId of reverse.get(id)!) if (!componentByNode.has(nextId)) {
        componentByNode.set(nextId, components.length);
        stack.push(nextId);
      }
    }
    components.push(component.sort());
  }
  return { components, componentByNode };
}

/** Build a stable, presentation-only layout. It never changes node identity. */
export function layoutDecisionMap(data: MapData): DecisionMapLayout {
  const nodes = [...data.nodes].sort((left, right) => left.node_id.localeCompare(right.node_id));
  const edges = [...data.edges].sort((left, right) => left.edge_id.localeCompare(right.edge_id));
  if (!nodes.length) return { nodes: [], edges, width: NODE_WIDTH + PADDING * 2, height: NODE_HEIGHT + PADDING * 2 };

  const { components, componentByNode } = stronglyConnectedComponents(nodes, edges);
  const incoming = components.map(() => new Set<number>());
  const outgoing = components.map(() => new Set<number>());
  for (const edge of edges) {
    const from = componentByNode.get(edge.from_node_id);
    const to = componentByNode.get(edge.to_node_id);
    if (from === undefined || to === undefined || from === to) continue;
    outgoing[from].add(to); incoming[to].add(from);
  }
  const rank = components.map(() => 0);
  const ready = sortedIds(components.map((component, index) => incoming[index].size === 0 ? String(index) : "").filter(Boolean)).map(Number);
  while (ready.length) {
    const current = ready.shift()!;
    for (const next of [...outgoing[current]].sort((left, right) => left - right)) {
      rank[next] = Math.max(rank[next], rank[current] + 1);
      incoming[next].delete(current);
      if (!incoming[next].size) { ready.push(next); ready.sort((left, right) => left - right); }
    }
  }
  const componentsByRank = new Map<number, number[]>();
  components.forEach((component, index) => {
    const list = componentsByRank.get(rank[index]) ?? [];
    list.push(index); componentsByRank.set(rank[index], list);
  });
  const positions = new Map<string, { x: number; y: number }>();
  let maxY = PADDING;
  for (const [column, componentIds] of [...componentsByRank.entries()].sort(([left], [right]) => left - right)) {
    let y = PADDING;
    for (const componentId of componentIds.sort((left, right) => components[left][0].localeCompare(components[right][0]))) {
      for (const nodeId of components[componentId]) {
        positions.set(nodeId, { x: PADDING + column * (NODE_WIDTH + COLUMN_GAP), y });
        y += NODE_HEIGHT + ROW_GAP;
      }
      y += COMPONENT_GAP - ROW_GAP;
    }
    maxY = Math.max(maxY, y);
  }
  const maxRank = Math.max(...rank);
  const layoutNodes: DecisionMapLayoutNode[] = nodes.map((node) => ({ ...node, ...positions.get(node.node_id)!, width: NODE_WIDTH, height: NODE_HEIGHT }));
  return { nodes: layoutNodes, edges, width: PADDING * 2 + (maxRank + 1) * NODE_WIDTH + maxRank * COLUMN_GAP, height: Math.max(NODE_HEIGHT + PADDING * 2, maxY - COMPONENT_GAP + PADDING) };
}

export function mapAnchorNodeId(snapshot: DecisionMapSnapshot, selectedNodeId: string | null, focusedIssueId?: string | null): string | null {
  const issueId = focusedIssueId ?? snapshot.selected_issue_id;
  const issueNode = issueId ? snapshot.nodes.find((node) => node.node_id === `issue:${issueId}` || (node.record_type === "issue" && node.record_id === issueId)) : undefined;
  if (issueNode) return issueNode.node_id;
  return selectedNodeId && snapshot.nodes.some((node) => node.node_id === selectedNodeId) ? selectedNodeId : null;
}

export function visibleDecisionMap(layout: DecisionMapLayout, snapshot: DecisionMapSnapshot, scope: "neighborhood" | "whole_matter", selectedNodeId: string | null, focusedIssueId?: string | null): DecisionMapLayout {
  const anchor = mapAnchorNodeId(snapshot, selectedNodeId, focusedIssueId);
  if (scope === "whole_matter" || !anchor) return rebaseDecisionMapLayout(layout);
  const visibleIds = new Set([anchor]);
  for (const edge of layout.edges) if (edge.from_node_id === anchor || edge.to_node_id === anchor) {
    visibleIds.add(edge.from_node_id); visibleIds.add(edge.to_node_id);
  }
  return rebaseDecisionMapLayout({ ...layout, nodes: layout.nodes.filter((node) => visibleIds.has(node.node_id)), edges: layout.edges.filter((edge) => visibleIds.has(edge.from_node_id) && visibleIds.has(edge.to_node_id)) });
}

/** Rebase a visible sub-map so hidden records do not reserve off-screen space. */
export function rebaseDecisionMapLayout(layout: DecisionMapLayout): DecisionMapLayout {
  if (!layout.nodes.length) return { ...layout, width: NODE_WIDTH + PADDING * 2, height: NODE_HEIGHT + PADDING * 2 };
  const minX = Math.min(...layout.nodes.map((node) => node.x));
  const minY = Math.min(...layout.nodes.map((node) => node.y));
  const maxX = Math.max(...layout.nodes.map((node) => node.x + node.width));
  const maxY = Math.max(...layout.nodes.map((node) => node.y + node.height));
  return {
    ...layout,
    nodes: layout.nodes.map((node) => ({ ...node, x: node.x - minX + PADDING, y: node.y - minY + PADDING })),
    width: maxX - minX + PADDING * 2,
    height: maxY - minY + PADDING * 2,
  };
}

/** Keep cards readable. Larger maps pan inside their viewport instead of shrinking text away. */
export function decisionMapFitScale(layout: Pick<DecisionMapLayout, "width" | "height">, viewportWidth: number, viewportHeight: number): number {
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight) || viewportWidth <= 0 || viewportHeight <= 0) return 1;
  const raw = Math.min(viewportWidth / (layout.width + 24), viewportHeight / (layout.height + 24));
  return Math.min(1, Math.max(DECISION_PATH_FIT_FLOOR, raw));
}

function issueNode(snapshot: DecisionMapSnapshot, issueId: string) {
  return snapshot.nodes.find((node) => node.record_type === "issue" && node.record_id === issueId);
}

function nodeLane(node: DecisionMapNode): DecisionPathLane {
  if (node.record_type === "legal_test") return "law";
  if (["condition", "fact", "question"].includes(node.record_type)) return "change";
  if (["option", "work", "decision", "scenario"].includes(node.record_type)) return "path";
  return "context";
}

function measuredHeight(node: DecisionMapNode, width: number): number {
  const charactersPerLine = Math.max(22, Math.floor((width - 34) / 7.3));
  const titleLines = Math.max(1, Math.ceil(node.label.length / charactersPerLine));
  if (["business_question", "issue"].includes(node.record_type)) return Math.min(98, Math.max(76, 36 + titleLines * 17));
  // The full summary remains in the inspector and outline. Graph cards measure
  // only their visible title and state, so the first decision fork stays readable.
  return Math.min(164, Math.max(104, 60 + titleLines * 21));
}

/**
 * Build the stable issue slice. The focused issue, rather than a clicked child,
 * remains the anchor; related issue cards preserve the question context.
 */
export function focusedDecisionPath(snapshot: DecisionMapSnapshot, focusedIssueId: string | null | undefined): DecisionPathLayout {
  const focus = focusedIssueId ?? snapshot.selected_issue_id;
  if (!focus || !issueNode(snapshot, focus)) return { ...rebaseDecisionMapLayout(layoutDecisionMap(snapshot)), lanes: [] };
  const focusNode = issueNode(snapshot, focus)!;
  const nodesById = new Map(snapshot.nodes.map((node) => [node.node_id, node]));
  const included = new Set<string>([focusNode.node_id]);
  const include = (nodeId: string) => { if (nodesById.has(nodeId)) included.add(nodeId); };

  // Canonical analysis identities carry issue_ids; retain them even after a child is selected.
  for (const node of snapshot.nodes) if (node.issue_ids?.includes(focus)) include(node.node_id);
  for (const edge of snapshot.edges) {
    if (edge.from_node_id === focusNode.node_id || edge.to_node_id === focusNode.node_id) {
      include(edge.from_node_id); include(edge.to_node_id);
    }
  }
  // Traverse analysis relationships without following another issue's private branch.
  for (let pass = 0; pass < 3; pass += 1) for (const edge of snapshot.edges) {
    const from = nodesById.get(edge.from_node_id); const to = nodesById.get(edge.to_node_id);
    if (!from || !to) continue;
    const fromIncluded = included.has(from.node_id); const toIncluded = included.has(to.node_id);
    const mayInclude = (node: DecisionMapNode) => node.record_type === "business_question" || (node.record_type !== "issue" && (!node.issue_ids?.length || node.issue_ids.includes(focus)));
    if (fromIncluded && mayInclude(to)) include(to.node_id);
    if (toIncluded && mayInclude(from)) include(from.node_id);
  }
  // Keep only the business-question ancestor. Sibling paths belong to the same
  // issue analysis; another issue's private branch must not leak through a shared fact.
  for (const edge of snapshot.edges) {
    const from = nodesById.get(edge.from_node_id); const to = nodesById.get(edge.to_node_id);
    if (from?.record_type === "business_question" && to?.record_type === "issue" && included.has(to.node_id)) {
      include(from.node_id);
    }
  }

  const visibleNodes = snapshot.nodes.filter((node) => included.has(node.node_id));
  const visibleEdges = snapshot.edges.filter((edge) => included.has(edge.from_node_id) && included.has(edge.to_node_id));
  const lanes: Array<{ id: DecisionPathLane; label: string; x: number; width: number }> = [
    { id: "law", label: "Law or test", x: PADDING, width: 250 },
    { id: "change", label: "What changes the answer", x: 430, width: 270 },
    { id: "path", label: "Possible paths", x: 810, width: 270 },
  ];
  const nextY = new Map<DecisionPathLane, number>([["law", 144], ["change", 144], ["path", 144], ["context", 12]]);
  const positions = new Map<string, { x: number; y: number; width: number; height: number }>();
  const groups: Record<DecisionPathLane, DecisionMapNode[]> = { law: [], change: [], path: [], context: [] };
  for (const node of visibleNodes) groups[nodeLane(node)].push(node);
  const semanticOrder = (left: DecisionMapNode, right: DecisionMapNode) => {
    const analysisRank = (node: DecisionMapNode) => ({ current: 0, legacy: 1, historical: 2, hypothetical: 3, missing: 4 } as Record<string, number>)[node.group ?? "current"] ?? 1;
    const priority = (node: DecisionMapNode) => node.record_type === "business_question" ? 0 : node.record_type === "issue" ? 1 : node.record_type === "legal_test" ? 2 : node.record_type === "condition" ? 3 : node.record_type === "fact" ? 4 : node.record_type === "question" ? 5 : node.record_type === "option" ? 6 : node.record_type === "work" ? 7 : node.record_type === "decision" ? 8 : 9;
    return analysisRank(left) - analysisRank(right) || priority(left) - priority(right) || left.label.localeCompare(right.label) || left.node_id.localeCompare(right.node_id);
  };
  const contextNodes = groups.context.sort(semanticOrder);
  contextNodes.forEach((node, index) => {
    const width = 480;
    positions.set(node.node_id, { x: PADDING + index * 498, y: 12, width, height: measuredHeight(node, width) });
  });
  const contextBottom = Math.max(124, ...contextNodes.map((node) => positions.get(node.node_id)!.y + positions.get(node.node_id)!.height + 20));
  for (const lane of ["law", "change", "path"] as DecisionPathLane[]) {
    const laneSpec = lanes.find((entry) => entry.id === lane);
    const width = laneSpec?.width ?? 978;
    nextY.set(lane, Math.max(nextY.get(lane)!, contextBottom));
    for (const node of groups[lane].sort(semanticOrder)) {
      const height = measuredHeight(node, width);
      const y = nextY.get(lane)!;
      positions.set(node.node_id, { x: laneSpec?.x ?? PADDING, y, width, height });
      nextY.set(lane, y + height + 20);
    }
  }
  const layoutNodes = visibleNodes.map((node) => ({ ...node, ...positions.get(node.node_id)! }));
  const maxY = Math.max(...layoutNodes.map((node) => node.y + node.height), 260) + PADDING;
  return { nodes: layoutNodes, edges: visibleEdges, lanes, width: 1112, height: maxY };
}

/** Apply DOM card measurements without changing identities or semantic lane order. */
export function reflowDecisionPathNodes(layout: DecisionPathLayout, measurements: Record<string, Pick<DecisionMapLayoutNode, "width" | "height">>): DecisionMapLayoutNode[] {
  if (!layout.lanes.length) return layout.nodes.map((node) => ({ ...node, ...(measurements[node.node_id] ?? {}) }));
  const result = new Map(layout.nodes.map((node) => [node.node_id, { ...node, ...(measurements[node.node_id] ?? {}) }]));
  const context = layout.nodes.filter((node) => node.y < 140);
  const laneNodes = layout.nodes.filter((node) => node.y >= 140);
  const contextBottom = Math.max(144, ...context.map((node) => { const current = result.get(node.node_id)!; return current.y + current.height + 20; }));
  for (const lane of layout.lanes) {
    const ordered = laneNodes.filter((node) => node.x === lane.x).sort((left, right) => left.y - right.y || left.label.localeCompare(right.label));
    let y = Math.max(ordered[0]?.y ?? 0, contextBottom);
    for (const node of ordered) {
      const current = result.get(node.node_id)!;
      current.y = y;
      y += current.height + 20;
    }
  }
  return layout.nodes.map((node) => result.get(node.node_id)!);
}

export function decisionPathCurve(edge: DecisionMapEdge, nodes: readonly DecisionMapLayoutNode[], channel = 0) {
  const from = nodes.find((node) => node.node_id === edge.from_node_id);
  const to = nodes.find((node) => node.node_id === edge.to_node_id);
  if (!from || !to) return null;
  const leftToRight = from.x <= to.x;
  const startX = leftToRight ? from.x + from.width : from.x;
  const endX = leftToRight ? to.x : to.x + to.width;
  const startY = from.y + from.height / 2;
  const endY = to.y + to.height / 2;
  const bend = Math.max(56, Math.abs(endX - startX) * .38) + channel * 10;
  const direction = leftToRight ? 1 : -1;
  return { d: `M ${startX} ${startY} C ${startX + bend * direction} ${startY}, ${endX - bend * direction} ${endY}, ${endX} ${endY}`, labelX: (startX + endX) / 2, labelY: (startY + endY) / 2 + channel * 36 };
}

/** Unknown conditions remain visible but never imply an active branch. */
export function activeDecisionMapPath(nodes: readonly DecisionMapNode[], edges: readonly DecisionMapEdge[], selectedNodeId: string | null): string[] {
  if (!selectedNodeId) return [];
  const selected = nodes.find((node) => node.node_id === selectedNodeId);
  if (!selected || normalizedNodeState(selected) === "unknown") return [];
  const path = new Set([selectedNodeId]);
  const queue = [selectedNodeId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const edge of edges) {
      if (edge.state !== "active" || (edge.from_node_id !== id && edge.to_node_id !== id)) continue;
      const next = edge.from_node_id === id ? edge.to_node_id : edge.from_node_id;
      if (!path.has(next)) { path.add(next); queue.push(next); }
    }
  }
  return [...path];
}
