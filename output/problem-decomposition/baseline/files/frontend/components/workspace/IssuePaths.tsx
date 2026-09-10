"use client";

import { useEffect, useState } from "react";
import type { DecisionMapNode, IssueAnalysisStatus } from "@/lib/decisionMapTypes";
import styles from "./MatterMap.module.css";

export default function IssuePaths({ status, nodes, selectedNodeId, busy, onSelectNode, onAnalyze }: {
  status: IssueAnalysisStatus | null; nodes: DecisionMapNode[]; selectedNodeId: string | null;
  busy: boolean; onSelectNode: (id: string) => void; onAnalyze: () => void;
}) {
  const analysis = status?.analysis;
  const options = analysis?.options ?? [];
  const [openedOptionId, setOpenedOptionId] = useState<string | null>(null);
  const selected = options.find(option => nodes.some(node => node.node_id === selectedNodeId && node.record_type === "option" && node.record_id === option.option_id)) ?? options.find(option => option.option_id === openedOptionId);
  const selectedOptionId = options.find(option => nodes.some(node => node.node_id === selectedNodeId && node.record_type === "option" && node.record_id === option.option_id))?.option_id;
  useEffect(() => { if (selectedOptionId) setOpenedOptionId(selectedOptionId); }, [selectedOptionId]);
  const selectRecord = (type: string, id: string) => {
    const node = nodes.find(item => item.record_type === type && item.record_id === id && item.analysis_revision === analysis?.analysis_revision)
      ?? nodes.find(item => item.record_type === type && item.record_id === id);
    if (node) onSelectNode(node.node_id);
  };
  return <section className={styles.card} aria-label="Possible paths">
    <h2 className={styles.sectionTitle}>{selected ? "Expanded path" : "Path details"}</h2>
    <p>Select a path in the map to see its facts, consequences, and support here.</p>
    {busy ? <p role="status" className="state-label state-agent">Finding possible paths…</p> : null}
    {!options.length ? <div><p>{analysis ? "This analysis has no saved paths yet." : "No paths created yet. Analyze this issue to see the choices, facts that matter, and next consequences."}</p><button className="btn primary" disabled={busy} onClick={onAnalyze} type="button">{busy ? "Analyzing…" : "Analyze paths"}</button></div> : <>
      {selected ? <section className={styles.pathDependencies} aria-label="What this path depends on"><h3>{selected.title}</h3><h4>Next consequence</h4><p>{selected.consequence || "No next consequence saved."}</p>{selected.trade_off ? <><h4>Risk or trade-off</h4><p>{selected.trade_off}</p></> : null}<h4>Facts and conditions this path depends on</h4><p>{selected.condition_summary}</p>
        {selected.requirements.length ? <><p>{selected.combination === "any" ? "At least one of these conditions must hold." : "All of these conditions must hold."}</p>{selected.requirements.map(requirement => {
          const condition = analysis?.conditions.find(item => item.condition_id === requirement.condition_id);
          return <article key={requirement.condition_id} className={styles.pathCondition}><button className="btn quiet" type="button" onClick={() => selectRecord("condition", requirement.condition_id)}>{condition?.question ?? "Condition details unavailable"}</button><p><strong>Known state: {condition?.assessment.replace(/_/g, " ") ?? "unknown"}</strong> · This path requires: {requirement.state.replace(/_/g, " ")}</p><p>{condition?.assessment_basis || "The supporting facts have not been established."}</p>{condition?.fact_ids.map(id => { const fact = nodes.find(node => node.record_type === "fact" && node.record_id === id); return fact ? <button className="btn quiet" key={id} type="button" onClick={() => onSelectNode(fact.node_id)}>Fact: {fact.label}</button> : null; })}</article>;
        })}</> : <p>No conditions are recorded for this choice. This does not mean all facts are confirmed.</p>}
      </section> : <p className={styles.muted}>Click a path in the map, or open the comparison below.</p>}
      <details><summary>Compare all possible paths ({options.length})</summary>      <div className={styles.pathChoices}>
        {options.map(option => <button key={option.option_id} type="button" className={styles.pathChoice} aria-pressed={selected?.option_id === option.option_id} onClick={() => { setOpenedOptionId(option.option_id); selectRecord("option", option.option_id); }}>
          <span className={styles.meta}>{option.recommendation === "recommended" ? "Recommended by the agent" : "Possible choice"}</span>
          <strong>{option.title}</strong><span className={styles.meta}>Next consequence</span>
          <span>{option.consequence || "No next consequence saved."}</span>
          {option.trade_off ? <><span className={styles.meta}>Risk or trade-off</span><span>{option.trade_off}</span></> : null}
          <span className={styles.pathChoiceLink}>View facts and support →</span>
        </button>)}
      </div>
</details>
    </>}
  </section>;
}
