"use client";

import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { ConversationTarget } from "@/lib/workspaceTypes";
import type { DecisionMapLayout, DecisionMapNode, DecisionMapProps, ScenarioLaunchIntent } from "@/lib/decisionMapTypes";
import type { DecisionPathLayout } from "@/lib/decisionMapLayout";
import { decisionMapFitScale, focusedDecisionPath, nodeStateLabel, rebaseDecisionMapLayout } from "@/lib/decisionMapLayout";
import DecisionMapInspector from "./DecisionMapInspector";
import DecisionMapOutlineComponent from "./DecisionMapOutline";
import DecisionPathGraph from "./DecisionPathGraph";
import styles from "./MatterMap.module.css";

export { default as DecisionMapOutline } from "./DecisionMapOutline";

const MIN_MANUAL_ZOOM = 0.72;
const MAX_MANUAL_ZOOM = 1.5;

function conversationTarget(node: DecisionMapNode | null, matterId: string, focusedIssueId: string | null): ConversationTarget {
  return { matter_id: matterId, issue_id: focusedIssueId ?? (node?.record_type === "issue" ? node.record_id : node?.issue_ids?.[0] ?? null), analysis_id: node?.analysis_id ?? null, analysis_revision: node?.analysis_revision ?? null, option_id: node?.record_type === "option" ? node.record_id : null, option_revision: typeof node?.data?.option_revision === "string" ? node.data.option_revision : null };
}

function scenarioIntent(node: DecisionMapNode | null, focusedIssueId: string | null): ScenarioLaunchIntent {
  return { issue_id: node?.record_type === "issue" ? node.record_id : focusedIssueId ?? node?.issue_ids?.[0] ?? null, question_id: node?.record_type === "question" ? node.record_id : null, fact_id: node?.record_type === "fact" ? node.record_id : null, condition_id: node?.record_type === "condition" ? node.record_id : null, analysis_id: node?.analysis_id ?? null, analysis_revision: node?.analysis_revision ?? null, option_id: node?.record_type === "option" ? node.record_id : null, option_revision: typeof node?.data?.option_revision === "string" ? node.data.option_revision : null };
}

function graphLayout(layout: DecisionMapLayout): DecisionPathLayout {
  return "lanes" in layout ? layout as DecisionPathLayout : { ...layout, lanes: [] };
}

/** Focus fixes the complete issue slice; selecting a child only changes its preview. */
export default function DecisionMap({ snapshot, layout, focusedIssueId = null, selectedNodeId, scope, busy = false, error = null, onFocusIssue, onAnalyzePaths, onRecordPath, onSelectNode, onScopeChange, onFit, onOpenDocument, onDiscuss, onTryDifferentAssumption, scenarioPanel, selectedNodeDetails, onBackToIssue }: DecisionMapProps) {
  const focus = focusedIssueId ?? snapshot.selected_issue_id ?? null;
  const focusLayout = useMemo(() => focusedDecisionPath(snapshot, focus), [snapshot, focus]);
  const allLayout = useMemo(() => rebaseDecisionMapLayout(layout), [layout]);
  const visible = scope === "neighborhood" ? focusLayout : allLayout;
  const selectedNode = visible.nodes.find((node) => node.node_id === selectedNodeId) ?? snapshot.nodes.find((node) => node.node_id === selectedNodeId) ?? null;
  const status = focus ? snapshot.issue_analyses?.[focus] ?? null : null;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const viewport = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };
  const fit = () => {
    const width = viewport.current?.clientWidth ?? visible.width;
    const height = viewport.current?.clientHeight ?? 520;
    setScale(decisionMapFitScale(visible, width, height));
    setOffset({ x: 0, y: 0 });
    onFit();
  };
  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset({ x: drag.current.offsetX + event.clientX - drag.current.x, y: drag.current.offsetY + event.clientY - drag.current.y });
  };
  const stopPan = () => { drag.current = null; };
  const issueNode = focus ? snapshot.nodes.find((node) => node.record_type === "issue" && node.record_id === focus) ?? null : null;
  const explanation = status?.analysis?.explanation ?? issueNode?.detail ?? "Select an issue to see the law, facts, and possible paths.";
  const outline = <DecisionMapOutlineComponent edges={visible.edges} focusedIssueId={focus} matterId={snapshot.matter_id} nodes={visible.nodes} onDiscuss={onDiscuss} onSelectNode={onSelectNode} selectedNodeId={selectedNodeId} />;
  const graph = <div className={styles.focusedViewport} onPointerCancel={stopPan} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} ref={viewport}><div className={styles.focusedViewportContent} style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}><DecisionPathGraph layout={graphLayout(visible)} onSelectNode={onSelectNode} selectedNodeId={selectedNodeId} /></div></div>;

  return <section aria-busy={busy || undefined} aria-label="Decision map" className={styles.shell}>
    {error ? <p className="warning-callout" role="status">{error}</p> : null}
    <section className={`${styles.card} ${styles.mapHeader}`}><div><span className={styles.meta}>Decision map</span><h2 className={styles.sectionTitle}>{scope === "neighborhood" ? "This issue" : "All issues"}</h2><p className={styles.mapSummary}>{scope === "neighborhood" ? explanation : "Review every saved record and relationship in this matter."}</p>{status && status.state !== "saved" ? <span className={`state-label ${styles.analysisState}`}>{status.state.replace(/_/g, " ")}</span> : null}</div><div className={styles.scopeControls}><button aria-pressed={scope === "neighborhood"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => { if (focus) onFocusIssue?.(focus); onScopeChange("neighborhood"); }} type="button">This issue</button><button aria-pressed={scope === "whole_matter"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("whole_matter")} type="button">All issues ({snapshot.nodes.length} records)</button></div></section>
    {scope === "neighborhood" ? <><section aria-label="Focused decision graph" className={`${styles.card} ${styles.visualCard}`}>{graph}<div aria-label="Focused graph controls" className={styles.mapToolbar}><button className="btn quiet" disabled={scale <= MIN_MANUAL_ZOOM} onClick={() => setScale((value) => Math.max(MIN_MANUAL_ZOOM, value - .1))} type="button">Zoom out</button><span aria-live="polite" className={styles.meta}>{Math.round(scale * 100)}%</span><button className="btn quiet" disabled={scale >= MAX_MANUAL_ZOOM} onClick={() => setScale((value) => Math.min(MAX_MANUAL_ZOOM, value + .1))} type="button">Zoom in</button><button className="btn quiet" onClick={fit} type="button">Fit this issue</button><button className="btn quiet" onClick={reset} type="button">Reset view</button></div></section><DecisionMapInspector focusedIssueId={focus} node={selectedNode} onAnalyzePaths={onAnalyzePaths} onBackToIssue={() => { if (focus) onBackToIssue(focus); }} onDiscuss={() => onDiscuss(conversationTarget(selectedNode, snapshot.matter_id, focus))} onOpenDocument={onOpenDocument} onRecordPath={onRecordPath} onSelectNode={onSelectNode} onTryDifferentAssumption={() => onTryDifferentAssumption(scenarioIntent(selectedNode, focus))} status={status} />{selectedNodeDetails ? <section aria-label="Selected record support" className={`${styles.card} ${styles.selectedSupport}`}>{selectedNodeDetails}</section> : null}{outline}</> : <><section aria-label="All issues outline">{outline}</section>{selectedNode ? <DecisionMapInspector focusedIssueId={focus} node={selectedNode} onAnalyzePaths={onAnalyzePaths} onBackToIssue={() => { if (focus) onBackToIssue(focus); }} onDiscuss={() => onDiscuss(conversationTarget(selectedNode, snapshot.matter_id, focus))} onOpenDocument={onOpenDocument} onRecordPath={onRecordPath} onSelectNode={onSelectNode} onTryDifferentAssumption={() => onTryDifferentAssumption(scenarioIntent(selectedNode, focus))} status={status} /> : null}<details className={`${styles.card} ${styles.mapDisclosure}`}><summary>Show general graph ({visible.nodes.length} records)</summary><div className={styles.mapDisclosureBody}>{graph}</div></details></>}
    {scenarioPanel ? <section aria-label="Try a different assumption" className={styles.scenarioSurface}>{scenarioPanel}</section> : null}
  </section>;
}
