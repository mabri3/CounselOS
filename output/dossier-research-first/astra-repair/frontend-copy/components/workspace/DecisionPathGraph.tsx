import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { DecisionMapNode } from "@/lib/decisionMapTypes";
import type { DecisionPathLayout } from "@/lib/decisionMapLayout";
import { decisionPathCurve, connectedPathEffects, pathArrowRole, pathArrowRoles, pathRisk, edgeStateLabel, nodeStateLabel, reflowDecisionPathNodes, relationshipLabel } from "@/lib/decisionMapLayout";
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

export default function DecisionPathGraph({ layout, selectedNodeId, onSelectNode, scale = 1, snapshot }: { snapshot?: { nodes: DecisionMapNode[]; edges: import("@/lib/decisionMapTypes").DecisionMapEdge[] }; scale?: number; layout: DecisionPathLayout; selectedNodeId: string | null; onSelectNode: (nodeId: string) => void }) {
  const content = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<Record<string, { width: number; height: number }>>({});
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const drag = useRef<{ id: string; pointerId: number; clientX: number; clientY: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const moveNode = (id: string, x: number, y: number) => {
    setPositions((current) => ({ ...current, [id]: { x: Math.max(0, x), y: Math.max(0, y) } }));
  };
  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const dx = event.clientX - active.clientX;
    const dy = event.clientY - active.clientY;
    if (!active.moved && Math.hypot(dx, dy) < 4) return;
    active.moved = true;
    moveNode(active.id, active.x + dx / scale, active.y + dy / scale);
  };
  const stopDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    event.stopPropagation();
    suppressClick.current = drag.current.moved;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  useEffect(() => {
    const container = content.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observe = () => {
      const next: Record<string, { width: number; height: number }> = {};
      for (const element of container.querySelectorAll<HTMLElement>("[data-map-node-id]")) {
        const id = element.dataset.mapNodeId;
        // Offset geometry stays in the graph coordinate space at every zoom level.
        if (id) next[id] = { width: element.offsetWidth, height: element.offsetHeight };
      }
      setMeasured(next);
    };
    const observer = new ResizeObserver(observe);
    observer.observe(container);
    container.querySelectorAll<HTMLElement>("[data-map-node-id]").forEach((element) => observer.observe(element));
    observe();
    return () => observer.disconnect();
  }, [layout]);
  const measuredNodes = useMemo(() => reflowDecisionPathNodes(layout, measured).map((node) => ({ ...node, ...positions[node.node_id] })), [layout, measured, positions]);
  const contentWidth = Math.max(layout.width, ...measuredNodes.map((node) => node.x + node.width + 32));
  const contentHeight = Math.max(layout.height, ...measuredNodes.map((node) => node.y + node.height + 32));
  const nodesById = useMemo(() => new Map(layout.nodes.map((node) => [node.node_id, node])), [layout.nodes]);
  const drawnEdges = useMemo(() => [...layout.edges].sort((left, right) => edgeAnalysisRank(left, nodesById) - edgeAnalysisRank(right, nodesById) || left.edge_id.localeCompare(right.edge_id)), [layout.edges, nodesById]);
  // Keep labels readable. Current analysis claims its connector space first;
  // when no free position remains, the full relationship is still available
  // through the SVG title and the complete outline.
  const visibleLabelBoxes: LabelBox[] = [];
  return <section aria-label="Focused decision paths" className={styles.pathGraph}>
    <div className={styles.pathGraphScroll}>
      <div className={styles.pathGraphContent} ref={content} style={{ minHeight: contentHeight, minWidth: contentWidth }}>
        <svg aria-hidden="true" className={styles.pathEdges} height={contentHeight} width={contentWidth}>
          <defs>{Object.entries(pathArrowRoles).map(([key, role]) => <marker key={key} id={`decision-path-${key}-arrow`} markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5"><path d="M0,0 L7,3.5 L0,7 z" fill={role.color} /></marker>)}</defs>
          {drawnEdges.map((edge, index) => {
            const channel = drawnEdges.slice(0, index).filter((prior) => prior.from_node_id === edge.from_node_id).length;
            const curve = decisionPathCurve(edge, measuredNodes, channel);
            if (!curve) return null;
            const from = measuredNodes.find((node) => node.node_id === edge.from_node_id);
            const to = measuredNodes.find((node) => node.node_id === edge.to_node_id);
            const arrowRole = pathArrowRole(edge, snapshot?.nodes ?? layout.nodes, snapshot?.edges ?? layout.edges);
            const arrow = pathArrowRoles[arrowRole];
            const contextEdge = from?.record_type === "business_question" || from?.record_type === "issue" || to?.record_type === "business_question" || to?.record_type === "issue" || edge.relationship === "supports";
            const fullLabel = edge.label.trim() || relationshipLabel(edge.relationship);
            const label = compactConnectorLabel(edge);
            const inactive = edge.state === "inactive";
            const dashed = ["unassessed", "unavailable"].includes(arrowRole) || ["unknown", "hypothetical", "historical", "inactive"].includes(edge.state ?? "");
            const lines = wrappedLabel(label);
            const labelWidth = Math.min(140, Math.max(114, Math.max(...lines.map((line) => line.length)) * 6.3 + 14));
            const labelHeight = 22 + lines.length * 13;
            const labelY = contextEdge && arrowRole === "context" ? null : [curve.labelY, curve.labelY + labelHeight + 10, curve.labelY - labelHeight - 10].find((candidate) => !visibleLabelBoxes.some((box) => labelBoxesOverlap(box, { x: curve.labelX - labelWidth / 2, y: candidate - labelHeight / 2, width: labelWidth, height: labelHeight })));
            if (labelY !== undefined && labelY !== null) visibleLabelBoxes.push({ x: curve.labelX - labelWidth / 2, y: labelY - labelHeight / 2, width: labelWidth, height: labelHeight });
            return <g key={edge.edge_id} opacity={inactive || edge.state === "historical" ? 0.45 : 1}><path d={curve.d} fill="none" markerEnd={`url(#decision-path-${arrowRole}-arrow)`} stroke={arrow.color} strokeDasharray={dashed ? "5 5" : undefined} strokeWidth={inactive ? "1.25" : "1.5"} />{labelY === undefined || labelY === null ? null : <><rect className={`${styles.pathEdgeLabelBack} ${inactive ? styles.pathEdgeLabelInactive : ""}`} height={labelHeight} rx="4" width={labelWidth} x={curve.labelX - labelWidth / 2} y={labelY - labelHeight / 2} /><text className={`${styles.pathEdgeLabel} ${inactive ? styles.pathEdgeLabelInactive : ""}`} textAnchor="middle" x={curve.labelX} y={labelY - (lines.length - 1) * 6}>{lines.map((line, lineIndex) => <tspan dy={lineIndex ? 13 : 0} key={`${edge.edge_id}-${line}`} x={curve.labelX}>{line}</tspan>)}</text><text className={`${styles.pathEdgeState} ${inactive ? styles.pathEdgeLabelInactive : ""}`} textAnchor="middle" x={curve.labelX} y={labelY + labelHeight / 2 - 5}>{arrowRole === "context" ? edgeStateLabel(edge) : arrow.label}</text></>}<title>{fullLabel} · {arrow.label} · {edgeStateLabel(edge)}</title></g>;
          })}
        </svg>
        {measuredNodes.map((node) => <button aria-current={node.node_id === selectedNodeId ? "true" : undefined} aria-label={`${node.label}. ${typeLabel(node.record_type)}. ${nodeStateLabel(node)}.`} className={`${styles.pathNode} ${node.record_type === "business_question" || node.record_type === "issue" ? styles.pathContext : ""} ${stateClass(node)} ${node.state === "inactive" || node.group === "historical" || node.state === "historical" ? styles.pathMuted : ""} ${connectedPathEffects(node, snapshot?.nodes ?? layout.nodes, snapshot?.edges ?? layout.edges).some(effect => effect.effective) && !(snapshot?.edges ?? layout.edges).some(edge => edge.from_node_id === node.node_id && edge.relationship === "decided_by" && edge.state === "active") ? styles.pathUnavailable : ""}`} data-map-node-id={node.node_id} key={node.node_id} onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return;
          event.stopPropagation();
          suppressClick.current = false;
          drag.current = { id: node.node_id, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: node.x, y: node.y, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onKeyDown={(event) => {
          const steps: Record<string, [number, number]> = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] };
          const step = steps[event.key];
          if (!event.altKey || !step) return;
          event.preventDefault();
          event.stopPropagation();
          moveNode(node.node_id, node.x + step[0], node.y + step[1]);
        }} onClick={(event) => {
          if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
          onSelectNode(node.node_id);
        }} style={{ left: node.x, top: node.y, width: node.width, minHeight: node.height } as CSSProperties} title={`${node.label} — Drag to move. Alt + arrow keys also move this card.`} type="button"><span className={styles.pathNodeType}>{typeLabel(node.record_type)}</span><strong className={styles.pathNodeTitle}>{node.label}</strong>{connectedPathEffects(node, snapshot?.nodes ?? layout.nodes, snapshot?.edges ?? layout.edges).map((effect, index) => <span className={styles.pathRiskLabel} key={index}>{effect.label}</span>)}<span className={styles.pathNodeState}>{nodeStateLabel(node)}</span>{node.record_type === "option" ? <span className={styles.pathRiskLabel}>End of branch · Open outcome ↓</span> : null}{node.record_type === "option" && pathRisk(node, layout.nodes) ? <span className={styles.pathRiskLabel} style={{ color: pathArrowRoles[pathRisk(node, layout.nodes)!].color }}>{pathArrowRoles[pathRisk(node, layout.nodes)!].label}</span> : null}</button>)}
      </div>
    </div>
  </section>;
}
