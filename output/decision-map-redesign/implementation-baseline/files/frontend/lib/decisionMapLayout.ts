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

type MapData = Pick<DecisionMapSnapshot, "nodes" | "edges">;

export function relationshipLabel(relationship: DecisionMapRelationship): string {
  return ({ depends_on: "depends on", if: "if", supports: "supports", mitigated_by: "mitigated by", decided_by: "decided by" })[relationship];
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

export function mapAnchorNodeId(snapshot: DecisionMapSnapshot, selectedNodeId: string | null): string | null {
  if (selectedNodeId && snapshot.nodes.some((node) => node.node_id === selectedNodeId)) return selectedNodeId;
  const issueId = snapshot.selected_issue_id;
  const issueNode = issueId ? snapshot.nodes.find((node) => node.node_id === `issue:${issueId}` || (node.record_type === "issue" && node.record_id === issueId)) : undefined;
  return issueNode?.node_id ?? null;
}

export function visibleDecisionMap(layout: DecisionMapLayout, snapshot: DecisionMapSnapshot, scope: "neighborhood" | "whole_matter", selectedNodeId: string | null): DecisionMapLayout {
  const anchor = mapAnchorNodeId(snapshot, selectedNodeId);
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

/** The fit action may use a very small scale so every visible record fits. */
export function decisionMapFitScale(layout: Pick<DecisionMapLayout, "width" | "height">, viewportWidth: number, viewportHeight: number): number {
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight) || viewportWidth <= 0 || viewportHeight <= 0) return 1;
  return Math.min(viewportWidth / (layout.width + 24), viewportHeight / (layout.height + 24));
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
