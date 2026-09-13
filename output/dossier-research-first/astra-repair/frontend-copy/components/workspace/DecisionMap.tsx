"use client";

import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { ConversationTarget } from "@/lib/workspaceTypes";
import type { DecisionMapLayout, DecisionMapNode, DecisionMapProps, ScenarioLaunchIntent } from "@/lib/decisionMapTypes";
import type { DecisionPathLayout } from "@/lib/decisionMapLayout";
import { decisionMapFitScale, connectedPathEffects, pathArrowRoles, focusedDecisionPath, nodeStateLabel, rebaseDecisionMapLayout } from "@/lib/decisionMapLayout";
import IssueOverview from "./IssueOverview";
import PathOutcome from "./PathOutcome";
import IssuePaths from "./IssuePaths";
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
export default function DecisionMap({ snapshot, layout, focusedIssueId = null, selectedNodeId, scope, analyzingIssueId, analysisResult, busy = false, error = null, onFocusIssue, onAnalyzePaths, onRecordPath, onSelectNode, onScopeChange, onFit, onOpenDocument, onDiscuss, onTryDifferentAssumption, scenarioPanel, selectedNodeDetails, onBackToIssue, onRefresh }: DecisionMapProps) {
  const focus = focusedIssueId ?? snapshot.selected_issue_id ?? null;
  const [showHistory, setShowHistory] = useState(false);
  const focusLayout = useMemo(() => {
    const nodes = showHistory ? snapshot.nodes : snapshot.nodes.filter(node => node.group !== "historical" && node.state !== "historical");
    const ids = new Set(nodes.map(node => node.node_id));
    return focusedDecisionPath({...snapshot, nodes, edges: snapshot.edges.filter(edge => ids.has(edge.from_node_id) && ids.has(edge.to_node_id) && (showHistory || edge.state !== "historical"))}, focus);
  }, [snapshot, focus, showHistory]);
  const allLayout = useMemo(() => rebaseDecisionMapLayout(layout), [layout]);
  const visible = scope === "neighborhood" ? focusLayout : allLayout;
  const selectedRecord = visible.nodes.find((node) => node.node_id === selectedNodeId) ?? snapshot.nodes.find((node) => node.node_id === selectedNodeId) ?? null;
  const isInformationTask = (node: DecisionMapNode) => node.data?.kind === "clarify" || /^(confirm|clarify|gather|verify)\b.*\b(facts|information|details)\b/i.test(node.label);
  const informationTasks = focusLayout.nodes.filter(n => n.record_type === "option" && n.group !== "historical" && isInformationTask(n));
  const businessOptions = focusLayout.nodes.filter(n => n.record_type === "option" && n.group !== "historical" && !isInformationTask(n));
  const selectedNode = selectedRecord?.record_type === "issue" || !selectedRecord ? businessOptions.find(n => n.data?.recommendation === "recommended") ?? businessOptions[0] ?? selectedRecord : selectedRecord;
  const status = focus ? snapshot.issue_analyses?.[focus] ?? null : null;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastPathId, setLastPathId] = useState<string | null>(selectedNode?.record_type === "option" ? selectedNode.node_id : null);
  const pathDetails = useRef<HTMLDivElement | null>(null);
  const recordDetails = useRef<HTMLDivElement | null>(null);
  const showDetails = (target: HTMLDivElement | null) => {
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    target?.focus({ preventScroll: true });
  };
  const selectAndReveal = (nodeId: string | null) => {
    onSelectNode(nodeId);
    const node = snapshot.nodes.find(item => item.node_id === nodeId);
    if (node?.record_type === "issue") { reset(); onFocusIssue?.(node.record_id); onScopeChange("neighborhood"); requestAnimationFrame(() => viewport.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
    if (node?.record_type === "option") { if (node.issue_ids?.[0] && node.issue_ids[0] !== focus) { onFocusIssue?.(node.issue_ids[0]); onScopeChange("neighborhood"); onSelectNode(node.node_id); reset(); } setLastPathId(node.node_id); }
    if (node && node.record_type !== "issue") requestAnimationFrame(() => {
      showDetails(node.record_type === "option" ? pathDetails.current : recordDetails.current);
    });
  };
  const viewport = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [layoutReset, setLayoutReset] = useState(0);
  const reset = () => { setLayoutReset((value) => value + 1); setScale(1); setOffset({ x: 0, y: 0 }); };
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
  const explanation = status?.analysis?.explanation || issueNode?.detail || issueNode?.label || "Select an issue to see the law, facts, and possible paths.";
  const outline = <DecisionMapOutlineComponent edges={visible.edges} focusedIssueId={focus} matterId={snapshot.matter_id} nodes={visible.nodes} onDiscuss={onDiscuss} onSelectNode={onSelectNode} selectedNodeId={selectedNodeId} />;
  const graph = <div className={styles.focusedViewport} onPointerCancel={stopPan} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} ref={viewport}><div className={styles.focusedViewportContent} style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}><DecisionPathGraph key={`${snapshot.matter_id}:${focus}:${scope}:${layoutReset}`} scale={scale} snapshot={snapshot} layout={graphLayout(visible)} onSelectNode={selectAndReveal} selectedNodeId={selectedNodeId} /></div></div>;

  return <section aria-busy={busy || undefined} aria-label="Decision map" className={styles.shell}>
    {error ? <p className="warning-callout" role="status">{error}</p> : null}
    <section className={`${styles.card} ${styles.mapHeader}`}><div><span className={styles.meta}>Decision map</span><h2 className={styles.sectionTitle}>{scope === "neighborhood" ? status?.analysis?.display_title || "This issue" : "All issues"}</h2><p className={styles.mapSummary}>{scope === "neighborhood" ? explanation : "See how issues connect, then open an issue to explore its paths."}</p>{status && status.state !== "saved" ? <span className={`state-label ${styles.analysisState}`}>{status.state === "not_mapped" ? "No paths created yet" : status.state.replace(/_/g, " ")}</span> : null}</div><div className={styles.scopeControls}><button aria-pressed={scope === "neighborhood"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => { if (focus) onFocusIssue?.(focus); onScopeChange("neighborhood"); }} type="button">This issue</button><button aria-pressed={scope === "whole_matter"} className={`btn quiet ${styles.scopeButton}`} disabled={busy} onClick={() => onScopeChange("whole_matter")} type="button">All issues ({snapshot.nodes.filter(node => node.record_type === "issue" && node.group !== "historical").length})</button></div></section>
    {scope === "neighborhood" ? <><div className={styles.decisionWorkspace}><nav className={`${styles.card} ${styles.choiceMap}`} aria-label="Issue choices"><span className={styles.meta}>Decision map</span><h3>Your choices</h3><p>Select a choice to review its effect and what remains.</p>{businessOptions.map(option => { const chosen = snapshot.edges.some(edge => edge.from_node_id === option.node_id && edge.relationship === "decided_by" && edge.state === "active"); const unavailable = !chosen && connectedPathEffects(option, snapshot.nodes, snapshot.edges).some(effect => effect.effective); return <button type="button" key={option.node_id} aria-pressed={selectedNode?.node_id === option.node_id} className={`${styles.choiceMapNode} ${unavailable ? styles.pathMuted : ""}`} onClick={() => selectAndReveal(option.node_id)}><span style={{color: chosen ? "var(--path-chosen)" : option.data?.recommendation === "recommended" ? "var(--path-recommended)" : undefined}}>{chosen ? "Recorded choice" : unavailable ? "Unavailable / not chosen" : option.data?.recommendation === "recommended" ? "Recommended" : "Possible choice"}</span><strong>{option.label}</strong>{Array.isArray(option.data?.requirements) && option.data.requirements.length ? <small>Questions {option.data.requirements.map(req => status?.analysis?.conditions.findIndex(c => c.condition_id === (req as {condition_id:string}).condition_id)).filter(index => index !== undefined && index >= 0).map(index => index! + 1).join(", ")}</small> : null}<span aria-hidden="true">→</span></button>; })}{!businessOptions.length ? <p>No business choices mapped yet.</p> : null}{informationTasks.length ? <div><span className={styles.meta}>Next task</span>{informationTasks.map(task => <button className="btn quiet" key={task.node_id} onClick={() => selectAndReveal(task.node_id)}>{task.label}</button>)}</div> : null}{focus && onAnalyzePaths ? <button className="btn quiet" disabled={busy} onClick={() => onAnalyzePaths(focus)}>{busy && analyzingIssueId === focus ? "Updating this issue…" : "Update this issue"}</button> : null}</nav><div ref={pathDetails} tabIndex={-1} className={styles.pathDetailTarget}>{selectedNode?.record_type === "option" && status?.analysis && selectedNode.analysis_revision === status.analysis.analysis_revision ? <PathOutcome onDiscussQuestion={conditionId => onDiscuss({...conversationTarget(selectedNode, snapshot.matter_id, focus), condition_id:conditionId})} onAnalyze={() => { if (focus) onAnalyzePaths?.(focus); }} key={selectedNode.node_id} node={selectedNode} status={status} snapshot={snapshot} onSelectNode={selectAndReveal} onRecordPath={onRecordPath} onRefresh={onRefresh} onDiscuss={prompt => onDiscuss(conversationTarget(selectedNode, snapshot.matter_id, focus), prompt)} /> : <IssuePaths key={focus} status={status} nodes={visible.nodes} selectedNodeId={selectedNodeId} busy={busy} onSelectNode={selectAndReveal} onAnalyze={() => { if (focus) onAnalyzePaths?.(focus); }} />}<div ref={recordDetails} tabIndex={-1} className={styles.pathDetailTarget}>{selectedNode?.record_type !== "option" && lastPathId && visible.nodes.some(n => n.node_id === lastPathId) ? <button className="btn quiet" onClick={() => selectAndReveal(lastPathId)}>Return to outcome</button> : null}<details open={selectedNode?.record_type !== "option"}><summary>Saved record and source support</summary><DecisionMapInspector focusedIssueId={focus} node={selectedNode} onAnalyzePaths={onAnalyzePaths} onBackToIssue={() => { if (focus) onBackToIssue(focus); }} onDiscuss={() => onDiscuss(conversationTarget(selectedNode, snapshot.matter_id, focus))} onOpenDocument={onOpenDocument} onRecordPath={onRecordPath} onSelectNode={onSelectNode} onTryDifferentAssumption={() => onTryDifferentAssumption(scenarioIntent(selectedNode, focus))} status={status} /></details></div></div></div><details className={styles.card}><summary>Related issues</summary><IssueOverview analyzingIssueId={analyzingIssueId} analysisResult={analysisResult} busy={busy} onAnalyze={onAnalyzePaths} snapshot={snapshot} focus={focus} onOpen={selectAndReveal} /></details><details className={styles.card}><summary>Full map, facts, and history</summary><section aria-label="Focused decision graph" className={`${styles.card} ${styles.visualCard}`}><div className={styles.mapToolbar}><div><h2 className={styles.sectionTitle}>Explore this issue</h2><p>Click a path to open its facts and consequences below the map.</p></div>{focus && onAnalyzePaths ? <button className="btn primary" disabled={busy} onClick={() => onAnalyzePaths(focus)} type="button">{busy && analyzingIssueId === focus ? "Analyzing this issue…" : status?.analysis ? "Update analysis" : "Analyze paths"}</button> : null}</div><p className={styles.mapMoveHint}>Analysis finds possible paths and explains their facts, consequences, and risks. Updating uses the current saved facts.</p><div aria-label="Arrow legend" className={styles.arrowLegend}>{Object.entries(pathArrowRoles).map(([key, role]) => <span key={key}><svg width="32" height="12" aria-hidden="true"><path d="M0 6 H27 M22 2 L28 6 L22 10" fill="none" stroke={role.color} strokeWidth="2" strokeDasharray={key === "unassessed" ? "4 3" : undefined} /></svg>{role.label}</span>)}<p>Green means a recorded decision, not the card you are viewing. Risk labels remain on chosen or recommended paths. Dashed lines also mark unresolved or historical relationships.</p></div>{graph}<p className={styles.mapMoveHint}>Drag cards to move them. Use Alt + arrow keys when a card has focus. Positions reset when you leave this view.</p>{selectedNode?.record_type === "option" ? <div className={styles.mapToolbar}><span role="status">Path details expanded below: {selectedNode.label}</span><button className="btn quiet" type="button" onClick={() => showDetails(pathDetails.current)}>Go to path details ↓</button></div> : null}<label className={styles.mapMoveHint}><input type="checkbox" checked={showHistory} onChange={event => setShowHistory(event.target.checked)} /> Show historical records</label><div aria-label="Focused graph controls" className={styles.mapToolbar}><button className="btn quiet" disabled={scale <= MIN_MANUAL_ZOOM} onClick={() => setScale((value) => Math.max(MIN_MANUAL_ZOOM, value - .1))} type="button">Zoom out</button><span aria-live="polite" className={styles.meta}>{Math.round(scale * 100)}%</span><button className="btn quiet" disabled={scale >= MAX_MANUAL_ZOOM} onClick={() => setScale((value) => Math.min(MAX_MANUAL_ZOOM, value + .1))} type="button">Zoom in</button><button className="btn quiet" onClick={fit} type="button">Fit this issue</button><button className="btn quiet" onClick={reset} type="button">Reset view</button></div></section></details>{selectedNodeDetails ? <section aria-label="Selected record support" className={`${styles.card} ${styles.selectedSupport}`}>{selectedNodeDetails}</section> : null}<details className={styles.card}><summary>All records for this issue</summary>{outline}</details></> : <><IssueOverview analyzingIssueId={analyzingIssueId} analysisResult={analysisResult} busy={busy} onAnalyze={onAnalyzePaths} snapshot={snapshot} onOpen={selectAndReveal} /><details className={styles.card}><summary>All saved records ({snapshot.nodes.length})</summary>{outline}</details></>}
    {scenarioPanel ? <section aria-label="Try a different assumption" className={styles.scenarioSurface}>{scenarioPanel}</section> : null}
  </section>;
}
