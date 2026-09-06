import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { DecisionMapNode } from "@/lib/decisionMapTypes";
import type { DecisionPathLayout } from "@/lib/decisionMapLayout";
import { decisionPathCurve, edgeStateLabel, nodeStateLabel, reflowDecisionPathNodes, relationshipLabel } from "@/lib/decisionMapLayout";
import styles from "./MatterMap.module.css";

function typeLabel(type: DecisionMapNode["record_type"]) {
  return ({ business_question: "Business question", issue: "Issue", legal_test: "Law or test", condition: "Condition", fact: "Fact", question: "Question", option: "Path", scenario: "Scenario", work: "Work", decision: "Recorded decision" } as const)[type];
}

function stateClass(node: DecisionMapNode) {
  const state = node.state.toLowerCase().replace(/[\s-]+/g, "_");
  if (node.missing_reference || state === "missing" || state === "failed") return styles.pathFailure;
  if (node.hypothetical || state === "proposed" || state === "candidate" || state === "recommended") return styles.pathAgent;
  if (["recorded", "resolved", "complete", "completed", "done"].includes(state)) return styles.pathRecorded;
  return styles.pathAttention;
}

function edgeStroke(state: string | undefined) {
  if (state === "missing") return "var(--failure)";
  if (state === "unknown") return "var(--attention)";
  if (state === "hypothetical") return "var(--agent)";
  if (state === "inactive") return "var(--line)";
  return "var(--ink-4)";
}

function wrappedLabel(label: string) {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > 28 && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function compactConnectorLabel(edge: { relationship: string; label: string }) {
  if (edge.relationship === "assessed_under") return "Assessed under";
  if (edge.relationship === "depends_on") return "Depends on";
  if (edge.relationship === "supports") return "Supported by";
  if (edge.relationship === "requires") return "Requires";
  if (edge.relationship === "if") return edge.label.toLowerCase().includes("not met") ? "If not met" : edge.label.toLowerCase().includes("alternative") ? "Alternative" : "If met";
  return edge.label.trim() || relationshipLabel(edge.relationship as never);
}

type LabelBox = { x: number; y: number; width: number; height: number };
function labelBoxesOverlap(left: LabelBox, right: LabelBox) {
  return left.x < right.x + right.width && left.x + left.width > right.x && left.y < right.y + right.height && left.y + left.height > right.y;
}

function edgeAnalysisRank(edge: { from_node_id: string; to_node_id: string; state?: string }, nodes: Map<string, DecisionMapNode>) {
  const rank = (node: DecisionMapNode | undefined) => ({ current: 0, legacy: 1, historical: 2, hypothetical: 3, missing: 4 } as Record<string, number>)[node?.group ?? "current"] ?? 1;
  return Math.max(rank(nodes.get(edge.from_node_id)), rank(nodes.get(edge.to_node_id)), edge.state === "historical" ? 2 : 0);
}

export default function DecisionPathGraph({ layout, selectedNodeId, onSelectNode }: { layout: DecisionPathLayout; selectedNodeId: string | null; onSelectNode: (nodeId: string) => void }) {
  const content = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  useEffect(() => {
    const container = content.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observe = () => {
      const next: Record<string, { x: number; y: number; width: number; height: number }> = {};
      for (const element of container.querySelectorAll<HTMLElement>("[data-map-node-id]")) {
        const id = element.dataset.mapNodeId;
        // Offset geometry stays in the graph coordinate space at every zoom level.
        if (id) next[id] = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
      }
      setMeasured(next);
    };
    const observer = new ResizeObserver(observe);
    observer.observe(container);
    container.querySelectorAll<HTMLElement>("[data-map-node-id]").forEach((element) => observer.observe(element));
    observe();
    return () => observer.disconnect();
  }, [layout]);
  const measuredNodes = useMemo(() => reflowDecisionPathNodes(layout, measured), [layout, measured]);
  const contentHeight = Math.max(layout.height, ...measuredNodes.map((node) => node.y + node.height + 32));
  const nodesById = useMemo(() => new Map(layout.nodes.map((node) => [node.node_id, node])), [layout.nodes]);
  const drawnEdges = useMemo(() => [...layout.edges].sort((left, right) => edgeAnalysisRank(left, nodesById) - edgeAnalysisRank(right, nodesById) || left.edge_id.localeCompare(right.edge_id)), [layout.edges, nodesById]);
  // Keep labels readable. Current analysis claims its connector space first;
  // when no free position remains, the full relationship is still available
  // through the SVG title and the complete outline.
  const visibleLabelBoxes: LabelBox[] = [];
  return <section aria-label="Focused decision paths" className={styles.pathGraph}>
    <div className={styles.pathGraphScroll}>
      <div className={styles.pathGraphContent} ref={content} style={{ minHeight: contentHeight, minWidth: layout.width }}>
        <div className={styles.pathLanes} aria-hidden="true">{layout.lanes.map((lane) => <span key={lane.id} style={{ left: lane.x, width: lane.width }}>{lane.label}</span>)}</div>
        <svg aria-hidden="true" className={styles.pathEdges} height={contentHeight} width={layout.width}>
          <defs><marker id="decision-path-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5"><path d="M0,0 L7,3.5 L0,7 z" fill="var(--ink-4)" /></marker><marker id="decision-path-inactive-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5"><path d="M0,0 L7,3.5 L0,7 z" fill="var(--line)" /></marker></defs>
          {drawnEdges.map((edge, index) => {
            const channel = drawnEdges.slice(0, index).filter((prior) => prior.from_node_id === edge.from_node_id).length;
            const curve = decisionPathCurve(edge, measuredNodes, channel);
            if (!curve) return null;
            const from = measuredNodes.find((node) => node.node_id === edge.from_node_id);
            const to = measuredNodes.find((node) => node.node_id === edge.to_node_id);
            const contextEdge = from?.record_type === "business_question" || from?.record_type === "issue" || to?.record_type === "business_question" || to?.record_type === "issue" || edge.relationship === "supports";
            const fullLabel = edge.label.trim() || relationshipLabel(edge.relationship);
            const label = compactConnectorLabel(edge);
            const inactive = edge.state === "inactive";
            const dashed = ["unknown", "hypothetical", "historical", "inactive"].includes(edge.state ?? "");
            const lines = wrappedLabel(label);
            const labelWidth = Math.min(104, Math.max(62, Math.max(...lines.map((line) => line.length)) * 6.3 + 14));
            const labelHeight = 22 + lines.length * 13;
            const labelY = contextEdge ? null : [curve.labelY, curve.labelY + labelHeight + 10, curve.labelY - labelHeight - 10].find((candidate) => !visibleLabelBoxes.some((box) => labelBoxesOverlap(box, { x: curve.labelX - labelWidth / 2, y: candidate - labelHeight / 2, width: labelWidth, height: labelHeight })));
            if (labelY !== undefined && labelY !== null) visibleLabelBoxes.push({ x: curve.labelX - labelWidth / 2, y: labelY - labelHeight / 2, width: labelWidth, height: labelHeight });
            return <g key={edge.edge_id}><path d={curve.d} fill="none" markerEnd={`url(#decision-path-${inactive ? "inactive-" : ""}arrow)`} stroke={edgeStroke(edge.state)} strokeDasharray={dashed ? "5 5" : undefined} strokeWidth={inactive ? "1.25" : "1.5"} />{labelY === undefined || labelY === null ? null : <><rect className={`${styles.pathEdgeLabelBack} ${inactive ? styles.pathEdgeLabelInactive : ""}`} height={labelHeight} rx="4" width={labelWidth} x={curve.labelX - labelWidth / 2} y={labelY - labelHeight / 2} /><text className={`${styles.pathEdgeLabel} ${inactive ? styles.pathEdgeLabelInactive : ""}`} textAnchor="middle" x={curve.labelX} y={labelY - (lines.length - 1) * 6}>{lines.map((line, lineIndex) => <tspan dy={lineIndex ? 13 : 0} key={`${edge.edge_id}-${line}`} x={curve.labelX}>{line}</tspan>)}</text><text className={`${styles.pathEdgeState} ${inactive ? styles.pathEdgeLabelInactive : ""}`} textAnchor="middle" x={curve.labelX} y={labelY + labelHeight / 2 - 5}>{edgeStateLabel(edge)}</text></>}<title>{fullLabel} · {edgeStateLabel(edge)}</title></g>;
          })}
        </svg>
        {measuredNodes.map((node) => <button aria-current={node.node_id === selectedNodeId ? "true" : undefined} aria-label={`${node.label}. ${typeLabel(node.record_type)}. ${nodeStateLabel(node)}.`} className={`${styles.pathNode} ${node.record_type === "business_question" || node.record_type === "issue" ? styles.pathContext : ""} ${stateClass(node)}`} data-map-node-id={node.node_id} key={node.node_id} onClick={() => onSelectNode(node.node_id)} style={{ left: node.x, top: node.y, width: node.width, minHeight: node.height } as CSSProperties} title={node.label} type="button"><span className={styles.pathNodeType}>{typeLabel(node.record_type)}</span><strong className={styles.pathNodeTitle}>{node.label}</strong><span className={styles.pathNodeState}>{nodeStateLabel(node)}</span></button>)}
      </div>
    </div>
  </section>;
}
