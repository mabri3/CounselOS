"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { ConversationTarget } from "@/lib/workspaceTypes";
import type { DecisionMapEdge, DecisionMapLayout, DecisionMapLayoutNode, DecisionMapNode, DecisionMapOutlineProps, DecisionMapProps, ScenarioLaunchIntent } from "@/lib/decisionMapTypes";
import { decisionMapFitScale, edgeStateLabel, nodeStateLabel, relationshipLabel, visibleDecisionMap } from "@/lib/decisionMapLayout";
import MatterIcon from "./MatterIcon";
import styles from "./MatterMap.module.css";

const MIN_MANUAL_ZOOM = 0.1;
const MAX_MANUAL_ZOOM = 2;
const MAX_CANVAS_LABEL_LENGTH = 56;
const MAX_CANVAS_EDGE_LABEL_LENGTH = 22;

function normalizedNodeState(node: DecisionMapNode): string {
  return node.state.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function recordTypeLabel(recordType: DecisionMapNode["record_type"]): string {
  return ({ business_question: "Business question", issue: "Issue", fact: "Fact", question: "Question", option: "Option", scenario: "Scenario", work: "Work item", decision: "Decision" } as const)[recordType];
}

function canvasLabel(label: string): string {
  if (label.length <= MAX_CANVAS_LABEL_LENGTH) return label;
  return `${label.slice(0, MAX_CANVAS_LABEL_LENGTH - 1).trimEnd()}…`;
}

function edgeLabel(edge: DecisionMapEdge): string {
  return edge.label.trim() || relationshipLabel(edge.relationship);
}

function canvasEdgeLabel(edge: DecisionMapEdge): string {
  const label = edgeLabel(edge);
  if (label.length <= MAX_CANVAS_EDGE_LABEL_LENGTH) return label;
  return `${label.slice(0, MAX_CANVAS_EDGE_LABEL_LENGTH - 1).trimEnd()}…`;
}

function stateStyle(node: DecisionMapNode): CSSProperties {
  const state = normalizedNodeState(node);
  if (node.record_type === "business_question") return { background: "var(--agent-wash)", borderColor: "var(--agent-edge)", "--node-state": "var(--agent)" } as CSSProperties;
  if (node.missing_reference || state === "missing" || state === "failed") return { background: "var(--failure-wash)", borderColor: "var(--failure-edge)", "--node-state": "var(--failure)" } as CSSProperties;
  if (state === "active" || state === "unknown" || state === "open" || state === "unresolved") return { background: "var(--attention-wash)", borderColor: "var(--attention)", "--node-state": "var(--attention-deep)" } as CSSProperties;
  if (node.hypothetical || state === "hypothetical" || state === "agent" || state === "agent_analysis" || state === "proposed") return { background: "var(--agent-wash)", borderColor: "var(--agent-edge)", "--node-state": "var(--agent)" } as CSSProperties;
  if (state === "complete" || state === "completed" || state === "done" || state === "resolved" || state === "recorded") return { background: "var(--healthy-wash)", borderColor: "var(--healthy-tint)", "--node-state": "var(--healthy)" } as CSSProperties;
  return { background: "var(--rail)", borderColor: "var(--line)", "--node-state": "var(--ink-3)" } as CSSProperties;
}

function mapConversationTarget(node: DecisionMapNode, matterId: string): ConversationTarget {
  const issueId = node.record_type === "issue" ? node.record_id : node.issue_ids?.[0] ?? null;
  return { matter_id: matterId, issue_id: issueId };
}

function scenarioIntent(node: DecisionMapNode): ScenarioLaunchIntent {
  return {
    issue_id: node.record_type === "issue" ? node.record_id : node.issue_ids?.[0] ?? null,
    question_id: node.record_type === "question" ? node.record_id : null,
    fact_id: node.record_type === "fact" ? node.record_id : null,
  };
}

function backIssueId(node: DecisionMapNode, fallback: string | null | undefined): string | null {
  return node.record_type === "issue" ? node.record_id : node.issue_ids?.[0] ?? fallback ?? null;
}

function selectedStateClass(node: DecisionMapNode) {
  const state = normalizedNodeState(node);
  if (node.missing_reference || state === "missing" || state === "failed") return "state-failure";
  if (state === "active" || state === "unknown" || state === "open" || state === "unresolved") return "state-attention";
  if (node.hypothetical || state === "hypothetical" || state === "agent" || state === "agent_analysis" || state === "proposed") return "state-agent";
  if (state === "complete" || state === "completed" || state === "done" || state === "resolved" || state === "recorded") return "state-healthy";
  return "state-attention";
}

function edgeCoordinates(edge: DecisionMapEdge, nodes: readonly DecisionMapLayoutNode[]) {
  const from = nodes.find((node) => node.node_id === edge.from_node_id);
  const to = nodes.find((node) => node.node_id === edge.to_node_id);
  if (!from || !to) return null;
  const x1 = from.x + from.width;
  const y1 = from.y + from.height / 2;
  const x2 = to.x;
  const y2 = to.y + to.height / 2;
  return { x1, y1, x2, y2, labelX: (x1 + x2) / 2, labelY: (y1 + y2) / 2 };
}

function CanvasNode({ node, selected, onSelect }: { node: DecisionMapLayoutNode; selected: boolean; onSelect: (nodeId: string) => void }) {
  const state = stateStyle(node);
  return <button aria-current={selected ? "true" : undefined} aria-label={`${node.label}. ${recordTypeLabel(node.record_type)}. ${nodeStateLabel(node)}.`} className={`btn quiet ${styles.canvasNode}`} onClick={() => onSelect(node.node_id)} style={{ ...state, left: node.x, top: node.y, width: node.width, height: node.height, border: `1px solid ${state.borderColor}`, boxShadow: selected ? "0 0 0 3px var(--agent-tint)" : undefined }} title={node.label} type="button">
    <span className={styles.canvasNodeType}>{recordTypeLabel(node.record_type)}</span>
    <strong className={styles.canvasNodeTitle}>{canvasLabel(node.label)}</strong>
    <span className={styles.canvasNodeState}>{nodeStateLabel(node)}</span>
  </button>;
}

function MapCanvas({ layout, selectedNodeId, onSelectNode, scale, offset, onPointerDown, onPointerMove, onPointerUp }: { layout: DecisionMapLayout; selectedNodeId: string | null; onSelectNode: (nodeId: string) => void; scale: number; offset: { x: number; y: number }; onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void; onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void; onPointerUp: () => void }) {
  const canvasWidth = Math.max(layout.width, 360);
  const canvasHeight = Math.max(layout.height, 380);
  return <div aria-label="Decision map visual" className={styles.canvas}>
    <div className={styles.canvasContent} onPointerCancel={onPointerUp} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} style={{ width: canvasWidth, height: canvasHeight, transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
      <svg aria-hidden="true" height={canvasHeight} style={{ inset: 0, overflow: "visible", pointerEvents: "none", position: "absolute" }} width={canvasWidth}>
        <defs><marker id="decision-map-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5"><path d="M0,0 L7,3.5 L0,7 z" fill="var(--ink-4)" /></marker></defs>
        {layout.edges.map((edge) => {
          const line = edgeCoordinates(edge, layout.nodes);
          if (!line) return null;
          const missing = edge.state === "missing";
          const unknown = edge.state === "unknown";
          return <g key={edge.edge_id}>
            <line markerEnd="url(#decision-map-arrow)" stroke={missing ? "var(--failure)" : unknown ? "var(--attention)" : "var(--ink-5)"} strokeDasharray={unknown || edge.state === "hypothetical" || edge.state === "historical" ? "5 5" : undefined} strokeWidth="1.5" x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} />
            <rect fill="var(--paper)" height="30" rx="4" width="120" x={line.labelX - 60} y={line.labelY - 15} />
            <text fill="var(--ink-3)" fontFamily="var(--sans)" fontSize="11" textAnchor="middle" x={line.labelX} y={line.labelY - 1}>{canvasEdgeLabel(edge)}</text>
            <text fill={missing ? "var(--failure)" : unknown ? "var(--attention-deep)" : "var(--ink-4)"} fontFamily="var(--sans)" fontSize="10" textAnchor="middle" x={line.labelX} y={line.labelY + 11}>{edgeStateLabel(edge)}</text>
          </g>;
        })}
      </svg>
      {layout.nodes.map((node) => <CanvasNode key={node.node_id} node={node} onSelect={onSelectNode} selected={node.node_id === selectedNodeId} />)}
    </div>
  </div>;
}

/** The outline deliberately receives the exact visible arrays used by the visual map. */
export function DecisionMapOutline({ nodes, edges, selectedNodeId, onSelectNode, onDiscuss, onOpenDocument, matterId }: DecisionMapOutlineProps & { matterId?: string }) {
  void onOpenDocument;
  return <section aria-label="Decision map outline" className={`${styles.card} ${styles.outline}`}>
    <h2 className={styles.sectionTitle}>Map outline</h2>
    <p className={styles.muted}>Use this list to reach every visible record and relationship without the visual map.</p>
    {!nodes.length ? <p className={styles.muted}>No saved records are visible in this scope.</p> : <ul className={styles.outlineList}>{nodes.map((node) => <li className={styles.outlineRow} key={node.node_id}>
      <button aria-current={selectedNodeId === node.node_id ? "true" : undefined} className={`btn quiet ${styles.outlineSelect}`} onClick={() => onSelectNode(node.node_id)} title={node.label} type="button"><strong className={styles.outlineName}>{canvasLabel(node.label)}</strong><span className={styles.outlineNodeMeta}>{recordTypeLabel(node.record_type)} · {nodeStateLabel(node)}</span></button>
      {matterId ? <button className={`btn quiet ${styles.outlineDiscuss}`} onClick={() => onDiscuss(mapConversationTarget(node, matterId))} type="button">Discuss this path</button> : null}
    </li>)}</ul>}
    <details className={styles.relationshipDisclosure}><summary>Visible relationships ({edges.length})</summary>{!edges.length ? <p className={styles.muted}>No saved relationships are visible in this scope.</p> : <ul className={styles.relationshipList}>{edges.map((edge) => {
      const from = nodes.find((node) => node.node_id === edge.from_node_id)?.label ?? edge.from_node_id;
      const to = nodes.find((node) => node.node_id === edge.to_node_id)?.label ?? edge.to_node_id;
      return <li className={styles.outlineRelationship} key={edge.edge_id}><strong>{from}</strong> {edgeLabel(edge)} <strong>{to}</strong> · {edgeStateLabel(edge)}</li>;
    })}</ul>}</details>
  </section>;
}

function useNarrowScreen() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

export default function DecisionMap({ snapshot, layout, selectedNodeId, scope, busy = false, error = null, onSelectNode, onScopeChange, onFit, onOpenDocument, onDiscuss, onTryDifferentAssumption, scenarioPanel, selectedNodeDetails, onBackToIssue }: DecisionMapProps) {
  // Node data has no document target. C6 supplies a resolved target through selectedNodeDetails.
  void onOpenDocument;
  const visible = useMemo(() => visibleDecisionMap(layout, snapshot, scope, selectedNodeId), [layout, selectedNodeId, scope, snapshot]);
  const selectedNode = visible.nodes.find((node) => node.node_id === selectedNodeId) ?? layout.nodes.find((node) => node.node_id === selectedNodeId) ?? null;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const viewport = useRef<HTMLDivElement | null>(null);
  const narrow = useNarrowScreen();
  const matterId = snapshot.matter_id;
  const select = (nodeId: string) => onSelectNode(nodeId);
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };
  const fit = () => {
    const width = viewport.current?.clientWidth ?? visible.width;
    const height = viewport.current?.clientHeight ?? 420;
    setScale(decisionMapFitScale(visible, width, height));
    setOffset({ x: 12, y: 12 });
    onFit();
  };
  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    dragging.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragging.current;
    if (!start) return;
    setOffset({ x: start.offsetX + event.clientX - start.x, y: start.offsetY + event.clientY - start.y });
  };
  const stopPan = () => { dragging.current = null; };
  const outline = <DecisionMapOutline edges={visible.edges} matterId={matterId} nodes={visible.nodes} onDiscuss={onDiscuss} onOpenDocument={() => undefined} onSelectNode={select} selectedNodeId={selectedNodeId} />;
  const visual = <section aria-label="Decision map controls and visual" className={`${styles.card} ${styles.visualCard}`}>
    <div className={styles.headerRow}>
      <div><h2 className={styles.sectionTitle}>Decision map</h2><p className={styles.muted}>Explore how saved issues, facts, and decisions connect to the business question.</p></div>
      <div className={styles.scopeControls}><button aria-pressed={scope === "neighborhood"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("neighborhood")} type="button">Local neighborhood</button><button aria-pressed={scope === "whole_matter"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("whole_matter")} type="button">Whole matter ({snapshot.nodes.length} records)</button></div>
    </div>
    <div className={styles.viewport} ref={viewport}><MapCanvas layout={visible} offset={offset} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} onSelectNode={select} scale={scale} selectedNodeId={selectedNodeId} /></div>
    <div aria-label="Map viewport controls" className={styles.mapToolbar}><button className="btn quiet" disabled={scale <= MIN_MANUAL_ZOOM} onClick={() => setScale((value) => Math.max(MIN_MANUAL_ZOOM, value - 0.1))} type="button"><MatterIcon name="search" size={17} /> Zoom out</button><span aria-live="polite" className={styles.meta}>{Math.round(scale * 100)}%</span><button className="btn quiet" disabled={scale >= MAX_MANUAL_ZOOM} onClick={() => setScale((value) => Math.min(MAX_MANUAL_ZOOM, value + 0.1))} type="button"><MatterIcon name="search" size={17} /> Zoom in</button><button className="btn quiet" onClick={fit} type="button">Fit map</button><button className="btn quiet" onClick={reset} type="button">Reset</button></div>
  </section>;
  const selectedTitle = selectedNode ? canvasLabel(selectedNode.label) : "";
  const selectedTitleIsShortened = selectedNode ? selectedTitle !== selectedNode.label : false;
  const selectedDetail = selectedNode ? <aside aria-label="Selected map record" className={`${styles.card} ${styles.selectedCard}`}><div className={styles.selectedHeader}><div><span className={styles.meta}>Selected {recordTypeLabel(selectedNode.record_type)}</span><h2 className={styles.selectedTitle}>{selectedTitle}</h2>{selectedTitleIsShortened ? <details className={styles.selectedFullTitle}><summary>Read full record title</summary><p>{selectedNode.label}</p></details> : null}<span className={`state-label ${selectedStateClass(selectedNode)}`}>{nodeStateLabel(selectedNode)}</span></div><div className={styles.selectedTopActions}><button className="btn quiet" onClick={() => onSelectNode(null)} type="button">Clear selection</button><button className="btn primary" onClick={() => onDiscuss(mapConversationTarget(selectedNode, matterId))} type="button">Discuss this path</button></div></div>{normalizedNodeState(selectedNode) === "unknown" ? <p className={styles.muted}>This condition is unknown. It does not select an active path.</p> : null}{selectedNode.detail ? <p className={styles.muted}>{selectedNode.detail}</p> : null}{selectedNode.claim_ids?.length ? <p className={styles.muted}>Claim references: {selectedNode.claim_ids.join(", ")}. Source details are shown when a saved document target is available.</p> : null}{selectedNodeDetails}<div className={styles.selectedActions}><button className="btn quiet" onClick={() => onTryDifferentAssumption(scenarioIntent(selectedNode))} type="button">Try a different assumption</button>{backIssueId(selectedNode, snapshot.selected_issue_id) ? <button className="btn quiet" onClick={() => onBackToIssue(backIssueId(selectedNode, snapshot.selected_issue_id)!)} type="button">Back to issue</button> : null}</div></aside> : <p className={`${styles.muted} ${styles.emptyState}`}>Select a record to see its saved detail and actions.</p>;
  const localVisual = narrow ? <details className={`${styles.card} ${styles.mapDisclosure}`}><summary>Show visual map</summary><div className={styles.mapDisclosureBody}>{visual}</div></details> : <section aria-label="Local neighborhood map visual">{visual}</section>;

  const mapContent = scope === "whole_matter" ? <><section aria-label="Whole matter map controls" className={`${styles.card} ${styles.headerRow}`}><div><h2 className={styles.sectionTitle}>Whole matter</h2><p className={styles.muted}>{visible.nodes.length} visible records. The outline is shown first for readable review.</p></div><div className={styles.controlRow}><button aria-pressed={false} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("neighborhood")} type="button">Local neighborhood</button><button aria-pressed={true} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("whole_matter")} type="button">Show whole matter</button></div></section><section aria-label="Whole matter map outline">{outline}</section>{selectedDetail}<details className={`${styles.card} ${styles.mapDisclosure}`}><summary>Show visual map ({visible.nodes.length} records)</summary><div className={styles.mapDisclosureBody}>{visual}</div></details></> : <>{localVisual}{selectedDetail}{outline}</>;

  return <section aria-busy={busy || undefined} aria-label="Decision map" className={styles.shell}>
    {error ? <p className="warning-callout" role="status">{error}</p> : null}
    <div hidden={Boolean(scenarioPanel)}>{mapContent}</div>
    {scenarioPanel ? <section aria-label="Try a different assumption" className={styles.scenarioSurface}>{scenarioPanel}</section> : null}
  </section>;
}
